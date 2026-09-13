import Link from "next/link";

const artifacts = [
  {
    href: "/artifacts/ninefold",
    title: "The Ninefold",
    blurb: "Ask a question. Shake the pyramid. Nine faces, one answer.",
  },
  {
    href: "/artifacts/cryptex",
    title: "The Cryptex",
    blurb: "Three rings, nine marks. Find the order the mechanism accepts.",
  },
];

export default function ArtifactsHub() {
  return (
    <div>
      <div className="page-title">Artifacts</div>
      <div className="page-subtitle">objects from inside the story</div>

      <div style={styles.grid}>
        {artifacts.map((a) => (
          <Link key={a.href} href={a.href} style={styles.card}>
            <div className="wordmark" style={styles.cardTitle}>{a.title}</div>
            <p style={styles.cardBlurb}>{a.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
  },
  card: {
    display: "block",
    background: "rgba(14, 16, 38, 0.72)",
    border: "1px solid #262A55",
    borderRadius: 4,
    padding: "24px 20px",
    color: "inherit",
    textDecoration: "none",
  },
  cardTitle: { fontSize: 22, color: "#DCDFFF", marginBottom: 8 },
  cardBlurb: { fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: 0 },
};
