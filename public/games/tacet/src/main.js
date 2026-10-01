// TACET - a game of The Quiet Moon (Assignment 0028657).
// One module: the lattice simulation, drawing, sound, input and screens.
// Numbers: config.js. Words: lore.js. Notes: docs/TACET.md.

import { GAME_ID, VIEW, GRID, HOLDER, SHOCK, TIDE, YOUNG, SCORE, COLORS } from "./config.js";
import * as L from "./lore.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });
const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- persistence (fails soft) ----------
const SAVE_KEY = "13i-tacet-v1";
let save = { best: 0, bestTide: 0, runs: 0, muted: false };
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

// ---------- sound: quiet on purpose. The world only gets loud when you fail ----------
const audio = (() => {
  let ac = null, noiseBuf = null, rumble = null, rumbleGain = null;
  const get = () => {
    if (save.muted) return null;
    try {
      if (!ac) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        ac = new C();
        noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        // the moon's noise, always there, louder the more leaks through
        const src = ac.createBufferSource();
        src.buffer = noiseBuf; src.loop = true;
        const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 220;
        rumbleGain = ac.createGain(); rumbleGain.gain.value = 0.0001;
        src.connect(lp).connect(rumbleGain).connect(ac.destination);
        src.start();
        rumble = src;
      }
      if (ac.state === "suspended") ac.resume();
      return ac;
    } catch (e) { return null; }
  };
  const tone = (f, dur, vol, type = "sine", glide = null) => {
    const c = get(); if (!c) return;
    const t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
  };
  return {
    unlock: get,
    absorb: (e) => tone(70 + Math.random() * 10, 0.25, Math.min(0.06, 0.015 + e * 0.03), "sine", 40),
    share: () => { tone(392, 0.5, 0.025); tone(587.3, 0.7, 0.018); },
    crack: () => tone(1800, 0.05, 0.01, "triangle"),
    leak: (e) => {
      const c = get(); if (!c) return;
      const t = c.currentTime, s = c.createBufferSource(), lp = c.createBiquadFilter(), g = c.createGain();
      s.buffer = noiseBuf; lp.type = "lowpass"; lp.frequency.value = 400;
      g.gain.setValueAtTime(Math.min(0.25, 0.06 + e * 0.12), t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      s.connect(lp).connect(g).connect(c.destination); s.start(t); s.stop(t + 1);
      tone(55, 0.9, 0.12, "sine", 30);
    },
    spent: () => { tone(220, 1.6, 0.03); tone(164.8, 2.2, 0.025); },
    great: () => { tone(46, 2.5, 0.08, "sawtooth", 38); },
    noise: (level) => { if (ac && rumbleGain) rumbleGain.gain.setTargetAtTime(save.muted ? 0.0001 : 0.0001 + level * 0.09, ac.currentTime, 0.4); },
    mute: (m) => { if (ac && rumbleGain) rumbleGain.gain.setTargetAtTime(m ? 0.0001 : 0.0001, ac.currentTime, 0.05); },
  };
})();

// ---------- the lattice ----------
const neighbours = (c, r) => {
  const odd = r % 2 === 1;
  const list = odd
    ? [[c - 1, r], [c + 1, r], [c, r - 1], [c + 1, r - 1], [c, r + 1], [c + 1, r + 1]]
    : [[c - 1, r], [c + 1, r], [c - 1, r - 1], [c, r - 1], [c - 1, r + 1], [c, r + 1]];
  return list.filter(([x, y]) => x >= 0 && x < GRID.cols && y >= 0 && y < GRID.rows);
};
const below = (c, r) => (r % 2 === 1 ? [[c, r + 1], [c + 1, r + 1]] : [[c - 1, r + 1], [c, r + 1]]).filter(([x, y]) => x >= 0 && x < GRID.cols && y < GRID.rows);
const cellPos = (c, r) => ({ x: GRID.left + c * GRID.colGap + (r % 2) * GRID.colGap * 0.5, y: GRID.top + r * GRID.rowGap });
const SEA_TOP = GRID.top + (GRID.rows - 1) * GRID.rowGap + 46;

