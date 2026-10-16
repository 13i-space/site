// Murder in the Donaghy Castle: everything drawn on the canvas - the
// castle (painted once to an offscreen canvas), the people, the torchlight
// and the joust.
import {
  TILE, W, H, ROOMS, CORRIDORS, STATIONS, LOCKED, PORTCULLIS, BRAZIERS, CELL_AREA, AREA_STYLE, PASSAGES,
  T_WALL, T_MOAT, T_FLOOR, T_TABLE, T_DECOR, tileAt, blocksSight, TABLE, ARMOUR_STANDS, FORGE_FIRE, WELL_POS, KITCHEN_BOWL, stationById,
} from "../../lib/castle/map";
import { look, nextJob } from "../../lib/castle/engine";
import { drawKnightTop, drawKnightSide, drawKnightFront, drawHorse } from "./knight";
import { drawCrest } from "./crest";

// a stable pseudo-random number per tile, so the stonework doesn't shimmer
const hash = (x, y) => { let h = x * 374761393 + y * 668265263; h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967295; };

export function paintCastle() {
  const cv = document.createElement("canvas");
  cv.width = W * TILE; cv.height = H * TILE;
  const g = cv.getContext("2d");
  // moat and the night outside
  g.fillStyle = "#0b1426"; g.fillRect(0, 0, cv.width, cv.height);
  for (let i = 0; i < 400; i++) {
    g.fillStyle = `rgba(90,120,170,${0.05 + hash(i, 7) * 0.08})`;
    g.fillRect(hash(i, 1) * cv.width, hash(i, 2) * cv.height, 6 + hash(i, 3) * 14, 1);
  }
  // walls: near-black stone blocks
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const t = tileAt(x, y);
    if (t === T_MOAT || t === T_FLOOR || t === T_TABLE || t === T_DECOR) continue;
    const px = x * TILE, py = y * TILE;
    g.fillStyle = "#101016"; g.fillRect(px, py, TILE, TILE);
    const off = (y % 2) * 8;
    for (let r = 0; r < 2; r++) for (let c = -1; c < 2; c++) {
      const bx = px + c * 16 + off + 1, by = py + r * 16 + 1, k = hash(x * 4 + c, y * 4 + r);
      g.fillStyle = `rgb(${24 + k * 12},${23 + k * 11},${30 + k * 12})`;
      const x0 = Math.max(px, bx), x1 = Math.min(px + TILE, bx + 14);
      if (x1 > x0) g.fillRect(x0, by, x1 - x0, 14);
    }
  }
  for (const r of [...CORRIDORS, ...ROOMS]) {
    const [a, b] = AREA_STYLE[r.id].tiles;
    for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) {
      g.fillStyle = (x + y) % 2 ? a : b; g.fillRect(x * TILE, y * TILE, TILE, TILE);
      const n = hash(x, y);
      if (r.floor === "wood") { g.fillStyle = "rgba(0,0,0,0.18)"; g.fillRect(x * TILE, y * TILE + (n > 0.5 ? 15 : 31), TILE, 1); }
      else if (r.floor === "grass") { g.fillStyle = "rgba(80,140,80,0.25)"; for (let k = 0; k < 4; k++) g.fillRect(x * TILE + hash(x + k, y) * 30, y * TILE + hash(x, y + k) * 30, 1, 4); }
      else if (r.floor === "straw") { g.strokeStyle = "rgba(200,170,90,0.25)"; g.beginPath(); for (let k = 0; k < 3; k++) { const sx = x * TILE + hash(x + k, y) * 30, sy = y * TILE + hash(x, y + k) * 30; g.moveTo(sx, sy); g.lineTo(sx + 7, sy + 2); } g.stroke(); }
      else if (r.floor === "corridor") { g.fillStyle = "rgba(0,0,0,0.16)"; g.fillRect(x * TILE, y * TILE + 15, TILE, 1); g.fillRect(x * TILE + ((y % 2) ? 8 : 24), y * TILE, 1, TILE); }
      else { g.strokeStyle = "rgba(0,0,0,0.22)"; g.strokeRect(x * TILE + 0.5, y * TILE + 0.5, TILE - 1, TILE - 1); }
    }
  }
  // doorways get a worn threshold
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    if (tileAt(x, y) !== 1) continue;
    const inArea = [...ROOMS, ...CORRIDORS].some((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h);
    if (!inArea) { g.fillStyle = "#8a7558"; g.fillRect(x * TILE, y * TILE, TILE, TILE); }
  }
  // a lit stone lip and a soft shadow wherever floor meets wall, so the
  // walls stand out from every floor
  const isWallish = (x, y) => { const t = tileAt(x, y); return t === T_WALL || t === T_MOAT; };
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    if (tileAt(x, y) !== T_FLOOR) continue;
    const px = x * TILE, py = y * TILE;
    if (isWallish(x, y - 1)) {
      const gr = g.createLinearGradient(0, py, 0, py + 12); gr.addColorStop(0, "rgba(0,0,0,0.55)"); gr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = gr; g.fillRect(px, py, TILE, 12);
      g.fillStyle = "#77738a"; g.fillRect(px, py - 4, TILE, 4);
      g.fillStyle = "#a29db5"; g.fillRect(px, py - 4, TILE, 1);
    }
    if (isWallish(x, y + 1)) { g.fillStyle = "#4a4758"; g.fillRect(px, py + TILE, TILE, 3); }
    if (isWallish(x - 1, y)) { g.fillStyle = "rgba(0,0,0,0.4)"; g.fillRect(px, py, 5, TILE); g.fillStyle = "#5e5a70"; g.fillRect(px - 3, py, 3, TILE); }
    if (isWallish(x + 1, y)) { g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(px + TILE - 4, py, 4, TILE); g.fillStyle = "#5e5a70"; g.fillRect(px + TILE, py, 3, TILE); }
  }
  // trapdoors to the secret passages
  for (const p of PASSAGES) for (const [x, y] of [p.a, p.b]) {
    const px = x * TILE, py = y * TILE;
    g.fillStyle = "#3b2612"; g.fillRect(px + 3, py + 3, TILE - 6, TILE - 6);
    g.strokeStyle = "#6b4a26"; g.lineWidth = 1;
    for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(px + 3, py + 3 + i * 6.5); g.lineTo(px + TILE - 3, py + 3 + i * 6.5); g.stroke(); }
    g.fillStyle = "#9a9aa8"; g.beginPath(); g.arc(px + TILE - 9, py + 16, 2.5, 0, 7); g.fill();
  }
  paintGreatHall(g);
  paintRoomDetails(g);
  // throne room carpet runner
  g.fillStyle = "#7a1d28"; g.fillRect(41 * TILE, 3 * TILE, 2 * TILE, 10 * TILE);
  g.fillStyle = "#c9a227"; g.fillRect(41 * TILE, 3 * TILE, 3, 10 * TILE); g.fillRect(43 * TILE - 3, 3 * TILE, 3, 10 * TILE);
  // Sheba's bowl in the kitchen
  g.fillStyle = "#6b3a1e"; g.beginPath(); g.ellipse(KITCHEN_BOWL.x, KITCHEN_BOWL.y + 10, 11, 7, 0, 0, 7); g.fill();
  g.fillStyle = "#c9a227"; g.font = "bold 7px Inter, sans-serif"; g.textAlign = "center"; g.fillText("SHEBA", KITCHEN_BOWL.x, KITCHEN_BOWL.y + 12);
  // dungeon cell bars
  const c = CELL_AREA;
  g.strokeStyle = "#7b7f8a"; g.lineWidth = 3;
  g.strokeRect(c.tx * TILE - 6, c.ty * TILE - 6, (c.w) * TILE + 12, c.h * TILE + 12);
  for (let i = 0; i <= c.w * 2; i++) { g.beginPath(); g.moveTo(c.tx * TILE - 6 + i * 16, c.ty * TILE - 6); g.lineTo(c.tx * TILE - 6 + i * 16, c.ty * TILE - 2); g.stroke(); }
  g.lineWidth = 1;
  // the well
  g.fillStyle = "#555"; g.beginPath(); g.arc(WELL_POS.x, WELL_POS.y, 20, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#0d1a33"; g.beginPath(); g.arc(WELL_POS.x, WELL_POS.y, 13, 0, Math.PI * 2); g.fill();
  // stations' props
  for (const s of STATIONS) drawProp(g, s);
  // room names, faint, painted into the floor
  g.textAlign = "center"; g.font = "italic 15px Fraunces, Georgia, serif";
  for (const r of ROOMS) { g.fillStyle = "rgba(230,215,180,0.18)"; g.fillText(r.name.toUpperCase(), (r.x + r.w / 2) * TILE, (r.y + r.h - 0.6) * TILE); }
  return cv;
}

