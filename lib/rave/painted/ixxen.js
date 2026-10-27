// Ixxen, with its head painted per pixel (look-lab), side-on and facing you.
// Mantle, arms, legs, frills, tendrils and loupe are the Rave's own drawing.
import { TAU, lerp, clamp, smooth, P, glow, radial, linear } from "../draw";
import { arm3d, hand3d, shade, trim } from "../shade";
import { FRAG as DJ } from "./djShader";
import { makeGL } from "./glutil";
import { ixxenWraps, ixxenNeckWraps, ixxenHeadWrap } from "../costumes";
import { rangerHat } from "../cicada";
import { paintRangerHat } from "./costumes";
const PI = Math.PI;
const COMMON = DJ.slice(DJ.indexOf("const float PI"), DJ.indexOf("// ---------- materials ----------"));
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);
const rimOf = (m, a = 0.85) => `hsla(${m.pal.b},100%,72%,${a})`;
const armAt = (sh, a, len) => [sh[0] + Math.cos(a) * len, sh[1] + Math.sin(a) * len];
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
const BOXES = [{ x0: -12.6, y0: -25.6, w: 21, h: 28 }, { x0: -7.4, y0: -25.2, w: 14.8, h: 27.4 }];
const SKIN = ["#A9B2E0", "#6E77AE", "#2F3466"];
const X_COL = { lite: "#D2D8F6", mid: "#7F89C2", dark: "#363C74", line: "#171B44" };
const N_COL = { lite: "#B9C1EC", mid: "#7079B6", dark: "#2E3468", line: "#161A42" };
// the mantle's cloth, for the sleeves the arms come out of
const M_COL = { lite: "#4C5AB0", mid: "#27306E", dark: "#0E1232" };
const X_SH = [[27.6, 46], [19.4, 46.5], [27.9, 52.5], [18.9, 53.5], [27.2, 59], [19.4, 60]];
const X_SH_FRONT = [[29.6, 46], [16.4, 46], [30, 52.5], [16, 52.5], [29.4, 59], [16.6, 59]];
const X_W = [3.1, 2.9, 3.3, 3.2, 3.0, 2.9];
const X_LEN = [11, 11, 12.5, 12.5, 12, 12];
const X_BEND = [1, -0.8, 0.9, -0.9, 0.7, -0.6];
const X_REST = [0.9, 2.3, 1.2, 2.0, 1.4, 1.8];
// arms from angles: tips, and elbows set by each arm's natural bend
function xArms(angs, lens = X_LEN) {
  const arms = [], elb = [];
  angs.forEach((a, i) => {
    const sh = X_SH[i];
    const L = lens[i];
    elb.push([sh[0] + Math.cos(a) * L * 0.5 - Math.sin(a) * L * 0.22 * X_BEND[i], sh[1] + Math.sin(a) * L * 0.5 + Math.cos(a) * L * 0.22 * X_BEND[i]]);
    arms.push(armAt(sh, a, L));
  });
  return { arms, elb };
}
// a turn of the head toward the crowd: eight beats in every 32
function faceOf(m) {
  if (!m.on) return 0;
  const b = ((m.B % 32) + 32) % 32;
  return smooth(20, 20.7, b) * (1 - smooth(27.3, 28, b));
}

const XFRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uMode, uT, uB, uBass, uHueA, uHueB, uBlink, uShades, uMummy;
uniform vec2 uEyeOff;
${COMMON}
#define GRAD(F, p) normalize(vec2(F(p + vec2(0.04, 0.0)) - F(p - vec2(0.04, 0.0)), F(p + vec2(0.0, 0.04)) - F(p - vec2(0.0, 0.04))) + 1e-5)
float gMode;
float headSD(vec2 p) {
  if (gMode < 0.5) {
    float a = sdEll(rot(p - vec2(1.4, -11.0), -0.06), vec2(5.8, 10.6));
    float h;
    float crest = sdSeg(p, vec2(-8.6, -18.2), vec2(1.2, -17.6), 3.0, 4.6, h);
    float b = sdEll(rot(p - vec2(-7.6, -18.0), -0.45), vec2(3.6, 3.4));
    return smin(smin(a, crest, 4.0), b, 2.5);
  }
  return smin(sdEll(p - vec2(0.0, -12.2), vec2(6.1, 12.0)), sdEll(p - vec2(0.0, -3.4), vec2(3.8, 4.6)), 2.5);
}
float curHead(vec2 p) { return headSD(p); }
float distQ(vec2 p, vec2 a, vec2 c, vec2 b) {
  float best = 1e3;
  for (int i = 0; i < 10; i++) {
    float t0 = float(i) / 10.0, t1 = float(i + 1) / 10.0;
    vec2 q0 = mix(mix(a, c, t0), mix(c, b, t0), t0), q1 = mix(mix(a, c, t1), mix(c, b, t1), t1);
    vec2 pa = p - q0, ba = q1 - q0; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    best = min(best, length(pa - ba * h));
  }
  return best;
}
vec3 XSKIN() { return lin(vec3(0.44, 0.47, 0.7)); }
// an eye: a dark socket, a wet black almond, a gold iris with a slit
vec3 eyeAt(vec3 c, vec2 p, vec2 ec, vec2 er, float tilt, vec2 off, vec2 ir) {
  vec2 q = rot(p - ec, -tilt);
  float so = sdEll(q - vec2(0.0, 0.2), er + vec2(0.5, 0.6));
  c *= 1.0 - 0.55 * smoothstep(0.6, -0.3, so);
  float ed = sdEll(q, vec2(er.x, er.y * max(uBlink, 0.04)));
  if (ed < px * 2.0) {
    vec2 qq = q / er; float e = clamp(length(qq), 0.0, 1.0);
    vec3 n = normalize(vec3(qq * vec2(0.85, 0.6), sqrt(max(1.0 - e * e, 0.0)) + 0.25));
    vec3 ec2 = lin(vec3(0.015, 0.012, 0.04));
    if (uBlink > 0.5) {
      vec2 iq = (q - off) / ir; float r = length(iq);
      vec3 ic = mix(lin(vec3(1.0, 0.96, 0.83)), lin(vec3(0.91, 0.82, 0.6)), smoothstep(0.0, 0.5, r));
      ic = mix(ic, lin(vec3(0.48, 0.35, 0.12)), smoothstep(0.55, 1.0, r));
      float ang = atan(iq.y, iq.x);
      ic *= 0.8 + 0.3 * noise(vec2(ang * 8.0, r * 3.0));
      ic *= 1.0 + 0.4 * pow(0.5 + 0.5 * sin(r * 12.0 + uT * 2.2), 6.0);
      float pupil = length((q - off) / vec2(0.22 + uBass * 0.25, ir.y * 0.76));
      ic = mix(ic, lin(vec3(0.01, 0.01, 0.02)), smoothstep(1.1, 0.85, pupil));
      ec2 = mix(ec2, ic * 1.25, smoothstep(1.05, 0.95, r));
      vec3 H = normalize(normalize(vec3(-0.35, -0.7, 0.6)) + vec3(0.0, 0.0, 1.0));
      ec2 += vec3(1.0) * pow(max(dot(n, H), 0.0), 220.0) * 1.2;
      ec2 += vec3(1.0) * smoothstep(1.0, 0.5, length(q - off - vec2(-0.38, -1.0)) / 0.3) * 0.8;
      ec2 += mix(rimA, rimB, 0.5) * pow(1.0 - n.z, 2.0) * 0.3;
    }
    c = mix(c, ec2, clamp(0.5 - ed / px, 0.0, 1.0));
  }
  return c;
}
vec3 smallEye(vec3 c, vec2 p, vec2 ec, float r) {
  float d = length(p - ec) - (r * max(uBlink, 0.12) + 0.05);
  c *= 1.0 - 0.4 * smoothstep(0.35, 0.0, d) * step(0.0, d);
  if (d < px * 2.0) {
    vec3 ecol = lin(vec3(0.015, 0.012, 0.04)) + lin(vec3(0.91, 0.82, 0.6)) * smoothstep(0.6, 0.2, length(p - ec - vec2(0.15, -0.15)) / (r * 0.35)) * 1.4;
    c = mix(c, ecol, clamp(0.5 - d / px, 0.0, 1.0));
  }
  return c;
}
// a mouth: lips with volume (lit upper edge, shadowed lower lip), a dark wet
// interior that opens a little with the bass, creases at the corners
vec3 mouthAt(vec3 c, vec2 p, vec2 mc, float w, float tilt, vec3 n) {
  vec2 q = rot(p - mc, -tilt);
  float open = 0.12 + uBass * 0.35 + uShades * 0.1;
  float k = clamp(1.0 - pow(q.x / w, 2.0), 0.0, 1.0);
  float upper = -0.12 - 0.22 * k + 0.12 * exp(-q.x * q.x * 6.0);   // a cupid's bow dip
  float lower = upper + (open + 0.25) * k;
  float inside = step(upper, q.y) * step(q.y, lower) * step(abs(q.x), w);
  // lips
  float lipU = exp(-pow((q.y - (upper - 0.32 * k)) / 0.3, 2.0)) * k;
  float lipL = exp(-pow((q.y - (lower + 0.38 * k)) / 0.36, 2.0)) * k;
  vec3 lipC = lin(vec3(0.42, 0.33, 0.62));
  c = mix(c, lipC * (0.85 + 0.4 * smoothstep(0.0, -0.3, q.y - upper + 0.32)), lipU * 0.75);
  c = mix(c, lipC * 1.1, lipL * 0.8);
  c += vec3(1.0) * 0.18 * exp(-pow((q.y - (lower + 0.25 * k)) / 0.1, 2.0)) * k * k;   // wet light on the lower lip
  c *= 1.0 - 0.45 * exp(-pow((q.y - (lower + 0.85 * k)) / 0.3, 2.0)) * k;          // shadow under it
  if (inside > 0.5) {
    vec3 ins = mix(lin(vec3(0.14, 0.03, 0.08)), lin(vec3(0.02, 0.005, 0.02)), smoothstep(upper, lower, q.y) * 0.6 + 0.4);
    ins += lin(vec3(0.85, 0.85, 0.95)) * step(q.y, upper + 0.14) * step(abs(q.x), w * 0.6) * 0.5;  // a glint of small teeth
    c = mix(c, ins, smoothstep(0.0, 0.05, q.y - upper) * smoothstep(0.0, 0.05, lower - q.y));
  }
  // corners
  vec2 cq = vec2(abs(q.x) - w, q.y - upper);
  c *= 1.0 - 0.5 * exp(-dot(cq, cq) / 0.06);
  return c;
}
void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uBox.x + f.x * uBox.z, uBox.y + (1.0 - f.y) * uBox.w);
  px = uBox.z / uRes.x;
  gMode = uMode;
  rimA = lin(hsl2rgb(uHueA, 1.0, 0.62)) * 1.1;
  rimB = lin(hsl2rgb(uHueB, 1.0, 0.68)) * 1.1;
  vec3 lit = lin(hsl2rgb(uHueA, 0.9, 0.78));
  float hd = headSD(p);
  if (hd < px * 2.0) {
    vec2 g = GRAD(curHead, p);
    vec3 n = nrm(g, hd, 5.0);
    float grooves = 0.0;
    if (uMode < 0.5) {
      for (int r = 0; r < 5; r++) {
        float fr = float(r);
        float x = -1.6 - fr * 1.9;
        vec2 a = vec2(x, -22.6 + fr * 0.55 + (fr > 2.0 ? (fr - 2.0) * 0.5 : 0.0)), c2 = vec2(x + 1.2, -16.5), b = vec2(x - 0.2 + fr * 0.3, -10.5 + fr * 0.4);
        grooves = max(grooves, exp(-pow(distQ(p, a, c2, b) / 0.16, 2.0)));
      }
      grooves = max(grooves, exp(-pow(distQ(p, vec2(0.6, -6.6), vec2(3.6, -8.2), vec2(6.6, -6.8)) / 0.14, 2.0)) * 0.8);
    } else {
      grooves = max(exp(-pow(abs(p.x) / 0.14, 2.0)) * step(-24.0, p.y) * step(p.y, -17.5), exp(-pow(distQ(vec2(abs(p.x), p.y), vec2(1.8, -24.0), vec2(3.2, -19.0), vec2(3.4, -16.5)) / 0.15, 2.0)));
      float temple = exp(-dot((vec2(abs(p.x), p.y) - vec2(4.4, -6.4)) / vec2(1.6, 3.6), (vec2(abs(p.x), p.y) - vec2(4.4, -6.4)) / vec2(1.6, 3.6)));
      n = normalize(n - vec3(sign(p.x) * temple * 0.4, 0.0, 0.0));
      grooves = max(grooves, temple * 0.5);
    }
    vec3 alb = XSKIN() * (0.85 + 0.25 * fbm(p * 0.9 + 3.0));
    alb = mix(alb, lin(vec3(0.8, 0.84, 0.97)), smoothstep(0.6, 0.85, fbm(p * 0.5 + 9.0)) * 0.3);
    alb *= 1.0 - grooves * 0.5;
    alb *= mix(1.0, 0.6, smoothstep(-9.0, 1.0, p.y));
    vec2 b = vec2(noise(p * 6.0) - 0.5, noise(p * 6.0 + 7.3) - 0.5) * 0.07;
    n = normalize(n + vec3(b, 0.0));
    vec3 c = light(alb, n, 70.0, 0.45, 0.4, lin(vec3(0.5, 0.45, 0.9)), 1.0);
    c *= mix(1.0, 0.45, pow(clamp(1.0 + hd / 5.0, 0.0, 1.0), 4.0));
    // the mummy (Halloween remix, Update 6.15): strips wound round the head at
    // a slant, overlapping, frayed and stained, a gap for the great eye
    if (uMummy > 0.5) {
      vec2 eyeC = uMode < 0.5 ? vec2(3.4, -11.4) : vec2(0.0, -11.0);
      float open = sdEll(p - eyeC, uMode < 0.5 ? vec2(2.7, 5.0) : vec2(2.9, 5.1));
      vec2 r = rot(p, uMode < 0.5 ? 0.32 : 0.1);
      float yy = r.y + sin(r.x * 0.3 + 1.0) * 0.7;
      float wd = 1.75, k = floor(yy / wd), fr = fract(yy / wd);
      float gap = step(hash(vec2(k, 7.0)), 0.14);
      // one strip crossing the other way over the dome
      vec2 r2 = rot(p - vec2(uMode < 0.5 ? -4.0 : 0.0, -18.0), uMode < 0.5 ? -0.9 : 1.2);
      float cross = abs(r2.y) - 0.95;
      float onStrip = (1.0 - gap) * step(0.0, open);
      vec3 bAlb = mix(lin(vec3(0.91, 0.87, 0.76)), lin(vec3(0.80, 0.73, 0.57)), hash(vec2(k, 3.0)));
      bAlb *= 0.85 + 0.2 * noise(p * vec2(1.6, 7.0));
      bAlb = mix(bAlb, bAlb * lin(vec3(0.75, 0.6, 0.4)), smoothstep(0.6, 0.8, fbm(p * 0.5 + k)) * 0.7);
      if (onStrip > 0.5) {
        float e = abs(fr - 0.5) * 2.0;
        vec3 bn = normalize(n + vec3(0.0, (fr - 0.5) * 1.0, 0.0));
        vec3 bc = light(bAlb, bn, 18.0, 0.12, 0.6, bAlb * 0.8, 1.0);
        bc *= mix(1.0, 0.5, pow(clamp(1.0 + hd / 5.0, 0.0, 1.0), 4.0));
        bc *= 1.0 - 0.5 * smoothstep(0.7, 1.0, e);
        float fray = smoothstep(0.93, 1.0, e + (noise(vec2(r.x * 5.0, k)) - 0.5) * 0.25);
        c = mix(bc, c * 0.55, fray);
      }
      if (cross < 0.0 && open > 0.0) {
        float e = clamp(-cross / 0.95, 0.0, 1.0);
        vec3 bc = light(bAlb * 1.05, normalize(n + vec3(0.0, 0.0, e * 0.3)), 18.0, 0.12, 0.6, bAlb * 0.8, 1.0);
        bc *= mix(1.0, 0.5, pow(clamp(1.0 + hd / 5.0, 0.0, 1.0), 4.0)) * (0.7 + 0.3 * e);
        c = mix(c * 0.6, bc, smoothstep(0.0, 0.25, e));
      }
      // a dark rim where the wraps stop round the eye
      c *= 1.0 - 0.6 * smoothstep(0.8, 0.0, abs(open)) * step(0.0, open);
    }
    // the crest lights, a wave running along them
    for (int d = 0; d < 6; d++) {
      float fd = float(d);
      if (uMode > 0.5 && d > 4) continue;
      vec2 dp = uMode < 0.5 ? vec2(-0.6 - fd * 1.8, -22.4 - sin(fd / 5.0 * PI) * 0.9 + fd * 0.32) : vec2(0.0, -23.4 + fd * 1.3);
      float a = 0.3 + 0.7 * max(0.0, cos((uB * 1.5 - fd * 0.25) * PI));
      float dd = length(p - dp);
      c = mix(c, lit * (1.2 + a), smoothstep(0.38, 0.22, dd) * a);
      c += lit * exp(-dd * 2.4) * a * 0.45;
    }
    // the eyes
    if (uMode < 0.5) {
      c = eyeAt(c, p, vec2(3.4, -11.4), vec2(1.55, 3.7), 0.08, uEyeOff, vec2(1.05, 2.4));
      // a brow ridge over the one great eye (Update 6.22: no more small eyes)
      float brow = exp(-pow(distQ(p, vec2(1.2, -16.2), vec2(3.6, -17.4), vec2(6.2, -15.4)) / 0.55, 2.0));
      c *= 1.0 - 0.25 * exp(-pow(distQ(p, vec2(1.2, -15.4), vec2(3.6, -16.6), vec2(6.2, -14.6)) / 0.5, 2.0));
      c += lit * 0.12 * brow + vec3(0.12, 0.13, 0.2) * brow;
      c = mouthAt(c, p, vec2(4.5, -4.3), 1.55, -0.12, n);
    } else {
      c = eyeAt(c, p, vec2(0.0, -11.0), vec2(1.7, 3.8), 0.0, vec2(0.0, 0.3), vec2(1.15, 2.5));
      float brow = exp(-pow(distQ(vec2(abs(p.x), p.y), vec2(0.0, -16.6), vec2(1.8, -17.0), vec2(3.0, -15.8)) / 0.55, 2.0));
      c += lit * 0.12 * brow + vec3(0.12, 0.13, 0.2) * brow;
      c = mouthAt(c, p, vec2(0.0, -3.6), 1.9, 0.0, n);
    }
    put(hd, c);
  }
  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;
