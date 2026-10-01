// TACET - every number worth tuning lives here.
export const GAME_ID = "tacet"; // high_scores / daily_scores key on 13i.space

// logical play area; the canvas scales it to fit
export const VIEW = { w: 960, h: 640 };

export const GRID = {
  cols: 9,
  rows: 6,
  top: 112, // first row's centre
  rowGap: 64,
  left: 112,
  colGap: 92,
  radius: 50, // hex radius (drawn a little smaller)
};

export const HOLDER = {
  cap: 1, // how much a holder can carry at once
  perHit: 0.3, // the most of a single shock one holder can take
  digest: 0.08, // load digested per second
  wearPerLoad: 0.035, // permanent whitening per unit absorbed...
  strainAt: 0.7, // ...multiplied when a holder is carrying more than this
  strainMultiplier: 7,
  shareFraction: 0.85, // how much of its load a touch passes to neighbours
  shareCooldown: 0.75, // seconds before the same holder can share again
  releaseAfter: 2.2, // a spent holder is let go after this long
  riseAfter: 3.5, // ... and a young one rises into the gap after this long
};

export const SHOCK = {
  speed: 1.6, // rows per second
  warn: 1.35, // seconds of crack-glow before a shock falls
  baseEnergy: 1.5,
  energyPerTide: 0.14,
  energyJitter: 0.5,
  baseInterval: 2.6, // seconds between shocks in tide 1
  intervalPerTide: 0.15,
  minInterval: 0.7,
  fade: 0.985, // energy kept per row, even unabsorbed
};

export const TIDE = {
  length: 30, // seconds
  greatEvery: 5, // every 5th tide ends in a great tide
  greatColumns: 5,
  greatEnergy: 1.35,
};

export const YOUNG = {
  start: 40,
  max: 60,
  regrowEvery: 9, // seconds per new young
  lossPerEnergy: 9, // young lost per unit of shock reaching the still water
};

export const SCORE = {
  perAbsorbed: 10, // per unit of shock energy absorbed
  perTide: 250,
  perGreatTide: 1000,
};

export const COLORS = {
  ink: "#03040c",
  ice: "#28305e",
  membrane: [150, 165, 255],
  warm: "#E8CFC0",
  rust: "#C97B6E",
  lav: "#B9C0FF",
  lavMid: "#8B95F6",
  muted: "#6E76B8",
  text: "#DCDFFF",
};
