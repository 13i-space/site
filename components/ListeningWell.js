"use client";

import { useEffect, useRef, useState } from "react";
import { chime, ALIEN_SCALE, alienLock, isMuted, setMuted } from "../lib/alienSound";

// The Listening Well (Update 5.58, rebuilt in 3D in 6.20): 13i's makers
// perceive gravity as their native sense, and 13i translates it down for
// everyone else (docs/WORLD.md, "a signal, translated"). This is that
// translation, made playable:
//   - stars sink wells into a sheet of spacetime, seen in perspective
//   - drag and release anywhere to fling a note into orbit (a dotted line
//     shows where the sling will send it)
//   - each time a note swings closest to its star (periapsis) it rings:
//     the closer the pass, the higher the pitch, in 13i's own 9-step scale;
//     the sheet ripples where it rang, and the trace along the bottom
//     records every tone heard
//   - switch to "place stars" (or double-click) to add a star (up to four)
// It starts with one star and two notes already singing.
//
// The physics is the same as before; it runs on the sheet (plane units are
// about a pixel at the middle of the picture), and the picture is that sheet
// tilted away from you. Taps are mapped back onto the sheet, wells included.

const COLORS = ["#7FF0E0", "#E9D29A", "#B9C0FF", "#E8B4C8", "#6FC3A8", "#C9B8F0"];
const MAX_NOTES = 14, MAX_STARS = 4, G = 2400;
const TILT = 0.95; // radians away from looking straight down
const STEPS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

