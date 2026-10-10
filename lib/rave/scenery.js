// Scenery with depth (Update 5.69): the speaker stacks as real cabinets
// (front, side and top faces, receding toward the middle of the stage) with
// subwoofers that visibly punch on the kick, and the ringed planet with
// banded clouds, a ring system that turns (inner rings faster, the way real
// rings do), the ring's shadow, and two little moons.
import { TAU, lerp, clamp, glow, radial, linear, hsl, hash } from "./draw";

const PI = Math.PI;
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);

// ─────────── speakers ───────────
// a woofer: basket, rubber surround, cone and dust cap; push 0..1 moves it out
function woofer(ctx, x, y, r, push, m, hue) {
  ctx.fillStyle = linear(ctx, x - r, y - r, x + r, y + r, [[0, "#3A3A4E"], [1, "#0E0E16"]]);
  ctx.beginPath(); ctx.arc(x, y, r * 1.08, 0, TAU); ctx.fill();
  for (let k = 0; k < 4; k++) { const a = k * (PI / 2) + PI / 4; ctx.fillStyle = "#7A7A90"; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * 0.98, y + Math.sin(a) * r * 0.98, r * 0.05, 0, TAU); ctx.fill(); }
  // surround: lit from above, stretched by the push
  ctx.fillStyle = radial(ctx, x, y - r * 0.2, r, [[0.7, "#1A1A24"], [0.86, "#34344A"], [1, "#0A0A10"]]);
  ctx.beginPath(); ctx.arc(x, y, r * 0.95, 0, TAU); ctx.fill();
  const cr = r * (0.76 + push * 0.06);
  ctx.fillStyle = radial(ctx, x, y + push * r * 0.05, cr, [[0, "#2C2C3C"], [0.35, "#121218"], [0.85, "#1E1E2A"], [1, "#0A0A10"]], x - cr * 0.25, y - cr * 0.3 - push * r * 0.1);
  ctx.beginPath(); ctx.arc(x, y, cr, 0, TAU); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = r * 0.03;
  [0.6, 0.45].forEach((k) => { ctx.beginPath(); ctx.arc(x, y, cr * k, 0, TAU); ctx.stroke(); });
  // dust cap, catching the light as it pushes out
  const dc = r * (0.24 + push * 0.05);
  ctx.fillStyle = radial(ctx, x, y, dc, [[0, `rgba(255,255,255,${0.35 + push * 0.4})`], [0.5, "#4A4A60"], [1, "#16161E"]], x - dc * 0.3, y - dc * 0.4);
  ctx.beginPath(); ctx.arc(x, y, dc, 0, TAU); ctx.fill();
  ctx.strokeStyle = hsl(hue, 100, 62, 0.35 + push * 0.6); ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.arc(x, y, r * 0.98, 0, TAU); ctx.stroke();
}
export function drawSpeakers(ctx, L, m) {
  const xs = L.portrait ? [L.cx - 41, L.cx + 41] : [L.cx - 60, L.cx + 60];
  const w = L.portrait ? 12 : 14, hTop = L.portrait ? 10 : 11.5, hSub = L.portrait ? 12 : 13.5;
  const vp = [L.cx, L.floorTop - 46]; // where the edges recede to
  const d = dipOf(m);
  // the kick: a hard punch on each beat, scaled by the bass and how big the moment is
  const kick = clamp(Math.pow(d, 6) * (0.4 + m.bass * 0.9) * (0.4 + m.amp), 0, 1) * (m.on ? 1 : 0);
  xs.forEach((sx, n) => {
    const side = sx < L.cx ? 1 : -1; // which way the inside face points
    const shake = kick * 0.18 * (n ? -1 : 1);
    const box = (y0, h, front, hue) => {
      const x0 = sx - w / 2 + shake, x1 = sx + w / 2 + shake;
      const depth = 4.2;
      const off = (px, py) => { const dx = vp[0] - px, dy = vp[1] - py, l = Math.hypot(dx, dy); return [px + (dx / l) * depth, py + (dy / l) * depth]; };
      const ex = side > 0 ? x1 : x0;
      // inside face
      const a = off(ex, y0), b = off(ex, y0 + h);
      ctx.fillStyle = linear(ctx, ex, 0, a[0], 0, [[0, "#16152A"], [1, "#0A0A14"]]);
      ctx.beginPath(); ctx.moveTo(ex, y0); ctx.lineTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(ex, y0 + h); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#2E2C4A"; ctx.lineWidth = 0.2; ctx.stroke();
      // top face
      const t0 = off(x0, y0), t1 = off(x1, y0);
      ctx.fillStyle = "#22203A";
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(t0[0], t0[1]); ctx.lineTo(t1[0], t1[1]); ctx.lineTo(x1, y0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#3E3C62"; ctx.stroke();
      // front: cabinet with rounded edge highlight and a grille texture
      ctx.fillStyle = linear(ctx, x0, y0, x1, y0 + h, [[0, "#1A1930"], [1, "#0A0914"]]); ctx.fillRect(x0, y0, w, h);
      ctx.strokeStyle = "#3A3860"; ctx.lineWidth = 0.35; ctx.strokeRect(x0 + 0.2, y0 + 0.2, w - 0.4, h - 0.4);
      ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(x0, y0, w, 0.5);
      front(x0, x1, y0, h, hue);
      // corner protectors
      ctx.fillStyle = "#4A4A60"; [[x0, y0], [x1 - 1, y0], [x0, y0 + h - 1], [x1 - 1, y0 + h - 1]].forEach(([cx, cy]) => ctx.fillRect(cx, cy, 1, 1));
    };
    const ySub = L.floorTop - hSub, yTop = ySub - hTop - 0.4;
    // the top cabinet: a horn and a mid driver
    box(yTop, hTop, (x0, x1, y0, h, hue) => {
      const cx = (x0 + x1) / 2;
      ctx.fillStyle = linear(ctx, 0, y0 + 1, 0, y0 + 4.2, [[0, "#2A2A3E"], [1, "#05050A"]]);
      ctx.beginPath(); ctx.moveTo(x0 + 1.2, y0 + 1); ctx.lineTo(x1 - 1.2, y0 + 1); ctx.lineTo(cx + 1.4, y0 + 3.8); ctx.lineTo(cx - 1.4, y0 + 3.8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#020205"; ctx.fillRect(cx - 1.4, y0 + 3.4, 2.8, 0.5);
      glow(ctx, cx, y0 + 3.2, 3, hsl(hue, 100, 70, 0.8), m.high * 0.6);
      woofer(ctx, cx, y0 + h * 0.66, Math.min(w, h) * 0.3, kick * 0.5, m, hue);
    }, m.pal.b);
    // the subwoofer: one big driver that punches out on the kick
    box(ySub, hSub, (x0, x1, y0, h, hue) => {
      const cx = (x0 + x1) / 2, cy = y0 + h * 0.5, r = Math.min(w, h) * 0.4;
      woofer(ctx, cx, cy, r, kick, m, hue);
      // the shove of air: a ring thrown out on a big kick
      if (kick > 0.15) {
        ctx.strokeStyle = hsl(hue, 100, 70, kick * 0.35); ctx.lineWidth = 0.4;
        ctx.beginPath(); ctx.arc(cx, cy, r * (1.1 + (1 - d) * 1.5), 0, TAU); ctx.stroke();
      }
      // bass port slots
      ctx.fillStyle = "#020205"; ctx.fillRect(x0 + 1, y0 + h - 1.6, w * 0.32, 0.8); ctx.fillRect(x1 - 1 - w * 0.32, y0 + h - 1.6, w * 0.32, 0.8);
    }, m.pal.a);
    // its light on the floor
    ctx.save(); ctx.translate(sx, L.floorTop + 1.5); ctx.scale(1, 0.25);
    glow(ctx, 0, 0, 14, hsl(m.pal.a, 100, 60, 0.8), kick * 0.6);
    ctx.restore();
  });
}

// ─────────── the ringed planet ───────────
const BANDS = [
  [0.0, "#E8D6A8"], [0.1, "#D8C08A"], [0.2, "#C9A86C"], [0.32, "#E6D2A0"], [0.44, "#B89060"],
  [0.55, "#DCC694"], [0.66, "#C4A06A"], [0.78, "#D9C292"], [0.9, "#A88458"], [1, "#C8AE80"],
];
// ring bands: inner radius, outer radius (in planet radii), colour, opacity
const RINGS = [[1.22, 1.4, "#7A6A50", 0.35], [1.42, 1.78, "#D9C49A", 0.85], [1.78, 1.84, "#000", 0], [1.84, 2.08, "#C4AE80", 0.7], [2.12, 2.18, "#A08C68", 0.45], [2.2, 2.28, "#8A7A5E", 0.25]];
export function drawPlanet(ctx, x, y, r, m) {
  const tilt = -0.32, sq = 0.3;
  const t = m.t;
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
  const ringHalf = (back) => {
    ctx.save(); ctx.scale(1, sq);
    RINGS.forEach(([a, b, col, al]) => {
      if (!al) return;
      ctx.strokeStyle = col; ctx.globalAlpha = al * (back ? 0.8 : 1);
      ctx.lineWidth = (b - a) * r;
      ctx.beginPath(); ctx.arc(0, 0, ((a + b) / 2) * r, back ? PI : 0, back ? TAU : PI); ctx.stroke();
      // texture moving round: inner rings faster
      const speed = 6 / Math.pow((a + b) / 2, 1.5);
      ctx.setLineDash([r * 0.06, r * 0.025, r * 0.02, r * 0.045, r * 0.1, r * 0.03]);
      ctx.lineDashOffset = -t * speed;
      ctx.strokeStyle = "rgba(255,248,225,0.22)"; ctx.lineWidth = (b - a) * r * 0.5;
      ctx.beginPath(); ctx.arc(0, 0, ((a + b) / 2) * r - (b - a) * r * 0.15, back ? PI : 0, back ? TAU : PI); ctx.stroke();
      ctx.strokeStyle = "rgba(40,30,20,0.22)"; ctx.lineWidth = (b - a) * r * 0.3; ctx.lineDashOffset = -t * speed * 1.3 + r * 0.1;
      ctx.beginPath(); ctx.arc(0, 0, ((a + b) / 2) * r + (b - a) * r * 0.2, back ? PI : 0, back ? TAU : PI); ctx.stroke();
      ctx.setLineDash([]);
    });
    ctx.globalAlpha = 1;
    ctx.restore();
  };
  // moons on the ring plane: behind or in front of the planet as they go round
  const moons = [[2.7, 40, 0.09, "#C8C8D8"], [3.3, 70, 0.07, "#D8B898"]].map(([R, per, mr, col], i) => {
    const a = (t / per) * TAU + i * 2.1;
    return { x: Math.cos(a) * R * r, y: Math.sin(a) * R * r * sq, front: Math.sin(a) > 0, mr: mr * r, col };
  });
  const moon = (o) => {
    ctx.fillStyle = radial(ctx, o.x, o.y, o.mr, [[0, "#FFFFFF"], [0.4, o.col], [1, "#2A2A3A"]], o.x - o.mr * 0.4, o.y - o.mr * 0.4);
    ctx.beginPath(); ctx.arc(o.x, o.y, o.mr, 0, TAU); ctx.fill();
  };
  moons.filter((o) => !o.front).forEach(moon);
  ringHalf(true);
  // the planet
  const body = new Path2D(); body.arc(0, 0, r, 0, TAU);
  ctx.save(); ctx.clip(body);
  ctx.fillStyle = linear(ctx, 0, -r, 0, r, BANDS.map(([o, c]) => [o, c])); ctx.fillRect(-r, -r, r * 2, r * 2);
  // wavy band edges and streaks drifting with the planet's turn
  for (let k = 0; k < 9; k++) {
    const by = -r + (k + 0.5) * (2 * r / 9);
    ctx.strokeStyle = k % 2 ? "rgba(120,80,40,0.22)" : "rgba(255,240,210,0.22)"; ctx.lineWidth = r * 0.05;
    ctx.beginPath();
    for (let xx = -r; xx <= r; xx += r * 0.1) { const yy = by + Math.sin(xx / r * 6 + k * 1.3 + t * 0.15) * r * 0.025; xx === -r ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); }
    ctx.stroke();
  }
  // a storm drifting across
  const sx = ((t * 0.02 * r) % (r * 2.6)) - r * 1.3;
  ctx.fillStyle = "rgba(255,245,225,0.55)"; ctx.beginPath(); ctx.ellipse(sx, r * 0.36, r * 0.14, r * 0.06, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = "rgba(150,110,60,0.5)"; ctx.lineWidth = r * 0.015; ctx.stroke();
  // the ring's shadow across it
  ctx.save(); ctx.scale(1, sq);
  ctx.strokeStyle = "rgba(20,10,5,0.45)"; ctx.lineWidth = r * 0.3;
  ctx.beginPath(); ctx.arc(0, r * 0.28 / sq, r * 1.6, PI * 1.05, PI * 1.95); ctx.stroke();
  ctx.restore();
  // night side, and a thin bright limb from the sun
  ctx.fillStyle = radial(ctx, -r * 0.45, -r * 0.4, r * 1.9, [[0, "rgba(0,0,0,0)"], [0.45, "rgba(0,0,0,0)"], [0.75, "rgba(6,4,18,0.6)"], [1, "rgba(4,2,12,0.95)"]]);
  ctx.fillRect(-r, -r, r * 2, r * 2);
  ctx.restore();
  ctx.strokeStyle = "rgba(255,240,210,0.5)"; ctx.lineWidth = r * 0.03; ctx.beginPath(); ctx.arc(0, 0, r * 0.99, PI * 0.9, PI * 1.6); ctx.stroke();
  glow(ctx, 0, 0, r * 1.5, hsl(40, 60, 70, 0.4), 0.25);
  ringHalf(false);
  moons.filter((o) => o.front).forEach(moon);
  ctx.restore();
}

// ─────────── the alien city on the horizon ───────────
// Barely there, as it should be: far ridges with a natural arch, then a city
// of towers, domes, needle spires and bulb towers, windows flickering, beacons
// blinking on the beat, searchlights, and air traffic drifting across.
let CITY = null;
function cityFor(VW) {
  if (CITY && CITY.VW === VW) return CITY;
  const b = [];
  let x = -34, i = 0;
  while (x < VW + 34) {
    const r = hash(i, 41), w = 2 + hash(i, 42) * 4;
    const kind = r < 0.38 ? "tower" : r < 0.55 ? "dome" : r < 0.72 ? "spire" : r < 0.86 ? "bulb" : "step";
    const tall = hash(i, 43);
    const hgt = kind === "spire" ? 9 + tall * 9 : kind === "dome" ? 2.5 + tall * 3 : 3 + tall * tall * 11;
    b.push({ x, w, kind, h: hgt, seed: i });
    x += w + 0.4 + hash(i, 44) * 1.6; i++;
  }
  CITY = { VW, b };
  return CITY;
}
export function drawCity(ctx, L, m) {
  const hy = L.floorTop - 1.5;
  const t = m.t;
  // far ridges, with an arch of rock
  ctx.fillStyle = hsl(m.pal.a + 210, 30, 10, 0.9);
  ctx.beginPath(); ctx.moveTo(-40, hy);
  for (let x = -40; x <= L.VW + 40; x += 3) ctx.lineTo(x, hy - 7 - 5 * Math.abs(Math.sin(x * 0.045 + 1)) - 3 * hash(Math.floor(x / 3), 31));
  ctx.lineTo(L.VW + 40, hy + 4); ctx.lineTo(-40, hy + 4); ctx.closePath(); ctx.fill();
  const ax = L.cx - L.VW * 0.36;
  ctx.strokeStyle = hsl(m.pal.a + 210, 30, 10, 0.95); ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(ax - 9, hy - 6); ctx.bezierCurveTo(ax - 8, hy - 20, ax + 8, hy - 21, ax + 10, hy - 7); ctx.stroke();
  // haze along the horizon, lit by the show
  ctx.fillStyle = linear(ctx, 0, hy - 18, 0, hy, [[0, "rgba(0,0,0,0)"], [1, hsl(m.pal.b, 70, 40, 0.18 + m.level * 0.08)]]);
  ctx.fillRect(-40, hy - 18, L.VW + 80, 18);
  // searchlights from the city
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  [[L.cx - L.VW * 0.42, 0.13], [L.cx + L.VW * 0.4, 0.17]].forEach(([sx, sp], n) => {
    const a = -PI / 2 + Math.sin(t * sp + n * 2) * 0.55;
    const g = ctx.createLinearGradient(sx, hy - 8, sx + Math.cos(a) * 70, hy - 8 + Math.sin(a) * 70);
    g.addColorStop(0, hsl(n ? m.pal.b : m.pal.a, 60, 75, 0.12)); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(sx, hy - 8); ctx.lineTo(sx + Math.cos(a - 0.04) * 70, hy - 8 + Math.sin(a - 0.04) * 70); ctx.lineTo(sx + Math.cos(a + 0.04) * 70, hy - 8 + Math.sin(a + 0.04) * 70); ctx.closePath(); ctx.fill();
  });
  ctx.restore();
  // the city
  const { b } = cityFor(L.VW);
  const body = "#0A0818";
  b.forEach((o) => {
    const { x, w, h } = o, top = hy - h;
    ctx.fillStyle = body;
    if (o.kind === "tower") ctx.fillRect(x, top, w, h);
    else if (o.kind === "dome") { ctx.beginPath(); ctx.ellipse(x + w / 2, hy, w * 0.8, h, 0, PI, TAU); ctx.fill(); }
    else if (o.kind === "spire") { ctx.beginPath(); ctx.moveTo(x, hy); ctx.lineTo(x + w / 2 - 0.25, top + 2); ctx.lineTo(x + w / 2, top); ctx.lineTo(x + w / 2 + 0.25, top + 2); ctx.lineTo(x + w, hy); ctx.closePath(); ctx.fill(); }
    else if (o.kind === "bulb") { ctx.fillRect(x + w / 2 - 0.5, top + w * 0.6, 1, h - w * 0.6); ctx.beginPath(); ctx.arc(x + w / 2, top + w * 0.4, w * 0.55, 0, TAU); ctx.fill(); }
    else { ctx.fillRect(x, hy - h * 0.5, w, h * 0.5); ctx.fillRect(x + w * 0.2, hy - h * 0.8, w * 0.6, h * 0.3); ctx.fillRect(x + w * 0.38, top, w * 0.24, h * 0.2); }
    // windows, a few flickering
    if (o.kind === "tower" || o.kind === "step") {
      for (let wy = top + 1; wy < hy - 0.6; wy += 1.2) {
        for (let wx = x + 0.5; wx < x + w - 0.4; wx += 0.9) {
          const k = hash(o.seed, Math.round(wx * 10), Math.round(wy * 10));
          if (k > 0.3) continue;
          const flick = k < 0.03 ? (Math.sin(t * 3 + k * 99) > 0 ? 1 : 0.2) : 1;
          ctx.fillStyle = k < 0.15 ? `rgba(255,214,150,${0.35 * flick})` : hsl(m.pal.b, 80, 70, 0.3 * flick);
          ctx.fillRect(wx, wy, 0.35, 0.45);
        }
      }
    }
    if (o.kind === "dome") { ctx.strokeStyle = hsl(m.pal.a, 80, 65, 0.25); ctx.lineWidth = 0.15; ctx.beginPath(); ctx.ellipse(x + w / 2, hy, w * 0.6, h * 0.75, 0, PI, TAU); ctx.stroke(); }
    // beacons on the tall ones, blinking on the beat
    if (h > 9) {
      const by = o.kind === "bulb" ? top + w * 0.4 : top;
      const on = (Math.floor(m.B) + o.seed) % 4 === 0;
      ctx.fillStyle = on ? "rgba(255,80,90,0.9)" : "rgba(120,30,40,0.5)";
      ctx.beginPath(); ctx.arc(x + w / 2, by, 0.3, 0, TAU); ctx.fill();
      if (on) glow(ctx, x + w / 2, by, 1.8, "rgba(255,80,90,0.8)", 0.6);
    }
  });
  // air traffic: lights drifting across above the city
  for (let k = 0; k < 7; k++) {
    const sp = 2 + hash(k, 51) * 5, dir = k % 2 ? 1 : -1, span = L.VW + 80;
    const px = ((t * sp * dir + hash(k, 52) * span) % span + span) % span - 40;
    const py = hy - 12 - hash(k, 53) * 16;
    const col = k % 3 ? "rgba(255,240,220,0.75)" : hsl(m.pal.a, 100, 70, 0.8);
    ctx.fillStyle = col; ctx.fillRect(px, py, 0.4, 0.25);
    ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(px - dir * 3, py + 0.05, dir * 3, 0.12);
    if (Math.sin(t * 4 + k) > 0.6) glow(ctx, px, py, 1, "rgba(255,90,90,0.8)", 0.5);
  }
}
