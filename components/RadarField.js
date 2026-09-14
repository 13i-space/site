"use client";

import { useRef, useEffect } from "react";

export default function RadarField({ blipCount = 26 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let cx = 0, cy = 0, maxR = 0;
    let blips = [];
    let sweepAngle = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cx = canvas.width / 2;
      cy = canvas.height / 2;
      maxR = Math.hypot(canvas.width, canvas.height) / 2;
      blips = Array.from({ length: blipCount }, () => ({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * maxR,
        lit: 0,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // concentric rings
      ctx.strokeStyle = "rgba(139, 149, 246, 0.12)";
      ctx.lineWidth = 1;
      for (let r = maxR / 4; r <= maxR; r += maxR / 4) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      // crosshair
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(canvas.width, cy);
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, canvas.height);
      ctx.stroke();

      // sweep beam (a soft wedge)
      const grad = ctx.createConicGradient
        ? ctx.createConicGradient(sweepAngle - Math.PI / 2, cx, cy)
        : null;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sweepAngle);
      const wedge = ctx.createLinearGradient(0, 0, maxR, 0);
      wedge.addColorStop(0, "rgba(139, 149, 246, 0.20)");
      wedge.addColorStop(1, "rgba(139, 149, 246, 0)");
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxR, -0.18, 0.18);
      ctx.closePath();
      ctx.fillStyle = wedge;
      ctx.fill();
      ctx.restore();

      // sweep line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR);
      ctx.strokeStyle = "rgba(185, 192, 255, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // blips - light up as the sweep passes them, then fade
      blips.forEach((b) => {
        let diff = Math.abs(((sweepAngle - b.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        if (diff < 0.06) b.lit = 1;
        else b.lit = Math.max(0, b.lit - 0.01);

        if (b.lit > 0.02) {
          const x = cx + Math.cos(b.angle) * b.dist;
          const y = cy + Math.sin(b.angle) * b.dist;
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232, 207, 192, ${b.lit * 0.8})`;
          ctx.fill();
        }
      });

      sweepAngle += 0.006;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [blipCount]);

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
