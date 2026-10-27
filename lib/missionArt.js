// Mission Control's drawn previews (Update 6.24): what a monitor shows before
// a real still of its stream is known, and the 13i standby screen a screen
// falls back to when its stream drops. Plain canvas, no libraries.

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function earthData(seed) {
  const r = rng(seed);
  const stars = Array.from({ length: 70 }, () => [r(), r() * 0.6, 0.2 + r() * 0.7]);
  const land = Array.from({ length: 11 }, () => {
    const u = r() * 3, v = 0.15 + r() * 0.85;
    return Array.from({ length: 6 }, () => ({ u: u + (r() - 0.5) * 0.16, v: Math.min(1, Math.max(0.02, v + (r() - 0.5) * 0.14)), rx: 0.03 + r() * 0.06, ry: 0.015 + r() * 0.035, a: 0.55 + r() * 0.35 }));
  }).flat();
  const clouds = Array.from({ length: 70 }, () => ({ u: r() * 3, v: r(), rx: 0.02 + r() * 0.07, ry: 0.006 + r() * 0.02, a: 0.35 + r() * 0.5 }));
  return { stars, land, clouds };
}
const DATA = { earth: earthData(13), orbit: earthData(7) };
const wrap3 = (x) => ((x % 3) + 3) % 3;

const EARTH = { space: "#03040b", R: 1.4, cx: 0.5, cy: 1.597, ocean2: "#0e2a52", ocean1: "#2a5c92", haze: "#9cc3ef", land: "rgba(92,98,72,A)", glow: "rgba(160,200,255,.95)", glowOuter: "rgba(90,140,255,.28)", speed: 0.008, shade: true };
const ORBIT = { space: "#020309", R: 1.25, cx: 0.08, cy: 1.3, ocean2: "#123663", ocean1: "#3a75b0", haze: "#b6d6f7", land: "rgba(120,108,80,A)", glow: "rgba(175,210,255,.95)", glowOuter: "rgba(100,150,255,.3)", speed: 0.006 };

