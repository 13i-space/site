import Link from "next/link";

export default function AssignmentsPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div className="page-title">Assignments</div>
      <div className="page-subtitle">
        Every Assignment is 13i sent somewhere, uncertain, asked to report back. Some are already told. Some are yours to write.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28, marginTop: 30 }}>
        <div>
          <div className="wordmark" style={{ fontSize: 20, color: "#DCDFFF", marginBottom: 14 }}>Read</div>
          <Link
            href="/assignments/0000001"
            className="launch-card"
            style={{
              display: "block", background: "rgba(14,16,38,0.72)", border: "1px solid #262A55",
              borderRadius: 4, padding: "20px 22px", textDecoration: "none", color: "inherit",
            }}
          >
            <div className="mono" style={{ fontSize: 10.5, color: "#565B8F", letterSpacing: "1px", marginBottom: 6 }}>
              ASSIGNMENT 0000001
            </div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF", marginBottom: 6 }}>
              The First Silence
            </div>
            <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0 }}>
              Read it in the browser, have it read aloud, or download the PDF.
            </p>
          </Link>
        </div>

        <div>
          <div className="wordmark" style={{ fontSize: 20, color: "#DCDFFF", marginBottom: 14 }}>Write</div>
          <Link
            href="/assignments/write"
            className="launch-card"
            style={{
              display: "block", background: "rgba(14,16,38,0.72)", border: "1px solid #3A3E75",
              borderRadius: 4, padding: "20px 22px", textDecoration: "none", color: "inherit",
            }}
          >
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF", marginBottom: 6 }}>
              Write an Assignment
            </div>
            <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0 }}>
              You are 13i. You have been sent somewhere. Tell us what happens.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
