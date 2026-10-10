// Halloween dressing for the Rave (Update 5.70): bats crossing the sky,
// jack-o'-lanterns along the stage lip flickering with the music, cobwebs in
// the truss, and the cold spotlight the girl stands in.
import { TAU, lerp, glow, hash } from "./draw";

const PI = Math.PI;

export function drawBats(ctx, L, m) {
  for (let k = 0; k < 9; k++) {
    const sp = 6 + hash(k, 61) * 8, dir = k % 2 ? 1 : -1, span = L.VW + 60;
    const x = ((m.t * sp * dir + hash(k, 62) * span) % span + span) % span - 30;
    const y = L.top + 6 + hash(k, 63) * 26 + Math.sin(m.t * 1.7 + k) * 3;
    const s = 0.7 + hash(k, 64) * 0.8;
    const flap = Math.sin(m.t * (10 + k) + k);
    ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
    ctx.fillStyle = "#050308";
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-2, -2.4 * flap, -4.4, -1.2 * flap); ctx.quadraticCurveTo(-3.4, -0.2, -3.6, 0.8); ctx.quadraticCurveTo(-2, 0, -1, 0.9);
    ctx.lineTo(0, 1.4); ctx.lineTo(1, 0.9);
    ctx.quadraticCurveTo(2, 0, 3.6, 0.8); ctx.quadraticCurveTo(3.4, -0.2, 4.4, -1.2 * flap); ctx.quadraticCurveTo(2, -2.4 * flap, 0, 0);
    ctx.fill();
    ctx.fillStyle = "rgba(255,80,40,0.9)"; ctx.fillRect(-0.4, 0.2, 0.25, 0.25); ctx.fillRect(0.15, 0.2, 0.25, 0.25);
    ctx.restore();
  }
}

export function drawPumpkins(ctx, L, m) {
  const xs = L.portrait ? [L.cx - 36, L.cx - 16, L.cx + 16, L.cx + 36] : [L.cx - 70, L.cx - 44, L.cx + 44, L.cx + 70];
  const y = L.floorTop - 1.2;
  xs.forEach((x, i) => {
    const r = 2.6 + (i % 2) * 0.6;
    const flick = 0.6 + 0.4 * Math.max(0, Math.sin(m.t * 13 + i * 3)) * (0.5 + m.bass);
    // the pumpkin: ribbed, shaded
    for (let k = -2; k <= 2; k++) {
      ctx.fillStyle = k === 0 ? "#E8761E" : Math.abs(k) === 1 ? "#C85E14" : "#94400C";
      ctx.beginPath(); ctx.ellipse(x + k * r * 0.36, y - r * 0.8, r * 0.42, r * 0.8, 0, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = "#3A5A1A"; ctx.fillRect(x - 0.3, y - r * 1.75, 0.6, r * 0.4);
    // the carved face, lit from inside
    ctx.fillStyle = `rgba(255,${180 + flick * 60},60,${0.85 * flick})`;
    [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(x + s * r * 0.45, y - r * 1.15); ctx.lineTo(x + s * r * 0.2, y - r * 0.85); ctx.lineTo(x + s * r * 0.7, y - r * 0.85); ctx.closePath(); ctx.fill(); });
    ctx.beginPath(); ctx.moveTo(x - r * 0.6, y - r * 0.55);
    for (let k = 0; k <= 6; k++) ctx.lineTo(x - r * 0.6 + k * r * 0.2, y - r * (k % 2 ? 0.55 : 0.3));
    ctx.lineTo(x + r * 0.6, y - r * 0.3); ctx.quadraticCurveTo(x, y - r * 0.1, x - r * 0.6, y - r * 0.3); ctx.closePath(); ctx.fill();
    glow(ctx, x, y - r * 0.8, r * 3.4, "rgba(255,140,40,0.8)", 0.35 * flick);
  });
}

export function drawWebs(ctx, L, m) {
  [[L.cx - (L.portrait ? 47 : 72), 1], [L.cx + (L.portrait ? 47 : 72), -1]].forEach(([x, s]) => {
    const y = L.truss + 2.6, R = 9;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, 1);
    ctx.strokeStyle = "rgba(210,210,230,0.35)"; ctx.lineWidth = 0.12;
    for (let k = 0; k <= 5; k++) { const a = (k / 5) * (PI / 2); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx.stroke(); }
    for (let r = 2; r <= R; r += 1.6) {
      ctx.beginPath();
      for (let k = 0; k <= 5; k++) { const a = (k / 5) * (PI / 2); const sag = k % 5 ? 0.6 : 0; const px = Math.cos(a) * (r - sag), py = Math.sin(a) * (r - sag); k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.stroke();
    }
    // a spider, bobbing on its thread
    const sy = 6 + Math.sin(m.t * 0.7) * 3;
    ctx.beginPath(); ctx.moveTo(R * 0.55, R * 0.55); ctx.lineTo(R * 0.55, R * 0.55 + sy); ctx.stroke();
    ctx.fillStyle = "#08060C"; ctx.beginPath(); ctx.arc(R * 0.55, R * 0.55 + sy, 0.7, 0, TAU); ctx.fill();
    ctx.restore();
  });
}

// the cold light she stands in
export function drawGirlLight(ctx, x, top, floorY, on) {
  if (on <= 0.01) return;
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  const g = ctx.createLinearGradient(x, top, x, floorY);
  g.addColorStop(0, `rgba(170,255,200,${0.02 * on})`); g.addColorStop(1, `rgba(170,255,200,${0.16 * on})`);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x - 2, top); ctx.lineTo(x + 2, top); ctx.lineTo(x + 16, floorY); ctx.lineTo(x - 16, floorY); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.translate(x, floorY); ctx.scale(1, 0.25);
  glow(ctx, 0, 0, 20, "rgba(170,255,200,0.8)", 0.5 * on);
  ctx.restore();
}
