import time
import subprocess
from playwright.sync_api import sync_playwright

def run():
    server = subprocess.Popen(["node", "server.js"], cwd="d:/Internship_report/visualizer")
    time.sleep(2)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto("http://localhost:3000/app/simulations/iga-sim-5.3/index.html")
            time.sleep(1)
            keys = page.evaluate("() => Object.keys(window.app || {})")
            print("window.app keys:", keys)
            if "solver" in keys:
                solver_keys = page.evaluate("() => Object.keys(window.app.solver || {})")
                print("window.app.solver keys:", solver_keys)
                mesh_info = page.evaluate("""() => {
                    if (!window.app.solver) return null;
                    return {
                        nx: window.app.solver.nx || (window.app.solver.mesh && window.app.solver.mesh.nx),
                        ny: window.app.solver.ny || (window.app.solver.mesh && window.app.solver.mesh.ny),
                        dofs: window.app.solver.numDofs || (window.app.solver.dofs && window.app.solver.dofs.length)
                    };
                }""")
                print("Mesh Info:", mesh_info)
            browser.close()
    finally:
        server.terminate()

if __name__ == "__main__":
    run()
