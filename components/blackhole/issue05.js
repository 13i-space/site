"use client";

import { useRef, useState } from "react";
import { C, useCanvas, glow, label, fit, starfield, bg, seeded, Slider, kelvinCSS } from "./kit";
import { ping, soundOn } from "../../lib/spaceSound";

// THE BLACK HOLE No. 05 · Star Stuff (Update 5.77).
// Pictures: body · firstminutes · collapse · fusion · onion · supernova ·
// kilonova · recycle. The words are in lib/blackhole/05-star-stuff.js.

// where each element in a body mostly came from (after Jennifer Johnson's
// periodic table of origins, 2019); share of body mass for an adult
const ORIGINS = {
  bang: { name: "the Big Bang", color: "#B9C0FF" },
  small: { name: "dying Sun-like stars", color: "#6FC3A8" },
  big: { name: "exploding massive stars", color: "#E9D29A" },
  dwarf: { name: "exploding white dwarfs", color: "#C97B6E" },
  merge: { name: "colliding neutron stars", color: "#FF9BD2" },
};
const BODY = [
  ["O", "oxygen", 65, "big"], ["C", "carbon", 18.5, "small"], ["H", "hydrogen", 9.5, "bang"], ["N", "nitrogen", 3.2, "small"],
  ["Ca", "calcium", 1.5, "big"], ["P", "phosphorus", 1, "big"], ["K", "potassium", 0.4, "big"], ["S", "sulfur", 0.3, "big"],
  ["Na", "sodium", 0.2, "big"], ["Cl", "chlorine", 0.2, "big"], ["Mg", "magnesium", 0.1, "big"], ["Fe", "iron", 0.006, "dwarf"],
  ["I", "iodine", 0.00002, "merge"], ["Au", "gold", 0.0000003, "merge"],
];
const pct = (v) => (v >= 1 ? `${v}%` : v >= 0.01 ? `${v}%` : v >= 0.00001 ? "a trace" : "a speck");

// ─────────────────────────── body: what you're made of ───────────────────────────
function Body() {
  const [show, setShow] = useState(false);
  const [pick, setPick] = useState(0);
  const sRef = useRef(show); sRef.current = show;
  const pRef = useRef(pick); pRef.current = pick;
  const rects = useRef([]);
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.15);
    const sh = sRef.current, sz = fit(W, 60);
    const cols = 7, gx = W * 0.04, gw = W * 0.92, tw = gw / cols, th = Math.min(H * 0.22, tw * 0.95), gy = H * 0.1;
    rects.current = [];
    BODY.forEach(([sym, name, p, o], i) => {
      const x = gx + (i % cols) * tw, y = gy + Math.floor(i / cols) * (th + 8), on = i === pRef.current;
      const col = sh ? ORIGINS[o].color : "#8B95F6";
      ctx.fillStyle = on ? "rgba(233,210,154,0.16)" : "rgba(20,22,58,0.8)"; ctx.fillRect(x + 3, y, tw - 6, th);
      ctx.strokeStyle = on ? C.gold : sh ? col : "rgba(58,62,117,0.9)"; ctx.lineWidth = on ? 2 : 1; ctx.strokeRect(x + 3, y, tw - 6, th);
      if (sh) glow(ctx, x + tw / 2, y + th * 0.42, tw * 0.45, `${col}55`);
      label(ctx, sym, x + tw / 2, y + th * 0.4, { size: Math.min(26, tw * 0.32), color: sh ? col : C.text, font: "Fraunces" });
      label(ctx, pct(p), x + tw / 2, y + th * 0.78, { size: sz - 1 });
      rects.current.push([x, y, tw, th, i]);
    });
    // one bar: the body by mass
    const by = gy + 2 * (th + 8) + 16, bh = H * 0.07;
    let x = gx;
    BODY.forEach(([, , p, o]) => { const w = (p / 100) * gw; ctx.fillStyle = sh ? ORIGINS[o].color : "#8B95F6"; ctx.globalAlpha = sh ? 0.85 : 0.35 + (p / 100); ctx.fillRect(x, by, Math.max(0.5, w), bh); x += w; });
    ctx.globalAlpha = 1;
    const [sym, name, p, o] = BODY[pRef.current];
    label(ctx, `${name}: ${pct(p)} of you by weight`, W / 2, by + bh + 20, { size: sz + 1, color: C.text });
    label(ctx, sh ? `made mostly in ${ORIGINS[o].name}` : "tap an element · then reveal where each was made", W / 2, by + bh + 40, { size: sz, color: sh ? ORIGINS[o].color : C.dim });
    if (sh && W >= 520) {
      const keys = Object.keys(ORIGINS), lw = gw / 3;
      keys.forEach((k, i) => { const x = gx + (i % 3) * lw, y = H * (i < 3 ? 0.86 : 0.93); ctx.fillStyle = ORIGINS[k].color; ctx.fillRect(x + 4, y - 4, 8, 8); label(ctx, ORIGINS[k].name, x + 16, y, { size: sz - 1, align: "left" }); });
    }
    void sym;
  });
  const tap = (e) => {
    const r = e.currentTarget.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const hit = rects.current.find(([rx, ry, w, h]) => x >= rx && x <= rx + w && y >= ry && y <= ry + h);
    if (hit) { setPick(hit[4]); if (soundOn()) ping(330 + hit[4] * 40, 0.04); }
  };
  return (
    <>
      <canvas ref={ref} className="bh-canvas" onPointerDown={tap} />
      <div className="bh-controls">
        <button className={`bh-btn ${show ? "bh-btn-on" : ""}`} onClick={() => setShow(!show)}>{show ? "hide the origins" : "show where each was made"}</button>
      </div>
    </>
  );
}

