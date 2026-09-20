"use client";

import { useRef, useEffect, useState } from "react";

// Phase timings, in ms from animation start
const DOT_END = 900;
const BURST_END = 3800;
const SETTLE_END = 6500;

export default function BigBangField({ onSettled, originXPct = 0.5, originYPct = 0.5 }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState("dot"); // dot | burst | settle | done

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let start = null;
    let particles = [];
    let stars = [];
    let settledCalled = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cx = () => canvas.width * originXPct;
    const cy = () => canvas.height * originYPct;

    const makeBurst = () => {
      const count = 260;
      particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 7;
        return {
          x: cx(), y: cy(),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 1.6 + 0.6,
          warm: Math.random() < 0.25,
        };
      });
    };

    const makeStars = () => {
      stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.1 + 0.3,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (ts) => {
      if (start === null) start = ts;
      const t = ts - start;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (t < DOT_END) {
        setPhase("dot");
        const p = t / DOT_END;
        const r = 2 + p * 4;
        const glow = 10 + p * 30;
        ctx.beginPath();
        ctx.arc(cx(), cy(), r, 0, Math.PI * 2);
        ctx.fillStyle = "#E8CFC0";
        ctx.shadowColor = "#E8CFC0";
        ctx.shadowBlur = glow;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (t < BURST_END) {
        if (particles.length === 0) makeBurst();
        setPhase("burst");
        const bt = t - DOT_END;
        // brief white flash at the moment of ignition
        if (bt < 120) {
          ctx.fillStyle = `rgba(255,255,255,${1 - bt / 120})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.994;
          p.vy *= 0.994;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.warm ? "rgba(232,207,192,0.85)" : "rgba(185,192,255,0.85)";
          ctx.fill();
        });
      } else if (t < SETTLE_END) {
        if (stars.length === 0) makeStars();
        setPhase("settle");
        const st = (t - BURST_END) / (SETTLE_END - BURST_END);
        // fading remnants of the burst continue drifting outward, faintly
        particles.forEach((p) => {
          p.x += p.vx * 0.3;
          p.y += p.vy * 0.3;
        });
        ctx.globalAlpha = Math.max(0, 1 - st * 1.4);
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.warm ? "#E8CFC0" : "#B9C0FF";
          ctx.fill();
        });
        ctx.globalAlpha = 1;

        stars.forEach((s) => {
          const a = Math.min(1, st * 1.6) * (0.4 + Math.sin(t * 0.002 + s.phase) * 0.3);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220,223,255,${Math.max(0, a)})`;
          ctx.fill();
        });

        if (!settledCalled && st > 0.55) {
          settledCalled = true;
          onSettled && onSettled();
        }
      } else {
        setPhase("done");
        stars.forEach((s) => {
          const a = 0.4 + Math.sin(t * 0.002 + s.phase) * 0.3;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220,223,255,${Math.max(0, a)})`;
          ctx.fill();
        });
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [onSettled, originXPct, originYPct]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}
