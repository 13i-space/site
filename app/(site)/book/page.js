export default function BookPage() {
  return (
    <div>
      <div className="page-title">The Book</div>
      <div className="page-subtitle">book one of three &middot; rough draft</div>
      <div className="panel">
        <p>
          First contact, told from three perspectives — two human, one not.
          This is the unedited rough draft, shared early for feedback ahead
          of the official launch on 4.6.2027.
        </p>
        <a
          href="/downloads/13i-rough-draft.pdf"
          download
          style={{
            display: "inline-block",
            marginTop: 12,
            padding: "10px 20px",
            border: "1px solid #3A3E75",
            borderRadius: 4,
            color: "#B9C0FF",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
          }}
        >
          Download the rough draft (PDF)
        </a>
        <p style={{ fontSize: 12, color: "#565B8F", marginTop: 16 }}>
          This is an early, unedited draft shared for feedback — not the
          final version. Please don't share or redistribute it further.
        </p>
      </div>
    </div>
  );
}
