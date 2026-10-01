"use client";

// A deep-water drone for Interactive Assignments, synthesized in the browser
// (Web Audio - no audio files, no service, same rule as lib/sfx.js).
// mood() bends it to the scene: calm, tense (the rupture), dark, light.

let ctx = null;
let nodes = null;

function getCtx() {
  try {
    if (!ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      ctx = new Ctx();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch (e) {
    return null;
  }
}

const MOODS = {
  calm: { root: 55, fifth: 82.4, cutoff: 420, vol: 0.05, beat: 0.15 },
  tense: { root: 51.9, fifth: 73.4, cutoff: 700, vol: 0.06, beat: 2.2 },
  dark: { root: 41.2, fifth: 58.3, cutoff: 220, vol: 0.045, beat: 0.6 },
  light: { root: 65.4, fifth: 98, cutoff: 900, vol: 0.05, beat: 0.1 },
  // inside the Quiet Moon's silence: almost nothing, a low pressure more than a sound
  silent: { root: 43.65, fifth: 65.4, cutoff: 140, vol: 0.012, beat: 0.05 },
};

export function startAmbience() {
  const c = getCtx();
  if (!c || nodes) return;
  try {
    const master = c.createGain();
    master.gain.value = 0.0001;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    filter.Q.value = 4;
    const a = c.createOscillator();
    const b = c.createOscillator();
    const b2 = c.createOscillator();
    a.type = "sine";
    b.type = "triangle";
    b2.type = "triangle";
    a.frequency.value = 55;
    b.frequency.value = 82.4;
    b2.frequency.value = 82.55;
    // slow swell, like current
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 160;
    lfo.connect(lfoGain).connect(filter.frequency);
    a.connect(filter);
    b.connect(filter);
    b2.connect(filter);
    filter.connect(master).connect(c.destination);
    [a, b, b2, lfo].forEach((o) => o.start());
    master.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 3);
    nodes = { master, filter, a, b, b2, lfo };
  } catch (e) {
    nodes = null;
  }
}

export function mood(name) {
  const c = getCtx();
  if (!c || !nodes) return;
  const m = MOODS[name] || MOODS.calm;
  const t = c.currentTime;
  try {
    nodes.a.frequency.linearRampToValueAtTime(m.root, t + 3);
    nodes.b.frequency.linearRampToValueAtTime(m.fifth, t + 3);
    nodes.b2.frequency.linearRampToValueAtTime(m.fifth + m.beat, t + 3);
    nodes.filter.frequency.setTargetAtTime(m.cutoff, t, 1.2);
    nodes.master.gain.setTargetAtTime(m.vol, t, 1.5);
  } catch (e) {
    // ignore
  }
}

export function stopAmbience() {
  const c = getCtx();
  if (!c || !nodes) return;
  const n = nodes;
  nodes = null;
  try {
    n.master.gain.setTargetAtTime(0.0001, c.currentTime, 0.4);
    setTimeout(() => {
      try {
        [n.a, n.b, n.b2, n.lfo].forEach((o) => o.stop());
      } catch (e) {
        // ignore
      }
    }, 1800);
  } catch (e) {
    // ignore
  }
}

// a soft chime when a choice is made
export function chime(locked = false) {
  const c = getCtx();
  if (!c) return;
  try {
    const t = c.currentTime;
    [locked ? 196 : 523.25, locked ? 185 : 783.99].forEach((f, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.08);
      g.gain.exponentialRampToValueAtTime(locked ? 0.03 : 0.05, t + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 1.2);
      o.connect(g).connect(c.destination);
      o.start(t + i * 0.08);
      o.stop(t + i * 0.08 + 1.3);
    });
  } catch (e) {
    // ignore
  }
}

export const MOOD_FOR_SCENE = {
  orbit: "calm",
  descent: "calm",
  structures: "calm",
  creature: "calm",
  city: "calm",
  child: "calm",
  failing: "tense",
  rupture: "tense",
  elder: "tense",
  light: "light",
  dark: "dark",
};
