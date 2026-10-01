import { EXAMPLE } from "../../../lib/story/exampleStory";
import BookButton from "../_components/BookButton";

export const metadata = { title: "An example Story of Self", description: "What a finished Story of Self looks like. Maya is fictional, written for this preview." };

const words = (t) => (t.match(/\S+/g) || []).length;

export default function ExampleStory() {
  const total = EXAMPLE.parts.reduce((n, p) => n + p.sections.reduce((m, s) => m + words(s.text), 0), 0);
  return (
    <div className="sos-read">
      <div className="ex-note">
        <b>An example Story of Self</b>
        <span>Maya is fictional. Her story was written for this preview to show what a finished story looks like: {total.toLocaleString()} words, in Aaron's Final Write order.</span>
        <div className="ex-actions">
          <a className="sos-btn" href="/story/begin">Begin your own</a>
          <BookButton title={EXAMPLE.title} author={EXAMPLE.author} parts={EXAMPLE.parts} label="Download it as a book" />
        </div>
      </div>
      <article>
        <div className="sos-eyebrow" style={{ textAlign: "center" }}>A Story of Self by {EXAMPLE.author}</div>
        <h1>{EXAMPLE.title}</h1>
        {EXAMPLE.parts.map((p) => (
          <section key={p.part}>
            <h2>{p.part}</h2>
            {p.sections.map((s) => (
              <div key={s.label} className="ex-sec">
                <span className="ex-label">{s.label}</span>
                <p className={s.sentence ? "sos-read-line" : ""}>{s.text}</p>
              </div>
            ))}
          </section>
        ))}
        <p className="sos-read-end">Own your story.</p>
      </article>
      <p className="sos-read-tip">Aaron's rule: read your story, don't give a speech. Stick to the script. No freestyles.</p>
    </div>
  );
}
