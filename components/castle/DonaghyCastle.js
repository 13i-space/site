"use client";
// Lights Out at Donaghy Castle - the family game (test build).
// Everyone else at the castle is a computer player for now; the rules live
// in lib/castle/engine.js and the drawing in components/castle/draw.js.
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createGame, stepGame, humanAction, hudInfo, resolveVotes, applyJoust, sayInMeeting, ROLES, GAME_SECONDS,
} from "../../lib/castle/engine";
import { castleSound as snd } from "../../lib/castle/sound";
import { castleMusic as music } from "../../lib/castle/music";
import { loadLook, DEFAULT_LOOK } from "../../lib/castle/looks";
import { paintCastle, drawFrame, drawMiniMap } from "./draw";
import { Lobby } from "./Lobby";
import { VoteJoust, PracticeJoust } from "./Joust";
import { HelpOwl } from "./HelpOwl";

const CUP_KEY = "donaghy-cup-v1";
const MINI_W = 248, MINI_H = 176;

function clockText(t) {
  const mins = 20 * 60 + (t / GAME_SECONDS) * 240;
  const h = Math.floor(mins / 60), m = Math.floor(mins % 60);
  const hh = h > 12 ? h - 12 : h;
  return `${h >= 24 ? 12 : hh}:${String(m).padStart(2, "0")} ${h >= 24 ? "AM" : "PM"}`;
}
function readCup() { try { return JSON.parse(localStorage.getItem(CUP_KEY) || "[]"); } catch { return []; } }
function saveCup(list) { try { localStorage.setItem(CUP_KEY, JSON.stringify(list.slice(-60))); } catch { /* private window */ } }

