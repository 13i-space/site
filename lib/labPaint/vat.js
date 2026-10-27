// Paints the tank's liquid and the embryo per pixel (lib/labPaint/vatShader.js)
// into the Lab's 2D canvas. The embryo's motion and anatomy follow
// lib/embryo.js's drawEmbryo exactly (same seed, same moves), so the painted
// one behaves like the drawn one; it just looks alive. Returns false if WebGL
// isn't there (the Lab then draws the old way).
import { makeGL } from "../rave/painted/glutil";
import { VAT_FRAG, VAT_BOX } from "./vatShader";

const TAU = Math.PI * 2;
const MEM = { smooth: 0, cilia: 1, plate: 2, glow: 3, glass: 4 };
const ENV = { bubbles: 0, grains: 1, crystals: 2, spores: 3, dark: 4, motes: 5 };
let G = null, broken = false;
const NAMES = ["uRes", "uBox", "uT", "uHue", "uEnv", "uAlarm", "uMorph", "uFrantic", "uShow", "uFlick", "uLevel", "uC", "uRot", "uSc", "uSquash", "uR", "uAct", "uStrange", "uWrong", "uCocoon", "uMem", "uInner", "uGrowth", "uStare", "uSeed", "uStage", "uToxic", "uNC", "uNB", "uNS", "uNT", "uFade"];
const ARR = ["uCell", "uBud", "uSpot", "uTP"];

// the embryo's pose and anatomy, in its own units (scene units, centred)
function anatomy(st, T, S, look, stare, freeze, centre) {
  const rnd = (k) => ((Math.imul(st.seed ^ (k * 2654435761), 1597334677) >>> 0) % 1000) / 1000;
  const R = S * (0.07 + 0.2 * st.growth);
  const act = st.activity;
  let ox = 0, oy = 0, rot = 0, sc = 1;
  if (!freeze) {
    if (st.motion === "drift") { ox = Math.sin(T * 0.4 + rnd(1) * 6) * S * 0.05; oy = Math.cos(T * 0.53) * S * 0.04; }
    if (st.motion === "wriggle") rot = Math.sin(T * (1.2 + act * 2)) * 0.25;
    if (st.motion === "pulse") sc = 1 + Math.sin(T * (1 + act * 2)) * 0.05;
    if (st.motion !== "still") rot += T * 0.05 * (rnd(2) - 0.5);
    const tw = Math.sin(T * 7.3 + rnd(3) * 9) > 0.995 - act * 0.01 ? 1 : 0;
    ox += tw * S * 0.015 * (rnd(4) - 0.5) * 4;
  }
  const cells = new Float32Array(27), buds = new Float32Array(40), spots = new Float32Array(32), tp = new Float32Array(90);
  const n = Math.min(9, st.cells);
  for (let i = 0; i < n; i++) {
    let a, d;
    if (st.arrangement === "ring") { a = (i / n) * TAU + T * 0.1; d = n > 1 ? 0.5 : 0; }
    else if (st.arrangement === "pair") { a = (i % 2 ? 0 : Math.PI) + Math.floor(i / 2) * 0.6 - 0.3 + Math.sin(T * 0.3 + i) * 0.1; d = n > 1 ? 0.25 + Math.floor(i / 2) * 0.15 : 0; }
    else { a = rnd(40 + i) * TAU + Math.sin(T * 0.2 + i) * 0.4; d = n > 1 ? 0.2 + rnd(50 + i) * 0.45 : 0; }
    const cr = R * (n > 1 ? 0.18 + rnd(60 + i) * 0.1 : 0.32);
    cells.set([Math.cos(a) * d * R, Math.sin(a) * d * R, cr], i * 3);
  }
  const nb = Math.min(10, st.buds);
  for (let i = 0; i < nb; i++) {
    const a = (i / Math.max(1, st.buds)) * TAU + rnd(20 + i) * 0.6;
    const b = R * (0.22 + 0.12 * rnd(30 + i)) * (0.6 + st.growth * 0.6);
    buds.set([Math.cos(a) * R * 0.98, Math.sin(a) * R * 0.98, b, a], i * 4);
  }
  const ns = Math.min(8, st.spots);
  const lx = look ? look.x - centre.x : 0, ly = look ? look.y - centre.y : R * 3;
  const gl = look || stare ? Math.atan2(ly, lx) : -2.3;
  for (let i = 0; i < ns; i++) {
    const a0 = rnd(70 + i) * TAU;
    const bx = Math.cos(a0) * R * 0.55, by = Math.sin(a0) * R * 0.5;
    const fx = (i - (ns - 1) / 2) * R * 0.28, fy = -R * 0.1;
    spots.set([bx + (fx - bx) * stare, by + (fy - by) * stare, R * (0.07 + stare * 0.06), gl - rot], i * 4);
  }
  const nt = Math.min(5, st.tendrils);
  for (let i = 0; i < nt; i++) {
    const a = (i / st.tendrils) * TAU + rnd(10 + i) * 1.2 + Math.PI * 0.5;
    let px = Math.cos(a) * R * 0.95, py = Math.sin(a) * R * 0.95;
    tp[i * 18] = px; tp[i * 18 + 1] = py;
    for (let k = 1; k <= 8; k++) {
      const w = Math.sin(T * (2 + act * 3) - k * 0.8 + i) * R * 0.12 * (freeze ? 0 : 1);
      px += Math.cos(a) * R * 0.14 - Math.sin(a) * w * 0.4;
      py += Math.sin(a) * R * 0.14 + Math.cos(a) * w * 0.4;
      tp[i * 18 + k * 2] = px; tp[i * 18 + k * 2 + 1] = py;
    }
  }
  return { R, ox, oy, rot, sc, cells, buds, spots, tp, n, nb, ns, nt, seed: rnd(5) };
}

