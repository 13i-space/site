// The LED wall (Update 5.70): a curved screen. Its picture is drawn flat into
// an offscreen canvas, then laid onto the curve in thin vertical strips (the
// ends bow outward, as a screen curving toward you does), inside a bezel with
// an underside you can see, a glass sheen, rigging from the truss and legs
// behind the booth. One of its shows is the real 13i i, its core throwing
// rings like the logo on the launch page.
import { TAU, lerp, glow, hsl, linear } from "./draw";
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
  // the LED grid
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  for (let gx = x; gx < x + w; gx += 0.9) ctx.fillRect(gx, y, 0.22, h);
  for (let gy = y; gy < y + h; gy += 0.9) ctx.fillRect(x, gy, w, 0.22);
}
