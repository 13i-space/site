import Link from "next/link";

export default function AssignmentsPage() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div className="page-title">Assignments</div>
      <div className="page-subtitle">a community collection of short stories</div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <p style={{ margin: 0 }}>
          13i issues assignments \u2014 small tasks, given to individuals, meant
          to surface something true about what people share rather than
          what divides them.
        </p>
      </div>

      <Link
        href="/assignments/0000001"
        className="launch-card"
        style={{
          display: "block", background: "rgba(14,16,38,0.72)", border: "1px solid #262A55",
          borderRadius: 4, padding: "20px 22px", marginBottom: 14, textDecoration: "none", color: "inherit",
        }}
      >
        <div className="mono" style={{ fontSize: 10.5, color: "#565B8F", letterSpacing: "1px", marginBottom: 6 }}>
          ASSIGNMENT 0000001 &middot; CANON
        </div>
        <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF", marginBottom: 6 }}>
          The First Silence
        </div>
        <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0 }}>
          The first Assignment on record. Read it in the browser, have it
          read aloud, or download the PDF.
        </p>
      </Link>

      <Link
        href="/assignments/write"
        className="launch-card"
        style={{
          display: "block", background: "rgba(14,16,38,0.72)", border: "1px solid #3A3E75",
          borderRadius: 4, padding: "20px 22px", textDecoration: "none", color: "inherit",
        }}
      >
        <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF", marginBottom: 6 }}>
          Write an Assignment
        </div>
        <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0 }}>
          You are 13i. You have been sent somewhere. Tell us what happens.
        </p>
      </Link>
    </div>
  );
}
