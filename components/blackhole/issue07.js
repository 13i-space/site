"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, seeded, Slider, kelvinCSS } from "./kit";
import { ping, soundOn } from "../../lib/spaceSound";

// THE BLACK HOLE No. 07 · Other Suns, Other Worlds (Update 5.77).
// Pictures: glare · tug · transit · trappist · habitable · air · census ·
// bluedot. The words are in lib/blackhole/07-other-suns-other-worlds.js.

// ─────────────────────────── glare: a firefly by a searchlight ───────────────────────────
function Glare() {
  const [block, setBlock] = useState(0);
  const bRef = useRef(block); bRef.current = block;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const b = bRef.current, cx = W * 0.45, cy = H * 0.5, sz = fit(W, 55);
    const strength = 1 - b * 0.985;
    // the star's glare, with diffraction spikes
    glow(ctx, cx, cy, Math.min(W, H) * 0.9, "rgba(255,246,225,1)", strength);
    glow(ctx, cx, cy, Math.min(W, H) * 0.35, "rgba(255,255,255,1)", strength);
    ctx.globalAlpha = strength;
    ctx.strokeStyle = "rgba(255,250,235,0.8)"; ctx.lineWidth = 2;
    [0, Math.PI / 2].forEach((a) => { ctx.beginPath(); ctx.moveTo(cx - Math.cos(a) * W, cy - Math.sin(a) * W); ctx.lineTo(cx + Math.cos(a) * W, cy + Math.sin(a) * W); ctx.stroke(); });
    ctx.globalAlpha = 1;
    // the mask in front of the star
    if (b > 0.02) { ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(cx, cy, 6 + b * Math.min(W, H) * 0.09, 0, Math.PI * 2); ctx.fill(); }
    // the planet, always there, but only visible once the glare is gone
    const a = t * 0.25, px = cx + Math.cos(a) * W * 0.24, py = cy + Math.sin(a) * H * 0.12;
    const vis = Math.max(0, (b - 0.6) / 0.4);
    glow(ctx, px, py, 10, "rgba(140,190,255,0.9)", vis); ctx.globalAlpha = vis; ctx.fillStyle = "#9cc4ff"; ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    label(ctx, vis > 0.5 ? (W < 520 ? "there it is: a planet" : "there it is: a planet, billions of times fainter than its star") : "somewhere in this glare is a planet", W / 2, H * 0.92, { size: sz, color: vis > 0.5 ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="block the starlight" min={0} max={1} step={0.005} value={block} onChange={setBlock} /></div>
    </>
  );
}

// ─────────────────────────── tug: the wobble ───────────────────────────
// star speed (m/s) = 28.4 × (planet mass in Jupiters) / sqrt(distance in AU), for a Sun-like star
function Tug() {
  const [mU, setMU] = useState(0.5); // log scale: Earth .. 10 Jupiters
  const [d, setD] = useState(1);
  const mRef = useRef(mU); mRef.current = mU;
  const dRef = useRef(d); dRef.current = d;
  const mj = Math.pow(10, -2.5 + mU * 3.5); // Jupiter masses
  const v = (28.4 * mj) / Math.sqrt(d);
  const like = v < 0.3 ? "a baby crawling" : v < 2 ? "a slow walk" : v < 15 ? "running" : v < 60 ? "a car on the motorway" : "a racing car";
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const mj2 = Math.pow(10, -2.5 + mRef.current * 3.5), dd = dRef.current, sz = fit(W, 60);
    const cx = W * 0.42, cy = H * 0.5, R = Math.min(W * 0.32, H * 0.38) * (0.3 + 0.7 * Math.min(1, dd / 5));
    const a = t * (0.9 / Math.pow(dd, 1.5) + 0.25);
    const shift = Math.min(40, 4 + Math.log10(1 + mj2 * 100) * 12);
    const sx = cx - Math.cos(a) * shift, sy = cy - Math.sin(a) * shift * 0.4;
    ctx.strokeStyle = "rgba(139,149,246,0.25)"; ctx.beginPath(); ctx.ellipse(cx, cy, R, R * 0.4, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.ellipse(cx, cy, shift, shift * 0.4, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    glow(ctx, sx, sy, 50, "rgba(255,236,190,0.7)"); ctx.fillStyle = "#fff3d6"; ctx.beginPath(); ctx.arc(sx, sy, 14, 0, Math.PI * 2); ctx.fill();
    const pr = 2.5 + Math.min(9, Math.cbrt(mj2) * 6);
    ctx.fillStyle = mj2 < 0.05 ? "#6fa3e8" : "#d9b48a"; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R * 0.4, pr, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.fillRect(cx - 1, cy - 1, 2, 2);
    label(ctx, "+ shared centre of gravity", cx + 8, cy + 14, { size: sz - 2, align: "left" });
    // speed toward and away from us, as a needle
    const gx = W * 0.86, gy = H * 0.5, gh = H * 0.32, along = Math.sin(a);
    ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(gx, gy - gh); ctx.lineTo(gx, gy + gh); ctx.stroke();
    ctx.fillStyle = along > 0 ? "#ff8a6a" : "#7fa8ff"; ctx.beginPath(); ctx.arc(gx, gy + along * gh * 0.9, 6, 0, Math.PI * 2); ctx.fill();
    label(ctx, "away", gx, gy + gh + 12, { size: sz - 1 }); label(ctx, "toward", gx, gy - gh - 10, { size: sz - 1 });
    label(ctx, "(the star's wobble is exaggerated; the speed is real)", W * 0.42, H * 0.94, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">planet</span><b>{mj < 0.01 ? `${(mj * 318).toFixed(1)} Earths` : `${mj.toFixed(mj < 1 ? 2 : 1)} Jupiters`}</b></div>
        <div><span className="mono">distance</span><b>{d.toFixed(2)} × Earth's</b></div>
        <div><span className="mono">star wobbles at</span><b>{v < 1 ? `${Math.round(v * 100)} cm/s` : `${v.toFixed(1)} m/s`}</b></div>
        <div><span className="mono">that's</span><b style={{ fontSize: 12 }}>{like}</b></div>
      </div>
      <div className="bh-controls">
        <Slider label="planet mass" min={0} max={1} step={0.005} value={mU} onChange={setMU} />
        <Slider label="distance" min={0.05} max={5} step={0.01} value={d} onChange={setD} />
      </div>
    </>
  );
}

// ─────────────────────────── transit: a shadow crossing ───────────────────────────
const SIZES = [["Earth", 0.0092], ["Neptune", 0.035], ["Jupiter", 0.10]];
function Transit() {
  const [k, setK] = useState(2);
  const kRef = useRef(k); kRef.current = k;
  const S = useRef({ trace: [] });
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const [name, rr] = SIZES[kRef.current], sz = fit(W, 60);
    const cx = W / 2, cy = H * 0.3, R = Math.min(W, H) * 0.2;
    const shown = Math.max(rr, 0.03); // Earth is drawn bigger than life so you can see it
    // the star, darker at its edges
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, "#fff6dc"); g.addColorStop(0.8, "#ffd99a"); g.addColorStop(1, "#d98f4a");
    glow(ctx, cx, cy, R * 1.6, "rgba(255,220,160,0.4)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    const period = 6, p = (t % period) / period, x = cx + (p * 2 - 1) * R * 1.8, y = cy + R * 0.15;
    ctx.fillStyle = "#05060f"; ctx.beginPath(); ctx.arc(x, y, shown * R, 0, Math.PI * 2); ctx.fill();
    // brightness: how much of the star the planet covers
    const dx = Math.abs(x - cx) / R, cover = dx < 1 - shown ? 1 : dx < 1 + shown ? (1 + shown - dx) / (2 * shown) : 0;
    const bright = 1 - rr * rr * cover;
    const tr = S.current.trace; tr.push([p, bright]); if (tr.length > 400) tr.shift();
    const gx0 = W * 0.08, gx1 = W * 0.92, gy0 = H * 0.62, gy1 = H * 0.86;
    const depth = rr * rr, scaleY = (v) => gy0 + ((1 - v) / Math.max(depth * 1.3, 0.0002)) * (gy1 - gy0) * 0.75;
    ctx.strokeStyle = C.grid; ctx.strokeRect(gx0, gy0 - 8, gx1 - gx0, gy1 - gy0 + 16);
    ctx.beginPath(); let started = false;
    tr.forEach(([pp, v]) => { const xx = gx0 + pp * (gx1 - gx0), yy = scaleY(v); if (!started || pp < 0.003) { ctx.moveTo(xx, yy); started = true; } else ctx.lineTo(xx, yy); });
    ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
    label(ctx, "the star's brightness, measured", gx0, gy0 - 18, { size: sz - 1, align: "left" });
    label(ctx, `a ${name}-sized planet dims a Sun-like star by ${(depth * 100).toFixed(depth < 0.001 ? 3 : 2)}%`, W / 2, H * 0.95, { size: sz, color: C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        {SIZES.map(([n], i) => <button key={i} className={`bh-btn ${k === i ? "bh-btn-on" : ""}`} onClick={() => { setK(i); S.current.trace = []; }}>{n}-sized</button>)}
      </div>
    </>
  );
}

// ─────────────────────────── trappist: seven worlds, played ───────────────────────────
const T1 = [
  ["b", 1.51, 0.0115], ["c", 2.42, 0.0158], ["d", 4.05, 0.0223], ["e", 6.10, 0.0293], ["f", 9.21, 0.0385], ["g", 12.35, 0.0469], ["h", 18.77, 0.0619],
];
const NOTES = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66]; // the innermost, fastest planet gets the highest note
function Trappist() {
  const [speed, setSpeed] = useState(0.6);
  const [play, setPlay] = useState(true);
  const sRef = useRef(speed); sRef.current = speed;
  const pRef = useRef(play); pRef.current = play;
  const S = useRef({ days: 0, last: T1.map(() => 0), dips: [] });
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const s = S.current, sz = fit(W, 60);
    s.days += dt * sRef.current * 2.5;
    const cx = W * 0.3, cy = H * 0.42, maxR = Math.min(W * 0.27, H * 0.36);
    glow(ctx, cx, cy, 40, "rgba(255,120,80,0.8)"); ctx.fillStyle = "#ff9a6a"; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
    T1.forEach(([n, P, a], i) => {
      const r = (a / 0.0619) * maxR, ang = (s.days / P) * Math.PI * 2;
      ctx.strokeStyle = "rgba(139,149,246,0.22)"; ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.45, 0, 0, Math.PI * 2); ctx.stroke();
      const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r * 0.45;
      ctx.fillStyle = ["#c8b6a0", "#d9a77a", "#7fb0d9", "#6fc3a8", "#8fb4e8", "#b7c3e6", "#a9a2d6"][i]; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
      // transit when the planet passes in front (bottom of the ellipse, toward us)
      const cyc = Math.floor(s.days / P + 0.25);
      if (cyc > s.last[i]) { s.last[i] = cyc; s.dips.push({ i, at: s.days }); if (pRef.current && soundOn()) ping(NOTES[6 - i], 0.05); }
    });
    // the light curve: each dip in that planet's colour
    const gx0 = W * 0.62, gx1 = W * 0.96, gy = H * 0.42, span = 20;
    ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(gx0, gy); ctx.lineTo(gx1, gy); ctx.stroke();
    s.dips = s.dips.filter((d) => s.days - d.at < span);
    s.dips.forEach((d) => { const x = gx1 - ((s.days - d.at) / span) * (gx1 - gx0); ctx.strokeStyle = ["#c8b6a0", "#d9a77a", "#7fb0d9", "#6fc3a8", "#8fb4e8", "#b7c3e6", "#a9a2d6"][d.i]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + 14 + d.i * 3); ctx.stroke(); ctx.lineWidth = 1; });
    label(ctx, "dips in the star's light", (gx0 + gx1) / 2, gy - 14, { size: sz - 1 });
    label(ctx, `day ${Math.floor(s.days)}`, (gx0 + gx1) / 2, gy + 50, { size: sz, color: C.text });
    label(ctx, W < 520 ? "TRAPPIST-1: 7 planets" : "TRAPPIST-1: seven planets, 40 light-years away · every transit plays a note", W / 2, H * 0.92, { size: sz, color: C.gold });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <Slider label="speed" min={0.1} max={2} step={0.01} value={speed} onChange={setSpeed} />
        <button className={`bh-btn ${play ? "bh-btn-on" : ""}`} onClick={() => setPlay(!play)}>{play ? "notes on" : "notes off"}</button>
      </div>
    </>
  );
}

