// The booth, and Chephro working it: two arms, eight tentacles, every one of
// them on a control. Arms are placed by two-bone IK, each tentacle is aimed at
// its own platter, pad, fader or knob, and whatever it touches lights up.
import * as THREE from 'three';
import { BOOTH_Z, RISER_H, hash1 } from './stage.js';
import { SONG, band, PRE_DROP, DROPS, sectionAt } from './song.js';

const V = () => new THREE.Vector3(), Q = () => new THREE.Quaternion();
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const _a = V(), _b = V(), _c = V(), _d = V(), _e = V(), _q = Q(), _q2 = Q(), _q3 = Q();

// turn a bone (in world space) so the line to `childPos` points along `dir`
function aim(bone, childPos, dir, weight = 1) {
  bone.getWorldPosition(_a);
  _b.copy(childPos).sub(_a).normalize(); _c.copy(dir).normalize();
  _q.setFromUnitVectors(_b, _c);
  bone.getWorldQuaternion(_q2); _q.multiply(_q2);            // new world rotation
  bone.parent.getWorldQuaternion(_q3).invert(); _q3.multiply(_q);
  if (weight >= 1) bone.quaternion.copy(_q3); else bone.quaternion.slerp(_q3, weight);
  bone.updateWorldMatrix(false, true);
}
function turnWorld(bone, axis, angle) {
  bone.getWorldQuaternion(_q2); _q.setFromAxisAngle(axis, angle).multiply(_q2);
  bone.parent.getWorldQuaternion(_q3).invert(); bone.quaternion.copy(_q3.multiply(_q)); bone.updateWorldMatrix(false, true);
}

export const DECK_Y = RISER_H + 1.08;
const DESK_Z = BOOTH_Z + 1.12;

const lit = (c = 0x223344) => new THREE.MeshBasicMaterial({ color: c });

