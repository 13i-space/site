// The cicada of the Cicada remix, painted per pixel (Update 6.15): the same
// life on the same clock as lib/rave/cicada.js (drawCicada runs the story;
// this paints each bug in it), with the same poses.
import { TAU, lerp, clamp } from "../draw";
import { bug } from "../cicada";
import { makeGL } from "./glutil";
import { KFRAG, CBOX } from "./cicadaShader";

const PI = Math.PI;
let G = null, tried = false;
function gl() {
  if (!tried) { tried = true; G = makeGL(KFRAG, CBOX, ["uRes", "uBox", "uT", "uBass", "uHueA", "uHueB", "uForm", "uHard", "uPads", "uWing", "uRub", "uDip", "uMid", "uHead", "uChirp", "uShell", "uSplit", "uGlowIn", "uWingA", "uFL", "uFR"], [], "KB_"); }
  return G;
}

// one cicada at the current transform (feet at 0,0, about 100 tall); o as in
// lib/rave/cicada.js's bug(). Falls back to the drawn bug.
export function paintBug(ctx, o, m) {
  const R = gl();
  if (!R) return bug(ctx, o, m);
  const nym = o.form === "nymph";
  ctx.save();
  if (o.shell) ctx.globalAlpha *= 0.86;
  ctx.translate(0, -(o.jump || 0));
  ctx.rotate(o.lean || 0);
  ctx.scale(1 + (o.dip || 0) * 0.03, 1 - (o.dip || 0) * 0.05);
  // the front legs, as bug() works them out
  const arm = (s, a) => {
    const sx = s * 13, sy = -60, up = a;
    const fa = PI / 2 - s * (0.5 + up * 1.15);
    const L1 = nym ? 13 : 12, L2 = nym ? 11 : 12;
    const ex = sx + Math.cos(fa) * L1, ey = sy + Math.sin(fa) * L1;
    const ta = fa + s * lerp(0.9, -0.7, clamp(up / 1.5, 0, 1));
    return [ex, ey, ex + Math.cos(ta) * L2, ey + Math.sin(ta) * L2];
  };
  const wa = (s) => s * (0.35 + (o.spread || 0) * 0.85 + (o.rub || 0) * 0.22) + (o.chirp ? Math.sin(m.t * 70 + s) * 0.06 * o.chirp : 0);
  const tf = ctx.getTransform();
  let k = Math.max(Math.hypot(tf.a, tf.b), Math.hypot(tf.c, tf.d));
  k = Math.min(k, 1300 / CBOX.w);
  const w = Math.max(2, Math.round(CBOX.w * k)), h = Math.max(2, Math.round(CBOX.h * k));
  const { gl: g, U, c } = R;
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  g.viewport(0, 0, w, h);
  g.uniform2f(U.uRes, w, h); g.uniform4f(U.uBox, CBOX.x0, CBOX.y0, CBOX.w, CBOX.h);
  g.uniform1f(U.uT, m.t); g.uniform1f(U.uBass, m.bass || 0); g.uniform1f(U.uHueA, m.pal.a); g.uniform1f(U.uHueB, m.pal.b);
  g.uniform1f(U.uForm, nym ? 0 : o.form === "adult" ? 1 : 2); g.uniform1f(U.uHard, o.hard || 0);
  g.uniform1f(U.uPads, o.pads || 0); g.uniform1f(U.uWing, o.wing || 0); g.uniform1f(U.uRub, o.rub || 0); g.uniform1f(U.uDip, o.dip || 0);
  g.uniform1f(U.uMid, o.mid || 0); g.uniform1f(U.uHead, o.head || 0); g.uniform1f(U.uChirp, o.chirp || 0);
  g.uniform1f(U.uShell, o.shell ? 1 : 0); g.uniform1f(U.uSplit, o.split || 0); g.uniform1f(U.uGlowIn, o.glowIn || 0);
  g.uniform2f(U.uWingA, wa(-1), wa(1));
  g.uniform4fv(U.uFL, new Float32Array(arm(-1, o.armL || 0))); g.uniform4fv(U.uFR, new Float32Array(arm(1, o.armR || 0)));
  g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT);
  g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
  ctx.drawImage(c, CBOX.x0, CBOX.y0, CBOX.w, CBOX.h);
  ctx.restore();
}