// ─────────────────────────── habitable: not too hot, not too cold ───────────────────────────
// brightness of a main-sequence star from its surface temperature (rough, in Suns)
const lumOf = (T) => { const pts = [[2600, 0.0005], [3000, 0.003], [3500, 0.025], [4500, 0.2], [5200, 0.55], [5772, 1], [6500, 2.5], [7500, 6]]; for (let i = 1; i < pts.length; i++) if (T <= pts[i][0]) { const [t0, l0] = pts[i - 1], [t1, l1] = pts[i], f = (T - t0) / (t1 - t0); return Math.exp(Math.log(l0) + f * (Math.log(l1) - Math.log(l0))); } return 6; };
function Habitable() {
  const [T, setT] = useState(5772);
  const [du, setDu] = useState(0.5);
  const tRef = useRef(T); tRef.current = T;
  const dRef = useRef(du); dRef.current = du;
  const dAU = Math.pow(10, -2 + du * 3); // 0.01 .. 10 AU
  const L = lumOf(T), inner = Math.sqrt(L / 1.1), outer = Math.sqrt(L / 0.53);
  const state = dAU < inner ? "too hot: oceans boil away" : dAU > outer ? "too cold: water freezes" : "just right: liquid water could last";
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const TT = tRef.current, d = Math.pow(10, -2 + dRef.current * 3), LL = lumOf(TT), ii = Math.sqrt(LL / 1.1), oo = Math.sqrt(LL / 0.53), sz = fit(W, 60);
    const x0 = W * 0.1, x1 = W * 0.95, cy = H * 0.45, xOf = (au) => x0 + ((Math.log10(au) + 2) / 3) * (x1 - x0);
    // the zone
    const zx0 = Math.max(x0, xOf(ii)), zx1 = Math.min(x1, xOf(oo));
    if (zx1 > zx0) { ctx.fillStyle = "rgba(111,195,168,0.18)"; ctx.fillRect(zx0, H * 0.18, zx1 - zx0, H * 0.54); label(ctx, "the habitable zone", (zx0 + zx1) / 2, H * 0.14, { size: sz, color: C.teal }); }
    // the star at the left
    glow(ctx, W * 0.04, cy, 40 + Math.log10(LL * 1000) * 8, kelvinCSS(TT, 0.8)); ctx.fillStyle = kelvinCSS(TT); ctx.beginPath(); ctx.arc(W * 0.04, cy, 10, 0, Math.PI * 2); ctx.fill();
    // a ruler, in Earth-Sun distances
    [0.01, 0.1, 1, 10].forEach((au) => { const x = xOf(au); ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(x, H * 0.74); ctx.lineTo(x, H * 0.78); ctx.stroke(); label(ctx, au === 1 ? "Earth's distance" : `${au}×`, x, H * 0.82, { size: sz - 1 }); });
    // the planet
    const px = xOf(d), hot = d < ii, cold = d > oo, pr = 11;
    const col = hot ? "#e0835a" : cold ? "#e8f2ff" : "#4f8fdc";
    glow(ctx, px, cy, 24, hot ? "rgba(255,140,90,0.5)" : cold ? "rgba(220,235,255,0.4)" : "rgba(80,150,230,0.5)");
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px, cy, pr, 0, Math.PI * 2); ctx.fill();
    if (!hot && !cold) { ctx.fillStyle = "#6fae6a"; ctx.beginPath(); ctx.arc(px - 3, cy - 2, 4, 0, Math.PI * 2); ctx.fill(); }
    if (hot) { for (let k = 0; k < 5; k++) { const yy = cy - pr - 6 - ((t * 20 + k * 7) % 30); ctx.fillStyle = `rgba(255,255,255,${0.3 * (1 - ((t * 20 + k * 7) % 30) / 30)})`; ctx.beginPath(); ctx.arc(px + Math.sin(k * 3 + t) * 5, yy, 3, 0, Math.PI * 2); ctx.fill(); } }
    label(ctx, hot ? "too hot" : cold ? "too cold" : "just right", px, cy + 26, { size: sz, color: hot ? C.rose : cold ? C.lav : C.teal });
  });
  const type = T < 3700 ? "a red dwarf" : T < 5200 ? "an orange dwarf" : T < 6000 ? "a Sun-like star" : "a hotter white star";
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">star</span><b style={{ fontSize: 12 }}>{type}, {T.toLocaleString()} K</b></div>
        <div><span className="mono">brightness</span><b>{L < 0.01 ? L.toFixed(4) : L.toFixed(2)} × the Sun</b></div>
        <div><span className="mono">planet at</span><b>{dAU < 0.1 ? dAU.toFixed(3) : dAU.toFixed(2)} × Earth's distance</b></div>
        <div><span className="mono">verdict</span><b style={{ fontSize: 12 }}>{state}</b></div>
      </div>
      <div className="bh-controls">
        <Slider label="star temperature" min={2600} max={7500} step={10} value={T} onChange={setT} />
        <Slider label="planet distance" min={0} max={1} step={0.002} value={du} onChange={setDu} />
      </div>
    </>
  );
}

