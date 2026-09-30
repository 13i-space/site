// SIGNAL ALIGNMENT - three rings, each with a gap. Turning a ring also
// drags the ring inside it the other way. Bring every gap to the top and the
// rings resolve into the ring-eye geometry.

import { panel } from "./common.js";
import { drawSymbol } from "../ui/symbol.js";

const STEPS = 12;

export function createAlignment(game, rng) {
  const rings = [0, 0, 0];
  // scramble with real moves so it is always solvable
  for (let i = 0; i < 14; i++) turn(rng.int(0, 2), rng.chance(0.5) ? 1 : -1);
  if (rings.every((r) => r === 0)) turn(0, 1);

  let sel = 0;
  let solvedAt = null;
  let t = 0;
  let geo = null;
  const state = { result: null };

  function turn(i, dir) {
    rings[i] = (rings[i] + dir + STEPS) % STEPS;
    if (i < 2) rings[i + 1] = (rings[i + 1] - dir + STEPS) % STEPS;
  }

  state.update = (dt, input) => {
    t += dt;
    if (solvedAt !== null) {
      if (t - solvedAt > 1.8) state.result = "solved";
      return;
    }
    if (input.take("pause")) { state.result = "aborted"; return; }
    if (input.take("up")) { sel = Math.max(0, sel - 1); game.audio.ui(); }
    if (input.take("down")) { sel = Math.min(2, sel + 1); game.audio.ui(); }
    let dir = 0;
    if (input.take("left")) dir = -1;
    if (input.take("right")) dir = 1;
    if (input.takeClick() && geo) {
      const p = input.pointer;
      const d = Math.hypot(p.x - geo.cx, p.y - geo.cy);
      const idx = geo.radii.findIndex((r) => Math.abs(d - r) < 18);
      if (idx >= 0) { sel = idx; dir = p.x < geo.cx ? -1 : 1; }
    }
    if (dir) {
      turn(sel, dir);
      game.audio.ui();
      if (rings.every((r) => r === 0)) {
        solvedAt = t;
        game.audio.success();
      }
    }
  };

  state.draw = (ctx, w, h) => {
    const p = panel(ctx, w, h, "SIGNAL ALIGNMENT", "UP/DOWN  SELECT RING      LEFT/RIGHT  TURN");
    const base = Math.min(p.pw, p.ph) * 0.34;
    const radii = [base, base * 0.72, base * 0.46];
    geo = { cx: p.cx, cy: p.cy, radii };
    const solved = solvedAt !== null;
    const glow = solved ? Math.min(1, (t - solvedAt) / 1.2) : 0;

    radii.forEach((r, i) => {
      const rot = (rings[i] / STEPS) * Math.PI * 2;
      const gap = 0.42;
      const on = i === sel && !solved;
      ctx.save();
      ctx.strokeStyle = solved ? `rgba(255,244,214,${0.5 + glow * 0.5})` : on ? "#fff4d6" : "rgba(243,227,181,0.45)";
      ctx.lineWidth = on ? 3 : 2;
      if (on || solved) { ctx.shadowColor = "#f3e3b5"; ctx.shadowBlur = 10 + glow * 10; }
      const start = -Math.PI / 2 + rot + gap / 2;
      ctx.beginPath();
      ctx.arc(p.cx, p.cy, r, start, start + Math.PI * 2 - gap);
      ctx.stroke();
      // tick marks travel with the ring so rotation is readable
      for (let k = 0; k < STEPS; k++) {
        if (k === 0) continue;
        const a = -Math.PI / 2 + rot + (k / STEPS) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(p.cx + Math.cos(a) * (r - 5), p.cy + Math.sin(a) * (r - 5));
        ctx.lineTo(p.cx + Math.cos(a) * (r + 5), p.cy + Math.sin(a) * (r + 5));
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    });
    // the reference mark at the top
    ctx.fillStyle = "#f3e3b5";
    ctx.beginPath();
    ctx.moveTo(p.cx, p.cy - radii[0] - 14);
    ctx.lineTo(p.cx - 5, p.cy - radii[0] - 22);
    ctx.lineTo(p.cx + 5, p.cy - radii[0] - 22);
    ctx.fill();

    if (solved) drawSymbol(ctx, p.cx, p.cy + radii[2] * 0.2, radii[2] * 1.5, { alpha: glow, glow: 16, progress: glow });
  };

  return state;
}
