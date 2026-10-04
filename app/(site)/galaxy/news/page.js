import Link from "next/link";
import { getSpaceNewspaper, NEWS_SOURCES } from "../../../../lib/spaceNews";
import NewsImage from "../../../../components/news/NewsImage";

// Rebuild this page with fresh headlines at most every 30 minutes
// (matches NEWS_REFRESH_SECONDS in lib/spaceNews.js).
export const revalidate = 1800;

// Update 5.55: Space News as an old broadsheet - The Galactic Gazette.
// A masthead, a front-page lead with the best picture of the day, then one
// section per source, each with its own pictured lead and columns of
// shorter dispatches.

function formatDate(iso, opts = { month: "short", day: "numeric" }) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

function Story({ a, size = "brief", noImage = false }) {
  return (
    <a href={a.link} target="_blank" rel="noopener noreferrer" className={`gz-story gz-${size}`}>
      {size !== "brief" && <NewsImage src={a.image} alt={a.title} source={a.source} tall={size === "lead"} />}
      {size === "brief" && a.image && !noImage && <NewsImage src={a.image} alt={a.title} source={a.source} />}
      <div className="gz-head">{a.title}</div>
      <div className="gz-byline">{a.source}{a.date && <> &middot; {formatDate(a.date)}</>}</div>
      {a.summary && <p className="gz-sum">{a.summary}</p>}
    </a>
  );
}

