// Donaghy Castle: the map. A tile grid built from room rectangles, with
// doors carved through the walls. Everything here is plain data + small
// helpers (walkability, line of sight, path finding) shared by the engine
// and the renderer. Update 5.94: a third bigger, with the round table.

export const TILE = 32;
export const W = 80;
export const H = 58;

export const ROOMS = [
  { id: "tower", name: "North Tower", x: 2, y: 2, w: 12, h: 11, floor: "stone", trace: "Clock oil on the flagstones" },
  { id: "library", name: "Library", x: 15, y: 2, w: 17, h: 11, floor: "wood", trace: "A torn page underfoot" },
  { id: "throne", name: "Throne Room", x: 33, y: 2, w: 18, h: 11, floor: "carpet", trace: "A fleck of gold leaf" },
  { id: "chapel", name: "Chapel", x: 53, y: 2, w: 12, h: 11, floor: "stone", trace: "Drips of candle wax" },
  { id: "armory", name: "Armory", x: 66, y: 2, w: 11, h: 11, floor: "stone", trace: "A smear of armour oil" },
  { id: "kitchen", name: "Kitchen", x: 2, y: 18, w: 13, h: 16, floor: "flag", trace: "A trail of flour" },
  { id: "hall", name: "Great Hall", x: 20, y: 18, w: 30, h: 16, floor: "wood", trace: "Crumbs from the banquet" },
  { id: "forge", name: "Forge", x: 55, y: 18, w: 11, h: 16, floor: "flag", trace: "Black soot smudges" },
  { id: "stables", name: "Stables", x: 67, y: 18, w: 10, h: 16, floor: "straw", trace: "Straw and horse hair" },
  { id: "dungeon", name: "Dungeon", x: 2, y: 39, w: 16, h: 14, floor: "dark", trace: "Rust from the cell bars" },
  { id: "cellar", name: "Wine Cellar", x: 19, y: 39, w: 12, h: 12, floor: "flag", trace: "A splash of claret" },
  { id: "courtyard", name: "Courtyard", x: 33, y: 39, w: 20, h: 15, floor: "grass", trace: "Wet grass on the boots" },
  { id: "gatehouse", name: "Gatehouse", x: 54, y: 39, w: 11, h: 12, floor: "stone", trace: "Chain grease" },
  { id: "well", name: "Well House", x: 66, y: 39, w: 11, h: 12, floor: "flag", trace: "Wet footprints" },
];

export const CORRIDORS = [
  { id: "upper", name: "Upper Gallery", x: 2, y: 14, w: 75, h: 3, floor: "corridor", trace: "Dust from the galleries" },
  { id: "lower", name: "Lower Gallery", x: 2, y: 35, w: 75, h: 3, floor: "corridor", trace: "Dust from the galleries" },
  { id: "west", name: "West Passage", x: 16, y: 17, w: 3, h: 18, floor: "corridor", trace: "Cobwebs from the passages" },
  { id: "east", name: "East Passage", x: 51, y: 17, w: 3, h: 18, floor: "corridor", trace: "Cobwebs from the passages" },
];

export const AREAS = [...ROOMS, ...CORRIDORS];

