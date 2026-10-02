// UIManager for the run: instrument-style HUD, messages, prompt, choice
// dialog, minimap and the full map. Nothing here relies on color alone -
// every state also has a word or a shape.

import { text, scramble, wrap } from "./text.js";
import { drawSymbol } from "./symbol.js";
import { GRID_W, GRID_H } from "../config.js";

function meter(ctx, x, y, w, label, value, { note = "", glitch = 0, delta = null } = {}) {
  const v = Math.max(0, Math.min(100, value));
  const shown = glitch ? scramble(String(Math.round(v)).padStart(3, " "), 0.6) : String(Math.round(v)).padStart(3, " ");
  text(ctx, label, x - w, y, { size: 9, spacing: 2, color: "#7c7c84" });
  text(ctx, shown, x, y, { size: 11, color: "#f3e3b5", align: "right" });
  // ten segments
  const seg = w / 10;
  for (let i = 0; i < 10; i++) {
    const filled = v >= (i + 1) * 10 - 5;
    ctx.fillStyle = filled ? "rgba(243,227,181,0.85)" : "rgba(243,227,181,0.12)";
    ctx.fillRect(x - w + i * seg, y + 6, seg - 2, 3);
  }
  if (note) text(ctx, note, x, y + 22, { size: 8, spacing: 1.5, color: "#a8987a", align: "right" });
  if (delta) {
    const a = Math.max(0, 1 - delta.age / 1.6);
    text(ctx, `${delta.amount > 0 ? "+" : ""}${Math.round(delta.amount)}`, x - w - 8, y - delta.age * 8, { size: 10, color: "#fff4d6", alpha: a, align: "right" });
  }
}

