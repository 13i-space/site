// Donaghy Castle sounds, synthesized with the Web Audio API (no files),
// in the same spirit as lib/sfx.js. Every call is safe to make before the
// browser allows audio - it just does nothing.

let ctx = null;
let muted = false;
function c() {
  if (muted) return null;
  try {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

// the shared AudioContext, ignoring the effects mute (lib/castle/music.js uses it)
export function audioContext() {
  try {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone({ f = 440, to = null, d = 0.1, type = "sine", v = 0.12, at = 0 }) {
  const a = c();
  if (!a) return;
  const t = a.currentTime + at;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (to) o.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + d);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + d + 0.05);
}

function noise({ d = 0.2, v = 0.15, at = 0, f = 900, to = 200, type = "lowpass" }) {
  const a = c();
  if (!a) return;
  const t = a.currentTime + at;
  const n = Math.floor(a.sampleRate * d);
  const b = a.createBuffer(1, n, a.sampleRate);
  const data = b.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = a.createBufferSource();
  s.buffer = b;
  const fl = a.createBiquadFilter();
  fl.type = type;
  fl.frequency.setValueAtTime(f, t);
  fl.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + d);
  const g = a.createGain();
  g.gain.setValueAtTime(v, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  s.connect(fl).connect(g).connect(a.destination);
  s.start(t);
}

export const castleSound = {
  setMuted(m) { muted = m; },
  isMuted() { return muted; },
  unlock() { c(); },
  step() { noise({ d: 0.04, v: 0.03, f: 500, to: 200 }); },
  chore() { tone({ f: 523, d: 0.09, type: "triangle", v: 0.1 }); tone({ f: 784, d: 0.14, type: "triangle", v: 0.1, at: 0.08 }); },
  bell() {
    for (let i = 0; i < 3; i++) {
      tone({ f: 196, d: 2.2, v: 0.22, at: i * 0.9 });
      tone({ f: 392, d: 1.6, v: 0.08, at: i * 0.9 });
      tone({ f: 587, d: 1.0, v: 0.04, at: i * 0.9 });
    }
  },
  capture() { tone({ f: 140, to: 50, d: 0.8, type: "sawtooth", v: 0.12 }); noise({ d: 0.5, v: 0.1, f: 400, to: 80 }); },
  honk() { tone({ f: 330, to: 280, d: 0.12, type: "square", v: 0.1 }); tone({ f: 330, to: 260, d: 0.16, type: "square", v: 0.1, at: 0.16 }); },
  whoosh() { noise({ d: 0.5, v: 0.14, f: 300, to: 3000, type: "bandpass" }); },
  lightsOut() { tone({ f: 300, to: 60, d: 1.0, type: "sawtooth", v: 0.1 }); noise({ d: 0.8, v: 0.1, f: 2000, to: 100 }); },
  gateSlam() { noise({ d: 0.6, v: 0.25, f: 700, to: 60 }); tone({ f: 90, to: 40, d: 0.5, type: "square", v: 0.1 }); },
  fixed() { tone({ f: 440, d: 0.1, type: "square", v: 0.08 }); tone({ f: 660, d: 0.1, type: "square", v: 0.08, at: 0.1 }); tone({ f: 880, d: 0.2, type: "square", v: 0.08, at: 0.2 }); },
  truth() { tone({ f: 880, to: 1760, d: 0.4, type: "sine", v: 0.1 }); },
  disguise() { tone({ f: 600, to: 150, d: 0.5, type: "triangle", v: 0.1 }); },
  bark(vol = 1) {
    for (const at of [0, 0.22]) { tone({ f: 520, to: 260, d: 0.12, type: "sawtooth", v: 0.11 * vol, at }); noise({ d: 0.1, v: 0.08 * vol, f: 1500, to: 400, at }); }
  },
  happyDog() { tone({ f: 700, to: 900, d: 0.15, type: "sine", v: 0.06 }); tone({ f: 800, to: 1100, d: 0.15, type: "sine", v: 0.06, at: 0.18 }); },
  scrub() { noise({ d: 0.08, v: 0.05, f: 2500, to: 1200, type: "bandpass" }); },
  pour() { noise({ d: 0.15, v: 0.04, f: 900, to: 600, type: "bandpass" }); },
  ding() { tone({ f: 1046, d: 0.25, type: "triangle", v: 0.08 }); },
  thud() { tone({ f: 120, to: 70, d: 0.12, type: "sine", v: 0.15 }); },
  wrong() { tone({ f: 200, to: 140, d: 0.2, type: "square", v: 0.07 }); },
  click() { tone({ f: 700, d: 0.04, type: "square", v: 0.05 }); },
  gallop(seconds = 2.5) {
    const beats = Math.floor(seconds / 0.18);
    for (let i = 0; i < beats; i++) noise({ d: 0.06, v: 0.06 + (i / beats) * 0.12, f: 350, to: 120, at: i * 0.18 + (i % 2 ? 0.05 : 0) });
  },
  crash() { noise({ d: 0.9, v: 0.35, f: 3000, to: 100 }); tone({ f: 120, to: 40, d: 0.6, type: "square", v: 0.15 }); },
  cheer() { noise({ d: 2.2, v: 0.12, f: 1200, to: 900, type: "bandpass" }); },
  groan() { tone({ f: 220, to: 110, d: 1.4, type: "sawtooth", v: 0.08 }); },
  fanfare() {
    [523, 659, 784, 1046].forEach((f, i) => tone({ f, d: 0.25, type: "square", v: 0.08, at: i * 0.14 }));
    tone({ f: 1046, d: 0.8, type: "square", v: 0.08, at: 0.6 });
  },
  doom() { [196, 185, 174, 147].forEach((f, i) => tone({ f, d: 0.5, type: "sawtooth", v: 0.1, at: i * 0.35 })); },
};
