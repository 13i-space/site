import Link from "next/link";
import { getSpaceNewspaper, NEWS_SOURCES } from "../../../../lib/spaceNews";
import { getSciFiPaper, SCIFI_SOURCES } from "../../../../lib/scifiNews";
import GazetteBook from "../../../../components/news/GazetteBook";
import NewsImage from "../../../../components/news/NewsImage";
import { getLaunches } from "../../../../lib/launchSchedule";
import { FEEDS } from "../../../../lib/missionFeeds";

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
  const [space, scifi, launches] = await Promise.all([getSpaceNewspaper(), getSciFiPaper(), getLaunches()]);
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
      {/* Update 5.66: two pages - turn to the entertainment section.
          Update 6.24: page three, the live wire, opens Mission Control. */}
      <GazetteBook
        labels={["The Cosmos", "Screen, Page & Sound", "Live from Orbit"]}
        pages={[<PageOne key="1" {...space} />, <PageTwo key="2" {...scifi} />, <PageThree key="3" launches={launches} />]}
      />
    </div>
  );
}

function issueNo(now) {
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

function PageOne({ sections, lead }) {
  const now = new Date();
  const issue = issueNo(now);
  const front = lead ? sections.flatMap((s) => s.articles).filter((a) => a.link !== lead.link).sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 9) : [];

  return (
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
                {/* more under the lead, so it never sits over empty paper */}
                <div className="gz-front-under">
                  {front.slice(5).map((a) => <Story key={a.link} a={a} size="brief" noImage />)}
                </div>
              </div>
              <div className="gz-front-side">
                <div className="gz-kicker">Also on the wire</div>
                {front.slice(0, 5).map((a, i) => <Story key={a.link} a={a} size="brief" noImage={i > 0} />)}
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
                {/* the section's lead takes a 2x2 block (Update 5.59); the rest
                    of the dispatches fill in beside and below it */}
                <div className="gz-sec-body">
                  <div className="gz-sec-lead"><Story a={s.articles[0]} size="feature" /></div>
                  {s.articles.slice(1).map((a, k) => <div key={a.link} className="gz-cell"><Story a={a} size="brief" noImage={k > 3} /></div>)}
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
  );
}

// Page two: the entertainment section - sci-fi on screens, in books and in sound
function PageTwo({ sections, lead }) {
  const now = new Date();
  const front = lead ? sections.flatMap((s) => s.articles).filter((a) => a.link !== lead.link).sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 5) : [];
  return (
    <article className="gz-paper gz-paper-two">
      <header className="gz-mast">
        <div className="gz-ears">
          <span>Vol. XIII &middot; No. {issueNo(now)} &middot; Page 2</span>
          <span className="gz-ear-mid">&ldquo;What Earth imagines, we read with interest&rdquo;</span>
          <span>The Entertainment Section</span>
        </div>
        <h1 className="gz-title gz-title-two">Screen, Page &amp; Sound</h1>
        <div className="gz-dateline">
          <span>Science fiction on Earth this week</span>
          <span>Films &middot; Series &middot; Books &middot; Scores</span>
          <span>Reviewed by 13i, with some amusement</span>
        </div>
      </header>
      {!lead ? (
        <p className="gz-empty">The entertainment wire is quiet. Check back shortly.</p>
      ) : (
        <>
          <section className="gz-front">
            <div className="gz-front-lead"><Story a={lead} size="lead" /></div>
            <div className="gz-front-side">
              <div className="gz-kicker">Now showing</div>
              {front.map((a, i) => <Story key={a.link} a={a} size="brief" noImage={i > 0} />)}
            </div>
          </section>
          <nav className="gz-index" aria-label="Sections">
            <span>In this section:</span>
            {sections.map((s) => <a key={s.id} href={`#gz-two-${s.id}`}>{s.section}</a>)}
          </nav>
          {sections.map((s, i) => (
            <section key={s.id} id={`gz-two-${s.id}`} className={`gz-section ${i % 2 ? "gz-flip" : ""}`}>
              <h2 className="gz-sec-title"><span>{s.section}</span><small>{s.note}</small></h2>
              <div className="gz-sec-body">
                <div className="gz-sec-lead"><Story a={s.articles[0]} size="feature" /></div>
                {s.articles.slice(1).map((a, k) => <div key={a.link} className="gz-cell"><Story a={a} size="brief" noImage={k > 3} /></div>)}
              </div>
            </section>
          ))}
        </>
      )}
      <footer className="gz-foot">
        From {SCIFI_SOURCES.map((s) => s.name).join(", ")} - science fiction only, filed by subject. Each story opens on its original site in a new tab; pictures belong to their publishers.
      </footer>
    </article>
  );
}

