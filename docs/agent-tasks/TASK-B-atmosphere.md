# HERMES TASK B — SKY / CLOUD / DAY-NIGHT SYSTEM (research + prototype)

PROJECT: /Volumes/toshiba/Development/ds_threejs_ex  (Afterglow site in afterglow/)
GOAL: Standalone atmosphere prototype + research doc covering sky gradient, clouds, and a
time-of-day parameter driving sun position/color, exposure, and fog.

CONTEXT:
Afterglow's story: 5:30 PM → golden hour → sunset → storm → clearing → night.
Current sky is a simple 3-stop gradient dome; no clouds; sun/hemisphere lights are static.
The prototype defines the production atmosphere system.

VISUAL CONTRACT (relevant):
- Oklahoma golden hour: warm cream horizon, deep dusk blue zenith
- photographic; no purple-gradient AI look; no fantasy skies
- storm state must read as heavy overcast + haze, not sci-fi

REQUIREMENTS:
1. Sky dome shader: at minimum Rayleigh-ish gradient driven by sun elevation; sun disc + glow
2. Cloud layer: cheap (2D noise-based cirrus/stratus on the dome OR few billboard cards) — must tint with time of day
3. Single `timeOfDay` uniform 0..1 driving: sun direction, sun color, hemisphere colors, fog color/density, exposure
4. Keyframes: 5:30 PM / golden / sunset / overcast-storm / clearing / night
5. Performance instrumentation overlay
6. Self-contained: experiments/atmosphere/index.html + js — import three from ../../afterglow/vendor/three.module.min.js
7. NO modifications to afterglow/ production files

REFERENCES:
- Web: "three.js sky shader Preetham", "atmospheric scattering simplified shader",
  "ACES tonemapping exposure day night"
- Local: afterglow/js/main.js (current sky dome + lights) — read-only reference

FILES ALLOWED: experiments/atmosphere/** , docs/research/atmosphere-system.md
FILES FORBIDDEN: afterglow/** (read-only), docs/art-direction.md (read-only)

OUTPUT: experiments/atmosphere/ + docs/research/atmosphere-system.md
(technique, keyframe table, perf numbers, integration notes for main.js/weather director)

TEST: open experiments/atmosphere/index.html; scrub timeOfDay 0→1; verify smooth believable transition; ≥55 fps desktop.

RESULT CONTRACT:
STATUS: PASS|PARTIAL|FAIL
SUMMARY:
FILES CREATED:
TESTS RUN:
METRICS:
RISKS:
RECOMMENDED NEXT STEP:
