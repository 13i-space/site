import StarField from "../../../components/StarField";

const sections = [
  { href: "/book", title: "The Book", blurb: "First contact, told from three perspectives — two human, one not." },
  { href: "/music", title: "The Music", blurb: "Three albums, 36 signals. A translation of something felt, not heard." },
  { href: "/oracle", title: "The Oracle", blurb: "Speak to 13i directly." },
  { href: "/games", title: "Games", blurb: "NEMESIS Command, and 13i vs NEMESIS." },
];

export default function PreviewSpace() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <StarField density={160} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto", padding: "60px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div className="mono" style={{ fontSize: 11, color: "#8A8FBF", letterSpacing: "1px", marginBottom: 20 }}>
            LOOK PREVIEW &mdash; STARFIELD
          </div>
          <img src="/13i-logo.png" alt="13i" style={{ width: 140, height: "auto", marginBottom: 20 }} />
          <div className="page-subtitle" style={{ marginBottom: 0 }}>a signal, translated</div>
          <p style={{ color: "#B7BADF", maxWidth: 520, margin: "16px auto 40px" }}>
            Same site, same pages — just testing whether a quiet starfield
            behind everything feels more like home than the plain gradient.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {sections.map((s) => (
            <div key={s.href} style={{ background: "rgba(14, 16, 38, 0.55)", backdropFilter: "blur(2px)", border: "1px solid #262A55", borderRadius: 4, padding: "24px 20px" }}>
              <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF", marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: 0 }}>{s.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
