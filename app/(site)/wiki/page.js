import { WIKI_ENTRIES } from "../../../lib/wikiEntries";
const entries = WIKI_ENTRIES;

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
