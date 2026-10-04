import Link from "next/link";

const sections = [
  {
    href: "/galaxy/black-hole",
    title: "The Black Hole",
    feature: "NEW EVERY WEEK",
    blurb: "A weekly deep dive into one idea in space and physics, a step at a time, with something to touch at every step. No. 1: The Shape of Gravity.",
  },
  {
    href: "/galaxy/map",
    title: "The Map",
    blurb: "A 3D view of the galaxy you can turn and zoom — with Earth, the worlds of the Assignments you've read, and every Kin species.",
  },
  {
    href: "/galaxy/aliens",
    title: "Aliens of the Galaxy",
    blurb: "Every species built in the Alien Lab, as collectible cards. Browse them, then make your own.",
  },
  {
    href: "/quiz",
    title: "Universe Quiz",
    blurb: "Ten questions from across the cosmos, graded A+ to F.",
  },
  {
    href: "/galaxy/facts",
    title: "Galaxy Facts",
    blurb: "Zoom from you to the whole universe, ride a light beam, and watch galaxies collide. Hands-on.",
  },
  {
    href: "/galaxy/news",
    title: "Space News",
    blurb: "Current headlines from NASA, ESA, Spaceflight Now, Universe Today and more, refreshed through the day.",
  },
];

export default function GalaxyHub() {
  return (
    <div>
      <div className="page-title">The Galaxy</div>
      <div className="page-subtitle">where this all takes place</div>

      <div style={styles.grid}>
        {sections.map((s) => (
          <Link key={s.href} href={s.href} style={s.feature ? { ...styles.card, ...styles.feature } : styles.card} className={s.feature ? "galaxy-feature" : undefined}>
            {s.feature && <div className="mono" style={styles.featureTag}>{s.feature}</div>}
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
  feature: {
    gridColumn: "1 / -1",
    border: "1px solid rgba(233,210,154,0.45)",
    background: "radial-gradient(circle at 92% 50%, rgba(0,0,0,0.95) 0 46px, rgba(233,210,154,0.35) 50px, rgba(139,149,246,0.12) 90px, rgba(14,16,38,0.85) 160px)",
    padding: "28px 180px 28px 24px",
  },
  featureTag: { fontSize: 10, letterSpacing: "2px", color: "#E9D29A", marginBottom: 8 },
  cardTitle: { fontSize: 22, color: "#DCDFFF", marginBottom: 8 },
  cardBlurb: { fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: 0 },
};
