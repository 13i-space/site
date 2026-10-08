// Signal Composer v2 (Update 5.65): the engine behind the Alien DJ
// controller. Two decks, each with its own clock (so you can beatmatch by
// ear, or press SYNC), a two-channel mixer in the style of a DJ controller,
// effects, a sampler, and a recorder for your whole set.
//
// Signal flow, per deck:
//   voices -> part gains -> TRIM -> LOW/MID/HI -> FILTER (one knob: low-pass
//   left, high-pass right) -> CHANNEL FADER -> fx strip (echo, reverb,
//   flanger, crush) -> CROSSFADER -> master fx strip -> MASTER -> limiter -> out
//
// Nothing here is React; the UI (components/AlienDeck.js) calls methods and
// reads state each frame.

import { playKick, playSnare, playHat, playPerc, playBass, playLead, playPad, playSignal, playSample, playChant, makeScratch, noise } from "./sounds";
import { noteHz, chordDegrees, STEPS, sanitizeTrack } from "./tracks";

const LOOK = 0.12;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// a gentle ceiling after the limiter: transparent at normal levels, rounds
// off anything that would clip
function softClip(ctx) {
  const ws = ctx.createWaveShaper(); const n = 2048, c = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = Math.abs(x) < 0.6 ? x : Math.sign(x) * (0.6 + 0.4 * Math.tanh((Math.abs(x) - 0.6) / 0.4)); }
  ws.curve = c; return ws;
}

function impulse(ctx, seconds = 2.6) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8); }
  return ir;
}

// an effects strip: dry through, plus echo / reverb / flanger / crush that
// can be faded in. Sends (not wets) are switched, so tails ring out.
class FxStrip {
  constructor(ctx, ir) {
    this.ctx = ctx;
    this.input = ctx.createGain(); this.output = ctx.createGain();
    this.dry = ctx.createGain(); this.input.connect(this.dry); this.dry.connect(this.output);
    // echo
    this.echoSend = ctx.createGain(); this.echoSend.gain.value = 0;
    this.delay = ctx.createDelay(4); this.delay.delayTime.value = 0.25;
    this.fb = ctx.createGain(); this.fb.gain.value = 0.45;
    const tone = ctx.createBiquadFilter(); tone.type = "lowpass"; tone.frequency.value = 4500;
    this.input.connect(this.echoSend); this.echoSend.connect(this.delay); this.delay.connect(tone); tone.connect(this.fb); this.fb.connect(this.delay); tone.connect(this.output);
    // reverb
    this.revSend = ctx.createGain(); this.revSend.gain.value = 0;
    const conv = ctx.createConvolver(); conv.buffer = ir;
    this.input.connect(this.revSend); this.revSend.connect(conv); conv.connect(this.output);
    // flanger
    this.flWet = ctx.createGain(); this.flWet.gain.value = 0;
    const fd = ctx.createDelay(0.05); fd.delayTime.value = 0.004;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.25; const lg = ctx.createGain(); lg.gain.value = 0.0032; lfo.connect(lg); lg.connect(fd.delayTime); lfo.start();
    const ffb = ctx.createGain(); ffb.gain.value = 0.6; fd.connect(ffb); ffb.connect(fd);
    this.input.connect(fd); fd.connect(this.flWet); this.flWet.connect(this.output);
    this.flLfo = lfo;
    // crush: a stepped transfer curve (the signal, badly received)
    this.crWet = ctx.createGain(); this.crWet.gain.value = 0;
    const ws = ctx.createWaveShaper(); const n = 4096, c = new Float32Array(n), steps = 7;
    for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = Math.round(x * steps) / steps; }
    ws.curve = c;
    const crLp = ctx.createBiquadFilter(); crLp.type = "lowpass"; crLp.frequency.value = 3200;
    this.input.connect(ws); ws.connect(crLp); crLp.connect(this.crWet); this.crWet.connect(this.output);
    this.state = {};
  }
  set(effect, amount, beatSec = 0.5) {
    const t = this.ctx.currentTime, a = clamp(amount, 0, 1);
    this.state[effect] = a;
    if (effect === "echo") { this.delay.delayTime.setTargetAtTime(clamp(beatSec, 0.03, 3.9), t, 0.01); this.echoSend.gain.setTargetAtTime(a * 0.9, t, 0.01); this.fb.gain.setTargetAtTime(0.35 + a * 0.3, t, 0.05); }
    if (effect === "reverb") this.revSend.gain.setTargetAtTime(a * 1.2, t, 0.02);
    if (effect === "flanger") { this.flWet.gain.setTargetAtTime(a * 0.8, t, 0.02); this.flLfo.frequency.setTargetAtTime(1 / Math.max(0.25, beatSec * 4), t, 0.05); }
    if (effect === "crush") { this.crWet.gain.setTargetAtTime(a, t, 0.01); this.dry.gain.setTargetAtTime(1 - a * 0.9, t, 0.01); }
  }
}

