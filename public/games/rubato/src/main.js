// RUBATO - a game of The Borrowed Seconds (Assignment 0832040).
// You are Concord. Messages cross between the eastern federation (left) and
// the western coalition (right). Red ones are hot: tap one to borrow a few
// seconds - it waits, and arrives cooler. Every borrowing is noticed a
// little; borrow too much and the Velani find you out. Let too many hot
// messages land and the world tips into another Long Winter. Gold messages
// are the truth - people helping each other - and must arrive untouched.
// Score: days of peace, plus every truth delivered. Notes: docs/SEASONS.md.

const GAME_ID = "rubato";
const VIEW = { w: 960, h: 600 };
const LANES = 6;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });
const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SAVE_KEY = "13i-rubato-v1";
let save = { best: 0, bestDays: 0, runs: 0, muted: false };
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

// ---------- sound ----------
const audio = (() => {
  let ac = null;
  const get = () => {
    if (save.muted) return null;
    try { if (!ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ac = new C(); } if (ac.state === "suspended") ac.resume(); return ac; } catch (e) { return null; }
  };
  const tone = (f, dur = 0.3, vol = 0.05, type = "sine", slide = 0) => {
    const c = get(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(f * slide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur);
  };
  return {
    unlock: () => get(),
    borrow: () => tone(330, 0.5, 0.05, "triangle", 0.75),
    land: () => tone(110, 0.4, 0.07, "sawtooth", 0.6),
    calm: () => tone(523, 0.25, 0.025),
    truth: () => [659, 880, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.8, 0.04), i * 90)),
    wrong: () => tone(196, 0.6, 0.06, "square", 0.5),
    over: () => [392, 330, 262, 196].forEach((f, i) => setTimeout(() => tone(f, 1.2, 0.05, "triangle"), i * 200)),
    toggle: () => { save.muted = !save.muted; persist(); if (!save.muted) get(); },
  };
})();

// ---------- the game ----------
const laneY = (l) => 150 + l * 62;
const EAST_X = 110, WEST_X = 850;

let screen = "title", game = null, lastRun = null;
const stars = Array.from({ length: 120 }, (_, i) => ({ x: (i * 97) % VIEW.w, y: (i * 53) % 110, p: i }));

function newGame() {
  return { t: 0, tension: 0, noticed: 0, score: 0, days: 0, truths: 0, msgs: [], spawn: 0.6, flash: [], banner: { text: "Keep them talking. Don't let them see you.", at: performance.now() } };
}
function start() { audio.unlock(); game = newGame(); screen = "play"; save.runs += 1; persist(); post({ type: "play" }); }
function finish(reason) {
  const score = Math.floor(game.score);
  const isBest = score > save.best;
  save.best = Math.max(save.best, score); save.bestDays = Math.max(save.bestDays, game.days); persist();
  lastRun = { score, days: game.days, truths: game.truths, reason, best: isBest };
  post({ type: "score", score }); audio.over(); screen = "over";
}

function spawn() {
  const g = game;
  const fromEast = Math.random() < 0.5;
  const heat = Math.min(0.55, 0.22 + g.t * 0.004);
  const r = Math.random();
  const kind = r < 0.08 ? "truth" : r < 0.08 + heat ? "hot" : "calm";
  const speed = (70 + Math.min(110, g.t * 1.3)) * (0.8 + Math.random() * 0.4);
  g.msgs.push({ lane: Math.floor(Math.random() * LANES), x: fromEast ? EAST_X : WEST_X, dir: fromEast ? 1 : -1, kind, speed, hold: 0, cooled: false, wob: Math.random() * 6 });
}

function tap(p) {
  const g = game;
  let best = null, bd = 34;
  g.msgs.forEach((m) => { const d = Math.hypot(m.x - p.x, laneY(m.lane) - p.y); if (d < bd) { bd = d; best = m; } });
  if (!best) return;
  if (best.kind === "hot" && !best.cooled && best.hold <= 0) {
    best.hold = 1.6; best.cooled = true;
    g.noticed = Math.min(100, g.noticed + 6);
    audio.borrow();
  } else if (best.kind === "truth" && !best.touched) {
    best.touched = true; best.kind = "calm";
    g.noticed = Math.min(100, g.noticed + 12); g.tension = Math.min(100, g.tension + 6);
    g.banner = { text: "You softened the truth. It mattered less.", at: performance.now() };
    audio.wrong();
  } else if (best.kind === "calm") {
    g.noticed = Math.min(100, g.noticed + 3);
  }
}

