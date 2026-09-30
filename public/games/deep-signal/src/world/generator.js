// ProceduralWorldGenerator
//
// Every run's rooms are laid out along the 13i ring-eye mark: a stem
// (where the player lands, at its tip), a closed ring, and the dot at the
// ring's center - the 13i Node, which no corridor reaches. Random side
// branches, room types, contents and hazards change every run, and hide
// the shape until the final sequence pulls the camera back.
//
// Tiles: 0 rock (outside everything), 1 floor, 2 wall, 3 doorway.

import { makeRng } from "../core/rng.js";
import { ROOM_W, ROOM_H, GRID_W, GRID_H, TILE } from "../config.js";
import { FRAGMENTS } from "../lore/lore.js";

export const TW = GRID_W * ROOM_W;
export const TH = GRID_H * ROOM_H;

const CENTER = { x: 5, y: 4 };

// The ring, in walking order (offsets from CENTER). Closed loop.
const RING = [
  [0, -3], [1, -3], [2, -3], [2, -2], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [2, 2],
  [2, 3], [1, 3], [0, 3], [-1, 3], [-2, 3], [-2, 2], [-3, 2], [-3, 1], [-3, 0], [-3, -1],
  [-3, -2], [-2, -2], [-2, -3], [-1, -3],
];
const STEM = [[0, 4], [0, 5], [0, 6], [0, 7], [0, 8]]; // [0,8] is the landing site
const GATE = [0, 3]; // where the stem meets the ring

export const key = (cx, cy) => `${cx},${cy}`;
const DIRS = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] };
const OPP = { n: "s", s: "n", e: "w", w: "e" };

const ARTIFACT_IDS = ["art-lattice", "art-stylus", "art-shell", "art-ring", "art-tablet", "art-seed", "art-lens", "art-mark"];
const MARKER_IDS = ["dw-marker1", "dw-marker2", "dw-limbs", "dw-archive"];

