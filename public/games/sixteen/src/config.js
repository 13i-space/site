// SIXTEEN - every tunable number in one place.

export const GAME_ID = "sixteen"; // the high_scores / daily_scores key on 13i.space

// The whole game is laid out in this logical space, then scaled to fit the
// screen with its aspect kept - the full field is always visible.
export const VIEW = { w: 1000, h: 720 };
export const CENTER = { x: 500, y: 372 };

export const COLORS = {
  abyss: "#020a10",
  deep: "#04151f",
  water: "#0a2a38",
  conduit: "#1d4f5c",
  energy: "#6ff2e0", // bioluminescent cyan - the city's light
  energyWarm: "#ffc978", // amber - danger, heat, faults
  tissue: "#e89ab0", // living tissue / the creature
  shell: "#3b6b78",
  text: "#d8f3f0",
  muted: "#6f9aa3",
  dim: "#2c5560",
  sense: "#b89cff",
};

export const ARMS = {
  total: 16,
  startMature: 8, // a juvenile - the rest still learning
  tipSpeed: 430, // logical units / second
  baseWork: 1, // work units / second
  reach: 360,
};

export const SPECIALTIES = {
  grip: { label: "GRIP", color: "#ffc978", note: "works faster" },
  sense: { label: "SENSE", color: "#b89cff", note: "finds hidden faults, disagrees wisely" },
  anchor: { label: "ANCHOR", color: "#7fd1a8", note: "holds twice as hard" },
  signal: { label: "SIGNAL", color: "#6ff2e0", note: "answers calls, calms the others" },
};

export const PERSONALITIES = ["steady", "curious", "stubborn", "gentle", "restless", "patient"];

export const LIGHT = {
  max: 100,
  regen: 2.0, // per second when nothing is draining
};

export const TIDE = {
  length: 80, // seconds
  spawnStart: 3.3, // seconds between faults on tide 1
  spawnFactor: 0.91, // multiplied each tide
  spawnMin: 0.85,
  ruptureEvery: 5, // the Great Rupture closes every fifth tide
};

export const FAULTS = {
  breach: { work: 3.2, arms: 1, drain: 0.9, escalate: 12, escalatedDrain: 2.6, label: "BREACH" },
  overload: { work: 2.6, arms: 2, drain: 1.6, escalate: 14, escalatedDrain: 3.0, label: "OVERLOAD" },
  component: { work: 2.4, arms: 1, drain: 1.9, escalate: 16, escalatedDrain: 3.2, label: "BURNT COMPONENT", needsPart: true },
  hidden: { work: 3.0, arms: 1, drain: 0, burstAfter: [11, 17], burstHit: 12, escalatedDrain: 2.8, label: "HIDDEN FAULT" },
  call: { work: 1.6, arms: 1, drain: 0, expire: 14, label: "A CALL", optional: true, specialty: "signal" },
};

export const CURRENT = {
  firstTide: 4,
  every: [16, 24],
  warning: 4.2,
  duration: 3.0,
  failPenalty: 9, // light lost if under-anchored
};

export const DISSENT = {
  firstTide: 2,
  chance: 0.22,
  stubbornChance: 0.42,
  window: 3.6, // seconds to Listen
  rightChanceBase: 0.7,
  rightChanceSense: 0.9,
};

export const SCORE = {
  perSecond: 10, // x light fraction x multiplier
  repair: 60,
  comboWindow: 3.2,
  maxMult: 5,
  rupture: 2500,
  tideClear: 400,
};
