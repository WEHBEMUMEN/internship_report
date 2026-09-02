import time
import subprocess
import json
from playwright.sync_api import sync_playwright

def run():
    print("Starting node server.js...")
    server = subprocess.Popen(["node", "server.js"], cwd="c:/Users/Wehbe/Documents/internship-report/internship_report/visualizer")
    time.sleep(3)
    
    try:
        with sync_playwright() as p:
            print("Launching browser...")
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.on("console", lambda msg: print(f"Browser Console: {msg.text.encode('ascii', errors='replace').decode('ascii')}"))
            page.on("pageerror", lambda err: print(f"Browser Page Error: {err.message.encode('ascii', errors='replace').decode('ascii')}"))
            
            url = "http://localhost:3000/app/simulations/iga-sim-5.3/index.html"
            print(f"Opening: {url}")
            page.goto(url)
            time.sleep(2)
            
            print("Evaluating mesh convergence study in browser console...")
            results = page.evaluate("""() => {
                const results = [];
                // We use a flat beam for mesh convergence validation under static load
                const L = 10.0;
                const H = 2.0;
                const E = 200000;
                const nu = 0.3;
                const thick = 1.0;
                
                // Load factory and solver
                const factory = window.GeometryFactory;
                const engine = new window.NURBS2D();
                
                // Let's run convergence for h = 0, 1, 2, 3
                for (let h = 0; h <= 3; h++) {
                    const flatPatch = factory.generateNotchedBeam(L, H, 5.0, 0.0); // flat beam
                    const patch = factory.refine(flatPatch, h, 0); // h-refinement
                    
                    const solver = new window.IGA2DSolver(engine);
                    solver.E = E;
                    solver.nu = nu;
                    solver.thickness = thick;
                    
                    // Assemble stiffness
                    const K = solver.assembleStiffness(patch);
                    solver.applyPenaltyConstraints(K, patch);
                    
                    // Tip shear load
                    const nU = patch.controlPoints.length;
                    const nV = patch.controlPoints[0].length;
                    const nDofs = nU * nV * 2;
                    const F = new Float64Array(nDofs);
                    
                    // Tip force in vertical (Y) direction on the right boundary
                    const totalForce = -150.0;
                    for (let j = 0; j < nV; j++) {
                        const idx = ((nU - 1) * nV + j) * 2 + 1;
                        F[idx] = totalForce / nV;
                    }
                    
                    const u = solver.gaussianElimination(K, F);
                    
                    // Extract displacement at the tip center
                    const tipCenterJ = Math.floor(nV / 2);
                    const tipIdx = ((nU - 1) * nV + tipCenterJ) * 2 + 1;
                    const disp = u[tipIdx];
                    
                    // Calculate elements
                    const elementsX = patch.U.length - 2 * (patch.p + 1) + 1; // unique spans
                    const elementsY = patch.V.length - 2 * (patch.q + 1) + 1;
                    
                    results.push({
                        hLevel: h,
                        nx: nU,
                        ny: nV,
                        dofs: nDofs,
                        displacement: disp,
                        elements: (patch.U.slice(1, -1).filter((v, i, a) => a.indexOf(v) === i).length) * 
                                  (patch.V.slice(1, -1).filter((v, i, a) => a.indexOf(v) === i).length)
                    });
                }
                return results;
            }""")
            
            print("\n=== CONVERGENCE RESULTS ===")
            print(json.dumps(results, indent=2))
            print("===========================\n")
            
            browser.close()
    finally:
        print("Stopping node server.js...")
        server.terminate()

if __name__ == "__main__":
    run()
