import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabaseServer";
import { isSentinelUser } from "../../../lib/sentinel";
import { gatherSentinelData } from "../../../lib/sentinelData";
import { eventsBetween, KINDS } from "../../../lib/siteCalendar";
import { versionInfo } from "../../../lib/version";

// Sentinel-X: the site dashboard. Only the usernames in lib/sentinel.js can
// open it - everyone else gets an ordinary 404, so the page doesn't
// advertise that it exists. Always rendered fresh, never cached.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Sentinel-X", robots: { index: false, follow: false } };

const GAME_NAMES = {
  "nemesis-command": "NEMESIS Command",
  "asteroid-belt": "Asteroid Belt",
  "13i-vs-nemesis": "13i vs NEMESIS",
  "deep-signal": "13i: The Deep Signal",
  sixteen: "SIXTEEN",
  tacet: "TACET",
  prism: "PRISM",
  rubato: "RUBATO",
};

function ago(iso) {
  if (!iso) return "—";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
const fmt = (n) => (n === null || n === undefined ? "—" : n.toLocaleString());

function Panel({ title, children, span }) {
  return (
    <div className="panel" style={{ ...styles.panel, gridColumn: span ? "1 / -1" : undefined }}>
      <div className="mono" style={styles.panelTitle}>{title}</div>
      {children}
    </div>
  );
}

function Tile({ label, value, note }) {
  return (
    <div style={styles.tile}>
      <div className="mono" style={styles.tileLabel}>{label}</div>
      <div style={styles.tileValue}>{fmt(value)}</div>
      {note && <div className="mono" style={styles.tileNote}>{note}</div>}
    </div>
  );
}

// Beta sign-ups from the countdown page, newest first (Update 5.57).
function BetaList({ b }) {
  if (!b) {
    return (
      <Panel title="BETA SIGN-UPS" span>
        <p style={styles.muted}>Unavailable - run docs/v5.55-beta-and-kinbook.sql (section 1) in Supabase.</p>
      </Panel>
    );
  }
  const all = b.list.map((r) => r.email).join(", ");
  return (
    <Panel title="BETA SIGN-UPS" span>
      <div style={styles.tiles}>
        <Tile label="BETA KIN WAITING" value={b.total} note={`${fmt(b.week)} this week`} />
      </div>
      {b.list.length ? (
        <>
          <div style={{ marginTop: 14, maxHeight: 360, overflowY: "auto" }}>
            {b.list.map((r) => (
              <div key={r.email} style={styles.row}>
                <span style={{ minWidth: 0 }}>
                  <a href={`mailto:${r.email}`} style={{ color: "#B9C0FF" }}>{r.email}</a>
                  {r.name && <span style={{ color: "#8A8FBF" }}> · {r.name}</span>}
                  {r.why && <span style={{ display: "block", fontSize: 12, color: "#8A8FBF", marginTop: 2 }}>&ldquo;{r.why}&rdquo;</span>}
                </span>
                <span className="mono" style={styles.rowRight}>{ago(r.created_at)}</span>
              </div>
            ))}
          </div>
          <details style={{ marginTop: 12 }}>
            <summary className="mono" style={{ fontSize: 10.5, letterSpacing: "1px", color: "#6E76B8", cursor: "pointer" }}>ALL EMAILS, READY TO COPY</summary>
            <textarea readOnly value={all} style={{ width: "100%", minHeight: 80, marginTop: 8, background: "#0E1026", color: "#C7CAE8", border: "1px solid #21244A", borderRadius: 4, padding: 8, fontSize: 12 }} />
          </details>
        </>
      ) : (
        <p style={{ ...styles.muted, marginTop: 12 }}>No requests yet. They&rsquo;ll appear here as people ask from the countdown page.</p>
      )}
    </Panel>
  );
}

function Unavailable() {
  return <p style={styles.muted}>Unavailable right now.</p>;
}

// Sign-ups per day: one series, so no legend; each bar's tooltip gives
// its date and count.
function SignupBars({ perDay }) {
  const max = Math.max(1, ...perDay.map((d) => d.n));
  const total = perDay.reduce((a, d) => a + d.n, 0);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 90, borderBottom: "1px solid #262A55" }} role="img" aria-label={`${total} sign-ups in the last 30 days`}>
        {perDay.map((d) => (
          <div
            key={d.day}
            title={`${new Date(d.day + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}: ${d.n} sign-up${d.n === 1 ? "" : "s"}`}
            style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end", cursor: "default" }}
          >
            <div style={{ width: "100%", height: d.n ? `${Math.max(6, (d.n / max) * 100)}%` : 2, background: d.n ? "#8B95F6" : "#21244A", borderRadius: "4px 4px 0 0" }} />
          </div>
        ))}
      </div>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#565B8F", marginTop: 6 }}>
        <span>30 days ago</span>
        <span>peak {max} / day</span>
        <span>today</span>
      </div>
    </div>
  );
}

