import time
import subprocess
import json
from playwright.sync_api import sync_playwright

def run():
    print("Starting node server.js...")
    server = subprocess.Popen(["node", "server.js"], cwd="d:/Internship_report/visualizer")
    time.sleep(2)
    
    try:
        with sync_playwright() as p:
            print("Launching browser...")
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            url = "http://localhost:3000/app/simulations/iga-sim-5.3/index.html"
            print(f"Opening: {url}")
            page.goto(url)
            time.sleep(1)
            
            print("Running simulation and measuring average FPS...")
            # Click play
            page.click("#btn-play")
            # Wait 5 seconds for the simulation to run and calculate FPS
            time.sleep(5.0)
            
            fps = page.evaluate("() => document.getElementById('stat-fps')?.innerText || '0'")
            print(f"\n=== MEASURED FPS: {fps} ===\n")
            
            data = page.evaluate("""() => {
                const chartInstance = Object.values(Chart.instances)[0];
                if (chartInstance) {
                    const labels = chartInstance.data.labels;
                    const naiveData = chartInstance.data.datasets[0].data;
                    const mappedData = chartInstance.data.datasets[1].data;
                    const pts = [];
                    for (let k = 0; k < labels.length; k++) {
                        pts.push({
                            time: parseFloat(labels[k]),
                            naive: parseFloat(naiveData[k]),
                            mapped: parseFloat(mappedData[k])
                        });
                    }
                    return pts;
                }
                return null;
            }""")
            
            print("\n=== DATA START ===")
            print(json.dumps(data, indent=2))
            print("=== DATA END ===\n")
            
            browser.close()
    finally:
        print("Stopping node server.js...")
        server.terminate()

if __name__ == "__main__":
    run()
