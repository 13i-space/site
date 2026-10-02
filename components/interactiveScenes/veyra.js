// Scenes for Interactive Assignment 0000087, "The Deep Walkers" (Veyra).
// Drawn by components/InteractiveScene.js through its drawing kit (`api`).
// Most scenes are a cut-away: a hazy surface above, the crust below, so the
// walkers' real world - vibration through stone - can be seen.
//
// pose: "press" - the walkers press down and pulses run into the ground

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
  const r = rng(87);
  const towers = Array.from({ length: 11 }, (_, i) => ({ x: (i + 0.2 + r() * 0.6) / 11, h: 0.12 + r() * 0.2, w: 0.012 + r() * 0.012, sink: r() < 0.3, p: r() * 6.28 }));
  const haze = Array.from({ length: 120 }, () => ({ x: r(), y: r(), s: r() * 1.6 + 0.4, v: 0.002 + r() * 0.006, p: r() * 6.28 }));
  const strata = Array.from({ length: 7 }, (_, k) => ({ y: k, amp: 0.004 + r() * 0.01, f: 1 + r() * 3, p: r() * 6.28 }));
  const bones = Array.from({ length: 70 }, () => ({ x: r(), y: r(), a: r() * 6.28, s: 0.5 + r() * 1.2, age: r() }));
  const gather = Array.from({ length: 60 }, () => ({ a: r() * 6.28, d: 0.3 + r() * 0.7, s: 0.5 + r() * 0.5 }));
  const colony = Array.from({ length: 40 }, () => ({ x: r(), y: r(), p: r() * 6.28 }));
  const stars = Array.from({ length: 140 }, () => ({ x: r(), y: r(), s: r() * 1.3 + 0.2, p: r() * 6.28 }));
  return { towers, haze, strata, bones, gather, colony, stars };
}

