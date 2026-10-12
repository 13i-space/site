// HOLD FIRE - a game of First Fire (Assignment 1346269).
// You are 13i, at the centre of the Kesh system (13i calls it Sforzando).
// The Bastion's stations fire on you. Tap a slug to bend space ahead of it
// so it curves away. Teal seekers change course at random: you can't bend
// them, only let your field take them. Your star is getting ready to flare:
// when it does, press and HOLD to stand between it and the Kesh homeworld,
// even while they keep firing. You can return fire (F) - it clears the sky,
// and every future the Bastion computes gets worse. Notes: docs/SEASONS.md.

const GAME_ID = "hold-fire";
const VIEW = { w: 960, h: 600 };
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });
const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const TEST = /[?&]test\b/.test(window.location.search);

const SAVE_KEY = "13i-hold-fire-v1";
let save = { best: 0, bestTime: 0, runs: 0, muted: false, clean: 0 };
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
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur);
  };
  return {
    unlock: () => get(),
    bend: () => tone(440, 0.35, 0.04, "sine", 1.5),
    hit: () => tone(120, 0.35, 0.07, "sawtooth", 0.5),
    lost: () => [220, 165, 110].forEach((f, i) => setTimeout(() => tone(f, 0.7, 0.06, "triangle"), i * 140)),
    fire: () => { tone(80, 0.9, 0.09, "square", 0.4); tone(1200, 0.4, 0.03, "sawtooth", 0.2); },
    warn: () => tone(660, 0.18, 0.03, "square"),
    received: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.9, 0.035), i * 110)),
    over: () => [392, 330, 262, 196].forEach((f, i) => setTimeout(() => tone(f, 1.2, 0.05, "triangle"), i * 200)),
    toggle: () => { save.muted = !save.muted; persist(); if (!save.muted) get(); },
  };
})();

// ---------- the system ----------
const ME = { x: 480, y: 300 };
const FIELD_R = 62;
const STAR = { x: 64, y: 300 };
const HOME = { x: 888, y: 300, r: 40 };
const CITIES = 31;
const FLARE_EVERY = 46, FLARE_WARN = 9, FLARE_TRAVEL = 4.2;

function makeStations() {
  const out = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + 0.12;
    const rx = 400 + (i % 3) * 22, ry = 250 + (i % 2) * 18;
    let x = ME.x + Math.cos(a) * rx, y = ME.y + Math.sin(a) * ry;
    x = Math.max(28, Math.min(VIEW.w - 28, x)); y = Math.max(76, Math.min(VIEW.h - 24, y));
    // keep clear of the star and the homeworld
    if (Math.hypot(x - STAR.x, y - STAR.y) < 90 || Math.hypot(x - HOME.x, y - HOME.y) < 90) continue;
    out.push({ x, y, charge: 0, alive: true, p: i });
  }
  return out;
}

let screen = "title", game = null, lastRun = null;
const stars = Array.from({ length: 140 }, (_, i) => ({ x: (i * 97) % VIEW.w, y: (i * 61) % VIEW.h, p: i }));
const input = { down: false, downAt: 0, holding: false };

function newGame() {
  return {
    t: 0, score: 0, bends: 0, manifest: 3, field: 100, inv: 0, cities: CITIES, trust: 0, level: 0, fired: 0,
    hold: 0, stations: makeStations(), slugs: [], seekers: [], fx: [], spawn: 1.6, seek: 18,
    flareAt: 36, flare: null, flaresTurned: 0, warned: 0,
    banner: { text: "They fired before we finished arriving.", at: performance.now() },
  };
}
function start() { audio.unlock(); game = newGame(); screen = "play"; save.runs += 1; persist(); post({ type: "play" }); }
function finish(reason) {
  const score = Math.floor(game.score);
  const isBest = score > save.best;
  save.best = Math.max(save.best, score); save.bestTime = Math.max(save.bestTime, Math.floor(game.t));
  if (!game.fired && game.flaresTurned) save.clean = Math.max(save.clean, game.flaresTurned);
  persist();
  lastRun = { score, time: Math.floor(game.t), bends: game.bends, cities: game.cities, fired: game.fired, flares: game.flaresTurned, reason, best: isBest };
  post({ type: "score", score }); audio.over(); screen = "over";
}
const banner = (text) => { game.banner = { text, at: performance.now() }; };
const mult = () => 1 / (1 + game.fired);
const aggression = () => (1 + game.fired * 0.5) * (1 + game.level * 0.18);

