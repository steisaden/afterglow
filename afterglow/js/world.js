/* ════════════════════════════════════════════════════════════════
   AFTERGLOW · world.js — Pass 1B reference-locked environment
   Geometry and composition only. Materials remain intentionally simple
   so the backyard must read convincingly before the realism pass.
   ════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';

const HERO_GEOMETRY_CACHE = new Map();

export function buildWorld(scene, renderer) {
  const world = namedGroup('afterglow-world');
  const site = namedGroup('site');
  const house = namedGroup('rear-house');
  const pergola = namedGroup('hero-pergola');
  const kitchen = namedGroup('outdoor-kitchen');
  const gathering = namedGroup('gathering-area');
  const potager = namedGroup('kitchen-garden');
  const landscape = namedGroup('landscape');
  const foreground = namedGroup('foreground-framing');
  world.add(site, house, pergola, kitchen, gathering, potager, landscape, foreground);
  scene.add(world);

  const maxAnisotropy = Math.min(renderer?.capabilities?.getMaxAnisotropy?.() || 1, 8);
  const M = makeMaterials(maxAnisotropy);
  world.userData.M = M;

  /* ── broad site: irregular lawn + bounded property ───────────── */
  plane(site, 90, 90, M.earth, 0, 0, 0);
  shapePatch(site, [
    [-17,9],[-11,11],[-4,10.5],[2,11],[9,9.5],[15,5],[16,-4],
    [13,-13],[7,-17],[-1,-18],[-9,-17],[-15,-12],[-18,-4]
  ], M.lawn, .018);
  shapePatch(site, [
    [-12,7],[-7,8.7],[-1,8.1],[4,8.8],[9,6.5],[10,1.5],
    [6,-.8],[-1,.2],[-7,-.4],[-12,2]
  ], M.lawnLight, .022);

  /* Rear privacy fence and neighboring roof silhouettes terminate the world. */
  for (let i = 0; i < 14; i++)
    box(site, 2.75, 1.75, .12, M.fence, -18 + i * 2.85, 0, -24.2);
  roofSilhouette(site, -13.5, -26.5, 7.8, 2.0, M.neighbor);
  roofSilhouette(site, 14.5, -27.2, 9.2, 2.35, M.neighbor);

  /* ── rear house: restrained, one-story, attached to the yard ── */
  house.position.set(3.8, 0, -15.5);
  box(house, 15.2, 3.25, 4.8, M.siding, 0, 0, 0);
  box(house, 4.3, 3.20, 4.95, M.masonry, -5.45, 0, -.03);
  box(house, 15.75, .22, 5.2, M.trim, 0, 3.20, 0);
  const roof = box(house, 16.5, .42, 5.85, M.roof, 0, 3.40, .05);
  roof.rotation.z = -.025;
  box(house, 16.05, .13, .20, M.trim, 0, 3.10, 2.48);

  /* Large sliding doors with actual recess and visible interior plane. */
  heroBox(house,5.05,2.60,.28,M.trim,-1.5,.16,2.47,0,.024);
  box(house, 4.72, 2.32, .10, M.glass, -1.5, .30, 2.64);
  box(house, 3.80, 1.86, .05, M.interior, -1.5, .53, 2.72);
  for (const x of [-2.65, -1.5, -.35])
    box(house, .08, 2.28, .08, M.trim, x, .31, 2.71);

  /* Secondary window and back door keep the facade residential, not monumental. */
  heroBox(house,2.42,1.48,.22,M.trim,3.25,1.00,2.49,0,.022);
  box(house, 2.15, 1.20, .08, M.glass, 3.25, 1.14, 2.64);
  heroBox(house,1.20,2.46,.22,M.trim,5.45,.18,2.49,0,.022);
  box(house, .96, 2.20, .08, M.glass, 5.45, .31, 2.64);
  box(house, 5.95, .18, 1.05, M.stone, -.9, 0, 2.95);
  box(house, .10, 2.75, .10, M.trim, 4.18, 0, 2.02);
  heroBox(house,5.18,.10,.36,M.stone,-1.5,.12,2.65,0,.018);
  heroBox(house,2.50,.09,.34,M.stone,3.25,.92,2.65,0,.018);
  heroBox(house,15.95,.12,.26,M.trim,0,3.04,2.46,0,.018);
  box(house, .20, .18, .13, M.steel, 1.65, 1.82, 2.68);
  box(house, .07, .32, .07, M.warmLight, 1.65, 1.69, 2.77);
  box(house, .20, .18, .13, M.steel, 6.38, 1.82, 2.68);
  box(house, .07, .32, .07, M.warmLight, 6.38, 1.69, 2.77);


  /* ── believable hardscape: running-bond pavers + path ────────── */
  const paverGeo = roundedBoxGeometry(1.92,.14,1.34,.025);
  const paverTransforms = [];
  const patioCenter = { x: -1.15, z: -4.25 };
  for (let row = 0; row < 7; row++) {
    const offset = row % 2 ? .98 : 0;
    for (let col = 0; col < 7; col++) {
      const x = patioCenter.x - 6.0 + col * 1.94 + offset;
      paverTransforms.push([x, .07, patioCenter.z - 4.15 + row * 1.36, 0, 1, 1, 1]);
    }
  }
  /* A four-module walk links patio to the rear threshold. */
  for (let i = 0; i < 4; i++)
    paverTransforms.push([1.9, .075, -9.9 - i * 1.45, 0, .88, 1, .92]);
  const pavers = instances(paverGeo, M.paver, paverTransforms);
  pavers.name = 'running-bond-pavers';
  pavers.receiveShadow = true;
  for(let i=0;i<paverTransforms.length;i++){
    const tone=.91+((i*17)%9)*.018;
    pavers.setColorAt(i,new THREE.Color(tone,tone*.985,tone*.95));
  }
  pavers.instanceColor.needsUpdate=true;
  site.add(pavers);
  box(site, 13.6, .20, .18, M.edge, -1.2, 0, -9.05);
  box(site, .18, .20, 9.7, M.edge, -8.0, 0, -4.25);
  box(site, .18, .20, 9.7, M.edge, 5.65, 0, -4.25);

  /* Existing water feature retained, now seated inside a planted rear bed. */
  box(site, 5.6, .16, 3.0, M.edge, -5.1, 0, -11.9);
  plane(site, 5.25, 2.66, M.water, -5.1, .17, -11.9);

  /* ── pergola: primary structure, secondary rafters, joinery ──── */
  const P = { x: -3.7, z: -4.75 };
  const postX = 3.0, postZ = 2.15, postH = 3.05;
  const boltTransforms=[];
  [[-postX,-postZ],[postX,-postZ],[-postX,postZ],[postX,postZ]].forEach(([dx,dz]) => {
    const x = P.x + dx, z = P.z + dz;
    heroBox(pergola,.36,postH,.36,M.cedar,x,.16,z,0,.035);
    heroBox(pergola,.50,.16,.50,M.steel,x,.16,z,0,.025);
    heroBox(pergola,.30,.16,.44,M.hardware,x,postH+.18,z,0,.02);
    for(const [bx,bz] of [[-.16,-.16],[.16,-.16],[-.16,.16],[.16,.16]])
      boltTransforms.push([x+bx,.34,z+bz,0,1,1,1]);
  });
  const baseBolts=instances(new THREE.CylinderGeometry(.025,.025,.025,10),M.steelLight,boltTransforms);
  baseBolts.name='post-base-bolts';pergola.add(baseBolts);
  /* doubled side beams create believable bearing and depth */
  for (const z of [P.z-postZ, P.z+postZ]) {
    heroBox(pergola,6.85,.34,.20,M.cedarBeam,P.x,postH+.14,z,0,.035);
    heroBox(pergola,6.55,.24,.16,M.cedarDark,P.x,postH+.48,z,0,.025);
  }
  for (let i = 0; i < 10; i++) {
    const x = P.x - 3.18 + i * .71;
    heroBox(pergola,.14,.18,4.95,M.cedarBeam,x,postH+.48,P.z,0,.018);
  }
  /* partial louver field: shade reads as intentional, not a floating black slab */
  for (let i = 0; i < 9; i++) {
    const z = P.z - 1.85 + i * .46;
    heroBox(pergola,6.2,.075,.11,M.cedarDark,P.x,postH+.68,z,0,.012);
  }
  /* Four knee braces communicate constructibility. */
  beam(pergola, [P.x-postX,2.48,P.z-postZ], [P.x-postX+.72,3.22,P.z-postZ], .15, M.cedarBeam);
  beam(pergola, [P.x+postX,2.48,P.z-postZ], [P.x+postX-.72,3.22,P.z-postZ], .15, M.cedarBeam);
  beam(pergola, [P.x-postX,2.48,P.z+postZ], [P.x-postX+.72,3.22,P.z+postZ], .15, M.cedarBeam);
  beam(pergola, [P.x+postX,2.48,P.z+postZ], [P.x+postX-.72,3.22,P.z+postZ], .15, M.cedarBeam);
  for (const x of [P.x-2.05, P.x, P.x+2.05]) {
    const light = new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.035,12), M.warmLight);
    light.rotation.x = Math.PI / 2;
    light.position.set(x, postH + .43, P.z);
    pergola.add(light);
  }


  /* ── outdoor kitchen: dimensional grill, cabinets, sink ──────── */
  kitchen.position.set(2.65, 0, -6.95);
  heroBox(kitchen,5.35,1.05,.92,M.masonry,0,.16,0,0,.025);
  heroBox(kitchen,5.55,.12,1.08,M.counter,0,1.21,0,0,.028);
  heroBox(kitchen,5.02,.14,.10,M.hardware,0,.17,.44,0,.015);
  /* recessed grill body, lid and handle */
  heroBox(kitchen,1.72,.62,.72,M.steel,.55,.73,-.02,0,.035);
  const lid=heroBox(kitchen,1.78,.52,.64,M.steelLight,.55,1.29,-.05,0,.075);
  lid.rotation.x = -.18;
  heroBox(kitchen,1.28,.065,.085,M.hardware,.55,1.63,.35,0,.018);
  const hinge=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,1.42,12),M.hardware);
  hinge.rotation.z=Math.PI/2;hinge.position.set(.55,1.36,-.36);kitchen.add(hinge);
  for (let i = 0; i < 4; i++) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.04,12), M.hardware);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(.04 + i*.34, 1.17, .49);
    kitchen.add(knob);
  }
  /* cabinet and refrigerator fronts */
  for (const [x,w] of [[-1.78,1.1],[-.75,.78],[1.78,1.18]]) {
    heroBox(kitchen,w,.72,.045,M.cabinet,x,.35,.48,0,.012);
    heroBox(kitchen,w*.55,.035,.055,M.hardware,x,.92,.52,0,.01);
  }
  /* small sink/work zone */
  heroBox(kitchen,.80,.045,.55,M.steelLight,-1.65,1.31,0,0,.016);
  heroBox(kitchen,.64,.08,.40,M.hardware,-1.65,1.315,0,0,.012);
  beam(kitchen, [-1.65,1.34,-.05],[-1.65,1.72,-.05],.035,M.hardware);
  beam(kitchen, [-1.65,1.72,-.05],[-1.42,1.60,-.05],.035,M.hardware);

  /* ── gathering: dining, lounge and grounded fire feature ─────── */
  /* dining table under the pergola */
  heroBox(gathering,2.30,.12,1.05,M.table,-4.15,.76,-4.80,0,.025);
  heroBox(gathering,.16,.72,.16,M.steel,-5.03,.16,-4.80,0,.018);
  heroBox(gathering,.16,.72,.16,M.steel,-3.27,.16,-4.80,0,.018);
  const chairs = [
    [-5.0,-3.95,0],[-4.15,-3.95,0],[-3.3,-3.95,0],
    [-5.0,-5.65,Math.PI],[-4.15,-5.65,Math.PI],[-3.3,-5.65,Math.PI]
  ];
  chairs.forEach(([x,z,ry]) => chair(gathering, x, z, ry, M));

  sofa(gathering, -5.05, -1.55, 0, M);
  sofa(gathering, -2.65, -7.72, Math.PI, M);
  heroBox(gathering,.72,.34,.72,M.table,-1.30,.16,-2.05,0,.035);

  const fireBase = new THREE.Mesh(new THREE.CylinderGeometry(.72,.80,.24,28), M.masonry);
  fireBase.position.set(.75,.30,-3.05);
  gathering.add(fireBase);
  const fireInset = new THREE.Mesh(new THREE.CylinderGeometry(.49,.49,.07,28), M.fireDark);
  fireInset.position.set(.75,.45,-3.05);
  gathering.add(fireInset);
  const fireRim=new THREE.Mesh(new THREE.TorusGeometry(.60,.055,10,40),M.steel);
  fireRim.rotation.x=Math.PI/2;fireRim.position.set(.75,.49,-3.05);gathering.add(fireRim);
  const flame = new THREE.Mesh(new THREE.ConeGeometry(.24,.48,12), M.fire);
  flame.position.set(.75,.76,-3.05);
  flame.visible = false;
  gathering.add(flame);
  world.userData.flame = flame;

  /* A disciplined side-yard potager connects the garden to the outdoor kitchen. */
  addPotager(potager,M);

  /* ── designed planting beds: low / medium / high hierarchy ───── */
  shapePatch(landscape, [
    [-17,8],[-14,9.4],[-11.4,7.7],[-10.4,5],[-10.9,2],[-14,1],[-17,2]
  ], M.mulch, .032);
  shapePatch(landscape, [
    [9.2,7.2],[13,7.6],[16.2,4.2],[16.4,-3],[14,-6.4],[10.7,-5.2],[9.8,-1]
  ], M.mulch, .032);
  shapePatch(landscape, [
    [-14,-12],[-10,-15],[-4,-17],[4,-17.5],[11,-15],[13,-11],
    [9,-9],[3,-10.2],[-5,-9.5],[-10,-10]
  ], M.mulch, .034);

  /* Background hedge: dense irregular masses obscure most fence panels. */
  const hedgePositions = [];
  for (let i = 0; i < 23; i++) {
    const x = -17.2 + i * 1.52;
    hedgePositions.push([x, 1.25 + (i%4)*.10, -23.65 + Math.sin(i*.8)*.22,
      0, 1.0 + (i%3)*.08, 1.0 + (i%4)*.08, .82 + (i%5)*.04]);
  }
  const hedge = instances(new THREE.SphereGeometry(1.0,10,7), M.hedge, hedgePositions);
  hedge.name = 'privacy-hedge';
  landscape.add(hedge);

  /* Far canopy uses a cheap three-lobe silhouette language, not equal spheres. */
  const farTreeSites = [
    [-18,-24,1.75],[-12,-25,1.48],[-6,-25.5,1.68],[1,-25,1.42],
    [8,-25.4,1.62],[15,-24.5,1.78],[20,-21,1.55],[-21,-17,1.70]
  ];
  addInstancedTrees(landscape, farTreeSites, M, { far:true });

  /* Midground trees vary species silhouette and frame, rather than occupy, the lawn. */
  addTree(landscape, -12.5, -13.8, 1.35, M, 'upright');
  addTree(landscape, 10.8, -12.2, 1.15, M, 'round');
  addTree(landscape, 14.2, -6.4, .95, M, 'upright');
  /* one sculptural hero tree near the pool edge */
  addTree(landscape, -8.8, -10.5, 1.25, M, 'sculptural');

  const shrubs = [
    [-14,5,1.1],[-12.5,5.8,.8],[-10.6,5.1,.9],[-8.6,3.1,.75],[-14,2.2,.9],
    [-15.8,-2.0,.82],[-14.6,-5.0,.94],[-12.4,-7.5,.76],
    [-8.8,-.3,.72],[-8.9,-3.1,.82],[-8.7,-6.7,.76],
    [10.2,5.0,1.0],[12.0,4.0,.78],[14.1,1.0,.95],[13.2,-3,.82],[10.1,-4.5,.86],
    [15.1,-6.5,.88],[13.7,-8.4,.74],
    [6.4,-.8,.76],[6.6,-3.8,.84],[6.5,-7.1,.78],
    [-12.5,-13,.9],[-10,-14,.75],[-6.5,-15,.85],[5.5,-15,.9],[8,-14,.72],
    [10.5,-12,.96],[-7.8,-10,.72],[1,-11,.75],[4.2,-10.4,.8],
    [-2.0,-12.1,.78],[1.2,-12.2,.72],[7.2,-12.0,.82]
  ];
  const shrubTransforms = [[],[],[]];
  shrubs.forEach(([x,z,s], i) => {
    const count = 3 + (i % 3);
    for (let j = 0; j < count; j++) {
      const a = j * 2.17 + i * .63;
      const r = .28 + (j%2)*.32;
      shrubTransforms[i%3].push([x+Math.cos(a)*r, .04, z+Math.sin(a)*r,
        a, 1.05*s*(.9+(j%3)*.12), .68*s*(.85+(j%2)*.15), .9*s]);
    }
  });
  shrubTransforms.forEach((transforms,archetype)=>{
    const shrubMesh=instances(foliageClumpGeometry(350+archetype*97,6+archetype*2),M.shrub,transforms);
    shrubMesh.name=`shrub-archetype-${archetype+1}`;
    landscape.add(shrubMesh);
  });

  /* Medium ornamental grass clumps follow 3/5/7 massing, not grid spacing. */
  const grassSites = [
    [-14.8,6.5,1.2],[-12.6,7.0,.85],[-10.2,4.6,1.0],[-8.5,2.0,.72],
    [-15.5,-1.2,.82],[-14.0,-4.2,.95],[-11.9,-7.7,.78],
    [-8.4,-1.1,.72],[-8.5,-4.4,.82],[-8.2,-7.4,.74],
    [12.5,4.8,1.05],[10.7,2.6,.82],[11.4,-3.8,.9],
    [14.8,-6.0,.88],[12.8,-8.2,.72],
    [7.0,-1.5,.74],[7.2,-4.8,.84],[7.0,-7.8,.72],
    [-11.8,-11.2,1.0],[-8.8,-12.8,.78],[-5.3,-13.4,.88],
    [6.5,-13.0,1.0],[9.1,-12.1,.74],[11.0,-10.4,.82],[9.5,-8.3,.72],[12.9,-10.8,.78]
  ];
  const grass = grassInstances(grassSites, M.grass, 28);
  grass.name = 'ornamental-grass-masses';
  landscape.add(grass);

  /* Layered planting masses — overlapping drifts, not border rows.
     Each anchor spawns a jittered drift so species layers overlap,
     widths vary, and no two plants sit at even spacing. */
  const bedRandom = seeded(4153);
  const drift = (anchors, spread, count) => {
    const sites = [];
    anchors.forEach(([ax, az]) => {
      const n = count + Math.floor(bedRandom() * 3);
      for (let i = 0; i < n; i++) {
        const a = bedRandom() * Math.PI * 2;
        const r = Math.pow(bedRandom(), .7) * spread;
        sites.push([ax + Math.cos(a) * r * 1.35, az + Math.sin(a) * r]);
      }
    });
    return sites;
  };
  const lavenderSites = drift([
    [-10.9,5.2],[-9.0,2.2],[-8.7,-1.4],[-8.8,-4.4],[-8.5,-7.2],
    [10.0,4.6],[7.0,-1.6],[7.1,-4.8],[6.9,-7.8],[-6.9,-11.2],[1.1,-12.1],[7.9,-12.0],
    [8.3,-9.8],[11.9,-11.0],[-12.6,-13.1],[-4.9,-14.6],[4.1,-14.8],[9.3,-12.4]
  ], .62, 3);
  const creamSites = drift([
    [-12.4,6.3],[-9.2,.3],[-8.6,-2.9],[-8.7,-6.1],
    [11.4,3.6],[7.1,-3.1],[7.0,-6.4],[-9.4,-11.9],[-2.1,-12.1],[4.5,-12.1],
    [9.4,-8.6],[12.5,-9.5],[-11.2,-12.4],[-2.8,-14.9],[6.2,-14.6]
  ], .58, 2);
  const coralSites = drift([
    [-10.1,3.9],[-8.8,-5.1],[8.5,1.9],[7.0,-5.5],[-5.1,-11.8],[6.3,-12.1],[10.9,-10.4],
    [-6.2,-13.6],[3.0,-14.2],[12.2,-10.2]
  ], .5, 2);
  const lavender=flowerMassInstances(lavenderSites,M.flowerLavender,711);
  const cream=flowerMassInstances(creamSites,M.flowerCream,977);
  const coral=flowerMassInstances(coralSites,M.flowerCoral,1219,.82);
  lavender.name='lavender-flower-masses'; cream.name='cream-flower-masses'; coral.name='coral-accents';
  landscape.add(lavender,cream,coral);

  /* Low groundcover closes mulch gaps and softens the lawn/patio/bed seams. */
  const groundcoverSites = [
    [-14.8,6.8],[-13.3,7.2],[-11.7,6.5],[-10.8,4.8],[-11.0,2.8],[-13.2,1.9],[-15.3,2.7],
    [11.0,6.0],[12.7,6.2],[14.4,4.4],[14.9,1.7],[14.5,-1.3],[13.1,-3.9],[11.1,-4.2],
    [-11.8,-11.5],[-9.5,-13.0],[-6.5,-14.3],[-3.2,-15.0],[.2,-15.2],[3.8,-15.1],[7.0,-14.2],[9.5,-12.7],
    [-8.6,-.2],[-8.6,-2.5],[-8.5,-5.0],[-8.3,-7.5],[6.6,-.5],[6.8,-3.0],[6.7,-5.5],[6.5,-7.8],
    [8.0,-8.5],[10.0,-8.6],[12.4,-8.9],[9.4,-10.7],[12.5,-11.1]
  ];
  const groundcover=groundcoverInstances(groundcoverSites,M.groundcover);
  groundcover.name='dense-groundcover';
  landscape.add(groundcover);
  addHeroFlowerCluster(landscape,-8.8,-1.5,M,M.flowerCream,1.0);
  addHeroFlowerCluster(landscape,-8.6,-6.4,M,M.flowerLavender,.92);
  addHeroFlowerCluster(landscape,6.8,-1.8,M,M.flowerCream,.94);
  addHeroFlowerCluster(landscape,6.7,-6.8,M,M.flowerCoral,.82);

  /* Foreground frame: lateral only, explicitly outside the central text field. */
  const fgSites = [[-10.8,10.7,1.25],[10.8,9.6,1.05],[-11.5,3.1,.86]];
  const fgGrass = grassInstances(fgSites, M.foregroundLeaf, 28);
  fgGrass.name = 'foreground-parallax-grasses';
  foreground.add(fgGrass);

  /* Near-lawn blade islands add silhouette/detail only where the camera can resolve it. */
  const turfBladeCount=900;
  const turfBlades=turfFieldInstances(M.turfBlade,turfBladeCount);
  turfBlades.name='near-lawn-detail';
  foreground.add(turfBlades);


  world.userData.layers = { site, house, pergola, kitchen, gathering, potager, landscape, foreground };
  world.userData.compositionStats = {
    paverInstances: paverTransforms.length,
    hedgeInstances: hedgePositions.length,
    shrubInstances: shrubTransforms.reduce((sum,items)=>sum+items.length,0),
    grassBladeInstances: grassSites.length * 28 + fgSites.length * 28 + turfBladeCount,
    farTreeCount: farTreeSites.length,
    heroAndMidTreeCount: 4
  };
  return world;
}