class Channel {
  constructor(ctx, out, ir) {
    this.ctx = ctx;
    this.input = ctx.createGain();
    this.parts = {};
    ["kick", "snare", "hat", "perc", "bass", "lead", "pad", "signal"].forEach((p) => { const g = ctx.createGain(); g.connect(this.input); this.parts[p] = g; });
    this.duck = ctx.createGain(); // scratch / brake mute
    this.trim = ctx.createGain();
    this.low = ctx.createBiquadFilter(); this.low.type = "lowshelf"; this.low.frequency.value = 180;
    this.mid = ctx.createBiquadFilter(); this.mid.type = "peaking"; this.mid.frequency.value = 1100; this.mid.Q.value = 0.8;
    this.hi = ctx.createBiquadFilter(); this.hi.type = "highshelf"; this.hi.frequency.value = 5200;
    this.hp = ctx.createBiquadFilter(); this.hp.type = "highpass"; this.hp.frequency.value = 10;
    this.lp = ctx.createBiquadFilter(); this.lp.type = "lowpass"; this.lp.frequency.value = 22000;
    this.fader = ctx.createGain();
    this.strip = new FxStrip(ctx, ir);
    this.xf = ctx.createGain();
    this.meter = ctx.createAnalyser(); this.meter.fftSize = 512;
    this.input.connect(this.duck); this.duck.connect(this.trim); this.trim.connect(this.low); this.low.connect(this.mid); this.mid.connect(this.hi);
    this.hi.connect(this.hp); this.hp.connect(this.lp); this.lp.connect(this.fader); this.fader.connect(this.strip.input);
    this.strip.output.connect(this.xf); this.xf.connect(out); this.fader.connect(this.meter);
    this.filterVal = 0; this.sweep = null;
  }
  eq(band, v) { // v -1..1 (full left is a kill)
    const db = v < 0 ? v * (v < -0.97 ? 40 : 24) : v * 9;
    this[band].gain.setTargetAtTime(db, this.ctx.currentTime, 0.02);
  }
  filter(v) { // -1 low-pass .. 0 off .. +1 high-pass
    this.filterVal = v;
    if (this.sweep) return;
    this.applyFilter(v);
  }
  applyFilter(v, tc = 0.02) {
    const t = this.ctx.currentTime;
    const lpF = v < -0.02 ? 20000 * Math.pow(0.006, -v) : 22000;
    const hpF = v > 0.02 ? 12 * Math.pow(400, v) : 10;
    const q = 0.7 + Math.abs(v) * 4;
    this.lp.frequency.setTargetAtTime(lpF, t, tc); this.lp.Q.setTargetAtTime(v < -0.02 ? q : 0.7, t, tc);
    this.hp.frequency.setTargetAtTime(hpF, t, tc); this.hp.Q.setTargetAtTime(v > 0.02 ? q : 0.7, t, tc);
  }
}

function newDeck(id) {
  return {
    id, track: null, playing: false, bpm: 124, pitch: 0, sync: false, next: 0, slip: 0, pos: 0, queue: [], angle: 0,
    loop: null, roll: null, jump: null, half: false, doubleHats: false, lift: 0, brake: 0, dropUntil: null, lowCut: false,
  };
}

export class DeckEngine {
  constructor() {
    this.ctx = null;
    this.decks = { A: newDeck("A"), B: newDeck("B") };
    this.xfader = 0.5; this.master = 0.85; this.listeners = new Set();
    this.events = []; // things the crowd reacts to: { type, at }
  }
  on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit(type, data = {}) { this.events.push({ type, at: performance.now(), ...data }); if (this.events.length > 40) this.events.shift(); this.listeners.forEach((f) => f(type, data)); }

