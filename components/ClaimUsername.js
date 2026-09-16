"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClaimUsername() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/claim-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not save that username.");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 12.5, color: "#8A8FBF", marginBottom: 10 }}>
        Your account doesn't have a username yet (accounts made before this
        existed, or via the email-link sign-in, skip this step). Pick one:
      </p>
      <input
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        style={{
          width: "100%", background: "transparent", border: "1px solid #262A55",
          borderRadius: 3, color: "#E4E4EF", fontSize: 14, padding: "9px 12px",
          outline: "none", marginBottom: 10, boxSizing: "border-box",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%", background: "none", border: "1px solid #3A3E75", borderRadius: 4,
          color: "#B9C0FF", fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
          padding: "9px", cursor: "pointer", opacity: loading ? 0.5 : 1,
        }}
      >
        {loading ? "Saving..." : "Claim username"}
      </button>
      {error && <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 10 }}>{error}</p>}
    </form>
  );
}
