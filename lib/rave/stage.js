// The Rave's world (Update 5.68): an open-air rave on a platform at the edge
// of space. A ringed planet and aurora overhead, a light rig and lasers, an
// LED wall, the DJ at the decks, a dance floor that lights up in patterns,
// fog, and a crowd of alien silhouettes with glowsticks. Everything moves to
// the beat (m.B) and to the sound itself (m.level, m.bass, m.high).
import { TAU, lerp, clamp, smooth, hash, limb, tube, fingers, glow, radial, linear, hsl } from "./draw";
import { drawI } from "./glyph";

const PI = Math.PI;
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);

// where everything goes, for a landscape screen or a phone held upright
export function layout(W, H) {
  const portrait = W / H < 1.15;
  const DW = portrait ? 100 : 160, DH = portrait ? 150 : 100;
  const u = Math.min(W / DW, H / DH);
  // upright phones keep the stage low, with the sky above it
  const VW = W / u, VH = H / u, cx = VW / 2, top = portrait ? VH - DH : (VH - DH) / 2;
  if (!portrait) {
    return {
      portrait, u, VW, VH, cx, top,
      wall: { x: cx - 46, y: top + 7, w: 92, h: 37 },
      booth: { x: cx, y: top + 65 - 1 - 30 * 0.3, s: 0.3 },
      floorTop: top + 65,
      planet: { x: cx + 66, y: top + 17, r: 11.5 },
      dancers: { varrow: [cx - 60, top + 95, 41], qeth: [cx - 27, top + 92, 42], ilu: [cx + 27, top + 89, 34], ixxen: [cx + 61, top + 95, 44] },
      truss: top + 2,
      girl: [cx, top + 94, 30],
    };
  }
  return {
    portrait, u, VW, VH, cx, top,
    wall: { x: cx - 44, y: top + 8, w: 88, h: 33 },
    booth: { x: cx, y: top + 69 - 1 - 30 * 0.28, s: 0.28 },
    floorTop: top + 69,
    planet: { x: VW * 0.72, y: Math.max(20, top * 0.42), r: Math.min(15, Math.max(10, top * 0.16)) },
    dancers: { qeth: [cx - 24, top + 103, 31], ilu: [cx + 24, top + 99, 26], varrow: [cx - 22, top + 143, 37], ixxen: [cx + 25, top + 143, 39] },
    truss: top + 1,
    girl: [cx, top + 121, 29],
  };
}

// ─────────── sky ───────────
const STARS = Array.from({ length: 180 }, (_, i) => [hash(i, 1), hash(i, 2), hash(i, 3)]);
export function drawSky(ctx, L, m) {
  const { VW, VH } = L;
  ctx.fillStyle = linear(ctx, 0, 0, 0, VH, [[0, "#04020C"], [0.5, hsl(m.pal.a + 200, 45, 7)], [1, "#0B0618"]]);
  ctx.fillRect(-30, -30, VW + 60, VH + 60);
  // nebula clouds drifting, tinted by the show
  [[0.18, 0.22, 0.42, m.pal.a], [0.8, 0.3, 0.38, m.pal.b], [0.5, 0.05, 0.5, m.pal.a + 40]].forEach(([x, y, r, h], i) => {
    const px = VW * x + Math.sin(m.t * 0.03 + i * 2) * 6, py = VH * y + Math.cos(m.t * 0.025 + i) * 4;
    glow(ctx, px, py, Math.max(VW, VH) * r, hsl(h, 70, 35, 0.55), 0.35 + m.level * 0.25);
  });
  // stars, some twinkling on the hats
  STARS.forEach(([x, y, z], i) => {
    const a = 0.25 + z * 0.6 + (i % 7 === 0 ? m.high * 0.5 : 0) * Math.sin(m.t * 3 + i);
    ctx.fillStyle = `rgba(220,225,255,${clamp(a, 0, 1)})`;
    const s = z > 0.92 ? 0.5 : 0.25;
    ctx.fillRect(x * VW, y * VH * 0.75, s, s);
  });
  // aurora ribbons, pulled by the sound
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let r = 0; r < 3; r++) {
    const baseY = (L.portrait ? Math.max(10, L.top * 0.75) : L.top + 10) + r * 5;
    const hue = r % 2 ? m.pal.b : m.pal.a;
    ctx.beginPath();
    for (let x = -30; x <= VW + 30; x += 2) {
      const y = baseY + Math.sin(x * 0.05 + m.t * 0.4 + r) * 3 + Math.sin(x * 0.13 - m.t * 0.7 + r * 2) * 1.5 * (1 + m.bass);
      x > -30 ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = hsl(hue, 90, 60, 0.08 + m.level * 0.12); ctx.lineWidth = 6 + m.bass * 4; ctx.stroke();
    ctx.strokeStyle = hsl(hue, 90, 75, 0.12 + m.level * 0.15); ctx.lineWidth = 0.8; ctx.stroke();
  }
  ctx.restore();
}

