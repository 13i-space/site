// Light that plays off the characters (Update 6.17), on the extended remixes:
//   dust drifting in the spotlight beams, catching the light
//   the girl's cold spotlight spilling onto the dancers beside her
//   the cicada's glow: an emerald pool on the floor under its last form, the
//   husk's amber light, both washing over the nearest dancers
//   laser hits: on the drop a beam catches a dancer's face, a flare and a wash
//   the endings: the lights go down to one pool on what's left behind
import { TAU, lerp, clamp, smooth, hash, glow, hsl } from "./draw";
import { LIFE, shellFocus } from "./cicada";

const PI = Math.PI;
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);

// dust in the beams (the same beams as stage.js drawSpots)
export function drawBeamDust(ctx, L, m, intensity) {
  if (intensity < 0.05) return;
  const n = L.portrait ? 5 : 7;
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < n; i++) {
    const x = lerp(L.cx - L.wall.w * 0.75, L.cx + L.wall.w * 0.75, i / (n - 1));
    const y = L.truss + 2.6;
    const pat = Math.floor(m.B / 16) % 3;
    const sweep = pat === 0 ? Math.sin(m.B * PI * 0.25 + i * 0.7) * 0.5 : pat === 1 ? (i % 2 ? 1 : -1) * Math.sin(m.B * PI * 0.5) * 0.45 : (i - (n - 1) / 2) * 0.12 * Math.cos(m.B * PI * 0.25);
    const ang = PI / 2 + sweep;
    const len = (L.floorTop - y) + 40;
    const hue = i % 2 ? m.pal.a : m.pal.b;
    const a = intensity * (0.12 + 0.18 * (m.build > 0 ? 1 : dipOf(m) * m.amp));
    for (let k = 0; k < 26; k++) {
      // each mote drifts slowly down the beam and wanders across it
      const u = (hash(i, k, 1) + m.t * (0.004 + hash(i, k, 2) * 0.01)) % 1;
      const v = (hash(i, k, 3) - 0.5) * 2 + Math.sin(m.t * (0.3 + hash(i, k, 4)) + k) * 0.25;
      const r = u * len, w = Math.tan(0.13) * r;
      const px = x + Math.cos(ang) * r - Math.sin(ang) * v * w * 0.85;
      const py = y + Math.sin(ang) * r + Math.cos(ang) * v * w * 0.85;
      const tw = 0.5 + 0.5 * Math.sin(m.t * (2 + hash(i, k, 5) * 3) + k);
      const al = a * 3.2 * (1 - u) * (1 - Math.abs(v) * 0.6) * tw;
      if (al < 0.02) continue;
      ctx.fillStyle = hsl(hue, 60, 85, clamp(al, 0, 1));
      const sz = 0.12 + hash(i, k, 6) * 0.18;
      ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
    }
  }
  ctx.restore();
}

// a coloured wash over a dancer, from one side
function wash(ctx, L, key, fromX, col, a) {
  if (a < 0.01) return;
  const [x, fy, h] = L.dancers[key];
  const dir = Math.sign(fromX - x) || 1;
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  ctx.translate(x + dir * h * 0.18, fy - h * 0.5); ctx.scale(0.55, 1);
  glow(ctx, 0, 0, h * 0.62, col, a);
  ctx.restore();
}

