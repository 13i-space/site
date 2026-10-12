"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, seeded, Slider } from "./kit";
import { ping, soundOn } from "../../lib/spaceSound";

// THE BLACK HOLE No. 06 · The Lighthouse Stars (Update 5.77).
// Pictures: remnant · teaspoon · skater · lighthouse · scruff · listen ·
// timing · magnetar. The words are in lib/blackhole/06-the-lighthouse-stars.js.

// a train of clicks, for hearing a pulsar spin (rate per second, for `secs`)
let actx = null;
function clicks(rate, secs = 2.5) {
  if (!soundOn()) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    const sr = actx.sampleRate, n = Math.floor(sr * secs), buf = actx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    const period = sr / rate;
    for (let k = 0; k * period < n; k++) { const i0 = Math.floor(k * period); for (let j = 0; j < 90 && i0 + j < n; j++) d[i0 + j] += Math.exp(-j / 14) * (j % 2 ? -1 : 1) * 0.5; }
    for (let i = 0; i < n; i++) d[i] *= Math.min(1, i / 2000, (n - i) / 4000);
    const src = actx.createBufferSource(), g = actx.createGain(); g.gain.value = 0.35;
    src.buffer = buf; src.connect(g); g.connect(actx.destination); src.start();
  } catch (e) { /* no sound, no problem */ }
}

// ─────────────────────────── remnant: crush the Sun ───────────────────────────
const RSUN = 696000; // km
function Remnant() {
  const [k, setK] = useState(0);
  const kRef = useRef(k); kRef.current = k;
  const R = Math.exp(Math.log(RSUN) + (Math.log(12) - Math.log(RSUN)) * k); // km
  const rho = (1.4 * 1.989e33) / ((4 / 3) * Math.PI * Math.pow(R * 1e5, 3)); // g/cm³, for 1.4 Suns
  const what = R > 100000 ? "a star" : R > 3000 ? "about Earth-sized: a white dwarf" : R > 30 ? "smaller than the Moon" : "about the size of a city: a neutron star";
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.35);
    const kk = kRef.current, cx = W / 2, cy = H * 0.46, sz = fit(W, 55);
    const Rk = Math.exp(Math.log(RSUN) + (Math.log(12) - Math.log(RSUN)) * kk);
    // the view zooms so the ball stays visible; a ruler shows the real size
    const px = Math.min(W, H) * 0.3 * Math.pow(Rk / RSUN, 0.12);
    const hot = Math.min(1, kk * 1.3);
    glow(ctx, cx, cy, px * 2.4, `rgba(${200 + 55 * (1 - hot)},${210},${255},0.5)`);
    ctx.fillStyle = kk < 0.4 ? "#ffe9b8" : kk < 0.85 ? "#f4f6ff" : "#cfd6ff";
    ctx.beginPath(); ctx.arc(cx, cy, px, 0, Math.PI * 2); ctx.fill();
    // something familiar at the same scale
    const ref2 = Rk > 100000 ? ["Earth", 6371] : Rk > 2000 ? ["Earth", 6371] : Rk > 60 ? ["the Moon", 1737] : ["a city 20 km wide", 10];
    const rp = px * (ref2[1] / Rk);
    if (rp > 1 && rp < W * 0.4) {
      const x = cx + px + Math.max(rp, 4) + 30;
      ctx.strokeStyle = "rgba(111,195,168,0.9)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, cy, Math.max(rp, 2), 0, Math.PI * 2); ctx.stroke();
      label(ctx, `${ref2[0]}, same scale`, x, cy + Math.max(rp, 6) + 14, { size: sz - 1, color: C.teal });
    }
    label(ctx, "1.4 times the Sun's mass, squeezed", W / 2, H * 0.08, { size: sz, color: C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">radius</span><b>{R >= 1000 ? `${Math.round(R).toLocaleString()} km` : `${R.toFixed(R < 100 ? 0 : 0)} km`}</b></div>
        <div><span className="mono">density</span><b>{rho < 10 ? `${rho.toFixed(1)} g/cm³` : `${rho.toExponential(0).replace("e+", " × 10^")} g/cm³`}</b></div>
        <div><span className="mono">a sugar cube of it</span><b style={{ fontSize: 12 }}>{rho < 10 ? `${rho.toFixed(1)} grams` : rho < 1e6 ? `${Math.round(rho / 1000)} kg` : rho < 1e9 ? `${Math.round(rho / 1e6)} tonnes` : `${(rho / 1e12).toFixed(rho > 1e14 ? 0 : 2)} million tonnes`}</b></div>
        <div><span className="mono">it's now</span><b style={{ fontSize: 12 }}>{what}</b></div>
      </div>
      <div className="bh-controls"><Slider label="crush it" min={0} max={1} step={0.002} value={k} onChange={setK} /></div>
    </>
  );
}