  init() {
    if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return this.ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC({ latencyHint: "interactive" });
    this.ctx = ctx;
    const ir = impulse(ctx);
    this.masterIn = ctx.createGain();
    this.masterStrip = new FxStrip(ctx, ir);
    this.masterGain = ctx.createGain(); this.masterGain.gain.value = this.master;
    this.limiter = ctx.createDynamicsCompressor(); this.limiter.threshold.value = -6; this.limiter.ratio.value = 12; this.limiter.attack.value = 0.003; this.limiter.release.value = 0.15;
    this.analyser = ctx.createAnalyser(); this.analyser.fftSize = 2048;
    this.masterIn.connect(this.masterStrip.input); this.masterStrip.output.connect(this.masterGain);
    this.ceiling = softClip(ctx);
    this.masterGain.connect(this.limiter); this.limiter.connect(this.ceiling); this.ceiling.connect(this.analyser); this.analyser.connect(ctx.destination);
    this.sampler = ctx.createGain(); this.sampler.gain.value = 0.9; this.sampler.connect(this.masterIn);
    this.ch = { A: new Channel(ctx, this.masterIn, ir), B: new Channel(ctx, this.masterIn, ir) };
    this.applyXfader();
    Object.values(this.decks).forEach((d) => d.track && this.applyTrackMix(d.id));
    this.timer = setInterval(() => this.tick(), 25);
    return ctx;
  }
  dispose() { clearInterval(this.timer); try { this.ctx && this.ctx.close(); } catch (e) { /* ignore */ } this.ctx = null; }

  // ─── tracks ───
  load(id, track) {
    const d = this.decks[id];
    d.track = sanitizeTrack(track);
    if (!d.playing || !d.sync) d.bpm = d.track.bpm * (1 + d.pitch * 0.08);
    if (d.sync) this.followSync(id);
    if (!d.playing) { d.slip = 0; d.pos = 0; }
    if (this.ctx) this.applyTrackMix(id);
    this.emit("load", { id });
  }
  setTrack(id, track) { // edits from the Studio: no reset
    const d = this.decks[id];
    const bpmChanged = d.track && d.track.bpm !== track.bpm;
    d.track = track;
    if (bpmChanged && !d.sync) d.bpm = track.bpm * (1 + d.pitch * 0.08);
    if (this.ctx) this.applyTrackMix(id);
  }
  applyTrackMix(id) {
    const tr = this.decks[id].track, ch = this.ch[id];
    if (!tr) return;
    const t = this.ctx.currentTime;
    Object.entries(ch.parts).forEach(([p, g]) => {
      const part = tr.parts[p];
      const cut = this.decks[id].lowCut && (p === "kick" || p === "bass");
      g.gain.setTargetAtTime(part && !part.mute && !cut ? part.vol : 0, t, 0.02);
    });
  }

  // ─── the clock ───
  tick() {
    const ctx = this.ctx; if (!ctx) return;
    const now = ctx.currentTime;
    Object.values(this.decks).forEach((d) => {
      if (!d.playing || !d.track) return;
      if (d.next < now - 0.2) d.next = now + 0.02; // tab was asleep
      while (d.next < now + LOOK) {
        const stepDur = 60 / d.bpm / 4;
        // where the playhead really is (slip), and what plays (pos)
        if (d.jump !== null && d.slip % 4 === 0) { d.slip = d.jump; d.jump = null; }
        if (d.loop) { if (d.slip >= d.loop.start + d.loop.len || d.slip < d.loop.start) d.slip = d.loop.start + ((d.slip - d.loop.start) % d.loop.len + d.loop.len) % d.loop.len; }
        d.pos = d.roll ? d.roll.start + ((d.slip - d.roll.anchor) % d.roll.len + d.roll.len) % d.roll.len : d.slip;
        const swing = d.pos % 2 === 1 ? d.track.swing * stepDur : 0;
        if (d.dropUntil !== null && d.slip % 16 === 0 && d.slip !== d.dropFrom) {
          if (--d.dropBars <= 0) { d.dropUntil = null; d.lowCut = false; this.applyTrackMix(d.id); this.ch[d.id].sweep = null; this.ch[d.id].applyFilter(this.ch[d.id].filterVal, 0.01); playSample(ctx, this.sampler, d.next, "Impact", d.bpm); this.emit("drop", { id: d.id, at: d.next }); }
        }
        if (d.brake <= 0) this.playStep(d, d.pos, d.next + swing, stepDur);
        d.queue.push({ pos: d.pos, t: d.next });
        if (d.queue.length > 64) d.queue.shift();
        d.next += stepDur;
        d.slip = (d.slip + 1) % STEPS;
      }
    });
  }

