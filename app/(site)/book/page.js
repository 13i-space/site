import Link from "next/link";

export default function BookPage() {
  return (
    <div>
      <div className="page-title">The Book</div>
      <div className="page-subtitle">book one of three &middot; rough draft</div>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 24 }}>
        <img
          src="/13i-book-cover.png"
          alt="13i book cover"
          style={{ width: 220, maxWidth: "100%", borderRadius: 4, border: "1px solid #262A55", flexShrink: 0 }}
        />
        <div className="panel" style={{ flex: 1, minWidth: 260 }}>
          <p>
            First contact, told from three perspectives — two human, one not.
            This is the unedited rough draft, shared early for feedback ahead
            of the official launch on 4.6.2027.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            <Link
              href="/book/chapter-1"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                border: "1px solid #3A3E75",
                borderRadius: 4,
                color: "#B9C0FF",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
              }}
            >
              Read Chapter One
            </Link>
            <a
              href="/downloads/13i-rough-draft.pdf"
              download
              style={{
                display: "inline-block",
                padding: "10px 20px",
                border: "1px solid #3A3E75",
                borderRadius: 4,
                color: "#B9C0FF",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
              }}
            >
              Download the full rough draft (PDF)
            </a>
          </div>
          <p style={{ fontSize: 12, color: "#565B8F", marginTop: 16 }}>
            This is an early, unedited draft shared for feedback — not the
            final version. Please don't share or redistribute it further.
          </p>
        </div>
      </div>
    </div>
  );
}
