"use client";

import { useEffect, useRef } from "react";

// The living backdrop for Interactive Assignments: everything is drawn in
// code on a <canvas> (no image files, no service), so a scene can react to
// the story - limbs light up when they speak, the network dies, the city
// relights. Scenes cross-fade into each other.
//
// Props:
//   scene  "orbit" | "descent" | "structures" | "creature" | "city" | "child"
//          | "failing" | "rupture" | "elder" | "light" | "dark"
//   focus  limb numbers (1-16) to light, warm, on the creature
//   pose   "reach" (focused limbs reach toward 13i) | "touch" (they curl back
//          to touch their own body) | undefined

const FADE_MS = 1400;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- fixed layouts, generated once ----
function makeWorld() {
  const r = rng(215783);
  const stars = Array.from({ length: 220 }, () => ({ x: r(), y: r(), s: r() * 1.4 + 0.2, p: r() * 6.28 }));
  const snow = Array.from({ length: 140 }, () => ({ x: r(), y: r(), s: r() * 1.6 + 0.4, v: r() * 0.6 + 0.2, p: r() * 6.28 }));
  const towers = Array.from({ length: 26 }, (_, i) => {
    const depth = r();
    return {
      x: (i + r() * 0.8) / 26,
      w: 0.012 + r() * 0.03 * (1 - depth * 0.5),
      h: 0.18 + r() * 0.55 * (1 - depth * 0.4),
      depth,
      lights: Array.from({ length: 4 + Math.floor(r() * 7) }, () => ({ y: r(), p: r() * 6.28, die: r() })),
      cap: r() < 0.4,
    };
  }).sort((a, b) => b.depth - a.depth);
  const conduits = Array.from({ length: 5 }, (_, i) => ({
    y: 0.74 + i * 0.05 + r() * 0.02,
    amp: 0.01 + r() * 0.025,
    freq: 1 + r() * 2,
    phase: r() * 6.28,
    speed: 0.05 + r() * 0.06,
    pulses: Array.from({ length: 3 + Math.floor(r() * 3) }, () => r()),
    die: (i + 0.5) / 5,
  }));
  const swimmers = Array.from({ length: 9 }, () => ({ x: r(), y: 0.25 + r() * 0.4, s: 0.4 + r() * 0.6, v: (r() - 0.5) * 0.02, p: r() * 6.28 }));
  const limbs = Array.from({ length: 16 }, (_, i) => ({
    phase: r() * 6.28,
    speed: 0.6 + r() * 0.5,
    len: 0.85 + r() * 0.3,
    hue: r(),
    scar: r() < 0.3,
  }));
  const specks = Array.from({ length: 40 }, () => ({ a: r() * 6.28, d: r() * 0.9, s: r() * 1.6 + 0.4 }));
  return { stars, snow, towers, conduits, swimmers, limbs, specks };
}

