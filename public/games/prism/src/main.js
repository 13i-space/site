// PRISM - a game of The Sea of Glass (Assignment 0514229).
// You are the light on Dacapo's sea of glass. The bright one is casting its
// light toward the heavy one across a plain of returners; turn their crowns
// so the light passes from one to the next and reaches it before the white
// companion star rises. Every board is built from a real path, then
// scrambled, so it can always be solved. One module: board generation,
// drawing, sound, input and screens. Notes: docs/SEASONS.md.

const GAME_ID = "prism";
const VIEW = { w: 960, h: 600 };
const START_TIME = 50; // seconds before the companion rises
const BONUS_TIME = 9; // per plain crossed, plus 1.5s per column
const MAX_COLS = 10, MAX_ROWS = 6;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });
const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- persistence (fails soft) ----------
const SAVE_KEY = "13i-prism-v1";
let save = { best: 0, bestPlains: 0, runs: 0, muted: false };
try { save = { ...save, ...JSON.parse(localStorage.getItem(SAVE_KEY) || "{}") }; } catch (e) { /* defaults */ }
const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* ignore */ } };

function post(msg) {
  try {
    if (window.parent && window.parent !== window) window.parent.postMessage({ source: GAME_ID, ...msg }, window.location.origin);
  } catch (e) { /* not embedded */ }
}

// ---------- layout ----------
let scale = 1, offX = 0, offY = 0, dpr = 1;
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  scale = Math.min(w / VIEW.w, h / VIEW.h);
  offX = (w - VIEW.w * scale) / 2;
  offY = (h - VIEW.h * scale) / 2;
}
window.addEventListener("resize", resize);
resize();
const toLogical = (e) => {
  const r = canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left - offX) / scale, y: (e.clientY - r.top - offY) / scale };
};

// ---------- sound: glass, struck softly ----------
const audio = (() => {
  let ac = null;
  const get = () => {
    if (save.muted) return null;
    try {
      if (!ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ac = new C(); }
      if (ac.state === "suspended") ac.resume();
      return ac;
    } catch (e) { return null; }
  };
  const bell = (freq, when = 0, dur = 1.2, vol = 0.08) => {
    const c = get(); if (!c) return;
    const t0 = c.currentTime + when;
    [1, 2.76, 5.4].forEach((m, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = freq * m;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol / (i + 1), t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur / (i + 1));
      o.connect(g).connect(c.destination);
      o.start(t0); o.stop(t0 + dur);
    });
  };
  const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  return {
    unlock: () => get(),
    turn: (k) => bell(SCALE[k % SCALE.length] / 2, 0, 0.5, 0.05),
    lit: (n) => bell(SCALE[Math.min(SCALE.length - 1, n % SCALE.length)], 0, 0.9, 0.035),
    solve: () => [0, 2, 4, 5].forEach((k, i) => bell(SCALE[k], i * 0.09, 1.8, 0.07)),
    over: () => [5, 3, 1, 0].forEach((k, i) => bell(SCALE[k] / 2, i * 0.18, 2.4, 0.06)),
    toggle: () => { save.muted = !save.muted; persist(); if (!save.muted) get(); },
  };
})();

