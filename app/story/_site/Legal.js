import { LAST_UPDATED } from "../../../lib/story/site";

// Shared layout for the privacy policy and terms of use.
export default function Legal({ title, intro, sections }) {
  return (
    <div className="sp">
      <section className="sp-hero small">
        <div className="sp-wrap">
          <div className="sos-eyebrow">Last updated {LAST_UPDATED}</div>
          <h1>{title}</h1>
          <p className="sp-lede">{intro}</p>
          <p className="sp-draft">Preview draft: this page will be reviewed by counsel before our full launch.</p>
        </div>
      </section>
      <section className="sp-sec">
        <div className="sp-wrap sp-legal">
          <nav className="sp-toc" aria-label="On this page">
            <b>On this page</b>
            {sections.map((s, i) => <a key={s.h} href={`#s${i + 1}`}>{i + 1}. {s.h}</a>)}
          </nav>
          <div className="sp-legal-body">
            {sections.map((s, i) => (
              <section key={s.h} id={`s${i + 1}`}>
                <h2>{i + 1}. {s.h}</h2>
                {s.p && s.p.map((t) => <p key={t}>{t}</p>)}
                {s.list && <ul>{s.list.map((t) => <li key={t}>{t}</li>)}</ul>}
                {s.after && s.after.map((t) => <p key={t}>{t}</p>)}
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
