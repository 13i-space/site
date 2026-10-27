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
const Q_SH = { uL: [47, 77], uR: [73, 77], lL: [49.4, 90], lR: [70.6, 90] };
const Q_SKIN = { lite: "#EEE4FF", mid: "#AE9BDD", dark: "#5A4892", line: "#2A2052" };
const Q_COAT = { lite: "#FFFFFF", mid: "#D9D4F2", dark: "#8A84B8" };
const Q_COAT_LINE = "#3C365E";
// her crown lights in flight, in the colours of Before's motes
const MOTES = [[233, 210, 154], [232, 207, 192], [139, 149, 246], [185, 192, 255], [255, 248, 236]];
function lightAt(i, B, gather) {
  const a = B * PI * 0.5 + i * (TAU / 5);
  const r = (24 + 7 * Math.sin(B * PI * 0.5 + i * 1.7)) * (1 - 0.88 * gather);
  const bob = -Math.abs(Math.sin((B + i * 0.2) * PI)) * 6 * (1 - gather);
  return [60 + Math.cos(a) * r * 1.25, 6 + Math.sin(a) * r * 0.55 + bob];
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
  if (gather > 0.6) glow(ctx, 60, 6, 30 * gather, "rgba(255,248,236,0.9)", (gather - 0.6) * 2);
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
  float skull = sdEll(p - vec2(60.0, 34.0), vec2(12.4, 15.0));
  float crown = sdEll(p - vec2(60.0, 25.0), vec2(10.8, 10.0));
  float jaw = sdEll(p - vec2(60.0, 47.6), vec2(9.0, 11.0));
  float cheeks = sdEll(vec2(abs(p.x - 60.0), p.y) - vec2(6.6, 44.0), vec2(5.8, 6.4));
  return smin(smin(smin(skull, crown, 5.0), jaw, 7.0), cheeks, 4.0);
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
  vec2 er = vec2(5.1, 2.95);
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
    float ir = length(iq) / 2.65;
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
  c = mix(c, liner, smoothstep(0.34, 0.16, top) * 0.9);
  c = mix(c, liner, smoothstep(0.32, 0.12, wing - (1.0 - smoothstep(3.8, 6.6, q.x)) * 0.12));
  c = mix(c, liner, smoothstep(0.12, 0.04, bot) * 0.35);
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
    alb = mix(alb, lin(vec3(0.62, 0.86, 0.95)), edgeK * 0.28);
    alb = mix(alb, lin(vec3(1.0, 0.68, 0.84)), cheek * 0.45);
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
      float td = length(q) - (0.45 + 0.15 * smoothstep(-1.0, 1.0, q.y));
      c = mix(c, glowC * (1.4 + uFlare), smoothstep(0.12, -0.12, td));
      c += glowC * exp(-max(td, 0.0) * 1.5) * (0.25 + uFlare * 0.4);
    }
    // the lips: full, rose-violet, a cupid's bow, glossy; they part to talk and curve to smile
    {
      vec2 q = p - vec2(60.0, 53.4);
      float w = 3.9 + uHappy * 0.5;
      float xk = clamp(q.x / w, -1.0, 1.0);
      float k = 1.0 - xk * xk;
      float open = (uMouth * 1.3 + uHappy * 0.25) * k;
      float smile = uHappy * 0.9 * xk * xk;
      float seamU = -0.05 - smile - 0.08 * exp(-q.x * q.x * 3.0) * 0.0;
      float seamL = seamU + open;
      float upTop = seamU - 1.3 * k - 0.15 + 0.35 * exp(-q.x * q.x * 1.6) * k;   // the bow dips in the middle
      float loBot = seamL + 1.65 * k + 0.1;
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

// ── her figure (Update 6.23) ──
// Units: 120 wide, feet at y 150. The head is drawn smaller than the old
// Qeth's (HS) so she has an adult's proportions; it pivots at the top of the
// neck. Pose fields beyond the old ones: hip (-1..1, hips swung sideways),
// roll (0..1, a body roll: chest, then hips), tail (-1..1, the tail's swing),
// tailUp (0..1), hair (-1..1, the hair's swing), knee ([l, r] 0..1).
const HS = 0.74, PIV = [60, 66.5];
const LEG_T = 18.5, LEG_S = 18.5;
function headPt(p, x, y) {
  const a = p.head || 0, dx = (x - 60) * HS, dy = (y - 58.5) * HS;
  return [PIV[0] + dx * Math.cos(a) - dy * Math.sin(a), PIV[1] + (p.headY || 0) + dx * Math.sin(a) + dy * Math.cos(a)];
}
function ik(hip, foot, side) {
  const dx = foot[0] - hip[0], dy = foot[1] - hip[1];
  let d = Math.hypot(dx, dy) || 1; const mx = (LEG_T + LEG_S) * 0.998;
  if (d > mx) { foot = [hip[0] + dx / d * mx, hip[1] + dy / d * mx]; d = mx; }
  const a = (LEG_T * LEG_T + d * d - LEG_S * LEG_S) / (2 * d), h = Math.sqrt(Math.max(0, LEG_T * LEG_T - a * a));
  const ux = dx / d, uy = dy / d;
  return { knee: [hip[0] + ux * a - uy * h * side, hip[1] + uy * a + ux * h * side], foot };
}
// a shapely leg: full thigh, slim knee, curved calf, fine ankle
function legPath(hip, knee, foot) {
  const prof = [[0, 4.6], [0.2, 4.3], [0.5, 3.4], [0.9, 2.15], [1.0, 2.0], [1.08, 2.1], [1.32, 2.55], [1.55, 2.25], [1.85, 1.3], [2.0, 1.15]];
  const at = (u) => (u <= 1 ? [lerp(hip[0], knee[0], u), lerp(hip[1], knee[1], u)] : [lerp(knee[0], foot[0], u - 1), lerp(knee[1], foot[1], u - 1)]);
  const L = [], R = [];
  prof.forEach(([u, w], i) => {
    const a = at(Math.max(0, u - 0.04)), b = at(Math.min(2, u + 0.04));
    let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
    const c = at(u);
    // the calf swells to the outside, the thigh to both
    const out = u > 1.1 && u < 1.7 ? 0.35 : 0;
    L.push([c[0] - ty * w * (1 + out * 0.2), c[1] + tx * w]); R.push([c[0] + ty * w * (1 - out * 0.1), c[1] - tx * w]);
  });
  const path = new Path2D();
  path.moveTo(L[0][0], L[0][1]);
  for (let i = 1; i < L.length - 1; i++) path.quadraticCurveTo(L[i][0], L[i][1], (L[i][0] + L[i + 1][0]) / 2, (L[i][1] + L[i + 1][1]) / 2);
  path.lineTo(L[L.length - 1][0], L[L.length - 1][1]); path.lineTo(R[R.length - 1][0], R[R.length - 1][1]);
  for (let i = R.length - 2; i > 0; i--) path.quadraticCurveTo(R[i][0], R[i][1], (R[i][0] + R[i - 1][0]) / 2, (R[i][1] + R[i - 1][1]) / 2);
  path.lineTo(R[0][0], R[0][1]); path.closePath();
  return path;
}
const SUIT = ["#120A30", "#2A1A62", "#45309A", "#2A1A62", "#0E0828"];

function drawBody(ctx, p, m, paintHead) {
  const rim = rimOf(m);
  const t = m.t, hueA = m.pal.a, hueB = m.pal.b;
  const dip = dipOf(m);
  const pipe = (a) => `hsla(${hueB},95%,72%,${a})`;
  const hip = clamp(p.hip || 0, -1.4, 1.4), roll = p.roll || 0;
  const hx = hip * 3.4, wx = hip * 1.6, cx = -hip * 0.6;          // hips swing, the waist follows, the chest counters
  const chestY = -Math.sin(roll * TAU) * 0.8, hipY = -Math.sin(roll * TAU - 1.6) * 0.8;
  const hairSw = (p.hair ?? 0) * 6 + Math.sin(m.B * PI) * (0.8 + m.amp) + (p.lean || 0) * 18;
  ctx.save();
  ctx.translate(0, p.lift);
  ctx.rotate(p.lean);
  ctx.scale(1, p.sy);
  ctx.translate(-60, -150);
  glow(ctx, 60, 70, 44, `hsla(${hueB},80%,70%,0.25)`, 0.3 + p.crown * 0.4 + m.bass * 0.3);
  if (m.halloween && !paintVampireCape(ctx, p, m)) qethCape(ctx, p, m);

  // ── the hair, behind: full and long, waves falling past her shoulders ──
  ctx.save();
  ctx.translate(PIV[0], PIV[1] + (p.headY || 0)); ctx.rotate(p.head || 0); ctx.scale(HS, HS); ctx.translate(-60, -58.5);
  {
    const sw = hairSw * 1.3;
    const back = new Path2D(`M60 13 C79 12 87 26 86 44 C85.5 62 ${91 + sw * 0.4} 76 ${89 + sw} 94 C${88 + sw} 104 ${82 + sw} 110 ${77 + sw * 0.8} 103 C${73 + sw * 0.6} 96 70 80 66 70 L54 70 C50 80 ${47 + sw * 0.6} 96 ${44 + sw * 0.8} 102 C${38 + sw} 110 ${32 + sw} 104 ${31 + sw} 94 C${29 + sw * 0.4} 76 34.5 62 34 44 C33 26 41 12 60 13 Z`);
    ctx.fillStyle = linear(ctx, 0, 12, 0, 108, [[0, "#2A1C6A"], [0.4, "#3B2690"], [0.75, `hsl(${(hueA + 250) % 360},55%,40%)`], [1, `hsl(${hueB},70%,56%)`]]);
    ctx.fill(back);
    ctx.save(); ctx.clip(back);
    for (let k = 0; k < 22; k++) {
      const s2 = k % 2 ? 1 : -1, j = Math.floor(k / 2), x0 = 60 + s2 * (4 + j * 2.6);
      ctx.strokeStyle = j % 3 === 1 ? "rgba(200,180,255,0.3)" : "rgba(14,8,48,0.4)"; ctx.lineWidth = 0.7;
      ctx.beginPath();
      for (let q = 0; q <= 24; q++) {
        const u = q / 24, y = lerp(14, 108, u);
        const x = 60 + s2 * j * 1.2 + (x0 + s2 * 12 - 60 - s2 * j * 1.2) * Math.sin(u * PI * 0.5) + sw * u * u + Math.sin(u * 9 + j * 0.7 + t * 0.6) * 1.6 * u;
        q ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(14,8,48,0.5)"; ctx.lineWidth = 0.5; ctx.stroke(back);
  }
  ctx.restore();

  // ── the tail: from the small of her back, curling round to one side, a lit fin at the tip ──
  {
    const sw = p.tail ?? Math.sin(m.B * PI * 0.5) * 0.5, up = p.tailUp || 0;
    const s = sw >= 0 ? 1 : -1, a = Math.abs(sw);
    const r0 = [60 + hx * 0.8, 108 + hipY];
    const c1 = [60 + hx + s * (10 + a * 6), 118 - up * 10];
    const c2 = [60 + s * (26 + a * 8), 150 - up * 24];
    const tip = [60 + s * (33 + a * 6) + Math.sin(t * 2.2) * 1.5, 134 - up * 34 - a * 6 + Math.sin(t * 1.7) * 1.5];
    const pts = strand(ctx, r0, c1, c2, tip, 2.6, 0.55, [[0, "#3A2690"], [0.6, `hsl(${(hueA + 255) % 360},50%,46%)`], [1, `hsl(${hueB},80%,66%)`]], null);
    // scales along it, and the fin
    ctx.fillStyle = "rgba(220,200,255,0.25)";
    for (let k = 3; k < pts.length - 2; k += 2) { ctx.beginPath(); ctx.arc(pts[k][0], pts[k][1] - 0.3, 0.7 * (1 - k / pts.length) + 0.25, PI, TAU); ctx.fill(); }
    const pa = pts[pts.length - 3], ang = Math.atan2(tip[1] - pa[1], tip[0] - pa[0]);
    ctx.save(); ctx.translate(tip[0], tip[1]); ctx.rotate(ang);
    const fin = new Path2D(); fin.moveTo(-1, 0); fin.quadraticCurveTo(3, -4.2, 6.2, -1.2); fin.quadraticCurveTo(4.2, 0, 6.2, 1.2); fin.quadraticCurveTo(3, 4.2, -1, 0); fin.closePath();
    ctx.fillStyle = linear(ctx, -1, 0, 6, 0, [[0, `hsla(${hueB},80%,70%,0.9)`], [1, `hsla(${hueB},90%,85%,0.5)`]]); ctx.fill(fin);
    ctx.strokeStyle = pipe(0.9); ctx.lineWidth = 0.25; ctx.stroke(fin);
    ctx.restore();
    glow(ctx, tip[0], tip[1], 5, pipe(0.9), 0.35 + dip * 0.35);
  }

  // ── the sash: sheer panels from her hips, behind her legs, flowing ──
  [-1, 1].forEach((s) => {
    const fl = Math.sin(t * 1.6 + s) * 1.5 - hip * 4;
    const sash = new Path2D(`M${60 + s * 9 + hx} 108 Q${60 + s * 19 + hx} 114 ${60 + s * 19 + fl} 140 Q${60 + s * 13 + fl} 143 ${60 + s * 8 + fl * 0.5} 140 Q${60 + s * 8 + hx} 124 ${60 + s * 9 + hx} 108 Z`);
    ctx.fillStyle = linear(ctx, 0, 109, 0, 142, [[0, `hsla(${(hueA + 260) % 360},60%,45%,0.35)`], [1, `hsla(${hueB},80%,65%,0.08)`]]);
    ctx.fill(sash); ctx.strokeStyle = pipe(0.35); ctx.lineWidth = 0.25; ctx.stroke(sash);
  });

  // ── legs ──
  const kn = p.knee || [0, 0];
  const legs = [[-1, p.feet ? p.feet[0] : 0, kn[0]], [1, p.feet ? p.feet[1] : 0, kn[1]]].map(([s, f, k]) => {
    const hp = [60 + s * 5.6 + hx, 111 + hipY];
    const ft = [60 + s * 5.2 + hx * 0.3 - s * k * 1.5, 147.5 - f * 3 - k * 3.5];
    return { s, hp, ...ik(hp, ft, s > 0 ? -1 : 1) };
  });
  legs.forEach(({ s, hp, knee, foot }) => {
    const path = legPath(hp, knee, foot);
    ctx.fillStyle = linear(ctx, hp[0] - 4, 0, hp[0] + 4, 0, [[0, SUIT[0]], [0.35, SUIT[2]], [0.6, "#5A42B8"], [1, SUIT[0]]]); ctx.fill(path);
    ctx.save(); ctx.clip(path);
    // light down the front of the thigh and shin, a glowing line spiralling down
    ctx.strokeStyle = "rgba(200,180,255,0.3)"; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(hp[0] - s * 0.6, hp[1] + 2); ctx.quadraticCurveTo(knee[0] - s * 0.9, knee[1] - 6, knee[0] - s * 0.3, knee[1]); ctx.quadraticCurveTo(knee[0] - s * 0.8, knee[1] + 7, foot[0], foot[1] - 4); ctx.stroke();
    ctx.strokeStyle = pipe(0.8); ctx.lineWidth = 0.3;
    ctx.beginPath(); ctx.moveTo(hp[0] + s * 3, hp[1]); ctx.bezierCurveTo(hp[0] - s * 3, hp[1] + 8, knee[0] + s * 2.5, knee[1] - 3, knee[0] - s * 1.5, knee[1] + 2); ctx.stroke();
    // the boot: knee-high, glossy, a slim heel
    const bt = [lerp(knee[0], foot[0], 0.2), lerp(knee[1], foot[1], 0.2)];
    ctx.fillStyle = linear(ctx, foot[0] - 3, 0, foot[0] + 3, 0, [[0, "#0A0618"], [0.45, "#3C2E70"], [1, "#0A0618"]]);
    ctx.fillRect(foot[0] - 5, bt[1], 10, foot[1] - bt[1] + 4);
    ctx.restore();
    ctx.strokeStyle = pipe(0.8); ctx.lineWidth = 0.35; ctx.beginPath(); ctx.moveTo(bt[0] - 2.2, bt[1] + 0.3); ctx.quadraticCurveTo(bt[0], bt[1] - 0.6, bt[0] + 2.2, bt[1] + 0.3); ctx.stroke();
    ctx.strokeStyle = "rgba(10,4,30,0.6)"; ctx.lineWidth = 0.3; ctx.stroke(path);
    ctx.strokeStyle = rimOf(m, 0.4); ctx.lineWidth = 0.3; ctx.stroke(path);
    // the foot, pointed, and the heel
    const f = new Path2D(); f.moveTo(foot[0] - 1.3, foot[1] - 1.6); f.quadraticCurveTo(foot[0] + s * 0.2, foot[1] + 1.4, foot[0] + 1.6 * (s > 0 ? 1 : -1) * 0 + 0.4, foot[1] + 2.4); f.lineTo(foot[0] + 1.4, foot[1] + 2.2); f.lineTo(foot[0] + 1.3, foot[1] - 1.6); f.closePath();
    ctx.fillStyle = "#1E1440"; ctx.fill(f);
    ctx.strokeStyle = "#1E1440"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(foot[0] - 0.9, foot[1]); ctx.lineTo(foot[0] - 1.1, foot[1] + 2.5); ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(foot[0], 150.4, 3.2, 0.8, 0, 0, TAU); ctx.fill();
  });

  // ── the lower arms: from her sides, under the bust, behind her ──
  const handO = { n: 3, len: 5.6, w: 0.75, palm: 1.4, spread: 1.0, curl: 0.35, col: Q_SKIN, tipCol: pipe(1) };
  [[Q_SH.lL, p.lL, -0.5], [Q_SH.lR, p.lR, 0.5]].forEach(([sh, hd, b]) => {
    const r = arm3d(ctx, [sh[0] + cx, sh[1] + chestY], hd, { bend: b, w0: 2.6, w1: 1.5, col: Q_SKIN, rim, bulge: 0.35, bands: [0.55, 0.85], bandCol: [pipe(0.8), GOLD] });
    hand3d(ctx, hd, r.angle, { ...handO, len: 4.6 });
  });

  // ── the body: skin from the jaw down to the neckline; the suit over it ──
  const jl = headPt(p, 55.8, 54.5), jr = headPt(p, 64.2, 54.5);
  const sl = [Q_SH.uL[0] + cx - 0.5, Q_SH.uL[1] + 1 + chestY], sr = [Q_SH.uR[0] + cx + 0.5, Q_SH.uR[1] + 1 + chestY];
  const nY = 84.6 + chestY, X = (x) => x + cx;
  const skin = P(`M${jl[0]} ${jl[1]} C${jl[0] - 0.4} 66 ${X(55.6)} 69 ${X(53)} ${71.5 + chestY} C${X(50)} ${73.5 + chestY} ${sl[0] - 1} ${sl[1] - 2.5} ${sl[0] - 1.5} ${sl[1]} L${X(48)} ${82 + chestY} Q${X(52)} ${78.6 + chestY} ${X(56.4)} ${80.6 + chestY} Q${X(59)} ${82 + chestY} ${X(60)} ${nY} Q${X(61)} ${82 + chestY} ${X(63.6)} ${80.6 + chestY} Q${X(68)} ${78.6 + chestY} ${X(72)} ${82 + chestY} L${sr[0] + 1.5} ${sr[1]} C${sr[0] + 1} ${sr[1] - 2.5} ${X(70)} ${73.5 + chestY} ${X(67)} ${71.5 + chestY} C${X(64.4)} 69 ${jr[0] + 0.4} 66 ${jr[0]} ${jr[1]} Z`);
  ctx.fillStyle = linear(ctx, X(46), 0, X(74), 0, [[0, "#6A58A8"], [0.25, "#B8A6E4"], [0.5, "#DCCFF8"], [0.75, "#B4A2E0"], [1, "#5E4C9C"]]);
  ctx.fill(skin);
  // the throat's shadow under the jaw, the collarbones, the soft line between her breasts
  ctx.save(); ctx.clip(skin);
  ctx.fillStyle = linear(ctx, 0, jl[1], 0, jl[1] + 6, [[0, "rgba(40,20,90,0.45)"], [1, "rgba(40,20,90,0)"]]); ctx.fillRect(40, jl[1] - 2, 40, 9);
  ctx.strokeStyle = "rgba(70,50,130,0.4)"; ctx.lineWidth = 0.35;
  ctx.beginPath(); ctx.moveTo(X(52), 74.6 + chestY); ctx.quadraticCurveTo(X(56), 75.8 + chestY, X(59.2), 75 + chestY); ctx.moveTo(X(68), 74.6 + chestY); ctx.quadraticCurveTo(X(64), 75.8 + chestY, X(60.8), 75 + chestY); ctx.stroke();
  ctx.fillStyle = linear(ctx, X(58.6), 0, X(61.4), 0, [[0, "rgba(60,40,120,0)"], [0.5, "rgba(60,40,120,0.45)"], [1, "rgba(60,40,120,0)"]]);
  ctx.beginPath(); ctx.moveTo(X(60), 80.2 + chestY); ctx.quadraticCurveTo(X(58.9), 83 + chestY, X(60), nY + 0.4); ctx.quadraticCurveTo(X(61.1), 83 + chestY, X(60), 80.2 + chestY); ctx.fill();
  ctx.fillStyle = radial(ctx, X(55.5), 80 + chestY, 3.5, [[0, "rgba(255,240,255,0.3)"], [1, "rgba(255,240,255,0)"]]); ctx.fillRect(X(51), 76 + chestY, 9, 8);
  ctx.fillStyle = radial(ctx, X(64.5), 80 + chestY, 3.5, [[0, "rgba(255,240,255,0.22)"], [1, "rgba(255,240,255,0)"]]); ctx.fillRect(X(60), 76 + chestY, 9, 8);
  ctx.restore();
  ctx.strokeStyle = rimOf(m, 0.45); ctx.lineWidth = 0.3; ctx.stroke(skin);
  // a slim choker with a drop of light
  {
    const cy = lerp(jl[1], 72, 0.62);
    ctx.strokeStyle = "#1E1448"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(X(56.4), cy); ctx.quadraticCurveTo(X(60), cy + 1.6, X(63.6), cy); ctx.stroke();
    ctx.fillStyle = pipe(1); ctx.beginPath(); ctx.ellipse(X(60), cy + 2.2, 0.45, 0.75, 0, 0, TAU); ctx.fill(); glow(ctx, X(60), cy + 2.2, 2.4, pipe(0.9), 0.5 + dip * 0.4);
  }
  // the suit: a sweetheart neckline, the bust, a narrow waist, curving hips
  const suit = P(`M${X(48)} ${82 + chestY} Q${X(52)} ${78.6 + chestY} ${X(56.4)} ${80.6 + chestY} Q${X(59)} ${82 + chestY} ${X(60)} ${nY} Q${X(61)} ${82 + chestY} ${X(63.6)} ${80.6 + chestY} Q${X(68)} ${78.6 + chestY} ${X(72)} ${82 + chestY} C${X(73.4)} ${86 + chestY} ${X(72.2)} ${89 + chestY} ${70.4 + cx * 0.5} 91.5 C${68.2 + wx} 95 ${67.4 + wx} 98 ${67.6 + wx} 100 C${68 + wx} 104 ${72.6 + hx} 106 ${72.4 + hx} ${110 + hipY} C${72.2 + hx} ${113 + hipY} ${69.6 + hx} ${116 + hipY} ${65.5 + hx} ${116.6 + hipY} Q${60 + hx} ${118.5 + hipY} ${54.5 + hx} ${116.6 + hipY} C${50.4 + hx} ${116 + hipY} ${47.8 + hx} ${113 + hipY} ${47.6 + hx} ${110 + hipY} C${47.4 + hx} 106 ${52 + wx} 104 ${52.4 + wx} 100 C${52.6 + wx} 98 ${51.8 + wx} 95 ${49.6 + cx * 0.5} 91.5 C${X(47.8)} ${89 + chestY} ${X(46.6)} ${86 + chestY} ${X(48)} ${82 + chestY} Z`);
  ctx.fillStyle = linear(ctx, 47 + hx * 0.5, 0, 73 + hx * 0.5, 0, [[0, SUIT[0]], [0.22, SUIT[1]], [0.45, SUIT[2]], [0.62, "#3A2888"], [0.85, SUIT[1]], [1, SUIT[4]]]);
  ctx.fill(suit);
  ctx.save(); ctx.clip(suit);
  // iridescent scales
  for (let y = 80; y < 120; y += 1.6) for (let x = 46 + ((y * 10) % 2 ? 0.8 : 0); x < 76; x += 1.6) {
    const sh = 0.5 + 0.5 * Math.sin(x * 0.4 + y * 0.25 + t * 0.8 + hip);
    ctx.strokeStyle = `hsla(${lerp(hueB, (hueA + 260) % 360, sh)},70%,70%,${0.07 + 0.08 * sh})`; ctx.lineWidth = 0.18;
    ctx.beginPath(); ctx.arc(x + hx * ((y - 80) / 40), y, 0.8, 0.15 * PI, 0.85 * PI); ctx.stroke();
  }
  // the bust: light on the upper curves, shadow beneath
  [[X(55.2), -1], [X(64.8), 1]].forEach(([bx, s]) => {
    ctx.fillStyle = radial(ctx, bx - s * 0.6, 83 + chestY, 4.6, [[0, "rgba(190,170,255,0.35)"], [0.6, "rgba(120,90,210,0.1)"], [1, "rgba(0,0,0,0)"]], bx - s * 1.2, 82 + chestY);
    ctx.beginPath(); ctx.arc(bx, 85 + chestY, 4.8, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(6,2,20,0.5)"; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.arc(bx, 85.2 + chestY, 4.4, 0.15 * PI, 0.85 * PI); ctx.stroke();
  });
  // the waist's turn and the hips' light
  ctx.fillStyle = linear(ctx, 47 + wx, 0, 73 + wx, 0, [[0, "rgba(0,0,10,0.55)"], [0.2, "rgba(0,0,10,0)"], [0.8, "rgba(0,0,10,0)"], [1, "rgba(0,0,10,0.55)"]]); ctx.fillRect(40, 92, 40, 12);
  ctx.fillStyle = radial(ctx, 55 + hx, 110 + hipY, 6, [[0, "rgba(170,150,255,0.22)"], [1, "rgba(0,0,0,0)"]]); ctx.fillRect(46 + hx, 102, 16, 16);
  // glowing filigree: down the centre and curving under the bust, round the hips
  ctx.strokeStyle = pipe(0.85); ctx.lineWidth = 0.35;
  ctx.beginPath(); ctx.moveTo(X(60), nY + 1); ctx.bezierCurveTo(X(60), 92, 60 + wx, 100, 60 + hx * 0.9, 116 + hipY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X(50.5), 89.8 + chestY); ctx.quadraticCurveTo(X(55), 92 + chestY, X(59.6), 90.6 + chestY); ctx.moveTo(X(69.5), 89.8 + chestY); ctx.quadraticCurveTo(X(65), 92 + chestY, X(60.4), 90.6 + chestY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(52 + wx, 101); ctx.bezierCurveTo(55 + hx, 107, 57 + hx, 108, 60 + hx * 0.9, 106.5); ctx.bezierCurveTo(63 + hx, 108, 65 + hx, 107, 68 + wx, 101); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = "rgba(8,2,26,0.7)"; ctx.lineWidth = 0.35; ctx.stroke(suit);
  ctx.strokeStyle = rimOf(m, 0.5); ctx.lineWidth = 0.3; ctx.stroke(suit);
  // the neckline's trim, lit
  ctx.strokeStyle = pipe(0.95); ctx.lineWidth = 0.4;
  ctx.beginPath(); ctx.moveTo(X(48), 82 + chestY); ctx.quadraticCurveTo(X(52), 78.6 + chestY, X(56.4), 80.6 + chestY); ctx.quadraticCurveTo(X(59), 82 + chestY, X(60), nY); ctx.quadraticCurveTo(X(61), 82 + chestY, X(63.6), 80.6 + chestY); ctx.quadraticCurveTo(X(68), 78.6 + chestY, X(72), 82 + chestY); ctx.stroke();
  // the belt: a chain of light slung on her hips, a jewel where it meets
  ctx.strokeStyle = GOLD; ctx.lineWidth = 0.45; ctx.setLineDash([0.7, 0.35]);
  ctx.beginPath(); ctx.moveTo(48 + hx, 108 + hipY); ctx.quadraticCurveTo(60 + hx, 113 + hipY, 72 + hx, 108 + hipY); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = radial(ctx, 60 + hx, 111.4 + hipY, 1.6, [[0, "#FFFFFF"], [0.4, `hsl(${hueA},100%,72%)`], [1, `hsl(${hueA},80%,30%)`]], 59.5 + hx, 111 + hipY);
  ctx.beginPath(); ctx.ellipse(60 + hx, 111.4 + hipY, 1.1, 1.5, 0, 0, TAU); ctx.fill();
  glow(ctx, 60 + hx, 111.4 + hipY, 4, `hsla(${hueA},100%,65%,0.9)`, 0.3 + m.bass * 0.4);
  if (m.halloween) vampireClasp(ctx, m);

  // ── the cropped lab jacket: pearl shoulders and a high collar ──
  [-1, 1].forEach((s) => {
    const sh = s < 0 ? sl : sr;
    const col = P(`M${X(60 + s * 4.6)} ${71 + chestY} Q${X(60 + s * 9)} ${63 + chestY} ${X(60 + s * 11.5)} ${61 + chestY} Q${X(60 + s * 12)} ${69 + chestY} ${X(60 + s * 9.5)} ${74 + chestY} Z`);
    const cap = P(`M${X(60 + s * 8.5)} ${73.5 + chestY} Q${sh[0] + s * 1} ${sh[1] - 4.5} ${sh[0] + s * 3.4} ${sh[1] + 1} Q${sh[0] + s * 3} ${sh[1] + 5.2} ${sh[0] + s * 0.4} ${sh[1] + 5.6} Q${sh[0] - s * 1.6} ${sh[1] + 1.4} ${X(60 + s * 9)} ${76.5 + chestY} Z`);
    ctx.fillStyle = radial(ctx, sh[0] - s * 0.5, sh[1] - 1.5, 6, [[0, "#FFFFFF"], [0.6, "#D6D0F0"], [1, "#8A84BC"]], sh[0] - s * 1.5, sh[1] - 2.5); ctx.fill(cap);
    ctx.strokeStyle = pipe(0.75); ctx.lineWidth = 0.3; ctx.stroke(cap);
  });

  // ── the upper arms ──
  [[Q_SH.uL, p.uL, -0.5, sl], [Q_SH.uR, p.uR, 0.5, sr]].forEach(([sh0, hd, b, sh]) => {
    const r = arm3d(ctx, [sh[0], sh[1] + 1.5], hd, { bend: b, w0: 2.9, w1: 1.6, col: Q_SKIN, rim, bulge: 0.4, bands: [0.62, 0.9], bandCol: [GOLD, pipe(0.85)] });
    hand3d(ctx, hd, r.angle, handO);
  });

  // ── the head ──
  ctx.save();
  ctx.translate(PIV[0], PIV[1] + (p.headY || 0)); ctx.rotate(p.head || 0); ctx.scale(HS, HS); ctx.translate(-60, -58.5);
  const flare = dip * (0.4 + 0.6 * m.amp);
  const fly = smooth(0, 1, p.fly || 0);
  const flying = [];
  paintHead(ctx, p, m);
  // the hair over her brow: a full crown of it, a side-swept fringe, locks framing her face
  {
    const sw = hairSw;
    const cap = new Path2D(`M33.6 48 C31 26 42 11 60 11 C78 11 89 26 86.4 48 C85.4 40 83 33 79 29.5 C76 27 72 26 68 26.5 C62 27 55 28.5 50 32 C45 35.5 43 40 41.5 44 C40 41 38 42 36.5 44.5 C35 46 34.2 47 33.6 48 Z`);
    ctx.fillStyle = linear(ctx, 0, 11, 0, 46, [[0, "#4A34A6"], [0.5, "#3A2690"], [1, "#2A1C6A"]]); ctx.fill(cap);
    ctx.save(); ctx.clip(cap);
    for (let k = 0; k < 16; k++) {
      const x0 = 36 + k * 3.2;
      ctx.strokeStyle = k % 3 ? "rgba(20,10,60,0.35)" : "rgba(210,190,255,0.35)"; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(60 + (k - 8) * 0.5, 12); ctx.quadraticCurveTo(x0 + (x0 - 60) * 0.3, 20, x0 + (x0 - 60) * 0.2 - 3, 44); ctx.stroke();
    }
    ctx.fillStyle = radial(ctx, 52, 18, 12, [[0, "rgba(230,215,255,0.35)"], [1, "rgba(230,215,255,0)"]]); ctx.fillRect(36, 10, 40, 24);
    ctx.restore();
    ctx.strokeStyle = "rgba(14,8,48,0.45)"; ctx.lineWidth = 0.4; ctx.stroke(cap);
    // locks framing her face
    [-1, 1].forEach((s) => {
      const lw = Math.sin(t * 1.4 + s) * 0.6;
      strand(ctx, [60 + s * 22, 30], [60 + s * 27, 44], [60 + s * 21 + sw * 0.5 + lw, 66], [60 + s * 25 + sw + lw, 88], 3.2, 0.9,
        [[0, "#3E2A94"], [0.6, `hsl(${(hueA + 255) % 360},55%,50%)`], [1, `hsl(${hueB},85%,74%)`]], { r: 3, c: pipe(0.9), a: 0.3 + dip * 0.3 });
    });
  }
  // the five special pieces: luminous fronds rising out of her hair, lit at the tips;
  // they flare on the beat, and in "lights" the tips fly off and dance
  [[-15, 10], [-8, 4], [0, 1.5], [8, 4], [15, 10]].forEach(([dx, top], i) => {
    const sway = Math.sin(t * 2 + i) * 1.2 + (p.crown ? Math.sin(m.B * PI + i) * 2.5 * p.crown : 0);
    const tx = 60 + dx * 1.45 + sway, ty = top - 9 - flare * 2.5 * (1 - fly);
    strand(ctx, [60 + dx * 0.55, 15 + Math.abs(dx) * 0.25], [60 + dx * 0.8, top + 3], [60 + dx * 1.2 + sway * 0.5, top - 3], [tx, ty], 1.5, 0.45,
      [[0, "#4A34A6"], [0.55, `hsl(${(hueA + 260) % 360},60%,62%)`], [1, `hsl(${hueB},85%,82%)`]], null);
    if (fly < 0.02) {
      ctx.fillStyle = "#FFF6EA"; ctx.beginPath(); ctx.arc(tx, ty, 1.6, 0, TAU); ctx.fill();
      glow(ctx, tx, ty, 3.5 + flare * 3 + p.crown * 2.5, "rgba(255,240,250,0.95)", 0.45 + flare * 0.45);
    } else flying.push({ i, tx, ty });
  });
  if (m.halloween) fangs(ctx, [58.2, 61.8], 54.8 + (p.happy || 0) * 0.4, 1.6, 0.6);
  if (m.cicada && !paintRangerHat(ctx, m, 60, 13, 46, 0)) rangerHat(ctx, 60, 13, 46, 0);
  ctx.restore();
  // the lights fly in the stage's frame, circling over her head
  if (flying.length) drawFlyingLights(ctx, flying.map((f) => { const [x, y] = headPt(p, f.tx, f.ty); return { ...f, tx: x, ty: y }; }), fly, p.gather || 0, m);
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
