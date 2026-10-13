// Circadian Pulse (Cicada Remix), Update 5.82: the Rave moves into a dense
// forest at dusk, and a cicada - played up to be properly alien - lives a
// whole life on the dance floor, on the song's own clock (m.s, seconds):
//
//   0:00-0:08    the forest buzzing; the soil in the middle of the floor
//                bulges and cracks, a green glow leaking from below
//   0:08.0       the hit: the nymph claws its way out
//   0:09-0:24    it looks around, cleans its antennae
//   0:24-2:52    it dances; its wing pads grow, and late on it rubs them
//                on the beat
//   2:52.5-3:00  first molt: the back splits on each of the four stabs,
//                the new body pulls free, the old shell stays put
//   3:00.5-3:06  it chirps to the world for six seconds
//   3:06-6:17    the adult: green and black, red eyes, rubbing its wings
//                together on every beat, the wings hardening and darkening
//   6:17.5-6:41  the final molt, slow and glowing
//   6:41.5-end   the last form (black and emerald, three glowing ocelli,
//                wings lit along their veins) chirps through to the end and
//                flies off over the last three seconds
//
// Smaller cicadas fly in from the trees in waves, land on the speakers and
// the edges of the LED wall, molt, and fly back to the trees in their new
// bodies, leaving their shells behind for a while.
// The four dancers wear park ranger hats; the DJ keeps a lantern on the decks.
import { TAU, lerp, clamp, smooth, hash, glow, radial, linear } from "./draw";

const PI = Math.PI;
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

// the life story, in song seconds (measured from the file)
export const LIFE = {
  emerge: 8.0,            // the hit at 0:08
  dance: 24.0,            // the beat comes in
  molt1: [172.5, 180.5],  // bass out; a stab every bar: 172.5, 174.5, 176.5, 178.5
  chirp1: [180.5, 186.3], // the cicada buzz in the track
  molt2: [377.5, 401.5],  // the long final breakdown
  chirp2: [401.5, 410.3], // the buzz to the end
  fly: [407.3, 410.3],    // the last three seconds
};
const MOLT1_CRACKS = [172.5, 174.5, 176.5, 178.5];

// how loud the cicadas in the track are right now (0-1), for the scene
export function chorusAt(s) {
  const win = (a, b, fadeIn = 0.25, fadeOut = 0.4) => smooth(a - fadeIn, a, s) * (1 - smooth(b, b + fadeOut, s));
  return Math.max(win(0, 8.3, 0.01, 0.4), win(180.5, 186.3), win(401.5, 410.3, 0.4, 0.3));
}

// ─────────────── the sky at dusk ───────────────
const STARS = Array.from({ length: 70 }, (_, i) => [hash(i, 61), hash(i, 62), hash(i, 63)]);
export function drawDusk(ctx, L, m) {
  const { VW, VH } = L;
  const hy = L.floorTop - 1.5;
  // dusk deepens toward night over the length of the song
  const late = clamp((m.s || 0) / 411, 0, 1);
  const glowK = 1 - late * 0.55;
  ctx.fillStyle = linear(ctx, 0, -30, 0, hy + 4, [
    [0, "#060D18"], [0.35, "#12203A"], [0.62, `rgb(${Math.round(58 + 40 * glowK)},${Math.round(40 + 22 * glowK)},${Math.round(62 - 8 * glowK)})`],
    [0.84, `rgb(${Math.round(120 + 110 * glowK)},${Math.round(64 + 60 * glowK)},${Math.round(40 + 14 * glowK)})`], [1, `rgb(${Math.round(150 + 90 * glowK)},${Math.round(90 + 70 * glowK)},${Math.round(40 + 20 * glowK)})`],
  ]);
  ctx.fillRect(-30, -30, VW + 60, hy + 34);
  ctx.fillStyle = "#03060A"; ctx.fillRect(-30, hy + 4, VW + 60, VH);
  // the sun just gone, a warm bloom on the horizon
  glow(ctx, L.cx - VW * 0.18, hy - 2, VW * 0.42, "rgba(255,150,70,0.9)", 0.32 * glowK + m.level * 0.06);
  // long thin clouds, their undersides lit
  for (let k = 0; k < 6; k++) {
    const y = hy - 18 - k * 6 - hash(k, 64) * 4, x = ((hash(k, 65) * VW * 1.4 + m.t * (0.6 + k * 0.15)) % (VW + 80)) - 40, w = 24 + hash(k, 66) * 34;
    ctx.fillStyle = linear(ctx, 0, y - 1.2, 0, y + 1.2, [[0, "rgba(40,36,60,0.0)"], [0.5, "rgba(50,40,64,0.6)"], [1, `rgba(${Math.round(220 * glowK + 40)},${Math.round(120 * glowK + 40)},90,${0.35 * glowK + 0.1})`]]);
    ctx.beginPath(); ctx.ellipse(x, y, w / 2, 1.3, 0, 0, TAU); ctx.fill();
  }
  // the first stars, more of them as it gets darker
  STARS.forEach(([x, y, z], i) => {
    const a = (0.15 + late * 0.6) * (0.4 + z * 0.6) * (y < 0.45 ? 1 : 0.3) + (i % 6 === 0 ? m.high * 0.3 : 0) * Math.sin(m.t * 2.5 + i);
    ctx.fillStyle = `rgba(230,236,255,${clamp(a, 0, 1)})`;
    ctx.fillRect(x * VW, y * (hy - 20), 0.3, 0.3);
  });
}

