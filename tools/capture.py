#!/usr/local/bin/python3.14
"""AFTERGLOW capture harness — desktop + mobile chapter screenshots."""
import sys, json, time
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:4201/index.html"
OUT  = "/Volumes/toshiba/Development/ds_threejs_ex/shots"

def anchor_y(page, i):
    """Mirror dom.js anchor math for chapter i."""
    return page.evaluate("""(i) => {
      const secs = [...document.querySelectorAll('[data-cam]')];
      const vh = innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      if (i === 0) return 0;
      if (i === secs.length - 1) return Math.min(secs[i].offsetTop - vh*.38, max);
      return Math.min(Math.max(secs[i].offsetTop + secs[i].offsetHeight*.5 - vh*.5, 0), max);
    }""", i)

def capture(page, label, chapter):
    y = anchor_y(page, chapter)
    page.evaluate("(y)=>window.scrollTo(0,y)", y)
    page.wait_for_timeout(1900)          # camera damping settle
    page.screenshot(path=f"{OUT}/{label}.png")
    print(f"  ✓ {label} @y={y}")

def run(width, height, mobile, tag):
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path="/Users/steisaden/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-x64/chrome-headless-shell", args=["--use-angle=metal","--enable-unsafe-webgpu"])
        ctx = browser.new_context(viewport={"width":width,"height":height},
                                  device_scale_factor=1,
                                  is_mobile=mobile, has_touch=mobile)
        page = ctx.new_page()
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type=="error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(3200)      # intro dolly completes

        if mobile:
            plan = [("m-hero",0), ("m-structure",1), ("m-gather",2),
                    ("m-weather",3), ("m-final",4)]
        else:
            plan = [("d-hero",0), ("d-structure",1), ("d-gather",2),
                    ("d-weather-storm",3), ("d-afterglow",4)]
        for label, ch in plan:
            capture(page, f"{tag}-{label}", ch)

        # fps sample via window-stored counter
        page.evaluate("""() => { let n=0; const t0=performance.now();
          const tick=()=>{n++; if(performance.now()-t0<2000) requestAnimationFrame(tick);
            else window.__fps=Math.round(n/2);};
          requestAnimationFrame(tick); }""")
        page.wait_for_timeout(2300)
        fps = page.evaluate("window.__fps || -1")
        print(f"  ≈ {fps} fps sampled")
        if errors: print("  ERRORS:", json.dumps(errors[:8], indent=2))
        browser.close()

if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv)>1 else "both"
    if which in ("desktop","both"): run(1440, 900, False, "p1"); print("desktop done")
    if which in ("mobile","both"):  run(390, 844, True, "p1");  print("mobile done")
