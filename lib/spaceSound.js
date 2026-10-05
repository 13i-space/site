// Ambient space sound (Update 5.59), made live with Web Audio - no files.
// Used by the Galaxy Map (a deep hum that breathes with the view) and the
// Black Hole lessons (a drone that sinks lower the further in you go).
//
//   const amb = startAmbient({ base: 55 });   // after a user gesture
//   amb.setPitch(41); amb.setLevel(0.6); amb.stop();
//   whoosh(); ping(660);
//
// The on/off choice is shared site-wide (localStorage "13i_space_sound").

let ctx = null;
const KEY = "13i_space_sound";
export function soundOn() { try { return localStorage.getItem(KEY) !== "off"; } catch (e) { return true; } }
export function setSoundOn(on) { try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) { /* ignore */ } }

function ac() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch (e) { return null; }
}

export function startAmbient({ base = 55, level = 0.5 } = {}) {
  const c = ac();
  if (!c) return { setPitch() {}, setLevel() {}, stop() {} };
  const t = c.currentTime;
  const master = c.createGain(); master.gain.setValueAtTime(0.0001, t); master.gain.exponentialRampToValueAtTime(0.0001 + 0.18 * level, t + 3);
  const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900; lp.Q.value = 0.5;
  master.connect(lp); lp.connect(c.destination);

  // the hum: two detuned sines and a fifth, very slowly beating
  const oscs = [[1, 0.5, -3], [1, 0.5, 3], [1.5, 0.18, 0], [2, 0.08, 5]].map(([m, g, cents]) => {
    const o = c.createOscillator(); o.type = "sine"; o.frequency.value = base * m; o.detune.value = cents;
    const gg = c.createGain(); gg.gain.value = g; o.connect(gg); gg.connect(master); o.start();
    return { o, m };
  });
  // the wind: noise through a slowly wandering band-pass
  const buf = c.createBuffer(1, c.sampleRate * 3, c.sampleRate); const d = buf.getChannelData(0);
  let last = 0; for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
  const noise = c.createBufferSource(); noise.buffer = buf; noise.loop = true;
  const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 300; bp.Q.value = 0.8;
  const ng = c.createGain(); ng.gain.value = 0.5;
  noise.connect(bp); bp.connect(ng); ng.connect(master); noise.start();
  const lfo = c.createOscillator(); lfo.frequency.value = 0.05; const lg = c.createGain(); lg.gain.value = 180;
  lfo.connect(lg); lg.connect(bp.frequency); lfo.start();
  // a breath in the hum itself
  const trem = c.createOscillator(); trem.frequency.value = 0.11; const tg = c.createGain(); tg.gain.value = 0.04 * level;
  trem.connect(tg); tg.connect(master.gain); trem.start();
  // now and then, a high glassy shimmer, far off
  let alive = true;
  const shimmer = () => {
    if (!alive) return;
    const n = c.currentTime;
    const o = c.createOscillator(); o.type = "sine"; o.frequency.value = base * [8, 12, 9, 16, 10.5][Math.floor(Math.random() * 5)];
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, n); g.gain.exponentialRampToValueAtTime(0.025, n + 2); g.gain.exponentialRampToValueAtTime(0.0001, n + 6);
    o.connect(g); g.connect(master); o.start(n); o.stop(n + 6.2);
    setTimeout(shimmer, 5000 + Math.random() * 7000);
  };
  setTimeout(shimmer, 3000);

  return {
    setPitch(p) { const n = c.currentTime; oscs.forEach(({ o, m }) => o.frequency.setTargetAtTime(p * m, n, 1.2)); },
    setLevel(l) { const n = c.currentTime; master.gain.setTargetAtTime(0.0001 + 0.18 * Math.max(0, l), n, 0.6); },
    setBrightness(b) { lp.frequency.setTargetAtTime(400 + b * 2200, c.currentTime, 0.5); },
    stop() {
      alive = false;
      const n = c.currentTime;
      master.gain.cancelScheduledValues(n); master.gain.setTargetAtTime(0.0001, n, 0.4);
      setTimeout(() => { try { oscs.forEach(({ o }) => o.stop()); noise.stop(); lfo.stop(); trem.stop(); master.disconnect(); } catch (e) { /* gone */ } }, 1800);
    },
  };
}

// a soft rush of air, for moving between things
export function whoosh(down = false) {
  const c = ac(); if (!c) return;
  const n = c.currentTime;
  const buf = c.createBuffer(1, c.sampleRate * 1.2, c.sampleRate); const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(); s.buffer = buf;
  const f = c.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.2;
  f.frequency.setValueAtTime(down ? 1800 : 300, n); f.frequency.exponentialRampToValueAtTime(down ? 250 : 1600, n + 0.9);
  const g = c.createGain(); g.gain.setValueAtTime(0.0001, n); g.gain.exponentialRampToValueAtTime(0.09, n + 0.25); g.gain.exponentialRampToValueAtTime(0.0001, n + 1.1);
  s.connect(f); f.connect(g); g.connect(c.destination); s.start(n); s.stop(n + 1.2);
}

// a small clear tone
export function ping(freq = 660, gain = 0.06) {
  const c = ac(); if (!c) return;
  const n = c.currentTime;
  const o = c.createOscillator(); o.type = "sine"; o.frequency.value = freq;
  const g = c.createGain(); g.gain.setValueAtTime(0.0001, n); g.gain.exponentialRampToValueAtTime(gain, n + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, n + 1.2);
  o.connect(g); g.connect(c.destination); o.start(n); o.stop(n + 1.3);
}
