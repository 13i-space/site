"use client";
import { useCallback, useEffect, useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../lib/story/storySupabase";

// The Lighthouse: the founders' dashboard for Story of Self (Aaron's Sentinel-X).
// Founder accounts only; everyone else sees a plain "not found".

const fmt = (n) => (n === null || n === undefined ? "—" : Number(n).toLocaleString());
function ago(iso) {
  if (!iso) return "—";
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
const dayLabel = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function Panel({ title, action, children, wide, className = "" }) {
  return (
    <section className={`lh-panel${wide ? " wide" : ""} ${className}`}>
      <div className="lh-panel-head"><h2>{title}</h2>{action}</div>
      {children}
    </section>
  );
}
function Tile({ label, value, note, tone }) {
  return (
    <div className={`lh-tile${tone ? ` ${tone}` : ""}`}>
      <span>{label}</span>
      <b>{fmt(value)}</b>
      {note && <small>{note}</small>}
    </div>
  );
}
function Off({ children = "Not available yet." }) { return <p className="lh-muted">{children}</p>; }

// One series per chart, so no legend: the title names it and each bar's tooltip gives date and count.
function Bars({ data, color = "#C25B34", unit, height = 96 }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  const total = data.reduce((a, d) => a + d.n, 0);
  return (
    <div>
      <div className="lh-bars" style={{ height }} role="img" aria-label={`${total} ${unit} in the last ${data.length} days`}>
        {data.map((d) => (
          <div key={d.day} className="lh-bar" title={`${dayLabel(d.day)}: ${d.n} ${d.n === 1 ? unit.replace(/s$/, "") : unit}`}>
            <i style={{ height: d.n ? `${Math.max(6, (d.n / max) * 100)}%` : 2, background: d.n ? color : "#EADFD2" }} />
          </div>
        ))}
      </div>
      <div className="lh-bars-axis"><span>{dayLabel(data[0].day)}</span><span>{total} total · peak {max}/day</span><span>today</span></div>
    </div>
  );
}

function Journey({ j }) {
  const max = Math.max(1, ...j.units.flatMap((u) => u.lessons.map((l) => l.started)));
  return (
    <div>
      <div className="lh-legend">
        <span><i style={{ background: "#F0C7B1" }} />Started</span>
        <span><i style={{ background: "#C25B34" }} />Finished</span>
      </div>
      {j.units.map((u) => (
        <div key={u.n} className="lh-unit">
          <div className="lh-unit-name">Unit {u.n} · {u.name}</div>
          {u.lessons.map((l) => (
            <div key={l.id} className="lh-fun" title={`Lesson ${l.number}, ${l.title}: ${l.started} started, ${l.done} finished`}>
              <span className="lh-fun-l"><b>{l.number}</b> {l.title}</span>
              <span className="lh-fun-track">
                <i className="s" style={{ width: `${(l.started / max) * 100}%` }} />
                <i className="d" style={{ width: `${(l.done / max) * 100}%` }} />
              </span>
              <span className="lh-fun-n">{l.started ? `${l.done}/${l.started}` : "—"}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Lighthouse() {
  const [state, setState] = useState({ status: "loading" });
  const [token, setToken] = useState(null);
  const [filter, setFilter] = useState("");

  const load = useCallback(async (t) => {
    setState((s) => (s.status === "ready" ? { ...s, refreshing: true } : s));
    const res = await fetch("/api/story/team/overview", { headers: { Authorization: `Bearer ${t}` }, cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) return setState({ status: "signed_out" });
    if (res.status === 404) return setState({ status: "not_found" });
    if (!res.ok || !data.configured) return setState({ status: data.error || "no_admin_key" });
    setState({ status: "ready", d: data });
  }, []);

  useEffect(() => {
    if (!storyConfigured) { setState({ status: "not_configured" }); return; }
    getStoryBrowserClient().auth.getSession().then(({ data }) => {
      if (!data.session) return setState({ status: "signed_out" });
      setToken(data.session.access_token);
      load(data.session.access_token);
    });
  }, [load]);

  async function exportCsv() {
    const res = await fetch("/api/story/team/overview?export=waitlist", { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return;
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url; a.download = `story-launch-list-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  const { status, d } = state;
  if (status === "loading") return <div className="sos-center">Lighting the Lighthouse…</div>;
  if (status === "signed_out") return <div className="sos-center"><a className="sos-btn" href="/story/start?next=/story/team">Sign in</a></div>;
  if (status === "not_found" || status === "not_configured") return <div className="sos-center"><p>This page could not be found.</p></div>;
  if (status !== "ready") {
    return (
      <div className="sos-narrow sos-center">
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 10 }}>The Lighthouse needs its key</h1>
          <p>Add <code>STORY_SUPABASE_SERVICE_ROLE_KEY</code> in Vercel → Settings → Environment Variables, then redeploy.</p>
        </div>
      </div>
    );
  }

  const s = d.students, j = d.journey, w = d.list, c = d.conversations, a = d.academy, sf = d.safety;
  const people = (s?.list || []).filter((p) => !filter || `${p.name} ${p.email}`.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="lh">
      <header className="lh-top">
        <div>
          <div className="sos-eyebrow">Story of Self · Founders</div>
          <h1>Lighthouse</h1>
          <p className="lh-sub">Watching over every story · as of {new Date(d.generatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</p>
        </div>
        <div className="lh-top-actions">
          <button className="sos-btn ghost" onClick={() => load(token)} disabled={state.refreshing}>{state.refreshing ? "Refreshing…" : "↻ Refresh"}</button>
          <a className={`sos-btn${sf?.open ? "" : " ghost"}`} href="/story/team/safety">Safety desk{sf?.open ? ` · ${sf.open} new` : ""}</a>
        </div>
      </header>

      {sf?.open > 0 && (
        <a className="lh-alert" href="/story/team/safety">
          <b>{sf.open} safety alert{sf.open === 1 ? "" : "s"} waiting.</b> A student may need a real person to check in. Open the Safety desk →
        </a>
      )}

      <div className="lh-tiles">
        <Tile label="Students" value={s?.total} note={s ? `${fmt(s.founders)} founder account${s.founders === 1 ? "" : "s"} not counted` : null} />
        <Tile label="New this week" value={s?.new7} note={s ? `${fmt(s.new30)} in 30 days` : null} />
        <Tile label="Active this week" value={s?.active7} note={s ? `${fmt(s.active1)} today · ${fmt(s.active30)} in 30 days` : null} />
        <Tile label="Lessons finished" value={j?.lessonsDone} note={j ? `${fmt(j.finished)} finished the whole journey` : null} />
        <Tile label="Stories being written" value={j?.writing} note={j ? `${fmt(j.timelines)} life timelines` : null} />
        <Tile label="Launch list" value={w?.total} note={w ? `+${fmt(w.week)} this week` : "run the v5.32 SQL"} tone="ember" />
        <Tile label="Champions in training" value={a?.trainees} note={a ? `${fmt(a.certs)} certified` : null} />
        <Tile label="Student messages" value={c?.total} note={c?.week !== null && c?.week !== undefined ? `${fmt(c.week)} this week` : null} />
      </div>

      <div className="lh-grid">
        <Panel title="New students, last 30 days">{s ? <Bars data={s.perDay} unit="sign-ups" /> : <Off />}</Panel>
        <Panel title="Launch list, last 30 days">{w ? <Bars data={w.perDay} unit="joins" color="#256abf" /> : <Off>Run supabase/v5.32-story-waitlist.sql to open the list.</Off>}</Panel>

        <Panel title="The journey: how far students get" wide>{j ? <Journey j={j} /> : <Off />}</Panel>

        <Panel title="Students" wide action={<input className="lh-search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search name or email" aria-label="Search students" />}>
          {s ? (
            people.length ? (
              <div className="lh-table-wrap">
                <table className="lh-table">
                  <thead><tr><th>Student</th><th>Where they are</th><th>Progress</th><th>Joined</th><th>Last active</th></tr></thead>
                  <tbody>
                    {people.map((p, i) => (
                      <tr key={i}>
                        <td><b>{p.name || "—"}</b>{p.founder && <span className="lh-tag">founder</span>}<small>{p.email}</small></td>
                        <td>{p.current}{(p.writing || p.timeline) && <small>{[p.timeline && "timeline", p.writing && "writing their story"].filter(Boolean).join(" · ")}</small>}</td>
                        <td><span className="lh-prog" title={`${p.done} of 22 lessons`}><i style={{ width: `${(p.done / 22) * 100}%` }} /></span><small>{p.done} / 22</small></td>
                        <td>{ago(p.joined)}</td>
                        <td>{ago(p.lastActive)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <Off>{filter ? "No one matches that search." : "No students yet. They're coming."}</Off>
          ) : <Off />}
          <p className="lh-note">The Lighthouse shows progress, never what students write. Their words stay theirs.</p>
        </Panel>

        <Panel title="The launch list" action={w ? <button className="lh-link" onClick={exportCsv}>Export CSV ↓</button> : null}>
          {w ? (
            <>
              <div className="lh-chips">{w.byRole.length ? w.byRole.map((r) => <span key={r.k}>{r.label} <b>{r.n}</b></span>) : <span>No one yet</span>}</div>
              {w.byYear.length > 0 && <div className="lh-chips soft">{w.byYear.map((y) => <span key={y.k}>Class of {y.k} <b>{y.n}</b></span>)}</div>}
              {w.sharers.length > 0 && (
                <>
                  <div className="lh-mini">Top sharers</div>
                  {w.sharers.map((x, i) => <div key={i} className="lh-row"><span>{x.who}</span><span>{x.n} joined from their link</span></div>)}
                </>
              )}
              <div className="lh-mini">Newest</div>
              {w.latest.length ? w.latest.map((x, i) => (
                <div key={i} className="lh-row"><span><b>{x.name || x.email}</b>{x.name && <small>{x.email}</small>}</span><span>{x.role}{x.year ? ` · ${x.year}` : ""} · {ago(x.at)}</span></div>
              )) : <Off>No one yet. Share <a href="/story/waitlist">/story/waitlist</a>.</Off>}
            </>
          ) : <Off>Run supabase/v5.32-story-waitlist.sql to open the list.</Off>}
        </Panel>

        <Panel title="Champion conversations, last 14 days">
          {c?.perDay ? <Bars data={c.perDay} unit="student messages" height={80} /> : <Off />}
          <p className="lh-note">Each bar counts the messages students sent their AI Champion that day.</p>
        </Panel>

        <Panel title="Champion Academy">
          {a ? (
            <div className="lh-kv">
              <div><span>In training</span><b>{fmt(a.trainees)}</b></div>
              <div><span>Finished Level 1</span><b>{fmt(a.level1)}</b></div>
              <div><span>Certificates issued</span><b>{fmt(a.certs)}</b></div>
              <div><span>Want to join the Champion pool</span><b>{fmt(a.pool)}</b></div>
              <div><span>Waiting for full certification</span><b>{fmt(a.full)}</b></div>
              <div><span>AI mentor & practice messages, 30 days</span><b>{fmt(a.aiMonth)}</b></div>
            </div>
          ) : <Off />}
        </Panel>

        <Panel title="Safety">
          {sf ? (
            <div className="lh-kv">
              <div className={sf.open ? "hot" : ""}><span>New, not yet reached</span><b>{fmt(sf.open)}</b></div>
              <div><span>Reached out</span><b>{fmt(sf.contacted)}</b></div>
              <div><span>Resolved</span><b>{fmt(sf.resolved)}</b></div>
            </div>
          ) : <Off>Run supabase/v5.30-story-founders-safety.sql.</Off>}
          <a className="lh-link" href="/story/team/safety">Open the Safety desk →</a>
        </Panel>

        <Panel title="Messages from the contact form" wide>
          {d.contact ? (d.contact.length ? d.contact.map((m, i) => (
            <div key={i} className="lh-msg">
              <div><b>{m.name}</b> <a href={`mailto:${m.email}`}>{m.email}</a>{m.topic && <span className="lh-tag">{m.topic}</span>}<span className="lh-when">{ago(m.created_at)}</span></div>
              <p>{String(m.message || "").slice(0, 220)}{String(m.message || "").length > 220 ? "…" : ""}</p>
            </div>
          )) : <Off>No messages yet.</Off>) : <Off />}
        </Panel>

        <Panel title="Latest activity" wide>
          {d.feed?.length ? d.feed.map((f, i) => (
            <div key={i} className={`lh-feed${f.alert ? " hot" : ""}`}>
              <span className="lh-kind">{f.kind}</span>
              <span className="lh-feed-t">{f.text}</span>
              <span className="lh-when">{ago(f.at)}</span>
            </div>
          )) : <Off>Nothing yet.</Off>}
        </Panel>

        <Panel title="Connected services" wide>
          {d.services.map((x) => (
            <div key={x.name} className="lh-row"><span>{x.name}</span><span className={x.ok ? "ok" : "no"}>{x.ok ? "✓" : "○"} {x.note}</span></div>
          ))}
          <p className="lh-note">Page views and visitors aren't tracked by the site. Vercel's Web Analytics can add them without a new service.</p>
        </Panel>
      </div>

      <footer className="lh-foot">
        <a href="/story/my-story">My story (founder preview)</a>
        <a href="/story/example">Example story</a>
        <a href="/story/waitlist">Launch list page</a>
        <a href="/story/academy">Champion Academy</a>
      </footer>
    </div>
  );
}
