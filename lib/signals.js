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
import { hearAnalyser } from "./lyraMusic";

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

// THE DEEP WALKERS (Assignment 0000087): the clouded world from orbit, the
// towers sinking, twelve walkers answering each other through the stone one
// at a time, the long patient days, the ridge giving way, and the ancestors
// still speaking in the archive below.
const stone = {
  tempo: 66, root: 9, scale: "dorian", progression: [0, 0, 3, 4],
  arp: Array(16).fill(-1),
  bass: steps([0, 8]),
  kick: steps([]), snare: steps([]), hat: steps([]),
  layers: { drone: L(0.75), pad: L(0.45), arp: off, bass: L(0.6), drums: off, texture: L(0.5) },
};
const twelve = [0, -1, -1, 1, -1, -1, 2, -1, -1, 3, -1, -1, 2, -1, 1, -1]; // answers passing round a circle

// NERATH'S SECRET (Assignment 0215783): down through the liquid world, the
// network's pulse, sixteen limbs each with a mind of its own, the rupture,
// the elder's choice, and a city that learned from its disagreement.
const deep = {
  tempo: 84, root: 4, scale: "phrygian", progression: [0, 1, 0, 6],
  arp: [0, -1, -1, 2, -1, -1, 1, -1, 0, -1, -1, 3, -1, -1, 1, -1],
  bass: steps([0, 6, 10]),
  kick: steps([]), snare: steps([]), hat: steps([]),
  layers: { drone: L(0.6), pad: L(0.55), arp: L(0.45), bass: L(0.5), drums: off, texture: L(0.7) },
};
const sixteenArp = [0, 1, 2, 3, 2, 1, 3, 0, 1, 3, 2, 0, 3, 2, 1, 2]; // every step a limb

// THE SEA OF GLASS (Assignment 0514229): the red star and the white plain,
// the canyon's war repeating to no one, the bright one's first word, the
// rings, the heavy one, the companion's ringing, the Return falling like
// light - and one ring kept.
const red = {
  tempo: 76, root: 1, scale: "minor", progression: [0, 5, 3, 4],
  arp: [0, -1, -1, -1, 2, -1, -1, -1, 1, -1, -1, -1, 3, -1, -1, -1],
  bass: steps([0, 8]),
  kick: steps([]), snare: steps([]), hat: steps([]),
  layers: { drone: L(0.7), pad: L(0.5), arp: L(0.4), bass: L(0.45), drums: off, texture: L(0.45) },
};
const fall = [3, -1, 2, -1, 3, 1, -1, 2, 0, -1, 3, -1, 1, -1, 0, -1]; // rings, falling

// THE BORROWED SECONDS (Assignment 0832040): a planet of voices, inside
// Concord, the slow hand (rubato: time borrowed and given back), the moon,
// the forty-first day, nine held seconds, and four voices, untranslated.
const voices = {
  tempo: 104, root: 7, scale: "dorian", progression: [0, 3, 4, 3],
  arp: [0, 2, 1, 3, 2, 1, 0, 2, 1, 3, 0, 2, 3, 1, 2, 0],
  bass: steps([0, 3, 8, 11]),
  kick: steps([0, 8]), snare: steps([4, 12]), hat: steps([0, 2, 4, 6, 8, 10, 12, 14]),
  layers: { drone: L(0.4), pad: L(0.5), arp: L(0.7), bass: L(0.55), drums: L(0.5), texture: L(0.7) },
};

// FIRST FIRE (Assignment 1346269): struck hard without warning (sforzando),
// the lattice, the slow approach under fire, the star knotting, the flare,
// and a single word sent back every few hours.
const lattice = {
  tempo: 120, root: 4, scale: "phrygian", progression: [0, 1, 0, 6],
  arp: [0, 0, -1, 3, -1, 0, 2, -1, 0, 0, -1, 3, -1, 1, 2, -1],
  bass: steps([0, 2, 6, 8, 10, 14]),
  kick: steps([0, 3, 6, 8, 11, 14]), snare: steps([4, 12]), hat: steps([0, 2, 4, 6, 8, 10, 12, 14]),
  layers: { drone: L(0.75), pad: L(0.3), arp: L(0.7), bass: L(0.8), drums: L(0.8), texture: L(0.85) },
};