// ─────────────────────────── air: starlight through an atmosphere ───────────────────────────
const GASES = {
  water: { col: "#7fb0ff", bands: [[1.4, 0.12], [1.9, 0.14], [2.7, 0.18]] },
  "carbon dioxide": { col: "#E9D29A", bands: [[2.0, 0.06], [2.7, 0.1], [4.3, 0.3]] },
  methane: { col: "#6FC3A8", bands: [[1.7, 0.06], [2.3, 0.1], [3.3, 0.22]] },
  sodium: { col: "#ffb36b", bands: [[0.59, 0.12]] },
};
function Air() {
  const [on, setOn] = useState(["carbon dioxide", "water"]);
  const oRef = useRef(on); oRef.current = on;
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.2);
    const sz = fit(W, 60), ons = oRef.current;
    // the planet in front of its star, a thin glowing rim of air
    const cx = W * 0.2, cy = H * 0.42, R = Math.min(W, H) * 0.2;
    glow(ctx, cx, cy, R * 1.9, "rgba(255,226,170,0.55)");
    ctx.fillStyle = "#ffe2a8"; ctx.beginPath(); ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#05060f"; ctx.beginPath(); ctx.arc(cx, cy, R * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(185,192,255,${0.4 + 0.2 * Math.sin(t * 2)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, R * 0.55 + 3, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1;
    label(ctx, W < 520 ? "through the air" : "starlight shining through the planet's air", cx, cy + R * 1.3 + 16, { size: sz - 1 });
    // the transmission spectrum: how big the planet looks, colour by colour
    const x0 = W * 0.46, x1 = W * 0.96, y0 = H * 0.78, y1 = H * 0.18, lo = 0.5, hi = 5;
    const px = (um) => x0 + ((um - lo) / (hi - lo)) * (x1 - x0);
    ctx.strokeStyle = C.grid; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const um = lo + ((hi - lo) * i) / 300;
      let v = 0.15;
      ons.forEach((g) => GASES[g].bands.forEach(([c, a]) => { v += a * Math.exp(-Math.pow((um - c) / (c * 0.05), 2)); }));
      const y = y0 - v * (y0 - y1) * 1.9;
      i ? ctx.lineTo(px(um), y) : ctx.moveTo(px(um), y);
    }
    ctx.strokeStyle = C.text; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1;
    ons.forEach((g) => GASES[g].bands.forEach(([c, a]) => { if (a > 0.09) label(ctx, g, px(c), y0 - (0.15 + a) * (y0 - y1) * 1.9 - 12, { size: sz - 2, color: GASES[g].col }); }));
    [1, 2, 3, 4, 5].forEach((um) => label(ctx, `${um}`, px(um), y0 + 12, { size: sz - 2 }));
    label(ctx, "colour of light (microns, infrared) →", (x0 + x1) / 2, y0 + 26, { size: sz - 1 });
    ctx.save(); ctx.translate(x0 - 12, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); label(ctx, "air blocks more light ↑", 0, 0, { size: sz - 1 }); ctx.restore();
  });
  const toggle = (g) => setOn(on.includes(g) ? on.filter((x) => x !== g) : [...on, g]);
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        {Object.keys(GASES).map((g) => <button key={g} className={`bh-btn ${on.includes(g) ? "bh-btn-on" : ""}`} onClick={() => toggle(g)}>{g}</button>)}
      </div>
    </>
  );
}

