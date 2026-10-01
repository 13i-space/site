"use client";
import { NextUp } from "./Snapshot";

// The Lesson 4 card: Aaron's "Call to Adventure", the journey so far and the adventure ahead.
export default function AdventureCard({ name, captured = {}, hideNext = false }) {
  const item = (k, label) =>
    captured[k] ? (
      <div className="sos-aim-row" key={k}>
        <small>{label}</small>
        <div>{captured[k]}</div>
      </div>
    ) : null;

  return (
    <div className="sos-snap">
      <div className="sos-snap-card">
        <div className="sos-snap-label">The Call to Adventure · Lesson 4</div>
        <h3 className="sos-stages-title">{name ? `${name}: from here to there` : "From here to there"}</h3>

        <div className="sos-aims">
          <div className="sos-aim expected">
            <div className="sos-aim-head"><span>Here</span><em>the journey so far</em></div>
            <div className="sos-adv-big">{captured.today_self || "…"}</div>
          </div>
          <div className="sos-aim-arrow" aria-hidden="true">→</div>
          <div className="sos-aim exceptional">
            <div className="sos-aim-head"><span>There</span><em>the adventure ahead</em></div>
            <div className="sos-adv-big">{captured.become_self || "…"}</div>
          </div>
        </div>

        {captured.challenge_calling && (
          <div className="sos-courage">
            <div className="sos-snap-label">My call to adventure</div>
            <div className="sos-courage-text">{captured.challenge_calling}</div>
          </div>
        )}

        <div className="sos-adv-grid">
          {item("want_from_life", "What I want out of life")}
          {item("legacy", "The legacy I want to create")}
          {item("bring_to_world", "What I want to bring to my world")}
          {item("grow", "What I want to grow")}
          {item("let_go", "What I'm letting go of")}
          {item("circle_reflection", "What makes there possible")}
        </div>

        {captured.champion_note && <p className="sos-snap-note" style={{ marginTop: 18 }}>{captured.champion_note}</p>}
      </div>

      {!hideNext && (
        <>
          <div className="sos-unit-done">
            <div className="sos-unit-done-ring" aria-hidden="true">I</div>
            <div>
              <div className="sos-snap-label">Unit 1 complete</div>
              <h3>You are the lead character of your own story.</h3>
              <p>All four lessons of Character, together on one page.</p>
              <a className="sos-btn" href="/story/unit-1">See My Character</a>
            </div>
          </div>
          <NextUp
            label="Pause here · Let it eat"
            title="Up next: Unit 2 · Challenge"
            text="Every character faces a challenge. Unit 2 explores the moments that shaped how you see yourself. Give Unit 1 a few days to settle first: notice your 'here', and your call."
            href={null}
            aside="Unit 2 is coming soon."
          />
        </>
      )}
    </div>
  );
}
