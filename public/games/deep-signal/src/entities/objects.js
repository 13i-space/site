// How each interactive object looks, what it's called, and how it glows.

import { drawSymbol } from "../ui/symbol.js";
import { drawGlyph } from "../puzzles/glyphs.js";

export const NAMES = {
  relay: "TRANSMISSION RELAY",
  energy: "ENERGY NODE",
  artifact: "ALIEN ARTIFACT",
  marker: "DEEP WALKER MARKER",
  glyph: "GLYPH STONE",
  terminal: "UNKNOWN DEVICE",
  wterminal: "WARDEN TERMINAL",
  anomaly: "ANOMALY",
  trace: "13i TRACE",
  gate: "RESONANCE GATE",
  node: "13i NODE",
};

export const VERBS = {
  relay: "INTERACT", energy: "INTERACT", artifact: "INTERACT", marker: "SCAN", glyph: "SCAN",
  terminal: "INTERACT", wterminal: "INTERACT", anomaly: "SCAN", trace: "SCAN", gate: "CONNECT", node: "CONNECT",
};

export function isInteractive(o) {
  if (!NAMES[o.type] || o.hidden || o.gone) return false;
  if (o.type === "energy") return o.charge > 0;
  if (o.type === "relay") return o.state !== "connected";
  if (o.type === "artifact") return o.state !== "taken";
  if (o.type === "terminal") return !o.solved;
  if (["marker", "trace", "anomaly", "glyph"].includes(o.type)) return o.state !== "read";
  if (o.type === "wterminal") return o.state !== "connected";
  return true;
}

// Light each object gives off: [radius, strength] in world units
export function objectLight(o, run, t) {
  if (o.hidden || o.gone) return null;
  switch (o.type) {
    case "energy": return o.charge > 0 ? [70 + Math.sin(t * 2 + o.id) * 6, 0.55] : null;
    case "relay": return o.state === "connected" ? [170, 0.8] : o.state === "scanned" ? [90, 0.5] : [45, 0.3];
    case "lamp": return o.on ? [150, 0.75] : null;
    case "terminal": return o.solved ? [110, 0.6] : [40, 0.3];
    case "wterminal": return [60 + Math.sin(t * 0.8) * 10, 0.4];
    case "gate": return [90 + (run.stats.signal >= 50 ? 50 + Math.sin(t * 2) * 12 : 0), 0.6];
    case "node": return [320, 0.9];
    case "anomaly": return [50 + Math.sin(t * 3) * 15, 0.35];
    default: return null;
  }
}

