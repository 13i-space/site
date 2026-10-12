"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, Slider } from "./kit";
import { ping, soundOn } from "../../lib/spaceSound";

// THE BLACK HOLE No. 08 · The Long Way Around (Update 5.77).
// Pictures: upward · chase · hohmann · rocket · slingshot · lagrange ·
// delay · voyager. The words are in lib/blackhole/08-the-long-way-around.js.

const arrowTo = (ctx, x0, y0, x1, y1, col) => { const a = Math.atan2(y1 - y0, x1 - x0); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - Math.cos(a - 0.4) * 8, y1 - Math.sin(a - 0.4) * 8); ctx.lineTo(x1 - Math.cos(a + 0.4) * 8, y1 - Math.sin(a + 0.4) * 8); ctx.closePath(); ctx.fill(); ctx.lineWidth = 1; };

// ─────────────────────────── upward: space is close, orbit is hard ───────────────────────────
const RE = 6371, MU = 398600; // km, km³/s²
function Upward() {
  const [v, setV] = useState(5);
  const vRef = useRef(v); vRef.current = v;
  const S = useRef({ ship: null, verdict: "" });
  const launch = () => { S.current = { ship: { x: 0, y: RE + 200, vx: vRef.current, vy: 0, trail: [], t: 0 }, verdict: "" }; };
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.4);
    const cx = W / 2, cy = H * 0.55, sc = (Math.min(W, H) * 0.36) / RE, sz = fit(W, 55);
    glow(ctx, cx, cy, RE * sc * 1.15, "rgba(90,150,255,0.35)");
    ctx.fillStyle = "#1d3c7a"; ctx.beginPath(); ctx.arc(cx, cy, RE * sc, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(140,200,255,0.6)"; ctx.lineWidth = Math.max(1, 100 * sc); ctx.beginPath(); ctx.arc(cx, cy, (RE + 50) * sc, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1;
    label(ctx, W < 520 ? "space: 100 km up" : "the edge of space: 100 km up, thinner than this line", cx + RE * sc * 0.72, cy - RE * sc * 0.78 - 12, { size: sz - 1, align: "left", color: "rgba(140,200,255,0.9)" });
    const s = S.current, sh = s.ship;
    if (sh) {
      for (let k = 0; k < 40; k++) {
        const r = Math.hypot(sh.x, sh.y), a = MU / (r * r);
        const h = dt * 18; // seconds of flight per substep (time sped up)
        sh.vx -= (sh.x / r) * a * h; sh.vy -= (sh.y / r) * a * h; sh.x += sh.vx * h; sh.y += sh.vy * h; sh.t += h;
        if (r < RE) { s.verdict = "it fell back to the ground"; s.ship = null; break; }
        if (r > RE * 4) { s.verdict = "it escaped Earth completely"; s.ship = null; break; }
      }
      if (s.ship) { sh.trail.push([sh.x, sh.y]); if (sh.trail.length > 900) sh.trail.shift(); if (sh.t > 5400 && !s.verdict) s.verdict = "in orbit: one lap every 90 minutes or so"; }
      ctx.beginPath(); sh.trail.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * sc, cy - y * sc) : ctx.moveTo(cx + x * sc, cy - y * sc))); ctx.strokeStyle = "rgba(233,210,154,0.7)"; ctx.stroke();
      if (s.ship) { glow(ctx, cx + sh.x * sc, cy - sh.y * sc, 10, "rgba(255,255,255,0.9)"); }
    }
    if (s.verdict) label(ctx, s.verdict, W / 2, H * 0.08, { size: sz + 1, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <Slider label="sideways speed" min={1} max={11.5} step={0.05} value={v} onChange={setV} show={`${v.toFixed(1)} km/s`} />
        <button className="bh-btn bh-btn-on" onClick={launch}>launch</button>
      </div>
    </>
  );
}

