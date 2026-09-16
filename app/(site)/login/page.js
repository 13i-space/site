"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseBrowser";

const inputStyle = {
  width: "100%",
  background: "transparent",
  border: "1px solid #262A55",
  borderRadius: 3,
  color: "#E4E4EF",
  fontSize: 14,
  padding: "10px 12px",
  outline: "none",
  marginBottom: 12,
  boxSizing: "border-box",
};

const btnStyle = (disabled) => ({
  width: "100%",
  background: "none",
  border: "1px solid #3A3E75",
  borderRadius: 4,
  color: "#B9C0FF",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13,
  padding: "10px",
  cursor: disabled ? "default" : "pointer",
  opacity: disabled ? 0.5 : 1,
});

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState("login"); // login | signup | magic | forgot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // login
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // signup
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // magic link
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const doLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let email = identifier;
    if (!identifier.includes("@")) {
      const res = await fetch("/api/auth/resolve-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not find that account.");
        setLoading(false);
        return;
      }
      email = data.email;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.push("/account");
    router.refresh();
  };

  const doSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email: signupEmail, password: signupPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not create your account.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email: signupEmail, password: signupPassword });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.push("/account");
    router.refresh();
  };

  const doMagic = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: magicEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setMagicSent(true);
  };

  const doForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/auth/reset-callback`,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setForgotSent(true);
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
      <div className="page-title">
        {tab === "signup" ? "Create an Account" : "Login"}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
        <TabBtn active={tab === "login"} onClick={() => { setTab("login"); setError(""); }}>Log in</TabBtn>
        <TabBtn active={tab === "signup"} onClick={() => { setTab("signup"); setError(""); }}>Sign up</TabBtn>
      </div>

      {tab === "login" && (
        <form onSubmit={doLogin} className="panel">
          <input style={inputStyle} required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="username or email" />
          <input style={inputStyle} required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          <button type="submit" disabled={loading} style={btnStyle(loading)}>
            {loading ? "Signing in..." : "Log in"}
          </button>
          {error && <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 12 }}>{error}</p>}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            <button
              type="button"
              onClick={() => { setTab("forgot"); setError(""); }}
              style={{ background: "none", border: "none", color: "#565B8F", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}
            >
              forgot password?
            </button>
            <button
              type="button"
              onClick={() => { setTab("magic"); setError(""); }}
              style={{ background: "none", border: "none", color: "#565B8F", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}
            >
              use a magic link instead
            </button>
          </div>
        </form>
      )}

      {tab === "forgot" && (
        forgotSent ? (
          <div className="panel">
            <p style={{ color: "#B7BADF" }}>
              We sent a link to <strong>{forgotEmail}</strong>. Click it to set a new password.
            </p>
          </div>
        ) : (
          <form onSubmit={doForgot} className="panel">
            <p style={{ fontSize: 12.5, color: "#8A8FBF", marginBottom: 14 }}>
              Already have an account from the old email sign-in? Enter your
              email and we'll send a link to set a password for it.
            </p>
            <input style={inputStyle} required type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="your email" />
            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? "Sending..." : "Send password-set link"}
            </button>
            {error && <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 12 }}>{error}</p>}
            <button
              type="button"
              onClick={() => { setTab("login"); setError(""); }}
              style={{ background: "none", border: "none", color: "#565B8F", fontSize: 12, marginTop: 14, cursor: "pointer", textDecoration: "underline" }}
            >
              back to log in
            </button>
          </form>
        )
      )}

      {tab === "signup" && (
        <form onSubmit={doSignup} className="panel">
          <input style={inputStyle} required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
          <input style={inputStyle} required type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="email" />
          <input style={inputStyle} required type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="password (min 8 characters)" />
          <button type="submit" disabled={loading} style={btnStyle(loading)}>
            {loading ? "Creating account..." : "Create account"}
          </button>
          {error && <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 12 }}>{error}</p>}
        </form>
      )}

      {tab === "magic" && (
        magicSent ? (
          <div className="panel">
            <p style={{ color: "#B7BADF" }}>
              We sent a link to <strong>{magicEmail}</strong>. Click it to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={doMagic} className="panel">
            <input style={inputStyle} required type="email" value={magicEmail} onChange={(e) => setMagicEmail(e.target.value)} placeholder="your email" />
            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? "Sending..." : "Send me a sign-in link"}
            </button>
            {error && <p style={{ color: "#C97B6E", fontSize: 12, marginTop: 12 }}>{error}</p>}
            <button
              type="button"
              onClick={() => { setTab("login"); setError(""); }}
              style={{ background: "none", border: "none", color: "#565B8F", fontSize: 12, marginTop: 14, cursor: "pointer", textDecoration: "underline" }}
            >
              back to username/password
            </button>
          </form>
        )
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="mono"
      style={{
        background: active ? "rgba(139,149,246,0.12)" : "none",
        border: `1px solid ${active ? "#8B95F6" : "#262A55"}`,
        borderRadius: 4,
        color: active ? "#DCDFFF" : "#6E76B8",
        fontSize: 12,
        padding: "6px 16px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