// ─────────────── the forest ───────────────
let FOREST = null;
function forestFor(VW, hy) {
  if (FOREST && FOREST.VW === VW && FOREST.hy === hy) return FOREST;
  const layers = [];
  // three rows of trees, far to near: conifers and broadleaf crowns mixed
  [[0, 26, 4, "far"], [1, 34, 6, "mid"], [2, 44, 9, "near"]].forEach(([li, tall, step, name]) => {
    const p = new Path2D();
    p.moveTo(-40, hy + 4);
    let x = -40, i = 0;
    while (x < VW + 40) {
      const w = step * (0.7 + hash(li, i, 1) * 0.8), h = tall * (0.55 + hash(li, i, 2) * 0.55);
      if (hash(li, i, 3) < 0.55) { // a conifer, its tiers
        const tiers = 4;
        p.lineTo(x, hy - h * 0.12);
        for (let t = 0; t < tiers; t++) {
          const k = t / tiers, k2 = (t + 1) / tiers;
          p.lineTo(x + w * 0.5 * k2 * 0.9, hy - h * (0.12 + 0.88 * k2) + h * 0.06);
          p.lineTo(x + w * 0.5 * k2 * 0.5 + w * 0.06, hy - h * (0.12 + 0.88 * k2) + h * 0.12);
        }
        p.lineTo(x + w * 0.5, hy - h);
        for (let t = tiers - 1; t >= 0; t--) {
          const k2 = (t + 1) / tiers;
          p.lineTo(x + w - w * 0.5 * k2 * 0.5 - w * 0.06, hy - h * (0.12 + 0.88 * k2) + h * 0.12);
          p.lineTo(x + w - w * 0.5 * k2 * 0.9, hy - h * (0.12 + 0.88 * k2) + h * 0.06);
        }
        p.lineTo(x + w, hy - h * 0.12);
      } else { // a broadleaf crown, lumpy
        const n = 5, cxw = x + w / 2;
        p.lineTo(x, hy - h * 0.35);
        for (let k = 0; k <= n; k++) {
          const a = PI + (k / n) * PI;
          const r = (w * 0.62) * (0.85 + hash(li, i, k + 10) * 0.3);
          p.quadraticCurveTo(cxw + Math.cos(a - 0.3) * r * 1.2, hy - h * 0.62 + Math.sin(a - 0.3) * h * 0.5, cxw + Math.cos(a) * r, hy - h * 0.62 + Math.sin(a) * h * 0.45);
        }
        p.lineTo(x + w, hy - h * 0.35);
      }
      x += w * (0.55 + hash(li, i, 4) * 0.3);
      i++;
    }
    p.lineTo(VW + 40, hy + 4); p.closePath();
    layers.push({ p, name });
  });
  // the big trunks framing the stage at both edges, and their crowns
  const trunks = [];
  const edge = [[-4, 7.5], [9, 5], [20, 3.4], [VW - 18, 3.6], [VW - 7, 5.4], [VW + 3, 8]];
  edge.forEach(([x, w], i) => trunks.push({ x, w, lean: (hash(i, 71) - 0.5) * 0.08, seed: i }));
  FOREST = { VW, hy, layers, trunks };
  return FOREST;
}
const FLIES = Array.from({ length: 46 }, (_, i) => [hash(i, 81), hash(i, 82), hash(i, 83), hash(i, 84)]);
export function drawForest(ctx, L, m) {
  const hy = L.floorTop - 1.5;
  const F = forestFor(L.VW, hy);
  const late = clamp((m.s || 0) / 411, 0, 1);
  const cols = [["#1E3A34", 0.95], ["#122419", 1], ["#08120B", 1]];
  F.layers.forEach((ly, i) => {
    ctx.fillStyle = cols[i][0]; ctx.globalAlpha = cols[i][1]; ctx.fill(ly.p);
    if (i === 0) { // mist between the rows, warm from the last light
      ctx.globalAlpha = 1;
      ctx.fillStyle = linear(ctx, 0, hy - 16, 0, hy, [[0, "rgba(0,0,0,0)"], [1, `rgba(${Math.round(180 - 80 * late)},${Math.round(120 - 40 * late)},90,0.22)`]]);
      ctx.fillRect(-40, hy - 16, L.VW + 80, 16);
    }
  });
  ctx.globalAlpha = 1;
  // mist along the ground, lit by the show
  ctx.fillStyle = linear(ctx, 0, hy - 10, 0, hy + 2, [[0, "rgba(0,0,0,0)"], [1, `hsla(${m.pal.a},40%,40%,${0.14 + m.level * 0.08})`]]);
  ctx.fillRect(-40, hy - 10, L.VW + 80, 12);
  // the great trunks at the edges, bark catching the dusk on one side
  F.trunks.forEach((tr) => {
    const top = -20, bot = hy + 6;
    ctx.save(); ctx.translate(tr.x, bot); ctx.rotate(tr.lean);
    const hgt = bot - top;
    ctx.fillStyle = linear(ctx, -tr.w / 2, 0, tr.w / 2, 0, [[0, "#06080A"], [0.55, "#1A1410"], [0.8, "#3A2A1C"], [1, "#0A0806"]]);
    ctx.beginPath(); ctx.moveTo(-tr.w * 0.62, 0); ctx.lineTo(-tr.w / 2, -hgt); ctx.lineTo(tr.w / 2, -hgt); ctx.lineTo(tr.w * 0.62, 0); ctx.closePath(); ctx.fill();
    // bark furrows
    ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 0.18;
    for (let k = 0; k < 5; k++) { const x = -tr.w * 0.4 + k * tr.w * 0.2; ctx.beginPath(); ctx.moveTo(x, 0); for (let y = 0; y > -hgt; y -= 6) ctx.lineTo(x + Math.sin(y * 0.3 + k + tr.seed) * 0.3, y); ctx.stroke(); }
    ctx.restore();
  });
  // crowns hanging over the top corners
  [[-6, 1], [L.VW + 6, -1]].forEach(([x, s], i) => {
    for (let k = 0; k < 9; k++) {
      const cx = x + s * (hash(i, k, 91) * 34), cy = -6 + hash(i, k, 92) * 26, r = 8 + hash(i, k, 93) * 10;
      ctx.fillStyle = k % 3 ? "#07110A" : "#0C1A10";
      ctx.beginPath(); ctx.ellipse(cx + Math.sin(m.t * 0.4 + k) * 0.4, cy, r, r * 0.7, 0, 0, TAU); ctx.fill();
    }
  });
  // fireflies: more as it gets dark, blinking slowly, a few on the beat
  FLIES.forEach(([a, b, c, d], i) => {
    const x = a * L.VW + Math.sin(m.t * (0.2 + c * 0.3) + i) * 3, y = hy - 4 - b * 30 + Math.cos(m.t * (0.25 + d * 0.2) + i) * 2;
    const blink = i % 5 === 0 ? Math.pow(dipOf(m), 3) : Math.max(0, Math.sin(m.t * (0.7 + c) + i * 2.3));
    const k = blink * (0.25 + late * 0.75) * (i < 46 * (0.4 + late * 0.6) ? 1 : 0);
    if (k < 0.05) return;
    glow(ctx, x, y, 1.6, "rgba(190,255,120,0.9)", k * 0.7);
    ctx.fillStyle = `rgba(230,255,170,${k})`; ctx.fillRect(x - 0.12, y - 0.12, 0.24, 0.24);
  });
  // the chorus in the trees: a shimmer of sound across the canopy when the
  // cicadas in the track are loud
  const ch = chorusAt(m.s || 0);
  if (ch > 0.02) {
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (let k = 0; k < 14; k++) {
      const x = hash(k, 95) * L.VW, y = hy - 10 - hash(k, 96) * 26;
      const r = ((m.t * 9 + hash(k, 97) * 6) % 6);
      ctx.strokeStyle = `rgba(170,255,140,${ch * 0.22 * (1 - r / 6)})`; ctx.lineWidth = 0.2;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    }
    ctx.restore();
  }
}

// ─────────────── the main cicada ───────────────
// colours of each form; k blends teneral (pale, just out) to hardened
function colours(form, hard) {
  if (form === "nymph") return { body: ["#C49A5E", "#8A6236", "#3E2814"], eye: ["#F4EEDF", "#B8C9A8", "#6E7A5A"], eyeGlow: "rgba(170,255,150,0.6)", line: "#2A1A0C", vein: "#7A5A30" };
  if (form === "adult") {
    const mixc = (a, b) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const c = [16, 8, 0].map((sh) => Math.round(lerp((pa >> sh) & 255, (pb >> sh) & 255, hard))); return `rgb(${c[0]},${c[1]},${c[2]})`; };
    return { body: [mixc("#E8FFE8", "#7CC25A"), mixc("#BDEFC4", "#3E7E30"), mixc("#8AC69A", "#0E160E")], eye: [mixc("#FFD0C8", "#FF6A50"), mixc("#F08878", "#C0281C"), mixc("#B05A50", "#4A0806")], eyeGlow: "rgba(255,80,60,0.7)", line: mixc("#7AA884", "#050805"), vein: mixc("#E8FFF0", "#B8D86A"), mark: hard };
  }
  return { body: ["#3A8A5A", "#0E2A1A", "#020604"], eye: ["#FFE0A0", "#FF5A22", "#7A1404"], eyeGlow: "rgba(255,110,40,0.9)", line: "#000000", vein: "#7CFFB0", mark: 1, final: true };
}