// ─────────────────────────── firstminutes: the first twenty minutes ───────────────────────────
function FirstMinutes() {
  const [u, setU] = useState(0);
  const uRef = useRef(u); uRef.current = u;
  const tSec = 0.1 * Math.pow(12000, u); // 0.1 s .. 20 minutes
  const S = useRef(null);
  if (!S.current) {
    const r = seeded(9);
    // 96 particles: by the end, 12 neutrons and 84 protons; the 12 neutrons
    // and 12 of the protons end up as 6 helium nuclei
    S.current = Array.from({ length: 96 }, (_, i) => ({ x: r(), y: r(), vx: r() - 0.5, vy: r() - 0.5, finalN: i < 12, earlyN: i < 48, he: i < 24 ? Math.floor((i % 12) / 2) : -1, slot: i < 12 ? i % 2 : 2 + (i % 2), th: 0.05 + r() * 0.9 }));
  }
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    const ts = 0.1 * Math.pow(12000, uRef.current);
    const bind = Math.max(0, Math.min(1, (ts - 150) / 120)); // helium forms around 3 minutes
    const decay = Math.max(0, Math.min(1, Math.log10(ts / 0.5) / Math.log10(180 / 0.5)));
    const bx = W * 0.05, by = H * 0.1, bw = W * 0.6, bh = H * 0.78;
    ctx.strokeStyle = "rgba(58,62,117,0.8)"; ctx.strokeRect(bx, by, bw, bh);
    const heat = Math.max(0, 1 - Math.log10(ts / 0.1) / 4);
    glow(ctx, bx + bw / 2, by + bh / 2, bw * 0.7, `rgba(255,200,140,${0.25 * heat})`);
    const centres = Array.from({ length: 6 }, (_, k) => [0.18 + (k % 3) * 0.32, 0.3 + Math.floor(k / 3) * 0.42]);
    S.current.forEach((p) => {
      p.x += p.vx * dt * 0.25 * (0.3 + heat); p.y += p.vy * dt * 0.25 * (0.3 + heat);
      if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1;
      p.x = Math.max(0, Math.min(1, p.x)); p.y = Math.max(0, Math.min(1, p.y));
      let x = p.x, y = p.y;
      if (p.he >= 0 && bind > 0) {
        const [cx, cy] = centres[p.he], o = [[-1, -1], [1, 1], [1, -1], [-1, 1]][p.slot];
        x = p.x + (cx + o[0] * 0.018 - p.x) * bind; y = p.y + (cy + o[1] * 0.024 - p.y) * bind;
      }
      const isN = p.finalN || (p.earlyN && decay < p.th);
      const px = bx + x * bw, py = by + y * bh;
      ctx.fillStyle = isN ? C.lav : C.rose; ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
    });
    if (bind > 0.5) centres.forEach(([cx, cy]) => glow(ctx, bx + cx * bw, by + cy * bh, 20, "rgba(233,210,154,0.6)", bind));
    // the score
    const sz = fit(W, 60), rx = W * 0.7;
    const T = 1e10 / Math.sqrt(Math.max(ts, 0.1));
    label(ctx, W < 520 ? "rose: protons" : "rose: protons (hydrogen)", rx, H * 0.16, { size: sz, align: "left", color: C.rose });
    label(ctx, "lavender: neutrons", rx, H * 0.24, { size: sz, align: "left", color: C.lav });
    label(ctx, "gold: helium", rx, H * 0.32, { size: sz, align: "left", color: C.gold });
    label(ctx, `${W < 520 ? "" : "temperature "}≈ ${T >= 1e9 ? (T / 1e9).toFixed(1) + (W < 520 ? "bn" : " billion") : Math.round(T / 1e6) + (W < 520 ? "M" : " million")} K`, rx, H * 0.46, { size: sz, align: "left", color: C.text });
    const hePct = Math.round(25 * bind);
    ctx.fillStyle = "rgba(20,22,58,0.9)"; ctx.fillRect(rx, H * 0.56, W * 0.26, 14);
    ctx.fillStyle = C.gold; ctx.fillRect(rx, H * 0.56, W * 0.26 * (hePct / 100), 14);
    ctx.fillStyle = C.rose; ctx.fillRect(rx + W * 0.26 * (hePct / 100), H * 0.56, W * 0.26 * (1 - hePct / 100), 14);
    label(ctx, W < 520 ? `${100 - hePct}% H · ${hePct}% He` : `by weight: ${100 - hePct}% hydrogen · ${hePct}% helium`, rx, H * 0.56 + 28, { size: sz - 1, align: "left" });
    label(ctx, W < 520 ? (ts < 150 ? "too hot to stick" : bind < 1 ? "helium forming" : "done") : ts < 150 ? "too hot: anything that forms is smashed apart" : bind < 1 ? "cool enough: neutrons lock into helium" : "done: and almost no more until the first stars", rx, H * 0.78, { size: sz - 1, align: "left", color: C.gold });
  });
  const fmt = tSec < 60 ? `${tSec < 1 ? tSec.toFixed(1) : Math.round(tSec)} seconds` : `${(tSec / 60).toFixed(tSec < 600 ? 1 : 0)} minutes`;
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><Slider label="after the Big Bang" min={0} max={1} step={0.002} value={u} onChange={setU} show={fmt} /></div>
    </>
  );
}

