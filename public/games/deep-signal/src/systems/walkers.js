// The Deep Walkers - never enemies, rarely seen, never explained.
// Shapes at the edge of the light. Tracks in rooms you already searched.
// Markers left where you just were. Once per run, one crosses in full light.

import { TILE, ROOM_W, ROOM_H } from "../config.js";

export function createWalkers() {
  return {
    silhouette: null, // { x, y, life, fade, facing }
    silTimer: 6,
    sighting: null, // the one clear sighting
    sightingDone: false,
    giftsLeft: 1,
    roomsSinceGift: 0,
  };
}

function floorSpotNear(run, api, cx, cy, minD, maxD) {
  for (let i = 0; i < 24; i++) {
    const a = api.rng.next() * Math.PI * 2;
    const d = minD + api.rng.next() * (maxD - minD);
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    const tx = Math.floor(x / TILE), ty = Math.floor(y / TILE);
    if (run.world.tileAt(tx, ty) === 1 && run.world.tileAt(tx, ty - 1) === 1 && run.world.roomAt(x, y) === run.world.roomAt(cx, cy)) return { x, y };
  }
  return null;
}

// Called when the player moves from one room to another.
export function onRoomChange(wk, run, api, from, to) {
  if (!from) return;
  // tracks appear in a room you've already searched
  if ((from.walkerSite || from.dark) && api.rng.chance(0.45)) {
    const explored = [...run.world.rooms.values()].filter((r) => r.explored && r !== to && r !== from && r.type !== "node");
    if (explored.length) {
      const r = api.rng.pick(explored);
      const ox = r.cx * ROOM_W * TILE, oy = r.cy * ROOM_H * TILE;
      const y0 = oy + (3 + api.rng.next() * (ROOM_H - 6)) * TILE;
      const tracks = [];
      for (let i = 0; i < 9; i++) {
        tracks.push({ x: ox + (2.5 + i * 1.9) * TILE, y: y0 + Math.sin(i * 0.7) * 20 + (i % 2 ? 8 : -8), a: 0.1 * Math.sin(i) });
      }
      r.tracks = tracks;
      r.tracksUnseen = true;
    }
  }
  // a marker, placed in the room you just left, facing the way you went
  wk.roomsSinceGift++;
  if (wk.giftsLeft > 0 && wk.roomsSinceGift >= 6 && run.roomsExplored >= 6 && from.type !== "landing" && api.rng.chance(0.35)) {
    const spot = floorSpotNear(run, api, (from.cx * ROOM_W + ROOM_W / 2) * TILE, (from.cy * ROOM_H + ROOM_H / 2) * TILE, 40, 160);
    if (spot) {
      from.objects.push({ id: `gift-${run.time}`, type: "marker", lore: "dw-gift", state: "idle", x: spot.x, y: spot.y, room: from.key, gift: true });
      wk.giftsLeft--;
      wk.roomsSinceGift = 0;
    }
  }
  // the one clear sighting
  if (!wk.sightingDone && to.walkerSite && run.stats.signal >= 25) {
    wk.sightingDone = true;
    wk.sighting = { delay: 1.4, t: 0, room: to.key };
  }
  // tracks you walk into
  if (to.tracks && to.tracksUnseen) {
    to.tracksUnseen = false;
    api.discover("dw-prints");
  }
}

