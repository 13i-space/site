import Link from "next/link";

const items = [
  { href: "/forum", title: "Forum", blurb: "A meeting place for Kin \u2014 new guests always welcome." },
  { href: "/guestbook", title: "Guestbook", blurb: "Leave something behind. See who else has passed through." },
];

export default function KinshipPage() {
  return (
    <div>
      <div className="page-title">Kinship</div>
      <div className="page-subtitle">you are not the only one who found this</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, maxWidth: 1000, margin: "0 auto" }}>
        {items.map((s) => (
          <Link key={s.href} href={s.href} className="launch-card" style={cardStyle}>
            <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF", marginBottom: 8 }}>{s.title}</div>
            <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0 }}>{s.blurb}</p>
          </Link>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#565B8F", marginTop: 32, fontStyle: "italic" }}>
        Curious what someone else found first?{" "}
        <Link href="/explore" style={{ color: "#8B95F6" }}>Go Explore</Link>.
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
