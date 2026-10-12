// Halloween costumes for the Rave (Update 5.76), worn only on the Halloween
// remix (m.halloween): Qeth goes as a vampire (a red-lined cape and collar,
// fangs), Varrow as a witch (a tall crooked hat with a buckle), Ilu as a bat
// (wings that flap on the beat, ears, fangs), Ixxen as a mummy (bandages
// round its mantle, neck and head, a loose end trailing), and the DJ keeps a
// jack-o'-lantern candy pail on the decks. Each piece is drawn in its
// wearer's own units, at the right moment in its drawing.
import { TAU, lerp, glow, radial, linear, hash } from "./draw";

const PI = Math.PI;
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);

// ── Qeth: vampire ── (Qeth's SVG units; behind the robe)
export function qethCape(ctx, p, m) {
  const h = p.hem, fl = p.flare || 0, sw = Math.sin(m.B * Math.PI * 0.5) * 4;
  // the cape: black outside, blood-red lining showing at the edges, a
  // jagged hem that swings wider than the robe
  const outer = new Path2D();
  outer.moveTo(36, 84);
  outer.quadraticCurveTo(20 + h * 0.5, 112, 14 + h * 1.3 - fl + sw, 158);
  for (let k = 0; k <= 6; k++) { const x = lerp(14 + h * 1.3 - fl + sw, 106 + h * 1.3 + fl + sw, k / 6); outer.lineTo(x, 158 + (k % 2 ? -5 : 2)); }
  outer.quadraticCurveTo(100 + h * 0.5, 112, 84, 84); outer.closePath();
  ctx.fillStyle = linear(ctx, 14, 0, 106, 0, [[0, "#7A0A14"], [0.08, "#0A0508"], [0.5, "#1A0C14"], [0.92, "#0A0508"], [1, "#7A0A14"]]);
  ctx.fill(outer);
  ctx.strokeStyle = "#B01020"; ctx.lineWidth = 0.9; ctx.stroke(outer);
  // the great collar, flaring up behind the head
  [-1, 1].forEach((s) => {
    const c = new Path2D();
    c.moveTo(60 + s * 10, 84); c.lineTo(60 + s * 34, 46); c.quadraticCurveTo(60 + s * 26, 60, 60 + s * 22, 62); c.lineTo(60 + s * 26, 50); c.quadraticCurveTo(60 + s * 18, 66, 60 + s * 12, 70); c.closePath();
    ctx.fillStyle = linear(ctx, 60, 84, 60 + s * 34, 46, [[0, "#3A0610"], [1, "#B01828"]]); ctx.fill(c);
    ctx.strokeStyle = "#0A0508"; ctx.lineWidth = 1.4; ctx.stroke(c);
  });
}
export function qethFangs(ctx, p) {
  ctx.fillStyle = "#FFFFFF";
  [55.6, 64.4].forEach((x) => { ctx.beginPath(); ctx.moveTo(x - 1, 61.2); ctx.lineTo(x, 64.6 + (p.happy || 0) * 1.2); ctx.lineTo(x + 1, 61.2); ctx.closePath(); ctx.fill(); });
  ctx.fillStyle = "rgba(180,0,20,0.8)"; ctx.beginPath(); ctx.arc(64.6, 65.6, 0.5, 0, TAU); ctx.fill();
}

