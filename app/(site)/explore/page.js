import Link from "next/link";

const items = [
  { href: "/book", title: "The Book", blurb: "First contact, told from three perspectives \u2014 two human, one not. Read the rough draft now." },
  { href: "/music", title: "The Music", blurb: "Three albums, 36 signals. What you hear is a translation of something felt, not heard." },
  { href: "/assignments", title: "Short Stories", blurb: "A growing archive of Assignments \u2014 13i, sent somewhere, reporting back." },
  { href: "/galaxy", title: "The Galaxy", blurb: "Where this all takes place, with Earth marked on the map." },
  { href: "/wiki", title: "The Wiki", blurb: "Characters, terms, and the shape of the world so far \u2014 spoiler-light." },
];

export default function ExplorePage() {
  return (
    <div>
      <div className="page-title">Explore</div>
      <div className="page-subtitle">what's already here, waiting to be found</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, maxWidth: 1000, margin: "0 auto" }}>
        {items.map((s) => (
          <Link key={s.href} href={s.href} className="launch-card" style={cardStyle}>
            <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF", marginBottom: 8 }}>{s.title}</div>
            <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0 }}>{s.blurb}</p>
          </Link>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#565B8F", marginTop: 32, fontStyle: "italic" }}>
        Found something that makes you want to do more than read?{" "}
        <Link href="/play" style={{ color: "#8B95F6" }}>Go Play</Link>.
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
