// The costumes for the extended remixes, painted per pixel (Update 6.15).
// One shader, several pieces (uMode), each in its wearer's own units:
//   0  park ranger hat (Cicada remix): brim centre at 0,0, 100 units wide
//   1  witch's hat (Varrow): brim centre at 0,0, Varrow's units
//   2  a bat wing (Ilu): the shoulder joint at 0,0, as lib/rave/costumes.js
//   3  a bat ear (Ilu)
//   4  the vampire's cape and collar (Qeth's units)
// uSide mirrors the lighting for pieces drawn flipped (wings, ears).
import { FRAG as DJ } from "./djShader";
const COMMON = DJ.slice(DJ.indexOf("const float PI"), DJ.indexOf("// ---------- materials ----------"));

export const BOXES = {
  ranger: { x0: -55, y0: -40, w: 110, h: 53 },
  witch: { x0: -126, y0: -176, w: 252, h: 206 },
  wing: { x0: -5, y0: -37, w: 68, h: 60 },
  ear: { x0: -10, y0: -19, w: 20, h: 25 },
  cape: { x0: 4, y0: 36, w: 112, h: 128 },
};
export const MODES = { ranger: 0, witch: 1, wing: 2, ear: 3, cape: 4 };

export const CFRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uMode, uSide, uT, uB, uBass, uHueA, uHueB, uDip;
uniform vec4 uP;   // per piece: witch (tipX, tipY, -, -); cape (hem, flare, sway, -)
${COMMON}
#define GRAD(F, p) normalize(vec2(F(p + vec2(0.05, 0.0)) - F(p - vec2(0.05, 0.0)), F(p + vec2(0.0, 0.05)) - F(p - vec2(0.0, 0.05))) + 1e-5)

