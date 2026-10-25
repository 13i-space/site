// Ilu, painted per pixel (look-lab). Same design as lib/rave/dancers.js -
// a floating orb, one great eye, two small ones, two antennae with glowing
// bulbs, seven tentacles with cyan bands and glowing tips, and on the drop
// the great eye becomes a mirrorball - lit like the Oracle's eye.
// Coordinates: Ilu's own "orb space" from dancers.js (orb at 60,70, r 32), y down.
import { FRAG as DJ } from "./djShader";

export const IBOX = { x0: -24, y0: -2, w: 168, h: 156 };

const COMMON = DJ.slice(DJ.indexOf("const float PI"), DJ.indexOf("// ---------- materials ----------"));

export const IFRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT, uB, uBass, uHigh, uHueA, uHueB, uMouth, uBlink, uMirror, uFloat;
uniform vec2 uLook;
uniform vec2 uTP[63];   // seven tentacles, nine points each, far ones first
uniform vec4 uTI[7];    // depth, root radius, tip radius, which side the suckers are on
uniform vec2 uAP[12];   // two antennae, six points each
${COMMON}

vec3 pinkSkin() { return lin(vec3(0.86, 0.46, 0.68)); }

void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 p = vec2(IBOX_X0 + f.x * IBOX_W, IBOX_Y0 + (1.0 - f.y) * IBOX_H);
  px = IBOX_W / uRes.x;
  rimA = lin(hsl2rgb(uHueA, 1.0, 0.62)) * 1.1;
  rimB = lin(hsl2rgb(uHueB, 1.0, 0.68)) * 1.1;
  vec3 cyan = lin(vec3(0.56, 0.9, 1.0));

  // ===== the tentacles, far ones first =====
  for (int k = 0; k < 7; k++) {
    vec4 I = uTI[k];
    float best = 1e3, tA = 0.0, rad = 1.0, sA = 0.0, acc0 = 0.0; vec2 ax = vec2(0.0), dir = vec2(0.0, 1.0);
    for (int j = 0; j < 8; j++) {
      vec2 a = uTP[k * 9 + j], b = uTP[k * 9 + j + 1];
      float segL = length(b - a);
      vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      float tt = (float(j) + h) / 8.0;
      float r = mix(I.y, I.z, pow(tt, 0.85));
      vec2 v = pa - ba * h; float d = length(v) - r;
      if (d < best) { best = d; ax = v; tA = tt; rad = r; dir = normalize(ba); sA = acc0 + h * segL; }
      acc0 += segL;
    }
    vec2 tip = uTP[k * 9 + 8];
    float back = 1.0 - smoothstep(-0.2, 0.3, I.x);
    if (best < px * 2.0) {
      float e = clamp(length(ax) / rad, 0.0, 1.0);
      vec2 n2 = length(ax) > 1e-4 ? ax / length(ax) : vec2(0.0);
      vec3 n = normalize(vec3(n2 * e, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
      vec3 alb = mix(pinkSkin(), lin(vec3(0.55, 0.25, 0.44)), back) * (0.92 + 0.1 * noise(p * 0.5));
      // suckers down one side
      float across = dot(ax, vec2(-dir.y, dir.x)) * I.w;
      float sp = rad * 2.2 + 0.6;
      vec2 cup = vec2((fract(sA / sp) - 0.5) * sp, across - rad * 0.45);
      float cr = length(cup) / (rad * 0.42);
      float ringC = smoothstep(1.0, 0.75, cr) * (1.0 - back) * step(0.08, tA) * step(cr, 1.0);
      float pit = smoothstep(0.55, 0.3, cr);
      alb = mix(alb, lin(vec3(1.0, 0.86, 0.93)), ringC * 0.8);
      alb = mix(alb, lin(vec3(0.42, 0.14, 0.32)), pit * ringC);
      if (ringC > 0.0) n = normalize(n + vec3(cup / (rad * 0.42) * 0.5 * (1.0 - pit * 2.0), 0.0));
      vec3 c = light(alb, n, 60.0, 0.45, 1.0, lin(vec3(1.0, 0.45, 0.7)), 1.0);
      c *= mix(1.0, 0.55, pow(e, 3.0));
      // jelly: a glow down the middle
      c += lin(vec3(1.0, 0.45, 0.75)) * (1.0 - e) * 0.18 * (1.0 - back * 0.6);
      // the cyan bands
      float band = max(smoothstep(0.03, 0.0, abs(tA - 0.3)), smoothstep(0.03, 0.0, abs(tA - 0.55)));
      c = mix(c, cyan * (0.9 + uHigh * 0.8), band * 0.8);
      c *= mix(1.0, 0.55, back);
      put(best, c);
    }
    // the glowing tip
    float dt = length(p - tip);
    glowAdd(cyan, exp(-dt * 0.45) * (0.25 + uHigh * 0.45) * (1.0 - back * 0.5) * 0.6);
    if (dt < 2.2) put(dt - 1.8, cyan * 1.6 + vec3(0.2));
  }

  // ===== the orb =====
  vec2 oq = p - vec2(60.0, 70.0);
  float orr = length(oq), od = orr - 32.0;
  if (od < px * 2.0) {
    float e = clamp(orr / 32.0, 0.0, 1.0);
    vec3 n = normalize(vec3(oq / 32.0, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
    vec3 alb = pinkSkin() * 0.82 * (0.9 + 0.15 * fbm(oq * 0.15 + 2.0));
    // the dimples
    for (int i = 0; i < 9; i++) {
      vec3 sp = i == 0 ? vec3(36.0, 60.0, 2.6) : i == 1 ? vec3(40.0, 82.0, 2.0) : i == 2 ? vec3(82.0, 58.0, 2.4) : i == 3 ? vec3(84.0, 80.0, 2.8) : i == 4 ? vec3(48.0, 94.0, 1.8) : i == 5 ? vec3(74.0, 94.0, 2.0) : i == 6 ? vec3(60.0, 42.0, 1.7) : i == 7 ? vec3(30.0, 72.0, 1.4) : vec3(90.0, 70.0, 1.6);
      vec2 dq = (p - sp.xy) / vec2(sp.z, sp.z * 0.85);
      float dl = length(dq);
      if (dl < 1.3) {
        float dim = smoothstep(1.15, 0.5, dl);
        alb = mix(alb, lin(vec3(0.36, 0.1, 0.28)), dim * 0.85);
        n = normalize(n - vec3(dq * 0.5, 0.0) * smoothstep(1.2, 0.3, dl));
      }
    }
    // the socket round the great eye
    float sock = length((p - vec2(60.0, 67.5)) / vec2(17.5, 17.0));
    float sockM = smoothstep(1.16, 0.98, sock);
    alb *= mix(1.0, 0.3, sockM);
    n = normalize(n + vec3((p - vec2(60.0, 67.5)) / 17.0 * -0.35 * sockM * smoothstep(0.85, 1.05, sock), 0.0));
    vec3 c = light(alb, n, 90.0, 0.85, 0.6, lin(vec3(1.0, 0.4, 0.7)), 1.0);
    c *= mix(1.0, 0.35, pow(e, 3.5));
    // light inside it, from below, breathing with the bass
    c += lin(vec3(1.0, 0.5, 0.8)) * smoothstep(-0.2, 0.9, oq.y / 32.0) * (1.0 - e * 0.6) * (0.12 + uBass * 0.18);
    // the stage reflected in its skin
    vec3 R = reflect(vec3(0.0, 0.0, -1.0), n);
    c += vec3(1.0) * smoothstep(0.86, 0.97, dot(R, normalize(vec3(-0.4, -0.7, 0.55)))) * 0.55;
    c += rimA * smoothstep(0.8, 0.96, dot(R, normalize(vec3(-0.9, -0.1, 0.4)))) * 0.45;
    c += rimB * smoothstep(0.8, 0.96, dot(R, normalize(vec3(0.9, -0.1, 0.4)))) * 0.45;
    // the three glow-spots
    for (int i = 0; i < 3; i++) {
      vec2 gp = i == 0 ? vec2(34.0, 70.0) : i == 1 ? vec2(86.0, 70.0) : vec2(60.0, 100.0);
      float g = 0.4 + 0.6 * max(0.0, sin(uB * PI - float(i)));
      float dg = length(p - gp);
      c = mix(c, cyan * (1.2 + g), smoothstep(1.8, 1.0, dg) * g);
      c += cyan * exp(-dg * 0.5) * g * 0.35;
    }
    put(od, c);
  }

  // ===== the great eye =====
  vec2 eq = p - vec2(60.0, 66.0);
  float er = length(eq), ed = er - 15.0;
  if (ed < px * 2.0) {
    float e = clamp(er / 15.0, 0.0, 1.0);
    vec3 n = normalize(vec3(eq / 15.0, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
    vec3 c;
    if (uMirror > 0.5) {
      // a mirrorball: little square mirrors, each tipped a little, catching the lights
      vec3 nb = n;
      float lat = asin(clamp(nb.y, -1.0, 1.0)), lon = atan(nb.x, nb.z) + uB * 0.9;
      vec2 g = vec2(lon, lat) * 7.5;
      vec2 cell = floor(g), fr = fract(g) - 0.5;
      float h1 = hash(cell), h2 = hash(cell + 7.3);
      vec3 fn = normalize(nb + vec3((h1 - 0.5) * 0.35, (h2 - 0.5) * 0.35, 0.0));
      vec3 R = reflect(vec3(0.0, 0.0, -1.0), fn);
      float flash = step(0.82, hash(cell + floor(uB * 2.0) * 1.7));
      vec3 env = mix(lin(vec3(0.12, 0.13, 0.22)), lin(vec3(0.55, 0.58, 0.75)), smoothstep(-0.4, 0.8, -R.y));
      env += rimA * smoothstep(0.4, 0.95, -R.x) + rimB * smoothstep(0.4, 0.95, R.x);
      c = env * (0.75 + 0.5 * h1) + vec3(1.0) * flash * 1.4;
      float grout = smoothstep(0.42, 0.5, max(abs(fr.x), abs(fr.y)));
      c = mix(c, lin(vec3(0.05, 0.05, 0.09)), grout * 0.8);
      c *= 0.55 + 0.45 * n.z;
      glowAdd(vec3(1.0), 0.0);
    } else {
      // the white of the eye, veins faint at the edge
      vec3 alb = lin(vec3(0.97, 0.92, 0.95));
      alb = mix(alb, lin(vec3(0.85, 0.5, 0.62)), smoothstep(0.75, 1.0, e) * 0.5 * smoothstep(0.55, 0.9, fbm(eq * 0.8)));
      c = light(alb, n, 200.0, 0.0, 0.2, lin(vec3(1.0, 0.6, 0.7)), 1.0) * 1.08 + alb * 0.12;
      // the iris: luminous, with rings that roll inward
      vec2 ic = vec2(1.0, 0.0) + uLook;
      vec2 iq = eq - ic;
      float ir = length(iq) / 10.0;
      if (ir < 1.05) {
        float ang = atan(iq.y, iq.x);
        vec3 icol = mix(lin(vec3(0.62, 0.94, 1.0)), lin(vec3(0.29, 0.42, 0.91)), smoothstep(0.32, 0.65, ir));
        icol = mix(icol, lin(vec3(0.13, 0.08, 0.35)), smoothstep(0.65, 1.0, ir));
        icol *= 0.7 + 0.45 * noise(vec2(ang * 9.0, ir * 3.0)) + 0.2 * noise(vec2(ang * 31.0, ir * 9.0));
        icol *= 0.85 + 0.3 * smoothstep(0.3, 0.9, abs(sin(ang * 8.0 + noise(vec2(ang * 4.0, ir * 2.0)) * 2.0)));
        icol = mix(icol, icol * 0.35, smoothstep(0.95, 1.03, ir));
        icol *= 1.0 + 0.35 * pow(0.5 + 0.5 * sin(ir * 22.0 + uT * 2.0), 6.0) * smoothstep(0.3, 0.45, ir);
        float pr = (3.4 + uBass * 1.2) / 10.0;
        float pm = smoothstep(pr + 0.03, pr - 0.02, ir);
        vec3 ic2 = mix(icol * 1.15 + cyan * 0.15, lin(vec3(0.01, 0.01, 0.03)), pm);
        c = mix(c, ic2, smoothstep(1.03, 0.97, ir));
      }
      // the upper lid's shadow, and its wet highlights
      c *= mix(1.0, 0.45, smoothstep(-6.0, -15.0, eq.y));
      vec3 H = normalize(normalize(vec3(-0.35, -0.7, 0.6)) + vec3(0.0, 0.0, 1.0));
      c += vec3(1.0) * pow(max(dot(n, H), 0.0), 400.0) * 1.4;
      c += vec3(1.0) * smoothstep(1.1, 0.8, length((eq - vec2(-4.0, -4.5)) / vec2(3.0, 2.2))) * 0.6;
      c += vec3(1.0) * smoothstep(1.2, 0.8, length(eq - vec2(5.0, 5.0))) * 0.4;
      c += mix(rimA, rimB, smoothstep(-12.0, 12.0, eq.x)) * pow(1.0 - n.z, 3.0) * 0.35;
    }
    // the lids close top and bottom
    float lid = step(15.0 * (1.0 - uBlink) + 0.01, abs(eq.y)) * step(0.02, uBlink);
    if (lid > 0.5) c = light(pinkSkin() * 0.8, n, 40.0, 0.2, 0.8, lin(vec3(1.0, 0.4, 0.7)), 1.0);
    // a dark rim where the eye meets the socket
    c *= 1.0 - 0.5 * smoothstep(-1.4, 0.0, ed);
    put(ed, c);
  }

  // ===== two small eyes =====
  for (int i = 0; i < 2; i++) {
    vec3 se = i == 0 ? vec3(42.0, 54.0, 2.8) : vec3(79.0, 52.0, 2.4);
    vec2 sq = p - se.xy; float sr = length(sq), sd = sr - se.z;
    if (sd < px * 2.0) {
      float e = clamp(sr / se.z, 0.0, 1.0);
      vec3 n = normalize(vec3(sq / se.z, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
      vec3 c = light(lin(vec3(0.02, 0.015, 0.04)), n, 300.0, 1.4, 0.0, vec3(0.0), 1.0);
      c += lin(vec3(0.91, 0.82, 0.6)) * smoothstep(0.5, 0.25, length(sq - vec2(0.6, -0.6) * se.z / 2.8) / se.z * 2.8 * 0.35);
      put(sd, c);
    }
  }

  // ===== the mouth =====
  {
    float xm = (p.x - 60.0) / 9.0;
    if (abs(xm) < 1.0) {
      float yu = 87.0 + 1.5 * (1.0 - xm * xm);
      float yl = 87.0 + (3.0 + uMouth * 3.0) * (1.0 - xm * xm);
      float inM = min(p.y - yu, yl - p.y);
      if (inM > -0.8) {
        vec3 mc = lin(vec3(0.16, 0.04, 0.12));
        if (uMouth > 0.4) mc = mix(mc, lin(vec3(0.9, 0.42, 0.63)), smoothstep(1.6, 0.0, length((p - vec2(60.0, yl - 1.2)) * vec2(0.35, 1.0))));
        put(-inM, mc);
      }
    }
  }

  // ===== the antennae =====
  for (int a = 0; a < 2; a++) {
    float best = 1e3, tA = 0.0, rad = 1.0; vec2 ax = vec2(0.0);
    for (int j = 0; j < 5; j++) {
      vec2 s0 = uAP[a * 6 + j], s1 = uAP[a * 6 + j + 1];
      vec2 pa = p - s0, ba = s1 - s0; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      float tt = (float(j) + h) / 5.0;
      float r = mix(1.2, 0.55, tt);
      vec2 v = pa - ba * h; float d = length(v) - r;
      if (d < best) { best = d; ax = v; tA = tt; rad = r; }
    }
    if (best < px * 2.0) {
      float e = clamp(length(ax) / rad, 0.0, 1.0);
      vec2 n2 = length(ax) > 1e-4 ? ax / length(ax) : vec2(0.0);
      vec3 n = normalize(vec3(n2 * e, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
      put(best, light(lin(vec3(0.82, 0.48, 0.67)), n, 60.0, 0.4, 0.8, lin(vec3(1.0, 0.4, 0.7)), 1.0));
    }
    vec2 tip = uAP[a * 6 + 5];
    vec3 bc = a == 0 ? cyan : lin(vec3(0.91, 0.82, 0.6));
    vec2 bq = p - tip; float br = length(bq), bd = br - 3.2;
    glowAdd(bc, exp(-br * 0.3) * (0.3 + uHigh * 0.4) * 0.5);
    if (bd < px * 2.0) {
      float e = clamp(br / 3.2, 0.0, 1.0);
      vec3 n = normalize(vec3(bq / 3.2, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
      vec3 c = bc * (0.9 + 0.6 * n.z) + vec3(1.0) * pow(max(dot(n, normalize(vec3(-0.4, -0.5, 0.8))), 0.0), 60.0);
      put(bd, c);
    }
  }

  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;
