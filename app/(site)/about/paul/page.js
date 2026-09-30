import Link from "next/link";

const paragraphs = [
  "Paul Donaghy was born in Birmingham, England, on April 6, 1967, and moved to the United States with his family when he was three. Raised in Michigan, he developed an early fascination with dinosaurs, the natural world, and the possibilities of life beyond Earth.",
  "After earning a degree in Marketing from Michigan State University and an MBA from Wayne State University, Paul spent more than two decades in business leadership, eventually leaving corporate America to pursue his passion for soccer. He founded a youth soccer academy, worked in professional and semi-professional soccer and futsal, and built businesses along the way.",
  "A lifelong planner and believer in taking calculated risks, Paul eventually reached financial independence and retired at 53. Retirement, however, didn't mean slowing down. After several demanding years caring for family, he finally had something he had rarely had before: time to explore the ideas and interests that had always been waiting in the background.",
  "That led somewhere unexpected.",
  "First came music. With no formal background in music production, Paul opened Logic and simply started experimenting. One song became another, and eventually a growing catalog of instrumental electronic music emerged.",
  "Then came 13i.",
  "Inspired by his lifelong fascination with space, extraterrestrial possibilities, and the emerging world of artificial intelligence, Paul began developing a story about an alien AI observing humanity from outside our world. What started as an idea gradually became a novel — and then something much larger: a universe encompassing stories, music, technology, and the possibility of contributions from others.",
  "Paul approaches creativity much like he has approached everything else in his life: strategically, with discipline, curiosity, and a willingness to tackle things that seem difficult or even impossible.",
  "He believes that perspective matters. Looking at humanity through the eyes of an outsider has led him to think differently about our differences, our similarities, our technology, and what it means to be part of the same human tribe.",
  "And perhaps most importantly, Paul believes it is never too late.",
  "At 60, he plans to release his first novel and his first music on April 6, 2027 — his 60th birthday.",
  "For Paul, the date isn't simply a deadline. It's a statement.",
  "A reminder that the things we once thought were impossible may simply be things we haven't tried yet.",
  "With the unwavering support of his wife, Alma, and the belief that there is always another challenge worth tackling, Paul continues to explore what might be possible when we stop putting limits on ourselves.",
];

export default function AboutPaulPage() {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
      <div style={{ textAlign: "left", marginBottom: 20 }}>
        <Link href="/about" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>&larr; About</Link>
      </div>
      <img
        src="/paul-photo.jpg"
        alt="Paul Donaghy"
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          objectFit: "cover",
          objectPosition: "center 20%",
          border: "1px solid #262A55",
          display: "inline-block",
        }}
      />
      <div style={{ marginTop: 20 }}>
        <div className="page-title" style={{ marginBottom: 4 }}>
          Paul Donaghy
        </div>
        <div className="mono" style={{ fontSize: 11, color: "#565B8F" }}>
          writer &middot; composer &middot; the person behind 13i
        </div>
      </div>

      <div style={{ textAlign: "left", marginTop: 36, fontSize: 15, lineHeight: 1.85, color: "#C7CAE8" }}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ marginBottom: 18 }}>
            {p}
          </p>
        ))}
        <p style={{ textAlign: "center", fontStyle: "italic", color: "#8B95F6", marginTop: 30 }}>
          It is never too late.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 40, paddingTop: 24, borderTop: "1px solid #21244A" }}>
        <Link href="/about/origin" className="mono" style={linkStyle}>The Origin of 13i &rarr;</Link>
        <Link href="/about/mission" className="mono" style={linkStyle}>Mission &amp; Values &rarr;</Link>
      </div>

      <Link href="/contact" className="panel" style={contactStyle}>
        <span>
          <span className="mono" style={{ display: "block", fontSize: 10, color: "#C9B98F", letterSpacing: "1.5px" }}>GET IN TOUCH</span>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#DCDFFF" }}>Contact Paul &rarr;</span>
        </span>
        <span style={{ fontSize: 13, color: "#8A8FBF", maxWidth: 360, textAlign: "left" }}>
          Questions, ideas, or feedback on the book, the music, or anything else here.
        </span>
      </Link>
    </div>
  );
}

const linkStyle = {
  border: "1px solid #3A3E75",
  borderRadius: 4,
  padding: "9px 16px",
  fontSize: 12,
  color: "#B9C0FF",
  textDecoration: "none",
};

const contactStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  flexWrap: "wrap",
  marginTop: 24,
  borderColor: "#6B5E3E",
  textDecoration: "none",
  textAlign: "left",
  boxSizing: "border-box",
};
