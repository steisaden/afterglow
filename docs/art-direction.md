# AFTERGLOW — Art-Direction Contract

*Deliverable of `threejs-cinematic-design-director` §3. Governs all build passes.*

---

## Routing note (task-specific-skill-router §11)

```
TASK:            Cinematic real-time 3D scroll-storytelling site ("AFTERGLOW",
                 Tulsa outdoor living) with time-of-day/weather sequence.
PRIMARY SKILL:   threejs-cinematic-design-director  (art direction, storyboard,
                 camera/lighting doctrine, QA loop)  [LOADED]
SUPPORTING:      3d-web-experience  (Three.js engine lifecycle/perf patterns) [LOADED]
NOT LOADING:     MengTo library (absent on this machine - verified via fs);
                 scroll-world (Higgsfield pre-rendered flythroughs - wrong lane,
                 this project is real-time WebGL); three-brain (review workflow);
                 generic frontend/design/motion skills.
WHY:             Director skill owns cinematic scrollytelling art direction; the
                 engine-equivalent owns renderer lifecycle/perf. Weather
                 capability (MengTo `threejs-weather`) unavailable -> rain/wind/
                 time-of-day implemented procedurally in-house under director
                 doctrine. Budget: 2 skills active (<=3 allowed).
```

## Reference grammar extracted — Kage (mengto.github.io/kage)

Studied live HTML + runtime script. **Grammar kept** (methodology only):

| Kage pattern | AFTERGLOW translation |
|---|---|
| Shot table `CAM[]` = `{p,t,fov}` per chapter; two CatmullRom splines (position + target), tension .42; FOV lerped per segment | Same rig mechanics; 6 waypoints for 5 chapters + footer |
| DOM sections `[data-cam]` -> anchors -> continuous chapter-space float | Identical mechanism; sections own their copy |
| Frame-rate-independent damping (`1-exp(-rate*dt)`) everywhere | Same math for pointer parallax, intro dolly, weather blends |
| Intro dolly on load (push back + wide FOV, ease in) | Same: yard recedes then settles at 5:30 PM |
| Fully procedural world, zero photo/video assets, tiny payload | Same discipline: procedural cedar/limestone/water/grass |
| Foreground cutouts occluding nav/rail, section-owned stages | Oklahoma grasses/branches as depth layers (geometry + canvas-alpha planes) |
| Type laid out by unprojecting NDC->world plane | Headlines placed in camera-created negative space |
| Word-mask line reveals, IntersectionObserver stagger | Same reveal vocabulary |
| Nav state read from real anchor positions | Chapter rail reflects actual scroll |

**Not copied:** Japanese identity, temple/shrine architecture, sakura/maples,
Japanese typography, Kage copy, lantern/wisp effects, stone-mound court layout.

> One-sentence thesis: *This experience should feel like golden-hour architectural
> photography + a slow crane-and-dolly walk into a finished backyard resort +
> quiet editorial typography that lets the scene breathe.*

## Contract

**Visual thesis**
An Oklahoma backyard slowly becoming a private resort as afternoon turns to
night — the visitor walks into the completed project rather than scrolling a
brochure.

**Hero focal asset**
A cedar pergola/pavilion over a limestone patio, anchored left-of-center;
fire feature and outdoor kitchen as secondary focal points revealed later.

**WebGL lane**
*Cinematic world* (single lane). Environment + multiple authored shots +
weather/atmosphere. No second heavy lane.

**Camera language**
Perspective, 34–48° FOV (fitAspect-corrected per frame shape). Six-shot
scroll-scrubbed CatmullRom path: distant yard → push-in → arc around structure
→ low pass under beams (gathering) → pull-back wide for storm → settle into
final dusk composition. Target changes are intentional beats, not drift.
Pointer parallax ≤ 0.35 world units, heavily damped. Reduced motion: locked
per-chapter keyframes.

**Lighting**
Key: low warm sun (directional, 2200–4500 K across timeline). Fill: sky
hemisphere shifting cream→dusk blue. Rim: sun backlight through pergola beams.
Practicals: string lights, kitchen strip, fire point light (flicker),
path lights. Fog: exponential haze tinted to sky; density rises in storm.
Exposure driven through one tone-mapping-exposure scalar per weather state.

**Materials (4 families, procedural canvas textures)**
1. Warm cedar (planks + posts, grain via canvas noise)
2. Limestone / textured concrete pavers (value noise + joint lines)
3. Matte black steel (posts, trim, kitchen fascia)
4. Prairie planting (instanced grass blades, wind-shader bent)

Water: single reflective pool plane (planar reflection desktop only).

**Motion**
Scroll = scrub master. Easing lives in the spline, not the scrub. Continuous:
grass sway (low amplitude), heat shimmer off fire, water ripple. Triggered:
line-mask text reveals, practicals switching on at dusk beat. Nothing bounces.

**Typography**
Oversized display grotesk system stack, tight leading (~0.95), uppercase small
technical labels with wide tracking. Text occupies camera negative space;
occasional foreground occlusion where readability survives. Safe zones verified
per shot.

**Hybrid layers**
HTML/CSS: nav, chapter rail, all copy, CTAs, footer, reduced-motion poster.
WebGL: world/camera/weather/water. Optional canvas-alpha grass plates at two
depth planes if geometry grass can't carry the foreground cheaply enough.

**Mobile fallback (recomposition, not shrinkage)**
Separate mobile shot table; hero type protected above fold; particle counts ÷3;
DPR cap 1.25; planar reflections off (fake env); pointer features removed;
same chapters and narrative order.

**Quality gates**
- Each pass self-verified via screenshots before next pass (1440×900, 390×844)
- Payload target: < 350 KB JS total incl. three.module.min; zero image assets
  unless a foreground plate demonstrably beats geometry
- ≥ 55 fps desktop / ≥ 40 fps mobile in headless sampling
- AI-slop gate checked every capture (no gradient blobs, no glass panels,
  no meaningless particles, no centered-everything)