export function makeVeyraScenes(api) {
  const { ctx, A, glow, mark } = api;
  const world = makeWorld();
  const W = () => api.W;
  const H = () => api.H;

  function sky(horizon) {
    A(1);
    const g = ctx.createLinearGradient(0, 0, 0, horizon);
    g.addColorStop(0, "#1b1f40");
    g.addColorStop(1, "#3a3a52");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W(), horizon);
    glow(W() * 0.5, horizon, W() * 0.5, "rgba(232,207,192,0.35)", 0.5);
  }

  function haze(t, horizon, a = 0.35) {
    ctx.fillStyle = "#C9C4D6";
    world.haze.forEach((h) => {
      const x = (((h.x + t * h.v) % 1) + 1) % 1;
      A(a * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.3 + h.p))));
      ctx.fillRect(x * W(), h.y * horizon, h.s, h.s);
    });
  }

  // the crust in cut-away: strata, and the ground's own slow strain
  function ground(t, horizon, { deep = false } = {}) {
    A(1);
    const g = ctx.createLinearGradient(0, horizon, 0, H());
    g.addColorStop(0, "#26213a");
    g.addColorStop(1, deep ? "#05040c" : "#0d0b18");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    for (let i = 0; i <= 40; i++) ctx.lineTo((i / 40) * W(), horizon + Math.sin(i * 1.3) * 4 + Math.sin(i * 0.4) * 7);
    ctx.lineTo(W(), H());
    ctx.lineTo(0, H());
    ctx.fill();
    world.strata.forEach((s, k) => {
      A(0.18 + k * 0.02);
      ctx.strokeStyle = "#6E76B8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const u = i / 40;
        const y = horizon + (H() - horizon) * (0.12 + k * 0.13) + Math.sin(u * 6.28 * s.f + s.p + t * 0.05) * s.amp * H();
        i ? ctx.lineTo(u * W(), y) : ctx.moveTo(0, y);
      }
      ctx.stroke();
    });
  }

  // a ring of vibration spreading through stone from (x, y)
  function pulses(x, y, t, { n = 3, speed = 0.5, size = 0.3, color = "rgba(232,207,192,", a = 0.6, half = true } = {}) {
    for (let k = 0; k < n; k++) {
      const ph = (t * speed + k / n) % 1;
      A((1 - ph) * a);
      ctx.strokeStyle = color + "1)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(x, y, ph * W() * size, ph * W() * size * 0.42, 0, half ? 0 : 0, half ? Math.PI : Math.PI * 2);
      ctx.stroke();
    }
  }

  // a Deep Walker: low, plated, six thick limbs, no eyes
  function walker(x, y, s, t, { press = 0, lift = 0, a = 1, sensing = true } = {}) {
    const bodyY = y - (30 - press * 12) * s - lift;
    // six limbs: three each side, thick and short, bent at the knee
    for (let i = 0; i < 6; i++) {
      const side = i < 3 ? -1 : 1;
      const k = i % 3;
      const hipX = x + (k - 1) * 30 * s;
      const footX = hipX + (k - 1) * 10 * s + side * 6 * s;
      const footY = y + (lift ? Math.sin(t * 2 + i) * 6 * s : 0);
      const kneeX = (hipX + footX) / 2 + side * 10 * s;
      const kneeY = bodyY - 6 * s + (lift ? 8 * s : 0);
      A(a);
      ctx.strokeStyle = "#332e4a";
      ctx.lineWidth = 11 * s;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(hipX, bodyY + 4 * s);
      ctx.quadraticCurveTo(kneeX, kneeY, footX, footY);
      ctx.stroke();
      A(a * 0.55);
      ctx.strokeStyle = "#8B95F6";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      if (sensing && !lift) glow(footX, footY, 10 * s, "rgba(185,192,255,0.9)", a * (0.35 + 0.35 * Math.sin(t * 2.2 + i)));
    }
    // the body: plates over a low mass
    A(a);
    const g = ctx.createLinearGradient(x, bodyY - 20 * s, x, bodyY + 14 * s);
    g.addColorStop(0, "#3e3a54");
    g.addColorStop(1, "#16142a");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, bodyY, 62 * s, 18 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let p = 0; p < 7; p++) {
      const px = x - 48 * s + p * 16 * s;
      A(a * 0.85);
      ctx.fillStyle = p % 2 ? "#4a4560" : "#3a3650";
      ctx.beginPath();
      ctx.ellipse(px, bodyY - 6 * s, 12 * s, 9 * s, -0.2, Math.PI, Math.PI * 2);
      ctx.fill();
      A(a * 0.5);
      ctx.strokeStyle = "#8d8aa3";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  function towers(t, horizon, age) {
    world.towers.forEach((tw, i) => {
      const sink = tw.sink ? Math.min(1, Math.max(0, (age - 2 - i * 0.6) / 6)) : 0;
      const h = tw.h * H() * (1 - sink);
      if (h < 2) return;
      const x = tw.x * W();
      const w = tw.w * W();
      const tilt = tw.sink ? sink * 0.15 : 0;
      A(0.9);
      ctx.save();
      ctx.translate(x, horizon);
      ctx.rotate(tilt);
      const g = ctx.createLinearGradient(-w, 0, w, 0);
      g.addColorStop(0, "#2a2640");
      g.addColorStop(1, "#4a4562");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-w, 0);
      ctx.lineTo(-w * 0.6, -h);
      ctx.lineTo(w * 0.5, -h * 0.97);
      ctx.lineTo(w, 0);
      ctx.fill();
      ctx.restore();
    });
  }

  const S = {};

  S["veyra-orbit"] = (t) => {
    A(1);
    ctx.fillStyle = "#04050d";
    ctx.fillRect(0, 0, W(), H());
    world.stars.forEach((s) => {
      A(0.3 + 0.6 * Math.abs(Math.sin(t * 0.4 + s.p)));
      ctx.fillStyle = "#DCDFFF";
      ctx.fillRect(s.x * W(), s.y * H(), s.s, s.s);
    });
    const R = Math.min(W(), H()) * 0.42;
    const px = W() * 0.6, py = H() * 0.52;
    glow(px, py, R * 1.3, "rgba(150,170,140,0.3)", 1);
    A(1);
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, R, 0, Math.PI * 2);
    ctx.clip();
    const g = ctx.createRadialGradient(px - R * 0.3, py - R * 0.35, R * 0.1, px, py, R);
    g.addColorStop(0, "#8d9a86");
    g.addColorStop(0.6, "#4c5a52");
    g.addColorStop(1, "#1a201f");
    ctx.fillStyle = g;
    ctx.fillRect(px - R, py - R, R * 2, R * 2);
    // cloud bands, and the dark equatorial basin
    for (let i = 0; i < 10; i++) {
      A(0.12);
      ctx.fillStyle = "#c9cfc0";
      ctx.beginPath();
      ctx.ellipse(px + Math.sin(t * 0.05 + i) * R * 0.1, py - R + i * R * 0.22, R * 1.2, R * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    A(0.55);
    ctx.fillStyle = "#0e1214";
    ctx.beginPath();
    ctx.ellipse(px + R * 0.1, py + R * 0.05, R * 0.55, R * 0.14, -0.1, 0, Math.PI * 2);
    ctx.fill();
    // the moving signatures under the crust
    for (let k = 0; k < 6; k++) {
      const ph = (t * 0.06 + k / 6) % 1;
      const a0 = k * 1.1;
      A(0.6 * Math.sin(ph * Math.PI));
      ctx.strokeStyle = "#E8CFC0";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px + Math.cos(a0) * R * 0.2, py + Math.sin(a0) * R * 0.2, R * (0.3 + k * 0.08), a0 + ph * 2, a0 + ph * 2 + 0.6);
      ctx.stroke();
    }
    ctx.restore();
    mark(W() * 0.18, H() * 0.22, Math.max(7, Math.min(W(), H()) * 0.02), t, 0.85);
  };

  S["veyra-surface"] = (t, age) => {
    const hz = H() * 0.58;
    sky(hz);
    haze(t, hz);
    towers(t, hz, age);
    ground(t, hz);
    // the burrowing colonies, a slow itch in the rock
    world.colony.forEach((c) => glow(c.x * W(), hz + (0.2 + c.y * 0.7) * (H() - hz), 6, "rgba(160,180,140,0.8)", 0.25 + 0.2 * Math.sin(t + c.p)));
    if (api.flag("grounded")) mark(W() * 0.78, hz - 14, Math.max(6, Math.min(W(), H()) * 0.018), t, 0.8, { ping: false });
    else mark(W() * 0.8, H() * 0.2, Math.max(7, Math.min(W(), H()) * 0.02), t, 0.85);
  };

  S["veyra-walker"] = (t) => {
    const hz = H() * 0.56;
    sky(hz);
    haze(t, hz);
    ground(t, hz);
    const press = api.pose() === "press" ? 1 : 0;
    walker(W() * 0.42, hz + 4, Math.min(W(), H()) / 300, t, { press });
    if (press) pulses(W() * 0.42, hz + 6, t, { n: 4, speed: 0.45, size: 0.45 });
    // the answer, four kilometres away
    pulses(W() * 0.92, hz + 6, t + 1.3, { n: 2, speed: 0.4, size: 0.2, a: 0.35 });
    mark(W() * 0.8, H() * 0.2, Math.max(7, Math.min(W(), H()) * 0.02), t, 0.8);
  };

  // twelve in a circle, seen low; the pattern passes round, through stone
  S["veyra-circle"] = (t) => {
    const hz = H() * 0.48;
    sky(hz);
    haze(t, hz, 0.25);
    ground(t, hz);
    const cx = W() * 0.5, cy = hz + (H() - hz) * 0.18;
    const rx = W() * 0.32, ry = (H() - hz) * 0.14;
    const order = Array.from({ length: 12 }, (_, i) => i).sort((a, b) => Math.sin((a / 12) * 6.28) - Math.sin((b / 12) * 6.28));
    const lifted = api.flag("lifted");
    order.forEach((i) => {
      const a = (i / 12) * Math.PI * 2;
      const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
      const s = (Math.min(W(), H()) / 520) * (0.75 + 0.25 * (Math.sin(a) + 1));
      walker(x, y, s, t, { press: 1, a: lifted && i === 3 ? 0.45 : 1, sensing: !(lifted && i === 3) });
    });
    // the pattern travelling round the ring, under the ground
    const ph = (t * 0.25) % 1;
    for (let k = 0; k < 12; k++) {
      const a = ((k + ph * 12) / 12) * Math.PI * 2;
      const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry + 18;
      glow(x, y, 12, "rgba(232,207,192,0.9)", 0.15 + 0.5 * Math.max(0, Math.cos((k / 12 - ph) * 6.28 * 2)));
    }
    pulses(cx, cy + 20, t, { n: 2, speed: 0.3, size: 0.4, a: 0.3 });
    if (api.flag("grounded")) mark(cx + rx * 1.12, cy - 6, Math.max(6, Math.min(W(), H()) * 0.018), t, 0.8, { ping: false });
    else mark(W() * 0.82, H() * 0.18, Math.max(7, Math.min(W(), H()) * 0.02), t, 0.8);
  };

  S["veyra-lift"] = (t) => {
    const hz = H() * 0.6;
    sky(hz);
    haze(t, hz, 0.25);
    ground(t, hz);
    const x = W() * 0.48, s = Math.min(W(), H()) / 330;
    // the field, and a walker held in it, feeling for a world that isn't there
    for (let k = 0; k < 3; k++) {
      const ph = (t * 0.6 + k / 3) % 1;
      A(0.35 * (1 - ph));
      ctx.strokeStyle = "#C97B6E";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(x, hz - 40 * s, 90 * s + ph * 30 * s, 44 * s + ph * 14 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    walker(x, hz - 26 * s, s, t, { lift: 30 * s, sensing: false });
    mark(x, H() * 0.18, Math.max(7, Math.min(W(), H()) * 0.022), t, 1);
  };

  S["veyra-ridge"] = (t) => {
    const hz = H() * 0.44;
    sky(hz);
    haze(t, hz, 0.3);
    // the ridge, on the right, and the cavity under it straining
    A(1);
    ctx.fillStyle = "#2c2842";
    ctx.beginPath();
    ctx.moveTo(W() * 0.55, hz);
    ctx.lineTo(W() * 0.7, hz - H() * 0.2);
    ctx.lineTo(W() * 0.84, hz - H() * 0.26);
    ctx.lineTo(W(), hz - H() * 0.18);
    ctx.lineTo(W(), hz);
    ctx.fill();
    ground(t, hz);
    const strain = 0.5 + 0.5 * Math.sin(t * 3);
    glow(W() * 0.8, hz + (H() - hz) * 0.35, W() * 0.18, "rgba(201,123,110,0.7)", 0.25 + strain * 0.2);
    A(0.8);
    ctx.fillStyle = "#03030a";
    ctx.beginPath();
    ctx.ellipse(W() * 0.8, hz + (H() - hz) * 0.35, W() * 0.11, (H() - hz) * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    // the group, small, slow
    const prog = Math.min(1, (t * 0.01) % 1);
    for (let i = 0; i < 12; i++) {
      const x = W() * (0.12 + (i % 4) * 0.05 + prog * 0.15), y = hz + 4 + Math.floor(i / 4) * 8;
      walker(x, y, Math.min(W(), H()) / 1000, t, { press: api.pose() === "press" ? 1 : 0, a: api.flag("lifted") && i === 3 ? 0.5 : 0.95 });
    }
    mark(W() * 0.3, H() * 0.18, Math.max(7, Math.min(W(), H()) * 0.02), t, 0.8);
  };

  S["veyra-collapse"] = (t, age) => {
    const hz = H() * 0.44;
    sky(hz);
    const fall = Math.min(1, age / 2.5);
    ground(t, hz);
    // the ridge comes down; dust everywhere
    A(1 - fall);
    ctx.fillStyle = "#2c2842";
    ctx.beginPath();
    ctx.moveTo(W() * 0.55, hz);
    ctx.lineTo(W() * 0.7, hz - H() * 0.2 * (1 - fall));
    ctx.lineTo(W() * 0.84, hz - H() * 0.26 * (1 - fall));
    ctx.lineTo(W(), hz - H() * 0.18 * (1 - fall));
    ctx.lineTo(W(), hz);
    ctx.fill();
    for (let i = 0; i < 160; i++) {
      const r = ((i * 9301 + 49297) % 233280) / 233280;
      const r2 = ((i * 4421 + 1931) % 1000) / 1000;
      const x = W() * (0.55 + r * 0.45) + Math.sin(t + i) * 6;
      const y = hz - H() * 0.3 * r2 * (0.4 + fall) + Math.min(age, 6) * 4 * r;
      glow(x, y, 16 + r2 * 22, "rgba(170,160,180,0.6)", 0.25 * Math.min(1, age) * (1 - Math.max(0, age - 8) / 6));
    }
    pulses(W() * 0.8, hz + 8, t, { n: 4, speed: 0.8, size: 0.55, color: "rgba(201,123,110,", a: 0.7 * Math.max(0, 1 - age / 10) + 0.15 });
    for (let i = 0; i < 12; i++) walker(W() * (0.27 + (i % 4) * 0.05), hz + 4 + Math.floor(i / 4) * 8, Math.min(W(), H()) / 1000, t, { press: 1, a: 0.95 });
  };

  // deep cut-away: the gathering far above, the chamber far below
  S["veyra-deep"] = (t) => {
    const hz = H() * 0.16;
    sky(hz);
    ground(t, hz, { deep: true });
    world.gather.forEach((g) => {
      const x = W() * 0.5 + Math.cos(g.a) * W() * 0.4 * g.d;
      walker(x, hz + 2, (Math.min(W(), H()) / 1600) * g.s, t, { press: 1, a: 0.9 });
    });
    const cx = W() * 0.5, cy = H() * 0.66;
    if (!api.flag("feared") || api.flag("climax")) {
      for (let k = 0; k < 7; k++) {
        const ph = (t * 0.35 + k / 7) % 1;
        const y = hz + (cy - hz) * ph;
        A(0.5 * Math.sin(ph * Math.PI));
        ctx.strokeStyle = "#E8CFC0";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(cx, y, W() * 0.3 * (1 - ph * 0.7), 8 + 10 * (1 - ph), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    glow(cx, cy, W() * 0.16, "rgba(232,207,192,0.6)", 0.5);
    A(0.9);
    ctx.fillStyle = "#0a0814";
    ctx.beginPath();
    ctx.ellipse(cx, cy, W() * 0.12, H() * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
    world.bones.slice(0, 26).forEach((b) => glow(cx + (b.x - 0.5) * W() * 0.2, cy + (b.y - 0.5) * H() * 0.1, 6, "rgba(232,207,192,0.9)", 0.3 + 0.3 * Math.sin(t * 0.5 + b.a)));
    if (api.flag("grounded")) mark(W() * 0.86, hz - 10, Math.max(6, Math.min(W(), H()) * 0.016), t, 0.8, { ping: false });
  };

  // inside the chamber: remains held in mineral, patterns lingering in the stone
  S["veyra-archive"] = (t) => {
    A(1);
    const g = ctx.createRadialGradient(W() * 0.5, H() * 0.45, 10, W() * 0.5, H() * 0.45, W() * 0.7);
    g.addColorStop(0, "#1e1830");
    g.addColorStop(1, "#040308");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W(), H());
    world.strata.forEach((s, k) => {
      A(0.12);
      ctx.strokeStyle = "#8B95F6";
      ctx.beginPath();
      ctx.ellipse(W() * 0.5, H() * 0.45, W() * (0.15 + k * 0.07), H() * (0.08 + k * 0.05), 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    // the ancestors: mineralized remains, the old ones faint, the new ones bright
    world.bones.forEach((b) => {
      const x = b.x * W(), y = H() * 0.08 + b.y * H() * 0.6;
      A(0.25 + (1 - b.age) * 0.5);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(b.a);
      ctx.strokeStyle = "#C9C4D6";
      ctx.lineWidth = 2 * b.s;
      ctx.beginPath();
      ctx.ellipse(0, 0, 20 * b.s, 6 * b.s, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      const lit = Math.max(0, Math.sin(t * 0.6 - b.y * 6 + b.age * 3));
      glow(x, y, 16 * b.s, "rgba(232,207,192,0.9)", (1 - b.age * 0.8) * lit * 0.6);
    });
    // patterns arriving from above and spreading into the stone
    for (let k = 0; k < 4; k++) {
      const ph = (t * 0.25 + k / 4) % 1;
      A((1 - ph) * 0.45);
      ctx.strokeStyle = "#E8CFC0";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(W() * 0.5, H() * 0.3, ph * W() * 0.5, ph * H() * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  S["veyra-light"] = (t, age) => {
    const hz = H() * 0.5;
    const up = Math.min(1, age / 6);
    sky(hz);
    haze(t, hz, 0.3);
    glow(W() * 0.5, hz, W() * 0.6, "rgba(232,207,192,0.45)", up * 0.6);
    ground(t, hz);
    for (let i = 0; i < 5; i++) walker(W() * (0.2 + i * 0.15), hz + 4, Math.min(W(), H()) / (500 + i * 80), t, { press: 1 });
    pulses(W() * 0.5, hz + 6, t, { n: 3, speed: 0.25, size: 0.6, a: 0.4 * up });
  };

  S["veyra-dark"] = (t, age) => {
    const hz = H() * 0.3;
    const down = Math.min(1, age / 8);
    sky(hz);
    ground(t, hz, { deep: true });
    A(0.6 * (1 - down) + 0.1);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W(), H());
    pulses(W() * 0.5, hz + 6, t, { n: 2, speed: 0.2, size: 0.4, a: 0.25 });
  };

  return S;
}
