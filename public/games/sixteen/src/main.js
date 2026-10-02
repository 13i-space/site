// SIXTEEN - entry point: loop, input, HUD, screens.

import { VIEW, CENTER, COLORS, SPECIALTIES, TIDE, GAME_ID } from "./config.js";
import { createGame } from "./game.js";
import { createRenderer } from "./render.js";
import { createAudio } from "./audio.js";
import { offerUpgrades } from "./upgrades.js";
import { INTRO, PERSONALITY_NOTES, DARK_LINES } from "./lore.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });

// ---------- persistence (fails soft) ----------
const SAVE_KEY = "13i-sixteen-v1";
let save = { best: 0, bestTide: 0, runs: 0, muted: false, volume: 0.7, seenIntro: false };
try { save = { ...save, ...JSON.parse(localStorage.getItem(SAVE_KEY) || "{}") }; } catch (e) { /* defaults */ }
const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* ignore */ } };

const audio = createAudio(() => save);
const renderer = createRenderer();
const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tell the 13i.space page hosting us about plays and scores.
function post(msg) {
  try {
    if (window.parent && window.parent !== window) window.parent.postMessage({ source: GAME_ID, ...msg }, window.location.origin);
  } catch (e) { /* not embedded */ }
}

// ---------- layout: fit VIEW into the canvas, centered ----------
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

// ---------- state ----------
let screen = "title"; // title | howto | play | between | over | paused
let g = null;
let demo = null;
let offers = [];
let hover = { x: -99, y: -99 };
let time = 0;
let hintsShown = new Set();
let lastRun = null;
let introT = 0;

function newDemo() {
  demo = createGame((Math.random() * 1e9) >>> 0);
  demo.arms.forEach((a) => { a.mature = true; });
  demo.phase = "between";
}
newDemo();

function hint(key, text, when = true) {
  if (!when || hintsShown.has(key)) return;
  hintsShown.add(key);
  g.say(text, "hint");
}

const hooks = {
  onEvent(type, data) {
    switch (type) {
      case "send": audio.send(); break;
      case "arrive": audio.arrive(); break;
      case "part": audio.part(); break;
      case "fault":
        audio.fault();
        if (data.fault.type === "overload") hint("overload", "Overloads need two limbs at once - send two.");
        if (data.fault.type === "component") hint("component", "Burnt components need a part: a limb fetches one from the chambers first.");
        if (data.fault.type === "call") hint("call", "Another Nerathi is calling. Answer (optional) - SIGNAL limbs are best - and their light joins yours.");
        break;
      case "escalate": audio.escalate(); hint("escalate", "Left too long, faults worsen and drain the city faster."); break;
      case "repair": audio.repair(g.mult); break;
      case "burst": audio.burst(); hint("burst", "Some faults hide until they burst. SENSE limbs feel them first."); break;
      case "reveal": audio.ui(); break;
      case "dissent":
        audio.dissent();
        if (!data.rupture) hint("dissent", "A limb disagrees! Press SPACE (or tap LISTEN) to follow it. They're usually right.");
        break;
      case "listen": audio.listen(); break;
      case "currentWarn": audio.currentWarn(); hint("current", "Currents tear loose anything not anchored. Tap your body (or press A) to anchor limbs before it hits."); break;
      case "anchor": audio.anchor(); break;
      case "held": audio.held(); break;
      case "torn": audio.torn(); break;
      case "call": audio.call(); break;
      case "mature": audio.mature(); break;
      case "autonomy": hint("autonomy", "Limbs you've listened to start acting on their own."); break;
      case "busy": audio.busy(); break;
      case "ruptureStart": audio.rupture(); break;
      case "ruptureDone": audio.triumph(); break;
      case "tideEnd":
        audio.tide();
        offers = offerUpgrades(g, g.rng);
        screen = "between";
        break;
      case "over": gameOver(); break;
      default: break;
    }
  },
};

function startRun() {
  audio.start();
  g = createGame((Math.random() * 0xffffffff) >>> 0, hooks);
  hintsShown = new Set();
  screen = "play";
  audio.ambient(0.55);
  g.say("Tide 1. The network hums.", "big");
  hint("start", "Click a glowing fault to send a limb. Keep the city lit.");
  post({ type: "play" });
}

