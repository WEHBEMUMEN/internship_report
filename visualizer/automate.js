/**
 * IGA Export Automation Script
 * ─────────────────────────────────────────────────────────────────
 * Starts the local proxy server, launches a headless browser,
 * navigates to the DEIM simulation, trains DEIM, configures the view,
 * and captures the 'deim_node_selection.png' plot.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function run() {
  // 1. Install puppeteer if not present
  console.log('[AUTOMATION] Checking if puppeteer is installed...');
  try {
    require.resolve('puppeteer');
    console.log('[AUTOMATION] Puppeteer is already installed.');
  } catch (e) {
    console.log('[AUTOMATION] Installing puppeteer. Please wait...');
    await new Promise((resolve, reject) => {
      const npm = spawn('cmd.exe', ['/c', 'npm install puppeteer --no-save'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
      npm.on('close', code => code === 0 ? resolve() : reject(new Error('npm install failed')));
    });
  }

  const puppeteer = require('puppeteer');

  // 2. Start the Express server as a child process
  console.log('[AUTOMATION] Starting server.js...');
  const server = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'pipe'
  });

  server.stdout.on('data', (data) => {
    console.log(`[SERVER] ${data.toString().trim()}`);
  });

  server.stderr.on('data', (data) => {
    console.error(`[SERVER ERROR] ${data.toString().trim()}`);
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('[AUTOMATION] Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // Set a large viewport for high-quality capture
    await page.setViewport({ width: 1600, height: 1000 });

    console.log('[AUTOMATION] Navigating to DEIM simulation page...');
    await page.goto('http://localhost:3000/app/simulations/iga-sim-3.4a/index.html', {
      waitUntil: 'networkidle2'
    });

    console.log('[AUTOMATION] Clicking "Train DEIM" button...');
    await page.click('#btn-train');

    console.log('[AUTOMATION] Waiting for DEIM training to finish (5 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('[AUTOMATION] Selecting DEIM method to display nodes on canvas...');
    await page.evaluate(() => {
      // Click the DEIM button
      const deimBtn = document.querySelector('button[data-method="deim"]');
      if (deimBtn) deimBtn.click();
      
      // Make sure show DOFs checkbox is checked
      const dofsCheckbox = document.getElementById('input-show-dofs');
      if (dofsCheckbox) {
        dofsCheckbox.checked = true;
        dofsCheckbox.dispatchEvent(new Event('change'));
      }
    });

    // Wait a brief moment for render to refresh
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('[AUTOMATION] Selecting "deim_node_selection.png" as the target figure...');
    await page.select('#__iga-fig-select__', 'deim_node_selection.png');

    console.log('[AUTOMATION] Triggering the capture & save action...');
    await page.click('#__iga-btn-capture__');

    console.log('[AUTOMATION] Waiting for file write to complete (3 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verify file exists
    const expectedPath = path.resolve(__dirname, '../figures/deim_node_selection.png');
    if (fs.existsSync(expectedPath)) {
      console.log(`[AUTOMATION] SUCCESS! Figure generated at: ${expectedPath}`);
    } else {
      console.error('[AUTOMATION] ERROR: Figure file was not found.');
    }

  } catch (error) {
    console.error('[AUTOMATION] Automation failed:', error);
  } finally {
    console.log('[AUTOMATION] Cleaning up...');
    await browser.close();
    server.kill();
    console.log('[AUTOMATION] Done.');
    process.exit(0);
  }
}

run();