// ─────────────────────────── collapse: a star is born ───────────────────────────
function Collapse() {
  const [k, setK] = useState(0.1);
  const kRef = useRef(k); kRef.current = k;
  const S = useRef(null);
  if (!S.current) { const r = seeded(21); S.current = Array.from({ length: 600 }, () => { const a = r() * 6.28, d = Math.sqrt(r()); return { a, d, z: (r() - 0.5) * 2, w: 0.2 + r() }; }); }
  const temp = (kk) => 10 * Math.pow(1.5e6, Math.pow(kk, 2.2)); // 10 K .. 15 million K
  const T = temp(k);
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.3);
    const kk = kRef.current, cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.44 * (1 - 0.93 * kk);
    const flat = 1 - 0.75 * Math.max(0, kk - 0.4) / 0.6;
    const lit = kk > 0.93;
    S.current.forEach((p) => {
      p.a += dt * p.w * (0.05 + kk * kk * 3) / Math.max(0.3, p.d);
      const x = cx + Math.cos(p.a) * p.d * R * (1 + (1 - kk) * 0.3), y = cy + Math.sin(p.a) * p.d * R * 0.45 + p.z * R * 0.45 * flat;
      const hot = Math.min(1, kk * (1.2 - p.d));
      ctx.fillStyle = `rgba(${150 + 105 * hot},${140 + 60 * hot},${200 - 120 * hot},${0.35 + 0.4 * hot})`;
      ctx.fillRect(x, y, 1.6, 1.6);
    });
    const coreT = temp(kk);
    if (coreT > 2000) glow(ctx, cx, cy, R * 0.5 + 10, kelvinCSS(Math.min(coreT, 8000), 0.7), Math.min(1, Math.log10(coreT / 2000) / 3));
    if (lit) { const f = (kk - 0.93) / 0.07; glow(ctx, cx, cy, Math.min(W, H) * 0.35, "rgba(255,244,214,0.9)", f); ctx.fillStyle = "#fff6e0"; ctx.beginPath(); ctx.arc(cx, cy, 8 + 10 * f, 0, Math.PI * 2); ctx.fill(); }
    label(ctx, lit ? (W < 520 ? "10 million degrees: fusion · a star" : "the centre reaches about 10 million degrees: fusion switches on · a star") : kk < 0.3 ? "a cold, dark cloud of gas and dust" : W < 520 ? "squeezed, heating, spinning" : "gravity pulls it in · squeezed gas heats up · it starts to spin and flatten", W / 2, H * 0.93, { size: fit(W, 55), color: lit ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">centre</span><b>{T < 1000 ? `${Math.round(T)} K` : T < 1e6 ? `${Math.round(T / 1000).toLocaleString()} thousand K` : `${(T / 1e6).toFixed(1)} million K`}</b></div>
        <div><span className="mono">time</span><b>{k < 0.95 ? `${(k * 10).toFixed(1)} million years` : "about 10 million years"}</b></div>
        <div><span className="mono">size</span><b>{k < 0.5 ? "light-years across" : k < 0.9 ? "solar-system sized" : "a star"}</b></div>
        <div><span className="mono">status</span><b style={{ color: k > 0.93 ? C.gold : C.text }}>{k > 0.93 ? "shining" : "collapsing"}</b></div>
      </div>
      <div className="bh-controls"><Slider label="let gravity work" min={0} max={1} step={0.002} value={k} onChange={setK} /></div>
    </>
  );
}

