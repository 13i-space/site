// Guests at the Rave (Update 6.14): fighters from XenoKlash who drop in for a
// drop - fly in on the build, land on the downbeat, dance, do their signature
// move, and leave. Built as a roster so more guests can be added; Sypher is
// the first. Rare on purpose: index.js picks which drops get one. Designed in
// the "The Rave, Repainted" look-lab artifact.
//
// A guest's visit, in beats from the drop d:
//   d-6 .. d      enter (flies in, lands on the drop)
//   d   .. d+16   dances
//   d+16.. d+24   signature move
//   d+24.. d+28   dances
//   d+28.. d+32   leaves
import { TAU, lerp, clamp, smooth, P, tube, glow, radial, linear } from "../draw";
import { arm3d, hand3d, shade, trim } from "../shade";
import { FRAG as DJ } from "./djShader";
import { makeGL } from "./glutil";
import { SUITFRAG, TB, PB, BB } from "./suitShader";

const PI = Math.PI;
const COMMON = DJ.slice(DJ.indexOf("const float PI"), DJ.indexOf("// ---------- materials ----------"));
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);
const ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };

// where a guest is in its visit, or null
export function guestAt(B, drops, pick) {
  for (let i = 0; i < drops.length; i++) {
    const d = drops[i];
    if (pick && !pick(i, d)) continue;
    if (B >= d - 6 && B < d + 32) {
      const b = B - d;
      let phase, k;
      if (b < 0) { phase = "enter"; k = (b + 6) / 6; }
      else if (b < 16) { phase = "dance"; k = b / 16; }
      else if (b < 24) { phase = "storm"; k = (b - 16) / 8; }
      else if (b < 28) { phase = "dance"; k = (b - 24) / 4; }
      else { phase = "leave"; k = (b - 28) / 4; }
      // how present it is on the floor (others make room)
      const here = b < 0 ? smooth(-3, 0, b) : b > 28 ? 1 - smooth(28.5, 31, b) : 1;
      return { d, b, phase, k, here, name: "sypher" };
    }
  }
  return null;
}

// ═══════════════ SYPHER ═══════════════
// the Void Pilot: an armoured flight suit with a twin-jet reactor pack, big
// jointed gauntlets, boots with thrusters; in the glass helmet a brain-folded
// violet alien with black almond eyes and face tendrils; eight ringed
// dreadlock tendrils that sway, and in Tendril Storm whip up into a spinning fan.
const SUIT = { lite: "#8A80B8", mid: "#4A4470", dark: "#1A1632", line: "#0A0818" };
const HULL = { lite: "#D2CEEA", mid: "#7A70A8", dark: "#2A2440", line: "#0C0A18" };
const SQUID = { lite: "#E0A8F0", mid: "#B070E0", dark: "#4A1E68", line: "#2A0E40" };
const CY = "#5FE3E8", VI = "#C07CFF";
const HELM = 15;
const HB = { x0: -19, y0: -19, w: 38, h: 38 };

const SFRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uT, uB, uBass, uHueA, uHueB, uStorm, uBlink;
uniform vec2 uLook;
${COMMON}
#define GRAD(F, p) normalize(vec2(F(p + vec2(0.05, 0.0)) - F(p - vec2(0.05, 0.0)), F(p + vec2(0.0, 0.05)) - F(p - vec2(0.0, 0.05))) + 1e-5)
float skullSD(vec2 p) { return smin(sdEll(p - vec2(0.0, -2.6), vec2(9.4, 8.8)), sdEll(p - vec2(0.0, 3.6), vec2(6.2, 5.4)), 3.0); }
float curSkull(vec2 p) { return skullSD(p); }
void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uBox.x + f.x * uBox.z, uBox.y + (1.0 - f.y) * uBox.w);
  px = uBox.z / uRes.x;
  rimA = lin(hsl2rgb(uHueA, 1.0, 0.62)) * 1.1;
  rimB = lin(hsl2rgb(uHueB, 1.0, 0.68)) * 1.1;
  vec3 vi = lin(vec3(0.75, 0.49, 1.0)), cy = lin(vec3(0.37, 0.89, 0.91));
  float r = length(p), hd = r - 15.0;
  glowAdd(vi, exp(-max(hd, 0.0) * 0.45) * (0.12 + uStorm * 0.35) * step(0.0, hd));
  if (hd < px * 2.0) {
    // inside the glass: violet murk, a little haze rising from the collar
    vec3 c = lin(vec3(0.07, 0.035, 0.15)) * (0.8 + 0.4 * fbm(p * 0.3 + uT * 0.1));
    c += lin(vec3(0.3, 0.2, 0.5)) * 0.25 * smoothstep(6.0, 14.0, p.y) * fbm(p * 0.5 - vec2(0.0, uT * 0.6));
    float e = clamp(r / 15.0, 0.0, 1.0);
    vec3 gn = normalize(vec3(p / 15.0, sqrt(max(1.0 - e * e, 0.0)) + 0.02));
    vec2 q = p * (0.92 + 0.08 * gn.z) - uLook * 0.35;
    float sd = skullSD(q);
    // its shadow on the back of the helmet
    c *= 1.0 - 0.5 * smoothstep(3.0, -1.0, skullSD(q - vec2(1.2, 1.6))) * step(0.0, sd);
    if (sd < 0.6) {
      vec2 g = GRAD(curSkull, q);
      vec3 n = nrm(g, sd, 6.5);
      // brain folds over the dome: gyri and deep sulci, two scales
      float top = smoothstep(2.2, -3.8, q.y);
      vec2 w = q + 2.2 * vec2(fbm(q * 0.25 + 1.7), fbm(q * 0.25 + 9.2));
      float s1 = sin(w.y * 1.9 + w.x * 0.5), s2 = sin(w.x * 3.1 - w.y * 1.2 + fbm(q * 0.6) * 3.0);
      float sul = abs(s1) * 0.75 + abs(s2) * 0.25;
      float fold = smoothstep(0.08, 0.6, sul);
      n = normalize(n + vec3(cos(w.x * 3.1) * 0.15, s1 * 0.55, 0.0) * top);
      vec3 alb = lin(vec3(0.69, 0.44, 0.88)) * mix(1.0, mix(0.38, 1.05, fold), top);
      // fine veins and freckles on the face below
      float vein = smoothstep(0.06, 0.0, abs(fbm(q * 0.7 + 4.0) - 0.5)) * (1.0 - top);
      alb *= 1.0 - 0.25 * vein;
      alb *= 1.0 - 0.3 * smoothstep(0.78, 0.86, noise(q * 2.6)) * (1.0 - top);
      vec3 sc = light(alb * 0.9, n, mix(30.0, 80.0, top * fold), mix(0.2, 0.45, top * fold), 0.9, lin(vec3(0.9, 0.4, 1.0)), 1.0);
      sc += lin(vec3(0.23, 0.06, 0.38)) * 0.55;
      sc += vi * (1.0 - fold) * top * (0.25 + uBass * 0.5 + uStorm * 0.6);
      // the brow and cheek ridges
      for (int i = 0; i < 2; i++) {
        float s = i == 0 ? -1.0 : 1.0;
        vec2 bq = rot(q - vec2(s * 4.5, 0.2), s * 0.38);
        float brow = sdEll(bq, vec2(3.6, 2.0));
        sc *= 1.0 - 0.45 * smoothstep(1.2, -0.4, brow) * step(bq.y, 1.0);
        sc += lin(vec3(0.95, 0.75, 1.0)) * 0.18 * smoothstep(0.5, 0.0, abs(brow - 0.6)) * step(bq.y, -0.6);
        float cx = s * (6.0 - (q.y - 2.2) * 0.55);
        float ck = abs(q.x - cx) * step(2.2, q.y) * step(q.y, 6.4) + step(q.y, 2.2) * 9.0 + step(6.4, q.y) * 9.0;
        sc *= 1.0 - 0.35 * smoothstep(0.55, 0.0, ck - 0.3) * step(0.0, (q.x - cx) * s);
        sc += lin(vec3(0.9, 0.7, 1.0)) * 0.14 * smoothstep(0.5, 0.0, ck) * step((q.x - cx) * s, 0.0);
        // a row of glowing pores along each temple
        for (int k = 0; k < 5; k++) {
          float fk = float(k);
          vec2 dp = vec2(s * (8.2 - fk * 0.25), -3.4 + fk * 1.25);
          float on = 0.35 + 0.65 * max(0.0, sin(uB * PI - fk * 0.7));
          float dd = length(q - dp);
          sc = mix(sc, mix(vi, cy, fk / 4.0) * (1.3 + on), smoothstep(0.42, 0.18, dd));
          sc += mix(vi, cy, fk / 4.0) * exp(-dd * 2.2) * 0.25 * on;
        }
      }
      // black almond eyes: lids, a wet sheen, a faint slit and nebula deep inside
      for (int i = 0; i < 2; i++) {
        float s = i == 0 ? -1.0 : 1.0;
        vec2 eq = rot(q - vec2(s * 4.4, 1.6), s * 0.38);
        vec2 er = vec2(2.5, 1.3 * max(uBlink, 0.1));
        float ed = sdEll(eq, er);
        // the lid rim
        sc = mix(sc, lin(vec3(0.3, 0.12, 0.42)), smoothstep(0.55, 0.15, abs(ed - 0.25)));
        sc += lin(vec3(1.0, 0.85, 1.0)) * 0.25 * smoothstep(0.3, 0.0, abs(ed - 0.55)) * step(0.3, eq.y);
        sc += vi * exp(-max(ed, 0.0) * 1.6) * 0.35 * step(0.0, ed);
        if (ed < 0.3) {
          vec2 eqq = eq / er; float ee = clamp(length(eqq), 0.0, 1.0);
          vec3 en = normalize(vec3(eqq * 0.7, sqrt(max(1.0 - ee * ee, 0.0)) + 0.3));
          vec2 lk = eq - uLook * 0.45;
          vec3 ec = lin(vec3(0.01, 0.005, 0.025));
          ec += lin(vec3(0.3, 0.1, 0.5)) * 0.35 * fbm(lk * 1.8 + uT * 0.15) * smoothstep(1.2, 0.2, ee);
          float slit = abs(lk.x) - 0.2 * (1.0 - clamp(abs(lk.y) / 1.2, 0.0, 1.0));
          ec += vi * 0.9 * smoothstep(0.12, -0.05, slit) * (0.5 + uBass * 0.6 + uStorm);
          ec += vec3(1.0) * pow(max(dot(en, normalize(vec3(-0.3, -0.6, 0.75))), 0.0), 160.0) * 1.3;
          ec += vec3(1.0) * 0.6 * smoothstep(0.32, 0.12, length(eq - vec2(0.9, 0.55)));
          ec += mix(rimA, rimB, 0.5) * 0.2 * pow(ee, 4.0);
          sc = mix(sc, ec, clamp(0.5 - ed / px, 0.0, 1.0));
        }
      }
      // a small beak of a mouth among the tendrils
      float md = sdEll(q - vec2(0.0, 5.8), vec2(1.3, 0.45));
      sc *= 1.0 - 0.75 * smoothstep(0.3, -0.2, md);
      sc += lin(vec3(1.0, 0.8, 1.0)) * 0.12 * smoothstep(0.4, 0.0, abs(md - 0.4)) * step(5.8, q.y);
      c = mix(c, sc, clamp(0.5 - sd / px, 0.0, 1.0));
    }
    // six face tendrils, ringed, with suckers on the lit side and glowing tips
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float x0 = -3.3 + fi * 1.32;
      float y = q.y;
      if (y > 5.0 && y < 14.0) {
        float len = 7.0 + mod(fi * 1.7, 2.0);
        float u = (y - 5.0) / len;
        if (u < 1.0) {
          float x = x0 + sin(uT * 3.0 + fi * 1.3 + u * 3.0) * u * 1.1 + (fi - 2.5) * u * 0.7 + uStorm * sin(uT * 9.0 + fi) * u * 1.5;
          float rad = mix(0.62, 0.16, u);
          float dd = abs(q.x - x) - rad;
          if (dd < 0.4) {
            float ee = clamp((q.x - x) / rad, -1.0, 1.0);
            vec3 tn = normalize(vec3(ee, 0.0, sqrt(max(1.0 - ee * ee, 0.0)) + 0.05));
            float band = smoothstep(0.15, 0.0, abs(fract(y * 1.3 + fi * 0.3) - 0.5) - 0.32);
            vec3 tc = light(lin(vec3(0.62, 0.38, 0.82)) * (1.0 - 0.3 * band), tn, 60.0, 0.5, 0.9, lin(vec3(0.9, 0.4, 1.0)), 1.0);
            tc += lin(vec3(1.0, 0.85, 1.0)) * 0.3 * smoothstep(0.25, 0.08, length(vec2((q.x - x) + rad * 0.45, fract(y * 1.3 + fi * 0.3) - 0.5) * vec2(2.0, 1.0)));
            tc += vi * smoothstep(0.7, 1.0, u) * (0.8 + uStorm);
            c = mix(c, tc, clamp(0.5 - dd / px, 0.0, 1.0));
          }
        }
      }
    }
    // the glass: fresnel, highlights, a HUD arc, fine scratches
    float fres = pow(1.0 - gn.z, 2.0);
    c = mix(c, lin(vec3(0.6, 0.85, 1.0)), fres * 0.35);
    vec3 R = reflect(vec3(0.0, 0.0, -1.0), gn);
    c += vec3(1.0) * smoothstep(0.9, 0.98, dot(R, normalize(vec3(-0.45, -0.7, 0.55))));
    c += vec3(1.0) * smoothstep(1.0, 0.6, length((p - vec2(-6.0, -7.0)) / vec2(4.5, 2.2))) * 0.22;
    c += vec3(1.0) * smoothstep(1.0, 0.5, length((p - vec2(7.5, 8.5)) / vec2(2.2, 0.9))) * 0.18;
    c += mix(rimA, rimB, smoothstep(-12.0, 12.0, p.x)) * fres * 0.6;
    float an = atan(p.y, p.x);
    float hud = smoothstep(0.18, 0.0, abs(r - 12.6)) * step(2.2, an) * step(an, 3.0);
    hud += smoothstep(0.14, 0.0, abs(r - 12.6)) * step(0.5, fract(an * 18.0)) * step(-2.9, an) * step(an, -2.3) ;
    hud += smoothstep(0.2, 0.0, abs(r - 11.8)) * step(0.85, fract(an * 30.0 + uT)) * step(2.2, an) * step(an, 3.0);
    c += cy * hud * 0.55;
    float scr = smoothstep(0.035, 0.0, abs(fract(rot(p, 0.7).x * 0.9 + noise(p * 0.2) * 0.4) - 0.5) - 0.48) * smoothstep(0.6, 0.9, noise(p * 0.3 + 5.0));
    c += vec3(1.0) * scr * 0.1;
    c += cy * smoothstep(0.9, 0.0, abs(hd + 0.4)) * 0.4;
    put(hd, c);
  }
  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;

