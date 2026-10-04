"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

// THE BLACK HOLE player (Update 5.55): one issue (lib/blackHole.js), a step
// at a time. Each step has a living picture you can touch, drawn here in
// code, and a few short paragraphs. Arrow keys move between steps. The end
// is a three-question check and a look at next week.
//
// Visuals: drop · sheet · orbit · lens · clocks · squeeze · cones · fall ·
// real · hawking. Add a new one to VISUALS for a new issue's idea.

const C = { bg: "#05060f", grid: "#3A3E75", lav: "#B9C0FF", gold: "#E9D29A", rose: "#C97B6E", warm: "#E8CFC0", text: "#DCDFFF", dim: "#6E76B8" };

// a canvas that redraws every frame: draw(ctx, W, H, t, dt)
function useCanvas(draw) {
  const ref = useRef(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let raf = 0, last = performance.now(), dpr = 1;
    const loop = (now) => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = c.clientWidth, H = c.clientHeight;
      if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      try { drawRef.current(ctx, W, H, now / 1000, dt); } catch (e) { /* keep going */ }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return ref;
}

const glow = (ctx, x, y, r, color, a = 1) => {
  if (r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = Math.max(0, Math.min(1, a)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1;
};
const label = (ctx, s, x, y, { size = 12, color = C.dim, align = "center", font = "JetBrains Mono" } = {}) => {
  ctx.font = `${size}px "${font}", monospace`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(s, x, y);
};
const stars = (() => { let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647); return Array.from({ length: 140 }, () => ({ x: r(), y: r(), s: r() * 1.3 + 0.2, p: r() * 6.28 })); })();
const starfield = (ctx, W, H, t, a = 0.6) => {
  ctx.fillStyle = "#EDEBFF";
  stars.forEach((s) => { ctx.globalAlpha = a * (0.3 + 0.7 * Math.abs(Math.sin(t * 0.5 + s.p))); ctx.fillRect(s.x * W, s.y * H, s.s, s.s); });
  ctx.globalAlpha = 1;
};
const bg = (ctx, W, H) => { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); };

function Slider({ label: l, min, max, step, value, onChange, show }) {
  return (
    <label className="bh-slider">
      <span className="mono">{l}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      {show && <span className="mono bh-slider-val">{show}</span>}
    </label>
  );
}

// ─────────────────────────── 01 drop ───────────────────────────
function Drop() {
  const balls = useRef([]);
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    starfield(ctx, W, H, t, 0.3);
    const ground = H * 0.86;
    ctx.fillStyle = "#14163A"; ctx.fillRect(0, ground, W, H - ground);
    ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(0, ground); ctx.lineTo(W, ground); ctx.stroke();
    if (!balls.current.length && Math.floor(t) % 3 === 0 && t % 1 < dt * 1.5) balls.current.push({ x: W * (0.3 + Math.random() * 0.4), y: H * 0.12, vy: 0, trail: [] });
    balls.current.forEach((b) => {
      b.vy += 900 * dt; b.y += b.vy * dt;
      if (b.y > ground - 10) { b.y = ground - 10; b.vy *= -0.45; if (Math.abs(b.vy) < 40) b.done = (b.done || 0) + dt; }
      b.trail.push(b.y); if (b.trail.length > 20) b.trail.shift();
      b.trail.forEach((y, i) => { ctx.globalAlpha = (i / b.trail.length) * 0.25; ctx.fillStyle = C.lav; ctx.beginPath(); ctx.arc(b.x, y, 8, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1;
      glow(ctx, b.x, b.y, 26, "rgba(233,210,154,0.5)");
      ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(b.x, b.y, 10, 0, Math.PI * 2); ctx.fill();
    });
    balls.current = balls.current.filter((b) => (b.done || 0) < 1.5).slice(-6);
    label(ctx, "Newton: a force pulls it down.   Einstein: it follows the shape of spacetime.", W / 2, H * 0.06, { size: Math.max(10, Math.min(13, W / 60)) });
  });
  return <canvas ref={ref} className="bh-canvas" onPointerDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); balls.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, vy: 0, trail: [] }); }} />;
}

