import Link from "next/link";
import { notFound } from "next/navigation";
import AlienCard from "../../../../../components/AlienCard";
import SignalPlayer from "../../../../../components/SignalPlayer";
import { seasonFor, weekFor, PIECES, isOpen } from "../../../../../lib/seasons";
import { ARCHIVE_SPECIES } from "../../../../../lib/archiveSpecies";

export function generateMetadata({ params }) {
  const w = weekFor(params.season, params.week);
  if (!w) return {};
  return { title: `${w.title} · Season ${params.season}, Week ${w.week}`, description: w.blurb };
}

const DAYS = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

export default function WeekPage({ params }) {
  const season = seasonFor(params.season);
  const week = weekFor(params.season, params.week);
  if (!season || !week) notFound();
  const species = ARCHIVE_SPECIES[week.assignment];
  const piece = (kind) => week.pieces.find((p) => p.kind === kind);

  const Tile = ({ p, children }) => {
    const open = isOpen(p);
    const meta = PIECES[p.kind];
    const head = (
      <div className="mono" style={{ fontSize: 10, letterSpacing: "1.5px", color: open ? "#C9B98F" : "#565B8F", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
        <span>{meta.label.toUpperCase()}</span>
        <span>{DAYS[p.day] ? DAYS[p.day].toUpperCase() : ""}</span>
      </div>
    );
    if (!open) {
      return (
        <div className="panel" style={{ opacity: 0.6 }}>
          {head}
          <p style={{ fontSize: 13, color: "#6E76B8", margin: 0 }}>Opens {new Date(`${p.opens}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" })}.</p>
        </div>
      );
    }
    const body = (
      <>
        {head}
        {children}
        <p style={{ fontSize: 13, color: "#8A8FBF", margin: "6px 0 0", lineHeight: 1.55 }}>{p.note}</p>
      </>
    );
    return p.href ? (
      <Link href={p.href} className="panel launch-card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>{body}</Link>
    ) : (
      <div className="panel">{body}</div>
    );
  };

  const big = (verb, title) => (
    <div className="wordmark" style={{ fontSize: 24, color: "#DCDFFF" }}>
      {verb} <span style={{ color: "#8B95F6" }}>&rarr;</span>
      {title ? <span className="mono" style={{ fontSize: 11, color: "#6E76B8", fontStyle: "normal", marginLeft: 10 }}>{title}</span> : null}
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Link href="/seasons" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>&larr; Seasons</Link>

      <div style={{ display: "flex", gap: 26, alignItems: "center", flexWrap: "wrap", marginTop: 18 }}>
        <img src={week.cover} alt={`${week.title} cover`} style={{ width: 170, aspectRatio: "2 / 3", objectFit: "cover", borderRadius: 4, border: "1px solid #262A55", boxShadow: "0 0 50px rgba(80,100,255,0.2)" }} />
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "2px", color: "#8B95F6" }}>{season.title.toUpperCase()} · WEEK {week.week} · ASSIGNMENT {String(week.assignment).padStart(7, "0")}</div>
          <div className="page-title" style={{ fontSize: 44, margin: "8px 0 6px" }}>{week.title}</div>
          <p style={{ color: "#A9AEDB", fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 560 }}>{week.blurb}</p>
          <div className="mono" style={{ fontSize: 11, color: "#6E76B8", marginTop: 12 }}>WORLD · {week.world.toUpperCase()} · <Link href="/galaxy/map" style={{ color: "#8B95F6" }}>find it on the Galaxy Map</Link></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginTop: 30 }}>
        {piece("story") && <Tile p={piece("story")}>{big("Read", "~12 min")}</Tile>}
        {piece("interactive") && <Tile p={piece("interactive")}>{big("Choose", "~15–20 min")}</Tile>}
        {piece("game") && <Tile p={piece("game")}>{big("Play", "TACET")}</Tile>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 18, marginTop: 18 }} className="season-split">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {piece("signal") && isOpen(piece("signal")) && (
            <div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "1.5px", color: "#C9B98F", marginBottom: 8 }}>THE SIGNAL · TUESDAY</div>
              <SignalPlayer number={week.assignment} />
            </div>
          )}
          {piece("fragment") && (
            <div className="panel" style={{ borderStyle: "dashed" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "1.5px", color: "#565B8F", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                <span>ARTIFACT FRAGMENT</span><span>SATURDAY</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 4, border: "1px dashed #3A3E75", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 26, color: "#3A3E75" }}>?</div>
                <div>
                  <div className="wordmark" style={{ fontSize: 20, color: "#8A8FBF" }}>Fragment {String(week.fragment.n).padStart(2, "0")} of {week.fragment.of}</div>
                  <p style={{ fontSize: 13, color: "#6E76B8", margin: "4px 0 0" }}>Sealed. Something in this week&apos;s record belongs to an artifact that hasn&apos;t been found yet.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {species && piece("species") && isOpen(piece("species")) && (
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "1.5px", color: "#C9B98F", marginBottom: 8 }}>THE SPECIES CARD · THURSDAY</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AlienCard species={species} creator="13i" width={300} />
            </div>
            <p className="mono" style={{ fontSize: 10.5, color: "#565B8F", textAlign: "center", marginTop: 10 }}>click the card to turn it · its signal is on the back</p>
          </div>
        )}
      </div>
    </div>
  );
}