export const AREA_STYLE = {
  tower: { tiles: ["#3c4a66", "#35425c"], mini: "#5a6f9a", short: "Tower" },
  library: { tiles: ["#5a3f26", "#523822"], mini: "#8a6238", short: "Library" },
  throne: { tiles: ["#5a2230", "#511e2b"], mini: "#9a3a4e", short: "Throne" },
  chapel: { tiles: ["#575a6e", "#4f5265"], mini: "#8c90ad", short: "Chapel" },
  armory: { tiles: ["#2f5252", "#2a4949"], mini: "#4a8585", short: "Armory" },
  kitchen: { tiles: ["#6a5236", "#614a30"], mini: "#a07a4c", short: "Kitchen" },
  hall: { tiles: ["#6b4524", "#633f20"], mini: "#b07436", short: "Great Hall" },
  forge: { tiles: ["#4a2a22", "#42251e"], mini: "#8a4a32", short: "Forge" },
  stables: { tiles: ["#6e5a24", "#665320"], mini: "#b09a3c", short: "Stables" },
  dungeon: { tiles: ["#2b2a33", "#26252e"], mini: "#55536a", short: "Dungeon" },
  cellar: { tiles: ["#47253a", "#402134"], mini: "#7a3e62", short: "Cellar" },
  courtyard: { tiles: ["#2a4a2e", "#26442a"], mini: "#3f7a46", short: "Courtyard" },
  gatehouse: { tiles: ["#4f4639", "#484033"], mini: "#857660", short: "Gate" },
  well: { tiles: ["#294a5c", "#244354"], mini: "#3f7f9a", short: "Well" },
  upper: { tiles: ["#8a7558", "#807050"], mini: "#a38f6e", short: "" },
  lower: { tiles: ["#8a7558", "#807050"], mini: "#a38f6e", short: "" },
  west: { tiles: ["#8a7558", "#807050"], mini: "#a38f6e", short: "" },
  east: { tiles: ["#8a7558", "#807050"], mini: "#a38f6e", short: "" },
};

// Secret passages between the corner rooms, as in Clue: step on the
// trapdoor and hold E to come out in the opposite corner.
export const PASSAGES = [
  { a: [3, 11], b: [75, 49], name: "North Tower ↔ Well House" },
  { a: [75, 11], b: [3, 40], name: "Armory ↔ Dungeon" },
]
export function passageExit(tx, ty) {
  for (const p of PASSAGES) {
    if (p.a[0] === tx && p.a[1] === ty) return p.b;
    if (p.b[0] === tx && p.b[1] === ty) return p.a;
  }
  return null;
}

// open doorways (plain floor through a wall)
const DOORS = [
  [8, 13], [23, 13], [41, 13], [42, 13], [58, 13], [71, 13],
  [8, 17], [34, 17], [35, 17], [60, 17], [72, 17],
  [8, 34], [34, 34], [35, 34], [60, 34], [72, 34],
  [15, 25], [19, 25], [19, 26], [50, 25], [50, 26], [54, 24], [66, 26],
  [10, 38], [25, 38], [42, 38], [43, 38], [59, 38], [71, 38],
];
// locked doors: only the Locksmith and the Black Knight pass
export const LOCKED = [[32, 7], [65, 7], [18, 44], [65, 44]];
// the portcullis between Courtyard and Gatehouse (Black Knight can jam it)
export const PORTCULLIS = [53, 45];

// the Round Table in the Great Hall: solid to walk into, but you can see over it
export const TABLE = { x: 35 * TILE, y: 26 * TILE, r: 2.75 * TILE };

// tile codes
export const T_WALL = 0, T_FLOOR = 1, T_LOCKED = 2, T_PORT = 3, T_MOAT = 4, T_TABLE = 5, T_DECOR = 6;

// suits of armour standing along the Great Hall's walls (solid, see-through)
export const ARMOUR_STANDS = [
  [22, 18], [27, 18], [31, 18], [39, 18], [43, 18], [48, 18],
  [22, 33], [27, 33], [31, 33], [39, 33], [43, 33], [48, 33],
];

export function buildGrid() {
  const g = new Uint8Array(W * H).fill(T_WALL);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (x < 1 || y < 1 || x >= W - 2 || y >= 55) g[y * W + x] = T_MOAT;
  }
  for (const r of AREAS) for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) g[y * W + x] = T_FLOOR;
  for (const [x, y] of DOORS) g[y * W + x] = T_FLOOR;
  for (const [x, y] of LOCKED) g[y * W + x] = T_LOCKED;
  g[PORTCULLIS[1] * W + PORTCULLIS[0]] = T_PORT;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (Math.hypot((x + 0.5) * TILE - TABLE.x, (y + 0.5) * TILE - TABLE.y) < TABLE.r) g[y * W + x] = T_TABLE;
  }
  for (const [x, y] of ARMOUR_STANDS) g[y * W + x] = T_DECOR;
  return g;
}

