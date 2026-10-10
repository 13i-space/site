// The DJ and the booth (Update 5.69). Drawn in four passes so the DJ's hands
// really work the decks: the DJ's body, then the booth's top (two decks and
// a mixer), then the DJ's lower arms and hands on top of the gear, then the
// booth's front panel (the scrolling title, raised so it's never hidden, a
// horned emblem, level meters). Booth units: (0,0) is the front edge of the
// table top; the panel runs down to y=30.
import { TAU, lerp, clamp, glow, radial, linear, hsl } from "./draw";
import { arm3d, hand3d, shade } from "./shade";

const PI = Math.PI;
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);
const DJ_SKIN = { lite: "#FFC2EA", mid: "#C4589F", dark: "#5C1A58", line: "#2A0828" };
const DJ_SLEEVE = { lite: "#54307A", mid: "#2C1646", dark: "#12081F" };
const BONE = { lite: "#FFF6DA", mid: "#D9BA7C", dark: "#7C5C2C", line: "#3A2810" };
const DECK = 29, JOG_Y = -3.6, DJ_Y = -7; // decks at ±29; the DJ stands 7 units back

// where the DJ's limbs are this moment (in the DJ's own units)
function djPose(m) {
  const d = dipOf(m);
  const nod = d * (2.2 + m.amp * 2);
  const sway = Math.sin(m.B * PI * 0.5) * 2 * m.amp;
  const torso = [sway * 0.4, nod * 0.25];
  const scr = Math.floor(m.B / 8) % 2 === 1 && m.e > 0.45 && !m.build;
  const scratch = scr ? Math.sin(m.B * PI * 4) : 0;
  const tweak = Math.sin(m.t * 3);
  const jy = JOG_Y - DJ_Y;
  const lL = [-DECK + scratch * 3.6, jy + scratch * 0.5];
  const knobs = Math.floor(m.B / 4) % 2 === 0;
  const lR = scr ? [3 + Math.sin(m.B * PI * 2) * 3.4, -0.9 - DJ_Y - 0.5] : knobs ? [6 + tweak * 1.2, -6 - DJ_Y] : [DECK - 1 + tweak * 0.8, jy];
  let uL, uR;
  if (m.drop > 0) { const pump = d * 6; uL = [-24 - pump * 0.4, -66 - pump]; uR = [24 + pump * 0.4, -66 - pump]; }
  else if (m.build > 0) { uL = [lerp(-26, -22, m.build), lerp(-20, -62, m.build)]; uR = [lerp(26, 22, m.build), lerp(-20, -62, m.build)]; }
  else if (m.e > 0.75 && Math.floor(m.B / 4) % 2 === 0) { uL = [-22, -26]; uR = [24 + d * 2, -48 - d * 10]; }
  else if (m.e < 0.45 || Math.floor(m.B / 16) % 2 === 1) { uL = [-11, -46]; uR = [26, -14 + Math.sin(m.B * PI) * 2]; }
  else { uL = [-24, -14 + Math.sin(m.B * PI) * 2]; uR = [16 + Math.sin(m.B * PI * 0.5) * 8, -42 - d * 4]; }
  return { d, nod, sway, torso, scr, scratch, lL, lR, uL, uR };
}

