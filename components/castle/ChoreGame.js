"use client";
// The chores, as small hands-on jobs: scrub, stir, pour, light, sharpen,
// knead, carry and wind. Each opens over the castle (which carries on
// around you, so mind your back) and calls onDone when the job is finished.
import { useEffect, useRef, useState } from "react";
import { castleSound as snd } from "../../lib/castle/sound";

const CW = 460, CH = 300;

export const CHORE_GAMES = {
  clock: { type: "sequence", n: 6, how: "Wind the clock: press the arrow keys in the order shown (or click them)." },
  cell: { type: "sequence", n: 5, how: "Pick the lock: press the pins in order with the arrow keys (or click them)." },
  scrolls: { type: "rub", spots: 6, hp: 1, grime: "#b9ab8a", base: "scroll", how: "Rub the dust off every scroll: hold the mouse down and scrub." },
  throne: { type: "rub", spots: 8, hp: 1.4, grime: "#5a5030", base: "gold", how: "Polish away the tarnish: hold the mouse down and rub." },
  armour: { type: "rub", spots: 7, hp: 1.6, grime: "#8a4a1e", base: "steel", how: "Scrub the rust off the breastplate: hold the mouse down and rub." },
  stalls: { type: "rub", spots: 9, hp: 1.2, grime: "#4a3a1a", base: "straw", how: "Muck out the stalls: scrub away every pile." },
  sweep: { type: "rub", spots: 10, hp: 0.8, grime: "#8a5a22", base: "grass", how: "Sweep up the leaves: drag the broom over them." },
  scrub: { type: "rub", spots: 8, hp: 1.3, grime: "#3a3020", base: "flag", how: "Scrub the stains off the dungeon floor." },
  candles: { type: "light", n: 6, how: "Click each candle wick to light it." },
  fixLights: { type: "light", n: 4, hold: true, how: "Hold the mouse on each torch until it catches." },
  wine: { type: "fill", n: 3, how: "Hold the mouse to pour. Let go when the jug is in the gold band. Don't spill!" },
  water: { type: "fill", n: 2, slow: true, how: "Hold to pour well water into the bucket. Let go in the gold band." },
  swords: { type: "timing", n: 4, how: "Sharpen the blade: click (or Space) when the whetstone is on the gold." },
  winch: { type: "timing", n: 3, how: "Oil the winch: click (or Space) when the cog's tooth is on the gold." },
  stew: { type: "stir", laps: 4, how: "Stir the stew: hold the mouse and circle round the pot." },
  bread: { type: "mash", n: 14, how: "Knead the dough: click it (or press Space) again and again." },
  bellows: { type: "mash", n: 20, decay: true, how: "Pump the bellows fast (click or Space) before the fire dies down." },
  fixGate: { type: "mash", n: 24, how: "Heave on the winch! Click (or Space) as fast as you can." },
  sheba: { type: "drag", items: ["bone", "meat", "biscuit"], targets: 1, how: "Drag Sheba's dinner into her bowl." },
  table: { type: "drag", items: ["plate", "plate", "plate", "plate", "plate", "plate"], targets: 6, how: "Drag a plate to every place at the Round Table." },
  horses: { type: "drag", items: ["hay", "hay", "hay"], targets: 3, how: "Drag a bundle of hay to each horse." },
};

const rand = (a, b) => a + Math.random() * (b - a);
const ARROWS = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
const ARROW_GLYPH = { ArrowUp: "↑", ArrowRight: "→", ArrowDown: "↓", ArrowLeft: "←" };

