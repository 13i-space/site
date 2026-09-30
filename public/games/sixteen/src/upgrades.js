// Choices between tides: pick one of three. Each changes how the run plays.

import { ARM_NAMES } from "./lore.js";
import { SPECIALTIES } from "./config.js";

const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

const TRAIN_TEXT = {
  grip: (n) => `${n} works faster still.`,
  sense: (n) => `${n} feels hidden faults sooner, and argues more wisely.`,
  anchor: (n) => `${n} holds even harder against the currents.`,
  signal: (n) => `${n} answers other Nerathi more clearly.`,
};

export const UPGRADES = [
  {
    id: "mature",
    weight: (g) => (g.maturedCount() < 16 ? 3.2 : 0),
    make: (g, rng) => {
      const arm = g.arms.find((a) => !a.mature);
      return {
        title: `${ARM_NAMES[arm.id]} awakens`,
        text: `A new limb joins you: ${SPECIALTIES[arm.specialty].label}, ${arm.personality}. (${g.maturedCount() + 1} of 16)`,
        tag: SPECIALTIES[arm.specialty].label,
        apply: () => g.matureArm(arm.id),
      };
    },
  },
  {
    id: "train",
    weight: (g) => (g.arms.some((a) => a.mature && a.level < 5) ? 1.6 : 0),
    make: (g, rng) => {
      const arm = pick(rng, g.arms.filter((a) => a.mature && a.level < 5));
      const spec = SPECIALTIES[arm.specialty];
      return {
        title: `Train ${ARM_NAMES[arm.id]}`,
        text: `${TRAIN_TEXT[arm.specialty](ARM_NAMES[arm.id])} (level ${arm.level} to ${arm.level + 1})`,
        tag: spec.label,
        apply: () => g.levelArm(arm.id),
      };
    },
  },
  { id: "chorus", weight: (g) => (g.mods.chorus < 2 ? 1 : 0), make: () => ({ title: "Chorus", text: "Extra limbs on the same fault work far faster together.", tag: "TEAMWORK", apply: (g) => { g.mods.chorus += 1; } }) },
  { id: "scars", weight: (g) => (g.mods.scars < 2 ? 0.9 : 0), make: () => ({ title: "Old scars", text: "Your body has weathered currents before. Each needs one fewer anchor.", tag: "CURRENTS", apply: (g) => { g.mods.scars += 1; } }) },
  { id: "listener", weight: (g) => (g.mods.listener < 2 ? 1 : 0), make: () => ({ title: "Patient listener", text: "You have longer to heed a disagreement, and listening builds trust faster.", tag: "DISSENT", apply: (g) => { g.mods.listener += 1; } }) },
  { id: "chamber", weight: (g) => (g.mods.chamber < 2 ? 0.8 : 0), make: () => ({ title: "Near chambers", text: "Limbs fetch replacement components twice as fast.", tag: "PARTS", apply: (g) => { g.mods.chamber += 1; } }) },
  { id: "glow", weight: (g) => (g.mods.glow < 3 ? 0.9 : 0), make: () => ({ title: "Bioluminescence", text: "The city recovers its light faster between faults.", tag: "LIGHT", apply: (g) => { g.mods.glow += 1; } }) },
  { id: "swift", weight: (g) => (g.mods.swift < 3 ? 1 : 0), make: () => ({ title: "Quick limbs", text: "Every limb reaches its work faster.", tag: "SPEED", apply: (g) => { g.mods.swift += 1; } }) },
  { id: "wander", weight: (g) => (g.mods.wander < 2 ? 0.8 : 0), make: () => ({ title: "Wandering minds", text: "Idle limbs sense hidden faults far more often.", tag: "SENSE", apply: (g) => { g.mods.wander += 1; } }) },
  { id: "steady", weight: (g) => (g.mods.steady < 2 ? 0.8 : 0), make: () => ({ title: "Old growth", text: "The network is sturdier: faults take longer to worsen.", tag: "NETWORK", apply: (g) => { g.mods.steady += 1; } }) },
  { id: "song", weight: (g) => (g.mods.song < 2 ? 0.6 : 0), make: () => ({ title: "Neighbor's song", text: "Calls from other Nerathi come more often, and answering them helps more.", tag: "CALLS", apply: (g) => { g.mods.song += 1; } }) },
];

// Three distinct choices, weighted.
export function offerUpgrades(g, rng) {
  const pool = UPGRADES.map((u) => ({ u, w: u.weight(g) })).filter((x) => x.w > 0);
  const out = [];
  while (out.length < 3 && pool.length) {
    const total = pool.reduce((s, x) => s + x.w, 0);
    let r = rng() * total;
    const i = pool.findIndex((x) => (r -= x.w) <= 0);
    const [chosen] = pool.splice(i < 0 ? 0 : i, 1);
    const offer = chosen.u.make(g, rng);
    out.push({ id: chosen.u.id, ...offer, apply: () => offer.apply(g) });
  }
  return out;
}
