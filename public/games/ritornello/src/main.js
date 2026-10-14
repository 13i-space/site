// RITORNELLO - a game of The Ring (Assignment 5702887).
// Teodi Sarn at the eyepiece on Hal Teru, learning to talk to the Ring.
// The Ring lights a phrase, one arc at a time, each with its own note.
// Answer it back. Every time you do, the phrase returns with one more note
// (a ritornello: the passage that comes back). Later, the Ring sometimes
// asks for the phrase backward. Three wrong answers and the clouds come in.
// Keys 1-6 (clockwise from the top) work too. Notes: docs/SEASONS.md.

const GAME_ID = "ritornello";
const VIEW = { w: 960, h: 600 };
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });
const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TEST = /[?&]test\b/.test(window.location.search);

const SAVE_KEY = "13i-ritornello-v1";
let save = { best: 0, bestLen: 0, runs: 0, muted: false };
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

// ---------- sound: six arcs, six notes of a pentatonic scale ----------
const NOTES = [392, 440, 523, 587, 659, 784];
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
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur);
  };
  return {
    unlock: () => get(),
    note: (i, dur = 0.5) => { tone(NOTES[i], dur, 0.05, "sine"); tone(NOTES[i] * 2, dur * 0.6, 0.012, "triangle"); },
    good: () => [0, 2, 4].forEach((k, i) => setTimeout(() => tone(NOTES[k] * 2, 0.6, 0.03), i * 80)),
    wrong: () => tone(150, 0.6, 0.06, "sawtooth", 0.6),
    over: () => [392, 330, 262, 196].forEach((f, i) => setTimeout(() => tone(f, 1.2, 0.05, "triangle"), i * 200)),
    toggle: () => { save.muted = !save.muted; persist(); if (!save.muted) get(); },
  };
})();

// ---------- the Ring ----------
const C = { x: 480, y: 300 }, R = 150, BAND = 46, ARCS = 6;
const arcAngle = (i) => -Math.PI / 2 + (i / ARCS) * Math.PI * 2; // centre of arc i, 0 = top, clockwise
let screen = "title", game = null, lastRun = null;
const hash = (n) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
const stars = Array.from({ length: 180 }, (_, i) => ({ x: hash(i + 1) * VIEW.w, y: hash(i + 501) * VIEW.h, p: i, s: 0.6 + hash(i + 901) }));

function newGame() {
  return { t: 0, seq: [], phase: "show", idx: 0, timer: 1.2, lit: -1, litT: 0, input: [], backward: false, nights: 3, score: 0, round: 0, flash: null,
    banner: { text: "Are you listening?", at: performance.now() } };
}
function start() { audio.unlock(); game = newGame(); screen = "play"; save.runs += 1; persist(); post({ type: "play" }); nextRound(true); }
function finish() {
  const score = Math.floor(game.score);
  const isBest = score > save.best;
  const len = Math.max(0, game.seq.length - 1);
  save.best = Math.max(save.best, score); save.bestLen = Math.max(save.bestLen, len); persist();
  lastRun = { score, len, rounds: game.round, best: isBest };
  post({ type: "score", score }); audio.over(); screen = "over";
}
const banner = (text) => { game.banner = { text, at: performance.now() }; };
const speed = () => Math.max(0.3, 0.66 - game.round * 0.022);

function nextRound(first) {
  const g = game;
  if (!first) g.round += 1;
  // the passage returns, with one note more
  g.seq.push(Math.floor(Math.random() * ARCS));
  if (g.seq.length < 3) g.seq.push(Math.floor(Math.random() * ARCS));
  g.backward = g.round >= 4 && Math.random() < 0.35;
  replay();
}
function replay() {
  const g = game;
  g.phase = "show"; g.idx = 0; g.timer = 0.9; g.input = [];
}

function press(i) {
  const g = game;
  if (screen !== "play" || g.phase !== "answer") return;
  g.lit = i; g.litT = 0.25; audio.note(i, 0.35);
  const want = g.backward ? g.seq[g.seq.length - 1 - g.input.length] : g.seq[g.input.length];
  if (i !== want) {
    g.nights -= 1; audio.wrong();
    g.flash = { c: "rgba(224,106,80,0.6)", t: 0 };
    if (g.nights <= 0) { finish(); return; }
    banner(g.nights === 1 ? "The clouds are coming in. One more night." : "Not that. The Ring repeats itself.");
    g.phase = "wait"; g.timer = 1.1;
    return;
  }
  g.input.push(i);
  if (g.input.length === g.seq.length) {
    const pts = g.seq.length * 10 * (g.backward ? 2 : 1);
    g.score += pts; audio.good();
    g.flash = { c: "rgba(243,230,200,0.5)", t: 0 };
    if (g.round === 3) banner("It answers you. It's adding a note each time.");
    else if (g.backward) banner("Backward, and right.");
    g.phase = "next"; g.timer = 0.9;
  }
}

