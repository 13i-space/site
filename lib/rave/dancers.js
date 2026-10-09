// The Rave's dancers (Update 5.68): Qeth, Ilu and Ixxen from the Alien Lab and
// Varrow from the Wish Engine, redrawn as posable canvas figures so they can
// dance. Each one has:
//   rest            its pose standing still
//   moves[name](m)  a pose for this moment of the music (m: see RaveMode)
//   draw(ctx,p,m)   draws it, feet/base at (0,0)
// Their looks follow the originals (components/AlienLab.js, LabScene.js,
// WishEngine.js); their moves are new.
import { TAU, lerp, clamp, smooth, P, limb, tube, fingers, glow, radial, linear } from "./draw";

const PI = Math.PI;
// shared rhythm shapes
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU); // 1 on the beat, 0 between
const sideOf = (m) => Math.cos(m.B * PI); // +1 / -1 on alternate beats
const snapOf = (m) => { const s = sideOf(m); return Math.sign(s) * Math.pow(Math.abs(s), 0.45); };
const armAt = (sh, a, len) => [sh[0] + Math.cos(a) * len, sh[1] + Math.sin(a) * len];

// ═══════════════════════════ QETH ═══════════════════════════
// the Overseer: tall, robed, four thin arms, three eyes, a crown of lit
// filaments, an orb it keeps close. Moves with dignity, until the drop.
const Q_SH = { uL: [38, 86], uR: [82, 86], lL: [44, 92], lR: [76, 92] };
const qethRest = { lift: 0, lean: 0, sy: 1, hem: 0, flare: 0, head: 0, headY: 0, look: [0, 0], uL: [20, 110], uR: [100, 110], lL: [52, 108], lR: [68, 108], orb: [60, 106], orbGlow: 0, happy: 0, crown: 0, feet: [0, 0] };
function qArms(m, angs, lens = [30, 30, 20, 20]) {
  // angs: uL, uR, lL, lR (radians, canvas)
  return { uL: armAt(Q_SH.uL, angs[0], lens[0]), uR: armAt(Q_SH.uR, angs[1], lens[1]), lL: armAt(Q_SH.lL, angs[2], lens[2]), lR: armAt(Q_SH.lR, angs[3], lens[3]) };
}
const qeth = {
  name: "Qeth",
  height: 158,
  rest: qethRest,
  moves: {
    sway(m) {
      const A = m.amp, s = sideOf(m), d = dipOf(m);
      const w = Math.sin(m.B * PI * 0.5);
      return { ...qethRest, lean: s * 0.05 * A, hem: -s * 7 * A, lift: d * 1.5 * A, sy: 1 - d * 0.02 * A, head: s * 0.1 * A,
        uL: [19 - 3 * w * A, 104 - 12 * A * (0.5 + 0.5 * w)], uR: [101 - 3 * w * A, 104 - 12 * A * (0.5 - 0.5 * w)], orb: [60, 106 + d * 1.5], feet: [s > 0 ? d * A : 0, s < 0 ? d * A : 0] };
    },
    ripple(m) {
      const A = m.amp, d = dipOf(m);
      const wv = (i) => 0.5 + 0.5 * Math.sin((m.B - i * 0.25) * PI);
      const L = (i) => lerp(2.25, 4.1, wv(i) * A), R = (i) => lerp(0.9, -0.95, wv(i) * A);
      return { ...qethRest, ...qArms(m, [L(0), R(3), L(1), R(2)], [30, 30, 21, 21]), lift: d * 2 * A, sy: 1 - d * 0.025 * A,
        head: Math.sin(m.B * PI * 0.5) * 0.12 * A, hem: Math.sin(m.B * PI * 0.5) * 5 * A, orb: [60, 104 - 8 * wv(1.5) * A], orbGlow: 0.4 * A, crown: 0.3 * A };
    },
    toss(m) {
      const A = Math.max(0.6, m.amp), d = dipOf(m);
      const k = ((m.B % 2) + 2) % 2 / 2; // one throw every two beats
      const air = Math.sin(k * PI);
      const oy = 104 - air * 46 * A;
      const reach = smooth(0.75, 1, k) + (1 - smooth(0, 0.2, k));
      const lo = (x) => [lerp(x, 60 + (x - 60) * 0.4, reach), lerp(116, oy + 4, reach)];
      const up = Math.sin(m.B * PI);
      return { ...qethRest, lL: lo(48), lR: lo(72), orb: [60, oy], orbGlow: air * 0.8,
        uL: armAt(Q_SH.uL, 3.6 + up * 0.35, 30), uR: armAt(Q_SH.uR, -0.45 - up * 0.35, 30),
        look: [0, -1.4 * air], head: -0.06 * air, lift: d * 1.5 * A, hem: Math.sin(m.B * PI * 0.5) * 4 };
    },
    vogue(m) {
      const F = [
        { uL: [44, 26], uR: [112, 74], lL: [40, 112], lR: [80, 112], head: -0.22, lean: -0.05, orb: [60, 120] },
        { uL: [8, 74], uR: [76, 26], lL: [40, 112], lR: [80, 112], head: 0.22, lean: 0.05, orb: [60, 120] },
        { uL: [10, 34], uR: [110, 34], lL: [66, 96], lR: [54, 96], head: 0, lean: 0, orb: [60, 92] },
        { uL: [45, 42], uR: [75, 42], lL: [28, 120], lR: [92, 120], head: 0.05, lean: 0, orb: [60, 108] },
      ];
      const f = ((Math.floor(m.B) % 4) + 4) % 4, k = smooth(0, 0.22, m.ph);
      const a = F[(f + 3) % 4], b = F[f];
      const mixv = (x, y) => (Array.isArray(y) ? y.map((v, i) => lerp(x[i], v, k)) : lerp(x, y, k));
      const o = {}; for (const key in b) o[key] = mixv(a[key], b[key]);
      return { ...qethRest, ...o, lift: dipOf(m) * 1.2, hem: (f % 2 ? 4 : -4) * k, crown: 0.4, orbGlow: 0.5 };
    },
    raise(m) {
      const A = Math.max(0.7, m.amp), d = dipOf(m);
      const pump = d * 0.35;
      return { ...qethRest, ...qArms(m, [3.85 + pump, -0.7 - pump, 3.4 + pump * 0.6, 0.0 - pump * 0.6 - 0.25], [32, 32, 22, 22]),
        lift: d * 3 * A, sy: 1 - d * 0.035, hem: sideOf(m) * 6, head: sideOf(m) * 0.08, happy: 1, crown: 1,
        orb: [60 + Math.sin(m.B * PI * 0.5) * 6, -18 - d * 6], orbGlow: 1, feet: [d, 1 - d] };
    },
  },
  draw(ctx, p, m) {
    ctx.save();
    ctx.translate(0, p.lift);
    ctx.rotate(p.lean);
    ctx.scale(1, p.sy);
    ctx.translate(-60, -150);
    // aura
    glow(ctx, 60, 70, 60, "rgba(111,195,168,0.32)", 0.6 + p.crown * 0.6 + m.bass * 0.3);
    // feet, peeking out under the hem
    ctx.fillStyle = "#0E1430";
    [[50, p.feet[0]], [70, p.feet[1]]].forEach(([x, f]) => { ctx.beginPath(); ctx.ellipse(x + (x - 60) * 0.2 * f, 150 - f * 3, 6, 3, 0, 0, TAU); ctx.fill(); });
    // robe, swinging
    const h = p.hem, fl = p.flare;
    const robe = new Path2D(`M${34 + h - fl} 150 Q${30 + h * 0.4} 104 40 82 Q60 74 80 82 Q${90 + h * 0.4} 104 ${86 + h + fl} 150 Q${60 + h} ${154 + Math.abs(h) * 0.2} ${34 + h - fl} 150 Z`);
    ctx.fillStyle = linear(ctx, 30, 80, 90, 150, [[0, "#24305E"], [0.6, "#141A3E"], [1, "#0A0D24"]]);
    ctx.fill(robe); ctx.strokeStyle = "#3E4890"; ctx.lineWidth = 1; ctx.stroke(robe);
    ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(60, 80); ctx.quadraticCurveTo(60 + h * 0.5, 120, 60 + h, 152); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.lineWidth = 1.6; ctx.stroke(P("M40 84 Q60 92 80 84"));
    // glyphs on the robe light up with the music
    ctx.save(); ctx.strokeStyle = "#6FC3A8"; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.45 + 0.5 * m.high;
    ctx.translate(h * 0.3, 0);
    ctx.stroke(P("M48 104 l4 -4 l4 4 l-4 4 Z M64 104 l4 -4 l4 4 l-4 4 Z M47 120 h10 M63 120 h10 M52 116 v8 M68 116 v8"));
    ctx.beginPath(); ctx.arc(52, 136, 3, 0, TAU); ctx.moveTo(71, 136); ctx.arc(68, 136, 3, 0, TAU); ctx.stroke();
    ctx.restore();
    // pauldrons with crystals
    ctx.fillStyle = "#2A3470"; ctx.fill(P("M34 90 Q36 78 48 78 L50 86 Q40 86 34 90 Z M86 90 Q84 78 72 78 L70 86 Q80 86 86 90 Z"));
    ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.8; ctx.stroke(P("M34 90 Q36 78 48 78 L50 86 Q40 86 34 90 Z M86 90 Q84 78 72 78 L70 86 Q80 86 86 90 Z"));
    ctx.fillStyle = "#8FE6FF"; ctx.fill(P("M40 80 l2 -7 l2 7 Z M78 80 l2 -7 l2 7 Z"));
    glow(ctx, 42, 76, 6, "rgba(143,230,255,0.8)", 0.4 + m.high * 0.6); glow(ctx, 80, 76, 6, "rgba(143,230,255,0.8)", 0.4 + m.high * 0.6);
    // lower arms and the orb
    const skin = "#3E9C82";
    limb(ctx, Q_SH.lL, p.lL, -0.4, 3.2, 2.4, skin);
    limb(ctx, Q_SH.lR, p.lR, 0.4, 3.2, 2.4, skin);
    fingers(ctx, p.lL, Math.atan2(p.lL[1] - Q_SH.lL[1], p.lL[0] - Q_SH.lL[0]), 3, 3.4, 1.1, "#9BF0D2", 1.1);
    fingers(ctx, p.lR, Math.atan2(p.lR[1] - Q_SH.lR[1], p.lR[0] - Q_SH.lR[0]), 3, 3.4, 1.1, "#9BF0D2", 1.1);
    const [ox, oy] = p.orb;
    glow(ctx, ox, oy, 14 + p.orbGlow * 26 + m.bass * 8, "rgba(143,230,255,0.9)", 0.35 + p.orbGlow * 0.65);
    ctx.fillStyle = radial(ctx, ox, oy, 6.5, [[0, "#FFFFFF"], [0.4, "#8FE6FF"], [1, "#1F4A7A"]], ox - 2, oy - 2);
    ctx.beginPath(); ctx.arc(ox, oy, 6, 0, TAU); ctx.fill();
    // upper arms
    limb(ctx, Q_SH.uL, p.uL, -0.5, 2.8, 2, skin);
    limb(ctx, Q_SH.uR, p.uR, 0.5, 2.8, 2, skin);
    fingers(ctx, p.uL, Math.atan2(p.uL[1] - Q_SH.uL[1], p.uL[0] - Q_SH.uL[0]), 3, 4.4, 1.2, "#9BF0D2", 1.2);
    fingers(ctx, p.uR, Math.atan2(p.uR[1] - Q_SH.uR[1], p.uR[0] - Q_SH.uR[0]), 3, 4.4, 1.2, "#9BF0D2", 1.2);
    // collar and gem
    ctx.fillStyle = "#1A2048"; ctx.beginPath(); ctx.ellipse(60, 78, 13, 4, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = "#E8B4C8"; ctx.beginPath(); ctx.arc(60, 80, 2.4, 0, TAU); ctx.fill();
    // the head
    ctx.save();
    ctx.translate(60, 74 + p.headY); ctx.rotate(p.head); ctx.translate(-60, -74);
    const head = P("M60 6 C76 6 84 22 82 40 C80 58 70 72 60 72 C50 72 40 58 38 40 C36 22 44 6 60 6 Z");
    ctx.fillStyle = radial(ctx, 54, 26, 46, [[0, "#9BF0D2"], [0.45, "#3E9C82"], [1, "#123A33"]], 52, 22);
    ctx.fill(head); ctx.strokeStyle = "#6FC3A8"; ctx.lineWidth = 1; ctx.stroke(head);
    ctx.strokeStyle = "rgba(18,58,51,0.6)"; ctx.lineWidth = 0.8; ctx.stroke(P("M46 30 Q50 44 47 56 M74 30 Q70 44 73 56 M60 12 L60 24"));
    [[44, 48], [45, 53], [47, 58], [76, 48], [75, 53], [73, 58]].forEach(([x, y], i) => {
      ctx.fillStyle = `rgba(143,230,255,${0.4 + 0.6 * Math.max(0, Math.sin(m.B * PI - i * 0.5))})`;
      ctx.beginPath(); ctx.arc(x, y, 1.1, 0, TAU); ctx.fill();
    });
    // crown of filaments: they flare on every beat
    const flare = dipOf(m) * (0.4 + 0.6 * m.amp);
    [[-18, 18], [-10, 9], [0, 4], [10, 9], [18, 18]].forEach(([dx, top], i) => {
      const sway = Math.sin(m.t * 2 + i) * 1.5 + (p.crown ? Math.sin(m.B * PI + i) * 3 * p.crown : 0);
      const tx = 60 + dx + sway, ty = top - 8 - flare * 3;
      ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = 1.4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(60 + dx * 0.5, 14); ctx.quadraticCurveTo(60 + dx * 0.9, top + 4, tx, ty); ctx.stroke();
      ctx.fillStyle = "#FFF4DC"; ctx.beginPath(); ctx.arc(tx, ty, 2, 0, TAU); ctx.fill();
      glow(ctx, tx, ty, 6 + flare * 8 + p.crown * 6, "rgba(255,244,220,0.95)", 0.5 + flare * 0.5);
    });
    // three eyes (closed into happy arcs when it's really going)
    const blink = (m.t % 4.7) > 4.55;
    const [lx, ly] = p.look;
    if (p.happy > 0.5 || blink) {
      ctx.strokeStyle = "#05040F"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(44, 39); ctx.quadraticCurveTo(50, blink ? 39 : 33, 56, 39); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(64, 39); ctx.quadraticCurveTo(70, blink ? 39 : 33, 76, 39); ctx.stroke();
    } else {
      ctx.fillStyle = "#05040F"; ctx.fill(P("M43 38 Q50 31 56 38 Q50 45 43 38 Z M64 38 Q70 31 77 38 Q70 45 64 38 Z"));
      [50, 70].forEach((x) => {
        ctx.fillStyle = radial(ctx, x + lx, 38 + ly, 3.2, [[0, "#FFF4DC"], [0.5, "#E9D29A"], [1, "#8A5A1C"]]);
        ctx.beginPath(); ctx.arc(x + lx, 38 + ly, 3.2, 0, TAU); ctx.fill();
        ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.ellipse(x + lx, 38 + ly, 0.9, 2.4, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x + lx - 1.2, 36.6 + ly, 0.9, 0, TAU); ctx.fill();
      });
    }
    ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.ellipse(60, 25, 3, 4, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = radial(ctx, 60, 25.4, 2.6, [[0, "#FFF4DC"], [0.5, "#E9D29A"], [1, "#8A5A1C"]]);
    ctx.beginPath(); ctx.ellipse(60 + lx * 0.5, 25.4 + ly * 0.5, 1.8, 2.6, 0, 0, TAU); ctx.fill();
    glow(ctx, 60, 25, 8, "rgba(233,210,154,0.9)", 0.3 + flare * 0.5);
    ctx.strokeStyle = "#123A33"; ctx.lineWidth = 0.9; ctx.stroke(P("M57.5 50 l0.8 2.4 M62.5 50 l-0.8 2.4"));
    // mouth: a calm line, a grin when it's going
    ctx.fillStyle = "#0A1A18"; ctx.strokeStyle = "#0A1A18"; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(53, 60); ctx.quadraticCurveTo(60, 64 + p.happy * 4, 67, 60); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.ellipse(52, 16, 9, 4, 0, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.restore();
  },
};

// ═══════════════════════════ ILU ═══════════════════════════
// the Technician: a floating orb, one great eye, two antennae, seven
// tentacles. All bounce. On the drop its eye turns into a mirrorball.
const iluRest = { lift: 0, sx: 1, sy: 1, rot: 0, spin: 0, flare: 0, tent: [0, 0, 0, 0, 0, 0, 0], curl: [0, 0, 0, 0, 0, 0, 0], look: [0, 0], mirror: 0, ant: 0, sticks: 0, stickA: 0, mouth: 0 };
const ilu = {
  name: "Ilu",
  height: 150,
  rest: iluRest,
  moves: {
    bob(m) {
      const A = m.amp, d = dipOf(m);
      const up = 1 - d;
      return { ...iluRest, lift: -up * 16 * A - 4, sy: 1 - d * 0.13 * A + up * 0.04 * A, sx: 1 + d * 0.11 * A - up * 0.03 * A,
        tent: iluRest.tent.map((_, i) => (i - 3) * (0.08 + d * 0.16 * A)), curl: iluRest.curl.map((_, i) => Math.sin(m.B * PI + i) * 0.5 * A + up * 0.4),
        look: [Math.sin(m.B * PI * 0.25) * 3, -up * 1.5], ant: sideOf(m) * 0.4 * A };
    },
    twirl(m) {
      const A = Math.max(0.5, m.amp), d = dipOf(m);
      const spin = m.B * PI * 0.5;
      return { ...iluRest, spin, flare: 0.7 * A + d * 0.2, lift: -8 - Math.sin(m.B * PI) * 4 * A, rot: Math.sin(m.B * PI * 0.5) * 0.14 * A,
        sy: 1 - d * 0.06, sx: 1 + d * 0.05, curl: iluRest.curl.map((_, i) => Math.sin(m.B * PI * 2 + i) * 0.5), look: [Math.cos(spin) * 4, Math.sin(spin * 2) * 1.5], ant: Math.sin(spin) * 0.8 };
    },
    wave(m) {
      const A = m.amp, d = dipOf(m);
      return { ...iluRest, lift: -(1 - d) * 7 * A - 3, rot: Math.sin(m.B * PI) * 0.08 * A,
        tent: iluRest.tent.map((_, i) => Math.sin(m.B * PI - i * 0.7) * 0.75 * A), curl: iluRest.curl.map((_, i) => Math.sin(m.B * PI - i * 0.7 + 1) * 0.8 * A),
        look: [Math.sin(m.B * PI * 0.5) * 4, 0], ant: Math.sin(m.B * PI - 1) * 0.6 * A };
    },
    glow(m) {
      const A = Math.max(0.6, m.amp), d = dipOf(m);
      const t = iluRest.tent.map((_, i) => (i - 3) * 0.1 + Math.sin(m.B * PI + i) * 0.25);
      t[0] = -2.3 - 0.25 * Math.sin(m.B * PI); t[6] = 2.3 + 0.25 * Math.sin(m.B * PI);
      t[1] = -1.3 + 0.3 * Math.cos(m.B * PI); t[5] = 1.3 - 0.3 * Math.cos(m.B * PI);
      return { ...iluRest, tent: t, curl: iluRest.curl.map((_, i) => (i === 0 || i === 6 ? 0 : Math.sin(m.B * PI + i) * 0.4)), sticks: 1, stickA: m.B * PI,
        lift: -(1 - d) * 10 * A - 6, sy: 1 - d * 0.08, sx: 1 + d * 0.07, look: [0, -1], mouth: 0.5, ant: sideOf(m) * 0.6 };
    },
    mirror(m) {
      const A = Math.max(0.8, m.amp), d = 0.5 + 0.5 * Math.cos(m.ph * TAU * 2); // bouncing on the eighths
      return { ...iluRest, mirror: 1, lift: -(1 - d) * 8 * A - 10, sy: 1 - d * 0.07, sx: 1 + d * 0.06, rot: Math.sin(m.B * PI * 0.5) * 0.1,
        tent: iluRest.tent.map((_, i) => Math.sin(m.B * PI * 2 - i * 0.8) * 0.6), curl: iluRest.curl.map((_, i) => Math.cos(m.B * PI * 2 - i * 0.8) * 0.7),
        mouth: 1, ant: Math.sin(m.B * PI * 2) * 0.9 };
    },
  },
  draw(ctx, p, m) {
    // the hover glow on the floor stays put; the rest bounces
    const hv = clamp(1 + p.lift / 40, 0.4, 1.2);
    glow(ctx, 0, -2, 30 * hv, "rgba(143,230,255,0.6)", 0.5 + m.bass * 0.4);
    ctx.save();
    ctx.translate(0, p.lift - 4);
    ctx.rotate(p.rot);
    ctx.translate(0, -78);
    ctx.scale(p.sx, p.sy);
    ctx.translate(-60, -70);
    // tentacles, from under the orb
    const tips = [];
    for (let i = 0; i < 7; i++) {
      const a = PI * (i / 6) + p.spin;
      const bx = 60 - Math.cos(a) * 24, depth = Math.sin(a);
      const out = p.flare * Math.sign(bx - 60) * (0.4 + 0.6 * Math.abs(Math.cos(a)));
      const ang = (p.tent[i] || 0) + out;
      const L = 46 * (0.88 + 0.12 * depth);
      const tip = [bx + Math.sin(ang) * L, 92 + Math.cos(ang) * L];
      const cu = (p.curl[i] || 0) * 14;
      const c1 = [bx + Math.sin(ang) * L * 0.35 + cu, 92 + Math.cos(ang) * L * 0.35];
      const c2 = [bx + Math.sin(ang) * L * 0.7 - cu, 92 + Math.cos(ang) * L * 0.7];
      ctx.globalAlpha = 0.75 + 0.25 * Math.max(0, depth);
      tube(ctx, [bx, 92], c1, c2, tip, 6.4 - Math.abs(i - 3) * 0.5, 1.6, depth < 0 ? "#7E3A62" : "#B85A8E");
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#8FE6FF"; ctx.beginPath(); ctx.arc(tip[0], tip[1], 1.7, 0, TAU); ctx.fill();
      glow(ctx, tip[0], tip[1], 6, "rgba(143,230,255,0.9)", 0.4 + m.high * 0.6);
      tips.push(tip);
    }
    // glowsticks in the outer tentacles
    if (p.sticks > 0.05) {
      [[0, m.pal.a], [6, m.pal.b]].forEach(([i, hue], n) => {
        const [x, y] = tips[i], a = p.stickA * (n ? -1 : 1) + n;
        const col = `hsla(${hue},100%,65%,${p.sticks})`;
        // trails
        for (let k = 1; k <= 5; k++) {
          const b = a - k * 0.22 * (n ? -1 : 1);
          ctx.strokeStyle = `hsla(${hue},100%,60%,${(0.35 - k * 0.06) * p.sticks})`; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(x - Math.cos(b) * 9, y - Math.sin(b) * 9); ctx.lineTo(x + Math.cos(b) * 9, y + Math.sin(b) * 9); ctx.stroke();
        }
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * 9, y - Math.sin(a) * 9); ctx.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); ctx.stroke();
        ctx.strokeStyle = col; ctx.lineWidth = 3.6; ctx.globalCompositeOperation = "lighter"; ctx.stroke(); ctx.globalCompositeOperation = "source-over";
        glow(ctx, x, y, 22, `hsla(${hue},100%,60%,0.9)`, p.sticks);
      });
    }
    // the orb
    ctx.fillStyle = radial(ctx, 60, 70, 34, [[0, "#FFD8E8"], [0.35, "#E89AC0"], [0.75, "#8A3E6E"], [1, "#3A1430"]], 48, 56);
    ctx.beginPath(); ctx.arc(60, 70, 32, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#F5C2DA"; ctx.lineWidth = 1; ctx.stroke();
    [[36, 60, 2.2], [40, 82, 1.6], [82, 58, 2], [84, 80, 2.4], [48, 94, 1.4], [74, 94, 1.6], [60, 42, 1.4]].forEach(([x, y, r]) => { ctx.fillStyle = "rgba(90,30,72,0.6)"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); });
    [[34, 70], [86, 70], [60, 100]].forEach(([x, y], i) => glow(ctx, x, y, 5, "rgba(143,230,255,0.9)", 0.4 + 0.6 * Math.max(0, Math.sin(m.B * PI - i))));
    // the great eye
    const blink = !p.mirror && (m.t % 3.9) > 3.78;
    ctx.fillStyle = "#FFF4F8"; ctx.beginPath(); ctx.ellipse(60, 66, 15, blink ? 1.5 : 15, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#5A1E48"; ctx.lineWidth = 1.6; ctx.stroke();
    if (!blink) {
      ctx.save(); ctx.beginPath(); ctx.arc(60, 66, 14.2, 0, TAU); ctx.clip();
      const ex = 61 + p.look[0], ey = 66 + p.look[1];
      if (p.mirror > 0.5) {
        // the mirrorball
        ctx.fillStyle = radial(ctx, ex, ey, 14, [[0, "#F4F6FF"], [0.6, "#9AA3C8"], [1, "#3A4060"]], ex - 4, ey - 4);
        ctx.fillRect(40, 46, 40, 40);
        const rot = m.B * 0.5;
        for (let gx = -7; gx <= 7; gx++) for (let gy = -7; gy <= 7; gy++) {
          const x = ex + gx * 2.1 + ((rot * 8) % 2.1), y = ey + gy * 2.1;
          const v = Math.sin(gx * 12.9 + gy * 78.2 + Math.floor(m.B * 2) * 3.1);
          ctx.fillStyle = v > 0.7 ? "#FFFFFF" : v > 0.2 ? "rgba(220,230,255,0.6)" : "rgba(60,70,110,0.4)";
          ctx.fillRect(x - 0.9, y - 0.9, 1.8, 1.8);
        }
      } else {
        ctx.fillStyle = radial(ctx, ex, ey, 10, [[0, "#0A0B1C"], [0.28, "#0A0B1C"], [0.32, "#8FE6FF"], [0.7, "#4A6AE8"], [1, "#2A1A6A"]]);
        ctx.beginPath(); ctx.arc(ex, ey, 10, 0, TAU); ctx.fill();
        ctx.strokeStyle = "rgba(185,240,255,0.6)"; ctx.lineWidth = 0.5;
        for (let k = 0; k < 12; k++) { const a = (k / 12) * TAU; ctx.beginPath(); ctx.moveTo(ex + Math.cos(a) * 4, ey + Math.sin(a) * 4); ctx.lineTo(ex + Math.cos(a) * 9, ey + Math.sin(a) * 9); ctx.stroke(); }
        ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.arc(ex, ey, 3.4 + m.bass * 1.2, 0, TAU); ctx.fill();
      }
      ctx.restore();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(57, 62, 2.4, 0, TAU); ctx.fill();
    }
    // two small eyes, a mouth
    ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.arc(42, 54, 2.6, 0, TAU); ctx.arc(79, 52, 2.2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#E9D29A"; ctx.beginPath(); ctx.arc(42.6, 53.4, 0.9, 0, TAU); ctx.arc(79.5, 51.4, 0.8, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2A0A20";
    ctx.beginPath(); ctx.moveTo(51, 87); ctx.quadraticCurveTo(60, 93 + p.mouth * 6, 69, 87); ctx.quadraticCurveTo(60, 90, 51, 87); ctx.fill();
    // antennae, swinging
    [[54, 39, 40, 18, "#8FE6FF", -1], [66, 39, 84, 22, "#E9D29A", 1]].forEach(([x0, y0, x1, y1, c, s]) => {
      const a = p.ant * s * 0.5;
      const dx = x1 - x0, dy = y1 - y0;
      const tx = x0 + dx * Math.cos(a) - dy * Math.sin(a), ty = y0 + dx * Math.sin(a) + dy * Math.cos(a);
      ctx.strokeStyle = "#E89AC0"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + (tx - x0) * 0.2, y0 + (ty - y0) * 0.7, tx, ty); ctx.stroke();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(tx, ty, 3, 0, TAU); ctx.fill();
      glow(ctx, tx, ty, 9, c, 0.5 + dipOf(m) * 0.5);
    });
    ctx.fillStyle = "rgba(255,255,255,0.32)"; ctx.beginPath(); ctx.ellipse(46, 50, 10, 6, -0.52, 0, TAU); ctx.fill();
    // mirrorball light: rays out of the eye
    if (p.mirror > 0.5) {
      ctx.globalCompositeOperation = "lighter";
      for (let k = 0; k < 14; k++) {
        const a = k * 0.45 + m.B * 0.35;
        const len = 160 + 60 * Math.sin(k * 3.3);
        ctx.strokeStyle = `hsla(${k % 2 ? m.pal.a : m.pal.b},100%,80%,${0.08 + 0.1 * Math.max(0, Math.sin(m.B * PI * 2 + k))})`;
        ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(60, 66); ctx.lineTo(60 + Math.cos(a) * len, 66 + Math.sin(a) * len); ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
      glow(ctx, 60, 66, 30, "rgba(255,255,255,0.9)", 0.5 + dipOf(m) * 0.5);
    }
    ctx.restore();
  },
};

// ═══════════════════════════ IXXEN ═══════════════════════════
// the Lab's master: long swept-back head with lit frills, one vertical eye
// and two small ones, a mantle full of instruments, six arms (two with
// fingers, four tentacles). Drawn in the Lab's own units (LabScene.js).
// On the drop the loupe flips down over its eye: shades.
const SKIN = ["#A9B2E0", "#6E77AE", "#2F3466"];
const X_SH = [[27.6, 46], [19.4, 46.5], [27.9, 52.5], [18.9, 53.5], [27.2, 59], [19.4, 60]];
const X_W = [1.25, 1.15, 1.45, 1.4, 1.35, 1.3];
const X_LEN = [11, 11, 12.5, 12.5, 12, 12];
// rest angles: front arms (even) reach forward, back arms (odd) back
const X_REST = [0.9, 2.3, 1.2, 2.0, 1.4, 1.8];
const xArms = (angs, lens = X_LEN) => angs.map((a, i) => armAt(X_SH[i], a, lens[i]));
const ixxenRest = { lift: 0, lean: 0.04, sy: 1, hem: 0, neck: 0, tilt: 0, look: [40, 30], shades: 0, arms: xArms(X_REST), seams: 0 };
const ixxen = {
  name: "Ixxen",
  height: 74,
  rest: ixxenRest,
  moves: {
    nod(m) {
      const A = m.amp, d = dipOf(m);
      return { ...ixxenRest, neck: d * A, tilt: 0.1 + d * 0.25 * A, lean: 0.04 + d * 0.06 * A, lift: d * 0.6 * A, sy: 1 - d * 0.02 * A,
        arms: xArms(X_REST.map((a, i) => a + Math.sin(m.B * PI + i) * 0.25 * A)), hem: Math.sin(m.B * PI * 0.5) * 1.2 * A, look: [40, 34 + d * 4] };
    },
    octo(m) {
      const A = Math.max(0.5, m.amp), d = dipOf(m);
      const angs = X_REST.map((a, i) => {
        const w = Math.sin(m.B * PI - Math.floor(i / 2) * 0.7);
        return i % 2 ? lerp(2.2, 4.0, (0.5 + 0.5 * w) * A) : lerp(1.0, -0.8, (0.5 + 0.5 * w) * A);
      });
      return { ...ixxenRest, arms: xArms(angs, X_LEN.map((l) => l * 1.1)), neck: d * 0.5 * A, tilt: -0.1 + Math.sin(m.B * PI * 0.5) * 0.15, lift: d * 0.8 * A,
        hem: Math.sin(m.B * PI) * 1.5 * A, seams: 0.6 * A };
    },
    conduct(m) {
      // a 4/4 conducting pattern with the front fingered arm: down, in, out, up
      const PATH = [[33, 64], [29, 55], [38, 54], [33, 42]];
      const b = ((m.B % 4) + 4) % 4, i = Math.floor(b), k = smooth(0, 0.6, b - i);
      const a = PATH[(i + 3) % 4], c = PATH[i];
      const hand = [lerp(a[0], c[0], k), lerp(a[1], c[1], k)];
      const arms = xArms(X_REST.map((r, j) => r + Math.sin(m.t * 1.5 + j) * 0.3));
      arms[0] = hand;
      arms[1] = armAt(X_SH[1], 3.6 + Math.sin(m.B * PI * 0.5) * 0.3, 11);
      return { ...ixxenRest, arms, tilt: -0.25, look: [hand[0] + 4, hand[1] - 6], neck: 0.2, lean: -0.02, lift: dipOf(m) * 0.5 };
    },
    shuffle(m) {
      const A = Math.max(0.5, m.amp), d = dipOf(m), s = snapOf(m);
      const angs = X_REST.map((a, i) => a + (i % 2 ? -1 : 1) * s * 0.45 * A * (i < 2 ? 1.4 : 1));
      return { ...ixxenRest, arms: xArms(angs), lean: 0.04 + s * 0.08 * A, hem: -s * 2.5 * A, lift: d * 1 * A, sy: 1 - d * 0.03, neck: d * 0.4, tilt: s * 0.12 };
    },
    shades(m) {
      const A = Math.max(0.8, m.amp), d = dipOf(m);
      const angs = [-0.9 - d * 0.3, 4.1 + d * 0.3, -0.3 - d * 0.2, 3.5 + d * 0.2, 0.3, 2.85];
      return { ...ixxenRest, arms: xArms(angs, X_LEN.map((l) => l * 1.15)), shades: 1, neck: d * A, tilt: d * 0.3, lift: d * 1.4, sy: 1 - d * 0.04, lean: 0.05 + d * 0.05,
        seams: 1, hem: sideOf(m) * 2 };
    },
  },
  draw(ctx, p, m) {
    const t = m.t, hue = m.pal.a;
    ctx.save();
    ctx.translate(0, p.lift); ctx.rotate(p.lean); ctx.scale(1, p.sy);
    ctx.translate(-23, -80);
    const rim = `hsla(${hue},80%,72%,0.75)`;
    // back arms first (they're behind the mantle)
    [1, 3, 5].forEach((i) => ixArm(ctx, i, p.arms[i], t, hue));
    // mantle
    const h = p.hem;
    ctx.fillStyle = linear(ctx, 16, 0, 30, 0, [[0, "#121535"], [0.55, "#2a3170"], [1, "#1a1f52"]]);
    ctx.beginPath(); ctx.moveTo(21, 40);
    ctx.bezierCurveTo(15.4, 42, 15.6, 49, 16.6, 57); ctx.lineTo(16.4 + h, 80); ctx.lineTo(29.6 + h, 80);
    ctx.lineTo(29, 57); ctx.bezierCurveTo(30.6, 49, 30.2, 42, 26, 40); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#4a52a0"; ctx.lineWidth = 0.18; ctx.stroke();
    ctx.strokeStyle = rim; ctx.lineWidth = 0.35;
    ctx.beginPath(); ctx.moveTo(26.4, 41); ctx.bezierCurveTo(30.2, 43, 30.4, 50, 29, 57); ctx.lineTo(29.6 + h, 74); ctx.stroke();
    ctx.fillStyle = "#151a3c";
    ctx.beginPath(); ctx.moveTo(19.5, 42); ctx.quadraticCurveTo(18.5, 35.5, 21.5, 33.5); ctx.lineTo(22.2, 40); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(27.6, 42); ctx.quadraticCurveTo(29.6, 36.5, 27.6, 34.5); ctx.lineTo(26, 40); ctx.closePath(); ctx.fill();
    // seams glow with the beat
    const pulse = 0.35 + 0.4 * dipOf(m) * (0.5 + p.seams * 0.5);
    ctx.strokeStyle = `hsla(${hue},70%,62%,${pulse})`; ctx.lineWidth = 0.26;
    ctx.beginPath(); ctx.moveTo(23.6, 41); ctx.lineTo(23.2 + h, 80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(17.4, 58); ctx.quadraticCurveTo(23, 61, 28.6, 58); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(17.2 + h * 0.4, 68); ctx.quadraticCurveTo(23 + h * 0.4, 70.5, 29 + h * 0.4, 68); ctx.stroke();
    // vials on the harness, glowing on the hats
    ctx.strokeStyle = "#4A4F80"; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.moveTo(18, 47); ctx.lineTo(28.5, 55); ctx.stroke();
    [[20.2, 48.8, 200], [22.4, 50.5, 140], [24.6, 52.2, 30]].forEach(([x, y, hh], i) => {
      ctx.fillStyle = `hsla(${hh},80%,${55 + m.high * 25}%,0.9)`; ctx.fillRect(x - 0.45, y - 1.5, 0.9, 2.4);
      glow(ctx, x, y, 2.2, `hsla(${hh},90%,65%,0.9)`, m.high * 0.8 * (i === Math.floor(m.B) % 3 ? 1 : 0.4));
    });
    // neck, pushing forward on the beat
    const nk = p.neck;
    const neckTop = [28.2 + nk * 3.2, 33.5 + nk * 1.2];
    for (let s = 0; s < 5; s++) {
      const k = s / 4;
      const x = lerp(23.8, neckTop[0], k) + Math.sin(t * 1.1 + s) * 0.08, y = lerp(40.5, neckTop[1], k);
      ctx.fillStyle = radial(ctx, x, y, 1.6, [[0, SKIN[0]], [1, SKIN[2]]], x - 0.4, y - 0.4);
      ctx.beginPath(); ctx.ellipse(x, y, 1.45 - k * 0.3, 0.95, -0.5, 0, TAU); ctx.fill();
    }
    // the head
    ctx.save();
    ctx.translate(neckTop[0], neckTop[1]); ctx.rotate(p.tilt); ctx.scale(1.3, 1.3);
    ctx.fillStyle = linear(ctx, -8, -22, 8, 0, [[0, SKIN[2]], [0.45, SKIN[1]], [1, SKIN[0]]]);
    const headPath = P("M-1.5 1 C-4.6 -1.6 -6 -5.5 -6.6 -9 C-9.6 -11 -11.8 -15.5 -11 -19.6 C-10.2 -23.6 -4.6 -24.8 0.4 -21.8 C5.6 -18.8 7.6 -13.2 7.2 -8.6 C6.9 -4.4 4.8 -1 2.2 0.6 Z");
    ctx.fill(headPath); ctx.strokeStyle = "#252a58"; ctx.lineWidth = 0.18; ctx.stroke(headPath);
    ctx.strokeStyle = rim; ctx.lineWidth = 0.32; ctx.stroke(P("M0.6 -21.6 C5.6 -18.8 7.6 -13 7.2 -8.6 C6.9 -4.6 5 -1.2 2.4 0.4"));
    // frills: swing with the music
    for (let f = 0; f < 3; f++) {
      const sway = Math.sin(m.B * PI + f * 0.8) * (0.8 + m.amp * 1.2);
      const bx = -10.6 + f * 0.6, by = -18.5 + f * 3.2;
      ctx.fillStyle = `rgba(110,119,174,${0.8 - f * 0.15})`;
      ctx.beginPath(); ctx.moveTo(bx, by - 1.2);
      ctx.quadraticCurveTo(bx - 3.4, by - 1.6 + sway, bx - 4.8 + sway * 0.4, by + 0.4 + sway);
      ctx.quadraticCurveTo(bx - 2.4, by + 0.6, bx + 0.3, by + 1.3); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = `hsla(${hue},90%,75%,0.5)`; ctx.lineWidth = 0.14; ctx.stroke();
    }
    // the crown lights run with the beat
    for (let d = 0; d < 6; d++) {
      const a = 0.3 + 0.7 * Math.max(0, Math.cos((m.B * 1.5 - d * 0.25) * PI));
      const x = -0.6 - d * 1.8, y = -22.4 - Math.sin((d / 5) * PI) * 0.9 + d * 0.32;
      ctx.fillStyle = `hsla(${hue},90%,78%,${a})`; ctx.beginPath(); ctx.arc(x, y, 0.32, 0, TAU); ctx.fill();
      glow(ctx, x, y, 1.6, `hsla(${hue},90%,70%,0.8)`, a * 0.6);
    }
    // the vertical eye
    const ex = 3.4, ey = -11.4;
    const blink = (t % 5.3) > 5.15 ? 0.12 : 1;
    ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.ellipse(ex, ey, 1.55, 3.7 * blink, 0.08, 0, TAU); ctx.fill();
    if (blink > 0.5) {
      const la = Math.atan2(p.look[1] - (neckTop[1] - 11), p.look[0] - (neckTop[0] + 3)) - p.tilt;
      const ox = Math.cos(la) * 0.55, oy = Math.sin(la) * 1.4;
      ctx.fillStyle = radial(ctx, ex + ox, ey + oy, 1.3, [[0, "#FFF0C8"], [0.6, "#E9D29A"], [1, "#7a5a20"]]);
      ctx.beginPath(); ctx.ellipse(ex + ox, ey + oy, 1.05, 2.4, 0.08, 0, TAU); ctx.fill();
      ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.ellipse(ex + ox, ey + oy, 0.22 + m.bass * 0.25, 1.8, 0.08, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(ex + ox - 0.35, ey + oy - 1.1, 0.28, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = "#1d2150"; ctx.lineWidth = 0.25; ctx.beginPath(); ctx.ellipse(ex, ey, 1.75, 3.95, 0.08, 0, TAU); ctx.stroke();
    [[0.2, -16, 0.6], [5.4, -15.6, 0.5]].forEach(([x, y, r]) => {
      ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.arc(x, y, r * blink + 0.05, 0, TAU); ctx.fill();
      ctx.fillStyle = "#E9D29A"; ctx.beginPath(); ctx.arc(x + 0.15, y - 0.15, r * 0.35, 0, TAU); ctx.fill();
    });
    // mouth: a grin when the shades come down
    ctx.strokeStyle = "#1d2150"; ctx.lineWidth = 0.22;
    ctx.beginPath(); ctx.moveTo(2.6, -3.6); ctx.quadraticCurveTo(4.4, -3 + p.shades * 1.2, 5.8, -3.8); ctx.stroke();
    for (let q = 0; q < 3; q++) {
      const sway = Math.sin(m.B * PI + q * 1.3) * 0.7;
      ctx.strokeStyle = SKIN[1]; ctx.lineWidth = 0.32 - q * 0.05; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(2.8 + q * 1.1, -1.6); ctx.quadraticCurveTo(3 + q * 1.1 + sway, 0.6, 2.6 + q * 1.2 + sway * 1.4, 2.4 - q * 0.3); ctx.stroke();
    }
    // the loupe: hangs at the side, or comes down as shades
    const lo = p.shades;
    if (lo < 0.5) {
      ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.28;
      ctx.beginPath(); ctx.moveTo(-1.5, -14); ctx.quadraticCurveTo(-0.6, -18.5, 0.4, -19.6); ctx.stroke();
      ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.arc(0.4, -19.6, 2.3, 0, TAU); ctx.stroke();
      ctx.fillStyle = "rgba(200,230,255,0.12)"; ctx.fill();
    } else {
      // a slim visor of shades across the big eye and the small ones, catching the lights
      ctx.fillStyle = "#07060F";
      ctx.beginPath(); ctx.moveTo(-1.2, -16.8); ctx.lineTo(6.6, -16.2); ctx.lineTo(6.2, -9.4); ctx.quadraticCurveTo(3.4, -7.6, 0.6, -9.6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.3; ctx.stroke();
      ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.3; ctx.beginPath(); ctx.moveTo(-1.2, -16.6); ctx.lineTo(-6, -17.4); ctx.stroke();
      const sh = (m.B * 0.5) % 1;
      ctx.strokeStyle = `hsla(${m.pal.b},100%,80%,0.8)`; ctx.lineWidth = 0.4;
      ctx.beginPath(); ctx.moveTo(lerp(-0.6, 6, sh), -16); ctx.lineTo(lerp(-0.6, 6, sh) - 1.4, -10); ctx.stroke();
      glow(ctx, 4.4, -13, 3, `hsla(${m.pal.b},100%,70%,0.8)`, dipOf(m) * 0.7);
    }
    ctx.restore(); // head
    // front arms
    [0, 2, 4].forEach((i) => ixArm(ctx, i, p.arms[i], t, hue));
    ctx.restore();
  },
};
function ixArm(ctx, i, tip, t, hue) {
  const from = X_SH[i];
  const bend = [1, -0.8, 0.9, -0.9, 0.7, -0.6][i];
  const w = X_W[i] * 2;
  const r = limb(ctx, from, tip, bend * 0.8, w, w * 0.35, linear(ctx, from[0], from[1], tip[0], tip[1], [[0, SKIN[2]], [0.4, SKIN[1]], [1, SKIN[0]]]), "#1d2150");
  // bioluminescent bands
  [5, 9, 13].forEach((k, n) => {
    const a = 0.35 + 0.35 * Math.sin(t * 3 - n - i);
    ctx.strokeStyle = `hsla(${hue},90%,78%,${a})`; ctx.lineWidth = 0.2;
    ctx.beginPath(); ctx.moveTo(r.left[k][0], r.left[k][1]); ctx.lineTo(r.right[k][0], r.right[k][1]); ctx.stroke();
  });
  ctx.fillStyle = "#1a1f44"; ctx.beginPath(); ctx.arc(from[0], from[1], X_W[i] * 0.95, 0, TAU); ctx.fill();
  const a = Math.atan2(tip[1] - r.pts[13][1], tip[0] - r.pts[13][0]);
  if (i < 2) fingers(ctx, tip, a, 3, 1.9, 1.2, SKIN[0], 0.32);
  else {
    ctx.strokeStyle = SKIN[0]; ctx.lineWidth = 0.3; ctx.lineCap = "round";
    const c = a + 1.4 + Math.sin(t * 4 + i) * 0.4;
    ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.quadraticCurveTo(tip[0] + Math.cos(a) * 1.2, tip[1] + Math.sin(a) * 1.2, tip[0] + Math.cos(c) * 1.3, tip[1] + Math.sin(c) * 1.3); ctx.stroke();
  }
}

// ═══════════════════════════ VARROW ═══════════════════════════
// from the Wish Engine: a great head with four eyes, crown ridges and mouth
// tendrils, a robe, three-fingered hands, an orb. Here it has the whole
// body the cabinet never showed. Big head, big nods.
const V_SH = { L: [132, 262], R: [228, 262] };
const varrowRest = { lift: 0, lean: 0, sx: 0, sy: 1, hem: 0, headY: 0, head: 0, look: [0, 0], hL: [150, 330], hR: [210, 330], orb: [180, 330], orbGlow: 0, lids: [0.3, 0.3], ridges: 0, tendril: 0, feet: [0, 0] };
const varrow = {
  name: "Varrow",
  height: 520,
  rest: varrowRest,
  moves: {
    nod(m) {
      const A = m.amp, d = dipOf(m), s = sideOf(m);
      return { ...varrowRest, headY: d * 12 * A, head: s * 0.05 * A, lift: d * 4 * A, sy: 1 - d * 0.02 * A, hem: -s * 10 * A,
        hL: [150 - d * 4, 330 + d * 8 * A], hR: [210 + d * 4, 330 + d * 8 * A], orb: [180, 332 + d * 8 * A], orbGlow: d * 0.3, tendril: s * A, feet: [s > 0 ? d * A : 0, s < 0 ? d * A : 0] };
    },
    roof(m) {
      const A = Math.max(0.6, m.amp), d = dipOf(m);
      const up = 40 + d * 40 * A;
      return { ...varrowRest, hL: [56 - d * 6, up], hR: [304 + d * 6, up], orb: [180, -30 - d * 16], orbGlow: 0.9, headY: d * 10, head: sideOf(m) * 0.04, lift: d * 6 * A,
        sy: 1 - d * 0.03, hem: sideOf(m) * 8, lids: [0, 0], ridges: 0.7, tendril: sideOf(m) * 1.2, look: [0, -3] };
    },
    shimmy(m) {
      const A = Math.max(0.5, m.amp), d = dipOf(m);
      const sh = Math.sin(m.B * TAU * 2) * A; // on the eighths
      return { ...varrowRest, sx: sh * 7, head: -sh * 0.03, headY: d * 6, lean: Math.sin(m.B * PI * 0.5) * 0.04, hem: -sh * 12,
        hL: [128 + sh * 6, 380], hR: [232 + sh * 6, 380], orb: [180 + sh * 10, 300 - d * 12], orbGlow: 0.5, tendril: sh * 1.4,
        lids: [0, 1, 2, 3].map((i) => (Math.floor(m.B * 2) % 4 === i ? 0.95 : 0.15)).slice(0, 2), look: [Math.sin(m.B * PI * 0.5) * 5, 0], feet: [Math.max(0, sh) * 0.8, Math.max(0, -sh) * 0.8] };
    },
    orbit(m) {
      const A = Math.max(0.5, m.amp), d = dipOf(m);
      const a = m.B * PI * 0.5;
      const ox = 180 + Math.sin(a) * 96 * A, oy = 330 + Math.sin(a * 2) * 34 * A;
      return { ...varrowRest, orb: [ox, oy], orbGlow: 0.6, hL: [lerp(110, ox - 40, 0.6), oy + 12], hR: [lerp(250, ox + 40, 0.6), oy + 12],
        head: Math.sin(a) * 0.08, look: [Math.sin(a) * 7, 2], headY: d * 6, lift: d * 3, hem: -Math.sin(a) * 10, tendril: Math.sin(a) * 1.2 };
    },
    lift(m) {
      const A = Math.max(0.8, m.amp), d = dipOf(m);
      return { ...varrowRest, orb: [180 + Math.sin(m.B * PI * 0.5) * 20, -120 - d * 22], orbGlow: 1, hL: [40 - d * 10, 0 + d * 24], hR: [320 + d * 10, 0 + d * 24],
        headY: -6 + d * 12, head: sideOf(m) * 0.05, lids: [0, 0], ridges: 1, lift: d * 8 * A, sy: 1 - d * 0.04, hem: sideOf(m) * 12, tendril: sideOf(m) * 1.6, look: [0, -4], feet: [d, 1 - d] };
    },
  },
  draw(ctx, p, m) {
    ctx.save();
    ctx.translate(0, p.lift); ctx.rotate(p.lean); ctx.scale(1, p.sy);
    ctx.translate(-180, -520);
    // feet under the hem
    ctx.fillStyle = "#120B24";
    [[148, p.feet[0]], [212, p.feet[1]]].forEach(([x, f]) => { ctx.beginPath(); ctx.ellipse(x + (x - 180) * 0.3 * f, 518 - f * 12, 26, 11, 0, 0, TAU); ctx.fill(); });
    // the robe, swinging
    const h = p.hem, sx = p.sx;
    const robe = new Path2D(`M${128 + sx} 236 Q${96 + h * 0.3} 320 ${76 + h} 516 Q${180 + h} ${530 + Math.abs(h) * 0.5} ${284 + h} 516 Q${264 + h * 0.3} 320 ${232 + sx} 236 Z`);
    ctx.fillStyle = linear(ctx, 0, 236, 0, 520, [[0, "#4B2E6E"], [1, "#1A1030"]]);
    ctx.fill(robe);
    ctx.strokeStyle = "rgba(233,210,154,0.85)"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(84 + h, 500); ctx.quadraticCurveTo(180 + h, 516 + Math.abs(h) * 0.4, 276 + h, 500); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(180 + sx, 250); ctx.quadraticCurveTo(180 + h * 0.5, 400, 180 + h, 512); ctx.stroke();
    // glyph rows on the robe, flickering with the highs
    ctx.save(); ctx.globalAlpha = 0.3 + 0.6 * m.high; ctx.strokeStyle = "#7FF0E0"; ctx.lineWidth = 2;
    for (let r = 0; r < 3; r++) { const y = 420 + r * 26, xo = h * (0.5 + r * 0.15); ctx.beginPath(); for (let k = 0; k < 6; k++) { const x = 116 + k * 26 + xo + r * 6; ctx.moveTo(x, y); ctx.lineTo(x + 8, y - 8); ctx.lineTo(x + 16, y); } ctx.stroke(); }
    ctx.restore();
    // neck and collar
    ctx.fillStyle = linear(ctx, 0, 190, 0, 250, [[0, "#5E9AA6"], [1, "#2E5B70"]]);
    ctx.fill(P("M156 196 Q180 214 204 196 L212 244 L148 244 Z"));
    ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = 3; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(118 + sx, 238); ctx.quadraticCurveTo(180 + sx, 276, 242 + sx, 238); ctx.stroke(); ctx.globalAlpha = 1;
    // orb (behind the hands when they hold it)
    const [ox, oy] = p.orb;
    glow(ctx, ox, oy, 80 + p.orbGlow * 60 + m.bass * 30, "rgba(233,210,154,0.75)", 0.4 + p.orbGlow * 0.6);
    ctx.fillStyle = radial(ctx, ox, oy, 34, [[0, "#FFFFFF"], [0.25, "#E9D29A"], [0.6, "#8B5FBF"], [1, "#1A0F33"]], ox - 8, oy - 9);
    ctx.beginPath(); ctx.arc(ox, oy, 34, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(ox, oy); ctx.rotate(m.B * 0.8); ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineCap = "round";
    ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, 0, 20, PI, TAU); ctx.stroke();
    ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(0, 2, 12, 0.2, PI * 0.9); ctx.stroke(); ctx.restore();
    // arms and three-fingered hands
    [["L", p.hL, 1], ["R", p.hR, -1]].forEach(([k, hand, s]) => {
      const sh = [V_SH[k][0] + sx, V_SH[k][1]];
      limb(ctx, sh, hand, 0.45 * s, 22, 13, linear(ctx, sh[0], sh[1], hand[0], hand[1], [[0, "#2E5B70"], [1, "#5E9AA6"]]));
      const a = Math.atan2(hand[1] - sh[1], hand[0] - sh[0]);
      ctx.strokeStyle = "#3A7085"; ctx.lineWidth = 5.5; ctx.lineCap = "round";
      [-0.55, 0, 0.55].forEach((f) => {
        const b = a + f;
        const tx = hand[0] + Math.cos(b) * 22, ty = hand[1] + Math.sin(b) * 22;
        ctx.beginPath(); ctx.moveTo(hand[0], hand[1]); ctx.quadraticCurveTo(hand[0] + Math.cos(b - 0.2 * s) * 14, hand[1] + Math.sin(b - 0.2 * s) * 14, tx, ty); ctx.stroke();
        ctx.fillStyle = "#7FF0E0"; ctx.beginPath(); ctx.arc(tx, ty, 2.6, 0, TAU); ctx.fill();
        glow(ctx, tx, ty, 9, "rgba(127,240,224,0.9)", 0.4 + dipOf(m) * 0.4);
      });
    });
    // the head
    ctx.save();
    ctx.translate(180 + sx, 210 + p.headY); ctx.rotate(p.head); ctx.translate(-180, -210);
    const head = P("M180 34 C244 34 266 92 258 140 C250 188 216 214 180 216 C144 214 110 188 102 140 C94 92 116 34 180 34 Z");
    ctx.fillStyle = linear(ctx, 0, 34, 0, 216, [[0, "#5E9AA6"], [0.55, "#2E5B70"], [1, "#173046"]]); ctx.fill(head);
    ctx.fillStyle = radial(ctx, 160, 88, 110, [[0, "rgba(191,245,240,0.35)"], [1, "rgba(191,245,240,0)"]]); ctx.fill(head);
    // rim light from the stage
    ctx.save(); ctx.clip(head);
    ctx.strokeStyle = `hsla(${m.pal.b},90%,70%,${0.35 + m.level * 0.4})`; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(250, 80); ctx.bezierCurveTo(266, 120, 258, 170, 214, 208); ctx.stroke();
    ctx.restore();
    // crown ridges light up on the beat, in a run
    [["M150 58 Q180 30 210 58", 3], ["M138 80 Q180 46 222 80", 2.4], ["M128 104 Q180 66 232 104", 1.8]].forEach(([d, w], i) => {
      const on = Math.max(p.ridges, Math.max(0, Math.cos((m.B - i * 0.25) * PI * 2)) * m.amp);
      ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = w + on * 1.4; ctx.lineCap = "round"; ctx.stroke(P(d));
      if (on > 0.2) { ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.strokeStyle = `rgba(233,210,154,${on * 0.5})`; ctx.lineWidth = w + 8; ctx.stroke(P(d)); ctx.restore(); }
    });
    // small eyes
    ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.arc(164, 108, 4.5, 0, TAU); ctx.arc(196, 108, 4.5, 0, TAU); ctx.fill();
    ctx.fillStyle = "#E9D29A"; ctx.beginPath(); ctx.arc(165 + p.look[0] * 0.2, 107 + p.look[1] * 0.2, 1.3, 0, TAU); ctx.arc(197 + p.look[0] * 0.2, 107 + p.look[1] * 0.2, 1.3, 0, TAU); ctx.fill();
    // the great eyes, under heavy lids
    const blink = (m.t % 5.1) > 4.95;
    [[148, 136, 18, 0], [212, 136, -18, 1]].forEach(([x, y, a, n]) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate((a * PI) / 180);
      ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.ellipse(0, 0, 24, 12.5, 0, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 24, 12.5, 0, 0, TAU); ctx.clip();
      ctx.fillStyle = "rgba(122,79,208,0.9)"; ctx.beginPath(); ctx.arc(p.look[0], p.look[1], 9 + m.bass * 2, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(p.look[0] - 4, p.look[1] - 4, 2.6, 0, TAU); ctx.fill();
      // the lid comes down from the top: 0 open, 1 shut
      const lid = blink ? 1 : clamp(p.lids[n] ?? 0.3, 0, 1);
      ctx.fillStyle = "#3A7085"; ctx.fillRect(-28, -16, 56, 4 + lid * 28);
      ctx.strokeStyle = "#173046"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-28, -12 + lid * 28); ctx.lineTo(28, -12 + lid * 28); ctx.stroke();
      ctx.restore();
      ctx.restore();
    });
    // cheek lights
    [[126, 166], [134, 176], [234, 166], [226, 176]].forEach(([x, y], i) => {
      const on = 0.4 + 0.6 * Math.max(0, Math.sin(m.B * PI - i * 0.6));
      ctx.fillStyle = "#7FF0E0"; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, TAU); ctx.fill();
      glow(ctx, x, y, 9, "rgba(127,240,224,0.9)", on);
    });
    // mouth and tendrils, swinging
    ctx.fillStyle = "#0A0518"; ctx.beginPath(); ctx.ellipse(180, 172, 4 + p.ridges * 2, 10, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#2C566A"; ctx.lineWidth = 3.4; ctx.lineCap = "round";
    [-14, -7, 0, 7, 14].forEach((dx, i) => {
      const sw = p.tendril * 8 + Math.sin(m.t * 3 + i) * 1.5;
      ctx.beginPath(); ctx.moveTo(180 + dx, 182);
      ctx.quadraticCurveTo(180 + dx * 1.3 + sw * 0.4, 196, 180 + dx * 1.2 + sw, 208);
      ctx.quadraticCurveTo(180 + dx * 1.1 + sw * 1.4, 216, 180 + dx * 1.2 + sw * 1.6, 222); ctx.stroke();
    });
    ctx.restore(); // head
    ctx.restore();
  },
};

export const DANCERS = { qeth, ilu, ixxen, varrow };

// Which moves each dancer reaches for, by how hard the music is going
export const REPERTOIRE = {
  qeth: { chill: ["sway", "sway", "ripple"], groove: ["ripple", "toss", "sway", "vogue"], hype: ["vogue", "toss", "raise", "ripple"], drop: "raise", unison: "raise" },
  ilu: { chill: ["wave", "bob"], groove: ["bob", "twirl", "wave", "glow"], hype: ["glow", "twirl", "bob", "mirror"], drop: "mirror", unison: "glow" },
  ixxen: { chill: ["nod", "conduct"], groove: ["octo", "shuffle", "nod", "conduct"], hype: ["shuffle", "octo", "shades"], drop: "shades", unison: "octo" },
  varrow: { chill: ["nod", "orbit"], groove: ["shimmy", "nod", "orbit", "roof"], hype: ["roof", "shimmy", "lift"], drop: "lift", unison: "roof" },
};
