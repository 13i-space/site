// World runtime: tile collision, door state, and drawing the rooms.

import { TILE, ROOM_W, ROOM_H, COLORS } from "../config.js";
import { TW, TH } from "./generator.js";

export function isSolid(world, tx, ty) {
  if (tx < 0 || ty < 0 || tx >= TW || ty >= TH) return true;
  const t = world.tiles[ty * TW + tx];
  if (t === 0 || t === 2) return true;
  if (t === 3) {
    const door = world.doorAt.get(ty * TW + tx);
    return !door || door.state !== "open";
  }
  return false;
}

// Push a circle out of any solid tiles it overlaps. Returns the push applied.
function pushOut(world, body) {
  const r = body.radius;
  let px = 0, py = 0;
  const minX = Math.floor((body.x - r) / TILE), maxX = Math.floor((body.x + r) / TILE);
  const minY = Math.floor((body.y - r) / TILE), maxY = Math.floor((body.y + r) / TILE);
  for (let ty = minY; ty <= maxY; ty++) {
    for (let tx = minX; tx <= maxX; tx++) {
      if (!isSolid(world, tx, ty)) continue;
      const left = tx * TILE, top = ty * TILE;
      const nx = Math.max(left, Math.min(body.x, left + TILE));
      const ny = Math.max(top, Math.min(body.y, top + TILE));
      let ddx = body.x - nx, ddy = body.y - ny;
      const d = Math.hypot(ddx, ddy);
      if (d >= r) continue;
      if (d === 0) {
        // center inside the tile: push out the way we came
        ddx = -(body.vx || 0); ddy = -(body.vy || 0);
        const l = Math.hypot(ddx, ddy) || 1;
        body.x += (ddx / l) * r; body.y += (ddy / l) * r;
        px += ddx; py += ddy;
        continue;
      }
      const push = r - d;
      body.x += (ddx / d) * push;
      body.y += (ddy / d) * push;
      px += ddx; py += ddy;
    }
  }
  return { px, py };
}

// Move a circle through the tile grid, one axis at a time, sliding along walls.
export function moveCircle(world, body, dx, dy) {
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / (body.radius * 0.8)));
  for (let i = 0; i < steps; i++) {
    body.x += dx / steps;
    const hx = pushOut(world, body);
    if (hx.px !== 0 && Math.sign(hx.px) !== Math.sign(body.vx || 0)) body.vx *= 0.3;
    body.y += dy / steps;
    const hy = pushOut(world, body);
    if (hy.py !== 0 && Math.sign(hy.py) !== Math.sign(body.vy || 0)) body.vy *= 0.3;
  }
}

export function updateDoors(world, dt) {
  world.doors.forEach((d) => {
    if (d.state === "sealed") {
      d.sealTimer -= dt;
      if (d.sealTimer <= 0) d.state = "open";
    }
  });
}

// small deterministic hash so each room's floor pattern is stable
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

