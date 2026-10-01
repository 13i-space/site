"use client";
import { useEffect, useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../lib/story/storySupabase";

// Create an account / sign in, so a student's story is saved between visits.
export default function StoryStart() {
  const [mode, setMode] = useState("signup");
  const [session, setSession] = useState(undefined);
  const [first, setFirst] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [next, setNext] = useState("/story/lesson-1");

  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    if (n && n.startsWith("/story")) setNext(n);
    const sb = getStoryBrowserClient();
    if (!sb) { setSession(null); return; }
    sb.auth.getSession().then(({ data }) => setSession(data.session || null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s || null));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e) {
    e.preventDefault();
    const sb = getStoryBrowserClient();
    if (!sb) return;
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        if (!first.trim()) throw new Error("What should your Champion call you?");
        if (!age) throw new Error("Please confirm you're 18 or older.");
        if (password.length < 8) throw new Error("Use a password with at least 8 characters.");
        const { data, error } = await sb.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { first_name: first.trim().slice(0, 40) } },
        });
        if (error) throw error;
        if (data.session) {
          await sb.from("story_profiles").upsert({ id: data.user.id, first_name: first.trim().slice(0, 40) });
          window.location.href = next;
        } else {
          setMsg({ ok: true, text: "Almost there. Check your email to confirm your account, then come back and sign in." });
          setMode("signin");
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        window.location.href = next;
      }
    } catch (err) {
      const m = String(err?.message || err);
      setMsg({ ok: false, text: /Invalid login/i.test(m) ? "That email and password don't match. Try again?" : m });
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await getStoryBrowserClient()?.auth.signOut();
    setSession(null);
  }

  if (!storyConfigured) {
    return (
      <div className="sos-narrow sos-center">
        <div>
          <h1 style={{ fontSize: 34, marginBottom: 10 }}>Almost ready</h1>
          <p>Story of Self accounts aren't switched on yet. (The Story Supabase keys still need to be added in Vercel.)</p>
        </div>
      </div>
    );
  }

  if (session === undefined) return <div className="sos-center">One moment…</div>;

  if (session) {
    const name = session.user.user_metadata?.first_name;
    return (
      <div className="sos-narrow" style={{ padding: "56px 24px" }}>
        <div className="sos-invite">
          <div className="sos-eyebrow">Signed in</div>
          <h2>Welcome back{name ? `, ${name}` : ""}.</h2>
          <p className="sos-lede" style={{ fontSize: 17 }}>Your story is saved and waiting for you.</p>
          <div className="sos-hero-actions" style={{ marginTop: 18 }}>
            <a className="sos-btn" href={next === "/story/lesson-1" ? "/story/my-story" : next}>Continue my story</a>
            <button className="sos-btn ghost" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sos-narrow" style={{ padding: "48px 24px" }}>
      <div className="sos-invite">
        <div className="sos-tabs" role="tablist">
          <button className={mode === "signup" ? "on" : ""} onClick={() => { setMode("signup"); setMsg(null); }}>Create account</button>
          <button className={mode === "signin" ? "on" : ""} onClick={() => { setMode("signin"); setMsg(null); }}>Sign in</button>
        </div>
        <h2 style={{ fontSize: 30, marginBottom: 6 }}>{mode === "signup" ? "Save your story as you go" : "Welcome back"}</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          {mode === "signup"
            ? "An account keeps your progress and your Character Snapshot private and safe, so you can pick up where you left off."
            : "Sign in to pick up where you left off."}
        </p>
        <form className="sos-form" onSubmit={submit}>
          {mode === "signup" && (
            <div className="sos-field">
              <label htmlFor="sos-first">First name (what your Champion will call you)</label>
              <input id="sos-first" value={first} onChange={(e) => setFirst(e.target.value)} autoComplete="given-name" maxLength={40} />
            </div>
          )}
          <div className="sos-field">
            <label htmlFor="sos-email">Email</label>
            <input id="sos-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="sos-field">
            <label htmlFor="sos-pass">Password</label>
            <input id="sos-pass" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          </div>
          {mode === "signup" && (
            <ul className="sos-values" style={{ margin: "4px 0" }}>
              <li>
                <label className={age ? "on" : ""}>
                  <input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} />
                  <div><span>I'm 18 or older.</span></div>
                </label>
              </li>
            </ul>
          )}
          {msg && <div className={`sos-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}
          <button className="sos-btn" disabled={busy} type="submit">
            {busy ? "One moment…" : mode === "signup" ? "Create my account" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