// ─────────────────────────── chase: slow down to catch up ───────────────────────────
function Chase() {
  const S = useRef(null);
  const [fuel, setFuel] = useState(0);
  const reset = () => { S.current = { me: { x: 1, y: 0, vx: 0, vy: 1, tr: [] }, it: { a: 0.6 }, done: false, best: 9 }; setFuel(0); };
  if (!S.current) reset();
  const burn = (dir) => {
    const m = S.current.me, sp = Math.hypot(m.vx, m.vy);
    m.vx += (m.vx / sp) * 0.035 * dir; m.vy += (m.vy / sp) * 0.035 * dir; setFuel((f) => f + 1);
    if (soundOn()) ping(dir > 0 ? 520 : 390, 0.04);
  };
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const s = S.current, cx = W / 2, cy = H / 2, sc = Math.min(W, H) * 0.36, sz = fit(W, 55);
    ctx.fillStyle = "#1d3c7a"; ctx.beginPath(); ctx.arc(cx, cy, sc * 0.35, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(139,149,246,0.25)"; ctx.beginPath(); ctx.arc(cx, cy, sc, 0, Math.PI * 2); ctx.stroke();
    const h = dt * 0.5 / 4;
    for (let k = 0; k < 4; k++) {
      const m = s.me, r = Math.hypot(m.x, m.y), a = 1 / (r * r);
      m.vx -= (m.x / r) * a * h; m.vy -= (m.y / r) * a * h; m.x += m.vx * h; m.y += m.vy * h;
      s.it.a += h; // the target: a circle at r = 1, speed 1
    }
    const m = s.me; m.tr.push([m.x, m.y]); if (m.tr.length > 500) m.tr.shift();
    ctx.beginPath(); m.tr.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * sc, cy - y * sc) : ctx.moveTo(cx + x * sc, cy - y * sc))); ctx.strokeStyle = "rgba(233,210,154,0.55)"; ctx.stroke();
    const tx = Math.cos(s.it.a), ty = Math.sin(s.it.a);
    glow(ctx, cx + tx * sc, cy - ty * sc, 16, "rgba(111,195,168,0.9)"); ctx.fillStyle = C.teal; ctx.beginPath(); ctx.arc(cx + tx * sc, cy - ty * sc, 5, 0, Math.PI * 2); ctx.fill();
    glow(ctx, cx + m.x * sc, cy - m.y * sc, 16, "rgba(233,210,154,0.9)"); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(cx + m.x * sc, cy - m.y * sc, 5, 0, Math.PI * 2); ctx.fill();
    const d = Math.hypot(m.x - tx, m.y - ty), rel = Math.hypot(m.vx + ty, m.vy - tx);
    if (!s.done && d < 0.06 && rel < 0.12) { s.done = true; if (soundOn()) { ping(660, 0.06); setTimeout(() => ping(990, 0.06), 130); } }
    label(ctx, s.done ? "caught it · you slowed down to catch up" : W < 520 ? "gold: you · green: the station" : "gold: you · green: the station ahead of you · catch it", W / 2, H * 0.06, { size: sz, color: s.done ? C.gold : C.text });
    label(ctx, `gap: ${Math.round(d * 6800).toLocaleString()} km`, W / 2, H * 0.94, { size: sz });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <button className="bh-btn bh-btn-on" onClick={() => burn(1)}>burn forward</button>
        <button className="bh-btn bh-btn-on" onClick={() => burn(-1)}>burn backward</button>
        <button className="bh-btn" onClick={reset}>reset</button>
        <span className="mono bh-slider-val" style={{ fontSize: 11 }}>burns: {fuel}</span>
      </div>
    </>
  );
}

