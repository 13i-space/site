import AlienPlaceholder from "../../../components/AlienPlaceholder";

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

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
      <AlienPlaceholder size={180} />
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
    </div>
  );
}
