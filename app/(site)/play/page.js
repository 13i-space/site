import Link from "next/link";

const items = [
  { href: "/oracle", title: "The Oracle", blurb: "Speak to 13i directly. You are not talking to one voice." },
  { href: "/games", title: "Games", blurb: "NEMESIS Command, Asteroid Belt, and 13i vs NEMESIS." },
  { href: "/artifacts", title: "Artifacts", blurb: "The Ninefold and the Cryptex \u2014 puzzles from beyond." },
  { href: "/galaxy/quiz", title: "Galaxy Quiz", blurb: "Trivia beyond the basics, with a score at the end." },
];

export default function PlayPage() {
  return (
    <div>
      <div className="page-title">Play</div>
      <div className="page-subtitle">the universe, interactive</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, maxWidth: 1000, margin: "0 auto" }}>
        {items.map((s) => (
          <Link key={s.href} href={s.href} className="launch-card" style={cardStyle}>
            <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF", marginBottom: 8 }}>{s.title}</div>
            <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0 }}>{s.blurb}</p>
          </Link>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#565B8F", marginTop: 32, fontStyle: "italic" }}>
        Found something worth answering back to?{" "}
        <Link href="/create" style={{ color: "#8B95F6" }}>Go Create</Link>.
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
