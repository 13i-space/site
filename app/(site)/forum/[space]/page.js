import Link from "next/link";
import { createClient } from "../../../../lib/supabaseServer";

export default async function SpacePage({ params }) {
  const supabase = await createClient();
  const { data: space } = await supabase
    .from("forum_spaces")
    .select("id, name, description")
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
    .select("id, title, created_at, profiles(username, avatar_url)")
    .eq("space_id", space.id)
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <Link href="/forum" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to the forum
      </Link>

      <div className="page-title" style={{ marginTop: 14 }}>{space.name}</div>
      <div className="page-subtitle">{space.description}</div>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {user ? (
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
                  {t.profiles?.username || "unknown"} &middot; {new Date(t.created_at).toLocaleDateString()}
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
