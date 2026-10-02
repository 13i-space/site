"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "../lib/supabaseBrowser";
import { searchSite } from "../lib/siteSearchIndex";
import { loadJourney } from "../lib/firstAssignment";
import { ASSIGNMENTS } from "../lib/assignments";
import { computeBond } from "../lib/lyraBond";
import { loadMemory, saveMemory, isNewSession, today } from "../lib/lyraMemory";
import {
  TIPS, DEFAULT_TIP, gameInstructionFor, gamesHubMessage, GAME_LABELS,
  pickFresh, welcomeBackLine, AREAS, loreLines, newsLines, journeyLine, greetingLine,
  EVOLUTION, reviewLine, pageLines,
} from "../lib/lyraLines";
import { isAlpha, alphaNumber, ALPHA_FORUM } from "../lib/alpha";
import LyraOrb from "./LyraOrb";
import { getPersonalBest } from "../lib/trackActivity";
import { lyraReact } from "../lib/lyraReact";

// Lyra: the site's companion, bottom-right on every (site) page.
//
// She remembers each Kin in this browser (lib/lyraMemory.js), so she only
// welcomes you back after a real absence and doesn't repeat herself. On
// each page she shows her line for about 2.5 seconds, then goes quiet;
// hovering over her (or clicking) brings it back. On the homepage that line
// is one thing worth saying - something new since your last visit, a place
// you haven't been, your next assignment step, a little of the universe.
// Celebrations (a new best, a Continuance verdict, finishing an assignment,
// her own changes as your bond grows - lib/lyraBond.js) stay a little longer.
//
// She also keeps you on top of communication: a new private message, or a
// reply in a forum thread you started or joined, brings her up with an
// alert and a link straight to it. Alerts stay until you close them or
// read what they point to.
//
// Signed in, you can talk with her (app/api/lyra): about the site, the 13i
// universe and its stories, or small everyday things. The conversation is
// only for the moment - it clears when you close her or change pages. Her
// panel's box also searches the site as you type.
// Restraint (Update 5.47): she speaks up on her own only when it matters -
// a page you've never seen, a game you haven't played, something new, a
// celebration, a message for you, or after a week away. Anywhere you've
// been before she stays in the background: her line is held, and hovering
// over her or clicking brings it up. Every 3rd, 6th and 9th page of a visit
// (then every 9th) she offers a little conversation of her own - 13i's
// number, in threes. In the Oracle's chamber she says nothing at all.
const LONG_ABSENCE_DAYS = 7;
const ORACLE_LINE = "This is where 13i speaks. I'll stay quiet here. Ask it anything.";
// the visit's page count, per browser session: true on the pages she talks
function talkTurn(uid) {
  try {
    const k = `lyra_pages_${uid || "guest"}`;
    const n = Number(sessionStorage.getItem(k) || 0) + 1;
    sessionStorage.setItem(k, String(n));
    return n === 3 || n === 6 || n === 9 || (n > 9 && n % 9 === 0);
  } catch (e) {
    return false;
  }
}
const LAUNCH_LINE_MS = 30 * 60 * 1000;
const PEEK_MS = 2500; // how long an arrival message shows by itself
const COMMS_POLL_MS = 45000; // how often she checks for new messages and forum replies
const CELEBRATE_MS = 6500;
const HOVER_CLOSE_MS = 700;

async function loadCounts(supabase, uid) {
  const [reads, plays, quiz] = await Promise.all([
    supabase.from("reading_progress").select("assignment_number").eq("user_id", uid),
    supabase.from("game_plays").select("game").eq("user_id", uid),
    supabase.from("quiz_results").select("grade").eq("user_id", uid).maybeSingle(),
  ]);
  let { data: species, error } = await supabase.from("alien_species").select("id, name, review").eq("user_id", uid);
  if (error) ({ data: species } = await supabase.from("alien_species").select("id, name").eq("user_id", uid));
  const readNumbers = (reads.data || []).map((r) => r.assignment_number);
  let unread = 0;
  try {
    const { count } = await supabase.from("direct_messages").select("id", { count: "exact", head: true }).eq("recipient_id", uid).is("read_at", null);
    unread = count || 0;
  } catch (e) { /* messages not switched on yet */ }
  return {
    unread,
    readNumbers,
    reads: readNumbers.length,
    games: new Set((plays.data || []).map((p) => p.game)).size,
    species: (species || []).length,
    reviews: (species || []).filter((s) => s.review).length,
    quiz: quiz.data?.grade || null,
  };
}

