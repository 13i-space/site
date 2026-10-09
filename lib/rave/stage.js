// The Rave's world (Update 5.68): an open-air rave on a platform at the edge
// of space. A ringed planet and aurora overhead, a light rig and lasers, an
// LED wall, the DJ at the decks, a dance floor that lights up in patterns,
// fog, and a crowd of alien silhouettes with glowsticks. Everything moves to
// the beat (m.B) and to the sound itself (m.level, m.bass, m.high).
import { TAU, lerp, clamp, smooth, hash, limb, tube, fingers, glow, radial, linear, hsl } from "./draw";

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
      wall: { x: cx - 46, y: top + 5, w: 92, h: 40 },
      booth: { x: cx, y: top + 58, s: 0.3 },
      floorTop: top + 65,
      dancers: { varrow: [cx - 60, top + 95, 41], qeth: [cx - 27, top + 92, 42], ilu: [cx + 27, top + 89, 34], ixxen: [cx + 61, top + 95, 44] },
      truss: top + 2,
    };
  }
  return {
    portrait, u, VW, VH, cx, top,
    wall: { x: cx - 44, y: top + 6, w: 88, h: 36 },
    booth: { x: cx, y: top + 62, s: 0.28 },
    floorTop: top + 69,
    dancers: { qeth: [cx - 24, top + 103, 31], ilu: [cx + 24, top + 99, 26], varrow: [cx - 22, top + 143, 37], ixxen: [cx + 25, top + 143, 39] },
    truss: top + 1,
  };
}