// ─────────────────────────── hohmann: to Mars ───────────────────────────
const GM_SUN = 4 * Math.PI * Math.PI; // AU³/yr²
function Hohmann() {
  const S = useRef({ yr: 0, ship: null, result: "" });
  const [, setTick] = useState(0);
  const launch = () => { const s = S.current; if (s.ship) return; const a0 = (s.yr / 1) * Math.PI * 2, at = (1 + 1.524) / 2, v = Math.sqrt(GM_SUN * (2 / 1 - 1 / at)); s.ship = { x: Math.cos(a0), y: Math.sin(a0), vx: -Math.sin(a0) * v, vy: Math.cos(a0) * v, t: 0, tr: [] }; s.result = ""; setTick((x) => x + 1); if (soundOn()) ping(440, 0.05); };
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const s = S.current, cx = W * 0.4, cy = H * 0.5, sc = Math.min(W * 0.36, H * 0.42) / 1.6, sz = fit(W, 60);
    const yrs = dt / 6; s.yr += yrs;
    const ea = s.yr * Math.PI * 2, ma = 2.4 + (s.yr / 1.881) * Math.PI * 2;
    glow(ctx, cx, cy, 30, "rgba(255,230,170,0.9)"); ctx.fillStyle = "#ffe9b0"; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(111,160,230,0.3)"; ctx.beginPath(); ctx.arc(cx, cy, sc, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "rgba(220,120,90,0.3)"; ctx.beginPath(); ctx.arc(cx, cy, 1.524 * sc, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#6fa3e8"; ctx.beginPath(); ctx.arc(cx + Math.cos(ea) * sc, cy - Math.sin(ea) * sc, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#d9785a"; ctx.beginPath(); ctx.arc(cx + Math.cos(ma) * 1.524 * sc, cy - Math.sin(ma) * 1.524 * sc, 5, 0, Math.PI * 2); ctx.fill();
    if (s.ship) {
      const sh = s.ship, n = 30, h = yrs / n;
      for (let k = 0; k < n; k++) { const r = Math.hypot(sh.x, sh.y), a = GM_SUN / (r * r); sh.vx -= (sh.x / r) * a * h; sh.vy -= (sh.y / r) * a * h; sh.x += sh.vx * h; sh.y += sh.vy * h; sh.t += h; }
      sh.tr.push([sh.x, sh.y]);
      ctx.beginPath(); sh.tr.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * sc, cy - y * sc) : ctx.moveTo(cx + x * sc, cy - y * sc))); ctx.strokeStyle = "rgba(233,210,154,0.8)"; ctx.stroke();
      glow(ctx, cx + sh.x * sc, cy - sh.y * sc, 10, "rgba(255,255,255,0.9)");
      if (Math.hypot(sh.x, sh.y) >= 1.52 || sh.t > 0.9) {
        const sa = Math.atan2(sh.y, sh.x), miss = (((ma - sa) * 180) / Math.PI + 540) % 360 - 180;
        s.result = Math.abs(miss) < 7 ? `arrived with Mars right there · ${Math.round(sh.t * 365)} days` : `reached Mars' orbit after ${Math.round(sh.t * 365)} days · Mars was ${Math.abs(Math.round(miss))}° ${miss > 0 ? "ahead" : "behind"}`;
        if (soundOn()) Math.abs(miss) < 7 ? (ping(660, 0.06), setTimeout(() => ping(990, 0.06), 140)) : ping(200, 0.06);
        s.ship = null; setTick((x) => x + 1);
      }
    }
    const lead = (((ma - ea) * 180) / Math.PI % 360 + 360) % 360;
    const rx = W * 0.82;
    label(ctx, "Mars ahead of Earth by", rx, H * 0.3, { size: sz - 1 });
    label(ctx, `${Math.round(lead)}°`, rx, H * 0.38, { size: sz + 8, color: Math.abs(lead - 44) < 6 ? C.gold : C.text, font: "Fraunces" });
    label(ctx, "launch when it's about 44°", rx, H * 0.47, { size: sz - 1, color: C.gold });
    if (s.result) label(ctx, s.result, W / 2, H * 0.94, { size: sz, color: s.result.startsWith("arrived") ? C.gold : C.rose });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><button className="bh-btn bh-btn-on" onClick={launch}>launch for Mars</button><span className="mono bh-slider-val" style={{ fontSize: 11 }}>one year passes every 6 seconds</span></div>
    </>
  );
}

