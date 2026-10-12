"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, Slider } from "./kit";
import { ping, soundOn } from "../../lib/spaceSound";

// THE BLACK HOLE No. 09 · The Speed Limit (Update 5.77).
// Pictures: headlights · lightclock · gamma · muon · squash · twins · wall ·
// lookback. The words are in lib/blackhole/09-the-speed-limit.js.

const gam = (b) => 1 / Math.sqrt(Math.max(1e-12, 1 - b * b));
const pctC = (b) => (b < 0.999 ? `${(b * 100).toFixed(1)}%` : `${(b * 100).toFixed(4)}%`);

// ─────────────────────────── headlights: light doesn't add up ───────────────────────────
function Headlights() {
  const [b, setB] = useState(0.5);
  const bRef = useRef(b); bRef.current = b;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const bb = bRef.current, sz = fit(W, 55);
    const lane = (y, name, ship) => {
      ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(0, y + 14); ctx.lineTo(W, y + 14); ctx.stroke();
      const p = (t % 3) / 3, sx = W * 0.08 + (ship ? bb * p * W * 0.5 : 0), lx = W * 0.08 + p * W * 0.84;
      ctx.fillStyle = ship ? C.lav : C.teal; ctx.fillRect(sx - 14, y - 6, 28, 12);
      glow(ctx, lx, y, 14, "rgba(255,246,214,0.95)"); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(lx, y, 3, 0, Math.PI * 2); ctx.fill();
      label(ctx, name, W * 0.08, y - 22, { size: sz, align: "left", color: C.text });
    };
    lane(H * 0.32, "standing still, switching on a torch", false);
    lane(H * 0.66, `flying at ${pctC(bb)} of light speed, switching on a torch`, true);
    label(ctx, "both measure their light going at exactly 299,792 km/s", W / 2, H * 0.9, { size: sz + 1, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">your speed</span><b>{pctC(b)} of light</b></div>
        <div><span className="mono">common sense says</span><b>{(100 + b * 100).toFixed(0)}% for your light</b></div>
        <div><span className="mono">you measure</span><b>100%</b></div>
        <div><span className="mono">so does everyone</span><b>100%</b></div>
      </div>
      <div className="bh-controls"><Slider label="your speed" min={0} max={0.99} step={0.005} value={b} onChange={setB} /></div>
    </>
  );
}

// ─────────────────────────── lightclock: a ticking beam ───────────────────────────
function LightClock() {
  const [b, setB] = useState(0.6);
  const bRef = useRef(b); bRef.current = b;
  const S = useRef({ a: 0, m: 0, ta: 0, tm: 0 });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    const bb = bRef.current, s = S.current, g = gam(bb), sz = fit(W, 60), hgt = H * 0.5, c = hgt * 1.4;
    // a clock at rest: light goes straight up and down
    s.a += c * dt; if (s.a > 2 * hgt) { s.a -= 2 * hgt; s.ta++; if (soundOn()) ping(880, 0.02); }
    const draw = (x0, phase, slant, name, ticks) => {
      const yb = H * 0.8, yt = yb - hgt, up = phase < hgt, f = up ? phase / hgt : 2 - phase / hgt;
      ctx.strokeStyle = C.lav; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x0 - 20, yt); ctx.lineTo(x0 + 20, yt); ctx.moveTo(x0 - 20, yb); ctx.lineTo(x0 + 20, yb); ctx.stroke(); ctx.lineWidth = 1;
      const y = yb - f * hgt, x = x0 + slant * (phase / (2 * hgt) - 0.5) * 2;
      if (slant) { ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(233,210,154,0.4)"; ctx.beginPath(); ctx.moveTo(x0 - slant, yb); ctx.lineTo(x0, yt); ctx.lineTo(x0 + slant, yb); ctx.stroke(); ctx.setLineDash([]); }
      glow(ctx, x, y, 14, "rgba(255,246,214,0.95)"); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
      label(ctx, name, x0, H * 0.12, { size: sz, color: C.text }); label(ctx, `ticks: ${ticks}`, x0, H * 0.19, { size: sz, color: C.gold });
    };
    draw(W * 0.25, s.a, 0, "a clock beside you", s.ta);
    // the moving clock: same light speed, longer zig-zag path, so each tick takes longer
    s.m += (c / g) * dt; if (s.m > 2 * hgt) { s.m -= 2 * hgt; s.tm++; }
    const slant = hgt * Math.tan(Math.asin(Math.min(0.999, bb)));
    draw(W * 0.7, s.m, Math.min(W * 0.26, slant), "a clock flying past", s.tm);
    label(ctx, `the flying clock's light takes a longer path: it ticks ${g.toFixed(2)}× slower`, W / 2, H * 0.93, { size: sz });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="its speed" min={0} max={0.95} step={0.005} value={b} onChange={(v) => { setB(v); S.current = { a: 0, m: 0, ta: 0, tm: 0 }; }} show={`${pctC(b)} of light`} /></div>
    </>
  );
}

