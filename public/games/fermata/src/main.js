// FERMATA - a game of The Fermata (Assignment 2178309).
// The comet sleeps for most of its orbit and wakes for forty days at its
// closest pass. A wandering dark planet keeps tugging its path. You are 13i,
// leaning on a mountain of ice: hold LEFT to lean it inward, RIGHT to lean
// it outward - but only while it's out in the dark, and lean as little as
// you can. Every pass that lands in the warm band is a waking, and the
// wakers leave a letter. Too wide and the comet goes into the long dark
// forever. Too close and the ice boils. Notes: docs/SEASONS.md.

const GAME_ID = "fermata";
const VIEW = { w: 960, h: 600 };
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });
const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TEST = /[?&]test\b/.test(window.location.search);

const SAVE_KEY = "13i-fermata-v1";
let save = { best: 0, bestWakings: 0, runs: 0, muted: false };
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
  return {
    unlock: () => get(),
    // a held note for every waking: the fermata
    wake: (q) => [392, 494, 587].forEach((f, i) => setTimeout(() => tone(f, 2.4 - i * 0.3, 0.035, "sine"), i * 160)),
    hot: () => tone(180, 0.8, 0.06, "sawtooth", 0.6),
    pull: () => tone(70, 1.2, 0.05, "triangle", 0.8),
    lean: () => tone(220, 0.12, 0.012, "sine"),
    over: () => [392, 349, 294, 262].forEach((f, i) => setTimeout(() => tone(f, 1.6, 0.045, "triangle"), i * 260)),
    toggle: () => { save.muted = !save.muted; persist(); if (!save.muted) get(); },
  };
})();

// ---------- the letters ----------
const LETTERS = [
  "the warm chambers are faster to reach from the south face",
  "this is a song we made. it is better slower",
  "the tail took the shape of a wing this time, and everyone cried",
  "we were afraid, and it was fine",
  "someone heavy leaned on us in the dark. we did not feel it. we woke anyway",
  "there were more of us this time. find the ones who wake last",
  "the ice by the old vent sings when it softens. listen for it",
  "we argued for nine days about the shape of the tail. it was a hand",
  "do not spend the first day afraid. there are only forty",
  "the star was very bright. we think it missed us",
  "the young are sleeping by the letter wall. be gentle when you wake them",
  "we made the tail into a spiral. it did not hold. try again",
  "read every letter. it takes a day. it is worth the day",
  "a waking is enough time to become someone, if you start early",
  "we found a chamber no one had opened in ten wakings. it was empty. it was beautiful",
  "the cold took nothing this time that we could not do without",
  "sing the old song slower. we did. it was better",
  "we were not afraid. write that down for the ones who will be",
  "no waking decides for the next. we decided nothing. we hope you like it",
  "something is watching from the dark. it is very still. we think it is kind",
];

// ---------- the orbit ----------
const STAR = { x: 250, y: 316 };
const Q_FAR = 600; // aphelion distance, fixed
const PERIOD = 7.5; // seconds per orbit
const MIN_Q = 26, MAX_Q = 230;

function orbitPoint(q, E) {
  const a = (q + Q_FAR) / 2, e = (Q_FAR - q) / (Q_FAR + q), b = a * Math.sqrt(1 - e * e);
  const cx = STAR.x + (Q_FAR - q) / 2;
  return { x: cx - a * Math.cos(E), y: STAR.y + b * Math.sin(E) * 0.62 };
}
function solveE(M, e) { let E = M; for (let i = 0; i < 8; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); return E; }

let screen = "title", game = null, lastRun = null;
const stars = Array.from({ length: 160 }, (_, i) => ({ x: (i * 97) % VIEW.w, y: (i * 59) % VIEW.h, p: i }));
const input = { dir: 0, ptr: 0 };