// ─────────────────────────── rocket: the rocket equation ───────────────────────────
const GOALS = [[9.4, "low Earth orbit"], [12.5, "on the way to the Moon"], [13.0, "on the way to Mars"]];
function Rocket() {
  const [f, setF] = useState(0.8);
  const [ve, setVe] = useState(3);
  const fRef = useRef(f); fRef.current = f;
  const dv = ve * Math.log(1 / (1 - f));
  const reached = GOALS.filter(([g]) => dv >= g).map((g) => g[1]);
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const ff = fRef.current, sz = fit(W, 60);
    // the rocket: fuel fills it from the bottom
    const rx = W * 0.18, rw = Math.min(W * 0.1, 60), top = H * 0.12, bot = H * 0.86, len = bot - top;
    ctx.strokeStyle = "#cfd3e8"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(rx - rw / 2, bot); ctx.lineTo(rx - rw / 2, top + rw); ctx.lineTo(rx, top); ctx.lineTo(rx + rw / 2, top + rw); ctx.lineTo(rx + rw / 2, bot); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = "rgba(233,210,154,0.6)"; ctx.fillRect(rx - rw / 2 + 3, bot - (len - rw) * ff, rw - 6, (len - rw) * ff - 2);
    ctx.fillStyle = C.teal; ctx.fillRect(rx - rw / 2 + 3, top + rw + 2, rw - 6, Math.max(4, (len - rw) * (1 - ff) * 0.25));
    label(ctx, "fuel", rx, bot - (len - rw) * ff / 2, { size: sz - 1, color: "#14163A" });
    label(ctx, "payload", rx + rw / 2 + 8, top + rw + 8, { size: sz - 1, align: "left", color: C.teal });
    glow(ctx, rx, bot + 14, 24, "rgba(255,170,90,0.8)", 0.6 + 0.3 * Math.sin(t * 20));
    // the speed it can reach, against where you want to go
    const x0 = W * 0.38, x1 = W * 0.95, y = H * 0.5, max = 16, px = (v) => x0 + (Math.min(v, max) / max) * (x1 - x0);
    const dvv = ve * Math.log(1 / (1 - ff));
    ctx.fillStyle = "rgba(20,22,58,0.9)"; ctx.fillRect(x0, y - 12, x1 - x0, 24);
    ctx.fillStyle = C.gold; ctx.fillRect(x0, y - 12, px(dvv) - x0, 24);
    GOALS.forEach(([g, n], i) => { const x = px(g); ctx.strokeStyle = dvv >= g ? C.teal : C.rose; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - 20); ctx.lineTo(x, y + 20); ctx.stroke(); ctx.lineWidth = 1; label(ctx, n, x, y + [-30, 34, -48][i], { size: sz - 1, color: dvv >= g ? C.teal : C.dim }); });
    label(ctx, `change in speed: ${dvv.toFixed(1)} km/s`, (x0 + x1) / 2, H * 0.2, { size: sz + 2, color: C.text });
    if (W >= 520) label(ctx, "doubling the fuel doesn't double the speed: the fuel has to lift the fuel", (x0 + x1) / 2, H * 0.86, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">fuel</span><b>{Math.round(f * 100)}% of the rocket</b></div>
        <div><span className="mono">exhaust speed</span><b>{ve} km/s</b></div>
        <div><span className="mono">speed gained</span><b>{dv.toFixed(1)} km/s</b></div>
        <div><span className="mono">can reach</span><b style={{ fontSize: 12 }}>{reached.length ? reached[reached.length - 1] : "not even orbit"}</b></div>
      </div>
      <div className="bh-controls">
        <Slider label="how much is fuel" min={0} max={0.96} step={0.005} value={f} onChange={setF} />
        <button className={`bh-btn ${ve === 3 ? "bh-btn-on" : ""}`} onClick={() => setVe(3)}>kerosene</button>
        <button className={`bh-btn ${ve === 4.4 ? "bh-btn-on" : ""}`} onClick={() => setVe(4.4)}>liquid hydrogen</button>
      </div>
    </>
  );
}