export const GRID = buildGrid();
export const tileAt = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? T_WALL : GRID[y * W + x]);

// area lookup per tile, precomputed
const AREA_OF = new Array(W * H).fill(null);
for (const r of AREAS) for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) AREA_OF[y * W + x] = r;
export function areaAtTile(tx, ty) {
  if (tx < 0 || ty < 0 || tx >= W || ty >= H) return null;
  const a = AREA_OF[ty * W + tx];
  if (a) return a;
  // standing in a doorway: borrow a neighbour
  for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    const n = AREA_OF[(ty + dy) * W + (tx + dx)];
    if (n) return n;
  }
  return null;
}
export const areaAt = (px, py) => areaAtTile(Math.floor(px / TILE), Math.floor(py / TILE));
export const areaById = (id) => AREAS.find((a) => a.id === id);

// what blocks light and sight: walls, moat, closed locked doors
export function blocksSight(tx, ty) {
  const t = tileAt(tx, ty);
  return t === T_WALL || t === T_MOAT || t === T_LOCKED;
}

export function canWalkTile(tx, ty, who, world) {
  const t = tileAt(tx, ty);
  if (t === T_FLOOR) return true;
  if (t === T_LOCKED) return !!(who && who.canUnlock);
  if (t === T_PORT) return !world || !world.portcullisJammed;
  return false;
}

// line of sight between two pixel points
export function hasLOS(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const steps = Math.ceil(dist / 8);
  for (let i = 1; i < steps; i++) {
    const px = x1 + (dx * i) / steps, py = y1 + (dy * i) / steps;
    if (blocksSight(Math.floor(px / TILE), Math.floor(py / TILE))) return false;
  }
  return true;
}

// breadth-first path on the tile grid. Returns tile centres in pixels.
export function findPath(fromPx, fromPy, toTx, toTy, who, world) {
  const sx = Math.floor(fromPx / TILE), sy = Math.floor(fromPy / TILE);
  if (sx === toTx && sy === toTy) return [];
  const prev = new Int32Array(W * H).fill(-1);
  const start = sy * W + sx, goal = toTy * W + toTx;
  prev[start] = start;
  const q = [start];
  let head = 0;
  while (head < q.length) {
    const c = q[head++];
    if (c === goal) break;
    const cx = c % W, cy = (c / W) | 0;
    const hop = passageExit(cx, cy);
    const steps = hop ? [[1, 0], [-1, 0], [0, 1], [0, -1], [hop[0] - cx, hop[1] - cy]] : [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dx, dy] of steps) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const n = ny * W + nx;
      if (prev[n] !== -1) continue;
      if (!canWalkTile(nx, ny, who, world)) continue;
      prev[n] = c;
      q.push(n);
    }
  }
  if (prev[goal] === -1) return null;
  const path = [];
  let c = goal;
  while (c !== start) {
    path.push({ x: (c % W) * TILE + TILE / 2, y: ((c / W) | 0) * TILE + TILE / 2 });
    c = prev[c];
  }
  return path.reverse();
}

// random walkable tile inside an area (not on its edge)
export function randomTileIn(area, rnd = Math.random) {
  for (let i = 0; i < 40; i++) {
    const tx = area.x + 1 + Math.floor(rnd() * Math.max(1, area.w - 2));
    const ty = area.y + 1 + Math.floor(rnd() * Math.max(1, area.h - 2));
    if (tileAt(tx, ty) === T_FLOOR) return { tx, ty };
  }
  return { tx: area.x, ty: area.y };
}

