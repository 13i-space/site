"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";
import { searchSite } from "../lib/siteSearchIndex";
import { STORY_GAMES, openedStories } from "../lib/storyGames";

const TIPS = [
  { prefix: "/explore", text: "Start with the Book or a short story \u2014 everything else on the site connects back to something in here." },
  { prefix: "/play", text: "The Oracle answers as \u201cwe,\u201d never \u201cI.\u201d That's not a typo \u2014 ask it why, if you want." },
  { prefix: "/create/signal-composer", text: "Pick a mood, press play, then change anything \u2014 or describe a feeling and let it compose." },
  { prefix: "/create/alien-lab", text: "There's no wrong answer here \u2014 pick \u201cOther\u201d any time the choices don't fit what you're imagining." },
  { prefix: "/create", text: "You don't need a plan. Start writing as 13i and see where the Assignment takes you." },
  { prefix: "/assignments/write", text: "Stuck partway through? Save progress \u2014 it'll be waiting exactly where you left it." },
  { prefix: "/assignments", text: "Click on a story and explore a new chapter in 13i's assignments." },
  { prefix: "/kinship", text: "New here is fine. Most threads welcome a first post more than you'd expect." },
  { prefix: "/forum", text: "New here is fine. Most threads welcome a first post more than you'd expect." },
  { prefix: "/guestbook", text: "Just a line is enough \u2014 you don't need to write an essay to sign in." },
  { prefix: "/games", text: "Pick one and play \u2014 the story games unlock as you read." },
  { prefix: "/oracle", text: "Short questions tend to get the most interesting answers." },
  { prefix: "/galaxy/news", text: "Fresh from NASA, ESA, Spaceflight Now and more \u2014 each headline opens the full story in a new tab." },
  { prefix: "/galaxy/map", text: "Drag to turn it, scroll or use +/\u2212 to zoom. Worlds from the Assignments appear here once you've read them." },
  { prefix: "/quiz", text: "Ten questions. Your latest grade lands on your Node \u2014 retake it any time." },
  { prefix: "/galaxy/facts", text: "This is the real data \u2014 the Quiz next door tests different trivia entirely." },
  { prefix: "/galaxy/aliens", text: "Every card here was built by a Kin in the Alien Lab \u2014 yours can be next." },
  { prefix: "/galaxy", text: "The map, the facts, the aliens, the quiz, or today's space news \u2014 start anywhere." },
  { prefix: "/book/chapter-1", text: "The player up top follows along \u2014 it switches to Chapter 2's audio when you get there." },
  { prefix: "/book", text: "Read it here, download the ebook, or listen to the audio \u2014 whichever suits you." },
  { prefix: "/wiki", text: "Kept deliberately spoiler-light \u2014 nothing here gives away anything past what you've already read." },
  { prefix: "/music", text: "Every track has its release date listed \u2014 one goes live each month." },
  { prefix: "/artifacts/ninefold", text: "It answers in 27 different ways \u2014 the wheel and the dial up top both matter." },
  { prefix: "/artifacts/cryptex", text: "This isn't decorative \u2014 solve it and something real unlocks." },
  { prefix: "/artifacts", text: "Both artifacts here are real puzzles, not just props \u2014 worth actually solving." },
  { prefix: "/kin/", text: "This is what other Kin see when they look you up \u2014 or you, them." },
  { prefix: "/account", text: "This is your Node. More of it will fill in as the site remembers more about what you've done." },
  { prefix: "/login", text: "Forgot your password rather than never had one? Use \u201cforgot password?\u201d, not sign up." },
];
const DEFAULT_TIP = "Look for the ring-and-eye mark \u2014 it's 13i, wherever it shows up.";

function tipFor(pathname, username) {
  if (pathname === "/launch") {
    return username
      ? `Welcome back ${username} — anything I can help you with today?`
      : "Welcome back — anything I can help you with today?";
  }
  const matches = TIPS.filter((t) => pathname.startsWith(t.prefix));
  if (matches.length === 0) return DEFAULT_TIP;
  matches.sort((a, b) => b.prefix.length - a.prefix.length);
  return matches[0].text;
}

