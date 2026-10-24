"use client";

import { useEffect, useRef } from "react";

// The Oracle as The Watcher (Update 6.09, replacing 5.57's eye in the ring).
// The chamber's window is a ship's porthole now - a steel ring of bolts with
// the gold 13i trim inside - and something enormous is pressed up against
// the far side of the glass. You only ever see part of it:
//   - a slit-pupil gold eye in a slanted almond opening, the brown spots in
//     its iris drifting around the pupil (and swirling while it receives)
//   - scaled skin, folds that ring the eye, a brow ridge, gill slits that
//     breathe
//   - rows of pores that follow its folds and light up with its mood: barely
//     there while it listens, pulsing while it receives, lit while it speaks
// It sways, tilts and drifts, but keeps its eye on you while it moves. Now
// and then it leans in close enough to fog the glass, wipes its eye with a
// second milky lid, or blinks, slowly.
//
// Drawn by one WebGL shader over the whole chamber; the porthole sits on
// anchorRef (the chamber's .oracle-eye-wrap). Look-lab original:
// the "Oracle Eye Lab" artifact, version B.
//
// open: 0..1 (lids). mood: sleeping | listening | receiving | speaking
// onSfx(name): "breathe" | "pulse" | "wet" (lib/oracleSound.js)
// onFail(): no WebGL - the chamber falls back to the old eye

const PUPIL = { sleeping: 0.05, listening: 0.15, receiving: 0.06, speaking: 0.3 };
// how much the pores glow: a steady base, and the pulse that travels along them
const GLOW = {
  sleeping: [0, 0],
  listening: [0.02, 0.1],
  receiving: [0.1, 0.8],
  speaking: [0.85, 0.5],
};
const PULSE = { sleeping: 0.6, listening: 1, receiving: 2.6, speaking: 1.6 };

const VERT = `
attribute vec2 a;
varying vec2 v;
void main() { v = a; gl_Position = vec4(a, 0.0, 1.0); }
`;