function PeopleList({ people, empty }) {
  if (!people || people.length === 0) return <p style={styles.muted}>{empty}</p>;
  return people.map((p, i) => (
    <div key={i} style={styles.row}>
      <span style={{ minWidth: 0 }}>
        {p.name ? (
          <Link href={`/kin/${p.name}`} style={{ color: "#B9C0FF" }}>{p.name}</Link>
        ) : (
          <span style={{ color: "#8A8FBF" }}>no username yet</span>
        )}
        <span className="mono" style={{ display: "block", fontSize: 10.5, color: "#565B8F", overflow: "hidden", textOverflow: "ellipsis" }}>{p.email}</span>
      </span>
      <span className="mono" style={styles.rowRight}>{ago(p.at)}</span>
    </div>
  ));
}

export default async function SentinelX() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
  if (!isSentinelUser(profile?.username)) notFound();

  const d = await gatherSentinelData();

  if (!d.configured) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="page-title">Sentinel-X</div>
        <div className="panel">
          <p style={{ margin: 0, color: "#B7BADF" }}>
            Sentinel-X reads the site&rsquo;s data with Supabase&rsquo;s service key, which isn&rsquo;t set up on this deployment.
            Add <span className="mono">SUPABASE_URL</span> and <span className="mono">SUPABASE_SERVICE_ROLE_KEY</span> in
            Vercel &rarr; Settings &rarr; Environment Variables, then redeploy.
          </p>
        </div>
      </div>
    );
  }

  return <SentinelView d={d} />;
}

