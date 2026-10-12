"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, seeded, Slider } from "./kit";
import { ping, soundOn } from "../../lib/spaceSound";

// THE BLACK HOLE No. 12 · The Arrow of Time (Update 5.77).
// Pictures: shatter · mixing · coins · heatflow · sunlight · smooth ·
// footprints · future. The words are in lib/blackhole/12-the-arrow-of-time.js.

// ─────────────────────────── shatter: play it backward ───────────────────────────
function Shatter() {
  const [dir, setDir] = useState(1);
  const dRef = useRef(dir); dRef.current = dir;
  const S = useRef({ p: 0 });
  const bits = useRef(null);
  if (!bits.current) { const r = seeded(23); bits.current = Array.from({ length: 70 }, () => ({ vx: (r() - 0.5) * 2.4, vy: -r() * 1.2, rot: r() * 6, w: 4 + r() * 10, spin: (r() - 0.5) * 10 })); }
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    const s = S.current, sz = fit(W, 55), floor = H * 0.8, cx = W / 2;
    s.p = Math.max(0, Math.min(1, s.p + dRef.current * dt / 2.5));
    ctx.fillStyle = "#14163A"; ctx.fillRect(0, floor, W, H - floor);
    const fall = Math.min(1, s.p / 0.4), y = H * 0.15 + (floor - H * 0.15 - 30) * fall * fall;
    if (s.p < 0.4) {
      ctx.strokeStyle = "rgba(200,220,255,0.85)"; ctx.lineWidth = 2; ctx.strokeRect(cx - 18, y - 30, 36, 60); ctx.fillStyle = "rgba(111,170,255,0.25)"; ctx.fillRect(cx - 16, y - 5, 32, 33); ctx.lineWidth = 1;
    } else {
      const e = (s.p - 0.4) / 0.6;
      bits.current.forEach((b) => { const x = cx + b.vx * e * W * 0.3, yy = Math.min(floor - 2, floor - 10 + b.vy * Math.sin(e * Math.PI) * H * 0.3); ctx.save(); ctx.translate(x, yy); ctx.rotate(b.rot + b.spin * e); ctx.fillStyle = "rgba(200,220,255,0.75)"; ctx.fillRect(-b.w / 2, -1.5, b.w, 3); ctx.restore(); });
      ctx.fillStyle = "rgba(111,170,255,0.3)"; ctx.beginPath(); ctx.ellipse(cx, floor + 4, W * 0.18 * e, 5, 0, 0, Math.PI * 2); ctx.fill();
    }
    label(ctx, dRef.current > 0 ? "forward: nothing strange" : "backward: every law of motion is obeyed, and it looks impossible", W / 2, H * 0.07, { size: sz + 1, color: dRef.current > 0 ? C.text : C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <button className={`bh-btn ${dir > 0 ? "bh-btn-on" : ""}`} onClick={() => { setDir(1); S.current.p = 0; }}>play</button>
        <button className={`bh-btn ${dir < 0 ? "bh-btn-on" : ""}`} onClick={() => { setDir(-1); S.current.p = 1; }}>play it backward</button>
      </div>
    </>
  );
}

// ─────────────────────────── mixing: and never unmixing ───────────────────────────
function Mixing() {
  const S = useRef(null);
  const [open, setOpen] = useState(false);
  const oRef = useRef(open); oRef.current = open;
  const make = () => { const r = seeded(29); return Array.from({ length: 160 }, (_, i) => ({ x: i < 80 ? r() * 0.48 : 0.52 + r() * 0.48, y: r(), vx: (r() - 0.5) * 0.6, vy: (r() - 0.5) * 0.6, gold: i < 80 })); };
  if (!S.current) S.current = make();
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    const sz = fit(W, 60), bx = W * 0.08, by = H * 0.12, bw = W * 0.84, bh = H * 0.66, op = oRef.current;
    ctx.strokeStyle = C.grid; ctx.strokeRect(bx, by, bw, bh);
    if (!op) { ctx.fillStyle = C.lav; ctx.fillRect(bx + bw / 2 - 2, by, 4, bh); }
    let left = 0;
    S.current.forEach((p) => {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.y < 0 || p.y > 1) { p.vy *= -1; p.y = Math.max(0, Math.min(1, p.y)); }
      const lo = !op && p.x < 0.5 ? 0 : !op ? 0.505 : 0, hi = !op && p.x < 0.5 ? 0.495 : 1;
      if (p.x < lo || p.x > hi) { p.vx *= -1; p.x = Math.max(lo, Math.min(hi, p.x)); }
      if (p.gold && p.x < 0.5) left++;
      ctx.fillStyle = p.gold ? C.gold : "#6f8fe0"; ctx.beginPath(); ctx.arc(bx + p.x * bw, by + p.y * bh, 3, 0, Math.PI * 2); ctx.fill();
    });
    label(ctx, `gold on the left: ${Math.round((left / 80) * 100)}%`, W / 2, H * 0.06, { size: sz + 1, color: C.text });
    label(ctx, op ? "they mix, and stay mixed: the chance of all 80 gold drifting back left is about 1 in 10^24" : "two gases, kept apart", W / 2, H * 0.88, { size: sz, color: op ? C.gold : C.dim });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <button className="bh-btn bh-btn-on" onClick={() => { setOpen(true); if (soundOn()) ping(400, 0.04); }}>lift the wall</button>
        <button className="bh-btn" onClick={() => { setOpen(false); S.current = make(); }}>reset</button>
      </div>
    </>
  );
}

