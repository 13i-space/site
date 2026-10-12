"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, seeded, Slider } from "./kit";
import { ping, soundOn } from "../../lib/spaceSound";

// THE BLACK HOLE No. 10 · The Missing Mass (Update 5.77).
// Pictures: spin · curve · cluster · arcs · bullet · pie · hunt · web.
// The words are in lib/blackhole/10-the-missing-mass.js.

// orbital speed at radius r (0..1): from visible matter alone (it falls off
// beyond the bright centre), and with a dark halo added (it stays flat)
const vSeen = (r) => { const rc = 0.18; return (r / rc) * Math.exp(0.5 * (1 - (r * r) / (rc * rc))) * 0.9 + 0.02 * 0; };
const vSeenSafe = (r) => (r < 0.18 ? vSeen(r) : 0.9 * Math.sqrt(0.18 / r));
const vHalo = (r) => Math.sqrt(vSeenSafe(r) ** 2 + 0.65 * (1 - (0.12 / (r + 0.12)) * 1.0) * 1.1);

// ─────────────────────────── spin: two whirlpools ───────────────────────────
function Spin() {
  const S = useRef(null);
  if (!S.current) { const r = seeded(13); S.current = Array.from({ length: 900 }, () => { const rr = 0.04 + Math.pow(r(), 0.8) * 0.96; return { r: rr, a: r() * 6.28 + rr * 4 }; }); }
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const sz = fit(W, 60), R = Math.min(W * 0.22, H * 0.36);
    // left: the solar system, outer planets slow
    const lx = W * 0.25, cy = H * 0.48;
    glow(ctx, lx, cy, 22, "rgba(255,230,170,0.9)");
    [0.15, 0.25, 0.38, 0.55, 0.75, 0.95].forEach((rr, i) => { const a = t * 1.4 * Math.pow(rr / 0.15, -1.5) + i * 1.3; ctx.strokeStyle = "rgba(139,149,246,0.18)"; ctx.beginPath(); ctx.arc(lx, cy, rr * R, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = C.lav; ctx.beginPath(); ctx.arc(lx + Math.cos(a) * rr * R, cy + Math.sin(a) * rr * R, 3.5, 0, Math.PI * 2); ctx.fill(); });
    label(ctx, "the solar system: farther planets crawl", lx, H * 0.9, { size: sz, color: C.text });
    // right: a galaxy, whose outer stars keep up
    const gx = W * 0.73;
    S.current.forEach((s) => { s.a += dt * (vHalo(s.r) / s.r) * 0.35; const x = gx + Math.cos(s.a) * s.r * R, y = cy + Math.sin(s.a) * s.r * R * 0.6; ctx.fillStyle = s.r < 0.25 ? "rgba(255,236,200,0.9)" : "rgba(210,215,255,0.7)"; ctx.fillRect(x, y, 1.5, 1.5); });
    glow(ctx, gx, cy, R * 0.3, "rgba(255,230,190,0.6)");
    label(ctx, "a galaxy: the outer stars keep pace", gx, H * 0.9, { size: sz, color: C.gold });
  });
  return <canvas ref={ref} className="bh-canvas" />;
}

// ─────────────────────────── curve: Vera Rubin's plot ───────────────────────────
function Curve() {
  const [halo, setHalo] = useState(0);
  const hRef = useRef(halo); hRef.current = halo;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const sz = fit(W, 60), x0 = W * 0.1, x1 = W * 0.94, y0 = H * 0.84, y1 = H * 0.14, hh = hRef.current;
    ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    label(ctx, "distance from the galaxy's centre →", (x0 + x1) / 2, y0 + 16, { size: sz });
    ctx.save(); ctx.translate(x0 - 14, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); label(ctx, "orbit speed", 0, 0, { size: sz }); ctx.restore();
    const px = (r) => x0 + r * (x1 - x0), py = (v) => y0 - (v / 1.2) * (y0 - y1);
    // measured: flat
    const r = seeded(8);
    for (let i = 2; i <= 40; i++) { const rr = i / 40, v = vHalo(rr) + (r() - 0.5) * 0.05; ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(px(rr), py(v), 3, 0, Math.PI * 2); ctx.fill(); }
    // prediction: visible matter, plus however much dark halo you add
    ctx.beginPath(); for (let i = 1; i <= 200; i++) { const rr = i / 200, v = Math.sqrt(vSeenSafe(rr) ** 2 + hh * (vHalo(rr) ** 2 - vSeenSafe(rr) ** 2)); i > 1 ? ctx.lineTo(px(rr), py(v)) : ctx.moveTo(px(rr), py(v)); } ctx.strokeStyle = C.lav; ctx.lineWidth = 2.5; ctx.stroke(); ctx.lineWidth = 1;
    label(ctx, "gold: measured · lavender: what the visible matter predicts", W / 2, H * 0.07, { size: sz, color: C.text });
    if (hh > 0.95) label(ctx, "a match: about five times more unseen mass than seen", W / 2, H * 0.94, { size: sz, color: C.gold });
    void t;
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="add invisible mass" min={0} max={1} step={0.01} value={halo} onChange={setHalo} show={halo < 0.05 ? "none" : halo > 0.95 ? "it fits" : "more"} /></div>
    </>
  );
}

