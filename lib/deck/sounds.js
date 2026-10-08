// Signal Composer v2 (Update 5.65): the instruments. Everything here is
// synthesized live with the Web Audio API - no samples, no files - so the
// whole controller stays "a signal, translated" and adds no service.
//
// Each voice is a function (ctx, dest, t, ...) that builds its nodes, plays
// once at time t, and lets them go. They work on an AudioContext and on an
// OfflineAudioContext (the WAV export).

export const DRUM_SOUNDS = {
  kick: ["Deep", "Punch", "Gravity", "Thump"],
  snare: ["Snare", "Clap", "Zap", "Rim"],
  hat: ["Crisp", "Metal", "Dust", "Shaker"],
  perc: ["Tom", "Drop", "Cowbell", "Click"],
};
export const SYNTH_SOUNDS = {
  bass: ["Sub", "Saw", "Acid", "Wobble", "Reese"],
  lead: ["Pluck", "Saw", "Bell", "Chip", "Flute"],
  pad: ["Super", "Glass", "Choir", "Dark", "Halo"],
};
export const SAMPLES = ["Horn", "Laser", "Riser", "Impact", "13i", "Chatter", "Siren", "Ping"];

export const midiHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

const noiseCache = new WeakMap();
export function noise(ctx) {
  let b = noiseCache.get(ctx);
  if (b) return b;
  b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 2), ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  noiseCache.set(ctx, b);
  return b;
}
const curveCache = new WeakMap();
function drive(ctx, amount = 3) {
  const key = `${amount}`;
  let m = curveCache.get(ctx);
  if (!m) { m = {}; curveCache.set(ctx, m); }
  if (!m[key]) {
    const n = 1024, c = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = Math.tanh(x * amount); }
    m[key] = c;
  }
  const ws = ctx.createWaveShaper(); ws.curve = m[key]; ws.oversample = "2x";
  return ws;
}

function gainEnv(ctx, dest, t, a, peak, d, hold = 0) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
  if (hold > 0) g.gain.setValueAtTime(Math.max(0.0002, peak), t + a + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + d);
  g.connect(dest);
  return g;
}
function osc(ctx, type, f, t, end, dest, detune = 0) {
  const o = ctx.createOscillator();
  o.type = type; o.frequency.setValueAtTime(f, t); o.detune.value = detune;
  o.connect(dest); o.start(t); o.stop(end);
  return o;
}
function burst(ctx, dest, t, dur, offset = Math.random()) {
  const s = ctx.createBufferSource(); s.buffer = noise(ctx);
  s.connect(dest); s.start(t, offset); s.stop(t + dur);
  return s;
}
function filt(ctx, type, f, q = 1) { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }

