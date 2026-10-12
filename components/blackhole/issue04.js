"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, seeded, Slider, nmCSS, nmRGB, kelvinCSS } from "./kit";
import { ping, soundOn } from "../../lib/spaceSound";

// THE BLACK HOLE No. 04 · The Barcode in the Rainbow (Update 5.74).
// Pictures: prism · blackbody · fraunhofer · ladder · fingerprints · helium ·
// shift · payne. The words are in lib/blackHole.js. Wavelengths are real
// (nanometres, in air); the mystery stars in "fingerprints" are made up
// from real elements' lines.

const LO = 380, HI = 700;

// a rainbow strip with lines in it. lines: [{ nm, depth (0..1), w (nm) }].
// emission: bright lines on black instead of dark lines on a rainbow.
function strip(ctx, x, y, w, h, lines, { lo = LO, hi = HI, emission = false, shift = 0 } = {}) {
  const col = (nm) => {
    let k = 1;
    for (const l of lines) { const d = (nm - (l.nm + shift)) / (l.w || 0.6); k -= (l.depth ?? 0.9) * Math.exp(-d * d); }
    return emission ? 1 - Math.max(0, Math.min(1, k)) : Math.max(0, Math.min(1, k));
  };
  for (let i = 0; i < w; i++) {
    const nm = lo + ((hi - lo) * i) / w, k = col(nm), [r, g, b] = nmRGB(nm);
    ctx.fillStyle = `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)})`;
    ctx.fillRect(x + i, y, 1.2, h);
  }
}
const xOf = (nm, x, w, lo = LO, hi = HI) => x + ((nm - lo) / (hi - lo)) * w;

// ─────────────────────────── prism ───────────────────────────
function Prism() {
  const [turn, setTurn] = useState(0.5);
  const tRef = useRef(turn); tRef.current = turn;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.15);
    const k = tRef.current, cx = W * 0.4, cy = H * 0.5, s = Math.min(W, H) * 0.24;
    const rot = (k - 0.5) * 0.5;
    const P = [[0, -s], [s * 0.87, s * 0.5], [-s * 0.87, s * 0.5]].map(([x, y]) => [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
    // the white beam in
    const hit = [(P[0][0] + P[2][0]) / 2, (P[0][1] + P[2][1]) / 2];
    ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, hit[1] + 26); ctx.lineTo(hit[0], hit[1]); ctx.stroke();
    glow(ctx, hit[0], hit[1], 18, "rgba(255,255,255,0.6)");
    // the fan out, spread by how far the prism is turned from its best angle
    const exit = [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2];
    const spread = 0.12 + (1 - Math.abs(k - 0.5) * 1.2) * 0.22, dev = 0.25 + (k - 0.5) * 0.5;
    const sx = W * 0.92;
    for (let nm = LO; nm <= HI; nm += 2) {
      const f = (nm - LO) / (HI - LO), ang = dev + (0.5 - f) * spread;
      const ey = exit[1] + Math.tan(ang) * (sx - exit[0]);
      ctx.strokeStyle = nmCSS(nm, 0.35); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(exit[0], exit[1]); ctx.lineTo(sx, ey); ctx.stroke();
      ctx.fillStyle = nmCSS(nm); ctx.fillRect(sx, ey - 2, W * 0.03, 4);
    }
    // inside the glass
    ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hit[0], hit[1]); ctx.lineTo(exit[0], exit[1]); ctx.stroke();
    ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
    ctx.fillStyle = "rgba(185,192,255,0.12)"; ctx.fill(); ctx.strokeStyle = "rgba(220,223,255,0.8)"; ctx.lineWidth = 1.5; ctx.stroke();
    const sz = fit(W, 55);
    label(ctx, W < 520 ? "every colour bends a different amount" : "white light in · every colour bends a slightly different amount", W / 2, H * 0.07, { size: sz, color: C.text });
    label(ctx, "violet bends most, red least", W / 2, H * 0.93, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="turn the prism" min={0} max={1} step={0.005} value={turn} onChange={setTurn} /></div>
    </>
  );
}

