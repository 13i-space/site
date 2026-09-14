"use client";

export default function RadarLogo({ src = "/13i-logo.png" }) {
  return (
    <div className="radar-logo-stage">
      <style>{`
        .radar-logo-stage {
          --eye-x: 74.8%;
          --eye-y: 29.2%;
          position: relative;
          width: 100%;
          line-height: 0;
        }
        .radar-logo-stage .logo {
          position: relative;
          display: block;
          width: 100%;
          height: auto;
          z-index: 2;
        }
        .radar-ring {
          position: absolute;
          left: var(--eye-x);
          top: var(--eye-y);
          width: 26%;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 1px dashed rgba(139, 149, 246, 0.45);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
          animation: radar-ring-spin 9s linear infinite;
        }
        .radar-ring.outer {
          width: 40%;
          border-color: rgba(232, 207, 192, 0.3);
          animation-duration: 15s;
          animation-direction: reverse;
        }
        @keyframes radar-ring-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .radar-ring { animation: none !important; }
        }
      `}</style>

      <img className="logo" src={src} alt="13i" />
      <div className="radar-ring" />
      <div className="radar-ring outer" />
    </div>
  );
}
