// Signal Composer v2 (Update 5.65): tracks. A track is plain data - four
// bars of sixteen steps (64), looping - that a deck plays and the Studio
// edits:
//
//   { name, style, bpm, root (0-11), scale, tuning ("earth" | "xeno"),
//     swing (0..0.5), prog: [4 scale degrees, one chord per bar],
//     parts: {
//       kick, snare, perc: { sound, vol, mute, steps: [64 bool] }
//       hat:   { sound, vol, mute, steps: [64: 0 off, 1 closed, 2 open] }
//       bass, lead: { sound, vol, mute, cutoff, notes: [64: null | { d, len }] }
//          (d = scale degree from the root, can be negative; len in steps)
//       pad:    { sound, vol, mute }   (plays the bar's chord)
//       signal: { vol, mute, steps: [64 bool] } (transmission bleeps)
//   } }
//
// "xeno" tuning is 13i's own: the Bohlen-Pierce scale, thirteen steps to
// the tritave (3:1) instead of twelve to the octave - the same 13th root of
// 3 the Lab's sounds use (lib/alienSound.js). Real, and properly alien.

import { DRUM_SOUNDS, SYNTH_SOUNDS, midiHz } from "./sounds";
import { makeRng } from "../musicEngine";

export const SCALES = {
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  major: [0, 2, 4, 5, 7, 9, 11],
  "harmonic minor": [0, 2, 3, 5, 7, 8, 11],
  pentatonic: [0, 3, 5, 7, 10],
};
export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const LAMBDA = [0, 1, 3, 4, 6, 7, 9, 10, 12]; // Bohlen-Pierce lambda mode
export const STEPS = 64;
export const PARTS = ["kick", "snare", "hat", "perc", "bass", "lead", "pad", "signal"];

export const STYLES = {
  house: { label: "Signal House", bpm: [122, 126], scales: ["minor", "dorian"], sounds: { kick: "Punch", snare: "Clap", hat: "Crisp", perc: "Cowbell", bass: "Saw", lead: "Pluck", pad: "Super" } },
  techno: { label: "Nebula Techno", bpm: [128, 134], scales: ["phrygian", "minor"], sounds: { kick: "Deep", snare: "Zap", hat: "Metal", perc: "Tom", bass: "Sub", lead: "Chip", pad: "Dark" } },
  trance: { label: "Orbit Trance", bpm: [136, 140], scales: ["minor", "harmonic minor"], sounds: { kick: "Punch", snare: "Clap", hat: "Crisp", perc: "Drop", bass: "Saw", lead: "Saw", pad: "Super" } },
  bass: { label: "Gravity Bass", bpm: [140, 140], scales: ["minor", "phrygian"], sounds: { kick: "Gravity", snare: "Snare", hat: "Dust", perc: "Click", bass: "Wobble", lead: "Bell", pad: "Dark" } },
  breaks: { label: "Xeno Breaks", bpm: [126, 132], scales: ["dorian", "minor"], sounds: { kick: "Thump", snare: "Snare", hat: "Metal", perc: "Drop", bass: "Acid", lead: "Chip", pad: "Glass" } },
  drift: { label: "Drift", bpm: [84, 96], scales: ["lydian", "major", "pentatonic"], sounds: { kick: "Deep", snare: "Rim", hat: "Dust", perc: "Drop", bass: "Sub", lead: "Bell", pad: "Glass" } },
  signal: { label: "13i Signal", bpm: [96, 108], scales: ["minor", "dorian"], sounds: { kick: "Deep", snare: "Snare", hat: "Crisp", perc: "Click", bass: "Reese", lead: "Flute", pad: "Choir" } },
};

const PROGS = [[0, 5, 3, 4], [0, 3, 4, 3], [0, 6, 5, 4], [0, 2, 5, 4], [0, 5, 2, 6], [0, 4, 5, 3], [0, 0, 5, 6], [0, 3, 0, 4]];
const WORDS_A = ["Signal", "Orbit", "Velani", "Holder", "Deep", "Glass", "Red Dwarf", "Quiet Moon", "Returner", "Nerath", "Lattice", "Continuance", "Apogee", "Periastron", "Second Sun", "Gravity"];
const WORDS_B = ["Run", "Protocol", "Bloom", "Static", "Garden", "Engine", "Choir", "Tide", "Dance", "Drift", "Transmission", "Crossing", "Pulse", "Machine", "Ritual", "Rise"];

