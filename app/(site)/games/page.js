import Link from "next/link";

const games = [
  {
    href: "/games/nemesis-command",
    title: "NEMESIS Command",
    blurb: "Aim and fire. A fast, arcade take on NEMESIS's threat-elimination logic.",
  },
  {
    href: "/games/asteroid-belt",
    title: "Asteroid Belt",
    blurb: "An Asteroids-style original — clear the belt, and watch for the mining ship's twelve tungsten rods.",
  },
  {
    href: "/games/13i-vs-nemesis",
    title: "13i vs NEMESIS",
    blurb: "Defend Earth across five zones of approach, with multiple weapons and countermeasures.",
  },
];

export default function GamesHub() {
  return (
    <div>
      <div className="page-title">Games</div>
      <div className="page-subtitle">two ways to play</div>

      <div style={styles.grid}>
        {games.map((g) => (
          <Link key={g.href} href={g.href} style={styles.card}>
            <div className="wordmark" style={styles.cardTitle}>{g.title}</div>
            <p style={styles.cardBlurb}>{g.blurb}</p>
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