// ─────────────────────────── blackbody: colour is temperature ───────────────────────────
const STARS = [[2700, "an old light bulb's filament"], [3600, "Betelgeuse: a red supergiant"], [5772, "our Sun"], [9940, "Sirius: the brightest star at night"], [12100, "Rigel, in Orion"], [25000, "a hot blue star"]];
const planck = (nm, T) => { const l = nm * 1e-9; return 1 / (Math.pow(l, 5) * (Math.exp(1.438777e-2 / (l * T)) - 1)); };
function Blackbody() {
  const [u, setU] = useState(Math.log(5772 / 2500) / Math.log(12));
  const T = Math.round(2500 * Math.pow(12, u));
  const tRef = useRef(T); tRef.current = T;
  const peak = 2.897771955e6 / T; // nm
  const near = STARS.reduce((b, s) => (Math.abs(Math.log(s[0] / T)) < Math.abs(Math.log(b[0] / T)) ? s : b));
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const TT = tRef.current, sz = fit(W, 60);
    // the star
    const cx = W * 0.2, cy = H * 0.45, r = Math.min(W, H) * 0.13;
    glow(ctx, cx, cy, r * 3, kelvinCSS(TT, 0.55));
    ctx.fillStyle = kelvinCSS(TT); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    label(ctx, `${TT.toLocaleString()} K`, cx, cy + r + 24, { size: sz + 2, color: C.text });
    // its light, colour by colour
    const x0 = W * 0.42, x1 = W * 0.95, y0 = H * 0.8, y1 = H * 0.14, lo = 100, hi = 2000;
    const px = (nm) => x0 + ((nm - lo) / (hi - lo)) * (x1 - x0);
    for (let nm = LO; nm <= 750; nm += 2) { ctx.fillStyle = nmCSS(nm, 0.22); ctx.fillRect(px(nm), y1, px(nm + 2) - px(nm) + 0.5, y0 - y1); }
    label(ctx, "what eyes see", (px(LO) + px(750)) / 2, y1 - 8, { size: sz - 1 });
    const max = planck(Math.max(lo, Math.min(hi, 2.897771955e6 / TT)), TT);
    ctx.beginPath();
    for (let nm = lo; nm <= hi; nm += 4) { const y = y0 - (planck(nm, TT) / max) * (y0 - y1) * 0.95; nm === lo ? ctx.moveTo(px(nm), y) : ctx.lineTo(px(nm), y); }
    ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    label(ctx, "ultraviolet", px(220), y0 + 14, { size: sz - 1 });
    label(ctx, "infrared", px(1400), y0 + 14, { size: sz - 1 });
    const pk = 2.897771955e6 / TT;
    if (pk > lo && pk < hi) { glow(ctx, px(pk), y0 - (y0 - y1) * 0.95, 10, "rgba(255,255,255,0.9)"); label(ctx, "peak", px(pk), y0 - (y0 - y1) * 0.95 - 12, { size: sz - 1, color: C.text }); }
    label(ctx, "hotter: brighter, and the peak slides toward blue", W / 2, H * 0.95, { size: sz });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">surface</span><b>{T.toLocaleString()} K</b></div>
        <div><span className="mono">brightest colour</span><b>{peak < 380 ? `${Math.round(peak)} nm · ultraviolet` : peak > 750 ? `${Math.round(peak).toLocaleString()} nm · infrared` : `${Math.round(peak)} nm`}</b></div>
        <div><span className="mono">looks</span><b>{T < 3300 ? "orange-red" : T < 5000 ? "orange" : T < 6500 ? "white-yellow" : T < 10000 ? "white" : "blue-white"}</b></div>
        <div><span className="mono">like</span><b style={{ fontSize: 12 }}>{near[1]}</b></div>
      </div>
      <div className="bh-controls"><Slider label="heat it up" min={0} max={1} step={0.002} value={u} onChange={setU} /></div>
    </>
  );
}