const GAME_INSTRUCTIONS = [
  { prefix: "/games/asteroid-belt", game: "asteroid-belt", text: "Clear the belt, and watch for the mining ship \u2014 destroy its hull before the timer runs out, or its twelve tungsten rods scatter and you'll be clearing those too." },
  { prefix: "/games/nemesis-command", game: "nemesis-command", text: "Move your mouse (or drag on mobile) to aim. Click, tap, or press X to fire. Levels get faster the higher your score \u2014 it never truly stops." },
  { prefix: "/games/deep-signal", game: "deep-signal", text: "Not a shooter. Explore, scan with Space, and choose carefully what you connect to \u2014 something down there notices." },
  { prefix: "/games/13i-vs-nemesis", game: "13i-vs-nemesis", text: "Defend Earth as 13i closes in across five zones. Switch weapons as new ones unlock \u2014 EMP disrupts its defenses, letting your other shots land clean." },
];
// The Games hub: a different nudge each visit - a game you haven't tried,
// a best worth beating, or a story game still waiting to be unlocked.
const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
async function gamesHubMessage(supabase, user) {
  const opened = await openedStories();
  const available = Object.keys(GAME_LABELS).filter((g) => {
    const story = STORY_GAMES.find((s) => s.game === g);
    return !story || opened.has(story.assignment);
  });
  const lockedStory = STORY_GAMES.find((s) => !opened.has(s.assignment));
  let played = new Set();
  let bests = [];
  try {
    const [{ data: plays }, { data: scores }] = await Promise.all([
      supabase.from("game_plays").select("game").eq("user_id", user.id),
      supabase.from("high_scores").select("game, score").eq("user_id", user.id),
    ]);
    played = new Set((plays || []).map((p) => p.game));
    bests = (scores || []).filter((s) => GAME_LABELS[s.game] && s.score > 0);
  } catch (e) {
    // fall through to the general lines
  }
  const options = [];
  available.filter((g) => !played.has(g)).forEach((g) => {
    const name = GAME_LABELS[g];
    options.push(
      `You haven't tried ${name} yet \u2014 maybe today's the day.`,
      `${name} is still waiting for its first game from you.`,
      `Something new? You've never played ${name}.`
    );
  });
  bests.forEach(({ game, score }) => {
    const name = GAME_LABELS[game];
    const s = score.toLocaleString();
    options.push(
      `Your best on ${name} is ${s}. Think you can beat it?`,
      `${s} on ${name} \u2014 that's the number to beat.`,
      `Feeling sharp? Your ${name} record is ${s}. Go get it.`
    );
  });
  if (lockedStory) options.push(`There's a game hidden in ${lockedStory.story} \u2014 read it and it unlocks.`);
  if (!options.length) {
    options.push(
      "Every game here has a daily leaderboard \u2014 today's top spot is up for grabs.",
      "Pick one and play. Nothing here is graded but the scoreboard."
    );
  }
  return pickOne(options);
}

function gameInstructionFor(pathname) {
  return GAME_INSTRUCTIONS.find((g) => pathname.startsWith(g.prefix)) || null;
}

const GAME_LABELS = {
  "asteroid-belt": "Asteroid Belt",
  "nemesis-command": "NEMESIS Command",
  "13i-vs-nemesis": "13i vs NEMESIS",
  "deep-signal": "13i: The Deep Signal",
};