function namedGroup(name) {
  const group = new THREE.Group();
  group.name = name;
  return group;
}

function makeMaterials(maxAnisotropy) {
  const lawnMaps = groundTextureSet('lawn', 512, maxAnisotropy, 14);
  const mulchMaps = groundTextureSet('mulch', 512, maxAnisotropy, 10);
  const leafMap = leafTexture(128, maxAnisotropy);
  const flowerMap = flowerTexture(96, maxAnisotropy);
  const farCanopyMap = canopyTexture(256, maxAnisotropy);
  const cedarMaps=pbrTextureSet('cedar',256,maxAnisotropy,3);      /* Poly Haven brown_planks_08 */
  const paverMaps=surfaceTextureSet('paver',256,maxAnisotropy,2);
  const masonryMaps=surfaceTextureSet('masonry',256,maxAnisotropy,3);
  const sidingMaps=surfaceTextureSet('siding',256,maxAnisotropy,4);
  const stoneMaps=surfaceTextureSet('stone',256,maxAnisotropy,2);
  const fabricMaps=surfaceTextureSet('fabric',128,maxAnisotropy,5);
  const brushedMaps=surfaceTextureSet('brushed',128,maxAnisotropy,3);
  return {
    earth: new THREE.MeshLambertMaterial({ color:0x514332 }),
    lawn: new THREE.MeshStandardMaterial({
      color:0xffffff, map:lawnMaps.color, bumpMap:lawnMaps.detail,
      roughnessMap:lawnMaps.roughness, bumpScale:.055, roughness:.92, metalness:0
    }),
    lawnLight: new THREE.MeshStandardMaterial({
      color:0xd9e2c5, map:lawnMaps.color, bumpMap:lawnMaps.detail,
      roughnessMap:lawnMaps.roughness, bumpScale:.045, roughness:.94, metalness:0
    }),
    mulch: new THREE.MeshStandardMaterial({
      color:0xffffff, map:mulchMaps.color, bumpMap:mulchMaps.detail,
      roughnessMap:mulchMaps.roughness, bumpScale:.075, roughness:.98, metalness:0
    }),
    paver: new THREE.MeshStandardMaterial({
      color:0xe9e1cf, map:paverMaps.color, bumpMap:paverMaps.detail,
      roughnessMap:paverMaps.roughness, bumpScale:.028, roughness:.84, metalness:0
    }),
    edge: phongTextured(paverMaps,{ color:0xb3a78f, shininess:4, bumpScale:.025 }),
    stone: phongTextured(stoneMaps,{ color:0xc1b59e, shininess:4, bumpScale:.055 }),
    masonry: phongTextured(masonryMaps,{ color:0xc0af90, shininess:3, bumpScale:.085 }),
    siding: phongTextured(sidingMaps,{ color:0xd0c3aa, shininess:6, bumpScale:.025 }),
    /* premium stained cedar: Poly Haven brown_planks_08 — warm medium brown,
       restrained red undertone, matte exterior. Tint unifies board tone.
       `cedar` carries a 90°-rotated map so POST grain reads vertical;
       `cedarBeam` keeps the natural horizontal run for beams/rafters. */
    cedar: new THREE.MeshStandardMaterial({
      color:0xb08258, map:cedarMaps.color, normalMap:cedarMaps.detail,
      roughnessMap:cedarMaps.roughness, normalScale:new THREE.Vector2(.85,.85),
      roughness:.88, metalness:0
    }),
    cedarBeam: new THREE.MeshStandardMaterial({
      color:0xb08258, map:cedarMaps.color, normalMap:cedarMaps.detail,
      roughnessMap:cedarMaps.roughness, normalScale:new THREE.Vector2(.85,.85),
      roughness:.88, metalness:0
    }),
    cedarDark: new THREE.MeshStandardMaterial({
      color:0x6e5138, map:cedarMaps.color, normalMap:cedarMaps.detail,
      roughnessMap:cedarMaps.roughness, normalScale:new THREE.Vector2(.7,.7),
      roughness:.9, metalness:0
    }),
    roof: new THREE.MeshLambertMaterial({ color:0x292a28 }),
    trim: new THREE.MeshPhongMaterial({ color:0x252724, specular:0x555a56, shininess:32 }),
    steel: new THREE.MeshPhongMaterial({ color:0x303330, specular:0xadb3ae, shininess:52 }),
    steelLight: phongTextured(brushedMaps,{ color:0xe2e4df, shininess:78, bumpScale:.012 }),
    hardware: new THREE.MeshPhongMaterial({ color:0x171817, specular:0xb0b4af, shininess:70 }),
    /* charcoal bronze cabinetry — matte, warm dark, not green-gray */
    cabinet: new THREE.MeshStandardMaterial({ color:0x2e2b27, roughness:.52, metalness:.42 }),
    /* honed mid-warm stone counter for material separation against dark base */
    counter: new THREE.MeshStandardMaterial({
      color:0xa89e8c, map:stoneMaps.color, roughness:.38, metalness:.04
    }),
    /* restrained dark stone cladding for the kitchen base run */
    kitchenStone: new THREE.MeshStandardMaterial({
      color:0x57524b, map:stoneMaps.color, bumpMap:stoneMaps.detail,
      roughness:.62, metalness:.08, bumpScale:.04
    }),
    table: new THREE.MeshStandardMaterial({
      color:0x5f4a38, map:cedarMaps.color, normalMap:cedarMaps.detail,
      roughnessMap:cedarMaps.roughness, normalScale:new THREE.Vector2(.6,.6),
      roughness:.7, metalness:0
    }),
    upholstery: phongTextured(fabricMaps,{ color:0x6a6357, shininess:2, bumpScale:.018 }),
    cushion: phongTextured(fabricMaps,{ color:0xcfc4ab, shininess:2, bumpScale:.022 }),
    glass: new THREE.MeshPhongMaterial({
      color:0x78909a,specular:0xd5e3e8,shininess:92,transparent:true,opacity:.72
    }),
    interior: new THREE.MeshBasicMaterial({ color:0x87663f }),
    warmLight: new THREE.MeshBasicMaterial({ color:0xffbd67 }),
    water: new THREE.MeshPhongMaterial({ color:0x31576c,specular:0xc7e3eb,shininess:88 }),
    fence: new THREE.MeshStandardMaterial({ color:0x8a7c66, map:cedarMaps.color, normalMap:cedarMaps.detail, roughnessMap:cedarMaps.roughness, roughness:.94, metalness:0, normalScale:new THREE.Vector2(.5,.5) }),
    neighbor: new THREE.MeshLambertMaterial({ color:0x34332f }),
    bark: phongTextured(cedarMaps,{ color:0x5a4435, shininess:2, bumpScale:.08 }),
    canopy: new THREE.MeshLambertMaterial({
      color:0x49663d, map:leafMap, alphaMap:leafMap, alphaTest:.42,
      side:THREE.DoubleSide
    }),
    canopyLight: new THREE.MeshLambertMaterial({
      color:0x66804e, map:leafMap, alphaMap:leafMap, alphaTest:.42,
      side:THREE.DoubleSide
    }),
    farCanopy: new THREE.MeshLambertMaterial({
      color:0x3f5939, map:farCanopyMap, alphaMap:farCanopyMap, alphaTest:.40, side:THREE.DoubleSide
    }),
    hedge: new THREE.MeshLambertMaterial({
      color:0x3d5a36, map:leafMap, alphaMap:leafMap, alphaTest:.40,
      side:THREE.DoubleSide
    }),
    shrub: new THREE.MeshLambertMaterial({
      color:0x61754b, map:leafMap, alphaMap:leafMap, alphaTest:.40,
      side:THREE.DoubleSide
    }),
    groundcover: new THREE.MeshLambertMaterial({
      color:0x526744, map:leafMap, alphaMap:leafMap, alphaTest:.40,
      side:THREE.DoubleSide
    }),
    grass: new THREE.MeshLambertMaterial({ color:0x76804d, side:THREE.DoubleSide }),
    turfBlade: new THREE.MeshLambertMaterial({ color:0x71834e, side:THREE.DoubleSide }),
    foregroundLeaf: new THREE.MeshLambertMaterial({ color:0x405a36, side:THREE.DoubleSide }),
    flowerLavender: new THREE.MeshLambertMaterial({
      color:0x9989ae, map:flowerMap, alphaMap:flowerMap, alphaTest:.42, side:THREE.DoubleSide
    }),
    flowerCream: new THREE.MeshLambertMaterial({
      color:0xe2d3ad, map:flowerMap, alphaMap:flowerMap, alphaTest:.42, side:THREE.DoubleSide
    }),
    flowerCoral: new THREE.MeshLambertMaterial({
      color:0xc78678, map:flowerMap, alphaMap:flowerMap, alphaTest:.42, side:THREE.DoubleSide
    }),
    fireDark: new THREE.MeshStandardMaterial({ color:0x1c1915, roughness:.38, metalness:.65 }),
    fire: new THREE.MeshBasicMaterial({ color:0xff8135 })
  };
}

