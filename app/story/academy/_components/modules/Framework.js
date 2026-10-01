"use client";
import { useState } from "react";
import ModuleFrame from "../ModuleFrame";
import Quiz from "../Quiz";
import MentorChat from "../MentorChat";
import { Callout, FrameworkPath } from "../Visuals";
import { FRAMEWORK, QUIZZES } from "../../../../../lib/story/academy/curriculum";
import { quizPassed } from "../../../../../lib/story/academy/useAcademy";

function Debrief({ items }) {
  return (
    <div className="ac-debrief-flow">
      {items.map((d, i) => (
        <div key={d.k} className={`ac-df s${i}`}>
          <div className="ac-df-k">{d.k}</div>
          <p>{d.d}</p>
          <div className="ac-df-ex">“{d.ex}”</div>
        </div>
      ))}
    </div>
  );
}

function StepDetail({ s }) {
  return (
    <div className="ac-step" key={s.key}>
      <div className="ac-step-n">Step {s.n} of 6</div>
      <h3>{s.title}</h3>
      <p className="ac-lede">{s.lead}</p>
      <p>{s.body}</p>
      {s.checklist && (
        <div className="ac-checks">
          {s.checklist.map((c) => (
            <div key={c.h} className="ac-check">
              <b>{c.h}</b>
              <ul>{c.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      )}
      {s.values && (
        <div className="ac-values">
          {s.values.map((v, i) => (
            <div key={v.t} className="ac-value"><span>{i + 1}</span><b>{v.t}</b><p>{v.d}</p></div>
          ))}
        </div>
      )}
      {s.questions && (
        <div className="ac-qgrid">
          {s.questions.map(([c, q], i) => (
            <div key={c}><span className="ac-qgrid-n">{i + 1}</span><b>{c}</b><p>{q}</p></div>
          ))}
        </div>
      )}
      {s.elements && (
        <ol className="ac-elements">{s.elements.map((e) => <li key={e}>{e}</li>)}</ol>
      )}
      {s.debrief && <Debrief items={s.debrief} />}
      {s.triad && (
        <div className="ac-triad">{s.triad.map((t, i) => <div key={t}><span>{["Then", "Now", "Next"][i]}</span>{t}</div>)}</div>
      )}
      {(s.callouts || []).map((c) => <Callout key={c.text} kind={c.kind} text={c.text} />)}
    </div>
  );
}

export default function Framework({ academy }) {
  const [on, setOn] = useState("prepared");
  const idx = FRAMEWORK.findIndex((s) => s.key === on);
  const p = academy.progress;
  return (
    <ModuleFrame academy={academy} slug="framework"
      sections={[{ id: "steps", label: "The six steps" }, { id: "check", label: "Knowledge check" }, { id: "mentor", label: "Your Champion story" }]}
      requirements={[{ label: "Pass the knowledge check", met: quizPassed(p, "framework") }, { label: "Talk with the Master Champion", met: Boolean(p.mentor?.framework) }]}>
      <section id="steps" className="ac-sec">
        <p className="ac-lede">Every Story session, with one person or a whole cohort, follows the same six steps. This is Aaron's Framework for Coaching.</p>
        <FrameworkPath steps={FRAMEWORK} active={on} onPick={setOn} />
        <StepDetail s={FRAMEWORK[idx]} />
        <div className="ac-row between">
          <button type="button" className="sos-btn ghost" disabled={idx === 0} onClick={() => setOn(FRAMEWORK[idx - 1].key)}>← {idx > 0 ? FRAMEWORK[idx - 1].title : "Back"}</button>
          {idx < FRAMEWORK.length - 1
            ? <button type="button" className="sos-btn" onClick={() => setOn(FRAMEWORK[idx + 1].key)}>{FRAMEWORK[idx + 1].title} →</button>
            : <a className="sos-btn" href="#check">Knowledge check →</a>}
        </div>
      </section>

      <section id="check" className="ac-sec">
        <h2>Knowledge check</h2>
        <Quiz quiz={QUIZZES.framework} best={p.quizzes?.framework || 0}
          onScore={(pct) => academy.save((cur) => ({ ...cur, quizzes: { ...cur.quizzes, framework: Math.max(pct, cur.quizzes?.framework || 0) } }))} />
      </section>

      <section id="mentor" className="ac-sec">
        <h2>Your Champion story</h2>
        <p>Before you process anyone else's story, a Master Champion will process yours, using the same What → So What → Now What you just learned. Answer honestly. There are no wrong answers, only your experience.</p>
        <MentorChat academy={academy} checkpoint="framework" title="What · So What · Now What"
          intro="A short conversation, about five questions. You'll feel what it's like to be on the other side of a good Champion."
          done={Boolean(p.mentor?.framework)} next="/story/academy/framework"
          onDone={() => academy.save((cur) => ({ ...cur, mentor: { ...cur.mentor, framework: true } }))} />
      </section>
    </ModuleFrame>
  );
}