// ─────────────────────────── slingshot: a free push ───────────────────────────
function Slingshot() {
  const [b, setB] = useState(0.7);
  const bRef = useRef(b); bRef.current = b;
  const S = useRef({ t0: -1, run: null });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const s = S.current, sz = fit(W, 60), sc = Math.min(W, H) / 10, cx = W / 2, cy = H * 0.5;
    if (!s.run || s.run.b !== bRef.current || s.run.time > 9) {
      s.run = { b: bRef.current, time: 0, p: { x: -4 + bRef.current, y: 0 }, c: { x: 0, y: -4.5, vx: 0, vy: 1 }, tr: [], v0: 1 };
    }
    const r = s.run, n = 20, h = (dt * 1.2) / n;
    for (let k = 0; k < n; k++) {
      r.p.x += 1 * h; // the planet moves right at speed 1
      const dx = r.p.x - r.c.x, dy = r.p.y - r.c.y, d2 = dx * dx + dy * dy + 0.04, d = Math.sqrt(d2), a = 0.9 / d2;
      r.c.vx += (dx / d) * a * h; r.c.vy += (dy / d) * a * h; r.c.x += r.c.vx * h; r.c.y += r.c.vy * h; r.time += h;
    }
    r.tr.push([r.c.x, r.c.y]);
    // the planet's path and the planet
    ctx.setLineDash([3, 5]); ctx.strokeStyle = "rgba(139,149,246,0.3)"; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke(); ctx.setLineDash([]);
    const px = cx + r.p.x * sc, py = cy - r.p.y * sc;
    glow(ctx, px, py, 34, "rgba(217,180,138,0.6)"); ctx.fillStyle = "#d9b48a"; ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();
    arrowTo(ctx, px + 18, py, px + 48, py, "rgba(217,180,138,0.9)");
    ctx.beginPath(); r.tr.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * sc, cy - y * sc) : ctx.moveTo(cx + x * sc, cy - y * sc))); ctx.strokeStyle = "rgba(233,210,154,0.85)"; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
    const sp = Math.hypot(r.c.vx, r.c.vy);
    glow(ctx, cx + r.c.x * sc, cy - r.c.y * sc, 10, "rgba(255,255,255,0.95)");
    label(ctx, `spacecraft speed: ${Math.round(sp * 100)}% of where it started`, W / 2, H * 0.06, { size: sz + 1, color: sp > 1.05 ? C.gold : sp < 0.95 ? C.rose : C.text });
    label(ctx, r.b > 0.1 ? "passing behind the planet: it drags you along" : r.b < -0.1 ? "passing in front: it holds you back" : "too close: straight at it", W / 2, H * 0.94, { size: sz });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="aim" min={-1.6} max={1.6} step={0.02} value={b} onChange={setB} show={b > 0.1 ? "behind the planet" : b < -0.1 ? "in front of it" : "straight at it"} /></div>
    </>
  );
}

