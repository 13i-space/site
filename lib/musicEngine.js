// The Signal Composer's sound engine: everything synthesized with the Web
// Audio API (no samples), so it follows the site's "a signal, translated"
// idea and adds no new service.
//
// A "song" is plain data (see defaultSong / generateSong) - four bars of 16
// steps looping, with a chord per bar. The same scheduling code drives live
// playback and the offline render used for WAV download.

export const SCALES = {
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  major: [0, 2, 4, 5, 7, 9, 11],
  pentatonic: [0, 3, 5, 7, 10],
};
export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const LAYERS = ["drone", "pad", "arp", "bass", "drums", "texture"];
export const STEPS = 16;
export const BARS = 4;

export const MOODS = {
  signal: { label: "Signal", tempo: [84, 100], scales: ["minor", "dorian"], density: 0.45, layers: { drone: 0.5, pad: 0.55, arp: 0.6, bass: 0.5, drums: 0.35, texture: 0.4 } },
  drift: { label: "Drift", tempo: [60, 76], scales: ["lydian", "major", "pentatonic"], density: 0.25, layers: { drone: 0.6, pad: 0.7, arp: 0.35, bass: 0.25, drums: 0, texture: 0.35 } },
  pulse: { label: "Pulse", tempo: [112, 128], scales: ["minor", "phrygian"], density: 0.7, layers: { drone: 0.3, pad: 0.4, arp: 0.65, bass: 0.7, drums: 0.7, texture: 0.25 } },
  descent: { label: "Descent", tempo: [66, 82], scales: ["phrygian", "minor"], density: 0.35, layers: { drone: 0.75, pad: 0.5, arp: 0.3, bass: 0.55, drums: 0.25, texture: 0.6 } },
  aurora: { label: "Aurora", tempo: [92, 108], scales: ["lydian", "dorian"], density: 0.55, layers: { drone: 0.35, pad: 0.65, arp: 0.7, bass: 0.35, drums: 0.3, texture: 0.3 } },
};

// --- seeded randomness, so "Generate" can be repeated from a seed ---
export function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PROGRESSIONS = [[0, 5, 3, 4], [0, 3, 4, 3], [0, 6, 5, 4], [0, 2, 5, 4], [0, 5, 2, 6], [0, 4, 5, 3]];

export function generateSong(moodKey = "signal", seed = (Math.random() * 1e9) | 0) {
  const mood = MOODS[moodKey] || MOODS.signal;
  const r = makeRng(seed);
  const pick = (a) => a[Math.floor(r() * a.length)];
  const d = mood.density;
  const bool16 = (p, fixed = []) => Array.from({ length: STEPS }, (_, i) => fixed.includes(i) || r() < p);
  const drums = mood.layers.drums > 0;
  return {
    mood: moodKey,
    seed,
    tempo: Math.round(mood.tempo[0] + r() * (mood.tempo[1] - mood.tempo[0])),
    root: Math.floor(r() * 12),
    scale: pick(mood.scales),
    progression: pick(PROGRESSIONS),
    layers: Object.fromEntries(LAYERS.map((l) => [l, { on: mood.layers[l] > 0, vol: mood.layers[l] || 0.5 }])),
    // arp: which chord tone (0-3, higher = up an octave) plays on each step, -1 = rest
    arp: Array.from({ length: STEPS }, (_, i) => (r() < 0.35 + d * 0.5 || i % 4 === 0 ? Math.floor(r() * 4) : -1)),
    bass: bool16(0.12 + d * 0.25, [0, 8]),
    kick: drums ? bool16(d * 0.15, [0, 8]) : Array(STEPS).fill(false),
    snare: drums ? bool16(0.03, d > 0.5 ? [4, 12] : [12]) : Array(STEPS).fill(false),
    hat: drums ? bool16(d * 0.7) : Array(STEPS).fill(false),
  };
}

export const defaultSong = () => generateSong("signal", 1317811);

// Clamp anything (e.g. Claude's composition) into a valid song.
export function sanitizeSong(input) {
  const base = defaultSong();
  const s = { ...base, ...(input || {}) };
  const b16 = (a, fb) => (Array.isArray(a) && a.length === STEPS ? a.map(Boolean) : fb);
  return {
    mood: MOODS[s.mood] ? s.mood : "signal",
    seed: Number(s.seed) || 0,
    tempo: Math.max(50, Math.min(160, Math.round(Number(s.tempo) || base.tempo))),
    root: ((Math.round(Number(s.root)) % 12) + 12) % 12 || 0,
    scale: SCALES[s.scale] ? s.scale : base.scale,
    progression: Array.isArray(s.progression) && s.progression.length === BARS ? s.progression.map((x) => Math.max(0, Math.min(6, Math.round(Number(x) || 0)))) : base.progression,
    layers: Object.fromEntries(LAYERS.map((l) => {
      const v = (s.layers || {})[l] || {};
      return [l, { on: v.on !== undefined ? !!v.on : base.layers[l].on, vol: Math.max(0, Math.min(1, Number(v.vol ?? base.layers[l].vol))) }];
    })),
    arp: Array.isArray(s.arp) && s.arp.length === STEPS ? s.arp.map((x) => { const n = Math.round(Number(x)); return n >= 0 && n <= 3 ? n : -1; }) : base.arp,
    bass: b16(s.bass, base.bass),
    kick: b16(s.kick, base.kick),
    snare: b16(s.snare, base.snare),
    hat: b16(s.hat, base.hat),
  };
}