function setup(id) {
  const c = CHORE_GAMES[id];
  const st = { id, c, done: false, t: 0, msg: null };
  if (c.type === "rub") st.spots = Array.from({ length: c.spots }, () => ({ x: rand(70, CW - 70), y: rand(80, CH - 50), r: rand(16, 26), hp: c.hp }));
  if (c.type === "light") st.items = Array.from({ length: c.n }, (_, i) => ({ x: 70 + i * ((CW - 140) / Math.max(1, c.n - 1)), y: c.hold ? 150 : 170 + (i % 2) * 20, lit: false, heat: 0 }));
  if (c.type === "fill") { st.jug = 0; st.level = 0; st.band = [0.72, 0.88]; st.pouring = false; st.spill = 0; }
  if (c.type === "timing") { st.pos = 0; st.dir = 1; st.hits = 0; st.zone = [0.43, 0.57]; st.shake = 0; }
  if (c.type === "stir") { st.ang = null; st.turn = 0; st.spoon = null; }
  if (c.type === "mash") { st.count = 0; st.squish = 0; }
  if (c.type === "drag") {
    st.items = c.items.map((k, i) => ({ k, x: 50, y: 70 + i * (c.items.length > 3 ? 36 : 60), placed: false }));
    if (id === "table") st.targets = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 - Math.PI / 2; return { x: 300 + Math.cos(a) * 92, y: 155 + Math.sin(a) * 92, filled: 0, cap: 1 }; });
    else if (id === "horses") st.targets = [0, 1, 2].map((i) => ({ x: 330, y: 70 + i * 80, filled: 0, cap: 1 }));
    else st.targets = [{ x: 330, y: 170, filled: 0, cap: 3 }];
    st.drag = null;
  }
  if (c.type === "sequence") { st.seq = Array.from({ length: c.n }, () => ARROWS[Math.floor(Math.random() * 4)]); st.at = 0; st.shake = 0; }
  return st;
}

