"use client";
// The meeting in the Great Hall, done as a moment: the bell tolls, the hall
// talks, everyone seals an accusation like the end of a game of Clue
// ("It was ___, with the ___, in the ___"), then the accusations are
// unsealed one by one and the case cards are turned over. The host's laptop
// keeps the clock; every laptop plays the same scene.
import { useEffect, useRef, useState } from "react";
import { WEAPONS, CRIME_PLACES, POWERUPS, weaponById } from "../../lib/castle/clues";
import { castleSound as snd } from "../../lib/castle/sound";
import { Notebook, WeaponIcon, placeName } from "./Notebook";

export function Shield({ color, small }) {
  const s = small ? 14 : 22;
  return (
    <svg width={s} height={s * 1.15} viewBox="0 0 20 23" style={{ flexShrink: 0, verticalAlign: "middle" }} aria-hidden="true">
      <path d="M1 1h18v9c0 6-5 10-9 12C6 20 1 16 1 10z" fill={color} stroke="#e8dcb8" strokeWidth="1.2" />
    </svg>
  );
}

const INTRO_MS = 3000;
const FLIP_START = 1300, FLIP_EACH = 420;

export function Meeting({ w, myId, m, myVote, castVote, say, marks, setMark, cards }) {
  const [draft, setDraft] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [pick, setPick] = useState({ who: "", weapon: "", place: "" });
  const [sealed, setSealed] = useState(false);
  const [now, setNow] = useState(performance.now());
  const openedAt = useRef(performance.now());
  const resolvedBase = useRef(null);
  const fired = useRef({});
  useEffect(() => { const id = setInterval(() => setNow(performance.now()), 100); return () => clearInterval(id); }, []);

  const me = w.entities[myId];
  const intro = now - openedAt.current < INTRO_MS && !m.resolved;
  const voted = m.voted || Object.keys(m.humanVotes || {}).map(Number);
  const shown = showAll ? m.lines.length : Math.min(m.lines.length, m.shown || 0);
  const lines = m.lines.slice(0, shown);
  const left = Math.ceil((m.leftMs ?? 0) / 1000);
  const alive = w.entities.filter((e) => e.alive);
  const name = (id) => (id === myId ? `${w.entities[id].name} (you)` : w.entities[id].name);
  const waitingOn = w.entities.filter((e) => e.human && e.alive && !voted.includes(e.id));
  const hasCrime = m.hasCrime ?? !!m.crime;
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [shown]);

  // the reveal runs on its own clock, from when the votes were counted
  if (m.resolved && resolvedBase.current === null) resolvedBase.current = performance.now() - (m.revealMs || 0);
  const rt = m.resolved ? now - resolvedBase.current : 0;
  const votes = m.votes || [];
  const flipped = m.resolved ? Math.max(0, Math.min(votes.length, Math.floor((rt - FLIP_START) / FLIP_EACH) + 1)) : 0;
  const caseAt = FLIP_START + votes.length * FLIP_EACH + 600;
  const showCase = m.resolved && hasCrime && rt > caseAt;
  const verdictAt = hasCrime ? caseAt + 3600 : caseAt;
  const showVerdict = m.resolved && rt > verdictAt;

  // sounds: the heartbeat in the last ten seconds, drums and card flips at the reveal
  useEffect(() => {
    const f = fired.current;
    if (intro && !f.bell) { f.bell = 1; }
    if (!m.resolved && !intro && left <= 10 && left > 0 && f.beat !== left) { f.beat = left; snd.heartbeat(); }
    if (m.resolved && !f.drum) { f.drum = 1; snd.drumroll(1.2); }
    if (m.resolved && flipped > (f.flips || 0)) { f.flips = flipped; snd.flip(); }
    if (showCase && !f.case) { f.case = 1; snd.flip(); setTimeout(() => snd.flip(), 900); const r = m.results?.[myId]; if (r && (r.wRight || r.rRight) && me.role !== "blackknight" && me.role !== "jester") setTimeout(() => snd.powerup(), 1600); }
    if (showVerdict && !f.verdict) { f.verdict = 1; if (m.accused !== null && m.accused !== undefined) snd.doom(); else snd.groan(); }
  });

  const seal = () => {
    const target = pick.who === "" || pick.who === "skip" ? null : +pick.who;
    castVote(target, pick.weapon || null, pick.place || null);
    setSealed(true);
    snd.seal();
  };
  const ready = pick.who !== "" && (!hasCrime || (pick.weapon && pick.place));

  if (intro) {
    const k = (now - openedAt.current) / INTRO_MS;
    return (
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, rgba(60,20,10,${0.9 - k * 0.3}) 0%, rgba(3,3,8,0.97) 70%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20, zIndex: 15 }}>
        <BellSwing t={now / 1000} />
        <div style={{ ...C.title, fontSize: "clamp(34px, 6vw, 64px)", opacity: Math.min(1, k * 3), letterSpacing: "1px" }}>The Great Bell tolls</div>
        <div style={{ color: "#ffd0c4", fontSize: "clamp(15px, 2vw, 20px)", marginTop: 10, opacity: Math.min(1, Math.max(0, k * 3 - 0.8)), maxWidth: 700 }}>{m.lines[0]?.text}</div>
        <div className="mono" style={{ color: "#c9a227", letterSpacing: "4px", fontSize: 12, marginTop: 18, opacity: Math.min(1, Math.max(0, k * 3 - 1.6)) }}>THE COURT OF DONAGHY CASTLE IS IN SESSION</div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(6,5,14,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 14, zIndex: 15 }}>
      <div style={{ ...C.card, maxWidth: 1180, width: "100%", maxHeight: "96vh", overflow: "auto", padding: 20, borderColor: m.resolved ? "#c9a227" : !m.resolved && left <= 10 ? "#8a1020" : "#3a3560", boxShadow: !m.resolved && left <= 10 ? `0 0 ${20 + (now % 1000) / 40}px rgba(160,20,30,0.5)` : C.card.boxShadow }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ ...C.title, fontSize: 30 }}>{m.resolved ? "The accusations are unsealed" : "The Court is in session"}</div>
          <div className="mono" style={C.kicker}>THE GREAT HALL · ROUND {w.round}</div>
          {!m.resolved && <Candle left={left} total={60} />}
        </div>

        {m.resolved ? (
          <Reveal {...{ w, m, myId, name, votes, flipped, showCase, showVerdict, hasCrime }} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)", gap: 16, marginTop: 12 }} className="castle-meet-grid">
            <div>
              <div style={{ maxHeight: "34vh", overflow: "auto", paddingRight: 4 }}>
                {lines.map((l, i) => {
                  const e = l.who === null ? null : w.entities[l.who];
                  return (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid #24203e", animation: "castleIn .35s ease" }}>
                      {e ? <Shield color={e.color} /> : <span style={{ width: 22, fontSize: 17, textAlign: "center" }}>{l.evidence ? "🔍" : "🔔"}</span>}
                      <div style={{ fontSize: 14, lineHeight: 1.5, color: l.who === null ? (l.evidence ? "#f2dc9a" : "#ffd0c4") : "#e7e1ff" }}>
                        {e && <b style={{ color: e.color === "#E8E4D8" ? "#fff" : e.color, marginRight: 6 }}>{name(e.id)}:</b>}
                        {l.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              {shown < m.lines.length && <button style={{ ...C.tiny, marginTop: 8 }} onClick={() => setShowAll(true)}>show everything</button>}
              {me.alive && (
                <form onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { say(draft); setDraft(""); setShowAll(true); } }} style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type to the hall (or just talk on the voice chat)" maxLength={240} aria-label="Say something to the hall"
                    style={{ flex: 1, minWidth: 0, background: "#14112a", color: "#f2e6c8", border: "1px solid #3a3560", borderRadius: 999, padding: "8px 14px", fontSize: 14 }} />
                  <button type="submit" style={{ ...C.voteBtn, background: "#2a2450" }}>Say it</button>
                </form>
              )}

              {/* the accusation */}
              {me.alive ? (
                <div style={C.parchment}>
                  <div className="mono" style={{ fontSize: 10.5, letterSpacing: "3px", color: "#6a4a1a" }}>MAKE YOUR ACCUSATION</div>
                  <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 21, color: "#2a1a08", lineHeight: 2.1, marginTop: 4 }}>
                    I accuse{" "}
                    <select aria-label="Who" value={pick.who} onChange={(e) => { setPick({ ...pick, who: e.target.value }); setSealed(false); }} style={C.select}>
                      <option value="">someone...</option>
                      {alive.filter((e) => e !== me).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                      <option value="skip">nobody (skip)</option>
                    </select>
                    {hasCrime && (
                      <>
                        {" "}with{" "}
                        <select aria-label="With what" value={pick.weapon} onChange={(e) => { setPick({ ...pick, weapon: e.target.value }); setSealed(false); }} style={C.select}>
                          <option value="">the weapon...</option>
                          {WEAPONS.map((x) => <option key={x.id} value={x.id}>{x.the}</option>)}
                        </select>
                        {" "}in{" "}
                        <select aria-label="Where" value={pick.place} onChange={(e) => { setPick({ ...pick, place: e.target.value }); setSealed(false); }} style={C.select}>
                          <option value="">the room...</option>
                          {CRIME_PLACES.map((p) => <option key={p} value={p}>{placeName(p).replace(/^The /, "the ")}</option>)}
                        </select>
                      </>
                    )}.
                  </div>
                  {!hasCrime && <div style={{ fontSize: 13, color: "#5a3a12" }}>No one has been taken this round, so there&rsquo;s no weapon or room to name: only who you suspect.</div>}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                    <button onClick={seal} disabled={!ready} style={{ ...C.sealBtn, opacity: ready ? 1 : 0.45 }}>
                      {sealed || (myVote !== undefined && voted.includes(myId)) ? "Seal it again" : "Seal my accusation"}
                    </button>
                    {(sealed || voted.includes(myId)) && <WaxSeal />}
                    <span style={{ fontSize: 12.5, color: "#5a3a12" }}>
                      {hasCrime ? "Name the weapon: Swift Boots. Name the room: Owl's Lantern. Both: the Raven brings a clue. All three right: the whole murder solved, for big dominoes." : "Who you name goes to the joust if enough agree."}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ ...C.parchment, opacity: 0.8 }}><div style={{ color: "#2a1a08", fontSize: 15 }}>You&rsquo;re a ghost: you can&rsquo;t accuse anyone, but you can watch (and your chores still count).</div></div>
              )}
              <div style={{ fontSize: 12, color: "#8d87ad", marginTop: 6 }}>
                {waitingOn.length ? `Still to seal: ${waitingOn.map((e) => (e.id === myId ? "you" : e.name)).join(", ")}. ` : "Everyone has sealed. "}
                The court closes when everyone has sealed, or the candle burns down. Anyone who hasn&rsquo;t sealed by then skips.
              </div>
            </div>
            <div>
              <Notebook world={w} myId={myId} cards={cards} marks={marks} setMark={setMark} compact />
              {w.caseNotes.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div className="mono" style={C.kicker}>CASE NOTES (ALL NIGHT)</div>
                  {w.caseNotes.map((c, i) => <div key={i} style={{ fontSize: 12, color: "#e3d7b4", marginTop: 4, lineHeight: 1.4 }}><b>Round {c.round}:</b> {c.victim} taken in the {c.room}. {c.text}</div>)}
                </div>
              )}
              <WhatYouSaw notebook={(m.notebooks && m.notebooks[myId]) || []} />
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes castleIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
      @keyframes cardFlip{from{transform:rotateY(90deg)}to{transform:rotateY(0)}}
      @keyframes stamp{0%{transform:scale(2.2) rotate(-20deg);opacity:0}70%{transform:scale(0.9) rotate(-8deg);opacity:1}100%{transform:scale(1) rotate(-8deg)}}
      @media (max-width: 760px){.castle-meet-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

function WhatYouSaw({ notebook }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div className="mono" style={C.kicker}>WHAT YOU SAW (LAST TWO MINUTES)</div>
      {notebook.length ? notebook.map((n, i) => (
        <div key={i} style={{ fontSize: 12, color: n.saw || n.growl ? "#ff9a85" : "#c9c3e6", marginTop: 4 }}>
          {n.saw ? `You saw ${n.name} capture someone in the ${n.room}!` : n.growl ? `Sheba growled at ${n.name} in the ${n.room} (${n.ago}s ago)` : `${n.name} · ${n.room} · ${n.ago}s ago`}
        </div>
      )) : <div style={{ fontSize: 12, color: "#8d87ad", marginTop: 4 }}>You didn&rsquo;t see anyone.</div>}
    </div>
  );
}