// --- music theory helpers ---
const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);
function chordTones(song, bar) {
  const scale = SCALES[song.scale];
  const degree = song.progression[bar % BARS];
  // stack thirds within the scale: degree, +2, +4, +6
  return [0, 2, 4, 6].map((k) => {
    const idx = degree + k;
    const oct = Math.floor(idx / scale.length);
    return song.root + scale[idx % scale.length] + 12 * oct;
  });
}

// --- the instrument graph (works on AudioContext and OfflineAudioContext) ---
export function buildGraph(ctx) {
  const master = ctx.createGain();
  master.gain.value = 0.8;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.ratio.value = 3;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  master.connect(comp).connect(analyser).connect(ctx.destination);

  // a generated reverb: decaying noise as an impulse response
  const reverb = ctx.createConvolver();
  const len = Math.floor(ctx.sampleRate * 3.2);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  reverb.buffer = ir;
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.35;
  reverb.connect(reverbGain).connect(master);

  // a feedback delay for the arpeggio's echoes
  const delay = ctx.createDelay(2);
  const feedback = ctx.createGain();
  feedback.gain.value = 0.38;
  const delayOut = ctx.createGain();
  delayOut.gain.value = 0.3;
  delay.connect(feedback).connect(delay);
  delay.connect(delayOut).connect(master);

  const layer = {};
  LAYERS.forEach((l) => {
    const g = ctx.createGain();
    g.connect(master);
    g.connect(reverb);
    layer[l] = g;
  });
  layer.arp.connect(delay);

  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  return { ctx, master, analyser, delay, layer, noise, sustained: [] };
}

export function applyMix(graph, song, when) {
  const t = when ?? graph.ctx.currentTime;
  LAYERS.forEach((l) => {
    const v = song.layers[l];
    graph.layer[l].gain.setTargetAtTime(v.on ? v.vol * LAYER_TRIM[l] : 0, t, 0.05);
  });
  graph.delay.delayTime.setValueAtTime((60 / song.tempo) * 0.75, t);
}
const LAYER_TRIM = { drone: 0.5, pad: 0.35, arp: 0.3, bass: 0.55, drums: 0.8, texture: 0.3 };

function env(g, t, a, peak, d) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}

function osc(ctx, type, freq, t, stop, dest, detune = 0) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.detune.value = detune;
  o.connect(dest);
  o.start(t);
  o.stop(stop);
  return o;
}

// Sustained layers (drone, texture) start once and run until stopped.
export function startSustained(graph, song, t) {
  const { ctx, layer } = graph;
  const nodes = [];
  // drone: root and fifth, low, slowly filtered
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 380;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 160;
  lfo.connect(lfoGain).connect(lp.frequency);
  lfo.start(t);
  lp.connect(layer.drone);
  [[song.root + 36, "sawtooth", -6], [song.root + 36, "sawtooth", 6], [song.root + 43, "triangle", 0]].forEach(([m, type, det]) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = midiToHz(m);
    o.detune.value = det;
    o.connect(lp);
    o.start(t);
    nodes.push(o);
  });
  nodes.push(lfo);
  // texture: filtered noise, like a signal under static
  const src = ctx.createBufferSource();
  src.buffer = graph.noise;
  src.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1200;
  bp.Q.value = 6;
  const lfo2 = ctx.createOscillator();
  lfo2.frequency.value = 0.13;
  const lfo2Gain = ctx.createGain();
  lfo2Gain.gain.value = 700;
  lfo2.connect(lfo2Gain).connect(bp.frequency);
  lfo2.start(t);
  src.connect(bp).connect(layer.texture);
  src.start(t);
  nodes.push(src, lfo2);
  graph.sustained = nodes;
}

export function stopSustained(graph, t) {
  graph.sustained.forEach((n) => { try { n.stop(t); } catch (e) { /* already stopped */ } });
  graph.sustained = [];
}

