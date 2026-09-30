// Sound for SIXTEEN, all synthesized: deep water, the network's heartbeat
// (faster as the city dims), and chimes that climb with your combo.
// If Web Audio can't start, everything here quietly does nothing.

export function createAudio(getSettings) {
  let ctx = null, master = null, sfx = null, amb = null, ok = false;
  let heartTimer = 0;

  const vol = () => (getSettings().muted ? 0 : getSettings().volume);

  function start() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume().catch(() => {}); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16;
      master = ctx.createGain();
      master.gain.value = vol();
      master.connect(comp).connect(ctx.destination);
      sfx = ctx.createGain();
      sfx.gain.value = 0.9;
      sfx.connect(master);
      amb = ctx.createGain();
      amb.gain.value = 0;
      amb.connect(master);
      ok = true;
      ambience();
    } catch (e) {
      ok = false;
    }
  }

  function noiseBuffer(sec) {
    const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * sec), ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  function ambience() {
    const t = ctx.currentTime;
    // the deep: a low drone and slow-moving filtered water
    [41.2, 61.7, 82.4].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = [0.12, 0.05, 0.03][i];
      o.connect(g).connect(amb);
      o.start(t);
    });
    const n = ctx.createBufferSource();
    n.buffer = noiseBuffer(4);
    n.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 380;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lg = ctx.createGain();
    lg.gain.value = 180;
    lfo.connect(lg).connect(lp.frequency);
    lfo.start(t);
    const ng = ctx.createGain();
    ng.gain.value = 0.09;
    n.connect(lp).connect(ng).connect(amb);
    n.start(t);
  }

  function env(g, t, a, peak, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function tone(freq, { type = "sine", a = 0.01, d = 0.4, peak = 0.12, slide = null, delay = 0, lp = null } = {}) {
    if (!ok) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + a + d);
    const g = ctx.createGain();
    env(g, t, a, peak, d);
    let out = o.connect(g);
    if (lp) { const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = lp; out = out.connect(f); }
    out.connect(sfx);
    o.start(t);
    o.stop(t + a + d + 0.05);
  }
  function whoosh({ d = 0.8, freq = 500, peak = 0.12, delay = 0, q = 0.8 } = {}) {
    if (!ok) return;
    const t = ctx.currentTime + delay;
    const s = ctx.createBufferSource();
    s.buffer = noiseBuffer(d + 0.2);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(freq, t);
    f.frequency.exponentialRampToValueAtTime(freq * 0.4, t + d);
    f.Q.value = q;
    const g = ctx.createGain();
    env(g, t, d * 0.3, peak, d * 0.7);
    s.connect(f).connect(g).connect(sfx);
    s.start(t);
    s.stop(t + d + 0.1);
  }

  // a pentatonic ladder: repairs climb it as the combo grows
  const LADDER = [392, 440, 523.3, 587.3, 659.3, 784, 880, 1046.5, 1174.7, 1318.5];

  return {
    start,
    get ready() { return ok; },
    applyVolume() { if (ok) master.gain.setTargetAtTime(vol(), ctx.currentTime, 0.05); },
    ambient(level) { if (ok) amb.gain.setTargetAtTime(level, ctx.currentTime, 0.8); },

    // the network's pulse - called every frame; beats faster as light falls
    heartbeat(dt, light, active) {
      if (!ok || !active) return;
      heartTimer -= dt;
      if (heartTimer <= 0) {
        heartTimer = 0.55 + (light / 100) * 1.4;
        tone(58, { type: "sine", a: 0.01, d: 0.22, peak: 0.16 });
        tone(52, { type: "sine", a: 0.01, d: 0.2, peak: 0.1, delay: 0.16 });
      }
    },

    send() { tone(300, { type: "sine", a: 0.005, d: 0.14, peak: 0.05, slide: 520 }); },
    arrive() { tone(900, { type: "triangle", a: 0.002, d: 0.05, peak: 0.03 }); },
    part() { tone(640, { type: "square", a: 0.004, d: 0.08, peak: 0.025, lp: 1800 }); },
    fault() { tone(180, { type: "triangle", a: 0.02, d: 0.35, peak: 0.07, slide: 150 }); },
    escalate() { tone(330, { type: "sawtooth", a: 0.01, d: 0.25, peak: 0.04, lp: 900 }); tone(311, { type: "sawtooth", a: 0.01, d: 0.25, peak: 0.04, lp: 900, delay: 0.12 }); },
    repair(mult) {
      const i = Math.min(LADDER.length - 3, Math.floor((mult - 1) * 2));
      [LADDER[i], LADDER[i + 2]].forEach((f, k) => tone(f, { type: "triangle", a: 0.005, d: 0.5, peak: 0.07, delay: k * 0.05 }));
    },
    burst() { tone(70, { type: "sine", a: 0.005, d: 0.6, peak: 0.3, slide: 35 }); whoosh({ d: 0.7, freq: 900, peak: 0.12 }); },
    dissent() { [277.2, 329.6, 415.3].forEach((f, k) => tone(f, { type: "sine", a: 0.04, d: 0.7, peak: 0.05, delay: k * 0.07 })); },
    listen() { [329.6, 415.3, 493.9, 659.3].forEach((f, k) => tone(f, { type: "sine", a: 0.02, d: 0.8, peak: 0.05, delay: k * 0.06 })); },
    currentWarn() { whoosh({ d: 2.2, freq: 260, peak: 0.1, q: 0.5 }); tone(98, { type: "sine", a: 1.5, d: 1.5, peak: 0.12 }); },
    anchor() { tone(110, { type: "triangle", a: 0.005, d: 0.18, peak: 0.1, slide: 80 }); },
    held() { [98, 146.8, 196].forEach((f, k) => tone(f, { type: "sine", a: 0.05, d: 1.2, peak: 0.1, delay: k * 0.05 })); },
    torn() { whoosh({ d: 1.1, freq: 1200, peak: 0.2, q: 0.6 }); tone(90, { type: "sine", a: 0.01, d: 0.8, peak: 0.2, slide: 40 }); },
    call() { [659.3, 784, 987.8].forEach((f, k) => tone(f, { type: "sine", a: 0.03, d: 0.9, peak: 0.05, delay: k * 0.15 })); },
    mature() { [220, 277.2, 329.6, 440].forEach((f, k) => tone(f, { type: "triangle", a: 0.03, d: 1.2, peak: 0.06, delay: k * 0.12 })); },
    tide() { [196, 246.9, 293.7, 392].forEach((f, k) => tone(f, { type: "sine", a: 0.2, d: 1.8, peak: 0.07, delay: k * 0.2 })); },
    rupture() { tone(38, { type: "sine", a: 0.5, d: 3, peak: 0.35 }); whoosh({ d: 3, freq: 220, peak: 0.15, q: 0.4 }); },
    triumph() { [261.6, 329.6, 392, 523.3, 659.3, 784].forEach((f, k) => tone(f, { type: "triangle", a: 0.02, d: 1.6, peak: 0.07, delay: k * 0.09 })); },
    busy() { tone(160, { type: "square", a: 0.005, d: 0.1, peak: 0.03, lp: 800 }); },
    over() { [293.7, 246.9, 196, 146.8].forEach((f, k) => tone(f, { type: "sine", a: 0.05, d: 1.4, peak: 0.08, delay: k * 0.4 })); },
    ui() { tone(1100, { type: "sine", a: 0.003, d: 0.05, peak: 0.025 }); },
  };
}