export function ChoreGame({ station, fake, onDone, onClose }) {
  const ref = useRef(null);
  const st = useRef(null);
  const [, force] = useState(0);
  if (!st.current || st.current.id !== station.id) st.current = setup(station.id);
  const c = st.current.c;

  const finish = () => {
    const s = st.current;
    if (s.done) return;
    s.done = true;
    snd.chore();
    force((x) => x + 1);
    setTimeout(onDone, 650);
  };

  // keyboard: Space for timing/mash, arrows for sequences, Escape to stop
  useEffect(() => {
    const k = (e) => {
      const s = st.current;
      if (e.code === "Escape") { e.preventDefault(); onClose(); return; }
      if (s.done) return;
      if ((e.code === "Space" || e.code === "KeyE") && !e.repeat) {
        e.preventDefault();
        if (c.type === "timing") strikeTiming();
        if (c.type === "mash") mash();
      }
      if (c.type === "sequence" && ARROWS.includes(e.code)) { e.preventDefault(); press(e.code); }
      e.stopPropagation();
    };
    window.addEventListener("keydown", k, true);
    return () => window.removeEventListener("keydown", k, true);
  });

  const strikeTiming = () => {
    const s = st.current;
    if (s.pos >= s.zone[0] && s.pos <= s.zone[1]) { s.hits++; snd.ding(); s.zone = [rand(0.15, 0.7), 0]; s.zone[1] = s.zone[0] + 0.14; if (s.hits >= c.n) finish(); }
    else { s.shake = 0.3; snd.wrong(); }
  };
  const mash = () => { const s = st.current; s.count++; s.squish = 1; snd.thud(); if (s.count >= c.n) finish(); };
  const press = (code) => {
    const s = st.current;
    if (code === s.seq[s.at]) { s.at++; snd.click(); if (s.at >= s.seq.length) finish(); }
    else { s.at = 0; s.shake = 0.35; snd.wrong(); }
    force((x) => x + 1);
  };

  // pointer
  const local = (e) => { const r = ref.current.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * CW, y: ((e.clientY - r.top) / r.height) * CH }; };
  const down = (e) => {
    const s = st.current; if (s.done) return;
    const p = local(e); s.mouse = p; s.held = true;
    if (c.type === "light" && !c.hold) for (const it of s.items) if (!it.lit && Math.hypot(p.x - it.x, p.y - (it.y - 34)) < 22) { it.lit = true; snd.ding(); if (s.items.every((i) => i.lit)) finish(); }
    if (c.type === "fill") s.pouring = true;
    if (c.type === "timing") strikeTiming();
    if (c.type === "mash" && Math.hypot(p.x - CW / 2, p.y - 160) < 90) mash();
    if (c.type === "drag") { const it = s.items.find((i) => !i.placed && Math.hypot(p.x - i.x, p.y - i.y) < 24); if (it) s.drag = it; }
    if (c.type === "stir") { s.ang = Math.atan2(p.y - 165, p.x - CW / 2); }
  };
  const move = (e) => {
    const s = st.current; if (s.done) return;
    const p = local(e); const prev = s.mouse; s.mouse = p;
    if (!s.held) return;
    if (c.type === "rub" && prev) {
      const d = Math.hypot(p.x - prev.x, p.y - prev.y);
      let touched = false;
      for (const sp of s.spots) if (sp.hp > 0 && Math.hypot(p.x - sp.x, p.y - sp.y) < sp.r + 8) { sp.hp -= d / 260; touched = true; }
      if (touched && Math.random() < 0.3) snd.scrub();
      if (s.spots.every((sp) => sp.hp <= 0)) finish();
    }
    if (c.type === "drag" && s.drag) { s.drag.x = p.x; s.drag.y = p.y; }
    if (c.type === "stir") {
      const a = Math.atan2(p.y - 165, p.x - CW / 2);
      if (Math.hypot(p.x - CW / 2, p.y - 165) > 30 && s.ang !== null) {
        let d = a - s.ang; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
        s.turn += Math.abs(d) < 1 ? Math.abs(d) : 0;
        if (Math.random() < 0.08) snd.pour();
        if (s.turn / (Math.PI * 2) >= c.laps) finish();
      }
      s.ang = a;
    }
  };
  const up = () => {
    const s = st.current; s.held = false;
    if (c.type === "fill" && s.pouring) {
      s.pouring = false;
      if (s.level >= s.band[0] && s.level <= s.band[1]) { snd.ding(); s.jug++; s.level = 0; if (s.jug >= c.n) finish(); }
      else if (s.level > 0.05) { s.msg = s.level < s.band[0] ? "Not full enough, keep pouring" : null; }
    }
    if (c.type === "drag" && s.drag) {
      const it = s.drag; s.drag = null;
      const tg = s.targets.find((t) => t.filled < t.cap && Math.hypot(it.x - t.x, it.y - t.y) < 40);
      if (tg) { tg.filled++; it.placed = true; it.x = tg.x + (tg.cap > 1 ? (tg.filled - 2) * 12 : 0); it.y = tg.y; snd.ding(); if (s.items.every((i) => i.placed)) finish(); }
      else { const i = s.items.indexOf(it); it.x = 50; it.y = 70 + i * (s.items.length > 3 ? 36 : 60); }
    }
  };

  // the drawing loop
  useEffect(() => {
    const cv = ref.current, g = cv.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = CW * dpr; cv.height = CH * dpr;
    let raf, last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const s = st.current; s.t += dt;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      update(s, dt);
      draw(g, s);
      raf = requestAnimationFrame(loop);
    };
    const update = (s, dt) => {
      if (s.done) return;
      if (c.type === "fill" && s.pouring) {
        s.level += dt * (c.slow ? 0.32 : 0.45);
        if (Math.random() < 0.2) snd.pour();
        if (s.level > 1) { s.level = 0; s.pouring = false; s.held = false; s.spill = 0.8; snd.wrong(); s.msg = "Spilled! Start that one again."; }
      }
      if (c.type === "fill") s.spill = Math.max(0, s.spill - dt);
      if (c.type === "timing") { s.pos += s.dir * dt * (0.9 + s.hits * 0.18); if (s.pos > 1) { s.pos = 1; s.dir = -1; } if (s.pos < 0) { s.pos = 0; s.dir = 1; } s.shake = Math.max(0, s.shake - dt); }
      if (c.type === "mash") { s.squish = Math.max(0, s.squish - dt * 5); if (c.decay && s.count > 0) s.count = Math.max(0, s.count - dt * 2.2); }
      if (c.type === "light" && c.hold && s.held && s.mouse) {
        for (const it of s.items) if (!it.lit && Math.hypot(s.mouse.x - it.x, s.mouse.y - (it.y - 40)) < 26) { it.heat += dt; if (it.heat > 0.7) { it.lit = true; snd.ding(); if (s.items.every((i) => i.lit)) finish(); } }
      }
      if (c.type === "sequence") s.shake = Math.max(0, s.shake - dt);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const s = st.current;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(5,4,12,0.55)", zIndex: 5 }} onMouseUp={up}>
      <div style={{ background: "rgba(16,13,30,0.97)", border: "1px solid #c9a227", borderRadius: 12, padding: 16, width: "min(500px, 94vw)", boxShadow: "0 16px 50px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#f2dc9a" }}>{station.label}</div>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid #3a3560", color: "#c9c3e6", borderRadius: 999, padding: "2px 10px", fontSize: 12, cursor: "pointer" }}>stop (Esc)</button>
        </div>
        <div style={{ fontSize: 13, color: "#c9c3e6", margin: "4px 0 10px" }}>{c.how}{fake ? " (You're only pretending: it won't count.)" : ""}</div>
        <canvas
          ref={ref}
          style={{ width: "100%", aspectRatio: `${CW} / ${CH}`, display: "block", borderRadius: 8, cursor: c.type === "rub" || c.type === "stir" ? "grab" : "pointer", touchAction: "none" }}
          onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={() => { if (c.type !== "drag") up(); }}
        />
        {c.type === "sequence" && (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
            {ARROWS.map((a) => <button key={a} onClick={() => press(a)} style={{ width: 44, height: 40, fontSize: 20, background: "#17142e", color: "#f2e6c8", border: "1px solid #5a5390", borderRadius: 8, cursor: "pointer" }}>{ARROW_GLYPH[a]}</button>)}
          </div>
        )}
        {s.done && <div style={{ textAlign: "center", color: "#8ef0a8", fontWeight: 700, marginTop: 8 }}>{fake ? "Looking very busy." : "Done!"}</div>}
      </div>
    </div>
  );
}

