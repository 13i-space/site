// The real 13i "i" (Update 5.70): cut from the logo (public/13i-logo.png) into
// public/rave/13i-i.webp, so the Rave uses the actual brand mark rather than a
// drawing of it. EYE is where its glowing core sits in the image.
import { TAU, glow, hsl } from "./draw";

export const I_SRC = "/rave/13i-i.webp";
export const I_RATIO = 300 / 649; // width / height
export const EYE = { x: 0.5, y: 0.245 };
let img = null;
export function iImage() {
  if (typeof window === "undefined") return null;
  if (!img) { img = new Image(); img.src = I_SRC; }
  return img.complete && img.naturalWidth ? img : null;
}

// the i, h tall, its core at (ex, ey); rings ripple out of the core like the
// logo on the launch page, a ring thrown on each beat
export function drawI(ctx, ex, ey, h, m, o = {}) {
  const im = iImage();
  const w = h * I_RATIO;
  const x = ex - w * EYE.x, y = ey - h * EYE.y;
  const core = o.core ?? 1;
  const d = 0.5 + 0.5 * Math.cos(m.ph * TAU);
  if (o.rings) {
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (let j = 0; j < 4; j++) {
      const k = (((m.B + j * 0.5) % 2) + 2) % 2 / 2;
      const r = h * 0.07 + k * h * (o.ringReach || 0.9);
      ctx.strokeStyle = o.ringColor ? o.ringColor(1 - k) : `rgba(170,215,255,${(1 - k) * 0.7})`;
      ctx.lineWidth = h * 0.012 * (1 - k * 0.5);
      ctx.beginPath(); ctx.arc(ex, ey, r, 0, TAU); ctx.stroke();
    }
    ctx.restore();
  }
  if (o.rays) {
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (let k = 0; k < 12; k++) {
      const a = k * (TAU / 12) + m.t * 0.25;
      const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, h * 0.9);
      g.addColorStop(0, o.rayColor || "rgba(140,190,255,0.22)"); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.arc(ex, ey, h * 0.9, a - 0.07, a + 0.07); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  if (im) {
    ctx.save();
    if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    if (o.additive) ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(im, x, y, w, h);
    ctx.restore();
  }
  if (core > 0) {
    const pulse = 0.55 + 0.45 * d * (0.5 + (m.bass || 0));
    glow(ctx, ex, ey, h * 0.22 * (0.8 + pulse * 0.5), "rgba(120,175,255,0.95)", core * (0.5 + pulse * 0.5));
    glow(ctx, ex, ey, h * 0.07, "rgba(235,245,255,1)", core * pulse);
    // the little star flare in the core
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = core * pulse * 0.9;
    ctx.strokeStyle = "rgba(220,235,255,0.9)"; ctx.lineWidth = h * 0.006;
    const f = h * 0.12 * (0.7 + pulse * 0.6);
    ctx.beginPath(); ctx.moveTo(ex - f, ey); ctx.lineTo(ex + f, ey); ctx.moveTo(ex, ey - f * 0.7); ctx.lineTo(ex, ey + f * 0.7); ctx.stroke();
    ctx.restore();
  }
  return im != null;
}
