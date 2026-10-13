// The LED wall (Update 5.70): a curved screen. Its picture is drawn flat into
// an offscreen canvas, then laid onto the curve in thin vertical strips (the
// ends bow outward, as a screen curving toward you does), inside a bezel with
// an underside you can see, a glass sheen, rigging from the truss and legs
// behind the booth. One of its shows is the real 13i i, its core throwing
// rings like the logo on the launch page.
import { cicadaShow } from "./cicada";
import { TAU, lerp, glow, hsl, linear, hash } from "./draw";
import { drawI } from "./glyph";

const PI = Math.PI;
const dipOf = (m) => 0.5 + 0.5 * Math.cos(m.ph * TAU);
const BOW = 0.13; // how far the ends of the screen bow out
const STRIPS = 44;
let off = null;

// the curve: where strip u (0..1) sits, and how tall it looks
function curve(L, u) {
  const { x, y, w, h } = L.wall;
  const k = 2 * u - 1;
  const hs = 1 + BOW * k * k;
  return { x: x + w / 2 + k * (w / 2) * (1 + 0.04 * k * k), top: y + h / 2 - (h / 2) * hs, bot: y + h / 2 + (h / 2) * hs };
}

export function drawWall(ctx, L, m, bins, info, ppu) {
  const { x, y, w, h } = L.wall;
  if (typeof document === "undefined") return;
  // ── the picture, flat ──
  const pw = Math.max(64, Math.round(w * ppu)), ph = Math.max(32, Math.round(h * ppu));
  if (!off) off = document.createElement("canvas");
  if (off.width !== pw || off.height !== ph) { off.width = pw; off.height = ph; }
  const c = off.getContext("2d");
  c.setTransform(pw / w, 0, 0, ph / h, -x * (pw / w), -y * (ph / h));
  c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
  drawPicture(c, L, m, bins, info);

  // ── behind it: rigging and legs ──
  const left = curve(L, 0), right = curve(L, 1);
  ctx.strokeStyle = "#1A1830"; ctx.lineWidth = 0.35;
  [x + w * 0.2, x + w * 0.8].forEach((rx) => { ctx.beginPath(); ctx.moveTo(rx, L.truss + 2.6); ctx.lineTo(rx, y - 1); ctx.stroke(); });
  ctx.fillStyle = "#0C0B18";
  [x + w * 0.3, x + w * 0.7].forEach((lx) => ctx.fillRect(lx - 0.9, y + h, 1.8, L.floorTop - (y + h)));
  // the shell, a little bigger than the screen, so its thickness shows
  ctx.fillStyle = "#08070F";
  ctx.beginPath();
  for (let i = 0; i <= STRIPS; i++) { const p = curve(L, i / STRIPS); i ? ctx.lineTo(p.x, p.top - 2.2) : ctx.moveTo(p.x - 1.5, p.top - 2.2); }
  ctx.lineTo(right.x + 1.5, right.top - 2.2); ctx.lineTo(right.x + 1.5, right.bot + 3.4);
  for (let i = STRIPS; i >= 0; i--) { const p = curve(L, i / STRIPS); ctx.lineTo(p.x, p.bot + 3.4); }
  ctx.lineTo(left.x - 1.5, left.bot + 3.4); ctx.closePath(); ctx.fill();

  // ── the picture on the curve ──
  for (let i = 0; i < STRIPS; i++) {
    const a = curve(L, i / STRIPS), b = curve(L, (i + 1) / STRIPS);
    const sx = (i / STRIPS) * pw, sw = pw / STRIPS;
    // a strip is a trapezoid; draw it as a rectangle the height of its middle
    const top = (a.top + b.top) / 2, bot = (a.bot + b.bot) / 2;
    ctx.drawImage(off, sx, 0, sw, ph, a.x, top, b.x - a.x + 0.25, bot - top);
  }
  // shading: the ends, turned toward you, catch more light; a glass sheen across
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i <= STRIPS; i++) { const p = curve(L, i / STRIPS); i ? ctx.lineTo(p.x, p.top) : ctx.moveTo(p.x, p.top); }
  for (let i = STRIPS; i >= 0; i--) { const p = curve(L, i / STRIPS); ctx.lineTo(p.x, p.bot); }
  ctx.closePath(); ctx.clip();
  ctx.fillStyle = linear(ctx, x, 0, x + w, 0, [[0, "rgba(255,255,255,0.06)"], [0.25, "rgba(0,0,0,0.12)"], [0.5, "rgba(0,0,0,0.18)"], [0.75, "rgba(0,0,0,0.12)"], [1, "rgba(255,255,255,0.06)"]]);
  ctx.fillRect(x - 2, y - 8, w + 4, h + 16);
  ctx.globalCompositeOperation = "lighter";
  const sweep = ((m.t * 0.05) % 1.6) - 0.3;
  ctx.fillStyle = linear(ctx, x + w * (sweep - 0.15), y, x + w * (sweep + 0.05), y + h, [[0, "rgba(255,255,255,0)"], [0.5, "rgba(255,255,255,0.05)"], [1, "rgba(255,255,255,0)"]]);
  ctx.fillRect(x - 2, y - 8, w + 4, h + 16);
  ctx.restore();
  // ── the bezel, top and bottom, and the underside you see from the floor ──
  const band = (edge, off0, off1, fill) => {
    ctx.beginPath();
    for (let i = 0; i <= STRIPS; i++) { const p = curve(L, i / STRIPS); const yy = p[edge] + off0; i ? ctx.lineTo(p.x, yy) : ctx.moveTo(p.x, yy); }
    for (let i = STRIPS; i >= 0; i--) { const p = curve(L, i / STRIPS); ctx.lineTo(p.x, p[edge] + off1); }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  };
  band("top", -1.6, 0, linear(ctx, 0, y - 2, 0, y, [[0, "#2C2A4C"], [1, "#12101E"]]));
  band("bot", 0, 1.4, linear(ctx, 0, y + h, 0, y + h + 2, [[0, "#1A1830"], [1, "#2E2C50"]]));
  band("bot", 1.4, 3.4, linear(ctx, 0, y + h + 1, 0, y + h + 4, [[0, "#14122A"], [1, "#05040A"]]));
  // a light strip along the bezel, chasing
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < STRIPS; i += 1) {
    const p = curve(L, (i + 0.5) / STRIPS);
    const on = 0.2 + 0.8 * Math.max(0, Math.cos((i / STRIPS * 4 - m.B * 0.5) * PI));
    ctx.fillStyle = hsl(i % 2 ? m.pal.a : m.pal.b, 100, 65, on * 0.8);
    ctx.fillRect(p.x - 0.5, p.bot + 0.55, 1, 0.3);
    ctx.fillRect(p.x - 0.5, p.top - 0.85, 1, 0.3);
  }
  ctx.restore();
  // side caps
  [[left, -1], [right, 1]].forEach(([p, s]) => {
    ctx.fillStyle = linear(ctx, p.x, 0, p.x + s * 1.6, 0, [[0, "#22203C"], [1, "#0A0914"]]);
    ctx.beginPath(); ctx.moveTo(p.x, p.top - 1.6); ctx.lineTo(p.x + s * 1.6, p.top - 1.2); ctx.lineTo(p.x + s * 1.6, p.bot + 2.8); ctx.lineTo(p.x, p.bot + 3.4); ctx.closePath(); ctx.fill();
  });
  // its glow on everything around
  glow(ctx, x + w / 2, y + h / 2, w * 0.7, hsl(m.pal.a, 80, 50, 0.4), 0.3 + m.level * 0.4);
}