function drawProp(g, s) {
  const x = s.tx * TILE + TILE / 2, y = s.ty * TILE + TILE / 2;
  g.save();
  g.translate(x, y);
  const p = s.id;
  if (p === "clock") { g.fillStyle = "#8a7a50"; g.beginPath(); g.arc(0, 0, 13, 0, 7); g.fill(); g.strokeStyle = "#222"; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -9); g.moveTo(0, 0); g.lineTo(6, 2); g.stroke(); }
  else if (p === "scrolls") { g.fillStyle = "#5b3b20"; g.fillRect(-15, -10, 30, 20); g.fillStyle = "#d9c9a0"; for (let i = 0; i < 4; i++) g.fillRect(-12 + i * 7, -7, 4, 14); }
  else if (p === "throne") { g.fillStyle = "#b8902a"; g.fillRect(-12, -12, 24, 24); g.fillStyle = "#7a1d28"; g.fillRect(-8, -6, 16, 14); }
  else if (p === "candles") { g.fillStyle = "#6b5a3a"; g.fillRect(-14, -5, 28, 10); g.fillStyle = "#f2e6c8"; for (let i = 0; i < 4; i++) g.fillRect(-11 + i * 7, -10, 3, 6); }
  else if (p === "armour") { g.fillStyle = "#9aa0ad"; g.beginPath(); g.arc(0, -6, 6, 0, 7); g.fill(); g.fillRect(-8, 0, 16, 12); }
  else if (p === "swords") { g.strokeStyle = "#c9ced8"; g.lineWidth = 2; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * 8, -12); g.lineTo(i * 8, 12); g.stroke(); } }
  else if (p === "stew") { g.fillStyle = "#222"; g.beginPath(); g.arc(0, 0, 13, 0, 7); g.fill(); g.fillStyle = "#7a4a22"; g.beginPath(); g.arc(0, 0, 9, 0, 7); g.fill(); }
  else if (p === "bread") { g.fillStyle = "#5b3b20"; g.fillRect(-15, -9, 30, 18); g.fillStyle = "#d8a85a"; g.beginPath(); g.ellipse(-5, 0, 7, 5, 0, 0, 7); g.ellipse(7, 0, 6, 4, 0, 0, 7); g.fill(); }
  else if (p === "table") { g.fillStyle = "#d8cfae"; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(-10 + i * 10, 0, 3, 0, 7); g.fill(); } }
  else if (p === "bellows" || p === "fixLights") { g.fillStyle = "#3a1d10"; g.fillRect(-14, -12, 28, 24); g.fillStyle = "#e0682a"; g.beginPath(); g.arc(0, 0, 8, 0, 7); g.fill(); g.fillStyle = "#ffd27a"; g.beginPath(); g.arc(0, 0, 4, 0, 7); g.fill(); }
  else if (p === "horses") { g.fillStyle = "#6a4426"; g.beginPath(); g.ellipse(0, 0, 16, 8, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(14, -5, 6, 4, -0.5, 0, 7); g.fill(); }
  else if (p === "stalls") { g.fillStyle = "#c9a54a"; g.beginPath(); g.ellipse(0, 0, 14, 9, 0, 0, 7); g.fill(); }
  else if (p === "wine") { g.fillStyle = "#5b3b20"; for (let i = -1; i <= 1; i++) { g.beginPath(); g.arc(i * 11, 0, 7, 0, 7); g.fill(); } g.strokeStyle = "#2a1a0d"; g.stroke(); }
  else if (p === "sweep") { g.strokeStyle = "#8b6a3a"; g.lineWidth = 3; g.beginPath(); g.moveTo(-10, 10); g.lineTo(8, -8); g.stroke(); g.fillStyle = "#c9a54a"; g.fillRect(-14, 6, 10, 8); }
  else if (p === "winch" || p === "fixGate") { g.fillStyle = "#555"; g.beginPath(); g.arc(0, 0, 11, 0, 7); g.fill(); g.strokeStyle = "#999"; g.lineWidth = 3; g.beginPath(); g.moveTo(-11, 0); g.lineTo(11, 0); g.moveTo(0, -11); g.lineTo(0, 11); g.stroke(); }
  else if (p === "water") { /* the well is painted separately */ }
  else if (p === "scrub") { g.fillStyle = "#6a5a40"; g.fillRect(-8, -5, 16, 10); g.fillStyle = "rgba(160,190,220,0.4)"; g.beginPath(); g.ellipse(4, 8, 12, 5, 0, 0, 7); g.fill(); }
  else if (p === "bell") {
    g.fillStyle = "#c9a227"; g.beginPath(); g.moveTo(-14, 12); g.quadraticCurveTo(-14, -14, 0, -16); g.quadraticCurveTo(14, -14, 14, 12); g.closePath(); g.fill();
    g.fillStyle = "#7a5e14"; g.beginPath(); g.arc(0, 13, 4, 0, 7); g.fill();
  } else if (p === "cell") { g.fillStyle = "#b8902a"; g.beginPath(); g.arc(0, -3, 6, 0, 7); g.fill(); g.fillRect(-2, 0, 4, 12); }
  g.restore();
}

// ---------- the live frame ----------
function drawPerson(g, e, world, me, t) {
  const L = look(world, e);
  const ghost = !e.alive;
  g.save();
  g.translate(e.x, e.y);
  if (ghost) g.globalAlpha = 0.4;
  g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(2, 6, 15, 9, 0, 0, 7); g.fill();
  if (e === me && me.role === "blackknight" && me.alive) {
    g.fillStyle = "rgba(170,20,30,0.25)"; g.beginPath(); g.arc(0, 0, 22 + Math.sin(t * 4) * 2, 0, 7); g.fill();
  }
  const moving = e.human || !e.path ? !!e.moving : e.path.length > 0 && !e.work;
  g.scale(1.2, 1.2);
  // on your own screen you see yourself as what you really are
  let lk = L.look, costume = null;
  if (e === me && me.alive && me.role === "blackknight") { lk = BK_LOOK; costume = "bk"; }
  if (e === me && me.alive && me.role === "jester") { lk = { ...JESTER_LOOK, weapon: me.look.weapon }; costume = "jester"; }
  drawKnightTop(g, lk, { costume, facing: e.facing, walk: e.walk || 0, moving, torch: e.alive && !(world.lightsOut && e.role !== "blacksmith"), t: t + e.id });
  g.restore();
  if (ghost) g.globalAlpha = 0.5;
  g.font = "600 11px Inter, system-ui, sans-serif"; g.textAlign = "center";
  g.fillStyle = e === me ? "#fff3c4" : "rgba(235,228,210,0.85)";
  g.fillText(e === me ? (me.disguiseAs !== null ? `${me.name} (you, disguised as ${L.name})` : `${me.name} (you)`) : L.name, e.x, e.y - 22);
  g.globalAlpha = 1;
}

const BK_LOOK = { tabard: "#16161c", trim: "#b01020", helmet: "#24242c", helmetStyle: "plumed", weapon: "longsword", emblem: "plain" };
const JESTER_LOOK = { tabard: "#7d3c98", trim: "#e9c64a", helmet: "#e9c64a", helmetStyle: "hood", weapon: "mace", emblem: "plain" };

