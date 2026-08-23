/* ════════════════════════════════════════════════════════════════
   AFTERGLOW · world.js — residential environment composition
   One persistent environment. World units are meters; the yard runs
   north along −Z. This pass establishes site hierarchy and depth only:
   deliberately simple materials remain for the next texture pass.
   ════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';

export function buildWorld(scene) {
  const world = new THREE.Group();
  world.name = 'afterglow-world';
  scene.add(world);

  const site = new THREE.Group();
  const architecture = new THREE.Group();
  const landscape = new THREE.Group();
  const foreground = new THREE.Group();
  site.name = 'site';
  architecture.name = 'hero-architecture';
  landscape.name = 'landscape';
  foreground.name = 'foreground-framing';
  world.add(site, architecture, landscape, foreground);

  const M = {
    ground:  new THREE.MeshLambertMaterial({ color: 0x594b35 }),
    lawn:    new THREE.MeshLambertMaterial({ color: 0x52623b }),
    lawn2:   new THREE.MeshLambertMaterial({ color: 0x617047 }),
    soil:    new THREE.MeshLambertMaterial({ color: 0x443425 }),
    mulch:   new THREE.MeshLambertMaterial({ color: 0x493322 }),
    stone:   new THREE.MeshLambertMaterial({ color: 0xaaa087 }),
    cedar:   new THREE.MeshLambertMaterial({ color: 0x996037 }),
    steel:   new THREE.MeshLambertMaterial({ color: 0x1c1b19 }),
    dark:    new THREE.MeshLambertMaterial({ color: 0x25221c }),
    siding:  new THREE.MeshLambertMaterial({ color: 0xb7aa91 }),
    masonry: new THREE.MeshLambertMaterial({ color: 0x8f836e }),
    trim:    new THREE.MeshLambertMaterial({ color: 0x292824 }),
    glass:   new THREE.MeshPhongMaterial({ color: 0x283a42, shininess: 75, specular: 0x607b86 }),
    interior:new THREE.MeshBasicMaterial({ color: 0xd59a58 }),
    leaf:    new THREE.MeshLambertMaterial({ color: 0x34472b }),
    leaf2:   new THREE.MeshLambertMaterial({ color: 0x52603a }),
    flower:  new THREE.MeshLambertMaterial({ color: 0x8f776f }),
    bark:    new THREE.MeshLambertMaterial({ color: 0x3a2d22 }),
    fence:   new THREE.MeshLambertMaterial({ color: 0x4a463b }),
    water:   new THREE.MeshPhongMaterial({ color: 0x29485e, shininess: 90, specular: 0x88aabb })
  };
  world.userData.M = M;

  const box = (parent, w, h, d, mat, x, y, z, ry = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y + h / 2, z);
    mesh.rotation.y = ry;
    parent.add(mesh);
    return mesh;
  };

  const organicPatch = (parent, points, mat, y = .01) => {
    const shape = new THREE.Shape();
    shape.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, z]) => shape.lineTo(x, z));
    shape.closePath();
    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = y;
    parent.add(mesh);
    return mesh;
  };

  /* ── site and irregular lawn ─────────────────────────────────── */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), M.ground);
  ground.rotation.x = -Math.PI / 2;
  site.add(ground);

  organicPatch(site, [
    [-15, 8], [-7, 10], [1, 9.2], [9, 7.5], [15, 4], [16, -5],
    [13, -13], [6, -18], [-4, -18.8], [-12, -16], [-16, -9], [-17, 0]
  ], M.lawn, .018);
  organicPatch(site, [
    [-13, 6], [-7, 8], [-1, 7.2], [5, 5.8], [7, 1], [4, -2],
    [-4, -1], [-10, 1]
  ], M.lawn2, .021);

  /* Curved planting masses define lawn edges rather than a green rectangle. */
  organicPatch(landscape, [
    [-17, 8], [-12, 9], [-8, 7.5], [-6, 4], [-7, 1], [-12, .5], [-17, 2]
  ], M.mulch, .035);
  organicPatch(landscape, [
    [6, 8], [12, 7], [17, 3], [17, -5], [14, -7], [10, -4], [8, 0]
  ], M.mulch, .035);
  organicPatch(landscape, [
    [-15, -11], [-10, -14], [-3, -16], [5, -16.8], [11, -14],
    [13, -10], [9, -8], [2, -10], [-6, -9]
  ], M.soil, .033);

  /* ── limestone patio and hero installation ──────────────────── */
  box(architecture, 13, .16, 10, M.stone, -1.4, 0, -3.2);
  for (let i = 0; i < 6; i++)
    box(architecture, .045, .162, 10, M.dark, -6.9 + i * 2.2, 0, -3.2);

  const P = { x: -4.2, z: -4.6 };
  const px = 2.6, pz = 1.8, postH = 2.75;
  [[-px,-pz],[px,-pz],[-px,pz],[px,pz]].forEach(([dx,dz]) => {
    box(architecture, .22, postH, .22, M.cedar, P.x + dx, .16, P.z + dz);
    box(architecture, .30, .18, .30, M.steel, P.x + dx, .16, P.z + dz);
  });
  box(architecture, 2 * px + .7, .24, .16, M.cedar, P.x, postH + .16, P.z - pz);
  box(architecture, 2 * px + .7, .24, .16, M.cedar, P.x, postH + .16, P.z + pz);
  for (let i = 0; i <= 7; i++) {
    const rz = P.z - pz + (i / 7) * 2 * pz;
    box(architecture, .12, .14, 2 * pz + .3, M.cedar, P.x, postH + .40, rz);
  }
  box(architecture, 2 * px + .8, .10, 2.4, M.dark, P.x, postH + .52, P.z - .62);

  box(architecture, 4.6, 1.02, .78, M.masonry, 2.9, .16, -6.9);
  box(architecture, 4.7, .07, .84, M.steel, 2.9, 1.18, -6.9);
  box(architecture, 1.15, .78, .60, M.steel, 3.6, 1.25, -6.9);

  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.72, .58, .42, 20), M.dark);
  bowl.position.set(1.1, .37, -3.4);
  architecture.add(bowl);
  const flame = new THREE.Mesh(new THREE.ConeGeometry(.30, .62, 12),
    new THREE.MeshBasicMaterial({ color: 0xff8a3c }));
  flame.position.set(1.1, .92, -3.4);
  flame.visible = false;
  architecture.add(flame);
  world.userData.flame = flame;

  box(architecture, 2.5, .52, .95, M.dark, -4.2, .16, -2.2);
  box(architecture, .28, .62, .95, M.dark, -5.45, .16, -2.2);
  box(architecture, 2.5, .52, .95, M.dark, -4.2, .16, -7.0);
  box(architecture, .28, .62, .95, M.dark, -2.95, .16, -7.0);

  /* Existing water element retained and integrated into the rear garden. */
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 3.4), M.water);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(-6.5, .05, -11.5);
  architecture.add(pool);

  /* ── restrained rear-house facade ────────────────────────────── */
  const house = new THREE.Group();
  house.name = 'rear-house';
  house.position.set(10.4, 0, 1.2);
  house.rotation.y = -.16;
  architecture.add(house);
  box(house, 8.4, 2.85, 4.0, M.siding, 0, 0, 0);
  box(house, 2.45, 2.78, 4.15, M.masonry, -2.95, 0, -.02);
  box(house, 8.95, .20, 4.45, M.trim, -.10, 2.82, 0);
  const roof = box(house, 9.45, .32, 4.80, M.dark, -.10, 3.00, 0);
  roof.rotation.z = -.035;
  /* Openings face the camera path; the warm panel reads as restrained interior light. */
  box(house, 2.55, 2.30, .10, M.trim, -.55, .16, 2.03);
  box(house, 2.30, 2.08, .07, M.glass, -.55, .27, 2.10);
  box(house, 1.75, 1.30, .10, M.trim, 2.45, .98, 2.03);
  box(house, 1.52, 1.08, .07, M.glass, 2.45, 1.09, 2.10);
  box(house, 1.74, 1.56, .06, M.interior, -.55, .50, 2.14);
  for (const x of [-2.75, 1.25]) {
    box(house, .16, .22, .12, M.steel, x, 1.78, 2.06);
    box(house, .07, .32, .07, M.interior, x, 1.66, 2.14);
  }
  /* West return remains visible from the gathering and afterglow camera positions. */
  box(house, .10, 1.70, 2.20, M.trim, -4.23, .72, .20);
  box(house, .07, 1.48, 1.96, M.glass, -4.29, .83, .20);
  box(house, .05, 1.10, 1.42, M.interior, -4.34, 1.02, .20);
  box(house, 8.85, .10, .15, M.trim, -.10, 2.73, 2.04);
  box(house, .10, 2.75, .10, M.trim, 4.18, 0, 2.02);

  /* ── privacy edge and layered rear canopy ────────────────────── */
  for (let i = 0; i < 13; i++) {
    const x = -18 + i * 3;
    box(landscape, 2.85, 1.55, .10, M.fence, x, 0, -18.8);
  }

  const treeData = [
    [-18,-18,2.8], [-12,-21,2.1], [-7,-21.5,2.5], [6,-22,2.2],
    [13,-20,3.0], [18,-14,2.4], [-20,-8,2.5], [16,-6,1.9], [10,-16,1.8]
  ];
  const trunkGeo = new THREE.CylinderGeometry(.13, .23, 2.7, 7);
  const canopyGeo = new THREE.IcosahedronGeometry(1.45, 1);
  const trunks = new THREE.InstancedMesh(trunkGeo, M.bark, treeData.length);
  const canopies = new THREE.InstancedMesh(canopyGeo, M.leaf, treeData.length * 3);
  const matrix = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  let canopyIndex = 0;
  treeData.forEach(([x,z,s], i) => {
    matrix.compose(new THREE.Vector3(x, 1.35*s, z), quat, new THREE.Vector3(s,s,s));
    trunks.setMatrixAt(i, matrix);
    for (let c = 0; c < 3; c++) {
      const angle = c * 2.15 + i * .47;
      const pos = new THREE.Vector3(x + Math.cos(angle)*.72*s, (3.05 + c*.42)*s,
        z + Math.sin(angle)*.46*s);
      scale.setScalar(s * .72 * (1 - c*.10));
      matrix.compose(pos, quat, scale);
      canopies.setMatrixAt(canopyIndex++, matrix);
    }
  });
  landscape.add(trunks, canopies);

  /* ── shrubs, flowering masses, and sculptural accent tree ────── */
  const shrubSites = [
    [-14,5],[-12,6],[-10,5.4],[-8,3],[-14,2],
    [10,5],[12,4],[14,1],[13,-3],[10,-4],
    [-13,-12],[-10,-13],[-7,-14],[5,-14],[8,-13],[11,-11],
    [-8,-9],[1,-11],[4,-10]
  ];
  const shrubGeo = new THREE.IcosahedronGeometry(.62, 1);
  const shrubs = new THREE.InstancedMesh(shrubGeo, M.leaf2, shrubSites.length * 2);
  let shrubIndex = 0;
  shrubSites.forEach(([x,z], i) => {
    for (let l = 0; l < 2; l++) {
      const s = .65 + ((i * 17 + l * 7) % 9) / 20;
      const pos = new THREE.Vector3(x + (l-.5)*.72, .42*s, z + (l ? .28 : -.18));
      scale.set(s * 1.25, s * .72, s);
      matrix.compose(pos, quat, scale);
      shrubs.setMatrixAt(shrubIndex++, matrix);
    }
  });
  landscape.add(shrubs);

  const flowerGeo = new THREE.IcosahedronGeometry(.16, 0);
  const flowers = new THREE.InstancedMesh(flowerGeo, M.flower, 30);
  for (let i = 0; i < 30; i++) {
    const band = i < 15 ? [-11.5, 3.8] : [7.2, -12.2];
    const x = band[0] + Math.sin(i * 2.43) * 2.2;
    const z = band[1] + Math.cos(i * 1.71) * .95;
    const s = .7 + (i % 5) * .09;
    matrix.compose(new THREE.Vector3(x, .18 + (i%3)*.035, z), quat,
      new THREE.Vector3(s, s, s));
    flowers.setMatrixAt(i, matrix);
  }
  landscape.add(flowers);

  const accent = new THREE.Group();
  accent.name = 'sculptural-accent-tree';
  box(accent, .34, 3.1, .34, M.bark, 0, 0, 0, -.18);
  for (const [x,y,z,s] of [[0,3.3,0,1.1],[-.7,3.7,.1,.8],[.65,4.05,-.2,.92]]) {
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), M.leaf);
    crown.position.set(x,y,z);
    accent.add(crown);
  }
  accent.position.set(5.8, 0, -10.6);
  landscape.add(accent);

  /* ── ornamental grass masses: one instanced draw call ────────── */
  const grassClusters = [
    [-14,6,1.3],[-10,4.5,1],[-8,2.2,.9],[12,3,1.2],[11,-4,1],
    [-11,-11,1.2],[-5,-12.5,.9],[7,-13,1.1],[10,-11,.8],
    [-8.8,7.5,1.25],[8.6,7.2,1.0]
  ];
  const bladeGeo = new THREE.ConeGeometry(.035, .82, 4);
  bladeGeo.translate(0, .41, 0);
  const grasses = new THREE.InstancedMesh(bladeGeo, M.leaf2, grassClusters.length * 18);
  let grassIndex = 0;
  grassClusters.forEach(([cx,cz,cs], cluster) => {
    for (let i = 0; i < 18; i++) {
      const a = i * 2.399 + cluster * .73;
      const r = Math.sqrt((i + .5) / 18) * .72 * cs;
      const h = (.65 + ((i * 13 + cluster * 5) % 11) / 20) * cs;
      const pos = new THREE.Vector3(cx + Math.cos(a)*r, .02, cz + Math.sin(a)*r);
      quat.setFromEuler(new THREE.Euler((i%3-.8)*.08, a, (i%5-2)*.035));
      scale.set(.75 + (i%4)*.08, h, .75 + (i%3)*.1);
      matrix.compose(pos, quat, scale);
      grasses.setMatrixAt(grassIndex++, matrix);
    }
  });
  landscape.add(grasses);

  /* Foreground clusters live at the lateral frame edges for parallax. */
  const foregroundSites = [[-8.8,10.8,1.25],[9.4,9.0,1.1],[-10.5,3.4,.95]];
  const fgBlades = new THREE.InstancedMesh(bladeGeo, M.leaf, foregroundSites.length * 22);
  let fgIndex = 0;
  foregroundSites.forEach(([cx,cz,cs], cluster) => {
    for (let i = 0; i < 22; i++) {
      const a = i * 2.17 + cluster;
      const r = Math.sqrt((i+.5)/22) * .9 * cs;
      const pos = new THREE.Vector3(cx + Math.cos(a)*r, .02, cz + Math.sin(a)*r);
      quat.setFromEuler(new THREE.Euler((i%4-1.5)*.09, a, (i%5-2)*.06));
      scale.set(1, (1.0 + (i%7)*.11)*cs, 1);
      matrix.compose(pos, quat, scale);
      fgBlades.setMatrixAt(fgIndex++, matrix);
    }
  });
  foreground.add(fgBlades);

  world.userData.layers = { site, architecture, landscape, foreground };
  world.userData.compositionStats = {
    treeInstances: treeData.length,
    canopyInstances: treeData.length * 3,
    shrubInstances: shrubSites.length * 2,
    flowerInstances: 30,
    grassBladeInstances: grassClusters.length * 18 + foregroundSites.length * 22
  };
  return world;
}