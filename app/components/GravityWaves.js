"use client";

import { useRef, useEffect } from "react";

export default function GravityWaves() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let rings = [];
    let cx, cy;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cx = canvas.width / 2;
      cy = canvas.height * 0.38;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnRing = () => {
      rings.push({ r: 0, alpha: 0.5 });
    };
    spawnRing();
    let sinceLastSpawn = 0;

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(200, 150, 130, 0.045)";
      ctx.lineWidth = 1;
      const spacing = 46;
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.fillStyle = "#0B0710";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const vGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.6);
      vGlow.addColorStop(0, "rgba(90, 50, 90, 0.20)");
      vGlow.addColorStop(1, "rgba(11, 7, 16, 0)");
      ctx.fillStyle = vGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();

      sinceLastSpawn += 1;
      if (sinceLastSpawn > 90) {
        spawnRing();
        sinceLastSpawn = 0;
      }

      rings.forEach((ring) => {
        ring.r += 1.4;
        ring.alpha = Math.max(0, 0.45 - ring.r / 900);
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(232, 207, 192, ${ring.alpha})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });
      rings = rings.filter((r) => r.alpha > 0.005);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

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
