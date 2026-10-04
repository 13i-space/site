import { ALL_STATS } from "../lib/alienStats";

// The twelve stats as a radar: one spoke per stat, coloured by group, with
// the species' shape filled in. A stat at an even share of its pool sits
// halfway out; everything in one stat reaches the rim (square-root scale,
// so small differences still show).
export default function StatRadar({ stats, size = 200, labels = true }) {
  const cx = 100;
  const cy = 92;
  const r = 64;
  const n = ALL_STATS.length;
  const point = (i, k) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return [+(cx + Math.cos(a) * r * k).toFixed(2), +(cy + Math.sin(a) * r * k).toFixed(2)]; // rounded: server and browser agree
  };
  const value = (s) => Math.sqrt(Math.min(1, (Number(stats[s.id]) || 0) / s.group.pool));
  const ring = (k) => ALL_STATS.map((_, i) => point(i, k).join(",")).join(" ");
  const shape = ALL_STATS.map((s, i) => point(i, Math.max(0.04, value(s))).join(",")).join(" ");

  return (
    <svg viewBox="0 6 200 174" width={size} height={(size * 174) / 200} role="img" aria-label="Stats chart" style={{ display: "block", overflow: "visible" }}>
      <polygon points={ring(1)} fill="rgba(20,22,58,0.6)" stroke="#262A55" strokeWidth="1" />
      <polygon points={ring(0.5)} fill="none" stroke="#21244A" strokeWidth="1" strokeDasharray="2 3" />
      {ALL_STATS.map((s, i) => {
        const [x, y] = point(i, 1);
        return <line key={s.id} x1={cx} y1={cy} x2={x} y2={y} stroke="#21244A" strokeWidth="1" />;
      })}
      <polygon points={shape} fill="rgba(139,149,246,0.22)" stroke="#B9C0FF" strokeWidth="1.5" strokeLinejoin="round" />
      {ALL_STATS.map((s, i) => {
        const [x, y] = point(i, Math.max(0.04, value(s)));
        return <circle key={s.id} cx={x} cy={y} r="3" fill={s.group.color} stroke="#0A0B1C" strokeWidth="1" />;
      })}
      {labels && ALL_STATS.map((s, i) => {
        const [x, y] = point(i, 1.2);
        return (
          <text key={s.id} x={x} y={y + 3} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="8.5" fill={s.group.color}>
            {s.abbr} {Math.round(Number(stats[s.id]) || 0)}
          </text>
        );
      })}
    </svg>
  );
}
