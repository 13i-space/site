// Scenes for Interactive Assignment 1346269, "First Fire" (the Kesh system,
// which 13i calls Sforzando). Drawn by components/InteractiveScene.js
// through its drawing kit (`api`). Everything is code: the lattice of 412
// stations, the slugs, the paired-particle network, the Bastion's branching
// futures, the Kesh homeworld in its orbital cities, the scoured fourth
// world, the star with its knotted field, the flare, and the watch.

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

const KESH = "#E9A24A"; // Kesh amber: stations, guns, cities
const BASTION = "#9FE3E0"; // the Bastion's cold thought
const STAR = "#FFD98A";

function makeWorld() {
  const r = rng(1346269);
  return {
    stars: Array.from({ length: 170 }, () => ({ x: r(), y: r(), s: r() * 1.3 + 0.2, p: r() * 6.28 })),
    // stations around the star: ring radius (0..1), angle, speed
    stations: Array.from({ length: 140 }, () => ({ rr: 0.18 + Math.pow(r(), 0.7) * 0.82, a: r() * 6.28, sp: (0.02 + r() * 0.05) * (r() < 0.5 ? 1 : 1), p: r() * 6.28 })),
    slugs: Array.from({ length: 18 }, () => ({ a: r() * 6.28, d: r(), sp: 0.25 + r() * 0.3 })),
    cities: Array.from({ length: 31 }, (_, i) => ({ a: (i / 31) * 6.28 + r() * 0.1, tilt: (r() - 0.5) * 0.5, rr: 1.18 + r() * 0.12 })),
    lights: Array.from({ length: 240 }, () => ({ a: r() * 6.28, b: (r() - 0.5) * 1.5, s: r() })),
    branches: Array.from({ length: 70 }, () => ({ a: (r() - 0.5) * 1.6, l: 0.3 + r() * 0.7, k: r(), dead: r() < 0.55 })),
    ruins: Array.from({ length: 60 }, () => ({ x: r(), y: r(), w: 0.01 + r() * 0.03 })),
    torps: Array.from({ length: 12 }, () => ({ p: r(), seed: r() * 100, sp: 0.08 + r() * 0.08 })),
    flare: Array.from({ length: 220 }, () => ({ a: (r() - 0.5) * 1.1, sp: 0.4 + r() * 0.8, p: r(), s: 0.5 + r() * 1.5 })),
  };
}