const empty = (v) => Array.from({ length: STEPS }, () => v);

// the frequency of a scale degree (octave: 0-based register, 2 = bass, 4 = lead)
export function noteHz(track, d, octave = 3) {
  if (track.tuning === "xeno") {
    const base = midiHz(12 * (octave + 1) + track.root) / (octave >= 4 ? 2 : 1);
    const tri = Math.floor(d / LAMBDA.length), k = ((d % LAMBDA.length) + LAMBDA.length) % LAMBDA.length;
    return base * Math.pow(3, (LAMBDA[k] + 13 * tri) / 13);
  }
  const sc = SCALES[track.scale] || SCALES.minor;
  const oct = Math.floor(d / sc.length), k = ((d % sc.length) + sc.length) % sc.length;
  return midiHz(12 * (octave + 1) + track.root + sc[k] + 12 * oct);
}
export function chordDegrees(track, bar) {
  const deg = track.prog[bar % 4];
  return [deg, deg + 2, deg + 4, deg + 6];
}
export function noteName(track, d) {
  if (track.tuning === "xeno") return `⟡${((d % 9) + 9) % 9}`;
  const sc = SCALES[track.scale] || SCALES.minor;
  const k = ((d % sc.length) + sc.length) % sc.length;
  return NOTE_NAMES[(track.root + sc[k]) % 12];
}
export function chordName(track, bar) {
  if (track.tuning === "xeno") return `⟡${track.prog[bar]}`;
  const sc = SCALES[track.scale] || SCALES.minor;
  const deg = track.prog[bar];
  const pc = (k) => sc[((deg + k) % sc.length + sc.length) % sc.length] + 12 * Math.floor((deg + k) / sc.length);
  const third = pc(2) - pc(0), fifth = pc(4) - pc(0);
  return NOTE_NAMES[(track.root + pc(0)) % 12] + (third === 3 ? (fifth === 6 ? "dim" : "m") : "");
}

