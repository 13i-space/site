// The 13i symbol (the ring-eye mark), isolated in one place.
//
// Geometry is taken from the site's own mark (app/icon.svg: a stem, a ring,
// a dot), not redesigned. To use real artwork instead, put the image in
// public/games/deep-signal/assets/ and set SYMBOL_ASSET in config.js - if
// it fails to load, the geometry keeps being drawn.

import { SYMBOL_ASSET } from "../config.js";

let image = null;
if (SYMBOL_ASSET) {
  try {
    const img = new Image();
    img.onload = () => { image = img; };
    img.onerror = () => { image = null; };
    img.src = new URL(`../../${SYMBOL_ASSET}`, import.meta.url).href;
  } catch (e) {
    image = null;
  }
}

// Draw centered on (x, y); `size` is the full height of the mark.
export function drawSymbol(ctx, x, y, size, { color = "#f3e3b5", alpha = 1, glow = 0, progress = 1 } = {}) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (image) {
    const w = size * (image.width / image.height);
    ctx.drawImage(image, x - w / 2, y - size / 2, w, size);
    ctx.restore();
    return;
  }
  // icon.svg viewBox is 32 units; the mark spans y 4.1 -> 26 (~22 units)
  const s = size / 22;
  const ox = x - 16 * s, oy = y - 15 * s;
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = glow;
  }
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  // ring
  ctx.lineWidth = 2.2 * s;
  ctx.beginPath();
  ctx.arc(ox + 16 * s, oy + 8.5 * s, 4.4 * s, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, progress * 1.5));
  ctx.stroke();
  // stem
  if (progress > 0.4) {
    const p = Math.min(1, (progress - 0.4) / 0.4);
    ctx.lineWidth = 2.6 * s;
    ctx.beginPath();
    ctx.moveTo(ox + 16 * s, oy + 15 * s);
    ctx.lineTo(ox + 16 * s, oy + (15 + 11 * p) * s);
    ctx.stroke();
  }
  // dot
  if (progress > 0.8) {
    ctx.globalAlpha *= Math.min(1, (progress - 0.8) / 0.2);
    ctx.beginPath();
    ctx.arc(ox + 16 * s, oy + 8.5 * s, 1.6 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
