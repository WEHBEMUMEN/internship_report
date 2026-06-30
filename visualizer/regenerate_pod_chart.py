import time
import subprocess
from playwright.sync_api import sync_playwright

def run():
    print("Starting node server.js...")
    server = subprocess.Popen(["node", "server.js"], cwd="d:/Internship_report/visualizer")
    time.sleep(3)
    
    try:
        with sync_playwright() as p:
            print("Launching browser...")
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            url = "http://localhost:3000/app/simulations/iga-sim-5.2/index.html"
            print(f"Opening: {url}")
            page.goto(url)
            time.sleep(2)
            
            # Click train button
            print("Clicking execute training sweep...")
            page.click("#btn-train")
            
            # Wait for training to complete
            print("Waiting for training sweep...")
            trained = False
            for _ in range(30):
                time.sleep(1.0)
                trained = page.evaluate("() => window.app && window.app.isTrained")
                if trained:
                    print("Training completed!")
                    break
            
            if not trained:
                print("Warning: Training did not complete in time.")
                
            # Click the tab to show the chart
            print("Clicking 'Reduction Audit' tab...")
            page.click("text=Reduction Audit")
            time.sleep(1.5) # Wait for chart to resize and render
            
            # Screenshot the chart
            chart_element = page.query_selector("#chart-energy")
            output_path = "d:/Internship_report/figures/pod_energy_decay.png"
            print(f"Saving screenshot to {output_path}...")
            chart_element.screenshot(path=output_path)
            print("Saved!")
            
            browser.close()
    finally:
        print("Stopping node server.js...")
        server.terminate()

if __name__ == "__main__":
    run()