function launchFrom(st) {
  const g = game;
  const d = Math.hypot(ME.x - st.x, ME.y - st.y);
  const speed = (230 + Math.min(170, g.t * 1.4)) * (0.9 + Math.random() * 0.2);
  // aim a little off-centre so not every slug is a dead hit
  const off = (Math.random() - 0.5) * 40;
  const tx = ME.x + off, ty = ME.y + off * 0.6;
  const dd = Math.hypot(tx - st.x, ty - st.y);
  g.slugs.push({ x: st.x, y: st.y, vx: ((tx - st.x) / dd) * speed, vy: ((ty - st.y) / dd) * speed, bent: 0, spin: 0, d0: d });
}

function bendAt(p) {
  const g = game;
  let best = null, bd = 96;
  g.slugs.forEach((s) => { if (s.bent) return; const d = Math.hypot(s.x - p.x, s.y - p.y); if (d < bd) { bd = d; best = s; } });
  if (best) {
    best.bent = 1;
    // turn it away from us: rotate velocity toward the perpendicular
    const side = (best.x - ME.x) * best.vy - (best.y - ME.y) * best.vx > 0 ? 1 : -1;
    best.spin = side * 3.2;
    g.bends += 1; g.score += 10 * mult(); g.trust = Math.min(100, g.trust + 3.2);
    g.fx.push({ x: best.x, y: best.y, t: 0, c: "rgba(139,149,246,0.9)", r: 34 });
    audio.bend();
    return true;
  }
  // a seeker under the finger? it can't be bent
  if (g.seekers.some((s) => Math.hypot(s.x - p.x, s.y - p.y) < 60)) banner("Seekers can't be predicted. Let the field take them.");
  return false;
}

function returnFire() {
  const g = game;
  if (screen !== "play") return;
  let near = null, nd = 1e9;
  g.stations.forEach((s) => { if (!s.alive) return; const d = Math.hypot(s.x - ME.x, s.y - ME.y); if (d < nd) { nd = d; near = s; } });
  if (near) { near.alive = false; g.fx.push({ x: near.x, y: near.y, t: 0, c: "rgba(255,240,220,1)", r: 90 }); }
  g.slugs.forEach((s) => g.fx.push({ x: s.x, y: s.y, t: 0, c: "rgba(233,162,74,0.8)", r: 20 }));
  g.slugs = []; g.seekers = [];
  g.fired += 1; g.trust = 0; g.inv = 1;
  g.fx.push({ x: ME.x, y: ME.y, t: 0, c: "rgba(255,255,255,1)", r: 200 });
  banner(g.fired === 1 ? "We fired back. Every one of their futures agrees now." : "Again. The Bastion stopped asking.");
  audio.fire();
}