// furniture and fittings so each room looks like what it is (painted once)
function paintRoomDetails(g) {
  const T = TILE;
  const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x * T, y * T, w * T, h * T); };
  const C = (x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x * T, y * T, r * T, 0, 7); g.fill(); };
  const books = (x, y, w) => {
    R(x, y, w, 0.9, "#3a2210");
    for (let i = 0; i < w * 5; i++) { g.fillStyle = ["#7a1d28", "#1d3a7a", "#2e5a2e", "#8a6a2a", "#5a3a6a", "#a0522d"][Math.floor(hash(i, x * 7 + y) * 6)]; g.fillRect(x * T + 2 + i * 6.2, y * T + 3, 5, T * 0.9 - 6); }
  };
  // Library: shelves on three walls, a reading table and a rug
  books(15, 2, 17); books(15, 11.1, 3); books(28, 11.1, 4);
  for (let y = 3.5; y < 11; y += 2) { R(15, y, 0.9, 1.6, "#3a2210"); R(31.1, y, 0.9, 1.6, "#3a2210"); }
  R(21, 6.5, 6, 3, "#5a1a2a"); R(21.2, 6.7, 5.6, 2.6, "#7a2a3a");
  R(22, 7.2, 4, 1.6, "#5b3b20"); C(23, 8, 0.18, "#f2e6c8"); C(23, 7.8, 0.12, "#ffcf6a");
  R(24.4, 7.5, 1, 0.7, "#e6d8b0"); // an open book
  // North Tower: a spiral stair and arrow slits
  C(10, 8, 2, "#2c3346");
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.strokeStyle = "#5a6f9a"; g.lineWidth = 2; g.beginPath(); g.moveTo(10 * T, 8 * T); g.lineTo(10 * T + Math.cos(a) * 2 * T, 8 * T + Math.sin(a) * 2 * T); g.stroke(); }
  C(10, 8, 0.4, "#5a6f9a");
  for (const x of [4, 8, 12]) R(x, 2, 0.25, 0.8, "#9ab0d8");
  // Throne Room: a raised dais, pillars and tapestries
  R(38, 2.2, 8, 3, "#4a3a2a"); R(38.4, 2.5, 7.2, 2.4, "#6b5a40");
  for (const x of [36, 48]) for (const y of [5, 8, 11]) { C(x, y, 0.55, "#2a2a30"); C(x, y, 0.42, "#6a6878"); }
  for (const x of [34, 47]) { R(x, 2.05, 2.5, 1.4, "#7a1d28"); R(x + 1, 2.3, 0.5, 0.9, "#e9c64a"); }
  // Chapel: pews facing the altar, stained glass, a gold cross
  for (let y = 6; y < 12; y += 1.5) { R(54.5, y, 4, 0.55, "#5b3b20"); R(60, y, 4, 0.55, "#5b3b20"); }
  R(56, 2.4, 6, 1.2, "#e8dcb8"); R(58.8, 2.2, 0.4, 1.6, "#e9c64a"); R(58.4, 2.6, 1.2, 0.35, "#e9c64a");
  for (let i = 0; i < 6; i++) R(53.5 + i * 2, 2, 1.2, 0.3, ["#c0392b", "#2e5fb8", "#e9c64a", "#2e8b57", "#8e44ad", "#c0392b"][i]);
  // Armory: weapon racks, shields on the wall and a straw training dummy
  for (let i = 0; i < 4; i++) { g.save(); g.translate((67 + i * 0.8) * T, 9 * T); g.strokeStyle = "#7a5a32"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 3 * T); g.stroke(); g.fillStyle = "#c9ced8"; g.beginPath(); g.moveTo(-4, 0); g.lineTo(0, -10); g.lineTo(4, 0); g.fill(); g.restore(); }
  for (let i = 0; i < 4; i++) { C(68 + i * 2.2, 2.6, 0.45, ["#C0392B", "#2E5FB8", "#2E8B57", "#D4A017"][i]); C(68 + i * 2.2, 2.6, 0.15, "#e9c64a"); }
  C(72, 8, 0.6, "#c9a54a"); R(71.9, 8.4, 0.2, 1.4, "#7a5a32"); R(71.3, 8.2, 1.4, 0.2, "#7a5a32");
  // Kitchen: a great hearth, a long table of food, hanging pots, barrels and sacks
  R(2, 22, 1.2, 5, "#2a2a30"); R(2.2, 22.6, 0.8, 3.8, "#5a1a0a"); C(2.6, 24.5, 0.5, "#e0682a"); C(2.6, 24.5, 0.25, "#ffd27a");
  R(5.5, 26, 6, 1.4, "#6b4a26");
  for (let i = 0; i < 7; i++) C(6 + i * 0.8, 26.7, 0.22, ["#c0392b", "#e9c64a", "#2e8b57", "#d9772b", "#8b5a2b", "#c0392b", "#9acd32"][i]);
  for (const x of [5, 7, 9]) { C(x, 18.6, 0.35, "#2a2a30"); C(x, 18.6, 0.22, "#4a4a55"); }
  for (const [x, y] of [[13, 31], [13.8, 31], [13, 32]]) { C(x, y, 0.4, "#6b4a26"); C(x, y, 0.3, "#7b5a36"); }
  for (const [x, y] of [[3, 31], [4, 32]]) C(x, y, 0.45, "#e8dcb8");
  // Forge: anvil, coal heap, tool rack, quench barrel
  R(58, 26, 1.6, 0.8, "#3a3a44"); R(58.3, 26.8, 1, 0.6, "#2a2a30");
  for (let i = 0; i < 9; i++) C(63 + hash(i, 3) * 2, 30 + hash(i, 4) * 2, 0.25, "#1a1a1e");
  for (let i = 0; i < 5; i++) R(56 + i * 0.6, 18.1, 0.12, 1.2, "#8a8f9a");
  C(63.5, 22, 0.55, "#4a2e14"); C(63.5, 22, 0.4, "#1d3a5a");
  // Stables: stall dividers, horses resting, hay bales
  for (let y = 18; y < 34; y += 3.2) R(74, y, 3, 0.2, "#5b3b20");
  for (const y of [19.5, 25.9]) { g.fillStyle = "#6a4426"; g.beginPath(); g.ellipse(75.5 * T, y * T, 1.1 * T, 0.5 * T, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(74.4 * T, (y - 0.3) * T, 0.35 * T, 0.25 * T, 0, 0, 7); g.fill(); }
  for (const [x, y] of [[68, 32], [69.2, 32], [68.6, 31]]) R(x, y, 1, 0.8, "#c9a54a");
  // Dungeon: chains on the walls, straw and puddles
  for (const x of [8, 11, 15]) for (let k = 0; k < 4; k++) C(x, 39.3 + k * 0.3, 0.1, "#7b7f8a");
  for (const [x, y] of [[12, 49], [15, 45]]) { g.fillStyle = "#6a5a30"; g.beginPath(); g.ellipse(x * T, y * T, T, 0.5 * T, 0.3, 0, 7); g.fill(); }
  for (const [x, y] of [[7, 43], [13, 51]]) { g.fillStyle = "rgba(90,120,170,0.35)"; g.beginPath(); g.ellipse(x * T, y * T, 0.8 * T, 0.4 * T, 0, 0, 7); g.fill(); }
  // Wine Cellar: racks of barrels
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { C(25 + i * 1.3, 45 + r * 1.8, 0.55, "#5b3b20"); C(25 + i * 1.3, 45 + r * 1.8, 0.35, "#7b5a36"); C(25 + i * 1.3, 45 + r * 1.8, 0.08, "#2a1a0d"); }
  // Courtyard: a cobbled path, a fountain, trees and flower beds
  R(42, 39, 2, 15, "#5a5a50");
  C(43, 45, 1.8, "#6a6560"); C(43, 45, 1.4, "#2d5a7a"); C(43, 45, 0.3, "#9ab0d8");
  for (const [x, y] of [[36, 42], [49, 42], [36, 51], [49, 51]]) { C(x, y + 0.2, 1.3, "rgba(0,0,0,0.25)"); C(x, y, 1.3, "#1f5a2a"); C(x - 0.3, y - 0.3, 0.8, "#2e7a3a"); }
  for (let i = 0; i < 14; i++) C(34 + hash(i, 9) * 18, 40 + hash(i, 10) * 13, 0.12, ["#e9c64a", "#d46a9f", "#f2efe6", "#c0392b"][i % 4]);
  // Gatehouse: guard benches, a weapon stand, murder holes overhead
  R(55, 49, 4, 0.6, "#5b3b20"); R(60, 49, 4, 0.6, "#5b3b20");
  for (let i = 0; i < 3; i++) for (let k = 0; k < 2; k++) C(58 + i * 1.5, 43 + k * 2, 0.18, "#1a1a1e");
  // Well House: buckets, a coil of rope and a trough
  for (const [x, y] of [[73, 41], [74, 42], [68, 48]]) { C(x, y, 0.35, "#6b4a26"); C(x, y, 0.25, "#2d5a7a"); }
  g.strokeStyle = "#c9a54a"; g.lineWidth = 2; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(68 * T, 41 * T, (0.15 + k * 0.1) * T, 0, 7); g.stroke(); }
  R(72, 47, 4, 0.8, "#5b3b20"); R(72.2, 47.15, 3.6, 0.5, "#2d5a7a");
  // torch sconces along the galleries
  for (let x = 6; x < 76; x += 8) for (const y of [14.05, 37.7]) { R(x, y, 0.3, 0.25, "#4a2e14"); C(x + 0.15, y + 0.1, 0.12, "#ffb43a"); }
}

