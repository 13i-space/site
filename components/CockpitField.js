"use client";

export default function CockpitField() {
  return (
    <div className="cockpit-field">
      <style>{`
        .cockpit-field {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 50% 30%, #14162e 0%, #08090f 70%),
            repeating-linear-gradient(180deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px);
        }
        .cockpit-panel-line {
          position: absolute;
          background: rgba(139, 149, 246, 0.14);
        }
        .cockpit-readout {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 34px;
          border-top: 1px solid rgba(139,149,246,0.18);
          background: rgba(6,7,18,0.55);
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .cockpit-readout-text {
          white-space: nowrap;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          color: rgba(232,207,192,0.4);
          animation: cockpit-scroll 34s linear infinite;
        }
        @keyframes cockpit-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .cockpit-light {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #E8CFC0;
          animation: cockpit-blink 4s ease-in-out infinite;
        }
        @keyframes cockpit-blink {
          0%, 92%, 100% { opacity: 0.25; }
          95% { opacity: 1; }
        }
        .cockpit-vignette {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 160px 40px rgba(0,0,0,0.65);
        }
      `}</style>

      <div className="cockpit-vignette" />

      {/* faint panel seams, evoking bulkhead structure without clutter */}
      <div className="cockpit-panel-line" style={{ top: "12%", left: 0, right: 0, height: 1 }} />
      <div className="cockpit-panel-line" style={{ bottom: "8%", left: 0, right: 0, height: 1 }} />
      <div className="cockpit-panel-line" style={{ top: 0, bottom: 0, left: "6%", width: 1 }} />
      <div className="cockpit-panel-line" style={{ top: 0, bottom: 0, right: "6%", width: 1 }} />

      {/* quiet status lights along the top seam */}
      {[10, 16, 22, 78, 84, 90].map((pct, i) => (
        <span
          key={i}
          className="cockpit-light"
          style={{ top: "calc(12% - 2px)", left: `${pct}%`, animationDelay: `${i * 0.6}s` }}
        />
      ))}

      <div className="cockpit-readout">
        <span className="cockpit-readout-text">
          HULL INTEGRITY NOMINAL &middot; GRAVITIC DRIVE STANDBY &middot; SIGNAL LOCK ACQUIRED &middot; LIFE SUPPORT NOMINAL &middot; NAV COMPUTER SYNCED &middot;&nbsp;
          HULL INTEGRITY NOMINAL &middot; GRAVITIC DRIVE STANDBY &middot; SIGNAL LOCK ACQUIRED &middot; LIFE SUPPORT NOMINAL &middot; NAV COMPUTER SYNCED &middot;&nbsp;
        </span>
      </div>
    </div>
  );
}
