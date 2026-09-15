"use client";

export default function NebulaLogo({ src = "/13i-logo.png" }) {
  return (
    <div className="nebula-logo-stage">
      <style>{`
        .nebula-logo-stage {
          --eye-x: 74.8%;
          --eye-y: 29.2%;
          position: relative;
          width: 100%;
          line-height: 0;
        }
        .nebula-logo-stage .logo {
          position: relative;
          display: block;
          width: 100%;
          height: auto;
          z-index: 2;
        }
        .nebula-glow {
          position: absolute;
          left: var(--eye-x);
          top: var(--eye-y);
          width: 60%;
          aspect-ratio: 1;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(232,207,192,0.45), rgba(139,149,246,0.15) 55%, transparent 75%);
          filter: blur(18px);
          z-index: 1;
          animation: nebula-pulse 5s ease-in-out infinite;
        }
        @keyframes nebula-pulse {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(0.94); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .nebula-glow { animation: none !important; }
        }
      `}</style>
      <div className="nebula-glow" />
      <img className="logo" src={src} alt="13i" />
    </div>
  );
}
