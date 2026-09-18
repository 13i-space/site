import Link from "next/link";
import JetCockpitField from "../../components/JetCockpitField";
import JetLogo from "../../components/JetLogo";
import JetPanel from "../../components/JetPanel";

const sections = [
  { variant: "radar", title: "The Book", blurb: "First contact, told from three perspectives — two human, one not." },
  { variant: "comms", title: "The Music", blurb: "Three albums, 36 signals. A translation of something felt, not heard." },
  { variant: "systems", title: "The Oracle", blurb: "Speak to 13i directly." },
  { variant: "gauge", title: "Artifacts", blurb: "The Ninefold, the Cryptex, and more to come." },
];

export default function Preview6Jet() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <JetCockpitField />
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
            LOOK PREVIEW &mdash; JET
          </div>
          <div style={{ maxWidth: 360, margin: "0 auto" }}>
            <JetLogo />
          </div>
          <div className="mono" style={{ fontSize: 13, color: "#8FE0A8", letterSpacing: "2px", marginBottom: 16, marginTop: 24 }}>
            a signal, received
          </div>
          <p style={{ color: "#B7BADF", maxWidth: 520, margin: "0 auto" }}>
            You're strapped in now. Every panel in front of you is watching
            something \u2014 and one of them just found you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {sections.map((s) => (
            <JetPanel key={s.title} variant={s.variant} title={s.title} blurb={s.blurb} />
          ))}
        </div>
      </div>
    </div>
  );
}