// ---------- the board ----------
// Directions: N=1, E=2, S=4, W=8. A tile's mask is the set of edges its
// crown passes light along. Rotating clockwise moves each bit one step.
const N = 1, E = 2, S = 4, W = 8;
const DIRS = [[N, 0, -1], [E, 1, 0], [S, 0, 1], [W, -1, 0]];
const OPP = { [N]: S, [E]: W, [S]: N, [W]: E };
const rot = (m) => ((m << 1) | (m >> 3)) & 15;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeBoard(level, seed) {
  const r = rng(seed);
  const cols = Math.min(MAX_COLS, 4 + Math.ceil(level * 0.8));
  const rows = Math.min(MAX_ROWS, 3 + Math.floor(level / 2));
  const sr = Math.floor(r() * rows), tr = Math.floor(r() * rows);
  // a wandering path from the bright one (left) to the heavy one (right)
  const key = (x, y) => y * cols + x;
  let path = null;
  for (let tries = 0; tries < 200 && !path; tries++) {
    const seen = new Set([key(0, sr)]);
    const p = [[0, sr]];
    let ok = false;
    for (let steps = 0; steps < cols * rows * 3; steps++) {
      const [x, y] = p[p.length - 1];
      if (x === cols - 1 && y === tr) { ok = true; break; }
      const opts = DIRS.map(([, dx, dy]) => [x + dx, y + dy, dx]).filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen.has(key(nx, ny)));
      if (!opts.length) break;
      // lean right, but wander more on bigger plains
      opts.sort((a, b) => (b[2] - a[2]) * 0.6 + (r() - 0.5) * (1.4 + level * 0.15));
      const [nx, ny] = opts[0];
      seen.add(key(nx, ny));
      p.push([nx, ny]);
    }
    if (ok && p.length >= cols) path = p;
  }
  if (!path) path = Array.from({ length: cols }, (_, i) => [i, sr]); // straight across (rare fallback)
  const tiles = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    // decoys: mostly bends and straights, a few three-way crowns
    const k = r();
    const base = k < 0.45 ? N | E : k < 0.85 ? N | S : N | E | S;
    tiles.push({ x, y, mask: base, onPath: false, angle: 0, flash: 0 });
  }
  const dirTo = (a, b) => (b[0] > a[0] ? E : b[0] < a[0] ? W : b[1] > a[1] ? S : N);
  path.forEach((c, i) => {
    const inn = i === 0 ? W : OPP[dirTo(path[i - 1], c)];
    const out = i === path.length - 1 ? E : dirTo(c, path[i + 1]);
    const t = tiles[key(c[0], c[1])];
    t.mask = inn | out;
    t.onPath = true;
  });
  // scramble
  let need = 0;
  tiles.forEach((t) => {
    const turns = Math.floor(r() * 4);
    for (let i = 0; i < turns; i++) t.mask = rot(t.mask);
    if (t.onPath) need += (4 - turns) % 4 === 0 ? 0 : 1;
  });
  const board = { cols, rows, sr, tr: path[path.length - 1][1], tiles, need: Math.max(1, need), moves: 0, lit: new Set(), solved: false, solvedAt: 0 };
  // never hand over a plain that's already crossed
  if (flow(board).solved) { const t = tiles[key(path[0][0], path[0][1])]; t.mask = rot(t.mask); board.need += 1; }
  return board;
}

function flow(b) {
  const key = (x, y) => y * b.cols + x;
  const lit = new Set();
  const start = b.tiles[key(0, b.sr)];
  if (!(start.mask & W)) return { lit, solved: false };
  const q = [start];
  lit.add(key(0, b.sr));
  while (q.length) {
    const t = q.shift();
    for (const [d, dx, dy] of DIRS) {
      if (!(t.mask & d)) continue;
      const nx = t.x + dx, ny = t.y + dy;
      if (nx < 0 || ny < 0 || nx >= b.cols || ny >= b.rows) continue;
      const n = b.tiles[key(nx, ny)];
      if (!(n.mask & OPP[d]) || lit.has(key(nx, ny))) continue;
      lit.add(key(nx, ny));
      q.push(n);
    }
  }
  const end = b.tiles[key(b.cols - 1, b.tr)];
  return { lit, solved: lit.has(key(b.cols - 1, b.tr)) && !!(end.mask & E) };
}

// board geometry in logical px
function geom(b) {
  const area = { x: 150, y: 132, w: 660, h: 400 };
  const size = Math.min(area.w / b.cols, area.h / b.rows);
  const gx = area.x + (area.w - size * b.cols) / 2;
  const gy = area.y + (area.h - size * b.rows) / 2;
  return { size, gx, gy };
}

// ---------- state ----------
let screen = "title"; // title | play | over
let game = null;
let lastRun = null;
let cursor = { x: 0, y: 0, shown: false };
const motes = Array.from({ length: 140 }, (_, i) => { const r = rng(i * 77 + 3); return { x: r() * VIEW.w, y: 120 + r() * 480, p: r() * 6.28, s: 0.5 + r() * 1.5 }; });
const falling = [];

