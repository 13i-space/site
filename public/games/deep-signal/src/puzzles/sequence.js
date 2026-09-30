// SYMBOL SEQUENCE - reproduce a four-glyph sequence. The glyphs, and their
// order, are recorded from glyph stones hidden around the world; the
// sequence changes every run. A wrong sequence is noticed.

import { panel } from "./common.js";
import { text } from "../ui/text.js";
import { drawGlyph, GLYPH_COUNT } from "./glyphs.js";

export function createSequence(game, run, { onWrong }) {
  const answer = run.world.sequence;
  let entered = [];
  let sel = 0;
  let t = 0, solvedAt = null, wrongFlash = 0;
  let rects = [];
  const state = { result: null };

  const submit = () => {
    if (entered.every((g, i) => g === answer[i])) {
      solvedAt = t;
      game.audio.success();
    } else {
      wrongFlash = 1;
      game.audio.failure();
      onWrong();
      entered = [];
    }
  };

  const choose = (g) => {
    entered.push(g);
    game.audio.ui();
    if (entered.length === answer.length) submit();
  };

  state.update = (dt, input) => {
    t += dt;
    wrongFlash = Math.max(0, wrongFlash - dt);
    if (solvedAt !== null) { if (t - solvedAt > 1.4) state.result = "solved"; return; }
    if (input.take("pause")) { state.result = "aborted"; return; }
    if (input.take("left")) sel = (sel + GLYPH_COUNT - 1) % GLYPH_COUNT;
    if (input.take("right")) sel = (sel + 1) % GLYPH_COUNT;
    if (input.take("up")) sel = (sel + GLYPH_COUNT - 4) % GLYPH_COUNT;
    if (input.take("down")) sel = (sel + 4) % GLYPH_COUNT;
    if (input.take("interact") || input.take("confirm") || input.take("scan")) choose(sel);
    if (input.takeClick()) {
      const i = rects.findIndex((r) => input.pointer.x > r.x && input.pointer.x < r.x + r.s && input.pointer.y > r.y && input.pointer.y < r.y + r.s);
      if (i >= 0) { sel = i; choose(i); }
    }
  };

  state.draw = (ctx, w, h) => {
    const p = panel(ctx, w, h, "SYMBOL SEQUENCE", "ARROWS  SELECT      E  PLACE");
    const solved = solvedAt !== null;
    // slots
    const slot = 54;
    const sx = p.cx - (answer.length * (slot + 14)) / 2 + 7;
    const sy = p.y + 70;
    answer.forEach((_, i) => {
      const x = sx + i * (slot + 14);
      ctx.strokeStyle = wrongFlash > 0 ? `rgba(255,244,214,${wrongFlash})` : "rgba(243,227,181,0.35)";
      ctx.strokeRect(x + 0.5, sy + 0.5, slot, slot);
      if (entered[i] !== undefined || solved) drawGlyph(ctx, solved ? answer[i] : entered[i], x + slot / 2, sy + slot / 2, slot * 0.6, solved ? "#fff4d6" : "#f3e3b5");
      // what the glyph stones recorded
      const known = run.glyphs[i + 1];
      if (known !== undefined) drawGlyph(ctx, known, x + slot / 2, sy + slot + 22, 16, "#7c7c84", 0.9, 1.2);
      else text(ctx, "?", x + slot / 2, sy + slot + 27, { size: 11, color: "#4a4a52", align: "center" });
    });
    if (sx > 90) text(ctx, "RECORDED", sx - 14, sy + slot + 27, { size: 8, spacing: 2, color: "#4a4a52", align: "right" });
    // palette
    const cell = Math.min(62, (p.pw - 80) / 4);
    const px = p.cx - cell * 2, py = sy + slot + 60;
    rects = [];
    for (let i = 0; i < GLYPH_COUNT; i++) {
      const x = px + (i % 4) * cell, y = py + Math.floor(i / 4) * cell;
      rects.push({ x, y, s: cell - 8 });
      const on = i === sel && !solved;
      ctx.strokeStyle = on ? "#fff4d6" : "rgba(243,227,181,0.15)";
      ctx.lineWidth = on ? 1.5 : 1;
      ctx.strokeRect(x + 0.5, y + 0.5, cell - 8, cell - 8);
      drawGlyph(ctx, i, x + (cell - 8) / 2, y + (cell - 8) / 2, (cell - 8) * 0.55, on ? "#fff4d6" : "#a8987a");
    }
    if (solved) text(ctx, "SEQUENCE ACCEPTED", p.cx, py + cell * 2 + 24, { size: 11, spacing: 4, color: "#fff4d6", align: "center" });
  };

  return state;
}
