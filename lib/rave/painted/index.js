// The Rave's characters, painted per pixel (Update 6.13; in costume on the extended remixes since 6.15). Same designs, poses
// and moves as lib/rave/booth.js and lib/rave/dancers.js, but lit like the
// Oracle: a key light from above, the stage's two colours as rim lights,
// gloss, light through thin skin, glows. The DJ and Ilu are painted whole;
// Varrow, Qeth and Ixxen have their heads (and Varrow its orb) painted and
// keep their drawn robes and mantles.
//
// Each character is one small WebGL canvas, drawn into the Rave's 2D canvas
// in place of the old drawing. If WebGL is missing or anything fails, the
// caller falls back to the drawn version (and stays there).
// Designed in the "The Rave, Repainted" look-lab artifact.
import { clamp, glow } from "../draw";
import { FRAG, BOX } from "./djShader";
import { IFRAG, IBOX } from "./iluShader";
import { makeGL } from "./glutil";
import { makeVarrow } from "./varrow";
import { makeQeth } from "./qeth";
import { makeIxxen } from "./ixxen";
import { makeGuests, guestAt } from "./guests";
import { paintGirlNow } from "./girl";
import { drawCicada } from "../cicada";
import { paintBug } from "./cicada";
import { iluWings, iluEars, iluFangs } from "../costumes";
import { rangerHat } from "../cicada";
import { paintBatWings, paintBatEars, paintRangerHat, fangs } from "./costumes";

const PI = Math.PI, TAU = Math.PI * 2;
const lerp = (a, b, k) => a + (b - a) * k;
const IST = { blink: 0 };
let broken = false;

// ---------- the DJ's pose (as lib/rave/booth.js) ----------
const DECK = 29, JOG_Y = -3.6, DJ_Y = -7;
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);
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
  else if (m.e < 0.45 || Math.floor(m.B / 16) % 2 === 1) { uL = [-12, -54]; uR = [26, -14 + Math.sin(m.B * PI) * 2]; }
  else { uL = [-24, -14 + Math.sin(m.B * PI) * 2]; uR = [16 + Math.sin(m.B * PI * 0.5) * 8, -42 - d * 4]; }
  return { d, nod, sway, torso, scr, scratch, lL, lR, uL, uR };
}
// a shoulder, a hand, and an elbow that bends away from the body
function armPts(sh, hd, side, bend) {
  const dx = hd[0] - sh[0], dy = hd[1] - sh[1], L = Math.hypot(dx, dy) || 1;
  let px = -dy / L, py = dx / L;
  if (px * side < 0) { px = -px; py = -py; }
  const k = Math.abs(bend) * L * 0.3;
  return [sh, [(sh[0] + hd[0]) / 2 + px * k, (sh[1] + hd[1]) / 2 + py * k + k * 0.25], hd];
}

// ---------- the per-pixel DJ ----------
let G = null, GI = null, VAR = null, QETH = null, IXX = null, ready = false;
function init() {
  if (ready) return;
  ready = true;
  G = makeGL(FRAG, BOX, ["uRes", "uPass", "uT", "uBass", "uDip", "uDrop", "uNod", "uHeadRot", "uSway", "uOpen", "uHueA", "uHueB", "uLevel", "uTorso"], ["uU", "uUH", "uL", "uLH", "uSpec"], "BOX_");
  VAR = makeVarrow();
  QETH = makeQeth();
  IXX = makeIxxen();
  GI = makeGL(IFRAG, IBOX, ["uRes", "uT", "uB", "uBass", "uHigh", "uHueA", "uHueB", "uMouth", "uBlink", "uMirror", "uFloat", "uLook"], ["uTP", "uTI", "uAP"], "IBOX_");
}