// Unread private messages and new replies in your forum threads, as alerts.
async function loadComms(supabase, uid, memory) {
  const alerts = [];
  const dismissed = new Set(memory.dismissed || []);

  // private messages
  try {
    const { data: unread } = await supabase
      .from("direct_messages")
      .select("id, sender_id, body, created_at")
      .eq("recipient_id", uid)
      .is("read_at", null)
      .order("created_at", { ascending: false })
      .limit(30);
    const fresh = (unread || []).filter((m) => !dismissed.has(m.id));
    if (fresh.length) {
      const senders = [...new Set(fresh.map((m) => m.sender_id))];
      const { data: people } = await supabase.from("profiles").select("id, username").in("id", senders);
      const name = Object.fromEntries((people || []).map((p) => [p.id, p.username]));
      const quote = (s) => `\u201c${s.length > 70 ? `${s.slice(0, 70).trim()}...` : s}\u201d`;
      if (senders.length === 1) {
        const who = name[senders[0]] || "A Kin";
        alerts.push({
          kind: "dm",
          ids: fresh.map((m) => m.id),
          text: fresh.length === 1 ? `${who} sent you a private message: ${quote(fresh[0].body)}` : `${who} sent you ${fresh.length} private messages. The latest: ${quote(fresh[0].body)}`,
          href: name[senders[0]] ? `/messages/${name[senders[0]]}` : "/messages",
          cta: "read it",
        });
      } else {
        alerts.push({
          kind: "dm",
          ids: fresh.map((m) => m.id),
          text: `You have ${fresh.length} unread private messages, from ${senders.map((s) => name[s] || "a Kin").slice(0, 3).join(", ")}${senders.length > 3 ? " and others" : ""}.`,
          href: "/messages",
          cta: "open messages",
        });
      }
    }
  } catch (e) {
    // messages not switched on yet
  }

  // replies in threads you started or joined
  try {
    if (memory.forumSeenAt) {
      const [{ data: mine }, { data: joined }] = await Promise.all([
        supabase.from("forum_threads").select("id").eq("author_id", uid).limit(100),
        supabase.from("forum_replies").select("thread_id").eq("author_id", uid).limit(200),
      ]);
      const threadIds = [...new Set([...(mine || []).map((x) => x.id), ...(joined || []).map((x) => x.thread_id)])].slice(0, 100);
      if (threadIds.length) {
        const { data: replies } = await supabase
          .from("forum_replies")
          .select("id, thread_id, created_at, profiles(username), forum_threads(title, forum_spaces(slug))")
          .in("thread_id", threadIds)
          .neq("author_id", uid)
          .gt("created_at", memory.forumSeenAt)
          .order("created_at", { ascending: false })
          .limit(20);
        const fresh = (replies || []).filter((x) => !dismissed.has(x.id));
        if (fresh.length) {
          const top = fresh[0];
          const href = `/forum/${top.forum_threads?.forum_spaces?.slug || "13i"}/${top.thread_id}`;
          const threads = new Set(fresh.map((x) => x.thread_id));
          alerts.push({
            kind: "forum",
            ids: fresh.map((x) => x.id),
            threadIds: [...threads],
            text: fresh.length === 1
              ? `${top.profiles?.username || "A Kin"} replied in \u201c${top.forum_threads?.title || "your thread"}\u201d.`
              : `${fresh.length} new forum replies in ${threads.size === 1 ? `\u201c${top.forum_threads?.title || "your thread"}\u201d` : `${threads.size} of your threads`}.`,
            href,
            cta: "read the reply",
          });
        }
      }
    }
  } catch (e) {
    // forum unavailable
  }
  return alerts;
}