function seeded(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function configureTexture(texture, repeat, anisotropy, color=false) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = anisotropy;
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function groundTextureSet(kind, size, anisotropy, repeat) {
  const colorCanvas = document.createElement('canvas');
  const detailCanvas = document.createElement('canvas');
  const roughCanvas = document.createElement('canvas');
  colorCanvas.width = colorCanvas.height = size;
  detailCanvas.width = detailCanvas.height = size;
  roughCanvas.width = roughCanvas.height = size;
  const c = colorCanvas.getContext('2d');
  const d = detailCanvas.getContext('2d');
  const r = roughCanvas.getContext('2d');
  const random = seeded(kind === 'lawn' ? 19073 : 88421);
  const base = kind === 'lawn' ? [74,99,53] : [70,48,34];
  c.fillStyle = `rgb(${base.join(',')})`; c.fillRect(0,0,size,size);
  d.fillStyle = '#777'; d.fillRect(0,0,size,size);
  r.fillStyle = kind === 'lawn' ? '#e7e7e7' : '#f1f1f1'; r.fillRect(0,0,size,size);

  const count = kind === 'lawn' ? 15500 : 9200;
  for (let i=0;i<count;i++) {
    const x=random()*size, y=random()*size;
    const value=(random()-.5)*(kind==='lawn'?34:46);
    const rr=Math.max(0,Math.min(255,base[0]+value));
    const gg=Math.max(0,Math.min(255,base[1]+value*(kind==='lawn'?1.2:.75)));
    const bb=Math.max(0,Math.min(255,base[2]+value*.55));
    c.fillStyle=`rgba(${rr|0},${gg|0},${bb|0},${.18+random()*.34})`;
    const w=kind==='lawn' ? .6+random()*1.2 : 1+random()*4.5;
    const h=kind==='lawn' ? 2+random()*6 : .7+random()*2.0;
    c.save(); c.translate(x,y); c.rotate((random()-.5)*(kind==='lawn'?.45:2.8));
    c.fillRect(-w/2,-h/2,w,h); c.restore();
    const gray=kind==='lawn' ? 90+(random()*74)|0 : 65+(random()*98)|0;
    d.fillStyle=`rgba(${gray},${gray},${gray},.48)`; d.fillRect(x,y,w,h);
    const rough=kind==='lawn' ? 205+(random()*48)|0 : 218+(random()*35)|0;
    r.fillStyle=`rgba(${rough},${rough},${rough},.42)`; r.fillRect(x,y,w*1.4,h*1.4);
  }
  return {
    color: configureTexture(new THREE.CanvasTexture(colorCanvas),repeat,anisotropy,true),
    detail: configureTexture(new THREE.CanvasTexture(detailCanvas),repeat,anisotropy),
    roughness: configureTexture(new THREE.CanvasTexture(roughCanvas),repeat,anisotropy)
  };
}

function phongTextured(maps,{color=0xffffff,shininess=12,bumpScale=.03}={}) {
  return new THREE.MeshPhongMaterial({
    color,map:maps.color,specular:0x77736b,shininess
  });
}

/* Real PBR set served from ./assets/textures/<kind>/ — downloaded from
   Poly Haven (CC0). `post` variant is the same maps rotated 90° so box
   side-faces read vertical grain on posts. */
function pbrTextureSet(kind,size,anisotropy,repeat) {
  const load=(file,srgb,rot)=> {
    const tex=new THREE.TextureLoader().load(`./assets/textures/${kind}/${file}`);
    tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
    tex.anisotropy=anisotropy;
    tex.minFilter=THREE.LinearMipmapLinearFilter;
    if (rot) { tex.center.set(.5,.5); tex.rotation=Math.PI/2; }
    tex.needsUpdate=true;
    return tex;
  };
  const set={
    color:load(`${kind}_diff_1k.jpg`,true,false),
    detail:load(`${kind}_nor_gl_1k.jpg`,false,false),
    roughness:load(`${kind}_rough_1k.jpg`,false,false)
  };
  set.post={
    color:load(`${kind}_diff_1k.jpg`,true,true),
    detail:load(`${kind}_nor_gl_1k.jpg`,false,true),
    roughness:load(`${kind}_rough_1k.jpg`,false,true)
  };
  return set;
}

function surfaceTextureSet(kind,size,anisotropy,repeat) {
  const colorCanvas=document.createElement('canvas'),detailCanvas=document.createElement('canvas'),roughCanvas=document.createElement('canvas');
  for(const canvas of [colorCanvas,detailCanvas,roughCanvas]) canvas.width=canvas.height=size;
  const c=colorCanvas.getContext('2d'),d=detailCanvas.getContext('2d'),r=roughCanvas.getContext('2d');
  const random=seeded(kind.split('').reduce((sum,ch)=>sum+ch.charCodeAt(0)*31,9187));
  const bases={cedar:[154,95,52],paver:[181,173,154],masonry:[145,132,110],siding:[192,183,165],stone:[104,101,94],fabric:[110,109,101],brushed:[175,180,177]};
  const base=bases[kind]||[128,128,128];
  c.fillStyle=`rgb(${base.join(',')})`;c.fillRect(0,0,size,size);d.fillStyle='#808080';d.fillRect(0,0,size,size);r.fillStyle='#cfcfcf';r.fillRect(0,0,size,size);
  if(kind==='cedar'){
    for(let i=0;i<180;i++){const y=random()*size,w=.4+random()*1.8,shade=(random()-.5)*42;c.strokeStyle=`rgba(${base[0]+shade|0},${base[1]+shade*.55|0},${base[2]+shade*.3|0},${.16+random()*.32})`;c.lineWidth=w;c.beginPath();c.moveTo(0,y);for(let x=0;x<=size;x+=16)c.lineTo(x,y+Math.sin(x*.045+random()*4)*(1+random()*2.5));c.stroke();d.strokeStyle=`rgba(105,105,105,${.12+random()*.24})`;d.lineWidth=w;d.stroke();}
  } else if(kind==='masonry'){
    const h=32;for(let row=0;row<size/h;row++)for(let x=-32+(row%2)*22;x<size;x+=58){const tone=(random()-.5)*28;c.fillStyle=`rgba(${base[0]+tone|0},${base[1]+tone|0},${base[2]+tone*.8|0},.42)`;c.fillRect(x+2,row*h+2,53,h-4);d.strokeStyle='rgba(70,70,70,.35)';d.strokeRect(x+2,row*h+2,53,h-4);}
  } else if(kind==='siding'){
    for(let x=0;x<size;x+=18){c.fillStyle='rgba(255,255,255,.10)';c.fillRect(x,0,2,size);d.fillStyle='rgba(90,90,90,.18)';d.fillRect(x+2,0,1,size);}
  } else if(kind==='fabric'){
    for(let i=0;i<size;i+=4){c.fillStyle='rgba(255,255,255,.035)';c.fillRect(i,0,1,size);c.fillRect(0,i,size,1);d.fillStyle='rgba(100,100,100,.16)';d.fillRect(i+1,0,1,size);d.fillRect(0,i+1,size,1);}
  } else if(kind==='brushed'){
    for(let i=0;i<280;i++){const y=random()*size,alpha=.04+random()*.11;c.fillStyle=`rgba(255,255,255,${alpha})`;c.fillRect(0,y,size,.5+random());r.fillStyle='rgba(120,120,120,.12)';r.fillRect(0,y,size,.5);}
  } else {
    const count=kind==='paver'?4300:3200;for(let i=0;i<count;i++){const x=random()*size,y=random()*size,rad=.3+random()*(kind==='paver'?1.4:2.2),tone=(random()-.5)*34;c.fillStyle=`rgba(${base[0]+tone|0},${base[1]+tone|0},${base[2]+tone|0},${.10+random()*.24})`;c.fillRect(x,y,rad,rad);const gray=100+random()*55|0;d.fillStyle=`rgba(${gray},${gray},${gray},.24)`;d.fillRect(x,y,rad,rad);}
  }
  return {color:configureTexture(new THREE.CanvasTexture(colorCanvas),repeat,anisotropy,true),detail:configureTexture(new THREE.CanvasTexture(detailCanvas),repeat,anisotropy),roughness:configureTexture(new THREE.CanvasTexture(roughCanvas),repeat,anisotropy)};
}

function leafTexture(size, anisotropy) {
  const canvas=document.createElement('canvas'); canvas.width=canvas.height=size;
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,size,size);
  ctx.save(); ctx.translate(size/2,size/2); ctx.rotate(-.16);
  ctx.beginPath();
  ctx.moveTo(-size*.38,0);
  ctx.bezierCurveTo(-size*.12,-size*.42,size*.34,-size*.30,size*.43,0);
  ctx.bezierCurveTo(size*.25,size*.28,-size*.18,size*.38,-size*.38,0);
  ctx.closePath();
  const gradient=ctx.createLinearGradient(-size*.35,-size*.2,size*.4,size*.25);
  gradient.addColorStop(0,'rgba(220,230,205,.96)');
  gradient.addColorStop(.55,'rgba(255,255,245,1)');
  gradient.addColorStop(1,'rgba(180,200,166,.94)');
  ctx.fillStyle=gradient; ctx.fill();
  ctx.strokeStyle='rgba(125,145,112,.82)'; ctx.lineWidth=Math.max(1,size*.018);
  ctx.beginPath(); ctx.moveTo(-size*.35,0); ctx.lineTo(size*.36,0); ctx.stroke();
  ctx.restore();
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.anisotropy=anisotropy;
  return texture;
}