// ─────────────────────────── teaspoon: weigh a spoonful ───────────────────────────
const SPOONS = [
  { name: "water", g: 5, say: "5 grams", like: "about as much as a coin" },
  { name: "gold", g: 97, say: "97 grams", like: "about a phone" },
  { name: "white dwarf", g: 5e6, say: "about 5 tonnes", like: "an elephant" },
  { name: "neutron star", g: 2e15, say: "about 2 billion tonnes", like: "more than every human on Earth put together, about four times over" },
];
function Teaspoon() {
  const [i, setI] = useState(0);
  const iRef = useRef(i); iRef.current = i;
  const tilt = useRef(0);
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const s = SPOONS[iRef.current], sz = fit(W, 55);
    const target = Math.min(0.42, Math.log10(s.g) * 0.028);
    tilt.current += (target - tilt.current) * Math.min(1, dt * 4);
    const cx = W / 2, cy = H * 0.42, arm = W * 0.32, a = tilt.current;
    ctx.strokeStyle = C.lav; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, H * 0.82); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - W * 0.08, H * 0.82); ctx.lineTo(cx + W * 0.08, H * 0.82); ctx.stroke();
    const lx = cx - Math.cos(a) * arm, ly = cy + Math.sin(a) * arm, rx = cx + Math.cos(a) * arm, ry = cy - Math.sin(a) * arm;
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke();
    // the spoon, on the left pan
    ctx.strokeStyle = "#cfd3e8"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(lx, ly - 12, 16, 8, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx + 14, ly - 14); ctx.lineTo(lx + 48, ly - 26); ctx.stroke();
    const col = ["#6aa8ff", "#E9D29A", "#f4f6ff", "#cfd6ff"][iRef.current];
    glow(ctx, lx, ly - 12, 22, `${col}88`); ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(lx, ly - 12, 12, 5, 0, 0, Math.PI * 2); ctx.fill();
    // the empty right pan, lifted
    ctx.strokeStyle = C.lav; ctx.beginPath(); ctx.moveTo(rx - 22, ry - 4); ctx.lineTo(rx + 22, ry - 4); ctx.stroke();
    label(ctx, `a teaspoon of ${s.name}: ${s.say}`, W / 2, H * 0.09, { size: sz + 2, color: iRef.current === 3 ? C.gold : C.text });
    label(ctx, s.like, W / 2, H * 0.93, { size: sz });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        {SPOONS.map((s, k) => <button key={k} className={`bh-btn ${i === k ? "bh-btn-on" : ""}`} onClick={() => { setI(k); if (soundOn()) ping(600 - k * 120, 0.05); }}>{s.name}</button>)}
      </div>
    </>
  );
}

