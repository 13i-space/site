// Murder in the Donaghy Castle - the Clue side of the night.
//
// Like the board game, every capture is a crime with three answers: WHO (the
// Black Knight), WITH WHAT (the weapon the Black Knight carries this round)
// and WHERE (the room it happened in). Each weapon lives on a stand in its
// own room; the one being used tonight leaves its stand empty. Doing a chore
// in a room is like being shown a card: you learn whether there was a
// struggle in that room this round, and something about one weapon.
//
// Plus the Donaghy Claymore: hidden somewhere in the castle at the start of
// the night. Anyone but the Black Knight can take it up and strike once.

// The marks a dropped helmet shows narrow the weapon to two (never one).
export const MARKS = {
  cut: "The helmet strap is cut clean through: a blade did this.",
  dent: "A great dent in the helmet: something heavy and blunt.",
  none: "Not a mark on the helmet. Something quieter did this...",
};

export const WEAPONS = [
  { id: "dagger", name: "Dagger", the: "the Dagger", home: "kitchen", mark: "cut", stand: [13, 24] },
  { id: "axe", name: "Battle-Axe", the: "the Battle-Axe", home: "armory", mark: "cut", stand: [75, 4] },
  { id: "mace", name: "Mace", the: "the Mace", home: "gatehouse", mark: "dent", stand: [63, 41] },
  { id: "candlestick", name: "Iron Candlestick", the: "the Iron Candlestick", home: "chapel", mark: "dent", stand: [54, 4] },
  { id: "rope", name: "Rope", the: "the Rope", home: "stables", mark: "none", stand: [68, 19] },
  { id: "goblet", name: "Poisoned Goblet", the: "the Poisoned Goblet", home: "cellar", mark: "none", stand: [20, 49] },
];
export const weaponById = (id) => WEAPONS.find((w) => w.id === id) || null;

// Where a crime can happen. The four corridors count as one place.
export const GALLERIES = "galleries";
export const CRIME_PLACES = [
  "tower", "library", "throne", "chapel", "armory", "kitchen", "hall", "forge",
  "stables", "dungeon", "cellar", "courtyard", "gatehouse", "well", GALLERIES,
];
export const placeOf = (area) => (!area ? null : area.floor === "corridor" ? GALLERIES : area.id);

// The Donaghy Claymore's hiding places (one is chosen each night)
export const CLAYMORE_SPOTS = [
  [3, 3, "behind the spiral stair in the North Tower"], [30, 9, "on top of a bookshelf in the Library"],
  [49, 11, "behind a tapestry in the Throne Room"], [21, 19, "under the Great Hall's banners"],
  [64, 32, "in the coal heap at the Forge"], [51, 52, "under a hedge in the Courtyard"],
  [76, 40, "down by the Well House trough"], [3, 51, "under the dungeon straw"], [13, 32, "inside a kitchen barrel"],
];

// Powers earned by a good accusation, for the next round
export const POWERUPS = {
  boots: { name: "Swift Boots", how: "you named the weapon", what: "You move a quarter faster." },
  lantern: { name: "Owl's Lantern", how: "you named the room", what: "Your torch shines further, even when the lights go out." },
  raven: { name: "The Raven", how: "you named weapon and room", what: "A raven brings you a free clue card." },
};