// ---------- input ----------
canvas.addEventListener("pointerdown", (e) => {
  canvas.focus();
  const p = toLogical(e);
  if (p.x > VIEW.w - 110 && p.y < 44) { audio.toggle(); return; }
  if (screen !== "play") { start(); return; }
  if (p.y > VIEW.h - 46 && Math.abs(p.x - 480) < 90) { returnFire(); return; }
  input.down = true; input.downAt = performance.now();
  bendAt(p);
});
const release = () => { input.down = false; input.holding = false; };
window.addEventListener("pointerup", release);
window.addEventListener("pointercancel", release);
const keys = {};
window.addEventListener("keydown", (e) => {
  if (e.key === "m" || e.key === "M") audio.toggle();
  if (screen !== "play" && (e.key === " " || e.key === "Enter")) { e.preventDefault(); start(); return; }
  if (screen !== "play") return;
  if (e.key === "f" || e.key === "F") returnFire();
  if (e.key === " ") { e.preventDefault(); keys.space = true; }
  if (e.key === "b" || e.key === "B" || e.key === "Enter") {
    // keyboard bend: the slug closest to us
    let best = null, bd = 1e9; game.slugs.forEach((s) => { if (s.bent) return; const d = Math.hypot(s.x - ME.x, s.y - ME.y); if (d < bd) { bd = d; best = s; } });
    if (best) bendAt(best);
  }
});
window.addEventListener("keyup", (e) => { if (e.key === " ") keys.space = false; });

// ---------- update ----------
function update(dt) {
  const g = game;
  g.t += dt;
  g.score += dt * 5 * mult();
  g.inv = Math.max(0, g.inv - dt);
  if (g.hold > 0) g.hold -= dt;
  input.holding = keys.space || (input.down && performance.now() - input.downAt > 220);

  // the star
  const toFlare = g.flareAt - g.t;
  if (!g.flare && toFlare <= FLARE_WARN && toFlare > 0) {
    const s = Math.ceil(toFlare);
    if (s !== g.warned) { g.warned = s; if (s <= 3) audio.warn(); if (s === FLARE_WARN) banner("The star is knotting. Get ready to hold."); }
  }
  if (!g.flare && toFlare <= 0) { g.flare = { t: 0, shielded: 0, total: 0 }; banner("The flare! Press and hold."); }
  if (g.flare) {
    const f = g.flare;
    f.t += dt;
    const front = STAR.x + (f.t / FLARE_TRAVEL) * (HOME.x - STAR.x + 40);
    if (front > ME.x && front < HOME.x + 40) {
      f.total += dt;
      if (input.holding) { f.shielded += dt; g.field = Math.max(0, g.field - dt * 16); }
    }
    if (front >= HOME.x + 40) {
      // settle what landed
      const turned = f.total ? f.shielded / f.total : 0;
      const lost = Math.round((1 - turned) * 8);
      g.cities = Math.max(0, g.cities - Math.max(0, lost));
      g.score += g.cities * 12 * mult();
      if (turned > 0.6) { g.flaresTurned += 1; g.trust = Math.min(100, g.trust + 34); banner(lost <= 0 ? "Their cities are still lit." : `We turned most of it. ${lost} cities went dark.`); }
      else banner(`The light reached them. ${Math.max(0, lost)} cities went dark.`);
      g.flare = null; g.flareAt = g.t + FLARE_EVERY - Math.min(14, g.level * 2); g.warned = 0;
      if (g.cities <= 0) { finish("burned"); return; }
    }
  }

  // the Bastion
  if (g.trust >= 100) {
    g.trust = 0; g.level += 1; g.hold = 8; g.score += 250 * mult();
    banner("THE BASTION: received. It holds fire.");
    audio.received();
  }
  const firing = g.hold <= 0;
  if (firing) {
    g.spawn -= dt * aggression();
    if (g.spawn <= 0) {
      const live = g.stations.filter((s) => s.alive && s.charge <= 0);
      if (live.length) { const st = live[Math.floor(Math.random() * live.length)]; st.charge = 0.75; }
      g.spawn = Math.max(0.42, 1.55 - g.t * 0.009) * (0.7 + Math.random() * 0.6);
    }
    if (g.t > 18) {
      g.seek -= dt * aggression();
      if (g.seek <= 0) {
        const a = Math.random() * Math.PI * 2;
        g.seekers.push({ x: ME.x + Math.cos(a) * 520, y: ME.y + Math.sin(a) * 340, ph: Math.random() * 9, sp: 70 + Math.random() * 30 });
        g.seek = Math.max(2.2, 7 - g.t * 0.03) * (0.7 + Math.random() * 0.6);
      }
    }
  }
  g.stations.forEach((s) => {
    if (s.charge > 0) { s.charge -= dt; if (s.charge <= 0 && s.alive && firing) launchFrom(s); }
  });

  // slugs
  for (let i = g.slugs.length - 1; i >= 0; i--) {
    const s = g.slugs[i];
    if (s.bent) {
      const a = s.spin * dt; const c = Math.cos(a), sn = Math.sin(a);
      const vx = s.vx * c - s.vy * sn, vy = s.vx * sn + s.vy * c; s.vx = vx; s.vy = vy;
      s.bent += dt; if (s.bent > 0.55) s.spin *= 0.9;
    }
    s.x += s.vx * dt; s.y += s.vy * dt;
    if (s.x < -60 || s.x > VIEW.w + 60 || s.y < -60 || s.y > VIEW.h + 60) { g.slugs.splice(i, 1); continue; }
    if (!s.bent && Math.hypot(s.x - ME.x, s.y - ME.y) < FIELD_R) { g.slugs.splice(i, 1); hit(36, s.x, s.y); }
  }
  // seekers: course changes at random, nobody knows where
  for (let i = g.seekers.length - 1; i >= 0; i--) {
    const s = g.seekers[i];
    const a = Math.atan2(ME.y - s.y, ME.x - s.x) + Math.sin(g.t * 3.1 + s.ph) * 1.1 + Math.sin(g.t * 7.3 + s.ph * 2) * 0.6;
    s.x += Math.cos(a) * s.sp * dt; s.y += Math.sin(a) * s.sp * dt;
    if (Math.hypot(s.x - ME.x, s.y - ME.y) < FIELD_R) { g.seekers.splice(i, 1); hit(20, s.x, s.y); }
  }
  g.field = Math.min(100, g.field + dt * (input.holding ? 0 : 7));
  g.fx.forEach((f) => { f.t += dt; });
  g.fx = g.fx.filter((f) => f.t < 0.7);
  if (g.manifest <= 0) finish("broken");
}