export function generateTrack(styleKey = "house", seed = (Math.random() * 1e9) | 0, over = {}) {
  const style = STYLES[styleKey] || STYLES.house;
  const r = makeRng(seed);
  const pick = (a) => a[Math.floor(r() * a.length)];
  const prog = pick(PROGS);
  const bpm = Math.round(style.bpm[0] + r() * (style.bpm[1] - style.bpm[0]));
  const parts = {
    kick: { sound: style.sounds.kick, vol: 0.9, mute: false, steps: empty(false) },
    snare: { sound: style.sounds.snare, vol: 0.7, mute: false, steps: empty(false) },
    hat: { sound: style.sounds.hat, vol: 0.55, mute: false, steps: empty(0) },
    perc: { sound: style.sounds.perc, vol: 0.5, mute: false, steps: empty(false) },
    bass: { sound: style.sounds.bass, vol: 0.75, mute: false, cutoff: 0.5, notes: empty(null) },
    lead: { sound: style.sounds.lead, vol: 0.55, mute: false, cutoff: 0.6, notes: empty(null) },
    pad: { sound: style.sounds.pad, vol: 0.5, mute: false },
    signal: { vol: 0.4, mute: false, steps: empty(false) },
  };
  const P = parts;
  const lead = Array.from({ length: 16 }, () => r());
  const leadRhythm = pick([[0, 3, 6, 8, 11, 14], [0, 2, 4, 6, 8, 10, 12, 14], [0, 3, 6, 10, 12], [2, 6, 10, 14], [0, 1, 3, 4, 6, 8, 9, 11, 12, 14]]);
  for (let bar = 0; bar < 4; bar++) {
    const o = bar * 16, ch = [prog[bar], prog[bar] + 2, prog[bar] + 4, prog[bar] + 7];
    const at = (part, steps, v = true) => steps.forEach((s) => { part.steps[o + s] = v; });
    const note = (part, s, d, len = 1) => { part.notes[o + s] = { d, len }; };
    switch (styleKey) {
      case "techno":
        at(P.kick, [0, 4, 8, 12]);
        for (let s = 0; s < 16; s++) P.hat.steps[o + s] = s % 4 === 2 ? 2 : r() < 0.7 ? 1 : 0;
        if (r() < 0.6) at(P.snare, [12]);
        at(P.perc, [3, 7, 11, 14].filter(() => r() < 0.5));
        for (let s = 0; s < 16; s++) if (s % 4 !== 0) note(P.bass, s, prog[bar] - 7, 1);
        if (r() < 0.8) [3, 11].forEach((s) => note(P.lead, s, ch[Math.floor(r() * 3)], 1));
        break;
      case "trance":
        at(P.kick, [0, 4, 8, 12]); at(P.snare, [4, 12]);
        for (let s = 0; s < 16; s++) P.hat.steps[o + s] = s % 4 === 2 ? 2 : s % 2 ? 1 : 0;
        for (let s = 0; s < 16; s++) if (s % 4 !== 0) note(P.bass, s, prog[bar] - 7, 1);
        for (let s = 0; s < 16; s++) note(P.lead, s, [ch[0], ch[1], ch[2], ch[3], ch[2], ch[1]][s % 6] + (s >= 8 && lead[s] < 0.3 ? 7 : 0), 1);
        at(P.perc, [14].filter(() => r() < 0.4));
        break;
      case "bass":
        at(P.kick, [0, 10].concat(r() < 0.4 ? [3] : [])); at(P.snare, [8]);
        for (let s = 0; s < 16; s += 2) P.hat.steps[o + s] = s === 6 || s === 14 ? 2 : 1;
        note(P.bass, 0, prog[bar] - 7, 6); note(P.bass, 8, prog[bar] - 7 + (r() < 0.5 ? 0 : 2), r() < 0.5 ? 4 : 8);
        if (r() < 0.6) note(P.bass, 12, prog[bar] - 7 + 4, 4);
        [0, 6, 10].forEach((s) => { if (lead[s] < 0.6) note(P.lead, s, ch[Math.floor(lead[s] * 4)] + 7, 2); });
        at(P.perc, [5, 13].filter(() => r() < 0.5));
        break;
      case "breaks":
        at(P.kick, [0, 10].concat(r() < 0.5 ? [7] : [])); at(P.snare, [4, 12]);
        if (r() < 0.6) at(P.snare, [15]);
        for (let s = 0; s < 16; s += 2) P.hat.steps[o + s] = r() < 0.15 ? 2 : 1;
        for (let s = 0; s < 16; s++) if (r() < 0.55) note(P.bass, s, prog[bar] - 7 + [0, 0, 7, 3, 5][Math.floor(r() * 5)], 1);
        leadRhythm.forEach((s) => { if (lead[s] < 0.7) note(P.lead, s, ch[Math.floor(lead[s] * 4)] + 7, 1); });
        at(P.perc, [6, 14].filter(() => r() < 0.6));
        break;
      case "drift":
        if (bar % 2 === 0) at(P.kick, [0]);
        for (let s = 0; s < 16; s += 4) if (r() < 0.6) P.hat.steps[o + s + 2] = 1;
        note(P.bass, 0, prog[bar] - 7, 14);
        [0, 6, 10].forEach((s) => { if (lead[s + bar % 2] < 0.65) note(P.lead, s, ch[Math.floor(lead[s] * 4)] + 7, 4); });
        at(P.perc, [3, 9, 13].filter(() => r() < 0.3));
        break;
      case "signal":
        at(P.kick, [0, 8].concat(r() < 0.5 ? [11] : [])); at(P.snare, [4, 12]);
        for (let s = 0; s < 16; s++) P.hat.steps[o + s] = r() < 0.5 ? 1 : 0;
        [0, 3, 8, 11].forEach((s) => { if (r() < 0.8) note(P.bass, s, prog[bar] - 7, 2); });
        leadRhythm.forEach((s) => note(P.lead, s, ch[Math.floor(lead[s] * 4)] + 7, 1));
        at(P.signal, [6]);
        break;
      default: // house
        at(P.kick, [0, 4, 8, 12]); at(P.snare, [4, 12]);
        for (let s = 0; s < 16; s++) P.hat.steps[o + s] = s % 4 === 2 ? 2 : r() < 0.35 ? 1 : 0;
        [2, 6, 10, 14].forEach((s) => note(P.bass, s, prog[bar] - 7 + (r() < 0.2 ? 4 : 0), 1));
        if (r() < 0.4) note(P.bass, 15, prog[bar] - 7 + 7, 1);
        leadRhythm.forEach((s) => { if (lead[s] < 0.8) note(P.lead, s, ch[Math.floor(lead[s] * 4)] + 7, 1); });
        at(P.perc, [7, 15].filter(() => r() < 0.5));
    }
  }
  if (r() < 0.5 && styleKey !== "signal") for (let b = 0; b < 4; b++) if (r() < 0.4) P.signal.steps[b * 16 + 14] = true;
  return sanitizeTrack({
    name: `${pick(WORDS_A)} ${pick(WORDS_B)}`,
    style: styleKey,
    bpm,
    root: Math.floor(r() * 12),
    scale: pick(style.scales),
    tuning: "earth",
    swing: styleKey === "breaks" || styleKey === "drift" ? 0.15 : 0,
    prog,
    parts,
    ...over,
  });
}

