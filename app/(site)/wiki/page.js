const entries = [
  {
    term: "13i",
    body: "An ancient, collective intelligence — not a single being. 13i always refers to itself as \"we/us/our,\" never \"I.\" It has carried out a long history of contact with young civilizations across the galaxy, and Earth is one assignment among many, evaluated with the same careful, detached attention any of the others received.",
  },
  {
    term: "Aiden",
    body: "The first human to make contact with 13i. Much of Book One follows his perspective as he goes from discovery to something closer to friendship with a mind he can barely comprehend.",
  },
  {
    term: "Xavier",
    body: "The second human thread of the story — closer to the institutional, corporate, and political response to first contact than Aiden is. Where Aiden's chapters are personal, Xavier's show what happens when the rest of the world finds out.",
  },
  {
    term: "Lyra",
    body: "An AI application originally built by Aiden and Xavier, later enhanced by 13i and used as a conduit — a way to reach more people than 13i could otherwise speak to directly.",
  },
  {
    term: "Assignment",
    body: "13i's word for a mission or task — both the grand kind (a civilization at a critical turning point) and the small kind (something asked of one person). The community's own \"Assignments\" section borrows this term directly from the book.",
  },
  {
    term: "The Golden Rule",
    body: "Not 13i's own moral code, but its diagnostic tool. 13i has observed that civilizations capable of reciprocity — of treating others as they'd want to be treated — tend to coexist peacefully with others. A species that struggles to manage this internally, 13i suggests, tends not to fare well when it meets anyone else.",
  },
  {
    term: "The Fibonacci Signal",
    body: "One of the earliest hints of 13i's presence — a pattern too mathematically clean to be coincidence, detected using gravitational-wave methods not unlike real observatories like LIGO and LISA.",
  },
];

export default function WikiPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="page-title">The Wiki</div>
      <div className="page-subtitle">the basics, spoiler-light</div>

      <div className="panel" style={{ marginBottom: 28 }}>
        <p style={{ margin: 0, fontSize: 13.5, color: "#8A8FBF" }}>
          This is a starting glossary, not the whole story. It's kept
          deliberately light on anything past the early chapters — some
          things are worth discovering for yourself.
        </p>
      </div>

      {entries.map((e) => (
        <div key={e.term} style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontStyle: "italic",
              fontSize: 20,
              color: "#DCDFFF",
              marginBottom: 6,
            }}
          >
            {e.term}
          </div>
          <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "#C7CAE8", margin: 0 }}>
            {e.body}
          </p>
        </div>
      ))}
    </div>
  );
}