export default async function SpaceNewsPage() {
  const { sections, lead } = await getSpaceNewspaper();
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const issue = Math.floor((now - start) / 86400000);
  const front = lead ? sections.flatMap((s) => s.articles).filter((a) => a.link !== lead.link).sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 6) : [];

  return (
    <div className="gz-wrap">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700;900&display=swap"
      />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Link href="/galaxy" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to The Galaxy
      </Link>

      <article className="gz-paper">
        <header className="gz-mast">
          <div className="gz-ears">
            <span>Vol. XIII &middot; No. {issue}</span>
            <span className="gz-ear-mid">&ldquo;All the cosmos that&rsquo;s fit to print&rdquo;</span>
            <span>Price: one signal</span>
          </div>
          <h1 className="gz-title">The Galactic Gazette</h1>
          <div className="gz-dateline">
            <span>{formatDate(now.toISOString(), { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
            <span>Received &amp; translated by 13i</span>
            <span>Late edition &middot; refreshed every half hour</span>
          </div>
        </header>

        {!lead ? (
          <p className="gz-empty">The presses are quiet. No dispatches are coming through right now &mdash; check back shortly.</p>
        ) : (
          <>
            <section className="gz-front">
              <div className="gz-front-lead">
                <Story a={lead} size="lead" />
              </div>
              <div className="gz-front-side">
                <div className="gz-kicker">Also on the wire</div>
                {front.map((a, i) => <Story key={a.link} a={a} size="brief" noImage={i > 0} />)}
              </div>
            </section>

            <nav className="gz-index" aria-label="Sections">
              <span>In this edition:</span>
              {sections.map((s) => <a key={s.name} href={`#gz-${s.name.replace(/\W+/g, "")}`}>{s.section}</a>)}
            </nav>

            {sections.map((s, i) => (
              <section key={s.name} id={`gz-${s.name.replace(/\W+/g, "")}`} className={`gz-section ${i % 2 ? "gz-flip" : ""}`}>
                <h2 className="gz-sec-title">
                  <span>{s.section}</span>
                  <small>dispatches from {s.name}</small>
                </h2>
                <div className="gz-sec-body">
                  <div className="gz-sec-lead"><Story a={s.articles[0]} size="feature" /></div>
                  <div className="gz-cols">
                    {s.articles.slice(1).map((a) => <Story key={a.link} a={a} size="brief" />)}
                  </div>
                </div>
              </section>
            ))}
          </>
        )}

        <footer className="gz-foot">
          Dispatches from {NEWS_SOURCES.map((s) => s.name).join(", ")}. Each story opens on its original site in a new tab;
          pictures belong to their publishers.
        </footer>
      </article>
    </div>
  );
}

const CSS = `
.gz-wrap { max-width: 1080px; margin: 0 auto; padding: 0 16px 40px; }
.gz-paper {
  margin-top: 16px; color: #241d12; position: relative;
  background:
    radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.35), transparent 60%),
    radial-gradient(ellipse at 80% 90%, rgba(120,90,40,0.12), transparent 55%),
    #efe4cc;
  padding: 26px clamp(14px, 3vw, 38px) 30px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.25);
  font-family: 'Old Standard TT', Georgia, serif;
}
.gz-paper::after { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.18; mix-blend-mode: multiply;
  background-image: repeating-linear-gradient(0deg, rgba(60,40,10,0.07) 0 1px, transparent 1px 3px); }
.gz-mast { text-align: center; border-bottom: 4px double #241d12; padding-bottom: 8px; }
.gz-ears { display: flex; justify-content: space-between; gap: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #241d12; padding-bottom: 6px; }
.gz-ear-mid { font-style: italic; text-transform: none; letter-spacing: 0; font-size: 13px; }
.gz-title { font-family: 'UnifrakturMaguntia', 'Old English Text MT', serif; font-weight: 400; font-size: clamp(40px, 8.5vw, 92px); line-height: 1; margin: 12px 0 8px; color: #16110a; }
.gz-dateline { display: flex; justify-content: space-between; gap: 10px; border-top: 1px solid #241d12; border-bottom: 1px solid #241d12; padding: 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
.gz-empty { text-align: center; font-style: italic; padding: 40px 0; font-size: 18px; }

.gz-story { display: block; color: inherit; text-decoration: none; }
.gz-story:hover { text-decoration: none; }
.gz-story:hover .gz-head { text-decoration: underline; text-decoration-thickness: 1px; }
.gz-story:hover .gz-photo { filter: none; }
.gz-head { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; line-height: 1.15; color: #16110a; }
.gz-byline { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; margin: 6px 0 4px; color: #5a4a30; }
.gz-sum { margin: 0; font-size: 14px; line-height: 1.5; text-align: justify; hyphens: auto; }
.gz-photo { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; margin-bottom: 10px; border: 1px solid #241d12;
  filter: sepia(0.55) contrast(1.05) saturate(0.8); transition: filter 0.4s; background: #d9cbab; }
.gz-photo-tall { aspect-ratio: 16 / 9; }
.gz-plate { position: relative; width: 100%; aspect-ratio: 16 / 10; margin-bottom: 10px; border: 1px solid #241d12; background: #e3d5b6; overflow: hidden; }
.gz-plate-tall { aspect-ratio: 16 / 9; }
.gz-plate svg { width: 100%; height: 100%; display: block; }
.gz-plate-cap { position: absolute; left: 8px; bottom: 6px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }

.gz-lead .gz-head { font-size: clamp(26px, 3.6vw, 40px); font-weight: 900; }
.gz-lead .gz-sum { font-size: 16px; }
.gz-lead .gz-sum::first-letter { font-family: 'Playfair Display', serif; float: left; font-size: 52px; line-height: 0.85; padding: 4px 6px 0 0; font-weight: 900; }
.gz-feature .gz-head { font-size: 22px; }
.gz-brief { padding: 10px 0; border-bottom: 1px solid rgba(36,29,18,0.4); break-inside: avoid; }
.gz-brief:last-child { border-bottom: none; }
.gz-brief .gz-head { font-size: 16px; }
.gz-brief .gz-sum { font-size: 13px; }
.gz-brief .gz-photo, .gz-brief .gz-plate { aspect-ratio: 16 / 8; }

.gz-front { display: grid; grid-template-columns: 2fr 1fr; gap: 26px; padding: 18px 0; border-bottom: 3px solid #241d12; }
.gz-front-side { border-left: 1px solid #241d12; padding-left: 20px; }
.gz-kicker { font-family: 'Playfair Display', serif; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; font-size: 13px; border-bottom: 2px solid #241d12; padding-bottom: 4px; }

.gz-index { display: flex; flex-wrap: wrap; gap: 6px 14px; padding: 8px 0; border-bottom: 1px solid #241d12; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
.gz-index span { font-weight: 700; }
.gz-index a { color: #3d2f17; }

.gz-section { padding: 18px 0 10px; border-bottom: 3px double #241d12; }
.gz-sec-title { margin: 0 0 12px; text-align: center; border-top: 2px solid #241d12; border-bottom: 1px solid #241d12; padding: 6px 0; }
.gz-sec-title span { font-family: 'Playfair Display', serif; font-weight: 900; font-size: clamp(22px, 3vw, 30px); letter-spacing: 1px; text-transform: uppercase; display: block; }
.gz-sec-title small { font-style: italic; font-size: 12px; font-weight: 400; }
.gz-sec-body { display: grid; grid-template-columns: 1fr 1.4fr; gap: 24px; }
.gz-flip .gz-sec-body { grid-template-columns: 1.4fr 1fr; }
.gz-flip .gz-sec-lead { order: 2; }
.gz-cols { column-count: 2; column-gap: 22px; column-rule: 1px solid rgba(36,29,18,0.5); }
.gz-foot { margin-top: 16px; text-align: center; font-size: 12px; font-style: italic; }

@media (max-width: 760px) {
  .gz-ears, .gz-dateline { flex-direction: column; align-items: center; gap: 2px; }
  .gz-front, .gz-sec-body, .gz-flip .gz-sec-body { grid-template-columns: 1fr; }
  .gz-flip .gz-sec-lead { order: 0; }
  .gz-front-side { border-left: none; padding-left: 0; border-top: 1px solid #241d12; }
  .gz-cols { column-count: 1; }
  .gz-sum { text-align: left; }
}
`;
