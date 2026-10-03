"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import LyraOrb from "./LyraOrb";
import SignalLogo from "./SignalLogo";
import { createBeforeSound } from "../lib/beforeSound";
import { markBeforeDone } from "../lib/beforeVisit";

// Assignment 0000000 - Before (Update 5.54). A first visit's first piece of
// 13i: nothing, then something that answers your pull (explore), then
// several somethings to bring together (play), then a few of your own
// set in orbit (create), then you hold it all close and let go - and the
// Big Bang comes from what you made: from where your star was, in your
// colours, with your seeds flung out as its arms. Your star's light
// becomes the 13i eye; Lyra is the first thing born; she welcomes you.
// Then /launch, where your First Assignment is waiting.
//
// One canvas and a little React for the words. No physics engine, no
// backend - a beautiful illusion, deliberately simple (docs/BEFORE.md).
// Who sees it and when: lib/beforeVisit.js. The sound: lib/beforeSound.js.

const LAV = [185, 192, 255];
const PERI = [139, 149, 246];
const ROSE = [232, 207, 192];
const GOLD = [233, 210, 154];
const EYE = [120, 170, 255];
const WHITE = [255, 248, 236];
const BANDS = [GOLD, ROSE, PERI]; // close to the star -> far from it
const LOGO_RATIO = 887 / 1774;
const EYE_AT = { x: 0.748, y: 0.292 };

