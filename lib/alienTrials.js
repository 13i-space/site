// Survival Trials: two Alien Lab species face the same run of disasters and
// the one that comes through more of them outlasts the other. Nobody fights;
// it's about which species the galaxy lets keep going.
//
// Each trial weighs some of the twelve stats (lib/alienStats.js), plus a small
// bonus when a species' answers suit that trial (an ice world in a long
// winter). Four trials are picked from the pool by the pair itself, so the
// same two species always get the same result; the fifth is always the
// Continuance Test, 13i's own question - can the species cooperate?

import { STAT_GROUPS, statsFor } from "./alienStats";
import { keyFor } from "./alienTraits";

const TRIALS = [
  { name: "The Long Winter", text: "Their star dims for ten thousand years.", w: { endurance: 2, durability: 2, adaptability: 1, longevity: 1 }, bonus: [["terrain", /^Ice/], ["exterior", /^Fur/]] },
  { name: "The Plague", text: "A sickness no one has seen before crosses the planet.", w: { durability: 3, social: 1, adaptability: 1, reproduction: 2 }, bonus: [["exterior", /exoskeleton/]] },
  { name: "The Apex Predator", text: "Something bigger and hungrier arrives.", w: { strength: 2, agility: 2, sensory: 1, problem_solving: 1, reproduction: 1 }, bonus: [["temperament", /^Cautious/], ["size", /^Massive/]] },
  { name: "The Famine", text: "Food runs short for a hundred generations.", w: { endurance: 2, memory: 1, generalism: 2 }, bonus: [["size", /^(Insect|Small)/]] },
  { name: "Ecosystem Collapse", text: "The web of life they depend on unravels.", w: { adaptability: 2, generalism: 3, problem_solving: 1, reproduction: 1 }, bonus: [["core_value", /^Survival/]] },
  { name: "The Rising Seas", text: "The oceans climb and swallow the lowlands.", w: { adaptability: 2, agility: 1, problem_solving: 1 }, bonus: [["terrain", /^Ocean/], ["locomotion", /^(Swimming|Flying)/]] },
  { name: "First Contact", text: "A ship appears in their sky.", w: { social: 3, problem_solving: 1, memory: 1 }, bonus: [["temperament", /^Curious/]] },
  { name: "A Million Quiet Years", text: "Nothing changes. The best-fitted thrive.", w: { specialization: 3, memory: 1, endurance: 1, longevity: 2 }, bonus: [["core_value", /^Harmony/]] },
  { name: "The Impact", text: "An asteroid is coming. Who sees it first?", w: { sensory: 2, problem_solving: 2, durability: 1 }, bonus: [["terrain", /^Underground/], ["tech_level", /spacefaring|beyond/]] },
  { name: "Leaving Home", text: "The planet is dying. It's time to go.", w: { problem_solving: 2, endurance: 1, social: 1, adaptability: 1, longevity: 1 }, bonus: [["tech_level", /spacefaring|beyond/], ["tech_basis", /^Gravitational/]] },
];

// The Continuance Rule (docs/WORLD.md), as a trial. Always last. A species
// 13i has already granted continuance to gets a small extra bonus.
const CONTINUANCE = {
  name: "The Continuance Test",
  text: "13i arrives, and watches whether they can work together.",
  w: { social: 3, adaptability: 1, memory: 1 },
  bonus: [["social_structure", /family|collective/i], ["core_value", /^Harmony/]],
  continuance: true,
};

const TRIAL_COUNT = 5;
const BONUS = 8;

// Each stat as a share of the most it could be, 0..1. Spread evenly, a stat
// scores 0.5; everything in one stat scores 1. "generalism" is the flip side
// of specialization - what helps when the world changes.
function normalized(stats) {
  const out = {};
  STAT_GROUPS.forEach((g) => g.stats.forEach((s) => {
    out[s.id] = Math.sqrt(Math.min(1, (Number(stats[s.id]) || 0) / g.pool));
  }));
  const spec = STAT_GROUPS.find((g) => g.id === "ecological");
  out.generalism = Math.sqrt(Math.max(0, 1 - (Number(stats.specialization) || 0) / spec.pool));
  return out;
}

function trialScore(trial, norm, species) {
  const answers = species.answers || {};
  const entries = Object.entries(trial.w);
  const base = entries.reduce((n, [stat, w]) => n + w * norm[stat], 0) / entries.reduce((n, [, w]) => n + w, 0);
  let bonuses = trial.bonus.filter(([id, re]) => re.test(String(answers[keyFor(id)] || ""))).length;
  if (trial.continuance && species.review?.verdict === "granted") bonuses += 1;
  return { score: Math.round(base * 100 + bonuses * BONUS), fits: bonuses > 0 };
}

// small seeded shuffle, so the trials depend only on which two species meet
function seededOrder(seed, n) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export function runTrials(a, b) {
  const seed = [String(a.id), String(b.id)].sort().join("|");
  const picked = [...seededOrder(seed, TRIALS.length).slice(0, TRIAL_COUNT - 1).map((i) => TRIALS[i]), CONTINUANCE];
  const na = normalized(statsFor(a).stats);
  const nb = normalized(statsFor(b).stats);

  const rounds = picked.map((t) => {
    const sa = trialScore(t, na, a);
    const sb = trialScore(t, nb, b);
    return { ...t, a: sa, b: sb, winner: sa.score > sb.score ? "a" : sb.score > sa.score ? "b" : null };
  });
  const winsA = rounds.filter((r) => r.winner === "a").length;
  const winsB = rounds.filter((r) => r.winner === "b").length;
  const totalA = rounds.reduce((n, r) => n + r.a.score, 0);
  const totalB = rounds.reduce((n, r) => n + r.b.score, 0);
  const winner = winsA !== winsB ? (winsA > winsB ? "a" : "b") : totalA !== totalB ? (totalA > totalB ? "a" : "b") : null;
  return { rounds, winsA, winsB, totalA, totalB, winner };
}
