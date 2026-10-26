// The girl of the Halloween remix, painted per pixel (Update 6.15). Same
// figure as lib/rave/girl.js - a creepy little alien girl, huge black eyes
// with a red pinprick, long black hair, a torn old nightgown, bare feet that
// never touch the floor, a stitched doll of Ilu in one hand - lit by the cold
// spotlight she floats in. Units as girl.js: feet at 0,0, about 100 tall.
import { FRAG as DJ } from "./djShader";
const COMMON = DJ.slice(DJ.indexOf("const float PI"), DJ.indexOf("// ---------- materials ----------"));

export const GBOX = { x0: -27, y0: -107, w: 54, h: 128 };

export const GFRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uT, uMouth, uTilt, uWide, uSwing, uDrift, uDollA, uWhisper, uDollMode;
uniform vec2 uDollPos;   // where the doll hangs from (or lies); uDollMode 0 held, 1 the doll alone, 2 no doll
uniform vec2 uLegs, uLook;
${COMMON}

// a capsule, and a normal for it (round across its width)
float cap(vec2 p, vec2 a, vec2 b, float r0, float r1, out vec3 n) {
  vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  vec2 q = pa - ba * h; float r = mix(r0, r1, h);
  float d = length(q) - r;
  float e = clamp(length(q) / max(r, 1e-3), 0.0, 1.0);
  vec2 dir = q / max(length(q), 1e-4);
  n = normalize(vec3(dir * e, sqrt(max(1.0 - e * e, 0.0)) + 0.05));
  return d;
}
// her skin: bloodless, faintly blue, light passing into it
vec3 skin(vec3 n, vec2 p, float shade) {
  vec3 alb = lin(vec3(0.80, 0.79, 0.86)) * (0.92 + 0.1 * noise(p * 2.0));
  vec3 c = light(alb, n, 30.0, 0.25, 0.85, lin(vec3(0.55, 0.6, 0.9)), shade);
  // the spotlight is cold and green-white, from straight above
  c += lin(vec3(0.6, 1.0, 0.75)) * 0.16 * max(-n.y, 0.0);
  return c;
}
vec3 cloth(vec2 p, vec3 n, float dirt) {
  vec3 alb = lin(vec3(0.86, 0.83, 0.76));
  alb = mix(alb, lin(vec3(0.55, 0.48, 0.38)), dirt);
  alb *= 0.9 + 0.12 * noise(p * vec2(1.2, 6.0));      // the weave
  vec3 c = light(alb, n, 14.0, 0.06, 0.5, lin(vec3(0.9, 0.85, 0.7)), 1.0);
  c += lin(vec3(0.6, 1.0, 0.75)) * 0.1 * max(-n.y, 0.0);
  return c;
}
vec3 hairC(vec2 p, vec3 n, float strand) {
  vec3 c = lin(vec3(0.035, 0.03, 0.045));
  float sheen = pow(max(0.0, sin(strand)), 18.0);
  c += lin(vec3(0.45, 0.5, 0.6)) * 0.22 * sheen * max(-n.y + 0.3, 0.0);
  c += mix(rimA, rimB, 0.5) * 0.06 * pow(1.0 - n.z, 2.0);
  return c;
}

float headSD(vec2 q) { return smin(sdEll(q - vec2(0.0, -86.0), vec2(16.4, 15.0)), sdEll(q - vec2(0.0, -70.5), vec2(8.6, 8.4)), 7.0); }
float gownSD(vec2 p) {
  float dr = uDrift;
  float v = clamp((p.y + 63.0) / 31.0, 0.0, 1.0);
  float hw = mix(9.0, 19.0, pow(v, 1.3)) + dr * v * sign(p.x) * 0.0;
  float cx = dr * v * v;
  // the torn hem, ragged and moving a little
  float k = (p.x - cx + 19.0) / 38.0 * 10.0;
  float hem = -32.0 + (mod(floor(k), 2.0) > 0.5 ? 3.6 + 3.0 * hash(vec2(floor(k), 2.0)) : -0.6) * (1.0 - abs(fract(k) - 0.5) * 1.2) + sin(uT * 2.0 + k) * 0.6;
  return max(max(abs(p.x - cx) - hw, -63.0 - p.y), p.y - hem);
}

