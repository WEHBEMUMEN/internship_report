import time
import subprocess
import json
import math
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
            print("Waiting for training sweep (checking window.app.isTrained)...")
            trained = False
            for _ in range(30): # up to 30 seconds
                time.sleep(1.0)
                trained = page.evaluate("() => window.app && window.app.isTrained")
                if trained:
                    print("Training completed!")
                    break
            
            if not trained:
                print("Warning: Training did not complete in time.")
            
            # Extract singular values
            data = page.evaluate("""() => {
                if (!window.app) return null;
                const snapshots = window.app.collector.snapshots;
                const basis = window.app.basis;
                // Let's get the singular values directly from PODEngine.computeBasis
                const podRes = window.PODEngine.computeBasis(snapshots, 27); // get all of them
                return {
                    singularValues: podRes.singularValues,
                    energy: podRes.energy
                };
            }""")
            
            if data and "singularValues" in data:
                s = data["singularValues"]
                print(f"Number of singular values: {len(s)}")
                print(f"Singular values: {s}")
                
                # Calculate total variance
                total_var = sum(si*si for si in s)
                cum_var = 0.0
                errors = []
                for i, si in enumerate(s):
                    cum_var += si*si
                    eta = cum_var / total_var
                    # L2 error = sqrt(1 - eta)
                    l2_err = math.sqrt(max(0.0, 1.0 - eta))
                    errors.append((i+1, si, eta, l2_err))
                    
                print("\n=== POD MODE STATS ===")
                print(f"{'Mode':<5} | {'Singular Value':<18} | {'Cum Energy':<12} | {'Rel L2 Error':<12}")
                print("-" * 60)
                for mode, val, eta, err in errors:
                    print(f"{mode:<5} | {val:<18.6f} | {eta:<12.6%} | {err:<12.6%}")
                print("======================\n")
            else:
                print("Error: Could not retrieve POD data from window.app")
            
            browser.close()
    finally:
        print("Stopping node server.js...")
        server.terminate()

if __name__ == "__main__":
    run()