// ---------- pictures for each job ----------
function draw(g, s) {
  const c = s.c, id = s.id;
  const bg = g.createLinearGradient(0, 0, 0, CH); bg.addColorStop(0, "#2a2238"); bg.addColorStop(1, "#18131f");
  g.fillStyle = bg; g.fillRect(0, 0, CW, CH);
  g.textAlign = "center"; g.textBaseline = "middle";
  if (c.type === "rub") {
    const base = { scroll: "#e6d8b0", gold: "#d9b54a", steel: "#c9ced8", straw: "#c9a54a", grass: "#3f7a46", flag: "#6a6560" }[c.base];
    if (c.base === "steel") { g.fillStyle = base; g.beginPath(); g.moveTo(140, 50); g.lineTo(320, 50); g.lineTo(340, 140); g.quadraticCurveTo(230, 300, 120, 140); g.closePath(); g.fill(); g.strokeStyle = "#8a8f9a"; g.lineWidth = 3; g.stroke(); }
    else if (c.base === "scroll") { for (let i = 0; i < 4; i++) { g.fillStyle = base; g.fillRect(60 + i * 90, 50, 70, 210); g.fillStyle = "#8a6a3a"; g.fillRect(55 + i * 90, 44, 80, 12); g.fillRect(55 + i * 90, 254, 80, 12); g.fillStyle = "#6b5a3a"; for (let l = 0; l < 8; l++) g.fillRect(70 + i * 90, 75 + l * 22, 50, 2); } }
    else if (c.base === "gold") { g.fillStyle = "#7a1d28"; g.fillRect(150, 90, 160, 150); g.fillStyle = base; g.fillRect(130, 40, 200, 50); g.fillRect(130, 40, 30, 230); g.fillRect(300, 40, 30, 230); g.fillRect(130, 230, 200, 30); }
    else { g.fillStyle = base; g.fillRect(20, 20, CW - 40, CH - 40); if (c.base === "flag") { g.strokeStyle = "#3a3632"; for (let x = 20; x < CW; x += 60) { g.beginPath(); g.moveTo(x, 20); g.lineTo(x, CH - 20); g.stroke(); } for (let y = 20; y < CH; y += 50) { g.beginPath(); g.moveTo(20, y); g.lineTo(CW - 20, y); g.stroke(); } } }
    for (const sp of s.spots) {
      if (sp.hp <= 0) continue;
      g.globalAlpha = Math.max(0.1, sp.hp / c.hp);
      g.fillStyle = c.grime;
      if (c.base === "grass") { for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(sp.x + Math.cos(k * 1.7) * 8, sp.y + Math.sin(k * 2.3) * 6, 9, 5, k, 0, 7); g.fill(); } }
      else { g.beginPath(); g.arc(sp.x, sp.y, sp.r, 0, 7); g.fill(); g.beginPath(); g.arc(sp.x + sp.r * 0.6, sp.y - sp.r * 0.4, sp.r * 0.6, 0, 7); g.fill(); }
      g.globalAlpha = 1;
    }
    if (s.mouse) {
      g.save(); g.translate(s.mouse.x, s.mouse.y);
      if (c.base === "grass" || c.base === "straw") { g.strokeStyle = "#8b6a3a"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(26, -40); g.stroke(); g.fillStyle = "#d9b45a"; g.fillRect(-14, -4, 24, 12); }
      else { g.fillStyle = s.held ? "#e8dcb8" : "#c9bfa0"; g.beginPath(); g.ellipse(0, 0, 14, 10, 0.4, 0, 7); g.fill(); }
      g.restore();
    }
    const left = s.spots.filter((sp) => sp.hp > 0).length;
    label(g, `${left} left`);
  }
  if (c.type === "light") {
    if (c.hold) { g.fillStyle = "#3a3a44"; g.fillRect(0, 0, CW, CH); }
    for (const it of s.items) {
      if (c.hold) {
        g.fillStyle = "#4a2e14"; g.fillRect(it.x - 5, it.y - 30, 10, 90);
        g.fillStyle = "#2a2a30"; g.fillRect(it.x - 12, it.y - 40, 24, 12);
      } else {
        g.fillStyle = "#f2e6c8"; g.fillRect(it.x - 8, it.y - 30, 16, 60);
        g.fillStyle = "#6b5a3a"; g.fillRect(it.x - 16, it.y + 28, 32, 8);
        g.strokeStyle = "#3a2a1a"; g.lineWidth = 3; g.beginPath(); g.moveTo(it.x, it.y - 30); g.lineTo(it.x, it.y - 40); g.stroke();
        if (!it.lit) { g.strokeStyle = `rgba(255,224,138,${0.35 + Math.sin(s.t * 4 + it.x) * 0.2})`; g.lineWidth = 1.5; g.beginPath(); g.arc(it.x, it.y - 38, 13, 0, 7); g.stroke(); }
      }
      const fy = it.y - (c.hold ? 52 : 46);
      if (it.lit) {
        const f = 1 + Math.sin(s.t * 18 + it.x) * 0.12;
        const gr = g.createRadialGradient(it.x, fy, 0, it.x, fy, 40); gr.addColorStop(0, "rgba(255,200,100,0.5)"); gr.addColorStop(1, "rgba(255,150,50,0)");
        g.fillStyle = gr; g.beginPath(); g.arc(it.x, fy, 40, 0, 7); g.fill();
        g.fillStyle = "#ffb43a"; g.beginPath(); g.ellipse(it.x, fy, 6 * f, (c.hold ? 14 : 10) * f, 0, 0, 7); g.fill();
        g.fillStyle = "#fff2b0"; g.beginPath(); g.ellipse(it.x, fy + 2, 3 * f, 5 * f, 0, 0, 7); g.fill();
      } else if (c.hold && it.heat > 0) {
        g.fillStyle = `rgba(255,140,40,${it.heat})`; g.beginPath(); g.arc(it.x, fy + 8, 6 + it.heat * 6, 0, 7); g.fill();
      }
    }
    label(g, `${s.items.filter((i) => i.lit).length} of ${s.items.length} lit`);
  }
  if (c.type === "fill") {
    const x = CW / 2, top = 70, bottom = 260, w2 = c.slow ? 70 : 52;
    // the stream
    if (s.pouring) { g.fillStyle = c.slow ? "#6fb7e8" : "#8a1d3a"; g.fillRect(x - 4, 20, 8, bottom - (bottom - top) * s.level - 20); }
    g.fillStyle = c.slow ? "#5a3a22" : "#8a6a3a";
    g.beginPath(); g.moveTo(x - w2, top); g.lineTo(x + w2, top); g.lineTo(x + w2 - 8, bottom); g.lineTo(x - w2 + 8, bottom); g.closePath(); g.fill();
    const lvY = bottom - (bottom - top) * s.level;
    g.fillStyle = c.slow ? "#6fb7e8" : "#8a1d3a"; g.fillRect(x - w2 + 10, lvY, (w2 - 10) * 2, bottom - lvY - 4);
    const b0 = bottom - (bottom - top) * s.band[1], b1 = bottom - (bottom - top) * s.band[0];
    g.strokeStyle = "#e9c64a"; g.lineWidth = 2; g.setLineDash([6, 4]); g.strokeRect(x - w2 - 14, b0, (w2 + 14) * 2, b1 - b0); g.setLineDash([]);
    if (s.spill > 0) { g.fillStyle = `rgba(140,30,60,${s.spill})`; g.beginPath(); g.ellipse(x, bottom + 14, 90, 12, 0, 0, 7); g.fill(); }
    label(g, `${c.slow ? "Bucket" : "Jug"} ${Math.min(c.n, s.jug + 1)} of ${c.n}${s.msg ? " · " + s.msg : ""}`);
  }
  if (c.type === "timing") {
    const bx = 50, bw = CW - 100, by = 150 + (s.shake ? Math.sin(s.t * 80) * 4 : 0);
    if (id === "swords") { g.fillStyle = "#dde3ec"; g.beginPath(); g.moveTo(bx - 20, by - 8); g.lineTo(bx + bw + 30, by); g.lineTo(bx - 20, by + 8); g.fill(); g.fillStyle = "#c9a227"; g.fillRect(bx - 34, by - 22, 8, 44); }
    else { g.fillStyle = "#555"; for (let i = 0; i < 12; i++) { const a = s.t * 2 + (i / 12) * Math.PI * 2; g.fillRect(CW / 2 + Math.cos(a) * 70 - 6, 90 + Math.sin(a) * 30 - 6, 12, 12); } g.fillStyle = "#3a3a44"; g.fillRect(bx, by - 6, bw, 12); }
    g.fillStyle = "rgba(233,198,74,0.55)"; g.fillRect(bx + s.zone[0] * bw, by - 26, (s.zone[1] - s.zone[0]) * bw, 52);
    const mx = bx + s.pos * bw;
    g.fillStyle = id === "swords" ? "#6a6560" : "#d9b45a";
    g.fillRect(mx - 12, by - 22, 24, 44);
    label(g, `${s.hits} of ${c.n}`);
  }
  if (c.type === "stir") {
    const x = CW / 2, y = 165;
    g.fillStyle = "#222"; g.beginPath(); g.arc(x, y, 110, 0, 7); g.fill();
    g.fillStyle = "#7a4a22"; g.beginPath(); g.arc(x, y, 92, 0, 7); g.fill();
    for (let i = 0; i < 9; i++) { const a = s.turn + i * 0.7; g.fillStyle = i % 3 ? "#c97a3a" : "#5a8a3a"; g.beginPath(); g.arc(x + Math.cos(a) * (30 + i * 6), y + Math.sin(a) * (30 + i * 6), 7, 0, 7); g.fill(); }
    if (s.mouse) { g.strokeStyle = "#8b6a3a"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(s.mouse.x, s.mouse.y); g.lineTo(s.mouse.x + 30, s.mouse.y - 60); g.stroke(); }
    label(g, `${Math.min(c.laps, Math.floor(s.turn / (Math.PI * 2)))} of ${c.laps} stirs`);
  }
  if (c.type === "mash") {
    const x = CW / 2, y = 160, sq = s.squish;
    if (id === "bread") { g.fillStyle = "#e8cfa0"; g.beginPath(); g.ellipse(x, y + sq * 10, 90 + sq * 20, 50 - sq * 14 + (s.count / c.n) * 10, 0, 0, 7); g.fill(); g.fillStyle = "#d4b07a"; g.beginPath(); g.ellipse(x - 20, y - 10, 20, 8, 0.3, 0, 7); g.fill(); }
    else if (id === "bellows") {
      const heat = s.count / c.n;
      g.fillStyle = `rgb(${120 + heat * 135},${50 + heat * 80},20)`; g.beginPath(); g.arc(x + 110, y + 40, 40 + heat * 20, 0, 7); g.fill();
      g.fillStyle = "#6b3a1e"; g.beginPath(); g.moveTo(x - 120, y - 40 + sq * 20); g.lineTo(x + 40, y); g.lineTo(x - 120, y + 40 - sq * 20); g.closePath(); g.fill();
    } else { g.strokeStyle = "#999"; g.lineWidth = 10; g.beginPath(); g.arc(x, y, 60, 0, 7); g.stroke(); const a = s.count * 0.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 90, y + Math.sin(a) * 90); g.stroke(); }
    g.fillStyle = "#1c1a30"; g.fillRect(60, 270, CW - 120, 12);
    g.fillStyle = "#e9c64a"; g.fillRect(60, 270, (CW - 120) * Math.min(1, s.count / c.n), 12);
    label(g, id === "bellows" ? "Keep it going!" : "Keep going!");
  }
  if (c.type === "drag") {
    for (const t of s.targets) {
      if (id === "table") { g.fillStyle = "#5a3818"; g.beginPath(); g.arc(300, 155, 70, 0, 7); g.fill(); g.strokeStyle = "rgba(233,198,74,0.6)"; g.setLineDash([4, 4]); g.beginPath(); g.arc(t.x, t.y, 20, 0, 7); g.stroke(); g.setLineDash([]); }
      else if (id === "horses") { g.fillStyle = "#6a4426"; g.beginPath(); g.ellipse(t.x + 40, t.y, 36, 16, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(t.x + 4, t.y - 10, 16, 9, -0.4, 0, 7); g.fill(); g.fillStyle = "#000"; g.beginPath(); g.arc(t.x - 4, t.y - 13, 2, 0, 7); g.fill(); }
      else {
        g.fillStyle = "#6b3a1e"; g.beginPath(); g.ellipse(t.x, t.y + 10, 46, 20, 0, 0, 7); g.fill();
        g.fillStyle = "#121214"; g.beginPath(); g.ellipse(t.x + 70, t.y - 30, 30, 18, 0, 0, 7); g.fill(); g.beginPath(); g.arc(t.x + 48, t.y - 48, 14, 0, 7); g.fill();
        g.fillStyle = "#f2efe6"; g.beginPath(); g.ellipse(t.x + 52, t.y - 28, 8, 6, 0, 0, 7); g.fill();
        g.fillStyle = "#e9e6df"; g.font = "600 11px Inter, sans-serif"; g.fillText(t.filled >= t.cap ? "Sheba wolfs it down!" : "Sheba is waiting...", t.x + 60, t.y + 52);
      }
    }
    for (const it of s.items) drawItem(g, it);
    label(g, `${s.items.filter((i) => i.placed).length} of ${s.items.length}`);
  }
  if (c.type === "sequence") {
    const n = s.seq.length, w0 = 56, x0 = CW / 2 - (n * w0) / 2 + w0 / 2, jig = s.shake ? Math.sin(s.t * 80) * 5 : 0;
    if (id === "clock") { g.strokeStyle = "#c9a227"; g.lineWidth = 4; g.beginPath(); g.arc(CW / 2, 90, 50, 0, 7); g.stroke(); g.strokeStyle = "#e8dcb8"; g.beginPath(); g.moveTo(CW / 2, 90); g.lineTo(CW / 2 + Math.cos(s.at - 1.5) * 38, 90 + Math.sin(s.at - 1.5) * 38); g.stroke(); }
    else { g.fillStyle = "#b8902a"; g.beginPath(); g.arc(CW / 2, 80, 34, Math.PI, 0); g.fill(); g.fillRect(CW / 2 - 40, 80, 80, 56); g.fillStyle = "#1b1406"; g.beginPath(); g.arc(CW / 2, 102, 8, 0, 7); g.fill(); g.fillRect(CW / 2 - 3, 102, 6, 20); }
    s.seq.forEach((a, i) => {
      const x = x0 + i * w0 + jig;
      g.fillStyle = i < s.at ? "#2e6b3a" : i === s.at ? "#c9a227" : "#2a2450";
      g.fillRect(x - 22, 190, 44, 44);
      g.fillStyle = i === s.at ? "#1b1406" : "#f2e6c8"; g.font = "700 26px Inter, sans-serif";
      g.fillText(ARROW_GLYPH[a], x, 213);
    });
    label(g, s.shake ? "Wrong one! Start again." : `${s.at} of ${n}`);
  }
}