// ─────────────────────────── gamma: barely, then suddenly ───────────────────────────
const MOVERS = [[27 / 299792458, "a car on the motorway"], [7660 / 299792458, "the space station"], [1.9e5 / 299792458, "Parker Solar Probe, fastest spacecraft"], [0.5, "half light speed"], [0.9, "90%"], [0.99, "99%"], [0.999999991, "protons in the Large Hadron Collider"]];
function Gamma() {
  const [k, setK] = useState(0.7);
  const kRef = useRef(k); kRef.current = k;
  const bOf = (kk) => 1 - Math.pow(10, -kk * 9); // a slider that crowds toward light speed
  const b = k < 0.02 ? 0 : bOf(k);
  const g = gam(b);
  const ref = useCanvas((ctx, W, H) => {
    bg(ctx, W, H);
    const sz = fit(W, 60), x0 = W * 0.1, x1 = W * 0.92, y0 = H * 0.84, y1 = H * 0.12;
    ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    label(ctx, "speed, as a fraction of light → 1", (x0 + x1) / 2, y0 + 16, { size: sz });
    ctx.save(); ctx.translate(x0 - 14, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); label(ctx, "how much time slows (×)", 0, 0, { size: sz }); ctx.restore();
    const py = (gg) => y0 - Math.min(1, (gg - 1) / 9) * (y0 - y1);
    ctx.beginPath(); for (let i = 0; i <= 400; i++) { const bb = (i / 400) * 0.995; const x = x0 + bb * (x1 - x0); i ? ctx.lineTo(x, py(gam(bb))) : ctx.moveTo(x, py(gam(bb))); } ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]); ctx.strokeStyle = C.rose; ctx.beginPath(); ctx.moveTo(x1, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.setLineDash([]);
    label(ctx, "light", x1, y1 - 8, { size: sz, color: C.rose });
    const bb = b, x = x0 + Math.min(1, bb) * (x1 - x0);
    glow(ctx, x, py(gam(bb)), 12, "rgba(255,255,255,0.95)");
    label(ctx, `time ×${gam(bb) < 100 ? gam(bb).toFixed(gam(bb) < 1.01 ? 6 : 2) : Math.round(gam(bb)).toLocaleString()}`, Math.min(x1 - 50, x + 10), py(gam(bb)) - 14, { size: sz, align: "left", color: C.text });
  });
  const gm1 = (v) => Math.log10(gam(v) - 1 + 1e-18);
  const near = MOVERS.reduce((m, v) => (Math.abs(gm1(v[0]) - gm1(b)) < Math.abs(gm1(m[0]) - gm1(b)) ? v : m));
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">speed</span><b>{b < 0.001 ? `${Math.round(b * 299792)} km/s` : `${pctC(b)} of light`}</b></div>
        <div><span className="mono">time runs</span><b>{g < 1.0001 ? "slower by a hair" : `${g < 100 ? g.toFixed(2) : Math.round(g).toLocaleString()}× slower`}</b></div>
        <div><span className="mono">like</span><b style={{ fontSize: 12 }}>{near[1]}</b></div>
        <div><span className="mono">1 year for you is</span><b>{g < 1.0001 ? "1 year back home" : `${g < 100 ? g.toFixed(1) : Math.round(g).toLocaleString()} years at home`}</b></div>
      </div>
      <div className="bh-controls"><Slider label="speed up" min={0} max={1} step={0.002} value={k} onChange={setK} /></div>
    </>
  );
}

