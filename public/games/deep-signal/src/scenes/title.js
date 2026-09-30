// Title screen: slow atmosphere, the menu, and a line of lifetime stats.

import { text, menuList, hitIndex } from "../ui/text.js";
import { drawSymbol } from "../ui/symbol.js";
import { LORE } from "../lore/lore.js";

const ITEMS = ["BEGIN TRANSMISSION", "DISCOVERY LOG", "HOW TO PLAY", "SETTINGS", "CREDITS"];

export function titleScene(game) {
  let sel = 0;
  let t = 0;
  let rects = [];
  const dust = Array.from({ length: 70 }, () => ({
    x: Math.random(), y: Math.random(), s: Math.random() * 1.4 + 0.3, v: Math.random() * 0.006 + 0.002, a: Math.random() * 0.5 + 0.1,
  }));
  game.audio.ambient(0.5, 3);
  game.audio.setTension(0);

  const choose = (i) => {
    game.audio.start();
    game.audio.ui();
    if (i === 0) game.switchTo("intro");
    if (i === 1) game.overlays.open("log");
    if (i === 2) game.overlays.open("howto");
    if (i === 3) game.overlays.open("settings");
    if (i === 4) game.overlays.open("credits");
  };

  return {
    update(dt) {
      t += dt;
      const input = game.input;
      if (input.take("up")) { sel = (sel + ITEMS.length - 1) % ITEMS.length; game.audio.ui(); }
      if (input.take("down")) { sel = (sel + 1) % ITEMS.length; game.audio.ui(); }
      if (input.take("confirm") || input.take("interact") || input.take("scan")) choose(sel);
      const hover = hitIndex(rects, input.pointer.x, input.pointer.y);
      if (hover >= 0 && !input.touch.isTouchDevice) sel = hover;
      if (input.takeClick()) {
        const i = hitIndex(rects, input.pointer.x, input.pointer.y);
        if (i >= 0) choose(i);
      }
      if (input.take("log")) choose(1);
      dust.forEach((d) => { d.y -= d.v * dt; if (d.y < 0) { d.y = 1; d.x = Math.random(); } });
    },
    draw(ctx) {
      const { w, h } = game;
      const reduced = game.settings().reducedEffects;
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, w, h);

      // slow ring - an instrument, not a decoration
      const cx = w / 2, cy = h * 0.34;
      const R = Math.min(w, h) * 0.3;
      ctx.save();
      ctx.strokeStyle = "rgba(243,227,181,0.07)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, R * (0.7 + i * 0.18), 0, Math.PI * 2);
        ctx.stroke();
      }
      const sweep = reduced ? 0 : t * 0.25;
      ctx.strokeStyle = "rgba(243,227,181,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, R, sweep, sweep + 0.5);
      ctx.stroke();
      ctx.restore();

      dust.forEach((d) => {
        ctx.fillStyle = `rgba(243,227,181,${d.a * (reduced ? 0.5 : 0.6 + 0.4 * Math.sin(t + d.x * 20))})`;
        ctx.fillRect(d.x * w, d.y * h, d.s, d.s);
      });

      drawSymbol(ctx, cx, cy - R * 0.3, Math.min(64, h * 0.09), { alpha: 0.9, glow: reduced ? 0 : 18 });
      text(ctx, "13i", cx, cy + R * 0.42, { size: Math.min(58, w * 0.1), family: "'Fraunces', Georgia, serif", italic: true, color: "#fff4d6", align: "center", glow: reduced ? 0 : 14 });
      text(ctx, "THE DEEP SIGNAL", cx, cy + R * 0.42 + 36, { size: Math.min(15, w * 0.035), spacing: 8, color: "#f3e3b5", align: "center" });
      text(ctx, "A 13i Exploration Experience", cx, cy + R * 0.42 + 62, { size: 12, family: "'Fraunces', Georgia, serif", italic: true, color: "#7c7c84", align: "center" });

      rects = menuList(ctx, ITEMS, sel, cx, Math.max(cy + R * 0.42 + 120, h * 0.66), { size: 12, gap: Math.min(34, h * 0.055) });

      const d = game.save.data;
      const pct = Math.round((Object.keys(d.discovered).length / LORE.length) * 100);
      if (d.totalRuns > 0) {
        text(ctx, `RUNS ${d.totalRuns}   ·   HIGHEST SIGNAL ${d.highestSignal}%   ·   RECORDED ${pct}%`, cx, h - 22, { size: 9, spacing: 2, color: "#4a4a52", align: "center" });
      }
    },
  };
}
