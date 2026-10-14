// Scenes for Interactive Assignment 3524578, "The Accord" (the world 13i
// calls Tutti). Drawn by components/InteractiveScene.js through its drawing
// kit (`api`). Everything is code: a planet roaring with mass, the Great
// Wood full of fliers, glowing moss, drum-trees and a thousand small lives,
// a Pell on a branch talking with its tail, a loom-beast with a town on its
// back, the Accord as rows of colour, the strangling vine, the frame under
// the ground, the elders at night, and a loom-beast standing up.

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

const LEAF = "#2f6a4a";
const MOSS = "#9FE3B0";
const TAIL = ["#F2C14E", "#E8B4C8", "#8FD3E8", "#9FE3B0", "#E9A24A", "#B9C0FF"];
const VINE = "#7f8f6a";

function makeWorld() {
  const r = rng(3524578);
  return {
    stars: Array.from({ length: 140 }, () => ({ x: r(), y: r(), s: r() * 1.2 + 0.2, p: r() * 6.28 })),
    life: Array.from({ length: 420 }, () => ({ a: r() * 6.28, b: (r() - 0.5) * 1.5, s: r(), sp: (r() - 0.5) * 0.2 })),
    trees: Array.from({ length: 26 }, (_, i) => ({ x: i / 26 + (r() - 0.5) * 0.03, h: 0.55 + r() * 0.4, w: 0.012 + r() * 0.02, c: r() })),
    fliers: Array.from({ length: 14 }, () => ({ y: 0.08 + r() * 0.35, sp: 0.03 + r() * 0.05, p: r(), s: 0.6 + r() * 0.9 })),
    motes: Array.from({ length: 90 }, () => ({ x: r(), y: r(), p: r() * 6.28, c: Math.floor(r() * 6) })),
    moss: Array.from({ length: 70 }, () => ({ x: r(), y: 0.78 + r() * 0.2, p: r() * 6.28 })),
    crawlers: Array.from({ length: 16 }, () => ({ x: r(), y: 0.86 + r() * 0.1, sp: (r() - 0.5) * 0.02 })),
    rows: Array.from({ length: 20 }, () => Array.from({ length: 14 }, () => Math.floor(r() * 6))),
    houses: Array.from({ length: 18 }, () => ({ x: r(), s: 0.5 + r() * 0.6 })),
    dead: Array.from({ length: 12 }, () => ({ x: r(), h: 0.4 + r() * 0.4 })),
    roots: Array.from({ length: 50 }, () => ({ x: r(), d: 0.2 + r() * 0.7, w: (r() - 0.5) * 0.2 })),
    elders: Array.from({ length: 11 }, () => ({ x: r(), y: r(), c: Math.floor(r() * 6) })),
  };
}

