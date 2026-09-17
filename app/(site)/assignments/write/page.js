import Link from "next/link";
import AssignmentBuilder from "../../../../components/AssignmentBuilder";

export default function WriteAssignmentPage() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <Link href="/assignments" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to Assignments
      </Link>

      <div className="page-title" style={{ marginTop: 14 }}>Write an Assignment</div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <p style={{ marginBottom: 14 }}>
          You are 13i.
        </p>
        <p style={{ marginBottom: 14, color: "#B7BADF" }}>
          You have been sent somewhere. You don't know everything. You may not understand what you encounter.
          You may be there to observe. You may be there to intervene. You may encounter something completely new.
          You may be wrong. But you will learn.
        </p>
        <p style={{ margin: 0, fontStyle: "italic", color: "#8B95F6" }}>
          Tell us what happens.
        </p>
      </div>

      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#DCDFFF", marginBottom: 10 }}>
        The Protocol
      </div>
      <div className="panel" style={{ marginBottom: 20, fontSize: 13.5, color: "#B7BADF", lineHeight: 1.7 }}>
        <p>You are not writing about 13i. You are writing <em>as</em> 13i.</p>
        <p>13i is a collective intelligence. It does not think as an individual. Its voice is <strong>we</strong>.</p>
        <p>
          13i remembers everything the collective has learned before. But 13i does not know
          everything. Its knowledge can be incomplete. Its assumptions can be wrong. Its
          interpretation of what it encounters can be wrong. Every Assignment can change what
          13i knows.
        </p>
        <p>
          An Assignment begins with a purpose &mdash; investigate a threat, discover a new
          technology, study a civilization, understand a biological phenomenon, evaluate a
          potential danger, or simply answer a question. The objective is free to change as 13i
          learns more.
        </p>
        <p>
          13i can intervene. There's no requirement to remain an observer &mdash; it may
          communicate, protect, manipulate, teach, alter technology, intervene biologically,
          destroy something, or take other action. The choice belongs to the intelligence, based
          on what it understands at the time.
        </p>
        <p style={{ margin: 0 }}>
          13i can fail. A manifestation can be destroyed, damaged, trapped, or lost &mdash; but
          the Assignment does not fail. Another manifestation can continue it. The collective
          retains the experience. When an Assignment ends, 13i knows something it did not know
          when it began. Not necessarily a moral, a victory, or an answer. But something.
        </p>
      </div>

      <div style={{
        border: "1px solid #C97B6E", borderRadius: 4, padding: "16px 20px", marginBottom: 28,
        background: "rgba(201,123,110,0.06)",
      }}>
        <div className="mono" style={{ fontSize: 11, color: "#C97B6E", letterSpacing: "1px", marginBottom: 8 }}>
          ONE RULE THAT MATTERS
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "#E8CFC0" }}>
          Do not make 13i omniscient. It is extraordinarily knowledgeable &mdash; billions of
          years of accumulated experience. But it has not seen everything. The most interesting
          Assignments are often the ones where 13i encounters something it does not understand.
        </p>
      </div>

      <AssignmentBuilder />

      <p className="mono" style={{ fontSize: 10.5, color: "#3A3E75", marginTop: 24, textAlign: "center" }}>
        submissions move through SUBMITTED &rarr; ARCHIVED &rarr; CANON as they're reviewed
      </p>
    </div>
  );
}