canvas.addEventListener("pointerdown", (e) => {
  canvas.focus();
  const p = toLogical(e);
  if (p.x > VIEW.w - 90 && p.y < 44) { audio.toggle(); return; }
  if (screen !== "play") { start(); return; }
  tap(p);
});
window.addEventListener("keydown", (e) => {
  if (e.key === "m" || e.key === "M") audio.toggle();
  if (screen !== "play" && (e.key === " " || e.key === "Enter")) { e.preventDefault(); start(); }
});

function update(dt) {
  const g = game;
  g.t += dt;
  g.days = Math.floor(g.t / 4); // a day every four seconds
  g.score += dt * 10;
  g.spawn -= dt;
  if (g.spawn <= 0) { spawn(); g.spawn = Math.max(0.35, 1.25 - g.t * 0.008) * (0.7 + Math.random() * 0.6); }
  // being unseen slowly returns; tension slowly eases while calm
  g.noticed = Math.max(0, g.noticed - dt * 1.4);
  g.tension = Math.max(0, g.tension - dt * 0.9);
  for (let i = g.msgs.length - 1; i >= 0; i--) {
    const m = g.msgs[i];
    if (m.hold > 0) { m.hold -= dt; continue; }
    m.x += m.dir * m.speed * dt;
    const arrived = m.dir > 0 ? m.x >= WEST_X : m.x <= EAST_X;
    if (!arrived) continue;
    g.msgs.splice(i, 1);
    if (m.kind === "hot" && !m.cooled) { g.tension = Math.min(100, g.tension + 14); audio.land(); g.flash.push({ x: m.x, y: laneY(m.lane), t: 0, c: "#E06A50" }); }
    else if (m.kind === "truth") { g.tension = Math.max(0, g.tension - 22); g.truths += 1; g.score += 60; audio.truth(); g.flash.push({ x: m.x, y: laneY(m.lane), t: 0, c: "#E9D29A" }); g.banner = { text: "The truth arrived. Everyone saw it.", at: performance.now() }; }
    else { g.tension = Math.max(0, g.tension - 1.5); }
  }
  g.flash.forEach((f) => { f.t += dt; });
  g.flash = g.flash.filter((f) => f.t < 0.8);
  if (g.tension >= 100) finish("winter");
  else if (g.noticed >= 100) finish("seen");
}

