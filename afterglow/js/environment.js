/* ════════════════════════════════════════════════════════════════
   AFTERGLOW · environment.js — the day's single timeline
   One keyframed state drives sun, sky, fog, exposure, wind,
   weather and practicals from the scroll's chapter-units float.
   Weather particle systems plug into state.weather; this module
   owns the *decisions*, not the particle geometry.
   ════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { clamp, sat, lerp, smooth } from './rig.js';

/* Timeline keyframes in chapter-units u (0=yard … 5=afterglow footer).
   Each entry is a full environment snapshot; values ease between them. */
const KEYS = [
  { u: 0.0,  name: 'afternoon',
    sun: { az: -38, el: 24, color: 0xffe3bd, intensity: 2.35 },
    hemi: { sky: 0x9ebbd3, ground: 0x5a4935, intensity: 1.08 },
    sky: { top: 0x718fb8, mid: 0xd6b58d, bot: 0xb97948 },
    fog: { color: 0xbca98b, density: 0.0065 },
    exposure: 1.02,
    weather: { overcast: 0, rain: 0, wind: 0.18, wetness: 0 },
    practicals: { string: 0, fire: 0, path: 0 } },

  { u: 2.15, name: 'golden',
    sun: { az: -52, el: 9, color: 0xffc98a, intensity: 2.6 },
    hemi: { sky: 0xb8c4d8, ground: 0x6b5236, intensity: 0.92 },
    sky: { top: 0x6d84b0, mid: 0xe0b183, bot: 0xd08a4e },
    fog: { color: 0xc4a184, density: 0.0072 },
    exposure: 1.05,
    weather: { overcast: 0, rain: 0, wind: 0.22, wetness: 0 },
    practicals: { string: 0, fire: 0, path: 0 } },

  { u: 2.85, name: 'sunset',
    sun: { az: -62, el: 3.2, color: 0xff9e57, intensity: 2.1 },
    hemi: { sky: 0x8f9cc0, ground: 0x5f4530, intensity: 0.8 },
    sky: { top: 0x5c6f9e, mid: 0xd99a63, bot: 0xc06f3c },
    fog: { color: 0xbd8f6a, density: 0.008 },
    exposure: 1.08,
    weather: { overcast: 0.05, rain: 0, wind: 0.3, wetness: 0 },
    practicals: { string: 0.15, fire: 0, path: 0.1 } },

  { u: 3.35, name: 'wind',
    sun: { az: -66, el: 2.2, color: 0xf2a066, intensity: 1.5 },
    hemi: { sky: 0x7d8aa8, ground: 0x54402e, intensity: 0.72 },
    sky: { top: 0x54628a, mid: 0xa98d72, bot: 0x8f6a4c },
    fog: { color: 0x9c8a74, density: 0.0095 },
    exposure: 1.04,
    weather: { overcast: 0.45, rain: 0, wind: 0.85, wetness: 0 },
    practicals: { string: 0.3, fire: 0, path: 0.15 } },

  { u: 3.75, name: 'storm',
    sun: { az: -68, el: 2.0, color: 0x9aa4b8, intensity: 0.55 },
    hemi: { sky: 0x5f6b80, ground: 0x3d3630, intensity: 0.62 },
    sky: { top: 0x3e4759, mid: 0x6b6a66, bot: 0x5a5148 },
    fog: { color: 0x6a655c, density: 0.0135 },
    exposure: 0.98,
    weather: { overcast: 0.95, rain: 1.0, wind: 1.0, wetness: 0.85 },
    practicals: { string: 0.55, fire: 0.35, path: 0.4 } },

  { u: 4.15, name: 'clearing',
    sun: { az: -70, el: 1.6, color: 0xd8a878, intensity: 0.9 },
    hemi: { sky: 0x7488a8, ground: 0x463a2c, intensity: 0.7 },
    sky: { top: 0x4a5c86, mid: 0xb08a6a, bot: 0x8a6a50 },
    fog: { color: 0x8a7c6c, density: 0.009 },
    exposure: 1.02,
    weather: { overcast: 0.35, rain: 0.12, wind: 0.5, wetness: 1.0 },
    practicals: { string: 0.75, fire: 0.7, path: 0.6 } },

  { u: 4.65, name: 'dusk',
    sun: { az: -72, el: 0.4, color: 0xc07850, intensity: 0.35 },
    hemi: { sky: 0x4a5a7e, ground: 0x38302a, intensity: 0.6 },
    sky: { top: 0x2c3a5c, mid: 0x7a5c48, bot: 0x5c4030 },
    fog: { color: 0x5c5044, density: 0.008 },
    exposure: 1.06,
    weather: { overcast: 0.1, rain: 0, wind: 0.3, wetness: 0.75 },
    practicals: { string: 1.0, fire: 1.0, path: 0.85 } },

  { u: 5.0,  name: 'night',
    sun: { az: -74, el: -2.0, color: 0x8a5c40, intensity: 0.12 },
    hemi: { sky: 0x26324e, ground: 0x241f1a, intensity: 0.5 },
    sky: { top: 0x141c30, mid: 0x3a3040, bot: 0x2c2226 },
    fog: { color: 0x241f22, density: 0.0072 },
    exposure: 1.12,
    weather: { overcast: 0, rain: 0, wind: 0.22, wetness: 0.6 },
    practicals: { string: 1.0, fire: 1.0, path: 1.0 } }
];

