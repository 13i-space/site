"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";
import { searchSite } from "../lib/siteSearchIndex";
import { loadJourney } from "../lib/firstAssignment";
import { computeBond } from "../lib/lyraBond";
import { loadMemory, saveMemory, isNewSession, today } from "../lib/lyraMemory";
import {
  TIPS, DEFAULT_TIP, gameInstructionFor, gamesHubMessage, GAME_LABELS,
  pickFresh, welcomeBackLine, AREAS, loreLines, newsLines, journeyLine, greetingLine,
  EVOLUTION, FIRST_ASSIGNMENT_DONE, reviewLine, pageLines,
} from "../lib/lyraLines";
import LyraOrb from "./LyraOrb";

// Lyra: the site's companion, bottom-right on every (site) page.
//
// She remembers each Kin in this browser (lib/lyraMemory.js), so she only
// welcomes you back after a real absence, doesn't repeat herself, and
// mostly waits to be asked: on the homepage she holds one thing worth
// saying - something new since your last visit, a place you haven't been,
// your next First Assignment step, a little of the universe - and shows a
// glowing dot rather than interrupting. She opens by herself only for a
// welcome back, a first visit to a page, a game's instructions, and
// celebrations (a new best, a Continuance verdict, finishing Your First
// Assignment, and her own changes as your bond grows - lib/lyraBond.js).
//
// Signed in, you can talk with her (app/api/lyra): about the site, the 13i
// universe and its stories, or small everyday things. Her panel's box also
// searches the site as you type.
const LONG_ABSENCE_DAYS = 3;
const LAUNCH_LINE_MS = 30 * 60 * 1000;
const AUTO_CLOSE_MS = 8000;

async function loadCounts(supabase, uid) {
  const [reads, plays, quiz] = await Promise.all([
    supabase.from("reading_progress").select("assignment_number").eq("user_id", uid),
    supabase.from("game_plays").select("game").eq("user_id", uid),
    supabase.from("quiz_results").select("grade").eq("user_id", uid).maybeSingle(),
  ]);
  let { data: species, error } = await supabase.from("alien_species").select("id, name, review").eq("user_id", uid);
  if (error) ({ data: species } = await supabase.from("alien_species").select("id, name").eq("user_id", uid));
  const readNumbers = (reads.data || []).map((r) => r.assignment_number);
  return {
    readNumbers,
    reads: readNumbers.length,
    games: new Set((plays.data || []).map((p) => p.game)).size,
    species: (species || []).length,
    reviews: (species || []).filter((s) => s.review).length,
    quiz: quiz.data?.grade || null,
  };
}

function suggestionsFor(pathname, stage) {
  const page = [
    ["/assignments/", "What is this story about? No spoilers."],
    ["/book", "Who are Aiden and Xavier?"],
    ["/galaxy/aliens", "How do the Survival Trials work?"],
    ["/music", "When does the next song come out?"],
    ["/games", "Which game should I try?"],
    ["/oracle", "How are you different from 13i?"],
    ["/create/alien-lab", "Help me imagine a species."],
    ["/galaxy/map", "Where is 13i's home world?"],
  ].filter(([p]) => pathname.startsWith(p)).map(([, q]) => q);
  const general = ["What should I do next?", "Who is Lyra in the book?", "What is the Continuance Rule?"];
  if (stage >= 3) general.unshift("Tell me something strange about 13i.");
  return [...page, ...general].slice(0, 3);
}

