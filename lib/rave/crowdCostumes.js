// The crowd in costume (Update 6.17), on the Halloween remix: silhouettes in
// witch hats, devil horns, cat and bunny ears, ghost sheets with the stage
// light through the eye holes, glowing jack-o'-lantern heads, vampire
// collars, a flat-topped monster with bolts, a reaper's hood. A few stay
// plain aliens. All dark against the stage, in the crowd's own units.
import { TAU, glow, hash } from "./draw";

const PI = Math.PI;
const KINDS = ["witch", "ghost", "horns", "pumpkin", "cat", "reaper", "bunny", "vampire", "monster", "plain", "witch", "horns", "pumpkin", "ghost"];
// spread evenly along the crowd (every one of the fourteen in turn)
export function crowdCostumeFor(i) {
  const k = KINDS[(i * 5 + 2) % KINDS.length];
  return k === "plain" ? null : k;
}

// asHead: the pass where a costume can stand in for the head (return true if
// it did), and things behind the head go; otherwise what sits on top of it
export function crowdCostume(ctx, kind, x, hy, h, dark, m, i, asHead) {
  const r = h * 0.2;
  const sway = Math.sin(m.B * PI + i) * 0.06;
  ctx.fillStyle = dark; ctx.strokeStyle = dark;
  if (asHead) {
    if (kind === "ghost") {
      // a sheet over head and shoulders, the light showing through two holes
      const g = new Path2D();
      g.moveTo(x - h * 0.46, hy + h * 0.95);
      g.quadraticCurveTo(x - h * 0.34, hy - r * 0.2, x - r * 0.9, hy - r * 0.6);
      g.quadraticCurveTo(x, hy - r * 1.9, x + r * 0.9, hy - r * 0.6);
      g.quadraticCurveTo(x + h * 0.34, hy - r * 0.2, x + h * 0.46, hy + h * 0.95);
      g.closePath();
      ctx.fill(g);
      const eyeC = `hsla(${m.pal.a},60%,${58 + m.level * 20}%,0.9)`;
      ctx.fillStyle = eyeC;
      [-1, 1].forEach((s) => { ctx.beginPath(); ctx.ellipse(x + s * r * 0.38, hy - r * 0.2, r * 0.16, r * 0.26, 0, 0, TAU); ctx.fill(); });
      ctx.beginPath(); ctx.ellipse(x, hy + r * 0.45, r * 0.2, r * 0.14, 0, 0, TAU); ctx.fill();
      return true;
    }
    if (kind === "pumpkin") {
      // a jack-o'-lantern head, ribbed, its carved face glowing
      for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.ellipse(x + k * r * 0.5, hy, r * 0.72, r * 0.95, 0, 0, TAU); ctx.fill(); }
      ctx.fillRect(x - r * 0.1, hy - r * 1.3, r * 0.2, r * 0.4);
      const fl = 0.6 + 0.4 * Math.exp(-m.ph * 5) + 0.1 * Math.sin(m.t * 17 + i);
      ctx.fillStyle = `rgba(255,${150 + fl * 70},50,${0.75 * fl})`;
      [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(x + s * r * 0.55, hy - r * 0.05); ctx.lineTo(x + s * r * 0.15, hy - r * 0.05); ctx.lineTo(x + s * r * 0.35, hy - r * 0.45); ctx.closePath(); ctx.fill(); });
      ctx.beginPath(); ctx.moveTo(x - r * 0.6, hy + r * 0.25);
      for (let k = 0; k <= 6; k++) ctx.lineTo(x - r * 0.6 + k * r * 0.2, hy + r * (k % 2 ? 0.3 : 0.55));
      ctx.quadraticCurveTo(x, hy + r * 0.8, x - r * 0.6, hy + r * 0.25); ctx.closePath(); ctx.fill();
      glow(ctx, x, hy + r * 0.2, r * 1.6, "rgba(255,140,40,0.7)", 0.3 * fl);
      return true;
    }
    if (kind === "monster") {
      // a flat top and a bolt each side of the neck
      ctx.beginPath(); ctx.moveTo(x - r * 0.95, hy + r * 0.9); ctx.lineTo(x - r * 1.0, hy - r * 0.85); ctx.lineTo(x + r * 1.0, hy - r * 0.85); ctx.lineTo(x + r * 0.95, hy + r * 0.9); ctx.closePath(); ctx.fill();
      ctx.fillRect(x - r * 1.0, hy - r * 1.05, r * 2.0, r * 0.32);
      [-1, 1].forEach((s) => ctx.fillRect(x + s * r * 1.0 - (s > 0 ? 0 : r * 0.45), hy + r * 0.45, r * 0.45, r * 0.22));
      return true;
    }
    if (kind === "reaper") {
      // a pointed hood, dark inside but for two faint lights
      ctx.beginPath(); ctx.moveTo(x - h * 0.4, hy + h * 0.9); ctx.quadraticCurveTo(x - r * 1.3, hy - r * 0.4, x + r * 0.2, hy - r * 1.9); ctx.quadraticCurveTo(x + r * 1.3, hy - r * 0.6, x + h * 0.4, hy + h * 0.9); ctx.closePath(); ctx.fill();
      [-1, 1].forEach((s) => glow(ctx, x + s * r * 0.3, hy, r * 0.35, "rgba(255,60,40,0.9)", 0.5 + 0.3 * Math.exp(-m.ph * 4)));
      return true;
    }
    if (kind === "vampire") {
      // the high collar stands up behind the head
      [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(x + s * r * 0.4, hy + r * 1.4); ctx.lineTo(x + s * r * 1.9, hy - r * 0.8); ctx.lineTo(x + s * r * 1.2, hy + r * 1.5); ctx.closePath(); ctx.fill(); });
    }
    return false;
  }
  // on top of the head
  ctx.save(); ctx.translate(x, hy); ctx.rotate(sway);
  if (kind === "witch") {
    ctx.beginPath(); ctx.ellipse(0, -r * 0.7, r * 2.0, r * 0.32, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-r * 0.9, -r * 0.75); ctx.quadraticCurveTo(-r * 0.4, -r * 2.2, r * 0.2, -r * 2.9); ctx.quadraticCurveTo(r * 1.1, -r * 3.1, r * 1.3, -r * 2.6); ctx.quadraticCurveTo(r * 0.5, -r * 2.2, r * 0.9, -r * 0.75); ctx.closePath(); ctx.fill();
  } else if (kind === "horns") {
    [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(s * r * 0.35, -r * 0.7); ctx.quadraticCurveTo(s * r * 0.9, -r * 1.3, s * r * 0.75, -r * 2.0); ctx.quadraticCurveTo(s * r * 0.55, -r * 1.2, s * r * 0.0 + s * r * 0.05, -r * 0.85); ctx.closePath(); ctx.fill(); });
  } else if (kind === "cat") {
    [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(s * r * 0.25, -r * 0.85); ctx.lineTo(s * r * 0.75, -r * 1.75); ctx.lineTo(s * r * 0.95, -r * 0.55); ctx.closePath(); ctx.fill(); });
  } else if (kind === "bunny") {
    [-1, 1].forEach((s) => { ctx.save(); ctx.rotate(s * 0.25 + Math.sin(m.B * PI * 0.5 + s) * 0.08); ctx.beginPath(); ctx.ellipse(s * r * 0.3, -r * 1.9, r * 0.28, r * 1.05, 0, 0, TAU); ctx.fill(); ctx.restore(); });
  }
  ctx.restore();
  return false;
}