// ─────────────────────────── muon: rain from the sky ───────────────────────────
function Muon() {
  const [on, setOn] = useState(true);
  const oRef = useRef(on); oRef.current = on;
  const S = useRef({ ms: [], hit: 0, made: 0 });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t * 0.2, 0.2);
    const s = S.current, sz = fit(W, 60), top = H * 0.1, gy = H * 0.84;
    ctx.fillStyle = "rgba(90,150,255,0.08)"; ctx.fillRect(0, top, W, gy - top);
    ctx.fillStyle = "#1f2b4a"; ctx.fillRect(0, gy, W, H - gy);
    label(ctx, "15 km up: cosmic rays hit the air and make muons", W / 2, top - 10, { size: sz - 1 });
    if (Math.random() < dt * 14) { s.ms.push({ x: Math.random() * W, y: top, life: -Math.log(Math.random()) }); s.made++; }
    // at 99.8% of light speed a muon covers 15 km in ~50 microseconds;
    // its mean life is 2.2 microseconds, stretched about 15× by its speed
    const meanLives = 50 / (2.2 * (oRef.current ? 15.8 : 1));
    s.ms.forEach((m) => {
      m.y += (gy - top) * dt * 0.5;
      const used = ((m.y - top) / (gy - top)) * meanLives;
      if (used > m.life) { m.dead = true; glow(ctx, m.x, m.y, 8, "rgba(201,123,110,0.7)"); return; }
      ctx.strokeStyle = "rgba(233,210,154,0.5)"; ctx.beginPath(); ctx.moveTo(m.x, m.y - 10); ctx.lineTo(m.x, m.y); ctx.stroke();
      ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2); ctx.fill();
      if (m.y >= gy) { m.dead = true; s.hit++; }
    });
    s.ms = s.ms.filter((m) => !m.dead);
    label(ctx, `reaching the ground: ${s.made ? Math.round((s.hit / s.made) * 100) : 0}%`, W / 2, gy + (H - gy) / 2, { size: sz + 1, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <button className={`bh-btn ${on ? "bh-btn-on" : ""}`} onClick={() => { setOn(true); S.current = { ms: [], hit: 0, made: 0 }; }}>with Einstein's slow time</button>
        <button className={`bh-btn ${!on ? "bh-btn-on" : ""}`} onClick={() => { setOn(false); S.current = { ms: [], hit: 0, made: 0 }; }}>without it</button>
      </div>
    </>
  );
}

// ─────────────────────────── squash: shorter along the way ───────────────────────────
function Squash() {
  const [b, setB] = useState(0.8);
  const bRef = useRef(b); bRef.current = b;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const bb = bRef.current, g = gam(bb), sz = fit(W, 55), L = W * 0.5, cy = H * 0.45;
    const draw = (y, len, name) => {
      const x0 = W / 2 - len / 2;
      ctx.fillStyle = "#cfd3e8"; ctx.beginPath(); ctx.moveTo(x0, y - 14); ctx.lineTo(x0 + len * 0.82, y - 14); ctx.lineTo(x0 + len, y); ctx.lineTo(x0 + len * 0.82, y + 14); ctx.lineTo(x0, y + 14); ctx.closePath(); ctx.fill();
      for (let i = 1; i < 6; i++) { ctx.fillStyle = "#3A3E75"; ctx.beginPath(); ctx.arc(x0 + (len * i) / 7, y, 3, 0, Math.PI * 2); ctx.fill(); }
      label(ctx, name, W / 2, y - 30, { size: sz, color: C.text });
    };
    draw(cy - H * 0.16, L, "the ship, as its crew measures it");
    draw(cy + H * 0.18, L / g, `the same ship flying past you: ${Math.round((1 / g) * 100)}% as long`);
    label(ctx, "only along the direction of travel · its height doesn't change", W / 2, H * 0.92, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="ship's speed" min={0} max={0.995} step={0.001} value={b} onChange={setB} show={`${pctC(b)} of light`} /></div>
    </>
  );
}

