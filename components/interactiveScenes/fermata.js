// Scenes for Interactive Assignment 2178309, "The Fermata" (the comet 13i
// calls Fermata). Drawn by components/InteractiveScene.js through its
// drawing kit (`api`). Everything is code: the comet asleep and awake, its
// tail, the wakers in their chambers, the letter wall, the rogue planet,
// the bent orbit, the council, the long nudge, and the lights going out.

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

const ICE = "#BFE6FF";
const WAKER = "#F6E3B4"; // the wakers' own faint light
const ROSE = "#E8B4C8";

function makeWorld() {
  const r = rng(2178309);
  return {
    stars: Array.from({ length: 190 }, () => ({ x: r(), y: r(), s: r() * 1.3 + 0.2, p: r() * 6.28 })),
    signals: Array.from({ length: 40 }, () => ({ a: r() * 6.28, b: (r() - 0.5) * 1.6, p: r() * 6.28, f: 0.6 + r() * 2 })),
    tail: Array.from({ length: 420 }, () => ({ k: r(), w: (r() - 0.5), p: r() * 6.28, s: 0.5 + r() * 1.6 })),
    wakers: Array.from({ length: 26 }, () => ({ x: r(), y: r(), a: (r() - 0.5) * 1.2, p: r() * 6.28, s: 0.7 + r() * 0.6 })),
    crowd: Array.from({ length: 240 }, () => ({ a: r() * Math.PI, rr: 0.3 + r() * 0.7, p: r() * 6.28 })),
    lines: Array.from({ length: 48 }, () => ({ w: 0.3 + r() * 0.7, glyphs: Array.from({ length: 22 }, () => r()) })),
    chambers: Array.from({ length: 34 }, () => ({ x: r(), y: 0.35 + r() * 0.6, s: 0.6 + r() * 0.6 })),
  };
}

