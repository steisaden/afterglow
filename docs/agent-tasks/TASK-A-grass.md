# HERMES TASK A — REALISTIC LAWN SYSTEM (research + prototype)

PROJECT: /Volumes/toshiba/Development/ds_threejs_ex  (Afterglow Three.js site lives in afterglow/)
GOAL: A standalone, runnable prototype of a premium maintained residential lawn + a research doc.

CONTEXT:
Afterglow is a cinematic scroll-driven Three.js backyard (golden hour → night).
The current lawn is a flat green plane with sparse dark blade instances — it reads fake.
This prototype decides the replacement technique. It must look like a photographed,
maintained Tulsa residential lawn: medium-dark healthy green, individual blade breakup,
subtle dry variation, believable scale. NOT golf turf, NOT neon, NOT cartoon tufts.

VISUAL CONTRACT (relevant):
- warm + premium + natural + believable; photographic, not game-like
- camera passes ~1.5–5 m above the lawn at grazing angles
- golden-hour key light, warm sky fill
- target: desktop 60 fps budget share ≤ 4 ms for the lawn; mobile must degrade gracefully

REQUIREMENTS:
1. Dense near-camera instanced blades (thousands), realistic blade width (~4–8 mm) and height (30–80 mm)
2. Mid/far LOD: cheaper geometry or textured cross-quads beyond ~8 m
3. ONE shared wind field (vertex-shader bend; gentle, low amplitude; gusts via 2-octave noise)
4. Color variation per blade (slight hue/value jitter, subtle dry patches)
5. Performance instrumentation overlay: FPS, draw calls, triangles
6. Mobile fallback path (fewer instances, simpler wind)
7. Self-contained page: experiments/grass/index.html + js — import three from ../../afterglow/vendor/three.module.min.js
8. NO modifications to afterglow/ production files

REFERENCES (study; do not copy assets):
- Search the web for: "three.js instanced grass wind shader", "grass blade vertex bending LOD",
  "real-time grass rendering technique" (e.g., Ghost of Tsushima GDC talk summaries)
- Local reference implementation exists in afterglow/js/world.js (grassInstances, turfFieldInstances)

FILES ALLOWED: experiments/grass/** , docs/research/grass-system.md
FILES FORBIDDEN: afterglow/** (read-only reference), docs/art-direction.md (read-only)

OUTPUT:
- experiments/grass/ (runnable)
- docs/research/grass-system.md: technique chosen + why, alternatives rejected,
  perf numbers (FPS/draw calls/triangles at 1440×900), integration notes for afterglow/js/world.js

TEST: open experiments/grass/index.html in a browser; verify ≥55 fps desktop with overlay; blades respond to wind.

STOP CONDITION: prototype runs, doc written, structured report returned.

RESULT CONTRACT (return at end):
STATUS: PASS|PARTIAL|FAIL
SUMMARY:
FILES CREATED:
TESTS RUN:
METRICS: fps / draw calls / triangles
RISKS:
RECOMMENDED NEXT STEP:
