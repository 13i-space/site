// A story's signal: a short composed piece, "a signal, translated" (see
// docs/WORLD.md), played by the Signal Composer's own engine
// (lib/musicEngine.js), so it's synthesized in the browser like everything
// else: no audio files, no service. These are separate from Paul's music
// library (which is human-made); each one belongs to a story bundle.
//
// A signal is a list of sections. Each section is a full engine "song"
// (tempo, scale, progression, arp, drums...) played for `bars` bars, so a
// piece can change as it goes, which a single four-bar loop can't.

import { sanitizeSong, buildGraph, applyMix, startSustained, stopSustained, scheduleStep, STEPS } from "./musicEngine";

const F = false, T = true;
const steps = (on) => Array.from({ length: STEPS }, (_, i) => on.includes(i));
const off = { on: false, vol: 0 };
const L = (vol) => ({ on: vol > 0, vol });

// THE QUIET MOON (Assignment 0028657): the loud moon, then the edge of the
// silence, everything absorbed one layer at a time, nothing at all, and then
// the holders' language - a long press, two short - and the young.
const loud = {
  tempo: 92, root: 2, scale: "phrygian", progression: [0, 1, 0, 5],
  arp: [0, 2, 1, 3, 0, 2, 3, 1, 0, 2, 1, 3, 2, 0, 3, 1],
  bass: steps([0, 3, 6, 8, 11, 14]),
  kick: steps([0, 6, 8, 11]), snare: steps([4, 12]), hat: steps([0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15]),
  layers: { drone: L(0.7), pad: L(0.5), arp: L(0.65), bass: L(0.7), drums: L(0.6), texture: L(0.9) },
};
const touchArp = [0, -1, -1, -1, -1, -1, -1, -1, 2, -1, 2, -1, -1, -1, -1, -1]; // long · short short

export const SIGNALS = {
  28657: {
    title: "The Quiet Moon",
    subtitle: "a signal from Tacet, translated",
    sections: [
      { label: "The loud moon", bars: 8, song: loud },
      { label: "The edge of the silence", bars: 4, song: { ...loud, hat: steps([]), snare: steps([]), arp: [0, -1, 1, -1, 0, -1, 3, -1, 0, -1, 1, -1, 2, -1, -1, -1], layers: { ...loud.layers, texture: L(0.5), drums: L(0.45) } } },
      { label: "Absorbed", bars: 4, song: { ...loud, kick: steps([]), snare: steps([]), hat: steps([]), bass: steps([0]), arp: [0, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1], layers: { drone: L(0.55), pad: L(0.35), arp: L(0.4), bass: L(0.3), drums: off, texture: L(0.2) } } },
      { label: "Tacet", bars: 2, song: { ...loud, kick: steps([]), snare: steps([]), hat: steps([]), bass: steps([]), arp: Array(16).fill(-1), layers: { drone: L(0.22), pad: off, arp: off, bass: off, drums: off, texture: off } } },
      { label: "", bars: 2, song: { ...loud, kick: steps([]), snare: steps([]), hat: steps([]), bass: steps([]), arp: Array(16).fill(-1), layers: { drone: off, pad: off, arp: off, bass: off, drums: off, texture: off } } },
      { label: "Press · hold · release", bars: 8, song: { tempo: 92, root: 2, scale: "lydian", progression: [0, 0, 4, 0], arp: touchArp, bass: steps([]), kick: steps([]), snare: steps([]), hat: steps([]), layers: { drone: L(0.3), pad: L(0.4), arp: L(0.75), bass: off, drums: off, texture: off } } },
      { label: "The young", bars: 4, song: { tempo: 92, root: 2, scale: "lydian", progression: [0, 4, 3, 0], arp: [0, -1, -1, -1, -1, -1, -1, -1, 2, -1, 2, -1, -1, -1, 3, -1], bass: steps([]), kick: steps([]), snare: steps([]), hat: steps([]), layers: { drone: L(0.3), pad: L(0.5), arp: L(0.6), bass: off, drums: off, texture: L(0.25) } } },
    ],
  },
};

// Every section as a clean engine song, with its start time.
function plan(signal) {
  let t = 0;
  return signal.sections.map((s) => {
    const song = sanitizeSong({ seed: 28657, mood: "signal", ...s.song });
    const stepDur = 60 / song.tempo / 4;
    const steps = s.bars * STEPS;
    const out = { ...s, song, start: t, stepDur, steps, length: steps * stepDur };
    t += out.length;
    return out;
  });
}

export function signalLength(signal) {
  return plan(signal).reduce((a, s) => a + s.length, 0);
}

export function signalSections(signal) {
  return plan(signal).map(({ label, start, length }) => ({ label, start, length }));
}

function scheduleAll(graph, signal, t0, untilT = Infinity, fromT = -Infinity) {
  const parts = plan(signal);
  let next = 0;
  parts.forEach((p) => {
    const at = t0 + p.start;
    if (at + p.length < fromT || at > untilT) return;
    applyMix(graph, p.song, at);
    for (let i = 0; i < p.steps; i++) {
      const tt = at + i * p.stepDur;
      if (tt <= fromT || tt > untilT) continue;
      scheduleStep(graph, p.song, i, tt);
      next = tt;
    }
  });
  return next;
}

// ---- live playback: one signal at a time ----
let current = null;

export function stopStorySignal() {
  if (!current) return;
  const c = current;
  current = null;
  clearInterval(c.timer);
  try {
    const t = c.ctx.currentTime;
    c.graph.master.gain.setTargetAtTime(0, t, 0.2);
    stopSustained(c.graph, t + 1);
    setTimeout(() => c.ctx.close().catch(() => {}), 1500);
  } catch (e) {
    // ignore
  }
  c.onEnd && c.onEnd();
}

// onTick(seconds) is called while it plays; onEnd when it stops.
export function playStorySignal(signal, { onTick, onEnd } = {}) {
  stopStorySignal();
  const AC = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return false;
  const ctx = new AC();
  const graph = buildGraph(ctx);
  const parts = plan(signal);
  const total = parts.reduce((a, s) => a + s.length, 0);
  const t0 = ctx.currentTime + 0.1;
  graph.master.gain.setValueAtTime(0.0001, t0);
  graph.master.gain.linearRampToValueAtTime(0.8, t0 + 1.2);
  graph.master.gain.setValueAtTime(0.8, t0 + total - 2);
  graph.master.gain.linearRampToValueAtTime(0.0001, t0 + total + 1.5);
  startSustained(graph, parts[0].song, t0);
  // schedule in small windows, like the Composer does
  let scheduled = t0 - 0.001;
  const c = { ctx, graph, onEnd };
  c.timer = setInterval(() => {
    const now = ctx.currentTime;
    if (scheduled < now + 0.4) {
      scheduleAll(graph, signal, t0, now + 0.6, scheduled);
      scheduled = now + 0.6;
    }
    onTick && onTick(Math.max(0, now - t0), total);
    if (now > t0 + total + 1.6 && current === c) stopStorySignal();
  }, 80);
  current = c;
  return true;
}

// ---- offline render to a WAV, for download (or for Paul to take into Logic) ----
export async function renderStorySignalWav(signal) {
  const parts = plan(signal);
  const total = parts.reduce((a, s) => a + s.length, 0) + 3;
  const rate = 44100;
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new OAC(2, Math.ceil(total * rate), rate);
  const graph = buildGraph(ctx);
  startSustained(graph, parts[0].song, 0);
  scheduleAll(graph, signal, 0.05, Infinity, 0);
  stopSustained(graph, total - 1);
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
