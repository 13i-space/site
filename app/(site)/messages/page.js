import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabaseServer";
import AlphaBadge from "../../../components/AlphaBadge";
import NewMessageForm from "../../../components/NewMessageForm";
import KinRoom, { KinAvatar } from "../../../components/KinRoom";

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

  const unread = conversations.reduce((n, c) => n + c.unread, 0);
  return (
    <KinRoom room="messages" title="Messages" line="Private conversations between Kin. Only the two of you can ever read them." unread={unread}>
      <NewMessageForm />

      {error ? (
        <div className="kr-note">Messages aren&rsquo;t switched on yet. (docs/v5.12-forum-order-and-messages.sql needs to be run.)</div>
      ) : conversations.length === 0 ? (
        <div className="kr-empty">No conversations yet. Find a Kin above, or in the <Link href="/forum" style={{ color: "#E9D29A" }}>forum</Link>, and say hello.</div>
      ) : (
        <div className="kr-convos">
          {conversations.map((c) => {
            const p = profiles[c.other];
            const mine = c.last.sender_id === user.id;
            return (
              <Link key={c.other} href={`/messages/${p.username}`} className={`kr-card kr-convo ${c.unread ? "kr-convo-unread" : ""}`}>
                <KinAvatar profile={p} size={44} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ color: "#F1EAD6", fontSize: 16 }}>{p.username}<AlphaBadge profile={p} /></span>
                    <span className="mono" style={{ fontSize: 10.5, color: "#6E76B8", flexShrink: 0 }}>{new Date(c.last.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </span>
                  <span style={{ display: "block", fontSize: 13.5, marginTop: 2, color: c.unread ? "#E9D29A" : "#9DA2CC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {mine ? "You: " : ""}{c.last.body}
                  </span>
                </span>
                {c.unread > 0 && <span className="kr-dot">{c.unread}</span>}
              </Link>
            );
          })}
        </div>
      )}
    </KinRoom>
  );
}
