"use client";

import { useRef, useEffect } from "react";

export default function StarField({ density = 140 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let stars = [];
    let drifter = null;
    let nextDrifterAt = performance.now() + 4000 + Math.random() * 8000;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.006,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnDrifter = () => {
      const edge = Math.floor(Math.random() * 4);
      const w = canvas.width, h = canvas.height;
      let x, y, vx, vy;
      const speed = 0.12 + Math.random() * 0.08;
      if (edge === 0) { x = 0; y = Math.random() * h * 0.6; vx = speed; vy = speed * 0.25; }
      else if (edge === 1) { x = w; y = Math.random() * h * 0.6; vx = -speed; vy = speed * 0.25; }
      else if (edge === 2) { x = Math.random() * w; y = 0; vx = speed * 0.3; vy = speed; }
      else { x = Math.random() * w; y = 0; vx = -speed * 0.3; vy = speed; }
      drifter = { x, y, vx, vy, born: performance.now(), life: 14000 + Math.random() * 8000 };
    };

    let t = 0;
    const draw = (now) => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.22;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 223, 255, ${Math.max(0, alpha)})`;
        ctx.fill();
      });

      if (!drifter && now > nextDrifterAt) {
        spawnDrifter();
      }
      if (drifter) {
        const age = now - drifter.born;
        const progress = age / drifter.life;
        drifter.x += drifter.vx;
        drifter.y += drifter.vy;
        const fade = progress < 0.15 ? progress / 0.15 : progress > 0.85 ? (1 - progress) / 0.15 : 1;
        const alpha = Math.max(0, Math.min(1, fade)) * 0.5;
        ctx.beginPath();
        ctx.arc(drifter.x, drifter.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
        ctx.fill();
        if (progress >= 1) {
          drifter = null;
          nextDrifterAt = now + 15000 + Math.random() * 20000;
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
