import Link from "next/link";

const optionStyle = {
  display: "inline-block",
  padding: "10px 20px",
  border: "1px solid #3A3E75",
  borderRadius: 4,
  color: "#B9C0FF",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13,
  textDecoration: "none",
};

const LISTEN = [
  { label: "Listen to Chapter 1", src: "/audio/Chapter1.mp3" },
  { label: "Listen to Chapter 2", src: "/audio/Chapter2.mp3" },
];

export default function BookPage() {
  return (
    <div>
      <div className="page-title">The Book</div>
      <div className="page-subtitle">book one of three &middot; rough draft</div>

      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 24 }}>
        <Link href="/book/chapter-1" style={{ flexShrink: 0 }}>
          <img
            src="/13i-book-cover.png"
            alt="13i book cover"
            style={{ width: 220, maxWidth: "100%", borderRadius: 4, border: "1px solid #262A55", cursor: "pointer" }}
          />
        </Link>
        <div className="panel" style={{ flex: 1, minWidth: 260 }}>
          <p>
            First contact, told from three perspectives — two human, one not.
            This is the unedited rough draft, shared early for feedback ahead
            of the official launch on 4.6.2027.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            <Link href="/book/chapter-1" style={optionStyle}>
              Read Chapters 1 &amp; 2
            </Link>
            <a href="/downloads/13i-chapters-1-2.pdf" download style={optionStyle}>
              &#8681; Download Chapters 1 &amp; 2
            </a>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            {LISTEN.map((l) => (
              <div key={l.src} style={{ ...optionStyle, flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 8 }}>
                <span>&#9658; {l.label}</span>
                <audio controls preload="none" style={{ width: "100%", height: 32 }}>
                  <source src={l.src} type="audio/mpeg" />
                </audio>
              </div>
            ))}
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
