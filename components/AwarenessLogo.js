"use client";

import { useEffect, useRef } from "react";

export default function AwarenessLogo({ src = "/13i-logo.png" }) {
  const coreRef = useRef(null);

  useEffect(() => {
    const core = coreRef.current;
    if (!core) return;
    let timeoutId;
    const organicTiming = () => {
      const seconds = 7.5 + Math.random() * 3.0;
      core.style.animationDuration = `${seconds}s`;
      timeoutId = setTimeout(organicTiming, seconds * 1000);
    };
    organicTiming();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="awareness-logo-stage">
      <style>{`
        .awareness-logo-stage {
          --silver: #d8dde3;
          --blue: 120, 190, 255;
          --eye-x: 75.5%;
          --eye-y: 28.5%;
          --eye-size: 7.0%;
          position: relative;
          width: 100%;
          line-height: 0;
        }
        .awareness-logo-stage .logo {
          position: relative;
          display: block;
          width: 100%;
          height: auto;
          z-index: 2;
        }
        .awareness-core {
          position: absolute;
          left: var(--eye-x);
          top: var(--eye-y);
          width: var(--eye-size);
          aspect-ratio: 1;
          transform: translate(-50%, -50%);
          z-index: 4;
          pointer-events: none;
          animation: awareness 8.5s ease-in-out infinite;
        }
        .core-halo {
          position: absolute;
          inset: -85%;
          border-radius: 50%;
          background: rgba(var(--blue), .14);
          filter: blur(18px);
          opacity: .35;
          animation: halo 8.5s ease-in-out infinite;
        }
        .core-glass {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 50%;
          background:
            radial-gradient(circle at 45% 40%,
              rgba(255,255,255,.98) 0 4%,
              rgba(170,225,255,.95) 8%,
              rgba(var(--blue),.72) 23%,
              rgba(8,28,55,.96) 58%,
              rgba(0,5,12,1) 100%);
          box-shadow:
            inset 0 0 10px rgba(255,255,255,.65),
            inset 0 0 22px rgba(var(--blue),.55),
            0 0 9px rgba(var(--blue),.60);
        }
        .core-energy {
          position: absolute;
          inset: -25%;
          border-radius: 50%;
          mix-blend-mode: screen;
          opacity: .35;
          filter: blur(2px);
        }
        .energy-a {
          background: conic-gradient(
            transparent 0deg,
            rgba(130,210,255,.0) 45deg,
            rgba(130,210,255,.85) 78deg,
            transparent 115deg,
            transparent 210deg,
            rgba(255,255,255,.55) 255deg,
            transparent 290deg
          );
          animation: orbitA 3.8s linear infinite;
        }
        .energy-b {
          inset: 12%;
          background: conic-gradient(
            transparent,
            rgba(255,255,255,.8),
            transparent 28%,
            rgba(80,180,255,.65),
            transparent 65%
          );
          animation: orbitB 5.2s linear infinite reverse;
        }
        .energy-c {
          inset: 28%;
          background: radial-gradient(
            ellipse at 30% 40%,
            rgba(255,255,255,.95),
            transparent 28%
          );
          animation: drift 4.6s ease-in-out infinite;
        }
        .core-point {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 15%;
          aspect-ratio: 1;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: white;
          box-shadow:
            0 0 4px white,
            0 0 10px rgba(var(--blue), .95),
            0 0 22px rgba(var(--blue), .65);
          animation: point 8.5s ease-in-out infinite;
        }
        @keyframes awareness {
          0%, 58%, 100% { filter: brightness(.72); }
          67% { filter: brightness(1.15); }
          70% { filter: brightness(1.75); }
          73% { filter: brightness(1.05); }
          78% { filter: brightness(.82); }
        }
        @keyframes halo {
          0%, 58%, 100% { opacity: .18; transform: scale(.72); }
          65% { opacity: .32; transform: scale(.95); }
          70% { opacity: .72; transform: scale(1.35); }
          74% { opacity: .30; transform: scale(1.0); }
        }
        @keyframes point {
          0%, 58%, 100% { transform: translate(-50%,-50%) scale(.75); opacity: .78; }
          67% { transform: translate(-50%,-50%) scale(1.05); opacity: 1; }
          70% { transform: translate(-50%,-50%) scale(1.55); opacity: 1; }
          73% { transform: translate(-50%,-50%) scale(.92); }
        }
        @keyframes orbitA { to { transform: rotate(360deg); } }
        @keyframes orbitB { to { transform: rotate(-360deg); } }
        @keyframes drift {
          0%, 100% { transform: translate(-15%, 5%) scale(.8); opacity: .2; }
          50% { transform: translate(18%, -12%) scale(1.1); opacity: .7; }
        }
        @media (prefers-reduced-motion: reduce) {
          .awareness-core, .core-halo, .core-point, .energy-a, .energy-b, .energy-c, .signal-ripple {
            animation: none !important;
          }
        }
        .signal-ripple {
          position: absolute;
          left: var(--eye-x);
          top: var(--eye-y);
          width: var(--eye-size);
          aspect-ratio: 1;
          border-radius: 50%;
          border: 1px solid rgba(170, 215, 255, 0.55);
          transform: translate(-50%, -50%) scale(1);
          z-index: 3;
          pointer-events: none;
          animation: signal-expand 4.5s ease-out infinite;
        }
        @keyframes signal-expand {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; }
          100% { transform: translate(-50%, -50%) scale(9); opacity: 0; }
        }
      `}</style>

      <img className="logo" src={src} alt="13i" />
      <div className="signal-ripple" style={{ animationDelay: "0s" }} />
      <div className="signal-ripple" style={{ animationDelay: "1.5s" }} />
      <div className="signal-ripple" style={{ animationDelay: "3s" }} />
      <div className="awareness-core" ref={coreRef} aria-hidden="true">
        <div className="core-halo"></div>
        <div className="core-glass">
          <div className="core-energy energy-a"></div>
          <div className="core-energy energy-b"></div>
          <div className="core-energy energy-c"></div>
          <div className="core-point"></div>
        </div>
      </div>
    </div>
  );
}