// ─────────────────────────── twins: a trip to a star ───────────────────────────
function Twins() {
  const [b, setB] = useState(0.9);
  const [go, setGo] = useState(0);
  const bRef = useRef(b); bRef.current = b;
  const S = useRef({ p: 0 });
  const D = 10; // light-years, there and back
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const bb = bRef.current, g = gam(bb), s = S.current, sz = fit(W, 55);
    if (go) s.p = Math.min(1, s.p + dt / 6);
    const home = (2 * D) / bb, trip = home / g, p = s.p;
    const x0 = W * 0.1, x1 = W * 0.9, y = H * 0.32;
    glow(ctx, x0, y, 18, "rgba(111,163,232,0.9)"); label(ctx, "Earth", x0, y + 22, { size: sz });
    glow(ctx, x1, y, 22, "rgba(255,236,190,0.9)"); label(ctx, `a star ${D} light-years away`, x1, y + 22, { size: sz, align: "right" });
    const pos = p < 0.5 ? p * 2 : 2 - p * 2;
    ctx.fillStyle = C.lav; ctx.beginPath(); ctx.arc(x0 + pos * (x1 - x0), y - 14, 5, 0, Math.PI * 2); ctx.fill();
    const age = (yrs, x, name, col) => { label(ctx, name, x, H * 0.58, { size: sz, color: C.text }); label(ctx, `+${yrs.toFixed(1)} years`, x, H * 0.7, { size: sz + 8, color: col, font: "Fraunces" }); };
    age(home * p, W * 0.3, "the twin who stays home", C.teal);
    age(trip * p, W * 0.7, "the twin who travels", C.gold);
    if (p >= 1) label(ctx, `home again: the traveller is ${(home - trip).toFixed(1)} years younger than their twin`, W / 2, H * 0.9, { size: sz, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <Slider label="cruising speed" min={0.1} max={0.999} step={0.001} value={b} onChange={(v) => { setB(v); S.current.p = 0; setGo(0); }} show={`${pctC(b)} of light`} />
        <button className="bh-btn bh-btn-on" onClick={() => { S.current.p = 0; setGo(go + 1); if (soundOn()) ping(520, 0.05); }}>launch</button>
      </div>
    </>
  );
}

// ─────────────────────────── wall: push harder ───────────────────────────
const WORLD_PER_HOUR = 6.8e16; // joules: humanity's whole energy use in about an hour
function Wall() {
  const [pushes, setPushes] = useState(0);
  const E = pushes === 0 ? 0 : 1e15 * Math.pow(2.4, pushes - 1); // joules given to 1 kg
  const g = 1 + E / 8.98755e16, b = Math.sqrt(1 - 1 / (g * g));
  const bRef = useRef(b); bRef.current = b;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const bb = bRef.current, sz = fit(W, 55), x0 = W * 0.08, x1 = W * 0.9, y = H * 0.45;
    ctx.fillStyle = "rgba(201,123,110,0.25)"; ctx.fillRect(x1, H * 0.15, 6, H * 0.6);
    label(ctx, "the speed of light", x1, H * 0.11, { size: sz, color: C.rose });
    ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    const x = x0 + bb * (x1 - x0);
    glow(ctx, x, y, 20, "rgba(233,210,154,0.9)"); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
    label(ctx, "a 1 kg ball", x, y + 24, { size: sz, color: C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">speed</span><b>{pctC(b)} of light</b></div>
        <div><span className="mono">energy put in</span><b>{E ? `${E.toExponential(1).replace("e+", " × 10^")} J` : "none"}</b></div>
        <div><span className="mono">that's</span><b style={{ fontSize: 12 }}>{E < WORLD_PER_HOUR / 60 ? `${Math.max(0, Math.round(E / (WORLD_PER_HOUR / 3600)))} seconds of humanity's energy` : E < WORLD_PER_HOUR * 48 ? `${(E / WORLD_PER_HOUR).toFixed(1)} hours of humanity's energy` : `${Math.round(E / (WORLD_PER_HOUR * 24 * 365)).toLocaleString()} years of humanity's energy`}</b></div>
        <div><span className="mono">pushes</span><b>{pushes}</b></div>
      </div>
      <div className="bh-controls">
        <button className="bh-btn bh-btn-on" onClick={() => { setPushes(pushes + 1); if (soundOn()) ping(300 + pushes * 40, 0.04); }}>push harder (×2.4 the energy)</button>
        <button className="bh-btn" onClick={() => setPushes(0)}>reset</button>
      </div>
    </>
  );
}

// ─────────────────────────── lookback: far is long ago ───────────────────────────
const LOOK = [[1.28 / 31557600, "the Moon", "1.3 seconds ago"], [499 / 31557600, "the Sun", "8 minutes ago"], [4.24, "Proxima Centauri, the nearest star", "4 years ago"], [550, "Betelgeuse", "more than 500 years ago"], [26000, "the centre of our galaxy", "26,000 years ago"], [2.5e6, "the Andromeda galaxy", "2.5 million years ago"], [1.3e10, "the most distant galaxies", "over 13 billion years ago"]];
function Lookback() {
  const [i, setI] = useState(2);
  const iRef = useRef(i); iRef.current = i;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.4);
    const k = iRef.current, sz = fit(W, 55), x0 = W * 0.08, x1 = W * 0.92, y = H * 0.5;
    const lo = Math.log10(LOOK[0][0]), hi = Math.log10(LOOK[6][0]), px = (v) => x0 + ((Math.log10(v) - lo) / (hi - lo)) * (x1 - x0);
    ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    LOOK.forEach(([v], j) => { ctx.fillStyle = j === k ? C.gold : C.lav; ctx.beginPath(); ctx.arc(px(v), y, j === k ? 6 : 3.5, 0, Math.PI * 2); ctx.fill(); });
    // light from the chosen object, arriving now
    const x = px(LOOK[k][0]), f = (t % 2.5) / 2.5, lx = x + (x0 - x) * f;
    glow(ctx, lx, y, 12, "rgba(255,246,214,0.95)");
    glow(ctx, x0, y, 16, "rgba(111,163,232,0.9)"); label(ctx, "you", x0, y + 20, { size: sz });
    label(ctx, `${LOOK[k][1]}: you see it as it was ${LOOK[k][2]}`, W / 2, H * 0.2, { size: sz + 1, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">{LOOK.map((l, j) => <button key={j} className={`bh-btn ${i === j ? "bh-btn-on" : ""}`} onClick={() => setI(j)}>{l[1].split(",")[0].replace("the most distant galaxies", "the farthest")}</button>)}</div>
    </>
  );
}

export const ISSUE_09 = { headlights: Headlights, lightclock: LightClock, gamma: Gamma, muon: Muon, squash: Squash, twins: Twins, wall: Wall, lookback: Lookback };