// ─────────────────────────── skater: pull in, spin up ───────────────────────────
function Skater() {
  const [r, setR] = useState(1); // 1 = arms out, 0.3 = pulled in
  const rRef = useRef(r); rRef.current = r;
  const ang = useRef({ a: 0, b: 0 });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const rr = rRef.current, sz = fit(W, 60);
    const spin = 0.6 / (rr * rr); // same "amount of spin", smaller reach: faster turn
    ang.current.a += spin * dt * 2 * Math.PI * 0.5;
    ang.current.b += spin * dt * 2 * Math.PI * 0.5;
    // a skater seen from above: a head and two arms
    const cx = W * 0.27, cy = H * 0.46, L = Math.min(W, H) * 0.3 * rr;
    const a = ang.current.a;
    ctx.strokeStyle = C.warm; ctx.lineWidth = 6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx - Math.cos(a) * L, cy - Math.sin(a) * L); ctx.lineTo(cx + Math.cos(a) * L, cy + Math.sin(a) * L); ctx.stroke();
    ctx.fillStyle = C.warm; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();
    for (let k = 1; k < 8; k++) { const aa = a - k * 0.08 * spin; ctx.globalAlpha = 0.12 * (1 - k / 8); ctx.beginPath(); ctx.moveTo(cx - Math.cos(aa) * L, cy - Math.sin(aa) * L); ctx.lineTo(cx + Math.cos(aa) * L, cy + Math.sin(aa) * L); ctx.stroke(); }
    ctx.globalAlpha = 1; ctx.lineCap = "butt";
    label(ctx, "a skater, from above", cx, H * 0.88, { size: sz, color: C.text });
    // a star doing the same, with a spot on it to see the turn
    const sx = W * 0.73, R = Math.min(W, H) * 0.3 * rr;
    glow(ctx, sx, cy, R * 1.6, "rgba(200,215,255,0.4)");
    ctx.fillStyle = rr > 0.6 ? "#ffe2a8" : "#dfe5ff"; ctx.beginPath(); ctx.arc(sx, cy, R, 0, Math.PI * 2); ctx.fill();
    const b = ang.current.b;
    ctx.fillStyle = "rgba(5,6,15,0.5)"; ctx.beginPath(); ctx.ellipse(sx + Math.cos(b) * R * 0.6, cy + Math.sin(b) * R * 0.15, R * 0.18 * Math.abs(Math.sin(b)) + 2, R * 0.18, 0, 0, Math.PI * 2); ctx.fill();
    label(ctx, "a collapsing star core", sx, H * 0.88, { size: sz, color: C.text });
    label(ctx, W < 520 ? `now ${(1 / (rr * rr)).toFixed(1)}× faster` : `half the size → four times the spin · now ${(1 / (rr * rr)).toFixed(1)}× faster`, W / 2, H * 0.08, { size: sz, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="pull in" min={0} max={0.7} step={0.005} value={1 - r} onChange={(v) => setR(1 - v)} show={r > 0.8 ? "arms out" : r > 0.5 ? "pulling in" : "tucked tight"} /></div>
    </>
  );
}

// ─────────────────────────── lighthouse: why it blinks ───────────────────────────
function Lighthouse() {
  const [tilt, setTilt] = useState(40);
  const [view, setView] = useState(50);
  const tRef = useRef(tilt); tRef.current = tilt;
  const vRef = useRef(view); vRef.current = view;
  const S = useRef({ phi: 0, pulses: [], was: false });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const s = S.current, sz = fit(W, 60);
    const a = (tRef.current * Math.PI) / 180, e = (vRef.current * Math.PI) / 180;
    s.phi += dt * Math.PI * 2 * 0.5; // one turn every two seconds, slowed down to watch
    const cx = W * 0.42, cy = H * 0.42, L = Math.min(W, H) * 0.36;
    // 3D directions: y up (spin axis), x right, z toward the viewer
    const beam = [Math.sin(a) * Math.cos(s.phi), Math.cos(a), Math.sin(a) * Math.sin(s.phi)];
    const eye = [Math.sin(e), Math.cos(e), 0];
    // spin axis
    ctx.setLineDash([3, 5]); ctx.strokeStyle = "rgba(220,223,255,0.35)"; ctx.beginPath(); ctx.moveTo(cx, cy - L * 1.1); ctx.lineTo(cx, cy + L * 1.1); ctx.stroke(); ctx.setLineDash([]);
    // our line of sight
    ctx.strokeStyle = "rgba(111,195,168,0.7)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + eye[0] * L * 1.25, cy - eye[1] * L * 1.25); ctx.stroke();
    ctx.fillStyle = C.teal; ctx.beginPath(); ctx.arc(cx + eye[0] * L * 1.25, cy - eye[1] * L * 1.25, 5, 0, Math.PI * 2); ctx.fill();
    label(ctx, "us", cx + eye[0] * L * 1.25 + 14, cy - eye[1] * L * 1.25, { size: sz, color: C.teal, align: "left" });
    // the two beams, brighter when pointing toward the viewer
    [1, -1].forEach((sg) => {
      const b = beam.map((v) => v * sg);
      const bright = 0.35 + 0.35 * (b[2] + 1) / 2;
      const ex = cx + b[0] * L, ey = cy - b[1] * L;
      const g = ctx.createLinearGradient(cx, cy, ex, ey); g.addColorStop(0, `rgba(233,210,154,${bright})`); g.addColorStop(1, "rgba(233,210,154,0)");
      const px = -(ey - cy), py = ex - cx, n = Math.hypot(px, py) || 1, wv = 0.18;
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex + (px / n) * L * wv, ey + (py / n) * L * wv); ctx.lineTo(ex - (px / n) * L * wv, ey - (py / n) * L * wv); ctx.closePath(); ctx.fill();
    });
    glow(ctx, cx, cy, 26, "rgba(207,214,255,0.9)"); ctx.fillStyle = "#e9ecff"; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();
    // do we see it?
    const dot = Math.max(beam[0] * eye[0] + beam[1] * eye[1] + beam[2] * eye[2], -(beam[0] * eye[0] + beam[1] * eye[1] + beam[2] * eye[2]));
    const seen = dot > Math.cos((11 * Math.PI) / 180);
    if (seen && !s.was) { s.pulses.push(t); if (soundOn()) ping(1200, 0.05); }
    s.was = seen;
    if (seen) glow(ctx, cx + eye[0] * L * 1.25, cy - eye[1] * L * 1.25, 36, "rgba(233,210,154,1)");
    // what our telescope records
    const ty = H * 0.88, tx0 = W * 0.06, tx1 = W * 0.94;
    ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(tx0, ty); ctx.lineTo(tx1, ty); ctx.stroke();
    s.pulses = s.pulses.filter((p) => t - p < 8);
    s.pulses.forEach((p) => { const x = tx1 - ((t - p) / 8) * (tx1 - tx0); ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, ty); ctx.lineTo(x, ty - 22); ctx.stroke(); });
    label(ctx, "what our radio telescope records", tx0, ty + 14, { size: sz - 1, align: "left" });
    const right = W * 0.88;
    label(ctx, s.pulses.length ? "a beam sweeps past us: blip" : "the beams miss us: we'd never know it was there", right, H * 0.1, { size: sz, align: "right", color: s.pulses.length ? C.gold : C.rose });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <Slider label="beam tilt" min={0} max={90} step={1} value={tilt} onChange={setTilt} show={`${tilt}°`} />
        <Slider label="where we are" min={0} max={90} step={1} value={view} onChange={setView} show={`${view}°`} />
      </div>
    </>
  );
}

