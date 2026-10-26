// Sypher's flight suit, painted per pixel: the torso (mode 0), a pauldron
// (mode 1, mirrored by uSide) and a boot (mode 2). Character units, y down.
import { FRAG as DJ } from "./djShader";
const COMMON = DJ.slice(DJ.indexOf("const float PI"), DJ.indexOf("// ---------- materials ----------"));

export const TB = { x0: -25, y0: -10, w: 50, h: 50 };   // torso, origin at the chest line
export const PB = { x0: -12, y0: -10, w: 24, h: 17 };   // pauldron, origin at its centre
export const BB = { x0: -11, y0: -16, w: 22, h: 18 };   // boot, origin at the sole

export const SUITFRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uMode, uSide, uT, uB, uBass, uHueA, uHueB, uStorm, uJets, uPulse;
${COMMON}
#define GRAD(F, p) normalize(vec2(F(p + vec2(0.05, 0.0)) - F(p - vec2(0.05, 0.0)), F(p + vec2(0.0, 0.05)) - F(p - vec2(0.0, 0.05))) + 1e-5)

vec3 VI, CY;
// metal: lavender hull plate, brushed, with a bevel from its own edge
vec3 hull(vec2 p, vec3 n, float tone) {
  float br = noise(vec2(p.x * 0.5, p.y * 9.0)) * 0.5 + noise(vec2(p.x * 1.3, p.y * 22.0)) * 0.5;
  vec3 alb = lin(vec3(0.74, 0.71, 0.88)) * (0.82 + 0.22 * br) * tone;
  // scuffs
  alb *= 1.0 - 0.18 * smoothstep(0.62, 0.8, fbm(p * 0.9 + 3.0));
  vec3 c = light(alb, n, 70.0, 0.85, 0.0, vec3(0.0), 1.0);
  // a cool environment sheen from the floor lights below
  c += mix(rimA, rimB, 0.5) * 0.12 * max(n.y, 0.0);
  return c;
}
// the flight-suit fabric: a dark violet weave
vec3 cloth(vec2 p, vec3 n) {
  float wv = 0.5 + 0.5 * sin(p.x * 9.0) * sin(p.y * 9.0);
  vec3 alb = lin(vec3(0.30, 0.27, 0.48)) * (0.86 + 0.14 * wv) * (0.9 + 0.2 * fbm(p * 0.6));
  return light(alb, n, 18.0, 0.12, 0.0, vec3(0.0), 1.0);
}
float bolt(vec2 p, vec2 c, inout vec3 col, float r) {
  float d = length(p - c) - r;
  if (d < px) {
    vec2 q = (p - c) / r; float e = clamp(length(q), 0.0, 1.0);
    vec3 n = normalize(vec3(q * 0.8, sqrt(max(1.0 - e * e, 0.0)) + 0.2));
    vec3 bc = light(lin(vec3(0.55, 0.52, 0.68)), n, 90.0, 1.0, 0.0, vec3(0.0), 1.0);
    col = mix(col, bc * 0.9, clamp(0.5 - d / px, 0.0, 1.0));
  }
  return d;
}

float torsoSD(vec2 p) {
  float chest = sdEll(p - vec2(0.0, 9.5), vec2(19.5, 13.5));
  float waist = sdRBox(p - vec2(0.0, 26.0), vec2(13.8, 10.0), 4.0);
  return max(smin(chest, waist, 7.0), -p.y - 3.5);
}
float plateSD(vec2 p) { return sdTrap(p, 10.0, 5.6, 1.2, 20.0) - 1.0; }
float sideSD(vec2 p) { vec2 q = vec2(abs(p.x), p.y); return sdEll(rot(q - vec2(14.6, 10.5), -0.18), vec2(4.4, 8.2)); }
float paulSD(vec2 p) { return max(sdEll(p, vec2(9.0, 7.2)), p.y - 3.2); }
float bootSD(vec2 p) { return smin(sdRBox(p - vec2(0.0, -4.5), vec2(7.6, 4.5), 2.4), sdEll(p - vec2(0.0, -10.5), vec2(6.0, 4.6)), 2.5); }

