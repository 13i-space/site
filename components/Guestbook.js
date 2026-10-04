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
        <div className="kr-note" style={{ textAlign: "center" }}>
          <Link href="/login?next=/kinbook">Sign in</Link> to leave a note on the wall. Anyone can read it.
        </div>
      )}
      {me && !me.username && (
        <div className="kr-note" style={{ textAlign: "center" }}>
          Claim a username on <Link href="/account">your Node</Link> first: it&rsquo;s the name your notes go under.
        </div>
      )}
      {me && me.username && (
        <form onSubmit={submit} className="kr-compose">
          <textarea
            required
            placeholder="Leave a note for the Kin..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={500}
            className="kr-input"
          />
          <div className="kr-compose-row">
            <span className="mono" style={{ fontSize: 11, color: "#B59E68" }}>
              signed, <span style={{ color: "#F5EEDB" }}>{me.username}</span> &middot; {500 - message.length} left
            </span>
            <button type="submit" disabled={posting || !message.trim()} className="kr-pill">
              {posting ? "Pinning..." : "Pin it to the wall"}
            </button>
          </div>
          {postError && <div className="mono" style={{ fontSize: 12, color: "#C97B6E", marginTop: 8 }}>{postError}</div>}
        </form>
      )}

      {loadState === "loading" && <div className="kr-empty">Reading the wall...</div>}
      {loadState === "error" && <div style={{ fontSize: 13, color: "#C97B6E" }}>Couldn&rsquo;t load the notes right now.</div>}
      {loadState === "ready" && entries.length === 0 && <div className="kr-empty">The wall is empty. Be the first to leave word.</div>}
      {loadState === "ready" && entries.length > 0 && (
        <div className="kr-wall">
          {entries.map((e, i) => (
            <div key={e.id} className="kr-entry" style={{ "--tilt": `${[-0.8, 0.6, -0.3, 0.9, -0.6, 0.3][i % 6]}deg`, "--tint": TINTS[i % TINTS.length] }}>
              <p className="kr-entry-text">{e.message}</p>
              <div className="mono kr-entry-name">&mdash; {e.name || "a Kin"}{e.created_at ? <span style={{ color: "#565B8F" }}> &middot; {new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span> : null}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// a soft wash per note, so the wall isn't one colour
const TINTS = ["rgba(233,210,154,.10)", "rgba(139,149,246,.12)", "rgba(232,180,200,.10)", "rgba(111,195,168,.10)", "rgba(201,184,240,.11)"];