function paintGreatHall(g) {
  // a long red carpet from door to door, and a great round rug under the table
  g.fillStyle = "#6a1822"; g.fillRect(33.6 * TILE, 18 * TILE, 2.8 * TILE, 16 * TILE);
  g.fillStyle = "#c9a227"; g.fillRect(33.6 * TILE, 18 * TILE, 3, 16 * TILE); g.fillRect(36.4 * TILE - 3, 18 * TILE, 3, 16 * TILE);
  g.fillStyle = "#5a1420"; g.beginPath(); g.arc(TABLE.x, TABLE.y, TABLE.r + 52, 0, 7); g.fill();
  g.strokeStyle = "#c9a227"; g.lineWidth = 4; g.beginPath(); g.arc(TABLE.x, TABLE.y, TABLE.r + 48, 0, 7); g.stroke();
  g.lineWidth = 1.5; g.beginPath(); g.arc(TABLE.x, TABLE.y, TABLE.r + 40, 0, 7); g.stroke();
  // the Round Table and its chairs
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const cx = TABLE.x + Math.cos(a) * (TABLE.r + 14), cy = TABLE.y + Math.sin(a) * (TABLE.r + 14);
    g.save(); g.translate(cx, cy); g.rotate(a);
    g.fillStyle = "#3a2210"; g.fillRect(-6, -9, 14, 18); g.fillStyle = "#7a1d28"; g.fillRect(-4, -7, 9, 14);
    g.restore();
  }
  g.fillStyle = "#2a1608"; g.beginPath(); g.arc(TABLE.x + 4, TABLE.y + 6, TABLE.r, 0, 7); g.fill();
  const wood = g.createRadialGradient(TABLE.x - 20, TABLE.y - 20, 10, TABLE.x, TABLE.y, TABLE.r);
  wood.addColorStop(0, "#8a5a2e"); wood.addColorStop(1, "#5a3818");
  g.fillStyle = wood; g.beginPath(); g.arc(TABLE.x, TABLE.y, TABLE.r - 2, 0, 7); g.fill();
  g.strokeStyle = "#c9a227"; g.lineWidth = 3; g.beginPath(); g.arc(TABLE.x, TABLE.y, TABLE.r - 8, 0, 7); g.stroke();
  // the twelve places, like the old painted table at Winchester
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    g.fillStyle = i % 2 ? "#e8dcb8" : "#2e5a2e";
    g.beginPath(); g.moveTo(TABLE.x, TABLE.y); g.arc(TABLE.x, TABLE.y, TABLE.r - 12, a, a + Math.PI / 6); g.closePath(); g.globalAlpha = 0.35; g.fill(); g.globalAlpha = 1;
    const px = TABLE.x + Math.cos(a + Math.PI / 12) * (TABLE.r - 22), py = TABLE.y + Math.sin(a + Math.PI / 12) * (TABLE.r - 22);
    g.fillStyle = "#d8cfae"; g.beginPath(); g.arc(px, py, 5, 0, 7); g.fill();
    g.fillStyle = "#b8902a"; g.beginPath(); g.arc(px + Math.cos(a) * 9, py + Math.sin(a) * 9, 2.5, 0, 7); g.fill();
  }
  // the Donaghy arms inlaid at the centre
  g.fillStyle = "#3a2410"; g.beginPath(); g.arc(TABLE.x, TABLE.y, 40, 0, 7); g.fill();
  g.strokeStyle = "#c9a227"; g.lineWidth = 2; g.beginPath(); g.arc(TABLE.x, TABLE.y, 40, 0, 7); g.stroke();
  g.save(); g.translate(TABLE.x, TABLE.y + 1); drawCrest(g, 62); g.restore();
  // suits of armour on plinths along the walls
  for (const [x, y] of ARMOUR_STANDS) {
    const cx = x * TILE + 16, cy = y * TILE + 16, top = y < 25;
    g.fillStyle = "#3c3a44"; g.fillRect(cx - 14, cy - 14, 28, 28);
    g.fillStyle = "#57545f"; g.fillRect(cx - 14, cy - 14, 28, 4);
    g.save(); g.translate(cx, cy); g.rotate(top ? Math.PI / 2 : -Math.PI / 2); g.scale(1.1, 1.1);
    drawKnightTop(g, { tabard: "#8a8f9a", trim: "#c9a227", helmet: "#c9ced8", helmetStyle: (x + y) % 3 === 0 ? "plumed" : (x + y) % 3 === 1 ? "greathelm" : "horned", weapon: "spear", emblem: "plain" }, { torch: false, steel: "#c9ced8" });
    g.restore();
  }
  // banners hung on the north and south walls, alternating red and blue
  for (let x = 21; x < 49; x += 3) {
    if (x >= 33 && x <= 36) continue;
    for (const y of [17, 34]) {
      const red = (x / 3) % 2 < 1;
      const bx = x * TILE + 4, by = y === 17 ? 17 * TILE + 6 : 34 * TILE + 2;
      g.fillStyle = red ? "#8a1d28" : "#1d3a7a"; g.fillRect(bx, by, 24, 22);
      g.fillStyle = "#e9c64a"; g.fillRect(bx + 10, by + 4, 4, 14); g.fillRect(bx + 5, by + 8, 14, 4);
    }
  }
  // iron braziers in the corners
  for (const b of BRAZIERS) {
    g.fillStyle = "#2a2a30"; g.beginPath(); g.arc(b.x, b.y, 15, 0, 7); g.fill();
    g.fillStyle = "#c2501e"; g.beginPath(); g.arc(b.x, b.y, 10, 0, 7); g.fill();
    g.fillStyle = "#ffcf6a"; g.beginPath(); g.arc(b.x, b.y, 5, 0, 7); g.fill();
  }
}

function drawBoat(g, me, world, t) {
  g.save(); g.translate(me.x, me.y); g.rotate(me.facing);
  // the wake
  for (let i = 1; i < 6; i++) { g.strokeStyle = `rgba(160,190,230,${0.3 - i * 0.05})`; g.lineWidth = 2; g.beginPath(); g.arc(-18 - i * 9, 0, 6 + i * 4, -0.9, 0.9); g.stroke(); }
  g.fillStyle = "#5b3b20"; g.beginPath(); g.ellipse(0, 0, 22, 10, 0, 0, 7); g.fill();
  g.fillStyle = "#7b5a36"; g.beginPath(); g.ellipse(0, 0, 18, 7, 0, 0, 7); g.fill();
  const row = Math.sin(t * 14) * 0.6;
  g.strokeStyle = "#c9a54a"; g.lineWidth = 2.5;
  for (const d of [-1, 1]) { g.beginPath(); g.moveTo(-2, d * 6); g.lineTo(-2 - Math.cos(row) * 10, d * (16 + Math.sin(row) * 4)); g.stroke(); }
  g.scale(0.85, 0.85);
  drawKnightTop(g, me.look, { facing: 0, torch: false, t });
  g.restore();
  g.font = "600 11px Inter, system-ui, sans-serif"; g.textAlign = "center"; g.fillStyle = "#fff3c4";
  g.fillText("Rowing round the moat...", me.x, me.y - 24);
}

function drawSheba(g, sh, t, wt) {
  g.save(); g.translate(sh.x, sh.y);
  g.fillStyle = "rgba(0,0,0,0.3)"; g.beginPath(); g.ellipse(2, 5, 16, 9, 0, 0, 7); g.fill();
  g.rotate(sh.facing);
  const leg = Math.sin(sh.run * 0.25) * 3;
  g.fillStyle = "#121214";
  for (const [lx, ly, o] of [[8, -6, 1], [8, 6, -1], [-8, -6, -1], [-8, 6, 1]]) { g.beginPath(); g.ellipse(lx + leg * o, ly, 3.5, 2.5, 0, 0, 7); g.fill(); }
  // tail: wags hard when petted or eating
  const wagging = wt < sh.wag || wt < sh.eating;
  const tw = Math.sin(t * (wagging ? 22 : 6)) * (wagging ? 0.9 : 0.35);
  g.strokeStyle = "#121214"; g.lineWidth = 3.5; g.lineCap = "round";
  g.beginPath(); g.moveTo(-12, 0); g.quadraticCurveTo(-18, tw * 6, -22, tw * 10); g.stroke();
  g.fillStyle = "#18181b"; g.beginPath(); g.ellipse(0, 0, 13, 7.5, 0, 0, 7); g.fill();
  // her white chest patch
  g.fillStyle = "#f2efe6"; g.beginPath(); g.ellipse(8, 0, 4.5, 3.5, 0, 0, 7); g.fill();
  g.fillStyle = "#18181b"; g.beginPath(); g.arc(15, 0, 6, 0, 7); g.fill();
  g.beginPath(); g.ellipse(20, 0, 4, 3, 0, 0, 7); g.fill();
  g.fillStyle = "#0b0b0c"; g.beginPath(); g.ellipse(13, -5, 3.5, 2, -0.4, 0, 7); g.ellipse(13, 5, 3.5, 2, 0.4, 0, 7); g.fill();
  g.fillStyle = "#000"; g.beginPath(); g.arc(23.5, 0, 1.6, 0, 7); g.fill();
  g.fillStyle = "#c0392b"; g.fillRect(9, -6, 2, 12); // her collar
  g.restore();
  g.font = "600 10px Inter, system-ui, sans-serif"; g.textAlign = "center"; g.fillStyle = "rgba(235,228,210,0.8)";
  g.fillText("Sheba", sh.x, sh.y - 16);
}

