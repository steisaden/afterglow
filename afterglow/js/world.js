/* ════════════════════════════════════════════════════════════════
   AFTERGLOW · world.js — the backyard
   One persistent environment. World units are meters; the yard runs
   north along −Z from the implied house wall at z≈+7.
   PASS 1: composed primitives at final world positions so framing,
   silhouette and negative space can be judged before any dressing.
   ════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';

export function buildWorld(scene) {
  const g = new THREE.Group();
  scene.add(g);

  const M = {
    ground:  new THREE.MeshLambertMaterial({ color: 0x6d5c3f }),
    lawn:    new THREE.MeshLambertMaterial({ color: 0x55603a }),
    stone:   new THREE.MeshLambertMaterial({ color: 0xa99e86 }),
    cedar:   new THREE.MeshLambertMaterial({ color: 0x9a6234 }),
    steel:   new THREE.MeshLambertMaterial({ color: 0x1d1c1a }),
    dark:    new THREE.MeshLambertMaterial({ color: 0x23201a }),
    water:   new THREE.MeshPhongMaterial({ color: 0x27435c, shininess: 90,
                                            specular: 0x88aabb })
  };
  g.userData.M = M;

  const box = (w, h, d, mat, x, y, z, ry = 0) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y + h / 2, z); m.rotation.y = ry;
    g.add(m); return m;
  };

  /* ── terrain ──────────────────────────────────────────────────── */
  const yard = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), M.ground);
  yard.rotation.x = -Math.PI / 2; g.add(yard);

  /* lawn panel the camera actually crosses */
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(34, 30), M.lawn);
  lawn.rotation.x = -Math.PI / 2; lawn.position.set(0, .012, -8); g.add(lawn);

  /* ── limestone patio slab ─────────────────────────────────────── */
  box(13, .16, 10, M.stone, -1.4, 0, -3.2);
  /* joint lines as thin dark strips (composition pass only) */
  for (let i = 0; i < 6; i++)
    box(.045, .162, 10, M.dark, -6.9 + i * 2.2, 0, -3.2);

  /* ── pergola / pavilion footprint (6×4.4), posts + beams ──────── */
  const P = { x: -4.2, z: -4.6 };                 /* center of structure */
  const px = 2.6, pz = 1.8;                       /* half footprints     */
  const postH = 2.75;
  [[-px,-pz],[px,-pz],[-px,pz],[px,pz]].forEach(([dx,dz]) => {
    box(.22, postH, .22, M.cedar, P.x + dx, .16, P.z + dz);
    box(.30, .18, .30, M.steel, P.x + dx, .16, P.z + dz);       /* steel shoe */
  });
  /* beams across (span x) + rafters along z */
  box(2 * px + .7, .24, .16, M.cedar, P.x, postH + .16, P.z - pz);
  box(2 * px + .7, .24, .16, M.cedar, P.x, postH + .16, P.z + pz);
  for (let i = 0; i <= 7; i++) {
    const rz = P.z - pz + (i / 7) * 2 * pz;
    box(.12, .14, 2 * pz + .3, M.cedar, P.x, postH + .40, rz);
  }
  /* solid roof plane over kitchen half only (covered-patio read) */
  box(2 * px + .8, .10, 2.4, M.dark, P.x, postH + .52, P.z - .62);

  /* ── outdoor kitchen run (east side) ──────────────────────────── */
  box(4.6, 1.02, .78, M.stone, 2.9, .16, -6.9);            /* base run  */
  box(4.7, .07, .84, M.steel, 2.9, 1.18, -6.9);            /* counter   */
  box(1.15, .78, .60, M.steel, 3.6, 1.25, -6.9);           /* grill hood*/

  /* ── fire feature ─────────────────────────────────────────────── */
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.72, .58, .42, 20), M.dark);
  bowl.position.set(1.1, .37, -3.4); g.add(bowl);
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(.30, .62, 12),
    new THREE.MeshBasicMaterial({ color: 0xff8a3c }));
  flame.position.set(1.1, .92, -3.4); flame.visible = false;
  g.add(flame); g.userData.flame = flame;

  /* ── seating silhouettes ──────────────────────────────────────── */
  box(2.5, .52, .95, M.dark, -4.2, .16, -2.2);             /* sofa west */
  box(.28, .62, .95, M.dark, -5.45, .16, -2.2);
  box(2.5, .52, .95, M.dark, -4.2, .16, -7.0);             /* sofa east */
  box(.28, .62, .95, M.dark, -2.95, .16, -7.0);

  /* ── pool hint (far north-west) ───────────────────────────────── */
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 3.4), M.water);
  pool.rotation.x = -Math.PI / 2; pool.position.set(-6.5, .05, -11.5); g.add(pool);

  /* ── tree masses (silhouette carriers) ────────────────────────── */
  const tree = (s, x, z) => {
    const t = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.16*s,.26*s,2.6*s,7), M.dark);
    trunk.position.y = 1.3*s; t.add(trunk);
    for (let i = 0; i < 3; i++) {
      const c = new THREE.Mesh(new THREE.SphereGeometry(1.5*s*(1-.18*i), 9, 8),
                               i ? M.lawn : M.lawn);
      c.position.set((i-1)*.7*s, 2.9*s + i*.85*s, (i%2)*.5*s);
      t.add(c);
    }
    t.position.set(x, 0, z); g.add(t); return t;
  };
  tree(2.6, -17, -19); tree(3.1, 14, -21); tree(2.2, 19, -12); tree(2.4, -20, -9);
  tree(1.7, 10.5, -17);

  return g;
}
