// Hidden developer mode. Press ` (backquote) three times quickly during a
// run to toggle it. Invisible to normal players.

import { text } from "./ui/text.js";
import { trigger } from "./systems/warden.js";

const KEYS = [
  ["R", "reveal map"],
  ["G", "regenerate map"],
  ["1 / 2", "signal +10 / -10"],
  ["3", "energy full"],
  ["4", "integrity full"],
  ["5 / 6", "awareness +10 / -10"],
  ["T", "trigger a warden event"],
  ["P", "solve open puzzle"],
  ["N", "go to the gate"],
  ["7 8 9 0", "end: signal / connection / warden / terminated"],
  ["F", "fps"],
];

export function createDebug(game, run, api, { regenerate, end }) {
  let on = false;
  let presses = [];
  let showFps = false;

  const onKey = (e) => {
    if (!on) return;
    const s = run.stats;
    switch (e.code) {
      case "KeyR": run.debugReveal = !run.debugReveal; break;
      case "KeyG": regenerate(); break;
      case "Digit1": api.addSignal(10); break;
      case "Digit2": s.signal = Math.max(0, s.signal - 10); break;
      case "Digit3": s.energy = 100; break;
      case "Digit4": s.integrity = 100; break;
      case "Digit5": api.addAwareness(10); break;
      case "Digit6": api.addAwareness(-10); break;
      case "KeyT": api.msg(`WARDEN EVENT: ${trigger(run.warden, run, api) || "none available"}`); break;
      case "KeyP": if (run.puzzle) run.puzzle.p.result = "solved"; break;
      case "KeyN": {
        const g = run.world.gateRoom.objects.find((o) => o.type === "gate");
        run.player.x = g.x; run.player.y = g.y + 60; run.player.vx = run.player.vy = 0;
        break;
      }
      case "Digit7": end("signal"); break;
      case "Digit8": end("connection"); break;
      case "Digit9": end("warden"); break;
      case "Digit0": end("terminated"); break;
      case "KeyF": showFps = !showFps; break;
      default: return;
    }
    e.stopPropagation();
  };
  window.addEventListener("keydown", onKey, true);

  return {
    update() {
      if (game.input.take("debug")) {
        const now = performance.now();
        presses = presses.filter((p) => now - p < 1500);
        presses.push(now);
        if (presses.length >= 3) { on = !on; presses = []; }
      }
      return false;
    },
    draw(ctx) {
      if (showFps) text(ctx, `${game.fps} FPS`, game.w / 2, 16, { size: 9, color: "#7c7c84", align: "center" });
      if (!on) return;
      const x = 16, y = game.h / 2 - 120;
      ctx.fillStyle = "rgba(3,3,3,0.85)";
      ctx.fillRect(x - 8, y - 22, 250, KEYS.length * 15 + 60);
      text(ctx, `DEBUG · SEED ${run.seedText}`, x, y - 6, { size: 9, color: "#fff4d6" });
      text(ctx, `warden ${run.warden.state}  rooms ${run.roomsExplored}`, x, y + 8, { size: 8, color: "#a8987a" });
      KEYS.forEach(([k, v], i) => text(ctx, `${k.padEnd(8)} ${v}`, x, y + 26 + i * 15, { size: 8, color: "#7c7c84" }));
    },
    dispose() { window.removeEventListener("keydown", onKey, true); },
  };
}