// ─────────────────────────── fraunhofer: the Sun's barcode ───────────────────────────
const SUN_LINES = [
  { nm: 393.4, depth: 0.95, w: 1.2, name: "K · calcium" }, { nm: 396.8, depth: 0.95, w: 1.2, name: "H · calcium" },
  { nm: 410.2, depth: 0.5, w: 0.7, name: "h · hydrogen" }, { nm: 430.8, depth: 0.6, w: 0.8, name: "G · iron and carbon-hydrogen" },
  { nm: 434.0, depth: 0.55, w: 0.7, name: "hydrogen" }, { nm: 486.1, depth: 0.7, w: 0.8, name: "F · hydrogen" },
  { nm: 516.7, depth: 0.55, w: 0.5, name: "b · magnesium" }, { nm: 517.3, depth: 0.55, w: 0.5, name: "b · magnesium" }, { nm: 518.4, depth: 0.6, w: 0.5, name: "b · magnesium" },
  { nm: 527.0, depth: 0.5, w: 0.5, name: "E · iron" }, { nm: 589.0, depth: 0.8, w: 0.5, name: "D2 · sodium" }, { nm: 589.6, depth: 0.75, w: 0.5, name: "D1 · sodium" },
  { nm: 656.3, depth: 0.8, w: 0.8, name: "C · hydrogen" }, { nm: 686.7, depth: 0.6, w: 0.9, name: "B · oxygen in Earth's own air" },
];
const FAINT = (() => { const r = seeded(91); return Array.from({ length: 160 }, () => ({ nm: LO + r() * (HI - LO), depth: 0.15 + r() * 0.3, w: 0.25 })); })();
function Fraunhofer() {
  const look = useRef({ x: 0.58, on: false });
  const ref = useCanvas((ctx, W, H) => {
    bg(ctx, W, H);
    const sz = fit(W, 55), x0 = W * 0.04, w = W * 0.92, y = H * 0.18, h = H * 0.22;
    strip(ctx, x0, y, Math.round(w), h, [...SUN_LINES, ...FAINT]);
    // the magnifier
    const lx = look.current.x, nmC = LO + lx * (HI - LO), half = 7;
    const mx = x0 + lx * w;
    ctx.strokeStyle = "rgba(233,210,154,0.9)"; ctx.lineWidth = 1.5; ctx.strokeRect(mx - (half / (HI - LO)) * w, y - 4, ((2 * half) / (HI - LO)) * w, h + 8);
    const by = H * 0.5, bh = H * 0.24;
    ctx.beginPath(); ctx.moveTo(mx - (half / (HI - LO)) * w, y + h + 4); ctx.lineTo(x0, by); ctx.moveTo(mx + (half / (HI - LO)) * w, y + h + 4); ctx.lineTo(x0 + w, by); ctx.strokeStyle = "rgba(233,210,154,0.35)"; ctx.stroke();
    strip(ctx, x0, by, Math.round(w), bh, [...SUN_LINES, ...FAINT], { lo: nmC - half, hi: nmC + half });
    ctx.strokeStyle = "rgba(233,210,154,0.9)"; ctx.strokeRect(x0, by, w, bh);
    const named = SUN_LINES.filter((l) => Math.abs(l.nm - nmC) < half);
    named.forEach((l, i) => { const x = xOf(l.nm, x0, w, nmC - half, nmC + half); ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.beginPath(); ctx.moveTo(x, by + bh); ctx.lineTo(x, by + bh + 10 + i * 14); ctx.stroke(); label(ctx, `${l.nm} nm · ${l.name}`, Math.max(x0 + 90, Math.min(x0 + w - 90, x)), by + bh + 18 + i * 14, { size: sz - 1, color: C.text }); });
    if (!named.length) label(ctx, `${Math.round(nmC)} nm · slide along to find the strongest lines`, W / 2, by + bh + 18, { size: sz - 1 });
    label(ctx, "sunlight, spread out: a rainbow with gaps", W / 2, H * 0.08, { size: sz, color: C.text });
  });
  const move = (e) => { if (!look.current.on && e.type !== "pointerdown") return; const r = e.currentTarget.getBoundingClientRect(); look.current.x = Math.max(0.01, Math.min(0.99, (e.clientX - r.left - r.width * 0.04) / (r.width * 0.92))); };
  return <canvas ref={ref} className="bh-canvas" style={{ cursor: "ew-resize", touchAction: "none" }} onPointerDown={(e) => { look.current.on = true; e.currentTarget.setPointerCapture(e.pointerId); move(e); }} onPointerMove={move} onPointerUp={() => { look.current.on = false; }} />;
}

