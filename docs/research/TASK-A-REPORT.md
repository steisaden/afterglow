STATUS: PASS
SUMMARY: Built a standalone premium maintained-lawn prototype with 18,000 tapered near blades, 4,500 crossed-quad mid/far blades beyond 8 m, one shared GPU wind field with two-octave desktop gust noise, per-blade healthy/dry color variation, live performance overlay, orbit/dolly inspection, and a reduced mobile path. Documented the technique, rejected alternatives, performance, and production integration guidance.
FILES CREATED:
- experiments/grass/index.html
- experiments/grass/grass.js
- experiments/grass/measure.mjs
- experiments/grass/desktop-1440x900.png
- experiments/grass/mobile-390x844.png
- docs/research/grass-system.md
- docs/research/TASK-A-REPORT.md
TESTS RUN:
- node --check experiments/grass/grass.js — PASS
- node --check experiments/grass/measure.mjs — PASS
- Local HTTP load in Google Chrome via Playwright — PASS, no page/console errors
- 1440×900 desktop warm-up + five sampled overlays — PASS, all samples 60.0 FPS
- 390×844 mobile fallback warm-up + five sampled overlays — PASS, 60.0–60.1 FPS
- Wind verification — PASS, shared windTime advanced from >2.5 s to >4.5 s while rendering both LOD tiers
METRICS: desktop 60.0 fps / 3 draw calls / 162,002 triangles; mobile 60.0–60.1 fps / 3 draw calls / 58,002 triangles
RISKS: Headless Chromium FPS is refresh-capped and does not establish the lawn's isolated ≤4 ms GPU share; confirm GPU timer/profile on target desktop and physical mobile hardware after integration. Final polygon masking against the irregular production lawn and hardscape exclusions remains production integration work.
RECOMMENDED NEXT STEP: Integrate the factory pattern into afterglow/js/world.js in a separate approved production task, scatter into lawn-polygon chunks with exclusion masks, then profile every authored camera shot at 1440×900 and on a physical mobile device before replacing the current turf field.
