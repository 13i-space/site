import Link from "next/link";
import { SEASONS, PIECES } from "../../../lib/seasons";
import SeasonStrip from "../../../components/SeasonStrip";

export const metadata = {
  title: "Seasons",
  description: "One story a week, six ways in. Thirteen weeks to a season; the last week brings the fragments together.",
};

export default function SeasonsPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div className="page-title">Seasons</div>
      <div className="page-subtitle">one story a week, six ways in</div>
      <p style={{ color: "#A9AEDB", fontSize: 15, lineHeight: 1.7, maxWidth: 680, marginTop: -8 }}>
        Each week, 13i sends back one record, and the universe gets it six ways: {Object.values(PIECES).map((p) => p.label.toLowerCase()).join(", ")}.
        A season is thirteen weeks. In the last one, the fragments hidden in the other twelve come together.
      </p>

      {SEASONS.map((s) => (
        <section key={s.number} style={{ marginTop: 30 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <div className="wordmark" style={{ fontSize: 26, color: "#DCDFFF" }}>{s.title}</div>
            <div className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "1px" }}>{s.subtitle.toUpperCase()}</div>
          </div>
          <p style={{ color: "#8A8FBF", fontSize: 14, maxWidth: 680 }}>{s.blurb}</p>
          <div style={{ margin: "16px 0 20px" }}>
            <SeasonStrip season={s} banner={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {s.weeks.map((w) => (
              <Link key={w.week} href={`/seasons/${s.number}/${w.week}`} className="launch-card" style={{ display: "flex", gap: 18, alignItems: "stretch", textDecoration: "none", color: "inherit", background: "rgba(14,16,38,0.72)", border: "1px solid #6B5E3E", borderRadius: 4, padding: 16 }}>
                <img src={w.cover} alt="" style={{ width: 90, aspectRatio: "2 / 3", objectFit: "cover", borderRadius: 3, border: "1px solid #262A55", flexShrink: 0 }} />
                <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className="mono" style={{ fontSize: 9.5, letterSpacing: "1.5px", color: "#C9B98F", marginBottom: 6 }}>WEEK {w.week} · {w.world.toUpperCase()}</div>
                  <div className="wordmark" style={{ fontSize: 24, color: "#DCDFFF", marginBottom: 6 }}>{w.title}</div>
                  <p style={{ fontSize: 13, color: "#8A8FBF", margin: 0, lineHeight: 1.55 }}>{w.blurb}</p>
                  <div className="mono" style={{ fontSize: 10.5, color: "#6E76B8", marginTop: 10 }}>
                    {w.pieces.map((p) => PIECES[p.kind].verb.toUpperCase()).join(" · ")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
