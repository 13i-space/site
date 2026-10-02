// "Lyra assists" in the three core games (NEMESIS Command, Asteroid Belt,
// 13i vs NEMESIS). One switch, remembered in this browser, shared by all
// three (13i vs NEMESIS is a standalone page and reads the same key).
// What she destroys or damages earns no points: she helps you last, the
// score stays yours. See docs/LYRA-ASSIST.md.

export const ASSIST_KEY = "13i_lyra_assist";

export function loadAssist() {
  try { return localStorage.getItem(ASSIST_KEY) === "1"; } catch (e) { return false; }
}
export function saveAssist(on) {
  try { localStorage.setItem(ASSIST_KEY, on ? "1" : "0"); } catch (e) { /* ignore */ }
}

// Lyra, small, drawn on a game canvas: glow, ring, eye (her Listening /
// Tuning-in look). `flash` (0-1) brightens her as she fires.
export function drawLyra(ctx, x, y, r, t, flash = 0) {
  ctx.save();
  const bob = Math.sin(t * 3) * r * 0.12;
  ctx.translate(x, y + bob);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.2);
  g.addColorStop(0, `rgba(139,149,246,${0.35 + 0.4 * flash})`);
  g.addColorStop(1, "rgba(139,149,246,0)");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#0C0E28";
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#B9C0FF";
  ctx.lineWidth = Math.max(1, r * 0.12);
  ctx.setLineDash([r * 0.15, r * 0.35]);
  ctx.lineDashOffset = -t * r * 2;
  ctx.beginPath(); ctx.arc(0, 0, r * 1.25, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = flash > 0.3 ? "#FFFFFF" : "#DCDFFF";
  ctx.beginPath(); ctx.arc(0, 0, r * 0.26 * (1 + flash * 0.4), 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
