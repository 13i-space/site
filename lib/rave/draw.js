// Small drawing helpers shared by the Rave's dancers and stage (Update 5.68).
export const TAU = Math.PI * 2;
export const lerp = (a, b, k) => a + (b - a) * k;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const smooth = (a, b, v) => { const k = clamp((v - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
export const hsl = (h, s, l, a = 1) => `hsla(${((h % 360) + 360) % 360},${s}%,${l}%,${a})`;

// blend two poses (numbers, arrays and objects of numbers) by k
export function mix(a, b, k) {
  if (k >= 1 || a === undefined) return b;
  if (typeof b === "number") return typeof a === "number" ? a + (b - a) * k : b;
  if (Array.isArray(b)) return b.map((v, i) => mix(a && a[i], v, k));
  if (b && typeof b === "object") { const o = {}; for (const key in b) o[key] = mix(a && a[key], b[key], k); return o; }
  return k < 0.5 ? a : b;
}

// a deterministic "random" number 0-1 from a few integers
export function hash(...n) {
  let h = 2166136261;
  for (const v of n) { h ^= (v | 0) + 0x9e3779b9; h = Math.imul(h, 16777619); h ^= h >>> 13; }
  return ((h >>> 0) % 100000) / 100000;
}

// Cached Path2D from SVG path data (the dancers were first drawn as SVG)
const paths = new Map();
export function P(d) {
  let p = paths.get(d);
  if (!p) { p = new Path2D(d); paths.set(d, p); }
  return p;
}

// a tapered tube along a cubic curve; returns its centre points
export function tube(ctx, p0, c1, c2, p1, w0, w1, fill, edge, N = 16) {
  const pts = [], left = [], right = [];
  for (let k = 0; k <= N; k++) {
    const s = k / N, is = 1 - s;
    pts.push([
      is * is * is * p0[0] + 3 * is * is * s * c1[0] + 3 * is * s * s * c2[0] + s * s * s * p1[0],
      is * is * is * p0[1] + 3 * is * is * s * c1[1] + 3 * is * s * s * c2[1] + s * s * s * p1[1],
    ]);
  }
  pts.forEach((p, k) => {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(N, k + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const w = lerp(w0, w1, k / N) / 2;
    left.push([p[0] - ty * w, p[1] + tx * w]);
    right.push([p[0] + ty * w, p[1] - tx * w]);
  });
  ctx.beginPath();
  left.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  for (let k = N; k >= 0; k--) ctx.lineTo(right[k][0], right[k][1]);
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = Math.max(0.3, w1 * 0.25); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(p1[0], p1[1], w1 / 2, 0, TAU); ctx.fill();
  return { pts, left, right };
}

// a limb from a shoulder to a hand, bent to one side (bend -1..1)
export function limb(ctx, from, to, bend, w0, w1, fill, edge) {
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  const c1 = [from[0] + dx * 0.3 + nx * L * 0.4 * bend, from[1] + dy * 0.3 + ny * L * 0.4 * bend];
  const c2 = [from[0] + dx * 0.72 + nx * L * 0.2 * bend, from[1] + dy * 0.72 + ny * L * 0.2 * bend];
  return tube(ctx, from, c1, c2, to, w0, w1, fill, edge);
}

// fingers fanning out of a hand, pointing along angle a
export function fingers(ctx, at, a, n, len, spread, color, w) {
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round";
  for (let f = 0; f < n; f++) {
    const k = n === 1 ? 0 : f / (n - 1) - 0.5;
    const b = a + k * spread;
    ctx.beginPath(); ctx.moveTo(at[0], at[1]);
    ctx.quadraticCurveTo(at[0] + Math.cos(b) * len * 0.6, at[1] + Math.sin(b) * len * 0.6, at[0] + Math.cos(b + k * 0.5) * len, at[1] + Math.sin(b + k * 0.5) * len);
    ctx.stroke();
  }
}

// a soft additive glow
export function glow(ctx, x, y, r, color, alpha = 1) {
  if (r <= 0 || alpha <= 0.01) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, "rgba(0,0,0,0)");
  const op = ctx.globalCompositeOperation, ga = ctx.globalAlpha;
  ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = ga * alpha;
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.globalCompositeOperation = op; ctx.globalAlpha = ga;
}

export function radial(ctx, x, y, r, stops, fx, fy) {
  const g = ctx.createRadialGradient(fx ?? x, fy ?? y, 0, x, y, r);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}
export function linear(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}