// THE FERMATA (Assignment 2178309): the dark, the ice singing as it warms,
// the letters, the stranger, the council, the long lean, and one held note.
const thaw = {
  tempo: 70, root: 9, scale: "lydian", progression: [0, 4, 3, 0],
  arp: [0, -1, -1, 2, -1, -1, 1, -1, -1, 3, -1, -1, 2, -1, -1, -1],
  bass: steps([0]),
  kick: steps([]), snare: steps([]), hat: steps([]),
  layers: { drone: L(0.5), pad: L(0.6), arp: L(0.55), bass: L(0.25), drums: off, texture: L(0.35) },
};
const held = [2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]; // one note, held

// THE ACCORD (Assignment 3524578): the roar of a full world, the Wood, the
// Pell's tail-songs, the loom-beasts walking, the Accord sung through, the
// unasked vine, the frame underground, and "there you are".
const wood = {
  tempo: 108, root: 5, scale: "major", progression: [0, 3, 4, 5],
  arp: [0, 2, 3, 2, 1, 3, 0, 3, 2, 1, 3, 2, 0, 3, 1, 3],
  bass: steps([0, 6, 8, 14]),
  kick: steps([0, 6, 8]), snare: steps([4, 12]), hat: steps([0, 2, 3, 4, 6, 8, 10, 11, 12, 14]),
  layers: { drone: L(0.45), pad: L(0.6), arp: L(0.7), bass: L(0.55), drums: L(0.5), texture: L(0.8) },
};

// THE RING (Assignment 5702887): a phrase that keeps returning - the first
// visit, the round temples, the telegram, the crowds, eleven nights at the
// eyepiece, the secret, and the steps of the temple.
const ringPhrase = [0, -1, 2, -1, 1, -1, 3, -1, 0, -1, 2, -1, 1, -1, -1, -1]; // the ritornello
const bells = {
  tempo: 84, root: 0, scale: "dorian", progression: [0, 5, 3, 4],
  arp: ringPhrase,
  bass: steps([0, 8]),
  kick: steps([0]), snare: steps([]), hat: steps([8]),
  layers: { drone: L(0.5), pad: L(0.6), arp: L(0.65), bass: L(0.4), drums: L(0.25), texture: L(0.3) },
};

