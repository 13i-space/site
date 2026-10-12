"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, seeded, Slider } from "./kit";

// THE BLACK HOLE No. 02 · Quantum Fluctuations (Update 5.74).
// Pictures: vacuum · uncertainty · zeropoint · field · foam · casimir ·
// seeds · puzzle. The words are in lib/blackHole.js.

// ─────────────────────────── vacuum: empty a box ───────────────────────────
const VAC_STAGES = [
  { btn: "pump out the air", line: "a box of ordinary air" },
  { btn: "block out the light", line: "no atoms left · but light still crosses it" },
  { btn: "cool it to absolute zero", line: "no atoms · no light · the walls still glow with heat" },
  { btn: "look closer", line: "no atoms · no light · no heat · 0 kelvin" },
  { btn: "start over", line: "still not empty" },
];
function Vacuum() {
  const [stage, setStage] = useState(0);
  const st = useRef({ stage: 0, mol: null, fizz: [] });
  st.current.stage = stage;
  const reset = () => { st.current.mol = null; st.current.fizz = []; };
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    const s = st.current, k = s.stage;
    const bx = W * 0.14, by = H * 0.14, bw = W * 0.72, bh = H * 0.66;
    if (!s.mol) { const r = seeded(11); s.mol = Array.from({ length: 110 }, () => ({ x: r(), y: r(), vx: (r() - 0.5) * 0.5, vy: (r() - 0.5) * 0.5 })); }
    // walls: warm while there's heat
    const warmth = k < 3 ? 1 : 0;
    s.warm = (s.warm ?? 1) + (warmth - (s.warm ?? 1)) * Math.min(1, dt * 1.5);
    glow(ctx, W / 2, H * 0.47, W * 0.5, `rgba(201,123,110,${0.18 * s.warm})`);
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(${Math.round(110 + 120 * s.warm)},${Math.round(150 - 30 * s.warm)},${Math.round(230 - 120 * s.warm)},0.9)`;
    ctx.strokeRect(bx, by, bw, bh);
    // the valve
    ctx.fillStyle = C.grid; ctx.fillRect(bx + bw, by + bh * 0.42, W * 0.05, bh * 0.16);
    // light crossing the box
    if (k < 2) {
      for (let i = 0; i < 14; i++) {
        const y = by + bh * ((i * 0.618 + 0.1) % 1);
        const x0 = bx + ((t * 0.35 + i * 0.37) % 1) * bw;
        ctx.beginPath();
        for (let q = 0; q < 40; q++) { const x = x0 + q * 1.4; if (x > bx + bw) break; const yy = y + Math.sin(q * 0.8 + t * 9) * 3; q ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }
        ctx.strokeStyle = "rgba(233,210,154,0.55)"; ctx.lineWidth = 1.2; ctx.stroke();
      }
    }
    // atoms bouncing, and leaving by the valve once the pump is on
    s.mol.forEach((m) => {
      if (k >= 1) { const dx = 1.05 - m.x, dy = 0.5 - m.y, d = Math.hypot(dx, dy) + 0.01; m.vx += (dx / d) * dt * 1.6; m.vy += (dy / d) * dt * 1.6; }
      m.x += m.vx * dt; m.y += m.vy * dt;
      if (m.y < 0 || m.y > 1) m.vy *= -1;
      if (m.x < 0) m.vx *= -1;
      if (m.x > 1) { if (k >= 1 && Math.abs(m.y - 0.5) < 0.09) m.gone = true; else m.vx *= -1; }
      m.x = Math.max(0, Math.min(1.02, m.x)); m.y = Math.max(0, Math.min(1, m.y));
      ctx.fillStyle = C.lav; ctx.beginPath(); ctx.arc(bx + m.x * bw, by + m.y * bh, 3, 0, Math.PI * 2); ctx.fill();
    });
    s.mol = s.mol.filter((m) => !m.gone);
    // the fizz: always there; you only see it once everything else is gone
    if (k >= 3) {
      const rate = k >= 4 ? 70 : 10;
      for (let n = 0; n < rate * dt; n++) s.fizz.push({ x: Math.random(), y: Math.random(), age: 0, life: 0.25 + Math.random() * 0.5 });
      s.fizz.forEach((f) => {
        f.age += dt;
        const p = f.age / f.life, sep = Math.sin(p * Math.PI) * (k >= 4 ? 7 : 4);
        const x = bx + f.x * bw, y = by + f.y * bh, a = Math.sin(p * Math.PI) * (k >= 4 ? 0.9 : 0.35);
        ctx.globalAlpha = a; ctx.fillStyle = C.lav; ctx.beginPath(); ctx.arc(x - sep, y, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = C.rose; ctx.beginPath(); ctx.arc(x + sep, y, 2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        if (p > 0.92) glow(ctx, x, y, 8, "rgba(255,255,255,0.8)", (1 - p) * 8);
      });
      s.fizz = s.fizz.filter((f) => f.age < f.life);
    }
    const sz = fit(W, 55);
    label(ctx, VAC_STAGES[k].line, W / 2, H * 0.07, { size: sz, color: k >= 4 ? C.gold : C.text });
    label(ctx, `atoms ${s.mol.length} · light ${k < 2 ? "yes" : "none"} · temperature ${k < 3 ? "293 K" : "0 K"}`, W / 2, H * 0.89, { size: sz - 1 });
    if (k >= 4) label(ctx, "pairs of particles flicker in and out of nothing", W / 2, H * 0.95, { size: sz - 1, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <button className="bh-btn bh-btn-on" onClick={() => { if (stage >= 4) { reset(); setStage(0); } else setStage(stage + 1); }}>{VAC_STAGES[stage].btn}</button>
        <span className="mono bh-slider-val" style={{ fontSize: 11 }}>step {stage + 1} of 5</span>
      </div>
    </>
  );
}

// ─────────────────────────── uncertainty ───────────────────────────
function Uncertainty() {
  const [pin, setPin] = useState(0.35); // 0 = loose, 1 = tight
  const pRef = useRef(pin); pRef.current = pin;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const p = pRef.current;
    const sx = 0.32 * Math.pow(0.08, p);           // position spread
    const sp = 0.012 / sx;                          // momentum spread: sx * sp stays fixed
    const sz = fit(W, 55);
    const panel = (y0, h, name, sub, f, color) => {
      ctx.strokeStyle = "rgba(58,62,117,0.6)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W * 0.06, y0 + h); ctx.lineTo(W * 0.94, y0 + h); ctx.stroke();
      label(ctx, name, W * 0.06, y0 + 4, { size: sz, color: C.text, align: "left" });
      label(ctx, sub, W * 0.94, y0 + 4, { size: sz - 1, align: "right" });
      ctx.beginPath();
      for (let i = 0; i <= 300; i++) { const u = i / 300, x = W * 0.06 + u * W * 0.88, y = y0 + h - f(u - 0.5) * (h - 22); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    };
    // where it is: a ripple inside a bell
    panel(H * 0.05, H * 0.4, "where it is", sx < 0.03 ? "pinned down tightly" : sx > 0.18 ? "spread out" : "somewhere about here",
      (u) => { const env = Math.exp(-(u * u) / (2 * sx * sx)); return 0.5 + 0.5 * env * Math.cos(u * 90 - t * 6); }, C.gold);
    // how it is moving: the spread of speeds
    const mom = (u) => Math.exp(-(u * u) / (2 * sp * sp));
    panel(H * 0.52, H * 0.36, "how fast, and which way", sp > 0.2 ? "anyone's guess" : sp < 0.05 ? "known well" : "roughly known", mom, C.lav);
    label(ctx, W < 520 ? "spread × spread ≥ a fixed small number" : "spread in place × spread in motion never drops below the same small number", W / 2, H * 0.96, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="pin down where it is" min={0} max={1} step={0.01} value={pin} onChange={setPin} show={pin < 0.3 ? "loosely" : pin < 0.7 ? "closer" : "exactly-ish"} /></div>
    </>
  );
}

// ─────────────────────────── zeropoint: nothing sits still ───────────────────────────
function ZeroPoint() {
  const [temp, setTemp] = useState(300);
  const tRef = useRef(temp); tRef.current = temp;
  const q = useRef({ x: 0, v: 0 });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const T = tRef.current, sz = fit(W, 55);
    const bowl = (cx, name) => {
      const w = W * 0.19, d = H * 0.42, y0 = H * 0.7;
      ctx.beginPath();
      for (let i = -40; i <= 40; i++) { const u = i / 40; const x = cx + u * w, y = y0 - d * u * u; i > -40 ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = "rgba(139,149,246,0.6)"; ctx.lineWidth = 2; ctx.stroke();
      label(ctx, name, cx, H * 0.82, { size: sz + 1, color: C.text });
      return { w, d, y0 };
    };
    const amp = Math.sqrt(T / 300) * 0.75;
    // classical: a ball rocking; at absolute zero it stops dead
    const L = bowl(W * 0.27, "the old picture");
    const u1 = amp * Math.sin(t * 3);
    const x1 = W * 0.27 + u1 * L.w, y1 = L.y0 - L.d * u1 * u1 - 9;
    glow(ctx, x1, y1, 22, "rgba(233,210,154,0.5)"); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(x1, y1, 8, 0, Math.PI * 2); ctx.fill();
    label(ctx, T < 3 ? "perfectly still" : "rocking", W * 0.27, H * 0.92, { size: sz });
    // quantum: a cloud that never shrinks to a point
    const R = bowl(W * 0.73, "the quantum picture");
    const spread = Math.sqrt(amp * amp + 0.16 * 0.16);
    const qq = q.current;
    qq.v += (-qq.x * 40 + (Math.random() - 0.5) * 260 * spread) * dt; qq.v *= 0.96; qq.x += qq.v * dt;
    qq.x = Math.max(-spread * 1.6, Math.min(spread * 1.6, qq.x));
    for (let i = -30; i <= 30; i++) {
      const u = (i / 30) * spread * 2.2, a = Math.exp(-(u * u) / (2 * spread * spread * 0.4));
      const x = W * 0.73 + u * R.w, y = R.y0 - R.d * u * u - 9;
      glow(ctx, x, y, 16, "rgba(185,192,255,0.35)", a * 0.6);
    }
    const x2 = W * 0.73 + qq.x * R.w, y2 = R.y0 - R.d * qq.x * qq.x - 9;
    ctx.fillStyle = C.lav; ctx.beginPath(); ctx.arc(x2, y2, 6, 0, Math.PI * 2); ctx.fill();
    label(ctx, T < 3 ? "still trembling: zero-point motion" : "rocking, and trembling", W * 0.73, H * 0.92, { size: sz, color: T < 3 ? C.gold : C.dim });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="cool it down" min={0} max={300} step={1} value={300 - temp} onChange={(v) => setTemp(300 - v)} show={`${temp} K${temp === 0 ? " · absolute zero" : ""}`} /></div>
    </>
  );
}

// ─────────────────────────── field: a ripple is a particle ───────────────────────────
function Field() {
  const [shimmer, setShimmer] = useState(0.4);
  const sRef = useRef(shimmer); sRef.current = shimmer;
  const F = useRef(null);
  const NX = 64, NY = 30;
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    if (!F.current) F.current = { h: new Float32Array(NX * NY), v: new Float32Array(NX * NY), n: new Float32Array(NX * NY) };
    const { h, v, n } = F.current, sh = sRef.current;
    // the wave equation, a few small steps a frame
    for (let k = 0; k < 3; k++) {
      for (let j = 1; j < NY - 1; j++) for (let i = 1; i < NX - 1; i++) {
        const id = j * NX + i;
        const lap = h[id - 1] + h[id + 1] + h[id - NX] + h[id + NX] - 4 * h[id];
        v[id] += lap * 0.45 - h[id] * 0.002; v[id] *= 0.997;
      }
      for (let id = 0; id < NX * NY; id++) h[id] += v[id] * 0.5;
    }
    // the shimmer of the empty field: never quite flat
    for (let id = 0; id < NX * NY; id++) n[id] = n[id] * 0.86 + (Math.random() - 0.5) * 0.14;
    const proj = (i, j, z) => {
      const depth = j / (NY - 1), sc = 0.55 + 0.45 * depth;
      return [W / 2 + (i / (NX - 1) - 0.5) * W * 0.92 * sc, H * 0.16 + depth * H * 0.68 - z * H * 0.12 * sc];
    };
    for (let j = 0; j < NY; j++) {
      ctx.beginPath();
      for (let i = 0; i < NX; i++) { const id = j * NX + i; const [x, y] = proj(i, j, h[id] + n[id] * sh * 0.7); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = `rgba(139,149,246,${0.18 + (j / NY) * 0.5})`; ctx.lineWidth = 1; ctx.stroke();
    }
    const sz = fit(W, 55);
    label(ctx, "a field fills all of space · tap it to make a ripple", W / 2, H * 0.06, { size: sz, color: C.text });
    label(ctx, sh < 0.05 ? "zoomed out, it looks perfectly flat" : "zoomed in, it is never still: vacuum fluctuations", W / 2, H * 0.95, { size: sz - 1, color: sh < 0.05 ? C.dim : C.gold });
    if (!F.current.auto || t - F.current.auto > 5) { F.current.auto = t; pluck(0.3 + Math.random() * 0.4, 0.4 + Math.random() * 0.3); }
  });
  const pluck = (u, w) => {
    const f = F.current; if (!f) return;
    const ci = Math.round(u * (NX - 1)), cj = Math.round(w * (NY - 1));
    for (let j = 1; j < NY - 1; j++) for (let i = 1; i < NX - 1; i++) { const d2 = (i - ci) ** 2 + ((j - cj) * 1.4) ** 2; f.v[j * NX + i] += 1.4 * Math.exp(-d2 / 4); }
  };
  return (
    <>
      <canvas ref={ref} className="bh-canvas" onPointerDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); pluck((e.clientX - r.left) / r.width, Math.max(0.05, Math.min(0.95, ((e.clientY - r.top) / r.height - 0.16) / 0.68))); }} />
      <div className="bh-controls"><Slider label="magnify the empty field" min={0} max={1} step={0.01} value={shimmer} onChange={setShimmer} show={shimmer < 0.05 ? "everyday view" : shimmer < 0.6 ? "closer" : "very close"} /></div>
    </>
  );
}

// ─────────────────────────── foam: borrow and repay ───────────────────────────
const ZOOMS = ["a grain of sand", "a living cell", "a virus", "an atom", "an atom's nucleus"];
function Foam() {
  const [zoom, setZoom] = useState(0.3);
  const zRef = useRef(zoom); zRef.current = zoom;
  const pairs = useRef([]);
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.15);
    const z = zRef.current;
    const rate = 6 + z * 140, life = 1.6 * Math.pow(0.12, z), size = 2 + z * 6, spread = 10 + z * 28;
    for (let n = 0; n < rate * dt; n++) pairs.current.push({ x: Math.random() * W, y: H * 0.1 + Math.random() * H * 0.76, a: Math.random() * Math.PI, age: 0, life: life * (0.6 + Math.random() * 0.8), hue: Math.random() });
    pairs.current.forEach((p) => {
      p.age += dt;
      const f = p.age / p.life, sep = Math.sin(f * Math.PI) * spread, c = Math.cos(p.a), s = Math.sin(p.a);
      const a = Math.min(1, Math.sin(f * Math.PI) * 1.4);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.hue < 0.5 ? C.lav : C.teal; ctx.beginPath(); ctx.arc(p.x - c * sep, p.y - s * sep, size, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = p.hue < 0.5 ? C.rose : C.gold; ctx.beginPath(); ctx.arc(p.x + c * sep, p.y + s * sep, size, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      if (f > 0.9) glow(ctx, p.x, p.y, size * 4, "rgba(255,255,255,0.9)", (1 - f) * 10);
    });
    pairs.current = pairs.current.filter((p) => p.age < p.life).slice(-500);
    const sz = fit(W, 55);
    label(ctx, `the scale of ${ZOOMS[Math.min(4, Math.floor(z * 4.999))]}`, W / 2, H * 0.06, { size: sz, color: C.text });
    label(ctx, W < 520 ? "a picture, not a photograph" : "smaller and closer: bigger borrowings, paid back faster · a picture, not a photograph", W / 2, H * 0.95, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="zoom into empty space" min={0} max={1} step={0.01} value={zoom} onChange={setZoom} show={zoom < 0.33 ? "pairs: rare, slow" : zoom < 0.7 ? "busier" : "a boiling foam"} /></div>
    </>
  );
}

// ─────────────────────────── casimir: two plates in nothing ───────────────────────────
const HBAR = 1.054571817e-34, CLIGHT = 2.99792458e8, ATM = 101325;
const casimir = (d) => (Math.PI ** 2 * HBAR * CLIGHT) / (240 * d ** 4); // pascals, for perfect plates
function Casimir() {
  const [g, setG] = useState(0.5); // 0 = 1000 nm, 1 = 10 nm
  const gRef = useRef(g); gRef.current = g;
  const d = 1e-9 * Math.pow(10, 3 - 2 * g);
  const P = casimir(d);
  const fmtP = P / ATM >= 0.01 ? `${(P / ATM).toFixed(2)} atmospheres` : `${(P / ATM).toExponential(1).replace("e", " × 10^")} atm`;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const gg = gRef.current, cx = W / 2;
    const half = W * (0.2 - 0.16 * gg);
    const top = H * 0.16, bot = H * 0.82, pw = Math.max(6, W * 0.018);
    // outside: every wavelength fits, so waves of all sizes press on the plates
    const r = seeded(5);
    for (let k = 0; k < 16; k++) {
      const y = top + (k + 0.5) * ((bot - top) / 16), lam = 6 + r() * 40, side = k % 2 ? 1 : -1;
      ctx.beginPath();
      const x0 = side < 0 ? 0 : cx + half + pw, x1 = side < 0 ? cx - half - pw : W;
      for (let x = x0; x <= x1; x += 2) { const yy = y + Math.sin((x / lam) * Math.PI * 2 - t * 4 * side) * 4; x === x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
      ctx.strokeStyle = "rgba(185,192,255,0.35)"; ctx.lineWidth = 1; ctx.stroke();
    }
    // between: only waves that fit a whole number of half-wavelengths
    const gap = half * 2, modes = Math.max(1, Math.round(1 + (1 - gg) * 5));
    for (let n = 1; n <= modes; n++) {
      const y = top + ((n - 0.5) / modes) * (bot - top);
      ctx.beginPath();
      for (let x = 0; x <= gap; x += 1.5) { const yy = y + Math.sin((n * Math.PI * x) / gap) * Math.cos(t * 3 * n) * Math.min(14, (bot - top) / modes / 3); x ? ctx.lineTo(cx - half + x, yy) : ctx.moveTo(cx - half + x, yy); }
      ctx.strokeStyle = "rgba(233,210,154,0.7)"; ctx.lineWidth = 1.5; ctx.stroke();
    }
    // the plates
    ctx.fillStyle = "#8a90c8";
    ctx.fillRect(cx - half - pw, top - 10, pw, bot - top + 20);
    ctx.fillRect(cx + half, top - 10, pw, bot - top + 20);
    // the push: arrows grow with the pressure
    const len = 10 + Math.max(0, Math.log10(casimir(1e-9 * Math.pow(10, 3 - 2 * gg))) + 3) * 9;
    const arrow = (x, dir) => {
      const y = (top + bot) / 2;
      ctx.strokeStyle = C.gold; ctx.fillStyle = C.gold; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x - dir * len, y); ctx.lineTo(x - dir * 8, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - dir * 2, y); ctx.lineTo(x - dir * 12, y - 7); ctx.lineTo(x - dir * 12, y + 7); ctx.closePath(); ctx.fill();
    };
    arrow(cx - half - pw - 4, 1); arrow(cx + half + pw + 4, -1);
    const sz = fit(W, 55);
    const narrow = W < 520;
    if (!narrow) { label(ctx, "all wavelengths outside", W * 0.16, H * 0.08, { size: sz }); label(ctx, "all wavelengths outside", W * 0.84, H * 0.08, { size: sz }); }
    label(ctx, narrow ? "every size outside · only some fit between" : "only some fit between", cx, H * 0.08, { size: sz, color: C.gold });
    label(ctx, narrow ? "more push outside than in" : "more pushing from outside than in: the plates are pressed together", W / 2, H * 0.93, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">gap</span><b>{d >= 1e-7 ? `${(d * 1e9).toFixed(0)} nm` : `${(d * 1e9).toFixed(1)} nm`}</b></div>
        <div><span className="mono">that's about</span><b>{d > 4e-7 ? "1/100 of a hair" : d > 5e-8 ? "a virus across" : "100 atoms across"}</b></div>
        <div><span className="mono">push from nothing</span><b>{P >= 1 ? `${P.toLocaleString(undefined, { maximumFractionDigits: 0 })} Pa` : `${P.toPrecision(2)} Pa`}</b></div>
        <div><span className="mono">compared with air</span><b>{fmtP}</b></div>
      </div>
      <div className="bh-controls"><Slider label="close the gap" min={0} max={1} step={0.005} value={g} onChange={setG} /></div>
    </>
  );
}

// ─────────────────────────── seeds: inflation stretches the fizz ───────────────────────────
function Seeds() {
  const [k, setK] = useState(0); // 0..1 inflate, 1..2 gravity
  const kRef = useRef(k); kRef.current = k;
  const S = useRef(null);
  const build = () => {
    const r = seeded(29), modes = [];
    for (let i = 0; i < 26; i++) { const kk = 4 + Math.pow(r(), 1.5) * 26, a = r() * Math.PI * 2; modes.push({ kx: Math.cos(a) * kk, ky: Math.sin(a) * kk, ph: r() * 6.28, amp: 1 / Math.sqrt(kk), w: 1 + r() * 3 }); }
    const f = (x, y, tt) => modes.reduce((s, m) => s + m.amp * Math.cos(m.kx * x + m.ky * y + m.ph + m.w * tt), 0);
    // where matter ends up: climb toward the denser spots
    const pts = Array.from({ length: 700 }, () => { let x = r(), y = r(); const x0 = x, y0 = y; for (let s = 0; s < 40; s++) { const e = 0.004, gx = (f(x + e, y, 0) - f(x - e, y, 0)) / (2 * e), gy = (f(x, y + e, 0) - f(x, y - e, 0)) / (2 * e); x += gx * 0.0009; y += gy * 0.0009; } return { x0, y0, x, y, b: r() }; });
    const RW = 120, RH = 82;
    const c = document.createElement("canvas"); c.width = RW; c.height = RH;
    return { f, pts, c, cx: c.getContext("2d"), img: c.getContext("2d").createImageData(RW, RH), RW, RH, frozen: 0 };
  };
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    if (!S.current) S.current = build();
    const s = S.current, kk = kRef.current;
    const inflate = Math.min(1, kk), grav = Math.max(0, kk - 1);
    // the fizz moves until it is stretched, then freezes in place
    s.frozen += dt * (1 - inflate) * 1.2;
    const o = s.img.data;
    for (let y = 0; y < s.RH; y++) for (let x = 0; x < s.RW; x++) {
      const v = s.f(x / s.RW, y / s.RH, s.frozen) * 0.33;
      const i = (y * s.RW + x) * 4;
      const hot = Math.max(0, Math.min(1, 0.5 + v));
      o[i] = 40 + hot * 210; o[i + 1] = 50 + hot * 120; o[i + 2] = 160 - hot * 120; o[i + 3] = 255 * (1 - grav * 0.85);
    }
    s.cx.putImageData(s.img, 0, 0);
    const scale = 0.06 + 0.94 * Math.pow(inflate, 1.6);
    const w = W * scale, h = H * scale;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(s.c, (W - w) / 2, (H - h) / 2, w, h);
    if (grav > 0) {
      s.pts.forEach((p) => {
        const x = (p.x0 + (p.x - p.x0) * grav) * W, y = (p.y0 + (p.y - p.y0) * grav) * H;
        glow(ctx, x, y, 3 + grav * 6, `rgba(255,240,210,${0.5 * grav})`, grav);
        ctx.fillStyle = `rgba(255,244,225,${0.3 + 0.7 * grav * p.b})`; ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
      });
    }
    const sz = fit(W, 55);
    const msg = kk < 0.02 ? "a speck of space, far smaller than an atom, fizzing" : kk < 1 ? "inflation: stretched by a factor of at least 10^26 in a tiny fraction of a second" : kk < 1.95 ? "the stretched fizz: a little more matter here, a little less there" : "13.8 billion years later: galaxies where the seeds were";
    label(ctx, msg, W / 2, H * 0.06, { size: sz, color: kk >= 1.95 ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="the first instant → today" min={0} max={2} step={0.005} value={k} onChange={setK} show={k < 1 ? "inflating" : k < 1.95 ? "gravity at work" : "now"} /></div>
    </>
  );
}

// ─────────────────────────── puzzle: the worst prediction in physics ───────────────────────────
const RUNGS = [
  [0, "what we measure: the energy of empty space"],
  [3, "×1,000"],
  [10, "×10 billion: more than the number of people alive"],
  [22, "more than the stars in the observable universe"],
  [80, "about the number of atoms in the observable universe"],
  [100, "a googol"],
  [120, "what the simplest calculation predicts"],
];
function Puzzle() {
  const [p, setP] = useState(0);
  const pRef = useRef(p); pRef.current = p;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const pp = pRef.current, sz = fit(W, 55);
    // a ladder of powers of ten, the camera riding up with the slider
    const step = H * 0.07, baseY = H * 0.78 + pp * step;
    for (let e = 0; e <= 122; e++) {
      const y = baseY - e * step;
      if (y < -20 || y > H + 20) continue;
      const big = e % 10 === 0, x = W * 0.12;
      ctx.strokeStyle = e <= pp ? "rgba(233,210,154,0.8)" : "rgba(58,62,117,0.7)"; ctx.lineWidth = big ? 2 : 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (big ? 26 : 14), y); ctx.stroke();
      if (big || e === Math.round(pp)) label(ctx, `10^${e}`, x - 8, y, { size: sz - 1, align: "right", color: e <= pp ? C.gold : C.dim });
    }
    RUNGS.forEach(([e, s]) => {
      const y = baseY - e * step;
      if (y < -20 || y > H + 20) return;
      const reached = pp >= e - 0.5;
      label(ctx, s, W * 0.2, y, { size: sz + 1, align: "left", color: reached ? C.text : C.dim });
      if (e === 0 || e === 120) glow(ctx, W * 0.12, y, 18, e === 0 ? "rgba(185,192,255,0.7)" : "rgba(233,210,154,0.9)", reached ? 1 : 0.3);
    });
    label(ctx, `climbed: ${Math.round(pp)} powers of ten`, W * 0.94, H * 0.08, { size: sz, align: "right", color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="climb from what we measure" min={0} max={122} step={0.1} value={p} onChange={setP} show={p > 119 ? "the gap" : `×10^${Math.round(p)}`} /></div>
    </>
  );
}

export const ISSUE_02 = { vacuum: Vacuum, uncertainty: Uncertainty, zeropoint: ZeroPoint, field: Field, foam: Foam, casimir: Casimir, seeds: Seeds, puzzle: Puzzle };