// ─────────────────────────── coins: counting the ways ───────────────────────────
const choose = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
function Coins() {
  const [n, setN] = useState(10);
  const nRef = useRef(n); nRef.current = n;
  const ref = useCanvas((ctx, W, H) => {
    bg(ctx, W, H);
    const N = nRef.current, sz = fit(W, 60), x0 = W * 0.08, x1 = W * 0.92, y0 = H * 0.8, y1 = H * 0.18;
    const max = choose(N, Math.floor(N / 2)), bw = (x1 - x0) / (N + 1);
    for (let k = 0; k <= N; k++) { const h = (choose(N, k) / max) * (y0 - y1); ctx.fillStyle = k === 0 || k === N ? C.rose : k === Math.floor(N / 2) ? C.gold : "rgba(139,149,246,0.7)"; ctx.fillRect(x0 + k * bw + 1, y0 - h, Math.max(1, bw - 2), Math.max(1, h)); }
    label(ctx, "all tails", x0 + bw / 2, y0 + 14, { size: sz - 1, color: C.rose });
    label(ctx, "half and half", x0 + (N / 2 + 0.5) * bw, y0 + 14, { size: sz - 1, color: C.gold });
    label(ctx, "all heads", x1 - bw / 2, y0 + 14, { size: sz - 1, color: C.rose, align: "right" });
    label(ctx, "how many different ways each result can happen", W / 2, H * 0.08, { size: sz, color: C.text });
  });
  const allOne = Math.pow(2, n), half = choose(n, Math.floor(n / 2));
  const fmt = (v) => (v < 1e6 ? Math.round(v).toLocaleString() : `${(v / Math.pow(10, Math.floor(Math.log10(v)))).toFixed(1)} × 10^${Math.floor(Math.log10(v))}`);
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">coins</span><b>{n}</b></div>
        <div><span className="mono">ways to be all heads</span><b>1</b></div>
        <div><span className="mono">ways to be half and half</span><b>{fmt(half)}</b></div>
        <div><span className="mono">chance of all heads</span><b>1 in {fmt(allOne)}</b></div>
      </div>
      <div className="bh-controls"><Slider label="number of coins" min={2} max={100} step={1} value={n} onChange={setN} /></div>
    </>
  );
}

