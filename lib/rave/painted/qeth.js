// Qeth, redrawn (Update 6.23): the Lab's chief technician and the Rave's
// most graceful dancer. Tall and slender, pearl-lilac skin with a sheen that
// turns teal and rose as she moves; a long elegant skull; great almond eyes,
// dark with luminous violet irises; a crown of bioluminescent fronds whose
// lit tips fly off and dance ("lights"); glowing locks that sweep back to her
// shoulders; fin-like ears; a constellation of freckles that pulse with the
// beat. Four arms (two long, two slight), a fitted pearl lab coat with glowing
// piping, and the data orb she works with.
// Her face is painted per pixel; the rest is the Rave's 2D drawing. Same pose
// API as before (lib/rave/dancers.js), so every dance still works.
import { TAU, lerp, clamp, smooth, P, glow, radial, linear } from "../draw";
import { arm3d, hand3d, shade, trim } from "../shade";
import { FRAG as DJ } from "./djShader";
import { makeGL } from "./glutil";
import { qethCape } from "../costumes";
import { rangerHat } from "../cicada";
import { paintVampireCape, vampireClasp, paintRangerHat, fangs } from "./costumes";
const PI = Math.PI;
const COMMON = DJ.slice(DJ.indexOf("const float PI"), DJ.indexOf("// ---------- materials ----------"));
const GOLD = "#D8C08A";
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);
const armAt = (sh, a, len) => [sh[0] + Math.cos(a) * len, sh[1] + Math.sin(a) * len];
const rimOf = (m, a = 0.85) => `hsla(${m.pal.b},100%,72%,${a})`;
const HB = { x0: 40, y0: 4, w: 40, h: 62 };
const HDY = 7; // the head sits this much lower than the old Qeth's (a natural neck)
const Q_SH = { uL: [44, 84], uR: [76, 84], lL: [48, 97], lR: [72, 97] };
const Q_SKIN = { lite: "#EEE4FF", mid: "#AE9BDD", dark: "#5A4892", line: "#2A2052" };
const Q_COAT = { lite: "#FFFFFF", mid: "#D9D4F2", dark: "#8A84B8" };
const Q_COAT_LINE = "#3C365E";
const qethRest = { lift: 0, lean: 0, sy: 1, hem: 0, flare: 0, head: 0, headY: 0, look: [0, 0], uL: [20, 110], uR: [100, 110], lL: [52, 108], lR: [68, 108], orb: [60, 106], orbGlow: 0, happy: 0, crown: 0, feet: [0, 0], fly: 0, gather: 0 };
function qArms(angs, lens = [30, 30, 20, 20]) {
  return { uL: armAt(Q_SH.uL, angs[0], lens[0]), uR: armAt(Q_SH.uR, angs[1], lens[1]), lL: armAt(Q_SH.lL, angs[2], lens[2]), lR: armAt(Q_SH.lR, angs[3], lens[3]) };
}
// her crown lights in flight, in the colours of Before's motes
const MOTES = [[233, 210, 154], [232, 207, 192], [139, 149, 246], [185, 192, 255], [255, 248, 236]];
function lightAt(i, B, gather) {
  const a = B * PI * 0.5 + i * (TAU / 5);
  const r = (24 + 7 * Math.sin(B * PI * 0.5 + i * 1.7)) * (1 - 0.88 * gather);
  const bob = -Math.abs(Math.sin((B + i * 0.2) * PI)) * 6 * (1 - gather);
  return [60 + Math.cos(a) * r * 1.25, -18 + Math.sin(a) * r * 0.55 + bob];
}
function drawFlyingLights(ctx, flying, fly, gather, m) {
  const e = fly * fly * (3 - 2 * fly);
  flying.forEach(({ i, tx, ty }) => {
    const c = MOTES[i];
    const col = (a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    for (let k = 5; k >= 1; k--) {
      const [ax, ay] = lightAt(i, m.B - k * 0.05, gather);
      glow(ctx, lerp(tx, ax, e), lerp(ty, ay, e), 5.4 - k * 0.6, col(0.9), (0.6 - k * 0.09) * e);
    }
    const [ax, ay] = lightAt(i, m.B, gather);
    const x = lerp(tx, ax, e), y = lerp(ty, ay, e);
    glow(ctx, x, y, 14 + dipOf(m) * 8 + gather * 10, col(0.95), 1);
    glow(ctx, x, y, 5, col(1), 1);
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x, y, 2.3 + gather * 0.8, 0, TAU); ctx.fill();
  });
  if (gather > 0.6) glow(ctx, 60, -18, 30 * gather, "rgba(255,248,236,0.9)", (gather - 0.6) * 2);
}

const QFRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uT, uB, uBass, uHueA, uHueB, uHappy, uBlink, uFlare, uMouth;
uniform vec2 uLook;
${COMMON}
#define GRAD(F, p) normalize(vec2(F(p + vec2(0.1, 0.0)) - F(p - vec2(0.1, 0.0)), F(p + vec2(0.0, 0.1)) - F(p - vec2(0.0, 0.1))) + 1e-5)
// the head: a long, elegant skull sweeping up and back, high cheekbones, a narrow chin
float headSD(vec2 p) {
  float skull = sdEll(p - vec2(60.0, 33.0), vec2(12.2, 16.5));
  float crown = sdEll(p - vec2(60.0, 20.0), vec2(10.0, 11.5));
  float jaw = sdEll(p - vec2(60.0, 47.5), vec2(8.6, 11.8));
  float cheeks = sdEll(vec2(abs(p.x - 60.0), p.y) - vec2(6.2, 43.0), vec2(5.6, 6.2));
  return smin(smin(smin(skull, crown, 5.0), jaw, 6.0), cheeks, 3.0);
}
float curHead(vec2 p) { return headSD(p); }
float distCurve(vec2 p, vec2 a, vec2 c, vec2 b) {
  float best = 1e3;
  for (int i = 0; i < 12; i++) {
    float t0 = float(i) / 12.0, t1 = float(i + 1) / 12.0;
    vec2 q0 = mix(mix(a, c, t0), mix(c, b, t0), t0), q1 = mix(mix(a, c, t1), mix(c, b, t1), t1);
    vec2 pa = p - q0, ba = q1 - q0; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    best = min(best, length(pa - ba * h));
  }
  return best;
}
// one eye: a dark almond tilted up at the outer corner, a luminous iris,
// liner with a little wing, a lid shadow, a wet glint
vec3 eye(vec3 c, vec2 p, float s) {
  vec2 ec = vec2(60.0 + s * 7.6, 38.6);
  vec2 q = rot(p - ec, s * 0.2);
  vec2 er = vec2(4.9, 2.65);
  // lid shadow (violet-rose) above, and a soft socket
  float above = exp(-pow((q.y + 2.6) / 1.9, 2.0)) * smoothstep(6.5, 2.0, abs(q.x));
  c = mix(c, c * lin(vec3(0.85, 0.55, 0.95)), above * 0.6);
  float closed = max(step(0.5, uHappy), uBlink);
  if (closed > 0.5) {
    // closed: a curved lash line, smiling if happy
    float arcY = mix(0.0, -1.6, uHappy * (1.0 - uBlink));
    float lid = distCurve(q, vec2(-4.6, 0.3), vec2(0.0, 0.6 + arcY * 1.5), vec2(5.2, -0.6));
    c *= 1.0 - 0.85 * smoothstep(0.55, 0.15, lid);
    return c;
  }
  float ed = sdEll(q, er);
  if (ed < 0.6) {
    vec2 qq = q / er; float e = clamp(length(qq), 0.0, 1.0);
    vec3 en = normalize(vec3(qq * 0.8, sqrt(max(1.0 - e * e, 0.0)) + 0.25));
    vec3 ecol = lin(vec3(0.05, 0.03, 0.12));                       // dark sclera, faintly violet
    vec2 iq = q - uLook * 0.55 - vec2(0.0, 0.15);
    float ir = length(iq) / 2.4;
    if (ir < 1.08) {
      float ang = atan(iq.y, iq.x);
      vec3 inner = lin(hsl2rgb(uHueB, 0.6, 0.82)), mid = lin(vec3(0.62, 0.42, 0.98)), outer = lin(vec3(0.16, 0.08, 0.38));
      vec3 ic = mix(inner, mid, smoothstep(0.1, 0.55, ir));
      ic = mix(ic, outer, smoothstep(0.6, 1.0, ir));
      ic *= 0.78 + 0.35 * noise(vec2(ang * 10.0, ir * 4.0));      // fibres
      ic *= 1.0 + 0.5 * pow(0.5 + 0.5 * sin(ir * 14.0 - uT * 2.0), 8.0) * (0.5 + uBass);
      float pupil = length(iq / vec2(0.32 + uBass * 0.15, 1.15));  // a slim, upright pupil
      ic = mix(ic, lin(vec3(0.01, 0.0, 0.03)), smoothstep(1.0, 0.75, pupil));
      ecol = mix(ecol, ic * 1.45, smoothstep(1.06, 0.96, ir));
    }
    // the lid's shadow on the top of the eye, and wet light
    ecol *= 1.0 - 0.55 * smoothstep(-0.2, -1.0, q.y / er.y * -1.0) * step(q.y, 0.0) * 0.0;
    ecol *= mix(0.55, 1.0, smoothstep(-2.4, -0.6, q.y));
    vec3 H = normalize(normalize(vec3(-0.35, -0.7, 0.6)) + vec3(0.0, 0.0, 1.0));
    ecol += vec3(1.0) * pow(max(dot(en, H), 0.0), 260.0) * 1.3;
    ecol += vec3(1.0) * smoothstep(1.0, 0.5, length(q - uLook * 0.55 - vec2(-0.85, -0.85)) / 0.55) * 0.9;
    ecol += vec3(1.0) * smoothstep(1.0, 0.5, length(q - uLook * 0.55 - vec2(0.75, 0.6)) / 0.3) * 0.35;
    c = mix(c, ecol, clamp(0.5 - ed / px, 0.0, 1.0));
  }
  // the liner: thick along the top, a flick up at the outer corner; thin below
  float top = distCurve(q, vec2(-4.6, 0.1), vec2(-0.5, -3.5), vec2(4.6, -0.6));
  float wing = distCurve(q, vec2(3.8, -0.9), vec2(5.4, -1.4), vec2(6.6, -2.4));
  float bot = distCurve(q, vec2(-4.3, 0.4), vec2(0.0, 2.9), vec2(4.4, 0.2));
  vec3 liner = lin(vec3(0.06, 0.02, 0.1));
  c = mix(c, liner, smoothstep(0.42, 0.2, top));
  c = mix(c, liner, smoothstep(0.32, 0.12, wing - (1.0 - smoothstep(3.8, 6.6, q.x)) * 0.12));
  c = mix(c, liner, smoothstep(0.16, 0.06, bot) * 0.7);
  // fine lash filaments catching light at the outer corner
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    vec2 a = vec2(2.2 + fk * 1.1, -2.6 + fk * 0.6);
    float ld = distCurve(q, a, a + vec2(0.5, -0.9), a + vec2(1.1, -1.5));
    c = mix(c, liner, smoothstep(0.12, 0.04, ld));
  }
  return c;
}
void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uBox.x + f.x * uBox.z, uBox.y + (1.0 - f.y) * uBox.w);
  px = uBox.z / uRes.x;
  rimA = lin(hsl2rgb(uHueA, 1.0, 0.62)) * 0.9;
  rimB = lin(hsl2rgb(uHueB, 1.0, 0.68)) * 0.9;
  vec3 glowC = lin(hsl2rgb(uHueB, 0.9, 0.78));
  float hd = headSD(p);
  if (hd < px * 2.0) {
    vec2 g = GRAD(curHead, p);
    vec3 n = nrm(g, hd, 9.0);
    vec2 ap = vec2(abs(p.x - 60.0), p.y);
    float side = sign(p.x - 60.0);
    // cheekbones high and soft, a slim nose bridge, the brow line
    float cheek = exp(-dot((ap - vec2(8.6, 44.0)) / vec2(3.2, 2.6), (ap - vec2(8.6, 44.0)) / vec2(3.2, 2.6)));
    float under = exp(-dot((ap - vec2(8.0, 48.5)) / vec2(3.0, 2.4), (ap - vec2(8.0, 48.5)) / vec2(3.0, 2.4)));
    float bridge = exp(-pow(ap.x / 0.9, 2.0)) * smoothstep(38.0, 41.0, p.y) * smoothstep(49.5, 46.5, p.y);
    float tip = exp(-dot((p - vec2(60.0, 48.6)) / vec2(1.5, 1.0), (p - vec2(60.0, 48.6)) / vec2(1.5, 1.0)));
    n = normalize(n + vec3(side * (cheek * 0.35 - under * 0.15), cheek * 0.1 - under * 0.2, bridge * 0.25 + tip * 0.3));
    n = normalize(n + vec3(-side * bridge * 0.0, 0.0, 0.0));
    vec3 alb = lin(vec3(0.82, 0.76, 0.96)) * (0.93 + 0.1 * fbm(p * 0.6 + 3.0));
    // the sheen: thin-film colour, teal toward the edges, rose on the cheeks
    float edgeK = pow(1.0 - n.z, 1.5);
    alb = mix(alb, lin(vec3(0.55, 0.88, 0.92)), edgeK * 0.45);
    alb = mix(alb, lin(vec3(0.98, 0.66, 0.84)), cheek * 0.38);
    vec2 b = vec2(noise(p * 3.0) - 0.5, noise(p * 3.0 + 7.3) - 0.5) * 0.03;
    n = normalize(n + vec3(b, 0.0));
    vec3 c = light(alb, n, 40.0, 0.35, 0.65, lin(vec3(0.95, 0.55, 0.8)), 1.0);
    c *= mix(1.0, 0.55, pow(clamp(1.0 + hd / 9.0, 0.0, 1.0), 4.0));
    c *= 1.0 - under * 0.08;
    // nose: a soft shadow down one side of the bridge, small nostrils
    c *= 1.0 - 0.18 * exp(-pow((p.x - 61.1) / 0.6, 2.0)) * smoothstep(40.0, 43.0, p.y) * smoothstep(49.0, 46.0, p.y);
    float nos = min(length((p - vec2(58.9, 49.5)) / vec2(0.7, 0.35)), length((p - vec2(61.1, 49.5)) / vec2(0.7, 0.35)));
    c *= 1.0 - 0.45 * smoothstep(1.0, 0.4, nos);
    c += vec3(1.0) * 0.12 * exp(-dot((p - vec2(59.6, 47.6)) / vec2(0.5, 0.8), (p - vec2(59.6, 47.6)) / vec2(0.5, 0.8)));
    // brows: a fine arc of glowing points
    for (int i = 0; i < 10; i++) {
      float fi = float(i), s = fi < 5.0 ? -1.0 : 1.0, k = mod(fi, 5.0) / 4.0;
      vec2 dc = vec2(60.0 + s * mix(4.2, 11.2, k), 33.2 - sin(k * PI) * 1.4 + k * 0.6);
      float on = 0.55 + 0.45 * max(0.0, sin(uB * PI - k * 1.5));
      float dd = length(p - dc);
      c = mix(c, glowC * (1.1 + on * 0.5), smoothstep(0.42, 0.22, dd) * on);
      c += glowC * exp(-dd * 2.0) * on * 0.18;
    }
    // freckles: a constellation across the cheekbones, pulsing
    for (int i = 0; i < 10; i++) {
      float fi = float(i), s = fi < 5.0 ? -1.0 : 1.0, k = mod(fi, 5.0);
      vec2 dc = vec2(60.0 + s * (4.8 + k * 1.35), 44.0 + sin(k * 1.7) * 0.9 + k * 0.15);
      float on = 0.35 + 0.65 * max(0.0, sin(uB * PI * 0.5 - k * 0.9 + s));
      float dd = length(p - dc);
      c = mix(c, glowC * 1.3, smoothstep(0.32, 0.12, dd) * on);
      c += glowC * exp(-dd * 1.6) * on * 0.12;
    }
    // the eyes
    c = eye(c, p, -1.0);
    c = eye(c, p, 1.0);
    // the mark on her brow: a teardrop of light that brightens on the beat
    {
      vec2 q = (p - vec2(60.0, 28.6)) / vec2(1.0, 1.7);
      float td = length(q + vec2(0.0, q.y < 0.0 ? 0.0 : 0.0)) - (0.75 + 0.25 * smoothstep(-1.0, 1.0, q.y));
      c = mix(c, glowC * (1.4 + uFlare), smoothstep(0.12, -0.12, td));
      c += glowC * exp(-max(td, 0.0) * 1.5) * (0.25 + uFlare * 0.4);
    }
    // the lips: full, rose-violet, a cupid's bow, glossy; they part to talk and curve to smile
    {
      vec2 q = p - vec2(60.0, 53.4);
      float w = 3.7 + uHappy * 0.5;
      float xk = clamp(q.x / w, -1.0, 1.0);
      float k = 1.0 - xk * xk;
      float open = (uMouth * 1.3 + uHappy * 0.25) * k;
      float smile = uHappy * 0.9 * xk * xk;
      float seamU = -0.05 - smile - 0.08 * exp(-q.x * q.x * 3.0) * 0.0;
      float seamL = seamU + open;
      float upTop = seamU - 1.1 * k - 0.15 + 0.35 * exp(-q.x * q.x * 1.6) * k;   // the bow dips in the middle
      float loBot = seamL + 1.35 * k + 0.1;
      vec3 lipC = lin(vec3(0.74, 0.32, 0.58));
      if (abs(q.x) < w) {
        if (q.y > upTop && q.y < seamU) {
          float t = (q.y - upTop) / max(seamU - upTop, 0.01);
          vec3 lc = lipC * (0.8 + 0.25 * t);
          lc += vec3(1.0) * 0.12 * exp(-pow((t - 0.25) / 0.15, 2.0)) * k;
          c = mix(c, lc, smoothstep(0.0, 0.18, q.y - upTop) * smoothstep(0.0, 0.1, seamU - q.y + 0.05) * smoothstep(1.0, 0.85, abs(xk)));
        }
        if (q.y > seamL && q.y < loBot) {
          float t = (q.y - seamL) / max(loBot - seamL, 0.01);
          vec3 lc = lipC * (1.05 - 0.35 * t);
          lc += vec3(1.0) * 0.45 * exp(-pow((t - 0.4) / 0.14, 2.0)) * exp(-pow(q.x / (w * 0.45), 2.0));   // gloss
          c = mix(c, lc, smoothstep(0.0, 0.12, loBot - q.y) * smoothstep(1.0, 0.85, abs(xk)));
        }
        if (q.y >= seamU && q.y <= seamL) {
          vec3 ins = lin(vec3(0.16, 0.04, 0.14));
          ins += lin(vec3(0.9, 0.88, 0.95)) * step(q.y, seamU + 0.35) * step(abs(xk), 0.6) * 0.6;
          c = mix(c, ins, smoothstep(0.0, 0.08, q.y - seamU) * smoothstep(0.0, 0.08, seamL - q.y));
        }
        // the seam and the corners
        c *= 1.0 - 0.55 * smoothstep(0.16, 0.0, abs(q.y - seamU)) * smoothstep(1.02, 0.9, abs(xk)) * step(open, 0.05);
      }
      vec2 cq = vec2(abs(q.x) - w, q.y - seamU + smile * 0.2);
      c *= 1.0 - 0.35 * exp(-dot(cq, cq) / 0.18);
      c *= 1.0 - 0.18 * exp(-pow((q.y - loBot - 0.9) / 0.6, 2.0)) * exp(-pow(q.x / 2.6, 2.0));   // the shadow under the lower lip
    }
    put(hd, c);
  }
  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;