function drawNana(g, n, t) {
  g.save(); g.translate(n.x, n.y);
  g.fillStyle = "rgba(0,0,0,0.3)"; g.beginPath(); g.ellipse(2, 5, 13, 8, 0, 0, 7); g.fill();
  g.rotate(n.facing);
  const st = Math.sin(n.walk) * 2.5;
  g.fillStyle = "#4a3a5a"; g.beginPath(); g.ellipse(st, -4, 3, 2.2, 0, 0, 7); g.ellipse(-st, 4, 3, 2.2, 0, 0, 7); g.fill();
  // long skirt, purple shawl, cane
  g.fillStyle = "#5a4a6a"; g.beginPath(); g.ellipse(-1, 0, 9, 11, 0, 0, 7); g.fill();
  g.fillStyle = "#8e44ad"; g.beginPath(); g.ellipse(1, 0, 7, 10.5, 0, 0, 7); g.fill();
  g.strokeStyle = "#e9c64a"; g.lineWidth = 1; g.beginPath(); g.ellipse(1, 0, 7, 10.5, 0, 0, 7); g.stroke();
  g.strokeStyle = "#7a5a32"; g.lineWidth = 2.2; g.beginPath(); g.moveTo(2, 9); g.lineTo(14, 12); g.stroke();
  // white hair in a bun
  g.fillStyle = "#e9e6df"; g.beginPath(); g.arc(1, 0, 5.5, 0, 7); g.fill();
  g.fillStyle = "#d6d2c8"; g.beginPath(); g.arc(-3, 0, 3, 0, 7); g.fill();
  g.fillStyle = "#e3b98f"; g.beginPath(); g.arc(5, 0, 2.6, -1.3, 1.3); g.fill();
  g.restore();
  g.font = "600 10px Inter, system-ui, sans-serif"; g.textAlign = "center"; g.fillStyle = "rgba(235,228,210,0.8)";
  g.fillText("Nana", n.x, n.y - 18);
}

export function visionPolygon(cx, cy, facing, cone, near, spread = 0.62, rays = 180) {
  const pts = [];
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    let d = a - facing;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    const ad = Math.abs(d);
    // soft shoulders at the edge of the beam
    const R = ad < spread ? cone : ad < spread + 0.25 ? near + (cone - near) * (1 - (ad - spread) / 0.25) : near;
    const dx = Math.cos(a), dy = Math.sin(a);
    let r = 0;
    while (r < R) {
      r += 6;
      if (blocksSight(Math.floor((cx + dx * r) / TILE), Math.floor((cy + dy * r) / TILE))) { r += 4; break; }
    }
    r = Math.min(r, R);
    pts.push([cx + dx * r, cy + dy * r]);
  }
  return pts;
}

