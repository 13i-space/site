// GameConfig - every tunable number in one place.

export const GAME_ID = "deep-signal"; // matches the high_scores / daily_scores game key on 13i.space

// Optional real artwork for the 13i symbol, relative to the game folder,
// e.g. "assets/13i-symbol.png". null = draw the mark's geometry.
export const SYMBOL_ASSET = null;

export const COLORS = {
  void: "#030303",
  charcoal: "#1a1a1f",
  stone: "#0b0b0d",
  stoneEdge: "#26262c",
  gray: "#7c7c84",
  dim: "#4a4a52",
  white: "#f4f1ea",
  gold: "#f3e3b5", // luminous pale gold - the game's one accent
  goldBright: "#fff4d6",
  goldDim: "#a8987a",
  danger: "#e8e0d0", // hazards read through brightness + shape, not color
};

export const TILE = 32;
export const ROOM_W = 21; // tiles, including walls
export const ROOM_H = 15;
export const GRID_W = 11; // rooms
export const GRID_H = 13;

export const PLAYER = {
  radius: 9,
  accel: 900,
  drag: 5.2,
  maxSpeed: 190,
  lowEnergySpeed: 120,
  lightRadius: 190,
  lowEnergyLight: 110,
};

export const COSTS = {
  scan: 10,
  pulse: 8,
  scanCooldown: 1.2,
  pulseCooldown: 3,
};

export const AWARENESS = {
  // thresholds for the Warden's states
  observing: 20,
  interfering: 45,
  defending: 70,
  confronting: 90,
  intercept: 100,
  decayPerSec: 0.05,
  wardenZonePerSec: 0.45,
};

export const SIGNAL = {
  gateThreshold: 50, // the Resonance Gate opens the way to the 13i Node
  connectionThreshold: 85, // reach the Node at or above this for THE CONNECTION
};

export const SCORE = {
  perSignal: 50,
  perDiscovery: 100,
  perIntegrity: 10,
  ending: { signal: 1000, connection: 3000, warden: 2000, terminated: 0 },
};
