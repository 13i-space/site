// The sound of Assignment 0000000 - Before (Update 5.54). All synthesised
// in the browser - no audio files. It starts on the "begin" tap (browsers
// only allow sound after one), stays almost silent, and grows with what
// the visitor does: a low drone, a faint tone while something feels their
// pull, soft bells when things merge, a rising hold, true silence, then
// the Big Bang and a warm chord that settles. If Web Audio isn't there,
// every call is a quiet no-op - the experience never depends on sound.

const PENTA = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99];

export function createBeforeSound() {
  let ctx = null, master = null, verb = null, drone = null, pull = null, rise = null;
  let muted = false;
  const ok = () => !!ctx && ctx.state !== "closed";
  const now = () => ctx.currentTime;

  const impulse = (secs, decay) => {
    const len = Math.floor(ctx.sampleRate * secs);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  };
  const noiseBuf = (secs) => {
    const len = Math.floor(ctx.sampleRate * secs);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  };
  // a soft bell: sine + quiet octave, long tail into the reverb
  const bell = (freq, vol = 0.08, len = 2.4) => {
    if (!ok()) return;
    const t = now();
    [[freq, 1], [freq * 2, 0.25], [freq * 3.01, 0.08]].forEach(([f, v]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol * v, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g); g.connect(master); g.connect(verb);
      o.start(t); o.stop(t + len + 0.1);
    });
  };

  return {
    // call from the "begin" tap
    start() {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        if (ctx.state !== "running") ctx.resume().catch(() => {});
        master = ctx.createGain();
        master.gain.value = muted ? 0 : 1;
        master.connect(ctx.destination);
        verb = ctx.createConvolver();
        verb.buffer = impulse(4.5, 2.6);
        const vg = ctx.createGain(); vg.gain.value = 0.55;
        verb.connect(vg); vg.connect(master);

        // the drone: two low detuned voices through a closed filter
        const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 180; f.Q.value = 0.7;
        const g = ctx.createGain(); g.gain.value = 0;
        const o1 = ctx.createOscillator(); o1.type = "triangle"; o1.frequency.value = 55;
        const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = 82.6;
        o1.connect(f); o2.connect(f); f.connect(g); g.connect(master); g.connect(verb);
        o1.start(); o2.start();
        g.gain.linearRampToValueAtTime(0.05, now() + 6);
        drone = { f, g, o1, o2 };

        // the pull: a faint high tone that answers the visitor's presence
        const pg = ctx.createGain(); pg.gain.value = 0;
        const po = ctx.createOscillator(); po.type = "sine"; po.frequency.value = 660;
        const po2 = ctx.createOscillator(); po2.type = "sine"; po2.frequency.value = 663;
        po.connect(pg); po2.connect(pg); pg.connect(master); pg.connect(verb);
        po.start(); po2.start();
        pull = { g: pg, o: po, o2: po2 };
      } catch (e) { ctx = null; }
    },
    // 0..1: how strongly something is feeling the visitor right now
    pull(amount, pitch = 0) {
      if (!ok() || !pull) return;
      const t = now();
      pull.g.gain.setTargetAtTime(Math.min(1, amount) * 0.03, t, 0.12);
      const f = 520 + pitch * 360;
      pull.o.frequency.setTargetAtTime(f, t, 0.2);
      pull.o2.frequency.setTargetAtTime(f * 1.005, t, 0.2);
    },
    // the drone opens up as the universe gets fuller (0..1)
    swell(level) {
      if (!ok() || !drone) return;
      const t = now();
      drone.f.frequency.setTargetAtTime(180 + level * 900, t, 0.8);
      drone.g.gain.setTargetAtTime(0.05 + level * 0.05, t, 0.8);
    },
    found() { bell(PENTA[5], 0.07, 3.5); setTimeout(() => bell(PENTA[7], 0.05, 3.5), 140); },
    merge(n) { bell(PENTA[Math.min(PENTA.length - 1, 2 + n)], 0.07); },
    seed(band) { bell([PENTA[7], PENTA[4], PENTA[1]][band] || PENTA[4], 0.08, 3); },
    // the hold before the bang: 0..1
    hold(p) {
      if (!ok()) return;
      const t = now();
      if (!rise && p > 0) {
        const src = ctx.createBufferSource(); src.buffer = noiseBuf(2); src.loop = true;
        const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.4; bp.frequency.value = 200;
        const g = ctx.createGain(); g.gain.value = 0;
        src.connect(bp); bp.connect(g); g.connect(master);
        src.start();
        rise = { src, bp, g };
      }
      if (!rise) return;
      rise.bp.frequency.setTargetAtTime(200 + p * p * 3200, t, 0.05);
      rise.g.gain.setTargetAtTime(p * 0.09, t, 0.05);
      if (drone) {
        drone.o1.frequency.setTargetAtTime(55 * (1 + p * 0.5), t, 0.1);
        drone.o2.frequency.setTargetAtTime(82.6 * (1 + p * 0.5), t, 0.1);
        drone.g.gain.setTargetAtTime(0.08 + p * 0.06, t, 0.1);
      }
    },
    // everything stops: the first silence
    silence() {
      if (!ok()) return;
      const t = now();
      [drone && drone.g, pull && pull.g, rise && rise.g].forEach((g) => g && g.gain.setTargetAtTime(0, t, 0.03));
    },
    bang() {
      if (!ok()) return;
      const t = now();
      // the burst: noise falling from bright to deep
      const src = ctx.createBufferSource(); src.buffer = noiseBuf(6);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 0.5;
      lp.frequency.setValueAtTime(9000, t);
      lp.frequency.exponentialRampToValueAtTime(90, t + 5);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 5.5);
      src.connect(lp); lp.connect(g); g.connect(master); g.connect(verb);
      src.start(t); src.stop(t + 6);
      // the body: a sub that drops
      const sub = ctx.createOscillator(); sub.type = "sine";
      sub.frequency.setValueAtTime(90, t);
      sub.frequency.exponentialRampToValueAtTime(28, t + 3);
      const sg = ctx.createGain();
      sg.gain.setValueAtTime(0.0001, t);
      sg.gain.exponentialRampToValueAtTime(0.45, t + 0.03);
      sg.gain.exponentialRampToValueAtTime(0.0001, t + 4);
      sub.connect(sg); sg.connect(master);
      sub.start(t); sub.stop(t + 4.2);
      if (rise) { try { rise.src.stop(t + 0.1); } catch (e) { /* ignore */ } rise = null; }
      // then the universe's first chord, swelling in slowly
      [110, 164.81, 220, 277.18, 329.63, 440].forEach((fq, i) => {
        const o = ctx.createOscillator(); o.type = i < 2 ? "triangle" : "sine"; o.frequency.value = fq;
        o.detune.value = (i % 2 ? 4 : -4);
        const og = ctx.createGain();
        og.gain.setValueAtTime(0, t + 1.2);
        og.gain.linearRampToValueAtTime(0.022, t + 5 + i * 0.3);
        og.gain.linearRampToValueAtTime(0.012, t + 16);
        og.gain.linearRampToValueAtTime(0, t + 30);
        o.connect(og); og.connect(master); og.connect(verb);
        o.start(t + 1.2); o.stop(t + 31);
      });
      if (drone) { drone.o1.frequency.setValueAtTime(55, t); drone.o2.frequency.setValueAtTime(82.6, t); }
    },
    chime() { bell(PENTA[9], 0.04, 4); },
    setMuted(m) {
      muted = m;
      if (ok() && master) master.gain.setTargetAtTime(m ? 0 : 1, now(), 0.1);
    },
    fadeOut(secs = 1.2) {
      if (!ok() || !master) return;
      master.gain.setTargetAtTime(0, now(), secs / 3);
    },
    stop() { try { if (ctx) ctx.close(); } catch (e) { /* ignore */ } ctx = null; },
  };
}
