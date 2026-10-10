// Volume for the Rave's figures (Update 5.69). The first Rave drew limbs as
// flat tapered lines; these give them form: a light coming from the upper
// left, a coloured rim light from the stage on the far side, a muscle
// profile, elbows, sleeves and cuffs, and hands with palms and jointed
// fingers. shade() does the same for any filled shape (heads, robes).
import { TAU, lerp, clamp, tube, radial, linear } from "./draw";

const LX = -0.45, LY = -0.89; // where the key light comes from
const bump = (s, c, w) => Math.exp(-((s - c) / w) * ((s - c) / w));

// centre line of a limb: a soft curve (bend), or two segments through an
// elbow, rounded less the stiffer it is (stiff 0..1: 1 is a robot's elbow)
function limbPath(from, to, o, N) {
  const pts = [];
  if (o.elbow) {
    const e = o.elbow;
    const r = lerp(0.5, 0.1, clamp(o.stiff || 0, 0, 1));
    const a = [lerp(e[0], from[0], r), lerp(e[1], from[1], r)];
    const b = [lerp(e[0], to[0], r), lerp(e[1], to[1], r)];
    const nA = Math.round(N * 0.4), nC = Math.round(N * 0.2), nB = N - nA - nC;
    for (let k = 0; k < nA; k++) { const s = k / nA; pts.push([lerp(from[0], a[0], s), lerp(from[1], a[1], s)]); }
    for (let k = 0; k < nC; k++) { const s = k / nC, is = 1 - s; pts.push([is * is * a[0] + 2 * is * s * e[0] + s * s * b[0], is * is * a[1] + 2 * is * s * e[1] + s * s * b[1]]); }
    for (let k = 0; k <= nB; k++) { const s = k / nB; pts.push([lerp(b[0], to[0], s), lerp(b[1], to[1], s)]); }
    return pts;
  }
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, bend = o.bend || 0;
  const c1 = [from[0] + dx * 0.3 + nx * L * 0.4 * bend, from[1] + dy * 0.3 + ny * L * 0.4 * bend];
  const c2 = [from[0] + dx * 0.72 + nx * L * 0.2 * bend, from[1] + dy * 0.72 + ny * L * 0.2 * bend];
  for (let k = 0; k <= N; k++) {
    const s = k / N, is = 1 - s;
    pts.push([
      is * is * is * from[0] + 3 * is * is * s * c1[0] + 3 * is * s * s * c2[0] + s * s * s * to[0],
      is * is * is * from[1] + 3 * is * is * s * c1[1] + 3 * is * s * s * c2[1] + s * s * s * to[1],
    ]);
  }
  return pts;
}