// chore stations. kind "chore" are tasks; "fixLights"/"fixGate" repair
// sabotage; "bell" calls a meeting; "cell" is where the Locksmith frees a prisoner.
export const STATIONS = [
  { id: "clock", kind: "chore", label: "Wind the tower clock", area: "tower", tx: 7, ty: 4 },
  { id: "scrolls", kind: "chore", label: "Dust the old scrolls", area: "library", tx: 19, ty: 4 },
  { id: "throne", kind: "chore", label: "Polish the throne", area: "throne", tx: 42, ty: 4 },
  { id: "candles", kind: "chore", label: "Light the chapel candles", area: "chapel", tx: 59, ty: 4 },
  { id: "armour", kind: "chore", label: "Polish the armour", area: "armory", tx: 70, ty: 5 },
  { id: "swords", kind: "chore", label: "Sharpen the swords", area: "armory", tx: 73, ty: 10 },
  { id: "stew", kind: "chore", label: "Stir the stew", area: "kitchen", tx: 5, ty: 21 },
  { id: "bread", kind: "chore", label: "Knead the bread", area: "kitchen", tx: 11, ty: 30 },
  { id: "sheba", kind: "chore", label: "Feed Sheba", area: "kitchen", tx: 12, ty: 20 },
  { id: "table", kind: "chore", label: "Lay the Round Table", area: "hall", tx: 35, ty: 22 },
  { id: "bellows", kind: "chore", label: "Pump the forge bellows", area: "forge", tx: 60, ty: 21 },
  { id: "horses", kind: "chore", label: "Feed the horses", area: "stables", tx: 71, ty: 21 },
  { id: "stalls", kind: "chore", label: "Muck out the stalls", area: "stables", tx: 73, ty: 30 },
  { id: "wine", kind: "chore", label: "Fill the wine jugs", area: "cellar", tx: 22, ty: 42 },
  { id: "sweep", kind: "chore", label: "Sweep the courtyard", area: "courtyard", tx: 37, ty: 50 },
  { id: "winch", kind: "chore", label: "Oil the gate winch", area: "gatehouse", tx: 60, ty: 47 },
  { id: "water", kind: "chore", label: "Haul water from the well", area: "well", tx: 70, ty: 44 },
  { id: "scrub", kind: "chore", label: "Scrub the dungeon floor", area: "dungeon", tx: 14, ty: 42 },
  { id: "fixLights", kind: "fixLights", label: "Relight the torches from the forge", area: "forge", tx: 57, ty: 30 },
  { id: "fixGate", kind: "fixGate", label: "Free the jammed portcullis", area: "gatehouse", tx: 56, ty: 41 },
  { id: "bell", kind: "bell", label: "Ring the Great Bell", area: "hall", tx: 35, ty: 31 },
  { id: "cell", kind: "cell", label: "Unlock the prison cell", area: "dungeon", tx: 9, ty: 47 },
  { id: "passTower", kind: "passage", label: "Take the secret passage to the Well House", area: "tower", tx: 3, ty: 11 },
  { id: "passWell", kind: "passage", label: "Take the secret passage to the North Tower", area: "well", tx: 75, ty: 49 },
  { id: "passArmory", kind: "passage", label: "Take the secret passage to the Dungeon", area: "armory", tx: 75, ty: 11 },
  { id: "passDungeon", kind: "passage", label: "Take the secret passage to the Armory", area: "dungeon", tx: 3, ty: 40 },
];
export const stationById = (id) => STATIONS.find((s) => s.id === id);
export const CHORES = STATIONS.filter((s) => s.kind === "chore");

// where captured players end up, and where everyone gathers after a meeting
export const CELL_AREA = { tx: 3, ty: 46, w: 3, h: 3 };
export const HALL_CENTRE = { x: TABLE.x, y: TABLE.y };
export const GATHER_R = 4.3 * TILE;
export const BRAZIERS = [
  { x: 21.5 * TILE, y: 20 * TILE }, { x: 48.5 * TILE, y: 20 * TILE },
  { x: 21.5 * TILE, y: 32 * TILE }, { x: 48.5 * TILE, y: 32 * TILE },
];
export const FORGE_FIRE = { x: 60.5 * TILE, y: 21.5 * TILE };
export const WELL_POS = { x: 70.5 * TILE, y: 44.5 * TILE };
export const KITCHEN_BOWL = { x: 12.5 * TILE, y: 20.5 * TILE };