function djUniforms(m, bins) {
  const P = djPose(m);
  const { gl, U } = G;
  gl.uniform1f(U.uT, m.t); gl.uniform1f(U.uBass, m.bass); gl.uniform1f(U.uDip, P.d); gl.uniform1f(U.uDrop, m.drop);
  gl.uniform1f(U.uNod, P.nod); gl.uniform1f(U.uHeadRot, Math.sin(m.B * PI) * 0.05 * m.amp + (m.drop > 0 ? -0.08 : 0));
  gl.uniform1f(U.uSway, Math.sin(m.B * PI) * 1.2 * m.amp);
  gl.uniform1f(U.uOpen, m.drop > 0 ? 2.8 : m.build > 0 ? 1.6 : 0.7);
  gl.uniform1f(U.uHueA, m.pal.a); gl.uniform1f(U.uHueB, m.pal.b); gl.uniform1f(U.uLevel, m.level);
  gl.uniform2f(U.uTorso, P.torso[0], P.torso[1]);
  const upL = armPts([-16, -30], P.uL, -1, 0.6), upR = armPts([16, -30], P.uR, 1, 0.6);
  gl.uniform2fv(U.uU, new Float32Array([...upL[0], ...upL[1], ...upL[2], ...upR[0], ...upR[1], ...upR[2]]));
  const ang = (a) => Math.atan2(a[2][1] - a[1][1], a[2][0] - a[1][0]);
  const spread = m.drop > 0 ? 1.5 : 1;
  gl.uniform4fv(U.uUH, new Float32Array([ang(upL), spread, 0.3, 4.4, ang(upR), spread, 0.3, 4.4]));
  const shL = [-14 + P.torso[0], -22 + P.torso[1]], shR = [14 + P.torso[0], -22 + P.torso[1]];
  const loL = armPts(shL, P.lL, -1, 0.5), loR = armPts(shR, P.lR, 1, 0.5);
  gl.uniform2fv(U.uL, new Float32Array([...loL[0], ...loL[1], ...loL[2], ...loR[0], ...loR[1], ...loR[2]]));
  const hp = (hd) => { const flat = Math.abs(hd[0]) > 20; return [flat ? 4.6 : 3.6, flat ? 1.5 : 0.7, flat ? 0.1 : 0.6]; };
  const hL = hp(P.lL), hR = hp(P.lR);
  gl.uniform4fv(U.uLH, new Float32Array([ang(loL), hL[1], hL[2], hL[0], ang(loR), hR[1], hR[2], hR[0]]));
  const sp = new Float32Array(12);
  for (let i = 0; i < 12; i++) sp[i] = bins ? bins[2 + i * 5] / 255 : 0.3 + 0.3 * Math.sin(m.t * 4 + i);
  gl.uniform1fv(U.uSpec, sp);
}
// draw one pass of the new DJ into the scene, inside the booth's transform
function drawNewDJ(ctx, L, m, bins, pass) {
  const { x, y, s } = L.booth;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const tf = ctx.getTransform();
  const k = Math.hypot(tf.a, tf.b);
  let w = Math.round(BOX.w * k), h = Math.round(BOX.h * k);
  const cap = 1500 / Math.max(w, h); if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
  const { gl, U, c } = G;
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  gl.viewport(0, 0, w, h);
  gl.uniform2f(U.uRes, w, h);
  djUniforms(m, bins);
  gl.uniform1f(U.uPass, pass);
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  ctx.drawImage(c, BOX.x0, BOX.y0, BOX.w, BOX.h);
  ctx.restore();
}

