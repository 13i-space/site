// TUTTI - a game of The Accord (Assignment 3524578).
// You keep the Accord, the Pell's web of agreements with the other species
// of the Great Wood. Species arrive, each with something it GIVES (its outer
// ring) and something it NEEDS (the dot inside). Drag from one species to
// another whose need matches what it gives, and that need is met. A species
// whose need goes unmet too long leaves the Accord. Every species that
// thrives long enough joins the sung list for good (and its gifts go with
// it, so others will need a new giver). The vine creeps in from the edges,
// eating what it touches: drag from 13i (top right, the long view) to a
// vine and you'll see what it really is. Notes: docs/SEASONS.md.

const GAME_ID = "tutti";
const VIEW = { w: 960, h: 600 };
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });
const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TEST = /[?&]test\b/.test(window.location.search);

const SAVE_KEY = "13i-tutti-v1";
let save = { best: 0, bestVoices: 0, runs: 0, muted: false };
try { save = { ...save, ...JSON.parse(localStorage.getItem(SAVE_KEY) || "{}") }; } catch (e) { /* defaults */ }
const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* ignore */ } };
function post(msg) {
  try { if (window.parent && window.parent !== window) window.parent.postMessage({ source: GAME_ID, ...msg }, window.location.origin); } catch (e) { /* not embedded */ }
}

let scale = 1, offX = 0, offY = 0, dpr = 1;
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  scale = Math.min(w / VIEW.w, h / VIEW.h);
  offX = (w - VIEW.w * scale) / 2; offY = (h - VIEW.h * scale) / 2;
}
window.addEventListener("resize", resize);
resize();
const toLogical = (e) => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left - offX) / scale, y: (e.clientY - r.top - offY) / scale }; };