function flowerTexture(size, anisotropy) {
  const canvas=document.createElement('canvas'); canvas.width=canvas.height=size;
  const ctx=canvas.getContext('2d'); ctx.translate(size/2,size/2);
  for(let i=0;i<7;i++){
    const a=i*Math.PI*2/7;
    ctx.beginPath(); ctx.ellipse(Math.cos(a)*size*.18,Math.sin(a)*size*.18,
      size*.14,size*.09,a,0,Math.PI*2);
    ctx.fillStyle='rgba(255,244,226,.98)'; ctx.fill();
  }
  ctx.beginPath(); ctx.arc(0,0,size*.10,0,Math.PI*2); ctx.fillStyle='#c99155'; ctx.fill();
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.anisotropy=anisotropy;
  return texture;
}

function canopyTexture(size, anisotropy) {
  const canvas=document.createElement('canvas'); canvas.width=canvas.height=size;
  const ctx=canvas.getContext('2d'),random=seeded(44017);
  ctx.clearRect(0,0,size,size);
  for(let i=0;i<42;i++){
    const a=random()*Math.PI*2,r=Math.pow(random(),.7)*size*.27;
    const x=size*.5+Math.cos(a)*r,y=size*.52+Math.sin(a)*r*.72;
    const rx=size*(.08+random()*.09),ry=rx*(.72+random()*.34);
    ctx.beginPath(); ctx.ellipse(x,y,rx,ry,random()*Math.PI,0,Math.PI*2);
    const value=180+(random()*70)|0;
    ctx.fillStyle=`rgba(${value},${Math.min(255,value+12)},${value-12},.98)`; ctx.fill();
  }
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.anisotropy=anisotropy;
  return texture;
}