// ─────────── drums ───────────
export function playKick(ctx, dest, t, sound = "Deep", vel = 1) {
  const P = { Deep: [150, 42, 0.5, 0.09], Punch: [200, 52, 0.28, 0.06], Gravity: [120, 30, 0.95, 0.22], Thump: [110, 55, 0.18, 0.04] }[sound] || [150, 42, 0.5, 0.09];
  let out = dest;
  if (sound === "Gravity") { const ws = drive(ctx, 4); const g = ctx.createGain(); g.gain.value = 0.7; ws.connect(g); g.connect(dest); out = ws; }
  const g = gainEnv(ctx, out, t, 0.002, vel, P[2]);
  const o = osc(ctx, "sine", P[0], t, t + P[2] + 0.05, g);
  o.frequency.exponentialRampToValueAtTime(P[1], t + P[3]);
  if (sound === "Punch" || sound === "Thump") {
    const cg = gainEnv(ctx, dest, t, 0.001, vel * 0.5, 0.012);
    const hp = filt(ctx, "highpass", 2500); hp.connect(cg); burst(ctx, hp, t, 0.02);
  }
}
export function playSnare(ctx, dest, t, sound = "Snare", vel = 1) {
  if (sound === "Clap") {
    const bp = filt(ctx, "bandpass", 1300, 1.2); bp.connect(dest);
    [0, 0.011, 0.022].forEach((d, i) => { const g = gainEnv(ctx, bp, t + d, 0.001, vel * 0.9, i === 2 ? 0.22 : 0.01); burst(ctx, g, t + d, i === 2 ? 0.3 : 0.02); });
    return;
  }
  if (sound === "Zap") {
    const g = gainEnv(ctx, dest, t, 0.002, vel * 0.35, 0.16);
    const o = osc(ctx, "square", 2200, t, t + 0.2, g); o.frequency.exponentialRampToValueAtTime(140, t + 0.15);
    return;
  }
  if (sound === "Rim") {
    const g = gainEnv(ctx, dest, t, 0.001, vel * 0.45, 0.05);
    osc(ctx, "triangle", 1700, t, t + 0.07, g); osc(ctx, "square", 820, t, t + 0.05, g);
    return;
  }
  const bp = filt(ctx, "bandpass", 1900, 0.8);
  const g = gainEnv(ctx, bp, t, 0.002, vel * 0.7, 0.18); bp.connect(dest);
  burst(ctx, g, t, 0.25);
  const tg = gainEnv(ctx, dest, t, 0.002, vel * 0.4, 0.09);
  const o = osc(ctx, "triangle", 230, t, t + 0.12, tg); o.frequency.exponentialRampToValueAtTime(170, t + 0.08);
}
export function playHat(ctx, dest, t, sound = "Crisp", open = false, vel = 1) {
  const dec = open ? 0.32 : 0.05;
  if (sound === "Metal") {
    const hp = filt(ctx, "highpass", 7000); const bp = filt(ctx, "bandpass", 10000, 0.7); bp.connect(hp);
    const g = gainEnv(ctx, dest, t, 0.001, vel * (open ? 0.22 : 0.3), dec); hp.connect(g);
    [2, 3, 4.16, 5.43, 6.79, 8.21].forEach((r) => osc(ctx, "square", 40 * r, t, t + dec + 0.05, bp));
    return;
  }
  if (sound === "Shaker") {
    const hp = filt(ctx, "highpass", 5000); hp.connect(dest);
    const g = gainEnv(ctx, hp, t, 0.02, vel * 0.25, open ? 0.2 : 0.06); burst(ctx, g, t, 0.3);
    return;
  }
  const f = sound === "Dust" ? filt(ctx, "bandpass", 8500, 0.6) : filt(ctx, "highpass", 7500);
  f.connect(dest);
  const g = gainEnv(ctx, f, t, 0.001, vel * (sound === "Dust" ? 0.3 : 0.32), dec);
  burst(ctx, g, t, dec + 0.05);
}
export function playPerc(ctx, dest, t, sound = "Tom", vel = 1, pitch = 1) {
  if (sound === "Drop") {
    const g = gainEnv(ctx, dest, t, 0.003, vel * 0.4, 0.12);
    const o = osc(ctx, "sine", 500 * pitch, t, t + 0.16, g); o.frequency.exponentialRampToValueAtTime(1700 * pitch, t + 0.08);
    return;
  }
  if (sound === "Cowbell") {
    const bp = filt(ctx, "bandpass", 800 * pitch, 2); bp.connect(dest);
    const g = gainEnv(ctx, bp, t, 0.001, vel * 0.5, 0.25);
    osc(ctx, "square", 540 * pitch, t, t + 0.3, g); osc(ctx, "square", 800 * pitch, t, t + 0.3, g);
    return;
  }
  if (sound === "Click") {
    const g = gainEnv(ctx, dest, t, 0.0005, vel * 0.5, 0.01);
    const hp = filt(ctx, "highpass", 3000); hp.connect(g); burst(ctx, hp, t, 0.02);
    return;
  }
  const g = gainEnv(ctx, dest, t, 0.002, vel * 0.7, 0.3);
  const o = osc(ctx, "sine", 220 * pitch, t, t + 0.35, g); o.frequency.exponentialRampToValueAtTime(110 * pitch, t + 0.25);
}