// ─────────── the DJ's body (behind the booth) ───────────
export function drawDJ(ctx, L, m, bins) {
  const { x, y, s } = L.booth;
  const P = djPose(m);
  const rim = hsl(m.pal.b, 100, 72, 0.85), neon = hsl(m.pal.a, 100, 62, 1);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(0, DJ_Y);
  ctx.save(); ctx.translate(P.torso[0], P.torso[1]);
  // the jacket
  const jacket = new Path2D("M-17 16 L-19.5 -24 Q-18.5 -33.5 -8 -34.5 L8 -34.5 Q18.5 -33.5 19.5 -24 L17 16 Z");
  ctx.fillStyle = linear(ctx, -19, 0, 19, 0, [[0, "#12081E"], [0.3, "#2E1848"], [0.55, "#3C2260"], [0.8, "#22123A"], [1, "#0C0616"]]); ctx.fill(jacket);
  // the shirt in the V, with a strip of equaliser lights across it
  const vee = new Path2D("M-7 -34 L0 -15 L7 -34 Z");
  ctx.fillStyle = "#08060E"; ctx.fill(vee);
  ctx.save(); ctx.clip(vee);
  for (let i = 0; i < 6; i++) {
    const v = bins ? bins[3 + i * 6] / 255 : 0.4 + 0.3 * Math.sin(m.t * 5 + i);
    ctx.fillStyle = hsl(lerp(m.pal.a, m.pal.b, i / 5), 100, 60, 0.95);
    ctx.fillRect(-6 + i * 2, -22 - v * 6, 1.4, v * 6);
  }
  ctx.restore();
  // lapels, zip, pockets
  [-1, 1].forEach((sd) => {
    const lap = new Path2D(`M${sd * 7.6} -34.5 L${sd * 13} -27 L${sd * 3.4} -18 L0 -14.6 L${sd * 0.6} -15.6 Z`);
    ctx.fillStyle = linear(ctx, sd * 13, -34, 0, -15, [[0, "#4A2C72"], [1, "#24123C"]]); ctx.fill(lap);
    ctx.strokeStyle = neon; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.moveTo(sd * 7.6, -34.5); ctx.lineTo(sd * 13, -27); ctx.lineTo(sd * 3.4, -18); ctx.stroke();
    ctx.strokeStyle = "rgba(0,0,0,0.55)"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(sd * 7, -4); ctx.lineTo(sd * 13, -4); ctx.stroke();
    ctx.strokeStyle = hsl(m.pal.a, 100, 62, 0.5); ctx.lineWidth = 0.3; ctx.beginPath(); ctx.moveTo(sd * 7, -3.4); ctx.lineTo(sd * 13, -3.4); ctx.stroke();
  });
  ctx.strokeStyle = "#8C8CA8"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(0, -14.6); ctx.lineTo(0, 16); ctx.stroke();
  ctx.strokeStyle = "rgba(200,200,230,0.6)"; ctx.lineWidth = 0.25;
  for (let yy = -14; yy < 16; yy += 1.2) { ctx.beginPath(); ctx.moveTo(-0.6, yy); ctx.lineTo(0.6, yy + 0.4); ctx.stroke(); }
  ctx.fillStyle = "#D8D8EC"; ctx.fillRect(-0.7, -11, 1.4, 2.4);
  // the chest patch: a pair of curled horns in a ring (Tempo Goat)
  ctx.fillStyle = "#0E0818"; ctx.beginPath(); ctx.arc(-10, -21, 3.3, 0, TAU); ctx.fill();
  ctx.strokeStyle = "#D9BA7C"; ctx.lineWidth = 0.5; ctx.stroke();
  ctx.strokeStyle = "#F2DBA0"; ctx.lineWidth = 0.55; ctx.lineCap = "round";
  [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.moveTo(-10 + sd * 0.6, -21.6); ctx.quadraticCurveTo(-10 + sd * 2.6, -24, -10 + sd * 2.2, -20.4); ctx.quadraticCurveTo(-10 + sd * 1.6, -19.6, -10 + sd * 1.3, -20.6); ctx.stroke(); });
  ctx.fillStyle = "#F2DBA0"; ctx.beginPath(); ctx.ellipse(-10, -20.2, 0.9, 1.4, 0, 0, TAU); ctx.fill();
  shade(ctx, jacket, [-19.5, -34.5, 39, 50], { rim, shadow: 0.5, spec: 0.12, line: "#05020C", lineW: 0.4 });
  ctx.strokeStyle = neon; ctx.lineWidth = 0.4; ctx.globalAlpha = 0.6 + P.d * 0.4; ctx.stroke(jacket); ctx.globalAlpha = 1;
  glow(ctx, 0, -20, 10, hsl(m.pal.b, 100, 60, 0.9), m.bass * 0.6);
  // shoulder pads
  [-1, 1].forEach((sd) => {
    ctx.fillStyle = radial(ctx, sd * 15.5, -32, 5, [[0, "#5A3888"], [1, "#1A0C2C"]], sd * 14, -34);
    ctx.beginPath(); ctx.ellipse(sd * 15.5, -31.2, 5, 3, sd * 0.25, 0, TAU); ctx.fill();
    ctx.strokeStyle = neon; ctx.lineWidth = 0.35; ctx.stroke();
  });
  // upper arms
  [[[-16, -30], P.uL, 0.6], [[16, -30], P.uR, -0.6]].forEach(([sh, hd, b]) => {
    const r = arm3d(ctx, sh, hd, { bend: b, w0: 6, w1: 3.6, col: DJ_SKIN, rim, bulge: 0.5, sleeve: { to: 0.45, w: 1.35, col: DJ_SLEEVE, trim: neon } });
    hand3d(ctx, hd, r.angle, { n: 3, len: 4.4, w: 1.1, palm: 1.7, spread: m.drop > 0 ? 1.5 : 1, curl: 0.3, col: DJ_SKIN });
  });
  // headphones round the neck
  ctx.strokeStyle = "#0E0E18"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(0, -37, 9.5, 0.15, PI - 0.15); ctx.stroke();
  ctx.strokeStyle = "#3A3A50"; ctx.lineWidth = 0.6; ctx.stroke();
  [-1, 1].forEach((sd) => {
    const hx = sd * 9.6, hy = -34.6;
    ctx.fillStyle = radial(ctx, hx, hy, 4.6, [[0, "#3A3A52"], [1, "#0A0A12"]], hx - sd, hy - 1);
    ctx.beginPath(); ctx.ellipse(hx, hy, 3.6, 4.4, sd * 0.2, 0, TAU); ctx.fill();
    ctx.strokeStyle = neon; ctx.lineWidth = 0.6; ctx.globalAlpha = 0.5 + P.d * 0.5; ctx.beginPath(); ctx.ellipse(hx, hy, 2.4, 3, sd * 0.2, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
  });
  // ── the head ──
  ctx.save(); ctx.translate(0, -38 + P.nod * 0.6); ctx.rotate(Math.sin(m.B * PI) * 0.05 * m.amp + (m.drop > 0 ? -0.08 : 0));
  // great curled horns, ridged (the nod to Tempo Goat)
  [-1, 1].forEach((sd) => {
    ctx.save(); ctx.scale(sd, 1);
    const ridges = [0.12, 0.28, 0.44, 0.6, 0.76, 0.9];
    const o = { col: BONE, rim: "rgba(255,240,200,0.5)", bulge: 0.08, joint: false, bands: ridges, bandCol: "rgba(110,76,30,0.6)" };
    arm3d(ctx, [10.5, -27], [30, -37], { ...o, bend: -0.55, w0: 7.4, w1: 6 });
    arm3d(ctx, [29.6, -37], [32, -16], { ...o, bend: -0.9, w0: 6, w1: 4 });
    arm3d(ctx, [32, -16.2], [23.4, -19], { ...o, bend: -0.9, w0: 4, w1: 1.4, bands: [0.3, 0.6] });
    ctx.fillStyle = "#FFF8E4"; ctx.beginPath(); ctx.arc(23.4, -19, 0.7, 0, TAU); ctx.fill();
    // a pointed ear below the horn
    ctx.fillStyle = linear(ctx, 12, -18, 21, -12, [[0, DJ_SKIN.mid], [1, DJ_SKIN.dark]]);
    ctx.beginPath(); ctx.moveTo(12.6, -17); ctx.quadraticCurveTo(19, -18, 21.6, -12.4); ctx.quadraticCurveTo(17, -11.6, 12.8, -12.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#FF8AC8"; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(14, -15.6); ctx.quadraticCurveTo(18, -16, 19.4, -13.2); ctx.quadraticCurveTo(16.4, -13, 14, -13.6); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.restore();
  });
  // jaw and face
  const jaw = new Path2D("M-12.4 -15 Q-12 -1 0 1.4 Q12 -1 12.4 -15 Z");
  ctx.fillStyle = radial(ctx, -3, -10, 14, [[0, DJ_SKIN.lite], [0.5, DJ_SKIN.mid], [1, DJ_SKIN.dark]], -5, -12); ctx.fill(jaw);
  shade(ctx, jaw, [-12.4, -15, 24.8, 16.4], { rim, shadow: 0.5, spec: 0.15, line: DJ_SKIN.line, lineW: 0.3 });
  // the cranium: translucent, its brain lighting with the bass
  const skull = new Path2D(); skull.ellipse(0, -22, 15, 17, 0, 0, TAU);
  ctx.fillStyle = radial(ctx, 0, -24, 18, [[0, DJ_SKIN.lite], [0.55, DJ_SKIN.mid], [1, DJ_SKIN.dark]], -5, -30); ctx.fill(skull);
  shade(ctx, skull, [-15, -39, 30, 34], { rim, shadow: 0.45, spec: 0.1, line: DJ_SKIN.line, lineW: 0.3 });
  const dome = new Path2D(); dome.ellipse(0, -27, 13, 11.5, 0, PI, TAU); dome.ellipse(0, -27, 13, 3, 0, 0, PI);
  ctx.save(); ctx.clip(dome);
  ctx.fillStyle = "rgba(24,8,44,0.6)"; ctx.fillRect(-14, -40, 28, 16);
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = hsl(m.pal.b, 100, 70, 0.45 + m.bass * 0.55); ctx.lineWidth = 0.9;
  for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(-11.5, -30.5 + k * 1.2); for (let xx = -11.5; xx <= 11.5; xx += 1.5) ctx.lineTo(xx, -30.5 + k * 1.2 + Math.sin(xx * 0.8 + k * 1.7 + m.t * 3) * 1.4 - (k < 2 ? 3 : 0)); ctx.stroke(); }
  ctx.strokeStyle = hsl(m.pal.a, 100, 75, 0.35); ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(0, -38.5); ctx.lineTo(0, -25); ctx.stroke();
  glow(ctx, 0, -31, 14, hsl(m.pal.b, 100, 65, 0.9), 0.3 + m.bass * 0.7);
  ctx.restore();
  ctx.strokeStyle = "rgba(255,225,250,0.55)"; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.ellipse(0, -27, 13, 11.5, 0, PI, TAU); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 0.9; ctx.lineCap = "round"; ctx.beginPath(); ctx.ellipse(0, -27, 10.6, 9.2, 0, PI + 0.5, PI + 1.3); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.beginPath(); ctx.arc(5.6, -34.4, 0.7, 0, TAU); ctx.fill();
  // the visor, showing the spectrum
  const visor = new Path2D(); visor.roundRect ? visor.roundRect(-13.4, -19.4, 26.8, 7, 3.2) : visor.rect(-13.4, -19.4, 26.8, 7);
  ctx.fillStyle = "#06040C"; ctx.fill(visor);
  ctx.save(); ctx.clip(visor); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 12; i++) {
    const v = bins ? bins[2 + i * 5] / 255 : 0.3 + 0.3 * Math.sin(m.t * 4 + i);
    const bh = 0.6 + v * 5.4;
    ctx.fillStyle = hsl(lerp(m.pal.a, m.pal.b, i / 11), 100, 65, 0.95);
    ctx.fillRect(-11.6 + i * 1.95, -12.8 - bh, 1.3, bh);
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.moveTo(-13, -19.4); ctx.lineTo(-4, -19.4); ctx.lineTo(-9, -12.4); ctx.lineTo(-13, -12.4); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "#45405E"; ctx.lineWidth = 0.7; ctx.stroke(visor);
  ctx.strokeStyle = neon; ctx.lineWidth = 0.3; ctx.globalAlpha = 0.7; ctx.stroke(visor); ctx.globalAlpha = 1;
  // nose, cheek lights, grin
  ctx.strokeStyle = DJ_SKIN.line; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(-1.2, -11.2); ctx.lineTo(-0.7, -10.2); ctx.moveTo(1.2, -11.2); ctx.lineTo(0.7, -10.2); ctx.stroke();
  [-1, 1].forEach((sd) => { [0, 1, 2].forEach((k) => { const cx = sd * (7.4 + k * 0.9), cy = -9.6 + k * 1.1; ctx.fillStyle = hsl(m.pal.b, 100, 75, 1); ctx.beginPath(); ctx.arc(cx, cy, 0.35, 0, TAU); ctx.fill(); glow(ctx, cx, cy, 1.4, hsl(m.pal.b, 100, 70, 0.9), 0.4 + P.d * 0.5); }); });
  const open = m.drop > 0 ? 2.8 : m.build > 0 ? 1.6 : 0.7;
  ctx.fillStyle = "#1A0618"; ctx.beginPath(); ctx.moveTo(-6.4, -7); ctx.quadraticCurveTo(0, -7 + open * 2.4, 6.4, -7); ctx.quadraticCurveTo(0, -5.6, -6.4, -7); ctx.fill();
  if (open > 1.2) { ctx.fillStyle = "#FF6AA8"; ctx.beginPath(); ctx.ellipse(0, -7 + open * 1.5, 2.4, 0.9, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = "#FBF1F8"; ctx.beginPath(); ctx.moveTo(-5, -6.9); ctx.quadraticCurveTo(0, -6.2, 5, -6.9); ctx.lineTo(4.6, -6.3); ctx.quadraticCurveTo(0, -5.6, -4.6, -6.3); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(60,10,50,0.4)"; ctx.lineWidth = 0.15; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(k * 1.6, -6.8); ctx.lineTo(k * 1.6, -6.1); ctx.stroke(); }
  ctx.restore(); // head
  ctx.restore(); // torso
  ctx.restore();
}

// ─────────── the booth's top: decks and mixer ───────────
export function drawBoothTop(ctx, L, m, bins) {
  const { x, y, s } = L.booth;
  const P = djPose(m);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const top = new Path2D("M-45 -10 L45 -10 L53 0 L-53 0 Z");
  ctx.fillStyle = linear(ctx, 0, -10, 0, 0, [[0, "#14122A"], [1, "#26244A"]]); ctx.fill(top);
  ctx.strokeStyle = "#3C3A62"; ctx.lineWidth = 0.4; ctx.stroke(top);
  // two decks
  [-1, 1].forEach((sd) => {
    const cx = sd * DECK;
    const base = new Path2D(`M${cx - 9.4} -9.2 L${cx + 9.4} -9.2 L${cx + 11.4} -0.8 L${cx - 11.4} -0.8 Z`);
    ctx.fillStyle = linear(ctx, 0, -9, 0, 0, [[0, "#0A0914"], [1, "#1C1A30"]]); ctx.fill(base);
    ctx.strokeStyle = "#4A4870"; ctx.lineWidth = 0.3; ctx.stroke(base);
    // its screen, a waveform scrolling past
    ctx.fillStyle = "#04030A"; ctx.fillRect(cx - 5, -8.8, 10, 1.6);
    ctx.save(); ctx.beginPath(); ctx.rect(cx - 5, -8.8, 10, 1.6); ctx.clip();
    for (let k = 0; k < 24; k++) {
      const v = 0.3 + 0.7 * Math.abs(Math.sin((k + Math.floor(m.B * 4) * (sd > 0 ? 1 : 1.3)) * 1.7));
      ctx.fillStyle = hsl(sd > 0 ? m.pal.b : m.pal.a, 100, 60, 0.9); ctx.fillRect(cx - 5 + k * 0.42, -8 - v * 0.7, 0.3, v * 1.4);
    }
    ctx.fillStyle = "#fff"; ctx.fillRect(cx - 0.1, -8.8, 0.2, 1.6);
    ctx.restore();
    // the jog wheel
    const jx = cx + (sd < 0 ? P.scratch * 0.0 : 0);
    ctx.fillStyle = linear(ctx, jx - 8, JOG_Y - 3, jx + 8, JOG_Y + 3, [[0, "#8A8AA6"], [0.5, "#30304A"], [1, "#6A6A86"]]);
    ctx.beginPath(); ctx.ellipse(jx, JOG_Y, 8.2, 2.8, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = hsl(sd > 0 ? m.pal.b : m.pal.a, 100, 62, 0.6 + P.d * 0.4); ctx.lineWidth = 0.5; ctx.stroke();
    glow(ctx, jx, JOG_Y, 9, hsl(sd > 0 ? m.pal.b : m.pal.a, 100, 60, 0.6), 0.25 + P.d * 0.25);
    ctx.fillStyle = "#08070E"; ctx.beginPath(); ctx.ellipse(jx, JOG_Y, 6.8, 2.25, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 0.25;
    [5.6, 4.4, 3.2].forEach((r) => { ctx.beginPath(); ctx.ellipse(jx, JOG_Y, r, r * 0.33, 0, 0, TAU); ctx.stroke(); });
    const spin = m.B * PI * 0.5 * sd + (sd < 0 ? P.scratch * 1.2 : 0);
    ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 0.45;
    ctx.beginPath(); ctx.moveTo(jx, JOG_Y); ctx.lineTo(jx + Math.cos(spin) * 6.6, JOG_Y + Math.sin(spin) * 2.2); ctx.stroke();
    ctx.fillStyle = hsl(sd > 0 ? m.pal.b : m.pal.a, 90, 55, 1); ctx.beginPath(); ctx.ellipse(jx, JOG_Y, 1.6, 0.55, 0, 0, TAU); ctx.fill();
    // performance pads, lighting in turn
    for (let k = 0; k < 4; k++) {
      const on = (Math.floor(m.B * 2) % 4) === k;
      ctx.fillStyle = on ? hsl(k % 2 ? m.pal.a : m.pal.b, 100, 65, 1) : "#24223C";
      ctx.fillRect(cx - 7 + k * 3.8, -1.6, 2.6, 0.7);
    }
  });
  // the mixer
  const mix = new Path2D("M-11 -9.6 L11 -9.6 L12.6 -0.6 L-12.6 -0.6 Z");
  ctx.fillStyle = linear(ctx, 0, -9.6, 0, 0, [[0, "#0C0B16"], [1, "#1E1C32"]]); ctx.fill(mix);
  ctx.strokeStyle = "#4A4870"; ctx.lineWidth = 0.3; ctx.stroke(mix);
  for (let c = 0; c < 4; c++) {
    const cx = -7.2 + c * 4.8, k = 1 + (c - 1.5) * 0.02;
    for (let r = 0; r < 3; r++) {
      const ky = -8.6 + r * 1.3;
      ctx.fillStyle = "#3A3856"; ctx.beginPath(); ctx.ellipse(cx * k, ky, 0.9, 0.42, 0, 0, TAU); ctx.fill();
      const a = Math.sin(m.t * 0.7 + c * 2 + r) * 1.2;
      ctx.strokeStyle = "#E8E8F8"; ctx.lineWidth = 0.18; ctx.beginPath(); ctx.moveTo(cx * k, ky); ctx.lineTo(cx * k + Math.sin(a) * 0.8, ky - Math.cos(a) * 0.35); ctx.stroke();
    }
    // fader slot and cap
    ctx.fillStyle = "#04030A"; ctx.fillRect(cx * k - 0.2, -4.6, 0.4, 2.6);
    const lv = clamp(m.level * 1.1 - c * 0.05, 0, 1);
    ctx.fillStyle = "#D8D8EA"; ctx.fillRect(cx * k - 0.8, -2.4 - lv * 2, 1.6, 0.55);
    // level LEDs
    for (let l = 0; l < 5; l++) {
      const on = lv * 5 > l;
      ctx.fillStyle = on ? hsl(l > 3 ? 0 : l > 2 ? 45 : 140, 100, 58, 1) : "#1E1C30";
      ctx.fillRect(cx * k + 1.3, -1.8 - l * 0.6, 0.5, 0.42);
    }
  }
  // crossfader
  ctx.fillStyle = "#04030A"; ctx.fillRect(-4, -1.3, 8, 0.4);
  ctx.fillStyle = "#F0F0FF"; ctx.fillRect(-0.9 + (P.scr ? Math.sin(m.B * PI * 2) * 3 : 0), -1.55, 1.8, 0.9);
  ctx.restore();
}

// ─────────── the DJ's lower arms and hands, on the gear ───────────
export function drawDJHands(ctx, L, m) {
  const { x, y, s } = L.booth;
  const P = djPose(m);
  const rim = hsl(m.pal.b, 100, 72, 0.85), neon = hsl(m.pal.a, 100, 62, 1);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(0, DJ_Y);
  [[[-14 + P.torso[0], -22 + P.torso[1]], P.lL, -0.5], [[14 + P.torso[0], -22 + P.torso[1]], P.lR, 0.5]].forEach(([sh, hd, b]) => {
    const r = arm3d(ctx, sh, hd, { bend: b, w0: 6.2, w1: 3.8, col: DJ_SKIN, rim, bulge: 0.5, sleeve: { to: 0.4, w: 1.35, col: DJ_SLEEVE, trim: neon } });
    // fingers spread flat over a platter, or pinched on a fader / knob
    const flat = Math.abs(hd[0]) > 20;
    hand3d(ctx, hd, r.angle, { n: 3, len: flat ? 4.6 : 3.6, w: 1.15, palm: 1.9, spread: flat ? 1.5 : 0.7, curl: flat ? 0.1 : 0.6, col: DJ_SKIN });
  });
  ctx.restore();
}

// ─────────── the booth's front panel ───────────
export function drawBoothFront(ctx, L, m, title, bins) {
  const { x, y, s } = L.booth;
  const d = dipOf(m);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const panel = new Path2D("M-53 0 L53 0 L49.5 30 L-49.5 30 Z");
  ctx.fillStyle = linear(ctx, 0, 0, 0, 30, [[0, "#1E1C3A"], [0.5, "#121026"], [1, "#07060F"]]); ctx.fill(panel);
  ctx.fillStyle = linear(ctx, 0, 0, 0, 2, [[0, "#4A4874"], [1, "#24223E"]]); ctx.fillRect(-53, 0, 106, 2);
  ctx.strokeStyle = hsl(m.pal.a, 100, 62, 0.7 + d * 0.3); ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(-53, 0.2); ctx.lineTo(53, 0.2); ctx.stroke();
  // the ticker, recessed, up top where it can't be hidden
  ctx.fillStyle = "#020106"; ctx.fillRect(-43, 3.4, 86, 9.6);
  ctx.strokeStyle = "#000"; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(-43, 3.4); ctx.lineTo(43, 3.4); ctx.stroke();
  ctx.strokeStyle = "#3A3860"; ctx.beginPath(); ctx.moveTo(-43, 13); ctx.lineTo(43, 13); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(-42.4, 3.8, 84.8, 8.8); ctx.clip();
  const text = `${title ? title.toUpperCase() : "13i"}   ·   THE RAVE   ·   13i.space   ·   `;
  ctx.font = "700 7.4px ui-monospace, Menlo, monospace"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
  const tw = ctx.measureText(text).width;
  const off = -((m.t * 14) % tw);
  ctx.fillStyle = hsl(m.pal.b, 100, 72, 1);
  for (let k = 0; k < 3; k++) ctx.fillText(text, -42 + off + k * tw, 8.3);
  ctx.fillStyle = "rgba(0,0,0,0.42)";
  for (let gx = -42.4; gx < 42.4; gx += 1.1) ctx.fillRect(gx, 3.8, 0.32, 8.8);
  ctx.restore();
  glow(ctx, 0, 8.3, 30, hsl(m.pal.b, 100, 60, 0.5), 0.25);
  // level meters either side
  [-1, 1].forEach((sd) => {
    for (let i = 0; i < 9; i++) {
      const v = bins ? bins[2 + (sd > 0 ? i : 8 - i) * 6] / 255 : 0.3 + 0.3 * Math.sin(m.t * 4 + i);
      const bx = sd * (13 + i * 3.5) - (sd < 0 ? 2.2 : 0);
      for (let l = 0; l < 6; l++) {
        const on = v * 6 > l;
        ctx.fillStyle = on ? hsl(lerp(m.pal.a, m.pal.b, l / 5), 100, 58, 1) : "#16142A";
        ctx.fillRect(bx, 25.5 - l * 1.7, 2.2, 1.2);
      }
    }
  });
  // the emblem: a ring with 13i in it, a pair of curled horns either side
  const ex = 0, ey = 20;
  [-1, 1].forEach((sd) => {
    ctx.strokeStyle = "#D9BA7C"; ctx.lineWidth = 1.4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ex + sd * 5.6, ey - 3.4); ctx.bezierCurveTo(ex + sd * 11, ey - 9, ex + sd * 14, ey - 1, ex + sd * 10.4, ey + 2.4); ctx.bezierCurveTo(ex + sd * 8.6, ey + 3.6, ex + sd * 7.6, ey + 1, ex + sd * 9.2, ey - 0.2); ctx.stroke();
    ctx.strokeStyle = "rgba(255,246,218,0.8)"; ctx.lineWidth = 0.4; ctx.stroke();
  });
  ctx.fillStyle = "#06050C"; ctx.beginPath(); ctx.arc(ex, ey, 5.6, 0, TAU); ctx.fill();
  ctx.strokeStyle = hsl(m.pal.a, 100, 65, 0.9); ctx.lineWidth = 0.8; ctx.stroke();
  glow(ctx, ex, ey, 10, hsl(m.pal.a, 100, 60, 0.9), 0.35 + d * 0.5);
  ctx.font = "700 4.2px ui-monospace, Menlo, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#FFFFFF";
  ctx.fillText("13i", ex, ey + 0.3);
  // the kick plate and its light strip
  ctx.fillStyle = "#050409"; ctx.fillRect(-49.5, 27.6, 99, 2.4);
  for (let k = 0; k < 24; k++) {
    const on = (Math.floor(m.B * 4) % 24) === k || (Math.floor(m.B * 4) % 24) === 23 - k;
    ctx.fillStyle = on ? hsl(m.pal.b, 100, 70, 1) : "#1A1830"; ctx.fillRect(-47 + k * 3.95, 28.4, 2.4, 0.7);
  }
  // corner light strips, chasing
  for (let k = 0; k < 9; k++) {
    const on = (Math.floor(m.B * 2) % 9) === k;
    [[-51.4 + k * 0.38, 2.6 + k * 2.8], [51.4 - k * 0.38, 2.6 + k * 2.8]].forEach(([lx, ly]) => { ctx.fillStyle = on ? hsl(m.pal.a, 100, 70, 1) : "#1E1C34"; ctx.fillRect(lx - 0.8, ly, 1.6, 1.8); });
  }
  shade(ctx, panel, [-53, 0, 106, 30], { rim: hsl(m.pal.b, 100, 70, 0.6), shadow: 0.35, spec: 0.06, line: "#05040A", lineW: 0.4 });
  ctx.restore();
}

// the stage lip with a light strip
export function drawStageLip(ctx, L, m) {
  const lipY = L.floorTop - 1;
  ctx.fillStyle = linear(ctx, 0, lipY - 1.2, 0, lipY + 1.4, [[0, "#1A1830"], [1, "#05040C"]]); ctx.fillRect(-30, lipY - 1.2, L.VW + 60, 2.6);
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = -30; i < L.VW + 30; i += 1.6) {
    const k = Math.abs(i - L.cx) / L.VW;
    const on = 0.25 + 0.75 * Math.max(0, Math.cos((k * 6 - m.B) * PI));
    ctx.fillStyle = hsl(lerp(m.pal.a, m.pal.b, k * 2), 100, 60, on * 0.7);
    ctx.fillRect(i, lipY - 0.3, 1, 0.6);
  }
  ctx.restore();
}
