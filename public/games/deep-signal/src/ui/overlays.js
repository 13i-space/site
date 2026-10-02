// Full-screen panels that sit over whatever scene is running:
// Discovery Log, Settings, How to Play, Credits.

import { text, wrap, menuList, hitIndex } from "./text.js";
import { CATEGORIES, LORE } from "../lore/lore.js";

function frame(ctx, w, h, title) {
  ctx.fillStyle = "rgba(3,3,3,0.94)";
  ctx.fillRect(0, 0, w, h);
  const m = Math.min(48, w * 0.05);
  ctx.strokeStyle = "rgba(243,227,181,0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(m + 0.5, m + 0.5, w - m * 2, h - m * 2);
  text(ctx, title, m + 24, m + 36, { size: 12, spacing: 4, color: "#f3e3b5" });
  text(ctx, "ESC  CLOSE", w - m - 24, m + 36, { size: 10, spacing: 2, color: "#7c7c84", align: "right" });
  return m;
}

export function createOverlays(game) {
  let current = null; // { name, state, onClose }

  const close = () => {
    const c = current;
    current = null;
    game.audio.ui();
    if (c && c.onClose) c.onClose();
  };

  const panels = {
    log: {
      init: (opts) => ({ cat: 0, entry: 0, run: opts.run || null }),
      update(s, input) {
        const entries = LORE.filter((l) => l.cat === CATEGORIES[s.cat]);
        if (input.take("left")) { s.cat = (s.cat + CATEGORIES.length - 1) % CATEGORIES.length; s.entry = 0; game.audio.ui(); }
        if (input.take("right")) { s.cat = (s.cat + 1) % CATEGORIES.length; s.entry = 0; game.audio.ui(); }
        if (input.take("up")) { s.entry = Math.max(0, s.entry - 1); game.audio.ui(); }
        if (input.take("down")) { s.entry = Math.min(entries.length - 1, s.entry + 1); game.audio.ui(); }
        if (input.takeClick()) {
          const p = input.pointer;
          const ci = hitIndex(s.catRects || [], p.x, p.y);
          if (ci >= 0) { s.cat = ci; s.entry = 0; }
          const ei = hitIndex(s.entryRects || [], p.x, p.y);
          if (ei >= 0) s.entry = s.entryIdx[ei];
        }
        if (input.take("pause") || input.take("log")) close();
      },
      draw(s, ctx, w, h) {
        const m = frame(ctx, w, h, "DISCOVERY LOG");
        const found = LORE.filter((l) => game.save.isDiscovered(l.id)).length;
        const narrow = w < 700;
        text(ctx, `${Math.round((found / LORE.length) * 100)}% RECORDED`, narrow ? m + 24 : w / 2, narrow ? m + 56 : m + 36, { size: 10, spacing: 2, color: "#7c7c84", align: narrow ? "left" : "center" });
        const left = m + 24, top = narrow ? m + 88 : m + 70;
        // categories
        s.catRects = [];
        CATEGORIES.forEach((c, i) => {
          const y = narrow ? top : top + i * 26;
          const x = narrow ? left + i * ((w - m * 2 - 48) / CATEGORIES.length) : left;
          const on = i === s.cat;
          const label = narrow ? c.slice(0, 4) : c;
          text(ctx, label, x, y, { size: narrow ? 9 : 11, spacing: 2, color: on ? "#fff4d6" : "#7c7c84", glow: on ? 8 : 0 });
          s.catRects.push({ x: x - 6, y: y - 16, w: narrow ? 60 : 170, h: 24 });
        });
        // entries
        const entries = LORE.filter((l) => l.cat === CATEGORIES[s.cat]);
        const ex = narrow ? left : left + 200, ey = narrow ? top + 34 : top;
        // a scrolling window of entries around the selection
        const rows = Math.max(3, narrow ? Math.floor((h * 0.38) / 22) : Math.floor((h - m - 60 - ey) / 22));
        const offset = Math.max(0, Math.min(entries.length - rows, s.entry - Math.floor(rows / 2)));
        const shown = entries.slice(offset, offset + rows);
        s.entryRects = [];
        s.entryIdx = [];
        shown.forEach((l, k) => {
          const i = offset + k;
          const known = game.save.isDiscovered(l.id);
          const thisRun = s.run && s.run.has(l.id);
          const on = i === s.entry;
          text(ctx, known ? l.title : "— — —", ex, ey + k * 22, { size: 11, color: on ? "#fff4d6" : known ? "#b8b0a0" : "#3a3a40" });
          if (thisRun) text(ctx, "•", ex - 12, ey + k * 22, { size: 11, color: "#f3e3b5" });
          s.entryRects.push({ x: ex - 6, y: ey + k * 22 - 15, w: 220, h: 20 });
          s.entryIdx.push(i);
        });
        if (offset > 0) text(ctx, "▲", ex + 200, ey, { size: 8, color: "#4a4a52" });
        if (offset + rows < entries.length) text(ctx, "▼", ex + 200, ey + (shown.length - 1) * 22, { size: 8, color: "#4a4a52" });
        // selected entry
        const sel = entries[s.entry];
        if (sel) {
          const tx = narrow ? left : ex + 250, tw = narrow ? w - m * 2 - 48 : w - m - 24 - tx;
          const ty = narrow ? ey + shown.length * 22 + 26 : ey;
          if (game.save.isDiscovered(sel.id)) {
            text(ctx, sel.title.toUpperCase(), tx, ty, { size: 12, spacing: 2, color: "#f3e3b5" });
            wrap(ctx, sel.text, tw, 13, { family: "'Fraunces', Georgia, serif", italic: true }).forEach((line, i) => {
              text(ctx, line, tx, ty + 30 + i * 21, { size: 13, color: "#d8d2c4", family: "'Fraunces', Georgia, serif", italic: true });
            });
          } else {
            text(ctx, "NOT YET RECORDED.", tx, ty, { size: 11, spacing: 2, color: "#4a4a52" });
          }
        }
        text(ctx, "ARROWS  BROWSE        • FOUND THIS RUN", left, h - m - 18, { size: 9, spacing: 2, color: "#4a4a52" });
      },
    },

    settings: {
      init: () => ({ sel: 0, confirmReset: false }),
      items() {
        const s = game.settings();
        return [
          `VOLUME  ${"■".repeat(Math.round(s.volume * 10))}${"□".repeat(10 - Math.round(s.volume * 10))}`,
          `SOUND  ${s.muted ? "OFF" : "ON"}`,
          `REDUCED EFFECTS  ${s.reducedEffects ? "ON" : "OFF"}`,
          `HIGH CONTRAST  ${s.highContrast ? "ON" : "OFF"}`,
          "RESET LOCAL DATA",
          "BACK",
        ];
      },
      update(s, input) {
        const n = 6;
        if (input.take("up")) { s.sel = (s.sel + n - 1) % n; s.confirmReset = false; game.audio.ui(); }
        if (input.take("down")) { s.sel = (s.sel + 1) % n; s.confirmReset = false; game.audio.ui(); }
        const st = game.settings();
        const change = (dir) => {
          if (s.sel === 0) game.save.setSetting("volume", Math.max(0, Math.min(1, Math.round((st.volume + dir * 0.1) * 10) / 10)));
          if (s.sel === 1) game.save.setSetting("muted", !st.muted);
          if (s.sel === 2) game.save.setSetting("reducedEffects", !st.reducedEffects);
          if (s.sel === 3) game.save.setSetting("highContrast", !st.highContrast);
          game.applySettings();
          game.audio.ui();
        };
        if (input.take("left")) change(-1);
        if (input.take("right")) change(1);
        let activate = input.take("confirm") || input.take("interact");
        if (input.takeClick()) {
          const i = hitIndex(s.rects || [], input.pointer.x, input.pointer.y);
          if (i >= 0) { s.sel = i; activate = true; }
        }
        if (activate) {
          // Enter on VOLUME steps it up, wrapping from full back to silent
          if (s.sel === 0 && st.volume >= 1) { game.save.setSetting("volume", 0); game.applySettings(); }
          else if (s.sel <= 3) change(s.sel === 0 ? 1 : 0);
          if (s.sel === 4) {
            if (s.confirmReset) { game.save.reset(); s.confirmReset = false; s.didReset = 2.5; }
            else s.confirmReset = true;
          }
          if (s.sel === 5) close();
        }
        if (s.didReset) s.didReset = Math.max(0, s.didReset - 1 / 60);
        if (input.take("pause")) close();
      },
      draw(s, ctx, w, h) {
        frame(ctx, w, h, "SETTINGS");
        const items = panels.settings.items();
        if (s.confirmReset) items[4] = "PRESS AGAIN TO ERASE ALL PROGRESS";
        if (s.didReset) items[4] = "LOCAL DATA RESET";
        s.rects = menuList(ctx, items, s.sel, w / 2, h / 2 - 90, { size: 13, gap: 38 });
        text(ctx, "ARROWS  ADJUST      ENTER  SELECT", w / 2, h - 90, { size: 9, spacing: 2, color: "#4a4a52", align: "center" });
      },
    },

    howto: {
      init: () => ({}),
      update(s, input) {
        if (input.take("pause") || input.take("confirm") || input.takeClick()) close();
      },
      draw(s, ctx, w, h) {
        const m = frame(ctx, w, h, "HOW TO PLAY");
        const rows = [
          ["WASD / ARROWS", "MOVE"],
          ["SPACE", "SCAN"],
          ["E", "INTERACT"],
          ["SHIFT", "PULSE"],
          ["M", "MAP"],
          ["TAB", "DISCOVERY LOG"],
          ["ESC", "PAUSE"],
        ];
        const cx = w / 2;
        let y = m + 100;
        rows.forEach(([k, v]) => {
          text(ctx, k, cx - 20, y, { size: 12, spacing: 2, color: "#f3e3b5", align: "right" });
          text(ctx, v, cx + 20, y, { size: 12, spacing: 2, color: "#b8b0a0" });
          y += 30;
        });
        y += 20;
        [
          "THE GOAL: raise the SIGNAL to 50%, find the Resonance Gate, follow it to the 13i Node.",
          "Follow the signal. Scanning reveals what the dark hides.",
          "ENERGY powers the scan. INTEGRITY is your craft.",
          "SIGNAL is what you have understood. AWARENESS is what has noticed you.",
          "Fields that flash and show a ! are about to discharge. Move clear.",
          "Some choices are safer than others. You will learn which.",
        ].forEach((line) => {
          wrap(ctx, line, Math.min(560, w - 120), 13, { family: "'Fraunces', Georgia, serif", italic: true }).forEach((l) => {
            text(ctx, l, cx, y, { size: 13, color: "#d8d2c4", family: "'Fraunces', Georgia, serif", italic: true, align: "center" });
            y += 22;
          });
          y += 6;
        });
        if (game.input.touch.isTouchDevice) {
          text(ctx, "DESKTOP CONTROLS RECOMMENDED", cx, h - m - 30, { size: 10, spacing: 2, color: "#7c7c84", align: "center" });
        }
      },
    },

    credits: {
      init: () => ({}),
      update(s, input) {
        if (input.take("pause") || input.take("confirm") || input.takeClick()) close();
      },
      draw(s, ctx, w, h) {
        frame(ctx, w, h, "CREDITS");
        const cx = w / 2;
        text(ctx, "13i", cx, h / 2 - 90, { size: 34, family: "'Fraunces', Georgia, serif", italic: true, color: "#fff4d6", align: "center" });
        text(ctx, "THE DEEP SIGNAL", cx, h / 2 - 56, { size: 12, spacing: 6, color: "#f3e3b5", align: "center" });
        [
          "A 13i EXPLORATION EXPERIENCE",
          "",
          "THE 13i UNIVERSE  —  PAUL DONAGHY",
          "THE DEEP WALKERS  —  ASSIGNMENT 0000087",
          "",
          "ALL SOUND AND IMAGE SYNTHESIZED IN THE BROWSER",
          "13i.space",
        ].forEach((l, i) => text(ctx, l, cx, h / 2 - 10 + i * 24, { size: 10, spacing: 2, color: "#7c7c84", align: "center" }));
      },
    },
  };

  return {
    get active() { return !!current; },
    get name() { return current && current.name; },
    open(name, opts = {}) {
      current = { name, state: panels[name].init(opts), onClose: opts.onClose };
      game.audio.ui();
    },
    update() {
      if (!current) return;
      panels[current.name].update(current.state, game.input);
    },
    draw(ctx) {
      if (!current) return;
      panels[current.name].draw(current.state, ctx, game.w, game.h);
    },
  };
}