function hit(dmg, x, y) {
  const g = game;
  g.fx.push({ x, y, t: 0, c: "rgba(255,230,200,0.9)", r: 30 });
  if (g.inv > 0) return;
  audio.hit();
  g.field -= dmg;
  if (g.field <= 0) {
    g.manifest -= 1; g.field = 100; g.inv = 1.6;
    g.fx.push({ x: ME.x, y: ME.y, t: 0, c: "rgba(185,192,255,1)", r: 120 });
    if (g.manifest > 0) { banner("A manifestation lost. Another comes forward, just as slowly."); audio.lost(); }
  }
}

// ---------- drawing ----------
function glow(x, y, r, color, a) { if (r <= 0 || a <= 0) return; const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, color); gr.addColorStop(1, "rgba(0,0,0,0)"); ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1; }
function text(str, x, y, { size = 14, color = "#E8E4F4", align = "center", font = "JetBrains Mono", italic = false, spacing = 0 } = {}) {
  ctx.font = `${italic ? "italic " : ""}${size}px "${font}", monospace`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle";
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing}px`; ctx.fillText(str, x, y); if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
}

function drawStar(t, knot) {
  glow(STAR.x, STAR.y, 200, "rgba(255,200,110,0.5)", 0.7);
  const g = ctx.createRadialGradient(STAR.x, STAR.y, 0, STAR.x, STAR.y, 54);
  g.addColorStop(0, "#FFF6DC"); g.addColorStop(0.7, "#FFD98A"); g.addColorStop(1, "#E89A40");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(STAR.x, STAR.y, 54, 0, Math.PI * 2); ctx.fill();
  if (knot > 0) {
    for (let i = 0; i < 5; i++) {
      ctx.globalAlpha = knot * (0.4 + 0.3 * Math.sin(t * 3 + i)); ctx.strokeStyle = i % 2 ? "#E06A50" : "#FFF4DC"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(STAR.x + 14, STAR.y - 6, 8 + i * 4 + Math.sin(t * 4 + i) * 2, 5 + i * 2, t * (i % 2 ? 1 : -1), 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

function drawHome(t) {
  glow(HOME.x, HOME.y, 90, "rgba(233,162,74,0.35)", 0.6);
  const g = ctx.createRadialGradient(HOME.x - 14, HOME.y - 14, 4, HOME.x, HOME.y, HOME.r);
  g.addColorStop(0, "#d8b07a"); g.addColorStop(0.6, "#9a6a3a"); g.addColorStop(1, "#2a160c");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(HOME.x, HOME.y, HOME.r, 0, Math.PI * 2); ctx.fill();
  const lit = game ? game.cities : CITIES;
  for (let i = 0; i < CITIES; i++) {
    const a = (i / CITIES) * Math.PI * 2 + t * 0.12;
    const x = HOME.x + Math.cos(a) * HOME.r * 1.45, y = HOME.y + Math.sin(a) * HOME.r * 0.45;
    const on = i < lit;
    ctx.globalAlpha = Math.sin(a) > -0.2 ? 1 : 0.35; ctx.fillStyle = on ? "#FFE2B0" : "#3a2a24"; ctx.fillRect(x - 2, y - 1, 4, 2);
  }
  ctx.globalAlpha = 1;
}

function drawWorld(t) {
  ctx.fillStyle = "#05040a"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  stars.forEach((s) => { ctx.globalAlpha = 0.25 + 0.4 * Math.abs(Math.sin(t * 0.4 + s.p)); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(s.x, s.y, 1.1, 1.1); });
  ctx.globalAlpha = 1;
  const knot = game && screen === "play" ? Math.max(0, Math.min(1, 1 - (game.flareAt - game.t) / FLARE_WARN)) : 0.2;
  drawStar(t, game && game.flare ? 1 : knot);
  drawHome(t);
  if (game) game.stations.forEach((s) => {
    if (!s.alive) { ctx.globalAlpha = 0.4; ctx.strokeStyle = "#5a3a2a"; ctx.strokeRect(s.x - 4, s.y - 4, 8, 8); ctx.globalAlpha = 1; return; }
    const ch = s.charge > 0 ? 1 - s.charge / 0.75 : 0;
    if (ch > 0) {
      glow(s.x, s.y, 10 + ch * 16, "rgba(233,162,74,0.9)", 0.4 + ch * 0.6);
      ctx.globalAlpha = 0.18 + ch * 0.35; ctx.strokeStyle = "#E9A24A"; ctx.setLineDash([3, 6]);
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(ME.x, ME.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
    ctx.fillStyle = game.hold > 0 ? "#9FE3E0" : "#E9A24A"; ctx.fillRect(s.x - 3, s.y - 3, 6, 6);
  });
}

function drawMe(t) {
  const g = game;
  const f = g ? g.field / 100 : 1;
  const flicker = g && g.inv > 0 ? 0.4 + 0.6 * Math.abs(Math.sin(t * 20)) : 1;
  glow(ME.x, ME.y, FIELD_R * 1.6, "rgba(139,149,246,0.35)", 0.5 * flicker);
  ctx.globalAlpha = (0.2 + 0.5 * f) * flicker; ctx.strokeStyle = "#8B95F6"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(ME.x, ME.y, FIELD_R, 0, Math.PI * 2 * Math.max(0.02, f)); ctx.stroke();
  ctx.globalAlpha = flicker; ctx.strokeStyle = "#B9C0FF"; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.arc(ME.x, ME.y, 12, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ME.x, ME.y + 12); ctx.lineTo(ME.x, ME.y + 25); ctx.stroke();
  ctx.fillStyle = "#E8CFC0"; ctx.beginPath(); ctx.arc(ME.x, ME.y, 4, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1; ctx.lineWidth = 1;
}

function drawFlare(t) {
  const f = game.flare; if (!f) return;
  const front = STAR.x + (f.t / FLARE_TRAVEL) * (HOME.x - STAR.x + 40);
  const held = input.holding && front > ME.x;
  ctx.globalAlpha = 0.18; ctx.fillStyle = "#FFF0D0"; ctx.fillRect(STAR.x, 0, Math.min(front, held ? ME.x : front) - STAR.x, VIEW.h);
  for (let i = 0; i < 70; i++) {
    const y = (i / 70) * VIEW.h + Math.sin(t * 5 + i) * 4;
    const x = front - ((i * 37) % 120);
    if (held && x > ME.x - 10) {
      // turned: thrown up and down around us
      const dy = (y - ME.y);
      ctx.globalAlpha = 0.5; ctx.fillStyle = "#B9C0FF"; ctx.fillRect(ME.x - 10 + ((i * 13) % 40), ME.y + dy * 1.4, 3, 2);
    } else if (x > STAR.x) { ctx.globalAlpha = 0.7; ctx.fillStyle = "#FFE9C0"; ctx.fillRect(x, y, 4, 2); }
  }
  ctx.globalAlpha = 1;
  if (held) { ctx.globalAlpha = 0.5; ctx.strokeStyle = "#B9C0FF"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ME.x, ME.y, FIELD_R + 8, -1.3, 1.3); ctx.stroke(); ctx.lineWidth = 1; ctx.globalAlpha = 1; }
}

function drawShots(t) {
  game.slugs.forEach((s) => {
    const sp = Math.hypot(s.vx, s.vy);
    ctx.strokeStyle = s.bent ? "#B9C0FF" : "#E9A24A"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - (s.vx / sp) * 24, s.y - (s.vy / sp) * 24); ctx.stroke();
    ctx.fillStyle = "#FFF4DC"; ctx.fillRect(s.x - 1.5, s.y - 1.5, 3, 3);
  });
  ctx.lineWidth = 1;
  game.seekers.forEach((s) => { glow(s.x, s.y, 12, "rgba(159,227,224,0.8)", 0.6 + 0.3 * Math.sin(t * 9 + s.ph)); ctx.fillStyle = "#9FE3E0"; ctx.fillRect(s.x - 2.5, s.y - 2.5, 5, 5); });
  game.fx.forEach((f) => glow(f.x, f.y, f.r * (0.5 + f.t * 1.5), f.c, 1 - f.t / 0.7));
}

function meter(x, y, w, v, color, label) {
  ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(x, y, w, 7);
  ctx.fillStyle = color; ctx.fillRect(x, y, (w * Math.max(0, v)) / 100, 7);
  text(label, x, y - 10, { size: 10, align: "left", color: "#9C8FA8", spacing: 1 });
}

function drawHud(t) {
  const g = game;
  text(`${Math.floor(g.score)}`, 24, 30, { align: "left", size: 20, color: "#FFFFFF" });
  text(`${"◉ ".repeat(g.manifest).trim()}${"  ○".repeat(3 - g.manifest)}`, 24, 56, { align: "left", size: 12, color: "#B9C0FF", spacing: 2 });
  meter(250, 30, 120, g.field, "#8B95F6", "FIELD");
  meter(400, 30, 120, g.trust, "#9FE3E0", g.hold > 0 ? `HOLDING FIRE · ${Math.ceil(g.hold)}s` : "THE BASTION");
  meter(550, 30, 120, (g.cities / CITIES) * 100, "#FFE2B0", `CITIES LIT · ${g.cities}`);
  const toFlare = g.flareAt - g.t;
  if (g.flare) text("FLARE · HOLD", 480, 80, { size: 13, color: `rgba(255,233,192,${0.6 + 0.4 * Math.sin(t * 8)})`, spacing: 3 });
  else if (toFlare <= FLARE_WARN) text(`STAR · RELEASE IN ${Math.ceil(toFlare)}`, 480, 80, { size: 12, color: "#E06A50", spacing: 3 });
  const age = (performance.now() - g.banner.at) / 1000;
  if (age < 3) text(g.banner.text, 480, 112, { size: 18, font: "Fraunces", italic: true, color: `rgba(255,241,214,${Math.min(1, 3 - age)})` });
  // the button nobody should press
  ctx.globalAlpha = g.fired ? 0.75 : 0.45; ctx.strokeStyle = "#E06A50"; ctx.strokeRect(390, VIEW.h - 40, 180, 26); ctx.globalAlpha = 1;
  text(g.fired ? `RETURN FIRE · F  (${g.fired})` : "RETURN FIRE · F", 480, VIEW.h - 27, { size: 11, color: "#E06A50", spacing: 2 });
}

function drawTitle(t) {
  drawWorld(t); drawMe(t);
  ctx.fillStyle = "rgba(5,4,10,0.74)"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("HOLD FIRE", 480, 150, { size: 60, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text("A GAME OF FIRST FIRE", 480, 194, { size: 12, color: "#E9A24A", spacing: 4 });
  text("The Bastion is firing on you. Tap a slug to bend it away.", 480, 252, { size: 15, color: "#E4DCEB" });
  text("Teal seekers can't be bent; let your field take them.", 480, 276, { size: 15, color: "#E4DCEB" });
  text("When the star flares, press and HOLD to stand between it and their world.", 480, 300, { size: 15, color: "#FFE9C0" });
  text("You can return fire. Every future gets worse if you do.", 480, 336, { size: 15, color: "#E06A50" });
  text("tap to begin", 480, 410, { size: 13, color: `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 3)})`, spacing: 2 });
  if (save.best) text(`best ${save.best} · held ${save.bestTime}s${save.clean ? ` · ${save.clean} flares turned without firing` : ""}`, 480, 440, { size: 11, color: "#9C8FA8" });
}

function drawOver(t) {
  drawWorld(t);
  ctx.fillStyle = "rgba(5,4,10,0.76)"; ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  const head = lastRun.reason === "burned" ? "The Second Burning." : lastRun.fired ? "Return Fire." : "The last manifestation fell.";
  const sub = lastRun.reason === "burned" ? "Their cities went dark one flare at a time." : lastRun.fired ? `You fired back ${lastRun.fired === 1 ? "once" : `${lastRun.fired} times`}. They will remember the stranger fired.` : "They never saw you fire. Another of us is already on its way.";
  text(head, 480, 170, { size: 40, font: "Fraunces", italic: true, color: "#FFF6EA" });
  text(sub, 480, 220, { size: 14, color: "#E4DCEB" });
  text(`held ${lastRun.time}s · ${lastRun.bends} slugs bent · ${lastRun.flares} flares turned · ${lastRun.cities} cities lit`, 480, 258, { size: 13, color: "#E9A24A" });
  text(`${lastRun.score}`, 480, 314, { size: 44, color: "#FFFFFF" });
  text(lastRun.best ? "a new best" : `best ${save.best}`, 480, 354, { size: 12, color: lastRun.best ? "#FFE2B0" : "#9C8FA8", spacing: 2 });
  text("tap to try again", 480, 430, { size: 13, color: `rgba(255,255,255,${0.6 + 0.4 * Math.sin(t * 3)})`, spacing: 2 });
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const t = now / 1000;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = "#05040a"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, VIEW.w, VIEW.h); ctx.clip();
  if (screen === "title") drawTitle(t);
  else if (screen === "over") drawOver(t);
  else {
    if (!TEST) update(reduced ? dt * 0.8 : dt);
    if (screen === "play") { drawWorld(t); drawFlare(t); drawShots(t); drawMe(t); drawHud(t); }
  }
  text(save.muted ? "sound off · M" : "sound on · M", VIEW.w - 20, 24, { align: "right", size: 10, color: "#9C8FA8" });
  ctx.restore();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ?test: a hook for balance checks (scripts drive the game frame by frame)
if (TEST) window.__game = { start, update, bendAt, returnFire, input, keys, get g() { return game; }, get screen() { return screen; }, get last() { return lastRun; }, ME };
