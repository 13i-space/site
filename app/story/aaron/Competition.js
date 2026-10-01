import * as D from "../../../lib/story/briefDeepDives";

function PositionMap() {
  const W = 640, H = 440, L = 70, R = 24, T = 30, B = 60;
  const x = (v) => L + v * (W - L - R);
  const y = (v) => T + (1 - v) * (H - T - B);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="cmp-map" role="img"
      aria-label="Positioning map. Story of Self is alone in the top right: sold to families, and a guided journey with a finished outcome.">
      <rect x={x(0.5)} y={y(1)} width={x(1) - x(0.5)} height={y(0.5) - y(1)} fill="#F6E3D8" opacity=".55" rx="10" />
      <text x={x(0.98)} y={y(0.97)} textAnchor="end" className="cmp-q">THE OPEN SPACE</text>
      <line x1={x(0.5)} x2={x(0.5)} y1={y(0)} y2={y(1)} stroke="#E2D6C5" />
      <line x1={x(0)} x2={x(1)} y1={y(0.5)} y2={y(0.5)} stroke="#E2D6C5" />
      <line x1={x(0)} x2={x(1)} y1={y(0)} y2={y(0)} stroke="#C9BBA8" />
      <line x1={x(0)} x2={x(0)} y1={y(0)} y2={y(1)} stroke="#C9BBA8" />
      <text x={x(0)} y={H - 30} className="cmp-ax">Sold to schools & colleges</text>
      <text x={x(1)} y={H - 30} textAnchor="end" className="cmp-ax">Sold to families</text>
      <text transform={`translate(${L - 40} ${y(0)}) rotate(-90)`} className="cmp-ax">Open-ended tool</text>
      <text transform={`translate(${L - 40} ${y(1)}) rotate(-90)`} textAnchor="end" className="cmp-ax">Guided journey, finished outcome</text>
      {D.MAP.map((p) => {
        const cx = x(p.x), cy = y(p.y);
        const right = p.x < 0.75;
        return (
          <g key={p.name} className={p.us ? "us" : ""}>
            <circle cx={cx} cy={cy} r={p.us ? 11 : 7} fill={p.us ? "#C25B34" : "#8C7F74"} stroke="#FFFCF7" strokeWidth="2">
              <title>{p.name}</title>
            </circle>
            <text x={right ? cx + 13 : cx - 13} y={cy + 4} textAnchor={right ? "start" : "end"} className={p.us ? "cmp-us" : "cmp-l"}>{p.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

const MARK = ["", "Partly", "Yes"];

export default function Competition() {
  return (
    <div className="cmp">
      <p className="mkt-intro">{D.COMP_INTRO}</p>

      <h3 className="mkt-h">Where everyone sits</h3>
      <div className="cmp-mapwrap">
        <PositionMap />
        <p className="mkt-src">Positions are our judgment from each product's public description, not measurements.</p>
      </div>

      <h3 className="mkt-h">The competition, category by category</h3>
      <div className="cmp-cats">
        {D.CATEGORIES.map((c) => (
          <div key={c.cat} className="cmp-cat">
            <h4>{c.cat}</h4>
            {c.who.map((w) => <p key={w.name} className="cmp-who"><b>{w.name}.</b> {w.fact}</p>)}
            <div className="cmp-sw">
              <div><span>Their strength</span>{c.strength}</div>
              <div className="gap"><span>Where Story of Self wins</span>{c.gap}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mkt-h">Side by side</h3>
      <div className="cmp-tablewrap">
        <table className="cmp-table">
          <thead>
            <tr><th scope="col"><span className="sr">Feature</span></th>{D.COMPARE.cols.map((c, i) => <th key={c} scope="col" className={i === 0 ? "us" : ""}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {D.COMPARE.rows.map(([label, vals]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {vals.map((v, i) => (
                  <td key={i} className={i === 0 ? "us" : ""}>
                    <span className={`cmp-dot v${v}`} aria-hidden="true" />
                    <span className="cmp-dot-t">{MARK[v] || "No"}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mkt-h">The real competitor: a free chatbot, or nothing at all</h3>
      <div className="mkt-big cmp-big">
        <div><b>1 in 5</b><span>18–21-year-olds already ask AI chatbots for mental-health advice</span></div>
        <div><b>93%</b><span>of them say the advice helped</span></div>
      </div>
      <p className="mkt-note">They're already looking for this, and finding it in tools with no method, no outcome and no human behind them. Story of Self is the good version of a habit they already have. (RAND, Brown and Harvard, JAMA Network Open, 2025.)</p>

      <h3 className="mkt-h">What makes Story of Self hard to copy</h3>
      <div className="cmp-edge">
        {D.EDGE.map(([t, d], i) => <div key={t}><span>{i + 1}</span><b>{t}</b><p>{d}</p></div>)}
      </div>

      <h3 className="mkt-h">What to watch</h3>
      <ul className="cp-safe">{D.COMP_RISKS.map((r) => <li key={r}>{r}</li>)}</ul>
    </div>
  );
}