// Page three (Update 6.24): the live wire - what's on Mission Control's
// screens and the launch schedule, with the way in to Mission Control itself.
function launchWhen(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }) +
    " · " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }) + " UTC";
}

function OrbitPlate() {
  // an engraving of the station over Earth's limb, in the paper's ink
  const lines = Array.from({ length: 16 }, (_, i) => i);
  return (
    <div className="gz-plate gz-plate-tall gz-mc-plate">
      <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="640" height="360" fill="#1d1710" />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 157) % 640} cy={(i * 89) % 190} r={i % 5 ? 0.9 : 1.6} fill="#efe4cc" opacity={0.35 + (i % 3) * 0.2} />)}
        <defs>
          <clipPath id="gz-mc-earth"><circle cx="320" cy="1180" r="1000" /></clipPath>
        </defs>
        <circle cx="320" cy="1180" r="1000" fill="#d9cbab" />
        <g clipPath="url(#gz-mc-earth)" stroke="#5a4a30" strokeWidth="1.1" fill="none" opacity=".55">
          {lines.map((i) => <path key={i} d={`M -20 ${196 + i * 11} Q 320 ${170 + i * 11 - i * 0.6} 660 ${196 + i * 11}`} />)}
        </g>
        <g clipPath="url(#gz-mc-earth)" fill="#efe4cc" opacity=".8">
          <ellipse cx="170" cy="232" rx="70" ry="8" /><ellipse cx="420" cy="250" rx="110" ry="11" /><ellipse cx="300" cy="300" rx="90" ry="14" /><ellipse cx="560" cy="222" rx="60" ry="6" />
        </g>
        <circle cx="320" cy="1180" r="1003" fill="none" stroke="#efe4cc" strokeWidth="3" opacity=".7" />
        <g fill="#16110a" stroke="#efe4cc" strokeWidth="1.2">
          <rect x="250" y="70" width="140" height="8" />
          <rect x="262" y="40" width="22" height="68" /><rect x="292" y="40" width="22" height="68" />
          <rect x="326" y="40" width="22" height="68" /><rect x="356" y="40" width="22" height="68" />
          <rect x="304" y="62" width="32" height="24" rx="4" />
        </g>
        <g stroke="#efe4cc" strokeWidth=".6" opacity=".6">
          {[262, 292, 326, 356].flatMap((x) => [x + 7, x + 14].map((xx) => <line key={x + "-" + xx} x1={xx} y1="40" x2={xx} y2="108" />))}
        </g>
      </svg>
      <span className="gz-plate-cap" style={{ color: "#efe4cc", top: 8, bottom: "auto" }}>Live &middot; 400 km up</span>
    </div>
  );
}

