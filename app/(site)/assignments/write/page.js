import Link from "next/link";
import AssignmentBuilder from "../../../../components/AssignmentBuilder";

// Write an Assignment (Update 5.57, made inviting): one big line to start,
// the Protocol in four short cards (the full text folded away below them),
// then the writing sheet itself (components/AssignmentBuilder.js).

export const metadata = { title: "Write an Assignment" };

const RULES = [
  { n: "I", h: "Write as we", p: "You aren't writing about 13i. You are 13i, a collective. Its voice is always “we”." },
  { n: "II", h: "Begin with a purpose", p: "Investigate, discover, study, evaluate, or just answer a question. The purpose can change as you learn." },
  { n: "III", h: "Act, and fail", p: "13i can intervene, and a manifestation can be lost. The Assignment goes on; the collective remembers." },
  { n: "IV", h: "Never all-knowing", p: "Ancient and vast, but not omniscient. The best Assignments meet something 13i doesn't understand.", gold: true },
];

export default function WriteAssignmentPage() {
  return (
    <div className="wa">
      <Link href="/assignments" className="mono wa-back">&larr; Assignments</Link>

      <section className="wa-hero">
        <div className="mono wa-kicker">create &middot; write an assignment</div>
        <h1 className="wa-title">You are 13i.</h1>
        <p className="wa-lede">
          You&rsquo;ve been sent somewhere. You don&rsquo;t know everything, and you may be wrong.
          But you will learn. <em>Tell us what happens.</em>
        </p>
        <div className="wa-hero-actions">
          <a href="#write" className="wa-primary">Start writing &darr;</a>
          <Link href="/assignments" className="wa-secondary">Read one first</Link>
        </div>
      </section>

      <section className="wa-rules" aria-label="The Protocol">
        {RULES.map((r) => (
          <div key={r.n} className={`wa-rule ${r.gold ? "wa-rule-gold" : ""}`}>
            <span className="wa-rule-n">{r.n}</span>
            <div className="wa-rule-h">{r.h}</div>
            <p>{r.p}</p>
          </div>
        ))}
      </section>

      <details className="wa-full">
        <summary className="mono">read the full Protocol</summary>
        <div>
          <p>You are not writing about 13i. You are writing <em>as</em> 13i. 13i is a collective intelligence. It does not think as an individual. Its voice is <strong>we</strong>.</p>
          <p>13i remembers everything the collective has learned before. But 13i does not know everything. Its knowledge can be incomplete. Its assumptions can be wrong. Its interpretation of what it encounters can be wrong. Every Assignment can change what 13i knows.</p>
          <p>An Assignment begins with a purpose: investigate a threat, discover a new technology, study a civilization, understand a biological phenomenon, evaluate a potential danger, or simply answer a question. The objective is free to change as 13i learns more.</p>
          <p>13i can intervene. There&rsquo;s no requirement to remain an observer: it may communicate, protect, manipulate, teach, alter technology, intervene biologically, destroy something, or take other action. The choice belongs to the intelligence, based on what it understands at the time.</p>
          <p>13i can fail. A manifestation can be destroyed, damaged, trapped, or lost, but the Assignment does not fail. Another manifestation can continue it. The collective retains the experience. When an Assignment ends, 13i knows something it did not know when it began. Not necessarily a moral, a victory, or an answer. But something.</p>
          <p><strong>The one rule that matters:</strong> do not make 13i omniscient. It is extraordinarily knowledgeable, with billions of years of accumulated experience. But it has not seen everything.</p>
        </div>
      </details>

      <div id="write">
        <AssignmentBuilder />
      </div>

      <p className="mono wa-foot">
        submissions move through SUBMITTED &rarr; ARCHIVED &rarr; CANON as they&rsquo;re reviewed
      </p>
    </div>
  );
}
