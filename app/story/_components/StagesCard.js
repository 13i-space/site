"use client";
import { NextUp } from "./Snapshot";

// The Lesson 2 card: their life in stages, with how each chapter feels.
const STAGES = [
  { key: "0_5", label: "0–5", name: "Family First" },
  { key: "5_12", label: "5–12", name: "Family & Friends" },
  { key: "12_18", label: "12–18", name: "Friends & Family" },
  { key: "18_26", label: "18–26", name: "World, Work & Family" },
];

export default function StagesCard({ name, captured = {}, hideNext = false }) {
  const impact = String(captured.impact_stage || "").replace("-", "–");
  return (
    <div className="sos-snap">
      <div className="sos-snap-card">
        <div className="sos-snap-label">A Life in Stages · Lesson 2</div>
        <h3 className="sos-stages-title">{name ? `${name}'s story, chapter by chapter` : "Your story, chapter by chapter"}</h3>
        <ol className="sos-stages">
          {STAGES.map((s, i) => {
            const memory = captured[`stage_${s.key}_memory`];
            const feeling = captured[`stage_${s.key}_feeling`];
            const isImpact = impact && impact === s.label;
            const future = i === 3;
            return (
              <li key={s.key} className={`${isImpact ? "impact" : ""} ${future ? "future" : ""}`}>
                <div className="sos-stage-age">{s.label}</div>
                <div className="sos-stage-name">{s.name}</div>
                <div className="sos-stage-feel">{feeling || "…"}</div>
                {memory && <p className="sos-stage-mem">{memory}</p>}
                {isImpact && <span className="sos-stage-tag">Most impact</span>}
                {future && <span className="sos-stage-tag soft">Just beginning</span>}
              </li>
            );
          })}
        </ol>
        {(captured.child_word || captured.child_positive) && (
          <div className="sos-stage-child">
            <div className="sos-snap-label">As a kid, in one word</div>
            <div className="sos-snap-word" style={{ fontSize: 44 }}>{captured.child_word || "—"}</div>
            {captured.child_positive && <p style={{ margin: 0, color: "var(--ink-soft)" }}>{captured.child_positive}</p>}
          </div>
        )}
        {captured.champion_note && <p className="sos-snap-note" style={{ marginTop: 18 }}>{captured.champion_note}</p>}
        <p style={{ margin: "16px 0 0", fontSize: 15 }}><a href="/story/timeline">See your Life Timeline →</a></p>
      </div>
      {!hideNext && <NextUp
        label="Pause here · Let it eat"
        title="Give your story time to work on you"
        text="This is the natural place to stop for now. Over the next day or two, notice what memories come back, and how your family and the world around you have shaped who you are. When you're ready, Lesson 3, Expected to Exceptional, explores what you expect from life, and what would make it exceptional."
        href="/story/lesson-3"
        cta="Start Lesson 3 when you're ready"
        aside="Tip: let it eat, ideally for at least a night, before moving on. Your story is saved."
      />}
    </div>
  );
}