export const WATCHER_FRAG = `
precision highp float;
varying vec2 v;
uniform sampler2D uIris;
uniform vec2 uC;           // the porthole's centre, in canvas pixels
uniform float uRad;        // canvas pixels per unit (the glass is WIN units across, radius)
uniform vec3 uF, uR, uU;   // the eye's forward, right and up
uniform float uT, uPupil, uLid, uNict, uBreath, uScale, uTilt, uPx, uPulse, uGlowB, uGlowW;
uniform vec2 uPos;
uniform vec4 uSpot[24];

const float WIN = 0.84;    // the glass
const float EW = 0.60;     // half the eye's width

float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
float veins(vec3 p) { float n = 1.0 - abs(fbm(p) * 2.0 - 1.0); return pow(n, 9.0); }
vec2 h22(vec2 p) { p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
float h21(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
vec2 rot(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }

// the drifting brown spots of the iris: vec4(radius, angle, size, stretch)
float spots(vec2 pos) {
  float m = 0.0;
  for (int i = 0; i < 24; i++) {
    vec4 s = uSpot[i]; vec2 rd = vec2(cos(s.y), sin(s.y)); vec2 d = pos - s.x * rd;
    float dr = dot(d, rd), dt = d.x * rd.y - d.y * rd.x;
    m = max(m, smoothstep(1.0, 0.25, length(vec2(dr / (s.z * s.w), dt / s.z))));
  }
  return m;
}

// cells of scale: returns F2 - F1 (0 at a seam); toC points to the scale's centre
float voro(vec2 x, out vec2 toC, out float id) {
  vec2 n = floor(x), f = fract(x); float F1 = 8.0, F2 = 8.0; toC = vec2(0.0); id = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 o = 0.5 + 0.4 * sin(6.2831 * h22(n + g)); vec2 r = g + o - f; float d = dot(r, r);
    if (d < F1) { F2 = F1; F1 = d; toC = r; id = h21(n + g); } else if (d < F2) { F2 = d; }
  }
  return sqrt(F2) - sqrt(F1);
}

void main() {
  vec2 q = (gl_FragCoord.xy - uC) / uRad;
  float r = length(q); float t = uT; vec3 col = vec3(0.0); float alpha = 0.0;

  if (r < WIN) {
    vec2 w0 = q / WIN;
    vec2 s = rot((w0 - uPos) / uScale * 0.92, uTilt);   // its body: it sways, tilts, leans in
    const float EA = 0.16; vec2 e = rot(s, -EA);           // the almond eye, slanted
    float k = clamp(1.0 - pow(abs(e.x) / EW, 2.0), 0.0, 1.0); float hk = pow(k, 0.62);
    float yU = (0.30 * hk + 0.03 * k) * uLid; float yL = -0.21 * hk * uLid;
    float dl = abs(e.x) < EW ? (e.y > 0.0 ? e.y - yU : yL - e.y) : length(vec2(abs(e.x) - EW, e.y));
    float ry = e.y > 0.0 ? 0.36 : 0.28;
    float ed = length(vec2(e.x / (EW * 1.05), e.y / ry)) - 1.0;      // rings out from the eye
    vec2 gE = normalize(vec2(e.x / (EW * EW), e.y / (e.y > 0.0 ? 0.13 : 0.08)) + 1e-4); vec2 gS = rot(gE, EA);
    vec3 Ld = normalize(vec3(-0.35, 0.5, 0.8));
    float spot = smoothstep(1.35, 0.05, length(w0 - vec2(-0.12, 0.18)));   // our light, through the glass
    vec3 sc;

    if (dl < 0.0) {
      // ---- the eyeball ----
      vec2 p = e / 0.64; float z = sqrt(max(1.0 - dot(p, p), 0.02)); vec3 n = normalize(vec3(p, z));
      vec3 L = vec3(dot(n, uR), dot(n, uU), dot(n, uF)); float th = acos(clamp(L.z, -1.0, 1.0));
      const float IRIS = 0.70;
      vec3 c = mix(vec3(0.26, 0.13, 0.06), vec3(0.07, 0.03, 0.025), smoothstep(0.6, 1.4, th));
      float vn = veins(L * 5.0) * 0.9 + veins(L * 11.0 + 2.0) * 0.4; c += vec3(0.55, 0.07, 0.1) * vn * 0.55;
      c += vec3(0.6, 0.45, 0.15) * 0.25 * smoothstep(IRIS * 1.5, IRIS, th);
      if (th < IRIS * 1.02) {
        float rr = th / IRIS; float ang = atan(L.y, L.x); float pw = uPupil;
        vec2 ip = rr * vec2(cos(ang), sin(ang)); float ps = length(vec2(ip.x / pw, ip.y / 0.94));   // a vertical slit
        float prad = 1.0 / length(vec2(cos(ang) / pw, sin(ang) / 0.94));
        float tr = rr < prad ? 0.0 : mix(0.12, 1.0, clamp((rr - prad) / (1.0 - prad), 0.0, 1.0));
        float ad = ang + t * 0.015; vec2 tp = tr * vec2(cos(ad), sin(ad));
        vec3 ir = texture2D(uIris, 0.5 + 0.5 * tp).rgb;
        float sm = spots(tp) * smoothstep(0.1, 0.2, tr); ir = mix(ir, ir * vec3(0.40, 0.25, 0.13), sm * 0.9);
        // rings of light rolling inward through the iris
        ir *= 1.0 + 0.22 * pow(0.5 + 0.5 * sin(tr * 24.0 + t * 1.5 * uPulse), 5.0) * smoothstep(0.12, 0.3, tr);
        c = mix(c, ir, smoothstep(1.02, 0.96, rr));
        float pm = smoothstep(1.05, 0.95, ps); vec3 deep = vec3(0.006, 0.002, 0.004);
        deep += vec3(0.32, 0.06, 0.02) * smoothstep(1.0, 0.0, ps) * (0.35 + 0.2 * sin(t * 0.8));   // eyeshine, far back
        c = mix(c, deep, pm);
      }
      float lam = 0.45 + 0.75 * max(dot(n, Ld), 0.0); c *= lam * (0.35 + 0.75 * spot);
      vec3 H = normalize(Ld + vec3(0.0, 0.0, 1.0)); c += vec3(1.0) * pow(max(dot(n, H), 0.0), 260.0) * 0.9 * spot;
      // the porthole, reflected in its cornea: you, looking in
      float rc = length((p - vec2(-0.28, 0.26)) * vec2(1.0, 1.25));
      c += vec3(0.9, 0.86, 0.75) * smoothstep(0.014, 0.0, abs(rc - 0.085)) * 0.55 + vec3(0.8, 0.85, 1.0) * smoothstep(0.07, 0.0, rc) * 0.12;
      c *= mix(0.25, 1.0, smoothstep(0.0, 0.1, -dl));      // the lids' shadow
      c *= mix(0.4, 1.0, smoothstep(0.0, 0.18, yU - e.y));
      // the second, milky lid that sweeps across
      float mx = (e.x + EW) / (2.0 * EW); float lead = uNict * 1.12;
      float cov = (1.0 - smoothstep(lead - 0.06, lead, mx)) * step(0.005, uNict);
      vec3 memb = vec3(0.44, 0.47, 0.44) * (0.55 + 0.6 * fbm(vec3(e * vec2(3.0, 16.0), t * 0.1))) * (0.35 + 0.75 * spot);
      c = mix(c, memb, cov * 0.78);
      c += vec3(0.8, 0.85, 0.8) * smoothstep(0.03, 0.0, abs(mx - lead + 0.03)) * step(0.005, uNict) * 0.25 * spot;
      sc = c;
    } else {
      // ---- its skin ----
      vec2 wp = s + 0.07 * (vec2(fbm(vec3(s * 2.6, 1.7)), fbm(vec3(s * 2.6, 7.3))) - 0.5);
      vec2 tc1, tc2; float id1, id2;
      float e1 = voro(wp * 8.0, tc1, id1); float e2 = voro(wp * 19.0, tc2, id2);
      float nearE = smoothstep(0.9, 0.05, ed);
      vec2 nxy = mix(-tc1 * 1.1, -tc2 * 0.9, nearE);
      float seam = mix(smoothstep(0.0, 0.09, e1), smoothstep(0.0, 0.11, e2), nearE);
      float sid = mix(id1, id2, step(0.5, nearE));
      float lidZone = smoothstep(0.22, 0.02, dl); nxy *= mix(1.0, 0.3, lidZone); seam = mix(seam, 1.0, lidZone * 0.65);
      // folds ringing the eye
      float fph = ed * 46.0 + fbm(vec3(s * 3.0, 2.2)) * 7.0; float fa = smoothstep(1.3, 0.08, ed) * (1.0 - lidZone * 0.5);
      nxy += gS * cos(fph) * 0.55 * fa; float crease = smoothstep(0.75, 1.0, sin(fph)) * fa;
      nxy += gS * sin(dl * 95.0 + fbm(vec3(s * 5.0, 4.0)) * 3.0) * 0.3 * lidZone;
      // the brow ridge
      float bc = 0.50 + 0.06 * s.x - 0.10 * s.x * s.x; float bu = (s.y - bc) / 0.13;
      float brow = exp(-bu * bu) * smoothstep(1.5, 0.4, abs(s.x + 0.1)); nxy.y += bu * brow * 0.9;
      // gill slits, breathing
      float gill = 0.0, gillIn = 0.0;
      for (int g = 0; g < 3; g++) {
        float fg = float(g); float yy = s.y + 0.15;
        float gx = -0.98 - fg * 0.14 + 0.22 * yy * yy; float gy = smoothstep(0.55, 0.25, abs(yy));
        float op = 0.010 + 0.022 * (0.5 + 0.5 * sin(t * 1.1 - fg * 0.6)); float dg = abs(s.x - gx);
        gill = max(gill, smoothstep(op + 0.03, op, dg) * gy); gillIn = max(gillIn, smoothstep(op, op * 0.3, dg) * gy);
        nxy.x += sign(s.x - gx) * smoothstep(op + 0.06, op, dg) * gy * 0.8;
      }
      // ---- its pores: they light with its mood ----
      float glow = 0.0;
      // a row back from the outer corner of the eye
      {
        float ly = 0.06 + 0.22 * (s.x - 0.7) + 0.05 * sin(s.x * 3.0); float on = smoothstep(0.62, 0.75, s.x);
        float cell = floor(s.x / 0.085); vec2 dd = vec2((fract(s.x / 0.085) - 0.5) * 0.085, s.y - ly);
        float wave = pow(0.5 + 0.5 * sin(cell * 0.9 + t * 2.2 * uPulse), 6.0);
        glow += smoothstep(0.022, 0.004, length(dd)) * on * (uGlowB + wave * uGlowW);
      }
      // two rows under the eye, riding the crests of the folds that ring it
      {
        float ea2 = atan(e.y / ry, e.x / (EW * 1.05));        // where on the ring of folds
        float crest = smoothstep(0.80, 0.97, sin(fph));         // on top of a fold, not in its crease
        float under = step(e.y, 0.0) * smoothstep(-0.12, -0.4, ea2) * smoothstep(-3.02, -2.74, ea2);
        for (int row = 0; row < 2; row++) {
          float fr = float(row);
          float c0 = 0.24 + fr * 0.33, stp = 0.15 - fr * 0.03;
          float band = exp(-pow((ed - c0) / 0.075, 2.0));
          float cell = floor(ea2 / stp); float along = abs(fract(ea2 / stp) - 0.5);
          float dotm = smoothstep(0.2 - fr * 0.04, 0.05, along) * crest * band * under;
          float wave = pow(0.5 + 0.5 * sin(cell * 0.9 + fr * 1.7 + t * 2.2 * uPulse), 6.0);
          glow += dotm * (0.9 - fr * 0.25) * (uGlowB + wave * uGlowW);
        }
      }
      float sh = h21(floor(wp * 45.0));
      float speck = step(0.94, sh) * (1.0 - seam) * (0.5 + 0.5 * sin(t * 1.3 + sh * 30.0)) * (0.25 + uGlowB + uGlowW * 0.5);
      float cn = fbm(vec3(s * 1.6, 3.3));
      vec3 base = mix(vec3(0.085, 0.075, 0.12), vec3(0.15, 0.145, 0.11), cn) * (0.75 + 0.5 * sid);
      base = mix(base, vec3(0.21, 0.10, 0.13), smoothstep(0.35, 0.0, dl) * 0.7);   // flesh near the eye
      base = mix(base, vec3(0.20, 0.19, 0.21), brow * 0.5);                        // pale bony brow
      base *= mix(0.28, 1.0, seam); base *= 1.0 - crease * 0.45;
      vec3 N = normalize(vec3(nxy * 0.85, 1.0)); float dif = max(dot(N, Ld), 0.0);
      vec3 H = normalize(Ld + vec3(0.0, 0.0, 1.0)); float spc = pow(max(dot(N, H), 0.0), 36.0) * 0.35 * seam;
      float rimL = pow(1.0 - N.z, 2.0);
      sc = base * (0.16 + 1.05 * dif) * (0.22 + 0.95 * spot) + vec3(0.7, 0.75, 0.9) * spc * spot + vec3(0.35, 0.4, 0.9) * rimL * 0.22;
      sc = mix(sc, vec3(0.02, 0.0, 0.01), gill);
      sc += vec3(0.75, 0.10, 0.20) * gillIn * (0.35 + 0.35 * sin(t * 1.1));
      sc += vec3(0.62, 0.68, 1.0) * glow * 1.15 + vec3(0.55, 0.6, 1.0) * speck * 0.25;
      // the lid rim: thick, wet, dark
      float rimZ = smoothstep(0.045, 0.0, dl); sc = mix(sc, vec3(0.11, 0.045, 0.06) * (0.4 + 0.8 * spot), rimZ * 0.85);
      sc += vec3(1.0, 0.9, 0.85) * smoothstep(0.006, 0.0, abs(dl - 0.013)) * 0.35 * spot * (e.y > 0.0 ? 0.45 : 1.0);
    }

    // between the glass and it: murk and drifting motes
    float far = clamp(1.0 - (uScale - 0.85) * 1.4, 0.0, 1.0);
    sc = mix(sc, vec3(0.012, 0.016, 0.045), (1.0 - spot) * 0.55 + far * 0.18);
    for (int i = 0; i < 3; i++) {
      float fi = float(i); vec2 g = w0 * (5.0 + fi * 3.0) + vec2(t * 0.03 * (fi + 1.0), -t * 0.02 * (fi + 1.0) + fi * 7.0);
      vec2 cc = floor(g); vec2 o = h22(cc) - 0.5; float dm = length(fract(g) - 0.5 - o * 0.6);
      sc += vec3(0.6, 0.62, 0.8) * smoothstep(0.06 / (fi + 1.0) + 0.012, 0.0, dm) * step(0.75, h21(cc + 3.0)) * 0.12 * (0.4 + spot);
    }
    // the glass: scratches, a cold reflection, its breath fogging it
    sc += vec3(0.6, 0.65, 0.8) * veins(vec3(w0 * 3.0, 1.0)) * 0.05;
    float band = smoothstep(0.18, 0.0, abs(w0.x + w0.y + 0.55)) * 0.05 + smoothstep(0.04, 0.0, abs(w0.x + w0.y + 0.78)) * 0.05;
    sc += vec3(0.8, 0.85, 1.0) * band;
    float fm = uBreath * smoothstep(0.3, 0.72, fbm(vec3(w0 * 2.5, t * 0.08))) * smoothstep(1.05, 0.15, length(w0 - vec2(0.0, -0.25)));
    sc = mix(sc, vec3(0.26, 0.28, 0.36) * (0.35 + 0.65 * spot) + sc * 0.35, fm * 0.78);
    vec2 dg = w0 * 28.0; vec2 dc = floor(dg); float dd2 = length(fract(dg) - 0.5 - (h22(dc) - 0.5) * 0.5);
    sc += vec3(0.7, 0.75, 0.9) * step(0.8, h21(dc + 9.0)) * smoothstep(0.18, 0.11, dd2) * uBreath * 0.18;
    sc *= mix(1.0, 0.1, smoothstep(0.7, 1.0, r / WIN));
    col = sc; alpha = 1.0;
  }

  // ---- the frame: gold 13i trim, a steel porthole ring with bolts, the hull ----
  if (r > WIN - 0.01) {
    float a = atan(q.y, q.x); vec2 lp = normalize(vec2(-0.6, 0.7));
    float R1 = WIN + 0.025, R2 = 1.10;
    float hull = smoothstep(R2 - uPx, R2 + uPx, r);
    if (hull > 0.0) {
      float seg = 6.2831 / 12.0; float pa = abs(fract(a / seg + 0.5) - 0.5) * seg * r;
      float seamH = smoothstep(0.004, 0.012, min(pa, abs(r - 1.55)));
      vec3 hc = vec3(0.035, 0.038, 0.07) * (0.7 + 0.5 * fbm(vec3(q * 4.0, 0.5))) * seamH;
      hc += vec3(0.12, 0.12, 0.22) * smoothstep(1.5, 1.1, r) * (0.6 + 0.4 * dot(lp, q / r));
      float rs = 6.2831 / 24.0; vec2 rp = vec2((fract(a / rs + 0.5) - 0.5) * rs * r, r - 1.18);
      float rv = smoothstep(0.018, 0.011, length(rp));
      hc = mix(hc, vec3(0.26, 0.27, 0.34) * (0.55 + 0.6 * dot(lp, normalize(rp + 1e-4))), rv);
      col = mix(col, hc, hull); alpha = max(alpha, hull * smoothstep(1.95, 1.2, r));
    }
    float steel = smoothstep(R1 - uPx, R1 + uPx, r) * smoothstep(R2 + uPx, R2 - uPx, r);
    if (steel > 0.0) {
      float bevel = 1.0 - abs((r - (R1 + R2) * 0.5) / ((R2 - R1) * 0.5));
      vec3 stc = vec3(0.15, 0.16, 0.21) * (0.45 + 0.75 * bevel) + noise(vec3(a * 260.0, r * 3.0, 0.0)) * 0.035;
      stc += vec3(0.85, 0.88, 1.0) * smoothstep(0.7, 0.0, abs(a - 2.3)) * 0.35 * bevel * bevel;
      float bs = 6.2831 / 16.0; vec2 bp = vec2((fract(a / bs + 0.5) - 0.5) * bs * r, r - (R1 + R2) * 0.5);
      float bolt = smoothstep(0.02, 0.013, length(bp));
      stc = mix(stc, vec3(0.3, 0.31, 0.38) * (0.5 + 0.7 * dot(lp, normalize(bp + 1e-4))), bolt);
      col = mix(col, stc, steel); alpha = max(alpha, steel);
    }
    float gold = smoothstep(WIN - 0.004 - uPx, WIN - 0.004 + uPx, r) * smoothstep(R1 + uPx, R1 - uPx, r);
    if (gold > 0.0) {
      float gb = 1.0 - abs((r - (WIN + R1) * 0.5) / ((R1 - WIN) * 0.5));
      vec3 gc = vec3(0.91, 0.82, 0.60) * (0.55 + 0.45 * gb) + vec3(1.0, 0.96, 0.86) * smoothstep(0.5, 0.0, abs(a - 2.4)) * 0.45 * gb;
      col = mix(col, gc, gold); alpha = max(alpha, gold);
    }
  }
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The Watcher's iris: the Oracle's iris painter (components/OracleEyeFlat.js)
// in a reptile gold, without the crypts - those are the live drifting spots.
function paintWatcherIris(S) {
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const r = rng(77);
  const R = S / 2;
  g.translate(R, R);
  const base = g.createRadialGradient(0, 0, R * 0.08, 0, 0, R);
  [[0, "#FFF0B8"], [0.18, "#F0CF6A"], [0.42, "#C99A34"], [0.66, "#7C6A28"], [0.86, "#3A2A16"], [1, "#0C0804"]].forEach(([o, col]) => base.addColorStop(o, col));
  g.fillStyle = base;
  g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 1600; i++) {
    const a = r() * Math.PI * 2, r0 = R * (0.14 + r() * 0.1), r1 = R * (0.55 + r() * 0.43);
    const bend = (r() - 0.5) * 0.18, light = r() < 0.55;
    g.strokeStyle = light ? `rgba(255,240,205,${0.06 + r() * 0.16})` : `rgba(20,12,30,${0.08 + r() * 0.2})`;
    g.lineWidth = 0.4 + r() * 1.1;
    g.beginPath();
    g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
    const am = a + bend, rm = (r0 + r1) / 2;
    g.quadraticCurveTo(Math.cos(am) * rm, Math.sin(am) * rm, Math.cos(a + bend * 0.4) * r1, Math.sin(a + bend * 0.4) * r1);
    g.stroke();
  }
  g.strokeStyle = "rgba(255,236,190,0.55)";
  g.lineWidth = R * 0.018;
  g.beginPath();
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * Math.PI * 2, rr = R * (0.36 + Math.sin(a * 11) * 0.025 + Math.sin(a * 5 + 1) * 0.02);
    i ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  g.closePath(); g.stroke();
  [0.68, 0.76, 0.84].forEach((kk) => {
    g.strokeStyle = "rgba(10,6,28,0.35)"; g.lineWidth = 1; g.setLineDash([R * 0.04, R * 0.03]);
    g.beginPath(); g.arc(0, 0, R * kk, 0, Math.PI * 2); g.stroke();
  });
  g.setLineDash([]);
  for (let i = 0; i < 90; i++) {
    const a = r() * Math.PI * 2, rr = R * (0.2 + r() * 0.6), s = R * (0.004 + r() * 0.012);
    const fx = Math.cos(a) * rr, fy = Math.sin(a) * rr;
    const f = g.createRadialGradient(fx, fy, 0, fx, fy, s * 3);
    f.addColorStop(0, "rgba(255,226,150,0.9)"); f.addColorStop(1, "rgba(255,226,150,0)");
    g.fillStyle = f; g.fillRect(fx - s * 3, fy - s * 3, s * 6, s * 6);
  }
  const limb = g.createRadialGradient(0, 0, R * 0.86, 0, 0, R);
  limb.addColorStop(0, "rgba(8,6,24,0)"); limb.addColorStop(1, "rgba(8,6,24,0.95)");
  g.fillStyle = limb; g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.fill();
  return c;
}

function makeSpots() {
  const r = rng(1597);
  return Array.from({ length: 24 }, () => ({ r0: 0.3 + r() * 0.56, a0: r() * 6.2832, w: (r() - 0.5) * 0.07, f: 0.12 + r() * 0.3, p: r() * 6.2832, ph: r() * 6.2832, s: 0.022 + r() * 0.03, e: 1.5 + r() * 1.5 }));
}

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

export default function OracleWatcher({ open = 1, mood = "listening", anchorRef, onSfx, onFail }) {
  const canvasRef = useRef(null);
  const live = useRef({ open, mood, onSfx, onFail });
  live.current = { open, mood, onSfx, onFail };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fail = () => { live.current.onFail && live.current.onFail(); };
    let gl = null;
    try { gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true }); } catch (e) { gl = null; }
    if (!gl) { fail(); return; }
    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, WATCHER_FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) { fail(); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paintWatcherIris(512));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const U = {};
    ["uIris", "uC", "uRad", "uF", "uR", "uU", "uT", "uPupil", "uLid", "uNict", "uBreath", "uScale", "uTilt", "uPx", "uPulse", "uGlowB", "uGlowW", "uPos"].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });
    U.uSpot = gl.getUniformLocation(prog, "uSpot[0]");
    gl.uniform1i(U.uIris, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spots = makeSpots();
    const sbuf = new Float32Array(96);
    const t0 = performance.now();
    const st = {
      yaw: 0, pitch: 0, ty: 0, tp: 0, pupil: 0.1, lid: 0, nextGlance: 0, near: 0, nearT: 0, lastMove: -1e9,
      lean: 0, leanEnd: 0, nextLean: t0 + 14000, breath: 0,
      nict: 0, nictStart: -1e9, nextNict: t0 + 9000, blinkStart: -1e9, nextBlink: t0 + 15000,
      pulse: 1, glowB: 0, glowW: 0, lastG: t0, lastBeat: 0, swirl: 0, last: t0,
    };
    let scale = 1, raf = 0;
    const sfx = (n) => { const f = live.current.onSfx; f && f(n); };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const W = canvas.clientWidth, H = canvas.clientHeight;
      // the shader is heavy: cap the drawing size on big screens
      scale = Math.min(dpr, 1500 / Math.max(1, W, H));
      canvas.width = Math.max(1, Math.round(W * scale));
      canvas.height = Math.max(1, Math.round(H * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    // where the porthole is: the middle of the anchor, the glass as wide as it
    const anchor = () => {
      const c = canvas.getBoundingClientRect();
      const a = anchorRef && anchorRef.current ? anchorRef.current.getBoundingClientRect() : null;
      if (!a || !a.width) return { x: c.width / 2, y: c.height * 0.42, w: Math.min(c.width, c.height) * 0.6, c };
      return { x: a.left - c.left + a.width / 2, y: a.top - c.top + a.height / 2, w: a.width, c };
    };

    const onMove = (e) => {
      if (reduced) return;
      const a = anchor();
      const cx = a.c.left + a.x, cy = a.c.top + a.y;
      st.ty = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.5))) * 0.55;
      st.tp = -Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.5))) * 0.45;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      st.nearT = Math.max(0, Math.min(1, 1 - (dist - a.w * 0.15) / (a.w * 1.4)));
      st.lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove);

    const draw = (now) => {
      const t = (now - t0) / 1000 + 40;
      const dt = Math.min(0.05, (now - st.last) / 1000); st.last = now;
      const { open: o, mood: m } = live.current;
      const awake = m !== "sleeping";
      const still = reduced;

      // its body: a slow sway, never quite still, so you only ever see part of it
      const px = still ? 0 : 0.22 * Math.sin(t * 0.11) + 0.10 * Math.sin(t * 0.27 + 1.3);
      const py = still ? 0 : 0.06 * Math.sin(t * 0.15 + 0.4) + 0.03 * Math.sin(t * 0.37);
      const tilt = still ? 0 : 0.07 * Math.sin(t * 0.09 + 0.7);
      // now and then it leans in close to study you, and its breath fogs the glass
      if (!still && awake && m !== "receiving" && now > st.nextLean) { st.leanEnd = now + 6500; st.nextLean = now + 17000 + Math.random() * 9000; sfx("breathe"); }
      if (!awake) st.nextLean = Math.max(st.nextLean, now + 8000);
      const wantLean = m === "receiving" ? 0.26 : awake && now < st.leanEnd ? 0.32 : 0;
      st.lean += (wantLean - st.lean) * (wantLean > st.lean ? 0.012 : 0.008);
      const wantBreath = st.lean > 0.2 ? 0.95 : 0;
      st.breath += (wantBreath - st.breath) * (wantBreath > st.breath ? 0.03 : 0.006);
      const breath = st.breath * (0.82 + 0.18 * Math.sin(t * 1.1));
      const scaleK = 1 + (still ? 0 : 0.05 * Math.sin(t * 0.2)) + st.lean;

      // its gaze stays on you while its head moves
      if (!still) {
        if (m === "receiving") { st.ty = 0; st.tp = 0.2; }
        else if (now - st.lastMove > 3500 && now > st.nextGlance) {
          st.ty = (Math.random() - 0.5) * 0.35; st.tp = (Math.random() - 0.5) * 0.25;
          st.nextGlance = now + 2600 + Math.random() * 3200;
        }
      }
      const gy = st.ty * 0.8 - px * 0.75, gp = st.tp * 0.8 - py * 0.75;
      const k = still ? 1 : 0.07;
      st.yaw += (gy - st.yaw) * k; st.pitch += (gp - st.pitch) * k;
      if (now - st.lastMove > 6000) st.nearT *= 0.995;
      st.near += (st.nearT - st.near) * 0.04;
      const wantPupil = (PUPIL[m] || 0.15) * (1 + st.near * 0.6) * (1 - st.lean * 0.9) * (1 + (m === "speaking" ? 0.08 * Math.sin(t * 3) : 0.04 * Math.sin(t * 0.7)));
      st.pupil += (wantPupil - st.pupil) * 0.05;

      // the second lid
      if (!still && awake && now > st.nextNict) { st.nictStart = now; st.nextNict = now + 7000 + Math.random() * 8000; sfx("wet"); }
      const ne = (now - st.nictStart) / 1000;
      let nict = ne < 0 ? 0 : ne < 0.28 ? ne / 0.28 : ne < 0.4 ? 1 : ne < 0.85 ? 1 - (ne - 0.4) / 0.45 : 0;
      nict = nict * nict * (3 - 2 * nict);
      // a slow, heavy blink, rarely
      if (!still && awake && now > st.nextBlink) { st.blinkStart = now; st.nextBlink = now + 13000 + Math.random() * 10000; }
      const be = (now - st.blinkStart) / 1000;
      const blink = be < 0.18 ? be / 0.18 : be < 0.32 ? 1 : be < 0.62 ? 1 - (be - 0.32) / 0.3 : 0;
      st.lid += (Math.max(0, Math.min(1, o)) - st.lid) * (still ? 1 : 0.03);
      const lid = st.lid * (1 - 0.96 * blink);

      // its pores, its iris rings: quiet while it listens, pulsing while it receives, lit while it speaks
      const [gb, gw] = GLOW[m] || GLOW.listening;
      const gk = 1 - Math.exp(-Math.min(0.25, (now - st.lastG) / 1000) * 2.2); // about half a second, whatever the frame rate
      st.lastG = now;
      st.glowB += (gb - st.glowB) * gk;
      st.glowW += (gw - st.glowW) * gk;
      st.pulse += ((PULSE[m] || 1) - st.pulse) * 0.03;
      // a deep thump each time the light reaches its eye, once it's stirring
      const beat = Math.floor((t * 2.2 * st.pulse) / 6.2832);
      if (beat !== st.lastBeat) { st.lastBeat = beat; if (st.glowW > 0.3 && !still) sfx("pulse"); }
      if (!still) st.swirl += dt * (m === "receiving" ? 0.7 : 0.03);
      for (let i = 0; i < spots.length; i++) {
        const s = spots[i], tt = still ? 0 : t;
        sbuf[i * 4] = s.r0 + 0.05 * Math.sin(tt * s.f * 1.3 + s.ph);
        sbuf[i * 4 + 1] = s.a0 + s.w * tt + st.swirl * (0.7 + 0.6 * ((i * 7) % 5) / 4) + 0.22 * Math.sin(tt * s.f + s.p);
        sbuf[i * 4 + 2] = s.s * (1 + 0.18 * Math.sin(tt * 0.7 + s.p));
        sbuf[i * 4 + 3] = s.e;
      }

      // the eye's basis: forward toward its gaze
      const cy = Math.cos(st.yaw), sy = Math.sin(st.yaw), cp = Math.cos(st.pitch), sp = Math.sin(st.pitch);
      const F = [sy * cp, sp, cy * cp];
      const R = [F[2], 0, -F[0]];
      const rl = Math.hypot(R[0], R[1], R[2]) || 1;
      R[0] /= rl; R[2] /= rl;
      const Uv = [F[1] * R[2] - F[2] * R[1], F[2] * R[0] - F[0] * R[2], F[0] * R[1] - F[1] * R[0]];

      const a = anchor();
      const radCss = a.w / 2 / 0.84; // the glass (WIN = 0.84 units) is as wide as the anchor
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.uC, a.x * scale, (a.c.height - a.y) * scale);
      gl.uniform1f(U.uRad, radCss * scale);
      gl.uniform3fv(U.uF, F); gl.uniform3fv(U.uR, R); gl.uniform3fv(U.uU, Uv);
      gl.uniform1f(U.uT, still ? 40 : t);
      gl.uniform1f(U.uPupil, Math.max(0.04, st.pupil));
      gl.uniform1f(U.uLid, lid);
      gl.uniform1f(U.uNict, nict);
      gl.uniform1f(U.uBreath, breath);
      gl.uniform1f(U.uScale, scaleK);
      gl.uniform1f(U.uTilt, tilt);
      gl.uniform2f(U.uPos, px, py);
      gl.uniform1f(U.uPx, 1.5 / Math.max(1, radCss * scale));
      gl.uniform1f(U.uPulse, st.pulse);
      gl.uniform1f(U.uGlowB, st.glowB);
      gl.uniform1f(U.uGlowW, st.glowW);
      gl.uniform4fv(U.uSpot, sbuf);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.deleteTexture(tex); gl.deleteBuffer(buf); gl.deleteProgram(prog);
    };
  }, [anchorRef]);

  return <canvas ref={canvasRef} className="oracle-watcher" aria-hidden="true" />;
}
