"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { sfx } from "../lib/sfx";
import { recordGamePlay, recordHighScore, recordDailyScore, getPersonalBest, celebrateNewBest } from "../lib/trackActivity";
import Leaderboard from "./Leaderboard";
import FullscreenButton from "./FullscreenButton";
import LyraAssistToggle from "./LyraAssistToggle";
import { loadAssist, saveAssist, drawLyra, playerTwoAt, playerTwoEnd, canvasToViewport } from "../lib/lyraAssist";
import { drawNemesis, drawInvader, drawUFO, makeSky, makeStars, drawStars, glow, burst, stepSparks } from "../lib/gameArt";

// Update 5.83: new art (lib/gameArt.js), NEMESIS can slide halfway off
// either edge to reach invaders falling right at the side, and a UFO now
// crosses the sky now and then, firing down at NEMESIS - shoot it for a
// bonus; a hit knocks NEMESIS sideways and costs a life.
const UFO_FIRST_MS = 12000;
const UFO_GAP_MS = [18000, 28000];

// The game was designed on a 600x400 field; speeds scale with the real
// field height so a bigger screen doesn't make it easier or harder.
const DESIGN_HEIGHT = 400;

const LEVELS = [
  { target: 50, speedMin: 0.6, speedMax: 1.0, spawnMs: 1800 },
  { target: 150, speedMin: 0.9, speedMax: 1.4, spawnMs: 1400 },
  { target: 300, speedMin: 1.3, speedMax: 1.9, spawnMs: 1000 },
  { target: 500, speedMin: 1.8, speedMax: 2.6, spawnMs: 700 },
  { target: Infinity, speedMin: 2.4, speedMax: 3.4, spawnMs: 480 },
];

function levelForScore(score) {
  let lvl = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (score >= LEVELS[i].target) lvl = i + 1;
  }
  return Math.min(lvl, LEVELS.length - 1);
}

