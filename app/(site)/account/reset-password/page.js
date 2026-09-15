"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../lib/supabaseBrowser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setStatus("loading");
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.updateUser({ password });
    if (authError) {
      setError(authError.message);
      setStatus("idle");
      return;
    }
    setStatus("done");
    setTimeout(() => {
      router.push("/account");
      router.refresh();
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
      <div className="page-title">Set a Password</div>
      <div className="page-subtitle">this becomes your new sign-in password</div>
      {status === "done" ? (
        <p style={{ color: "#B7BADF" }}>Password set — taking you to your account...</p>
      ) : (
        <form onSubmit={submit} className="panel">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="new password (min 8 characters)"
            style={{
              width: "100%", background: "transparent", border: "1px solid #262A55",
              borderRadius: 3, color: "#E4E4EF", fontSize: 14, padding: "10px 12px",
              outline: "none", marginBottom: 14, boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              width: "100%", background: "none", border: "1px solid #3A3E75", borderRadius: 4,
              color: "#B9C0FF", fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              padding: "10px", cursor: "pointer", opacity: status === "loading" ? 0.5 : 1,
            }}
          >
            {status === "loading" ? "Saving..." : "Save password"}
          </button>
          {error && <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 12 }}>{error}</p>}
        </form>
      )}
    </div>
  );
}
