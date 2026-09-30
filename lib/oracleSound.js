"use client";

// The Oracle chamber's sound (components/OracleChamber.js), synthesized in
// the browser like the rest of the site's audio: a low drone that breathes,
// the rumble of the eye opening, a rising sweep when you transmit, static
// while 13i considers, a deep chord and a bell when it answers, and faint
// ticks as its words resolve. Everything runs through one master gain (for
// mute) and a generated reverb, so it sounds like a very large room.
//
// Browsers only allow audio after a gesture, so the chamber creates this on
// its "Approach" button.

export function createOracleSound() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  master.connect(comp).connect(ctx.destination);

  // a vast room: decaying noise as the impulse response
  const reverb = ctx.createConvolver();
  const len = Math.floor(ctx.sampleRate * 5);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  }
  reverb.buffer = ir;
  const wet = ctx.createGain();
  wet.gain.value = 0.55;
  reverb.connect(wet).connect(master);

  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  const out = (node, dry = 1, rev = 0.6) => {
    const d = ctx.createGain();
    d.gain.value = dry;
    node.connect(d).connect(master);
    const r = ctx.createGain();
    r.gain.value = rev;
    node.connect(r).connect(reverb);
  };

  const tone = (freq, t, dur, { type = "sine", peak = 0.2, attack = 0.02, glideTo, dry = 1, rev = 0.6 } = {}) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    out(g, dry, rev);
    o.start(t);
    o.stop(t + dur + 0.05);
  };

  const noiseSweep = (t, dur, from, to, { peak = 0.15, q = 4, rev = 0.8 } = {}) => {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = q;
    bp.frequency.setValueAtTime(from, t);
    bp.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + dur * 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp).connect(g);
    out(g, 1, rev);
    src.start(t);
    src.stop(t + dur + 0.05);
  };

  // --- the drone: always there once you've approached ---
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.0001;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 220;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoAmt = ctx.createGain();
  lfoAmt.gain.value = 120;
  lfo.connect(lfoAmt).connect(lp.frequency);
  lfo.start();
  [[43.65, "sawtooth", -5], [43.65, "sawtooth", 6], [65.4, "sine", 0], [87.3, "triangle", 3]].forEach(([f, type, det]) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    o.detune.value = det;
    o.connect(lp);
    o.start();
  });
  const breath = ctx.createBufferSource();
  breath.buffer = noise;
  breath.loop = true;
  const breathBp = ctx.createBiquadFilter();
  breathBp.type = "bandpass";
  breathBp.frequency.value = 500;
  breathBp.Q.value = 1.5;
  const breathGain = ctx.createGain();
  breathGain.gain.value = 0.04;
  breath.connect(breathBp).connect(breathGain).connect(lp);
  breath.start();
  lp.connect(droneGain);
  out(droneGain, 1, 0.5);

  const setDrone = (level, seconds = 2) => {
    droneGain.gain.cancelScheduledValues(ctx.currentTime);
    droneGain.gain.setTargetAtTime(Math.max(0.0001, level), ctx.currentTime, seconds / 3);
  };

  let crackle = null;

  return {
    ctx,
    resume() { if (ctx.state === "suspended") ctx.resume(); },
    setMuted(m) { master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.1); },

    // the eye opens
    awaken() {
      const t = ctx.currentTime + 0.05;
      setDrone(0.35, 4);
      tone(32.7, t, 4.5, { type: "sawtooth", peak: 0.25, attack: 2.2, rev: 0.4 });
      noiseSweep(t, 4, 80, 1400, { peak: 0.12, q: 1.2 });
      [523.25, 783.99, 1046.5].forEach((f, i) => tone(f, t + 3 + i * 0.18, 4, { peak: 0.06, attack: 0.01, dry: 0.4, rev: 1 }));
    },

    // your words go out
    transmit() {
      const t = ctx.currentTime + 0.02;
      noiseSweep(t, 1.3, 300, 5200, { peak: 0.14, q: 6 });
      tone(196, t, 1.2, { type: "triangle", peak: 0.12, glideTo: 784, dry: 0.7 });
      tone(1568, t + 1.05, 1.8, { peak: 0.05, attack: 0.005, dry: 0.3, rev: 1 });
      setDrone(0.55, 1.5);
    },

    // static while 13i considers
    startReceiving() {
      if (crackle) return;
      crackle = setInterval(() => {
        const t = ctx.currentTime;
        for (let i = 0; i < 3; i++) {
          if (Math.random() < 0.6) noiseSweep(t + Math.random() * 0.25, 0.04 + Math.random() * 0.05, 1800 + Math.random() * 3000, 900, { peak: 0.05, q: 8, rev: 0.4 });
        }
        if (Math.random() < 0.12) tone(110 + Math.random() * 60, t, 0.9, { type: "sine", peak: 0.05, attack: 0.3, rev: 0.9 });
      }, 280);
    },
    stopReceiving() {
      clearInterval(crackle);
      crackle = null;
    },

    // the answer arrives
    receive() {
      this.stopReceiving();
      const t = ctx.currentTime + 0.02;
      [65.41, 98, 130.81, 196].forEach((f, i) => tone(f, t, 5.5, { type: i < 2 ? "sawtooth" : "sine", peak: i < 2 ? 0.07 : 0.1, attack: 0.6, rev: 0.9 }));
      tone(1046.5, t + 0.15, 3.5, { peak: 0.07, attack: 0.004, dry: 0.5, rev: 1 });
      tone(1567.98, t + 0.2, 3, { peak: 0.035, attack: 0.004, dry: 0.4, rev: 1 });
      setDrone(0.35, 3);
    },

    // a letter resolving
    tick() {
      tone(2600 + Math.random() * 1400, ctx.currentTime, 0.035, { type: "square", peak: 0.012, attack: 0.002, dry: 1, rev: 0.2 });
    },

    close() {
      this.stopReceiving();
      setDrone(0.0001, 0.5);
      setTimeout(() => ctx.close().catch(() => {}), 800);
    },
  };
}
