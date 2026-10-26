// The cicada of the Cicada remix, painted per pixel (Update 6.15). The same
// bug as lib/rave/cicada.js (front view, standing on its hind legs, feet at
// 0,0, about 100 tall) in its three forms - the earth-brown nymph, the green
// adult hardening and darkening, the black-and-emerald last form - and as the
// amber shells they leave behind, split down the back.
import { FRAG as DJ } from "./djShader";
const COMMON = DJ.slice(DJ.indexOf("const float PI"), DJ.indexOf("// ---------- materials ----------"));

export const CBOX = { x0: -78, y0: -134, w: 156, h: 140 };

export const KFRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uT, uBass, uHueA, uHueB, uForm, uHard, uPads, uWing, uRub, uDip, uMid, uHead, uChirp, uShell, uSplit, uGlowIn;
uniform vec2 uWingA;          // each wing's angle (left, right)
uniform vec4 uFL, uFR;        // front legs: knee x,y and claw x,y
${COMMON}

vec3 B0, B1, B2, EYE0, EYE1, EYE2, VEIN, LINEC;
float FINAL, NYMPH, ADULT;

float segD(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
float segH(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; return clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); }
// chitin: hard, glossy, a deep colour with a bright edge
vec3 chitin(vec3 base, vec3 n, float gloss) {
  vec3 c = light(base, n, mix(30.0, 110.0, gloss), mix(0.25, 1.1, gloss), 0.2, base, 1.0);
  if (FINAL > 0.5) {   // the last form's emerald sheen, shifting
    float ir = 0.5 + 0.5 * sin(n.x * 4.0 + n.y * 3.0 + uT * 0.8);
    c += lin(vec3(0.15, 0.85, 0.55)) * 0.35 * pow(1.0 - n.z, 1.5) * ir;
  }
  return c;
}
// an amber husk: hollow, see-through, lit from behind
vec3 husk(vec3 n, vec2 p) {
  vec3 alb = lin(vec3(0.78, 0.55, 0.28)) * (0.8 + 0.3 * noise(p * 0.8));
  vec3 c = light(alb, n, 60.0, 0.7, 0.9, lin(vec3(1.0, 0.7, 0.3)), 1.0);
  c += lin(vec3(1.0, 0.75, 0.4)) * 0.3 * pow(1.0 - n.z, 1.2);
  return c;
}
vec3 partC(vec3 base, vec3 n, vec2 p, float gloss) { return uShell > 0.5 ? husk(n, p) : chitin(base, n, gloss); }

// a leg segment: thick chitin tube with a ridge down it
void leg(vec2 p, vec2 a, vec2 b, float r0, float r1, vec3 col) {
  float h = segH(p, a, b);
  float r = mix(r0, r1, h);
  float d = segD(p, a, b) - r;
  if (d > px) return;
  vec2 ba = normalize(b - a), nn = vec2(-ba.y, ba.x);
  float e = clamp(dot(p - a, nn) / r, -1.0, 1.0);
  vec3 n = normalize(vec3(nn * e, sqrt(max(1.0 - e * e, 0.0)) + 0.1));
  vec3 c = partC(col, n, p, NYMPH > 0.5 ? 0.25 : 0.7);
  c *= 1.0 - 0.25 * smoothstep(0.15, 0.0, abs(e + 0.2));   // the ridge's shadow line
  put(d, c);
}

