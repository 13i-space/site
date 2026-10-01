"use client";
import { useEffect, useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../lib/story/storySupabase";
import { LESSONS, LESSON_ORDER, COMING_SOON } from "../../../lib/story/lessonSteps";

const isDone = (row) => Boolean(row && (row.completed_at || row.step === "close" || row.step === "complete"));

// The student's home base: every lesson, where they are, and what's next.
export default function MyStory() {
  const [state, setState] = useState({ status: "loading", rows: [], name: "" });

  useEffect(() => {
    if (!storyConfigured) { setState({ status: "not_configured", rows: [], name: "" }); return; }
    const sb = getStoryBrowserClient();
    (async () => {
      const { data: s } = await sb.auth.getSession();
      if (!s.session) { setState({ status: "signed_out", rows: [], name: "" }); return; }
      const { data } = await sb.from("story_progress").select("lesson, step, completed_at");
      setState({ status: "ready", rows: data || [], name: s.session.user.user_metadata?.first_name || "" });
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
  const items = LESSON_ORDER.map((id) => {
    const l = LESSONS[id];
    const row = byLesson[id];
    const unlocked = !l.requires || isDone(byLesson[l.requires]);
    let kind = "locked";
    if (isDone(row)) kind = "done";
    else if (unlocked && !foundCurrent) { kind = "current"; foundCurrent = true; }
    else if (unlocked) kind = "open";
    return { l, row, kind };
  });

  return (
    <div className="sos-narrow" style={{ padding: "40px 24px 20px" }}>
      <div className="sos-eyebrow">My story</div>
      <h1 style={{ fontSize: "clamp(34px, 6vw, 48px)" }}>{state.name ? `${state.name}, you're the lead character.` : "You're the lead character."}</h1>
      <p className="sos-lede" style={{ marginTop: 12 }}>Unit 1 · Character. Every journey begins with who you are.</p>

      <div className="sos-hub">
        {items.map(({ l, row, kind }) => (
          <a
            key={l.id}
            href={kind === "locked" ? undefined : `/story/${l.slug}`}
            className={`sos-hub-item ${kind}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <div className="sos-hub-num">{l.number}</div>
            <div className="sos-hub-body">
              <b>{l.title}</b>
              <small>{l.tagline}</small>
            </div>
            <div className="sos-hub-status">
              {kind === "done" && "Done · revisit"}
              {kind === "current" && (row ? "Continue →" : "Start →")}
              {kind === "open" && "Open →"}
              {kind === "locked" && "Locked"}
            </div>
          </a>
        ))}
        {COMING_SOON.map((c) => (
          <div key={c.number} className="sos-hub-item locked">
            <div className="sos-hub-num">{c.number}</div>
            <div className="sos-hub-body">
              <b>{c.title}</b>
              <small>{c.tagline}</small>
            </div>
            <div className="sos-hub-status">Coming soon</div>
          </div>
        ))}
      </div>
    </div>
  );
}