// ─────────── the LED wall ───────────
// ─────────── the light rig ───────────
export function drawTruss(ctx, L, m) {
  const y = L.truss;
  ctx.strokeStyle = "#1E1C36"; ctx.lineWidth = 0.5;
  ctx.strokeRect(-30, y, L.VW + 60, 2.6);
  ctx.beginPath();
  for (let x = -30; x < L.VW + 30; x += 2.6) { ctx.moveTo(x, y); ctx.lineTo(x + 2.6, y + 2.6); ctx.moveTo(x + 2.6, y); ctx.lineTo(x, y + 2.6); }
  ctx.lineWidth = 0.2; ctx.stroke();
  // towers at the sides of the stage
  [L.cx - (L.portrait ? 47 : 72), L.cx + (L.portrait ? 47 : 72)].forEach((tx) => {
    ctx.strokeStyle = "#1E1C36"; ctx.lineWidth = 0.5; ctx.strokeRect(tx - 1.3, y, 2.6, L.floorTop - y);
    ctx.lineWidth = 0.2; ctx.beginPath();
    for (let yy = y; yy < L.floorTop; yy += 2.6) { ctx.moveTo(tx - 1.3, yy); ctx.lineTo(tx + 1.3, yy + 2.6); }
    ctx.stroke();
  });
}

// moving heads: cones of light sweeping the floor
export function drawSpots(ctx, L, m, intensity) {
  const n = L.portrait ? 5 : 7;
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < n; i++) {
    const x = lerp(L.cx - L.wall.w * 0.75, L.cx + L.wall.w * 0.75, i / (n - 1));
    const y = L.truss + 2.6;
    const pat = Math.floor(m.B / 16) % 3;
    const sweep = pat === 0 ? Math.sin(m.B * PI * 0.25 + i * 0.7) * 0.5 : pat === 1 ? (i % 2 ? 1 : -1) * Math.sin(m.B * PI * 0.5) * 0.45 : (i - (n - 1) / 2) * 0.12 * Math.cos(m.B * PI * 0.25);
    const ang = PI / 2 + sweep;
    const len = (L.floorTop - y) + 40;
    const spread = 0.13;
    const hue = i % 2 ? m.pal.a : m.pal.b;
    const a = intensity * (0.12 + 0.18 * (m.build > 0 ? 1 : dipOf(m) * m.amp));
    const tx = x + Math.cos(ang) * len, ty = y + Math.sin(ang) * len;
    const g = ctx.createLinearGradient(x, y, tx, ty);
    g.addColorStop(0, hsl(hue, 100, 75, a * 1.6)); g.addColorStop(1, hsl(hue, 100, 60, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(ang - spread) * len, y + Math.sin(ang - spread) * len);
    ctx.lineTo(x + Math.cos(ang + spread) * len, y + Math.sin(ang + spread) * len);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = hsl(hue, 100, 85, 0.9); ctx.beginPath(); ctx.arc(x, y + 0.6, 0.9, 0, TAU); ctx.fill();
    glow(ctx, x, y + 0.6, 4, hsl(hue, 100, 70, 0.9), 0.5 + a * 2);
    // where it lands on the floor
    const fy = clamp(ty, L.floorTop + 4, L.VH);
    const fx = x + Math.cos(ang) * ((fy - y) / Math.sin(ang));
    ctx.save(); ctx.translate(fx, fy); ctx.scale(1, 0.3);
    glow(ctx, 0, 0, 10, hsl(hue, 100, 60, 0.7), a * 2.5);
    ctx.restore();
  }
  ctx.restore();
}