function drawFloorMotif(ctx, r, x0, y0, w, h, contrast) {
  const cx = x0 + w / 2, cy = y0 + h / 2;
  const a = contrast ? 0.22 : 0.12;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(243,227,181,${a})`;
  const seed = hash(r.key);
  switch (r.type) {
    case "warden":
      for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(cx, cy, i * 44, 0, Math.PI * 2); ctx.stroke(); }
      break;
    case "relay":
      for (let i = 0; i < 12; i++) {
        const an = (i / 12) * Math.PI * 2 + seed;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * 40, cy + Math.sin(an) * 40); ctx.lineTo(cx + Math.cos(an) * 190, cy + Math.sin(an) * 190); ctx.stroke();
      }
      break;
    case "walker":
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const off = (i - 2) * 38;
        ctx.moveTo(x0 + 40, cy + off);
        ctx.bezierCurveTo(x0 + w * 0.35, cy + off - 50 * Math.sin(seed * 6 + i), x0 + w * 0.65, cy + off + 50 * Math.cos(seed * 5 + i), x0 + w - 40, cy + off);
        ctx.stroke();
      }
      break;
    case "gate":
    case "node":
      for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(cx, cy, 30 + i * 30, 0, Math.PI * 2); ctx.stroke(); }
      break;
    case "anomaly":
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        for (let j = 0; j <= 20; j++) {
          const x = x0 + 30 + (j / 20) * (w - 60);
          const y = y0 + 40 + i * ((h - 80) / 8) + Math.sin(j * 0.6 + i + seed * 9) * 8;
          j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      break;
    case "caverns":
      break;
    default: {
      // ruins / landing / field: an inlaid rectangle grid
      ctx.strokeRect(x0 + 64, y0 + 64, w - 128, h - 128);
      if (seed > 0.5) ctx.strokeRect(x0 + 128, y0 + 112, w - 256, h - 224);
    }
  }
  ctx.restore();
}

// Draw every tile/room visible in the camera rect (world coords).
export function drawWorld(ctx, world, view, time, opts) {
  const { x0, y0, x1, y1 } = view;
  const tx0 = Math.max(0, Math.floor(x0 / TILE) - 1), ty0 = Math.max(0, Math.floor(y0 / TILE) - 1);
  const tx1 = Math.min(TW - 1, Math.ceil(x1 / TILE) + 1), ty1 = Math.min(TH - 1, Math.ceil(y1 / TILE) + 1);
  const contrast = opts.highContrast;

  // floors
  ctx.fillStyle = COLORS.charcoal;
  for (let ty = ty0; ty <= ty1; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      const t = world.tiles[ty * TW + tx];
      if (t === 1 || (t === 3 && !isSolid(world, tx, ty))) ctx.fillRect(tx * TILE, ty * TILE, TILE + 0.5, TILE + 0.5);
    }
  }
  // faint tile grid on floors
  ctx.strokeStyle = contrast ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let tx = tx0; tx <= tx1; tx++) { ctx.moveTo(tx * TILE, ty0 * TILE); ctx.lineTo(tx * TILE, (ty1 + 1) * TILE); }
  for (let ty = ty0; ty <= ty1; ty++) { ctx.moveTo(tx0 * TILE, ty * TILE); ctx.lineTo((tx1 + 1) * TILE, ty * TILE); }
  ctx.stroke();

  // room motifs for rooms in view
  const rw = ROOM_W * TILE, rh = ROOM_H * TILE;
  world.rooms.forEach((r) => {
    const rx = r.cx * rw, ry = r.cy * rh;
    if (rx > x1 || ry > y1 || rx + rw < x0 || ry + rh < y0) return;
    drawFloorMotif(ctx, r, rx, ry, rw, rh, contrast);
  });

  // walls + gold hairline where a wall faces floor
  const edge = contrast ? "rgba(243,227,181,0.7)" : "rgba(243,227,181,0.42)";
  for (let ty = ty0; ty <= ty1; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      const t = world.tiles[ty * TW + tx];
      const doorClosed = t === 3 && isSolid(world, tx, ty);
      if (t !== 2 && !doorClosed) continue;
      const door = doorClosed ? world.doorAt.get(ty * TW + tx) : null;
      const x = tx * TILE, y = ty * TILE;
      if (door && door.state === "sealed") {
        const pulse = 0.35 + 0.25 * Math.sin(time * 6);
        ctx.fillStyle = `rgba(243,227,181,${pulse * 0.35})`;
        ctx.fillRect(x, y, TILE, TILE);
        ctx.strokeStyle = `rgba(255,244,214,${pulse})`;
        ctx.strokeRect(x + 3, y + 3, TILE - 6, TILE - 6);
        continue;
      }
      ctx.fillStyle = COLORS.stone;
      ctx.fillRect(x, y, TILE + 0.5, TILE + 0.5);
      ctx.strokeStyle = edge;
      ctx.beginPath();
      const floorAt = (ax, ay) => { const v = world.tiles[ay * TW + ax]; return v === 1 || (v === 3 && !isSolid(world, ax, ay)); };
      if (ty > 0 && floorAt(tx, ty - 1)) { ctx.moveTo(x, y + 0.5); ctx.lineTo(x + TILE, y + 0.5); }
      if (ty < TH - 1 && floorAt(tx, ty + 1)) { ctx.moveTo(x, y + TILE - 0.5); ctx.lineTo(x + TILE, y + TILE - 0.5); }
      if (tx > 0 && floorAt(tx - 1, ty)) { ctx.moveTo(x + 0.5, y); ctx.lineTo(x + 0.5, y + TILE); }
      if (tx < TW - 1 && floorAt(tx + 1, ty)) { ctx.moveTo(x + TILE - 0.5, y); ctx.lineTo(x + TILE - 0.5, y + TILE); }
      ctx.stroke();
      // a revealed hidden door keeps a faint seam so it reads as a door
      if (door && door.state === "hidden" && door.revealed) {
        ctx.strokeStyle = "rgba(243,227,181,0.5)";
        ctx.strokeRect(x + 6, y + 6, TILE - 12, TILE - 12);
      }
    }
  }
}
