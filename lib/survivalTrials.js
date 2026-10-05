// The Survival Trials library (Update 5.59). Every trial is configuration,
// not code: an id, a name, the line that sets the scene, the attributes it
// weighs (lib/alienStats.js ids, plus "generalism" - the flip side of
// specialization), and answer bonuses (a species whose world or body suits
// the trial). The battle engine (lib/survivalEngine.js) takes any list of
// these, so a tournament can draw a different subset each time once the
// library grows to 15-20.
//
// Language: survives, endures, adapts, outlasts, fails. Never combat.

import { STAT_GROUPS } from "./alienStats";

export const TRIAL_LIBRARY = [
  { id: "quiet-years", name: "A Million Quiet Years", text: "Nothing changes. The best-fitted thrive.", w: { specialization: 3, memory: 1, endurance: 1, longevity: 2 }, bonus: [["core_value", /^Harmony/]] },
  { id: "plague", name: "The Plague", text: "A sickness no one has seen before crosses the planet.", w: { endurance: 2, adaptability: 2, problem_solving: 1, social: 1, reproduction: 2 }, bonus: [["exterior", /exoskeleton/]] },
  { id: "rising-seas", name: "The Rising Seas", text: "The oceans climb and swallow the lowlands.", w: { adaptability: 2, agility: 2, endurance: 1, specialization: 1, longevity: 1 }, bonus: [["terrain", /^Ocean/], ["locomotion", /^(Swimming|Flying)/]] },
  { id: "apex", name: "The Apex Predator", text: "Something bigger and hungrier arrives.", w: { strength: 2, agility: 2, sensory: 2, durability: 1, adaptability: 1 }, bonus: [["temperament", /^Cautious/], ["size", /^Massive/]] },
  { id: "long-winter", name: "The Long Winter", text: "Their star dims for ten thousand years.", w: { endurance: 2, durability: 2, adaptability: 1, longevity: 1 }, bonus: [["terrain", /^Ice/], ["exterior", /^Fur/]] },
  { id: "famine", name: "The Famine", text: "Food runs short for a hundred generations.", w: { endurance: 2, memory: 1, generalism: 2 }, bonus: [["size", /^(Insect|Small)/]] },
  { id: "collapse", name: "Ecosystem Collapse", text: "The web of life they depend on unravels.", w: { adaptability: 2, generalism: 3, problem_solving: 1, reproduction: 1 }, bonus: [["core_value", /^Survival/]] },
  { id: "first-contact", name: "First Contact", text: "A ship appears in their sky.", w: { social: 3, problem_solving: 1, memory: 1 }, bonus: [["temperament", /^Curious/]] },
  { id: "impact", name: "The Impact", text: "An asteroid is coming. Who sees it first?", w: { sensory: 2, problem_solving: 2, durability: 1 }, bonus: [["terrain", /^Underground/], ["tech_level", /spacefaring|beyond/]] },
  { id: "leaving-home", name: "Leaving Home", text: "The planet is dying. It's time to go.", w: { problem_solving: 2, endurance: 1, social: 1, adaptability: 1, longevity: 1 }, bonus: [["tech_level", /spacefaring|beyond/], ["tech_basis", /^Gravitational/]] },
  // The Continuance Rule (docs/WORLD.md), as a trial: always last when used
  { id: "continuance", name: "The Continuance Test", text: "13i arrives, and watches whether they can work together.", w: { social: 3, adaptability: 1, memory: 1 }, bonus: [["social_structure", /family|collective/i], ["core_value", /^Harmony/]], continuance: true },
];

export const trialById = (id) => TRIAL_LIBRARY.find((t) => t.id === id);

// The five the tournament runs for now, in order.
export const TOURNAMENT_TRIALS = ["quiet-years", "plague", "rising-seas", "apex", "continuance"];

// Each stat as a share of the most it could be, 0..1 (square-rooted, so a
// species doesn't have to pour everything into one stat to score well).
export function normalized(stats) {
  const out = {};
  STAT_GROUPS.forEach((g) => g.stats.forEach((s) => {
    out[s.id] = Math.sqrt(Math.min(1, (Number(stats[s.id]) || 0) / g.pool));
  }));
  const spec = STAT_GROUPS.find((g) => g.id === "ecological");
  out.generalism = Math.sqrt(Math.max(0, 1 - (Number(stats.specialization) || 0) / spec.pool));
  return out;
}
