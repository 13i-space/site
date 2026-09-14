"use client";

export default function SignalLogo({ src = "/13i-logo.png" }) {
  return (
    <div className="signal-logo-stage">
      <style>{`
        .signal-logo-stage {
          --eye-x: 74.8%;
          --eye-y: 29.2%;
          --eye-size: 7.0%;
          position: relative;
          width: 100%;
          line-height: 0;
        }
        .signal-logo-stage .logo {
          position: relative;
          display: block;
          width: 100%;
          height: auto;
          z-index: 2;
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
        @media (prefers-reduced-motion: reduce) {
          .signal-ripple { animation: none !important; }
        }
      `}</style>

      <img className="logo" src={src} alt="13i" />
      <div className="signal-ripple" style={{ animationDelay: "0s" }} />
      <div className="signal-ripple" style={{ animationDelay: "1.5s" }} />
      <div className="signal-ripple" style={{ animationDelay: "3s" }} />
    </div>
  );
}
