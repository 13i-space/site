"use client";
import { useEffect, useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../lib/story/storySupabase";
import { LESSONS, UNIT_1 } from "../../../lib/story/lessonSteps";
import Snapshot from "../_components/Snapshot";
import StagesCard from "../_components/StagesCard";
import AimCard from "../_components/AimCard";
import AdventureCard from "../_components/AdventureCard";

const CARDS = { "unit1-lesson1": Snapshot, "unit1-lesson2": StagesCard, "unit1-lesson3": AimCard, "unit1-lesson4": AdventureCard };
const isDone = (row) => Boolean(row && (row.completed_at || row.step === "close" || row.step === "complete"));

// Unit 1 · Character: every lesson card together, the student's "character sheet".
export default function UnitOne() {
  const [s, setS] = useState({ status: "loading", rows: {}, name: "" });

  useEffect(() => {
    if (!storyConfigured) { setS({ status: "not_configured", rows: {}, name: "" }); return; }
    const sb = getStoryBrowserClient();
    (async () => {
      const { data: sess } = await sb.auth.getSession();
      if (!sess.session) { setS({ status: "signed_out", rows: {}, name: "" }); return; }
      const { data } = await sb.from("story_progress").select("lesson, step, captured, completed_at").in("lesson", UNIT_1);
      setS({
        status: "ready",
        rows: Object.fromEntries((data || []).map((r) => [r.lesson, r])),
        name: sess.session.user.user_metadata?.first_name || "",
      });
    })();
  }, []);

  if (s.status === "loading") return <div className="sos-center">Opening your story…</div>;
  if (s.status === "not_configured") return <div className="sos-center"><p>Accounts aren't switched on yet.</p></div>;
  if (s.status === "signed_out") {
    return (
      <div className="sos-narrow sos-center">
        <div>
          <h1 style={{ fontSize: 36, marginBottom: 12 }}>Your character lives here</h1>
          <a className="sos-btn" href="/story/start?next=/story/unit-1">Sign in</a>
        </div>
      </div>
    );
  }

  const doneCount = UNIT_1.filter((id) => isDone(s.rows[id])).length;

  return (
    <div className="sos-narrow" style={{ maxWidth: 860, padding: "40px 24px 20px" }}>
      <div className="sos-eyebrow">Unit 1 · Character · {doneCount} of {UNIT_1.length} lessons</div>
      <h1 style={{ fontSize: "clamp(34px, 6vw, 52px)" }}>
        {s.name ? `${s.name}, ` : ""}the lead character <em style={{ color: "var(--ember)" }}>of your own story</em>.
      </h1>
      <p className="sos-lede" style={{ marginTop: 14 }}>
        Every journey begins with identity. Here's who you've discovered you are: your words, your stages, your aims, and your call to adventure.
      </p>

      {UNIT_1.map((id) => {
        const Card = CARDS[id];
        const row = s.rows[id];
        const l = LESSONS[id];
        if (!isDone(row)) {
          return (
            <div key={id} className="sos-hub-item locked" style={{ marginTop: 22 }}>
              <div className="sos-hub-num">{l.number}</div>
              <div className="sos-hub-body"><b>{l.title}</b><small>Not finished yet</small></div>
              {row && <a className="sos-hub-status" href={`/story/${l.slug}`}>Continue →</a>}
            </div>
          );
        }
        return <Card key={id} name={s.name} captured={row.captured || {}} hideNext />;
      })}

      <div className="sos-snap-actions" style={{ marginTop: 28 }}>
        <button className="sos-btn ghost" onClick={() => window.print()}>Print / save as PDF</button>
        <a className="sos-btn ghost" href="/story/my-story">My story</a>
      </div>
    </div>
  );
}
