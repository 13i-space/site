"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, seeded, Slider } from "./kit";
import { soundOn } from "../../lib/spaceSound";

// THE BLACK HOLE No. 13 · A Signal, Translated (Update 5.77) — the season
// finale. Pictures: ripple · ring · arms · twin · chirp · catalogue · hum ·
// translated. The words are in lib/blackhole/13-a-signal-translated.js.

let actx = null;
const audio = () => { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === "suspended") actx.resume(); return actx; } catch (e) { return null; } };
// a chirp: rising pitch and loudness, then a quick ring-down
function playChirp({ f0 = 40, f1 = 320, secs = 1.4, gain = 0.25 } = {}) {
  if (!soundOn()) return; const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain(), now = a.currentTime;
  o.type = "sine"; o.frequency.setValueAtTime(f0, now); o.frequency.exponentialRampToValueAtTime(f1, now + secs);
  g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(gain, now + secs); g.gain.exponentialRampToValueAtTime(0.0001, now + secs + 0.25);
  o.connect(g); g.connect(a.destination); o.start(now); o.stop(now + secs + 0.3);
}
function playNotes(freqs, step = 0.16) {
  if (!soundOn()) return; const a = audio(); if (!a) return;
  freqs.forEach((f, i) => { const o = a.createOscillator(), g = a.createGain(), t0 = a.currentTime + i * step; o.type = "triangle"; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + step * 1.8); o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0 + step * 2); });
}

// ─────────────────────────── ripple: spacetime itself waves ───────────────────────────
function Ripple() {
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const sz = fit(W, 55), N = 30, cx = W / 2, cy = H * 0.5, ph = t * 2.2;
    const proj = (x, z, y) => { const cz = z + 2.4, f = Math.min(W * 0.9, H * 1.4); return [cx + (x / cz) * f, H * 0.12 + ((0.7 - y) / cz) * f * 0.42]; };
    const h = (x, z) => { const r = Math.hypot(x, z) + 0.001, a = Math.atan2(z, x); return (0.07 / Math.sqrt(r + 0.3)) * Math.cos(6 * r - ph * 2 - 2 * a) * Math.min(1, r * 2); };
    for (let i = 0; i <= N; i++) for (const dir of [0, 1]) {
      ctx.beginPath();
      for (let j = 0; j <= N * 2; j++) { const a = -1.6 + (i / N) * 3.2, b = -1.6 + (j / (N * 2)) * 3.2, x = dir ? a : b, z = dir ? b : a; const [px, py] = proj(x, z, h(x, z)); j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.strokeStyle = `rgba(139,149,246,${0.15 + (1 - Math.abs(i - N / 2) / (N / 2)) * 0.35})`; ctx.stroke();
    }
    [0, Math.PI].forEach((o) => { const [x, y] = proj(Math.cos(ph + o) * 0.18, Math.sin(ph + o) * 0.18, 0); glow(ctx, x, y, 14, "rgba(255,255,255,0.8)"); ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); });
    void cy;
    label(ctx, "two black holes in orbit send ripples through spacetime itself", W / 2, H * 0.93, { size: sz, color: C.text });
  });
  return <canvas ref={ref} className="bh-canvas" />;
}

