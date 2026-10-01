"use client";
import { useEffect, useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../lib/story/storySupabase";
import { LESSONS } from "../../../lib/story/lessonSteps";
import LessonCard from "./LessonCard";

const isDone = (row) => Boolean(row && (row.completed_at || row.step === "close" || row.step === "complete"));

// A unit's lesson cards, all on one page (Units 2–7).
export default function UnitSummary({ unit }) {
  const [s, setS] = useState({ status: "loading", rows: {}, name: "" });

  useEffect(() => {
    if (!storyConfigured) { setS({ status: "not_configured", rows: {}, name: "" }); return; }
    const sb = getStoryBrowserClient();
    (async () => {
      const { data: sess } = await sb.auth.getSession();
      if (!sess.session) { setS({ status: "signed_out", rows: {}, name: "" }); return; }
      const { data } = await sb.from("story_progress").select("lesson, step, captured, completed_at").in("lesson", unit.lessons);
      setS({ status: "ready", rows: Object.fromEntries((data || []).map((r) => [r.lesson, r])), name: sess.session.user.user_metadata?.first_name || "" });
    })();
  }, [unit]);

  if (s.status === "loading") return <div className="sos-center">Opening your story…</div>;
  if (s.status !== "ready") {
    return (
      <div className="sos-narrow sos-center">
        <div>
          <h1 style={{ fontSize: 34, marginBottom: 12 }}>Unit {unit.n} · {unit.name}</h1>
          <a className="sos-btn" href={`/story/start?next=/story/${unit.slug}`}>Sign in</a>
        </div>
      </div>
    );
  }

  const done = unit.lessons.filter((id) => isDone(s.rows[id])).length;
  return (
    <div className="sos-narrow" style={{ maxWidth: 860, padding: "40px 24px 20px" }}>
      <div className="sos-eyebrow">Unit {unit.n} · {unit.name} · {done} of {unit.lessons.length} lessons</div>
      <h1 style={{ fontSize: "clamp(34px, 6vw, 52px)" }}>{unit.tagline}</h1>
      {unit.lessons.map((id) => {
        const l = LESSONS[id];
        const row = s.rows[id];
        if (!isDone(row)) {
          return (
            <div key={id} className="sos-hub-item locked" style={{ marginTop: 22 }}>
              <div className="sos-hub-num">{l.number}</div>
              <div className="sos-hub-body"><b>{l.title}</b><small>Not finished yet</small></div>
              {row && <a className="sos-hub-status" href={`/story/${l.slug}`}>Continue →</a>}
            </div>
          );
        }
        return <LessonCard key={id} lessonId={id} name={s.name} captured={row.captured || {}} hideNext />;
      })}
      <div className="sos-snap-actions" style={{ marginTop: 28 }}>
        <button className="sos-btn ghost" onClick={() => window.print()}>Print / save as PDF</button>
        <a className="sos-btn ghost" href="/story/story-write">My Story Write</a>
        <a className="sos-btn ghost" href="/story/my-story">My story</a>
      </div>
    </div>
  );
}
