// Scenes for Interactive Assignment 0832040, "The Borrowed Seconds" (Ammet,
// which 13i calls Rubato). Drawn by components/InteractiveScene.js through
// its drawing kit (`api`). Everything is code: the signal-loud planet and
// its satellites, the network converging on Concord, Concord itself (a
// turning lattice of glyphs), a Velani city and a Velani speaking in neck
// colours, the borrowing records, the moon station, the crisis, and the
// nine borrowed seconds.

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

const NECK = ["#E8B4C8", "#E9D29A", "#6A8FE8", "#C97B6E"];

function makeWorld() {
  const r = rng(832040);
  return {
    stars: Array.from({ length: 160 }, () => ({ x: r(), y: r(), s: r() * 1.3 + 0.2, p: r() * 6.28 })),
    sats: Array.from({ length: 70 }, () => ({ a: r() * 6.28, rr: 1.12 + r() * 0.35, tilt: (r() - 0.5) * 0.9, sp: 0.1 + r() * 0.25 })),
    cities: Array.from({ length: 260 }, () => ({ a: r() * 6.28, b: (r() - 0.5) * 1.6, s: r() })),
    nodes: Array.from({ length: 90 }, () => ({ x: r(), y: r(), p: r() * 6.28 })),
    lattice: Array.from({ length: 140 }, () => ({ u: r() * 6.28, v: Math.acos(2 * r() - 1), g: Math.floor(r() * 8) })),
    towers: Array.from({ length: 34 }, (_, i) => ({ x: i / 34 + r() * 0.02, h: 0.12 + r() * 0.36, w: 0.012 + r() * 0.02, lit: r() })),
    packets: Array.from({ length: 40 }, () => ({ p: r(), lane: Math.floor(r() * 5), sp: 0.1 + r() * 0.15, hot: r() < 0.25 })),
  };
}

const GLYPHS = "⟡⌬⏃⍜⟁◬⋔⏚";