function newHolder(c, r, wear = 0) {
  return { c, r, load: 0, wear, spent: false, spentAt: 0, gone: false, goneAt: 0, cool: 0, pulse: 0, fresh: 0 };
}

function newGame(seed) {
  let s = seed >>> 0;
  const rand = () => { s = (s + 0x6d2b79f5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const grid = [];
  for (let r = 0; r < GRID.rows; r++) for (let c = 0; c < GRID.cols; c++) grid.push(newHolder(c, r, rand() * 0.15 + (c === 0 || c === GRID.cols - 1 ? 0.25 : 0)));
  return {
    rand, grid, time: 0, tide: 1, tideT: 0, nextShock: 2.2, warnings: [], shocks: [], ripples: [], young: YOUNG.start, regrowT: 0,
    score: 0, absorbed: 0, leakRecent: 0, messages: [], great: false, greatDone: false, over: false, overAt: 0, spentCount: 0,
  };
}
const at = (g, c, r) => g.grid[r * GRID.cols + c];

function say(g, text, warm = false) {
  g.messages.push({ text, t: g.time, warm });
  if (g.messages.length > 3) g.messages.shift();
}

function warn(g, col, energy, delay = SHOCK.warn) {
  g.warnings.push({ col, energy, t: delay, total: delay });
  audio.crack();
}

function spawnShock(g, col, energy) {
  const r0 = 0;
  const startCol = Math.max(0, Math.min(GRID.cols - 1, col));
  g.shocks.push({ c: startCol, r: -1, energy, prog: 0, fromX: cellPos(startCol, 0).x, fromY: 40, toC: startCol, toR: 0, split: 0 });
}

function enterCell(g, s) {
  const h = at(g, s.toC, s.toR);
  let e = s.energy;
  if (!h.gone && !h.spent) {
    const room = Math.max(0, HOLDER.cap - h.load);
    // one holder can only take so much of a single shock; the rest goes on down
    const take = Math.min(e, room, HOLDER.perHit);
    h.load += take;
    // a holder ages slowly carrying a little, fast carrying too much
    h.wear += take * HOLDER.wearPerLoad * (h.load > HOLDER.strainAt ? HOLDER.strainMultiplier : 1);
    h.pulse = 1;
    e -= take;
    g.absorbed += take;
    g.score += take * SCORE.perAbsorbed;
    if (take > 0.05) audio.absorb(take);
    if (h.wear >= 1 && !h.spent) {
      h.spent = true;
      h.spentAt = g.time;
      g.spentCount += 1;
      audio.spent();
      if (g.spentCount <= 3 || g.spentCount % 6 === 0) say(g, L.SPENT_LINE);
    }
  }
  e *= SHOCK.fade;
  s.c = s.toC; s.r = s.toR;
  if (e < 0.03) return [];
  if (s.r >= GRID.rows - 1) {
    // into the still water
    const lost = Math.max(1, Math.round(e * YOUNG.lossPerEnergy));
    g.young = Math.max(0, g.young - lost);
    g.leakRecent = Math.min(1, g.leakRecent + 0.25 + e * 0.4);
    audio.leak(e);
    say(g, L.LEAK_LINES[Math.floor(g.rand() * L.LEAK_LINES.length)], true);
    g.ripples.push({ x: cellPos(s.c, s.r).x, y: SEA_TOP + 30, t: 0, big: true });
    return [];
  }
  // left alone, a shock keeps falling: one holder after another, straight down
  const kids = below(s.c, s.r);
  const [c, r] = kids.length > 1 ? kids[g.rand() < 0.5 ? 0 : 1] : kids[0];
  const p = cellPos(s.c, s.r);
  return [{ c: s.c, r: s.r, energy: e, prog: 0, fromX: p.x, fromY: p.y, toC: c, toR: r, split: s.split || 0 }];
}

// A touch passes a falling shock out across the sheet: many holders each take
// a little, instead of a few taking it all. That is the whole game.
function splitShocks(g, h) {
  let did = false;
  const out = [];
  g.shocks.forEach((s) => {
    const here = (s.toC === h.c && s.toR === h.r) || (s.c === h.c && s.r === h.r && s.prog < 0.35);
    if (!here || s.split >= 2) { out.push(s); return; }
    did = true;
    const p = cellPos(h.c, h.r);
    const ns = neighbours(h.c, h.r).filter(([c, r]) => r >= h.r).map(([c, r]) => [c, r]);
    // the touched holder keeps a share, as they all do
    const keep = Math.min(s.energy * 0.2, Math.max(0, HOLDER.cap - h.load));
    h.load += keep;
    h.pulse = 1;
    g.absorbed += keep;
    g.score += keep * SCORE.perAbsorbed;
    const each = (s.energy - keep) / Math.max(1, ns.length);
    ns.forEach(([c, r]) => out.push({ c: h.c, r: h.r, energy: each, prog: 0, fromX: p.x, fromY: p.y, toC: c, toR: r, split: (s.split || 0) + 1 }));
  });
  g.shocks = out;
  if (did) g.score += 5;
  return did;
}

function share(g, h) {
  if (h.gone || h.spent || h.cool > 0) return false;
  const split = splitShocks(g, h);
  if (h.load < 0.04) {
    if (split) { h.cool = HOLDER.shareCooldown * 0.5; const p = cellPos(h.c, h.r); g.ripples.push({ x: p.x, y: p.y, t: 0 }); audio.share(); }
    return split;
  }
  const ns = neighbours(h.c, h.r).map(([c, r]) => at(g, c, r)).filter((n) => !n.gone && !n.spent);
  if (!ns.length) return false;
  let give = h.load * HOLDER.shareFraction;
  const each = give / ns.length;
  let returned = 0;
  ns.forEach((n) => {
    const room = Math.max(0, HOLDER.cap - n.load);
    const take = Math.min(each, room);
    n.load += take;
    n.pulse = Math.max(n.pulse, 0.6);
    returned += each - take;
  });
  h.load = h.load - give + returned;
  h.cool = HOLDER.shareCooldown;
  const p = cellPos(h.c, h.r);
  g.ripples.push({ x: p.x, y: p.y, t: 0 });
  audio.share();
  return true;
}

function step(g, dt) {
  if (g.over) return;
  g.time += dt;
  g.tideT += dt;
  g.leakRecent = Math.max(0, g.leakRecent - dt * 0.12);
  audio.noise(g.leakRecent);

  // tides
  const greatTide = g.tide % TIDE.greatEvery === 0;
  if (greatTide && !g.great && g.tideT > TIDE.length - 6) {
    g.great = true;
    say(g, L.GREAT_LINE, true);
    audio.great();
    const cols = [];
    while (cols.length < TIDE.greatColumns) {
      const c = Math.floor(g.rand() * GRID.cols);
      if (!cols.includes(c)) cols.push(c);
    }
    cols.forEach((c, i) => warn(g, c, TIDE.greatEnergy + g.tide * 0.04, SHOCK.warn + 0.6 + i * 0.12));
  }
  if (g.tideT >= TIDE.length) {
    g.score += greatTide ? SCORE.perGreatTide : SCORE.perTide;
    if (greatTide) say(g, L.GREAT_DONE, true);
    g.tide += 1;
    g.tideT = 0;
    g.great = false;
    if (!greatTide) say(g, L.TIDE_LINES[(g.tide - 2) % L.TIDE_LINES.length]);
  }

  // ordinary shocks
  g.nextShock -= dt;
  if (g.nextShock <= 0 && !(greatTide && g.great)) {
    const interval = Math.max(SHOCK.minInterval, SHOCK.baseInterval - (g.tide - 1) * SHOCK.intervalPerTide);
    g.nextShock = interval * (0.7 + g.rand() * 0.6);
    const energy = SHOCK.baseEnergy + (g.tide - 1) * SHOCK.energyPerTide + g.rand() * SHOCK.energyJitter;
    warn(g, Math.floor(g.rand() * GRID.cols), energy);
  }
  g.warnings.forEach((w) => { w.t -= dt; if (w.t <= 0) spawnShock(g, w.col, w.energy); });
  g.warnings = g.warnings.filter((w) => w.t > 0);

  // shocks fall row by row
  const next = [];
  g.shocks.forEach((s) => {
    s.prog += dt * SHOCK.speed;
    if (s.prog >= 1) {
      enterCell(g, s).forEach((k) => next.push(k));
    } else next.push(s);
  });
  g.shocks = next;

  // holders digest, cool, whiten, are let go, are replaced
  g.grid.forEach((h) => {
    h.load = Math.max(0, h.load - HOLDER.digest * dt);
    h.cool = Math.max(0, h.cool - dt);
    h.pulse = Math.max(0, h.pulse - dt * 1.8);
    h.fresh = Math.max(0, h.fresh - dt * 0.5);
    if (h.spent && !h.gone && g.time - h.spentAt > HOLDER.releaseAfter) { h.gone = true; h.goneAt = g.time; }
    if (h.gone && g.time - h.goneAt > HOLDER.riseAfter && g.young > 1) {
      Object.assign(h, newHolder(h.c, h.r, 0), { fresh: 1 });
      g.young -= 1;
      if (g.rand() < 0.35) say(g, L.RISE_LINE);
    }
  });

  // the young grow back, slowly
  g.regrowT += dt;
  if (g.regrowT >= YOUNG.regrowEvery) { g.regrowT = 0; g.young = Math.min(YOUNG.max, g.young + 1); }

  g.ripples.forEach((r) => { r.t += dt; });
  g.ripples = g.ripples.filter((r) => r.t < 1.6);

  if (g.young <= 0) {
    g.over = true;
    g.overAt = g.time;
  }
}

// ---------- drawing ----------
function hexPath(x, y, r) {
  ctx.beginPath();
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
    const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.66;
    k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath();
}
function glow(x, y, r, rgb, a) {
  if (a <= 0.01) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

const youngDots = Array.from({ length: YOUNG.max }, (_, i) => ({ x: 40 + ((i * 97) % 880), y: 24 + ((i * 53) % 70), p: i * 1.7 }));

function drawWorld(g, t, interactive) {
  // water
  const bg = ctx.createLinearGradient(0, 0, 0, VIEW.h);
  bg.addColorStop(0, "#0b1030");
  bg.addColorStop(1, "#02030a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);

  // the ice, and its cracks warning of what's coming
  ctx.fillStyle = COLORS.ice;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  for (let i = 0; i <= 32; i++) ctx.lineTo((i / 32) * VIEW.w, 46 + Math.sin(i * 2.3) * 5 + Math.sin(i * 0.7) * 7);
  ctx.lineTo(VIEW.w, 0);
  ctx.fill();
  if (g) {
    g.warnings.forEach((w) => {
      const x = cellPos(w.col, 0).x;
      const k = 1 - w.t / w.total;
      const flick = 0.6 + 0.4 * Math.sin(t * 30);
      ctx.strokeStyle = `rgba(201,123,110,${(0.3 + k * 0.7) * flick})`;
      ctx.lineWidth = 1.5 + k * 1.5;
      ctx.beginPath();
      ctx.moveTo(x - 14, 8);
      ctx.lineTo(x - 4, 22);
      ctx.lineTo(x + 6, 30);
      ctx.lineTo(x, 48);
      ctx.stroke();
      glow(x, 46, 26 + k * 20, "201,123,110", k * 0.5);
    });
  }

  // the still water, and the young in it
  const sea = ctx.createLinearGradient(0, SEA_TOP, 0, VIEW.h);
  sea.addColorStop(0, "rgba(10,14,40,0.0)");
  sea.addColorStop(1, "rgba(14,20,60,0.8)");
  ctx.fillStyle = sea;
  ctx.fillRect(0, SEA_TOP, VIEW.w, VIEW.h - SEA_TOP);
  const count = g ? g.young : YOUNG.start;
  const shake = g ? g.leakRecent * 4 : 0;
  for (let i = 0; i < count; i++) {
    const d = youngDots[i];
    const x = d.x + Math.sin(t * 0.3 + d.p) * 6 + (shake ? Math.sin(t * 40 + i) * shake : 0);
    const y = SEA_TOP + d.y + Math.sin(t * 0.5 + d.p) * 3;
    glow(x, y, 7, "232,207,192", 0.35 + 0.25 * Math.sin(t * 1.2 + d.p));
    ctx.fillStyle = "rgba(232,207,192,0.9)";
    ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
  }

  // the holders
  const grid = g ? g.grid : null;
  for (let r = 0; r < GRID.rows; r++) {
    for (let c = 0; c < GRID.cols; c++) {
      const h = grid ? at(g, c, r) : { load: 0.15 + 0.15 * Math.sin(t + c + r), wear: 0.1, spent: false, gone: false, pulse: 0, cool: 0, fresh: 0 };
      const p = cellPos(c, r);
      const bob = Math.sin(t * 0.8 + c * 0.7 + r) * 2;
      let y = p.y + bob;
      let alpha = 1;
      if (h.gone) {
        const k = Math.min(1, (g.time - h.goneAt) / HOLDER.riseAfter);
        y += k * 120;
        alpha = 1 - k;
        if (alpha <= 0.02) continue;
      }
      const R = GRID.radius * (h.fresh ? 1 - h.fresh * 0.4 : 1) * 0.92;
      const w = Math.min(1, h.wear);
      const load = Math.min(1, h.load);
      // membrane colour: lavender → warm with load, whitening with wear
      const base = [150 + w * 90, 165 + w * 75, 255 - w * 10];
      const hot = [201, 123, 110];
      const col = base.map((v, i) => Math.round(v + (hot[i] - v) * load * 0.8));
      ctx.globalAlpha = alpha;
      hexPath(p.x, y, R);
      ctx.fillStyle = `rgba(${col.join(",")},${h.spent ? 0.45 : 0.12 + load * 0.35 + w * 0.12})`;
      ctx.fill();
      ctx.strokeStyle = h.spent ? "#ECEEFF" : interactive && hover.c === c && hover.r === r ? COLORS.warm : `rgba(${col.join(",")},0.7)`;
      ctx.lineWidth = interactive && hover.c === c && hover.r === r ? 2 : 1;
      ctx.stroke();
      // filaments
      ctx.strokeStyle = "rgba(139,149,246,0.25)";
      ctx.lineWidth = 0.7;
      for (let k = -1; k <= 1; k++) {
        ctx.beginPath();
        ctx.moveTo(p.x + k * 14, y + R * 0.6);
        ctx.quadraticCurveTo(p.x + k * 16 + Math.sin(t + c + k) * 3, y + R * 0.85, p.x + k * 12, y + R * 1.05);
        ctx.stroke();
      }
      if (h.pulse > 0) glow(p.x, y, R * 1.1, h.load > 0.6 ? "201,123,110" : "185,192,255", h.pulse * 0.6);
      // load meter: a ring that fills
      if (!h.spent && load > 0.02) {
        ctx.strokeStyle = load > 0.75 ? COLORS.rust : COLORS.warm;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, y, 9, -Math.PI / 2, -Math.PI / 2 + load * Math.PI * 2);
        ctx.stroke();
      }
      if (h.cool > 0 && !h.spent) {
        ctx.fillStyle = `rgba(232,207,192,${h.cool / HOLDER.shareCooldown * 0.5})`;
        ctx.beginPath(); ctx.arc(p.x, y, 4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  // touch ripples
  if (g) {
    g.ripples.forEach((r) => {
      const k = r.t / 1.6;
      ctx.strokeStyle = r.big ? `rgba(201,123,110,${(1 - k) * 0.8})` : `rgba(232,207,192,${(1 - k) * 0.7})`;
      ctx.lineWidth = r.big ? 2 : 1.2;
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, 20 + k * (r.big ? 160 : 90), (20 + k * (r.big ? 160 : 90)) * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    // falling shocks
    g.shocks.forEach((s) => {
      const to = cellPos(s.toC, s.toR);
      const x = s.fromX + (to.x - s.fromX) * s.prog;
      const y = s.fromY + (to.y - s.fromY) * s.prog;
      glow(x, y, 14 + s.energy * 26, "201,123,110", Math.min(0.9, 0.35 + s.energy * 0.5));
      ctx.fillStyle = "#F2D4C6";
      ctx.beginPath(); ctx.arc(x, y, 2 + s.energy * 3, 0, Math.PI * 2); ctx.fill();
    });
  }
}

function text(str, x, y, { size = 14, font = "JetBrains Mono", color = COLORS.text, align = "center", italic = false, alpha = 1 } = {}) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `${italic ? "italic " : ""}${size}px '${font}', monospace`;
  ctx.textAlign = align;
  ctx.fillText(str, x, y);
  ctx.globalAlpha = 1;
}

function drawHud(g) {
  text(`TIDE ${g.tide}${g.tide % TIDE.greatEvery === 0 ? " · GREAT" : ""}`, 18, 24, { size: 12, align: "left", color: COLORS.lavMid });
  text(`YOUNG ${g.young}`, 18, 42, { size: 12, align: "left", color: COLORS.warm });
  text(`${Math.floor(g.score).toLocaleString()}`, VIEW.w - 18, 24, { size: 14, align: "right", color: COLORS.text });
  text(save.muted ? "SOUND OFF (M)" : "M: SOUND", VIEW.w - 18, 42, { size: 10, align: "right", color: COLORS.muted });
  // tide progress
  ctx.fillStyle = "rgba(139,149,246,0.25)";
  ctx.fillRect(18, 52, 120, 2);
  ctx.fillStyle = COLORS.lavMid;
  ctx.fillRect(18, 52, 120 * (g.tideT / TIDE.length), 2);
  g.messages.forEach((m, i) => {
    const age = g.time - m.t;
    const a = age < 0.4 ? age / 0.4 : Math.max(0, 1 - (age - 3.5) / 1.5);
    if (a <= 0) return;
    text(m.text, VIEW.w / 2, SEA_TOP - 4 - (g.messages.length - 1 - i) * 20, { size: 18, font: "Fraunces", italic: true, color: m.warm ? COLORS.warm : COLORS.lav, alpha: a });
  });
}

// ---------- screens ----------
let screen = "title"; // title | howto | play | over
let game = null;
let hover = { c: -1, r: -1 };
let time = 0;
let lastRun = null;

function start() {
  audio.unlock();
  game = newGame((Math.random() * 1e9) >>> 0);
  screen = "play";
  save.runs += 1;
  persist();
  post({ type: "play" });
  say(game, "Take the shocks. Share them. Keep the water still.");
}

function finish() {
  const score = Math.floor(game.score);
  const isBest = score > save.best;
  save.best = Math.max(save.best, score);
  save.bestTide = Math.max(save.bestTide, game.tide);
  persist();
  lastRun = { score, tide: game.tide, best: isBest, spent: game.spentCount };
  post({ type: "score", score });
  screen = "over";
}

function drawTitle(t) {
  drawWorld(null, t, false);
  ctx.fillStyle = "rgba(3,4,12,0.74)";
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text(L.TITLE, VIEW.w / 2, 210, { size: 64, font: "Fraunces", italic: true, color: COLORS.text });
  text(L.SUBTITLE.toUpperCase(), VIEW.w / 2, 242, { size: 12, color: COLORS.lavMid });
  L.INTRO.forEach((line, i) => text(line, VIEW.w / 2, 300 + i * 26, { size: 17, font: "Fraunces", italic: true, color: i === 4 ? COLORS.warm : COLORS.lav, alpha: Math.min(1, Math.max(0, t * 0.8 - i * 0.6)) }));
  const k = 0.5 + 0.5 * Math.sin(t * 2.5);
  text("touch to begin · H for how to play", VIEW.w / 2, 470, { size: 12, color: COLORS.muted, alpha: 0.5 + k * 0.5 });
  if (save.best) text(`BEST ${save.best.toLocaleString()} · TIDE ${save.bestTide}`, VIEW.w / 2, 500, { size: 11, color: COLORS.muted });
}

function drawHowto(t) {
  drawWorld(null, t, false);
  ctx.fillStyle = "rgba(3,4,12,0.75)";
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text("HOW THE LATTICE HOLDS", VIEW.w / 2, 170, { size: 13, color: COLORS.lavMid });
  L.HOWTO.forEach((line, i) => text(line, VIEW.w / 2, 220 + i * 34, { size: 18, font: "Fraunces", italic: true, color: COLORS.lav }));
  text("touch to begin", VIEW.w / 2, 430, { size: 12, color: COLORS.muted });
}

function drawOver(t) {
  drawWorld(game, t, false);
  ctx.fillStyle = "rgba(3,4,12,0.72)";
  ctx.fillRect(0, 0, VIEW.w, VIEW.h);
  text(L.OVER_LINES[0], VIEW.w / 2, 200, { size: 26, font: "Fraunces", italic: true, color: COLORS.warm });
  text(L.OVER_LINES[1], VIEW.w / 2, 234, { size: 16, font: "Fraunces", italic: true, color: COLORS.lav });
  text(`${lastRun.score.toLocaleString()}`, VIEW.w / 2, 300, { size: 40, color: COLORS.text });
  text(`TIDE ${lastRun.tide} · ${lastRun.spent} HOLDERS LET GO${lastRun.best ? " · NEW BEST" : ""}`, VIEW.w / 2, 330, { size: 12, color: lastRun.best ? COLORS.warm : COLORS.lavMid });
  if (t - game.overAt > 1.2 || true) text("touch to hold again", VIEW.w / 2, 400, { size: 12, color: COLORS.muted, alpha: 0.6 + 0.4 * Math.sin(t * 2.5) });
}

// ---------- input ----------
function cellAt(p) {
  let best = null, bd = 1e9;
  for (let r = 0; r < GRID.rows; r++) for (let c = 0; c < GRID.cols; c++) {
    const q = cellPos(c, r);
    const d = Math.hypot(p.x - q.x, (p.y - q.y) * 1.4);
    if (d < bd) { bd = d; best = { c, r }; }
  }
  return bd < GRID.radius * 0.95 ? best : null;
}

let overReadyAt = 0;
canvas.addEventListener("pointermove", (e) => {
  const cell = cellAt(toLogical(e));
  hover = cell || { c: -1, r: -1 };
});
canvas.addEventListener("pointerdown", (e) => {
  canvas.focus();
  audio.unlock();
  if (screen === "title" || screen === "howto") { start(); return; }
  if (screen === "over") { if (performance.now() > overReadyAt) start(); return; }
  if (screen === "play") {
    const cell = cellAt(toLogical(e));
    if (cell) share(game, at(game, cell.c, cell.r));
  }
});
window.addEventListener("keydown", (e) => {
  if (e.key === "m" || e.key === "M") { save.muted = !save.muted; persist(); audio.noise(0); return; }
  if (screen === "title" && (e.key === "h" || e.key === "H")) { screen = "howto"; return; }
  if ((screen === "title" || screen === "howto") && (e.key === " " || e.key === "Enter")) { start(); return; }
  if (screen === "over" && (e.key === " " || e.key === "Enter") && performance.now() > overReadyAt) { start(); return; }
  // keyboard play: arrows move a cursor, space shares
  if (screen === "play") {
    if (hover.c < 0) hover = { c: 4, r: 2 };
    if (e.key === "ArrowLeft") hover.c = Math.max(0, hover.c - 1);
    if (e.key === "ArrowRight") hover.c = Math.min(GRID.cols - 1, hover.c + 1);
    if (e.key === "ArrowUp") hover.r = Math.max(0, hover.r - 1);
    if (e.key === "ArrowDown") hover.r = Math.min(GRID.rows - 1, hover.r + 1);
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); share(game, at(game, hover.c, hover.r)); }
  }
});

// ---------- loop ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  time += reduced ? dt * 0.5 : dt;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, VIEW.w, VIEW.h);
  ctx.clip();
  try {
    if (screen === "title") drawTitle(time);
    else if (screen === "howto") drawHowto(time);
    else if (screen === "play") {
      step(game, dt);
      drawWorld(game, time, true);
      drawHud(game);
      if (game.over) { overReadyAt = performance.now() + 1200; finish(); }
    } else if (screen === "over") drawOver(time);
  } catch (err) {
    // never freeze on a drawing error
  }
  ctx.restore();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// test hook: /games/tacet/index.html?test
if (new URLSearchParams(location.search).has("test")) {
  window.__tacet = { newGame, step, share, at, start: () => start(), get game() { return game; }, GRID };
}
