import time
import subprocess
import json
from playwright.sync_api import sync_playwright

def run():
    server = subprocess.Popen(["node", "server.js"], cwd="d:/Internship_report/visualizer")
    time.sleep(2)
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            url = "http://localhost:3000/app/simulations/iga-sim-5.3a/index.html"
            page.goto(url)
            time.sleep(1)
            
            # Click play
            play_btn = page.query_selector("#btn-play")
            if play_btn:
                play_btn.click()
                time.sleep(5)
                
            # Check Chart.js instances
            chart_data = page.evaluate("""() => {
                if (typeof Chart === 'undefined') return 'No Chart.js';
                const instances = Object.values(Chart.instances);
                if (instances.length === 0) return 'No Chart instances';
                
                const results = [];
                instances.forEach((chart, idx) => {
                    results.push({
                        id: chart.canvas.id,
                        labels: chart.data.labels,
                        datasets: chart.data.datasets.map(d => ({
                            label: d.label,
                            data: d.data
                        }))
                    });
                });
                return results;
            }""")
            
            print("\n=== DETECTED CHART DATA ===")
            print(json.dumps(chart_data, indent=2))
            print("===========================\n")
            
            browser.close()
    finally:
        server.terminate()

if __name__ == "__main__":
    run()
