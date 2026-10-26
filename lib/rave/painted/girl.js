// The girl of the Halloween remix, painted per pixel (Update 6.15): the
// same moments as lib/rave/girl.js - she flickers in when the voice in the
// track speaks and mouths its words, floating in a cold spotlight; whispering
// she's barely holding together; now and then she glitches into a torn
// red-and-cyan double. Drawn feet at (0,0), about 100 units tall.
import { TAU, clamp, glow, hash } from "../draw";
import { makeGL } from "./glutil";
import { GFRAG, GBOX } from "./girlShader";

let G = null, tried = false;
function gl() {
  if (!tried) { tried = true; G = makeGL(GFRAG, GBOX, ["uRes", "uBox", "uT", "uMouth", "uTilt", "uWide", "uSwing", "uDrift", "uDollA", "uWhisper", "uLegs", "uLook"], [], "GB_"); }
  return G;
}

export function paintGirlNow(ctx, m, on, mouth, whisper = false) {
  if (on <= 0.01) return true;
  const R = gl();
  if (!R) return false;
  const t = m.t;
  // flicker in and out, and now and then a glitch (as girl.js)
  const glitchSeed = Math.floor(t * 7);
  const glitch = (hash(glitchSeed, 3) < (whisper ? 0.45 : on < 0.9 ? 0.5 : 0.07)) ? 1 : 0;
  const flick = whisper ? (hash(Math.floor(t * 14), 9) < 0.72 ? 1 : 0.15) : on < 1 ? (hash(Math.floor(t * 20), 9) < on ? 1 : 0.25) : 1;
  const alpha = on * flick;
  const hover = -6 - Math.sin(t * 1.3) * 2.2;
  const twitch = hash(Math.floor(t / 2.7), 5) < 0.4 && (t % 2.7) < 0.12 ? (hash(Math.floor(t / 2.7), 6) - 0.5) * 0.6 : 0;
  const tilt = Math.sin(t * 0.4) * 0.22 + twitch + mouth * 0.05 * Math.sin(t * 9);

  // her shadow on the floor, faint because she isn't quite standing on it
  ctx.save(); ctx.scale(1, 0.25); ctx.fillStyle = `rgba(0,0,0,${0.35 * alpha})`; ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.fill(); ctx.restore();
  glow(ctx, 0, -2, 26, "rgba(150,255,190,0.6)", alpha * 0.35);

  // paint her once, at the size she's seen
  ctx.save(); ctx.translate(0, hover); ctx.rotate(Math.sin(t * 0.7) * 0.03);
  const tf = ctx.getTransform();
  let k = Math.max(Math.hypot(tf.a, tf.b), Math.hypot(tf.c, tf.d));
  k = Math.min(k, 1400 / GBOX.h);
  const w = Math.round(GBOX.w * k), h = Math.round(GBOX.h * k);
  const { gl: g, U, c } = R;
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  g.viewport(0, 0, w, h);
  g.uniform2f(U.uRes, w, h); g.uniform4f(U.uBox, GBOX.x0, GBOX.y0, GBOX.w, GBOX.h);
  g.uniform1f(U.uT, t); g.uniform1f(U.uMouth, clamp(mouth, 0, 1)); g.uniform1f(U.uTilt, tilt); g.uniform1f(U.uWide, 1 + mouth * 0.12);
  g.uniform1f(U.uSwing, Math.sin(t * 0.8) * 1.5); g.uniform1f(U.uDrift, Math.sin(t * 0.9) * 1.6); g.uniform1f(U.uDollA, Math.sin(t * 1.2) * 0.25);
  g.uniform1f(U.uWhisper, whisper ? 1 : 0);
  g.uniform2f(U.uLegs, Math.sin(t * 1.1) * 1.2, Math.sin(t * 1.1 + 2) * 1.2);
  g.uniform2f(U.uLook, Math.sin(t * 0.37) * 0.5, Math.sin(t * 0.29) * 0.4);
  g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT);
  g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
  ctx.globalAlpha *= alpha * 0.96;
  ctx.drawImage(c, GBOX.x0, GBOX.y0, GBOX.w, GBOX.h);
  if (glitch) {
    // a torn double of her, sliding apart
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = alpha * 0.28;
    ctx.drawImage(c, GBOX.x0 + 2.2 + hash(glitchSeed, 4) * 2, GBOX.y0, GBOX.w, GBOX.h);
    ctx.drawImage(c, GBOX.x0 - 2.2 - hash(glitchSeed, 7) * 2, GBOX.y0, GBOX.w, GBOX.h);
    ctx.globalCompositeOperation = "source-over";
  }
  ctx.restore();
  return true;
}