// ─────────── synths ───────────
// opts: { cutoff 0..1, bpm, vel, glide }
export function playBass(ctx, dest, t, sound, f, dur, opts = {}) {
  const cut = opts.cutoff ?? 0.5, vel = opts.vel ?? 1;
  const end = t + dur + 0.25;
  if (sound === "Sub") {
    const g = gainEnv(ctx, dest, t, 0.006, vel * 0.75, 0.12, Math.max(0, dur - 0.05));
    osc(ctx, "sine", f, t, end, g); osc(ctx, "triangle", f * 2, t, end, gainEnv(ctx, g, t, 0.005, 0.15, dur));
    return;
  }
  if (sound === "Acid") {
    const lp = filt(ctx, "lowpass", 300, 14); const ws = drive(ctx, 2.5);
    lp.connect(ws); const g = gainEnv(ctx, dest, t, 0.004, vel * 0.42, 0.08, Math.max(0, dur - 0.04)); ws.connect(g);
    const top = 600 + cut * 5200;
    lp.frequency.setValueAtTime(top, t); lp.frequency.exponentialRampToValueAtTime(180 + cut * 300, t + 0.18);
    osc(ctx, "sawtooth", f, t, end, lp);
    return;
  }
  if (sound === "Wobble") {
    const lp = filt(ctx, "lowpass", 400, 8); const g = gainEnv(ctx, dest, t, 0.01, vel * 0.5, 0.1, Math.max(0, dur - 0.05)); lp.connect(g);
    const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = ((opts.bpm || 140) / 60) * 2;
    const lg = ctx.createGain(); lg.gain.value = 300 + cut * 1800; lfo.connect(lg); lg.connect(lp.frequency);
    lp.frequency.value = 250 + cut * 900;
    lfo.start(t); lfo.stop(end);
    osc(ctx, "sawtooth", f, t, end, lp, -8); osc(ctx, "square", f, t, end, lp, 8); osc(ctx, "sine", f / 2, t, end, g);
    return;
  }
  if (sound === "Reese") {
    const lp = filt(ctx, "lowpass", 300 + cut * 1500, 1.5); const g = gainEnv(ctx, dest, t, 0.02, vel * 0.45, 0.15, Math.max(0, dur - 0.05)); lp.connect(g);
    osc(ctx, "sawtooth", f, t, end, lp, -14); osc(ctx, "sawtooth", f, t, end, lp, 14); osc(ctx, "sine", f, t, end, g);
    return;
  }
  // Saw
  const lp = filt(ctx, "lowpass", 900, 2); const g = gainEnv(ctx, dest, t, 0.005, vel * 0.5, 0.1, Math.max(0, dur - 0.05)); lp.connect(g);
  lp.frequency.setValueAtTime(400 + cut * 3600, t); lp.frequency.exponentialRampToValueAtTime(140 + cut * 300, t + Math.max(0.12, dur));
  osc(ctx, "sawtooth", f, t, end, lp); osc(ctx, "sine", f, t, end, g);
}