// one cicada, front view, standing on its hind legs. Units: feet at 0,0,
// about 100 tall. o: { form, hard, pads, wing (0 none .. 1 full), spread,
// rub, lean, dip, jump, armL, armR, mid, head, chirp, shell, split, glowIn }
function bug(ctx, o, m) {
  const c = colours(o.form, o.hard || 0);
  const nym = o.form === "nymph";
  const shell = o.shell;
  ctx.save();
  if (shell) ctx.globalAlpha *= 0.82;
  ctx.translate(0, -(o.jump || 0));
  ctx.rotate(o.lean || 0);
  const sq = 1 - (o.dip || 0) * 0.05; // a little squash on the beat
  ctx.scale(1 + (o.dip || 0) * 0.03, sq);
  const vib = o.chirp ? Math.sin(m.t * 90) * 0.8 * o.chirp : 0;

  // ── wings, behind everything ──
  if (!nym && (o.wing || 0) > 0.01) {
    const len = 18 + 44 * o.wing; // crumpled when fresh, full when expanded
    [-1, 1].forEach((s) => {
      const ang = s * (0.35 + (o.spread || 0) * 0.85 + (o.rub || 0) * 0.22) + (o.chirp ? Math.sin(m.t * 70 + s) * 0.06 * o.chirp : 0);
      ctx.save(); ctx.translate(s * 7, -64); ctx.rotate(PI - ang);
      // hind wing, shorter, under the fore wing
      for (const [L0, wd, al] of [[len * 0.72, 8, 0.55], [len, 10.5, 0.85]]) {
        const p = new Path2D();
        const wob = (1 - o.wing) * 3; // crumples
        p.moveTo(0, 0);
        p.bezierCurveTo(-wd * 0.9, L0 * 0.25 + wob, -wd * 1.1 - wob, L0 * 0.7, -wd * 0.35, L0);
        p.bezierCurveTo(wd * 0.3, L0 * 1.02, wd * 0.7, L0 * 0.6, wd * 0.25, L0 * 0.2);
        p.closePath();
        const base = c.final ? "rgba(30,90,60," : "rgba(210,255,225,";
        ctx.fillStyle = linear(ctx, 0, 0, 0, L0, [[0, base + (0.42 * al) + ")"], [1, base + (0.14 * al) + ")"]]);
        ctx.fill(p);
        // veins: the leading edge thick, the rest a net
        const vg = c.final ? 0.55 + 0.45 * (m.bass || 0) : 0.75;
        ctx.strokeStyle = c.vein; ctx.globalAlpha = (shell ? 0.4 : 1) * vg * al;
        ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-wd * 0.9, L0 * 0.25 + wob, -wd * 1.1 - wob, L0 * 0.7, -wd * 0.35, L0); ctx.stroke();
        ctx.lineWidth = 0.4;
        for (let k = 1; k <= 5; k++) { const f = k / 6; ctx.beginPath(); ctx.moveTo(-wd * 0.2 * f, L0 * 0.12); ctx.quadraticCurveTo(-wd * (0.9 - f * 0.5), L0 * (0.5 + f * 0.1), -wd * (0.5 - f * 0.6), L0 * (0.86 + f * 0.1)); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(-wd * 0.95, L0 * 0.62); ctx.lineTo(wd * 0.4, L0 * 0.5); ctx.stroke();
        if (c.final && !shell) { ctx.globalCompositeOperation = "lighter"; ctx.strokeStyle = `rgba(124,255,176,${0.25 * vg})`; ctx.lineWidth = 1.6; ctx.stroke(p); ctx.globalCompositeOperation = "source-over"; }
        ctx.globalAlpha = shell ? 0.82 : 1;
      }
      ctx.restore();
    });
  }

  // ── hind legs ──
  const legC = c.body[2];
  [-1, 1].forEach((s) => {
    const kx = s * (17 + (o.dip || 0) * 2), ky = -15 + (o.dip || 0) * 2;
    ctx.strokeStyle = legC; ctx.lineCap = "round";
    ctx.lineWidth = nym ? 4.2 : 3.4; ctx.beginPath(); ctx.moveTo(s * 9, -30); ctx.lineTo(kx, ky); ctx.stroke();
    ctx.lineWidth = nym ? 3 : 2.4; ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(s * 15, -1); ctx.lineTo(s * 19, 0); ctx.stroke();
    ctx.strokeStyle = c.body[1]; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(kx - s * 1, ky - 2); ctx.lineTo(kx + s * 1.6, ky - 4); ctx.stroke(); // a spur
  });

  // ── abdomen, ringed ──
  const arx = (nym ? 13.5 : 12) * (1 + vib * 0.05), ary = nym ? 17 : 19;
  ctx.fillStyle = radial(ctx, -4, -44, 22, [[0, c.body[0]], [0.55, c.body[1]], [1, c.body[2]]]);
  ctx.beginPath(); ctx.ellipse(0, -38, arx, ary, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = c.line; ctx.lineWidth = 0.8;
  for (let k = 0; k < 6; k++) { const y = -50 + k * 4.6; const half = Math.sqrt(Math.max(0, 1 - Math.pow((y + 38) / ary, 2))) * arx; ctx.beginPath(); ctx.moveTo(-half, y); ctx.quadraticCurveTo(0, y + 2.4, half, y); ctx.stroke(); }
  if (c.final && !shell) { // emerald sheen
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = linear(ctx, -arx, -50, arx, -24, [[0, "rgba(0,0,0,0)"], [0.5 + Math.sin(m.t * 0.8) * 0.3, "rgba(60,220,140,0.28)"], [1, "rgba(0,0,0,0)"]]);
    ctx.beginPath(); ctx.ellipse(0, -38, arx, ary, 0, 0, TAU); ctx.fill(); ctx.restore();
  }

  // ── middle legs ──
  [-1, 1].forEach((s) => {
    const sw = (o.mid || 0) * s;
    ctx.strokeStyle = legC; ctx.lineWidth = nym ? 3.2 : 2.6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(s * 12, -52); ctx.lineTo(s * 23, -45 + sw * 3); ctx.lineTo(s * 25 + sw, -28); ctx.stroke();
  });

  // ── thorax: the pronotum collar and the mesonotum with its W ──
  ctx.fillStyle = radial(ctx, -5, -66, 20, [[0, c.body[0]], [0.6, c.body[1]], [1, c.body[2]]]);
  ctx.beginPath(); ctx.ellipse(0, -60, nym ? 16.5 : 15.5, nym ? 11 : 10, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = c.line; ctx.lineWidth = 0.9; ctx.stroke();
  if (!nym) {
    ctx.strokeStyle = c.final ? "rgba(124,255,176,0.8)" : `rgba(10,14,10,${0.25 + 0.7 * (c.mark || 0)})`; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-8, -64); ctx.lineTo(-4, -56); ctx.lineTo(0, -61); ctx.lineTo(4, -56); ctx.lineTo(8, -64); ctx.stroke();
  } else {
    // wing pads, growing through the nymph's life; rubbed on the beat late on
    const pd = o.pads || 0;
    if (pd > 0.02) [-1, 1].forEach((s) => {
      ctx.save(); ctx.translate(s * 12, -60); ctx.rotate(s * (0.5 + (o.rub || 0) * 0.35));
      ctx.fillStyle = linear(ctx, 0, 0, 0, 10 * pd, [[0, "#5A3A1C"], [1, "#2A1A0A"]]);
      ctx.beginPath(); ctx.ellipse(0, 4 * pd, 3.2 * pd + 0.8, 7 * pd, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#1A0E04"; ctx.lineWidth = 0.4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 9 * pd); ctx.stroke();
      ctx.restore();
    });
  }
  // the split down the back (a glowing seam when the new body is inside)
  if ((o.split || 0) > 0) {
    const len = o.split;
    ctx.strokeStyle = shell ? "rgba(255,240,200,0.75)" : `rgba(190,255,200,${0.6 + 0.4 * (o.glowIn || 0)})`; ctx.lineWidth = 1.2 + len * 1.4;
    ctx.beginPath(); ctx.moveTo(0, -84); ctx.lineTo(0, -84 + len * 34); ctx.stroke();
    if (!shell) glow(ctx, 0, -72, 10 + len * 10, "rgba(170,255,180,0.9)", (o.glowIn || 0) * 0.8);
  }

  // ── the head ──
  ctx.save(); ctx.translate(0, -70); ctx.rotate(o.head || 0); ctx.translate(0, 70);
  ctx.fillStyle = radial(ctx, -4, -79, 16, [[0, c.body[0]], [0.6, c.body[1]], [1, c.body[2]]]);
  ctx.beginPath(); ctx.ellipse(0, -76, nym ? 13 : 14, 8, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = c.line; ctx.lineWidth = 0.8; ctx.stroke();
  // the striped face (the clypeus) and the beak
  ctx.fillStyle = c.body[1]; ctx.beginPath(); ctx.ellipse(0, -70, 5.6, 6.4, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = c.line; ctx.lineWidth = 0.6;
  for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-4.6 + Math.abs(k - 2) * 0.6, -74 + k * 1.9); ctx.lineTo(4.6 - Math.abs(k - 2) * 0.6, -74 + k * 1.9); ctx.stroke(); }
  ctx.strokeStyle = legC; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(0, -64); ctx.lineTo(0, -58); ctx.stroke();
  // the great compound eyes, set wide on the sides
  const er = nym ? 5.6 : 7.4;
  [-1, 1].forEach((s) => {
    const ex = s * (nym ? 15 : 18.5), ey = -78;
    if (!shell) glow(ctx, ex, ey, er * 2.6, c.eyeGlow, c.final ? 0.55 + 0.35 * (m.bass || 0) : nym ? 0.15 : 0.3 * (o.hard || 0));
    ctx.fillStyle = shell ? "rgba(120,80,40,0.6)" : radial(ctx, ex, ey, er, [[0, c.eye[0]], [0.5, c.eye[1]], [1, c.eye[2]]], ex - s * er * 0.3, ey - er * 0.4);
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, TAU); ctx.fill();
    ctx.strokeStyle = c.line; ctx.lineWidth = 0.6; ctx.stroke();
    if (!shell) {
      // facets
      ctx.strokeStyle = "rgba(0,0,0,0.18)"; ctx.lineWidth = 0.3;
      for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(ex - er, ey + k * er * 0.38); ctx.lineTo(ex + er, ey + k * er * 0.38); ctx.stroke(); }
      ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.arc(ex - s * er * 0.35, ey - er * 0.42, er * 0.2, 0, TAU); ctx.fill();
    }
  });
  // three ocelli in a triangle between the eyes (13i's threes): faint on the
  // nymph, glowing on the final form
  [[0, -83], [-2.8, -80], [2.8, -80]].forEach(([x, y]) => {
    const on = shell ? 0 : c.final ? 0.9 + 0.1 * Math.sin(m.t * 3) : nym ? 0.15 : 0.45;
    if (on > 0.3) glow(ctx, x, y, 3.2, c.final ? "rgba(140,255,140,0.95)" : "rgba(255,120,90,0.8)", on * 0.8);
    ctx.fillStyle = c.final ? `rgba(200,255,190,${0.4 + on * 0.6})` : `rgba(255,170,150,${0.3 + on * 0.5})`;
    ctx.beginPath(); ctx.arc(x, y, 0.95, 0, TAU); ctx.fill();
  });
  // short bristle antennae
  [-1, 1].forEach((s) => {
    ctx.strokeStyle = legC; ctx.lineWidth = 0.7;
    const sw = Math.sin(m.t * 2 + s) * 1.2;
    ctx.beginPath(); ctx.moveTo(s * 6, -82); ctx.quadraticCurveTo(s * 9, -88, s * 13 + sw, -91); ctx.stroke();
  });
  ctx.restore(); // head

  // ── front legs: the digging claws, used for dancing ──
  [[-1, o.armL || 0], [1, o.armR || 0]].forEach(([s, a]) => {
    const sx = s * 13, sy = -60;
    const up = a; // 0 hanging down .. 1.6 raised high
    const fa = PI / 2 - s * (0.5 + up * 1.15); // femur direction
    const L1 = nym ? 13 : 12, L2 = nym ? 11 : 12;
    const ex = sx + Math.cos(fa) * L1 * s * s, ey = sy + Math.sin(fa) * L1;
    const ta = fa + s * lerp(0.9, -0.7, clamp(up / 1.5, 0, 1));
    const hx = ex + Math.cos(ta) * L2, hy = ey + Math.sin(ta) * L2;
    ctx.strokeStyle = legC; ctx.lineCap = "round";
    ctx.lineWidth = nym ? 5 : 3.8; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.strokeStyle = c.body[1]; ctx.lineWidth = nym ? 1.4 : 1; ctx.beginPath(); ctx.moveTo(sx, sy - 0.6); ctx.lineTo(ex, ey - 0.6); ctx.stroke();
    ctx.strokeStyle = legC; ctx.lineWidth = nym ? 3.6 : 2.6; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
    // the spines of the digging claw
    ctx.lineWidth = 0.9;
    for (let k = 0; k < (nym ? 4 : 3); k++) { const f = 0.25 + k * 0.22, px = lerp(sx, ex, f), py = lerp(sy, ey, f); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(fa + s * PI / 2) * 2.4, py + Math.sin(fa + s * PI / 2) * 2.4); ctx.stroke(); }
    [-0.5, 0, 0.5].forEach((d) => { ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + Math.cos(ta + d) * 2.6, hy + Math.sin(ta + d) * 2.6); ctx.stroke(); });
  });
  ctx.restore();
}