// ─────────────────────────── fusion: four become one ───────────────────────────
function Fusion() {
  const [temp, setTemp] = useState(15);
  const tRef = useRef(temp); tRef.current = temp;
  const S = useRef(null);
  const [made, setMade] = useState(0);
  if (!S.current) { const r = seeded(33); S.current = { p: Array.from({ length: 40 }, () => ({ x: r(), y: r(), a: r() * 6.28 })), flashes: [], acc: 0 }; }
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H);
    const s = S.current, T = tRef.current, sz = fit(W, 60);
    const bx = W * 0.04, by = H * 0.1, bw = W * 0.52, bh = H * 0.74;
    glow(ctx, bx + bw / 2, by + bh / 2, bw * 0.7, kelvinCSS(2500 + T * 300, 0.3));
    ctx.strokeStyle = "rgba(58,62,117,0.8)"; ctx.strokeRect(bx, by, bw, bh);
    const speed = 0.08 + T * 0.02;
    s.p.forEach((p) => {
      p.a += (Math.random() - 0.5) * 2 * dt * (1 + T / 5);
      p.x += Math.cos(p.a) * speed * dt; p.y += Math.sin(p.a) * speed * dt;
      if (p.x < 0 || p.x > 1) { p.a = Math.PI - p.a; p.x = Math.max(0, Math.min(1, p.x)); }
      if (p.y < 0 || p.y > 1) { p.a = -p.a; p.y = Math.max(0, Math.min(1, p.y)); }
      ctx.fillStyle = C.rose; ctx.beginPath(); ctx.arc(bx + p.x * bw, by + p.y * bh, 3.5, 0, Math.PI * 2); ctx.fill();
    });
    // the fusion rate climbs steeply with temperature (about T^4 for the Sun's reactions)
    const rate = T < 4 ? 0 : 0.6 * Math.pow(T / 15, 4);
    s.acc += rate * dt;
    while (s.acc > 1) { s.acc -= 1; s.flashes.push({ x: Math.random(), y: Math.random(), age: 0 }); setMade((m) => m + 1); if (soundOn() && s.flashes.length < 6) ping(880 + Math.random() * 300, 0.025); }
    s.flashes.forEach((f) => { f.age += dt; glow(ctx, bx + f.x * bw, by + f.y * bh, 26 * (1 + f.age), "rgba(255,250,220,0.95)", 1 - f.age / 0.7); });
    s.flashes = s.flashes.filter((f) => f.age < 0.7);
    label(ctx, W < 520 ? (T < 4 ? "too cold to fuse" : T < 10 ? "now and then: fusion" : "the Sun's core") : T < 4 ? "too cold: protons push each other away" : T < 10 ? "now and then, two get close enough to fuse" : "the Sun's core: fusion, steadily", bx + bw / 2, H * 0.92, { size: sz, color: T >= 10 ? C.gold : C.text });
    // the weighing: four hydrogen against one helium
    const sx = W * 0.6, sw = W * 0.36, beamY = H * 0.5, tilt = 0.08;
    ctx.strokeStyle = C.lav; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sx + sw / 2, beamY); ctx.lineTo(sx + sw / 2, H * 0.78); ctx.stroke();
    const lx = sx + sw * 0.1, rx2 = sx + sw * 0.9, ly = beamY + Math.sin(tilt) * sw * 0.4, ry = beamY - Math.sin(tilt) * sw * 0.4;
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx2, ry); ctx.stroke();
    for (let i = 0; i < 4; i++) { ctx.fillStyle = C.rose; ctx.beginPath(); ctx.arc(lx - 12 + (i % 2) * 14, ly - 10 - Math.floor(i / 2) * 13, 6, 0, Math.PI * 2); ctx.fill(); }
    glow(ctx, rx2, ry - 14, 20, "rgba(233,210,154,0.7)"); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(rx2, ry - 14, 9, 0, Math.PI * 2); ctx.fill();
    label(ctx, "4 hydrogen", lx, ly + 18, { size: sz - 1, color: C.text });
    label(ctx, "1 helium", rx2, ry + 18, { size: sz - 1, color: C.text });
    label(ctx, W < 520 ? "helium: 0.7% lighter" : "the helium is 0.7% lighter", sx + sw / 2, H * 0.2, { size: sz, color: C.gold });
    label(ctx, W < 520 ? "E = mc²" : "the missing mass leaves as light: E = mc²", sx + sw / 2, H * 0.28, { size: sz - 1 });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <Slider label="core temperature" min={1} max={20} step={0.1} value={temp} onChange={setTemp} show={`${temp.toFixed(0)} million K`} />
        <span className="mono bh-slider-val" style={{ fontSize: 11 }}>fusions: {made}</span>
      </div>
    </>
  );
}

