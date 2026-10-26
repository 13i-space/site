// The jack-o'-lanterns along the back of the stage on the Halloween remix,
// painted per pixel (Update 6.17): a ribbed, waxy pumpkin with a twisted stem,
// each carved with its own face, a candle inside that flares on the kick and
// lights the cut edges of the flesh and the skin round the holes from within.
// Units: the base of the pumpkin at 0,0, about 20 wide.
import { FRAG as DJ } from "./djShader";
const COMMON = DJ.slice(DJ.indexOf("const float PI"), DJ.indexOf("// ---------- materials ----------"));

export const PBOX = { x0: -13, y0: -24, w: 26, h: 26 };

export const PFRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uT, uFlick, uSeed, uHueA, uHueB, uSquat;
uniform vec2 uFlame;     // where the flame leans
${COMMON}

// the pumpkin's body: lobes round a centre, squat or tall
float lobeD(vec2 p, out float rib, out float ex) {
  vec2 c = vec2(0.0, -8.0 * uSquat);
  vec2 q = (p - c) / vec2(10.0, 8.0 * uSquat);
  float r = length(q);
  // a ribbed outline: a little dip between each lobe
  float a = atan(q.x, -q.y);
  float lobes = 7.0;
  float w = cos(a * lobes * 0.5);
  rib = 1.0 - abs(w);
  float R = 1.0 - 0.04 * rib - 0.08 * smoothstep(0.75, 1.0, -q.y) ;   // flatter on top, a dimple round the stem
  ex = q.x;
  return (r - R) * 8.0;
}
// the carved face, in the pumpkin's own coordinates; three designs
float faceD(vec2 p, float seed) {
  vec2 q = p - vec2(0.0, -8.0 * uSquat);
  float d = 1e9;
  float kind = floor(seed * 3.0);
  // eyes
  for (int i = 0; i < 2; i++) {
    float s = i == 0 ? -1.0 : 1.0;
    vec2 e = q - vec2(s * 3.6, -2.2);
    float ed;
    if (kind < 0.5) ed = sdTri(e, vec2(-1.6, 1.0), vec2(0.0, -1.6), vec2(1.6, 1.0));                    // triangles
    else if (kind < 1.5) ed = sdTri(e, vec2(-1.8 * s, -1.4), vec2(1.6 * s, 0.8), vec2(-1.2 * s, 1.0)); // angry slants
    else ed = sdEll(e, vec2(1.3, 1.6));                                                                 // round, staring
    d = min(d, ed);
  }
  // nose
  d = min(d, sdTri(q - vec2(0.0, 0.4), vec2(-0.8, 0.8), vec2(0.0, -0.8), vec2(0.8, 0.8)));
  // the mouth: a jagged grin with teeth
  vec2 mq = q - vec2(0.0, 3.4);
  float grin = max(abs(mq.x) - 5.4, abs(mq.y - 0.06 * mq.x * mq.x + 0.4) - 1.3);
  float teeth = 1e9;
  for (int k = -2; k <= 2; k++) {
    float tx = float(k) * 2.2 + 1.1 * mod(kind, 2.0);
    teeth = min(teeth, sdRBox(mq - vec2(tx, -1.0 + 0.06 * tx * tx), vec2(0.45, 0.6), 0.1));
    teeth = min(teeth, sdRBox(mq - vec2(tx + 1.1, 1.1 + 0.06 * tx * tx), vec2(0.45, 0.55), 0.1));
  }
  grin = max(grin, -teeth);
  return min(d, grin);
}