canvas.addEventListener("pointerdown", (e) => {
  canvas.focus();
  const p = toLogical(e);
  if (p.x > VIEW.w - 110 && p.y < 40) { audio.toggle(); return; }
  if (screen !== "play") { start(); return; }
  const dx = p.x - C.x, dy = p.y - C.y, d = Math.hypot(dx, dy);
  if (d < R - BAND - 10 || d > R + BAND + 20) return;
  let a = Math.atan2(dy, dx) + Math.PI / 2; if (a < 0) a += Math.PI * 2;
  press(Math.round(a / (Math.PI * 2 / ARCS)) % ARCS);
});
window.addEventListener("keydown", (e) => {
  if (e.key === "m" || e.key === "M") audio.toggle();
  if (screen !== "play" && (e.key === " " || e.key === "Enter")) { e.preventDefault(); start(); return; }
  const k = "123456".indexOf(e.key);
  if (k >= 0) press(k);
});

function update(dt) {
  const g = game;
  g.t += dt;
  g.litT = Math.max(0, g.litT - dt); if (g.litT <= 0 && g.phase !== "show") g.lit = -1;
  if (g.flash) { g.flash.t += dt; if (g.flash.t > 0.6) g.flash = null; }
  g.timer -= dt;
  if (g.phase === "show" && g.timer <= 0) {
    if (g.idx < g.seq.length) {
      const i = g.seq[g.idx]; g.lit = i; g.litT = speed() * 0.75; audio.note(i, speed() * 0.9);
      g.idx += 1; g.timer = speed();
    } else { g.phase = "answer"; g.lit = -1; }
  } else if (g.phase === "wait" && g.timer <= 0) replay();
  else if (g.phase === "next" && g.timer <= 0) nextRound(false);
}