// ─────────────────────────── ring: stretch and squeeze ───────────────────────────
function Ring() {
  const [amp, setAmp] = useState(0.25);
  const aRef = useRef(amp); aRef.current = amp;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const A = aRef.current, sz = fit(W, 55), cx = W / 2, cy = H * 0.47, R = Math.min(W, H) * 0.3, s = Math.sin(t * 3) * A;
    for (let i = 0; i < 24; i++) { const q = (i / 24) * Math.PI * 2, x = cx + Math.cos(q) * R * (1 + s), y = cy + Math.sin(q) * R * (1 - s); glow(ctx, x, y, 10, "rgba(233,210,154,0.8)"); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = "rgba(139,149,246,0.25)"; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    label(ctx, "a wave passing straight toward you: stretched one way, squeezed the other, again and again", W / 2, H * 0.93, { size: sz, color: C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="strength (hugely exaggerated)" min={0} max={0.4} step={0.005} value={amp} onChange={setAmp} show={amp < 0.01 ? "real size: invisible" : "exaggerated"} /></div>
    </>
  );
}

// ─────────────────────────── arms: a ruler made of light ───────────────────────────
function Arms() {
  const [d, setD] = useState(0);
  const dRef = useRef(d); dRef.current = d;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const dd = dRef.current, sz = fit(W, 60), bx = W * 0.2, by = H * 0.78, L = Math.min(W * 0.6, H * 0.62);
    const ex = bx + L * (1 + dd * 0.06), ny = by - L * (1 - dd * 0.06);
    // laser, splitter, arms, mirrors
    ctx.fillStyle = C.rose; ctx.fillRect(bx - 60, by - 6, 30, 12); label(ctx, "laser", bx - 45, by + 18, { size: sz - 1 });
    ctx.strokeStyle = "rgba(255,120,120,0.8)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(bx - 30, by); ctx.lineTo(bx, by); ctx.lineTo(ex, by); ctx.moveTo(bx, by); ctx.lineTo(bx, ny); ctx.stroke(); ctx.lineWidth = 1;
    ctx.fillStyle = "#cfd3e8"; ctx.fillRect(ex, by - 14, 6, 28); ctx.fillRect(bx - 14, ny - 6, 28, 6);
    ctx.save(); ctx.translate(bx, by); ctx.rotate(Math.PI / 4); ctx.fillStyle = "rgba(220,223,255,0.7)"; ctx.fillRect(-14, -2, 28, 4); ctx.restore();
    label(ctx, "4 km", (bx + ex) / 2, by + 16, { size: sz - 1 }); label(ctx, "4 km", bx - 18, (by + ny) / 2, { size: sz - 1, align: "right" });
    // the detector: dark when the arms match, light when they don't
    const bright = Math.sin(dd * Math.PI * 4) ** 2, dx = bx, dy = by + H * 0.12;
    glow(ctx, dx, Math.min(H - 10, dy), 30, `rgba(255,160,160,${bright})`); ctx.strokeStyle = C.grid; ctx.strokeRect(dx - 12, Math.min(H - 22, dy - 12), 24, 24);
    label(ctx, bright < 0.05 ? "the beams cancel at the detector: darkness" : "an arm changed length: light leaks through", W * 0.62, H * 0.12, { size: sz + 1, color: bright < 0.05 ? C.text : C.gold });
    void t;
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="a passing wave" min={-0.5} max={0.5} step={0.005} value={d} onChange={setD} show={Math.abs(d) < 0.01 ? "calm" : "stretching the arms"} /></div>
    </>
  );
}

// ─────────────────────────── twin: two detectors, one signal ───────────────────────────
const chirpAt = (u) => { const tc = 0.82; if (u > tc + 0.04) return 0; const tau = Math.max(0.0005, tc - u), f = 6 * Math.pow(tau, -0.375), a = Math.pow(tau, -0.25) * 0.12; return u > tc ? Math.exp(-(u - tc) * 120) * 0.5 * Math.sin(u * 300) : Math.min(0.5, a) * Math.sin(2 * Math.PI * f * u * 3); };
function Twin() {
  const [clean, setClean] = useState(0);
  const cRef = useRef(clean); cRef.current = clean;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const k = cRef.current, sz = fit(W, 60), r = seeded(Math.floor(t * 8));
    const trace = (y, name, shift, col) => {
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) { const u = i / 400, n = (r() - 0.5) * 0.9 * (1 - k), v = chirpAt(u - shift) * (0.4 + 0.6 * k) + n; const x = W * 0.05 + u * W * 0.9, yy = y - v * H * 0.14; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }
      ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.stroke(); ctx.lineWidth = 1;
      label(ctx, name, W * 0.05, y - H * 0.16, { size: sz, align: "left", color: C.text });
    };
    trace(H * 0.35, "Hanford, Washington", 0, C.gold);
    trace(H * 0.72, "Livingston, Louisiana · 3,000 km away", 0.007, C.lav);
    label(ctx, k > 0.9 ? "the same chirp in both, 7 thousandths of a second apart" : "each detector alone: shaking from traffic, waves, earthquakes", W / 2, H * 0.94, { size: sz, color: k > 0.9 ? C.gold : C.dim });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="filter out the noise" min={0} max={1} step={0.01} value={clean} onChange={setClean} /></div>
    </>
  );
}

