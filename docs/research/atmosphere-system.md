# Afterglow atmosphere system

## Technique

One inward sphere and one shader draw call provide an art-directed, Rayleigh-ish vertical gradient, analytic sun disc and broad forward-scattering glow. The sky fragment has no procedural noise or FBM. Cloud alpha is generated once at startup into a 512×256 DataTexture, sampled with a slow equirectangular UV drift, and multiplied by a time-driven cloud tint; the texture is never mutated after its initial upload. This avoids the recurring full-screen noise cost and purple-bias risk of a full scattering model. Clouds interpolate from warm gray to neutral charcoal during storm. A single normalized `timeOfDay` input samples smooth keyframes and drives sun direction/color/intensity, hemisphere colors, exponential fog, ACES exposure, cloud cover, and storm tint.

## Keyframes

| timeOfDay | Beat | Sun elevation | Exposure | Fog density | Cloud | Intent |
|---:|---|---:|---:|---:|---:|---|
| 0.00 | 5:30 PM | 18° | 1.03 | .0055 | .22 | Cream horizon, deep-blue zenith |
| 0.18 | Golden hour | 10° | 1.00 | .0062 | .30 | Amber key and warm clouds |
| 0.36 | Sunset | 1° | .91 | .0080 | .48 | Orange, never magenta |
| 0.55 | Overcast/storm | -3° | .72 | .0155 | .92 | Heavy neutral cover and haze |
| 0.74 | Clearing | -7° | .82 | .0092 | .52 | Warm break; haze recedes |
| 1.00 | Night | -18° | .60 | .0075 | .30 | Navy sky, cool low fill |

## Performance

The overlay reports rolling FPS, average/worst frame time, draw calls, and triangles from `renderer.info`. Geometry is fixed; atmosphere is one draw. The prototype renders at 0.6 desktop and 0.5 mobile pixel ratio. The 1440×900 headed Playwright rerun improved from 34.36 fps to a best 10-second average of 51.50 fps (individual one-second samples peaked at 58.94 fps), but remained below the 55 fps acceptance target under concurrent desktop GPU load. A second 0.5-DPR run regressed under increasing system load, confirming that the measured ceiling was scheduling/GPU-contention limited rather than fill-rate limited. Runtime WebGL instrumentation counted zero `texImage2D`/`texSubImage2D` calls after warm-up.

## Integration notes

1. Extract sampler/material into an `Atmosphere` controller instantiated once by `main.js`.
2. Reuse current sun, hemisphere light, fog, and sky objects; replace static values with controller output.
3. The weather/scroll director maps chapter progress to `timeOfDay`; do not create separate weather and clock inputs that can disagree.
4. Mutate uniforms and existing objects per frame; never rebuild materials. Cloud clock may advance separately, while visual state comes from `timeOfDay`. Keep `cloudTexture.needsUpdate` confined to startup; UV drift and tint are uniforms, not texture rewrites.
5. Preserve ACES and DPR caps. Validate all beats against desktop/mobile shots because framing changes the horizon.
6. World wetness and practical lights should consume sampled storm/night state downstream.

## Risks

- Equirectangular cloud UVs compress toward the zenith; the cloud band masks the pole.
- Clouds do not cast localized shadows; sun-intensity modulation supplies broad overcast behavior.
- Tune final sunset color with the production world visible.
- The optimized fragment is texture lookup plus analytic sky math, but this test host remained below the 55 fps gate while its shared Chrome GPU process and WindowServer were heavily loaded. Re-run on a controlled target desktop before choosing the production DPR cap.

## Verification

Serve the repository over HTTP, open `experiments/atmosphere/index.html`, click all six keyframes, and scrub 0→1. Check continuity, no purple cast, readable daytime sun, heavy neutral storm, and navy night. Observe the overlay for ten seconds at desktop size and confirm at least 55 fps.