// ---------- the per-pixel Ilu (geometry as lib/rave/dancers.js) ----------
function bez2(a, c, b, t) { const u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]; }
function bez3(a, b, c, d, t) { const u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; }
function drawIluNew(ctx, p, m) {
  const lift = p.lift - p.float * 46;
  const hv = clamp(1 + lift / 70, 0.25, 1.2);
  ctx.save(); ctx.scale(1, 0.3); ctx.fillStyle = `rgba(0,0,0,${0.45 * hv})`; ctx.beginPath(); ctx.arc(0, 0, 26 * hv, 0, TAU); ctx.fill(); ctx.restore();
  glow(ctx, 0, -2, 30 * hv, "rgba(143,230,255,0.6)", (0.5 + m.bass * 0.4) * hv);
  if (p.float > 0.3) {
    for (let k = 0; k < 8; k++) {
      const s = ((m.t * 1.4 + k / 8) % 1), x = Math.sin(k * 2.3 + m.t) * 10 * s, y = lift - 30 + s * 40;
      glow(ctx, x, y, 3 + s * 2, `hsla(${k % 2 ? m.pal.a : m.pal.b},100%,75%,0.9)`, (1 - s) * p.float * 0.8);
    }
  }
  ctx.save();
  ctx.translate(0, lift - 4); ctx.rotate(p.rot); ctx.translate(0, -78); ctx.scale(p.sx, p.sy); ctx.translate(-60, -70);
  // the tentacles, far ones first
  const ts = [];
  for (let i = 0; i < 7; i++) {
    const a = PI * (i / 6) + p.spin;
    const bx = 60 - Math.cos(a) * 24, depth = Math.sin(a);
    const out = p.flare * Math.sign(bx - 60) * (0.4 + 0.6 * Math.abs(Math.cos(a)));
    const trail = p.float * 0.25 * Math.sin(m.t * 2 + i);
    const ang = (p.tent[i] || 0) + out + trail;
    const L = 46 * (0.88 + 0.12 * depth) * (1 + p.float * 0.12);
    ts.push({ i, bx, depth, ang, L });
  }
  ts.sort((a, b) => a.depth - b.depth);
  const TP = new Float32Array(126), TI = new Float32Array(28), tips = [];
  ts.forEach(({ i, bx, depth, ang, L }, k) => {
    const S = [bx, 90], T = [bx + Math.sin(ang) * L, 92 + Math.cos(ang) * L];
    const dx = T[0] - S[0], dy = T[1] - S[1], ln = Math.hypot(dx, dy) || 1;
    const bend = (p.curl[i] || 0) * 0.9;
    const C = [(S[0] + T[0]) / 2 - dy / ln * bend * L * 0.35, (S[1] + T[1]) / 2 + dx / ln * bend * L * 0.35];
    for (let j = 0; j < 9; j++) { const q = bez2(S, C, T, j / 8); TP[(k * 9 + j) * 2] = q[0]; TP[(k * 9 + j) * 2 + 1] = q[1]; }
    TI[k * 4] = depth; TI[k * 4 + 1] = (7 - Math.abs(i - 3) * 0.5) / 2; TI[k * 4 + 2] = 0.85; TI[k * 4 + 3] = bx < 60 ? 1 : -1;
    tips[i] = T;
  });
  // the antennae
  const AP = new Float32Array(24);
  [[54, 39, 40, 18, -1], [66, 39, 84, 22, 1]].forEach(([x0, y0, x1, y1, s], n) => {
    const a = p.ant * s * 0.5 - p.float * s * 0.3;
    const dx = x1 - x0, dy = y1 - y0;
    const tx = x0 + dx * Math.cos(a) - dy * Math.sin(a), ty = y0 + dx * Math.sin(a) + dy * Math.cos(a);
    const P0 = [x0, y0], P1 = [x0 + (tx - x0) * 0.1, y0 + (ty - y0) * 0.5], P2 = [x0 + (tx - x0) * 0.5, y0 + (ty - y0) * 0.9], P3 = [tx, ty];
    for (let j = 0; j < 6; j++) { const q = bez3(P0, P1, P2, P3, j / 5); AP[(n * 6 + j) * 2] = q[0]; AP[(n * 6 + j) * 2 + 1] = q[1]; }
  });
  // the bat's wings and ears, behind the orb (Update 6.15)
  if (m.halloween) { if (!paintBatWings(ctx, p, m)) iluWings(ctx, p, m); if (!paintBatEars(ctx, m)) iluEars(ctx); }
  // render
  const tf = ctx.getTransform(); const k = Math.hypot(tf.a, tf.b);
  let w = Math.round(IBOX.w * k), h = Math.round(IBOX.h * k);
  const cap = 1400 / Math.max(w, h); if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
  const { gl, U, c } = GI;
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  gl.viewport(0, 0, w, h);
  gl.uniform2f(U.uRes, w, h); gl.uniform1f(U.uT, m.t); gl.uniform1f(U.uB, m.B); gl.uniform1f(U.uBass, m.bass); gl.uniform1f(U.uHigh, m.high);
  gl.uniform1f(U.uHueA, m.pal.a); gl.uniform1f(U.uHueB, m.pal.b); gl.uniform1f(U.uMouth, p.mouth); gl.uniform1f(U.uMirror, p.mirror); gl.uniform1f(U.uFloat, p.float);
  const blink = !p.mirror && (m.t % 3.9) > 3.78 ? 1 : 0;
  IST.blink = (IST.blink || 0) + (blink - (IST.blink || 0)) * 0.6;
  gl.uniform1f(U.uBlink, IST.blink);
  gl.uniform2f(U.uLook, p.look[0], p.look[1]);
  gl.uniform2fv(U.uTP, TP); gl.uniform4fv(U.uTI, TI); gl.uniform2fv(U.uAP, AP);
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  ctx.drawImage(c, IBOX.x0, IBOX.y0, IBOX.w, IBOX.h);
  if (m.halloween) fangs(ctx, [55.4, 64.6], 87.6 + (p.mouth || 0) * 1.5, 4.2 + (p.mouth || 0) * 1.5, 1.4);
  if (m.cicada && !paintRangerHat(ctx, m, 60, 42, 52, -0.06)) rangerHat(ctx, 60, 42, 52, -0.06);
  // glowsticks in the outer tentacles (as before)
  if (p.sticks > 0.05) {
    [[0, m.pal.a], [6, m.pal.b]].forEach(([i, hue], n) => {
      const [x, y] = tips[i], a = p.stickA * (n ? -1 : 1) + n;
      for (let kk = 1; kk <= 5; kk++) {
        const b = a - kk * 0.22 * (n ? -1 : 1);
        ctx.strokeStyle = `hsla(${hue},100%,60%,${(0.35 - kk * 0.06) * p.sticks})`; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x - Math.cos(b) * 9, y - Math.sin(b) * 9); ctx.lineTo(x + Math.cos(b) * 9, y + Math.sin(b) * 9); ctx.stroke();
      }
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * 9, y - Math.sin(a) * 9); ctx.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); ctx.stroke();
      ctx.strokeStyle = `hsla(${hue},100%,65%,${p.sticks})`; ctx.lineWidth = 3.6; ctx.globalCompositeOperation = "lighter"; ctx.stroke(); ctx.globalCompositeOperation = "source-over";
      glow(ctx, x, y, 22, `hsla(${hue},100%,60%,0.9)`, p.sticks);
    });
  }
  ctx.restore();
}


