// Drawing SIXTEEN. Everything is drawn in the logical VIEW space; main.js
// sets a transform that scales it to fit the screen with bars as needed.

import { VIEW, CENTER, COLORS, SPECIALTIES, TIDE, FAULTS } from "./config.js";

const TAU = Math.PI * 2;

export function createRenderer() {
  const snow = Array.from({ length: 140 }, () => ({
    x: Math.random() * VIEW.w, y: Math.random() * VIEW.h, r: Math.random() * 1.3 + 0.3,
    v: Math.random() * 6 + 2, a: Math.random() * 0.4 + 0.1, z: Math.random(),
  }));
  const streaks = Array.from({ length: 60 }, () => ({ x: Math.random() * VIEW.w, y: Math.random() * VIEW.h, l: 30 + Math.random() * 80 }));
  // distant grown architecture, fixed silhouettes behind the network
  const spires = Array.from({ length: 22 }, (_, i) => ({ x: (i / 22) * VIEW.w + Math.random() * 30, h: 60 + Math.random() * 180, w: 10 + Math.random() * 26 }));

  function background(ctx, g, t, reduced) {
    const bg = ctx.createRadialGradient(CENTER.x, CENTER.y, 60, CENTER.x, CENTER.y, 700);
    bg.addColorStop(0, "#0b2f3d");
    bg.addColorStop(0.55, COLORS.deep);
    bg.addColorStop(1, COLORS.abyss);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, VIEW.w, VIEW.h);
    // spires
    ctx.fillStyle = "rgba(20,70,80,0.18)";
    spires.forEach((s) => {
      ctx.beginPath();
      ctx.moveTo(s.x - s.w, VIEW.h);
      ctx.quadraticCurveTo(s.x - s.w * 0.3, VIEW.h - s.h * 0.6, s.x, VIEW.h - s.h);
      ctx.quadraticCurveTo(s.x + s.w * 0.3, VIEW.h - s.h * 0.6, s.x + s.w, VIEW.h);
      ctx.fill();
    });
    // marine snow drifts down (and sideways in a current)
    const drift = g && g.current && g.current.warn <= 0 ? 120 : 0;
    snow.forEach((p) => {
      if (!reduced) {
        p.y += p.v * (0.016) * (0.5 + p.z);
        if (g && g.current) p.x += Math.cos(g.current.angle) * drift * 0.016 * p.z;
        if (p.y > VIEW.h) { p.y = -4; p.x = Math.random() * VIEW.w; }
        if (p.x < -4) p.x = VIEW.w + 2; if (p.x > VIEW.w + 4) p.x = -2;
      }
      ctx.fillStyle = `rgba(190,240,235,${p.a})`;
      ctx.fillRect(p.x, p.y, p.r, p.r);
    });
  }

  function currentStreaks(ctx, g, t) {
    const c = g.current;
    if (!c) return;
    const strength = c.warn > 0 ? Math.max(0, 1 - c.warn / 4) * 0.3 : 0.55;
    const dx = Math.cos(c.angle), dy = Math.sin(c.angle);
    ctx.strokeStyle = `rgba(160,230,225,${strength * 0.5})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    streaks.forEach((s) => {
      const off = (t * (c.warn > 0 ? 90 : 420) + s.l * 7) % (VIEW.w + 200);
      const x = (s.x + dx * off) % (VIEW.w + 100);
      const y = (s.y + dy * off) % (VIEW.h + 100);
      const xx = x < 0 ? x + VIEW.w : x, yy = y < 0 ? y + VIEW.h : y;
      ctx.moveTo(xx, yy);
      ctx.lineTo(xx - dx * s.l, yy - dy * s.l);
    });
    ctx.stroke();
  }

  function network(ctx, g, t) {
    const { links, nodes, chambers } = g.city;
    // conduits
    links.forEach((l) => {
      const lit = Math.min(l.a.light, l.b.light);
      const cx = (l.a.x + l.b.x) / 2 + (l.b.y - l.a.y) * 0.06, cy = (l.a.y + l.b.y) / 2 - (l.b.x - l.a.x) * 0.06;
      ctx.strokeStyle = COLORS.conduit;
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(l.a.x, l.a.y); ctx.quadraticCurveTo(cx, cy, l.b.x, l.b.y); ctx.stroke();
      ctx.strokeStyle = `rgba(111,242,224,${0.12 + lit * 0.3})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      // energy pulses travel outward
      if (lit > 0.3) {
        for (let k = 0; k < 2; k++) {
          const p = ((t * 0.35 + l.flow + k * 0.5) % 1);
          const x = (1 - p) * (1 - p) * l.a.x + 2 * (1 - p) * p * cx + p * p * l.b.x;
          const y = (1 - p) * (1 - p) * l.a.y + 2 * (1 - p) * p * cy + p * p * l.b.y;
          ctx.fillStyle = `rgba(160,255,240,${lit * 0.8})`;
          ctx.beginPath(); ctx.arc(x, y, 2.2, 0, TAU); ctx.fill();
        }
      }
    });
    // chambers
    chambers.forEach((c) => {
      ctx.fillStyle = "rgba(20,60,70,0.9)";
      ctx.strokeStyle = "rgba(111,242,224,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(c.x, c.y, 24, 34, 0, 0, TAU); ctx.fill(); ctx.stroke();
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = "rgba(255,201,120,0.7)";
        ctx.fillRect(c.x - 6, c.y - 16 + i * 11, 12, 6);
      }
      ctx.fillStyle = "rgba(111,154,163,0.9)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("PARTS", c.x, c.y + 48);
    });
    // towers: grown, crystalline, lit by how healthy they are
    nodes.forEach((n) => {
      if (n.kind === "core") return;
      const size = n.ring === 1 ? 15 : 11;
      const glow = ctx.createRadialGradient(n.x, n.y, 2, n.x, n.y, size * 3.2);
      glow.addColorStop(0, `rgba(111,242,224,${0.08 + n.light * 0.35})`);
      glow.addColorStop(1, "rgba(111,242,224,0)");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(n.x, n.y, size * 3.2, 0, TAU); ctx.fill();
      ctx.fillStyle = n.light > 0.5 ? "#1f6b72" : "#16353c";
      ctx.strokeStyle = `rgba(160,255,240,${0.25 + n.light * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU + (n.ring === 1 ? 0 : Math.PI / 6);
        const r = size * (i % 2 ? 0.8 : 1.1);
        i ? ctx.lineTo(n.x + Math.cos(a) * r, n.y + Math.sin(a) * r * 1.2) : ctx.moveTo(n.x + Math.cos(a) * r, n.y + Math.sin(a) * r * 1.2);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = `rgba(200,255,250,${0.2 + n.light * 0.8})`;
      ctx.beginPath(); ctx.arc(n.x, n.y - 2, 2.5 + Math.sin(t * 2 + n.pulse) * 0.6, 0, TAU); ctx.fill();
    });
  }

  function ring(ctx, x, y, r, frac, color, width = 3) {
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = width;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = color;
    ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * Math.max(0, Math.min(1, frac))); ctx.stroke();
  }

  function faults(ctx, g, t) {
    g.faults.forEach((f) => {
      if (!f.revealed) return;
      if (f.type === "rupture") return rupture(ctx, g, f, t);
      const hot = f.escalated || f.burst;
      const pulse = 0.5 + 0.5 * Math.sin(t * (hot ? 9 : 4) + f.id);
      const color = f.type === "call" ? COLORS.energy : f.type === "hidden" ? COLORS.sense : hot ? "#ff8a5c" : COLORS.energyWarm;
      // halo
      ctx.fillStyle = f.type === "call" ? `rgba(111,242,224,${0.08 + pulse * 0.1})` : `rgba(255,150,90,${0.08 + pulse * (hot ? 0.2 : 0.1)})`;
      ctx.beginPath(); ctx.arc(f.x, f.y, 24 + pulse * 4, 0, TAU); ctx.fill();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;
      if (f.type === "breach" || (f.type === "hidden")) {
        // a crack, spilling bubbles
        ctx.beginPath();
        ctx.moveTo(f.x - 10, f.y - 6); ctx.lineTo(f.x - 3, f.y); ctx.lineTo(f.x - 6, f.y + 4); ctx.lineTo(f.x + 4, f.y + 2); ctx.lineTo(f.x + 10, f.y + 8);
        ctx.stroke();
        for (let i = 0; i < 3; i++) {
          const by = f.y - ((t * 30 + i * 9 + f.id * 5) % 26);
          ctx.globalAlpha = 0.6;
          ctx.beginPath(); ctx.arc(f.x + Math.sin(t * 3 + i) * 4, by, 1.8, 0, TAU); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      } else if (f.type === "overload") {
        ctx.beginPath(); ctx.arc(f.x, f.y, 9 + pulse * 3, 0, TAU); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(f.x - 3, f.y - 7); ctx.lineTo(f.x + 2, f.y - 1); ctx.lineTo(f.x - 2, f.y + 1); ctx.lineTo(f.x + 3, f.y + 7); ctx.stroke();
      } else if (f.type === "component") {
        ctx.strokeRect(f.x - 8, f.y - 8, 16, 16);
        if (f.partDelivered) ctx.fillRect(f.x - 5, f.y - 5, 10, 10);
        else { ctx.setLineDash([2, 3]); ctx.strokeRect(f.x - 4, f.y - 4, 8, 8); ctx.setLineDash([]); }
      } else if (f.type === "call") {
        for (let i = 0; i < 3; i++) {
          const rr = ((t * 22 + i * 10) % 30);
          ctx.globalAlpha = 1 - rr / 30;
          ctx.beginPath(); ctx.arc(f.x, f.y, rr, 0, TAU); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      // how many limbs it needs, and how many are there
      const present = [...f.assigned].filter((id) => g.arms[id].state === "work").length;
      if (f.need > 1) {
        for (let i = 0; i < f.need; i++) {
          ctx.fillStyle = i < present ? COLORS.energy : "rgba(255,255,255,0.18)";
          ctx.beginPath(); ctx.arc(f.x - (f.need - 1) * 5 + i * 10, f.y + 26, 3, 0, TAU); ctx.fill();
        }
      }
      if (f.type === "component" && !f.partDelivered) {
        ctx.fillStyle = "rgba(255,201,120,0.85)";
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("NEEDS PART", f.x, f.y - 26);
      }
      // progress, or the time until it worsens
      if (f.progress > 0) ring(ctx, f.x, f.y, 18, f.progress / f.work, COLORS.energy, 3);
      else {
        const def = FAULTS[f.type];
        const limit = f.type === "call" ? def.expire : f.type === "hidden" ? f.burstAt : def.escalate;
        if (limit && !hot) ring(ctx, f.x, f.y, 18, 1 - f.age / limit, "rgba(255,201,120,0.45)", 1.5);
      }
    });
  }

  function rupture(ctx, g, f, t) {
    const x = f.x, y = f.y;
    const glow = ctx.createRadialGradient(x, y, 10, x, y, 140);
    glow.addColorStop(0, `rgba(255,120,80,${0.25 + 0.1 * Math.sin(t * 5)})`);
    glow.addColorStop(1, "rgba(255,120,80,0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(x, y, 140, 0, TAU); ctx.fill();
    // the split in the ocean floor, glowing hot, spilling the deep
    const crack = [[-190, 0], [-130, -14], [-80, 10], [-30, -8], [20, 16], [70, -6], [120, 14], [190, -4]];
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    [[16, "rgba(255,120,80,0.18)"], [7, "rgba(255,150,100,0.5)"], [2.5, "#ffd0b0"]].forEach(([w, c]) => {
      ctx.strokeStyle = c;
      ctx.lineWidth = w + Math.sin(t * 6) * (w > 10 ? 3 : 0);
      ctx.beginPath();
      crack.forEach(([cx, cy], i) => (i ? ctx.lineTo(x + cx, y + cy) : ctx.moveTo(x + cx, y + cy)));
      ctx.stroke();
    });
    for (let i = 0; i < 14; i++) {
      const bx = x - 170 + i * 26, by = y - ((t * 60 + i * 17) % 110);
      ctx.strokeStyle = "rgba(255,200,170,0.5)";
      ctx.beginPath(); ctx.arc(bx + Math.sin(t * 2 + i) * 5, by, 2.5, 0, TAU); ctx.stroke();
    }
    ring(ctx, CENTER.x, CENTER.y, 96, f.progress / f.work, COLORS.energy, 5);
    ctx.fillStyle = "rgba(255,208,176,0.9)";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.round((f.progress / f.work) * 100)}%`, CENTER.x, CENTER.y - 104);
  }

  // one limb: a tapered curve from its root on the body to its tip, the tip
  // dividing into small grasping points, as the limbs in the story do
  function limb(ctx, g, a, t, selected, dissent) {
    const root = a.root, tip = a.tip;
    const dx = tip.x - root.x, dy = tip.y - root.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const sway = Math.sin(t * 1.6 + a.phase) * Math.min(26, len * 0.18);
    const c1 = { x: root.x + dx * 0.3 + nx * sway, y: root.y + dy * 0.3 + ny * sway };
    const c2 = { x: root.x + dx * 0.7 - nx * sway * 0.6, y: root.y + dy * 0.7 - ny * sway * 0.6 };
    const spec = SPECIALTIES[a.specialty];
    const N = 14;
    let px = root.x, py = root.y;
    for (let i = 1; i <= N; i++) {
      const u = i / N, v = 1 - u;
      const x = v * v * v * root.x + 3 * v * v * u * c1.x + 3 * v * u * u * c2.x + u * u * u * tip.x;
      const y = v * v * v * root.y + 3 * v * v * u * c1.y + 3 * v * u * u * c2.y + u * u * u * tip.y;
      ctx.strokeStyle = dissent ? `rgba(184,156,255,${0.6 + 0.4 * Math.sin(t * 10)})` : selected ? "#fff0f4" : a.state === "anchor" ? "#7fd1a8" : `rgb(${Math.round(232 - u * 60)},${Math.round(154 - u * 40)},${Math.round(176 - u * 30)})`;
      ctx.lineWidth = 9 * (1 - u) + 1.6;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
      px = x; py = y;
    }
    // branching tip, tinted by what this limb is good at
    const ang = Math.atan2(tip.y - c2.y, tip.x - c2.x);
    ctx.strokeStyle = spec.color;
    ctx.lineWidth = 1.2;
    for (let k = -2; k <= 2; k++) {
      const aa = ang + k * 0.35 + Math.sin(t * 5 + a.phase + k) * (a.state === "work" ? 0.25 : 0.08);
      ctx.beginPath(); ctx.moveTo(tip.x, tip.y); ctx.lineTo(tip.x + Math.cos(aa) * 7, tip.y + Math.sin(aa) * 7); ctx.stroke();
    }
    if (a.carrying) { ctx.fillStyle = COLORS.energyWarm; ctx.fillRect(tip.x - 4, tip.y - 4, 8, 8); }
    if (selected) {
      ctx.strokeStyle = "rgba(255,240,244,0.8)";
      ctx.beginPath(); ctx.arc(tip.x, tip.y, 13, 0, TAU); ctx.stroke();
    }
  }

  function creature(ctx, g, t) {
    const d = g.dissent;
    // sleeping limbs: short, curled, dim
    g.arms.forEach((a) => {
      if (a.mature) return;
      ctx.strokeStyle = "rgba(232,154,176,0.22)";
      ctx.lineWidth = 4;
      const ex = a.root.x + Math.cos(a.angle) * 16, ey = a.root.y + Math.sin(a.angle) * 13;
      ctx.beginPath(); ctx.moveTo(a.root.x, a.root.y); ctx.quadraticCurveTo(ex + Math.sin(t + a.id) * 3, ey, a.root.x + Math.cos(a.angle + 0.6) * 10, a.root.y + Math.sin(a.angle + 0.6) * 8); ctx.stroke();
    });
    const r = g.rupture;
    const objecting = r && (r.stage === "dissent" || r.stage === "ignored") ? [...r.fault.assigned].slice(0, 3) : [];
    g.arms.forEach((a) => { if (a.mature) limb(ctx, g, a, t, g.selectedArm === a.id, (d && d.armId === a.id) || objecting.includes(a.id)); });
    // the dissenting limb points at what it feels
    if (d) {
      const a = g.arms[d.armId];
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = "rgba(184,156,255,0.7)";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(a.tip.x, a.tip.y); ctx.lineTo(d.target.x, d.target.y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(d.target.x, d.target.y, 16 + Math.sin(t * 8) * 3, 0, TAU); ctx.stroke();
      ctx.fillStyle = "rgba(184,156,255,0.9)";
      ctx.font = "bold 12px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("?", d.target.x, d.target.y + 4);
    }
    // the body: a rounded central mass in a flexible shell
    const shake = g.shake > 0 ? (Math.random() - 0.5) * g.shake * 8 : 0;
    const bx = CENTER.x + shake, by = CENTER.y;
    const body = ctx.createRadialGradient(bx - 10, by - 10, 4, bx, by, 52);
    body.addColorStop(0, "#6aa3ad");
    body.addColorStop(0.6, COLORS.shell);
    body.addColorStop(1, "#1d3d46");
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(bx, by, 46, 38, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(200,255,250,0.25)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.ellipse(bx, by, 46 - i * 10, 38 - i * 8, 0, 0, TAU); ctx.stroke(); }
    // the central mind, glowing with the city's light
    const mind = 0.4 + 0.4 * (g.light / 100) + 0.2 * Math.sin(t * 2);
    ctx.fillStyle = `rgba(232,154,176,${mind})`;
    ctx.beginPath(); ctx.arc(bx, by, 9, 0, TAU); ctx.fill();
    // anchors needed
    if (g.current) {
      const have = g.anchorStrength(), need = g.current.need;
      ctx.strokeStyle = have >= need ? "rgba(127,209,168,0.8)" : `rgba(255,138,92,${0.5 + 0.5 * Math.sin(t * 8)})`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(bx, by, 58, 49, 0, 0, TAU); ctx.stroke();
      // direction of the flood
      const ax = CENTER.x - Math.cos(g.current.angle) * 120, ay = CENTER.y - Math.sin(g.current.angle) * 100;
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(g.current.angle);
      ctx.fillStyle = "rgba(160,230,225,0.6)";
      ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-10, -10); ctx.lineTo(-4, 0); ctx.lineTo(-10, 10); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }

  return {
    draw(ctx, g, t, { reduced }) {
      background(ctx, g, t, reduced);
      currentStreaks(ctx, g, t);
      network(ctx, g, t);
      faults(ctx, g, t);
      creature(ctx, g, t);
      if (g.flash > 0) { ctx.fillStyle = `rgba(160,255,240,${g.flash * 0.3})`; ctx.fillRect(0, 0, VIEW.w, VIEW.h); }
      // darkness creeps in as the city's light fails
      const dark = Math.max(0, 0.55 - g.light / 100 * 0.55);
      if (dark > 0.01) {
        const v = ctx.createRadialGradient(CENTER.x, CENTER.y, 120, CENTER.x, CENTER.y, 620);
        v.addColorStop(0, "rgba(0,0,0,0)");
        v.addColorStop(1, `rgba(0,0,0,${dark})`);
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, VIEW.w, VIEW.h);
      }
    },
    background,
    limb,
  };
}
