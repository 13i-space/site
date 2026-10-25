// Varrow, with its head and orb painted per pixel (look-lab). The body -
// legs, robe, capelet, sleeves - is the Rave's own drawing (lib/rave/dancers.js),
// copied here so the head and the orb can be swapped for the painted ones.
import { TAU, lerp, clamp, P, tube, glow, radial, linear } from "../draw";
import { arm3d, hand3d, shade, trim } from "../shade";
import { FRAG as DJ } from "./djShader";
import { makeGL } from "./glutil";

const PI = Math.PI;
const COMMON = DJ.slice(DJ.indexOf("const float PI"), DJ.indexOf("// ---------- materials ----------"));
const HB = { x0: 88, y0: 20, w: 184, h: 220 };
const OB = { x0: -180, y0: -180, w: 360, h: 360 };

const VFRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uMode, uT, uB, uBass, uHueA, uHueB, uBlink, uMouthR, uOrbGlow, uRidgeMax;
uniform vec2 uLook, uLids;
uniform float uRidgeOn[3];
uniform float uDot[4];
uniform vec2 uTen[30];
${COMMON}

#define GRAD(F, p) normalize(vec2(F(p + vec2(0.3, 0.0)) - F(p - vec2(0.3, 0.0)), F(p + vec2(0.0, 0.3)) - F(p - vec2(0.0, 0.3))) + 1e-5)
vec3 VSKIN() { return lin(vec3(0.24, 0.5, 0.58)); }
float headSD(vec2 p) {
  return smin(sdEll(p - vec2(180.0, 112.0), vec2(78.0, 80.0)), sdEll(p - vec2(180.0, 165.0), vec2(58.0, 52.0)), 22.0);
}
float curHeadV(vec2 p) { return headSD(p); }
// a gold ridge across the brow: a parabola from (180-hw, y0) up to its apex
float ridgeSD(vec2 p, float y0, float apex, float hw, float w, out float along) {
  float x = clamp(p.x - 180.0, -hw, hw);
  float k = x / hw;
  float y = y0 - (y0 - apex) * (1.0 - k * k);
  float slope = 2.0 * (y0 - apex) * k / hw;
  along = k;
  float dy = (p.y - y) / sqrt(1.0 + slope * slope);
  float dx = abs(p.x - 180.0) - hw;
  return (dx > 0.0 ? length(vec2(dx, p.y - y0)) : abs(dy)) - w;
}

