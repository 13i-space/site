import SubmissionForm from "../../../components/SubmissionForm";

export default function AssignmentsPage() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div className="page-title">Assignments</div>
      <div className="page-subtitle">a community collection of short stories</div>

      <div className="panel" style={{ marginBottom: 28 }}>
        <p style={{ marginBottom: 14 }}>
          13i issues assignments — small tasks, given to individuals, meant
          to surface something true about what people share rather than
          what divides them. This is where the community's own responses to
          those assignments live.
        </p>
        <p style={{ margin: 0, color: "#8A8FBF", fontSize: 13.5 }}>
          Assignment 1 — the first, written to double as a guide for what
          this can look like — is coming soon. Full submission guidelines
          (length, tone, how closely to write in 13i's voice) will be
          posted here alongside it.
        </p>
      </div>

      <div style={{ marginBottom: 16, fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#DCDFFF" }}>
        Submit your own
      </div>
      <p style={{ fontSize: 13.5, color: "#8A8FBF", marginBottom: 20 }}>
        For now, submissions are saved here for Paul to read directly.
        There's no public gallery yet — that's coming as this section grows.
      </p>
      <SubmissionForm />
    </div>
  );
}