// Schedule everything that happens on one 16th-note step.
export function scheduleStep(graph, song, stepIndex, t) {
  const { ctx, layer } = graph;
  const step = stepIndex % STEPS;
  const bar = Math.floor(stepIndex / STEPS) % BARS;
  const stepDur = 60 / song.tempo / 4;
  const chord = chordTones(song, bar);

  // pad: a new chord at the top of each bar
  if (step === 0) {
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1400;
    g.connect(lp).connect(layer.pad);
    const len = stepDur * STEPS;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.22, t + len * 0.3);
    g.gain.linearRampToValueAtTime(0.0001, t + len * 1.05);
    chord.forEach((m) => {
      osc(ctx, "sawtooth", midiToHz(m + 48), t, t + len * 1.1, g, -7);
      osc(ctx, "sawtooth", midiToHz(m + 48), t, t + len * 1.1, g, 7);
    });
  }

  // arpeggio: a plucked chord tone
  const a = song.arp[step];
  if (a >= 0) {
    const m = chord[a % 4] + 60 + (a >= 3 ? 12 : 0);
    const g = ctx.createGain();
    g.connect(layer.arp);
    env(g, t, 0.005, 0.3, stepDur * 2.2);
    osc(ctx, "triangle", midiToHz(m), t, t + stepDur * 3, g);
    osc(ctx, "square", midiToHz(m + 12), t, t + stepDur * 3, g).detune.value = 3;
  }

  // bass: the chord's root, with a closing filter
  if (song.bass[step]) {
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(900, t);
    lp.frequency.exponentialRampToValueAtTime(140, t + stepDur * 2);
    g.connect(lp).connect(layer.bass);
    env(g, t, 0.01, 0.5, stepDur * 2.5);
    osc(ctx, "sawtooth", midiToHz(chord[0] + 24), t, t + stepDur * 3, g);
    osc(ctx, "sine", midiToHz(chord[0] + 24), t, t + stepDur * 3, g);
  }

  // drums - all synthesized
  if (song.kick[step]) {
    const g = ctx.createGain();
    g.connect(layer.drums);
    env(g, t, 0.002, 0.9, 0.28);
    const o = osc(ctx, "sine", 140, t, t + 0.35, g);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
  }
  if (song.snare[step]) {
    const src = ctx.createBufferSource();
    src.buffer = graph.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1900;
    const g = ctx.createGain();
    src.connect(bp).connect(g).connect(layer.drums);
    env(g, t, 0.002, 0.5, 0.16);
    src.start(t, Math.random());
    src.stop(t + 0.22);
  }
  if (song.hat[step]) {
    const src = ctx.createBufferSource();
    src.buffer = graph.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    src.connect(hp).connect(g).connect(layer.drums);
    env(g, t, 0.001, step % 4 === 2 ? 0.28 : 0.16, 0.045);
    src.start(t, Math.random());
    src.stop(t + 0.08);
  }

  // texture: now and then, a faint transmission bleep
  if (song.layers.texture.on && step % 8 === 6 && ((stepIndex * 2654435761) >>> 0) % 5 === 0) {
    const g = ctx.createGain();
    g.connect(layer.texture);
    for (let i = 0; i < 4; i++) {
      const tt = t + i * stepDur * 0.25;
      const gg = ctx.createGain();
      gg.connect(g);
      env(gg, tt, 0.002, 0.25, 0.03);
      osc(ctx, "square", midiToHz(chord[i % 4] + 84), tt, tt + 0.06, gg);
    }
  }
}

// Render N loops offline and return a WAV Blob.
export async function renderWav(song, loops = 2) {
  const stepDur = 60 / song.tempo / 4;
  const totalSteps = STEPS * BARS * loops;
  const seconds = totalSteps * stepDur + 3; // + reverb tail
  const sampleRate = 44100;
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new OAC(2, Math.ceil(seconds * sampleRate), sampleRate);
  const graph = buildGraph(ctx);
  applyMix(graph, song, 0);
  startSustained(graph, song, 0);
  for (let i = 0; i < totalSteps; i++) scheduleStep(graph, song, i, i * stepDur + 0.05);
  stopSustained(graph, totalSteps * stepDur + 1);
  const buffer = await ctx.startRendering();
  return encodeWav(buffer);
}

function encodeWav(buffer) {
  const ch = buffer.numberOfChannels, len = buffer.length, rate = buffer.sampleRate;
  const data = new DataView(new ArrayBuffer(44 + len * ch * 2));
  const str = (o, s) => { for (let i = 0; i < s.length; i++) data.setUint8(o + i, s.charCodeAt(i)); };
  str(0, "RIFF"); data.setUint32(4, 36 + len * ch * 2, true); str(8, "WAVE");
  str(12, "fmt "); data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, ch, true);
  data.setUint32(24, rate, true); data.setUint32(28, rate * ch * 2, true); data.setUint16(32, ch * 2, true); data.setUint16(34, 16, true);
  str(36, "data"); data.setUint32(40, len * ch * 2, true);
  const chans = Array.from({ length: ch }, (_, c) => buffer.getChannelData(c));
  let o = 44;
  for (let i = 0; i < len; i++) {
    for (let c = 0; c < ch; c++) {
      const v = Math.max(-1, Math.min(1, chans[c][i]));
      data.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true);
      o += 2;
    }
  }
  return new Blob([data], { type: "audio/wav" });
}
