// The Rave's dancers: Qeth, Ilu and Ixxen from the Alien Lab and Varrow from
// the Wish Engine, as posable canvas figures. Each one has:
//   rest            its pose standing still
//   moves[name](m)  a pose for this moment of the music (m: see RaveMode)
//   draw(ctx,p,m)   draws it, feet/base at (0,0)
// Update 5.68 made them dance. Update 5.69 gave them depth: shaded, muscled
// arms with sleeves and real hands (lib/rave/shade.js), robes with panels,
// trim, folds and embroidery, a stage-coloured rim light on every figure;
// Ixxen turns to face the crowd and does the robot; Ilu takes off.
import { TAU, lerp, clamp, smooth, P, tube, glow, radial, linear, hash } from "./draw";
import { arm3d, hand3d, shade, trim } from "./shade";

const PI = Math.PI;
// shared rhythm shapes
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU); // 1 on the beat, 0 between
const sideOf = (m) => Math.cos(m.B * PI); // +1 / -1 on alternate beats
const snapOf = (m) => { const s = sideOf(m); return Math.sign(s) * Math.pow(Math.abs(s), 0.45); };
const armAt = (sh, a, len) => [sh[0] + Math.cos(a) * len, sh[1] + Math.sin(a) * len];
const rimOf = (m, a = 0.85) => `hsla(${m.pal.b},100%,72%,${a})`;
const GOLD = "#C9A85E";

