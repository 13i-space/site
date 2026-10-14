// Scenes for Interactive Assignment 5702887, "The Ring" (the world 13i
// calls Ritornello). Drawn by components/InteractiveScene.js through its
// drawing kit (`api`). Everything is code: the blue world and its moon,
// the lensing ring a still manifestation makes in the stars, hunters on the
// grass eleven thousand years ago, a city of round temples, the oldest
// book, the observatory on Hal Teru, the crowds, the eyepiece, Olun and
// Teodi, the temple steps, and words written across a whole sky.

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

const RING = "#F3E6C8";
const LAMP = "#F2C98A";

function makeWorld() {
  const r = rng(5702887);
  return {
    stars: Array.from({ length: 220 }, () => ({ x: r(), y: r(), s: r() * 1.3 + 0.2, p: r() * 6.28 })),
    grass: Array.from({ length: 120 }, () => ({ x: r(), h: 0.02 + r() * 0.05, p: r() * 6.28 })),
    bldg: Array.from({ length: 30 }, (_, i) => ({ x: i / 30, h: 0.1 + r() * 0.3, w: 0.022 + r() * 0.02, dome: r() < 0.25 })),
    crowd: Array.from({ length: 380 }, () => ({ x: r(), y: r(), p: r() * 6.28, torch: r() < 0.12 })),
    lines: Array.from({ length: 18 }, () => ({ w: 0.4 + r() * 0.6 })),
    sky: Array.from({ length: 6 }, () => Array.from({ length: 22 }, () => r())),
  };
}