// what it's doing (the pose) at song second s, given the moment m
function danceAt(s, m, form) {
  const d = dipOf(m), B = m.B;
  const tier = m.drop > 0.3 ? "drop" : m.e < 0.4 ? "chill" : m.e < 0.8 ? "groove" : "hype";
  const even = Math.floor(B) % 2 === 0;
  const o = { dip: d * (0.4 + m.amp * 0.6), lean: Math.sin(B * PI * 0.5) * 0.07 * (0.5 + m.amp), head: Math.sin(B * PI * 0.5) * 0.08, mid: Math.sin(B * PI) * 0.6 };
  if (tier === "chill") { o.armL = 0.25 + Math.sin(B * PI * 0.5) * 0.2; o.armR = 0.25 - Math.sin(B * PI * 0.5) * 0.2; }
  else if (tier === "groove") { o.armL = even ? 0.3 + d * 0.9 : 0.35; o.armR = even ? 0.35 : 0.3 + d * 0.9; o.jump = 0; }
  else if (tier === "hype") { o.armL = 1.1 + Math.sin(B * PI) * 0.35; o.armR = 1.1 - Math.sin(B * PI) * 0.35; o.jump = Math.floor(B) % 2 === 0 ? Math.pow(d, 2) * 4 : 0; o.lean *= 1.6; }
  else { o.armL = 1.5; o.armR = 1.5; o.jump = Math.pow(d, 2) * 7; o.lean = Math.sin(B * PI) * 0.16; }
  // wings rubbed together on the beat (adults), pads on the beat (late nymph)
  o.rub = Math.pow(d, 3) * (form === "nymph" ? 1 : 1);
  return o;
}

