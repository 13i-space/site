"use client";

import { useRef, useEffect } from "react";

export default function GravityWaves() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let cx, cy;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cx = canvas.width / 2;
      cy = canvas.height * 0.38;
    };
    resize();
    window.addEventListener("resize", resize);

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
