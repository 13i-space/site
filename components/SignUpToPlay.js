"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabaseBrowser";

// Whether a visitor is signed in: null while checking, then true / false.
export function useSignedIn() {
  const [signedIn, setSignedIn] = useState(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!cancelled) setSignedIn(!!user);
      } catch (e) {
        if (!cancelled) setSignedIn(false); // auth not set up - treat as signed out
      }
    })();
    return () => { cancelled = true; };
  }, []);
  return signedIn;
}

export const signUpHref = (next) => `/login?tab=signup${next ? `&next=${encodeURIComponent(next)}` : ""}`;

// The panel a signed-out visitor sees in place of a Kin-only game.
export default function SignUpToPlay({ title, next }) {
  return (
    <div className="panel" style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", padding: "36px 28px" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "2px", color: "#8B95F6", marginBottom: 10 }}>FOR THE KIN</div>
      <div className="wordmark" style={{ fontSize: 26, color: "#DCDFFF", marginBottom: 10 }}>{title ? `Sign up to play ${title}` : "Sign up to play"}</div>
      <p style={{ color: "#8A8FBF", fontSize: 14, lineHeight: 1.6, margin: "0 0 22px" }}>
        NEMESIS Command, Asteroid Belt and 13i vs NEMESIS are open to everyone. The rest of the games are for the Kin: it&rsquo;s free, and your scores, records and progress follow you.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href={signUpHref(next)} className="mono" style={btn(true)}>Create a free account</Link>
        <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="mono" style={btn(false)}>I already have one</Link>
      </div>
    </div>
  );
}

const btn = (primary) => ({
  display: "inline-block",
  padding: "10px 20px",
  border: `1px solid ${primary ? "#8B95F6" : "#3A3E75"}`,
  borderRadius: 4,
  color: primary ? "#DCDFFF" : "#B9C0FF",
  background: primary ? "rgba(139,149,246,0.12)" : "none",
  fontSize: 12,
  textDecoration: "none",
});
