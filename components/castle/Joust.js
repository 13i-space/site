"use client";
// The tiltyard: the joust after a vote, and the practice joust you can play
// from the lobby (the waiting-room game).
import { useEffect, useRef, useState } from "react";
import { drawJoustScene, IMPACT } from "./draw";
import { castleSound as snd } from "../../lib/castle/sound";
import { randomLook, TABARDS } from "../../lib/castle/looks";

function useCanvasLoop(ref, draw, deps) {
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const g = cv.getContext("2d");
    let raf;
    const t0 = performance.now();
    const size = () => { const dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; };
    size();
    window.addEventListener("resize", size);
    const loop = (now) => { draw(g, cv.width, cv.height, (now - t0) / 1000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", size); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const T = {
  title: { fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", color: "#f2e6c8", textShadow: "0 2px 12px rgba(0,0,0,0.7)" },
  sub: { color: "#e7dcc0", fontWeight: 600, textShadow: "0 2px 8px rgba(0,0,0,0.8)" },
  btn: { background: "linear-gradient(135deg, #f2dc9a, #c9a227)", color: "#1b1406", border: 0, borderRadius: 999, padding: "11px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer" },
  ghostBtn: { background: "rgba(14,12,28,0.8)", color: "#f2e6c8", border: "1px solid #5a5390", borderRadius: 999, padding: "9px 18px", fontSize: 14, cursor: "pointer" },
};

// ---------- the joust after a vote ----------
export function VoteJoust({ accused, crowd, onDone }) {
  const ref = useRef(null);
  const [t, setT] = useState(0);
  const fired = useRef({});
  const lastQ = useRef(-1);
  const guilty = accused.role === "blackknight";
  const jester = accused.role === "jester";
  const scene = { left: { look: accused.look }, right: { look: accused.look, black: true }, loser: guilty ? "left" : "right", unmask: guilty, crowd };
  useCanvasLoop(ref, (g, w, h, time) => {
    const f = fired.current;
    if (time > 1.0 && !f.gallop) { f.gallop = 1; snd.gallop(2.4); }
    if (time > IMPACT && !f.crash) { f.crash = 1; snd.crash(); }
    if (time > 4.6 && !f.end) { f.end = 1; if (guilty) { snd.cheer(); snd.fanfare(); } else if (jester) snd.honk(); else snd.groan(); }
    drawJoustScene(g, w, h, Math.min(time, 9), scene);
    const q = Math.floor(time * 4);
    if (q !== lastQ.current) { lastQ.current = q; setT(time); }
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", top: "5%", left: 0, right: 0, textAlign: "center", padding: "0 16px" }}>
        {t < IMPACT ? (
          <>
            <div style={{ ...T.title, fontSize: "clamp(28px, 5vw, 48px)" }}>The Joust</div>
            <div style={{ ...T.sub, fontSize: "clamp(15px, 2.2vw, 21px)", marginTop: 6 }}>{accused.name} rides against the Black Knight</div>
            <div style={{ color: "#b9b1d6", fontSize: 15, marginTop: 6, textShadow: "0 2px 8px #000" }}>If they are the Black Knight, they&rsquo;ll be knocked from the saddle...</div>
          </>
        ) : t > IMPACT + 1.3 ? (
          <>
            <div style={{ ...T.title, fontSize: "clamp(28px, 5vw, 50px)", color: guilty ? "#ff8a70" : jester ? "#d18cff" : "#f2e6c8" }}>
              {guilty ? `${accused.name} WAS the Black Knight!` : `${accused.name} was not the Black Knight.`}
            </div>
            <div style={{ ...T.sub, fontSize: "clamp(14px, 2vw, 19px)", marginTop: 8 }}>
              {guilty ? "The castle is saved! Raise the Donaghy Cup!" : jester ? `...but the cap and bells give them away: ${accused.name} was the Jester, in league with the Black Knight!` : `The shadow knight vanishes in smoke. ${accused.name} rides off into the night, out of the game.`}
            </div>
          </>
        ) : null}
      </div>
      {t > 7 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "5%", textAlign: "center" }}>
          <button style={T.btn} onClick={onDone}>{guilty ? "See who lifts the Cup" : "Back to the castle"}</button>
        </div>
      )}
    </div>
  );
}

// ---------- the practice joust (lobby game) ----------
export const CHALLENGERS = [
  ["Sir Hamish", 0.55], ["Lady Marjorie", 0.65], ["Wee Rab", 0.35], ["Old Agnes", 0.75], ["Fergus", 0.5], ["Dame Winifred", 0.85],
];
const DUEL_KEY = "donaghy-duels-v1";
function readDuels() { try { return JSON.parse(localStorage.getItem(DUEL_KEY) || '{"won":0,"lost":0}'); } catch { return { won: 0, lost: 0 }; } }
function saveDuels(d) { try { localStorage.setItem(DUEL_KEY, JSON.stringify(d)); } catch { /* private window */ } }

// how well a lance landed: 3 unhorsed, 2 shield struck (lance breaks), 1 glancing, 0 miss
function strike(offset, zone) {
  const a = Math.abs(offset);
  if (a < zone * 0.4) return 3;
  if (a < zone) return 2;
  if (a < 0.55) return 1;
  return 0;
}
const STRIKE_WORDS = ["missed", "a glancing blow", "a square hit on the shield", "UNHORSED them"];

export function PracticeJoust({ me, onExit }) {
  const [rival, setRival] = useState(null);
  const [record, setRecord] = useState({ won: 0, lost: 0 });
  useEffect(() => { setRecord(readDuels()); }, []);
  const looks = useRef(null);
  if (!looks.current) {
    const colors = TABARDS.filter((c) => c !== me.look.tabard);
    looks.current = CHALLENGERS.map(([name, skill], i) => ({ name, skill, look: randomLook(colors[i % colors.length]) }));
  }
  if (rival) return <Duel me={me} rival={rival} crowd={looks.current.filter((c) => c !== rival)} onExit={(won) => {
    if (won !== null) { const r = { ...record, [won ? "won" : "lost"]: record[won ? "won" : "lost"] + 1 }; saveDuels(r); setRecord(r); }
    setRival(null);
  }} />;
  return (
    <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 50% 0%, #1d1b3a 0%, #07070f 70%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ background: "rgba(14,12,28,0.94)", border: "1px solid #3a3560", borderRadius: 10, padding: 26, maxWidth: 640, width: "100%", color: "#e7e1ff" }}>
        <div className="mono" style={{ fontSize: 10.5, letterSpacing: "1.5px", color: "#a9a3c4" }}>THE TILTYARD · WHILE EVERYONE GATHERS</div>
        <div style={{ ...T.title, fontSize: 34, color: "#f2dc9a", margin: "6px 0 8px" }}>Practice joust</div>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#d7d1ef", margin: "0 0 14px" }}>
          Three passes. As you charge, a ring slides up and down your opponent&rsquo;s shield. Press <b>Space</b> (or click) when it&rsquo;s in the green.
          Dead centre unhorses them and wins outright; a hit on the shield breaks your lance for 2 points; a glancing blow is 1.
        </p>
        <div className="mono" style={{ fontSize: 10.5, letterSpacing: "1.5px", color: "#a9a3c4", marginBottom: 8 }}>CHALLENGE SOMEONE</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
          {looks.current.map((c) => (
            <button key={c.name} onClick={() => { snd.unlock(); setRival(c); }} style={{ ...T.ghostBtn, borderRadius: 8, textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, background: c.look.tabard, border: `2px solid ${c.look.trim}`, flexShrink: 0 }} />
              <span>{c.name}<span style={{ display: "block", fontSize: 11, color: "#8d87ad" }}>{c.skill > 0.7 ? "fearsome" : c.skill > 0.5 ? "steady" : "wobbly"}</span></span>
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#8d87ad", marginTop: 12 }}>
          Your tiltyard record: {record.won} won, {record.lost} lost. When the family version is live, you&rsquo;ll be able to challenge each other here while you wait for everyone to arrive.
        </p>
        <button style={{ ...T.ghostBtn, marginTop: 8 }} onClick={onExit}>Back to the castle gate</button>
      </div>
    </div>
  );
}

function Duel({ me, rival, crowd, onExit }) {
  const ref = useRef(null);
  const st = useRef({ pass: 1, start: performance.now(), lock: null, done: false, outcome: null, myPts: 0, theirPts: 0, over: false });
  const [view, setView] = useState({ pass: 1, msg: null, myPts: 0, theirPts: 0, over: null, locked: false });
  const scene = useRef(null);
  const newPass = () => {
    const s = st.current;
    s.start = performance.now(); s.lock = null; s.done = false; s.outcome = null; s.fired = {};
    scene.current = { left: { look: me.look }, right: { look: rival.look }, loser: null, broken: false, crowd, reticle: { y: 0, zone: 0.26 - s.pass * 0.03, locked: false } };
    setView((v) => ({ ...v, pass: s.pass, msg: null, locked: false }));
  };
  if (!scene.current) newPass();

  const lockAim = () => {
    const s = st.current;
    const t = (performance.now() - s.start) / 1000;
    if (s.lock !== null || t < 1.0 || t >= IMPACT) return;
    s.lock = scene.current.reticle.y;
    scene.current.reticle.locked = true;
    snd.click();
    setView((v) => ({ ...v, locked: true }));
  };
  useEffect(() => {
    const k = (e) => { if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); lockAim(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  useCanvasLoop(ref, (g, w, h) => {
    const s = st.current;
    const t = (performance.now() - s.start) / 1000;
    const sc = scene.current;
    if (!s.fired) s.fired = {};
    if (t > 1.0 && !s.fired.g) { s.fired.g = 1; snd.gallop(2.4); }
    if (s.lock === null) sc.reticle.y = Math.sin(t * (3.2 + s.pass * 1.1)) * 0.95;
    if (t >= IMPACT && !s.done) {
      s.done = true;
      const mine = strike(s.lock === null ? 1 : s.lock, sc.reticle.zone);
      const theirs = strike((Math.random() * 2 - 1) * (1.15 - rival.skill), 0.24);
      s.myPts += mine; s.theirPts += theirs;
      if (mine === 3 && theirs < 3) sc.loser = "right";
      else if (theirs === 3 && mine < 3) sc.loser = "left";
      else if (mine >= 2 || theirs >= 2) sc.broken = true;
      if (sc.loser || sc.broken) snd.crash(); else snd.click();
      const unhorsed = sc.loser !== null;
      const lastPass = s.pass >= 3;
      let over = null;
      if (unhorsed) over = sc.loser === "right" ? "won" : "lost";
      else if (lastPass) over = s.myPts > s.theirPts ? "won" : s.myPts < s.theirPts ? "lost" : "draw";
      s.over = over;
      const msg = `You: ${STRIKE_WORDS[mine]}. ${rival.name}: ${theirs === 3 ? "UNHORSED you" : STRIKE_WORDS[theirs]}.`;
      setTimeout(() => {
        if (over === "won") { snd.cheer(); snd.fanfare(); } else if (over === "lost") snd.groan();
        setView({ pass: s.pass, msg, myPts: s.myPts, theirPts: s.theirPts, over, locked: s.lock !== null });
      }, 1200);
    }
    drawJoustScene(g, w, h, Math.min(t, 8), sc);
  }, []);

  const next = () => { st.current.pass++; newPass(); };
  const again = () => { Object.assign(st.current, { pass: 1, myPts: 0, theirPts: 0, over: null }); setView({ pass: 1, msg: null, myPts: 0, theirPts: 0, over: null, locked: false }); newPass(); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", fontFamily: "Inter, system-ui, sans-serif" }} onMouseDown={lockAim}>
      <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", top: "4%", left: 0, right: 0, textAlign: "center", pointerEvents: "none", padding: "0 16px" }}>
        <div style={{ ...T.title, fontSize: "clamp(24px, 4vw, 40px)" }}>{me.name} vs {rival.name}</div>
        <div style={{ ...T.sub, fontSize: 16, marginTop: 4 }}>Pass {view.pass} of 3 · {view.myPts} – {view.theirPts}</div>
        {!view.msg && <div style={{ color: view.locked ? "#8ef0a8" : "#ffe08a", fontSize: 15, marginTop: 8, textShadow: "0 2px 8px #000" }}>{view.locked ? "Lance couched. Hold on!" : "Press Space (or click) when the ring is in the green"}</div>}
        {view.msg && <div style={{ ...T.sub, fontSize: 17, marginTop: 10 }}>{view.msg}</div>}
        {view.over && (
          <div style={{ ...T.title, fontSize: "clamp(26px, 4.5vw, 44px)", marginTop: 10, color: view.over === "won" ? "#f2dc9a" : view.over === "lost" ? "#ff9a85" : "#e7dcc0" }}>
            {view.over === "won" ? "Victory! The crowd roars." : view.over === "lost" ? `${rival.name} takes the day.` : "A draw. Honour is satisfied."}
          </div>
        )}
      </div>
      {view.msg && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "5%", display: "flex", gap: 10, justifyContent: "center" }} onMouseDown={(e) => e.stopPropagation()}>
          {!view.over && <button style={T.btn} onClick={next}>Next pass</button>}
          {view.over && <button style={T.btn} onClick={again}>Rematch</button>}
          <button style={T.ghostBtn} onClick={() => onExit(view.over === "won" ? true : view.over === "lost" ? false : null)}>Leave the tiltyard</button>
        </div>
      )}
    </div>
  );
}
