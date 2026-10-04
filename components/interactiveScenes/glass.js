// Scenes for Interactive Assignment 0514229, "The Sea of Glass" (Dacapo).
// Drawn by components/InteractiveScene.js through its drawing kit (`api`).
// Everything is code: the red star and its white companion, the white sea
// of ground glass, the canyon of amber towers throwing the war's colours on
// its walls, the returners (tall glass tripods, a ring for every year, a
// glowing core and a faceted crown that speaks in light), the heavy one,
// and the Return itself: rings falling as light and becoming sand.
//
// Flags read: cracked (a split tower in the canyon), held (13i's field
// around it).

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

// light-speech colours, from the young's white to the old's amber
const TINTS = ["#F4F6FF", "#FFF1D6", "#F6D9A8", "#E9B98A", "#D99A6A", "#B8754E", "#8A5236"];
const tintAt = (k) => TINTS[Math.max(0, Math.min(TINTS.length - 1, Math.round(k * (TINTS.length - 1))))];
const WAR = ["#C97B6E", "#E0A07A", "#B8754E", "#8E3E3A", "#E9B98A"];

function makeWorld() {
  const r = rng(514229);
  const stars = Array.from({ length: 170 }, () => ({ x: r(), y: r(), s: r() * 1.3 + 0.2, p: r() * 6.28 }));
  const sparkle = Array.from({ length: 220 }, () => ({ x: r(), y: r(), p: r() * 6.28, s: 0.5 + r() * 1.3 }));
  // a crowd on the plain, far to near
  const crowd = Array.from({ length: 46 }, () => {
    const d = r();
    return { x: r(), d, age: r(), p: r() * 6.28 };
  }).sort((a, b) => a.d - b.d);
  const towers = Array.from({ length: 16 }, (_, i) => ({ x: (i + 0.15 + r() * 0.7) / 16, h: 0.28 + r() * 0.34, w: 0.022 + r() * 0.02, p: r() * 6.28, lean: (r() - 0.5) * 0.04 }));
  const patches = Array.from({ length: 34 }, () => ({ x: r(), y: 0.12 + r() * 0.5, w: 0.03 + r() * 0.08, h: 0.02 + r() * 0.06, c: Math.floor(r() * WAR.length), sp: 0.3 + r() * 0.9, p: r() * 6.28 }));
  const shards = Array.from({ length: 260 }, () => ({ x: r(), y: r(), v: 0.05 + r() * 0.12, s: 2 + r() * 5, rot: r() * 6.28, spin: (r() - 0.5) * 3, c: r() }));
  const dust = Array.from({ length: 90 }, () => ({ x: r(), y: r(), vx: (r() - 0.5) * 0.01, p: r() * 6.28, s: 0.4 + r() }));
  return { stars, sparkle, crowd, towers, patches, shards, dust };
}

