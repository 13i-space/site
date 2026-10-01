import { CHAMPION_PLAN as P } from "../../../lib/story/briefContent";

function Loop() {
  const cx = 150, cy = 150, R = 104;
  const n = P.loop.length;
  return (
    <svg viewBox="0 0 300 300" className="cp-loop" role="img" aria-label={`The Champion loop: ${P.loop.join(", then ")}`}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#E2D6C5" strokeWidth="2" />
      <path d={`M ${cx} ${cy - R} A ${R} ${R} 0 1 1 ${cx - 0.1} ${cy - R}`} fill="none" stroke="#C25B34" strokeWidth="2" strokeDasharray="4 8" opacity=".6" />
      {P.loop.map((t, i) => {
        const a = (-90 + (360 / n) * i) * (Math.PI / 180);
        return (
          <g key={t}>
            <circle cx={cx + R * Math.cos(a)} cy={cy + R * Math.sin(a)} r="15" fill={i === 2 ? "#C25B34" : "#FFFCF7"} stroke="#C25B34" strokeWidth="2" />
            <text x={cx + R * Math.cos(a)} y={cy + R * Math.sin(a) + 5} textAnchor="middle" fontSize="13" fontFamily="Georgia, serif" fontStyle="italic" fill={i === 2 ? "#fff" : "#A2461F"}>{i + 1}</text>
          </g>
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fontFamily="Newsreader, Georgia, serif" fill="#2A2420">Student</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fontSize="20" fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fill="#C25B34">to Champion</text>
    </svg>
  );
}

export default function ChampionPlan() {
  return (
    <div className="cp">
      <div className="cp-top">
        <div>
          {P.intro.map((t) => <p key={t} className="cp-intro">{t}</p>)}
        </div>
        <div className="cp-loopwrap">
          <Loop />
          <ol className="cp-loop-key">{P.loop.map((t) => <li key={t}>{t}</li>)}</ol>
        </div>
      </div>

      <h3 className="mkt-h">The certification ladder</h3>
      <div className="cp-levels">
        {P.levels.map((l, i) => (
          <div key={l.name} className={`cp-level${i === 1 ? " hot" : ""}`}>
            <div className="cp-level-price">{l.price}</div>
            <b>{l.name}</b>
            <p>{l.what}</p>
          </div>
        ))}
      </div>

      <h3 className="mkt-h">Where the AI earns its keep</h3>
      <p className="cp-p">{P.practice}</p>

      <h3 className="mkt-h">How Champions earn, and how Story earns</h3>
      <div className="cp-earn">
        {P.earn.map(([t, d], i) => <div key={t}><span>{i + 1}</span><b>{t}</b><p>{d}</p></div>)}
      </div>

      <h3 className="mkt-h">Building the pool</h3>
      <p className="cp-p">{P.pool}</p>

      <h3 className="mkt-h">Safeguards</h3>
      <ul className="cp-safe">{P.safeguards.map((s) => <li key={s}>{s}</li>)}</ul>

      <div className="cp-cta">
        <div>
          <div className="mkt-size-h">See it working</div>
          <h4>The Champion Academy prototype</h4>
          <ol>{P.tryIt.map((t) => <li key={t}>{t}</li>)}</ol>
        </div>
        <p className="cp-cta-note">Open it from the launch page at the end of this briefing: choose “Champions”.</p>
      </div>
      <p className="brief-small" style={{ marginTop: 14 }}>Prices and earnings are starting estimates to test with founding Champions, not forecasts.</p>
    </div>
  );
}