export function generateWorld(seed) {
  const rng = makeRng(seed);
  const rooms = new Map();
  const doors = [];
  const tiles = new Uint8Array(TW * TH);
  const doorAt = new Map(); // tile index -> door

  const addRoom = (cx, cy, part) => {
    const r = {
      key: key(cx, cy), cx, cy, part, type: null, doors: {},
      objects: [], hazards: [], pillars: [],
      explored: false, visits: 0, lampsLit: false, tracks: [],
    };
    rooms.set(r.key, r);
    return r;
  };
  const at = (off) => [CENTER.x + off[0], CENTER.y + off[1]];

  // --- skeleton ---
  RING.forEach((o) => addRoom(...at(o), "ring"));
  STEM.forEach((o) => addRoom(...at(o), "stem"));
  const center = addRoom(CENTER.x, CENTER.y, "dot");

  const connect = (a, b, state = "open") => {
    const dx = b.cx - a.cx, dy = b.cy - a.cy;
    const dir = dx === 1 ? "e" : dx === -1 ? "w" : dy === 1 ? "s" : "n";
    const door = { id: doors.length, a: a.key, b: b.key, dir, state, revealed: state !== "hidden", sealTimer: 0, tiles: [] };
    a.doors[dir] = door;
    b.doors[OPP[dir]] = door;
    doors.push(door);
    return door;
  };

  for (let i = 0; i < RING.length; i++) {
    connect(rooms.get(key(...at(RING[i]))), rooms.get(key(...at(RING[(i + 1) % RING.length]))));
  }
  let prev = rooms.get(key(...at(GATE)));
  STEM.forEach((o) => {
    const r = rooms.get(key(...at(o)));
    connect(prev, r);
    prev = r;
  });

  // --- branches: optional rooms off the skeleton, never inside the ring ---
  const insideRing = (cx, cy) => Math.abs(cx - CENTER.x) < 3 && Math.abs(cy - CENTER.y) < 3;
  const free = (cx, cy) => cx >= 0 && cy >= 0 && cx < GRID_W && cy < GRID_H && !rooms.has(key(cx, cy)) && !insideRing(cx, cy);
  const skeleton = [...rooms.values()].filter((r) => r.part !== "dot" && r.key !== key(...at(STEM[STEM.length - 1])));
  const wanted = rng.int(6, 8);
  let tries = 0, made = 0;
  while (made < wanted && tries < 200) {
    tries++;
    const from = rng.pick(skeleton);
    const d = rng.pick(Object.keys(DIRS));
    const [nx, ny] = [from.cx + DIRS[d][0], from.cy + DIRS[d][1]];
    if (!free(nx, ny) || Object.keys(from.doors).includes(d)) continue;
    const r = addRoom(nx, ny, "branch");
    connect(from, r, rng.chance(0.45) ? "hidden" : "open");
    made++;
    if (rng.chance(0.4)) {
      const d2 = rng.pick(Object.keys(DIRS).filter((k) => k !== OPP[d]));
      const [mx, my] = [nx + DIRS[d2][0], ny + DIRS[d2][1]];
      if (free(mx, my)) connect(r, addRoom(mx, my, "branch"));
    }
  }

  // --- room types ---
  const start = rooms.get(key(...at(STEM[STEM.length - 1])));
  const gate = rooms.get(key(...at(GATE)));
  start.type = "landing";
  gate.type = "gate";
  center.type = "node";
  STEM.slice(0, -1).forEach((o) => { rooms.get(key(...at(o))).type = rng.pick(["ruins", "caverns", "ruins", "field"]); });

  const ringRooms = RING.map((o) => rooms.get(key(...at(o)))).filter((r) => r !== gate);
  // Warden zones gather at the top of the ring, farthest from the landing site
  const top = rng.shuffle(ringRooms.filter((r) => r.cy <= CENTER.y - 2));
  top.slice(0, 3).forEach((r) => { r.type = "warden"; });
  const pool = rng.shuffle([
    "relay", "relay", "relay", "relay", "relay",
    "walker", "walker", "walker",
    "anomaly", "anomaly",
    "field", "field", "field",
    "caverns", "caverns", "caverns",
  ]);
  rng.shuffle(ringRooms.filter((r) => !r.type)).forEach((r, i) => { r.type = pool[i] || "ruins"; });
  const branches = [...rooms.values()].filter((r) => r.part === "branch");
  branches.forEach((r, i) => { r.type = i === 0 ? "relay" : rng.pick(["ruins", "caverns", "walker", "anomaly", "ruins"]); });

  // --- carve tiles ---
  const set = (x, y, v) => { if (x >= 0 && y >= 0 && x < TW && y < TH) tiles[y * TW + x] = v; };
  const get = (x, y) => (x >= 0 && y >= 0 && x < TW && y < TH ? tiles[y * TW + x] : 0);
  rooms.forEach((r) => {
    const ox = r.cx * ROOM_W, oy = r.cy * ROOM_H;
    for (let y = 0; y < ROOM_H; y++) {
      for (let x = 0; x < ROOM_W; x++) {
        const edge = x === 0 || y === 0 || x === ROOM_W - 1 || y === ROOM_H - 1;
        set(ox + x, oy + y, edge ? 2 : 1);
      }
    }
  });
  // doorways: 3 tiles wide, cut through both rooms' walls
  doors.forEach((door) => {
    const a = rooms.get(door.a);
    const ox = a.cx * ROOM_W, oy = a.cy * ROOM_H;
    const cells = [];
    if (door.dir === "e" || door.dir === "w") {
      const x = door.dir === "e" ? ox + ROOM_W - 1 : ox;
      const x2 = door.dir === "e" ? x + 1 : x - 1;
      for (let y = 6; y <= 8; y++) cells.push([x, oy + y], [x2, oy + y]);
    } else {
      const y = door.dir === "s" ? oy + ROOM_H - 1 : oy;
      const y2 = door.dir === "s" ? y + 1 : y - 1;
      for (let x = 9; x <= 11; x++) cells.push([ox + x, y], [ox + x, y2]);
    }
    cells.forEach(([x, y]) => {
      set(x, y, 3);
      door.tiles.push(y * TW + x);
      doorAt.set(y * TW + x, door);
    });
  });

  // --- room interiors ---
  const lane = (x, y) => (y >= 5 && y <= 9) || (x >= 8 && x <= 12); // kept clear so every door connects
  const fragmentOrder = rng.shuffle(FRAGMENTS.map((_, i) => i));
  const artifactOrder = rng.shuffle(ARTIFACT_IDS);
  const markerOrder = rng.shuffle(MARKER_IDS);
  let fragN = 0, artN = 0, markN = 0;

  const worldPos = (r, tx, ty) => ({ x: (r.cx * ROOM_W + tx + 0.5) * TILE, y: (r.cy * ROOM_H + ty + 0.5) * TILE });
  const reachable = new Map(); // room key -> Set of "x,y" floor tiles reachable from the room's center
  const reach = (r) => {
    if (reachable.has(r.key)) return reachable.get(r.key);
    const ox = r.cx * ROOM_W, oy = r.cy * ROOM_H;
    const seen = new Set(["10,7"]);
    const queue = [[10, 7]];
    while (queue.length) {
      const [x, y] = queue.pop();
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
        if (nx < 1 || ny < 1 || nx > ROOM_W - 2 || ny > ROOM_H - 2 || seen.has(k)) return;
        if (get(ox + nx, oy + ny) !== 1) return;
        seen.add(k);
        queue.push([nx, ny]);
      });
    }
    reachable.set(r.key, seen);
    return seen;
  };
  const spots = (r) => {
    // free interior tiles away from walls that can actually be walked to
    const ok = reach(r);
    const s = [];
    for (let y = 2; y <= ROOM_H - 3; y++) for (let x = 2; x <= ROOM_W - 3; x++) {
      if (ok.has(`${x},${y}`)) s.push([x, y]);
    }
    return s;
  };
  const place = (r, obj, preferCenter = false) => {
    const taken = r.objects.map((o) => o._t);
    let options = spots(r).filter(([x, y]) => !taken.some((t) => Math.abs(t[0] - x) < 3 && Math.abs(t[1] - y) < 3));
    if (preferCenter) options = options.filter(([x, y]) => Math.abs(x - 10) <= 3 && Math.abs(y - 7) <= 2).concat(options);
    const [tx, ty] = preferCenter ? options[0] : rng.pick(options);
    Object.assign(obj, worldPos(r, tx, ty), { _t: [tx, ty], room: r.key });
    r.objects.push(obj);
    return obj;
  };

  rooms.forEach((r) => {
    const ox = r.cx * ROOM_W, oy = r.cy * ROOM_H;
    // pillars on a coarse grid, never in the door lanes (keeps rooms connected)
    const pillarChance = { ruins: 0.55, warden: 0.45, relay: 0.3, gate: 0.35, walker: 0.25, anomaly: 0.2, landing: 0.15 }[r.type] || 0;
    for (let py = 2; py <= ROOM_H - 4; py += 4) {
      for (let px = 2; px <= ROOM_W - 4; px += 4) {
        if (lane(px, py) || lane(px + 1, py + 1) || lane(px + 1, py) || lane(px, py + 1)) continue;
        if (!rng.chance(pillarChance)) continue;
        for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) set(ox + px + x, oy + py + y, 2);
        r.pillars.push([px, py]);
      }
    }
    // caverns: ragged walls
    if (r.type === "caverns") {
      for (let x = 1; x < ROOM_W - 1; x++) {
        if (lane(x, 1)) continue;
        const d1 = rng.int(0, 2), d2 = rng.int(0, 2);
        for (let k = 1; k <= d1; k++) set(ox + x, oy + k, 2);
        for (let k = 1; k <= d2; k++) set(ox + x, oy + ROOM_H - 1 - k, 2);
      }
      for (let y = 1; y < ROOM_H - 1; y++) {
        if (lane(1, y)) continue;
        const d1 = rng.int(0, 2), d2 = rng.int(0, 2);
        for (let k = 1; k <= d1; k++) set(ox + k, oy + y, 2);
        for (let k = 1; k <= d2; k++) set(ox + ROOM_W - 1 - k, oy + y, 2);
      }
    }
  });

  // contents by type
  rooms.forEach((r) => {
    const ox = r.cx * ROOM_W, oy = r.cy * ROOM_H;
    switch (r.type) {
      case "landing":
        place(r, { type: "energy", charge: 45 });
        break;
      case "gate":
        place(r, { type: "gate" }, true);
        break;
      case "node":
        place(r, { type: "node" }, true);
        break;
      case "relay":
        place(r, { type: "relay", fragment: fragmentOrder[fragN++ % fragmentOrder.length], state: "idle" }, true);
        place(r, { type: "lamp" }); place(r, { type: "lamp" });
        break;
      case "ruins":
        place(r, { type: "artifact", lore: artifactOrder[artN++ % artifactOrder.length], hidden: rng.chance(0.5), state: "idle" });
        if (rng.chance(0.35)) place(r, { type: "lamp" });
        break;
      case "caverns":
        r.dark = true;
        for (let i = 0; i < rng.int(2, 3); i++) {
          const p = place(r, { type: "vent-site" });
          r.hazards.push({ type: "vent", x: p.x, y: p.y, r: 46, period: rng.range(3.5, 5.5), phase: rng.range(0, 6) });
        }
        if (rng.chance(0.5)) place(r, { type: "artifact", lore: artifactOrder[artN++ % artifactOrder.length], hidden: true, state: "idle" });
        break;
      case "field": {
        // strips of charged ground across the room, crossing the lanes on a rhythm
        const vertical = rng.chance(0.5);
        const n = rng.int(2, 3);
        for (let i = 0; i < n; i++) {
          const along = vertical ? 4 + i * 5 + rng.int(0, 1) : 3 + i * 4;
          const period = rng.range(2.6, 3.8);
          const hz = vertical
            ? { x: (ox + along) * TILE, y: (oy + 1) * TILE, w: TILE * 2, h: (ROOM_H - 2) * TILE }
            : { x: (ox + 1) * TILE, y: (oy + along) * TILE, w: (ROOM_W - 2) * TILE, h: TILE * 2 };
          r.hazards.push({ type: "field", ...hz, period, phase: i * 1.3 + rng.range(0, 1) });
        }
        place(r, { type: "energy", charge: 35 });
        break;
      }
      case "walker":
        place(r, { type: "marker", lore: markerOrder[markN++ % markerOrder.length], state: "idle" });
        r.walkerSite = true;
        break;
      case "anomaly": {
        const kind = rng.pick(["well", "time"]);
        const p = place(r, { type: "anomaly", kind, state: "idle" }, true);
        if (kind === "well") r.hazards.push({ type: "well", x: p.x, y: p.y, r: 260 });
        if (kind === "time") r.hazards.push({ type: "slow", x: p.x, y: p.y, r: 200 });
        place(r, { type: "trace", hidden: true, state: "idle" });
        break;
      }
      case "warden":
        r.wardenZone = true;
        place(r, { type: "wterminal", state: "idle" });
        place(r, { type: "lamp" }); place(r, { type: "lamp" });
        break;
      default:
        break;
    }
  });

  // --- guarantees across the whole run ---
  const walkable = [...rooms.values()].filter((r) => r.type !== "node");
  const ringOnly = walkable.filter((r) => r.part === "ring" && r.type !== "gate");

  // puzzle terminals: one of each kind, in distinct ring rooms
  const puzzleKinds = ["alignment", "routing", "frequency", "sequence"];
  rng.shuffle(ringOnly.filter((r) => ["ruins", "relay", "warden", "field", "caverns"].includes(r.type)))
    .slice(0, puzzleKinds.length)
    .forEach((r, i) => place(r, { type: "terminal", puzzle: puzzleKinds[i], solved: false }));

  // glyph stones for the Symbol Sequence - order is per run
  const sequence = rng.shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 4);
  rng.shuffle(walkable.filter((r) => r.type !== "gate" && r.type !== "landing")).slice(0, 4).forEach((r, i) => {
    place(r, { type: "glyph", glyph: sequence[i], order: i + 1, hidden: true });
  });

  // energy: no room on the main path is more than two rooms from a source
  const path = [start, ...STEM.slice(0, -1).reverse().map((o) => rooms.get(key(...at(o)))), gate];
  const ringFromGate = [];
  const gi = RING.findIndex((o) => o[0] === GATE[0] && o[1] === GATE[1]);
  for (let i = 1; i < RING.length; i++) ringFromGate.push(rooms.get(key(...at(RING[(gi + i) % RING.length]))));
  let since = 0;
  [...path, ...ringFromGate].forEach((r) => {
    const has = r.objects.some((o) => o.type === "energy");
    since = has ? 0 : since + 1;
    if (since >= 3) {
      place(r, { type: "energy", charge: 35 });
      since = 0;
    }
  });
  // plus a reward at the end of some branches
  branches.forEach((r) => {
    if (rng.chance(0.5)) place(r, { type: "energy", charge: 40 });
    if (rng.chance(0.6)) place(r, { type: "artifact", lore: artifactOrder[artN++ % artifactOrder.length], hidden: rng.chance(0.5), state: "idle" });
  });

  // ids + lamps
  let oid = 0;
  rooms.forEach((r) => r.objects.forEach((o) => { o.id = oid++; if (o.type === "lamp") o.on = false; }));

  return {
    seed,
    rng,
    rooms,
    doors,
    tiles,
    doorAt,
    sequence,
    startRoom: start,
    gateRoom: gate,
    nodeRoom: center,
    start: worldPos(start, 10, 9),
    ringKeys: RING.map((o) => key(...at(o))),
    stemKeys: STEM.map((o) => key(...at(o))),
    tileAt: get,
    roomAt(px, py) {
      return rooms.get(key(Math.floor(px / (ROOM_W * TILE)), Math.floor(py / (ROOM_H * TILE))));
    },
  };
}
