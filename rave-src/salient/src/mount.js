// The SalienT stage for Rave Mode (Update 6.43). Built into
// public/rave/salient/salient-rave.js and mounted by components/SalientRave.js
// inside Rave Mode. The song itself is played by The Rave's own player: this
// only reads its clock (getTime) and draws the show for that moment.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { loadChars, ROSTER } from './chars.js';
import { buildStage, BOOTH_Z } from './stage.js';
import { buildBooth, DJ, DECK_Y } from './dj.js';
import { Show } from './show.js';
import { beatAt } from './song.js';

export const WARDEN_ODDS = 0.12;

export function supported() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2')); } catch (e) { return false; }
}

// opts: { base, getTime, onProgress(v, name), onReady(), onError(err), warden (true/false/undefined = roll), calm }
export function mount(el, opts) {
  let dead = false, raf = 0, renderer, composer, show, dj, bloom, finalPass, camera, card, cname, crole, cardT;
  const scene = new THREE.Scene();
  const cleanup = [];
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  } catch (e) { opts.onError && opts.onError(e); return { destroy() {} }; }
  let pr = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(pr);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.className = 'rv-sal-canvas';
  el.appendChild(renderer.domElement);
  scene.background = new THREE.Color(0x020207); scene.fog = new THREE.FogExp2(0x04030a, 0.017);
  camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 200);
  const pm = new THREE.PMREMGenerator(renderer); const envRT = pm.fromScene(new RoomEnvironment(), 0.04); scene.environment = envRT.texture; scene.environmentIntensity = 0.22; pm.dispose();

  const lights = {
    hemi: new THREE.HemisphereLight(0xffffff, 0x221133, 0.2),
    spotA: new THREE.SpotLight(0xffffff, 0, 60, 0.75, 0.7, 1.6), spotB: new THREE.SpotLight(0xffffff, 0, 60, 0.75, 0.7, 1.6),
    back: new THREE.PointLight(0xffffff, 0, 40, 1.6), console: new THREE.PointLight(0x3fd8ff, 0, 7, 1.6),
    fill: new THREE.DirectionalLight(0xfff4ea, 0),
    key: new THREE.SpotLight(0xffffff, 0, 60, 0.16, 0.7, 1.6), strobe: new THREE.DirectionalLight(0xffffff, 0), warden: new THREE.PointLight(0xffb040, 0, 30, 1.6),
  };
  lights.spotA.position.set(-9, 11, 9); lights.spotB.position.set(9, 11, 9); lights.spotA.target.position.set(1, 0, 0); lights.spotB.target.position.set(-1, 0, 0);
  lights.back.position.set(0, 6.5, -9.5); lights.console.position.set(0, DECK_Y + 0.25, BOOTH_Z + 1.0); lights.key.position.set(0, 12, 10); lights.strobe.position.set(0, 8, 12); lights.fill.position.set(2, 7, 14); lights.warden.position.set(0, 2.5, 3.5);
  for (const k in lights) { scene.add(lights[k]); if (lights[k].target) scene.add(lights[k].target); }

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  bloom = new UnrealBloomPass(new THREE.Vector2(640, 360), 0.5, 0.7, 0.9); composer.addPass(bloom);
  finalPass = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uAb: { value: 0.002 }, uT: { value: 0 }, uExp: { value: 1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform sampler2D tDiffuse; uniform float uAb,uT,uExp; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))+uT)*43758.5453); }
      void main(){ vec2 d = vUv-0.5; float r2 = dot(d,d); vec2 o = d*uAb*(0.4+r2*4.0);
        vec3 c = vec3(texture2D(tDiffuse, vUv+o).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv-o).b);
        c *= uExp * mix(1.0, 0.38, smoothstep(0.12, 0.62, r2)); c += (h(vUv*800.0)-0.5)*0.022; gl_FragColor = vec4(c, 1.0); }`,
  });
  composer.addPass(finalPass); composer.addPass(new OutputPass());

  let W = 0, H = 0;
  const resize = () => { const w = el.clientWidth || innerWidth, h = el.clientHeight || innerHeight; if (w === W && h === H) return; W = w; H = h; renderer.setPixelRatio(pr); renderer.setSize(w, h, false); composer.setPixelRatio(pr); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };

  // a name card when someone steps up to solo
  card = document.createElement('div'); card.className = 'rv-sal-card';
  cname = document.createElement('div'); cname.className = 'rv-sal-name'; crole = document.createElement('div'); crole.className = 'rv-sal-role';
  card.append(cname, crole); el.appendChild(card);

  const frame = (t, dt) => {
    resize();
    show.update(t, dt);
    dj.update(t, beatAt(t), show.state.kick);
    bloom.strength = show.fx.bloom; finalPass.uniforms.uAb.value = show.fx.aberr; finalPass.uniforms.uT.value = t % 10; finalPass.uniforms.uExp.value = show.fx.exposure;
    composer.render();
  };

  const stage = buildStage(scene), booth = buildBooth(scene);
  loadChars(Object.keys(ROSTER), opts.base + 'models/', (v, id) => opts.onProgress && opts.onProgress(v, ROSTER[id].name)).then(chars => {
    if (dead) return;
    scene.add(chars.chephro.root);
    dj = new DJ(chars.chephro, booth);
    show = new Show({ scene, camera, stage, booth, chars, dj, lights });
    show.calm = !!opts.calm;
    show.setWarden(opts.warden != null ? opts.warden : Math.random() < WARDEN_ODDS);
    show.onSolo = (id) => {
      clearTimeout(cardT); card.classList.remove('on'); if (!id) return;
      cname.textContent = ROSTER[id].name; crole.textContent = ROSTER[id].role;
      card.style.setProperty('--c', '#' + ROSTER[id].color.toString(16).padStart(6, '0'));
      void card.offsetWidth; card.classList.add('on'); cardT = setTimeout(() => card.classList.remove('on'), 5200);
    };
    let last = performance.now(), slow = 0, fast = 0, lastSong = null;
    const loop = (now) => {
      if (dead) return;
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const t = opts.getTime();
      // a new play from the top rolls again for the Temple Warden
      if (opts.warden == null && lastSong != null && t < 1 && lastSong > 20) show.setWarden(Math.random() < WARDEN_ODDS);
      lastSong = t;
      frame(t, dt);
      // keep it smooth on slower machines
      if (dt > 0.03) slow++; else if (dt < 0.019) fast++;
      if (slow > 45 && pr > 0.6) { pr = Math.max(0.6, pr - 0.2); slow = fast = 0; W = 0; }
      if (slow + fast > 400) slow = fast = 0;
    };
    frame(opts.getTime(), 0.016);
    opts.onReady && opts.onReady();
    raf = requestAnimationFrame(loop);
  }).catch(e => { if (!dead) opts.onError && opts.onError(e); });

  return {
    destroy() {
      dead = true; cancelAnimationFrame(raf); clearTimeout(cardT);
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach(mm => { for (const k in mm) if (mm[k] && mm[k].isTexture) mm[k].dispose(); mm.dispose(); }); });
      envRT.dispose(); composer.dispose && composer.dispose(); renderer.dispose(); try { renderer.forceContextLoss(); } catch (e) {}
      el.innerHTML = '';
    },
  };
}

window.SalientRave = { mount, supported, WARDEN_ODDS };