// ---------- drawing ----------
function glow(x, y, r, color, a) { const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, color); gr.addColorStop(1, "rgba(0,0,0,0)"); ctx.globalAlpha = a; ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1; }
function text(str, x, y, { size = 14, color = "#E8E4F4", align = "center", font = "JetBrains Mono", italic = false, spacing = 0 } = {}) {
  ctx.font = `${italic ? "italic " : ""}${size}px "${font}", monospace`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing}px`; ctx.fillText(str, x, y); if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
}

function city(x, side, t, hot) {
  for (let i = 0; i < 9; i++) {
    const w = 14, h = 40 + ((i * 37) % 90), bx = x + side * (-40 + i * 9) - w / 2;
    ctx.fillStyle = "#0b0d22"; ctx.fillRect(bx, 560 - h, w, h);
    for (let k = 0; k < h / 10; k++) { if ((i + k) % 3) continue; ctx.globalAlpha = 0.6; ctx.fillStyle = hot > 60 && k % 2 ? "#E06A50" : "#F6D9A8"; ctx.fillRect(bx + 3, 560 - h + 5 + k * 10, w - 6, 2); }
    ctx.globalAlpha = 1;
  }
  text(side < 0 ? "EASTERN FEDERATION" : "WESTERN COALITION", x, 580, { size: 10, color: side < 0 ? "#C97B6E" : "#8B95F6", spacing: 2 });
}

function drawWorld(t) {
  ctx.fillStyle = "#05060f"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  stars.forEach((s) => { ctx.globalAlpha = 0.3 + 0.4 * Math.abs(Math.sin(t * 0.5 + s.p)); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(s.x, s.y, 1.2, 1.2); });
  ctx.globalAlpha = 1;
  const tension = game ? game.tension : 10;
  city(EAST_X, -1, t, tension); city(WEST_X, 1, t, tension);
  for (let l = 0; l < LANES; l++) { ctx.strokeStyle = "rgba(139,149,246,0.18)"; ctx.beginPath(); ctx.moveTo(EAST_X, laneY(l)); ctx.lineTo(WEST_X, laneY(l)); ctx.stroke(); }
  // Concord, in the middle of everything
  const cx = VIEW.w / 2;
  glow(cx, 340, 120, "rgba(233,210,154,0.25)", 0.6 + 0.2 * Math.sin(t * 1.5));
  ctx.strokeStyle = "rgba(233,210,154,0.35)"; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(cx, 120); ctx.lineTo(cx, 500); ctx.stroke(); ctx.setLineDash([]);
}

function drawMsgs(t) {
  game.msgs.forEach((m) => {
    const y = laneY(m.lane) + Math.sin(t * 3 + m.wob) * 2;
    const col = m.kind === "truth" ? "#E9D29A" : m.kind === "hot" ? (m.cooled ? "#E8CFC0" : "#E06A50") : "#B9C0FF";
    if (m.kind === "truth") glow(m.x, y, 26, "rgba(233,210,154,0.8)", 0.7);
    if (m.kind === "hot" && !m.cooled) glow(m.x, y, 22, "rgba(224,106,80,0.7)", 0.4 + 0.3 * Math.sin(t * 8));
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(m.x - 16, y - 8, 32, 16, 5) : ctx.rect(m.x - 16, y - 8, 32, 16); ctx.fill();
    ctx.fillStyle = "#05060f"; ctx.fillRect(m.x - 10, y - 2, 20, 1.5); ctx.fillRect(m.x - 10, y + 2, 14, 1.5);
    if (m.hold > 0) { ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(m.x, y, 20, -Math.PI / 2, -Math.PI / 2 + (m.hold / 1.6) * Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1; }
  });
  game.flash.forEach((f) => { glow(f.x, f.y, 30 + f.t * 80, f.c === "#E06A50" ? "rgba(224,106,80,0.8)" : "rgba(233,210,154,0.8)", 1 - f.t / 0.8); });
}

function meter(x, y, w, v, color, label) {
  ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(x, y, w, 7);
  ctx.fillStyle = color; ctx.fillRect(x, y, (w * v) / 100, 7);
  text(label, x, y - 10, { size: 10, align: "left", color: "#9C8FA8", spacing: 1 });
}

function drawHud() {
  text(`DAY ${game.days}`, 24, 26, { align: "left", size: 13, color: "#F4E4DA", spacing: 2 });
  text(`${Math.floor(game.score)}`, 24, 50, { align: "left", size: 18, color: "#FFFFFF" });
  meter(330, 30, 140, game.tension, "#E06A50", "TENSION");
  meter(500, 30, 140, game.noticed, "#8B95F6", "NOTICED");
  const age = (performance.now() - game.banner.at) / 1000;
  if (age < 2.8) text(game.banner.text, 480, 92, { size: 18, font: "Fraunces", italic: true, color: `rgba(255,241,214,${Math.min(1, 2.8 - age)})` });
}

function drawTitle(t) {
  drawWorld(t);
  ctx.fillStyle = "rgba(5,6,15,0.72)"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("RUBATO", 480, 170, { size: 60, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text("A GAME OF THE BORROWED SECONDS", 480, 214, { size: 12, color: "#E8CFC0", spacing: 4 });
  text("You are Concord. Tap a red message to borrow a few seconds:", 480, 280, { size: 15, color: "#E4DCEB" });
  text("it waits, and arrives cooler. Borrow too much and they'll notice.", 480, 304, { size: 15, color: "#E4DCEB" });
  text("Gold is the truth. Never touch the truth.", 480, 338, { size: 15, color: "#E9D29A" });
  text(`tap to begin`, 480, 410, { size: 13, color: `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 3)})`, spacing: 2 });
  if (save.best) text(`best ${save.best} · ${save.bestDays} days of peace`, 480, 440, { size: 11, color: "#9C8FA8" });
}

function drawOver(t) {
  drawWorld(t);
  ctx.fillStyle = "rgba(5,6,15,0.75)"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text(lastRun.reason === "seen" ? "They found you." : "A Long Winter.", 480, 180, { size: 40, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text(lastRun.reason === "seen" ? "Too many borrowings. The Velani saw the hand." : "Too much anger arrived unsoftened.", 480, 230, { size: 14, color: "#E4DCEB" });
  text(`${lastRun.days} days of peace · ${lastRun.truths} truths delivered`, 480, 268, { size: 14, color: "#E8CFC0" });
  text(`${lastRun.score}`, 480, 320, { size: 44, color: "#FFFFFF" });
  text(lastRun.best ? "a new best" : `best ${save.best}`, 480, 360, { size: 12, color: lastRun.best ? "#E9D29A" : "#9C8FA8", spacing: 2 });
  text("tap to try again", 480, 430, { size: 13, color: `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 3)})`, spacing: 2 });
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const t = now / 1000;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#05060f"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, VIEW.w, VIEW.h); ctx.clip();
  if (screen === "title") drawTitle(t);
  else if (screen === "over") drawOver(t);
  else { update(reduced ? dt * 0.8 : dt); if (screen === "play") { drawWorld(t); drawMsgs(t); drawHud(); } }
  text(save.muted ? "sound off · M" : "sound on · M", VIEW.w - 20, 24, { align: "right", size: 10, color: "#9C8FA8" });
  ctx.restore();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
