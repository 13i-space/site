"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabaseBrowser";
import { recordGamePlay } from "../lib/trackActivity";
import { isSentinelUser } from "../lib/sentinel";
import { SPACECORE_TIME_SCALE } from "../lib/spacecore";

// Hosts SpaceCore (public/games/spacecore/index.html) and is its link to
// Supabase. The game never touches the database itself: it posts messages
// here ({source: "spacecore", type: ...}) and gets answers back
// ({source: "13i-site", type: ...}).
//   ready      -> init (your saved crew, the colony, the shared world, crews, news, boosts)
//   save       -> upsert spacecore_players
//   tiles      -> spacecore_set_tiles (dug tunnels / built blocks)
//   sync       -> spacecore_sync (adds your mining to the Commons) -> world (colony, new tiles, crews, news, boosts)
//   contribute -> spacecore_contribute -> contributed
// Needs docs/v5.39-spacecore.sql.

const GAME = "spacecore";
const SCHEMA_VERSION = 542; // spacecore_version() in docs/v5.42-spacecore-saving.sql
const DAY = 86400000;
const BOOST_REFRESH = 5 * 60000;

// Things done elsewhere on 13i.space in the last day become boosts in the game.
async function siteBoosts(supabase, uid) {
  const now = Date.now();
  const since = new Date(now - DAY).toISOString();
  const safe = async (fn) => { try { return await fn(); } catch (e) { return null; } };
  const latest = (rows, key) => (rows && rows.length ? new Date(rows[0][key]).getTime() : null);
  const [quiz, read, alien, threads, replies, plays] = await Promise.all([
    safe(async () => (await supabase.from("quiz_results").select("score, total, taken_at").eq("user_id", uid).maybeSingle()).data),
    safe(async () => (await supabase.from("reading_progress").select("read_at").eq("user_id", uid).gte("read_at", since).order("read_at", { ascending: false }).limit(1)).data),
    safe(async () => (await supabase.from("alien_species").select("created_at").eq("user_id", uid).gte("created_at", since).order("created_at", { ascending: false }).limit(1)).data),
    safe(async () => (await supabase.from("forum_threads").select("created_at").eq("author_id", uid).gte("created_at", since).order("created_at", { ascending: false }).limit(1)).data),
    safe(async () => (await supabase.from("forum_replies").select("created_at").eq("author_id", uid).gte("created_at", since).order("created_at", { ascending: false }).limit(1)).data),
    safe(async () => (await supabase.from("game_plays").select("last_played_at").eq("user_id", uid).neq("game", GAME).gte("last_played_at", since).order("last_played_at", { ascending: false }).limit(1)).data),
  ]);
  const out = [];
  if (quiz && quiz.total && new Date(quiz.taken_at).getTime() > now - DAY) {
    out.push({ label: `Universe Quiz ${quiz.score}/${quiz.total}`, pct: Math.round((quiz.score / quiz.total) * 10) / 100, until: new Date(quiz.taken_at).getTime() + DAY, mode: "Play" });
  }
  const r = latest(read, "read_at");
  if (r) out.push({ label: "Read a story", pct: 0.08, until: r + DAY, mode: "Explore" });
  const a = latest(alien, "created_at");
  if (a) out.push({ label: "Created a species", pct: 0.1, until: a + DAY, mode: "Create" });
  const f = Math.max(latest(threads, "created_at") || 0, latest(replies, "created_at") || 0);
  if (f) out.push({ label: "Showed up in Kinship", pct: 0.05, until: f + DAY, mode: "Kinship" });
  const g = latest(plays, "last_played_at");
  if (g) out.push({ label: "Played another 13i game", pct: 0.05, until: g + DAY, mode: "Play" });
  return out.filter((b) => b.pct > 0);
}

