// The director: who is on the floor, where they stand, what they dance, what
// the lights and the camera do. Everything is worked out from the song's beat
// position alone, so the show lands on the beat and can be scrubbed anywhere.
import * as THREE from 'three';
import { SONG, band, beatAt, sectionAt, DROPS, PRE_DROP, END_BAR } from './song.js';
import { FLOOR_R, BOOTH_Z, hash1, beamMaterial } from './stage.js';
import { ROSTER } from './chars.js';

const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const ALL = ['skitter', 'elyra', 'kryvax', 'murm', 'vexl', 'brontor', 'thulkar'];
const HEAVY = { brontor: 1, thulkar: 1 };

// ---- who dances when (bars) -------------------------------------------------
export function buildSchedule(warden) {
  const S = [
    { bar: 0, cast: [] },
    { bar: 4, cast: ['skitter'], solo: 'skitter' },
    { bar: 6, cast: ['skitter', 'elyra'], solo: 'elyra' },
    { bar: 8, cast: ['skitter', 'elyra', 'kryvax'], solo: 'kryvax' },
    { bar: 10, cast: ['skitter', 'elyra', 'kryvax', 'murm'], solo: 'murm' },
    { bar: 12, cast: ['skitter', 'elyra', 'kryvax', 'murm'], solo: 'elyra' },
    { bar: 16, cast: ['skitter', 'elyra', 'kryvax', 'murm', 'vexl'], solo: 'vexl' },
    { bar: 20, cast: ALL, solo: 'brontor', duo: 'thulkar' },
    { bar: 24, cast: ['murm', 'skitter', 'kryvax', 'brontor', 'vexl'], solo: 'murm' },
    { bar: 28, cast: ['skitter', 'kryvax', 'elyra', 'thulkar', 'vexl'], solo: 'skitter' },
    { bar: 32, cast: ['kryvax', 'elyra', 'murm', 'thulkar', 'brontor'], solo: 'kryvax' },
    { bar: 36, cast: ['thulkar', 'murm', 'skitter', 'vexl', 'elyra'], solo: 'thulkar' },
    { bar: 40, cast: ['vexl', 'brontor', 'kryvax', 'skitter', 'murm'], solo: 'vexl' },
    { bar: 44, cast: ALL, unison: 'HipHop' },
    { bar: 48, cast: ['brontor', 'elyra', 'murm', 'kryvax'], solo: 'brontor' },
    { bar: 52, cast: ['elyra', 'skitter', 'vexl', 'thulkar', 'murm'], solo: 'elyra' },
    { bar: 55, cast: ['elyra'], solo: 'elyra', fly: true },
    { bar: 60, cast: ['elyra', 'murm'], solo: 'murm', fly: true },
    { bar: 64, cast: ['elyra', 'murm', 'skitter'], solo: 'skitter' },
    { bar: 66, cast: ['elyra', 'murm', 'skitter', 'kryvax', 'vexl'], solo: 'kryvax' },
    { bar: 68, cast: ['elyra', 'murm', 'skitter', 'kryvax', 'vexl', 'brontor'], solo: 'brontor' },
    { bar: 70, cast: ALL, solo: 'thulkar' },
    warden ? { bar: 72, cast: [...ALL, 'warden'], solo: 'warden', unison: 'Silly', wardenShow: true }
           : { bar: 72, cast: ALL, unison: 'Silly' },
    warden ? { bar: 76, cast: [...ALL, 'warden'], solo: 'warden', unison: 'Silly', wardenShow: true }
           : { bar: 76, cast: ALL, solo: 'thulkar', duo: 'brontor' },
    { bar: 80, cast: ['kryvax', 'skitter', 'elyra', 'murm', 'vexl'], solo: 'kryvax' },
    { bar: 84, cast: ['murm', 'brontor', 'thulkar', 'skitter', 'elyra'], solo: 'murm' },
    { bar: 88, cast: ['skitter', 'vexl', 'kryvax', 'thulkar', 'brontor'], solo: 'skitter' },
    { bar: 92, cast: ALL, solo: 'elyra' },
    { bar: 96, cast: ALL, unison: 'Boom' },
    { bar: 98, cast: ALL, bow: true },
    { bar: 99.5, cast: [] },
  ];
  S.forEach((p, i) => { p.i = i; p.beat = p.bar * 4; p.end = (S[i + 1] ? S[i + 1].bar : END_BAR) * 4; p.slots = formation(p); });
  return S;
}
function formation(p) {
  const out = {}; const cast = p.cast.filter(c => c !== 'warden');
  if (p.wardenShow) {      // everyone fans out in front of the giant
    out.warden = [0, -1.2];
    cast.forEach((c, k) => { const a = lerp(-1.25, 1.25, k / (cast.length - 1)); out[c] = [Math.sin(a) * 6.0, 2.6 + Math.cos(a) * 2.6 - 1.2]; });
    return out;
  }
  if (p.unison || p.bow) { // a V, tallest at the back corners
    const order = [...cast].sort((a, b) => (HEAVY[a] || 0) - (HEAVY[b] || 0));
    const pts = [[0, 3.6], [-2.5, 2.0], [2.5, 2.0], [-4.6, 0.3], [4.6, 0.3], [-2.4, -2.2], [2.4, -2.2]];
    order.forEach((c, k) => out[c] = pts[k] || [0, 0]); return out;
  }
  const front = [p.solo, p.duo].filter(Boolean);
  const rest = cast.filter(c => !front.includes(c)).sort((a, b) => hash1(a.length * 3.3 + p.bar + a.charCodeAt(1)) - hash1(b.length * 3.3 + p.bar + b.charCodeAt(1)));
  if (front.length === 1) out[front[0]] = [0, 3.2]; else if (front.length === 2) { out[front[0]] = [-2.2, 3.0]; out[front[1]] = [2.2, 3.0]; }
  rest.forEach((c, k) => { const n = rest.length; const a = n === 1 ? (p.bar % 4 ? 0.7 : -0.7) : lerp(-1.15, 1.15, k / (n - 1)); const r = 5.2 + (HEAVY[c] ? 0.5 : 0) - (n > 4 && k % 2 ? 1.5 : 0); out[c] = [Math.sin(a) * r, 2.4 - Math.cos(a) * r * 0.82]; });
  return out;
}
export const phraseAt = (S, beatF) => { let p = S[0]; for (const x of S) if (beatF >= x.beat) p = x; return p; };

