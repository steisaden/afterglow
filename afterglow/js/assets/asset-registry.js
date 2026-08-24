import * as THREE from 'three';
import { GLTFLoader } from '../../vendor/loaders/GLTFLoader.js';
import { MeshoptDecoder } from '../../vendor/libs/meshopt_decoder.module.js';

const MODEL_ROOT = './assets/models';

export const vegetationRegistry = {
  heroJacaranda: {
    path: 'vegetation/jacaranda_tree', scale: 0.44, distances: [0, 20, 38],
    castShadow: true, receiveShadow: true
  },
  coastalOak: {
    path: 'vegetation/island_tree_01', scale: 0.72, distances: [0, 18, 36],
    castShadow: true, receiveShadow: true
  },
  ornamentalTree: {
    path: 'vegetation/tree_small_02', scale: 1.08, distances: [0, 20, 38],
    castShadow: true, receiveShadow: true
  },
  floweringShrub: {
    path: 'vegetation/shrub_01', initialLod: 2, scale: 0.82, distances: [0, 7, 13],
    castShadow: false, receiveShadow: true
  },
  looseShrub: {
    path: 'vegetation/shrub_02', initialLod: 2, scale: 0.88, distances: [0, 7, 13],
    castShadow: false, receiveShadow: true
  },
  compactShrub: {
    path: 'vegetation/shrub_04', initialLod: 2, scale: 0.76, distances: [0, 7, 13],
    castShadow: false, receiveShadow: true
  },
  meadowGrass: {
    path: 'vegetation/grass_medium_01', initialLod: 2, scale: 0.74, distances: [0, 6, 12],
    castShadow: false, receiveShadow: true
  },
  periwinkle: {
    path: 'garden/periwinkle_plant', initialLod: 2, scale: 0.72, distances: [0, 6, 12],
    castShadow: false, receiveShadow: true, tint: 0xb6a6c8
  },
  celandine: {
    path: 'garden/celandine_01', initialLod: 2, scale: 0.68, distances: [0, 6, 12],
    castShadow: false, receiveShadow: true, tint: 0xf0dfc4
  },
  kitchenHerb: {
    path: 'vegetation/shrub_02', initialLod: 2, scale: 0.24, distances: [0, 5, 10],
    castShadow: false, receiveShadow: true, tint: 0x85906c
  },
  kitchenGreens: {
    path: 'vegetation/shrub_04', initialLod: 2, scale: 0.27, distances: [0, 5, 10],
    castShadow: false, receiveShadow: true, tint: 0x9cab78
  },
  potagerFlower: {
    path: 'garden/periwinkle_plant', initialLod: 2, scale: 0.34, distances: [0, 5, 10],
    castShadow: false, receiveShadow: true, tint: 0xc1aacb
  },
  /* Background canopy: real tree silhouettes retire the procedural lobes.
     Pinned to LOD2 — distance silhouettes only, never hydrated higher. */
  farCanopy: {
    path: 'vegetation/island_tree_01', scale: 0.92, distances: [1, 2, 0],
    fixedLod: 2, castShadow: false, receiveShadow: false
  },
  /* Privacy hedge: irregular real shrub mass replaces sphere instances. */
  hedgeShrub: {
    path: 'vegetation/shrub_04', initialLod: 2, scale: 1.18, distances: [1, 2, 0],
    fixedLod: 2, castShadow: false, receiveShadow: true
  }
};

