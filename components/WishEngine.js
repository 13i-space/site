"use client";

import { useEffect, useRef, useState } from "react";
import { answerFor, inVarrow } from "../lib/wishEngine";
import { alienClick, alienSpeak, alienLock, isMuted, setMuted } from "../lib/alienSound";
import { startAmbience, stopAmbience, ambienceMood } from "../lib/wishAmbience";
import WishCabinet from "./WishCabinet";

// The Wish Engine (Update 5.58, replacing the Ninefold): a fortune cabinet
// recovered from somewhere far off, with Varrow inside it. Ask a question,
// drop a gravity token; Varrow wakes, circles its orb, speaks (an alien
// voice, made live by lib/alienSound.js, with its words as glyphs), and a
// card slides out of the slot with the answer and 13i's translation.
// Answers: lib/wishEngine.js. A homage to the Zoltar machine in Big.
// Update 6.19: the cabinet is drawn live (components/WishCabinet.js) with the
// painted Varrow inside, you see the token go into the slot and the card
// come out, and a little music plays inside it (lib/wishAmbience.js).

const PHASES = { idle: "asleep", coin: "token received", waking: "waking", speaking: "speaking", printing: "printing", done: "answered" };

export default function WishEngine() {
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState("idle");
  const [answer, setAnswer] = useState(null);
  const [subs, setSubs] = useState("");
  const [mute, setMute] = useState(false);
  const [phaseAt, setPhaseAt] = useState(0);
  const timers = useRef([]);
  useEffect(() => { setMute(isMuted()); return () => { timers.current.forEach(clearTimeout); stopAmbience(); }; }, []);
  useEffect(() => { setPhaseAt(performance.now()); ambienceMood(phase === "waking" || phase === "speaking" || phase === "printing"); }, [phase]);
  // the music starts with the first touch (browsers wait for one)
  const wake = () => { if (!isMuted()) startAmbience(); };
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };

  const ask = (e) => {
    e.preventDefault();
    if (!q.trim() || (phase !== "idle" && phase !== "done")) return;
    const a = answerFor(q);
    const marks = inVarrow(a.text);
    setAnswer({ ...a, q: q.trim(), marks });
    setSubs("");
    setPhase("coin");
    alienClick(8, 2);
    later(() => alienClick(6, 1), 260);
    later(() => { setPhase("waking"); alienLock(1); }, 800);
    later(() => {
      setPhase("speaking");
      const secs = alienSpeak(Math.min(16, 6 + Math.round(a.text.length / 12)), 120);
      const total = Math.max(1.6, secs) * 1000;
      const words = marks.split(" ");
      words.forEach((_, i) => later(() => setSubs(words.slice(0, i + 1).join(" ")), (i / words.length) * total));
      later(() => {
        setPhase("printing");
        [0, 1, 2, 3, 4, 5].forEach((k) => later(() => alienClick(k, 2), k * 110));
        later(() => setPhase("done"), 1100);
      }, total + 300);
    }, 1900);
  };

  const busy = phase !== "idle" && phase !== "done";
  return (
    <div className="we">
      <div className="we-cabinet" onPointerDown={wake} onFocus={wake}>
        <div className="we-stage">
          <WishCabinet phase={phase} phaseAt={phaseAt} />
          <div className="mono we-state">{PHASES[phase]}</div>
          {(phase === "speaking" || phase === "printing") && <div className="we-subs" aria-hidden="true">{subs}</div>}
          <span className="sr-only">A carved fortune cabinet. Inside it, behind glass, Varrow is {PHASES[phase]}.</span>
        </div>

        <form className="we-panel" onSubmit={ask}>
          <label className="mono we-label" htmlFor="we-q">your question</label>
          <input id="we-q" className="we-input" value={q} onChange={(e) => setQ(e.target.value)} maxLength={140} placeholder="Will I... / When... / I wish..." disabled={busy} autoComplete="off" />
          <div className="we-controls">
            <button type="submit" className="we-coin-btn" disabled={busy || !q.trim()}>
              <span className={`we-token ${phase === "coin" ? "we-token-drop" : ""}`} aria-hidden="true" />
              {phase === "done" ? "Another token" : "Drop a gravity token"}
            </button>
          </div>
        </form>

        <div className="we-tray">
          {answer && (phase === "printing" || phase === "done") && (
            <div className={`we-card we-card-${answer.tone}`} role="status">
              <div className="mono we-card-head">varrow answers &middot; no. {String(answer.number || ((answer.q.length * 97) % 9000) + 1000)}</div>
              <div className="we-card-q">&ldquo;{answer.q}&rdquo;</div>
              <div className="we-card-marks" aria-hidden="true">{answer.marks}</div>
              <div className="we-card-text">{answer.text}</div>
              <div className="mono we-card-foot">translated by 13i &middot; meaning approximate</div>
            </div>
          )}
        </div>
      </div>
      <button className="mono cx-mute" onClick={() => { const m = !mute; setMuted(m); setMute(m); if (m) stopAmbience(); else startAmbience(); }} aria-pressed={mute} style={{ marginTop: 14 }}>{mute ? "sound off" : "sound on"}</button>
    </div>
  );
}