export function playLead(ctx, dest, t, sound, f, dur, opts = {}) {
  const cut = opts.cutoff ?? 0.6, vel = opts.vel ?? 1;
  const end = t + dur + 0.6;
  if (sound === "Bell") {
    const g = gainEnv(ctx, dest, t, 0.002, vel * 0.32, 0.9 + dur);
    const car = osc(ctx, "sine", f, t, end + 0.6, g);
    const mod = ctx.createOscillator(); mod.frequency.value = f * 3.5;
    const mg = ctx.createGain(); mg.gain.setValueAtTime(f * (2 + cut * 6), t); mg.gain.exponentialRampToValueAtTime(f * 0.1, t + 0.8);
    mod.connect(mg); mg.connect(car.frequency); mod.start(t); mod.stop(end + 0.6);
    return;
  }
  if (sound === "Chip") {
    const g = gainEnv(ctx, dest, t, 0.002, vel * 0.18, 0.04, Math.max(0, dur * 0.8));
    const o = osc(ctx, "square", f, t, end, g);
    const v = ctx.createOscillator(); v.frequency.value = 6; const vg = ctx.createGain(); vg.gain.value = f * 0.01; v.connect(vg); vg.connect(o.frequency); v.start(t); v.stop(end);
    return;
  }
  if (sound === "Flute") {
    const lp = filt(ctx, "lowpass", 1200 + cut * 3000, 1); const g = gainEnv(ctx, dest, t, 0.05, vel * 0.3, 0.25, Math.max(0, dur - 0.05)); lp.connect(g);
    osc(ctx, "triangle", f, t, end, lp); osc(ctx, "sine", f * 2, t, end, gainEnv(ctx, lp, t, 0.05, 0.2, dur + 0.2));
    const nb = filt(ctx, "bandpass", f * 2, 3); nb.connect(gainEnv(ctx, g, t, 0.03, 0.15, 0.2)); burst(ctx, nb, t, 0.3);
    return;
  }
  if (sound === "Saw") {
    const lp = filt(ctx, "lowpass", 1000, 3); const g = gainEnv(ctx, dest, t, 0.004, vel * 0.22, 0.25, Math.max(0, dur - 0.05)); lp.connect(g);
    lp.frequency.setValueAtTime(800 + cut * 6000, t); lp.frequency.exponentialRampToValueAtTime(600 + cut * 1500, t + 0.3);
    osc(ctx, "sawtooth", f, t, end, lp, -9); osc(ctx, "sawtooth", f, t, end, lp, 9);
    return;
  }
  // Pluck
  const lp = filt(ctx, "lowpass", 1500 + cut * 5000, 1); const g = gainEnv(ctx, dest, t, 0.003, vel * 0.3, 0.22 + dur * 0.4); lp.connect(g);
  osc(ctx, "triangle", f, t, end, lp); osc(ctx, "square", f * 2, t, end, gainEnv(ctx, lp, t, 0.002, 0.25, 0.12), 4);
}

export function playPad(ctx, dest, t, sound, freqs, dur, opts = {}) {
  const vel = opts.vel ?? 1;
  const att = Math.min(0.6, dur * 0.3), rel = Math.min(1.4, dur * 0.5);
  const g = ctx.createGain(); g.connect(dest);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.16 * vel, t + att);
  g.gain.setValueAtTime(0.16 * vel, t + dur - 0.02); g.gain.linearRampToValueAtTime(0.0001, t + dur + rel);
  const end = t + dur + rel + 0.1;
  if (sound === "Choir") {
    const sum = ctx.createGain(); sum.gain.value = 0.6;
    [700, 1150, 2600].forEach((fm, i) => { const bp = filt(ctx, "bandpass", fm, 6); sum.connect(bp); const bg = ctx.createGain(); bg.gain.value = [1, 0.6, 0.3][i]; bp.connect(bg); bg.connect(g); });
    freqs.forEach((f) => { osc(ctx, "sawtooth", f, t, end, sum, -6); osc(ctx, "sawtooth", f, t, end, sum, 6); });
    return;
  }
  if (sound === "Glass") {
    freqs.forEach((f, i) => { osc(ctx, "sine", f * 2, t, end, g, i * 3); osc(ctx, "triangle", f, t, end, g, -4); });
    return;
  }
  if (sound === "Dark") {
    const lp = filt(ctx, "lowpass", 520, 2); lp.connect(g);
    freqs.forEach((f) => { osc(ctx, "sawtooth", f / 2, t, end, lp, -10); osc(ctx, "sawtooth", f / 2, t, end, lp, 10); });
    return;
  }
  if (sound === "Halo") {
    const hp = filt(ctx, "highpass", 600); hp.connect(g);
    freqs.forEach((f) => { osc(ctx, "sine", f * 4, t, end, hp); osc(ctx, "triangle", f * 2, t, end, hp, 7); });
    const sh = ctx.createOscillator(); sh.frequency.value = 0.5; const sg = ctx.createGain(); sg.gain.value = 0.05; sh.connect(sg); sg.connect(g.gain); sh.start(t); sh.stop(end);
    return;
  }
  // Super: a stack of detuned saws, filtered
  const lp = filt(ctx, "lowpass", 2200, 0.7); lp.connect(g);
  const sc = ctx.createGain(); sc.gain.value = 0.45; sc.connect(lp);
  freqs.forEach((f) => [-22, -9, 0, 9, 22].forEach((d) => osc(ctx, "sawtooth", f, t, end, sc, d)));
}

