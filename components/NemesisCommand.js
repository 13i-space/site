"use client";

import { useRef, useEffect, useState, useCallback } from "react";

export default function NemesisCommand() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const initState = useCallback(() => {
    return {
      turretX: 300,
      projectiles: [],
      threats: [],
      lastSpawn: 0,
      score: 0,
      lives: 5,
    };
  }, []);

  const start = useCallback(() => {
    stateRef.current = initState();
    setScore(0);
    setLives(5);
    setGameOver(false);
    setStarted(true);
  }, [initState]);

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let running = true;

    // The canvas draws at a fixed internal resolution (600x400) but is
    // often displayed smaller on phones via CSS. Without this scaling,
    // touch/click position doesn't match where things visually are.
    const toCanvasCoords = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const fireAt = (x, y) => {
      const s = stateRef.current;
      const dx = x - s.turretX;
      const dy = y - (canvas.height - 30);
      const dist = Math.hypot(dx, dy) || 1;
      s.projectiles.push({
        x: s.turretX,
        y: canvas.height - 30,
        vx: (dx / dist) * 7,
        vy: (dy / dist) * 7,
      });
    };

    const handleClick = (e) => {
      const { x, y } = toCanvasCoords(e.clientX, e.clientY);
      fireAt(x, y);
    };
    const handleMove = (e) => {
      const { x } = toCanvasCoords(e.clientX, e.clientY);
      stateRef.current.turretX = x;
    };

    // Touch: aiming and firing happen in the same gesture, since there's
    // no separate "hover" step on a phone the way there is with a mouse.
    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const { x, y } = toCanvasCoords(touch.clientX, touch.clientY);
      stateRef.current.turretX = x;
      fireAt(x, y);
    };
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const { x } = toCanvasCoords(touch.clientX, touch.clientY);
      stateRef.current.turretX = x;
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    const loop = (t) => {
      if (!running) return;
      const s = stateRef.current;

      if (t - s.lastSpawn > Math.max(1400 - s.score * 15, 450)) {
        s.threats.push({
          x: Math.random() * canvas.width,
          y: -10,
          speed: 1 + Math.random() * 1.2 + s.score * 0.01,
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
          }
        }
      }
      s.threats = s.threats.filter((th) => {
        if (th.hit) return false;
        if (th.y > canvas.height - 40) {
          s.lives -= 1;
          return false;
        }
        return true;
      });
      s.projectiles = s.projectiles.filter((p) => !p.hit);

      setScore(s.score);
      setLives(s.lives);

      if (s.lives <= 0) {
        setGameOver(true);
        setStarted(false);
        running = false;
        return;
      }

      ctx.fillStyle = "#0A0B1C";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#3A3E75";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 20);
      ctx.lineTo(canvas.width, canvas.height - 20);
      ctx.stroke();

      ctx.fillStyle = "#B9C0FF";
      ctx.beginPath();
      ctx.moveTo(s.turretX - 12, canvas.height - 20);
      ctx.lineTo(s.turretX + 12, canvas.height - 20);
      ctx.lineTo(s.turretX, canvas.height - 44);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#E8CFC0";
      s.projectiles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = "#C97B6E";
      s.threats.forEach((th) => {
        ctx.beginPath();
        ctx.arc(th.x, th.y, 9, 0, Math.PI * 2);
        ctx.fill();
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
    };
  }, [started]);

  return (
    <div className="panel" style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#8A8FBF" }}>
        <span>score: {score}</span>
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
              signal lost. final score: {score}
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
        Move your mouse to aim NEMESIS. Click to fire at incoming threats
        before they reach the line.
      </p>
    </div>
  );
}