// two-bone reach for legs and arms
function reach(a, b, L1, L2, side) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  let d = Math.hypot(dx, dy) || 1;
  const ux = dx / d, uy = dy / d;
  const maxd = (L1 + L2) * 0.995;
  if (d > maxd) { b = [a[0] + ux * maxd, a[1] + uy * maxd]; d = maxd; }
  const t = (L1 * L1 + d * d - L2 * L2) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - t * t));
  return { mid: [a[0] + ux * t - uy * h * side, a[1] + uy * t + ux * h * side], end: b };
}
// an arm: of the two ways the elbow can bend, the one pointing out and down
function reachOut(a, b, L1, L2, out) {
  const r1 = reach(a, b, L1, L2, 1), r2 = reach(a, b, L1, L2, -1);
  const sc = (r) => (r.mid[0] - a[0]) * out + (r.mid[1] - a[1]) * 0.35;
  return sc(r1) >= sc(r2) ? r1 : r2;
}

// Sypher's pose for this moment of its visit
function sypherPose(v, m) {
  const d = dipOf(m), s = Math.sin(m.B * PI), A = Math.max(0.6, m.amp);
  const p = { roll: null, fist: 0, lift: 0, squat: 0, sway: 0, lean: 0, jets: 0, hL: [-24, -60], hR: [24, -60], feet: [0, 0], storm: 0, dreadUp: 0, spread: 0.2, look: [0, 0], ring: 0, landing: 0 };
  if (v.phase === "enter") {
    const k = ease(v.k);
    p.lift = -Math.pow(1 - k, 2) * 300;
    p.jets = 1 - smooth(0.85, 1, v.k) * 0.8;
    p.hL = [-32, -58]; p.hR = [32, -58];
    p.dreadUp = 1 - k; p.squat = smooth(0.8, 1, v.k) * 10;
    p.feet = [2, 2];
  } else if (v.phase === "dance") {
    // the arm roll: forearms rolling over each other in front of the chest,
    // the roll drifting side to side and turning round every 8 beats
    const dir = Math.floor(m.B / 8) % 2 ? -1 : 1;
    const a = m.B * PI * dir;
    const cx = Math.sin(m.B * PI * 0.25) * 7 * A, cy = -62 + d * 2;
    p.roll = [Math.cos(a), Math.cos(a + PI)];
    p.hL = [cx - 8 + Math.cos(a) * 2.5, cy + Math.sin(a) * 7];
    p.hR = [cx + 8 + Math.cos(a + PI) * 2.5, cy + Math.sin(a + PI) * 7];
    p.squat = d * 6 * A; p.sway = cx * 0.35; p.lean = cx * 0.006;
    const st = Math.sin(m.B * PI * 0.5);
    p.feet = [Math.max(0, st) * 5, Math.max(0, -st) * 5];
    p.fist = 1;
    p.spread = 0.25 + d * 0.15;
    p.look = [Math.sin(m.B * PI * 0.25) * 2, 0];
    if (v.b >= 0 && v.b < 2) p.landing = 1 - v.b / 2;
  } else if (v.phase === "storm") {
    // Tendril Storm: hovers, arms up, the dreads whip round overhead
    const k = v.k;
    const up = smooth(0, 0.12, k) * (1 - smooth(0.9, 1, k));
    p.lift = -(14 + Math.sin(m.B * PI) * 4) * up;
    p.jets = 0.55 * up;
    p.hL = [lerp(-24, -34, up), lerp(-72, -126, up)]; p.hR = [lerp(24, 34, up), lerp(-72, -126, up)];
    p.storm = up; p.squat = 3 * (1 - up);
    p.ring = up;
  } else if (v.phase === "leave") {
    const k = v.k;
    p.squat = smooth(0, 0.3, k) * 12 * (1 - smooth(0.3, 0.45, k));
    p.lift = -Math.pow(smooth(0.3, 1, k), 2) * 320;
    p.jets = smooth(0.25, 0.4, k);
    p.hL = [-30, -50]; p.hR = [30, -50];
    p.dreadUp = -smooth(0.3, 1, k);
  }
  return p;
}