export const SIGNALS = {
  5702887: {
    title: "The Ring",
    subtitle: "a signal from Ritornello, translated",
    sections: [
      { label: "Forty nights, long ago", bars: 4, song: { ...bells, tempo: 60, scale: "lydian", bass: steps([]), kick: steps([]), hat: steps([]), arp: [0, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, -1, -1, -1, -1], layers: { drone: L(0.4), pad: L(0.5), arp: L(0.45), bass: off, drums: off, texture: L(0.2) } } },
      { label: "The round temples", bars: 4, song: bells },
      { label: "The telegram", bars: 2, song: { ...bells, tempo: 120, arp: [3, 3, -1, 3, 3, -1, 3, -1, 3, 3, -1, 3, -1, -1, -1, -1], kick: steps([]), hat: steps([0, 2, 4, 6, 8, 10, 12, 14]), layers: { drone: L(0.3), pad: L(0.3), arp: L(0.6), bass: L(0.3), drums: L(0.45), texture: L(0.2) } } },
      { label: "The squares", bars: 4, song: { ...bells, tempo: 112, scale: "phrygian", kick: steps([0, 3, 8, 11]), snare: steps([4, 12]), hat: steps([0, 2, 4, 6, 8, 10, 12, 14]), bass: steps([0, 3, 6, 8, 11, 14]), layers: { drone: L(0.8), pad: L(0.4), arp: L(0.7), bass: L(0.8), drums: L(0.75), texture: L(0.8) } } },
      { label: "Are you listening", bars: 8, song: { ...bells, tempo: 72, scale: "lydian", progression: [0, 4, 0, 4], kick: steps([]), hat: steps([]), arp: [0, -1, 1, -1, 2, -1, 0, -1, 3, -1, 1, -1, -1, -1, -1, -1], layers: { drone: L(0.45), pad: L(0.55), arp: L(0.6), bass: L(0.25), drums: off, texture: L(0.15) } } },
      { label: "We know", bars: 2, song: { ...bells, tempo: 60, arp: Array(16).fill(-1), bass: steps([]), kick: steps([]), hat: steps([]), layers: { drone: L(0.25), pad: L(0.2), arp: off, bass: off, drums: off, texture: off } } },
      { label: "The years since Ashet", bars: 8, song: { ...bells, scale: "major", progression: [0, 3, 4, 0], arp: ringPhrase.map((x, i) => (x < 0 && i % 4 === 2 ? 3 : x)), layers: { drone: L(0.35), pad: L(0.7), arp: L(0.65), bass: L(0.4), drums: L(0.2), texture: L(0.2) } } },
    ],
  },
  3524578: {
    title: "The Accord",
    subtitle: "a signal from Tutti, translated",
    sections: [
      { label: "Everything at once", bars: 4, song: { ...wood, tempo: 120, scale: "lydian", hat: steps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]), layers: { drone: L(0.7), pad: L(0.6), arp: L(0.8), bass: L(0.6), drums: L(0.6), texture: L(0.95) } } },
      { label: "The Great Wood", bars: 4, song: wood },
      { label: "A tail, speaking slowly", bars: 4, song: { ...wood, tempo: 72, kick: steps([]), snare: steps([]), hat: steps([]), arp: [0, -1, 2, -1, -1, 3, -1, -1, 1, -1, 3, -1, -1, -1, -1, -1], bass: steps([0]), layers: { drone: L(0.4), pad: L(0.55), arp: L(0.65), bass: L(0.3), drums: off, texture: L(0.35) } } },
      { label: "The loom-beasts walk", bars: 4, song: { ...wood, tempo: 64, scale: "dorian", kick: steps([0, 8]), snare: steps([]), hat: steps([]), bass: steps([0, 8]), arp: [0, -1, -1, -1, -1, -1, -1, -1, 1, -1, -1, -1, -1, -1, -1, -1], layers: { drone: L(0.7), pad: L(0.5), arp: L(0.4), bass: L(0.75), drums: L(0.5), texture: L(0.3) } } },
      { label: "Two hundred voices", bars: 8, song: { ...wood, arp: [0, 1, 2, 3, 3, 3, 2, 1, 0, 2, 3, 2, 0, 3, 1, 3], layers: { drone: L(0.5), pad: L(0.7), arp: L(0.75), bass: L(0.55), drums: L(0.55), texture: L(0.7) } } },
      { label: "The unasked", bars: 4, song: { ...wood, tempo: 72, root: 4, scale: "phrygian", kick: steps([]), snare: steps([]), hat: steps([]), arp: [0, -1, -1, 1, -1, -1, 0, -1, -1, 1, -1, -1, -1, -1, -1, -1], bass: steps([0, 3]), layers: { drone: L(0.85), pad: L(0.3), arp: L(0.45), bass: L(0.55), drums: off, texture: L(0.5) } } },
      { label: "The frame", bars: 4, song: { ...wood, tempo: 56, scale: "minor", kick: steps([0]), snare: steps([]), hat: steps([]), arp: Array(16).fill(-1), bass: steps([0, 8]), layers: { drone: L(0.8), pad: L(0.4), arp: off, bass: L(0.7), drums: L(0.4), texture: L(0.2) } } },
      { label: "There you are", bars: 8, song: { ...wood, tempo: 92, scale: "lydian", progression: [0, 4, 5, 0], arp: [0, -1, 2, -1, 3, -1, 2, -1, 1, -1, 3, -1, 3, -1, -1, -1], layers: { drone: L(0.4), pad: L(0.75), arp: L(0.65), bass: L(0.45), drums: L(0.3), texture: L(0.4) } } },
    ],
  },
  2178309: {
    title: "The Fermata",
    subtitle: "a signal from Fermata, translated",
    sections: [
      { label: "Three thousand years", bars: 2, song: { ...thaw, tempo: 56, arp: Array(16).fill(-1), bass: steps([]), layers: { drone: L(0.3), pad: off, arp: off, bass: off, drums: off, texture: L(0.15) } } },
      { label: "The ice sings", bars: 4, song: { ...thaw, layers: { ...thaw.layers, texture: L(0.6) } } },
      { label: "Forty days", bars: 4, song: { ...thaw, tempo: 96, scale: "major", kick: steps([0, 8]), hat: steps([4, 12]), arp: [0, 2, 1, 3, 0, 2, 1, 3, 2, 3, 1, 2, 0, 1, 2, 3], bass: steps([0, 6, 8]), layers: { drone: L(0.35), pad: L(0.55), arp: L(0.7), bass: L(0.5), drums: L(0.35), texture: L(0.4) } } },
      { label: "Three hundred and eighty-four letters", bars: 8, song: { ...thaw, arp: [0, -1, 1, -1, 2, -1, 1, -1, 3, -1, 2, -1, 1, -1, 0, -1], layers: { drone: L(0.4), pad: L(0.65), arp: L(0.6), bass: L(0.3), drums: off, texture: L(0.3) } } },
      { label: "The stranger", bars: 4, song: { ...thaw, scale: "minor", root: 2, tempo: 64, progression: [0, 5, 0, 5], arp: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], bass: steps([0, 8]), layers: { drone: L(0.85), pad: L(0.3), arp: L(0.35), bass: L(0.55), drums: off, texture: L(0.2) } } },
      { label: "The council", bars: 4, song: { ...thaw, scale: "dorian", tempo: 84, arp: [0, 2, -1, 1, 3, -1, 0, 2, -1, 3, 1, -1, 2, 0, -1, 1], kick: steps([0]), hat: steps([6, 14]), layers: { drone: L(0.5), pad: L(0.5), arp: L(0.6), bass: L(0.4), drums: L(0.2), texture: L(0.35) } } },
      { label: "Ask us again", bars: 4, song: { ...thaw, tempo: 64, progression: [0, 4, 5, 4], arp: [3, -1, -1, 2, -1, -1, -1, -1, 1, -1, -1, 0, -1, -1, -1, -1], layers: { drone: L(0.4), pad: L(0.7), arp: L(0.6), bass: L(0.3), drums: off, texture: L(0.2) } } },
      { label: "Holding the note", bars: 8, song: { ...thaw, tempo: 52, progression: [0, 0, 0, 0], arp: held, bass: steps([]), layers: { drone: L(0.35), pad: L(0.55), arp: L(0.5), bass: off, drums: off, texture: L(0.15) } } },
    ],
  },
  1346269: {
    title: "First Fire",
    subtitle: "a signal from Sforzando, translated",
    sections: [
      { label: "Arriving", bars: 2, song: { ...lattice, tempo: 60, scale: "lydian", kick: steps([]), snare: steps([]), hat: steps([]), bass: steps([]), arp: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], layers: { drone: L(0.35), pad: L(0.4), arp: L(0.4), bass: off, drums: off, texture: off } } },
      { label: "Sforzando", bars: 4, song: lattice },
      { label: "Four hundred and twelve", bars: 4, song: { ...lattice, tempo: 120, kick: steps([0, 8]), snare: steps([]), hat: steps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]), arp: [0, 3, 0, 3, 1, 3, 1, 3, 0, 3, 0, 3, 2, 3, 2, 3], layers: { drone: L(0.6), pad: L(0.3), arp: L(0.6), bass: L(0.5), drums: L(0.5), texture: L(0.6) } } },
      { label: "In plain sight", bars: 8, song: { ...lattice, tempo: 72, scale: "dorian", kick: steps([0, 11]), snare: steps([]), hat: steps([4, 12]), arp: [0, -1, -1, 1, -1, -1, 2, -1, -1, -1, -1, -1, 3, -1, -1, -1], bass: steps([0, 8]), layers: { drone: L(0.6), pad: L(0.55), arp: L(0.55), bass: L(0.4), drums: L(0.45), texture: L(0.5) } } },
      { label: "The star knots", bars: 4, song: { ...lattice, tempo: 72, scale: "minor", kick: steps([]), snare: steps([]), hat: steps([]), arp: [0, 1, 0, 1, 0, 1, 0, 1, 2, 1, 2, 1, 2, 1, 2, 1], bass: steps([0]), layers: { drone: L(0.9), pad: L(0.3), arp: L(0.45), bass: L(0.5), drums: off, texture: L(0.4) } } },
      { label: "The flare", bars: 4, song: { ...lattice, tempo: 132, scale: "lydian", progression: [0, 4, 5, 4], arp: [3, 2, 3, 1, 3, 2, 3, 0, 3, 2, 3, 1, 3, 2, 3, 0], layers: { drone: L(0.9), pad: L(0.6), arp: L(0.8), bass: L(0.85), drums: L(0.85), texture: L(0.9) } } },
      { label: "State the purpose", bars: 2, song: { ...lattice, tempo: 60, kick: steps([]), snare: steps([]), hat: steps([]), bass: steps([]), arp: Array(16).fill(-1), layers: { drone: L(0.2), pad: off, arp: off, bass: off, drums: off, texture: off } } },
      { label: "Received", bars: 8, song: { ...lattice, tempo: 80, scale: "lydian", progression: [0, 4, 0, 5], kick: steps([0]), snare: steps([]), hat: steps([8]), arp: [0, -1, -1, -1, -1, -1, -1, -1, 3, -1, -1, -1, -1, -1, -1, -1], bass: steps([0, 8]), layers: { drone: L(0.4), pad: L(0.65), arp: L(0.6), bass: L(0.35), drums: L(0.2), texture: L(0.2) } } },
    ],
  },
  832040: {
    title: "The Borrowed Seconds",
    subtitle: "a signal from Ammet, translated",
    sections: [
      { label: "A planet of voices", bars: 4, song: voices },
      { label: "Inside Concord", bars: 4, song: { ...voices, scale: "lydian", kick: steps([]), snare: steps([]), hat: steps([]), arp: [0, -1, 1, -1, 2, -1, 3, -1, 2, -1, 1, -1, 0, -1, 3, -1], layers: { drone: L(0.5), pad: L(0.6), arp: L(0.6), bass: L(0.3), drums: off, texture: L(0.3) } } },
      { label: "The slow hand", bars: 4, song: { ...voices, tempo: 76, kick: steps([0]), snare: steps([]), hat: steps([4, 12]), arp: [0, -1, -1, 2, -1, -1, 1, -1, -1, 3, -1, -1, -1, -1, -1, -1], layers: { drone: L(0.5), pad: L(0.6), arp: L(0.55), bass: L(0.4), drums: L(0.25), texture: L(0.3) } } },
      { label: "The moon", bars: 4, song: { ...voices, tempo: 76, scale: "minor", kick: steps([]), snare: steps([]), hat: steps([]), bass: steps([0]), arp: [3, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, -1, -1, -1, -1], layers: { drone: L(0.7), pad: L(0.3), arp: L(0.5), bass: L(0.3), drums: off, texture: L(0.2) } } },
      { label: "The forty-first day", bars: 4, song: { ...voices, tempo: 112, scale: "phrygian", kick: steps([0, 3, 6, 8, 11, 14]), snare: steps([4, 12]), hat: steps([0, 2, 3, 4, 6, 8, 10, 11, 12, 14]), bass: steps([0, 2, 4, 6, 8, 10, 12, 14]), layers: { drone: L(0.8), pad: L(0.3), arp: L(0.7), bass: L(0.85), drums: L(0.8), texture: L(0.9) } } },
      { label: "Nine seconds", bars: 2, song: { ...voices, tempo: 60, kick: steps([]), snare: steps([]), hat: steps([]), bass: steps([]), arp: Array(16).fill(-1), layers: { drone: L(0.2), pad: off, arp: off, bass: off, drums: off, texture: off } } },
      { label: "Untranslated", bars: 8, song: { ...voices, tempo: 96, scale: "lydian", progression: [0, 4, 5, 3], kick: steps([0, 8]), snare: steps([]), hat: steps([4, 12]), arp: [0, -1, 2, -1, 1, -1, 3, -1, 0, -1, 2, -1, 3, -1, 1, -1], layers: { drone: L(0.35), pad: L(0.7), arp: L(0.6), bass: L(0.45), drums: L(0.3), texture: L(0.3) } } },
    ],
  },

  87: {
    title: "The Deep Walkers",
    subtitle: "a signal from Veyra, translated",
    sections: [
      { label: "Under the clouds", bars: 4, song: stone },
      { label: "The towers sink", bars: 4, song: { ...stone, bass: steps([0, 3, 8, 11]), layers: { ...stone.layers, bass: L(0.8), texture: L(0.65) } } },
      { label: "Twelve, answering", bars: 8, song: { ...stone, arp: twelve, layers: { ...stone.layers, arp: L(0.6), pad: L(0.55) } } },
      { label: "Many days", bars: 4, song: { ...stone, tempo: 66, arp: [0, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, -1, -1, -1, -1, -1], layers: { drone: L(0.5), pad: L(0.6), arp: L(0.4), bass: L(0.3), drums: off, texture: L(0.3) } } },
      { label: "The ridge", bars: 4, song: { ...stone, kick: steps([0, 3, 6, 8, 11, 14]), snare: steps([12]), bass: steps([0, 2, 4, 6, 8, 10, 12, 14]), layers: { drone: L(0.8), pad: L(0.3), arp: off, bass: L(0.85), drums: L(0.7), texture: L(0.9) } } },
      { label: "", bars: 1, song: { ...stone, bass: steps([]), arp: Array(16).fill(-1), layers: { drone: L(0.15), pad: off, arp: off, bass: off, drums: off, texture: off } } },
      { label: "The archive", bars: 8, song: { ...stone, scale: "lydian", progression: [0, 4, 3, 0], arp: [3, -1, -1, 2, -1, -1, -1, -1, 1, -1, -1, 0, -1, -1, -1, -1], bass: steps([0]), layers: { drone: L(0.45), pad: L(0.65), arp: L(0.55), bass: L(0.25), drums: off, texture: L(0.35) } } },
    ],
  },
  215783: {
    title: "Nerath's Secret",
    subtitle: "a signal from Nerath, translated",
    sections: [
      { label: "The descent", bars: 4, song: deep },
      { label: "The network", bars: 4, song: { ...deep, kick: steps([0, 8]), hat: steps([4, 12]), layers: { ...deep.layers, drums: L(0.4) } } },
      { label: "Sixteen", bars: 8, song: { ...deep, tempo: 84, scale: "dorian", arp: sixteenArp, layers: { drone: L(0.45), pad: L(0.5), arp: L(0.7), bass: L(0.55), drums: L(0.3), texture: L(0.4) }, kick: steps([0, 8]), hat: steps([2, 6, 10, 14]) } },
      { label: "The rupture", bars: 4, song: { ...deep, tempo: 84, kick: steps([0, 3, 6, 8, 11, 14]), snare: steps([4, 12]), hat: steps([0, 2, 4, 6, 8, 10, 12, 14]), bass: steps([0, 2, 6, 8, 10, 14]), layers: { drone: L(0.7), pad: L(0.4), arp: L(0.6), bass: L(0.8), drums: L(0.75), texture: L(0.85) } } },
      { label: "The elder", bars: 4, song: { ...deep, arp: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], bass: steps([0]), layers: { drone: L(0.6), pad: L(0.35), arp: L(0.5), bass: L(0.4), drums: off, texture: L(0.2) } } },
      { label: "Three limbs", bars: 4, song: { ...deep, arp: [-1, -1, -1, 1, -1, -1, -1, 2, -1, -1, -1, -1, 3, -1, -1, -1], layers: { drone: L(0.5), pad: L(0.4), arp: L(0.75), bass: off, drums: off, texture: L(0.25) } } },
      { label: "Seventeen minds", bars: 8, song: { ...deep, scale: "lydian", progression: [0, 4, 5, 0], arp: sixteenArp.map((x, i) => (i % 2 ? -1 : x)), bass: steps([0, 8]), layers: { drone: L(0.35), pad: L(0.65), arp: L(0.55), bass: L(0.35), drums: off, texture: L(0.3) } } },
    ],
  },
  514229: {
    title: "The Sea of Glass",
    subtitle: "a signal from Dacapo, translated",
    sections: [
      { label: "The red star", bars: 4, song: red },
      { label: "The towers", bars: 8, song: { ...red, scale: "phrygian", kick: steps([0, 6, 8]), snare: steps([12]), hat: steps([2, 6, 10, 14]), arp: [0, 1, 0, -1, 0, 1, 3, -1, 0, 1, 0, -1, 2, 1, 0, -1], layers: { drone: L(0.7), pad: L(0.35), arp: L(0.55), bass: L(0.6), drums: L(0.55), texture: L(0.7) } } },
      { label: "The bright one", bars: 4, song: { ...red, scale: "lydian", root: 1, progression: [0, 0, 4, 0], arp: [3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], bass: steps([]), layers: { drone: L(0.25), pad: L(0.5), arp: L(0.8), bass: off, drums: off, texture: off } } },
      { label: "One ring a year", bars: 4, song: { ...red, scale: "major", progression: [0, 3, 4, 0], arp: [0, -1, 1, -1, 2, -1, 3, -1, 2, -1, 1, -1, 0, -1, -1, -1], layers: { drone: L(0.4), pad: L(0.6), arp: L(0.55), bass: L(0.35), drums: off, texture: L(0.25) } } },
      { label: "The heavy one", bars: 4, song: { ...red, tempo: 76, root: 1, scale: "minor", arp: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], bass: steps([0]), layers: { drone: L(0.85), pad: L(0.3), arp: L(0.35), bass: L(0.5), drums: off, texture: L(0.2) } } },
      { label: "The companion rises", bars: 4, song: { ...red, scale: "lydian", arp: [3, 3, -1, 3, -1, 3, 3, -1, 3, -1, 3, 3, -1, 3, -1, 3], hat: steps([0, 2, 4, 6, 8, 10, 12, 14]), layers: { drone: L(0.5), pad: L(0.55), arp: L(0.6), bass: L(0.3), drums: L(0.3), texture: L(0.6) } } },
      { label: "The Return", bars: 8, song: { ...red, scale: "lydian", progression: [0, 4, 5, 3], arp: fall, bass: steps([0, 8]), layers: { drone: L(0.4), pad: L(0.7), arp: L(0.7), bass: L(0.4), drums: off, texture: L(0.5) } } },
      { label: "One ring kept", bars: 2, song: { ...red, scale: "lydian", progression: [0, 0, 0, 0], arp: [2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], bass: steps([]), layers: { drone: L(0.2), pad: L(0.4), arp: L(0.5), bass: off, drums: off, texture: off } } },
    ],
  },

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
  if (c.release) c.release();
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
  c.release = hearAnalyser(graph.analyser); // Lyra dances to it
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
