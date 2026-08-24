# Afterglow realistic lawn system

## Decision

Use two spatially separated instanced geometry tiers over a textured ground plane. The near tier (0–8 m) uses individually lit, tapered blades with five height stations: nominal width 6 mm and height 55 mm, randomized into the required 4–8 mm / 30–80 mm maintained-lawn range. The mid/far tier (8–15.4 m) uses inexpensive crossed quads. Beyond that, the procedural ground texture carries color and micro-breakup into fog.

This fits Afterglow because grazing cameras resolve real silhouettes nearby, while instancing keeps the foliage tiers to two draw calls. It is asset-free and directly replaces the existing `turfFieldInstances` concept without introducing another rendering lane.

## Research findings

- Three.js `InstancedMesh` collapses repeated blades into one draw call; a root pivot permits shader deformation without sliding.
- GPU Gems, “Rendering Countless Blades of Waving Grass,” recommends intersecting polygons for view-independent mid-distance coverage and combines low draw count with local variation.
- Jahrmann/Wimmer grass work models curvature with multiple blade stations/control points and random orientation/bend. This prototype uses five stations rather than tessellation, which WebGL portability does not guarantee.
- AMD's procedural grass notes likewise taper width along a curved blade. Current Three.js examples converge on world-position vertex wind and per-instance variation.
- Large open-world techniques such as Ghost of Tsushima emphasize authored density and aggressive visibility/LOD. Its patch/streaming complexity is disproportionate for this bounded yard, but the core rule—spend geometry only where silhouettes resolve—applies.

Sources studied (assets not copied):
- https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-7-rendering-countless-blades-waving-grass
- https://www.cg.tuwien.ac.at/research/publications/2013/JAHRMANN-2013-IGR/JAHRMANN-2013-IGR-paper.pdf
- https://gpuopen.com/learn/mesh_shaders/mesh_shaders-procedural_grass_rendering
- https://supagamesai.com/learn/threejs-vegetation-wind.html
- Local read-only reference: `afterglow/js/world.js` (`grassInstances`, `turfFieldInstances`)

## Shared wind field

Both LOD materials bind the same mutable time/strength uniforms. The vertex shader samples world position, so adjacent instances participate in one coherent field. Desktop gusts blend two octaves of value noise plus a low-amplitude directional ripple. Height-squared weighting pins roots and bends tips gently. Mobile selects the same field's cheaper sinusoidal branch at reduced amplitude; no CPU blade positions change per frame.

## Color and maintained-lawn character

Per-instance HSL variation stays around medium-dark healthy green. A deterministic low-frequency patch function changes dryness probability, producing sparse straw-green blades in patches rather than uniform confetti. The canvas ground layer repeats dense vertical flecks and muted dry variation, avoiding neon turf and hiding gaps.

## Alternatives rejected

- **One dense full-field blade mesh:** unnecessary vertex cost and weak culling; distant blades alias.
- **Alpha-textured grass everywhere:** efficient but visibly card-like at 1.5–5 m grazing views.
- **Shell/fur layers:** poor blade silhouettes at grazing angles and transparency overdraw.
- **Tessellation or mesh shaders:** unavailable in portable WebGL/Three.js targets.
- **CPU wind / per-frame matrix updates:** wastes main-thread time and risks incoherent motion.
- **Photographic assets:** conflict with the procedural direction and introduce lighting mismatch.

## Performance at 1440×900

Fresh Chromium measurements are recorded in `TASK-A-REPORT.md`. Geometry accounting is 18,000 near blades × 8 triangles + 4,500 cross-quads × 4 triangles + 2 ground triangles = 162,002 triangles and 3 draw calls. The target is at least 55 FPS. Standard renderer counters do not expose GPU milliseconds, so the ≤4 ms lawn share still requires a GPU timer/profile in the integrated production scene.

## Mobile fallback

Coarse-pointer or sub-700 px displays use 6,500 near blades and 1,500 cross-quads, cap DPR at 1.25, disable antialiasing, lower wind amplitude, and replace two-octave gust noise with a sinusoidal field. Blade dimensions, shared time origin, and color language remain unchanged.

## Integration notes for `afterglow/js/world.js`

1. Preserve the procedural lawn plane as the far/depth foundation, but retune the current light green materials toward the prototype's medium-dark range.
2. Replace the 900-instance `turfFieldInstances` island with a lawn-system factory returning near and mid meshes plus shared wind uniforms.
3. Scatter only inside the lawn polygon and reject patio, water, beds, and structure footprints. Split into spatial chunks if production frustum culling materially helps.
4. Advance the one wind time uniform from the render loop. Reuse it for ornamental grass later with a species amplitude multiplier.
5. Select desktop/mobile counts once at construction and dispose geometry/materials with the world lifecycle.
6. Validate each authored shot at 1440×900 and 390×844. Check grazing silhouettes, moiré, dry-patch restraint, edge leakage, and measured GPU time before production replacement.
