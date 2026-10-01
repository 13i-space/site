"use client";
import { useState } from "react";
import LifeTimeline, { AARON_EXAMPLE } from "../_components/LifeTimeline";

export default function TimelineView() {
  const [view, setView] = useState("mine");
  return (
    <div className="lt-page">
      <div className="lt-page-head">
        <div className="sos-eyebrow">Unit 1 · Character · Story Guide pages 20–23</div>
        <h1>Your Life Timeline</h1>
        <p className="sos-lede">It doesn't need to be perfect. It's a way to begin thinking about your journey up to now. Relax, and do your best.</p>
        <div className="lt-tabs" role="tablist">
          <button role="tab" aria-selected={view === "mine"} className={view === "mine" ? "on" : ""} onClick={() => setView("mine")}>My timeline</button>
          <button role="tab" aria-selected={view === "example"} className={view === "example" ? "on" : ""} onClick={() => setView("example")}>See Aaron's example</button>
        </div>
      </div>
      {view === "mine" ? <LifeTimeline /> : (
        <>
          <LifeTimeline example={AARON_EXAMPLE} />
          <p className="lt-note">Aaron used moments from his own life as the model in the Story Guide. Tap any moment to read it. Heights here are approximate.</p>
        </>
      )}
      <div className="lt-page-foot">
        <a href="/story/lesson-2">← Back to Lesson 2</a>
        <a href="/story/my-story">My story</a>
      </div>
    </div>
  );
}