export default function NemesisCommand() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const stateRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [level, setLevel] = useState(0);
  const [personalBest, setPersonalBest] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getPersonalBest("nemesis-command").then(setPersonalBest);
  }, []);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  // Lyra assists: she hovers above you and fires at incoming threats, faster
  // as the levels climb. Her kills don't score.
  const [assist, setAssist] = useState(false);
  const assistRef = useRef(false);
  assistRef.current = assist;
  useEffect(() => { setAssist(loadAssist()); }, []);
  const toggleAssist = (on) => { setAssist(on); saveAssist(on); };

  // The canvas's drawing size follows its size on screen (full width, most
  // of the viewport height), including in fullscreen.
  useEffect(() => {
    const canvas = canvasRef.current;
    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const w = Math.max(300, Math.round(r.width)), h = Math.max(240, Math.round(r.height));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      const s = stateRef.current;
      if (s) s.turretX = Math.min(s.turretX, w);
      if (!started) {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#0A0B1C";
        ctx.fillRect(0, 0, w, h);
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [started]);

  const initState = useCallback((canvas) => {
    const stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1 + 0.4,
      phase: Math.random() * Math.PI * 2,
    }));
    return {
      sparks: [],
      ufo: null,
      ufoBolts: [],
      nextUfo: null,
      shake: 0,
      recoil: 0,
      hurt: 0,
      popups: [],
      turretX: canvas.width / 2,
      aimAngle: -Math.PI / 2,
      projectiles: [],
      threats: [],
      explosions: [],
      lyra: { x: canvas.width * 0.3, cd: 40, flash: 0, shots: [] },
      stars,
      lastSpawn: 0,
      score: 0,
      lives: 5,
    };
  }, []);

  const start = useCallback(() => {
    stateRef.current = initState(canvasRef.current);
    setScore(0);
    setLives(5);
    setLevel(0);
    setGameOver(false);
    setStarted(true);
    recordGamePlay("nemesis-command");
  }, [initState]);

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let running = true;

    const toCanvasCoords = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const fireAtAim = () => {
      const s = stateRef.current;
      const groundY = canvas.height - 20;
      const k = canvas.height / DESIGN_HEIGHT;
      const kk = Math.min(1.6, Math.sqrt(k));
      // from the barrel's muzzle
      const mx = s.turretX + Math.cos(s.aimAngle) * 34 * kk;
      const my = groundY - 19 * kk + Math.sin(s.aimAngle) * 34 * kk;
      s.projectiles.push({
        x: mx,
        y: my,
        vx: Math.cos(s.aimAngle) * 7 * k,
        vy: Math.sin(s.aimAngle) * 7 * k,
      });
      s.recoil = 1;
      sfx.fire();
    };

    const updateAim = (x, y) => {
      const s = stateRef.current;
      const groundY = canvas.height - 20;
      s.turretX = x;
      const dx = x - s.turretX;
      const dy = y - (groundY - 20);
      s.aimAngle = Math.atan2(dy || -1, dx || 0.0001);
      s.turretX = Math.max(0, Math.min(canvas.width, s.turretX));
    };

    const handleClick = (e) => {
      const { x, y } = toCanvasCoords(e.clientX, e.clientY);
      updateAim(x, y);
      fireAtAim();
    };
    const handleMove = (e) => {
      const { x, y } = toCanvasCoords(e.clientX, e.clientY);
      updateAim(x, y);
    };
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const { x, y } = toCanvasCoords(touch.clientX, touch.clientY);
      updateAim(x, y);
      fireAtAim();
    };
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const { x, y } = toCanvasCoords(touch.clientX, touch.clientY);
      updateAim(x, y);
    };
    // keyboard: left/right arrows move, space or up arrow fire (X still works)
    const held = { left: false, right: false };
    let lastKeyShot = 0;
    const keyFire = () => {
      const now = performance.now();
      if (now - lastKeyShot < 140) return; // holding the key auto-fires, not floods
      lastKeyShot = now;
      stateRef.current.aimAngle = -Math.PI / 2;
      fireAtAim();
    };
    const typing = (e) => {
      const tag = e.target?.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable;
    };
    const handleKeyDown = (e) => {
      if (typing(e)) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") { held.left = true; e.preventDefault(); }
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { held.right = true; e.preventDefault(); }
      else if (e.key === " " || e.key === "ArrowUp" || e.key === "x" || e.key === "X") { e.preventDefault(); keyFire(); }
    };
    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") held.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") held.right = false;
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let sky = null, skyW = 0, skyH = 0, stars = null;

    let frame = 0;
    const loop = (t) => {
      if (!running) return;
      frame += 1;
      const s = stateRef.current;
      const lvl = levelForScore(s.score);

      // arrow-key movement, scaled to the field like everything else
      const move = 6 * (canvas.height / DESIGN_HEIGHT);
      // NEMESIS can go halfway off either edge, so nothing at the side is out of reach
      if (held.left) s.turretX = Math.max(0, s.turretX - move);
      if (held.right) s.turretX = Math.min(canvas.width, s.turretX + move);
      const k = canvas.height / DESIGN_HEIGHT;
      const kk = Math.min(1.6, Math.sqrt(k));
      const groundY = canvas.height - 20;
      const cfg = LEVELS[lvl];

      if (t - s.lastSpawn > cfg.spawnMs) {
        s.threats.push({
          seed: Math.random() * 10,
          x: 6 + Math.random() * (canvas.width - 12),
          y: -10,
          speed: (cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin)) * (canvas.height / DESIGN_HEIGHT),
        });
        s.lastSpawn = t;
      }

      s.projectiles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
      });
      s.projectiles = s.projectiles.filter(
        (p) => p.x > 0 && p.x < canvas.width && p.y > 0 && p.y < canvas.height
      );

      s.threats.forEach((th) => (th.y += th.speed));

      // ---- the UFO: across the sky, firing down at NEMESIS ----
      if (s.nextUfo === null) s.nextUfo = t + UFO_FIRST_MS;
      if (!s.ufo && t > s.nextUfo) {
        const fromLeft = Math.random() < 0.5;
        s.ufo = {
          x: fromLeft ? -40 * kk : canvas.width + 40 * kk,
          y: canvas.height * (0.1 + Math.random() * 0.1),
          vx: (fromLeft ? 1 : -1) * (1.5 + Math.random() * 0.7 + lvl * 0.15) * k,
          nextShot: t + 900,
          hurt: 0,
        };
        sfx.ufo && sfx.ufo();
      }
      const U = s.ufo;
      if (U) {
        U.x += U.vx;
        U.y += Math.sin(t / 300) * 0.3 * k;
        U.hurt = Math.max(0, U.hurt - 0.1);
        if (t > U.nextShot && U.x > 0 && U.x < canvas.width) {
          const tx = s.turretX + (Math.random() - 0.5) * 30 * k, ty = groundY - 14 * kk;
          const d = Math.hypot(tx - U.x, ty - U.y) || 1;
          const sp = (3.2 + lvl * 0.25) * k;
          s.ufoBolts.push({ x: U.x, y: U.y + 8 * kk, vx: ((tx - U.x) / d) * sp, vy: ((ty - U.y) / d) * sp });
          U.nextShot = t + Math.max(700, 1500 - lvl * 160);
          sfx.fire();
        }
        for (const p of s.projectiles) {
          if (!p.hit && Math.abs(p.x - U.x) < 22 * kk && Math.abs(p.y - U.y) < 11 * kk) {
            p.hit = true;
            const bonus = 100 * (lvl + 1);
            s.score += bonus;
            s.popups.push({ x: U.x, y: U.y, text: "+" + bonus, age: 0 });
            burst(s.sparks, U.x, U.y, 40, "170,255,210", 3.4, 2.4);
            s.explosions.push({ x: U.x, y: U.y, age: 0, big: true });
            sfx.explosion("large");
            s.ufo = null;
            break;
          }
        }
        if (s.ufo && (U.x < -60 * kk || U.x > canvas.width + 60 * kk)) s.ufo = null;
        if (!s.ufo) s.nextUfo = t + UFO_GAP_MS[0] + Math.random() * (UFO_GAP_MS[1] - UFO_GAP_MS[0]);
      }
      s.ufoBolts.forEach((b) => { b.x += b.vx; b.y += b.vy; });
      for (const b of s.ufoBolts) {
        if (!b.hit && Math.abs(b.x - s.turretX) < 18 * kk && b.y > groundY - 30 * kk && b.y < groundY) {
          // knocked: a life, a shove sideways, the screen shakes
          b.hit = true;
          s.lives -= 1;
          s.hurt = 1;
          s.shake = 10;
          s.turretX = Math.max(0, Math.min(canvas.width, s.turretX + (b.vx >= 0 ? 1 : -1) * 46 * k));
          burst(s.sparks, b.x, b.y, 26, "255,176,32", 3, 2);
          sfx.lifeLost();
        }
      }
      s.ufoBolts = s.ufoBolts.filter((b) => !b.hit && b.y < canvas.height && b.x > -20 && b.x < canvas.width + 20);

      // ---- Lyra assists (player two) ----
      // She plays by your rules: she slides along the ground line under an
      // invader and fires straight up. She picks invaders away from the one
      // you're under, so you can see what she's going for and take the others.
      const L = s.lyra;
      if (assistRef.current) {
        const k = canvas.height / DESIGN_HEIGHT;
        const ly = canvas.height - 20 - 30 * k;
        L.y = ly;
        L.cd -= 1;
        L.flash = Math.max(0, L.flash - 0.08);
        // she waits: an invader is hers to chase only once it's past halfway
        // down, so you get the first chance at every one (5.51)
        const half = canvas.height * 0.5;
        const live = (th) => th && !th.hit && s.threats.includes(th) && th.y > half && th.y < ly - 30;
        if (!live(L.target)) {
          // the most dangerous invader that isn't in your column
          const yours = (th) => Math.abs(th.x - s.turretX) < 50 * k;
          const pool = s.threats.filter((th) => live(th) && !yours(th));
          L.target = (pool.length ? pool : s.threats.filter(live))
            .sort((a, b) => (b.y - Math.abs(b.x - L.x) * 0.25) - (a.y - Math.abs(a.x - L.x) * 0.25))[0] || null;
        }
        // nothing past halfway: she holds her place (drifting a touch), out of your way
        if (L.home === undefined) L.home = L.x;
        const goal = L.target ? L.target.x : L.home + Math.sin(frame / 90) * 12 * k;
        const step = 3.4 * k; // slower than you
        L.x += Math.max(-step, Math.min(step, goal - L.x));
        if (L.target && L.cd <= 0 && Math.abs(L.target.x - L.x) < 6 * k) {
          L.shots.push({ x: L.x, y: L.y - 12 * k, vx: 0, vy: -7 * k });
          L.cd = Math.max(38, 80 - lvl * 9); // quicker as the game speeds up, never a machine gun
          L.flash = 1;
          L.fired = true;
          sfx.fire();
        }
        const [vx, vy] = canvasToViewport(canvas, L.x, L.y);
        playerTwoAt(vx, vy, L.fired);
        L.fired = false;
      } else {
        playerTwoEnd();
      }
      L.shots.forEach((sh) => { sh.x += sh.vx; sh.y += sh.vy; });
      L.shots = L.shots.filter((sh) => sh.x > 0 && sh.x < canvas.width && sh.y > 0 && sh.y < canvas.height && !sh.hit);
      for (const th of s.threats) {
        if (th.hit) continue;
        for (const sh of L.shots) {
          if (!sh.hit && Math.hypot(th.x - sh.x, th.y - sh.y) < 14 * kk) {
            th.hit = true;
            sh.hit = true;
            s.explosions.push({ x: th.x, y: th.y, age: 0, lyra: true });
            sfx.explosion("small");
          }
        }
      }
      L.shots = L.shots.filter((sh) => !sh.hit);

      for (const th of s.threats) {
        if (th.hit) continue;
        for (const p of s.projectiles) {
          if (!th.hit && Math.hypot(th.x - p.x, th.y - p.y) < 16 * kk) {
            th.hit = true;
            p.hit = true;
            s.score += 10;
            s.explosions.push({ x: th.x, y: th.y, age: 0 });
            burst(s.sparks, th.x, th.y, 16, "232,170,150", 2.4, 1.8);
            sfx.explosion("small");
          }
        }
      }
      s.threats = s.threats.filter((th) => {
        if (th.hit) return false;
        if (th.y > canvas.height - 40) {
          s.lives -= 1;
          sfx.lifeLost();
          return false;
        }
        return true;
      });
      s.projectiles = s.projectiles.filter((p) => !p.hit);
      s.explosions.forEach((ex) => (ex.age += 1));
      s.explosions = s.explosions.filter((ex) => ex.age < (ex.big ? 26 : 16));
      s.recoil = Math.max(0, s.recoil - 0.15);
      s.hurt = Math.max(0, s.hurt - 0.04);
      s.shake = Math.max(0, s.shake - 0.7);

      setScore(s.score);
      setLives(s.lives);
      setLevel(lvl);

      if (s.lives <= 0) {
        playerTwoEnd();
        setGameOver(true);
        setStarted(false);
        running = false;
        sfx.gameOver();
        recordHighScore("nemesis-command", s.score).then((isNewBest) => {
          if (isNewBest) celebrateNewBest("nemesis-command", s.score);
        });
        recordDailyScore("nemesis-command", s.score);
        getPersonalBest("nemesis-command").then(setPersonalBest);
        setRefreshKey((k) => k + 1);
        return;
      }

      // ---- draw ----
      const W = canvas.width, H = canvas.height;
      if (!sky || skyW !== W || skyH !== H) { sky = makeSky(W, H, 7); skyW = W; skyH = H; stars = makeStars(W, H, 70); }
      ctx.save();
      if (s.shake > 0) ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
      ctx.drawImage(sky, 0, 0);
      drawStars(ctx, stars, frame / 60);

      // the ground: a dark horizon with a lit rim
      const gg = ctx.createLinearGradient(0, groundY - 10, 0, H);
      gg.addColorStop(0, "rgba(40,44,80,0)");
      gg.addColorStop(0.35, "#1A1D35");
      gg.addColorStop(1, "#0B0C1A");
      ctx.fillStyle = gg;
      ctx.fillRect(0, groundY - 10, W, H - groundY + 10);
      ctx.strokeStyle = "rgba(139,149,246,0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();
      glow(ctx, s.turretX, groundY, 60 * kk, "255,176,32", 0.08);

      // shots: NEMESIS's amber tracers
      s.projectiles.forEach((p) => {
        glow(ctx, p.x, p.y, 9 * kk, "255,190,90", 0.6);
        ctx.strokeStyle = "rgba(255,230,180,0.9)";
        ctx.lineWidth = 2.2 * kk;
        ctx.beginPath(); ctx.moveTo(p.x - p.vx * 1.4, p.y - p.vy * 1.4); ctx.lineTo(p.x, p.y); ctx.stroke();
      });

      // the UFO and its bolts
      if (s.ufo) drawUFO(ctx, s.ufo.x, s.ufo.y, 20 * kk, frame / 60, s.ufo.hurt);
      s.ufoBolts.forEach((b) => {
        glow(ctx, b.x, b.y, 10 * kk, "150,255,200", 0.7);
        ctx.fillStyle = "#E8FFF4";
        ctx.beginPath(); ctx.arc(b.x, b.y, 2.4 * kk, 0, Math.PI * 2); ctx.fill();
      });

      drawNemesis(ctx, s.turretX, groundY, s.aimAngle, kk * 1.2, frame / 60, s.recoil, s.hurt);

      s.threats.forEach((th) => drawInvader(ctx, th.x, th.y, 10 * kk, frame / 60, th.seed || 0));

      if (assistRef.current || L.shots.length) {
        ctx.fillStyle = "#B9C0FF";
        L.shots.forEach((sh) => {
          ctx.globalAlpha = 0.35;
          ctx.beginPath(); ctx.arc(sh.x - sh.vx * 1.5, sh.y - sh.vy * 1.5, 2.2, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
          ctx.beginPath(); ctx.arc(sh.x, sh.y, 2.8, 0, Math.PI * 2); ctx.fill();
        });
        if (assistRef.current && L.y) {
          // a faint sight line up from her to what she's lined up on
          if (L.target && Math.abs(L.target.x - L.x) < 40) {
            ctx.strokeStyle = "rgba(185,192,255,0.18)";
            ctx.setLineDash([3, 6]);
            ctx.beginPath(); ctx.moveTo(L.x, L.y - 12); ctx.lineTo(L.x, Math.max(0, L.target.y + 12)); ctx.stroke();
            ctx.setLineDash([]);
          }
          drawLyra(ctx, L.x, L.y, 9 * (canvas.height / DESIGN_HEIGHT) ** 0.5, frame / 60, L.flash);
        }
      }

      s.explosions.forEach((ex) => {
        const p = ex.age / (ex.big ? 26 : 16);
        if (ex.age < 4) glow(ctx, ex.x, ex.y, (ex.big ? 50 : 26) * kk, ex.lyra ? "185,192,255" : "255,220,190", 1 - ex.age / 4);
        ctx.strokeStyle = ex.lyra ? `rgba(185, 192, 255, ${1 - p})` : `rgba(232, 207, 192, ${1 - p})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, (6 + p * (ex.big ? 40 : 18)) * kk, 0, Math.PI * 2);
        ctx.stroke();
      });
      s.sparks = stepSparks(ctx, s.sparks);
      s.popups.forEach((pp) => {
        pp.age += 1;
        ctx.fillStyle = `rgba(182,255,217,${Math.max(0, 1 - pp.age / 60)})`;
        ctx.font = `${Math.round(13 * kk)}px 'JetBrains Mono', monospace`;
        ctx.textAlign = "center";
        ctx.fillText(pp.text, pp.x, pp.y - pp.age * 0.5);
      });
      s.popups = s.popups.filter((pp) => pp.age < 60);
      ctx.restore();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      playerTwoEnd();
      cancelAnimationFrame(raf);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [started]);

  const currentTarget = LEVELS[level].target;
  const nextLevelText =
    currentTarget === Infinity ? "max level" : `${score}/${currentTarget} to next level`;

  return (
    <div ref={wrapRef} className="panel game-frame" style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#8A8FBF", flexWrap: "wrap", gap: 6 }}>
        <span>score: {score}</span>
        <span>level {level + 1} &middot; {nextLevelText}</span>
        <span>lives: {lives}</span>
        {personalBest !== null && <span style={{ color: "#565B8F" }}>best: {personalBest.toLocaleString()}</span>}
        <LyraAssistToggle on={assist} onToggle={toggleAssist} />
        <FullscreenButton targetRef={wrapRef} />
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="game-canvas"
        style={{ width: "100%", height: "70vh", minHeight: 420, display: "block", border: "1px solid #262A55", borderRadius: 4, cursor: "crosshair", touchAction: "none" }}
      />
      {!started && (
        <div style={{ marginTop: 16 }}>
          {gameOver && (
            <p style={{ color: "#C97B6E", fontFamily: "'JetBrains Mono', monospace" }}>
              signal lost. final score: {score} &middot; level {level + 1}
            </p>
          )}
          <button
            onClick={start}
            style={{
              background: "none",
              border: "1px solid #3A3E75",
              borderRadius: 4,
              color: "#B9C0FF",
              padding: "10px 24px",
              fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer",
            }}
          >
            {gameOver ? "Try again" : "Start"}
          </button>
        </div>
      )}
      <div className="game-extra">
        <Leaderboard game="nemesis-command" refreshKey={refreshKey} />
      </div>
    </div>
  );
}
