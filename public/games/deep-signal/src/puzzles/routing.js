// ENERGY ROUTING - rotate conduit tiles to carry energy from the SOURCE
// through both NODES to the DESTINATION, then commit. Committing a broken
// route overloads the system.

import { panel } from "./common.js";
import { text } from "../ui/text.js";

const N = 1, E = 2, S = 4, W = 8;
const SIZE = 5;
const rot = (m) => ((m << 1) | (m >> 3)) & 15;
const DIRS = [[N, 0, -1, S], [E, 1, 0, W], [S, 0, 1, N], [W, -1, 0, E]];

export function createRouting(game, rng, { onOverload }) {
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  const srcRow = rng.int(0, SIZE - 1);
  let dstRow = rng.int(0, SIZE - 1);

  // a random self-avoiding walk from the left edge to the right edge
  let path;
  for (let attempt = 0; attempt < 200; attempt++) {
    path = [[0, srcRow]];
    const seen = new Set([`0,${srcRow}`]);
    let [x, y] = [0, srcRow];
    let ok = false;
    for (let step = 0; step < 40; step++) {
      const opts = [[1, 0], [0, -1], [0, 1], [1, 0]].filter(([dx, dy]) => {
        const nx = x + dx, ny = y + dy;
        return nx >= 0 && ny >= 0 && nx < SIZE && ny < SIZE && !seen.has(`${nx},${ny}`);
      });
      if (!opts.length) break;
      const [dx, dy] = rng.pick(opts);
      x += dx; y += dy;
      path.push([x, y]);
      seen.add(`${x},${y}`);
      if (x === SIZE - 1) { ok = true; break; }
    }
    if (ok && path.length >= 6) break;
  }
  dstRow = path[path.length - 1][1];

  // tile masks along the path
  path.forEach(([x, y], i) => {
    let m = 0;
    const link = (px, py) => {
      if (px === x + 1) m |= E; if (px === x - 1) m |= W;
      if (py === y + 1) m |= S; if (py === y - 1) m |= N;
    };
    if (i === 0) m |= W; else link(...path[i - 1]);
    if (i === path.length - 1) m |= E; else link(...path[i + 1]);
    grid[y][x] = m;
  });
  const onPath = new Set(path.map(([x, y]) => `${x},${y}`));
  const pieces = [N | S, N | E, N | E | S];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    if (!onPath.has(`${x},${y}`)) grid[y][x] = rng.chance(0.85) ? rng.pick(pieces) : 0;
  }
  // two nodes that must carry energy
  const inner = path.slice(1, -1);
  const nodeIdx = rng.shuffle(inner.map((_, i) => i)).slice(0, 2);
  const nodes = new Set(nodeIdx.map((i) => `${inner[i][0]},${inner[i][1]}`));
  // scramble
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const turns = rng.int(0, 3);
    for (let k = 0; k < turns; k++) grid[y][x] = rot(grid[y][x]);
  }

  let cx = 0, cy = srcRow;
  let t = 0, solvedAt = null, flash = 0;
  let geo = null;
  const state = { result: null };

  const flow = () => {
    const lit = new Set();
    if (!(grid[srcRow][0] & W)) return lit;
    const q = [[0, srcRow]];
    lit.add(`0,${srcRow}`);
    while (q.length) {
      const [x, y] = q.pop();
      DIRS.forEach(([bit, dx, dy, back]) => {
        if (!(grid[y][x] & bit)) return;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) return;
        if (!(grid[ny][nx] & back) || lit.has(`${nx},${ny}`)) return;
        lit.add(`${nx},${ny}`);
        q.push([nx, ny]);
      });
    }
    return lit;
  };
  const complete = (lit) => lit.has(`${SIZE - 1},${dstRow}`) && (grid[dstRow][SIZE - 1] & E) && [...nodes].every((n) => lit.has(n));

  state.update = (dt, input) => {
    t += dt;
    flash = Math.max(0, flash - dt);
    if (solvedAt !== null) { if (t - solvedAt > 1.4) state.result = "solved"; return; }
    if (input.take("pause")) { state.result = "aborted"; return; }
    if (input.take("left")) cx = Math.max(0, cx - 1);
    if (input.take("right")) cx = Math.min(SIZE - 1, cx + 1);
    if (input.take("up")) cy = Math.max(0, cy - 1);
    if (input.take("down")) cy = Math.min(SIZE - 1, cy + 1);
    let rotate = input.take("interact") || input.take("scan");
    if (input.takeClick() && geo) {
      const gx = Math.floor((input.pointer.x - geo.x) / geo.cell), gy = Math.floor((input.pointer.y - geo.y) / geo.cell);
      if (gx >= 0 && gy >= 0 && gx < SIZE && gy < SIZE) { cx = gx; cy = gy; rotate = true; }
      else if (geo.commit && input.pointer.y > geo.commit.y && input.pointer.y < geo.commit.y + 30 && Math.abs(input.pointer.x - geo.commit.x) < 80) input.press("confirm");
    }
    if (rotate) { grid[cy][cx] = rot(grid[cy][cx]); game.audio.ui(); }
    if (input.take("confirm")) {
      if (complete(flow())) {
        solvedAt = t;
        game.audio.success();
      } else {
        flash = 0.8;
        game.audio.failure();
        onOverload();
        // the overload knocks a few conduits loose
        for (let k = 0; k < 3; k++) {
          const x = rng.int(0, SIZE - 1), y = rng.int(0, SIZE - 1);
          grid[y][x] = rot(grid[y][x]);
        }
      }
    }
  };

  state.draw = (ctx, w, h) => {
    const p = panel(ctx, w, h, "ENERGY ROUTING", "ARROWS  SELECT      E / CLICK  ROTATE      ENTER  COMMIT");
    const cell = Math.min(64, (Math.min(p.pw, p.ph) - 160) / SIZE);
    const gx = p.cx - (cell * SIZE) / 2, gy = p.cy - (cell * SIZE) / 2;
    geo = { x: gx, y: gy, cell, commit: { x: p.cx, y: gy + cell * SIZE + 24 } };
    const lit = flow();
    const solved = solvedAt !== null;
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,244,214,${flash * 0.25})`;
      ctx.fillRect(p.x, p.y, p.pw, p.ph);
    }
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      const px = gx + x * cell, py = gy + y * cell;
      const key = `${x},${y}`;
      ctx.strokeStyle = "rgba(243,227,181,0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, cell - 1, cell - 1);
      const m = grid[y][x];
      const on = lit.has(key);
      ctx.strokeStyle = on ? (solved ? "#fff4d6" : "#f3e3b5") : "rgba(124,124,132,0.6)";
      ctx.lineWidth = on ? 4 : 3;
      ctx.lineCap = "round";
      const mx = px + cell / 2, my = py + cell / 2;
      ctx.beginPath();
      if (m & N) { ctx.moveTo(mx, my); ctx.lineTo(mx, py); }
      if (m & S) { ctx.moveTo(mx, my); ctx.lineTo(mx, py + cell); }
      if (m & E) { ctx.moveTo(mx, my); ctx.lineTo(px + cell, my); }
      if (m & W) { ctx.moveTo(mx, my); ctx.lineTo(px, my); }
      ctx.stroke();
      if (nodes.has(key)) {
        ctx.fillStyle = on ? "#fff4d6" : "#0c0c0e";
        ctx.strokeStyle = on ? "#fff4d6" : "#a8987a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mx, my, cell * 0.16, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
      }
      if (x === cx && y === cy && !solved) {
        ctx.strokeStyle = "#fff4d6";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px + 3, py + 3, cell - 6, cell - 6);
      }
    }
    // source + destination
    text(ctx, "SOURCE", gx - 10, gy + srcRow * cell + cell / 2 + 4, { size: 9, spacing: 2, color: "#f3e3b5", align: "right" });
    text(ctx, "DEST", gx + SIZE * cell + 10, gy + dstRow * cell + cell / 2 + 4, { size: 9, spacing: 2, color: lit.has(`${SIZE - 1},${dstRow}`) ? "#fff4d6" : "#7c7c84" });
    text(ctx, solved ? "ROUTE STABLE" : "[ ENTER ]  COMMIT", p.cx, gy + SIZE * cell + 40, { size: 10, spacing: 3, color: solved ? "#fff4d6" : "#a8987a", align: "center" });
  };

  return state;
}