// ---- moves ------------------------------------------------------------------
// [clip, L(oop)/P(ing-pong), tiers it suits: l(ow) m(id) h(igh)]
const SHARED = { HipHop: ['elyra', 'Hip_Hop_Dancing'], Rumba: ['kryvax', 'Rumba_Dancing'], Silly: ['murm', 'Silly_Dancing'], Boom: ['brontor', 'Boom_Dance'] };
const MOVES = {
  elyra: [['Dwarf_Idle', 'L', 'l'], ['Floating', 'L', 'l'], ['HipHop', 'L', 'mh'], ['Rumba', 'L', 'mh'], ['Silly', 'L', 'h'], ['Boom', 'L', 'mh'], ['Standing_2H_Magic_Area_Attack_02', 'P', 'mh'], ['Mma_Kick', 'P', 'h']],
  kryvax: [['Unarmed_Idle_01', 'L', 'l'], ['Rumba', 'L', 'mh'], ['HipHop', 'L', 'mh'], ['Boom', 'L', 'mh'], ['Silly', 'L', 'h'], ['Flying_Kick', 'P', 'h'], ['Jumping', 'P', 'h']],
  murm: [['Orc_Idle', 'L', 'l'], ['Silly', 'L', 'mh'], ['HipHop', 'L', 'mh'], ['Rumba', 'L', 'mh'], ['Boom', 'L', 'h'], ['Standing_Torch_Jump', 'P', 'h'], ['Roundhouse_Kick', 'P', 'h']],
  skitter: [['Ready_Idle', 'L', 'l'], ['HipHop', 'L', 'mh'], ['Silly', 'L', 'mh'], ['Rumba', 'L', 'mh'], ['Boom', 'L', 'h'], ['Martelo_2', 'P', 'h'], ['Dodging', 'P', 'mh'], ['Kicking', 'P', 'h']],
  brontor: [['Alert', 'L', 'l'], ['Boom', 'L', 'mh'], ['HipHop', 'L', 'mh'], ['Silly', 'L', 'h'], ['Attack', 'P', 'h'], ['Skill_03', 'P', 'h']],
  thulkar: [['Nervously_Look_Around', 'L', 'l'], ['Punching_Bag', 'L', 'mh'], ['Cross_Punch', 'P', 'mh'], ['Elbow_Punching', 'P', 'h'], ['Hook_Punch', 'P', 'h'], ['Rifle_Jump', 'P', 'h'], ['Roundhouse_Kick', 'P', 'h'], ['Punching', 'P', 'h'], ['Stabbing', 'P', 'mh']],
  vexl: [['Standing_Idle', 'L', 'l'], ['HipHop', 'L', 'mh'], ['Rumba', 'L', 'mh'], ['Silly', 'L', 'mh'], ['Boom', 'L', 'h'], ['Two_Hand_Spell_Casting', 'P', 'mh'], ['Sumo_High_Pull', 'P', 'h'], ['Fist_Fight_A', 'L', 'h']],
  warden: [['Orc_Idle', 'L', 'l'], ['Silly', 'L', 'h'], ['HipHop', 'L', 'h'], ['Boom', 'L', 'h'], ['Jump', 'P', 'h'], ['Hurricane_Kick', 'P', 'h'], ['Great_Sword_Jump_Attack', 'P', 'h'], ['Standing_Melee_Attack_Downward', 'P', 'h'], ['Fist_Fight_B', 'L', 'h']],
};
const NICE = [2, 4, 6, 8, 12, 16];
function beatsFor(dur) { const n = dur / SONG.P; let best = 4, bs = 9; for (const b of NICE) { const s = Math.abs(Math.log(b / n)); if (s < bs) { bs = s; best = b; } } return best; }

export function prepareMoves(chars) {
  const lib = {};
  for (const id in MOVES) {
    const c = chars[id]; if (!c) continue;
    for (const k in SHARED) {
      const [owner, clip] = SHARED[k];
      if (id === 'thulkar') continue;                       // his shell only works with his own moves
      const opt = id === 'vexl' ? { skip: /Leg|Foot|Toe|Hips/ } : {};
      c.adopt(k, chars[owner].clips[clip], chars[owner], opt);
    }
    if (id === 'vexl') for (const m of MOVES.vexl) if (!SHARED[m[0]]) c.adopt('v_' + m[0], c.clips[m[0]], c, { skip: /Leg|Foot|Toe|Hips/ });
    lib[id] = MOVES[id].filter(m => id !== 'thulkar' || !SHARED[m[0]]).map(m => { const clip = (id === 'vexl' && !SHARED[m[0]]) ? 'v_' + m[0] : m[0]; const d = c.clips[clip].duration; return { clip, mode: m[1], tiers: m[2], dur: d, beats: beatsFor(d) }; });
  }
  return lib;
}
const tierOf = sec => (sec.mode === 'drop' || sec.mode === 'groove') ? 'h' : (sec.mode === 'build' || sec.mode === 'rise') ? 'm' : 'l';

function moveTime(m, tb, slow) {
  const beats = m.beats * slow; let x = tb / beats;
  if (m.mode === 'L') { x = ((x % 1) + 1) % 1; return x * m.dur; }
  x = ((x % 2) + 2) % 2; x = x > 1 ? 2 - x : x; x = x * x * (3 - 2 * x) * 0.94 + 0.03; return x * m.dur;
}