void torso(vec2 p) {
  float d = torsoSD(p);
  if (d > px * 2.0) return;
  // a rounded, barrel-like body: shaded across its width (no creases)
  float ex = clamp(p.x / max(abs(p.x) - d, 1.0), -1.0, 1.0);
  vec3 n = normalize(vec3(ex * 0.95, -0.45 * smoothstep(8.0, -3.5, p.y) + 0.35 * smoothstep(30.0, 37.0, p.y), sqrt(max(1.0 - ex * ex, 0.0)) + 0.12));
  vec3 c = cloth(p, n);
  // quilted seams down the flanks, and the stitching beside them
  for (int i = 0; i < 2; i++) {
    float s = i == 0 ? -1.0 : 1.0;
    float sx = s * (11.6 - 0.12 * max(p.y - 16.0, 0.0));
    float g = abs(p.x - sx);
    c *= 1.0 - 0.55 * smoothstep(0.55, 0.0, g) * step(14.0, p.y);
    c += lin(vec3(0.6, 0.55, 0.85)) * 0.12 * step(0.5, fract(p.y * 1.2)) * smoothstep(0.35, 0.0, abs(g - 0.9)) * step(14.0, p.y);
  }
  // the ribbed abdomen: a flexible segmented panel
  float ab = sdRBox(p - vec2(0.0, 25.6), vec2(9.0, 4.0), 1.6);
  if (ab < px) {
    float rib = fract((p.y - 21.6) / 2.0);
    vec3 an = normalize(n + vec3(0.0, (rib - 0.5) * 1.3, 0.0));
    vec3 ac = light(lin(vec3(0.24, 0.22, 0.38)) * (0.75 + 0.35 * smoothstep(0.0, 0.5, rib) * smoothstep(1.0, 0.6, rib)), an, 40.0, 0.4, 0.0, vec3(0.0), 1.0);
    ac *= 1.0 - 0.6 * smoothstep(0.12, 0.0, rib);
    c = mix(c, ac, clamp(0.5 - ab / px, 0.0, 1.0));
  }
  // armour over the ribs
  float sd = sideSD(p);
  if (sd < px) {
    vec3 sn = normalize(nrm(GRAD(sideSD, p), sd, 2.8) + n * 0.6);
    vec3 sc = hull(p, sn, 0.78);
    sc *= 1.0 - 0.5 * smoothstep(0.35, 0.0, abs(sd + 1.6));            // inset line
    bolt(p, vec2(sign(p.x) * 14.6, 4.6), sc, 0.55);
    c = mix(c, sc, clamp(0.5 - sd / px, 0.0, 1.0));
    c *= 1.0 - 0.6 * smoothstep(-0.2, 0.45, sd) * smoothstep(1.2, 0.45, sd) ;
  }
  // the chest plate
  float pd = plateSD(p);
  // its shadow on the suit
  c *= 1.0 - 0.3 * smoothstep(1.2, 0.0, plateSD(p - vec2(0.6, -0.8))) * step(0.0, pd) * step(p.y, 20.5);
  if (pd < px) {
    vec3 pn = normalize(nrm(GRAD(plateSD, p), pd, 3.2) + vec3(p.x / 40.0, (p.y - 10.0) / 50.0, 0.0));
    vec3 pc = hull(p, pn, 1.0);
    // panel seams: one across, one down the middle below it
    float sy = abs(p.y - 6.4), sv = abs(p.x) * step(6.4, p.y) + step(p.y, 6.4) * 9.0;
    float seam = min(sy, sv);
    pc *= 1.0 - 0.65 * smoothstep(0.32, 0.0, seam);
    pc += vec3(1.0) * 0.18 * smoothstep(0.32, 0.12, abs(seam - 0.45));
    // engraved chevrons above the core
    float ch = abs(abs(p.x) * 0.55 + (p.y - 3.8)) ;
    pc *= 1.0 - 0.35 * smoothstep(0.25, 0.0, ch) * step(abs(p.x), 6.5) * step(p.y, 6.0);
    // bolts
    bolt(p, vec2(-8.2, 2.8), pc, 0.6); bolt(p, vec2(8.2, 2.8), pc, 0.6);
    bolt(p, vec2(-4.6, 18.2), pc, 0.5); bolt(p, vec2(4.6, 18.2), pc, 0.5);
    // the cyan strips either side of the core
    for (int i = 0; i < 2; i++) {
      float s = i == 0 ? -1.0 : 1.0;
      float lx = abs(p.x - s * 6.2), ly = step(8.5, p.y) * step(p.y, 16.5);
      pc *= 1.0 - 0.7 * smoothstep(0.75, 0.3, lx) * ly;
      pc += CY * smoothstep(0.42, 0.0, lx) * ly * (1.3 + uPulse * 1.2);
    }
    c = mix(c, pc, clamp(0.5 - pd / px, 0.0, 1.0));
    c *= 1.0 - 0.55 * smoothstep(-0.25, 0.3, pd) * smoothstep(0.9, 0.3, pd);
  }
  // the reactor: a bevelled housing ring, then the swirling core
  vec2 rc = p - vec2(0.0, 12.0);
  float rr = length(rc);
  float hd = rr - 4.8;
  if (hd < px) {
    float e = clamp((rr - 3.4) / 1.4, 0.0, 1.0);
    vec3 hn = normalize(vec3(rc / max(rr, 1e-3) * (e - 0.5) * 1.6, 0.8));
    vec3 hc = light(lin(vec3(0.34, 0.32, 0.46)), hn, 80.0, 0.9, 0.0, vec3(0.0), 1.0);
    // eight lights round the ring, one chasing round
    float an = atan(rc.y, rc.x) / (2.0 * PI) + 0.5;
    float seg = floor(an * 8.0), segf = fract(an * 8.0);
    float lit = step(abs(segf - 0.5), 0.22) * smoothstep(0.9, 0.0, abs(rr - 4.1));
    float chase = mod(seg - floor(uT * 10.0), 8.0) < 1.0 ? 1.0 : 0.25;
    hc += VI * lit * chase * 1.4;
    c = mix(c, hc, clamp(0.5 - hd / px, 0.0, 1.0));
    float cd = rr - 3.3;
    if (cd < px) {
      float sw = sin(atan(rc.y, rc.x) * 3.0 + rr * 1.6 - uT * 5.0) * 0.5 + 0.5;
      float core = smoothstep(3.3, 0.0, rr);
      vec3 cc = mix(lin(vec3(0.16, 0.04, 0.3)), VI * 1.4, 0.35 + 0.65 * sw * (0.4 + 0.6 * core));
      cc += vec3(1.0) * smoothstep(1.4 + uBass, 0.0, rr) * (0.9 + uBass);
      cc *= 0.8 + 0.4 * uPulse;
      c = mix(c, cc, clamp(0.5 - cd / px, 0.0, 1.0));
    }
  }
  // the belt, its buckle and pouches
  float bd = sdRBox(p - vec2(0.0, 32.4), vec2(14.6, 2.5), 1.0);
  if (bd < px) {
    vec3 bn = normalize(n + vec3(0.0, (p.y - 32.4) / 4.0, 0.0));
    vec3 bc = light(lin(vec3(0.13, 0.11, 0.2)), bn, 50.0, 0.5, 0.0, vec3(0.0), 1.0);
    bc += CY * 0.35 * smoothstep(0.3, 0.0, abs(abs(p.y - 32.4) - 1.6)) ;
    c = mix(c, bc, clamp(0.5 - bd / px, 0.0, 1.0));
    c *= 1.0 - 0.5 * smoothstep(-0.25, 0.3, bd) * smoothstep(0.8, 0.3, bd);
  }
  for (int i = 0; i < 2; i++) {
    float s = i == 0 ? -1.0 : 1.0;
    float qd = sdRBox(p - vec2(s * 9.8, 33.6), vec2(2.6, 2.9), 0.9);
    if (qd < px) {
      vec3 qn = nrm(GRAD(torsoSD, p), qd, 1.5);
      vec3 qc = light(lin(vec3(0.24, 0.22, 0.36)), normalize(qn + n), 40.0, 0.4, 0.0, vec3(0.0), 1.0);
      qc *= 1.0 - 0.5 * smoothstep(0.25, 0.0, abs(p.y - 32.0));
      c = mix(c, qc, clamp(0.5 - qd / px, 0.0, 1.0));
    }
  }
  float kd = sdRBox(p - vec2(0.0, 32.4), vec2(3.0, 2.2), 0.6);
  if (kd < px) {
    vec3 kc = hull(p, normalize(vec3(0.0, 0.0, 1.0) + vec3((p.x) / 6.0, (p.y - 32.4) / 5.0, 0.0)), 1.0);
    float ins = sdRBox(p - vec2(0.0, 32.4), vec2(1.6, 0.9), 0.3);
    kc = mix(kc, CY * (1.4 + uPulse), clamp(0.5 - ins / px, 0.0, 1.0));
    c = mix(c, kc, clamp(0.5 - kd / px, 0.0, 1.0));
  }
  put(d, c);
  // light thrown by the core and the strips
  glowAdd(VI, exp(-max(rr - 3.0, 0.0) * 0.5) * 0.25 * (0.6 + uBass + uStorm) * step(3.3, rr));
}