// ─────────────────────────── heatflow: hot to cold ───────────────────────────
function HeatFlow() {
  const S = useRef({ a: 90, b: 10 });
  const [, setTick] = useState(0);
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    const s = S.current, sz = fit(W, 55), flow = (s.a - s.b) * 0.25 * dt;
    s.a -= flow; s.b += flow;
    const block = (x, T, name) => {
      const f = T / 100, col = `rgb(${Math.round(80 + 175 * f)},${Math.round(100 + 40 * f)},${Math.round(230 - 180 * f)})`;
      glow(ctx, x + W * 0.17, H * 0.45, W * 0.22, `${col.replace("rgb", "rgba").replace(")", ",0.35)")}`);
      ctx.fillStyle = col; ctx.fillRect(x, H * 0.25, W * 0.34, H * 0.4);
      for (let i = 0; i < 14; i++) { const jx = (Math.sin(t * (6 + 20 * f) + i * 2.3) * 0.5 + 0.5), jy = (Math.cos(t * (5 + 18 * f) + i * 1.7) * 0.5 + 0.5); ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.fillRect(x + 6 + jx * (W * 0.34 - 12), H * 0.25 + 6 + jy * (H * 0.4 - 12), 3, 3); }
      label(ctx, `${name}: ${Math.round(T)}°`, x + W * 0.17, H * 0.72, { size: sz + 1, color: C.text });
    };
    block(W * 0.15, s.a, "hot");
    block(W * 0.51, s.b, "cold");
    label(ctx, Math.abs(s.a - s.b) < 2 ? "the same temperature: and it will never separate again by itself" : "heat flows from hot to cold, never the other way", W / 2, H * 0.88, { size: sz, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><button className="bh-btn bh-btn-on" onClick={() => { S.current = { a: 90, b: 10 }; setTick((x) => x + 1); }}>start again</button></div>
    </>
  );
}

// ─────────────────────────── sunlight: one in, twenty out ───────────────────────────
function Sunlight() {
  const S = useRef({ ins: [], outs: [] });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const s = S.current, sz = fit(W, 55), ex = W * 0.62, cy = H * 0.5, er = Math.min(W, H) * 0.14;
    glow(ctx, 0, cy, H * 0.4, "rgba(255,230,170,0.7)");
    if (Math.random() < dt * 3) s.ins.push({ x: W * 0.06, y: cy + (Math.random() - 0.5) * er * 1.4 });
    s.ins.forEach((p) => { p.x += dt * W * 0.35; glow(ctx, p.x, p.y, 7, "rgba(255,236,150,0.95)"); if (p.x > ex - er) { p.done = true; for (let k = 0; k < 20; k++) { const a = Math.random() * 6.28; s.outs.push({ x: ex + Math.cos(a) * er, y: cy + Math.sin(a) * er, a, life: 0 }); } } });
    s.ins = s.ins.filter((p) => !p.done);
    s.outs.forEach((p) => { p.life += dt; p.x += Math.cos(p.a) * dt * W * 0.2; p.y += Math.sin(p.a) * dt * W * 0.2; ctx.fillStyle = `rgba(201,123,110,${Math.max(0, 0.8 - p.life * 0.4)})`; ctx.fillRect(p.x, p.y, 2, 2); });
    s.outs = s.outs.filter((p) => p.life < 2);
    ctx.fillStyle = "#2b5fb0"; ctx.beginPath(); ctx.arc(ex, cy, er, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#5f9a5a"; ctx.beginPath(); ctx.arc(ex - er * 0.3, cy - er * 0.2, er * 0.35, 0, Math.PI * 2); ctx.fill();
    label(ctx, "gold: sunlight arriving · red: warmth leaving · about 20 out for every 1 in", W / 2, H * 0.92, { size: sz, color: C.text });
  });
  return <canvas ref={ref} className="bh-canvas" />;
}

