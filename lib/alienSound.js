// Alien sounds for the artifacts (Update 5.58), made live with Web Audio -
// no files. One shared AudioContext, created on the first gesture.
// Everything here is quiet by design and does nothing if audio is off or
// unavailable.

let ctx = null;
let muted = false;
export function setMuted(m) { muted = !!m; try { localStorage.setItem("13i_artifact_mute", m ? "1" : "0"); } catch (e) { /* ignore */ } }
export function isMuted() { try { muted = localStorage.getItem("13i_artifact_mute") === "1"; } catch (e) { /* ignore */ } return muted; }

function ac() {
  if (muted) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch (e) { return null; }
}

let noiseBuf = null;
function noise(c) {
  if (noiseBuf) return noiseBuf;
  noiseBuf = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}

// a pitch set that isn't ours: a 9-step scale of the 13th root of 3
export const ALIEN_SCALE = Array.from({ length: 9 }, (_, i) => 220 * Math.pow(3, (i * 2) / 13));

// one tick of a mechanism: a bright chitin click, a second smaller one, and
// a chirp falling through the step's own pitch
export function alienClick(step = 0, voice = 0) {
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  const out = c.createGain(); out.gain.value = 0.5; out.connect(c.destination);
  [0, 0.028 + voice * 0.006].forEach((dt, k) => {
    const src = c.createBufferSource(); src.buffer = noise(c);
    const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2600 + voice * 700 + Math.random() * 600; bp.Q.value = 9;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t + dt);
    g.gain.linearRampToValueAtTime(k ? 0.35 : 0.6, t + dt + 0.002);
    g.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.04);
    src.connect(bp); bp.connect(g); g.connect(out);
    src.start(t + dt, Math.random() * 0.4, 0.06);
  });
  const f = ALIEN_SCALE[((step % 9) + 9) % 9] * (1 + voice * 0.5);
  const o = c.createOscillator(); o.type = "sine";
  o.frequency.setValueAtTime(f * 1.6, t);
  o.frequency.exponentialRampToValueAtTime(f, t + 0.05);
  const og = c.createGain();
  og.gain.setValueAtTime(0.0001, t);
  og.gain.exponentialRampToValueAtTime(0.09, t + 0.005);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  o.connect(og); og.connect(out);
  o.start(t); o.stop(t + 0.14);
}

// a held tone that settles: something locking into place
export function alienLock(voice = 0) {
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  [1, 1.5, 2.01].forEach((m, i) => {
    const o = c.createOscillator(); o.type = i ? "sine" : "triangle";
    o.frequency.setValueAtTime(ALIEN_SCALE[voice * 3 % 9] * m * 0.5, t);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.07 / (i + 1), t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + 1);
  });
}

// a refusal: a low, rough buzz
export function alienDeny() {
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(70, t); o.frequency.linearRampToValueAtTime(52, t + 0.3);
  const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 400;
  const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  o.connect(lp); lp.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.4);
}

// opening: a long rising sweep with a shimmer on top
export function alienOpen() {
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(880, t + 1.6);
  const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 2.3);
  ALIEN_SCALE.forEach((f, i) => {
    const s = c.createOscillator(); s.type = "sine"; s.frequency.value = f * 4;
    const sg = c.createGain(); const st = t + 0.6 + i * 0.09;
    sg.gain.setValueAtTime(0.0001, st); sg.gain.exponentialRampToValueAtTime(0.03, st + 0.01); sg.gain.exponentialRampToValueAtTime(0.0001, st + 0.5);
    s.connect(sg); sg.connect(c.destination); s.start(st); s.stop(st + 0.55);
  });
}

// an alien voice: a babble of formant-shaped syllables, for things that speak
// (returns how long it will talk, in seconds)
export function alienSpeak(syllables = 8, base = 140) {
  const c = ac(); if (!c) return syllables * 0.16;
  let t = c.currentTime + 0.02;
  const out = c.createGain(); out.gain.value = 0.25; out.connect(c.destination);
  for (let i = 0; i < syllables; i++) {
    const dur = 0.08 + Math.random() * 0.14;
    const o = c.createOscillator(); o.type = "sawtooth";
    const f0 = base * (0.8 + Math.random() * 0.6);
    o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f0 * (0.7 + Math.random() * 0.7), t + dur);
    const f1 = c.createBiquadFilter(); f1.type = "bandpass"; f1.Q.value = 6; f1.frequency.setValueAtTime(400 + Math.random() * 900, t); f1.frequency.linearRampToValueAtTime(500 + Math.random() * 1600, t + dur);
    const f2 = c.createBiquadFilter(); f2.type = "bandpass"; f2.Q.value = 8; f2.frequency.value = 1800 + Math.random() * 1800;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g); g.connect(out);
    o.start(t); o.stop(t + dur + 0.02);
    t += dur + (Math.random() < 0.25 ? 0.12 : 0.03);
  }
  return t - c.currentTime;
}

