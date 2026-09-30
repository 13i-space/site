// Every species has a signal. 13i hears a world first as gravity - mass
// moving in rhythm - and translates it into sound for us (docs/WORLD.md).
// Here that translation is the Signal Composer's engine (lib/musicEngine.js)
// driven by the species' stats and answers, seeded by its id so a species
// always sounds like itself.

import { generateSong, sanitizeSong, buildGraph, applyMix, startSustained, stopSustained, scheduleStep, STEPS } from "./musicEngine";
import { statsFor } from "./alienStats";
import { keyFor } from "./alienTraits";

const SCALE_BY_TEMPERAMENT = [
  [/^Curious/, "lydian"],
  [/^Cautious/, "dorian"],
  [/^Aggressive/, "phrygian"],
  [/^Detached/, "pentatonic"],
];

function seedFrom(id) {
  let h = 2166136261;
  for (const c of String(id || "new")) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function songForSpecies(species) {
  const { stats } = statsFor(species);
  const answers = species.answers || {};
  const share = (id, pool = 100) => Math.min(1, (Number(stats[id]) || 0) / pool);
  const temperament = String(answers[keyFor("temperament")] || "");
  const base = generateSong("signal", seedFrom(species.id));

  const scale = (SCALE_BY_TEMPERAMENT.find(([re]) => re.test(temperament)) || [null, base.scale])[1];
  const vol = (x) => Math.max(0.15, Math.min(1, 0.25 + x * 1.5));
  const heavy = share("strength") + share("agility") > 0.6;
  let arp = base.arp;
  // a long memory repeats its motif; a restless mind keeps varying it
  if (share("memory") > 0.3) arp = [...arp.slice(0, 8), ...arp.slice(0, 8)];
  // a specialist holds one chord; a generalist wanders
  const progression = share("specialization", 50) > 0.6 ? [0, 0, 0, 0] : base.progression;

  return sanitizeSong({
    ...base,
    tempo: Math.round(62 + Math.sqrt(share("agility")) * 96),
    scale,
    progression,
    arp,
    layers: {
      drone: { on: true, vol: vol(share("durability")) },
      pad: { on: true, vol: vol(share("social")) },
      arp: { on: true, vol: vol(share("problem_solving")) },
      bass: { on: share("strength") > 0.15, vol: vol(share("strength")) },
      drums: { on: heavy, vol: vol(share("endurance")) },
      texture: { on: true, vol: vol(share("sensory", 50) * 0.6) },
    },
  });
}

// One signal plays at a time across the page.
let current = null;

export function stopSignal() {
  if (!current) return;
  const c = current;
  current = null;
  clearInterval(c.timer);
  clearTimeout(c.end);
  const t = c.ctx.currentTime;
  c.graph.master.gain.setTargetAtTime(0, t, 0.15);
  stopSustained(c.graph, t + 0.8);
  setTimeout(() => c.ctx.close().catch(() => {}), 1200);
  c.onEnd && c.onEnd();
}

// Plays about `seconds` of the species' signal, fading in and out.
export function playSignal(species, { seconds = 14, onEnd } = {}) {
  stopSignal();
  const AC = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return;
  const song = songForSpecies(species);
  const ctx = new AC();
  const graph = buildGraph(ctx);
  applyMix(graph, song);
  const t0 = ctx.currentTime + 0.08;
  graph.master.gain.setValueAtTime(0.0001, t0);
  graph.master.gain.linearRampToValueAtTime(0.8, t0 + 1.5);
  graph.master.gain.setValueAtTime(0.8, t0 + seconds - 2.5);
  graph.master.gain.linearRampToValueAtTime(0.0001, t0 + seconds);
  startSustained(graph, song, t0);

  const stepDur = 60 / song.tempo / 4;
  const c = { ctx, graph, next: t0, stepIndex: 0, onEnd };
  c.timer = setInterval(() => {
    while (c.next < ctx.currentTime + 0.2 && c.next < t0 + seconds) {
      scheduleStep(graph, song, c.stepIndex, c.next);
      c.stepIndex = (c.stepIndex + 1) % (STEPS * 4);
      c.next += stepDur;
    }
  }, 50);
  c.end = setTimeout(() => { if (current === c) stopSignal(); }, seconds * 1000 + 300);
  current = c;
}
