"use client";
import { NextUp } from "./Snapshot";

// The Lesson 3 card: Aaron's whiteboard, Expected (external aim) vs Exceptional (internal aim).
const EXPECTED = [
  ["expected_happy", "What makes me happy"],
  ["expected_success", "How I define success"],
  ["expected_powerful", "I'll feel powerful when"],
];
const EXCEPTIONAL = [
  ["exceptional_meaningful", "My most meaningful moments"],
  ["exceptional_value", "What I value most"],
  ["exceptional_purpose", "My life has purpose when"],
];

export default function AimCard({ name, captured = {}, hideNext = false }) {
  const col = (rows) =>
    rows.map(([k, label]) => (
      <div key={k} className="sos-aim-row">
        <small>{label}</small>
        <div>{captured[k] || "…"}</div>
      </div>
    ));

  return (
    <div className="sos-snap">
      <div className="sos-snap-card">
        <div className="sos-snap-label">Two Aims · Lesson 3</div>
        <h3 className="sos-stages-title">{name ? `${name}: expected to exceptional` : "Expected to exceptional"}</h3>
        {captured.future_want && (
          <p style={{ color: "var(--ink-soft)", margin: "0 0 18px" }}>
            <b style={{ color: "var(--ink)" }}>What I want for my future:</b> {captured.future_want}
          </p>
        )}
        <div className="sos-aims">
          <div className="sos-aim expected">
            <div className="sos-aim-head"><span>Expected</span><em>external aim</em></div>
            {col(EXPECTED)}
          </div>
          <div className="sos-aim-arrow" aria-hidden="true">→</div>
          <div className="sos-aim exceptional">
            <div className="sos-aim-head"><span>Exceptional</span><em>internal aim</em></div>
            {col(EXCEPTIONAL)}
          </div>
        </div>
        {captured.noticed && (
          <div style={{ marginTop: 20 }}>
            <div className="sos-snap-label">What I noticed</div>
            <p style={{ margin: "4px 0 0" }}>{captured.noticed}</p>
          </div>
        )}
        {captured.courage_step && (
          <div className="sos-courage">
            <div className="sos-snap-label">My courage step this week</div>
            <div className="sos-courage-text">{captured.courage_step}</div>
          </div>
        )}
        {captured.champion_note && <p className="sos-snap-note" style={{ marginTop: 18 }}>{captured.champion_note}</p>}
      </div>
      {!hideNext && <NextUp
        label="Pause here · Let it eat"
        title="Notice where you're aiming"
        text="Over the next few days, notice when you're chasing the expected and when you're living the exceptional, and try your courage step. When you're ready, Lesson 4, The Call to Adventure, closes Unit 1: who you feel you are today, and who you want to become."
        href="/story/lesson-4"
        cta="Start Lesson 4 when you're ready"
        aside="Tip: let it eat, ideally for at least a night, before moving on. Your story is saved."
      />}
    </div>
  );
}
