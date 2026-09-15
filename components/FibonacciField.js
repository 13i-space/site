"use client";

import { useRef, useEffect } from "react";

const GOLDEN_ANGLE = 137.50776; // degrees

export default function FibonacciField({ count = 220 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let cx = 0, cy = 0, scale = 1;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cx = canvas.width / 2;
      cy = canvas.height / 2;
      scale = Math.min(canvas.width, canvas.height) / (Math.sqrt(count) * 2.1);
    };
    resize();
    window.addEventListener("resize", resize);

    let rotation = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < count; i++) {
        const angle = i * GOLDEN_ANGLE * (Math.PI / 180) + rotation;
        const r = scale * Math.sqrt(i);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const depth = i / count; // 0 = center (new), 1 = edge (old)
        const alpha = 0.55 - depth * 0.4;
        const size = 2.2 - depth * 1.4;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.6, size), 0, Math.PI * 2);
        ctx.fillStyle =
          i % 13 === 0
            ? `rgba(232, 207, 192, ${alpha + 0.15})`
            : `rgba(139, 149, 246, ${alpha})`;
        ctx.fill();
      }

      rotation += 0.0006;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

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
