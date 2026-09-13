"use client";

import { useState } from "react";

export default function SubmissionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [story, setStory] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, story }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  if (status === "done") {
    return (
      <div className="panel" style={{ textAlign: "center" }}>
        <p style={{ margin: 0, color: "#8B95F6" }}>
          Received. Thank you for sending this in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="panel">
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Your email (optional, so I can reply)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>
      <textarea
        required
        placeholder="Write or paste your submission here..."
        value={story}
        onChange={(e) => setStory(e.target.value)}
        rows={10}
        style={{ ...inputStyle, width: "100%", resize: "vertical", fontFamily: "'Inter', sans-serif" }}
      />
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14 }}>
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            background: "none",
            border: "1px solid #3A3E75",
            borderRadius: 4,
            color: "#B9C0FF",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            padding: "10px 22px",
            cursor: "pointer",
            opacity: status === "loading" ? 0.5 : 1,
          }}
        >
          {status === "loading" ? "Sending..." : "Submit"}
        </button>
        {status === "error" && (
          <span className="mono" style={{ fontSize: 12, color: "#C97B6E" }}>{message}</span>
        )}
      </div>
    </form>
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
