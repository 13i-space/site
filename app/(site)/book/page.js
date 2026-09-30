import Link from "next/link";

const optionStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 8,
  boxSizing: "border-box",
  minHeight: 96,
  padding: "10px 20px",
  border: "1px solid #3A3E75",
  borderRadius: 4,
  color: "#B9C0FF",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13,
  textDecoration: "none",
};

const optionNote = { fontSize: 11, color: "#6E76B8", lineHeight: 1.5 };

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

          {/* five options, one size: a grid whose cells all stretch to the tallest */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gridAutoRows: "1fr", gap: 12, marginTop: 12 }}>
            <Link href="/book/chapter-1" style={optionStyle}>
              <span>Read Chapters 1 &amp; 2</span>
              <span style={optionNote}>in the online reader</span>
            </Link>
            <a href="/downloads/13i-chapters-1-2.pdf" download style={optionStyle}>
              <span>&#8681; Download Chapters 1 &amp; 2</span>
              <span style={optionNote}>the ebook, to keep</span>
            </a>
            {LISTEN.map((l) => (
              <div key={l.src} style={optionStyle}>
                <span>&#9658; {l.label}</span>
                <audio controls preload="none" style={{ width: "100%", height: 32 }}>
                  <source src={l.src} type="audio/mpeg" />
                </audio>
              </div>
            ))}
            <Link href="/wiki" style={optionStyle}>
              <span>The Wiki</span>
              <span style={optionNote}>characters, terms and the world so far &mdash; spoiler-light</span>
            </Link>
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
