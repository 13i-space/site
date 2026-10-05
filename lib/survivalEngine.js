// The Survival Trials engine (Update 5.59): scores, matches, brackets and
// whole tournaments, for any list of species and any list of trials
// (lib/survivalTrials.js). Pure functions, no database: the pages hand it
// species rows (Kin species from Supabase, plus the Archive's).
//
// Design (Paul's brief):
//   - a trial weighs different attributes, so the best overall species
//     doesn't always win; the Continuance Index is an advantage, not a verdict
//   - controlled randomness: RANDOMNESS_FACTOR (below) widens or narrows it
//   - a match is first to 3 trial wins
//   - every eligible species enters; byes go to the top seeds when the field
//     isn't a power of two
//   - everything flows from one seed, so a tournament can be replayed exactly
//   - the result is shaped to be stored later: a weekly champion, and in
//     week 13 THE CHAMPIONS' CONTINUANCE among the 12 weekly champions

import { statsFor } from "./alienStats";
import { keyFor } from "./alienTraits";
import { TRIAL_LIBRARY, TOURNAMENT_TRIALS, trialById, normalized } from "./survivalTrials";

// ±12%: tune here. 0 = the stronger species on that trial always survives it.
export const RANDOMNESS_FACTOR = 0.12;
export const BONUS_POINTS = 8; // per answer that suits the trial
export const WINS_NEEDED = 3;
// How much of every trial is the species' general resilience (what the
// Continuance Index measures) rather than that trial's own attributes.
// Higher = the overall number matters more; lower = the scenario does.
export const GENERAL_WEIGHT = 0.35;

