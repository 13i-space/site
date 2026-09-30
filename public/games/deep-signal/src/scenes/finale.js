// The final sequence and the end card.
//
// THE CONNECTION: the HUD fails, the fragments assemble into one line, the
// symbol appears - SIGNAL COMPLETE - black - YOU DID NOT FIND 13i. -
// 13i FOUND YOU. - then the camera pulls back, and the rooms you walked
// light up: stem, ring and dot. The world was the symbol all along.
// Nothing says so.

import { drawWorld } from "../world/world.js";
import { TW, TH } from "../world/generator.js";
import { TILE, ROOM_W, ROOM_H, SCORE } from "../config.js";
import { text, scramble, menuList, hitIndex } from "../ui/text.js";
import { drawSymbol } from "../ui/symbol.js";
import { FRAGMENTS, COHERENT_SIGNAL, ENDINGS } from "../lore/lore.js";

const MAP_SCALE = 0.12;

// When each beat starts (seconds), per ending
const TIMELINES = {
  connection: { glitch: 0, fragments: 2.5, assemble: 6, symbol: 8.5, complete: 11.5, black: 14, line1: 15.5, line2: 19.5, reveal: 23.5, card: 38 },
  signal: { glitch: 0, fragments: 2, scatter: 5.5, line0: 7, line1: 9.5, line2: 12, reveal: 14.5, card: 26 },
  warden: { freeze: 0, eye: 1.2, line0: 3, line1: 6, line2: 9.5, reveal: 12.5, card: 27 },
  terminated: { glitch: 0, black: 1.6, line0: 2.6, line1: 5, card: 8 },
};