export function buildBooth(scene) {
  const B = { controls: [], platters: [], towers: [], rings: [], vu: [], screens: [] };
  const dark = new THREE.MeshStandardMaterial({ color: 0x0d0e16, roughness: 0.45, metalness: 0.75 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x2a2c3a, roughness: 0.28, metalness: 0.95 });
  const riser = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5.0, RISER_H, 9), dark); riser.scale.z = 0.5; riser.position.set(0, RISER_H / 2, BOOTH_Z); scene.add(riser);
  const edge = new THREE.Mesh(new THREE.TorusGeometry(4.62, 0.035, 6, 9), lit(0xffffff));
  edge.rotation.x = Math.PI / 2; edge.rotation.z = Math.PI / 18; edge.scale.y = 0.5; edge.position.set(0, RISER_H + 0.01, BOOTH_Z); scene.add(edge); B.edge = edge;
  const edge2 = edge.clone(); edge2.material = lit(0xffffff); edge2.scale.set(1.085, 0.5 * 1.085, 1); edge2.position.y = 0.03; scene.add(edge2); B.edge2 = edge2;

  // ---- the desk ----
  const desk = new THREE.Group(); desk.position.set(0, DECK_Y, DESK_Z); desk.rotation.x = 0.30; scene.add(desk); B.desk = desk;
  const top = new THREE.MeshStandardMaterial({ color: 0x12131c, roughness: 0.22, metalness: 0.9 });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.09, 1.3), top); slab.position.y = -0.05; desk.add(slab);
  const under = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.14, 1.05), dark); under.position.y = -0.16; desk.add(under);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(4.44, 0.022, 1.34), lit(0xffffff)); trim.position.y = -0.1; desk.add(trim); B.trim = trim;
  const lip = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.05, 0.05), steel); lip.position.set(0, 0.01, 0.64); desk.add(lip);
  for (const sx of [-1, 1]) { const cap = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 1.34), steel); cap.position.set(sx * 2.22, -0.06, 0); desk.add(cap); }
  // inset plates so each zone reads as its own piece of kit
  const plate = (x, z, w, d) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.012, d), new THREE.MeshStandardMaterial({ color: 0x1b1d2b, roughness: 0.4, metalness: 0.8 })); m.position.set(x, 0.002, z); desk.add(m); const o = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, 0.006, d + 0.02), lit(0x1a2540)); o.position.set(x, 0.0, z); desk.add(o); B.rings.push({ m: o.material, k: 0.35 }); };
  plate(0, 0.02, 0.66, 1.1); plate(-0.57, 0.0, 0.5, 0.52); plate(0.57, 0.0, 0.5, 0.52); plate(-1.22, 0.02, 0.84, 0.84); plate(1.22, 0.02, 0.84, 0.84); plate(-1.86, 0.0, 0.42, 0.9); plate(1.86, 0.0, 0.42, 0.9);

  const add = (kind, x, z, mesh, extra = {}) => { mesh.position.set(x, mesh.position.y, z); desk.add(mesh); const c = { kind, x, z, mesh, hit: 0, side: Math.sign(x) || 1, ...extra }; B.controls.push(c); return c; };
  // two platters: grooves, a nine-part LED ring, a tone arm
  for (const sx of [-1, 1]) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.41, 0.04, 40), steel); base.position.y = -0.005; g.add(base);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.05, 40), new THREE.MeshStandardMaterial({ color: 0x07070b, roughness: 0.22, metalness: 0.9 })); g.add(disc);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.375, 0.014, 6, 40), lit()); ring.rotation.x = Math.PI / 2; ring.position.y = 0.02; g.add(ring);
    const segs = [];
    for (let k = 0; k < 9; k++) { const a0 = k / 9 * Math.PI * 2; const sg = new THREE.Mesh(new THREE.RingGeometry(0.405, 0.44, 8, 1, a0 + 0.06, Math.PI * 2 / 9 - 0.12), lit()); sg.rotation.x = -Math.PI / 2; sg.position.y = 0.012; g.add(sg); segs.push(sg.material); }
    const spin = new THREE.Group(); spin.position.y = 0.03; g.add(spin);
    for (const rr of [0.14, 0.19, 0.24, 0.29, 0.33]) { const gr = new THREE.Mesh(new THREE.RingGeometry(rr, rr + 0.004, 40), new THREE.MeshBasicMaterial({ color: 0x1c2233 })); gr.rotation.x = -Math.PI / 2; spin.add(gr); }
    for (let k = 0; k < 9; k++) { const tick = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.006, k === 0 ? 0.24 : 0.07), lit()); const a = k / 9 * Math.PI * 2; tick.position.set(Math.sin(a) * (k === 0 ? 0.2 : 0.31), 0, Math.cos(a) * (k === 0 ? 0.2 : 0.31)); tick.rotation.y = a; spin.add(tick); }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.03, 9), lit()); hub.position.y = 0.02; spin.add(hub);
    const armP = new THREE.Group(); armP.position.set(sx * 0.37, 0.05, -0.33); armP.rotation.y = sx * 0.55; g.add(armP);
    armP.add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.07, 10), steel));
    const tone = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.014, 0.38), steel); tone.position.set(0, 0.04, 0.19); armP.add(tone);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.06), lit(0xffffff)); head.position.set(0, 0.03, 0.39); armP.add(head); B.rings.push({ m: head.material, k: 1.2 });
    g.position.y = 0.03;
    const c = add('platter', sx * 1.22, 0.02, g, { ring, spin, r: 0.27, segs }); B.platters.push(c);
    // transport buttons under each platter
    for (let k = 0; k < 4; k++) { const bt = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.02, 12), lit(0xffffff)); bt.position.set(sx * 1.22 + (k - 1.5) * 0.1, 0.012, 0.53); desk.add(bt); B.rings.push({ m: bt.material, k: 0.9, blink: k + (sx > 0 ? 4 : 0) }); }
    // pitch fader down the outside
    const ps = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.006, 0.5), new THREE.MeshBasicMaterial({ color: 0x1a2030 })); ps.position.set(sx * 1.7, 0.01, 0.05); desk.add(ps);
    const pf = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.04), lit()); pf.position.y = 0.03; add('fader', sx * 1.7, 0.05, pf, { z0: 0.05, ph: sx * 2.2 });
  }
  // nine pads each side
  for (const sx of [-1, 1]) for (let i = 0; i < 9; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.12), lit()); m.position.y = 0.022;
    add('pad', sx * (0.42 + (i % 3) * 0.15), -0.16 + Math.floor(i / 3) * 0.15, m);
  }
  // mixer: six faders, two rows of knobs, a cross-fader and LED level meters
  for (let i = 0; i < 6; i++) {
    const x = (i - 2.5) * 0.095;
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.006, 0.4), new THREE.MeshBasicMaterial({ color: 0x1a2030 })); slot.position.set(x, 0.011, 0.2); desk.add(slot);
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.045), lit()); m.position.y = 0.035;
    add('fader', x, 0.2, m, { z0: 0.2, ph: i * 1.7 });
  }
  const xs = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.006, 0.02), new THREE.MeshBasicMaterial({ color: 0x1a2030 })); xs.position.set(0, 0.011, 0.5); desk.add(xs);
  const xf = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.07), lit(0xffffff)); xf.position.set(0, 0.035, 0.5); desk.add(xf); B.xf = xf;
  const knob = (x, z) => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.044, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0x1e2030, roughness: 0.3, metalness: 0.9 })); g.add(m); const capm = lit(); const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.012, 12), capm); cap.position.y = 0.034; g.add(cap); const hal = new THREE.Mesh(new THREE.RingGeometry(0.048, 0.058, 16), capm); hal.rotation.x = -Math.PI / 2; hal.position.y = -0.026; g.add(hal); g.position.y = 0.04; g.material = capm; return add('knob', x, z, g); };
  for (let i = 0; i < 6; i++) knob((i - 2.5) * 0.095, -0.2), knob((i - 2.5) * 0.095, -0.36);
  for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) knob(sx * (1.78 + (i % 2) * 0.17) + sx * 0.1, -0.34 + Math.floor(i / 2) * 0.16 + (0));
  for (const sx of [-1, 1]) for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.008, 0.026), lit()); m.position.set(sx * 0.305, 0.012, 0.4 - i * 0.034); desk.add(m); B.vu.push({ m: m.material, i, sx }); }
  // a field of small back-lit buttons along the DJ's edge and the wings
  const pos = [];
  for (let i = 0; i < 44; i++) pos.push([(i - 21.5) * 0.094, -0.56, 0.6]);
  for (const sx of [-1, 1]) for (let i = 0; i < 12; i++) pos.push([sx * (1.74 + (i % 4) * 0.085), 0.2 + Math.floor(i / 4) * 0.085, 0.6]);
  for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) pos.push([sx * (0.42 + (i % 3) * 0.15), 0.34 + Math.floor(i / 3) * 0.1, 0.9]);
  B.btn = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.016, 0.05), new THREE.MeshBasicMaterial({ color: 0xffffff }), pos.length); B.btnPos = pos;
  const mm = new THREE.Matrix4(); pos.forEach((p, i) => { mm.makeScale(p[2] / 0.6, 1, p[2] / 0.6); mm.setPosition(p[0], 0.012, p[1]); B.btn.setMatrixAt(i, mm); });
  B.btn.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(pos.length * 3), 3); desk.add(B.btn);

  // holographic waveform screens standing along the audience edge: the real track scrolling past a playhead
  const mkWave = (name) => { const a = SONG[name]; const d = new Uint8Array(a.length); for (let i = 0; i < a.length; i++) d[i] = a[i] * 255; const t = new THREE.DataTexture(d, a.length, 1, THREE.RedFormat); t.needsUpdate = true; t.magFilter = THREE.NearestFilter; return t; };
  const screen = (x, w, band, y = 0.2, h = 0.3) => {
    const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uWave: { value: mkWave(band) }, uPos: { value: 0 }, uN: { value: SONG[band].length }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uKick: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform sampler2D uWave; uniform float uPos,uN,uKick; uniform vec3 uA,uB; varying vec2 vUv;
        void main(){ float cols = 72.0; float cx = floor(vUv.x*cols); float idx = uPos + (cx - cols*0.5);
          float v = texture2D(uWave, vec2((idx+0.5)/uN, 0.5)).r; float gap = step(0.18, fract(vUv.x*cols));
          float y = abs(vUv.y-0.5)*2.0; float bar = step(y, 0.06 + v*0.9) * gap;
          float beat = step(mod(idx, 4.0), 0.5); float head = smoothstep(0.012, 0.0, abs(vUv.x-0.5));
          vec3 c = mix(uA, uB, y) * bar * (0.55 + 0.25*beat) * (cx < cols*0.5 ? 0.45 : 1.0);
          c += vec3(1.0)*head*(0.8+uKick); float fr = step(0.985, max(abs(vUv.x-0.5)*2.0, y)); c += mix(uA,uB,0.5)*fr*0.5;
          c += uA*0.05; gl_FragColor = vec4(c, 1.0); }` });
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, 0.62); p.rotation.x = -0.5; desk.add(p); B.screens.push(m); return p;
  };
  screen(-1.22, 0.95, 'low'); screen(1.22, 0.95, 'high'); screen(0, 1.1, 'full', 0.24, 0.36);
  // the signal core: nested nine-sided rings turning over the mixer
  B.core = new THREE.Group(); B.core.position.set(0, 0.62, 0.3); desk.add(B.core);
  for (let k = 0; k < 3; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.1 + k * 0.045, 0.006, 4, 9), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); B.core.add(r); }
  B.coreDot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), lit(0xffffff)); B.core.add(B.coreDot);

  // ---- front of the booth: an LED spectrum wall, light towers, under-glow ----
  const front = new THREE.Mesh(new THREE.BoxGeometry(4.36, 1.2, 0.14), dark); front.position.set(0, RISER_H + 0.56, DESK_Z + 0.42); scene.add(front);
  B.panel = new THREE.ShaderMaterial({ uniforms: { uBeat: { value: 0 }, uKick: { value: 0 }, uLow: { value: 0 }, uMid: { value: 0 }, uHigh: { value: 0 }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `uniform float uBeat,uKick,uLow,uMid,uHigh; uniform vec3 uA,uB; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      void main(){ vec2 cells = vec2(44.0, 14.0); vec2 id = floor(vUv*cells); vec2 f = fract(vUv*cells)-0.5;
        float x = abs(id.x/cells.x - 0.5)*2.0;                         // bass in the middle, hats at the edges
        float lvl = mix(uLow, uMid, smoothstep(0.0,0.55,x)); lvl = mix(lvl, uHigh, smoothstep(0.5,1.0,x));
        lvl = lvl * (0.55 + 0.45*h(vec2(id.x, floor(uBeat*4.0)))) * (0.95 + 0.6*uKick) + 0.08;
        float row = (id.y+0.5)/cells.y; float on = step(row, lvl); float peak = step(abs(row - min(0.97, lvl + 0.1)), 0.04);
        float led = smoothstep(0.48,0.3,max(abs(f.x),abs(f.y)));
        vec3 c = mix(uA, uB, row) * on * (0.5 + row) + vec3(1.0)*peak*0.7;
        c += mix(uA,uB,0.5) * 0.035; gl_FragColor = vec4(c*led*1.5, 1.0); }` });
  const pan = new THREE.Mesh(new THREE.PlaneGeometry(4.16, 1.02), B.panel); pan.position.set(0, RISER_H + 0.58, DESK_Z + 0.495); scene.add(pan);
  for (const y of [RISER_H + 0.03, RISER_H + 1.13]) { const st = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.03, 0.03), lit(0xffffff)); st.position.set(0, y, DESK_Z + 0.5); scene.add(st); B.rings.push({ m: st.material, k: 1.4 }); }
  for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) {
    const x = sx * (2.75 + k * 0.42), hgt = 2.3 - k * 0.36;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, hgt, 0.16), dark); post.position.set(x, RISER_H + hgt / 2, BOOTH_Z + 1.25 - k * 0.22); scene.add(post);
    const tube = new THREE.Mesh(new THREE.BoxGeometry(0.07, hgt - 0.2, 0.03), lit(0xffffff)); tube.position.set(x, RISER_H + hgt / 2, BOOTH_Z + 1.34 - k * 0.22); scene.add(tube);
    const capL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), lit(0xffffff)); capL.position.set(x, RISER_H + hgt + 0.06, BOOTH_Z + 1.25 - k * 0.22); scene.add(capL);
    B.towers.push({ m: tube.material, c: capL.material, k, sx });
  }

  const _c = new THREE.Color(), _w = new THREE.Color(1, 1, 1);
  B.update = (t, beatF, kick, energy, low, mid, high, A, Bc) => {
    const p = B.panel.uniforms; p.uBeat.value = beatF; p.uKick.value = kick; p.uLow.value = low; p.uMid.value = mid; p.uHigh.value = high; p.uA.value.copy(A); p.uB.value.copy(Bc);
    const pos16 = beatF * 4 + SONG.pre; for (const s of B.screens) { s.uniforms.uPos.value = pos16; s.uniforms.uA.value.copy(A); s.uniforms.uB.value.copy(Bc); s.uniforms.uKick.value = kick; }
    B.edge.material.color.copy(A).multiplyScalar(0.5 + 1.8 * kick * energy); B.edge2.material.color.copy(Bc).multiplyScalar(0.3 + 1.2 * (1 - kick) * energy); B.trim.material.color.copy(Bc).multiplyScalar(0.6 + 1.5 * kick);
    for (const r of B.rings) { const bl = r.blink != null ? (Math.floor(beatF * 2 + r.blink * 1.3) % 4 === 0 ? 1.8 : 0.35) : 1; r.m.color.copy(r.blink != null && r.blink % 2 ? Bc : A).multiplyScalar(r.k * bl * (0.5 + 0.8 * kick)); }
    for (const v of B.vu) { const lvl = (v.sx < 0 ? low : (mid + high) * 0.6) * (0.6 + 0.5 * kick) * 10; const on = v.i < lvl; _c.setHex(v.i > 7 ? 0xff3030 : v.i > 5 ? 0xffc040 : 0x40ff90); v.m.color.copy(_c).multiplyScalar(on ? 1.6 : 0.07); }
    for (const tw of B.towers) { const chase = (Math.floor(beatF) + (tw.sx > 0 ? 0 : 2)) % 4 === tw.k ? 1 : 0; const v = 0.12 + energy * (0.35 + 1.9 * chase * kick + 0.5 * kick); tw.m.color.copy(tw.k % 2 ? A : Bc).multiplyScalar(v); tw.c.color.copy(tw.k % 2 ? Bc : A).multiplyScalar(0.3 + 2.2 * chase * kick * energy); }
    const col = B.color || A;
    for (let i = 0; i < B.btnPos.length; i++) { const hsh = hash1(i * 12.9 + Math.floor(beatF * 2 + i * 0.37) * 0.618); const on = hsh > 0.72 - 0.25 * energy; _c.copy(i % 5 === 0 ? Bc : i % 7 === 0 ? _w : col).multiplyScalar(on ? 1.5 + kick : 0.1); B.btn.instanceColor.setXYZ(i, _c.r, _c.g, _c.b); }
    B.btn.instanceColor.needsUpdate = true;
    B.xf.position.x = 0.14 * Math.sin(beatF * Math.PI / 8); B.xf.material.color.copy(col).multiplyScalar(1.4);
    B.core.children.forEach((r, k) => { if (k < 3) { r.rotation.set(beatF * 0.4 * (k + 1) * 0.5, beatF * 0.3 * (k % 2 ? -1 : 1), k); r.material.color.copy(k % 2 ? A : Bc).multiplyScalar(0.8 + kick); } });
    B.core.scale.setScalar(0.9 + 0.35 * kick * energy + 0.3 * mid); B.coreDot.material.color.copy(_w).multiplyScalar(1 + 2 * kick);
    for (const pl of B.platters) pl.segs.forEach((m, k) => m.color.copy(k % 2 ? A : Bc).multiplyScalar((Math.floor(beatF * 2) % 9 === k ? 2.4 : 0.25) + pl.hit));
  };
  return B;
}

const FINGERS = ['Thumb', 'Index', 'Middle', 'Ring'];

export class DJ {
  constructor(char, booth) {
    this.c = char; this.booth = booth; const b = char.bones;
    char.root.position.set(0, 0, BOOTH_Z - 0.12);
    this.arms = ['Left', 'Right'].map(s => ({
      s, sh: b[s + 'Shoulder'], up: b[s + 'Arm'], lo: b[s + 'ForeArm'], hand: b[s + 'Hand'],
      fingers: FINGERS.map(f => [b[s + 'Hand' + f + '1'], b[s + 'Hand' + f + '2'], b[s + 'Hand' + f + '3']]).filter(x => x[0]),
    }));
    // which arm sits over which half of the desk
    char.root.updateMatrixWorld(true);
    for (const a of this.arms) { a.sx = Math.sign(a.up.getWorldPosition(V()).x) || 1; a.pool = k => booth.controls.filter(c => c.kind === k && c.side === a.sx); }
    const a0 = this.arms[0];
    this.armLen = a0.up.getWorldPosition(V()).distanceTo(a0.lo.getWorldPosition(V())) + a0.lo.getWorldPosition(V()).distanceTo(a0.hand.getWorldPosition(V()));
    const f = a0.fingers[2] || a0.fingers[0];
    const s1 = a0.hand.getWorldPosition(V()).distanceTo(f[0].getWorldPosition(V())), s2 = f[0].getWorldPosition(V()).distanceTo(f[1].getWorldPosition(V())), s3 = f[1].getWorldPosition(V()).distanceTo(f[2].getWorldPosition(V()));
    this.tentLen = s1 + s2 + s3 * 2.2;
    this.shoulderY = a0.up.getWorldPosition(V()).y;
    this.hover = DECK_Y + 0.42 - this.shoulderY;   // lift so the shoulders ride just above the desk
    this.legs = ['LeftUpLeg', 'RightUpLeg', 'LeftLeg', 'RightLeg', 'LeftFoot', 'RightFoot', 'LeftToeBase', 'RightToeBase'].map(n => b[n]).filter(Boolean).map(bn => ({ bn, q: bn.quaternion.clone() }));
    this.proc = [b.Neck, b.Head, b.Spine, b.Spine1, b.Spine2, ...this.arms.flatMap(a => [a.sh, a.up, a.lo, a.hand, ...a.fingers.flat()])].filter(Boolean).map(bn => ({ bn, q: bn.quaternion.clone() }));
    this.info = { armLen: this.armLen, tentLen: this.tentLen, shoulderY: this.shoulderY, hover: this.hover };
  }

  // what each hand is doing at beat b: {mode:'mix'|'up'|'free', focus}
  plan(beatF) {
    const bar = Math.floor(beatF / 4), sec = sectionAt(bar), beat = Math.floor(beatF);
    const pre = PRE_DROP.includes(bar), drop = DROPS.some(d => bar >= d && bar < d + 2);
    const out = { cast: 0, hands: [{ mode: 'mix' }, { mode: 'mix' }], step: 2 };
    if (bar < 2) out.hands = [{ mode: 'free' }, { mode: 'free' }];
    else if (bar < 3) out.hands = [{ mode: 'free' }, { mode: 'mix' }];
    else if (sec.mode === 'rumble' || sec.mode === 'build' || sec.mode === 'rise') out.step = 4;
    else if (sec.mode === 'break') { out.hands = bar % 4 === 3 ? [{ mode: 'mix' }, { mode: 'free' }] : [{ mode: 'free' }, { mode: 'free' }]; out.step = 4; }
    else if (sec.mode === 'outro') out.hands = [{ mode: 'free' }, { mode: 'free' }];
    if (pre) { out.cast = 1; out.hands = [{ mode: 'free' }, { mode: 'free' }]; }
    if (drop) { const w = bar % 2; out.hands[w] = { mode: 'up' }; if (bar === 72 || bar === 20) { if (beat % 4 < 2 && DROPS.includes(bar)) out.hands = [{ mode: 'up' }, { mode: 'up' }]; } }
    else if (sec.kick && bar % 8 === 7) out.hands[(bar >> 3) % 2] = { mode: 'up' };
    return out;
  }
  focusOf(arm, armIdx, step, stepLen) {
    const kinds = ['platter', 'pad', 'fader', 'knob', 'platter', 'pad'];
    return kinds[Math.floor(hash1(step * 7.3 + armIdx * 31.7 + stepLen) * kinds.length)];
  }
  // where the four tentacle tips of one hand want to be for a given focus step
  tips(arm, armIdx, focus, step, beatF, out) {
    const pool = arm.pool(focus); const desk = this.booth.desk; const sub = Math.floor(beatF * 2);
    for (let k = 0; k < 4; k++) {
      let c, lx = 0, lz = 0, ly = 0.03;
      if (focus === 'platter') { c = pool[0]; const a = (k / 4) * Math.PI * 1.2 - 0.6 + (arm.sx > 0 ? Math.PI : 0) + Math.sin(beatF * Math.PI * 2) * 0.5 * (step % 2 ? 1 : 0.4); lx = Math.sin(a) * c.r; lz = Math.cos(a) * c.r * 0.9; ly = 0.07; }
      else if (focus === 'pad') { c = pool[Math.floor(hash1(step * 3.1 + k * 17.3 + armIdx * 5 + Math.floor((sub + k) / 2) * 0.77) * pool.length)]; const tap = (beatF * 2 + k * 0.5) % 1; ly = 0.04 + 0.1 * Math.sin(Math.min(1, tap * 1.6) * Math.PI); }
      else if (focus === 'fader') { c = pool[(k + step) % pool.length]; ly = 0.06; }
      else { const near = pool.filter(p => Math.abs(p.x) < 1 === (step % 2 === 0)); const pl = near.length >= 4 ? near : pool; c = pl[(k * 2 + step) % pl.length]; ly = 0.08; }
      out[k] = { c, p: desk.localToWorld(V().set(c.x + lx, ly, c.mesh.position.z + lz)) };
    }
    return out;
  }

  update(t, beatF, kick) {
    const c = this.c, b = c.bones, booth = this.booth, bar = Math.floor(beatF / 4), sec = sectionAt(bar);
    const energy = sec.energy;
    // desk controls live their own life: platters turn, faders ride
    for (const ct of booth.controls) {
      ct.hit *= 0.86;
      if (ct.kind === 'platter') ct.spin.rotation.y = -beatF * 0.9 * (ct.side > 0 ? 1 : 0.97) + (ct.scr || 0);
      if (ct.kind === 'fader') ct.mesh.position.z = ct.z0 + 0.15 * Math.sin(beatF * 0.3927 + ct.ph) * (0.4 + energy);
    }
    // body: floating, with spell-casting through the held breath before a drop
    for (const pr of this.proc) pr.bn.quaternion.copy(pr.q);
    const plan = this.plan(beatF), prev = this.plan(beatF - 1);
    const fb = beatF - Math.floor(beatF);
    const castW = prev.cast + (plan.cast - prev.cast) * sstep(0, 0.6, fb);
    const floatT = ((beatF / 8) % 1 + 1) % 1 * c.clips.Floating.duration;
    const list = [{ clip: 'Floating', time: floatT, weight: 1 - castW }];
    if (castW > 0.001) { const inBar = (beatF / 4) % 1; list.push({ clip: 'Two_Hand_Spell_Casting', time: (0.12 + 0.62 * inBar) * c.clips.Two_Hand_Spell_Casting.duration, weight: castW }); }
    c.pose(list);
    // rise out of the booth in the intro, sink away at the very end
    const rise = sstep(-1.5, 7, beatF), sink = sstep(398, 402.4, beatF);
    c.root.position.y = this.hover - 2.6 * (1 - rise) - 3 * sink + 0.05 * Math.sin(beatF * Math.PI / 2) - 0.035 * kick * energy;
    c.root.rotation.y = 0.12 * Math.sin(beatF * Math.PI / 8);
    c.root.position.x = 0.22 * Math.sin(beatF * Math.PI / 4) * (0.4 + energy * 0.6);
    c.root.updateMatrixWorld(true);
    // legs hang straight and trail back behind the desk instead of treading through it; the body leans in over the controls
    this.legs.forEach((l, i) => { l.bn.quaternion.copy(l.q); if (i < 4) { l.bn.updateWorldMatrix(true, false); turnWorld(l.bn, _e.set(1, 0, 0), (i < 2 ? -0.28 : -0.12) + 0.07 * Math.sin(beatF * Math.PI / 2 + i * 1.7)); turnWorld(l.bn, _e.set(0, 0, 1), 0.05 * Math.sin(beatF * Math.PI / 4 + i)); } });
    const lean = 0.2 * (1 - castW); if (b.Spine) turnWorld(b.Spine, _e.set(1, 0, 0), lean); if (b.Spine1) turnWorld(b.Spine1, _e.set(1, 0, 0), lean * 0.8);
    // head: nod on the beat, glance at the busier hand
    turnWorld(b.Neck || b.Head, _e.set(1, 0, 0), 0.10 * kick * (0.3 + energy) - 0.12);
    // arms
    this.arms.forEach((arm, i) => {
      const cur = plan.hands[i], was = prev.hands[i];
      const wMix = (was.mode === 'mix' ? 1 : 0) + ((cur.mode === 'mix' ? 1 : 0) - (was.mode === 'mix' ? 1 : 0)) * sstep(0, 0.7, fb);
      const wUp = (was.mode === 'up' ? 1 : 0) + ((cur.mode === 'up' ? 1 : 0) - (was.mode === 'up' ? 1 : 0)) * sstep(0, 0.5, fb);
      const w = Math.min(1, wMix + wUp); if (w < 0.002) { this.wiggle(arm, i, beatF, 0.5); return; }
      // focus steps: move to a new group of controls every `step` beats
      const stepLen = plan.step, st = Math.floor((beatF + i * 1) / stepLen), sf = ((beatF + i * 1) / stepLen) % 1;
      const f1 = this.focusOf(arm, i, st, stepLen), f0 = this.focusOf(arm, i, st - 1, stepLen);
      const tA = this.tips(arm, i, f0, st - 1, beatF, []), tB = this.tips(arm, i, f1, st, beatF, []);
      const k = sstep(0, 0.42 / stepLen * 2, sf);
      const tips = tB.map((tb, n) => ({ c: tb.c, p: tA[n].p.clone().lerp(tb.p, k) }));
      // hand hovers over the middle of its four tips
      const cen = V(); tips.forEach(tp => cen.add(tp.p)); cen.multiplyScalar(0.25);
      const hover = Math.min(0.34, this.tentLen * 0.55);
      const mixTarget = cen.clone().add(_d.set(-arm.sx * 0.04, hover + 0.05 * Math.sin(k * Math.PI), -0.16));
      arm.up.getWorldPosition(_a);
      const upTarget = _a.clone().add(_d.set(arm.sx * 0.28, this.armLen * (0.86 + 0.12 * kick), 0.22 + 0.1 * Math.sin(beatF * Math.PI)));
      const target = mixTarget.clone().lerp(upTarget, wUp / Math.max(0.0001, wMix + wUp));
      this.ik(arm, target, w);
      if (wUp < 0.5) {
        // palm toward the controls, then each tentacle to its own control
        const fm = arm.fingers[Math.min(2, arm.fingers.length - 1)][0];
        aim(arm.hand, fm.getWorldPosition(_b), _c.copy(cen).sub(arm.hand.getWorldPosition(_d)).add(_e.set(0, -0.05, 0.1)), w * 0.85);
        arm.fingers.forEach((ch, n) => {
          const tp = tips[n % tips.length]; ch[0].getWorldPosition(_d);
          const mid = _e.copy(_d).lerp(tp.p, 0.5); mid.y += 0.07 + 0.03 * Math.sin(beatF * 3 + n);
          aim(ch[0], ch[1].getWorldPosition(_b), mid.sub(_d), w);
          aim(ch[1], ch[2].getWorldPosition(_b), _c.copy(tp.p).sub(ch[1].getWorldPosition(_d)), w);
          // touching? light the control (and scratch the platter)
          if (k > 0.9 && w > 0.8) { tp.c.hit = Math.max(tp.c.hit, tp.c.kind === 'pad' ? (((beatF * 2 + n * 0.5) % 1) < 0.25 ? 1 : tp.c.hit) : 0.75); if (tp.c.kind === 'platter') tp.c.scr = Math.sin(beatF * Math.PI * 2) * 0.5 * (st % 2 ? 1 : 0.4); }
        });
      } else this.wiggle(arm, i, beatF, 1.6, true);
    });
    // desk lights
    const col = booth.color || new THREE.Color(0x3fd8ff);
    for (const ct of booth.controls) {
      const base = ct.kind === 'pad' ? 0.10 + 0.5 * (hash1(ct.x * 91 + ct.z * 37 + Math.floor(beatF * 2) * 0.13) > 0.8 ? energy : 0) : 0.22;
      const v = base + ct.hit * 3.2; const m = ct.kind === 'platter' ? ct.ring.material : ct.mesh.material; if (ct.kind === 'knob') ct.mesh.rotation.y = Math.sin(beatF * 0.6 + ct.x * 9) * 1.2 + ct.hit;
      m.color.copy(col).multiplyScalar(v); if (ct.hit > 0.3) m.color.lerp(_colW, 0.35 * ct.hit);
      if (ct.kind === 'platter') ct.spin.children.forEach(ch => { if (ch.geometry.type !== 'RingGeometry') ch.material.color.copy(col).multiplyScalar(0.5 + 1.5 * kick); });
    }
  }
  wiggle(arm, i, beatF, amt, splay) {
    arm.fingers.forEach((ch, n) => {
      for (let j = 0; j < 2; j++) {
        const ang = amt * 0.16 * Math.sin(beatF * Math.PI * (splay ? 2 : 0.5) + n * 1.3 + j * 0.9 + i);
        turnWorld(ch[j], _e.set(Math.sin(n * 2.1), 0.2, Math.cos(n * 2.1)).normalize(), ang + (splay ? (n - 1.5) * 0.12 * (j === 0 ? 1 : 0) : 0));
      }
    });
  }
  ik(arm, target, w) {
    const A = arm.up.getWorldPosition(V()), Bp = arm.lo.getWorldPosition(V()), C = arm.hand.getWorldPosition(V());
    const la = A.distanceTo(Bp), lb = Bp.distanceTo(C);
    const to = target.clone().sub(A); let d = to.length(); d = Math.max(0.05, Math.min(la + lb - 0.004, d)); to.normalize();
    const x = (la * la - lb * lb + d * d) / (2 * d), h = Math.sqrt(Math.max(0, la * la - x * x));
    const pole = V().set(arm.sx * 0.9, 0.25, -0.75); pole.addScaledVector(to, -pole.dot(to)).normalize();
    const elbow = A.clone().addScaledVector(to, x).addScaledVector(pole, h);
    aim(arm.up, Bp, elbow.clone().sub(A), w);
    const B2 = arm.lo.getWorldPosition(V());
    aim(arm.lo, arm.hand.getWorldPosition(V()), A.clone().addScaledVector(to, d).sub(B2), w);
  }
}
const _colW = new THREE.Color(1.6, 1.6, 1.6);