function Reveal({ w, m, myId, name, votes, flipped, showCase, showVerdict, hasCrime }) {
  const crime = m.crime;
  const weapon = crime ? weaponById(crime.weapon) : null;
  const results = m.results || {};
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {votes.slice(0, flipped).map((v, i) => (
          <div key={i} style={{ ...C.voteCard, animation: "cardFlip .35s ease" }}>
            <Shield color={w.entities[v.voter].color} small />
            <span style={{ color: "#c9c3e6" }}>{v.voter === myId ? "You" : w.entities[v.voter].name.split(" ").slice(-1)[0]}</span>
            <span style={{ color: "#8d87ad" }}>accuse{v.voter === myId ? "" : "s"}</span>
            <b style={{ color: v.target === null ? "#8d87ad" : "#f2dc9a" }}>{v.target === null ? "nobody" : name(v.target)}</b>
          </div>
        ))}
        {flipped < votes.length && <div style={{ ...C.voteCard, borderStyle: "dashed", color: "#8d87ad" }}>breaking the seals...</div>}
      </div>

      {hasCrime && showCase && (
        <div style={{ marginTop: 18 }}>
          <div className="mono" style={{ ...C.kicker, color: "#c9a227", letterSpacing: "3px" }}>THE CASE CARDS ARE TURNED OVER</div>
          <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap", alignItems: "stretch" }}>
            <div style={{ ...C.caseCard, animation: "cardFlip .5s ease" }}>
              <div className="mono" style={C.cardHead}>WITH</div>
              <WeaponIcon id={weapon.id} size={56} />
              <div style={C.cardName}>{weapon.name}</div>
            </div>
            <div style={{ ...C.caseCard, animation: "cardFlip .5s ease .9s both" }}>
              <div className="mono" style={C.cardHead}>IN</div>
              <div style={{ fontSize: 40, lineHeight: "56px" }}>🏰</div>
              <div style={C.cardName}>{crime.places.map((p) => placeName(p)).join(" & ")}</div>
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 14, color: "#efe6cc", marginBottom: 6 }}>The capture of {crime.victims.join(" and ")} was done with <b>{weapon.the}</b> in <b>{crime.places.map((p) => placeName(p).replace(/^The /, "the ")).join(" and ")}</b>. Who did it? That stays a mystery until the joust.</div>
              {Object.entries(results).map(([id, r]) => {
                const e = w.entities[id];
                const dark = e.role === "blackknight" || e.role === "jester";
                const mine = +id === myId;
                const ups = mine && !dark ? Object.keys(POWERUPS).filter((k) => (k === "boots" && r.wRight) || (k === "lantern" && r.rRight) || (k === "raven" && r.wRight && r.rRight)) : [];
                return (
                  <div key={id} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, padding: "3px 0", borderBottom: "1px solid #24203e", flexWrap: "wrap" }}>
                    <Shield color={e.color} small />
                    <span style={{ minWidth: 110, color: mine ? "#fff3c4" : "#e7e1ff" }}>{name(+id)}</span>
                    <span style={{ color: r.wRight ? "#8ef0a8" : "#8d87ad" }}>{r.wRight ? "✓" : "✗"} {r.weapon ? weaponById(r.weapon).name : "no weapon"}</span>
                    <span style={{ color: r.rRight ? "#8ef0a8" : "#8d87ad" }}>{r.rRight ? "✓" : "✗"} {r.place ? placeName(r.place) : "no room"}</span>
                    {ups.map((k) => <span key={k} style={C.power}>{POWERUPS[k].name}</span>)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showVerdict && (
        <div style={{ marginTop: 18, textAlign: "center", animation: "castleIn .6s ease" }}>
          <div style={{ ...C.title, fontSize: "clamp(24px, 3.6vw, 38px)", color: m.accused !== null && m.accused !== undefined ? "#ff9a85" : "#e7dcc0" }}>
            {m.accused !== null && m.accused !== undefined ? `${name(m.accused)} must ride against the Black Knight!` : "No one has enough votes. Nobody rides tonight."}
          </div>
          <div style={{ color: "#a9a3c4", marginTop: 6 }}>{m.accused !== null && m.accused !== undefined ? "To the tiltyard..." : "Back to the castle..."}</div>
        </div>
      )}
    </div>
  );
}

function BellSwing({ t }) {
  const a = Math.sin(t * 5) * 0.35;
  return (
    <svg width="120" height="130" viewBox="0 0 120 130" aria-hidden="true" style={{ marginBottom: 10, filter: "drop-shadow(0 0 18px rgba(233,198,74,0.45))" }}>
      <rect x="20" y="8" width="80" height="8" rx="3" fill="#5b3b20" />
      <g transform={`rotate(${a * 57} 60 16)`}>
        <path d="M60 18 C40 18 36 40 34 64 C32 86 24 92 18 98 L102 98 C96 92 88 86 86 64 C84 40 80 18 60 18 Z" fill="#c9a227" stroke="#7a5a1a" strokeWidth="2" />
        <rect x="16" y="96" width="88" height="8" rx="4" fill="#a8841a" />
        <circle cx={60 + Math.sin(t * 5 + 1) * 10} cy="112" r="8" fill="#7a5a1a" />
      </g>
    </svg>
  );
}

function Candle({ left, total }) {
  const k = Math.max(0, Math.min(1, left / total));
  const hot = left <= 10;
  return (
    <div style={{ marginLeft: "auto", display: "flex", alignItems: "flex-end", gap: 10 }}>
      <svg width="22" height="54" viewBox="0 0 22 54" aria-hidden="true">
        <ellipse cx="11" cy={50 - 40 * k - 6} rx={3.5} ry={6} fill={hot ? "#ff6a3a" : "#ffcf6a"} opacity="0.95" />
        <rect x="6" y={50 - 40 * k} width="10" height={40 * k + 2} rx="2" fill="#efe6cc" />
        <rect x="2" y="50" width="18" height="4" rx="2" fill="#7a5a32" />
      </svg>
      <div style={{ textAlign: "right" }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "2px", color: hot ? "#ff8a70" : "#a9a3c4" }}>THE COURT CLOSES IN</div>
        <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 30, color: hot ? "#ff8a70" : "#f2dc9a", lineHeight: 1 }}>{left}s</div>
      </div>
    </div>
  );
}

