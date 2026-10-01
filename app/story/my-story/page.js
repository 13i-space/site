"use client";
import { useEffect, useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../lib/story/storySupabase";
import { LESSONS, UNITS } from "../../../lib/story/lessonSteps";

const isDone = (row) => Boolean(row && (row.completed_at || row.step === "close" || row.step === "complete"));

// The student's home base: every unit and lesson, where they are, and what's next.
export default function MyStory() {
  const [state, setState] = useState({ status: "loading", rows: [], name: "" });

  useEffect(() => {
    if (!storyConfigured) { setState({ status: "not_configured", rows: [], name: "" }); return; }
    const sb = getStoryBrowserClient();
    (async () => {
      const { data: s } = await sb.auth.getSession();
      if (!s.session) { setState({ status: "signed_out", rows: [], name: "" }); return; }
      const { data } = await sb.from("story_progress").select("lesson, step, completed_at");
      setState({ status: "ready", rows: data || [], name: s.session.user.user_metadata?.first_name || "", founder: Boolean(s.session.user.app_metadata?.story_founder) });
    })();
  }, []);

  if (state.status === "loading") return <div className="sos-center">Opening your story…</div>;
  if (state.status === "not_configured") return <div className="sos-center"><p>Accounts aren't switched on yet.</p></div>;
  if (state.status === "signed_out") {
    return (
      <div className="sos-narrow sos-center">
        <div>
          <h1 style={{ fontSize: 36, marginBottom: 12 }}>Your story lives here</h1>
          <p>Sign in to see your lessons and pick up where you left off.</p>
          <a className="sos-btn" href="/story/start?next=/story/my-story">Sign in / create account</a>
        </div>
      </div>
    );
  }

  const byLesson = Object.fromEntries(state.rows.map((r) => [r.lesson, r]));
  let foundCurrent = false;
  const kindOf = (id) => {
    const l = LESSONS[id];
    const row = byLesson[id];
    const unlocked = state.founder || !l.requires || isDone(byLesson[l.requires]);
    if (isDone(row)) return "done";
    if (unlocked && !foundCurrent) { foundCurrent = true; return "current"; }
    return unlocked ? "open" : "locked";
  };
  const units = UNITS.map((u) => ({ ...u, items: u.lessons.map((id) => ({ l: LESSONS[id], row: byLesson[id], kind: kindOf(id) })) }));
  const totalDone = units.flatMap((u) => u.items).filter((x) => x.kind === "done").length;
  const total = units.flatMap((u) => u.items).length;
  const current = units.flatMap((u) => u.items).find((x) => x.kind === "current");
  const unitPage = (u) => (u.n === 1 ? "/story/unit-1" : `/story/${u.slug}`);

  return (
    <div className="sos-narrow" style={{ padding: "40px 24px 20px" }}>
      <div className="sos-eyebrow">My story · {totalDone} of {total} lessons</div>
      <h1 style={{ fontSize: "clamp(34px, 6vw, 48px)" }}>{state.name ? `${state.name}, you're the lead character.` : "You're the lead character."}</h1>
      <div className="sos-progress" aria-hidden="true"><span style={{ width: `${(totalDone / total) * 100}%` }} /></div>

      {state.founder && (
        <div className="sos-founder">
          <div>
            <b>Founder preview</b>
            <span>Every lesson is unlocked for your account, so you can open any unit in any order.</span>
          </div>
          <div className="sos-founder-links">
            <a href="/story/example">See a finished example story</a>
            <a href="/story/team">Lighthouse dashboard</a>
            <a href="/story/team/safety">Safety desk</a>
          </div>
        </div>
      )}

      <div className="sos-hub" style={{ marginTop: 18 }}>
        {current && (
          <a href={`/story/${current.l.slug}`} className="sos-hub-item current" style={{ color: "inherit", textDecoration: "none" }}>
            <div className="sos-hub-num">{current.l.number}</div>
            <div className="sos-hub-body"><small>{current.row ? "Pick up where you left off" : "Up next"} · {current.l.unit}</small><b>{current.l.title}</b></div>
            <div className="sos-hub-status">{current.row ? "Continue →" : "Start →"}</div>
          </a>
        )}
        <a href="/story/story-write" className="sos-hub-item" style={{ color: "inherit", textDecoration: "none" }}>
          <div className="sos-hub-num" style={{ background: "var(--ember-tint)", borderColor: "var(--ember)", color: "var(--ember-deep)" }}>✎</div>
          <div className="sos-hub-body"><b>My Story Write</b><small>Every piece of your story, together. Edit, then read it out loud.</small></div>
          <div className="sos-hub-status">Open →</div>
        </a>
        <a href="/story/timeline" className="sos-hub-item" style={{ color: "inherit", textDecoration: "none" }}>
          <div className="sos-hub-num" style={{ background: "#E4ECF7", borderColor: "#256abf", color: "#1d528f" }}>↗</div>
          <div className="sos-hub-body"><b>My Life Timeline</b><small>The moments that made your story, plotted above and below the line.</small></div>
          <div className="sos-hub-status">Open →</div>
        </a>
      </div>

      {units.map((u) => {
        const done = u.items.filter((x) => x.kind === "done").length;
        const started = u.items.some((x) => x.kind !== "locked");
        return (
          <section key={u.n} className="sos-unit">
            <div className="sos-unit-head">
              <div>
                <div className="sos-eyebrow" style={{ marginBottom: 2 }}>Unit {u.n} · {done}/{u.items.length}</div>
                <h2>{u.name}</h2>
                <small>{u.tagline}</small>
              </div>
              {done > 0 && <a href={unitPage(u)} className="sos-unit-link">{u.n === 1 ? "My Character" : `Unit ${u.n} cards`} →</a>}
            </div>
            {started || done ? (
              <div className="sos-hub">
                {u.items.map(({ l, row, kind }) => (
                  <a key={l.id} href={kind === "locked" ? undefined : `/story/${l.slug}`} className={`sos-hub-item ${kind}`} style={{ color: "inherit", textDecoration: "none" }}>
                    <div className="sos-hub-num">{l.number}</div>
                    <div className="sos-hub-body"><b>{l.title}</b><small>{l.tagline}</small></div>
                    <div className="sos-hub-status">
                      {kind === "done" && "Done · revisit"}
                      {kind === "current" && (row ? "Continue →" : "Start →")}
                      {kind === "open" && "Open →"}
                      {kind === "locked" && "Locked"}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="sos-unit-locked">{u.items.length} lessons · opens after Unit {u.n - 1}</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
