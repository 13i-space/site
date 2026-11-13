import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const ROSTER = {
  chephro: { name: 'Chephro', role: 'The DJ', h: 2.5, glow: 2.4, color: 0x3fd8ff },
  brontor: { name: 'Brontor', role: 'Vanguard', h: 2.4, glow: 1.7, color: 0x58c8ff },
  elyra:   { name: 'Elyra', role: 'Mender', h: 1.9, glow: 1.8, color: 0x8ff0d0 },
  kryvax:  { name: 'Kryvax', role: 'Striker', h: 1.85, glow: 2.6, color: 0xff4a3a },
  murm:    { name: 'Murm', role: 'Disrupter', h: 1.7, glow: 1.4, color: 0xd070ff },
  skitter: { name: 'Skitter', role: 'Striker', h: 1.5, glow: 2.2, color: 0x7a5cff },
  thulkar: { name: 'Thulkar', role: 'Vanguard', h: 2.5, glow: 2.4, color: 0x9fe8ff },
  vexl:    { name: 'Vexl', role: 'Disrupter', h: 1.9, glow: 2.2, color: 0x4fe0ff },
  warden:  { name: 'Temple Warden', role: 'Rare guest', h: 4.8, glow: 0, color: 0xffc65a },
};

const BONE = n => n.replace(/^mixamorig:?/, '');

export class Char {
  constructor(id, gltf) {
    this.id = id; this.info = ROSTER[id];
    this.root = new THREE.Group();      // placed on the floor by the director
    this.model = gltf.scene;
    this.root.add(this.model);
    this.bones = {}; this.meshes = []; this.mats = [];
    this.model.traverse(o => {
      if (o.isBone) this.bones[BONE(o.name)] = o;
      if (o.isSkinnedMesh) {
        o.frustumCulled = false; o.castShadow = true; this.meshes.push(o);
        if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
        const m = o.material; this.mats.push(m);
        if (m.emissiveMap) { m.emissive = new THREE.Color(0xffffff); m.emissiveIntensity = this.info.glow; }
        m.envMapIntensity = 0.6;
      }
    });
    // fit to the game's height, feet on the floor, using the true skinned bounds
    const box = this.skinnedBox();
    const s = this.info.h / (box.max.y - box.min.y);
    this.model.scale.multiplyScalar(s);
    const b2 = this.skinnedBox();
    this.model.position.y -= b2.min.y;
    this.model.position.x -= (b2.min.x + b2.max.x) / 2;
    this.fitScale = s;
    this.rest = {};
    for (const k in this.bones) this.rest[k] = { q: this.bones[k].quaternion.clone(), p: this.bones[k].position.clone() };
    this.clips = {};
    for (const c of gltf.animations) this.clips[c.name] = c;
    this.mixer = new THREE.AnimationMixer(this.model);
    this.actions = {};
  }
  skinnedBox() {
    const bx = new THREE.Box3(); this.root.updateMatrixWorld(true);
    for (const m of this.meshes) { m.skeleton.update(); m.computeBoundingBox(); bx.union(m.boundingBox.clone().applyMatrix4(m.matrixWorld)); }
    return bx;
  }
  // Take a clip made for another Salient character and fit it to this one.
  // Every rig is Mixamo, so bone rotations carry over; the hips' travel is rescaled.
  adopt(name, clip, from, opts = {}) {
    const tracks = [];
    const ratio = this.rest.Hips.p.y / from.rest.Hips.p.y;
    for (const t of clip.tracks) {
      const dot = t.name.lastIndexOf('.'); const node = t.name.slice(0, dot), prop = t.name.slice(dot + 1);
      const b = BONE(node);
      const mine = this.bones[b]; if (!mine) continue;
      if (opts.skip && opts.skip.test(b)) continue;
      if (prop === 'quaternion') tracks.push(new THREE.QuaternionKeyframeTrack(mine.name + '.quaternion', t.times, t.values));
      else if (prop === 'position' && b === 'Hips') {
        const v = new Float32Array(t.values.length); const r0 = from.rest.Hips.p, m0 = this.rest.Hips.p;
        for (let i = 0; i < v.length; i += 3) { v[i] = (t.values[i] - r0.x) * ratio + m0.x; v[i + 1] = t.values[i + 1] * ratio; v[i + 2] = (t.values[i + 2] - r0.z) * ratio + m0.z; }
        tracks.push(new THREE.VectorKeyframeTrack(mine.name + '.position', t.times, v));
      }
    }
    const c = new THREE.AnimationClip(name, clip.duration, tracks);
    this.clips[name] = c; return c;
  }
  // keep a move's travel within `max` metres of the dancer's spot
  tether(max) {
    const h = this.bones.Hips, r = this.rest.Hips.p; if (!this._unit) { const v = new THREE.Vector3(); h.parent.getWorldScale(v); this._unit = v.x / (this.root.scale.x || 1) || 1; }
    const lim = max / this._unit; const dx = h.position.x - r.x, dz = h.position.z - r.z; const d = Math.hypot(dx, dz);
    if (d > 1e-6) { const k = lim * Math.tanh(d / lim) / d; h.position.x = r.x + dx * k; h.position.z = r.z + dz * k; }
  }
  action(name) {
    if (!this.actions[name]) {
      const c = this.clips[name]; if (!c) throw new Error(this.id + ' has no clip ' + name);
      const a = this.mixer.clipAction(c); a.play(); a.setEffectiveWeight(0); a.paused = true; this.actions[name] = a;
    }
    return this.actions[name];
  }
  // pose = [{clip, time, weight}], applied exactly (no hidden clock) so the show can be scrubbed
  pose(list) {
    for (const k in this.actions) this.actions[k].setEffectiveWeight(0);
    // three only writes a bone when its animated value changed; our IK and bounce
    // layers edit bones afterwards, so make it write every time
    const ai = this.mixer._accuIndex | 0;
    for (const b of this.mixer._bindings) { const st = b.valueSize; b.buffer.fill(7.777, ai * st + st, ai * st + 2 * st); }
    for (const p of list) { const a = this.action(p.clip); a.time = Math.max(0, Math.min(a.getClip().duration - 1e-4, p.time)); a.setEffectiveWeight(p.weight); }
    this.mixer.update(0);
  }
}

export async function loadChars(ids, base, onProgress) {
  const L = new GLTFLoader(); const out = {}; let n = 0;
  await Promise.all(ids.map(async id => { const g = await L.loadAsync(base + id + '.glb'); out[id] = new Char(id, g); onProgress && onProgress(++n / ids.length, id); }));
  return out;
}