float sdSegP(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
// a lit felt: soft, matt, a nap that catches the light
vec3 felt(vec3 alb, vec2 p, vec3 n, float scale) {
  float nap = noise(p * 1.7 / scale) * 0.6 + noise(p * 5.0 / scale) * 0.4;
  alb *= 0.86 + 0.24 * nap;
  vec3 c = light(alb, n, 12.0, 0.08, 0.35, alb * 0.6, 1.0);
  // fuzz: felt glows a little at grazing angles
  c += alb * 0.35 * pow(1.0 - n.z, 2.0);
  return c;
}
vec3 metal(vec3 alb, vec3 n) {
  vec3 c = light(alb, n, 80.0, 1.2, 0.0, vec3(0.0), 1.0);
  c += alb * 0.25 * max(n.y, 0.0);
  return c;
}

// ───────── 0: park ranger hat ─────────
float rCrownTop(float x) {
  float ax = abs(x) / 30.0;
  float t = -34.6;
  t = mix(t, -27.0, smoothstep(0.02, 0.16, ax));            // the centre pinch
  t = mix(t, -31.4, smoothstep(0.18, 0.42, ax));            // the two side peaks
  t = mix(t, -26.0, smoothstep(0.55, 0.85, ax));            // down to the sides
  t = mix(t, -16.0, smoothstep(0.86, 1.0, ax));
  return t;
}
float rCrown(vec2 p) {
  float hw = 30.0 - 3.0 * smoothstep(-2.0, -30.0, p.y);
  return max(max(abs(p.x) - hw, rCrownTop(p.x) - p.y), p.y + 1.6);
}
float rBrim(vec2 p) {
  vec2 q = p - vec2(0.0, 0.00035 * p.x * p.x);   // the sides droop a touch
  return sdEll(q, vec2(50.0, 9.2));
}
void ranger(vec2 p) {
  vec3 tan = lin(vec3(0.70, 0.54, 0.33));
  float bd = rBrim(p), cd = rCrown(p);
  // back of the brim (behind the crown), then the crown, then the front
  if (bd < px && p.y < 0.0) {
    vec3 n = normalize(vec3(p.x / 140.0, -0.55, 0.8));
    vec3 c = felt(tan * 0.8, p, n, 0.6);
    c *= 1.0 - 0.45 * smoothstep(0.0, -4.0, bd + 2.0) * 0.0;
    c = mix(c, felt(tan * 0.55, p, n, 0.6), smoothstep(-1.4, -0.6, bd));   // the bound edge
    put(bd, c);
  }
  if (cd < px) {
    float hw = 30.0 - 3.0 * smoothstep(-2.0, -30.0, p.y);
    float ex = clamp(p.x / hw, -1.0, 1.0);
    // the dents: the crown's top pinched in four, creases running down
    float dTop = rCrownTop(p.x);
    float ny = -0.35 * smoothstep(dTop + 9.0, dTop, p.y);
    vec3 n = normalize(vec3(ex * 0.9, ny, sqrt(max(1.0 - ex * ex, 0.0)) + 0.15));
    float crease = 0.0;
    for (int i = 0; i < 2; i++) {
      float s = i == 0 ? -1.0 : 1.0;
      float d = sdSegP(p, vec2(s * 13.5, -31.0), vec2(s * 9.5, -14.0));
      crease = max(crease, smoothstep(1.6, 0.0, d));
      n.x += s * 0.35 * smoothstep(3.5, 0.0, d) * sign(p.x * s - abs(p.x));
    }
    float cpinch = sdSegP(p, vec2(0.0, -27.0), vec2(0.0, -18.0));
    crease = max(crease, smoothstep(1.4, 0.0, cpinch));
    n = normalize(n);
    vec3 c = felt(tan, p, n, 0.6);
    c *= 1.0 - 0.45 * crease;
    // the band, leather, stitched, and the gold badge
    if (p.y > -8.2 && p.y < -2.4) {
      vec3 bn = normalize(vec3(ex * 0.9, (p.y + 5.3) / 7.0, sqrt(max(1.0 - ex * ex, 0.0)) + 0.1));
      vec3 bc = light(lin(vec3(0.24, 0.15, 0.07)) * (0.85 + 0.2 * noise(p * vec2(0.5, 4.0))), bn, 40.0, 0.45, 0.0, vec3(0.0), 1.0);
      bc += vec3(0.9, 0.8, 0.6) * 0.12 * step(0.55, fract(p.x * 0.9)) * (smoothstep(0.3, 0.0, abs(p.y + 7.4)) + smoothstep(0.3, 0.0, abs(p.y + 3.1)));
      c = mix(c, bc, smoothstep(-8.2, -7.8, p.y) * smoothstep(-2.4, -2.8, p.y));
    }
    // badge: a gold shield, embossed
    vec2 bq = p - vec2(0.0, -5.6);
    float sh = max(sdRBox(bq + vec2(0.0, 0.9), vec2(3.4, 2.6), 0.6), length(bq * vec2(1.0, 0.85) - vec2(0.0, -0.6)) - 4.2);
    if (sh < px) {
      vec3 gn = normalize(vec3(bq / 6.0 + normalize(bq + 1e-3) * 0.9 * smoothstep(-1.0, 0.0, sh), 1.0));
      vec3 gc = metal(lin(vec3(0.95, 0.76, 0.34)), gn);
      gc *= 1.0 - 0.35 * smoothstep(0.35, 0.0, abs(length(bq - vec2(0.0, -0.3)) - 1.6));   // a ring stamped in it
      c = mix(c, gc, clamp(0.5 - sh / px, 0.0, 1.0));
    }
    put(cd, c);
  }
  if (bd < px && p.y >= -1.6) {
    // the front of the brim, tipped down toward you; its underside dark
    float u = clamp(p.y / 9.2, 0.0, 1.0);
    vec3 n = normalize(vec3(p.x / 120.0, -0.7 + u * 0.9, 0.7));
    vec3 c = felt(tan * 0.92, p, n, 0.6);
    c *= 1.0 - 0.35 * smoothstep(0.0, 1.0, u) * smoothstep(-6.0, 0.0, p.y - 6.5);
    // its bound, stitched edge
    float edge = smoothstep(-1.6, -0.7, bd);
    c = mix(c, felt(tan * 0.5, p, n, 0.6), edge);
    c += vec3(1.0, 0.9, 0.7) * 0.06 * step(0.6, fract(atan(p.y, p.x) * 40.0)) * smoothstep(0.4, 0.0, abs(bd + 2.4));
    // the crown's shadow on the brim
    c *= 1.0 - 0.4 * smoothstep(6.0, 0.0, abs(p.x) - 26.0) * smoothstep(5.0, 0.0, p.y);
    put(bd, c);
  }
}

// ───────── 1: witch's hat ─────────
vec2 witchPt(float t) {
  vec2 a = vec2(0.0, -4.0), b = vec2(-8.0, -112.0), c = uP.xy;
  float u = 1.0 - t; return u * u * a + 2.0 * u * t * b + t * t * c;
}
float witchW(float t) { return 63.0 * pow(1.0 - t, 1.15) + 1.0; }
// distance to the cone: nearest point on its bent centreline, less its width
vec3 witchCone(vec2 p) {   // x: signed distance, y: t, z: side (-1..1)
  float bt = 0.0, bd = 1e9;
  for (int i = 0; i <= 28; i++) {
    float t = float(i) / 28.0;
    float d = length(p - witchPt(t)) - witchW(t);
    if (d < bd) { bd = d; bt = t; }
  }
  // refine
  for (int i = 0; i < 6; i++) {
    float h = 0.5 / 28.0 / pow(2.0, float(i));
    float ta = clamp(bt - h, 0.0, 1.0), tb = clamp(bt + h, 0.0, 1.0);
    float da = length(p - witchPt(ta)) - witchW(ta), db = length(p - witchPt(tb)) - witchW(tb);
    if (da < bd) { bd = da; bt = ta; } if (db < bd) { bd = db; bt = tb; }
  }
  vec2 tg = normalize(witchPt(min(bt + 0.01, 1.0)) - witchPt(max(bt - 0.01, 0.0)));
  vec2 nn = vec2(-tg.y, tg.x);
  float side = dot(p - witchPt(bt), nn) / witchW(bt);
  return vec3(bd, bt, side);
}
float wBrim(vec2 p) {
  float a = atan(p.y, p.x);
  vec2 r = vec2(118.0, 24.0) * (1.0 + 0.025 * sin(a * 5.0 + 1.0) + 0.015 * sin(a * 9.0));
  return sdEll(p, r);
}
void witch(vec2 p) {
  vec3 purple = lin(vec3(0.20, 0.10, 0.28));
  float bd = wBrim(p);
  vec3 W = witchCone(p);
  float cd = max(W.x, p.y + 2.0 - 6.0 * (1.0 - smoothstep(0.0, 60.0, abs(p.x))) * 0.0);
  if (bd < px && p.y < 0.0) {
    vec3 n = normalize(vec3(p.x / 300.0, -0.65, 0.75));
    vec3 c = felt(purple * 0.7, p, n, 1.6);
    c = mix(c, felt(purple * 0.4, p, n, 1.6), smoothstep(-3.0, -1.0, bd));
    put(bd, c);
  }
  if (cd < px) {
    float t = W.y, e = clamp(W.z, -1.0, 1.0);
    vec2 tg = normalize(witchPt(min(t + 0.01, 1.0)) - witchPt(max(t - 0.01, 0.0)));
    vec2 nn = vec2(-tg.y, tg.x);
    vec3 n = normalize(vec3(nn * e * 0.95, sqrt(max(1.0 - e * e, 0.0)) + 0.12));
    // the crumple: wrinkles round the cone, deeper where it bends
    float wr = sin(t * 46.0 + e * 2.2 + fbm(vec2(t * 8.0, e * 2.0)) * 3.0);
    float bend = smoothstep(0.35, 0.7, t);
    n = normalize(n + vec3(tg * wr * 0.25 * (0.4 + bend), 0.0));
    vec3 c = felt(purple * (0.9 + 0.2 * smoothstep(0.0, 0.9, -e)), p, n, 1.6);
    c *= 1.0 - 0.3 * smoothstep(0.6, 1.0, wr) * (0.4 + bend);
    // a patch, stitched on with orange thread
    vec2 pq = vec2(e, t);
    float pd = sdRBox(pq - vec2(-0.42, 0.40), vec2(0.2, 0.055), 0.01);
    if (pd < 0.0) {
      vec3 pc = felt(lin(vec3(0.36, 0.22, 0.10)), p, n, 1.2);
      float edge = smoothstep(-0.03, -0.012, pd);
      pc = mix(pc, lin(vec3(0.95, 0.6, 0.22)) * 0.9, edge * step(0.5, fract((e + t * 3.0) * 30.0)));
      c = pc;
    }
    // an old tear, stitched across
    float tear = abs(e - 0.32 - (t - 0.55) * 0.8) * witchW(t);
    float onTear = step(0.47, t) * step(t, 0.6);
    c *= 1.0 - 0.7 * smoothstep(0.9, 0.2, tear) * onTear;
    c = mix(c, lin(vec3(0.9, 0.85, 0.7)), smoothstep(0.35, 0.1, abs(fract(t * 90.0) - 0.5) * 2.0 - 0.6) * smoothstep(3.0, 1.0, tear) * onTear * 0.8);
    // the band and its buckle
    if (t < 0.13) {
      float bt = smoothstep(0.02, 0.03, t) * smoothstep(0.125, 0.115, t);
      vec3 bc = light(lin(vec3(0.91, 0.46, 0.12)) * (0.8 + 0.2 * noise(p * vec2(0.8, 0.2))), n, 30.0, 0.35, 0.2, lin(vec3(1.0, 0.5, 0.1)), 1.0);
      bc *= 1.0 - 0.4 * smoothstep(0.02, 0.0, abs(t - 0.074)) * 0.0;
      c = mix(c, bc, bt);
      vec2 bq = p - vec2(0.0, -12.0);
      float fr = sdRBox(bq, vec2(12.0, 9.0), 1.0), hole = sdRBox(bq, vec2(6.4, 4.6), 0.6);
      float frame = max(fr, -hole);
      if (frame < px) {
        vec3 gn = normalize(vec3(normalize(bq + 1e-3) * 0.6 * (smoothstep(-1.2, 0.0, fr) - smoothstep(-1.2, 0.0, -hole)), 1.0));
        vec3 gc = metal(lin(vec3(0.85, 0.72, 0.48)), gn);
        gc *= 0.75 + 0.25 * smoothstep(-2.4, 0.0, -abs(frame + 1.4));
        c = mix(c, gc, clamp(0.5 - frame / px, 0.0, 1.0));
      }
      if (hole < 0.0) c *= 0.55;
    }
    put(cd, c);
  }
  if (bd < px && p.y >= 0.0) {
    float u = clamp(p.y / 24.0, 0.0, 1.0);
    vec3 n = normalize(vec3(p.x / 320.0, -0.6 + u * 0.8, 0.75));
    vec3 c = felt(purple * 0.85, p, n, 1.6);
    c = mix(c, felt(purple * 0.45, p, n, 1.6), smoothstep(-3.0, -1.0, bd));
    c *= 1.0 - 0.45 * smoothstep(40.0, 0.0, abs(p.x)) * smoothstep(10.0, 0.0, p.y);  // the cone's shadow
    put(bd, c);
  }
}

// ───────── 2: bat wing ─────────
float sdPoly6(vec2 p, vec2 v0, vec2 v1, vec2 v2, vec2 v3, vec2 v4, vec2 v5) {
  float d = dot(p - v0, p - v0), s = 1.0;
  vec2 vs[6]; vs[0] = v0; vs[1] = v1; vs[2] = v2; vs[3] = v3; vs[4] = v4; vs[5] = v5;
  for (int i = 0; i < 6; i++) {
    vec2 vi = vs[i];
    vec2 vj = i == 0 ? v5 : (i == 1 ? v0 : (i == 2 ? v1 : (i == 3 ? v2 : (i == 4 ? v3 : v4))));
    vec2 e = vj - vi, w = p - vi;
    vec2 b = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
    d = min(d, dot(b, b));
    bvec3 c = bvec3(p.y >= vi.y, p.y < vj.y, e.x * w.y > e.y * w.x);
    if (all(c) || all(not(c))) s *= -1.0;
  }
  return s * sqrt(d);
}
float wingSD(vec2 p) {
  float d = sdPoly6(p, vec2(0.0, 0.0), vec2(30.0, -26.0), vec2(58.0, -10.0), vec2(46.0, 10.0), vec2(30.0, 16.0), vec2(8.0, 18.0));
  // scalloped trailing edge between the finger bones
  d = max(d, -(length(p - vec2(56.5, 4.0)) - 8.6));
  d = max(d, -(length(p - vec2(39.0, 18.0)) - 6.4));
  d = max(d, -(length(p - vec2(19.0, 24.5)) - 8.8));
  return d;
}
void wing(vec2 p) {
  float d = wingSD(p);
  vec2 W0 = vec2(0.0), WR = vec2(30.0, -26.0);
  float bone = min(min(sdSegP(p, W0, WR) - 1.6, sdSegP(p, WR, vec2(58.0, -10.0)) - 0.9), min(sdSegP(p, WR, vec2(46.0, 10.0)) - 0.8, min(sdSegP(p, WR, vec2(30.0, 16.0)) - 0.75, sdSegP(p, WR, vec2(8.0, 18.0)) - 0.6)));
  if (d < px * 2.0 || bone < px * 2.0) {
    // the membrane: dark leather, thin enough at the edges for the stage
    // light to glow through it, drawn tight between the finger bones
    float edge = smoothstep(5.0, 0.0, -d);
    float nearBone = smoothstep(3.5, 0.0, bone);
    vec3 n = normalize(vec3(sin(p.x * 0.3 + p.y * 0.25) * 0.18 * uSide, -0.3 + 0.2 * sin(p.y * 0.35 + p.x * 0.1), 0.92));
    vec3 alb = lin(vec3(0.13, 0.05, 0.15)) * (0.85 + 0.25 * noise(p * 0.9));
    vec3 c = light(alb, n, 30.0, 0.35, 0.5, lin(vec3(0.5, 0.1, 0.3)), 1.0);
    vec3 back = mix(rimA, rimB, smoothstep(0.0, 60.0, p.x)) * 0.5 + lin(vec3(0.7, 0.12, 0.25)) * 0.5;
    c += back * (0.12 + 0.55 * edge) * (1.0 - nearBone) * (0.7 + 0.3 * uDip);
    // veins running out along the bones, faint
    vec2 w2 = p + 2.5 * vec2(fbm(p * 0.1), fbm(p * 0.1 + 7.0));
    float vein = smoothstep(0.035, 0.0, abs(fbm(w2 * 0.3) - 0.5)) * (0.3 + 0.7 * edge);
    c = mix(c, lin(vec3(0.5, 0.06, 0.16)), vein * 0.35);
    // tension creases from each bone
    c *= 1.0 - 0.35 * nearBone * smoothstep(0.0, 1.5, bone);
    if (d < px * 2.0) put(d, c);
    if (bone < px) {
      float e = clamp(-bone / 1.2, 0.0, 1.0);
      vec3 bn = normalize(vec3(0.0, -0.6, 0.6 + e));
      vec3 bc = light(lin(vec3(0.38, 0.22, 0.42)), bn, 40.0, 0.5, 0.3, lin(vec3(0.6, 0.2, 0.4)), 1.0);
      put(bone, bc);
    }
    // the thumb claw at the wrist
    vec2 cq = p - vec2(31.5, -29.0);
    float cl = sdEll(rot(cq, 0.5), vec2(1.0, 2.6));
    if (cl < px) put(cl, light(lin(vec3(0.92, 0.88, 0.96)), vec3(0.0, -0.3, 0.95), 90.0, 0.9, 0.0, vec3(0.0), 1.0));
  }
}

// ───────── 3: bat ear ─────────
void ear(vec2 p) {
  float d = sdTri(p, vec2(-7.0, 4.0), vec2(4.0, -16.0), vec2(7.0, 4.0));
  d = d - 0.8;
  if (d > px * 2.0) return;
  float ex = clamp((p.x + 1.0) / 8.0, -1.0, 1.0);
  vec3 n = normalize(vec3(ex * 0.8 * uSide, -0.2, 0.8));
  vec3 c = light(lin(vec3(0.17, 0.07, 0.19)) * (0.8 + 0.3 * noise(p * vec2(3.0, 0.8))), n, 20.0, 0.15, 0.3, vec3(0.3, 0.05, 0.2), 1.0);
  // fur at the edge
  c += lin(vec3(0.6, 0.4, 0.7)) * 0.18 * pow(1.0 - n.z, 2.0);
  float di = sdTri(p, vec2(-3.6, 2.4), vec2(3.0, -10.6), vec2(3.6, 2.4));
  if (di < 0.0) {
    vec3 ic = light(lin(vec3(0.75, 0.32, 0.52)), normalize(vec3(-ex * 0.5 * uSide, 0.1, 0.9)), 30.0, 0.3, 0.8, lin(vec3(1.0, 0.4, 0.5)), 1.0);
    ic *= 0.75 + 0.25 * sin(p.y * 2.4);                                   // folds inside
    ic *= 1.0 - 0.5 * smoothstep(-1.5, 0.0, di);
    c = ic;
  }
  put(d, c);
}

// ───────── 4: the vampire's cape and collar (Qeth) ─────────
float capeEdgeX(float y, float side) {
  float h = uP.x, fl = uP.y, sw = uP.z;
  float yy = clamp(y, 84.0, 158.0);
  float t = (-56.0 + sqrt(max(56.0 * 56.0 - 72.0 * (84.0 - yy), 0.0))) / 36.0;
  float x0 = side < 0.0 ? 36.0 : 84.0;
  float x1 = side < 0.0 ? 20.0 + h * 0.5 : 100.0 + h * 0.5;
  float x2 = side < 0.0 ? 14.0 + h * 1.3 - fl + sw : 106.0 + h * 1.3 + fl + sw;
  float u = 1.0 - t; return u * u * x0 + 2.0 * u * t * x1 + t * t * x2;
}
float capeHem(float x) {
  float h = uP.x, fl = uP.y, sw = uP.z;
  float xl = 14.0 + h * 1.3 - fl + sw, xr = 106.0 + h * 1.3 + fl + sw;
  float k = clamp((x - xl) / (xr - xl), 0.0, 1.0) * 6.0;
  float f = fract(k);
  // points of the jagged hem, a little rounded
  float a = mod(floor(k), 2.0) < 0.5 ? 2.0 : -5.0, b = mod(floor(k), 2.0) < 0.5 ? -5.0 : 2.0;
  return 158.0 + mix(a, b, smoothstep(0.0, 1.0, f));
}
void cape(vec2 p) {
  vec3 blk = lin(vec3(0.05, 0.025, 0.05)), red = lin(vec3(0.62, 0.04, 0.08));
  // the collar first (it stands behind the head; the cape behind the robe)
  for (int i = 0; i < 2; i++) {
    float s = i == 0 ? -1.0 : 1.0;
    vec2 q = vec2(60.0 + (p.x - 60.0) * s, p.y);   // as the right-hand piece
    float d = sdQuad(q, vec2(68.0, 86.0), vec2(96.0, 42.0), vec2(86.0, 46.0), vec2(71.0, 70.0)) - 0.6;
    if (d < px) {
      // its inside faces you: crimson satin, with the stiffening bones fanning up
      vec2 o = q - vec2(68.0, 86.0);
      float ang = atan(o.y, o.x);
      float rib = abs(sin(ang * 10.0));
      vec3 n = normalize(vec3(cos(ang * 10.0) * 0.3 * s, -0.4, 0.85));
      vec3 c = light(red * (0.65 + 0.35 * rib), n, 60.0, 0.8, 0.4, lin(vec3(1.0, 0.2, 0.2)), 1.0);
      c *= 0.55 + 0.45 * smoothstep(0.0, 30.0, length(o));
      // gold piping on its edge
      c = mix(c, metal(lin(vec3(0.85, 0.66, 0.3)), vec3(0.0, -0.4, 0.9)), smoothstep(-1.1, -0.5, d));
      put(d, c);
    }
  }
  float xl = capeEdgeX(p.y, -1.0), xr = capeEdgeX(p.y, 1.0);
  float d = max(max(xl - p.x, p.x - xr), max(84.0 - p.y, p.y - capeHem(p.x)));
  if (d > px * 2.0) return;
  float u = clamp((p.x - xl) / max(xr - xl, 1.0), 0.0, 1.0);
  float v = clamp((p.y - 84.0) / 74.0, 0.0, 1.0);
  // folds falling from the shoulders, swinging with it
  float f = sin(u * 26.0 + v * 2.0 + uP.z * 0.15 + sin(v * 3.0 + uT * 0.8) * 0.6);
  vec3 n = normalize(vec3((u - 0.5) * 1.4 + f * 0.35, -0.2, 0.85));
  vec3 c = light(blk, n, 70.0, 0.7, 0.0, vec3(0.0), 1.0);
  c += lin(vec3(0.35, 0.1, 0.3)) * 0.25 * smoothstep(0.6, 1.0, f) * (0.5 + 0.5 * v);  // satin sheen on the folds
  // the red lining showing where it turns at the edges and the hem
  float lin_ = max(smoothstep(0.06, 0.0, u) + smoothstep(0.94, 1.0, u), smoothstep(-3.0, 0.0, p.y - capeHem(p.x)) * 0.8);
  c = mix(c, light(red, normalize(vec3(-n.x, n.y, n.z)), 60.0, 0.8, 0.4, lin(vec3(1.0, 0.2, 0.2)), 1.0), clamp(lin_, 0.0, 1.0));
  put(d, c);
}

void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uBox.x + f.x * uBox.z, uBox.y + (1.0 - f.y) * uBox.w);
  px = uBox.z / uRes.x;
  rimA = lin(hsl2rgb(uHueA, 1.0, 0.62)) * 1.1;
  rimB = lin(hsl2rgb(uHueB, 1.0, 0.68)) * 1.1;
  if (uMode < 0.5) ranger(p);
  else if (uMode < 1.5) witch(p);
  else if (uMode < 2.5) wing(p);
  else if (uMode < 3.5) ear(p);
  else cape(p);
  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;
