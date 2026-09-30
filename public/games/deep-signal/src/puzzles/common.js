// Shared puzzle chrome: a centered instrument panel with a title and hints.

import { text } from "../ui/text.js";

export function panel(ctx, w, h, title, hint) {
  ctx.fillStyle = "rgba(3,3,3,0.9)";
  ctx.fillRect(0, 0, w, h);
  const pw = Math.min(620, w - 32), ph = Math.min(520, h - 32);
  const x = (w - pw) / 2, y = (h - ph) / 2;
  ctx.fillStyle = "rgba(12,12,14,0.96)";
  ctx.fillRect(x, y, pw, ph);
  ctx.strokeStyle = "rgba(243,227,181,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, pw - 1, ph - 1);
  // corner ticks - instrumentation, not decoration
  ctx.strokeStyle = "rgba(243,227,181,0.7)";
  [[x, y, 1, 1], [x + pw, y, -1, 1], [x, y + ph, 1, -1], [x + pw, y + ph, -1, -1]].forEach(([cx, cy, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(cx + sx * 14, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * 14);
    ctx.stroke();
  });
  text(ctx, title, x + 22, y + 32, { size: 11, spacing: 4, color: "#f3e3b5" });
  text(ctx, "ESC  LEAVE", x + pw - 22, y + 32, { size: 9, spacing: 2, color: "#7c7c84", align: "right" });
  if (hint) {
    // one line if it fits, otherwise one control per line
    ctx.save();
    ctx.font = "9px 'JetBrains Mono', monospace";
    if ("letterSpacing" in ctx) ctx.letterSpacing = "2px";
    const fits = ctx.measureText(hint).width < pw - 30;
    ctx.restore();
    const parts = fits ? [hint] : hint.split(/\s{3,}/);
    parts.forEach((part, i) => text(ctx, part, x + pw / 2, y + ph - 20 - (parts.length - 1 - i) * 15, { size: 9, spacing: 2, color: "#7c7c84", align: "center" }));
  }
  return { x, y, pw, ph, cx: x + pw / 2, cy: y + ph / 2 - 10 };
}