export function drawObject(ctx, o, run, t) {
  if (o.hidden || o.gone) return;
  ctx.save();
  ctx.translate(o.x, o.y);
  const gold = "#f3e3b5", bright = "#fff4d6", dim = "#a8987a", gray = "#4a4a52";
  ctx.lineWidth = 1.5;
  switch (o.type) {
    case "energy": {
      const on = o.charge > 0;
      ctx.strokeStyle = on ? gold : gray;
      ctx.fillStyle = on ? "rgba(255,244,214,0.18)" : "rgba(74,74,82,0.2)";
      [[-7, 4, 16], [0, -2, 22], [8, 5, 14]].forEach(([x, y, hgt]) => {
        ctx.beginPath();
        ctx.moveTo(x, y - hgt); ctx.lineTo(x + 5, y - hgt * 0.4); ctx.lineTo(x + 3, y + 6); ctx.lineTo(x - 3, y + 6); ctx.lineTo(x - 5, y - hgt * 0.4);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      });
      if (on) {
        ctx.fillStyle = bright;
        ctx.beginPath(); ctx.arc(0, -4, 2.5 + Math.sin(t * 3) * 0.8, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }
    case "relay": {
      const lvl = o.state === "connected" ? 1 : o.state === "scanned" ? 0.6 : 0.3;
      ctx.strokeStyle = `rgba(243,227,181,${0.4 + lvl * 0.6})`;
      ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.stroke();
      ctx.save();
      ctx.rotate(t * (0.2 + lvl * 0.8));
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(0, 30); ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = lvl === 1 ? bright : dim;
      ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case "artifact": {
      if (o.state === "taken") break;
      ctx.rotate(Math.PI / 4 + Math.sin(t + o.id) * 0.05);
      ctx.strokeStyle = gold;
      ctx.strokeRect(-7, -7, 14, 14);
      ctx.beginPath(); ctx.moveTo(-7, -7); ctx.lineTo(7, 7); ctx.stroke();
      ctx.fillStyle = "rgba(255,244,214,0.2)";
      ctx.fillRect(-7, -7, 14, 14);
      break;
    }
    case "marker": {
      ctx.fillStyle = "#1c1c20";
      ctx.strokeStyle = o.state === "read" ? dim : gold;
      ctx.beginPath();
      ctx.moveTo(-6, 14); ctx.lineTo(-4, -18); ctx.lineTo(4, -22); ctx.lineTo(6, 14); ctx.closePath();
      ctx.fill(); ctx.stroke();
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-3, -12 + i * 6); ctx.lineTo(3, -13 + i * 6); ctx.stroke(); }
      break;
    }
    case "glyph": {
      ctx.fillStyle = "#18181c";
      ctx.fillRect(-14, -14, 28, 28);
      ctx.strokeStyle = dim;
      ctx.strokeRect(-14.5, -14.5, 29, 29);
      drawGlyph(ctx, o.glyph, 0, -2, 16, gold, 1, 1.4);
      for (let i = 0; i < o.order; i++) {
        ctx.fillStyle = gold;
        ctx.beginPath(); ctx.arc(-6 + i * 4, 10, 1.2, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }
    case "terminal": {
      ctx.fillStyle = "#18181c";
      ctx.fillRect(-10, -4, 20, 16);
      ctx.strokeStyle = o.solved ? bright : gold;
      ctx.strokeRect(-10.5, -4.5, 21, 17);
      ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(9, -9); ctx.lineTo(0, 0); ctx.lineTo(-9, -9); ctx.closePath();
      ctx.fillStyle = o.solved ? "rgba(255,244,214,0.6)" : `rgba(243,227,181,${0.15 + 0.1 * Math.sin(t * 2)})`;
      ctx.fill(); ctx.stroke();
      break;
    }
    case "wterminal": {
      ctx.strokeStyle = "#f4f1ea";
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.3 + i * 0.25;
        ctx.beginPath(); ctx.ellipse(0, 0, 26 - i * 7, (26 - i * 7) * 0.45, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#f4f1ea";
      ctx.beginPath(); ctx.arc(Math.sin(t * 0.7) * 4, 0, 3, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case "anomaly": {
      ctx.strokeStyle = gold;
      for (let i = 0; i < 4; i++) {
        ctx.globalAlpha = 0.5 - i * 0.1;
        ctx.beginPath();
        ctx.ellipse(0, 0, 10 + i * 9 + Math.sin(t * 2 + i) * 3, 6 + i * 6, t * (0.3 + i * 0.1), 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case "trace":
      drawSymbol(ctx, 0, 0, 30, { alpha: 0.55, color: gold });
      break;
    case "gate": {
      const open = run.stats.signal >= 50;
      ctx.strokeStyle = open ? bright : dim;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, 46 + (open ? Math.sin(t * 2) * 3 : 0), 0, Math.PI * 2); ctx.stroke();
      drawSymbol(ctx, 0, 0, 34, { alpha: open ? 1 : 0.4, glow: open ? 12 : 0 });
      break;
    }
    case "node": {
      ctx.strokeStyle = bright;
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.2 + i * 0.2;
        ctx.beginPath(); ctx.arc(0, 0, 70 - i * 18 + Math.sin(t * 1.5 + i) * 3, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      drawSymbol(ctx, 0, 0, 64, { glow: 20, color: bright });
      break;
    }
    case "lamp": {
      ctx.fillStyle = "#1c1c20";
      ctx.fillRect(-4, -14, 8, 22);
      ctx.fillStyle = o.on ? bright : gray;
      ctx.fillRect(-3, -14, 6, 4);
      break;
    }
    case "vent-site": {
      ctx.strokeStyle = "rgba(124,124,132,0.5)";
      ctx.beginPath();
      ctx.moveTo(-14, -4); ctx.lineTo(-4, 0); ctx.lineTo(3, -6); ctx.lineTo(14, 2);
      ctx.moveTo(-4, 0); ctx.lineTo(-2, 9);
      ctx.stroke();
      break;
    }
    default:
      break;
  }
  ctx.restore();
}