const plantingPlan = {
  heroJacaranda: [[-12.5, -14.0, -0.08, 0.25]],
  coastalOak: [[-8.9, -10.6, -0.06, 0.38]],
  ornamentalTree: [[14.0, -6.5, -0.04, -0.75]],
  floweringShrub: [[-10.7, 5.0, 0.02, 0.4], [-8.9, -0.4, 0.02, -0.8], [6.7, -1.0, 0.02, 0.7], [9.6, -9.0, 0.02, -0.2]],
  looseShrub: [[-14.0, 4.4, 0.02, -0.2], [-8.8, -4.0, 0.02, 0.6], [12.0, 3.8, 0.02, -0.5], [6.8, -5.0, 0.02, 0.9]],
  compactShrub: [[-12.5, 6.1, 0.02, 0.2], [-8.6, -7.0, 0.02, -0.6], [10.0, 5.1, 0.02, 0.8], [7.0, -7.7, 0.02, -0.1]],
  meadowGrass: [[-11.7, 6.8, 0.02, 0.1], [-9.4, 2.3, 0.02, -0.4], [-8.4, -2.3, 0.02, 0.7], [11.4, 4.8, 0.02, -0.6], [7.1, -2.8, 0.02, 0.4], [7.0, -6.2, 0.02, -0.8], [11.0, -10.0, 0.02, 0.2]],
  periwinkle: [[-10.2, 4.0, 0.03, 0.3], [-8.6, -5.2, 0.03, -0.5], [8.4, 1.6, 0.03, 0.7], [6.8, -5.5, 0.03, -0.2], [10.6, -10.4, 0.03, 0.5]],
  celandine: [[-12.0, 5.8, 0.03, -0.4], [-8.7, -2.8, 0.03, 0.6], [11.1, 3.3, 0.03, -0.7], [7.0, -3.9, 0.03, 0.2], [9.2, -8.6, 0.03, -0.1]],
  kitchenHerb: [[6.72, -9.45, 0.33, 0.1], [7.18, -8.98, 0.33, -0.6], [7.67, -9.40, 0.33, 0.8], [9.35, -10.18, 0.34, -0.2], [10.43, -9.88, 0.34, 0.5]],
  kitchenGreens: [[9.22, -10.55, 0.34, 0.2], [9.75, -10.48, 0.34, -0.5], [10.30, -10.50, 0.34, 0.7]],
  potagerFlower: [[6.0, -9.0, 0.03, 0.1], [8.35, -8.9, 0.03, -0.4], [8.45, -10.7, 0.03, 0.7], [11.35, -10.0, 0.03, -0.2]],
  farCanopy: [
    [-18.6, -25.1, 0, 0.55], [-9.6, -25.9, 0, 1.35],
    [-5.0, -25.6, 0, 0.2], [-0.4, -26.1, 0, -1.1], [4.2, -25.8, 0, 0.9],
    [13.4, -25.5, 0, 1.6], [17.8, -24.8, 0, 0.35],
    [21.5, -22.6, 0, -1.25]
  ],
  hedgeShrub: [
    [-17.2, -23.55, 0, 0.4], [-15.8, -23.8, 0, -0.7], [-14.4, -23.5, 0, 1.2],
    [-13.0, -23.85, 0, 0.15], [-11.6, -23.55, 0, -1.0], [-10.2, -23.8, 0, 0.75],
    [-8.8, -23.5, 0, -0.35], [-7.4, -23.8, 0, 1.45], [-6.0, -23.55, 0, 0.05],
    [-4.6, -23.8, 0, -0.85], [-3.2, -23.5, 0, 0.6], [-1.8, -23.8, 0, -1.3],
    [-0.4, -23.55, 0, 0.3], [1.0, -23.8, 0, -0.6], [2.4, -23.5, 0, 1.1],
    [3.8, -23.85, 0, 0.2], [5.2, -23.55, 0, -0.95], [6.6, -23.8, 0, 0.7],
    [8.0, -23.5, 0, -0.4], [9.4, -23.8, 0, 1.35], [10.8, -23.55, 0, 0.1],
    [12.2, -23.8, 0, -0.8], [13.6, -23.5, 0, 0.55], [15.0, -23.8, 0, -1.2],
    [16.4, -23.55, 0, 0.35]
  ]
};

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const sharedAssetMaterials = new Map();
const modelCache = new Map();

function loadModel(url) {
  if (!modelCache.has(url)) {
    modelCache.set(url, new Promise((resolve, reject) => loader.load(url, gltf => resolve(gltf.scene), undefined, reject)));
  }
  return modelCache.get(url);
}

function prepareLevel(source, definition, lodIndex, sharedMaterials = null) {
  const level = source.clone(true);
  level.scale.setScalar(definition.scale);
  let meshIndex = 0;
  level.traverse(object => {
    if (!object.isMesh) return;
    object.castShadow = definition.castShadow && lodIndex === 0;
    object.receiveShadow = definition.receiveShadow;
    if (object.material) {
      if (sharedMaterials?.[meshIndex]) {
        object.material = sharedMaterials[meshIndex];
      } else {
        object.material = object.material.clone();
        if (definition.tint && object.material.color) object.material.color.multiply(new THREE.Color(definition.tint));
        if (object.material.transparent || object.material.alphaTest > 0) {
          object.material.transparent = false;
          object.material.alphaTest = 0.38;
          object.material.depthWrite = true;
          object.material.side = THREE.DoubleSide;
        }
      }
    }
    meshIndex++;
  });
  return level;
}

