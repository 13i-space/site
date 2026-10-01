// Scenes for Interactive Assignment 0028657, "The Quiet Moon" (Tacet).
// Drawn by components/InteractiveScene.js, which hands over its drawing kit
// (`api`). Everything is code: the loud moon, the ice ocean, the silence, the
// lattice of holders and its touch-ripples, the young in still water.
//
// focus: holder numbers to light warm (1 = the holder that first touched us)
// pose:  "ripple" - the lattice is talking (more ripples)

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

function makeWorld() {
  const r = rng(28657);
  // the lattice: a hex sheet hanging under the ice, in normalized units
  const cols = 15, rows = 4;
  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = (col + (row % 2) * 0.5 + 0.25) / cols;
      const y = 0.12 + row * 0.075;
      cells.push({ x, y, row, col, p: r() * 6.28, age: r() * 0.35, wob: 0.6 + r() * 0.6 });
    }
  }
  // the first holder: bottom row, just left of center (it comes down to meet us)
  const firstIdx = cells.findIndex((c) => c.row === rows - 1 && c.col === 7);
  cells.forEach((c, i) => { c.id = i === firstIdx ? 1 : i + 2; });
  // old ones at the edges
  cells.forEach((c) => { if (c.col === 0 || c.col === cols - 1) c.age = 0.75 + r() * 0.2; });
  const motes = Array.from({ length: 160 }, () => ({ x: r(), y: r(), vx: (r() - 0.5) * 0.12, vy: (r() - 0.5) * 0.08, s: r() * 1.5 + 0.4, p: r() * 6.28 }));
  const rings = Array.from({ length: 14 }, () => ({ x: r(), y: 0.25 + r() * 0.7, p: r(), sp: 0.4 + r() * 0.8 }));
  const young = Array.from({ length: 130 }, () => ({ x: r(), y: 0.34 + r() * 0.3, p: r() * 6.28, s: 0.6 + r() * 1.4, d: (r() - 0.5) * 0.004 }));
  const stars = Array.from({ length: 160 }, () => ({ x: r(), y: r(), s: r() * 1.3 + 0.2, p: r() * 6.28 }));
  const cracks = Array.from({ length: 9 }, () => {
    const pts = [[r(), 0]];
    let x = pts[0][0], y = 0;
    for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 0.08; y += 0.02 + r() * 0.03; pts.push([x, y]); }
    return { pts, p: r() * 6.28 };
  });
  const ripples = Array.from({ length: 4 }, (_, i) => ({ cell: Math.floor(r() * cells.length), offset: i * 1.7 }));
  return { cells, cols, rows, motes, rings, young, stars, cracks, ripples };
}