// a faint transmission: four quick bleeps
export function playSignal(ctx, dest, t, freqs, stepDur) {
  for (let i = 0; i < 4; i++) {
    const tt = t + i * stepDur * 0.25;
    const g = gainEnv(ctx, dest, tt, 0.002, 0.18, 0.03);
    osc(ctx, "square", freqs[i % freqs.length] * 8, tt, tt + 0.06, g);
  }
}

// ─────────── the sampler (one-shots) ───────────
export function playSample(ctx, dest, t, name, bpm = 124, rootHz = 110) {
  const beat = 60 / bpm;
  if (name === "Horn") {
    // the alien air horn: ba - ba-ba - baaaa
    [[0, 0.16], [0.24, 0.1], [0.38, 0.1], [0.52, 0.7]].forEach(([d, len]) => {
      const tt = t + d;
      const g = gainEnv(ctx, dest, tt, 0.01, 0.22, 0.12, len);
      const lp = filt(ctx, "lowpass", 2600, 1); lp.connect(g);
      [1, 1.5, 2.01, 1.26].forEach((r) => { const o = osc(ctx, "sawtooth", 233 * r, tt, tt + len + 0.2, lp, (Math.random() - 0.5) * 20); o.frequency.setValueAtTime(233 * r, tt + len * 0.8); o.frequency.exponentialRampToValueAtTime(200 * r, tt + len + 0.15); });
    });
    return;
  }
  if (name === "Laser") {
    for (let i = 0; i < 3; i++) {
      const tt = t + i * beat * 0.25;
      const g = gainEnv(ctx, dest, tt, 0.002, 0.2 * (1 - i * 0.25), 0.3);
      const o = osc(ctx, "square", 3200, tt, tt + 0.35, g); o.frequency.exponentialRampToValueAtTime(180, tt + 0.3);
    }
    return;
  }
  if (name === "Riser") {
    const len = beat * 8;
    const bp = filt(ctx, "bandpass", 300, 3); bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(9000, t + len);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + len); g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.1);
    bp.connect(g); g.connect(dest);
    const s = ctx.createBufferSource(); s.buffer = noise(ctx); s.loop = true; s.connect(bp); s.start(t); s.stop(t + len + 0.15);
    const og = ctx.createGain(); og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(0.08, t + len); og.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.1); og.connect(dest);
    const o = osc(ctx, "sawtooth", rootHz, t, t + len + 0.15, og); o.frequency.exponentialRampToValueAtTime(rootHz * 8, t + len);
    return;
  }
  if (name === "Impact") {
    const g = gainEnv(ctx, dest, t, 0.003, 1, 1.4);
    const o = osc(ctx, "sine", 80, t, t + 1.6, g); o.frequency.exponentialRampToValueAtTime(28, t + 1.2);
    const lp = filt(ctx, "lowpass", 900); lp.connect(gainEnv(ctx, dest, t, 0.002, 0.6, 0.9)); burst(ctx, lp, t, 1);
    return;
  }
  if (name === "13i" || name === "Chatter") {
    // a voice: formant-shaped syllables. "13i" says three of them, rising.
    const syl = name === "13i" ? [[0, 0.22, 160, 700, 1200], [0.26, 0.2, 180, 500, 1700], [0.5, 0.42, 210, 300, 2300]]
      : Array.from({ length: 9 }, (_, i) => [i * 0.11 + Math.random() * 0.03, 0.08 + Math.random() * 0.08, 150 + Math.random() * 160, 300 + Math.random() * 900, 1200 + Math.random() * 1600]);
    syl.forEach(([d, len, f0, f1, f2]) => {
      const tt = t + d;
      const g = gainEnv(ctx, dest, tt, 0.015, 0.5, 0.06, len);
      const b1 = filt(ctx, "bandpass", f1, 7), b2 = filt(ctx, "bandpass", f2, 9);
      b1.connect(g); b2.connect(g);
      const o = osc(ctx, "sawtooth", f0, tt, tt + len + 0.1, b1); o.connect(b2);
      o.frequency.linearRampToValueAtTime(f0 * (name === "13i" ? 1.1 : 0.8 + Math.random() * 0.5), tt + len);
    });
    return;
  }
  if (name === "Siren") {
    const g = gainEnv(ctx, dest, t, 0.05, 0.16, 0.3, beat * 3);
    const o = osc(ctx, "sine", 800, t, t + beat * 3 + 0.4, g);
    const l = ctx.createOscillator(); l.frequency.value = bpm / 60; const lg = ctx.createGain(); lg.gain.value = 320; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + beat * 3 + 0.4);
    osc(ctx, "triangle", 1600, t, t + beat * 3 + 0.4, gainEnv(ctx, g, t, 0.05, 0.3, beat * 3));
    return;
  }
  // Ping: sonar
  for (let i = 0; i < 4; i++) {
    const tt = t + i * beat * 0.75;
    const g = gainEnv(ctx, dest, tt, 0.002, 0.25 * Math.pow(0.5, i), 0.9);
    osc(ctx, "sine", 1480, tt, tt + 1, g);
  }
}