// ─────────────────────────── chirp: 14 September 2015 ───────────────────────────
function Chirp() {
  const S = useRef({ t0: -10 });
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const sz = fit(W, 55), e = t - S.current.t0, playing = e < 1.7;
    const x0 = W * 0.05, x1 = W * 0.95, y = H * 0.62;
    ctx.beginPath();
    for (let i = 0; i <= 600; i++) { const u = i / 600, v = chirpAt(u); const x = x0 + u * (x1 - x0), yy = y - v * H * 0.4; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }
    ctx.strokeStyle = C.gold; ctx.lineWidth = 1.6; ctx.stroke(); ctx.lineWidth = 1;
    if (playing) { const u = Math.min(0.86, (e / 1.4) * 0.82); ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.moveTo(x0 + u * (x1 - x0), H * 0.3); ctx.lineTo(x0 + u * (x1 - x0), H * 0.85); ctx.stroke(); }
    // the two black holes, merging
    const f = playing ? Math.min(1, e / 1.4) : 0, cx = W / 2, cy = H * 0.2, rr = 40 * (1 - f * 0.95), ph = playing ? -Math.pow(1 - f * 0.999, 0.6) * 40 : t;
    if (f < 1) [0, Math.PI].forEach((o) => { ctx.fillStyle = "#000"; ctx.strokeStyle = "rgba(233,210,154,0.6)"; ctx.beginPath(); ctx.arc(cx + Math.cos(ph + o) * rr, cy + Math.sin(ph + o) * rr * 0.4, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
    else { glow(ctx, cx, cy, 30, "rgba(233,210,154,0.5)"); ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2); ctx.fill(); }
    label(ctx, "the real signal lasted about a fifth of a second · here it's slowed and raised so you can hear it", W / 2, H * 0.93, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">black holes</span><b>36 + 29 Suns</b></div>
        <div><span className="mono">became one of</span><b>62 Suns</b></div>
        <div><span className="mono">turned into ripples</span><b>3 Suns' worth</b></div>
        <div><span className="mono">distance</span><b>1.3 billion light-years</b></div>
      </div>
      <div className="bh-controls"><button className="bh-btn bh-btn-on" onClick={() => { S.current.t0 = performance.now() / 1000; playChirp({}); }}>play the chirp</button><span className="mono bh-slider-val" style={{ fontSize: 11 }}>sound on</span></div>
    </>
  );
}

// ─────────────────────────── catalogue: a growing choir ───────────────────────────
const EVENTS = [
  { name: "GW150914 · two black holes", m: [36, 29], f: [40, 320], secs: 1.2 },
  { name: "GW170817 · two neutron stars", m: [1.5, 1.3], f: [60, 900], secs: 3.2 },
  { name: "GW190521 · the heaviest pair", m: [85, 66], f: [30, 110], secs: 0.6 },
  { name: "GW200115 · a black hole eats a neutron star", m: [6, 1.5], f: [50, 600], secs: 2 },
];
function Catalogue() {
  const [i, setI] = useState(0);
  const iRef = useRef(i); iRef.current = i;
  const S = useRef(null);
  if (!S.current) { const r = seeded(61); S.current = Array.from({ length: 200 }, () => ({ x: r(), y: r(), m: 5 + Math.pow(r(), 2) * 80 })); }
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const sz = fit(W, 60);
    S.current.forEach((p, k) => { const tw = 0.4 + 0.6 * Math.abs(Math.sin(t + k)); glow(ctx, W * (0.05 + p.x * 0.9), H * (0.12 + p.y * 0.62), 3 + p.m / 12, `rgba(185,192,255,${0.5 * tw})`); });
    const ev = EVENTS[iRef.current];
    label(ctx, ev.name, W / 2, H * 0.84, { size: sz + 1, color: C.gold });
    label(ctx, `${ev.m[0]} and ${ev.m[1]} times the Sun's mass · each dot: one detected collision`, W / 2, H * 0.92, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">{EVENTS.map((e, k) => <button key={k} className={`bh-btn ${i === k ? "bh-btn-on" : ""}`} onClick={() => { setI(k); playChirp({ f0: e.f[0], f1: e.f[1], secs: e.secs }); }}>{e.name.split(" · ")[0]}</button>)}</div>
    </>
  );
}

// ─────────────────────────── hum: the galaxy as a detector ───────────────────────────
function Hum() {
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const sz = fit(W, 55), cx = W / 2, cy = H * 0.48, R = Math.min(W, H) * 0.36;
    glow(ctx, cx, cy, 14, "rgba(111,163,232,0.9)"); label(ctx, "Earth", cx, cy + 18, { size: sz - 1 });
    // a slow wave rolling across, nudging each pulsar's ticks early or late together
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + 0.2, x = cx + Math.cos(a) * R * (0.7 + 0.3 * ((i * 7) % 5) / 5), y = cy + Math.sin(a) * R * 0.75;
      const shift = Math.sin(t * 0.8 - Math.cos(2 * a) * 1.5);
      ctx.strokeStyle = "rgba(233,210,154,0.25)"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
      const pulse = (t * 2 + shift * 0.3) % 1 < 0.15;
      glow(ctx, x, y, pulse ? 16 : 8, "rgba(233,210,154,0.95)", pulse ? 1 : 0.5);
    }
    label(ctx, "pulsars across the galaxy, their ticks drifting early and late together", W / 2, H * 0.93, { size: sz, color: C.text });
  });
  return <canvas ref={ref} className="bh-canvas" />;
}

