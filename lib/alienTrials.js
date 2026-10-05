// Survival Trials: two Alien Lab species face the same run of disasters and
// the one that comes through more of them outlasts the other. Nobody fights;
// it's about which species the galaxy lets keep going.
//
// Each trial weighs some of the twelve stats (lib/alienStats.js), plus a small
// bonus when a species' answers suit that trial (an ice world in a long
// winter). Four trials are picked from the pool by the pair itself, so the
// same two species always get the same result; the fifth is always the
// Continuance Test, 13i's own question - can the species cooperate?

import { statsFor } from "./alienStats";
import { TRIAL_LIBRARY, normalized } from "./survivalTrials";
import { keyFor } from "./alienTraits";

// Since Update 5.59 the trials live in lib/survivalTrials.js (shared with
// the tournament engine).
const TRIALS = TRIAL_LIBRARY.filter((t) => !t.continuance);
const CONTINUANCE = TRIAL_LIBRARY.find((t) => t.continuance);

const TRIAL_COUNT = 5;
const BONUS = 8;

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
