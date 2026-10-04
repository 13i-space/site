"use client";

import { useEffect, useRef, useState } from "react";
import { chime, ALIEN_SCALE, alienLock, isMuted, setMuted } from "../lib/alienSound";

// The Listening Well (Update 5.58): 13i's makers perceive gravity as their
// native sense, and 13i translates it down for everyone else (docs/WORLD.md,
// "a signal, translated"). This is that translation, made playable:
//   - stars bend a grid of spacetime
//   - drag and release anywhere to fling a note into orbit
//   - each time a note swings closest to its star (periapsis) it rings:
//     the closer the pass, the higher the pitch, in 13i's own 9-step scale
//   - switch to "place stars" (or double-click) to add a star (up to four)
// It starts with one star and two notes already singing.

const COLORS = ["#7FF0E0", "#E9D29A", "#B9C0FF", "#E8B4C8", "#6FC3A8", "#C9B8F0"];
const MAX_NOTES = 14, MAX_STARS = 4;

function pitch(r, R) {
  const k = Math.max(0, Math.min(17, Math.floor((1 - Math.min(1, r / R)) * 18)));
  return ALIEN_SCALE[k % 9] * Math.pow(2, Math.floor(k / 9));
}

export default function ListeningWell() {
  const cv = useRef(null);
  const api = useRef({});
  const [mode, setMode] = useState("notes");
  const [mute, setMute] = useState(false);
  const [count, setCount] = useState({ notes: 2, stars: 1, rings: 0 });
  const modeRef = useRef("notes");
  modeRef.current = mode;

  useEffect(() => { setMute(isMuted()); }, []);

  useEffect(() => {
    const c = cv.current; if (!c) return;
    const ctx = c.getContext("2d");
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, raf = 0, rings = 0;
    const stars = [], notes = [];
    let drag = null, colorN = 0;

    const resize = () => { dpr = Math.min(2, window.devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(c);
    const sync = () => setCount({ notes: notes.length, stars: stars.length, rings });

    const addStar = (x, y, m = 1) => { if (stars.length >= MAX_STARS) return false; stars.push({ x, y, m, pulse: 1 }); alienLock(stars.length); sync(); return true; };
    const addNote = (x, y, vx, vy) => {
      if (notes.length >= MAX_NOTES) notes.shift();
      notes.push({ x, y, vx, vy, trail: [], col: COLORS[colorN++ % COLORS.length], lastR: Infinity, falling: false, flash: 0 });
      sync();
    };
    api.current.clear = () => { notes.length = 0; stars.length = 0; addStar(W / 2, H / 2); };
    api.current.seed = () => {
      stars.length = 0; notes.length = 0;
      stars.push({ x: W / 2, y: H / 2, m: 1, pulse: 1 });
      const G = 2400, r1 = Math.min(W, H) * 0.22, r2 = Math.min(W, H) * 0.36;
      addNote(W / 2 + r1, H / 2, 0, -Math.sqrt(G / r1) * 0.9);
      addNote(W / 2 - r2, H / 2, 0, Math.sqrt(G / r2) * 1.05);
    };
    api.current.seed();

    const pos = (e) => { const b = c.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    const down = (e) => {
      const p = pos(e);
      if (modeRef.current === "stars") { addStar(p.x, p.y); return; }
      drag = { x: p.x, y: p.y, cx: p.x, cy: p.y };
      c.setPointerCapture(e.pointerId);
    };
    const move = (e) => { if (drag) { const p = pos(e); drag.cx = p.x; drag.cy = p.y; } };
    const up = () => {
      if (!drag) return;
      const vx = (drag.x - drag.cx) * 0.06, vy = (drag.y - drag.cy) * 0.06; // pull back like a sling
      if (Math.hypot(drag.x - drag.cx, drag.y - drag.cy) > 6) addNote(drag.x, drag.y, vx, vy); // a tap isn't a fling
      drag = null;
    };
    const dbl = (e) => { const p = pos(e); addStar(p.x, p.y); };
    c.addEventListener("pointerdown", down); c.addEventListener("pointermove", move); c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up); c.addEventListener("dblclick", dbl);

    const G = 2400;
    const step = () => {
      for (let s = 0; s < 3; s++) {
        for (let i = notes.length - 1; i >= 0; i--) {
          const n = notes[i];
          let ax = 0, ay = 0, nearest = null, nr = Infinity;
          stars.forEach((st) => {
            const dx = st.x - n.x, dy = st.y - n.y, r2 = dx * dx + dy * dy + 120, r = Math.sqrt(r2);
            const f = (G * st.m) / r2;
            ax += (f * dx) / r; ay += (f * dy) / r;
            if (r < nr) { nr = r; nearest = st; }
          });
          n.vx += ax / 3; n.vy += ay / 3;
          n.x += n.vx / 3; n.y += n.vy / 3;
          // swallowed by a star
          if (nr < 14) { chime(70, 0.12); notes.splice(i, 1); sync(); continue; }
          // flung out of the well
          if (n.x < -300 || n.x > W + 300 || n.y < -300 || n.y > H + 300) { notes.splice(i, 1); sync(); continue; }
          // periapsis: the distance stopped falling and started rising
          const now = performance.now();
          if (n.falling && nr > n.lastR && now - (n.lastChime || 0) > 220) {
            n.lastChime = now;
            const R = Math.min(W, H) * 0.5;
            chime(pitch(n.lastR, R), 0.07, (n.x / W) * 2 - 1);
            n.flash = 1; rings += 1;
            if (nearest) nearest.pulse = 1;
            sync();
          }
          n.falling = nr < n.lastR; n.lastR = nr;
        }
      }
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "rgba(5,6,18,0.32)";
      ctx.fillRect(0, 0, W, H);
      // the bent grid
      const gap = 34;
      ctx.lineWidth = 1;
      const warp = (x, y) => {
        let ox = 0, oy = 0;
        stars.forEach((st) => { const dx = st.x - x, dy = st.y - y, r = Math.hypot(dx, dy) + 1; const k = Math.min(0.9, (1400 * st.m) / (r * r + 2000)); ox += dx * k; oy += dy * k; });
        return [x + ox, y + oy];
      };
      ctx.strokeStyle = "rgba(127,140,246,0.13)";
      for (let gx = -gap; gx <= W + gap; gx += gap) { ctx.beginPath(); for (let gy = -gap; gy <= H + gap; gy += 12) { const [x, y] = warp(gx, gy); gy === -gap ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
      for (let gy = -gap; gy <= H + gap; gy += gap) { ctx.beginPath(); for (let gx = -gap; gx <= W + gap; gx += 12) { const [x, y] = warp(gx, gy); gx === -gap ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
      // stars
      stars.forEach((st) => {
        st.pulse *= 0.94;
        const g = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, 46 + st.pulse * 30);
        g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.15, "rgba(255,231,176,0.9)"); g.addColorStop(0.5, "rgba(233,210,154,0.15)"); g.addColorStop(1, "rgba(233,210,154,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(st.x, st.y, 46 + st.pulse * 30, 0, 6.283); ctx.fill();
      });
      // notes and their trails
      notes.forEach((n) => {
        n.trail.push([n.x, n.y]); if (n.trail.length > 70) n.trail.shift();
        ctx.strokeStyle = n.col; ctx.globalAlpha = 0.45; ctx.lineWidth = 1.4;
        ctx.beginPath(); n.trail.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
        ctx.globalAlpha = 1;
        n.flash *= 0.9;
        if (n.flash > 0.05) { ctx.strokeStyle = n.col; ctx.globalAlpha = n.flash; ctx.beginPath(); ctx.arc(n.x, n.y, 6 + (1 - n.flash) * 26, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1; }
        ctx.fillStyle = n.col; ctx.shadowColor = n.col; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(n.x, n.y, 3.6, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
      });
      // the sling
      if (drag) {
        ctx.strokeStyle = "rgba(233,210,154,0.8)"; ctx.setLineDash([4, 5]);
        ctx.beginPath(); ctx.moveTo(drag.x, drag.y); ctx.lineTo(drag.cx, drag.cy); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#E9D29A"; ctx.beginPath(); ctx.arc(drag.x, drag.y, 4, 0, 6.283); ctx.fill();
      }
    };
    const tick = () => { if (!reduced) step(); draw(); raf = requestAnimationFrame(tick); };
    ctx.fillStyle = "#05060f"; ctx.fillRect(0, 0, c.width, c.height);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      c.removeEventListener("pointerdown", down); c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", up); c.removeEventListener("pointercancel", up); c.removeEventListener("dblclick", dbl);
    };
  }, []);

  return (
    <div className="lw">
      <div className="lw-stage">
        <canvas ref={cv} className="lw-canvas" aria-label="The Listening Well: drag to fling notes into orbit around the stars" />
        <div className="mono lw-hud">
          <span>{count.stars} {count.stars === 1 ? "star" : "stars"}</span>
          <span>{count.notes} {count.notes === 1 ? "note" : "notes"}</span>
          <span>{count.rings} rings heard</span>
        </div>
      </div>
      <div className="lw-controls">
        <div className="lw-modes" role="radiogroup" aria-label="What your touch does">
          <button role="radio" aria-checked={mode === "notes"} className={mode === "notes" ? "lw-on" : ""} onClick={() => setMode("notes")}>Fling notes</button>
          <button role="radio" aria-checked={mode === "stars"} className={mode === "stars" ? "lw-on" : ""} onClick={() => setMode("stars")}>Place stars</button>
        </div>
        <button className="lw-btn" onClick={() => api.current.seed?.()}>Begin again</button>
        <button className="lw-btn" onClick={() => api.current.clear?.()}>Silence</button>
        <button className="mono cx-mute" onClick={() => { setMuted(!mute); setMute(!mute); }} aria-pressed={mute}>{mute ? "sound off" : "sound on"}</button>
      </div>
      <p className="lw-help">
        {mode === "notes"
          ? "Pull back and let go, like a sling: the note flies the other way. Close passes ring high, wide ones low. Double-click to add a star."
          : "Tap to set a star in the well (up to four). Then switch back and give them something to sing about."}
      </p>
    </div>
  );
}
