"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
      setMessage(data.alreadySubscribed ? "You're already on the list." : "You're in. Watch for updates.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  if (status === "done") {
    return (
      <div className="mono" style={{ fontSize: 12, color: "#8B95F6" }}>
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your email"
        style={{
          background: "transparent",
          border: "1px solid #262A55",
          borderRadius: 3,
          color: "#E4E4EF",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          padding: "8px 12px",
          minWidth: 200,
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          background: "none",
          border: "1px solid #3A3E75",
          borderRadius: 3,
          color: "#B9C0FF",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          padding: "8px 16px",
          cursor: "pointer",
          opacity: status === "loading" ? 0.5 : 1,
        }}
      >
        {status === "loading" ? "..." : "Get updates"}
      </button>
      {status === "error" && (
        <div className="mono" style={{ fontSize: 11, color: "#C97B6E", width: "100%" }}>
          {message}
        </div>
      )}
    </form>
  );
}
