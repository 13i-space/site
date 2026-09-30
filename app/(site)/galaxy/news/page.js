import Link from "next/link";
import { getSpaceNews, NEWS_SOURCES } from "../../../../lib/spaceNews";

// Rebuild this page with fresh headlines at most every 30 minutes
// (matches NEWS_REFRESH_SECONDS in lib/spaceNews.js).
export const revalidate = 1800;

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default async function SpaceNewsPage() {
  const articles = await getSpaceNews();

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <Link href="/galaxy" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to The Galaxy
      </Link>
      <div className="page-title" style={{ marginTop: 20 }}>Space News</div>
      <div className="page-subtitle">what's happening out there, right now</div>

      {articles.length === 0 ? (
        <div className="panel" style={{ textAlign: "center" }}>
          <p style={{ color: "#8A8FBF", margin: 0 }}>
            No news is coming through right now. Check back shortly.
          </p>
        </div>
      ) : (
        <div className="panel" style={{ padding: 0 }}>
          {articles.map((a, i) => (
            <a
              key={a.link}
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "16px 20px",
                borderBottom: i < articles.length - 1 ? "1px solid #21244A" : "none",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 4 }}>
                {a.source.toUpperCase()}
                {a.date && <> &middot; {formatDate(a.date).toUpperCase()}</>}
              </div>
              <div style={{ fontSize: 15, color: "#B9C0FF", lineHeight: 1.4 }}>
                {a.title} <span style={{ fontSize: 12, color: "#565B8F" }}>&#8599;</span>
              </div>
              {a.summary && (
                <p style={{ fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: "6px 0 0" }}>{a.summary}</p>
              )}
            </a>
          ))}
        </div>
      )}

      <p style={{ fontSize: 12, color: "#565B8F", marginTop: 16, textAlign: "center" }}>
        Headlines from {NEWS_SOURCES.map((s) => s.name).join(", ")}, refreshed every half hour.
        Each one opens on its original site in a new tab.
      </p>
    </div>
  );
}
