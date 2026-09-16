"use client";

import { useRef, useEffect } from "react";

export default function SignalWaveform({ active = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * 2; // crisp on retina
      canvas.height = 64 * 2;
      canvas.style.width = "100%";
      canvas.style.height = "64px";
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += active ? 0.09 : 0.02;
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const lines = 3;
      for (let l = 0; l < lines; l++) {
        const amp = (active ? 14 + l * 6 : 3 + l) * (h / 128);
        const freq = 0.025 + l * 0.01;
        const speed = 1 + l * 0.4;
        const alpha = active ? 0.55 - l * 0.12 : 0.28 - l * 0.07;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const y = h / 2 + Math.sin(x * freq + t * speed) * amp * (0.6 + 0.4 * Math.sin(t * 0.6 + l));
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = l === 0 ? `rgba(232,207,192,${alpha})` : `rgba(139,149,246,${alpha})`;
        ctx.lineWidth = 2 * (h / 128);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: 64 }} />;
}