// ─────────── sky ───────────
const STARS = Array.from({ length: 180 }, (_, i) => [hash(i, 1), hash(i, 2), hash(i, 3)]);
export function drawSky(ctx, L, m) {
  const { VW, VH } = L;
  ctx.fillStyle = linear(ctx, 0, 0, 0, VH, [[0, "#04020C"], [0.5, hsl(m.pal.a + 200, 45, 7)], [1, "#0B0618"]]);
  ctx.fillRect(0, 0, VW, VH);
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
  // a ringed planet, turning slowly
  const px = L.portrait ? VW * 0.78 : VW * 0.86, py = L.portrait ? Math.max(16, L.top * 0.4) : L.top + 14, pr = L.portrait ? 16 : 13;
  ctx.save(); ctx.translate(px, py); ctx.rotate(-0.35);
  ctx.strokeStyle = "rgba(233,210,154,0.35)"; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(0, 0, pr * 2, pr * 0.5, 0, PI, TAU); ctx.stroke();
  ctx.fillStyle = radial(ctx, 0, 0, pr, [[0, hsl(m.pal.b + 180, 40, 46)], [0.7, hsl(m.pal.b + 200, 50, 22)], [1, "#08061a"]], -pr * 0.4, -pr * 0.4);
  ctx.beginPath(); ctx.arc(0, 0, pr, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, pr, 0, TAU); ctx.clip();
  for (let k = -3; k <= 3; k++) { ctx.fillStyle = k % 2 ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.12)"; ctx.fillRect(-pr, k * pr * 0.25 - pr * 0.06, pr * 2, pr * 0.12); }
  ctx.fillStyle = radial(ctx, pr * 0.5, pr * 0.4, pr * 1.2, [[0, "rgba(0,0,0,0)"], [0.5, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,0.75)"]]); ctx.fillRect(-pr, -pr, pr * 2, pr * 2);
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(0, 0, pr * 2, pr * 0.5, 0, 0, PI); ctx.stroke();
  ctx.restore();
  // aurora ribbons, pulled by the sound
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let r = 0; r < 3; r++) {
    const baseY = (L.portrait ? Math.max(10, L.top * 0.75) : L.top + 10) + r * 5;
    const hue = r % 2 ? m.pal.b : m.pal.a;
    ctx.beginPath();
    for (let x = 0; x <= VW; x += 2) {
      const y = baseY + Math.sin(x * 0.05 + m.t * 0.4 + r) * 3 + Math.sin(x * 0.13 - m.t * 0.7 + r * 2) * 1.5 * (1 + m.bass);
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = hsl(hue, 90, 60, 0.08 + m.level * 0.12); ctx.lineWidth = 6 + m.bass * 4; ctx.stroke();
    ctx.strokeStyle = hsl(hue, 90, 75, 0.12 + m.level * 0.15); ctx.lineWidth = 0.8; ctx.stroke();
  }
  ctx.restore();
  // the far horizon of the platform world
  const hy = L.floorTop - 2;
  ctx.fillStyle = "#06040F";
  ctx.beginPath(); ctx.moveTo(0, hy);
  for (let x = 0; x <= VW; x += 6) ctx.lineTo(x, hy - 3 - 3 * hash(Math.floor(x / 6), 9) - (Math.abs(x - L.cx) < 50 ? 0 : 2));
  ctx.lineTo(VW, VH); ctx.lineTo(0, VH); ctx.closePath(); ctx.fill();
}

// ─────────── the LED wall ───────────
export function drawWall(ctx, L, m, bins, info) {
  const { x, y, w, h } = L.wall;
  // frame
  ctx.fillStyle = "#07050F"; ctx.fillRect(x - 1.5, y - 1.5, w + 3, h + 3);
  ctx.strokeStyle = "#2A2850"; ctx.lineWidth = 0.4; ctx.strokeRect(x - 1.5, y - 1.5, w + 3, h + 3);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = "#05030A"; ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = "lighter";
  const cx = x + w / 2, cy = y + h / 2;
  const mode = info.title ? -1 : Math.floor(m.B / 32) % 4;
  if (mode === 0 || mode === -1) {
    // mirrored spectrum
    const N = 32;
    for (let i = 0; i < N; i++) {
      const k = bins ? Math.floor(Math.pow(i / N, 1.7) * bins.length * 0.6) + 1 : 0;
      const v = bins ? bins[k] / 255 : 0.15 + 0.1 * Math.sin(m.t * 2 + i);
      const bh = v * h * 0.48 * (mode === -1 ? 0.5 : 1);
      const bw = w / (N * 2) * 0.7;
      const hue = lerp(m.pal.a, m.pal.b, i / N);
      ctx.fillStyle = hsl(hue, 100, 60, 0.9);
      [cx + (i + 0.5) * (w / (N * 2)), cx - (i + 0.5) * (w / (N * 2))].forEach((bx) => {
        ctx.fillRect(bx - bw / 2, cy - bh, bw, bh * 2);
      });
    }
  } else if (mode === 1) {
    // a tunnel of rings rushing out on the beat
    for (let r = 0; r < 9; r++) {
      const k = ((r + m.B) % 9) / 9;
      const rad = Math.pow(k, 1.6) * w * 0.7;
      ctx.strokeStyle = hsl(r % 2 ? m.pal.a : m.pal.b, 100, 60, (1 - k) * 0.9);
      ctx.lineWidth = 0.4 + k * 1.6;
      ctx.beginPath();
      for (let s = 0; s <= 6; s++) { const a = (s / 6) * TAU + m.B * 0.1; const px = cx + Math.cos(a) * rad, py = cy + Math.sin(a) * rad * 0.62; s ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.stroke();
    }
  } else if (mode === 2) {
    // the 13i sigil: a triangle in a ring, pulsing
    const R = h * 0.32 * (1 + dipOf(m) * 0.12 * m.amp);
    ctx.strokeStyle = hsl(m.pal.a, 100, 65, 0.95); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
    ctx.strokeStyle = hsl(m.pal.b, 100, 70, 0.9);
    ctx.beginPath();
    for (let s = 0; s < 3; s++) { const a = -PI / 2 + (s / 3) * TAU + Math.floor(m.B / 4) * (TAU / 6); const px = cx + Math.cos(a) * R * 0.82, py = cy + Math.sin(a) * R * 0.82; s ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath(); ctx.stroke();
    glow(ctx, cx, cy, R * 1.8, hsl(m.pal.a, 100, 60, 0.6), 0.4 + dipOf(m) * 0.5);
    ctx.font = `700 ${h * 0.12}px ui-monospace, Menlo, monospace`; ctx.textAlign = "center"; ctx.fillStyle = hsl(m.pal.b, 100, 80, 0.85);
    ctx.fillText("13i", cx, cy + h * 0.045);
  } else {
    // a waveform scope across the wall
    ctx.strokeStyle = hsl(m.pal.b, 100, 65, 0.95); ctx.lineWidth = 0.7;
    for (let line = 0; line < 3; line++) {
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const v = bins ? bins[2 + i * 3] / 255 : 0.2;
        const px = x + (i / 64) * w, py = cy + (line - 1) * h * 0.22 + Math.sin(i * 0.6 + m.B * PI + line) * v * h * 0.2;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.strokeStyle = hsl(line === 1 ? m.pal.a : m.pal.b, 100, 65, 0.8); ctx.stroke();
    }
  }
  // now playing
  if (info.title) {
    ctx.globalCompositeOperation = "source-over";
    ctx.textAlign = "center";
    ctx.font = `600 ${h * 0.07}px ui-monospace, Menlo, monospace`; ctx.fillStyle = hsl(m.pal.b, 90, 75, info.a);
    ctx.fillText("NOW PLAYING", cx, y + h * 0.3);
    ctx.font = `700 ${Math.min(h * 0.16, (w * 1.6) / Math.max(8, info.title.length))}px system-ui, sans-serif`; ctx.fillStyle = `rgba(255,255,255,${info.a})`;
    ctx.fillText(info.title, cx, y + h * 0.56);
    if (info.sub) { ctx.font = `500 ${h * 0.065}px ui-monospace, Menlo, monospace`; ctx.fillStyle = hsl(m.pal.a, 80, 75, info.a * 0.9); ctx.fillText(info.sub, cx, y + h * 0.72); }
  }
  // pixel grid over it all, so it reads as LEDs
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  for (let gx = x; gx < x + w; gx += 0.9) ctx.fillRect(gx, y, 0.22, h);
  for (let gy = y; gy < y + h; gy += 0.9) ctx.fillRect(x, gy, w, 0.22);
  ctx.restore();
  // its glow on everything around
  glow(ctx, x + w / 2, y + h / 2, w * 0.7, hsl(m.pal.a, 80, 50, 0.4), 0.3 + m.level * 0.4);
}

// ─────────── the light rig ───────────
export function drawTruss(ctx, L, m) {
  const y = L.truss;
  ctx.strokeStyle = "#1E1C36"; ctx.lineWidth = 0.5;
  ctx.strokeRect(-2, y, L.VW + 4, 2.6);
  ctx.beginPath();
  for (let x = 0; x < L.VW; x += 2.6) { ctx.moveTo(x, y); ctx.lineTo(x + 2.6, y + 2.6); ctx.moveTo(x + 2.6, y); ctx.lineTo(x, y + 2.6); }
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

// speaker stacks, cones pumping with the bass
export function drawSpeakers(ctx, L, m) {
  const xs = L.portrait ? [L.cx - 40, L.cx + 40] : [L.cx - 58, L.cx + 58];
  const w = L.portrait ? 11 : 13, h = L.portrait ? 20 : 22;
  xs.forEach((x) => {
    const y = L.floorTop - h;
    ctx.fillStyle = "#0B0A16"; ctx.fillRect(x - w / 2, y, w, h);
    ctx.strokeStyle = "#24223F"; ctx.lineWidth = 0.4; ctx.strokeRect(x - w / 2, y, w, h);
    [[y + h * 0.27, w * 0.3], [y + h * 0.7, w * 0.36]].forEach(([cy, r]) => {
      const pump = 1 + m.bass * 0.12 * m.amp;
      ctx.fillStyle = "#15132A"; ctx.beginPath(); ctx.arc(x, cy, r, 0, TAU); ctx.fill();
      ctx.fillStyle = "#06050C"; ctx.beginPath(); ctx.arc(x, cy, r * 0.75 * pump, 0, TAU); ctx.fill();
      ctx.strokeStyle = hsl(m.pal.a, 90, 60, 0.4 + m.bass * 0.5); ctx.lineWidth = 0.3; ctx.beginPath(); ctx.arc(x, cy, r * 0.92, 0, TAU); ctx.stroke();
      ctx.fillStyle = "#1E1C34"; ctx.beginPath(); ctx.arc(x, cy, r * 0.22, 0, TAU); ctx.fill();
    });
  });
}

// ─────────── the DJ ───────────
// A new face for The Rave: four arms, a glowing cranium that pulses with the
// bass, an LED visor, headphones round the neck and great curled horns.
// Drawn standing behind the booth; (0,0) is the booth's top edge.
const DJ_SKIN = ["#F29AD8", "#B04C9A", "#4A1748"];
export function drawDJ(ctx, L, m, bins) {
  const { x, y, s } = L.booth;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const d = dipOf(m);
  const nod = d * (2.2 + m.amp * 2);
  const build = m.build, drop = m.drop;
  const sway = Math.sin(m.B * PI * 0.5) * 2 * m.amp;
  // torso
  ctx.save(); ctx.translate(sway * 0.4, nod * 0.25);
  ctx.fillStyle = linear(ctx, -18, -34, 18, 10, [[0, "#2A1440"], [1, "#0E0718"]]);
  ctx.beginPath(); ctx.moveTo(-17, 12); ctx.lineTo(-19, -24); ctx.quadraticCurveTo(-18, -33, -8, -34); ctx.lineTo(8, -34); ctx.quadraticCurveTo(18, -33, 19, -24); ctx.lineTo(17, 12); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = hsl(m.pal.a, 100, 65, 0.6 + d * 0.4); ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(-8, -34); ctx.lineTo(-3, 10); ctx.moveTo(8, -34); ctx.lineTo(3, 10); ctx.stroke();
  ctx.fillStyle = hsl(m.pal.b, 100, 70, 0.4 + m.bass * 0.6); ctx.beginPath(); ctx.arc(0, -16, 2.2, 0, TAU); ctx.fill();
  glow(ctx, 0, -16, 8, hsl(m.pal.b, 100, 60, 0.9), m.bass);
  // arms. Lower pair work the decks, upper pair do whatever the moment needs
  const deckL = [-30, 3], deckR = [30, 3];
  const scr = Math.floor(m.B / 8) % 2 === 1 && m.e > 0.45 && !build;
  const scratch = scr ? Math.sin(m.B * PI * 4) * 4 : 0;
  const tweak = Math.sin(m.t * 3) * 1.5;
  const lL = [deckL[0] + scratch, deckL[1] - 1 + Math.abs(scratch) * 0.2];
  const lR = scr ? [8 + Math.sin(m.B * PI * 2) * 5, 2] : [deckR[0] - 4 + tweak, deckR[1] - 1];
  let uL, uR;
  if (drop > 0) {
    const pump = d * 6;
    uL = [-24 - pump * 0.4, -66 - pump]; uR = [24 + pump * 0.4, -66 - pump];
  } else if (build > 0) {
    uL = [lerp(-26, -22, build), lerp(-20, -62, build)]; uR = [lerp(26, 22, build), lerp(-20, -62, build)];
  } else if (m.e > 0.75 && Math.floor(m.B / 4) % 2 === 0) {
    uL = [-22, -30]; uR = [24 + d * 2, -48 - d * 10]; // fist pump
  } else if (m.e < 0.45 || Math.floor(m.B / 16) % 2 === 1) {
    uL = [-14, -46]; uR = [26, -18 + Math.sin(m.B * PI) * 2]; // headphone cup to the ear
  } else {
    uL = [-24, -18 + Math.sin(m.B * PI) * 2]; uR = [16 + Math.sin(m.B * PI * 0.5) * 8, -42 - d * 4]; // pointing at the crowd
  }
  const skinG = (a, b) => linear(ctx, a[0], a[1], b[0], b[1], [[0, DJ_SKIN[2]], [0.5, DJ_SKIN[1]], [1, DJ_SKIN[0]]]);
  [[[-14, -22], lL, -0.5], [[14, -22], lR, 0.5]].forEach(([sh, hd, b]) => {
    limb(ctx, sh, hd, b, 5, 3.4, skinG(sh, hd));
    fingers(ctx, hd, Math.atan2(hd[1] - sh[1], hd[0] - sh[0]), 3, 4, 1, DJ_SKIN[0], 1.3);
  });
  [[[-16, -30], uL, 0.6], [[16, -30], uR, -0.6]].forEach(([sh, hd, b]) => {
    limb(ctx, sh, hd, b, 4.6, 3.2, skinG(sh, hd));
    fingers(ctx, hd, Math.atan2(hd[1] - sh[1], hd[0] - sh[0]), 3, 4, drop > 0 ? 1.4 : 0.9, DJ_SKIN[0], 1.3);
  });
  // headphones round the neck
  ctx.strokeStyle = "#1A1A26"; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(0, -36, 9, 0.15, PI - 0.15); ctx.stroke();
  [[-9, -34], [9, -34]].forEach(([hx, hy]) => { ctx.fillStyle = "#14131E"; ctx.beginPath(); ctx.ellipse(hx, hy, 3.4, 4.2, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = hsl(m.pal.a, 100, 60, 0.8); ctx.lineWidth = 0.5; ctx.stroke(); });
  // the head
  ctx.save(); ctx.translate(0, -38 + nod * 0.6); ctx.rotate(Math.sin(m.B * PI) * 0.05 * m.amp + (drop > 0 ? -0.08 : 0));
  // horns, curled
  [-1, 1].forEach((sd) => {
    ctx.save(); ctx.scale(sd, 1);
    const hg = linear(ctx, 12, -30, 34, -10, [[0, "#F1E3C0"], [0.6, "#C9A86A"], [1, "#6E5428"]]);
    tube(ctx, [11, -26], [26, -42], [38, -24], [29, -12], 6.5, 3.2, hg);
    tube(ctx, [29, -12], [24, -6], [19, -14], [23, -18], 3.2, 1.2, hg);
    ctx.strokeStyle = "rgba(80,56,24,0.5)"; ctx.lineWidth = 0.4;
    for (let r = 0; r < 6; r++) { const k = r / 6; ctx.beginPath(); ctx.arc(lerp(16, 32, k), lerp(-33, -18, k), 2.4, 0, PI); ctx.stroke(); }
    ctx.restore();
  });
  // jaw and face
  ctx.fillStyle = linear(ctx, 0, -10, 0, 0, [[0, DJ_SKIN[1]], [1, DJ_SKIN[2]]]);
  ctx.beginPath(); ctx.moveTo(-12, -14); ctx.quadraticCurveTo(-11, 0, 0, 1); ctx.quadraticCurveTo(11, 0, 12, -14); ctx.closePath(); ctx.fill();
  // the cranium: translucent, its brain lighting with the bass
  ctx.fillStyle = radial(ctx, 0, -24, 18, [[0, DJ_SKIN[0]], [0.6, DJ_SKIN[1]], [1, DJ_SKIN[2]]], -5, -30);
  ctx.beginPath(); ctx.ellipse(0, -22, 15, 17, 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, -27, 13, 11.5, 0, PI, TAU); ctx.ellipse(0, -27, 13, 3, 0, 0, PI); ctx.clip();
  ctx.fillStyle = "rgba(20,8,40,0.55)"; ctx.fillRect(-14, -40, 28, 16);
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = hsl(m.pal.b, 100, 70, 0.4 + m.bass * 0.6); ctx.lineWidth = 0.9;
  for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-11, -30 + k * 1.2); for (let xx = -11; xx <= 11; xx += 2) ctx.lineTo(xx, -30 + k * 1.2 + Math.sin(xx * 0.7 + k + m.t * 3) * 1.6 - (k < 2 ? 3 : 0)); ctx.stroke(); }
  glow(ctx, 0, -31, 14, hsl(m.pal.b, 100, 65, 0.9), 0.3 + m.bass * 0.7);
  ctx.restore();
  ctx.strokeStyle = "rgba(255,220,250,0.5)"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.ellipse(0, -27, 13, 11.5, 0, PI, TAU); ctx.stroke();
  // the visor, showing the spectrum
  ctx.fillStyle = "#06040C"; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-13, -19, 26, 6.5, 3) : ctx.rect(-13, -19, 26, 6.5); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 12; i++) {
    const v = bins ? bins[2 + i * 5] / 255 : 0.3 + 0.3 * Math.sin(m.t * 4 + i);
    const bh = 0.6 + v * 5;
    ctx.fillStyle = hsl(lerp(m.pal.a, m.pal.b, i / 11), 100, 65, 0.95);
    ctx.fillRect(-11.5 + i * 1.95, -12.8 - bh, 1.3, bh);
  }
  ctx.restore();
  ctx.strokeStyle = "#2E2A40"; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-13, -19, 26, 6.5, 3) : ctx.rect(-13, -19, 26, 6.5); ctx.stroke();
  // grin
  const open = drop > 0 ? 2.6 : build > 0 ? 1.4 : 0.6;
  ctx.fillStyle = "#1A0618"; ctx.beginPath(); ctx.moveTo(-6, -7); ctx.quadraticCurveTo(0, -7 + open * 2.4, 6, -7); ctx.quadraticCurveTo(0, -5.4, -6, -7); ctx.fill();
  ctx.fillStyle = "#F7EAF4"; ctx.fillRect(-3.5, -6.9, 7, 0.7);
  ctx.restore(); // head
  ctx.restore(); // torso
  ctx.restore();
}

// the booth in front of the DJ: two decks, a mixer, a front panel with the song
export function drawBooth(ctx, L, m, title) {
  const { x, y, s } = L.booth;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // top surface
  ctx.fillStyle = "#1A1830";
  ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(50, 0); ctx.lineTo(54, 6); ctx.lineTo(-54, 6); ctx.closePath(); ctx.fill();
  // platters
  [-30, 30].forEach((px, i) => {
    ctx.fillStyle = "#0C0B16"; ctx.beginPath(); ctx.ellipse(px, 3, 12, 2.6, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = hsl(i ? m.pal.b : m.pal.a, 100, 60, 0.8); ctx.lineWidth = 0.6; ctx.stroke();
    const a = m.B * PI * 0.5 + i;
    ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(px, 3); ctx.lineTo(px + Math.cos(a) * 11, 3 + Math.sin(a) * 2.4); ctx.stroke();
  });
  // mixer lights
  for (let k = 0; k < 6; k++) {
    const on = (m.level * 6) > k;
    ctx.fillStyle = on ? hsl(k > 4 ? 0 : k > 3 ? 45 : 140, 100, 60, 1) : "#24223a";
    ctx.fillRect(-7 + k * 2.6, 1.6, 1.8, 1.4);
  }
  // front panel
  ctx.fillStyle = linear(ctx, 0, 6, 0, 30, [[0, "#14122A"], [1, "#07060F"]]);
  ctx.beginPath(); ctx.moveTo(-54, 6); ctx.lineTo(54, 6); ctx.lineTo(50, 30); ctx.lineTo(-50, 30); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = hsl(m.pal.a, 100, 60, 0.7 + dipOf(m) * 0.3); ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(-54, 6); ctx.lineTo(54, 6); ctx.stroke();
  // the panel ticker
  ctx.save(); ctx.beginPath(); ctx.rect(-44, 11, 88, 13); ctx.clip();
  ctx.fillStyle = "#040309"; ctx.fillRect(-44, 11, 88, 13);
  const text = `${title ? title.toUpperCase() : "13i"}   ·   THE RAVE   ·   13i.space   ·   `;
  ctx.font = "700 8px ui-monospace, Menlo, monospace"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
  const tw = ctx.measureText(text).width;
  const off = -((m.t * 14) % tw);
  ctx.fillStyle = hsl(m.pal.b, 100, 70, 0.95);
  for (let k = 0; k < 3; k++) ctx.fillText(text, -44 + off + k * tw, 17.8);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  for (let gx = -44; gx < 44; gx += 1.2) ctx.fillRect(gx, 11, 0.35, 13);
  ctx.restore();
  // side lights on the panel, chasing
  for (let k = 0; k < 8; k++) {
    const on = (Math.floor(m.B * 2) % 8) === k;
    [[-50 + k * 0.6, 8 + k * 2.6], [50 - k * 0.6, 8 + k * 2.6]].forEach(([lx, ly]) => {
      ctx.fillStyle = on ? hsl(m.pal.a, 100, 70, 1) : "#1E1C34"; ctx.fillRect(lx - 0.8, ly, 1.6, 1.6);
    });
  }
  ctx.restore();
  // the stage lip with a light strip
  const lipY = L.floorTop - 1;
  ctx.fillStyle = "#0A0916"; ctx.fillRect(0, lipY - 1, L.VW, 2.2);
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < L.VW; i += 1.6) {
    const k = Math.abs(i - L.cx) / L.VW;
    const on = 0.25 + 0.75 * Math.max(0, Math.cos((k * 6 - m.B) * PI));
    ctx.fillStyle = hsl(lerp(m.pal.a, m.pal.b, k * 2), 100, 60, on * 0.7);
    ctx.fillRect(i, lipY - 0.3, 1, 0.6);
  }
  ctx.restore();
}

// ─────────── the dance floor ───────────
export function drawFloor(ctx, L, m) {
  const y0 = L.floorTop, y1 = L.VH;
  const vx = L.cx, vy = y0 - 60;
  ctx.fillStyle = linear(ctx, 0, y0, 0, y1, [[0, "#0B0920"], [1, "#05040C"]]);
  ctx.fillRect(0, y0, L.VW, y1 - y0);
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
  rows.forEach((yy) => { ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(L.VW, yy); ctx.stroke(); });
  for (let c = -4; c <= cols + 4; c++) { ctx.beginPath(); ctx.moveTo(xAt(c, y0), y0); ctx.lineTo(xAt(c, y1 + 10), y1 + 10); ctx.stroke(); }
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
    const x = c.x * (L.VW + 10) - 5;
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
