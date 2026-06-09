import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        url = "http://localhost:3000/app/simulations/iga-sim-5.2/index.html"
        print(f"Opening: {url}")
        page.goto(url)
        
        # Wait for the canvas to be detected and loaded
        time.sleep(4)
        
        # Configure select option to custom filename
        print("Selecting custom filename...")
        page.select_option("#__iga-fig-select__", "custom")
        page.fill("#__iga-custom-input__", "defect_static_simulation.png")
        
        # Click the capture button
        print("Clicking capture button...")
        page.click("#__iga-btn-capture__")
        
        # Wait for capture and save to complete
        time.sleep(5)
        
        print("Capture complete!")
        browser.close()

if __name__ == "__main__":
    run()
