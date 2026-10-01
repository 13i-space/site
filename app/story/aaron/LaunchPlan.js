import * as D from "../../../lib/story/briefDeepDives";

const phaseAt = (m) => D.PHASES.find((p) => m >= p.from && m < p.to) || D.PHASES[0];

export default function LaunchPlan() {
  const col = (m) => `${(m / 12) * 100}%`;
  return (
    <div className="lp">
      <p className="mkt-intro">Four quarters from a prototype to a first graduation season, and then into schools and colleges. Each phase ends with a gate: a result that tells us it's time to move on.</p>

      <div className="lp-phases">
        {D.PHASES.map((p) => (
          <div key={p.q} style={{ background: p.color, color: p.ink }}>
            <span>{p.q}</span><b>{p.name}</b>
          </div>
        ))}
      </div>

      <h3 className="mkt-h">The timeline, October 2026 to September 2027</h3>
      <div className="lp-ganttwrap">
        <div className="lp-gantt" role="table" aria-label="Launch timeline by workstream">
          <div className="lp-row lp-head" role="row">
            <div className="lp-label" role="columnheader">Workstream</div>
            <div className="lp-track" role="columnheader">
              {D.MONTHS.map((m, i) => (
                <span key={m} className="lp-month" style={{ left: col(i), width: col(1) }}>{m}{i === 0 || m === "Jan" ? <small>{i === 0 ? "2026" : "2027"}</small> : null}</span>
              ))}
            </div>
          </div>
          <div className="lp-row lp-ms" role="row">
            <div className="lp-label" role="rowheader">Milestones</div>
            <div className="lp-track" role="cell">
              {D.MILESTONES.map((s, k) => (
                <span key={s.t} className={`lp-diamond${k % 2 ? " up" : ""}`} style={{ left: col(s.m) }} data-tip={`${s.t}: ${s.d}`} tabIndex={0}>
                  <i aria-hidden="true" /><em>{s.t}</em>
                </span>
              ))}
            </div>
          </div>
          {D.GANTT.map(([label, bars]) => (
            <div className="lp-row" role="row" key={label}>
              <div className="lp-label" role="rowheader">{label}</div>
              <div className="lp-track" role="cell">
                {D.MONTHS.map((m, i) => <span key={m} className="lp-grid" style={{ left: col(i) }} />)}
                {bars.map(([a, b, t]) => {
                  const ph = phaseAt(a);
                  return (
                    <span key={t} className="lp-bar" style={{ left: `calc(${col(a)} + 1px)`, width: `calc(${col(b - a)} - 2px)`, background: ph.color, color: ph.ink }} title={`${label}: ${t} (${D.MONTHS[a]}–${D.MONTHS[b - 1]})`}>
                      {t}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mkt-src">Bars are colored by the phase they start in. Hover a milestone or bar for details; on a phone, scroll the timeline sideways.</p>

      <h3 className="mkt-h">Each phase, and the gate to the next</h3>
      <div className="lp-gates">
        {D.GATES.map((g, i) => (
          <div key={g.q} className="lp-gate">
            <div className="lp-gate-top" style={{ background: D.PHASES[i].color, color: D.PHASES[i].ink }}>
              <span>{g.q}</span><b>{g.name}</b>
            </div>
            <ul>{g.goals.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="lp-gate-pass"><span>Gate to the next phase</span>{g.gate}</div>
          </div>
        ))}
      </div>
      <p className="brief-small" style={{ marginTop: 14 }}>Dates and targets are a starting plan to shape with Aaron, not commitments.</p>
    </div>
  );
}