export function makeGuests() {
  const GH = makeGL(SFRAG, HB, ["uRes", "uBox", "uT", "uB", "uBass", "uHueA", "uHueB", "uStorm", "uBlink", "uLook"], [], "SB_");
  const GS = makeGL(SUITFRAG, TB, ["uRes", "uBox", "uMode", "uSide", "uT", "uB", "uBass", "uHueA", "uHueB", "uStorm", "uJets", "uPulse"], [], "SS_");
  // one canvas for every suit part: sized for the torso each frame, the
  // smaller parts drawn into its corner
  let suitK = 0;
  function suitFrame(ctx) {
    if (!GS) return;
    const tf = ctx.getTransform(); let k = Math.max(Math.hypot(tf.a, tf.b), Math.hypot(tf.c, tf.d));
    k = Math.min(k, 760 / TB.h);
    suitK = k;
    const w = Math.round(TB.w * k), h = Math.round(TB.h * k);
    if (GS.c.width !== w || GS.c.height !== h) { GS.c.width = w; GS.c.height = h; }
  }
  function paintSuit(ctx, box, mode, side, m, p) {
    if (!GS || !suitK) return false;
    const { gl, U, c } = GS;
    const w = Math.max(2, Math.round(box.w * suitK)), h = Math.max(2, Math.round(box.h * suitK));
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h); gl.uniform4f(U.uBox, box.x0, box.y0, box.w, box.h);
    gl.uniform1f(U.uMode, mode); gl.uniform1f(U.uSide, side);
    gl.uniform1f(U.uT, m.t); gl.uniform1f(U.uB, m.B); gl.uniform1f(U.uBass, m.bass); gl.uniform1f(U.uHueA, m.pal.a); gl.uniform1f(U.uHueB, m.pal.b);
    gl.uniform1f(U.uStorm, p.storm); gl.uniform1f(U.uJets, p.jets); gl.uniform1f(U.uPulse, dipOf(m));
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    ctx.drawImage(c, 0, c.height - h, w, h, box.x0, box.y0, box.w, box.h);
    return true;
  }
  function paintHelmet(ctx, m, p) {
    if (!GH) {
      ctx.fillStyle = radial(ctx, -4, -5, 18, [[0, "#C8B0F0"], [0.5, "#6A3A9A"], [1, "#1A0A30"]]); ctx.beginPath(); ctx.arc(0, 0, HELM, 0, TAU); ctx.fill();
      return;
    }
    const tf = ctx.getTransform(); const k = Math.max(Math.hypot(tf.a, tf.b), Math.hypot(tf.c, tf.d));
    let w = Math.round(HB.w * k), h = Math.round(HB.h * k);
    const cap = 900 / Math.max(w, h); if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
    const { gl, U, c } = GH;
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h); gl.uniform4f(U.uBox, HB.x0, HB.y0, HB.w, HB.h);
    gl.uniform1f(U.uT, m.t); gl.uniform1f(U.uB, m.B); gl.uniform1f(U.uBass, m.bass); gl.uniform1f(U.uHueA, m.pal.a); gl.uniform1f(U.uHueB, m.pal.b);
    gl.uniform1f(U.uStorm, p.storm); gl.uniform1f(U.uBlink, (m.t % 4.3) > 4.18 ? 0.1 : 1); gl.uniform2f(U.uLook, p.look[0], p.look[1]);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    ctx.drawImage(c, HB.x0, HB.y0, HB.w, HB.h);
  }

  // feet at (0,0), 100 units tall
  function drawSypher(ctx, v, m) {
    const p = sypherPose(v, m);
    suitFrame(ctx);
    const rim = `hsla(${m.pal.b},100%,72%,0.85)`;
    const t = m.t;
    // on the floor: a shadow that shrinks as it rises, the landing ring, the void shockwaves
    const hv = clamp(1 + p.lift / 160, 0, 1);
    ctx.save(); ctx.scale(1, 0.28);
    ctx.fillStyle = `rgba(0,0,0,${0.5 * hv})`; ctx.beginPath(); ctx.arc(0, 0, 22 * (0.4 + 0.6 * hv), 0, TAU); ctx.fill();
    if (p.landing > 0) {
      const r = (1 - p.landing) * 110 + 10;
      ctx.strokeStyle = `rgba(95,227,232,${p.landing})`; ctx.lineWidth = 6 * p.landing; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
      ctx.strokeStyle = `rgba(192,124,255,${p.landing * 0.7})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, TAU); ctx.stroke();
    }
    if (p.ring > 0.05) {
      for (let k = 0; k < 2; k++) {
        const ph = ((m.B / 4 + k * 0.5) % 1);
        ctx.strokeStyle = `rgba(192,124,255,${(1 - ph) * p.ring * 0.9})`; ctx.lineWidth = 5 * (1 - ph) + 1;
        ctx.beginPath(); ctx.arc(0, 0, 14 + ph * 150, 0, TAU); ctx.stroke();
      }
    }
    ctx.restore();
    glow(ctx, 0, -2, 34 * hv, "rgba(192,124,255,0.6)", (0.35 + m.bass * 0.4) * hv + p.storm * 0.4);

    ctx.save();
    ctx.translate(p.sway, p.lift); ctx.rotate(p.lean);
    const sq = p.squat;
    const hipY = -44 + sq, chestY = -78 + sq * 0.9, headC = [0, -96 + sq * 0.85];
    const sh = [[-17, chestY + 4], [17, chestY + 4]];

    // jets: from the reactor pack's twin nozzles, and the boots' thrusters
    const flame = (x, y, len, w) => {
      const g = ctx.createLinearGradient(x, y, x, y + len);
      g.addColorStop(0, "rgba(255,255,255,0.95)"); g.addColorStop(0.3, "rgba(159,248,255,0.9)"); g.addColorStop(1, "rgba(192,124,255,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x, y + len * 1.1, x + w, y); ctx.fill();
      glow(ctx, x, y + 3, w * 3, "rgba(95,227,232,0.8)", 0.8);
    };
    if (p.jets > 0.02) { [-10, 10].forEach((x) => flame(x, chestY + 22, (30 + Math.sin(t * 50 + x) * 6) * p.jets, 3.6)); }

    // the dreadlocks: eight ringed tendrils off the back of the head
    const dreads = [];
    for (let i = 0; i < 8; i++) {
      const u0 = i / 7 - 0.5, side = Math.sign(u0) || 1;
      const base = [headC[0] + u0 * 16, headC[1] - 4 + Math.abs(u0) * 6];
      const pts = [base];
      for (let k = 1; k <= 7; k++) {
        const u = k / 7;
        // at rest: falling behind the shoulders, swaying
        const rx = base[0] + u0 * k * 4.6 + Math.sin(t * 2.6 + k * 0.8 + i) * (1 + u * 4) + p.sway * u * 0.6;
        const ry = base[1] + k * 6.2 - u * u * 6 * p.dreadUp * 0 + Math.cos(t * 2 + k + i) * u * 2;
        // trailing straight up (flying down) or down (flying up)
        const tx = base[0] + u0 * k * 2.4, ty = base[1] - k * 6.6 * Math.sign(p.dreadUp || 1);
        // Tendril Storm: whipping round overhead in a spinning fan
        const a = m.B * PI * 1.0 + i * (TAU / 8) + u * 1.6;
        const R0 = 10 + u * 40;
        const sx = headC[0] + Math.cos(a) * R0, sy = headC[1] - 18 - u * 26 + Math.sin(a) * R0 * 0.45;
        const tr = Math.abs(p.dreadUp);
        let x = lerp(rx, tx, tr), y = lerp(ry, ty, tr);
        x = lerp(x, sx, p.storm); y = lerp(y, sy, p.storm);
        pts.push([x, y]);
      }
      dreads.push(pts);
    }
    const drawDread = (pts, i) => {
      const dark = i % 2;
      tube(ctx, pts[0], pts[2], pts[5], pts[7], 3.4, 1, dark ? SQUID.dark : "#7A3FA8", SQUID.line);
      ctx.strokeStyle = "rgba(224,168,240,0.35)"; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(pts[0][0] - 0.8, pts[0][1]); ctx.bezierCurveTo(pts[2][0] - 0.8, pts[2][1], pts[5][0] - 0.8, pts[5][1], pts[7][0], pts[7][1]); ctx.stroke();
      [1, 3, 5].forEach((k) => {
        const [x, y] = pts[k], [x2, y2] = pts[k + 1];
        const an = Math.atan2(y2 - y, x2 - x);
        ctx.save(); ctx.translate(x, y); ctx.rotate(an);
        ctx.fillStyle = linear(ctx, 0, -2.6, 0, 2.6, [[0, HULL.lite], [0.5, HULL.mid], [1, HULL.dark]]);
        ctx.beginPath(); ctx.ellipse(0, 0, 1.2, 2.8 - k * 0.2, 0, 0, TAU); ctx.fill();
        ctx.restore();
      });
      const tip = pts[7];
      glow(ctx, tip[0], tip[1], 4 + p.storm * 8, "rgba(192,124,255,0.9)", 0.3 + p.storm * 0.7);
    };
    // behind the body, unless they're up in the storm
    if (p.storm < 0.5) dreads.forEach(drawDread);

    // the reactor pack, peeking out behind the shoulders
    [-1, 1].forEach((s) => {
      const x = s * 10;
      ctx.fillStyle = linear(ctx, x - 4, 0, x + 4, 0, [[0, HULL.dark], [0.5, HULL.mid], [1, HULL.dark]]);
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - 4, chestY - 4, 8, 26, 3) : ctx.rect(x - 4, chestY - 4, 8, 26); ctx.fill();
      ctx.fillStyle = "#24203A"; ctx.beginPath(); ctx.ellipse(x, chestY + 22, 4.2, 1.7, 0, 0, TAU); ctx.fill();
    });

    // legs and boots
    [[-1, p.feet[0]], [1, p.feet[1]]].forEach(([s, f]) => {
      const hip = [s * 8, hipY], foot = [s * 12 + s * f * 0.4, -5 - f * 2];
      const r = reachOut(hip, foot, 22, 22, s);
      arm3d(ctx, hip, r.end, { elbow: r.mid, stiff: 0.5, w0: 13, w1: 9, col: SUIT, rim, bulge: 0.4, bands: [0.95], bandCol: CY });
      ctx.fillStyle = radial(ctx, r.mid[0], r.mid[1], 6, [[0, HULL.lite], [0.5, HULL.mid], [1, HULL.dark]], r.mid[0] - 2, r.mid[1] - 2);
      ctx.beginPath(); ctx.ellipse(r.mid[0], r.mid[1], 6, 5, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = HULL.line; ctx.lineWidth = 0.6; ctx.stroke();
      // the boot, with its thruster ring
      const bx = r.end[0], by = r.end[1] + 5;
      ctx.save(); ctx.translate(bx, by); const bootPainted = paintSuit(ctx, BB, 2, s, m, p); ctx.restore();
      if (!bootPainted) {
      const boot = new Path2D(); boot.moveTo(bx - 7, by); boot.lineTo(bx - 6, by - 9); boot.quadraticCurveTo(bx, by - 12, bx + 6, by - 9); boot.lineTo(bx + 8, by); boot.closePath();
      ctx.fillStyle = linear(ctx, bx - 7, 0, bx + 8, 0, [[0, HULL.dark], [0.45, HULL.mid], [1, HULL.dark]]); ctx.fill(boot);
      shade(ctx, boot, [bx - 7, by - 12, 15, 12], { rim, shadow: 0.4, spec: 0.3, line: HULL.line, lineW: 0.6 });
      ctx.strokeStyle = CY; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(bx, by - 7, 4.8, 1.4, 0, 0, TAU); ctx.stroke();
      }
      glow(ctx, bx, by - 7, 6, "rgba(95,227,232,0.8)", 0.3 + p.jets * 0.7);
      if (p.jets > 0.02) flame(bx, by + 1, (22 + Math.sin(t * 45 + s) * 5) * p.jets, 3.4);
    });

    // the flight suit: painted, or drawn if there's no WebGL
    ctx.save(); ctx.translate(0, chestY); const torsoPainted = paintSuit(ctx, TB, 0, 1, m, p); ctx.restore();
    if (torsoPainted) glow(ctx, 0, chestY + 12, 10, "rgba(192,124,255,0.9)", 0.3 + m.bass * 0.5 + p.storm * 0.5);
    else {
    const torso = new Path2D(`M${-14} ${chestY - 2} Q-20 ${chestY + 14} -13 ${hipY + 2} L13 ${hipY + 2} Q20 ${chestY + 14} 14 ${chestY - 2} Q0 ${chestY - 7} -14 ${chestY - 2} Z`);
    ctx.fillStyle = linear(ctx, -18, 0, 18, 0, [[0, SUIT.dark], [0.35, SUIT.mid], [0.55, "#5A5488"], [0.8, SUIT.mid], [1, SUIT.dark]]); ctx.fill(torso);
    const plate = new Path2D(`M-10 ${chestY + 1} L10 ${chestY + 1} L8 ${chestY + 20} Q0 ${chestY + 24} -8 ${chestY + 20} Z`);
    ctx.fillStyle = linear(ctx, -10, chestY, 10, chestY + 22, [[0, HULL.lite], [0.4, HULL.mid], [1, HULL.dark]]); ctx.fill(plate);
    shade(ctx, plate, [-10, chestY, 20, 24], { rim, shadow: 0.35, spec: 0.45, line: HULL.line, lineW: 0.5 });
    [-1, 1].forEach((s) => { ctx.fillStyle = CY; ctx.fillRect(s * 6 - 0.6, chestY + 4, 1.2, 12); glow(ctx, s * 6, chestY + 10, 5, "rgba(95,227,232,0.7)", 0.3 + dipOf(m) * 0.4); });
    // the reactor cell at the heart of the plate
    const pr = 0.75 + 0.25 * Math.sin(t * 6);
    ctx.fillStyle = radial(ctx, 0, chestY + 12, 3.4, [[0, "#FFFFFF"], [0.4, VI], [1, "#2A0E40"]]); ctx.beginPath(); ctx.arc(0, chestY + 12, 2.8 * pr + m.bass * 0.8, 0, TAU); ctx.fill();
    glow(ctx, 0, chestY + 12, 10, "rgba(192,124,255,0.9)", 0.4 + m.bass * 0.5 + p.storm * 0.5);
    ctx.fillStyle = linear(ctx, 0, hipY - 6, 0, hipY + 1, [[0, "#3A3460"], [1, "#12101F"]]); ctx.fillRect(-14, hipY - 5, 28, 5);
    ctx.fillStyle = CY; ctx.fillRect(-2, hipY - 4.4, 4, 3.6);
    shade(ctx, torso, [-20, chestY - 7, 40, hipY - chestY + 9], { rim, shadow: 0.5, spec: 0.12, line: SUIT.line, lineW: 0.8 });

    }
    // arms, elbow pads, big jointed gauntlets with glowing tips
    const armsAt = [[0, p.hL, -1], [1, p.hR, 1]];
    if (p.roll && p.roll[0] > p.roll[1]) armsAt.reverse();   // the arm rolling behind goes first
    armsAt.forEach(([n, hand, s]) => {
      const r = reachOut(sh[n], hand, 19, 19, s);
      const a = arm3d(ctx, sh[n], r.end, { elbow: r.mid, stiff: 0.45, w0: 10, w1: 7.5, col: SUIT, rim, bulge: 0.5, bands: [0.9], bandCol: CY });
      ctx.fillStyle = radial(ctx, r.mid[0], r.mid[1], 6.2, [[0, HULL.lite], [0.5, HULL.mid], [1, HULL.dark]], r.mid[0] - 1.5, r.mid[1] - 1.5);
      ctx.beginPath(); ctx.ellipse(r.mid[0], r.mid[1], 6.2, 5.6, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = CY; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.ellipse(r.mid[0], r.mid[1], 3.8, 3.2, 0, 0, TAU); ctx.stroke();
      const curl = p.storm > 0.5 ? 0.05 : p.fist ? 0.85 : 0.45;
      const tips = hand3d(ctx, r.end, a.angle, { n: 4, len: 7.5, w: 2.2, palm: 5.6, spread: p.fist ? 0.7 : 1.1, curl, col: HULL, tipCol: "#9FF8FF" });
      (tips || []).forEach(([tx, ty]) => glow(ctx, tx, ty, 6 + p.storm * 6, "rgba(95,227,232,0.85)", 0.3 + p.storm * 0.6));
    });
    // pauldrons
    [-1, 1].forEach((s) => {
      ctx.save(); ctx.translate(s * 17, chestY + 2); const ok = paintSuit(ctx, PB, 1, s, m, p); ctx.restore();
      if (ok) return;
      const pd = new Path2D(); pd.ellipse(s * 17, chestY + 2, 8, 6.4, s * 0.3, PI, TAU); pd.lineTo(s * 24, chestY + 6); pd.lineTo(s * 10, chestY + 6); pd.closePath();
      ctx.fillStyle = linear(ctx, s * 10, chestY - 4, s * 24, chestY + 6, [[0, HULL.lite], [0.5, HULL.mid], [1, HULL.dark]]); ctx.fill(pd);
      shade(ctx, pd, [s > 0 ? 9 : -25, chestY - 5, 16, 12], { rim, shadow: 0.35, spec: 0.5, line: HULL.line, lineW: 0.6 });
      ctx.strokeStyle = CY; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.ellipse(s * 17, chestY + 2, 6, 4.4, s * 0.3, PI + 0.3, TAU - 0.3); ctx.stroke();
    });
    // the collar ring and the helmet
    const cr = new Path2D(); cr.ellipse(headC[0], headC[1] + 13, 11, 3.6, 0, 0, TAU);
    ctx.fillStyle = linear(ctx, 0, headC[1] + 9, 0, headC[1] + 17, [[0, HULL.mid], [1, HULL.dark]]); ctx.fill(cr);
    ctx.strokeStyle = CY; ctx.lineWidth = 0.9; ctx.stroke(cr);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i === Math.floor(t * 6) % 5 ? "#FFFFFF" : CY; ctx.fillRect(headC[0] - 8 + i * 4 - 0.7, headC[1] + 15.6, 1.4, 1.2); }
    ctx.save(); ctx.translate(headC[0], headC[1]);
    paintHelmet(ctx, m, p);
    ctx.restore();
    // up in the storm the dreads are in front of everything
    if (p.storm >= 0.5) dreads.forEach(drawDread);
    ctx.restore();
  }

  return { draw: { sypher: drawSypher }, height: 100, title: { sypher: ["SYPHER", "VOID PILOT · XENOKLASH"] } };
}
