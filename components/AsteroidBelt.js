"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import FullscreenButton from "./FullscreenButton";
import { sfx } from "../lib/sfx";
import { recordGamePlay, recordHighScore, recordDailyScore, getPersonalBest, celebrateNewBest } from "../lib/trackActivity";
import Leaderboard from "./Leaderboard";
import LyraAssistToggle from "./LyraAssistToggle";
import { loadAssist, saveAssist, drawLyra, playerTwoAt, playerTwoEnd, canvasToViewport } from "../lib/lyraAssist";
import { drawShip13i, gunTips13i, drawUFO, makeAsteroidSprite, drawRocket, drawRod, makeSky, makeStars, drawStars, glow } from "../lib/gameArt";

// Update 5.83: new art (lib/gameArt.js) - grey-filled rocks, a rocket for
// the rod ship, and 13i with a real thruster behind and two guns forward
// that fire side by side. A UFO crosses now and then, shooting at you:
// 300 points if you bring it down.
const UFO_FIRST = 900; // frames (~15s)
const UFO_GAP = [1500, 2400];
const hexRGB = (h) => { const n = parseInt(h.slice(1), 16); return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`; };

const SHIP_RADIUS = 12;
const ROD_COUNT = 12;
const ROD_LEN = 16;
const ROD_GAP = 10;
const TURN_RATE = 0.055;
const THRUST_POWER = 0.09;
const FRICTION = 0.988;
const BULLET_SPEED = 6.2;
const BULLET_LIFE = 62;
const MINING_SHIP_HP = 3;
const START_LIVES = 3;

const ASTEROID_TIERS = {
  large: { radius: 34, next: "medium", points: 20 },
  medium: { radius: 20, next: "small", points: 50 },
  small: { radius: 11, next: null, points: 100 },
};

function levelForScore(score) {
  return Math.floor(score / 650);
}

function wrap(v, max) {
  if (v < 0) return v + max;
  if (v > max) return v - max;
  return v;
}

// Does the segment (x1,y1)-(x2,y2) pass within `r` of (cx,cy)? Ignores a
// segment that wrapped across the screen edge (just checks the end point).
function segmentNear(x1, y1, x2, y2, cx, cy, r) {
  const sx = x2 - x1, sy = y2 - y1;
  const len2 = sx * sx + sy * sy;
  if (len2 === 0 || len2 > 400) {
    const dx = x2 - cx, dy = y2 - cy;
    return dx * dx + dy * dy < r * r;
  }
  const t = Math.max(0, Math.min(1, ((cx - x1) * sx + (cy - y1) * sy) / len2));
  const px = x1 + sx * t - cx, py = y1 + sy * t - cy;
  return px * px + py * py < r * r;
}

function makeAsteroidShape() {
  const points = 10;
  return Array.from({ length: points }, () => 0.78 + Math.random() * 0.4);
}

export default function AsteroidBelt() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const stateRef = useRef(null);
  const keysRef = useRef({ left: false, right: false, thrust: false, fire: false });
  const rafRef = useRef(null);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [personalBest, setPersonalBest] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  // Lyra assists: she flies alongside your ship and shoots at the nearest
  // rock, rod or mining ship. What she destroys earns no points.
  const [assist, setAssist] = useState(false);
  const assistRef = useRef(false);
  assistRef.current = assist;
  const toggleAssist = (on) => { setAssist(on); saveAssist(on); };

  useEffect(() => {
    getPersonalBest("asteroid-belt").then(setPersonalBest);
    setAssist(loadAssist());
  }, []);

  const sizeCanvas = useCallback((canvas) => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const isFull = !!document.fullscreenElement;
    canvas.width = rect.width;
    canvas.height = isFull ? rect.height : 420;
    return canvas;
  }, []);

  const spawnMiningShip = useCallback((canvas, lvl) => {
    const edge = Math.floor(Math.random() * 4);
    const w = canvas.width, h = canvas.height;
    let x, y;
    if (edge === 0) { x = 0; y = Math.random() * h; }
    else if (edge === 1) { x = w; y = Math.random() * h; }
    else if (edge === 2) { x = Math.random() * w; y = 0; }
    else { x = Math.random() * w; y = h; }
    const angle = Math.atan2(h / 2 - y, w / 2 - x) + (Math.random() - 0.5) * 0.8;
    const speed = 0.5 + Math.random() * 0.3;
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      angle,
      hp: MINING_SHIP_HP,
      alive: true,
      detonateTimer: Math.max(360, 780 - lvl * 40),
    };
  }, []);

  const spawnAsteroid = useCallback((canvas, tier, lvl, x, y, biasAngle) => {
    const w = canvas.width, h = canvas.height;
    if (x === undefined) {
      // spawn well away from the center where the ship starts
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) { x = 0; y = Math.random() * h; }
      else if (edge === 1) { x = w; y = Math.random() * h; }
      else if (edge === 2) { x = Math.random() * w; y = 0; }
      else { x = Math.random() * w; y = h; }
    }
    const speedMult = 1 + lvl * 0.07;
    const angle = biasAngle !== undefined ? biasAngle + (Math.random() - 0.5) * 1.4 : Math.random() * Math.PI * 2;
    const shape = makeAsteroidShape();
    const speed = (0.4 + Math.random() * 0.6) * speedMult;
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.03,
      tier,
      shape,
      sprite: makeAsteroidSprite(shape, ASTEROID_TIERS[tier].radius),
      alive: true,
    };
  }, []);

  const spawnWave = useCallback((canvas, lvl, state) => {
    const count = Math.min(3 + Math.ceil(lvl * 0.8), 16);
    state.pendingSpawns = { remaining: count, lvl, timer: 0 };
  }, []);

  const initState = useCallback((canvas) => {
    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1 + 0.4,
    }));
    const state = {
      ship: { x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0, angle: -Math.PI / 2, invuln: 90 },
      bullets: [],
      miningShip: null,
      rods: [],
      asteroids: [],
      particles: [],
      stars,
      ufo: null,
      ufoBolts: [],
      ufoTimer: UFO_FIRST,
      gunFlash: 0,
      frame: 0,
      score: 0,
      lives: START_LIVES,
      level: 0,
      fireCooldown: 0,
      miningSpawnCooldown: 200,
      pendingSpawns: null,
      lyra: { x: canvas.width / 2 - 40, y: canvas.height / 2 + 30, vx: 0, vy: 0, cd: 60, flash: 0, orbit: 0 },
    };
    spawnWave(canvas, 0, state);
    return state;
  }, [spawnWave]);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    sizeCanvas(canvas);
    stateRef.current = initState(canvas);
    setScore(0);
    setLives(START_LIVES);
    setLevel(0);
    setGameOver(false);
    setStarted(true);
    recordGamePlay("asteroid-belt");
  }, [initState, sizeCanvas]);

  const explode = (state, x, y, count = 14, color = "#E8CFC0") => {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.4 + 0.4;
      state.particles.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: 30 + Math.random() * 20, color });
    }
  };

  const respawnShip = (s, w, h) => {
    sfx.lifeLost();
    s.lives--;
    s.ship.x = w / 2; s.ship.y = h / 2;
    s.ship.vx = 0; s.ship.vy = 0;
    s.ship.invuln = 120;
  };

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleResize = () => {
      sizeCanvas(canvas);
      setIsFullscreen(!!document.fullscreenElement);
      // regenerate stars for the new size so they cover the whole canvas
      const s = stateRef.current;
      if (s) {
        s.stars = makeStars(canvas.width, canvas.height, 60);
        s.sky = null;
      }
    };
    window.addEventListener("resize", handleResize);
    document.addEventListener("fullscreenchange", handleResize);

    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keysRef.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d") keysRef.current.right = true;
      if (e.key === "ArrowUp" || e.key === "w") {
        if (!keysRef.current.thrust) sfx.thrust.start();
        keysRef.current.thrust = true;
      }
      if (e.key === " ") { keysRef.current.fire = true; e.preventDefault(); }
    };
    const onKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keysRef.current.right = false;
      if (e.key === "ArrowUp" || e.key === "w") {
        keysRef.current.thrust = false;
        sfx.thrust.stop();
      }
      if (e.key === " ") keysRef.current.fire = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const tick = () => {
      const s = stateRef.current;
      const w = canvas.width, h = canvas.height;
      const keys = keysRef.current;
      const lvl = levelForScore(s.score);

      const ship = s.ship;
      if (keys.left) ship.angle -= TURN_RATE;
      if (keys.right) ship.angle += TURN_RATE;
      if (keys.thrust) {
        ship.vx += Math.cos(ship.angle) * THRUST_POWER;
        ship.vy += Math.sin(ship.angle) * THRUST_POWER;
      }
      ship.vx *= FRICTION;
      ship.vy *= FRICTION;
      ship.x = wrap(ship.x + ship.vx, w);
      ship.y = wrap(ship.y + ship.vy, h);
      if (ship.invuln > 0) ship.invuln--;

      if (s.fireCooldown > 0) s.fireCooldown--;
      if (keys.fire && s.fireCooldown <= 0) {
        // both guns at once, side by side
        gunTips13i(ship.x, ship.y, ship.angle, SHIP_RADIUS * 1.15).forEach((tip) => {
          s.bullets.push({
            x: tip.x,
            y: tip.y,
            vx: Math.cos(ship.angle) * BULLET_SPEED + ship.vx,
            vy: Math.sin(ship.angle) * BULLET_SPEED + ship.vy,
            life: BULLET_LIFE,
          });
        });
        s.fireCooldown = 10;
        s.gunFlash = 1;
        sfx.fire();
      }
      s.gunFlash = Math.max(0, s.gunFlash - 0.2);
      s.frame += 1;

      // ---- the UFO: crosses the field, firing at you ----
      if (!s.ufo) {
        s.ufoTimer--;
        if (s.ufoTimer <= 0) {
          const fromLeft = Math.random() < 0.5;
          s.ufo = {
            x: fromLeft ? -30 : w + 30, y: h * (0.15 + Math.random() * 0.7), baseY: 0,
            vx: (fromLeft ? 1 : -1) * (1.1 + Math.random() * 0.5 + lvl * 0.08), cd: 70, ph: Math.random() * 6,
          };
          s.ufo.baseY = s.ufo.y;
        }
      } else {
        const U = s.ufo;
        U.x += U.vx;
        U.y = U.baseY + Math.sin(s.frame / 40 + U.ph) * 26;
        U.cd--;
        if (U.cd <= 0 && U.x > 0 && U.x < w) {
          const a = Math.atan2(ship.y - U.y, ship.x - U.x) + (Math.random() - 0.5) * 0.5;
          s.ufoBolts.push({ x: U.x, y: U.y, vx: Math.cos(a) * 3.2, vy: Math.sin(a) * 3.2, life: 140 });
          U.cd = Math.max(55, 100 - lvl * 6);
          sfx.fire();
        }
        s.bullets.forEach((b) => {
          if (b.life <= 0 || !s.ufo) return;
          if (Math.abs(b.x - U.x) < 20 && Math.abs(b.y - U.y) < 10) {
            b.life = 0;
            if (!b.lyra) s.score += 300;
            explode(s, U.x, U.y, 34, "#B6FFD9");
            sfx.explosion("large");
            s.ufo = null;
          }
        });
        if (s.ufo && ship.invuln <= 0 && Math.abs(ship.x - U.x) < 20 + SHIP_RADIUS && Math.abs(ship.y - U.y) < 8 + SHIP_RADIUS) {
          explode(s, ship.x, ship.y, 20, "#C97B6E");
          respawnShip(s, w, h);
        }
        if (s.ufo && (U.x < -50 || U.x > w + 50)) s.ufo = null;
        if (!s.ufo) s.ufoTimer = UFO_GAP[0] + Math.random() * (UFO_GAP[1] - UFO_GAP[0]);
      }
      s.ufoBolts.forEach((b) => {
        b.x = wrap(b.x + b.vx, w); b.y = wrap(b.y + b.vy, h); b.life--;
        if (b.life > 0 && ship.invuln <= 0 && Math.hypot(b.x - ship.x, b.y - ship.y) < SHIP_RADIUS + 2) {
          b.life = 0;
          explode(s, ship.x, ship.y, 20, "#C97B6E");
          respawnShip(s, w, h);
        }
      });
      s.ufoBolts = s.ufoBolts.filter((b) => b.life > 0);

      // ---- Lyra assists ----
      const L = s.lyra;
      L.flash = Math.max(0, L.flash - 0.06);
      if (assistRef.current) {
        // she keeps close, circling just off your wing
        L.orbit += 0.018;
        const gx = ship.x + Math.cos(L.orbit) * 46, gy = ship.y + Math.sin(L.orbit) * 46;
        let dx = gx - L.x, dy = gy - L.y;
        if (Math.abs(dx) > w / 2) dx -= Math.sign(dx) * w; // follow across the screen edge
        if (Math.abs(dy) > h / 2) dy -= Math.sign(dy) * h;
        L.vx = (L.vx + dx * 0.012) * 0.9;
        L.vy = (L.vy + dy * 0.012) * 0.9;
        L.x = wrap(L.x + L.vx, w);
        L.y = wrap(L.y + L.vy, h);
        L.cd--;
        if (L.cd <= 0) {
          const targets = [
            ...s.asteroids.filter((a) => a.alive),
            ...s.rods.filter((r) => r.alive),
            ...(s.miningShip && s.miningShip.alive ? [s.miningShip] : []),
            ...(s.ufo ? [{ x: s.ufo.x, y: s.ufo.y, vx: s.ufo.vx, vy: 0 }] : []),
          ];
          let best = null, bd = 260;
          targets.forEach((o) => { const d = Math.hypot(o.x - L.x, o.y - L.y); if (d < bd) { bd = d; best = o; } });
          if (best) {
            const speed = 5.2;
            const tt = bd / speed;
            const a = Math.atan2(best.y + (best.vy || 0) * tt - L.y, best.x + (best.vx || 0) * tt - L.x);
            s.bullets.push({ x: L.x, y: L.y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: 60, lyra: true });
            L.cd = Math.max(26, 58 - lvl * 3); // a little quicker each level
            L.flash = 1;
            L.fired = true;
            sfx.fire();
          } else {
            L.cd = 10;
          }
        }
      }

      // the real Lyra watches her player-two self (lib/lyraAssist.js)
      if (assistRef.current) {
        const [vx, vy] = canvasToViewport(canvas, L.x, L.y);
        playerTwoAt(vx, vy, L.fired);
        L.fired = false;
      } else {
        playerTwoEnd();
      }

      s.bullets.forEach((b) => { b.x = wrap(b.x + b.vx, w); b.y = wrap(b.y + b.vy, h); b.life--; });
      s.bullets = s.bullets.filter((b) => b.life > 0);

      // --- asteroids ---
      s.asteroids.forEach((a) => {
        if (!a.alive) return;
        a.x = wrap(a.x + a.vx, w);
        a.y = wrap(a.y + a.vy, h);
        a.rot += a.vrot;
        const r = ASTEROID_TIERS[a.tier].radius;

        // forgiving hit box: the drawn rock reaches past its base radius
        // (its jagged outline), so count anything that touches what you see,
        // plus a little - and check the bullet's whole step, not just where it
        // landed, so a fast shot can't slip through a small rock
        const hitR = r * Math.max(1, ...a.shape) * 1.15 + 4;
        s.bullets.forEach((b) => {
          if (b.life <= 0) return;
          if (segmentNear(b.x - b.vx, b.y - b.vy, b.x, b.y, a.x, a.y, hitR)) {
            b.life = 0;
            a.alive = false;
            if (!b.lyra) s.score += ASTEROID_TIERS[a.tier].points; // Lyra's hits don't score
            explode(s, a.x, a.y, 12, b.lyra ? "#B9C0FF" : "#8B95F6");
            sfx.explosion(a.tier === "large" ? "large" : a.tier === "medium" ? "medium" : "small");
            const nextTier = ASTEROID_TIERS[a.tier].next;
            if (nextTier) {
              const baseAngle = Math.atan2(a.vy, a.vx);
              s.asteroids.push(spawnAsteroid(canvas, nextTier, lvl, a.x, a.y, baseAngle + 1));
              s.asteroids.push(spawnAsteroid(canvas, nextTier, lvl, a.x, a.y, baseAngle - 1));
            }
          }
        });

        if (a.alive && ship.invuln <= 0) {
          const dx = ship.x - a.x, dy = ship.y - a.y;
          if (dx * dx + dy * dy < (SHIP_RADIUS + r * 0.8) * (SHIP_RADIUS + r * 0.8)) {
            a.alive = false;
            explode(s, ship.x, ship.y, 20, "#C97B6E");
            respawnShip(s, w, h);
          }
        }
      });
      s.asteroids = s.asteroids.filter((a) => a.alive);

      if (s.pendingSpawns) {
        s.pendingSpawns.timer--;
        if (s.pendingSpawns.timer <= 0 && s.pendingSpawns.remaining > 0) {
          s.asteroids.push(spawnAsteroid(canvas, "large", s.pendingSpawns.lvl));
          s.pendingSpawns.remaining--;
          s.pendingSpawns.timer = 22;
        }
        if (s.pendingSpawns.remaining <= 0) s.pendingSpawns = null;
      } else if (s.asteroids.length === 0) {
        spawnWave(canvas, lvl, s);
        sfx.levelUp();
      }

      // --- mining ship ---
      if (!s.miningShip) {
        s.miningSpawnCooldown--;
        if (s.miningSpawnCooldown <= 0) {
          s.miningShip = spawnMiningShip(canvas, lvl);
        }
      }
      const ms = s.miningShip;
      if (ms && ms.alive) {
        ms.x = wrap(ms.x + ms.vx, w);
        ms.y = wrap(ms.y + ms.vy, h);
        ms.detonateTimer--;

        if (ms.detonateTimer <= 0) {
          for (let i = 0; i < ROD_COUNT; i++) {
            const a = (i / ROD_COUNT) * Math.PI * 2 + Math.random() * 0.3;
            const speed = 0.8 + Math.random() * 1.6;
            s.rods.push({
              x: ms.x - Math.cos(ms.angle) * (46 + Math.floor(i / 4) * (ROD_LEN + 3)),
              y: ms.y - Math.sin(ms.angle) * (46 + Math.floor(i / 4) * (ROD_LEN + 3)),
              vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
              angle: Math.random() * Math.PI * 2, vangle: (Math.random() - 0.5) * 0.1,
              alive: true,
            });
          }
          explode(s, ms.x, ms.y, 26, "#C97B6E");
          sfx.explosion("large");
          ms.alive = false;
          s.miningShip = null;
          s.miningSpawnCooldown = 500;
        } else {
          s.bullets.forEach((b) => {
            if (b.life <= 0) return;
            const dx = b.x - ms.x, dy = b.y - ms.y;
            if (dx * dx + dy * dy < 22 * 22) {
              b.life = 0;
              ms.hp--;
              explode(s, b.x, b.y, 6, "#B9C0FF");
              sfx.hit();
              if (ms.hp <= 0) {
                explode(s, ms.x, ms.y, 30, "#8B95F6");
                sfx.explosion("large");
                if (!b.lyra) s.score += 500;
                ms.alive = false;
                s.miningShip = null;
                s.miningSpawnCooldown = 500;
              }
            }
          });
          if (ship.invuln <= 0) {
            const dx = ship.x - ms.x, dy = ship.y - ms.y;
            if (dx * dx + dy * dy < (SHIP_RADIUS + 16) * (SHIP_RADIUS + 16)) {
              explode(s, ship.x, ship.y, 20, "#C97B6E");
              respawnShip(s, w, h);
            }
          }
        }
      }

      s.rods.forEach((r) => {
        if (!r.alive) return;
        r.x = wrap(r.x + r.vx, w);
        r.y = wrap(r.y + r.vy, h);
        r.angle += r.vangle;
        s.bullets.forEach((b) => {
          if (b.life <= 0) return;
          const dx = b.x - r.x, dy = b.y - r.y;
          if (dx * dx + dy * dy < 14 * 14) {
            b.life = 0;
            r.alive = false;
            if (!b.lyra) s.score += 75;
            explode(s, r.x, r.y, 10, "#8B95F6");
            sfx.explosion("small");
          }
        });
        if (r.alive && ship.invuln <= 0) {
          const dx = ship.x - r.x, dy = ship.y - r.y;
          if (dx * dx + dy * dy < (SHIP_RADIUS + 9) * (SHIP_RADIUS + 9)) {
            r.alive = false;
            explode(s, ship.x, ship.y, 20, "#C97B6E");
            respawnShip(s, w, h);
          }
        }
      });
      s.rods = s.rods.filter((r) => r.alive);

      s.particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.life--; });
      s.particles = s.particles.filter((p) => p.life > 0);

      setScore(s.score);
      setLevel(lvl);
      if (s.lives !== lives) setLives(Math.max(0, s.lives));
      if (s.lives <= 0) {
        playerTwoEnd();
        sfx.thrust.stop();
        sfx.gameOver();
        setGameOver(true);
        setStarted(false);
        recordHighScore("asteroid-belt", s.score).then((isNewBest) => {
          if (isNewBest) celebrateNewBest("asteroid-belt", s.score);
        });
        recordDailyScore("asteroid-belt", s.score);
        getPersonalBest("asteroid-belt").then(setPersonalBest);
        setRefreshKey((k) => k + 1);
        return;
      }

      // --- draw ---
      const T = s.frame / 60;
      if (!s.sky || s.sky.width !== Math.round(w) || s.sky.height !== Math.round(h)) {
        s.sky = makeSky(w, h, 3, "warm");
        if (!s.stars[0] || s.stars[0].sp === undefined) s.stars = makeStars(w, h, 60);
      }
      ctx.drawImage(s.sky, 0, 0);
      drawStars(ctx, s.stars, T);

      // asteroids: grey stone, rotating
      s.asteroids.forEach((a) => {
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.rot);
        ctx.drawImage(a.sprite, -a.sprite.width / 2, -a.sprite.height / 2);
        ctx.restore();
      });

      // the rod ship: a rocket hauling its rods in a strapped bundle behind it
      if (ms && ms.alive) {
        const ca = Math.cos(ms.angle), sa = Math.sin(ms.angle);
        const back = (d, side) => [ms.x - ca * d - sa * side, ms.y - sa * d + ca * side];
        // tow line
        const [tx0, ty0] = back(24, 0), [tx1, ty1] = back(36, 0);
        ctx.strokeStyle = "rgba(200,205,225,0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(tx0, ty0); ctx.lineTo(tx1, ty1); ctx.stroke();
        // 12 rods: 3 deep, 4 across
        for (let i = 0; i < ROD_COUNT; i++) {
          const row = Math.floor(i / 4), col = i % 4;
          const [rx, ry] = back(46 + row * (ROD_LEN + 3), (col - 1.5) * 5.6);
          drawRod(ctx, rx, ry, ms.angle, ROD_LEN);
        }
        // straps
        ctx.strokeStyle = "rgba(201,123,110,0.8)";
        ctx.lineWidth = 1.4;
        for (let row = 0; row < 3; row++) {
          const [ax, ay] = back(46 + row * (ROD_LEN + 3), -11), [bx2, by2] = back(46 + row * (ROD_LEN + 3), 11);
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx2, by2); ctx.stroke();
        }
        const warn = ms.detonateTimer < 120 ? (Math.floor(ms.detonateTimer / 8) % 2 === 0 ? 1 : 0.2) : 0;
        drawRocket(ctx, ms.x, ms.y, ms.angle, 1.5, T, warn);
        if (warn === 1) {
          ctx.beginPath();
          ctx.arc(ms.x, ms.y, 30, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(201,123,110,0.8)";
          ctx.stroke();
        }
      }

      s.rods.forEach((r) => drawRod(ctx, r.x, r.y, r.angle, ROD_LEN));

      // the UFO and its shots
      if (s.ufo) drawUFO(ctx, s.ufo.x, s.ufo.y, 18, T);
      s.ufoBolts.forEach((b) => {
        glow(ctx, b.x, b.y, 8, "150,255,200", 0.7);
        ctx.fillStyle = "#E8FFF4";
        ctx.beginPath(); ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2); ctx.fill();
      });

      // bullets: bright tracers
      s.bullets.forEach((b) => {
        glow(ctx, b.x, b.y, b.lyra ? 7 : 6, b.lyra ? "185,192,255" : "170,200,255", 0.7);
        ctx.fillStyle = b.lyra ? "#DCDFFF" : "#FFFFFF";
        ctx.beginPath(); ctx.arc(b.x, b.y, b.lyra ? 2.2 : 1.7, 0, Math.PI * 2); ctx.fill();
      });

      // 13i
      if (ship.invuln === 0 || Math.floor(ship.invuln / 5) % 2 === 0) {
        drawShip13i(ctx, ship.x, ship.y, ship.angle, SHIP_RADIUS * 1.15, { thrust: keys.thrust, t: T, flash: s.gunFlash });
      }
      if (assistRef.current) drawLyra(ctx, L.x, L.y, 9, performance.now() / 1000, L.flash);

      s.particles.forEach((p) => {
        const a = Math.max(0, p.life / 40);
        glow(ctx, p.x, p.y, 5, hexRGB(p.color), a * 0.7);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(p.x - 0.7, p.y - 0.7, 1.4, 1.4);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      playerTwoEnd();
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      sfx.thrust.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const press = (key, val) => (e) => {
    e.preventDefault();
    keysRef.current[key] = val;
    if (key === "thrust") {
      if (val) sfx.thrust.start(); else sfx.thrust.stop();
    }
  };

  return (
    <div
      ref={containerRef}
      className="game-frame"
      style={{
        background: "#060712",
        padding: 12,
        borderRadius: 4,
        touchAction: "none",
        ...(isFullscreen
          ? { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }
          : {}),
      }}
    >
      <div style={styles.hud}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {Array.from({ length: START_LIVES }).map((_, i) => (
            <LifeIcon key={i} lost={i >= lives} />
          ))}
        </div>
        <div className="mono" style={{ color: "#B9C0FF", fontSize: 14, display: "flex", gap: 16, alignItems: "center" }}>
          <span>LEVEL {level + 1}</span>
          <span>SCORE {score}</span>
          {personalBest !== null && <span style={{ color: "#565B8F" }}>BEST {personalBest.toLocaleString()}</span>}
          <LyraAssistToggle on={assist} onToggle={toggleAssist} />
          <FullscreenButton targetRef={containerRef} />
        </div>
      </div>

      <div style={{ position: "relative", ...(isFullscreen ? { flex: 1, minHeight: 0 } : {}) }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: isFullscreen ? "100%" : 420, flex: isFullscreen ? 1 : undefined, display: "block", background: "#060712", borderRadius: 4, touchAction: "none" }}
        />

        {!started && (
          <div style={styles.overlay}>
            {gameOver ? (
              <>
                <div style={styles.overlayTitle}>Game Over</div>
                <p style={{ color: "#8A8FBF", marginBottom: 16 }}>Final score: {score}</p>
              </>
            ) : (
              <div style={styles.overlayTitle}>Asteroid Belt</div>
            )}
            <button onClick={start} style={styles.startBtn}>
              {gameOver ? "Play again" : "Start"}
            </button>
          </div>
        )}
      </div>

      {started && (
        <div style={styles.controls}>
          <div style={{ display: "flex", gap: 10 }}>
            <CtrlBtn label="&#8634;" onDown={press("left", true)} onUp={press("left", false)} />
            <CtrlBtn label="&#8635;" onDown={press("right", true)} onUp={press("right", false)} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <CtrlBtn label="THRUST" wide onDown={press("thrust", true)} onUp={press("thrust", false)} />
            <CtrlBtn label="FIRE" wide accent onDown={press("fire", true)} onUp={press("fire", false)} />
          </div>
        </div>
      )}
      <div className="game-extra">
        <p className="mono" style={{ fontSize: 11, color: "#565B8F", textAlign: "center", marginTop: 10 }}>
          keyboard: arrow keys or WASD to move, space to fire
        </p>
        <Leaderboard game="asteroid-belt" refreshKey={refreshKey} />
      </div>
    </div>
  );
}

function LifeIcon({ lost }) {
  // the 13i ship in miniature: steel ring, blue eye, guns forward, nozzle behind
  return (
    <svg width={28} height={26} viewBox="0 0 28 26" style={{ opacity: lost ? 0.22 : 1 }}>
      <g transform="translate(14,13) rotate(-90)">
        <path d="M -8 -2.6 L -12.5 -3.8 L -12.5 3.8 L -8 2.6 Z" fill="#9AA0B8" />
        <rect x="5" y="-5.6" width="7" height="2" fill="#C3C8D8" />
        <rect x="5" y="3.6" width="7" height="2" fill="#C3C8D8" />
        <circle cx="0" cy="0" r="7.6" fill="none" stroke="#B9BFD2" strokeWidth="2.6" />
        <circle cx="0" cy="0" r="3.8" fill="#5A8CFF" />
        <circle cx="-0.9" cy="-0.9" r="1.2" fill="#fff" />
      </g>
    </svg>
  );
}

function CtrlBtn({ label, onDown, onUp, wide, accent }) {
  return (
    <button
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: wide ? 96 : 52,
        height: 52,
        background: accent ? "rgba(232,207,192,0.12)" : "rgba(139,149,246,0.08)",
        border: `1px solid ${accent ? "#E8CFC0" : "#3A3E75"}`,
        borderRadius: 6,
        color: accent ? "#E8CFC0" : "#B9C0FF",
        fontSize: wide ? 12 : 20,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.5px",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <span dangerouslySetInnerHTML={{ __html: label }} />
    </button>
  );
}

const styles = {
  hud: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 },
  overlay: {
    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", background: "rgba(6,7,18,0.82)", borderRadius: 4,
  },
  overlayTitle: { fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 28, color: "#DCDFFF", marginBottom: 10 },
  startBtn: {
    background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "10px 22px", cursor: "pointer",
  },
  controls: { display: "flex", justifyContent: "space-between", marginTop: 14 },
};
