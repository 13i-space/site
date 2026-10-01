"use client";
import ModuleFrame from "../ModuleFrame";
import Quiz from "../Quiz";
import MentorChat from "../MentorChat";
import { QUIZZES } from "../../../../../lib/story/academy/curriculum";
import { quizPassed } from "../../../../../lib/story/academy/useAcademy";

export default function Assessment({ academy }) {
  const p = academy.progress;
  return (
    <ModuleFrame academy={academy} slug="assessment"
      sections={[{ id: "exam", label: "Champion Assessment" }, { id: "commit", label: "Your commitment" }]}
      requirements={[{ label: "Score 80% or higher on the assessment", met: quizPassed(p, "assessment") }, { label: "Make your commitment with the Master Champion", met: Boolean(p.mentor?.commitment) }]}>
      <section id="exam" className="ac-sec">
        <p className="ac-lede">Eight scenarios from real Champion moments, drawn from every part of the training. Take your time.</p>
        <Quiz quiz={QUIZZES.assessment} title="Champion Assessment" best={p.quizzes?.assessment || 0}
          onScore={(pct) => academy.save((cur) => ({ ...cur, quizzes: { ...cur.quizzes, assessment: Math.max(pct, cur.quizzes?.assessment || 0) } }))} />
      </section>
      <section id="commit" className="ac-sec">
        <h2>Next Steps: your commitment</h2>
        <p>Every Story ends with a Call to Action. So does Champion training. Your Master Champion will help you close the circle and put your commitment into words.</p>
        <MentorChat academy={academy} checkpoint="commitment" title="Close the circle"
          intro="Your last conversation before certification: what you learned about yourself as a guide, the fear you'll carry into your first session, and your commitment."
          done={Boolean(p.mentor?.commitment)} next="/story/academy/assessment"
          onDone={() => academy.save((cur) => ({ ...cur, mentor: { ...cur.mentor, commitment: true } }))} />
      </section>
    </ModuleFrame>
  );
}
