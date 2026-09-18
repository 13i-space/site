"use client";

export default function CockpitLogo({ src = "/13i-logo.png" }) {
  return (
    <div className="cockpit-logo-stage">
      <style>{`
        .cockpit-logo-stage {
          position: relative;
          width: 100%;
          padding: 22px;
          box-sizing: border-box;
          background: linear-gradient(180deg, #23263f, #14162a);
          border-radius: 14px;
          border: 1px solid #3A3E75;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.5);
        }
        .cockpit-viewport {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #05060f;
          border: 1px solid rgba(139,149,246,0.35);
        }
        .cockpit-viewport .logo {
          position: relative;
          display: block;
          width: 100%;
          height: auto;
          z-index: 1;
        }
        .cockpit-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(180deg, transparent, rgba(232,207,192,0.09), transparent);
          animation: cockpit-scan 6s ease-in-out infinite;
          z-index: 2;
          pointer-events: none;
        }
        @keyframes cockpit-scan {
          0% { top: -40%; }
          100% { top: 100%; }
        }
        .cockpit-bolt {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0A0B1C;
          border: 1px solid #4A4E85;
        }
        @media (prefers-reduced-motion: reduce) {
          .cockpit-scanline { animation: none !important; }
        }
      `}</style>

      <div className="cockpit-viewport">
        <div className="cockpit-scanline" />
        <img className="logo" src={src} alt="13i" />
      </div>

      <span className="cockpit-bolt" style={{ top: 8, left: 8 }} />
      <span className="cockpit-bolt" style={{ top: 8, right: 8 }} />
      <span className="cockpit-bolt" style={{ bottom: 8, left: 8 }} />
      <span className="cockpit-bolt" style={{ bottom: 8, right: 8 }} />
    </div>
  );
}