// ─────────────────────────── scruff: 1967 ───────────────────────────
function Scruff() {
  const [fast, setFast] = useState(false);
  const fRef = useRef(fast); fRef.current = fast;
  const S = useRef({ off: 0 });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    // chart paper
    ctx.fillStyle = "#efe7d2"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(160,120,90,0.25)"; ctx.lineWidth = 1;
    const grid = W / 24;
    for (let x = -((S.current.off) % grid); x < W; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const f = fRef.current, sz = fit(W, 55);
    // pixels per second of signal: slow paper squashes the pulses into a smudge
    const pps = f ? W / 7 : W / 260;
    S.current.off += dt * W * 0.06;
    const P = 1.337, mid = H * 0.5;
    ctx.strokeStyle = "#2b2f6a"; ctx.lineWidth = 1.3; ctx.beginPath();
    for (let x = 0; x <= W; x += 1) {
      const sec = (x + S.current.off) / pps;
      const n = Math.sin(x * 1.7 + t * 9) * 3 + Math.sin(x * 0.31 + t * 3) * 5 + (Math.random() - 0.5) * 6;
      const ph = ((sec % P) + P) % P;
      const inWindow = f || (((x + S.current.off) % (W * 1.4)) < W * 0.12);
      const pulse = inWindow ? Math.exp(-Math.pow((ph - 0.02) / (f ? 0.03 : 0.5), 2)) * (f ? H * 0.28 : H * 0.06) : 0;
      const y = mid - n - pulse;
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "rgba(5,6,15,0.75)"; ctx.fillRect(0, 0, W, H * 0.12); ctx.fillRect(0, H * 0.88, W, H * 0.12);
    label(ctx, W < 520 ? (f ? "a pulse every 1.337 seconds" : "noise, and a 'bit of scruff'") : f ? "chart run fast: a pulse every 1.337 seconds, as regular as a clock" : "the chart as it was: radio noise, and now and then a 'bit of scruff'", W / 2, H * 0.06, { size: sz, color: f ? C.gold : C.text });
    label(ctx, "Cambridge, 1967 · Jocelyn Bell's radio telescope chart", W / 2, H * 0.94, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <button className={`bh-btn ${!fast ? "bh-btn-on" : ""}`} onClick={() => setFast(false)}>the chart as it was</button>
        <button className={`bh-btn ${fast ? "bh-btn-on" : ""}`} onClick={() => { setFast(true); clicks(1 / 1.337, 4.5); }}>run the paper faster</button>
      </div>
    </>
  );
}

// ─────────────────────────── listen: hear them spin ───────────────────────────
const PULSARS = [
  { name: "the first: CP 1919", rate: 1 / 1.337, note: "found 1967 · one turn every 1.3 seconds" },
  { name: "Vela", rate: 11.2, note: "11 turns a second · left by a supernova about 11,000 years ago" },
  { name: "the Crab", rate: 29.9, note: "30 turns a second · the heart of the 1054 supernova" },
  { name: "J0437-4715", rate: 173.7, note: "174 turns a second · one of the steadiest clocks known" },
  { name: "J1748-2446ad", rate: 716, note: "716 turns a second · the fastest known: its surface moves at about a quarter of light speed" },
];
function Listen() {
  const [i, setI] = useState(2);
  const iRef = useRef(i); iRef.current = i;
  const ang = useRef(0);
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const p = PULSARS[iRef.current], sz = fit(W, 55), cx = W * 0.5, cy = H * 0.42, L = Math.min(W, H) * 0.32;
    ang.current += dt * p.rate * Math.PI * 2;
    // fast spins blur into a disc of light; slow ones you can follow
    const blur = Math.min(1, p.rate / 20);
    if (blur > 0.5) {
      for (let k = 0; k < 24; k++) { const a = (k / 24) * Math.PI * 2; ctx.strokeStyle = `rgba(233,210,154,${0.06 * blur})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * L, cy + Math.sin(a) * L * 0.35); ctx.stroke(); }
    }
    const a = ang.current;
    [0, Math.PI].forEach((o) => { ctx.strokeStyle = `rgba(233,210,154,${0.9 - 0.6 * blur})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a + o) * L, cy + Math.sin(a + o) * L * 0.35); ctx.stroke(); });
    glow(ctx, cx, cy, 30, "rgba(207,214,255,0.9)"); ctx.fillStyle = "#eef0ff"; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
    // a quarter-second of its pulses
    const y0 = H * 0.8, x0 = W * 0.06, x1 = W * 0.94, span = Math.min(4, 30 / p.rate);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    const n = Math.floor(span * p.rate);
    for (let k = 0; k <= n; k++) { const x = x0 + (k / (span * p.rate)) * (x1 - x0); ctx.strokeStyle = C.gold; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 - 18); ctx.stroke(); }
    label(ctx, `pulses in ${span >= 1 ? span.toFixed(1) + " seconds" : Math.round(span * 1000) + " milliseconds"}`, x0, y0 + 14, { size: sz - 1, align: "left" });
    label(ctx, W < 520 ? `${Math.round(p.rate * 10) / 10 >= 1 ? Math.round(p.rate) : p.rate.toFixed(2)} turns a second` : p.note, W / 2, H * 0.08, { size: sz, color: C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        {PULSARS.map((p, k) => <button key={k} className={`bh-btn ${i === k ? "bh-btn-on" : ""}`} onClick={() => { setI(k); clicks(p.rate, p.rate < 2 ? 4 : 2.5); }}>{p.name}</button>)}
      </div>
    </>
  );
}