function PageThree({ launches = [] }) {
  const now = new Date();
  const list = launches.slice(0, 7);
  return (
    <article className="gz-paper gz-paper-three">
      <header className="gz-mast">
        <div className="gz-ears">
          <span>Vol. XIII &middot; No. {issueNo(now)} &middot; Page 3</span>
          <span className="gz-ear-mid">&ldquo;Watched from above, as it happens&rdquo;</span>
          <span>The Live Wire</span>
        </div>
        <h1 className="gz-title gz-title-two">Live from Orbit</h1>
        <div className="gz-dateline">
          <span>Pictures from the station and the pads</span>
          <span>Received by 13i as it happens</span>
          <span>Launch times in UTC</span>
        </div>
      </header>

      <section className="gz-front">
        <div className="gz-front-lead">
          <Link href="/galaxy/mission-control" className="gz-story gz-lead gz-mc-lead">
            <OrbitPlate />
            <div className="gz-head">Mission Control Opens Its Doors</div>
            <div className="gz-byline">The live room &middot; open day and night</div>
            <p className="gz-sum">
              Earth turns under the space station in real time, in ordinary light and in 4K, while cameras keep watch on the launch
              pads. Mission Control puts every live feed on one floor, beside the station&rsquo;s position over the planet and a
              countdown to every launch on the schedule. When a rocket is about to fly, its pad takes the main screen.
            </p>
            <span className="gz-mc-enter">Step into Mission Control &rarr;</span>
          </Link>
        </div>
        <div className="gz-front-side">
          <div className="gz-kicker">The Launch Wire</div>
          {list.length === 0 ? (
            <p className="gz-sum" style={{ padding: "10px 0" }}>The launch wire is quiet. The schedule comes through again shortly.</p>
          ) : list.map((l) => (
            <div key={l.id} className="gz-story gz-brief">
              <div className="gz-head">{l.rocket}{l.mission ? <> &middot; <em>{l.mission}</em></> : null}</div>
              <div className="gz-byline">{launchWhen(l.net)}{l.status ? <> &middot; {l.status}</> : null}</div>
              <p className="gz-sum">{[l.provider, l.location].filter(Boolean).join(", ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gz-section">
        <h2 className="gz-sec-title"><span>On the Screens Tonight</span><small>live, from their own cameras</small></h2>
        <div className="gz-mc-feeds">
          {FEEDS.map((f) => (
            <Link key={f.id} href="/galaxy/mission-control" className="gz-story gz-brief">
              <div className="gz-head">{f.name}</div>
              <div className="gz-byline">{f.code} &middot; {f.source}</div>
            </Link>
          ))}
          <Link href="/galaxy/mission-control" className="gz-story gz-brief">
            <div className="gz-head">Signal 13i, over the view</div>
            <div className="gz-byline">Signal mode &middot; the feeds fall silent</div>
          </Link>
        </div>
      </section>

      <footer className="gz-foot">
        Launch schedule from The Space Devs&rsquo; Launch Library; dates move often. The pictures play from NASA, Sen and NASASpaceflight on YouTube.
      </footer>
    </article>
  );
}

const CSS = `
.gz-book { position: relative; margin-top: 14px; perspective: 2200px; }
.gz-tabs { display: flex; gap: 6px; }
.gz-tab { display: flex; flex-direction: column; align-items: flex-start; gap: 1px; padding: 8px 16px 9px; border: none; border-radius: 8px 8px 0 0; background: #c9bb9b; color: #4a3c22; font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 15px; cursor: pointer; opacity: .75; transition: opacity .2s; }
.gz-tab span { font-family: 'Old Standard TT', Georgia, serif; font-weight: 400; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; }
.gz-tab.on { background: #efe4cc; color: #16110a; opacity: 1; }
.gz-leaf { position: relative; transform-origin: left center; transform-style: preserve-3d; }
.gz-leaf .gz-paper { margin-top: 0; }
.gz-turn-fwd { animation: gz-turn-fwd .76s ease-in-out; }
.gz-turn-back { animation: gz-turn-back .76s ease-in-out; transform-origin: right center; }
@keyframes gz-turn-fwd { 0% { transform: rotateY(0); } 49% { transform: rotateY(-90deg); filter: brightness(.7); } 51% { transform: rotateY(90deg); filter: brightness(.7); } 100% { transform: rotateY(0); } }
@keyframes gz-turn-back { 0% { transform: rotateY(0); } 49% { transform: rotateY(90deg); filter: brightness(.7); } 51% { transform: rotateY(-90deg); filter: brightness(.7); } 100% { transform: rotateY(0); } }
.gz-corner { position: absolute; right: 0; bottom: 0; width: 150px; height: 120px; border: none; cursor: pointer; padding: 0; z-index: 3;
  background: linear-gradient(135deg, transparent 50%, #d8c9a6 50%, #b9a67c 72%, #8f7c55 100%); box-shadow: -6px -6px 18px rgba(0,0,0,.25); clip-path: polygon(100% 0, 100% 100%, 0 100%); transition: width .25s, height .25s; }
.gz-corner:hover { width: 180px; height: 145px; }
.gz-corner span { position: absolute; right: 12px; bottom: 12px; text-align: right; font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 14px; color: #241d12; }
.gz-corner small { display: block; font-family: 'Old Standard TT', Georgia, serif; font-weight: 400; font-style: italic; font-size: 11px; }
.gz-corner-back { right: auto; left: 0; background: linear-gradient(225deg, transparent 50%, #d8c9a6 50%, #b9a67c 72%, #8f7c55 100%); clip-path: polygon(0 0, 100% 100%, 0 100%); box-shadow: 6px -6px 18px rgba(0,0,0,.25); }
.gz-corner-back span { right: auto; left: 12px; text-align: left; }
.gz-leaf .gz-foot { padding: 0 170px 30px; }
@media (max-width: 640px) { .gz-leaf .gz-foot { padding: 0 0 110px; } }
.gz-mc-lead .gz-head { font-size: clamp(28px, 3.8vw, 42px); font-weight: 900; }
.gz-mc-enter { display: inline-block; margin-top: 14px; padding: 8px 14px; border: 2px solid #16110a; font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 16px; color: #16110a; letter-spacing: .5px; transition: background .2s, color .2s; }
.gz-mc-lead:hover .gz-mc-enter { background: #16110a; color: #efe4cc; }
.gz-mc-lead:hover .gz-head { text-decoration: none; }
.gz-mc-plate { border-color: #16110a; }
.gz-mc-feeds { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0 22px; }
.gz-mc-feeds .gz-brief { border-bottom: none; border-left: 1px solid rgba(36,29,18,0.4); padding-left: 12px; }
.gz-mc-feeds .gz-brief:first-child { border-left: none; padding-left: 0; }
@media (max-width: 760px) { .gz-mc-feeds { grid-template-columns: 1fr 1fr; } .gz-mc-feeds .gz-brief { border-left: none; padding-left: 0; border-bottom: 1px solid rgba(36,29,18,0.4); } }
.gz-paper-three .gz-title-two { font-family: 'Playfair Display', Georgia, serif; font-weight: 900; font-style: italic; letter-spacing: -1px; }
.gz-paper-two .gz-title-two { font-family: 'Playfair Display', Georgia, serif; font-weight: 900; font-style: italic; letter-spacing: -1px; }
@media (prefers-reduced-motion: reduce) { .gz-turn-fwd, .gz-turn-back { animation: none; } }
@media (max-width: 640px) { .gz-corner { width: 120px; height: 96px; } .gz-corner span { font-size: 12px; } .gz-tab { font-size: 13px; padding: 7px 10px; } }
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
.gz-front-under { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 22px; margin-top: 14px; border-top: 2px solid #241d12; }
.gz-front-under .gz-brief { border-bottom: 1px solid rgba(36,29,18,0.4); }
.gz-front-side { border-left: 1px solid #241d12; padding-left: 20px; }
.gz-kicker { font-family: 'Playfair Display', serif; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; font-size: 13px; border-bottom: 2px solid #241d12; padding-bottom: 4px; }

.gz-index { display: flex; flex-wrap: wrap; gap: 6px 14px; padding: 8px 0; border-bottom: 1px solid #241d12; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
.gz-index span { font-weight: 700; }
.gz-index a { color: #3d2f17; }

.gz-section { padding: 18px 0 10px; border-bottom: 3px double #241d12; }
.gz-sec-title { margin: 0 0 12px; text-align: center; border-top: 2px solid #241d12; border-bottom: 1px solid #241d12; padding: 6px 0; }
.gz-sec-title span { font-family: 'Playfair Display', serif; font-weight: 900; font-size: clamp(22px, 3vw, 30px); letter-spacing: 1px; text-transform: uppercase; display: block; }
.gz-sec-title small { font-style: italic; font-size: 12px; font-weight: 400; }
.gz-sec-body { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-flow: row dense; gap: 0 22px; }
.gz-sec-lead { grid-column: 1 / span 2; grid-row: 1 / span 2; padding-right: 22px; border-right: 1px solid rgba(36,29,18,0.5); margin-right: -11px; }
.gz-flip .gz-sec-lead { grid-column: 3 / span 2; padding-right: 0; border-right: none; margin-right: 0; padding-left: 22px; border-left: 1px solid rgba(36,29,18,0.5); margin-left: -11px; }
.gz-sec-lead .gz-feature .gz-head { font-size: clamp(24px, 2.8vw, 32px); font-weight: 900; }
.gz-sec-lead .gz-feature .gz-sum { font-size: 15.5px; line-height: 1.55; }
.gz-sec-lead .gz-feature .gz-sum::first-letter { font-family: 'Playfair Display', serif; float: left; font-size: 44px; line-height: 0.85; padding: 4px 6px 0 0; font-weight: 900; }
.gz-sec-lead .gz-photo, .gz-sec-lead .gz-plate { aspect-ratio: 4 / 3; }
.gz-cell { min-width: 0; border-bottom: 1px solid rgba(36,29,18,0.4); }
.gz-cell .gz-brief { border-bottom: none; }
.gz-cols { column-count: 2; column-gap: 22px; column-rule: 1px solid rgba(36,29,18,0.5); }
.gz-foot { margin-top: 16px; text-align: center; font-size: 12px; font-style: italic; }

@media (min-width: 761px) and (max-width: 980px) {
  .gz-sec-body { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gz-sec-lead, .gz-flip .gz-sec-lead { grid-column: 1 / span 2; grid-row: auto; padding: 0 0 12px; margin: 0; border: none; border-bottom: 1px solid rgba(36,29,18,0.5); }
}
@media (max-width: 760px) {
  .gz-ears, .gz-dateline { flex-direction: column; align-items: center; gap: 2px; }
  .gz-front { grid-template-columns: 1fr; }
  .gz-front-under { grid-template-columns: 1fr; }
  .gz-sec-body { grid-template-columns: 1fr; }
  .gz-sec-lead, .gz-flip .gz-sec-lead { grid-column: auto; grid-row: auto; padding: 0 0 12px; margin: 0; border: none; border-bottom: 1px solid rgba(36,29,18,0.5); }
  .gz-front-under { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 22px; margin-top: 14px; border-top: 2px solid #241d12; }
.gz-front-under .gz-brief { border-bottom: 1px solid rgba(36,29,18,0.4); }
.gz-front-side { border-left: none; padding-left: 0; border-top: 1px solid #241d12; }
  .gz-cols { column-count: 1; }
  .gz-sum { text-align: left; }
}
`;