// "[label](/path)" -> site links; everything else stays plain text
function Rich({ text, onNavigate }) {
  const parts = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<Link key={m.index} href={m[2]} onClick={onNavigate} style={{ color: "#E8CFC0" }}>{m[1]}</Link>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export default function LyraCompanion() {
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null); // { id, username }
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [line, setLine] = useState(null); // what she's saying / holding
  const [hasMessage, setHasMessage] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [bond, setBond] = useState(computeBond());
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState("");

  const memory = useRef(null);
  const session = useRef({ prevSeen: null, firstEver: false });
  const feed = useRef(null);
  const journey = useRef(null);
  const counts = useRef({ readNumbers: [] });
  const queue = useRef([]); // celebrations waiting for the next arrival
  const autoCloseTimer = useRef(null);
  const celebrateTimer = useRef(null);
  const chatEnd = useRef(null);
  const loggedIn = !!user;
  const uid = user?.id || null;

  const remember = useCallback((fn) => {
    if (!memory.current) return;
    fn(memory.current);
    saveMemory(uid, memory.current);
  }, [uid]);

  // Say something. auto: open the panel now (briefly, unless stay);
  // otherwise hold it and show the dot.
  const speak = useCallback((text, { auto = false, stay = false, celebrate = false, id } = {}) => {
    if (!text) return;
    setLine(text);
    if (id) remember((m) => { m.recent.push(id); });
    clearTimeout(autoCloseTimer.current);
    if (celebrate) {
      setCelebrating(true);
      clearTimeout(celebrateTimer.current);
      celebrateTimer.current = setTimeout(() => setCelebrating(false), 2600);
    }
    if (auto) {
      setOpen(true);
      setHasMessage(false);
      if (!stay) autoCloseTimer.current = setTimeout(() => setOpen(false), AUTO_CLOSE_MS);
    } else {
      setHasMessage(true);
    }
  }, [remember]);

  // ---- who's here ----
  useEffect(() => {
    const supabase = createClient();
    const applyUser = async (u) => {
      if (!u) { setUser(null); setAuthChecked(true); return; }
      let username = null;
      try {
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", u.id).single();
        username = profile?.username || null;
      } catch (e) { /* no name yet */ }
      setUser((prev) => (prev && prev.id === u.id && prev.username === username ? prev : { id: u.id, username }));
      setAuthChecked(true);
    };
    supabase.auth.getUser().then(({ data: { user: u } }) => applyUser(u)).catch(() => setAuthChecked(true));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => applyUser(s?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  // ---- how far along this Kin is, and anything worth celebrating ----
  const refreshBond = useCallback(async () => {
    if (!uid) return;
    try {
      const supabase = createClient();
      const [c, j] = await Promise.all([loadCounts(supabase, uid), loadJourney()]);
      counts.current = c;
      journey.current = j;
      const complete = j.signedIn && Object.values(j.done).filter(Boolean).length === 6;
      const b = computeBond({ ...c, firstComplete: complete, visitDays: memory.current?.visitDays.length || 0 });
      setBond(b);
      const m = memory.current;
      if (!m) return;
      if (complete && !m.celebrated.firstAssignment) {
        remember((mm) => { mm.celebrated.firstAssignment = true; });
        queue.current.push({ text: FIRST_ASSIGNMENT_DONE, stay: true });
      }
      if (m.stage === null) {
        remember((mm) => { mm.stage = b.stage; }); // first meeting: no fanfare for the starting stage
      } else if (b.stage > m.stage) {
        remember((mm) => { mm.stage = b.stage; });
        queue.current.push({ text: EVOLUTION[b.stage], stay: true });
      }
    } catch (e) {
      // she carries on with what she knows
    }
  }, [uid, remember]);

  // ---- waking up: memory, what's new, the bond ----
  useEffect(() => {
    if (!authChecked) return;
    let cancelled = false;
    setReady(false);
    memory.current = loadMemory(uid);
    const m = memory.current;
    const prevKey = `lyra_prev_seen_${uid || "guest"}`;
    if (isNewSession(uid)) {
      session.current = { prevSeen: m.lastSeenAt, firstEver: !m.lastSeenAt };
      try { sessionStorage.setItem(prevKey, JSON.stringify(session.current)); } catch (e) { /* ignore */ }
    } else {
      try { session.current = JSON.parse(sessionStorage.getItem(prevKey) || "null") || session.current; } catch (e) { /* ignore */ }
    }
    if (!m.visitDays.includes(today())) remember((mm) => { mm.visitDays.push(today()); });
    try {
      const saved = JSON.parse(sessionStorage.getItem(`lyra_chat_${uid || "guest"}`) || "[]");
      setChat(Array.isArray(saved) ? saved : []);
    } catch (e) { setChat([]); }

    (async () => {
      try { feed.current = await (await fetch("/api/lyra/feed")).json(); } catch (e) { feed.current = null; }
      await refreshBond();
      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked, uid]);

  // ---- arriving somewhere ----
  useEffect(() => {
    if (!ready || !pathname || !memory.current) return;
    const m = memory.current;
    const prefix = pathname.split("/").slice(0, 3).join("/") || "/";
    const firstVisitHere = !m.visited.includes(prefix);
    remember((mm) => {
      mm.lastSeenAt = new Date().toISOString();
      if (firstVisitHere) mm.visited.push(prefix);
    });
    clearTimeout(autoCloseTimer.current);
    let cancelled = false;

    // anything worth celebrating comes first, one after another
    if (queue.current.length) {
      const playQueue = () => {
        const next = queue.current.shift();
        if (!next || cancelled) return;
        speak(next.text, { auto: true, stay: next.stay, celebrate: true });
        if (queue.current.length) setTimeout(playQueue, 9000);
      };
      playQueue();
      return () => { cancelled = true; };
    }

    const stage = bond.stage;
    const username = user?.username;

    // a game: its instructions (stay up the first time it's played)
    const g = gameInstructionFor(pathname);
    if (g) {
      if (!loggedIn) { setLine(g.text); return; }
      (async () => {
        try {
          const supabase = createClient();
          const { data: existing } = await supabase.from("game_plays").select("play_count").eq("user_id", uid).eq("game", g.game).maybeSingle();
          if (!cancelled) speak(g.text, { auto: true, stay: !existing });
        } catch (e) {
          if (!cancelled) speak(g.text, { auto: true, stay: true });
        }
      })();
      return () => { cancelled = true; };
    }

    // the Games hub: a fresh nudge each visit, held rather than pushed
    if (pathname === "/games" && loggedIn) {
      (async () => {
        try {
          const text = await gamesHubMessage(createClient(), { id: uid });
          if (!cancelled) speak(text, { auto: firstVisitHere, stay: firstVisitHere });
        } catch (e) { /* nothing to add */ }
      })();
      return () => { cancelled = true; };
    }

    // the homepage
    if (pathname === "/launch") {
      if (!loggedIn) {
        setLine("I'm Lyra. Sign in and I'll start remembering what you've found here - and we can talk.");
        return;
      }
      const s = session.current;
      if (s.firstEver && !m.celebrated.met) {
        remember((mm) => { mm.celebrated.met = true; });
        speak(`Hello${username ? `, ${username}` : ""}. I'm Lyra. I'll learn this place alongside you. Ask me anything - about the site, the story, or whatever's on your mind.`, { auto: true, stay: true });
        return;
      }
      const daysAway = s.prevSeen ? Math.floor((Date.now() - new Date(s.prevSeen)) / 86400000) : 0;
      const memoryForNews = { ...m, lastSeenAt: s.prevSeen };
      const news = newsLines({ feed: feed.current, memory: memoryForNews, userId: uid, readNumbers: counts.current.readNumbers || [] });
      const extras = [...news, journeyLine(journey.current)].filter(Boolean).filter((l) => !m.recent.includes(l.id)).sort((a, b) => (b.priority || 0) - (a.priority || 0));

      let welcomed = false;
      try { welcomed = !!sessionStorage.getItem(`lyra_welcomed_${uid}`); sessionStorage.setItem(`lyra_welcomed_${uid}`, "1"); } catch (e) { welcomed = true; }
      if (!welcomed && daysAway >= LONG_ABSENCE_DAYS) {
        const w = welcomeBackLine({ days: daysAway, stage, username });
        const more = extras[0];
        if (more?.headline) remember((mm) => { mm.headlines.push(more.headline); });
        speak(`${w.text}${more ? ` ${more.text}` : ""}`, { auto: true, id: more?.id });
        return;
      }

      // hold one thing worth saying, at most every half hour
      if (m.launchLine && Date.now() - m.launchLine.at < LAUNCH_LINE_MS) {
        setLine(m.launchLine.text);
        return;
      }
      const unvisited = AREAS.filter((a) => !m.visited.some((v) => v.startsWith(a.prefix))).map((a) => ({ id: `area-${a.prefix}`, priority: 3, text: a.text }));
      const pool = [
        ...extras,
        ...unvisited,
        ...loreLines(stage).map((l) => ({ ...l, priority: 2 })),
        greetingLine({ hour: new Date().getHours(), username, stage }),
      ].filter((l) => !m.recent.includes(l.id));
      const top = pool.length ? Math.max(...pool.map((l) => l.priority || 0)) : 0;
      // vary it: any of the best few, not always the single highest
      const choice = pickFresh(pool.filter((l) => (l.priority || 0) >= top - 1), m.recent) || greetingLine({ hour: new Date().getHours(), username, stage });
      remember((mm) => {
        mm.launchLine = { id: choice.id, text: choice.text, at: Date.now() };
        if (choice.headline) mm.headlines.push(choice.headline);
      });
      speak(choice.text, { id: choice.id });
      return;
    }

    // anywhere else: a tip the first time (signed in: she shows it),
    // then a varied, personal line held for whenever you open her
    const lines = pageLines({ pathname, stage, bondCounts: counts.current, feed: feed.current, readNumbers: counts.current.readNumbers || [] });
    if (firstVisitHere) {
      const tip = lines[0]?.text || DEFAULT_TIP;
      if (loggedIn) speak(tip, { auto: true, stay: true, id: lines[0]?.id });
      else setLine(tip);
      return;
    }
    const choice = pickFresh(lines, m.recent) || lines[0];
    setLine(choice ? choice.text : DEFAULT_TIP);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, pathname]);

  // ---- things happening elsewhere on the site ----
  useEffect(() => {
    const onCelebrate = (e) => {
      const { game, score } = e.detail || {};
      speak(`New personal best on ${GAME_LABELS[game] || game}: ${Number(score).toLocaleString()}!`, { auto: true, celebrate: true });
    };
    const onSay = (e) => e.detail?.text && speak(e.detail.text, { auto: true });
    const onMilestone = async (e) => {
      const { milestone, verdict, name } = e.detail || {};
      if (milestone === "review") speak(reviewLine({ verdict, name }), { auto: true, celebrate: verdict === "granted" });
      if (milestone === "map" && !journey.current?.done?.map) speak("You found your species out there. That's a step of your First Assignment done.", { auto: true });
      // then anything bigger: finishing the First Assignment, or Lyra changing
      await refreshBond();
      if (queue.current.length) {
        const next = queue.current.shift();
        setTimeout(() => speak(next.text, { auto: true, stay: next.stay, celebrate: true }), milestone === "oracle" ? 400 : 5000);
      }
    };
    window.addEventListener("lyra:celebrate", onCelebrate);
    window.addEventListener("lyra:say", onSay);
    window.addEventListener("13i:milestone", onMilestone);
    return () => {
      window.removeEventListener("lyra:celebrate", onCelebrate);
      window.removeEventListener("lyra:say", onSay);
      window.removeEventListener("13i:milestone", onMilestone);
    };
  }, [speak, refreshBond]);

  // ---- talking with her ----
  const saveChat = (c) => {
    try { sessionStorage.setItem(`lyra_chat_${uid || "guest"}`, JSON.stringify(c.slice(-20))); } catch (e) { /* ignore */ }
  };
  const ask = async (text) => {
    const q = text.trim();
    if (!q || sending || !loggedIn) return;
    const next = [...chat, { role: "user", content: q }];
    setChat(next);
    saveChat(next);
    setQuery("");
    setChatError("");
    setSending(true);
    clearTimeout(autoCloseTimer.current);
    try {
      const res = await fetch("/api/lyra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, page: pathname }),
      });
      const data = await res.json();
      if (!data.reply) throw new Error(data.error || "I lost the thread for a moment. Try me again?");
      const withReply = [...next, { role: "assistant", content: data.reply }];
      setChat(withReply);
      saveChat(withReply);
    } catch (e) {
      setChatError(e.message);
    }
    setSending(false);
  };
  const clearChat = () => { setChat([]); saveChat([]); setChatError(""); };

  useEffect(() => { chatEnd.current?.scrollIntoView({ block: "end" }); }, [chat, sending]);

  const toggle = () => {
    setOpen((o) => !o);
    setHasMessage(false);
    clearTimeout(autoCloseTimer.current);
  };
  const close = () => { setOpen(false); setQuery(""); };
  const onHover = () => {
    if (hasMessage && !open) { setOpen(true); setHasMessage(false); }
  };

  const results = query.trim() ? searchSite(query).slice(0, 4) : [];
  const state = !loggedIn ? "dormant" : sending ? "thinking" : celebrating ? "celebrating" : open ? "speaking" : "aware";
  const text = line || (loggedIn ? TIPS.find((t) => pathname?.startsWith(t.prefix))?.text || DEFAULT_TIP : "I'm Lyra. Sign in and I'll start remembering what you've found here.");

  return (
    <div style={styles.wrap}>
      {open && (
        <div className="lyra-panel" style={styles.panel} role="dialog" aria-label="Lyra">
          <div style={styles.panelHeader}>
            <span className="mono" style={styles.panelLabel}>
              LYRA{loggedIn && <span style={{ color: "#565B8F" }}> &middot; {bond.name.toUpperCase()}</span>}
            </span>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {chat.length > 0 && <button onClick={clearChat} className="mono" style={styles.smallBtn}>new chat</button>}
              <button onClick={close} style={styles.closeBtn} aria-label="Close">&times;</button>
            </span>
          </div>

          <div style={styles.scroll}>
            <p className={celebrating ? "lyra-celebrate" : ""} style={styles.panelText}>
              <Rich text={text} onNavigate={close} />
            </p>

            {chat.map((msg, i) => (
              <div key={i} style={msg.role === "user" ? styles.userMsg : styles.lyraMsg}>
                {msg.role === "user" ? msg.content : <Rich text={msg.content} onNavigate={close} />}
              </div>
            ))}
            {sending && <div className="lyra-typing" style={{ padding: "4px 2px 8px" }}><span /><span /><span /></div>}
            {chatError && <p className="mono" style={{ fontSize: 11, color: "#C97B6E", margin: "4px 0 8px" }}>{chatError}</p>}
            <div ref={chatEnd} />
          </div>

          {loggedIn && chat.length === 0 && !query && (
            <div style={styles.chips}>
              {suggestionsFor(pathname || "", bond.stage).map((s) => (
                <button key={s} onClick={() => ask(s)} style={styles.chip}>{s}</button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); if (loggedIn) ask(query); else if (results[0]) window.location.href = results[0].href; }} style={{ display: "flex", gap: 6 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={loggedIn ? "Ask me anything, or search..." : "Search the site..."}
              maxLength={1500}
              style={styles.searchInput}
              aria-label={loggedIn ? "Ask Lyra or search the site" : "Search the site"}
            />
            {loggedIn && (
              <button type="submit" disabled={sending || !query.trim()} className="mono" style={{ ...styles.askBtn, opacity: sending || !query.trim() ? 0.4 : 1 }}>ask</button>
            )}
          </form>

          {query.trim() && (
            <div style={styles.results}>
              {results.length > 0 && <span className="mono" style={{ fontSize: 9.5, color: "#565B8F", letterSpacing: "1px" }}>PAGES</span>}
              {results.map((r) => (
                <Link key={r.href} href={r.href} onClick={close} style={styles.resultLink}>{r.title}</Link>
              ))}
              {loggedIn && <span className="mono" style={{ fontSize: 10, color: "#565B8F", marginTop: 4 }}>press enter to ask me instead</span>}
              {!loggedIn && results.length === 0 && <p style={styles.noResults}>Nothing found for that.</p>}
            </div>
          )}
        </div>
      )}

      <button onClick={toggle} onMouseEnter={onHover} style={styles.orbBtn} aria-label={hasMessage ? "Lyra has something to tell you" : "Lyra"}>
        <LyraOrb stage={loggedIn ? bond.stage : 0} state={state} hasMessage={hasMessage && !open} />
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
    lineHeight: 0,
  },
  panel: {
    width: "min(320px, calc(100vw - 40px))",
    background: "linear-gradient(180deg, rgba(16,18,44,0.97), rgba(8,9,24,0.98))",
    border: "1px solid #3A3E75",
    borderRadius: 8,
    padding: "12px 14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    boxSizing: "border-box",
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
  smallBtn: {
    background: "none",
    border: "none",
    color: "#565B8F",
    fontSize: 10,
    cursor: "pointer",
    padding: 0,
  },
  scroll: {
    maxHeight: "min(340px, 50vh)",
    overflowY: "auto",
    marginBottom: 8,
  },
  panelText: {
    fontSize: 12.5,
    lineHeight: 1.55,
    color: "#D9DCFF",
    margin: "0 0 10px",
  },
  lyraMsg: {
    fontSize: 12.5,
    lineHeight: 1.55,
    color: "#D9DCFF",
    background: "rgba(139,149,246,0.08)",
    borderRadius: "8px 8px 8px 2px",
    padding: "7px 10px",
    margin: "0 24px 8px 0",
    whiteSpace: "pre-wrap",
  },
  userMsg: {
    fontSize: 12.5,
    lineHeight: 1.5,
    color: "#E8CFC0",
    background: "rgba(232,207,192,0.08)",
    borderRadius: "8px 8px 2px 8px",
    padding: "7px 10px",
    margin: "0 0 8px 24px",
    textAlign: "right",
    whiteSpace: "pre-wrap",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    background: "none",
    border: "1px solid #262A55",
    borderRadius: 12,
    color: "#B9C0FF",
    fontSize: 11,
    padding: "4px 9px",
    cursor: "pointer",
    textAlign: "left",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    background: "rgba(4,5,14,0.6)",
    border: "1px solid #262A55",
    borderRadius: 4,
    color: "#E4E4EF",
    fontSize: 12,
    padding: "7px 10px",
    outline: "none",
    boxSizing: "border-box",
  },
  askBtn: {
    background: "none",
    border: "1px solid #3A3E75",
    borderRadius: 4,
    color: "#E8CFC0",
    fontSize: 11,
    padding: "0 10px",
    cursor: "pointer",
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
    padding: "5px 8px",
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