// ─────────────────────────── timing: pulsars as clocks ───────────────────────────
function Timing() {
  const [mode, setMode] = useState(0);
  const mRef = useRef(mode); mRef.current = mode;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const m = mRef.current, sz = fit(W, 60);
    const x0 = W * 0.08, x1 = W * 0.94, y0 = H * 0.58, h = H * 0.3;
    // how early or late each pulse arrives
    const off = (u) => (m === 0 ? 0 : m === 1 ? Math.sin(u * Math.PI * 6) * 0.6 + Math.sin(u * Math.PI * 4.2 + 1) * 0.3 : -Math.pow(u, 2) * 1.1);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    label(ctx, "early ↑", x0 - 4, y0 - h * 0.8, { size: sz - 1, align: "right" });
    label(ctx, "late ↓", x0 - 4, y0 + h * 0.8, { size: sz - 1, align: "right" });
    label(ctx, m === 2 ? "1975 → 2005 →" : "years of pulses →", (x0 + x1) / 2, y0 + h + 14, { size: sz - 1 });
    const reveal = Math.min(1, ((t * 0.25) % 1.4));
    const r = seeded(4);
    for (let i = 0; i <= 140 * reveal; i++) {
      const u = i / 140, v = off(u) + (r() - 0.5) * 0.08;
      ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(x0 + u * (x1 - x0), y0 - v * h * 0.8, 2, 0, Math.PI * 2); ctx.fill();
    }
    if (m === 2) { ctx.strokeStyle = "rgba(185,192,255,0.8)"; ctx.lineWidth = 1.5; ctx.beginPath(); for (let i = 0; i <= 100; i++) { const u = i / 100; const y = y0 + Math.pow(u, 2) * 1.1 * h * 0.8; i ? ctx.lineTo(x0 + u * (x1 - x0), y) : ctx.moveTo(x0 + u * (x1 - x0), y); } ctx.stroke(); }
    const msg = ["a lone pulsar: every pulse right on time, to within millionths of a second", "pulses arriving early, then late, in a pattern: planets tugging the pulsar back and forth", "a pulsar orbiting another neutron star: the orbit shrinks exactly as Einstein's equations say it should"][m];
    label(ctx, W < 520 ? ["right on time", "planets tugging", "shrinking, as Einstein said"][m] : msg, W / 2, H * 0.1, { size: sz, color: m ? C.gold : C.text });
    if (m === 2 && W >= 520) label(ctx, "lavender: Einstein's prediction · gold: what was measured", W / 2, H * 0.18, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        {["alone", "with planets (1992)", "with a partner (1974)"].map((s, k) => <button key={k} className={`bh-btn ${mode === k ? "bh-btn-on" : ""}`} onClick={() => setMode(k)}>{s}</button>)}
      </div>
    </>
  );
}

