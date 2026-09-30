// AudioManager - every sound is synthesized in the browser (no samples,
// no vocals). If Web Audio can't start, every method quietly does nothing.

export function createAudio(settings) {
  let ctx = null;
  let master = null;
  let ambientBus = null;
  let sfxBus = null;
  let drone = null;
  let tension = 0;
  let ok = false;

  const volume = () => (settings().muted ? 0 : settings().volume);

  function start() {
    if (ctx) {
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      return;
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 3;
      master = ctx.createGain();
      master.gain.value = volume();
      master.connect(comp).connect(ctx.destination);
      ambientBus = ctx.createGain();
      ambientBus.gain.value = 0;
      ambientBus.connect(master);
      sfxBus = ctx.createGain();
      sfxBus.gain.value = 0.8;
      sfxBus.connect(master);
      ok = true;
      buildDrone();
    } catch (e) {
      ok = false;
    }
  }

  function noiseBuffer(seconds = 2) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // Ambient score: a low drone, a slow-moving pad, and filtered wind.
  // Awareness raises `tension`: the filter opens and a dissonant tone creeps in.
  function buildDrone() {
    const t = ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    filter.Q.value = 2;
    filter.connect(ambientBus);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 90;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start(t);

    const voices = [55, 55.4, 82.41, 110.2].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i < 2 ? "sawtooth" : "triangle";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i < 2 ? 0.08 : 0.05;
      o.connect(g).connect(filter);
      o.start(t);
      return o;
    });

    // pad: a slow cycle through open fifths/ninths
    const padGain = ctx.createGain();
    padGain.gain.value = 0.035;
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 900;
    padGain.connect(padFilter).connect(ambientBus);
    const pad = [ctx.createOscillator(), ctx.createOscillator(), ctx.createOscillator()];
    const chords = [[220, 329.6, 493.9], [196, 293.7, 440], [207.7, 311.1, 466.2], [185, 277.2, 415.3]];
    pad.forEach((o, i) => {
      o.type = "sine";
      o.frequency.value = chords[0][i];
      o.connect(padGain);
      o.start(t);
    });
    let chord = 0;
    const padTimer = setInterval(() => {
      if (!ctx) return;
      chord = (chord + 1) % chords.length;
      pad.forEach((o, i) => o.frequency.setTargetAtTime(chords[chord][i], ctx.currentTime, 3));
    }, 16000);

    // wind
    const wind = ctx.createBufferSource();
    wind.buffer = noiseBuffer(3);
    wind.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.value = 400;
    windFilter.Q.value = 0.8;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.03;
    wind.connect(windFilter).connect(windGain).connect(ambientBus);
    wind.start(t);

    // tension: a tritone that fades in with awareness
    const tri = ctx.createOscillator();
    tri.type = "sine";
    tri.frequency.value = 77.8;
    const triGain = ctx.createGain();
    triGain.gain.value = 0;
    tri.connect(triGain).connect(ambientBus);
    tri.start(t);

    drone = { filter, triGain, voices, padTimer, windFilter };
  }

  function env(node, t, a, peak, d) {
    node.gain.setValueAtTime(0.0001, t);
    node.gain.exponentialRampToValueAtTime(peak, t + a);
    node.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  function tone({ freq, type = "sine", attack = 0.01, decay = 0.4, peak = 0.2, slideTo = null, delay = 0, filter = null }) {
    if (!ok) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + attack + decay);
    const g = ctx.createGain();
    env(g, t, attack, peak, decay);
    let out = o.connect(g);
    if (filter) {
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = filter;
      out = out.connect(f);
    }
    out.connect(sfxBus);
    o.start(t);
    o.stop(t + attack + decay + 0.05);
  }

  function noiseBurst({ duration = 0.4, freq = 800, q = 1, peak = 0.15, delay = 0 }) {
    if (!ok) return;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(Math.max(0.2, duration));
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    env(g, t, 0.02, peak, duration);
    src.connect(f).connect(g).connect(sfxBus);
    src.start(t);
    src.stop(t + duration + 0.1);
  }

  const api = {
    start,
    get ready() { return ok; },
    applyVolume() {
      if (ok) master.gain.setTargetAtTime(volume(), ctx.currentTime, 0.05);
    },
    ambient(level, seconds = 2) {
      if (ok) ambientBus.gain.setTargetAtTime(level, ctx.currentTime, seconds / 3);
    },
    setTension(v) {
      tension = Math.max(0, Math.min(1, v));
      if (!ok || !drone) return;
      const now = ctx.currentTime;
      drone.filter.frequency.setTargetAtTime(320 + tension * 700, now, 1.5);
      drone.triGain.gain.setTargetAtTime(tension * tension * 0.06, now, 2);
      drone.windFilter.frequency.setTargetAtTime(400 + tension * 500, now, 2);
    },

    scan() {
      tone({ freq: 220, slideTo: 880, type: "sine", attack: 0.02, decay: 0.9, peak: 0.16 });
      tone({ freq: 440, slideTo: 1760, type: "sine", attack: 0.02, decay: 0.7, peak: 0.05, delay: 0.05 });
    },
    pulse() {
      tone({ freq: 140, slideTo: 40, type: "triangle", attack: 0.005, decay: 0.5, peak: 0.3 });
      noiseBurst({ duration: 0.35, freq: 300, q: 0.7, peak: 0.12 });
    },
    energy() {
      [392, 587.3, 784].forEach((f, i) => tone({ freq: f, attack: 0.02, decay: 0.6, peak: 0.07, delay: i * 0.07 }));
    },
    discovery() {
      [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone({ freq: f, attack: 0.01, decay: 1.2, peak: 0.06, delay: i * 0.11 }));
    },
    success() {
      [440, 554.4, 659.3, 880].forEach((f, i) => tone({ freq: f, type: "triangle", attack: 0.01, decay: 0.9, peak: 0.07, delay: i * 0.09 }));
    },
    failure() {
      tone({ freq: 196, slideTo: 98, type: "sawtooth", attack: 0.01, decay: 0.6, peak: 0.08, filter: 600 });
      tone({ freq: 185, slideTo: 92, type: "sawtooth", attack: 0.01, decay: 0.6, peak: 0.06, filter: 600 });
    },
    transmission() {
      for (let i = 0; i < 7; i++) tone({ freq: 900 + ((i * 373) % 700), type: "square", attack: 0.005, decay: 0.06, peak: 0.025, delay: i * 0.075, filter: 2400 });
    },
    warning() {
      tone({ freq: 660, type: "sine", attack: 0.01, decay: 0.25, peak: 0.07 });
      tone({ freq: 660, type: "sine", attack: 0.01, decay: 0.25, peak: 0.07, delay: 0.35 });
    },
    warden() {
      tone({ freq: 41.2, type: "sine", attack: 0.8, decay: 2.5, peak: 0.3 });
      tone({ freq: 61.7, type: "sine", attack: 1.0, decay: 2.2, peak: 0.12 });
      noiseBurst({ duration: 2.2, freq: 120, q: 3, peak: 0.08 });
    },
    hurt() {
      noiseBurst({ duration: 0.25, freq: 1400, q: 2, peak: 0.12 });
    },
    ui() {
      tone({ freq: 1200, type: "sine", attack: 0.003, decay: 0.05, peak: 0.03 });
    },
    swell() {
      [110, 164.8, 220, 329.6, 440].forEach((f, i) => tone({ freq: f, type: "sine", attack: 3, decay: 5, peak: 0.07, delay: i * 0.4 }));
    },
    reveal() {
      [261.6, 392, 523.3, 784, 1046.5].forEach((f, i) => tone({ freq: f, type: "triangle", attack: 0.05, decay: 4, peak: 0.06, delay: i * 0.18 }));
    },

    // Frequency Match: a target tone and the player's tone play together -
    // the beating between them slows as they converge.
    startTones(targetFreq) {
      if (!ok) return { setPlayer() {}, stop() {} };
      const t = ctx.currentTime;
      const g = ctx.createGain();
      g.gain.value = 0;
      g.gain.setTargetAtTime(0.06, t, 0.2);
      g.connect(sfxBus);
      const a = ctx.createOscillator();
      a.frequency.value = targetFreq;
      const b = ctx.createOscillator();
      b.frequency.value = targetFreq * 1.3;
      a.connect(g); b.connect(g);
      a.start(t); b.start(t);
      return {
        setPlayer(f) { b.frequency.setTargetAtTime(f, ctx.currentTime, 0.03); },
        stop() {
          g.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
          a.stop(ctx.currentTime + 0.5);
          b.stop(ctx.currentTime + 0.5);
        },
      };
    },
  };
  return api;
}
