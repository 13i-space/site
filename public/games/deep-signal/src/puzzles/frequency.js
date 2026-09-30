// FREQUENCY MATCH - tune a carrier until it sits on the transmission.
// Heard: two tones beat against each other, slowing as they converge.
// Seen: the two waveforms overlay, and a coherence meter fills.

import { panel } from "./common.js";
import { text } from "../ui/text.js";

export function createFrequency(game, rng) {
  const target = { f: rng.range(190, 380), phase: rng.range(0, Math.PI * 2) };
  const player = { f: target.f * rng.pick([0.62, 0.7, 1.35, 1.48]), phase: rng.range(0, Math.PI * 2) };
  const tones = game.audio.startTones(target.f);
  let t = 0, held = 0, solvedAt = null;
  const state = { result: null };

  const coherence = () => {
    const df = Math.abs(player.f - target.f) / target.f;
    let dp = Math.abs(((player.phase - target.phase) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
    return Math.max(0, 1 - df * 7) * (0.35 + 0.65 * (1 - dp / Math.PI));
  };

  let stopped = false;
  state.dispose = () => {
    if (stopped) return;
    stopped = true;
    tones.stop();
  };
  const finish = (result) => {
    state.dispose();
    state.result = result;
  };

  state.update = (dt, input) => {
    t += dt;
    if (solvedAt !== null) { if (t - solvedAt > 1.4) finish("solved"); return; }
    if (input.take("pause")) { finish("aborted"); return; }
    const h = input.held;
    const fine = h.has("pulse") ? 0.25 : 1;
    if (h.has("left")) player.f -= 40 * dt * fine;
    if (h.has("right")) player.f += 40 * dt * fine;
    if (h.has("up")) player.phase += 2 * dt * fine;
    if (h.has("down")) player.phase -= 2 * dt * fine;
    if (input.pointer.down) {
      // drag horizontally for frequency, vertically for phase
      const cx = game.w / 2, cy = game.h / 2;
      player.f += ((input.pointer.x - cx) / game.w) * 60 * dt;
      player.phase += ((cy - input.pointer.y) / game.h) * 4 * dt;
    }
    player.f = Math.max(100, Math.min(600, player.f));
    tones.setPlayer(player.f);
    const c = coherence();
    held = c > 0.93 ? held + dt : Math.max(0, held - dt * 2);
    if (held > 1.2) { solvedAt = t; game.audio.success(); }
  };

  state.draw = (ctx, w, h) => {
    const p = panel(ctx, w, h, "FREQUENCY MATCH", "LEFT/RIGHT  FREQUENCY      UP/DOWN  PHASE      HOLD SHIFT  FINE");
    const ww = p.pw - 80, x0 = p.cx - ww / 2;
    const amp = Math.min(60, p.ph * 0.14);
    const c = coherence();
    const solved = solvedAt !== null;
    const scale = 0.05; // radians per pixel per Hz / 100
    // target: noisy, dotted
    ctx.save();
    ctx.strokeStyle = "rgba(124,124,132,0.8)";
    ctx.setLineDash([2, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= ww; i += 2) {
      const y = p.cy - 20 + Math.sin(i * scale * (target.f / 100) + target.phase + t * 3) * amp + (solved ? 0 : (Math.random() - 0.5) * 6 * (1 - c));
      i ? ctx.lineTo(x0 + i, y) : ctx.moveTo(x0 + i, y);
    }
    ctx.stroke();
    ctx.restore();
    // carrier
    ctx.save();
    ctx.strokeStyle = solved ? "#fff4d6" : "#f3e3b5";
    ctx.lineWidth = 2;
    if (c > 0.8) { ctx.shadowColor = "#f3e3b5"; ctx.shadowBlur = 12 * c; }
    ctx.beginPath();
    for (let i = 0; i <= ww; i += 2) {
      const y = p.cy - 20 + Math.sin(i * scale * (player.f / 100) + player.phase + t * 3) * amp;
      i ? ctx.lineTo(x0 + i, y) : ctx.moveTo(x0 + i, y);
    }
    ctx.stroke();
    ctx.restore();
    // coherence meter
    const my = p.cy + amp + 40;
    text(ctx, "COHERENCE", x0, my - 8, { size: 9, spacing: 2, color: "#7c7c84" });
    ctx.strokeStyle = "rgba(243,227,181,0.3)";
    ctx.strokeRect(x0 + 0.5, my + 0.5, ww, 8);
    ctx.fillStyle = c > 0.93 ? "#fff4d6" : "#a8987a";
    ctx.fillRect(x0 + 1, my + 1, (ww - 2) * c, 6);
    text(ctx, `${(player.f).toFixed(1)} Hz`, x0 + ww, my - 8, { size: 9, spacing: 1, color: "#7c7c84", align: "right" });
    if (held > 0 && !solved) text(ctx, "HOLDING", p.cx, my + 36, { size: 10, spacing: 4, color: "#f3e3b5", align: "center", alpha: 0.5 + 0.5 * Math.sin(t * 10) });
    if (solved) text(ctx, "TRANSMISSION STABLE", p.cx, my + 36, { size: 11, spacing: 4, color: "#fff4d6", align: "center" });
  };

  return state;
}