// the main cicada's whole life at song second s
export function drawCicada(ctx, L, m) {
  const s = m.s || 0;
  const [cx, fy, h] = L.girl;
  const sc = h / 100;
  const X0 = cx, X1 = cx + (L.portrait ? 9 : 13), X2 = cx - (L.portrait ? 8 : 12);
  const place = (x, size, fn) => { ctx.save(); ctx.translate(x, fy); ctx.scale(sc * size, sc * size); fn(); ctx.restore(); };
  const shadow = (x, size, a = 0.5) => { ctx.save(); ctx.translate(x, fy); ctx.scale(1, 0.25); ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.beginPath(); ctx.arc(0, 0, h * 0.2 * size, 0, TAU); ctx.fill(); ctx.restore(); };
  const S_NYMPH = 0.92, S_ADULT = 1.1, S_FINAL = 1.3;
  const [m1a, m1b] = LIFE.molt1, [c1a, c1b] = LIFE.chirp1, [m2a, m2b] = LIFE.molt2, [c2a, c2b] = LIFE.chirp2, [fa, fb] = LIFE.fly;

  // the soil: a mound before it comes out, a hole after
  drawSoil(ctx, X0, fy, h, s, m);
  if (s < LIFE.emerge - 0.05) return;

  // the shells left behind
  if (s >= m1b - 2) place(X0, S_NYMPH, () => bug(ctx, { form: "nymph", shell: true, pads: 1, split: 1, armL: 0.25, armR: 0.25, head: -0.05 }, m));
  if (s >= m2b - 9) place(X1, S_ADULT, () => bug(ctx, { form: "adult", hard: 1, shell: true, wing: 1, spread: 0.1, split: 1, armL: 0.3, armR: 0.3 }, m));

  // ── the nymph ──
  if (s < m1b - 2) {
    let o;
    if (s < LIFE.emerge + 1.6) { // clawing out of the ground
      const k = clamp((s - LIFE.emerge) / 1.6, 0, 1);
      const rise = (1 - ease(k)) * 95;
      ctx.save();
      ctx.beginPath(); ctx.rect(X0 - h, fy - h * 2, h * 2, h * 2); ctx.clip();
      place(X0, S_NYMPH, () => { ctx.translate(0, rise); bug(ctx, { form: "nymph", pads: 0, armL: 1.4 - k * 0.9 + Math.sin(s * 14) * 0.25, armR: 1.3 - k * 0.8 - Math.sin(s * 14) * 0.25, head: Math.sin(s * 9) * 0.1, lean: Math.sin(s * 7) * 0.08 }, m); });
      ctx.restore();
      return;
    }
    if (s < LIFE.dance) { // looking around, cleaning its antennae
      const clean = Math.sin(s * 0.9) > 0.55;
      o = { head: Math.sin(s * 1.3) * 0.22, lean: Math.sin(s * 0.7) * 0.05, armL: clean ? 1.25 + Math.sin(s * 12) * 0.15 : 0.25, armR: 0.25 + Math.max(0, Math.sin(s * 0.6 + 2)) * 0.5, dip: 0, mid: Math.sin(s * 2) * 0.3 };
    } else o = danceAt(s, m, "nymph");
    // the wing pads grow through its life; rubbed on the beat from 1:40
    o.form = "nymph"; o.pads = clamp((s - LIFE.dance) / (m1a - LIFE.dance), 0, 1) * 0.9 + 0.1;
    o.rub = s > 100 ? o.rub : 0;
    // the molt begins: it freezes, grips, and the back splits on each stab
    if (s >= m1a) {
      const n = MOLT1_CRACKS.filter((c) => s >= c).length;
      const sinceLast = s - MOLT1_CRACKS[Math.max(0, n - 1)];
      o = { form: "nymph", pads: 1, armL: 0.15, armR: 0.15, head: -0.12, lean: Math.sin(s * 40) * 0.015 * Math.exp(-sinceLast * 3), split: n / 4, glowIn: Math.exp(-sinceLast * 2.5) };
      if (s > 178.5) o.shell = true;
    }
    shadow(X0, S_NYMPH);
    place(X0, S_NYMPH, () => bug(ctx, o, m));
    if (s > 100 && s < m1a && o.rub > 0.4) rubLines(ctx, X0, fy - h * S_NYMPH * 0.6, h * S_NYMPH * 0.25, o.rub);
  }

  // ── the adult: pulls free at 2:58.5, chirps, dances ──
  if (s >= m1b - 2 && s < m2b - 9) {
    const hard = clamp((s - c1b) / 40, 0, 1);
    const wing = clamp((s - (m1b - 1)) / 24, 0.15, 1);
    let x = X1, o;
    if (s < m1b) { // pulling out of the old shell, up and over to the side
      const k = ease(clamp((s - (m1b - 2)) / 2, 0, 1));
      x = lerp(X0, X1, k);
      o = { form: "adult", hard: 0, wing: 0.15, spread: 0, armL: 1.2 - k, armR: 1 - k * 0.8, lean: -0.2 * (1 - k), jump: (1 - k) * 22 };
    } else if (s < c1b + 0.3) { // the chirp: everything raised, abdomen buzzing
      const ch = chorusAt(s);
      o = { form: "adult", hard: 0, wing, spread: 0.55, armL: 1.3, armR: 1.3, head: -0.1, chirp: ch, lean: Math.sin(s * 3) * 0.04 };
    } else {
      o = danceAt(s, m, "adult");
      o.form = "adult"; o.hard = hard; o.wing = wing; o.spread = 0.1 + (m.drop > 0.3 ? 0.5 : 0);
    }
    // the final molt begins: still, glowing from inside, the back splitting
    if (s >= m2a) {
      const k = clamp((s - m2a) / 11, 0, 1);
      o = { form: "adult", hard: 1, wing: 1, spread: 0.1, armL: 0.2, armR: 0.2, head: -0.1, split: k, glowIn: 0.5 + 0.5 * Math.sin(s * 3.1), lean: Math.sin(s * 30) * 0.01 * k };
    }
    const size = S_ADULT;
    shadow(x, size);
    place(x, size, () => bug(ctx, o, m));
    if (o.chirp) soundRings(ctx, x, fy - h * size * 0.38, h, o.chirp, m);
    if (o.rub > 0.4 && !o.chirp && s < m2a) rubLines(ctx, x, fy - h * size * 0.62, h * size * 0.5, o.rub);
  }

  // ── the final form ──
  if (s >= m2b - 9) {
    const wing = clamp((s - (m2b - 6)) / 6, 0.2, 1);
    let x = X2, o, size = S_FINAL;
    if (s < m2b - 5) { // rising out of the shell, glowing
      const k = ease(clamp((s - (m2b - 9)) / 4, 0, 1));
      x = lerp(X1, X2, k);
      o = { form: "final", wing: 0.2, spread: 0, armL: 1.3 - k, armR: 1.1 - k, jump: (1 - k) * 26, lean: 0.2 * (1 - k) };
      glow(ctx, x, fy - h * size * 0.5, h * 0.9, "rgba(150,255,170,0.8)", 0.6 * (1 - k * 0.5));
    } else if (s < c2a) { // wings unfurling, the colour setting in
      o = { form: "final", wing, spread: 0.2 + wing * 0.35, armL: 0.4, armR: 0.4, head: Math.sin(s * 0.8) * 0.1, lean: Math.sin(s * 0.5) * 0.04 };
    } else { // the last song, then away
      const ch = chorusAt(s);
      o = { form: "final", wing: 1, spread: 0.6, armL: 1.4, armR: 1.4, chirp: ch, head: -0.12 };
    }
    let fly = 0;
    if (s >= fa) fly = clamp((s - fa) / (fb - fa), 0, 1);
    if (fly > 0) {
      // off toward the trees: up and left, smaller, wings a blur
      const k = ease(fly);
      x = lerp(X2, X2 - L.VW * 0.4, k);
      const yy = fy - Math.sin(k * PI * 0.5) * (fy - L.floorTop + 30);
      for (let tr = 1; tr <= 6; tr++) { const kk = ease(Math.max(0, fly - tr * 0.03)); glow(ctx, lerp(X2, X2 - L.VW * 0.4, kk), fy - Math.sin(kk * PI * 0.5) * (fy - L.floorTop + 30) - h * size * 0.4 * (1 - kk * 0.55), 3, "rgba(140,255,170,0.8)", 0.25 * (1 - tr / 7) * (1 - smooth(0.85, 1, fly))); }
      ctx.save(); ctx.globalAlpha *= 1 - smooth(0.86, 1, fly);
      ctx.translate(x, yy); ctx.scale(sc * size * (1 - k * 0.55), sc * size * (1 - k * 0.55)); ctx.rotate(-0.35 * k);
      for (let b = 0; b < 3; b++) { ctx.save(); ctx.globalAlpha *= b ? 0.35 : 1; bug(ctx, { ...o, spread: 0.5 + 0.5 * Math.sin(m.t * 60 + b * 2), armL: 0.3, armR: 0.3 }, m); ctx.restore(); }
      ctx.restore();
    } else {
      shadow(x, size);
      place(x, size, () => bug(ctx, o, m));
    }
    if (o.chirp) soundRings(ctx, fly ? x : x, (fly ? fy - Math.sin(ease(fly) * PI * 0.5) * (fy - L.floorTop + 30) : fy) - h * size * 0.38, h * 1.2 * (1 - ease(fly) * 0.5), o.chirp, m);
  }
}