export function updateWalkers(wk, run, api, dt, lightRadius) {
  const p = run.player;
  const room = run.world.roomAt(p.x, p.y);
  // silhouettes at the edge of the light
  if (wk.silhouette) {
    const s = wk.silhouette;
    s.life -= dt;
    const d = Math.hypot(s.x - p.x, s.y - p.y);
    if (d < lightRadius * 0.95 || s.life <= 0) s.fade -= dt * 2.5;
    else s.fade = Math.min(1, s.fade + dt * 0.7);
    if (s.fade <= 0 && s.life < 5.5) {
      if (s.seen) api.discover("ent-shape");
      wk.silhouette = null;
    } else if (s.fade > 0.6) s.seen = true;
  } else if (room && (room.walkerSite || room.dark)) {
    wk.silTimer -= dt;
    if (wk.silTimer <= 0) {
      wk.silTimer = 9 + api.rng.next() * 10;
      const spot = floorSpotNear(run, api, p.x, p.y, lightRadius + 40, lightRadius + 170);
      if (spot) wk.silhouette = { ...spot, life: 6, fade: 0, facing: api.rng.chance(0.5) ? 1 : -1 };
    }
  }

  // the clear sighting
  const s = wk.sighting;
  if (s) {
    if (s.delay > 0) {
      s.delay -= dt;
      if (s.delay <= 0) {
        // cross just ahead of the player, perpendicular to their heading
        // (it doesn't need the doors - the ground carries it)
        if (Math.abs(p.vx) > Math.abs(p.vy)) {
          s.x = p.x + Math.sign(p.vx || 1) * 120; s.y = p.y - 170;
          s.vx = 0; s.vy = 55;
        } else {
          s.x = p.x - 170; s.y = p.y + Math.sign(p.vy || -1) * 120;
          s.vx = 55; s.vy = 0;
        }
        s.t = 0;
        s.alive = true;
        api.audio.warden();
      }
    } else if (s.alive) {
      s.t += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.t > 4.2) {
        s.alive = false;
        api.particles.burst(s.x, s.y + 20, 24, { speed: 30, life: 1.6, size: 1.4 });
        api.discover("ent-walker");
        api.addSignal(3);
        api.msg("PRESSURE. THEN NOTHING.");
        wk.sighting = null;
      }
    }
  }
}

// A tall, narrow body; limbs that test the ground; no face. Drawn over the
// darkness, very faint, so it reads as a shape rather than a thing.
function drawWalker(ctx, x, y, t, alpha, lit) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  const body = lit ? "#2a2a30" : "#16161a";
  const rim = lit ? "rgba(243,227,181,0.8)" : "rgba(243,227,181,0.28)";
  // limbs
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    const side = i < 2 ? -1 : 1;
    const phase = t * 2.2 + i * 1.6;
    const lift = Math.max(0, Math.sin(phase)) * 6;
    ctx.beginPath();
    ctx.moveTo(side * 4, -18 + (i % 2) * 8);
    ctx.quadraticCurveTo(side * 22, -34 + (i % 2) * 10, side * (16 + (i % 2) * 8), 22 - lift);
    ctx.stroke();
  }
  // body
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, -14, 6, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1;
  ctx.stroke();
  // crown: pressure organ, no eyes
  ctx.beginPath();
  ctx.arc(0, -42, 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Floor-level traces (drawn under the darkness - seen only in light)
export function drawTracks(ctx, run, view) {
  run.world.rooms.forEach((r) => {
    if (!r.tracks) return;
    r.tracks.forEach((tr) => {
      if (tr.x < view.x0 - 20 || tr.x > view.x1 + 20 || tr.y < view.y0 - 20 || tr.y > view.y1 + 20) return;
      ctx.fillStyle = "rgba(243,227,181,0.22)";
      for (let k = 0; k < 3; k++) {
        const a = tr.a + (k - 1) * 0.7 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(tr.x + Math.cos(a) * 6, tr.y + Math.sin(a) * 6, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  });
}

// Figures (drawn over the darkness)
export function drawWalkerFigures(ctx, wk, t) {
  if (wk.silhouette) drawWalker(ctx, wk.silhouette.x, wk.silhouette.y, t * 0.2, wk.silhouette.fade * 0.9, false);
  if (wk.sighting && wk.sighting.alive) {
    const s = wk.sighting;
    const a = Math.min(1, s.t / 0.8) * (s.t > 3.4 ? Math.max(0, (4.2 - s.t) / 0.8) : 1);
    drawWalker(ctx, s.x, s.y, s.t, a, true);
  }
}
