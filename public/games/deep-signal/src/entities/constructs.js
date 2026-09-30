// Constructs - the Warden's geometry, made mobile. Few, slow, and they
// insist rather than hunt. A pulse makes them reconsider. Never waves.

import { moveCircle } from "../world/world.js";
import { TILE, ROOM_W, ROOM_H } from "../config.js";

export function spawnConstruct(run, api) {
  const room = run.world.roomAt(run.player.x, run.player.y);
  if (!room || room.type === "landing" || room.type === "node") return false;
  // appear at the far side of the current room, out of the light
  const ox = room.cx * ROOM_W * TILE, oy = room.cy * ROOM_H * TILE;
  const candidates = [];
  for (let i = 0; i < 20; i++) {
    const x = ox + (2 + api.rng.next() * (ROOM_W - 4)) * TILE;
    const y = oy + (2 + api.rng.next() * (ROOM_H - 4)) * TILE;
    const tx = Math.floor(x / TILE), ty = Math.floor(y / TILE);
    if (run.world.tileAt(tx, ty) !== 1) continue;
    const d = Math.hypot(x - run.player.x, y - run.player.y);
    if (d > 170) candidates.push({ x, y, d });
  }
  if (!candidates.length) return false;
  candidates.sort((a, b) => b.d - a.d);
  const c = candidates[0];
  const slot = run.constructs.find((k) => !k.alive) || {};
  Object.assign(slot, { alive: true, x: c.x, y: c.y, vx: 0, vy: 0, radius: 10, stun: 0, life: 45, spin: 0, hitCd: 0, appear: 0 });
  if (!run.constructs.includes(slot)) run.constructs.push(slot);
  api.discover("ent-construct");
  api.audio.warden();
  return true;
}

export function updateConstructs(run, api, dt) {
  const p = run.player;
  run.constructs.forEach((c) => {
    if (!c.alive) return;
    c.life -= dt;
    c.appear = Math.min(1, c.appear + dt * 0.6);
    c.spin += dt * (c.stun > 0 ? 0.3 : 1.4);
    c.hitCd = Math.max(0, c.hitCd - dt);
    if (c.life <= 0) {
      c.alive = false;
      api.particles.burst(c.x, c.y, 14, { speed: 50, life: 1.2 });
      return;
    }
    const dx = p.x - c.x, dy = p.y - c.y;
    const d = Math.hypot(dx, dy) || 1;
    if (c.stun > 0) {
      c.stun -= dt;
    } else if (d < 340) {
      const speed = 62 + (run.warden.state === "CONFRONTING" ? 18 : 0);
      c.vx += (dx / d) * speed * 2 * dt;
      c.vy += (dy / d) * speed * 2 * dt;
      const v = Math.hypot(c.vx, c.vy);
      if (v > speed) { c.vx *= speed / v; c.vy *= speed / v; }
    }
    c.vx *= 1 - Math.min(1, 1.2 * dt);
    c.vy *= 1 - Math.min(1, 1.2 * dt);
    moveCircle(run.world, c, c.vx * dt, c.vy * dt);
    if (d < c.radius + p.radius + 4 && c.stun <= 0 && c.hitCd <= 0 && c.appear >= 1) {
      c.hitCd = 1.2;
      api.damage(12);
      api.addAwareness(2);
      p.vx += (dx / d) * 260;
      p.vy += (dy / d) * 260;
    }
  });
}

export function pulseConstructs(run, x, y, radius) {
  let hit = 0;
  run.constructs.forEach((c) => {
    if (!c.alive) return;
    const dx = c.x - x, dy = c.y - y;
    const d = Math.hypot(dx, dy) || 1;
    if (d < radius) {
      c.stun = 4;
      c.vx = (dx / d) * 240;
      c.vy = (dy / d) * 240;
      hit++;
    }
  });
  return hit;
}

export function drawConstructs(ctx, run, t) {
  run.constructs.forEach((c) => {
    if (!c.alive) return;
    const a = c.appear * (c.life < 3 ? c.life / 3 : 1);
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.globalAlpha = a;
    ctx.strokeStyle = c.stun > 0 ? "rgba(124,124,132,0.8)" : "#f4f1ea";
    ctx.lineWidth = 1.5;
    for (let k = 0; k < 2; k++) {
      ctx.rotate(c.spin * (k ? -1 : 1));
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const an = (i / 3) * Math.PI * 2 - Math.PI / 2;
        const r = 14 - k * 5;
        i ? ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r) : ctx.moveTo(Math.cos(an) * r, Math.sin(an) * r);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.fillStyle = c.stun > 0 ? "#4a4a52" : "#fff4d6";
    ctx.beginPath();
    ctx.arc(0, 0, 2.5 + Math.sin(t * 6) * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}
