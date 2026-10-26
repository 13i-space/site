// The four jack-o'-lanterns at the back of the stage, painted per pixel
// (Update 6.17, Halloween remix). Each its own size, shape and carved face;
// the candles flare on every kick and gutter between them.
import { glow, hash } from "../draw";
import { makeGL } from "./glutil";
import { PFRAG, PBOX } from "./pumpkinShader";

let G = null, tried = false;
function gl() {
  if (!tried) { tried = true; G = makeGL(PFRAG, PBOX, ["uRes", "uBox", "uT", "uFlick", "uSeed", "uHueA", "uHueB", "uSquat", "uFlame"], [], "PB_"); }
  return G;
}
const SIZES = [0.44, 0.52, 0.5, 0.42], SQUAT = [0.9, 1.0, 0.82, 1.08];

export function paintPumpkinsNow(ctx, L, m) {
  const R = gl();
  if (!R) return false;
  const xs = L.portrait ? [L.cx - 37, L.cx - 17, L.cx + 17, L.cx + 37] : [L.cx - 71, L.cx - 45, L.cx + 45, L.cx + 71];
  const y = L.floorTop - 0.6;
  const { gl: g, U, c } = R;
  xs.forEach((x, i) => {
    // the candle: a flare on the kick, a gutter, a little life of its own
    const kick = Math.exp(-m.ph * 6) * (0.4 + (m.bass || 0) * 0.8) * (m.on === false ? 0.3 : 1);
    const flutter = 0.12 * Math.sin(m.t * 17 + i * 2.1) + 0.08 * Math.sin(m.t * 29 + i * 5.3);
    const flick = Math.max(0.25, 0.5 + kick * 0.6 + flutter);
    ctx.save(); ctx.translate(x, y); ctx.scale(SIZES[i], SIZES[i]);
    const tf = ctx.getTransform();
    let k = Math.max(Math.hypot(tf.a, tf.b), Math.hypot(tf.c, tf.d));
    k = Math.min(k, 500 / PBOX.w);
    const w = Math.max(2, Math.round(PBOX.w * k)), h = Math.max(2, Math.round(PBOX.h * k));
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    g.viewport(0, 0, w, h);
    g.uniform2f(U.uRes, w, h); g.uniform4f(U.uBox, PBOX.x0, PBOX.y0, PBOX.w, PBOX.h);
    g.uniform1f(U.uT, m.t); g.uniform1f(U.uFlick, flick); g.uniform1f(U.uSeed, hash(i, 41)); g.uniform1f(U.uSquat, SQUAT[i]);
    g.uniform1f(U.uHueA, m.pal.a); g.uniform1f(U.uHueB, m.pal.b);
    g.uniform2f(U.uFlame, Math.sin(m.t * 3 + i) * 0.8, Math.sin(m.t * 5 + i) * 0.4);
    g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT);
    g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
    ctx.drawImage(c, PBOX.x0, PBOX.y0, PBOX.w, PBOX.h);
    ctx.restore();
    glow(ctx, x, y - 3.5 * SIZES[i] * 2, 9 * SIZES[i] * 2, "rgba(255,140,40,0.8)", 0.22 * flick);
  });
  return true;
}