// a soft chime at a pitch (used by the Well)
export function chime(freq, gain = 0.08, pan = 0) {
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator(); o.type = "sine"; o.frequency.value = freq;
  const o2 = c.createOscillator(); o2.type = "sine"; o2.frequency.value = freq * 2.76;
  const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
  const g2 = c.createGain(); g2.gain.setValueAtTime(0.0001, t); g2.gain.exponentialRampToValueAtTime(gain * 0.25, t + 0.005); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
  let dest = c.destination;
  if (c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, pan)); p.connect(c.destination); dest = p; }
  o.connect(g); g.connect(dest); o2.connect(g2); g2.connect(dest);
  o.start(t); o.stop(t + 1.9); o2.start(t); o2.stop(t + 0.6);
}

// ─── the Alien Lab (Update 5.64) ───
// a crackle of electricity from the tank's coils
export function labZap(gain = 0.07) {
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  const src = c.createBufferSource(); src.buffer = noise(c);
  const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1800 + Math.random() * 2000;
  const g = c.createGain();
  const n = 3 + Math.floor(Math.random() * 4);
  g.gain.setValueAtTime(0.0001, t);
  for (let i = 0; i < n; i++) { const st = t + i * (0.02 + Math.random() * 0.04); g.gain.setValueAtTime(gain * (0.4 + Math.random() * 0.6), st); g.gain.setValueAtTime(0.0001, st + 0.012); }
  src.connect(hp); hp.connect(g); g.connect(c.destination);
  src.start(t); src.stop(t + 0.35);
}

// the hum of the tank while a species takes shape: rises as it goes.
// labHum(level 0..1) starts or adjusts it; labHum(0) fades it out.
let hum = null;
export function labHum(level = 0.5) {
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  if (!hum && level > 0) {
    const out = c.createGain(); out.gain.value = 0.0001; out.connect(c.destination);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 400; lp.Q.value = 6; lp.connect(out);
    const oscs = [55, 55 * 1.5, 82.4 * 1.007].map((f, i) => { const o = c.createOscillator(); o.type = i ? "sawtooth" : "triangle"; o.frequency.value = f; o.connect(lp); o.start(); return o; });
    const lfo = c.createOscillator(); lfo.frequency.value = 0.25; const lg = c.createGain(); lg.gain.value = 120; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
    hum = { out, lp, oscs, lfo };
  }
  if (!hum) return;
  if (level <= 0) {
    hum.out.gain.cancelScheduledValues(t); hum.out.gain.setTargetAtTime(0.0001, t, 0.4);
    const h = hum; hum = null;
    setTimeout(() => { try { h.oscs.forEach((o) => o.stop()); h.lfo.stop(); h.out.disconnect(); } catch (e) { /* ignore */ } }, 2500);
    return;
  }
  hum.out.gain.setTargetAtTime(0.02 + level * 0.05, t, 0.6);
  hum.lp.frequency.setTargetAtTime(300 + level * 1400, t, 0.8);
  hum.oscs.forEach((o, i) => o.frequency.setTargetAtTime([55, 82.5, 83][i] * (1 + level * 0.5), t, 1.5));
}

// it's done: a burst, then a rising chord in the alien scale
export function labReveal() {
  const c = ac(); if (!c) return;
  const t = c.currentTime;
  const src = c.createBufferSource(); src.buffer = noise(c);
  const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.setValueAtTime(400, t); bp.frequency.exponentialRampToValueAtTime(6000, t + 0.5);
  const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
  src.connect(bp); bp.connect(g); g.connect(c.destination); src.start(t); src.stop(t + 0.75);
  [0, 2, 4, 6, 8].forEach((k, i) => {
    const f = ALIEN_SCALE[k] * 2, st = t + 0.25 + i * 0.13;
    [1, 2.01].forEach((m) => {
      const o = c.createOscillator(); o.type = m === 1 ? "triangle" : "sine"; o.frequency.value = f * m;
      const og = c.createGain(); og.gain.setValueAtTime(0.0001, st); og.gain.exponentialRampToValueAtTime(m === 1 ? 0.09 : 0.03, st + 0.02); og.gain.exponentialRampToValueAtTime(0.0001, st + 2.4);
      o.connect(og); og.connect(c.destination); o.start(st); o.stop(st + 2.5);
    });
  });
}
