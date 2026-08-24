/* ════════════════════════════════════════════════════════════════
   AFTERGLOW · main.js — renderer lifecycle
   One canvas, one world, capped DPR, visibility-aware loop,
   graceful poster fallback. PASS 1: warm 5:30 PM light only.
   ════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { Rig }        from './rig.js';
import { buildWorld } from './world.js';
import { ScrollDirector } from './dom.js';
import { upgradeSceneAssets } from './assets/asset-registry.js';

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE = matchMedia('(hover: none)').matches;
const isMobile = () => innerWidth < 821;

let renderer, scene, camera, rig, director, world;
let running = true, last = performance.now(), introT0 = -1;
let shadowPrimed = false;
const clock = new THREE.Clock();

function makeRenderer() {
  const c = document.getElementById('scene');
  try {
    const r = new THREE.WebGLRenderer({ canvas:c, antialias:true, powerPreference:'high-performance' });
    return r;
  } catch (e) {
    document.body.classList.add('no-webgl');
    return null;
  }
}

function init() {
  renderer = makeRenderer();
  if (!renderer) return;

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xbca98b, .0065);

  camera = new THREE.PerspectiveCamera(38, innerWidth/innerHeight, .1, 240);
  camera.position.set(4.4, 3.3, 15.8);

  rig = new Rig(camera, { mobile: isMobile() });

  world = buildWorld(scene, renderer);
  upgradeSceneAssets(world, renderer).catch(error => {
    console.warn('Professional asset layer unavailable; retaining procedural planting:', error);
  });

  /* ── light: late-afternoon Oklahoma sun, 5:30 PM ─────────────── */
  const sun = new THREE.DirectionalLight(0xffe3bd, 2.35);
  sun.position.set(-14, 9, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -18; sun.shadow.camera.right = 18;
  sun.shadow.camera.top = 18;   sun.shadow.camera.bottom = -18;
  sun.shadow.camera.far = 60;   sun.shadow.bias = -.0004;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0x9ebbd3, 0x5a4935, 1.08));

  /* gradient sky dome */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(160, 24, 14),
    new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite:false, fog:false,
      uniforms:{ top:{value:new THREE.Color(0x718fb8)},
                 mid:{value:new THREE.Color(0xd6b58d)},
                 bot:{value:new THREE.Color(0xb97948)} },
      vertexShader:`varying vec3 vP; void main(){ vP=position;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader:`varying vec3 vP; uniform vec3 top,mid,bot;
        void main(){ float h=normalize(vP).y;
          vec3 c=h>.12 ? mix(mid,top,smoothstep(.12,.65,h))
                       : mix(bot,mid,smoothstep(-.08,.12,h));
          gl_FragColor=vec4(c,1.);}`
    }));
  scene.add(sky);
  scene.userData.sun = sun;
  scene.userData.sky = sky;

  applySize();
  try { director = new ScrollDirector(); }
  catch (e) { console.warn('DOM wiring failed; world continues:', e); director = null; }
  bindPointer();

  addEventListener('resize', () => {
    applySize();
    rig.setMobile(isMobile());
  }, { passive:true });

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden && !REDUCE_HIDDEN();
    if (running) { last = performance.now(); requestAnimationFrame(tick); }
  });
  function REDUCE_HIDDEN(){ return false; }

  requestAnimationFrame(tick);
}

function applySize() {
  const dprCap = isMobile() ? 1.25 : 1.75;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, dprCap));
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}

function bindPointer() {
  if (COARSE) return;
  addEventListener('pointermove', e => {
    rig.pointer((e.clientX/innerWidth)*2-1, (e.clientY/innerHeight)*2-1);
  }, { passive:true });
}

function tick(now) {
  if (!running) return;
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), .05);

  if (introT0 < 0) introT0 = now;
  rig.intro = REDUCE ? 1 : Math.min((now - introT0) / 2400, 1);

  if (director) {
    director.frame(director.uTarget, dt);
    rig.u = director.uTarget;
  }
  rig.update(dt, REDUCE);

  renderer.render(scene, camera);
  /* The environment and sun are static in Pass 2A; reuse the first shadow map. */
  if (!shadowPrimed) {
    renderer.shadowMap.autoUpdate = false;
    shadowPrimed = true;
  }
}

init();