// the crowd: a chant of four "hey"s on the beat
export function playChant(ctx, dest, t, bpm = 124) {
  const beat = 60 / bpm;
  for (let i = 0; i < 4; i++) {
    const tt = t + i * beat;
    const sum = ctx.createGain(); sum.gain.value = 0.4;
    const b1 = filt(ctx, "bandpass", 600, 4), b2 = filt(ctx, "bandpass", 1800, 5);
    const g = gainEnv(ctx, dest, tt, 0.01, 0.55, 0.16);
    sum.connect(b1); sum.connect(b2); b1.connect(g); b2.connect(g);
    for (let v = 0; v < 6; v++) osc(ctx, "sawtooth", 140 + v * 23 + Math.random() * 10, tt, tt + 0.25, sum, Math.random() * 30);
    const ng = gainEnv(ctx, g, tt, 0.005, 0.3, 0.1); burst(ctx, ng, tt, 0.15);
  }
}

// the turntable under your hand: a scratch, its pitch following the hand
export function makeScratch(ctx, dest) {
  const g = ctx.createGain(); g.gain.value = 0; g.connect(dest);
  const bp = filt(ctx, "bandpass", 800, 2); bp.connect(g);
  const s = ctx.createBufferSource(); s.buffer = noise(ctx); s.loop = true; s.connect(bp); s.start();
  const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = 120; const og = ctx.createGain(); og.gain.value = 0.25; o.connect(og); og.connect(bp); o.start();
  return {
    move(speed) {
      const t = ctx.currentTime, v = Math.min(1, Math.abs(speed));
      g.gain.setTargetAtTime(v * 0.5, t, 0.01);
      bp.frequency.setTargetAtTime(300 + v * 3500, t, 0.01);
      o.frequency.setTargetAtTime(60 + v * 500, t, 0.01);
    },
    stop() { const t = ctx.currentTime; g.gain.setTargetAtTime(0, t, 0.02); setTimeout(() => { try { s.stop(); o.stop(); g.disconnect(); } catch (e) { /* ignore */ } }, 200); },
  };
}
