/**
 * IGA Export Overlay — inject.js
 * ─────────────────────────────────────────────────────────────────
 * Injected into every simulation page by the local proxy server.
 *
 * Two responsibilities:
 *  1. EARLY: Patch THREE.WebGLRenderer to always set preserveDrawingBuffer:true
 *            (must run before any simulation script creates a renderer)
 *  2. LATE:  After DOM loads, inject a beautiful floating capture panel
 */

/* ═══════════════════════════════════════════════════════════════════
   PART 1 — THREE.js WebGLRenderer patch (runs immediately, before
             any simulation code — we intercept the moment THREE is
             assigned to window)
   ═══════════════════════════════════════════════════════════════════ */
(function patchWebGLAndThree() {
  'use strict';

  // 1. Force preserveDrawingBuffer globally by intercepting context creation
  try {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, attributes) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
        attributes = attributes || {};
        attributes.preserveDrawingBuffer = true;
        console.log(`[IGA Export] Forced preserveDrawingBuffer:true on ${type} context ✓`);
      }
      return originalGetContext.call(this, type, attributes);
    };
  } catch (e) {
    console.warn('[IGA Export] Failed to patch getContext globally:', e);
  }

  // 2. Intercept and patch THREE.WebGLRenderer for upscaling capability
  let _three;

  function applyThreePatch(THREE) {
    if (!THREE || !THREE.WebGLRenderer || THREE.__exportPatched) return;
    const Original = THREE.WebGLRenderer;

    class PatchedWebGLRenderer extends Original {
      constructor(params) {
        // Force preserveDrawingBuffer as secondary defense
        super(Object.assign({}, params, { preserveDrawingBuffer: true }));
        // Store renderer reference on the canvas for upscaling
        this.domElement.__igaRenderer = this;
      }
    }

    THREE.WebGLRenderer = PatchedWebGLRenderer;
    THREE.__exportPatched = true;
    console.log('[IGA Export] THREE.WebGLRenderer patched ✓ (preserveDrawingBuffer + hi-res)');
  }

  if (window.THREE) {
    applyThreePatch(window.THREE);
  } else {
    Object.defineProperty(window, 'THREE', {
      configurable: true,
      enumerable:   true,
      get() { return _three; },
      set(val) {
        _three = val;
        applyThreePatch(val);
        // Restore normal property after patching so nothing else breaks
        Object.defineProperty(window, 'THREE', {
          configurable: true,
          enumerable:   true,
          writable:     true,
          value:        val,
        });
      },
    });
  }
  window.__igaApplyThreePatch = applyThreePatch;
}());


