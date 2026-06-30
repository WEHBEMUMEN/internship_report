const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('[AUTOMATION] Checking if puppeteer is installed...');
  try {
    require.resolve('puppeteer');
  } catch (e) {
    console.log('[AUTOMATION] Installing puppeteer...');
    await new Promise((resolve, reject) => {
      const npm = spawn('cmd.exe', ['/c', 'npm install puppeteer --no-save'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
      npm.on('close', code => code === 0 ? resolve() : reject(new Error('npm install failed')));
    });
  }

  const puppeteer = require('puppeteer');

  console.log('[AUTOMATION] Starting server.js...');
  const server = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'pipe'
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('[AUTOMATION] Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    console.log('[AUTOMATION] Navigating to simulation page...');
    await page.goto('http://localhost:3000/app/simulations/iga-sim-5.3/index.html', {
      waitUntil: 'networkidle2'
    });

    console.log('[AUTOMATION] Running simulation steps and extracting deflection data...');
    const simulationData = await page.evaluate(async () => {
      const btnStep = document.getElementById('btn-step');
      if (!btnStep) {
        return { error: 'btn-step not found' };
      }

      const dataPoints = [];
      
      // Run for 50 steps to get a good curve
      for (let i = 0; i < 50; i++) {
        btnStep.click();
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      // Retrieve Chart.js data
      const chartInstance = Object.values(Chart.instances)[0];
      if (chartInstance) {
        const labels = chartInstance.data.labels;
        const naiveData = chartInstance.data.datasets[0].data;
        const mappedData = chartInstance.data.datasets[1].data;
        for (let k = 0; k < labels.length; k++) {
          dataPoints.push({
            time: parseFloat(labels[k]),
            naive: parseFloat(naiveData[k]),
            mapped: parseFloat(mappedData[k])
          });
        }
      } else {
        return { error: 'Chart instance not found' };
      }

      return dataPoints;
    });

    console.log('\n=== DATA START ===');
    console.log(JSON.stringify(simulationData, null, 2));
    console.log('=== DATA END ===\n');

  } catch (error) {
    console.error('[AUTOMATION] Failed:', error);
  } finally {
    console.log('[AUTOMATION] Cleaning up...');
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

run();