// ─────────────────────────── magnetar ───────────────────────────
const MAGNETS = [[0.5, "Earth's magnetic field"], [100, "a fridge magnet"], [30000, "a hospital MRI scanner"], [450000, "the strongest steady magnet on Earth"], [1e12, "an ordinary pulsar"], [1e15, "a magnetar"]];
function Magnetar() {
  const [u, setU] = useState(0.3);
  const uRef = useRef(u); uRef.current = u;
  const G = Math.pow(10, -0.3 + u * 15.3);
  const near = MAGNETS.reduce((b, m) => (Math.abs(Math.log10(m[0] / G)) < Math.abs(Math.log10(b[0] / G)) ? m : b));
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const uu = uRef.current, cx = W / 2, cy = H * 0.48, R = Math.min(W, H) * 0.08, sz = fit(W, 55);
    // dipole field lines: r = k sin²θ, more and brighter with strength
    const lines = 4 + Math.round(uu * 10);
    for (let i = 1; i <= lines; i++) {
      const k = R * (1.4 + i * (Math.min(W, H) * 0.045 / R));
      [1, -1].forEach((side) => {
        ctx.beginPath();
        for (let q = 0; q <= 60; q++) { const th = 0.05 + (q / 60) * (Math.PI - 0.1), r = k * Math.sin(th) ** 2; const x = cx + side * r * Math.sin(th), y = cy - r * Math.cos(th); q ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        const pulse = 0.5 + 0.5 * Math.sin(t * (1 + uu * 6) - i);
        ctx.strokeStyle = `rgba(${150 + 105 * uu},${150 + 40 * uu},255,${0.15 + 0.5 * uu * pulse})`; ctx.lineWidth = 1 + uu * 1.5; ctx.stroke();
      });
    }
    glow(ctx, cx, cy, R * 3, `rgba(200,190,255,${0.3 + 0.5 * uu})`);
    ctx.fillStyle = "#e9ecff"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    if (uu > 0.95) label(ctx, "strong enough to stretch atoms into thin needles", W / 2, H * 0.93, { size: sz, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">field</span><b>{G < 1e6 ? `${Math.round(G).toLocaleString()} gauss` : `10^${Math.round(Math.log10(G))} gauss`}</b></div>
        <div><span className="mono">about as strong as</span><b style={{ fontSize: 12 }}>{near[1]}</b></div>
        <div><span className="mono">× Earth's field</span><b>{G / 0.5 < 1e6 ? Math.round(G / 0.5).toLocaleString() : `10^${Math.round(Math.log10(G / 0.5))}`}</b></div>
        <div><span className="mono">known magnetars</span><b>about 30</b></div>
      </div>
      <div className="bh-controls"><Slider label="magnetic field" min={0} max={1} step={0.002} value={u} onChange={setU} /></div>
    </>
  );
}

export const ISSUE_06 = { remnant: Remnant, teaspoon: Teaspoon, skater: Skater, lighthouse: Lighthouse, scruff: Scruff, listen: Listen, timing: Timing, magnetar: Magnetar };
// keep the click helper reachable for other issues (No. 13 may want it)
export { clicks };
