"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, seeded, Slider, nmCSS, kelvinCSS } from "./kit";
import { ping, soundOn } from "../../lib/spaceSound";

// THE BLACK HOLE No. 03 · The Stretching Universe (Update 5.74).
// Pictures: olbers · doppler · hubble · raisin · stretch · rewind · cmb ·
// accelerate. The words are in lib/blackHole.js.

// ─────────────────────────── olbers: why is the night dark? ───────────────────────────
function Olbers() {
  const [k, setK] = useState(0.1); // 0 = our universe .. 1 = infinite and unchanging
  const kRef = useRef(k); kRef.current = k;
  const S = useRef(null);
  const ref = useCanvas((ctx, W, H, t) => {
    if (!S.current) {
      const r = seeded(3);
      // stars spread evenly through space: many more far away than near
      S.current = Array.from({ length: 9000 }, () => ({ x: r(), y: r(), d: 0.06 + Math.cbrt(r()) * 0.94, tw: r() * 6 }))
        .sort((a, b) => b.d - a.d);
    }
    const kk = kRef.current, reach = 0.08 + kk * 0.92;
    const fill = Math.pow(kk, 2.6);
    bg(ctx, W, H);
    // every line of sight ending on a star: the whole sky glows
    ctx.fillStyle = `rgba(255,236,200,${fill * 0.95})`; ctx.fillRect(0, 0, W, H);
    S.current.forEach((s) => {
      if (s.d > reach) return;
      const r = 0.5 + 2.6 * Math.pow(1 - s.d, 3);
      ctx.globalAlpha = Math.min(1, 0.25 + 0.75 * (1 - s.d) + 0.15 * Math.sin(t + s.tw));
      ctx.fillStyle = s.d < 0.2 ? "#fff6e4" : "#f2e6ff";
      ctx.beginPath(); ctx.arc(s.x * W, s.y * H, r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    const sz = fit(W, 55);
    const msg = W < 520 ? (kk < 0.2 ? "our sky: light has had 13.8 bn years" : kk < 0.9 ? "older: more stars fill in" : "forever: every sightline hits a star") : kk < 0.2 ? "our sky: light has only had 13.8 billion years to travel" : kk < 0.9 ? "older, bigger, unchanging: more and more stars fill in" : "forever and unchanging: every line of sight ends on a star";
    ctx.fillStyle = "rgba(5,6,15,0.7)"; ctx.fillRect(0, H * 0.02, W, H * 0.08);
    label(ctx, msg, W / 2, H * 0.06, { size: sz, color: kk > 0.9 ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="how long light has been travelling" min={0} max={1} step={0.005} value={k} onChange={setK} show={k < 0.2 ? "13.8 billion years" : k < 0.9 ? "far longer" : "forever"} /></div>
    </>
  );
}

// ─────────────────────────── doppler: squeezed ahead, stretched behind ───────────────────────────
function Doppler() {
  const [v, setV] = useState(0.4);
  const vRef = useRef(v); vRef.current = v;
  const S = useRef({ x: 0.5, waves: [], last: 0 });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const s = S.current, vv = vRef.current, cy = H * 0.5;
    const speed = 0.16; // waves, in widths per second
    s.x += vv * speed * dt; if (s.x > 0.72) { s.x = 0.28; s.waves = []; } if (s.x < 0.28) { s.x = 0.72; s.waves = []; }
    if (t - s.last > 0.22) { s.last = t; s.waves.push({ x: s.x, born: t }); }
    s.waves.forEach((w) => {
      const r = (t - w.born) * speed * W;
      ctx.beginPath(); ctx.arc(w.x * W, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(185,192,255,${Math.max(0, 0.6 - r / W)})`; ctx.lineWidth = 1.5; ctx.stroke();
    });
    s.waves = s.waves.filter((w) => (t - w.born) * speed < 1.2);
    // the source
    glow(ctx, s.x * W, cy, 24, "rgba(233,210,154,0.8)"); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(s.x * W, cy, 7, 0, Math.PI * 2); ctx.fill();
    // two watchers, each seeing a different colour
    const lamAhead = 550 * (1 - vv * 0.4), lamBehind = 550 * (1 + vv * 0.4);
    const eye = (x, lam, name) => {
      glow(ctx, x, cy, 40, nmCSS(Math.max(380, Math.min(780, lam)), 0.9));
      ctx.fillStyle = nmCSS(Math.max(380, Math.min(780, lam))); ctx.beginPath(); ctx.arc(x, cy, 12, 0, Math.PI * 2); ctx.fill();
      label(ctx, name, x, cy + 34, { size: fit(W, 60), color: C.text });
      label(ctx, `${Math.round(lam)} nm`, x, cy + 50, { size: fit(W, 60) });
    };
    const ahead = vv >= 0 ? W * 0.9 : W * 0.1, behind = vv >= 0 ? W * 0.1 : W * 0.9;
    eye(ahead, lamAhead, Math.abs(vv) < 0.02 ? "same colour" : "ahead: bluer");
    eye(behind, lamBehind, Math.abs(vv) < 0.02 ? "same colour" : "behind: redder");
    label(ctx, W < 520 ? "speed hugely exaggerated" : "the speed is hugely exaggerated so the colours show", W / 2, H * 0.93, { size: fit(W, 55) - 1 });
  });
  const listen = () => {
    if (!soundOn()) return;
    const f = 520;
    ping(f / (1 - v * 0.4), 0.07);
    setTimeout(() => ping(f / (1 + v * 0.4), 0.07), 380);
  };
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <Slider label="source speed" min={-0.7} max={0.7} step={0.01} value={v} onChange={setV} show={Math.abs(v) < 0.02 ? "standing still" : v > 0 ? "moving right" : "moving left"} />
        <button className="bh-btn" onClick={listen}>hear it (ahead, then behind)</button>
      </div>
    </>
  );
}

// ─────────────────────────── hubble: farther is faster ───────────────────────────
const H0_MLY = 70 / 3.2616; // km/s per million light-years, for 70 km/s/Mpc
function Hubble() {
  const S = useRef(null);
  const [n, setN] = useState(0);
  if (!S.current) {
    const r = seeded(41);
    S.current = Array.from({ length: 12 }, (_, i) => {
      const d = 40 + Math.pow((i + r()) / 12, 1.2) * 560; // million light-years
      return { d, v: d * H0_MLY * (0.9 + r() * 0.2), x: 0.06 + r() * 0.36, y: 0.12 + r() * 0.72, a: r() * 3, done: false };
    });
  }
  const measure = (g) => { if (g.done) return; g.done = true; setN((x) => x + 1); if (soundOn()) ping(380 + g.d, 0.05); };
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W * 0.48, H, t, 0.3);
    const gs = S.current, sz = fit(W, 60);
    // the sky: galaxies, smaller the farther
    gs.forEach((g) => {
      const x = g.x * W, y = g.y * H, r = Math.max(3, Math.min(16, 900 / g.d));
      ctx.save(); ctx.translate(x, y); ctx.rotate(g.a);
      glow(ctx, 0, 0, r * 1.6, g.done ? "rgba(233,210,154,0.6)" : "rgba(220,210,255,0.55)");
      ctx.fillStyle = "rgba(255,245,230,0.7)"; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.7, r * 0.28, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      if (g.done) label(ctx, `${Math.round(g.d)} Mly`, x, y + r + 8, { size: sz - 1, color: C.gold });
      else if (Math.sin(t * 3 + g.a) > 0.6) { ctx.strokeStyle = "rgba(185,192,255,0.5)"; ctx.beginPath(); ctx.arc(x, y, r * 1.9, 0, Math.PI * 2); ctx.stroke(); }
    });
    // the chart
    const x0 = W * 0.56, x1 = W * 0.95, y0 = H * 0.85, y1 = H * 0.12, maxD = 650, maxV = 15000;
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    label(ctx, "distance →", (x0 + x1) / 2, y0 + 16, { size: sz });
    ctx.save(); ctx.translate(x0 - 14, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); label(ctx, "speed away →", 0, 0, { size: sz }); ctx.restore();
    const px = (d) => x0 + (d / maxD) * (x1 - x0), py = (v) => y0 - (v / maxV) * (y0 - y1);
    const done = gs.filter((g) => g.done);
    if (done.length >= 4) {
      const slope = done.reduce((s, g) => s + g.d * g.v, 0) / done.reduce((s, g) => s + g.d * g.d, 0);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "rgba(233,210,154,0.7)"; ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(maxD), py(slope * maxD)); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, W < 520 ? `≈ ${Math.round(slope * 3.2616)} km/s/Mpc` : `a straight line: ≈ ${Math.round(slope * 3.2616)} km/s per megaparsec`, (x0 + x1) / 2, y1 - 2, { size: sz, color: C.gold });
    } else label(ctx, W < 520 ? "tap galaxies" : "tap galaxies to measure them", (x0 + x1) / 2, y1 - 2, { size: sz, color: C.text });
    done.forEach((g) => { glow(ctx, px(g.d), py(g.v), 10, "rgba(233,210,154,0.8)"); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(px(g.d), py(g.v), 3.5, 0, Math.PI * 2); ctx.fill(); });
  });
  const tap = (e) => {
    const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    let best = null, bd = 0.07;
    S.current.forEach((g) => { const d = Math.hypot((g.x - x) * (r.width / r.height), g.y - y); if (d < bd) { bd = d; best = g; } });
    if (best) measure(best);
  };
  return (
    <>
      <canvas ref={ref} className="bh-canvas" onPointerDown={tap} />
      <div className="bh-controls">
        <span className="mono bh-slider-val">{n} of 12 measured</span>
        <button className="bh-btn" onClick={() => S.current.forEach(measure)}>measure them all</button>
        <button className="bh-btn" onClick={() => { S.current.forEach((g) => { g.done = false; }); setN(0); }}>clear</button>
      </div>
    </>
  );
}

// ─────────────────────────── raisin: no centre ───────────────────────────
function Raisin() {
  const [a, setA] = useState(1.5);
  const aRef = useRef(a); aRef.current = a;
  const S = useRef(null);
  if (!S.current) {
    const r = seeded(17), g = [];
    for (let j = 0; j < 6; j++) for (let i = 0; i < 9; i++) g.push({ x: (i + 0.2 + r() * 0.6) / 9 - 0.5, y: (j + 0.2 + r() * 0.6) / 6 - 0.5, c: r() });
    S.current = { g, home: 22 };
  }
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.15);
    const s = S.current, aa = aRef.current, h = s.g[s.home];
    // positions relative to home, stretched by the scale of the universe
    const pos = (g, sc) => [W / 2 + (g.x - h.x) * W * 0.5 * sc, H / 2 + (g.y - h.y) * H * 0.5 * sc];
    s.g.forEach((g, i) => {
      const [bx, by] = pos(g, 1), [x, y] = pos(g, aa);
      if (i !== s.home && aa > 1.01) {
        ctx.strokeStyle = `rgba(233,210,154,${Math.min(0.8, 0.2 + (aa - 1))})`; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(x, y); ctx.stroke();
        const ang = Math.atan2(y - by, x - bx);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(ang - 0.4) * 6, y - Math.sin(ang - 0.4) * 6); ctx.lineTo(x - Math.cos(ang + 0.4) * 6, y - Math.sin(ang + 0.4) * 6); ctx.closePath(); ctx.fillStyle = C.gold; ctx.fill();
      }
      const home = i === s.home;
      glow(ctx, x, y, home ? 26 : 12, home ? "rgba(111,195,168,0.9)" : `rgba(${200 + g.c * 55},200,255,0.7)`);
      ctx.fillStyle = home ? C.teal : "#f4f0ff"; ctx.beginPath(); ctx.arc(x, y, home ? 5 : 2.6, 0, Math.PI * 2); ctx.fill();
    });
    const sz = fit(W, 55);
    label(ctx, W < 520 ? "you are green · tap another to move" : "you are the green galaxy · tap any other to move there", W / 2, H * 0.06, { size: sz, color: C.text });
    label(ctx, W < 520 ? "twice as far, twice as fast" : "from anywhere, everything moves away · twice as far, twice as fast", W / 2, H * 0.94, { size: sz - 1, color: C.gold });
  });
  const tap = (e) => {
    const r = e.currentTarget.getBoundingClientRect(), W = r.width, H = r.height, x = e.clientX - r.left, y = e.clientY - r.top;
    const s = S.current, h = s.g[s.home], aa = aRef.current;
    let best = -1, bd = 30;
    s.g.forEach((g, i) => { const gx = W / 2 + (g.x - h.x) * W * 0.5 * aa, gy = H / 2 + (g.y - h.y) * H * 0.5 * aa; const d = Math.hypot(gx - x, gy - y); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) s.home = best;
  };
  return (
    <>
      <canvas ref={ref} className="bh-canvas" onPointerDown={tap} />
      <div className="bh-controls"><Slider label="let time pass" min={1} max={1.8} step={0.005} value={a} onChange={setA} show={`space ×${a.toFixed(2)}`} /></div>
    </>
  );
}

// ─────────────────────────── stretch: light pulled longer ───────────────────────────
const STRETCH_NOTES = [[1.05, "a nearby galaxy"], [1.5, "a galaxy about 5 billion light-years away"], [3, "light from when the universe was about 3 billion years old"], [7, "early galaxies, seen by Hubble"], [15, "the most distant galaxies Webb has found"]];
function Stretch() {
  const [S, setS] = useState(3);
  const sRef = useRef(S); sRef.current = S;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const st = sRef.current, period = 6;
    const p = (t % period) / period; // the journey, start to finish
    const a = 1 + (st - 1) * p;       // how stretched space is now
    // the grid of space, its spacing growing
    const sp = (W / 16) * a, cx = W * 0.02;
    ctx.strokeStyle = "rgba(58,62,117,0.5)"; ctx.lineWidth = 1;
    for (let x = cx; x < W; x += sp) { ctx.beginPath(); ctx.moveTo(x, H * 0.15); ctx.lineTo(x, H * 0.8); ctx.stroke(); }
    // the light: born blue on the left, arriving stretched on the right
    const lam0 = 400, lam = lam0 * a, cy = H * 0.47;
    const lamPx = Math.min(W, 700) * 0.03 * Math.pow(a, 0.75);
    const head = W * 0.05 + p * W * 0.9, len = Math.min(W * 0.7, lamPx * 3.5);
    ctx.beginPath();
    for (let x = Math.max(0, head - len); x <= head; x += 1) {
      const env = Math.sin(((x - (head - len)) / len) * Math.PI);
      const y = cy + Math.sin(((x - head) / lamPx) * Math.PI * 2) * H * 0.14 * env;
      x === Math.max(0, head - len) ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    const visible = lam <= 780;
    ctx.strokeStyle = visible ? nmCSS(lam) : "rgba(201,123,110,0.55)"; ctx.lineWidth = 2.5;
    if (!visible) ctx.setLineDash([5, 4]);
    ctx.stroke(); ctx.setLineDash([]);
    glow(ctx, W * 0.04, cy, 24, "rgba(185,192,255,0.8)");
    label(ctx, "galaxy", W * 0.04, cy + 32, { size: fit(W, 60) });
    label(ctx, "us", W * 0.97, cy + 32, { size: fit(W, 60) });
    const sz = fit(W, 55);
    label(ctx, `${W < 520 ? "" : "wavelength now: "}${Math.round(lam).toLocaleString()} nm · ${visible ? "visible" : W < 520 ? "infrared" : "infrared: invisible to eyes"}`, W / 2, H * 0.08, { size: sz, color: visible ? C.text : C.rose });
    label(ctx, W < 520 ? "space stretches, so does the light" : "space stretches while the light is on its way · so does the light", W / 2, H * 0.92, { size: sz - 1 });
  });
  const note = STRETCH_NOTES.reduce((n, [v, s]) => (S >= v - 0.01 ? s : n), "light from close by");
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">sent as</span><b>400 nm violet</b></div>
        <div><span className="mono">arrives as</span><b>{Math.round(400 * S).toLocaleString()} nm</b></div>
        <div><span className="mono">redshift z</span><b>{(S - 1).toFixed(1)}</b></div>
        <div><span className="mono">like</span><b style={{ fontSize: 12 }}>{note}</b></div>
      </div>
      <div className="bh-controls"><Slider label="how much space stretches on the way" min={1} max={15} step={0.05} value={S} onChange={setS} show={`×${S.toFixed(1)}`} /></div>
    </>
  );
}

// ─────────────────────────── rewind: run it backward ───────────────────────────
const sig2 = (v) => { const p = Math.pow(10, Math.floor(Math.log10(v)) - 1); return Math.round(v / p) * p; };
const fmtYears = (gy) => (gy >= 1 ? `${gy.toFixed(1)} billion years` : gy >= 0.001 ? `${sig2(gy * 1000).toLocaleString()} million years` : `${sig2(gy * 1e9).toLocaleString()} years`);
function Rewind() {
  const [u, setU] = useState(0);
  const uRef = useRef(u); uRef.current = u;
  const tAfter = 13.8 * Math.pow(10, -6.2 * u); // billions of years since the Big Bang
  const scale = Math.pow(tAfter / 13.8, 2 / 3);
  const temp = 2.725 / scale;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const uu = uRef.current, ta = 13.8 * Math.pow(10, -6.2 * uu), a = Math.pow(ta / 13.8, 2 / 3), T = 2.725 / a;
    // the glow of the universe itself, once it is hot enough to see
    if (T > 600) {
      const f = Math.min(1, (T - 600) / 2600);
      ctx.fillStyle = kelvinCSS(Math.min(T, 12000), f * 0.85); ctx.fillRect(0, 0, W, H);
      // the hot gas churns: brighter and dimmer patches
      for (let i = 0; i < 26; i++) { const x = W * (0.5 + 0.5 * Math.sin(i * 2.1 + t * 0.15 * (1 + (i % 3)))), y = H * (0.5 + 0.5 * Math.cos(i * 1.7 + t * 0.12 * (1 + (i % 2)))); glow(ctx, x, y, Math.min(W, H) * 0.3, i % 2 ? kelvinCSS(Math.min(T * 1.3, 15000), 0.45) : kelvinCSS(Math.max(1500, T * 0.6), 0.4), f * 0.8); }
    }
    else starfield(ctx, W, H, t, 0.35 * Math.min(1, a * 3));
    // galaxies on a grid that tiles all of space: no centre, just closer together
    const cell = 64 * a;
    if (ta > 0.4 && cell > 3) {
      const r = (i, j, k) => { const v = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453; return v - Math.floor(v); };
      const n0x = Math.floor(-W / 2 / cell) - 1, n1x = Math.ceil(W / 2 / cell) + 1, n0y = Math.floor(-H / 2 / cell) - 1, n1y = Math.ceil(H / 2 / cell) + 1;
      const fade = Math.min(1, (ta - 0.4) / 1.5);
      for (let j = n0y; j <= n1y; j++) for (let i = n0x; i <= n1x; i++) {
        const x = W / 2 + (i + r(i, j, 1)) * cell, y = H / 2 + (j + r(i, j, 2)) * cell;
        glow(ctx, x, y, Math.max(2, 7 * Math.min(1, a * 2)), "rgba(240,232,255,0.8)", fade);
        ctx.fillStyle = `rgba(255,250,240,${fade})`; ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
      }
    }
    const sz = fit(W, 55);
    const msg = ta > 10 ? "today: galaxies spread far apart" : ta > 1 ? "earlier: the same galaxies, closer together" : ta > 0.4 ? "the first galaxies are forming" : T < 3000 ? "before any stars: a dark, cooling fog of gas" : "so hot the whole universe glows";
    ctx.fillStyle = "rgba(5,6,15,0.65)"; ctx.fillRect(0, H * 0.02, W, H * 0.08);
    label(ctx, msg, W / 2, H * 0.06, { size: sz, color: C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">after the Big Bang</span><b>{fmtYears(tAfter)}</b></div>
        <div><span className="mono">size vs today</span><b>{scale > 0.1 ? `${Math.round(scale * 100)}%` : `1/${Math.round(1 / scale).toLocaleString()}`}</b></div>
        <div><span className="mono">temperature</span><b>{temp < 100 ? `${temp.toFixed(1)} K` : `${Math.round(temp).toLocaleString()} K`}</b></div>
        <div><span className="mono">glows like</span><b style={{ fontSize: 12 }}>{temp < 500 ? "nothing you could see" : temp < 2000 ? "embers" : temp < 4500 ? "an orange star" : "a blinding white star"}</b></div>
      </div>
      <div className="bh-controls"><Slider label="rewind" min={0} max={1} step={0.002} value={u} onChange={setU} /></div>
    </>
  );
}

// ─────────────────────────── cmb: the afterglow ───────────────────────────
function CMB() {
  const [mode, setMode] = useState(0);
  const mRef = useRef(mode); mRef.current = mode;
  const S = useRef(null);
  const ref = useCanvas((ctx, W, H, t) => {
    const m = mRef.current;
    if (!S.current) {
      const RW = 200, RH = 100, c = document.createElement("canvas"); c.width = RW; c.height = RH;
      const r = seeded(73), modes = Array.from({ length: 70 }, () => { const k = 6 + Math.pow(r(), 1.3) * 60, a = r() * 6.28; return { kx: Math.cos(a) * k, ky: Math.sin(a) * k, ph: r() * 6.28, amp: 1 / Math.sqrt(k) }; });
      const field = new Float32Array(RW * RH);
      for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) field[y * RW + x] = modes.reduce((s, q) => s + q.amp * Math.cos(q.kx * (x / RW) * 2 + q.ky * (y / RH) + q.ph), 0);
      S.current = { c, g: c.getContext("2d"), RW, RH, field, tv: document.createElement("canvas") };
      S.current.tv.width = 160; S.current.tv.height = 110;
    }
    const s = S.current;
    bg(ctx, W, H);
    const sz = fit(W, 55);
    if (m === 0) {
      // static on an old television, drawn at low resolution
      const g = s.tv.getContext("2d"), img = g.createImageData(160, 110), d = img.data;
      for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
      g.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      const tw = W * 0.6, th = H * 0.62, tx = (W - tw) / 2, ty = H * 0.14;
      ctx.fillStyle = "#2a2018"; ctx.fillRect(tx - 18, ty - 18, tw + 36, th + 36);
      ctx.drawImage(s.tv, tx, ty, tw, th);
      ctx.imageSmoothingEnabled = true;
      // a few specks highlighted: the afterglow's share
      for (let i = 0; i < 16; i++) { const x = tx + Math.random() * tw, y = ty + Math.random() * th; glow(ctx, x, y, 8, "rgba(233,210,154,0.95)"); }
      label(ctx, "the gold specks: roughly 1 dot in 100 of old TV static is the Big Bang's afterglow", W / 2, H * 0.92, { size: sz - 1, color: C.gold });
      return;
    }
    // the whole sky, as an oval map
    const contrast = m === 2;
    const img = s.g.createImageData(s.RW, s.RH), d = img.data;
    for (let y = 0; y < s.RH; y++) for (let x = 0; x < s.RW; x++) {
      const i = (y * s.RW + x) * 4, ex = (x / s.RW) * 2 - 1, ey = (y / s.RH) * 2 - 1;
      if (ex * ex + ey * ey > 1) { d[i + 3] = 0; continue; }
      const v = contrast ? Math.max(-1, Math.min(1, s.field[y * s.RW + x] * 0.32)) : 0;
      // blue for cooler, red-orange for warmer
      d[i] = v > 0 ? 230 + 25 * v : 230 + 190 * v; d[i + 1] = v > 0 ? 140 - 60 * v : 140 + 50 * v; d[i + 2] = v > 0 ? 60 - 40 * v : 60 - 160 * v; d[i + 3] = 255;
      if (!contrast) { d[i] = 236; d[i + 1] = 140; d[i + 2] = 70; }
    }
    s.g.putImageData(img, 0, 0);
    const mw = W * 0.86, mh = mw / 2;
    ctx.drawImage(s.c, (W - mw) / 2, H * 0.47 - mh / 2, mw, mh);
    ctx.strokeStyle = "rgba(185,192,255,0.35)"; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.47, mw / 2, mh / 2, 0, 0, Math.PI * 2); ctx.stroke();
    label(ctx, W < 520 ? (contrast ? "hot vs cold: 1 part in 100,000" : "the whole sky: 2.725 K everywhere") : contrast ? "contrast turned up: hot and cold spots differ by about 1 part in 100,000" : "the whole sky in microwaves: 2.725 degrees above absolute zero, almost exactly the same everywhere", W / 2, H * 0.08, { size: sz - 1, color: C.text });
    label(ctx, contrast ? "the seeds from No. 02, frozen into the oldest light there is" : "light set free 380,000 years after the Big Bang", W / 2, H * 0.9, { size: sz - 1, color: C.gold });
    void t;
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        {["old TV static", "the sky in microwaves", "turn up the contrast"].map((s, i) => (
          <button key={i} className={`bh-btn ${mode === i ? "bh-btn-on" : ""}`} onClick={() => setMode(i)}>{s}</button>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────── accelerate: the surprise of 1998 ───────────────────────────
// size of the universe vs time, today = 1. With dark energy (flat, matter 0.31,
// dark energy 0.69) and, for comparison, matter alone with the same expansion
// rate today. H0 = 70 km/s/Mpc = 1/13.97 billion years.
const H0G = 1 / 13.97, OM = 0.31, OL = 0.69;
const aLCDM = (t) => Math.pow(OM / OL, 1 / 3) * Math.pow(Math.sinh(1.5 * Math.sqrt(OL) * H0G * t), 2 / 3);
const T0 = (() => { let lo = 1, hi = 30; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (aLCDM(m) < 1) lo = m; else hi = m; } return (lo + hi) / 2; })(); // ≈ 13.5-13.8
const aMatter = (t) => { const v = 1 + 1.5 * H0G * (t - T0); return v > 0 ? Math.pow(v, 2 / 3) : 0; };
function Accelerate() {
  const [time, setTime] = useState(T0);
  const [dark, setDark] = useState(true);
  const tRef = useRef(time); tRef.current = time;
  const dRef = useRef(dark); dRef.current = dark;
  const ref = useCanvas((ctx, W, H) => {
    bg(ctx, W, H);
    const sz = fit(W, 60), tt = tRef.current, dk = dRef.current;
    const x0 = W * 0.1, x1 = W * 0.62, y0 = H * 0.84, y1 = H * 0.12, tMax = 30, aMax = 3.4;
    const px = (t) => x0 + (t / tMax) * (x1 - x0), py = (a) => y0 - (a / aMax) * (y0 - y1);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    label(ctx, "billions of years →", (x0 + x1) / 2, y0 + 16, { size: sz });
    ctx.save(); ctx.translate(x0 - 14, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); label(ctx, "size of the universe", 0, 0, { size: sz }); ctx.restore();
    ctx.setLineDash([2, 4]); ctx.strokeStyle = "rgba(110,118,184,0.6)"; ctx.beginPath(); ctx.moveTo(px(T0), y0); ctx.lineTo(px(T0), y1); ctx.stroke(); ctx.setLineDash([]);
    label(ctx, "today", px(T0), y1 - 6, { size: sz });
    const curve = (f, color, w) => { ctx.beginPath(); let first = true; for (let t = 0.05; t <= tMax; t += 0.1) { const a = f(t); if (a <= 0) continue; first ? ctx.moveTo(px(t), py(Math.min(aMax, a))) : ctx.lineTo(px(t), py(Math.min(aMax, a))); first = false; } ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke(); };
    curve(aMatter, dk ? "rgba(110,118,184,0.5)" : C.lav, dk ? 1.2 : 2.5);
    curve(aLCDM, dk ? C.gold : "rgba(233,210,154,0.35)", dk ? 2.5 : 1.2);
    const f = dk ? aLCDM : aMatter, a = Math.max(0.02, f(tt));
    if (a > 0.02) { glow(ctx, px(tt), py(Math.min(aMax, a)), 12, "rgba(255,255,255,0.9)"); }
    // a little patch of galaxies at that moment
    const cx = W * 0.82, cy = H * 0.46, R = Math.min(W * 0.16, H * 0.34);
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "#0b0c22"; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) { const x = cx + i * R * 0.28 * a, y = cy + j * R * 0.28 * a; if (Math.hypot(x - cx, y - cy) < R) { glow(ctx, x, y, 5, "rgba(240,232,255,0.8)"); } }
    ctx.restore();
    ctx.strokeStyle = "rgba(185,192,255,0.4)"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    const rate = (f(tt + 0.5) - 2 * f(tt) + f(Math.max(0.05, tt - 0.5)));
    label(ctx, rate > 1e-6 ? "expansion speeding up" : rate < -1e-6 ? "expansion slowing down" : "coasting", cx, cy + R + 16, { size: sz, color: rate > 0 ? C.gold : C.lav });
    if (W >= 520) label(ctx, dk ? "gold: what we see (with dark energy)" : "lavender: gravity alone would slow it down", W / 2, H * 0.95, { size: sz });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <Slider label="time" min={0.3} max={30} step={0.05} value={time} onChange={setTime} show={Math.abs(time - T0) < 0.4 ? "today" : time < T0 ? `${(T0 - time).toFixed(1)} bn years ago` : `${(time - T0).toFixed(1)} bn years from now`} />
        <button className={`bh-btn ${dark ? "bh-btn-on" : ""}`} onClick={() => setDark(!dark)}>{dark ? "dark energy: on" : "dark energy: off"}</button>
      </div>
    </>
  );
}

export const ISSUE_03 = { olbers: Olbers, doppler: Doppler, hubble: Hubble, raisin: Raisin, stretch: Stretch, rewind: Rewind, cmb: CMB, accelerate: Accelerate };
