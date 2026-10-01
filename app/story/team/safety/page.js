"use client";
import { useEffect, useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../../lib/story/storySupabase";

const LABEL = { new: "New", contacted: "Reached out", resolved: "Resolved" };
const when = (iso) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function Alert({ a, token, onSaved }) {
  const [note, setNote] = useState(a.team_note || "");
  const [busy, setBusy] = useState(false);
  async function set(status) {
    setBusy(true);
    await fetch("/api/story/team/safety", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: a.id, status, note }) });
    setBusy(false);
    onSaved();
  }
  return (
    <article className={`sd-alert ${a.status}`}>
      <div className="sd-alert-top">
        <span className={`sd-pill ${a.status}`}>{LABEL[a.status]}</span>
        <b>{a.first_name || "A student"}</b>
        <span className="sd-muted">{a.email}</span>
        <span className="sd-muted sd-when">{when(a.created_at)}</span>
      </div>
      <div className="sd-lesson">{a.lesson_title || a.lesson}</div>
      {a.excerpt && <blockquote className="sd-excerpt">{a.excerpt}</blockquote>}
      <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Team note: who reached out, how, and what happened" aria-label="Team note" />
      <div className="sd-actions">
        <button type="button" className="sos-btn ghost" disabled={busy} onClick={() => set("contacted")}>Mark reached out</button>
        <button type="button" className="sos-btn" disabled={busy} onClick={() => set("resolved")}>Mark resolved</button>
        {a.reviewed_by && <span className="sd-muted">Last update: {a.reviewed_by}, {when(a.reviewed_at)}</span>}
      </div>
    </article>
  );
}

export default function SafetyDesk() {
  const [state, setState] = useState({ status: "loading", alerts: [], token: null });
  const [filter, setFilter] = useState("open");

  async function load(token) {
    const res = await fetch("/api/story/team/safety", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) return setState({ status: "signed_out", alerts: [], token });
    if (res.status === 404) return setState({ status: "not_found", alerts: [], token });
    if (!res.ok) return setState({ status: data.error || "error", alerts: [], token });
    setState({ status: "ready", alerts: data.alerts || [], token });
  }

  useEffect(() => {
    if (!storyConfigured) { setState({ status: "not_configured", alerts: [] }); return; }
    getStoryBrowserClient().auth.getSession().then(({ data }) => {
      if (!data.session) return setState({ status: "signed_out", alerts: [] });
      load(data.session.access_token);
    });
  }, []);

  const { status, alerts, token } = state;
  if (status === "loading") return <div className="sos-center">Opening the Safety desk…</div>;
  if (status === "signed_out") return <div className="sos-center"><a className="sos-btn" href="/story/start?next=/story/team/safety">Sign in</a></div>;
  if (status === "not_found") return <div className="sos-center"><p>This page isn't part of your story.</p></div>;
  if (status !== "ready") {
    const why = status === "no_admin_key" ? "Add STORY_SUPABASE_SERVICE_ROLE_KEY in Vercel." : status === "no_table" ? "Run supabase/v5.30-story-founders-safety.sql in the Story of Self project." : "Try again in a moment.";
    return <div className="sos-center"><p>The Safety desk isn't set up yet. {why}</p></div>;
  }

  const open = alerts.filter((a) => a.status !== "resolved");
  const shown = filter === "open" ? open : alerts;
  return (
    <div className="sd">
      <div className="sd-head">
        <div>
          <div className="sos-eyebrow"><a href="/story/team">← Lighthouse</a> · founders only</div>
          <h1>Safety desk</h1>
          <p>When a Story Champion flags that a student may not be safe, it appears here. A real person follows up.</p>
        </div>
        <div className="sd-count"><b>{alerts.filter((a) => a.status === "new").length}</b><span>new</span></div>
      </div>

      <div className="sd-guide">
        <b>When you follow up</b>
        <ol>
          <li>Reach out the same day, warmly, by email: you noticed things felt hard, and you care.</li>
          <li>Share 988 (call or text) and Crisis Text Line (text HOME to 741741). In immediate danger, 911.</li>
          <li>Encourage a trusted adult: family, a counselor, a doctor.</li>
          <li>Write a note here, then mark it. Never carry it alone: talk it through with the team.</li>
        </ol>
      </div>

      <div className="sd-tabs" role="tablist">
        <button type="button" className={filter === "open" ? "on" : ""} onClick={() => setFilter("open")}>Open ({open.length})</button>
        <button type="button" className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>All ({alerts.length})</button>
      </div>

      {shown.length === 0 ? (
        <div className="sd-empty">No {filter === "open" ? "open " : ""}alerts. That's the best kind of empty.</div>
      ) : (
        shown.map((a) => <Alert key={a.id} a={a} token={token} onSaved={() => load(token)} />)
      )}
    </div>
  );
}
