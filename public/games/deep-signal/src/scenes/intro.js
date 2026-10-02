// The introduction: short, black, a faint transmission. No story told.

import { text } from "../ui/text.js";
import { INTRO_LINES } from "../lore/lore.js";
import { randomSeed } from "../core/rng.js";

const LINE_GAP = 2.2; // seconds between lines

export function introScene(game) {
  let t = 0;
  let shown = 0;
  game.audio.ambient(0.18, 2);

  const begin = () => game.switchTo("play", { seed: randomSeed() });

  return {
    update(dt) {
      t += dt;
      const due = Math.min(INTRO_LINES.length, Math.floor(t / LINE_GAP) + 1);
      if (due > shown) {
        shown = due;
        game.audio.transmission();
      }
      const ready = shown >= INTRO_LINES.length && t > LINE_GAP * INTRO_LINES.length;
      const input = game.input;
      if (input.take("confirm") || input.takeClick()) {
        if (ready) begin();
        else t = LINE_GAP * INTRO_LINES.length + 0.01; // skip ahead
      }
      if (input.take("pause")) game.switchTo("title");
    },
    draw(ctx) {
      const { w, h } = game;
      ctx.fillStyle = "#020202";
      ctx.fillRect(0, 0, w, h);
      // static
      if (!game.settings().reducedEffects) {
        for (let i = 0; i < 60; i++) {
          ctx.fillStyle = `rgba(243,227,181,${Math.random() * 0.05})`;
          ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        }
      }
      const startY = h / 2 - (INTRO_LINES.length * 34) / 2 - 80;
      for (let i = 0; i < shown; i++) {
        const age = t - i * LINE_GAP;
        const a = Math.min(1, age / 0.8);
        const flicker = age < 0.6 && !game.settings().reducedEffects ? (Math.random() < 0.3 ? 0.3 : 1) : 1;
        const s = INTRO_LINES[i];
        const visible = s.slice(0, Math.floor(Math.min(1, age / 0.9) * s.length));
        text(ctx, visible, w / 2, startY + i * 34, { size: Math.min(15, w * 0.03), spacing: w < 500 ? 1 : 3, color: i === 2 ? "#fff4d6" : "#f3e3b5", align: "center", alpha: a * flicker, glow: i === 2 ? 10 : 0 });
      }
      if (t > LINE_GAP * INTRO_LINES.length) {
        const since = t - LINE_GAP * INTRO_LINES.length;
        // the point of it all, before the dark
        const goal = [
          ["YOUR ASSIGNMENT", "#7c7c84"],
          ["1  EXPLORE AND SCAN. EVERY RELAY, MARKER AND RELIC STRENGTHENS THE SIGNAL.", "#f3e3b5"],
          ["2  AT 50% SIGNAL, FIND THE RESONANCE GATE AND FOLLOW IT.", "#f3e3b5"],
          ["3  REACH THE 13i NODE. THE STRONGER YOUR SIGNAL, THE MORE YOU WILL UNDERSTAND.", "#f3e3b5"],
          ["SOMETHING HERE IS WATCHING. IF ITS AWARENESS REACHES 100, THE RUN ENDS.", "#a8987a"],
        ];
        const gy = startY + INTRO_LINES.length * 34 + 30;
        goal.forEach(([line, color], i) => text(ctx, line, w / 2, gy + i * 22, { size: Math.min(11, w * 0.018), spacing: w < 700 ? 0.5 : 2, color, align: "center", alpha: Math.min(1, Math.max(0, since * 1.5 - i * 0.3)) }));
        const a = 0.5 + 0.5 * Math.sin(since * 2.5);
        text(ctx, "[ ENTER ]  BEGIN", w / 2, gy + goal.length * 22 + 26, { size: 12, spacing: 4, color: "#f3e3b5", align: "center", alpha: 0.4 + a * 0.6 });
      }
    },
  };
}