/* ═══════════════════════════════════════════════════════════════════
   PART 2 — Floating capture panel (injected after DOM is ready)
   ═══════════════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ── Report figure names ─────────────────────────────────────────
  const FIGURES = [
    { value: 'nurbs_basis_curves.png',      label: 'NURBS Basis Curves'         },
    { value: 'iga_vs_fem_bending.png',      label: 'IGA vs FEM Bending'         },
    { value: 'pod_energy_decay.png',        label: 'POD Energy Decay'           },
    { value: 'bivariate_mesh_geometry.png', label: 'Bivariate Mesh Geometry'    },
    { value: 'knot_refinement_stages.png',  label: 'Knot Refinement Stages'     },
    { value: 'deim_node_selection.png',     label: 'DEIM Node Selection'        },
    { value: 'custom',                      label: '✏️  Custom filename…'        },
  ];

  // ── Styles ──────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #__iga-export-panel__ {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 280px;
      background: rgba(10, 15, 30, 0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(139, 92, 246, 0.4);
      border-radius: 20px;
      padding: 18px 20px 16px;
      z-index: 2147483647;
      font-family: 'Inter', 'Outfit', system-ui, sans-serif;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06);
      color: #f1f5f9;
      transition: opacity 0.3s ease, transform 0.3s ease;
      user-select: none;
    }
    #__iga-export-panel__.hidden {
      opacity: 0;
      transform: translateY(8px) scale(0.97);
      pointer-events: none;
    }
    #__iga-export-panel__ * { box-sizing: border-box; }

    #__iga-export-header__ {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    #__iga-export-title__ {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #a78bfa;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    #__iga-export-title__ span.dot {
      width: 7px; height: 7px;
      background: #10b981;
      border-radius: 50%;
      animation: __igaPulse__ 1.8s ease-in-out infinite;
    }
    @keyframes __igaPulse__ {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.8); }
    }
    #__iga-export-minimize__ {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #64748b;
      font-size: 1rem;
      line-height: 1;
      padding: 2px 6px;
      border-radius: 6px;
      transition: color 0.2s, background 0.2s;
    }
    #__iga-export-minimize__:hover { color: #f1f5f9; background: rgba(255,255,255,0.08); }

    #__iga-canvas-info__ {
      font-size: 0.62rem;
      color: #475569;
      margin-bottom: 10px;
      font-family: 'JetBrains Mono', 'Monaco', monospace;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 7px 10px;
      line-height: 1.6;
    }

    #__iga-select-wrap__ {
      margin-bottom: 10px;
    }
    #__iga-select-wrap__ label {
      display: block;
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      margin-bottom: 5px;
      font-weight: 600;
    }
    #__iga-fig-select__ {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(139,92,246,0.3);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 0.72rem;
      padding: 8px 10px;
      outline: none;
      cursor: pointer;
      transition: border-color 0.2s;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2394a3b8' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      padding-right: 28px;
    }
    #__iga-fig-select__:focus { border-color: rgba(139,92,246,0.7); }
    #__iga-fig-select__ option { background: #1e293b; color: #f1f5f9; }

    #__iga-custom-wrap__ {
      margin-bottom: 10px;
      display: none;
    }
    #__iga-custom-wrap__.visible { display: block; }
    #__iga-custom-input__ {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(99,102,241,0.4);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 0.72rem;
      padding: 8px 10px;
      outline: none;
      transition: border-color 0.2s;
    }
    #__iga-custom-input__:focus { border-color: rgba(99,102,241,0.8); }
    #__iga-custom-input__::placeholder { color: #475569; }

    #__iga-btn-capture__ {
      width: 100%;
      padding: 11px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #fff;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 18px rgba(124,58,237,0.45);
      transition: all 0.2s;
      margin-bottom: 8px;
    }
    #__iga-btn-capture__:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(124,58,237,0.6); }
    #__iga-btn-capture__:active { transform: translateY(0); }
    #__iga-btn-capture__:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    #__iga-btn-download__ {
      width: 100%;
      padding: 9px;
      border: 1px solid rgba(16,185,129,0.35);
      border-radius: 12px;
      background: rgba(16,185,129,0.08);
      color: #10b981;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
    }
    #__iga-btn-download__:hover { background: rgba(16,185,129,0.18); }
    #__iga-btn-download__:disabled { opacity: 0.3; cursor: not-allowed; }

    #__iga-toast__ {
      position: fixed;
      bottom: 90px;
      right: 24px;
      padding: 11px 18px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #fff;
      z-index: 2147483648;
      pointer-events: none;
      opacity: 0;
      transform: translateY(6px);
      transition: opacity 0.3s, transform 0.3s;
      max-width: 300px;
      font-family: 'Inter', system-ui, sans-serif;
    }
    #__iga-toast__.show {
      opacity: 1;
      transform: translateY(0);
    }
    #__iga-toast__.success { background: linear-gradient(135deg, #059669, #10b981); box-shadow: 0 8px 24px rgba(16,185,129,0.4); }
    #__iga-toast__.error   { background: linear-gradient(135deg, #dc2626, #ef4444); box-shadow: 0 8px 24px rgba(239,68,68,0.4); }

    #__iga-status-bar__ {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .iga-stat {
      text-align: center;
      flex: 1;
    }
    .iga-stat .val {
      font-size: 0.78rem;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      color: #e2e8f0;
    }
    .iga-stat .lbl {
      font-size: 0.55rem;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    /* Toggle pill to re-open panel */
    #__iga-toggle-pill__ {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #fff;
      border: none;
      border-radius: 50px;
      padding: 10px 18px;
      font-size: 0.72rem;
      font-weight: 700;
      cursor: pointer;
      z-index: 2147483647;
      box-shadow: 0 4px 18px rgba(124,58,237,0.5);
      display: none;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    #__iga-toggle-pill__:hover { transform: translateY(-1px); }
  `;
  document.head.appendChild(style);

  // ── Extra styles for quality selector ───────────────────────────
  const style2 = document.createElement('style');
  style2.textContent = `
    #__iga-quality-wrap__ {
      margin-bottom: 10px;
    }
    #__iga-quality-wrap__ label {
      display: block;
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      margin-bottom: 5px;
      font-weight: 600;
    }
    .iga-quality-btns {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
    }
    .iga-q-btn {
      padding: 6px 0;
      border-radius: 8px;
      font-size: 0.68rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid rgba(255,255,255,0.1);
      color: #94a3b8;
      background: rgba(255,255,255,0.04);
      transition: all 0.15s;
      font-family: 'JetBrains Mono', monospace;
      text-align: center;
    }
    .iga-q-btn:hover { background: rgba(255,255,255,0.1); color: #e2e8f0; }
    .iga-q-btn.active {
      border-color: rgba(139,92,246,0.7);
      color: #a78bfa;
      background: rgba(139,92,246,0.15);
      box-shadow: 0 0 10px rgba(139,92,246,0.2);
    }
    #__iga-output-size__ {
      font-size: 0.58rem;
      color: #475569;
      margin-top: 5px;
      font-family: 'JetBrains Mono', monospace;
      text-align: center;
    }
  `;
  document.head.appendChild(style2);

  // ── Build panel HTML ────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.id = '__iga-export-panel__';
  panel.innerHTML = `
    <div id="__iga-export-header__">
      <div id="__iga-export-title__">
        <span class="dot"></span>
        IGA Export
      </div>
      <button id="__iga-export-minimize__" title="Minimize">─</button>
    </div>

    <div id="__iga-canvas-info__">Scanning for canvas…</div>

    <div id="__iga-quality-wrap__">
      <label>Output quality</label>
      <div class="iga-quality-btns">
        <button class="iga-q-btn" data-scale="1">1×</button>
        <button class="iga-q-btn active" data-scale="2">2×</button>
        <button class="iga-q-btn" data-scale="3">3×</button>
        <button class="iga-q-btn" data-scale="4">4×</button>
      </div>
      <div id="__iga-output-size__">calculating…</div>
    </div>

    <div id="__iga-select-wrap__">
      <label>Save as report figure</label>
      <select id="__iga-fig-select__">
        ${FIGURES.map(f => `<option value="${f.value}">${f.label}</option>`).join('')}
      </select>
    </div>

    <div id="__iga-custom-wrap__">
      <input id="__iga-custom-input__" type="text" placeholder="my_figure.png" spellcheck="false">
    </div>

    <button id="__iga-btn-capture__">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
      Capture & Save to Report
    </button>

    <button id="__iga-btn-download__" disabled>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Download locally instead
    </button>

    <div id="__iga-status-bar__">
      <div class="iga-stat">
        <div class="val" id="__iga-stat-w__">—</div>
        <div class="lbl">Width px</div>
      </div>
      <div class="iga-stat">
        <div class="val" id="__iga-stat-h__">—</div>
        <div class="lbl">Height px</div>
      </div>
      <div class="iga-stat">
        <div class="val" id="__iga-stat-type__">—</div>
        <div class="lbl">Renderer</div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // Toast notification element
  const toast = document.createElement('div');
  toast.id = '__iga-toast__';
  document.body.appendChild(toast);

  // Re-open pill
  const pill = document.createElement('button');
  pill.id = '__iga-toggle-pill__';
  pill.innerHTML = '📸 Export';
  document.body.appendChild(pill);

  // ── State ────────────────────────────────────────────────────────
  let activeCanvas = null;
  let lastDataURL  = null;
  let captureCount = 0;
  let currentScale = 2;  // default to 2× for publication quality

  // ── Quality selector ─────────────────────────────────────────────
  function updateOutputSizeLabel() {
    if (!activeCanvas) return;
    const w = Math.round(activeCanvas.width * currentScale);
    const h = Math.round(activeCanvas.height * currentScale);
    const dpi = Math.round(72 * currentScale); // base screen DPI ≈ 72-96
    document.getElementById('__iga-output-size__').textContent =
      `${w} × ${h} px  (~${dpi} DPI)`;
  }

  document.querySelectorAll('.iga-q-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.iga-q-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScale = parseFloat(btn.dataset.scale);
      updateOutputSizeLabel();
    });
  });

  // ── Canvas detection ─────────────────────────────────────────────
  // IMPORTANT: never call canvas.getContext() here — acquiring a context
  // (even just to inspect it) locks the canvas to that context type.
  // Calling getContext('webgl') on a 2D canvas means getContext('2d')
  // will return null, crashing any simulation that uses a 2D canvas.
  function detectCanvas() {
    if (window.THREE && !window.THREE.__exportPatched && typeof window.__igaApplyThreePatch === 'function') {
      window.__igaApplyThreePatch(window.THREE);
    }
    const info = document.getElementById('__iga-canvas-info__');

    // Priority 1: Three.js renderer canvas inside #canvas-container
    const container = document.getElementById('canvas-container');
    if (container) {
      const c = container.querySelector('canvas');
      if (c && c.width > 0 && c.height > 0) {
        activeCanvas = c;
        // Infer type from the page: if THREE is defined, it's WebGL
        const type = window.THREE ? 'WebGL' : 'Canvas';
        info.innerHTML = `<b style="color:#10b981">✓ ${type} (Three.js)</b><br>${c.width} × ${c.height} px`;
        document.getElementById('__iga-stat-w__').textContent    = c.width;
        document.getElementById('__iga-stat-h__').textContent    = c.height;
        document.getElementById('__iga-stat-type__').textContent = type;
        return true;
      }
    }

    // Priority 2: Largest canvas on the page — filter out known UI/chart canvases
    const EXCLUDE_IDS = new Set([
      'sparkline-canvas', 'chart-speedup', 'chart-fd', 'chart-error', 'chart-residual'
    ]);
    const all = Array.from(document.querySelectorAll('canvas'))
      .filter(c => !EXCLUDE_IDS.has(c.id) && c.width > 0 && c.height > 0);

    if (all.length > 0) {
      const largest = all.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
      activeCanvas = largest;
      // Detect type safely: check if the canvas already has a context handle
      // via the internal __three_renderer marker (set by Three.js), otherwise assume 2D
      const type = (window.THREE && largest.__three_renderer) ? 'WebGL' : 'Canvas';
      info.innerHTML = `<b style="color:#10b981">✓ ${type}</b><br>${largest.width} × ${largest.height} px`;
      document.getElementById('__iga-stat-w__').textContent    = largest.width;
      document.getElementById('__iga-stat-h__').textContent    = largest.height;
      document.getElementById('__iga-stat-type__').textContent = type;
      return true;
    }

    info.innerHTML = `<span style="color:#f59e0b">⚠ No main canvas found yet</span><br>Try after the simulation loads`;
    return false;
  }

  // Re-scan every 2s until a canvas is found, then stop
  let scanInterval = setInterval(() => {
    if (detectCanvas()) clearInterval(scanInterval);
  }, 2000);
  // Initial scan after a short delay so simulation scripts run first
  setTimeout(detectCanvas, 300);

  // ── Helper: show toast ────────────────────────────────────────────
  function showToast(msg, type = 'success') {
    toast.textContent = msg;
    toast.className   = `show ${type}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.className = type; }, 3000);
  }

  // ── Get selected filename ─────────────────────────────────────────
  function getFilename() {
    const sel = document.getElementById('__iga-fig-select__').value;
    if (sel === 'custom') {
      const v = document.getElementById('__iga-custom-input__').value.trim();
      return v || 'capture.png';
    }
    return sel;
  }

  // ── Hi-res capture ────────────────────────────────────────────────
  // For Three.js canvases: temporarily scale the renderer buffer up,
  // wait two frames for the animation loop to re-render, then capture.
  // The resize is invisible to the user (CSS size stays fixed).
  // For 2D canvases: copies to an offscreen canvas scaled up.
  async function captureHiRes(scale) {
    detectCanvas();
    if (!activeCanvas) {
      showToast('❌ No canvas found — wait for simulation to load', 'error');
      return null;
    }

    const canvas   = activeCanvas;
    const renderer = canvas.__igaRenderer; // set by our THREE patch

    try {
      let dataURL;

      if (renderer && scale > 1) {
        // ── Three.js path: upscale the render buffer ──────────────
        const origW = canvas.width;
        const origH = canvas.height;
        const newW  = Math.round(origW * scale);
        const newH  = Math.round(origH * scale);

        // Resize without touching CSS layout (updateStyle = false)
        renderer.setSize(newW, newH, false);

        // Wait 2 frames: simulation's own rAF loop will re-render at new size
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

        dataURL = canvas.toDataURL('image/png');

        // Restore original size
        renderer.setSize(origW, origH, false);
        await new Promise(r => requestAnimationFrame(r));

      } else if (scale > 1) {
        // ── 2D canvas path: draw into a larger offscreen canvas ───
        const offscreen = document.createElement('canvas');
        offscreen.width  = Math.round(canvas.width  * scale);
        offscreen.height = Math.round(canvas.height * scale);
        const ctx = offscreen.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(scale, scale);
        ctx.drawImage(canvas, 0, 0);
        dataURL = offscreen.toDataURL('image/png');

      } else {
        // ── 1× direct capture ─────────────────────────────────────
        dataURL = canvas.toDataURL('image/png');
      }

      // Detect blank frame (preserveDrawingBuffer missed)
      if (dataURL.length < 200) {
        showToast('⚠ Canvas appears blank — reload and try again', 'error');
        return null;
      }

      lastDataURL = dataURL;
      captureCount++;
      document.getElementById('__iga-btn-download__').disabled = false;
      return dataURL;

    } catch (e) {
      showToast('❌ Capture failed: ' + e.message, 'error');
      return null;
    }
  }

  // ── Capture & Save to report dir ─────────────────────────────────
  document.getElementById('__iga-btn-capture__').addEventListener('click', async () => {
    const btn = document.getElementById('__iga-btn-capture__');
    btn.disabled = true;

    const scale = currentScale;
    const wOut  = activeCanvas ? Math.round(activeCanvas.width  * scale) : '?';
    const hOut  = activeCanvas ? Math.round(activeCanvas.height * scale) : '?';
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Rendering ${scale}× (${wOut}×${hOut})…`;

    const dataURL = await captureHiRes(scale);
    if (!dataURL) {
      btn.disabled = false;
      btn.innerHTML = '📸 Capture & Save to Report';
      return;
    }

    const filename = getFilename();

    try {
      const response = await fetch('/__overlay__/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataURL, filename }),
      });

      const result = await response.json();
      if (result.success) {
        showToast(`✓ Saved → ${filename}`, 'success');
      } else {
        showToast('❌ Server error: ' + result.error, 'error');
      }
    } catch (e) {
      showToast('❌ Could not reach server: ' + e.message, 'error');
    }

    btn.disabled = false;
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
      Capture & Save to Report`;
  });

  // ── Download locally ──────────────────────────────────────────────
  document.getElementById('__iga-btn-download__').addEventListener('click', () => {
    if (!lastDataURL) return;
    const link = document.createElement('a');
    link.download = getFilename();
    link.href = lastDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`↓ Downloaded: ${getFilename()}`, 'success');
  });

  // ── Custom filename toggle ────────────────────────────────────────
  document.getElementById('__iga-fig-select__').addEventListener('change', function () {
    const wrap = document.getElementById('__iga-custom-wrap__');
    wrap.classList.toggle('visible', this.value === 'custom');
  });

  // ── Minimize / restore ────────────────────────────────────────────
  document.getElementById('__iga-export-minimize__').addEventListener('click', () => {
    panel.classList.add('hidden');
    pill.style.display = 'flex';
    setTimeout(() => { panel.style.display = 'none'; }, 310);
  });
  pill.addEventListener('click', () => {
    panel.style.display = '';
    pill.style.display  = 'none';
    requestAnimationFrame(() => panel.classList.remove('hidden'));
  });
});