function SentinelView({ d }) {
  const a = d.accounts;
  const c = d.content;
  const weekNote = (x) => (x && x.week !== null ? `+${x.week} this week` : null);

  return (
    <div>
      <div className="page-title">Sentinel-X</div>
      <div className="page-subtitle">
        watching 13i.space &middot; as of {new Date(d.generatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} &middot; refresh for the latest
      </div>
      <p className="mono" style={{ textAlign: "center", fontSize: 11, marginTop: -8, marginBottom: 20 }}>
        {/* the look-lab previews are gated to Sentinel accounts in middleware.js */}
        <Link href="/preview" style={{ color: "#6E76B8" }}>look-lab previews &rarr;</Link>
      </p>

      <VersionStrip />

      <div style={styles.grid}>
        <NextSevenDays />
        <ClaudeUsage c={d.claude} />
        <BetaList b={d.beta} />

        <Panel title="KIN" span>
          {a ? (
            <>
              <div style={styles.tiles}>
                <Tile label="ACCOUNTS" value={a.total} note={`${fmt(a.confirmed)} confirmed email`} />
                <Tile label="WITH A USERNAME" value={a.withUsername} />
                <Tile label="NEW THIS WEEK" value={a.new7} note={`${fmt(a.new30)} in 30 days`} />
                <Tile label="SIGNED IN TODAY" value={a.active1} note={`${fmt(a.active7)} this week · ${fmt(a.active30)} in 30 days`} />
                <Tile label="EMAIL LIST" value={d.subscribers} note={d.subscribers === null ? "Buttondown not reachable" : "Buttondown subscribers"} />
              </div>
              <div className="mono" style={{ ...styles.panelTitle, marginTop: 22 }}>SIGN-UPS, LAST 30 DAYS</div>
              <SignupBars perDay={a.perDay} />
            </>
          ) : (
            <p style={styles.muted}>Account data unavailable - Supabase didn&rsquo;t return the user list.</p>
          )}
        </Panel>

        <Panel title="MOST RECENT SIGN-INS">
          {a ? <PeopleList people={a.recentLogins} empty="Nobody yet." /> : <Unavailable />}
        </Panel>

        <Panel title="NEWEST KIN">
          {a ? <PeopleList people={a.recentSignups} empty="Nobody yet." /> : <Unavailable />}
        </Panel>

        <Panel title="CONTENT" span>
          <div style={styles.tiles}>
            <Tile label="FORUM THREADS" value={c.threads?.total} note={weekNote(c.threads)} />
            <Tile label="FORUM REPLIES" value={c.replies?.total} note={weekNote(c.replies)} />
            <Tile label="KINBOOK" value={c.guestbook?.total} note={weekNote(c.guestbook)} />
            <Tile label="ALIEN SPECIES" value={c.species?.total} note={weekNote(c.species)} />
            <Tile
              label="ASSIGNMENTS"
              value={c.submissions?.total}
              note={c.submissions ? Object.entries(c.submissions.by).map(([k, v]) => `${v} ${k}`).join(" · ") : null}
            />
            <Tile label="DRAFTS IN PROGRESS" value={c.drafts} />
          </div>
        </Panel>

        <Panel title="STORIES READ">
          {d.reading ? (
            d.reading.stories.length ? (
              d.reading.stories.map((s) => (
                <div key={s.n} style={styles.row}>
                  <Link href={s.n === 1 ? "/assignments/0000001" : `/assignments/${s.n}`} style={{ color: "#B9C0FF" }}>{s.title}</Link>
                  <span className="mono" style={styles.rowRight}>{s.readers} reader{s.readers === 1 ? "" : "s"}</span>
                </div>
              ))
            ) : (
              <p style={styles.muted}>No reads recorded yet.</p>
            )
          ) : (
            <Unavailable />
          )}
        </Panel>

        <Panel title="GAMES">
          {d.games ? (
            d.games.length ? (
              d.games.map((g) => (
                <div key={g.game} style={{ ...styles.row, alignItems: "flex-start" }}>
                  <span>
                    <span style={{ color: "#D9DCFF" }}>{GAME_NAMES[g.game] || g.game}</span>
                    <span className="mono" style={{ display: "block", fontSize: 10.5, color: "#565B8F" }}>
                      {g.top ? `record ${g.top.score.toLocaleString()} by ${g.top.name}` : "no scores yet"}
                      {g.todayPlayers ? ` · ${g.todayPlayers} on today's board` : ""}
                    </span>
                  </span>
                  <span className="mono" style={styles.rowRight}>
                    {fmt(g.plays)} plays
                    <span style={{ display: "block", color: "#565B8F" }}>{fmt(g.players)} player{g.players === 1 ? "" : "s"}</span>
                  </span>
                </div>
              ))
            ) : (
              <p style={styles.muted}>No plays recorded yet.</p>
            )
          ) : (
            <Unavailable />
          )}
        </Panel>

        <Panel title="LATEST ACTIVITY" span>
          {d.feed && d.feed.length ? (
            d.feed.map((f, i) => (
              <div key={i} style={styles.row}>
                <span style={{ minWidth: 0 }}>
                  <span className="mono" style={{ fontSize: 10, color: "#C9B98F", letterSpacing: "1px", marginRight: 10 }}>{f.kind.toUpperCase()}</span>
                  <span style={{ color: "#B7BADF" }}>{f.text}</span>
                </span>
                <span className="mono" style={styles.rowRight}>{ago(f.at)}</span>
              </div>
            ))
          ) : (
            <p style={styles.muted}>Nothing yet.</p>
          )}
        </Panel>

        <Panel title="CONNECTED SERVICES" span>
          {d.services.map((s) => (
            <div key={s.name} style={styles.row}>
              <span style={{ color: "#D9DCFF" }}>{s.name}</span>
              <span className="mono" style={{ ...styles.rowRight, color: s.ok ? "#8B95F6" : "#C97B6E" }}>
                {s.ok ? "✓ " : "✕ "}{s.note}
              </span>
            </div>
          ))}
          <p style={{ ...styles.muted, marginTop: 14 }}>
            Page views and visitor counts aren&rsquo;t tracked by the site itself. Vercel&rsquo;s built-in Web
            Analytics can add them (Vercel project &rarr; Analytics) without a new service.
          </p>
        </Panel>
      </div>
    </div>
  );
}

// the site's version and where it came from (lib/version.js)
function VersionStrip() {
  const v = versionInfo();
  return (
    <div className="mono" style={styles.versionStrip}>
      <span style={{ color: "#E9D29A" }}>VER {v.version}</span>
      {v.commit && <span>commit {v.commit}</span>}
      {v.message && <span style={{ color: "#8A8FBF" }}>{v.message}</span>}
      <span>{v.env}{v.branch && v.branch !== "main" ? ` · ${v.branch}` : ""}</span>
    </div>
  );
}

// the next seven days on the calendar (lib/siteCalendar.js)
function NextSevenDays() {
  const start = new Date();
  const end = new Date(start.getTime() + 6 * 86400000);
  const events = eventsBetween(start, end);
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * 86400000).toISOString().slice(0, 10));
  return (
    <Panel title="NEXT SEVEN DAYS" span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14, alignItems: "center" }}>
        {Object.entries(KINDS).map(([k, v]) => (
          <span key={k} className="mono" style={{ fontSize: 10, color: "#8A8FBF", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: v.color, display: "inline-block" }} /> {v.label.toUpperCase()}
          </span>
        ))}
        <Link href="/sentinel-x/calendar" className="mono" style={styles.calButton}>OPEN THE 2027 CALENDAR &rarr;</Link>
      </div>
      <div style={styles.week}>
        {days.map((d) => {
          const ev = events.filter((e) => e.date === d);
          return (
            <div key={d} style={styles.weekDay}>
              <div className="mono" style={{ fontSize: 10, color: "#6E76B8", letterSpacing: "1px", marginBottom: 6 }}>
                {new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }).toUpperCase()}
              </div>
              {ev.length ? ev.map((e, i) => (
                <div key={i} title={e.note} style={{ ...styles.weekChip, borderLeftColor: KINDS[e.kind].color }}>{e.title}</div>
              )) : <div style={{ fontSize: 12, color: "#3A3E75" }}>&mdash;</div>}
            </div>
          );
        })}
      </div>
      {!events.length && <p style={{ ...styles.muted, marginTop: 10 }}>Nothing scheduled yet. The calendar starts on January 1, 2027, with the beta.</p>}
    </Panel>
  );
}