export default function LyraCompanion() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hasMet, setHasMet] = useState(true); // default true so we never flash the intro before checking
  const [username, setUsername] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [query, setQuery] = useState("");
  const [autoMessage, setAutoMessage] = useState(null); // last auto-delivered message - stays set (even after auto-close) so hovering can bring it back
  const [celebrating, setCelebrating] = useState(false);
  const celebrateTimer = useRef(null);
  const autoCloseTimer = useRef(null);

  // Identity check, plus a live subscription - Lyra is mounted once in the
  // persistent site layout and doesn't remount on client-side navigation,
  // so a one-time check alone would miss logging in mid-session (only a
  // full reload would pick it up). onAuthStateChange fires the moment the
  // session actually changes, no reload needed.
  useEffect(() => {
    try {
      setHasMet(!!localStorage.getItem("lyra_met"));
    } catch (e) {
      // ignore - private browsing etc, just skip the "met" memory
    }

    const supabase = createClient();

    const applyUser = async (user) => {
      if (!user) {
        setLoggedIn(false);
        setUsername(null);
        return;
      }
      // Username is loaded before flipping loggedIn, so the arrival message
      // (e.g. the /launch greeting) already has the name when it fires.
      try {
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
        setUsername(profile?.username || null);
      } catch (e) {
        setUsername(null);
      }
      setLoggedIn(true);
    };

    supabase.auth.getUser().then(({ data: { user } }) => applyUser(user)).catch(() => {});

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Celebrate a new personal best, from anywhere on the site
  useEffect(() => {
    const onCelebrate = (e) => {
      const { game, score } = e.detail || {};
      const label = GAME_LABELS[game] || game;
      setAutoMessage(`New personal best on ${label}: ${score.toLocaleString()}!`);
      setCelebrating(true);
      setOpen(true);
      clearTimeout(celebrateTimer.current);
      celebrateTimer.current = setTimeout(() => setCelebrating(false), 2600);
      clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = setTimeout(() => setOpen(false), 6000);
    };
    window.addEventListener("lyra:celebrate", onCelebrate);
    return () => window.removeEventListener("lyra:celebrate", onCelebrate);
  }, []);

  // Auto-deliver help per page. Games get their own play-count-aware
  // version (stays up the very first time, brief after); every other
  // page gets a lighter version of the same idea, tracked per-browser via
  // localStorage rather than the database, since it's low-stakes enough
  // not to need an account. This is a deliberate, scoped exception to
  // "Lyra never opens herself" - only at the moment of arriving somewhere
  // new, never mid-read or mid-game.
  useEffect(() => {
    if (!loggedIn || !pathname) return;
    clearTimeout(autoCloseTimer.current);
    let cancelled = false;

    const showAndMaybeClose = (text, stayOpen) => {
      if (cancelled) return;
      setAutoMessage(text);
      setOpen(true);
      if (!stayOpen) {
        autoCloseTimer.current = setTimeout(() => {
          if (!cancelled) setOpen(false);
        }, 5000);
      }
    };

    const g = gameInstructionFor(pathname);
    if (g) {
      (async () => {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || cancelled) return;
          const { data: existing } = await supabase
            .from("game_plays")
            .select("play_count")
            .eq("user_id", user.id)
            .eq("game", g.game)
            .single();
          showAndMaybeClose(g.text, !existing);
        } catch (e) {
          showAndMaybeClose(g.text, true);
        }
      })();
      return () => { cancelled = true; };
    }

    // the Games hub: fresh encouragement every visit
    if (pathname === "/games") {
      (async () => {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || cancelled) return;
          const text = await gamesHubMessage(supabase, user);
          const seenKey = "lyra_seen_/games";
          let seen = true;
          try { seen = !!localStorage.getItem(seenKey); localStorage.setItem(seenKey, "1"); } catch (e) {}
          showAndMaybeClose(text, !seen);
        } catch (e) {
          // no message is fine
        }
      })();
      return () => { cancelled = true; };
    }

    // non-game pages: once per browser per path
    const seenKey = `lyra_seen_${pathname}`;
    let seen = true;
    try { seen = !!localStorage.getItem(seenKey); } catch (e) {}
    showAndMaybeClose(tipFor(pathname, username), !seen);
    if (!seen) {
      try { localStorage.setItem(seenKey, "1"); } catch (e) {}
    }

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, loggedIn]);

  const toggle = () => {
    setOpen((o) => {
      const next = !o;
      if (next && !hasMet) {
        try { localStorage.setItem("lyra_met", "1"); } catch (e) {}
      }
      return next;
    });
  };

  const onHover = () => {
    if (autoMessage) setOpen(true);
  };

  const closeAndReset = () => {
    setOpen(false);
    setQuery("");
  };

  const results = searchSite(query);
  const displayText = autoMessage
    ? autoMessage
    : !loggedIn
    ? "I'm Lyra. Sign in and I'll start remembering what you've found here."
    : !hasMet
    ? (username ? `Hello, ${username}. I'm Lyra.` : "Hello. I'm Lyra.")
    : tipFor(pathname || "", username);

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
        @keyframes lyraCelebrate {
          0%, 100% { color: #D9DCFF; }
          50% { color: #E8CFC0; }
        }
        .lyra-orb { animation: lyraPulse 3.2s ease-in-out infinite; }
        .lyra-panel { animation: lyraFadeIn 0.22s ease; }
        .lyra-celebrate { animation: lyraCelebrate 0.45s ease-in-out 4; }
      `}</style>

      {open && (
        <div className="lyra-panel" style={styles.panel}>
          <div style={styles.panelHeader}>
            <span className="mono" style={styles.panelLabel}>LYRA</span>
            <button onClick={closeAndReset} style={styles.closeBtn} aria-label="Close">&times;</button>
          </div>

          <p className={celebrating ? "lyra-celebrate" : ""} style={styles.panelText}>
            {displayText}
          </p>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the site..."
            style={styles.searchInput}
          />

          {query.trim() && (
            <div style={styles.results}>
              {results.length === 0 ? (
                <p style={styles.noResults}>Nothing found for that.</p>
              ) : (
                results.map((r) => (
                  <Link key={r.href} href={r.href} onClick={closeAndReset} style={styles.resultLink}>
                    {r.title}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      )}

      <button onClick={toggle} onMouseEnter={onHover} style={styles.orbBtn} aria-label="Lyra">
        <span className={loggedIn ? "lyra-orb" : ""} style={{ ...styles.orb, opacity: loggedIn ? 1 : 0.55 }}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <circle cx="11" cy="11" r="7.5" fill="none" stroke="#E8CFC0" strokeWidth="1.8" opacity={loggedIn ? 1 : 0.7} />
            <circle cx="11" cy="11" r="2.6" fill="#E8CFC0" opacity={loggedIn ? 1 : 0.7} />
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
    width: 250,
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
    margin: "0 0 10px",
  },
  searchInput: {
    width: "100%",
    background: "rgba(4,5,14,0.6)",
    border: "1px solid #262A55",
    borderRadius: 4,
    color: "#E4E4EF",
    fontSize: 12,
    padding: "7px 10px",
    outline: "none",
    boxSizing: "border-box",
  },
  results: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  resultLink: {
    fontSize: 12.5,
    color: "#B9C0FF",
    padding: "6px 8px",
    borderRadius: 3,
    textDecoration: "none",
  },
  noResults: {
    fontSize: 12,
    color: "#565B8F",
    fontStyle: "italic",
    margin: "4px 0 0",
  },
};
