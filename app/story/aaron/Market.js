import * as M from "../../../lib/story/briefMarket";

// "Understand your target market": plain HTML/SVG charts, no chart library.
// Every mark has a hover/focus tooltip (data-tip) and a visible value label.
const C = { ember: "#C25B34", blue: "#256abf", aqua: "#1baf7a", past: "#B3A699" };

function Bar({ pct, max = 100, color = C.ember, tip, label, thin }) {
  return (
    <div className={`mkt-track${thin ? " thin" : ""}`}>
      <span
        className="mkt-bar"
        style={{ width: `${(pct / max) * 100}%`, background: color }}
        data-tip={tip}
        tabIndex={0}
        aria-label={tip}
      />
      <span className="mkt-val" style={{ left: `calc(${(pct / max) * 100}% + 8px)` }}>{label ?? `${pct}%`}</span>
    </div>
  );
}

function Legend({ items }) {
  return (
    <div className="mkt-legend">
      {items.map(([label, color, dot]) => (
        <span key={label}><i className={dot ? "dot" : ""} style={{ background: color }} />{label}</span>
      ))}
    </div>
  );
}

function Chart({ title, sub, source, children, wide }) {
  return (
    <figure className={`mkt-chart${wide ? " wide" : ""}`}>
      <figcaption>
        <b>{title}</b>
        {sub && <span>{sub}</span>}
      </figcaption>
      {children}
      {source && <div className="mkt-src">{source}</div>}
    </figure>
  );
}

function Rows({ rows, max = 100, color, src }) {
  return (
    <div className="mkt-rows">
      {rows.map((r) => (
        <div className={`mkt-row${r.sub ? " sub" : ""}`} key={r.label}>
          <div className="mkt-row-label">{r.label}</div>
          <Bar pct={r.pct ?? r.v} max={max} color={r.focus === false ? C.past : color || C.ember} tip={`${r.label}: ${r.pct ?? r.v}${r.pct != null ? "%" : ""}`} label={r.pct != null ? `${r.pct}%` : r.v} />
        </div>
      ))}
    </div>
  );
}

