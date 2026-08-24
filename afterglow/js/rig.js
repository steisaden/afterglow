/* ════════════════════════════════════════════════════════════════
   AFTERGLOW · rig.js — cinematography
   A scroll-scrubbed shot table. Two CatmullRom splines (position,
   target) carry the camera between authored waypoints; FOV lerps
   per segment and is corrected for frame shape. Nothing orbits
   unless the storyboard says so.
   ════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';

export const clamp   = (v, a, b) => v < a ? a : (v > b ? b : v);
export const sat     = v => clamp(v, 0, 1);
export const lerp    = (a, b, t) => a + (b - a) * t;
export const smooth  = (e0, e1, x) => { const t = sat((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
/* frame-rate independent damping */
export const damp    = (cur, to, rate, dt) => lerp(cur, to, 1 - Math.exp(-rate * dt));

/* ── the shot table ────────────────────────────────────────────────
   Six authored frames. p = camera position, t = look target, fov deg.
   The yard is entered from the property's south-east lawn; the walk
   pushes north-west into the build, ducks under the structure for the
   gathering, pulls wide for the storm, then settles into the dusk
   money-shot framed through the pergola.                              */
export const SHOTS_DESKTOP = [
  { p: [  4.4, 3.30, 15.8], t: [ -1.2, 1.70,  -4.0], fov: 36 },  /* 0 yard        */
  { p: [  1.6, 2.35,  9.2], t: [ -3.0, 2.05,  -4.5], fov: 42 },  /* 1 structure   */
  { p: [ -4.9, 2.00,  1.4], t: [  2.6, 1.55,  -6.0], fov: 46 },  /* 2 arc under   */
  { p: [  3.4, 1.42, -0.6], t: [ -4.2, 1.10,  -7.0], fov: 44 },  /* 3 gathering   */
  { p: [  0.8, 4.90, 11.6], t: [ -0.8, 1.20,  -6.5], fov: 40 },  /* 4 storm wide  */
  { p: [ -3.9, 1.62,  5.4], t: [  1.4, 1.45,  -7.5], fov: 37 }   /* 5 afterglow   */
];

/* Mobile recomposes: higher, closer, more headroom; type protected
   by keeping focal subjects low-center rather than rule-of-thirds. */
export const SHOTS_MOBILE = [
  { p: [  3.6, 3.80, 17.5], t: [ -0.6, 1.60,  -4.0], fov: 50 },
  { p: [  1.0, 2.60, 10.5], t: [ -2.6, 2.00,  -4.5], fov: 56 },
  { p: [  1.4, 2.60,  3.8], t: [  1.5, 1.40,  -6.8], fov: 55 },
  { p: [  5.5, 2.60,  3.0], t: [  1.0, 1.20,  -7.0], fov: 52 },
  { p: [  0.6, 5.40, 13.0], t: [ -0.6, 1.10,  -6.5], fov: 52 },
  { p: [ -3.4, 1.85,  6.4], t: [  1.2, 1.40,  -7.5], fov: 48 }
];

export class Rig {
  constructor(camera, { mobile = false } = {}) {
    this.camera = camera;
    this.mobile = mobile;
    this.setShots(mobile ? SHOTS_MOBILE : SHOTS_DESKTOP);

    /* scrub state */
    this.u       = 0;      /* continuous chapter-units 0..N-1 */
    this.smoothU = 0;
    this.intro   = 0;      /* 0..1 opening dolly */

    /* pointer parallax state */
    this.px = 0; this.py = 0;
    this.sx = 0; this.sy = 0;

    this._p = new THREE.Vector3();
    this._t = new THREE.Vector3();
  }

  setShots(shots) {
    this.shots = shots;
    const n = shots.length;
    this.curveP = new THREE.CatmullRomCurve3(
      shots.map(s => new THREE.Vector3(...s.p)), false, 'catmullrom', .42);
    this.curveT = new THREE.CatmullRomCurve3(
      shots.map(s => new THREE.Vector3(...s.t)), false, 'catmullrom', .42);
    this.N = n - 1;
  }

  setMobile(mobile) {
    if (mobile === this.mobile) return;
    this.mobile = mobile;
    this.setShots(mobile ? SHOTS_MOBILE : SHOTS_DESKTOP);
  }

  pointer(nx, ny) {           /* nx,ny in −1..1 */
    this.px = nx; this.py = ny;
  }

  /* Apply camera for this frame. dt seconds. */
  update(dt, reduceMotion) {
    /* ease the scrub itself so wheel steps read as one move */
    this.smoothU = damp(this.smoothU, this.u, reduceMotion ? 999 : 4.2, dt);
    const su = reduceMotion ? Math.round(this.u) : this.smoothU;

    const u01 = clamp(su / this.N, 0, 1);
    this.curveP.getPoint(u01, this._p);
    this.curveT.getPoint(u01, this._t);

    /* per-segment fov */
    const i  = clamp(Math.floor(su), 0, this.N - 1);
    const f  = clamp(su - i, 0, 1);
    let fov  = lerp(this.shots[i].fov, this.shots[i + 1].fov, f);

    /* opening dolly — arrive from further back and slightly high */
    if (!reduceMotion && this.intro < 1) {
      const io = 1 - smooth(0, 1, this.intro);
      this._p.z += io * 4.2;
      this._p.y += io * 0.75;
      fov += io * 7;
    }

    /* pointer parallax — a breath, not a joystick */
    if (!reduceMotion) {
      this.sx = damp(this.sx, this.px, 3.2, dt);
      this.sy = damp(this.sy, this.py, 3.2, dt);
      const amp = this.mobile ? 0.22 : 0.34;
      this._p.x += this.sx * amp;
      this._p.y += -this.sy * amp * 0.55;
    }

    /* protect framing against extreme frame shapes */
    const aspect = this.camera.aspect;
    fov *= clamp(Math.pow(1.65 / aspect, 0.5), 1, 1.28);

    const cam = this.camera;
    if (Math.abs(cam.fov - fov) > 1e-4) {
      cam.fov = fov; cam.updateProjectionMatrix();
    }
    cam.position.copy(this._p);
    cam.lookAt(this._t);
  }
}