// the polygon between two offsets (-1..1 across the width, +1 = lit side)
function strip(ctx, pts, ns, ws, f0, f1, k0 = 0, k1 = pts.length - 1) {
  ctx.beginPath();
  for (let k = k0; k <= k1; k++) { const w = ws[k] / 2; const x = pts[k][0] + ns[k][0] * w * f0, y = pts[k][1] + ns[k][1] * w * f0; k === k0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  for (let k = k1; k >= k0; k--) { const w = ws[k] / 2; ctx.lineTo(pts[k][0] + ns[k][0] * w * f1, pts[k][1] + ns[k][1] * w * f1); }
  ctx.closePath();
}
function edge(ctx, pts, ns, ws, f, k0 = 0, k1 = pts.length - 1) {
  ctx.beginPath();
  for (let k = k0; k <= k1; k++) { const w = ws[k] / 2; const x = pts[k][0] + ns[k][0] * w * f, y = pts[k][1] + ns[k][1] * w * f; k === k0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
}

// A limb with form. o: { bend | elbow+stiff, w0, w1, col: {lite, mid, dark, line},
//   rim (colour), bulge 0..1 (muscle), bands: [s...] (rings), bandCol,
//   sleeve: { to: 0..1, w: width factor, col: {lite, mid, dark}, trim }, suckers }
// Returns { pts, ns, ws, tip angle } so callers can add details.
export function arm3d(ctx, from, to, o) {
  const N = o.N || 22;
  const pts = limbPath(from, to, o, N);
  const n = pts.length - 1;
  const ns = [], ws = [];
  // which side faces the light (judged once, so the shading doesn't flip mid-limb)
  const tx0 = to[0] - from[0], ty0 = to[1] - from[1];
  const side = (-ty0 * LX + tx0 * LY) >= 0 ? 1 : -1;
  const bulge = o.bulge ?? 0.5;
  for (let k = 0; k <= n; k++) {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(n, k + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    ns.push([-ty * side, tx * side]);
    const s = k / n;
    ws.push(lerp(o.w0, o.w1, s) * (1 + bulge * (0.24 * bump(s, 0.24, 0.16) + 0.16 * bump(s, 0.7, 0.14) - 0.1 * bump(s, 0.5, 0.07) - 0.08 * bump(s, 0.93, 0.06))));
  }
  const c = o.col;
  // base (the shadowed body of the limb)
  strip(ctx, pts, ns, ws, -1, 1); ctx.fillStyle = c.dark; ctx.fill();
  // the turned form: mid tone toward the light, a highlight ridge
  strip(ctx, pts, ns, ws, -0.3, 0.95); ctx.fillStyle = c.mid; ctx.fill();
  strip(ctx, pts, ns, ws, 0.3, 0.72); ctx.fillStyle = c.lite; ctx.globalAlpha = 0.75; ctx.fill(); ctx.globalAlpha = 1;
  // rim light from the stage on the shadow edge
  if (o.rim) { edge(ctx, pts, ns, ws, -0.86); ctx.strokeStyle = o.rim; ctx.lineWidth = Math.max(0.15, o.w1 * 0.22); ctx.lineCap = "round"; ctx.stroke(); }
  // crisp outline
  strip(ctx, pts, ns, ws, -1, 1); ctx.strokeStyle = c.line || "rgba(0,0,0,0.5)"; ctx.lineWidth = Math.max(0.12, o.w1 * 0.12); ctx.lineJoin = "round"; ctx.stroke();
  // elbow / knuckle crease and the muscle line
  if (o.joint !== false && !o.suckers) {
    const k = Math.round(n * 0.5);
    ctx.strokeStyle = c.line || "rgba(0,0,0,0.45)"; ctx.lineWidth = Math.max(0.1, ws[k] * 0.06); ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(pts[k][0] - ns[k][0] * ws[k] * 0.35, pts[k][1] - ns[k][1] * ws[k] * 0.35); ctx.quadraticCurveTo(pts[k + 1][0], pts[k + 1][1], pts[k][0] + ns[k][0] * ws[k] * 0.1, pts[k][1] + ns[k][1] * ws[k] * 0.1); ctx.stroke();
    edge(ctx, pts, ns, ws, -0.45, Math.round(n * 0.1), Math.round(n * 0.38)); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // suckers along the underside of a tentacle
  if (o.suckers) {
    for (let k = Math.round(n * 0.35); k < n - 1; k += 2) {
      const w = ws[k] / 2, x = pts[k][0] - ns[k][0] * w * 0.55, y = pts[k][1] - ns[k][1] * w * 0.55, r = w * 0.38;
      ctx.fillStyle = o.suckers; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.fillStyle = c.dark; ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    }
  }
  // rings / bands (bioluminescent stripes, bracelets)
  if (o.bands) {
    o.bands.forEach((s, i) => {
      const k = Math.round(n * s), w = ws[k] / 2;
      ctx.strokeStyle = Array.isArray(o.bandCol) ? o.bandCol[i % o.bandCol.length] : o.bandCol || c.lite; ctx.lineWidth = Math.max(0.12, ws[k] * 0.14);
      ctx.beginPath(); ctx.moveTo(pts[k][0] - ns[k][0] * w, pts[k][1] - ns[k][1] * w);
      ctx.quadraticCurveTo(pts[k][0] + (pts[Math.min(n, k + 1)][0] - pts[k][0]) * 0.8, pts[k][1] + (pts[Math.min(n, k + 1)][1] - pts[k][1]) * 0.8, pts[k][0] + ns[k][0] * w, pts[k][1] + ns[k][1] * w); ctx.stroke();
    });
  }
  // a sleeve over the top of the arm
  if (o.sleeve) {
    const sv = o.sleeve, kEnd = Math.max(2, Math.round(n * sv.to));
    const sws = ws.map((w, k) => w * (sv.w || 1.6) * (1 + 0.45 * (k / kEnd)));
    strip(ctx, pts, ns, sws, -1, 1, 0, kEnd); ctx.fillStyle = sv.col.dark; ctx.fill();
    strip(ctx, pts, ns, sws, -0.25, 0.92, 0, kEnd); ctx.fillStyle = sv.col.mid; ctx.fill();
    strip(ctx, pts, ns, sws, 0.35, 0.68, 0, kEnd); ctx.fillStyle = sv.col.lite; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1;
    // folds
    ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = Math.max(0.1, sws[0] * 0.05);
    for (let f = 1; f <= 2; f++) { const k = Math.round(kEnd * (f / 3)); const w = sws[k] / 2; ctx.beginPath(); ctx.moveTo(pts[k][0] - ns[k][0] * w * 0.9, pts[k][1] - ns[k][1] * w * 0.9); ctx.lineTo(pts[k][0] + ns[k][0] * w * 0.4, pts[k][1] + ns[k][1] * w * 0.4); ctx.stroke(); }
    if (o.rim) { edge(ctx, pts, ns, sws, -0.9, 0, kEnd); ctx.strokeStyle = o.rim; ctx.lineWidth = Math.max(0.15, sws[kEnd] * 0.08); ctx.stroke(); }
    strip(ctx, pts, ns, sws, -1, 1, 0, kEnd); ctx.strokeStyle = "rgba(0,0,0,0.55)"; ctx.lineWidth = Math.max(0.12, sws[kEnd] * 0.05); ctx.stroke();
    // the cuff
    if (sv.trim) {
      const w = sws[kEnd] / 2;
      ctx.strokeStyle = sv.trim; ctx.lineWidth = Math.max(0.2, sws[kEnd] * 0.16); ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(pts[kEnd][0] - ns[kEnd][0] * w, pts[kEnd][1] - ns[kEnd][1] * w); ctx.lineTo(pts[kEnd][0] + ns[kEnd][0] * w, pts[kEnd][1] + ns[kEnd][1] * w); ctx.stroke();
      ctx.strokeStyle = "rgba(255,248,220,0.7)"; ctx.lineWidth = Math.max(0.08, sws[kEnd] * 0.05); ctx.stroke();
    }
  }
  const a = Math.atan2(to[1] - pts[n - 2][1], to[0] - pts[n - 2][0]);
  return { pts, ns, ws, angle: a, side };
}

// A hand: a palm and jointed, tapering fingers with lit tips.
// o: { n, len, w (finger width), palm (radius), spread, curl, col: {lite, mid, dark, line}, tip (glow colour or null), tipCol }
export function hand3d(ctx, at, a, o) {
  const n = o.n || 3, palm = o.palm || o.len * 0.35, spread = o.spread ?? 1, curl = o.curl ?? 0.3;
  const dx = Math.cos(a), dy = Math.sin(a), px = -dy, py = dx;
  const c = o.col;
  const pc = [at[0] + dx * palm * 0.5, at[1] + dy * palm * 0.5];
  // fingers first (the palm overlaps their roots)
  const tips = [];
  for (let f = 0; f < n; f++) {
    const k = n === 1 ? 0 : f / (n - 1) - 0.5;
    const b = a + k * spread;
    const root = [pc[0] + Math.cos(b) * palm * 0.75 + px * k * palm * 0.2, pc[1] + Math.sin(b) * palm * 0.75 + py * k * palm * 0.2];
    const L = o.len * (1 - Math.abs(k) * 0.25);
    const kn = [root[0] + Math.cos(b) * L * 0.5, root[1] + Math.sin(b) * L * 0.5];
    const b2 = b + curl * (k >= 0 ? 1 : -1) * 0.6 + curl * 0.3;
    const tip = [kn[0] + Math.cos(b2) * L * 0.5, kn[1] + Math.sin(b2) * L * 0.5];
    tube(ctx, root, [lerp(root[0], kn[0], 0.7), lerp(root[1], kn[1], 0.7)], [lerp(kn[0], tip[0], 0.3), lerp(kn[1], tip[1], 0.3)], tip, o.w, o.w * 0.55, c.mid, c.line);
    ctx.strokeStyle = c.lite; ctx.globalAlpha = 0.6; ctx.lineWidth = o.w * 0.22; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(root[0] + px * o.w * 0.15, root[1] + py * o.w * 0.15); ctx.lineTo(kn[0] + px * o.w * 0.15, kn[1] + py * o.w * 0.15); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = c.dark; ctx.beginPath(); ctx.arc(kn[0], kn[1], o.w * 0.32, 0, TAU); ctx.fill();
    ctx.fillStyle = o.tipCol || c.lite; ctx.beginPath(); ctx.arc(tip[0], tip[1], o.w * 0.34, 0, TAU); ctx.fill();
    tips.push(tip);
  }
  ctx.fillStyle = radial(ctx, pc[0], pc[1], palm * 1.2, [[0, c.lite], [0.55, c.mid], [1, c.dark]], pc[0] + LX * palm * 0.5, pc[1] + LY * palm * 0.5);
  ctx.beginPath(); ctx.ellipse(pc[0], pc[1], palm, palm * 0.8, a, 0, TAU); ctx.fill();
  ctx.strokeStyle = c.line || "rgba(0,0,0,0.5)"; ctx.lineWidth = o.w * 0.15; ctx.stroke();
  return tips;
}

// Volume for a filled shape: shadow falling away from the light, a rim
// light on the far edge in the stage's colour, and a soft highlight.
// box: [x, y, w, h] around the shape.
export function shade(ctx, path, box, o = {}) {
  const [x, y, w, h] = box;
  ctx.save();
  ctx.clip(path);
  ctx.fillStyle = linear(ctx, x + w * 0.2, y + h * 0.1, x + w, y + h, [[0, "rgba(0,0,0,0)"], [0.45, "rgba(0,0,0,0)"], [1, `rgba(4,2,16,${o.shadow ?? 0.5})`]]);
  ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  if (o.ao) { // darkening at the bottom (where it meets what's below)
    ctx.fillStyle = linear(ctx, 0, y + h * (1 - o.ao), 0, y + h, [[0, "rgba(0,0,0,0)"], [1, "rgba(4,2,16,0.45)"]]);
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  }
  if (o.rim) {
    const g = linear(ctx, x, y, x + w, y + h * 0.3, [[0, "rgba(0,0,0,0)"], [0.6, "rgba(0,0,0,0)"], [1, o.rim]]);
    ctx.strokeStyle = g; ctx.lineWidth = (o.rimW || Math.min(w, h) * 0.08) * 2; ctx.stroke(path);
  }
  if (o.spec !== false) {
    const sx = x + w * (o.sx ?? 0.3), sy = y + h * (o.sy ?? 0.2), sr = Math.min(w, h) * (o.sr ?? 0.4);
    ctx.fillStyle = radial(ctx, sx, sy, sr, [[0, `rgba(255,255,255,${o.spec ?? 0.22})`], [1, "rgba(255,255,255,0)"]]);
    ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
  }
  ctx.restore();
  if (o.line) { ctx.strokeStyle = o.line; ctx.lineWidth = o.lineW || Math.min(w, h) * 0.012; ctx.lineJoin = "round"; ctx.stroke(path); }
}

// a strip of gold trim along a path, with a bright edge (for robes)
export function trim(ctx, path, w, col = "#C9A85E") {
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(40,24,6,0.6)"; ctx.lineWidth = w * 1.35; ctx.stroke(path);
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(path);
  ctx.strokeStyle = "rgba(255,244,200,0.75)"; ctx.lineWidth = w * 0.28; ctx.stroke(path);
}
