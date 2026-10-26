// The Cryptex, rendered in 3D (Update 6.20): a ray-marched alien device. A
// horizontal cylinder of dark titanium: three nine-sided drums, each face
// carrying one of the nine marks as a glowing engraving; chrome bezels between
// them with light running in their seams; end caps with gold-inlaid grooves,
// fins and a glowing core at each tip. Held drums burn gold. Opened, the caps
// slide apart, the drums part, and light pours out of the axle.

export const CX_FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT, uOpen, uShake, uYaw, uPitch, uHover;
uniform vec3 uRot;          // each drum's angle (radians)
uniform vec3 uLock;         // 0/1 per drum (eased)
uniform vec3 uEdge[40];     // (glyph, a, b) for every line of every mark
uniform float uDots[9];     // each mark's dots, as a bit mask

const float PI = 3.14159265;
const float SEC = 6.28318530 / 9.0;
const float R = 0.6, W = 0.30;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 x) { vec2 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
float smax(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return max(a, b) + h * h * k * 0.25; }

float gap() { return 1.0 + uOpen * 0.16; }
float drumX(int i) { return (float(i) - 1.0) * 0.72 * gap(); }
float capX() { return 1.12 * gap() + uOpen * 0.32; }

// one drum: a nonagon prism with chamfered edges. face: which facet; fuv: where on it
float drum(vec3 p, int i, float ang, out float face, out vec2 fuv) {
  vec3 q = p - vec3(drumX(i), 0.0, 0.0);
  float a = atan(q.y, q.z) - ang;
  float k = floor(a / SEC + 0.5);
  float la = a - k * SEC;
  float r = length(q.yz);
  float apo = R * cos(SEC * 0.5);
  float d = r * cos(la) - apo;
  d = smax(d, abs(q.x) - W, 0.04);
  face = mod(-k, 9.0);
  fuv = vec2(q.x, r * sin(la));
  return d;
}
float cyl(vec3 p, float x0, float hw, float r, float rr) {
  vec2 d = vec2(length(p.yz) - r, abs(p.x - x0) - hw);
  return min(max(d.x, d.y), 0.0) + length(max(d + rr, 0.0)) - rr;
}
// an end cap: the grooved collar, a cone, the core; s = -1 left, +1 right
float cap(vec3 p, float s, out float groove) {
  vec3 q = vec3(p.x * s - capX(), p.y, p.z);   // q.x from the collar's inner face outward
  float r = length(q.yz);
  float collar = max(r - 0.66, max(-q.x, q.x - 0.36));
  groove = q.x;
  // grooves round the collar
  float g = abs(fract(q.x / 0.09) - 0.5) * 0.09;
  collar += smoothstep(0.012, 0.0, g - 0.012) * 0.012 * step(0.03, q.x) * step(q.x, 0.33);
  // fins: three blades round it
  float fa = atan(q.y, q.z); float fk = floor(fa / (6.2831 / 3.0) + 0.5); float fl = fa - fk * (6.2831 / 3.0);
  float fin = max(max(abs(r * sin(fl)) - 0.035, r * cos(fl) - 0.78 + q.x * 0.5), max(-q.x + 0.05, q.x - 0.32));
  // the cone to the tip
  float t = clamp((q.x - 0.36) / 0.32, 0.0, 1.0);
  float cone = max(r - mix(0.56, 0.2, t), max(-(q.x - 0.36), q.x - 0.68));
  return min(min(collar, fin), cone);
}
float core(vec3 p, float s) { return length(p - vec3(s * (capX() + 0.74), 0.0, 0.0)) - 0.13; }

// the scene: distance, and which part (1-3 drums, 4 bezel, 5 cap, 6 core, 7 axle)
float scene(vec3 p, out float id, out float face, out vec2 fuv) {
  p.y += sin(uT * 70.0) * 0.012 * uShake;
  float d = 1e9; id = 0.0; face = 0.0; fuv = vec2(0.0);
  for (int i = 0; i < 3; i++) {
    float f; vec2 uv;
    float dd = drum(p, i, uRot[i], f, uv);
    if (dd < d) { d = dd; id = float(i) + 1.0; face = f; fuv = uv; }
  }
  // bezels: between the drums and at each end
  for (int i = 0; i < 4; i++) {
    float bx = (float(i) - 1.5) * 0.72 * gap();
    if (i == 0) bx = -capX() + 0.005; if (i == 3) bx = capX() - 0.005;
    float b = cyl(p, bx, 0.035, 0.635, 0.02);
    if (b < d) { d = b; id = 4.0; fuv = vec2(p.x - bx, atan(p.y, p.z)); }
  }
  for (int s = 0; s < 2; s++) {
    float sg = s == 0 ? -1.0 : 1.0; float gr;
    float c = cap(p, sg, gr);
    if (c < d) { d = c; id = 5.0; fuv = vec2(gr, atan(p.y, p.z)); }
    float k = core(p, sg);
    if (k < d) { d = k; id = 6.0; }
  }
  float ax = cyl(p, 0.0, capX(), 0.2, 0.0);
  if (ax < d) { d = ax; id = 7.0; }
  return d;
}
float sceneD(vec3 p) { float a, b; vec2 c; return scene(p, a, b, c); }
vec3 normal(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(sceneD(p + e.xyy) - sceneD(p - e.xyy), sceneD(p + e.yxy) - sceneD(p - e.yxy), sceneD(p + e.yyx) - sceneD(p - e.yyx)));
}