void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uBox.x + f.x * uBox.z, uBox.y + (1.0 - f.y) * uBox.w);
  px = uBox.z / uRes.x;
  rimA = lin(vec3(0.5, 1.0, 0.7)) * 0.7;   // the spotlight's cold green on her edges
  rimB = lin(vec3(0.7, 0.75, 1.0)) * 0.6;
  float t = uT;
  // the head's frame: tilted about the neck
  vec2 q = rot(p - vec2(0.0, -66.0), -uTilt) + vec2(0.0, -66.0);
  vec3 n;

  bool her = uDollMode < 0.5 || uDollMode > 1.5;
  // ── her hair, behind everything ──
  if (her) {
    float sx = 15.5 + 2.6 * smoothstep(-84.0, -60.0, q.y);
    float sway = sin(t * 0.9) * 1.4 * smoothstep(-70.0, -47.0, q.y);
    float bottom = -47.0 + 2.0 * sin(q.x * 0.9 + t) + 1.5 * sin(q.x * 2.3);
    float hd = max(max(abs(q.x - sway) - sx, q.y - bottom), sdEll(q - vec2(0.0, -86.0), vec2(17.8, 16.6)) * step(q.y, -86.0));
    hd = max(hd, -q.y - 103.0);
    if (hd < px) {
      float strand = q.x * 3.2 + sin(q.y * 0.3) * 1.5;
      vec3 hn = normalize(vec3(q.x / 30.0, -0.2, 0.9));
      put(hd, hairC(q, hn, strand) * 0.8);
    }
  }
  // ── legs: thin, bare, toes pointing down ──
  for (int i = 0; i < 2; i++) {
    if (!her) break;
    float s = i == 0 ? -1.0 : 1.0;
    float x = s * 4.6, sw = i == 0 ? uLegs.x : uLegs.y;
    vec2 a = vec2(x, -33.0), kn = vec2(x + s * 0.5 + sw * 0.4, -19.0), ft = vec2(x + sw * 1.4, -3.4);
    vec3 n1, n2, n3;
    float d1 = cap(p, a, kn, 1.75, 1.35, n1), d2 = cap(p, kn, ft, 1.3, 0.95, n2);
    float d3 = sdEll(p - vec2(ft.x, -1.4), vec2(1.7, 2.8));
    float d = min(min(d1, d2), d3);
    if (d < px) {
      vec3 ln = d1 < d2 ? n1 : n2;
      if (d3 < min(d1, d2)) ln = normalize(vec3((p.x - ft.x) / 1.7, (p.y + 1.4) / 4.0, 0.8));
      vec3 c = skin(ln, p, 1.0);
      // knobbly knees, the shadow of the gown on the thighs
      c *= 1.0 - 0.25 * smoothstep(1.8, 0.0, length(p - kn) - 0.6);
      c *= 1.0 - 0.6 * smoothstep(-28.0, -33.0, p.y);
      // toes
      for (int k = -1; k <= 1; k++) { float tx = ft.x + float(k) * 0.9; c *= 1.0 - 0.35 * smoothstep(0.22, 0.0, abs(p.x - tx - 0.45)) * step(-0.6, p.y); }
      put(d, c);
    }
  }
  // ── the nightgown ──
  if (her) {
    float d = gownSD(p);
    if (d < px * 2.0) {
      float v = clamp((p.y + 63.0) / 31.0, 0.0, 1.0);
      float hw = mix(9.0, 19.0, pow(v, 1.3));
      float ex = clamp((p.x - uDrift * v * v) / hw, -1.0, 1.0);
      // folds falling from the yoke
      float fold = sin(ex * 9.0 + v * 1.5 + uDrift * 0.4) * smoothstep(0.1, 0.6, v);
      vec3 gn = normalize(vec3(ex * 0.8 + fold * 0.35, -0.15, sqrt(max(1.0 - ex * ex, 0.0)) * 0.9 + 0.2));
      float dirt = smoothstep(0.4, 1.0, v) * 0.45 + 0.35 * smoothstep(0.55, 0.75, fbm(p * 0.35 + 3.0));
      vec3 c = cloth(p, gn, clamp(dirt, 0.0, 0.85));
      c *= 1.0 - 0.35 * smoothstep(0.6, 1.0, -fold) * smoothstep(0.1, 0.6, v);
      // old stains, one of them darker and reddish
      c = mix(c, c * lin(vec3(0.6, 0.45, 0.35)), smoothstep(1.0, 0.0, length((p - vec2(6.0, -38.0)) / vec2(4.0, 2.6))) * 0.6);
      c = mix(c, c * lin(vec3(0.55, 0.3, 0.3)), smoothstep(1.0, 0.0, length((p - vec2(-8.0, -44.0)) / vec2(2.4, 3.2))) * 0.5);
      // a small tear showing the dark behind
      float tear = sdEll(rot(p - vec2(-4.0, -40.0), 0.5), vec2(0.5, 2.2));
      c *= 1.0 - 0.85 * smoothstep(0.2, -0.2, tear);
      // light through the thin hem
      c += lin(vec3(0.7, 1.0, 0.8)) * 0.12 * smoothstep(-36.0, -32.0, p.y);
      // the shadow of her head and hair on the yoke
      c *= 1.0 - 0.45 * smoothstep(-56.0, -63.0, p.y);
      put(d, c);
      // loose threads off the torn hem
      float th = abs(p.x - floor(p.x / 3.0) * 3.0 - 1.5 - sin(p.y * 0.8 + p.x) * 0.3);
      float hem = gownSD(p - vec2(0.0, -2.2));
      if (d > 0.0 && hem < 0.0 && th < 0.12 && hash(vec2(floor(p.x / 3.0), 7.0)) < 0.5) glowAdd(lin(vec3(0.75, 0.72, 0.62)), 0.45);
    }
    // the lace collar: a row of little scallops, holes in them
    float lc = 1e9;
    for (int k = -3; k <= 3; k++) { vec2 c0 = vec2(float(k) * 2.6, -61.5); lc = min(lc, max(length(p - c0) - 1.6, -(p.y - c0.y))); }
    if (lc < px) {
      vec3 c = cloth(p, normalize(vec3(0.0, -0.4, 0.9)), 0.05) * 1.1;
      float holes = step(length(fract(p * 1.6) - 0.5), 0.18);
      c *= 1.0 - 0.6 * holes;
      put(lc, c);
    }
    // the ribbon: a little bow, dark red velvet
    vec2 rq = p - vec2(0.0, -59.0);
    float bow = min(sdTri(rq, vec2(-2.2, -1.6), vec2(0.0, 0.0), vec2(-2.2, 1.0)), sdTri(rq, vec2(2.2, -1.6), vec2(0.0, 0.0), vec2(2.2, 1.0)));
    bow = min(bow, length(rq) - 0.7);
    float tails = min(sdSeg(rq, vec2(-0.3, 0.3), vec2(-1.3, 3.0), 0.35, 0.25, n.x), sdSeg(rq, vec2(0.3, 0.3), vec2(1.2, 3.1), 0.35, 0.25, n.x));
    bow = min(bow, tails);
    if (bow < px) put(bow, light(lin(vec3(0.3, 0.03, 0.07)), normalize(vec3(rq / 4.0, 0.9)), 20.0, 0.3, 0.3, lin(vec3(0.6, 0.1, 0.1)), 1.0));
  }
  // ── arms: long and thin; one dangles, the other holds the doll ──
  if (her) {
    float sw = uSwing;
    vec3 n1, n2;
    // left (dangling)
    vec2 a = vec2(-9.0, -60.0), e = vec2(-12.4, -48.5), h = vec2(-13.0 + sw, -34.5);
    float d1 = cap(p, a, e, 1.5, 1.05, n1), d2 = cap(p, e, h, 1.05, 0.8, n2);
    float d = min(d1, d2);
    // long fingers
    float fd = 1e9;
    for (int k = -1; k <= 1; k++) {
      float fk = float(k);
      vec2 f0 = h + vec2(fk * 0.5, 0.4), f1 = h + vec2(fk * 0.9 + sw * 0.1, 3.4), f2 = h + vec2(fk * 1.2 + sw * 0.15, 5.6);
      float hh; fd = min(fd, min(sdSeg(p, f0, f1, 0.42, 0.34, hh), sdSeg(p, f1, f2, 0.34, 0.22, hh)));
    }
    fd = min(fd, sdEll(p - h - vec2(0.0, 0.6), vec2(1.2, 1.5)));
    if (min(d, fd) < px) {
      vec3 an = d1 < d2 ? n1 : n2;
      if (fd < d) an = normalize(vec3(0.0, -0.2, 0.9));
      vec3 c = skin(an, p, 1.0);
      c *= 1.0 - 0.35 * smoothstep(1.4, 0.0, length(p - e) - 0.4);   // the elbow
      put(min(d, fd), c);
    }
    // right (holding the doll by a tentacle)
    a = vec2(9.0, -60.0); e = vec2(13.0, -50.5); h = vec2(13.6, -38.5);
    d1 = cap(p, a, e, 1.5, 1.05, n1); d2 = cap(p, e, h, 1.05, 0.8, n2);
    d = min(d1, d2);
    float hd = sdEll(p - h - vec2(0.2, 0.6), vec2(1.3, 1.6));
    if (min(d, hd) < px) {
      vec3 an = d1 < d2 ? n1 : n2;
      if (hd < d) an = normalize(vec3((p - h) / 2.0, 0.8));
      vec3 c = skin(an, p, 1.0);
      c *= 1.0 - 0.35 * smoothstep(1.4, 0.0, length(p - e) - 0.4);
      put(min(d, hd), c);
    }
  }
  // ── the doll: a stitched rag Ilu, an X for an eye, dangling ──
  if (uDollMode < 1.5) {
    vec2 dp = rot(p - uDollPos, -uDollA);
    float ten;
    float hold = sdSeg(dp, vec2(0.0, 0.0), vec2(0.0, 4.0), 0.5, 0.45, ten);
    vec2 bq = dp - vec2(0.0, 8.2);
    float bd = length(bq) - 4.5;
    float legs = 1e9;
    for (int k = 0; k < 4; k++) {
      float x = -2.4 + float(k) * 1.6;
      float hh; legs = min(legs, sdSeg(dp, vec2(x, 11.6), vec2(x * 1.25 + sin(uT * 2.0 + float(k)) * 0.8, 16.4), 0.62, 0.4, hh));
    }
    float dd = min(min(hold, bd), legs);
    if (dd < px) {
      vec3 dn = normalize(vec3(bq / 5.0, 0.8));
      if (bd > min(hold, legs)) dn = normalize(vec3(0.0, -0.2, 0.9));
      vec3 alb = lin(vec3(0.78, 0.45, 0.6)) * (0.8 + 0.25 * noise(dp * 3.0));
      vec3 c = light(alb, dn, 10.0, 0.05, 0.4, lin(vec3(0.8, 0.4, 0.5)), 1.0);
      // a seam round it, stitched in cream
      float seam = abs(bq.x * 0.9 + bq.y * 0.3);
      c *= 1.0 - 0.4 * smoothstep(0.3, 0.0, seam) * step(bd, 0.0);
      c = mix(c, lin(vec3(0.94, 0.9, 0.82)), smoothstep(0.22, 0.05, abs(seam - 0.0)) * step(0.5, fract(bq.y * 1.2)) * step(bd, 0.0) * 0.8);
      // the X eye, and a button where the other one was
      vec2 ex = bq - vec2(-1.0, -1.2);
      float xx = min(abs(ex.x - ex.y), abs(ex.x + ex.y)) * step(max(abs(ex.x), abs(ex.y)), 1.3);
      c = mix(c, lin(vec3(0.08, 0.02, 0.05)), smoothstep(0.3, 0.12, xx) * step(max(abs(ex.x), abs(ex.y)), 1.3));
      float btn = length(bq - vec2(1.9, -1.0)) - 0.95;
      if (btn < 0.0) { c = light(lin(vec3(0.1, 0.1, 0.12)), normalize(vec3((bq - vec2(1.9, -1.0)) * 0.6, 1.0)), 60.0, 0.8, 0.0, vec3(0.0), 1.0); c *= 1.0 - 0.6 * step(length(abs(bq - vec2(1.9, -1.0)) - vec2(0.3)), 0.15); }
      // a stitched mouth
      float sm = abs(bq.y - 2.4 + 0.25 * bq.x * bq.x * 0.1);
      c = mix(c, lin(vec3(0.93, 0.88, 0.8)), smoothstep(0.2, 0.05, sm) * step(abs(bq.x), 2.2) * step(0.5, fract(bq.x * 1.4)));
      put(dd, c);
    }
  }
  // ── the head ──
  if (her) {
    float d = headSD(q);
    if (d < px * 2.0) {
      vec2 g = normalize(vec2(headSD(q + vec2(0.05, 0.0)) - headSD(q - vec2(0.05, 0.0)), headSD(q + vec2(0.0, 0.05)) - headSD(q - vec2(0.0, 0.05))) + 1e-5);
      vec3 hn = nrm(g, d, 12.0);
      vec3 c = skin(hn, q, 1.0);
      // veins under the thin skin of the cranium
      vec2 w = q + 2.0 * vec2(fbm(q * 0.12), fbm(q * 0.12 + 5.0));
      float vein = smoothstep(0.05, 0.0, abs(fbm(w * 0.28) - 0.5)) * smoothstep(-74.0, -92.0, q.y);
      c = mix(c, lin(vec3(0.42, 0.48, 0.8)), vein * 0.5);
      // sunken sockets, hollow cheeks, a grey pallor round the mouth
      for (int i = 0; i < 2; i++) {
        float s = i == 0 ? -1.0 : 1.0;
        vec2 eq = rot(q - vec2(s * 6.6, -82.0), s * 0.45);
        float so = sdEll(eq, vec2(5.4, 8.3) * uWide);
        c *= 1.0 - 0.3 * smoothstep(1.8, -0.6, so);
        c *= 1.0 - 0.2 * smoothstep(3.0, 0.0, length((q - vec2(s * 7.0, -71.0)) / vec2(3.0, 4.0)) - 0.6);
      }
      // the eyes: huge, black, wet; a red pinprick in each, wider when she speaks
      for (int i = 0; i < 2; i++) {
        float s = i == 0 ? -1.0 : 1.0;
        vec2 eq = rot(q - vec2(s * 6.6, -82.0), s * 0.45) / uWide;
        float ed = sdEll(eq, vec2(4.6, 7.4));
        // the lid's dark rim
        c = mix(c, lin(vec3(0.3, 0.26, 0.36)), smoothstep(0.5, 0.1, abs(ed - 0.2)) * 0.6);
        if (ed < 0.3) {
          vec2 e2 = eq / vec2(4.6, 7.4); float ee = clamp(length(e2), 0.0, 1.0);
          vec3 en = normalize(vec3(e2 * 0.75, sqrt(max(1.0 - ee * ee, 0.0)) + 0.25));
          vec3 ec = lin(vec3(0.008, 0.006, 0.014));
          // something moving deep in them
          ec += lin(vec3(0.25, 0.2, 0.4)) * 0.18 * fbm(eq * 0.6 + vec2(t * 0.2, 0.0)) * smoothstep(1.0, 0.3, ee);
          // the spotlight's cone reflected, a curved sheen across the top
          ec += lin(vec3(0.6, 1.0, 0.8)) * 0.35 * smoothstep(0.2, 0.0, abs(length(e2 - vec2(0.0, 0.9)) - 0.75)) * step(e2.y, 0.1);
          // the pinprick, following you
          vec2 pp = eq - vec2(0.4 * s, 1.2) - uLook;
          float pr = length(pp);
          ec += vec3(1.0, 0.08, 0.06) * (smoothstep(0.7, 0.25, pr) * 1.8 + exp(-pr * 3.0) * 0.25);
          // wet highlights
          ec += vec3(1.0) * pow(max(dot(en, normalize(vec3(-0.35, -0.55, 0.75))), 0.0), 120.0) * 1.4;
          ec += vec3(1.0) * 0.8 * smoothstep(1.0, 0.6, length((eq - vec2(-1.6, -3.4)) / vec2(1.2, 1.8)));
          ec += vec3(1.0) * 0.4 * smoothstep(0.5, 0.2, length(eq - vec2(1.4, 3.8)));
          c = mix(c, ec, clamp(0.5 - ed * uWide / px, 0.0, 1.0));
        }
      }
      // no nose: two slits
      for (int i = 0; i < 2; i++) {
        float s = i == 0 ? -1.0 : 1.0;
        float ns = sdSeg(q, vec2(s * 0.9, -73.2), vec2(s * 0.6, -71.6), 0.22, 0.18, n.x);
        c *= 1.0 - 0.7 * smoothstep(0.2, -0.1, ns);
      }
      // the mouth: small and dark, opening with the words, tiny sharp teeth
      float mo = clamp(uMouth, 0.0, 1.0);
      float mh = 0.5 + mo * 3.6, mw = 2.6 + mo * 1.2;
      vec2 mq = q - vec2(0.0, -67.4 + mh * 0.25);
      float md = sdEll(mq, vec2(mw, mh));
      c = mix(c, c * lin(vec3(0.72, 0.7, 0.78)), smoothstep(1.0, 0.0, md));   // grey lips
      if (md < 0.0) {
        vec3 mc = mix(lin(vec3(0.12, 0.03, 0.05)), lin(vec3(0.015, 0.005, 0.01)), smoothstep(-0.2, -1.2, md));
        // teeth along the top, needle-thin
        if (mo > 0.2) {
          float tx = fract((mq.x + mw) / (mw * 0.36)) - 0.5;
          float ty = (mq.y + mh * 0.85) / 1.3;
          float tooth = step(abs(tx), 0.32 * (1.0 - ty)) * step(0.0, ty) * step(ty, 1.0);
          mc = mix(mc, lin(vec3(0.93, 0.9, 0.84)), tooth * smoothstep(0.2, 0.4, mo));
        }
        c = mix(c, mc, clamp(-md / px, 0.0, 1.0));
      }
      put(d, c);
    }
    // ── her hair over the front: a parted fringe, strands down past her face ──
    float fr = 1e9;
    for (int i = 0; i < 2; i++) {
      float s = i == 0 ? -1.0 : 1.0;
      vec2 hq = vec2(q.x * s, q.y);
      // a curtain from the parting, round the temple and down
      float inner = 12.6 + 1.2 * smoothstep(-90.0, -70.0, hq.y) - 3.0 * smoothstep(-92.0, -100.0, hq.y) + 0.6 * sin(hq.y * 0.4 + t * 0.7 + s);
      float outer = 15.8 + 0.4 * smoothstep(-84.0, -66.0, hq.y);
      float band = max(max(inner - hq.x, hq.x - outer), max(-99.0 + (16.0 - hq.x) * 0.0 - hq.y, hq.y + 66.0));
      // a thin part over the top, falling to the curtains
      float top = max(sdEll(hq - vec2(0.0, -86.0), vec2(16.9, 15.6)), -sdEll(hq - vec2(0.0, -86.6), vec2(16.0, 14.8)));
      top = max(top, -(hq.x - 6.0));
      fr = min(fr, min(band, top));
    }
    // hanging strands, long, past the shoulders
    float st = 1e9;
    for (int k = 0; k < 6; k++) {
      float s = k < 3 ? -1.0 : 1.0, fk = mod(float(k), 3.0);
      float x = s * (12.6 + fk * 1.2);
      float u = clamp((q.y + 70.0) / (22.0 + fk * 2.0), 0.0, 1.0);
      float cx = x + sin(t + float(k)) * 1.2 * u + sin(t * 0.8 + float(k)) * 0.8 * u * u;
      float dd = abs(q.x - cx) - mix(0.55, 0.18, u);
      dd = max(dd, max(-70.0 - q.y, q.y - (-48.0 - fk * 2.0)));
      st = min(st, dd);
    }
    fr = min(fr, st);
    if (fr < px) {
      float strand = q.x * 4.0 + sin(q.y * 0.5) * 1.2 + noise(vec2(q.x * 3.0, 0.0)) * 3.0;
      vec3 hn = normalize(vec3(q.x / 22.0, (q.y + 86.0) / 30.0, 0.85));
      put(fr, hairC(q, hn, strand));
    }
  }
  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;