const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a))})`;
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t].map(Math.round);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (t) => t * t * (3 - 2 * t);
const moteR = (m) => 2.2 + 1.9 * Math.sqrt(m);

function rngFrom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Before() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const holdRingRef = useRef(null);
  const S = useRef(null);
  const sound = useRef(null);
  const timers = useRef([]);
  const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); return id; };

  const [phase, setPhase] = useState("title");
  const [titleStep, setTitleStep] = useState(0);
  const [cap, setCap] = useState({ text: "", kind: "serif", on: false });
  const [hint, setHint] = useState({ text: "", on: false });
  const [seeds, setSeeds] = useState([]);
  const [showHold, setShowHold] = useState(false);
  const [welcome, setWelcome] = useState(0);
  const [eye, setEye] = useState(null); // { x, y } where it all began
  const [universe, setUniverse] = useState(null);
  const [muted, setMuted] = useState(false);
  const [chrome, setChrome] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [vw, setVw] = useState(1000);

  // ---- words ----
  const capTimer = useRef(null);
  const say = useCallback((text, kind = "serif") => {
    clearTimeout(capTimer.current);
    setCap((c) => ({ ...c, on: false }));
    capTimer.current = setTimeout(() => setCap({ text, kind, on: true }), 700);
  }, []);
  const hush = useCallback(() => { clearTimeout(capTimer.current); setCap((c) => ({ ...c, on: false })); }, []);
  const hintTimer = useRef(null);
  const nudge = useCallback((text) => {
    clearTimeout(hintTimer.current);
    setHint((h) => ({ ...h, on: false }));
    if (text) hintTimer.current = setTimeout(() => setHint({ text, on: true }), 500);
  }, []);

  // ---- the title: sparse, one line at a time ----
  useEffect(() => {
    const steps = [700, 1900, 3300, 4700, 6000];
    const ids = steps.map((ms, i) => setTimeout(() => setTitleStep(i + 1), ms));
    return () => ids.forEach(clearTimeout);
  }, []);

  // ---- the world ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = {
      phase: "title", t: 0, w: 0, h: 0, dpr: 1, reduce,
      ptr: { x: 0, y: 0, active: false, down: false, last: -1e9, touch: false },
      dust: [], ripples: [], level: 0,
      pt: null, explore: 0, idle: 0, hinted: 0, flare: 0, trail: [],
      motes: [], merges: 0, G: 0.006,
      star: null, seeds: [], grow: null, lastSeedAt: 0,
      hold: 0, holding: false,
      bang: null, emit: null,
    };
    S.current = st;
    if (/[?&]beforedebug/.test(window.location.search)) window.__before = st; // testing aid

    const size = () => {
      const ow = st.w, oh = st.h;
      st.dpr = Math.min(2, window.devicePixelRatio || 1);
      st.w = window.innerWidth; st.h = window.innerHeight;
      canvas.width = Math.round(st.w * st.dpr); canvas.height = Math.round(st.h * st.dpr);
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      setVw(st.w);
      if (ow && oh) {
        const sx = st.w / ow, sy = st.h / oh;
        const scale = (o) => { if (o) { o.x *= sx; o.y *= sy; } };
        st.dust.forEach(scale); scale(st.pt); st.motes.forEach(scale); scale(st.star);
        if (st.star) { st.star.tx = st.w / 2; st.star.ty = centerY(); }
        st.seeds.forEach((s) => { s.r *= Math.min(sx, sy); });
      }
    };
    const centerY = () => st.h * 0.38;
    const minDim = () => Math.min(st.w, st.h);
    size();
    window.addEventListener("resize", size);

    // almost-nothing: faint dust that is barely there
    const rnd = Math.random;
    st.dust = Array.from({ length: reduce ? 40 : 90 }, () => ({
      x: rnd() * st.w, y: rnd() * st.h, a: 0.03 + rnd() * 0.1, r: 0.4 + rnd() * 0.8,
      vx: (rnd() - 0.5) * 0.05, vy: (rnd() - 0.5) * 0.05, ph: rnd() * 6.28,
    }));

    // ---- input: mouse hover, touch, pen, keyboard ----
    const at = (e) => { st.ptr.x = e.clientX; st.ptr.y = e.clientY; st.ptr.last = performance.now(); };
    const down = (e) => {
      at(e); st.ptr.down = true; st.ptr.active = true; st.ptr.touch = e.pointerType !== "mouse";
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      if (st.phase === "create") startSeed();
    };
    const move = (e) => {
      at(e);
      if (e.pointerType === "mouse") { st.ptr.active = true; st.ptr.touch = false; }
      if (st.grow) { st.grow.dx = e.clientX - st.grow.x0; st.grow.dy = e.clientY - st.grow.y0; }
    };
    const up = (e) => {
      st.ptr.down = false;
      if (e.pointerType !== "mouse") st.ptr.active = false;
      if (st.grow) releaseSeed();
    };
    const leave = (e) => { if (e.pointerType === "mouse") st.ptr.active = false; };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", leave);
    const key = (e) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        if ((e.key === "Enter" || e.key === " ") && st.phase === "create" && document.activeElement === document.body) {
          e.preventDefault();
          const a = rnd() * 6.28, d = 60 + rnd() * 80;
          st.ptr.x = st.star.x + Math.cos(a) * d; st.ptr.y = st.star.y + Math.sin(a) * d;
          startSeed(); st.grow.t0 -= 900; releaseSeed();
        }
        return;
      }
      if (!["explore", "found", "play"].includes(st.phase)) return;
      e.preventDefault();
      if (!st.ptr.active) { st.ptr.x = st.w / 2; st.ptr.y = st.h / 2; }
      const step = 22;
      if (e.key === "ArrowUp") st.ptr.y -= step;
      if (e.key === "ArrowDown") st.ptr.y += step;
      if (e.key === "ArrowLeft") st.ptr.x -= step;
      if (e.key === "ArrowRight") st.ptr.x += step;
      st.ptr.x = clamp(st.ptr.x, 0, st.w); st.ptr.y = clamp(st.ptr.y, 0, st.h);
      st.ptr.active = true; st.ptr.last = performance.now();
    };
    window.addEventListener("keydown", key);

    const ptrLive = (now) => st.ptr.active && (st.ptr.touch ? st.ptr.down : now - st.ptr.last < 2500);

    // ---- create: seeds of your own ----
    const ring = () => {
      const c = st.star;
      const maxR = Math.max(90, Math.min(0.42 * minDim(), c.y - 30, st.h - c.y - 150, st.w / 2 - 18));
      return { minR: 34, maxR };
    };
    const bandAt = (d) => {
      const { minR, maxR } = ring();
      const f = (d - minR) / (maxR - minR);
      return f < 1 / 3 ? 0 : f < 2 / 3 ? 1 : 2;
    };
    const placeAt = (x, y) => {
      const c = st.star, { minR, maxR } = ring();
      let dx = x - c.x, dy = y - c.y; let d = Math.hypot(dx, dy) || 1;
      const nd = clamp(d, minR, maxR);
      return { x: c.x + (dx / d) * nd, y: c.y + (dy / d) * nd, d: nd };
    };
    function startSeed() {
      if (st.seeds.length >= 3 || st.grow) return;
      const p = placeAt(st.ptr.x, st.ptr.y);
      st.grow = { x: p.x, y: p.y, x0: st.ptr.x, y0: st.ptr.y, dx: 0, dy: 0, t0: performance.now(), band: bandAt(p.d) };
      st.emit("seedStart");
    }
    function releaseSeed() {
      const g = st.grow; st.grow = null;
      if (!g) return;
      const c = st.star;
      const held = (performance.now() - g.t0) / 1000;
      const m = 0.6 + 2.4 * clamp(held / 1.6, 0, 1);
      const r = Math.hypot(g.x - c.x, g.y - c.y);
      const th = Math.atan2(g.y - c.y, g.x - c.x);
      const drag = Math.hypot(g.dx, g.dy);
      let dir = 1;
      if (drag > 16) {
        const cross = (g.x - c.x) * g.dy - (g.y - c.y) * g.dx;
        dir = cross >= 0 ? 1 : -1;
      } else dir = st.seeds.length % 2 ? -1 : 1;
      const e = drag > 16 ? Math.min(0.32, drag / 380) : 0.04;
      st.seeds.push({ r, th, th0: th, e, dir, m, band: g.band, col: BANDS[g.band], born: st.t, trail: [] });
      st.flare = 0.6;
      st.lastSeedAt = st.t;
      sound.current && sound.current.seed(g.band);
      st.emit("seed", st.seeds.map((s) => s.band));
    }
    const seedPos = (s) => {
      const c = st.star;
      const p = s.r * (1 - s.e);
      const rr = p / (1 + s.e * Math.cos(s.th - s.th0 - Math.PI));
      return { x: c.x + Math.cos(s.th) * rr, y: c.y + Math.sin(s.th) * rr, rr };
    };

    // ---- drawing helpers ----
    const glow = (x, y, r, c, a) => {
      if (r <= 0 || a <= 0) return;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(c, a));
      g.addColorStop(0.35, rgba(c, a * 0.35));
      g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    };
    const dot = (x, y, r, c, a = 1) => { ctx.fillStyle = rgba(c, a); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); };
    const ripple = (x, y, max = 60, c = LAV, a = 0.35, life = 2.2) => st.ripples.push({ x, y, max, c, a, life, age: 0 });
    const trailLine = (pts, c, a, wdt = 1) => {
      for (let i = 1; i < pts.length; i++) {
        ctx.strokeStyle = rgba(c, (i / pts.length) * a);
        ctx.lineWidth = wdt;
        ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
      }
    };

    // ---- phase changes (called by the loop and by React) ----
    const go = (p) => { st.phase = p; st.t = 0; st.idle = 0; st.hinted = 0; st.emit("phase", p); };
    st.begin = () => {
      st.pt = { x: st.w * 0.5, y: st.h * 0.46, vx: 0, vy: 0, hx: st.w * 0.5, hy: st.h * 0.46 };
      ripple(st.pt.x, st.pt.y, 70, LAV, 0.5);
      go("explore");
    };
    const split = () => {
      const p = st.pt, n = 7;
      st.motes = Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 6.2832 + rnd() * 0.4;
        const sp = 4 + rnd() * 2.2;
        return { x: p.x, y: p.y, vx: Math.cos(a) * sp + p.vx * 0.3, vy: Math.sin(a) * sp + p.vy * 0.3, m: 1, col: i === 2 || i === 5 ? ROSE : LAV, flare: 0.8, trail: [] };
      });
      ripple(p.x, p.y, 120, LAV, 0.5, 1.6);
      st.pt = null;
      go("play");
    };
    st.letGo = () => { st.holding = false; };
    st.press = () => { st.holding = true; };

    const startBang = () => {
      const c = st.star;
      const seed = st.universeSeed || 1;
      const R = rngFrom(seed);
      const parts = [];
      const N = reduce ? 260 : 560;
      const weights = st.seeds.map((s) => s.m);
      const wsum = weights.reduce((a, b) => a + b, 0) || 1;
      const pickSeedCol = () => {
        let r = R() * wsum;
        for (let i = 0; i < st.seeds.length; i++) { r -= weights[i]; if (r <= 0) return st.seeds[i].col; }
        return LAV;
      };
      for (let i = 0; i < N; i++) {
        const a = R() * 6.2832, sp = 0.6 + 13 * Math.pow(R(), 1.7);
        const roll = R();
        const col = roll < 0.34 ? LAV : roll < 0.48 ? WHITE : roll < 0.56 ? PERI : pickSeedCol();
        parts.push({ x: c.x, y: c.y, px: c.x, py: c.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 0.5 + R() * 1.3, col, a: 0.5 + R() * 0.5, tw: 0.5 + R() * 2, ph: R() * 6.28 });
      }
      // your seeds become the universe's first arms, flung the way they were going
      st.seeds.forEach((s) => {
        const count = reduce ? 30 : 34 + Math.round(s.m * 14);
        const base = s.th + s.dir * 0.5;
        for (let i = 0; i < count; i++) {
          const a = base + (R() - 0.5) * 0.5 + (R() - 0.5) * 0.25;
          const sp = 3 + R() * 12;
          parts.push({ x: c.x, y: c.y, px: c.x, py: c.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 0.8 + R() * 1.5, col: s.col, a: 0.75 + R() * 0.25, tw: 0.4 + R() * 1.2, ph: R() * 6.28 });
        }
      });
      st.bang = { parts, x: c.x, y: c.y, rings: [0, 0.14, 0.42], eyeRip: 0 };
      sound.current && sound.current.bang();
      go("bang");
      st.emit("bang", { x: c.x, y: c.y });
    };

    // ---- the loop ----
    let last = performance.now(), raf;
    const frame = (now) => {
      const dtMs = Math.min(50, now - last); last = now;
      const f = dtMs / 16.67, dt = dtMs / 1000;
      st.t += dt;
      const W = st.w, H = st.h;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#03040B";
      ctx.fillRect(0, 0, W, H);

      // shake as the hold peaks
      let sx = 0, sy = 0;
      if (st.phase === "still" && st.hold > 0.75 && !reduce) {
        const k = Math.pow((st.hold - 0.75) / 0.25, 2) * 3;
        sx = (rnd() - 0.5) * k; sy = (rnd() - 0.5) * k;
      }
      ctx.save(); ctx.translate(sx, sy);
      ctx.globalCompositeOperation = "lighter";

      // dust
      if (st.phase !== "silence" && st.phase !== "bang") {
        const lvl = st.phase === "title" ? 0.55 : 0.7 + st.level * 0.6;
        st.dust.forEach((d) => {
          d.x += d.vx * f; d.y += d.vy * f;
          if (st.phase === "still" && st.star && st.hold > 0) {
            d.x += (st.star.x - d.x) * 0.018 * st.hold * f; d.y += (st.star.y - d.y) * 0.018 * st.hold * f;
          }
          if (d.x < -5) d.x = W + 5; if (d.x > W + 5) d.x = -5; if (d.y < -5) d.y = H + 5; if (d.y > H + 5) d.y = -5;
          dot(d.x, d.y, d.r, LAV, d.a * lvl * (0.7 + 0.3 * Math.sin(st.t * 0.6 + d.ph)));
        });
      }

      const live = ptrLive(now);

      // ---------- explore: one point that answers your pull ----------
      if ((st.phase === "explore" || st.phase === "found") && st.pt) {
        const p = st.pt, R = Math.max(210, 0.6 * minDim());
        let s = 0;
        if (live) {
          const dx = st.ptr.x - p.x, dy = st.ptr.y - p.y, d = Math.hypot(dx, dy) || 1;
          s = clamp(1 - d / R, 0, 1);
          const far = d < Math.max(W, H) * 1.2 ? 0.035 : 0;
          let a = far + 0.42 * s * s;
          if (d < 16) a *= d / 16;
          p.vx += (dx / d) * a * f; p.vy += (dy / d) * a * f;
          if (s > 0.2) st.explore += dt;
          st.idle = 0;
          sound.current && sound.current.pull(s, s);
        } else {
          p.vx += (p.hx - p.x) * 0.0007 * f; p.vy += (p.hy - p.y) * 0.0007 * f;
          st.idle += dt;
          sound.current && sound.current.pull(0);
        }
        p.vx *= Math.pow(0.97, f); p.vy *= Math.pow(0.97, f);
        const sp = Math.hypot(p.vx, p.vy); if (sp > 10) { p.vx *= 10 / sp; p.vy *= 10 / sp; }
        p.x = clamp(p.x + p.vx * f, 8, W - 8); p.y = clamp(p.y + p.vy * f, 8, H - 8);
        st.trail.push({ x: p.x, y: p.y }); if (st.trail.length > 34) st.trail.shift();

        // it calls out, softly, until someone answers
        p.rip = (p.rip || 0) + dt;
        if (p.rip > (s > 0.2 ? 1.1 : 2.6)) { p.rip = 0; ripple(p.x, p.y, 46 + s * 40, LAV, 0.28 + s * 0.2, 2); }

        const struct = clamp(st.explore / 2.8, 0, 1);
        // the tug between you and it
        if (s > 0.04) {
          const mx = (p.x + st.ptr.x) / 2 + (p.y - st.ptr.y) * 0.12, my = (p.y + st.ptr.y) / 2 - (p.x - st.ptr.x) * 0.12;
          ctx.strokeStyle = rgba(LAV, 0.16 * s); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(st.ptr.x, st.ptr.y); ctx.quadraticCurveTo(mx, my, p.x, p.y); ctx.stroke();
          ctx.strokeStyle = rgba(LAV, 0.22 * s);
          ctx.beginPath(); ctx.arc(st.ptr.x, st.ptr.y, 13 + Math.sin(st.t * 4) * 2, 0, 6.2832); ctx.stroke();
        }
        trailLine(st.trail, LAV, 0.35);
        const breathe = 0.5 + 0.5 * Math.sin(st.t * 2.2);
        glow(p.x, p.y, 20 + 26 * s + st.flare * 70 + breathe * 4, LAV, 0.5 + 0.3 * s + st.flare * 0.5);
        dot(p.x, p.y, 2.2 + struct * 1.4 + breathe * 0.4, WHITE, 0.95);
        // it has structure: a ring, then two companions
        if (struct > 0.25) {
          ctx.strokeStyle = rgba(LAV, (struct - 0.25) * 0.7); ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.arc(p.x, p.y, 8 + struct * 2, 0, 6.2832); ctx.stroke();
        }
        if (struct > 0.55) {
          const a = (struct - 0.55) / 0.45;
          for (let k = 0; k < 2; k++) {
            const ang = st.t * (2.4 + k * 0.7) + k * 3.14;
            dot(p.x + Math.cos(ang) * (13 + k * 4), p.y + Math.sin(ang) * (13 + k * 4) * 0.8, 1.1, k ? ROSE : LAV, a);
          }
        }

        if (st.phase === "explore") {
          if (st.explore === 0 && st.idle > 7 && st.hinted === 0) { st.hinted = 1; st.emit("hint", "it's listening."); }
          if (st.explore < 0.6 && st.t > 15 && st.idle > 4 && st.hinted === 1) { st.hinted = 2; st.emit("hint", st.ptr.touch || ("ontouchstart" in window) ? "touch the dark, and come closer." : "come closer."); }
          if (st.explore > 0.4 && st.hinted > 0 && st.hinted < 9) { st.hinted = 9; st.emit("hint", null); }
          if (st.explore >= 2.8) {
            st.flare = 1; ripple(p.x, p.y, 140, LAV, 0.6, 1.8);
            sound.current && sound.current.found();
            st.level = 0.15;
            go("found");
          }
        } else if (st.t > 3.6) split();
      }

      // ---------- play: bring them together ----------
      if (st.phase === "play") {
        const M = st.motes;
        if (st.t > 32) st.G = Math.min(0.06, st.G + 0.00012 * f);
        for (let i = 0; i < M.length; i++) {
          const a = M[i];
          for (let j = i + 1; j < M.length; j++) {
            const b = M[j];
            const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy + 300, d = Math.sqrt(d2);
            const k = (st.G * 100) / d2;
            a.vx += (dx / d) * k * b.m * f; a.vy += (dy / d) * k * b.m * f;
            b.vx -= (dx / d) * k * a.m * f; b.vy -= (dy / d) * k * a.m * f;
          }
          if (live) {
            // a moment to scatter first, then they feel you
            const dx = st.ptr.x - a.x, dy = st.ptr.y - a.y, d = Math.hypot(dx, dy) || 1;
            let k = (0.22 / (1 + d / 170)) * clamp((st.t - 1.8) / 2, 0, 1);
            if (d < 20) k *= d / 20;
            a.vx += (dx / d) * k * f; a.vy += (dy / d) * k * f;
          }
          if (st.t > 55) { a.vx += (W / 2 - a.x) * 0.0006 * f; a.vy += (H / 2 - a.y) * 0.0006 * f; }
        }
        let pullAmt = 0;
        M.forEach((a) => {
          a.vx *= Math.pow(0.991, f); a.vy *= Math.pow(0.991, f);
          const sp = Math.hypot(a.vx, a.vy); if (sp > 9) { a.vx *= 9 / sp; a.vy *= 9 / sp; }
          a.x += a.vx * f; a.y += a.vy * f;
          if (a.x < 12) { a.x = 12; a.vx = Math.abs(a.vx) * 0.6; }
          if (a.x > W - 12) { a.x = W - 12; a.vx = -Math.abs(a.vx) * 0.6; }
          if (a.y < 12) { a.y = 12; a.vy = Math.abs(a.vy) * 0.6; }
          if (a.y > H - 12) { a.y = H - 12; a.vy = -Math.abs(a.vy) * 0.6; }
          a.flare = Math.max(0, a.flare - dt * 1.4);
          a.trail.push({ x: a.x, y: a.y }); if (a.trail.length > 16) a.trail.shift();
          pullAmt = Math.max(pullAmt, live ? clamp(1 - Math.hypot(st.ptr.x - a.x, st.ptr.y - a.y) / 260, 0, 1) : 0);
        });
        sound.current && sound.current.pull(pullAmt * 0.7, 0.3 + st.merges / 8);
        // when two touch, they become one
        for (let i = 0; i < M.length; i++) for (let j = i + 1; j < M.length; j++) {
          const a = M[i], b = M[j];
          // a fast pass is a slingshot; only a gentle meeting holds
          if (Math.hypot(a.x - b.x, a.y - b.y) < (moteR(a.m) + moteR(b.m)) * 0.8 + 2 && (Math.hypot(a.vx - b.vx, a.vy - b.vy) < 3.2 || st.t > 45)) {
            const m = a.m + b.m;
            a.x = (a.x * a.m + b.x * b.m) / m; a.y = (a.y * a.m + b.y * b.m) / m;
            a.vx = (a.vx * a.m + b.vx * b.m) / m; a.vy = (a.vy * a.m + b.vy * b.m) / m;
            a.m = m; a.col = mix(LAV, GOLD, clamp((m - 1) / 6, 0, 1)); a.flare = 1;
            M.splice(j, 1); j--;
            st.merges += 1;
            ripple(a.x, a.y, 50 + m * 10, a.col, 0.5, 1.5);
            sound.current && sound.current.merge(st.merges);
            sound.current && sound.current.swell(st.merges / 6 * 0.4);
            st.level = 0.15 + st.merges * 0.06;
            st.emit("merge", st.merges);
          }
        }
        M.forEach((a) => {
          trailLine(a.trail, a.col, 0.3);
          glow(a.x, a.y, 10 + a.m * 5 + a.flare * 40, a.col, 0.45 + a.flare * 0.4);
          dot(a.x, a.y, moteR(a.m) * 0.55, WHITE, 0.9);
        });
        if (st.merges === 0 && st.t > 14 && st.hinted === 0) { st.hinted = 1; st.emit("hint", st.ptr.touch || ("ontouchstart" in window) ? "hold your finger still, and let them come." : "hold still, and let them come."); }
        if (M.length === 1) {
          const last = M[0];
          st.star = { x: last.x, y: last.y, vx: last.vx, vy: last.vy, m: 7, tx: W / 2, ty: centerY(), sx: last.x, sy: last.y };
          st.motes = [];
          sound.current && sound.current.pull(0);
          go("held");
        }
      }

      // ---------- the star: glide to the centre, then make something ----------
      if (st.star && ["held", "create", "still"].includes(st.phase)) {
        const c = st.star;
        if (st.phase === "held") {
          const k = ease(clamp(st.t / 2.4, 0, 1));
          c.x = c.sx + (c.tx - c.sx) * k; c.y = c.sy + (c.ty - c.sy) * k;
          if (st.t > 4.2) go("create");
        }
        // the seeds' tug makes the star wobble, slightly
        let wx = 0, wy = 0;
        const collapse = st.phase === "still" ? ease(st.hold) : 0;
        st.seeds.forEach((s) => {
          const kepler = Math.pow(s.r / (seedPos(s).rr || s.r), 2);
          s.th += s.dir * 0.62 * Math.pow(80 / s.r, 1.5) * kepler * dt * (1 + collapse * 5);
          const p = seedPos(s);
          const k = 1 - 0.95 * collapse;
          s.x = c.x + (p.x - c.x) * k; s.y = c.y + (p.y - c.y) * k;
          wx += (s.x - c.x) * s.m * 0.004; wy += (s.y - c.y) * s.m * 0.004;
          s.trail.push({ x: s.x, y: s.y }); if (s.trail.length > 40) s.trail.shift();
        });
        const cx = c.x + wx, cy = c.y + wy;

        if (st.phase === "create") {
          const { minR, maxR } = ring();
          // where you place it decides what it becomes: warm close in, cool far out
          [minR, minR + (maxR - minR) / 3, minR + (2 * (maxR - minR)) / 3, maxR].forEach((r, i) => {
            ctx.strokeStyle = rgba(i === 0 ? GOLD : i === 1 ? ROSE : PERI, 0.05 + (st.seeds.length < 3 ? 0.02 : 0));
            ctx.lineWidth = 1; ctx.setLineDash([2, 6]);
            ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 6.2832); ctx.stroke();
          });
          ctx.setLineDash([]);
          // a ghost of what you'd make, under your cursor
          if (!st.grow && st.seeds.length < 3 && live && !st.ptr.touch) {
            const p = placeAt(st.ptr.x, st.ptr.y);
            const col = BANDS[bandAt(p.d)];
            ctx.strokeStyle = rgba(col, 0.45); ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 6.2832); ctx.stroke();
            glow(p.x, p.y, 14, col, 0.12);
          }
          if (st.grow) {
            const g = st.grow, held = (now - g.t0) / 1000, m = 0.6 + 2.4 * clamp(held / 1.6, 0, 1);
            const col = BANDS[g.band];
            glow(g.x, g.y, 10 + m * 9 + Math.sin(st.t * 10) * 2, col, 0.7);
            dot(g.x, g.y, moteR(m) * 0.5, WHITE, 0.95);
            ctx.strokeStyle = rgba(col, 0.5); ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(g.x, g.y, 9 + m * 4, -1.5708, -1.5708 + 6.2832 * clamp(held / 1.6, 0, 1)); ctx.stroke();
            sound.current && sound.current.pull(0.7, m / 3);
          } else sound.current && sound.current.pull(0);
          if (st.seeds.length === 0 && st.t > 6 && st.hinted === 0) { st.hinted = 1; st.emit("hint", st.ptr.touch || ("ontouchstart" in window) ? "touch the dark. hold, to give it weight." : "click in the dark. hold, to give it weight."); }
          if (st.seeds.length > 0 && st.hinted === 1) { st.hinted = 2; st.emit("hint", null); }
          if (st.seeds.length > 0 && !st.grow && (st.seeds.length >= 3 ? st.t - st.lastSeedAt > 2.6 : st.t - st.lastSeedAt > 9)) {
            // its own number: from where you put things, how heavy, which way they turn
            let h = 2166136261;
            st.seeds.forEach((s) => {
              [Math.round((s.r / minDim()) * 1000), Math.round(((s.th0 + 6.2832) % 6.2832) * 100), Math.round(s.m * 10), s.band, s.dir].forEach((v) => {
                h ^= v & 0xffff; h = Math.imul(h, 16777619) >>> 0;
              });
            });
            st.universeSeed = h || 1;
            st.universe = 1000000 + (h % 9000000);
            st.emit("universe", st.universe);
            go("still");
          }
        }

        // the seeds, their paths, their trails
        st.seeds.forEach((s) => {
          if (st.phase === "create") {
            ctx.strokeStyle = rgba(s.col, 0.07); ctx.lineWidth = 1;
            ctx.beginPath();
            for (let k = 0; k <= 64; k++) {
              const th = (k / 64) * 6.2832, p = s.r * (1 - s.e), rr = p / (1 + s.e * Math.cos(th - s.th0 - Math.PI));
              const x = c.x + Math.cos(th) * rr, y = c.y + Math.sin(th) * rr;
              k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
            }
            ctx.stroke();
          }
          trailLine(s.trail, s.col, 0.45);
          const fresh = clamp(1 - (st.t - s.born) / 1.2, 0, 1) * (st.phase === "create" ? 1 : 0);
          glow(s.x, s.y, 8 + s.m * 6 + fresh * 20, s.col, 0.6);
          dot(s.x, s.y, moteR(s.m) * 0.45 * (1 - collapse * 0.5), WHITE, 0.95);
        });

        // the star itself: gold, warming to the eye's blue as you hold it close
        const starCol = mix(GOLD, EYE, clamp(collapse * 1.4, 0, 1));
        const pulse = 0.5 + 0.5 * Math.sin(st.t * 1.8);
        glow(cx, cy, 30 + pulse * 6 + collapse * 70 + st.flare * 30, starCol, 0.55 + collapse * 0.4);
        dot(cx, cy, 5 + collapse * 2, WHITE, 1);
        if (st.phase === "held" && st.t < 0.1) ripple(cx, cy, 120, GOLD, 0.5, 1.8);

        if (st.phase === "still") {
          if (st.holding) st.hold = Math.min(1, st.hold + dt / 2.4);
          else st.hold = Math.max(0, st.hold - dt / 1.2);
          sound.current && sound.current.hold(st.hold);
          if (holdRingRef.current) holdRingRef.current.style.setProperty("--p", String(st.hold));
          if (st.hold >= 1) {
            st.holding = false;
            sound.current && sound.current.silence();
            go("silence");
          }
        }
      }

      // ---------- the first silence ----------
      if (st.phase === "silence") {
        const c = st.star;
        dot(c.x, c.y, 1.4, WHITE, st.t < 0.15 ? 1 - st.t / 0.15 * 0.5 : 0.5 + 0.5 * Math.sin(st.t * 9));
        if (st.t > 1.0) startBang();
      }

      // ---------- the Big Bang, from your star ----------
      if (st.phase === "bang" && st.bang) {
        const b = st.bang, t = st.t;
        const drag = t < 1.4 ? 0.982 : 0.93;
        b.parts.forEach((p) => {
          p.px = p.x; p.py = p.y;
          p.vx *= Math.pow(drag, f); p.vy *= Math.pow(drag, f);
          p.x += p.vx * f; p.y += p.vy * f;
          const tw = t > 2 ? 0.7 + 0.3 * Math.sin(t * p.tw + p.ph) : 1;
          const fade = t > 2 ? 0.75 : 1;
          if (t < 1.8 && !reduce) {
            ctx.strokeStyle = rgba(p.col, p.a * tw);
            ctx.lineWidth = p.r * 1.2;
            ctx.beginPath(); ctx.moveTo(p.px - p.vx * 1.5, p.py - p.vy * 1.5); ctx.lineTo(p.x, p.y); ctx.stroke();
          } else dot(p.x, p.y, p.r, p.col, p.a * tw * fade);
        });
        // shock rings, like the eye's ripples, but enormous
        b.rings.forEach((t0) => {
          const age = t - t0;
          if (age < 0 || age > 2) return;
          ctx.strokeStyle = rgba(LAV, 0.5 * (1 - age / 2)); ctx.lineWidth = 2 * (1 - age / 2) + 0.5;
          ctx.beginPath(); ctx.arc(b.x, b.y, age * Math.max(W, H) * 0.75, 0, 6.2832); ctx.stroke();
        });
        // the bloom at the heart of it
        glow(b.x, b.y, Math.max(W, H) * (0.25 + Math.min(t, 1.2) * 0.5), WHITE, Math.max(0, 0.85 - t * 0.7));
        // its light gathers into an eye
        if (t > 1.5) {
          const k = clamp((t - 1.5) / 1.4, 0, 1) * (t > 4.6 ? clamp(1 - (t - 4.6) / 1.2, 0, 1) : 1);
          glow(b.x, b.y, 34 + 6 * Math.sin(t * 2), EYE, 0.7 * k);
          dot(b.x, b.y, 3.5, WHITE, k);
          b.eyeRip += dt;
          if (b.eyeRip > 1.3 && t < 4.6) { b.eyeRip = 0; ripple(b.x, b.y, 80, [170, 215, 255], 0.5 * k, 2.4); }
        }
        if (t < 0.22 && !reduce) {
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = rgba(WHITE, 0.8 * (1 - t / 0.22));
          ctx.fillRect(-10, -10, W + 20, H + 20);
          ctx.globalCompositeOperation = "lighter";
        }
      }

      // ripples
      st.ripples = st.ripples.filter((r) => (r.age += dt) < r.life);
      st.ripples.forEach((r) => {
        const k = r.age / r.life;
        ctx.strokeStyle = rgba(r.c, r.a * (1 - k)); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(r.x, r.y, 4 + r.max * ease(k), 0, 6.2832); ctx.stroke();
      });

      st.flare = Math.max(0, st.flare - dt * 0.8);
      ctx.restore();

      // the dark presses in as you hold it close
      if (st.phase === "still" && st.hold > 0 && st.star) {
        ctx.globalCompositeOperation = "source-over";
        const g = ctx.createRadialGradient(st.star.x, st.star.y, 40, st.star.x, st.star.y, Math.max(W, H) * 0.7);
        g.addColorStop(0, "rgba(3,4,11,0)");
        g.addColorStop(1, `rgba(3,4,11,${0.85 * ease(st.hold)})`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("keydown", key);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("pointerleave", leave);
    };
  }, []);

  // ---- what the world tells the words ----
  useEffect(() => {
    if (!S.current) return;
    S.current.emit = (ev, data) => {
      if (ev === "phase") {
        setPhase(data);
        if (data === "found") { nudge(null); say("You found the force."); }
        if (data === "play") later(() => say("What happens if you bring them together?"), 1400);
        if (data === "held") { nudge(null); say("It holds."); later(() => say("Now make something of your own."), 2600); }
        if (data === "create") setSeeds([]);
        if (data === "still") { nudge(null); hush(); later(() => setShowHold(true), 1600); }
        if (data === "silence") { setShowHold(false); hush(); setChrome(false); }
      }
      if (ev === "hint") nudge(data);
      if (ev === "merge" && data === 1) later(() => hush(), 2600);
      if (ev === "seed") setSeeds(data);
      if (ev === "universe") setUniverse(data);
      if (ev === "bang") {
        setEye(data);
        const steps = [3000, 5000, 6400, 8400, 10800, 12800];
        steps.forEach((ms, i) => later(() => setWelcome(i + 1), ms));
        later(() => sound.current && sound.current.chime(), 3100);
      }
    };
  });

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    clearTimeout(capTimer.current); clearTimeout(hintTimer.current);
    if (sound.current) sound.current.stop();
  }, []);

  const begin = () => {
    if (phase !== "title") return;
    const snd = createBeforeSound();
    snd.start();
    sound.current = snd;
    setPhase("explore");
    S.current && S.current.begin();
    later(() => setChrome(true), 4000);
  };

  const enter = async (skipped) => {
    if (leaving) return;
    setLeaving(true);
    if (sound.current) sound.current.fadeOut(1.4);
    await Promise.all([markBeforeDone(skipped ? null : (S.current && S.current.universe) || universe), new Promise((r) => setTimeout(r, 1200))]);
    router.push("/launch");
  };

  const toggleSound = () => {
    const m = !muted; setMuted(m);
    if (sound.current) sound.current.setMuted(m);
  };

  const holdOn = (e) => { e.preventDefault(); S.current && S.current.press(); };
  const holdOff = () => { S.current && S.current.letGo(); };

  // where the logo sits: its eye exactly where your star was, then drifting
  // to the centre of the page as everything settles
  const LW = Math.min(280, vw * 0.62);
  const LH = LW * LOGO_RATIO;
  const logoTop = eye ? eye.y - EYE_AT.y * LH : 0;
  const logoLeft = eye ? (welcome >= 2 ? (vw - LW) / 2 : eye.x - EYE_AT.x * LW) : 0;

  return (
    <div className={`before${leaving ? " before-leaving" : ""}`}>
      <canvas ref={canvasRef} className="before-canvas" aria-hidden="true" />

      {phase === "title" && (
        <div className="before-title">
          <div className={`mono before-num${titleStep >= 1 ? " on" : ""}`}>ASSIGNMENT 0000000</div>
          <h1 className={`before-name${titleStep >= 2 ? " on" : ""}`}>Before</h1>
          <p className={`before-line${titleStep >= 3 ? " on" : ""}`}>Before there was a universe, there was silence.</p>
          <p className={`before-line${titleStep >= 4 ? " on" : ""}`}>Your assignment is to begin.</p>
          <div className={`before-begin-wrap${titleStep >= 5 ? " on" : ""}`}>
            <button type="button" className="launch-begin before-begin" onClick={begin} disabled={titleStep < 5}>begin</button>
            <div className="mono before-sound-note">best with sound</div>
          </div>
        </div>
      )}

      <div className={`before-cap before-cap-${cap.kind}${cap.on ? " on" : ""}`} aria-live="polite">{cap.text}</div>
      <div className={`mono before-hint${hint.on ? " on" : ""}`} aria-live="polite">{hint.text}</div>

      {phase === "create" && (
        <div className="before-seeds" aria-label={`${seeds.length} of 3 made`}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={seeds[i] !== undefined ? { background: rgba(BANDS[seeds[i]], 0.9), borderColor: rgba(BANDS[seeds[i]], 0.9) } : undefined} />
          ))}
        </div>
      )}

      {showHold && phase === "still" && (
        <div className="before-hold-wrap">
          <button
            type="button"
            ref={holdRingRef}
            className="before-hold"
            onPointerDown={holdOn}
            onPointerUp={holdOff}
            onPointerLeave={holdOff}
            onPointerCancel={holdOff}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); S.current && S.current.press(); } }}
            onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") holdOff(); }}
            aria-label="Hold to let it expand"
          >
            <span className="before-hold-core" />
          </button>
          <div className="mono before-hold-label">hold &middot; let it expand</div>
        </div>
      )}

      {eye && (
        <div className="before-welcome">
          <div
            className={`before-logo${welcome >= 1 ? " on" : ""}`}
            style={{ width: LW, left: logoLeft, top: logoTop }}
            aria-hidden="true"
          >
            <SignalLogo />
          </div>
          <div className="before-welcome-col" style={{ top: logoTop + LH + 22 }}>
            <div className={`before-lyra${welcome >= 3 ? " on" : ""}`} aria-hidden="true">
              {welcome >= 3 && <LyraOrb stage={4} state="celebrating" size={72} />}
            </div>
            <p className={`before-welcome-line${welcome >= 4 ? " on" : ""}`}>You were here at the beginning.</p>
            <p className={`before-welcome-kin${welcome >= 5 ? " on" : ""}`}>Welcome, Kin.</p>
            <div className={`before-enter${welcome >= 6 ? " on" : ""}`}>
              {universe && <div className="mono before-universe">universe no. {universe} &middot; yours</div>}
              <button type="button" className="mono launch-enter before-enter-btn" onClick={() => enter(false)} disabled={welcome < 6}>enter 13i &rarr;</button>
            </div>
          </div>
        </div>
      )}

      {chrome && !eye && (
        <>
          <button type="button" className="mono before-chrome before-mute" onClick={toggleSound}>{muted ? "sound off" : "sound on"}</button>
          <button type="button" className="mono before-chrome before-skip" onClick={() => enter(true)}>enter 13i</button>
        </>
      )}
      {eye && welcome >= 1 && (
        <button type="button" className="mono before-chrome before-mute" onClick={toggleSound}>{muted ? "sound off" : "sound on"}</button>
      )}
    </div>
  );
}
