import Link from "next/link";

// A wide card for one Interactive Assignment: cover on the left, words on the right.
export default function InteractiveCard({ story, compact = false }) {
  return (
    <Link
      href={`/assignments/${story.number}/interactive`}
      className="launch-card"
      style={{
        display: "flex", gap: 20, alignItems: "stretch", textDecoration: "none", color: "inherit",
        background: "rgba(14,16,38,0.72)", border: "1px solid #6B5E3E", borderRadius: 4, padding: compact ? 14 : 18,
      }}
    >
      <img
        src={story.cover}
        alt=""
        style={{ width: compact ? 74 : 110, aspectRatio: "2 / 3", objectFit: "cover", borderRadius: 3, border: "1px solid #262A55", flexShrink: 0 }}
      />
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="mono" style={{ fontSize: 9.5, letterSpacing: "1.5px", color: "#C9B98F", marginBottom: 6 }}>
          INTERACTIVE · ASSIGNMENT {String(story.number).padStart(7, "0")}
        </div>
        <div className="wordmark" style={{ fontSize: compact ? 20 : 26, color: "#DCDFFF", marginBottom: 6 }}>{story.title}</div>
        <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0, lineHeight: 1.55 }}>{story.blurb}</p>
        {!compact && (
          <div className="mono" style={{ fontSize: 10.5, color: "#6E76B8", marginTop: 10 }}>
            YOU ARE 13i · {Object.keys(story.endings).length} RECORDS · ABOUT {story.minutes} MINUTES
          </div>
        )}
      </div>
    </Link>
  );
}
