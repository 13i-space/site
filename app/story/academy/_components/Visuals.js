"use client";
// Visual pieces for the Champion Academy: plain SVG/HTML, no libraries.

const MODE_COLOR = { Explore: "#C25B34", Play: "#B8862B", Create: "#5F7F6B" };
export const C6 = ["Character", "Challenge", "Choice", "Cave", "Change", "Create"];

export function Stars({ n, of = 5, label = "Difficulty" }) {
  return (
    <span className="ac-stars" role="img" aria-label={`${label}: ${n} of ${of}`}>
      {Array.from({ length: of }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
          <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z" fill={i < n ? "#C99A3B" : "none"} stroke={i < n ? "#C99A3B" : "#D4C6B4"} strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

export function ModeChip({ mode }) {
  return <span className="ac-mode" style={{ "--m": MODE_COLOR[mode] || "#C25B34" }}>{mode}</span>;
}

const CALLOUT_ICON = {
  Tip: "M10 2a6 6 0 00-3.5 10.9V15h7v-2.1A6 6 0 0010 2zm-2.5 15h5v1.2a.8.8 0 01-.8.8H8.3a.8.8 0 01-.8-.8z",
  Mindset: "M10 2a8 8 0 100 16 8 8 0 000-16zm0 3a1.2 1.2 0 110 2.4A1.2 1.2 0 0110 5zm1.5 10h-3v-1h1V9.5h-1v-1h2V14h1z",
  Warning: "M10 2L1 18h18L10 2zm-1 5h2v6H9zm0 7.5h2v2H9z",
  Insight: "M10 1l2.2 6.3L18.5 8l-5 4 1.6 6.4L10 15l-5.1 3.4L6.5 12l-5-4 6.3-.7z",
  Explore: "M10 2a8 8 0 100 16 8 8 0 000-16zm3.5 4.5L11.4 11.4 6.5 13.5l2.1-4.9z",
  Play: "M6 3.5v13l11-6.5z",
  Create: "M14.3 2.3l3.4 3.4L7 16.4 3 17l.6-4z",
};

export function Callout({ kind, text, children }) {
  return (
    <div className={`ac-callout ${String(kind).toLowerCase()}`}>
      <div className="ac-callout-k">
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d={CALLOUT_ICON[kind] || CALLOUT_ICON.Tip} fill="currentColor" /></svg>
        {kind}
      </div>
      <p>{text}{children}</p>
    </div>
  );
}

export function ProgressRing({ pct = 0, size = 56, stroke = 5, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ac-ring" role="img" aria-label={label || `${pct}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFE5D6" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#C25B34" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * c} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray .6s ease" }}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="ac-ring-t" style={{ fontSize: size * 0.26 }}>{pct}%</text>
    </svg>
  );
}

// The hero: the six C's orbiting a Champion seal.
export function OrbitHero() {
  const S = 520, cx = 260, cy = 260, R = 196;
  const nodes = C6.map((c, i) => {
    const a = (-90 + i * 60) * (Math.PI / 180);
    return { c, i, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="ac-orbit" role="img" aria-label="The six C's of Story of Self around the Champion">
      <defs>
        <radialGradient id="acGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F6E3D8" stopOpacity="1" />
          <stop offset="70%" stopColor="#F6E3D8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F6E3D8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="acSeal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D06A40" />
          <stop offset="100%" stopColor="#9E4320" />
        </linearGradient>
        <path id="acSealText" d={`M ${cx - 86} ${cy} a 86 86 0 1 1 172 0 a 86 86 0 1 1 -172 0`} />
      </defs>
      <circle cx={cx} cy={cy} r={250} fill="url(#acGlow)" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#E2D6C5" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={R + 26} fill="none" stroke="#E2D6C5" strokeWidth="1" strokeDasharray="2 7" />
      <circle cx={cx} cy={cy} r={136} fill="none" stroke="#E7D7C3" strokeWidth="1" />
      <line x1={cx - 230} y1={cy} x2={cx + 230} y2={cy} stroke="#E2D6C5" strokeDasharray="3 6" />
      <text x={cx + 150} y={cy - 8} className="ac-orbit-k">KNOWN</text>
      <text x={cx + 150} y={cy + 18} className="ac-orbit-k">UNKNOWN</text>
      <g className="ac-orbit-spin">
        <circle cx={cx} cy={cy - R} r="5" fill="#C25B34">
          <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="24s" repeatCount="indefinite" />
        </circle>
      </g>
      {nodes.map((n) => (
        <g key={n.c} className="ac-orbit-node" style={{ animationDelay: `${n.i * 0.12}s` }}>
          <circle cx={n.x} cy={n.y} r="34" fill="#FFFCF7" stroke="#C25B34" strokeWidth="1.6" />
          <text x={n.x} y={n.y - 5} textAnchor="middle" className="ac-orbit-n">{n.i + 1}</text>
          <text x={n.x} y={n.y + 13} textAnchor="middle" className="ac-orbit-c">{n.c}</text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="104" fill="url(#acSeal)" />
      <circle cx={cx} cy={cy} r="96" fill="none" stroke="#F6E3D8" strokeOpacity=".55" strokeWidth="1" />
      <text className="ac-seal-ring"><textPath href="#acSealText" startOffset="0">STORY OF SELF · CHAMPION ACADEMY · ONE WHO FIGHTS FOR ANOTHER ·</textPath></text>
      <circle cx={cx} cy={cy - 18} r="20" fill="none" stroke="#FFF7EF" strokeWidth="3" />
      <circle cx={cx} cy={cy - 40} r="5" fill="#FFF7EF" />
      <text x={cx} y={cy + 30} textAnchor="middle" className="ac-seal-word">Champion</text>
    </svg>
  );
}

// Smooth curve through points (Catmull-Rom to cubic Bezier).
function smooth(pts) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// The shape of a Story of Self: the Fall into the Cave, then the Rise.
export function StoryArc({ items, active, onPick }) {
  const W = 860, H = 320, padX = 80, top = 56, bottom = 250;
  const pts = items.map((it, i) => ({
    ...it,
    x: padX + (i / (items.length - 1)) * (W - padX * 2),
    y: top + it.arc * (bottom - top),
  }));
  const d = smooth(pts);
  const area = `${d} L ${pts[pts.length - 1].x} ${H - 18} L ${pts[0].x} ${H - 18} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="ac-arc" role="img" aria-label="The Story arc: from the Ordinary World down through the Fall to the Impossible Shift, then up through the Rise to the Call to Action">
      <defs>
        <linearGradient id="acArcStroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#5F7F6B" />
          <stop offset="50%" stopColor="#C25B34" />
          <stop offset="100%" stopColor="#C99A3B" />
        </linearGradient>
        <linearGradient id="acArcFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#C25B34" stopOpacity=".12" />
          <stop offset="100%" stopColor="#C25B34" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={30} x2={W - 30} y1={(top + bottom) / 2} y2={(top + bottom) / 2} stroke="#E2D6C5" strokeDasharray="3 6" />
      <text x={W - 34} y={(top + bottom) / 2 - 8} textAnchor="end" className="ac-arc-k">KNOWN</text>
      <text x={W - 34} y={(top + bottom) / 2 + 18} textAnchor="end" className="ac-arc-k">UNKNOWN</text>
      <text x={pts[2].x} y={H - 2} textAnchor="middle" className="ac-arc-zone">THE FALL</text>
      <text x={pts[4].x} y={H - 2} textAnchor="middle" className="ac-arc-zone">THE RISE</text>
      <path d={area} fill="url(#acArcFill)" />
      <path d={d} fill="none" stroke="url(#acArcStroke)" strokeWidth="3" strokeLinecap="round" className="ac-arc-path" />
      {pts.map((p, i) => {
        const on = p.key === active;
        const above = p.arc < 0.5;
        return (
          <g key={p.key} className="ac-arc-pt" onClick={() => onPick?.(p.key)} role="button" tabIndex={0} aria-label={p.el}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick?.(p.key)} aria-pressed={on}>
            <circle cx={p.x} cy={p.y} r="22" fill="transparent" />
            <circle cx={p.x} cy={p.y} r={on ? 11 : 8} fill={on ? "#C25B34" : "#FFFCF7"} stroke="#C25B34" strokeWidth="2.5" />
            <text x={p.x} y={above ? p.y - 20 : p.y + 32} textAnchor="middle" className={`ac-arc-l${on ? " on" : ""}`}>{p.short || p.el}</text>
            <text x={p.x} y={p.y + 4} textAnchor="middle" className="ac-arc-num" fill={on ? "#fff" : "#C25B34"}>{i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

// The six-step Framework for Coaching as a path.
export function FrameworkPath({ steps, active, onPick }) {
  return (
    <ol className="ac-fpath">
      {steps.map((s) => (
        <li key={s.key} className={active === s.key ? "on" : ""}>
          <button type="button" onClick={() => onPick(s.key)} aria-pressed={active === s.key}>
            <span className="n">{s.n}</span>
            <span className="t">{s.title}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