// the soil at the middle of the floor: it bulges and cracks while the
// chorus plays, bursts at 0:08, and stays a hole for the rest of the song
function drawSoil(ctx, x, fy, h, s, m) {
  const r = h * 0.2;
  const before = clamp(s / LIFE.emerge, 0, 1);
  ctx.save(); ctx.translate(x, fy); ctx.scale(1, 0.3);
  if (s < LIFE.emerge) {
    const mr = r * (0.35 + before * 0.75);
    const hop = Math.abs(Math.sin(m.t * 26)) * (m.level || 0.4) * before;
    ctx.fillStyle = radial(ctx, 0, -mr * 0.5, mr * 1.4, [[0, "#6A4A28"], [0.6, "#3A2614"], [1, "rgba(30,20,10,0)"]]);
    ctx.beginPath(); ctx.ellipse(0, -hop * 0.6, mr * 1.3, mr * (0.9 + before * 0.6), 0, 0, TAU); ctx.fill();
    // cracks, more and longer as it pushes up, a green light leaking out
    const n = Math.floor(2 + before * 7);
    for (let k = 0; k < n; k++) {
      const a = hash(k, 31) * TAU, len = mr * (0.4 + before * 0.9) * (0.5 + hash(k, 32) * 0.5);
      ctx.strokeStyle = `rgba(170,255,140,${0.3 + before * 0.6})`; ctx.lineWidth = 0.25 + before * 0.25;
      ctx.beginPath(); ctx.moveTo(0, -hop * 0.6); ctx.lineTo(Math.cos(a) * len * 0.5, Math.sin(a) * len * 0.5 - hop * 0.6); ctx.lineTo(Math.cos(a + 0.3) * len, Math.sin(a + 0.3) * len - hop * 0.6); ctx.stroke();
    }
    glow(ctx, 0, 0, mr * 2.2, "rgba(140,255,120,0.8)", before * 0.35 + chorusAt(s) * 0.1);
    // clods jumping with the buzz
    for (let k = 0; k < 6; k++) {
      const ph = (m.t * (2.3 + hash(k, 33)) + hash(k, 34)) % 1;
      ctx.fillStyle = "#4A3018"; ctx.beginPath(); ctx.arc((hash(k, 35) - 0.5) * mr * 2, -Math.sin(ph * PI) * mr * 1.4 * before * chorusAt(s), 0.35, 0, TAU); ctx.fill();
    }
  } else {
    // the hole and its ring of thrown dirt
    ctx.fillStyle = radial(ctx, 0, 0, r * 1.6, [[0, "#020100"], [0.45, "#0A0602"], [0.6, "#5A3C1E"], [0.85, "#3A2612"], [1, "rgba(30,20,10,0)"]]);
    ctx.beginPath(); ctx.ellipse(0, 0, r * 1.6, r * 1.3, 0, 0, TAU); ctx.fill();
    glow(ctx, 0, 0, r * 1.2, "rgba(140,255,120,0.8)", 0.12 + (m.bass || 0) * 0.08);
  }
  ctx.restore();
  // the burst of dirt at 0:08
  const since = s - LIFE.emerge;
  if (since >= 0 && since < 1.6) {
    for (let k = 0; k < 26; k++) {
      const a = -PI / 2 + (hash(k, 41) - 0.5) * 2.4, v = 9 + hash(k, 42) * 14;
      const px = x + Math.cos(a) * v * since, py = fy + Math.sin(a) * v * since + 18 * since * since;
      if (py > fy + 1) continue;
      ctx.fillStyle = k % 3 ? "#5A3C1E" : "#8A6236";
      ctx.globalAlpha = 1 - since / 1.6;
      ctx.beginPath(); ctx.arc(px, py, 0.3 + hash(k, 43) * 0.5, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    glow(ctx, x, fy - 2, h * 0.5, "rgba(170,255,150,0.9)", (1 - since / 1.6) * 0.6);
  }
}

// the chirp: rings of sound thrown out from its body
function soundRings(ctx, x, y, h, k, m) {
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const ph = ((m.t * 2.2 + i / 4) % 1);
    ctx.strokeStyle = `rgba(190,255,160,${k * 0.45 * (1 - ph)})`; ctx.lineWidth = 0.35 + (1 - ph) * 0.5;
    ctx.beginPath(); ctx.ellipse(x, y, ph * h * 1.6, ph * h * 1.1, 0, 0, TAU); ctx.stroke();
  }
  glow(ctx, x, y, h * 0.6, "rgba(170,255,140,0.9)", k * 0.35);
  ctx.restore();
}
// rubbing its wings on the beat: little arcs of sound off each side
function rubLines(ctx, x, y, r, k) {
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = `rgba(200,255,170,${k * 0.6})`; ctx.lineWidth = 0.3;
  [-1, 1].forEach((s) => {
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x + s * r * 0.6, y, r * (0.7 + i * 0.35) * (1.2 - k * 0.2), s > 0 ? -0.5 : PI - 0.5, s > 0 ? 0.5 : PI + 0.5); ctx.stroke(); }
  });
  ctx.restore();
}