// ─────────────────────────── lagrange: the balance points ───────────────────────────
const MUL = 0.01;
const LPTS = [["L1", 1 - MUL - Math.cbrt(MUL / 3), 0], ["L2", 1 - MUL + Math.cbrt(MUL / 3), 0], ["L3", -1 - (5 * MUL) / 12, 0], ["L4", 0.5 - MUL, Math.sqrt(3) / 2], ["L5", 0.5 - MUL, -Math.sqrt(3) / 2]];
function Lagrange() {
  const S = useRef(null);
  if (!S.current) S.current = { probes: [{ x: LPTS[3][1] + 0.03, y: LPTS[3][2], vx: 0, vy: 0, tr: [] }, { x: LPTS[0][1] - 0.01, y: 0.005, vx: 0, vy: 0, tr: [] }] };
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const s = S.current, cx = W / 2, cy = H / 2, sc = Math.min(W * 0.4, H * 0.42), sz = fit(W, 60);
    const n = 40, h = (dt * 1.4) / n;
    s.probes.forEach((p) => {
      for (let k = 0; k < n; k++) {
        const r1 = Math.hypot(p.x + MUL, p.y) + 1e-3, r2 = Math.hypot(p.x - 1 + MUL, p.y) + 1e-3;
        const ax = 2 * p.vy + p.x - ((1 - MUL) * (p.x + MUL)) / r1 ** 3 - (MUL * (p.x - 1 + MUL)) / r2 ** 3;
        const ay = -2 * p.vx + p.y - ((1 - MUL) * p.y) / r1 ** 3 - (MUL * p.y) / r2 ** 3;
        p.vx += ax * h; p.vy += ay * h; p.x += p.vx * h; p.y += p.vy * h;
        if (r1 < 0.05 || r2 < 0.02 || r1 > 2.4) { p.gone = true; break; }
      }
      p.tr.push([p.x, p.y]); if (p.tr.length > 700) p.tr.shift();
    });
    s.probes = s.probes.filter((p) => !p.gone).slice(-8);
    // the Sun, the planet, the five points (the picture turns with the planet)
    glow(ctx, cx - MUL * sc, cy, 34, "rgba(255,230,170,0.9)"); ctx.fillStyle = "#ffe9b0"; ctx.beginPath(); ctx.arc(cx - MUL * sc, cy, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#6fa3e8"; ctx.beginPath(); ctx.arc(cx + (1 - MUL) * sc, cy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(139,149,246,0.2)"; ctx.beginPath(); ctx.arc(cx, cy, sc, 0, Math.PI * 2); ctx.stroke();
    LPTS.forEach(([nm, x, y]) => { ctx.strokeStyle = C.gold; ctx.beginPath(); ctx.moveTo(cx + x * sc - 5, cy - y * sc); ctx.lineTo(cx + x * sc + 5, cy - y * sc); ctx.moveTo(cx + x * sc, cy - y * sc - 5); ctx.lineTo(cx + x * sc, cy - y * sc + 5); ctx.stroke(); label(ctx, nm, cx + x * sc, cy - y * sc - 14, { size: sz, color: C.gold }); });
    s.probes.forEach((p) => {
      ctx.beginPath(); p.tr.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * sc, cy - y * sc) : ctx.moveTo(cx + x * sc, cy - y * sc))); ctx.strokeStyle = "rgba(111,195,168,0.6)"; ctx.stroke();
      ctx.fillStyle = C.teal; ctx.beginPath(); ctx.arc(cx + p.x * sc, cy - p.y * sc, 3, 0, Math.PI * 2); ctx.fill();
    });
    label(ctx, W < 520 ? "tap to park a probe" : "tap anywhere to park a probe · L4 and L5 hold on, L1, L2 and L3 slowly let go", W / 2, H * 0.95, { size: sz });
  });
  const tap = (e) => {
    const r = e.currentTarget.getBoundingClientRect(), sc = Math.min(r.width * 0.4, r.height * 0.42);
    const x = (e.clientX - r.left - r.width / 2) / sc, y = -(e.clientY - r.top - r.height / 2) / sc;
    S.current.probes.push({ x, y, vx: 0, vy: 0, tr: [] }); if (soundOn()) ping(520, 0.04);
  };
  return <canvas ref={ref} className="bh-canvas" onPointerDown={tap} />;
}