export function drawFrame(g, dark, map, world, view, t, myId = 0) {
  const me = world.entities[myId];
  const { w, h, dpr } = view;
  const z = Math.max(1, Math.min(1.6, h / 640));
  const camX = Math.max(0, Math.min(W * TILE - w / z, me.x - w / z / 2));
  const camY = Math.max(0, Math.min(H * TILE - h / z, me.y - h / z / 2));
  const setT = (c) => c.setTransform(dpr * z, 0, 0, dpr * z, -camX * dpr * z, -camY * dpr * z);
  view.camX = camX; view.camY = camY; view.z = z; // for turning mouse clicks into castle positions

  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.fillStyle = "#05060d"; g.fillRect(0, 0, w, h);
  setT(g);
  g.drawImage(map, 0, 0);

  // doors that change
  for (const [x, y] of LOCKED) {
    g.fillStyle = "#4a2e14"; g.fillRect(x * TILE + 3, y * TILE + 3, TILE - 6, TILE - 6);
    g.strokeStyle = "#a07a3a"; g.lineWidth = 2; g.strokeRect(x * TILE + 4, y * TILE + 4, TILE - 8, TILE - 8);
    g.fillStyle = "#d6b25a"; g.beginPath(); g.arc(x * TILE + 16, y * TILE + 16, 3.5, 0, 7); g.fill();
    g.lineWidth = 1;
  }
  {
    const [x, y] = PORTCULLIS;
    g.strokeStyle = world.portcullisJammed ? "#c9ced8" : "rgba(160,165,175,0.35)";
    g.lineWidth = world.portcullisJammed ? 3 : 1;
    for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(x * TILE + 4 + i * 8, y * TILE); g.lineTo(x * TILE + 4 + i * 8, y * TILE + TILE); g.stroke(); }
    if (world.portcullisJammed) { g.beginPath(); g.moveTo(x * TILE, y * TILE + 10); g.lineTo(x * TILE + TILE, y * TILE + 10); g.moveTo(x * TILE, y * TILE + 22); g.lineTo(x * TILE + TILE, y * TILE + 22); g.stroke(); }
    g.lineWidth = 1;
  }

  // the human's own chores glimmer
  for (const s of STATIONS) {
    let mine = s.kind === "chore" && me.chores.includes(s.id) && !me.done.includes(s.id);
    if (s.kind === "fixLights" && world.lightsOut) mine = true;
    if (s.kind === "fixGate" && world.portcullisJammed) mine = true;
    if (!mine) continue;
    const a = 0.35 + Math.sin(t * 3) * 0.2;
    g.strokeStyle = s.kind === "chore" ? `rgba(255,214,120,${a})` : `rgba(255,110,90,${a + 0.2})`;
    g.lineWidth = 2;
    g.beginPath(); g.arc(s.tx * TILE + 16, s.ty * TILE + 16, 19, 0, 7); g.stroke();
    g.lineWidth = 1;
  }

  // where you clicked to walk
  if (me.hpath && me.hpath.length) {
    const end = me.hpath[me.hpath.length - 1];
    g.strokeStyle = `rgba(255,224,138,${0.5 + Math.sin(t * 6) * 0.3})`; g.lineWidth = 2;
    g.beginPath(); g.arc(end.x, end.y, 9, 0, 7); g.stroke();
    g.beginPath(); g.arc(end.x, end.y, 3, 0, 7); g.stroke();
  }

  // dropped helmets
  for (const m of world.markers) {
    g.save(); g.translate(m.x, m.y); g.rotate(0.6);
    g.fillStyle = "#9aa0ad"; g.beginPath(); g.arc(0, 0, 8, Math.PI, 0); g.fill(); g.fillRect(-8, 0, 16, 4);
    g.fillStyle = world.entities[m.victimId].color; g.fillRect(-3, -12, 6, 5);
    g.restore();
  }

  // people: the living, and ghosts only if you're one of them
  const showGhosts = !me.alive;
  const order = world.entities.filter((e) => (e.alive || showGhosts) && e !== me).sort((a, b) => a.y - b.y);
  drawSheba(g, world.sheba, t, world.t);
  drawNana(g, world.nana, t);
  for (const e of order) drawPerson(g, e, world, me, t);
  if (me.ride) drawBoat(g, me, world, t);
  else drawPerson(g, me, world, me, t);
  // marbles on the floor
  for (const m of world.marbles || []) {
    for (let i = 0; i < 9; i++) { g.fillStyle = ["#c0392b", "#2e5fb8", "#e9c64a", "#2e8b57"][i % 4]; g.beginPath(); g.arc(m.x + Math.cos(i * 2.4) * (6 + i * 2), m.y + Math.sin(i * 2.4) * (6 + i * 2), 2.6, 0, 7); g.fill(); }
  }

  // ---- darkness ----
  dark.setTransform(1, 0, 0, 1, 0, 0);
  dark.globalCompositeOperation = "source-over";
  dark.clearRect(0, 0, dark.canvas.width, dark.canvas.height);
  dark.fillStyle = world.lightsOut ? "rgba(1,1,6,0.985)" : "rgba(2,3,12,0.95)";
  dark.fillRect(0, 0, dark.canvas.width, dark.canvas.height);
  setT(dark);
  dark.globalCompositeOperation = "destination-out";
  const hole = (x, y, r, a = 1) => {
    const gr = dark.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(0.5, `rgba(0,0,0,${a * 0.7})`); gr.addColorStop(1, "rgba(0,0,0,0)");
    dark.fillStyle = gr; dark.beginPath(); dark.arc(x, y, r, 0, 7); dark.fill();
  };
  if (!world.lightsOut) for (const b of BRAZIERS) hole(b.x, b.y, 150 + Math.sin(t * 9 + b.x) * 6, 0.85);
  hole(FORGE_FIRE.x, FORGE_FIRE.y, 100 + Math.sin(t * 11) * 5, 0.8); // the forge fire never dies
  if (me.ride) {
    hole(me.x, me.y, 380, 0.9);
  } else if (!me.alive) {
    hole(me.x, me.y, 420, 0.75);
  } else {
    const smith = me.role === "blacksmith" || me.role === "blackknight";
    const out = world.lightsOut && !smith;
    const f = 1 + Math.sin(t * 13) * 0.025;
    const cone = (out ? 95 : 300) * f, near = (out ? 42 : 72) * f;
    const poly = visionPolygon(me.x, me.y, me.facing, cone, near);
    const gr = dark.createRadialGradient(me.x, me.y, 0, me.x, me.y, cone);
    gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(0.3, "rgba(0,0,0,0.97)"); gr.addColorStop(0.75, "rgba(0,0,0,0.6)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    dark.fillStyle = gr;
    dark.beginPath(); dark.moveTo(poly[0][0], poly[0][1]);
    for (const p of poly) dark.lineTo(p[0], p[1]);
    dark.closePath(); dark.fill();
  }
  dark.globalCompositeOperation = "source-over";
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.drawImage(dark.canvas, 0, 0);
  setT(g);

  // warm tint from the torch
  if (me.alive) {
    const gr = g.createRadialGradient(me.x, me.y, 0, me.x, me.y, 260);
    gr.addColorStop(0, "rgba(255,170,80,0.10)"); gr.addColorStop(1, "rgba(255,170,80,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(me.x, me.y, 260, 0, 7); g.fill();
  }

  // other people's torches bob in the dark, if you can see them
  if (me.alive && !world.lightsOut) {
    for (const e of world.entities) {
      if (e === me || !e.alive) continue;
      const d = Math.hypot(e.x - me.x, e.y - me.y);
      if (d > 760) continue;
      if (!hasLOSQuick(me.x, me.y, e.x, e.y)) continue;
      const tx = e.x + Math.cos(e.facing) * 15 + Math.sin(e.facing) * 9.5;
      const ty = e.y + Math.sin(e.facing) * 15 - Math.cos(e.facing) * 9.5;
      const f = 1 + Math.sin(t * 15 + e.id * 3) * 0.2;
      const gr = g.createRadialGradient(tx, ty, 0, tx, ty, 16 * f);
      gr.addColorStop(0, "rgba(255,225,150,0.95)"); gr.addColorStop(0.4, "rgba(255,150,50,0.5)"); gr.addColorStop(1, "rgba(255,120,40,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(tx, ty, 16 * f, 0, 7); g.fill();
    }
  }

  // you can hear Sheba and Nana even when you can't see them
  const bubble = (x, y, text, col) => {
    g.font = "600 12px Inter, system-ui, sans-serif"; g.textAlign = "center";
    const tw = Math.min(260, g.measureText(text).width + 16);
    g.fillStyle = "rgba(250,244,226,0.95)"; g.strokeStyle = col; g.lineWidth = 1.5;
    g.beginPath(); g.roundRect ? g.roundRect(x - tw / 2, y - 46, tw, 22, 9) : g.rect(x - tw / 2, y - 46, tw, 22); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(x - 5, y - 24); g.lineTo(x, y - 17); g.lineTo(x + 5, y - 24); g.fill();
    g.fillStyle = "#2a1c12"; g.fillText(text, x, y - 31, 250);
  };
  for (const c of world.smoke || []) {
    const age = world.t - c.t0, fade = Math.min(1, (c.until - world.t) / 2) * Math.min(1, age * 2);
    for (let i = 0; i < 16; i++) {
      const a = i * 2.39 + age * 0.3, r = c.r * (0.25 + (i % 5) * 0.17);
      g.fillStyle = `rgba(70,68,78,${0.55 * fade})`;
      g.beginPath(); g.arc(c.x + Math.cos(a) * r, c.y + Math.sin(a) * r, c.r * 0.42, 0, 7); g.fill();
    }
  }
  const sh = world.sheba, na = world.nana;
  if (world.t < (sh.growlUntil || 0) && Math.hypot(me.x - sh.x, me.y - sh.y) < TILE * 8) bubble(sh.x, sh.y, "Grrrrr...", "#8a1020");
  if (world.t < sh.barkUntil && Math.hypot(me.x - sh.x, me.y - sh.y) < TILE * 14) bubble(sh.x, sh.y, "Woof! Woof!", "#2a1c12");
  // Nana's toots: a little green puff, and a *toot* you can hear in the dark
  for (const p of na.puffs) {
    const k = (world.t - p.t) / 3;
    for (let i = 0; i < (p.big ? 6 : 3); i++) {
      g.fillStyle = `rgba(150,190,90,${0.35 * (1 - k)})`;
      g.beginPath(); g.arc(p.x + Math.cos(i * 2.1) * 8 * (1 + k * 2), p.y + Math.sin(i * 2.1) * 8 * (1 + k * 2) - k * 14, (5 + k * 10) * (p.big ? 1.5 : 1), 0, 7); g.fill();
    }
  }
  if (world.t - na.tootAt < 1.6 && Math.hypot(me.x - na.x, me.y - na.y) < TILE * 10) bubble(na.x, na.y - 6, na.puffs.length && na.puffs[na.puffs.length - 1].big ? "*PFFFRRRRT*" : "*toot*", "#7a9a3a");

  // a small arrow toward your nearest job, when it's off in the dark
  const job = me.alive || me.chores.some((c) => !me.done.includes(c)) ? nextJob(world, me.id) : null;
  if (job) {
    const dx = job.x - me.x, dy = job.y - me.y, d = Math.hypot(dx, dy);
    if (d > TILE * 3) {
      const a = Math.atan2(dy, dx), r = 46;
      g.save(); g.translate(me.x + Math.cos(a) * r, me.y + Math.sin(a) * r); g.rotate(a);
      g.globalAlpha = 0.6 + Math.sin(t * 4) * 0.2;
      g.fillStyle = job.urgent ? "#ff6a5a" : "#ffd27a";
      g.beginPath(); g.moveTo(10, 0); g.lineTo(-5, -7); g.lineTo(-2, 0); g.lineTo(-5, 7); g.closePath(); g.fill();
      g.restore();
    }
  }

  // the Torch of Truth's verdict
  if (me.reveal) {
    const e = world.entities[me.reveal.id];
    const txt = { bk: "THE BLACK KNIGHT!", jester: "THE JESTER!", innocent: "INNOCENT" }[me.reveal.verdict];
    const col = { bk: "#ff5a4a", jester: "#d18cff", innocent: "#8ef0a8" }[me.reveal.verdict];
    g.save();
    g.strokeStyle = col; g.lineWidth = 3; g.globalAlpha = 0.6 + Math.sin(t * 10) * 0.3;
    g.beginPath(); g.arc(e.x, e.y, 22, 0, 7); g.stroke();
    g.globalAlpha = 1;
    g.font = "700 14px Inter, system-ui, sans-serif"; g.textAlign = "center";
    g.fillStyle = "rgba(0,0,0,0.7)"; g.fillRect(e.x - 70, e.y - 50, 140, 22);
    g.fillStyle = col; g.fillText(`${e.name}: ${txt}`, e.x, e.y - 34);
    g.restore();
  }
}

function hasLOSQuick(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy), n = Math.ceil(d / 12);
  for (let i = 1; i < n; i++) if (blocksSight(Math.floor((x1 + (dx * i) / n) / TILE), Math.floor((y1 + (dy * i) / n) / TILE))) return false;
  return true;
}

// ---------- the little map: rooms in their colours, your jobs, you ----------
export function drawMiniMap(g, world, width, myId = 0) {
  const s = width / W;
  const me = world.entities[myId];
  const k = g.canvas.width / width;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, g.canvas.width, g.canvas.height);
  g.setTransform(k, 0, 0, k, 0, 0);
  g.fillStyle = "rgba(8,8,16,0.85)"; g.fillRect(0, 0, W * s, H * s);
  for (const r of [...CORRIDORS, ...ROOMS]) { g.fillStyle = AREA_STYLE[r.id].mini; g.fillRect(r.x * s, r.y * s, r.w * s, r.h * s); }
  for (const p of PASSAGES) for (const [x, y] of [p.a, p.b]) { g.fillStyle = "#2a1a0d"; g.fillRect(x * s, y * s, s, s); }
  g.textAlign = "center"; g.textBaseline = "middle"; g.font = "600 8px Inter, system-ui, sans-serif";
  for (const r of ROOMS) {
    const label = AREA_STYLE[r.id].short;
    g.font = "600 8px Inter, system-ui, sans-serif";
    if (g.measureText(label).width > r.w * s - 2) g.font = "600 6.5px Inter, system-ui, sans-serif";
    if (g.measureText(label).width > r.w * s - 1) continue;
    const cx = (r.x + r.w / 2) * s, cy = (r.y + r.h / 2) * s;
    g.fillStyle = "rgba(10,8,20,0.8)"; g.fillText(label, cx + 0.6, cy + 0.6);
    g.fillStyle = "rgba(255,250,235,0.95)"; g.fillText(label, cx, cy);
  }
  for (const st of STATIONS) {
    const mine = st.kind === "chore" && me.chores.includes(st.id) && !me.done.includes(st.id);
    const fix = (st.kind === "fixLights" && world.lightsOut) || (st.kind === "fixGate" && world.portcullisJammed);
    if (!mine && !fix) continue;
    g.fillStyle = fix ? "#ff4a3a" : "#ffe08a";
    g.strokeStyle = "#1b1406"; g.lineWidth = 1;
    g.beginPath(); g.arc(st.tx * s + s / 2, st.ty * s + s / 2, 2.8, 0, 7); g.fill(); g.stroke();
  }
  if (world.alarm && world.t < world.alarm.until) {
    const r = ROOMS.find((x) => x.id === world.alarm.room);
    if (r) { g.strokeStyle = `rgba(255,80,60,${0.6 + Math.sin(world.t * 10) * 0.4})`; g.lineWidth = 2; g.strokeRect(r.x * s, r.y * s, r.w * s, r.h * s); }
  }
  { const b = stationById("bell"); g.fillStyle = "#e9c64a"; g.beginPath(); g.arc((b.tx + 0.5) * s, (b.ty + 0.5) * s, 2.2, 0, 7); g.fill(); }
  g.strokeStyle = "rgba(201,162,39,0.8)"; g.lineWidth = 1; g.beginPath(); g.arc((TABLE.x / TILE) * s, (TABLE.y / TILE) * s, (TABLE.r / TILE) * s, 0, 7); g.stroke();
  const px = (me.x / TILE) * s, py = (me.y / TILE) * s;
  g.fillStyle = me.color; g.strokeStyle = "#fff"; g.lineWidth = 1.5;
  g.beginPath(); g.arc(px, py, 3.8, 0, 7); g.fill(); g.stroke();
}

