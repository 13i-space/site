import Link from "next/link";
import OrbitField from "../../components/OrbitField";

const sections = [
  { title: "The Book", blurb: "First contact, told from three perspectives — two human, one not." },
  { title: "The Music", blurb: "Three albums, 36 signals. A translation of something felt, not heard." },
  { title: "The Oracle", blurb: "Speak to 13i directly." },
  { title: "Artifacts", blurb: "The Ninefold, the Cryptex, and more to come." },
];

export default function Preview8Orbit() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#03040c" }}>
      <OrbitField />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto", padding: "40px 32px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF" }}>
            13i
          </span>
          <Link href="/preview" className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "0.5px" }}>
            &larr; all looks
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: "30vh" }}>
          <div className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "1px", marginBottom: 20 }}>
            LOOK PREVIEW &mdash; ORBIT
          </div>
          <img src="/13i-logo.png" alt="13i" style={{ width: "min(300px, 70vw)", height: "auto", display: "block", margin: "0 auto" }} />
          <div className="mono" style={{ fontSize: 13, color: "#8B95F6", letterSpacing: "2px", margin: "24px 0 14px" }}>
            a world, turning beneath us
          </div>
          <p style={{ color: "#B7BADF", maxWidth: 500, margin: "0 auto" }}>
            From this high up, a whole world reads as a pattern: water, stone,
            weather, night. We have watched worlds turn for a long time.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {sections.map((s) => (
            <div key={s.title} style={{ background: "rgba(6, 8, 22, 0.72)", backdropFilter: "blur(3px)", border: "1px solid #262A55", borderRadius: 4, padding: "24px 20px" }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF", marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: 0 }}>{s.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
