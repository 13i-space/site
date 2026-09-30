"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "../lib/supabaseBrowser";

// A private conversation between two Kin: the messages, oldest first, and a
// box to reply. Checks for new messages every 12 seconds while open, and
// marks what you've read.
const POLL_MS = 12000;

export default function MessageThread({ meId, other }) {
  const [messages, setMessages] = useState(null);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const end = useRef(null);

  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error: e } = await supabase
        .from("direct_messages")
        .select("id, sender_id, recipient_id, body, created_at, read_at")
        .or(`and(sender_id.eq.${meId},recipient_id.eq.${other.id}),and(sender_id.eq.${other.id},recipient_id.eq.${meId})`)
        .order("created_at", { ascending: true })
        .limit(300);
      if (e) throw e;
      setMessages(data || []);
      const unread = (data || []).filter((m) => m.recipient_id === meId && !m.read_at).map((m) => m.id);
      if (unread.length) {
        await supabase.from("direct_messages").update({ read_at: new Date().toISOString() }).in("id", unread);
        window.dispatchEvent(new CustomEvent("13i:messages-read"));
      }
    } catch (e) {
      setMessages((m) => m || []);
      setError("Messages aren't switched on yet, or the connection dropped.");
    }
  }, [meId, other.id]);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error: e2 } = await supabase
        .from("direct_messages")
        .insert({ sender_id: meId, recipient_id: other.id, body: text.slice(0, 2000) })
        .select("id, sender_id, recipient_id, body, created_at, read_at")
        .single();
      if (e2) throw e2;
      setMessages((m) => [...(m || []), data]);
      setBody("");
    } catch (e3) {
      setError("That didn't send. Try again.");
    }
    setSending(false);
  };

  return (
    <div>
      <div className="panel" style={{ minHeight: 220, maxHeight: "55vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, margin: 0 }}>
        {messages === null ? (
          <p className="mono" style={{ fontSize: 11, color: "#565B8F", margin: "auto" }}>opening the channel...</p>
        ) : messages.length === 0 ? (
          <p style={{ fontSize: 13.5, color: "#565B8F", fontStyle: "italic", margin: "auto", textAlign: "center" }}>Nothing here yet. Say hello to {other.username}.</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === meId;
            return (
              <div key={m.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                <div style={{ fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap", color: mine ? "#E8CFC0" : "#D9DCFF", background: mine ? "rgba(232,207,192,0.08)" : "rgba(139,149,246,0.09)", borderRadius: mine ? "10px 10px 2px 10px" : "10px 10px 10px 2px", padding: "8px 12px" }}>
                  {m.body}
                </div>
                <div className="mono" style={{ fontSize: 9.5, color: "#3A3E75", marginTop: 3, textAlign: mine ? "right" : "left" }}>
                  {new Date(m.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  {mine && m.read_at ? " · read" : ""}
                </div>
              </div>
            );
          })
        )}
        <div ref={end} />
      </div>

      <form onSubmit={send} style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(e); } }}
          rows={2}
          maxLength={2000}
          placeholder={`Message ${other.username}...`}
          style={{ flex: 1, resize: "vertical", background: "transparent", border: "1px solid #262A55", borderRadius: 4, color: "#E4E4EF", fontSize: 14, padding: "9px 11px", outline: "none", fontFamily: "'Inter', sans-serif" }}
        />
        <button type="submit" disabled={sending || !body.trim()} className="mono" style={{ background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#E8CFC0", fontSize: 12, padding: "0 16px", cursor: "pointer", opacity: sending || !body.trim() ? 0.4 : 1 }}>
          {sending ? "..." : "send"}
        </button>
      </form>
      {error && <p className="mono" style={{ fontSize: 11, color: "#C97B6E", marginTop: 8 }}>{error}</p>}
    </div>
  );
}
