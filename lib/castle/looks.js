// How each knight looks: tabard colour, helmet colour and style, weapon and
// the emblem on the tabard and shield. The player builds theirs before the
// night; computer players get a random one.

export const TABARDS = [
  "#C0392B", "#2E5FB8", "#2E8B57", "#D4A017", "#8E44AD", "#D9772B",
  "#1F9E9E", "#D46A9F", "#E8E4D8", "#8B5A2B", "#6FB7E8", "#9ACD32",
];
export const TABARD_NAMES = {
  "#C0392B": "Crimson", "#2E5FB8": "Royal blue", "#2E8B57": "Forest green", "#D4A017": "Gold",
  "#8E44AD": "Purple", "#D9772B": "Orange", "#1F9E9E": "Teal", "#D46A9F": "Rose",
  "#E8E4D8": "White", "#8B5A2B": "Brown", "#6FB7E8": "Sky blue", "#9ACD32": "Lime",
};
export const HELMET_COLORS = [
  ["#B9BEC9", "Steel"], ["#D9B54A", "Gold"], ["#B87333", "Bronze"],
  ["#E9ECF2", "Silver"], ["#5A5F6B", "Iron"], ["#8C3A2E", "Copper red"],
];
export const HELMET_STYLES = [
  ["greathelm", "Great helm"], ["kettle", "Kettle hat"], ["crown", "Crowned"],
  ["horned", "Horned"], ["plumed", "Plumed"], ["hood", "Hood"],
];
export const WEAPONS = [
  ["longsword", "Longsword"], ["shortsword", "Shortsword"], ["axe", "Battle axe"],
  ["bow", "Longbow"], ["mace", "Mace"], ["spear", "Spear"],
];
export const EMBLEMS = [
  ["cross", "St George's cross"], ["saltire", "Saltire"], ["chevron", "Chevron"],
  ["star", "Star"], ["lion", "Lion's paw"], ["plain", "Plain"],
];
export const TRIMS = ["#F2DC9A", "#FFFFFF", "#1B1B22", "#C0392B", "#2E5FB8"];

const pick = (a) => a[Math.floor(Math.random() * a.length)];

export function randomLook(tabard) {
  return {
    tabard,
    trim: pick(TRIMS.filter((t) => t.toLowerCase() !== tabard.toLowerCase())),
    helmet: pick(HELMET_COLORS)[0],
    helmetStyle: pick(HELMET_STYLES)[0],
    weapon: pick(WEAPONS)[0],
    emblem: pick(EMBLEMS)[0],
  };
}

export const DEFAULT_LOOK = {
  tabard: "#2E5FB8", trim: "#F2DC9A", helmet: "#B9BEC9", helmetStyle: "plumed", weapon: "longsword", emblem: "saltire",
};

const LOOK_KEY = "donaghy-knight-v1";
export function loadLook() {
  try {
    const l = JSON.parse(localStorage.getItem(LOOK_KEY) || "null");
    if (l && TABARDS.includes(l.tabard)) return { ...DEFAULT_LOOK, ...l };
  } catch { /* private window */ }
  return { ...DEFAULT_LOOK };
}
export function saveLook(l) {
  try { localStorage.setItem(LOOK_KEY, JSON.stringify(l)); } catch { /* private window */ }
}