// ─────────────────────────── ladder: why only some colours ───────────────────────────
const BALMER = [{ n: 3, nm: 656.3 }, { n: 4, nm: 486.1 }, { n: 5, nm: 434.0 }, { n: 6, nm: 410.2 }];
function Ladder() {
  const [nm, setNm] = useState(540);
  const [found, setFound] = useState([]);
  const S = useRef({ shots: [], level: 2, jumpAt: 0, emit: null });
  const fire = () => {
    S.current.shots.push({ nm, x: 0, done: false });
    if (soundOn()) ping(300 + (700 - nm) * 1.4, 0.04);
  };
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    const s = S.current, sz = fit(W, 60);
    // the ladder: energy levels of hydrogen, E = -13.6 / n² eV
    const ax = W * 0.7, top = H * 0.2, bot = H * 0.84;
    for (let n = 1; n <= 6; n++) {
      const y = n === 1 ? bot : top + (13.6 / (n * n) / 3.4) * (bot - top) * 0.62;
      ctx.strokeStyle = n === s.level ? C.gold : "rgba(139,149,246,0.55)"; ctx.lineWidth = n === s.level ? 2.5 : 1.2;
      ctx.beginPath(); ctx.moveTo(ax - W * 0.14, y); ctx.lineTo(ax + W * 0.14, y); ctx.stroke();
      label(ctx, `n = ${n}`, ax + W * 0.16, y, { size: sz - 1, align: "left" });
    }
    const yOf = (n) => (n === 1 ? bot : top + (13.6 / (n * n) / 3.4) * (bot - top) * 0.62);
    // the electron
    const ey = yOf(s.level);
    glow(ctx, ax, ey, 16, "rgba(233,210,154,0.9)"); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ax, ey, 4.5, 0, Math.PI * 2); ctx.fill();
    // photons flying in
    s.shots.forEach((p) => {
      p.x += dt * W * 0.55;
      const x = p.x, y = H * 0.47;
      if (!p.done && x > ax - W * 0.15) {
        p.done = true;
        const hit = BALMER.find((b) => Math.abs(b.nm - p.nm) < 3);
        if (hit && s.level === 2) { p.absorbed = true; s.level = hit.n; s.jumpAt = t; s.from = hit; setFound((f) => (f.includes(hit.nm) ? f : [...f, hit.nm])); if (soundOn()) { ping(660, 0.06); setTimeout(() => ping(990, 0.05), 110); } }
      }
      if (p.absorbed) return;
      ctx.beginPath();
      for (let q = 0; q < 50; q++) { const xx = x - q * 1.6, yy = y + Math.sin(q * 0.6 + t * 20) * 5; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.strokeStyle = nmCSS(p.nm); ctx.lineWidth = 2; ctx.stroke();
    });
    s.shots = s.shots.filter((p) => !p.absorbed && p.x < W + 80);
    // after a moment the electron drops back, giving the same colour out
    if (s.level !== 2 && t - s.jumpAt > 1.1) { s.emit = { nm: s.from.nm, t0: t, a: Math.random() * Math.PI * 2 }; s.level = 2; }
    if (s.emit) {
      const r = (t - s.emit.t0) * W * 0.5;
      ctx.strokeStyle = nmCSS(s.emit.nm, Math.max(0, 1 - r / W)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ax, yOf(2), r, 0, Math.PI * 2); ctx.stroke();
      if (r > W) s.emit = null;
    }
    // the tuning colour
    glow(ctx, W * 0.08, H * 0.47, 22, nmCSS(nm, 0.9));
    label(ctx, "hydrogen atom", ax, H * 0.93, { size: sz, color: C.text });
    label(ctx, "your light", W * 0.08, H * 0.47 + 34, { size: sz - 1 });
    // what's been found, as dark lines in a rainbow
    strip(ctx, W * 0.04, H * 0.04, Math.round(W * 0.5), H * 0.05, BALMER.filter((b) => found.includes(b.nm)).map((b) => ({ nm: b.nm, depth: 1, w: 1.5 })));
    label(ctx, `${found.length} of 4 colours hydrogen will take`, W * 0.29, H * 0.14, { size: sz - 1, color: found.length === 4 ? C.gold : C.dim });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <Slider label="colour" min={390} max={690} step={0.5} value={nm} onChange={setNm} show={`${nm.toFixed(1)} nm`} />
        <button className="bh-btn bh-btn-on" onClick={fire}>fire</button>
      </div>
    </>
  );
}