export default function DonaghyCastle({ playerName = "You", backHref = "/account" }) {
  const [phase, setPhase] = useState("lobby");
  const [total, setTotal] = useState(8);
  const [roleChoice, setRoleChoice] = useState("random");
  const [look, setLook] = useState(DEFAULT_LOOK);
  const [hud, setHud] = useState(null);
  const [muted, setMuted] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const [vote, setVote] = useState(undefined);
  const [tally, setTally] = useState(null);
  const [joust, setJoust] = useState(null);
  const [result, setResult] = useState(null);
  const [cup, setCup] = useState([]);
  const [showChores, setShowChores] = useState(true);
  const [, setTick] = useState(0);

  const worldRef = useRef(null);
  const canvasRef = useRef(null);
  const miniRef = useRef(null);
  const mapRef = useRef(null);
  const darkRef = useRef(null);
  const keys = useRef({});
  const finished = useRef(false);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => { setCup(readCup()); setLook(loadLook()); setMusicOn(music.isEnabled()); }, []);
  useEffect(() => () => music.stop(), []);

  const start = () => {
    snd.unlock();
    if (!mapRef.current) mapRef.current = paintCastle();
    worldRef.current = createGame({ playerName, total, humanRole: roleChoice, playerLook: look });
    finished.current = false;
    // handy for testing on a local dev server only; never in the live build
    if (process.env.NODE_ENV !== "production") window.__castle = worldRef.current;
    setResult(null); setTally(null); setVote(undefined); setJoust(null);
    setHud(hudInfo(worldRef.current));
    setPhase("reveal");
  };

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    const w = worldRef.current;
    const me = w.entities[0];
    const entry = { at: new Date().toISOString(), role: me.role, won: w.result.won, points: w.result.total, players: w.entities.length };
    const list = [...readCup(), entry];
    saveCup(list);
    setCup(list);
    setResult(w.result);
    music.setMode("hall");
    setPhase("over");
  }, []);

  // music follows the phase
  useEffect(() => {
    if (phase === "play") music.setMode("night");
    else if (phase === "meeting") music.setMode("hall");
    else if (phase === "joust") music.setMode("quiet");
    else if (phase === "lobby") music.stop();
  }, [phase]);

  const toggleMute = () => { const m = !muted; snd.setMuted(m); setMuted(m); };
  const toggleMusic = () => { const on = !music.isEnabled(); music.setEnabled(on); setMusicOn(on); };

  // ---- keys ----
  useEffect(() => {
    const map = { ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down", ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", KeyE: "use", Space: "use" };
    const one = { KeyR: "report", KeyB: "bell", KeyQ: "power", KeyF: "truth", Digit1: "sab1", Digit2: "sab2", Digit3: "disguise" };
    const down = (ev) => {
      if (phaseRef.current !== "play") return;
      if (ev.target && (ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA")) return;
      if (map[ev.code]) { keys.current[map[ev.code]] = true; ev.preventDefault(); }
      if (one[ev.code] && !ev.repeat) { humanAction(worldRef.current, one[ev.code]); ev.preventDefault(); }
      if (ev.code === "KeyM") { const m = !snd.isMuted(); snd.setMuted(m); setMuted(m); }
      if (ev.code === "KeyN") { const on = !music.isEnabled(); music.setEnabled(on); setMusicOn(on); }
      if (ev.code === "KeyH" && !ev.repeat) setHelpOpen((o) => !o);
    };
    const up = (ev) => { if (map[ev.code]) keys.current[map[ev.code]] = false; };
    const blur = () => { keys.current = {}; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur); };
  }, []);

  // ---- the night: frame loop ----
  useEffect(() => {
    if (phase !== "play" && phase !== "meeting") return;
    const cv = canvasRef.current;
    if (!cv) return;
    const g = cv.getContext("2d");
    if (!darkRef.current) darkRef.current = document.createElement("canvas").getContext("2d");
    let raf, last = performance.now(), hudAt = 0, stepAt = 0;
    const view = { w: 0, h: 0, dpr: 1 };
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      view.w = cv.clientWidth; view.h = cv.clientHeight; view.dpr = dpr;
      cv.width = Math.round(view.w * dpr); cv.height = Math.round(view.h * dpr);
      darkRef.current.canvas.width = cv.width; darkRef.current.canvas.height = cv.height;
    };
    resize();
    window.addEventListener("resize", resize);
    const loop = (now) => {
      const dt = (now - last) / 1000; last = now;
      const w = worldRef.current;
      if (phaseRef.current === "play") {
        stepGame(w, keys.current, dt);
        if ((keys.current.up || keys.current.down || keys.current.left || keys.current.right) && w.entities[0].alive && now - stepAt > 330) { stepAt = now; snd.step(); }
        if (w.phase === "meeting") { keys.current = {}; setShown(0); setVote(undefined); setTally(null); setPhase("meeting"); }
        else if (w.phase === "over") { finish(); }
        if (now - hudAt > 100) {
          hudAt = now;
          const h = hudInfo(w);
          setHud(h);
          music.setTension(h.tension);
          if (miniRef.current) drawMiniMap(miniRef.current.getContext("2d"), w, MINI_W);
        }
      }
      drawFrame(g, darkRef.current, mapRef.current, w, view, now / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [phase, finish]);

  // ---- meeting: lines appear one at a time ----
  const meeting = phase === "meeting" ? worldRef.current?.meeting : null;
  const lineCount = meeting ? meeting.lines.length : 0;
  useEffect(() => {
    if (!meeting) return;
    if (shown >= meeting.lines.length) return;
    const id = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 600 : 1500);
    return () => clearTimeout(id);
  }, [meeting, shown, lineCount]);

  const say = (text) => {
    const w = worldRef.current;
    const before = w.meeting.lines.length;
    sayInMeeting(w, text);
    // your own words show at once; the reply follows a moment later
    setShown((n) => Math.max(n, before + 1));
    setTick((x) => x + 1);
  };

  const castVote = (target) => {
    const w = worldRef.current;
    setShown(w.meeting.lines.length);
    setVote(target);
    snd.click();
    setTally(resolveVotes(w, target));
  };

  const afterVote = () => {
    const w = worldRef.current;
    const accused = w.meeting.accused;
    if (accused === null || accused === undefined) {
      applyJoust(w, null);
      if (w.phase === "over") return finish();
      setPhase("play");
      return;
    }
    const e = w.entities[accused];
    const crowd = w.entities.filter((x) => x !== e).map((x) => ({ look: x.look, name: x.human ? `${x.name} (you)` : x.name, ghost: !x.alive }));
    setJoust({ id: accused, accused: { name: e.name, role: e.role, look: e.look }, crowd });
    setPhase("joust");
  };

  const afterJoust = () => {
    const w = worldRef.current;
    applyJoust(w, joust.id);
    if (w.phase === "over") return finish();
    setPhase("play");
  };

  // ---------- screens ----------
  if (phase === "lobby") return <Lobby {...{ playerName, look, setLook, total, setTotal, roleChoice, setRoleChoice, start, cup, backHref }} openPractice={() => setPhase("practice")} />;
  if (phase === "practice") return <PracticeJoust me={{ name: playerName, look }} onExit={() => setPhase("lobby")} />;
  const w = worldRef.current;
  const me = w?.entities[0];

  if (phase === "reveal") {
    const r = ROLES[me.role];
    const allies = hud?.ally || [];
    return (
      <div style={S.screen}>
        <div style={{ ...S.card, borderColor: r.side === "dark" ? "#8a1020" : "#c9a227", textAlign: "center", maxWidth: 540 }}>
          <div className="mono" style={S.kicker}>{playerName.toUpperCase()}, TONIGHT YOU ARE</div>
          <div style={{ ...S.big, color: r.side === "dark" ? "#ff8a70" : "#f2dc9a" }}>the {r.name}</div>
          <p style={S.p}>{r.blurb}</p>
          {r.keys.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", margin: "14px 0" }}>
              {r.keys.map(([k, l]) => <span key={k + l} style={S.keycap}><b>{k}</b> {l}</span>)}
            </div>
          )}
          {me.role === "blackknight" && <p style={{ ...S.p, fontSize: 14 }}>To capture someone, walk right up to them (nearly touching) and press <b>Q</b>. Choose a moment when nobody else can see you.</p>}
          {allies.length > 0 && (
            <p style={{ ...S.p, color: "#ffb4a2" }}>
              Your secret partner: {allies.map((a) => `${a.name} (the ${a.role})`).join(", ")}.
            </p>
          )}
          <p style={{ ...S.p, fontSize: 13, color: "#a9a3c4" }}>
            {r.side === "dark" ? "The castle wins if they joust the Black Knight or finish every chore. You win if the castle runs out of honest folk, or the clock strikes midnight." : "Finish every chore, or find the Black Knight and send them to the joust, before midnight."}
          </p>
          <p style={{ ...S.p, fontSize: 13, color: "#a9a3c4" }}>Stuck at any point? Click the owl in the corner, or press H.</p>
          <button style={S.btn} onClick={() => { snd.unlock(); music.start(); setPhase("play"); }}>Light your torch</button>
        </div>
      </div>
    );
  }

  if (phase === "over" && result) {
    return <Over {...{ w, result, cup, again: () => setPhase("lobby"), backHref }} />;
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#05060d", overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: phase === "joust" ? "none" : "block" }} />
      {phase !== "joust" && hud && (
        <Hud hud={hud} miniRef={miniRef} muted={muted} toggleMute={toggleMute} musicOn={musicOn} toggleMusic={toggleMusic} showChores={showChores} setShowChores={setShowChores} backHref={backHref} />
      )}
      {phase === "play" && hud && <HelpOwl hud={hud} open={helpOpen} setOpen={setHelpOpen} />}
      {phase === "meeting" && meeting && (
        <Meeting w={w} m={meeting} shown={shown} setShown={setShown} vote={vote} castVote={castVote} tally={tally} afterVote={afterVote} say={say} />
      )}
      {phase === "joust" && joust && <VoteJoust accused={joust.accused} crowd={joust.crowd} onDone={afterJoust} />}
    </div>
  );
}

