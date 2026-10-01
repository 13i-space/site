// Homepage hero illustration: the Story Circle, with "you" travelling it.
const C = ["Character", "Challenge", "Choice", "Cave", "Change", "Create"];

export default function HeroArt() {
  const cx = 250, cy = 250, R = 170;
  const pts = C.map((c, i) => {
    const a = (-90 + i * 60) * (Math.PI / 180);
    return { c, i, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), lx: cx + (R + 46) * Math.cos(a), ly: cy + (R + 46) * Math.sin(a) };
  });
  const circle = `M ${cx} ${cy - R} A ${R} ${R} 0 1 1 ${cx - 0.01} ${cy - R}`;
  return (
    <svg viewBox="0 0 500 500" className="sh-art" role="img" aria-label="The Story Circle: Character, Challenge, Choice, Cave, Change, Create, with you at the center as the lead character">
      <defs>
        <radialGradient id="shGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F6E3D8" />
          <stop offset="75%" stopColor="#F6E3D8" stopOpacity=".25" />
          <stop offset="100%" stopColor="#F6E3D8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="shArc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C99A3B" />
          <stop offset="100%" stopColor="#C25B34" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r="240" fill="url(#shGlow)" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#E2D6C5" strokeWidth="2" />
      <path d={circle} fill="none" stroke="url(#shArc)" strokeWidth="3.5" strokeLinecap="round" className="sh-trace" />
      {pts.map((p) => (
        <g key={p.c}>
          <circle cx={p.x} cy={p.y} r="9" fill="#FFFCF7" stroke="#C25B34" strokeWidth="2.5" />
          <text x={p.lx} y={p.ly + 5} textAnchor="middle" className="sh-c">{p.c}</text>
        </g>
      ))}
      <circle r="8" fill="#C25B34" stroke="#FFFCF7" strokeWidth="3">
        <animateMotion dur="14s" repeatCount="indefinite" path={circle} />
      </circle>
      <circle cx={cx} cy={cy} r="74" fill="#FFFCF7" stroke="#E7D7C3" />
      <text x={cx} y={cy - 8} textAnchor="middle" className="sh-you">You</text>
      <text x={cx} y={cy + 18} textAnchor="middle" className="sh-sub">the lead character</text>
    </svg>
  );
}
