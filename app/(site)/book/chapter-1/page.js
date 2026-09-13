import Link from "next/link";
import { paragraphs } from "../../../../lib/chapter1";

export default function ChapterOne() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <Link href="/book" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to The Book
      </Link>

      <div style={{ marginTop: 20, marginBottom: 6, textAlign: "center" }}>
        <div className="mono" style={{ fontSize: 11, color: "#565B8F", letterSpacing: "1px" }}>
          BOOK ONE &middot; PART ONE
        </div>
        <div className="page-title" style={{ marginBottom: 0 }}>
          Chapter 1
        </div>
        <div className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
          Aiden — Discovery
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            style={{
              fontSize: 16,
              lineHeight: 1.85,
              color: "#D9DCFF",
              marginBottom: 20,
            }}
          >
            {p}
          </p>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 20, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0 }}>
          More chapters coming as the manuscript is finalized. Want the whole
          rough draft now?{" "}
          <a href="/downloads/13i-rough-draft.pdf" download>
            Download the full PDF
          </a>
          .
        </p>
      </div>
    </div>
  );
}