// ---------- HUD ----------
function Hud({ hud, miniRef, muted, toggleMute, musicOn, toggleMusic, showChores, setShowChores, backHref }) {
  const r = ROLES[hud.me.role];
  const cdRow = (label, key, extra) => {
    const v = hud.me.cd[key];
    return <div key={label} style={{ fontSize: 12, color: v > 0 ? "#8d87ad" : "#f2dc9a" }}>{label}: {extra ?? (v > 0 ? `${Math.ceil(v)}s` : "ready")}</div>;
  };
  const left = hud.me.chores.filter((c) => !c.done).length;
  return (
    <>
      {/* role */}
      <div style={{ ...S.hudBox, top: 12, left: 12, minWidth: 210 }}>
        <div className="mono" style={S.kicker}>{hud.me.name.toUpperCase()} · {hud.me.alive ? "ALIVE" : "GHOST"}</div>
        <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 22, color: r.side === "dark" ? "#ff9a85" : "#f2dc9a" }}>{r.name}</div>
        {hud.me.role === "knight" && cdRow("[F] Torch of Truth", "truth")}
        {hud.me.role === "blackknight" && (
          <>
            {cdRow("[Q] Capture", "capture")}
            {cdRow("[1] Lights Out · [2] Portcullis", "sabotage")}
            {cdRow("[3] Disguise", "disguise", hud.me.disguisedAs ? `as ${hud.me.disguisedAs}` : undefined)}
          </>
        )}
        {hud.me.role === "jester" && (
          <>
            <div style={{ fontSize: 12, color: hud.me.swapUsed ? "#8d87ad" : "#f2dc9a" }}>[Q] Swap places: {hud.me.swapUsed ? "used this round" : "ready"}</div>
            <div style={{ fontSize: 12, color: "#8d87ad" }}>Next hop in {Math.ceil(hud.me.cd.hop)}s</div>
          </>
        )}
        {hud.me.role === "locksmith" && <div style={{ fontSize: 12, color: hud.freeUsed ? "#8d87ad" : "#f2dc9a" }}>Free a prisoner: {hud.freeUsed ? "used" : hud.prisoners ? `${hud.prisoners} in the cell` : "nobody in the cell"}</div>}
        {hud.me.role === "blacksmith" && <div style={{ fontSize: 12, color: "#f2dc9a" }}>Your torch never goes out</div>}
        {hud.ally.length > 0 && <div style={{ fontSize: 12, color: "#ffb4a2", marginTop: 4 }}>Partner: {hud.ally.map((a) => a.name).join(", ")}</div>}
        <div style={{ fontSize: 12, color: hud.me.bellUsed ? "#8d87ad" : "#c9c3e6", marginTop: 4 }}>[B] Great Bell: {hud.me.bellUsed ? "rung" : "once tonight"}</div>
      </div>

      {/* clock and chores bar */}
      <div style={{ ...S.hudBox, top: 12, left: "50%", transform: "translateX(-50%)", textAlign: "center", minWidth: 260 }}>
        <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 22, color: hud.left < 60 ? "#ff8a70" : "#f2e6c8" }}>{clockText(hud.t)}</div>
        <div className="mono" style={{ ...S.kicker, marginBottom: 4 }}>MIDNIGHT IN {Math.floor(hud.left / 60)}:{String(Math.floor(hud.left % 60)).padStart(2, "0")} · {hud.alive} OF {hud.total} FREE</div>
        <div style={{ height: 8, background: "#1c1a30", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${hud.secured * 100}%`, background: "linear-gradient(90deg,#c9a227,#f2dc9a)" }} />
        </div>
        <div className="mono" style={{ fontSize: 10, color: "#a9a3c4", marginTop: 3 }}>CASTLE CHORES {Math.round(hud.secured * 100)}%</div>
        {hud.job && hud.me.alive && <div style={{ fontSize: 12, color: hud.job.urgent ? "#ff9a85" : "#f2dc9a", marginTop: 4 }}>Next: {hud.job.label} · {hud.job.room}</div>}
      </div>

      {/* minimap */}
      <div style={{ ...S.hudBox, top: 12, right: 12, padding: 8 }}>
        <canvas ref={miniRef} width={MINI_W * 2} height={MINI_H * 2} style={{ display: "block", width: MINI_W, height: MINI_H }} />
        <div className="mono" style={{ fontSize: 11, color: "#f2e6c8", marginTop: 6, textAlign: "center" }}>{hud.room.toUpperCase()}</div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginTop: 6 }}>
          <button onClick={toggleMusic} style={{ ...S.tiny, color: musicOn ? "#f2dc9a" : "#8d87ad" }} title="Music (N)">{musicOn ? "♪ music on" : "♪ music off"}</button>
          <button onClick={toggleMute} style={{ ...S.tiny, color: muted ? "#8d87ad" : "#f2dc9a" }} title="Sound effects (M)">{muted ? "effects off" : "effects on"}</button>
          <a href={backHref} style={{ ...S.tiny, textDecoration: "none" }}>leave</a>
        </div>
      </div>

      {/* chores list */}
      <div style={{ ...S.hudBox, bottom: 12, left: 12, maxWidth: 260 }}>
        <button onClick={() => setShowChores(!showChores)} className="mono" style={{ ...S.tiny, border: 0, padding: 0, color: "#c9a227" }}>
          {hud.me.role === "blackknight" || hud.me.role === "jester" ? "PRETEND CHORES (DON'T COUNT)" : "YOUR CHORES"} · {left} LEFT {showChores ? "▾" : "▸"}
        </button>
        {showChores && <div style={{ fontSize: 11, color: "#8d87ad", margin: "3px 0 2px" }}>Gold dots on the map; walk there and hold E</div>}
        {showChores && hud.me.chores.map((c) => (
          <div key={c.id} style={{ fontSize: 12, color: c.done ? "#6d6890" : "#e7e1ff", textDecoration: c.done ? "line-through" : "none", marginTop: 3 }}>
            {c.label} <span style={{ color: "#8d87ad" }}>· {c.room}</span>
          </div>
        ))}
      </div>

      {/* what you can do right here */}
      {(hud.ctx.station || hud.ctx.marker || hud.ctx.bell || hud.ctx.power) && (
        <div style={{ ...S.hudBox, bottom: 24, left: "50%", transform: "translateX(-50%)", textAlign: "center", minWidth: 280 }}>
          {hud.ctx.power && <div style={{ color: hud.ctx.power.hot ? "#ff9a85" : "#a9a3c4", fontWeight: 600, marginBottom: 4 }}>Press <b style={S.k}>{hud.ctx.power.key}</b>: {hud.ctx.power.label}</div>}
          {hud.ctx.marker && <div style={{ color: "#ff9a85", fontWeight: 600 }}>A dropped helmet! Press <b style={S.k}>R</b> to report it</div>}
          {hud.ctx.bell && !hud.ctx.marker && <div style={{ color: "#f2dc9a" }}>Press <b style={S.k}>B</b> to ring the Great Bell</div>}
          {hud.ctx.station && (
            <>
              <div style={{ color: "#f2e6c8" }}>Hold <b style={S.k}>E</b>: {hud.ctx.label}{hud.ctx.fake ? " (pretend)" : ""}</div>
              <div style={{ height: 6, background: "#1c1a30", borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${hud.work ? Math.min(100, (hud.work.p / hud.work.need) * 100) : 0}%`, background: "#f2dc9a" }} />
              </div>
            </>
          )}
        </div>
      )}

      {/* news */}
      <div style={{ position: "absolute", top: 108, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", gap: 6, alignItems: "center", pointerEvents: "none", width: "min(560px, 90vw)" }}>
        {hud.lightsOut && <div style={{ ...S.toast, background: "rgba(80,10,10,0.85)", color: "#ffd0c4" }}>LIGHTS OUT · relight the torches at the Forge</div>}
        {hud.gate && <div style={{ ...S.toast, background: "rgba(60,40,10,0.85)", color: "#ffe2a8" }}>The portcullis is jammed · free it in the Gatehouse</div>}
        {!hud.me.alive && <div style={{ ...S.toast, background: "rgba(40,40,70,0.8)" }}>You&rsquo;re a ghost: you can&rsquo;t vote, but your chores still count</div>}
        {hud.toasts.map((t, i) => (
          <div key={i + t.text} style={{ ...S.toast, color: t.tone === "bad" ? "#ffb4a2" : t.tone === "good" ? "#bff5c9" : "#efe9ff" }}>{t.text}</div>
        ))}
      </div>
    </>
  );
}