// ─────────────── the swarm: little cicadas on the speakers and the wall ───────────────
const WAVES = [26, 58, 92, 124, 150, 196, 232, 266, 300, 334, 362];
const FLY_IN = 3.2, SIT = 9, MOLT = 3, DRY = 2.5, FLY_OUT = 3.5, SHELL_STAY = 8;
function spotsFor(L) {
  const xs = L.portrait ? [L.cx - 41, L.cx + 41] : [L.cx - 60, L.cx + 60];
  const hSub = L.portrait ? 12 : 13.5, hTop = L.portrait ? 10 : 11.5;
  const ySub = L.floorTop - hSub, yTop = ySub - hTop - 0.4;
  const out = [];
  xs.forEach((sx) => { out.push([sx - 3.4, yTop + 2.2, 0.3], [sx + 3.6, yTop + 7.4, -0.4], [sx - 2.6, ySub + 2.4, 0.5], [sx + 4, ySub + 9.5, -0.2], [sx + 0.5, yTop - 0.3, 1.57]); });
  const { x, y, w, h } = L.wall;
  out.push([x - 0.4, y + h * 0.25, 1.4], [x - 0.4, y + h * 0.7, 1.7], [x + w + 0.4, y + h * 0.35, -1.4], [x + w + 0.4, y + h * 0.8, -1.6], [x + w * 0.2, y - 0.4, 0], [x + w * 0.8, y - 0.4, 3.1]);
  return out;
}
function tiny(ctx, x, y, a, size, col, wings, flap) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(size, size);
  // wings (folded over the back, or a blur in flight)
  if (wings) {
    ctx.fillStyle = "rgba(220,255,230,0.35)"; ctx.strokeStyle = "rgba(200,230,160,0.5)"; ctx.lineWidth = 0.06;
    [-1, 1].forEach((s) => {
      ctx.save(); ctx.rotate(s * (0.18 + flap * 0.9));
      ctx.beginPath(); ctx.ellipse(0, 0.95, 0.38, 1.25, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.restore();
    });
  }
  ctx.fillStyle = col.body; ctx.beginPath(); ctx.ellipse(0, 0.3, 0.45, 1.05, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = col.head; ctx.beginPath(); ctx.ellipse(0, -0.75, 0.55, 0.32, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = col.eye; [-1, 1].forEach((s) => { ctx.beginPath(); ctx.arc(s * 0.55, -0.78, 0.22, 0, TAU); ctx.fill(); });
  ctx.strokeStyle = "rgba(190,255,160,0.35)"; ctx.lineWidth = 0.08; ctx.beginPath(); ctx.ellipse(0, 0.3, 0.45, 1.05, 0, 0, TAU); ctx.stroke();
  ctx.restore();
  glow(ctx, x, y, size * 1.6, "rgba(160,255,140,0.6)", 0.18);
}
export function drawSwarm(ctx, L, m) {
  const s = m.s || 0;
  const spots = spotsFor(L);
  const size = L.portrait ? 2.2 : 2.6;
  const trees = [[6, L.floorTop - 30], [16, L.floorTop - 40], [L.VW - 14, L.floorTop - 36], [L.VW - 5, L.floorTop - 26]];
  WAVES.forEach((w0, wi) => {
    for (let k = 0; k < 4; k++) {
      const t0 = w0 + k * 1.7 + hash(wi, k, 1) * 1.2;
      const life = s - t0;
      const total = FLY_IN + SIT + MOLT + DRY + FLY_OUT;
      if (life < 0 || life > total + SHELL_STAY + 2) continue;
      const sp = spots[Math.floor(hash(wi, k, 2) * spots.length)];
      const home = trees[Math.floor(hash(wi, k, 3) * trees.length)], away = trees[Math.floor(hash(wi, k, 4) * trees.length)];
      const [lx, ly, la] = sp;
      const oldC = { body: "#4A3A1E", head: "#3A2A14", eye: "#B03020" };
      const newC = (dry) => ({ body: dry < 1 ? `rgb(${Math.round(lerp(210, 60, dry))},${Math.round(lerp(250, 130, dry))},${Math.round(lerp(210, 50, dry))})` : "#3C8232", head: dry < 1 ? `rgb(${Math.round(lerp(200, 20, dry))},${Math.round(lerp(240, 40, dry))},${Math.round(lerp(200, 20, dry))})` : "#142414", eye: "#E03A28" });
      // the shell it leaves, from the molt until a while after it's gone
      const tm = FLY_IN + SIT;
      if (life > tm + MOLT * 0.6) {
        const fade = 1 - smooth(total + SHELL_STAY, total + SHELL_STAY + 2, life);
        ctx.save(); ctx.globalAlpha *= 0.8 * fade; tiny(ctx, lx, ly, la, size, { body: "#7A5228", head: "#6A4620", eye: "#5A3A18" }, false, 0); ctx.restore();
      }
      if (life < FLY_IN) { // flying in from the trees
        const k2 = ease(life / FLY_IN);
        const x = lerp(home[0], lx, k2) + Math.sin(life * 5) * 1.5 * (1 - k2), y = lerp(home[1], ly, k2) - Math.sin(k2 * PI) * 8;
        tiny(ctx, x, y, la * k2 + (lx > home[0] ? 1.2 : -1.2) * (1 - k2), size * (0.7 + 0.3 * k2), oldC, true, 0.6 + 0.4 * Math.sin(m.t * 80 + k));
      } else if (life < tm) { // sitting, wings twitching on the beat
        tiny(ctx, lx, ly, la, size, oldC, true, Math.pow(dipOf(m), 6) * 0.25);
      } else if (life < tm + MOLT) { // the new body sliding up out of the old
        const k2 = (life - tm) / MOLT;
        tiny(ctx, lx, ly, la, size, oldC, true, 0);
        ctx.save(); ctx.globalAlpha *= k2;
        tiny(ctx, lx + Math.sin(la) * k2 * 1.2, ly - Math.cos(la) * k2 * 1.2, la, size, newC(0), k2 > 0.6, 0);
        ctx.restore();
      } else if (life < tm + MOLT + DRY) { // drying, going green
        const k2 = (life - tm - MOLT) / DRY;
        tiny(ctx, lx + Math.sin(la) * 1.2, ly - Math.cos(la) * 1.2, la, size, newC(k2), true, Math.pow(dipOf(m), 6) * 0.2);
      } else if (life < total) { // back to the trees, getting smaller, gone
        const k2 = ease((life - tm - MOLT - DRY) / FLY_OUT);
        const x = lerp(lx + Math.sin(la) * 1.2, away[0], k2), y = lerp(ly - Math.cos(la) * 1.2, away[1], k2) - Math.sin(k2 * PI) * 10;
        ctx.save(); ctx.globalAlpha *= 1 - smooth(0.7, 1, k2);
        tiny(ctx, x, y, (away[0] > lx ? 1.2 : -1.2) * k2 + la * (1 - k2), size * (1 - k2 * 0.6), newC(1), true, 0.6 + 0.4 * Math.sin(m.t * 80 + k));
        ctx.restore();
      }
    }
  });
}

// ─────────────── park ranger hats ───────────────
// a campaign hat: a wide flat brim, a crown pinched into four dents, a band
// with a little gold badge. Drawn centred on the brim at x,y, w wide.
export function rangerHat(ctx, x, y, w, tilt = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt);
  const bw = w / 2, bh = w * 0.09, cw = w * 0.3, ch = w * 0.34;
  // back of the brim
  ctx.fillStyle = "#6E5230"; ctx.beginPath(); ctx.ellipse(0, 0, bw, bh, 0, PI, TAU); ctx.fill();
  // the crown, with the Montana pinch
  const cr = new Path2D();
  cr.moveTo(-cw, -bh * 0.2);
  cr.quadraticCurveTo(-cw * 0.96, -ch * 0.7, -cw * 0.45, -ch * 0.92);
  cr.lineTo(-cw * 0.12, -ch * 0.78); cr.lineTo(0, -ch * 1.02); cr.lineTo(cw * 0.12, -ch * 0.78);
  cr.lineTo(cw * 0.45, -ch * 0.92);
  cr.quadraticCurveTo(cw * 0.96, -ch * 0.7, cw, -bh * 0.2); cr.closePath();
  ctx.fillStyle = linear(ctx, -cw, 0, cw, 0, [[0, "#7A5A32"], [0.35, "#C9A266"], [0.6, "#B08A52"], [1, "#6A4C28"]]); ctx.fill(cr);
  ctx.strokeStyle = "#3A2810"; ctx.lineWidth = w * 0.012; ctx.stroke(cr);
  // the dents' creases
  ctx.strokeStyle = "rgba(60,40,16,0.6)"; ctx.lineWidth = w * 0.01;
  [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(s * cw * 0.45, -ch * 0.92); ctx.lineTo(s * cw * 0.3, -ch * 0.45); ctx.stroke(); });
  // band and badge
  ctx.fillStyle = "#3E2A12"; ctx.beginPath(); ctx.moveTo(-cw * 0.99, -bh * 0.3); ctx.lineTo(cw * 0.99, -bh * 0.3); ctx.lineTo(cw * 0.97, -ch * 0.22); ctx.lineTo(-cw * 0.97, -ch * 0.22); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#E9C25A"; ctx.beginPath();
  const bx = 0, by = -ch * 0.14, br = w * 0.04;
  ctx.moveTo(bx, by - br); ctx.lineTo(bx + br, by - br * 0.4); ctx.lineTo(bx + br * 0.7, by + br); ctx.lineTo(bx - br * 0.7, by + br); ctx.lineTo(bx - br, by - br * 0.4); ctx.closePath(); ctx.fill();
  // front of the brim
  ctx.fillStyle = linear(ctx, 0, -bh, 0, bh, [[0, "#C29A5E"], [1, "#6A4C28"]]);
  ctx.beginPath(); ctx.ellipse(0, 0, bw, bh, 0, 0, PI); ctx.lineTo(-bw, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#3A2810"; ctx.lineWidth = w * 0.012; ctx.beginPath(); ctx.ellipse(0, 0, bw, bh, 0, 0, TAU); ctx.stroke();
  ctx.restore();
}

// ─────────────── the DJ's lantern (booth units) ───────────────
export function lantern(ctx, m) {
  const x = 46, y = -3.4;
  const fl = 0.75 + 0.25 * Math.sin(m.t * 9) * Math.sin(m.t * 3.3);
  glow(ctx, x, y - 3, 9, "rgba(255,190,90,0.9)", 0.45 * fl);
  ctx.fillStyle = "#2A2A20"; ctx.fillRect(x - 1.8, y - 0.6, 3.6, 0.6); ctx.fillRect(x - 1.4, y - 6.4, 2.8, 0.6);
  ctx.fillStyle = `rgba(255,${200 + fl * 40},120,${0.75 * fl})`; ctx.fillRect(x - 1.3, y - 5.8, 2.6, 5.2);
  ctx.strokeStyle = "#2A2A20"; ctx.lineWidth = 0.3; ctx.strokeRect(x - 1.3, y - 5.8, 2.6, 5.2);
  ctx.beginPath(); ctx.moveTo(x, y - 5.8); ctx.lineTo(x, y - 0.6); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y - 7.2, 1.1, PI, TAU); ctx.stroke();
}

