"use client";

// The "Lyra assists" switch shown on the core games.
export default function LyraAssistToggle({ on, onToggle }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.currentTarget.blur(); onToggle(!on); }}
      aria-pressed={on}
      title={on ? "Lyra is helping. Her hits don't score - yours do." : "Let Lyra fly with you and help out"}
      className="mono"
      style={{
        background: on ? "rgba(139,149,246,0.16)" : "none",
        border: `1px solid ${on ? "#8B95F6" : "#3A3E75"}`,
        borderRadius: 4,
        color: on ? "#DCDFFF" : "#8A8FBF",
        fontSize: 11,
        padding: "4px 10px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", border: "1.5px solid #B9C0FF", background: on ? "#DCDFFF" : "transparent", boxShadow: on ? "0 0 6px rgba(139,149,246,0.9)" : "none" }} />
      LYRA ASSIST {on ? "ON" : "OFF"}
    </button>
  );
}
