// Lights Out at Donaghy Castle: everything drawn on the canvas - the
// castle (painted once to an offscreen canvas), the people, the torchlight
// and the joust.
import {
  TILE, W, H, ROOMS, CORRIDORS, STATIONS, LOCKED, PORTCULLIS, BRAZIERS, CELL_AREA, AREA_STYLE, PASSAGES,
  T_WALL, T_MOAT, T_FLOOR, tileAt, blocksSight,
} from "../../lib/castle/map";
import { look, nextJob } from "../../lib/castle/engine";
import { drawKnightTop, drawKnightSide, drawKnightFront, drawHorse } from "./knight";

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
    if (t === T_MOAT || t === T_FLOOR) continue;
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
  // the hall's long tables and the Great Bell
  g.fillStyle = "#5b3b20";
  g.fillRect(19 * TILE, 17 * TILE + 8, 6 * TILE, 18); g.fillRect(29 * TILE, 17 * TILE + 8, 6 * TILE, 18);
  g.fillRect(19 * TILE, 23 * TILE + 6, 6 * TILE, 18); g.fillRect(29 * TILE, 23 * TILE + 6, 6 * TILE, 18);
  // throne room carpet runner
  g.fillStyle = "#7a1d28"; g.fillRect(33 * TILE, 3 * TILE, 2 * TILE, 7 * TILE);
  // dungeon cell bars
  const c = CELL_AREA;
  g.strokeStyle = "#7b7f8a"; g.lineWidth = 3;
  g.strokeRect(c.tx * TILE - 6, c.ty * TILE - 6, (c.w) * TILE + 12, c.h * TILE + 12);
  for (let i = 0; i <= c.w * 2; i++) { g.beginPath(); g.moveTo(c.tx * TILE - 6 + i * 16, c.ty * TILE - 6); g.lineTo(c.tx * TILE - 6 + i * 16, c.ty * TILE - 2); g.stroke(); }
  g.lineWidth = 1;
  // the well
  g.fillStyle = "#555"; g.beginPath(); g.arc(56.5 * TILE, 34.5 * TILE, 20, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#0d1a33"; g.beginPath(); g.arc(56.5 * TILE, 34.5 * TILE, 13, 0, Math.PI * 2); g.fill();
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
  const moving = e.human ? !!e.moving : e.path && e.path.length > 0 && !e.work;
  g.scale(1.2, 1.2);
  drawKnightTop(g, L.look, { facing: e.facing, walk: e.walk || 0, moving, torch: e.alive && !(world.lightsOut && e.role !== "blacksmith"), t: t + e.id });
  g.restore();
  if (ghost) g.globalAlpha = 0.5;
  g.font = "600 11px Inter, system-ui, sans-serif"; g.textAlign = "center";
  g.fillStyle = e === me ? "#fff3c4" : "rgba(235,228,210,0.85)";
  g.fillText(e === me ? `${L.name} (you)` : L.name, e.x, e.y - 22);
  g.globalAlpha = 1;
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

export function drawFrame(g, dark, map, world, view, t) {
  const me = world.entities[0];
  const { w, h, dpr } = view;
  const z = Math.max(1, Math.min(1.6, h / 640));
  const camX = Math.max(0, Math.min(W * TILE - w / z, me.x - w / z / 2));
  const camY = Math.max(0, Math.min(H * TILE - h / z, me.y - h / z / 2));
  const setT = (c) => c.setTransform(dpr * z, 0, 0, dpr * z, -camX * dpr * z, -camY * dpr * z);

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
  for (const e of order) drawPerson(g, e, world, me, t);
  drawPerson(g, me, world, me, t);

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
  hole(47 * TILE + 16, 16 * TILE + 16, 90 + Math.sin(t * 11) * 5, 0.8); // the forge fire never dies
  if (!me.alive) {
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

  // a small arrow toward your nearest job, when it's off in the dark
  const job = nextJob(world);
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
  if (world.reveal) {
    const e = world.entities[world.reveal.id];
    const txt = { bk: "THE BLACK KNIGHT!", jester: "THE JESTER!", innocent: "INNOCENT" }[world.reveal.verdict];
    const col = { bk: "#ff5a4a", jester: "#d18cff", innocent: "#8ef0a8" }[world.reveal.verdict];
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
export function drawMiniMap(g, world, width) {
  const s = width / W;
  const me = world.entities[0];
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
    if (g.measureText(label).width > r.w * s - 2) continue;
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
  g.fillStyle = "#e9c64a"; g.beginPath(); g.arc(27.5 * s, 20.5 * s, 2.2, 0, 7); g.fill();
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

  const charge = Math.max(0, Math.min(1, (t - 1.0) / (IMPACT - 1.0)));
  const ease = charge * charge * (3 - 2 * charge);
  const impact = t >= IMPACT;
  const after = Math.max(0, t - IMPACT);
  const lx = impact ? w * 0.47 + after * 320 * s : -170 * s + ease * (w * 0.47 + 170 * s);
  const rx = impact ? w * 0.53 - after * 320 * s : w + 170 * s - ease * (w * 0.47 + 170 * s);
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
    drawKnightSide(g, side.look, { black: side.black, lance: !(impact && sc.broken) });
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
    g.fillStyle = "rgba(140,240,160,0.22)"; g.fillRect(sx - 20 * s, sy - sc.reticle.zone * 46 * s, 40 * s, sc.reticle.zone * 92 * s);
    g.strokeStyle = sc.reticle.locked ? "#8ef0a8" : "#ffe08a"; g.lineWidth = 3 * s;
    g.beginPath(); g.arc(sx, yy, 10 * s, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(sx - 20 * s, yy); g.lineTo(sx + 20 * s, yy); g.stroke();
  }
}
