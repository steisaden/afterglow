# HERMES TASK C — RAIN / SNOW / WETNESS SYSTEM (research + prototype)

PROJECT: /Volumes/toshiba/Development/ds_threejs_ex  (Afterglow site in afterglow/)
GOAL: Standalone weather prototype + research doc: Oklahoma rainstorm over a covered patio,
plus ground wetness response. Snow optional (stretch).

CONTEXT:
Afterglow chapter 03: the storm must feel sheltering, not like a particle demo.
The covered pergola stays dry; rain catches light; stone darkens/wets; puddles appear subtly;
atmosphere gains depth. Narrative: "designed for beautiful days, built for the other ones."

VISUAL CONTRACT (relevant):
- rain intensity ramps 0→1→0; wind-driven angle; NO lightning (rejected)
- rain must be visible against warm dusk light (streaks catching light, not white dots)
- wetness: darkened roughness on patio/stone + subtle reflection boost; puddles in low areas only
- covered area visibly dry (rain occluded under pergola roof)

REQUIREMENTS:
1. GPU rain: instanced streak quads or line segments, camera-relative cycling, 3 density tiers
   (desktop heavy / desktop light / mobile), wind slant, depth-fade
2. Occlusion: simple analytic rain shadow under the pergola roof rectangle (no per-drop raycast)
3. Wetness: screen-space-free approach — material uniform blend (roughness down, color darken,
   env specular up) on a test stone plane + a simple puddle mask texture in low areas
4. Splashes optional (tiny ring sprites near ground, cheap)
5. Storm audio NOT required
6. Performance instrumentation overlay
7. Self-contained: experiments/weather/index.html + js — import three from ../../afterglow/vendor/three.module.min.js
   (a simple pergola proxy box + stone plane may be built inline)
8. NO modifications to afterglow/ production files

REFERENCES:
- Web: "three.js rain shader instanced", "gpu rain streaks camera relative", "wet asphalt roughness blend"
- Local: afterglow/js/world.js materials (read-only reference)

FILES ALLOWED: experiments/weather/** , docs/research/weather-system.md
FILES FORBIDDEN: afterglow/** (read-only), docs/art-direction.md (read-only)

OUTPUT: experiments/weather/ + docs/research/weather-system.md (technique, tier budgets,
perf numbers, integration notes for a future WeatherDirector)

TEST: open experiments/weather/index.html; scrub storm intensity; verify sheltered dry zone + wet stone response; ≥55 fps desktop heavy tier.

RESULT CONTRACT:
STATUS: PASS|PARTIAL|FAIL
SUMMARY:
FILES CREATED:
TESTS RUN:
METRICS:
RISKS:
RECOMMENDED NEXT STEP:
