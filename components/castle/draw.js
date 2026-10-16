// Lights Out at Donaghy Castle: everything drawn on the canvas - the
// castle (painted once to an offscreen canvas), the people, the torchlight
// and the joust.
import {
  TILE, W, H, ROOMS, CORRIDORS, STATIONS, LOCKED, PORTCULLIS, BRAZIERS, CELL_AREA,
  T_WALL, T_MOAT, tileAt, blocksSight,
} from "../../lib/castle/map";
import { look } from "../../lib/castle/engine";

const FLOORS = {
  stone: ["#3a3a44", "#34343e"], wood: ["#4a3624", "#43301f"], carpet: ["#4a1f26", "#431b22"],
  flag: ["#3d3a35", "#36332f"], straw: ["#5a4a26", "#524321"], dark: ["#26252c", "#212026"],
  grass: ["#24402a", "#203a26"], corridor: ["#33323a", "#2e2d35"],
};

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
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const t = tileAt(x, y);
    const px = x * TILE, py = y * TILE;
    if (t === T_MOAT) continue;
    if (t === T_WALL) {
      g.fillStyle = "#1c1b22"; g.fillRect(px, py, TILE, TILE);
      g.fillStyle = "#2a2932";
      const off = (y % 2) * 8;
      for (let r = 0; r < 2; r++) for (let c = -1; c < 2; c++) {
        const bx = px + c * 16 + off + 1, by = py + r * 16 + 1;
        g.fillStyle = `rgb(${38 + hash(x * 4 + c, y * 4 + r) * 14},${37 + hash(x * 4 + c, y * 4 + r) * 12},${46 + hash(x * 4 + c, y * 4 + r) * 12})`;
        g.fillRect(Math.max(px, bx), by, Math.min(px + TILE, bx + 14) - Math.max(px, bx), 14);
      }
      continue;
    }
  }
  for (const r of [...CORRIDORS, ...ROOMS]) {
    const [a, b] = FLOORS[r.floor];
    for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) {
      g.fillStyle = (x + y) % 2 ? a : b; g.fillRect(x * TILE, y * TILE, TILE, TILE);
      const n = hash(x, y);
      if (r.floor === "wood") { g.fillStyle = "rgba(0,0,0,0.18)"; g.fillRect(x * TILE, y * TILE + (n > 0.5 ? 15 : 31), TILE, 1); }
      else if (r.floor === "grass") { g.fillStyle = "rgba(80,140,80,0.25)"; for (let k = 0; k < 4; k++) g.fillRect(x * TILE + hash(x + k, y) * 30, y * TILE + hash(x, y + k) * 30, 1, 4); }
      else if (r.floor === "straw") { g.strokeStyle = "rgba(200,170,90,0.25)"; g.beginPath(); for (let k = 0; k < 3; k++) { const sx = x * TILE + hash(x + k, y) * 30, sy = y * TILE + hash(x, y + k) * 30; g.moveTo(sx, sy); g.lineTo(sx + 7, sy + 2); } g.stroke(); }
      else { g.strokeStyle = "rgba(0,0,0,0.22)"; g.strokeRect(x * TILE + 0.5, y * TILE + 0.5, TILE - 1, TILE - 1); }
    }
  }
  // doorways get a worn threshold
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    if (tileAt(x, y) !== 1) continue;
    const inArea = [...ROOMS, ...CORRIDORS].some((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h);
    if (!inArea) { g.fillStyle = "#4b4438"; g.fillRect(x * TILE, y * TILE, TILE, TILE); }
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
  if (ghost) g.globalAlpha = 0.38;
  g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(2, 5, 13, 8, 0, 0, 7); g.fill();
  if (e === me && me.role === "blackknight" && me.alive) {
    g.fillStyle = "rgba(170,20,30,0.25)"; g.beginPath(); g.arc(0, 0, 20 + Math.sin(t * 4) * 2, 0, 7); g.fill();
  }
  g.rotate(e.facing);
  // shoulders + tabard
  g.fillStyle = shade(L.color, -0.35); g.beginPath(); g.ellipse(0, 0, 9, 13, 0, 0, 7); g.fill();
  g.fillStyle = L.color; g.beginPath(); g.ellipse(1, 0, 7, 10, 0, 0, 7); g.fill();
  // torch in the right hand
  g.fillStyle = "#6b4a26"; g.fillRect(6, 7, 9, 3);
  if (e.alive && !(world.lightsOut && e.role !== "blacksmith")) {
    const f = 1 + Math.sin(t * 17 + e.id) * 0.15;
    g.fillStyle = "rgba(255,170,60,0.9)"; g.beginPath(); g.arc(16, 8.5, 3.5 * f, 0, 7); g.fill();
    g.fillStyle = "rgba(255,240,170,0.95)"; g.beginPath(); g.arc(16, 8.5, 1.6 * f, 0, 7); g.fill();
  }
  // helmet
  g.fillStyle = "#b9bec9"; g.beginPath(); g.arc(1, 0, 6, 0, 7); g.fill();
  g.fillStyle = "#6b707c"; g.fillRect(4, -3, 2, 6);
  g.restore();
  if (ghost) g.globalAlpha = 0.45;
  g.font = "600 11px Inter, system-ui, sans-serif"; g.textAlign = "center";
  g.fillStyle = e === me ? "#fff3c4" : "rgba(235,228,210,0.85)";
  g.fillText(e === me ? `${L.name} (you)` : L.name, e.x, e.y - 20);
  g.globalAlpha = 1;
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
  const f = (v) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return `rgb(${f(r)},${f(gg)},${f(b)})`;
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
      const tx = e.x + Math.cos(e.facing) * 16 - Math.sin(e.facing) * 8.5;
      const ty = e.y + Math.sin(e.facing) * 16 + Math.cos(e.facing) * 8.5;
      const f = 1 + Math.sin(t * 15 + e.id * 3) * 0.2;
      const gr = g.createRadialGradient(tx, ty, 0, tx, ty, 16 * f);
      gr.addColorStop(0, "rgba(255,225,150,0.95)"); gr.addColorStop(0.4, "rgba(255,150,50,0.5)"); gr.addColorStop(1, "rgba(255,120,40,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(tx, ty, 16 * f, 0, 7); g.fill();
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

// ---------- minimap of where your chores are ----------
export function drawMiniMap(g, world, size) {
  const s = size / W;
  const me = world.entities[0];
  g.clearRect(0, 0, g.canvas.width, g.canvas.height);
  g.fillStyle = "rgba(10,10,20,0.75)"; g.fillRect(0, 0, W * s, H * s);
  for (const r of [...ROOMS, ...CORRIDORS]) { g.fillStyle = r.floor === "corridor" ? "#2f2e3a" : "#46434f"; g.fillRect(r.x * s, r.y * s, r.w * s, r.h * s); }
  for (const st of STATIONS) {
    const mine = st.kind === "chore" && me.chores.includes(st.id) && !me.done.includes(st.id);
    const fix = (st.kind === "fixLights" && world.lightsOut) || (st.kind === "fixGate" && world.portcullisJammed);
    if (!mine && !fix) continue;
    g.fillStyle = fix ? "#ff6a5a" : "#ffd27a";
    g.fillRect(st.tx * s - 1.5, st.ty * s - 1.5, 4, 4);
  }
  g.fillStyle = "#c9a227"; g.fillRect(27 * s - 2, 20 * s - 2, 5, 5);
  g.fillStyle = "#fff"; g.beginPath(); g.arc((me.x / TILE) * s, (me.y / TILE) * s, 3, 0, 7); g.fill();
}

// ---------- the joust ----------
// p: { accusedName, accusedColor, guilty, jester }, t: seconds since start
export function drawJoust(g, w, h, t, p) {
  const s = Math.min(w / 1100, h / 650);
  g.setTransform(1, 0, 0, 1, 0, 0);
  // sky
  const sky = g.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#070a1c"); sky.addColorStop(0.6, "#1b1f3e"); sky.addColorStop(1, "#2b2236");
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(255,255,255,${0.2 + hash(i, 9) * 0.6})`; g.fillRect(hash(i, 4) * w, hash(i, 5) * h * 0.5, 1.5, 1.5); }
  g.fillStyle = "#f1ead2"; g.beginPath(); g.arc(w * 0.93, h * 0.07, 26 * s, 0, 7); g.fill();
  // castle silhouette
  g.fillStyle = "#0c0d1a";
  const base = h * 0.5;
  g.fillRect(w * 0.1, base - 120 * s, w * 0.8, 120 * s);
  for (let i = 0; i < 26; i++) g.fillRect(w * 0.1 + i * (w * 0.8 / 26), base - 132 * s, (w * 0.8 / 26) * 0.55, 14 * s);
  for (const tx of [0.12, 0.45, 0.78]) { g.fillRect(w * tx, base - 210 * s, 70 * s, 210 * s); for (let i = 0; i < 4; i++) g.fillRect(w * tx + i * 19 * s, base - 224 * s, 11 * s, 14 * s); }
  g.fillStyle = "rgba(255,190,90,0.7)";
  for (const [fx, fy] of [[0.15, 150], [0.48, 160], [0.81, 140], [0.3, 70], [0.63, 80]]) g.fillRect(w * fx, base - fy * s, 6 * s, 10 * s);
  // stands with the crowd
  g.fillStyle = "#2a1c14"; g.fillRect(0, base - 10 * s, w, 60 * s);
  for (let i = 0; i < 60; i++) {
    const cx = (i + 0.5) * (w / 60), bob = Math.sin(t * 8 + i) * (t > 3.4 ? 4 : 1.5) * s;
    g.fillStyle = ["#6a3b3b", "#3b4f6a", "#4f6a3b", "#6a5a3b", "#5a3b6a"][i % 5];
    g.beginPath(); g.arc(cx, base + 10 * s + bob, 7 * s, 0, 7); g.fill();
  }
  // banners
  for (let i = 0; i < 7; i++) {
    const bx = w * (0.07 + i * 0.145);
    g.fillStyle = i % 2 ? "#7a1d28" : "#1d3a7a";
    g.beginPath(); g.moveTo(bx, base - 10 * s); g.lineTo(bx + 26 * s, base - 10 * s); g.lineTo(bx + 26 * s, base + 30 * s); g.lineTo(bx + 13 * s, base + 20 * s); g.lineTo(bx, base + 30 * s); g.fill();
  }
  // the lists
  const ground = h * 0.86;
  g.fillStyle = "#3b3021"; g.fillRect(0, base + 50 * s, w, h);
  g.fillStyle = "#4a3c28"; g.fillRect(0, ground - 6 * s, w, h);
  // far horse (shadow knight) rides behind the tilt barrier
  const charge = Math.max(0, Math.min(1, (t - 1.0) / 2.4));
  const ease = charge * charge * (3 - 2 * charge);
  const impact = t >= 3.4;
  const after = Math.max(0, t - 3.4);
  const leftLoses = p.guilty;
  const lx = impact ? w * 0.47 + after * 320 * s : -160 * s + ease * (w * 0.47 + 160 * s);
  const rx = impact ? w * 0.53 - after * 320 * s : w + 160 * s - ease * (w * 0.47 + 160 * s);
  const gallop = t * 14;

  const fall = (leftSide) => {
    const ft = Math.min(1, after / 1.0);
    const slide = Math.min(after, 1.1);
    const fallX = leftSide ? w * 0.47 - slide * 70 * s : w * 0.53 + slide * 70 * s;
    const baseY = leftSide ? ground + 2 * s : ground - 26 * s;
    const fy = baseY + ft * ft * 70 * s - Math.sin(ft * Math.PI) * 50 * s;
    if (!leftSide && after > 1.0) {
      // the shadow knight dissolves into smoke
      const k = Math.min(1, (after - 1.0) / 1.2);
      for (let i = 0; i < 22; i++) {
        g.fillStyle = `rgba(130,130,150,${0.4 * (1 - k)})`;
        g.beginPath(); g.arc(fallX + (hash(i, 1) - 0.5) * 120 * s * k, fy - 40 * s - hash(i, 2) * 120 * s * k, (10 + hash(i, 3) * 20) * s, 0, 7); g.fill();
      }
      return;
    }
    g.save(); g.translate(fallX, fy); g.rotate((leftSide ? -1 : 1) * ft * 1.7);
    drawRider(g, 0, 0, leftSide ? 1 : -1, s, leftSide ? p.accusedColor : "#111", !leftSide, leftSide && after > 0.35, 0, true);
    g.restore();
  };

  // far side of the barrier: the shadow knight
  drawHorse(g, rx, ground - 26 * s, -1, gallop, "#111", s, "#1a1a1a");
  if (!impact || leftLoses) drawRider(g, rx, ground - 26 * s, -1, s, "#111", true, false, 0);
  else fall(false);
  // tilt barrier
  g.fillStyle = "#c9b48a"; g.fillRect(0, ground - 70 * s, w, 10 * s);
  for (let i = 0; i < 30; i++) g.fillRect(i * (w / 30), ground - 70 * s, 6 * s, 52 * s);
  // near side: the accused
  drawHorse(g, lx, ground + 2 * s, 1, gallop + 1, p.accusedColor, s, "#5a3a22");
  if (!impact || !leftLoses) drawRider(g, lx, ground + 2 * s, 1, s, p.accusedColor, false, false, 0);
  else fall(true);

  if (impact) {
    // the visor flies off a guilty knight, showing black armour and red eyes
    if (leftLoses) {
      const ht = Math.min(1.6, after);
      const hx = w * 0.47 - ht * 160 * s, hy = ground - 90 * s - Math.sin(Math.min(1, ht / 1.2) * Math.PI) * 160 * s + Math.max(0, ht - 1.2) * 200 * s;
      g.save(); g.translate(hx, hy); g.rotate(ht * 9);
      g.fillStyle = "#b9bec9"; g.beginPath(); g.arc(0, 0, 14 * s, Math.PI, 0); g.fill(); g.fillRect(-14 * s, 0, 28 * s, 6 * s);
      g.restore();
    }
    // splinters and the flash
    if (after < 0.9) {
      g.fillStyle = `rgba(255,250,220,${0.75 * (1 - after / 0.9)})`; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 24; i++) {
        const a = hash(i, 11) * Math.PI * 2, r = after * (200 + hash(i, 12) * 300) * s;
        g.fillStyle = "#e6d3a5";
        g.fillRect(w * 0.5 + Math.cos(a) * r, ground - 80 * s + Math.sin(a) * r * 0.6 + after * after * 300 * s, 10 * s, 3 * s);
      }
    }
  }

  // words
  g.textAlign = "center";
  g.fillStyle = "#f2e6c8";
  if (t < 3.4) {
    g.font = `italic ${Math.round(44 * s)}px Fraunces, Georgia, serif`;
    g.fillText("The Joust", w / 2, h * 0.13);
    g.font = `600 ${Math.round(20 * s)}px Inter, system-ui, sans-serif`;
    g.fillText(`${p.accusedName} rides against the Black Knight`, w / 2, h * 0.13 + 36 * s);
    g.font = `500 ${Math.round(15 * s)}px Inter, system-ui, sans-serif`;
    g.fillStyle = "#b9b1d6";
    g.fillText("If they are the Black Knight, they'll be knocked from the saddle...", w / 2, h * 0.13 + 64 * s);
  } else if (after > 1.3) {
    g.font = `italic ${Math.round(46 * s)}px Fraunces, Georgia, serif`;
    g.fillStyle = p.guilty ? "#ff8a70" : p.jester ? "#d18cff" : "#f2e6c8";
    g.fillText(p.guilty ? `${p.accusedName} WAS the Black Knight!` : `${p.accusedName} was not the Black Knight.`, w / 2, h * 0.14);
    g.font = `600 ${Math.round(18 * s)}px Inter, system-ui, sans-serif`;
    g.fillStyle = "#e7dcc0";
    const sub = p.guilty ? "The castle is saved! Raise the Donaghy Cup!" : p.jester ? `...but the cap and bells give them away: ${p.accusedName} was the Jester, in league with the Black Knight!` : `The shadow knight vanishes in smoke. ${p.accusedName} rides off into the night, out of the game.`;
    g.fillText(sub, w / 2, h * 0.14 + 38 * s);
  }
}

function drawHorse(g, x, y, dir, ph, cloth, s, coat) {
  g.save(); g.translate(x, y); g.scale(dir * s, s);
  const bob = Math.sin(ph) * 3;
  g.translate(0, bob);
  g.strokeStyle = coat; g.lineWidth = 9; g.lineCap = "round";
  const legs = [[-38, 0.0], [-26, 1.6], [30, 3.1], [42, 4.7]];
  for (const [lx, o] of legs) {
    const a = Math.sin(ph + o) * 0.6;
    g.beginPath(); g.moveTo(lx, 10); g.lineTo(lx + Math.sin(a) * 26, 10 + Math.cos(a) * 26); g.lineTo(lx + Math.sin(a) * 26 + Math.sin(a * 1.6) * 20, 10 + Math.cos(a) * 26 + 20); g.stroke();
  }
  g.fillStyle = coat;
  g.beginPath(); g.ellipse(0, 0, 58, 26, 0, 0, 7); g.fill();
  // neck and head
  g.beginPath(); g.moveTo(40, -10); g.lineTo(62, -50); g.lineTo(78, -54); g.lineTo(96, -30); g.lineTo(88, -22); g.lineTo(70, -34); g.lineTo(58, 6); g.closePath(); g.fill();
  // tail
  g.strokeStyle = coat; g.lineWidth = 6; g.beginPath(); g.moveTo(-56, -8); g.quadraticCurveTo(-80, 0 + Math.sin(ph) * 6, -76, 30); g.stroke();
  // caparison in the rider's colours
  g.fillStyle = cloth;
  g.beginPath(); g.moveTo(-50, -14); g.lineTo(46, -14); g.lineTo(52, 22); g.lineTo(36, 30); g.lineTo(20, 22); g.lineTo(2, 30); g.lineTo(-16, 22); g.lineTo(-34, 30); g.lineTo(-54, 20); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,220,140,0.6)"; g.lineWidth = 2; g.stroke();
  g.restore();
}

function drawRider(g, x, y, dir, s, color, black, unmasked, _r, falling) {
  g.save(); g.translate(x, y); g.scale(dir * s, s);
  // legs, body, shield, helmet
  g.fillStyle = black ? "#16161c" : "#9aa0ad";
  g.fillRect(-8, -40, 18, 30);
  g.fillStyle = black ? "#0b0b10" : color; g.fillRect(-11, -78, 24, 42);
  g.fillStyle = black ? "#22222a" : "#b9bec9";
  g.beginPath(); g.arc(1, -92, 15, 0, 7); g.fill();
  if (black || unmasked) {
    g.fillStyle = "#0b0b10"; g.beginPath(); g.arc(1, -92, 14, 0, 7); g.fill();
    g.fillStyle = "#ff3a2a"; g.fillRect(5, -96, 5, 3); g.fillRect(-4, -96, 5, 3);
    if (black) { g.fillStyle = "#8a1020"; g.beginPath(); g.moveTo(-4, -106); g.quadraticCurveTo(-30, -126, -36, -96); g.quadraticCurveTo(-18, -108, -2, -100); g.fill(); }
  } else {
    g.fillStyle = "#3a3e48"; g.fillRect(4, -96, 12, 3);
  }
  // shield
  g.fillStyle = black ? "#1d1d24" : color;
  g.beginPath(); g.moveTo(-26, -76); g.lineTo(-6, -76); g.lineTo(-6, -50); g.quadraticCurveTo(-16, -36, -26, -50); g.closePath(); g.fill();
  g.strokeStyle = black ? "#555" : "#e8dcb8"; g.lineWidth = 2; g.stroke();
  // lance
  if (!falling) {
    g.strokeStyle = black ? "#2a2a33" : "#d9c9a0"; g.lineWidth = 6;
    g.beginPath(); g.moveTo(-6, -66); g.lineTo(150, -54); g.stroke();
    g.fillStyle = black ? "#2a2a33" : "#c9b48a"; g.beginPath(); g.moveTo(4, -76); g.lineTo(18, -60); g.lineTo(4, -54); g.fill();
  }
  g.restore();
}