// after the characters are drawn: how they light each other
export function drawStoryLight(ctx, L, m, st) {
  const s = m.s || 0;
  const [gx, gy, gh] = L.girl;
  const near = ["qeth", "ilu"];
  if (m.halloween && m.ghost > 0.01) {
    near.forEach((k) => wash(ctx, L, k, gx, "rgba(170,255,200,0.9)", 0.22 * m.ghost));
    // her eyes' red glint on the floor at her feet
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.translate(gx, gy + 0.5); ctx.scale(1, 0.25);
    glow(ctx, 0, 0, gh * 0.12, "rgba(255,40,30,0.8)", 0.25 * m.ghost);
    ctx.restore();
  }
  if (m.cicada) {
    // the last form's emerald light
    const fin = smooth(LIFE.molt2[1] - 6, LIFE.molt2[1], s) * (1 - smooth(LIFE.fly[0], LIFE.fly[1], s));
    if (fin > 0.01) {
      const x2 = gx - (L.portrait ? 8 : 12);
      const pulse = 0.7 + 0.3 * (m.bass || 0);
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.translate(x2, gy); ctx.scale(1, 0.28);
      glow(ctx, 0, 0, gh * 0.55, "rgba(110,255,170,0.9)", 0.4 * fin * pulse);
      ctx.restore();
      near.forEach((k) => wash(ctx, L, k, x2, "rgba(110,255,170,0.9)", 0.2 * fin * pulse));
    }
    // the husk's amber glow while it dances
    const husk = smooth(200, 203.5, s) * (1 - smooth(LIFE.fly[0] - 1, LIFE.fly[0] + 1, s));
    if (husk > 0.01) {
      const pulse = 0.4 + 0.6 * Math.exp(-m.ph * 4);
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.translate(gx, gy); ctx.scale(1, 0.28);
      glow(ctx, 0, 0, gh * 0.4, "rgba(255,180,80,0.85)", 0.3 * husk * pulse);
      ctx.restore();
      near.forEach((k) => wash(ctx, L, k, gx, "rgba(255,180,80,0.85)", 0.12 * husk * pulse));
    }
  }
  // laser hits on the drop: each beat a beam catches someone's face
  if (m.drop > 0.05 && m.ghost < 0.5) {
    const keys = ["varrow", "qeth", "ilu", "ixxen"];
    const k = keys[Math.floor(hash(Math.floor(m.B), 91) * 4)];
    const [x, fy, h] = L.dancers[k];
    const FACE = { varrow: 0.7, qeth: 0.72, ilu: 0.62, ixxen: 0.75 }[k];
    const hit = Math.exp(-m.ph * 6) * m.drop;
    const hue = Math.floor(m.B) % 2 ? m.pal.a : m.pal.b;
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    ctx.translate(x, fy - h * FACE);
    glow(ctx, 0, 0, h * 0.28, hsl(hue, 100, 70, 0.9), 0.45 * hit);
    ctx.strokeStyle = hsl(hue, 100, 88, 0.9 * hit); ctx.lineWidth = 0.25;
    ctx.beginPath(); ctx.moveTo(-h * 0.25, 0); ctx.lineTo(h * 0.25, 0); ctx.moveTo(0, -h * 0.12); ctx.lineTo(0, h * 0.12); ctx.stroke();
    ctx.restore();
  }
}

// the endings: how far the lights are down (0-1), and the pool left on
export function endingLight(special, s, L) {
  const e = special && special.ending;
  if (!e) return null;
  if (e.focus === "doll") {
    const k = smooth(e.dropDoll, e.dropDoll + 4, s);
    return k > 0.001 ? { k, x: L.girl[0] + L.girl[2] * 0.16, y: L.girl[1] - L.girl[2] * 0.04 } : null;
  }
  if (e.focus === "shell") {
    const k = smooth(LIFE.fly[0] - 0.5, LIFE.fly[0] + 2.2, s);
    const f = shellFocus(L);
    return k > 0.001 ? { k, x: f.x, y: f.y + L.girl[2] * 0.25 } : null;
  }
  return null;
}
export function drawEndingDark(ctx, L, E) {
  if (!E) return;
  const R = L.girl[2] * 0.55;
  const g = ctx.createRadialGradient(E.x, E.y, R * 0.25, E.x, E.y, R * 2.4);
  g.addColorStop(0, `rgba(0,0,0,${0.15 * E.k})`); g.addColorStop(0.35, `rgba(0,0,0,${0.6 * E.k})`); g.addColorStop(1, `rgba(0,0,0,${0.88 * E.k})`);
  ctx.fillStyle = g; ctx.fillRect(-20, -20, L.VW + 40, L.VH + 40);
}
