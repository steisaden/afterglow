# AFTERGLOW — Vision-Locked Realism Pass · Final Report

## Selected assets (all Poly Haven, CC0 1.0)

| Role | Asset | Why it matched |
|---|---|---|
| Hero tree | jacaranda_tree | Real branch structure, irregular crown, photographic bark/leaf cards |
| Midground oak | island_tree_01 | Broadleaf residential silhouette; doubles as far-canopy LOD2 instances |
| Ornamental tree | tree_small_02 | Small sculptural form, believable lean |
| Hedge | shrub_04 (LOD2 row) | Irregular real-foliage mass replaced 23 sphere instances |
| Bed planting | shrub_01/02, grass_medium_01, periwinkle, celandine | Natural silhouettes with alpha foliage |
| **Pergola cedar** | **brown_planks_08** (1K diff/nor/rough) | Warm medium brown, restrained red undertone, matte; scored above every alternative on the contact sheet |

Competing candidates rejected: brown_planks_07 (gray/weathered), oak_wood_planks
(orange interior-floor look), fine_grained_wood (too dark for primary), all three
paver textures (rustic flagstone / industrial interlock / mesh-grid squares — none
read as large-format ivory limestone), fern_02 / nettle_plant / grass_bermuda_01 /
grass_medium_02 / planter_box_01 / long_life_food (all scored below the 80-point
threshold: sparse, weedy, wicker-rustic, or irrelevant). Per §11 they were NOT
forced in — procedural planting masses remain for those roles.

## Selected materials
- **Cedar**: brown_planks_08 × tint 0xc49a6c; posts use a 90°-rotated map so grain runs vertical; beams/rafters horizontal
- **Patio**: procedural large-format honed limestone — 2 cm joints, ivory 0xe9e1cf, per-paver tone jitter
- **Kitchen**: charcoal-bronze cabinets 0x2e2b27, honed counter, dark stone cladding
- **Lawn**: palette rgb(88,116,62) ground + 14,000 instanced tapered blades with GPU wind
- **House**: greige siding, amber interior glow at dusk

## Optimization
- Draw calls 376 → **221** at load (per-asset material sharing, bed plants boot on LOD2)
- Triangles 663K → **156K** at load; textures 69 → **21**
- Bed plants pinned single-level (never hydrate unused LODs); hydration batched 3/90 ms
- Grass prototype: 60 fps, 3 draw calls, 162K tris (desktop) / 60 fps (mobile)
- Weather prototype: 43 fps @ 24k streaks (Metal); atmosphere 34 → 51.5 fps (startup cloud texture, zero per-frame uploads)
- Headless-Metal scene sample: ~20-22 fps desktop, **61 fps mobile** — real-browser desktop profiling still pending

## Visual result — top 3 remaining obstacles
1. **Flowering masses still read as clustered cards at 6–12 m** — no legitimately
   licensable hydrangea/salvia/lavender meshes exist in the free tiers; needs a
   commissioned or scanned asset to close
2. **House interior is a flat amber panel** — night chapters would gain real depth
   from interior furniture silhouettes + room lighting behind the glass
3. **Tree canopies read sparse from low angles** (LOD1 decimation) — the LOD0
   hydration fixes this after ~4 s, but first-paint could boot hero trees on LOD0
   directly on fast connections

Do not start another redesign after this report.