// ── Varrow: witch ── (Varrow's SVG units, in the head's frame)
export function varrowHat(ctx, p, m) {
  const sway = Math.sin(m.B * PI * 0.5) * 0.12 + (p.head || 0) * 0.5;
  const d = dipOf(m);
  ctx.save(); ctx.translate(180, 58); ctx.rotate(-0.1 + sway * 0.3);
  // back of the brim
  ctx.fillStyle = "#120818"; ctx.beginPath(); ctx.ellipse(0, 0, 118, 24, 0, PI, TAU); ctx.fill();
  // the cone, its tip bent over and bobbing on the beat
  const tipX = 66 + Math.sin(m.B * PI) * 10, tipY = -150 + d * 6;
  const cone = new Path2D();
  cone.moveTo(-62, -2); cone.quadraticCurveTo(-34, -80, -8, -120); cone.quadraticCurveTo(10, -150, tipX, tipY); cone.quadraticCurveTo(26, -128, 30, -96); cone.quadraticCurveTo(46, -50, 62, -2); cone.closePath();
  ctx.fillStyle = linear(ctx, -62, 0, 62, 0, [[0, "#0A0410"], [0.4, "#2C1640"], [0.6, "#3A1E54"], [1, "#0A0410"]]); ctx.fill(cone);
  ctx.strokeStyle = "#05020A"; ctx.lineWidth = 2; ctx.stroke(cone);
  // creases, a patch, a stitched tear
  ctx.strokeStyle = "rgba(0,0,0,0.45)"; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(-14, -100); ctx.quadraticCurveTo(-2, -96, 14, -104); ctx.stroke();
  ctx.fillStyle = "#4A2A10"; ctx.fillRect(-30, -66, 18, 16);
  ctx.strokeStyle = "#E8A040"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.strokeRect(-30, -66, 18, 16); ctx.setLineDash([]);
  // the band and buckle
  ctx.fillStyle = linear(ctx, 0, -22, 0, -4, [[0, "#E8761E"], [1, "#8A3A08"]]);
  ctx.beginPath(); ctx.moveTo(-58, -6); ctx.quadraticCurveTo(0, 2, 58, -6); ctx.lineTo(54, -22); ctx.quadraticCurveTo(0, -14, -54, -22); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#D9BA7C"; ctx.lineWidth = 3.4; ctx.strokeRect(-11, -21, 22, 17);
  ctx.fillStyle = "#1A0C20"; ctx.fillRect(-6, -17, 12, 9);
  // front of the brim
  ctx.fillStyle = linear(ctx, 0, -10, 0, 24, [[0, "#2A1438"], [1, "#0A0410"]]);
  ctx.beginPath(); ctx.ellipse(0, 0, 118, 24, 0, 0, PI); ctx.lineTo(-118, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#05020A"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 118, 24, 0, 0, TAU); ctx.stroke();
  ctx.restore();
}

// ── Ilu: bat ── (Ilu's units: orb centre 60,70, radius 32)
export function iluWings(ctx, p, m) {
  const flap = 0.5 + 0.5 * Math.cos(m.ph * TAU * (m.amp > 0.6 ? 2 : 1));
  [-1, 1].forEach((s) => {
    ctx.save(); ctx.translate(60 + s * 26, 62); ctx.rotate(s * (-0.35 + flap * 0.55)); ctx.scale(s, 1);
    const w = new Path2D();
    w.moveTo(0, 0); w.lineTo(30, -26); w.lineTo(58, -10);
    // scalloped trailing edge between the finger bones
    w.quadraticCurveTo(48, -2, 46, 10); w.quadraticCurveTo(36, 2, 30, 16); w.quadraticCurveTo(20, 6, 8, 18); w.closePath();
    ctx.fillStyle = linear(ctx, 0, -26, 58, 18, [[0, "#3A1A40"], [1, "#12061A"]]); ctx.fill(w);
    ctx.strokeStyle = "#0A0410"; ctx.lineWidth = 1; ctx.stroke(w);
    ctx.strokeStyle = "#5A3060"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
    [[58, -10], [46, 10], [30, 16]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(30, -26); ctx.lineTo(x, y); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(30, -26); ctx.stroke();
    ctx.fillStyle = "#E8D8F0"; ctx.beginPath(); ctx.moveTo(30, -26); ctx.lineTo(33, -31); ctx.lineTo(34, -25); ctx.closePath(); ctx.fill();
    ctx.restore();
  });
}
export function iluEars(ctx) {
  [[44, 44, -1], [76, 44, 1]].forEach(([x, y, s]) => {
    ctx.fillStyle = "#2A1030"; ctx.beginPath(); ctx.moveTo(x - 7, y + 4); ctx.lineTo(x + s * 4, y - 16); ctx.lineTo(x + 7, y + 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#C0508A"; ctx.beginPath(); ctx.moveTo(x - 3.6, y + 2); ctx.lineTo(x + s * 3, y - 10); ctx.lineTo(x + 3.6, y + 2); ctx.closePath(); ctx.fill();
  });
}
export function iluFangs(ctx, p) {
  ctx.fillStyle = "#FFFFFF";
  [55.5, 64.5].forEach((x) => { ctx.beginPath(); ctx.moveTo(x - 1.4, 88.4); ctx.lineTo(x, 92.6 + (p.mouth || 0) * 2); ctx.lineTo(x + 1.4, 88.6); ctx.closePath(); ctx.fill(); });
}

// ── Ixxen: mummy ── (the Lab's units)
const BANDAGE = "#E6DCC2";
function wraps(ctx, x0, x1, y0, y1, step, slope, seed, m) {
  for (let y = y0, i = 0; y < y1; y += step, i++) {
    if (hash(seed, i) < 0.12) continue; // a gap where the mantle shows through
    const w = step * 0.82;
    ctx.fillStyle = hash(seed, i, 2) < 0.5 ? BANDAGE : "#D2C6A6";
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y + slope); ctx.lineTo(x1, y + slope + w); ctx.lineTo(x0, y + w); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(90,74,50,0.45)"; ctx.lineWidth = 0.12; ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 0.1; ctx.beginPath(); ctx.moveTo(x0, y + 0.2); ctx.lineTo(x1, y + slope + 0.2); ctx.stroke();
  }
}
export function ixxenWraps(ctx, mantle, p, m) {
  ctx.save(); ctx.clip(mantle);
  wraps(ctx, 14, 32, 41, 71, 2.2, 1.6, 7, m);
  ctx.restore();
  // a loose end trailing from the hem
  const sw = Math.sin(m.t * 2.2) * 2 + (p.hem || 0) * 1.5;
  ctx.strokeStyle = BANDAGE; ctx.lineWidth = 1.4; ctx.lineCap = "butt";
  ctx.beginPath(); ctx.moveTo(27.5 + (p.hem || 0), 70.5); ctx.bezierCurveTo(29 + sw * 0.3, 74, 31 + sw * 0.6, 75, 33 + sw, 78.4); ctx.stroke();
  ctx.strokeStyle = "rgba(90,74,50,0.4)"; ctx.lineWidth = 0.1; ctx.stroke();
}
export function ixxenNeckWraps(ctx, from, to) {
  for (let k = 0; k < 4; k++) {
    const s = 0.15 + k * 0.22, x = lerp(from[0], to[0], s), y = lerp(from[1], to[1], s);
    ctx.fillStyle = k % 2 ? BANDAGE : "#D2C6A6";
    ctx.beginPath(); ctx.ellipse(x, y, 1.7, 0.6, -0.3, 0, TAU); ctx.fill();
  }
}
// round the head (side or front view), with a loose end flapping
export function ixxenHeadWrap(ctx, m, front) {
  ctx.save();
  ctx.fillStyle = BANDAGE; ctx.strokeStyle = "rgba(90,74,50,0.5)"; ctx.lineWidth = 0.12;
  const bands = front ? [[-6, -20.4, 12, 1.6, 0.1], [-6.4, -6.4, 12.8, 1.4, -0.05]] : [[-11.2, -19, 18, 1.6, 0.42], [-6.6, -5.8, 14, 1.4, -0.1]];
  bands.forEach(([x, y, w, h, r]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.fillRect(0, 0, w, h); ctx.strokeRect(0, 0, w, h); ctx.restore(); });
  const sw = Math.sin(m.t * 3) * 1.5;
  ctx.strokeStyle = BANDAGE; ctx.lineWidth = 1.2;
  const ox = front ? 6 : -10.6, oy = front ? -19.6 : -16;
  ctx.beginPath(); ctx.moveTo(ox, oy); ctx.quadraticCurveTo(ox + (front ? 3 : -3), oy + 2 + sw * 0.4, ox + (front ? 4 : -5) + sw, oy + 6); ctx.stroke();
  ctx.restore();
}

// ── the DJ: a jack-o'-lantern candy pail on the booth (booth units) ──
export function candyPail(ctx, m) {
  const x = 46, y = -3.4, r = 4;
  ctx.strokeStyle = "#2A2A2A"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(x, y - r * 0.8, r * 0.9, PI, TAU); ctx.stroke();
  ["#FF4A8A", "#7AF06A", "#FFD040", "#9A6AFF"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x - 2.4 + i * 1.6, y - r * 1.55 - (i % 2) * 0.6, 0.9, 0, TAU); ctx.fill(); });
  ctx.fillStyle = radial(ctx, x - 1, y - r, r * 1.3, [[0, "#FFA040"], [1, "#B84A08"]]);
  ctx.beginPath(); ctx.ellipse(x, y - r * 0.75, r, r * 0.85, 0, 0, TAU); ctx.fill();
  const fl = 0.6 + 0.4 * dipOf(m);
  ctx.fillStyle = `rgba(255,${200 + fl * 40},80,${fl})`;
  [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(x + s * 1.6, y - r * 1.15); ctx.lineTo(x + s * 0.6, y - r * 0.75); ctx.lineTo(x + s * 2.4, y - r * 0.75); ctx.closePath(); ctx.fill(); });
  ctx.beginPath(); ctx.moveTo(x - 2.2, y - r * 0.45); for (let k = 0; k <= 4; k++) ctx.lineTo(x - 2.2 + k * 1.1, y - r * (k % 2 ? 0.45 : 0.2)); ctx.lineTo(x + 2.2, y - r * 0.2); ctx.quadraticCurveTo(x, y, x - 2.2, y - r * 0.2); ctx.closePath(); ctx.fill();
  glow(ctx, x, y - r * 0.7, r * 2.6, "rgba(255,140,40,0.8)", 0.35 * fl);
}