// ─────────────────────────── translated: gravity, as music ───────────────────────────
const SCALE = [196, 220, 246.94, 293.66, 329.63, 392, 440, 493.88, 587.33, 659.25, 783.99];
function Translated() {
  const S = useRef({ t0: -10 });
  const [played, setPlayed] = useState(false);
  // sample the chirp's rising peaks into notes
  const notes = Array.from({ length: 16 }, (_, k) => SCALE[Math.min(SCALE.length - 1, Math.floor(Math.pow(k / 15, 1.8) * SCALE.length))]);
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.35);
    const sz = fit(W, 55), e = t - S.current.t0, x0 = W * 0.08, x1 = W * 0.92;
    ctx.beginPath(); for (let i = 0; i <= 500; i++) { const u = i / 500, v = chirpAt(u * 0.86); i ? ctx.lineTo(x0 + u * (x1 - x0), H * 0.38 - v * H * 0.25) : ctx.moveTo(x0, H * 0.38); } ctx.strokeStyle = "rgba(139,149,246,0.6)"; ctx.stroke();
    notes.forEach((f, k) => { const x = x0 + (k / 15) * (x1 - x0), y = H * 0.82 - (SCALE.indexOf(f) / SCALE.length) * H * 0.3, lit = e > k * 0.16 && e < k * 0.16 + 0.3; glow(ctx, x, y, lit ? 18 : 8, "rgba(233,210,154,0.9)", lit ? 1 : 0.45); });
    label(ctx, "above: a ripple in spacetime · below: the same shape, as notes", W / 2, H * 0.08, { size: sz, color: C.text });
    label(ctx, "a signal, translated", W / 2, H * 0.94, { size: sz + 4, color: C.gold, font: "Fraunces" });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><button className="bh-btn bh-btn-on" onClick={() => { S.current.t0 = performance.now() / 1000; playNotes(notes); setPlayed(true); }}>{played ? "play it again" : "translate it"}</button></div>
    </>
  );
}

export const ISSUE_13 = { ripple: Ripple, ring: Ring, arms: Arms, twin: Twin, chirp: Chirp, catalogue: Catalogue, hum: Hum, translated: Translated };