function gameOver() {
  const score = Math.round(g.score);
  lastRun = {
    score,
    tide: g.tide,
    newBest: score > save.best,
    stats: { ...g.stats },
    matured: g.maturedCount(),
    line: DARK_LINES[Math.floor(Math.random() * DARK_LINES.length)],
  };
  save.best = Math.max(save.best, score);
  save.bestTide = Math.max(save.bestTide, g.tide);
  save.runs += 1;
  persist();
  post({ type: "score", score, tide: g.tide });
  audio.over();
  audio.ambient(0.25);
  screen = "over";
}

// ---------- input ----------
let buttons = []; // {x,y,w,h,action}
const inRect = (p, b) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h;

canvas.addEventListener("pointerdown", (e) => {
  canvas.focus();
  audio.start();
  const p = toLogical(e);
  const btn = buttons.find((b) => inRect(p, b));
  if (btn) { btn.action(); return; }
  if (screen !== "play" || !g) return;

  // a fault?
  const f = g.faults.filter((x) => x.revealed).map((x) => ({ x, d: Math.hypot(x.x - p.x, x.y - p.y) })).sort((a, b) => a.d - b.d)[0];
  const rupt = g.faults.find((x) => x.type === "rupture");
  const onRupture = rupt && Math.abs(p.x - rupt.x) < 200 && Math.abs(p.y - rupt.y) < 42;
  const faultHit = onRupture ? rupt : f && f.x.type !== "rupture" && f.d < 30 ? f.x : null;
  // a limb's tip?
  const arm = g.arms.filter((a) => a.mature).map((a) => ({ a, d: Math.hypot(a.tip.x - p.x, a.tip.y - p.y) })).sort((x, y) => x.d - y.d)[0];
  const armHit = arm && arm.d < 16 ? arm.a : null;
  const bodyHit = Math.hypot(p.x - CENTER.x, (p.y - CENTER.y) * 1.2) < 56;

  if (bodyHit && g.current) { g.addAnchor(); return; }
  if (faultHit && !(armHit && g.selectedArm === null && faultHit.type !== "rupture" && arm.d < 8)) { g.assign(faultHit.id); return; }
  if (armHit) { g.selectArm(armHit.id); audio.ui(); return; }
  if (g.selectedArm !== null) { g.selectedArm = null; }
});
canvas.addEventListener("pointermove", (e) => { hover = toLogical(e); });
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (screen !== "play" || !g) return;
  const p = toLogical(e);
  const arm = g.arms.filter((a) => a.mature).map((a) => ({ a, d: Math.hypot(a.tip.x - p.x, a.tip.y - p.y) })).sort((x, y) => x.d - y.d)[0];
  if (arm && arm.d < 18) g.recall(arm.a.id);
});

window.addEventListener("keydown", (e) => {
  audio.start();
  const k = e.key.toLowerCase();
  if (k === " " || k === "enter" || k === "escape" || k === "tab") e.preventDefault();
  if (screen === "title") {
    if (k === "enter" || k === " ") startRun();
    if (k === "h") screen = "howto";
    if (k === "m") toggleMute();
  } else if (screen === "howto") {
    if (k === "escape" || k === "enter" || k === " ") screen = "title";
  } else if (screen === "play") {
    if (k === " ") { if (!(g.rupture && g.listenRupture())) g.listen(); }
    if (k === "a") g.addAnchor();
    if (k === "escape" || k === "p") screen = "paused";
    if (k === "m") toggleMute();
    if (k === "r" && g.selectedArm !== null) { g.recall(g.selectedArm); g.selectedArm = null; }
  } else if (screen === "paused") {
    if (k === "escape" || k === "p" || k === " ") screen = "play";
  } else if (screen === "between") {
    const i = ["1", "2", "3"].indexOf(k);
    if (i >= 0 && offers[i]) chooseOffer(i);
  } else if (screen === "over") {
    if (k === "enter" || k === " ") startRun();
    if (k === "escape") { screen = "title"; newDemo(); }
  }
});
window.addEventListener("blur", () => { if (screen === "play") screen = "paused"; });

