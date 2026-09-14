"use client";

export default function OrbitalLogo({ src = "/13i-logo.png" }) {
  return (
    <div className="orbital-logo-stage">
      <style>{`
        .orbital-logo-stage {
          --eye-x: 74.8%;
          --eye-y: 29.2%;
          position: relative;
          width: 100%;
          line-height: 0;
        }
        .orbital-logo-stage .logo {
          position: relative;
          display: block;
          width: 100%;
          height: auto;
          z-index: 2;
        }
        .orbit-ring {
          position: absolute;
          left: var(--eye-x);
          top: var(--eye-y);
          border: 1px solid rgba(185, 192, 255, 0.28);
          border-radius: 50%;
          transform-origin: center;
          pointer-events: none;
          z-index: 1;
        }
        .orbit-ring.a {
          width: 32%;
          aspect-ratio: 2.4 / 1;
          transform: translate(-50%, -50%) rotate(-18deg);
          animation: orbit-spin-a 22s linear infinite;
        }
        .orbit-ring.b {
          width: 46%;
          aspect-ratio: 2.6 / 1;
          transform: translate(-50%, -50%) rotate(12deg);
          border-color: rgba(232, 207, 192, 0.22);
          animation: orbit-spin-b 34s linear infinite;
        }
        @keyframes orbit-spin-a {
          from { transform: translate(-50%, -50%) rotate(-18deg); }
          to { transform: translate(-50%, -50%) rotate(342deg); }
        }
        @keyframes orbit-spin-b {
          from { transform: translate(-50%, -50%) rotate(12deg); }
          to { transform: translate(-50%, -50%) rotate(-348deg); }
        }
        .orbit-satellite {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #E8CFC0;
          box-shadow: 0 0 6px 1px rgba(232, 207, 192, 0.6);
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        @media (prefers-reduced-motion: reduce) {
          .orbit-ring { animation: none !important; }
        }
      `}</style>

      <img className="logo" src={src} alt="13i" />

      <div className="orbit-ring a">
        <span className="orbit-satellite" />
      </div>
      <div className="orbit-ring b">
        <span className="orbit-satellite" style={{ background: "#B9C0FF", boxShadow: "0 0 6px 1px rgba(185,192,255,0.6)" }} />
      </div>
    </div>
  );
}
