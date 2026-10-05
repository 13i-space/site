"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";
import LyraOrb from "./LyraOrb";

// Lyra's welcome (Update 5.60). A signed-out visitor who has spent about
// thirty seconds on the site (counted across pages, only while the tab is
// visible) sees Lyra grow and move to the middle of the screen:
//   1. "Hi, I'm Lyra. Welcome to the 13i Universe. I'm here to help."
//   2. Their first assignment: become a member. Everything is free; being
//      Kin is what saves it (an alien you can keep, and send into the
//      Survival Trials).
//   -> "Create my username" goes straight to sign-up, which comes back to
//      /launch?welcome=kin, where she congratulates them.
//   -> "Not now" lets them keep exploring; she asks again in a week.
const SEEN = "13i_seen_ms";
const STATE = "13i_lyra_welcome"; // "done" | "later:<time>"
const JOINING = "13i_lyra_joining"; // sessionStorage: on their way to sign up through her
const AFTER_MS = 30000;
const ASK_AGAIN_MS = 7 * 86400000;
const SKIP = [/^\/login/, /^\/account/, /^\/auth/];

function Typed({ text, speed = 28, onDone }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setN(text.length); onDone && onDone(); return; }
    let i = 0;
    const id = setInterval(() => { i += 1; setN(i); if (i >= text.length) { clearInterval(id); onDone && onDone(); } }, speed);
    return () => clearInterval(id);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  return <>{text.slice(0, n)}<span className="lw2-caret" style={{ opacity: n < text.length ? 1 : 0 }}>|</span></>;
}

export default function LyraWelcome() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [mode, setMode] = useState(null); // null | "intro" | "assignment" | "congrats"
  const [ready, setReady] = useState(false); // her line has finished typing
  const [leaving, setLeaving] = useState(false);
  const [username, setUsername] = useState("");
  const user = useRef(undefined); // undefined = checking, null = signed out

  // who is this?
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user: u } } = await supabase.auth.getUser();
        if (cancelled) return;
        user.current = u || null;
        // just signed up through her: congratulate them on the launch page
        const q = new URLSearchParams(window.location.search);
        let joining = false;
        try { joining = sessionStorage.getItem(JOINING) === "1"; } catch (e) { /* ignore */ }
        // (the note survives a detour through Assignment 0000000 - Before)
        if (u && pathname === "/launch" && (q.get("welcome") === "kin" || joining)) {
          try { sessionStorage.removeItem(JOINING); } catch (e) { /* ignore */ }
          const { data: p } = await supabase.from("profiles").select("username").eq("id", u.id).maybeSingle();
          if (cancelled) return;
          setUsername(p?.username || "");
          try { localStorage.setItem(STATE, "done"); } catch (e) { /* ignore */ }
          setTimeout(() => !cancelled && setMode("congrats"), 1200);
        }
      } catch (e) {
        user.current = null;
      }
    })();
    return () => { cancelled = true; };
  }, [pathname]);

  // the thirty seconds
  useEffect(() => {
    if (SKIP.some((re) => re.test(pathname))) return;
    let state = "";
    try { state = localStorage.getItem(STATE) || ""; } catch (e) { return; }
    if (state === "done") return;
    if (state.startsWith("later:") && Date.now() - Number(state.slice(6)) < ASK_AGAIN_MS) return;
    const id = setInterval(() => {
      if (document.visibilityState !== "visible" || mode) return;
      let seen = 0;
      try { seen = Number(localStorage.getItem(SEEN) || 0) + 1000; localStorage.setItem(SEEN, String(seen)); } catch (e) { return; }
      if (seen >= AFTER_MS && user.current === null) { clearInterval(id); setReady(false); setMode("intro"); }
    }, 1000);
    return () => clearInterval(id);
  }, [pathname, mode]);

  useEffect(() => {
    if (!mode) return;
    const onKey = (e) => { if (e.key === "Escape" && mode !== "congrats") later(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const close = (then) => {
    setLeaving(true);
    setTimeout(() => { setMode(null); setLeaving(false); then && then(); }, 650);
  };
  const later = () => {
    try { localStorage.setItem(STATE, `later:${Date.now()}`); } catch (e) { /* ignore */ }
    close();
  };
  const join = () => {
    try { localStorage.setItem(STATE, `later:${Date.now()}`); sessionStorage.setItem(JOINING, "1"); } catch (e) { /* if they back out, she waits a week */ }
    close(() => router.push(`/login?tab=signup&from=lyra&next=${encodeURIComponent("/launch?welcome=kin")}`));
  };
  const finish = () => close(() => router.replace("/launch"));

  if (!mode) return null;
  return (
    <div className={`lw2 ${leaving ? "lw2-leaving" : ""}`} role="dialog" aria-modal="true" aria-label="Lyra">
      <div className="lw2-backdrop" onClick={mode === "congrats" ? finish : undefined} />
      <div className={`lw2-lyra ${mode === "congrats" ? "lw2-lyra-celebrate" : ""}`}>
        <LyraOrb stage={mode === "congrats" ? 3 : 1} state={mode === "congrats" ? "celebrating" : ready ? "aware" : "speaking"} size={150} />
      </div>
      <div className="lw2-card" key={mode}>
        {mode === "intro" && (
          <>
            <p className="lw2-line"><Typed text="Hi, I'm Lyra. Welcome to the 13i Universe. I'm here to help." onDone={() => setReady(true)} /></p>
            <div className={`lw2-actions ${ready ? "lw2-in" : ""}`}>
              <button className="lw2-primary" onClick={() => { setReady(false); setMode("assignment"); }}>Hi, Lyra &rarr;</button>
              <button className="lw2-quiet" onClick={later}>not now</button>
            </div>
          </>
        )}
        {mode === "assignment" && (
          <>
            <div className="mono lw2-kicker">your first assignment &middot; become Kin</div>
            <p className="lw2-line"><Typed speed={18} text="Everything in the 13i Universe is free. But to keep what you make, you need to be a member." onDone={() => setReady(true)} /></p>
            <div className={`lw2-why ${ready ? "lw2-in" : ""}`}>
              <p>You don&rsquo;t want to build an alien in the Alien Lab and not be able to save it, or send it into the Survival Trials against everyone else&rsquo;s.</p>
              <ul>
                <li>Save your species, stories and progress</li>
                <li>Enter the Survival Trials</li>
                <li>Talk with the Kin in the forum</li>
                <li>A username of your own, and it&rsquo;s free</li>
              </ul>
            </div>
            <div className={`lw2-actions ${ready ? "lw2-in" : ""}`}>
              <button className="lw2-primary" onClick={join}>Create my username &rarr;</button>
              <button className="lw2-quiet" onClick={later}>not now, keep exploring</button>
            </div>
          </>
        )}
        {mode === "congrats" && (
          <>
            <div className="mono lw2-kicker">assignment complete</div>
            <p className="lw2-line lw2-big"><Typed text={`You did it${username ? `, ${username}` : ""}. You're Kin now.`} onDone={() => setReady(true)} /></p>
            <div className={`lw2-why ${ready ? "lw2-in" : ""}`}>
              <p>Everything you make from here on is saved to your Node. I&rsquo;ll be right here in the corner when you need me.</p>
            </div>
            <div className={`lw2-actions ${ready ? "lw2-in" : ""}`}>
              <button className="lw2-primary" onClick={finish}>Let&rsquo;s go &rarr;</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