// ─────────────────────────── cluster: Zwicky's swarm ───────────────────────────
function Cluster() {
  const [dark, setDark] = useState(false);
  const dRef = useRef(dark); dRef.current = dark;
  const S = useRef(null);
  const make = () => { const r = seeded(19); return Array.from({ length: 60 }, () => { const a = r() * 6.28, d = 0.1 + r() * 0.4, sp = 0.55 + r() * 0.3; return { x: Math.cos(a) * d, y: Math.sin(a) * d, vx: -Math.sin(a) * sp * 0.6 + (r() - 0.5) * 0.4, vy: Math.cos(a) * sp * 0.6 + (r() - 0.5) * 0.4 }; }); };
  if (!S.current) S.current = make();
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const sz = fit(W, 60), cx = W / 2, cy = H * 0.48, R = Math.min(W, H) * 0.42, GM = dRef.current ? 0.32 : 0.05;
    if (dRef.current) glow(ctx, cx, cy, R * 0.9, "rgba(139,149,246,0.22)");
    S.current.forEach((g) => {
      for (let k = 0; k < 4; k++) { const h = dt * 0.25, d = Math.hypot(g.x, g.y) + 0.05, a = GM / (d * d); g.vx -= (g.x / d) * a * h; g.vy -= (g.y / d) * a * h; g.x += g.vx * h; g.y += g.vy * h; }
      const x = cx + g.x * R, y = cy + g.y * R;
      glow(ctx, x, y, 7, "rgba(255,236,200,0.7)"); ctx.fillStyle = "#fff4dc"; ctx.fillRect(x - 1, y - 1, 2.2, 2.2);
    });
    const gone = S.current.filter((g) => Math.hypot(g.x, g.y) > 1.2).length;
    label(ctx, dRef.current ? "with about 5× extra unseen mass, the swarm holds together" : gone > 10 ? "with only the mass we can see, the galaxies fly apart" : "galaxies in a cluster, moving fast", W / 2, H * 0.94, { size: sz, color: dRef.current ? C.gold : gone > 10 ? C.rose : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <button className={`bh-btn ${!dark ? "bh-btn-on" : ""}`} onClick={() => { setDark(false); S.current = make(); }}>only what we can see</button>
        <button className={`bh-btn ${dark ? "bh-btn-on" : ""}`} onClick={() => { setDark(true); S.current = make(); }}>add dark matter</button>
      </div>
    </>
  );
}

// ─────────────────────────── arcs: weighing with light ───────────────────────────
function Arcs() {
  const [map, setMap] = useState(false);
  const mRef = useRef(map); mRef.current = map;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const sz = fit(W, 60), cx = W / 2, cy = H * 0.47, R = Math.min(W, H) * 0.24;
    if (mRef.current) { glow(ctx, cx, cy, R * 2.1, "rgba(111,140,255,0.55)"); glow(ctx, cx, cy, R * 1.1, "rgba(139,160,255,0.5)"); }
    const r = seeded(31);
    for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = r() * R * 0.8; glow(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, 10, "rgba(255,226,170,0.75)"); }
    // stretched background galaxies: arcs around the hidden mass
    for (let i = 0; i < 7; i++) { const a = r() * 6.28, rr = R * (1.05 + r() * 0.5), len = 0.35 + r() * 0.4; ctx.strokeStyle = `rgba(150,190,255,${0.55 + 0.25 * Math.sin(t + i)})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, rr, a, a + len); ctx.stroke(); }
    ctx.lineWidth = 1;
    label(ctx, mRef.current ? "blue: where the mass really is, worked out from the bending" : "blue arcs: far-off galaxies, bent around the cluster", W / 2, H * 0.93, { size: sz, color: mRef.current ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><button className={`bh-btn ${map ? "bh-btn-on" : ""}`} onClick={() => setMap(!map)}>{map ? "hide the mass map" : "show the mass map"}</button></div>
    </>
  );
}

// ─────────────────────────── bullet: the cosmic crash ───────────────────────────
function Bullet() {
  const [k, setK] = useState(0.2);
  const kRef = useRef(k); kRef.current = k;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const kk = kRef.current, sz = fit(W, 60), cy = H * 0.48, sep = (kk - 0.45) * W * 0.9;
    // dark matter and galaxies pass straight through; the hot gas collides and lags
    const gasSep = sep * (kk < 0.45 ? 1 : 0.25);
    [-1, 1].forEach((s) => {
      const dx = W / 2 + s * Math.abs(sep) * (kk < 0.45 ? -1 : 1) * 0.5, gx = W / 2 + s * Math.abs(gasSep) * (kk < 0.45 ? -1 : 1) * 0.5;
      glow(ctx, dx, cy, Math.min(W, H) * (s > 0 ? 0.18 : 0.24), "rgba(90,130,255,0.55)");
      glow(ctx, gx, cy, Math.min(W, H) * 0.16, "rgba(255,90,170,0.55)");
      const r = seeded(s > 0 ? 3 : 5); for (let i = 0; i < 18; i++) { ctx.fillStyle = "rgba(255,240,215,0.9)"; ctx.fillRect(dx + (r() - 0.5) * 60, cy + (r() - 0.5) * 60, 2, 2); }
    });
    label(ctx, "pink: hot gas (most of the normal matter) · blue: where the mass is", W / 2, H * 0.08, { size: sz, color: C.text });
    if (kk > 0.6) label(ctx, "after the crash, the mass and the gas have separated: the mass is mostly not the gas", W / 2, H * 0.93, { size: sz, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="the collision" min={0} max={1} step={0.005} value={k} onChange={setK} show={k < 0.4 ? "approaching" : k < 0.5 ? "colliding" : "passed through"} /></div>
    </>
  );
}

// ─────────────────────────── pie: what everything is ───────────────────────────
const SLICES = [["ordinary matter: every star, planet, person, gas cloud", 5, "#E9D29A"], ["dark matter", 27, "#6f7ad6"], ["dark energy", 68, "#2a2f66"]];
function Pie() {
  const [hi, setHi] = useState(0);
  const hRef = useRef(hi); hRef.current = hi;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const sz = fit(W, 55), cx = W * 0.32, cy = H * 0.5, R = Math.min(W * 0.26, H * 0.4);
    let a = -Math.PI / 2;
    SLICES.forEach(([n, p, col], i) => { const b = a + (p / 100) * Math.PI * 2, out = i === hRef.current ? 10 : 0, m = (a + b) / 2; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx + Math.cos(m) * out, cy + Math.sin(m) * out); ctx.arc(cx + Math.cos(m) * out, cy + Math.sin(m) * out, R, a, b); ctx.closePath(); ctx.fill(); a = b; });
    const [n, p, col] = SLICES[hRef.current];
    label(ctx, `${p}%`, W * 0.75, H * 0.4, { size: sz + 18, color: col === "#2a2f66" ? C.lav : col, font: "Fraunces" });
    label(ctx, n, W * 0.75, H * 0.55, { size: sz, color: C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">{["ordinary matter", "dark matter", "dark energy"].map((s, i) => <button key={i} className={`bh-btn ${hi === i ? "bh-btn-on" : ""}`} onClick={() => setHi(i)}>{s}</button>)}</div>
    </>
  );
}

// ─────────────────────────── hunt: waiting deep underground ───────────────────────────
function Hunt() {
  const [years, setYears] = useState(0);
  const S = useRef({ flashes: [] });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    const sz = fit(W, 60), s = S.current;
    // rock above, a tank of liquid xenon below
    ctx.fillStyle = "#2a2220"; ctx.fillRect(0, 0, W, H * 0.35);
    for (let i = 0; i < 60; i++) { ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fillRect((i * 97) % W, (i * 53) % (H * 0.35), 30, 3); }
    label(ctx, "1.5 km of rock, to block cosmic rays", W / 2, H * 0.17, { size: sz, color: C.text });
    const tx = W * 0.3, tw = W * 0.4, ty = H * 0.45, th = H * 0.42;
    ctx.fillStyle = "rgba(111,195,168,0.08)"; ctx.fillRect(tx, ty, tw, th); ctx.strokeStyle = C.teal; ctx.strokeRect(tx, ty, tw, th);
    label(ctx, "liquid xenon, watched by light sensors", W / 2, ty + th + 14, { size: sz - 1 });
    // dark matter streaming through, unseen, harmless: shown faintly
    for (let i = 0; i < 40; i++) { const x = ((t * 80 + i * 47) % (W + 40)) - 20, y = (i * 37) % H; ctx.fillStyle = "rgba(139,149,246,0.25)"; ctx.fillRect(x, y, 2, 2); }
    if (Math.random() < dt * 1.5) s.flashes.push({ x: tx + Math.random() * tw, y: ty + Math.random() * th, age: 0 });
    s.flashes.forEach((f) => { f.age += dt; glow(ctx, f.x, f.y, 10, "rgba(255,200,140,0.9)", 1 - f.age / 0.5); });
    s.flashes = s.flashes.filter((f) => f.age < 0.5);
    label(ctx, "orange flashes: ordinary background radioactivity · a dark matter hit would look different", W / 2, H * 0.4, { size: sz - 1, color: C.warm });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">years of watching</span><b>{years}</b></div>
        <div><span className="mono">dark matter seen</span><b>{years ? "none yet" : "—"}</b></div>
        <div><span className="mono">passing through you</span><b style={{ fontSize: 12 }}>possibly billions a second</b></div>
        <div><span className="mono">felt</span><b>none</b></div>
      </div>
      <div className="bh-controls"><button className="bh-btn bh-btn-on" onClick={() => { setYears(years + 1); if (soundOn()) ping(240, 0.04); }}>watch for another year</button></div>
    </>
  );
}

// ─────────────────────────── web: the scaffolding ───────────────────────────
function Web() {
  const [k, setK] = useState(0);
  const kRef = useRef(k); kRef.current = k;
  const S = useRef(null);
  if (!S.current) {
    const r = seeded(57), modes = Array.from({ length: 18 }, () => { const kk = 6 + r() * 14, a = r() * 6.28; return { kx: Math.cos(a) * kk, ky: Math.sin(a) * kk, ph: r() * 6.28 }; });
    const f = (x, y) => -Math.abs(modes.reduce((s, m) => s + Math.cos(m.kx * x + m.ky * y + m.ph), 0));
    S.current = Array.from({ length: 2600 }, () => { let x = r(), y = r(); const x0 = x, y0 = y; for (let s = 0; s < 25; s++) { const e = 0.003, gx = (f(x + e, y) - f(x - e, y)) / (2 * e), gy = (f(x, y + e) - f(x, y - e)) / (2 * e); x += gx * 0.0006; y += gy * 0.0006; } return { x0, y0, x, y }; });
  }
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const kk = Math.pow(kRef.current, 0.8), sz = fit(W, 55);
    S.current.forEach((p, i) => { const x = (p.x0 + (p.x - p.x0) * kk) * W, y = (p.y0 + (p.y - p.y0) * kk) * H; ctx.fillStyle = i % 9 ? `rgba(139,149,246,${0.35 + 0.3 * kk})` : `rgba(255,236,200,${0.4 + 0.6 * kk})`; ctx.fillRect(x, y, 1.4, 1.4); });
    ctx.fillStyle = "rgba(5,6,15,0.7)"; ctx.fillRect(0, H * 0.88, W, H * 0.12);
    label(ctx, kk < 0.2 ? "the early universe: almost perfectly smooth" : kk < 0.9 ? "dark matter pulls itself into threads and knots" : "the cosmic web: galaxies (gold) strung along threads of dark matter", W / 2, H * 0.94, { size: sz, color: kk >= 0.9 ? C.gold : C.text });
    void t;
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="13.8 billion years" min={0} max={1} step={0.005} value={k} onChange={setK} /></div>
    </>
  );
}

export const ISSUE_10 = { spin: Spin, curve: Curve, cluster: Cluster, arcs: Arcs, bullet: Bullet, pie: Pie, hunt: Hunt, web: Web };
