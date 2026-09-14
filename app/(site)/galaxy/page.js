import Link from "next/link";

const sections = [
  {
    href: "/galaxy/map",
    title: "The Map",
    blurb: "A drag-to-rotate 3D view of the galaxy, with Earth marked.",
  },
  {
    href: "/galaxy/facts",
    title: "Galaxy Facts",
    blurb: "Size, star count, shape, age — the basics, for scale.",
  },
];

export default function GalaxyHub() {
  return (
    <div>
      <div className="page-title">The Galaxy</div>
      <div className="page-subtitle">where this all takes place</div>

      <div style={styles.grid}>
        {sections.map((s) => (
          <Link key={s.href} href={s.href} style={styles.card}>
            <div className="wordmark" style={styles.cardTitle}>{s.title}</div>
            <p style={styles.cardBlurb}>{s.blurb}</p>
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
