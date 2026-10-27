// The Alien Lab's tank, painted per pixel (look-lab, before 6.21): the liquid
// (light falling through it in shafts, caustics, depth, the glass's curve) and
// the embryo growing in it (lib/embryo.js decides what it is; this decides
// how it looks): a living membrane with light through it, organelles with
// glowing nuclei, veins, buds, tendrils, eye-spots that find you, its skin
// (smooth, cilia, plates, bioluminescent, glass), the light inside it, the
// ghost of stage III, the anomaly's wrong shape, the cocoon.
// Units: the vat's own, x 0..30 across, y 0..63 down.
export const VAT_FRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uT, uHue, uEnv, uAlarm, uMorph, uFrantic, uShow, uFlick, uLevel, uFade;
// the embryo: centre, rotation, scale; its build
uniform vec2 uC; uniform float uRot, uSc, uSquash, uR, uAct, uStrange, uWrong, uCocoon, uMem, uInner, uGrowth, uStare, uSeed, uStage, uToxic;
uniform vec3 uCell[9]; uniform float uNC;
uniform vec4 uBud[10]; uniform float uNB;
uniform vec4 uSpot[8]; uniform float uNS;
uniform vec2 uTP[45]; uniform float uNT;
const float PI = 3.14159265, TAU = 6.2831853;