function drawEarth(ctx, w, h, t, d, o) {
  ctx.fillStyle = o.space; ctx.fillRect(0, 0, w, h);
  for (const [x, y, a] of d.stars) { ctx.fillStyle = `rgba(255,255,255,${a * 0.8})`; ctx.fillRect(x * w, y * h, 1, 1); }
  const R = o.R * w, cx = o.cx * w, cy = o.cy * w;
  const horizonY = (x) => { const dx = x - cx; return dx * dx < R * R ? cy - Math.sqrt(R * R - dx * dx) : h; };
  const place = (u, v, speed) => {
    const x = (wrap3(u - t * speed) - 1) * w;
    const hy = horizonY(x);
    const y = hy + (h + 0.08 * w - hy) * Math.pow(v, 1.7);
    return [x, y, 0.22 + 0.78 * Math.pow(v, 0.7)];
  };
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
  const g = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
  g.addColorStop(0, o.ocean2); g.addColorStop(0.93, o.ocean1); g.addColorStop(1, o.haze);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (const b of d.land) {
    const [x, y, s] = place(b.u, b.v, o.speed);
    if (x < -w * 0.2 || x > w * 1.2) continue;
    ctx.fillStyle = o.land.replace("A", (b.a * (0.5 + 0.5 * s)).toFixed(3));
    ctx.beginPath(); ctx.ellipse(x, y, b.rx * w * (0.6 + 0.4 * s), b.ry * w * s, 0, 0, Math.PI * 2); ctx.fill();
  }
  for (const c of d.clouds) {
    const [x, y, s] = place(c.u, c.v, o.speed * 1.04);
    if (x < -w * 0.2 || x > w * 1.2) continue;
    ctx.fillStyle = `rgba(245,247,255,${c.a * (0.55 + 0.45 * s)})`;
    ctx.beginPath(); ctx.ellipse(x, y, c.rx * w * (0.6 + 0.4 * s), c.ry * w * s, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (o.shade) {
    const sg = ctx.createLinearGradient(0, 0, w, 0);
    sg.addColorStop(0, "rgba(2,3,10,0)"); sg.addColorStop(0.7, "rgba(2,3,10,0)"); sg.addColorStop(1, "rgba(2,3,10,.55)");
    ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R + w * 0.004, 0, Math.PI * 2);
  ctx.lineWidth = w * 0.012; ctx.strokeStyle = o.glowOuter; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.lineWidth = Math.max(1, w * 0.004); ctx.strokeStyle = o.glow;
  ctx.shadowColor = o.glow; ctx.shadowBlur = w * 0.02; ctx.stroke();
  ctx.restore();
}

function drawStation(ctx, w) {
  ctx.save();
  ctx.fillStyle = "#0b0c14"; ctx.fillRect(w * 0.5, w * 0.03, w * 0.6, w * 0.02);
  ctx.strokeStyle = "rgba(160,165,200,.35)"; ctx.lineWidth = 1;
  for (let x = w * 0.5; x < w * 1.1; x += w * 0.02) { ctx.beginPath(); ctx.moveTo(x, w * 0.03); ctx.lineTo(x + w * 0.02, w * 0.05); ctx.stroke(); }
  const pg = ctx.createLinearGradient(0, w * 0.06, 0, w * 0.14);
  pg.addColorStop(0, "#2a2940"); pg.addColorStop(1, "#3e3554");
  ctx.fillStyle = pg; ctx.fillRect(w * 0.66, w * 0.06, w * 0.38, w * 0.085);
  ctx.strokeStyle = "rgba(210,170,100,.32)";
  for (let x = w * 0.66; x < w * 1.04; x += w * 0.019) { ctx.beginPath(); ctx.moveTo(x, w * 0.06); ctx.lineTo(x, w * 0.145); ctx.stroke(); }
  for (let y = w * 0.06; y < w * 0.146; y += w * 0.017) { ctx.beginPath(); ctx.moveTo(w * 0.66, y); ctx.lineTo(w * 1.04, y); ctx.stroke(); }
  ctx.restore();
}

function drawDusk(ctx, w, h, t) {
  const gy = h * 0.8;
  const sky = ctx.createLinearGradient(0, 0, 0, gy);
  sky.addColorStop(0, "#14163A"); sky.addColorStop(0.55, "#3b345e"); sky.addColorStop(0.85, "#b88070"); sky.addColorStop(1, "#E8CFC0");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  const sun = ctx.createRadialGradient(w * 0.18, gy, 0, w * 0.18, gy, w * 0.3);
  sun.addColorStop(0, "rgba(255,225,200,.55)"); sun.addColorStop(1, "rgba(255,225,200,0)");
  ctx.fillStyle = sun; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#2c2638"; ctx.fillRect(0, gy, w, h * 0.05);
  for (let i = 0; i < 10; i++) { ctx.fillStyle = `rgba(232,207,192,${0.18 - i * 0.015})`; ctx.fillRect(w * (0.08 + Math.sin(t * 0.6 + i) * 0.01), gy + h * (0.006 + i * 0.004), w * (0.2 - i * 0.012), 1); }
  ctx.fillStyle = "#0c0b12"; ctx.fillRect(0, gy + h * 0.05, w, h);
  const tx = w * 0.44, tw = w * 0.045, ttop = h * 0.09;
  ctx.fillRect(tx, ttop, tw, gy - ttop + h * 0.05);
  ctx.strokeStyle = "rgba(232,207,192,.12)"; ctx.lineWidth = 1;
  for (let y = ttop; y < gy; y += tw) { ctx.beginPath(); ctx.moveTo(tx, y); ctx.lineTo(tx + tw, y + tw); ctx.stroke(); }
  ctx.fillStyle = "#0c0b12";
  ctx.fillRect(tx + tw, h * 0.22, w * 0.07, h * 0.014);
  ctx.fillRect(tx + tw, h * 0.25, w * 0.07, h * 0.014);
  const rx = w * 0.54, rw = w * 0.052, top = h * 0.14;
  const bg = ctx.createLinearGradient(rx, 0, rx + rw, 0);
  bg.addColorStop(0, "#4a4560"); bg.addColorStop(0.35, "#d9c3b8"); bg.addColorStop(0.6, "#f2e4da"); bg.addColorStop(1, "#4f4a66");
  ctx.fillStyle = bg;
  ctx.fillRect(rx, top, rw, gy - top + h * 0.04);
  ctx.beginPath(); ctx.moveTo(rx, top); ctx.quadraticCurveTo(rx + rw * 0.5, top - h * 0.1, rx + rw, top); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#1b1925";
  ctx.fillRect(rx - w * 0.008, top + h * 0.02, w * 0.008, h * 0.05);
  ctx.fillRect(rx + rw, top + h * 0.02, w * 0.008, h * 0.05);
  if (Math.sin(t * 2.4) > 0.2) { ctx.fillStyle = "#ff6a5a"; ctx.beginPath(); ctx.arc(tx + tw / 2, ttop - 2, Math.max(1.2, w / 400), 0, Math.PI * 2); ctx.fill(); }
}

// the 13i standby screen: the ring-eye mark with ripples coming off the eye
export function drawStandby(ctx, w, h, t, lines = ["SIGNAL LOST", "REACQUIRING"], still = false) {
  ctx.fillStyle = "#0A0B1C"; ctx.fillRect(0, 0, w, h);
  const bg = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, w * 0.55);
  bg.addColorStop(0, "rgba(20,22,58,1)"); bg.addColorStop(1, "rgba(10,11,28,0)");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h * 0.4, r = Math.max(8, w * 0.035);
  for (let k = 0; k < 3; k++) {
    const p = still ? (k + 1) / 4 : (t * 0.3 + k / 3) % 1;
    ctx.beginPath(); ctx.arc(cx, cy, r * (1.2 + p * 5), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(185,192,255,${0.28 * (1 - p)})`; ctx.lineWidth = 1; ctx.stroke();
  }
  ctx.strokeStyle = "#B9C0FF"; ctx.lineWidth = Math.max(1.5, w * 0.005); ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 + 0.42, Math.PI * 1.5 - 0.42); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy + r); ctx.lineTo(cx, cy + r * 2.3); ctx.stroke();
  ctx.fillStyle = `rgba(232,207,192,${still ? 0.9 : 0.55 + 0.45 * Math.sin(t * 2.2) ** 2})`;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2); ctx.fill();
  if (!lines || !lines.length) return;
  const fs = Math.max(9, w * 0.026);
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  if ("letterSpacing" in ctx) ctx.letterSpacing = fs * 0.22 + "px";
  ctx.fillStyle = "#B9C0FF";
  ctx.font = `500 ${fs}px "JetBrains Mono", ui-monospace, monospace`;
  ctx.fillText(lines[0], cx, cy + r * 2.3 + fs * 2.2);
  if (lines[1]) {
    ctx.fillStyle = "#6E76B8";
    ctx.font = `400 ${fs * 0.7}px "JetBrains Mono", ui-monospace, monospace`;
    const dots = still ? "..." : ".".repeat(1 + (Math.floor(t * 2) % 3));
    ctx.fillText(lines[1] + (lines[1].startsWith("REACQ") || lines[1].startsWith("ACQ") ? dots : ""), cx, cy + r * 2.3 + fs * 3.5);
  }
  if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
}

function vignette(ctx, w, h) {
  const v = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.75);
  v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.45)");
  ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
}

// draw a monitor's preview: art is "earth" | "orbit" | "dusk" | "signal"
export function drawArt(ctx, w, h, t, art) {
  if (art === "signal") { drawStandby(ctx, w, h, t, null); return; }
  if (art === "earth") drawEarth(ctx, w, h, t, DATA.earth, EARTH);
  else if (art === "orbit") { drawEarth(ctx, w, h, t, DATA.orbit, ORBIT); drawStation(ctx, w); }
  else drawDusk(ctx, w, h, t);
  vignette(ctx, w, h);
}