// lasers: fans, sweeps and crossings, only when the music is up
export function drawLasers(ctx, L, m, intensity) {
  if (intensity < 0.05) return;
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  const pat = Math.floor(m.B / 16 + (m.drop > 0 ? 7 : 0)) % 4;
  const sources = L.portrait
    ? [[L.cx - 40, L.floorTop - 4], [L.cx + 40, L.floorTop - 4], [L.cx, L.booth.y - 2]]
    : [[L.cx - 70, L.floorTop - 6], [L.cx + 70, L.floorTop - 6], [L.cx - 22, L.booth.y - 1], [L.cx + 22, L.booth.y - 1]];
  const len = Math.hypot(L.VW, L.VH);
  sources.forEach(([sx, sy], si) => {
    const side = sx < L.cx ? 1 : sx > L.cx ? -1 : 0;
    const beams = si >= 2 ? 3 : 5;
    for (let b = 0; b < beams; b++) {
      let a;
      const k = b / (beams - 1) - 0.5;
      if (pat === 0) a = -PI / 2 + side * 0.5 + k * 1.1 * (0.7 + 0.3 * dipOf(m)); // fan, breathing
      else if (pat === 1) a = -PI / 2 + Math.sin(m.B * PI * 0.25 + si) * 0.9 + k * 0.25; // sweeping
      else if (pat === 2) a = -PI / 2 + side * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(m.B * PI * 0.5))) + k * 0.5; // scissoring
      else a = -PI / 2 + side * 0.9 + k * 0.6 + Math.sin(m.B * PI) * 0.1; // over the crowd
      if (si >= 2 && pat === 3) a = side * 0.1 + (si === 2 ? PI - 0.15 : 0.15) + k * 0.4 + 0.12; // low, flat across the floor
      const hue = (si + b) % 2 ? m.pal.a : m.pal.b;
      const flick = (Math.floor(m.B * 2) + b) % 2 === 0 || pat !== 2 ? 1 : 0.4;
      const al = intensity * flick;
      const ex = sx + Math.cos(a) * len, ey = sy + Math.sin(a) * len;
      ctx.strokeStyle = hsl(hue, 100, 60, 0.08 * al); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.strokeStyle = hsl(hue, 100, 80, 0.45 * al); ctx.lineWidth = 0.2; ctx.stroke();
    }
    glow(ctx, sx, sy, 3.5, hsl(si % 2 ? m.pal.a : m.pal.b, 100, 75, 0.9), intensity);
  });
  ctx.restore();
}

// ─────────── the dance floor ───────────
export function drawFloor(ctx, L, m) {
  const y0 = L.floorTop, y1 = L.VH;
  const vx = L.cx, vy = y0 - 60;
  ctx.fillStyle = linear(ctx, 0, y0, 0, y1, [[0, "#0B0920"], [1, "#05040C"]]);
  ctx.fillRect(-30, y0, L.VW + 60, y1 - y0 + 30);
  // rows, closer together toward the back
  const rows = [];
  for (let r = 0; r <= 10; r++) rows.push(y0 + Math.pow(r / 10, 1.7) * (y1 - y0 + 10));
  const cols = 16;
  const xAt = (c, yy) => vx + (c - cols / 2) * ((yy - vy) / (y0 - vy)) * (L.VW / cols) * 0.8;
  const pat = Math.floor(m.B / 8) % 3;
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let r = 0; r < 10; r++) {
    for (let c = -4; c < cols + 4; c++) {
      let v;
      const dc = c - cols / 2 + 0.5;
      if (pat === 0) v = (r + c + Math.floor(m.B)) % 2 === 0 ? dipOf(m) : 0; // checkerboard flipping each beat
      else if (pat === 1) { const dist = Math.hypot(dc * 0.6, r); v = Math.max(0, 1 - Math.abs(dist - (m.ph * 10)) / 1.2); } // a ring out from the stage
      else v = Math.max(0, 1 - Math.abs(((dc + 12 + m.B * 3) % 24) - 12) / 2) * 0.9; // a sweep across
      v *= m.amp;
      if (v < 0.04) continue;
      const ya = rows[r], yb = rows[r + 1];
      const hue = (r + c) % 3 === 0 ? m.pal.b : m.pal.a;
      ctx.fillStyle = hsl(hue, 100, 55, v * 0.22);
      ctx.beginPath(); ctx.moveTo(xAt(c, ya), ya); ctx.lineTo(xAt(c + 1, ya), ya); ctx.lineTo(xAt(c + 1, yb), yb); ctx.lineTo(xAt(c, yb), yb); ctx.closePath(); ctx.fill();
    }
  }
  ctx.restore();
  ctx.strokeStyle = hsl(m.pal.a, 80, 50, 0.22); ctx.lineWidth = 0.2;
  rows.forEach((yy) => { ctx.beginPath(); ctx.moveTo(-30, yy); ctx.lineTo(L.VW + 30, yy); ctx.stroke(); });
  for (let c = -4; c <= cols + 4; c++) { ctx.beginPath(); ctx.moveTo(xAt(c, y0), y0); ctx.lineTo(xAt(c, y1 + 10), y1 + 10); ctx.stroke(); }
  // the 13i i projected onto the floor like a gobo, turning slowly
  ctx.save(); ctx.translate(L.cx, y0 + (y1 - y0) * 0.34); ctx.scale(1, 0.3); ctx.rotate(m.t * 0.08);
  drawI(ctx, 0, 0, L.portrait ? 30 : 34, m, { additive: true, alpha: 0.07 + m.bass * 0.08, core: 0.3 });
  ctx.restore();
  // the wall's reflection, faintly
  glow(ctx, L.cx, y0 + 6, L.wall.w * 0.5, hsl(m.pal.a, 90, 55, 0.5), 0.15 + m.level * 0.25);
}