// regenerate just one part of a track, in its style (the Alien pad "Mutate")
export function mutatePart(track, part, seed = (Math.random() * 1e9) | 0) {
  const fresh = generateTrack(track.style, seed, { root: track.root, scale: track.scale, prog: track.prog });
  return { ...track, parts: { ...track.parts, [part]: { ...fresh.parts[part], sound: track.parts[part].sound, vol: track.parts[part].vol, mute: false } } };
}

// a species from the Alien Lab, as a track: its world chooses the style,
// its body and mind shape the rest
export function speciesTrack(sp) {
  const a = sp.answers || {};
  const v = (re) => { const k = Object.keys(a).find((key) => re.test(key)); return k ? String(a[k] || "") : ""; };
  const terrain = v(/surface/i), size = v(/How big/i), temper = v(/temperament/i), social = v(/socially/i), star = v(/sun look/i), tech = v(/built from/i), skin = v(/covers/i), move = v(/get around/i);
  const style = /Ocean/.test(terrain) ? "drift" : /Desert/.test(terrain) ? "breaks" : /Ice/.test(terrain) ? "trance" : /caverns|Underground/.test(terrain) ? "techno" : /forest|fungus/i.test(terrain) ? "house" : "signal";
  let seed = 7; String(sp.id || sp.name || "x").split("").forEach((c) => { seed = (seed * 31 + c.charCodeAt(0)) >>> 0; });
  const t = generateTrack(style, seed);
  const bpm = t.bpm + (/Aggressive/.test(temper) ? 8 : /Detached|Cautious/.test(temper) ? -6 : 0) + (/Massive|Large/.test(size) ? -6 : /Insect|Small/.test(size) ? 6 : 0);
  const out = { ...t, name: sp.name || t.name, bpm, tuning: /No true daylight/.test(star) || /Gravitational/.test(tech) ? "xeno" : "earth" };
  if (/Massive|Large/.test(size)) out.parts.kick.sound = "Gravity";
  if (/bioluminescent/i.test(skin)) out.parts.pad.sound = "Halo";
  if (/exoskeleton|Scales/i.test(skin)) out.parts.hat.sound = "Metal";
  if (/Aggressive/.test(temper)) out.parts.bass.sound = "Acid";
  if (/hive mind|collective/i.test(social)) out.parts.hat.steps = out.parts.hat.steps.map((x, i) => x || (i % 2 ? 1 : 0));
  if (/Flying|Float/.test(move)) out.parts.lead.sound = "Flute";
  return sanitizeTrack(out);
}