// ─────────────────────────── fingerprints: whodunit ───────────────────────────
const ELEMENTS = {
  hydrogen: [656.3, 486.1, 434.0, 410.2],
  helium: [447.1, 471.3, 492.2, 501.6, 587.6, 667.8],
  sodium: [589.0, 589.6, 568.8, 616.0],
  calcium: [393.4, 396.8, 422.7, 445.5],
  iron: [404.6, 438.4, 440.5, 495.8, 527.0, 532.8, 537.1],
  magnesium: [470.3, 516.7, 517.3, 518.4],
};
const MYSTERY = [
  { name: "a hot blue-white star", has: ["hydrogen", "helium"] },
  { name: "a star much like the Sun", has: ["hydrogen", "sodium", "magnesium"] },
  { name: "a cooler orange star", has: ["hydrogen", "calcium", "iron", "sodium"] },
];
function Fingerprints() {
  const [which, setWhich] = useState(0);
  const [on, setOn] = useState([]);
  const star = MYSTERY[which];
  const solved = on.length === star.has.length && star.has.every((e) => on.includes(e));
  const ref = useCanvas((ctx, W, H) => {
    bg(ctx, W, H);
    const sz = fit(W, 60), x0 = Math.max(W * 0.18, 82), w = Math.round(W - x0 - W * 0.04);
    const lines = star.has.flatMap((e) => ELEMENTS[e].map((nm, i) => ({ nm, depth: 0.85 - (i % 3) * 0.12, w: 0.9 })));
    label(ctx, `mystery star: ${star.name}`, x0 + w / 2, H * 0.04, { size: sz, color: C.text });
    label(ctx, "its light", x0 - 8, H * 0.13, { size: sz, align: "right", color: C.gold });
    strip(ctx, x0, H * 0.08, w, H * 0.1, lines);
    const all = Object.keys(ELEMENTS), rowH = (H * 0.66) / all.length;
    all.forEach((e, i) => {
      const y = H * 0.24 + i * rowH, active = on.includes(e);
      label(ctx, e, x0 - 8, y + rowH * 0.35, { size: sz, align: "right", color: active ? C.gold : C.dim });
      ctx.fillStyle = active ? "rgba(233,210,154,0.08)" : "rgba(20,22,58,0.6)"; ctx.fillRect(x0, y, w, rowH * 0.7);
      ELEMENTS[e].forEach((nm) => {
        if (nm < LO || nm > HI) return;
        const x = xOf(nm, x0, w);
        ctx.fillStyle = active ? nmCSS(nm) : "rgba(139,149,246,0.45)"; ctx.fillRect(x - 1, y, 2, rowH * 0.7);
        if (active) { ctx.strokeStyle = "rgba(233,210,154,0.25)"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, H * 0.18); ctx.stroke(); }
      });
    });
    // lines nobody has explained yet
    const explained = (nm) => on.some((e) => ELEMENTS[e].includes(nm));
    lines.forEach((l) => { if (!explained(l.nm)) { ctx.fillStyle = C.rose; ctx.beginPath(); ctx.arc(xOf(l.nm, x0, w), H * 0.205, 2.5, 0, Math.PI * 2); ctx.fill(); } });
    label(ctx, solved ? `solved: ${star.has.join(", ")}` : W < 520 ? "red dots: lines not yet explained" : "red dots: lines still unexplained · a wrong element has lines that aren't there", x0 + w / 2, H * 0.95, { size: sz - 1, color: solved ? C.gold : C.dim });
  });
  const toggle = (e) => { const next = on.includes(e) ? on.filter((x) => x !== e) : [...on, e]; setOn(next); const ok = next.length === star.has.length && star.has.every((x) => next.includes(x)); if (soundOn()) ok ? (ping(660, 0.06), setTimeout(() => ping(880, 0.05), 110), setTimeout(() => ping(1320, 0.05), 220)) : ping(420, 0.03); };
  return (
    <>
      <canvas ref={ref} className="bh-canvas" style={{ aspectRatio: "16 / 12" }} />
      <div className="bh-controls">
        {Object.keys(ELEMENTS).map((e) => <button key={e} className={`bh-btn ${on.includes(e) ? "bh-btn-on" : ""}`} onClick={() => toggle(e)}>{e}</button>)}
        <button className="bh-btn" onClick={() => { setWhich((which + 1) % MYSTERY.length); setOn([]); }} style={{ marginLeft: "auto" }}>{solved ? "next star →" : "another star"}</button>
      </div>
    </>
  );
}

