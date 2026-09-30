import { isAlpha, alphaNumber } from "../lib/alpha";

// The Alpha User mark. "inline": a small α beside a name (forum, cards,
// profiles). "full": the badge with its number, for the Node and Kin pages.
export default function AlphaBadge({ profile, variant = "inline" }) {
  if (!isAlpha(profile)) return null;
  const n = alphaNumber(profile);
  if (variant === "inline") {
    return (
      <span className="mono" title={`Alpha User${n ? ` ${n}` : ""}: one of the first Kin, testing 13i before Beta`} style={styles.inline}>
        &alpha;
      </span>
    );
  }
  return (
    <span className="mono alpha-badge" style={styles.full}>
      <span style={{ fontSize: 13, marginRight: 6 }}>&alpha;</span>ALPHA USER{n ? ` · ${n}` : ""}
    </span>
  );
}

const styles = {
  inline: {
    display: "inline-block",
    marginLeft: 5,
    padding: "0 5px",
    border: "1px solid #6B5E3E",
    borderRadius: 3,
    color: "#E8CFC0",
    fontSize: "0.8em",
    lineHeight: 1.35,
    verticalAlign: "1px",
  },
  full: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    border: "1px solid #C9B98F",
    borderRadius: 14,
    color: "#E8CFC0",
    fontSize: 10.5,
    letterSpacing: "1.5px",
    background: "rgba(201,185,143,0.08)",
  },
};
