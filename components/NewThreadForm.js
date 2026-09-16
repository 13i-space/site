"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";

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
    router.push(`/forum/${spaceSlug}/${data.id}`);
  };

  return (
    <form onSubmit={submit} className="panel" style={{ maxWidth: 640, margin: "0 auto", textAlign: "left" }}>
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Thread title"
        style={inputStyle}
      />
      <textarea
        required
        rows={6}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What's on your mind..."
        style={{ ...inputStyle, resize: "vertical", fontFamily: "'Inter', sans-serif" }}
      />
      <button type="submit" disabled={loading} style={btnStyle(loading)}>
        {loading ? "Posting..." : "Post thread"}
      </button>
      {error && <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 10 }}>{error}</p>}
    </form>
  );
}

const inputStyle = {
  width: "100%", background: "transparent", border: "1px solid #262A55", borderRadius: 3,
  color: "#E4E4EF", fontSize: 14, padding: "10px 12px", outline: "none", marginBottom: 12,
  boxSizing: "border-box",
};
const btnStyle = (disabled) => ({
  background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF",
  fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "9px 18px",
  cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1,
});