void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uBox.x + f.x * uBox.z, uBox.y + (1.0 - f.y) * uBox.w);
  px = uBox.z / uRes.x;
  rimA = lin(hsl2rgb(uHueA, 1.0, 0.62)) * 1.1;
  rimB = lin(hsl2rgb(uHueB, 1.0, 0.68)) * 1.1;
  vec3 gold = lin(vec3(0.91, 0.78, 0.48));
  vec3 cyan = lin(vec3(0.5, 0.94, 0.88));

  if (uMode > 0.5) {
    // ===== the orb: glass, a nebula turning inside it =====
    float r = length(p);
    float halo = exp(-max(r - 30.0, 0.0) / (34.0 + uOrbGlow * 26.0 + uBass * 14.0));
    glowAdd(lin(vec3(0.95, 0.82, 0.55)), halo * (0.25 + uOrbGlow * 0.45) * smoothstep(30.0, 36.0, r));
    float d = r - 34.0;
    if (d < px * 2.0) {
      float e = clamp(r / 34.0, 0.0, 1.0);
      vec3 n = normalize(vec3(p / 34.0, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
      // look inside, bent by the glass
      vec2 q = p * (0.7 + 0.3 * n.z);
      vec2 rq = rot(q, uB * 0.35);
      vec2 w = rq + 9.0 * vec2(fbm(rq * 0.05 + uT * 0.04), fbm(rq * 0.05 + 4.0 - uT * 0.03));
      float neb = fbm(w * 0.06);
      float swirl = fbm(rot(q, -uB * 0.2) * 0.09 + 2.0);
      vec3 inside = mix(lin(vec3(0.09, 0.05, 0.2)), lin(vec3(0.55, 0.37, 0.75)), smoothstep(0.35, 0.75, neb));
      inside = mix(inside, lin(vec3(1.0, 0.86, 0.6)), smoothstep(0.55, 0.85, swirl) * 0.8);
      inside += lin(vec3(1.0, 0.95, 0.85)) * exp(-length(q - vec2(-4.0, -3.0)) * 0.12) * (0.6 + uOrbGlow * 0.6 + uBass * 0.4);
      // sparks drifting in it
      vec2 g = rot(q, uB * 0.5) * 0.25; vec2 cid = floor(g); float hs = hash(cid);
      inside += vec3(1.0) * step(0.86, hs) * smoothstep(0.3, 0.0, length(fract(g) - 0.5 - (vec2(hash(cid + 3.1), hash(cid + 7.7)) - 0.5) * 0.5)) * (0.5 + 0.5 * sin(uT * 3.0 + hs * 30.0));
      vec3 c = inside * (0.55 + 0.45 * n.z);
      // the glass
      float fres = pow(1.0 - n.z, 2.2);
      c += mix(rimA, rimB, smoothstep(-30.0, 30.0, p.x)) * fres * 0.7;
      vec3 R = reflect(vec3(0.0, 0.0, -1.0), n);
      c += vec3(1.0) * smoothstep(0.9, 0.98, dot(R, normalize(vec3(-0.45, -0.7, 0.55)))) * 1.1;
      c += vec3(1.0) * smoothstep(1.0, 0.7, length((p - vec2(-12.0, -14.0)) / vec2(8.0, 4.0) * mat2(0.82, 0.57, -0.57, 0.82))) * 0.7;
      // the arcs of light that turn with the beat (as before)
      vec2 aq = rot(p, -uB * 0.8);
      float a1 = smoothstep(1.4, 0.4, abs(length(aq) - 20.0)) * step(aq.y, 0.0);
      float a2 = smoothstep(1.2, 0.3, abs(length(aq - vec2(0.0, 2.0)) - 12.0)) * step(0.0, aq.y - 2.0) * step(-0.95, (aq.x) / 12.0);
      c += vec3(1.0, 0.97, 0.9) * (a1 + a2) * 0.45;
      put(d, c);
    }
    gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
    return;
  }

  // ===== the head =====
  float hd = headSD(p);
  if (hd < px * 2.0) {
    vec2 g = GRAD(curHeadV, p);
    vec3 n = nrm(g, hd, 70.0);
    // temples, cheekbones, a soft brow
    vec2 ap = vec2(abs(p.x - 180.0), p.y);
    float temple = exp(-dot((ap - vec2(60.0, 160.0)) / vec2(16.0, 30.0), (ap - vec2(60.0, 160.0)) / vec2(16.0, 30.0)));
    float cheek = exp(-dot((ap - vec2(42.0, 160.0)) / vec2(18.0, 12.0), (ap - vec2(42.0, 160.0)) / vec2(18.0, 12.0)));
    float brow = exp(-pow((p.y - 116.0) / 8.0, 2.0)) * smoothstep(60.0, 20.0, ap.x);
    n = normalize(n + vec3(sign(p.x - 180.0) * (cheek * 0.35 - temple * 0.3), -brow * 0.25 + cheek * 0.2, 0.0));
    float mot = fbm(p * 0.035 + 2.0);
    vec3 alb = VSKIN() * (0.85 + 0.25 * mot);
    alb = mix(alb, lin(vec3(0.6, 0.85, 0.88)), smoothstep(0.62, 0.85, fbm(p * 0.02 + 9.0)) * 0.35);
    alb *= 1.0 - temple * 0.35;
    // fine skin: tiny pores and soft creases
    vec2 b = vec2(noise(p * 0.45) - 0.5, noise(p * 0.45 + 7.3) - 0.5) * 0.08;
    n = normalize(n + vec3(b, 0.0));
    vec3 c = light(alb, n, 50.0, 0.28, 0.35, lin(vec3(0.2, 0.6, 0.6)), 1.0);
    c *= mix(1.0, 0.45, pow(clamp(1.0 + hd / 70.0, 0.0, 1.0), 4.0));
    // the gold ridges, flaring on the beat
    for (int i = 0; i < 3; i++) {
      float y0 = i == 0 ? 58.0 : i == 1 ? 80.0 : 104.0;
      float ap2 = i == 0 ? 44.0 : i == 1 ? 63.0 : 85.0;
      float hw = i == 0 ? 30.0 : i == 1 ? 42.0 : 52.0;
      float w = (i == 0 ? 1.6 : i == 1 ? 1.35 : 1.1) * 2.0;
      float on = uRidgeOn[i];
      float al;
      float rd = ridgeSD(p, y0, ap2, hw, w + on * 0.6, al);
      // a groove in the skin under each ridge
      c *= 1.0 - 0.35 * smoothstep(w + 3.5, w, rd + w);
      if (rd < px * 2.0) {
        float e2 = clamp(1.0 + rd / (w + on * 0.6), 0.0, 1.0);
        vec3 rn = normalize(vec3(0.0, -(e2 - 0.5) * 1.2, 0.7));
        vec3 gc = light(gold, rn, 120.0, 1.2, 0.0, vec3(0.0), 1.0) * 0.9;
        gc += lin(vec3(1.0, 0.9, 0.65)) * on * 1.1;
        c = mix(c, gc, clamp(0.5 - rd / px, 0.0, 1.0));
      }
      if (rd > 0.0 && acc.a > 0.0) acc.rgb += gold * exp(-rd * 0.25) * on * 0.35;
    }
    // two small eyes on the brow
    for (int i = 0; i < 2; i++) {
      vec2 ec = vec2(i == 0 ? 164.0 : 196.0, 108.0);
      vec2 eq = p - ec; float er = length(eq);
      if (er < 5.2) {
        float e2 = clamp(er / 4.5, 0.0, 1.0);
        vec3 en = normalize(vec3(eq / 4.5, sqrt(max(1.0 - e2 * e2, 0.0)) + 0.02));
        vec3 ecol = light(lin(vec3(0.02, 0.015, 0.05)), en, 300.0, 1.5, 0.0, vec3(0.0), 1.0);
        ecol += gold * smoothstep(1.6, 0.8, length(eq - vec2(1.0, -1.0) - uLook * 0.2)) * 1.2;
        c = mix(c, ecol, clamp(0.5 - (er - 4.5) / px, 0.0, 1.0));
        c *= 1.0 - 0.35 * smoothstep(6.0, 4.6, er) * step(4.5, er);
      }
    }
    // the four glow-spots on the cheeks
    for (int i = 0; i < 4; i++) {
      vec2 dc = i == 0 ? vec2(126.0, 166.0) : i == 1 ? vec2(134.0, 176.0) : i == 2 ? vec2(234.0, 166.0) : vec2(226.0, 176.0);
      float dd = length(p - dc);
      c = mix(c, cyan * 1.8 + vec3(0.1), smoothstep(2.6, 1.8, dd) * (0.5 + 0.5 * uDot[i]));
      c += cyan * exp(-dd * 0.3) * uDot[i] * 0.35;
    }
    // the mouth
    float md = sdEll(p - vec2(180.0, 172.0), vec2(uMouthR, 10.0));
    c *= 1.0 - 0.4 * smoothstep(4.0, 0.0, md);
    if (md < 0.5) c = mix(c, lin(vec3(0.03, 0.01, 0.06)), clamp(0.5 - md / px, 0.0, 1.0));
    put(hd, c);
  }
  // ===== the two great eyes =====
  for (int i = 0; i < 2; i++) {
    float sd = i == 0 ? 1.0 : -1.0;
    vec2 ec = vec2(i == 0 ? 148.0 : 212.0, 136.0);
    vec2 q = rot(p - ec, -sd * 0.314);
    // the socket
    float so = sdEll(q - vec2(0.0, 1.5), vec2(28.0, 16.0));
    if (so < 6.0 && acc.a > 0.0) acc.rgb = mix(acc.rgb, lin(vec3(0.03, 0.09, 0.13)) * 0.6, 0.6 * smoothstep(5.0, -2.0, so));
    float ed = sdEll(q, vec2(24.0, 12.5));
    if (ed < px * 2.0) {
      vec2 qq = q / vec2(24.0, 12.5);
      float e = clamp(length(qq), 0.0, 1.0);
      vec3 n = normalize(vec3(qq * vec2(0.8, 0.95), sqrt(max(1.0 - e * e, 0.0)) + 0.15));
      vec3 c = lin(vec3(0.02, 0.015, 0.05));
      vec2 iq = q - uLook;
      float ir = length(iq) / (9.0 + uBass * 2.0);
      if (ir < 1.05) {
        float ang = atan(iq.y, iq.x);
        vec3 ic = mix(lin(vec3(0.82, 0.69, 1.0)), lin(vec3(0.48, 0.31, 0.82)), smoothstep(0.15, 0.6, ir));
        ic = mix(ic, lin(vec3(0.2, 0.1, 0.46)), smoothstep(0.6, 1.0, ir));
        ic *= 0.75 + 0.35 * noise(vec2(ang * 10.0, ir * 3.0)) + 0.15 * noise(vec2(ang * 33.0, ir * 8.0));
        ic *= 1.0 + 0.4 * pow(0.5 + 0.5 * sin(ir * 20.0 + uT * 2.2), 6.0) * smoothstep(0.25, 0.4, ir);
        float pupil = length(iq / vec2(2.4, 6.0));
        ic = mix(ic, lin(vec3(0.01, 0.01, 0.03)), smoothstep(1.1, 0.9, pupil));
        c = mix(c, ic * 1.25, smoothstep(1.04, 0.96, ir));
        glowAdd(ic, 0.0);
      }
      // wet: the light, the room, the stage colours
      vec3 H = normalize(normalize(vec3(-0.35, -0.7, 0.6)) + vec3(0.0, 0.0, 1.0));
      c += vec3(1.0) * pow(max(dot(n, H), 0.0), 300.0) * 1.3;
      c += vec3(1.0) * smoothstep(1.1, 0.7, length((q - uLook - vec2(-4.0, -4.0)) / 2.6)) * 0.75;
      c += mix(rimA, rimB, 0.5 + 0.5 * sd) * pow(1.0 - n.z, 2.5) * 0.4;
      // the upper lid, coming down
      float lid = max(uBlink, i == 0 ? uLids.x : uLids.y);
      float lidY = -12.5 + lid * 26.0;
      if (q.y < lidY) {
        vec3 ln = normalize(vec3(qq.x * 0.4, -0.5, 0.8));
        c = light(VSKIN() * 0.78, ln, 40.0, 0.25, 0.6, lin(vec3(0.3, 0.75, 0.7)), 1.0);
        c *= 1.0 - 0.4 * smoothstep(lidY - 3.0, lidY, q.y);
      }
      c *= 1.0 - 0.55 * smoothstep(-0.25, 0.0, ed / 12.5) * step(lidY, q.y);
      put(ed, c);
    }
  }
  // ===== the mouth tendrils =====
  for (int k = 0; k < 5; k++) {
    float best = 1e3, tA = 0.0, rad = 1.0; vec2 ax = vec2(0.0);
    for (int j = 0; j < 5; j++) {
      vec2 a = uTen[k * 6 + j], b = uTen[k * 6 + j + 1];
      vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      float tt = (float(j) + h) / 5.0;
      float r = mix(3.0, 1.3, tt);
      vec2 v = pa - ba * h; float d = length(v) - r;
      if (d < best) { best = d; ax = v; tA = tt; rad = r; }
    }
    if (best < px * 2.0) {
      float e = clamp(length(ax) / rad, 0.0, 1.0);
      vec2 n2 = length(ax) > 1e-4 ? ax / length(ax) : vec2(0.0);
      vec3 n = normalize(vec3(n2 * e, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
      vec3 c = light(lin(vec3(0.1, 0.27, 0.34)), n, 70.0, 0.6, 0.6, lin(vec3(0.2, 0.7, 0.65)), 1.0);
      c += cyan * smoothstep(0.7, 1.0, tA) * 0.4;
      put(best, c);
    }
  }
  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;

// ---------- the body, as lib/rave/dancers.js ----------
const GOLD = "#C9A85E";
const V_SH = { L: [134, 266], R: [226, 266] };
const V_SKIN = { lite: "#9CD6DE", mid: "#4A8494", dark: "#1C4258", line: "#0C2232" };
const V_SLEEVE = { lite: "#8058AE", mid: "#4E3074", dark: "#22123A" };
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);
const rimOf = (m, a = 0.85) => `hsla(${m.pal.b},100%,72%,${a})`;
function leg(ctx, hip, foot, T, S, kneeSide, o) {
  const dx = foot[0] - hip[0], dy = foot[1] - hip[1];
  let d = Math.hypot(dx, dy) || 1;
  const ux = dx / d, uy = dy / d;
  const maxd = (T + S) * 0.995;
  if (d > maxd) { foot = [hip[0] + ux * maxd, hip[1] + uy * maxd]; d = maxd; }
  const a = (T * T + d * d - S * S) / (2 * d), hh = Math.sqrt(Math.max(0, T * T - a * a));
  const knee = [hip[0] + ux * a - uy * hh * kneeSide, hip[1] + uy * a + ux * hh * kneeSide];
  arm3d(ctx, hip, foot, { elbow: knee, stiff: o.stiff ?? 0.5, w0: o.w0, w1: o.w1, col: o.col, rim: o.rim, bulge: o.bulge ?? 0.4, bands: o.bands, bandCol: o.bandCol });
  return { knee, foot };
}
function vFoot(ctx, x, y, sd, f) {
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y + 3, 26, 6, 0, 0, TAU); if (f < 0.1) ctx.fill();
  ctx.fillStyle = radial(ctx, x, y - 6, 20, [[0, V_SKIN.lite], [0.5, V_SKIN.mid], [1, V_SKIN.dark]], x - 6, y - 10);
  ctx.beginPath(); ctx.ellipse(x, y - 5, 15, 9, 0, 0, TAU); ctx.fill();
  [-1, 0, 1].forEach((t) => {
    const tx = x + t * 11 + sd * 2, ty = y + 1 - Math.abs(t) * 1.5;
    ctx.fillStyle = radial(ctx, tx, ty, 7, [[0, V_SKIN.lite], [0.6, V_SKIN.mid], [1, V_SKIN.dark]], tx - 2, ty - 3);
    ctx.beginPath(); ctx.ellipse(tx, ty, 6.6, 5.4, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = V_SKIN.line; ctx.lineWidth = 0.9; ctx.stroke();
    ctx.fillStyle = "#E8F4EC"; ctx.beginPath(); ctx.ellipse(tx, ty + 4.6, 2.6, 1.6, 0, 0, TAU); ctx.fill();
  });
}
function cubic(a, b, c, d, t) { const u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; }

export function makeVarrow() {
  const names = ["uRes", "uBox", "uMode", "uT", "uB", "uBass", "uHueA", "uHueB", "uBlink", "uMouthR", "uOrbGlow", "uRidgeMax", "uLook", "uLids"];
  const arrays = ["uRidgeOn", "uDot", "uTen"];
  const GH = makeGL(VFRAG, HB, names, arrays, "VB_");
  const GO = makeGL(VFRAG, OB, names, arrays, "VB_");
  if (!GH || !GO) return null;

  function render(G, ctx, box, set) {
    const tf = ctx.getTransform(); const k = Math.hypot(tf.a, tf.b);
    let w = Math.round(box.w * k), h = Math.round(box.h * k);
    const cap = 1300 / Math.max(w, h); if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
    const { gl, U, c } = G;
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h); gl.uniform4f(U.uBox, box.x0, box.y0, box.w, box.h);
    set(gl, U);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    ctx.drawImage(c, box.x0, box.y0, box.w, box.h);
  }
  const common = (gl, U, m) => { gl.uniform1f(U.uT, m.t); gl.uniform1f(U.uB, m.B); gl.uniform1f(U.uBass, m.bass); gl.uniform1f(U.uHueA, m.pal.a); gl.uniform1f(U.uHueB, m.pal.b); };

  return function draw(ctx, p, m) {
    const rim = rimOf(m);
    ctx.save();
    ctx.translate(0, p.lift); ctx.rotate(p.lean); ctx.scale(1, p.sy);
    ctx.translate(-180, -520);
    const gy = 520 - p.lift / p.sy;
    [[154, 148, p.feet[0], 1], [206, 212, p.feet[1], -1]].forEach(([hx, fx0, f, sd]) => {
      const fx = fx0 + (fx0 - 180) * 0.35 * f + p.sx * 0.6, fy = gy - f * 26;
      const r = leg(ctx, [hx + p.sx * 0.8, 446], [fx, fy - 8], 44, 44, sd, { w0: 30, w1: 15, col: V_SKIN, rim, stiff: 0.45, bulge: 0.4, bands: [0.9], bandCol: GOLD });
      vFoot(ctx, r.foot[0], r.foot[1] + 8, sd, f);
    });
    const h = p.hem, sx = p.sx;
    const hemY = 466 + Math.abs(h) * 0.5;
    const robe = new Path2D(`M${128 + sx} 236 Q${98 + h * 0.3} 320 ${84 + h} 452 Q${180 + h} ${hemY} ${276 + h} 452 Q${262 + h * 0.3} 320 ${232 + sx} 236 Z`);
    ctx.fillStyle = linear(ctx, 76 + h * 0.3, 0, 284 + h * 0.3, 0, [[0, "#170C28"], [0.22, "#3A2358"], [0.42, "#5C3C86"], [0.6, "#40285F"], [0.82, "#231438"], [1, "#120920"]]);
    ctx.fill(robe);
    ctx.save(); ctx.clip(robe);
    for (let i = 0; i < 6; i++) {
      const x0 = 120 + i * 24, x1 = 84 + i * 40 + h;
      ctx.strokeStyle = "rgba(8,3,18,0.55)"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(x0, 300); ctx.quadraticCurveTo(lerp(x0, x1, 0.5) + h * 0.3, 400, x1, 470); ctx.stroke();
      ctx.strokeStyle = "rgba(180,150,230,0.14)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0 + 5, 304); ctx.quadraticCurveTo(lerp(x0, x1, 0.5) + h * 0.3 + 5, 400, x1 + 5, 470); ctx.stroke();
    }
    const panel = new Path2D(`M164 250 L196 250 L${204 + h} 456 Q${180 + h} ${hemY + 2} ${156 + h} 456 Z`);
    ctx.fillStyle = linear(ctx, 150 + h * 0.5, 0, 210 + h * 0.5, 0, [[0, "#3A2260"], [0.5, "#6E4AA0"], [1, "#321C54"]]); ctx.fill(panel);
    for (let y = 410; y < 440; y += 24) {
      const k = (y - 250) / 206, x = 180 + h * k;
      ctx.strokeStyle = GOLD; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(x - 8, y + 6); ctx.lineTo(x, y - 8); ctx.lineTo(x + 8, y + 6); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y + 1, 2.4, 0, TAU); ctx.stroke();
    }
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2.4;
    ctx.beginPath(); for (let x = 60; x <= 300; x += 12) { const y = 432 + ((x / 12) % 2 ? -5 : 5); x === 60 ? ctx.moveTo(x + h, y) : ctx.lineTo(x + h, y); } ctx.stroke();
    ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(60 + h, 420); ctx.lineTo(300 + h, 420); ctx.moveTo(60 + h, 444); ctx.lineTo(300 + h, 444); ctx.stroke();
    ctx.save(); ctx.globalAlpha = 0.3 + 0.6 * m.high; ctx.strokeStyle = "#7FF0E0"; ctx.lineWidth = 2;
    for (let k = 0; k < 7; k++) { const x = 90 + k * 30 + h * 0.9; ctx.beginPath(); ctx.arc(x, 432, 3, 0, TAU); ctx.stroke(); }
    ctx.restore();
    ctx.restore();
    trim(ctx, new Path2D(`M164 250 L${156 + h} 456 M196 250 L${204 + h} 456`), 3, GOLD);
    shade(ctx, robe, [84, 236, 194, 232], { rim, shadow: 0.55, spec: 0.08, sx: 0.32, sy: 0.12, line: "#090414", lineW: 2 });
    trim(ctx, new Path2D(`M${84 + h} 452 Q${180 + h} ${hemY} ${276 + h} 452`), 5, GOLD);
    ctx.fillStyle = linear(ctx, 0, 372, 0, 396, [[0, "#3A2050"], [1, "#160A26"]]);
    ctx.beginPath(); ctx.moveTo(102 + sx * 0.5, 372); ctx.quadraticCurveTo(180, 388, 258 + sx * 0.5, 372); ctx.lineTo(260 + sx * 0.5, 394); ctx.quadraticCurveTo(180, 410, 100 + sx * 0.5, 394); ctx.closePath(); ctx.fill();
    trim(ctx, new Path2D(`M${102 + sx * 0.5} 372 Q180 388 ${258 + sx * 0.5} 372 M${100 + sx * 0.5} 394 Q180 410 ${260 + sx * 0.5} 394`), 2, GOLD);
    const gem = new Path2D(); gem.moveTo(180, 378); gem.lineTo(190, 391); gem.lineTo(180, 404); gem.lineTo(170, 391); gem.closePath();
    ctx.fillStyle = radial(ctx, 180, 391, 10, [[0, "#FFFFFF"], [0.35, `hsl(${m.pal.a},100%,70%)`], [1, `hsl(${m.pal.a},80%,28%)`]], 177, 387);
    ctx.fill(gem); trim(ctx, gem, 1.6, GOLD);
    glow(ctx, 180, 391, 26, `hsla(${m.pal.a},100%,65%,0.9)`, 0.35 + m.bass * 0.6);
    ctx.fillStyle = linear(ctx, 148, 0, 212, 0, [[0, "#1E4458"], [0.4, "#5E9AA6"], [1, "#1E4458"]]);
    ctx.fill(P("M156 196 Q180 214 204 196 L212 248 L148 248 Z"));
    [["L", p.hL, 1], ["R", p.hR, -1]].forEach(([k, hand, s]) => {
      const shp = [V_SH[k][0] + sx, V_SH[k][1]];
      const r = arm3d(ctx, shp, hand, { bend: 0.45 * s, w0: 34, w1: 18, col: V_SKIN, rim, bulge: 0.45, sleeve: { to: 0.42, w: 1.45, col: V_SLEEVE, trim: GOLD } });
      const tips = hand3d(ctx, hand, r.angle, { n: 3, len: 32, w: 8, palm: 11, spread: 1.1, curl: 0.3, col: V_SKIN, tipCol: "#9FFFF0" });
      tips.forEach(([tx, ty]) => glow(ctx, tx, ty, 12, "rgba(127,240,224,0.9)", 0.4 + dipOf(m) * 0.4));
    });
    const cape = new Path2D(`M${108 + sx} 244 Q${180 + sx} 292 ${252 + sx} 244 L${270 + sx} 306 Q${180 + sx} 356 ${90 + sx} 306 Z`);
    ctx.fillStyle = linear(ctx, 90, 0, 270, 0, [[0, "#1A0C2C"], [0.35, "#40205E"], [0.5, "#52307A"], [0.7, "#36184E"], [1, "#140820"]]); ctx.fill(cape);
    ctx.save(); ctx.clip(cape); ctx.strokeStyle = "rgba(6,2,14,0.5)"; ctx.lineWidth = 3;
    for (let k = 0; k < 5; k++) { const x = 116 + k * 32 + sx; ctx.beginPath(); ctx.moveTo(x + (x - 180) * -0.1, 262); ctx.lineTo(x + (x - 180) * 0.15, 350); ctx.stroke(); }
    ctx.restore();
    shade(ctx, cape, [90, 244, 180, 112], { rim, shadow: 0.45, spec: 0.1, line: "#090414", lineW: 1.6 });
    trim(ctx, new Path2D(`M${270 + sx} 306 Q${180 + sx} 356 ${90 + sx} 306`), 4, GOLD);
    for (let k = 0; k <= 8; k++) {
      const s = k / 8, x = lerp(92, 268, s) + sx, y = 306 + Math.sin(s * PI) * 50 * 0.95;
      const sw = Math.sin(m.B * PI + k) * 3 + h * 0.15;
      ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sw, y + 14); ctx.stroke();
      ctx.fillStyle = "#E8C878"; ctx.beginPath(); ctx.arc(x + sw, y + 15, 2.6, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.moveTo(118 + sx, 240); ctx.quadraticCurveTo(180 + sx, 278, 242 + sx, 240); ctx.stroke(); ctx.globalAlpha = 1;

    // ── the head, painted ──
    ctx.save();
    ctx.translate(180 + sx, 210 + p.headY); ctx.rotate(p.head); ctx.translate(-180, -210);
    ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.beginPath(); ctx.ellipse(186, 236, 70, 16, 0, 0, TAU); ctx.fill();
    const TEN = new Float32Array(60);
    [-14, -7, 0, 7, 14].forEach((dx, i) => {
      const sw = p.tendril * 8 + Math.sin(m.t * 3 + i) * 1.5;
      const a = [180 + dx, 182], c1 = [180 + dx * 1.3 + sw * 0.4, 196], c2 = [180 + dx * 1.1 + sw * 1.4, 214], b = [180 + dx * 1.2 + sw * 1.6, 224];
      for (let j = 0; j < 6; j++) { const q = cubic(a, c1, c2, b, j / 5); TEN[(i * 6 + j) * 2] = q[0]; TEN[(i * 6 + j) * 2 + 1] = q[1]; }
    });
    const blink = (m.t % 5.1) > 4.95 ? 1 : 0;
    const on = [0, 1, 2].map((i) => Math.max(p.ridges, Math.max(0, Math.cos((m.B - i * 0.25) * PI * 2)) * m.amp));
    const dots = [0, 1, 2, 3].map((i) => 0.4 + 0.6 * Math.max(0, Math.sin(m.B * PI - i * 0.6)));
    render(GH, ctx, HB, (gl, U) => {
      common(gl, U, m);
      gl.uniform1f(U.uMode, 0); gl.uniform1f(U.uBlink, blink); gl.uniform1f(U.uMouthR, 4 + p.ridges * 2);
      gl.uniform2f(U.uLook, p.look[0], p.look[1]); gl.uniform2f(U.uLids, clamp(p.lids[0] ?? 0.3, 0, 1), clamp(p.lids[1] ?? 0.3, 0, 1));
      gl.uniform1fv(U.uRidgeOn, new Float32Array(on)); gl.uniform1fv(U.uDot, new Float32Array(dots)); gl.uniform2fv(U.uTen, TEN);
    });
    ctx.restore();
    // ── the orb, painted, in front of everything ──
    ctx.save(); ctx.translate(p.orb[0], p.orb[1]);
    render(GO, ctx, OB, (gl, U) => { common(gl, U, m); gl.uniform1f(U.uMode, 1); gl.uniform1f(U.uOrbGlow, p.orbGlow); });
    ctx.restore();
    ctx.restore();
  };
}
