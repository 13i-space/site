// A tiny synthesized sound engine shared by the games - no audio files,
// no third-party service, just the Web Audio API already built into the
// browser. One AudioContext is created lazily on first use and reused
// for the rest of the session (browsers require a user gesture before
// audio can play, which a button press / key press already satisfies).

let ctx = null;
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

function blip({ freq = 440, duration = 0.08, type = "square", volume = 0.15, glideTo = null, delay = 0 }) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (glideTo !== null) osc.frequency.exponentialRampToValueAtTime(Math.max(1, glideTo), t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

function noiseBurst({ duration = 0.25, volume = 0.2, delay = 0, freqStart = 900 }) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime + delay;
  const bufferSize = Math.floor(c.sampleRate * duration);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(freqStart, t);
  filter.frequency.exponentialRampToValueAtTime(200, t + duration);
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  source.connect(filter).connect(gain).connect(c.destination);
  source.start(t);
}

export const sfx = {
  fire() {
    blip({ freq: 720, glideTo: 340, duration: 0.07, type: "square", volume: 0.1 });
  },
  hit() {
    blip({ freq: 300, glideTo: 120, duration: 0.09, type: "triangle", volume: 0.14 });
  },
  explosion(size = "medium") {
    const opts = {
      small: { duration: 0.18, volume: 0.16, freqStart: 1200 },
      medium: { duration: 0.3, volume: 0.22, freqStart: 900 },
      large: { duration: 0.45, volume: 0.28, freqStart: 600 },
    }[size] || {};
    noiseBurst(opts);
  },
  lifeLost() {
    blip({ freq: 220, glideTo: 60, duration: 0.35, type: "sawtooth", volume: 0.22 });
  },
  levelUp() {
    blip({ freq: 440, duration: 0.1, type: "square", volume: 0.12 });
    blip({ freq: 660, duration: 0.14, type: "square", volume: 0.12, delay: 0.09 });
  },
  gameOver() {
    blip({ freq: 260, glideTo: 60, duration: 0.6, type: "sawtooth", volume: 0.2 });
  },

  // continuous thrust hum - call start() on key/button down, stop() on up
  thrust: (() => {
    let osc = null, gain = null;
    return {
      start() {
        const c = getCtx();
        if (!c || osc) return;
        osc = c.createOscillator();
        gain = c.createGain();
        osc.type = "sawtooth";
        osc.frequency.value = 70;
        gain.gain.setValueAtTime(0.0001, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.06, c.currentTime + 0.05);
        osc.connect(gain).connect(c.destination);
        osc.start();
      },
      stop() {
        const c = getCtx();
        if (!c || !osc) return;
        gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.08);
        osc.stop(c.currentTime + 0.1);
        osc = null;
        gain = null;
      },
    };
  })(),
};