// o: { t, hue, env, alarm, morph, frantic, flick, em, centre: {x,y} (vat units),
//      look: {x,y} (vat units) | null, freeze, frozenAt, stare, wrong, cocoon, show,
//      scale (swelling, in the transformation), fade (dissolving) }
export function paintVat(ctx, vat, o) {
  if (broken) return false;
  try {
    if (!G) { G = makeGL(VAT_FRAG, VAT_BOX, NAMES, ARR, "VB_"); if (!G) { broken = true; return false; } }
    const { gl, U, c } = G;
    const tf = ctx.getTransform(); const k = Math.hypot(tf.a, tf.b);
    let w = Math.round(vat.w * k), h = Math.round(vat.h * k);
    const cap = 900 / Math.max(w, h); if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h); gl.uniform4f(U.uBox, 0, 0, vat.w, vat.h);
    gl.uniform1f(U.uT, o.t); gl.uniform1f(U.uHue, o.hue); gl.uniform1f(U.uEnv, ENV[o.env] ?? 0);
    gl.uniform1f(U.uAlarm, o.alarm ? 1 : 0); gl.uniform1f(U.uMorph, o.morph || 0); gl.uniform1f(U.uFrantic, o.frantic || 0);
    gl.uniform1f(U.uFlick, o.flick ?? 1); gl.uniform1f(U.uLevel, 1);
    const st = o.em;
    const show = !!(st && o.show);
    gl.uniform1f(U.uShow, show ? 1 : 0);
    if (show) {
      const T = o.freeze ? o.frozenAt ?? o.t : o.t;
      const A = anatomy(st, T, 38, o.look, o.stare || 0, o.freeze, o.centre);
      gl.uniform2f(U.uC, o.centre.x + A.ox, o.centre.y + A.oy);
      gl.uniform1f(U.uRot, A.rot); gl.uniform1f(U.uSc, A.sc * (o.scale || 1)); gl.uniform1f(U.uFade, o.fade ?? 1); gl.uniform1f(U.uSquash, st.squash); gl.uniform1f(U.uR, A.R);
      gl.uniform1f(U.uAct, st.activity); gl.uniform1f(U.uStrange, st.strange); gl.uniform1f(U.uWrong, o.wrong || 0);
      gl.uniform1f(U.uCocoon, o.cocoon || 0); gl.uniform1f(U.uMem, MEM[st.membrane] ?? 0);
      gl.uniform1f(U.uInner, (st.pulseLight * 0.5 + st.energy * 0.6) * (0.5 + 0.5 * Math.sin(T * 1.7)));
      gl.uniform1f(U.uGrowth, st.growth); gl.uniform1f(U.uStare, o.stare || 0); gl.uniform1f(U.uSeed, A.seed * 10);
      gl.uniform1f(U.uStage, st.stage); gl.uniform1f(U.uToxic, st.toxic ? 1 : 0);
      gl.uniform3fv(U.uCell, A.cells); gl.uniform1f(U.uNC, A.n);
      gl.uniform4fv(U.uBud, A.buds); gl.uniform1f(U.uNB, A.nb);
      gl.uniform4fv(U.uSpot, A.spots); gl.uniform1f(U.uNS, A.ns);
      gl.uniform2fv(U.uTP, A.tp); gl.uniform1f(U.uNT, A.nt);
    }
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    ctx.drawImage(c, vat.x, vat.y, vat.w, vat.h);
    return true;
  } catch (e) { broken = true; console.error(e); return false; }
}
