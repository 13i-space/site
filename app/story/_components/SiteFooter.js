import { FOOTER } from "../../../lib/story/site";

export default function SiteFooter() {
  return (
    <footer className="sos-foot">
      <div className="sos-foot-grid">
        <div className="sos-foot-brand">
          <a href="/story" className="sos-brand"><span className="sos-brand-mark" aria-hidden="true" />Story <em>of</em> Self</a>
          <p>Own your story before the next chapter begins.</p>
        </div>
        {FOOTER.map((c) => (
          <div key={c.h} className="sos-foot-col">
            <b>{c.h}</b>
            {c.links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
        ))}
      </div>
      <p className="sos-foot-safety">
        Story of Self is a guided reflection program, not therapy or counseling. If you're struggling or not safe, call or text <strong>988</strong> (U.S.),
        or text <strong>HOME</strong> to <strong>741741</strong>. In an emergency, call 911.
      </p>
      <p className="sos-foot-small">© {new Date().getFullYear()} Story of Self · Story of Self method © Aaron Donaghy · Preview</p>
    </footer>
  );
}