function band(level) {
  const half = Math.max(15, 30 - level * 1.4);
  return { mid: 100, lo: 100 - half, hi: 100 + half };
}
function rollRogue(level) {
  const mag = Math.min(52, 12 + level * 3.2) * (0.55 + Math.random() * 0.45);
  return { d: (Math.random() < 0.5 ? -1 : 1) * Math.round(mag), y: (Math.random() - 0.5) * 300, applied: false };
}
function newGame() {
  return {
    t: 0, M: Math.PI * 0.55, q: 100, energy: 100, ice: 3, wakings: 0, score: 0, level: 0, leanThisOrbit: 0, totalLean: 0,
    rogue: rollRogue(0), noise: 0, fx: [], letter: null, lastLetter: "", deck: LETTERS.map((_, i) => i).sort(() => Math.random() - 0.5),
    banner: { text: "This is the last waking. Nobody on the comet knows.", at: performance.now() },
  };
}
function start() { audio.unlock(); game = newGame(); screen = "play"; save.runs += 1; persist(); post({ type: "play" }); }
function finish(reason) {
  const score = Math.floor(game.score);
  const isBest = score > save.best;
  save.best = Math.max(save.best, score); save.bestWakings = Math.max(save.bestWakings, game.wakings); persist();
  lastRun = { score, wakings: game.wakings, reason, best: isBest, letter: game.lastLetter, lean: Math.round(game.totalLean) };
  post({ type: "score", score }); audio.over(); screen = "over";
}
const banner = (text) => { game.banner = { text, at: performance.now() }; };
const inDark = (g) => Math.cos(solveE(((g.M % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI), (Q_FAR - g.q) / (Q_FAR + g.q))) < -0.05;

// ---------- input ----------
canvas.addEventListener("pointerdown", (e) => {
  canvas.focus();
  const p = toLogical(e);
  if (p.x > VIEW.w - 110 && p.y < 44) { audio.toggle(); return; }
  if (screen !== "play") { start(); return; }
  input.ptr = p.x < VIEW.w / 2 ? -1 : 1;
});
canvas.addEventListener("pointermove", (e) => { if (input.ptr && screen === "play") { const p = toLogical(e); input.ptr = p.x < VIEW.w / 2 ? -1 : 1; } });
const release = () => { input.ptr = 0; };
window.addEventListener("pointerup", release);
window.addEventListener("pointercancel", release);
const keys = {};
window.addEventListener("keydown", (e) => {
  if (e.key === "m" || e.key === "M") audio.toggle();
  if (screen !== "play" && (e.key === " " || e.key === "Enter")) { e.preventDefault(); start(); return; }
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") { keys.l = true; e.preventDefault(); }
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { keys.r = true; e.preventDefault(); }
});
window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.l = false;
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.r = false;
});