function newGame() {
  return { level: 1, score: 0, time: START_TIME, plains: 0, board: makeBoard(1, (Math.random() * 1e9) >>> 0), banner: { text: "Carry the light to the heavy one.", at: performance.now() } };
}

function start() {
  audio.unlock();
  game = newGame();
  const f = flow(game.board); game.board.lit = f.lit;
  screen = "play";
  save.runs += 1;
  persist();
  post({ type: "play" });
}

function finish() {
  const score = Math.floor(game.score);
  const isBest = score > save.best;
  save.best = Math.max(save.best, score);
  save.bestPlains = Math.max(save.bestPlains, game.plains);
  persist();
  lastRun = { score, plains: game.plains, best: isBest };
  post({ type: "score", score });
  audio.over();
  screen = "over";
}

function turn(tile) {
  const b = game.board;
  if (b.solved) return;
  tile.mask = rot(tile.mask);
  tile.angle -= Math.PI / 2; // animate back to 0
  b.moves += 1;
  audio.turn(tile.x + tile.y);
  const before = b.lit.size;
  const f = flow(b);
  b.lit = f.lit;
  if (f.lit.size > before) audio.lit(f.lit.size);
  if (f.solved) {
    b.solved = true;
    b.solvedAt = performance.now();
    const par = b.need;
    const bonus = Math.max(0, par * 2 - b.moves) * 15;
    const gained = game.level * 100 + bonus + Math.floor(game.time);
    game.score += gained;
    game.plains += 1;
    game.time = Math.min(99, game.time + BONUS_TIME + b.cols * 1.5);
    game.banner = { text: `Plain ${game.plains} crossed  ·  +${gained}`, at: performance.now() };
    audio.solve();
    for (let i = 0; i < 70; i++) falling.push({ x: 600 + Math.random() * 340, y: 80 + Math.random() * 200, vy: 30 + Math.random() * 80, vx: (Math.random() - 0.5) * 30, r: Math.random() * 6.28, s: 2 + Math.random() * 4, life: 1, c: Math.random() < 0.8 ? "#E9B98A" : "#FFF1D6" });
    setTimeout(() => {
      if (screen !== "play") return;
      game.level += 1;
      game.board = makeBoard(game.level, (Math.random() * 1e9) >>> 0);
      const f2 = flow(game.board); game.board.lit = f2.lit;
    }, reduced ? 400 : 1500);
  }
}

// ---------- input ----------
canvas.addEventListener("pointerdown", (e) => {
  canvas.focus();
  const p = toLogical(e);
  // mute button
  if (p.x > VIEW.w - 70 && p.y < 50) { audio.toggle(); return; }
  if (screen !== "play") { start(); return; }
  cursor.shown = false;
  const b = game.board;
  const { size, gx, gy } = geom(b);
  const x = Math.floor((p.x - gx) / size), y = Math.floor((p.y - gy) / size);
  if (x >= 0 && y >= 0 && x < b.cols && y < b.rows) turn(b.tiles[y * b.cols + x]);
});
window.addEventListener("keydown", (e) => {
  if (e.key === "m" || e.key === "M") { audio.toggle(); return; }
  if (screen !== "play") { if (e.key === " " || e.key === "Enter") { e.preventDefault(); start(); } return; }
  const b = game.board;
  const mv = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
  if (mv) { e.preventDefault(); cursor.shown = true; cursor.x = Math.max(0, Math.min(b.cols - 1, cursor.x + mv[0])); cursor.y = Math.max(0, Math.min(b.rows - 1, cursor.y + mv[1])); }
  if (e.key === " " || e.key === "Enter") { e.preventDefault(); cursor.shown = true; turn(b.tiles[Math.min(cursor.y, b.rows - 1) * b.cols + Math.min(cursor.x, b.cols - 1)]); }
});

// ---------- drawing ----------
function glow(x, y, r, color, a) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = a;
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;
}

