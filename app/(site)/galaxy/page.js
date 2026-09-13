import Link from "next/link";

function spiralPath(startAngle, turns, startR, endR, steps = 100) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = startAngle + t * turns * Math.PI * 2;
    const r = startR + t * (endR - startR);
    const x = 200 + r * Math.cos(angle);
    const y = 200 + r * Math.sin(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return "M" + points.join(" L");
}

export default function GalaxyPage() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div className="page-title">The Galaxy</div>
      <div className="page-subtitle">where this all takes place</div>

      <div className="panel" style={{ textAlign: "center", marginBottom: 24 }}>
        <svg viewBox="0 0 400 400" width="100%" style={{ maxWidth: 400 }}>
          <defs>
            <radialGradient id="galaxyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(232,207,192,0.9)" />
              <stop offset="100%" stopColor="rgba(232,207,192,0)" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="190" fill="#0A0B1C" />
          {[0, Math.PI].map((offset, i) => (
            <path
              key={i}
              d={spiralPath(offset, 1.4, 20, 185)}
              fill="none"
              stroke="#4C5192"
              strokeWidth="10"
              opacity="0.35"
              strokeLinecap="round"
            />
          ))}
          {[0.9, Math.PI + 0.9].map((offset, i) => (
            <path
              key={`s-${i}`}
              d={spiralPath(offset, 1.2, 30, 150)}
              fill="none"
              stroke="#8B95F6"
              strokeWidth="5"
              opacity="0.3"
              strokeLinecap="round"
            />
          ))}
          <circle cx="200" cy="200" r="18" fill="url(#galaxyGlow)" />
          <circle cx="200" cy="200" r="6" fill="#E8CFC0" />

          {/* Earth's position - Orion Arm, roughly 2/3 out from center */}
          <circle cx="285" cy="235" r="4" fill="#8B95F6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <line x1="285" y1="235" x2="320" y2="255" stroke="#6E76B8" strokeWidth="1" />
          <text x="324" y="259" fontFamily="'JetBrains Mono', monospace" fontSize="11" fill="#B9C0FF">
            Earth
          </text>
        </svg>
        <div className="mono" style={{ fontSize: 11, color: "#565B8F", marginTop: 8 }}>
          a simplified top-down view &middot; not to scale
        </div>
      </div>

      <div className="panel">
        <p style={{ margin: 0 }}>
          Earth sits roughly two-thirds of the way out from the center of
          the Milky Way, in a minor spur called the Orion Arm — not one of
          the galaxy's two major spiral arms, just a smaller passage
          between them. It's an unremarkable address, galactically
          speaking. That's part of the point.
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Link
          href="/galaxy/facts"
          style={{
            display: "inline-block",
            padding: "10px 22px",
            border: "1px solid #3A3E75",
            borderRadius: 4,
            color: "#B9C0FF",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
          }}
        >
          Galaxy facts &rarr;
        </Link>
      </div>
    </div>
  );
}