const usd = (n) => (n === null || n === undefined ? "—" : `$${n < 10 ? n.toFixed(2) : n.toFixed(0)}`);

// what the site spends on Claude (lib/apiUsage.js), and where the rest lives
function ClaudeUsage({ c }) {
  return (
    <Panel title="CLAUDE USAGE" span>
      {c ? (
        <>
          <div style={styles.tiles}>
            <Tile label="TODAY" value={usd(c.today)} />
            <Tile label="THIS WEEK" value={usd(c.week)} note={`${c.weekCalls.toLocaleString()} calls · since Monday`} />
            <Tile label="THIS MONTH" value={usd(c.month)} note={`${c.monthCalls.toLocaleString()} calls`} />
            <Tile label="BUDGET LEFT" value={c.budgetLeft === null ? "set a budget" : usd(c.budgetLeft)} note={c.budget ? `of ${usd(c.budget)} this month` : "CLAUDE_MONTHLY_BUDGET_USD"} />
            <Tile label="CREDIT LEFT" value={c.creditLeft === null ? "—" : usd(c.creditLeft)} note={c.credit ? `of ${usd(c.credit)} loaded ${c.creditSince}` : "CLAUDE_CREDIT_USD + _SINCE"} />
          </div>
          {c.budget && (
            <div style={styles.bar}><div style={{ ...styles.barFill, width: `${Math.min(100, (c.month / c.budget) * 100)}%`, background: c.month > c.budget * 0.85 ? "#C97B6E" : "#8B95F6" }} /></div>
          )}
          {c.byFeature.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {c.byFeature.map(([f, v]) => (
                <div key={f} style={styles.row}>
                  <span style={{ color: "#D9DCFF" }}>{f}</span>
                  <span className="mono" style={styles.rowRight}>{v.calls.toLocaleString()} calls · {usd(v.cost)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p style={styles.muted}>No usage recorded yet. Run docs/v5.56-api-usage.sql in Supabase and every Claude call the site makes will show up here.</p>
      )}
      <p style={{ ...styles.muted, marginTop: 14, lineHeight: 1.6 }}>
        These are the site&rsquo;s own calls, estimated from Anthropic&rsquo;s published prices. Your Claude plan&rsquo;s weekly limit
        (the Claude app and Claude Code) and your API credit balance aren&rsquo;t available to the site; open them directly:
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        <a href="https://claude.ai/settings/usage" target="_blank" rel="noopener noreferrer" className="mono" style={styles.calButton}>CLAUDE PLAN · WEEKLY USAGE &#8599;</a>
        <a href="https://console.anthropic.com/settings/billing" target="_blank" rel="noopener noreferrer" className="mono" style={styles.calButton}>API CREDIT BALANCE &#8599;</a>
      </div>
    </Panel>
  );
}

const styles = {
  versionStrip: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, fontSize: 10.5, letterSpacing: "1px", color: "#6E76B8", margin: "-6px 0 18px" },
  calButton: { marginLeft: "auto", fontSize: 10.5, letterSpacing: "1.5px", color: "#14163A", background: "linear-gradient(135deg, #E9D29A, #B9C0FF)", borderRadius: 999, padding: "7px 14px", textDecoration: "none" },
  week: { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8 },
  weekDay: { border: "1px solid #21244A", borderRadius: 6, padding: 10, minHeight: 90 },
  weekChip: { fontSize: 11.5, color: "#DCDFFF", borderLeft: "3px solid", padding: "2px 6px", marginBottom: 4, background: "rgba(38,42,85,0.4)", borderRadius: 3 },
  bar: { height: 6, background: "#14163A", borderRadius: 3, overflow: "hidden", marginTop: 12 },
  barFill: { height: "100%" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 },
  panel: { margin: 0 },
  panelTitle: { fontSize: 10, color: "#565B8F", letterSpacing: "1.5px", marginBottom: 12 },
  tiles: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 },
  tile: { border: "1px solid #21244A", borderRadius: 4, padding: "12px 14px" },
  tileLabel: { fontSize: 9.5, color: "#6E76B8", letterSpacing: "1px" },
  tileValue: { fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 30, color: "#DCDFFF", lineHeight: 1.2, marginTop: 4 },
  tileNote: { fontSize: 10, color: "#565B8F", marginTop: 4, lineHeight: 1.5 },
  row: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5, padding: "7px 0", borderBottom: "1px solid #21244A" },
  rowRight: { fontSize: 11, color: "#8A8FBF", textAlign: "right", flexShrink: 0 },
  muted: { fontSize: 13, color: "#565B8F", margin: 0 },
};
