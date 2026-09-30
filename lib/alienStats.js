// The twelve attributes an Alien Lab species is built with. The creator
// splits a fixed pool of points across each group (Physical 100, Mental 100,
// Ecological & Sensory 50, Life Cycle 50); the split is saved on the species
// as `stats` (docs/v5.7-alien-stats.sql) and drives the card and the
// Survival Trials. Life Cycle came later (Update 5.12): species saved before
// it get those two estimated from their answers, keeping everything else.

import { keyFor } from "./alienTraits";

export const STAT_GROUPS = [
  {
    id: "physical",
    label: "Physical",
    pool: 100,
    color: "#E0A07A",
    stats: [
      { id: "strength", label: "Strength", abbr: "STR", desc: "Maximum lifting or pulling power relative to body size." },
      { id: "endurance", label: "Endurance", abbr: "END", desc: "Stamina to keep going over long distances or long stretches of time." },
      { id: "agility", label: "Speed / Agility", abbr: "AGI", desc: "Speed, flexibility, and coordination in movement." },
      { id: "durability", label: "Durability", abbr: "DUR", desc: "Resistance to injury, disease, and extreme environments." },
    ],
  },
  {
    id: "mental",
    label: "Mental",
    pool: 100,
    color: "#8B95F6",
    stats: [
      { id: "problem_solving", label: "Problem Solving", abbr: "PRB", desc: "Ability to overcome new obstacles or use tools." },
      { id: "memory", label: "Memory", abbr: "MEM", desc: "Capacity to store, keep, and recall information or places." },
      { id: "social", label: "Social Intelligence", abbr: "SOC", desc: "Skill at communicating, cooperating, and navigating a group." },
      { id: "adaptability", label: "Adaptability", abbr: "ADP", desc: "How fast they learn and change behaviour in new situations." },
    ],
  },
  {
    id: "ecological",
    label: "Ecological & Sensory",
    pool: 50,
    color: "#6FC3A8",
    stats: [
      { id: "sensory", label: "Sensory Acuity", abbr: "SNS", desc: "Power and range of sight, hearing, smell, or stranger senses like echolocation." },
      { id: "specialization", label: "Specialization", abbr: "SPC", desc: "How closely they fit one ecological niche, rather than surviving anywhere." },
    ],
  },
  {
    id: "lifecycle",
    label: "Life Cycle",
    pool: 50,
    color: "#E3A6C8",
    stats: [
      { id: "longevity", label: "Longevity", abbr: "LON", desc: "How long individuals live, and how much each one carries forward." },
      { id: "reproduction", label: "Reproduction", abbr: "REP", desc: "How quickly a population grows, and recovers after losses." },
    ],
  },
];

export const ALL_STATS = STAT_GROUPS.flatMap((g) => g.stats.map((s) => ({ ...s, group: g })));

export function evenStats() {
  const out = {};
  STAT_GROUPS.forEach((g) => g.stats.forEach((s) => { out[s.id] = g.pool / g.stats.length; }));
  return out;
}

export const groupTotal = (stats, group) => group.stats.reduce((n, s) => n + (Number(stats[s.id]) || 0), 0);

// A saved stats object is usable when every stat is there and no group
// spends more than its pool.
export function validStats(stats) {
  if (!stats || typeof stats !== "object") return false;
  return STAT_GROUPS.every((g) =>
    g.stats.every((s) => Number.isFinite(Number(stats[s.id])) && Number(stats[s.id]) >= 0) && groupTotal(stats, g) <= g.pool
  );
}

