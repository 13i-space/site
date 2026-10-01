"use client";
import { NextUp } from "./Snapshot";
import { getLesson, unitOf } from "../../../lib/story/lessonSteps";
import { wordCount } from "../../../lib/story/storyWrite";

// The card for Lessons 5–22, laid out from each lesson's `card` settings.
export default function LessonCard({ lessonId, name, captured = {}, hideNext = false }) {
  const lesson = getLesson(lessonId);
  const unit = unitOf(lessonId);
  const next = lesson?.next ? getLesson(lesson.next) : null;
  const fields = (lesson?.card?.fields || []).filter(([k]) => {
    const v = captured[k];
    return Array.isArray(v) ? v.length : Boolean(v);
  });

  return (
    <div className="sos-snap">
      <div className="sos-snap-card">
        <div className="sos-snap-label">{lesson.card.label} · Lesson {lesson.number}</div>
        <h3 className="sos-stages-title">{name ? `${name}: ${lesson.title}` : lesson.title}</h3>
        {fields.length === 0 && <p style={{ color: "var(--muted)" }}>Your answers will appear here.</p>}
        <div className="sos-gen">
          {fields.map(([k, label, kind]) => {
            const v = captured[k];
            if (kind === "big") return (
              <div key={k} className="sos-gen-row wide">
                <small>{label}</small>
                <div className="sos-gen-big">{v}</div>
              </div>
            );
            if (kind === "list") return (
              <div key={k} className="sos-gen-row">
                <small>{label}</small>
                <ul className="sos-moments" style={{ margin: "4px 0 0" }}>{(Array.isArray(v) ? v : [v]).map((x, i) => <li key={i}>{x}</li>)}</ul>
              </div>
            );
            if (kind === "draft") return (
              <div key={k} className="sos-gen-row wide">
                <small>{label} · {wordCount(v)} words</small>
                <div className="sos-draft">{v}</div>
              </div>
            );
            return (
              <div key={k} className="sos-gen-row">
                <small>{label}</small>
                <div>{v}</div>
              </div>
            );
          })}
        </div>
        {captured.champion_note && <p className="sos-snap-note" style={{ marginTop: 18 }}>{captured.champion_note}</p>}
      </div>

      {!hideNext && lesson.unitEnd && (
        <div className="sos-unit-done">
          <div className="sos-unit-done-ring" aria-hidden="true">{unit?.n}</div>
          <div>
            <div className="sos-snap-label">Unit {unit?.n} complete · {unit?.name}</div>
            <h3>{lesson.finale ? "You are the hero of your own story." : unit?.tagline}</h3>
            <p>{lesson.finale ? "Your Story of Self is written. Own your story." : `All of Unit ${unit?.n}, together on one page.`}</p>
            <div className="sos-snap-actions" style={{ marginTop: 0 }}>
              <a className="sos-btn" href={`/story/${unit?.slug}`}>See Unit {unit?.n}</a>
              <a className="sos-btn ghost on-dark" href="/story/story-write">My Story Write</a>
            </div>
          </div>
        </div>
      )}

      {!hideNext && next && (
        <NextUp
          label={lesson.pauseAfter ? "Pause here · Let it eat" : lesson.holdNext ? "Keep going · Toward hope" : `Up next · Lesson ${next.number}`}
          title={lesson.pauseAfter ? `When you're ready: ${next.title}` : next.title}
          text={next.tagline}
          href={`/story/${next.slug}`}
          cta={lesson.pauseAfter ? `Start Lesson ${next.number} when you're ready` : `Continue to Lesson ${next.number}`}
          aside={
            lesson.holdNext
              ? "Don't leave your story in the cave. Hope is the very next step, and it's best to take it soon."
              : lesson.pauseAfter
              ? "Tip: let it eat, ideally for a night or more, before moving on. Your story is saved."
              : "Or take a break. Your story is saved."
          }
        />
      )}
    </div>
  );
}
