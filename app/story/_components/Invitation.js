"use client";
import { useState } from "react";

// Aaron's opening "Story Checklist" and shared values, as an invitation to accept.
const COMMITMENTS = [
  { id: "all_in", title: "I'm all in.", text: "I'll finish what I start, and give my best even when part of me resists." },
  { id: "time", title: "I'll make time for me.", text: "I'm setting aside time each week to prioritize myself and my story." },
  { id: "open", title: "I'm open-minded and ready to explore.", text: "I'll be curious, not judgmental, about my own story." },
  { id: "courage", title: "I'll choose courage.", text: "Some parts of a story are hard to look at. When I feel resistance, I'll take one more step." },
];

export default function Invitation() {
  const [checked, setChecked] = useState({});
  const all = COMMITMENTS.every((c) => checked[c.id]);

  function accept() {
    try { localStorage.setItem("sos-invitation-accepted", new Date().toISOString()); } catch {}
    window.location.href = "/story/start?next=/story/lesson-1";
  }

  return (
    <div className="sos-invite">
      <div className="sos-eyebrow">The invitation</div>
      <h2>Story is an invitation. It's your choice to go.</h2>
      <p className="sos-lede" style={{ fontSize: 17 }}>
        Accepting the invitation means accepting the challenge that comes with it. Before we begin, Story asks for four things:
      </p>
      <ul className="sos-values">
        {COMMITMENTS.map((c) => (
          <li key={c.id}>
            <label className={checked[c.id] ? "on" : ""}>
              <input type="checkbox" checked={Boolean(checked[c.id])} onChange={(e) => setChecked({ ...checked, [c.id]: e.target.checked })} />
              <div>
                <b>{c.title}</b>
                <span>{c.text}</span>
              </div>
            </label>
          </li>
        ))}
      </ul>
      <button className="sos-btn" disabled={!all} onClick={accept}>
        I accept. Begin my story
      </button>
      {!all && <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 12, marginBottom: 0 }}>Check all four when you're ready.</p>}
    </div>
  );
}