// ---- palettes ----------------------------------------------------------------
const PAL = {
  omen: [0xff1730, 0x7a2cff], violet: [0x9a3cff, 0xff2a8a], cyanmag: [0x18e0ff, 0xff28c8], amber: [0xffa018, 0x8a3cff],
  acid: [0x40ff90, 0x1890ff], ice: [0x2a6bff, 0x30e8d0], white: [0xffffff, 0xff2030], gold: [0xffc040, 0xff5a10], blood: [0xff2a20, 0xffb060],
};
const GROOVE_PALS = ['cyanmag', 'amber', 'acid', 'violet', 'blood'];
function paletteFor(sec, phrase, wardenOn) {
  if (wardenOn) return PAL.gold;
  if (sec.mode === 'intro' || sec.mode === 'rumble') return PAL.omen;
  if (sec.mode === 'build') return PAL.violet;
  if (sec.mode === 'break') return PAL.ice;
  if (sec.mode === 'rise') return PAL.violet;
  if (sec.mode === 'drop') return phrase.bar === 44 ? PAL.cyanmag : PAL.white;
  if (sec.mode === 'outro') return PAL.omen;
  return PAL[GROOVE_PALS[phrase.i % GROOVE_PALS.length]];
}

const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _col = new THREE.Color(), _colB = new THREE.Color();
const _e = new THREE.Euler(), _q2 = new THREE.Quaternion(), _v3 = new THREE.Vector3();
const DOWN = new THREE.Vector3(0, -1, 0), UP = new THREE.Vector3(0, 1, 0);