function Cliff() {
  const W = 340, H = 150, padL = 36, padR = 24, padT = 22, padB = 26;
  const lo = 3.3, hi = 3.9;
  const x = (yr) => padL + ((yr - 2025) / (2041 - 2025)) * (W - padL - padR);
  const y = (v) => padT + ((hi - v) / (hi - lo)) * (H - padT - padB);
  const pts = M.CLIFF.map((p) => `${x(p.year)},${y(p.v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mkt-svg" role="img" aria-label="High school graduates: 3.85 million in 2025, 3.73 million in 2030, 3.45 million in 2041">
      {[3.4, 3.6, 3.8].map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#E2D6C5" strokeWidth="1" />
          <text x={padL - 6} y={y(t) + 4} textAnchor="end" className="mkt-axis">{t.toFixed(1)}M</text>
        </g>
      ))}
      <polyline points={pts} fill="none" stroke={C.ember} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {M.CLIFF.map((p, i) => (
        <g key={p.year}>
          <circle cx={x(p.year)} cy={y(p.v)} r="5" fill={C.ember} stroke="#FFFCF7" strokeWidth="2">
            <title>{`${p.year}: ${p.v.toFixed(2)} million graduates`}</title>
          </circle>
          <text x={x(p.year)} y={y(p.v) - 10} textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"} className="mkt-pt">{p.v.toFixed(2)}M</text>
          <text x={x(p.year)} y={H - 6} textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"} className="mkt-axis">{p.year}</text>
        </g>
      ))}
    </svg>
  );
}

export default function Market() {
  return (
    <div className="mkt">
      <p className="mkt-intro">{M.MARKET_INTRO}</p>

      <div className="mkt-tiles">
        {M.HEADLINES.map((h) => (
          <div className="mkt-tile" key={h.label}>
            <div className="mkt-tile-v">{h.value}</div>
            <div className="mkt-tile-l">{h.label}</div>
            <div className="mkt-tile-n">{h.note}</div>
          </div>
        ))}
      </div>

      {/* Where they go */}
      <h3 className="mkt-h">Where a graduating class goes</h3>
      <div className="mkt-grid">
        <Chart wide title="The fall after high school" sub="Share of each year's ~3.8 million graduates" source="BLS, 2024 graduates surveyed October 2024">
          <div className="mkt-stack" role="img" aria-label="41.9% four-year college, 20.9% two-year college, 37.2% not in college">
            {M.PATHS.map((p) => (
              <span key={p.key} style={{ width: `${p.pct}%`, background: p.color }} data-tip={`${p.label}: ${p.pct}% (${p.n})`} tabIndex={0} />
            ))}
          </div>
          <div className="mkt-stack-key">
            {M.PATHS.map((p) => (
              <div key={p.key}>
                <i style={{ background: p.color }} />
                <b>{p.pct}%</b>
                <span>{p.label} · {p.n}</span>
              </div>
            ))}
          </div>
          <div className="mkt-sub2">
            <div className="mkt-sub2-col">
              <div className="mkt-mini-h">Who goes straight to college</div>
              <Rows rows={M.COLLEGE_BY_SEX} color={C.blue} />
            </div>
            <div className="mkt-sub2-col">
              <div className="mkt-mini-h">The other 37%</div>
              <ul className="mkt-facts">
                {M.NOT_COLLEGE.map((f) => <li key={f.t}><b>{f.v}</b><span>{f.t}</span></li>)}
              </ul>
            </div>
          </div>
        </Chart>

        <Chart title="The summer in between" sub="Accepted, planning to go, and never show up in the fall" source="“Summer melt” research, Stanford / Harvard SDP">
          <div className="mkt-range" role="img" aria-label="Summer melt: 10% to 40% of college-intending graduates">
            <div className="mkt-range-track">
              <span className="mkt-range-band" style={{ left: "20%", width: "60%" }} data-tip="10% to 40% of college-intending graduates never enroll" tabIndex={0} />
            </div>
            <div className="mkt-range-ticks"><span>0%</span><span>10%</span><span>25%</span><span>40%</span><span>50%</span></div>
          </div>
          <p className="mkt-note">Worst for low-income students. It's the least-supported stretch of their lives: the high school counselor is gone, the college counselor hasn't started, and the structure of school disappears overnight.</p>
        </Chart>

        <Chart title="Out of 100 who start college" source="National Student Clearinghouse; Gallup–Lumina State of Higher Education 2025">
          <Rows rows={M.COLLEGE_FUNNEL.map((r) => ({ ...r, pct: undefined, v: r.v }))} />
          <p className="mkt-note">About 550,000 freshmen a year don't come back for year two. 30% leave with no credential at all.</p>
          <div className="mkt-mini-h" style={{ marginTop: 20 }}>Why current students think about leaving</div>
          <Rows rows={M.STOPOUT} />
          <p className="mkt-note">Stress and mental health rank ahead of cost.</p>
        </Chart>

      </div>

      {/* Mental health */}
      <h3 className="mkt-h">Mental health: the key numbers</h3>
      <div className="mkt-grid">
        <Chart wide title="High school students, in the past year" sub="Girls and boys" source="CDC Youth Risk Behavior Survey, 2023">
          <Legend items={[["Girls", C.ember], ["Boys", C.blue]]} />
          <div className="mkt-rows">
            {M.YRBS.map((r) => (
              <div className="mkt-row grouped" key={r.label}>
                <div className="mkt-row-label">{r.label}<small>{r.all}% of all students</small></div>
                <div>
                  <Bar pct={r.girls} max={60} color={C.ember} tip={`Girls · ${r.label}: ${r.girls}%`} thin />
                  <Bar pct={r.boys} max={60} color={C.blue} tip={`Boys · ${r.label}: ${r.boys}%`} thin />
                </div>
              </div>
            ))}
          </div>
          <p className="mkt-note"><b>1 in 5 high schoolers seriously considered suicide last year.</b> Among LGBQ+ students it's 41%.</p>
        </Chart>

        <Chart title="Highest of any age" sub="Any mental illness in the past year" source="NIMH / SAMHSA, 2022">
          <Rows rows={M.AMI_BY_AGE.map((r) => ({ ...r, focus: !!r.focus }))} max={50} />
          <p className="mkt-note">Only about half of 18–25s with a mental illness get any treatment. 11.6% have a serious mental illness.</p>
        </Chart>

        <Chart title="College students are slowly improving" sub="2022 peak vs 2025" source="Healthy Minds Study, 84,000 students">
          <Legend items={[["2022", C.past, true], ["2025", C.ember, true]]} />
          <div className="mkt-rows">
            {M.HEALTHY_MINDS.map((r) => (
              <div className="mkt-row" key={r.label}>
                <div className="mkt-row-label">{r.label}</div>
                <div className="mkt-track">
                  <span className="mkt-dumb-line" style={{ left: `${(r.to / 60) * 100}%`, width: `${((r.from - r.to) / 60) * 100}%` }} />
                  <span className="mkt-dot" style={{ left: `${(r.from / 60) * 100}%`, background: C.past }} data-tip={`2022: ${r.from}%`} tabIndex={0} />
                  <span className="mkt-dot" style={{ left: `${(r.to / 60) * 100}%`, background: C.ember }} data-tip={`2025: ${r.to}%`} tabIndex={0} />
                  <span className="mkt-val" style={{ left: `calc(${(r.from / 60) * 100}% + 14px)` }}>{r.from}% → {r.to}%</span>
                </div>
              </div>
            ))}
          </div>
        </Chart>

        <Chart wide title="Lonely and worried" sub="Under 30 vs 65 and older" source="NBC News / SurveyMonkey, April 2025">
          <Legend items={[["Under 30", C.ember], ["65+", C.blue]]} />
          <div className="mkt-rows">
            {M.YOUNG_VS_OLD.map((r) => (
              <div className="mkt-row grouped" key={r.label}>
                <div className="mkt-row-label">{r.label}</div>
                <div>
                  <Bar pct={r.young} max={100} color={C.ember} tip={`Under 30: ${r.young}%`} thin />
                  <Bar pct={r.old} max={100} color={C.blue} tip={`65+: ${r.old}%`} thin />
                </div>
              </div>
            ))}
          </div>
          <p className="mkt-note">66% of young women feel anxious about the future most of the time. About 5,900 people aged 15–24 died by suicide in 2024; young men at 3.4 times the rate of young women.</p>
        </Chart>
      </div>

      {/* Purpose, AI, parents */}
      <h3 className="mkt-h">Purpose, AI and parents</h3>
      <div className="mkt-grid">
        <Chart title="Purpose drops after school" sub="Lack a sense of purpose" source="Gallup / Walton Family Foundation, Dec 2025">
          <Rows rows={M.PURPOSE_GAP.map((r) => ({ ...r, focus: !!r.focus }))} max={60} />
          <div className="mkt-mini-h" style={{ marginTop: 18 }}>Say their life is meaningful</div>
          <Rows rows={M.HELPING.map((r) => ({ ...r, focus: !!r.focus }))} />
          <p className="mkt-note"><b>The strongest predictor of meaning is helping others.</b> That's your Involve.</p>
        </Chart>

        <Chart title="Teens are already talking to AI" sub="Ages 13–17" source="Common Sense Media, 2025">
          <div className="mkt-meters">
            {M.AI_USE.map((r) => (
              <div key={r.label}>
                <div className="mkt-meter-top"><span>{r.label}</span><b>{r.pct}%</b></div>
                <div className="mkt-meter"><span style={{ width: `${r.pct}%` }} data-tip={`${r.label}: ${r.pct}%`} tabIndex={0} /></div>
              </div>
            ))}
          </div>
          <p className="mkt-note">40% of teens are online “almost constantly,” up from 24% a decade ago (Pew, 2025).</p>
        </Chart>

        <Chart title="Parents' #1 worry" sub="Extremely or very worried their child will struggle with anxiety or depression" source="Pew Research Center, 2023">
          <div className="mkt-big">
            <div><b>40%</b><span>of all parents</span></div>
            <div><b>48%</b><span>of lower-income parents</span></div>
          </div>
          <p className="mkt-note">It ranks ahead of bullying (35%) and physical safety.</p>
        </Chart>

        <Chart title="Fewer graduates ahead" sub="U.S. high school graduates per year" source="WICHE, Knocking at the College Door">
          <Cliff />
          <p className="mkt-note">Down about 10% by 2041. Colleges will compete harder for fewer students, so keeping the ones they have gets more valuable.</p>
        </Chart>
      </div>

      {/* What it means */}
      <h3 className="mkt-h">What it means for Story of Self</h3>
      <ol className="mkt-means">
        {M.MEANS.map(([t, d], i) => (
          <li key={t}><span className="n">{i + 1}</span><div><b>{t}</b><p>{d}</p></div></li>
        ))}
      </ol>

      <div className="mkt-size" aria-label="Rough market size: 1% of 3.8 million families at $179 is about $6.8 million a year">
        <div className="mkt-size-h">Rough market size</div>
        <div className="mkt-eq">
          <span><b>3.8M</b><small>graduating families a year</small></span>
          <i>×</i>
          <span><b>1%</b><small>buy the journey</small></span>
          <i>=</i>
          <span><b>38,000</b><small>families</small></span>
          <i>×</i>
          <span><b>$179</b><small>Story Journey</small></span>
          <i>≈</i>
          <span className="tot"><b>$6.8M</b><small>a year</small></span>
        </div>
        <p className="mkt-note">A ballpark to show scale, not a forecast.</p>
      </div>

      <p className="brief-small" style={{ marginTop: 18 }}>
        Figures come from national surveys of different years and definitions, so treat them as solid approximations.
      </p>
    </div>
  );
}
