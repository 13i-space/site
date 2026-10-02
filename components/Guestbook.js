"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { lyraReact } from "../lib/lyraReact";
import { createClient } from "../lib/supabaseBrowser";

// The Kinbook (Update 5.51; the component keeps its old name): an ongoing
// message list from Kin, outside the forum. Signed-in Kin only can write,
// always under their username. Lyra remembers (in this browser) the message
// you left; the first time she sees someone else has written after you,
// she waves.
const MINE_KEY = "13i_guestbook_mine";
const WAVED_KEY = "13i_guestbook_waved";

export default function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | not_connected | error
  const [me, setMe] = useState(undefined); // undefined = checking, null = signed out, { username }
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setMe(null); return; }
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
        setMe({ username: profile?.username || null });
      } catch (e) {
        setMe(null);
      }
    })();
  }, []);
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
      const list = data.entries || [];
      setEntries(list);
      setLoadState("ready");
      try {
        const mine = JSON.parse(localStorage.getItem(MINE_KEY) || "null");
        if (mine && !mine.id) {
          // just signed: find our entry to remember it
          const e = list.find((x) => x.name === mine.name && x.message === mine.message);
          if (e) localStorage.setItem(MINE_KEY, JSON.stringify({ id: e.id, at: e.created_at }));
        } else if (mine && mine.id && !localStorage.getItem(WAVED_KEY)) {
          const after = list.find((x) => x.id !== mine.id && x.created_at > mine.at);
          if (after) { localStorage.setItem(WAVED_KEY, "1"); setTimeout(() => lyraReact("wave"), 900); }
        }
      } catch (e2) { /* storage unavailable - no wave */ }
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
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      try { localStorage.setItem(MINE_KEY, JSON.stringify({ name: data.name, message: message.trim() })); localStorage.removeItem(WAVED_KEY); } catch (e2) { /* ignore */ }
      lyraReact("notice");
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
          The Kinbook isn't connected yet — it needs a Supabase database.
          Once that's set up, this becomes a real, growing wall.
        </p>
      </div>
    );
  }

  return (
    <div>
      {me === null && (
        <div className="panel" style={{ marginBottom: 24, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#8A8FBF" }}>
            <Link href="/login?next=/kinbook" style={{ color: "#B9C0FF" }}>Sign in</Link> to leave a message in the Kinbook.
          </p>
        </div>
      )}
      {me && !me.username && (
        <div className="panel" style={{ marginBottom: 24, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#8A8FBF" }}>
            Claim a username on <Link href="/account" style={{ color: "#B9C0FF" }}>your Node</Link> first - it's the name your messages go under.
          </p>
        </div>
      )}
      {me && me.username && (
      <form onSubmit={submit} className="panel" style={{ marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 11, color: "#6E76B8", marginBottom: 8 }}>
          WRITING AS <span style={{ color: "#B9C0FF" }}>{me.username}</span>
        </div>
        <textarea
          required
          placeholder="Say something to the Kin..."
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
            {posting ? "..." : "Post"}
          </button>
          {postError && (
            <span className="mono" style={{ fontSize: 12, color: "#C97B6E" }}>{postError}</span>
          )}
        </div>
      </form>
      )}

      {loadState === "loading" && (
        <div style={{ fontSize: 13, color: "#565B8F", fontStyle: "italic" }}>Loading...</div>
      )}
      {loadState === "error" && (
        <div style={{ fontSize: 13, color: "#C97B6E" }}>Couldn't load entries right now.</div>
      )}
      {loadState === "ready" && entries.length === 0 && (
        <div style={{ fontSize: 13, color: "#565B8F", fontStyle: "italic" }}>
          Nothing here yet. Be the first.
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
