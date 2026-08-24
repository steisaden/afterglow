# Afterglow 3D Asset Sources

All third-party models below were downloaded from Poly Haven under the CC0 1.0 Universal license. Attribution is not legally required; creator credits are retained for provenance. Optimized derivatives are glTF 2.0 binary (`.glb`) with Meshopt geometry compression and 1K source textures.

| Asset | Creator(s) | Source | License / attribution | Original format | Original download | Optimized LOD set |
|---|---|---|---|---|---:|---:|
| Jacaranda Tree | Rob Tuytel, Rico Cilliers | [Poly Haven](https://polyhaven.com/a/jacaranda_tree) | CC0 1.0 / none required | glTF 2.0 + external binary/JPEG textures (1K) | 204.67 MiB | 28.99 MiB |
| Island Tree 01 | Rob Tuytel, Rico Cilliers | [Poly Haven](https://polyhaven.com/a/island_tree_01) | CC0 1.0 / none required | glTF 2.0 + external binary/JPEG textures (1K) | 63.26 MiB | 21.82 MiB |
| Tree Small 02 | Rico Cilliers | [Poly Haven](https://polyhaven.com/a/tree_small_02) | CC0 1.0 / none required | glTF 2.0 + external binary/JPEG textures (1K) | 96.30 MiB | 19.90 MiB |
| Shrub 01 | Rico Cilliers | [Poly Haven](https://polyhaven.com/a/shrub_01) | CC0 1.0 / none required | glTF 2.0 + external binary/JPEG textures (1K) | 6.56 MiB | 5.66 MiB |
| Shrub 02 | Rico Cilliers | [Poly Haven](https://polyhaven.com/a/shrub_02) | CC0 1.0 / none required | glTF 2.0 + external binary/JPEG textures (1K) | 1.88 MiB | 3.66 MiB |
| Shrub 04 | Rico Cilliers | [Poly Haven](https://polyhaven.com/a/shrub_04) | CC0 1.0 / none required | glTF 2.0 + external binary/JPEG textures (1K) | 1.82 MiB | 3.52 MiB |
| Grass Medium 01 | Rob Tuytel, Rico Cilliers | [Poly Haven](https://polyhaven.com/a/grass_medium_01) | CC0 1.0 / none required | glTF 2.0 + external binary/JPEG textures (1K) | 2.92 MiB | 8.39 MiB |
| Periwinkle Plant | Amal Kumar | [Poly Haven](https://polyhaven.com/a/periwinkle_plant) | CC0 1.0 / none required | glTF 2.0 + external binary/JPEG textures (1K) | 2.79 MiB | 5.92 MiB |
| Celandine 01 | Rob Tuytel, Rico Cilliers | [Poly Haven](https://polyhaven.com/a/celandine_01) | CC0 1.0 / none required | glTF 2.0 + external binary/JPEG textures (1K) | 1.45 MiB | 5.71 MiB |

## Optimization notes

- Raw downloads are retained outside the repository during processing; only production derivatives are committed.
- Foliage diffuse and opacity maps were combined into RGBA textures before conversion so alpha-tested leaves render correctly.
- Each asset has LOD0, LOD1, and LOD2 derivatives. Runtime distances and shadow policy are defined in `afterglow/js/assets/asset-registry.js`.
- Poly Haven license: https://polyhaven.com/license