// Species made before stats existed get an estimate from their answers, so
// every card can show stats and enter the Survival Trials. Each rule nudges
// a stat's share of its group's pool; it's flavour, not science.
const RULES = {
  size: [[/^Insect/, { agility: 3, strength: -2, durability: -1, reproduction: 3, longevity: -1 }], [/^Small/, { agility: 2, reproduction: 1 }], [/^Large/, { strength: 2, durability: 1, agility: -1, longevity: 2 }], [/^Massive/, { strength: 3, durability: 2, agility: -2, longevity: 3, reproduction: -2 }]],
  gravity: [[/lighter/i, { agility: 1 }], [/heavier/i, { strength: 2 }], [/^Crushing/, { strength: 2, durability: 2 }]],
  atmosphere: [[/toxic/i, { durability: 2 }], [/^No atmosphere/, { durability: 3 }]],
  terrain: [[/^Ocean/, { specialization: 1 }], [/^Desert/, { endurance: 2 }], [/^Ice/, { durability: 1, endurance: 1 }], [/forest/i, { sensory: 1 }], [/^Underground/, { specialization: 2, sensory: 1 }]],
  limbs: [[/^(Six|Eight)/, { strength: 1, agility: 1 }], [/^None/, { agility: -1 }]],
  locomotion: [[/^Walking/, { endurance: 1 }], [/^Flying/, { agility: 3 }], [/^Swimming/, { agility: 1, endurance: 1 }], [/^Floating/, { endurance: 2, longevity: 1 }], [/rooted/i, { endurance: 2, agility: -3, specialization: 2, longevity: 2 }]],
  manipulation: [[/five fingers|thumb/i, { problem_solving: 1 }], [/^Tentacle/, { agility: 1 }], [/^No manipulating/, { problem_solving: -1 }]],
  exterior: [[/^Scales/, { durability: 1 }], [/exoskeleton/, { durability: 3 }], [/^Fur/, { endurance: 1 }], [/bioluminescent/, { social: 1 }]],
  primary_sense: [[/^(Sight|Hearing|Smell)/, { sensory: 1 }], [/^Vibration|electromagnetic/i, { sensory: 2, specialization: 1 }]],
  unique_sense: [[/^(Echolocation|Magnetic)/, { sensory: 2 }], [/emotional/, { social: 2, sensory: 1 }], [/time passing/, { memory: 1, sensory: 1 }]],
  temperament: [[/^Curious/, { problem_solving: 1, adaptability: 2 }], [/^Cautious/, { memory: 1, sensory: 1 }], [/^Aggressive/, { strength: 2 }], [/^Detached/, { endurance: 1 }]],
  social_structure: [[/^Solitary/, { problem_solving: 1, social: -2, longevity: 1 }], [/family/, { social: 1 }], [/collective/, { social: 3 }], [/hive/, { social: 2, memory: 1, adaptability: -1, reproduction: 2 }]],
  core_value: [[/^Knowledge/, { memory: 2, problem_solving: 1, longevity: 1 }], [/^Survival/, { endurance: 1, adaptability: 1, reproduction: 1 }], [/^Harmony/, { specialization: 1, social: 1 }], [/^Freedom/, { adaptability: 2 }]],
  tech_basis: [[/^Mechanical/, { problem_solving: 1 }], [/^Biological/, { adaptability: 1 }], [/^(Energy|Gravitational)/, { problem_solving: 2 }]],
  tech_level: [[/^Primitive/, { specialization: 1, reproduction: 1 }], [/comparable/, { problem_solving: 1 }], [/spacefaring/, { problem_solving: 2, adaptability: 1 }], [/beyond/, { problem_solving: 3, memory: 1, longevity: 2 }]],
};

export function estimateStats(answers = {}) {
  const weight = Object.fromEntries(ALL_STATS.map((s) => [s.id, 3]));
  Object.entries(RULES).forEach(([id, rules]) => {
    const value = String(answers[keyFor(id)] || "");
    rules.forEach(([re, bumps]) => {
      if (re.test(value)) Object.entries(bumps).forEach(([stat, n]) => { weight[stat] += n; });
    });
  });
  const out = {};
  STAT_GROUPS.forEach((g) => {
    const w = g.stats.map((s) => Math.max(0.5, weight[s.id]));
    const sum = w.reduce((a, b) => a + b, 0);
    const exact = w.map((x) => (x / sum) * g.pool);
    const whole = exact.map(Math.floor);
    // hand out the rounding leftovers to the largest remainders
    let left = g.pool - whole.reduce((a, b) => a + b, 0);
    exact.map((x, i) => [x - whole[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left-- > 0) whole[i] += 1; });
    g.stats.forEach((s, i) => { out[s.id] = whole[i]; });
  });
  return out;
}

// The stats a card shows: the creator's own, or an estimate for older
// species. Stats saved before Life Cycle existed keep every point the
// creator chose; only the missing group is estimated.
export function statsFor(species) {
  const saved = species?.stats;
  if (validStats(saved)) return { stats: saved, estimated: false };
  const estimate = estimateStats(species?.answers);
  if (saved && typeof saved === "object") {
    const merged = { ...estimate };
    STAT_GROUPS.forEach((g) => {
      if (g.stats.every((s) => Number.isFinite(Number(saved[s.id])))) g.stats.forEach((s) => { merged[s.id] = Number(saved[s.id]); });
    });
    if (validStats(merged) && Object.keys(saved).length) return { stats: merged, estimated: false };
  }
  return { stats: estimate, estimated: true };
}
