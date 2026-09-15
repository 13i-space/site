"use client";

export default function HubbleLogo({ src = "/13i-logo.png" }) {
  return (
    <div className="hubble-logo-stage">
      <style>{`
        .hubble-logo-stage {
          --eye-x: 74.8%;
          --eye-y: 29.2%;
          position: relative;
          width: 100%;
          line-height: 0;
        }
        .hubble-logo-stage .logo {
          position: relative;
          display: block;
          width: 100%;
          height: auto;
          z-index: 2;
        }
        .hubble-glow {
          position: absolute;
          left: var(--eye-x);
          top: var(--eye-y);
          width: 70%;
          aspect-ratio: 1;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(210,150,80,0.35), rgba(168,60,90,0.15) 55%, transparent 75%);
          filter: blur(24px);
          z-index: 1;
          animation: hubble-pulse 6s ease-in-out infinite;
        }
        @keyframes hubble-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.95; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hubble-glow { animation: none !important; }
        }
      `}</style>
      <div className="hubble-glow" />
      <img className="logo" src={src} alt="13i" />
    </div>
  );
}