// ---------- update ----------
function update(dt) {
  const g = game;
  g.t += dt;
  const prevM = g.M;
  g.M += (2 * Math.PI / PERIOD) * dt;
  const dir = input.dir || input.ptr || (keys.l ? -1 : 0) + (keys.r ? 1 : 0);
  const dark = inDark(g);
  if (dir && dark && g.energy > 0) {
    const d = 24 * dt;
    g.q = Math.max(MIN_Q, Math.min(MAX_Q, g.q + dir * d));
    g.energy = Math.max(0, g.energy - 15 * dt);
    g.leanThisOrbit += d; g.totalLean += d;
    if (Math.floor(g.t * 6) !== Math.floor((g.t - dt) * 6)) audio.lean();
  }
  // aphelion: the dark planet pulls as it passes
  const phase = ((g.M % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const prevPhase = ((prevM % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  if (prevPhase < Math.PI && phase >= Math.PI && !g.rogue.applied) {
    g.rogue.applied = true;
    g.q = Math.max(MIN_Q, Math.min(MAX_Q, g.q + g.rogue.d + (Math.random() - 0.5) * 6));
    g.fx.push({ kind: "pull", t: 0 });
    audio.pull();
  }
  // perihelion: does it wake?
  if (prevPhase > phase) {
    const bd = band(g.level);
    if (g.q > bd.hi) { finish("dark"); return; }
    if (g.q < bd.lo) {
      g.ice -= 1; audio.hot();
      g.fx.push({ kind: "boil", t: 0 });
      if (g.ice <= 0) { finish("boiled"); return; }
      banner(g.ice === 1 ? "Too close. The last of the deep ice is boiling off." : "Too close. The ice boiled; they woke hurt.");
      g.wakings += 1; g.score += 30;
    } else {
      g.wakings += 1;
      const precision = 1 - Math.abs(g.q - bd.mid) / (bd.hi - bd.mid);
      const light = g.leanThisOrbit < 0.5 ? 60 : g.leanThisOrbit < 12 ? 30 : 0;
      g.score += 100 + Math.round(precision * 50) + light;
      const idx = g.deck[(g.wakings - 1) % g.deck.length];
      g.lastLetter = LETTERS[idx];
      g.letter = { n: 384 + g.wakings, text: LETTERS[idx], at: performance.now(), light };
      g.fx.push({ kind: "wake", t: 0 });
      audio.wake(g.q);
    }
    g.energy = Math.min(100, g.energy + Math.max(14, 28 - g.level * 1.2));
    g.level += 1; g.leanThisOrbit = 0;
    g.rogue = rollRogue(g.level);
  }
  g.fx.forEach((f) => { f.t += dt; });
  g.fx = g.fx.filter((f) => f.t < 2.4);
}

// ---------- drawing ----------
function glow(x, y, r, color, a) { if (r <= 0 || a <= 0) return; const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, color); gr.addColorStop(1, "rgba(0,0,0,0)"); ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1; }
function text(str, x, y, { size = 14, color = "#E8E4F4", align = "center", font = "JetBrains Mono", italic = false, spacing = 0 } = {}) {
  ctx.font = `${italic ? "italic " : ""}${size}px "${font}", monospace`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing}px`; ctx.fillText(str, x, y); if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
}

function drawSky(t) {
  ctx.fillStyle = "#03040b"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  stars.forEach((s) => { ctx.globalAlpha = 0.25 + 0.45 * Math.abs(Math.sin(t * 0.3 + s.p)); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(s.x, s.y, 1.1, 1.1); });
  ctx.globalAlpha = 1;
  glow(STAR.x, STAR.y, 150, "rgba(255,226,160,0.55)", 0.8);
  ctx.fillStyle = "#FFF4DC"; ctx.beginPath(); ctx.arc(STAR.x, STAR.y, 13, 0, Math.PI * 2); ctx.fill();
}

function drawBand(level, t) {
  const bd = band(level);
  ctx.globalAlpha = 0.11; ctx.fillStyle = "#FFD98A";
  ctx.beginPath(); ctx.ellipse(STAR.x, STAR.y, bd.hi, bd.hi * 0.62, 0, 0, Math.PI * 2); ctx.ellipse(STAR.x, STAR.y, bd.lo, bd.lo * 0.62, 0, 0, Math.PI * 2, true); ctx.fill("evenodd");
  ctx.globalAlpha = 0.35; ctx.strokeStyle = "#FFD98A"; ctx.setLineDash([3, 5]);
  ctx.beginPath(); ctx.ellipse(STAR.x, STAR.y, bd.hi, bd.hi * 0.62, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = "#E06A50"; ctx.beginPath(); ctx.ellipse(STAR.x, STAR.y, bd.lo, bd.lo * 0.62, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]); ctx.globalAlpha = 1;
}

function drawOrbit(g, t) {
  const bd = band(g.level);
  const e = (Q_FAR - g.q) / (Q_FAR + g.q);
  // the path it's on now
  ctx.globalAlpha = 0.35; ctx.strokeStyle = "#BFE6FF"; ctx.setLineDash([2, 6]); ctx.beginPath();
  for (let i = 0; i <= 120; i++) { const p = orbitPoint(g.q, (i / 120) * Math.PI * 2); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }
  ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
  // where it will pass closest
  const peri = orbitPoint(g.q, 0);
  const ok = g.q >= bd.lo && g.q <= bd.hi;
  const col = ok ? "#9FE3B0" : g.q > bd.hi ? "#8B95F6" : "#E06A50";
  glow(peri.x, peri.y, 18, ok ? "rgba(159,227,176,0.8)" : g.q > bd.hi ? "rgba(139,149,246,0.8)" : "rgba(224,106,80,0.8)", 0.7 + 0.3 * Math.sin(t * 4));
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(peri.x, peri.y, 4, 0, Math.PI * 2); ctx.fill();
  text(ok ? "WAKES" : g.q > bd.hi ? "TOO COLD" : "TOO CLOSE", peri.x, peri.y - 24, { size: 10, color: col, spacing: 2 });
  // the dark planet, coming
  const phase = ((g.M % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  if (!g.rogue.applied) {
    const k = Math.min(1, phase / Math.PI);
    const rx = 900, ry = STAR.y + g.rogue.y * (1 - k) * 0.6 - 10;
    const target = orbitPoint(g.q, Math.PI);
    ctx.globalAlpha = 0.9; ctx.fillStyle = "#06070f"; ctx.strokeStyle = "#5A5E9A"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(rx, ry, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.lineWidth = 1; ctx.globalAlpha = 1;
    // a promise of how hard it will pull
    const d = g.rogue.d;
    ctx.globalAlpha = 0.25 + 0.5 * k; ctx.strokeStyle = d > 0 ? "#8B95F6" : "#E06A50";
    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(target.x, target.y); ctx.stroke(); ctx.globalAlpha = 1;
    text(d > 0 ? `PULL · WIDER +${d}` : `PULL · CLOSER ${d}`, rx - 10, ry - 44, { size: 10, color: d > 0 ? "#8B95F6" : "#E06A50", spacing: 1, align: "right" });
    // a ghost of where the pull will leave its closest pass
    const gq = Math.max(MIN_Q, Math.min(MAX_Q, g.q + d));
    const gp = orbitPoint(gq, 0);
    ctx.globalAlpha = 0.5; ctx.strokeStyle = "#E8E4F4"; ctx.beginPath(); ctx.arc(gp.x, gp.y, 6, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
  }
  // the comet
  const E = solveE(phase, e);
  const p = orbitPoint(g.q, E);
  const r = Math.hypot(p.x - STAR.x, (p.y - STAR.y) / 0.62);
  const warm = Math.max(0, Math.min(1, (260 - r) / 180));
  // tail, away from the star
  const ux = (p.x - STAR.x) / (r || 1), uy = (p.y - STAR.y) / (r || 1);
  for (let i = 0; i < 26 * warm; i++) { ctx.globalAlpha = (1 - i / 26) * 0.5 * warm; ctx.fillStyle = "#BFE6FF"; ctx.fillRect(p.x + ux * i * 5 + Math.sin(t * 3 + i) * 2, p.y + uy * i * 5, 2, 2); }
  ctx.globalAlpha = 1;
  glow(p.x, p.y, 16 + warm * 20, "rgba(191,230,255,0.8)", 0.4 + warm * 0.5);
  ctx.fillStyle = warm > 0.4 ? "#DCEBFA" : "#6a7488"; ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill();
  // the wakers' lights, while it's warm
  if (warm > 0.55) for (let i = 0; i < 6; i++) { if (Math.sin(t * (2 + i) + i) > 0.3) glow(p.x + Math.cos(i * 1.1) * 5, p.y + Math.sin(i * 1.7) * 4, 4, "rgba(246,227,180,0.95)", 0.9); }
  // 13i, leaning, when it can
  const dark = inDark(g);
  const leaning = (input.dir || input.ptr || keys.l || keys.r) && dark && g.energy > 0;
  ctx.globalAlpha = dark ? 0.9 : 0.35; ctx.strokeStyle = "#B9C0FF"; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.arc(p.x, p.y - 34, 7, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x, p.y - 27); ctx.lineTo(p.x, p.y - 19); ctx.stroke();
  ctx.lineWidth = 1; ctx.globalAlpha = 1;
  if (leaning) for (let i = 0; i < 3; i++) { const k = ((t * 1.2 + i / 3) % 1); ctx.globalAlpha = 0.4 * (1 - k); ctx.strokeStyle = "#8B95F6"; ctx.beginPath(); ctx.arc(p.x, p.y - 34, 9 + k * 30, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; }
  return { p, dark };
}

function drawFx(g, t) {
  g.fx.forEach((f) => {
    const a = 1 - f.t / 2.4;
    if (f.kind === "wake") glow(STAR.x - band(g.level).mid, STAR.y, 80 + f.t * 120, "rgba(246,227,180,0.6)", a * 0.8);
    if (f.kind === "boil") { ctx.globalAlpha = a * 0.25; ctx.fillStyle = "#E06A50"; ctx.fillRect(0, 0, VIEW.w, VIEW.h); ctx.globalAlpha = 1; }
    if (f.kind === "pull") glow(860, STAR.y, 120 + f.t * 60, "rgba(139,149,246,0.5)", a * 0.6);
  });
}

function meter(x, y, w, v, color, label) {
  ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(x, y, w, 7);
  ctx.fillStyle = color; ctx.fillRect(x, y, (w * Math.max(0, v)) / 100, 7);
  text(label, x, y - 10, { size: 10, align: "left", color: "#9C8FA8", spacing: 1 });
}

function drawHud(g, t, dark) {
  text(`${Math.floor(g.score)}`, 24, 30, { align: "left", size: 20, color: "#FFFFFF" });
  text(`WAKINGS · ${g.wakings}`, 24, 56, { align: "left", size: 12, color: "#F6E3B4", spacing: 2 });
  meter(300, 30, 150, g.energy, "#8B95F6", "LEAN");
  text(`ICE  ${"■ ".repeat(g.ice).trim()}${"  □".repeat(3 - g.ice)}`, 500, 34, { align: "left", size: 12, color: "#BFE6FF", spacing: 1 });
  text(dark ? "IN THE DARK · YOU CAN LEAN" : "NEAR THE STAR · TOO FAST TO LEAN", 480, 78, { size: 11, color: dark ? "#B9C0FF" : "#6E6A86", spacing: 2 });
  // the controls, on the halves of the screen
  ctx.globalAlpha = 0.5; text("◀ HOLD TO LEAN CLOSER", 24, VIEW.h - 24, { align: "left", size: 10, color: "#E06A50", spacing: 2 });
  text("HOLD TO LEAN WIDER ▶", VIEW.w - 24, VIEW.h - 24, { align: "right", size: 10, color: "#8B95F6", spacing: 2 }); ctx.globalAlpha = 1;
  const L = g.letter;
  if (L) {
    const age = (performance.now() - L.at) / 1000;
    if (age < 4.2) {
      const a = Math.min(1, age * 2, 4.2 - age);
      text(`LETTER ${L.n}${L.light ? (L.light >= 60 ? "  ·  untouched" : "  ·  a light touch") : ""}`, 480, 470, { size: 10, color: `rgba(246,227,180,${a * 0.8})`, spacing: 3 });
      text(L.text, 480, 500, { size: 18, font: "Fraunces", italic: true, color: `rgba(255,246,230,${a})` });
      return;
    }
  }
  const age = (performance.now() - g.banner.at) / 1000;
  if (age < 3.4) text(g.banner.text, 480, 500, { size: 17, font: "Fraunces", italic: true, color: `rgba(255,241,214,${Math.min(1, 3.4 - age)})` });
}

function drawTitle(t) {
  drawSky(t); drawBand(0, t);
  ctx.fillStyle = "rgba(3,4,11,0.72)"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("FERMATA", 480, 150, { size: 60, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text("A GAME OF THE FERMATA", 480, 194, { size: 12, color: "#BFE6FF", spacing: 4 });
  text("A dark planet keeps tugging the comet's path. Keep its closest pass", 480, 252, { size: 15, color: "#E4DCEB" });
  text("inside the warm band, so the wakers wake again.", 480, 276, { size: 15, color: "#E4DCEB" });
  text("Hold LEFT to lean it closer, RIGHT to lean it wider - only out in the dark.", 480, 310, { size: 15, color: "#B9C0FF" });
  text("Lean as little as you can. Every waking leaves a letter.", 480, 344, { size: 15, color: "#F6E3B4" });
  text("tap to begin", 480, 410, { size: 13, color: `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 3)})`, spacing: 2 });
  if (save.best) text(`best ${save.best} · ${save.bestWakings} wakings`, 480, 440, { size: 11, color: "#9C8FA8" });
}

function drawOver(t) {
  drawSky(t);
  ctx.fillStyle = "rgba(3,4,11,0.78)"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  const dark = lastRun.reason === "dark";
  text(dark ? "The Long Dark." : "Boiled Away.", 480, 160, { size: 40, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text(dark ? "It passed too wide to warm, and the star let it go." : "It passed too close, too often. The deep ice is gone.", 480, 206, { size: 14, color: "#E4DCEB" });
  text(`${lastRun.wakings} ${lastRun.wakings === 1 ? "waking" : "wakings"} · leaned ${lastRun.lean}`, 480, 240, { size: 13, color: "#BFE6FF" });
  if (lastRun.letter) { text("their last letter", 480, 280, { size: 10, color: "#9C8FA8", spacing: 3 }); text(lastRun.letter, 480, 306, { size: 16, font: "Fraunces", italic: true, color: "#F6E3B4" }); }
  text(`${lastRun.score}`, 480, 362, { size: 44, color: "#FFFFFF" });
  text(lastRun.best ? "a new best" : `best ${save.best}`, 480, 400, { size: 12, color: lastRun.best ? "#F6E3B4" : "#9C8FA8", spacing: 2 });
  text("tap to try again", 480, 450, { size: 13, color: `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 3)})`, spacing: 2 });
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const t = now / 1000;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#03040b"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, VIEW.w, VIEW.h); ctx.clip();
  if (screen === "title") drawTitle(t);
  else if (screen === "over") drawOver(t);
  else {
    if (!TEST) update(reduced ? dt * 0.85 : dt);
    if (screen === "play") { drawSky(t); drawBand(game.level, t); const { dark } = drawOrbit(game, t); drawFx(game, t); drawHud(game, t, dark); }
  }
  text(save.muted ? "sound off · M" : "sound on · M", VIEW.w - 20, 24, { align: "right", size: 10, color: "#9C8FA8" });
  ctx.restore();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ?test: a hook for balance checks (scripts drive the game frame by frame)
if (TEST) window.__game = { start, update, input, band, inDark, get g() { return game; }, get screen() { return screen; }, get last() { return lastRun; } };
