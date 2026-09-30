import Link from "next/link";
import { createClient } from "../../../../lib/supabaseServer";
import { isAlpha } from "../../../../lib/alpha";
import AlphaBadge from "../../../../components/AlphaBadge";

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
    <div>
      <Link href="/forum" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to the forum
      </Link>

      <div className="page-title" style={{ marginTop: 14 }}>{space.name}</div>
      <div className="page-subtitle">{space.description}</div>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {alphaOnly && (
          <div className="panel" style={{ borderColor: "#6B5E3E", background: "rgba(201,185,143,0.05)", marginBottom: 20 }}>
            <div className="mono" style={{ fontSize: 10, color: "#C9B98F", letterSpacing: "1.5px", marginBottom: 8 }}>&alpha; THE ALPHA ROLL</div>
            <p style={{ fontSize: 13, color: "#B7BADF", margin: "0 0 12px", lineHeight: 1.6 }}>
              The first Kin, here before Beta. Only Alpha Users can see this forum: suggest changes, report what's broken, shape what comes next.
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
        {canPost ? (
          <Link
            href={`/forum/${params.space}/new`}
            className="mono"
            style={{
              display: "inline-block", marginBottom: 20, fontSize: 12, color: "#B9C0FF",
              border: "1px solid #3A3E75", borderRadius: 4, padding: "8px 16px",
            }}
          >
            + start a thread
          </Link>
        ) : user ? (
          <p style={{ fontSize: 12.5, color: "#565B8F", marginBottom: 20 }}>Only Alpha Users can start threads here.</p>
        ) : (
          <p style={{ fontSize: 12.5, color: "#565B8F", marginBottom: 20 }}>
            <Link href="/login" style={{ color: "#8B95F6" }}>Log in</Link> to start a thread.
          </p>
        )}

        {(!threads || threads.length === 0) && (
          <p style={{ color: "#565B8F", fontStyle: "italic" }}>No threads yet — be the first.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(threads || []).map((t) => (
            <Link
              key={t.id}
              href={`/forum/${params.space}/${t.id}`}
              style={{
                display: "flex", gap: 12, alignItems: "center",
                background: "rgba(14,16,38,0.55)", border: "1px solid #21244A", borderRadius: 4,
                padding: "12px 16px", textDecoration: "none", color: "inherit",
              }}
            >
              <Avatar profile={t.profiles} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, color: "#D9DCFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.title}
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: "#565B8F" }}>
                  {t.profiles?.username || "unknown"}<AlphaBadge profile={t.profiles} /> &middot; {new Date(t.created_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Avatar({ profile }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
      background: "#1C1F48", border: "1px solid #3A3E75",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {profile?.avatar_url ? (
        <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span className="mono" style={{ fontSize: 12, color: "#8B95F6" }}>
          {profile?.username ? profile.username[0].toUpperCase() : "?"}
        </span>
      )}
    </div>
  );
}
