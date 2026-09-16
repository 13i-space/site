import Link from "next/link";
import { createClient } from "../../../lib/supabaseServer";

export default async function ForumHub() {
  const supabase = await createClient();
  const { data: spaces } = await supabase
    .from("forum_spaces")
    .select("slug, name, description")
    .order("sort_order");

  // thread counts per space, done as a lightweight second query
  const { data: threads } = await supabase.from("forum_threads").select("space_id");
  const counts = {};
  (threads || []).forEach((t) => { counts[t.space_id] = (counts[t.space_id] || 0) + 1; });

  const { data: spacesWithId } = await supabase.from("forum_spaces").select("id, slug");
  const countBySlug = {};
  (spacesWithId || []).forEach((s) => { countBySlug[s.slug] = counts[s.id] || 0; });

  return (
    <div>
      <div className="page-title">The Forum</div>
      <div className="page-subtitle">a meeting place for Kin — new guests always welcome</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640, margin: "0 auto" }}>
        {(spaces || []).map((s) => (
          <Link
            key={s.slug}
            href={`/forum/${s.slug}`}
            className="launch-card"
            style={{
              display: "block",
              background: "rgba(14,16,38,0.72)",
              border: "1px solid #262A55",
              borderRadius: 4,
              padding: "18px 20px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="wordmark" style={{ fontSize: 19, color: "#DCDFFF" }}>{s.name}</span>
              <span className="mono" style={{ fontSize: 11, color: "#565B8F" }}>
                {countBySlug[s.slug] || 0} {countBySlug[s.slug] === 1 ? "thread" : "threads"}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#8A8FBF", marginTop: 6, marginBottom: 0 }}>{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