// a composition from /api/music (the Signal Composer v1 format) as a track
export function fromComposerSong(song, note = "") {
  const moodStyle = { signal: "signal", drift: "drift", pulse: "techno", descent: "bass", aurora: "trance" }[song.mood] || "signal";
  const base = generateTrack(moodStyle, (song.seed || 1) >>> 0);
  const four = (a) => Array.from({ length: STEPS }, (_, i) => !!(a || [])[i % 16]);
  const L = song.layers || {};
  const on = (k) => !L[k] || L[k].on !== false;
  const prog = Array.isArray(song.progression) && song.progression.length === 4 ? song.progression : base.prog;
  const drums = on("drums");
  const t = {
    ...base,
    name: note ? note.replace(/\.$/, "").slice(0, 40) : base.name,
    bpm: song.tempo || base.bpm, root: song.root ?? base.root, scale: SCALES[song.scale] ? song.scale : base.scale, prog,
  };
  t.parts = {
    ...base.parts,
    kick: { ...base.parts.kick, steps: drums ? four(song.kick) : empty(false) },
    snare: { ...base.parts.snare, steps: drums ? four(song.snare) : empty(false) },
    hat: { ...base.parts.hat, steps: drums ? four(song.hat).map((x) => (x ? 1 : 0)) : empty(0) },
    perc: { ...base.parts.perc, steps: empty(false) },
    bass: { ...base.parts.bass, mute: !on("bass"), notes: Array.from({ length: STEPS }, (_, i) => ((song.bass || [])[i % 16] ? { d: prog[Math.floor(i / 16)] - 7, len: 2 } : null)) },
    lead: { ...base.parts.lead, mute: !on("arp"), notes: Array.from({ length: STEPS }, (_, i) => { const a = (song.arp || [])[i % 16]; return a >= 0 ? { d: prog[Math.floor(i / 16)] + [0, 2, 4, 7][a] + 7, len: 1 } : null; }) },
    pad: { ...base.parts.pad, mute: !on("pad") },
    signal: { ...base.parts.signal, mute: !on("texture") },
  };
  return sanitizeTrack(t);
}

// clamp anything into a valid track
export function sanitizeTrack(x) {
  const t = x || {};
  const b = (a) => Array.from({ length: STEPS }, (_, i) => !!(Array.isArray(a) ? a[i] : false));
  const n = (a) => Array.from({ length: STEPS }, (_, i) => { const v = Array.isArray(a) ? a[i] : null; return v && Number.isFinite(v.d) ? { d: Math.max(-14, Math.min(21, Math.round(v.d))), len: Math.max(1, Math.min(16, Math.round(v.len || 1))) } : null; });
  const vol = (v, d) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : d));
  const p = t.parts || {};
  const drum = (k, d) => ({ sound: DRUM_SOUNDS[k].includes(p[k]?.sound) ? p[k].sound : DRUM_SOUNDS[k][0], vol: vol(p[k]?.vol, d), mute: !!p[k]?.mute });
  const syn = (k, d) => ({ sound: SYNTH_SOUNDS[k].includes(p[k]?.sound) ? p[k].sound : SYNTH_SOUNDS[k][0], vol: vol(p[k]?.vol, d), mute: !!p[k]?.mute });
  return {
    name: String(t.name || "Untitled Signal").slice(0, 48),
    style: STYLES[t.style] ? t.style : "house",
    bpm: Math.max(60, Math.min(180, Math.round(Number(t.bpm) || 124))),
    root: ((Math.round(Number(t.root) || 0) % 12) + 12) % 12,
    scale: SCALES[t.scale] ? t.scale : "minor",
    tuning: t.tuning === "xeno" ? "xeno" : "earth",
    swing: Math.max(0, Math.min(0.5, Number(t.swing) || 0)),
    prog: Array.isArray(t.prog) && t.prog.length === 4 ? t.prog.map((d) => Math.max(0, Math.min(6, Math.round(Number(d) || 0)))) : [0, 5, 3, 4],
    parts: {
      kick: { ...drum("kick", 0.9), steps: b(p.kick?.steps) },
      snare: { ...drum("snare", 0.7), steps: b(p.snare?.steps) },
      hat: { ...drum("hat", 0.55), steps: Array.from({ length: STEPS }, (_, i) => { const v = Number(p.hat?.steps?.[i]) || 0; return v === 2 ? 2 : v ? 1 : 0; }) },
      perc: { ...drum("perc", 0.5), steps: b(p.perc?.steps) },
      bass: { ...syn("bass", 0.75), cutoff: vol(p.bass?.cutoff, 0.5), notes: n(p.bass?.notes) },
      lead: { ...syn("lead", 0.55), cutoff: vol(p.lead?.cutoff, 0.6), notes: n(p.lead?.notes) },
      pad: syn("pad", 0.5),
      signal: { vol: vol(p.signal?.vol, 0.4), mute: !!p.signal?.mute, steps: b(p.signal?.steps) },
    },
  };
}
