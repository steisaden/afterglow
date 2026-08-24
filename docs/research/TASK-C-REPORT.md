STATUS: PARTIAL
SUMMARY: Built a self-contained Oklahoma rain/wetness prototype with one-draw GPU instanced streak quads, camera-relative cycling, wind slant, depth fade, analytic pergola rain shadow, dry covered stone, procedural low-area puddles, 0→1→0 ramp controls, three density tiers, and a live performance overlay. Functional browser automation passed without page or shader errors; the required ≥55 fps heavy-tier result could not be established because the available headless SwiftShader software renderer measured 0.97 fps and is not representative of desktop GPU performance.
FILES CREATED:
- experiments/weather/index.html
- experiments/weather/weather.js
- experiments/weather/server.mjs
- experiments/weather/verify.mjs
- docs/research/weather-system.md
- docs/research/TASK-C-REPORT.md
TESTS RUN:
- node --check experiments/weather/weather.js — PASS
- node --check experiments/weather/server.mjs — PASS
- npm test — PASS
- node experiments/weather/verify.mjs (Playwright Chromium, 1440×900, SwiftShader) — PASS: page rendered; no console/page/shader errors; heavy tier reported 24,000 streaks
METRICS:
- Headless SwiftShader heavy-tier sample: 0.97 fps, 24,000 streaks, 21 draw calls total scene, 48,218 triangles
- Tier budgets: desktop heavy 24,000; desktop light 12,000; mobile 5,500
- ≥55 fps desktop-heavy acceptance: NOT VERIFIED on hardware-accelerated desktop GPU
RISKS:
- Software-rendered headless FPS cannot validate production desktop GPU performance.
- The proxy uses one rectangular roof volume and an illustrative procedural puddle mask; complex production shelter geometry and drainage need authored bounds/masks.
- Extreme top-down camera angles may expose streak-quad flatness.
RECOMMENDED NEXT STEP: Open experiments/weather/index.html through a local server on a hardware-accelerated desktop browser, hold the heavy tier for at least 30 seconds, confirm ≥55 fps and the visibly dry shelter at both wind extremes, then profile with EXT_disjoint_timer_query_webgl2 before integrating a WeatherDirector.