  playStep(d, pos, t, stepDur) {
    const ctx = this.ctx, ch = this.ch[d.id], tr = d.track, P = tr.parts;
    const step = ((pos % STEPS) + STEPS) % STEPS, bar = Math.floor(step / 16);
    const lift = (o) => o + (d.lift ? 3 : 0);
    const dp = d.half ? (Math.floor(step / 32) * 32 + Math.floor((step % 32) / 2)) : step; // half-time drums
    if (P.kick.steps[dp] && (!d.half || step % 2 === 0)) playKick(ctx, ch.parts.kick, t, P.kick.sound);
    if (P.snare.steps[dp] && (!d.half || step % 2 === 0)) playSnare(ctx, ch.parts.snare, t, P.snare.sound);
    const h = d.doubleHats ? (P.hat.steps[step] || 1) : P.hat.steps[dp] && (!d.half || step % 2 === 0) ? P.hat.steps[dp] : 0;
    if (h) playHat(ctx, ch.parts.hat, t, P.hat.sound, h === 2);
    if (P.perc.steps[dp] && (!d.half || step % 2 === 0)) playPerc(ctx, ch.parts.perc, t, P.perc.sound, 1, 1 + (step % 3) * 0.12);
    const b = P.bass.notes[step];
    if (b) playBass(ctx, ch.parts.bass, t, P.bass.sound, noteHz(tr, lift(b.d), 2), b.len * stepDur * 0.95, { cutoff: P.bass.cutoff, bpm: d.bpm });
    const l = P.lead.notes[step];
    if (l) playLead(ctx, ch.parts.lead, t, P.lead.sound, noteHz(tr, lift(l.d), 4), l.len * stepDur * 0.9, { cutoff: P.lead.cutoff });
    if (step % 16 === 0 && !P.pad.mute) playPad(ctx, ch.parts.pad, t, P.pad.sound, chordDegrees(tr, bar).slice(0, 3).map((x) => noteHz(tr, lift(x), 3)), stepDur * 16);
    if (P.signal.steps[step]) playSignal(ctx, ch.parts.signal, t, chordDegrees(tr, bar).map((x) => noteHz(tr, x, 3)), stepDur);
  }

  // ─── transport ───
  other(id) { return this.decks[id === "A" ? "B" : "A"]; }
  isMaster(id) { const d = this.decks[id], o = this.other(id); return d.playing && (!o.playing || !d.sync); }
  play(id) {
    if (!this.init()) return;
    const d = this.decks[id], o = this.other(id);
    if (!d.track) return;
    if (d.playing) { d.playing = false; this.emit("pause", { id }); return; }
    const now = this.ctx.currentTime;
    if (d.sync && o.playing) this.followSync(id, true);
    else { d.next = now + 0.05; }
    d.playing = true;
    this.emit("play", { id });
  }
  cue(id) { // back to the top of the current bar, stopped
    const d = this.decks[id];
    d.playing = false; d.slip = Math.floor(d.slip / 16) * 16; d.pos = d.slip; d.loop = null; d.roll = null;
    this.emit("cue", { id });
  }
  setPitch(id, p) {
    const d = this.decks[id];
    d.pitch = clamp(p, -1, 1);
    if (d.sync && this.other(id).playing) return; // synced decks follow the master
    d.bpm = (d.track?.bpm || 124) * (1 + d.pitch * 0.08);
    const o = this.other(id);
    if (o.sync) o.bpm = d.bpm;
  }
  toggleSync(id) {
    const d = this.decks[id];
    d.sync = !d.sync;
    if (d.sync) this.followSync(id, d.playing);
    this.emit("sync", { id, on: d.sync });
  }
  followSync(id, phase = false) {
    const d = this.decks[id], o = this.other(id);
    if (!o.track) return;
    d.bpm = o.playing ? o.bpm : (o.track.bpm * (1 + o.pitch * 0.08));
    if (phase && o.playing && this.ctx) {
      // lock to the other deck's grid: same place in the bar, same next step
      d.next = o.next;
      d.slip = Math.floor(d.slip / 16) * 16 + (o.slip % 16);
    }
  }
  nudge(id, seconds) { const d = this.decks[id]; if (d.playing) d.next += clamp(seconds, -0.03, 0.03); }
  masterBpm() { const a = this.decks.A, b = this.decks.B; return a.playing && !(b.playing && a.sync) ? a.bpm : b.playing ? b.bpm : a.bpm; }

