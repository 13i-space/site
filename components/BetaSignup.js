"use client";

import { useState } from "react";

// Countdown page: ask to join the Season 1 beta (opens 1.1.2027).
// Posts to /api/beta, which saves the request and emails Paul.
export default function BetaSignup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [why, setWhy] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), why: why.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
      setMessage(data.already ? "You're already on the beta list. We'll be in touch." : "Request received. 13i will be in touch before the season opens.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div style={s.card}>
      <div style={s.ring} aria-hidden />
      <div className="mono" style={s.kicker}>season 1 · beta</div>
      <div style={s.title}>Become a Beta Kin</div>
      <p style={s.copy}>
        Thirteen weeks before the world sees it, a small crew runs Season 1
        first. Stories, signals, games, a new record every week.
      </p>
      <div className="mono" style={s.date}>opens 1.1.2027</div>

      {status === "done" ? (
        <div className="mono" style={s.done}>{message}</div>
      ) : !open ? (
        <button type="button" onClick={() => setOpen(true)} style={s.cta}>Request beta access</button>
      ) : (
        <form onSubmit={submit} style={s.form}>
          <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your email" style={s.input} aria-label="Email" />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="your name (optional)" style={s.input} maxLength={80} aria-label="Name" />
          <textarea value={why} onChange={(e) => setWhy(e.target.value)} placeholder="what draws you to 13i? (optional)" style={{ ...s.input, minHeight: 64, resize: "vertical" }} maxLength={500} aria-label="Why" />
          <button type="submit" disabled={status === "loading"} style={{ ...s.cta, opacity: status === "loading" ? 0.5 : 1 }}>
            {status === "loading" ? "sending..." : "Send my request"}
          </button>
          {status === "error" && <div className="mono" style={s.err}>{message}</div>}
        </form>
      )}
    </div>
  );
}

const s = {
  card: {
    position: "relative", overflow: "hidden", width: "min(420px, 100%)", margin: "0 auto",
    padding: "24px 22px 22px", borderRadius: 14, textAlign: "center",
    border: "1px solid rgba(232,207,192,0.35)",
    background: "linear-gradient(160deg, rgba(40,30,60,0.75), rgba(14,16,38,0.85))",
    boxShadow: "0 0 40px rgba(232,207,192,0.10), inset 0 0 30px rgba(139,149,246,0.08)",
  },
  ring: {
    position: "absolute", width: 260, height: 260, right: -120, top: -120, borderRadius: "50%",
    border: "1px solid rgba(232,207,192,0.18)", boxShadow: "0 0 0 24px rgba(232,207,192,0.04)", pointerEvents: "none",
  },
  kicker: { fontSize: 10, letterSpacing: "3px", color: "#E8CFC0", textTransform: "uppercase" },
  title: { fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 26, color: "#F3E6DC", marginTop: 6 },
  copy: { color: "#B7BADF", fontSize: 14, lineHeight: 1.55, margin: "10px 0 6px" },
  date: { fontSize: 12, color: "#8B95F6", letterSpacing: "2px", marginBottom: 14 },
  cta: {
    background: "linear-gradient(90deg, #E8CFC0, #B9C0FF)", color: "#14163A", border: "none", borderRadius: 999,
    fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "1px", padding: "10px 22px", cursor: "pointer", fontWeight: 600,
  },
  form: { display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" },
  input: {
    background: "rgba(10,11,28,0.6)", border: "1px solid #3A3E75", borderRadius: 6, color: "#E4E4EF",
    fontFamily: "var(--font-body)", fontSize: 14, padding: "9px 12px",
  },
  done: { fontSize: 12, color: "#E8CFC0", lineHeight: 1.6 },
  err: { fontSize: 11, color: "#C97B6E" },
};
