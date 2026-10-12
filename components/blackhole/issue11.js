"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, seeded, Slider } from "./kit";
import { ping, soundOn } from "../../lib/spaceSound";

// THE BLACK HOLE No. 11 · The Pull of the Moon (Update 5.77).
// Pictures: bulge · spring · brake · locked · roche · rings · io · torn.
// The words are in lib/blackhole/11-the-pull-of-the-moon.js.

const arrow = (ctx, x0, y0, x1, y1, col) => { const a = Math.atan2(y1 - y0, x1 - x0); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - Math.cos(a - 0.4) * 7, y1 - Math.sin(a - 0.4) * 7); ctx.lineTo(x1 - Math.cos(a + 0.4) * 7, y1 - Math.sin(a + 0.4) * 7); ctx.closePath(); ctx.fill(); ctx.lineWidth = 1; };
const earth = (ctx, x, y, r) => { glow(ctx, x, y, r * 1.5, "rgba(90,150,255,0.35)"); ctx.fillStyle = "#2b5fb0"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#5f9a5a"; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.2, r * 0.35, 0, Math.PI * 2); ctx.fill(); };
const moon = (ctx, x, y, r) => { ctx.fillStyle = "#c9c6bd"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "rgba(90,90,100,0.4)"; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.2, r * 0.25, 0, Math.PI * 2); ctx.fill(); };
// an ocean stretched toward angle `a` by `h` (0..1)
const ocean = (ctx, x, y, r, a, h, col = "rgba(111,170,255,0.55)") => { ctx.beginPath(); for (let i = 0; i <= 120; i++) { const q = (i / 120) * Math.PI * 2, rr = r * (1.08 + h * 0.35 * Math.cos(2 * (q - a))); const px = x + Math.cos(q) * rr, py = y + Math.sin(q) * rr; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };

// ─────────────────────────── bulge: two high tides ───────────────────────────
function Bulge() {
  const [arrows, setArrows] = useState(true);
  const aRef = useRef(arrows); aRef.current = arrows;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const sz = fit(W, 55), ex = W * 0.32, cy = H * 0.5, r = Math.min(W, H) * 0.17, mx = W * 0.86;
    ocean(ctx, ex, cy, r, 0, 0.7); earth(ctx, ex, cy, r); moon(ctx, mx, cy, r * 0.27);
    if (aRef.current) {
      // the Moon pulls the near side most, the centre less, the far side least
      arrow(ctx, ex + r * 1.3, cy, ex + r * 1.3 + 70, cy, C.gold);
      arrow(ctx, ex, cy, ex + 45, cy, C.gold);
      arrow(ctx, ex - r * 1.3, cy, ex - r * 1.3 + 22, cy, C.gold);
      label(ctx, "strong pull", ex + r * 1.3 + 35, cy - 16, { size: sz - 1, color: C.gold });
      label(ctx, "weaker", ex - r * 1.3 + 11, cy - 16, { size: sz - 1, color: C.gold });
    }
    label(ctx, "two bulges: one toward the Moon, one away · the Earth turns underneath them", W / 2, H * 0.92, { size: sz, color: C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><button className={`bh-btn ${arrows ? "bh-btn-on" : ""}`} onClick={() => setArrows(!arrows)}>{arrows ? "hide the pulls" : "show the pulls"}</button></div>
    </>
  );
}

// ─────────────────────────── spring: Sun and Moon together ───────────────────────────
function Spring() {
  const [ph, setPh] = useState(0);
  const pRef = useRef(ph); pRef.current = ph;
  const a = (ph / 29.5) * Math.PI * 2;
  const height = Math.sqrt(1 + 0.46 * 0.46 + 2 * 0.46 * Math.cos(2 * a)) / 1.46; // Sun's tide is about 46% of the Moon's
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const aa = (pRef.current / 29.5) * Math.PI * 2, sz = fit(W, 55), ex = W * 0.55, cy = H * 0.5, r = Math.min(W, H) * 0.12, R = Math.min(W * 0.3, H * 0.36);
    glow(ctx, W * 0.04, cy, 60, "rgba(255,230,170,0.9)"); label(ctx, "Sun", W * 0.06, cy + 40, { size: sz });
    // combine the two tides: Moon's along its direction, Sun's along the x axis
    const mx = ex + Math.cos(aa + Math.PI) * R, my = cy + Math.sin(aa + Math.PI) * R;
    const tideA = Math.atan2(my - cy, mx - ex);
    const h = Math.sqrt(1 + 0.46 * 0.46 + 2 * 0.46 * Math.cos(2 * aa)) / 1.46;
    ocean(ctx, ex, cy, r, tideA * (1 - 0) * 1, h * 0.9); earth(ctx, ex, cy, r);
    ctx.strokeStyle = "rgba(139,149,246,0.2)"; ctx.beginPath(); ctx.arc(ex, cy, R, 0, Math.PI * 2); ctx.stroke();
    moon(ctx, mx, my, r * 0.3);
    label(ctx, h > 0.85 ? "Sun and Moon in line: spring tides, the biggest" : h < 0.55 ? "at right angles: neap tides, the smallest" : "in between", W / 2, H * 0.08, { size: sz + 1, color: h > 0.85 ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">day of the Moon's month</span><b>{Math.round(ph)}</b></div>
        <div><span className="mono">Moon</span><b>{ph < 2 || ph > 27.5 ? "new" : Math.abs(ph - 14.75) < 2 ? "full" : Math.abs(ph - 7.4) < 2 || Math.abs(ph - 22.1) < 2 ? "half" : "crescent / gibbous"}</b></div>
        <div><span className="mono">tide size</span><b>{Math.round(height * 100)}%</b></div>
        <div><span className="mono">kind</span><b>{height > 0.85 ? "spring tide" : height < 0.55 ? "neap tide" : "ordinary"}</b></div>
      </div>
      <div className="bh-controls"><Slider label="through the month" min={0} max={29.5} step={0.1} value={ph} onChange={setPh} /></div>
    </>
  );
}

// ─────────────────────────── brake: longer days, a retreating Moon ───────────────────────────
function Brake() {
  const [my, setMy] = useState(0); // millions of years ago
  const mRef = useRef(my); mRef.current = my;
  // rough history: day length from fossil corals and tidal rhythmites
  const day = 24 - my * (24 - 21.9) / 620; // about 21.9 h at 620 million years ago
  const dpy = (365.25 * 24) / day;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const sz = fit(W, 55), ex = W * 0.3, cy = H * 0.5, r = Math.min(W, H) * 0.14, spin = t * (2 + mRef.current / 200);
    ocean(ctx, ex, cy, r, -0.35, 0.55); earth(ctx, ex, cy, r);
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.beginPath(); ctx.moveTo(ex, cy); ctx.lineTo(ex + Math.cos(spin) * r, cy + Math.sin(spin) * r); ctx.stroke();
    const d = W * 0.5 * (1 - (mRef.current / 620) * 0.05);
    moon(ctx, ex + d, cy - d * 0.15, r * 0.27);
    arrow(ctx, ex + d + 14, cy - d * 0.15, ex + d + 44, cy - d * 0.15, C.gold);
    label(ctx, "the bulge runs a little ahead of the Moon: it tugs the Moon forward, and brakes the Earth", W / 2, H * 0.92, { size: sz, color: C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">when</span><b>{my === 0 ? "today" : `${my} million years ago`}</b></div>
        <div><span className="mono">a day</span><b>{day.toFixed(1)} hours</b></div>
        <div><span className="mono">days in a year</span><b>{Math.round(dpy)}</b></div>
        <div><span className="mono">the Moon now drifts away</span><b>3.8 cm a year</b></div>
      </div>
      <div className="bh-controls"><Slider label="go back in time" min={0} max={620} step={5} value={my} onChange={setMy} /></div>
    </>
  );
}

// ─────────────────────────── locked: one face toward us ───────────────────────────
function Locked() {
  const [k, setK] = useState(0);
  const kRef = useRef(k); kRef.current = k;
  const S = useRef({ orb: 0, spin: 0 });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const kk = kRef.current, s = S.current, sz = fit(W, 55), cx = W / 2, cy = H * 0.5, R = Math.min(W * 0.36, H * 0.38), mr = Math.min(W, H) * 0.06;
    s.orb += dt * 0.6;
    const spinRate = 0.6 * (1 + (1 - kk) * 7); // starts spinning fast, slows to match the orbit
    s.spin += dt * spinRate;
    if (kk >= 0.999) s.spin = s.orb + Math.PI;
    earth(ctx, cx, cy, Math.min(W, H) * 0.1);
    ctx.strokeStyle = "rgba(139,149,246,0.2)"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    const mx = cx + Math.cos(s.orb) * R, my = cy + Math.sin(s.orb) * R;
    moon(ctx, mx, my, mr);
    // a marker on one side of the Moon
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(mx + Math.cos(s.spin) * mr * 0.7, my + Math.sin(s.spin) * mr * 0.7, 4, 0, Math.PI * 2); ctx.fill();
    label(ctx, kk >= 0.999 ? "locked: one turn per orbit, so the gold spot always faces Earth" : "the young Moon spins fast · Earth's pull on its bulge slows it", W / 2, H * 0.93, { size: sz, color: kk >= 0.999 ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="let time pass" min={0} max={1} step={0.001} value={k} onChange={setK} show={k >= 0.999 ? "locked" : "slowing"} /></div>
    </>
  );
}

// ─────────────────────────── roche: too close to survive ───────────────────────────
function Roche() {
  const [d, setD] = useState(4);
  const dRef = useRef(d); dRef.current = d;
  const S = useRef(null);
  if (!S.current) { const r = seeded(15); S.current = Array.from({ length: 160 }, () => ({ a: r() * 6.28, rr: Math.sqrt(r()), off: (r() - 0.5) * 0.4 })); }
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const dd = dRef.current, sz = fit(W, 55), cx = W * 0.25, cy = H * 0.5, pr = Math.min(W, H) * 0.12, LIM = 2.44;
    glow(ctx, cx, cy, pr * 1.4, "rgba(217,180,138,0.4)"); ctx.fillStyle = "#d9b48a"; ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI * 2); ctx.fill();
    const scale = (W * 0.7) / 6;
    ctx.setLineDash([4, 5]); ctx.strokeStyle = C.rose; ctx.beginPath(); ctx.arc(cx, cy, LIM * scale * 0.55 + pr * 0.45, -0.6, 0.6); ctx.stroke(); ctx.setLineDash([]);
    label(ctx, "the Roche limit", cx + LIM * scale * 0.55 + pr * 0.45 + 6, cy - H * 0.3, { size: sz - 1, color: C.rose, align: "left" });
    const x = cx + dd * scale * 0.55 + pr * 0.45, broken = dd < LIM, spread = broken ? Math.min(1, (LIM - dd) / 1) : 0, mr = pr * 0.3;
    S.current.forEach((p) => {
      const ang = p.a, rad = p.rr * mr;
      const along = broken ? (p.off + Math.sin(ang)) * spread * 1.8 : 0;
      const px = cx + Math.cos(along * 0.4) * (x - cx) + Math.cos(ang) * rad * (1 + spread), py = cy + Math.sin(along * 0.4) * (x - cx) + Math.sin(ang) * rad * (1 - 0.4 * spread);
      ctx.fillStyle = "#c9c6bd"; ctx.fillRect(px, py, 2.2, 2.2);
    });
    label(ctx, broken ? "inside the limit: the planet's tide pulls it apart into a ring" : "outside the limit: the moon's own gravity holds it together", W / 2, H * 0.93, { size: sz, color: broken ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="move the moon in" min={1.3} max={5} step={0.01} value={d} onChange={setD} show={`${d.toFixed(2)} planet-radii`} /></div>
    </>
  );
}

// ─────────────────────────── rings: Saturn ───────────────────────────
function Rings() {
  const [tilt, setTilt] = useState(0.35);
  const tRef = useRef(tilt); tRef.current = tilt;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const tl = tRef.current, sz = fit(W, 55), cx = W / 2, cy = H * 0.48, pr = Math.min(W, H) * 0.16;
    const ringBands = [[1.24, 1.53, 0.35], [1.53, 1.95, 0.85], [2.03, 2.27, 0.6]]; // C, B, A rings (Cassini Division between B and A)
    const drawRings = (front) => {
      ringBands.forEach(([a, b, op]) => { for (let r = a; r < b; r += 0.012) { ctx.strokeStyle = `rgba(230,210,170,${op * (0.5 + 0.5 * Math.sin(r * 90)) * 0.5})`; ctx.beginPath(); ctx.ellipse(cx, cy, r * pr, r * pr * Math.max(0.02, tl), 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); ctx.stroke(); } });
    };
    drawRings(false);
    const g = ctx.createLinearGradient(cx, cy - pr, cx, cy + pr); g.addColorStop(0, "#e8d4a8"); g.addColorStop(0.5, "#c9a76f"); g.addColorStop(1, "#a88452");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI * 2); ctx.fill();
    drawRings(true);
    label(ctx, tl < 0.05 ? "edge-on, the rings almost vanish: about 10 metres thick in places" : "about 280,000 km across · mostly water ice, from dust to boulders the size of houses", W / 2, H * 0.93, { size: sz, color: C.text });
    void t;
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="tilt" min={0} max={0.5} step={0.005} value={tilt} onChange={setTilt} /></div>
    </>
  );
}

// ─────────────────────────── io: squeezed until it melts ───────────────────────────
function Io() {
  const S = useRef({ plumes: [] });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const sz = fit(W, 55), jx = W * 0.5, cy = H * 0.47, jr = Math.min(W, H) * 0.17;
    const g = ctx.createLinearGradient(jx, cy - jr, jx, cy + jr); ["#d9b48a", "#b98a5e", "#e6cfa6", "#a87b52", "#dcc39a"].forEach((c, i) => g.addColorStop(i / 4, c));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(jx, cy, jr, 0, Math.PI * 2); ctx.fill();
    // Io's slightly oval orbit: closer, stretched more; farther, relaxed
    const a = t * 0.7, e = 0.25, rr = W * 0.36 * (1 - e * Math.cos(a)), x = jx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.35;
    ctx.strokeStyle = "rgba(139,149,246,0.15)"; ctx.beginPath(); ctx.ellipse(jx - W * 0.36 * e, cy, W * 0.36, W * 0.36 * 0.35, 0, 0, Math.PI * 2); ctx.stroke();
    const stretch = 1 + 0.35 * Math.max(0, Math.cos(a)), ior = Math.min(W, H) * 0.055, ang = Math.atan2(y - cy, x - jx);
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = "#e8d36a"; ctx.beginPath(); ctx.ellipse(0, 0, ior * stretch, ior / Math.sqrt(stretch), 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#c97a3a"; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(Math.cos(i * 1.3) * ior * 0.5, Math.sin(i * 1.3) * ior * 0.5, 2, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    if (Math.random() < dt * 4) S.current.plumes.push({ a: Math.random() * 6.28, age: 0 });
    S.current.plumes.forEach((p) => { p.age += dt; const px = x + Math.cos(p.a) * ior * (1 + p.age * 2), py = y + Math.sin(p.a) * ior * (1 + p.age * 2); glow(ctx, px, py, 6 + p.age * 8, "rgba(255,170,90,0.8)", 1 - p.age / 0.8); });
    S.current.plumes = S.current.plumes.filter((p) => p.age < 0.8);
    label(ctx, "Io, flexed by Jupiter every orbit: the most volcanic world we know", W / 2, H * 0.92, { size: sz, color: C.gold });
  });
  return <canvas ref={ref} className="bh-canvas" />;
}

// ─────────────────────────── torn: a star meets a black hole ───────────────────────────
function Torn() {
  const S = useRef({ t0: -1, bits: null });
  const [run, setRun] = useState(0);
  const go = () => { S.current = { t0: -1, bits: null }; setRun((x) => x + 1); if (soundOn()) ping(330, 0.05); };
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const s = S.current, sz = fit(W, 55), cx = W * 0.55, cy = H * 0.5, hr = Math.min(W, H) * 0.05;
    glow(ctx, cx, cy, hr * 4, "rgba(233,210,154,0.25)"); ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(cx, cy, hr, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "rgba(233,210,154,0.6)"; ctx.stroke();
    if (!run) { glow(ctx, W * 0.1, H * 0.2, 24, "rgba(255,236,190,0.9)"); label(ctx, "a star heading for a supermassive black hole", W / 2, H * 0.93, { size: sz, color: C.text }); return; }
    if (s.t0 < 0) { s.t0 = t; const r = seeded(run); s.bits = Array.from({ length: 500 }, () => ({ k: r(), j: r() })); }
    const e = t - s.t0;
    s.bits.forEach((b) => {
      // each bit follows the same path, spread out along it more and more after closest approach
      const tt = e * 0.5 - b.k * Math.max(0, e - 2.2) * 0.25;
      const ang = -2.2 + tt * 1.4, rr = Math.max(hr * 1.4, Math.min(W, H) * 0.42 / (1 + 0.9 * Math.cos(ang + 0.6)));
      const cap = tt > 3 && b.j < 0.5; // about half the debris falls back into a glowing disc
      const x = cap ? cx + Math.cos(t * 3 + b.k * 20) * hr * (1.5 + b.j * 2) : cx + Math.cos(ang) * rr, y = cap ? cy + Math.sin(t * 3 + b.k * 20) * hr * (0.6 + b.j) : cy + Math.sin(ang) * rr * 0.7;
      ctx.fillStyle = cap ? "rgba(255,200,140,0.9)" : "rgba(255,236,200,0.85)"; ctx.fillRect(x, y, 2, 2);
    });
    label(ctx, e < 2.2 ? "closing in" : e < 5 ? "torn apart: stretched into a stream of gas" : "half the debris flares in a disc around the hole · the rest is flung away", W / 2, H * 0.93, { size: sz, color: e > 2.2 ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><button className="bh-btn bh-btn-on" onClick={go}>{run ? "again" : "send it in"}</button></div>
    </>
  );
}

export const ISSUE_11 = { bulge: Bulge, spring: Spring, brake: Brake, locked: Locked, roche: Roche, rings: Rings, io: Io, torn: Torn };