void pauldron(vec2 p0) {
  vec2 p = vec2(p0.x * uSide, p0.y);       // modelled as the right one
  p = rot(p, -0.3);
  float d = paulSD(p);
  if (d > px * 2.0) return;
  vec3 n = nrm(GRAD(paulSD, p), d, 6.0);
  n.xy = rot(n.xy, 0.3); n.x *= uSide;
  // three overlapping lames
  float l = fract((length(p / vec2(1.0, 0.8)) - 1.0) / 3.0);
  float ring = length(p / vec2(1.0, 0.8));
  vec3 c = hull(p0, n, 1.0);
  float lame = abs(ring - 6.4), lame2 = abs(ring - 3.6);
  c *= 1.0 - 0.55 * smoothstep(0.35, 0.0, min(lame, lame2)) * step(p.y, 2.6);
  c += vec3(1.0) * 0.15 * smoothstep(0.35, 0.1, abs(min(lame, lame2) - 0.5)) * step(p.y, 2.6);
  // the cyan trim along the outer lame
  float tr = abs(ring - 5.0) * step(p.y, 1.8);
  c = mix(c, CY * (1.2 + uPulse), smoothstep(0.42, 0.12, tr));
  // under-lip
  c *= 1.0 - 0.5 * smoothstep(1.2, 3.2, p.y);
  bolt(p, vec2(-5.8, 0.8), c, 0.55);
  bolt(p, vec2(5.8, 0.8), c, 0.55);
  put(d, c);
  glowAdd(CY, exp(-max(tr, 0.0) * 2.0) * 0.12 * step(p.y, 1.8) * step(0.0, d));
}