// ─────────────────────────── helium: found in the Sun first ───────────────────────────
const LAB = { hydrogen: [656.3, 486.1, 434.0, 410.2], sodium: [589.0, 589.6, 568.8], iron: [527.0, 532.8, 537.1, 495.8], helium: ELEMENTS.helium };
function Helium() {
  const [lab, setLab] = useState("sodium");
  const lRef = useRef(lab); lRef.current = lab;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const sz = fit(W, 60), x0 = W * 0.06, w = Math.round(W * 0.88), lo = 560, hi = 610;
    // the eclipse: glowing gas at the Sun's edge
    const cx = W * 0.5, cy = H * 0.24, r = Math.min(W, H) * 0.12;
    glow(ctx, cx, cy, r * 2.4, "rgba(220,225,255,0.35)");
    for (let i = 0; i < 5; i++) { const a = -2.4 + i * 0.25; glow(ctx, cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 1.05, r * 0.25, "rgba(255,90,110,0.7)", 0.6 + 0.3 * Math.sin(t * 2 + i)); }
    ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    label(ctx, W < 520 ? "18 August 1868 · total eclipse" : "18 August 1868 · a total eclipse · glowing gas at the Sun's edge", W / 2, H * 0.43, { size: sz - 1 });
    // its yellow light, zoomed in, as bright lines
    const sunLines = [{ nm: 587.56, depth: 1, w: 0.35 }];
    label(ctx, "from the Sun", x0, H * 0.5, { size: sz - 1, align: "left", color: C.text });
    strip(ctx, x0, H * 0.53, w, H * 0.1, sunLines, { lo, hi, emission: true });
    const q = xOf(587.56, x0, w, lo, hi);
    const L = lRef.current, labLines = LAB[L].map((nm) => ({ nm, depth: 1, w: 0.35 }));
    label(ctx, `from ${L} in a lab`, x0, H * 0.69, { size: sz - 1, align: "left", color: C.text });
    strip(ctx, x0, H * 0.72, w, H * 0.1, labLines, { lo, hi, emission: true });
    const match = LAB[L].some((nm) => Math.abs(nm - 587.56) < 0.2);
    ctx.setLineDash([3, 4]); ctx.strokeStyle = match ? C.gold : "rgba(201,123,110,0.8)"; ctx.beginPath(); ctx.moveTo(q, H * 0.53); ctx.lineTo(q, H * 0.82); ctx.stroke(); ctx.setLineDash([]);
    label(ctx, "587.6 nm", q, H * 0.86, { size: sz - 1, color: C.gold });
    label(ctx, W < 520 ? (match ? "a match: helium, for Helios, the Sun" : "no match: unknown in 1868") : match ? "a match: helium, named for Helios, the Sun · found on Earth only in 1895" : "no match: this yellow line belongs to no element known in 1868", W / 2, H * 0.94, { size: sz - 1, color: match ? C.gold : C.rose });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        {Object.keys(LAB).map((e) => <button key={e} className={`bh-btn ${lab === e ? "bh-btn-on" : ""}`} onClick={() => setLab(e)}>{e === "helium" ? "helium (1895)" : e}</button>)}
      </div>
    </>
  );
}