export function finaleScene(game, { run, ending }) {
  const tl = TIMELINES[ending];
  const world = run.world;
  let t = 0;
  let cardSel = 0;
  let cardRects = [];

  // ---- score and saving happen immediately, so leaving early still counts ----
  const discoveries = run.found.size;
  const survived = ending !== "terminated";
  const score = Math.round(
    run.stats.signal * SCORE.perSignal +
    discoveries * SCORE.perDiscovery +
    (survived ? run.stats.integrity * SCORE.perIntegrity : 0) +
    SCORE.ending[ending]
  );
  const bestBefore = game.save.data.bestScore;
  game.save.recordRun({ signal: run.stats.signal, score, ending });
  if (ending === "connection") game.save.discover("tx-coherent");
  game.post({ type: "score", score, ending, signal: Math.round(run.stats.signal), seed: run.seedText });

  // ---- a small, whole-world picture for the pull-back ----
  const mapCanvas = document.createElement("canvas");
  mapCanvas.width = Math.ceil(TW * TILE * MAP_SCALE);
  mapCanvas.height = Math.ceil(TH * TILE * MAP_SCALE);
  {
    const m = mapCanvas.getContext("2d");
    m.fillStyle = "#030303";
    m.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    m.scale(MAP_SCALE, MAP_SCALE);
    drawWorld(m, world, { x0: 0, y0: 0, x1: TW * TILE, y1: TH * TILE }, 0, { highContrast: true });
  }

  // the skeleton, in the order it lights: stem (from the landing), ring, then the dot
  const roomCenter = (r) => ({ x: (r.cx * ROOM_W + ROOM_W / 2) * TILE, y: (r.cy * ROOM_H + ROOM_H / 2) * TILE });
  const stem = world.stemKeys.slice().reverse().map((k) => world.rooms.get(k));
  const ringStart = world.ringKeys.indexOf(world.gateRoom.key);
  const ring = world.ringKeys.map((_, i) => world.rooms.get(world.ringKeys[(ringStart + i) % world.ringKeys.length]));
  const order = [...stem, ...ring];

  const worldW = TW * TILE, worldH = TH * TILE;
  const nodeC = roomCenter(world.nodeRoom);
  const startCam = { x: run.player.x, y: run.player.y, zoom: Math.max(0.7, Math.min(1.7, Math.min(game.w / 760, game.h / 540))) };

  // audio beats
  const fired = new Set();
  const once = (key, fn) => { if (!fired.has(key)) { fired.add(key); fn(); } };
  game.audio.ambient(ending === "warden" ? 0.3 : 0.12, 3);

  const fragments = run.fragments.length ? run.fragments.map((i) => FRAGMENTS[i]) : ["…"];
  const fragPos = fragments.map((_, i) => ({ a: (i / fragments.length) * Math.PI * 2 + 0.4, d: 1.2 }));

  function update(dt) {
    t += dt;
    const input = game.input;
    if (tl.card !== undefined && t < tl.card) {
      if ((input.take("confirm") || input.takeClick()) && t > 2) t = tl.card; // skip to the end card
      if (ending === "connection") {
        if (t > tl.symbol) once("reveal-sound", () => game.audio.reveal());
        if (t > tl.black) once("black", () => game.audio.ambient(0, 1));
        if (t > tl.line1) once("l1", () => game.audio.transmission());
        if (t > tl.line2) once("l2", () => { game.audio.warden(); });
        if (t > tl.reveal) once("rv", () => { game.audio.ambient(0.5, 4); game.audio.swell(); });
      } else if (ending === "warden") {
        if (t > tl.eye) once("eye", () => game.audio.warden());
        if (t > tl.reveal) once("rv", () => game.audio.ambient(0.4, 4));
      } else if (ending === "signal") {
        if (t > tl.line0) once("l0", () => game.audio.transmission());
        if (t > tl.reveal) once("rv", () => { game.audio.ambient(0.4, 4); game.audio.swell(); });
      } else if (t > 0.1) once("hurt", () => game.audio.failure());
      return;
    }
    // end card
    const items = ["RETURN", "BEGIN AGAIN", "DISCOVERY LOG"];
    if (input.take("up")) cardSel = (cardSel + items.length - 1) % items.length;
    if (input.take("down")) cardSel = (cardSel + 1) % items.length;
    let choice = -1;
    if (input.take("confirm") || input.take("interact")) choice = cardSel;
    if (input.takeClick()) choice = hitIndex(cardRects, input.pointer.x, input.pointer.y);
    if (input.take("log")) choice = 2;
    if (choice === 0) game.switchTo("title");
    if (choice === 1) game.switchTo("intro");
    if (choice === 2) game.overlays.open("log", { run: run.found });
  }

  // ---- drawing pieces ----
  function drawWorldAt(ctx, cx, cy, zoom, alpha = 1) {
    const { w, h } = game;
    ctx.save();
    ctx.globalAlpha = alpha;
    if (zoom > 0.3) {
      ctx.translate(w / 2, h / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-cx, -cy);
      drawWorld(ctx, world, { x0: cx - w / 2 / zoom, y0: cy - h / 2 / zoom, x1: cx + w / 2 / zoom, y1: cy + h / 2 / zoom }, t, game.settings());
    } else {
      const s = zoom / MAP_SCALE;
      ctx.translate(w / 2, h / 2);
      ctx.scale(s, s);
      ctx.translate(-cx * MAP_SCALE, -cy * MAP_SCALE);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(mapCanvas, 0, 0);
    }
    ctx.restore();
  }

  function drawReveal(ctx, local, { cold = false, partial = false } = {}) {
    // pull back from where the player stood to the whole world
    const { w, h } = game;
    const fit = Math.min(w / worldW, h / worldH) * 0.92;
    const k = Math.min(1, local / 6);
    const e = 1 - Math.pow(1 - k, 3);
    const zoom = Math.exp(Math.log(startCam.zoom) + (Math.log(fit) - Math.log(startCam.zoom)) * e);
    const cx = startCam.x + (worldW / 2 - startCam.x) * e;
    const cy = startCam.y + (worldH / 2 - startCam.y) * e;
    ctx.fillStyle = "#030303";
    ctx.fillRect(0, 0, w, h);
    drawWorldAt(ctx, cx, cy, zoom, Math.min(1, local / 1.2) * Math.max(0.3, 0.8 - k * 0.5));
    // darkness everywhere you didn't go
    const toS = (x, y) => ({ x: (x - cx) * zoom + w / 2, y: (y - cy) * zoom + h / 2 });
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const rw = ROOM_W * TILE * zoom, rh = ROOM_H * TILE * zoom;
    const lightStart = 3;
    order.forEach((r, i) => {
      const at = lightStart + i * 0.16;
      const a = Math.max(0, Math.min(1, (local - at) / 0.6));
      if (!a) return;
      const visited = r.explored || cold;
      if (partial && !visited) {
        const p = toS(r.cx * ROOM_W * TILE, r.cy * ROOM_H * TILE);
        ctx.strokeStyle = `rgba(243,227,181,${0.25 * a})`;
        ctx.strokeRect(p.x + 2, p.y + 2, rw - 4, rh - 4);
        return;
      }
      const p = toS(r.cx * ROOM_W * TILE, r.cy * ROOM_H * TILE);
      ctx.fillStyle = cold ? `rgba(200,205,220,${0.2 * a})` : `rgba(255,214,140,${(visited ? 0.3 : 0.07) * a})`;
      ctx.fillRect(p.x + 1, p.y + 1, rw - 2, rh - 2);
    });
    // then the line through them - stem, ring, and last, the dot
    const traceAt = lightStart + order.length * 0.16 + 0.4;
    const ta = Math.max(0, Math.min(1, (local - traceAt) / 1.5));
    if (ta > 0 && !partial) {
      const col = cold ? "rgba(236,236,244," : "rgba(255,240,200,";
      ctx.strokeStyle = `${col}${ta})`;
      ctx.lineWidth = Math.max(3, rh * 0.22);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = cold ? "#e8e8f0" : "#ffd98a";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      stem.forEach((r, i) => { const c = toS(roomCenter(r).x, roomCenter(r).y); i ? ctx.lineTo(c.x, c.y) : ctx.moveTo(c.x, c.y); });
      ctx.stroke();
      ctx.beginPath();
      ring.forEach((r, i) => { const c = toS(roomCenter(r).x, roomCenter(r).y); i ? ctx.lineTo(c.x, c.y) : ctx.moveTo(c.x, c.y); });
      ctx.closePath();
      ctx.stroke();
      const da = Math.max(0, Math.min(1, (local - traceAt - 1.6) / 1));
      if (da > 0) {
        const c = toS(nodeC.x, nodeC.y);
        ctx.fillStyle = `${col}${da})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, Math.max(4, rh * 0.32), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawGlitchHud(ctx, amount) {
    const { w, h } = game;
    if (game.settings().reducedEffects) amount *= 0.3;
    const s = run.stats;
    const jitter = () => (Math.random() - 0.5) * 12 * amount;
    text(ctx, scramble(`SIGNAL ${Math.round(s.signal)}%`, amount * 0.7), 24 + jitter(), 40 + jitter(), { size: 16, color: "#fff4d6", alpha: 1 - amount * 0.5 });
    ["ENERGY", "INTEGRITY", "AWARENESS"].forEach((l, i) => {
      text(ctx, scramble(`${l} ${Math.round(s[l.toLowerCase()])}`, amount), w - 24 + jitter(), 30 + i * 30 + jitter(), { size: 10, spacing: 2, color: "#f3e3b5", align: "right", alpha: 1 - amount * 0.6 });
    });
    for (let i = 0; i < 6 * amount; i++) {
      ctx.fillStyle = `rgba(243,227,181,${Math.random() * 0.25})`;
      ctx.fillRect(0, Math.random() * h, w, 1 + Math.random() * 3);
    }
  }

  function centerLine(ctx, str, start, dur, { size = 16, color = "#fff4d6", y = null } = {}) {
    const local = t - start;
    if (local < 0 || local > dur) return;
    const a = Math.min(1, local / 0.8, (dur - local) / 0.6);
    const narrow = game.w < 560;
    text(ctx, str, game.w / 2, y ?? game.h / 2, { size: Math.min(size, game.w * (narrow ? 0.032 : 0.045)), spacing: narrow ? 1.5 : 5, color, align: "center", alpha: a, glow: 14 });
  }

  function drawEndCard(ctx) {
    const { w, h } = game;
    const local = t - tl.card;
    const a = Math.min(1, local / 1.2);
    ctx.fillStyle = `rgba(3,3,3,${0.86 * a})`;
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    let y = h * 0.2;
    text(ctx, ENDINGS[ending].name, cx, y, { size: Math.min(26, w * 0.06), family: "'Fraunces', Georgia, serif", italic: true, color: "#fff4d6", align: "center", alpha: a, glow: 12 });
    y += 44;
    const mins = Math.floor(run.time / 60), secs = Math.floor(run.time % 60);
    [
      `SIGNAL ${Math.round(run.stats.signal)}%`,
      `FRAGMENTS ${run.fragments.length}   ·   DISCOVERIES ${discoveries}`,
      `INTEGRITY ${Math.round(run.stats.integrity)}   ·   AWARENESS ${Math.round(run.stats.awareness)}`,
      `TIME ${mins}:${String(secs).padStart(2, "0")}   ·   ROOMS ${run.roomsExplored}`,
    ].forEach((l) => { text(ctx, l, cx, y, { size: 11, spacing: 2, color: "#b8b0a0", align: "center", alpha: a }); y += 24; });
    y += 12;
    text(ctx, `SCORE ${score.toLocaleString()}`, cx, y, { size: 15, spacing: 4, color: "#f3e3b5", align: "center", alpha: a });
    if (score > bestBefore && bestBefore > 0) text(ctx, "NEW PERSONAL BEST", cx, y + 22, { size: 9, spacing: 3, color: "#fff4d6", align: "center", alpha: a });
    y += 50;
    text(ctx, `SIGNAL SEED: ${run.seedText}`, cx, y, { size: 10, spacing: 3, color: "#7c7c84", align: "center", alpha: a });
    cardRects = menuList(ctx, ["RETURN", "BEGIN AGAIN", "DISCOVERY LOG"], cardSel, cx, Math.min(h - 110, y + 60), { size: 12, gap: 30, alpha: a });
  }

  function draw(ctx) {
    const { w, h } = game;
    ctx.fillStyle = "#030303";
    ctx.fillRect(0, 0, w, h);

    if (ending === "connection") {
      if (t < tl.black) {
        // the world, slowing, dimming
        const dim = Math.min(1, t / tl.fragments);
        drawWorldAt(ctx, startCam.x, startCam.y, startCam.zoom * (1 + t * 0.01), 0.5 * (1 - dim * 0.7));
        if (t < tl.symbol) drawGlitchHud(ctx, Math.min(1, t / 2));
        // fragments drift in, then assemble
        if (t > tl.fragments && t < tl.symbol + 1) {
          const k = Math.min(1, (t - tl.fragments) / (tl.assemble - tl.fragments));
          const m = Math.max(0, Math.min(1, (t - tl.assemble) / 2));
          fragments.forEach((f, i) => {
            const p = fragPos[i];
            const sx = w / 2 + Math.cos(p.a) * w * 0.5 * (1 - k), sy = h / 2 + Math.sin(p.a) * h * 0.5 * (1 - k);
            const ly = h / 2 - (fragments.length * 22) / 2 + i * 22;
            const x = sx + (w / 2 - sx) * k, y = sy + (ly - sy) * k;
            const yy = y + (h / 2 - y) * m;
            text(ctx, f, x, yy, { size: Math.min(11, w * 0.026), spacing: w < 500 ? 0.5 : 2, color: "#f3e3b5", align: "center", alpha: Math.min(1, k * 2) * (1 - m) * (t > tl.symbol ? Math.max(0, 1 - (t - tl.symbol)) : 1) });
          });
          if (m > 0.5) text(ctx, COHERENT_SIGNAL, w / 2, h / 2 + 90, { size: Math.min(13, w * 0.03), spacing: w < 500 ? 1 : 3, color: "#fff4d6", align: "center", alpha: Math.min(1, (m - 0.5) * 2) * (t > tl.complete ? Math.max(0, 1 - (t - tl.complete)) : 1), glow: 10 });
        }
        if (t > tl.symbol) {
          const k = Math.min(1, (t - tl.symbol) / 2.2);
          drawSymbol(ctx, w / 2, h / 2 - 20, Math.min(160, h * 0.28), { glow: 30, progress: k, color: "#fff4d6" });
        }
        centerLine(ctx, "SIGNAL COMPLETE", tl.complete, tl.black - tl.complete, { y: h / 2 + Math.min(160, h * 0.28) * 0.7, size: 15 });
      } else if (t < tl.reveal) {
        centerLine(ctx, "YOU DID NOT FIND 13i.", tl.line1, 3.2, { size: 17 });
        centerLine(ctx, "13i FOUND YOU.", tl.line2, 3.6, { size: 19 });
      } else {
        drawReveal(ctx, t - tl.reveal);
      }
    } else if (ending === "signal") {
      if (t < tl.line0) {
        drawWorldAt(ctx, startCam.x, startCam.y, startCam.zoom, 0.45 * (1 - Math.min(1, t / 6) * 0.6));
        drawGlitchHud(ctx, Math.min(1, t / 3));
        if (t > tl.fragments) {
          const k = Math.min(1, (t - tl.fragments) / 2);
          const sc = Math.max(0, (t - tl.scatter) / 1.5);
          fragments.forEach((f, i) => {
            const ly = h / 2 - (fragments.length * 22) / 2 + i * 22;
            text(ctx, f, w / 2 + Math.cos(fragPos[i].a) * sc * w * 0.4, ly + Math.sin(fragPos[i].a) * sc * h * 0.4, { size: Math.min(11, w * 0.026), spacing: w < 500 ? 0.5 : 2, color: "#f3e3b5", align: "center", alpha: k * Math.max(0, 1 - sc) });
          });
        }
      } else if (t < tl.reveal) {
        const L = ENDINGS.signal.lines;
        centerLine(ctx, L[0], tl.line0, 2.4);
        centerLine(ctx, L[1], tl.line1, 2.4, { size: 13 });
        centerLine(ctx, L[2], tl.line2, 2.4, { size: 13 });
      } else {
        drawReveal(ctx, t - tl.reveal, { partial: true });
      }
    } else if (ending === "warden") {
      if (t < tl.reveal) {
        drawWorldAt(ctx, startCam.x, startCam.y, startCam.zoom, 0.4);
        ctx.fillStyle = `rgba(3,3,3,${Math.min(0.85, t / 2)})`;
        ctx.fillRect(0, 0, w, h);
        if (t > tl.eye) {
          // the Warden's attention, drawn as geometry - not a face
          const k = Math.min(1, (t - tl.eye) / 2.5);
          ctx.save();
          ctx.translate(w / 2, h / 2 - 30);
          ctx.strokeStyle = "rgba(236,236,244,0.8)";
          ctx.lineWidth = 1.2;
          for (let i = 0; i < 5; i++) {
            ctx.globalAlpha = k * (0.25 + i * 0.15);
            ctx.beginPath();
            ctx.ellipse(0, 0, (150 - i * 26) * k, (60 - i * 10) * k * (0.6 + 0.4 * Math.sin(t * 0.6 + i)), 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.globalAlpha = k;
          ctx.fillStyle = "#ecedf4";
          ctx.beginPath(); ctx.arc(Math.sin(t * 0.4) * 10, 0, 5, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        const L = ENDINGS.warden.lines;
        centerLine(ctx, L[0], tl.line0, 2.8, { color: "#ecedf4", y: h / 2 + 90, size: 14 });
        centerLine(ctx, L[1], tl.line1, 3.2, { color: "#ecedf4", y: h / 2 + 90, size: 13 });
        centerLine(ctx, L[2], tl.line2, 2.8, { color: "#ecedf4", y: h / 2 + 90, size: 16 });
      } else {
        drawReveal(ctx, t - tl.reveal, { cold: true });
      }
    } else {
      if (t < tl.black) {
        drawWorldAt(ctx, startCam.x, startCam.y, startCam.zoom, 0.5 * (1 - t / tl.black));
        drawGlitchHud(ctx, 1);
      }
      const L = ENDINGS.terminated.lines;
      centerLine(ctx, "RUN TERMINATED", tl.black, 6, { size: 16, y: h / 2 - 30 });
      centerLine(ctx, L[0], tl.line0, 4, { size: 12, color: "#b8b0a0" });
      centerLine(ctx, L[1], tl.line1, 3, { size: 12, color: "#b8b0a0", y: h / 2 + 26 });
    }

    if (t >= tl.card) drawEndCard(ctx);
  }

  return { update, draw };
}