// ---------- the meeting in the Great Hall ----------
function Meeting({ w, m, shown, setShown, vote, castVote, tally, afterVote, say }) {
  const [draft, setDraft] = useState("");
  const me = w.entities[0];
  const lines = m.lines.slice(0, shown);
  const done = shown >= m.lines.length;
  const alive = w.entities.filter((e) => e.alive);
  const name = (id) => (id === 0 ? `${w.entities[0].name} (you)` : w.entities[id].name);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" }); }, [shown]);

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(6,5,14,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ ...S.card, maxWidth: 1040, width: "100%", maxHeight: "94vh", overflow: "auto", padding: 22 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <div style={{ ...S.big, fontSize: 30 }}>The Great Bell tolls</div>
          <div className="mono" style={S.kicker}>MEETING IN THE GREAT HALL · ROUND {w.round}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 18, marginTop: 14 }} className="castle-meet-grid">
          <div style={{ minHeight: 220 }}>
            {lines.map((l, i) => {
              const e = l.who === null ? null : w.entities[l.who];
              return (
                <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #24203e", animation: "castleIn .35s ease" }}>
                  {e ? <Shield color={e.color} /> : <span style={{ width: 22, fontSize: 18, textAlign: "center" }}>{l.evidence ? "🔍" : "🔔"}</span>}
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: l.who === null ? (l.evidence ? "#f2dc9a" : "#ffd0c4") : "#e7e1ff" }}>
                    {e && <b style={{ color: e.color === "#E8E4D8" ? "#fff" : e.color, marginRight: 6 }}>{e.human ? `${e.name} (you)` : e.name}:</b>}
                    {l.text}
                  </div>
                </div>
              );
            })}
            {!done && <button style={{ ...S.tiny, marginTop: 10 }} onClick={() => setShown(m.lines.length)}>show everything</button>}
            {me.alive && !tally && (
              <form onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { say(draft); setDraft(""); } }} style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Speak up: “I saw Hamish in the Forge!” or “Agnes is innocent”"
                  maxLength={240}
                  aria-label="Say something to the hall"
                  style={{ flex: 1, minWidth: 0, background: "#14112a", color: "#f2e6c8", border: "1px solid #3a3560", borderRadius: 999, padding: "9px 14px", fontSize: 14 }}
                />
                <button type="submit" style={{ ...S.voteBtn, background: "#2a2450" }}>Say it</button>
              </form>
            )}
            <div ref={bottomRef} />
          </div>
          <div>
            <div className="mono" style={S.kicker}>CASE NOTES (ALL NIGHT)</div>
            {w.caseNotes.length ? w.caseNotes.map((c, i) => (
              <div key={i} style={{ fontSize: 12.5, color: "#e3d7b4", marginTop: 6, lineHeight: 1.45 }}>
                <b>Round {c.round}:</b> {c.victim} taken in the {c.room}. {c.text}
              </div>
            )) : <div style={{ fontSize: 12.5, color: "#8d87ad", marginTop: 6 }}>No captures yet.</div>}
            <div className="mono" style={{ ...S.kicker, marginTop: 16 }}>WHAT YOU SAW (LAST TWO MINUTES)</div>
            {m.notebook.length ? m.notebook.map((n, i) => (
              <div key={i} style={{ fontSize: 12.5, color: n.saw ? "#ff9a85" : "#c9c3e6", marginTop: 5 }}>
                {n.saw ? `You saw ${n.name} capture someone in the ${n.room}!` : `${n.name} · ${n.room} · ${n.ago}s ago`}
              </div>
            )) : <div style={{ fontSize: 12.5, color: "#8d87ad", marginTop: 6 }}>You didn&rsquo;t see anyone.</div>}
          </div>
        </div>

        <div style={{ marginTop: 18, borderTop: "1px solid #2e2850", paddingTop: 14 }}>
          {!tally ? (
            me.alive ? (
              <>
                <div className="mono" style={S.kicker}>WHO RIDES IN THE JOUST? CAST YOUR VOTE</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {alive.filter((e) => e !== me).map((e) => (
                    <button key={e.id} onClick={() => castVote(e.id)} style={S.voteBtn}><Shield color={e.color} small /> {e.name}</button>
                  ))}
                  <button onClick={() => castVote(null)} style={{ ...S.voteBtn, borderStyle: "dashed" }}>Skip the vote</button>
                </div>
              </>
            ) : (
              <button style={S.btn} onClick={() => castVote(null)}>You&rsquo;re a ghost: watch the vote</button>
            )
          ) : (
            <>
              <div className="mono" style={S.kicker}>THE VOTE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {[...Object.entries(tally.counts).sort((a, b) => b[1] - a[1]), ...(tally.skip ? [["skip", tally.skip]] : [])].map(([id, n]) => (
                  <div key={id} style={{ ...S.voteBtn, cursor: "default", borderColor: +id === tally.accused ? "#c9a227" : "#3a3560" }}>
                    {id === "skip" ? "Skipped" : name(+id)}: <b style={{ marginLeft: 4 }}>{n}</b>
                    <span style={{ fontSize: 11, color: "#8d87ad", marginLeft: 6 }}>
                      ({m.votes.filter((v) => String(v.target === null ? "skip" : v.target) === id).map((v) => (v.voter === 0 ? "you" : w.entities[v.voter].name.split(" ").slice(-1)[0])).join(", ")})
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <span style={{ color: "#f2e6c8" }}>
                  {tally.accused !== null ? `${name(tally.accused)} must ride against the Black Knight.` : "No one has enough votes. Nobody rides tonight."}
                </span>
                <button style={S.btn} onClick={afterVote}>{tally.accused !== null ? "To the tiltyard!" : "Back to the castle"}</button>
              </div>
            </>
          )}
          {vote === undefined && !tally && <div style={{ fontSize: 12, color: "#8d87ad", marginTop: 8 }}>The castle folk will vote once you have.</div>}
        </div>
      </div>
      <style>{`@keyframes castleIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
      @media (max-width: 760px){.castle-meet-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

function Shield({ color, small }) {
  const s = small ? 14 : 22;
  return (
    <svg width={s} height={s * 1.15} viewBox="0 0 20 23" style={{ flexShrink: 0, verticalAlign: "middle" }} aria-hidden="true">
      <path d="M1 1h18v9c0 6-5 10-9 12C6 20 1 16 1 10z" fill={color} stroke="#e8dcb8" strokeWidth="1.2" />
    </svg>
  );
}

// ---------- end of the night ----------
function Over({ w, result, cup, again, backHref }) {
  const why = {
    joust: "The Black Knight was knocked from the saddle in the joust!",
    chores: "Every chore is done and the castle is secure. The Black Knight slinks away.",
    overrun: "Too few honest folk are left free. The Black Knight rules the night.",
    midnight: "The clock struck midnight and the Black Knight escaped into the dark.",
  }[result.reason];
  const castleWon = result.winner === "castle";
  const pts = cup.reduce((s, x) => s + x.points, 0);
  const wins = cup.filter((x) => x.won).length;
  const best = Math.max(0, ...cup.map((x) => x.points));
  return (
    <div style={S.screen}>
      <div style={{ ...S.card, maxWidth: 760, borderColor: castleWon ? "#c9a227" : "#8a1020" }}>
        <div className="mono" style={S.kicker}>{result.won ? "YOU WIN" : "YOU LOSE"} · THE NIGHT IS OVER</div>
        <div style={{ ...S.big, color: castleWon ? "#f2dc9a" : "#ff8a70" }}>{castleWon ? "The castle is saved" : "The Black Knight triumphs"}</div>
        <p style={S.p}>{why}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 8, margin: "16px 0" }}>
          {w.entities.map((e) => (
            <div key={e.id} style={{ ...S.mini, display: "flex", gap: 8, alignItems: "center", borderColor: ROLES[e.role].side === "dark" ? "#5a1520" : "#3a3560" }}>
              <Shield color={e.color} small />
              <div>
                <div style={{ fontSize: 13, color: "#f2e6c8" }}>{e.id === 0 ? `${e.name} (you)` : e.name}</div>
                <div style={{ fontSize: 11.5, color: ROLES[e.role].side === "dark" ? "#ff9a85" : "#b9b3d6" }}>
                  {ROLES[e.role].name} · {e.alive ? "free" : e.out ? "jousted" : "captured"}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16 }} className="castle-meet-grid">
          <div>
            <div className="mono" style={S.kicker}>YOUR POINTS TONIGHT</div>
            {result.points.length ? result.points.map(([l, p]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "#e7e1ff", padding: "4px 0", borderBottom: "1px solid #24203e" }}><span>{l}</span><b>+{p}</b></div>
            )) : <div style={{ fontSize: 13, color: "#8d87ad" }}>No points this time.</div>}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: "#f2dc9a", padding: "8px 0" }}><span>Total</span><b>{result.total}</b></div>
          </div>
          <div style={{ ...S.mini, borderColor: "#c9a227", textAlign: "center" }}>
            <div style={{ fontSize: 30 }}>🏆</div>
            <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#f2dc9a" }}>The Donaghy Cup</div>
            <div style={{ fontSize: 13, color: "#c9c3e6", marginTop: 6, lineHeight: 1.6 }}>
              {pts} points from {cup.length} night{cup.length === 1 ? "" : "s"}<br />
              {wins} won · best night {best}
            </div>
            <div style={{ fontSize: 11, color: "#8d87ad", marginTop: 6 }}>Kept on this computer for now. Family standings arrive with the real multiplayer build.</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16 }}>
          <button style={S.btn} onClick={again}>Another night</button>
          <a href={backHref} style={{ color: "#8b95f6", fontSize: 13 }}>back to 13i.space</a>
        </div>
      </div>
    </div>
  );
}

const S = {
  screen: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "radial-gradient(ellipse at 50% 0%, #1d1b3a 0%, #07070f 70%)", fontFamily: "Inter, system-ui, sans-serif" },
  card: { background: "rgba(14,12,28,0.94)", border: "1px solid #3a3560", borderRadius: 10, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", color: "#e7e1ff" },
  kicker: { fontSize: 10.5, letterSpacing: "1.5px", color: "#a9a3c4" },
  big: { fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 38, color: "#f2dc9a", lineHeight: 1.15, margin: "6px 0 10px" },
  p: { fontSize: 15, lineHeight: 1.6, color: "#d7d1ef", margin: "8px 0" },
  btn: { background: "linear-gradient(135deg, #f2dc9a, #c9a227)", color: "#1b1406", border: 0, borderRadius: 999, padding: "11px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer" },
  tiny: { background: "transparent", border: "1px solid #3a3560", color: "#c9c3e6", borderRadius: 999, padding: "3px 10px", fontSize: 11, cursor: "pointer" },
  select: { width: "100%", marginTop: 6, background: "#14112a", color: "#f2e6c8", border: "1px solid #3a3560", borderRadius: 6, padding: "9px 10px", fontSize: 14 },
  label: { display: "block" },
  mini: { border: "1px solid #3a3560", borderRadius: 8, padding: "10px 12px", background: "rgba(25,22,48,0.6)" },
  keycap: { border: "1px solid #5a5390", borderRadius: 6, padding: "4px 10px", fontSize: 13, color: "#e7e1ff", background: "#1a1735" },
  hudBox: { position: "absolute", background: "rgba(10,9,22,0.78)", border: "1px solid #2e2850", borderRadius: 8, padding: "10px 12px", color: "#e7e1ff", backdropFilter: "blur(4px)" },
  toast: { background: "rgba(14,12,28,0.88)", border: "1px solid #3a3560", borderRadius: 999, padding: "6px 14px", fontSize: 13, color: "#efe9ff", textAlign: "center" },
  k: { border: "1px solid #8a83c0", borderRadius: 4, padding: "0 5px" },
  voteBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "#17142e", color: "#f2e6c8", border: "1px solid #3a3560", borderRadius: 999, padding: "7px 12px", fontSize: 13.5, cursor: "pointer" },
};