// a tapered, glowing strand along a cubic curve (her locks and fronds)
function strand(ctx, a, b, c, d, w0, w1, cols, tipGlow) {
  const N = 18, pts = [];
  for (let k = 0; k <= N; k++) {
    const t = k / N, u = 1 - t;
    pts.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]);
  }
  const L = [], R = [];
  pts.forEach(([x, y], k) => {
    const p0 = pts[Math.max(0, k - 1)], p1 = pts[Math.min(N, k + 1)];
    let tx = p1[0] - p0[0], ty = p1[1] - p0[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
    const w = lerp(w0, w1, k / N) * (1 + 0.25 * Math.sin((k / N) * PI));
    L.push([x - ty * w, y + tx * w]); R.push([x + ty * w, y - tx * w]);
  });
  const path = new Path2D();
  L.forEach(([x, y], k) => (k ? path.lineTo(x, y) : path.moveTo(x, y)));
  for (let k = N; k >= 0; k--) path.lineTo(R[k][0], R[k][1]);
  path.closePath();
  ctx.fillStyle = linear(ctx, a[0], a[1], d[0], d[1], cols); ctx.fill(path);
  // a highlight running along it
  ctx.strokeStyle = "rgba(255,255,255,0.28)"; ctx.lineWidth = Math.max(0.2, w0 * 0.22);
  ctx.beginPath(); pts.forEach(([x, y], k) => { const X = lerp(x, R[k][0], 0.45), Y = lerp(y, R[k][1], 0.45); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
  ctx.strokeStyle = "rgba(20,10,50,0.35)"; ctx.lineWidth = 0.25; ctx.stroke(path);
  if (tipGlow) glow(ctx, d[0], d[1], tipGlow.r, tipGlow.c, tipGlow.a);
  return pts;
}

function drawBody(ctx, p, m, paintHead) {
  const rim = rimOf(m);
  const t = m.t, hueA = m.pal.a, hueB = m.pal.b;
  const dip = dipOf(m);
  const pipe = (a) => `hsla(${hueB},95%,72%,${a})`;
  ctx.save();
  ctx.translate(0, p.lift);
  ctx.rotate(p.lean);
  ctx.scale(1, p.sy);
  ctx.translate(-60, -150);
  glow(ctx, 60, 60, 44, `hsla(${hueB},80%,70%,0.25)`, 0.3 + p.crown * 0.4 + m.bass * 0.3);
  if (m.halloween && !paintVampireCape(ctx, p, m)) qethCape(ctx, p, m);

  // ── her locks, behind everything: they sweep back from the crown and fall
  // to her shoulders, swinging with the music
  const swing = Math.sin(m.B * PI) * (1.2 + m.amp * 2) + p.lean * 20;
  const hx = (x) => x; // head is drawn in place; locks follow the head's tilt below
  ctx.save();
  ctx.translate(60, 74 + p.headY); ctx.rotate(p.head * 0.6); ctx.translate(-60, -74 + HDY);
  // the mane: a sleek volume swept back from the crown, falling past her shoulders
  {
    const sw = swing * 0.5;
    const mane = new Path2D(`M60 8 C${76} 8 ${80.5 + sw * 0.2} 22 ${79 + sw * 0.3} 40 C${77 + sw * 0.5} 56 ${80 + sw} 68 ${78.5 + sw} 80 Q${74 + sw} 84 ${70 + sw * 0.8} 79 Q${66} 66 60 62 Q${54} 66 ${50 + sw * 0.8} 79 Q${46 + sw} 84 ${41.5 + sw} 80 C${40 + sw} 68 ${41 + sw * 0.5} 56 ${41 + sw * 0.3} 40 C${39.5 + sw * 0.2} 22 44 8 60 8 Z`);
    ctx.fillStyle = linear(ctx, 0, 9, 0, 84, [[0, "#2E2470"], [0.45, "#3C2C8A"], [0.8, `hsl(${(hueA + 250) % 360},55%,42%)`], [1, `hsl(${hueB},70%,58%)`]]);
    ctx.fill(mane);
    ctx.save(); ctx.clip(mane);
    // sheen bands and strands
    for (let k = 0; k < 14; k++) {
      const s2 = k < 7 ? -1 : 1, j = k % 7, x0 = 60 + s2 * (3 + j * 2.2);
      ctx.strokeStyle = j % 2 ? "rgba(190,170,255,0.22)" : "rgba(20,10,60,0.35)"; ctx.lineWidth = 0.45;
      ctx.beginPath(); ctx.moveTo(60 + s2 * j * 0.8, 10); ctx.bezierCurveTo(x0 + s2 * 9, 22, x0 + s2 * 8 + sw * 0.3, 52, x0 + s2 * 6 + sw, 84); ctx.stroke();
    }
    ctx.fillStyle = radial(ctx, 52, 24, 16, [[0, "rgba(220,200,255,0.3)"], [1, "rgba(220,200,255,0)"]]); ctx.fillRect(36, 8, 48, 40);
    ctx.restore();
    ctx.strokeStyle = "rgba(20,10,60,0.5)"; ctx.lineWidth = 0.4; ctx.stroke(mane);
  }
  // loose locks over the mane, swinging with the music, lit at the ends
  [[-1, 0], [1, 0], [-1, 1], [1, 1]].forEach(([s, k]) => {
    const r0 = [60 + s * (9 + k * 3), 18 + k * 6];
    const sw = swing * (0.7 + k * 0.3) + Math.sin(t * 1.3 + k + s) * 0.7;
    const end = [60 + s * (16 + k * 3) + sw, 82 + k * 6];
    strand(ctx, r0, [60 + s * (19 + k * 2), 28 + k * 4], [60 + s * (13 + k * 2) + sw * 0.5, 58 + k * 4], end,
      1.7 - k * 0.2, 0.45, [[0, "#3A2A80"], [0.55, `hsl(${(hueA + 255) % 360},55%,55%)`], [1, `hsl(${hueB},85%,78%)`]],
      { r: 2, c: pipe(0.9), a: 0.35 + dip * 0.35 });
  });
  // fin-like ears: translucent, ribbed, catching the rim light
  [-1, 1].forEach((s) => {
    const ear = new Path2D();
    ear.moveTo(60 + s * 10.5, 34); ear.quadraticCurveTo(60 + s * 19, 26 - p.crown * 2, 60 + s * 21.5, 22 - dip * 1.2);
    ear.quadraticCurveTo(60 + s * 18, 34, 60 + s * 11, 42); ear.closePath();
    ctx.fillStyle = linear(ctx, 60 + s * 10, 36, 60 + s * 21, 22, [[0, "#8C78C8"], [0.6, "rgba(190,170,240,0.75)"], [1, pipe(0.7)]]); ctx.fill(ear);
    ctx.strokeStyle = "rgba(60,40,110,0.5)"; ctx.lineWidth = 0.25;
    for (let r = 0; r < 3; r++) { ctx.beginPath(); ctx.moveTo(60 + s * 11, 37 + r * 1.5); ctx.quadraticCurveTo(60 + s * (16 + r), 30 - r, 60 + s * (20.5 - r * 1.2), 23 + r * 2.2); ctx.stroke(); }
    ctx.strokeStyle = pipe(0.6); ctx.lineWidth = 0.3; ctx.stroke(ear);
  });
  ctx.restore();

  // feet: slim heeled boots under the hem
  [[52, p.feet[0]], [68, p.feet[1]]].forEach(([x, f]) => {
    const fx = x + (x - 60) * 0.2 * f, fy = 150 - f * 3;
    ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(fx, 150.6, 5.5, 1.3, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = linear(ctx, fx - 4, fy - 6, fx + 4, fy, [[0, "#4A3C86"], [1, "#140E30"]]);
    ctx.beginPath(); ctx.moveTo(fx - 2.4, fy - 9); ctx.lineTo(fx + 2.2, fy - 9); ctx.lineTo(fx + 2.6, fy - 2); ctx.quadraticCurveTo(fx + 5.2, fy - 1.4, fx + 4.8, fy); ctx.lineTo(fx - 1.2, fy); ctx.lineTo(fx - 2.2, fy + 0.2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = pipe(0.7); ctx.lineWidth = 0.35; ctx.beginPath(); ctx.moveTo(fx - 2.3, fy - 6); ctx.lineTo(fx + 2.4, fy - 6); ctx.stroke();
  });

  // ── the coat: fitted at the waist, flaring to the hem, split at the front ──
  const h = p.hem, fl = p.flare;
  const hemY = 147 + Math.abs(h) * 0.2;
  // the undersuit showing through the split
  const under = new Path2D(`M53 105 L67 105 L${66 + h} ${hemY} L${54 + h} ${hemY} Z`);
  ctx.fillStyle = linear(ctx, 52, 0, 68, 0, [[0, "#120C2C"], [0.5, "#2C2260"], [1, "#100A28"]]); ctx.fill(under);
  const coat = new Path2D(`M45.5 84 Q48 95 50.6 105.6 Q${40 + h * 0.4} 124 ${36 + h - fl} ${hemY - 1} Q${46 + h} ${hemY + 1.5} ${57 + h} ${hemY} L60 110 L${63 + h} ${hemY} Q${74 + h} ${hemY + 1.5} ${84 + h + fl} ${hemY - 1} Q${80 + h * 0.4} 124 69.4 105.6 Q72 95 74.5 84 Q60 80 45.5 84 Z`);
  ctx.fillStyle = linear(ctx, 36 + h * 0.3, 0, 84 + h * 0.3, 0, [[0, "#5E5890"], [0.18, "#A8A2D2"], [0.4, "#E4E0F6"], [0.58, "#CFC9EC"], [0.82, "#8C86BC"], [1, "#4E487E"]]);
  ctx.fill(coat);
  ctx.save(); ctx.clip(coat);
  // the bodice: soft shading for its shape, princess seams
  ctx.fillStyle = radial(ctx, 55, 92, 12, [[0, "rgba(255,255,255,0.18)"], [1, "rgba(255,255,255,0)"]]); ctx.fillRect(40, 80, 40, 30);
  ctx.fillStyle = linear(ctx, 0, 100, 0, 110, [[0, "rgba(40,30,90,0)"], [1, "rgba(40,30,90,0.25)"]]); ctx.fillRect(40, 100, 40, 10);
  ctx.strokeStyle = "rgba(70,60,120,0.4)"; ctx.lineWidth = 0.35;
  ctx.beginPath(); ctx.moveTo(52, 85); ctx.quadraticCurveTo(50.5, 97, 53.5, 107); ctx.moveTo(68, 85); ctx.quadraticCurveTo(69.5, 97, 66.5, 107); ctx.stroke();
  // the skirt's folds: turned bands of cloth
  for (let i = 0; i < 6; i++) {
    const side = i < 3 ? -1 : 1, j = i % 3;
    const x0 = 60 + side * (5 + j * 3.5), x1 = 60 + side * (9 + j * 8) + h + side * fl * (j / 2);
    ctx.beginPath(); ctx.moveTo(x0 - 1, 110); ctx.quadraticCurveTo(lerp(x0, x1, 0.5) + h * 0.2, 128, x1 - 2.5, hemY + 2); ctx.lineTo(x1 + 2.5, hemY + 2); ctx.quadraticCurveTo(lerp(x0, x1, 0.5) + h * 0.2 + 1.5, 128, x0 + 1, 110); ctx.closePath();
    ctx.fillStyle = linear(ctx, x1 - 2.5, 0, x1 + 2.5, 0, [[0, "rgba(60,50,110,0)"], [0.35, "rgba(60,50,110,0.32)"], [0.65, "rgba(255,255,255,0.4)"], [1, "rgba(255,255,255,0)"]]);
    ctx.fill();
  }
  // the panels: violet-teal side panels on the skirt with glowing piping
  ctx.fillStyle = linear(ctx, 0, 110, 0, 150, [[0, "rgba(90,70,170,0.0)"], [1, "rgba(90,70,170,0.35)"]]); ctx.fillRect(30, 110, 60, 42);
  ctx.restore();
  shade(ctx, coat, [36, 80, 48, 72], { rim: rimOf(m, 0.35), shadow: 0.45, spec: 0.12, sx: 0.35, sy: 0.12, line: Q_COAT_LINE, lineW: 0.45 });
  // the front edges and hem: glowing piping
  ctx.lineCap = "round";
  [[`M60 110 L${57 + h} ${hemY}`], [`M60 110 L${63 + h} ${hemY}`], [`M${36 + h - fl} ${hemY - 1} Q${46 + h} ${hemY + 1.5} ${57 + h} ${hemY}`], [`M${63 + h} ${hemY} Q${74 + h} ${hemY + 1.5} ${84 + h + fl} ${hemY - 1}`]].forEach(([d]) => {
    ctx.strokeStyle = pipe(0.25); ctx.lineWidth = 1.0; ctx.stroke(P(d));
    ctx.strokeStyle = pipe(0.9); ctx.lineWidth = 0.35; ctx.stroke(P(d));
  });
  // the belt: a slim violet band, a jewel clasp, and her vials
  const belt = P("M50.2 104.4 Q60 107.2 69.8 104.4 L70.4 108.4 Q60 111.2 49.6 108.4 Z");
  ctx.fillStyle = linear(ctx, 0, 104, 0, 111, [[0, "#5A44A8"], [0.5, "#33246E"], [1, "#180F3A"]]); ctx.fill(belt);
  trim(ctx, P("M50.2 104.4 Q60 107.2 69.8 104.4"), 0.4, GOLD);
  [[52.6, 105.8, (hueB + 120) % 360], [54.6, 106.3, hueB]].forEach(([x, y, hh]) => {
    ctx.fillStyle = "#1A1438"; ctx.fillRect(x - 0.7, y - 0.4, 1.4, 4.4);
    ctx.fillStyle = `hsla(${hh},90%,65%,0.95)`; ctx.fillRect(x - 0.5, y + 0.6, 1, 3.1);
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fillRect(x - 0.35, y + 0.8, 0.22, 2.4);
    glow(ctx, x, y + 2, 2.6, `hsla(${hh},90%,65%,0.8)`, 0.3 + m.high * 0.5);
  });
  ctx.fillStyle = radial(ctx, 60, 107.6, 2.4, [[0, "#FFFFFF"], [0.4, `hsl(${hueA},100%,72%)`], [1, `hsl(${hueA},80%,30%)`]], 59.3, 106.9);
  ctx.beginPath(); ctx.ellipse(60, 107.6, 1.9, 2.3, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 0.5; ctx.stroke();
  glow(ctx, 60, 107.6, 6, `hsla(${hueA},100%,65%,0.9)`, 0.35 + m.bass * 0.5);
  if (m.halloween) vampireClasp(ctx, m);
  // the badge over her heart: the Lab's mark, lit
  ctx.fillStyle = "#2A2060"; ctx.beginPath(); ctx.ellipse(66.6, 92, 2.4, 1.6, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = pipe(0.5 + 0.4 * dip); ctx.lineWidth = 0.3; ctx.stroke();
  ctx.beginPath(); ctx.arc(66.6, 92, 0.7, 0, TAU); ctx.stroke();

  // ── the neck, the collar ──
  {
    const y0 = 60 + HDY + p.headY;
    const neck = P(`M55.6 ${y0} C55.4 ${y0 + 8} 54.6 ${y0 + 12} 51 82.5 L69 82.5 C65.4 ${y0 + 12} 64.6 ${y0 + 8} 64.4 ${y0} Z`);
    ctx.fillStyle = linear(ctx, 51, 0, 69, 0, [[0, "#5E4C9A"], [0.3, "#B5A4E2"], [0.55, "#D8CBF6"], [0.8, "#9D8CCC"], [1, "#4E3E88"]]);
    ctx.fill(neck);
    ctx.fillStyle = linear(ctx, 0, y0, 0, y0 + 6, [[0, "rgba(40,20,90,0.45)"], [1, "rgba(40,20,90,0)"]]); ctx.fill(neck);
    ctx.strokeStyle = rim; ctx.lineWidth = 0.3; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(64.4, y0 + 1); ctx.bezierCurveTo(64.6, y0 + 8, 65.4, y0 + 12, 69, 82.5); ctx.stroke(); ctx.globalAlpha = 1;
  }
  // the collarbones and the throat's shadow
  ctx.strokeStyle = "rgba(70,50,130,0.35)"; ctx.lineWidth = 0.35;
  ctx.beginPath(); ctx.moveTo(55, 81.2); ctx.quadraticCurveTo(57.8, 82.2, 59.4, 81.6); ctx.moveTo(65, 81.2); ctx.quadraticCurveTo(62.2, 82.2, 60.6, 81.6); ctx.stroke();
    // a slim choker with a pendant of light
  ctx.strokeStyle = "#2A1E5A"; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(55.6, 74.6); ctx.quadraticCurveTo(60, 76.6, 64.4, 74.6); ctx.stroke();
  ctx.fillStyle = pipe(1); ctx.beginPath(); ctx.arc(60, 76.7, 0.65, 0, TAU); ctx.fill(); glow(ctx, 60, 76.7, 2.4, pipe(0.9), 0.5 + dip * 0.4);
  // the high collar: two lapels rising behind the neck, open at the throat
  [-1, 1].forEach((s) => {
    const lap = P(`M${60 + s * 3.5} 84.5 L${60 + s * 13} 81.5 Q${60 + s * 15} 74 ${60 + s * 10.2} 68.5 Q${60 + s * 6.8} 75 ${60 + s * 4.6} 79 Z`);
    ctx.fillStyle = linear(ctx, 60 + s * 4, 70, 60 + s * 14, 84, [[0, "#FFFFFF"], [0.6, "#D0CAEA"], [1, "#8A84B8"]]); ctx.fill(lap);
    ctx.strokeStyle = pipe(0.85); ctx.lineWidth = 0.45; ctx.stroke(lap);
  });

  // ── lower arms, the orb, upper arms ──
  const sleeve = { to: 0.48, w: 1.35, col: Q_COAT, trim: pipe(0.9) };
  const handO = { n: 3, len: 5.4, w: 0.85, palm: 1.5, spread: 1.0, curl: 0.3, col: Q_SKIN, tipCol: pipe(1) };
  [[Q_SH.lL, p.lL, -0.4], [Q_SH.lR, p.lR, 0.4]].forEach(([sh, hd, b]) => {
    const r = arm3d(ctx, sh, hd, { bend: b, w0: 3.1, w1: 1.7, col: Q_SKIN, rim, bulge: 0.4, sleeve: { ...sleeve, to: 0.3, w: 1.3 } });
    hand3d(ctx, hd, r.angle, { ...handO, len: 3.8 });
  });
  [[Q_SH.uL, p.uL, -0.5], [Q_SH.uR, p.uR, 0.5]].forEach(([sh, hd, b]) => {
    const r = arm3d(ctx, sh, hd, { bend: b, w0: 3.6, w1: 1.9, col: Q_SKIN, rim, bulge: 0.45, sleeve, bands: [0.86], bandCol: pipe(0.85) });
    hand3d(ctx, hd, r.angle, handO);
  });
  // shoulders: soft rolled seams where the sleeves meet the coat
  [[Q_SH.uL, -1], [Q_SH.uR, 1]].forEach(([[x, y], s]) => {
    ctx.fillStyle = radial(ctx, x, y - 0.5, 4.5, [[0, "#FFFFFF"], [0.7, "#D4CEEE"], [1, "rgba(140,130,190,0)"]], x - s * 1, y - 1.5);
    ctx.beginPath(); ctx.ellipse(x + s * 0.6, y - 0.4, 4.4, 3.2, s * 0.35, 0, TAU); ctx.fill();
    ctx.strokeStyle = pipe(0.6); ctx.lineWidth = 0.3; ctx.beginPath(); ctx.ellipse(x + s * 0.6, y - 0.4, 4.4, 3.2, s * 0.35, PI * (s > 0 ? 1.1 : 1.6), PI * (s > 0 ? 1.4 : 1.9)); ctx.stroke();
  });

  // ── the head ──
  ctx.save();
  ctx.translate(60, 74 + p.headY); ctx.rotate(p.head); ctx.translate(-60, -74 + HDY);
  ctx.fillStyle = "rgba(20,10,50,0.14)"; ctx.beginPath(); ctx.ellipse(60.5, 60.5, 5, 1.6, 0, 0, TAU); ctx.fill();
  // the crown fronds: five slender fronds rising from the crown, lit at the tips;
  // they flare on the beat, and in "lights" the lit tips fly off and dance
  const flare = dip * (0.4 + 0.6 * m.amp);
  const fly = smooth(0, 1, p.fly || 0);
  const flying = [];
  [[-9, 15], [-4.6, 10], [0, 7.5], [4.6, 10], [9, 15]].forEach(([dx, top], i) => {
    const sway = Math.sin(t * 2 + i) * 1.2 + (p.crown ? Math.sin(m.B * PI + i) * 2.5 * p.crown : 0);
    const tx = 60 + dx * 1.35 + sway, ty = top - 9 - flare * 2.5 * (1 - fly);
    strand(ctx, [60 + dx * 0.45, 14 + Math.abs(dx) * 0.2], [60 + dx * 0.7, top + 2], [60 + dx * 1.1 + sway * 0.5, top - 3], [tx, ty], 1.15, 0.35,
      [[0, "#6A56B4"], [0.6, `hsl(${(hueA + 260) % 360},55%,62%)`], [1, `hsl(${hueB},85%,82%)`]], null);
    if (fly < 0.02) {
      ctx.fillStyle = "#FFF6EA"; ctx.beginPath(); ctx.arc(tx, ty, 1.35, 0, TAU); ctx.fill();
      glow(ctx, tx, ty, 3 + flare * 3 + p.crown * 2.5, "rgba(255,240,250,0.95)", 0.45 + flare * 0.45);
    } else flying.push({ i, tx, ty });
  });
  paintHead(ctx, p, m);
  // two locks in front, framing her face
  [-1, 1].forEach((s) => {
    const sw = swing * 0.3 + Math.sin(t * 1.7 + s) * 0.4;
    strand(ctx, [60 + s * 8.5, 22], [60 + s * 13.5, 28], [60 + s * 12.5 + sw * 0.4, 46], [60 + s * 13.5 + sw, 62], 1.5, 0.45,
      [[0, "#45338A"], [0.6, `hsl(${(hueA + 260) % 360},55%,55%)`], [1, `hsl(${hueB},90%,80%)`]], { r: 2.2, c: pipe(0.9), a: 0.4 + dip * 0.4 });
  });
  if (m.halloween) fangs(ctx, [58.2, 61.8], 54.6 + (p.happy || 0) * 0.4, 1.6, 0.6);
  if (flying.length) drawFlyingLights(ctx, flying, fly, p.gather || 0, m);
  if (m.cicada && !paintRangerHat(ctx, m, 60, 14, 38, 0)) rangerHat(ctx, 60, 14, 38, 0);
  ctx.restore();

  // the orb, always in front of everything else
  const [ox, oy] = p.orb;
  glow(ctx, ox, oy, 9 + p.orbGlow * 14 + m.bass * 6, pipe(0.9), 0.22 + p.orbGlow * 0.4);
  ctx.fillStyle = radial(ctx, ox, oy, 6.5, [[0, "#FFFFFF"], [0.35, `hsl(${hueB},90%,78%)`], [0.8, "#4A3A9A"], [1, "#1C1450"]], ox - 2, oy - 2);
  ctx.beginPath(); ctx.arc(ox, oy, 6, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(ox, oy); ctx.rotate(t * 1.5); ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(0, 0, 3.8, 0, 2.2); ctx.stroke(); ctx.restore();
  ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.ellipse(ox - 2, oy - 2.4, 1.6, 0.9, -0.6, 0, TAU); ctx.fill();
  ctx.restore();
}

export function makeQeth() {
  const G = makeGL(QFRAG, HB, ["uRes", "uBox", "uT", "uB", "uBass", "uHueA", "uHueB", "uHappy", "uBlink", "uFlare", "uLook", "uMouth"], [], "QB_");
  if (!G) return null;
  function paintHead(ctx, p, m) {
    const tf = ctx.getTransform(); const k = Math.hypot(tf.a, tf.b);
    let w = Math.round(HB.w * k), h = Math.round(HB.h * k);
    const cap = 1100 / Math.max(w, h); if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
    const { gl, U, c } = G;
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h); gl.uniform4f(U.uBox, HB.x0, HB.y0, HB.w, HB.h);
    gl.uniform1f(U.uT, m.t); gl.uniform1f(U.uB, m.B); gl.uniform1f(U.uBass, m.bass); gl.uniform1f(U.uHueA, m.pal.a); gl.uniform1f(U.uHueB, m.pal.b);
    gl.uniform1f(U.uHappy, p.happy || 0); gl.uniform1f(U.uBlink, (m.t % 4.7) > 4.55 ? 1 : 0);
    gl.uniform1f(U.uFlare, dipOf(m) * (0.4 + 0.6 * m.amp));
    gl.uniform2f(U.uLook, clamp(p.look[0], -4, 4), clamp(p.look[1], -2, 2));
    gl.uniform1f(U.uMouth, clamp(p.mouth || 0, 0, 1));
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    ctx.drawImage(c, HB.x0, HB.y0, HB.w, HB.h);
  }
  return (ctx, p, m) => drawBody(ctx, p, m, paintHead);
}