// ─────────────────────────── 02 sheet ───────────────────────────
function Sheet() {
  const [mass, setMass] = useState(0.5);
  const marbles = useRef([]);
  const massRef = useRef(mass); massRef.current = mass;
  // a sheet in perspective: (x, z) on the plane, y = dip
  // camera above the sheet looking across it: far rows high, near rows low,
  // and the dip goes down (bigger screen y)
  const project = (W, H, x, z, y) => {
    const cz = z + 2.6, f = Math.min(W * 0.95, H * 1.5);
    return [W / 2 + (x / cz) * f, H * 0.1 + ((0.75 - y * 2.6) / cz) * f * 0.42];
  };
  const dip = (x, z, m) => -m * 0.32 / Math.sqrt(x * x + z * z + 0.05);
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    const m = massRef.current;
    const N = 26, span = 1.6;
    ctx.lineWidth = 1;
    for (let i = 0; i <= N; i++) {
      for (const dir of [0, 1]) {
        ctx.beginPath();
        for (let j = 0; j <= N * 2; j++) {
          const a = -span + (i / N) * span * 2, b = -span + (j / (N * 2)) * span * 2;
          const x = dir ? a : b, z = dir ? b : a;
          const [px, py] = project(W, H, x, z, dip(x, z, m));
          j ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        }
        const depth = Math.abs(i - N / 2) / (N / 2);
        ctx.strokeStyle = `rgba(139,149,246,${0.15 + (1 - depth) * 0.35})`;
        ctx.stroke();
      }
    }
    // the mass
    const [sx, sy] = project(W, H, 0, 0, dip(0, 0, m) * 0.92);
    glow(ctx, sx, sy, 30 + m * 50, "rgba(233,210,154,0.7)");
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(sx, sy, 6 + m * 14, 0, Math.PI * 2); ctx.fill();
    // marbles rolling on the sheet
    marbles.current.forEach((mb) => {
      const r2 = mb.x * mb.x + mb.z * mb.z + 0.02;
      const acc = (m * 0.9) / r2;
      const r = Math.sqrt(r2);
      mb.vx -= (mb.x / r) * acc * dt; mb.vz -= (mb.z / r) * acc * dt;
      mb.x += mb.vx * dt; mb.z += mb.vz * dt;
      mb.trail.push([mb.x, mb.z]); if (mb.trail.length > 90) mb.trail.shift();
      ctx.beginPath();
      mb.trail.forEach(([x, z], i) => { const [px, py] = project(W, H, x, z, dip(x, z, m)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
      ctx.strokeStyle = "rgba(232,207,192,0.5)"; ctx.stroke();
      const [px, py] = project(W, H, mb.x, mb.z, dip(mb.x, mb.z, m));
      ctx.fillStyle = C.warm; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
      if (r < 0.12 || r > 3) mb.gone = true;
    });
    marbles.current = marbles.current.filter((mb) => !mb.gone).slice(-5);
    if (!marbles.current.length && t % 4 < dt * 1.5) marbles.current.push({ x: -1.5, z: 0.7, vx: 0.9, vz: -0.15, trail: [] });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" onPointerDown={() => marbles.current.push({ x: -1.5, z: 0.4 + Math.random() * 0.8, vx: 0.7 + Math.random() * 0.5, vz: (Math.random() - 0.5) * 0.3, trail: [] })} />
      <div className="bh-controls"><Slider label="mass" min={0.05} max={1} step={0.01} value={mass} onChange={setMass} show={mass < 0.25 ? "a planet" : mass < 0.7 ? "a star" : "a very heavy star"} /></div>
    </>
  );
}

// ─────────────────────────── 03 orbit ───────────────────────────
function Orbit() {
  const [speed, setSpeed] = useState(1);
  const ship = useRef(null);
  const verdict = useRef("");
  const launch = () => { ship.current = { x: 0, y: -1, vx: speed, vy: 0, trail: [], t: 0 }; verdict.current = ""; };
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.4);
    const cx = W / 2, cy = H / 2, s = Math.min(W, H) * 0.3;
    // the planet
    glow(ctx, cx, cy, s * 0.7, "rgba(90,140,255,0.4)");
    const pg = ctx.createRadialGradient(cx - s * 0.1, cy - s * 0.1, 2, cx, cy, s * 0.32);
    pg.addColorStop(0, "#5a7fd6"); pg.addColorStop(1, "#14244f");
    ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(cx, cy, s * 0.32, 0, Math.PI * 2); ctx.fill();
    // the launch tower on top
    ctx.strokeStyle = C.gold; ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.32); ctx.lineTo(cx, cy - s); ctx.stroke();
    const sh = ship.current;
    if (sh) {
      for (let k = 0; k < 4; k++) {
        const r2 = sh.x * sh.x + sh.y * sh.y, r = Math.sqrt(r2);
        const a = 1 / r2; // GM = 1, circular speed at r=1 is 1, escape is sqrt(2)
        sh.vx -= (sh.x / r) * a * dt * 0.6; sh.vy -= (sh.y / r) * a * dt * 0.6;
        sh.x += sh.vx * dt * 0.6; sh.y += sh.vy * dt * 0.6; sh.t += dt * 0.6;
        if (r < 0.32) { verdict.current = "it fell back to the ground"; ship.current = null; break; }
        if (r > 3.2) { verdict.current = "it escaped"; ship.current = null; break; }
      }
      if (ship.current) {
        sh.trail.push([sh.x, sh.y]); if (sh.trail.length > 400) sh.trail.shift();
        if (sh.t > 9 && !verdict.current) verdict.current = "in orbit: falling forever, and missing";
      }
      ctx.beginPath();
      sh.trail.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * s, cy + y * s) : ctx.moveTo(cx + x * s, cy + y * s)));
      ctx.strokeStyle = "rgba(232,207,192,0.6)"; ctx.stroke();
      if (ship.current) { glow(ctx, cx + sh.x * s, cy + sh.y * s, 14, "rgba(233,210,154,0.8)"); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx + sh.x * s, cy + sh.y * s, 3.5, 0, Math.PI * 2); ctx.fill(); }
    }
    if (verdict.current) label(ctx, verdict.current, cx, H * 0.92, { size: 13, color: C.gold });
  });
  const word = speed < 0.85 ? "too slow" : speed < 1.15 ? "about right for an orbit" : speed < 1.414 ? "a stretched orbit" : "escape velocity";
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <Slider label="sideways speed" min={0.5} max={1.6} step={0.01} value={speed} onChange={setSpeed} show={word} />
        <button className="bh-btn" onClick={launch}>launch</button>
      </div>
    </>
  );
}

