"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { sfx } from "../lib/sfx";

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
  const stateRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

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
      s.projectiles.push({
        x: s.turretX,
        y: groundY - 20,
        vx: Math.cos(s.aimAngle) * 7,
        vy: Math.sin(s.aimAngle) * 7,
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
    const handleKeyDown = (e) => {
      if (e.key === "x" || e.key === "X") {
        fireAtAim();
      }
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

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
      const cfg = LEVELS[lvl];

      if (t - s.lastSpawn > cfg.spawnMs) {
        s.threats.push({
          x: Math.random() * canvas.width,
          y: -10,
          speed: cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin),
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

      for (const th of s.threats) {
        for (const p of s.projectiles) {
          if (Math.hypot(th.x - p.x, th.y - p.y) < 14) {
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
        setGameOver(true);
        setStarted(false);
        running = false;
        sfx.gameOver();
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

      s.explosions.forEach((ex) => {
        const p = ex.age / 16;
        ctx.strokeStyle = `rgba(232, 207, 192, ${1 - p})`;
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
      cancelAnimationFrame(raf);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [started]);

  const currentTarget = LEVELS[level].target;
  const nextLevelText =
    currentTarget === Infinity ? "max level" : `${score}/${currentTarget} to next level`;

  return (
    <div className="panel" style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#8A8FBF", flexWrap: "wrap", gap: 6 }}>
        <span>score: {score}</span>
        <span>level {level + 1} &middot; {nextLevelText}</span>
        <span>lives: {lives}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ width: "100%", maxWidth: 600, border: "1px solid #262A55", borderRadius: 4, cursor: "crosshair" }}
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
      <p style={{ fontSize: 12, color: "#565B8F", marginTop: 16 }}>
        Move your mouse (or drag on mobile) to aim. Click, tap, or press{" "}
        <strong>X</strong> to fire. Levels get faster the higher your score —
        it never truly stops.
      </p>
    </div>
  );
}