// ─────────────────────────── census: how many are there? ───────────────────────────
function Census() {
  const [z, setZ] = useState(0);
  const zRef = useRef(z); zRef.current = z;
  const S = useRef(null);
  if (!S.current) { const r = seeded(77); S.current = Array.from({ length: 2500 }, () => { const a = r() * 6.28, d = Math.sqrt(r()); return { a, d, p: r() < 0.9, arm: r() }; }); }
  const radius = Math.pow(10, 1 + z * 4); // light-years shown, 10 .. 100,000
  // a sphere of neighbours close by; beyond ~500 ly the galaxy is a thin disc (~1,000 ly thick)
  const stars = Math.min(2e11, radius < 500 ? Math.round(0.004 * (4 / 3) * Math.PI * Math.pow(radius, 3)) : Math.round(0.004 * Math.PI * radius * radius * 1000));
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H);
    const zz = zRef.current, sz = fit(W, 55), cx = W / 2, cy = H * 0.48, R = Math.min(W, H) * 0.44;
    const gal = Math.max(0, (zz - 0.7) / 0.3);
    S.current.forEach((s, i) => {
      // close in: a scatter of neighbours · far out: the spiral of the galaxy
      const spiralA = s.a * 0.15 + s.d * 5 + (i % 2) * Math.PI, sp = s.d;
      const x = cx + (Math.cos(s.a) * s.d * (1 - gal) + Math.cos(spiralA) * sp * gal) * R, y = cy + (Math.sin(s.a) * s.d * (1 - gal) + Math.sin(spiralA) * sp * gal * 0.6) * R;
      const shown = i < 20 + zz * 2480;
      if (!shown) return;
      ctx.fillStyle = s.p ? "rgba(233,210,154,0.85)" : "rgba(220,223,255,0.7)";
      ctx.fillRect(x, y, 1.6, 1.6);
      if (zz < 0.2 && s.p) { ctx.strokeStyle = "rgba(233,210,154,0.4)"; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.stroke(); }
    });
    glow(ctx, cx, cy, 10, "rgba(111,195,168,0.9)"); label(ctx, "the Sun", cx, cy + 14, { size: sz - 1, color: C.teal });
    if (gal > 0.5) glow(ctx, cx, cy, R * 0.25, "rgba(255,230,190,0.25)");
    label(ctx, W < 520 ? "gold: stars with planets" : "gold: stars with planets · on average, at least one planet for every star", W / 2, H * 0.94, { size: sz, color: C.gold });
    void t;
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">view</span><b>{radius < 1000 ? `${Math.round(radius)} light-years` : `${Math.round(radius / 1000).toLocaleString()},000 light-years`}</b></div>
        <div><span className="mono">stars in view</span><b>{stars >= 1.5e11 ? "100s of billions" : stars > 1e9 ? `${Math.round(stars / 1e9)} billion` : stars > 1e6 ? `${Math.round(stars / 1e6)} million` : stars.toLocaleString()}</b></div>
        <div><span className="mono">planets, likely</span><b>{stars >= 1.5e11 ? "100s of billions" : stars > 1e9 ? `${Math.round(stars / 1e9)} billion+` : stars > 1e6 ? `${Math.round(stars / 1e6)} million+` : `${stars.toLocaleString()}+`}</b></div>
        <div><span className="mono">confirmed so far</span><b>6,000+</b></div>
      </div>
      <div className="bh-controls"><Slider label="zoom out" min={0} max={1} step={0.002} value={z} onChange={setZ} /></div>
    </>
  );
}

