"use client";

export default function AuroraField() {
  return (
    <div className="aurora-field">
      <style>{`
        .aurora-field {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background: #05060f;
        }
        .aurora-curtain {
          position: absolute;
          top: -20%;
          bottom: -20%;
          width: 55vw;
          filter: blur(40px);
          opacity: 0.5;
          mix-blend-mode: screen;
        }
        .aurora-curtain.a {
          left: -15%;
          background: linear-gradient(180deg, transparent, rgba(139,149,246,0.55) 35%, rgba(95,212,255,0.35) 60%, transparent);
          animation: aurora-sway-a 22s ease-in-out infinite;
        }
        .aurora-curtain.b {
          left: 20%;
          background: linear-gradient(180deg, transparent, rgba(232,207,192,0.4) 40%, rgba(139,149,246,0.3) 65%, transparent);
          animation: aurora-sway-b 28s ease-in-out infinite;
        }
        .aurora-curtain.c {
          left: 55%;
          background: linear-gradient(180deg, transparent, rgba(95,212,255,0.4) 30%, rgba(185,192,255,0.3) 60%, transparent);
          animation: aurora-sway-c 25s ease-in-out infinite;
        }
        @keyframes aurora-sway-a {
          0%, 100% { transform: translateX(0) skewX(-6deg); }
          50% { transform: translateX(8vw) skewX(2deg); }
        }
        @keyframes aurora-sway-b {
          0%, 100% { transform: translateX(0) skewX(4deg); }
          50% { transform: translateX(-10vw) skewX(-3deg); }
        }
        @keyframes aurora-sway-c {
          0%, 100% { transform: translateX(0) skewX(-3deg); }
          50% { transform: translateX(6vw) skewX(5deg); }
        }
        .aurora-stars {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(1px 1px at 15% 25%, rgba(220,223,255,0.6), transparent),
            radial-gradient(1px 1px at 40% 70%, rgba(220,223,255,0.5), transparent),
            radial-gradient(1px 1px at 65% 15%, rgba(220,223,255,0.6), transparent),
            radial-gradient(1px 1px at 80% 55%, rgba(220,223,255,0.4), transparent),
            radial-gradient(1px 1px at 25% 85%, rgba(220,223,255,0.5), transparent),
            radial-gradient(1px 1px at 90% 30%, rgba(220,223,255,0.5), transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-curtain { animation: none !important; }
        }
      `}</style>
      <div className="aurora-stars" />
      <div className="aurora-curtain a" />
      <div className="aurora-curtain b" />
      <div className="aurora-curtain c" />
    </div>
  );
}
