import Link from "next/link";
import GravityWaves from "../../components/GravityWaves";

const sections = [
  { title: "The Book", blurb: "First contact, told from three perspectives — two human, one not." },
  { title: "The Music", blurb: "Three albums, 36 signals. A translation of something felt, not heard." },
  { title: "The Oracle", blurb: "Speak to 13i directly." },
  { title: "Games", blurb: "NEMESIS Command, and 13i vs NEMESIS." },
];

export default function PreviewGravityWaves() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <GravityWaves />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 60 }}>
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontStyle: "italic",
              fontSize: 22,
              color: "#F0DCC8",
            }}
          >
            13i
          </span>
          <Link
            href="/launch"
            className="mono"
            style={{ fontSize: 11, color: "#9A8A95", letterSpacing: "0.5px" }}
          >
            &larr; back to the live site
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div className="mono" style={{ fontSize: 11, color: "#9A8A95", letterSpacing: "1px", marginBottom: 20 }}>
            LOOK PREVIEW &mdash; GRAVITY WAVES
          </div>
          <img src="/13i-logo.png" alt="13i" style={{ width: 140, height: "auto", marginBottom: 20, filter: "drop-shadow(0 0 30px rgba(232,207,192,0.2))" }} />
          <div
            className="mono"
            style={{ fontSize: 13, color: "#C9A896", letterSpacing: "2px", marginBottom: 16 }}
          >
            a signal, translated
          </div>
          <p style={{ color: "#C7B8C4", maxWidth: 520, margin: "0 auto" }}>
            Where the starfield leans cosmic, this leans instrumental —
            ripples expanding outward the way a gravitational wave passes
            through spacetime, on a warmer, quieter palette.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {sections.map((s) => (
            <div
              key={s.title}
              style={{
                background: "rgba(30, 18, 28, 0.5)",
                backdropFilter: "blur(2px)",
                border: "1px solid rgba(150, 100, 100, 0.25)",
                borderRadius: 4,
                padding: "24px 20px",
              }}
            >
              <div
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 22,
                  color: "#F0DCC8",
                  marginBottom: 8,
                }}
              >
                {s.title}
              </div>
              <p style={{ fontSize: 13, color: "#B5A2AC", lineHeight: 1.6, margin: 0 }}>
                {s.blurb}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