// ─────────────────────────── onion: a heavy star's layers ───────────────────────────
const SHELLS = [["hydrogen", "#C97B6E"], ["helium", "#E9D29A"], ["carbon", "#8a8f9e"], ["neon", "#FF9BD2"], ["oxygen", "#6FC3A8"], ["silicon", "#8B95F6"], ["iron", "#d8d8e0"]];
function Onion() {
  const [m, setM] = useState(1);
  const mRef = useRef(m); mRef.current = m;
  const layers = m < 0.5 ? 1 : m < 8 ? 3 : 7; // up to helium burning ends at carbon/oxygen below 8 suns
  const life = 10 * Math.pow(m, -2.5); // billions of years, roughly
  const fate = m < 0.5 ? "a red dwarf: it will burn for longer than the universe has existed" : m < 8 ? "puffs off its outer layers; leaves a white dwarf" : m < 25 ? "explodes as a supernova; leaves a neutron star" : "explodes or collapses; leaves a black hole";
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const mm = mRef.current, L = mm < 0.5 ? 1 : mm < 8 ? 3 : 7, sz = fit(W, 60);
    const cx = W * 0.38, cy = H * 0.5, R = Math.min(W * 0.32, H * 0.42) * (0.55 + 0.45 * Math.min(1, Math.log10(mm * 2) / 1.7));
    glow(ctx, cx, cy, R * 1.5, mm < 0.5 ? "rgba(255,140,90,0.4)" : mm < 8 ? "rgba(255,230,180,0.4)" : "rgba(200,220,255,0.45)");
    for (let i = 0; i < L; i++) {
      const r = R * (1 - i / (L + 0.4));
      ctx.fillStyle = SHELLS[i][1]; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1; ctx.strokeStyle = "rgba(5,6,15,0.6)"; ctx.stroke();
      const ly = cy - r + (R / (L + 0.4)) * 0.5;
      label(ctx, SHELLS[i][0], W * 0.72, H * 0.12 + i * H * 0.1, { size: sz + 1, align: "left", color: SHELLS[i][1] });
      ctx.strokeStyle = "rgba(220,223,255,0.25)"; ctx.beginPath(); ctx.moveTo(cx, ly); ctx.lineTo(W * 0.7, H * 0.12 + i * H * 0.1); ctx.stroke();
    }
    if (L === 7) label(ctx, "iron: the end of the line", W * 0.72, H * 0.12 + 7 * H * 0.1, { size: sz - 1, align: "left", color: C.gold });
    if (L === 3) label(ctx, "(carbon and oxygen: the end for this star)", W * 0.72, H * 0.12 + 3 * H * 0.1, { size: sz - 1, align: "left" });
    void t;
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-readout">
        <div><span className="mono">mass</span><b>{m.toFixed(1)} Suns</b></div>
        <div><span className="mono">layers burning</span><b>{layers === 1 ? "just hydrogen" : layers === 3 ? "up to carbon" : "up to iron"}</b></div>
        <div><span className="mono">lifetime</span><b>{life >= 1 ? `~${life.toFixed(life < 10 ? 1 : 0)} billion years` : `~${Math.round(life * 1000)} million years`}</b></div>
        <div><span className="mono">ending</span><b style={{ fontSize: 12 }}>{fate}</b></div>
      </div>
      <div className="bh-controls"><Slider label="star's mass" min={0.3} max={30} step={0.1} value={m} onChange={setM} /></div>
    </>
  );
}