function drawItem(g, it) {
  g.save(); g.translate(it.x, it.y);
  if (it.k === "plate") { g.fillStyle = "#e8e4d8"; g.beginPath(); g.arc(0, 0, 15, 0, 7); g.fill(); g.strokeStyle = "#c9a227"; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 11, 0, 7); g.stroke(); }
  else if (it.k === "hay") { g.fillStyle = "#d9b45a"; g.fillRect(-20, -12, 40, 24); g.strokeStyle = "#8b6a3a"; g.lineWidth = 2; g.beginPath(); g.moveTo(-6, -12); g.lineTo(-6, 12); g.moveTo(6, -12); g.lineTo(6, 12); g.stroke(); }
  else if (it.k === "bone") { g.fillStyle = "#efe9da"; g.fillRect(-14, -4, 28, 8); for (const [x, y] of [[-14, -5], [-14, 5], [14, -5], [14, 5]]) { g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); } }
  else if (it.k === "meat") { g.fillStyle = "#a83a2a"; g.beginPath(); g.ellipse(0, 0, 16, 11, 0.3, 0, 7); g.fill(); g.fillStyle = "#efe9da"; g.fillRect(10, -3, 12, 6); }
  else { g.fillStyle = "#c9944a"; g.beginPath(); g.arc(0, 0, 11, 0, 7); g.fill(); g.fillStyle = "#8a5a2e"; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(-4 + (i % 2) * 8, -4 + Math.floor(i / 2) * 8, 1.5, 0, 7); g.fill(); } }
  g.restore();
}

function label(g, text) {
  g.font = "600 13px Inter, system-ui, sans-serif"; g.textAlign = "center";
  g.fillStyle = "rgba(0,0,0,0.5)"; g.fillRect(CW / 2 - 110, 8, 220, 24);
  g.fillStyle = "#f2e6c8"; g.fillText(text, CW / 2, 21);
}