export default function InteractiveScene({ scene = "orbit", focus = [], pose }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ scene, prev: null, since: 0, focus, pose, sceneStart: 0, focusSince: 0 });

  // scene / focus changes feed the running animation without restarting it
  useEffect(() => {
    const s = stateRef.current;
    const now = performance.now();
    if (s.scene !== scene) {
      s.prev = s.scene;
      s.prevStart = s.sceneStart;
      s.scene = scene;
      s.since = now;
      s.sceneStart = now;
    }
    const key = (focus || []).join(",") + "|" + (pose || "");
    if (key !== s.focusKey) {
      s.focusKey = key;
      s.focusSince = now;
    }
    s.focus = focus || [];
    s.pose = pose;
  }, [scene, focus, pose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const world = makeWorld();
    const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeScale = reduced ? 0.2 : 1;
    let raf = 0;
    let W = 0, H = 0, dpr = 1;
    const start = performance.now();
    stateRef.current.sceneStart = start;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };
    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    // ---------- drawing helpers ----------
    let base = 1; // alpha of the scene currently being drawn (cross-fades)
    const A = (a) => { ctx.globalAlpha = Math.max(0, Math.min(1, a * base)); };

    // soft lights are pre-drawn once per colour and stamped - hundreds per
    // frame stay cheap on phones
    const sprites = {};
    function sprite(color) {
      if (sprites[color]) return sprites[color];
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g2 = c.getContext("2d");
      const g = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, color);
      g.addColorStop(0.35, color.replace(/[\d.]+\)$/, (m) => `${parseFloat(m) * 0.45})`));
      g.addColorStop(1, "rgba(0,0,0,0)");
      g2.fillStyle = g;
      g2.fillRect(0, 0, 64, 64);
      sprites[color] = c;
      return c;
    }
    function glow(x, y, r, color, a = 1) {
      if (r <= 0.5 || a <= 0.005) return;
      A(a);
      ctx.drawImage(sprite(color), x - r, y - r, r * 2, r * 2);
    }

    function water(top, bottom) {
      A(1);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, top);
      g.addColorStop(1, bottom);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    function snow(t, drift = -1, a = 0.5) {
      ctx.fillStyle = "#B9C0FF";
      world.snow.forEach((p) => {
        const y = (((p.y + drift * t * 0.02 * p.v) % 1) + 1) % 1;
        const x = p.x + Math.sin(t * 0.3 + p.p) * 0.004;
        A(a * (0.3 + 0.7 * Math.abs(Math.sin(t * 0.5 + p.p))));
        ctx.fillRect(x * W, y * H, p.s, p.s);
      });
    }

    function shafts(t, a = 0.08) {
      for (let i = 0; i < 5; i++) {
        const x = W * (0.15 + i * 0.18) + Math.sin(t * 0.15 + i) * W * 0.03;
        A(a * (0.6 + 0.4 * Math.sin(t * 0.4 + i * 2)));
        const g = ctx.createLinearGradient(0, 0, 0, H * 0.8);
        g.addColorStop(0, "rgba(160,190,255,0.9)");
        g.addColorStop(1, "rgba(160,190,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x - W * 0.02, 0);
        ctx.lineTo(x + W * 0.02, 0);
        ctx.lineTo(x + W * 0.09, H * 0.8);
        ctx.lineTo(x - W * 0.03, H * 0.8);
        ctx.fill();
      }
    }

    // the 13i manifestation: the ring-eye mark, glowing
    function mark(x, y, s, t, a = 1) {
      glow(x, y, s * 3.2, "rgba(139,149,246,0.45)", a * (0.6 + 0.2 * Math.sin(t * 1.6)));
      A(a);
      ctx.strokeStyle = "#B9C0FF";
      ctx.lineWidth = Math.max(1.2, s * 0.14);
      ctx.beginPath();
      ctx.arc(x, y, s, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + s);
      ctx.lineTo(x, y + s * 2.1);
      ctx.stroke();
      ctx.fillStyle = "#E8CFC0";
      ctx.beginPath();
      ctx.arc(x, y, s * 0.32, 0, Math.PI * 2);
      ctx.fill();
      // a slow ping, like a sensor sweep
      const ping = (t * 0.5) % 1;
      A(a * (1 - ping) * 0.5);
      ctx.strokeStyle = "#8B95F6";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, s * (1.2 + ping * 4), 0, Math.PI * 2);
      ctx.stroke();
    }

    function towers(t, { lit = 1, dieAt = null, scale = 1, warm = 0 } = {}) {
      world.towers.forEach((tw) => {
        const x = tw.x * W;
        const h = tw.h * H * scale;
        const w = Math.max(6, tw.w * W);
        const yb = H * 0.86;
        const shade = 0.25 + (1 - tw.depth) * 0.55;
        A(shade);
        const g = ctx.createLinearGradient(0, yb - h, 0, yb);
        g.addColorStop(0, "#1d2563");
        g.addColorStop(1, "#090b22");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x - w * 0.5, yb);
        ctx.quadraticCurveTo(x - w * 0.25, yb - h * 0.6, x - w * 0.12, yb - h);
        ctx.lineTo(x + w * 0.12, yb - h);
        ctx.quadraticCurveTo(x + w * 0.25, yb - h * 0.6, x + w * 0.5, yb);
        ctx.fill();
        if (tw.cap) {
          ctx.beginPath();
          ctx.ellipse(x, yb - h * 0.82, w * 1.3, w * 0.28, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        tw.lights.forEach((l) => {
          let on = lit;
          if (dieAt !== null) on *= l.die > dieAt ? 1 : Math.max(0, (l.die - dieAt + 0.08) / 0.08);
          if (on <= 0.01) return;
          const ly = yb - h * (0.1 + l.y * 0.85);
          const flick = 0.6 + 0.4 * Math.sin(t * 2 + l.p);
          const col = warm > 0.5 && l.die < 0.3 ? "rgba(232,207,192,0.9)" : "rgba(185,192,255,0.9)";
          glow(x, ly, 6 + (1 - tw.depth) * 6, col, on * flick * (0.4 + (1 - tw.depth) * 0.6));
        });
      });
    }

    function conduits(t, { live = 1, dieAt = null, red = 0 } = {}) {
      world.conduits.forEach((c) => {
        const alive = dieAt === null ? 1 : c.die > dieAt ? 1 : 0;
        const pts = [];
        for (let i = 0; i <= 40; i++) {
          const u = i / 40;
          pts.push([u * W, (c.y + Math.sin(u * 6.28 * c.freq + c.phase) * c.amp) * H]);
        }
        A(0.55);
        ctx.strokeStyle = "#232a66";
        ctx.lineWidth = 3;
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.stroke();
        if (!alive || live <= 0) return;
        c.pulses.forEach((p0) => {
          const u = (p0 + t * c.speed) % 1;
          const idx = u * 40;
          const a = pts[Math.floor(idx)];
          const b = pts[Math.min(40, Math.floor(idx) + 1)];
          const f = idx - Math.floor(idx);
          const x = a[0] + (b[0] - a[0]) * f;
          const y = a[1] + (b[1] - a[1]) * f;
          const col = red > 0 && (p0 * 10) % 1 < red ? "rgba(201,123,110,0.95)" : "rgba(185,192,255,0.95)";
          glow(x, y, 14, col, live * 0.9);
        });
      });
    }

    // ---- the Nerathi ----
    // limbs are numbered 1-16 clockwise from straight up
    function creature(cx, cy, R, t, { focus = [], focusAge = 9, pose, old = false, reachTo = null, a = 1 } = {}) {
      const anyFocus = focus.length > 0;
      const ease = Math.min(1, focusAge / 1.1);
      const drawLimb = (i) => {
        const L = world.limbs[i];
        const n = i + 1;
        const focused = focus.includes(n);
        const ang0 = -Math.PI / 2 + (i / 16) * Math.PI * 2;
        let len = R * 3.1 * L.len * (old && L.scar ? 0.62 : 1);
        const segs = 18;
        let x = cx + Math.cos(ang0) * R * 0.85;
        let y = cy + Math.sin(ang0) * R * 0.75;
        let ang = ang0;
        const pts = [[x, y]];
        if (focused && pose === "touch") len *= 1 - 0.25 * ease;
        let reachAng = null;
        if (focused && pose === "reach" && reachTo) {
          reachAng = Math.atan2(reachTo[1] - y, reachTo[0] - x);
          const dist = Math.hypot(reachTo[0] - x, reachTo[1] - y);
          len = len + (dist * 0.97 - len) * ease;
        }
        for (let k = 1; k <= segs; k++) {
          const u = k / segs;
          let wave = Math.sin(t * L.speed + L.phase + u * 3.2) * 0.42 * u;
          let curl = 0;
          if (focused && pose === "touch") {
            // arc back so the tip lands on the body
            curl = (ease * 3.3 * (u < 0.35 ? 0.4 : 1.3)) / segs;
            wave *= 1 - ease * 0.8;
          }
          if (reachAng !== null) {
            let d = reachAng - ang;
            while (d > Math.PI) d -= Math.PI * 2;
            while (d < -Math.PI) d += Math.PI * 2;
            ang += d * 0.35 * ease;
            wave *= 1 - ease * 0.85;
          }
          ang += wave * 0.16 + curl;
          if (reachAng === null && !(focused && pose === "touch")) {
            // limbs hang a little in the water, the lower ones more
            let dd = Math.PI / 2 - ang;
            while (dd > Math.PI) dd -= Math.PI * 2;
            while (dd < -Math.PI) dd += Math.PI * 2;
            ang += dd * 0.035 * u;
          }
          const step = len / segs;
          x += Math.cos(ang) * step;
          y += Math.sin(ang) * step + (reachAng === null ? Math.sin(u * 2) * 0.6 : 0);
          pts.push([x, y]);
        }
        const dim = anyFocus && !focused ? 0.32 : 1;
        // body of the limb, tapering
        for (let k = 1; k < pts.length; k++) {
          const u = k / pts.length;
          A(a * dim * (0.95 - u * 0.4));
          ctx.strokeStyle = focused ? "#5a4f7e" : old ? "#3a3f66" : "#2b3277";
          ctx.lineWidth = Math.max(1, R * 0.3 * (1 - u * 0.85));
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(pts[k - 1][0], pts[k - 1][1]);
          ctx.lineTo(pts[k][0], pts[k][1]);
          ctx.stroke();
        }
        // the branching tip - hundreds of points of contact, suggested by a few
        const [tx, ty] = pts[pts.length - 1];
        const [px, py] = pts[pts.length - 3];
        const ta = Math.atan2(ty - py, tx - px);
        for (let b = -2; b <= 2; b++) {
          A(a * dim * 0.7);
          ctx.strokeStyle = focused ? "#E8CFC0" : "#6E76B8";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          const ba = ta + b * 0.32 + Math.sin(t * 2 + i + b) * 0.08;
          ctx.lineTo(tx + Math.cos(ba) * R * 0.32, ty + Math.sin(ba) * R * 0.32);
          ctx.stroke();
        }
        // nodes of light along the limb - each limb has a mind
        for (let k = 3; k < pts.length; k += 3) {
          const [nx, ny] = pts[k];
          const flick = 0.55 + 0.45 * Math.sin(t * 2.2 + k + L.phase);
          const col = focused
            ? "rgba(232,207,192,1)"
            : L.hue < 0.33
              ? "rgba(185,192,255,1)"
              : L.hue < 0.75
                ? "rgba(160,120,255,1)"
                : "rgba(232,207,192,1)";
          glow(nx, ny, R * (focused ? 0.34 : 0.2), col, a * dim * flick * (focused ? 1 : 0.75));
        }
        // the limb's own mind: a brighter node near its root
        const [mx, my] = pts[5];
        glow(mx, my, R * (focused ? 0.75 : 0.3), focused ? "rgba(232,207,192,1)" : "rgba(139,149,246,1)", a * dim * (focused ? 0.9 + 0.1 * Math.sin(t * 5) : 0.6));
      };
      for (let i = 0; i < 16; i++) drawLimb(i);

      // central body: a shell around a mind
      glow(cx, cy, R * 2.4, old ? "rgba(150,140,170,0.35)" : "rgba(80,90,200,0.4)", a);
      A(a);
      const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.4, R * 0.1, cx, cy, R);
      g.addColorStop(0, old ? "#5d5a73" : "#323c96");
      g.addColorStop(1, old ? "#1d1c2c" : "#0d1035");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R, R * 0.88, 0, 0, Math.PI * 2);
      ctx.fill();
      A(a * 0.6);
      ctx.strokeStyle = old ? "#8d8aa3" : "#8B95F6";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      if (old) {
        // scarred, mineralized
        world.specks.forEach((s) => {
          A(a * 0.7);
          ctx.fillStyle = "#c9c4d6";
          ctx.beginPath();
          ctx.arc(cx + Math.cos(s.a) * R * s.d, cy + Math.sin(s.a) * R * s.d * 0.88, s.s, 0, Math.PI * 2);
          ctx.fill();
        });
        A(a * 0.5);
        ctx.strokeStyle = "#C97B6E";
        ctx.beginPath();
        ctx.moveTo(cx - R * 0.6, cy - R * 0.2);
        ctx.lineTo(cx - R * 0.1, cy + R * 0.1);
        ctx.lineTo(cx + R * 0.3, cy - R * 0.05);
        ctx.stroke();
      }
      const beat = 0.75 + 0.25 * Math.sin(t * 1.3);
      glow(cx, cy, R * 0.6, "rgba(185,192,255,1)", a * beat * (anyFocus ? 0.55 : 0.85));
    }

    // ---------- scenes ----------
    const SCENES = {
      orbit(t) {
        A(1);
        ctx.fillStyle = "#04050d";
        ctx.fillRect(0, 0, W, H);
        world.stars.forEach((s) => {
          A(0.4 + 0.6 * Math.abs(Math.sin(t * 0.4 + s.p)));
          ctx.fillStyle = "#DCDFFF";
          ctx.fillRect(s.x * W, s.y * H, s.s, s.s);
        });
        const R = Math.max(W, H) * 0.62;
        const px = W * 0.72, py = H * 1.18;
        glow(px, py, R * 1.18, "rgba(90,130,255,0.45)", 1);
        A(1);
        const g = ctx.createRadialGradient(px - R * 0.3, py - R * 0.5, R * 0.1, px, py, R);
        g.addColorStop(0, "#3d6fd6");
        g.addColorStop(0.55, "#163574");
        g.addColorStop(1, "#071230");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, R, 0, Math.PI * 2);
        ctx.clip();
        // circling currents
        for (let i = 0; i < 9; i++) {
          A(0.18);
          ctx.strokeStyle = "#a8c4ff";
          ctx.lineWidth = 2 + i * 0.6;
          ctx.beginPath();
          const rr = R * (0.4 + i * 0.07);
          const st = t * 0.04 * (i % 2 ? 1 : -1.3) + i;
          ctx.ellipse(px, py, rr, rr * 0.32, -0.25, st, st + 2.2);
          ctx.stroke();
        }
        // the signal: rings spreading from one point, at precise intervals
        const sx = px - R * 0.35, sy = py - R * 0.62;
        for (let k = 0; k < 3; k++) {
          const ph = ((t * 0.35 + k / 3) % 1);
          A((1 - ph) * 0.7);
          ctx.strokeStyle = "#E8CFC0";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(sx, sy, ph * R * 0.5, ph * R * 0.16, -0.25, 0, Math.PI * 2);
          ctx.stroke();
        }
        glow(sx, sy, 10, "rgba(232,207,192,1)", 0.8 + 0.2 * Math.sin(t * 6));
        ctx.restore();
        mark(W * 0.2, H * 0.28, Math.max(7, Math.min(W, H) * 0.022), t, 0.9);
      },
      descent(t, age) {
        const d = Math.min(1, age / 18);
        water(`rgb(${Math.round(30 - 22 * d)},${Math.round(70 - 55 * d)},${Math.round(140 - 100 * d)})`, "#03040c");
        shafts(t, 0.1 * (1 - d));
        snow(t, -2.4, 0.55);
        mark(W * 0.5, H * 0.42, Math.max(8, Math.min(W, H) * 0.028), t, 1);
        A(0.6);
        ctx.fillStyle = "#6E76B8";
        ctx.font = `${Math.max(10, W * 0.011)}px 'JetBrains Mono', monospace`;
        ctx.fillText(`DEPTH ${Math.round(200 + d * 2800)} m`, W * 0.04, H * 0.08);
      },
      structures(t) {
        water("#060a26", "#020309");
        snow(t, -0.4, 0.35);
        towers(t);
        conduits(t);
        mark(W * 0.82, H * 0.22, Math.max(7, Math.min(W, H) * 0.02), t, 0.8);
      },
      creature(t) {
        water("#070b2a", "#020309");
        A(0.5);
        towers(t, { lit: 0.6 });
        conduits(t, { live: 0.7 });
        snow(t, -0.3, 0.3);
        const s = stateRef.current;
        creature(W * 0.48, H * 0.42, Math.min(W, H) * 0.085, t, { focus: s.focus, focusAge: (performance.now() - s.focusSince) / 1000, pose: s.pose });
        mark(W * 0.88, H * 0.2, Math.max(7, Math.min(W, H) * 0.02), t, 0.7);
      },
      city(t) {
        water("#0a1240", "#03040c");
        towers(t, { scale: 1.15, lit: 1.2 });
        conduits(t);
        world.swimmers.forEach((sw) => {
          const x = (((sw.x + t * sw.v) % 1) + 1) % 1;
          creature(x * W, sw.y * H * 0.9, Math.min(W, H) * 0.012 * sw.s, t + sw.p, { a: 0.55 });
        });
        snow(t, -0.3, 0.3);
      },
      child(t) {
        water("#0a1240", "#03040c");
        A(0.6);
        towers(t, { scale: 0.9, lit: 0.6 });
        snow(t, -0.3, 0.3);
        const s = stateRef.current;
        const m = [W * 0.76, H * 0.26];
        creature(W * 0.1, H * 0.5, Math.min(W, H) * 0.09, t, { a: 0.45 }); // a watching adult
        creature(W * 0.36, H * 0.33, Math.min(W, H) * 0.05, t, {
          focus: s.focus,
          focusAge: (performance.now() - s.focusSince) / 1000,
          pose: s.pose,
          reachTo: [m[0] - Math.min(W, H) * 0.035, m[1]],
        });
        mark(m[0], m[1], Math.max(8, Math.min(W, H) * 0.028), t, 1);
      },
      failing(t, age) {
        const dieAt = Math.min(1.1, age / 14);
        water("#0a0e2e", "#030308");
        towers(t, { dieAt, warm: 1 });
        conduits(t, { dieAt, red: 0.5 });
        snow(t, -0.2, 0.25);
        glow(W * 0.5, H * 1.05, W * 0.5, "rgba(201,123,110,0.5)", 0.4 + 0.2 * Math.sin(t * 3));
      },
      rupture(t) {
        water("#0b0a1c", "#020206");
        // chamber walls
        A(1);
        ctx.fillStyle = "#06060f";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(W * 0.22, 0);
        ctx.quadraticCurveTo(W * 0.1, H * 0.5, W * 0.3, H);
        ctx.lineTo(0, H);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(W, 0);
        ctx.lineTo(W * 0.8, 0);
        ctx.quadraticCurveTo(W * 0.92, H * 0.5, W * 0.7, H);
        ctx.lineTo(W, H);
        ctx.fill();
        // the split, and the flood pouring into it
        const bx = W * 0.5, by = H * 0.62;
        glow(bx, by, W * 0.22, "rgba(201,123,110,0.8)", 0.55 + 0.25 * Math.sin(t * 4));
        A(1);
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(bx - W * 0.09, by);
        ctx.lineTo(bx - W * 0.02, by - H * 0.03);
        ctx.lineTo(bx + W * 0.03, by + H * 0.01);
        ctx.lineTo(bx + W * 0.1, by - H * 0.02);
        ctx.lineTo(bx + W * 0.04, by + H * 0.06);
        ctx.lineTo(bx - W * 0.04, by + H * 0.05);
        ctx.fill();
        for (let i = 0; i < 70; i++) {
          const u = ((i * 0.618 + t * (0.5 + (i % 5) * 0.12)) % 1);
          const sx = (i * 97) % W;
          const sy = (i * 53) % (H * 0.7);
          const x = sx + (bx - sx) * u;
          const y = sy + (by - sy) * u;
          A((1 - u) * 0.6 * u * 4);
          ctx.strokeStyle = i % 4 ? "#8B95F6" : "#C97B6E";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + (bx - sx) * 0.04, y + (by - sy) * 0.04);
          ctx.stroke();
        }
        mark(W * 0.86, H * 0.2, Math.max(7, Math.min(W, H) * 0.022), t, 0.8);
      },
      elder(t) {
        SCENES.rupture(t);
        const s = stateRef.current;
        creature(W * 0.47, H * 0.36, Math.min(W, H) * 0.085, t, {
          focus: s.focus,
          focusAge: (performance.now() - s.focusSince) / 1000,
          pose: s.pose,
          old: true,
        });
      },
      light(t, age) {
        const up = Math.min(1, age / 8);
        water("#0d1850", "#03040c");
        shafts(t, 0.05 * up);
        towers(t, { scale: 1.1, lit: 0.4 + up * 0.9 });
        conduits(t, { live: up });
        snow(t, -0.2, 0.3);
        glow(W * 0.5, H * 0.4, W * 0.45, "rgba(185,192,255,0.25)", up);
      },
      dark(t, age) {
        const down = Math.min(1, age / 10);
        water("#05061a", "#000");
        towers(t, { lit: 0.25 * (1 - down) + 0.05 });
        snow(t, -0.1, 0.18);
        glow(W * 0.5, H * 1.1, W * 0.4, "rgba(201,123,110,0.4)", 0.3 * (1 - down) + 0.08);
      },
    };

    const frame = (now) => {
      const s = stateRef.current;
      const t = ((now - start) / 1000) * timeScale;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      const k = s.prev ? Math.min(1, (now - s.since) / FADE_MS) : 1;
      try {
        if (s.prev && k < 1) {
          base = 1;
          (SCENES[s.prev] || SCENES.orbit)(t, ((now - (s.prevStart || start)) / 1000) * timeScale);
          base = k;
        } else {
          base = 1;
        }
        (SCENES[s.scene] || SCENES.orbit)(t, ((now - s.sceneStart) / 1000) * timeScale);
      } catch (e) {
        // never let a drawing error take the story down
      }
      if (k >= 1) s.prev = null;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}