function drawWorld(t) {
  // sky: the red star low, the white companion climbing as time runs out
  const g = ctx.createLinearGradient(0, 0, 0, 130);
  g.addColorStop(0, "#120a18");
  g.addColorStop(1, "#5a2026");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VIEW.w, 130);
  glow(150, 130, 220, "rgba(224,106,80,0.55)", 0.8);
  ctx.fillStyle = "#E06A50";
  ctx.beginPath(); ctx.arc(150, 130, 46, Math.PI, 0); ctx.fill();
  const rise = game && screen === "play" ? 1 - Math.min(1, game.time / START_TIME) : 0.2;
  const cx = 820 - rise * 180, cy = 118 - rise * 84;
  glow(cx, cy, 30 + rise * 70, "rgba(235,240,255,0.8)", 0.5 + rise * 0.5);
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(cx, cy, 3 + rise * 5, 0, Math.PI * 2); ctx.fill();
  // the sea of glass
  const s = ctx.createLinearGradient(0, 130, 0, VIEW.h);
  s.addColorStop(0, "#d6c4c2");
  s.addColorStop(0.3, "#a596a8");
  s.addColorStop(1, "#3a3048");
  ctx.fillStyle = s;
  ctx.fillRect(0, 130, VIEW.w, VIEW.h - 130);
  motes.forEach((m) => {
    const a = Math.max(0, Math.sin(t * 1.3 + m.p * 3)) ** 6;
    if (a < 0.05) return;
    ctx.globalAlpha = a * 0.8;
    ctx.fillStyle = "#FFF8EE";
    ctx.fillRect(m.x - m.s, m.y, m.s * 2, 1);
    ctx.fillRect(m.x, m.y - m.s, 1, m.s * 2);
  });
  ctx.globalAlpha = 1;
}