// the screen's shows, drawn flat in scene units
function drawPicture(ctx, L, m, bins, info) {
  const { x, y, w, h } = L.wall;
  ctx.fillStyle = "#05030A"; ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = "lighter";
  const cx = x + w / 2, cy = y + h / 2;
  const SHOWS = [0, 2, 1, 3, 2]; // spectrum, the i, tunnel, scope, the i
  const mode = info.title ? -1 : (info.forceI ? 2 : SHOWS[(((Math.floor(m.B / 32)) % SHOWS.length) + SHOWS.length) % SHOWS.length]);
  // on the Halloween remix, now and then: TRICK OR TREAT (16 beats in every 80)
  if (m.halloween && !info.title && (((Math.floor(m.B / 16)) % 5) + 5) % 5 === 2) { trickOrTreat(ctx, L, m); return grid(ctx, x, y, w, h); }
  // on the cicada remix: 13 YEARS UNDERGROUND (16 beats in every 80; Update 5.82)
  if (m.cicada && !info.title && (((Math.floor(m.B / 16)) % 5) + 5) % 5 === 2) { cicadaShow(ctx, L, m); return grid(ctx, x, y, w, h); }
  if (mode === 0 || mode === -1) {
    const N = 32;
    for (let i = 0; i < N; i++) {
      const k = bins ? Math.floor(Math.pow(i / N, 1.7) * bins.length * 0.6) + 1 : 0;
      const v = bins ? bins[k] / 255 : 0.15 + 0.1 * Math.sin(m.t * 2 + i);
      const bh = v * h * 0.48 * (mode === -1 ? 0.5 : 1);
      const bw = w / (N * 2) * 0.7;
      ctx.fillStyle = hsl(lerp(m.pal.a, m.pal.b, i / N), 100, 60, 0.9);
      [cx + (i + 0.5) * (w / (N * 2)), cx - (i + 0.5) * (w / (N * 2))].forEach((bx) => ctx.fillRect(bx - bw / 2, cy - bh, bw, bh * 2));
    }
  } else if (mode === 1) {
    for (let r = 0; r < 9; r++) {
      const k = ((r + m.B) % 9) / 9;
      const rad = Math.pow(k, 1.6) * w * 0.7;
      ctx.strokeStyle = hsl(r % 2 ? m.pal.a : m.pal.b, 100, 60, (1 - k) * 0.9);
      ctx.lineWidth = 0.4 + k * 1.6;
      ctx.beginPath();
      for (let s = 0; s <= 6; s++) { const a = (s / 6) * TAU + m.B * 0.1; const px = cx + Math.cos(a) * rad, py = cy + Math.sin(a) * rad * 0.62; s ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.stroke();
    }
  } else if (mode === 2) {
    // the 13i i, one either side of the DJ: rays turning behind, rings thrown
    // from each core on the beat, and a wave out from the middle on the bar
    const ih = h * 0.86;
    const ey = y + h * 0.07 + ih * 0.245;
    const k = ((m.B % 4) + 4) % 4 / 4;
    ctx.strokeStyle = hsl(m.pal.b, 100, 70, (1 - k) * 0.6); ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(cx, cy, k * w * 0.6, 0, TAU); ctx.stroke();
    [cx - w * 0.29, cx + w * 0.29].forEach((ix, n) => {
      glow(ctx, ix, ey, h * 0.7, hsl(n ? m.pal.b : m.pal.a, 90, 45, 0.6), 0.25 + m.level * 0.3);
      ctx.globalCompositeOperation = "source-over";
      drawI(ctx, ix, ey, ih, m, { rings: true, rays: true, ringReach: 0.75, ringColor: (a) => `rgba(170,215,255,${a * 0.75})`, rayColor: hsl(m.pal.b, 90, 70, 0.14) });
      ctx.globalCompositeOperation = "lighter";
      glow(ctx, ix, ey, h * 0.4, "rgba(140,190,255,0.5)", dipOf(m) * 0.35 * m.amp);
    });
  } else {
    for (let line = 0; line < 3; line++) {
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const v = bins ? bins[2 + i * 3] / 255 : 0.2;
        const px = x + (i / 64) * w, py = cy + (line - 1) * h * 0.22 + Math.sin(i * 0.6 + m.B * PI + line) * v * h * 0.2;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.strokeStyle = hsl(line === 1 ? m.pal.a : m.pal.b, 100, 65, 0.8); ctx.lineWidth = 0.7; ctx.stroke();
    }
  }
  if (info.title) {
    ctx.globalCompositeOperation = "source-over";
    ctx.textAlign = "center";
    ctx.font = `600 ${h * 0.07}px ui-monospace, Menlo, monospace`; ctx.fillStyle = hsl(m.pal.b, 90, 75, info.a);
    ctx.fillText("NOW PLAYING", cx, y + h * 0.3);
    ctx.font = `700 ${Math.min(h * 0.16, (w * 1.6) / Math.max(8, info.title.length))}px system-ui, sans-serif`; ctx.fillStyle = `rgba(255,255,255,${info.a})`;
    ctx.fillText(info.title, cx, y + h * 0.56);
    if (info.sub) { ctx.font = `500 ${h * 0.065}px ui-monospace, Menlo, monospace`; ctx.fillStyle = hsl(m.pal.a, 80, 75, info.a * 0.9); ctx.fillText(info.sub, cx, y + h * 0.72); }
  }
  grid(ctx, x, y, w, h);
}
// the LED grid
function grid(ctx, x, y, w, h) {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  for (let gx = x; gx < x + w; gx += 0.9) ctx.fillRect(gx, y, 0.22, h);
  for (let gy = y; gy < y + h; gy += 0.9) ctx.fillRect(x, gy, w, 0.22);
}

// TRICK OR TREAT: dripping, wobbling letters, a harvest moon, bats crossing,
// jack-o'-lanterns grinning in the corners
function trickOrTreat(ctx, L, m) {
  const { x, y, w, h } = L.wall;
  const d = dipOf(m);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = linear(ctx, 0, y, 0, y + h, [[0, "#1A0626"], [1, "#2A0A08"]]); ctx.fillRect(x, y, w, h);
  // the moon
  const mx = x + w * 0.84, my = y + h * 0.26;
  glow(ctx, mx, my, h * 0.45, "rgba(255,150,50,0.7)", 0.6);
  ctx.fillStyle = "#FFB050"; ctx.beginPath(); ctx.arc(mx, my, h * 0.16, 0, TAU); ctx.fill();
  ctx.fillStyle = "rgba(200,110,30,0.6)"; ctx.beginPath(); ctx.arc(mx - h * 0.04, my - h * 0.03, h * 0.035, 0, TAU); ctx.arc(mx + h * 0.05, my + h * 0.05, h * 0.025, 0, TAU); ctx.fill();
  // bats across it
  for (let k = 0; k < 5; k++) {
    const bx = x + (((m.t * (5 + k * 1.3) + k * 23) % (w + 20)) - 10), by = y + h * (0.12 + 0.08 * k) + Math.sin(m.t * 2 + k) * 1.2;
    const fl = Math.sin(m.t * 12 + k * 2);
    ctx.fillStyle = "#050208"; ctx.beginPath(); ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(bx - 1.4, by - 1.6 * fl, bx - 3, by - 0.6 * fl); ctx.quadraticCurveTo(bx - 1.6, by + 0.2, bx, by + 0.8);
    ctx.quadraticCurveTo(bx + 1.6, by + 0.2, bx + 3, by - 0.6 * fl); ctx.quadraticCurveTo(bx + 1.4, by - 1.6 * fl, bx, by); ctx.fill();
  }
  // the words, each letter bobbing on the beat, slime dripping off them
  const text = "TRICK OR TREAT";
  const fs = h * 0.24;
  ctx.font = `900 ${fs}px Impact, "Arial Black", system-ui, sans-serif`; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
  const tw = ctx.measureText(text).width, scale = Math.min(1, (w * 0.86) / tw);
  ctx.save(); ctx.translate(x + w / 2, y + h * 0.5); ctx.scale(scale, scale);
  let cx = -tw / 2;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], cw = ctx.measureText(ch).width;
    if (ch !== " ") {
      const bob = -Math.max(0, Math.sin((m.B - i * 0.15) * PI)) * fs * 0.12;
      const rot = Math.sin(m.B * PI * 0.5 + i) * 0.06;
      ctx.save(); ctx.translate(cx + cw / 2, bob); ctx.rotate(rot);
      ctx.fillStyle = "#3A0A5A"; ctx.fillText(ch, -cw / 2 + fs * 0.05, fs * 0.05);
      ctx.fillStyle = linear(ctx, 0, -fs * 0.8, 0, 0, [[0, "#FFD060"], [0.5, "#FF8A1E"], [1, "#C84A08"]]);
      ctx.fillText(ch, -cw / 2, 0);
      // drips, growing then falling off, a few per letter
      for (let k = 0; k < 2; k++) {
        if (hash(i, k, 5) < 0.35) continue;
        const ph = ((m.t * (0.35 + hash(i, k, 6) * 0.3) + hash(i, k, 7)) % 1);
        const dx = (hash(i, k, 8) - 0.5) * cw * 0.6, len = ph * fs * 0.45;
        ctx.fillStyle = "#7AE04A";
        ctx.fillRect(dx - fs * 0.025, -fs * 0.02, fs * 0.05, len);
        ctx.beginPath(); ctx.arc(dx, len, fs * 0.045, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    cx += cw;
  }
  ctx.restore();
  ctx.globalCompositeOperation = "lighter";
  glow(ctx, x + w / 2, y + h * 0.42, w * 0.5, "rgba(255,120,30,0.6)", 0.25 + d * 0.35);
  ctx.globalCompositeOperation = "source-over";
  // jack-o'-lanterns grinning in the bottom corners
  [[x + w * 0.08, -1], [x + w * 0.92, 1]].forEach(([px], n) => {
    const py = y + h * 0.82, r = h * 0.13, fl = 0.6 + 0.4 * Math.max(0, Math.sin(m.t * 11 + n * 2));
    ctx.fillStyle = "#E8761E"; ctx.beginPath(); ctx.ellipse(px, py, r * 1.15, r, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#3A5A1A"; ctx.fillRect(px - r * 0.1, py - r * 1.25, r * 0.2, r * 0.35);
    ctx.fillStyle = `rgba(255,${210 + fl * 40},80,${fl})`;
    [-1, 1].forEach((s) => { ctx.beginPath(); ctx.moveTo(px + s * r * 0.45, py - r * 0.45); ctx.lineTo(px + s * r * 0.15, py - r * 0.05); ctx.lineTo(px + s * r * 0.75, py - r * 0.05); ctx.closePath(); ctx.fill(); });
    ctx.beginPath(); ctx.moveTo(px - r * 0.7, py + r * 0.2); for (let k = 0; k <= 6; k++) ctx.lineTo(px - r * 0.7 + k * r * 0.233, py + r * (k % 2 ? 0.2 : 0.5)); ctx.quadraticCurveTo(px, py + r * 0.8, px - r * 0.7, py + r * 0.2); ctx.closePath(); ctx.fill();
  });
}