// ─────────────────────────── shift: lines that move ───────────────────────────
function Shift() {
  const [v, setV] = useState(0);
  const [planet, setPlanet] = useState(false);
  const vRef = useRef(v); vRef.current = v;
  const pRef = useRef(planet); pRef.current = planet;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const sz = fit(W, 60), x0 = W * 0.06, w = Math.round(W * 0.88);
    const pl = pRef.current;
    const vel = pl ? 2500 * Math.sin(t * 1.2) : vRef.current; // km/s; exaggerated for the planet
    const shift = (vel / 299792) * 550; // nm, near the middle of the spectrum
    const lines = ELEMENTS.hydrogen.concat(ELEMENTS.sodium.slice(0, 2), ELEMENTS.magnesium.slice(1)).map((nm) => ({ nm, depth: 0.9, w: 0.8 }));
    label(ctx, "in a lab, standing still", x0, H * 0.06, { size: sz - 1, align: "left" });
    strip(ctx, x0, H * 0.09, w, H * 0.1, lines);
    label(ctx, "the star", x0, H * 0.24, { size: sz - 1, align: "left", color: C.text });
    strip(ctx, x0, H * 0.27, w, H * 0.1, lines, { shift });
    lines.forEach((l) => { ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.beginPath(); ctx.moveTo(xOf(l.nm, x0, w), H * 0.19); ctx.lineTo(xOf(l.nm + shift, x0, w), H * 0.27); ctx.stroke(); });
    // the star, and its planet if it has one
    const cy = H * 0.66, cx = W / 2;
    if (pl) {
      const a = t * 1.2, R = Math.min(W, H) * 0.22;
      ctx.strokeStyle = "rgba(139,149,246,0.3)"; ctx.beginPath(); ctx.ellipse(cx, cy, R, R * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
      const sx = cx - Math.cos(a) * 14, sy = cy;
      glow(ctx, sx, sy, 50, "rgba(255,230,180,0.7)"); ctx.fillStyle = "#fff1d6"; ctx.beginPath(); ctx.arc(sx, sy, 16, 0, Math.PI * 2); ctx.fill();
      const px = cx + Math.cos(a) * R, py = cy + Math.sin(a) * R * 0.3;
      ctx.fillStyle = "#6a7fc8"; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
      label(ctx, W < 520 ? "the planet tugs: lines rock to and fro" : "a planet tugs its star in a little circle: its lines rock back and forth", W / 2, H * 0.93, { size: sz - 1, color: C.gold });
    } else {
      const sx = cx + (vel / 3000) * W * 0.25;
      glow(ctx, sx, cy, 50, "rgba(255,230,180,0.7)"); ctx.fillStyle = "#fff1d6"; ctx.beginPath(); ctx.arc(sx, cy, 16, 0, Math.PI * 2); ctx.fill();
      label(ctx, Math.abs(vel) < 60 ? (W < 520 ? "still: lines match the lab" : "not moving toward or away: lines where the lab puts them") : vel > 0 ? (W < 520 ? "away: lines slide red" : "moving away: every line slides toward red") : (W < 520 ? "closer: lines slide blue" : "coming closer: every line slides toward blue"), W / 2, H * 0.93, { size: sz - 1, color: C.gold });
    }
    label(ctx, `${vel >= 0 ? "away" : "toward us"} ${Math.abs(Math.round(vel)).toLocaleString()} km/s`, cx, H * 0.47, { size: sz, color: C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <Slider label="star's speed" min={-3000} max={3000} step={10} value={v} onChange={(x) => { setV(x); setPlanet(false); }} show={Math.abs(v) < 60 ? "still" : v > 0 ? "away" : "toward"} />
        <button className={`bh-btn ${planet ? "bh-btn-on" : ""}`} onClick={() => setPlanet(!planet)}>a star with a hidden planet</button>
      </div>
    </>
  );
}

// ─────────────────────────── payne: what stars are made of ───────────────────────────
const GUESS = [["oxygen", 46], ["silicon", 28], ["aluminium", 8], ["iron", 5], ["calcium", 4], ["others", 9], ["hydrogen", 0.1], ["helium", 0]];
const TRUTH = [["oxygen", 0.8], ["silicon", 0.07], ["aluminium", 0.01], ["iron", 0.16], ["calcium", 0.01], ["others", 0.85], ["hydrogen", 73], ["helium", 25]];
function Payne() {
  const [real, setReal] = useState(false);
  const rRef = useRef(real); rRef.current = real;
  const m = useRef(0);
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.15);
    m.current += ((rRef.current ? 1 : 0) - m.current) * Math.min(1, dt * 2.2);
    const k = m.current, sz = fit(W, 60);
    const x0 = W * 0.2, x1 = W * 0.9, top = H * 0.16, rowH = (H * 0.7) / GUESS.length;
    GUESS.forEach(([name, g], i) => {
      const v = g + (TRUTH[i][1] - g) * k, y = top + i * rowH;
      const big = name === "hydrogen" || name === "helium";
      label(ctx, name, x0 - 10, y + rowH * 0.4, { size: sz, align: "right", color: big && k > 0.5 ? C.gold : C.text });
      ctx.fillStyle = big ? "rgba(233,210,154,0.85)" : "rgba(139,149,246,0.7)";
      ctx.fillRect(x0, y + rowH * 0.12, Math.max(1, (v / 75) * (x1 - x0)), rowH * 0.56);
      label(ctx, `${v < 1 ? v.toFixed(2) : Math.round(v)}%`, x0 + Math.max(1, (v / 75) * (x1 - x0)) + 8, y + rowH * 0.4, { size: sz - 1, align: "left" });
    });
    label(ctx, k < 0.5 ? "1924: everyone assumed the Sun was made like Earth's crust" : "1925: what the light actually said", W / 2, H * 0.07, { size: sz + 1, color: k < 0.5 ? C.text : C.gold });
    label(ctx, "by mass", W / 2, H * 0.93, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <button className={`bh-btn ${!real ? "bh-btn-on" : ""}`} onClick={() => setReal(false)}>what people assumed</button>
        <button className={`bh-btn ${real ? "bh-btn-on" : ""}`} onClick={() => setReal(true)}>what Payne read in the light</button>
      </div>
    </>
  );
}

export const ISSUE_04 = { prism: Prism, blackbody: Blackbody, fraunhofer: Fraunhofer, ladder: Ladder, fingerprints: Fingerprints, helium: Helium, shift: Shift, payne: Payne };