// ─────────────────────────── 04 lens ───────────────────────────
function Lens() {
  const lens = useRef({ x: 0.54, y: 0.47, drag: false });
  const src = useRef(null);
  const out = useRef(null);
  const ref = useCanvas((ctx, W, H) => {
    // the background galaxy, painted once
    const RW = 240, RH = 150;
    if (!src.current) {
      const c = document.createElement("canvas"); c.width = RW; c.height = RH;
      const g = c.getContext("2d");
      g.fillStyle = "#03040c"; g.fillRect(0, 0, RW, RH);
      for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(237,235,255,${Math.random() * 0.8})`; g.fillRect(Math.random() * RW, Math.random() * RH, 1, 1); }
      g.save(); g.translate(RW / 2, RH / 2); g.rotate(-0.4);
      for (let i = 0; i < 900; i++) {
        const arm = i % 2, k = Math.random(), a = k * 6 + arm * Math.PI, r = k * 34;
        g.fillStyle = `rgba(${200 + Math.random() * 55},${170 + Math.random() * 60},${220},${0.25 + Math.random() * 0.5})`;
        g.fillRect(Math.cos(a) * r + (Math.random() - 0.5) * 5, (Math.sin(a) * r) * 0.5 + (Math.random() - 0.5) * 4, 1.5, 1.5);
      }
      const core = g.createRadialGradient(0, 0, 0, 0, 0, 12); core.addColorStop(0, "rgba(255,240,210,1)"); core.addColorStop(1, "rgba(255,240,210,0)");
      g.fillStyle = core; g.fillRect(-12, -12, 24, 24);
      g.restore();
      src.current = g.getImageData(0, 0, RW, RH);
      out.current = g.createImageData(RW, RH);
    }
    // bend every pixel: a point lens, beta = theta - thetaE^2 * theta / |theta|^2
    const s = src.current.data, o = out.current.data;
    const lx = lens.current.x * RW, ly = lens.current.y * RH, E2 = 20 * 20;
    for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) {
      const dx = x - lx, dy = y - ly, d2 = dx * dx + dy * dy + 0.01;
      let sx = Math.round(x - (E2 * dx) / d2), sy = Math.round(y - (E2 * dy) / d2);
      const i = (y * RW + x) * 4;
      if (sx < 0 || sy < 0 || sx >= RW || sy >= RH) { o[i] = 3; o[i + 1] = 4; o[i + 2] = 12; o[i + 3] = 255; continue; }
      const j = (sy * RW + sx) * 4;
      o[i] = s[j]; o[i + 1] = s[j + 1]; o[i + 2] = s[j + 2]; o[i + 3] = 255;
    }
    const tmp = document.createElement("canvas"); tmp.width = RW; tmp.height = RH;
    tmp.getContext("2d").putImageData(out.current, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(tmp, 0, 0, W, H);
    // the dark lensing mass
    const px = lens.current.x * W, py = lens.current.y * H;
    ctx.strokeStyle = "rgba(185,192,255,0.5)"; ctx.setLineDash([3, 4]);
    ctx.beginPath(); ctx.arc(px, py, (20 / RW) * W, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
    label(ctx, "dashed: the Einstein ring radius", px, py + (20 / RW) * W + 14, { size: 10 });
  });
  const move = (e) => {
    if (!lens.current.drag) return;
    const r = e.currentTarget.getBoundingClientRect();
    lens.current.x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    lens.current.y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
  };
  return <canvas ref={ref} className="bh-canvas" style={{ cursor: "grab", touchAction: "none" }} onPointerDown={(e) => { lens.current.drag = true; e.currentTarget.setPointerCapture(e.pointerId); move(e); }} onPointerMove={move} onPointerUp={() => { lens.current.drag = false; }} />;
}

// ─────────────────────────── 05 clocks ───────────────────────────
function Clocks() {
  const [depth, setDepth] = useState(0.5);
  const dRef = useRef(depth); dRef.current = depth;
  const hands = useRef({ top: 0, bottom: 0 });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const d = dRef.current;
    // a gravity well, as a curve
    ctx.beginPath();
    for (let x = 0; x <= W; x += 4) {
      const u = (x - W / 2) / (W * 0.18);
      const y = H * 0.2 + (H * 0.62 * d) / Math.sqrt(1 + u * u * 4);
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = "rgba(139,149,246,0.5)"; ctx.lineWidth = 2; ctx.stroke();
    // time rates: exaggerated so you can see it
    const rateTop = 1, rateBottom = Math.max(0.12, 1 - d * 0.85);
    hands.current.top += dt * rateTop * 0.8; hands.current.bottom += dt * rateBottom * 0.8;
    const clock = (x, y, a, name, rate) => {
      const r = Math.min(W, H) * 0.11;
      glow(ctx, x, y, r * 1.8, "rgba(233,210,154,0.25)");
      ctx.fillStyle = "#0b0c22"; ctx.strokeStyle = C.gold; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      for (let i = 0; i < 12; i++) { const q = (i / 12) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(x + Math.cos(q) * r * 0.82, y + Math.sin(q) * r * 0.82); ctx.lineTo(x + Math.cos(q) * r * 0.95, y + Math.sin(q) * r * 0.95); ctx.strokeStyle = C.dim; ctx.stroke(); }
      const q = a * Math.PI * 2 - Math.PI / 2;
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(q) * r * 0.8, y + Math.sin(q) * r * 0.8); ctx.stroke();
      label(ctx, name, x, y + r + 16, { size: 11, color: C.text });
      label(ctx, `${(rate * 100).toFixed(0)}% speed`, x, y + r + 32, { size: 10 });
    };
    clock(W * 0.2, H * 0.22, hands.current.top, "far from the mass", rateTop);
    const by = H * 0.2 + H * 0.62 * d - Math.min(W, H) * 0.12;
    clock(W / 2, Math.max(H * 0.3, by), hands.current.bottom, "deep in the well", rateBottom);
    label(ctx, "exaggerated so you can see it · on Earth the difference is billionths", W / 2, H * 0.95, { size: 10 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <Slider label="depth in the gravity well" min={0} max={1} step={0.01} value={depth} onChange={setDepth} />
        <button className="bh-btn" onClick={() => { hands.current = { top: 0, bottom: 0 }; }}>reset clocks</button>
      </div>
    </>
  );
}

// ─────────────────────────── 06 squeeze ───────────────────────────
const G = 6.674e-11, M_EARTH = 5.972e24, LIGHT = 2.998e8;
const RS_EARTH = (2 * G * M_EARTH) / (LIGHT * LIGHT); // ~8.87 mm
function Squeeze() {
  const [k, setK] = useState(0); // 0 = real Earth .. 1 = 4 mm
  const kRef = useRef(k); kRef.current = k;
  const R = Math.exp(Math.log(6.371e6) + (Math.log(0.004) - Math.log(6.371e6)) * k);
  const v = Math.sqrt((2 * G * M_EARTH) / R);
  const hole = R <= RS_EARTH;
  const fmtLen = (m) => (m >= 1000 ? `${(m / 1000).toLocaleString(undefined, { maximumFractionDigits: m > 1e5 ? 0 : 1 })} km` : m >= 1 ? `${m.toFixed(1)} m` : `${(m * 1000).toFixed(1)} mm`);
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.5);
    const kk = kRef.current;
    const Rk = Math.exp(Math.log(6.371e6) + (Math.log(0.004) - Math.log(6.371e6)) * kk);
    const cx = W / 2, cy = H * 0.48;
    const px = Math.max(3, Math.min(W, H) * 0.34 * (1 - kk * 0.96));
    const isHole = Rk <= RS_EARTH;
    if (!isHole) {
      glow(ctx, cx, cy, px * 1.6, `rgba(90,140,255,${0.25 + kk * 0.3})`);
      const pg = ctx.createRadialGradient(cx - px * 0.3, cy - px * 0.3, 1, cx, cy, px);
      pg.addColorStop(0, kk > 0.6 ? "#fff3d6" : "#6a92e8"); pg.addColorStop(1, kk > 0.6 ? "#d99a6a" : "#18306a");
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(cx, cy, px, 0, Math.PI * 2); ctx.fill();
    } else {
      const hr = Math.min(W, H) * 0.08;
      glow(ctx, cx, cy, hr * 3, "rgba(233,210,154,0.5)", 0.7 + 0.2 * Math.sin(t * 2));
      ctx.strokeStyle = C.gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, hr * 1.5, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(cx, cy, hr, 0, Math.PI * 2); ctx.fill();
      label(ctx, "event horizon · 8.9 mm radius", cx, cy + hr * 1.5 + 18, { size: 11, color: C.gold });
    }
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">radius</span><b>{fmtLen(R)}</b></div>
        <div><span className="mono">escape velocity</span><b>{v >= LIGHT ? "faster than light" : v > 1e6 ? `${(v / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} km/s` : `${(v / 1000).toFixed(1)} km/s`}</b></div>
        <div><span className="mono">of light speed</span><b>{Math.min(100, (v / LIGHT) * 100).toFixed(v / LIGHT < 0.01 ? 4 : 1)}%</b></div>
        <div><span className="mono">status</span><b style={{ color: hole ? C.gold : C.text }}>{hole ? "black hole" : "still a planet"}</b></div>
      </div>
      <div className="bh-controls"><Slider label="squeeze Earth" min={0} max={1} step={0.002} value={k} onChange={setK} /></div>
    </>
  );
}

// ─────────────────────────── 07 cones ───────────────────────────
function Cones() {
  const [r, setR] = useState(4); // in Schwarzschild radii
  const rRef = useRef(r); rRef.current = r;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const hx = W * 0.12, base = H * 0.84;
    const unit = (W * 0.8) / 6; // 6 rs across
    // the hole and horizon, on the left
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, hx, H);
    glow(ctx, hx, H / 2, H * 0.4, "rgba(233,210,154,0.2)");
    ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx + unit, 0); ctx.lineTo(hx + unit, H); ctx.stroke();
    label(ctx, "horizon", hx + unit + 4, H * 0.12, { size: 10, color: C.gold, align: "left" });
    label(ctx, "← toward the black hole", hx + 8, base + 22 > H ? H - 10 : base + 22, { size: 10, align: "left" });
    // cones along the way, and the probe's
    const coneAt = (rr, highlight) => {
      const x = hx + unit * rr, y = base - 10;
      const f = Math.max(0, 1 - 1 / Math.max(rr, 1)); // 1 far away, 0 at the horizon
      const len = H * (highlight ? 0.34 : 0.2);
      // far away the cone opens 45 degrees either side of straight up; it tips
      // toward the hole as you approach; at the horizon its outer edge is
      // straight up; inside, both edges lean in
      const outAng = rr >= 1 ? 0.5 * f : -(1 - rr) * 0.9;
      const inAng = 0.5 + 0.9 * (1 - f) + (rr < 1 ? (1 - rr) * 0.5 : 0);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.sin(outAng) * len, y - Math.cos(outAng) * len);
      ctx.lineTo(x - Math.sin(inAng) * len, y - Math.cos(inAng) * len);
      ctx.closePath();
      ctx.fillStyle = highlight ? "rgba(233,210,154,0.22)" : "rgba(139,149,246,0.1)";
      ctx.strokeStyle = highlight ? C.gold : "rgba(139,149,246,0.45)";
      ctx.lineWidth = highlight ? 2 : 1;
      ctx.fill(); ctx.stroke();
      if (highlight) {
        ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - len); ctx.stroke(); ctx.setLineDash([]);
        glow(ctx, x, y, 16, "rgba(255,255,255,0.8)");
        label(ctx, rr < 1 ? "inside: every future points inward" : rr < 1.12 ? "at the horizon: outward light only hovers" : `${rr.toFixed(1)} × the horizon radius`, Math.min(W - 120, Math.max(hx + 120, x)), base + 14, { size: 11, color: C.text });
      }
    };
    [5.5, 4, 2.8, 1.8].forEach((rr) => { if (Math.abs(rr - rRef.current) > 0.5) coneAt(rr, false); });
    coneAt(rRef.current, true);
    label(ctx, "each cone: every future this moment could reach · up is forward in time", W * 0.58, H * 0.05, { size: 10 });
    void t;
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="probe distance" min={0.6} max={5.5} step={0.01} value={r} onChange={setR} show={r <= 1 ? "inside" : `${r.toFixed(2)} rs`} /></div>
    </>
  );
}

// ─────────────────────────── 08 fall ───────────────────────────
function Fall() {
  const [view, setView] = useState("yours");
  const viewRef = useRef(view); viewRef.current = view;
  const tau = useRef(0);
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.4);
    const hx = W * 0.3, hy = H * 0.5, hr = Math.min(W, H) * 0.16;
    glow(ctx, hx, hy, hr * 2.6, "rgba(233,210,154,0.25)");
    ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(233,210,154,0.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.stroke();
    tau.current += dt;
    const cycle = 9;
    const s = (tau.current % cycle) / cycle;
    let rr, bright, color, halo, clockRate;
    if (viewRef.current === "yours") {
      // seen from far away: approaches the horizon ever more slowly, reddens and fades
      rr = 1 + 3.5 * Math.exp(-s * 5);
      const f = Math.sqrt(1 - 1 / rr);
      bright = Math.max(0.03, f * 1.1); clockRate = f;
      color = `rgb(255,${Math.round(120 + 120 * f)},${Math.round(80 + 170 * f)})`;
      halo = `rgba(255,${Math.round(120 + 120 * f)},${Math.round(80 + 170 * f)},0.9)`;
    } else {
      // their own view: a steady fall, straight through
      rr = Math.max(0, 4.5 - s * 6);
      bright = 1; clockRate = 1; color = "#FFF4DC"; halo = "rgba(255,244,220,0.9)";
    }
    const x = hx + hr * rr, y = hy;
    if (rr > 0.05) {
      glow(ctx, x, y, 22, halo, bright);
      ctx.globalAlpha = Math.min(1, bright + 0.1); ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    }
    label(ctx, viewRef.current === "yours" ? "you, far away, watching" : "your friend, falling", W * 0.72, H * 0.14, { size: 13, color: C.text });
    label(ctx, `their clock, as seen: ${(clockRate * 100).toFixed(0)}% speed`, W * 0.72, H * 0.22, { size: 11 });
    label(ctx, viewRef.current === "yours" ? "redder, dimmer, slower, never quite crossing" : "nothing special at the horizon: straight through", W * 0.72, H * 0.86, { size: 11, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <button className={`bh-btn ${view === "yours" ? "bh-btn-on" : ""}`} onClick={() => setView("yours")}>your view</button>
        <button className={`bh-btn ${view === "theirs" ? "bh-btn-on" : ""}`} onClick={() => setView("theirs")}>their view</button>
      </div>
    </>
  );
}

// ─────────────────────────── 09 real ───────────────────────────
function Real() {
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.26;
    // glowing ring of gas, brighter on the side moving toward us (lower left)
    for (let i = 0; i < 360; i += 2) {
      const a = (i * Math.PI) / 180;
      const beam = 0.45 + 0.55 * Math.max(0, Math.cos(a - 2.4));
      const flick = 0.85 + 0.15 * Math.sin(t * 2 + i * 0.3);
      const rr = R * (1 + 0.015 * Math.sin(i * 0.17 + t * 0.6));
      glow(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, R * 0.24, `rgba(${255},${Math.round(150 + 80 * beam)},${Math.round(60 + 60 * beam)},0.5)`, 0.22 * beam * flick);
    }
    ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(cx, cy, R * 0.72, 0, Math.PI * 2); ctx.fill();
    glow(ctx, cx, cy, R * 0.72, "rgba(0,0,0,0.9)");
    label(ctx, "an artist's rendering in the style of the Event Horizon Telescope images", cx, H * 0.93, { size: 10 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">Sagittarius A*</span><b>~4 million suns</b></div>
        <div><span className="mono">M87*</span><b>~6.5 billion suns</b></div>
        <div><span className="mono">first image</span><b>2019 (M87*)</b></div>
        <div><span className="mono">our galaxy's</span><b>2022 (Sgr A*)</b></div>
      </div>
    </>
  );
}

// ─────────────────────────── 10 hawking ───────────────────────────
function Hawking() {
  const pairs = useRef([]);
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const cx = W * 0.5, cy = H * 1.25, R = H * 0.85;
    ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(233,210,154,0.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    label(ctx, "the event horizon", cx, cy - R + 18, { size: 10, color: C.gold });
    if (Math.random() < dt * 6) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const near = Math.random() < 0.55;
      const d = R + (near ? 4 + Math.random() * 10 : 30 + Math.random() * H * 0.4);
      pairs.current.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, a, age: 0, split: near, life: 1.2 + Math.random() });
    }
    pairs.current.forEach((p) => {
      p.age += dt;
      const sep = Math.min(1, p.age / 0.4) * 9;
      const nx = Math.cos(p.a), ny = Math.sin(p.a);
      if (p.split && p.age > 0.4) {
        // one falls in, one escapes
        const out = (p.age - 0.4) * 60;
        const xi = p.x - nx * (sep + out), yi = p.y - ny * (sep + out);
        const xo = p.x + nx * (sep + out * 1.5), yo = p.y + ny * (sep + out * 1.5);
        if (Math.hypot(xi - cx, yi - cy) > R) { ctx.fillStyle = C.lav; ctx.beginPath(); ctx.arc(xi, yi, 2.5, 0, Math.PI * 2); ctx.fill(); }
        glow(ctx, xo, yo, 12, "rgba(233,210,154,0.9)", 1 - (p.age - 0.4) / p.life);
        ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(xo, yo, 2.5, 0, Math.PI * 2); ctx.fill();
      } else {
        const a2 = Math.max(0, 1 - p.age / 0.8);
        ctx.globalAlpha = a2;
        ctx.fillStyle = C.lav; ctx.beginPath(); ctx.arc(p.x - nx * sep * (1 - p.age), p.y - ny * sep * (1 - p.age), 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = C.rose; ctx.beginPath(); ctx.arc(p.x + nx * sep * (1 - p.age), p.y + ny * sep * (1 - p.age), 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
    pairs.current = pairs.current.filter((p) => p.age < (p.split ? p.life + 0.4 : 0.8));
    label(ctx, "pairs appear and vanish · at the edge, one can fall in while its partner escapes", W / 2, H * 0.08, { size: 10 });
  });
  return <canvas ref={ref} className="bh-canvas" />;
}

const VISUALS = { drop: Drop, sheet: Sheet, orbit: Orbit, lens: Lens, clocks: Clocks, squeeze: Squeeze, cones: Cones, fall: Fall, real: Real, hawking: Hawking };

function Quiz({ issue }) {
  const [picks, setPicks] = useState({});
  const right = issue.quiz.filter((q, i) => picks[i] === q.answer).length;
  const done = Object.keys(picks).length === issue.quiz.length;
  return (
    <div className="bh-quiz">
      <div className="mono bh-kicker">CHECK YOUR ORBIT</div>
      <h2 className="bh-step-title">Three quick questions</h2>
      {issue.quiz.map((q, i) => (
        <div key={i} className="bh-q">
          <div className="bh-q-text">{q.q}</div>
          <div className="bh-q-opts">
            {q.options.map((o, j) => {
              const chosen = picks[i] === j, shown = picks[i] !== undefined;
              return (
                <button key={j} disabled={shown} onClick={() => setPicks((p) => ({ ...p, [i]: j }))}
                  className={`bh-opt ${shown && j === q.answer ? "bh-opt-right" : ""} ${chosen && j !== q.answer ? "bh-opt-wrong" : ""}`}>{o}</button>
              );
            })}
          </div>
        </div>
      ))}
      {done && <div className="bh-score">{right} of {issue.quiz.length}. {right === issue.quiz.length ? "You have the shape of it." : "Go back through any step - they're all still there."}</div>}
      <div className="bh-nextweek">{issue.next}</div>
    </div>
  );
}

export default function BlackHoleDive({ issue }) {
  const [i, setI] = useState(0);
  const n = issue.steps.length;
  const atQuiz = i === n;
  const go = useCallback((d) => setI((x) => Math.max(0, Math.min(n, x + d))), [n]);
  useEffect(() => {
    const onKey = (e) => {
      if (/input|textarea/i.test(e.target.tagName)) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [i]);
  const step = issue.steps[i];
  const Visual = step ? VISUALS[step.visual] : null;
  return (
    <div className="bh">
      <div className="bh-top">
        <Link href="/galaxy/black-hole" className="mono bh-back">&larr; The Black Hole</Link>
        <div className="bh-dots" aria-label={`Step ${Math.min(i + 1, n + 1)} of ${n + 1}`}>
          {Array.from({ length: n + 1 }, (_, k) => (
            <button key={k} className={`bh-dot ${k === i ? "bh-dot-on" : k < i ? "bh-dot-done" : ""}`} onClick={() => setI(k)} aria-label={k === n ? "Questions" : `Step ${k + 1}`} />
          ))}
        </div>
        <div className="mono bh-issue">NO. {issue.number} &middot; {issue.title.toUpperCase()}</div>
      </div>

      {atQuiz ? (
        <Quiz issue={issue} />
      ) : (
        <div className="bh-step" key={step.id}>
          <div className="bh-visual">{Visual && <Visual />}</div>
          <div className="bh-words">
            <div className="mono bh-kicker">{step.kicker}</div>
            <h2 className="bh-step-title">{step.title}</h2>
            {step.text.map((p, k) => <p key={k}>{p}</p>)}
            <div className="mono bh-hint">{step.hint}</div>
          </div>
        </div>
      )}

      <div className="bh-nav">
        <button className="bh-btn" onClick={() => go(-1)} disabled={i === 0}>&larr; back</button>
        <span className="mono bh-count">{atQuiz ? "the check" : `${i + 1} / ${n}`}</span>
        {atQuiz ? (
          <Link href="/galaxy" className="bh-btn bh-btn-on">back to The Galaxy</Link>
        ) : (
          <button className="bh-btn bh-btn-on" onClick={() => go(1)}>{i === n - 1 ? "the check →" : "next →"}</button>
        )}
      </div>
    </div>
  );
}
