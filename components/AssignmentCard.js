import Link from "next/link";

function pad(n) {
  return String(n).padStart(7, "0");
}

export default function AssignmentCard({ number, title, author, type, thumbUrl, href, alreadyRead }) {
  return (
    <Link
      href={href}
      className="launch-card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: alreadyRead ? "rgba(139, 149, 246, 0.08)" : "rgba(14,16,38,0.72)",
        border: "1px solid #262A55",
        borderRadius: 4,
        padding: "14px 16px",
        textDecoration: "none",
        color: "inherit",
        opacity: alreadyRead ? 0.7 : 1,
      }}
    >
      <div
        style={{
          width: 48, height: 48, borderRadius: 3, overflow: "hidden", flexShrink: 0,
          background: "#1C1F48", border: "1px solid #3A3E75",
        }}
      >
        {thumbUrl && (
          <img src={thumbUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px" }}>
          ASSIGNMENT {pad(number)}
        </div>
        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 16, color: "#DCDFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title}
        </div>
        <div className="mono" style={{ fontSize: 10.5, color: "#6E76B8" }}>
          {type === "ai" ? "Written by AI" : author || "Anonymous"}
        </div>
      </div>

      <div style={{ width: 48, height: 48, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {type === "ai" ? (
          <svg width="40" height="40" viewBox="0 0 40 40">
            <line x1="20" y1="18" x2="20" y2="33" stroke="#B9C0FF" strokeWidth="3" strokeLinecap="round" />
            <circle cx="20" cy="9" r="5.5" fill="none" stroke="#E8CFC0" strokeWidth="2.4" />
            <circle cx="20" cy="9" r="2" fill="#E8CFC0" />
          </svg>
        ) : (
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="10" r="6" fill="none" stroke="#6E76B8" strokeWidth="2.4" />
            <path d="M 9 34 L 9 26 Q 9 18 20 18 Q 31 18 31 26 L 31 34" fill="none" stroke="#6E76B8" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </Link>
  );
}