function box(parent,w,h,d,material,x,y,z,ry=0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material);
  mesh.position.set(x,y+h/2,z);
  mesh.rotation.y = ry;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function roundedBoxGeometry(w,h,d,bevel=.025) {
  const key=`${w}:${h}:${d}:${bevel}`;
  if(HERO_GEOMETRY_CACHE.has(key))return HERO_GEOMETRY_CACHE.get(key);
  const radius=Math.min(bevel*1.6,w*.18,h*.18);
  const shape=new THREE.Shape(),x=-w/2,y=-h/2;
  shape.moveTo(x+radius,y);shape.lineTo(x+w-radius,y);shape.quadraticCurveTo(x+w,y,x+w,y+radius);
  shape.lineTo(x+w,y+h-radius);shape.quadraticCurveTo(x+w,y+h,x+w-radius,y+h);
  shape.lineTo(x+radius,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-radius);
  shape.lineTo(x,y+radius);shape.quadraticCurveTo(x,y,x+radius,y);
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:Math.max(.001,d-bevel*2),bevelEnabled:true,bevelSegments:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:1});
  geometry.center();geometry.computeVertexNormals();HERO_GEOMETRY_CACHE.set(key,geometry);return geometry;
}

function heroBox(parent,w,h,d,material,x,y,z,ry=0,bevel=.025) {
  const mesh=new THREE.Mesh(roundedBoxGeometry(w,h,d,bevel),material);
  mesh.position.set(x,y+h/2,z);mesh.rotation.y=ry;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}