async function createPlantLOD(key, definition, placement) {
  const [x, z, y = 0, rotation = 0] = placement;
  const lod = new THREE.LOD();
  lod.name = `${key}-professional-lod`;
  lod.position.set(x, y, z);
  lod.rotation.y = rotation;

  /* fixedLod: silhouette-only background roles stay on one level. */
  if (definition.fixedLod !== undefined) {
    const index = definition.fixedLod;
    const source = await loadModel(`${MODEL_ROOT}/${definition.path}_lod${index}.glb`);
    const level = prepareLevel(source, definition, index);
    lod.addLevel(level, 0);
    lod.autoUpdate = false;
    lod.updateMatrix();
    return lod;
  }

  const initial = definition.initialLod ?? 1;
  const source = await loadModel(`${MODEL_ROOT}/${definition.path}_lod${initial}.glb`);
  if (!sharedAssetMaterials.has(definition.path)) {
    const seed = prepareLevel(source, definition, initial);
    const mats = [];
    seed.traverse(object => { if (object.isMesh) mats.push(object.material); });
    sharedAssetMaterials.set(definition.path, mats);
  }
  const sharedMaterials = sharedAssetMaterials.get(definition.path);
  const initialLevel = prepareLevel(source, definition, initial, sharedMaterials);
  lod.addLevel(initialLevel, definition.distances[initial]);
  if (initial === 2) lod.userData.singleLevel = true;  /* bed roles: never within 7 m */
  lod.userData.loadLowerLevels = async () => {
    const indexes = [0, 1, 2].filter(i => i !== initial);
    const sources = await Promise.all(indexes.map(index => loadModel(`${MODEL_ROOT}/${definition.path}_lod${index}.glb`)));
    sources.forEach((levelSource, sourceIndex) => {
      const lodIndex = indexes[sourceIndex];
      lod.addLevel(prepareLevel(levelSource, definition, lodIndex, sharedMaterials), definition.distances[lodIndex]);
    });
  };
  lod.autoUpdate = true;
  return lod;
}

function hideSyntheticHeroVegetation(world) {
  const replaced = [
    'upright-tree-lod', 'round-tree-lod', 'sculptural-tree-lod',
    'shrub-archetype-1', 'shrub-archetype-2', 'shrub-archetype-3',
    'ornamental-grass-masses', 'hero-flower-cluster',
    'rosemary-thyme-sage-basil', 'lettuce-kale-greens',
    'far-canopy-trees', 'far-canopy-trunks', 'privacy-hedge'
  ];
  world.traverse(object => {
    if (replaced.some(name => object.name.includes(name))) object.visible = false;
  });
}

export async function upgradeSceneAssets(world, renderer) {
  const layer = new THREE.Group();
  layer.name = 'professional-asset-layer';
  world.add(layer);
  const jobs = [];
  for (const [key, placements] of Object.entries(plantingPlan)) {
    const definition = vegetationRegistry[key];
    placements.forEach(placement => jobs.push(createPlantLOD(key, definition, placement)));
  }
  const plants = await Promise.all(jobs);
  plants.forEach(plant => layer.add(plant));
  hideSyntheticHeroVegetation(world);
  if (renderer?.shadowMap) renderer.shadowMap.needsUpdate = true;
  world.userData.assetRegistry = vegetationRegistry;
  world.userData.professionalAssetCount = plants.length;
  const pending = plants.slice();
  const hydrateNextLOD = () => {
    if (!pending.length) return;
    const batch = pending.splice(0, 3);
    batch.forEach(plant => {
      if (plant.userData.loadLowerLevels && !plant.userData.singleLevel)
        plant.userData.loadLowerLevels().catch(() => {});
    });
    setTimeout(hydrateNextLOD, 90);
  };
  setTimeout(() => {
    if ('requestIdleCallback' in window) requestIdleCallback(hydrateNextLOD, { timeout: 30000 });
    else hydrateNextLOD();
  }, 2500);
  return layer;
}