// ═══════════════════════════ QETH ═══════════════════════════
// the Overseer: tall, robed, four thin arms, three eyes, a crown of lit
// filaments, an orb it keeps close. Moves with dignity, until the drop.
const Q_SH = { uL: [38, 86], uR: [82, 86], lL: [44, 93], lR: [76, 93] };
const Q_SKIN = { lite: "#A8F5DA", mid: "#47A88C", dark: "#1D5E4E", line: "#0B3128" };
const Q_SLEEVE = { lite: "#3E4F96", mid: "#26336A", dark: "#10163A" };
const qethRest = { lift: 0, lean: 0, sy: 1, hem: 0, flare: 0, head: 0, headY: 0, look: [0, 0], uL: [20, 110], uR: [100, 110], lL: [52, 108], lR: [68, 108], orb: [60, 106], orbGlow: 0, happy: 0, crown: 0, feet: [0, 0] };
function qArms(angs, lens = [30, 30, 20, 20]) {
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
      return { ...qethRest, ...qArms([L(0), R(3), L(1), R(2)], [30, 30, 21, 21]), lift: d * 2 * A, sy: 1 - d * 0.025 * A,
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
      return { ...qethRest, ...qArms([3.85 + pump, -0.7 - pump, 3.4 + pump * 0.6, 0.0 - pump * 0.6 - 0.25], [32, 32, 22, 22]),
        lift: d * 3 * A, sy: 1 - d * 0.035, hem: sideOf(m) * 6, head: sideOf(m) * 0.08, happy: 1, crown: 1,
        orb: [60 + Math.sin(m.B * PI * 0.5) * 6, -18 - d * 6], orbGlow: 1, feet: [d, 1 - d] };
    },
  },
  draw(ctx, p, m) {
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
    const [ox, oy] = p.orb;
    glow(ctx, ox, oy, 14 + p.orbGlow * 26 + m.bass * 8, "rgba(143,230,255,0.9)", 0.35 + p.orbGlow * 0.65);
    ctx.fillStyle = radial(ctx, ox, oy, 6.5, [[0, "#FFFFFF"], [0.35, "#8FE6FF"], [0.8, "#2A5C96"], [1, "#122A50"]], ox - 2, oy - 2);
    ctx.beginPath(); ctx.arc(ox, oy, 6, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(ox, oy); ctx.rotate(m.t * 1.5); ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(0, 0, 3.8, 0, 2.2); ctx.stroke(); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.ellipse(ox - 2, oy - 2.4, 1.6, 0.9, -0.6, 0, TAU); ctx.fill();
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
    const head = P("M60 6 C76 6 84 22 82 40 C80 58 70 72 60 72 C50 72 40 58 38 40 C36 22 44 6 60 6 Z");
    ctx.fillStyle = radial(ctx, 54, 26, 48, [[0, "#B0FFE4"], [0.4, "#4AAE90"], [0.85, "#17473C"], [1, "#0E2E27"]], 50, 20);
    ctx.fill(head);
    // cheekbones and temples, for shape
    ctx.save(); ctx.clip(head);
    ctx.fillStyle = "rgba(8,40,32,0.35)";
    ctx.beginPath(); ctx.ellipse(44, 50, 5, 9, 0.3, 0, TAU); ctx.ellipse(76, 50, 5, 9, -0.3, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(200,255,235,0.18)";
    ctx.beginPath(); ctx.ellipse(48, 46, 3, 6, 0.4, 0, TAU); ctx.ellipse(72, 46, 2.4, 5, -0.4, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "rgba(14,58,48,0.6)"; ctx.lineWidth = 0.8; ctx.stroke(P("M46 30 Q50 44 47 56 M74 30 Q70 44 73 56 M60 12 L60 21"));
    [[44, 48], [45, 53], [47, 58], [76, 48], [75, 53], [73, 58]].forEach(([x, y], i) => {
      ctx.fillStyle = `rgba(143,230,255,${0.4 + 0.6 * Math.max(0, Math.sin(m.B * PI - i * 0.5))})`;
      ctx.beginPath(); ctx.arc(x, y, 1.1, 0, TAU); ctx.fill();
    });
    shade(ctx, head, [37, 6, 46, 66], { rim, shadow: 0.5, spec: 0.28, sx: 0.36, sy: 0.18, sr: 0.32, line: "#0B3128", lineW: 0.8 });
    // crown of filaments: they flare on every beat
    const flare = dipOf(m) * (0.4 + 0.6 * m.amp);
    [[-18, 18], [-10, 9], [0, 4], [10, 9], [18, 18]].forEach(([dx, top], i) => {
      const sway = Math.sin(m.t * 2 + i) * 1.5 + (p.crown ? Math.sin(m.B * PI + i) * 3 * p.crown : 0);
      const tx = 60 + dx + sway, ty = top - 8 - flare * 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#7A6232"; ctx.lineWidth = 2.1;
      ctx.beginPath(); ctx.moveTo(60 + dx * 0.5, 14); ctx.quadraticCurveTo(60 + dx * 0.9, top + 4, tx, ty); ctx.stroke();
      ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.strokeStyle = "rgba(255,250,230,0.8)"; ctx.lineWidth = 0.4; ctx.stroke();
      ctx.fillStyle = "#FFF4DC"; ctx.beginPath(); ctx.arc(tx, ty, 2, 0, TAU); ctx.fill();
      glow(ctx, tx, ty, 6 + flare * 8 + p.crown * 6, "rgba(255,244,220,0.95)", 0.5 + flare * 0.5);
    });
    // brows
    ctx.strokeStyle = "rgba(8,38,30,0.75)"; ctx.lineWidth = 1.3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(42.5, 33.5); ctx.quadraticCurveTo(50, 28.5 - p.happy, 56.5, 33); ctx.moveTo(63.5, 33); ctx.quadraticCurveTo(70, 28.5 - p.happy, 77.5, 33.5); ctx.stroke();
    // three eyes (closed into happy arcs when it's really going)
    const blink = (m.t % 4.7) > 4.55;
    const [lx, ly] = p.look;
    if (p.happy > 0.5 || blink) {
      ctx.strokeStyle = "#05040F"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(44, 39); ctx.quadraticCurveTo(50, blink ? 39 : 33, 56, 39); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(64, 39); ctx.quadraticCurveTo(70, blink ? 39 : 33, 76, 39); ctx.stroke();
    } else {
      ctx.fillStyle = "#05040F"; ctx.fill(P("M43 38 Q50 31 56 38 Q50 45 43 38 Z M64 38 Q70 31 77 38 Q70 45 64 38 Z"));
      [50, 70].forEach((x) => {
        ctx.fillStyle = radial(ctx, x + lx, 38 + ly, 3.2, [[0, "#FFF8E4"], [0.45, "#E9D29A"], [1, "#7A4A12"]]);
        ctx.beginPath(); ctx.arc(x + lx, 38 + ly, 3.2, 0, TAU); ctx.fill();
        ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.ellipse(x + lx, 38 + ly, 0.9, 2.4, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x + lx - 1.2, 36.6 + ly, 0.9, 0, TAU); ctx.fill();
      });
      ctx.strokeStyle = "rgba(160,240,215,0.5)"; ctx.lineWidth = 0.5; ctx.stroke(P("M43 38 Q50 45 56 38 M64 38 Q70 45 77 38"));
    }
    ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.ellipse(60, 25, 3, 4, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = radial(ctx, 60, 25.4, 2.6, [[0, "#FFF4DC"], [0.5, "#E9D29A"], [1, "#8A5A1C"]]);
    ctx.beginPath(); ctx.ellipse(60 + lx * 0.5, 25.4 + ly * 0.5, 1.8, 2.6, 0, 0, TAU); ctx.fill();
    glow(ctx, 60, 25, 8, "rgba(233,210,154,0.9)", 0.3 + flare * 0.5);
    ctx.strokeStyle = "#0B3128"; ctx.lineWidth = 0.9; ctx.stroke(P("M57.5 50 l0.8 2.4 M62.5 50 l-0.8 2.4"));
    ctx.fillStyle = "#081A16"; ctx.strokeStyle = "#081A16"; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(53, 60); ctx.quadraticCurveTo(60, 64 + p.happy * 4, 67, 60); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "rgba(170,250,220,0.4)"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(55, 66); ctx.quadraticCurveTo(60, 68, 65, 66); ctx.stroke();
    ctx.restore();
    ctx.restore();
  },
};

// ═══════════════════════════ ILU ═══════════════════════════
// the Technician: a floating orb, one great eye, two antennae, seven
// tentacles. All bounce. Now and then it takes off and floats up high;
// on the drop its eye turns into a mirrorball.
const I_TENT = { lite: "#FAD2E6", mid: "#C4669E", dark: "#6E2A58", line: "#3A1030" };
const I_TENT_BACK = { lite: "#C890B0", mid: "#8A3E6E", dark: "#4A1A3C", line: "#2A0A20" };
const iluRest = { lift: 0, float: 0, sx: 1, sy: 1, rot: 0, spin: 0, flare: 0, tent: [0, 0, 0, 0, 0, 0, 0], curl: [0, 0, 0, 0, 0, 0, 0], look: [0, 0], mirror: 0, ant: 0, sticks: 0, stickA: 0, mouth: 0 };
// some four-bar stretches, Ilu rises for most of it and drifts back down
function floatOf(m) {
  const block = Math.floor(m.B / 16);
  if (!m.on || hash(block, 77) > 0.42) return 0;
  const b = m.B - block * 16;
  return smooth(2, 6, b) * (1 - smooth(12, 15.5, b));
}
const ilu = {
  name: "Ilu",
  height: 150,
  rest: iluRest,
  moves: {
    bob(m) {
      const A = m.amp, d = dipOf(m);
      const up = 1 - d;
      return { ...iluRest, float: floatOf(m), lift: -up * 16 * A - 4, sy: 1 - d * 0.13 * A + up * 0.04 * A, sx: 1 + d * 0.11 * A - up * 0.03 * A,
        tent: iluRest.tent.map((_, i) => (i - 3) * (0.08 + d * 0.16 * A)), curl: iluRest.curl.map((_, i) => Math.sin(m.B * PI + i) * 0.5 * A + up * 0.4),
        look: [Math.sin(m.B * PI * 0.25) * 3, -up * 1.5], ant: sideOf(m) * 0.4 * A };
    },
    twirl(m) {
      const A = Math.max(0.5, m.amp), d = dipOf(m);
      const spin = m.B * PI * 0.5;
      return { ...iluRest, float: floatOf(m), spin, flare: 0.7 * A + d * 0.2, lift: -8 - Math.sin(m.B * PI) * 4 * A, rot: Math.sin(m.B * PI * 0.5) * 0.14 * A,
        sy: 1 - d * 0.06, sx: 1 + d * 0.05, curl: iluRest.curl.map((_, i) => Math.sin(m.B * PI * 2 + i) * 0.5), look: [Math.cos(spin) * 4, Math.sin(spin * 2) * 1.5], ant: Math.sin(spin) * 0.8 };
    },
    wave(m) {
      const A = m.amp, d = dipOf(m);
      return { ...iluRest, float: floatOf(m), lift: -(1 - d) * 7 * A - 3, rot: Math.sin(m.B * PI) * 0.08 * A,
        tent: iluRest.tent.map((_, i) => Math.sin(m.B * PI - i * 0.7) * 0.75 * A), curl: iluRest.curl.map((_, i) => Math.sin(m.B * PI - i * 0.7 + 1) * 0.8 * A),
        look: [Math.sin(m.B * PI * 0.5) * 4, 0], ant: Math.sin(m.B * PI - 1) * 0.6 * A };
    },
    // up, up and away: a long slow float like a jellyfish, tentacles trailing
    soar(m) {
      const A = Math.max(0.5, m.amp);
      const k = (m.B % 16 + 16) % 16;
      const height = smooth(0, 4, k) * (1 - smooth(13, 16, k)) * 0.85 + 0.15;
      const pulse = Math.pow(Math.max(0, Math.cos(m.ph * TAU)), 3); // each beat a little push upward
      return { ...iluRest, float: height, lift: -6 - pulse * 6 * A, sy: 1 - pulse * 0.08, sx: 1 + pulse * 0.08, rot: Math.sin(m.B * PI * 0.25) * 0.18,
        tent: iluRest.tent.map((_, i) => (i - 3) * (0.05 + pulse * 0.22)), curl: iluRest.curl.map((_, i) => Math.sin(m.B * PI * 0.5 - i * 0.6) * 0.9),
        look: [Math.sin(m.B * PI * 0.25) * 4, 2.5], ant: Math.sin(m.B * PI * 0.5) * 0.7, mouth: 0.6 };
    },
    glow(m) {
      const A = Math.max(0.6, m.amp), d = dipOf(m);
      const t = iluRest.tent.map((_, i) => (i - 3) * 0.1 + Math.sin(m.B * PI + i) * 0.25);
      t[0] = -2.3 - 0.25 * Math.sin(m.B * PI); t[6] = 2.3 + 0.25 * Math.sin(m.B * PI);
      t[1] = -1.3 + 0.3 * Math.cos(m.B * PI); t[5] = 1.3 - 0.3 * Math.cos(m.B * PI);
      return { ...iluRest, float: floatOf(m) * 0.8, tent: t, curl: iluRest.curl.map((_, i) => (i === 0 || i === 6 ? 0 : Math.sin(m.B * PI + i) * 0.4)), sticks: 1, stickA: m.B * PI,
        lift: -(1 - d) * 10 * A - 6, sy: 1 - d * 0.08, sx: 1 + d * 0.07, look: [0, -1], mouth: 0.5, ant: sideOf(m) * 0.6 };
    },
    mirror(m) {
      const A = Math.max(0.8, m.amp), d = 0.5 + 0.5 * Math.cos(m.ph * TAU * 2); // bouncing on the eighths
      return { ...iluRest, float: 0.55 + 0.25 * Math.sin(m.B * PI * 0.25), mirror: 1, lift: -(1 - d) * 8 * A - 10, sy: 1 - d * 0.07, sx: 1 + d * 0.06, rot: Math.sin(m.B * PI * 0.5) * 0.1,
        tent: iluRest.tent.map((_, i) => Math.sin(m.B * PI * 2 - i * 0.8) * 0.6), curl: iluRest.curl.map((_, i) => Math.cos(m.B * PI * 2 - i * 0.8) * 0.7),
        mouth: 1, ant: Math.sin(m.B * PI * 2) * 0.9 };
    },
  },
  draw(ctx, p, m) {
    const rim = rimOf(m);
    const lift = p.lift - p.float * 46;
    // the hover glow and shadow on the floor stay put, fading as it rises
    const hv = clamp(1 + lift / 70, 0.25, 1.2);
    ctx.save(); ctx.scale(1, 0.3); ctx.fillStyle = `rgba(0,0,0,${0.45 * hv})`; ctx.beginPath(); ctx.arc(0, 0, 26 * hv, 0, TAU); ctx.fill(); ctx.restore();
    glow(ctx, 0, -2, 30 * hv, "rgba(143,230,255,0.6)", (0.5 + m.bass * 0.4) * hv);
    // sparkles trailing under it when it's high up
    if (p.float > 0.3) {
      for (let k = 0; k < 8; k++) {
        const s = ((m.t * 1.4 + k / 8) % 1), x = Math.sin(k * 2.3 + m.t) * 10 * s, y = lift - 30 + s * 40;
        glow(ctx, x, y, 3 + s * 2, `hsla(${k % 2 ? m.pal.a : m.pal.b},100%,75%,0.9)`, (1 - s) * p.float * 0.8);
      }
    }
    ctx.save();
    ctx.translate(0, lift - 4);
    ctx.rotate(p.rot);
    ctx.translate(0, -78);
    ctx.scale(p.sx, p.sy);
    ctx.translate(-60, -70);
    // tentacles, from under the orb (the far ones first, darker)
    const ts = [];
    for (let i = 0; i < 7; i++) {
      const a = PI * (i / 6) + p.spin;
      const bx = 60 - Math.cos(a) * 24, depth = Math.sin(a);
      const out = p.flare * Math.sign(bx - 60) * (0.4 + 0.6 * Math.abs(Math.cos(a)));
      const trail = p.float * 0.25 * Math.sin(m.t * 2 + i);
      const ang = (p.tent[i] || 0) + out + trail;
      const L = 46 * (0.88 + 0.12 * depth) * (1 + p.float * 0.12);
      ts.push({ i, bx, depth, ang, L });
    }
    ts.sort((a, b) => a.depth - b.depth);
    const tips = [];
    ts.forEach(({ i, bx, depth, ang, L }) => {
      const tip = [bx + Math.sin(ang) * L, 92 + Math.cos(ang) * L];
      arm3d(ctx, [bx, 90], tip, { bend: (p.curl[i] || 0) * 0.9, w0: 7 - Math.abs(i - 3) * 0.5, w1: 1.7, col: depth < 0 ? I_TENT_BACK : I_TENT, rim: depth < 0 ? null : rim, bulge: 0.1, joint: false, suckers: depth < 0 ? null : "#FFE6F2", bands: [0.3, 0.55], bandCol: "rgba(143,230,255,0.55)" });
      ctx.fillStyle = "#BFF6FF"; ctx.beginPath(); ctx.arc(tip[0], tip[1], 1.8, 0, TAU); ctx.fill();
      glow(ctx, tip[0], tip[1], 7, "rgba(143,230,255,0.9)", 0.4 + m.high * 0.6);
      tips[i] = tip;
    });
    // glowsticks in the outer tentacles
    if (p.sticks > 0.05) {
      [[0, m.pal.a], [6, m.pal.b]].forEach(([i, hue], n) => {
        const [x, y] = tips[i], a = p.stickA * (n ? -1 : 1) + n;
        for (let k = 1; k <= 5; k++) {
          const b = a - k * 0.22 * (n ? -1 : 1);
          ctx.strokeStyle = `hsla(${hue},100%,60%,${(0.35 - k * 0.06) * p.sticks})`; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(x - Math.cos(b) * 9, y - Math.sin(b) * 9); ctx.lineTo(x + Math.cos(b) * 9, y + Math.sin(b) * 9); ctx.stroke();
        }
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * 9, y - Math.sin(a) * 9); ctx.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); ctx.stroke();
        ctx.strokeStyle = `hsla(${hue},100%,65%,${p.sticks})`; ctx.lineWidth = 3.6; ctx.globalCompositeOperation = "lighter"; ctx.stroke(); ctx.globalCompositeOperation = "source-over";
        glow(ctx, x, y, 22, `hsla(${hue},100%,60%,0.9)`, p.sticks);
      });
    }
    // the orb
    const orb = new Path2D(); orb.arc(60, 70, 32, 0, TAU);
    ctx.fillStyle = radial(ctx, 60, 70, 34, [[0, "#FFE0EE"], [0.3, "#EE9CC4"], [0.7, "#93427A"], [1, "#3A1430"]], 47, 54);
    ctx.fill(orb);
    ctx.save(); ctx.clip(orb);
    ctx.fillStyle = radial(ctx, 64, 96, 26, [[0, "rgba(255,140,200,0.45)"], [1, "rgba(255,140,200,0)"]]); ctx.fillRect(28, 60, 64, 44);
    [[36, 60, 2.6], [40, 82, 2], [82, 58, 2.4], [84, 80, 2.8], [48, 94, 1.8], [74, 94, 2], [60, 42, 1.7], [30, 72, 1.4], [90, 70, 1.6]].forEach(([x, y, r]) => {
      ctx.fillStyle = "rgba(80,22,62,0.7)"; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.85, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,210,235,0.35)"; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.35, r * 0.35, 0, TAU); ctx.fill();
    });
    ctx.restore();
    shade(ctx, orb, [28, 38, 64, 64], { rim, shadow: 0.55, spec: 0.4, sx: 0.3, sy: 0.22, sr: 0.3, line: "#4A1640", lineW: 0.9 });
    [[34, 70], [86, 70], [60, 100]].forEach(([x, y], i) => glow(ctx, x, y, 5, "rgba(143,230,255,0.9)", 0.4 + 0.6 * Math.max(0, Math.sin(m.B * PI - i))));
    // the great eye in its socket
    const blink = !p.mirror && (m.t % 3.9) > 3.78;
    ctx.fillStyle = "rgba(60,14,48,0.55)"; ctx.beginPath(); ctx.ellipse(60, 67.5, 17.5, 17, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = radial(ctx, 58, 63, 16, [[0, "#FFFFFF"], [0.7, "#F6E6EE"], [1, "#C8A8BC"]]);
    ctx.beginPath(); ctx.ellipse(60, 66, 15, blink ? 1.5 : 15, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#5A1E48"; ctx.lineWidth = 1.6; ctx.stroke();
    if (!blink) {
      ctx.save(); ctx.beginPath(); ctx.arc(60, 66, 14.2, 0, TAU); ctx.clip();
      const ex = 61 + p.look[0], ey = 66 + p.look[1];
      if (p.mirror > 0.5) {
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
        ctx.fillStyle = radial(ctx, ex, ey, 10, [[0, "#0A0B1C"], [0.28, "#0A0B1C"], [0.32, "#9FF0FF"], [0.62, "#4A6AE8"], [1, "#22145A"]]);
        ctx.beginPath(); ctx.arc(ex, ey, 10, 0, TAU); ctx.fill();
        ctx.strokeStyle = "rgba(185,240,255,0.6)"; ctx.lineWidth = 0.5;
        for (let k = 0; k < 16; k++) { const a = (k / 16) * TAU; ctx.beginPath(); ctx.moveTo(ex + Math.cos(a) * 4, ey + Math.sin(a) * 4); ctx.lineTo(ex + Math.cos(a) * 9.4, ey + Math.sin(a) * 9.4); ctx.stroke(); }
        ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.arc(ex, ey, 3.4 + m.bass * 1.2, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = linear(ctx, 0, 51, 0, 60, [[0, "rgba(60,14,48,0.5)"], [1, "rgba(60,14,48,0)"]]); ctx.fillRect(44, 50, 32, 12);
      ctx.restore();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.ellipse(56, 61.5, 3, 2.2, -0.5, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.arc(65, 71, 1.1, 0, TAU); ctx.fill();
    }
    // two small eyes, a mouth
    [[42, 54, 2.8], [79, 52, 2.4]].forEach(([x, y, r]) => {
      ctx.fillStyle = "rgba(60,14,48,0.5)"; ctx.beginPath(); ctx.arc(x, y + 0.6, r + 1, 0, TAU); ctx.fill();
      ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.fillStyle = "#E9D29A"; ctx.beginPath(); ctx.arc(x + 0.6, y - 0.6, r * 0.35, 0, TAU); ctx.fill();
    });
    ctx.fillStyle = "#2A0A20";
    ctx.beginPath(); ctx.moveTo(51, 87); ctx.quadraticCurveTo(60, 93 + p.mouth * 6, 69, 87); ctx.quadraticCurveTo(60, 90, 51, 87); ctx.fill();
    if (p.mouth > 0.4) { ctx.fillStyle = "#E86AA0"; ctx.beginPath(); ctx.ellipse(60, 89.5 + p.mouth * 2, 3, 1.4, 0, 0, TAU); ctx.fill(); }
    // antennae, swinging
    [[54, 39, 40, 18, "#8FE6FF", -1], [66, 39, 84, 22, "#E9D29A", 1]].forEach(([x0, y0, x1, y1, c, s]) => {
      const a = p.ant * s * 0.5 - p.float * s * 0.3;
      const dx = x1 - x0, dy = y1 - y0;
      const tx = x0 + dx * Math.cos(a) - dy * Math.sin(a), ty = y0 + dx * Math.sin(a) + dy * Math.cos(a);
      tube(ctx, [x0, y0], [x0 + (tx - x0) * 0.1, y0 + (ty - y0) * 0.5], [x0 + (tx - x0) * 0.5, y0 + (ty - y0) * 0.9], [tx, ty], 2.4, 1.1, "#D07AAA", "#5A1E48");
      ctx.fillStyle = radial(ctx, tx, ty, 3.2, [[0, "#FFFFFF"], [0.4, c], [1, c]], tx - 1, ty - 1); ctx.beginPath(); ctx.arc(tx, ty, 3.2, 0, TAU); ctx.fill();
      glow(ctx, tx, ty, 10, c, 0.5 + dipOf(m) * 0.5);
    });
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
// Every so often it turns its head to look straight at the crowd; on the
// drop the loupe flips down as shades; and it does a mean robot.
const SKIN = ["#A9B2E0", "#6E77AE", "#2F3466"];
const X_COL = { lite: "#D2D8F6", mid: "#7F89C2", dark: "#363C74", line: "#171B44" };
const X_SH = [[27.6, 46], [19.4, 46.5], [27.9, 52.5], [18.9, 53.5], [27.2, 59], [19.4, 60]];
const X_SH_FRONT = [[29.6, 46], [16.4, 46], [30, 52.5], [16, 52.5], [29.4, 59], [16.6, 59]];
const X_W = [3.1, 2.9, 3.3, 3.2, 3.0, 2.9];
const X_LEN = [11, 11, 12.5, 12.5, 12, 12];
const X_BEND = [1, -0.8, 0.9, -0.9, 0.7, -0.6];
const X_REST = [0.9, 2.3, 1.2, 2.0, 1.4, 1.8];
// arms from angles: tips, and elbows set by each arm's natural bend
function xArms(angs, lens = X_LEN) {
  const arms = [], elb = [];
  angs.forEach((a, i) => {
    const sh = X_SH[i];
    const L = lens[i];
    elb.push([sh[0] + Math.cos(a) * L * 0.5 - Math.sin(a) * L * 0.22 * X_BEND[i], sh[1] + Math.sin(a) * L * 0.5 + Math.cos(a) * L * 0.22 * X_BEND[i]]);
    arms.push(armAt(sh, a, L));
  });
  return { arms, elb };
}
// a turn of the head toward the crowd: eight beats in every 32
function faceOf(m) {
  if (!m.on) return 0;
  const b = ((m.B % 32) + 32) % 32;
  return smooth(20, 20.7, b) * (1 - smooth(27.3, 28, b));
}
const ixxenRest = { lift: 0, lean: 0.04, sy: 1, hem: 0, neck: 0, tilt: 0, look: [40, 30], shades: 0, ...xArms(X_REST), stiff: 0, front: 0, face: 0, seams: 0 };
const ixxen = {
  name: "Ixxen",
  height: 74,
  rest: ixxenRest,
  moves: {
    nod(m) {
      const A = m.amp, d = dipOf(m);
      return { ...ixxenRest, neck: d * A, tilt: 0.1 + d * 0.25 * A, lean: 0.04 + d * 0.06 * A, lift: d * 0.6 * A, sy: 1 - d * 0.02 * A, face: faceOf(m),
        ...xArms(X_REST.map((a, i) => a + Math.sin(m.B * PI + i) * 0.25 * A)), hem: Math.sin(m.B * PI * 0.5) * 1.2 * A, look: [40, 34 + d * 4] };
    },
    octo(m) {
      const A = Math.max(0.5, m.amp), d = dipOf(m);
      const angs = X_REST.map((a, i) => {
        const w = Math.sin(m.B * PI - Math.floor(i / 2) * 0.7);
        return i % 2 ? lerp(2.2, 4.0, (0.5 + 0.5 * w) * A) : lerp(1.0, -0.8, (0.5 + 0.5 * w) * A);
      });
      return { ...ixxenRest, ...xArms(angs, X_LEN.map((l) => l * 1.1)), neck: d * 0.5 * A, tilt: -0.1 + Math.sin(m.B * PI * 0.5) * 0.15, lift: d * 0.8 * A, face: faceOf(m),
        hem: Math.sin(m.B * PI) * 1.5 * A, seams: 0.6 * A };
    },
    conduct(m) {
      const PATH = [[33, 64], [29, 55], [38, 54], [33, 42]];
      const b = ((m.B % 4) + 4) % 4, i = Math.floor(b), k = smooth(0, 0.6, b - i);
      const a = PATH[(i + 3) % 4], c = PATH[i];
      const hand = [lerp(a[0], c[0], k), lerp(a[1], c[1], k)];
      const X = xArms(X_REST.map((r, j) => r + Math.sin(m.t * 1.5 + j) * 0.3));
      X.arms[0] = hand; X.elb[0] = [lerp(X_SH[0][0], hand[0], 0.5) + 3, lerp(X_SH[0][1], hand[1], 0.5) + 1.5];
      const back = xArms([0, 3.6 + Math.sin(m.B * PI * 0.5) * 0.3, 0, 0, 0, 0]);
      X.arms[1] = back.arms[1]; X.elb[1] = back.elb[1];
      return { ...ixxenRest, ...X, tilt: -0.25, look: [hand[0] + 4, hand[1] - 6], neck: 0.2, lean: -0.02, lift: dipOf(m) * 0.5, face: faceOf(m) };
    },
    shuffle(m) {
      const A = Math.max(0.5, m.amp), d = dipOf(m), s = snapOf(m);
      const angs = X_REST.map((a, i) => a + (i % 2 ? -1 : 1) * s * 0.45 * A * (i < 2 ? 1.4 : 1));
      return { ...ixxenRest, ...xArms(angs), lean: 0.04 + s * 0.08 * A, hem: -s * 2.5 * A, lift: d * 1 * A, sy: 1 - d * 0.03, neck: d * 0.4, tilt: s * 0.12, face: faceOf(m) };
    },
    // the robot: square to the crowd, four arms snapping between right
    // angles on every beat, head ticking, everything else dead still
    robot(m) {
      const P2 = PI / 2, P4 = PI / 4;
      const F = [ // [upper angle, forearm angle] for arms 0 (R top), 1 (L top), 2 (R mid), 3 (L mid)
        [[0, -P2], [PI, -P2], [0, P2], [PI, P2]],
        [[0, P2], [PI, -P2], [0, -P2], [PI, P2]],
        [[-P4, -P4 - P2], [PI + P4, PI + P4 + P2], [P4, P4 + P2], [PI - P4, PI - P4 - P2]],
        [[0, 0], [PI, -P2], [P2, 0], [P2 + 0.3, PI]],
        [[0, -P2], [PI, PI], [P2 - 0.3, PI], [P2, 0]],
        [[-P2 + 0.2, -P2 + 0.2], [PI + P2 - 0.2, PI + P2 - 0.2], [0, P2], [PI, P2]],
        [[0, P2], [PI, P2], [0, -P2], [PI, -P2]],
        [[P4, -P4], [PI - P4, PI + P4], [-P4, -P4 + P2], [PI + P4, PI + P4 - P2]],
      ];
      const beat = Math.floor(m.B), f = ((beat % 8) + 8) % 8;
      const k = smooth(0, 0.14, m.ph);
      const over = Math.sin(clamp(m.ph / 0.25, 0, 1) * PI) * 0.06; // a tiny overshoot as it locks
      const seg = [7.6, 7.6, 7.8, 7.8];
      const arms = [], elb = [];
      for (let i = 0; i < 4; i++) {
        const a = F[(f + 7) % 8][i], b = F[f][i];
        const a1 = lerp(a[0], b[0], k) + over * (i % 2 ? -1 : 1), a2 = lerp(a[1], b[1], k) + over * (i % 2 ? -1 : 1);
        const e = armAt(X_SH_FRONT[i], a1, seg[i]);
        elb.push(e); arms.push(armAt(e, a2, seg[i]));
      }
      // the lower pair stay tucked at its sides
      [4, 5].forEach((i) => { const sh = X_SH_FRONT[i], a = i === 4 ? 1.25 : 1.89; elb.push(armAt(sh, a, 5.5)); arms.push(armAt(armAt(sh, a, 5.5), a + (i === 4 ? -0.3 : 0.3), 5.5)); });
      const ticks = [0, 0.14, 0, -0.14];
      const tilt = lerp(ticks[((beat + 3) % 4 + 4) % 4], ticks[((beat % 4) + 4) % 4], k);
      return { ...ixxenRest, arms, elb, stiff: 1, front: 1, face: 1, tilt, lean: 0, lift: (1 - k) * 0.5, sy: 1, neck: 0, hem: 0, seams: 0.8, look: [23, 45] };
    },
    shades(m) {
      const A = Math.max(0.8, m.amp), d = dipOf(m);
      const angs = [-0.9 - d * 0.3, 4.1 + d * 0.3, -0.3 - d * 0.2, 3.5 + d * 0.2, 0.3, 2.85];
      return { ...ixxenRest, ...xArms(angs, X_LEN.map((l) => l * 1.15)), shades: 1, neck: d * A, tilt: d * 0.3, lift: d * 1.4, sy: 1 - d * 0.04, lean: 0.05 + d * 0.05,
        seams: 1, hem: sideOf(m) * 2, face: faceOf(m) };
    },
  },
  draw(ctx, p, m) {
    const t = m.t, hue = m.pal.a, rim = rimOf(m);
    const fr = clamp(p.front, 0, 1);
    const sh = X_SH.map((s, i) => [lerp(s[0], X_SH_FRONT[i][0], fr), lerp(s[1], X_SH_FRONT[i][1], fr)]);
    ctx.save();
    ctx.translate(0, p.lift); ctx.rotate(p.lean); ctx.scale(1, p.sy);
    ctx.translate(-23, -80);
    const drawArm = (i) => {
      const tent = i >= 2;
      const r = arm3d(ctx, sh[i], p.arms[i], { elbow: p.elb[i], stiff: p.stiff, w0: X_W[i], w1: tent ? 0.7 : 1.2, col: X_COL, rim, bulge: tent ? 0.15 : 0.6,
        suckers: tent ? "#D6DBF5" : null, bands: tent ? [0.25, 0.5, 0.75] : [0.3, 0.62], bandCol: `hsla(${hue},90%,78%,${0.45 + 0.4 * dipOf(m)})`, N: 24 });
      ctx.fillStyle = radial(ctx, sh[i][0], sh[i][1], X_W[i] * 0.6, [[0, "#3A4280"], [1, "#12153A"]], sh[i][0] - 0.3, sh[i][1] - 0.3);
      ctx.beginPath(); ctx.arc(sh[i][0], sh[i][1], X_W[i] * 0.5, 0, TAU); ctx.fill();
      ctx.strokeStyle = `hsla(${hue},90%,75%,0.55)`; ctx.lineWidth = 0.15; ctx.stroke();
      if (!tent) hand3d(ctx, p.arms[i], r.angle, { n: 3, len: 2.6, w: 0.5, palm: 0.75, spread: p.stiff > 0.5 ? 0.5 : 1.1, curl: p.stiff > 0.5 ? 0 : 0.35, col: X_COL });
      else {
        const a = r.angle, c = a + 1.4 + Math.sin(t * 4 + i) * 0.4, tip = p.arms[i];
        ctx.strokeStyle = X_COL.mid; ctx.lineWidth = 0.5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.quadraticCurveTo(tip[0] + Math.cos(a) * 1.2, tip[1] + Math.sin(a) * 1.2, tip[0] + Math.cos(c) * 1.3, tip[1] + Math.sin(c) * 1.3); ctx.stroke();
      }
    };
    // facing sideways the far arms are behind the mantle; facing front, all in front
    if (fr < 0.5) [1, 3, 5].forEach(drawArm);
    // ── the mantle ──
    const h = p.hem;
    const mantle = new Path2D(`M21 40 C15.4 42 15.6 49 16.6 57 L${16.2 + h} 80 Q${23 + h} 81.2 ${29.8 + h} 80 L29 57 C30.6 49 30.2 42 26 40 Z`);
    ctx.fillStyle = linear(ctx, 16 + h * 0.3, 0, 30 + h * 0.3, 0, [[0, "#0B0E2C"], [0.3, "#232C6C"], [0.52, "#3A479E"], [0.7, "#242C6A"], [1, "#0B0E28"]]);
    ctx.fill(mantle);
    ctx.save(); ctx.clip(mantle);
    // plates, seams and rivets
    [[19.6, 19.2 + h], [26.6, 27 + h]].forEach(([x0, x1]) => {
      ctx.strokeStyle = "rgba(4,5,20,0.75)"; ctx.lineWidth = 0.32; ctx.beginPath(); ctx.moveTo(x0, 44); ctx.quadraticCurveTo(lerp(x0, x1, 0.5), 62, x1, 80); ctx.stroke();
      ctx.strokeStyle = "rgba(150,165,240,0.35)"; ctx.lineWidth = 0.14; ctx.beginPath(); ctx.moveTo(x0 + 0.3, 44); ctx.quadraticCurveTo(lerp(x0, x1, 0.5) + 0.3, 62, x1 + 0.3, 80); ctx.stroke();
      for (let y = 47; y < 78; y += 4) { const k = (y - 44) / 36, x = lerp(x0, x1, k) + 0.7; ctx.fillStyle = "#8A93C8"; ctx.beginPath(); ctx.arc(x, y, 0.22, 0, TAU); ctx.fill(); }
    });
    // glowing seams with the beat
    const pulse = 0.35 + 0.45 * dipOf(m) * (0.5 + p.seams * 0.5);
    ctx.strokeStyle = `hsla(${hue},80%,64%,${pulse})`; ctx.lineWidth = 0.3;
    ctx.beginPath(); ctx.moveTo(23.4, 41); ctx.lineTo(23.2 + h, 80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(17.2 + h * 0.4, 70); ctx.quadraticCurveTo(23 + h * 0.4, 72.5, 29 + h * 0.4, 70); ctx.stroke();
    // the belt: buckle and pouches
    ctx.fillStyle = linear(ctx, 0, 61.5, 0, 64.5, [[0, "#3A3050"], [1, "#16122A"]]);
    ctx.beginPath(); ctx.moveTo(15, 61.2); ctx.quadraticCurveTo(23, 63.4, 31, 61.2); ctx.lineTo(31, 64.2); ctx.quadraticCurveTo(23, 66.4, 15, 64.2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.2; ctx.stroke();
    ctx.fillStyle = "#C9B98F"; ctx.fillRect(22, 61.8, 2.4, 3.2); ctx.fillStyle = "#1A1430"; ctx.fillRect(22.6, 62.4, 1.2, 2);
    [[17.4, 64], [27.4, 64]].forEach(([x, y]) => { ctx.fillStyle = "#2A2440"; ctx.fillRect(x - 1, y, 2, 2.4); ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.12; ctx.strokeRect(x - 1, y, 2, 2.4); });
    // hem lights chasing
    for (let k = 0; k < 7; k++) {
      const x = lerp(16.8, 29.2, k / 6) + h, on = (Math.floor(m.B * 2) % 7) === k;
      ctx.fillStyle = on ? `hsla(${hue},100%,75%,1)` : "rgba(40,48,110,0.9)"; ctx.beginPath(); ctx.arc(x, 78.6, 0.32, 0, TAU); ctx.fill();
      if (on) glow(ctx, x, 78.6, 1.6, `hsla(${hue},100%,70%,0.9)`, 0.8);
    }
    ctx.restore();
    shade(ctx, mantle, [15, 40, 16, 41], { rim, shadow: 0.55, spec: 0.12, sx: 0.4, sy: 0.12, line: "#05061A", lineW: 0.18 });
    // the instrument harness: vials glowing on the hats
    ctx.strokeStyle = "#5A5F96"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(18, 47); ctx.lineTo(28.5, 55); ctx.stroke();
    [[20.2, 48.8, 200], [22.4, 50.5, 140], [24.6, 52.2, 30]].forEach(([x, y, hh], i) => {
      ctx.fillStyle = "#1A1E3C"; ctx.fillRect(x - 0.6, y - 1.7, 1.2, 2.8);
      ctx.fillStyle = `hsla(${hh},85%,${55 + m.high * 25}%,0.95)`; ctx.fillRect(x - 0.42, y - 1.1, 0.84, 2.1);
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fillRect(x - 0.3, y - 1, 0.16, 1.7);
      ctx.fillStyle = "#C9B98F"; ctx.fillRect(x - 0.6, y - 1.9, 1.2, 0.4);
      glow(ctx, x, y, 2.4, `hsla(${hh},90%,65%,0.9)`, m.high * 0.8 * (i === Math.floor(m.B) % 3 ? 1 : 0.4));
    });
    // collar fins and shoulder plates
    ["M19.5 42 Q18 35 21.6 33 L22.4 40 Z", "M27.8 42 Q30 36 27.6 34 L26 40 Z"].forEach((d) => {
      ctx.fillStyle = linear(ctx, 18, 33, 28, 42, [[0, "#2A3270"], [1, "#0E1232"]]); ctx.fill(P(d)); ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.15; ctx.stroke(P(d));
    });
    [[lerp(27.6, 29.4, fr), 45.6, 1], [lerp(19.4, 16.6, fr), 46, -1]].forEach(([x, y, s], n) => {
      if (n === 1 && fr < 0.5) return;
      ctx.fillStyle = linear(ctx, x - 2, y - 2, x + 2, y + 2, [[0, "#4A56A8"], [1, "#151A48"]]);
      ctx.beginPath(); ctx.ellipse(x + s * 0.2, y - 0.3, 2.4, 1.6, s * 0.4, PI, TAU); ctx.lineTo(x + s * 2.4, y + 0.6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.18; ctx.stroke();
    });
    // the neck: segmented; pushes forward on the beat (or straight up when it looks at you)
    const nk = p.neck;
    const fc = clamp(p.face, 0, 1);
    const side = [28.2 + nk * 3.2, 33.5 + nk * 1.2], up = [23.2, 32.6 + nk * 0.4];
    const u = Math.max(fr, fc * 0.6);
    const neckTop = [lerp(side[0], up[0], u), lerp(side[1], up[1], u)];
    for (let s = 0; s < 5; s++) {
      const k = s / 4;
      const x = lerp(23.4, neckTop[0], k) + Math.sin(t * 1.1 + s) * 0.08, y = lerp(40.5, neckTop[1], k);
      ctx.fillStyle = radial(ctx, x, y, 1.7, [[0, SKIN[0]], [0.6, SKIN[1]], [1, SKIN[2]]], x - 0.5, y - 0.5);
      ctx.beginPath(); ctx.ellipse(x, y, 1.5 - k * 0.3, 0.95, -0.5 * (1 - u), 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(20,24,60,0.6)"; ctx.lineWidth = 0.12; ctx.stroke();
    }
    // the head: in profile, or turned to face you (a quick turn through narrow)
    ctx.save();
    ctx.translate(neckTop[0], neckTop[1]); ctx.rotate(p.tilt * (1 - fc * 0.5)); ctx.scale(1.3, 1.3);
    if (fc < 0.5) { ctx.scale(1 - fc * 1.2, 1); ixHeadSide(ctx, p, m, hue, rim, neckTop); }
    else { ctx.scale(0.4 + (fc - 0.5) * 1.2, 1); ixHeadFront(ctx, p, m, hue, rim); }
    ctx.restore();
    if (fr < 0.5) [0, 2, 4].forEach(drawArm);
    else [5, 4, 3, 2, 1, 0].forEach(drawArm);
    ctx.restore();
  },
};
function ixHeadSide(ctx, p, m, hue, rim, neckTop) {
  const t = m.t;
  ctx.fillStyle = linear(ctx, -8, -22, 8, 0, [[0, SKIN[2]], [0.45, SKIN[1]], [1, SKIN[0]]]);
  const headPath = P("M-1.5 1 C-4.6 -1.6 -6 -5.5 -6.6 -9 C-9.6 -11 -11.8 -15.5 -11 -19.6 C-10.2 -23.6 -4.6 -24.8 0.4 -21.8 C5.6 -18.8 7.6 -13.2 7.2 -8.6 C6.9 -4.4 4.8 -1 2.2 0.6 Z");
  ctx.fill(headPath);
  ctx.save(); ctx.clip(headPath);
  ctx.fillStyle = linear(ctx, 0, -9, 0, 1, [[0, "rgba(20,22,60,0)"], [1, "rgba(20,22,60,0.55)"]]); ctx.fillRect(-8, -9, 18, 11);
  ctx.strokeStyle = "rgba(20,24,60,0.55)"; ctx.lineWidth = 0.2;
  for (let r = 0; r < 5; r++) { const x = -1.6 - r * 1.9; ctx.beginPath(); ctx.moveTo(x, -22.6 + r * 0.55 + (r > 2 ? (r - 2) * 0.5 : 0)); ctx.quadraticCurveTo(x + 1.2, -16.5, x - 0.2 + r * 0.3, -10.5 + r * 0.4); ctx.stroke(); }
  ctx.fillStyle = "rgba(230,236,255,0.18)"; ctx.beginPath(); ctx.ellipse(3.4, -15, 3, 5, 0.3, 0, TAU); ctx.fill();
  ctx.restore();
  shade(ctx, headPath, [-11.5, -24, 19, 25], { rim, shadow: 0.45, spec: 0.25, sx: 0.55, sy: 0.15, sr: 0.3, line: "#171B44", lineW: 0.2 });
  ctx.strokeStyle = "rgba(25,28,70,0.6)"; ctx.lineWidth = 0.22;
  ctx.beginPath(); ctx.moveTo(0.6, -6.6); ctx.quadraticCurveTo(3.6, -8.2, 6.6, -6.8); ctx.stroke();
  for (let f = 0; f < 3; f++) {
    const sway = Math.sin(m.B * PI + f * 0.8) * (0.8 + m.amp * 1.2);
    const bx = -10.6 + f * 0.6, by = -18.5 + f * 3.2;
    ctx.fillStyle = linear(ctx, bx - 5, by, bx, by, [[0, "rgba(80,90,150,0.6)"], [1, `rgba(130,140,200,${0.95 - f * 0.15})`]]);
    ctx.beginPath(); ctx.moveTo(bx, by - 1.2);
    ctx.quadraticCurveTo(bx - 3.4, by - 1.6 + sway, bx - 4.8 + sway * 0.4, by + 0.4 + sway);
    ctx.quadraticCurveTo(bx - 2.4, by + 0.6, bx + 0.3, by + 1.3); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = `hsla(${hue},90%,75%,0.55)`; ctx.lineWidth = 0.14; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - 2.6, by - 0.2 + sway * 0.6, bx - 4.3 + sway * 0.4, by + 0.4 + sway); ctx.stroke();
  }
  for (let d = 0; d < 6; d++) {
    const a = 0.3 + 0.7 * Math.max(0, Math.cos((m.B * 1.5 - d * 0.25) * PI));
    const x = -0.6 - d * 1.8, y = -22.4 - Math.sin((d / 5) * PI) * 0.9 + d * 0.32;
    ctx.fillStyle = `hsla(${hue},90%,80%,${a})`; ctx.beginPath(); ctx.arc(x, y, 0.32, 0, TAU); ctx.fill();
    glow(ctx, x, y, 1.6, `hsla(${hue},90%,70%,0.8)`, a * 0.6);
  }
  const ex = 3.4, ey = -11.4;
  const blink = (t % 5.3) > 5.15 ? 0.12 : 1;
  ctx.fillStyle = "rgba(20,24,60,0.5)"; ctx.beginPath(); ctx.ellipse(ex, ey + 0.2, 2.1, 4.3, 0.08, 0, TAU); ctx.fill();
  ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.ellipse(ex, ey, 1.55, 3.7 * blink, 0.08, 0, TAU); ctx.fill();
  if (blink > 0.5) {
    const la = Math.atan2(p.look[1] - (neckTop[1] - 11), p.look[0] - (neckTop[0] + 3)) - p.tilt;
    const ox = Math.cos(la) * 0.55, oy = Math.sin(la) * 1.4;
    ctx.fillStyle = radial(ctx, ex + ox, ey + oy, 1.3, [[0, "#FFF4D4"], [0.6, "#E9D29A"], [1, "#7a5a20"]]);
    ctx.beginPath(); ctx.ellipse(ex + ox, ey + oy, 1.05, 2.4, 0.08, 0, TAU); ctx.fill();
    ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.ellipse(ex + ox, ey + oy, 0.22 + m.bass * 0.25, 1.8, 0.08, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(ex + ox - 0.35, ey + oy - 1.1, 0.28, 0, TAU); ctx.fill();
  }
  ctx.strokeStyle = "#1d2150"; ctx.lineWidth = 0.25; ctx.beginPath(); ctx.ellipse(ex, ey, 1.75, 3.95, 0.08, 0, TAU); ctx.stroke();
  [[0.2, -16, 0.6], [5.4, -15.6, 0.5]].forEach(([x, y, r]) => {
    ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.arc(x, y, r * blink + 0.05, 0, TAU); ctx.fill();
    ctx.fillStyle = "#E9D29A"; ctx.beginPath(); ctx.arc(x + 0.15, y - 0.15, r * 0.35, 0, TAU); ctx.fill();
  });
  ctx.strokeStyle = "#1d2150"; ctx.lineWidth = 0.22;
  ctx.beginPath(); ctx.moveTo(2.6, -3.6); ctx.quadraticCurveTo(4.4, -3 + p.shades * 1.2, 5.8, -3.8); ctx.stroke();
  for (let q = 0; q < 3; q++) {
    const sway = Math.sin(m.B * PI + q * 1.3) * 0.7;
    ctx.strokeStyle = SKIN[1]; ctx.lineWidth = 0.34 - q * 0.05; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(2.8 + q * 1.1, -1.6); ctx.quadraticCurveTo(3 + q * 1.1 + sway, 0.6, 2.6 + q * 1.2 + sway * 1.4, 2.4 - q * 0.3); ctx.stroke();
  }
  ixLoupe(ctx, p, m, false);
}
// facing front: the dome rises tall and narrow, crest lights down the middle,
// frills fanning out both sides, the vertical eye in the centre
function ixHeadFront(ctx, p, m, hue, rim) {
  const t = m.t;
  for (let f = 0; f < 3; f++) {
    [-1, 1].forEach((s) => {
      const sway = Math.sin(m.B * PI + f * 0.8) * (0.6 + m.amp);
      const by = -19 + f * 3.4, bx = s * 5.4;
      ctx.fillStyle = `rgba(120,130,195,${0.9 - f * 0.15})`;
      ctx.beginPath(); ctx.moveTo(bx, by - 1.4);
      ctx.quadraticCurveTo(bx + s * 3.6, by - 2 + sway, bx + s * (5.2 + sway * 0.3), by + 0.6 + sway);
      ctx.quadraticCurveTo(bx + s * 2.4, by + 0.8, bx - s * 0.2, by + 1.4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = `hsla(${hue},90%,75%,0.55)`; ctx.lineWidth = 0.14; ctx.stroke();
    });
  }
  const headPath = P("M0 1.2 C-2.6 1 -4.4 -2.4 -5.2 -7 C-6.4 -12 -6.8 -17.6 -5.4 -21 C-4 -24.4 4 -24.4 5.4 -21 C6.8 -17.6 6.4 -12 5.2 -7 C4.4 -2.4 2.6 1 0 1.2 Z");
  ctx.fillStyle = radial(ctx, -1.6, -15, 12, [[0, SKIN[0]], [0.55, SKIN[1]], [1, SKIN[2]]], -2.4, -17);
  ctx.fill(headPath);
  ctx.save(); ctx.clip(headPath);
  ctx.strokeStyle = "rgba(20,24,60,0.5)"; ctx.lineWidth = 0.2;
  ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(0, -17.5); ctx.stroke();
  [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(s * 1.8, -24); ctx.quadraticCurveTo(s * 3.2, -19, s * 3.4, -16.5); ctx.stroke(); });
  ctx.fillStyle = "rgba(20,22,60,0.35)"; ctx.beginPath(); ctx.ellipse(-4.4, -6.4, 1.6, 3.6, 0.2, 0, TAU); ctx.ellipse(4.4, -6.4, 1.6, 3.6, -0.2, 0, TAU); ctx.fill();
  ctx.restore();
  shade(ctx, headPath, [-6.8, -24.4, 13.6, 25.6], { rim, shadow: 0.45, spec: 0.25, sx: 0.35, sy: 0.18, sr: 0.3, line: "#171B44", lineW: 0.2 });
  for (let d = 0; d < 5; d++) {
    const a = 0.3 + 0.7 * Math.max(0, Math.cos((m.B * 1.5 - d * 0.25) * PI));
    const y = -23.4 + d * 1.3;
    ctx.fillStyle = `hsla(${hue},90%,80%,${a})`; ctx.beginPath(); ctx.arc(0, y, 0.3, 0, TAU); ctx.fill();
    glow(ctx, 0, y, 1.5, `hsla(${hue},90%,70%,0.8)`, a * 0.6);
  }
  const ex = 0, ey = -11;
  const blink = (t % 5.3) > 5.15 ? 0.12 : 1;
  ctx.fillStyle = "rgba(20,24,60,0.5)"; ctx.beginPath(); ctx.ellipse(ex, ey + 0.2, 2.2, 4.4, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.ellipse(ex, ey, 1.7, 3.8 * blink, 0, 0, TAU); ctx.fill();
  if (blink > 0.5) {
    ctx.fillStyle = radial(ctx, ex, ey, 1.4, [[0, "#FFF4D4"], [0.6, "#E9D29A"], [1, "#7a5a20"]]);
    ctx.beginPath(); ctx.ellipse(ex, ey + 0.3, 1.15, 2.5, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.ellipse(ex, ey + 0.3, 0.24 + m.bass * 0.25, 1.9, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(ex - 0.4, ey - 0.9, 0.3, 0, TAU); ctx.fill();
  }
  ctx.strokeStyle = "#1d2150"; ctx.lineWidth = 0.25; ctx.beginPath(); ctx.ellipse(ex, ey, 1.9, 4.05, 0, 0, TAU); ctx.stroke();
  [-1, 1].forEach((s) => {
    const x = s * 3.3, y = -16.2;
    ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.arc(x, y, 0.55 * blink + 0.05, 0, TAU); ctx.fill();
    ctx.fillStyle = "#E9D29A"; ctx.beginPath(); ctx.arc(x + 0.12, y - 0.12, 0.2, 0, TAU); ctx.fill();
  });
  ctx.strokeStyle = "#1d2150"; ctx.lineWidth = 0.24;
  ctx.beginPath(); ctx.moveTo(-1.8, -3.6); ctx.quadraticCurveTo(0, -2.6 + p.shades * 1.2, 1.8, -3.6); ctx.stroke();
  for (let q = -1; q <= 1; q++) {
    const sway = Math.sin(m.B * PI + q * 1.3) * 0.5;
    ctx.strokeStyle = SKIN[1]; ctx.lineWidth = 0.32; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(q * 1.1, -1.8); ctx.quadraticCurveTo(q * 1.3 + sway, 0.4, q * 1.5 + sway * 1.4, 2.2 - Math.abs(q) * 0.4); ctx.stroke();
  }
  ixLoupe(ctx, p, m, true);
}
function ixLoupe(ctx, p, m, front) {
  if (p.shades < 0.5) {
    const lx = front ? -4.6 : 0.4, ly = front ? -19.2 : -19.6;
    ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.28;
    ctx.beginPath(); ctx.moveTo(front ? -3.4 : -1.5, -14); ctx.quadraticCurveTo(lx + 0.4, -17.5, lx, ly); ctx.stroke();
    ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.42; ctx.beginPath(); ctx.arc(lx, ly, 2.2, 0, TAU); ctx.stroke();
    ctx.fillStyle = "rgba(200,230,255,0.14)"; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 0.16; ctx.beginPath(); ctx.arc(lx, ly, 1.6, -2.4, -1.5); ctx.stroke();
    return;
  }
  ctx.fillStyle = "#07060F";
  ctx.beginPath();
  if (front) { ctx.moveTo(-5.8, -17.4); ctx.lineTo(5.8, -17.4); ctx.lineTo(5, -9.4); ctx.quadraticCurveTo(0, -7.4, -5, -9.4); }
  else { ctx.moveTo(-1.2, -16.8); ctx.lineTo(6.6, -16.2); ctx.lineTo(6.2, -9.4); ctx.quadraticCurveTo(3.4, -7.6, 0.6, -9.6); }
  ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.3; ctx.stroke();
  const sh = (m.B * 0.5) % 1;
  ctx.strokeStyle = `hsla(${m.pal.b},100%,80%,0.8)`; ctx.lineWidth = 0.4;
  const x0 = front ? -5 : -0.6, x1 = front ? 5 : 6;
  ctx.beginPath(); ctx.moveTo(lerp(x0, x1, sh), -16.6); ctx.lineTo(lerp(x0, x1, sh) - 1.4, -10); ctx.stroke();
  glow(ctx, front ? 0 : 4.4, -13, 3, `hsla(${m.pal.b},100%,70%,0.8)`, dipOf(m) * 0.7);
}

// ═══════════════════════════ VARROW ═══════════════════════════
// from the Wish Engine: a great head with four eyes, crown ridges and mouth
// tendrils, a robe, three-fingered hands, an orb. Here it has the whole
// body the cabinet never showed: robe, capelet, belt and all.
const V_SH = { L: [134, 266], R: [226, 266] };
const V_SKIN = { lite: "#9CD6DE", mid: "#4A8494", dark: "#1C4258", line: "#0C2232" };
const V_SLEEVE = { lite: "#8058AE", mid: "#4E3074", dark: "#22123A" };
const varrowRest = { lift: 0, lean: 0, sx: 0, sy: 1, hem: 0, headY: 0, head: 0, look: [0, 0], hL: [150, 330], hR: [210, 330], orb: [180, 330], orbGlow: 0, lids: [0.3, 0.3], ridges: 0, tendril: 0, feet: [0, 0] };
const diamond = (x, y, w, h) => { const q = new Path2D(); q.moveTo(x, y - h); q.lineTo(x + w, y); q.lineTo(x, y + h); q.lineTo(x - w, y); q.closePath(); return q; };
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
      const sh = Math.sin(m.B * TAU * 2) * A;
      const beat = Math.floor(m.B * 2) % 4;
      return { ...varrowRest, sx: sh * 7, head: -sh * 0.03, headY: d * 6, lean: Math.sin(m.B * PI * 0.5) * 0.04, hem: -sh * 12,
        hL: [128 + sh * 6, 380], hR: [232 + sh * 6, 380], orb: [180 + sh * 10, 300 - d * 12], orbGlow: 0.5, tendril: sh * 1.4,
        lids: [beat === 0 ? 0.95 : 0.15, beat === 2 ? 0.95 : 0.15], look: [Math.sin(m.B * PI * 0.5) * 5, 0], feet: [Math.max(0, sh) * 0.8, Math.max(0, -sh) * 0.8] };
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
    const rim = rimOf(m);
    ctx.save();
    ctx.translate(0, p.lift); ctx.rotate(p.lean); ctx.scale(1, p.sy);
    ctx.translate(-180, -520);
    // feet under the hem
    [[148, p.feet[0]], [212, p.feet[1]]].forEach(([x, f]) => {
      const fx = x + (x - 180) * 0.3 * f, fy = 518 - f * 12;
      ctx.fillStyle = radial(ctx, fx, fy, 28, [[0, "#3A2458"], [1, "#100822"]], fx - 8, fy - 6);
      ctx.beginPath(); ctx.ellipse(fx, fy, 26, 11, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 1.6; ctx.stroke();
    });
    // ── the robe ──
    const h = p.hem, sx = p.sx;
    const hemY = 530 + Math.abs(h) * 0.5;
    const robe = new Path2D(`M${128 + sx} 236 Q${96 + h * 0.3} 320 ${76 + h} 516 Q${180 + h} ${hemY} ${284 + h} 516 Q${264 + h * 0.3} 320 ${232 + sx} 236 Z`);
    ctx.fillStyle = linear(ctx, 76 + h * 0.3, 0, 284 + h * 0.3, 0, [[0, "#170C28"], [0.22, "#3A2358"], [0.42, "#5C3C86"], [0.6, "#40285F"], [0.82, "#231438"], [1, "#120920"]]);
    ctx.fill(robe);
    ctx.save(); ctx.clip(robe);
    for (let i = 0; i < 6; i++) {
      const x0 = 120 + i * 24, x1 = 84 + i * 40 + h;
      ctx.strokeStyle = "rgba(8,3,18,0.55)"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(x0, 300); ctx.quadraticCurveTo(lerp(x0, x1, 0.5) + h * 0.3, 420, x1, 530); ctx.stroke();
      ctx.strokeStyle = "rgba(180,150,230,0.14)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0 + 5, 304); ctx.quadraticCurveTo(lerp(x0, x1, 0.5) + h * 0.3 + 5, 420, x1 + 5, 530); ctx.stroke();
    }
    // front panel with a column of gold glyphs
    const panel = new Path2D(`M164 250 L196 250 L${208 + h} 518 Q${180 + h} ${hemY + 2} ${152 + h} 518 Z`);
    ctx.fillStyle = linear(ctx, 150 + h * 0.5, 0, 210 + h * 0.5, 0, [[0, "#3A2260"], [0.5, "#6E4AA0"], [1, "#321C54"]]); ctx.fill(panel);
    for (let y = 418; y < 470; y += 24) {
      const k = (y - 250) / 268, x = 180 + h * k;
      ctx.strokeStyle = GOLD; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(x - 8, y + 6); ctx.lineTo(x, y - 8); ctx.lineTo(x + 8, y + 6); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y + 1, 2.4, 0, TAU); ctx.stroke();
    }
    // the hem border
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2.4;
    ctx.beginPath(); for (let x = 60; x <= 300; x += 12) { const y = 494 + ((x / 12) % 2 ? -5 : 5); x === 60 ? ctx.moveTo(x + h, y) : ctx.lineTo(x + h, y); } ctx.stroke();
    ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(60 + h, 482); ctx.lineTo(300 + h, 482); ctx.moveTo(60 + h, 506); ctx.lineTo(300 + h, 506); ctx.stroke();
    ctx.save(); ctx.globalAlpha = 0.3 + 0.6 * m.high; ctx.strokeStyle = "#7FF0E0"; ctx.lineWidth = 2;
    for (let k = 0; k < 7; k++) { const x = 90 + k * 30 + h * 0.9; ctx.beginPath(); ctx.arc(x, 494, 3, 0, TAU); ctx.stroke(); }
    ctx.restore();
    ctx.restore();
    trim(ctx, new Path2D(`M164 250 L${152 + h} 518 M196 250 L${208 + h} 518`), 3, GOLD);
    shade(ctx, robe, [76, 236, 210, 294], { rim, shadow: 0.55, spec: 0.08, sx: 0.32, sy: 0.12, line: "#090414", lineW: 2 });
    trim(ctx, new Path2D(`M${76 + h} 516 Q${180 + h} ${hemY} ${284 + h} 516`), 5, GOLD);
    // the belt and its gem
    ctx.fillStyle = linear(ctx, 0, 372, 0, 396, [[0, "#3A2050"], [1, "#160A26"]]);
    ctx.beginPath(); ctx.moveTo(102 + sx * 0.5, 372); ctx.quadraticCurveTo(180, 388, 258 + sx * 0.5, 372); ctx.lineTo(260 + sx * 0.5, 394); ctx.quadraticCurveTo(180, 410, 100 + sx * 0.5, 394); ctx.closePath(); ctx.fill();
    trim(ctx, new Path2D(`M${102 + sx * 0.5} 372 Q180 388 ${258 + sx * 0.5} 372 M${100 + sx * 0.5} 394 Q180 410 ${260 + sx * 0.5} 394`), 2, GOLD);
    const gem = diamond(180, 391, 10, 13);
    ctx.fillStyle = radial(ctx, 180, 391, 10, [[0, "#FFFFFF"], [0.35, `hsl(${m.pal.a},100%,70%)`], [1, `hsl(${m.pal.a},80%,28%)`]], 177, 387);
    ctx.fill(gem); trim(ctx, gem, 1.6, GOLD);
    glow(ctx, 180, 391, 26, `hsla(${m.pal.a},100%,65%,0.9)`, 0.35 + m.bass * 0.6);
    // neck
    ctx.fillStyle = linear(ctx, 148, 0, 212, 0, [[0, "#1E4458"], [0.4, "#5E9AA6"], [1, "#1E4458"]]);
    ctx.fill(P("M156 196 Q180 214 204 196 L212 248 L148 248 Z"));
    // orb (behind the hands when they hold it)
    const [ox, oy] = p.orb;
    glow(ctx, ox, oy, 80 + p.orbGlow * 60 + m.bass * 30, "rgba(233,210,154,0.75)", 0.4 + p.orbGlow * 0.6);
    ctx.fillStyle = radial(ctx, ox, oy, 34, [[0, "#FFFFFF"], [0.22, "#F2DCA6"], [0.58, "#8B5FBF"], [1, "#160C2C"]], ox - 9, oy - 10);
    ctx.beginPath(); ctx.arc(ox, oy, 34, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(ox, oy); ctx.rotate(m.B * 0.8); ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineCap = "round";
    ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 0, 20, PI, TAU); ctx.stroke();
    ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, 2, 12, 0.2, PI * 0.9); ctx.stroke(); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.beginPath(); ctx.ellipse(ox - 12, oy - 14, 8, 4, -0.6, 0, TAU); ctx.fill();
    // arms in their sleeves, three-fingered hands with lit tips
    [["L", p.hL, 1], ["R", p.hR, -1]].forEach(([k, hand, s]) => {
      const shp = [V_SH[k][0] + sx, V_SH[k][1]];
      const r = arm3d(ctx, shp, hand, { bend: 0.45 * s, w0: 34, w1: 18, col: V_SKIN, rim, bulge: 0.45, sleeve: { to: 0.42, w: 1.45, col: V_SLEEVE, trim: GOLD } });
      const tips = hand3d(ctx, hand, r.angle, { n: 3, len: 32, w: 8, palm: 11, spread: 1.1, curl: 0.3, col: V_SKIN, tipCol: "#9FFFF0" });
      tips.forEach(([tx, ty]) => glow(ctx, tx, ty, 12, "rgba(127,240,224,0.9)", 0.4 + dipOf(m) * 0.4));
    });
    // the capelet over the shoulders, trimmed and tasselled
    const cape = new Path2D(`M${108 + sx} 244 Q${180 + sx} 292 ${252 + sx} 244 L${270 + sx} 306 Q${180 + sx} 356 ${90 + sx} 306 Z`);
    ctx.fillStyle = linear(ctx, 90, 0, 270, 0, [[0, "#1A0C2C"], [0.35, "#40205E"], [0.5, "#52307A"], [0.7, "#36184E"], [1, "#140820"]]); ctx.fill(cape);
    ctx.save(); ctx.clip(cape); ctx.strokeStyle = "rgba(6,2,14,0.5)"; ctx.lineWidth = 3;
    for (let k = 0; k < 5; k++) { const x = 116 + k * 32 + sx; ctx.beginPath(); ctx.moveTo(x + (x - 180) * -0.1, 262); ctx.lineTo(x + (x - 180) * 0.15, 350); ctx.stroke(); }
    ctx.restore();
    shade(ctx, cape, [90, 244, 180, 112], { rim, shadow: 0.45, spec: 0.1, line: "#090414", lineW: 1.6 });
    trim(ctx, new Path2D(`M${270 + sx} 306 Q${180 + sx} 356 ${90 + sx} 306`), 4, GOLD);
    for (let k = 0; k <= 8; k++) {
      const s = k / 8, x = lerp(92, 268, s) + sx, y = 306 + Math.sin(s * PI) * 50 * 0.95;
      const sw = Math.sin(m.B * PI + k) * 3 + h * 0.15;
      ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sw, y + 14); ctx.stroke();
      ctx.fillStyle = "#E8C878"; ctx.beginPath(); ctx.arc(x + sw, y + 15, 2.6, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.moveTo(118 + sx, 240); ctx.quadraticCurveTo(180 + sx, 278, 242 + sx, 240); ctx.stroke(); ctx.globalAlpha = 1;
    // ── the head ──
    ctx.save();
    ctx.translate(180 + sx, 210 + p.headY); ctx.rotate(p.head); ctx.translate(-180, -210);
    ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.beginPath(); ctx.ellipse(186, 236, 70, 16, 0, 0, TAU); ctx.fill();
    const head = P("M180 34 C244 34 266 92 258 140 C250 188 216 214 180 216 C144 214 110 188 102 140 C94 92 116 34 180 34 Z");
    ctx.fillStyle = radial(ctx, 160, 90, 150, [[0, "#86C4CC"], [0.4, "#4C8A98"], [0.8, "#1E4A60"], [1, "#12303E"]], 150, 70); ctx.fill(head);
    ctx.save(); ctx.clip(head);
    ctx.fillStyle = "rgba(10,30,44,0.35)"; ctx.beginPath(); ctx.ellipse(120, 160, 18, 32, 0.3, 0, TAU); ctx.ellipse(240, 160, 18, 32, -0.3, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(200,245,240,0.16)"; ctx.beginPath(); ctx.ellipse(180, 112, 46, 10, 0, 0, TAU); ctx.fill();
    ctx.restore();
    shade(ctx, head, [100, 34, 160, 182], { rim, shadow: 0.5, spec: 0.22, sx: 0.34, sy: 0.18, sr: 0.3, line: "#0C2232", lineW: 1.6 });
    [["M150 58 Q180 30 210 58", 3], ["M138 80 Q180 46 222 80", 2.4], ["M128 104 Q180 66 232 104", 1.8]].forEach(([d, w], i) => {
      const on = Math.max(p.ridges, Math.max(0, Math.cos((m.B - i * 0.25) * PI * 2)) * m.amp);
      ctx.strokeStyle = "rgba(40,30,8,0.5)"; ctx.lineWidth = w + 2.4; ctx.lineCap = "round"; ctx.stroke(P(d));
      ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = w + on * 1.4; ctx.stroke(P(d));
      ctx.strokeStyle = "rgba(255,250,230,0.8)"; ctx.lineWidth = w * 0.3; ctx.stroke(P(d));
      if (on > 0.2) { ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.strokeStyle = `rgba(233,210,154,${on * 0.5})`; ctx.lineWidth = w + 8; ctx.stroke(P(d)); ctx.restore(); }
    });
    ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.arc(164, 108, 4.5, 0, TAU); ctx.arc(196, 108, 4.5, 0, TAU); ctx.fill();
    ctx.fillStyle = "#E9D29A"; ctx.beginPath(); ctx.arc(165 + p.look[0] * 0.2, 107 + p.look[1] * 0.2, 1.3, 0, TAU); ctx.arc(197 + p.look[0] * 0.2, 107 + p.look[1] * 0.2, 1.3, 0, TAU); ctx.fill();
    const blink = (m.t % 5.1) > 4.95;
    [[148, 136, 18, 0], [212, 136, -18, 1]].forEach(([x, y, a, n]) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate((a * PI) / 180);
      ctx.fillStyle = "rgba(10,30,44,0.55)"; ctx.beginPath(); ctx.ellipse(0, 1.5, 28, 16, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.ellipse(0, 0, 24, 12.5, 0, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 24, 12.5, 0, 0, TAU); ctx.clip();
      ctx.fillStyle = radial(ctx, p.look[0], p.look[1], 10, [[0, "#C8A8FF"], [0.6, "#7A4FD0"], [1, "#3A1E80"]]);
      ctx.beginPath(); ctx.arc(p.look[0], p.look[1], 9 + m.bass * 2, 0, TAU); ctx.fill();
      ctx.fillStyle = "#05040F"; ctx.beginPath(); ctx.ellipse(p.look[0], p.look[1], 2.4, 6, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(p.look[0] - 4, p.look[1] - 4, 2.6, 0, TAU); ctx.fill();
      const lid = blink ? 1 : clamp(p.lids[n] ?? 0.3, 0, 1);
      ctx.fillStyle = linear(ctx, 0, -16, 0, -12 + lid * 28, [[0, "#4A8494"], [1, "#2E6274"]]); ctx.fillRect(-28, -16, 56, 4 + lid * 28);
      ctx.strokeStyle = "#0C2232"; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(-28, -12 + lid * 28); ctx.lineTo(28, -12 + lid * 28); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = "rgba(180,230,235,0.4)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 0, 24.5, 13, 0, 0.2, PI - 0.2); ctx.stroke();
      ctx.restore();
    });
    [[126, 166], [134, 176], [234, 166], [226, 176]].forEach(([x, y], i) => {
      const on = 0.4 + 0.6 * Math.max(0, Math.sin(m.B * PI - i * 0.6));
      ctx.fillStyle = "#7FF0E0"; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, TAU); ctx.fill();
      glow(ctx, x, y, 9, "rgba(127,240,224,0.9)", on);
    });
    ctx.fillStyle = "#0A0518"; ctx.beginPath(); ctx.ellipse(180, 172, 4 + p.ridges * 2, 10, 0, 0, TAU); ctx.fill();
    [-14, -7, 0, 7, 14].forEach((dx, i) => {
      const sw = p.tendril * 8 + Math.sin(m.t * 3 + i) * 1.5;
      const a = [180 + dx, 182], c1 = [180 + dx * 1.3 + sw * 0.4, 196], c2 = [180 + dx * 1.1 + sw * 1.4, 214], b = [180 + dx * 1.2 + sw * 1.6, 224];
      tube(ctx, a, c1, c2, b, 4.6, 2, "#2E6274", "#0C2232");
      ctx.strokeStyle = "rgba(160,220,230,0.35)"; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(a[0] - 0.8, a[1]); ctx.bezierCurveTo(c1[0] - 0.8, c1[1], c2[0] - 0.8, c2[1], b[0] - 0.8, b[1]); ctx.stroke();
    });
    ctx.restore(); // head
    ctx.restore();
  },
};

export const DANCERS = { qeth, ilu, ixxen, varrow };

// Which moves each dancer reaches for, by how hard the music is going
export const REPERTOIRE = {
  qeth: { chill: ["sway", "sway", "ripple"], groove: ["ripple", "toss", "sway", "vogue"], hype: ["vogue", "toss", "raise", "ripple"], drop: "raise", unison: "raise" },
  ilu: { chill: ["wave", "bob", "soar"], groove: ["bob", "twirl", "wave", "glow", "soar"], hype: ["glow", "twirl", "bob", "mirror", "soar"], drop: "mirror", unison: "glow" },
  ixxen: { chill: ["nod", "conduct", "robot"], groove: ["octo", "shuffle", "robot", "conduct", "nod"], hype: ["robot", "shuffle", "octo", "shades"], drop: "shades", unison: "robot" },
  varrow: { chill: ["nod", "orbit"], groove: ["shimmy", "nod", "orbit", "roof"], hype: ["roof", "shimmy", "lift"], drop: "lift", unison: "roof" },
};