export function makeFermataScenes(api) {
  const { ctx, A, glow, mark } = api;
  const world = makeWorld();
  const W = () => api.W;
  const H = () => api.H;
  const m = () => Math.min(W(), H());
  const S = {};

  const space = (t, a = 1, bg = "#03040b") => {
    A(1); ctx.fillStyle = bg; ctx.fillRect(0, 0, W(), H());
    world.stars.forEach((s) => { A(a * (0.3 + 0.6 * Math.abs(Math.sin(t * 0.3 + s.p)))); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(s.x * W(), s.y * H(), s.s, s.s); });
  };

  // the nucleus: a lumpy mountain of dirty ice
  function nucleus(cx, cy, R, t, { lit = 1, signals = 1 } = {}) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.02);
    A(1); const g = ctx.createRadialGradient(-R * 0.3, -R * 0.3, R * 0.1, 0, 0, R * 1.5);
    g.addColorStop(0, lit ? "#9aa8b8" : "#3a404c"); g.addColorStop(0.6, lit ? "#4a5462" : "#1c2028"); g.addColorStop(1, "#0a0c12");
    ctx.fillStyle = g; ctx.beginPath();
    for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2; const rr = R * (1 + 0.14 * Math.sin(a * 3 + 1) + 0.08 * Math.sin(a * 7)); i ? ctx.lineTo(Math.cos(a) * rr * 1.25, Math.sin(a) * rr * 0.85) : ctx.moveTo(Math.cos(a) * rr * 1.25, Math.sin(a) * rr * 0.85); }
    ctx.closePath(); ctx.fill();
    // signals: a hundred points pulsing across the surface
    if (signals) world.signals.forEach((s) => {
      const x = Math.cos(s.a) * Math.cos(s.b) * R, y = Math.sin(s.b) * R * 0.7;
      const on = Math.sin(t * s.f + s.p) > 0.4;
      if (!on) return;
      glow(x * 1.1, y, 5 * signals, "rgba(246,227,180,0.95)", signals * 0.9);
    });
    ctx.restore();
  }

  function tail(cx, cy, R, t, { len = 1, a = 1 } = {}) {
    // pointing away from the star (star is off left)
    world.tail.forEach((p) => {
      const k = p.k * len;
      const x = cx + k * W() * 0.9;
      const y = cy + p.w * (R * 0.6 + k * H() * 0.25) + Math.sin(t * 0.4 + p.p + k * 4) * 3;
      A(a * (1 - p.k * 0.8) * 0.75); ctx.fillStyle = p.s > 1.4 ? "#FFFFFF" : ICE; ctx.fillRect(x, y, p.s * 1.3, p.s * 1.3);
    });
    glow(cx + R * 0.6, cy, R * 3, "rgba(191,230,255,0.4)", a * 0.6);
  }

  function waker(x, y, h, t, { a = 1, hue = WAKER, sleep = 0 } = {}) {
    // long translucent body with its own light, a dozen feathered limbs
    glow(x, y, h * 0.9, hue === WAKER ? "rgba(246,227,180,0.5)" : "rgba(232,180,200,0.5)", a * (sleep ? 0.25 : 0.5 + 0.2 * Math.sin(t * 1.5 + x)));
    A(a * (sleep ? 0.5 : 0.85)); ctx.fillStyle = "rgba(246,240,225,0.35)"; ctx.strokeStyle = hue; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(x, y, h * 0.12, h * 0.48, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    for (let i = 0; i < 6; i++) {
      [-1, 1].forEach((sd) => {
        const yy = y - h * 0.3 + i * h * 0.12;
        const sway = sleep ? 0 : Math.sin(t * 2 + i + sd) * h * 0.04;
        A(a * 0.55); ctx.beginPath(); ctx.moveTo(x + sd * h * 0.1, yy); ctx.quadraticCurveTo(x + sd * h * 0.28, yy - h * 0.06 + sway, x + sd * h * 0.36, yy + h * 0.04 + sway); ctx.stroke();
      });
    }
    A(a); ctx.fillStyle = "#FFF6DC"; ctx.beginPath(); ctx.arc(x, y - h * 0.32, h * 0.04, 0, Math.PI * 2); ctx.fill();
  }

  function iceWall(t, { warm = 1 } = {}) {
    A(1); const g = ctx.createLinearGradient(0, 0, 0, H());
    g.addColorStop(0, warm ? "#0e1a2a" : "#070b12"); g.addColorStop(1, warm ? "#1c3046" : "#0a1018");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W(), H());
    // cracks and strata
    for (let i = 0; i < 9; i++) {
      A(0.12); ctx.strokeStyle = ICE; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H() * (0.1 + i * 0.1)); for (let x = 0; x <= W(); x += W() / 12) ctx.lineTo(x, H() * (0.1 + i * 0.1) + Math.sin(x * 0.01 + i) * 8); ctx.stroke();
    }
    if (warm) glow(W() * 0.5, -H() * 0.1, W() * 0.7, "rgba(255,226,170,0.25)", 0.6);
  }

  // I · asleep in the dark
  S["fm-dark"] = (t) => {
    space(t, 0.9, "#020309");
    nucleus(W() * 0.5, H() * 0.52, m() * 0.07, t, { lit: 0, signals: 0 });
    // the star, a brightest point among points
    glow(W() * 0.12, H() * 0.2, 8, "rgba(255,240,200,0.95)", 0.9);
  };

  // awake: the tail, and the signals
  S["fm-comet"] = (t) => {
    space(t, 0.7);
    glow(-W() * 0.05, H() * 0.5, m() * 0.5, "rgba(255,226,160,0.5)", 0.8);
    const cx = W() * 0.3, cy = H() * 0.52, R = m() * 0.08;
    tail(cx, cy, R, t);
    nucleus(cx, cy, R, t, { signals: 1 });
    mark(W() * 0.86, H() * 0.18, Math.max(6, m() * 0.016), t, 0.7, { ping: false });
  };

  // inside the ice: wakers in the softening chambers
  S["fm-ice"] = (t) => {
    iceWall(t);
    world.chambers.forEach((c) => {
      A(0.25); ctx.strokeStyle = ICE; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(c.x * W(), c.y * H(), 18 * c.s, 34 * c.s, 0, 0, Math.PI * 2); ctx.stroke();
    });
    world.wakers.slice(0, 7).forEach((w, i) => {
      const x = W() * (0.1 + i * 0.13), y = H() * (0.55 + Math.sin(i * 1.7) * 0.12) + Math.sin(t * 0.6 + w.p) * 6;
      waker(x, y, m() * 0.22 * w.s, t, { hue: i % 3 ? WAKER : ROSE });
    });
  };

  // the letter wall: 384 letters of frozen light
  S["fm-wall"] = (t, age) => {
    A(1); ctx.fillStyle = "#050a12"; ctx.fillRect(0, 0, W(), H());
    const x0 = W() * 0.12, x1 = W() * 0.88, y0 = H() * 0.08;
    A(1); const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, "rgba(191,230,255,0.04)"); g.addColorStop(0.5, "rgba(191,230,255,0.12)"); g.addColorStop(1, "rgba(191,230,255,0.04)");
    ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, H() * 0.8);
    const rows = world.lines.length, rh = (H() * 0.78) / rows;
    world.lines.forEach((l, i) => {
      const y = y0 + 6 + i * rh;
      const old = 1 - i / rows; // oldest at the top, faintest
      l.glyphs.forEach((gq, j) => {
        if (j / l.glyphs.length > l.w) return;
        const x = x0 + 10 + j * ((x1 - x0 - 20) / l.glyphs.length);
        A(0.15 + 0.5 * (1 - old) * (0.6 + 0.4 * Math.sin(t + i + j))); ctx.fillStyle = i === rows - 1 ? "#FFF6DC" : gq > 0.8 ? ROSE : WAKER;
        ctx.fillRect(x, y, Math.max(2, gq * 7), Math.max(1.4, rh * 0.32));
      });
    });
    // the newest line, still forming
    const k = Math.min(1, ((age || 0) % 8) / 6);
    glow(x0 + 10 + k * (x1 - x0 - 20), y0 + 6 + (rows - 1) * rh, 10, "rgba(246,227,180,0.9)", 0.7);
    world.wakers.slice(0, 3).forEach((w, i) => waker(W() * (0.25 + i * 0.25), H() * 0.96, m() * 0.16, t + i, { a: 0.8 }));
  };

  // the stranger: a dark, starless planet, felt only by its weight
  S["fm-rogue"] = (t) => {
    space(t, 0.5, "#010206");
    const cx = W() * 0.66, cy = H() * 0.48, R = m() * 0.26;
    // the stars bend around it
    for (let i = 0; i < 5; i++) { A(0.14); ctx.strokeStyle = "#8B95F6"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R * (1.2 + i * 0.3 + 0.05 * Math.sin(t + i)), 0, Math.PI * 2); ctx.stroke(); }
    A(1); ctx.fillStyle = "#020205"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    A(0.7); ctx.strokeStyle = "#5A5E9A"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, -2.4, -0.6); ctx.stroke();
    glow(cx - R * 0.5, cy - R * 0.75, R * 0.5, "rgba(139,149,246,0.35)", 0.5);
    // the comet's little path, tugged
    A(0.4); ctx.strokeStyle = ICE; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.ellipse(W() * 0.2, H() * 0.62, W() * 0.18, H() * 0.08, -0.2, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    glow(W() * 0.06, H() * 0.66, 5, "rgba(255,240,200,0.9)", 0.9);
  };

  // the path: the old orbit, and the new one that misses
  S["fm-path"] = (t, age) => {
    A(1); ctx.fillStyle = "#04050d"; ctx.fillRect(0, 0, W(), H());
    const sx = W() * 0.2, sy = H() * 0.5;
    glow(sx, sy, m() * 0.08, "rgba(255,226,160,0.9)", 0.9);
    A(1); ctx.fillStyle = "#FFF4DC"; ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fill();
    // warm zone
    A(0.12); ctx.fillStyle = "#FFD98A"; ctx.beginPath(); ctx.arc(sx, sy, m() * 0.13, 0, Math.PI * 2); ctx.fill();
    // old orbit: grazes the warm zone
    A(0.35); ctx.strokeStyle = ICE; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(sx + W() * 0.36, sy, W() * 0.44, H() * 0.12, 0, 0, Math.PI * 2); ctx.stroke();
    // new path: wider, open, unbound
    const draw = Math.min(1, (age || 0) / 5);
    A(0.9); ctx.strokeStyle = "#E06A50"; ctx.lineWidth = 1.6; ctx.beginPath();
    for (let i = 0; i <= 100 * draw; i++) {
      const u = (i / 100) * Math.PI * 1.15 - Math.PI * 0.15;
      const x = sx + W() * 0.36 + Math.cos(u + Math.PI * 0.85) * W() * 0.42 * (1 + i * 0.004), y = sy + Math.sin(u + Math.PI * 0.85) * H() * 0.2 * (1 + i * 0.006);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
    const k = (t * 0.08) % 1;
    glow(sx + W() * 0.36 + Math.cos(k * 6.28) * W() * 0.44, sy + Math.sin(k * 6.28) * H() * 0.12, 6, "rgba(191,230,255,0.9)", 0.8);
  };

  // the council: thousands of small lit bodies around the wall
  S["fm-council"] = (t) => {
    A(1); ctx.fillStyle = "#050912"; ctx.fillRect(0, 0, W(), H());
    const cx = W() * 0.5, cy = H() * 0.62, R = m() * 0.55;
    // the wall, at the center
    A(0.15); ctx.fillStyle = ICE; ctx.fillRect(cx - W() * 0.12, H() * 0.12, W() * 0.24, H() * 0.5);
    for (let i = 0; i < 14; i++) { A(0.25); ctx.fillStyle = WAKER; ctx.fillRect(cx - W() * 0.1, H() * (0.15 + i * 0.03), W() * 0.2 * (0.4 + 0.6 * Math.abs(Math.sin(i * 2.3))), 1.6); }
    world.crowd.forEach((c, i) => {
      const a = Math.PI + c.a;
      const x = cx + Math.cos(a) * R * c.rr * 1.3, y = cy - Math.sin(a) * R * c.rr * 0.35 + R * 0.15;
      const speak = Math.sin(t * 2 + c.p) > 0.85;
      glow(x, y, speak ? 9 : 4, i % 5 ? "rgba(246,227,180,0.9)" : "rgba(232,180,200,0.9)", speak ? 0.9 : 0.45);
    });
    mark(W() * 0.9, H() * 0.15, Math.max(6, m() * 0.016), t, 0.75, { ping: false });
  };

  // the nudge: eighteen days of leaning on a mountain
  S["fm-nudge"] = (t) => {
    space(t, 0.7);
    glow(-W() * 0.05, H() * 0.5, m() * 0.5, "rgba(255,226,160,0.45)", 0.7);
    const cx = W() * 0.42, cy = H() * 0.52, R = m() * 0.1;
    tail(cx, cy, R, t, { a: 0.7 });
    nucleus(cx, cy, R, t, { signals: 0.6 });
    // our pull: slow rings, gravity, not light
    const mx = W() * 0.42, my = H() * 0.2;
    for (let i = 0; i < 4; i++) { const k = ((t * 0.12 + i / 4) % 1); A(0.3 * (1 - k)); ctx.strokeStyle = "#8B95F6"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(mx, my, 10 + k * (cy - my), 0.3, Math.PI - 0.3); ctx.stroke(); }
    mark(mx, my, Math.max(7, m() * 0.02), t, 0.9, { ping: false });
  };

  // the lights going out one by one; the comet falling away holding its note
  S["fm-sleep"] = (t, age) => {
    space(t, 0.9);
    const k = Math.min(1, (age || 0) / 14);
    const cx = W() * (0.42 + k * 0.12), cy = H() * (0.5 + k * 0.04), R = m() * (0.09 - k * 0.03);
    tail(cx, cy, R, t, { len: 1 - k * 0.7, a: 1 - k * 0.6 });
    nucleus(cx, cy, R, t, { signals: Math.max(0, 1 - k * 1.2) });
    mark(W() * 0.16, H() * 0.24, Math.max(6, m() * 0.018), t, 0.85);
  };

  // a different sky: a short, tight loop around the star
  S["fm-short"] = (t) => {
    space(t, 0.6);
    const sx = W() * 0.5, sy = H() * 0.5;
    glow(sx, sy, m() * 0.12, "rgba(255,226,160,0.9)", 0.9);
    A(0.35); ctx.strokeStyle = ICE; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(sx + W() * 0.08, sy, W() * 0.2, H() * 0.12, 0.2, 0, Math.PI * 2); ctx.stroke();
    const a = t * 0.6;
    const x = sx + W() * 0.08 + Math.cos(a) * W() * 0.2 * Math.cos(0.2) - Math.sin(a) * H() * 0.12 * Math.sin(0.2);
    const y = sy + Math.cos(a) * W() * 0.2 * Math.sin(0.2) + Math.sin(a) * H() * 0.12 * Math.cos(0.2);
    nucleus(x, y, m() * 0.025, t, { signals: 0.5 });
    // the tail, short, no shapes
    for (let i = 0; i < 30; i++) { A(0.3 * (1 - i / 30)); ctx.fillStyle = ICE; ctx.fillRect(x + (x - sx) * i * 0.02, y + (y - sy) * i * 0.02, 1.4, 1.4); }
  };

  // the cold: outbound, unbound, dark
  S["fm-cold"] = (t, age) => {
    space(t, 0.6, "#010208");
    const k = Math.min(1, (age || 0) / 20);
    nucleus(W() * (0.5 + k * 0.2), H() * 0.5, m() * (0.06 - k * 0.03), t, { lit: 0, signals: 0 });
    glow(W() * 0.04, H() * 0.12, 4, "rgba(255,240,200,0.8)", 0.7 - k * 0.5);
  };

  // the cover (public/covers/assignment-2178309.jpg was drawn from this)
  S["fm-cover"] = (t) => {
    space(t, 1, "#03040c");
    glow(W() * 0.5, -H() * 0.05, m() * 0.6, "rgba(255,226,160,0.5)", 0.8);
    // the tail falling straight down the cover, away from the star
    const cx = W() * 0.5, cy = H() * 0.5, R = m() * 0.12;
    world.tail.forEach((p) => {
      const x = cx + p.w * (R * 0.8 + p.k * W() * 0.5) + Math.sin(p.p + p.k * 5) * 6, y = cy + p.k * H() * 0.5;
      A((1 - p.k) * 0.6); ctx.fillStyle = p.s > 1.4 ? "#FFFFFF" : ICE; ctx.fillRect(x, y, p.s * 1.4, p.s * 1.4);
    });
    glow(cx, cy + R * 0.6, R * 3, "rgba(191,230,255,0.35)", 0.7);
    nucleus(cx, cy, R, 2, { signals: 1 });
    // a fermata mark, held above it
    A(0.9); ctx.strokeStyle = "#FFF4DC"; ctx.lineWidth = Math.max(2, m() * 0.006);
    ctx.beginPath(); ctx.arc(cx, cy - R * 1.3, R * 0.7, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = "#FFF4DC"; ctx.beginPath(); ctx.arc(cx, cy - R * 1.42, Math.max(3, m() * 0.012), 0, Math.PI * 2); ctx.fill();
    // a waker, small, lit, at the bottom
    waker(W() * 0.5, H() * 0.87, m() * 0.24, 1);
  };

  return S;
}
