"use client";

import { useRef, useEffect } from "react";

export default function GravityLens({ anchorRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let cx = 0, cy = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (anchorRef && anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        cx = rect.left + rect.width * 0.748;
        cy = rect.top + rect.height * 0.292;
      } else {
        cx = canvas.width / 2;
        cy = canvas.height * 0.35;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", resize);

    const spacing = 44;

    const warp = (x, y, strength) => {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const pull = Math.min(strength / dist, 26);
      const factor = 1 - pull / dist;
      return [cx + dx * factor, cy + dy * factor];
    };

    let t = 0;
    const draw = () => {
      t += 0.01;
      const strength = 2400 + Math.sin(t) * 300;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(139, 149, 246, 0.16)";
      ctx.lineWidth = 1;

      for (let gy = -spacing; gy <= canvas.height + spacing; gy += spacing) {
        ctx.beginPath();
        for (let gx = -spacing; gx <= canvas.width + spacing; gx += 14) {
          const [wx, wy] = warp(gx, gy, strength);
          if (gx === -spacing) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      }
      for (let gx = -spacing; gx <= canvas.width + spacing; gx += spacing) {
        ctx.beginPath();
        for (let gy = -spacing; gy <= canvas.height + spacing; gy += 14) {
          const [wx, wy] = warp(gx, gy, strength);
          if (gy === -spacing) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", resize);
    };
  }, [anchorRef]);

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
        background: "#06070F",
      }}
    />
  );
}
