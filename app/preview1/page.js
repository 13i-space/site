import Link from "next/link";
import ConstellationField from "../../components/ConstellationField";
import OrbitalLogo from "../../components/OrbitalLogo";

const sections = [
  { title: "The Book", blurb: "First contact, told from three perspectives — two human, one not." },
  { title: "The Music", blurb: "Three albums, 36 signals. A translation of something felt, not heard." },
  { title: "The Oracle", blurb: "Speak to 13i directly." },
  { title: "Artifacts", blurb: "The Ninefold, the Cryptex, and more to come." },
];

export default function Preview1Constellation() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <ConstellationField density={70} linkDistance={130} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 60 }}>
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontStyle: "italic",
              fontSize: 22,
              color: "#DCDFFF",
            }}
          >
            13i
          </span>
          <Link
            href="/launch"
            className="mono"
            style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "0.5px" }}
          >
            &larr; back to the live site
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "1px", marginBottom: 20 }}>
            LOOK PREVIEW &mdash; CONSTELLATION
          </div>
          <div style={{ maxWidth: 340, margin: "0 auto" }}>
            <OrbitalLogo />
          </div>
          <div
            className="mono"
            style={{ fontSize: 13, color: "#8B95F6", letterSpacing: "2px", marginBottom: 16, marginTop: 24 }}
          >
            a signal, received
          </div>
          <p style={{ color: "#B7BADF", maxWidth: 520, margin: "0 auto" }}>
            Every point of light is watching. The lines between them are
            13i's collective mind, drawing itself in real time.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {sections.map((s) => (
            <div key={s.title} style={styles.card}>
              <div style={styles.cardCorner} />
              <div style={styles.cardTitle}>{s.title}</div>
              <p style={{ fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: 0 }}>{s.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    background: "rgba(14, 16, 38, 0.55)",
    backdropFilter: "blur(2px)",
    border: "1px solid #262A55",
    borderRadius: 4,
    padding: "24px 20px",
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
  cardTitle: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontStyle: "italic",
    fontSize: 22,
    color: "#DCDFFF",
    marginBottom: 8,
  },
};
