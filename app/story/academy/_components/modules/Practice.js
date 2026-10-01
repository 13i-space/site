"use client";
import ModuleFrame from "../ModuleFrame";
import PracticeRoom from "../PracticeRoom";
import { Callout } from "../Visuals";
import { RUBRIC, PERSONAS } from "../../../../../lib/story/academy/curriculum";
import { practiceCount } from "../../../../../lib/story/academy/useAcademy";

export default function Practice({ academy }) {
  const p = academy.progress;
  const n = practiceCount(p);
  const sessions = [...(p.practice || [])].reverse().slice(0, 6);
  return (
    <ModuleFrame academy={academy} slug="practice"
      sections={[{ id: "how", label: "How practice works" }, { id: "rubric", label: "Aaron's rubric" }, { id: "room", label: "The Practice Room" }]}
      requirements={[{ label: `Complete sessions with 2 different students (${Math.min(n, 2)}/2)`, met: n >= 2 }]}>
      <section id="how" className="ac-sec">
        <p className="ac-lede">There is no better guide than another guide, and no better practice than practice. Here you'll champion simulated students, each built from a moment Aaron warns about in his toolkits.</p>
        <div className="ac-how">
          <div><span>1</span><b>Choose a student</b><p>Each one brings a real Champion challenge, from a guarded first session to a safety moment.</p></div>
          <div><span>2</span><b>Champion them</b><p>Respond the way you've learned: questions, not answers. They open up when you get it right.</p></div>
          <div><span>3</span><b>Get your debrief</b><p>A Master Champion scores the session on Aaron's rubric, quotes your best moment, and gives you one thing to try next.</p></div>
        </div>
        <Callout kind="Play" text="You are going to crash. That's the point of a practice room. Aaron's Tip: practice having conversations where you only respond with questions." />
      </section>

      <section id="rubric" className="ac-sec">
        <h2>What you're scored on</h2>
        <div className="ac-rubric-cards">
          {RUBRIC.map((r, i) => (
            <div key={r.key}><span>{i + 1}</span><b>{r.label}</b><p>“{r.aaron}”</p></div>
          ))}
        </div>
      </section>

      <section id="room" className="ac-sec">
        <h2>The Practice Room</h2>
        <PracticeRoom academy={academy} next="/story/academy/practice" />
        {sessions.length > 0 && (
          <div className="ac-sessions">
            <div className="ac-colh">Your sessions</div>
            {sessions.map((s) => {
              const per = PERSONAS.find((x) => x.id === s.persona);
              return (
                <div key={`${s.persona}-${s.at}`} className="ac-session">
                  <span className="ac-av" style={{ width: 28, height: 28, background: per?.hue, fontSize: 13 }}>{per?.name?.[0]}</span>
                  <b>{per?.name}</b>
                  <span className="ac-muted">{s.headline}</span>
                  <span className="ac-session-p">{s.percent}%</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </ModuleFrame>
  );
}