export function makeGlassScenes(api) {
  const { ctx, A, glow, mark } = api;
  const world = makeWorld();
  const W = () => api.W;
  const H = () => api.H;
  const S = {};

  // ---------- the sky: red dwarf low, white companion small and fierce ----------
  function sky(t, { horizon = 0.62, companion = 0.15, warm = 1, night = 0, cy: cyAt = null } = {}) {
    A(1);
    const g = ctx.createLinearGradient(0, 0, 0, H() * horizon);
    g.addColorStop(0, night ? "#07060f" : "#120a18");
    g.addColorStop(0.6, night ? "#140a14" : "#3a1622");
    g.addColorStop(1, night ? "#2a1218" : "#7a3328");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W(), H() * horizon + 2);
    world.stars.forEach((s) => {
      if (s.y > horizon * 0.85) return;
      A((0.25 + 0.5 * Math.abs(Math.sin(t * 0.4 + s.p))) * (0.4 + night * 0.6));
      ctx.fillStyle = "#F4E4DA";
      ctx.fillRect(s.x * W(), s.y * H(), s.s, s.s);
    });
    // the red star, swollen on the horizon
    glow(W() * 0.24, H() * horizon, W() * 0.42, "rgba(201,90,70,0.55)", 0.55 * warm * (1 - night * 0.7));
    A(0.9 * warm * (1 - night * 0.8));
    ctx.fillStyle = "#E06A50";
    ctx.beginPath();
    ctx.arc(W() * 0.24, H() * horizon, Math.min(W(), H()) * 0.09, Math.PI, 0);
    ctx.fill();
    // the white companion
    if (companion > 0) {
      const cx = W() * 0.74, cy = cyAt != null ? H() * cyAt : H() * (0.36 - companion * 0.22);
      const r0 = Math.max(2, Math.min(W(), H()) * (0.006 + companion * 0.014));
      glow(cx, cy, r0 * 14, "rgba(230,236,255,0.6)", 0.35 + companion * 0.5);
      glow(cx, cy, r0 * 4, "rgba(255,255,255,0.95)", 0.9);
      A(1);
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(cx, cy, r0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ---------- the sea of glass ----------
  function sea(t, horizon = 0.62, { bright = 0.5 } = {}) {
    A(1);
    const g = ctx.createLinearGradient(0, H() * horizon, 0, H());
    g.addColorStop(0, "#d9c7c2");
    g.addColorStop(0.25, "#b9a8b4");
    g.addColorStop(1, "#4b4058");
    ctx.fillStyle = g;
    ctx.fillRect(0, H() * horizon, W(), H() * (1 - horizon));
    // glints: every grain a memory
    world.sparkle.forEach((s) => {
      const y = horizon + s.y * (1 - horizon);
      const a = Math.max(0, Math.sin(t * 1.3 + s.p * 3)) ** 6;
      if (a < 0.05) return;
      A(a * bright);
      ctx.fillStyle = s.p > 3 ? "#FFF1D6" : "#F4F6FF";
      const sz = s.s * (0.6 + (y - horizon) * 2.5);
      ctx.fillRect(s.x * W() - sz / 2, y * H() - 0.5, sz, 1);
      ctx.fillRect(s.x * W() - 0.5, y * H() - sz / 2, 1, sz);
    });
    A(0.35);
    ctx.fillStyle = "#F4E4DA";
    ctx.fillRect(0, H() * horizon - 1, W(), 2);
  }

  // ---------- a returner ----------
  // x, base: feet. h: height in px. age 0 (clear) .. 1 (amber). heavy: fused, dark.
  // speak: { x, y, color } casts a beam of light at a point.
  function returner(x, base, h, t, { age = 0.3, p = 0, speak = null, heavy = 0, ring = 0, shed = 0, glowA = 1, sway = 1 } = {}) {
    const legH = h * 0.42;
    const bodyW = h * 0.085;
    const bodyH = h * 0.5;
    const sw = Math.sin(t * 0.6 + p) * h * 0.006 * sway * (1 - heavy);
    const hipX = x + sw, hipY = base - legH;
    const color = tintAt(age);
    // legs: three, one forward
    A(0.85 * glowA);
    ctx.strokeStyle = heavy ? "#5a3a2a" : "#CFC6D8";
    ctx.lineWidth = Math.max(1, h * 0.012);
    ctx.lineCap = "round";
    [[-1, 0], [1, 0], [0.15, 0.4]].forEach(([dx, fwd]) => {
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.quadraticCurveTo(hipX + dx * h * 0.07, hipY + legH * 0.4, x + dx * h * 0.13 - fwd * h * 0.02, base + fwd * h * 0.02);
      ctx.stroke();
    });
    if (heavy > 0) {
      // fused into the ground: glass roots
      A(0.6 * heavy * glowA);
      ctx.fillStyle = "#6b4630";
      ctx.beginPath();
      ctx.ellipse(x, base, h * 0.16, h * 0.025, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // body: a column of rings around a core
    const top = hipY - bodyH;
    const nRings = Math.round(4 + age * 12 + heavy * 10);
    const shedRings = Math.floor(nRings * shed);
    for (let k = nRings - 1; k >= 0; k--) {
      if (k >= nRings - shedRings && k > 0) continue; // already fallen
      const f = (k + 1) / nRings;
      const w = bodyW * (0.35 + 0.65 * f);
      const ringAge = Math.min(1, (age + heavy) * f + (k === 0 && ring ? 0.8 : 0));
      A((0.12 + 0.1 * f) * glowA);
      ctx.fillStyle = tintAt(heavy ? 0.7 + 0.3 * f : ringAge);
      ctx.beginPath();
      ctx.moveTo(hipX - w, hipY);
      ctx.quadraticCurveTo(hipX - w * 1.1, top + bodyH * 0.5, hipX - w * 0.75, top);
      ctx.lineTo(hipX + w * 0.75, top);
      ctx.quadraticCurveTo(hipX + w * 1.1, top + bodyH * 0.5, hipX + w, hipY);
      ctx.closePath();
      ctx.fill();
      A((0.35 + 0.2 * f) * glowA);
      ctx.strokeStyle = heavy ? "#8A5236" : "#F4F6FF";
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }
    // the kept ring, if this one has shed down to it
    if (ring) {
      A(0.9 * glowA);
      ctx.strokeStyle = "#8A5236";
      ctx.lineWidth = Math.max(1.5, h * 0.01);
      ctx.beginPath();
      ctx.ellipse(hipX, top + bodyH * 0.55, bodyW * 0.45, bodyH * 0.34, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // core
    const coreY = top + bodyH * 0.55;
    const dim = heavy ? 0.25 : 1 - age * 0.45;
    glow(hipX, coreY, h * 0.18, heavy ? "rgba(217,154,106,0.7)" : "rgba(255,241,214,0.8)", (0.45 + 0.15 * Math.sin(t * 1.4 + p)) * dim * glowA);
    A(dim * glowA);
    ctx.fillStyle = heavy ? "#D99A6A" : "#FFFFFF";
    ctx.beginPath();
    ctx.arc(hipX, coreY, h * 0.018, 0, Math.PI * 2);
    ctx.fill();
    // crown of facets
    const cy = top - h * 0.03;
    A(0.75 * glowA);
    ctx.fillStyle = color;
    for (let k = -2; k <= 2; k++) {
      ctx.beginPath();
      ctx.moveTo(hipX + k * bodyW * 0.28, top);
      ctx.lineTo(hipX + k * bodyW * 0.55, cy - h * 0.05 * (1 - Math.abs(k) * 0.25));
      ctx.lineTo(hipX + k * bodyW * 0.55 + bodyW * 0.22, top);
      ctx.closePath();
      ctx.fill();
    }
    glow(hipX, cy - h * 0.02, h * 0.1, heavy ? "rgba(217,154,106,0.5)" : "rgba(244,246,255,0.6)", 0.35 * dim * glowA);
    // speaking: a soft beam of coloured light to a point
    if (speak) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + p);
      A(0.16 * pulse * glowA);
      const g = ctx.createLinearGradient(hipX, cy, speak.x, speak.y);
      g.addColorStop(0, speak.color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(hipX, cy - h * 0.03);
      ctx.lineTo(speak.x - h * 0.08, speak.y - h * 0.05);
      ctx.lineTo(speak.x + h * 0.08, speak.y + h * 0.05);
      ctx.closePath();
      ctx.fill();
      glow(speak.x, speak.y, h * 0.14, "rgba(255,241,214,0.7)", 0.5 * pulse * glowA);
    }
    return { x: hipX, coreY, crownY: cy };
  }

  function crowd(t, horizon, { count = 46, speak = true, shed = 0, bright = 0 } = {}) {
    world.crowd.slice(0, count).forEach((c, i) => {
      const y = H() * (horizon + 0.02 + c.d * (1 - horizon) * 0.7);
      const h = Math.min(H(), W() * 0.75) * (0.06 + c.d * 0.26); // portrait screens: no giants
      const age = Math.max(0, c.age - bright);
      const tgt = speak && i % 3 === 0 && i + 1 < count ? world.crowd[i + 1] : null;
      returner(c.x * W(), y, h, t, {
        age,
        p: c.p,
        shed,
        ring: shed > 0.95,
        glowA: 0.45 + c.d * 0.55,
        speak: tgt ? { x: tgt.x * W(), y: H() * (horizon + tgt.d * (1 - horizon) * 0.7) - h * 0.7, color: tintAt(age) } : null,
      });
    });
  }

  // ---------- the canyon ----------
  function canyon(t, { war = 0.6, cracked = false, held = false, falling = 0 } = {}) {
    A(1);
    const g = ctx.createLinearGradient(0, 0, 0, H());
    g.addColorStop(0, "#1a0d14");
    g.addColorStop(1, "#3b1a1a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W(), H());
    // the red star through the canyon's mouth
    glow(W() * 0.5, H() * 0.22, W() * 0.32, "rgba(224,106,80,0.5)", 0.6);
    // walls
    A(1);
    ctx.fillStyle = "#24121a";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i <= 12; i++) ctx.lineTo(W() * (0.08 + Math.sin(i * 1.7) * 0.03 + i * 0.012), (i / 12) * H());
    ctx.lineTo(0, H());
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(W(), 0);
    for (let i = 0; i <= 12; i++) ctx.lineTo(W() * (0.92 - Math.sin(i * 1.3) * 0.03 - i * 0.012), (i / 12) * H());
    ctx.lineTo(W(), H());
    ctx.fill();
    // the war's colours on the walls
    world.patches.forEach((pt) => {
      const on = Math.max(0, Math.sin(t * pt.sp + pt.p));
      if (on < 0.1) return;
      const side = pt.x < 0.5 ? 0 : 1;
      const x = side ? W() * (0.8 + pt.x * 0.2) : W() * pt.x * 0.2;
      A(on * war * 0.55);
      ctx.fillStyle = WAR[pt.c];
      ctx.fillRect(x, H() * pt.y, W() * pt.w * 0.5, H() * pt.h);
    });
    // floor
    A(1);
    ctx.fillStyle = "#2c1418";
    ctx.fillRect(0, H() * 0.82, W(), H() * 0.18);
    // the towers
    world.towers.forEach((tw, i) => {
      const x = W() * (0.12 + tw.x * 0.76);
      const base = H() * 0.84;
      const top = base - H() * tw.h;
      const w = W() * tw.w;
      const isCracked = cracked && i === 7;
      const fall = isCracked ? falling : 0;
      ctx.save();
      ctx.translate(x, base);
      ctx.rotate(tw.lean + fall * 1.2);
      const g2 = ctx.createLinearGradient(0, 0, 0, top - base);
      g2.addColorStop(0, "#5a2c1e");
      g2.addColorStop(0.5, "#B8754E");
      g2.addColorStop(1, "#E9B98A");
      A(0.85);
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.moveTo(-w, 0);
      ctx.lineTo(-w * 0.7, top - base);
      ctx.lineTo(w * 0.7, top - base);
      ctx.lineTo(w, 0);
      ctx.closePath();
      ctx.fill();
      // its layers
      A(0.25);
      ctx.strokeStyle = "#FFF1D6";
      ctx.lineWidth = 0.6;
      for (let k = 1; k < 9; k++) {
        const yy = ((top - base) * k) / 9;
        const ww = w * (1 - 0.3 * (k / 9));
        ctx.beginPath();
        ctx.moveTo(-ww, yy);
        ctx.lineTo(ww, yy);
        ctx.stroke();
      }
      // the body inside, faint
      glow(0, (top - base) * 0.3, w * 2, "rgba(233,185,138,0.6)", 0.25 + 0.1 * Math.sin(t + tw.p));
      if (isCracked) {
        A(0.95);
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let k = 1; k <= 8; k++) ctx.lineTo(Math.sin(k * 2.3) * w * 0.4, ((top - base) * 0.55 * k) / 8);
        ctx.stroke();
      }
      ctx.restore();
      if (isCracked && !held && fall < 0.05) {
        // the flood: the whole war at once
        for (let k = 0; k < 9; k++) {
          const a = Math.sin(t * 4 + k * 1.3) * 0.5 + 0.5;
          glow(x + Math.sin(k * 2.1 + t * 0.7) * W() * 0.25, H() * (0.2 + (k % 4) * 0.12), W() * 0.12, `rgba(${k % 2 ? "224,160,122" : "201,123,110"},0.7)`, a * 0.45);
        }
        glow(x, base - H() * tw.h * 0.4, W() * 0.08, "rgba(255,255,255,0.9)", 0.6 + 0.3 * Math.sin(t * 9));
      }
      if (isCracked && held) {
        // our field, holding it
        A(0.35 + 0.1 * Math.sin(t * 2));
        ctx.strokeStyle = "#8B95F6";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(x, base - H() * tw.h * 0.5, w * 2.2, H() * tw.h * 0.6, 0, 0, Math.PI * 2);
        ctx.stroke();
        glow(x, base - H() * tw.h * 0.5, w * 4, "rgba(139,149,246,0.5)", 0.25);
      }
    });
  }

  function dust(t, a = 0.3, color = "#F4E4DA") {
    ctx.fillStyle = color;
    world.dust.forEach((d) => {
      const x = (((d.x + t * d.vx) % 1) + 1) % 1;
      A(a * (0.3 + 0.7 * Math.abs(Math.sin(t * 0.5 + d.p))));
      ctx.fillRect(x * W(), d.y * H(), d.s, d.s);
    });
  }

  // ---------- scenes ----------
  S["glass-orbit"] = (t) => {
    A(1);
    ctx.fillStyle = "#05040b";
    ctx.fillRect(0, 0, W(), H());
    world.stars.forEach((s) => {
      A(0.3 + 0.5 * Math.abs(Math.sin(t * 0.4 + s.p)));
      ctx.fillStyle = "#F4E4DA";
      ctx.fillRect(s.x * W(), s.y * H(), s.s, s.s);
    });
    const m = Math.min(W(), H());
    // the red star, off to the left
    glow(W() * 0.06, H() * 0.2, m * 0.5, "rgba(224,106,80,0.6)", 0.7);
    // the white companion, far off
    glow(W() * 0.9, H() * 0.14, m * 0.1, "rgba(230,236,255,0.8)", 0.6);
    A(1);
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(W() * 0.9, H() * 0.14, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Dacapo
    const cx = W() * 0.5, cy = H() * 0.55, R = m * 0.3;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    A(1);
    const g = ctx.createRadialGradient(cx - R * 0.5, cy - R * 0.4, R * 0.1, cx, cy, R);
    g.addColorStop(0, "#8a4a3a");
    g.addColorStop(1, "#2a1218");
    ctx.fillStyle = g;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    // the white southern plain
    A(0.85);
    const g2 = ctx.createLinearGradient(0, cy + R * 0.1, 0, cy + R);
    g2.addColorStop(0, "rgba(240,230,226,0)");
    g2.addColorStop(0.35, "rgba(240,230,226,0.9)");
    g2.addColorStop(1, "rgba(200,190,200,0.9)");
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.ellipse(cx + R * 0.1, cy + R * 0.62, R * 1.1, R * 0.55, -0.12, 0, Math.PI * 2);
    ctx.fill();
    // the northern canyon, a thin dark scar
    A(0.7);
    ctx.strokeStyle = "#1a0d14";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.5, cy - R * 0.05);
    ctx.quadraticCurveTo(cx, cy - R * 0.15, cx + R * 0.55, cy + R * 0.02);
    ctx.stroke();
    // night side
    A(0.65);
    const g3 = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
    g3.addColorStop(0, "rgba(0,0,0,0)");
    g3.addColorStop(0.6, "rgba(0,0,0,0.2)");
    g3.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = g3;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.restore();
    glow(cx - R * 0.3, cy - R * 0.2, R * 1.4, "rgba(224,106,80,0.25)", 0.4);
    mark(cx + R * 1.25, cy - R * 0.85, Math.max(6, m * 0.018), t, 0.9);
  };

  S["glass-plain"] = (t) => {
    sky(t, { companion: 0.2 });
    sea(t);
    crowd(t, 0.62, { count: 26 });
    dust(t, 0.15);
    mark(W() * 0.82, H() * 0.42, Math.max(6, Math.min(W(), H()) * 0.018), t, 0.85);
  };

  S["glass-returners"] = (t) => {
    sky(t, { companion: 0.2 });
    sea(t);
    crowd(t, 0.62, { count: 46 });
    dust(t, 0.15);
  };

  S["glass-bright"] = (t) => {
    sky(t, { companion: 0.25 });
    sea(t, 0.62, { bright: 0.7 });
    crowd(t, 0.62, { count: 14, speak: false });
    const m = Math.min(W(), H());
    const mx = W() * 0.7, my = H() * 0.45;
    returner(W() * 0.36, H() * 0.94, H() * 0.62, t, { age: 0.02, p: 1, speak: { x: mx, y: my, color: "#F4F6FF" } });
    mark(mx, my, Math.max(7, m * 0.022), t, 1);
  };

  S["glass-rings"] = (t) => {
    // a cross-section of a returner: one ring a year, round a glowing core
    A(1);
    ctx.fillStyle = "#0c0710";
    ctx.fillRect(0, 0, W(), H());
    const cx = W() * 0.5, cy = H() * 0.5, m = Math.min(W(), H());
    glow(cx, cy, m * 0.5, "rgba(233,185,138,0.2)", 0.6);
    const n = 40;
    for (let k = n; k >= 1; k--) {
      const f = k / n;
      const rr = m * (0.04 + f * 0.36);
      const wob = 1 + Math.sin(k * 1.7) * 0.015;
      A(0.85);
      ctx.strokeStyle = tintAt(f * 0.95);
      ctx.lineWidth = Math.max(0.8, m * 0.004);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rr * wob, rr * (2 - wob), k * 0.05, 0, Math.PI * 2);
      ctx.stroke();
      // the year inside each ring: tiny marks that light as we read
      const lit = (t * 4) % n;
      if (Math.abs(lit - k) < 1.5) {
        for (let j = 0; j < 14; j++) {
          const a = (j / 14) * Math.PI * 2 + k;
          glow(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, m * 0.012, "rgba(255,241,214,0.9)", 0.7);
        }
      }
    }
    glow(cx, cy, m * 0.08, "rgba(255,255,255,0.9)", 0.8 + 0.2 * Math.sin(t * 1.5));
  };

  S["glass-heavy"] = (t) => {
    sky(t, { companion: 0.3, warm: 0.8 });
    sea(t, 0.62, { bright: 0.35 });
    const base = H() * 0.92;
    const hx = W() * 0.5;
    const heavy = returner(hx, base, H() * 0.68, t, { heavy: 1, age: 0.9, p: 2 });
    // others standing near it, casting light on it
    [[0.2, 0.86, 0.38, 0.2], [0.3, 0.97, 0.5, 0.4], [0.76, 0.95, 0.48, 0.1], [0.86, 0.84, 0.34, 0.5]].forEach(([x, b, hh, age], i) => {
      returner(W() * x, H() * b, H() * hh, t, { age, p: i * 1.3, speak: { x: heavy.x, y: heavy.coreY, color: tintAt(age) } });
    });
    dust(t, 0.12);
  };

  S["glass-canyon"] = (t) => {
    canyon(t, { war: 0.35, cracked: api.flag && api.flag("cracked"), held: api.flag && api.flag("held") });
    dust(t, 0.15, "#E9B98A");
  };

  S["glass-war"] = (t) => {
    canyon(t, { war: 1, cracked: api.flag && api.flag("cracked"), held: api.flag && api.flag("held") });
    dust(t, 0.2, "#E9B98A");
  };

  S["glass-crack"] = (t) => {
    canyon(t, { war: 1.2, cracked: true, held: api.flag && api.flag("held") });
    dust(t, 0.25, "#FFF1D6");
  };

  S["glass-companion"] = (t, age) => {
    const c = Math.min(1, 0.4 + age / 10);
    sky(t, { companion: c });
    sea(t, 0.62, { bright: 0.8 });
    crowd(t, 0.62, { count: 40, speak: false });
    // the ringing: glints on every body
    world.crowd.slice(0, 40).forEach((cw, i) => {
      const y = H() * (0.64 + cw.d * 0.38 * 0.7) - H() * (0.06 + cw.d * 0.26) * 0.75;
      const a = Math.max(0, Math.sin(t * 6 + i * 1.7)) ** 8;
      glow(cw.x * W(), y, 6 + cw.d * 10, "rgba(244,246,255,0.9)", a * c);
    });
  };

  S["glass-return"] = (t, age) => {
    const shed = Math.min(1, age / 14);
    sky(t, { companion: 1 });
    sea(t, 0.62, { bright: 1 });
    crowd(t, 0.62, { count: 46, speak: false, shed, bright: shed * 0.5 });
    // rings falling as light
    world.shards.forEach((s) => {
      const y = ((s.y + t * s.v) % 1) * H();
      const x = s.x * W() + Math.sin(t * 0.8 + s.rot) * 10;
      const col = s.c < 0.6 ? tintAt(s.c * 1.4) : WAR[Math.floor(s.c * 10) % WAR.length];
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(s.rot + t * s.spin);
      A(0.65 * (1 - y / H() * 0.5));
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, -s.s);
      ctx.lineTo(s.s * 0.5, 0);
      ctx.lineTo(0, s.s);
      ctx.lineTo(-s.s * 0.5, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      if (s.s > 5.5) glow(x, y, s.s * 3, "rgba(255,241,214,0.7)", 0.25);
    });
  };

  S["glass-light"] = (t, age) => {
    const up = Math.min(1, age / 6);
    sky(t, { companion: 0.6, warm: 1 });
    sea(t, 0.62, { bright: 1 });
    crowd(t, 0.62, { count: 30, bright: 1, speak: true });
    glow(W() * 0.5, H() * 0.55, W() * 0.6, "rgba(244,246,255,0.25)", up);
    mark(W() * 0.8, H() * 0.42, Math.max(6, Math.min(W(), H()) * 0.018), t, 0.9);
  };

  S["glass-dark"] = (t, age) => {
    const down = Math.min(1, age / 8);
    sky(t, { companion: 0, night: 1 });
    sea(t, 0.62, { bright: 0.2 * (1 - down) + 0.05 });
    A(0.5 + down * 0.3);
    ctx.fillStyle = "#05040b";
    ctx.fillRect(0, H() * 0.62, W(), H() * 0.38);
    crowd(t, 0.62, { count: 12, speak: false });
    dust(t, 0.1);
  };

  // the cover (public/covers/assignment-0514229.jpg was drawn from this)
  S["glass-cover"] = (t) => {
    const hz = 0.7;
    sky(t, { companion: 1, horizon: hz, cy: 0.42 });
    sea(t, hz, { bright: 1 });
    crowd(t, hz, { count: 22, speak: false, shed: 0.6, bright: 0.3 });
    world.shards.slice(0, 150).forEach((sh) => {
      const y = (0.42 + ((sh.y + t * sh.v) % 1) * 0.58) * H();
      const x = sh.x * W();
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(sh.rot);
      A(0.7);
      ctx.fillStyle = sh.c < 0.6 ? tintAt(sh.c * 1.4) : WAR[Math.floor(sh.c * 10) % WAR.length];
      ctx.beginPath();
      ctx.moveTo(0, -sh.s * 1.4);
      ctx.lineTo(sh.s * 0.6, 0);
      ctx.lineTo(0, sh.s * 1.4);
      ctx.lineTo(-sh.s * 0.6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      if (sh.s > 5) glow(x, y, sh.s * 4, "rgba(255,241,214,0.7)", 0.3);
    });
    const m = Math.min(W(), H());
    const me = returner(W() * 0.42, H() * 0.98, H() * 0.42, t, { age: 0.05, p: 0.4, shed: 0.5, ring: 1, speak: { x: W() * 0.74, y: H() * 0.6, color: "#F4F6FF" } });
    glow(me.x, me.coreY, m * 0.35, "rgba(255,241,214,0.5)", 0.55);
    mark(W() * 0.74, H() * 0.6, Math.max(8, m * 0.03), t, 1, { ping: false });
  };

  return S;
}