function suggestionsFor(pathname, stage, alpha) {
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
  if (alpha) general.unshift("I have an idea for the site.");
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

// Phones (Update 5.50): there's no room for her panel to pop over the page,
// and no hover. So on a phone she never opens by herself - what she'd have
// said waits behind her dot, and she shows it with her body instead (a
// brightening, a burst for celebrations). Tap her to read.
const isPhone = () => {
  try { return window.matchMedia("(max-width: 640px), (hover: none) and (pointer: coarse)").matches; } catch (e) { return false; }
};

export default function LyraCompanion() {
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null); // { id, username, alpha, alphaNumber }
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
  const [alerts, setAlerts] = useState([]); // new messages / forum replies

  const memory = useRef(null);
  const session = useRef({ prevSeen: null, firstEver: false });
  const feed = useRef(null);
  const journey = useRef(null);
  const counts = useRef({ readNumbers: [] });
  const queue = useRef([]); // celebrations waiting for the next arrival
  const autoCloseTimer = useRef(null);
  const hoverCloseTimer = useRef(null);
  const openedBy = useRef(null); // "peek" | "hover" | "click"
  const celebrateTimer = useRef(null);
  const chatEnd = useRef(null);
  const loggedIn = !!user;
  const uid = user?.id || null;
  const userRef = useRef(null);
  userRef.current = user;

  const remember = useCallback((fn) => {
    if (!memory.current) return;
    fn(memory.current);
    saveMemory(uid, memory.current);
  }, [uid]);

  // Say something. auto: show it now, briefly (a peek), then go quiet -
  // hover or click brings it back. Otherwise just hold it, with the dot.
  // A panel you've clicked into or typed in is yours: she won't close it.
  const speak = useCallback((text, { auto = false, celebrate = false, id } = {}) => {
    if (!text) return;
    setLine(text);
    if (id) remember((m) => { m.recent.push(id); });
    clearTimeout(autoCloseTimer.current);
    if (celebrate) {
      setCelebrating(true);
      clearTimeout(celebrateTimer.current);
      celebrateTimer.current = setTimeout(() => setCelebrating(false), 2600);
    }
    if (auto && isPhone()) {
      // phone: no pop-up - a sign from her body, and the dot to tap
      if (!celebrate) lyraReact("notice");
      setHasMessage(true);
      return;
    }
    if (auto) {
      if (openedBy.current === "click" || openedBy.current === "alert") return; // don't take over a panel in use
      setOpen(true);
      openedBy.current = "peek";
      setHasMessage(false);
      autoCloseTimer.current = setTimeout(() => { if (openedBy.current === "peek") setOpen(false); }, celebrate ? CELEBRATE_MS : PEEK_MS);
    } else {
      setHasMessage(true);
    }
  }, [remember]);

  // ---- who's here ----
  useEffect(() => {
    const supabase = createClient();
    const applyUser = async (u) => {
      if (!u) { setUser(null); setAuthChecked(true); return; }
      let profile = null;
      try {
        ({ data: profile } = await supabase.from("profiles").select("*").eq("id", u.id).single());
      } catch (e) { /* no profile yet */ }
      const next = {
        id: u.id,
        username: profile?.username || null,
        alpha: isAlpha({ ...(profile || {}), created_at: profile?.created_at || u.created_at }),
        alphaNumber: alphaNumber(profile),
      };
      setUser((prev) => (prev && prev.id === next.id && prev.username === next.username && prev.alpha === next.alpha ? prev : next));
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
      const b = computeBond({ ...c, assignmentsDone: j.completedCount || 0, visitDays: memory.current?.visitDays.length || 0 });
      setBond(b);
      const m = memory.current;
      if (!m) return;
      // each finished assignment, celebrated once (the old six-step version
      // counted as the first two)
      if (m.celebrated.firstAssignment) remember((mm) => { mm.celebrated["assignment-contact"] = true; mm.celebrated["assignment-creation"] = true; delete mm.celebrated.firstAssignment; });
      ASSIGNMENTS.forEach((a, i) => {
        if (j.signedIn && j.finished?.[i] && !m.celebrated[`assignment-${a.id}`]) {
          remember((mm) => { mm.celebrated[`assignment-${a.id}`] = true; });
          queue.current.push({ text: a.done });
        }
      });
      const u = userRef.current;
      if (u?.alpha && !m.celebrated.alpha) {
        remember((mm) => { mm.celebrated.alpha = true; });
        queue.current.push({
          text: `You're an Alpha User${u.alphaNumber ? ` - ${u.alphaNumber}` : ""}. You found 13i before Beta, so you get to help shape it. Anything you'd change, tell the others in [the Alpha Users Private Forum](${ALPHA_FORUM}) - or just tell me.`,
          stay: true,
        });
      }
      if (m.stage === null) {
        remember((mm) => { mm.stage = b.stage; }); // first meeting: no fanfare for the starting stage
      } else if (b.stage > m.stage) {
        remember((mm) => { mm.stage = b.stage; });
        queue.current.push({ text: EVOLUTION[b.stage]});
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
    setChat([]);

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
    // a new page, a fresh start: the last conversation goes
    setChat([]);
    setChatError("");
    setQuery("");
    const prefix = pathname.split("/").slice(0, 3).join("/") || "/";
    const firstVisitHere = !m.visited.includes(prefix);
    remember((mm) => {
      mm.lastSeenAt = new Date().toISOString();
      if (firstVisitHere) mm.visited.push(prefix);
    });
    clearTimeout(autoCloseTimer.current);
    let cancelled = false;
    const talk = talkTurn(uid);
    // background: hold the line quietly (no dot); hover or click shows it
    const hold = (text) => { if (text) setLine(text); };

    // the Oracle's chamber: 13i speaks there, not her
    if (pathname.startsWith("/oracle")) {
      if (openedBy.current === "peek") setOpen(false);
      setLine(ORACLE_LINE);
      return;
    }

    // back after a week or more: a quiet welcome, once, wherever you land
    if (loggedIn && pathname !== "/launch") {
      const s0 = session.current;
      const away = s0.prevSeen ? Math.floor((Date.now() - new Date(s0.prevSeen)) / 86400000) : 0;
      let welcomed = true;
      try { welcomed = !!sessionStorage.getItem(`lyra_welcomed_${uid}`); } catch (e) { /* treat as welcomed */ }
      if (!welcomed && away >= LONG_ABSENCE_DAYS && !(queue.current.length)) {
        try { sessionStorage.setItem(`lyra_welcomed_${uid}`, "1"); } catch (e) { /* ignore */ }
        speak(welcomeBackLine({ days: away, stage: bond.stage, username: user?.username }).text, { auto: true });
        return () => { cancelled = true; };
      }
    }

    // anything worth celebrating comes first, one after another - unless
    // this is the very first hello, which goes before everything
    const playQueue = () => {
      const next = queue.current.shift();
      if (!next || cancelled) return;
      speak(next.text, { auto: true, celebrate: true });
      if (queue.current.length) setTimeout(playQueue, 9000);
    };
    const firstHello = pathname === "/launch" && loggedIn && session.current.firstEver && !m.celebrated.met;
    if (queue.current.length && !firstHello) {
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
        let plays = 0;
        try {
          const supabase = createClient();
          const { data: existing } = await supabase.from("game_plays").select("play_count").eq("user_id", uid).eq("game", g.game).maybeSingle();
          plays = existing?.play_count || 0;
        } catch (e) { /* treat as new */ }
        if (cancelled) return;
        // never played: the instructions, shown
        if (!plays || firstVisitHere) { speak(g.text, { auto: true }); return; }
        // a game you keep coming back to: she knows it
        let line = g.text;
        if (plays >= 5) {
          let best = null;
          try { best = await getPersonalBest(g.game); } catch (e) { /* no best yet */ }
          if (cancelled) return;
          const name = GAME_LABELS[g.game] || "This one";
          line = `${name} again - that's ${plays} runs.${best ? ` Your best is ${best.toLocaleString()}.` : ""} ${g.text}`;
        }
        if (talk) speak(line, { auto: true }); else hold(line);
      })();
      return () => { cancelled = true; };
    }

    // the Games hub: a fresh nudge each visit, held rather than pushed
    if (pathname === "/games" && loggedIn) {
      (async () => {
        try {
          const text = await gamesHubMessage(createClient(), { id: uid });
          if (cancelled) return;
          if (firstVisitHere || talk) speak(text, { auto: true }); else hold(text);
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
        speak(`Hello${username ? `, ${username}` : ""}. I'm Lyra. I'll learn this place alongside you. Ask me anything - about the site, the story, or whatever's on your mind.`, { auto: true});
        if (queue.current.length) setTimeout(playQueue, 9000);
        return () => { cancelled = true; };
      }
      const daysAway = s.prevSeen ? Math.floor((Date.now() - new Date(s.prevSeen)) / 86400000) : 0;
      const memoryForNews = { ...m, lastSeenAt: s.prevSeen };
      const news = newsLines({ feed: feed.current, memory: memoryForNews, userId: uid, readNumbers: counts.current.readNumbers || [] });
      const unread = counts.current.unread || 0;
      const messagesLine = unread ? { id: `dm-${unread}-${today()}`, priority: 10, text: `You have ${unread} unread private ${unread === 1 ? "message" : "messages"}. [Open messages](/messages).` } : null;
      const extras = [messagesLine, ...news, journeyLine(journey.current)].filter(Boolean).filter((l) => !m.recent.includes(l.id)).sort((a, b) => (b.priority || 0) - (a.priority || 0));

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
      // ...unless it was about unread mail that has since been read
      const staleMail = m.launchLine && String(m.launchLine.id || "").startsWith("dm-") && !unread;
      if (staleMail) remember((mm) => { mm.launchLine = null; });
      if (m.launchLine && !staleMail && Date.now() - m.launchLine.at < LAUNCH_LINE_MS) {
        if (talk) speak(m.launchLine.text, { auto: true }); else hold(m.launchLine.text);
        return;
      }
      const unvisited = AREAS.filter((a) => !m.visited.some((v) => v.startsWith(a.prefix))).map((a) => ({ id: `area-${a.prefix}`, priority: 3, text: a.text }));
      if (userRef.current?.alpha && !m.visited.includes(ALPHA_FORUM)) {
        unvisited.push({ id: "area-alpha", priority: 4, text: `As an Alpha User, your ideas change this place. Something bugging you, or something you wish existed? [The Alpha Users Private Forum](${ALPHA_FORUM}).` });
      }
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
      // something new (news, mail, your next step) is worth saying; the rest waits
      const isNew = extras.some((l) => l.id === choice.id);
      if (isNew || talk) speak(choice.text, { auto: true, id: choice.id });
      else hold(choice.text);
      return;
    }

    // anywhere else: a tip the first time (signed in: she shows it),
    // then a varied, personal line held for whenever you open her
    const lines = pageLines({ pathname, stage, bondCounts: counts.current, feed: feed.current, readNumbers: counts.current.readNumbers || [] });
    if (firstVisitHere) {
      const tip = lines[0]?.text || DEFAULT_TIP;
      if (loggedIn) speak(tip, { auto: true, id: lines[0]?.id });
      else setLine(tip);
      return;
    }
    // been here before: she stays in the background, unless it's her turn to talk
    const choice = pickFresh(lines, m.recent) || lines[0];
    if (loggedIn && talk) speak(choice ? choice.text : DEFAULT_TIP, { auto: true, id: choice?.id });
    else hold(choice ? choice.text : DEFAULT_TIP);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, pathname]);

  // ---- the Oracle: she only withdraws once you approach 13i ----
  const [approached, setApproached] = useState(false);
  useEffect(() => {
    const on = (e) => {
      const ph = e.detail && e.detail.phase;
      if (ph === "approach") { setApproached(true); lyraReact("flinch"); setOpen(false); openedBy.current = null; }
      if (ph === "leave") setApproached(false);
    };
    window.addEventListener("13i:oracle", on);
    return () => window.removeEventListener("13i:oracle", on);
  }, []);
  useEffect(() => { if (!pathname?.startsWith("/oracle")) setApproached(false); }, [pathname]);

  // ---- a quiet hint from a page (lib/lyraReact.js lyraHint) ----
  // held with her dot, never popped open; each hint once per visit
  useEffect(() => {
    const onHint = (e) => {
      const d = e.detail || {};
      if (!d.text || !loggedIn) return;
      const k = `lyra_hint_${d.key || d.text.slice(0, 30)}`;
      try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); } catch (e2) { /* ignore */ }
      if (open) return; // she's in use - don't change what she's saying
      speak(d.text, { auto: false });
    };
    window.addEventListener("13i:lyra-hint", onHint);
    return () => window.removeEventListener("13i:lyra-hint", onHint);
  }, [loggedIn, open, speak]);

  // ---- keeping you on top of communication ----
  const alertsRef = useRef([]);
  alertsRef.current = alerts;
  const dismissAlerts = useCallback((list = alertsRef.current) => {
    if (!list.length) return;
    remember((mm) => { mm.dismissed = [...(mm.dismissed || []), ...list.flatMap((a) => a.ids)]; });
    setAlerts((cur) => cur.filter((a) => !list.includes(a)));
  }, [remember]);

  const checkComms = useCallback(async () => {
    if (!uid || !memory.current) return;
    if (!memory.current.forumSeenAt) remember((mm) => { mm.forumSeenAt = new Date().toISOString(); }); // only new replies from now on
    const supabase = createClient();
    let found = await loadComms(supabase, uid, memory.current);
    // reading it counts: you're already looking at that conversation or thread
    const here = window.location.pathname;
    const reading = found.filter((a) => a.href === here || (a.kind === "forum" && a.threadIds.some((id) => here.endsWith(`/${id}`))));
    if (reading.length) {
      remember((mm) => { mm.dismissed = [...(mm.dismissed || []), ...reading.flatMap((a) => a.ids)]; });
      found = found.filter((a) => !reading.includes(a));
    }
    // keep her count of unread mail current, so she stops mentioning
    // messages once they've been read
    try {
      const { count } = await supabase.from("direct_messages").select("id", { count: "exact", head: true }).eq("recipient_id", uid).is("read_at", null);
      const unreadNow = count || 0;
      if (counts.current) counts.current.unread = unreadNow;
      if (!unreadNow) {
        const held = memory.current?.launchLine;
        if (held && String(held.id || "").startsWith("dm-")) {
          remember((mm) => { mm.launchLine = null; });
          setLine((cur) => (cur === held.text ? null : cur));
          setHasMessage(false);
        }
      }
    } catch (e) { /* messages not switched on yet */ }
    const key = (list) => list.map((a) => a.ids.join(",")).join("|");
    if (key(found) === key(alertsRef.current)) return;
    const isNew = found.some((a) => !alertsRef.current.some((b) => b.ids.join(",") === a.ids.join(",")));
    setAlerts(found);
    if (found.some((a) => a.kind === "dm")) window.dispatchEvent(new CustomEvent("13i:messages-new"));
    // a reply on your thread or a new message: she brightens either way
    if (found.length && isNew) lyraReact("wow");
    if (found.length && isNew && !window.location.pathname.startsWith("/oracle") && !isPhone()) {
      clearTimeout(autoCloseTimer.current);
      setOpen(true);
      openedBy.current = "alert";
      setHasMessage(false);
    }
  }, [uid, remember]);

  useEffect(() => {
    if (!ready || !uid) return;
    checkComms();
    const id = setInterval(checkComms, COMMS_POLL_MS);
    const onRead = () => checkComms();
    window.addEventListener("13i:messages-read", onRead);
    return () => { clearInterval(id); window.removeEventListener("13i:messages-read", onRead); };
  }, [ready, uid, checkComms]);

  useEffect(() => { if (ready && uid) checkComms(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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
        setTimeout(() => speak(next.text, { auto: true, celebrate: true }), milestone === "oracle" ? 400 : 5000);
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

  // ---- talking with her (just for the moment: cleared on close or a new page) ----
  const ask = async (text) => {
    const q = text.trim();
    if (!q || sending || !loggedIn) return;
    const next = [...chat, { role: "user", content: q }];
    setChat(next);
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
    } catch (e) {
      setChatError(e.message);
    }
    setSending(false);
  };
  const clearChat = () => { setChat([]); setChatError(""); };

  useEffect(() => { chatEnd.current?.scrollIntoView({ block: "end" }); }, [chat, sending]);

  const toggle = () => {
    clearTimeout(autoCloseTimer.current);
    clearTimeout(hoverCloseTimer.current);
    setHasMessage(false);
    // clicking a peek or hover panel keeps it open; clicking an open one closes it
    if (open && (openedBy.current === "click" || openedBy.current === "alert")) { dismissAlerts(); setOpen(false); openedBy.current = null; return; }
    setOpen(true);
    openedBy.current = "click";
  };
  const close = () => { dismissAlerts(); setOpen(false); setQuery(""); openedBy.current = null; };
  const claim = () => { // clicked or typed in: the panel stays until closed
    openedBy.current = "click";
    clearTimeout(autoCloseTimer.current);
    clearTimeout(hoverCloseTimer.current);
  };
  // however she closes (the ×, the orb, a link, her own timer), the chat goes
  useEffect(() => { if (!open) clearChat(); }, [open]);
  // hover brings her message back; moving away lets it go again
  const onEnter = () => {
    clearTimeout(hoverCloseTimer.current);
    if (open) { if (openedBy.current === "peek") { clearTimeout(autoCloseTimer.current); openedBy.current = "hover"; } return; }
    if (!line && !loggedIn) return;
    setOpen(true);
    setHasMessage(false);
    openedBy.current = "hover";
  };
  const onLeave = () => {
    if (openedBy.current !== "hover") return;
    hoverCloseTimer.current = setTimeout(() => { if (openedBy.current === "hover") { setOpen(false); openedBy.current = null; } }, HOVER_CLOSE_MS);
  };

  const results = query.trim() ? searchSite(query).slice(0, 4) : [];
  const inOracle = pathname?.startsWith("/oracle") && approached;
  const state = inOracle && !open ? "deferring" : !loggedIn ? "dormant" : sending ? "thinking" : celebrating ? "celebrating" : open ? "speaking" : "aware";
  const text = line || (loggedIn ? TIPS.find((t) => pathname?.startsWith(t.prefix))?.text || DEFAULT_TIP : "I'm Lyra. Sign in and I'll start remembering what you've found here.");

  return (
    <div style={styles.wrap} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {open && (
        <div className="lyra-panel" style={styles.panel} role="dialog" aria-label="Lyra" onMouseDown={claim}>
          <div style={styles.panelHeader}>
            <span className="mono" style={styles.panelLabel}>
              LYRA{loggedIn && <span style={{ color: "#565B8F" }}> &middot; {bond.name.toUpperCase()}</span>}
            </span>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {chat.length > 0 && <button onClick={clearChat} className="mono" style={styles.smallBtn} title="Clear the conversation">clear</button>}
              <button onClick={close} style={styles.closeBtn} aria-label="Close">&times;</button>
            </span>
          </div>

          <div style={styles.scroll}>
            {alerts.map((a) => (
              <div key={a.ids.join(",")} style={styles.alert}>
                <span className="mono" style={{ display: "block", fontSize: 9.5, letterSpacing: "1.5px", color: "#C9B98F", marginBottom: 4 }}>
                  {a.kind === "dm" ? "\u2709 PRIVATE MESSAGE" : "\u21A9 FORUM REPLY"}
                </span>
                <span style={{ display: "block", fontSize: 12.5, lineHeight: 1.5, color: "#F1E6CE" }}>{a.text}</span>
                <Link href={a.href} onClick={() => { dismissAlerts([a]); if (alerts.length <= 1) { setOpen(false); openedBy.current = null; } }} className="mono" style={{ display: "inline-block", marginTop: 6, fontSize: 11, color: "#E9D29A" }}>
                  {a.cta} &rarr;
                </Link>
              </div>
            ))}
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
              {suggestionsFor(pathname || "", bond.stage, user?.alpha).map((s) => (
                <button key={s} onClick={() => ask(s)} style={styles.chip}>{s}</button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); if (loggedIn) ask(query); else if (results[0]) window.location.href = results[0].href; }} style={{ display: "flex", gap: 6 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={claim}
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

      <button onClick={toggle} style={styles.orbBtn} aria-label={alerts.length ? "Lyra: you have new messages" : hasMessage ? "Lyra has something to tell you" : "Lyra"}>
        <LyraOrb stage={loggedIn ? bond.stage : 0} state={state} hasMessage={(hasMessage || alerts.length > 0) && !open} />
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
  alert: {
    border: "1px solid #6B5E3E",
    background: "rgba(201,185,143,0.07)",
    borderRadius: 6,
    padding: "9px 11px",
    marginBottom: 10,
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