// ---------- the joust ----------
// sc: { left: {look}, right: {look, black}, loser: "left"|"right"|null,
//       broken: bool (lances shatter, nobody falls), unmask: bool,
//       crowd: [{look, name, ghost}], reticle: {y, zone, locked} }
// t: seconds since the pass began. The horses meet at IMPACT.
export const IMPACT = 3.4;
export function drawJoustScene(g, w, h, t, sc) {
  const s = Math.min(w / 1100, h / 650);
  g.setTransform(1, 0, 0, 1, 0, 0);
  const sky = g.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#060919"); sky.addColorStop(0.55, "#1a1d3c"); sky.addColorStop(1, "#2b2236");
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 110; i++) { g.fillStyle = `rgba(255,255,255,${0.2 + hash(i, 9) * 0.6})`; g.fillRect(hash(i, 4) * w, hash(i, 5) * h * 0.42, 1.5, 1.5); }
  { const mg = g.createRadialGradient(w * 0.93, h * 0.07, 20 * s, w * 0.93, h * 0.07, 90 * s); mg.addColorStop(0, "rgba(241,234,210,0.18)"); mg.addColorStop(1, "rgba(241,234,210,0)"); g.fillStyle = mg; g.beginPath(); g.arc(w * 0.93, h * 0.07, 90 * s, 0, 7); g.fill(); }
  g.fillStyle = "#f1ead2"; g.beginPath(); g.arc(w * 0.93, h * 0.07, 26 * s, 0, 7); g.fill();
  const base = h * 0.47;
  // the castle behind
  g.fillStyle = "#0c0d1a";
  g.fillRect(w * 0.12, base - 110 * s, w * 0.76, 110 * s);
  for (let i = 0; i < 26; i++) g.fillRect(w * 0.12 + i * (w * 0.76 / 26), base - 122 * s, (w * 0.76 / 26) * 0.55, 13 * s);
  for (const tx of [0.13, 0.46, 0.79]) { g.fillRect(w * tx, base - 200 * s, 70 * s, 200 * s); for (let i = 0; i < 4; i++) g.fillRect(w * tx + i * 19 * s, base - 213 * s, 11 * s, 13 * s); }
  g.fillStyle = "rgba(255,190,90,0.75)";
  for (const [fx, fy] of [[0.15, 150], [0.49, 160], [0.82, 140], [0.3, 70], [0.63, 80]]) g.fillRect(w * fx, base - fy * s, 6 * s, 10 * s);
  // a striped pavilion at each end of the lists, in each knight's colours
  const tent = (x, c1, c2) => {
    g.save(); g.translate(x, base + 40 * s);
    for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? c1 : c2; g.beginPath(); g.moveTo(0, -90 * s); g.lineTo(-60 * s + i * 20 * s, 0); g.lineTo(-40 * s + i * 20 * s, 0); g.closePath(); g.fill(); }
    g.fillStyle = "#e8dcb8"; g.fillRect(-1.5 * s, -112 * s, 3 * s, 24 * s);
    g.fillStyle = c1; g.beginPath(); g.moveTo(1.5 * s, -112 * s); g.lineTo(24 * s, -105 * s + Math.sin(t * 5) * 2 * s); g.lineTo(1.5 * s, -98 * s); g.fill();
    g.restore();
  };
  tent(w * 0.06, sc.left.look.tabard, "#e8dcb8");
  tent(w * 0.94, sc.right.black ? "#141418" : sc.right.look.tabard, sc.right.black ? "#5a1018" : "#e8dcb8");
  // the stands
  g.fillStyle = "#2a1c14"; g.fillRect(w * 0.14, base - 6 * s, w * 0.72, 92 * s);
  g.fillStyle = "#3a2618"; for (let r = 0; r < 3; r++) g.fillRect(w * 0.14, base + (8 + r * 26) * s, w * 0.72, 4 * s);
  const cheer = t > IMPACT + 0.3;
  for (let i = 0; i < 46; i++) {
    const cx = w * 0.15 + (i + 0.5) * (w * 0.7 / 46), bob = Math.sin(t * 8 + i) * (cheer ? 4 : 1.2) * s;
    g.fillStyle = ["#6a3b3b", "#3b4f6a", "#4f6a3b", "#6a5a3b", "#5a3b6a"][i % 5];
    g.beginPath(); g.arc(cx, base + 4 * s + bob, 6.5 * s, 0, 7); g.fill();
  }
  // striped canopies over the stands, on poles, with pennants
  for (const [k, fx] of [[0, 0.14], [1, 0.285], [2, 0.575], [3, 0.715]]) {
    const x0 = w * fx, cw = w * 0.145, cy = base - 54 * s;
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#7a1d28" : "#e8dcb8"; g.fillRect(x0 + (i * cw) / 8, cy, cw / 8 + 1, 22 * s); }
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#7a1d28" : "#e8dcb8"; g.beginPath(); g.arc(x0 + ((i + 0.5) * cw) / 8, cy + 22 * s, cw / 16, 0, Math.PI); g.fill(); }
    g.fillStyle = "#4a2e14"; g.fillRect(x0, cy, 3 * s, 70 * s); g.fillRect(x0 + cw - 3 * s, cy, 3 * s, 70 * s);
    g.fillStyle = k % 2 ? "#1d3a7a" : "#c9a227"; g.beginPath(); g.moveTo(x0 + cw / 2, cy - 18 * s); g.lineTo(x0 + cw / 2 + 18 * s, cy - 13 * s + Math.sin(t * 6 + k) * 2 * s); g.lineTo(x0 + cw / 2, cy - 8 * s); g.fill();
    g.fillStyle = "#4a2e14"; g.fillRect(x0 + cw / 2 - 1, cy - 20 * s, 2, 20 * s);
  }
  // the royal box, with the Donaghy Cup on show
  g.fillStyle = "#4a1820"; g.fillRect(w * 0.44, base - 40 * s, w * 0.12, 40 * s);
  g.fillStyle = "#c9a227"; g.fillRect(w * 0.44, base - 44 * s, w * 0.12, 5 * s);
  g.save(); g.translate(w * 0.5, base - 14 * s);
  g.fillStyle = "#e9c64a";
  g.beginPath(); g.moveTo(-12 * s, -22 * s); g.quadraticCurveTo(-12 * s, -4 * s, 0, -2 * s); g.quadraticCurveTo(12 * s, -4 * s, 12 * s, -22 * s); g.closePath(); g.fill();
  g.fillRect(-2.5 * s, -2 * s, 5 * s, 10 * s); g.fillRect(-8 * s, 8 * s, 16 * s, 4 * s);
  g.strokeStyle = "#e9c64a"; g.lineWidth = 2.5 * s;
  g.beginPath(); g.arc(-14 * s, -15 * s, 5 * s, 1.2, 5); g.stroke(); g.beginPath(); g.arc(14 * s, -15 * s, 5 * s, -1.9, 1.9); g.stroke();
  g.restore();
  // banners along the stands
  for (let i = 0; i < 7; i++) {
    const bx = w * (0.15 + i * 0.115);
    if (bx > w * 0.42 && bx < w * 0.56) continue;
    g.fillStyle = i % 2 ? "#7a1d28" : "#1d3a7a";
    g.beginPath(); g.moveTo(bx, base - 6 * s); g.lineTo(bx + 22 * s, base - 6 * s); g.lineTo(bx + 22 * s, base + 26 * s); g.lineTo(bx + 11 * s, base + 18 * s); g.lineTo(bx, base + 26 * s); g.fill();
    g.fillStyle = "#e9c64a"; g.fillRect(bx + 9 * s, base + 2 * s, 4 * s, 4 * s);
  }
  const ground = h * 0.88;
  g.fillStyle = "#3b3021"; g.fillRect(0, base + 86 * s, w, h);
  g.fillStyle = "#4a3c28"; g.fillRect(0, ground - 70 * s, w, h);
  for (let i = 0; i < 60; i++) { g.fillStyle = "rgba(0,0,0,0.12)"; g.fillRect(hash(i, 21) * w, ground - 60 * s + hash(i, 22) * 120 * s, 14 * s, 2 * s); }
  g.strokeStyle = "rgba(255,230,180,0.05)"; g.lineWidth = 2 * s;
  for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(0, ground - 50 * s + i * 14 * s); g.lineTo(w, ground - 50 * s + i * 14 * s); g.stroke(); }
  // the family in the front row, each in their own colours
  const crowd = sc.crowd || [];
  const rowY = base + 74 * s;
  crowd.forEach((c, i) => {
    const cx = w * 0.18 + (i + 0.5) * (w * 0.64 / Math.max(1, crowd.length));
    const jump = cheer ? Math.abs(Math.sin(t * 7 + i)) * 6 * s : 0;
    g.save(); g.translate(cx, rowY - jump); g.scale(s, s);
    if (c.ghost) g.globalAlpha = 0.45;
    drawKnightFront(g, c.look, { cheer: cheer ? 1 : 0 });
    g.restore();
    g.globalAlpha = 1;
    g.fillStyle = "rgba(242,230,200,0.92)"; g.font = `600 ${Math.max(9, Math.round(11 * s))}px Inter, system-ui, sans-serif`; g.textAlign = "center";
    g.fillText(c.name, cx, rowY + 20 * s);
  });
  for (const fx of [0.13, 0.87]) {
    const x = w * fx, y = base + 30 * s, f = 1 + Math.sin(t * 13 + fx * 9) * 0.15;
    g.fillStyle = "#4a2e14"; g.fillRect(x - 2 * s, y, 4 * s, 70 * s);
    const gr = g.createRadialGradient(x, y, 0, x, y, 60 * s * f); gr.addColorStop(0, "rgba(255,200,110,0.5)"); gr.addColorStop(1, "rgba(255,150,60,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, 60 * s * f, 0, 7); g.fill();
    g.fillStyle = "#ffcf6a"; g.beginPath(); g.ellipse(x, y - 4 * s, 5 * s, 9 * s * f, 0, 0, 7); g.fill();
  }

  let charge = Math.max(0, Math.min(1, (t - 1.0) / (IMPACT - 1.0)));
  const ease = charge * charge * (3 - 2 * charge);
  let impact = t >= IMPACT;
  let after = Math.max(0, t - IMPACT);
  let lx = impact ? w * 0.47 + after * 320 * s : -170 * s + ease * (w * 0.47 + 170 * s);
  let rx = impact ? w * 0.53 - after * 320 * s : w + 170 * s - ease * (w * 0.47 + 170 * s);
  // the practice joust drives the horses itself: pL, pR are how far each has come (they meet at pL + pR = 1)
  if (sc.pos) {
    const span = w + 340 * s;
    impact = sc.pos.impact; after = sc.pos.after || 0; charge = 1;
    const meet = -170 * s + (sc.pos.meetL ?? sc.pos.pL) * span;
    lx = impact ? meet - 0.03 * w + after * 320 * s : -170 * s + sc.pos.pL * span;
    rx = impact ? meet + 0.03 * w - after * 320 * s : w + 170 * s - sc.pos.pR * span;
  }
  const gallop = t * 14;
  const dust = (x, y, dir) => {
    if (charge <= 0 || after > 2) return;
    for (let i = 0; i < 6; i++) {
      const k = (t * 2 + i / 6) % 1;
      g.fillStyle = `rgba(150,130,100,${0.25 * (1 - k)})`;
      g.beginPath(); g.arc(x - dir * (40 + k * 90) * s, y + 40 * s - k * 16 * s, (6 + k * 16) * s, 0, 7); g.fill();
    }
  };
  const fall = (leftSide) => {
    const ft = Math.min(1, after / 1.0);
    const slide = Math.min(after, 1.1);
    const fx = leftSide ? w * 0.47 - slide * 70 * s : w * 0.53 + slide * 70 * s;
    const baseY = leftSide ? ground + 2 * s : ground - 26 * s;
    const fy = baseY + ft * ft * 34 * s - Math.sin(ft * Math.PI) * 50 * s;
    const side = leftSide ? sc.left : sc.right;
    if (side.black && after > 1.0) {
      // the shadow knight dissolves into smoke
      const k = Math.min(1, (after - 1.0) / 1.2);
      for (let i = 0; i < 22; i++) {
        g.fillStyle = `rgba(130,130,150,${0.4 * (1 - k)})`;
        g.beginPath(); g.arc(fx + (hash(i, 1) - 0.5) * 120 * s * k, fy - 40 * s - hash(i, 2) * 120 * s * k, (10 + hash(i, 3) * 20) * s, 0, 7); g.fill();
      }
      return;
    }
    g.save(); g.translate(fx, fy); g.rotate((leftSide ? -1 : 1) * ft * 1.7); g.scale(leftSide ? s : -s, s);
    drawKnightSide(g, side.look, { black: side.black, unmasked: leftSide && sc.unmask && after > 0.35, lance: false });
    g.restore();
  };
  const horseOnly = (x, y, dir, side, ph) => { g.save(); g.translate(x, y); g.scale(dir * s, s); drawHorse(g, ph, side.look, { black: side.black }); g.restore(); };
  const rider = (x, y, dir, side, ph) => {
    g.save(); g.translate(x, y); g.scale(dir * s, s);
    drawHorse(g, ph, side.look, { black: side.black });
    g.translate(0, -18);
    // the practice joust aims the lance straight at the ring on the other knight's shield
    let lanceAngle;
    if (sc.reticle && dir > 0 && !impact) {
      const bx = x - 6 * s, by = y + (-18 - 64) * s;
      const tx = rx + 16 * s, ty = ground - 26 * s - 80 * s + sc.reticle.y * 46 * s;
      lanceAngle = Math.max(-0.7, Math.min(0.7, Math.atan2(ty - by, Math.max(40 * s, tx - bx))));
    }
    drawKnightSide(g, side.look, { black: side.black, lance: !(impact && sc.broken), lanceAim: side.aim || 0, lanceAngle });
    g.restore();
  };

  // far side of the barrier: the right-hand knight
  dust(rx, ground - 26 * s, -1);
  if (!impact || sc.loser !== "right") rider(rx, ground - 26 * s, -1, sc.right, gallop);
  else { horseOnly(rx, ground - 26 * s, -1, sc.right, gallop); fall(false); }
  g.fillStyle = "#c9b48a"; g.fillRect(0, ground - 70 * s, w, 10 * s);
  g.fillStyle = "#9a8560"; g.fillRect(0, ground - 61 * s, w, 2 * s);
  for (let i = 0; i < 30; i++) { g.fillStyle = "#c9b48a"; g.fillRect(i * (w / 30), ground - 70 * s, 6 * s, 52 * s); }
  // near side: the left-hand knight
  dust(lx, ground + 2 * s, 1);
  if (!impact || sc.loser !== "left") rider(lx, ground + 2 * s, 1, sc.left, gallop + 1);
  else { horseOnly(lx, ground + 2 * s, 1, sc.left, gallop + 1); fall(true); }

  if (impact) {
    if (sc.loser === "left" && sc.unmask) {
      const ht = Math.min(1.6, after);
      const hx = w * 0.47 - ht * 160 * s, hy = ground - 90 * s - Math.sin(Math.min(1, ht / 1.2) * Math.PI) * 160 * s + Math.max(0, ht - 1.2) * 200 * s;
      g.save(); g.translate(hx, hy); g.rotate(ht * 9);
      g.fillStyle = sc.left.look.helmet; g.beginPath(); g.arc(0, 0, 14 * s, Math.PI, 0); g.fill(); g.fillRect(-14 * s, 0, 28 * s, 6 * s);
      g.restore();
    }
    if (after < 0.9 && (sc.loser || sc.broken)) {
      g.fillStyle = `rgba(255,250,220,${0.7 * (1 - after / 0.9)})`; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 26; i++) {
        const a = hash(i, 11) * Math.PI * 2, r = after * (200 + hash(i, 12) * 300) * s;
        g.fillStyle = i % 3 ? "#e6d3a5" : sc.left.look.tabard;
        g.fillRect(w * 0.5 + Math.cos(a) * r, ground - 80 * s + Math.sin(a) * r * 0.6 + after * after * 300 * s, 10 * s, 3 * s);
      }
    }
  }

  // the practice joust's aim: a ring sliding over the other knight's shield
  if (sc.reticle && !impact) {
    const sx = rx + 16 * s, sy = ground - 26 * s - 80 * s;
    const yy = sy + sc.reticle.y * 46 * s;
    g.strokeStyle = "rgba(255,240,180,0.4)"; g.lineWidth = 2 * s;
    g.strokeRect(sx - 20 * s, sy - 46 * s, 40 * s, 92 * s);
    const zc = sy + (sc.reticle.zoneY || 0) * 46 * s;
    g.fillStyle = "rgba(140,240,160,0.3)"; g.fillRect(sx - 20 * s, zc - sc.reticle.zone * 46 * s, 40 * s, sc.reticle.zone * 92 * s);
    g.strokeStyle = sc.reticle.locked ? "#8ef0a8" : "#ffe08a"; g.lineWidth = 3 * s;
    g.beginPath(); g.arc(sx, yy, 10 * s, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(sx - 20 * s, yy); g.lineTo(sx + 20 * s, yy); g.stroke();
  }
}