function plane(parent,w,d,material,x,y,z) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w,d),material);
  mesh.rotation.x = -Math.PI/2;
  mesh.position.set(x,y,z);
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function shapePatch(parent,points,material,y) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0],points[0][1]);
  points.slice(1).forEach(([x,z])=>shape.lineTo(x,z));
  shape.closePath();
  const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape),material);
  mesh.rotation.x = -Math.PI/2;
  mesh.position.y = y;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function instances(geometry,material,transforms) {
  const mesh = new THREE.InstancedMesh(geometry,material,transforms.length);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  transforms.forEach(([x,y,z,ry=0,sx=1,sy=1,sz=1],i)=>{
    quaternion.setFromEuler(new THREE.Euler(0,ry,0));
    matrix.compose(new THREE.Vector3(x,y,z),quaternion,new THREE.Vector3(sx,sy,sz));
    mesh.setMatrixAt(i,matrix);
  });
  return mesh;
}

function beam(parent,a,b,width,material) {
  const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
  const delta = end.clone().sub(start), length = delta.length();
  const mesh = new THREE.Mesh(roundedBoxGeometry(width,length,width,Math.min(.012,width*.12)),material);
  mesh.position.copy(start).add(end).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function branchCylinder(parent,a,b,rStart,rEnd,material) {
  const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rEnd,rStart,delta.length(),10),material);
  mesh.position.copy(start).add(end).multiplyScalar(.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
  mesh.castShadow=true;parent.add(mesh);return mesh;
}

