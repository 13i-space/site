import Link from "next/link";
import { createClient } from "../../../lib/supabaseServer";
import { isAlpha } from "../../../lib/alpha";

export default async function ForumHub() {
  const supabase = await createClient();
  const { data: allSpaces } = await supabase
    .from("forum_spaces")
    .select("*")
    .order("sort_order");

  // the Alpha Users Private Forum is listed only for Alpha Users
  const { data: { user } } = await supabase.auth.getUser();
  let me = null;
  let unread = 0;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    me = data ? { ...data, created_at: data.created_at || user.created_at } : null;
    const { count } = await supabase.from("direct_messages").select("id", { count: "exact", head: true }).eq("recipient_id", user.id).is("read_at", null);
    unread = count || 0;
  }
  const spaces = (allSpaces || []).filter((s) => !(s.alpha_only || s.slug === "alpha") || isAlpha(me));

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

      {user && (
        <div style={{ maxWidth: 640, margin: "0 auto 16px", display: "flex", justifyContent: "flex-end" }}>
          <Link href="/messages" className="mono" style={{ fontSize: 12, color: unread ? "#E8CFC0" : "#B9C0FF", border: `1px solid ${unread ? "#6B5E3E" : "#3A3E75"}`, borderRadius: 4, padding: "7px 14px", textDecoration: "none" }}>
            &#9993; messages{unread ? ` \u00b7 ${unread} new` : ""}
          </Link>
        </div>
      )}

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
              <span className="wordmark" style={{ fontSize: 19, color: s.slug === "alpha" ? "#E8CFC0" : "#DCDFFF" }}>{s.name}</span>
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