export class Show {
  constructor({ scene, camera, stage, booth, chars, dj, lights }) {
    Object.assign(this, { scene, camera, stage, booth, chars, dj, lights });
    this.lib = prepareMoves(chars);
    this.setWarden(false);
    this.colA = new THREE.Color(); this.colB = new THREE.Color();
    this.dancers = {};
    for (const id of [...ALL, 'warden']) {
      const c = chars[id]; if (!c) continue;
      scene.add(c.root); c.root.visible = false;
      const col = new THREE.Color(ROSTER[id].color);
      const bg = new THREE.CylinderGeometry(1, 1, 1, 20, 1, true); bg.translate(0, 0.5, 0);
      const beam = new THREE.Mesh(bg, beamMaterial(true)); beam.material.uniforms.uColor.value.copy(col).lerp(new THREE.Color(0xffffff), 0.3); beam.renderOrder = 6;
      beam.scale.set(c.info.h * 0.28, 14, c.info.h * 0.28); scene.add(beam);
      const pool = new THREE.Mesh(new THREE.CircleGeometry(1.5, 32), new THREE.MeshBasicMaterial({ map: stage.glowTex, color: col, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
      pool.rotation.x = -Math.PI / 2; pool.position.y = 0.03; scene.add(pool);
      this.dancers[id] = { c, beam, pool, col, pos: new THREE.Vector3(), vis: 0 };
    }
    this.solo = null; this.onSolo = null; this.shotName = '';
    this.camPos = new THREE.Vector3(0, 3.2, 15); this.camLook = new THREE.Vector3(0, 2.2, -2);
  }
  setWarden(on) { this.wardenOn = !!on; this.S = buildSchedule(this.wardenOn); }

  slot(p, id) { return p.slots[id]; }

  // presence and place of one dancer at a beat
  place(id, beatF) {
    const S = this.S, p = phraseAt(S, beatF), prev = S[p.i - 1] || S[0];
    const inNow = p.cast.includes(id), inPrev = prev.cast.includes(id) && p.i > 0;
    const lb = beatF - p.beat; let vis = 0, x = 0, z = 0, fx = 0;
    if (inNow && inPrev) { const k = sstep(0, 4, lb); const a = prev.slots[id], b = p.slots[id]; x = lerp(a[0], b[0], k); z = lerp(a[1], b[1], k); vis = 1; }
    else if (inNow) { const b = p.slots[id]; x = b[0]; z = b[1]; vis = sstep(0, 1.6, lb); fx = 1 - Math.abs(2 * sstep(0, 2.4, lb) - 1); if (lb > 2.4) fx = 0; }
    else if (inPrev) { const a = prev.slots[id]; x = a[0]; z = a[1]; vis = 1 - sstep(0.2, 1.6, lb); fx = lb < 2.2 ? 1 - Math.abs(2 * sstep(0, 2.2, lb) - 1) : 0; }
    return { vis, x, z, fx, p, prev, lb, inNow };
  }

  pickMove(id, beatF, p, sec) {
    const lib = this.lib[id]; const bar = Math.floor(beatF / 4);
    const pre = PRE_DROP.includes(bar);
    let tier = tierOf(sec); if (pre || p.bow) tier = 'l';
    const solo = p.solo === id || p.duo === id;
    const blk = Math.floor(beatF / 8); const key = solo ? blk : Math.floor(blk / 2);
    const start = (solo ? blk : Math.floor(blk / 2) * 2) * 8;
    if (id === 'warden') {
      const seq = { 72: 'Orc_Idle', 73: 'Great_Sword_Jump_Attack', 78: 'Hurricane_Kick', 79: 'Standing_Melee_Attack_Downward' };
      const name = seq[bar] || (bar >= 74 && bar < 78 ? 'Silly' : 'Orc_Idle');
      const m = lib.find(x => x.clip === name); const st = bar >= 74 && bar < 78 ? 74 * 4 : bar * 4;
      return { m: bar === 73 || bar === 79 ? { ...m, mode: 'O', beats: 4 } : m, start: st, slow: 1 };
    }
    if (p.fly && id === 'elyra') { const m = lib.find(x => x.clip === 'Floating'); return { m, start: p.beat, slow: 2 }; }
    if (p.unison && tier === 'h' && id !== 'thulkar') { const m = lib.find(x => x.clip === p.unison); if (m) return { m, start: p.beat, slow: 1 }; }
    const pool = lib.filter(m => m.tiers.includes(tier));
    let i = Math.floor(hash1(key * 5.71 + id.charCodeAt(0) * 1.37 + id.length) * pool.length);
    const prevI = Math.floor(hash1((key - 1) * 5.71 + id.charCodeAt(0) * 1.37 + id.length) * pool.length);
    if (i === prevI && pool.length > 1) i = (i + 1) % pool.length;
    return { m: pool[i], start, slow: tier === 'm' ? 2 : (tier === 'l' ? 1.5 : 1) };
  }

  update(t, dt) {
    const beatF = beatAt(t), bar = Math.floor(beatF / 4), fb = beatF - Math.floor(beatF);
    const sec = sectionAt(bar), p = phraseAt(this.S, beatF);
    const low = band('low', t), mid = band('mid', t), high = band('high', t);
    const pre = PRE_DROP.includes(bar), barF = beatF / 4 - bar;
    const dropBar = DROPS.find(d => bar >= d && bar < d + 4); const sinceDrop = dropBar != null ? beatF - dropBar * 4 : 99;
    // the kick: the real bass when the four-on-the-floor is in, a soft pulse otherwise
    const kick = sec.kick ? Math.exp(-fb * 5.5) : 0.35 * Math.exp(-(((beatF / 2) % 1 + 1) % 1) * 3.0) * (0.4 + low);
    let energy = sec.energy; if (sec.mode === 'rise') energy = lerp(0.3, 0.8, (beatF / 4 - 64) / 8); if (pre) energy *= 1 - 0.75 * barF;
    if (beatF < 0) energy = 0;
    const flash = (sinceDrop >= 0 && sinceDrop < 1.2) ? 0.6 * Math.exp(-sinceDrop * 3.2) * (this.calm ? 0.25 : 1) : 0;
    const wardenShow = !!p.wardenShow, wl = beatF - 288;
    const wardenGlow = this.wardenOn ? sstep(-10, 0, wl) * (1 - sstep(30, 33, wl)) : 0;
    const pal = paletteFor(sec, p, wardenShow && wl > 0);
    _col.setHex(pal[0]); _colB.setHex(pal[1]); const kc = Math.min(1, dt * 4 + (flash > 0.5 ? 1 : 0));
    this.colA.lerp(_col, kc); this.colB.lerp(_colB, kc);
    const A = this.colA, B = this.colB;
    this.state = { beatF, bar, sec, p, kick, energy, flash, low, mid, high, pre, barF };

    // ---------------- dancers ----------------
    let soloPos = null; const soloId = p.solo && p.cast.includes(p.solo) ? p.solo : null;
    for (const id in this.dancers) {
      const d = this.dancers[id], c = d.c; const pl = this.place(id, beatF);
      if (id === 'warden') { this.updateWarden(d, pl, beatF, kick, wl); if (soloId === 'warden' && d.c.root.visible) soloPos = d.c.root.position; continue; }
      d.vis = pl.vis; c.root.visible = pl.vis > 0.004;
      d.beam.material.uniforms.uI.value = pl.fx * 0.9; d.beam.visible = pl.fx > 0.01; d.beam.position.set(pl.x, 0, pl.z);
      d.beam.scale.x = d.beam.scale.z = c.info.h * (0.14 + 0.2 * pl.fx);
      d.pool.position.set(pl.x, 0.03, pl.z); d.pool.scale.setScalar(c.info.h * (0.55 + 0.12 * kick)); d.pool.material.opacity = pl.vis * (0.10 + 0.22 * kick * energy) + pl.fx * 0.5;
      if (!c.root.visible) continue;
      // moves, cross-faded over the first beat of a block
      const now = this.pickMove(id, beatF, pl.p, sec), was = this.pickMove(id, beatF - 1, phraseAt(this.S, beatF - 1), sectionAt(Math.floor((beatF - 1) / 4)));
      const same = now.m.clip === was.m.clip && now.start === was.start;
      const w = same ? 1 : sstep(0, 1, fb);
      const list = [{ clip: now.m.clip, time: moveTime(now.m, beatF - now.start, now.slow), weight: w }];
      if (!same) list.push({ clip: was.m.clip, time: moveTime(was.m, beatF - was.start, was.slow), weight: 1 - w });
      c.pose(list); c.tether(0.7);
      // place, face, bounce
      const solo = soloId === id || pl.p.duo === id;
      let y = -0.07 * (c.info.h / 1.8) * kick * (0.3 + energy) * (HEAVY[id] ? 1.5 : 1);
      let yaw = Math.atan2(-pl.x, 9 - pl.z) * 0.55 + 0.22 * Math.sin(beatF * Math.PI / 8 + id.length);
      let x = pl.x, z = pl.z;
      if (id === 'elyra') { const up = sstep(220, 228, beatF) * (1 - sstep(250, 256, beatF)); y += up * (1.7 + 0.25 * Math.sin(beatF * Math.PI / 4)); yaw += up * Math.sin(beatF * Math.PI / 16) * 1.2; }
      if (id === 'vexl' && tierOf(sec) === 'h') { const blk = Math.floor(beatF / 8); if (blk % 2 === 1) yaw += ((beatF / 8) % 1) * Math.PI * 2; x += 0.7 * Math.sin(beatF * Math.PI / 4); z += 0.35 * Math.sin(beatF * Math.PI / 2); }
      if (id === 'skitter' && tierOf(sec) === 'l') { x += 0.5 * Math.sin(beatF * Math.PI / 8); }
      // everyone leaves the ground when a drop lands
      if (sinceDrop >= 0 && sinceDrop < 1) y += Math.sin(sinceDrop * Math.PI) * 0.55 * (HEAVY[id] ? 0.5 : 1);
      if (pl.p.bow) { yaw = Math.atan2(-pl.x, 12 - pl.z); }
      c.root.position.set(x, y, z); c.root.rotation.y = yaw;
      const sc = pl.vis; c.root.scale.set(0.35 + 0.65 * sc, Math.pow(sc, 0.6) * (1 + 0.25 * pl.fx), 0.35 + 0.65 * sc);
      for (const m of c.mats) if (m.emissiveMap) m.emissiveIntensity = c.info.glow * (0.4 + 0.7 * kick * energy + 2.0 * pl.fx + (solo ? 0.2 : 0));
      d.pos.set(x, y, z); if (soloId === id) soloPos = d.pos;
    }
    if (soloId !== this.solo) { this.solo = soloId; if (this.onSolo) this.onSolo(soloId, p); }

    this.updateLights(t, beatF, bar, sec, p, { kick, energy, flash, low, mid, high, pre, barF, soloPos, A, B, wardenGlow, wardenShow, sinceDrop });
    this.updateCrowd(beatF, kick, energy, A, B, sinceDrop);
    this.updateCamera(t, beatF, bar, sec, p, soloPos, kick, energy, sinceDrop, pre, barF, wl);
  }

  updateWarden(d, pl, beatF, kick, wl) {
    const c = d.c; const on = this.wardenOn && wl > -0.5 && wl < 33;
    c.root.visible = on; d.beam.visible = false; d.pool.material.opacity = 0; if (!on) return;
    const now = this.pickMove('warden', beatF, pl.p, { mode: 'drop' }), was = this.pickMove('warden', beatF - 1, pl.p, { mode: 'drop' });
    const fb = beatF - Math.floor(beatF), same = now.m.clip === was.m.clip && now.start === was.start, w = same ? 1 : sstep(0, 1, fb);
    const tm = (mv) => mv.m.mode === 'O' ? Math.min(1, (beatF - mv.start) / mv.m.beats) * mv.m.dur * 0.98 : moveTime(mv.m, beatF - mv.start, mv.slow);
    const list = [{ clip: now.m.clip, time: tm(now), weight: w }]; if (!same) list.push({ clip: was.m.clip, time: tm(was), weight: 1 - w });
    c.pose(list); c.tether(1.6);
    const rise = sstep(0, 3.5, wl), sink = sstep(30, 32.6, wl);
    const y = -5.4 * (1 - rise) - 5.6 * sink + (rise < 1 ? 0.04 * Math.sin(wl * 40) : 0) - 0.08 * kick;
    c.root.position.set(0, y, -1.2); c.root.rotation.y = 0.15 * Math.sin(beatF * Math.PI / 8); c.root.scale.setScalar(1);
    d.pos.copy(c.root.position);
  }

  updateLights(t, beatF, bar, sec, p, s) {
    const { stage, booth, lights } = this; const { kick, energy, flash, low, mid, high, pre, barF, soloPos, A, B, wardenGlow } = s;
    const fm = stage.floorMat.uniforms; fm.uBeat.value = beatF; fm.uKick.value = kick; fm.uEnergy.value = energy; fm.uA.value.copy(A); fm.uB.value.copy(B); fm.uFlash.value = flash; fm.uWarden.value = wardenGlow;
    const wm = stage.wallMat.uniforms; wm.uBeat.value = beatF; wm.uKick.value = kick; wm.uHigh.value = high; wm.uMid.value = mid; wm.uA.value.copy(A); wm.uB.value.copy(B); wm.uFlash.value = flash * 0.9;
    const modeOf = (sc, ph) => (ph.wardenShow && beatF >= 288) ? 4 : sc.mode === 'drop' ? 2 : sc.mode === 'groove' ? (ph.i % 3 === 0 ? 0 : 1) : sc.mode === 'break' ? 3 : sc.mode === 'rise' ? 1 : sc.mode === 'build' ? 1 : 0;
    const mNow = modeOf(sec, p); if (this._wallMode === undefined) { this._wallMode = mNow; this._wallPrev = mNow; this._wallAt = -99; }
    if (mNow !== this._wallMode) { this._wallPrev = this._wallMode; this._wallMode = mNow; this._wallAt = beatF; }
    wm.uMode.value = this._wallPrev; wm.uModeB.value = this._wallMode; wm.uMix.value = sstep(0, 1.5, Math.abs(beatF - this._wallAt));
    wm.uDim.value = (0.25 + 0.75 * Math.min(1, energy * 1.4)) * (beatF < 0 ? 0.3 : 1) * (1 - 0.96 * sstep(398, 402, beatF)); wm.uClose.value = pre ? barF * 0.97 : 0;
    stage.moteMat.uniforms.uT.value = t; stage.moteMat.uniforms.uColor.value.copy(A).lerp(B, 0.5); stage.moteMat.uniforms.uI.value = 0.5 + energy + flash * 2;
    stage.strips.forEach((m, i) => m.material.color.copy(i % 2 ? A : B).multiplyScalar(0.25 + 1.6 * kick * energy + flash * 3));

    // moving heads
    const mode = sec.mode, n = stage.beams.length;
    const pat = mode === 'groove' ? ['circle', 'cross', 'solo', 'wave'][p.i % 4] : mode === 'drop' ? 'fan' : mode === 'break' ? 'pillars' : mode === 'rise' ? 'cross' : mode === 'build' ? 'wave' : mode === 'rumble' ? 'slow' : mode === 'outro' ? 'pillars' : 'booth';
    for (const b of stage.beams) {
      const i = b.i, ph = i / n * Math.PI * 2; let I = 0.5; const tg = b.target;
      if (pat === 'booth') { tg.set((i - 4) * 0.5, 2.6, BOOTH_Z + 0.5); I = (i % 4 === 0 ? 0.55 : 0) * sstep(-2, 8, beatF); }
      else if (pat === 'slow') { tg.set(Math.sin(ph + beatF * 0.1) * 5, 0, Math.cos(ph * 2 + beatF * 0.07) * 4); I = (i % 3 === Math.floor(beatF / 8) % 3) ? 0.6 : 0.08; }
      else if (pat === 'wave') { tg.set(Math.sin(ph) * 6, 0, 1 + 5 * Math.sin(beatF * Math.PI / 8 + ph)); I = 0.45 + 0.4 * high; }
      else if (pat === 'circle') { const a = ph + beatF * Math.PI / 8; tg.set(Math.sin(a) * 4.5, 0, Math.cos(a) * 4.5 + 0.5); I = 0.75; }
      else if (pat === 'cross') { const a = ph + Math.PI + 0.9 * Math.sin(beatF * Math.PI / 4 + i); tg.set(Math.sin(a) * 5.5, 0, Math.cos(a) * 5.5); I = 0.7; }
      else if (pat === 'solo') { if (soloPos && i % 3 !== 2) tg.set(soloPos.x + Math.sin(ph) * 0.6, 1.0, soloPos.z + Math.cos(ph) * 0.6); else tg.set(Math.sin(ph + beatF * 0.4) * 6, 0, Math.cos(ph + beatF * 0.4) * 6); I = 0.75; }
      else if (pat === 'fan') { const sw = Math.sin(beatF * Math.PI / 2 + i * 0.7); tg.set(b.base.x * 0.2 + sw * 7, s.sinceDrop < 4 ? 9 + 6 * Math.abs(sw) : 0, b.base.z * 0.2 + Math.cos(beatF * Math.PI / 2 + i) * 6 + (s.sinceDrop < 4 ? 8 : 0)); I = 0.6 + 0.6 * (Math.floor(beatF * 2 + i) % 2); }
      else if (pat === 'pillars') { tg.set(b.base.x * 0.82, 0, b.base.z * 0.82); I = i % 3 === 0 ? 0.55 : 0.0; if (soloPos && i === 4) { tg.set(soloPos.x, soloPos.y + 1, soloPos.z); I = 0.9; } }
      if (pre) { tg.lerp(_v.set(0, 3, BOOTH_Z + 0.4), sstep(0, 0.6, barF)); I *= 1 - 0.85 * barF; }
      if (s.wardenShow && beatF >= 288 && i % 2 === 0) { tg.set(Math.sin(ph) * 1.5, 3 + 1.5 * Math.sin(beatF + i), -1.2 + Math.cos(ph) * 1.5); I = 0.9; }
      I *= (0.55 + 0.75 * kick) * Math.min(1, 0.25 + energy) * (1 - sstep(396, 402, beatF)) + flash * 0.8;
      _v.copy(tg).sub(b.base).normalize(); b.dir.lerp(_v, 0.25).normalize();
      b.head.quaternion.setFromUnitVectors(DOWN, b.dir);
      const col = (s.wardenShow && beatF >= 288) ? _col.setHex(0xffc050) : (i % 2 ? A : B);
      b.cone.material.uniforms.uColor.value.copy(col); b.cone.material.uniforms.uI.value = I * 1.1; b.lens.material.color.copy(col).multiplyScalar(0.3 + I * 3);
      // pool where the beam meets the floor
      if (b.dir.y < -0.15) { const k = -b.base.y / b.dir.y; b.pool.position.set(b.base.x + b.dir.x * k, 0.025, b.base.z + b.dir.z * k); b.pool.material.color.copy(col); b.pool.material.opacity = Math.min(0.6, I * 0.4); b.pool.visible = true; } else b.pool.visible = false;
    }
    // lasers on the hats
    const lz = (mode === 'groove' || mode === 'drop' || mode === 'rise') ? Math.min(1, high * 1.5) * (0.4 + 0.6 * energy) : 0;
    for (const L of stage.lasers) {
      const a = (L.k - 2.5) * 0.11 * (1 + 0.6 * Math.sin(beatF * Math.PI / 4)) + 0.25 * Math.sin(beatF * Math.PI / 8 + L.sx);
      _v.set(-L.sx * (0.5 + a), -0.16 + 0.1 * Math.sin(beatF * Math.PI / 2 + L.k), 0.85).normalize();
      L.m.quaternion.setFromUnitVectors(UP, _v); L.m.material.opacity = lz * (Math.floor(beatF * 4 + L.k) % 3 === 0 ? 0.1 : 0.5) * (L.k % 2 ? 1 : 0.6);
      L.m.material.color.copy(L.k % 2 ? A : B).lerp(_col.setHex(0xffffff), 0.25);
    }
    // speakers
    for (const sp of stage.speakers) { sp.cone.position.z = sp.r * 0.16 * kick * low * sp.amt; sp.cone.scale.setScalar(1 + 0.03 * low * sp.amt); sp.ringM.color.copy(sp.j % 2 ? A : B).multiplyScalar(0.25 + 2.4 * kick * energy); }
    for (const al of stage.arrayLeds) al.m.color.copy(al.k % 2 ? A : B).multiplyScalar(0.15 + (Math.floor(beatF * 2) % 7 === al.k ? 2.6 * energy : 0) + 0.5 * kick * energy);
    // the SalienT logo on the wall: over the intro, through the breakdown, and to close
    const logo = Math.max(sstep(-5, -1, beatF) * (1 - sstep(9, 13, beatF)), sstep(226, 232, beatF) * (1 - sstep(250, 255, beatF)), sstep(389, 393, beatF) * (1 - sstep(401, 403.5, beatF)));
    stage.logoMat.opacity = logo * (0.92 + 0.08 * kick); stage.logo.visible = logo > 0.005; stage.logo.scale.setScalar(1 + 0.012 * kick + 0.04 * (1 - logo)); wm.uDim.value *= 1 - 0.8 * logo;
    // jets
    stage.jets.forEach((j, i) => { const k = s.sinceDrop >= 0 && s.sinceDrop < 5 ? Math.exp(-s.sinceDrop * 0.7) * Math.min(1, s.sinceDrop * 6) : 0; j.scale.set(1 + (1 - k) * 0.6, 0.01 + 7.5 * k, 1 + (1 - k) * 0.6); j.material.uniforms.uI.value = k * 0.8; j.visible = k > 0.01; });
    // booth
    booth.color = _colB.copy(A).lerp(_col.setHex(0x3fd8ff), 0.45).clone();
    booth.update(t, beatF, kick, energy, low, mid, high, A, B);
    // real lights on the characters
    const L = lights; const base0 = (0.2 + 0.8 * Math.min(1, energy * 1.3)) * (pre ? 1 - 0.8 * barF : 1) * (1 - sstep(396, 402, beatF)) * sstep(-4, 8, beatF);
    L.hemi.intensity = 0.05 + 0.12 * energy + flash * 0.8; L.hemi.color.copy(A).lerp(_col.setHex(0xffffff), 0.5); L.hemi.groundColor.copy(B).multiplyScalar(0.4);
    L.spotA.color.copy(A).lerp(_col.setHex(0xffffff), 0.45); L.spotB.color.copy(B).lerp(_col, 0.45); L.fill.intensity = base0 * 0.55;
    const base = (0.25 + 0.75 * Math.min(1, energy * 1.3)) * (pre ? 1 - 0.8 * barF : 1) * (1 - sstep(396, 402, beatF));
    L.spotA.intensity = base * (170 + 260 * kick); L.spotB.intensity = base * (170 + 260 * (1 - kick) * energy);
    L.back.color.copy(B).lerp(A, 0.5); L.back.intensity = base * (160 + 260 * kick) + flash * 900;
    L.console.color.copy(booth.color); L.console.intensity = (5 + 5 * kick) * sstep(-4, 6, beatF) * (1 - sstep(398, 402, beatF));
    L.key.intensity = soloPos ? base * 520 : 0; if (soloPos) { L.key.target.position.set(soloPos.x, soloPos.y + 1.2, soloPos.z); L.key.color.setHex(0xfff2e0); }
    L.strobe.intensity = flash * 4 + ((!this.calm && mode === 'drop' && s.sinceDrop < 16 && s.sinceDrop > 1.2) ? (Math.floor(beatF * 4) % 4 === 0 ? 1.6 * Math.exp(-((beatF * 4) % 1) * 4) : 0) : 0);
    L.warden.intensity = wardenGlow * (60 + 45 * kick);
    this.fx = { bloom: 0.42 + 0.25 * kick * energy + flash * 0.7, exposure: (0.92 + 0.12 * kick * energy + flash * 0.5) * (beatF < 0 ? 0.6 + 0.4 * sstep(-6, 0, beatF) : 1) * (1 - 0.97 * sstep(399, 403, beatF)), aberr: 0.0012 + 0.004 * kick * energy + flash * 0.012 };
  }

  updateCrowd(beatF, kick, energy, A, B, sinceDrop) {
    const st = this.stage; const fb = beatF - Math.floor(beatF); const K = st.crowdKinds;
    for (let i = 0; i < st.crowdN; i++) {
      const c = st.crowd[i], k = K[c.kind];
      const hop = Math.max(0, Math.sin((fb + c.ph * 0.18) * Math.PI)) * 0.16 * c.amp * energy + (sinceDrop >= 0 && sinceDrop < 1 ? Math.sin(sinceDrop * Math.PI) * 0.35 : 0);
      const sway = Math.sin(beatF * Math.PI / 2 + c.ph * 6.28) * 0.07 * (0.4 + energy);
      const H = c.h, W = c.w, cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
      const y = (k.hover ? k.hover * (1 + 0.25 * Math.sin(beatF * Math.PI / 4 + c.ph * 6)) : 0) + hop * (k.hover ? 0.4 : 1);
      _e.set(0, c.yaw, sway, 'YXZ'); _q.setFromEuler(_e); _s.set(W, H, W);
      _m.compose(_v.set(c.x, y, c.z), _q, _s); k.mesh.setMatrixAt(c.n, _m);
      const at = (lx, ly, lz, out) => out.set(c.x + (lx * cy + lz * sy) * W + sway * ly * H * -cy, y + ly * H, c.z + (-lx * sy + lz * cy) * W);
      // eyes: a dim glint in the dark, blinking now and then
      const blink = ((beatF * 0.11 + c.blink * 7) % 1) < 0.03 ? 0 : 1;
      for (let e = 0; e < 3; e++) {
        const eo = k.eyes[e];
        if (eo) { at(eo[0], eo[1], eo[2], _v); _s.set(k.eyeS[0] * W, k.eyeS[1] * W * blink, 0.6); _m.compose(_v, _q, _s); _col.setHex(c.eye).multiplyScalar(0.55 + 0.9 * kick * energy); st.crowdEye.instanceColor.setXYZ(i * 3 + e, _col.r, _col.g, _col.b); }
        else _m.makeScale(0, 0, 0);
        st.crowdEye.setMatrixAt(i * 3 + e, _m);
      }
      for (let a = 0; a < 2; a++) {
        const sd = a ? 1 : -1;
        if (!k.sh) { _m.makeScale(0, 0, 0); st.crowdArm.setMatrixAt(i * 2 + a, _m); st.crowdStick.setMatrixAt(i * 2 + a, _m); continue; }
        const up = c.arms > 0.3 || energy > 0.9 ? 1 : 0.12, lift = up * (0.45 + 0.55 * energy);
        const wave = Math.sin(beatF * Math.PI + c.ph * 9 + a * 1.7) * 0.4 * energy;
        // local direction: out to the side, up, and toward the stage
        const lx = sd * (0.3 + 0.25 * (1 - lift)) + wave * 0.5, ly = lerp(-0.85, 0.9, lift), lz = 0.25 + 0.2 * lift;
        _v2.set(lx * cy + lz * sy, ly, -lx * sy + lz * cy).normalize();
        const len = k.arm * H * 0.8; at(sd * k.sh[0], k.sh[1], 0, _v);
        _q2.setFromUnitVectors(UP, _v2); _s.set(k.thick || 1, len, k.thick || 1);
        _m.compose(_v3.copy(_v).addScaledVector(_v2, len * 0.5), _q2, _s); st.crowdArm.setMatrixAt(i * 2 + a, _m);
        const has = (c.hue > 0.4 || a === 0) && lift > 0.3; _s.setScalar(has ? 1 : 0.001);
        _m.compose(_v3.copy(_v).addScaledVector(_v2, len + 0.2), _q2, _s); st.crowdStick.setMatrixAt(i * 2 + a, _m);
        _col.copy((i + a) % 2 ? A : B).multiplyScalar(0.8 + 1.4 * kick * energy + (energy < 0.3 ? 0 : 0.4));
        st.crowdStick.instanceColor.setXYZ(i * 2 + a, _col.r, _col.g, _col.b);
      }
    }
    for (const m of st.crowdMeshes) m.instanceMatrix.needsUpdate = true;
    st.crowdArm.instanceMatrix.needsUpdate = st.crowdStick.instanceMatrix.needsUpdate = st.crowdEye.instanceMatrix.needsUpdate = true; st.crowdStick.instanceColor.needsUpdate = st.crowdEye.instanceColor.needsUpdate = true;
  }

  updateCamera(t, beatF, bar, sec, p, soloPos, kick, energy, sinceDrop, pre, barF, wl) {
    const cam = this.camera; const mode = sec.mode;
    // one shot per two bars in the groove, longer when the music breathes
    const len = (mode === 'groove' || mode === 'drop') ? 8 : 16;
    const idx = Math.floor(beatF / len), u = (beatF / len) % 1;
    const cyc = {
      intro: ['djrise'], rumble: ['djclose', 'low', 'wide', 'djover'], build: ['orbit', 'side', 'djover', 'wide'],
      drop: ['wide', 'low', 'djclose', 'crane'], groove: ['orbit', 'wide', 'djover', 'low', 'orbit', 'side', 'djclose', 'crane'],
      break: ['fly', 'djclose', 'crane', 'fly'], rise: ['low', 'djover', 'orbit', 'wide'], outro: ['wide'],
    }[mode] || ['wide'];
    let shot = cyc[((idx % cyc.length) + cyc.length) % cyc.length];
    if (this.forceShot) shot = this.forceShot;
    if (pre) shot = 'djclose';
    if (sinceDrop >= 0 && sinceDrop < 8) shot = 'wide';
    if (this.wardenOn && wl >= -1 && wl < 33) shot = wl < 8 ? 'warden' : (idx % 3 === 0 ? 'wide' : idx % 3 === 1 ? 'warden' : 'low');
    if (beatF < 14) shot = 'djrise';
    if (!soloPos && (shot === 'orbit' || shot === 'fly')) shot = 'wide';
    const P = this.camPos, Lk = this.camLook; let fov = 42; const sg = idx % 2 ? 1 : -1;
    const djY = this.dj.c.root.position.y + this.dj.shoulderY;
    if (shot === 'wide') { P.set(sg * lerp(-2.5, 2.5, u), 4.1 + 0.5 * u, 16.5 - 1.2 * u); Lk.set(0, 2.6, -3); fov = 44; }
    else if (shot === 'crane') { P.set(sg * lerp(6, 2, u), 9.5 - 2 * u, 12 - 2 * u); Lk.set(0, 1, -1.5); fov = 46; }
    else if (shot === 'low') { P.set(sg * lerp(-4, 4, u), 0.7, 7.7); Lk.set(0, 2.4, -2); fov = 54; }
    else if (shot === 'side') { P.set(sg * 8.4, 2.4 + u, 3 - 2.5 * u); Lk.set(-sg * 2, 2.2, -3.5); fov = 50; }
    else if (shot === 'djclose') { P.set(sg * lerp(2.8, 1.3, u), djY + 0.7, BOOTH_Z + 5.6 - 0.6 * u); Lk.set(0, djY + 0.1, BOOTH_Z + 0.6); fov = 38; }
    else if (shot === 'djover') { P.set(sg * lerp(1.9, 0.9, u), djY + 1.55, BOOTH_Z - 1.9); Lk.set(0, djY - 1.0, BOOTH_Z + 3.4); fov = 58; }
    else if (shot === 'djrise') { const k = sstep(3, 13, beatF); P.set(lerp(0.0, 1.6, k), lerp(2.6, 3.4, k), lerp(BOOTH_Z + 16.5, BOOTH_Z + 5.4, k)); Lk.set(0, lerp(4.6, djY + 0.1, k), BOOTH_Z + 0.6); fov = lerp(46, 40, k); }
    else if (shot === 'orbit') { const a = sg * (0.9 - 1.8 * u) ; const h = this.chars[this.solo] ? this.chars[this.solo].info.h : 1.8; const r = 2.6 + h * 1.5; P.set(soloPos.x + Math.sin(a) * r, 0.5 + h * 0.45, soloPos.z + Math.cos(a) * r); Lk.set(soloPos.x, soloPos.y + h * 0.55, soloPos.z); fov = 40; }
    else if (shot === 'fly') { const a = beatF * 0.05 * sg; P.set(soloPos.x + Math.sin(a) * 6.5, 1.2 + 1.2 * u, soloPos.z + Math.cos(a) * 6.5); Lk.set(soloPos.x, soloPos.y + 1.1, soloPos.z); fov = 40; }
    else if (shot === 'warden') { const k = sstep(0, 8, wl); P.set(lerp(-1.5, 2.5, u), lerp(0.6, 1.3, k), lerp(7.2, 8.7, k)); Lk.set(0, lerp(1.0, 3.2, k), -1.2); fov = 52; }
    this.shotName = shot;
    const asp = cam.aspect; if (asp < 1.5) fov *= lerp(1.9, 1, sstep(0.45, 1.5, asp));
    const shake = this.calm ? 0 : (sinceDrop >= 0 && sinceDrop < 2 ? Math.exp(-sinceDrop * 2) * 0.12 : 0) + (this.wardenOn && wl > 0 && wl < 4 ? 0.06 : 0);
    cam.position.set(P.x + shake * Math.sin(t * 61), P.y + shake * Math.sin(t * 53 + 1), P.z + shake * Math.sin(t * 47 + 2));
    cam.fov = fov * (1 - 0.018 * kick * energy); cam.lookAt(Lk); cam.updateProjectionMatrix();
  }
}
