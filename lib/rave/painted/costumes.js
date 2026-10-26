// The extended remixes' costumes on the painted characters (Update 6.15).
// The big pieces are painted per pixel (costumeShader.js) through one shared
// WebGL canvas; the small ones (fangs, a spider, clasps) are drawn.
//   Halloween remix: Varrow the witch (hat, and a spider on a thread),
//   Qeth the vampire (cape, collar, clasp, fangs), Ilu the bat (wings, ears,
//   fangs), Ixxen the mummy (the drawn wraps, lib/rave/costumes.js).
//   Cicada remix: park ranger hats on all four.
import { TAU, glow, radial, linear } from "../draw";
import { makeGL } from "./glutil";
import { CFRAG, BOXES, MODES } from "./costumeShader";

const PI = Math.PI;
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);
let G = null, tried = false;

function gl() {
  if (!tried) { tried = true; G = makeGL(CFRAG, BOXES.cape, ["uRes", "uBox", "uMode", "uSide", "uT", "uB", "uBass", "uHueA", "uHueB", "uDip", "uP"], [], "CB_"); }
  return G;
}
// paint one piece into the scene at the current transform; false if it can't
function paint(ctx, piece, m, side = 1, P = [0, 0, 0, 0]) {
  const R = gl();
  if (!R) return false;
  const box = BOXES[piece];
  const tf = ctx.getTransform();
  let k = Math.max(Math.hypot(tf.a, tf.b), Math.hypot(tf.c, tf.d));
  k = Math.min(k, 900 / Math.max(box.w, box.h));
  const w = Math.max(2, Math.round(box.w * k)), h = Math.max(2, Math.round(box.h * k));
  const { gl: g, U, c } = R;
  // the canvas only ever grows; each piece is drawn into its corner
  if (c.width < w || c.height < h) { c.width = Math.max(c.width, w); c.height = Math.max(c.height, h); }
  g.viewport(0, 0, w, h);
  g.uniform2f(U.uRes, w, h); g.uniform4f(U.uBox, box.x0, box.y0, box.w, box.h);
  g.uniform1f(U.uMode, MODES[piece]); g.uniform1f(U.uSide, side);
  g.uniform1f(U.uT, m.t); g.uniform1f(U.uB, m.B); g.uniform1f(U.uBass, m.bass); g.uniform1f(U.uHueA, m.pal.a); g.uniform1f(U.uHueB, m.pal.b); g.uniform1f(U.uDip, dipOf(m));
  g.uniform4f(U.uP, P[0], P[1], P[2], P[3]);
  g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT);
  g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
  ctx.drawImage(c, 0, c.height - h, w, h, box.x0, box.y0, box.w, box.h);
  return true;
}

// ── park ranger hat: centred on the brim at x,y, w wide ──
export function paintRangerHat(ctx, m, x, y, w, tilt = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(w / 100, w / 100);
  const ok = paint(ctx, "ranger", m);
  ctx.restore();
  return ok;
}