// soft fog drifting at floor level, lit by the show
export function drawFog(ctx, L, m, front) {
  const n = front ? 4 : 6;
  for (let i = 0; i < n; i++) {
    const k = hash(i, front ? 7 : 3);
    const x = ((k * L.VW * 1.4 + m.t * (1.5 + k * 2)) % (L.VW * 1.4)) - L.VW * 0.2;
    const y = front ? L.VH - 4 - k * 8 : L.floorTop + 6 + k * 18;
    const r = (front ? 22 : 28) + k * 14;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.35);
    glow(ctx, 0, 0, r, hsl(i % 2 ? m.pal.a : m.pal.b, 60, 55, 0.5), (front ? 0.14 : 0.2) * (0.6 + m.level * 0.8));
    ctx.restore();
  }
}

// ─────────── the crowd ───────────
const CROWD = Array.from({ length: 40 }, (_, i) => ({
  x: hash(i, 11), s: 0.75 + hash(i, 12) * 0.5, kind: Math.floor(hash(i, 13) * 5), ph: hash(i, 14) * 0.25, stick: hash(i, 15) < 0.4, hueB: hash(i, 16) < 0.5, depth: hash(i, 17),
}));
export function drawCrowd(ctx, L, m) {
  const base = L.VH + 2;
  const sc = L.portrait ? 0.85 : 1;
  const sorted = CROWD.slice().sort((a, b) => a.depth - b.depth);
  sorted.forEach((c, i) => {
    const x = c.x * (L.VW + 30) - 15;
    const h = (9 + c.depth * 6) * c.s * sc;
    const ph = (m.ph - c.ph + 1) % 1;
    const bob = (0.5 + 0.5 * Math.cos(ph * TAU)) * (0.8 + m.amp * 1.8) * (m.on ? 1 : 0.2);
    const y = base - h * 0.6 + bob;
    const dark = `rgb(${4 + c.depth * 6},${3 + c.depth * 4},${10 + c.depth * 10})`;
    ctx.fillStyle = dark;
    // shoulders
    ctx.beginPath(); ctx.ellipse(x, y + h * 0.55, h * 0.42, h * 0.38, 0, PI, TAU); ctx.lineTo(x + h * 0.42, base + 4); ctx.lineTo(x - h * 0.42, base + 4); ctx.fill();
    // heads of every shape
    const hy = y + h * 0.1;
    ctx.beginPath();
    if (c.kind === 0) ctx.arc(x, hy, h * 0.2, 0, TAU);
    else if (c.kind === 1) ctx.ellipse(x, hy - h * 0.08, h * 0.15, h * 0.3, 0, 0, TAU);
    else if (c.kind === 2) { ctx.ellipse(x, hy, h * 0.26, h * 0.16, 0, 0, TAU); }
    else if (c.kind === 3) { ctx.arc(x, hy, h * 0.18, 0, TAU); }
    else { ctx.moveTo(x - h * 0.2, hy + h * 0.12); ctx.lineTo(x, hy - h * 0.32); ctx.lineTo(x + h * 0.2, hy + h * 0.12); ctx.closePath(); }
    ctx.fill();
    if (c.kind === 3) {
      ctx.strokeStyle = dark; ctx.lineWidth = h * 0.05;
      ctx.beginPath(); ctx.moveTo(x - h * 0.08, hy - h * 0.15); ctx.lineTo(x - h * 0.2, hy - h * 0.4); ctx.moveTo(x + h * 0.08, hy - h * 0.15); ctx.lineTo(x + h * 0.2, hy - h * 0.4); ctx.stroke();
      glow(ctx, x - h * 0.2, hy - h * 0.4, h * 0.12, hsl(c.hueB ? m.pal.b : m.pal.a, 100, 65, 0.9), 0.6);
      glow(ctx, x + h * 0.2, hy - h * 0.4, h * 0.12, hsl(c.hueB ? m.pal.b : m.pal.a, 100, 65, 0.9), 0.6);
    }
    // rim light from the stage
    ctx.strokeStyle = hsl(c.hueB ? m.pal.b : m.pal.a, 80, 60, 0.25 + m.level * 0.25); ctx.lineWidth = 0.25;
    ctx.beginPath(); ctx.arc(x, hy, h * 0.2, PI * 1.1, PI * 1.9); ctx.stroke();
    // arms up (with glowsticks) when it's going off
    const up = m.drop > 0 || m.build > 0.5 || (m.e > 0.8 && (i + Math.floor(m.B / 8)) % 3 === 0);
    if (up || c.stick) {
      const side = i % 2 ? 1 : -1;
      const sx = x + side * h * 0.3, sy = y + h * 0.4;
      const reach = up ? 1 : 0.45;
      const hx = sx + side * h * 0.15 + Math.sin(m.B * PI + i) * h * 0.1 * reach, hy2 = sy - h * 0.75 * reach - bob * 0.5;
      ctx.strokeStyle = dark; ctx.lineWidth = h * 0.09; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(hx, hy2); ctx.stroke();
      if (c.stick) {
        const a = -PI / 2 + Math.sin(m.B * PI + i) * 0.6;
        const hue = c.hueB ? m.pal.b : m.pal.a;
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = hsl(hue, 100, 65, 0.9); ctx.lineWidth = h * 0.06;
        ctx.beginPath(); ctx.moveTo(hx, hy2); ctx.lineTo(hx + Math.cos(a) * h * 0.3, hy2 + Math.sin(a) * h * 0.3); ctx.stroke();
        ctx.restore();
        glow(ctx, hx + Math.cos(a) * h * 0.15, hy2 + Math.sin(a) * h * 0.15, h * 0.35, hsl(hue, 100, 60, 0.9), 0.7);
      }
    }
  });
}

