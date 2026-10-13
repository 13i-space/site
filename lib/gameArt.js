// Shared art for the core games (Update 5.83): NEMESIS Command and
// Asteroid Belt draw their ships, rocks, UFOs and skies from here, so the
// 13i ship looks the same everywhere. 13i vs NEMESIS is a standalone HTML
// file (public/games/13i-vs-nemesis.html) and carries its own copy of the
// 13i ship - keep the two in step if either changes.
//
// Everything is plain canvas 2D: no images, no libraries.

const TAU = Math.PI * 2;

// A soft additive glow.
export function glow(ctx, x, y, r, rgb, a = 1) {
  if (r <= 0 || a <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(0.4, `rgba(${rgb},${a * 0.35})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}

// ---------- 13i ----------
// The ring-eye of the logo, as a ship: a brushed-steel ring, the blue eye
// glowing inside it, two small guns forward and a thruster nozzle behind.
// Faces +x; rotate the context (or pass angle) to point it.
//   opts.thrust  true while the engine burns (a blue-white flame)
//   opts.flash   0..1 muzzle flash after a shot
//   opts.tint    "damaged" | "critical" to warm the eye (13i vs NEMESIS)
//   opts.guns    false to draw it without guns
export function drawShip13i(ctx, x, y, angle, r, opts = {}) {
  const t = opts.t || 0;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const eyeRGB = opts.tint === "critical" ? "255,110,90" : opts.tint === "damaged" ? "200,150,255" : "90,140,255";

  // exhaust: a flame from the nozzle when burning, a faint pilot glow otherwise
  const nozzleX = -r * 1.32;
  if (opts.thrust) {
    const len = r * (1.6 + Math.sin(t * 40) * 0.25 + Math.random() * 0.35);
    const fg = ctx.createLinearGradient(nozzleX, 0, nozzleX - len, 0);
    fg.addColorStop(0, "rgba(235,245,255,0.95)");
    fg.addColorStop(0.25, "rgba(130,175,255,0.8)");
    fg.addColorStop(1, "rgba(90,120,255,0)");
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.moveTo(nozzleX, -r * 0.26);
    ctx.quadraticCurveTo(nozzleX - len * 0.5, -r * 0.2, nozzleX - len, 0);
    ctx.quadraticCurveTo(nozzleX - len * 0.5, r * 0.2, nozzleX, r * 0.26);
    ctx.closePath();
    ctx.fill();
    glow(ctx, nozzleX - r * 0.2, 0, r * 0.9, "140,180,255", 0.5);
  } else {
    glow(ctx, nozzleX - r * 0.1, 0, r * 0.45, "120,160,255", 0.25 + Math.sin(t * 3) * 0.08);
  }

  // thruster nozzle: a flared bell, steel, behind the ring
  const steel = (x0, y0, x1, y1) => {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, "#5B6178");
    g.addColorStop(0.45, "#C9CEDC");
    g.addColorStop(0.55, "#E6E9F2");
    g.addColorStop(1, "#4A4F63");
    return g;
  };
  ctx.fillStyle = steel(0, -r * 0.35, 0, r * 0.35);
  ctx.beginPath();
  ctx.moveTo(-r * 0.86, -r * 0.2);
  ctx.lineTo(nozzleX, -r * 0.32);
  ctx.lineTo(nozzleX, r * 0.32);
  ctx.lineTo(-r * 0.86, r * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#1A1D2E";
  ctx.fillRect(nozzleX - 0.5, -r * 0.26, 1.5, r * 0.52);

  // twin guns, forward, either side of the ring
  if (opts.guns !== false) {
    for (const side of [-1, 1]) {
      const gy = side * r * 0.52;
      ctx.fillStyle = steel(0, gy - r * 0.12, 0, gy + r * 0.12);
      ctx.fillRect(r * 0.55, gy - r * 0.11, r * 0.95, r * 0.22);
      ctx.fillStyle = "#2A2E44";
      ctx.fillRect(r * 1.42, gy - r * 0.08, r * 0.1, r * 0.16);
      if (opts.flash > 0) glow(ctx, r * 1.6, gy, r * 0.8 * opts.flash, "200,220,255", opts.flash);
    }
  }

  // the ring: brushed steel with a lit edge
  const ring = ctx.createLinearGradient(-r, -r, r, r);
  ring.addColorStop(0, "#F2F4FA");
  ring.addColorStop(0.35, "#9AA0B8");
  ring.addColorStop(0.6, "#5A6078");
  ring.addColorStop(1, "#C3C8D8");
  ctx.strokeStyle = ring;
  ctx.lineWidth = r * 0.3;
  ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, TAU); ctx.stroke();
  ctx.strokeStyle = "rgba(20,24,44,0.7)";
  ctx.lineWidth = Math.max(0.6, r * 0.05);
  ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, TAU); ctx.stroke();

  // the eye
  glow(ctx, 0, 0, r * 1.2, eyeRGB, 0.55 + Math.sin(t * 2.4) * 0.1);
  const eye = ctx.createRadialGradient(-r * 0.12, -r * 0.12, 0, 0, 0, r * 0.45);
  eye.addColorStop(0, "#FFFFFF");
  eye.addColorStop(0.3, `rgb(${eyeRGB})`);
  eye.addColorStop(1, "#0C1640");
  ctx.fillStyle = eye;
  ctx.beginPath(); ctx.arc(0, 0, r * 0.42, 0, TAU); ctx.fill();
  // a star glint, like the logo
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = Math.max(0.5, r * 0.04);
  ctx.beginPath();
  ctx.moveTo(-r * 0.28, 0); ctx.lineTo(r * 0.28, 0);
  ctx.moveTo(0, -r * 0.28); ctx.lineTo(0, r * 0.28);
  ctx.stroke();
  ctx.restore();
}

// Where the two guns' muzzles are, in world space (for bullets).
export function gunTips13i(x, y, angle, r) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [-1, 1].map((side) => {
    const lx = r * 1.55, ly = side * r * 0.52;
    return { x: x + lx * c - ly * s, y: y + lx * s + ly * c };
  });
}

// ---------- UFO ----------
// A classic saucer: steel disc, glass dome, rim lights chasing round.
export function drawUFO(ctx, x, y, r, t, hurt = 0) {
  ctx.save();
  ctx.translate(x, y);
  glow(ctx, 0, r * 0.5, r * 2.2, "150,255,200", 0.12);
  // dome
  const dome = ctx.createRadialGradient(-r * 0.15, -r * 0.55, 0, 0, -r * 0.3, r * 0.6);
  dome.addColorStop(0, "rgba(230,255,245,0.95)");
  dome.addColorStop(0.5, "rgba(120,220,190,0.6)");
  dome.addColorStop(1, "rgba(40,90,90,0.5)");
  ctx.fillStyle = dome;
  ctx.beginPath(); ctx.ellipse(0, -r * 0.22, r * 0.48, r * 0.42, 0, Math.PI, TAU); ctx.fill();
  // disc
  const disc = ctx.createLinearGradient(0, -r * 0.3, 0, r * 0.35);
  disc.addColorStop(0, hurt > 0 ? "#FFE2D8" : "#E4E8F2");
  disc.addColorStop(0.5, "#8D93A8");
  disc.addColorStop(1, "#3B3F52");
  ctx.fillStyle = disc;
  ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.32, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(0, -r * 0.04, r * 0.92, r * 0.2, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  // rim lights, chasing
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI + 0.2;
    const lx = Math.cos(a) * r * 0.78, ly = Math.sin(a) * r * 0.16 + r * 0.06;
    const on = (Math.floor(t * 8) + i) % 3 === 0;
    ctx.fillStyle = on ? "#B6FFD9" : "#3F6F60";
    ctx.beginPath(); ctx.arc(lx, ly, r * 0.07, 0, TAU); ctx.fill();
    if (on) glow(ctx, lx, ly, r * 0.25, "180,255,215", 0.6);
  }
  // underside beam glow
  glow(ctx, 0, r * 0.3, r * 0.5, "160,255,210", 0.35 + Math.sin(t * 6) * 0.1);
  ctx.restore();
}

// ---------- asteroids ----------
// A rock, pre-drawn once: grey stone with shading, craters and a lit rim.
export function makeAsteroidSprite(shape, r) {
  const pad = 4;
  const size = Math.ceil(r * 2 * 1.25 + pad * 2);
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const cx = size / 2, cy = size / 2;
  const path = () => {
    g.beginPath();
    shape.forEach((m, i) => {
      const a = (i / shape.length) * TAU;
      const px = cx + Math.cos(a) * r * m, py = cy + Math.sin(a) * r * m;
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    });
    g.closePath();
  };
  path();
  const body = g.createRadialGradient(cx - r * 0.4, cy - r * 0.45, r * 0.1, cx, cy, r * 1.25);
  body.addColorStop(0, "#9A9CA6");
  body.addColorStop(0.5, "#6A6C78");
  body.addColorStop(1, "#33343E");
  g.fillStyle = body;
  g.fill();
  g.save();
  path();
  g.clip();
  // craters
  // craters, spread out: a soft dark bowl with a lit lower rim
  const n = 2 + Math.floor(r / 8);
  const placed = [];
  for (let i = 0; i < n * 4 && placed.length < n; i++) {
    const a = Math.random() * TAU, d = Math.sqrt(Math.random()) * r * 0.68, cr = r * (0.08 + Math.random() * 0.12);
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    if (placed.some((q) => Math.hypot(q.x - x, q.y - y) < q.cr + cr + 2)) continue;
    placed.push({ x, y, cr });
    const bowl = g.createRadialGradient(x - cr * 0.25, y - cr * 0.25, 0, x, y, cr);
    bowl.addColorStop(0, "rgba(28,29,38,0.55)");
    bowl.addColorStop(1, "rgba(28,29,38,0.05)");
    g.fillStyle = bowl;
    g.beginPath(); g.arc(x, y, cr, 0, TAU); g.fill();
    g.strokeStyle = "rgba(215,218,228,0.3)";
    g.lineWidth = 1;
    g.beginPath(); g.arc(x, y, cr, Math.PI * 0.1, Math.PI * 0.9); g.stroke();
  }
  // grit
  for (let i = 0; i < r * 1.5; i++) {
    g.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.12)";
    g.fillRect(cx + (Math.random() - 0.5) * r * 2, cy + (Math.random() - 0.5) * r * 2, 1.2, 1.2);
  }
  // shadow side
  const sh = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  sh.addColorStop(0, "rgba(0,0,0,0)");
  sh.addColorStop(1, "rgba(5,6,14,0.55)");
  g.fillStyle = sh;
  g.fillRect(0, 0, size, size);
  g.restore();
  path();
  g.strokeStyle = "rgba(190,195,215,0.55)";
  g.lineWidth = 1.2;
  g.stroke();
  return c;
}

// ---------- the rod ship ----------
// A rocket: white-steel fuselage, rust bands, nose cone, swept fins and an
// engine burning behind. Faces +x. s = scale (1 is about 34px long).
export function drawRocket(ctx, x, y, angle, s, t, warn = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(s, s);
  // flame
  const fl = 12 + Math.sin(t * 35) * 2 + Math.random() * 3;
  const fg = ctx.createLinearGradient(-16, 0, -16 - fl, 0);
  fg.addColorStop(0, "rgba(255,240,210,0.95)");
  fg.addColorStop(0.3, "rgba(255,160,80,0.8)");
  fg.addColorStop(1, "rgba(220,80,40,0)");
  ctx.fillStyle = fg;
  ctx.beginPath();
  ctx.moveTo(-16, -3.5);
  ctx.quadraticCurveTo(-16 - fl * 0.6, -2, -16 - fl, 0);
  ctx.quadraticCurveTo(-16 - fl * 0.6, 2, -16, 3.5);
  ctx.closePath();
  ctx.fill();
  glow(ctx, -18, 0, 9, "255,170,90", 0.4);
  // fins
  ctx.fillStyle = "#A9483C";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(-6, side * 4.5);
    ctx.lineTo(-15, side * 11);
    ctx.lineTo(-16, side * 4.5);
    ctx.closePath();
    ctx.fill();
  }
  // body
  const body = ctx.createLinearGradient(0, -5, 0, 5);
  body.addColorStop(0, "#F4F5FA");
  body.addColorStop(0.5, "#C6CAD8");
  body.addColorStop(1, "#6C7188");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-16, -4.5);
  ctx.lineTo(8, -5);
  ctx.quadraticCurveTo(18, -4, 22, 0);
  ctx.quadraticCurveTo(18, 4, 8, 5);
  ctx.lineTo(-16, 4.5);
  ctx.closePath();
  ctx.fill();
  // rust bands and a porthole
  ctx.fillStyle = "#C97B6E";
  ctx.fillRect(-11, -4.7, 3, 9.4);
  ctx.fillRect(10, -4.6, 2.2, 9.2);
  ctx.fillStyle = "#1B2236";
  ctx.beginPath(); ctx.arc(2, 0, 2.2, 0, TAU); ctx.fill();
  ctx.strokeStyle = "#E8CFC0";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  // nozzle
  ctx.fillStyle = "#3C4055";
  ctx.fillRect(-18, -3.4, 2.5, 6.8);
  // warning light as it nears detonation
  if (warn > 0) glow(ctx, 0, -6, 6, "255,80,60", warn);
  ctx.restore();
}

// A tungsten rod: a dark metal bar with a bright edge.
export function drawRod(ctx, x, y, angle, len) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const g = ctx.createLinearGradient(0, -2.6, 0, 2.6);
  g.addColorStop(0, "#D6D9E6");
  g.addColorStop(0.45, "#8A8FA6");
  g.addColorStop(1, "#3E4258");
  ctx.fillStyle = g;
  ctx.fillRect(-len / 2, -2.4, len, 4.8);
  ctx.fillStyle = "#C97B6E";
  ctx.fillRect(len / 2 - 2, -2.4, 2, 4.8);
  ctx.restore();
}

// ---------- skies ----------
// A painted backdrop (nebula wash + dust), drawn once per size.
export function makeSky(w, h, seed = 1, tone = "cool") {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  const g = c.getContext("2d");
  let a = seed >>> 0;
  const rnd = () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; };
  g.fillStyle = "#05060F";
  g.fillRect(0, 0, w, h);
  const blobs = tone === "warm"
    ? ["120,60,90", "60,50,130", "150,90,70"]
    : ["70,60,160", "40,80,150", "110,60,140"];
  for (let i = 0; i < 6; i++) {
    const x = rnd() * w, y = rnd() * h, r = (0.25 + rnd() * 0.45) * Math.max(w, h);
    const rgb = blobs[i % blobs.length];
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${rgb},${0.1 + rnd() * 0.08})`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  }
  // faint far stars baked in
  for (let i = 0; i < (w * h) / 900; i++) {
    g.fillStyle = `rgba(210,215,255,${0.15 + rnd() * 0.35})`;
    g.fillRect(rnd() * w, rnd() * h, rnd() < 0.9 ? 1 : 1.6, rnd() < 0.9 ? 1 : 1.6);
  }
  return c;
}

// Twinkling near stars on top of the sky.
export function makeStars(w, h, n) {
  return Array.from({ length: n }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 1.3 + 0.3, ph: Math.random() * TAU, sp: 0.5 + Math.random() * 1.5,
    depth: Math.random(),
  }));
}
export function drawStars(ctx, stars, t) {
  stars.forEach((s) => {
    const a = 0.35 + Math.sin(t * s.sp + s.ph) * 0.3;
    ctx.fillStyle = `rgba(220,225,255,${Math.max(0.05, a)})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU); ctx.fill();
    if (s.r > 1.3) glow(ctx, s.x, s.y, s.r * 4, "200,210,255", a * 0.3);
  });
}

// ---------- NEMESIS Command ----------
// NEMESIS on the ground: an armoured gunmetal dome on treads, its amber
// sensor eye under the barrel. angle is the aim; recoil 0..1 after a shot.
export function drawNemesis(ctx, x, groundY, angle, k, t, recoil = 0, hurt = 0) {
  ctx.save();
  ctx.translate(x, groundY);
  ctx.scale(k, k);
  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath(); ctx.ellipse(0, 1, 24, 4, 0, 0, TAU); ctx.fill();
  // treads
  const tread = ctx.createLinearGradient(0, -8, 0, 0);
  tread.addColorStop(0, "#3A3F55");
  tread.addColorStop(1, "#1A1D2A");
  ctx.fillStyle = tread;
  ctx.beginPath();
  ctx.moveTo(-22, -1); ctx.lineTo(-19, -8); ctx.lineTo(19, -8); ctx.lineTo(22, -1); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#555B75";
  for (let i = -16; i <= 16; i += 8) {
    ctx.beginPath(); ctx.arc(i + ((t * 20) % 8) * 0, -4, 2, 0, TAU); ctx.fill();
  }
  // barrel (behind the dome)
  const bl = 24 - recoil * 5;
  ctx.save();
  ctx.translate(0, -16);
  ctx.rotate(angle);
  const bg = ctx.createLinearGradient(0, -3, 0, 3);
  bg.addColorStop(0, "#C9CEDC");
  bg.addColorStop(0.5, "#7A8098");
  bg.addColorStop(1, "#353A50");
  ctx.fillStyle = bg;
  ctx.fillRect(4, -3, bl, 6);
  ctx.fillStyle = "#23273A";
  ctx.fillRect(4 + bl - 3, -3.6, 4, 7.2);
  if (recoil > 0) glow(ctx, 4 + bl + 6, 0, 14 * recoil, "255,190,90", recoil);
  ctx.restore();
  // dome
  const dome = ctx.createRadialGradient(-6, -24, 2, 0, -14, 18);
  dome.addColorStop(0, hurt > 0 ? "#FFD2C8" : "#B8BED2");
  dome.addColorStop(0.5, "#5C627C");
  dome.addColorStop(1, "#262A3C");
  ctx.fillStyle = dome;
  ctx.beginPath(); ctx.arc(0, -8, 15, Math.PI, TAU); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(0, -8, 12, Math.PI * 1.15, Math.PI * 1.6); ctx.stroke();
  // the amber eye
  const pulse = 0.7 + Math.sin(t * 3) * 0.3;
  glow(ctx, 0, -14, 12, "255,176,32", 0.5 * pulse);
  ctx.fillStyle = "#FFB020";
  ctx.beginPath(); ctx.arc(0, -14, 3.2, 0, TAU); ctx.fill();
  ctx.fillStyle = "#FFF4D8";
  ctx.beginPath(); ctx.arc(-0.8, -14.8, 1.1, 0, TAU); ctx.fill();
  ctx.restore();
}

// An invader dropping in: a rust-red pod with a hot core and a flame above.
export function drawInvader(ctx, x, y, r, t, seed = 0) {
  ctx.save();
  ctx.translate(x, y);
  // flame trailing upward
  const fl = r * (1.4 + Math.sin(t * 30 + seed) * 0.3);
  const fg = ctx.createLinearGradient(0, -r * 0.6, 0, -r * 0.6 - fl);
  fg.addColorStop(0, "rgba(255,210,170,0.85)");
  fg.addColorStop(1, "rgba(201,123,110,0)");
  ctx.fillStyle = fg;
  ctx.beginPath();
  ctx.moveTo(-r * 0.35, -r * 0.6);
  ctx.quadraticCurveTo(0, -r * 0.6 - fl * 1.1, r * 0.35, -r * 0.6);
  ctx.closePath();
  ctx.fill();
  glow(ctx, 0, 0, r * 2.4, "201,123,110", 0.3);
  // hull
  const hull = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r * 1.1);
  hull.addColorStop(0, "#F0C2B4");
  hull.addColorStop(0.45, "#C97B6E");
  hull.addColorStop(1, "#4A2228");
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(0, r * 1.5);
  ctx.quadraticCurveTo(r * 1.1, r * 0.4, r * 0.9, -r * 0.3);
  ctx.quadraticCurveTo(0, -r * 0.9, -r * 0.9, -r * 0.3);
  ctx.quadraticCurveTo(-r * 1.1, r * 0.4, 0, r * 1.5);
  ctx.fill();
  // core
  const pulse = 0.75 + Math.sin(t * 5 + seed) * 0.25;
  glow(ctx, 0, r * 0.15, r * 0.9, "255,220,190", 0.8 * pulse);
  ctx.fillStyle = "#FFF1E6";
  ctx.beginPath(); ctx.arc(0, r * 0.15, r * 0.28, 0, TAU); ctx.fill();
  ctx.restore();
}

// Glowing spark particles (explosions): {x,y,vx,vy,life,max,rgb,size}
export function burst(list, x, y, n, rgb, speed = 2.5, size = 2) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU, sp = Math.random() * speed + 0.3;
    const life = 25 + Math.random() * 25;
    list.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life, max: life, rgb, size: size * (0.5 + Math.random()) });
  }
}
export function stepSparks(ctx, list) {
  for (const p of list) {
    p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97; p.life -= 1;
    const a = Math.max(0, p.life / p.max);
    glow(ctx, p.x, p.y, p.size * 3, p.rgb, a * 0.6);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(p.x - 0.6, p.y - 0.6, 1.2, 1.2);
  }
  return list.filter((p) => p.life > 0);
}