// ─────────────────────────── delay: landing on your own ───────────────────────────
function Delay() {
  const [lag, setLag] = useState(2);
  const lRef = useRef(lag); lRef.current = lag;
  const S = useRef(null);
  const reset = () => { S.current = { h: 1, v: 0, cmds: [], held: false, auto: false, end: "", t: 0, burn: false }; };
  if (!S.current) reset();
  const press = (on) => { const s = S.current; s.cmds.push({ at: s.t, on }); s.held = on; };
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const s = S.current, sz = fit(W, 60), g = 0.16, thrust = 0.42;
    if (!s.end) {
      s.t += dt;
      // the lander does whatever the newest command that has *arrived* says
      let on = false;
      if (s.auto) { const need = (s.v * s.v) / (2 * (thrust - g)); on = s.v < 0 && s.h <= need * 1.05 + 0.005; }
      else for (const c of s.cmds) if (c.at + lRef.current <= s.t) on = c.on;
      s.burn = on;
      s.v += ((on ? thrust : 0) - g) * dt; s.h += s.v * dt;
      if (s.h <= 0) { s.h = 0; s.end = Math.abs(s.v) < 0.09 ? "touchdown: a soft landing" : "crashed"; if (soundOn()) s.end === "crashed" ? ping(120, 0.1) : (ping(660, 0.06), setTimeout(() => ping(990, 0.06), 140)); }
      if (s.h > 1.3) s.h = 1.3;
    }
    // Mars' ground and the lander
    const gy = H * 0.84;
    ctx.fillStyle = "#6b3424"; ctx.fillRect(0, gy, W, H - gy);
    const lx = W * 0.32, ly = gy - 14 - s.h * (gy - H * 0.14);
    if (s.burn && !s.end) glow(ctx, lx, ly + 18, 22, "rgba(255,170,90,0.9)");
    ctx.fillStyle = "#cfd3e8"; ctx.fillRect(lx - 12, ly - 10, 24, 20);
    ctx.strokeStyle = "#cfd3e8"; ctx.beginPath(); ctx.moveTo(lx - 12, ly + 10); ctx.lineTo(lx - 18, ly + 16); ctx.moveTo(lx + 12, ly + 10); ctx.lineTo(lx + 18, ly + 16); ctx.stroke();
    // you, far away, and your commands crossing the gap
    const ex = W * 0.9, ey = H * 0.2;
    glow(ctx, ex, ey, 18, "rgba(111,163,232,0.8)"); ctx.fillStyle = "#6fa3e8"; ctx.beginPath(); ctx.arc(ex, ey, 7, 0, Math.PI * 2); ctx.fill();
    label(ctx, "you, on Earth", ex, ey + 18, { size: sz - 1 });
    if (!s.auto) s.cmds.forEach((c) => { const f = (s.t - c.at) / Math.max(0.01, lRef.current); if (f >= 0 && f <= 1) { const x = ex + (lx - ex) * f, y = ey + (ly - ey) * f; ctx.fillStyle = c.on ? C.gold : C.lav; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); } });
    label(ctx, s.end || (s.auto ? "the lander flying itself" : lRef.current ? "hold the button to fire · your commands take time to arrive" : "hold the button to fire the engine"), W / 2, H * 0.07, { size: sz + 1, color: s.end === "crashed" ? C.rose : s.end ? C.gold : C.text });
    label(ctx, `height ${Math.round(s.h * 2000)} m · falling at ${Math.max(0, Math.round(-s.v * 100))} m/s · land under 9 m/s`, W / 2, H * 0.94, { size: sz, color: "#fff" });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <button className="bh-btn bh-btn-on" style={{ touchAction: "none" }} onPointerDown={(e) => { e.preventDefault(); press(true); }} onPointerUp={() => press(false)} onPointerLeave={() => S.current.held && press(false)}>hold to fire</button>
        <button className="bh-btn" onClick={() => { reset(); }}>try again</button>
        <button className="bh-btn" onClick={() => { reset(); S.current.auto = true; }}>let it fly itself</button>
        <Slider label="signal delay" min={0} max={3} step={0.5} value={lag} onChange={(v) => { setLag(v); reset(); }} show={lag ? `${lag} s (standing in for ~11 minutes)` : "none"} />
      </div>
    </>
  );
}

