"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { sfx } from "../lib/sfx";
import { recordGamePlay, recordHighScore, recordDailyScore, getPersonalBest, celebrateNewBest } from "../lib/trackActivity";
import Leaderboard from "./Leaderboard";
import FullscreenButton from "./FullscreenButton";
import LyraAssistToggle from "./LyraAssistToggle";
import { loadAssist, saveAssist, drawLyra, playerTwoAt, playerTwoEnd, canvasToViewport } from "../lib/lyraAssist";

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
      s.projectiles.push({
        x: s.turretX,
        y: groundY - 20,
        vx: Math.cos(s.aimAngle) * 7 * k,
        vy: Math.sin(s.aimAngle) * 7 * k,
      });
      sfx.fire();
    };

    const updateAim = (x, y) => {
      const s = stateRef.current;
      const groundY = canvas.height - 20;
      s.turretX = x;
      const dx = x - s.turretX;
      const dy = y - (groundY - 20);
      s.aimAngle = Math.atan2(dy || -1, dx || 0.0001);
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

    const drawEnemy = (x, y, r) => {
      ctx.strokeStyle = "#C97B6E";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#E8CFC0";
      ctx.beginPath();
      ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#C97B6E";
      ctx.beginPath();
      ctx.moveTo(x - r * 0.4, y + r * 0.55);
      ctx.lineTo(x + r * 0.4, y + r * 0.55);
      ctx.lineTo(x, y + r * 1.8);
      ctx.closePath();
      ctx.fill();
    };

    const drawPlayer = (x, groundY, angle) => {
      ctx.fillStyle = "#3A3E75";
      ctx.fillRect(x - 16, groundY - 4, 32, 8);
      ctx.fillStyle = "#4C5192";
      ctx.beginPath();
      ctx.arc(x, groundY - 14, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3A3E75";
      ctx.beginPath();
      ctx.moveTo(x - 11, groundY - 14);
      ctx.lineTo(x - 20, groundY - 6);
      ctx.lineTo(x - 11, groundY - 6);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 11, groundY - 14);
      ctx.lineTo(x + 20, groundY - 6);
      ctx.lineTo(x + 11, groundY - 6);
      ctx.closePath();
      ctx.fill();
      const bx = x + Math.cos(angle) * 20;
      const by = groundY - 14 + Math.sin(angle) * 20;
      ctx.strokeStyle = "#8B95F6";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, groundY - 14);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.fillStyle = "#E8CFC0";
      ctx.beginPath();
      ctx.arc(x, groundY - 14, 3.5, 0, Math.PI * 2);
      ctx.fill();
    };

    let frame = 0;
    const loop = (t) => {
      if (!running) return;
      frame += 1;
      const s = stateRef.current;
      const lvl = levelForScore(s.score);

      // arrow-key movement, scaled to the field like everything else
      const move = 6 * (canvas.height / DESIGN_HEIGHT);
      if (held.left) s.turretX = Math.max(20, s.turretX - move);
      if (held.right) s.turretX = Math.min(canvas.width - 20, s.turretX + move);
      const cfg = LEVELS[lvl];

      if (t - s.lastSpawn > cfg.spawnMs) {
        s.threats.push({
          x: Math.random() * canvas.width,
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
        const live = (th) => th && !th.hit && s.threats.includes(th) && th.y > 0 && th.y < ly - 30;
        if (!live(L.target)) {
          // the most dangerous invader that isn't in your column
          const yours = (th) => Math.abs(th.x - s.turretX) < 50 * k;
          const pool = s.threats.filter((th) => live(th) && !yours(th));
          L.target = (pool.length ? pool : s.threats.filter(live))
            .sort((a, b) => (b.y - Math.abs(b.x - L.x) * 0.25) - (a.y - Math.abs(a.x - L.x) * 0.25))[0] || null;
        }
        const goal = L.target ? L.target.x : Math.max(30, Math.min(canvas.width - 30, s.turretX + (s.turretX < canvas.width / 2 ? 140 : -140) * k));
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
          if (!sh.hit && Math.hypot(th.x - sh.x, th.y - sh.y) < 14) {
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
          if (!th.hit && Math.hypot(th.x - p.x, th.y - p.y) < 14) {
            th.hit = true;
            p.hit = true;
            s.score += 10;
            s.explosions.push({ x: th.x, y: th.y, age: 0 });
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
      s.explosions = s.explosions.filter((ex) => ex.age < 16);

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

      ctx.fillStyle = "#0A0B1C";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      s.stars.forEach((star) => {
        const a = 0.3 + Math.sin(frame * 0.03 + star.phase) * 0.2;
        ctx.fillStyle = `rgba(180, 190, 240, ${Math.max(0, a)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = "#3A3E75";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 20);
      ctx.lineTo(canvas.width, canvas.height - 20);
      ctx.stroke();

      drawPlayer(s.turretX, canvas.height - 20, s.aimAngle);

      ctx.fillStyle = "#E8CFC0";
      s.projectiles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      s.threats.forEach((th) => drawEnemy(th.x, th.y, 9));

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
        const p = ex.age / 16;
        ctx.strokeStyle = ex.lyra ? `rgba(185, 192, 255, ${1 - p})` : `rgba(232, 207, 192, ${1 - p})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, 6 + p * 18, 0, Math.PI * 2);
        ctx.stroke();
      });

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
