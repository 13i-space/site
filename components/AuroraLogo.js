"use client";

export default function AuroraLogo({ src = "/13i-logo.png" }) {
  return (
    <div className="aurora-logo-stage">
      <style>{`
        .aurora-logo-stage {
          --eye-x: 74.8%;
          --eye-y: 29.2%;
          position: relative;
          width: 100%;
          line-height: 0;
        }
        .aurora-logo-stage .logo {
          position: relative;
          display: block;
          width: 100%;
          height: auto;
          z-index: 2;
        }
        .aurora-glow {
          position: absolute;
          left: var(--eye-x);
          top: var(--eye-y);
          width: 65%;
          aspect-ratio: 1;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: conic-gradient(from 0deg, rgba(139,149,246,0.4), rgba(95,212,255,0.3), rgba(232,207,192,0.35), rgba(139,149,246,0.4));
          filter: blur(26px);
          z-index: 1;
          animation: aurora-logo-spin 14s linear infinite, aurora-logo-pulse 5s ease-in-out infinite;
        }
        @keyframes aurora-logo-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes aurora-logo-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.9; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-glow { animation: none !important; }
        }
      `}</style>
      <div className="aurora-glow" />
      <img className="logo" src={src} alt="13i" />
    </div>
  );
}