// one of the nine marks, engraved on a facet: lines between nine points on a ring
float bit(float m, float i) { return mod(floor(m / pow(2.0, i)), 2.0); }
vec2 pt(float i) { float a = (-90.0 + i * 40.0) * PI / 180.0; return vec2(cos(a), -sin(a)) * 0.15; }
float segD(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
float glyph(vec2 uv, float g, out float faint) {
  float d = 1e9;
  for (int i = 0; i < 40; i++) {
    if (abs(uEdge[i].x - g) > 0.5) continue;
    d = min(d, segD(uv, pt(uEdge[i].y), pt(uEdge[i].z)) - 0.0065);
  }
  float m = 0.0;
  for (int k = 0; k < 9; k++) if (abs(float(k) - g) < 0.5) m = uDots[k];
  faint = 1e9;
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    float on = bit(m, fi);
    float dd = length(uv - pt(fi)) - mix(0.006, 0.017, on);
    if (on > 0.5) d = min(d, dd); else faint = min(faint, dd);
    faint = min(faint, segD(uv, pt(fi), pt(mod(fi + 1.0, 9.0))) - 0.0015);
  }
  return d;
}

// the room it's in, reflected: a dark lab with two soft lights and the stage's colours
vec3 env(vec3 r) {
  vec3 c = mix(vec3(0.015, 0.016, 0.035), vec3(0.09, 0.09, 0.16), smoothstep(-0.4, 0.8, r.y));
  c += vec3(1.0, 0.95, 0.9) * 2.2 * smoothstep(0.82, 0.97, dot(r, normalize(vec3(-0.5, 0.75, 0.45))));
  c += vec3(0.6, 0.7, 1.0) * 0.9 * smoothstep(0.86, 0.99, dot(r, normalize(vec3(0.7, 0.35, 0.6))));
  c += vec3(0.25, 0.85, 0.8) * 0.25 * smoothstep(0.2, 1.0, -r.x);
  c += vec3(0.6, 0.35, 0.95) * 0.25 * smoothstep(0.2, 1.0, r.x);
  return c;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - uRes * 0.5) / uRes.y;
  // the camera: in front, a little above, turning toward the pointer
  float yaw = uYaw, pit = 0.2 + uPitch;
  float dist = 4.4 + uOpen * 0.9;
  vec3 ro = vec3(sin(yaw) * dist * cos(pit), sin(pit) * dist, cos(yaw) * dist * cos(pit));
  vec3 ta = vec3(0.0, -0.02, 0.0);
  vec3 fw = normalize(ta - ro), rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0))), up = cross(rt, fw);
  vec3 rd = normalize(fw * 2.3 + rt * uv.x + up * uv.y);

  float t = 0.0, id = 0.0, face = 0.0; vec2 fuv = vec2(0.0);
  bool hit = false;
  for (int i = 0; i < 110; i++) {
    vec3 p = ro + rd * t;
    float d = scene(p, id, face, fuv);
    if (d < 0.0008 * t) { hit = true; break; }
    t += d * 0.9;
    if (t > 9.0) break;
  }
  vec3 col = vec3(0.0); float alpha = 0.0;
  vec3 glowC = vec3(0.0);
  vec3 teal = vec3(0.33, 0.95, 0.9), gold = vec3(1.0, 0.8, 0.45), violet = vec3(0.6, 0.4, 1.0);
  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = normal(p);
    vec3 v = -rd;
    vec3 L = normalize(vec3(-0.45, 0.8, 0.5));
    float dif = max(dot(n, L), 0.0);
    vec3 h = normalize(L + v);
    float fres = pow(1.0 - max(dot(n, v), 0.0), 5.0);
    vec3 refl = reflect(rd, n);
    vec3 base; float rough; float metal = 1.0;
    vec3 emit = vec3(0.0);
    if (id < 3.5) {
      // a drum: dark titanium, brushed across; its mark glowing
      int di = int(id) - 1;
      float lockK = di == 0 ? uLock.x : di == 1 ? uLock.y : uLock.z;
      float brush = noise(vec2(fuv.x * 220.0, fuv.y * 6.0 + face * 9.0));
      base = vec3(0.16, 0.17, 0.21) * (0.85 + 0.3 * brush);
      rough = 0.35;
      // where this facet faces: the front one is the one that's read
      float worldA = (-face) * SEC + (di == 0 ? uRot.x : di == 1 ? uRot.y : uRot.z);
      float front = smoothstep(0.55, 0.98, cos(worldA - atan(ro.y, ro.z) * 0.0));
      float faint;
      float gd = glyph(vec2(fuv.x, fuv.y), face, faint);
      vec3 gc = mix(teal, gold, lockK);
      float hov = abs(uHover - float(di)) < 0.5 ? 0.35 : 0.0;
      float on = 0.18 + front * (1.1 + hov) + lockK * front * 0.8;
      // engraved: the groove is dark, its floor glows
      base *= 1.0 - 0.6 * smoothstep(0.012, 0.0, gd);
      emit += gc * on * smoothstep(0.004, -0.004, gd) * 2.2;
      emit += gc * on * 0.25 * exp(-max(gd, 0.0) * 90.0);
      emit += gc * 0.08 * (0.3 + front) * smoothstep(0.003, 0.0, faint);
      // the facet seams: light in the cracks between faces
      float seam = smoothstep(0.9, 1.0, abs(fuv.y) / (R * sin(SEC * 0.5)));
      emit += mix(teal, gold, lockK) * seam * (0.2 + 0.3 * sin(uT * 2.0 + face + float(di)) * 0.5 + front * 0.4);
      // a fine engraved border round each face
      float bx = abs(fuv.x) - (W - 0.03), by = abs(fuv.y) - (R * sin(SEC * 0.5) - 0.03);
      base *= 1.0 - 0.4 * smoothstep(0.006, 0.0, abs(max(bx, by)));
      // the front face is framed in light (the reading line)
      emit += gc * front * 0.5 * smoothstep(0.008, 0.0, abs(max(bx, by))) * (0.6 + lockK);
    } else if (id < 4.5) {
      // a bezel: polished chrome, a ring of light round its middle
      base = vec3(0.75, 0.74, 0.82); rough = 0.12;
      emit += mix(teal, violet, 0.5 + 0.5 * sin(uT * 0.8 + fuv.y * 3.0)) * smoothstep(0.008, 0.0, abs(fuv.x)) * (0.6 + 0.4 * sin(uT * 3.0 + fuv.y * 9.0));
      // small rivets round it
      float rv = length(vec2(fract(fuv.y / (6.2831 / 18.0)) - 0.5, (fuv.x) / 0.03));
      base *= 1.0 - 0.3 * smoothstep(0.25, 0.1, rv);
    } else if (id < 5.5) {
      // an end cap: dark, with gold in its grooves
      float gv = abs(fract(fuv.x / 0.09) - 0.5);
      float inGroove = smoothstep(0.12, 0.05, gv) * step(0.03, fuv.x) * step(fuv.x, 0.33);
      base = mix(vec3(0.1, 0.1, 0.13), vec3(0.9, 0.68, 0.3), inGroove); rough = mix(0.4, 0.2, inGroove);
      emit += gold * inGroove * (0.08 + uOpen * 0.5);
      // alien script running round the cone
      float sc = step(0.4, fuv.x) * step(fuv.x, 0.6) * step(0.7, noise(vec2(fuv.y * 12.0, floor(fuv.x * 30.0))));
      emit += teal * sc * 0.35;
    } else if (id < 6.5) {
      // the core: a living light
      base = vec3(0.0); rough = 0.0; metal = 0.0;
      float pul = 0.7 + 0.3 * sin(uT * 3.0);
      emit += mix(teal, gold, uOpen) * (1.6 + pul + uOpen * 2.0);
    } else {
      // the axle, seen when it opens: white-gold, too bright to look at
      base = vec3(0.0); rough = 0.0; metal = 0.0;
      emit += mix(gold, vec3(1.0), 0.5) * (1.0 + 4.0 * uOpen) * (0.8 + 0.2 * sin(uT * 9.0 + p.x * 20.0));
    }
    // lighting: a key, the room in its reflections, a rim in the device's colours
    float spec = pow(max(dot(n, h), 0.0), mix(400.0, 20.0, rough)) * (1.0 - rough);
    vec3 F0 = mix(vec3(0.04), base, metal);
    vec3 F = F0 + (1.0 - F0) * fres;
    vec3 c = base * (1.0 - metal) * (dif * 0.9 + 0.1);
    c += env(refl) * F * (1.0 - rough * 0.7);
    c += spec * F * 2.5;
    c += base * metal * dif * 0.25;
    // the light from the open seams on everything near the middle
    c += gold * uOpen * 0.3 * exp(-abs(p.x) * 1.2) * max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0);
    // ambient occlusion, cheap: how much room is round this point
    float ao = 0.0, sc2 = 1.0;
    for (int i = 1; i <= 4; i++) { float hh = 0.02 * float(i); ao += (hh - sceneD(p + n * hh)) * sc2; sc2 *= 0.6; }
    c *= clamp(1.0 - ao * 7.0, 0.3, 1.0);
    col = c + emit;
    alpha = 1.0;
  } else {
    // its shadow on the table below, and a faint glow under it
    float tf = (-0.95 - ro.y) / rd.y;
    if (tf > 0.0) {
      vec3 fp = ro + rd * tf;
      float sh = exp(-(fp.z * fp.z) / 0.28 - pow(max(abs(fp.x) - capX() - 0.4, 0.0), 2.0) / 0.12);
      alpha = sh * 0.65;
      col = mix(teal, violet, 0.5 + 0.5 * sin(fp.x)) * sh * 0.05;
    }
  }
  // light pouring out of the gaps when it's open, and a haze round the cores
  if (uOpen > 0.01) {
    for (int i = 0; i < 4; i++) {
      float gx = (float(i) - 1.5) * 0.72 * gap(); if (i == 0) gx = -capX() + 0.15 * uOpen; if (i == 3) gx = capX() - 0.15 * uOpen;
      vec3 c0 = vec3(gx, 0.0, 0.0) - ro;
      float tt = max(dot(c0, rd), 0.0);
      float dd = length(c0 - rd * tt);
      glowC += vec3(1.0, 0.85, 0.55) * uOpen * (exp(-dd * 9.0) * 0.6 + exp(-dd * 2.5) * 0.15);
    }
  }
  for (int s = 0; s < 2; s++) {
    vec3 c0 = vec3((s == 0 ? -1.0 : 1.0) * (capX() + 0.74), 0.0, 0.0) - ro;
    float tt = max(dot(c0, rd), 0.0);
    float dd = length(c0 - rd * tt);
    glowC += mix(teal, gold, uOpen) * exp(-dd * 7.0) * 0.35;
  }
  // the floor and the haze fade before the picture's edges, so there's no box
  vec2 sp = gl_FragCoord.xy / uRes;
  float edge = smoothstep(0.0, 0.16, sp.y) * smoothstep(0.0, 0.06, sp.x) * smoothstep(1.0, 0.94, sp.x);
  if (!hit) { alpha *= edge; glowC *= edge; }
  col += glowC;
  alpha = clamp(max(alpha, max(glowC.r, max(glowC.g, glowC.b))), 0.0, 1.0);
  // tone map, gamma
  col = col / (1.0 + col * 0.6);
  col = pow(max(col, 0.0), vec3(1.0 / 2.2));
  gl_FragColor = vec4(col * alpha, alpha);
}
`;
