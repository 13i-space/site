import Link from "next/link";
import { createClient } from "../../../../../lib/supabaseServer";
import ReplyForm from "../../../../../components/ReplyForm";
import { isAlpha } from "../../../../../lib/alpha";
import AlphaBadge from "../../../../../components/AlphaBadge";

export default async function ThreadPage({ params }) {
  const supabase = await createClient();

  const { data: thread } = await supabase
    .from("forum_threads")
    .select("id, title, body, created_at, profiles(*)")
    .eq("id", params.threadId)
    .single();

  if (!thread) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <div className="page-title">Not Found</div>
      </div>
    );
  }

  const { data: replies } = await supabase
    .from("forum_replies")
    .select("id, body, created_at, profiles(*)")
    .eq("thread_id", params.threadId)
    .order("created_at", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // replies in the Alpha Users space are for Alpha Users (see docs/v5.10-alpha-users.sql)
  const { data: space } = await supabase.from("forum_spaces").select("*").eq("slug", params.space).maybeSingle();
  const alphaOnly = !!space?.alpha_only || params.space === "alpha";
  let me = null;
  if (user && alphaOnly) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    me = data ? { ...data, created_at: data.created_at || user.created_at } : null;
  }

  return (
    <div>
      <Link href={`/forum/${params.space}`} className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back
      </Link>

      <div style={{ maxWidth: 640, margin: "24px auto 0" }}>
        <Post profile={thread.profiles} body={thread.body} createdAt={thread.created_at} title={thread.title} viewerId={user?.id} />

        {(replies || []).length > 0 && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 18 }}>
            {replies.map((r) => (
              <Post key={r.id} profile={r.profiles} body={r.body} createdAt={r.created_at} reply viewerId={user?.id} />
            ))}
          </div>
        )}

        {alphaOnly && user && !isAlpha(me) ? (
          <p style={{ fontSize: 12.5, color: "#565B8F", marginTop: 24 }}>Only Alpha Users can reply in this space.</p>
        ) : (
          <ReplyForm threadId={thread.id} loggedIn={!!user} />
        )}
      </div>
    </div>
  );
}

function Post({ profile, body, createdAt, title, reply, viewerId }) {
  return (
    <div style={{ display: "flex", gap: 14, paddingLeft: reply ? 20 : 0 }}>
      <Link href={profile?.username ? `/kin/${profile.username}` : "#"} style={{ flexShrink: 0 }}>
        <div style={{
          width: reply ? 32 : 42, height: reply ? 32 : 42, borderRadius: "50%", overflow: "hidden",
          background: "#1C1F48", border: "1px solid #3A3E75",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span className="mono" style={{ fontSize: reply ? 12 : 15, color: "#8B95F6" }}>
              {profile?.username ? profile.username[0].toUpperCase() : "?"}
            </span>
          )}
        </div>
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 24, color: "#DCDFFF", margin: "0 0 8px" }}>
            {title}
          </h1>
        )}
        <div className="mono" style={{ fontSize: 10.5, color: "#565B8F", marginBottom: 6 }}>
          {profile?.username ? (
            <><Link href={`/kin/${profile.username}`} style={{ color: "#6E76B8" }}>{profile.username}</Link><AlphaBadge profile={profile} /></>
          ) : "unknown"}
          {" \u00b7 "}
          {new Date(createdAt).toLocaleString()}
          {viewerId && profile?.username && profile.id !== viewerId && (
            <>
              {" \u00b7 "}
              <Link href={`/messages/${profile.username}`} style={{ color: "#8A8FBF" }} title={`Send ${profile.username} a private message`}>&#9993; message</Link>
            </>
          )}
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#D9DCFF", whiteSpace: "pre-wrap", margin: 0 }}>
          {body}
        </p>
      </div>
    </div>
  );
}
