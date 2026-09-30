import Link from "next/link";

// Shared layout for the About pages: a title, the text, and links to the
// other About pages plus Contact Paul at the end.
//
// `blocks` is a list of: { h: "Heading" }, { p: "Paragraph" },
// { list: ["...", "..."] }, { term: "Name", p: "..." } or { strong: "..." }.

const PAGES = [
  { href: "/about/paul", title: "About Paul" },
  { href: "/about/origin", title: "The Origin of 13i" },
  { href: "/about/mission", title: "Mission & Values" },
];

export default function AboutProse({ title, subtitle, current, blocks, closing }) {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <Link href="/about" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; About
      </Link>
      <div className="page-title" style={{ marginTop: 16, marginBottom: 4 }}>{title}</div>
      {subtitle && <div className="page-subtitle">{subtitle}</div>}

      <div style={{ marginTop: 28, fontSize: 15.5, lineHeight: 1.85, color: "#C7CAE8" }}>
        {blocks.map((b, i) => {
          if (b.h) {
            return (
              <h2 key={i} style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontWeight: 400, fontSize: 24, color: "#DCDFFF", margin: "40px 0 12px" }}>
                {b.h}
              </h2>
            );
          }
          if (b.list) {
            return (
              <ul key={i} style={{ margin: "0 0 18px", paddingLeft: 20 }}>
                {b.list.map((item) => <li key={item} style={{ marginBottom: 4 }}>{item}</li>)}
              </ul>
            );
          }
          if (b.strong) {
            return (
              <p key={i} className="mono" style={{ margin: "22px 0", fontSize: 13, letterSpacing: "1.5px", color: "#E8CFC0", textAlign: "center" }}>
                {b.strong}
              </p>
            );
          }
          return (
            <p key={i} style={{ margin: "0 0 18px" }}>
              {b.term && <strong style={{ color: "#DCDFFF", fontWeight: 600 }}>{b.term}. </strong>}
              {b.p}
            </p>
          );
        })}
        {closing && (
          <div style={{ textAlign: "center", marginTop: 36 }}>
            {closing.map((line) => (
              <p key={line} style={{ margin: "6px 0", fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 19, color: "#8B95F6" }}>
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 48, paddingTop: 24, borderTop: "1px solid #21244A" }}>
        {PAGES.filter((p) => p.href !== current).map((p) => (
          <Link key={p.href} href={p.href} className="mono" style={styles.link}>{p.title} &rarr;</Link>
        ))}
        <Link href="/contact" className="mono" style={{ ...styles.link, borderColor: "#6B5E3E", color: "#E8CFC0" }}>Contact Paul &rarr;</Link>
      </div>
    </div>
  );
}

const styles = {
  link: {
    border: "1px solid #3A3E75",
    borderRadius: 4,
    padding: "9px 16px",
    fontSize: 12,
    color: "#B9C0FF",
    textDecoration: "none",
  },
};