function toneOf(r, R) {
  const k = Math.max(0, Math.min(17, Math.floor((1 - Math.min(1, r / R)) * 18)));
  return { k, f: ALIEN_SCALE[k % 9] * Math.pow(2, Math.floor(k / 9)) };
}
const rgb = (hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

export default function ListeningWell() {
  const cv = useRef(null);
  const api = useRef({});
  const [mode, setMode] = useState("notes");
  const [mute, setMute] = useState(false);
  const [count, setCount] = useState({ notes: 2, stars: 1, rings: 0, tone: null });
  const modeRef = useRef("notes");
  modeRef.current = mode;

  useEffect(() => { setMute(isMuted()); }, []);

  useEffect(() => {
    const c = cv.current; if (!c) return;
    const ctx = c.getContext("2d");
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, raf = 0, rings = 0, lastTone = null;
    const stars = [], notes = [], ripples = [], trace = [];
    let drag = null, colorN = 0;
    // the view: V holds the camera and the sheet's extent
    const V = { ct: Math.cos(TILT), st: Math.sin(TILT), D: 1, F: 1, cy: 0, u: 1, v0: -1, v1: 1, vMid: 0, DK: 1 };
    let sky = null;

    const project = (x, y, h) => {
      const yc = y * V.ct - h * V.st, zc = V.D - y * V.st - h * V.ct, s = V.F / zc;
      return [W / 2 + x * s, V.cy + yc * s, s];
    };
    // the sheet's height under a point: wells at the stars, ripples where notes rang
    const depth = (x, y, t) => {
      let h = 0;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i], dx = s.x - x, dy = s.y - y;
        h -= (s.m * s.grow * V.DK) / Math.sqrt(dx * dx + dy * dy + 2600);
      }
      for (let i = 0; i < ripples.length; i++) {
        const rp = ripples[i], age = t - rp.t0; if (age < 0) continue;
        const r = Math.hypot(rp.x - x, rp.y - y), front = r - age * 240;
        h += rp.a * 12 * Math.sin(front / 16) * Math.exp(-Math.abs(front) / 55) * Math.exp(-age * 1.3);
      }
      return h;
    };
    // a screen point back onto the sheet (iterated, so taps land in the wells)
    const unproject = (sx, sy, withDepth = true) => {
      const q = (sy - V.cy) / V.F;
      let h = 0, x = 0, y = 0;
      for (let k = 0; k < (withDepth ? 6 : 1); k++) {
        const ny = (q * (V.D - h * V.ct) + h * V.st) / (V.ct + q * V.st);
        y = k ? (y + ny) / 2 : ny;
        x = ((sx - W / 2) * (V.D - y * V.st - h * V.ct)) / V.F;
        if (withDepth) h = depth(x, y, performance.now() / 1000);
      }
      return { x, y };
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr;
      V.D = Math.max(H * 3.1, W * 1.5); V.F = V.D; V.cy = H * 0.4; V.DK = Math.min(H, W * 0.75) * 15;
      const vAt = (sy) => { const q = (sy - V.cy) / V.F; return (q * V.D) / (V.ct + q * V.st); };
      V.v0 = vAt(H * 0.05); V.v1 = vAt(H * 1.04); V.vMid = vAt(H * 0.47);
      V.u = ((W / 2) * (V.D - V.v0 * V.st)) / V.F * 1.04;
      // the sky behind it, drawn once
      sky = document.createElement("canvas"); sky.width = c.width; sky.height = c.height;
      const k = sky.getContext("2d"); k.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = k.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#03040c"); bg.addColorStop(0.45, "#070923"); bg.addColorStop(1, "#05060f");
      k.fillStyle = bg; k.fillRect(0, 0, W, H);
      const neb = k.createRadialGradient(W * 0.7, H * 0.12, 0, W * 0.7, H * 0.12, W * 0.5); neb.addColorStop(0, "rgba(110,80,200,0.16)"); neb.addColorStop(1, "rgba(110,80,200,0)");
      k.fillStyle = neb; k.fillRect(0, 0, W, H);
      const neb2 = k.createRadialGradient(W * 0.15, H * 0.2, 0, W * 0.15, H * 0.2, W * 0.4); neb2.addColorStop(0, "rgba(60,180,190,0.09)"); neb2.addColorStop(1, "rgba(60,180,190,0)");
      k.fillStyle = neb2; k.fillRect(0, 0, W, H);
      let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < 260; i++) { const x = rnd() * W, y = rnd() * H * 0.62, a = rnd() * rnd(); k.fillStyle = `rgba(220,225,255,${a * 0.8})`; k.fillRect(x, y, a > 0.5 ? 1.6 : 1, a > 0.5 ? 1.6 : 1); }
    };
    resize();
    const ro = new ResizeObserver(() => { const oldMid = V.vMid; resize(); const dy = V.vMid - oldMid; stars.forEach((s) => { s.y += dy; }); notes.forEach((n) => { n.y += dy; n.trail.length = 0; }); });
    ro.observe(c);
    const sync = () => setCount({ notes: notes.length, stars: stars.length, rings, tone: lastTone });

    const addStar = (x, y, m = 1, grow = 0) => { if (stars.length >= MAX_STARS) return false; stars.push({ x, y, m, grow, pulse: 1, spin: Math.random() * 6 }); alienLock(stars.length); sync(); return true; };
    const addNote = (x, y, vx, vy) => {
      if (notes.length >= MAX_NOTES) notes.shift();
      const col = COLORS[colorN++ % COLORS.length];
      notes.push({ x, y, vx, vy, trail: [], col, c: rgb(col), lastR: Infinity, falling: false, flash: 0 });
      sync();
    };
    api.current.clear = () => { notes.length = 0; stars.length = 0; ripples.length = 0; addStar(0, V.vMid, 1, 1); };
    api.current.seed = () => {
      stars.length = 0; notes.length = 0; ripples.length = 0;
      stars.push({ x: 0, y: V.vMid, m: 1, grow: 1, pulse: 1, spin: 0 });
      const r1 = Math.min(W, H) * 0.24, r2 = Math.min(W, H) * 0.4;
      addNote(r1, V.vMid, 0, -Math.sqrt(G / r1) * 0.9);
      addNote(-r2, V.vMid, 0, Math.sqrt(G / r2) * 1.05);
    };
    api.current.seed();

    const pos = (e) => { const b = c.getBoundingClientRect(); return unproject(e.clientX - b.left, e.clientY - b.top); };
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

    // gravity at a point, shared by the notes and the sling's forecast
    const pull = (x, y) => {
      let ax = 0, ay = 0, nearest = null, nr = Infinity;
      for (let j = 0; j < stars.length; j++) {
        const st = stars[j], dx = st.x - x, dy = st.y - y, r2 = dx * dx + dy * dy + 120, r = Math.sqrt(r2);
        const f = (G * st.m * st.grow) / r2;
        ax += (f * dx) / r; ay += (f * dy) / r;
        if (r < nr) { nr = r; nearest = st; }
      }
      return { ax, ay, nearest, nr };
    };
    const outside = (x, y) => x < -V.u - 300 || x > V.u + 300 || y < V.v0 - 300 || y > V.v1 + 300;

    const step = () => {
      const now = performance.now();
      for (let s = 0; s < 3; s++) {
        for (let i = notes.length - 1; i >= 0; i--) {
          const n = notes[i];
          const { ax, ay, nearest, nr } = pull(n.x, n.y);
          n.vx += ax / 3; n.vy += ay / 3;
          n.x += n.vx / 3; n.y += n.vy / 3;
          // swallowed by a star
          if (nr < 14) { chime(70, 0.12); if (nearest) nearest.pulse = 1.4; notes.splice(i, 1); sync(); continue; }
          // flung out of the well
          if (outside(n.x, n.y)) { notes.splice(i, 1); sync(); continue; }
          // periapsis: the distance stopped falling and started rising
          if (n.falling && nr > n.lastR && now - (n.lastChime || 0) > 220) {
            n.lastChime = now;
            const tone = toneOf(n.lastR, Math.min(W, H) * 0.5);
            chime(tone.f, 0.07, Math.max(-1, Math.min(1, n.x / (W / 2))));
            n.flash = 1; rings += 1;
            if (nearest) nearest.pulse = 1;
            ripples.push({ x: n.x, y: n.y, t0: now / 1000, a: 0.5 + tone.k / 17, c: n.c }); if (ripples.length > 10) ripples.shift();
            trace.push({ t: now / 1000, k: tone.k, c: n.c }); if (trace.length > 80) trace.shift();
            lastTone = { step: STEPS[tone.k % 9], oct: Math.floor(tone.k / 9) + 1, hz: Math.round(tone.f), col: n.col };
            sync();
          }
          n.falling = nr < n.lastR; n.lastR = nr;
        }
      }
      for (let i = ripples.length - 1; i >= 0; i--) if (now / 1000 - ripples[i].t0 > 3) ripples.splice(i, 1);
    };

    const drawSheet = (t) => {
      const gap = 34, sample = 14;
      const fade = (y) => Math.max(0, Math.min(1, (y - V.v0) / ((V.v1 - V.v0) * 0.35)));
      ctx.lineWidth = 1;
      // rows across (far to near) and lines running into the distance
      for (let gy = V.v0; gy <= V.v1 + gap; gy += gap) {
        ctx.beginPath();
        let minH = 0;
        for (let gx = -V.u; gx <= V.u + sample; gx += sample) {
          const h = depth(gx, gy, t); if (h < minH) minH = h;
          const [x, y] = project(gx, gy, h); gx === -V.u ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const d = Math.min(1, -minH / (H * 0.22));
        const a = (0.1 + d * 0.2) * fade(gy);
        ctx.strokeStyle = `rgba(127,${Math.round(150 + d * 90)},${Math.round(246 - d * 22)},${a})`; ctx.stroke();
      }
      for (let gx = -Math.floor(V.u / gap) * gap; gx <= V.u; gx += gap) {
        const grad = ctx.createLinearGradient(0, project(0, V.v0, 0)[1], 0, H);
        grad.addColorStop(0, "rgba(127,150,246,0)"); grad.addColorStop(0.3, "rgba(127,150,246,0.14)"); grad.addColorStop(1, "rgba(127,150,246,0.2)");
        ctx.strokeStyle = grad; ctx.beginPath();
        for (let gy = V.v0; gy <= V.v1 + sample; gy += sample) {
          const [x, y] = project(gx, gy, depth(gx, gy, t)); gy === V.v0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };
    // a circle lying on the sheet, at a given height
    const ring = (cx, cy, r, h, seg = 48) => {
      ctx.beginPath();
      for (let i = 0; i <= seg; i++) { const a = (i / seg) * 6.2832; const [x, y] = project(cx + Math.cos(a) * r, cy + Math.sin(a) * r, h); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    };

    const drawStar = (st, t) => {
      st.pulse *= 0.95; st.spin += 0.006;
      const h = depth(st.x, st.y, t);
      const [x, y, s] = project(st.x, st.y, h);
      const g = st.grow, R = (34 + st.pulse * 22) * s * g;
      // the throat of the well, lit from inside
      const throat = ctx.createRadialGradient(x, y, 0, x, y, R * 2.4);
      throat.addColorStop(0, "rgba(233,210,154,0.22)"); throat.addColorStop(0.45, "rgba(127,240,224,0.035)"); throat.addColorStop(1, "rgba(127,240,224,0)");
      ctx.fillStyle = throat; ctx.beginPath(); ctx.ellipse(x, y, R * 2.4, R * 2.4 * V.ct * 1.1, 0, 0, 6.2832); ctx.fill();
      // an accretion ring turning round it, lying in the sheet
      for (let k = 0; k < 2; k++) {
        const rr = (26 + k * 14) * g;
        ctx.strokeStyle = k ? "rgba(185,192,255,0.35)" : "rgba(233,210,154,0.6)"; ctx.lineWidth = k ? 1 : 1.6;
        ctx.setLineDash(k ? [2, 7] : [10, 6, 2, 6]); ctx.lineDashOffset = (k ? 1 : -1) * st.spin * 60;
        ring(st.x, st.y, rr, h + 4, 56); ctx.stroke();
      }
      ctx.setLineDash([]);
      // the corona and its rays
      ctx.save(); ctx.translate(x, y);
      for (let k = 0; k < 6; k++) {
        const a = st.spin * (k % 2 ? -0.7 : 1) + (k * Math.PI) / 3, L = R * (1.6 + 0.5 * Math.sin(t * 2 + k));
        const rg = ctx.createLinearGradient(0, 0, Math.cos(a) * L, Math.sin(a) * L);
        rg.addColorStop(0, "rgba(255,240,205,0.7)"); rg.addColorStop(1, "rgba(255,240,205,0)");
        ctx.strokeStyle = rg; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * L, Math.sin(a) * L); ctx.stroke();
      }
      const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
      cg.addColorStop(0, "rgba(255,255,255,1)"); cg.addColorStop(0.14, "rgba(255,238,200,0.95)"); cg.addColorStop(0.4, "rgba(233,210,154,0.3)"); cg.addColorStop(1, "rgba(233,210,154,0)");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.2832); ctx.fill();
      ctx.restore();
    };

    const drawNote = (n, t) => {
      const h = depth(n.x, n.y, t) + 5;
      n.trail.push([n.x, n.y, h]); if (n.trail.length > 90) n.trail.shift();
      // a comet's tail: thin and faint at its end, bright at the head
      const pts = n.trail.map(([x, y, hh]) => project(x, y, hh));
      for (let k = 1; k < pts.length; k++) {
        const f = k / pts.length;
        ctx.strokeStyle = rgba(n.c, f * f * 0.85); ctx.lineWidth = 0.6 + f * 2.6 * pts[k][2];
        ctx.beginPath(); ctx.moveTo(pts[k - 1][0], pts[k - 1][1]); ctx.lineTo(pts[k][0], pts[k][1]); ctx.stroke();
      }
      const [x, y, s] = project(n.x, n.y, h);
      n.flash *= 0.93;
      if (n.flash > 0.04) {
        ctx.strokeStyle = rgba(n.c, n.flash); ctx.lineWidth = 1.5;
        ring(n.x, n.y, 6 + (1 - n.flash) * 34, h, 32); ctx.stroke();
      }
      const gR = (9 + n.flash * 10) * s;
      const g = ctx.createRadialGradient(x, y, 0, x, y, gR);
      g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.25, rgba(n.c, 0.9)); g.addColorStop(1, rgba(n.c, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, gR, 0, 6.2832); ctx.fill();
    };

    const drawRipples = (t) => {
      ripples.forEach((rp) => {
        const age = t - rp.t0; if (age < 0) return;
        const a = Math.exp(-age * 1.4) * 0.7;
        ctx.strokeStyle = rgba(rp.c, a); ctx.lineWidth = 1.2;
        const r = age * 240;
        ring(rp.x, rp.y, r, depth(rp.x + r, rp.y, t), 64); ctx.stroke();
      });
    };

    const drawSling = () => {
      if (!drag) return;
      const vx0 = (drag.x - drag.cx) * 0.06, vy0 = (drag.y - drag.cy) * 0.06;
      const t = performance.now() / 1000;
      // the band, on the sheet
      const a = project(drag.x, drag.y, depth(drag.x, drag.y, t)), b = project(drag.cx, drag.cy, depth(drag.cx, drag.cy, t));
      ctx.strokeStyle = "rgba(233,210,154,0.85)"; ctx.setLineDash([4, 5]); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#E9D29A"; ctx.beginPath(); ctx.arc(a[0], a[1], 4, 0, 6.2832); ctx.fill();
      if (Math.hypot(drag.x - drag.cx, drag.y - drag.cy) < 6) return;
      // the forecast: where the note will go
      let x = drag.x, y = drag.y, vx = vx0, vy = vy0;
      for (let k = 0; k < 150; k++) {
        for (let s = 0; s < 3; s++) { const p = pull(x, y); vx += p.ax / 3; vy += p.ay / 3; x += vx / 3; y += vy / 3; if (p.nr < 14) { k = 999; break; } }
        if (outside(x, y)) break;
        if (k % 3 === 0) {
          const [px, py, s] = project(x, y, depth(x, y, t) + 4);
          ctx.fillStyle = `rgba(233,210,154,${0.7 * (1 - k / 150)})`;
          ctx.beginPath(); ctx.arc(px, py, 1.3 * s, 0, 6.2832); ctx.fill();
        }
      }
    };

    // the trace: every tone heard, scrolling left, high tones high
    const drawTrace = (t) => {
      const h = 40, y0 = H - h - 10, x0 = 14, w = W - 28, span = 14;
      const bg = ctx.createLinearGradient(0, y0, 0, y0 + h);
      bg.addColorStop(0, "rgba(5,6,18,0.55)"); bg.addColorStop(1, "rgba(5,6,18,0.8)");
      ctx.fillStyle = bg; ctx.fillRect(x0, y0, w, h);
      ctx.strokeStyle = "rgba(127,150,246,0.22)"; ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, y0 + 0.5, w - 1, h - 1);
      ctx.strokeStyle = "rgba(127,150,246,0.08)";
      for (let k = 1; k < 9; k++) { const yy = y0 + (k / 9) * h; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0 + w, yy); ctx.stroke(); }
      for (let k = 1; k < span; k++) { const xx = x0 + w - (k / span) * w; ctx.fillStyle = "rgba(127,150,246,0.18)"; ctx.fillRect(xx, y0 + h - 4, 1, 4); }
      trace.forEach((e) => {
        const age = t - e.t; if (age > span) return;
        const xx = x0 + w - (age / span) * (w - 6) - 3, yy = y0 + h - 4 - (e.k / 17) * (h - 10);
        ctx.fillStyle = rgba(e.c, Math.max(0.15, 1 - age / span));
        ctx.fillRect(xx - 1, yy, 2, y0 + h - yy - 2);
        ctx.beginPath(); ctx.arc(xx, yy, age < 0.4 ? 3.2 : 2, 0, 6.2832); ctx.fill();
      });
      ctx.fillStyle = "rgba(110,118,184,0.9)"; ctx.font = "9px 'JetBrains Mono', monospace"; ctx.fillText("TONES HEARD · 14 s", x0 + 8, y0 + 12);
    };

    const draw = () => {
      const t = performance.now() / 1000;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (sky) ctx.drawImage(sky, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // the horizon: where the sheet runs out into the dark
      const hy = project(0, V.v0, 0)[1];
      const hz = ctx.createLinearGradient(0, hy - 30, 0, hy + 60);
      hz.addColorStop(0, "rgba(127,150,246,0)"); hz.addColorStop(0.5, "rgba(127,150,246,0.07)"); hz.addColorStop(1, "rgba(127,150,246,0)");
      ctx.fillStyle = hz; ctx.fillRect(0, hy - 30, W, 90);
      stars.forEach((st) => { st.grow = Math.min(1, st.grow + 0.03); });
      drawSheet(t);
      ctx.globalCompositeOperation = "lighter";
      drawRipples(t);
      stars.forEach((st) => drawStar(st, t));
      notes.forEach((n) => drawNote(n, t));
      drawSling();
      ctx.globalCompositeOperation = "source-over";
      drawTrace(t);
    };
    const tick = () => { if (!reduced) step(); draw(); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      c.removeEventListener("pointerdown", down); c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", up); c.removeEventListener("pointercancel", up); c.removeEventListener("dblclick", dbl);
    };
  }, []);

  const tone = count.tone;
  return (
    <div className="lw">
      <div className="lw-stage">
        <canvas ref={cv} className="lw-canvas" aria-label="The Listening Well: drag to fling notes into orbit around the stars" />
        <div className="lw-frame" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="mono lw-hud">
          <div className="lw-hud-title"><span className="lw-live" /> Listening Well · gravity, translated</div>
          <div className="lw-hud-row">
            <span><b>{count.stars}</b> {count.stars === 1 ? "star" : "stars"}</span>
            <span><b>{count.notes}</b> {count.notes === 1 ? "note" : "notes"}</span>
            <span><b>{count.rings}</b> rings heard</span>
          </div>
        </div>
        <div className="mono lw-tone" aria-live="polite">
          {tone ? (
            <>
              <span className="lw-tone-k">last tone</span>
              <span className="lw-tone-v" style={{ color: tone.col }}>step {tone.step}<small>·{tone.oct}</small></span>
              <span className="lw-tone-k">{tone.hz} Hz</span>
            </>
          ) : (
            <span className="lw-tone-k">listening…</span>
          )}
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
          ? "Pull back and let go, like a sling: the dotted line shows where the note will fly. Close passes ring high, wide ones low. Double-click to add a star."
          : "Tap to set a star in the well (up to four). Then switch back and give them something to sing about."}
      </p>
    </div>
  );
}
