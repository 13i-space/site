"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";

export default function ReplyForm({ threadId, loggedIn }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!loggedIn) {
    return (
      <p style={{ fontSize: 12.5, color: "#565B8F" }}>
        <a href="/login" style={{ color: "#8B95F6" }}>Log in</a> to reply.
      </p>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
    if (!profile?.username) {
      setError("You need a username before posting - claim one on your account page first.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("forum_replies")
      .insert({ thread_id: threadId, author_id: user.id, body: body.trim() });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setBody("");
    router.refresh();
  };

  return (
    <form onSubmit={submit} style={{ marginTop: 20 }}>
      <textarea
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a reply..."
        style={{
          width: "100%", background: "transparent", border: "1px solid #262A55", borderRadius: 3,
          color: "#E4E4EF", fontSize: 14, padding: "10px 12px", outline: "none", resize: "vertical",
          boxSizing: "border-box", fontFamily: "'Inter', sans-serif", marginBottom: 10,
        }}
      />
      <button
        type="submit"
        disabled={loading || !body.trim()}
        style={{
          background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "8px 16px",
          cursor: "pointer", opacity: loading || !body.trim() ? 0.5 : 1,
        }}
      >
        {loading ? "Posting..." : "Reply"}
      </button>
      {error && <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 8 }}>{error}</p>}
    </form>
  );
}
