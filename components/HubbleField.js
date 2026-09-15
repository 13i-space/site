"use client";

import { useRef, useEffect } from "react";

export default function HubbleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;

    let clouds = [];
    let dust = [];
    let brightStars = [];
    let faintStars = [];

    const palette = [
      "82,58,140",   // violet
      "196,110,74",  // rust/gold (pillars)
      "58,110,140",  // teal
      "168,60,90",   // magenta-red
      "210,150,80",  // amber
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const w = canvas.width, h = canvas.height;

      clouds = Array.from({ length: 9 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.min(w, h) * (0.22 + Math.random() * 0.28),
        color: palette[Math.floor(Math.random() * palette.length)],
        baseAlpha: 0.12 + Math.random() * 0.1,
        driftX: (Math.random() - 0.5) * 0.06,
        driftY: (Math.random() - 0.5) * 0.06,
        phase: Math.random() * Math.PI * 2,
      }));

      dust = Array.from({ length: 140 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.25,
      }));

      faintStars = Array.from({ length: 160 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 0.9 + 0.3,
        phase: Math.random() * Math.PI * 2,
      }));

      brightStars = Array.from({ length: 7 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 1.2,
        spike: Math.random() * 10 + 8,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      t += 1;
      const w = canvas.width, h = canvas.height;

      ctx.fillStyle = "#05060f";
      ctx.fillRect(0, 0, w, h);

      // soft color clouds
      clouds.forEach((c) => {
        c.x += c.driftX;
        c.y += c.driftY;
        const pulse = 0.85 + Math.sin(t * 0.003 + c.phase) * 0.15;
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r * pulse);
        grad.addColorStop(0, `rgba(${c.color}, ${c.baseAlpha})`);
        grad.addColorStop(1, `rgba(${c.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // fine dust texture
      dust.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,220,255,${d.alpha})`;
        ctx.fill();
      });

      // faint twinkling starfield
      faintStars.forEach((s) => {
        const a = 0.3 + Math.sin(t * 0.02 + s.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,223,255,${Math.max(0, a)})`;
        ctx.fill();
      });

      // bright stars with diffraction spikes (the classic Hubble/JWST look)
      brightStars.forEach((s) => {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(-s.spike, 0);
        ctx.lineTo(s.spike, 0);
        ctx.moveTo(0, -s.spike);
        ctx.lineTo(0, s.spike);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

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
