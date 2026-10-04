import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabaseServer";
import AlphaBadge from "../../../../components/AlphaBadge";
import MessageThread from "../../../../components/MessageThread";
import KinRoom, { KinAvatar } from "../../../../components/KinRoom";

// One private conversation (components/MessageThread.js does the talking).
export const dynamic = "force-dynamic";

export default async function ConversationPage({ params }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: other } = await supabase.from("profiles").select("*").eq("username", decodeURIComponent(params.username)).maybeSingle();
  if (other && other.id === user.id) redirect("/messages");

  if (!other) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <div className="page-title">Not Found</div>
        <p style={{ color: "#8A8FBF" }}>No Kin goes by that name.</p>
        <Link href="/messages" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>&larr; messages</Link>
      </div>
    );
  }

  return (
    <KinRoom room="messages" title={other.username} line="Private: only the two of you can read this." back={{ href: "/messages", label: "all messages" }}>
      <Link href={`/kin/${other.username}`} className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 11, color: "#B59E68", textDecoration: "none", margin: "-12px 0 16px" }}>
        <KinAvatar profile={other} size={28} /> {other.username}<AlphaBadge profile={other} /> &middot; view their Node &rarr;
      </Link>
      <MessageThread meId={user.id} other={{ id: other.id, username: other.username }} />
    </KinRoom>
  );
}
