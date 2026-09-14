"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabaseBrowser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setStatus("error");
      setError(authError.message);
      return;
    }
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <div className="page-title">Check your email</div>
        <p style={{ color: "#B7BADF" }}>
          We sent a link to <strong>{email}</strong>. Click it to sign in —
          no password needed.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
      <div className="page-title">Sign In</div>
      <div className="page-subtitle">no password, just a link sent to your email</div>
      <form onSubmit={submit} className="panel">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your email"
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid #262A55",
            borderRadius: 3,
            color: "#E4E4EF",
            fontSize: 14,
            padding: "10px 12px",
            outline: "none",
            marginBottom: 14,
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            width: "100%",
            background: "none",
            border: "1px solid #3A3E75",
            borderRadius: 4,
            color: "#B9C0FF",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            padding: "10px",
            cursor: "pointer",
            opacity: status === "loading" ? 0.5 : 1,
          }}
        >
          {status === "loading" ? "Sending..." : "Send me a sign-in link"}
        </button>
        {status === "error" && (
          <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 12 }}>{error}</p>
        )}
      </form>
    </div>
  );
}
