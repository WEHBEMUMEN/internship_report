/**
 * IGA Export Server
 * ─────────────────────────────────────────────────────────────────
 * A local proxy that serves the CNAM Internship simulation app and
 * injects an export overlay into every page — zero changes to source.
 *
 * Saves captured PNGs to D:\Internship_report\figures\
 *
 * Usage:  node server.js
 *         then open http://localhost:3000
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app = express();

// ── Configuration ──────────────────────────────────────────────────
const SIM_ROOT   = path.resolve('D:/CNAM internship');            // your app
const FIGURES_DIR = path.resolve('D:/Internship_report/figures'); // dedicated output folder
const PORT       = 3000;

// Auto-create the figures output directory if it doesn't exist
if (!fs.existsSync(FIGURES_DIR)) {
  fs.mkdirSync(FIGURES_DIR, { recursive: true });
  console.log(`[INIT] Created figures directory: ${FIGURES_DIR}`);
}

app.use(express.json({ limit: '100mb' }));

// ── Serve the inject script itself ─────────────────────────────────
app.get('/__overlay__/inject.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'inject.js'));
});

// ── Save figure endpoint ───────────────────────────────────────────
app.post('/__overlay__/save', (req, res) => {
  const { dataURL, filename } = req.body;

  if (!dataURL || !filename) {
    return res.status(400).json({ error: 'dataURL and filename are required' });
  }

  // Strip the data: URI prefix
  const base64 = dataURL.replace(/^data:image\/png;base64,/, '');

  // Only allow safe filenames (no path traversal)
  const safe = path.basename(filename).replace(/[^a-z0-9_\-\.]/gi, '_');
  const outPath = path.join(FIGURES_DIR, safe);

  fs.writeFile(outPath, base64, 'base64', (err) => {
    if (err) {
      console.error('[SAVE ERROR]', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`[SAVED] ${outPath}`);
    res.json({ success: true, path: outPath, filename: safe });
  });
});

// ── List figures currently saved in the output folder ─────────────
app.get('/__overlay__/figures', (req, res) => {
  const EXPECTED = [
    'nurbs_basis_curves.png',
    'iga_vs_fem_bending.png',
    'pod_energy_decay.png',
    'bivariate_mesh_geometry.png',
    'knot_refinement_stages.png',
    'deim_node_selection.png',
  ];

  const status = EXPECTED.map(f => {
    const p = path.join(FIGURES_DIR, f);
    let size = null;
    try { size = fs.statSync(p).size; } catch {}
    return { filename: f, saved: size !== null, size };
  });

  res.json(status);
});

// ── Main proxy: serve simulation files, inject into HTML ───────────
app.use((req, res, next) => {
  // Resolve file path inside the simulation directory
  let filePath = path.join(SIM_ROOT, decodeURIComponent(req.path));

  // Directory → try index.html
  try {
    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch { /* file doesn't exist — will 404 */ }

  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.html') {
    // Read HTML and inject our overlay script right after <head>
    fs.readFile(filePath, 'utf8', (err, html) => {
      if (err) return res.status(404).send('Not found: ' + filePath);

      const tag = `<script src="/__overlay__/inject.js" data-export-overlay="true"></script>`;

      let injected = html;
      if (html.includes('<head>')) {
        injected = html.replace('<head>', `<head>\n  ${tag}`);
      } else if (html.includes('<head ')) {
        injected = html.replace(/<head([^>]*)>/, `<head$1>\n  ${tag}`);
      } else {
        injected = tag + '\n' + html;
      }

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(injected);
    });

  } else {
    // ── All non-HTML assets: use res.sendFile (Express sets MIME automatically) ──
    res.sendFile(filePath, (err) => {
      if (err && !res.headersSent) {
        res.status(404).send('Not found: ' + req.path);
      }
    });
  }
});

// ── Start ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ┌─────────────────────────────────────────────────┐');
  console.log('  │   🎯 IGA Export Server                          │');
  console.log(`  │   Open → http://localhost:${PORT}                 │`);
  console.log('  ├─────────────────────────────────────────────────┤');
  console.log(`  │   App    : D:\\CNAM internship                   │`);
  console.log(`  │   Figures: D:\\Internship_report\\figures\\        │`);
  console.log('  └─────────────────────────────────────────────────┘');
  console.log('');
});