function drawBody(ctx, p, m, H) {
    const t = m.t, hue = m.pal.a, rim = rimOf(m);
    const fr = clamp(p.front, 0, 1);
    const sh = X_SH.map((s, i) => [lerp(s[0], X_SH_FRONT[i][0], fr), lerp(s[1], X_SH_FRONT[i][1], fr)]);
    ctx.save();
    ctx.translate(0, p.lift); ctx.rotate(p.lean); ctx.scale(1, p.sy);
    ctx.translate(-23, -80);
    const drawArm = (i) => {
      const tent = i >= 2;
      // the socket the sleeve comes out of: a dark padded recess, gold-rimmed
      const a0 = Math.atan2(p.elb[i][1] - sh[i][1], p.elb[i][0] - sh[i][0]);
      ctx.save(); ctx.translate(sh[i][0], sh[i][1]); ctx.rotate(a0);
      ctx.fillStyle = radial(ctx, 0, 0, X_W[i] * 0.75, [[0, "#05061A"], [0.7, "#141A48"], [1, "#2A3480"]]);
      ctx.beginPath(); ctx.ellipse(0, 0, X_W[i] * 0.42, X_W[i] * 0.72, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#A88C4E"; ctx.lineWidth = 0.18; ctx.stroke();
      ctx.strokeStyle = "rgba(255,240,200,0.5)"; ctx.lineWidth = 0.08; ctx.beginPath(); ctx.ellipse(0, 0, X_W[i] * 0.42, X_W[i] * 0.72, 0, PI * 0.95, PI * 1.55); ctx.stroke();
      ctx.restore();
      const r = arm3d(ctx, sh[i], p.arms[i], { elbow: p.elb[i], stiff: p.stiff, w0: X_W[i], w1: tent ? 0.7 : 1.2, col: X_COL, rim, bulge: tent ? 0.15 : 0.6,
        suckers: tent ? "#D6DBF5" : null, bands: tent ? [0.35, 0.55, 0.75] : [0.38, 0.62], bandCol: `hsla(${hue},90%,78%,${0.45 + 0.4 * dipOf(m)})`, N: 24,
        sleeve: { to: tent ? 0.14 : 0.2, w: 1.1, col: M_COL } });
      // a slim cuff where the sleeve ends
      {
        const n = r.pts.length - 1, k = Math.max(2, Math.round(n * (tent ? 0.14 : 0.2)));
        const w = r.ws[k] * 1.1 * (1.45) / 2, [x, y] = r.pts[k], [nx, ny] = r.ns[k];
        ctx.strokeStyle = "#9C7F43"; ctx.lineWidth = 0.32; ctx.lineCap = "butt";
        ctx.beginPath(); ctx.moveTo(x - nx * w * 0.92, y - ny * w * 0.92); ctx.lineTo(x + nx * w * 0.92, y + ny * w * 0.92); ctx.stroke();
        ctx.strokeStyle = "rgba(255,244,210,0.75)"; ctx.lineWidth = 0.08;
        ctx.beginPath(); ctx.moveTo(x + nx * w * 0.1, y + ny * w * 0.1); ctx.lineTo(x + nx * w * 0.85, y + ny * w * 0.85); ctx.stroke();
      }
      if (!tent) hand3d(ctx, p.arms[i], r.angle, { n: 3, len: 2.6, w: 0.5, palm: 0.75, spread: p.stiff > 0.5 ? 0.5 : 1.1, curl: p.stiff > 0.5 ? 0 : 0.35, col: X_COL });
      else {
        const a = r.angle, c = a + 1.4 + Math.sin(t * 4 + i) * 0.4, tip = p.arms[i];
        ctx.strokeStyle = X_COL.mid; ctx.lineWidth = 0.5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.quadraticCurveTo(tip[0] + Math.cos(a) * 1.2, tip[1] + Math.sin(a) * 1.2, tip[0] + Math.cos(c) * 1.3, tip[1] + Math.sin(c) * 1.3); ctx.stroke();
      }
    };
    // the Lab draws its arms in layers around the console (Update 6.21):
    // armsOnly draws just those arms; noArms draws the rest of it
    if (p.armsOnly) { p.armsOnly.forEach(drawArm); ctx.restore(); return; }
    // facing sideways the far arms are behind the mantle; facing front, all in front
    if (fr < 0.5 && !p.noArms) [1, 3, 5].forEach(drawArm);
    // legs: slim and jointed like its arms, glowing bands, plated boots;
    // stepping in time (a stiff pop in the robot)
    {
      const gy = 80 - p.lift / p.sy;
      const st = Math.sin(m.B * PI) * (m.on ? m.amp : 0.2);
      const robot = p.stiff > 0.5;
      const pop = robot ? (1 - smooth(0, 0.18, m.ph)) * 0.9 : 0;
      [[lerp(21, 19.6, fr), lerp(21.2, 19, fr), Math.max(0, st) * 2.4, fr > 0.5 ? 1 : -1], [lerp(25.2, 26.4, fr), lerp(25.6, 27, fr), Math.max(0, -st) * 2.4, fr > 0.5 ? -1 : -1]].forEach(([hx, fx, f, ks], n) => {
        const lift = robot ? pop : f * (1 - fr * 0.5);
        const r = leg(ctx, [hx + p.hem * 0.3, 68.6], [fx + (fr < 0.5 ? lift * 0.5 : 0), gy - 1.2 - lift], 7, 7, ks, { w0: 3.2, w1: 1.7, col: X_COL, rim, stiff: robot ? 0.9 : 0.5, bulge: 0.35, bands: [0.25, 0.7], bandCol: `hsla(${hue},90%,75%,${0.5 + 0.4 * dipOf(m)})` });
        ctx.fillStyle = radial(ctx, r.knee[0], r.knee[1], 1.2, [[0, "#5A66B8"], [1, "#1A1E4A"]], r.knee[0] - 0.3, r.knee[1] - 0.3);
        ctx.beginPath(); ctx.arc(r.knee[0], r.knee[1], 1.05, 0, TAU); ctx.fill(); ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.15; ctx.stroke();
        ixBoot(ctx, r.foot[0], r.foot[1] + 1.2, fr, hue, m);
      });
    }
    // ── the mantle ──
    const h = p.hem;
    const mantle = new Path2D(`M21 40 C15.4 42 15.6 49 16.6 57 L${16.4 + h} 71 Q${23 + h} 72.4 ${29.6 + h} 71 L29 57 C30.6 49 30.2 42 26 40 Z`);
    ctx.fillStyle = linear(ctx, 16 + h * 0.3, 0, 30 + h * 0.3, 0, [[0, "#0B0E2C"], [0.3, "#232C6C"], [0.52, "#3A479E"], [0.7, "#242C6A"], [1, "#0B0E28"]]);
    ctx.fill(mantle);
    ctx.save(); ctx.clip(mantle);
    ixCloth(ctx, h, hue, m);
    // plates, seams and rivets
    [[19.6, 19.2 + h], [26.6, 27 + h]].forEach(([x0, x1]) => {
      ctx.strokeStyle = "rgba(4,5,20,0.75)"; ctx.lineWidth = 0.32; ctx.beginPath(); ctx.moveTo(x0, 44); ctx.quadraticCurveTo(lerp(x0, x1, 0.5), 62, x1, 80); ctx.stroke();
      ctx.strokeStyle = "rgba(150,165,240,0.35)"; ctx.lineWidth = 0.14; ctx.beginPath(); ctx.moveTo(x0 + 0.3, 44); ctx.quadraticCurveTo(lerp(x0, x1, 0.5) + 0.3, 62, x1 + 0.3, 80); ctx.stroke();
      for (let y = 47; y < 70; y += 4) { const k = (y - 44) / 36, x = lerp(x0, x1, k) + 0.7; ctx.fillStyle = "#8A93C8"; ctx.beginPath(); ctx.arc(x, y, 0.22, 0, TAU); ctx.fill(); }
    });
    // glowing seams with the beat
    const pulse = 0.35 + 0.45 * dipOf(m) * (0.5 + p.seams * 0.5);
    ctx.strokeStyle = `hsla(${hue},80%,64%,${pulse})`; ctx.lineWidth = 0.3;
    ctx.beginPath(); ctx.moveTo(23.4, 41); ctx.lineTo(23.2 + h, 71); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(17 + h * 0.4, 67); ctx.quadraticCurveTo(23 + h * 0.4, 69, 29 + h * 0.4, 67); ctx.stroke();
    // the belt: buckle and pouches
    ctx.fillStyle = linear(ctx, 0, 61.5, 0, 64.5, [[0, "#3A3050"], [1, "#16122A"]]);
    ctx.beginPath(); ctx.moveTo(15, 61.2); ctx.quadraticCurveTo(23, 63.4, 31, 61.2); ctx.lineTo(31, 64.2); ctx.quadraticCurveTo(23, 66.4, 15, 64.2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.2; ctx.stroke();
    ctx.fillStyle = linear(ctx, 21.8, 61.6, 24.6, 65.2, [[0, "#F2E2AE"], [0.45, "#B8964E"], [1, "#4A3416"]]); ctx.fillRect(21.8, 61.6, 2.8, 3.6);
    ctx.fillStyle = "#130F26"; ctx.fillRect(22.5, 62.3, 1.4, 2.2);
    ctx.fillStyle = `hsla(${hue},90%,70%,${0.5 + 0.4 * dipOf(m)})`; ctx.fillRect(22.9, 62.7, 0.6, 1.4);
    ctx.strokeStyle = "rgba(255,250,225,0.7)"; ctx.lineWidth = 0.08; ctx.beginPath(); ctx.moveTo(21.85, 65.1); ctx.lineTo(21.85, 61.65); ctx.lineTo(24.55, 61.65); ctx.stroke();
    [[17.4, 64], [27.4, 64]].forEach(([x, y]) => { ctx.fillStyle = "#2A2440"; ctx.fillRect(x - 1, y, 2, 2.4); ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.12; ctx.strokeRect(x - 1, y, 2, 2.4); });
    // hem lights chasing
    for (let k = 0; k < 7; k++) {
      const x = lerp(17, 29, k / 6) + h, on = (Math.floor(m.B * 2) % 7) === k;
      ctx.fillStyle = on ? `hsla(${hue},100%,75%,1)` : "rgba(40,48,110,0.9)"; ctx.beginPath(); ctx.arc(x, 70, 0.32, 0, TAU); ctx.fill();
      if (on) glow(ctx, x, 70, 1.6, `hsla(${hue},100%,70%,0.9)`, 0.8);
    }
    ctx.restore();
    shade(ctx, mantle, [15, 40, 16, 32], { rim, shadow: 0.55, spec: 0.12, sx: 0.4, sy: 0.12, line: "#05061A", lineW: 0.18 });
    if (m.halloween) ixxenWraps(ctx, mantle, p, m);
    // the instrument harness: vials glowing on the hats
    ctx.strokeStyle = "#5A5F96"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(18, 47); ctx.lineTo(28.5, 55); ctx.stroke();
    [[20.2, 48.8, 200], [22.4, 50.5, 140], [24.6, 52.2, 30]].forEach(([x, y, hh], i) => {
      ctx.fillStyle = "#1A1E3C"; ctx.fillRect(x - 0.6, y - 1.7, 1.2, 2.8);
      ctx.fillStyle = `hsla(${hh},85%,${55 + m.high * 25}%,0.95)`; ctx.fillRect(x - 0.42, y - 1.1, 0.84, 2.1);
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fillRect(x - 0.3, y - 1, 0.16, 1.7);
      ctx.fillStyle = "#C9B98F"; ctx.fillRect(x - 0.6, y - 1.9, 1.2, 0.4);
      glow(ctx, x, y, 2.4, `hsla(${hh},90%,65%,0.9)`, m.high * 0.8 * (i === Math.floor(m.B) % 3 ? 1 : 0.4));
    });
    // collar fins and shoulder plates
    ["M19.5 42 Q18 35 21.6 33 L22.4 40 Z", "M27.8 42 Q30 36 27.6 34 L26 40 Z"].forEach((d) => {
      ctx.fillStyle = linear(ctx, 18, 33, 28, 42, [[0, "#2A3270"], [1, "#0E1232"]]); ctx.fill(P(d)); ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.15; ctx.stroke(P(d));
    });
    [[lerp(27.6, 29.4, fr), 45.6, 1], [lerp(19.4, 16.6, fr), 46, -1]].forEach(([x, y, s], n) => {
      if (n === 1 && fr < 0.5) return;
      ctx.fillStyle = linear(ctx, x - 2, y - 2, x + 2, y + 2, [[0, "#4A56A8"], [1, "#151A48"]]);
      ctx.beginPath(); ctx.ellipse(x + s * 0.2, y - 0.3, 2.4, 1.6, s * 0.4, PI, TAU); ctx.lineTo(x + s * 2.4, y + 0.6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.18; ctx.stroke();
    });
    // the neck: segmented; pushes forward on the beat (or straight up when it looks at you)
    const nk = p.neck;
    const fc = clamp(p.face, 0, 1);
    const side = [28.2 + nk * 3.2, 33.5 + nk * 1.2], up = [23.2, 32.6 + nk * 0.4];
    const u = Math.max(fr, fc * 0.6);
    const neckTop = [lerp(side[0], up[0], u), lerp(side[1], up[1], u)];
    {
      const base = [23.4, 42], top = [neckTop[0] + 0.9 * (1 - u), neckTop[1] - 1.8]; // the top runs up inside the head
      const sway = Math.sin(t * 1.1) * 0.15;
      const mid = [lerp(base[0], top[0], 0.5) - (1 - u) * 1.1 + sway, lerp(base[1], top[1], 0.5) + (1 - u) * 0.4];
      const r = arm3d(ctx, base, top, { elbow: mid, stiff: 0, w0: 4.6, w1: 3.4, col: N_COL, rim: `hsla(${hue},80%,72%,0.45)`, bulge: 0.15, joint: false, N: 22 });
      // the throat: soft rings on the front, a tendon down the back
      const { pts, ns, ws } = r, n = pts.length - 1;
      for (let k = 4; k < n - 2; k += 3) {
        const w = ws[k] / 2;
        ctx.strokeStyle = "rgba(25,28,70,0.45)"; ctx.lineWidth = 0.14;
        ctx.beginPath(); ctx.moveTo(pts[k][0] + ns[k][0] * w * 0.95, pts[k][1] + ns[k][1] * w * 0.95);
        ctx.quadraticCurveTo(pts[k + 1][0] + ns[k][0] * w * 0.2, pts[k + 1][1] + ns[k][1] * w * 0.2, pts[k][0] - ns[k][0] * w * 0.2, pts[k][1] - ns[k][1] * w * 0.2); ctx.stroke();
        ctx.strokeStyle = "rgba(220,226,255,0.22)"; ctx.lineWidth = 0.08;
        ctx.beginPath(); ctx.moveTo(pts[k][0] + ns[k][0] * w * 0.9, pts[k][1] + ns[k][1] * w * 0.9 - 0.18); ctx.lineTo(pts[k][0] + ns[k][0] * w * 0.3, pts[k][1] + ns[k][1] * w * 0.3 - 0.18); ctx.stroke();
      }
      ctx.strokeStyle = "rgba(25,28,70,0.4)"; ctx.lineWidth = 0.18;
      ctx.beginPath(); pts.slice(2, n - 1).forEach(([x, y], k) => { const kk = k + 2, w = ws[kk] / 2; const X = x - ns[kk][0] * w * 0.55, Y = y - ns[kk][1] * w * 0.55; k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
    }
    ixGorget(ctx); // over the neck's root
    if (m.halloween) ixxenNeckWraps(ctx, [23.4, 40.5], neckTop);
    // the head: in profile, or turned to face you (a quick turn through narrow)
    ctx.save();
    ctx.translate(neckTop[0], neckTop[1]); ctx.rotate(p.tilt * (1 - fc * 0.5)); ctx.scale(1.3, 1.3);
    if (fc < 0.5) { ctx.scale(1 - fc * 1.2, 1); H.side(ctx, p, m, hue, rim, neckTop); }
    else { ctx.scale(0.4 + (fc - 0.5) * 1.2, 1); H.front(ctx, p, m, hue, rim); }
    ctx.restore();
    if (p.noArms) { /* the Lab draws them */ }
    else if (fr < 0.5) [0, 2, 4].forEach(drawArm);
    else [5, 4, 3, 2, 1, 0].forEach(drawArm);
    ctx.restore();
}
// the mantle as cloth with weight (Update 6.22): a woven texture, drapes
// that catch the light, a quilted chest plate with an embossed sigil, a
// gorget, piping, and shadow where cloth folds under cloth
let WEAVE = null;
function weave(ctx) {
  if (WEAVE !== null) return WEAVE;
  try {
    const c = document.createElement("canvas"); c.width = c.height = 32;
    const g = c.getContext("2d");
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
      const v = ((x + y) % 4 < 2 ? 0.55 : 0.4) + ((x * 7 + y * 13) % 11) / 60;
      g.fillStyle = `rgba(${200 * v},${210 * v},255,${(x % 2 ^ y % 2) ? 0.5 : 0.25})`; g.fillRect(x, y, 1, 1);
    }
    WEAVE = ctx.createPattern(c, "repeat");
    if (WEAVE && WEAVE.setTransform) WEAVE.setTransform(new DOMMatrix().scale(0.06));
  } catch (e) { WEAVE = false; }
  return WEAVE;
}
function ixGorget(ctx) {
  // the gorget: a curved metal collar plate at the throat
  const gg = new Path2D("M20.2 41 Q23.4 39.8 26.6 41 L26.2 43 Q23.4 44.2 20.6 43 Z");
  ctx.fillStyle = linear(ctx, 0, 39.8, 0, 44, [[0, "#E2CF97"], [0.35, "#9C7F43"], [0.7, "#5A4420"], [1, "#2E2210"]]); ctx.fill(gg);
  ctx.strokeStyle = "rgba(255,248,215,0.8)"; ctx.lineWidth = 0.1; ctx.beginPath(); ctx.moveTo(20.6, 41.2); ctx.quadraticCurveTo(23.4, 40.1, 26.2, 41.2); ctx.stroke();
}
function ixCloth(ctx, h, hue, m) {
  // the weave
  const w = weave(ctx);
  if (w) { ctx.globalAlpha = 0.14; ctx.globalCompositeOperation = "overlay"; ctx.fillStyle = w; ctx.fillRect(14, 38, 18, 36); ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1; }
  // drapes: each a turned band of cloth, dark in its valley, lit on its ridge
  [[17.6, 1.6], [19.7, 1.9], [26.4, 1.9], [28.4, 1.5]].forEach(([x, wd], i) => {
    const x1 = x + h * (0.6 + i * 0.1);
    ctx.save(); ctx.beginPath();
    ctx.moveTo(x - wd * 0.25, 54); ctx.quadraticCurveTo(x + h * 0.2, 63, x1 - wd * 0.6, 72); ctx.lineTo(x1 + wd * 0.6, 72); ctx.quadraticCurveTo(x + h * 0.2 + wd * 0.5, 63, x + wd * 0.25, 54); ctx.closePath();
    ctx.fillStyle = linear(ctx, x1 - wd * 0.6, 0, x1 + wd * 0.6, 0, [[0, "rgba(4,5,22,0)"], [0.3, "rgba(4,5,22,0.45)"], [0.62, "rgba(140,155,235,0.28)"], [1, "rgba(140,155,235,0)"]]);
    ctx.fill(); ctx.restore();
  });
  // shadow under the gorget and above/below the belt
  ctx.fillStyle = linear(ctx, 0, 40, 0, 45, [[0, "rgba(2,3,14,0.75)"], [1, "rgba(2,3,14,0)"]]); ctx.fillRect(14, 40, 18, 5);
  ctx.fillStyle = linear(ctx, 0, 58.5, 0, 61.4, [[0, "rgba(2,3,14,0)"], [1, "rgba(2,3,14,0.5)"]]); ctx.fillRect(14, 58.5, 18, 3);
  ctx.fillStyle = linear(ctx, 0, 64.6, 0, 67.4, [[0, "rgba(2,3,14,0.55)"], [1, "rgba(2,3,14,0)"]]); ctx.fillRect(14, 64.6, 18, 3);
  // the quilted chest plate
  const cp = new Path2D("M19.4 44.2 Q23.3 42.6 27.2 44.2 L26.7 57.6 Q23.2 59 19.8 57.6 Z");
  ctx.fillStyle = linear(ctx, 19.4, 43, 27.2, 58, [[0, "#3E4BA2"], [0.45, "#232B6A"], [1, "#0F1338"]]); ctx.fill(cp);
  ctx.save(); ctx.clip(cp);
  for (let y = 45.6; y < 58; y += 2.2) for (let x = 19.6 + ((y * 10) % 2 ? 1.1 : 0); x < 27.2; x += 2.2) {
    ctx.fillStyle = radial(ctx, x + 1.1, y + 1.1, 1.5, [[0, "rgba(150,165,240,0.22)"], [1, "rgba(0,0,20,0.35)"]], x + 0.7, y + 0.7);
    ctx.beginPath(); ctx.moveTo(x + 1.1, y); ctx.lineTo(x + 2.2, y + 1.1); ctx.lineTo(x + 1.1, y + 2.2); ctx.lineTo(x, y + 1.1); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  ctx.setLineDash([0.25, 0.2]); ctx.strokeStyle = "rgba(201,168,94,0.55)"; ctx.lineWidth = 0.09;
  ctx.stroke(new Path2D("M20 44.9 Q23.3 43.5 26.6 44.9 L26.15 57 Q23.2 58.2 20.35 57 Z")); ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(160,175,250,0.45)"; ctx.lineWidth = 0.14; ctx.beginPath(); ctx.moveTo(19.5, 57.4); ctx.lineTo(19.45, 44.3); ctx.quadraticCurveTo(23.3, 42.7, 27.1, 44.3); ctx.stroke();
  ctx.strokeStyle = "rgba(0,0,10,0.7)"; ctx.lineWidth = 0.18; ctx.beginPath(); ctx.moveTo(27.2, 44.3); ctx.lineTo(26.7, 57.6); ctx.quadraticCurveTo(23.2, 59, 19.8, 57.6); ctx.stroke();
  // the embossed sigil: a gold ring, catching light top-left
  const sx = 23.3, sy = 47.4;
  ctx.fillStyle = radial(ctx, sx, sy, 1.9, [[0, "#1A1F4A"], [0.75, "#262E70"], [0.8, "#E6CF8E"], [0.9, "#8A6E36"], [1, "rgba(0,0,0,0)"]], sx - 0.5, sy - 0.5);
  ctx.beginPath(); ctx.arc(sx, sy, 1.9, 0, TAU); ctx.fill();
  ctx.strokeStyle = `hsla(${hue},90%,72%,${0.55 + 0.35 * dipOf(m)})`; ctx.lineWidth = 0.16;
  // its mark: one vertical eye (symmetric, so it reads the same whichever way it faces)
  ctx.beginPath(); ctx.moveTo(sx, sy - 1.1); ctx.quadraticCurveTo(sx + 0.75, sy, sx, sy + 1.1); ctx.quadraticCurveTo(sx - 0.75, sy, sx, sy - 1.1); ctx.stroke();
  ctx.fillStyle = `hsla(${hue},90%,75%,${0.6 + 0.3 * dipOf(m)})`; ctx.beginPath(); ctx.ellipse(sx, sy, 0.16, 0.6, 0, 0, TAU); ctx.fill();
  glow(ctx, sx, sy, 2.6, `hsla(${hue},90%,65%,0.6)`, 0.25 + 0.3 * dipOf(m));
  // piping along the front edges
  ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.22;
  ctx.beginPath(); ctx.moveTo(17.2, 45); ctx.quadraticCurveTo(16.4, 56, 16.8 + h, 70.4); ctx.moveTo(29.3, 45); ctx.quadraticCurveTo(30, 56, 29.3 + h, 70.4); ctx.stroke();
  ctx.strokeStyle = "rgba(255,240,200,0.35)"; ctx.lineWidth = 0.08; ctx.stroke();
  // the hem: a heavier band, its own fold
  ctx.fillStyle = linear(ctx, 0, 68.4, 0, 72, [[0, "rgba(60,72,150,0.9)"], [0.4, "rgba(25,30,80,0.95)"], [1, "rgba(5,6,20,1)"]]);
  ctx.beginPath(); ctx.moveTo(15 + h, 68.6); ctx.quadraticCurveTo(23 + h, 70.4, 31 + h, 68.6); ctx.lineTo(31 + h, 73); ctx.lineTo(15 + h, 73); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#C9A85E"; ctx.lineWidth = 0.18; ctx.beginPath(); ctx.moveTo(15 + h, 68.6); ctx.quadraticCurveTo(23 + h, 70.4, 31 + h, 68.6); ctx.stroke();
}
function ixBoot(ctx, x, y, fr, hue, m) {
  ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(x + (1 - fr) * 0.8, y + 0.3, 2.8, 0.6, 0, 0, TAU); ctx.fill();
  const b = new Path2D();
  if (fr < 0.5) { b.moveTo(x - 1.6, y); b.lineTo(x - 1.4, y - 1.8); b.quadraticCurveTo(x + 0.4, y - 2.2, x + 1.2, y - 1.2); b.quadraticCurveTo(x + 3.4, y - 0.8, x + 3.6, y); b.closePath(); }
  else b.ellipse(x, y - 0.9, 1.9, 1.1, 0, 0, TAU);
  ctx.fillStyle = linear(ctx, x, y - 2.2, x, y, [[0, "#4A56A8"], [1, "#0E1232"]]); ctx.fill(b);
  ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.18; ctx.stroke(b);
  const tx = fr < 0.5 ? x + 2.8 : x, ty = y - 0.5;
  ctx.fillStyle = `hsla(${hue},100%,75%,1)`; ctx.beginPath(); ctx.arc(tx, ty, 0.28, 0, TAU); ctx.fill();
  glow(ctx, tx, ty, 1.4, `hsla(${hue},100%,70%,0.9)`, 0.5 + 0.4 * dipOf(m));
}
// the frills: membrane fins growing out of the back of the dome (their roots
// are drawn under the head, so they're part of it), ribbed, light through them
const FRILLS = [[-8.0, -20.6, -2.7, 7.4], [-8.4, -17.4, -2.95, 6.8], [-7.0, -14.4, -3.25, 5.6]]; // root x, y, angle, length
function ixFrills(ctx, m, hue, front) {
  FRILLS.forEach(([x0, y0, a0, L], f) => {
    const sways = [-1, 1].slice(front ? 0 : 1);
    sways.forEach((s) => {
      const sx = front ? s * Math.abs(x0 + 4) : x0, ang = front ? (s > 0 ? -0.35 + f * 0.3 : PI + 0.35 - f * 0.3) : a0;
      const sw = Math.sin(m.B * PI + f * 0.8) * (0.25 + m.amp * 0.3);
      const a = ang + sw * (front ? s : 1);
      const tip = [sx + Math.cos(a) * L, y0 + Math.sin(a) * L];
      const nx = -Math.sin(a), ny = Math.cos(a), W = 1.5 - f * 0.15;
      const r0 = [sx + Math.cos(a) * -1.6, y0 + Math.sin(a) * -1.6]; // root, well inside the dome
      const fin = new Path2D();
      fin.moveTo(r0[0] + nx * W, r0[1] + ny * W);
      fin.quadraticCurveTo(lerp(r0[0], tip[0], 0.5) + nx * W * 1.5, lerp(r0[1], tip[1], 0.5) + ny * W * 1.5 + sw, tip[0], tip[1]);
      fin.quadraticCurveTo(lerp(r0[0], tip[0], 0.6) - nx * W * 0.6, lerp(r0[1], tip[1], 0.6) - ny * W * 0.6 + sw * 0.5, r0[0] - nx * W * 0.7, r0[1] - ny * W * 0.7);
      fin.closePath();
      ctx.fillStyle = linear(ctx, r0[0], r0[1], tip[0], tip[1], [[0, "#3B4382"], [0.35, "#7680C4"], [0.8, `hsla(${hue},45%,72%,0.85)`], [1, `hsla(${hue},60%,80%,0.6)`]]);
      ctx.fill(fin);
      // ribs fanning from the root, and the light through the membrane
      ctx.save(); ctx.clip(fin);
      ctx.strokeStyle = "rgba(25,28,70,0.55)"; ctx.lineWidth = 0.16;
      for (let r = -2; r <= 2; r++) { ctx.beginPath(); ctx.moveTo(r0[0], r0[1]); ctx.quadraticCurveTo(lerp(r0[0], tip[0], 0.5) + nx * r * 0.45, lerp(r0[1], tip[1], 0.5) + ny * r * 0.45 + sw * 0.7, tip[0] + nx * r * 0.9, tip[1] + ny * r * 0.9); ctx.stroke(); }
      ctx.fillStyle = "rgba(10,12,40,0.35)"; ctx.fillRect(r0[0] - 3 + nx * -2, r0[1] - 3, 6, 6);
      ctx.restore();
      ctx.strokeStyle = `hsla(${hue},90%,78%,0.6)`; ctx.lineWidth = 0.13; ctx.stroke(fin);
    });
  });
}
// the beard: fleshy barbels rooted under the chin; only their tips move
function ixBeard(ctx, m, roots, hue) {
  roots.forEach(([x, y, len, w], q) => {
    const sw = Math.sin(m.B * PI + q * 1.3) * (0.5 + m.amp * 0.5);
    const tip = [x + sw * 0.9 - 0.3, y + len], c = [x + sw * 0.25, y + len * 0.5];
    const pts = []; for (let k = 0; k <= 10; k++) { const u = k / 10, v = 1 - u; pts.push([v * v * x + 2 * v * u * c[0] + u * u * tip[0], v * v * y + 2 * v * u * c[1] + u * u * tip[1]]); }
    const L = [], R = [];
    pts.forEach(([px, py], k) => { const a = pts[Math.max(0, k - 1)], b = pts[Math.min(10, k + 1)]; let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; const ww = w * (1 - (k / 10) * 0.8); L.push([px - ty / l * ww, py + tx / l * ww]); R.push([px + ty / l * ww, py - tx / l * ww]); });
    ctx.beginPath(); L.forEach(([px, py], k) => (k ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); for (let k = 10; k >= 0; k--) ctx.lineTo(R[k][0], R[k][1]); ctx.closePath();
    ctx.fillStyle = linear(ctx, x - w, 0, x + w, 0, [[0, "#3A4180"], [0.55, "#8C95D0"], [1, "#4C5498"]]); ctx.fill();
    ctx.strokeStyle = "rgba(20,24,60,0.6)"; ctx.lineWidth = 0.1; ctx.stroke();
    ctx.fillStyle = `hsla(${hue},90%,75%,0.8)`; ctx.beginPath(); ctx.arc(tip[0], tip[1], w * 0.35, 0, TAU); ctx.fill();
  });
  // where they grow from: a soft fold under the chin
  const [x0, y0] = roots[0], [x1, y1] = roots[roots.length - 1];
  ctx.fillStyle = radial(ctx, (x0 + x1) / 2, (y0 + y1) / 2, 2.2, [[0, "rgba(120,130,200,0.9)"], [1, "rgba(80,90,160,0)"]]);
  ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, (y0 + y1) / 2 - 0.2, Math.abs(x1 - x0) / 2 + 0.8, 0.9, Math.atan2(y1 - y0, x1 - x0), 0, TAU); ctx.fill();
}
function ixHeadSide(ctx, p, m, hue, rim, neckTop, paint) {
  const t = m.t;
  ixFrills(ctx, m, hue, false);
  paint(ctx, 0, p, m, neckTop);
  ixBeard(ctx, m, [[2.9, -2.0, 2.6, 0.42], [3.8, -2.2, 3.2, 0.46], [4.7, -2.7, 2.7, 0.4]], hue);
  if (m.cicada && !paintRangerHat(ctx, m, -3, -21, 17, 0.1)) rangerHat(ctx, -3, -21, 17, 0.1);
  ixLoupe(ctx, p, m, false);
}
// facing front: the dome rises tall and narrow, crest lights down the middle,
// frills fanning out both sides, the vertical eye in the centre
function ixHeadFront(ctx, p, m, hue, rim, paint) {
  const t = m.t;
  ixFrills(ctx, m, hue, true);
  paint(ctx, 1, p, m, null);
  ixBeard(ctx, m, [[-1.1, -1.4, 2.6, 0.42], [0, -1.1, 3.2, 0.46], [1.1, -1.4, 2.6, 0.42]], hue);
  if (m.cicada && !paintRangerHat(ctx, m, 0, -22, 16, 0)) rangerHat(ctx, 0, -22, 16, 0);
  ixLoupe(ctx, p, m, true);
}
function ixLoupe(ctx, p, m, front) {
  if (p.shades < 0.5) {
    // in the Lab it swings down over the big eye when Ixxen peers (p.loupe)
    const lo = front ? 0 : p.loupe || 0;
    const lx = front ? -4.6 : lerp(0.4, 3.6, lo), ly = front ? -19.2 : lerp(-19.6, -11.4, lo);
    ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.28;
    ctx.beginPath(); ctx.moveTo(front ? -3.4 : -1.5, -14); ctx.quadraticCurveTo(lerp(lx + 0.4, 2, lo), lerp(-17.5, -14.5, lo), lx, ly); ctx.stroke();
    ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.42; ctx.beginPath(); ctx.arc(lx, ly, 2.2, 0, TAU); ctx.stroke();
    ctx.fillStyle = "rgba(200,230,255,0.14)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 0.16; ctx.beginPath(); ctx.arc(lx, ly, 1.6, -2.4, -1.5); ctx.stroke();
    return;
  }
  ctx.fillStyle = "#07060F";
  ctx.beginPath();
  if (front) { ctx.moveTo(-5.8, -17.4); ctx.lineTo(5.8, -17.4); ctx.lineTo(5, -9.4); ctx.quadraticCurveTo(0, -7.4, -5, -9.4); }
  else { ctx.moveTo(-1.2, -16.8); ctx.lineTo(6.6, -16.2); ctx.lineTo(6.2, -9.4); ctx.quadraticCurveTo(3.4, -7.6, 0.6, -9.6); }
  ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.3; ctx.stroke();
  const sh = (m.B * 0.5) % 1;
  ctx.strokeStyle = `hsla(${m.pal.b},100%,80%,0.8)`; ctx.lineWidth = 0.4;
  const x0 = front ? -5 : -0.6, x1 = front ? 5 : 6;
  ctx.beginPath(); ctx.moveTo(lerp(x0, x1, sh), -16.6); ctx.lineTo(lerp(x0, x1, sh) - 1.4, -10); ctx.stroke();
  glow(ctx, front ? 0 : 4.4, -13, 3, `hsla(${m.pal.b},100%,70%,0.8)`, dipOf(m) * 0.7);
}


export function makeIxxen() {
  const names = ["uRes", "uBox", "uMode", "uT", "uB", "uBass", "uHueA", "uHueB", "uBlink", "uShades", "uEyeOff", "uMummy"];
  const GS = makeGL(XFRAG, BOXES[0], names, [], "XB_"), GF = makeGL(XFRAG, BOXES[1], names, [], "XB_");
  if (!GS || !GF) return null;
  function paint(ctx, mode, p, m, neckTop) {
    const G = mode ? GF : GS, box = BOXES[mode];
    const tf = ctx.getTransform(); const k = Math.max(Math.hypot(tf.a, tf.b), Math.hypot(tf.c, tf.d));
    let w = Math.round(box.w * k), h = Math.round(box.h * k);
    const cap = 1000 / Math.max(w, h); if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
    const { gl, U, c } = G;
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h); gl.uniform4f(U.uBox, box.x0, box.y0, box.w, box.h); gl.uniform1f(U.uMode, mode);
    gl.uniform1f(U.uT, m.t); gl.uniform1f(U.uB, m.B); gl.uniform1f(U.uBass, m.bass); gl.uniform1f(U.uHueA, m.pal.a); gl.uniform1f(U.uHueB, m.pal.b);
    gl.uniform1f(U.uBlink, (m.t % 5.3) > 5.15 ? 0.12 : 1); gl.uniform1f(U.uShades, p.shades); gl.uniform1f(U.uMummy, m.halloween ? 1 : 0);
    let ox = 0, oy = 0;
    if (!mode && neckTop) { const la = Math.atan2(p.look[1] - (neckTop[1] - 11), p.look[0] - (neckTop[0] + 3)) - p.tilt; ox = Math.cos(la) * 0.55; oy = Math.sin(la) * 1.4; }
    gl.uniform2f(U.uEyeOff, ox, oy);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    ctx.drawImage(c, box.x0, box.y0, box.w, box.h);
  }
  const H = { side: (ctx, p, m, hue, rim, neckTop) => ixHeadSide(ctx, p, m, hue, rim, neckTop, paint), front: (ctx, p, m, hue, rim) => ixHeadFront(ctx, p, m, hue, rim, paint) };
  return (ctx, p, m) => drawBody(ctx, p, m, H);
}