// ── Varrow: the witch's hat, in the head's frame (as lib/rave/costumes.js) ──
export function paintWitchHat(ctx, p, m) {
  const sway = Math.sin(m.B * PI * 0.5) * 0.12 + (p.head || 0) * 0.5;
  const d = dipOf(m);
  const tipX = 66 + Math.sin(m.B * PI) * 10, tipY = -150 + d * 6;
  ctx.save(); ctx.translate(180, 58); ctx.rotate(-0.1 + sway * 0.3);
  const ok = paint(ctx, "witch", m, 1, [tipX, tipY, 0, 0]);
  if (ok) {
    // a spider let down on a thread from the bent tip, bobbing
    const sx = tipX + 4, sy0 = tipY + 4, drop = 60 + Math.sin(m.t * 0.9) * 14 + d * 6, sy = sy0 + drop;
    const swing = Math.sin(m.t * 1.3) * 6;
    ctx.strokeStyle = "rgba(220,220,240,0.55)"; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(sx, sy0); ctx.quadraticCurveTo(sx + swing * 0.3, sy0 + drop * 0.5, sx + swing, sy); ctx.stroke();
    ctx.save(); ctx.translate(sx + swing, sy);
    ctx.strokeStyle = "#0A0610"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
    for (let i = 0; i < 4; i++) {
      [-1, 1].forEach((s) => {
        const a = -0.9 + i * 0.6, kick = Math.sin(m.t * 6 + i + s) * 0.15;
        ctx.beginPath(); ctx.moveTo(0, 2); ctx.quadraticCurveTo(s * 8 * Math.cos(a), 2 + 8 * Math.sin(a) - 4, s * 12 * Math.cos(a + kick), 2 + 12 * Math.sin(a + kick) + 3); ctx.stroke();
      });
    }
    ctx.fillStyle = radial(ctx, -1.5, 0, 6, [[0, "#3A2A48"], [1, "#05030A"]]); ctx.beginPath(); ctx.ellipse(0, 4, 5, 6, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -2, 3.2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#FF3A2A"; [-1.2, 1.2].forEach((ex) => { ctx.beginPath(); ctx.arc(ex, -2.6, 0.7, 0, TAU); ctx.fill(); });
    ctx.fillStyle = "rgba(200,40,30,0.85)"; ctx.beginPath(); ctx.moveTo(-1.6, 3); ctx.lineTo(0, 6.4); ctx.lineTo(1.6, 3); ctx.lineTo(0, 1.4); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  return ok;
}

// ── Qeth: the cape and collar (behind the robe), Qeth's units ──
export function paintVampireCape(ctx, p, m) {
  const sw = Math.sin(m.B * PI * 0.5) * 4;
  return paint(ctx, "cape", m, 1, [p.hem || 0, p.flare || 0, sw, 0]);
}
// the clasp across the collar, on the front of the robe
export function vampireClasp(ctx, m) {
  [-1, 1].forEach((s) => {
    const x = 60 + s * 9, y = 86.5;
    ctx.fillStyle = radial(ctx, x - 0.6, y - 0.6, 2.6, [[0, "#FFF0B8"], [0.5, "#D9A84A"], [1, "#5A3A10"]]);
    ctx.beginPath(); ctx.arc(x, y, 2.2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#8A0A14"; ctx.beginPath(); ctx.arc(x, y, 1.1, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,200,200,0.8)"; ctx.beginPath(); ctx.arc(x - 0.35, y - 0.4, 0.35, 0, TAU); ctx.fill();
  });
  ctx.strokeStyle = "#D9B460"; ctx.lineWidth = 0.6;
  ctx.beginPath(); ctx.moveTo(51, 86.5); ctx.quadraticCurveTo(60, 90.5, 69, 86.5); ctx.stroke();
}

// ── Ilu: the wings and ears (behind the orb), in Ilu's units ──
export function paintBatWings(ctx, p, m) {
  const flap = 0.5 + 0.5 * Math.cos(m.ph * TAU * (m.amp > 0.6 ? 2 : 1));
  let ok = true;
  [-1, 1].forEach((s) => {
    ctx.save(); ctx.translate(60 + s * 26, 62); ctx.rotate(s * (-0.35 + flap * 0.55)); ctx.scale(s, 1);
    ok = paint(ctx, "wing", m, s) && ok;
    ctx.restore();
  });
  return ok;
}
export function paintBatEars(ctx, m) {
  let ok = true;
  [[44, 44, -1], [76, 44, 1]].forEach(([x, y, s]) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, 1);
    ok = paint(ctx, "ear", m, s) && ok;
    ctx.restore();
  });
  return ok;
}

// fangs: small, wet, sharp (x positions, the top of the mouth, length)
export function fangs(ctx, xs, y, len, w = 1.2) {
  xs.forEach((x) => {
    ctx.fillStyle = linear(ctx, x - w, y, x + w, y + len, [[0, "#FFFFFF"], [0.6, "#EDE6F2"], [1, "#B8AEC8"]]);
    ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w * 0.5, y + len * 0.6, x, y + len); ctx.quadraticCurveTo(x + w * 0.3, y + len * 0.5, x + w, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(40,20,40,0.6)"; ctx.lineWidth = w * 0.18; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.ellipse(x - w * 0.35, y + len * 0.3, w * 0.18, len * 0.2, 0, 0, TAU); ctx.fill();
  });
  // a drop of blood on one
  ctx.fillStyle = "rgba(170,0,16,0.9)"; ctx.beginPath(); ctx.ellipse(xs[xs.length - 1] + 0.1, y + len + 0.4, w * 0.35, w * 0.5, 0, 0, TAU); ctx.fill();
}

// a soft glow under a hat brim, so the face reads in shadow
export function brimShade(ctx, x, y, w) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.35);
  ctx.fillStyle = radial(ctx, 0, 0, w * 0.5, [[0, "rgba(0,0,0,0.35)"], [1, "rgba(0,0,0,0)"]]);
  ctx.beginPath(); ctx.arc(0, w * 0.2, w * 0.5, 0, TAU); ctx.fill();
  ctx.restore();
}