// ─────────────────────────── smooth: the special beginning ───────────────────────────
function Smooth() {
  const [k, setK] = useState(0);
  const kRef = useRef(k); kRef.current = k;
  const S = useRef(null);
  if (!S.current) { const r = seeded(41); const centres = Array.from({ length: 9 }, () => [r(), r()]); S.current = Array.from({ length: 1400 }, () => { const c = centres[Math.floor(r() * 9)], a = r() * 6.28, d = Math.pow(r(), 2) * 0.08; return { x0: r(), y0: r(), x1: c[0] + Math.cos(a) * d, y1: c[1] + Math.sin(a) * d }; }); }
  const ref = useCanvas((ctx, W, H) => {
    bg(ctx, W, H);
    const kk = kRef.current, sz = fit(W, 55);
    S.current.forEach((p) => { const x = (p.x0 + (p.x1 - p.x0) * kk) * W, y = (p.y0 + (p.y1 - p.y0) * kk) * H; ctx.fillStyle = `rgba(255,236,200,${0.4 + 0.5 * kk})`; ctx.fillRect(x, y, 1.5, 1.5); });
    ctx.fillStyle = "rgba(5,6,15,0.7)"; ctx.fillRect(0, H * 0.88, W, H * 0.12);
    label(ctx, kk < 0.2 ? "the beginning: smooth, and for gravity that's the most ordered state there is" : "gravity clumps it: stars, galaxies, and disorder, rising all the way", W / 2, H * 0.94, { size: sz, color: kk < 0.2 ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="the Big Bang → today" min={0} max={1} step={0.005} value={k} onChange={setK} /></div>
    </>
  );
}

// ─────────────────────────── footprints: we remember the past ───────────────────────────
function Footprints() {
  const ref = useCanvas((ctx, W, H, t) => {
    ctx.fillStyle = "#d9c49a"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 300; i++) { ctx.fillStyle = "rgba(120,90,50,0.08)"; ctx.fillRect((i * 131) % W, (i * 71) % H, 2, 2); }
    const sz = fit(W, 55), p = (t % 10) / 10, x = W * 0.05 + p * W * 0.9, cy = H * 0.5;
    for (let s = 0; s < 40; s++) { const fx = W * 0.05 + (s / 40) * W * 0.9; if (fx > x - 6) break; const up = s % 2 ? -1 : 1; ctx.fillStyle = "rgba(110,80,45,0.45)"; ctx.beginPath(); ctx.ellipse(fx, cy + up * 10, 7, 4, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#3A3E75"; ctx.beginPath(); ctx.arc(x, cy, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(5,6,15,0.65)"; ctx.fillRect(0, H * 0.86, W, H * 0.14);
    label(ctx, "behind: footprints, a record of the past · ahead: nothing at all", W / 2, H * 0.93, { size: sz, color: C.gold });
  });
  return <canvas ref={ref} className="bh-canvas" />;
}

// ─────────────────────────── future: the long fade ───────────────────────────
const ERAS = [[10.14, "today: the universe is 13.8 billion years old"], [12, "a trillion years: no new stars visible beyond our merged home galaxy"], [14, "100 trillion years: the last stars burn out"], [40, "black holes are all that remain"], [67, "a black hole the Sun's mass evaporates (No. 01)"], [100, "the biggest black holes are gone: a cold, even, quiet universe"]];
function Future() {
  const [e, setE] = useState(10.14);
  const eRef = useRef(e); eRef.current = e;
  const now = ERAS.reduce((a, b) => (e >= b[0] - 0.01 ? b : a), ERAS[0]);
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const ee = eRef.current, sz = fit(W, 55), dim = Math.max(0, Math.min(1, (ee - 10) / 5));
    starfield(ctx, W, H, t, 0.6 * (1 - dim) + 0.02);
    if (ee < 14) { glow(ctx, W * 0.5, H * 0.45, Math.min(W, H) * 0.3, "rgba(255,230,190,0.5)", 1 - dim); }
    if (ee >= 14 && ee < 100) { const r = seeded(2); const left = Math.max(0, 1 - (ee - 14) / 86); for (let i = 0; i < 30 * left; i++) { const x = r() * W, y = r() * H * 0.8; ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "rgba(233,210,154,0.25)"; ctx.stroke(); } }
    label(ctx, `10^${Math.round(ee)} years`, W / 2, H * 0.12, { size: sz + 10, color: C.text, font: "Fraunces" });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout" style={{ gridTemplateColumns: "1fr" }}><div><span className="mono">then</span><b style={{ fontSize: 13 }}>{now[1]}</b></div></div>
      <div className="bh-controls"><Slider label="the far future" min={10.14} max={100} step={0.02} value={e} onChange={setE} /></div>
    </>
  );
}

export const ISSUE_12 = { shatter: Shatter, mixing: Mixing, coins: Coins, heatflow: HeatFlow, sunlight: Sunlight, smooth: Smooth, footprints: Footprints, future: Future };
