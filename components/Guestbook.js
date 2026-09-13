"use client";

import { useState, useEffect, useCallback } from "react";

export default function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | not_connected | error
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/guestbook");
      const data = await res.json();
      if (data.error === "not_connected") {
        setLoadState("not_connected");
        return;
      }
      if (!res.ok) throw new Error();
      setEntries(data.entries || []);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setPosting(true);
    setPostError(null);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessage("");
      load();
    } catch (err) {
      setPostError(err.message);
    } finally {
      setPosting(false);
    }
  };

  if (loadState === "not_connected") {
    return (
      <div className="panel">
        <p style={{ margin: 0, fontSize: 13, color: "#8A8FBF" }}>
          The guestbook isn't connected yet — it needs a Supabase database.
          Once that's set up, this becomes a real, growing wall.
        </p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={submit} className="panel" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>
        <textarea
          required
          placeholder="Leave a mark..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          maxLength={500}
          style={{ ...inputStyle, width: "100%", resize: "vertical" }}
        />
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 14 }}>
          <button
            type="submit"
            disabled={posting}
            style={{
              background: "none",
              border: "1px solid #3A3E75",
              borderRadius: 4,
              color: "#B9C0FF",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              padding: "9px 20px",
              cursor: "pointer",
              opacity: posting ? 0.5 : 1,
            }}
          >
            {posting ? "..." : "Sign it"}
          </button>
          {postError && (
            <span className="mono" style={{ fontSize: 12, color: "#C97B6E" }}>{postError}</span>
          )}
        </div>
      </form>

      {loadState === "loading" && (
        <div style={{ fontSize: 13, color: "#565B8F", fontStyle: "italic" }}>Loading...</div>
      )}
      {loadState === "error" && (
        <div style={{ fontSize: 13, color: "#C97B6E" }}>Couldn't load entries right now.</div>
      )}
      {loadState === "ready" && entries.length === 0 && (
        <div style={{ fontSize: 13, color: "#565B8F", fontStyle: "italic" }}>
          No one's signed yet. Be the first.
        </div>
      )}
      {loadState === "ready" && entries.map((e) => (
        <div key={e.id} style={{ padding: "14px 0", borderBottom: "1px solid #21244A" }}>
          <div className="mono" style={{ fontSize: 11, color: "#6E76B8", marginBottom: 4 }}>
            {e.name || "Anonymous"}
          </div>
          <div style={{ fontSize: 14, color: "#D9DCFF", lineHeight: 1.6 }}>{e.message}</div>
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  flex: 1,
  background: "transparent",
  border: "1px solid #262A55",
  borderRadius: 3,
  color: "#E4E4EF",
  fontSize: 13,
  padding: "9px 12px",
  outline: "none",
};