// small seeded random number generator
export function rng(seed) {
  let h = 2166136261;
  for (const c of String(seed)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function fits(trial, species) {
  const answers = species.answers || {};
  let n = trial.bonus.filter(([id, re]) => re.test(String(answers[keyFor(id)] || ""))).length;
  if (trial.continuance && species.review?.verdict === "granted") n += 1;
  return n;
}

// How a species does in one trial, before chance: 0..~110
export function baseScore(trial, species, norm = normalized(statsFor(species).stats)) {
  const entries = Object.entries(trial.w);
  const base = entries.reduce((n, [stat, w]) => n + w * (norm[stat] || 0), 0) / entries.reduce((n, [, w]) => n + w, 0);
  const f = fits(trial, species);
  return { score: base * 100 + f * BONUS_POINTS, fits: f };
}

// THE CONTINUANCE INDEX: how well-made a species is for surviving in
// general - its expected score across the whole trial library, plus 13i's
// own verdict. Derived from attributes now; later it can sit on a
// randomized "species potential pool" without changing anything that uses it.
function resilience(species, norm = normalized(statsFor(species).stats)) {
  const scores = TRIAL_LIBRARY.map((t) => baseScore(t, species, norm).score);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const verdict = species.review?.verdict;
  return mean + (verdict === "granted" ? 3 : verdict === "observation" ? 1.2 : 0);
}
export function continuanceIndex(species) {
  return Math.round(120 + resilience(species) * 3);
}

// One trial between two species, with chance
export function runTrial(trial, a, b, rand, norms = {}) {
  const roll = () => 1 + (rand() * 2 - 1) * RANDOMNESS_FACTOR;
  const sa = baseScore(trial, a, norms.a), sb = baseScore(trial, b, norms.b);
  const ga = norms.ga ?? resilience(a, norms.a), gb = norms.gb ?? resilience(b, norms.b);
  const mix = (trialScore, general) => trialScore * (1 - GENERAL_WEIGHT) + general * GENERAL_WEIGHT;
  let scoreA = Math.round(mix(sa.score, ga) * roll()), scoreB = Math.round(mix(sb.score, gb) * roll());
  if (scoreA === scoreB) (rand() < 0.5 ? scoreA++ : scoreB++);
  return { trial: { id: trial.id, name: trial.name, text: trial.text }, a: scoreA, b: scoreB, fitsA: sa.fits, fitsB: sb.fits, winner: scoreA > scoreB ? "a" : "b" };
}

// A match: the trials in order until one species has WINS_NEEDED
export function runMatch(a, b, trialIds = TOURNAMENT_TRIALS, rand = Math.random) {
  const norms = { a: normalized(statsFor(a).stats), b: normalized(statsFor(b).stats) };
  norms.ga = resilience(a, norms.a); norms.gb = resilience(b, norms.b);
  const trials = [];
  let wa = 0, wb = 0;
  for (const id of trialIds) {
    const t = trialById(id);
    if (!t) continue;
    const r = runTrial(t, a, b, rand, norms);
    trials.push(r);
    r.winner === "a" ? wa++ : wb++;
    if (wa === WINS_NEEDED || wb === WINS_NEEDED) break;
  }
  // a short list of trials could end level: the higher total endures
  if (wa === wb) {
    const ta = trials.reduce((n, r) => n + r.a, 0), tb = trials.reduce((n, r) => n + r.b, 0);
    if (ta >= tb) wa += 0.5; else wb += 0.5;
  }
  return { trials, winsA: Math.floor(wa), winsB: Math.floor(wb), winner: wa > wb ? "a" : "b" };
}

export function roundName(i, total, hasPlayIn) {
  const fromEnd = total - 1 - i;
  if (fromEnd === 0) return "The Final";
  if (fromEnd === 1) return "Semifinals";
  if (fromEnd === 2) return "Quarterfinals";
  if (i === 0 && hasPlayIn) return "Opening Round";
  return `Round of ${2 ** (fromEnd + 1)}`;
}

// standard seeding order for a bracket of n (1 v n, 2 v n-1 ... arranged so
// the top two can only meet in the final)
function seedOrder(n) {
  let order = [1];
  while (order.length < n) {
    const m = order.length * 2;
    order = order.flatMap((s) => [s, m + 1 - s]);
  }
  return order;
}

// The whole tournament, decided up front from one seed; the page reveals it.
// entrants: species rows. Returns { id, seed, kind, rounds, champion, ... }
export function runTournament(entrants, { seed = String(Date.now()), trials = TOURNAMENT_TRIALS, kind = "open", week = null, season = null } = {}) {
  const rand = rng(seed);
  const field = entrants.map((s) => ({ ...s, ci: continuanceIndex(s) }))
    .sort((x, y) => y.ci - x.ci || String(x.id).localeCompare(String(y.id)));
  const n = field.length;
  const empty = { id: `t-${seed}`, seed, kind, week, season, trials, entrants: field, rounds: [], champion: null, size: 0, byes: 0 };
  if (n < 2) return { ...empty, champion: field[0] || null };
  const size = 2 ** Math.ceil(Math.log2(n));
  const slots = seedOrder(size).map((s) => field[s - 1] || null); // null = a bye
  const record = Object.fromEntries(field.map((s) => [s.id, { w: 0, l: 0, trials: 0 }]));

  const totalRounds = Math.log2(size);
  const hasPlayIn = n !== size;
  const rounds = [];
  let current = slots;
  for (let r = 0; r < totalRounds; r++) {
    const matches = [];
    const next = [];
    for (let i = 0; i < current.length; i += 2) {
      const a = current[i], b = current[i + 1];
      const id = `r${r}m${i / 2}`;
      if (!a || !b) {
        const through = a || b;
        matches.push({ id, round: r, a, b, bye: true, winner: through ? (a ? "a" : "b") : null });
        next.push(through);
        continue;
      }
      const m = runMatch(a, b, trials, rand);
      record[a.id].trials += m.trials.filter((t) => t.winner === "a").length;
      record[b.id].trials += m.trials.filter((t) => t.winner === "b").length;
      const win = m.winner === "a" ? a : b, lose = m.winner === "a" ? b : a;
      record[win.id].w++; record[lose.id].l++;
      matches.push({ id, round: r, a, b, bye: false, ...m });
      next.push(win);
    }
    rounds.push({ index: r, name: roundName(r, totalRounds, hasPlayIn), matches });
    current = next;
  }
  const champion = current[0];
  return { ...empty, size, byes: size - n, rounds, champion, record };
}

// What a finished tournament would store (for weekly champions later):
// { tournament_id, kind: "weekly" | "champions", season, week, champion_id,
//   champion_name, continuance_index, record: "4-0", trials_won, seed }
export function championRecord(t) {
  if (!t.champion) return null;
  const r = t.record[t.champion.id];
  return { tournament_id: t.id, kind: t.kind, season: t.season, week: t.week, champion_id: t.champion.id, champion_name: t.champion.name, continuance_index: t.champion.ci, record: `${r.w}-${r.l}`, trials_won: r.trials, seed: t.seed };
}