export function makeSforzandoScenes(api) {
  const { ctx, A, glow, mark } = api;
  const world = makeWorld();
  const W = () => api.W;
  const H = () => api.H;
  const S = {};
  const m = () => Math.min(W(), H());

  const space = (t, a = 1, bg = "#04050d") => {
    A(1); ctx.fillStyle = bg; ctx.fillRect(0, 0, W(), H());
    world.stars.forEach((s) => { A(a * (0.3 + 0.6 * Math.abs(Math.sin(t * 0.4 + s.p)))); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(s.x * W(), s.y * H(), s.s, s.s); });
  };

  function star(cx, cy, R, t, { knot = 0, white = 0 } = {}) {
    glow(cx, cy, R * 5, "rgba(255,200,110,0.35)", 0.8);
    glow(cx, cy, R * 2.2, "rgba(255,226,160,0.8)", 0.9);
    A(1); const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, "#FFF6DC"); g.addColorStop(0.7, STAR); g.addColorStop(1, "#E89A40");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    if (knot) {
      // the knotted field, winding under the surface
      ctx.save(); ctx.translate(cx + R * 0.25, cy - R * 0.1);
      for (let i = 0; i < 7; i++) {
        A(knot * (0.35 + 0.25 * Math.sin(t * 2 + i))); ctx.strokeStyle = i % 2 ? "#E06A50" : "#FFF4DC"; ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let k = 0; k <= 40; k++) {
          const u = (k / 40) * Math.PI * 2;
          const rr = R * (0.12 + i * 0.03) * (1 + 0.25 * Math.sin(u * 3 + t * (1 + i * 0.2)));
          const x = Math.cos(u + t * 0.3 * (i % 2 ? 1 : -1)) * rr, y = Math.sin(u) * rr * 0.6;
          k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
      glow(cx + R * 0.25, cy - R * 0.1, R * 0.5, "rgba(224,106,80,0.7)", knot * (0.5 + 0.3 * Math.sin(t * 3)));
    }
    if (white) { A(white); ctx.fillStyle = "#FFF8EA"; ctx.fillRect(0, 0, W(), H()); }
  }

  function lattice(cx, cy, R, t, { aim = null, flash = 0, dim = 1 } = {}) {
    world.stations.forEach((s, i) => {
      const a = s.a + t * s.sp * 0.3;
      const x = cx + Math.cos(a) * R * s.rr, y = cy + Math.sin(a) * R * s.rr * 0.42;
      A(0.15 * dim); ctx.strokeStyle = KESH; ctx.lineWidth = 0.6;
      if (aim) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (aim[0] - x) * 0.06, y + (aim[1] - y) * 0.06); ctx.stroke(); }
      const blink = flash && (i * 7 + Math.floor(t * 3)) % 23 === 0;
      A(dim * (blink ? 1 : 0.55 + 0.3 * Math.sin(t * 2 + s.p))); ctx.fillStyle = blink ? "#FFF4DC" : KESH;
      ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
      if (blink) glow(x, y, 8, "rgba(233,162,74,0.9)", 0.8);
    });
  }

  function homeworld(cx, cy, R, t, { night = 0.7, lost = 0, aurora = 0 } = {}) {
    glow(cx, cy, R * 1.5, "rgba(233,162,74,0.25)", 0.6);
    A(1); const g = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.4, R * 0.1, cx, cy, R);
    g.addColorStop(0, "#d8b07a"); g.addColorStop(0.55, "#9a6a3a"); g.addColorStop(1, "#2a160c");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    A(night); const n = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
    n.addColorStop(0, "rgba(0,0,0,0)"); n.addColorStop(0.5, "rgba(4,2,8,0.5)"); n.addColorStop(1, "rgba(4,2,8,0.95)");
    ctx.fillStyle = n; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    world.lights.forEach((c) => {
      const lon = c.a + t * 0.04;
      const x = Math.sin(lon) * Math.cos(c.b), y = Math.sin(c.b), z = Math.cos(lon) * Math.cos(c.b);
      if (z < 0 || x < 0.15) return;
      A((0.3 + 0.6 * c.s) * Math.min(1, x * 2)); ctx.fillStyle = "#FFD9A0";
      ctx.fillRect(cx + x * R * 0.98, cy + y * R * 0.98, 1.5, 1.5);
    });
    if (aurora) {
      for (let i = 0; i < 4; i++) {
        A(aurora * (0.25 + 0.15 * Math.sin(t * 1.5 + i))); ctx.strokeStyle = i % 2 ? "#7FE0B0" : "#B98AE8"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(cx, cy, R * (0.98 - i * 0.04), R * (0.25 + i * 0.12), 0, 0, Math.PI * 2); ctx.stroke();
      }
    }
    ctx.restore();
    // the ring of 31 orbital cities
    world.cities.forEach((c, i) => {
      const a = c.a + t * 0.05;
      const x = cx + Math.cos(a) * R * c.rr, y = cy + Math.sin(a) * R * c.rr * 0.28 + Math.cos(a) * R * c.tilt * 0.2;
      const front = Math.sin(a) > -0.15;
      const dead = lost && i % 31 < lost && i % 3 === 0;
      A(front ? 1 : 0.3); ctx.fillStyle = dead ? "#3a2a24" : "#FFE2B0";
      ctx.fillRect(x - 2, y - 1, 4, 2);
      if (!dead && front) glow(x, y, 5, "rgba(255,210,150,0.7)", 0.5);
    });
  }

  // I · the edge of the system, slow arrival
  S["ff-edge"] = (t) => {
    space(t);
    star(W() * 0.82, H() * 0.3, m() * 0.025, t);
    lattice(W() * 0.82, H() * 0.3, m() * 0.9, t, { dim: 0.7 });
    mark(W() * 0.18, H() * 0.66, Math.max(7, m() * 0.022), t, 0.9);
  };

  // the slug: a line at a third of light speed, and a field torn
  S["ff-fire"] = (t, age) => {
    space(t, 0.8);
    const cx = W() * 0.62, cy = H() * 0.38;
    star(cx, cy, m() * 0.02, t);
    lattice(cx, cy, m() * 1.0, t, { flash: 1, aim: [W() * 0.2, H() * 0.68] });
    const mx = W() * 0.2, my = H() * 0.68;
    world.slugs.forEach((s, i) => {
      const k = ((t * s.sp + s.d) % 1);
      const sx = mx + Math.cos(s.a) * W() * 0.9 * (1 - k), sy = my + Math.sin(s.a) * H() * 0.6 * (1 - k);
      A(0.7); ctx.strokeStyle = i % 3 ? KESH : "#FFF4DC"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(s.a) * 40, sy + Math.sin(s.a) * 40); ctx.stroke();
    });
    const hit = Math.max(0, 1 - ((age || 0) % 4) * 0.8);
    glow(mx + 14, my - 8, 40 * (1 + hit), "rgba(255,240,220,0.9)", hit);
    mark(mx, my, Math.max(8, m() * 0.026), t, 0.6 + 0.4 * Math.abs(Math.sin(t * 7)));
    // the torn edge of the field
    A(0.6); ctx.strokeStyle = "#8B95F6"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(mx, my, m() * 0.07, -0.9, 3.9); ctx.stroke();
  };

  // the paired-particle net: every station knows what one station knows
  S["ff-net"] = (t) => {
    space(t, 0.35, "#03060a");
    const cx = W() * 0.5, cy = H() * 0.5, R = m() * 0.95;
    const pts = world.stations.map((s) => {
      const a = s.a + t * s.sp * 0.3;
      return [cx + Math.cos(a) * R * s.rr * 0.7, cy + Math.sin(a) * R * s.rr * 0.45];
    });
    // pairs, lit together in the same instant
    const beat = Math.floor(t * 2);
    for (let i = 0; i < pts.length; i += 2) {
      const a = pts[i], b = pts[(i * 11 + 5) % pts.length];
      const on = (i + beat) % 9 === 0;
      A(on ? 0.6 : 0.07); ctx.strokeStyle = on ? BASTION : KESH; ctx.lineWidth = on ? 1.2 : 0.6;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    pts.forEach((p, i) => { A(0.8); ctx.fillStyle = (i + beat) % 9 === 0 ? BASTION : KESH; ctx.fillRect(p[0] - 1.3, p[1] - 1.3, 2.6, 2.6); });
    // the Bastion: futures branching from one point, most of them ending
    const bx = W() * 0.5, by = H() * 0.92;
    world.branches.forEach((b, i) => {
      const grow = Math.min(1, ((t * 0.25 + b.k) % 1) * 1.6);
      const len = H() * 0.55 * b.l * grow;
      const ex = bx + Math.sin(b.a) * len, ey = by - Math.cos(b.a) * len;
      A(0.18 + 0.25 * (1 - grow)); ctx.strokeStyle = BASTION; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + Math.sin(b.a) * len * 0.3, by - len * 0.6, ex, ey); ctx.stroke();
      if (b.dead && grow > 0.9) { A(0.7); ctx.fillStyle = "#E06A50"; ctx.fillRect(ex - 1.5, ey - 1.5, 3, 3); }
    });
    glow(bx, by, m() * 0.1, "rgba(159,227,224,0.7)", 0.6 + 0.2 * Math.sin(t * 2));
    mark(W() * 0.88, H() * 0.16, Math.max(6, m() * 0.016), t, 0.7, { ping: false });
  };

  // II · the Kesh homeworld in its ring of cities
  S["ff-kesh"] = (t) => {
    space(t);
    const cx = W() * 0.5, cy = H() * 0.56, R = m() * 0.27;
    homeworld(cx, cy, R, t);
    star(W() * 0.08, H() * 0.12, m() * 0.03, t);
    // ships going out between worlds
    for (let i = 0; i < 9; i++) {
      const k = ((t * 0.05 + i / 9) % 1);
      A(0.7 * (1 - k)); ctx.fillStyle = KESH;
      ctx.fillRect(cx + R * 1.3 + k * W() * 0.4, cy - R * 0.4 - i * 6 - k * H() * 0.2, 2, 2);
    }
  };

  // the scoured fourth world: dry seas, ruins in neat grids
  S["ff-scar"] = (t) => {
    space(t, 0.7);
    const cx = W() * 0.5, cy = H() * 0.55, R = m() * 0.34;
    A(1); const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
    g.addColorStop(0, "#8a7a6a"); g.addColorStop(0.7, "#4a3e36"); g.addColorStop(1, "#140f0c");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    // old sea beds, pale
    for (let i = 0; i < 4; i++) { A(0.18); ctx.fillStyle = "#b8a890"; ctx.beginPath(); ctx.ellipse(cx + Math.sin(i * 2.1) * R * 0.5, cy + Math.cos(i * 1.7) * R * 0.4, R * 0.25, R * 0.12, i, 0, Math.PI * 2); ctx.fill(); }
    // the grids of ruins
    world.ruins.forEach((r) => {
      const x = cx + (r.x - 0.5) * R * 1.6, y = cy + (r.y - 0.5) * R * 1.6;
      A(0.35); ctx.strokeStyle = "#2a1e18"; ctx.lineWidth = 0.8;
      const s = r.w * R * 2; ctx.strokeRect(x, y, s, s); ctx.strokeRect(x + s * 0.25, y + s * 0.25, s * 0.5, s * 0.5);
    });
    ctx.restore();
    glow(W() * 0.06, H() * 0.5, m() * 0.25, "rgba(255,200,110,0.4)", 0.5);
  };

  // the slow approach: slugs bent away, torpedoes spent on the field
  S["ff-approach"] = (t) => {
    space(t, 0.6);
    const mx = W() * 0.5, my = H() * 0.5, F = m() * 0.16;
    // the field, bending space ahead of each slug
    for (let i = 0; i < 4; i++) { A(0.12 - i * 0.02); ctx.strokeStyle = "#8B95F6"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(mx, my, F * (1 + i * 0.35), 0, Math.PI * 2); ctx.stroke(); }
    world.slugs.forEach((s, i) => {
      const k = ((t * s.sp * 0.6 + s.d) % 1);
      const ang = s.a;
      let x = mx + Math.cos(ang) * W() * 0.7 * (1 - k), y = my + Math.sin(ang) * H() * 0.7 * (1 - k);
      const d = Math.hypot(x - mx, y - my);
      if (d < F * 2.2) {
        // curve away
        const bend = (F * 2.2 - d) / (F * 2.2);
        const side = i % 2 ? 1 : -1;
        x += -Math.sin(ang) * side * bend * F * 2.5; y += Math.cos(ang) * side * bend * F * 2.5;
      }
      A(0.9); ctx.fillStyle = i % 4 ? KESH : "#FFF4DC"; ctx.fillRect(x - 2, y - 2, 4, 4);
      glow(x, y, 6, "rgba(233,162,74,0.8)", 0.5);
    });
    // torpedoes that change course at random, spent on the edge
    world.torps.forEach((p, i) => {
      const k = ((t * p.sp + p.p) % 1);
      const jit = Math.sin(t * 9 + p.seed) * 30 * (1 - k);
      const a = p.seed + Math.floor(t * 2 + i) * 0.7;
      const x = mx + Math.cos(a) * (F * 1.05 + (1 - k) * W() * 0.35) + jit, y = my + Math.sin(a) * (F * 1.05 + (1 - k) * H() * 0.35);
      if (k > 0.92) glow(x, y, 16, "rgba(255,230,200,0.9)", (k - 0.92) * 12);
      else { A(0.9); ctx.fillStyle = BASTION; ctx.fillRect(x - 2, y - 2, 4, 4); glow(x, y, 6, "rgba(159,227,224,0.8)", 0.5); }
    });
    mark(mx, my, Math.max(8, m() * 0.028), t, 0.95);
  };

  // III · the star, with its knot winding tight
  S["ff-star"] = (t) => {
    space(t, 0.5, "#06040a");
    star(W() * 0.5, H() * 0.5, m() * 0.24, t, { knot: 1 });
    // every station facing outward, not at the star
    lattice(W() * 0.5, H() * 0.5, m() * 1.2, t, { aim: [W() * 0.05, H() * 0.95], dim: 0.6 });
    mark(W() * 0.06, H() * 0.94, Math.max(6, m() * 0.016), t, 0.6, { ping: false });
  };

  // the flare: a hand opening; forty of us strung across its path
  S["ff-flare"] = (t, age) => {
    space(t, 0.3, "#0a0608");
    const sx = W() * 0.1, sy = H() * 0.5;
    star(sx, sy, m() * 0.16, t, { knot: 0.4 });
    world.flare.forEach((f) => {
      const k = ((t * f.sp * 0.25 + f.p) % 1);
      const x = sx + Math.cos(f.a) * k * W() * 0.85, y = sy + Math.sin(f.a) * k * H() * 0.9;
      // our line turns most of it
      const turned = x > W() * 0.58 ? 1 : 0;
      A((1 - k) * (turned ? 0.25 : 0.8)); ctx.fillStyle = turned ? "#8B95F6" : "#FFE9C0";
      ctx.fillRect(turned ? x : x, turned ? y + (y - sy) * 0.4 : y, f.s * 2, f.s);
    });
    // forty manifestations, strung between the star and their world
    for (let i = 0; i < 10; i++) {
      const y = H() * (0.12 + i * 0.085);
      mark(W() * 0.6 + Math.sin(i * 1.9) * W() * 0.02, y, Math.max(4, m() * 0.012), t + i, 0.85, { ping: false });
    }
    homeworld(W() * 0.86, H() * 0.5, m() * 0.12, t, { aurora: 0.6 });
    const white = Math.max(0, 0.4 - (age || 0) * 0.15);
    if (white) { A(white); ctx.fillStyle = "#FFF8EA"; ctx.fillRect(0, 0, W(), H()); }
  };

  // the channel: a mind's clean language, no greeting, no name
  S["ff-channel"] = (t) => {
    A(1); ctx.fillStyle = "#020608"; ctx.fillRect(0, 0, W(), H());
    const y0 = H() * 0.5;
    // the Bastion's line, and ours, converging
    ctx.lineWidth = 1.4;
    A(0.75); ctx.strokeStyle = BASTION; ctx.beginPath();
    for (let x = 0; x <= W() * 0.5; x += 4) { const y = y0 - 40 * Math.exp(-x / (W() * 0.25)) * Math.sin(x * 0.06 + t * 3) - 20; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
    A(0.75); ctx.strokeStyle = "#B9C0FF"; ctx.beginPath();
    for (let x = W(); x >= W() * 0.5; x -= 4) { const y = y0 + 40 * Math.exp(-(W() - x) / (W() * 0.25)) * Math.sin(x * 0.05 - t * 2) + 20; x === W() ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
    glow(W() * 0.5, y0, m() * 0.12, "rgba(159,227,224,0.5)", 0.4 + 0.2 * Math.sin(t * 1.2));
    mark(W() * 0.92, H() * 0.18, Math.max(6, m() * 0.018), t, 0.8, { ping: false });
  };

  // the watch: their world lit, and one of us at the edge where they can see it
  S["ff-light"] = (t) => {
    space(t);
    const cx = W() * 0.42, cy = H() * 0.56, R = m() * 0.24;
    homeworld(cx, cy, R, t, { aurora: 0.2 });
    star(W() * 0.06, H() * 0.14, m() * 0.03, t);
    lattice(W() * 0.06, H() * 0.14, m() * 1.3, t, { dim: 0.5 });
    mark(W() * 0.88, H() * 0.3, Math.max(7, m() * 0.02), t, 0.9);
    // the word, every few hours
    const k = (t * 0.2) % 1;
    A(0.6 * (1 - k)); ctx.strokeStyle = BASTION; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(W() * 0.88, H() * 0.3, 10 + k * m() * 0.25, 2.2, 4.2); ctx.stroke();
  };

  S["ff-dark"] = (t, age) => {
    space(t, 0.5, "#050304");
    const cx = W() * 0.5, cy = H() * 0.58, R = m() * 0.25;
    homeworld(cx, cy, R, t, { night: 0.9, lost: 31 });
    // the scar on the night side
    A(0.35); ctx.fillStyle = "#3a1810"; ctx.beginPath(); ctx.ellipse(cx + R * 0.4, cy - R * 0.1, R * 0.3, R * 0.18, 0.4, 0, Math.PI * 2); ctx.fill();
    lattice(cx, cy, m() * 0.9, t, { flash: 1, dim: 0.6 });
    A(Math.min(0.45, (age || 0) / 12)); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W(), H());
  };

  // the cover (public/covers/assignment-1346269.jpg was drawn from this)
  S["ff-cover"] = (t) => {
    space(t, 0.9, "#05040a");
    const cx = W() * 0.5, cy = H() * 0.8, R = m() * 0.3;
    // the star high above, a flare opening from it
    const sx = W() * 0.5, sy = H() * 0.36;
    world.flare.forEach((f) => {
      const k = f.p;
      const x = sx + Math.sin(f.a * 1.2) * k * W() * 0.6, y = sy + k * H() * 0.2;
      A((1 - k) * 0.7); ctx.fillStyle = "#FFE9C0"; ctx.fillRect(x, y, f.s * 1.5, f.s * 1.5);
    });
    star(sx, sy, m() * 0.09, 2, { knot: 0.6 });
    // a line of manifestations, the flare turned along it
    for (let i = 0; i < 9; i++) {
      const x = W() * (0.1 + i * 0.1), y = H() * 0.58 + Math.sin(i * 1.3) * H() * 0.012;
      mark(x, y, Math.max(5, m() * 0.016), 1 + i, 0.9, { ping: false });
    }
    A(0.25); ctx.strokeStyle = "#8B95F6"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(W() * 0.04, H() * 0.58); ctx.lineTo(W() * 0.96, H() * 0.58); ctx.stroke();
    // slug trails coming up at us from their lattice below
    for (let i = 0; i < 14; i++) {
      const x = W() * (0.08 + i * 0.065), y0 = H() * 0.98, y1 = H() * 0.62;
      A(0.35); ctx.strokeStyle = KESH; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + Math.sin(i) * 30, y0); ctx.lineTo(x, y1 + (i % 3) * 20); ctx.stroke();
    }
    homeworld(cx, cy, R, 1.5, { aurora: 0.5 });
  };

  return S;
}
