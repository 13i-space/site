"use client";

// The sound of a card turning over (components/AlienCard.js): a short swish
// of air and a soft tap as it lands. Synthesized, like the rest of the
// site's sound; one shared AudioContext, made on the first flip (a click,
// so the browser allows it).
let ctx = null;
let noise = null;

export function playFlip() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!ctx) {
      ctx = new AC();
      noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.4), ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime + 0.01;

    // swish: filtered noise sweeping up, like air past the card's edge
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(700, t);
    bp.frequency.exponentialRampToValueAtTime(3200, t + 0.2);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.07);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(t);
    src.stop(t + 0.3);

    // tap: the card settling
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.setValueAtTime(900, t + 0.24);
    o.frequency.exponentialRampToValueAtTime(420, t + 0.3);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, t + 0.24);
    g2.gain.exponentialRampToValueAtTime(0.05, t + 0.245);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    o.connect(g2).connect(ctx.destination);
    o.start(t + 0.24);
    o.stop(t + 0.34);
  } catch (e) {
    // no sound is fine
  }
}
