import Link from "next/link";
import { createClient } from "../../../../lib/supabaseServer";
import { isAlpha } from "../../../../lib/alpha";
import AlphaBadge from "../../../../components/AlphaBadge";
import KinRoom, { KinAvatar } from "../../../../components/KinRoom";

export default async function SpacePage({ params }) {
  const supabase = await createClient();
  const { data: space } = await supabase
    .from("forum_spaces")
    .select("*") // alpha_only arrives with docs/v5.10-alpha-users.sql
    .eq("slug", params.space)
    .single();

  if (!space) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <div className="page-title">Not Found</div>
        <p style={{ color: "#8A8FBF" }}>There's no space by that name.</p>
      </div>
    );
  }

  const { data: threads } = await supabase
    .from("forum_threads")
    .select("id, title, created_at, profiles(*)")
    .eq("space_id", space.id)
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The Alpha Users space: everyone can read, only Alpha Users post
  const alphaOnly = !!space.alpha_only || params.space === "alpha";
  let me = null;
  let roll = [];
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    me = data ? { ...data, created_at: data.created_at || user.created_at } : null;
  }
  const locked = alphaOnly && !isAlpha(me); // the Alpha forum is private
  if (alphaOnly && !locked) {
    const { data } = await supabase.from("profiles").select("*").eq("alpha", true).order("alpha_number", { ascending: true }).limit(200);
    roll = (data || []).filter((p) => p.username);
  }
  if (locked) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div className="page-title">{space.name}</div>
        <p style={{ color: "#8A8FBF" }}>This forum is private to Alpha Users, the first Kin testing 13i before Beta.</p>
        <Link href="/forum" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>&larr; back to the forum</Link>
      </div>
    );
  }
  const canPost = !!user && (!alphaOnly || isAlpha(me));

  return (
    <KinRoom room="forum" title={space.name} line={space.description} back={{ href: "/forum", label: "the forum" }}>
      {alphaOnly && (
        <div className="kr-card kr-roll">
          <div className="mono" style={{ fontSize: 10, color: "#C9B98F", letterSpacing: "1.5px", marginBottom: 8 }}>&alpha; THE ALPHA ROLL</div>
          <p style={{ fontSize: 13.5, color: "#B7BADF", margin: "0 0 12px", lineHeight: 1.6 }}>
            The first Kin, here before Beta. Only Alpha Users can see this forum: suggest changes, report what&rsquo;s broken, shape what comes next.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {roll.map((p) => (
              <Link key={p.id} href={`/kin/${p.username}`} className="mono" style={{ fontSize: 11, color: "#E8CFC0", border: "1px solid #3A3E75", borderRadius: 12, padding: "3px 10px", textDecoration: "none" }}>
                {p.alpha_number ? `${String(p.alpha_number).padStart(3, "0")} ` : ""}{p.username}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="kr-bar">
        <span className="mono kr-count">{(threads || []).length} {(threads || []).length === 1 ? "thread" : "threads"}</span>
        {canPost ? (
          <Link href={`/forum/${params.space}/new`} className="kr-pill">+ Start a thread</Link>
        ) : user ? (
          <span style={{ fontSize: 13, color: "#6E76B8" }}>Only Alpha Users can start threads here.</span>
        ) : (
          <Link href={`/login?next=/forum/${params.space}`} className="kr-pill">Sign in to start a thread</Link>
        )}
      </div>

      {(!threads || threads.length === 0) && (
        <div className="kr-empty">No threads yet. Be the first to start a conversation here.</div>
      )}

      <div className="kr-threads">
        {(threads || []).map((t) => (
          <Link key={t.id} href={`/forum/${params.space}/${t.id}`} className="kr-card kr-thread">
            <KinAvatar profile={t.profiles} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="kr-thread-title">{t.title}</div>
              <div className="mono kr-thread-meta">
                {t.profiles?.username || "unknown"}<AlphaBadge profile={t.profiles} /> &middot; {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
            <span className="mono kr-go">&rarr;</span>
          </Link>
        ))}
      </div>
    </KinRoom>
  );
}
