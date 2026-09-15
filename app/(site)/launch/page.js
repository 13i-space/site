import Link from "next/link";
import ThemedHero from "../../../components/ThemedHero";

const sections = [
  {
    href: "/book",
    title: "The Book",
    blurb: "First contact, told from three perspectives — two human, one not. Read the rough draft now.",
  },
  {
    href: "/music",
    title: "The Music",
    blurb: "Three albums, 36 signals. What you hear is a translation of something felt, not heard.",
  },
  {
    href: "/oracle",
    title: "The Oracle",
    blurb: "Speak to 13i directly.",
  },
  {
    href: "/games",
    title: "Games",
    blurb: "NEMESIS Command, Asteroid Belt, and 13i vs NEMESIS.",
  },
  {
    href: "/artifacts",
    title: "Artifacts",
    blurb: "The Ninefold and the Cryptex — puzzles from beyond.",
  },
  {
    href: "/wiki",
    title: "The Wiki",
    blurb: "The basics — characters, terms, the shape of the world so far.",
  },
  {
    href: "/assignments",
    title: "Assignments",
    blurb: "A growing community collection of short stories.",
  },
  {
    href: "/galaxy",
    title: "The Galaxy",
    blurb: "Where this all takes place, with Earth marked on the map.",
  },
];

export default function LaunchHome() {
  return (
    <div>
      <div style={{ textAlign: "center", padding: "20px 0 50px" }}>
        <div style={{ maxWidth: 160, margin: "0 auto 20px" }}>
          <ThemedHero background={false} />
        </div>
        <div className="page-subtitle" style={{ marginBottom: 0 }}>a signal, translated</div>
        <p style={{ color: "#B7BADF", maxWidth: 520, margin: "16px auto 0" }}>
          A working preview of the 13i universe — the book, the music, and
          the tools built around them. Everything here is in progress.
        </p>
      </div>

      <div style={styles.grid}>
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="launch-card" style={styles.card}>
            <div style={styles.cardCorner} />
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
    position: "relative",
    display: "block",
    background: "rgba(14, 16, 38, 0.72)",
    border: "1px solid #262A55",
    borderRadius: 4,
    padding: "24px 20px",
    color: "inherit",
    textDecoration: "none",
    overflow: "hidden",
  },
  cardCorner: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: "0 22px 22px 0",
    borderColor: "transparent rgba(139,149,246,0.14) transparent transparent",
  },
  cardTitle: { fontSize: 22, color: "#DCDFFF", marginBottom: 8 },
  cardBlurb: { fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: 0 },
};