// one wing in its own frame: the root at 0,0, reaching along +y
float wingShape(vec2 q, float L0, float wd, out float v) {
  v = q.y / L0;
  float s = sin(3.14159 * clamp(v, 0.0, 1.0));
  float cx = -wd * 0.38 * s - wd * 0.15 * v;
  float hw = wd * (0.18 + 0.75 * pow(s, 0.7)) * (1.0 - 0.15 * v);
  float wob = (1.0 - uWing) * 3.0 * sin(v * 9.0 + q.x);
  float d = abs(q.x - cx - wob) - hw;
  d = max(d, -q.y);
  d = max(d, q.y - L0);
  return d;
}
void wing(vec2 p, float s, float ang) {
  vec2 q = rot(p - vec2(s * 7.0, -64.0), -(3.14159 - ang));
  float len = 18.0 + 44.0 * uWing;
  for (int k = 0; k < 2; k++) {
    float L0 = k == 0 ? len * 0.72 : len;
    float wd = k == 0 ? 8.0 : 10.5;
    float al = k == 0 ? 0.55 : 0.85;
    float v;
    float d = wingShape(q, L0, wd, v);
    if (d > px * 2.0) continue;
    // glass: clear, a thin-film shimmer, darker and green on the last form
    float sCen = sin(3.14159 * clamp(v, 0.0, 1.0));
    float cx = -wd * 0.38 * sCen - wd * 0.15 * v;
    float u = (q.x - cx) / max(wd, 1.0);
    vec3 film = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + u * 1.5 + v * 0.8 + uT * 0.05));
    vec3 c = mix(lin(vec3(0.85, 1.0, 0.9)), lin(vec3(0.12, 0.35, 0.22)), FINAL) * 0.45;
    c += film * 0.12 * (1.0 - FINAL * 0.6);
    c += mix(rimA, rimB, 0.5) * 0.15;
    // veins: the thick leading edge, the long veins, a few cross veins
    float lead = abs(q.x - (cx - wd * (0.18 + 0.75 * pow(sCen, 0.7)) * (1.0 - 0.15 * v)));
    float veins = smoothstep(0.9, 0.3, lead);
    for (int j = 1; j <= 5; j++) {
      float fj = float(j) / 6.0;
      float vx = cx + wd * (fj * 1.5 - 0.75) * (0.2 + 0.8 * sCen) - wd * 0.1 * fj * v;
      veins = max(veins, smoothstep(0.35, 0.1, abs(q.x - vx)) * step(0.08, v) * step(v, 0.95) * 0.8);
    }
    veins = max(veins, smoothstep(0.35, 0.1, abs(q.y - L0 * (0.6 + 0.05 * u))) * 0.7);
    veins = max(veins, smoothstep(0.35, 0.1, abs(q.y - L0 * (0.82 - 0.04 * u))) * 0.6);
    vec3 vc = mix(VEIN, lin(vec3(0.49, 1.0, 0.69)) * (1.2 + uBass * 1.5), FINAL);
    if (uShell > 0.5) vc = lin(vec3(0.75, 0.55, 0.3));
    c = mix(c, vc, veins * (uShell > 0.5 ? 0.5 : 1.0));
    float a = min(1.0, al * 1.15) * (0.55 + 0.45 * veins) * (uShell > 0.5 ? 0.55 : 1.0);
    if (FINAL > 0.5 && uShell < 0.5) glowAdd(lin(vec3(0.49, 1.0, 0.69)), veins * 0.25 * (0.6 + uBass));
    // a see-through membrane: partly covering what's behind
    float cov = clamp(0.5 - d / px, 0.0, 1.0) * a;
    acc.rgb = c * cov + acc.rgb * (1.0 - cov); acc.a = cov + acc.a * (1.0 - cov);
  }
}