const _c1 = new THREE.Color(), _c2 = new THREE.Color();
const _v1 = new THREE.Vector3();

function azelToDir(azDeg, elDeg, out) {
  const az = THREE.MathUtils.degToRad(azDeg);
  const el = THREE.MathUtils.degToRad(elDeg);
  out.set(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
  return out;
}

function findSpan(u) {
  if (u <= KEYS[0].u) return [KEYS[0], KEYS[0], 0];
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (u <= KEYS[i + 1].u) {
      const t = sat((u - KEYS[i].u) / (KEYS[i + 1].u - KEYS[i].u));
      return [KEYS[i], KEYS[i + 1], t];
    }
  }
  return [KEYS[KEYS.length - 1], KEYS[KEYS.length - 1], 0];
}

const _lerpHex = (a, b, t, out) =>
  out.copy(_c1.setHex(a)).lerp(_c2.setHex(b), t);

/* Reusable state object — zero per-frame allocation. */
const state = {
  sunDir: new THREE.Vector3(),
  sunColor: new THREE.Color(),
  sunIntensity: 0,
  hemiSky: new THREE.Color(),
  hemiGround: new THREE.Color(),
  hemiIntensity: 0,
  skyTop: new THREE.Color(),
  skyMid: new THREE.Color(),
  skyBot: new THREE.Color(),
  fogColor: new THREE.Color(),
  fogDensity: 0,
  exposure: 1,
  weather: { overcast: 0, rain: 0, wind: 0, wetness: 0 },
  practicals: { string: 0, fire: 0, path: 0 },
  name: 'afternoon'
};

export function sampleEnvironment(u, time = 0) {
  const [a, b, t] = findSpan(u);
  /* ease within each span so chapter boundaries feel authored */
  const e = t * t * (3 - 2 * t);

  azelToDir(
    lerp(a.sun.az, b.sun.az, e),
    lerp(a.sun.el, b.sun.el, e),
    state.sunDir);
  state.sunColor.copy(_c1.setHex(a.sun.color)).lerp(_c2.setHex(b.sun.color), e);
  state.sunIntensity = lerp(a.sun.intensity, b.sun.intensity, e);

  _lerpHex(a.hemi.sky, b.hemi.sky, e, state.hemiSky);
  _lerpHex(a.hemi.ground, b.hemi.ground, e, state.hemiGround);
  state.hemiIntensity = lerp(a.hemi.intensity, b.hemi.intensity, e);

  _lerpHex(a.sky.top, b.sky.top, e, state.skyTop);
  _lerpHex(a.sky.mid, b.sky.mid, e, state.skyMid);
  _lerpHex(a.sky.bot, b.sky.bot, e, state.skyBot);

  _lerpHex(a.fog.color, b.fog.color, e, state.fogColor);
  state.fogDensity = lerp(a.fog.density, b.fog.density, e);

  state.exposure = lerp(a.exposure, b.exposure, e);

  for (const k in state.weather)
    state.weather[k] = lerp(a.weather[k], b.weather[k], e);
  for (const k in state.practicals)
    state.practicals[k] = lerp(a.practicals[k], b.practicals[k], e);

  state.name = e < .5 ? a.name : b.name;
  return state;
}

/* Apply the sampled state to the live scene graph. */
export function applyEnvironment(scene, state, renderer, time = 0) {
  const sun = scene.userData.sun;
  const sky = scene.userData.sky;

  if (sun) {
    sun.position.copy(state.sunDir).multiplyScalar(40);
    sun.color.copy(state.sunColor);
    sun.intensity = state.sunIntensity;
  }
  if (sky) {
    const u = sky.material.uniforms;
    u.top.value.copy(state.skyTop);
    u.mid.value.copy(state.skyMid);
    u.bot.value.copy(state.skyBot);
  }
  if (scene.fog) {
    scene.fog.color.copy(state.fogColor);
    if (scene.fog.density !== undefined)
      scene.fog.density = state.fogDensity;
  }
  if (renderer)
    renderer.toneMappingExposure = state.exposure;

  /* hemisphere light lives beside the sun */
  const hemi = scene.userData.hemi;
  if (hemi) {
    hemi.color.copy(state.hemiSky);
    hemi.groundColor.copy(state.hemiGround);
    hemi.intensity = state.hemiIntensity;
  }

  /* practicals: flame visibility + flicker, string/path glow scale */
  const flame = scene.userData.flame;
  if (flame) {
    const on = state.practicals.fire;
    flame.visible = on > 0.02;
    const flicker = 1 + Math.sin(time * 13.7) * .12 + Math.sin(time * 7.3) * .08;
    flame.scale.setScalar(on * flicker);
  }
  const fireLight = scene.userData.fireLight;
  if (fireLight) {
    const flicker = .82 + Math.sin(time * 11.1) * .1 + Math.sin(time * 5.7) * .08;
    fireLight.intensity = state.practicals.fire * 2.4 * flicker;
  }
  const stringLight = scene.userData.stringLight;
  if (stringLight)
    stringLight.intensity = state.practicals.string * 1.6;
}

export { state as environmentState };
