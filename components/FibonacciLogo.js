"use client";

export default function FibonacciLogo({ src = "/13i-logo.png" }) {
  // A simple logarithmic (golden-ratio-ish) spiral path, drawn once and
  // slowly rotated around the eye via CSS.
  const spiralPath = (() => {
    const turns = 2.4;
    const steps = 120;
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * Math.PI * 2;
      const r = 2 + t * 3.1;
      const x = 50 + r * Math.cos(t);
      const y = 50 + r * Math.sin(t);
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return `M ${points.join(" L ")}`;
  })();

  return (
    <div className="fib-logo-stage">
      <style>{`
        .fib-logo-stage {
          --eye-x: 74.8%;
          --eye-y: 29.2%;
          position: relative;
          width: 100%;
          line-height: 0;
        }
        .fib-logo-stage .logo {
          position: relative;
          display: block;
          width: 100%;
          height: auto;
          z-index: 2;
        }
        .fib-spiral {
          position: absolute;
          left: var(--eye-x);
          top: var(--eye-y);
          width: 55%;
          aspect-ratio: 1;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
          animation: fib-spin 40s linear infinite;
          opacity: 0.55;
        }
        @keyframes fib-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fib-spiral { animation: none !important; }
        }
      `}</style>

      <img className="logo" src={src} alt="13i" />

      <svg className="fib-spiral" viewBox="0 0 100 100">
        <path d={spiralPath} fill="none" stroke="#E8CFC0" strokeWidth="0.6" />
      </svg>
    </div>
  );
}