function roofSilhouette(parent,x,z,w,h,material) {
  const roof = box(parent,w,.34,4.0,material,x,h,z);
  roof.rotation.z = x<0 ? .11 : -.09;
}

function chair(parent,x,z,ry,M) {
  const group = namedGroup('dining-chair');
  group.position.set(x,0,z); group.rotation.y=ry;
  heroBox(group,.52,.11,.48,M.cushion,0,.52,0,0,.028);
  const back=heroBox(group,.52,.62,.11,M.upholstery,0,.58,.19,0,.032);back.rotation.x=-.07;
  for(const dx of [-.20,.20]) for(const dz of [-.17,.17])
    heroBox(group,.055,.54,.055,M.steel,dx,.08,dz,0,.009);
  parent.add(group);
}

function sofa(parent,x,z,ry,M) {
  const group = namedGroup('lounge-sofa');
  group.position.set(x,0,z); group.rotation.y=ry;
  heroBox(group,2.15,.30,.82,M.upholstery,0,.18,0,0,.045);
  heroBox(group,1.92,.20,.66,M.cushion,0,.49,-.03,0,.055);
  const back=heroBox(group,2.06,.66,.20,M.upholstery,0,.35,.31,0,.045);back.rotation.x=-.06;
  heroBox(group,.20,.55,.80,M.upholstery,-1.0,.22,0,0,.035);
  heroBox(group,.20,.55,.80,M.upholstery,1.0,.22,0,0,.035);
  heroBox(group,.018,.012,.58,M.hardware,0,.675,-.03,0,.005);
  parent.add(group);
}

function addPotager(parent,M) {
  const bed=(name,x,z,w,d,metal=false)=>{
    const group=namedGroup(name);group.position.set(x,0,z);
    const frame=metal?M.steel:M.cedarDark;
    heroBox(group,w,.38,.12,frame,0,.08,-d/2,0,.018);
    heroBox(group,w,.38,.12,frame,0,.08,d/2,0,.018);
    heroBox(group,.12,.38,d-.2,frame,-w/2,.08,0,0,.018);
    heroBox(group,.12,.38,d-.2,frame,w/2,.08,0,0,.018);
    heroBox(group,w-.18,.18,d-.18,M.mulch,0,.12,0,0,.012);
    for(const [cx,cz] of [[-w/2,-d/2],[w/2,-d/2],[-w/2,d/2],[w/2,d/2]])
      heroBox(group,.16,.46,.16,frame,cx,.04,cz,0,.018);
    parent.add(group);return group;
  };
  const herbBed=bed('cedar-herb-bed',7.2,-9.2,2.5,1.15,false);
  const vegetableBed=bed('dark-metal-vegetable-bed',9.9,-10.1,2.8,1.35,true);

  const herbTransforms=[];
  const herbPoints=[[-.86,-.30],[-.42,.22],[0,-.24],[.44,.26],[.88,-.18]];
  herbPoints.forEach(([x,z],i)=>herbTransforms.push([x,.31,z,i*.73,.42+(i%2)*.08,.36+(i%3)*.05,.42]));
  const herbs=instances(foliageClumpGeometry(2429,8),M.groundcover,herbTransforms);
  herbs.name='rosemary-thyme-sage-basil';herbBed.add(herbs);

  const greens=[];
  for(let row=0;row<2;row++)for(let col=0;col<4;col++)
    greens.push([-.92+col*.61,.31,-.30+row*.60,(row*4+col)*.58,.34,.28,.34]);
  const lettuce=instances(foliageClumpGeometry(3109,10),M.shrub,greens);
  lettuce.name='lettuce-kale-greens';vegetableBed.add(lettuce);

  /* Two restrained tomato/pepper supports supply a lived-in cue without farm clutter. */
  for(const x of [-.55,.48]){
    heroBox(vegetableBed,.035,1.15,.035,M.hardware,x,.36,.08,0,.006);
    beam(vegetableBed,[x-.22,1.10,.08],[x+.22,1.10,.08],.025,M.hardware);
    const vine=instances(foliageClumpGeometry(4021+(x>0?1:0),7),M.canopyLight,[[x,.45,.08,0,.52,.58,.52]]);
    vegetableBed.add(vine);
    for(let i=0;i<3;i++){
      const fruit=new THREE.Mesh(new THREE.SphereGeometry(.055,8,6),i===2?M.flowerCoral:M.fire);
      fruit.position.set(x+(i-1)*.13,.72+i*.12,.16-(i%2)*.18);vegetableBed.add(fruit);
    }
  }
}

function addHeroFlowerCluster(parent,x,z,M,flowerMaterial,scale=1) {
  const group=namedGroup('hero-flower-cluster');group.position.set(x,0,z);
  const foliage=instances(foliageClumpGeometry(5119+Math.round(x*17),18),M.shrub,[[0,.02,0,0,1.15*scale,.82*scale,1.05*scale]]);
  group.add(foliage);
  const heads=[];
  for(let i=0;i<9;i++){
    const a=i*2.399,r=Math.sqrt((i+.5)/9)*.62*scale;
    heads.push([Math.cos(a)*r,.56*scale+(i%3)*.11,Math.sin(a)*r,a,.58*scale,.58*scale,.58*scale]);
  }
  const flowers=instances(crossedLeafGeometry(.42,.42),flowerMaterial,heads);group.add(flowers);parent.add(group);
}

function addTree(parent,x,z,s,M,kind='round') {
  const group = namedGroup(`${kind}-tree`);
  group.position.set(x,0,z);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.15*s,.30*s,3.6*s,12),M.bark);
  trunk.position.y=1.8*s; trunk.castShadow=true; group.add(trunk);
  branchCylinder(group,[0,2.25*s,0],[-.78*s,3.62*s,.14*s],.13*s,.065*s,M.bark);
  branchCylinder(group,[0,2.62*s,0],[.72*s,4.02*s,-.18*s],.12*s,.058*s,M.bark);
  branchCylinder(group,[-.55*s,3.22*s,.10*s],[-1.18*s,4.02*s,-.18*s],.07*s,.028*s,M.bark);
  branchCylinder(group,[-.62*s,3.42*s,.12*s],[-.30*s,4.42*s,.42*s],.06*s,.025*s,M.bark);
  branchCylinder(group,[.55*s,3.58*s,-.14*s],[1.15*s,4.45*s,.10*s],.065*s,.026*s,M.bark);
  branchCylinder(group,[.38*s,3.46*s,-.10*s],[.10*s,4.70*s,-.48*s],.055*s,.022*s,M.bark);
  const forms = kind==='upright'
    ? [[0,4.5,0,.88,1.08,1.02],[-.55,4.0,.12,.68,.82,.78],[.48,5.25,-.1,.62,.82,.72],
       [.30,3.78,.22,.58,.70,.64],[-.28,5.70,-.18,.50,.66,.58]]
    : kind==='sculptural'
      ? [[0,4.2,0,1.02,.72,.86],[-.88,3.82,.1,.76,.68,.72],[.88,4.55,-.16,.82,.68,.76],
         [.15,5.18,.08,.70,.62,.66],[-1.18,4.55,-.18,.52,.58,.54],[1.12,3.95,.18,.54,.56,.58]]
      : [[0,4.35,0,1.00,.84,.88],[-.78,4.0,.08,.72,.72,.72],[.72,4.45,-.12,.78,.74,.76],
         [.08,5.08,.1,.66,.66,.64],[-.18,3.62,-.18,.62,.58,.62],[1.02,4.05,.18,.52,.58,.54]];
  const dark=[], light=[];
  const random=seeded(((x+30)*917+(z+30)*613+(kind.length*101))|0);
  forms.forEach(([cx,cy,cz,sx,sy,sz],formIndex)=>{
    const count=kind==='sculptural'?12:10;
    for(let i=0;i<count;i++){
      const a=random()*Math.PI*2;
      const rr=Math.pow(random(),.62);
      const px=(cx+(Math.cos(a)*rr*sx))*s;
      const py=(cy+((random()-.5)*2*sy))*s;
      const pz=(cz+(Math.sin(a)*rr*sz))*s;
      const size=(.52+random()*.54)*s;
      const target=(i+formIndex)%3===0?light:dark;
      target.push([px,py,pz,random()*Math.PI,size,size,size]);
    }
  });
  const leafGeometry=crossedLeafGeometry(.72,.38);
  const darkLeaves=instances(leafGeometry,M.canopy,dark);
  const lightLeaves=instances(leafGeometry,M.canopyLight,light);
  group.add(darkLeaves,lightLeaves);
  group.position.set(0,0,0);
  const low=namedGroup(`${kind}-tree-low`);
  const lowTrunk=new THREE.Mesh(new THREE.CylinderGeometry(.13*s,.24*s,3.2*s,7),M.bark);
  lowTrunk.position.y=1.6*s;low.add(lowTrunk);
  const lowCrown=new THREE.Mesh(crossedLeafGeometry(3.0*s,2.55*s),M.farCanopy);
  lowCrown.position.y=4.3*s;low.add(lowCrown);
  const lod=new THREE.LOD();lod.name=`${kind}-tree-lod`;lod.position.set(x,0,z);
  lod.addLevel(group,0);lod.addLevel(low,24);parent.add(lod);
}

