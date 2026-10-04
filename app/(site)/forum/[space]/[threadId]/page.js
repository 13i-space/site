import Link from "next/link";
import { createClient } from "../../../../../lib/supabaseServer";
import ReplyForm from "../../../../../components/ReplyForm";
import { isAlpha } from "../../../../../lib/alpha";
import AlphaBadge from "../../../../../components/AlphaBadge";
import KinRoom, { KinAvatar } from "../../../../../components/KinRoom";

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

  const n = (replies || []).length;
  return (
    <KinRoom room="forum" title={space?.name || "The Forum"} back={{ href: `/forum/${params.space}`, label: space?.name || "back" }}>
      <article className="kr-card">
        <Post profile={thread.profiles} body={thread.body} createdAt={thread.created_at} title={thread.title} viewerId={user?.id} />
      </article>

      <div className="mono kr-reply-label">{n ? `${n} ${n === 1 ? "reply" : "replies"}` : "no replies yet: start the conversation"}</div>
      <div className="kr-replies">
        {(replies || []).map((r) => (
          <div key={r.id} className="kr-reply">
            <Post profile={r.profiles} body={r.body} createdAt={r.created_at} reply viewerId={user?.id} />
          </div>
        ))}
        <div>
          {alphaOnly && user && !isAlpha(me) ? (
            <p style={{ fontSize: 13, color: "#6E76B8", margin: 0 }}>Only Alpha Users can reply in this space.</p>
          ) : (
            <ReplyForm threadId={thread.id} loggedIn={!!user} />
          )}
        </div>
      </div>
    </KinRoom>
  );
}

function Post({ profile, body, createdAt, title, reply, viewerId }) {
  return (
    <div className="kr-post">
      <Link href={profile?.username ? `/kin/${profile.username}` : "#"} style={{ flexShrink: 0, textDecoration: "none" }}>
        <KinAvatar profile={profile} size={reply ? 34 : 46} />
      </Link>
      <div className="kr-post-body">
        {title && <h2 className="kr-post-title">{title}</h2>}
        <div className="mono kr-post-meta">
          {profile?.username ? (
            <><Link href={`/kin/${profile.username}`}>{profile.username}</Link><AlphaBadge profile={profile} /></>
          ) : "unknown"}
          {" \u00b7 "}
          {new Date(createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
          {viewerId && profile?.username && profile.id !== viewerId && (
            <>
              {" \u00b7 "}
              <Link href={`/messages/${profile.username}`} title={`Send ${profile.username} a private message`}>&#9993; message</Link>
            </>
          )}
        </div>
        <p className="kr-post-text">{body}</p>
      </div>
    </div>
  );
}
