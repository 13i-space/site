"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";
import { recordMilestone } from "../lib/milestones";

export default function NewThreadForm({ spaceId, spaceSlug }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You need to be logged in.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
    if (!profile?.username) {
      setError("You need a username before posting - claim one on your account page first.");
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("forum_threads")
      .insert({ space_id: spaceId, author_id: user.id, title: title.trim(), body: body.trim() })
      .select("id")
      .single();

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    recordMilestone("forum"); // a step of the Kinship assignment
    router.push(`/forum/${spaceSlug}/${data.id}`);
  };

  return (
    <form onSubmit={submit} className="kr-card" style={{ textAlign: "left" }}>
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="A title for your thread"
        className="kr-input"
        style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, marginBottom: 12 }}
      />
      <textarea
        required
        rows={7}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What's on your mind..."
        className="kr-input"
        style={{ marginBottom: 14 }}
      />
      <button type="submit" disabled={loading} className="kr-pill">
        {loading ? "Posting..." : "Post thread"}
      </button>
      {error && <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 10 }}>{error}</p>}
    </form>
  );
}