function addInstancedTrees(parent,sites,M,{far=false}={}) {
  const trunkTransforms=[], canopyTransforms=[];
  sites.forEach(([x,z,s],i)=>{
    trunkTransforms.push([x,(far?1.05:1.45)*s,z,0,s,s,s]);
    const lobes=far?1:4;
    for(let j=0;j<lobes;j++){
      const a=j*2.1+i*.71;
      const spread=far?0:1;
      canopyTransforms.push([x+Math.cos(a)*.68*s*spread,((far?2.78:3.35)+j*.28)*s,z+Math.sin(a)*.36*s*spread,
        a,s*(far?.94:.78-j*.06),s*(far?.78:.64-j*.04),s*(far?.88:.72-j*.05)]);
    }
  });
  const farTrunks=instances(new THREE.CylinderGeometry(.13,.22,far?2.1:2.9,7),M.bark,trunkTransforms);
  const farCanopies=instances(crossedLeafGeometry(2.45,2.15),M.farCanopy,canopyTransforms);
  if (far) { farTrunks.name='far-canopy-trunks'; farCanopies.name='far-canopy-trees'; }
  parent.add(farTrunks, farCanopies);
}

function crossedLeafGeometry(width,height) {
  const w=width/2,h=height/2;
  const positions=new Float32Array([
    -w,-h,0,  w,-h,0,  w,h,0,  -w,h,0,
    0,-h,-w, 0,-h,w, 0,h,w, 0,h,-w
  ]);
  const uvs=new Float32Array([0,0,1,0,1,1,0,1, 0,0,1,0,1,1,0,1]);
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('uv',new THREE.BufferAttribute(uvs,2));
  geometry.setIndex([0,1,2,0,2,3, 4,5,6,4,6,7]);
  geometry.computeVertexNormals();
  return geometry;
}

function grassBladeGeometry() {
  const positions=new Float32Array([
    -.045,0,0, .045,0,0, .025,.58,0, 0,.92,0, -.025,.58,0,
    0,0,-.045, 0,0,.045, 0,.58,.025, 0,.92,0, 0,.58,-.025
  ]);
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geometry.setIndex([0,1,2,0,2,4,4,2,3, 5,6,7,5,7,9,9,7,8]);
  geometry.computeVertexNormals();
  return geometry;
}

function foliageClumpGeometry(seed,count) {
  const random=seeded(seed),positions=[],uvs=[],indices=[];
  const addQuad=(cx,cy,cz,width,height,angle)=>{
    const base=positions.length/3;
    const dx=Math.cos(angle)*width/2,dz=Math.sin(angle)*width/2;
    positions.push(
      cx-dx,cy,cz-dz, cx+dx,cy,cz+dz,
      cx+dx,cy+height,cz+dz, cx-dx,cy+height,cz-dz
    );
    uvs.push(0,0,1,0,1,1,0,1);
    indices.push(base,base+1,base+2,base,base+2,base+3);
  };
  for(let i=0;i<count;i++){
    const a=random()*Math.PI*2,r=Math.pow(random(),.65)*.62;
    const cx=Math.cos(a)*r,cz=Math.sin(a)*r*.78;
    const cy=.08+random()*.66;
    const width=.26+random()*.26,height=.17+random()*.20;
    const angle=random()*Math.PI;
    addQuad(cx,cy,cz,width,height,angle);
    addQuad(cx,cy,cz,width*.92,height*.92,angle+Math.PI/2);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}

function grassInstances(sites,material,bladesPerSite) {
  const geometry=grassBladeGeometry();
  const transforms=[];
  sites.forEach(([cx,cz,cs],cluster)=>{
    for(let i=0;i<bladesPerSite;i++){
      const a=i*2.399+cluster*.67;
      const r=Math.sqrt((i+.5)/bladesPerSite)*.74*cs;
      const h=(.72+((i*11+cluster*5)%9)/18)*cs;
      const lean=(i%5-2)*.035;
      transforms.push([cx+Math.cos(a)*r,.02,cz+Math.sin(a)*r,a,.72+lean,h,.72-lean]);
    }
  });
  return instances(geometry,material,transforms);
}

function turfFieldInstances(material,count) {
  const geometry=grassBladeGeometry(),transforms=[],random=seeded(73911);
  for(let i=0;i<count;i++){
    let x,z;
    do {
      x=-11+random()*21;
      z=3.2+random()*6.5;
    } while (x>5.2 && z<5.2);
    const h=.10+random()*.12;
    transforms.push([x,.022,z,random()*Math.PI,h*(.84+random()*.18),h,h*(.86+random()*.22)]);
  }
  return instances(geometry,material,transforms);
}

function flowerMassInstances(sites,material,seed,sizeScale=1) {
  const transforms=[],random=seeded(seed);
  sites.forEach(([cx,cz],cluster)=>{
    const count=20+(cluster%3)*3;
    for(let i=0;i<count;i++){
      const a=random()*Math.PI*2;
      const r=Math.sqrt(random())*(.72+(cluster%2)*.18);
      const scale=(.72+random()*.48)*sizeScale;
      transforms.push([cx+Math.cos(a)*r,.20+random()*.24,cz+Math.sin(a)*r,a,
        scale,scale*(.9+random()*.18),scale]);
    }
  });
  return instances(crossedLeafGeometry(.42,.42),material,transforms);
}

function groundcoverInstances(sites,material) {
  const transforms=[];
  sites.forEach(([cx,cz],cluster)=>{
    const count=3+(cluster%2);
    for(let i=0;i<count;i++){
      const a=i*2.31+cluster*.47,r=.18+(i%2)*.28;
      transforms.push([cx+Math.cos(a)*r,.025,cz+Math.sin(a)*r,a,
        .52+(i%3)*.08,.34+(i%2)*.05,.50+(i%4)*.06]);
    }
  });
  return instances(foliageClumpGeometry(1877,6),material,transforms);
}