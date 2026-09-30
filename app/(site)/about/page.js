import Link from "next/link";

const items = [
  { href: "/about/paul", title: "About Paul", blurb: "The person behind 13i: where I came from, and why it's never too late.", photo: true },
  { href: "/about/origin", title: "The Origin of 13i", blurb: "It didn't begin with a novel. It began with curiosity, and a song or two." },
  { href: "/about/mission", title: "Mission & Values", blurb: "Why 13i exists, Explore. Play. Create., and what it means to be Kin." },
];

export default function AboutHub() {
  return (
    <div>
      <div className="page-title">About</div>
      <div className="page-subtitle">the person, the origin, and the point of it all</div>

      <div style={styles.grid}>
        {items.map((s) => (
          <Link key={s.href} href={s.href} className="launch-card" style={styles.card}>
            {s.photo && (
              <img
                src="/paul-photo.jpg"
                alt=""
                style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", objectPosition: "center 20%", border: "1px solid #262A55", marginBottom: 12 }}
              />
            )}
            <div className="wordmark" style={{ fontSize: 22, color: "#DCDFFF", marginBottom: 8 }}>{s.title}</div>
            <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0, lineHeight: 1.6 }}>{s.blurb}</p>
          </Link>
        ))}
      </div>

      <Link href="/contact" className="panel" style={styles.contact}>
        <span>
          <span className="mono" style={{ display: "block", fontSize: 10, color: "#C9B98F", letterSpacing: "1.5px" }}>GET IN TOUCH</span>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#DCDFFF" }}>Contact Paul &rarr;</span>
        </span>
        <span style={{ fontSize: 13, color: "#8A8FBF", maxWidth: 420 }}>
          Questions, ideas, or feedback on the book, the music, or anything else here.
        </span>
      </Link>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 20,
    maxWidth: 1000,
    margin: "0 auto",
  },
  card: {
    display: "block",
    background: "rgba(14,16,38,0.72)",
    border: "1px solid #262A55",
    borderRadius: 4,
    padding: "24px 20px",
    color: "inherit",
    textDecoration: "none",
  },
  contact: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    maxWidth: 1000,
    margin: "24px auto 0",
    borderColor: "#6B5E3E",
    textDecoration: "none",
    boxSizing: "border-box",
  },
};