// a returner, standing: x, base, height, tint 0 clear .. 1 amber
function returner(x, base, h, tint, t, { lit = 0, rings = 6 } = {}) {
  const hipY = base - h * 0.42, top = hipY - h * 0.5, bw = h * 0.09;
  ctx.strokeStyle = tint > 0.5 ? "#6b4630" : "#E4DCEB";
  ctx.lineWidth = 2;
  [[-1, 0], [1, 0], [0.15, 0.3]].forEach(([dx, f]) => { ctx.beginPath(); ctx.moveTo(x, hipY); ctx.lineTo(x + dx * h * 0.13, base + f * 4); ctx.stroke(); });
  for (let k = rings; k >= 1; k--) {
    const f = k / rings, w = bw * (0.35 + 0.65 * f);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = tint > 0.5 ? (f > 0.5 ? "#8A5236" : "#B8754E") : "#F4F6FF";
    ctx.fillRect(x - w, top, w * 2, hipY - top);
  }
  ctx.globalAlpha = 1;
  const coreY = top + (hipY - top) * 0.55;
  glow(x, coreY, h * 0.3, tint > 0.5 ? `rgba(217,154,106,${0.4 + lit * 0.5})` : "rgba(255,241,214,0.9)", 0.5 + lit * 0.5);
  ctx.fillStyle = tint > 0.5 && !lit ? "#D99A6A" : "#fff";
  ctx.beginPath(); ctx.arc(x, coreY, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = tint > 0.5 ? "#C98A5A" : "#F4F6FF";
  for (let k = -2; k <= 2; k++) {
    ctx.beginPath();
    ctx.moveTo(x + k * bw * 0.3, top);
    ctx.lineTo(x + k * bw * 0.6, top - h * 0.07 * (1 - Math.abs(k) * 0.25));
    ctx.lineTo(x + k * bw * 0.6 + bw * 0.25, top);
    ctx.fill();
  }
  return { coreY };
}

function drawBoard(t) {
  const b = game.board;
  const { size, gx, gy } = geom(b);
  const now = performance.now();
  const solvedK = b.solved ? Math.min(1, (now - b.solvedAt) / 700) : 0;
  // the bright one, left, and its beam into the first tile
  const sy = gy + (b.sr + 0.5) * size;
  const bright = returner(70, sy + 60, 150, 0, t, { rings: 3 });
  const pulse = 0.6 + 0.4 * Math.sin(t * 3);
  ctx.strokeStyle = `rgba(255,248,235,${0.5 + 0.4 * pulse})`;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(78, bright.coreY); ctx.quadraticCurveTo(110, sy, gx, sy); ctx.stroke();
  glow(gx, sy, 18, "rgba(255,241,214,0.9)", pulse);
  // the heavy one, right
  const ty = gy + (b.tr + 0.5) * size;
  const heavy = returner(VIEW.w - 70, ty + 60, 160, 1 - solvedK * 0.8, t, { lit: solvedK, rings: Math.round(14 - solvedK * 10) });
  const endLit = b.lit.has(b.tr * b.cols + b.cols - 1) && (b.tiles[b.tr * b.cols + b.cols - 1].mask & E);
  ctx.strokeStyle = endLit ? `rgba(255,248,235,${0.6 + 0.4 * pulse})` : "rgba(255,255,255,0.12)";
  ctx.lineWidth = endLit ? 3 : 1.5;
  ctx.beginPath(); ctx.moveTo(gx + size * b.cols, ty); ctx.quadraticCurveTo(VIEW.w - 110, ty, VIEW.w - 76, heavy.coreY); ctx.stroke();

  // a darker pane of glass under the board, so unlit crowns read clearly
  ctx.fillStyle = "rgba(24,14,34,0.42)";
  ctx.strokeStyle = "rgba(255,241,214,0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(gx - 10, gy - 10, size * b.cols + 20, size * b.rows + 20, 14);
  else ctx.rect(gx - 10, gy - 10, size * b.cols + 20, size * b.rows + 20);
  ctx.fill(); ctx.stroke();

  // the tiles: each one a returner's crown seen from above
  b.tiles.forEach((tile) => {
    const cx = gx + (tile.x + 0.5) * size, cy = gy + (tile.y + 0.5) * size;
    const on = b.lit.has(tile.y * b.cols + tile.x);
    tile.angle *= reduced ? 0 : 0.72;
    ctx.save();
    ctx.translate(cx, cy);
    // glass plate
    const r0 = size * 0.44;
    ctx.globalAlpha = on ? 0.9 : 0.55;
    ctx.fillStyle = on ? "rgba(255,246,232,0.35)" : "rgba(30,22,44,0.35)";
    ctx.strokeStyle = on ? "rgba(255,241,214,0.9)" : "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2 + Math.PI / 8; ctx.lineTo(Math.cos(a) * r0, Math.sin(a) * r0); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.rotate(tile.angle);
    // channels of light
    const reach = size * 0.5;
    if (on) glow(0, 0, size * 0.6, "rgba(255,241,214,0.8)", 0.35 + 0.15 * Math.sin(t * 2 + tile.x));
    ctx.lineCap = "round";
    DIRS.forEach(([d, dx, dy]) => {
      if (!(tile.mask & d)) return;
      ctx.strokeStyle = on ? "#FFF6E6" : "rgba(214,204,232,0.6)";
      ctx.lineWidth = on ? size * 0.12 : size * 0.09;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(dx * reach, dy * reach); ctx.stroke();
    });
    ctx.fillStyle = on ? "#fff" : "#B9B0C8";
    ctx.beginPath(); ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    if (cursor.shown && cursor.x === tile.x && cursor.y === tile.y) {
      ctx.strokeStyle = "#8B95F6"; ctx.lineWidth = 2;
      ctx.strokeRect(cx - size * 0.48, cy - size * 0.48, size * 0.96, size * 0.96);
    }
  });
}

function drawFalling(dt) {
  for (let i = falling.length - 1; i >= 0; i--) {
    const f = falling[i];
    f.y += f.vy * dt; f.x += f.vx * dt; f.r += dt * 2; f.life -= dt * 0.45;
    if (f.life <= 0 || f.y > VIEW.h) { falling.splice(i, 1); continue; }
    ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.r);
    ctx.globalAlpha = f.life; ctx.fillStyle = f.c;
    ctx.beginPath(); ctx.moveTo(0, -f.s); ctx.lineTo(f.s * 0.5, 0); ctx.lineTo(0, f.s); ctx.lineTo(-f.s * 0.5, 0); ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function text(str, x, y, { size = 14, color = "#E8E4F4", align = "center", font = "JetBrains Mono", italic = false, spacing = 0 } = {}) {
  ctx.font = `${italic ? "italic " : ""}${size}px "${font}", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing}px`;
  ctx.fillText(str, x, y);
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
}

function drawHud(t) {
  text(`PLAIN ${game.plains + 1}`, 24, 26, { align: "left", size: 13, color: "#F4E4DA", spacing: 2 });
  text(`${Math.floor(game.score)}`, 24, 48, { align: "left", size: 18, color: "#FFFFFF" });
  // the companion's approach
  const frac = Math.min(1, game.time / START_TIME);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(330, 20, 300, 6);
  ctx.fillStyle = game.time < 10 ? "#E06A50" : "#F4F6FF";
  ctx.fillRect(330, 20, 300 * Math.min(1, game.time / 60), 6);
  text(game.time < 10 ? "the companion is rising" : "before the white star rises", 480, 40, { size: 11, color: "#C9B8C8", spacing: 1 });
  const age = (performance.now() - game.banner.at) / 1000;
  if (age < 2.6) text(game.banner.text, 480, 104, { size: 20, font: "Fraunces", italic: true, color: `rgba(255,241,214,${Math.min(1, 2.6 - age)})` });
  void frac; void t;
}

function drawMute() {
  text(save.muted ? "sound off · M" : "sound on · M", VIEW.w - 20, 24, { align: "right", size: 10, color: "#9C8FA8" });
}

function drawTitle(t) {
  drawWorld(t);
  ctx.fillStyle = "rgba(12,7,16,0.6)";
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  returner(250, 470, 230, 0.02, t, { rings: 3 });
  returner(710, 470, 240, 1, t, { rings: 14 });
  text("PRISM", 480, 190, { size: 64, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text("A GAME OF THE SEA OF GLASS", 480, 236, { size: 12, color: "#E8CFC0", spacing: 4 });
  text("Turn the crowns. Carry the bright one's light", 480, 300, { size: 15, color: "#E4DCEB" });
  text("across the plain to the heavy one,", 480, 324, { size: 15, color: "#E4DCEB" });
  text("before the white star rises.", 480, 348, { size: 15, color: "#E4DCEB" });
  const a = 0.6 + 0.4 * Math.sin(t * 3);
  text("tap to begin", 480, 420, { size: 13, color: `rgba(255,255,255,${a})`, spacing: 2 });
  if (save.best) text(`best ${save.best} · ${save.bestPlains} plains`, 480, 450, { size: 11, color: "#9C8FA8" });
  text("tap a crown to turn it · arrows + space work too", 480, 560, { size: 11, color: "#9C8FA8" });
}

function drawOver(t) {
  drawWorld(t);
  ctx.fillStyle = "rgba(240,240,255,0.08)";
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  ctx.fillStyle = "rgba(12,7,16,0.62)";
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("The Return has come.", 480, 190, { size: 40, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text(`You carried the light across ${lastRun.plains} ${lastRun.plains === 1 ? "plain" : "plains"}.`, 480, 250, { size: 15, color: "#E4DCEB" });
  text(`${lastRun.score}`, 480, 310, { size: 44, color: "#FFFFFF" });
  text(lastRun.best ? "a new best" : `best ${save.best}`, 480, 350, { size: 12, color: lastRun.best ? "#E9D29A" : "#9C8FA8", spacing: 2 });
  const a = 0.6 + 0.4 * Math.sin(t * 3);
  text("tap to cross again", 480, 430, { size: 13, color: `rgba(255,255,255,${a})`, spacing: 2 });
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const t = now / 1000;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#0c0710";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, VIEW.w, VIEW.h); ctx.clip();
  if (screen === "title") drawTitle(t);
  else if (screen === "over") drawOver(t);
  else {
    if (!game.board.solved) game.time -= dt;
    if (game.time <= 0) { game.time = 0; finish(); }
    drawWorld(t);
    drawBoard(t);
    drawFalling(dt);
    drawHud(t);
  }
  drawMute();
  ctx.restore();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