// the DJ: pass 0 is the body (under the decks), pass 1 the lower arms (on top)
export function paintDJ(ctx, L, m, bins, pass) {
  if (broken) return false;
  try { init(); if (!G) return false; drawNewDJ(ctx, L, m, bins, pass); return true; }
  catch (e) { broken = true; console.error(e); return false; }
}
// a dancer: true if it was painted, false to draw it the old way
export function paintDancer(key, ctx, p, m) {
  if (broken) return false;
  try {
    init();
    if (key === "ilu" && GI) { drawIluNew(ctx, p, m); return true; }
    if (key === "varrow" && VAR) { VAR(ctx, p, m); return true; }
    if (key === "qeth" && QETH) { QETH(ctx, p, m); return true; }
    if (key === "ixxen" && IXX) { IXX(ctx, p, m); return true; }
    return false;
  } catch (e) { broken = true; console.error(e); return false; }
}

// ---------- guests (Update 6.14) ----------
// Now and then a XenoKlash fighter drops in for a drop: flies in on the
// build, lands on the downbeat, dances, does its signature move and leaves.
// Rare on purpose - about one drop in ten; ?guest brings one every drop.
let GU = null, guestsBroken = false;
const GUEST_EVERY = typeof window !== "undefined" && /[?&]guest\b/.test(window.location.search);
export function guestNow(B, drops, seed) {
  if (guestsBroken || !drops || !drops.length) return null;
  return guestAt(B, drops, (i, d) => GUEST_EVERY || (i > 0 || drops.length === 1) && hashGuest(seed, i, d) < 0.1);
}
function hashGuest(...n) {
  let h = 2166136261;
  for (const v of n) { h ^= (v | 0) + 0x9e3779b9; h = Math.imul(h, 16777619); h ^= h >>> 13; }
  return ((h >>> 0) % 100000) / 100000;
}
export const GUEST_HEIGHT = 100;
const TITLES = { sypher: ["SYPHER", "VOID PILOT · XENOKLASH"] };
export function guestTitle(V) { return V ? TITLES[V.name] : null; }
// draw the guest (feet at the origin, GUEST_HEIGHT units tall); false if it can't
export function paintGuest(ctx, V, m) {
  if (guestsBroken || !V) return false;
  try { if (!GU) GU = makeGuests(); GU.draw[V.name](ctx, V, m); return true; }
  catch (e) { guestsBroken = true; console.error(e); return false; }
}

// ---------- the extended remixes' own characters (Update 6.15) ----------
let girlBroken = false;
export function paintGirl(ctx, m, on, mouth, whisper) {
  if (girlBroken) return false;
  try { return paintGirlNow(ctx, m, on, mouth, whisper); } catch (e) { girlBroken = true; console.error(e); return false; }
}
let cicadaBroken = false;
export function paintCicada(ctx, L, m) {
  if (cicadaBroken) return false;
  try { drawCicada(ctx, L, m, paintBug); return true; } catch (e) { cicadaBroken = true; console.error(e); return false; }
}
