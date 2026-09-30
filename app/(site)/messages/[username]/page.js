import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabaseServer";
import AlphaBadge from "../../../../components/AlphaBadge";
import MessageThread from "../../../../components/MessageThread";

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
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <Link href="/messages" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>&larr; messages</Link>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "18px 0 20px" }}>
        <Link href={`/kin/${other.username}`} style={{ width: 46, height: 46, borderRadius: "50%", overflow: "hidden", background: "#1C1F48", border: "1px solid #3A3E75", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {other.avatar_url ? <img src={other.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="mono" style={{ color: "#8B95F6" }}>{other.username[0].toUpperCase()}</span>}
        </Link>
        <div>
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 24, color: "#DCDFFF" }}>{other.username}<AlphaBadge profile={other} /></div>
          <div className="mono" style={{ fontSize: 10.5, color: "#565B8F", letterSpacing: "1px" }}>PRIVATE &middot; ONLY THE TWO OF YOU CAN READ THIS</div>
        </div>
      </div>
      <MessageThread meId={user.id} other={{ id: other.id, username: other.username }} />
    </div>
  );
}
