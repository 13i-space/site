import Link from "next/link";
import CockpitField from "../../components/CockpitField";
import CockpitLogo from "../../components/CockpitLogo";

const sections = [
  { title: "The Book", blurb: "First contact, told from three perspectives — two human, one not." },
  { title: "The Music", blurb: "Three albums, 36 signals. A translation of something felt, not heard." },
  { title: "The Oracle", blurb: "Speak to 13i directly." },
  { title: "Artifacts", blurb: "The Ninefold, the Cryptex, and more to come." },
];

export default function Preview2Cockpit() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <CockpitField />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto", padding: "48px 32px 70px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 50 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF" }}>
            13i
          </span>
          <Link href="/launch" className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "0.5px" }}>
            &larr; back to the live site
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "1px", marginBottom: 20 }}>
            LOOK PREVIEW &mdash; COCKPIT
          </div>
          <div style={{ maxWidth: 360, margin: "0 auto" }}>
            <CockpitLogo />
          </div>
          <div className="mono" style={{ fontSize: 13, color: "#8B95F6", letterSpacing: "2px", marginBottom: 16, marginTop: 24 }}>
            a signal, received
          </div>
          <p style={{ color: "#B7BADF", maxWidth: 520, margin: "0 auto" }}>
            Everything nominal, until it wasn't. You're not looking at space
            anymore \u2014 you're looking at the panel of something built to survive it.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {sections.map((s) => (
            <div key={s.title} style={{ position: "relative", background: "rgba(20,22,42,0.75)", border: "1px solid #3A3E75", borderRadius: 6, padding: "24px 20px", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 22px 22px 0", borderColor: "transparent rgba(139,149,246,0.16) transparent transparent" }} />
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF", marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: 0 }}>{s.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