// ---------- sound: every species has a note; the Accord is a chord ----------
const audio = (() => {
  let ac = null;
  const get = () => {
    if (save.muted || TEST) return null;
    try { if (!ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ac = new C(); } if (ac.state === "suspended") ac.resume(); return ac; } catch (e) { return null; }
  };
  const tone = (f, dur = 0.3, vol = 0.05, type = "sine", slide = 0) => {
    const c = get(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(f * slide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur);
  };
  const SCALE = [262, 294, 330, 392, 440];
  return {
    unlock: () => get(),
    arrive: (k) => tone(SCALE[k] * 2, 0.4, 0.025, "triangle"),
    link: (k) => { tone(SCALE[k], 0.7, 0.04); tone(SCALE[k] * 1.5, 0.7, 0.025); },
    settle: () => SCALE.forEach((f, i) => setTimeout(() => tone(f * 2, 1.1, 0.03), i * 70)),
    lost: () => tone(140, 0.9, 0.05, "triangle", 0.6),
    wrong: () => tone(180, 0.2, 0.03, "square"),
    beast: () => [131, 165, 196, 262].forEach((f, i) => setTimeout(() => tone(f, 1.8, 0.05, "sine"), i * 180)),
    over: () => [392, 330, 262, 196].forEach((f, i) => setTimeout(() => tone(f, 1.2, 0.05, "triangle"), i * 200)),
    toggle: () => { save.muted = !save.muted; persist(); if (!save.muted) get(); },
  };
})();

// ---------- the Wood ----------
const GIFTS = [
  { key: "carry", c: "#7FD6E8" },
  { key: "light", c: "#9FE3B0" },
  { key: "warn", c: "#F2C14E" },
  { key: "clean", c: "#E8A4C8" },
  { key: "water", c: "#8B95F6" },
];
const NAMES = ["fliers", "glow-moss", "dam-fish", "drum-trees", "burrowers", "nightwings", "glass snails", "hum-bees", "sky-jellies", "root-otters", "lantern frogs", "seed-crabs", "mist-deer", "bark weavers", "reed singers", "spore kites", "pool turtles", "thorn larks"];
const ME = { x: 900, y: 62 };
const MAX_NODES = 13, MAX_GIVE = 2;

let screen = "title", game = null, lastRun = null;
const leaves = Array.from({ length: 70 }, (_, i) => ({ x: (i * 137) % VIEW.w, y: (i * 71) % VIEW.h, s: 10 + (i * 7) % 26, p: i }));
const drag = { from: null, x: 0, y: 0 };

function newGame() {
  return {
    t: 0, score: 0, settled: 0, lost: 0, beasts: 0, nodes: [], links: [], vines: [], spawn: 0.4, vineIn: 22, recharge: 0, fx: [], seq: 0,
    banner: { text: "What do you give? And what do you take?", at: performance.now() },
  };
}
function start() { audio.unlock(); game = newGame(); screen = "play"; save.runs += 1; persist(); post({ type: "play" }); for (let i = 0; i < 3; i++) spawnNode(); }
function finish() {
  const score = Math.floor(game.score);
  const isBest = score > save.best;
  save.best = Math.max(save.best, score); save.bestVoices = Math.max(save.bestVoices, game.settled); persist();
  lastRun = { score, settled: game.settled, beasts: game.beasts, time: Math.floor(game.t), best: isBest };
  post({ type: "score", score }); audio.over(); screen = "over";
}
const banner = (text) => { game.banner = { text, at: performance.now() }; };
const givesOut = (n) => game.links.filter((l) => l.from === n).length;
const fed = (n) => game.links.some((l) => l.to === n);

function freeSpot() {
  for (let tries = 0; tries < 60; tries++) {
    const x = 90 + Math.random() * 760, y = 130 + Math.random() * 400;
    if (Math.hypot(x - ME.x, y - ME.y) < 120) continue;
    if (game.nodes.some((n) => Math.hypot(n.x - x, n.y - y) < 96)) continue;
    if (game.vines.some((v) => Math.hypot(v.x - x, v.y - y) < v.r + 50)) continue;
    return { x, y };
  }
  return null;
}

function spawnNode() {
  const g = game;
  if (g.nodes.length >= MAX_NODES) return;
  const spot = freeSpot(); if (!spot) return;
  // favour needs someone can already give, so the web stays solvable
  const open = g.nodes.filter((n) => givesOut(n) < MAX_GIVE).map((n) => n.give);
  let need = open.length && Math.random() < 0.72 ? open[Math.floor(Math.random() * open.length)] : Math.floor(Math.random() * 5);
  // and gifts someone already needs
  const wanted = g.nodes.filter((n) => !fed(n)).map((n) => n.need).filter((k) => k !== need);
  let give = wanted.length && Math.random() < 0.6 ? wanted[Math.floor(Math.random() * wanted.length)] : Math.floor(Math.random() * 5);
  if (give === need) give = (give + 1 + Math.floor(Math.random() * 4)) % 5;
  g.seq += 1;
  g.nodes.push({ id: g.seq, ...spot, give, need, health: 1, thrive: 0, born: g.t, name: NAMES[g.seq % NAMES.length], wob: Math.random() * 6 });
  audio.arrive(give);
}

function spawnVine() {
  const g = game;
  const edge = Math.floor(Math.random() * 3);
  const x = edge === 0 ? 30 : edge === 1 ? 930 : 120 + Math.random() * 720;
  const y = edge === 2 ? 590 : 200 + Math.random() * 360;
  g.vines.push({ x, y, r: 14, grow: 5 + Math.min(9, g.t * 0.04), state: "vine", t: 0 });
  banner("The vine is moving. It answers no songs.");
}

function nodeAt(p, rad = 34) {
  let best = null, bd = rad;
  game.nodes.forEach((n) => { const d = Math.hypot(n.x - p.x, n.y - p.y); if (d < bd) { bd = d; best = n; } });
  return best;
}
function vineAt(p) { return game.vines.find((v) => v.state === "vine" && Math.hypot(v.x - p.x, v.y - p.y) < Math.max(30, v.r * 0.6)); }

function tryLink(a, b) {
  const g = game;
  if (!a || !b || a === b) return false;
  // whichever direction works
  let from = null, to = null;
  if (a.give === b.need && !fed(b)) { from = a; to = b; } else if (b.give === a.need && !fed(a)) { from = b; to = a; }
  if (!from) { audio.wrong(); banner(a.give === b.need || b.give === a.need ? "That need is already met." : "Neither gives what the other needs."); return false; }
  if (givesOut(from) >= MAX_GIVE) { audio.wrong(); banner(`The ${from.name} can't give to more than two.`); return false; }
  g.links.push({ from, to, born: g.t });
  g.score += 15; audio.link(from.give);
  g.fx.push({ x: to.x, y: to.y, t: 0, c: GIFTS[from.give].c });
  return true;
}

function longView(v) {
  const g = game;
  if (g.recharge > 0) { banner("The long view takes time. Wait for it."); audio.wrong(); return; }
  v.state = "beast"; v.t = 0; g.beasts += 1; g.score += 250; g.recharge = 7;
  banner(g.beasts === 1 ? "There you are. It was a loom-beast all along." : "Another young loom-beast. Tend it; let it eat only the old trees.");
  audio.beast();
}

// ---------- input ----------
canvas.addEventListener("pointerdown", (e) => {
  canvas.focus();
  const p = toLogical(e);
  if (p.x > VIEW.w - 110 && p.y < 30) { audio.toggle(); return; }
  if (screen !== "play") { start(); return; }
  if (Math.hypot(p.x - ME.x, p.y - ME.y) < 34) { drag.from = "me"; drag.x = p.x; drag.y = p.y; return; }
  const n = nodeAt(p);
  if (n) { drag.from = n; drag.x = p.x; drag.y = p.y; }
});
canvas.addEventListener("pointermove", (e) => { if (drag.from) { const p = toLogical(e); drag.x = p.x; drag.y = p.y; } });
const endDrag = (e) => {
  if (!drag.from || screen !== "play") { drag.from = null; return; }
  const p = e && e.clientX !== undefined ? toLogical(e) : { x: drag.x, y: drag.y };
  if (drag.from === "me") { const v = vineAt(p); if (v) longView(v); }
  else { const n = nodeAt(p); if (n && n !== drag.from) tryLink(drag.from, n); }
  drag.from = null;
};
window.addEventListener("pointerup", endDrag);
window.addEventListener("pointercancel", () => { drag.from = null; });
window.addEventListener("keydown", (e) => {
  if (e.key === "m" || e.key === "M") audio.toggle();
  if (screen !== "play" && (e.key === " " || e.key === "Enter")) { e.preventDefault(); start(); }
});

// ---------- update ----------
function update(dt) {
  const g = game;
  g.t += dt;
  g.recharge = Math.max(0, g.recharge - dt);
  g.spawn -= dt;
  if (g.spawn <= 0) { spawnNode(); g.spawn = Math.max(1.6, 4.6 - g.t * 0.016) * (0.8 + Math.random() * 0.4); }
  g.vineIn -= dt;
  if (g.vineIn <= 0) { spawnVine(); g.vineIn = Math.max(11, 26 - g.t * 0.05) * (0.8 + Math.random() * 0.4); }
  let thriving = 0;
  for (let i = g.nodes.length - 1; i >= 0; i--) {
    const n = g.nodes[i];
    const ok = fed(n);
    if (ok) { n.health = Math.min(1, n.health + dt * 0.25); n.thrive += dt; thriving += 1; }
    else n.health -= dt / Math.max(7, 16 - g.t * 0.025);
    // the vine eats what it touches
    g.vines.forEach((v) => { if (v.state === "vine" && Math.hypot(v.x - n.x, v.y - n.y) < v.r) n.health -= dt * 0.35; });
    if (n.thrive >= 18) {
      // joins the sung list for good, and takes its gifts with it
      g.settled += 1; g.score += 100; audio.settle();
      g.fx.push({ x: n.x, y: n.y, t: 0, c: "#FFF4DC", big: 1 });
      g.links = g.links.filter((l) => l.from !== n && l.to !== n);
      g.nodes.splice(i, 1);
      if (g.settled % 5 === 0) banner(`${200 + g.settled} voices in the Accord.`);
      continue;
    }
    if (n.health <= 0) {
      g.lost += 1; audio.lost();
      g.links = g.links.filter((l) => l.from !== n && l.to !== n);
      g.nodes.splice(i, 1);
      banner(`The ${n.name} left the Accord. ${6 - g.lost > 0 ? `${6 - g.lost} more and it breaks.` : ""}`);
    }
  }
  g.score += thriving * dt * 2;
  for (let i = g.vines.length - 1; i >= 0; i--) {
    const v = g.vines[i]; v.t += dt;
    if (v.state === "vine") v.r = Math.min(170, v.r + v.grow * dt);
    else if (v.t > 4) g.vines.splice(i, 1);
  }
  g.fx.forEach((f) => { f.t += dt; });
  g.fx = g.fx.filter((f) => f.t < 1);
  if (g.lost >= 6) finish();
}

// ---------- drawing ----------
function glow(x, y, r, color, a) { if (r <= 0 || a <= 0) return; const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, color); gr.addColorStop(1, "rgba(0,0,0,0)"); ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1; }
function text(str, x, y, { size = 14, color = "#E8E4F4", align = "center", font = "JetBrains Mono", italic = false, spacing = 0 } = {}) {
  ctx.font = `${italic ? "italic " : ""}${size}px "${font}", monospace`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing}px`; ctx.fillText(str, x, y); if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
}
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };

function drawWood(t) {
  const g = ctx.createLinearGradient(0, 0, 0, VIEW.h); g.addColorStop(0, "#163a2a"); g.addColorStop(1, "#06100b");
  ctx.fillStyle = g; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  leaves.forEach((l) => { ctx.globalAlpha = 0.14; ctx.fillStyle = l.p % 3 ? "#2f6a4a" : "#24533a"; ctx.beginPath(); ctx.ellipse(l.x + Math.sin(t * 0.3 + l.p) * 4, l.y, l.s, l.s * 0.5, l.p, 0, Math.PI * 2); ctx.fill(); });
  ctx.globalAlpha = 1;
  for (let i = 0; i < 40; i++) glow((i * 233 + t * 6) % VIEW.w, (i * 97) % VIEW.h, 3, rgba(GIFTS[i % 5].c, 0.8), 0.25 + 0.2 * Math.sin(t * 2 + i));
}

function drawVines(t) {
  game.vines.forEach((v) => {
    if (v.state === "vine") {
      glow(v.x, v.y, v.r * 1.1, "rgba(60,58,40,0.9)", 0.8);
      ctx.strokeStyle = "#7f8f6a"; ctx.lineWidth = 2.5;
      for (let i = 0; i < 9; i++) {
        const a = i * 0.7 + v.t * 0.05;
        ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.moveTo(v.x, v.y);
        for (let k = 1; k <= 8; k++) { const rr = (k / 8) * v.r; ctx.lineTo(v.x + Math.cos(a + Math.sin(k + i) * 0.3) * rr, v.y + Math.sin(a + Math.sin(k + i) * 0.3) * rr); }
        ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.lineWidth = 1;
      text("the unasked", v.x, v.y - 8, { size: 10, color: "#c8c8a0", spacing: 1 });
    } else {
      // a young loom-beast standing up
      const k = Math.min(1, v.t / 1.5), a = Math.max(0, 1 - (v.t - 2.5) / 1.5);
      glow(v.x, v.y, 120, "rgba(255,236,190,0.6)", a * 0.6);
      ctx.globalAlpha = a; ctx.fillStyle = "#2a2622"; ctx.strokeStyle = "#E8E4D4"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(v.x, v.y + 20 - k * 20, 60, 34 * k + 2, 0, Math.PI, 0); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 1; ctx.lineWidth = 1;
    }
  });
}

function drawLinks(t) {
  game.links.forEach((l) => {
    const c = GIFTS[l.from.give].c;
    ctx.strokeStyle = rgba(c, 0.55); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(l.from.x, l.from.y); ctx.lineTo(l.to.x, l.to.y); ctx.stroke();
    const k = ((t * 0.6 + l.from.id * 0.13) % 1);
    glow(l.from.x + (l.to.x - l.from.x) * k, l.from.y + (l.to.y - l.from.y) * k, 7, rgba(c, 0.9), 0.9);
  });
  ctx.lineWidth = 1;
  if (drag.from) {
    const f = drag.from === "me" ? ME : drag.from;
    ctx.setLineDash([4, 5]); ctx.strokeStyle = drag.from === "me" ? "#FFF4DC" : GIFTS[f.give].c; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(drag.x, drag.y); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
  }
}

function drawNodes(t) {
  game.nodes.forEach((n) => {
    const ok = fed(n), y = n.y + Math.sin(t * 1.4 + n.wob) * 2;
    const gc = GIFTS[n.give].c, nc = GIFTS[n.need].c;
    glow(n.x, y, 40, rgba(gc, ok ? 0.5 : 0.25), 0.8);
    // health ring
    ctx.strokeStyle = n.health < 0.35 ? "#E06A50" : "rgba(255,255,255,0.25)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(n.x, y, 30, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, n.health)); ctx.stroke();
    // what it gives: the outer ring
    ctx.fillStyle = "#0c1a12"; ctx.strokeStyle = gc; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(n.x, y, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // what it needs: the dot inside (hollow until met)
    ctx.lineWidth = 2.5; ctx.strokeStyle = nc; ctx.fillStyle = nc;
    ctx.beginPath(); ctx.arc(n.x, y, 8, 0, Math.PI * 2); ok ? ctx.fill() : ctx.stroke();
    // giving slots
    for (let i = 0; i < MAX_GIVE; i++) { ctx.fillStyle = i < givesOut(n) ? gc : "rgba(255,255,255,0.15)"; ctx.fillRect(n.x - 7 + i * 9, y + 27, 6, 3); }
    // thriving toward the list
    if (ok) { ctx.strokeStyle = "#FFF4DC"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(n.x, y, 35, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (n.thrive / 18)); ctx.stroke(); }
    ctx.lineWidth = 1;
    text(n.name, n.x, y - 44, { size: 10, color: "#cfe3d6" });
  });
  game.fx.forEach((f) => glow(f.x, f.y, (f.big ? 80 : 40) * (0.5 + f.t), rgba(f.c, 0.9), 1 - f.t));
}

function drawMe(t) {
  const ready = !game || game.recharge <= 0;
  glow(ME.x, ME.y, 40, "rgba(185,192,255,0.5)", ready ? 0.7 : 0.25);
  ctx.globalAlpha = ready ? 1 : 0.5; ctx.strokeStyle = "#B9C0FF"; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.arc(ME.x, ME.y, 13, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ME.x, ME.y + 13); ctx.lineTo(ME.x, ME.y + 26); ctx.stroke();
  ctx.fillStyle = "#E8CFC0"; ctx.beginPath(); ctx.arc(ME.x, ME.y, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1; ctx.lineWidth = 1;
  if (game && game.recharge > 0) { ctx.strokeStyle = "#FFF4DC"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ME.x, ME.y, 20, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - game.recharge / 7)); ctx.stroke(); ctx.lineWidth = 1; }
  text("THE LONG VIEW", ME.x - 6, ME.y + 42, { size: 9, color: "#B9C0FF", spacing: 1 });
}

function drawHud(t) {
  const g = game;
  text(`${Math.floor(g.score)}`, 24, 30, { align: "left", size: 20, color: "#FFFFFF" });
  text(`VOICES IN THE ACCORD · ${200 + g.settled}`, 24, 56, { align: "left", size: 11, color: "#9FE3B0", spacing: 2 });
  text(`LEFT · ${"●".repeat(g.lost)}${"○".repeat(Math.max(0, 6 - g.lost))}`, 24, 76, { align: "left", size: 11, color: "#E8A4C8", spacing: 2 });
  // the legend
  GIFTS.forEach((gf, i) => { const x = 300 + i * 92; ctx.strokeStyle = gf.c; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, 34, 6, 0, Math.PI * 2); ctx.stroke(); text(gf.key, x + 12, 34, { size: 11, color: gf.c, align: "left" }); });
  ctx.lineWidth = 1;
  const age = (performance.now() - g.banner.at) / 1000;
  if (age < 3) text(g.banner.text, 480, 572, { size: 17, font: "Fraunces", italic: true, color: `rgba(255,246,226,${Math.min(1, 3 - age)})` });
}

function drawTitle(t) {
  drawWood(t); drawMe(t);
  ctx.fillStyle = "rgba(6,16,11,0.74)"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("TUTTI", 480, 140, { size: 60, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text("A GAME OF THE ACCORD", 480, 184, { size: 12, color: "#9FE3B0", spacing: 4 });
  text("Every species GIVES something (its outer ring) and NEEDS something (the dot).", 480, 240, { size: 15, color: "#E4DCEB" });
  text("Drag from one to another to give it what it needs. Each can give to two.", 480, 264, { size: 15, color: "#E4DCEB" });
  text("Keep a species fed long enough and it joins the Accord for good.", 480, 288, { size: 15, color: "#F6E3B4" });
  text("The vine eats what it touches. Drag from 13i to the vine: see what it becomes.", 480, 322, { size: 15, color: "#B9C0FF" });
  text("tap to begin", 480, 400, { size: 13, color: `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 3)})`, spacing: 2 });
  if (save.best) text(`best ${save.best} · ${200 + save.bestVoices} voices`, 480, 430, { size: 11, color: "#9C8FA8" });
}

function drawOver(t) {
  drawWood(t);
  ctx.fillStyle = "rgba(6,16,11,0.78)"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("The Accord broke.", 480, 170, { size: 40, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text("Too many voices left the song.", 480, 216, { size: 14, color: "#E4DCEB" });
  text(`${200 + lastRun.settled} voices sung · ${lastRun.beasts} young loom-beasts found · ${lastRun.time}s`, 480, 252, { size: 13, color: "#9FE3B0" });
  text(`${lastRun.score}`, 480, 310, { size: 44, color: "#FFFFFF" });
  text(lastRun.best ? "a new best" : `best ${save.best}`, 480, 350, { size: 12, color: lastRun.best ? "#F6E3B4" : "#9C8FA8", spacing: 2 });
  text("tap to try again", 480, 420, { size: 13, color: `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 3)})`, spacing: 2 });
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const t = now / 1000;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#06100b"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, VIEW.w, VIEW.h); ctx.clip();
  if (screen === "title") drawTitle(t);
  else if (screen === "over") drawOver(t);
  else {
    if (!TEST) update(reduced ? dt * 0.85 : dt);
    if (screen === "play") { drawWood(t); drawVines(t); drawLinks(t); drawNodes(t); drawMe(t); drawHud(t); }
  }
  text(save.muted ? "sound off · M" : "sound on · M", VIEW.w - 20, 14, { align: "right", size: 10, color: "#9C8FA8" });
  ctx.restore();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ?test: a hook for balance checks (scripts drive the game frame by frame)
if (TEST) window.__game = { start, update, tryLink, longView, fed, givesOut, get g() { return game; }, get screen() { return screen; }, get last() { return lastRun; } };