function WaxSeal() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-label="Sealed" style={{ animation: "stamp .45s ease both" }}>
      <path d="M22 2 L26 6 L32 4 L33 10 L39 12 L37 18 L42 22 L37 26 L39 32 L33 34 L32 40 L26 38 L22 42 L18 38 L12 40 L11 34 L5 32 L7 26 L2 22 L7 18 L5 12 L11 10 L12 4 L18 6 Z" fill="#9a1a24" />
      <circle cx="22" cy="22" r="11" fill="#b8242e" stroke="#7a1018" strokeWidth="1.5" />
      <text x="22" y="27" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="14" fontStyle="italic" fill="#f2c4a0">D</text>
    </svg>
  );
}

const C = {
  card: { background: "rgba(14,12,28,0.96)", border: "1px solid #3a3560", borderRadius: 10, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", color: "#e7e1ff", fontFamily: "Inter, system-ui, sans-serif" },
  title: { fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", color: "#f2dc9a", textShadow: "0 2px 12px rgba(0,0,0,0.6)" },
  kicker: { fontSize: 10.5, letterSpacing: "1.5px", color: "#a9a3c4" },
  tiny: { background: "transparent", border: "1px solid #3a3560", color: "#c9c3e6", borderRadius: 999, padding: "3px 10px", fontSize: 11, cursor: "pointer" },
  voteBtn: { display: "inline-flex", alignItems: "center", gap: 6, background: "#17142e", color: "#f2e6c8", border: "1px solid #3a3560", borderRadius: 999, padding: "7px 12px", fontSize: 13.5, cursor: "pointer" },
  parchment: { marginTop: 12, background: "linear-gradient(180deg, #efe2bf, #dcc796)", border: "2px solid #8a6a3a", borderRadius: 6, padding: "12px 16px", boxShadow: "inset 0 0 30px rgba(120,80,20,0.35), 0 6px 20px rgba(0,0,0,0.4)" },
  select: { fontFamily: "Fraunces, Georgia, serif", fontSize: 18, fontStyle: "italic", background: "rgba(255,250,235,0.7)", color: "#5a1a14", border: 0, borderBottom: "2px solid #8a6a3a", borderRadius: 4, padding: "2px 6px", cursor: "pointer", maxWidth: "100%" },
  sealBtn: { background: "linear-gradient(135deg, #b8242e, #7a1018)", color: "#ffe8d0", border: 0, borderRadius: 999, padding: "10px 20px", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 12px rgba(80,0,0,0.4)" },
  voteCard: { display: "inline-flex", alignItems: "center", gap: 6, background: "#1a1630", border: "1px solid #3a3560", borderRadius: 8, padding: "6px 10px", fontSize: 13 },
  caseCard: { width: 150, background: "linear-gradient(180deg, #efe2bf, #d8c08a)", border: "3px solid #8a6a3a", borderRadius: 10, padding: "10px 8px", textAlign: "center", color: "#2a1a08", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" },
  cardHead: { fontSize: 10.5, letterSpacing: "3px", color: "#6a4a1a" },
  cardName: { fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 18, lineHeight: 1.15 },
  power: { fontSize: 11, background: "#2e5a2e", color: "#d8ffd8", borderRadius: 999, padding: "2px 8px" },
};