export function makeTacetScenes(api) {
  const { ctx, A, glow, mark, focus } = api;
  const world = makeWorld();
  const W = () => api.W;
  const H = () => api.H;

  function bg(top, bottom) {
    A(1);
    const g = ctx.createLinearGradient(0, 0, 0, H());
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W(), H());
  }

  // the underside of the ice shell, with cracks that flicker when it's loud
  function iceCeiling(t, loud = 0) {
    A(1);
    const g = ctx.createLinearGradient(0, 0, 0, H() * 0.12);
    g.addColorStop(0, "#28305e");
    g.addColorStop(1, "#141938");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i <= 30; i++) {
      const x = (i / 30) * W();
      const jag = Math.sin(i * 2.7) * 0.012 + Math.sin(i * 0.9) * 0.018;
      ctx.lineTo(x, H() * (0.075 + jag));
    }
    ctx.lineTo(W(), 0);
    ctx.fill();
    if (loud > 0) {
      world.cracks.forEach((c) => {
        const f = Math.max(0, Math.sin(t * 7 + c.p));
        A(loud * f * 0.7);
        ctx.strokeStyle = "#B9C0FF";
        ctx.lineWidth = 1;
        ctx.beginPath();
        c.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * W(), y * H()) : ctx.moveTo(x * W(), y * H())));
        ctx.stroke();
      });
    }
  }

  function motes(t, speed = 1, a = 0.4) {
    ctx.fillStyle = "#B9C0FF";
    world.motes.forEach((m) => {
      const x = (((m.x + m.vx * t * speed) % 1) + 1) % 1;
      const y = (((m.y + m.vy * t * speed) % 1) + 1) % 1;
      A(a * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.7 + m.p))));
      ctx.fillRect(x * W(), y * H(), m.s, m.s);
    });
  }

  // noise made visible: rings bursting everywhere
  function noiseRings(t, amount = 1) {
    if (amount <= 0.01) return;
    world.rings.forEach((g) => {
      const ph = (t * g.sp + g.p) % 1;
      A(amount * (1 - ph) * 0.5);
      ctx.strokeStyle = g.p > 0.7 ? "#C97B6E" : "#8B95F6";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(g.x * W(), g.y * H(), ph * Math.min(W(), H()) * 0.16, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  // how lit each holder is by the touch-language passing across the sheet
  function rippleAt(c, t, intensity) {
    let v = 0;
    const n = intensity > 1 ? world.ripples.length : 2;
    for (let i = 0; i < n; i++) {
      const rp = world.ripples[i];
      const o = world.cells[(rp.cell + Math.floor((t + rp.offset) / 6.5) * 7) % world.cells.length];
      const age = ((t + rp.offset) % 6.5);
      const d = Math.hypot((c.x - o.x) * 1.6, c.y - o.y);
      const front = age * 0.28;
      const k = Math.exp(-Math.pow((d - front) * 14, 2));
      // press · hold · release: the front has a rhythm
      v += k * (0.6 + 0.4 * Math.sin(age * 9));
    }
    return Math.min(1, v * intensity);
  }

  function hex(x, y, r, wob, t, p) {
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
      const rr = r * (1 + Math.sin(t * 0.8 + p + k) * 0.05 * wob);
      const px = x + Math.cos(a) * rr;
      const py = y + Math.sin(a) * rr * 0.62;
      k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath();
  }

  // the lattice. opts: ripple intensity, quake front (0..1 across, or null),
  // gap (a hole around x=0.5), dim, whiten (extra age), skipFirst
  function lattice(t, opts = {}) {
    const { ripple = 1, quake = null, gap = false, dim = 1, whiten = 0, skip = null, yShift = 0 } = opts;
    const f = focus();
    const R = (W() / world.cols) * 0.56;
    world.cells.forEach((c) => {
      if (skip && skip(c)) return;
      const x = c.x * W();
      const y = (c.y + yShift) * H() + Math.sin(t * 0.6 + c.x * 6) * H() * 0.006;
      let aged = Math.min(1, c.age + whiten);
      if (gap) {
        const d = Math.hypot((c.x - 0.5) * 1.6, c.y - 0.2);
        if (d < 0.17) return;
        if (d < 0.24) aged = Math.max(aged, 0.85);
      }
      let lit = rippleAt(c, t, ripple);
      let q = 0;
      if (quake !== null) {
        q = Math.exp(-Math.pow((c.x - quake) * 9, 2)) * Math.max(0, 1 - c.x * 0.95);
      }
      const focused = f.includes(c.id);
      // membrane
      A(dim * (0.32 + lit * 0.4 + q * 0.4));
      const col = aged > 0.7 ? `rgba(${200 + aged * 40},${200 + aged * 30},${215 + aged * 25},1)` : "rgba(150,165,255,1)";
      ctx.fillStyle = q > 0.2 ? "rgba(201,123,110,1)" : focused ? "rgba(232,207,192,1)" : col;
      hex(x, y, R, c.wob, t, c.p);
      ctx.globalAlpha = Math.max(0, ctx.globalAlpha * 0.35);
      ctx.fill();
      A(dim * (0.35 + lit * 0.5));
      ctx.strokeStyle = focused ? "#E8CFC0" : aged > 0.7 ? "#DCDFFF" : "#8B95F6";
      ctx.lineWidth = focused ? 1.6 : 0.9;
      ctx.stroke();
      // filaments hanging below
      A(dim * 0.25);
      ctx.strokeStyle = "#8B95F6";
      ctx.lineWidth = 0.6;
      for (let k = -1; k <= 1; k++) {
        ctx.beginPath();
        ctx.moveTo(x + k * R * 0.35, y + R * 0.5);
        ctx.quadraticCurveTo(x + k * R * 0.4 + Math.sin(t + c.p + k) * 4, y + R * 0.9, x + k * R * 0.3, y + R * 1.2);
        ctx.stroke();
      }
      // knots where they join, lit by touch
      if (lit > 0.15 || focused || q > 0.2) {
        glow(x, y, R * (0.6 + lit * 0.8), q > 0.2 ? "rgba(201,123,110,0.9)" : focused ? "rgba(232,207,192,0.95)" : "rgba(185,192,255,0.9)", dim * Math.max(lit, focused ? 0.8 : 0, q));
      }
    });
  }

  function giant(t) {
    const R = Math.max(W(), H()) * 0.5;
    const gx = W() * 0.86, gy = H() * 0.42;
    glow(gx, gy, R * 1.25, "rgba(201,140,120,0.35)", 1);
    A(1);
    ctx.save();
    ctx.beginPath();
    ctx.arc(gx, gy, R, 0, Math.PI * 2);
    ctx.clip();
    const g = ctx.createLinearGradient(gx - R, gy - R, gx + R, gy + R);
    g.addColorStop(0, "#7a5a6e");
    g.addColorStop(1, "#24182c");
    ctx.fillStyle = g;
    ctx.fillRect(gx - R, gy - R, R * 2, R * 2);
    // bands curve with the sphere
    for (let i = 0; i < 16; i++) {
      const v = -1 + (i + 0.5) / 8;
      A(0.13 + (i % 3) * 0.04);
      ctx.strokeStyle = i % 2 ? "#E8CFC0" : "#C97B6E";
      ctx.lineWidth = R * (0.025 + (i % 4) * 0.012);
      ctx.beginPath();
      ctx.ellipse(gx, gy + v * R * 0.92, R * Math.sqrt(Math.max(0, 1 - v * v)) * 1.05, R * 0.07, -0.08, 0, Math.PI * 2);
      ctx.stroke();
    }
    // night side, toward us
    A(1);
    const sh = ctx.createRadialGradient(gx + R * 0.45, gy - R * 0.2, R * 0.2, gx, gy, R * 1.05);
    sh.addColorStop(0, "rgba(0,0,0,0)");
    sh.addColorStop(1, "rgba(3,4,11,0.85)");
    ctx.fillStyle = sh;
    ctx.fillRect(gx - R, gy - R, R * 2, R * 2);
    ctx.restore();
    // the giant's radio howl
    for (let k = 0; k < 4; k++) {
      const ph = (t * 0.6 + k / 4) % 1;
      A((1 - ph) * 0.35);
      ctx.strokeStyle = "#8B95F6";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(gx, gy, R * (1.05 + ph * 0.5), R * (0.35 + ph * 0.25), -0.2, Math.PI * 0.6, Math.PI * 1.45);
      ctx.stroke();
    }
  }

  function moon(t, mx, my, mr, { silentGlow = 1 } = {}) {
    glow(mx, my, mr * 1.6, "rgba(185,192,255,0.3)", 1);
    A(1);
    const g = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
    g.addColorStop(0, "#e4e8ff");
    g.addColorStop(1, "#5a6292");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.clip();
    // fractures, flexing
    world.cracks.forEach((c, i) => {
      A(0.35 + 0.35 * Math.max(0, Math.sin(t * 3 + c.p)));
      ctx.strokeStyle = "#3a4275";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      c.pts.forEach(([x, y], k) => {
        const px = mx - mr + x * mr * 2;
        const py = my - mr + (y + (i % 3) * 0.25) * mr * 1.6;
        k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      ctx.stroke();
    });
    // the silence: a smooth, perfectly still patch on the southern ice
    A(0.9 * silentGlow);
    const sg = ctx.createRadialGradient(mx - mr * 0.15, my + mr * 0.55, 0, mx - mr * 0.15, my + mr * 0.55, mr * 0.4);
    sg.addColorStop(0, "#0d1030");
    sg.addColorStop(1, "rgba(13,16,48,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(mx - mr, my, mr * 2, mr);
    ctx.restore();
    // geysers on the loud ice
    for (let i = 0; i < 3; i++) {
      const a = -2.4 + i * 0.5;
      const ph = (t * 0.5 + i * 0.37) % 1;
      const bx = mx + Math.cos(a) * mr, by = my + Math.sin(a) * mr;
      A((1 - ph) * 0.7);
      ctx.fillStyle = "#DCDFFF";
      for (let k = 0; k < 6; k++) {
        const d = ph * mr * 0.5 * (k / 6 + 0.3);
        ctx.fillRect(bx + Math.cos(a) * d + Math.sin(k * 3 + t) * 2, by + Math.sin(a) * d, 1.6, 1.6);
      }
    }
  }

  const S = {};

  S["tacet-orbit"] = (t) => {
    A(1);
    ctx.fillStyle = "#03040b";
    ctx.fillRect(0, 0, W(), H());
    world.stars.forEach((s) => {
      A(0.3 + 0.6 * Math.abs(Math.sin(t * 0.4 + s.p)));
      ctx.fillStyle = "#DCDFFF";
      ctx.fillRect(s.x * W(), s.y * H(), s.s, s.s);
    });
    giant(t);
    const mr = Math.min(W(), H()) * 0.16;
    const shake = Math.sin(t * 23) * 0.6;
    moon(t, W() * 0.36 + shake, H() * 0.42, mr);
    mark(W() * 0.14, H() * 0.2, Math.max(7, Math.min(W(), H()) * 0.02), t, 0.85);
  };

  S["tacet-under"] = (t) => {
    bg("#0f1640", "#03050f");
    motes(t, 4, 0.5);
    noiseRings(t, 1);
    iceCeiling(t, 1);
    mark(W() * 0.5, H() * 0.48, Math.max(8, Math.min(W(), H()) * 0.026), t, 1);
  };

  S["tacet-silence"] = (t, age) => {
    const k = Math.min(1, age / 3);
    bg("#0b1030", "#020309");
    motes(t * (1 - k * 0.97), 4 * (1 - k), 0.45 * (1 - k * 0.6));
    noiseRings(t, 1 - k);
    iceCeiling(t, 1 - k);
    // only gravity left: contour lines around the mass above
    for (let i = 1; i <= 7; i++) {
      A(k * 0.16);
      ctx.strokeStyle = "#E8CFC0";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(W() * 0.5, H() * 0.14, W() * 0.08 * i, H() * 0.03 * i, 0, 0, Math.PI);
      ctx.stroke();
    }
    mark(W() * 0.5, H() * 0.55, Math.max(8, Math.min(W(), H()) * 0.026), t, 1, { ping: false });
  };

  S["tacet-lattice"] = (t, age) => {
    bg("#0a0f2c", "#020309");
    motes(t * 0.05, 0.2, 0.2);
    iceCeiling(t, 0);
    const pose = api.pose();
    lattice(t, { ripple: pose === "ripple" ? 2.2 : 1, dim: Math.min(1, 0.3 + age / 2.5) });
    mark(W() * 0.5, H() * 0.6, Math.max(8, Math.min(W(), H()) * 0.024), t, 0.9, { ping: false });
  };

  // the forty that came down, wrapped around us
  function wrap(t, { dimness = 0 } = {}) {
    const f = focus();
    const cx = W() * 0.5, cy = H() * 0.46;
    const R = Math.min(W(), H()) * 0.13;
    for (let i = 0; i < 11; i++) {
      const a = (i / 11) * Math.PI * 2 + t * 0.05;
      const br = 0.5 + 0.5 * Math.sin(t * 1.3 - i * 0.6); // the press travels round
      const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.8;
      const focused = f.includes(1) && i === 3;
      A(0.4 + br * 0.3);
      ctx.fillStyle = focused ? "rgba(232,207,192,0.35)" : `rgba(${150 + dimness * 80},${165 + dimness * 60},255,0.22)`;
      ctx.beginPath();
      ctx.ellipse(x, y, R * 0.55, R * 0.28, a + Math.PI / 2, 0, Math.PI * 2);
      ctx.fill();
      A(0.5 + br * 0.4);
      ctx.strokeStyle = focused ? "#E8CFC0" : dimness > 0.5 ? "#DCDFFF" : "#8B95F6";
      ctx.lineWidth = focused ? 1.6 : 1;
      ctx.stroke();
      glow(x, y, R * 0.35, focused ? "rgba(232,207,192,0.9)" : "rgba(185,192,255,0.8)", br * (focused ? 0.9 : 0.5) * (1 - dimness * 0.6));
    }
  }

  S["tacet-wrap"] = (t) => {
    bg("#0a0f2c", "#020309");
    iceCeiling(t, 0);
    lattice(t, { ripple: 0.6, dim: 0.45, skip: (c) => Math.abs(c.x - 0.5) < 0.08 && c.row >= 2 });
    mark(W() * 0.5, H() * 0.46, Math.max(8, Math.min(W(), H()) * 0.026), t, 0.9, { ping: false });
    wrap(t, { dimness: focus().includes(1) ? 0.6 : 0.2 });
  };

  S["tacet-field"] = (t) => {
    bg("#0c0f2a", "#020309");
    iceCeiling(t, 0.3);
    lattice(t, { ripple: 0.4, gap: true, dim: 0.85 });
    const cx = W() * 0.5, cy = H() * 0.5;
    for (let k = 0; k < 3; k++) {
      const ph = (t * 0.5 + k / 3) % 1;
      A((1 - ph) * 0.6);
      ctx.strokeStyle = "#C97B6E";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(W(), H()) * (0.05 + ph * 0.32), 0, Math.PI * 2);
      ctx.stroke();
    }
    noiseRings(t, 0.6);
    mark(cx, cy, Math.max(8, Math.min(W(), H()) * 0.028), t, 1);
  };

  S["tacet-quake"] = (t) => {
    bg("#0a0f2c", "#020309");
    iceCeiling(t, 0.4);
    const front = ((t * 0.16) % 1.3) - 0.1;
    // the shock in the ice above, fading as the lattice takes it
    A(Math.max(0, 0.7 - front * 0.8));
    ctx.strokeStyle = "#C97B6E";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const y = (i / 40) * H() * 0.4;
      const x = front * W() + Math.sin(i * 1.7 + t * 9) * 6 * Math.max(0, 1 - front);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
    lattice(t, { ripple: 0.5, quake: front, gap: api.flag && api.flag("afraid") });
    mark(W() * 0.5, H() * 0.62, Math.max(8, Math.min(W(), H()) * 0.022), t, 0.6, { ping: false });
  };

  S["tacet-young"] = (t) => {
    bg("#070a22", "#010208");
    // the lattice far above, a roof
    lattice(t, { ripple: 0.4, dim: 0.35, yShift: -0.06 });
    world.young.forEach((y) => {
      const x = (((y.x + Math.sin(t * 0.1 + y.p) * 0.01 + t * y.d) % 1) + 1) % 1;
      const yy = y.y + Math.sin(t * 0.3 + y.p) * 0.006;
      glow(x * W(), yy * H(), 7 + y.s * 4, "rgba(232,207,192,0.9)", 0.5 + 0.35 * Math.sin(t * 1.1 + y.p));
      A(0.9);
      ctx.fillStyle = "#F4E4DA";
      ctx.fillRect(x * W() - 1, yy * H() - 1, 2, 2);
    });
  };

  S["tacet-spent"] = (t, age) => {
    bg("#0a0f2c", "#020309");
    iceCeiling(t, 0);
    const spent = world.cells.find((c) => c.row === world.rows - 1 && c.col === 2);
    lattice(t, { ripple: 0.5, skip: (c) => c === spent });
    // neighbours press long and slow; then the spent one falls away
    const fall = Math.min(1, Math.max(0, (age - 2) / 9));
    const x = spent.x * W() + fall * W() * 0.03;
    const y = (spent.y + fall * 0.65) * H();
    const R = (W() / world.cols) * 0.56;
    A(0.75 * (1 - fall * 0.6));
    ctx.fillStyle = "rgba(225,228,245,0.5)";
    hex(x, y, R, 0.2, t * 0.2, spent.p);
    ctx.fill();
    A(0.8 * (1 - fall * 0.6));
    ctx.strokeStyle = "#DCDFFF";
    ctx.lineWidth = 1;
    ctx.stroke();
    glow(spent.x * W(), spent.y * H(), R * 1.6, "rgba(185,192,255,0.6)", (1 - fall) * (0.5 + 0.5 * Math.sin(t * 0.9)));
  };

  S["tacet-woven"] = (t) => {
    bg("#0a0f2c", "#020309");
    iceCeiling(t, 0);
    const center = world.cells.find((c) => c.row === world.rows - 1 && c.col === 8);
    lattice(t, { ripple: 0.9, skip: (c) => c === center });
    // 13i as one more body in the sheet: silent, no ping, barely lit
    mark(center.x * W(), center.y * H(), Math.max(6, Math.min(W(), H()) * 0.018), t, 0.55, { ping: false });
  };

  S["tacet-light"] = (t, age) => {
    const up = Math.min(1, age / 6);
    bg("#0e1745", "#03040c");
    iceCeiling(t, 0);
    lattice(t, { ripple: 1.2 });
    world.young.slice(0, 70).forEach((y) => {
      glow(y.x * W(), (0.44 + (y.y - 0.34) * 0.6) * H(), 4 + y.s * 2, "rgba(232,207,192,0.9)", up * (0.3 + 0.3 * Math.sin(t + y.p)));
    });
    glow(W() * 0.5, H() * 0.3, W() * 0.5, "rgba(185,192,255,0.2)", up);
  };

  S["tacet-dark"] = (t, age) => {
    const down = Math.min(1, age / 8);
    bg("#05061a", "#000");
    iceCeiling(t, 0);
    lattice(t, { ripple: 0.3, dim: 0.5 - down * 0.3, whiten: 0.4 });
    motes(t * 0.05, 0.1, 0.15);
  };

  return S;
}