float h11(float n){ return fract(sin(n) * 43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1,0)), f.x), mix(h21(i + vec2(0,1)), h21(i + vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }
vec3 hsl(float h, float s, float l){ vec3 rgb = clamp(abs(mod(h / 60.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0)); }
float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float segd(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
vec2 vor(vec2 p){ vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++){ vec2 g = vec2(float(x), float(y)); vec2 o = vec2(h21(i + g), h21(i + g + 7.3)); float d = length(g + o - f); if (d < d1){ d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
  return vec2(d1, d2); }

// caustics: light focused by a moving surface
float caustic(vec2 p, float t){
  vec2 q = p; float c = 0.0;
  for (int i = 0; i < 3; i++){ q += vec2(sin(q.y * 0.9 + t * 0.7 + float(i)), cos(q.x * 0.8 - t * 0.6 + float(i) * 1.7)) * 0.6; c += abs(sin(q.x + q.y * 0.5)); }
  return pow(1.0 - clamp(c / 3.0, 0.0, 1.0), 4.0);
}

// the membrane's radius at angle a
float memR(float a, float T){
  float r = uR * (1.0 + 0.06 * sin(3.0 * a + T * (0.8 + uAct)) + 0.04 * sin(5.0 * a - T * 1.1) + uStrange * 0.08 * sin(7.0 * a + T * 2.3));
  if (uWrong > 0.0) { float tri = uR * 1.1 / cos(mod(a + PI / 6.0, TAU / 3.0) - PI / 3.0); r = mix(r, min(uR * 1.6, tri), uWrong); }
  return r;
}
// the body: membrane and buds, a signed distance (negative inside)
float bodyD(vec2 q, float T){
  float d = length(q) - memR(atan(q.y, q.x), T);
  for (int i = 0; i < 10; i++){ if (float(i) >= uNB) break; vec4 b = uBud[i];
    vec2 r = q - b.xy; float ca = cos(-b.w), sa = sin(-b.w); r = vec2(ca * r.x - sa * r.y, sa * r.x + ca * r.y);
    float bd = length(r / vec2(1.0, 0.75)) * 0.82 - b.z; d = smin(d, bd, uR * 0.22); }
  return d;
}

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 p = vec2(uBox.x + fc.x / uRes.x * uBox.z, uBox.y + (1.0 - fc.y / uRes.y) * uBox.w);
  float px = uBox.z / uRes.x;
  float T = uT;
  // ── the liquid ──
  float cx = p.x / 30.0 * 2.0 - 1.0;
  float depth = clamp((p.y - 2.0) / 61.0, 0.0, 1.0);
  vec3 top = hsl(uHue, 0.5, 0.25), deep = hsl(uHue + 14.0, 0.62, 0.06);
  if (uEnv > 3.5 && uEnv < 4.5) { top *= 0.45; deep *= 0.4; }
  vec3 col = mix(top, deep, pow(depth, 0.8));
  // the cylinder: darker at the sides, a bright line of light inside each edge
  float edge = 1.0 - cx * cx;
  col *= 0.35 + 0.65 * pow(edge, 0.7);
  col += hsl(uHue, 0.5, 0.75) * (smoothstep(0.86, 0.95, abs(cx)) * (1.0 - smoothstep(0.95, 1.0, abs(cx)))) * 0.25;
  // shafts of light from above, swaying
  float sx = p.x * 0.32 + sin(p.y * 0.06 + T * 0.25) * 0.8;
  float shafts = smoothstep(0.45, 0.95, noise(vec2(sx, T * 0.12))) * 0.7 + smoothstep(0.55, 1.0, noise(vec2(sx * 2.3 + 4.0, T * 0.2))) * 0.5;
  col += hsl(uHue + 15.0, 0.6, 0.7) * shafts * exp(-depth * 2.4) * (0.32 + uFrantic * 0.3);
  // caustics, strongest near the surface
  col += hsl(uHue + 25.0, 0.7, 0.8) * caustic(p * 0.42, T * 1.2) * (0.35 * exp(-depth * 1.8) + 0.06);
  // fine motes catching the light
  vec2 mg = p * vec2(1.6, 1.6) + vec2(0.0, T * 1.4 * (1.0 + uFrantic * 2.0));
  float mote = step(0.985, h21(floor(mg))) * smoothstep(0.35, 0.0, length(fract(mg) - 0.5));
  col += hsl(uHue + 30.0, 0.5, 0.85) * mote * 0.6;
  // the surface line
  float surf = 2.2 + sin(p.x * 0.7 + T * 2.0) * 0.25 * (1.0 + uFrantic * 2.0);
  col += hsl(uHue, 0.6, 0.85) * smoothstep(0.35, 0.0, abs(p.y - surf)) * 0.6;
  if (p.y < surf) col = mix(col, hsl(uHue, 0.3, 0.1), 0.7);
  // a glow under the specimen, and the morph's light
  float dc = length((p - uC) / vec2(1.0, 1.2));
  col += hsl(uHue + 20.0, 0.8, 0.6) * exp(-dc / (uR * 1.8 + 3.0)) * (0.35 + uMorph * 0.8 + uInner * 0.25);
  // the specimen's shadow in the liquid, cast down and right, away from the light
  if (uShow > 0.5) { float sd = length((p - uC - vec2(uR * 0.35, uR * 0.55)) / vec2(1.0, 1.25)); col *= 1.0 - 0.45 * exp(-sd * sd / (uR * uR * 1.4)); }
  // a vignette: the tank is deep and the room is dark
  col *= 1.0 - 0.35 * smoothstep(0.55, 1.0, abs(depth - 0.45) * 1.8);
  if (uAlarm > 0.5) col = mix(col, vec3(0.5, 0.06, 0.1) * (0.6 + 0.4 * edge), 0.45);
  col *= uFlick;
  float la = 0.88;
  vec4 outc = vec4(col * la, la);

  if (uShow > 0.5) {
    // into the embryo's own frame
    vec2 q = p - uC;
    float cr = cos(-uRot), sr = sin(-uRot);
    q = vec2(cr * q.x - sr * q.y, sr * q.x + cr * q.y) / (uSc * vec2(1.0, uSquash));
    if (uWrong > 0.0) q += vec2(sin(q.y * 0.9 + T * 9.0), cos(q.x * 0.8 + T * 7.0)) * uWrong * 0.6;
    vec3 skinHi = hsl(uHue + 25.0, 0.55, 0.72), skin = hsl(uHue + 10.0, 0.6, 0.48), skinLo = hsl(uHue - 10.0, 0.65, 0.2);
    vec3 glowC = hsl(uHue + 40.0, 0.9, 0.7);
    float R = uR;
    vec3 acc = vec3(0.0); float aa = 0.0; vec3 add = vec3(0.0);
    // a halo of light around it
    float hd = length(q);
    add += glowC * exp(-hd / (R * 0.9)) * (0.18 + (uMem > 2.5 && uMem < 3.5 ? 0.25 : 0.0));
    // stage III: a ghost of itself, slightly out of step
    if (uStrange > 0.0) {
      float g = max(0.0, sin(T * 0.9 + uSeed * 5.0)) * uStrange;
      if (g > 0.3) { vec2 gq = q - vec2(sin(T * 3.0) * R * 0.25, -R * 0.1); float gd = bodyD(gq / 1.04, T + 0.7);
        add += glowC * smoothstep(px * 3.0, 0.0, abs(gd)) * (g - 0.3) * 0.9 + skinHi * smoothstep(0.0, -R * 0.4, gd) * (g - 0.3) * 0.12; }
    }
    // tendrils / flagella, behind the body: wavy tubes with light along them
    float tdMin = 1e3; float tdS = 0.0;
    for (int i = 0; i < 5; i++){ if (float(i) >= uNT) break;
      for (int k = 0; k < 8; k++){
        vec2 a = uTP[i * 9 + k], b = uTP[i * 9 + k + 1];
        float d = segd(q, a, b);
        float s = (float(k) + 0.5) / 8.0;
        float w = R * mix(0.075, 0.022, s);
        float dd = d - w;
        if (dd < tdMin){ tdMin = dd; tdS = s; }
      } }
    if (tdMin < px * 2.0) {
      float w = R * mix(0.075, 0.022, tdS);
      float across = clamp(1.0 + tdMin / max(w, 1e-3), 0.0, 1.0);
      vec3 tc = mix(skinLo, skinHi, across) + glowC * pow(across, 6.0) * 0.4;
      float ta = smoothstep(px * 1.5, -px * 0.5, tdMin) * 0.85;
      acc = mix(acc, tc, ta); aa = max(aa, ta);
    }
    // the body
    float d = bodyD(q, T);
    if (d < px * 3.0) {
      float th = clamp(-d / (R * 0.9), 0.0, 1.0);
      float dome = sqrt(1.0 - (1.0 - th) * (1.0 - th));
      vec2 dir = q / max(length(q), 1e-3);
      vec3 n = normalize(vec3(dir * (1.0 - dome) * 1.3, dome + 0.2));
      vec3 L = normalize(vec3(-0.45, 0.55, 0.7)); // from the upper left (y flipped: up is +)
      vec3 nn = vec3(n.x, -n.y, n.z);
      float dif = max(dot(nn, L), 0.0) * 0.7 + 0.3;
      vec3 c = mix(skinLo, skin, dome) * dif;
      // light through thin skin, from the tank's light above
      float sss = pow(1.0 - dome, 2.0) * (0.6 + 0.4 * max(0.0, -n.y));
      c += hsl(uHue + 30.0, 0.85, 0.65) * sss * 0.7;
      // veins under the skin
      vec2 vq = q / R * 3.2 + uSeed;
      float vn = 1.0 - abs(fbm(vq + T * 0.05) * 2.0 - 1.0);
      float vein = smoothstep(0.86, 0.97, vn) * dome;
      c = mix(c, uInner > 0.2 ? glowC * 1.2 : hsl(uHue - 25.0, 0.7, 0.3), vein * (0.45 + uInner * 0.4));
      // cytoplasm: granules drifting slowly inside
      vec2 gq = q / R * 9.0 + vec2(T * 0.15, -T * 0.1) + uSeed;
      float gran = smoothstep(0.28, 0.08, vor(gq).x) * dome;
      c += skinHi * gran * 0.18;
      // the membrane: a thicker, darker wall with a bright inner line
      float wall = smoothstep(-R * 0.14, -R * 0.05, d) * smoothstep(px, -px, d);
      c = mix(c, skinLo * 1.2, wall * 0.45);
      c += glowC * smoothstep(R * 0.04, 0.0, abs(d + R * 0.15)) * 0.22;
      // organelles: translucent spheres, nuclei that pulse
      for (int i = 0; i < 9; i++){ if (float(i) >= uNC) break; vec3 o = uCell[i];
        float od = length(q - o.xy) - o.z;
        if (od < 0.0) { float oth = clamp(-od / o.z, 0.0, 1.0); float odome = sqrt(1.0 - (1.0 - oth) * (1.0 - oth));
          c = mix(c, mix(skinHi, hsl(uHue + 15.0, 0.6, 0.62), 0.5) * (0.75 + 0.35 * odome), 0.35 + 0.2 * (1.0 - odome));
          float nd = length(q - o.xy - vec2(o.z * 0.15, -o.z * 0.1)) - o.z * 0.36 * (1.0 + 0.08 * sin(T * 2.4 + float(i)));
          if (nd < 0.0) c = mix(c, hsl(uHue - 20.0, 0.75, 0.22) + glowC * 0.25 * (0.5 + 0.5 * sin(T * 2.4 + float(i))), 0.85);
          c += vec3(1.0) * pow(max(0.0, 1.0 - length(q - o.xy - vec2(-o.z * 0.4, -o.z * 0.4)) / (o.z * 0.35)), 3.0) * 0.4; }
        c += skinHi * smoothstep(px * 2.0, 0.0, abs(od)) * 0.35; }
      // the skin's kind
      if (uMem > 0.5 && uMem < 1.5) { // cilia: a fringe of fine hairs, beating
        float ang = atan(q.y, q.x);
        float hair = smoothstep(0.55, 1.0, sin(ang * 70.0 + sin(T * 4.0 + ang * 3.0) * 2.0));
        float band = smoothstep(R * 0.16, 0.0, d) * smoothstep(-px * 2.0, px, d);
        c = mix(c, skinHi, hair * band * 0.8);
      }
      if (uMem > 1.5 && uMem < 2.5) { // plates: hard scales, glossy, dark seams
        vec2 v = vor(q / R * 4.0 + uSeed);
        float seam = smoothstep(0.08, 0.0, v.y - v.x);
        c = mix(c * (0.9 + 0.25 * (1.0 - v.x)), skinLo * 0.6, seam * 0.8 * dome);
      }
      if (uMem > 2.5 && uMem < 3.5) { // bioluminescent: spots that light up in waves
        vec2 v = vor(q / R * 5.0 + uSeed * 3.0);
        float spot = smoothstep(0.32, 0.12, v.x) * (0.5 + 0.5 * sin(T * 2.0 - length(q) / R * 6.0));
        c += glowC * spot * 1.2 * dome;
      }
      // the light inside (knowledge, harmony, energy)
      c += vec3(1.0, 0.94, 0.82) * exp(-length(q) / (R * 0.45)) * uInner * 0.9;
      // gloss and a rim of light
      vec3 Hh = normalize(L + vec3(0.0, 0.0, 1.0));
      float spec = pow(max(dot(nn, Hh), 0.0), 40.0);
      float fres = pow(1.0 - n.z, 2.5);
      c += vec3(1.0) * spec * (uMem > 3.5 ? 0.9 : 0.45);
      c += hsl(uHue + 30.0, 0.7, 0.8) * fres * 0.55;
      c += hsl(uHue + 200.0, 0.4, 0.75) * pow(max(0.0, -nn.x * 0.6 - nn.y * 0.8), 3.0) * (1.0 - dome) * 0.35; // cool bounce light from below
      // eye-spots: they wander, and sometimes they find you
      for (int i = 0; i < 8; i++){ if (float(i) >= uNS) break; vec4 e = uSpot[i];
        float er = e.z, ed = length(q - e.xy) - er;
        if (ed < px) { float ea = smoothstep(px, -px, ed);
          vec3 ec = mix(vec3(0.02, 0.015, 0.05), hsl(uHue + 180.0, 0.4, 0.14), smoothstep(-er, 0.0, ed));
          if (uStare > 0.3) ec = mix(ec, vec3(0.35, 0.12, 0.02), smoothstep(-er * 0.6, -er * 0.2, ed) * (1.0 - smoothstep(-er * 0.2, 0.0, ed)) * uStare);
          float gl = smoothstep(er * 0.34, er * 0.22, length(q - e.xy - vec2(cos(e.w), sin(e.w)) * er * 0.35));
          ec += (uStare > 0.5 ? vec3(1.0, 0.88, 0.6) : vec3(0.85, 0.9, 1.0)) * gl;
          c = mix(c, ec, ea); }
        c += hsl(uHue + 20.0, 0.7, 0.75) * smoothstep(px * 2.5, 0.0, abs(ed)) * 0.4; }
      float alpha = smoothstep(px * 1.5, -px * 0.5, d) * (uMem > 3.5 ? 0.62 + 0.3 * (1.0 - dome) : 0.94);
      acc = mix(acc, c, alpha); aa = max(aa, alpha);
    }
    // the cocoon closing over it
    if (uCocoon > 0.0) {
      vec2 cq = q / (R * 1.5);
      float cd = length(cq / vec2(0.85, 1.15)) - 1.0;
      if (cd < 0.02) {
        float th = clamp(-cd, 0.0, 1.0); float dome = sqrt(1.0 - (1.0 - th) * (1.0 - th));
        float fib = fbm(vec2(atan(cq.y, cq.x) * 4.0, length(cq) * 6.0) + uSeed);
        vec3 cc = mix(hsl(uHue, 0.5, 0.06), hsl(uHue + 15.0, 0.5, 0.32), dome * (0.6 + 0.4 * fib));
        float seam = smoothstep(0.04, 0.0, abs(sin(atan(cq.y, cq.x) * 2.5 + 0.6) * length(cq) - 0.45)) * (0.35 + 0.35 * sin(T * 2.2));
        cc += vec3(1.0, 0.86, 0.62) * seam;
        // a silk sheen: light caught on the fibres, a glossy top-left, a rim
        vec2 cdir = cq / max(length(cq), 1e-3);
        vec3 cn = normalize(vec3(cdir * (1.0 - dome) * 1.4, dome + 0.15));
        cc += hsl(uHue + 20.0, 0.4, 0.8) * pow(max(dot(normalize(vec3(-cn.x, cn.y, cn.z)), normalize(vec3(-0.45, 0.55, 0.9))), 0.0), 18.0) * 0.5;
        cc += hsl(uHue + 25.0, 0.7, 0.7) * pow(1.0 - cn.z, 2.2) * 0.4;
        cc += hsl(uHue + 10.0, 0.5, 0.5) * smoothstep(0.55, 0.9, fib) * dome * 0.25;
        cc += glowC * exp(-length(cq) * 2.5) * (0.3 + 0.3 * sin(T * 2.2)) * 0.4; // something alive inside
        float ca = smoothstep(0.02, -0.01, cd) * min(1.0, uCocoon * 2.5);
        acc = mix(acc, cc, ca); aa = max(aa, ca);
      }
    }
    // over the liquid; halos and ghosts add light to it (fading as it dissolves)
    aa *= uFade; add *= uFade;
    outc.rgb = (outc.rgb + add * la) * (1.0 - aa) + acc * aa;
    outc.a = max(outc.a, aa);
  }
  gl_FragColor = outc;
}
`;
export const VAT_BOX = { x0: 0, y0: 0, w: 30, h: 63 };