  // ─── loops, jumps, rolls ───
  loopToggle(id, beats = 4) {
    const d = this.decks[id];
    if (d.loop) { d.loop = null; return null; }
    const len = Math.round(beats * 4);
    d.loop = { start: Math.floor(d.slip / 4) * 4, len };
    return d.loop;
  }
  loopResize(id, k) {
    const d = this.decks[id];
    if (!d.loop) return this.loopToggle(id, k > 1 ? 8 : 2);
    d.loop.len = clamp(Math.round(d.loop.len * k), 1, 64);
    return d.loop;
  }
  jumpTo(id, bar) { const d = this.decks[id]; if (!d.playing) { d.slip = bar * 16; d.pos = d.slip; } else d.jump = bar * 16; this.emit("jump", { id }); }
  rollOn(id, steps) { const d = this.decks[id]; d.roll = { start: Math.floor(d.slip / steps) * steps, len: steps, anchor: d.slip }; }
  rollOff(id) { this.decks[id].roll = null; }

  // ─── the mixer ───
  setTrim(id, v) { this.init(); this.ch[id].trim.gain.setTargetAtTime(Math.pow(10, (v * 12) / 20), this.ctx.currentTime, 0.02); }
  setEq(id, band, v) { this.init(); this.ch[id].eq(band, v); }
  setFilter(id, v) { this.init(); this.ch[id].filter(v); }
  setFader(id, v) { this.init(); this.ch[id].fader.gain.setTargetAtTime(v * v, this.ctx.currentTime, 0.015); }
  setXfader(v) {
    const prev = this.xfader; this.xfader = clamp(v, 0, 1);
    if (this.ctx) this.applyXfader();
    // a transition: across the middle with both decks playing in time
    const a = this.decks.A, b = this.decks.B;
    if ((prev - 0.5) * (this.xfader - 0.5) < 0 && a.playing && b.playing && Math.abs(a.bpm - b.bpm) < 1.5) this.emit("transition", { to: this.xfader > 0.5 ? "B" : "A" });
  }
  applyXfader() {
    const x = this.xfader, t = this.ctx.currentTime;
    this.ch.A.xf.gain.setTargetAtTime(Math.cos(x * Math.PI / 2), t, 0.01);
    this.ch.B.xf.gain.setTargetAtTime(Math.sin(x * Math.PI / 2), t, 0.01);
  }
  setMaster(v) { this.master = v; if (this.ctx) this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02); }
  level(id) { // 0..1 RMS for the meters
    if (!this.ctx) return 0;
    const an = id === "M" ? this.analyser : this.ch[id].meter;
    const buf = this.levelBuf || (this.levelBuf = new Float32Array(2048));
    const n = an.fftSize; an.getFloatTimeDomainData(buf.subarray(0, n));
    let s = 0; for (let i = 0; i < n; i++) s += buf[i] * buf[i];
    return Math.min(1, Math.sqrt(s / n) * 2.4);
  }

  // ─── effects ───
  strip(target) { return target === "M" ? this.masterStrip : this.ch[target].strip; }
  beatFx(target, effect, amount, beats) {
    this.init();
    const beatSec = (60 / this.masterBpm()) * beats;
    const s = this.strip(target);
    if (effect === "spiral") { s.set("echo", amount * 0.9, beatSec); s.set("reverb", amount * 0.8, beatSec); }
    else s.set(effect, amount, beatSec);
    if (amount > 0) this.emit("fx", { target, effect });
  }
  beatFxOff(target) { const s = this.strip(target); ["echo", "reverb", "flanger", "crush"].forEach((e) => s.set(e, 0)); }
  // momentary pad effects on one deck
  padFx(id, name, on) {
    this.init();
    const d = this.decks[id], ch = this.ch[id], beat = 60 / d.bpm, t = this.ctx.currentTime;
    const s = ch.strip;
    if (name === "Echo ½") s.set("echo", on ? 0.85 : 0, beat / 2);
    if (name === "Echo ¾") s.set("echo", on ? 0.85 : 0, beat * 0.75);
    if (name === "Transmit") s.set("crush", on ? 1 : 0);
    if (name === "Flanger") s.set("flanger", on ? 1 : 0, beat);
    if (name === "Wash") { s.set("reverb", on ? 1 : 0); s.set("echo", on ? 0.5 : 0, beat); }
    if (name === "Sweep ↓" || name === "Sweep ↑") {
      if (on) {
        ch.sweep = name;
        const tgt = name === "Sweep ↓" ? -0.92 : 0.85;
        const from = ch.filterVal, start = performance.now(), dur = beat * 4 * 1000;
        const step = () => { if (ch.sweep !== name) return; const k = Math.min(1, (performance.now() - start) / dur); ch.applyFilter(from + (tgt - from) * k, 0.03); if (k < 1) requestAnimationFrame(step); };
        step();
      } else { ch.sweep = null; ch.applyFilter(ch.filterVal, 0.08); }
    }
    if (name === "Gravity") {
      if (on) {
        // the brake: everything sinks for a beat and stops
        d.brake = 1; ch.duck.gain.setTargetAtTime(0.0001, t + beat * 0.6, beat * 0.25);
        ch.lp.frequency.setTargetAtTime(60, t, beat * 0.3);
      } else {
        d.brake = 0; ch.duck.gain.setTargetAtTime(1, t, 0.01); ch.applyFilter(ch.filterVal, 0.01);
        const o = this.other(id);
        if (o.playing) { d.next = o.next; d.slip = Math.floor(d.slip / 16) * 16 + (o.slip % 16); }
        this.emit("slam", { id });
      }
    }
    if (on) this.emit("fx", { target: id, effect: name });
  }

  // ─── the Alien pads ───
  alien(id, name) {
    this.init();
    const d = this.decks[id];
    if (name === "Half-time") d.half = !d.half;
    if (name === "Hats ×2") d.doubleHats = !d.doubleHats;
    if (name === "Lift") d.lift = d.lift ? 0 : 1;
    if (name === "Drop") {
      // a bar of build - no kick, no bass, the filter rising, a riser - then the drop on the next bar
      d.lowCut = true; this.applyTrackMix(id);
      d.dropFrom = Math.floor(d.slip / 16) * 16; d.dropUntil = true; d.dropBars = 2;
      const ch = this.ch[id]; ch.sweep = "drop";
      const beat = 60 / d.bpm, start = performance.now(), dur = beat * 7 * 1000;
      const step = () => { if (ch.sweep !== "drop") return; const k = Math.min(1, (performance.now() - start) / dur); ch.applyFilter(k * 0.55, 0.05); if (k < 1) requestAnimationFrame(step); };
      step();
      playSample(this.ctx, this.sampler, this.ctx.currentTime + 0.02, "Riser", d.bpm, noteHz(d.track, 0, 2));
      this.emit("build", { id });
    }
    if (name === "Chant") { playChant(this.ctx, this.sampler, this.nextBeat(id), d.bpm); this.emit("chant", { id }); }
    if (name === "Summon") { playSample(this.ctx, this.sampler, this.ctx.currentTime + 0.02, "13i", d.bpm); this.emit("summon", { id }); }
    this.emit("alien", { id, name });
    return { half: d.half, doubleHats: d.doubleHats, lift: d.lift };
  }
  nextBeat(id) {
    const d = this.decks[id];
    if (!d.playing || !this.ctx) return this.ctx ? this.ctx.currentTime + 0.02 : 0;
    const stepDur = 60 / d.bpm / 4;
    return d.next + ((4 - (d.slip % 4)) % 4) * stepDur;
  }
  sample(name) {
    if (!this.init()) return;
    const id = this.decks.A.playing ? "A" : "B";
    const tr = this.decks[id].track;
    playSample(this.ctx, this.sampler, this.ctx.currentTime + 0.01, name, this.masterBpm(), tr ? noteHz(tr, 0, 2) : 110);
    this.emit("sample", { name });
  }

  // ─── the turntable under your hand ───
  scratchStart(id) { if (!this.init()) return; const ch = this.ch[id]; ch.duck.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.005); this.scr = this.scr || {}; this.scr[id] = makeScratch(this.ctx, ch.trim); }
  scratchMove(id, speed) { this.scr?.[id]?.move(speed); }
  scratchEnd(id) { if (!this.ctx) return; this.scr?.[id]?.stop(); if (this.scr) this.scr[id] = null; this.ch[id].duck.gain.setTargetAtTime(1, this.ctx.currentTime, 0.01); this.emit("scratch", { id }); }

  // where each deck is, for the UI
  position(id) {
    const d = this.decks[id];
    if (!this.ctx || !d.playing) return { pos: d.pos, frac: 0 };
    const now = this.ctx.currentTime;
    let cur = null;
    for (let i = d.queue.length - 1; i >= 0; i--) if (d.queue[i].t <= now) { cur = d.queue[i]; break; }
    if (!cur) return { pos: d.pos, frac: 0 };
    const stepDur = 60 / d.bpm / 4;
    return { pos: cur.pos, frac: clamp((now - cur.t) / stepDur, 0, 1) };
  }
  beatPhase() { // 0..1 within the beat of whichever deck leads
    const id = this.decks.A.playing ? (this.decks.B.playing && this.xfader > 0.5 ? "B" : "A") : "B";
    const { pos, frac } = this.position(id);
    return this.decks[id].playing ? ((pos % 4) + frac) / 4 : 0;
  }

  // ─── record the whole set ───
  recordStart() {
    if (!this.init() || typeof MediaRecorder === "undefined") return false;
    const dest = this.ctx.createMediaStreamDestination();
    this.ceiling.connect(dest);
    const type = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"].find((m) => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(dest.stream, type ? { mimeType: type, audioBitsPerSecond: 192000 } : undefined);
    this.chunks = []; rec.ondataavailable = (e) => e.data.size && this.chunks.push(e.data);
    rec.start(1000); this.rec = { rec, dest, type: type || "audio/webm", started: Date.now() };
    return true;
  }
  recordStop() {
    return new Promise((resolve) => {
      const r = this.rec; if (!r) return resolve(null);
      r.rec.onstop = () => { try { this.ceiling.disconnect(r.dest); } catch (e) { /* ignore */ } this.rec = null; resolve(new Blob(this.chunks, { type: r.type })); };
      r.rec.stop();
    });
  }
}

