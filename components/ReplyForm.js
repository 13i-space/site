"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";
import { recordMilestone } from "../lib/milestones";

export default function ReplyForm({ threadId, loggedIn }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!loggedIn) {
    return (
      <p style={{ fontSize: 13.5, color: "#8A8FBF", margin: 0 }}>
        <a href="/login" style={{ color: "#E9D29A" }}>Sign in</a> to join the conversation.
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
    recordMilestone("forum"); // a step of the Kinship assignment
    router.refresh();
  };

  return (
    <form onSubmit={submit}>
      <textarea
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add your voice..."
        className="kr-input"
        style={{ marginBottom: 10 }}
      />
      <button type="submit" disabled={loading || !body.trim()} className="kr-pill">
        {loading ? "Posting..." : "Reply"}
      </button>
      {error && <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 8 }}>{error}</p>}
    </form>
  );
}
