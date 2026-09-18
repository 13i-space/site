"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";

// Keyed by path prefix, longest/most specific match wins. This is Lyra's
// current entire "understanding" of the site - deliberately simple for
// v1. Later phases (memory of what a visitor has actually done, an
// evolving tone as she's used more) build on top of this same component
// without changing how she's mounted or how she behaves when idle.
const TIPS = [
  { prefix: "/explore", text: "Start with the Book or a short story \u2014 everything else on the site connects back to something in here." },
  { prefix: "/play", text: "The Oracle answers as \u201cwe,\u201d never \u201cI.\u201d That's not a typo \u2014 ask it why, if you want." },
  { prefix: "/create", text: "You don't need a plan. Start writing as 13i and see where the Assignment takes you." },
  { prefix: "/assignments/write", text: "Stuck partway through? Save progress \u2014 it'll be waiting exactly where you left it." },
  { prefix: "/kinship", text: "New here is fine. Most threads welcome a first post more than you'd expect." },
  { prefix: "/forum", text: "New here is fine. Most threads welcome a first post more than you'd expect." },
  { prefix: "/oracle", text: "Short questions tend to get the most interesting answers." },
  { prefix: "/galaxy", text: "The Quiz uses different trivia than the Facts page \u2014 worth both." },
  { prefix: "/book", text: "There's a \u201cread aloud\u201d button on every page of the reader, if you'd rather listen." },
  { prefix: "/account", text: "This is your Node. More of it will fill in as the site remembers more about what you've done." },
];
const DEFAULT_TIP = "Look for the ring-and-eye mark \u2014 it's 13i, wherever it shows up.";

function tipFor(pathname) {
  const matches = TIPS.filter((t) => pathname.startsWith(t.prefix));
  if (matches.length === 0) return DEFAULT_TIP;
  matches.sort((a, b) => b.prefix.length - a.prefix.length);
  return matches[0].text;
}

export default function LyraCompanion() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [greeted, setGreeted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
        if (profile?.username) setUsername(profile.username);
      } catch (e) {
        // quietly do nothing - Lyra just won't have a name to use
      }
    })();
  }, []);

  const toggle = () => {
    setOpen((o) => !o);
    setGreeted(true);
  };

  return (
    <div style={styles.wrap}>
      <style>{`
        @keyframes lyraPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,207,192,0.35); }
          50% { box-shadow: 0 0 0 6px rgba(232,207,192,0); }
        }
        @keyframes lyraFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lyra-orb { animation: lyraPulse 3.2s ease-in-out infinite; }
        .lyra-panel { animation: lyraFadeIn 0.22s ease; }
      `}</style>

      {open && (
        <div className="lyra-panel" style={styles.panel}>
          <div style={styles.panelHeader}>
            <span className="mono" style={styles.panelLabel}>LYRA</span>
            <button onClick={toggle} style={styles.closeBtn} aria-label="Close">&times;</button>
          </div>
          <p style={styles.panelText}>
            {!greeted || !username ? null : `Welcome back, ${username}. `}
            {tipFor(pathname || "")}
          </p>
        </div>
      )}

      <button onClick={toggle} style={styles.orbBtn} aria-label="Lyra">
        <span className="lyra-orb" style={styles.orb}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <circle cx="11" cy="11" r="7.5" fill="none" stroke="#E8CFC0" strokeWidth="1.8" />
            <circle cx="11" cy="11" r="2.6" fill="#E8CFC0" />
          </svg>
        </span>
      </button>
    </div>
  );
}

const styles = {
  wrap: {
    position: "fixed",
    right: 20,
    bottom: 20,
    zIndex: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 10,
  },
  orbBtn: {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  },
  orb: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "linear-gradient(180deg, #1C1F48, #0C0E28)",
    border: "1px solid #3A3E75",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  panel: {
    width: 240,
    background: "linear-gradient(180deg, rgba(16,18,44,0.97), rgba(8,9,24,0.98))",
    border: "1px solid #3A3E75",
    borderRadius: 8,
    padding: "12px 14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  panelLabel: {
    fontSize: 10,
    letterSpacing: "1.5px",
    color: "#8B95F6",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#565B8F",
    fontSize: 16,
    lineHeight: 1,
    cursor: "pointer",
    padding: 0,
  },
  panelText: {
    fontSize: 12.5,
    lineHeight: 1.55,
    color: "#D9DCFF",
    margin: 0,
  },
};
