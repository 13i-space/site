"use client";

export default function NebulaField() {
  return (
    <div className="nebula-field">
      <style>{`
        .nebula-field {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .nebula-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.35;
        }
        .nebula-blob.a {
          width: 46vw; height: 46vw;
          top: -10%; left: -5%;
          background: radial-gradient(circle, rgba(139,149,246,0.55), transparent 70%);
          animation: nebula-drift-a 34s ease-in-out infinite;
        }
        .nebula-blob.b {
          width: 40vw; height: 40vw;
          bottom: -10%; right: -5%;
          background: radial-gradient(circle, rgba(232,207,192,0.4), transparent 70%);
          animation: nebula-drift-b 40s ease-in-out infinite;
        }
        .nebula-blob.c {
          width: 30vw; height: 30vw;
          top: 30%; left: 55%;
          background: radial-gradient(circle, rgba(185,192,255,0.35), transparent 70%);
          animation: nebula-drift-c 28s ease-in-out infinite;
        }
        @keyframes nebula-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(6vw, 8vh) scale(1.15); }
        }
        @keyframes nebula-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-7vw, -6vh) scale(1.1); }
        }
        @keyframes nebula-drift-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-5vw, 5vh) scale(0.9); }
        }
        @media (prefers-reduced-motion: reduce) {
          .nebula-blob { animation: none !important; }
        }
      `}</style>
      <div className="nebula-blob a" />
      <div className="nebula-blob b" />
      <div className="nebula-blob c" />
    </div>
  );
}