// ─────────────────────────── voyager: one light-day ───────────────────────────
const RUNGS = [["the Moon", 384400], ["Mars, at its closest", 5.46e7], ["the Sun", 1.496e8], ["Jupiter", 7.8e8], ["Neptune", 4.5e9], ["Voyager 1", 2.59e10]];
const KM_S = 299792.458;
const LIGHT_DAY_AT = Date.UTC(2026, 10, 18, 6, 16); // 18 Nov 2026, 00:16 CST
const fmtT = (s) => (s < 60 ? `${s.toFixed(1)} seconds` : s < 3600 ? `${(s / 60).toFixed(1)} minutes` : `${(s / 3600).toFixed(1)} hours`);
function Voyager() {
  const S = useRef({ go: -1 });
  const [, setTick] = useState(0);
  const now = Date.now();
  const vgr = 2.59e10 + ((now - LIGHT_DAY_AT) / 1000) * 17; // km from Earth, roughly (it moves about 17 km/s)
  const days = (LIGHT_DAY_AT - now) / 86400000;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.35);
    const sz = fit(W, 60), x0 = W * 0.08, x1 = W * 0.92, y = H * 0.5;
    const lo = Math.log10(3e5), hi = Math.log10(3e10), px = (km) => x0 + ((Math.log10(km) - lo) / (hi - lo)) * (x1 - x0);
    ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    glow(ctx, x0 - 10, y, 16, "rgba(111,163,232,0.9)"); label(ctx, "Earth", x0 - 10, y + 18, { size: sz - 1 });
    RUNGS.forEach(([n0, km], i) => { const n = W < 520 && n0.startsWith("Mars") ? "Mars" : n0, x = px(km); ctx.fillStyle = n === "Voyager 1" ? C.gold : C.lav; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); label(ctx, n, x, y + (i % 2 ? 36 : -30), { size: sz - 1, color: n === "Voyager 1" ? C.gold : C.text }); label(ctx, fmtT(km / KM_S), x, y + (i % 2 ? 50 : -16), { size: sz - 2 }); });
    // a message at the speed of light, with time sped up more and more as it goes
    const s = S.current;
    if (s.go >= 0) {
      const e = t - s.go, simS = 0.5 * Math.pow(10, e * 0.8); // seconds of light-travel shown
      const km = simS * KM_S;
      if (km < 2.59e10) { const x = px(Math.max(km, 3e5)); glow(ctx, x, y, 14, "rgba(255,255,255,0.95)"); label(ctx, `light has been travelling ${fmtT(simS)}`, W / 2, H * 0.12, { size: sz + 1, color: C.text }); }
      else { s.go = -1; setTick((x) => x + 1); if (soundOn()) ping(880, 0.06); }
    } else label(ctx, W < 520 ? "at light speed: about a day" : "even at the speed of light, a message to Voyager 1 takes about a day", W / 2, H * 0.12, { size: sz + 1, color: C.gold });
    if (W >= 520) label(ctx, "(distances on a stretched scale: each step is ten times farther)", W / 2, H * 0.92, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">Voyager 1 today, about</span><b>{(vgr / 1e9).toFixed(1)} billion km</b></div>
        <div><span className="mono">a signal takes</span><b>{(vgr / KM_S / 3600).toFixed(1)} hours</b></div>
        <div><span className="mono">launched</span><b>5 Sept 1977</b></div>
        <div><span className="mono">one light-day away</span><b style={{ fontSize: 12 }}>{days > 0.5 ? `in ${Math.round(days)} days (18 Nov 2026)` : days > -0.5 ? "today" : "since 18 Nov 2026"}</b></div>
      </div>
      <div className="bh-controls"><button className="bh-btn bh-btn-on" onClick={() => { S.current.go = performance.now() / 1000; if (soundOn()) ping(440, 0.05); }}>send a message</button></div>
    </>
  );
}

export const ISSUE_08 = { upward: Upward, chase: Chase, hohmann: Hohmann, rocket: Rocket, slingshot: Slingshot, lagrange: Lagrange, delay: Delay, voyager: Voyager };