void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uBox.x + f.x * uBox.z, uBox.y + (1.0 - f.y) * uBox.w);
  px = uBox.z / uRes.x;
  rimA = lin(hsl2rgb(uHueA, 1.0, 0.62)) * 0.9;
  rimB = lin(hsl2rgb(uHueB, 1.0, 0.68)) * 0.9;
  NYMPH = step(uForm, 0.5); ADULT = step(0.5, uForm) * step(uForm, 1.5); FINAL = step(1.5, uForm);
  float hd = uHard;
  if (NYMPH > 0.5) { B0 = lin(vec3(0.77, 0.60, 0.37)); B1 = lin(vec3(0.54, 0.38, 0.21)); B2 = lin(vec3(0.24, 0.16, 0.08)); EYE0 = lin(vec3(0.96, 0.93, 0.87)); EYE1 = lin(vec3(0.72, 0.79, 0.66)); VEIN = lin(vec3(0.48, 0.35, 0.19)); }
  else if (ADULT > 0.5) {
    B0 = mix(lin(vec3(0.91, 1.0, 0.91)), lin(vec3(0.49, 0.76, 0.35)), hd);
    B1 = mix(lin(vec3(0.74, 0.94, 0.77)), lin(vec3(0.24, 0.49, 0.19)), hd);
    B2 = mix(lin(vec3(0.54, 0.78, 0.6)), lin(vec3(0.05, 0.09, 0.05)), hd);
    EYE0 = mix(lin(vec3(1.0, 0.82, 0.78)), lin(vec3(1.0, 0.42, 0.31)), hd); EYE1 = mix(lin(vec3(0.94, 0.53, 0.47)), lin(vec3(0.75, 0.16, 0.11)), hd);
    VEIN = mix(lin(vec3(0.91, 1.0, 0.94)), lin(vec3(0.72, 0.85, 0.42)), hd);
  } else { B0 = lin(vec3(0.23, 0.54, 0.35)); B1 = lin(vec3(0.05, 0.16, 0.10)); B2 = lin(vec3(0.01, 0.025, 0.015)); EYE0 = lin(vec3(1.0, 0.88, 0.63)); EYE1 = lin(vec3(1.0, 0.35, 0.13)); VEIN = lin(vec3(0.49, 1.0, 0.69)); }
  vec3 legC = B2 * 1.3 + B1 * 0.3;
  float vib = uChirp > 0.0 ? sin(uT * 90.0) * 0.8 * uChirp : 0.0;

  // ── the wings, behind everything ──
  if (NYMPH < 0.5 && uWing > 0.01) { wing(p, -1.0, uWingA.x); wing(p, 1.0, uWingA.y); }

  // ── hind legs ──
  for (int i = 0; i < 2; i++) {
    float s = i == 0 ? -1.0 : 1.0;
    vec2 kn = vec2(s * (17.0 + uDip * 2.0), -15.0 + uDip * 2.0);
    leg(p, vec2(s * 9.0, -30.0), kn, NYMPH > 0.5 ? 2.3 : 1.9, NYMPH > 0.5 ? 1.8 : 1.5, legC);
    leg(p, kn, vec2(s * 15.0, -1.0), NYMPH > 0.5 ? 1.6 : 1.3, NYMPH > 0.5 ? 1.2 : 1.0, legC);
    leg(p, vec2(s * 15.0, -1.0), vec2(s * 19.5, 0.2), 1.0, 0.6, legC);
    // spines down the shin
    for (int k = 0; k < 3; k++) {
      float u = 0.25 + float(k) * 0.25;
      vec2 b = mix(kn, vec2(s * 15.0, -1.0), u);
      leg(p, b, b + vec2(s * 1.8, -0.4), 0.45, 0.1, legC);
    }
  }

  // ── the abdomen: segments, the plates beneath, on adults the tymbal covers ──
  {
    float arx = (NYMPH > 0.5 ? 13.5 : 12.0) * (1.0 + vib * 0.05), ary = NYMPH > 0.5 ? 17.0 : 19.0;
    vec2 aq = p - vec2(0.0, -38.0);
    float d = sdEll(aq, vec2(arx, ary));
    if (d < px * 2.0) {
      vec2 e2 = aq / vec2(arx, ary); float ee = clamp(length(e2), 0.0, 1.0);
      vec3 n = normalize(vec3(e2 * 0.95, sqrt(max(1.0 - ee * ee, 0.0)) + 0.1));
      // ring by ring: each segment overlapping the one below
      float sy = (p.y + 50.0) / 4.6, si = floor(sy), sf = fract(sy);
      n = normalize(n + vec3(0.0, (sf - 0.5) * 0.7, 0.0) * step(-0.5, sy) * step(sy, 6.0));
      vec3 base = mix(B1, B0, smoothstep(1.0, 0.0, ee) * 0.5);
      if (ADULT > 0.5) base = mix(base, B2, smoothstep(0.75, 0.92, abs(e2.x)) * hd);   // dark flanks
      vec3 c = partC(base, n, p, NYMPH > 0.5 ? 0.3 : 0.75);
      c *= 1.0 - 0.55 * smoothstep(0.18, 0.0, sf) * step(-0.5, sy) * step(sy, 6.0);
      // the nymph is caked in earth
      if (NYMPH > 0.5 && uShell < 0.5) c = mix(c, lin(vec3(0.3, 0.2, 0.1)), smoothstep(0.55, 0.8, fbm(p * 0.35)) * 0.6);
      // the tymbal covers at the top, shimmering when it sings
      if (NYMPH < 0.5) {
        for (int i = 0; i < 2; i++) {
          float s = i == 0 ? -1.0 : 1.0;
          float td = sdEll(rot(p - vec2(s * 5.6, -52.0), s * 0.4), vec2(5.4, 3.4));
          if (td < 0.0) {
            vec3 tn = normalize(vec3((p - vec2(s * 5.6, -52.0)) / 7.0 + vec2(sin(uT * 90.0 + s) * uChirp * 0.3, 0.0), 0.8));
            vec3 tc = partC(mix(B0, vec3(0.9), 0.15), tn, p, 1.0);
            tc += mix(rimA, rimB, 0.5) * uChirp * 0.6;
            c = mix(c, tc, smoothstep(0.0, -0.6, td));
          }
        }
      }
      if (FINAL > 0.5 && uShell < 0.5) c += lin(vec3(0.24, 0.86, 0.55)) * 0.25 * smoothstep(0.4, 1.0, sin(e2.x * 2.0 - e2.y + uT * 0.8));
      put(d, c);
    }
  }
  // ── middle legs ──
  for (int i = 0; i < 2; i++) {
    float s = i == 0 ? -1.0 : 1.0, sw = uMid * s;
    vec2 a = vec2(s * 12.0, -52.0), k = vec2(s * 23.0, -45.0 + sw * 3.0), b = vec2(s * 25.0 + sw, -28.0);
    leg(p, a, k, NYMPH > 0.5 ? 1.7 : 1.4, 1.3, legC);
    leg(p, k, b, 1.2, 0.8, legC);
  }
  // ── the thorax: the collar and the mesonotum with its W ──
  {
    vec2 tq = p - vec2(0.0, -60.0);
    vec2 tr = NYMPH > 0.5 ? vec2(16.5, 11.0) : vec2(15.5, 10.0);
    float d = sdEll(tq, tr);
    if (d < px * 2.0) {
      vec2 e2 = tq / tr; float ee = clamp(length(e2), 0.0, 1.0);
      vec3 n = normalize(vec3(e2 * 0.9, sqrt(max(1.0 - ee * ee, 0.0)) + 0.1));
      vec3 c = partC(mix(B1, B0, 0.5 * (1.0 - ee)), n, p, NYMPH > 0.5 ? 0.3 : 0.85);
      // the pronotum's raised collar along the front
      c *= 1.0 - 0.35 * smoothstep(0.35, 0.0, abs(length(e2 * vec2(1.0, 1.15) - vec2(0.0, -0.15)) - 0.72));
      if (NYMPH < 0.5) {
        // the W
        vec2 w = vec2(abs(tq.x), tq.y);
        float wd = min(segD(w, vec2(8.0, -4.0), vec2(4.0, 4.0)), segD(w, vec2(4.0, 4.0), vec2(0.0, -1.0)));
        vec3 wc = FINAL > 0.5 ? lin(vec3(0.49, 1.0, 0.69)) * (1.2 + uBass) : lin(vec3(0.04, 0.05, 0.04));
        c = mix(c, wc, smoothstep(0.8, 0.3, wd) * (FINAL > 0.5 ? 1.0 : 0.25 + 0.7 * hd) * (uShell > 0.5 ? 0.3 : 1.0));
        if (FINAL > 0.5 && uShell < 0.5) glowAdd(lin(vec3(0.49, 1.0, 0.69)), smoothstep(1.6, 0.0, wd) * 0.3);
      }
      put(d, c);
    }
    // the nymph's wing pads, growing through its life
    if (NYMPH > 0.5 && uPads > 0.02) {
      for (int i = 0; i < 2; i++) {
        float s = i == 0 ? -1.0 : 1.0;
        vec2 pq = rot(p - vec2(s * 12.0, -60.0), -s * (0.5 + uRub * 0.35)) - vec2(0.0, 4.0 * uPads);
        float pd = sdEll(pq, vec2(3.2 * uPads + 0.8, 7.0 * uPads));
        if (pd < px) {
          vec3 n = normalize(vec3(pq / vec2(4.0, 8.0) * 0.8, 0.7));
          vec3 c = partC(lin(vec3(0.35, 0.23, 0.11)), n, p, 0.5);
          c *= 1.0 - 0.5 * smoothstep(0.3, 0.0, abs(pq.x));
          put(pd, c);
        }
      }
    }
  }
  // ── the split down the back: a glowing seam when the new body is inside ──
  if (uSplit > 0.0) {
    float sd = segD(p, vec2(0.0, -84.0), vec2(0.0, -84.0 + uSplit * 34.0)) - (0.6 + uSplit * 0.7);
    if (sd < px) {
      vec3 c = uShell > 0.5 ? lin(vec3(0.12, 0.07, 0.03)) : lin(vec3(0.75, 1.0, 0.8)) * (1.0 + uGlowIn * 1.5);
      put(sd, c);
    }
    if (uShell < 0.5) glowAdd(lin(vec3(0.66, 1.0, 0.7)), exp(-max(sd, 0.0) * 0.4) * uGlowIn * 0.6 * step(0.0, sd));
  }
  // ── the head ──
  {
    vec2 q = rot(p - vec2(0.0, -70.0), -uHead) + vec2(0.0, -70.0);
    vec2 hr = vec2(NYMPH > 0.5 ? 13.0 : 14.0, 8.0);
    vec2 hq = q - vec2(0.0, -76.0);
    float d = sdEll(hq, hr);
    if (d < px * 2.0) {
      vec2 e2 = hq / hr; float ee = clamp(length(e2), 0.0, 1.0);
      vec3 n = normalize(vec3(e2 * 0.9, sqrt(max(1.0 - ee * ee, 0.0)) + 0.1));
      vec3 c = partC(mix(B1, B0, 0.5 * (1.0 - ee)), n, q, NYMPH > 0.5 ? 0.35 : 0.85);
      put(d, c);
    }
    // the striped face and the beak
    vec2 cq = q - vec2(0.0, -70.0);
    float cd = sdEll(cq, vec2(5.6, 6.4));
    if (cd < px) {
      vec2 e2 = cq / vec2(5.6, 6.4);
      vec3 n = normalize(vec3(e2 * 0.7, 0.8));
      n = normalize(n + vec3(0.0, sin((cq.y + 4.0) * 3.3) * 0.35, 0.0));
      vec3 c = partC(B1, n, q, 0.7);
      c *= 1.0 - 0.45 * smoothstep(0.25, 0.0, abs(fract((cq.y + 4.0) / 1.9) - 0.5) - 0.32);
      put(cd, c);
    }
    float bk = segD(q, vec2(0.0, -64.0), vec2(0.0, -57.5)) - 0.8;
    if (bk < px) put(bk, partC(legC, vec3(0.0, 0.0, 1.0), q, 0.6));
    // the great compound eyes, faceted, set wide
    float er = NYMPH > 0.5 ? 5.6 : 7.4;
    for (int i = 0; i < 2; i++) {
      float s = i == 0 ? -1.0 : 1.0;
      vec2 ec = vec2(s * (NYMPH > 0.5 ? 15.0 : 18.5), -78.0);
      vec2 eq = q - ec;
      float d2 = length(eq) - er;
      float gl0 = FINAL > 0.5 ? 0.55 + 0.35 * uBass : NYMPH > 0.5 ? 0.15 : 0.3 * hd;
      if (uShell < 0.5) glowAdd(mix(EYE1, vec3(1.0), 0.2), exp(-max(d2, 0.0) * 0.35) * gl0 * 0.5 * step(0.0, d2));
      if (d2 < px) {
        vec2 e2 = eq / er; float ee = clamp(length(e2), 0.0, 1.0);
        vec3 n = normalize(vec3(e2, sqrt(max(1.0 - ee * ee, 0.0)) + 0.05));
        vec3 c;
        if (uShell > 0.5) c = husk(n, q) * 0.8;
        else {
          // hexagonal facets
          vec2 hx = eq * 2.2 / er * 6.0;
          vec2 r = vec2(1.0, 1.732);
          vec2 a = mod(hx, r) - r * 0.5, b = mod(hx - r * 0.5, r) - r * 0.5;
          vec2 gv = dot(a, a) < dot(b, b) ? a : b;
          float edge = smoothstep(0.32, 0.5, length(gv));
          vec3 alb = mix(EYE0, EYE1, smoothstep(0.0, 1.0, ee));
          c = light(alb, normalize(n + vec3(gv * 0.4, 0.0)), 80.0, 1.0, 0.3, alb, 1.0);
          c *= 1.0 - 0.35 * edge;
          // the dark pseudopupil that seems to look at you
          c *= 1.0 - 0.65 * smoothstep(0.32, 0.12, length(e2 - vec2(-s * 0.1, 0.1)));
          c += EYE1 * gl0 * 0.6;
          c += vec3(1.0) * 0.7 * smoothstep(0.3, 0.15, length(e2 - vec2(-s * 0.35, -0.42)));
        }
        put(d2, c);
      }
    }
    // three ocelli in a triangle between the eyes (13i's threes)
    for (int i = 0; i < 3; i++) {
      vec2 oc = i == 0 ? vec2(0.0, -83.0) : (i == 1 ? vec2(-2.8, -80.0) : vec2(2.8, -80.0));
      float on = uShell > 0.5 ? 0.0 : FINAL > 0.5 ? 0.9 + 0.1 * sin(uT * 3.0) : NYMPH > 0.5 ? 0.15 : 0.45;
      vec3 oc_ = FINAL > 0.5 ? lin(vec3(0.6, 1.0, 0.55)) : lin(vec3(1.0, 0.5, 0.4));
      float od = length(q - oc) - 1.0;
      if (od < px) put(od, light(oc_ * (0.4 + on), normalize(vec3((q - oc) * 0.7, 0.8)), 100.0, 1.2, 0.0, vec3(0.0), 1.0) + oc_ * on);
      glowAdd(oc_, exp(-max(od, 0.0) * 0.9) * on * 0.5 * step(0.0, od));
    }
    // short bristle antennae
    for (int i = 0; i < 2; i++) {
      float s = i == 0 ? -1.0 : 1.0;
      float sw = sin(uT * 2.0 + s) * 1.2;
      leg(q, vec2(s * 6.0, -82.0), vec2(s * 9.5, -88.0), 0.45, 0.35, legC);
      leg(q, vec2(s * 9.5, -88.0), vec2(s * 13.0 + sw, -91.0), 0.35, 0.15, legC);
    }
  }
  // ── the front legs: the digging claws, used for dancing ──
  for (int i = 0; i < 2; i++) {
    float s = i == 0 ? -1.0 : 1.0;
    vec4 F = i == 0 ? uFL : uFR;
    vec2 sh = vec2(s * 13.0, -60.0), kn = F.xy, cl = F.zw;
    leg(p, sh, kn, NYMPH > 0.5 ? 2.8 : 2.1, NYMPH > 0.5 ? 2.3 : 1.7, legC);
    leg(p, kn, cl, NYMPH > 0.5 ? 1.9 : 1.4, NYMPH > 0.5 ? 1.4 : 1.0, legC);
    // the spines of the digging claw
    vec2 dir = normalize(kn - sh), nn = vec2(-dir.y, dir.x) * s;
    for (int k = 0; k < 4; k++) {
      if (NYMPH < 0.5 && k == 3) break;
      float u = 0.25 + float(k) * 0.22;
      vec2 b = mix(sh, kn, u);
      leg(p, b, b + nn * 2.6 + dir * 0.4, 0.55, 0.1, legC);
    }
    vec2 td = normalize(cl - kn);
    for (int k = -1; k <= 1; k++) {
      vec2 tip = cl + rot(td, float(k) * 0.5) * 2.8;
      leg(p, cl, tip, 0.5, 0.1, legC);
    }
  }
  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;
