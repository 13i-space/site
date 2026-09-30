import Link from "next/link";

const items = [
  { href: "/create/alien-lab", title: "The Alien Lab", blurb: "Build a species, question by question \u2014 the environment, the body, the mind." },
  { href: "/create/signal-composer", title: "Signal Composer", blurb: "A prototype: generate a loop in the 13i sound, shape it, or describe a feeling and let 13i compose it." },
  { href: "/assignments/write", title: "Write an Assignment", blurb: "You are 13i. You have been sent somewhere. Tell us what happens." },
];

const comingSoon = [];

export default function CreatePage() {
  return (
    <div>
      <div className="page-title">Create</div>
      <div className="page-subtitle">express yourself, inside the universe</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, maxWidth: 1000, margin: "0 auto" }}>
        {items.map((s) => (
          <Link key={s.href} href={s.href} className="launch-card" style={cardStyle}>
            <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF", marginBottom: 8 }}>{s.title}</div>
            <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0 }}>{s.blurb}</p>
          </Link>
        ))}
        {comingSoon.map((s) => (
          <div key={s.title} style={{ ...cardStyle, opacity: 0.45, cursor: "default" }}>
            <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 6 }}>COMING SOON</div>
            <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF", marginBottom: 8 }}>{s.title}</div>
            <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0 }}>{s.blurb}</p>
          </div>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#565B8F", marginTop: 32, fontStyle: "italic" }}>
        Made something? Bring it to{" "}
        <Link href="/kinship" style={{ color: "#8B95F6" }}>Kinship</Link>.
      </p>
    </div>
  );
}

const cardStyle = {
  display: "block",
  background: "rgba(14,16,38,0.72)",
  border: "1px solid #262A55",
  borderRadius: 4,
  padding: "24px 20px",
  color: "inherit",
  textDecoration: "none",
};