// ─────────────────────────── supernova ───────────────────────────
function Supernova() {
  const S = useRef({ phase: 0, t0: 0, bits: [] });
  const [run, setRun] = useState(0);
  const go = () => { S.current = { phase: 1, t0: -1, bits: [] }; setRun((x) => x + 1); };
  const ref = useCanvas((ctx, W, H, t, dt) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.35);
    const s = S.current, cx = W / 2, cy = H * 0.47, R = Math.min(W, H) * 0.3, sz = fit(W, 55);
    if (s.t0 < 0) s.t0 = t;
    const e = s.phase ? t - s.t0 : 0;
    let msg = "a massive star, its core turning to iron";
    if (!s.phase || e < 2.5) {
      // the onion, with a growing iron heart
      const iron = s.phase ? Math.min(1, e / 2.5) : 0.25;
      SHELLS.forEach(([, col], i) => { ctx.fillStyle = col; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(cx, cy, R * (1 - i / 7.4), 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#f0f0f6"; ctx.beginPath(); ctx.arc(cx, cy, R * (0.06 + 0.1 * iron), 0, Math.PI * 2); ctx.fill();
      if (s.phase) msg = "the iron core grows · fusing iron gives no energy back";
    } else if (e < 3.1) {
      // collapse
      const f = (e - 2.5) / 0.6;
      SHELLS.forEach(([, col], i) => { ctx.fillStyle = col; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(cx, cy, R * (1 - i / 7.4) * (1 - 0.1 * f), 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx, cy, R * 0.16 * (1 - f * 0.9), 0, Math.PI * 2); ctx.fill();
      msg = "the core collapses in less than a second";
    } else {
      if (!s.bits.length) {
        for (let i = 0; i < 700; i++) { const a = Math.random() * 6.28, sp = 0.4 + Math.random(), sh = Math.floor(Math.random() * 7); s.bits.push({ a, sp, col: SHELLS[sh][1] }); }
        if (soundOn()) { ping(110, 0.12); setTimeout(() => ping(73, 0.1), 90); }
      }
      const f = e - 3.1;
      glow(ctx, cx, cy, R * (1.4 + f * 0.6), "rgba(255,250,235,0.95)", Math.max(0, 1 - f / 1.8));
      s.bits.forEach((b) => { const d = R * (0.2 + b.sp * f * 0.7); ctx.fillStyle = b.col; ctx.globalAlpha = Math.max(0, 1 - f / 9); ctx.fillRect(cx + Math.cos(b.a) * d, cy + Math.sin(b.a) * d, 2, 2); });
      ctx.globalAlpha = 1;
      if (f > 0.3) { glow(ctx, cx, cy, 14, "rgba(185,192,255,0.9)"); ctx.fillStyle = "#dfe3ff"; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill(); }
      msg = W < 520 ? (f < 2 ? "a supernova" : "elements flung out · a neutron star left") : f < 2 ? "it rebounds: a supernova, brighter than a whole galaxy" : "every element it made, flung into space · a neutron star left behind";
    }
    label(ctx, msg, W / 2, H * 0.93, { size: sz, color: s.phase && e > 3.1 ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><button className="bh-btn bh-btn-on" onClick={go}>{run ? "again" : "let the core fill with iron"}</button></div>
    </>
  );
}

// ─────────────────────────── kilonova: two neutron stars ───────────────────────────
function Kilonova() {
  const S = useRef({ on: false, t0: 0, lastBeep: 0, bits: [] });
  const [run, setRun] = useState(0);
  const go = () => { S.current = { on: true, t0: -1, lastBeep: 0, bits: [] }; setRun((x) => x + 1); };
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.35);
    const s = S.current, cx = W / 2, cy = H * 0.47, R0 = Math.min(W, H) * 0.32, sz = fit(W, 55);
    if (s.t0 < 0) s.t0 = t;
    const e = s.on ? t - s.t0 : 0, T = 6; // seconds until they touch
    if (!s.on || e < T) {
      const f = s.on ? e / T : 0;
      const r = R0 * Math.pow(1 - f * 0.97, 0.25);
      const phase = s.on ? -Math.pow(1 - f * 0.999, 0.625) * 70 : t * 0.6;
      [0, Math.PI].forEach((o) => {
        const x = cx + Math.cos(phase + o) * r, y = cy + Math.sin(phase + o) * r * 0.45;
        glow(ctx, x, y, 22, "rgba(185,192,255,0.9)"); ctx.fillStyle = "#e6e9ff"; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      });
      // ripples outward, closer together as the orbit tightens
      for (let i = 0; i < 6; i++) { const rr = ((t * 60 + i * 50) % 300) * (1 - f * 0.5); ctx.strokeStyle = `rgba(139,149,246,${0.25 * (1 - rr / 300)})`; ctx.beginPath(); ctx.ellipse(cx, cy, rr + r, (rr + r) * 0.45, 0, 0, Math.PI * 2); ctx.stroke(); }
      // the chirp: rising beeps
      if (s.on && soundOn()) { const gap = 0.32 * Math.pow(1 - f, 0.4) + 0.02; if (e - s.lastBeep > gap) { s.lastBeep = e; ping(220 + 900 * Math.pow(f, 2), 0.035); } }
      label(ctx, s.on ? (W < 520 ? "spiralling in: the chirp" : "spiralling in, faster and faster: the gravitational-wave 'chirp'") : "two neutron stars, orbiting each other", W / 2, H * 0.93, { size: sz, color: C.text });
    } else {
      if (!s.bits.length) for (let i = 0; i < 500; i++) s.bits.push({ a: Math.random() * 6.28, sp: 0.3 + Math.random(), gold: Math.random() < 0.4 });
      const f = e - T;
      glow(ctx, cx, cy, R0 * (0.6 + f * 0.3), "rgba(255,240,220,0.95)", Math.max(0, 1 - f / 1.2));
      glow(ctx, cx, cy, R0 * (0.5 + f * 0.25), "rgba(255,120,80,0.6)", Math.max(0, 1 - f / 7));
      s.bits.forEach((b) => { const d = R0 * b.sp * f * 0.5; ctx.fillStyle = b.gold ? C.gold : "#ff8a6a"; ctx.globalAlpha = Math.max(0, 1 - f / 9); ctx.fillRect(cx + Math.cos(b.a) * d, cy + Math.sin(b.a) * d * 0.7, 2, 2); });
      ctx.globalAlpha = 1;
      label(ctx, f < 1.5 ? "they collide: a kilonova" : W < 520 ? "new gold, platinum, uranium" : "a glowing cloud of new heavy elements: gold, platinum, uranium", W / 2, H * 0.93, { size: sz, color: C.gold });
    }
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls"><button className="bh-btn bh-btn-on" onClick={go}>{run ? "again" : "let them spiral in"}</button><span className="mono bh-slider-val" style={{ fontSize: 11 }}>sound on: hear the chirp</span></div>
    </>
  );
}

// ─────────────────────────── recycle: generations ───────────────────────────
function Recycle() {
  const [gen, setGen] = useState(0);
  const gRef = useRef(gen); gRef.current = gen;
  const metal = Math.min(1.4, 1.4 * (1 - Math.pow(0.6, gen))); // percent heavier than helium
  const S = useRef({ t0: 0, prev: 0 });
  const ref = useCanvas((ctx, W, H, t) => {
    bg(ctx, W, H); starfield(ctx, W, H, t, 0.25);
    const g = gRef.current, s = S.current, sz = fit(W, 60);
    if (s.prev !== g) { s.prev = g; s.t0 = t; }
    const cx = W * 0.4, cy = H * 0.46, R = Math.min(W * 0.28, H * 0.3);
    const nodes = [["gas cloud", -Math.PI / 2], ["stars are born", 0], ["stars die", Math.PI / 2], ["enriched gas", Math.PI]];
    ctx.strokeStyle = "rgba(139,149,246,0.4)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    const m = Math.min(1.4, 1.4 * (1 - Math.pow(0.6, g)));
    nodes.forEach(([n, a], i) => {
      const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      const col = i === 1 ? "rgba(255,240,210,0.9)" : i === 2 ? "rgba(233,210,154,0.9)" : `rgba(${140 + 80 * (m / 1.4)},${150 + 40 * (m / 1.4)},230,0.8)`;
      glow(ctx, x, y, 28, col); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
      label(ctx, n, x, y + (i === 0 ? -22 : 22), { size: sz, color: C.text });
    });
    // a pulse travelling once round the loop after each new generation
    const p = Math.min(1, (t - s.t0) / 3);
    if (g > 0 && p < 1) { const a = -Math.PI / 2 + p * Math.PI * 2; glow(ctx, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 18, "rgba(233,210,154,1)"); }
    // the meter
    const mx = W * 0.8, mh = H * 0.6, my = H * 0.2;
    ctx.strokeStyle = C.grid; ctx.strokeRect(mx, my, 22, mh);
    const fill = (m / 1.4) * mh;
    ctx.fillStyle = C.gold; ctx.fillRect(mx, my + mh - fill, 22, fill);
    label(ctx, "heavier than helium", mx + 11, my - 26, { size: sz - 1 });
    label(ctx, `${m.toFixed(2)}%`, mx + 11, my - 10, { size: sz + 1, color: C.gold });
    label(ctx, "the Sun: 1.4%", mx + 30, my + 2, { size: sz - 2, align: "left" });
    label(ctx, W < 520 ? `generation ${g + 1}` : g === 0 ? "the first stars: pure hydrogen and helium" : `generation ${g + 1}: each one leaves the galaxy a little richer`, W * 0.4, H * 0.97, { size: sz, color: g ? C.gold : C.text });
  });
  return (
    <>
      <canvas ref={ref} className="bh-canvas" />
      <div className="bh-controls">
        <button className="bh-btn bh-btn-on" onClick={() => { setGen(gen + 1); if (soundOn()) ping(330 + gen * 55, 0.05); }}>next generation of stars</button>
        <button className="bh-btn" onClick={() => setGen(0)}>start over</button>
        <span className="mono bh-slider-val" style={{ fontSize: 11 }}>{metal.toFixed(2)}% heavy elements</span>
      </div>
    </>
  );
}

export const ISSUE_05 = { body: Body, firstminutes: FirstMinutes, collapse: Collapse, fusion: Fusion, onion: Onion, supernova: Supernova, kilonova: Kilonova, recycle: Recycle };
