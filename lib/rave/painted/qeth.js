// Qeth, with its head painted per pixel (look-lab). The robe, arms, crown
// filaments and orb are the Rave's own drawing (lib/rave/dancers.js).
import { TAU, lerp, clamp, smooth, P, glow, radial, linear } from "../draw";
import { arm3d, hand3d, shade, trim } from "../shade";
import { FRAG as DJ } from "./djShader";
import { makeGL } from "./glutil";
import { qethCape } from "../costumes";
import { rangerHat } from "../cicada";
import { paintVampireCape, vampireClasp, paintRangerHat, fangs } from "./costumes";
const PI = Math.PI;
const COMMON = DJ.slice(DJ.indexOf("const float PI"), DJ.indexOf("// ---------- materials ----------"));
const GOLD = "#C9A85E";
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);
const armAt = (sh, a, len) => [sh[0] + Math.cos(a) * len, sh[1] + Math.sin(a) * len];
const rimOf = (m, a = 0.85) => `hsla(${m.pal.b},100%,72%,${a})`;
const HB = { x0: 34, y0: 2, w: 52, h: 76 };
const Q_SH = { uL: [38, 86], uR: [82, 86], lL: [44, 93], lR: [76, 93] };
const Q_SKIN = { lite: "#A8F5DA", mid: "#47A88C", dark: "#1D5E4E", line: "#0B3128" };
const Q_SLEEVE = { lite: "#3E4F96", mid: "#26336A", dark: "#10163A" };
const qethRest = { lift: 0, lean: 0, sy: 1, hem: 0, flare: 0, head: 0, headY: 0, look: [0, 0], uL: [20, 110], uR: [100, 110], lL: [52, 108], lR: [68, 108], orb: [60, 106], orbGlow: 0, happy: 0, crown: 0, feet: [0, 0], fly: 0, gather: 0 };
function qArms(angs, lens = [30, 30, 20, 20]) {
  return { uL: armAt(Q_SH.uL, angs[0], lens[0]), uR: armAt(Q_SH.uR, angs[1], lens[1]), lL: armAt(Q_SH.lL, angs[2], lens[2]), lR: armAt(Q_SH.lR, angs[3], lens[3]) };
}
// Qeth's crown lights in flight, in the colours of Before's motes
const MOTES = [[233, 210, 154], [232, 207, 192], [139, 149, 246], [185, 192, 255], [255, 248, 236]];
function lightAt(i, B, gather) {
  const a = B * PI * 0.5 + i * (TAU / 5);
  const r = (24 + 7 * Math.sin(B * PI * 0.5 + i * 1.7)) * (1 - 0.88 * gather);
  const bob = -Math.abs(Math.sin((B + i * 0.2) * PI)) * 6 * (1 - gather);
  return [60 + Math.cos(a) * r * 1.25, -24 + Math.sin(a) * r * 0.55 + bob];
}
function drawFlyingLights(ctx, flying, fly, gather, m) {
  const e = fly * fly * (3 - 2 * fly);
  flying.forEach(({ i, tx, ty }) => {
    const c = MOTES[i];
    const col = (a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    // a short trail of where it's just been
    for (let k = 5; k >= 1; k--) {
      const [ax, ay] = lightAt(i, m.B - k * 0.05, gather);
      glow(ctx, lerp(tx, ax, e), lerp(ty, ay, e), 5.4 - k * 0.6, col(0.9), (0.6 - k * 0.09) * e);
    }
    const [ax, ay] = lightAt(i, m.B, gather);
    const x = lerp(tx, ax, e), y = lerp(ty, ay, e);
    glow(ctx, x, y, 14 + dipOf(m) * 8 + gather * 10, col(0.95), 1);
    glow(ctx, x, y, 5, col(1), 1);
    ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(x, y, 2.3 + gather * 0.8, 0, TAU); ctx.fill();
  });
  // gathered into one, they flare together
  if (gather > 0.6) glow(ctx, 60, -24, 30 * gather, "rgba(255,248,236,0.9)", (gather - 0.6) * 2);
}

const QFRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec4 uBox;
uniform float uT, uB, uBass, uHueA, uHueB, uHappy, uBlink, uFlare;
uniform vec2 uLook;
${COMMON}
#define GRAD(F, p) normalize(vec2(F(p + vec2(0.12, 0.0)) - F(p - vec2(0.12, 0.0)), F(p + vec2(0.0, 0.12)) - F(p - vec2(0.0, 0.12))) + 1e-5)
vec3 QSKIN() { return lin(vec3(0.24, 0.6, 0.48)); }
float headSD(vec2 p) { return smin(sdEll(p - vec2(60.0, 36.0), vec2(22.0, 30.0)), sdEll(p - vec2(60.0, 57.0), vec2(14.5, 15.0)), 7.0); }
float curHead(vec2 p) { return headSD(p); }
float distCurve(vec2 p, vec2 a, vec2 c, vec2 b) {
  // distance to a quadratic curve, by sampling
  float best = 1e3;
  for (int i = 0; i < 12; i++) {
    float t0 = float(i) / 12.0, t1 = float(i + 1) / 12.0;
    vec2 q0 = mix(mix(a, c, t0), mix(c, b, t0), t0), q1 = mix(mix(a, c, t1), mix(c, b, t1), t1);
    vec2 pa = p - q0, ba = q1 - q0; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    best = min(best, length(pa - ba * h));
  }
  return best;
}
void main() {
  vec2 f = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uBox.x + f.x * uBox.z, uBox.y + (1.0 - f.y) * uBox.w);
  px = uBox.z / uRes.x;
  rimA = lin(hsl2rgb(uHueA, 1.0, 0.62)) * 1.1;
  rimB = lin(hsl2rgb(uHueB, 1.0, 0.68)) * 1.1;
  vec3 gold = lin(vec3(0.91, 0.82, 0.6));
  vec3 cyan = lin(vec3(0.56, 0.9, 1.0));
  float hd = headSD(p);
  if (hd < px * 2.0) {
    vec2 g = GRAD(curHead, p);
    vec3 n = nrm(g, hd, 18.0);
    vec2 ap = vec2(abs(p.x - 60.0), p.y);
    float side = sign(p.x - 60.0);
    // cheekbones, hollow cheeks, a heavy brow, the face creases
    float cheek = exp(-dot((ap - vec2(13.0, 46.0)) / vec2(3.5, 6.0), (ap - vec2(13.0, 46.0)) / vec2(3.5, 6.0)));
    float hollow = exp(-dot((ap - vec2(16.0, 52.0)) / vec2(4.0, 8.0), (ap - vec2(16.0, 52.0)) / vec2(4.0, 8.0)));
    float browR = exp(-pow((p.y - 31.5 + uHappy * 1.5 + pow((ap.x - 10.0) / 7.0, 2.0) * 2.5) / 1.6, 2.0)) * smoothstep(19.0, 15.0, ap.x) * smoothstep(1.0, 4.0, ap.x);
    float crease = exp(-pow(distCurve(vec2(ap.x + 60.0, p.y), vec2(74.0, 30.0), vec2(70.0, 44.0), vec2(73.0, 56.0)) / 0.7, 2.0));
    float fore = exp(-pow(distCurve(p, vec2(60.0, 12.0), vec2(60.0, 16.5), vec2(60.0, 21.0)) / 0.6, 2.0));
    n = normalize(n + vec3(side * (cheek * 0.45 - hollow * 0.35), -browR * 0.6 + cheek * 0.25, 0.0));
    vec3 alb = QSKIN() * (0.88 + 0.22 * fbm(p * 0.25 + 3.0));
    alb = mix(alb, lin(vec3(0.55, 0.95, 0.8)), smoothstep(0.6, 0.85, fbm(p * 0.12 + 7.0)) * 0.3);
    alb *= 1.0 - hollow * 0.3 - crease * 0.45 - fore * 0.4;
    vec2 b = vec2(noise(p * 1.8) - 0.5, noise(p * 1.8 + 7.3) - 0.5) * 0.07;
    n = normalize(n + vec3(b, 0.0));
    vec3 c = light(alb, n, 60.0, 0.4, 0.45, lin(vec3(0.3, 0.75, 0.55)), 1.0);
    c *= mix(1.0, 0.45, pow(clamp(1.0 + hd / 18.0, 0.0, 1.0), 4.0));
    // the brows, darker
    c *= 1.0 - 0.45 * browR;
    // glow-dots down the cheeks
    for (int i = 0; i < 6; i++) {
      vec2 dc = i == 0 ? vec2(44.0, 48.0) : i == 1 ? vec2(45.0, 53.0) : i == 2 ? vec2(47.0, 58.0) : i == 3 ? vec2(76.0, 48.0) : i == 4 ? vec2(75.0, 53.0) : vec2(73.0, 58.0);
      float on = 0.4 + 0.6 * max(0.0, sin(uB * PI - float(i) * 0.5));
      float dd = length(p - dc);
      c = mix(c, cyan * (1.0 + on), smoothstep(1.2, 0.7, dd) * on);
      c += cyan * exp(-dd * 0.9) * on * 0.3;
    }
    // two eyes (or happy arcs), gold, slit pupils, wet
    for (int i = 0; i < 2; i++) {
      vec2 ec = vec2(i == 0 ? 49.5 : 70.5, 38.0);
      vec2 q = p - ec;
      float closed = max(step(0.5, uHappy), uBlink);
      if (closed > 0.5) {
        float arcY = mix(0.0, -4.0, uHappy * (1.0 - uBlink));
        float lid = distCurve(q, vec2(-6.5, 1.0), vec2(0.0, 1.0 + arcY * 1.5), vec2(6.5, 1.0));
        c *= 1.0 - 0.85 * smoothstep(1.0, 0.4, lid);
      } else {
        float ed = sdEll(q, vec2(6.6, 3.7));
        c *= 1.0 - 0.4 * smoothstep(1.5, 0.0, ed) * step(0.0, ed);
        if (ed < 0.5) {
          vec2 qq = q / vec2(6.6, 3.7); float e = clamp(length(qq), 0.0, 1.0);
          vec3 en = normalize(vec3(qq * 0.8, sqrt(max(1.0 - e * e, 0.0)) + 0.2));
          vec3 ecol = lin(vec3(0.02, 0.015, 0.03));
          vec2 iq = q - uLook; float ir = length(iq) / 3.3;
          if (ir < 1.05) {
            float ang = atan(iq.y, iq.x);
            vec3 ic = mix(lin(vec3(1.0, 0.97, 0.88)), lin(vec3(0.91, 0.82, 0.6)), smoothstep(0.0, 0.45, ir));
            ic = mix(ic, lin(vec3(0.48, 0.29, 0.07)), smoothstep(0.5, 1.0, ir));
            ic *= 0.8 + 0.3 * noise(vec2(ang * 9.0, ir * 3.0));
            ic *= 1.0 + 0.35 * pow(0.5 + 0.5 * sin(ir * 16.0 + uT * 2.0), 6.0);
            ic = mix(ic, lin(vec3(0.01, 0.01, 0.02)), smoothstep(1.1, 0.85, length(iq / vec2(0.9, 2.4))));
            ecol = mix(ecol, ic * 1.2, smoothstep(1.04, 0.95, ir));
          }
          vec3 H = normalize(normalize(vec3(-0.35, -0.7, 0.6)) + vec3(0.0, 0.0, 1.0));
          ecol += vec3(1.0) * pow(max(dot(en, H), 0.0), 250.0) * 1.2;
          ecol += vec3(1.0) * smoothstep(1.0, 0.6, length(q - uLook - vec2(-1.2, -1.4)) / 0.9) * 0.8;
          ecol *= 1.0 - 0.5 * smoothstep(-0.25, 0.0, ed / 3.7);
          c = mix(c, ecol, clamp(0.5 - ed / px, 0.0, 1.0));
        }
      }
    }
    // the third eye, high on the brow
    {
      vec2 q = p - vec2(60.0, 25.0);
      float ed = sdEll(q, vec2(3.0, 4.0));
      c *= 1.0 - 0.4 * smoothstep(1.2, 0.0, ed) * step(0.0, ed);
      if (ed < 0.5) {
        vec2 qq = q / vec2(3.0, 4.0); float e = clamp(length(qq), 0.0, 1.0);
        vec3 en = normalize(vec3(qq * 0.8, sqrt(max(1.0 - e * e, 0.0)) + 0.2));
        vec2 iq = (q - uLook * 0.5) / vec2(1.8, 2.6);
        vec3 ecol = lin(vec3(0.02, 0.015, 0.03));
        float ir = length(iq);
        vec3 ic = mix(lin(vec3(1.0, 0.95, 0.85)), lin(vec3(0.55, 0.35, 0.11)), smoothstep(0.0, 1.0, ir));
        ecol = mix(ecol, ic * (1.2 + uFlare * 0.6), smoothstep(1.05, 0.9, ir));
        ecol += vec3(1.0) * pow(max(dot(en, normalize(vec3(-0.35, -0.6, 0.75))), 0.0), 200.0);
        c = mix(c, ecol, clamp(0.5 - ed / px, 0.0, 1.0));
      }
      c += gold * exp(-max(sdEll(q, vec2(3.0, 4.0)), 0.0) * 0.5) * (0.2 + uFlare * 0.35);
    }
    // nostrils and the mouth
    float nos = min(distCurve(p, vec2(57.5, 50.0), vec2(57.9, 51.2), vec2(58.3, 52.4)), distCurve(p, vec2(62.5, 50.0), vec2(62.1, 51.2), vec2(61.7, 52.4)));
    c *= 1.0 - 0.6 * smoothstep(0.7, 0.2, nos);
    {
      float xm = (p.x - 60.0) / 7.0;
      if (abs(xm) < 1.1) {
        float yl = 60.0 + (4.0 + uHappy * 4.0) * 0.5 * (1.0 - xm * xm);
        float inM = min(p.y - 60.0 + 0.3 * (1.0 - xm * xm), yl - p.y);
        c *= 1.0 - 0.3 * smoothstep(-1.2, 0.0, inM);
        if (abs(xm) < 1.0) c = mix(c, lin(vec3(0.02, 0.06, 0.05)), smoothstep(-0.25, 0.25, inM));
        float lip = exp(-pow((p.y - (yl + 1.6)) / 0.6, 2.0)) * (1.0 - xm * xm);
        c += lin(vec3(0.5, 0.9, 0.8)) * lip * 0.15;
      }
    }
    put(hd, c);
  }
  gl_FragColor = acc.a > 0.0 ? vec4(sqrt(max(acc.rgb / acc.a, 0.0)) * acc.a, acc.a) : vec4(0.0);
}
`;
function drawBody(ctx, p, m, paintHead) {
    const rim = rimOf(m);
    ctx.save();
    ctx.translate(0, p.lift);
    ctx.rotate(p.lean);
    ctx.scale(1, p.sy);
    ctx.translate(-60, -150);
    glow(ctx, 60, 70, 60, "rgba(111,195,168,0.3)", 0.5 + p.crown * 0.6 + m.bass * 0.3);
    // feet, peeking out under the hem
    [[50, p.feet[0]], [70, p.feet[1]]].forEach(([x, f]) => {
      const fx = x + (x - 60) * 0.2 * f, fy = 150 - f * 3;
      ctx.fillStyle = radial(ctx, fx, fy, 7, [[0, "#2A3466"], [1, "#0A0E26"]], fx - 2, fy - 2);
      ctx.beginPath(); ctx.ellipse(fx, fy, 6.5, 3.2, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = GOLD; ctx.lineWidth = 0.5; ctx.stroke();
    });
    // the vampire's cape and collar, behind the robe (Update 6.15)
    if (m.halloween && !paintVampireCape(ctx, p, m)) qethCape(ctx, p, m);
    // ── the robe ──
    const h = p.hem, fl = p.flare;
    const hemY = 154 + Math.abs(h) * 0.2;
    const robe = new Path2D(`M${34 + h - fl} 150 Q${30 + h * 0.4} 104 40 82 Q60 74 80 82 Q${90 + h * 0.4} 104 ${86 + h + fl} 150 Q${60 + h} ${hemY} ${34 + h - fl} 150 Z`);
    ctx.fillStyle = linear(ctx, 30 + h * 0.3, 0, 90 + h * 0.3, 0, [[0, "#090C24"], [0.22, "#1D2756"], [0.42, "#2E3A78"], [0.58, "#222D62"], [0.8, "#121840"], [1, "#070A1E"]]);
    ctx.fill(robe);
    ctx.save(); ctx.clip(robe);
    // folds falling from the waist
    for (let i = 0; i < 5; i++) {
      const x0 = 42 + i * 9, x1 = 34 + i * 13 + h;
      ctx.strokeStyle = "rgba(4,6,20,0.55)"; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(x0, 112); ctx.quadraticCurveTo(lerp(x0, x1, 0.5) + h * 0.2, 132, x1, 154); ctx.stroke();
      ctx.strokeStyle = "rgba(120,140,220,0.18)"; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(x0 + 1.4, 114); ctx.quadraticCurveTo(lerp(x0, x1, 0.5) + h * 0.2 + 1.4, 132, x1 + 1.4, 154); ctx.stroke();
    }
    // the front panel, with gold diamonds down it
    const panel = new Path2D(`M55 84 L65 84 L${71 + h} 152 Q${60 + h} ${hemY + 1} ${49 + h} 152 Z`);
    ctx.fillStyle = linear(ctx, 50 + h * 0.5, 0, 70 + h * 0.5, 0, [[0, "#1E2A62"], [0.5, "#3A4C98"], [1, "#1A2456"]]);
    ctx.fill(panel);
    for (let y = 92; y < 148; y += 8) {
      const k = (y - 84) / 68, x = 60 + h * k;
      ctx.fillStyle = GOLD; ctx.beginPath(); ctx.moveTo(x, y - 2.4); ctx.lineTo(x + 1.8, y); ctx.lineTo(x, y + 2.4); ctx.lineTo(x - 1.8, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,240,200,0.6)"; ctx.beginPath(); ctx.arc(x - 0.4, y - 0.6, 0.5, 0, TAU); ctx.fill();
    }
    // embroidered band above the hem, and the glyphs that light with the music
    ctx.strokeStyle = GOLD; ctx.lineWidth = 0.8;
    ctx.beginPath(); for (let x = 30; x <= 92; x += 4) { const y = 141 + ((x / 4) % 2 ? -1.8 : 1.8); x === 30 ? ctx.moveTo(x + h, y) : ctx.lineTo(x + h, y); } ctx.stroke();
    ctx.strokeStyle = "rgba(201,168,94,0.6)"; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(28 + h, 137); ctx.lineTo(94 + h, 137); ctx.moveTo(28 + h, 145); ctx.lineTo(94 + h, 145); ctx.stroke();
    ctx.save(); ctx.globalAlpha = 0.35 + 0.6 * m.high; ctx.strokeStyle = "#6FE3C0"; ctx.lineWidth = 0.8; ctx.translate(h * 0.4, 0);
    ctx.stroke(P("M41 120 l4 -4 l4 4 l-4 4 Z M71 120 l4 -4 l4 4 l-4 4 Z M42 130 h6 M72 130 h6"));
    ctx.restore();
    // the sash
    const sash = P("M35 103 Q60 110 85 103 L85.6 111 Q60 118 34.4 111 Z");
    ctx.fillStyle = linear(ctx, 0, 103, 0, 116, [[0, "#8A2E66"], [0.5, "#5E1A48"], [1, "#2E0A24"]]); ctx.fill(sash);
    ctx.restore();
    trim(ctx, P("M35 103 Q60 110 85 103"), 0.8, GOLD); trim(ctx, P("M34.4 111 Q60 118 85.6 111"), 0.8, GOLD);
    trim(ctx, new Path2D(`M55 84 L${49 + h} 152 M65 84 L${71 + h} 152`), 1.0, GOLD);
    shade(ctx, robe, [30, 78, 62, 78], { rim, shadow: 0.55, spec: 0.1, sx: 0.3, sy: 0.15, line: "#05071A", lineW: 0.7 });
    trim(ctx, new Path2D(`M${34 + h - fl} 150 Q${60 + h} ${hemY} ${86 + h + fl} 150`), 1.8, GOLD);
    for (let k = 0; k <= 6; k++) { const s = k / 6, x = lerp(35 + h - fl, 85 + h + fl, s), y = 150 + Math.sin(s * PI) * (hemY - 150) * 0.95; ctx.fillStyle = "#FFE7A8"; ctx.beginPath(); ctx.arc(x, y, 0.7, 0, TAU); ctx.fill(); }
    // the sash's gem
    ctx.fillStyle = radial(ctx, 60, 113.5, 3.4, [[0, "#FFFFFF"], [0.4, `hsl(${m.pal.a},100%,70%)`], [1, `hsl(${m.pal.a},80%,30%)`]], 59, 112.5);
    ctx.beginPath(); ctx.arc(60, 113.5, 2.8, 0, TAU); ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 0.9; ctx.stroke();
    glow(ctx, 60, 113.5, 7, `hsla(${m.pal.a},100%,65%,0.9)`, 0.4 + m.bass * 0.6);
    if (m.halloween) vampireClasp(ctx, m);
    // the high collar behind the head
    const collar = P("M42 88 Q33 66 45 55 Q52 66 60 69 Q68 66 75 55 Q87 66 78 88 Z");
    ctx.fillStyle = linear(ctx, 40, 55, 80, 88, [[0, "#2A3678"], [0.5, "#161E4E"], [1, "#0A0E2A"]]); ctx.fill(collar);
    ctx.save(); ctx.clip(collar); ctx.strokeStyle = "rgba(111,195,168,0.4)"; ctx.lineWidth = 0.5;
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(60, 86); ctx.lineTo(42 + k * 9, 56); ctx.stroke(); }
    ctx.restore();
    trim(ctx, P("M42 88 Q33 66 45 55 Q52 66 60 69 Q68 66 75 55 Q87 66 78 88"), 0.9, GOLD);
    // pauldrons: two plates a side, gold-rimmed, crystals on top
    [["M33 92 Q34 78 48 77 L51 86 Q40 85 33 92 Z", "M38 84 Q40 76 49 76 L50 81 Q43 80 38 84 Z"], ["M87 92 Q86 78 72 77 L69 86 Q80 85 87 92 Z", "M82 84 Q80 76 71 76 L70 81 Q77 80 82 84 Z"]].forEach(([a, b]) => {
      [a, b].forEach((d, i) => {
        ctx.fillStyle = linear(ctx, 30, 74, 90, 92, [[0, i ? "#4A58A8" : "#3A4690"], [1, "#121846"]]); ctx.fill(P(d));
        trim(ctx, P(d), 0.55, GOLD);
      });
    });
    ctx.fillStyle = "#8FE6FF"; ctx.fill(P("M41 77 l2 -8 l2 8 Z M75 77 l2 -8 l2 8 Z"));
    glow(ctx, 43, 73, 7, "rgba(143,230,255,0.9)", 0.4 + m.high * 0.6); glow(ctx, 77, 73, 7, "rgba(143,230,255,0.9)", 0.4 + m.high * 0.6);
    // ── lower arms, the orb, upper arms ──
    const sleeveU = { to: 0.36, w: 1.5, col: Q_SLEEVE, trim: GOLD };
    const handO = { n: 3, len: 4.8, w: 1.15, palm: 1.6, spread: 1.15, curl: 0.35, col: Q_SKIN, tipCol: "#D8FFF0" };
    [[Q_SH.lL, p.lL, -0.4], [Q_SH.lR, p.lR, 0.4]].forEach(([sh, hd, b]) => {
      const r = arm3d(ctx, sh, hd, { bend: b, w0: 4.2, w1: 2.4, col: Q_SKIN, rim, bulge: 0.55, sleeve: { ...sleeveU, to: 0.32 } });
      hand3d(ctx, hd, r.angle, { ...handO, len: 4 });
    });
    [[Q_SH.uL, p.uL, -0.5], [Q_SH.uR, p.uR, 0.5]].forEach(([sh, hd, b]) => {
      const r = arm3d(ctx, sh, hd, { bend: b, w0: 4.4, w1: 2.4, col: Q_SKIN, rim, bulge: 0.55, sleeve: sleeveU, bands: [0.82], bandCol: GOLD });
      hand3d(ctx, hd, r.angle, handO);
    });
    // collar ring and gem
    const ring = new Path2D(); ring.ellipse(60, 78, 13.5, 4.2, 0, 0, TAU);
    ctx.fillStyle = linear(ctx, 0, 74, 0, 82, [[0, "#2A3270"], [1, "#0E1232"]]); ctx.fill(ring);
    trim(ctx, ring, 0.9, GOLD);
    ctx.fillStyle = radial(ctx, 60, 80, 2.6, [[0, "#FFE6F0"], [0.5, "#E8A4C0"], [1, "#7A2850"]], 59.3, 79.3); ctx.beginPath(); ctx.arc(60, 80, 2.4, 0, TAU); ctx.fill();
    // ── the head ──
    ctx.save();
    ctx.translate(60, 74 + p.headY); ctx.rotate(p.head); ctx.translate(-60, -74);
    ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(62, 76, 11, 3.4, 0, 0, TAU); ctx.fill();
    paintHead(ctx, p, m);
    if (m.halloween) fangs(ctx, [56.4, 63.6], 60.6 + (p.happy || 0) * 1.2, 3.4, 1.05);
    // crown of filaments: they flare on every beat; in "lights" the five
    // lit tips leave their filaments and dance in the air above
    const flare = dipOf(m) * (0.4 + 0.6 * m.amp);
    const fly = smooth(0, 1, p.fly || 0);
    const flying = [];
    [[-18, 18], [-10, 9], [0, 4], [10, 9], [18, 18]].forEach(([dx, top], i) => {
      const sway = Math.sin(m.t * 2 + i) * 1.5 + (p.crown ? Math.sin(m.B * PI + i) * 3 * p.crown : 0);
      const tx = 60 + dx + sway, ty = top - 8 - flare * 3 * (1 - fly);
      ctx.lineCap = "round";
      ctx.strokeStyle = "#7A6232"; ctx.lineWidth = 2.1;
      ctx.beginPath(); ctx.moveTo(60 + dx * 0.5, 14); ctx.quadraticCurveTo(60 + dx * 0.9, top + 4, tx, ty); ctx.stroke();
      ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.strokeStyle = "rgba(255,250,230,0.8)"; ctx.lineWidth = 0.4; ctx.stroke();
      // the empty socket the light sits in
      ctx.fillStyle = "#5A4824"; ctx.beginPath(); ctx.arc(tx, ty, 1.3, 0, TAU); ctx.fill();
      if (fly < 0.02) {
        ctx.fillStyle = "#FFF4DC"; ctx.beginPath(); ctx.arc(tx, ty, 2, 0, TAU); ctx.fill();
        glow(ctx, tx, ty, 6 + flare * 8 + p.crown * 6, "rgba(255,244,220,0.95)", 0.5 + flare * 0.5);
      } else flying.push({ i, tx, ty });
    });
    if (flying.length) drawFlyingLights(ctx, flying, fly, p.gather || 0, m);
    // the ranger hat sits over the crown (Update 6.15)
    if (m.cicada && !paintRangerHat(ctx, m, 60, 15, 50, 0)) rangerHat(ctx, 60, 15, 50, 0);
    ctx.restore();
    // the orb, always in front of everything else
    const [ox, oy] = p.orb;
    glow(ctx, ox, oy, 14 + p.orbGlow * 26 + m.bass * 8, "rgba(143,230,255,0.9)", 0.35 + p.orbGlow * 0.65);
    ctx.fillStyle = radial(ctx, ox, oy, 6.5, [[0, "#FFFFFF"], [0.35, "#8FE6FF"], [0.8, "#2A5C96"], [1, "#122A50"]], ox - 2, oy - 2);
    ctx.beginPath(); ctx.arc(ox, oy, 6, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(ox, oy); ctx.rotate(m.t * 1.5); ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(0, 0, 3.8, 0, 2.2); ctx.stroke(); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.ellipse(ox - 2, oy - 2.4, 1.6, 0.9, -0.6, 0, TAU); ctx.fill();
    ctx.restore();
}

export function makeQeth() {
  const G = makeGL(QFRAG, HB, ["uRes", "uBox", "uT", "uB", "uBass", "uHueA", "uHueB", "uHappy", "uBlink", "uFlare", "uLook"], [], "QB_");
  if (!G) return null;
  function paintHead(ctx, p, m) {
    const tf = ctx.getTransform(); const k = Math.hypot(tf.a, tf.b);
    let w = Math.round(HB.w * k), h = Math.round(HB.h * k);
    const cap = 1100 / Math.max(w, h); if (cap < 1) { w = Math.round(w * cap); h = Math.round(h * cap); }
    const { gl, U, c } = G;
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h); gl.uniform4f(U.uBox, HB.x0, HB.y0, HB.w, HB.h);
    gl.uniform1f(U.uT, m.t); gl.uniform1f(U.uB, m.B); gl.uniform1f(U.uBass, m.bass); gl.uniform1f(U.uHueA, m.pal.a); gl.uniform1f(U.uHueB, m.pal.b);
    gl.uniform1f(U.uHappy, p.happy); gl.uniform1f(U.uBlink, (m.t % 4.7) > 4.55 ? 1 : 0);
    gl.uniform1f(U.uFlare, dipOf(m) * (0.4 + 0.6 * m.amp)); gl.uniform2f(U.uLook, p.look[0], p.look[1]);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    ctx.drawImage(c, HB.x0, HB.y0, HB.w, HB.h);
  }
  return (ctx, p, m) => drawBody(ctx, p, m, paintHead);
}