// ---------- drawing ----------
function glow(x, y, r, color, a) { if (r <= 0 || a <= 0) return; const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, color); gr.addColorStop(1, "rgba(0,0,0,0)"); ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1; }
function text(str, x, y, { size = 14, color = "#E8E4F4", align = "center", font = "JetBrains Mono", italic = false, spacing = 0 } = {}) {
  ctx.font = `${italic ? "italic " : ""}${size}px "${font}", monospace`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing}px`; ctx.fillText(str, x, y); if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
}

function drawSky(t) {
  const g = ctx.createLinearGradient(0, 0, 0, VIEW.h); g.addColorStop(0, "#03040e"); g.addColorStop(1, "#141a34");
  ctx.fillStyle = g; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  stars.forEach((s) => { ctx.globalAlpha = 0.25 + 0.5 * Math.abs(Math.sin(t * 0.4 + s.p)); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(s.x, s.y, s.s, s.s); });
  ctx.globalAlpha = 1;
  // the eyepiece's edge
  ctx.strokeStyle = "rgba(42,46,68,0.9)"; ctx.lineWidth = 40; ctx.beginPath(); ctx.arc(C.x, C.y, 300, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1;
  const v = ctx.createRadialGradient(C.x, C.y, 240, C.x, C.y, 520); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = v; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
}

function drawRing(t) {
  const g = game;
  glow(C.x, C.y, R * 1.7, "rgba(243,230,200,0.12)", 0.8);
  for (let i = 0; i < ARCS; i++) {
    const a0 = arcAngle(i) - Math.PI / ARCS + 0.05, a1 = arcAngle(i) + Math.PI / ARCS - 0.05;
    const on = g && g.lit === i;
    ctx.strokeStyle = on ? "#FFFFFF" : "rgba(243,230,200,0.35)"; ctx.lineWidth = on ? 30 : 22;
    ctx.beginPath(); ctx.arc(C.x, C.y, R, a0, a1); ctx.stroke();
    if (on) { const mx = C.x + Math.cos(arcAngle(i)) * R, my = C.y + Math.sin(arcAngle(i)) * R; glow(mx, my, 90, "rgba(243,230,200,0.9)", 0.8); }
    const lx = C.x + Math.cos(arcAngle(i)) * (R + 52), ly = C.y + Math.sin(arcAngle(i)) * (R + 52);
    text(`${i + 1}`, lx, ly, { size: 11, color: "rgba(185,192,255,0.6)" });
  }
  ctx.lineWidth = 1;
  // 13i in the middle, still
  ctx.strokeStyle = "#B9C0FF"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(C.x, C.y, 12, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(C.x, C.y + 12); ctx.lineTo(C.x, C.y + 24); ctx.stroke(); ctx.lineWidth = 1;
  ctx.fillStyle = "#E8CFC0"; ctx.beginPath(); ctx.arc(C.x, C.y, 4, 0, Math.PI * 2); ctx.fill();
}

function drawHud(t) {
  const g = game;
  text(`${Math.floor(g.score)}`, 24, 30, { align: "left", size: 20, color: "#FFFFFF" });
  text(`PHRASE · ${g.seq.length} NOTES`, 24, 56, { align: "left", size: 11, color: "#F3E6C8", spacing: 2 });
  text(`NIGHTS · ${"●".repeat(g.nights)}${"○".repeat(3 - g.nights)}`, 24, 76, { align: "left", size: 11, color: "#B9C0FF", spacing: 2 });
  const label = g.phase === "show" ? "THE RING SPEAKS" : g.phase === "answer" ? (g.backward ? "↺ ANSWER IT BACKWARD" : "ANSWER") : "";
  if (label) text(label, 480, 548, { size: 13, color: g.backward && g.phase === "answer" ? "#F2C98A" : "#F3E6C8", spacing: 4 });
  if (g.phase === "answer") for (let i = 0; i < g.seq.length; i++) { ctx.fillStyle = i < g.input.length ? "#F3E6C8" : "rgba(243,230,200,0.2)"; ctx.fillRect(480 - g.seq.length * 7 + i * 14, 568, 9, 4); }
  if (g.backward && g.phase === "show") text("↺ the next answer is backward", 480, 572, { size: 11, color: "#F2C98A", spacing: 1 });
  const age = (performance.now() - g.banner.at) / 1000;
  if (age < 2.6) text(g.banner.text, 480, 40, { size: 18, font: "Fraunces", italic: true, color: `rgba(255,246,226,${Math.min(1, 2.6 - age)})` });
  if (g.flash) { ctx.globalAlpha = 0.25 * (1 - g.flash.t / 0.6); ctx.fillStyle = g.flash.c; ctx.fillRect(0, 0, VIEW.w, VIEW.h); ctx.globalAlpha = 1; }
}

function drawTitle(t) {
  drawSky(t); drawRing(t);
  ctx.fillStyle = "rgba(4,5,15,0.76)"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("RITORNELLO", 480, 150, { size: 56, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text("A GAME OF THE RING", 480, 192, { size: 12, color: "#F3E6C8", spacing: 4 });
  text("You are at the eyepiece on Hal Teru. The Ring lights a phrase, arc by arc.", 480, 250, { size: 15, color: "#E4DCEB" });
  text("Answer it back. Each time, the phrase returns with one more note.", 480, 274, { size: 15, color: "#E4DCEB" });
  text("Later it will sometimes ask for the phrase backward.", 480, 298, { size: 15, color: "#F2C98A" });
  text("Tap the arcs, or press 1-6. Three wrong answers and the clouds come in.", 480, 332, { size: 15, color: "#B9C0FF" });
  text("tap to begin", 480, 410, { size: 13, color: `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 3)})`, spacing: 2 });
  if (save.best) text(`best ${save.best} · longest phrase ${save.bestLen}`, 480, 440, { size: 11, color: "#9C8FA8" });
}

function drawOver(t) {
  drawSky(t);
  ctx.fillStyle = "rgba(4,5,15,0.8)"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("The clouds came in.", 480, 170, { size: 40, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text("The Ring is still there. It will be there tomorrow night.", 480, 216, { size: 14, color: "#E4DCEB" });
  text(`longest phrase answered · ${lastRun.len} notes · ${lastRun.rounds} rounds`, 480, 252, { size: 13, color: "#F3E6C8" });
  text(`${lastRun.score}`, 480, 310, { size: 44, color: "#FFFFFF" });
  text(lastRun.best ? "a new best" : `best ${save.best}`, 480, 350, { size: 12, color: lastRun.best ? "#F2C98A" : "#9C8FA8", spacing: 2 });
  text("tap to try again", 480, 420, { size: 13, color: `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 3)})`, spacing: 2 });
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const t = now / 1000;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#04050f"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, VIEW.w, VIEW.h); ctx.clip();
  if (screen === "title") drawTitle(t);
  else if (screen === "over") drawOver(t);
  else {
    if (!TEST) update(reduced ? dt * 0.85 : dt);
    if (screen === "play") { drawSky(t); drawRing(t); drawHud(t); }
  }
  text(save.muted ? "sound off · M" : "sound on · M", VIEW.w - 20, 24, { align: "right", size: 10, color: "#9C8FA8" });
  ctx.restore();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ?test: a hook for balance checks (scripts drive the game frame by frame)
if (TEST) window.__game = { start, update, press, get g() { return game; }, get screen() { return screen; }, get last() { return lastRun; } };
