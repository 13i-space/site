// The DJ, painted per pixel (look-lab). Same design as lib/rave/booth.js -
// ram horns, a glass dome with the brain lit by the bass, the LED visor, a
// long ringed goat's neck, four arms, the beard, the jacket - but every
// surface is lit like the Oracle's eye: a key light from above, the stage's
// two colours as rim lights, wet gloss, light through thin skin, glows.
//
// Two passes so it layers with the booth exactly as before:
//   pass 0  the body (everything but the lower arms)  -> under the decks
//   pass 1  the lower arms and hands                  -> on top of the decks
// Coordinates are booth units, y down, like the canvas code.

export const BOX = { x0: -60, y0: -102, w: 120, h: 108 };

export const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uPass, uT, uBass, uDip, uDrop, uNod, uHeadRot, uSway, uOpen, uHueA, uHueB, uLevel;
uniform vec2 uTorso;
uniform vec2 uU[6];     // upper arms: shoulder, elbow, wrist (left, then right), torso units
uniform vec4 uUH[2];    // their hands: angle, spread, curl, finger length
uniform vec2 uL[6];     // lower arms, DJ units
uniform vec4 uLH[2];
uniform float uSpec[12];

const float PI = 3.14159265;
float px;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 x) { vec2 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
vec2 rot(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }
float sdEll(vec2 p, vec2 r) { float k0 = length(p / r); float k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / max(k1, 1e-4); }
float sdSeg(vec2 p, vec2 a, vec2 b, float r0, float r1, out float h) { vec2 pa = p - a, ba = b - a; h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - mix(r0, r1, h); }
float sdRBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float sdTrap(vec2 p, float rTop, float rBot, float yTop, float yBot) {
  // a trapezoid between y=yTop (half-width rTop) and y=yBot (half-width rBot), y down
  float he = (yBot - yTop) * 0.5; vec2 q = vec2(abs(p.x), p.y - (yTop + yBot) * 0.5);
  float r1 = rTop, r2 = rBot;
  vec2 k1 = vec2(r2, he), k2 = vec2(r2 - r1, 2.0 * he);
  vec2 ca = vec2(q.x - min(q.x, (q.y < 0.0) ? r1 : r2), abs(q.y) - he);
  vec2 cb = q - k1 + k2 * clamp(dot(k1 - q, k2) / dot(k2, k2), 0.0, 1.0);
  float s = (cb.x < 0.0 && ca.y < 0.0) ? -1.0 : 1.0;
  return s * sqrt(min(dot(ca, ca), dot(cb, cb)));
}
float sdTri(vec2 p, vec2 p0, vec2 p1, vec2 p2) {
  vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2, v0 = p - p0, v1 = p - p1, v2 = p - p2;
  vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
  vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
  vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
  float s = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)), vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))), vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
  return -sqrt(d.x) * sign(d.y);
}
float sdQuad(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d) { return min(sdTri(p, a, b, c), sdTri(p, a, c, d)); }
vec3 hsl2rgb(float h, float s, float l) {
  vec3 rgb = clamp(abs(mod(h / 60.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}
vec3 lin(vec3 c) { return c * c; }

// ---------- lighting ----------
vec3 rimA, rimB;
vec3 nrm(vec2 g, float d, float w) {
  float e = clamp(1.0 + d / w, 0.0, 1.0);
  return normalize(vec3(g * e, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
}
vec3 light(vec3 alb, vec3 n, float gloss, float spec, float sss, vec3 sssC, float shadow) {
  vec3 Lk = normalize(vec3(-0.3, -0.75, 0.6));
  float dif = max(dot(n, Lk), 0.0);
  float wrap = max((dot(n, Lk) + 0.4) / 1.4, 0.0);
  vec3 col = alb * (vec3(1.0, 0.93, 0.88) * mix(dif, wrap, sss) * 1.05 * shadow + vec3(0.09, 0.07, 0.14));
  col += sssC * sss * max(wrap - dif, 0.0) * 0.5 * shadow;
  vec2 nx = n.xy / max(length(n.xy), 1e-3);
  float edge = pow(1.0 - n.z, 1.8);
  col += rimA * edge * max(dot(nx, normalize(vec2(-1.0, -0.35))), 0.0) * 1.2;
  col += rimB * edge * max(dot(nx, normalize(vec2(1.0, -0.35))), 0.0) * 1.2;
  col += mix(rimA, rimB, 0.5) * edge * max(-nx.y, 0.0) * 0.35;
  vec3 H = normalize(Lk + vec3(0.0, 0.0, 1.0));
  float sp = pow(max(dot(n, H), 0.0), gloss);
  col += vec3(1.0, 0.97, 0.94) * sp * spec * shadow;
  return col;
}

vec4 acc = vec4(0.0);
void put(float d, vec3 c) { float cov = clamp(0.5 - d / px, 0.0, 1.0);
  float lw = max(px * 1.3, 0.22); c *= 1.0 - 0.6 * smoothstep(lw, lw * 0.3, -d); acc.rgb = c * cov + acc.rgb * (1.0 - cov); acc.a = cov + acc.a * (1.0 - cov); }
void glowAdd(vec3 c, float a) { acc.rgb += c * a; acc.a = max(acc.a, clamp(max(c.r, max(c.g, c.b)) * a, 0.0, 1.0)); }

// ---------- materials ----------
vec3 SKIN() { return lin(vec3(0.7, 0.27, 0.56)); }
vec3 skinShade(vec2 q, vec3 n, float sh, float thin) {
  float mottle = fbm(q * 0.3 + 3.0);
  vec3 alb = SKIN() * (0.9 + 0.2 * mottle);
  alb = mix(alb, lin(vec3(0.85, 0.45, 0.72)), smoothstep(0.6, 0.85, mottle) * 0.35);
  vec2 b = vec2(noise(q * 1.4 + 1.3) - 0.5, noise(q * 1.4 + 8.1) - 0.5) * 0.07;
  vec3 nb = normalize(n + vec3(b, 0.0));
  return light(alb, nb, 45.0, 0.28, 0.8 + thin, lin(vec3(1.0, 0.3, 0.5)), sh);
}
vec3 fabric(vec2 q, vec3 n, vec3 base, float sh) {
  float weave = 0.5 + 0.5 * sin(q.x * 9.0) * sin(q.y * 9.0);
  float fold = fbm(vec2(q.x * 0.35, q.y * 0.08) + 5.0);
  vec3 nb = normalize(n + vec3((fold - 0.5) * 0.9, 0.0, 0.0));
  vec3 c = light(base * (0.9 + 0.12 * weave), nb, 18.0, 0.0, 0.0, vec3(0.0), sh);
  // satin: a soft streak of light down each fold
  c += vec3(0.75, 0.7, 1.0) * pow(max(nb.x * -0.5 + 0.55, 0.0), 6.0) * 0.12 * sh;
  return c;
}
vec3 bone(float s, vec3 n, float sh, float ridge) {
  vec3 alb = mix(lin(vec3(1.0, 0.92, 0.72)), lin(vec3(0.88, 0.66, 0.3)), smoothstep(0.0, 0.8, s));
  alb = mix(alb, lin(vec3(0.45, 0.3, 0.12)), ridge * 0.7);
  return light(alb, n, 70.0, 0.55, 0.15, lin(vec3(1.0, 0.8, 0.5)), sh);
}

// ---------- the shapes ----------
float headSD(vec2 q) {
  float skull = sdEll(q - vec2(0.0, -22.0), vec2(15.0, 17.0));
  float jaw = max(sdEll(q - vec2(0.0, -15.0), vec2(12.4, 16.4)), -15.0 - q.y);
  return smin(skull, jaw, 2.0);
}
float domeSD(vec2 q) {
  return min(max(sdEll(q - vec2(0.0, -27.0), vec2(13.0, 11.5)), q.y + 27.0), sdEll(q - vec2(0.0, -27.0), vec2(13.0, 3.0)));
}
// a ram's horn: a tapering tube wound round a spiral
float hornSD(vec2 q, out float s, out vec2 dir, out float tr) {
  vec2 c = vec2(24.5, -25.5);
  vec2 v = q - c; float rho = length(v); float ph = atan(v.y, v.x);
  const float A0 = 3.2, SW = 4.85;
  float best = 1e3; s = 0.0; dir = vec2(1.0, 0.0); tr = 1.0;
  for (int k = -1; k <= 2; k++) {
    float a = ph + 6.2831853 * float(k);
    float ss = (a - A0) / SW;
    if (ss < -0.02 || ss > 1.0) continue;
    float sc = clamp(ss, 0.0, 1.0);
    float r = 14.2 - 6.8 * pow(sc, 1.5);
    float rad = mix(3.8, 0.75, pow(sc, 0.9));
    float d = abs(rho - r) - rad;
    if (d < best) { best = d; s = sc; dir = normalize(v) * sign(rho - r); tr = rad; }
  }
  // the root, tucked under the skull, and a rounded tip
  float tipA = A0 + SW; vec2 tip = c + (14.2 - 6.8) * vec2(cos(tipA), sin(tipA));
  float dt = length(q - tip) - 0.75; if (dt < best) { best = dt; s = 1.0; dir = normalize(q - tip); tr = 0.75; }
  return best;
}
float earSD(vec2 q) { return sdEll(rot(q - vec2(17.1, -14.6), -0.33), vec2(5.3, 2.1)); }
float neckSD(vec2 p) { return sdTrap(p, 3.6, 5.2, -47.5, -30.5); }
float jacketSD(vec2 p) {
  float d = sdTrap(p, 15.5, 13.0, -30.5, 12.0) - 4.0;
  return d;
}
float padSD(vec2 p, float sd) { return sdEll(rot(p - vec2(sd * 15.5, -31.2), -sd * 0.25), vec2(5.2, 3.1)); }

// an arm: two tapering bones; t runs 0 at the shoulder to 1 at the wrist
float armSD(vec2 p, vec2 a, vec2 b, vec2 c, float r0, float r1, out float t) {
  float h1, h2;
  float l1 = length(b - a), l2 = length(c - b);
  float rm = mix(r0, r1, 0.45);
  float d1 = sdSeg(p, a, b, r0, rm, h1);
  float d2 = sdSeg(p, b, c, rm * 0.95, r1, h2);
  t = d1 < d2 ? h1 * l1 / (l1 + l2) : (l1 + h2 * l2) / (l1 + l2);
  return smin(d1, d2, 1.2);
}
float handSD(vec2 p, vec2 w, vec4 H, out float tip) {
  vec2 dir = vec2(cos(H.x), sin(H.x));
  vec2 pc = w + dir * 1.3;
  float d = sdEll(rot(p - pc, -H.x), vec2(2.0, 1.75));
  tip = 0.0;
  for (int i = 0; i < 3; i++) {
    float o = float(i) - 1.0;
    vec2 fd = rot(dir, o * 0.36 * H.y);
    vec2 k0 = pc + rot(dir, o * 0.7) * 1.5;
    vec2 k1 = k0 + fd * H.w * 0.55;
    vec2 fd2 = rot(fd, H.z * (o == 0.0 ? 1.0 : o) * 0.8);
    vec2 k2 = k1 + fd2 * H.w * 0.5;
    float h1, h2;
    float f1 = sdSeg(p, k0, k1, 0.62, 0.52, h1);
    float f2 = sdSeg(p, k1, k2, 0.5, 0.22, h2);
    float f = min(f1, f2);
    if (f < d) tip = f2 < f1 ? h2 : 0.0;
    d = smin(d, f, 0.5);
  }
  return d;
}

#define GRAD(F, p) normalize(vec2(F(p + vec2(0.12, 0.0)) - F(p - vec2(0.12, 0.0)), F(p + vec2(0.0, 0.12)) - F(p - vec2(0.0, 0.12))) + 1e-5)

// ---------- one arm with its hand ----------
vec2 gA, gB, gC; float gR0, gR1; vec4 gH; float gSleeve;
float curArm(vec2 p) { float t; return armSD(p, gA, gB, gC, gR0, gR1, t); }
float curHand(vec2 p) { float tp; return handSD(p, gC, gH, tp); }
vec3 SLEEVE() { return lin(vec3(0.34, 0.2, 0.52)); }
void drawArm(vec2 p, float sh) {
  float t; float d = armSD(p, gA, gB, gC, gR0, gR1, t);
  if (d < px * 2.0) {
    vec2 g = GRAD(curArm, p);
    vec3 n = nrm(g, d, gR0 * 0.9);
    vec3 c;
    if (t < gSleeve) {
      c = fabric(p, n, SLEEVE(), sh);
      float cuff = smoothstep(gSleeve - 0.06, gSleeve - 0.02, t);
      c = mix(c, rimA * 1.3 + vec3(0.1), cuff * 0.85);
    } else {
      c = skinShade(p * 1.3, n, sh, 0.4);
      // elbow and wrist creases
      c *= 1.0 - 0.25 * smoothstep(0.03, 0.0, abs(t - 0.47)) - 0.2 * smoothstep(0.03, 0.0, abs(t - 0.93));
    }
    put(d, c);
  }
  float tp; float dh = handSD(p, gC, gH, tp);
  if (dh < px * 2.0) {
    vec2 g = GRAD(curHand, p);
    vec3 n = nrm(g, dh, 1.1);
    vec3 c = skinShade(p * 1.6, n, sh, 0.8);
    // claws: dark, glossy tips
    float claw = smoothstep(0.72, 0.85, tp);
    c = mix(c, light(lin(vec3(0.08, 0.03, 0.08)), n, 120.0, 0.9, 0.0, vec3(0.0), sh), claw);
    put(dh, c);
  }
}

// ---------- the head ----------
vec2 gHq;
float curHead(vec2 q) { return headSD(q); }
float curNeck(vec2 p) { return neckSD(p); }
float curJacket(vec2 p) { return jacketSD(p); }
float curEar(vec2 q) { return earSD(q); }
float curDome(vec2 q) { return domeSD(q); }

void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 P = vec2(BOX_X0 + f.x * BOX_W, BOX_Y0 + (1.0 - f.y) * BOX_H);
  px = BOX_W / uRes.x;
  rimA = lin(hsl2rgb(uHueA, 1.0, 0.62)) * 1.1;
  rimB = lin(hsl2rgb(uHueB, 1.0, 0.68)) * 1.1;
  vec2 pd = P - vec2(0.0, -7.0);        // DJ units
  vec2 pt = pd - uTorso;                // torso units

  if (uPass > 0.5) {
    // ===== the lower arms, working the decks =====
    for (int i = 0; i < 2; i++) {
      gA = i == 0 ? uL[0] : uL[3]; gB = i == 0 ? uL[1] : uL[4]; gC = i == 0 ? uL[2] : uL[5];
      gH = i == 0 ? uLH[0] : uLH[1]; gR0 = 3.1; gR1 = 1.9; gSleeve = 0.4;
      drawArm(pd, 1.0);
    }
    gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
    return;
  }

  // head frame
  vec2 hq = rot(pt - vec2(0.0, -46.0 + uNod * 0.6), -uHeadRot);
  float headD = headSD(hq);
  // the head's shadow, cast down onto the neck and chest
  float headShadow = smoothstep(-1.0, 5.0, headSD(rot(pt - vec2(0.0, -46.0 + uNod * 0.6) - vec2(1.0, -3.5), -uHeadRot)));

  // ===== the jacket =====
  float jd = jacketSD(pt);
  if (jd < px * 2.0) {
    vec2 g = GRAD(curJacket, pt);
    vec3 n = nrm(g, jd, 9.0);
    vec3 base = lin(mix(vec3(0.16, 0.08, 0.26), vec3(0.24, 0.13, 0.38), smoothstep(-18.0, 4.0, -abs(pt.x) * 1.4)));
    float sh = mix(0.55, 1.0, headShadow);
    vec3 c = fabric(pt, n, base, sh);
    // the V of the shirt, with its equaliser
    float vee = sdTri(pt, vec2(-7.0, -34.0), vec2(0.0, -15.0), vec2(7.0, -34.0));
    if (vee < 0.5) {
      vec3 sc = lin(vec3(0.03, 0.02, 0.05));
      for (int i = 0; i < 6; i++) {
        float bx = -5.3 + float(i) * 2.0;
        float v = uSpec[i * 2];
        float bar = step(abs(pt.x - bx), 0.7) * step(-22.0 - v * 6.0, pt.y) * step(pt.y, -22.0);
        sc += mix(rimA, rimB, float(i) / 5.0) * bar * 1.4;
        sc += mix(rimA, rimB, float(i) / 5.0) * exp(-abs(pt.x - bx) * 1.2) * smoothstep(-28.0, -22.0, pt.y) * smoothstep(-15.0, -22.0, pt.y) * v * 0.12;
      }
      c = mix(c, sc, smoothstep(0.5, -0.3, vee));
    }
    // lapels with a neon edge
    for (int sdI = 0; sdI < 2; sdI++) {
      float sd = sdI == 0 ? -1.0 : 1.0;
      vec2 lq = vec2(pt.x * sd, pt.y);
      float lap = sdQuad(lq, vec2(7.6, -34.5), vec2(13.0, -27.0), vec2(3.4, -18.0), vec2(0.4, -15.2));
      if (lap < 0.6) {
        vec3 lc = fabric(pt, normalize(vec3(sd * 0.35, -0.2, 1.0)), lin(vec3(0.3, 0.18, 0.46)), sh);
        float rimL = smoothstep(0.6, 0.0, abs(lap + 0.25));
        c = mix(c, lc, smoothstep(0.4, -0.3, lap));
        c += rimA * rimL * 0.9;
      }
    }
    // the zip
    float zip = smoothstep(0.55, 0.15, abs(pt.x)) * step(-14.6, pt.y);
    c = mix(c, light(lin(vec3(0.6, 0.6, 0.7)), normalize(vec3(0.0, sin(pt.y * 5.0) * 0.5, 1.0)), 80.0, 0.8, 0.0, vec3(0.0), sh), zip * 0.85);
    // the Tempo Goat patch
    vec2 pq = pt - vec2(-10.0, -21.0);
    float pr = length(pq);
    if (pr < 3.6) {
      vec3 pc = lin(vec3(0.06, 0.03, 0.1));
      float ring = smoothstep(0.35, 0.05, abs(pr - 3.2));
      vec2 hq2 = vec2(abs(pq.x), pq.y);
      float curl = abs(length(hq2 - vec2(1.4, -1.0)) - 1.05) - 0.22;
      float horns = smoothstep(0.15, -0.1, max(curl, -(hq2.x - 0.3)));
      pc = mix(pc, light(lin(vec3(0.95, 0.8, 0.5)), vec3(0.0, -0.3, 0.95), 60.0, 0.9, 0.0, vec3(0.0), sh), max(ring, horns));
      c = mix(c, pc, smoothstep(3.6, 3.3, pr));
    }
    // a neon trim round the jacket, and the bass glowing on the chest
    c += rimA * smoothstep(0.7, 0.0, abs(jd + 0.35)) * (0.6 + uDip * 0.4);
    c += rimB * exp(-length(pt - vec2(0.0, -20.0)) * 0.16) * uBass * 0.35;
    put(jd, c);
  }
  // shoulder pads
  for (int i = 0; i < 2; i++) {
    float sd = i == 0 ? -1.0 : 1.0;
    float d = padSD(pt, sd);
    if (d < px * 2.0) {
      vec2 q = rot(pt - vec2(sd * 15.5, -31.2), -sd * 0.25);
      vec3 n = normalize(vec3(q / vec2(5.2, 3.1) * 0.9, 0.6));
      vec3 c = fabric(pt, n, lin(vec3(0.3, 0.18, 0.48)), 1.0);
      c += rimA * smoothstep(0.6, 0.0, abs(d + 0.3)) * 0.9;
      put(d, c);
    }
  }
  // the upper arms
  for (int i = 0; i < 2; i++) {
    gA = i == 0 ? uU[0] : uU[3]; gB = i == 0 ? uU[1] : uU[4]; gC = i == 0 ? uU[2] : uU[5];
    gH = i == 0 ? uUH[0] : uUH[1]; gR0 = 3.0; gR1 = 1.8; gSleeve = 0.45;
    drawArm(pt, 1.0);
  }
  // the long goat's neck, ringed
  float nd = neckSD(pt);
  if (nd < px * 2.0) {
    vec2 g = GRAD(curNeck, pt);
    vec3 n = nrm(g, nd, 4.4);
    float rings = 0.5 + 0.5 * sin(pt.y * 3.5 + abs(pt.x) * abs(pt.x) * 0.12);
    n = normalize(n + vec3(0.0, (rings - 0.5) * 0.5, 0.0));
    vec3 c = skinShade(pt * 1.2, n, mix(0.35, 1.0, headShadow), 0.2);
    c *= 0.85 + 0.25 * rings;
    put(nd, c);
  }
  // a ruff of fur at the collar
  {
    float top = -35.0 + 1.3 * abs(sin(pt.x * 1.6 + 0.4)) + sin(uT * 3.0 + pt.x) * 0.25;
    float fd = max(max(abs(pt.x) - 8.2, top - pt.y), pt.y + 31.6);
    if (fd < px * 2.0) {
      float strand = 0.5 + 0.5 * sin(pt.x * 6.0 + noise(pt * 0.8) * 4.0);
      vec3 c = light(lin(vec3(0.26, 0.1, 0.25)) * (0.7 + 0.5 * strand), normalize(vec3(0.0, -0.4, 0.9)), 20.0, 0.1, 0.4, lin(vec3(0.8, 0.3, 0.5)), mix(0.4, 1.0, headShadow));
      put(fd, c);
    }
  }
  // headphones round the neck
  {
    vec2 q = pt - vec2(0.0, -37.0);
    float band = max(abs(length(q) - 9.5) - 1.2, 1.3 - q.y);
    if (band < px * 2.0) {
      float e = (length(q) - 9.5) / 1.2;
      vec3 n = normalize(vec3(normalize(q) * e, sqrt(max(1.0 - e * e, 0.0)) + 0.05));
      put(band, light(lin(vec3(0.07, 0.07, 0.1)), n, 90.0, 0.7, 0.0, vec3(0.0), mix(0.5, 1.0, headShadow)));
    }
    for (int i = 0; i < 2; i++) {
      float sd = i == 0 ? -1.0 : 1.0;
      vec2 cq = rot(pt - vec2(sd * 9.6, -34.6), -sd * 0.2);
      float cup = sdEll(cq, vec2(3.7, 4.5));
      if (cup < px * 2.0) {
        vec3 n = normalize(vec3(cq / vec2(3.7, 4.5) * 0.85, 0.55));
        vec3 c = light(lin(vec3(0.12, 0.12, 0.17)), n, 110.0, 0.9, 0.0, vec3(0.0), 1.0);
        float ring = smoothstep(0.45, 0.0, abs(sdEll(cq, vec2(2.4, 3.0))));
        c += rimA * ring * (0.8 + uDip * 0.8);
        c += rimA * exp(-length(cq) * 0.6) * 0.15 * uBass;
        put(cup, c);
      }
    }
  }

  // ===== the head =====
  // horns, behind the skull
  for (int i = 0; i < 2; i++) {
    float sd = i == 0 ? -1.0 : 1.0;
    vec2 q = vec2(hq.x * sd, hq.y);
    float s; vec2 dir; float tr;
    float d = hornSD(q, s, dir, tr);
    if (d < px * 2.0) {
      float e = clamp(1.0 + d / tr, 0.0, 1.0);
      vec3 n = normalize(vec3(dir * e, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
      n.x *= sd;
      float rg = sin(s * 68.0);
      float ridge = smoothstep(0.7, 0.98, rg);
      n = normalize(n + vec3(rot(dir, 1.5708) * cos(s * 68.0) * 0.25, 0.0));
      n = normalize(n + vec3(0.0, 0.0, 0.0) + vec3(dir.x * sd, dir.y, 0.0) * 0.0);
      vec3 c = bone(s, n, 1.0, ridge);
      // fine growth lines between the ridges
      c *= 0.94 + 0.06 * sin(s * 300.0);
      put(d, c);
    }
  }
  // ears, below the horns, the light coming through them
  for (int i = 0; i < 2; i++) {
    float sd = i == 0 ? -1.0 : 1.0;
    vec2 q = vec2(hq.x * sd, hq.y);
    float d = earSD(q);
    if (d < px * 2.0) {
      vec2 g = GRAD(curEar, q); g.x *= sd;
      vec3 n = nrm(g, d, 2.0);
      vec3 c = skinShade(q * 1.5, n, 1.0, 1.0);
      float inner = smoothstep(-0.5, -1.5, d);
      c = mix(c, lin(vec3(1.0, 0.5, 0.75)) * (0.6 + 0.4 * n.z) + rimB * 0.2, inner * 0.6);
      put(d, c);
    }
  }
  // the face and skull
  if (headD < px * 2.0) {
    vec2 g = GRAD(curHead, hq);
    vec3 n = nrm(g, headD, 13.0);
    // cheekbones and brow under the skin
    vec2 cq = vec2(abs(hq.x), hq.y);
    float cheek = exp(-dot((cq - vec2(8.0, -11.0)) / vec2(4.0, 2.4), (cq - vec2(8.0, -11.0)) / vec2(4.0, 2.4)));
    float under = exp(-dot((cq - vec2(8.5, -7.6)) / vec2(4.5, 1.3), (cq - vec2(8.5, -7.6)) / vec2(4.5, 1.3)));
    float jawL = exp(-pow((length((hq - vec2(0.0, -15.0)) / vec2(12.4, 16.4)) - 0.86) * 9.0, 2.0)) * step(-12.0, hq.y);
    n = normalize(n + vec3(sign(hq.x) * cheek * 0.6, cheek * 0.45 - under * 0.35, 0.0));
    vec3 c = skinShade(hq, n, 1.0, 0.0);
    c *= 1.0 - 0.28 * under - 0.22 * jawL;
    // nostrils
    float nos = smoothstep(0.55, 0.15, length((cq - vec2(1.1, -10.7)) * vec2(1.4, 0.8)));
    c *= 1.0 - nos * 0.7;
    // the cheek lights
    for (int k = 0; k < 3; k++) {
      vec2 lc = vec2(7.4 + float(k) * 0.9, -9.6 + float(k) * 1.1);
      float dl = length(cq - lc);
      c = mix(c, rimB * 2.2 + vec3(0.25), smoothstep(0.45, 0.25, dl));
      c += rimB * exp(-dl * 1.6) * (0.35 + uDip * 0.4);
    }
    // the grin
    float xm = hq.x / 6.4;
    if (abs(xm) < 1.0) {
      float yu = -7.0 + 0.7 * (1.0 - xm * xm);
      float yl = -7.0 + uOpen * 1.2 * (1.0 - xm * xm);
      float inM = min(hq.y - yu, yl - hq.y);
      if (inM > -0.6) {
        vec3 mc = lin(vec3(0.09, 0.02, 0.07));
        if (uOpen > 1.2) mc = mix(mc, lin(vec3(0.85, 0.35, 0.55)), smoothstep(1.2, 0.0, length((hq - vec2(0.0, yl - 0.9)) * vec2(0.4, 1.0))));
        float teeth = smoothstep(0.75, 0.55, hq.y - yu) * step(0.0, hq.y - yu) * smoothstep(1.0, 0.8, abs(xm));
        mc = mix(mc, light(lin(vec3(0.97, 0.93, 0.95)), vec3(0.0, -0.3, 0.95), 50.0, 0.4, 0.0, vec3(0.0), 1.0) * (0.85 + 0.15 * step(0.12, abs(fract(hq.x / 1.6) - 0.5))), teeth);
        c = mix(c, mc, smoothstep(-0.4, 0.15, inM));
        c *= 1.0 - 0.35 * smoothstep(-0.9, -0.2, inM) * smoothstep(0.3, -0.2, inM);
      }
    }
    put(headD, c);
  }
  // the dome: glass over a brain that lights with the bass
  float dd = domeSD(hq);
  if (dd < px * 2.0) {
    vec2 g = GRAD(curDome, hq);
    float e = clamp(1.0 + dd / 9.0, 0.0, 1.0);
    vec3 n = normalize(vec3(g * e, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
    vec2 bq = hq + g * e * 1.6;                       // a little refraction at the rim
    vec2 w = bq + 3.2 * vec2(fbm(bq * 0.18 + 1.7), fbm(bq * 0.18 + 9.2));
    float folds = fbm(bq * 0.3);
    float sulci = abs(sin(w.y * 1.15 + w.x * 0.25));
    float ridge = smoothstep(0.08, 0.5, sulci);
    ridge *= smoothstep(0.0, 1.2, abs(bq.x));
    vec3 brain = lin(vec3(0.35, 0.1, 0.38)) * (0.35 + 0.75 * ridge);
    float pulse = 0.35 + uBass * 0.9;
    float wave = pow(0.5 + 0.5 * sin(bq.x * 0.6 - uT * 4.0 + folds * 6.0), 4.0);
    brain += rimB * (1.0 - ridge) * pulse * 1.1 + rimA * wave * (1.0 - ridge) * 0.4 * pulse;
    brain *= 0.55 + 0.45 * n.z;
    vec3 c = brain;
    // the glass: a cold sheen, the stage lights in it, a bright edge
    float fres = pow(1.0 - n.z, 2.5);
    c = mix(c, vec3(0.55, 0.55, 0.75), fres * 0.35);
    vec3 R = reflect(vec3(0.0, 0.0, -1.0), n);
    c += vec3(1.0) * smoothstep(0.82, 0.95, dot(R, normalize(vec3(-0.45, -0.75, 0.5)))) * 0.9;
    c += rimA * smoothstep(0.85, 0.97, dot(R, normalize(vec3(-0.9, -0.2, 0.4)))) * 0.8;
    c += rimB * smoothstep(0.85, 0.97, dot(R, normalize(vec3(0.9, -0.2, 0.4)))) * 0.8;
    c += vec3(0.9, 0.85, 1.0) * smoothstep(0.6, 0.0, abs(dd + 0.3)) * 0.35;
    put(dd, c);
  }
  // the visor
  {
    vec2 vq = hq - vec2(0.0, -15.9);
    float vd = sdRBox(vq, vec2(13.4, 3.5), 3.2);
    if (vd < px * 2.0) {
      vec3 n = normalize(vec3(vq.x / 17.0, vq.y / 9.0, 1.0));
      vec3 c = lin(vec3(0.01, 0.008, 0.02));
      // the LEDs, behind the glass
      float cell = floor((vq.x + 11.7) / 1.95);
      if (cell >= 0.0 && cell < 12.0) {
        float v = 0.0;
        for (int i = 0; i < 12; i++) if (float(i) == cell) v = uSpec[i];
        float bh = 0.6 + v * 5.4;
        float bx = -11.7 + cell * 1.95 + 0.95;
        float onBar = step(abs(vq.x - bx), 0.62) * step(3.1 - bh, vq.y) * step(vq.y, 3.1);
        float led = step(0.18, fract(vq.y * 1.4));
        vec3 hue = mix(rimA, rimB, cell / 11.0);
        c += hue * onBar * led * 2.2;
        c += hue * exp(-abs(vq.x - bx) * 1.4) * smoothstep(3.1 - bh - 1.5, 3.1, vq.y) * 0.18;
      }
      // the glass's reflection and a gloss streak
      float streak = smoothstep(0.6, 0.0, abs(vq.x + vq.y * 0.9 + 6.5)) * smoothstep(3.5, 0.0, vq.y + 3.0);
      c += vec3(0.6, 0.6, 0.75) * streak * 0.25;
      vec3 H = normalize(normalize(vec3(-0.3, -0.75, 0.6)) + vec3(0.0, 0.0, 1.0));
      c += vec3(1.0) * pow(max(dot(n, H), 0.0), 120.0) * 0.8;
      c += vec3(0.45, 0.45, 0.6) * pow(1.0 - n.z, 2.0) * 0.5;
      // its frame
      float frame = smoothstep(0.9, 0.3, abs(vd + 0.45));
      c = mix(c, light(lin(vec3(0.3, 0.28, 0.4)), n, 70.0, 0.8, 0.0, vec3(0.0), 1.0) + rimA * 0.25, frame);
      put(vd, c);
    }
  }
  // the beard, swinging with the nods
  {
    vec2 q = hq - vec2(0.0, 0.4);
    float k = clamp(q.y / 8.0, 0.0, 1.0);
    float cx = uSway * 0.8 * k * k;
    float w = mix(2.5, 0.2, pow(k, 1.2));
    float bd = max(abs(q.x - cx) - w, max(-q.y, q.y - 8.2));
    if (bd < px * 2.0) {
      float strands = 0.5 + 0.5 * sin((q.x - cx) * 7.0 / max(w, 0.4) + noise(q * vec2(2.0, 0.5)) * 3.0);
      vec3 n = normalize(vec3((q.x - cx) / max(w, 0.3) * 0.6, -0.2, 1.0));
      vec3 c = light(lin(vec3(0.33, 0.13, 0.33)) * (0.6 + 0.5 * strands), n, 30.0, 0.25, 0.3, lin(vec3(0.8, 0.3, 0.6)), 0.8);
      put(bd, c);
    }
  }

  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;