// ─────────────── the screen show: 13 YEARS UNDERGROUND ───────────────
// (periodical cicadas really do come up on 13- and 17-year cycles)
export function cicadaShow(ctx, L, m) {
  const { x, y, w, h } = L.wall;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = linear(ctx, 0, y, 0, y + h, [[0, "#06140C"], [0.65, "#0E2414"], [1, "#2A1A0A"]]); ctx.fillRect(x, y, w, h);
  // the soil line, and a nymph's tunnel climbing toward it
  const gy = y + h * 0.72;
  ctx.fillStyle = "#1E1208"; ctx.fillRect(x, gy, w, y + h - gy);
  ctx.strokeStyle = "rgba(170,255,140,0.5)"; ctx.lineWidth = 0.35; ctx.setLineDash([0.8, 0.8]);
  ctx.beginPath(); ctx.moveTo(x + w * 0.12, y + h); ctx.quadraticCurveTo(x + w * 0.2, gy + h * 0.06, x + w * 0.16, gy); ctx.stroke(); ctx.setLineDash([]);
  // a big cicada in the middle, wings beating on the beat
  const d = dipOf(m);
  glow(ctx, x + w * 0.5, y + h * 0.45, h * 0.5, "rgba(150,255,140,0.8)", 0.35 + d * 0.2);
  ctx.save(); ctx.translate(x + w * 0.5, y + h * 0.72); const k = h / 100 * 0.42; ctx.scale(k, k);
  bug(ctx, { form: "adult", hard: 0.35, wing: 1, spread: 0.45 + d * 0.3, armL: 0.9 + d * 0.4, armR: 0.9 + d * 0.4, dip: d * 0.5, rub: d }, m);
  ctx.restore();
  // the words, letters bobbing on the beat
  const text = "13 YEARS UNDERGROUND";
  const fs = h * 0.15;
  ctx.font = `900 ${fs}px Impact, "Arial Black", system-ui, sans-serif`; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
  const tw = ctx.measureText(text).width, scale = Math.min(1, (w * 0.9) / tw);
  ctx.save(); ctx.translate(x + w / 2, y + h * 0.22); ctx.scale(scale, scale);
  let cx = -tw / 2;
  for (let i = 0; i < text.length; i++) {
    const chr = text[i], cw = ctx.measureText(chr).width;
    if (chr !== " ") {
      const bob = -Math.max(0, Math.sin((m.B - i * 0.12) * PI)) * fs * 0.1;
      ctx.fillStyle = "#0A1A0A"; ctx.fillText(chr, cx + fs * 0.04, bob + fs * 0.04);
      ctx.fillStyle = linear(ctx, 0, -fs * 0.8, 0, 0, [[0, "#D8FF9A"], [0.5, "#7CC25A"], [1, "#3E6E2A"]]);
      ctx.fillText(chr, cx, bob);
    }
    cx += cw;
  }
  ctx.restore();
  ctx.font = `600 ${h * 0.07}px ui-monospace, Menlo, monospace`; ctx.textAlign = "center"; ctx.fillStyle = "rgba(233,210,154,0.85)";
  ctx.fillText("BROOD 13i  ·  NOW EMERGING", x + w / 2, y + h * 0.92);
  ctx.textAlign = "left";
}
