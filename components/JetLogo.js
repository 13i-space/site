"use client";

export default function JetLogo({ src = "/13i-logo.png" }) {
  return (
    <div className="jet-logo-stage">
      <style>{`
        .jet-logo-stage {
          position: relative;
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          background: linear-gradient(180deg, #1a2620, #0c1410);
          border-radius: 10px;
          border: 1px solid #2f5a38;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.55);
        }
        .jet-viewport {
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          background: #05060a;
          border: 1px solid rgba(143,224,168,0.4);
        }
        .jet-viewport .logo {
          position: relative;
          display: block;
          width: 100%;
          height: auto;
          z-index: 1;
        }
        .jet-hud-tick {
          position: absolute;
          background: rgba(143,224,168,0.5);
        }
        .jet-scanline {
          position: absolute;
          left: 0; right: 0; height: 30%;
          background: linear-gradient(180deg, transparent, rgba(143,224,168,0.08), transparent);
          animation: jet-scan 5s ease-in-out infinite;
          z-index: 2;
          pointer-events: none;
        }
        @keyframes jet-scan {
          0% { top: -30%; } 100% { top: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .jet-scanline { animation: none !important; }
        }
      `}</style>

      <div className="jet-viewport">
        <div className="jet-scanline" />
        <img className="logo" src={src} alt="13i" />
      </div>

      <span className="jet-hud-tick" style={{ top: 4, left: "50%", width: 1, height: 8 }} />
      <span className="jet-hud-tick" style={{ bottom: 4, left: "50%", width: 1, height: 8 }} />
      <span className="jet-hud-tick" style={{ left: 4, top: "50%", width: 8, height: 1 }} />
      <span className="jet-hud-tick" style={{ right: 4, top: "50%", width: 8, height: 1 }} />
    </div>
  );
}