void boot(vec2 p) {
  float d = bootSD(p);
  if (d > px * 2.0) return;
  vec3 n = nrm(GRAD(bootSD, p), d, 5.0);
  vec3 c = hull(p, n, 0.8);
  // the toe cap and the ankle cuff seams
  c *= 1.0 - 0.6 * smoothstep(0.3, 0.0, abs(p.y + 4.2)) * step(abs(p.x), 7.0);
  c *= 1.0 - 0.6 * smoothstep(0.3, 0.0, abs(p.y + 12.0)) ;
  // the sole
  float so = smoothstep(-1.6, -1.2, p.y);
  c = mix(c, light(lin(vec3(0.08, 0.07, 0.12)), n, 30.0, 0.3, 0.0, vec3(0.0), 1.0), so);
  // the thruster ring round the ankle
  float tr = abs(length((p - vec2(0.0, -7.6)) / vec2(5.0, 1.5)) - 1.0) * 1.5;
  float ton = 0.9 + uJets * 2.5;
  c = mix(c, CY * ton, smoothstep(0.42, 0.1, tr));
  // vents
  for (int i = 0; i < 3; i++) { float vx = -2.4 + float(i) * 2.4; c *= 1.0 - 0.6 * smoothstep(0.35, 0.0, abs(p.x - vx)) * step(-3.6, p.y) * step(p.y, -2.0); }
  put(d, c);
  glowAdd(CY, exp(-tr * 1.4) * (0.15 + uJets * 0.8) * step(0.0, d));
}

void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uBox.x + f.x * uBox.z, uBox.y + (1.0 - f.y) * uBox.w);
  px = uBox.z / uRes.x;
  rimA = lin(hsl2rgb(uHueA, 1.0, 0.62)) * 1.1;
  rimB = lin(hsl2rgb(uHueB, 1.0, 0.68)) * 1.1;
  VI = lin(vec3(0.75, 0.49, 1.0)); CY = lin(vec3(0.37, 0.89, 0.91));
  if (uMode < 0.5) torso(p);
  else if (uMode < 1.5) pauldron(p);
  else boot(p);
  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;