// ─────────── confetti and sparks ───────────
export function burst(parts, L, m, n = 120) {
  for (let i = 0; i < n; i++) {
    const fromLeft = i % 2 === 0;
    parts.push({
      x: fromLeft ? L.cx - L.wall.w * 0.4 : L.cx + L.wall.w * 0.4, y: L.booth.y - 4,
      vx: (fromLeft ? -1 : 1) * (8 + Math.random() * 30) * (Math.random() < 0.3 ? -0.5 : 1), vy: -30 - Math.random() * 40,
      r: Math.random() * TAU, vr: (Math.random() - 0.5) * 12, life: 0, max: 4 + Math.random() * 3,
      hue: Math.random() < 0.5 ? m.pal.a : m.pal.b, w: 0.8 + Math.random() * 0.8,
    });
  }
}
export function drawParticles(ctx, parts, dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.life += dt;
    if (p.life > p.max) { parts.splice(i, 1); continue; }
    p.vy += 26 * dt; p.vx *= 1 - 0.8 * dt; p.vy *= 1 - 0.6 * dt;
    p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
    const a = 1 - smooth(p.max * 0.7, p.max, p.life);
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, Math.cos(p.r * 1.7));
    ctx.fillStyle = hsl(p.hue, 100, 65, a); ctx.fillRect(-p.w / 2, -p.w * 0.3, p.w, p.w * 0.6);
    ctx.restore();
  }
}