export function makeRubatoScenes(api) {
  const { ctx, A, glow, mark } = api;
  const world = makeWorld();
  const W = () => api.W;
  const H = () => api.H;
  const S = {};

  const space = (t, a = 1) => {
    A(1); ctx.fillStyle = "#04050f"; ctx.fillRect(0, 0, W(), H());
    world.stars.forEach((s) => { A(a * (0.3 + 0.6 * Math.abs(Math.sin(t * 0.5 + s.p)))); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(s.x * W(), s.y * H(), s.s, s.s); });
  };

  function planet(cx, cy, R, t, { red = 0 } = {}) {
    glow(cx, cy, R * 1.5, "rgba(110,170,255,0.45)", 0.6);
    A(1);
    const g = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.4, R * 0.1, cx, cy, R);
    g.addColorStop(0, "#3f8a8e"); g.addColorStop(0.6, "#1d4a6a"); g.addColorStop(1, "#08162e");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    // night side with city lights
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    A(0.6); const n = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
    n.addColorStop(0, "rgba(0,0,0,0)"); n.addColorStop(0.55, "rgba(0,0,10,0.4)"); n.addColorStop(1, "rgba(0,0,10,0.9)");
    ctx.fillStyle = n; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    world.cities.forEach((c) => {
      const lon = c.a + t * 0.05;
      const x = Math.sin(lon) * Math.cos(c.b * 0.9), y = Math.sin(c.b * 0.9), z = Math.cos(lon) * Math.cos(c.b * 0.9);
      if (z < 0 || x < 0.1) return;
      A((0.35 + 0.6 * c.s) * Math.min(1, x * 2));
      ctx.fillStyle = red && c.s > 0.6 ? "#E06A50" : "#F6D9A8";
      ctx.fillRect(cx + x * R, cy + y * R, 1.6, 1.6);
    });
    ctx.restore();
  }

  function satellites(cx, cy, R, t) {
    world.sats.forEach((s) => {
      const a = s.a + t * s.sp;
      const x = cx + Math.cos(a) * R * s.rr, y = cy + Math.sin(a) * R * s.rr * 0.35 + Math.cos(a) * R * s.tilt * 0.3;
      const front = Math.sin(a) > -0.2;
      A(front ? 0.9 : 0.25); ctx.fillStyle = "#DCDFFF"; ctx.fillRect(x, y, 1.6, 1.6);
    });
  }

  S["rubato-orbit"] = (t) => {
    space(t);
    const m = Math.min(W(), H());
    const cx = W() * 0.46, cy = H() * 0.56, R = m * 0.28;
    satellites(cx, cy, R, t - 100);
    planet(cx, cy, R, t);
    satellites(cx, cy, R, t);
    // two moons; the larger one has the station's tiny light
    A(1); ctx.fillStyle = "#9a9aa8"; ctx.beginPath(); ctx.arc(W() * 0.82, H() * 0.24, m * 0.05, 0, Math.PI * 2); ctx.fill();
    glow(W() * 0.82 + m * 0.02, H() * 0.24 + m * 0.03, 6, "rgba(233,210,154,0.9)", 0.6 + 0.4 * Math.sin(t * 3));
    A(1); ctx.fillStyle = "#6a6470"; ctx.beginPath(); ctx.arc(W() * 0.16, H() * 0.18, m * 0.022, 0, Math.PI * 2); ctx.fill();
    mark(W() * 0.86, H() * 0.7, Math.max(6, m * 0.016), t, 0.8, { ping: false });
  };

  // the network: every line converges on one place
  S["rubato-net"] = (t) => {
    space(t, 0.4);
    const cx = W() * 0.5, cy = H() * 0.5;
    world.nodes.forEach((n, i) => {
      const x = n.x * W(), y = n.y * H();
      A(0.12); ctx.strokeStyle = "#8B95F6"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cx, cy); ctx.stroke();
      const k = ((t * 0.3 + n.p) % 1);
      A(0.8); ctx.fillStyle = i % 4 ? "#B9C0FF" : "#E9D29A";
      ctx.fillRect(x + (cx - x) * k - 1, y + (cy - y) * k - 1, 2.4, 2.4);
      A(0.6); ctx.fillStyle = "#DCDFFF"; ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
    });
    glow(cx, cy, Math.min(W(), H()) * 0.2, "rgba(233,210,154,0.6)", 0.7 + 0.2 * Math.sin(t * 2));
    A(1); ctx.fillStyle = "#FFF4DC"; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
  };

  // Concord: a turning lattice of glyphs, with us inside it
  S["rubato-concord"] = (t) => {
    A(1); const g = ctx.createRadialGradient(W() / 2, H() / 2, 0, W() / 2, H() / 2, Math.max(W(), H()) * 0.7);
    g.addColorStop(0, "#1a1530"); g.addColorStop(1, "#05040c"); ctx.fillStyle = g; ctx.fillRect(0, 0, W(), H());
    const cx = W() / 2, cy = H() / 2, R = Math.min(W(), H()) * 0.38;
    const pts = world.lattice.map((p) => {
      const u = p.u + t * 0.12;
      const x = Math.sin(p.v) * Math.cos(u), y = Math.cos(p.v), z = Math.sin(p.v) * Math.sin(u);
      return { x: cx + x * R, y: cy + y * R * 0.9, z, g: p.g };
    });
    // threads between near neighbours
    for (let i = 0; i < pts.length; i += 2) {
      const a = pts[i], b = pts[(i * 7 + 3) % pts.length];
      A(0.08 + 0.1 * (a.z + 1) / 2); ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    pts.sort((a, b) => a.z - b.z).forEach((p) => {
      const d = (p.z + 1) / 2;
      ctx.font = `${10 + d * 10}px "JetBrains Mono", monospace`;
      A(0.25 + d * 0.7); ctx.fillStyle = d > 0.6 ? "#FFF4DC" : "#B9C0FF";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(GLYPHS[p.g], p.x, p.y);
    });
    glow(cx, cy, R * 0.6, "rgba(233,210,154,0.3)", 0.5 + 0.2 * Math.sin(t * 1.3));
    mark(cx, cy, Math.max(7, Math.min(W(), H()) * 0.02), t, 0.9);
  };

  function city(t, { red = 0, dawn = 0 } = {}) {
    A(1); const g = ctx.createLinearGradient(0, 0, 0, H());
    g.addColorStop(0, dawn ? "#2a3a6a" : "#05060f"); g.addColorStop(0.7, dawn ? "#c98a6a" : red ? "#2a0a10" : "#101836"); g.addColorStop(1, "#05060f");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W(), H());
    if (!dawn) world.stars.slice(0, 80).forEach((s) => { A(0.4); ctx.fillStyle = "#EDEBFF"; ctx.fillRect(s.x * W(), s.y * H() * 0.5, s.s, s.s); });
    const base = H() * 0.82;
    world.towers.forEach((tw, i) => {
      const x = tw.x * W(), h = tw.h * H(), w = tw.w * W();
      A(1); ctx.fillStyle = "#0a0c1e"; ctx.fillRect(x, base - h, w, h);
      for (let k = 0; k < h / 9; k++) {
        if (((i * 13 + k * 7) % 5) > 1) continue;
        A(0.5 + 0.3 * Math.sin(t + i + k)); ctx.fillStyle = red && k % 3 === 0 ? "#E06A50" : "#F6D9A8";
        ctx.fillRect(x + 2, base - h + 4 + k * 9, Math.max(1, w - 4), 2);
      }
      // the network on every roof
      if (tw.lit > 0.6) { A(0.6 + 0.4 * Math.sin(t * 3 + i)); ctx.fillStyle = red ? "#E06A50" : "#B9C0FF"; ctx.fillRect(x + w / 2 - 1, base - h - 6, 2, 6); }
    });
    A(1); ctx.fillStyle = "#04050c"; ctx.fillRect(0, base, W(), H() - base);
  }

  // a Velani, speaking in colour
  function velani(x, y, h, t, hue) {
    A(1); ctx.fillStyle = "#0b0d22"; ctx.strokeStyle = "#3A3E75"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.ellipse(x, y - h * 0.86, h * 0.07, h * 0.1, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); // head
    ctx.beginPath(); ctx.moveTo(x - h * 0.05, y - h * 0.76); ctx.lineTo(x - h * 0.13, y - h * 0.5); ctx.lineTo(x - h * 0.1, y); ctx.lineTo(x + h * 0.1, y); ctx.lineTo(x + h * 0.13, y - h * 0.5); ctx.lineTo(x + h * 0.05, y - h * 0.76); ctx.closePath(); ctx.fill(); ctx.stroke();
    // long six-fingered hands
    [-1, 1].forEach((sd) => { ctx.beginPath(); ctx.moveTo(x + sd * h * 0.12, y - h * 0.62); ctx.quadraticCurveTo(x + sd * h * 0.22, y - h * 0.4, x + sd * h * 0.18, y - h * 0.26); ctx.stroke(); });
    // the neck membranes, flushing
    const col = NECK[hue % NECK.length];
    [-1, 1].forEach((sd) => {
      A(0.75 + 0.25 * Math.sin(t * 2)); ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(x + sd * h * 0.05, y - h * 0.73, h * 0.02, h * 0.06, sd * 0.2, 0, Math.PI * 2); ctx.fill();
    });
    glow(x, y - h * 0.73, h * 0.18, "rgba(233,180,200,0.5)", 0.4 + 0.3 * Math.sin(t * 2));
  }

  S["rubato-velani"] = (t) => {
    city(t);
    const hue = Math.floor(t / 3) % 4;
    velani(W() * 0.3, H() * 0.98, H() * 0.6, t, hue);
    velani(W() * 0.72, H() * 0.98, H() * 0.54, t + 1, (hue + 2) % 4);
  };

  // the borrowings over sixty-one years
  S["rubato-logs"] = (t, age) => {
    A(1); ctx.fillStyle = "#06071a"; ctx.fillRect(0, 0, W(), H());
    const x0 = W() * 0.1, x1 = W() * 0.9, yb = H() * 0.82, yt = H() * 0.15;
    A(0.4); ctx.strokeStyle = "#3A3E75"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, yt); ctx.lineTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke();
    const shown = Math.min(1, age / 5);
    ctx.beginPath();
    for (let i = 0; i <= 61 * shown; i++) {
      const yr = i / 61;
      const v = i < 59 ? Math.exp(-i / 13) : 0.008 + (i - 58) * 0.008;
      const x = x0 + yr * (x1 - x0), y = yb - Math.min(1, v) * (yb - yt);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    A(1); ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = 2.5; ctx.stroke();
    A(0.7); ctx.fillStyle = "#8B95F6"; ctx.font = '11px "JetBrains Mono", monospace'; ctx.textAlign = "left";
    ctx.fillText("BORROWINGS PER DAY", x0 + 8, yt + 4); ctx.textAlign = "right"; ctx.fillText("YEAR 61", x1, yb + 18); ctx.textAlign = "left"; ctx.fillText("YEAR 1", x0, yb + 18);
    if (shown >= 1) glow(x1, yb - 0.03 * (yb - yt), 18, "rgba(224,106,80,0.9)", 0.6 + 0.4 * Math.sin(t * 4));
  };

  S["rubato-moon"] = (t) => {
    space(t, 0.7);
    const m = Math.min(W(), H());
    // Ammet in the sky
    planet(W() * 0.78, H() * 0.24, m * 0.12, t);
    // the surface
    A(1); const g = ctx.createLinearGradient(0, H() * 0.6, 0, H());
    g.addColorStop(0, "#6a6672"); g.addColorStop(1, "#222029"); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, H() * 0.66);
    for (let i = 0; i <= 20; i++) ctx.lineTo((i / 20) * W(), H() * (0.64 + Math.sin(i * 1.7) * 0.02));
    ctx.lineTo(W(), H()); ctx.lineTo(0, H()); ctx.fill();
    // the station: two halves, east and west, joined in the middle
    const sx = W() * 0.32, sy = H() * 0.66, u = m * 0.07;
    [[-2.2, "#C97B6E"], [-1.1, "#C97B6E"], [0, "#8a8aa0"], [1.1, "#8B95F6"], [2.2, "#8B95F6"]].forEach(([k, c], i) => {
      A(1); ctx.fillStyle = "#1a1a28"; ctx.strokeStyle = c; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(sx + k * u, sy - u * 0.45, u * 0.5, u * 0.45, 0, Math.PI, 0); ctx.fill(); ctx.stroke();
      ctx.fillRect(sx + k * u - u * 0.5, sy - u * 0.45, u, u * 0.45);
      glow(sx + k * u, sy - u * 0.5, u * 0.6, i < 2 ? "rgba(201,123,110,0.5)" : i > 2 ? "rgba(139,149,246,0.5)" : "rgba(233,210,154,0.5)", 0.4 + 0.2 * Math.sin(t * 2 + i));
    });
    // the ice crater
    A(0.5); ctx.strokeStyle = "#B9F0FF"; ctx.beginPath(); ctx.ellipse(W() * 0.72, H() * 0.82, m * 0.16, m * 0.03, 0, 0, Math.PI * 2); ctx.stroke();
  };

  S["rubato-crisis"] = (t) => {
    city(t, { red: 1 });
    // alerts flashing across the network
    for (let i = 0; i < 6; i++) {
      const y = H() * (0.1 + i * 0.07);
      A(0.25 + 0.25 * Math.sin(t * 6 + i)); ctx.fillStyle = "#E06A50";
      ctx.fillRect(((t * 120 * (1 + i * 0.2)) % (W() + 200)) - 200, y, 160, 2);
    }
    glow(W() * 0.5, H() * 0.4, W() * 0.4, "rgba(224,106,80,0.35)", 0.4 + 0.3 * Math.sin(t * 3));
  };

  // nine borrowed seconds: messages in lanes, one held
  S["rubato-seconds"] = (t, age) => {
    A(1); ctx.fillStyle = "#05060f"; ctx.fillRect(0, 0, W(), H());
    const lanes = 5, x0 = W() * 0.06, x1 = W() * 0.94;
    for (let l = 0; l < lanes; l++) {
      const y = H() * (0.2 + l * 0.14);
      A(0.25); ctx.strokeStyle = "#3A3E75"; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    }
    // Concord's gate in the middle
    const gx = W() * 0.5;
    A(0.6); ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx, H() * 0.14); ctx.lineTo(gx, H() * 0.82); ctx.stroke(); ctx.lineWidth = 1;
    world.packets.forEach((p) => {
      let k = (p.p + t * p.sp) % 1;
      const y = H() * (0.2 + p.lane * 0.14);
      // hot messages wait at the gate a moment, then pass cooler
      let x = x0 + k * (x1 - x0), col = p.hot ? "#E06A50" : "#B9C0FF";
      if (p.hot && x > gx - 8 && x < gx + 30) { x = gx - 6; col = "#E9D29A"; }
      if (p.hot && x >= gx + 30) col = "#E8CFC0";
      A(0.9); ctx.fillStyle = col; ctx.fillRect(x - 6, y - 3, 12, 6);
    });
    const sec = Math.min(9, Math.floor(age));
    ctx.font = `${Math.min(W(), H()) * 0.08}px "JetBrains Mono", monospace`; ctx.textAlign = "center";
    A(0.85); ctx.fillStyle = "#E9D29A"; ctx.fillText(`${sec}`, gx, H() * 0.93);
  };

  S["rubato-light"] = (t) => { city(t, { dawn: 1 }); glow(W() * 0.5, H() * 0.75, W() * 0.6, "rgba(255,226,170,0.45)", 0.6); };
  S["rubato-dark"] = (t, age) => { city(t); A(Math.min(0.6, age / 10)); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W(), H()); };

  // the cover (public/covers/assignment-0832040.jpg was drawn from this)
  S["rubato-cover"] = (t) => {
    space(t);
    const m = Math.min(W(), H());
    const cx = W() * 0.5, cy = H() * 0.66, R = m * 0.42;
    // Concord: threads from every city converging on one bright point
    world.nodes.forEach((n, i) => {
      const x = cx + (n.x - 0.5) * W() * 1.1, y = cy - R * 0.2 + (n.y - 0.5) * H() * 0.5;
      A(0.18); ctx.strokeStyle = i % 3 ? "#8B95F6" : "#E9D29A"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cx, cy - R * 1.25); ctx.stroke();
    });
    glow(cx, cy - R * 1.25, m * 0.12, "rgba(233,210,154,0.8)", 0.9);
    satellites(cx, cy, R, 3);
    planet(cx, cy, R, 1.2);
    satellites(cx, cy, R, 7);
    // the moon and its station light
    A(1); ctx.fillStyle = "#9a9aa8"; ctx.beginPath(); ctx.arc(W() * 0.8, H() * 0.38, m * 0.05, 0, Math.PI * 2); ctx.fill();
    glow(W() * 0.8 + m * 0.02, H() * 0.38 + m * 0.025, 14, "rgba(233,210,154,0.95)", 1);
    mark(W() * 0.2, H() * 0.42, Math.max(8, m * 0.03), t, 1, { ping: false });
  };

  return S;
}
