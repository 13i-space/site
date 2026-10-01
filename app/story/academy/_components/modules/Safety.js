"use client";
import ModuleFrame from "../ModuleFrame";
import Quiz from "../Quiz";
import { Callout } from "../Visuals";
import { SAFETY, QUIZZES } from "../../../../../lib/story/academy/curriculum";
import { quizPassed } from "../../../../../lib/story/academy/useAcademy";

export default function Safety({ academy }) {
  const p = academy.progress;
  return (
    <ModuleFrame academy={academy} slug="safety"
      sections={[{ id: "scope", label: "A guide, not a therapist" }, { id: "crisis", label: "When someone isn't safe" }, { id: "bounds", label: "Boundaries" }, { id: "care", label: "Care for the Champion" }, { id: "check", label: "Safety check" }]}
      requirements={[{ label: "Pass the safety check (100%)", met: quizPassed(p, "safety") }]}>
      <div className="ac-proposal">Proposed module for Aaron's review: built from the toolkit warnings and standard youth-safety practice.</div>

      <section id="scope" className="ac-sec">
        <h2>A guide, not a therapist</h2>
        <ul className="ac-keys big">{SAFETY.scope.map((s) => <li key={s}>{s}</li>)}</ul>
        <Callout kind="Warning" text="From Aaron's toolkits: in Story, trauma is the EVENT; the Defining Moment is the personal EXPERIENCE. Never push someone to relive details. Ask about meaning and feeling, not facts." />
      </section>

      <section id="crisis" className="ac-sec">
        <h2>When someone isn't safe</h2>
        <p>If a student says anything suggesting thoughts of suicide or self-harm, that they're being hurt, or that they might hurt someone, the lesson stops.</p>
        <ol className="ac-ladder">
          {SAFETY.steps.map((s, i) => (
            <li key={s.t}><span className="n">{i + 1}</span><div><b>{s.t}</b><p>{s.d}</p></div></li>
          ))}
        </ol>
        <div className="ac-lines">
          <div><b>988</b><span>Call or text · Suicide &amp; Crisis Lifeline (U.S.)</span></div>
          <div><b>741741</b><span>Text HOME · Crisis Text Line</span></div>
          <div><b>911</b><span>Immediate danger</span></div>
        </div>
      </section>

      <section id="bounds" className="ac-sec">
        <h2>Boundaries that protect everyone</h2>
        <div className="ac-bounds">{SAFETY.boundaries.map((b, i) => <div key={b}><span>{i + 1}</span>{b}</div>)}</div>
      </section>

      <section id="care" className="ac-sec">
        <h2>Care for the Champion</h2>
        <Callout kind="Mindset" text={SAFETY.care} />
      </section>

      <section id="check" className="ac-sec">
        <h2>Safety check</h2>
        <p className="ac-muted">Safety is the one place where 100% is the standard.</p>
        <Quiz quiz={QUIZZES.safety} title="Safety check" best={p.quizzes?.safety || 0}
          onScore={(pct) => academy.save((cur) => ({ ...cur, quizzes: { ...cur.quizzes, safety: Math.max(pct, cur.quizzes?.safety || 0) } }))} />
      </section>
    </ModuleFrame>
  );
}
