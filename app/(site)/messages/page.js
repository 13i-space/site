import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabaseServer";
import AlphaBadge from "../../../components/AlphaBadge";
import NewMessageForm from "../../../components/NewMessageForm";

// Private messages: your conversations with other Kin, newest first.
// Only the two people in a conversation can read it (row-level security,
// docs/v5.12-forum-order-and-messages.sql).
export const dynamic = "force-dynamic";
export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rows, error } = await supabase
    .from("direct_messages")
    .select("id, sender_id, recipient_id, body, created_at, read_at")
    .order("created_at", { ascending: false })
    .limit(500);

  // one entry per person, from the newest message with them
  const byPerson = new Map();
  (rows || []).forEach((m) => {
    const other = m.sender_id === user.id ? m.recipient_id : m.sender_id;
    const entry = byPerson.get(other) || { other, last: m, unread: 0 };
    if (m.recipient_id === user.id && !m.read_at) entry.unread += 1;
    byPerson.set(other, entry);
  });
  const ids = [...byPerson.keys()];
  let profiles = {};
  if (ids.length) {
    const { data } = await supabase.from("profiles").select("*").in("id", ids);
    profiles = Object.fromEntries((data || []).map((p) => [p.id, p]));
  }
  const conversations = [...byPerson.values()].filter((c) => profiles[c.other]?.username);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <Link href="/forum" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>&larr; the forum</Link>
      <div className="page-title" style={{ marginTop: 14 }}>Messages</div>
      <div className="page-subtitle">private conversations between Kin</div>

      <NewMessageForm />

      {error ? (
        <div className="panel"><p style={{ margin: 0, color: "#8A8FBF" }}>Messages aren't switched on yet. (docs/v5.12-forum-order-and-messages.sql needs to be run.)</p></div>
      ) : conversations.length === 0 ? (
        <p style={{ color: "#565B8F", fontStyle: "italic", textAlign: "center" }}>No conversations yet. Find a Kin in the forum and say hello.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {conversations.map((c) => {
            const p = profiles[c.other];
            const mine = c.last.sender_id === user.id;
            return (
              <Link key={c.other} href={`/messages/${p.username}`} className="launch-card" style={{ ...styles.row, borderColor: c.unread ? "#6B5E3E" : "#21244A" }}>
                <span style={styles.avatar}>
                  {p.avatar_url ? <img src={p.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="mono" style={{ color: "#8B95F6" }}>{p.username[0].toUpperCase()}</span>}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ color: "#DCDFFF", fontSize: 14.5 }}>{p.username}<AlphaBadge profile={p} /></span>
                    <span className="mono" style={{ fontSize: 10.5, color: "#565B8F", flexShrink: 0 }}>{new Date(c.last.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </span>
                  <span style={{ display: "block", fontSize: 13, color: c.unread ? "#E8CFC0" : "#8A8FBF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {mine ? "You: " : ""}{c.last.body}
                  </span>
                </span>
                {c.unread > 0 && <span className="mono" style={styles.unread}>{c.unread}</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  row: { display: "flex", alignItems: "center", gap: 12, background: "rgba(14,16,38,0.55)", border: "1px solid #21244A", borderRadius: 4, padding: "12px 16px", textDecoration: "none", color: "inherit" },
  avatar: { width: 38, height: 38, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#1C1F48", border: "1px solid #3A3E75", display: "flex", alignItems: "center", justifyContent: "center" },
  unread: { minWidth: 20, height: 20, borderRadius: 10, background: "#E8CFC0", color: "#0A0B1C", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px", boxSizing: "border-box" },
};