void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uBox.x + f.x * uBox.z, uBox.y + (1.0 - f.y) * uBox.w);
  px = uBox.z / uRes.x;
  rimA = lin(hsl2rgb(uHueA, 1.0, 0.62)) * 0.6;
  rimB = lin(hsl2rgb(uHueB, 1.0, 0.68)) * 0.6;
  vec3 flame = lin(vec3(1.0, 0.72, 0.28)) * (0.8 + uFlick * 1.2);
  float rib, ex;
  float d = lobeD(p, rib, ex);
  // its glow on the floor
  glowAdd(lin(vec3(1.0, 0.5, 0.15)), exp(-max(length((p - vec2(0.0, 0.0)) / vec2(2.2, 0.5)) - 6.0, 0.0) * 0.35) * 0.25 * uFlick * step(0.0, d) * step(-2.0, p.y));
  if (d < px * 2.0) {
    vec2 q = (p - vec2(0.0, -8.0 * uSquat)) / vec2(10.0, 8.0 * uSquat);
    float r = clamp(length(q), 0.0, 1.0);
    // a round body with grooves running pole to pole
    vec3 n = normalize(vec3(q * 0.95, sqrt(max(1.0 - r * r, 0.0)) + 0.08));
    float a = atan(q.x, -q.y);
    n = normalize(n + vec3(cos(a) * sin(a * 3.5) * 0.35, 0.0, 0.0) * (1.0 - r * 0.3));
    vec3 alb = mix(lin(vec3(0.93, 0.47, 0.11)), lin(vec3(0.62, 0.25, 0.04)), rib * 0.8);
    alb *= 0.9 + 0.18 * fbm(vec2(a * 3.0, r * 6.0) + uSeed * 10.0);              // mottling along the ribs
    alb = mix(alb, lin(vec3(0.45, 0.42, 0.12)), smoothstep(0.7, 1.0, -q.y) * 0.5); // greener round the stem
    alb *= 1.0 - 0.25 * smoothstep(0.82, 0.9, noise(p * 2.6 + uSeed * 7.0));       // speckles and scars
    vec3 c = light(alb, n, 40.0, 0.45, 0.3, lin(vec3(1.0, 0.5, 0.1)), 1.0);
    // the candle's light glowing through the skin round the face
    float fd = faceD(p, uSeed);
    c += flame * lin(vec3(1.0, 0.45, 0.1)) * 0.5 * exp(-max(fd, 0.0) * 0.9) * step(0.0, fd);
    // the carved holes: the cut flesh lit at its inner edge, the inside bright
    if (fd < 0.3) {
      vec2 lean = uFlame * 0.6;
      float inner = -fd;
      vec3 hole = flame * (1.2 + 0.6 * smoothstep(3.0, 0.0, length(p - vec2(0.0, -6.0 * uSquat) - lean)));
      // the wall's thickness: a band of lit yellow flesh along the lower and inner sides
      vec3 flesh = lin(vec3(1.0, 0.82, 0.35)) * (0.6 + uFlick * 0.6);
      vec3 hc = mix(flesh, hole, smoothstep(0.15, 0.6, inner));
      c = mix(c, hc, clamp(0.5 - fd / px, 0.0, 1.0));
    }
    put(d, c);
    glowAdd(flame * lin(vec3(1.0, 0.6, 0.2)), exp(-max(fd, 0.0) * 1.4) * 0.35 * uFlick * step(0.0, fd) * step(d, 0.0));
  }
  // the stem: twisted, dry, leaning
  vec2 sq = p - vec2(0.0, -16.0 * uSquat + 0.6);
  float sh = clamp(-sq.y / 4.2, 0.0, 1.0);
  float sx = sq.x - sin(sh * 2.2) * 1.2 * (uSeed - 0.5) * 2.0;
  float st = max(abs(sx) - mix(1.2, 0.6, sh), max(sq.y - 0.8, -sq.y - 4.2));
  if (st < px) {
    float e = clamp(sx / mix(1.2, 0.6, sh), -1.0, 1.0);
    vec3 sn = normalize(vec3(e, 0.0, sqrt(max(1.0 - e * e, 0.0)) + 0.1));
    vec3 sc = light(lin(vec3(0.36, 0.34, 0.16)) * (0.8 + 0.3 * sin(sx * 6.0 + sq.y * 2.0)), sn, 20.0, 0.2, 0.0, vec3(0.0), 1.0);
    put(st, sc);
  }
  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;
