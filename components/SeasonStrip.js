import Link from "next/link";

// A season at a glance: thirteen weeks in a row. Weeks with a story show
// their cover and link to the week's bundle; the rest wait; week 13 is the
// finale. Used on the Short Stories hub and the Seasons page.
export default function SeasonStrip({ season, banner = true }) {
  const weeks = Array.from({ length: 13 }, (_, i) => season.weeks.find((w) => w.week === i + 1) || null);
  const latest = season.weeks[season.weeks.length - 1];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
        <Link href="/seasons" className="wordmark" style={{ fontSize: 20, color: "#DCDFFF", textDecoration: "none" }}>{season.title}</Link>
        <span className="mono" style={{ fontSize: 10.5, letterSpacing: "1.5px", color: "#C9B98F" }}>{season.subtitle.toUpperCase()}</span>
        <span className="mono" style={{ fontSize: 10.5, color: "#6E76B8", marginLeft: "auto" }}>{season.weeks.length} OF 13 WEEKS READY</span>
      </div>
      <div className="season-strip">
        {weeks.map((w, i) => {
          const n = i + 1;
          const finale = n === 13;
          const body = (
            <>
              {w && <img src={w.cover} alt="" className="season-strip-cover" />}
              <span className="mono season-strip-num" style={{ color: w ? "#E8CFC0" : finale ? "#8B95F6" : "#3A3E75" }}>{finale && !w ? "13 ✦" : n}</span>
            </>
          );
          return w ? (
            <Link key={n} href={`/seasons/${season.number}/${w.week}`} className="season-strip-cell season-strip-on" title={`Week ${n}: ${w.title}`}>{body}</Link>
          ) : (
            <div key={n} className="season-strip-cell" title={finale ? "Week 13: the finale" : `Week ${n}`}>{body}</div>
          );
        })}
      </div>
      {latest && banner && (
        <Link href={`/seasons/${season.number}/${latest.week}`} className="launch-card" style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10, padding: "12px 16px", border: "1px solid #6B5E3E", borderRadius: 4, background: "rgba(14,16,38,0.72)", textDecoration: "none", color: "inherit", flexWrap: "wrap" }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "1.5px", color: "#C9B98F" }}>WEEK {latest.week}</div>
          <div className="wordmark" style={{ fontSize: 20, color: "#DCDFFF" }}>{latest.title}</div>
          <div className="mono" style={{ fontSize: 11, color: "#6E76B8", marginLeft: "auto" }}>six ways in &rarr;</div>
        </Link>
      )}
    </div>
  );
}
