// Background music for Donaghy Castle: a low drone, wind through the
// arrow slits, a lute picking out a minor tune, and a war drum that beats
// faster as the night gets more dangerous. All synthesized (Web Audio), no
// files. Each player turns it on or off for themselves; it remembers.
import { audioContext } from "./sound";

const SCALE = [146.83, 164.81, 174.61, 196.0, 220.0, 233.08, 261.63, 293.66, 329.63, 349.23]; // D minor
const KEY = "donaghy-music-v1";

let n = null;          // live audio nodes
let timer = null;
let tension = 0;
let mode = "night";    // night | hall | quiet
let enabled = true;
let nextBeat = 0, beatNo = 0, nextBell = 0, step = 3;

try { enabled = localStorage.getItem(KEY) !== "off"; } catch { /* private window */ }

function build(a) {
  const master = a.createGain(); master.gain.value = 0; master.connect(a.destination);
  // a small stone-room echo
  const echo = a.createDelay(1.0); echo.delayTime.value = 0.32;
  const fb = a.createGain(); fb.gain.value = 0.35;
  const wet = a.createGain(); wet.gain.value = 0.35;
  echo.connect(fb).connect(echo); echo.connect(wet).connect(master);

  // drone: D and A, filtered saws
  const droneF = a.createBiquadFilter(); droneF.type = "lowpass"; droneF.frequency.value = 320;
  const droneG = a.createGain(); droneG.gain.value = 0.05;
  droneF.connect(droneG).connect(master);
  const oscs = [73.42, 110, 73.6].map((f) => { const o = a.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.connect(droneF); o.start(); return o; });
  const lfo = a.createOscillator(); lfo.frequency.value = 0.07; const lfoG = a.createGain(); lfoG.gain.value = 140;
  lfo.connect(lfoG).connect(droneF.frequency); lfo.start();

  // wind
  const len = a.sampleRate * 3, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const wind = a.createBufferSource(); wind.buffer = buf; wind.loop = true;
  const windF = a.createBiquadFilter(); windF.type = "bandpass"; windF.frequency.value = 450; windF.Q.value = 0.8;
  const windG = a.createGain(); windG.gain.value = 0.025;
  wind.connect(windF).connect(windG).connect(master); wind.start();
  const wl = a.createOscillator(); wl.frequency.value = 0.11; const wlG = a.createGain(); wlG.gain.value = 260;
  wl.connect(wlG).connect(windF.frequency); wl.start();

  // high strings that swell in when it gets tense
  const strF = a.createBiquadFilter(); strF.type = "lowpass"; strF.frequency.value = 1400;
  const strG = a.createGain(); strG.gain.value = 0;
  strF.connect(strG).connect(master); strG.connect(echo);
  const str = [587.33, 698.46].map((f) => { const o = a.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.connect(strF); o.start(); return o; });
  const trem = a.createOscillator(); trem.frequency.value = 7; const tremG = a.createGain(); tremG.gain.value = 0.01;
  trem.connect(tremG).connect(strG.gain); trem.start();

  return { master, echo, droneG, windG, strG, stoppers: [...oscs, lfo, wind, wl, ...str, trem] };
}

function drum(a, at, v, low = true) {
  const o = a.createOscillator(), g = a.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(low ? 78 : 120, at);
  o.frequency.exponentialRampToValueAtTime(low ? 42 : 70, at + 0.25);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(v, at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.45);
  o.connect(g).connect(n.master);
  o.start(at); o.stop(at + 0.5);
}

function pluck(a, at, f, v = 0.06) {
  const o = a.createOscillator(), o2 = a.createOscillator(), g = a.createGain(), fl = a.createBiquadFilter();
  o.type = "triangle"; o.frequency.value = f;
  o2.type = "square"; o2.frequency.value = f * 2.002;
  fl.type = "lowpass"; fl.frequency.setValueAtTime(2400, at); fl.frequency.exponentialRampToValueAtTime(400, at + 0.6);
  const g2 = a.createGain(); g2.gain.value = 0.15;
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(v, at + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, at + 1.1);
  o.connect(fl); o2.connect(g2).connect(fl); fl.connect(g);
  g.connect(n.master); g.connect(n.echo);
  o.start(at); o2.start(at); o.stop(at + 1.2); o2.stop(at + 1.2);
}

function bell(a, at) {
  [98, 196, 293.7].forEach((f, i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.05 / (i + 1), at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 4);
    o.connect(g).connect(n.master); g.connect(n.echo);
    o.start(at); o.stop(at + 4.1);
  });
}

function tick() {
  const a = audioContext();
  if (!a || !n) return;
  const now = a.currentTime;
  if (mode !== "night") { nextBeat = now + 0.2; return; }
  const bpm = 46 + tension * 74;
  const beat = 60 / bpm;
  while (nextBeat < now + 0.35) {
    const at = Math.max(nextBeat, now + 0.02);
    const inBar = beatNo % 4;
    // a slow war drum; a heartbeat double-thump once it gets tense
    if (inBar === 0) drum(a, at, 0.18 + tension * 0.12);
    if (inBar === 2 && tension > 0.25) drum(a, at, 0.08 + tension * 0.1, false);
    if (tension > 0.55 && inBar === 0) drum(a, at + beat * 0.28, 0.1 + tension * 0.08);
    // the lute
    if (Math.random() < 0.28 + tension * 0.35) {
      step = Math.max(0, Math.min(SCALE.length - 1, step + [-2, -1, -1, 1, 1, 2, 0][Math.floor(Math.random() * 7)]));
      pluck(a, at, SCALE[step] * (inBar === 0 && Math.random() < 0.3 ? 0.5 : 1));
    }
    nextBeat += beat;
    beatNo++;
  }
  if (now > nextBell) { if (nextBell) bell(a, now + 0.1); nextBell = now + 40 + Math.random() * 30; }
  // strings and drone follow the tension
  n.strG.gain.setTargetAtTime(tension > 0.45 ? (tension - 0.45) * 0.05 : 0, now, 1.5);
  n.droneG.gain.setTargetAtTime(0.04 + tension * 0.03, now, 2);
}

function level() {
  return !enabled ? 0 : mode === "quiet" ? 0 : mode === "hall" ? 0.55 : 0.9;
}

export const castleMusic = {
  isEnabled() { return enabled; },
  setEnabled(on) {
    enabled = on;
    try { localStorage.setItem(KEY, on ? "on" : "off"); } catch { /* private window */ }
    if (on) this.start();
    const a = audioContext();
    if (a && n) n.master.gain.setTargetAtTime(level(), a.currentTime, 0.6);
  },
  start() {
    if (!enabled) return;
    const a = audioContext();
    if (!a) return;
    if (!n) {
      n = build(a);
      nextBeat = a.currentTime + 0.5;
      timer = setInterval(tick, 100);
    }
    n.master.gain.setTargetAtTime(level(), a.currentTime, 1.2);
  },
  setTension(x) { tension = Math.max(0, Math.min(1, x || 0)); },
  setMode(m) {
    mode = m;
    const a = audioContext();
    if (a && n) n.master.gain.setTargetAtTime(level(), a.currentTime, 0.8);
  },
  stop() {
    const a = audioContext();
    if (!n || !a) return;
    const old = n;
    n = null;
    clearInterval(timer); timer = null;
    old.master.gain.setTargetAtTime(0, a.currentTime, 0.4);
    setTimeout(() => { old.stoppers.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } }); old.master.disconnect(); }, 2000);
  },
};
