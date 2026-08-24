# Weather System Research and Prototype

The self-contained `experiments/weather/` prototype imports the vendored Three.js module and uses proxy geometry only. Controls provide a 0→1→0 intensity ramp, wind, and three density tiers.

## Technique

Rain is one `InstancedMesh` of elongated quads. Per-instance seeded offsets and speed cycle in a camera-relative volume in the vertex shader. Wind slants the fall; near/far depth ramps fade it. Warm additive streaks remain visible against dusk without becoming white dots. An analytic world-space roof rectangle moves below-roof drops offscreen, avoiding per-drop raycasts.

The stone shader uses the same rectangle to retain dry material under cover. Exposed stone blends darker with intensity and gains sparse reflection-colored puddles from a procedural low-area mask. This is screen-space-free and has no reflection pass. Production should retain source PBR maps via `onBeforeCompile`, lower roughness toward 0.18–0.35, darken albedo toward 0.5–0.7, raise controlled environment specular, and replace the demo mask with authored drainage data.

Splashes are optional and omitted. If needed, recycle 64–128 instanced ring sprites only on exposed ground and disable them on mobile.

## Tier budgets

| Tier | Streaks | Target |
|---|---:|---|
| desktop heavy | 24,000 | ≥55 fps, DPR ≤2 |
| desktop light | 12,000 | 60 fps integrated GPU |
| mobile | 5,500 | 30–60 fps physical device |

All tiers allocate once and change `InstancedMesh.count`. The overlay and `window.__weatherMetrics` expose FPS, active streaks, draw calls, and triangles.

## Future WeatherDirector integration

Construct once with scene, camera, pergola bounds, and wettable materials. Expose `setIntensity`, `setWind`, `setTier`, `update`, and `dispose`. Drive eased attack/release from chapter progress; do not rebuild geometry during transitions. Feed world-space shelter bounds with a wind-side margin; represent multiple roofs with a bounded rectangle array or small height mask. Test both wind extremes, camera cuts, background resume, reduced motion, and physical-mobile thermal load.

## Risks

Extreme top-down views expose quad flatness; build view-right in the production shader. One rectangle only models this proxy roof. The puddle mask is illustrative rather than drainage-derived. Renderer counters are not GPU timings; use `EXT_disjoint_timer_query_webgl2` where available.