export function makeRitornelloScenes(api) {
  const { ctx, A, glow, mark } = api;
  const world = makeWorld();
  const W = () => api.W;
  const H = () => api.H;
  const m = () => Math.min(W(), H());
  const S = {};

  const night = (t, a = 1, top = "#04050f", bottom = "#0d1430") => {
    A(1); const g = ctx.createLinearGradient(0, 0, 0, H()); g.addColorStop(0, top); g.addColorStop(1, bottom); ctx.fillStyle = g; ctx.fillRect(0, 0, W(), H());
    world.stars.forEach((s) => { A(a * (0.3 + 0.6 * Math.abs(Math.sin(t * 0.4 + s.p)))); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(s.x * W(), s.y * H(), s.s, s.s); });
  };

  // the Ring: starlight bent into a pale circle around a still manifestation
  function ring(x, y, R, t, a = 1) {
    glow(x, y, R * 1.6, "rgba(243,230,200,0.25)", a * 0.6);
    A(a * (0.55 + 0.15 * Math.sin(t * 0.8))); ctx.strokeStyle = RING; ctx.lineWidth = Math.max(1.2, R * 0.08);
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.stroke();
    // little arcs of lensed stars along it
    for (let i = 0; i < 8; i++) { const u = i * 0.785 + t * 0.02; A(a * 0.8); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(x + Math.cos(u) * R - 1, y + Math.sin(u) * R - 1, 2, 2); }
    ctx.lineWidth = 1;
  }

  function moon(x, y, R) {
    A(1); const g = ctx.createRadialGradient(x - R * 0.3, y - R * 0.3, R * 0.1, x, y, R); g.addColorStop(0, "#e6e2d6"); g.addColorStop(1, "#7a7466");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
  }

  function oduli(x, base, h, t, { hue = "#2a2e4a", line = "#8B95F6", look = 1, torch = 0, a = 1 } = {}) {
    // tall and slender, long jointed fingers, wide-set eyes, looking up
    A(a); ctx.fillStyle = hue; ctx.strokeStyle = line; ctx.lineWidth = Math.max(0.8, h * 0.012);
    ctx.beginPath(); ctx.ellipse(x, base - h * 0.88, h * 0.06, h * 0.08, look * -0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - h * 0.05, base - h * 0.78); ctx.lineTo(x - h * 0.09, base); ctx.lineTo(x + h * 0.09, base); ctx.lineTo(x + h * 0.05, base - h * 0.78); ctx.closePath(); ctx.fill(); ctx.stroke();
    A(a); ctx.fillStyle = "#FFF4DC"; ctx.beginPath(); ctx.arc(x - h * 0.035, base - h * 0.9, h * 0.012, 0, 7); ctx.arc(x + h * 0.035, base - h * 0.9, h * 0.012, 0, 7); ctx.fill();
    A(a); ctx.beginPath(); ctx.moveTo(x + h * 0.06, base - h * 0.66); ctx.lineTo(x + h * 0.14, base - h * (torch ? 0.85 : 0.45)); ctx.stroke();
    if (torch) glow(x + h * 0.14, base - h * 0.9, h * 0.12, "rgba(242,180,90,0.9)", a * (0.7 + 0.3 * Math.sin(t * 9 + x)));
  }

  function roundTemple(x, base, R, t) {
    A(1); ctx.fillStyle = "#1a1c2c"; ctx.strokeStyle = "#5a5e8a"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(x, base, R, Math.PI, 0); ctx.fill(); ctx.stroke();
    ctx.fillRect(x - R, base, R * 2, R * 0.25);
    A(1); ctx.fillStyle = "#04050f"; ctx.beginPath(); ctx.arc(x, base - R * 0.95, R * 0.14, 0, Math.PI * 2); ctx.fill();
    A(0.6); ctx.strokeStyle = RING; ctx.beginPath(); ctx.arc(x, base - R * 0.5, R * 0.18, 0, Math.PI * 2); ctx.stroke();
    glow(x, base - R * 0.95, R * 0.3, "rgba(243,230,200,0.6)", 0.3);
  }

  function city(t, { lit = 1 } = {}) {
    const base = H() * 0.84;
    world.bldg.forEach((b, i) => {
      const x = b.x * W(), h = b.h * H(), w = b.w * W();
      if (b.dome) { roundTemple(x + w / 2, base, w * 1.4, t); return; }
      A(1); ctx.fillStyle = "#101226"; ctx.fillRect(x, base - h, w, h);
      for (let k = 0; k < h / 10; k++) { if ((i + k) % 3) continue; A(0.55 * lit); ctx.fillStyle = LAMP; ctx.fillRect(x + 3, base - h + 5 + k * 10, w - 6, 2); }
    });
    // telegraph wires and a train
    A(0.25); ctx.strokeStyle = "#8a8ea8"; ctx.beginPath(); ctx.moveTo(0, base - H() * 0.2); ctx.quadraticCurveTo(W() * 0.5, base - H() * 0.16, W(), base - H() * 0.21); ctx.stroke();
    const tx = ((t * 40) % (W() + 200)) - 200; A(0.9); ctx.fillStyle = "#1c1f34"; ctx.fillRect(tx, base + 8, 160, 12); for (let i = 0; i < 6; i++) { A(0.8); ctx.fillStyle = LAMP; ctx.fillRect(tx + 8 + i * 25, base + 11, 10, 4); }
    A(1); ctx.fillStyle = "#06070f"; ctx.fillRect(0, base + 20, W(), H() - base - 20);
  }

  function mountain(t) {
    A(1); ctx.fillStyle = "#0a0c18"; ctx.beginPath(); ctx.moveTo(0, H()); ctx.lineTo(W() * 0.2, H() * 0.72); ctx.lineTo(W() * 0.45, H() * 0.5); ctx.lineTo(W() * 0.7, H() * 0.68); ctx.lineTo(W(), H() * 0.62); ctx.lineTo(W(), H()); ctx.fill();
    // the observatory dome on the summit, slit open
    const x = W() * 0.45, y = H() * 0.5;
    A(1); ctx.fillStyle = "#2a2e44"; ctx.beginPath(); ctx.arc(x, y, m() * 0.06, Math.PI, 0); ctx.fill();
    A(1); ctx.fillStyle = "#04050f"; ctx.fillRect(x - m() * 0.008, y - m() * 0.06, m() * 0.016, m() * 0.06);
    glow(x, y - m() * 0.01, m() * 0.04, "rgba(242,201,138,0.6)", 0.5);
    return { x, y };
  }

  S["ri-orbit"] = (t) => {
    night(t, 0.9, "#02030a", "#04060f");
    const cx = W() * 0.4, cy = H() * 0.56, R = m() * 0.26;
    glow(cx, cy, R * 1.4, "rgba(110,160,255,0.35)", 0.6);
    A(1); const g = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.4, R * 0.1, cx, cy, R); g.addColorStop(0, "#6a9fd8"); g.addColorStop(0.5, "#2a5a8a"); g.addColorStop(1, "#071528"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    for (let i = 0; i < 3; i++) { A(0.5); ctx.fillStyle = "#6a7a4a"; ctx.beginPath(); ctx.ellipse(cx + Math.sin(i * 2.4 + t * 0.03) * R * 0.5, cy + Math.cos(i * 1.7) * R * 0.4, R * 0.3, R * 0.18, i, 0, Math.PI * 2); ctx.fill(); }
    // city lights on the night edge
    for (let i = 0; i < 60; i++) { const u = i * 0.37, x = cx + R * 0.6 + Math.sin(u) * R * 0.3, y = cy + Math.cos(u * 1.3) * R * 0.7; A(0.6); ctx.fillStyle = LAMP; ctx.fillRect(x, y, 1.4, 1.4); }
    ctx.restore();
    moon(W() * 0.78, H() * 0.3, m() * 0.05);
    mark(W() * 0.9, H() * 0.14, Math.max(6, m() * 0.016), t, 0.8);
    ring(W() * 0.9, H() * 0.14, m() * 0.05, t, 0.5);
  };

  // eleven thousand years ago: hunters on the grass, looking up
  S["ri-past"] = (t) => {
    night(t, 1, "#03040c", "#141a30");
    moon(W() * 0.66, H() * 0.24, m() * 0.07);
    ring(W() * 0.8, H() * 0.2, m() * 0.07, t, 0.9);
    A(1); ctx.fillStyle = "#0b0f0c"; ctx.fillRect(0, H() * 0.8, W(), H() * 0.2);
    world.grass.forEach((g) => { A(0.7); ctx.strokeStyle = "#2a3a2a"; ctx.beginPath(); ctx.moveTo(g.x * W(), H() * 0.8); ctx.lineTo(g.x * W() + Math.sin(t + g.p) * 3, H() * (0.8 - g.h)); ctx.stroke(); });
    glow(W() * 0.25, H() * 0.82, m() * 0.08, "rgba(242,150,70,0.8)", 0.7 + 0.2 * Math.sin(t * 7));
    for (let i = 0; i < 5; i++) oduli(W() * (0.14 + i * 0.07), H() * 0.84, H() * 0.24, t, { hue: "#1a1a20", line: "#8a7a6a", look: 1 });
  };

  S["ri-city"] = (t) => {
    night(t, 0.7, "#05061a", "#1a2040");
    ring(W() * 0.5, H() * 0.18, m() * 0.04, t, 0.15);
    city(t);
  };

  // the oldest book
  S["ri-book"] = (t) => {
    A(1); ctx.fillStyle = "#120e0a"; ctx.fillRect(0, 0, W(), H());
    glow(W() * 0.5, H() * 0.4, W() * 0.5, "rgba(242,201,138,0.25)", 0.7);
    const bw = Math.min(W() * 0.8, H() * 1.1), bh = bw * 0.6, x0 = W() / 2 - bw / 2, y0 = H() * 0.5 - bh / 2;
    A(1); ctx.fillStyle = "#d8ccb0"; ctx.fillRect(x0, y0, bw / 2 - 2, bh); ctx.fillRect(x0 + bw / 2 + 2, y0, bw / 2 - 2, bh);
    A(0.5); ctx.fillStyle = "#3a2e20"; ctx.fillRect(x0 + bw / 2 - 2, y0, 4, bh);
    // the ring at the top of the first page
    A(0.9); ctx.strokeStyle = "#6a4a2a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x0 + bw * 0.25, y0 + bh * 0.2, bh * 0.08, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1;
    world.lines.forEach((l, i) => {
      const left = i < 9, k = i % 9;
      const x = left ? x0 + bw * 0.05 : x0 + bw * 0.55, y = y0 + bh * (left ? 0.36 : 0.1) + k * bh * (left ? 0.065 : 0.09);
      if (left && k > 8) return;
      A(0.6); ctx.fillStyle = "#3a2e20"; ctx.fillRect(x, y, bw * 0.4 * l.w, 2);
    });
  };

  S["ri-telescope"] = (t) => {
    night(t, 1, "#03040e", "#10162c");
    moon(W() * 0.24, H() * 0.2, m() * 0.04);
    const r = { x: W() * 0.74, y: H() * 0.2 };
    ring(r.x, r.y, m() * 0.035, t, 0.8);
    const o = mountain(t);
    A(0.18); ctx.strokeStyle = LAMP; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.x, o.y - m() * 0.05); ctx.lineTo(r.x, r.y); ctx.stroke(); ctx.lineWidth = 1;
  };

  S["ri-crowd"] = (t) => {
    night(t, 0.6, "#0a0610", "#2a1a20");
    roundTemple(W() * 0.5, H() * 0.5, m() * 0.22, t);
    world.crowd.forEach((c) => {
      const x = c.x * W(), y = H() * (0.56 + c.y * 0.42);
      const s = 3 + c.y * 6;
      A(0.85); ctx.fillStyle = "#0d0e1a"; ctx.fillRect(x - s * 0.3, y - s * 1.6, s * 0.6, s * 1.6);
      A(0.85); ctx.beginPath(); ctx.arc(x, y - s * 1.75, s * 0.32, 0, 7); ctx.fill();
      if (c.torch) glow(x + s * 0.4, y - s * 2.2, s * 1.6, "rgba(242,170,80,0.9)", 0.6 + 0.3 * Math.sin(t * 8 + c.p));
    });
    ring(W() * 0.82, H() * 0.12, m() * 0.035, t, 0.7);
  };

  // the eyepiece: primes in bent starlight
  S["ri-eyepiece"] = (t, age) => {
    A(1); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W(), H());
    const cx = W() / 2, cy = H() / 2, R = m() * 0.4;
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    A(1); ctx.fillStyle = "#03040c"; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    world.stars.slice(0, 90).forEach((s) => { A(0.6); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(cx - R + s.x * R * 2, cy - R + s.y * R * 2, s.s, s.s); });
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
    const shown = Math.min(12, Math.floor((age || 0) * 1.5));
    for (let i = 0; i < shown; i++) {
      const n = primes[i], row = cy - R * 0.6 + i * R * 0.1;
      for (let k = 0; k < n; k++) { A(0.9); ctx.fillStyle = RING; ctx.fillRect(cx - R * 0.8 + k * R * 0.04, row, 2.5, 2.5); }
    }
    ctx.restore();
    A(1); ctx.strokeStyle = "#2a2e44"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1;
  };

  // Olun in her chair, Teodi at the telescope
  S["ri-olun"] = (t) => {
    A(1); ctx.fillStyle = "#0c0d18"; ctx.fillRect(0, 0, W(), H());
    // the dome's open slit, stars in it
    A(1); ctx.fillStyle = "#04050f"; ctx.fillRect(W() * 0.45, 0, W() * 0.1, H() * 0.6);
    world.stars.slice(0, 30).forEach((s) => { A(0.7); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(W() * 0.45 + s.x * W() * 0.1, s.y * H() * 0.6, s.s, s.s); });
    ring(W() * 0.5, H() * 0.16, m() * 0.025, t, 0.8);
    // the telescope
    A(1); ctx.fillStyle = "#3a3e58"; ctx.save(); ctx.translate(W() * 0.5, H() * 0.66); ctx.rotate(-1.1); ctx.fillRect(-m() * 0.04, -m() * 0.025, m() * 0.38, m() * 0.05); ctx.restore();
    glow(W() * 0.5, H() * 0.95, W() * 0.5, "rgba(242,201,138,0.2)", 0.6);
    oduli(W() * 0.28, H() * 0.92, H() * 0.5, t, { hue: "#1e2236", line: "#B9C0FF", look: 0.5 });
    // Olun, seated
    A(1); ctx.fillStyle = "#2a1e1a"; ctx.fillRect(W() * 0.66, H() * 0.7, W() * 0.12, H() * 0.22);
    oduli(W() * 0.72, H() * 0.8, H() * 0.36, t, { hue: "#3a2a30", line: "#E8CFC0", look: 1 });
  };

  S["ri-temple"] = (t) => {
    A(1); const g = ctx.createLinearGradient(0, 0, 0, H()); g.addColorStop(0, "#2a3a6a"); g.addColorStop(0.6, "#c98a6a"); g.addColorStop(1, "#2a1a20"); ctx.fillStyle = g; ctx.fillRect(0, 0, W(), H());
    roundTemple(W() * 0.5, H() * 0.6, m() * 0.3, t);
    // steps
    for (let i = 0; i < 4; i++) { A(1); ctx.fillStyle = i % 2 ? "#3a2e34" : "#2e2430"; ctx.fillRect(W() * 0.5 - m() * (0.32 + i * 0.05), H() * (0.675 + i * 0.03), m() * (0.64 + i * 0.1), H() * 0.03); }
    oduli(W() * 0.5, H() * 0.675, H() * 0.18, t, { hue: "#3a2a30", line: "#E8CFC0" });
    world.crowd.slice(0, 220).forEach((c) => { const x = c.x * W(), y = H() * (0.8 + c.y * 0.2), s = 2 + c.y * 4; A(0.85); ctx.fillStyle = "#1a1220"; ctx.fillRect(x - s * 0.3, y - s * 1.6, s * 0.6, s * 1.6); });
    ring(W() * 0.84, H() * 0.12, m() * 0.03, t, 0.5);
  };

  // words across the whole sky
  S["ri-sky"] = (t, age) => {
    night(t, 0.5, "#05061a", "#1a1a30");
    const k = Math.min(1, (age || 0) / 4);
    world.sky.forEach((row, i) => row.forEach((v, j) => {
      if (j / row.length > k) return;
      const x = W() * (0.06 + j * 0.04), y = H() * (0.1 + i * 0.07);
      A(0.85); ctx.fillStyle = RING; ctx.fillRect(x, y, W() * 0.025 * (0.4 + v * 0.6), H() * 0.02);
      if (v > 0.8) glow(x, y, 10, "rgba(243,230,200,0.6)", 0.3);
    }));
    city(t, { lit: 0.6 });
  };

  S["ri-dark"] = (t, age) => {
    night(t, 0.4, "#030308", "#0a0a14");
    city(t, { lit: 0.25 });
    A(Math.min(0.5, (age || 0) / 12)); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W(), H());
  };

  // the cover (public/covers/assignment-5702887.jpg was drawn from this)
  S["ri-cover"] = (t) => {
    night(1, 1, "#03040e", "#141a34");
    ring(W() * 0.5, H() * 0.46, m() * 0.17, 1.5, 1);
    mark(W() * 0.5, H() * 0.46, Math.max(6, m() * 0.022), 1, 0.7, { ping: false });
    moon(W() * 0.2, H() * 0.36, m() * 0.05);
    A(1); ctx.fillStyle = "#0a0c18"; ctx.beginPath(); ctx.moveTo(0, H()); ctx.lineTo(0, H() * 0.8); ctx.lineTo(W() * 0.3, H() * 0.74); ctx.lineTo(W() * 0.7, H() * 0.78); ctx.lineTo(W(), H() * 0.72); ctx.lineTo(W(), H()); ctx.fill();
    roundTemple(W() * 0.3, H() * 0.82, m() * 0.08, 1);
    for (let i = 0; i < 3; i++) oduli(W() * (0.58 + i * 0.09), H() * 0.9, H() * 0.16, 1, { hue: "#141626", line: "#B9C0FF", look: 1 });
  };

  return S;
}