function toggleMute() { save.muted = !save.muted; persist(); audio.applyVolume(); }

function chooseOffer(i) {
  const o = offers[i];
  o.apply();
  audio.ui();
  offers = [];
  g.nextTide();
  screen = "play";
}

// ---------- drawing helpers ----------
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const SERIF = "'Fraunces', Georgia, serif";
function text(str, x, y, { size = 12, color = COLORS.text, align = "left", font = MONO, weight = "", alpha = 1, italic = false } = {}) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.font = `${italic ? "italic " : ""}${weight} ${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(str, x, y);
  ctx.restore();
}
function button(label, x, y, w, h, action, { primary = false, sub = null } = {}) {
  const hot = inRect(hover, { x, y, w, h });
  ctx.fillStyle = primary ? (hot ? "rgba(111,242,224,0.22)" : "rgba(111,242,224,0.12)") : hot ? "rgba(255,255,255,0.08)" : "rgba(4,21,31,0.8)";
  ctx.strokeStyle = primary ? COLORS.energy : "rgba(111,242,224,0.35)";
  ctx.lineWidth = 1.2;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  text(label, x + w / 2, y + h / 2 + (sub ? -2 : 5), { size: 13, align: "center", color: primary ? "#e8fffb" : COLORS.text, weight: "600" });
  if (sub) text(sub, x + w / 2, y + h / 2 + 14, { size: 9, align: "center", color: COLORS.muted });
  buttons.push({ x, y, w, h, action });
}
function wrap(str, maxW, size) {
  ctx.font = `${size}px ${MONO}`;
  const words = str.split(" "); const lines = []; let line = "";
  words.forEach((w) => { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
  if (line) lines.push(line);
  return lines;
}

// ---------- HUD ----------
function hud() {
  // light
  text("CITY LIGHT", 24, 26, { size: 10, color: COLORS.muted });
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(24, 34, 260, 10);
  const lf = g.light / 100;
  ctx.fillStyle = lf > 0.35 ? COLORS.energy : lf > 0.15 ? COLORS.energyWarm : `rgba(255,120,90,${0.6 + 0.4 * Math.sin(time * 10)})`;
  ctx.fillRect(24, 34, 260 * lf, 10);
  text(`${Math.round(g.light)}`, 292, 44, { size: 12, color: COLORS.text });
  if (lf < 0.2) text("THE CITY IS DIMMING", 24, 60, { size: 9, color: "#ff8a5c", alpha: 0.6 + 0.4 * Math.sin(time * 6) });
  // powers in play
  const powers = [];
  if (g.surgeTime > 0) powers.push(`FLARE ${Math.ceil(g.surgeTime)}s`);
  const hearts = g.mods.heart - g.heartsUsed;
  if (hearts > 0) powers.push(`SECOND HEART ×${hearts}`);
  if (powers.length) text(powers.join("  ·  "), 24, lf < 0.2 ? 76 : 60, { size: 9, color: COLORS.energyWarm, alpha: g.surgeTime > 0 ? 0.75 + 0.25 * Math.sin(time * 8) : 0.85 });

  // tide
  const left = Math.max(0, TIDE.length - g.tideTime);
  const label = g.phase === "rupture" ? "THE GREAT RUPTURE" : left > 0 ? `TIDE ${g.tide}  ·  ${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, "0")}` : `TIDE ${g.tide}  ·  CLEAR THE LAST FAULTS`;
  text(label, VIEW.w / 2, 30, { size: 12, align: "center", color: g.phase === "rupture" ? "#ff8a5c" : COLORS.text });
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(VIEW.w / 2 - 110, 38, 220, 3);
  ctx.fillStyle = COLORS.energy;
  ctx.fillRect(VIEW.w / 2 - 110, 38, 220 * Math.min(1, g.tideTime / TIDE.length), 3);
  if (g.tide % TIDE.ruptureEvery === 0 && g.phase === "play") text("THE RUPTURE COMES AT THE END OF THIS TIDE", VIEW.w / 2, 54, { size: 8.5, align: "center", color: "#ff8a5c", alpha: 0.7 });

  // score
  text(Math.round(g.score).toLocaleString(), VIEW.w - 24, 34, { size: 20, align: "right", color: "#e8fffb" });
  text(g.mult > 1.01 ? `COMBO ×${g.mult.toFixed(2)}` : "SCORE", VIEW.w - 24, 50, { size: 10, align: "right", color: g.mult > 1.01 ? COLORS.energyWarm : COLORS.muted });

  // messages
  g.messages.forEach((m, i) => {
    const color = { good: COLORS.energy, bad: "#ff8a5c", warn: COLORS.energyWarm, dissent: COLORS.sense, sense: COLORS.sense, hint: "#e8fffb", big: "#e8fffb" }[m.kind] || COLORS.text;
    const a = Math.min(1, m.life / 0.6);
    text(m.text, VIEW.w / 2, 82 + i * 19, { size: m.kind === "big" ? 13 : 11.5, align: "center", color, alpha: a, weight: m.kind === "hint" ? "600" : "" });
  });

  prompts();
  roster();
}

function prompts() {
  const y = 612;
  if (g.dissent) {
    const d = g.dissent, a = g.arms[d.armId];
    const w = 330, x = VIEW.w / 2 - w / 2;
    button(`LISTEN TO ${a.name.toUpperCase()}`, x, y, w, 34, () => g.listen(), { primary: true, sub: "SPACE" });
    ctx.fillStyle = COLORS.sense;
    ctx.fillRect(x, y + 34, w * (d.window / d.max), 2);
  } else if (g.rupture && (g.rupture.stage === "dissent" || g.rupture.stage === "ignored")) {
    const w = 380, x = VIEW.w / 2 - w / 2;
    button("LISTEN: CHANGE THE PLAN", x, y, w, 34, () => g.listenRupture(), { primary: true, sub: "SPACE" });
  } else if (g.current) {
    const have = g.anchorStrength(), need = g.current.need;
    const msg = g.current.warn > 0
      ? `CURRENT IN ${g.current.warn.toFixed(1)}s  ·  ANCHORS ${have}/${need}  ·  TAP YOUR BODY OR PRESS A`
      : g.current.sustained ? `HOLD AGAINST THE FLOOD  ·  ANCHORS ${have}/${need}  ·  TAP YOUR BODY OR PRESS A` : have >= need ? "HOLDING" : "TORN LOOSE";
    text(msg, VIEW.w / 2, y + 22, { size: 11, align: "center", color: have >= need ? "#7fd1a8" : COLORS.energyWarm, weight: "600" });
  } else if (g.rupture) {
    const f = g.rupture.fault;
    const present = [...f.assigned].filter((id) => g.arms[id].state === "work").length;
    text(`CLICK THE RUPTURE TO SEND LIMBS  ·  ${present}/6 WORKING`, VIEW.w / 2, y + 22, { size: 11, align: "center", color: COLORS.energyWarm });
  }
}

function roster() {
  const y = 660, slot = 58, x0 = VIEW.w / 2 - (16 * slot) / 2;
  g.arms.forEach((a, i) => {
    const x = x0 + i * slot;
    const sel = g.selectedArm === a.id;
    ctx.fillStyle = sel ? "rgba(255,240,244,0.12)" : "rgba(4,21,31,0.75)";
    ctx.fillRect(x + 2, y, slot - 4, 52);
    ctx.strokeStyle = sel ? "#fff0f4" : a.mature ? "rgba(111,242,224,0.2)" : "rgba(255,255,255,0.05)";
    ctx.strokeRect(x + 2.5, y + 0.5, slot - 5, 51);
    if (!a.mature) {
      text(a.name, x + slot / 2, y + 20, { size: 8.5, align: "center", color: COLORS.dim });
      text("asleep", x + slot / 2, y + 36, { size: 8, align: "center", color: COLORS.dim, italic: true });
      return;
    }
    const spec = SPECIALTIES[a.specialty];
    text(a.name, x + slot / 2, y + 13, { size: 8.5, align: "center", color: COLORS.text });
    ctx.fillStyle = spec.color;
    ctx.beginPath(); ctx.arc(x + 11, y + 25, 3.5, 0, Math.PI * 2); ctx.fill();
    text(`${spec.label.slice(0, 4)}${a.level > 1 ? ` ${a.level}` : ""}`, x + 17, y + 28, { size: 7.5, color: spec.color });
    const st = { idle: "·", travel: "→", fetch: "⇢", carry: "⇠", work: "✦", anchor: "⚓", dissent: "?", wander: "~", return: "←" }[a.state] || "";
    text(st, x + slot - 9, y + 28, { size: 10, align: "center", color: a.state === "dissent" ? COLORS.sense : COLORS.muted });
    for (let t = 0; t < 5; t++) {
      ctx.fillStyle = t < a.trust ? COLORS.sense : "rgba(255,255,255,0.1)";
      ctx.fillRect(x + 9 + t * 8, y + 38, 6, 3);
    }
    if (a.sulk > 0) text("sulking", x + slot / 2, y + 50, { size: 7, align: "center", color: "#ff8a5c" });
    buttons.push({ x: x + 2, y, w: slot - 4, h: 52, action: () => { g.selectArm(a.id); audio.ui(); } });
  });
  // selected limb details
  if (g.selectedArm !== null && !g.dissent && !g.current && !g.rupture) {
    const a = g.arms[g.selectedArm];
    const spec = SPECIALTIES[a.specialty];
    const w = 360, x = VIEW.w / 2 - w / 2, yy = 606;
    ctx.fillStyle = "rgba(2,10,16,0.92)";
    ctx.fillRect(x, yy - 4, w, 46);
    text(`${a.name.toUpperCase()}  ·  ${spec.label} ${a.level}  ·  ${a.personality}`, x + 10, yy + 12, { size: 10.5, color: spec.color });
    text(`${spec.note}; ${PERSONALITY_NOTES[a.personality]}. Click a fault to send it.`, x + 10, yy + 28, { size: 9, color: COLORS.muted });
    if (a.task !== null) button("RECALL", x + w - 70, yy + 2, 62, 22, () => { g.recall(a.id); g.selectedArm = null; });
  }
}

// ---------- screens ----------
function titleScreen() {
  demo.update(1 / 60);
  // idle limbs drift about for atmosphere
  if (Math.random() < 0.02) {
    const a = demo.arms[Math.floor(Math.random() * 16)];
    const ang = a.angle + (Math.random() - 0.5);
    a.state = "wander";
    a.wanderTo = { x: CENTER.x + Math.cos(ang) * (120 + Math.random() * 200), y: CENTER.y + Math.sin(ang) * (90 + Math.random() * 150) };
  }
  renderer.draw(ctx, demo, time, { reduced });
  ctx.fillStyle = "rgba(2,10,16,0.55)";
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("SIXTEEN", VIEW.w / 2, 190, { size: 76, align: "center", font: SERIF, italic: true, color: "#e8fffb" });
  text("A  GAME  OF  NERATH'S  SECRET", VIEW.w / 2, 226, { size: 12, align: "center", color: COLORS.energy });
  INTRO.forEach((l, i) => text(l, VIEW.w / 2, 290 + i * 24, { size: 13, align: "center", color: COLORS.text, alpha: Math.min(1, Math.max(0, (time - 0.5 - i * 0.7) / 0.8)) }));
  button("BEGIN", VIEW.w / 2 - 120, 440, 240, 44, startRun, { primary: true, sub: "ENTER" });
  button("HOW TO PLAY", VIEW.w / 2 - 120, 494, 240, 36, () => { screen = "howto"; });
  button(save.muted ? "SOUND: OFF" : "SOUND: ON", VIEW.w / 2 - 120, 540, 240, 30, toggleMute);
  if (save.best > 0) text(`BEST ${save.best.toLocaleString()}  ·  FURTHEST TIDE ${save.bestTide}`, VIEW.w / 2, 606, { size: 11, align: "center", color: COLORS.muted });
}

function howtoScreen() {
  renderer.background(ctx, null, time, reduced);
  ctx.fillStyle = "rgba(2,10,16,0.7)";
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("HOW TO PLAY", VIEW.w / 2, 70, { size: 16, align: "center", color: COLORS.energy, weight: "600" });
  const rows = [
    ["KEEP THE CITY LIT", "Faults drain the city's light. At zero, the district goes dark."],
    ["CLICK A FAULT", "Your best free limb goes to it. Or click a limb (or its slot below) first, then a fault."],
    ["MANY AT ONCE", "Every limb works on its own. Keep as many busy as you can - repairs in a row build a combo."],
    ["TWO-LIMB CONTROLS", "Overloads need two limbs working together. Dots under a fault show how many."],
    ["PARTS", "Burnt components need a part. The limb you send fetches one from a chamber first."],
    ["CURRENTS", "When a current comes, tap your body (or press A) to anchor limbs. ANCHOR limbs hold double."],
    ["DISAGREEMENT", "Sometimes a limb refuses and points elsewhere. SPACE to listen. They're usually right - and trust grows."],
    ["TRUST", "Limbs you trust start fixing things on their own. Ignore one that was right, and it sulks."],
    ["GROWING UP", "Between tides, choose how you grow: new limbs wake, old ones learn. Every fifth tide: the Great Rupture."],
  ];
  rows.forEach(([h, d], i) => {
    const y = 120 + i * 50;
    text(h, 150, y, { size: 11.5, color: COLORS.energyWarm, weight: "600" });
    wrap(d, 560, 11).forEach((l, k) => text(l, 330, y + k * 15, { size: 11, color: COLORS.text }));
  });
  text("RIGHT-CLICK a limb's tip (or R with it selected) to recall it  ·  ESC pauses", VIEW.w / 2, 590, { size: 10, align: "center", color: COLORS.muted });
  button("BACK", VIEW.w / 2 - 80, 620, 160, 36, () => { screen = "title"; });
}

function betweenScreen() {
  renderer.draw(ctx, g, time, { reduced });
  ctx.fillStyle = "rgba(2,10,16,0.78)";
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text(`TIDE ${g.tide} HELD`, VIEW.w / 2, 110, { size: 26, align: "center", font: SERIF, italic: true, color: "#e8fffb" });
  text(`SCORE ${Math.round(g.score).toLocaleString()}  ·  LIGHT ${Math.round(g.light)}  ·  ${g.maturedCount()} OF 16 LIMBS AWAKE`, VIEW.w / 2, 140, { size: 11, align: "center", color: COLORS.muted });
  text("HOW DO YOU GROW?", VIEW.w / 2, 196, { size: 12, align: "center", color: COLORS.energy, weight: "600" });
  const w = 270, gap = 24, x0 = VIEW.w / 2 - (w * 3 + gap * 2) / 2;
  offers.forEach((o, i) => {
    const x = x0 + i * (w + gap), y = 220, h = 240;
    const hot = inRect(hover, { x, y, w, h });
    ctx.fillStyle = hot ? "rgba(111,242,224,0.12)" : o.rare ? "rgba(40,28,8,0.92)" : "rgba(4,21,31,0.92)";
    ctx.strokeStyle = o.rare ? (hot ? "#ffe2a8" : COLORS.energyWarm) : hot ? COLORS.energy : "rgba(111,242,224,0.3)";
    ctx.lineWidth = 1.2;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    text(`${i + 1}`, x + 16, y + 28, { size: 12, color: COLORS.muted });
    text(o.tag, x + w - 16, y + 28, { size: 9, align: "right", color: COLORS.energyWarm });
    text(o.title, x + w / 2, y + 86, { size: 20, align: "center", font: SERIF, italic: true, color: "#e8fffb" });
    wrap(o.text, w - 40, 11.5).forEach((l, k) => text(l, x + w / 2, y + 126 + k * 18, { size: 11.5, align: "center", color: COLORS.text }));
    buttons.push({ x, y, w, h, action: () => chooseOffer(i) });
  });
  const nextRupture = (g.tide + 1) % TIDE.ruptureEvery === 0;
  text(nextRupture ? "NEXT: TIDE " + (g.tide + 1) + " - AND THE GREAT RUPTURE" : "NEXT: TIDE " + (g.tide + 1), VIEW.w / 2, 510, { size: 11, align: "center", color: nextRupture ? "#ff8a5c" : COLORS.muted });
}

function overScreen() {
  renderer.draw(ctx, g, time, { reduced });
  ctx.fillStyle = "rgba(0,0,0,0.78)";
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  const r = lastRun;
  text(r.line, VIEW.w / 2, 150, { size: 28, align: "center", font: SERIF, italic: true, color: "#e8fffb" });
  text(r.score.toLocaleString(), VIEW.w / 2, 220, { size: 42, align: "center", color: COLORS.energy });
  text(r.newBest ? "A NEW BEST" : `BEST ${save.best.toLocaleString()}`, VIEW.w / 2, 246, { size: 11, align: "center", color: r.newBest ? COLORS.energyWarm : COLORS.muted });
  const s = r.stats;
  const lines = [
    `REACHED TIDE ${r.tide}  ·  ${r.matured} OF 16 LIMBS AWAKE`,
    `REPAIRS ${s.repairs}  ·  RUPTURES SEALED ${s.ruptures}  ·  CURRENTS HELD ${s.currentsHeld}`,
    `LISTENED ${s.listened} (RIGHT ${s.listenedRight})  ·  IGNORED WHEN RIGHT ${s.ignoredRight}  ·  ACTED ALONE ${s.autonomous}`,
    `BEST COMBO ×${s.peakMult.toFixed(2)}  ·  ${Math.floor(s.time / 60)}:${String(Math.floor(s.time % 60)).padStart(2, "0")} BENEATH THE SURFACE`,
  ];
  lines.forEach((l, i) => text(l, VIEW.w / 2, 300 + i * 24, { size: 11.5, align: "center", color: COLORS.text }));
  const moral = s.ignoredRight > s.listenedRight
    ? "Your limbs knew more than you let them say."
    : s.autonomous > 5 ? "You let your minds lead. The city was better for it." : "Seventeen minds. One body. Next time, listen a little more.";
  text(moral, VIEW.w / 2, 420, { size: 13, align: "center", font: SERIF, italic: true, color: COLORS.sense });
  button("AGAIN", VIEW.w / 2 - 170, 470, 160, 42, startRun, { primary: true, sub: "ENTER" });
  button("TITLE", VIEW.w / 2 + 10, 470, 160, 42, () => { screen = "title"; newDemo(); });
}

function pausedScreen() {
  renderer.draw(ctx, g, time, { reduced });
  ctx.fillStyle = "rgba(2,10,16,0.75)";
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("PAUSED", VIEW.w / 2, 300, { size: 26, align: "center", font: SERIF, italic: true, color: "#e8fffb" });
  button("RESUME", VIEW.w / 2 - 110, 340, 220, 40, () => { screen = "play"; }, { primary: true, sub: "ESC" });
  button(save.muted ? "SOUND: OFF" : "SOUND: ON", VIEW.w / 2 - 110, 392, 220, 32, toggleMute);
  button("QUIT RUN", VIEW.w / 2 - 110, 436, 220, 32, () => { gameOver(); });
}

// ---------- loop ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  time += dt;
  buttons = [];
  try {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = COLORS.abyss;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, VIEW.w, VIEW.h); ctx.clip();
    if (screen === "title") titleScreen();
    else if (screen === "howto") howtoScreen();
    else if (screen === "play") {
      g.update(dt);
      audio.heartbeat(dt, g.light, true);
      if (screen === "play") { renderer.draw(ctx, g, time, { reduced }); hud(); }
    } else if (screen === "between") betweenScreen();
    else if (screen === "over") overScreen();
    else if (screen === "paused") pausedScreen();
    ctx.restore();
  } catch (e) {
    console.warn("[sixteen] frame error", e);
    ctx.restore();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// test hook: /games/sixteen/?test
if (new URLSearchParams(location.search).has("test")) window.__sixteen = { get g() { return g; }, startRun, get screen() { return screen; }, set screen(v) { screen = v; }, chooseOffer, get offers() { return offers; } };