export function drawHud(ctx, game, run, t) {
  const { w, h } = game;
  const s = run.stats;
  const glitch = run.warden.effects.falseReading > 0 || run.hudGlitch > 0;
  const m = w < 600 ? 14 : 24;

  // top-left: the symbol and SIGNAL
  drawSymbol(ctx, m + 9, m + 14, 26, { alpha: 0.9 });
  text(ctx, "SIGNAL", m + 30, m + 8, { size: 9, spacing: 3, color: "#7c7c84" });
  const sig = glitch ? `${scramble(String(Math.round(s.signal + (Math.random() - 0.5) * 30)), 0.4)}%` : `${Math.round(s.signal)}%`;
  text(ctx, sig, m + 30, m + 32, { size: 22, color: "#fff4d6", glow: 8 });
  const bw = 120;
  ctx.fillStyle = "rgba(243,227,181,0.12)";
  ctx.fillRect(m + 30, m + 40, bw, 2);
  ctx.fillStyle = "#f3e3b5";
  ctx.fillRect(m + 30, m + 40, bw * Math.min(1, s.signal / 100), 2);
  text(ctx, `FRAGMENTS ${run.fragments.length}`, m + 30, m + 56, { size: 8, spacing: 2, color: "#a8987a" });
  // what to do next - always on screen, so the point of the run is never a mystery
  const obj = objectiveFor(run);
  text(ctx, "OBJECTIVE", m, m + 82, { size: 8, spacing: 3, color: "#7c7c84" });
  obj.forEach((line, i) => text(ctx, line, m, m + 98 + i * 14, { size: w < 600 ? 8 : 9, spacing: 1.5, color: i ? "#a8987a" : "#f3e3b5" }));
  if (glitch && run.warden.effects.falseReading > 0) text(ctx, "INTERFERENCE", m + 30 + bw + 8, m + 44, { size: 8, spacing: 2, color: "#a8987a", alpha: 0.6 + 0.4 * Math.sin(t * 9) });
  const sd = run.deltas.signal;
  if (sd && sd.age < 1.6) text(ctx, `+${Math.round(sd.amount)}`, m + 30 + bw + 8, m + 32 - sd.age * 8, { size: 11, color: "#fff4d6", alpha: 1 - sd.age / 1.6 });

  // top-right: ENERGY / INTEGRITY / AWARENESS
  const rx = w - m, mw = w < 600 ? 90 : 120;
  meter(ctx, rx, m + 8, mw, "ENERGY", s.energy, { note: s.energy < 15 ? "LOW" : "", delta: run.deltas.energy });
  meter(ctx, rx, m + 44, mw, "INTEGRITY", s.integrity, { note: s.integrity < 25 ? "CRITICAL" : "", delta: run.deltas.integrity });
  meter(ctx, rx, m + 80, mw, "AWARENESS", s.awareness, { note: run.warden.state === "DORMANT" ? "" : `WARDEN · ${run.warden.state}`, glitch: glitch ? 1 : 0, delta: run.deltas.awareness });

  // messages
  run.messages.forEach((msg, i) => {
    const a = Math.min(1, msg.life / 0.8) * Math.min(1, (msg.max - msg.life) / 0.3);
    text(ctx, msg.text, w / 2, Math.max(m + 70, h * 0.16) + i * 22, { size: Math.min(12, w * 0.027), spacing: w < 600 ? 1 : 3, color: msg.dim ? "#a8987a" : "#fff4d6", align: "center", alpha: a, glow: msg.dim ? 0 : 6 });
  });

  // context prompt
  if (run.prompt && !run.dialog) {
    text(ctx, run.prompt, w / 2, h - (game.input.touch.isTouchDevice ? 150 : 48), { size: 11, spacing: 3, color: "#f3e3b5", align: "center", alpha: 0.75 + 0.25 * Math.sin(t * 4) });
  }
  if (!game.input.touch.isTouchDevice && w >= 760) {
    text(ctx, "SPACE SCAN   SHIFT PULSE   E INTERACT   M MAP   TAB LOG   ESC PAUSE", m, h - m, { size: 8, spacing: 1.5, color: "#3a3a40" });
  }
  if (run.warden.effects.scanSuppressed > 0) {
    text(ctx, "SCAN SUPPRESSED", w / 2, h - (game.input.touch.isTouchDevice ? 170 : 70), { size: 9, spacing: 3, color: "#a8987a", align: "center" });
  }
  // the Warden's attention, at the edge of vision
  if (run.warden.state === "CONFRONTING" && !game.settings().reducedEffects) {
    const a = 0.15 + 0.1 * Math.sin(t * 1.3);
    ctx.save();
    ctx.strokeStyle = `rgba(244,241,234,${a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(w / 2, -h * 0.9, w * 0.7, h, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const mm = Math.round(Math.min(150, w * 0.26, h * 0.26));
  drawMinimap(ctx, game, run, w - m - mm, h - m - mm, mm, t, false);
}

// --- dialog: SCAN / EXTRACT / CONNECT / LEAVE ---
export function drawDialog(ctx, game, d) {
  const { w, h } = game;
  const pw = Math.min(460, w - 32);
  const lines = wrap(ctx, d.body || "", pw - 40, 13, { family: "'Fraunces', Georgia, serif", italic: true });
  const ph = 80 + lines.length * 20 + d.options.length * 28;
  const x = (w - pw) / 2, y = h - ph - (game.input.touch.isTouchDevice ? 150 : 70);
  ctx.fillStyle = "rgba(8,8,10,0.94)";
  ctx.fillRect(x, y, pw, ph);
  ctx.strokeStyle = "rgba(243,227,181,0.35)";
  ctx.strokeRect(x + 0.5, y + 0.5, pw - 1, ph - 1);
  text(ctx, d.title, x + 20, y + 28, { size: 11, spacing: 3, color: "#f3e3b5" });
  lines.forEach((l, i) => text(ctx, l, x + 20, y + 54 + i * 20, { size: 13, color: "#d8d2c4", family: "'Fraunces', Georgia, serif", italic: true }));
  d.rects = [];
  d.options.forEach((o, i) => {
    const oy = y + 60 + lines.length * 20 + i * 28;
    const on = i === d.sel;
    text(ctx, `${i + 1}`, x + 20, oy + 12, { size: 10, color: "#4a4a52" });
    text(ctx, o.label, x + 44, oy + 12, { size: 12, spacing: 3, color: on ? "#fff4d6" : "#7c7c84", glow: on ? 8 : 0 });
    d.rects.push({ x, y: oy - 6, w: pw, h: 26 });
  });
}

// --- minimap / full map ---
export function drawMinimap(ctx, game, run, x, y, size, t, full) {
  const world = run.world;
  const cell = size / Math.max(GRID_W, GRID_H);
  const ox = x + (size - GRID_W * cell) / 2, oy = y + (size - GRID_H * cell) / 2;
  const distort = run.warden.effects.mapDistort > 0 && !game.settings().reducedEffects;
  if (!full) {
    ctx.fillStyle = "rgba(3,3,3,0.6)";
    ctx.fillRect(x - 6, y - 6, size + 12, size + 12);
    ctx.strokeStyle = "rgba(243,227,181,0.18)";
    ctx.strokeRect(x - 5.5, y - 5.5, size + 11, size + 11);
  }
  const current = world.roomAt(run.player.x, run.player.y);
  world.rooms.forEach((r) => {
    if (!r.explored && !run.debugReveal) return;
    let rx = ox + r.cx * cell, ry = oy + r.cy * cell;
    if (distort) { rx += (Math.random() - 0.5) * cell * 1.5; ry += (Math.random() - 0.5) * cell * 1.5; }
    const isCur = r === current;
    ctx.fillStyle = isCur ? "rgba(243,227,181,0.55)" : r.explored ? "rgba(243,227,181,0.16)" : "rgba(124,124,132,0.08)";
    ctx.fillRect(rx + 1, ry + 1, cell - 2, cell - 2);
    if (isCur) {
      ctx.strokeStyle = "#fff4d6";
      ctx.strokeRect(rx + 0.5, ry + 0.5, cell - 1, cell - 1);
    }
    // doors
    ctx.fillStyle = "rgba(243,227,181,0.5)";
    Object.entries(r.doors).forEach(([dir, d]) => {
      if (d.state === "hidden") return;
      const s = Math.max(1.5, cell * 0.14);
      if (dir === "e") ctx.fillRect(rx + cell - s / 2, ry + cell / 2 - s / 2, s, s);
      if (dir === "s") ctx.fillRect(rx + cell / 2 - s / 2, ry + cell - s / 2, s, s);
    });
    // icons for what you've found
    const ic = [];
    r.objects.forEach((o) => {
      if (!o.seen) return;
      if (o.type === "relay" && o.state !== "connected") ic.push("relay");
      if (o.type === "energy" && o.charge > 0) ic.push("energy");
      if (o.type === "terminal" && !o.solved) ic.push("terminal");
      if (o.type === "gate") ic.push("gate");
    });
    ic.slice(0, 2).forEach((kind, i) => {
      const ix = rx + cell * (0.32 + i * 0.36), iy = ry + cell * 0.5;
      const s = Math.max(2, cell * 0.16);
      ctx.strokeStyle = "#fff4d6";
      ctx.fillStyle = "#fff4d6";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (kind === "relay") { ctx.moveTo(ix, iy - s); ctx.lineTo(ix + s, iy + s); ctx.lineTo(ix - s, iy + s); ctx.closePath(); ctx.stroke(); }
      if (kind === "energy") { ctx.moveTo(ix - s, iy); ctx.lineTo(ix + s, iy); ctx.moveTo(ix, iy - s); ctx.lineTo(ix, iy + s); ctx.stroke(); }
      if (kind === "terminal") { ctx.moveTo(ix, iy - s); ctx.lineTo(ix + s, iy); ctx.lineTo(ix, iy + s); ctx.lineTo(ix - s, iy); ctx.closePath(); ctx.stroke(); }
      if (kind === "gate") { ctx.arc(ix, iy, s, 0, Math.PI * 2); ctx.stroke(); }
    });
  });
  // the false objective, pulsing
  if (run.warden.falseObjective) {
    const r = world.rooms.get(run.warden.falseObjective);
    const rx = ox + r.cx * cell + cell / 2, ry = oy + r.cy * cell + cell / 2;
    const a = 0.5 + 0.5 * Math.sin(t * 5);
    ctx.strokeStyle = `rgba(255,244,214,${a})`;
    ctx.beginPath();
    ctx.arc(rx, ry, cell * 0.35, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (full) {
    text(ctx, "SIGNAL SEED  " + run.seedText, x + size / 2, y + size + 28, { size: 9, spacing: 2, color: "#4a4a52", align: "center" });
  }
}

export function drawFullMap(ctx, game, run, t) {
  const { w, h } = game;
  ctx.fillStyle = "rgba(3,3,3,0.92)";
  ctx.fillRect(0, 0, w, h);
  text(ctx, "MAP", 32, 44, { size: 12, spacing: 4, color: "#f3e3b5" });
  text(ctx, "M  CLOSE", w - 32, 44, { size: 9, spacing: 2, color: "#7c7c84", align: "right" });
  const size = Math.min(w - 80, h - 150);
  drawMinimap(ctx, game, run, (w - size) / 2, 70, size, t, true);
  const legend = [["△", "RELAY"], ["+", "ENERGY"], ["◇", "DEVICE"], ["○", "GATE"]];
  legend.forEach(([g, l], i) => text(ctx, `${g} ${l}`, 32, h - 110 + i * 18, { size: 9, spacing: 2, color: "#7c7c84" }));
}

// The current goal, in two short lines.
export function objectiveFor(run) {
  const s = run.stats;
  const room = run.world.roomAt(run.player.x, run.player.y);
  if (room && room.type === "node") return ["REACH THE 13i NODE AT THE CENTER", "INTERACT WITH IT TO ANSWER THE SIGNAL"];
  if (s.signal >= 50) return ["FIND THE RESONANCE GATE AND FOLLOW IT", "A RING ON THE MAP (M) ONCE YOU HAVE SEEN IT"];
  const warn = s.awareness >= 70 ? "KEEP AWARENESS BELOW 100 - IT IS CLOSE" : "SCAN \u00B7 READ MARKERS \u00B7 CONNECT RELAYS";
  return [`RAISE THE SIGNAL TO 50%   ( NOW ${Math.round(s.signal)}% )`, warn];
}