export function makeTuttiScenes(api) {
  const { ctx, A, glow, mark } = api;
  const world = makeWorld();
  const W = () => api.W;
  const H = () => api.H;
  const m = () => Math.min(W(), H());
  const S = {};

  const space = (t, a = 1) => {
    A(1); ctx.fillStyle = "#03050a"; ctx.fillRect(0, 0, W(), H());
    world.stars.forEach((s) => { A(a * (0.3 + 0.6 * Math.abs(Math.sin(t * 0.4 + s.p)))); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(s.x * W(), s.y * H(), s.s, s.s); });
  };

  // the full world: green and blue, and a shimmer of moving life on it
  function planet(cx, cy, R, t, { ripples = 1 } = {}) {
    glow(cx, cy, R * 1.45, "rgba(120,220,160,0.4)", 0.6);
    A(1); const g = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.4, R * 0.1, cx, cy, R);
    g.addColorStop(0, "#5fae74"); g.addColorStop(0.55, "#22593f"); g.addColorStop(1, "#071a14");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    // seas
    for (let i = 0; i < 4; i++) { A(0.35); ctx.fillStyle = "#1d4a6a"; ctx.beginPath(); ctx.ellipse(cx + Math.sin(i * 2.3 + t * 0.03) * R * 0.6, cy + Math.cos(i * 1.9) * R * 0.5, R * 0.28, R * 0.16, i, 0, Math.PI * 2); ctx.fill(); }
    // the life on it, moving
    world.life.forEach((l) => {
      const lon = l.a + t * (0.03 + l.sp * 0.1);
      const x = Math.sin(lon) * Math.cos(l.b), y = Math.sin(l.b), z = Math.cos(lon) * Math.cos(l.b);
      if (z < 0) return;
      A(0.25 + 0.5 * l.s * z); ctx.fillStyle = TAIL[Math.floor(l.s * 6)];
      ctx.fillRect(cx + x * R, cy + y * R, 1.4, 1.4);
    });
    ctx.restore();
    // how it feels to us: mass, rippling
    if (ripples) for (let i = 0; i < 4; i++) { const k = ((t * 0.25 + i / 4) % 1); A(0.25 * (1 - k)); ctx.strokeStyle = "#9FE3B0"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R * (1.02 + k * 0.5), 0, Math.PI * 2); ctx.stroke(); }
  }

  function canopy(t, { night = 0, dim = 1 } = {}) {
    A(1); const g = ctx.createLinearGradient(0, 0, 0, H());
    g.addColorStop(0, night ? "#05110c" : "#2d5a46"); g.addColorStop(0.55, night ? "#081a12" : "#18392b"); g.addColorStop(1, "#06100b");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W(), H());
    if (!night) for (let i = 0; i < 5; i++) { A(0.06 * dim); ctx.fillStyle = "#E9F5C8"; ctx.beginPath(); const x = W() * (0.1 + i * 0.2); ctx.moveTo(x, 0); ctx.lineTo(x + W() * 0.05, 0); ctx.lineTo(x + W() * 0.14, H()); ctx.lineTo(x + W() * 0.06, H()); ctx.fill(); }
    world.trees.forEach((tr) => {
      const x = tr.x * W(), w = tr.w * W();
      A(1); ctx.fillStyle = tr.c > 0.5 ? "#1b2a1e" : "#14211a"; ctx.fillRect(x - w / 2, H() * (1 - tr.h), w, H() * tr.h);
      // crowns
      A(0.9 * dim); ctx.fillStyle = tr.c > 0.6 ? "#2f6a4a" : "#24533a";
      ctx.beginPath(); ctx.ellipse(x, H() * (1 - tr.h), w * 4, w * 2.2, 0, 0, Math.PI * 2); ctx.fill();
    });
    // moss on the paths
    world.moss.forEach((ms) => glow(ms.x * W(), ms.y * H(), 6, "rgba(159,227,176,0.9)", (night ? 0.8 : 0.3) * (0.6 + 0.4 * Math.sin(t + ms.p))));
    // the floor's small cleaners
    world.crawlers.forEach((c) => { const x = (((c.x + t * c.sp) % 1) + 1) % 1; A(0.7); ctx.fillStyle = "#6a5a3a"; ctx.fillRect(x * W(), c.y * H(), 6, 2); });
  }

  function flier(x, y, s, t, a = 1) {
    // a sail-winged flier: long thin body, two translucent swept wings
    const flap = Math.sin(t * 4) * 0.5;
    [-1, 1].forEach((sd) => {
      A(a * 0.55); ctx.fillStyle = "rgba(143,211,232,0.55)"; ctx.strokeStyle = "#8FD3E8"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - s * 4, y); ctx.lineTo(x + sd * 0 - s * 2, y + sd * s * (22 + flap * 10)); ctx.lineTo(x + s * 8, y + sd * s * (16 + flap * 8)); ctx.lineTo(x + s * 6, y); ctx.closePath(); ctx.fill(); ctx.stroke();
    });
    A(a); ctx.strokeStyle = "#1a2a3a"; ctx.lineWidth = Math.max(1.5, s * 2); ctx.beginPath(); ctx.moveTo(x - s * 12, y); ctx.lineTo(x + s * 14, y); ctx.stroke();
    A(a); ctx.fillStyle = "#F2C14E"; ctx.beginPath(); ctx.arc(x + s * 14, y, Math.max(1, s * 1.2), 0, 7); ctx.fill();
    ctx.lineWidth = 1;
  }

  function drumTree(x, base, h, t) {
    A(1); ctx.fillStyle = "#3a2a1a"; ctx.fillRect(x - h * 0.06, base - h, h * 0.12, h);
    const boom = Math.max(0, Math.sin(t * 0.9)) ** 8;
    for (let i = 0; i < 3; i++) { A(0.3 * boom * (1 - i * 0.3)); ctx.strokeStyle = "#F2C14E"; ctx.beginPath(); ctx.arc(x, base - h * 0.6, h * (0.2 + i * 0.25 + boom * 0.1), 0, Math.PI * 2); ctx.stroke(); }
  }

  function pell(x, y, s, t, c = 0, a = 1) {
    // six limbs, a long speaking tail flickering through colours
    A(a); ctx.fillStyle = "#3a2e26"; ctx.strokeStyle = "#E8CFC0"; ctx.lineWidth = Math.max(0.8, s * 0.06);
    ctx.beginPath(); ctx.ellipse(x, y, s * 0.55, s * 0.22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + s * 0.62, y - s * 0.1, s * 0.18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    A(a); ctx.fillStyle = "#FFF4DC"; ctx.beginPath(); ctx.arc(x + s * 0.68, y - s * 0.14, s * 0.05, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 3; i++) { A(a * 0.9); ctx.beginPath(); ctx.moveTo(x - s * 0.3 + i * s * 0.3, y + s * 0.15); ctx.lineTo(x - s * 0.36 + i * s * 0.3, y + s * 0.42); ctx.stroke(); }
    // the tail: a curl of colour, changing
    const segs = 14;
    for (let i = 0; i < segs; i++) {
      const u = i / segs;
      const tx = x - s * 0.5 - u * s * 1.4, ty = y - Math.sin(u * 3 + t * 2) * s * 0.35 - u * s * 0.6;
      const col = TAIL[(c + Math.floor(t * 3 + u * 4)) % TAIL.length];
      glow(tx, ty, s * 0.16, hexA(col, 0.9), a * 0.7);
      A(a); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(tx, ty, s * (0.09 - u * 0.04), 0, Math.PI * 2); ctx.fill();
    }
  }
  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }

  function loomBeast(cx, base, L, t, { town = 1, rising = 0 } = {}) {
    // a hill that walks: a dark rounded back carrying a forest and a town
    const sway = Math.sin(t * 0.3) * L * 0.01;
    A(1); ctx.fillStyle = "#2a2622"; ctx.strokeStyle = "#5a5046"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx - L * 0.5, base); ctx.bezierCurveTo(cx - L * 0.48, base - L * 0.42, cx + L * 0.42, base - L * 0.46, cx + L * 0.5, base - L * 0.08);
    ctx.quadraticCurveTo(cx + L * 0.62, base - L * 0.12, cx + L * 0.66, base - L * 0.02); ctx.lineTo(cx + L * 0.5, base); ctx.closePath(); ctx.fill(); ctx.stroke();
    // legs
    [-0.36, -0.16, 0.12, 0.34].forEach((k, i) => { A(1); ctx.fillStyle = "#211e1b"; ctx.fillRect(cx + k * L + sway * (i % 2 ? 1 : -1), base - 2, L * 0.07, L * 0.1); });
    if (rising) return;
    // forest on its back
    for (let i = 0; i < 16; i++) {
      const u = -0.4 + i * 0.055, x = cx + u * L;
      const top = base - L * (0.36 - Math.abs(u + 0.02) * 0.45) - L * 0.04;
      A(0.95); ctx.fillStyle = i % 3 ? "#2f6a4a" : "#24533a"; ctx.beginPath(); ctx.ellipse(x, top, L * 0.035, L * 0.05, 0, 0, Math.PI * 2); ctx.fill();
    }
    if (town) world.houses.forEach((h, i) => {
      const u = -0.3 + h.x * 0.6, x = cx + u * L, y = base - L * (0.38 - Math.abs(u) * 0.45) - L * 0.075;
      A(1); ctx.fillStyle = "#4a3a2a"; ctx.fillRect(x, y, L * 0.012 * h.s, L * 0.014 * h.s);
      glow(x + 2, y + 2, 5, "rgba(242,193,78,0.8)", 0.5 + 0.3 * Math.sin(t * 2 + i));
    });
  }

  S["tu-roar"] = (t) => {
    space(t, 0.7);
    planet(W() * 0.5, H() * 0.55, m() * 0.33, t);
    mark(W() * 0.86, H() * 0.18, Math.max(6, m() * 0.017), t, 0.8);
  };

  S["tu-wood"] = (t) => {
    canopy(t);
    world.fliers.forEach((f, i) => { const x = (((f.p + t * f.sp) % 1.2) - 0.1) * W(); flier(x, f.y * H() + Math.sin(t + i) * 6, f.s * m() * 0.006, t + i, 0.9); });
    drumTree(W() * 0.82, H() * 0.95, H() * 0.55, t);
    world.motes.forEach((mt) => glow(mt.x * W(), mt.y * H() * 0.8, 3, hexA(TAIL[mt.c], 0.9), 0.4 + 0.4 * Math.sin(t * 2 + mt.p)));
    pell(W() * 0.3, H() * 0.42, m() * 0.035, t, 1);
  };

  S["tu-pell"] = (t) => {
    canopy(t, { dim: 0.6 });
    // a branch across the frame, and a Pell on the end of it, talking slowly
    A(1); ctx.fillStyle = "#2a1e14"; ctx.beginPath(); ctx.moveTo(0, H() * 0.66); ctx.quadraticCurveTo(W() * 0.4, H() * 0.6, W() * 0.68, H() * 0.63); ctx.lineTo(W() * 0.68, H() * 0.66); ctx.quadraticCurveTo(W() * 0.4, H() * 0.66, 0, H() * 0.74); ctx.fill();
    for (let i = 0; i < 7; i++) { A(0.9); ctx.fillStyle = "#2f6a4a"; ctx.beginPath(); ctx.ellipse(W() * (0.1 + i * 0.08), H() * (0.6 - (i % 2) * 0.03), m() * 0.04, m() * 0.016, -0.4 + i * 0.1, 0, Math.PI * 2); ctx.fill(); }
    pell(W() * 0.6, H() * 0.585, m() * 0.11, t * 0.5, 0);
    mark(W() * 0.84, H() * 0.42, Math.max(7, m() * 0.022), t, 0.85, { ping: false });
  };

  S["tu-loom"] = (t) => {
    canopy(t, { dim: 0.5 });
    A(0.35); ctx.fillStyle = "#06100b"; ctx.fillRect(0, H() * 0.82, W(), H() * 0.18);
    loomBeast(W() * 0.48 + Math.sin(t * 0.05) * 10, H() * 0.86, Math.min(W() * 0.8, H() * 1.5), t);
    world.fliers.slice(0, 5).forEach((f, i) => flier(W() * (0.2 + i * 0.15), H() * (0.12 + f.y * 0.3), f.s * m() * 0.005, t + i, 0.8));
  };

  // the Accord: two hundred voices as rows of tail-colours, sung through
  S["tu-accord"] = (t) => {
    A(1); ctx.fillStyle = "#06120c"; ctx.fillRect(0, 0, W(), H());
    const rows = world.rows.length, cols = 14;
    const cw = W() * 0.8 / cols, rh = H() * 0.82 / rows;
    const sung = Math.floor(t * 1.5) % rows;
    world.rows.forEach((row, i) => row.forEach((c, j) => {
      const x = W() * 0.1 + j * cw, y = H() * 0.09 + i * rh;
      const on = i === sung;
      A(on ? 1 : 0.25); ctx.fillStyle = TAIL[c]; ctx.fillRect(x + 2, y + rh * 0.3, cw - 4, rh * 0.4);
      if (on) glow(x + cw / 2, y + rh / 2, cw * 0.7, hexA(TAIL[c], 0.7), 0.5);
    }));
  };

  // the strangler: grey-green vine on dead trees, the green Wood behind
  S["tu-south"] = (t) => {
    canopy(t, { dim: 0.7 });
    A(1); const g = ctx.createLinearGradient(0, 0, W(), 0); g.addColorStop(0, "rgba(40,38,30,0.95)"); g.addColorStop(0.65, "rgba(40,38,30,0.7)"); g.addColorStop(1, "rgba(40,38,30,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W(), H());
    world.dead.forEach((d, i) => {
      const x = d.x * W() * 0.7, top = H() * (1 - d.h);
      A(1); ctx.fillStyle = "#3a352c"; ctx.fillRect(x - 5, top, 10, H() - top);
      A(0.9); ctx.strokeStyle = VINE; ctx.lineWidth = 4;
      ctx.beginPath(); for (let k = 0; k <= 20; k++) { const y = H() - (k / 20) * (H() - top); const xx = x + Math.sin(k * 1.2 + i) * 9; k ? ctx.lineTo(xx, y) : ctx.moveTo(xx, y); } ctx.stroke();
    });
    // its slow advance
    A(0.5); ctx.strokeStyle = VINE; ctx.lineWidth = 2.5;
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(W() * 0.55, H() * (0.4 + i * 0.1)); ctx.quadraticCurveTo(W() * (0.62 + Math.sin(t * 0.2 + i) * 0.02), H() * (0.38 + i * 0.1), W() * (0.68 + i * 0.01), H() * (0.42 + i * 0.1)); ctx.stroke(); }
    ctx.lineWidth = 1;
  };

  // under the vine: the frame, growing in the dark
  S["tu-frame"] = (t, age) => {
    A(1); const g = ctx.createLinearGradient(0, 0, 0, H()); g.addColorStop(0, "#2a2a20"); g.addColorStop(0.18, "#120f0a"); g.addColorStop(1, "#060403"); ctx.fillStyle = g; ctx.fillRect(0, 0, W(), H());
    // roots coming down
    world.roots.forEach((r) => { A(0.35); ctx.strokeStyle = VINE; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(r.x * W(), H() * 0.16); ctx.quadraticCurveTo(r.x * W() + r.w * W(), H() * (0.16 + r.d * 0.4), r.x * W() + r.w * W() * 0.5, H() * (0.16 + r.d * 0.8)); ctx.stroke(); });
    // the skeleton, traced in mass: appears over time
    const k = Math.min(1, (age || 0) / 6);
    const cx = W() * 0.5, base = H() * 0.82, L = Math.min(W() * 0.8, H() * 1.3);
    ctx.save(); A(0.9 * k); ctx.strokeStyle = "#E8E4D4"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - L * 0.45, base - L * 0.1); ctx.bezierCurveTo(cx - L * 0.4, base - L * 0.4, cx + L * 0.4, base - L * 0.44, cx + L * 0.5, base - L * 0.1); ctx.stroke();
    for (let i = 0; i < 18; i++) { const u = -0.38 + i * 0.045; const x = cx + u * L; const top = base - L * (0.4 - Math.abs(u) * 0.45); A(0.7 * k); ctx.beginPath(); ctx.moveTo(x, top); ctx.quadraticCurveTo(x + L * 0.02, top + L * 0.12, x - L * 0.01, base - L * 0.04); ctx.stroke(); }
    [-0.36, -0.16, 0.12, 0.34].forEach((u) => { A(0.7 * k); ctx.beginPath(); ctx.moveTo(cx + u * L, base - L * 0.06); ctx.lineTo(cx + u * L + 4, base + L * 0.06); ctx.stroke(); });
    ctx.restore();
    glow(cx, base - L * 0.2, L * 0.4, "rgba(159,227,176,0.15)", 0.4 + 0.2 * Math.sin(t));
    mark(W() * 0.9, H() * 0.08, Math.max(6, m() * 0.015), t, 0.7, { ping: false });
  };

  // the elders at night, hands on the ground among the dead trees
  S["tu-elders"] = (t) => {
    canopy(t, { night: 1, dim: 0.5 });
    world.elders.forEach((e, i) => pell(W() * (0.12 + i * 0.075), H() * (0.82 + Math.sin(i * 1.7) * 0.04), m() * 0.04, t * 0.4 + i, e.c, 0.95));
    glow(W() * 0.5, H() * 0.95, W() * 0.4, "rgba(159,227,176,0.25)", 0.5);
  };

  // dawn, and a frame standing up out of the ground
  S["tu-light"] = (t, age) => {
    canopy(t, { dim: 1 });
    glow(W() * 0.5, H() * 0.1, W() * 0.6, "rgba(255,236,190,0.45)", 0.7);
    const k = Math.min(1, (age || 0) / 10);
    loomBeast(W() * 0.5, H() * (0.98 - k * 0.1), Math.min(W() * 0.7, H() * 1.3), t, { town: 0, rising: 0 });
    world.fliers.slice(0, 6).forEach((f, i) => flier(W() * (0.1 + i * 0.16), H() * (0.1 + f.y * 0.3), f.s * m() * 0.005, t + i, 0.8));
  };

  S["tu-dark"] = (t, age) => {
    A(1); ctx.fillStyle = "#0b0a08"; ctx.fillRect(0, 0, W(), H());
    world.dead.forEach((d) => { A(1); ctx.fillStyle = "#1a1612"; ctx.fillRect(d.x * W() - 4, H() * (1 - d.h), 8, H() * d.h); });
    for (let i = 0; i < 40; i++) { A(0.3); ctx.fillStyle = "#4a4038"; ctx.fillRect(((i * 97 + t * 8) % W()), (i * 53 + t * 12) % H(), 2, 2); }
    A(Math.min(0.4, (age || 0) / 15)); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W(), H());
  };

  // the cover (public/covers/assignment-3524578.jpg was drawn from this)
  S["tu-cover"] = (t) => {
    canopy(2, { dim: 1 });
    glow(W() * 0.5, H() * 0.3, W() * 0.7, "rgba(255,236,190,0.35)", 0.7);
    world.fliers.slice(0, 7).forEach((f, i) => flier(W() * (0.1 + i * 0.13), H() * (0.36 + f.y * 0.5), f.s * m() * 0.0032, 1 + i, 0.85));
    loomBeast(W() * 0.5, H() * 0.98, W() * 0.95, 3);
    world.motes.forEach((mt) => glow(mt.x * W(), H() * (0.35 + mt.y * 0.5), 4, hexA(TAIL[mt.c], 0.9), 0.6));
    pell(W() * 0.72, H() * 0.62, m() * 0.07, 1.5, 2);
  };

  return S;
}
