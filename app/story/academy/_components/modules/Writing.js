"use client";
import { useState } from "react";
import ModuleFrame from "../ModuleFrame";
import Quiz from "../Quiz";
import { Callout, Stars, StoryArc } from "../Visuals";
import { STORY_WRITE, INVISIBLE_KID, QUIZZES } from "../../../../../lib/story/academy/curriculum";
import { quizPassed } from "../../../../../lib/story/academy/useAcademy";

const SHORT = { ordinary: "Ordinary World", moment: "Defining Moment", fall: "The Fall", shift: "Impossible Shift", rise: "The Rise", call: "Call to Action" };

export default function Writing({ academy }) {
  const [on, setOn] = useState("ordinary");
  const [hover, setHover] = useState(null);
  const i = STORY_WRITE.findIndex((x) => x.key === on);
  const w = STORY_WRITE[i];
  const p = academy.progress;
  return (
    <ModuleFrame academy={academy} slug="writing"
      sections={[{ id: "arc", label: "The shape of a story" }, { id: "example", label: "Aaron's Story of Self" }, { id: "check", label: "Knowledge check" }]}
      requirements={[{ label: "Pass the knowledge check", met: quizPassed(p, "writing") }]}>
      <section id="arc" className="ac-sec">
        <p className="ac-lede">Every Story of Self has the same shape: down through the Fall into the Cave, then up through the Rise. Each writing element is a point on that arc. Tap one to see how to guide it.</p>
        <div className="ac-arcwrap">
          <StoryArc items={STORY_WRITE.map((x) => ({ ...x, short: SHORT[x.key] }))} active={on} onPick={setOn} />
        </div>
        <article className="ac-fcard wide" key={w.key}>
          <div className="ac-fcard-top">
            <div>
              <div className="ac-fcard-n">Writing element {i + 1} of 6</div>
              <h3>{w.el}</h3>
              <div className="ac-muted">Lesson: {w.lesson}</div>
            </div>
            <div className="ac-fcard-meta stack">
              <span><b>Time</b>{w.time}</span>
              <span><b>Difficulty</b><Stars n={w.stars} /></span>
            </div>
          </div>
          <p className="ac-lede">{w.intro}</p>
          <div className="ac-twocol">
            <div>
              <div className="ac-colh">What to listen for</div>
              <ul className="ac-keys">{w.keys.map((k) => <li key={k}>{k}</li>)}</ul>
            </div>
            <div>
              <div className="ac-colh">Facilitator notes</div>
              <ol className="ac-timeline">{w.steps.map((s, k) => <li key={k}><span>Step {k + 1}</span>{s}</li>)}</ol>
            </div>
          </div>
          {w.tips.map((t) => <Callout key={t.text} kind={t.kind} text={t.text} />)}
          <div className="ac-row between" style={{ marginTop: 18 }}>
            <button type="button" className="sos-btn ghost" disabled={i === 0} onClick={() => setOn(STORY_WRITE[i - 1].key)}>← Back</button>
            {i < 5 ? <button type="button" className="sos-btn" onClick={() => setOn(STORY_WRITE[i + 1].key)}>{SHORT[STORY_WRITE[i + 1].key]} →</button> : <a className="sos-btn" href="#example">Read Aaron's story →</a>}
          </div>
        </article>
      </section>

      <section id="example" className="ac-sec">
        <h2>Aaron's Story of Self: The Invisible Kid</h2>
        <p>The example story from the Champion Toolkits, excerpted. See how each element does one job, and how the Hidden Value and the Higher Value answer each other. Tap a passage to jump to its element on the arc above.</p>
        <div className="ac-story">
          {INVISIBLE_KID.map((s, k) => (
            <div key={k} className={`ac-story-row${s.hv ? " hv" : ""}${hover === k ? " on" : ""}`}
              onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} onClick={() => setOn(s.key)}>
              <div className="ac-story-el">{s.el}</div>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <div className="ac-invert">
          <div><span>Hidden Value</span><b>“I am invisible.”</b></div>
          <svg viewBox="0 0 80 24" width="80" height="24" aria-hidden="true"><path d="M2 12 H70 M60 4 L72 12 L60 20" fill="none" stroke="#C25B34" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div className="up"><span>Higher Value</span><b>“I can see potential.”</b></div>
        </div>
        <Callout kind="Insight" text="Notice what the story leaves out. It's about 1,200 words, built on tight word counts, because each section only needs what's required to understand the next one. Ordinary World gets to the Defining Moment. The Defining Moment gets to the Hidden Value." />
      </section>

      <section id="check" className="ac-sec">
        <h2>Knowledge check</h2>
        <Quiz quiz={QUIZZES.writing} best={p.quizzes?.writing || 0}
          onScore={(pct) => academy.save((cur) => ({ ...cur, quizzes: { ...cur.quizzes, writing: Math.max(pct, cur.quizzes?.writing || 0) } }))} />
      </section>
    </ModuleFrame>
  );
}