async function loadAllTiles(supabase) {
  const rows = [];
  for (let from = 0; from < 100000; from += 1000) {
    const { data, error } = await supabase.from("spacecore_tiles").select("x, y, t, owner, updated_at").order("y").order("x").range(from, from + 999);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  return rows;
}

export default function SpaceCoreGame() {
  const [status, setStatus] = useState("loading"); // loading | signedout | nousername | nosetup | outdated | ready
  const [pseudo, setPseudo] = useState(false);
  const frameRef = useRef(null);
  const wrapRef = useRef(null);
  const ctx = useRef({});

  // who's playing, and is the database set up?
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (!cancelled) setStatus("signedout"); return; }
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
        if (!profile?.username) { if (!cancelled) setStatus("nousername"); return; }
        const { error } = await supabase.from("spacecore_colony").select("id").eq("id", 1).maybeSingle();
        if (error) { if (!cancelled) setStatus("nosetup"); return; }
        // the database has to be on the same version as the game, or what
        // players dig gets refused (that's how 5.40 progress was lost)
        const { data: dbVersion, error: vErr } = await supabase.rpc("spacecore_version");
        if (vErr || !(dbVersion >= SCHEMA_VERSION)) { if (!cancelled) setStatus("outdated"); return; }
        ctx.current = { supabase, user, username: profile.username, owners: new Map(), names: [], lastTileAt: null, boostsAt: 0, boosts: [] };
        if (!cancelled) setStatus("ready");
      } catch (e) {
        if (!cancelled) setStatus("nosetup");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const send = useCallback((msg) => {
    try { frameRef.current?.contentWindow?.postMessage({ source: "13i-site", ...msg }, window.location.origin); } catch (e) { /* ignore */ }
  }, []);

  // owner uuid -> small number for the game: 0 nobody, 1 you, 2+ another Kin
  const ownerIndex = useCallback((uuid) => {
    const c = ctx.current;
    if (!uuid) return 0;
    if (uuid === c.user.id) return 1;
    if (!c.owners.has(uuid)) { c.names.push(c.crewNames?.get(uuid) || "another Kin"); c.owners.set(uuid, c.names.length + 1); }
    return c.owners.get(uuid);
  }, []);

  const refreshCrewNames = useCallback((crews) => {
    const c = ctx.current;
    c.crewNames = new Map((crews || []).map((r) => [r.user_id, r.username]));
    c.owners.forEach((n, uuid) => { const nm = c.crewNames.get(uuid); if (nm) c.names[n - 2] = nm; });
  }, []);

  const loadBoosts = useCallback(async (force) => {
    const c = ctx.current;
    if (!force && Date.now() - c.boostsAt < BOOST_REFRESH) return null;
    c.boostsAt = Date.now();
    c.boosts = await siteBoosts(c.supabase, c.user.id);
    return c.boosts;
  }, []);

  const crewsAndLog = useCallback(async () => {
    const { supabase } = ctx.current;
    const [{ data: crews }, { data: log }] = await Promise.all([
      supabase.rpc("spacecore_crews"),
      supabase.from("spacecore_log").select("id, username, kind, text, created_at").order("id", { ascending: false }).limit(12),
    ]);
    return { crews: crews || [], log: log || [] };
  }, []);

  const onMessage = useCallback(async (e) => {
    if (e.origin !== window.location.origin) return;
    if (!frameRef.current || e.source !== frameRef.current.contentWindow) return;
    const msg = e.data || {};
    if (msg.source !== GAME) return;
    const c = ctx.current;
    if (!c.supabase) return;
    const { supabase, user } = c;
    try {
      if (msg.type === "ready") {
        const [{ data: player }, { data: colony }, tiles, cl, boosts] = await Promise.all([
          supabase.from("spacecore_players").select("state").eq("user_id", user.id).maybeSingle(),
          supabase.from("spacecore_colony").select("*").eq("id", 1).maybeSingle(),
          loadAllTiles(supabase),
          crewsAndLog(),
          loadBoosts(true),
        ]);
        refreshCrewNames(cl.crews);
        c.lastTileAt = tiles.reduce((m, t) => (t.updated_at > m ? t.updated_at : m), "1970-01-01T00:00:00Z");
        send({
          type: "init",
          user: { username: c.username, sentinel: isSentinelUser(c.username) },
          state: player?.state || null,
          colony,
          tiles: tiles.map((t) => [t.x, t.y, t.t, ownerIndex(t.owner)]),
          owners: c.names,
          crews: cl.crews,
          log: cl.log,
          boosts,
        });
      } else if (msg.type === "save") {
        const { error } = await supabase.from("spacecore_players").upsert({
          user_id: user.id,
          username: c.username,
          state: msg.state || {},
          summary: msg.summary || {},
          px: Number.isFinite(msg.px) ? msg.px : null,
          py: Number.isFinite(msg.py) ? msg.py : null,
          updated_at: new Date().toISOString(),
        });
        send({ type: "saved", ok: !error, error: error?.message || null });
      } else if (msg.type === "tiles") {
        if (Array.isArray(msg.changes) && msg.changes.length) {
          const changes = msg.changes.slice(0, 500);
          const { data, error } = await supabase.rpc("spacecore_set_tiles", { p_tiles: changes });
          send({ type: "tilesSaved", sent: changes.length, saved: error ? 0 : data || 0, error: error?.message || null, changes: error ? changes : undefined });
        }
      } else if (msg.type === "sync") {
        const mined = msg.mined && typeof msg.mined === "object" ? msg.mined : {};
        const [{ data: colony }, { data: fresh }, cl, boosts] = await Promise.all([
          supabase.rpc("spacecore_sync", { p_mined: mined }),
          supabase.from("spacecore_tiles").select("x, y, t, owner, updated_at").gt("updated_at", c.lastTileAt || "1970-01-01T00:00:00Z").order("updated_at").limit(1000),
          crewsAndLog(),
          loadBoosts(false),
        ]);
        refreshCrewNames(cl.crews);
        (fresh || []).forEach((t) => { if (t.updated_at > c.lastTileAt) c.lastTileAt = t.updated_at; });
        send({
          type: "world",
          colony,
          myMined: mined,
          tiles: (fresh || []).map((t) => [t.x, t.y, t.t, ownerIndex(t.owner)]),
          owners: c.names,
          crews: cl.crews,
          log: cl.log,
          ...(boosts ? { boosts } : {}),
        });
      } else if (msg.type === "contribute") {
        const { data, error } = await supabase.rpc("spacecore_contribute", { p_res: msg.res, p_amount: msg.amount });
        if (error) send({ type: "contributed", res: msg.res, accepted: 0, error: error.message });
        else send({ type: "contributed", res: msg.res, accepted: data?.accepted || 0, completed: !!data?.completed, colony: data?.colony });
      } else if (msg.type === "play") {
        recordGamePlay(GAME);
      } else if (msg.type === "pseudoFullscreen") {
        setPseudo((p) => !p);
      }
    } catch (err) {
      if (msg.type === "contribute") send({ type: "contributed", res: msg.res, accepted: 0, error: "the colony didn't answer" });
    }
  }, [send, ownerIndex, refreshCrewNames, loadBoosts, crewsAndLog]);

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onMessage]);

  // window-filling mode for browsers without real fullscreen (iPhone)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.classList.toggle("pseudo-fullscreen", pseudo);
    document.body.style.overflow = pseudo ? "hidden" : "";
    const onKey = (ev) => { if (ev.key === "Escape") setPseudo(false); };
    if (pseudo) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pseudo, status]);

  const fullscreen = async () => {
    const el = wrapRef.current;
    if (!el) return;
    if (pseudo) { setPseudo(false); return; }
    if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen)?.call(document); return; }
    const request = el.requestFullscreen || el.webkitRequestFullscreen;
    if (request && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) {
      try { await request.call(el); frameRef.current?.focus(); return; } catch (e) { /* fall through */ }
    }
    setPseudo(true);
  };

  const btn = { background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF", fontSize: 11, letterSpacing: "0.5px", padding: "5px 10px", cursor: "pointer" };

  if (status === "loading") {
    return <div className="panel mono" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center", fontSize: 12, color: "#6E76B8" }}>contacting the colony&hellip;</div>;
  }
  if (status !== "ready") {
    const copy = {
      signedout: { title: "Sign in to join the crew", body: "SpaceCore is one world that every Kin builds together, so your crew member is tied to your account.", href: "/login", cta: "Sign in or create an account" },
      nousername: { title: "Claim your username first", body: "Your crew member flies under your Kin username, so other crews know whose tunnels they're in.", href: "/account", cta: "Go to your Node" },
      outdated: { title: "The colony database needs an update", body: "This version of SpaceCore needs the latest database step, or what you dig won't be saved. Run docs/v5.42-spacecore-saving.sql in Supabase (and docs/v5.40-spacecore-v2.sql first, if that hasn't been run), then reload this page.", href: "/create", cta: "Back to Create" },
      nosetup: { title: "The colony isn't set up yet", body: "SpaceCore's database tables haven't been created. Run docs/v5.39-spacecore.sql in Supabase, then reload this page.", href: "/create", cta: "Back to Create" },
    }[status];
    return (
      <div className="panel" style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 24, color: "#E8CFC0", marginBottom: 8 }}>{copy.title}</div>
        <p style={{ fontSize: 14, color: "#B7BADF", lineHeight: 1.6, margin: "0 0 16px" }}>{copy.body}</p>
        <Link href={copy.href} className="mono" style={{ fontSize: 12, color: "#B9C0FF" }}>{copy.cta} &rarr;</Link>
      </div>
    );
  }

  return (
    <div>
      <div ref={wrapRef} className="panel game-frame" style={{ padding: 0, overflow: "hidden", background: "#06060f" }}>
        <iframe
          ref={frameRef}
          src="/games/spacecore/index.html"
          title="SpaceCore"
          allow="fullscreen"
          style={{ width: "100%", height: "82vh", minHeight: 540, border: "none", display: "block" }}
          onLoad={() => frameRef.current?.focus()}
        />
      </div>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 10, fontSize: 11, color: "#6E76B8", flexWrap: "wrap" }}>
        <span>click the game to give it the keyboard &middot; Mars time runs {SPACECORE_TIME_SCALE}&times; faster during Alpha &middot; your progress saves to your Node</span>
        <button type="button" onClick={fullscreen} className="mono" style={btn}>{pseudo ? "Exit fullscreen" : "Fullscreen"}</button>
      </div>
      {pseudo && (
        <button type="button" onClick={() => setPseudo(false)} className="mono" style={{ ...btn, position: "fixed", top: 10, right: 10, zIndex: 1001, background: "rgba(10,11,28,0.9)" }}>
          Exit fullscreen
        </button>
      )}
    </div>
  );
}
