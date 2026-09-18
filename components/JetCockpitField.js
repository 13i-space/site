"use client";

export default function JetCockpitField() {
  return (
    <div className="jet-field">
      <style>{`
        .jet-field {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background: radial-gradient(ellipse at 50% 20%, #10160f 0%, #05060a 65%);
        }
        .jet-canopy-frame {
          position: absolute;
          inset: 0;
          border: 22px solid transparent;
          border-image: linear-gradient(180deg, #1a1d33, #0a0b16) 1;
          box-shadow: inset 0 0 120px 30px rgba(0,0,0,0.7);
        }
        .jet-reticle {
          position: absolute;
          top: 6%;
          left: 50%;
          transform: translateX(-50%);
          width: 90px;
          height: 90px;
          opacity: 0.35;
        }
        .jet-glass-glare {
          position: absolute;
          top: 0;
          left: -10%;
          width: 55%;
          height: 60%;
          background: linear-gradient(115deg, rgba(139,149,246,0.06), transparent 60%);
        }
        .jet-rivet-row {
          position: absolute;
          display: flex;
          gap: 14px;
        }
        .jet-rivet {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(139,149,246,0.3);
        }
      `}</style>

      <div className="jet-glass-glare" />

      <svg className="jet-reticle" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="30" fill="none" stroke="#8FE0A8" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="2" fill="#8FE0A8" />
        <line x1="50" y1="10" x2="50" y2="26" stroke="#8FE0A8" strokeWidth="0.8" />
        <line x1="50" y1="74" x2="50" y2="90" stroke="#8FE0A8" strokeWidth="0.8" />
        <line x1="10" y1="50" x2="26" y2="50" stroke="#8FE0A8" strokeWidth="0.8" />
        <line x1="74" y1="50" x2="90" y2="50" stroke="#8FE0A8" strokeWidth="0.8" />
      </svg>

      <div className="jet-rivet-row" style={{ top: 10, left: 20 }}>
        {Array.from({ length: 8 }).map((_, i) => <span key={i} className="jet-rivet" />)}
      </div>
      <div className="jet-rivet-row" style={{ bottom: 10, right: 20 }}>
        {Array.from({ length: 8 }).map((_, i) => <span key={i} className="jet-rivet" />)}
      </div>

      <div className="jet-canopy-frame" />
    </div>
  );
}