// Render one track (its four bars, twice) to a WAV file, offline.
export async function renderTrackWav(track, loops = 2) {
  const tr = sanitizeTrack(track);
  const stepDur = 60 / tr.bpm / 4;
  const total = STEPS * loops;
  const seconds = total * stepDur + 3;
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new OAC(2, Math.ceil(seconds * 44100), 44100);
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -10; comp.ratio.value = 8;
  const trim = ctx.createGain(); trim.gain.value = 0.75; const ceil = softClip(ctx);
  comp.connect(trim); trim.connect(ceil); ceil.connect(ctx.destination);
  const conv = ctx.createConvolver(); conv.buffer = impulse(ctx); const rg = ctx.createGain(); rg.gain.value = 0.12; conv.connect(rg); rg.connect(comp);
  const parts = {};
  ["kick", "snare", "hat", "perc", "bass", "lead", "pad", "signal"].forEach((p) => { const g = ctx.createGain(); g.gain.value = tr.parts[p].mute ? 0 : tr.parts[p].vol; g.connect(comp); if (p === "pad" || p === "lead" || p === "signal") g.connect(conv); parts[p] = g; });
  const fake = { id: "X", track: tr, bpm: tr.bpm, half: false, doubleHats: false, lift: 0 };
  const eng = Object.create(DeckEngine.prototype);
  eng.ctx = ctx; eng.ch = { X: { parts } };
  for (let i = 0; i < total; i++) eng.playStep(fake, i % STEPS, 0.05 + i * stepDur + (i % 2 ? tr.swing * stepDur : 0), stepDur);
  const buf = await ctx.startRendering();
  return encodeWav(buf);
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
  for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) { const v = Math.max(-1, Math.min(1, chans[c][i])); data.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2; }
  return new Blob([data], { type: "audio/wav" });
}

export { noise };