// ─────────────────────────── bluedot: find us ───────────────────────────
function BlueDot() {
  const look = useRef({ x: 0.3, y: 0.4, on: false });
  const [found, setFound] = useState(false);
  const fRef = useRef(found); fRef.current = found;
  const DOT = [0.66, 0.58];
  const ref = useCanvas((ctx, W, H, t) => {
    // a dark frame crossed by bands of scattered sunlight
    ctx.fillStyle = "#020208"; ctx.fillRect(0, 0, W, H);
    const bands = [[0.22, "rgba(190,120,80,0.25)"], [0.45, "rgba(210,150,110,0.32)"], [0.66, "rgba(150,170,210,0.28)"], [0.86, "rgba(200,130,90,0.22)"]];
    bands.forEach(([x, c]) => { const g = ctx.createLinearGradient(x * W - W * 0.06, 0, x * W + W * 0.06, 0); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.5, c); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.save(); ctx.translate(W * x, H / 2); ctx.rotate(-0.12); ctx.fillStyle = g; ctx.fillRect(-W * 0.06 - W * x, -H, W * 1.2, H * 2.2); ctx.restore(); });
    const r = seeded(5); for (let i = 0; i < 400; i++) { ctx.fillStyle = `rgba(255,255,255,${r() * 0.15})`; ctx.fillRect(r() * W, r() * H, 1, 1); }
    // Earth: barely a pixel
    ctx.fillStyle = "rgba(170,200,255,0.9)"; ctx.fillRect(DOT[0] * W, DOT[1] * H, 1.2, 1.2);
    // the magnifier
    const L = look.current, mx = L.x * W, my = L.y * H, mr = Math.min(W, H) * 0.12;
    ctx.save(); ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "rgba(2,2,8,0.6)"; ctx.fillRect(mx - mr, my - mr, mr * 2, mr * 2);
    const ex = mx + (DOT[0] * W - mx) * 4, ey = my + (DOT[1] * H - my) * 4;
    if (Math.hypot(ex - mx, ey - my) < mr) { glow(ctx, ex, ey, 12, "rgba(150,190,255,0.9)"); ctx.fillStyle = "#b9d4ff"; ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = "rgba(233,210,154,0.8)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.stroke();
    const near = Math.hypot(DOT[0] * W - mx, DOT[1] * H - my) < mr * 0.25;
    if (near && !fRef.current) { setFound(true); if (soundOn()) { ping(660, 0.06); setTimeout(() => ping(990, 0.05), 140); } }
    const sz = fit(W, 55);
    ctx.fillStyle = "rgba(5,6,15,0.7)"; ctx.fillRect(0, H * 0.88, W, H * 0.12);
    label(ctx, W < 520 ? (fRef.current ? "that's us" : "drag the lens to find Earth") : fRef.current ? "that's us: everyone you've ever known, on less than a pixel" : "Voyager 1, 14 February 1990, 6 billion km out · drag the lens to find Earth", W / 2, H * 0.94, { size: sz, color: fRef.current ? C.gold : C.text });
    void t;
  });
  const move = (e) => { if (!look.current.on && e.type !== "pointerdown") return; const r = e.currentTarget.getBoundingClientRect(); look.current.x = (e.clientX - r.left) / r.width; look.current.y = (e.clientY - r.top) / r.height; };
  return <canvas ref={ref} className="bh-canvas" style={{ cursor: "crosshair", touchAction: "none" }} onPointerDown={(e) => { look.current.on = true; e.currentTarget.setPointerCapture(e.pointerId); move(e); }} onPointerMove={move} onPointerUp={() => { look.current.on = false; }} />;
}

export const ISSUE_07 = { glare: Glare, tug: Tug, transit: Transit, trappist: Trappist, habitable: Habitable, air: Air, census: Census, bluedot: BlueDot };
