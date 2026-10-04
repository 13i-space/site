"use client";

import { useEffect, useRef, useState } from "react";
import { answerFor, inVarrow } from "../lib/wishEngine";
import { alienClick, alienSpeak, alienLock, isMuted, setMuted } from "../lib/alienSound";

// The Wish Engine (Update 5.58, replacing the Ninefold): a fortune cabinet
// recovered from somewhere far off, with Varrow inside it. Ask a question,
// drop a gravity token; Varrow wakes, circles its orb, speaks (an alien
// voice, made live by lib/alienSound.js, with its words as glyphs), and a
// card slides out of the slot with the answer and 13i's translation.
// Answers: lib/wishEngine.js. A homage to the Zoltar machine in Big.

const PHASES = { idle: "asleep", coin: "token received", waking: "waking", speaking: "speaking", printing: "printing", done: "answered" };

function Varrow({ phase }) {
  return (
    <svg viewBox="0 0 360 320" className={`we-varrow we-${phase}`} aria-hidden="true">
      <defs>
        <radialGradient id="we-bg" cx="50%" cy="40%" r="70%"><stop offset="0" stopColor="#1C1A44" /><stop offset="1" stopColor="#05040F" /></radialGradient>
        <linearGradient id="we-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5E9AA6" /><stop offset="0.55" stopColor="#2E5B70" /><stop offset="1" stopColor="#173046" /></linearGradient>
        <radialGradient id="we-skinlight" cx="38%" cy="30%" r="60%"><stop offset="0" stopColor="#BFF5F0" stopOpacity="0.35" /><stop offset="1" stopColor="#BFF5F0" stopOpacity="0" /></radialGradient>
        <linearGradient id="we-robe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4B2E6E" /><stop offset="1" stopColor="#1A1030" /></linearGradient>
        <radialGradient id="we-orb" cx="40%" cy="35%" r="65%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.25" stopColor="#E9D29A" /><stop offset="0.6" stopColor="#8B5FBF" /><stop offset="1" stopColor="#1A0F33" /></radialGradient>
        <radialGradient id="we-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#E9D29A" stopOpacity="0.55" /><stop offset="1" stopColor="#E9D29A" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="360" height="320" fill="url(#we-bg)" />
      {Array.from({ length: 28 }).map((_, i) => <circle key={i} cx={(i * 97) % 360} cy={(i * 53) % 200} r={i % 4 ? 0.7 : 1.2} fill="#B9C0FF" opacity="0.5" />)}

      {/* robe and neck */}
      <path d="M30 320 Q48 252 128 236 L232 236 Q312 252 330 320 Z" fill="url(#we-robe)" />
      <path d="M118 238 Q180 276 242 238" fill="none" stroke="#E9D29A" strokeWidth="3" opacity="0.8" />
      <path d="M128 246 Q180 282 232 246" fill="none" stroke="#E9D29A" strokeWidth="1" opacity="0.5" />
      <path d="M156 196 Q180 214 204 196 L212 240 L148 240 Z" fill="url(#we-skin)" />

      {/* the head */}
      <g className="we-head">
        <path d="M180 34 C244 34 266 92 258 140 C250 188 216 214 180 216 C144 214 110 188 102 140 C94 92 116 34 180 34 Z" fill="url(#we-skin)" />
        <path d="M180 34 C244 34 266 92 258 140 C250 188 216 214 180 216 C144 214 110 188 102 140 C94 92 116 34 180 34 Z" fill="url(#we-skinlight)" />
        {/* crown ridges */}
        <g className="we-ridges" fill="none" strokeLinecap="round">
          <path d="M150 58 Q180 30 210 58" stroke="#E9D29A" strokeWidth="3" />
          <path d="M138 80 Q180 46 222 80" stroke="#E9D29A" strokeWidth="2.4" />
          <path d="M128 104 Q180 66 232 104" stroke="#E9D29A" strokeWidth="1.8" />
        </g>
        {/* the small eyes */}
        <g className="we-small-eyes">
          <circle cx="164" cy="108" r="4.5" fill="#05040F" /><circle cx="196" cy="108" r="4.5" fill="#05040F" />
          <circle cx="165" cy="107" r="1.3" fill="#E9D29A" /><circle cx="197" cy="107" r="1.3" fill="#E9D29A" />
        </g>
        {/* the great eyes */}
        {[[148, 136, 18], [212, 136, -18]].map(([x, y, a]) => (
          <g key={x} transform={`rotate(${a} ${x} ${y})`}>
            <ellipse cx={x} cy={y} rx="24" ry="12.5" fill="#05040F" />
            <ellipse className="we-iris" cx={x} cy={y} rx="9" ry="9" fill="#7A4FD0" opacity="0.85" />
            <circle className="we-iris" cx={x - 4} cy={y - 4} r="2.6" fill="#fff" opacity="0.9" />
            <ellipse className="we-lid" cx={x} cy={y - 1} rx="26" ry="14" fill="#3A7085" />
          </g>
        ))}
        {/* cheek lights */}
        {[[126, 166], [134, 176], [234, 166], [226, 176]].map(([x, y], i) => <circle key={i} className="we-cheek" cx={x} cy={y} r="2.2" fill="#7FF0E0" style={{ animationDelay: `${i * 0.2}s` }} />)}
        {/* mouth and tendrils */}
        <ellipse className="we-mouth" cx="180" cy="172" rx="4" ry="10" fill="#0A0518" />
        <g className="we-tendrils" stroke="#2C566A" strokeWidth="3.4" strokeLinecap="round" fill="none">
          {[-14, -7, 0, 7, 14].map((dx, i) => (
            <path key={i} className="we-tendril" style={{ animationDelay: `${i * 0.09}s`, transformOrigin: `${180 + dx}px 182px` }} d={`M${180 + dx} 182 q${dx * 0.3} 14 ${dx * 0.2} 26 q${-dx * 0.2} 8 ${dx * 0.1} 14`} />
          ))}
        </g>
      </g>

      {/* the orb */}
      <circle cx="180" cy="284" r="70" fill="url(#we-glow)" className="we-orb-glow" />
      <circle cx="180" cy="284" r="34" fill="url(#we-orb)" />
      <g className="we-swirl" style={{ transformOrigin: "180px 284px" }} fill="none" stroke="#fff" strokeLinecap="round" opacity="0.55">
        <path d="M160 284 a20 20 0 0 1 40 0" strokeWidth="1.2" />
        <path d="M168 292 a12 12 0 0 0 24 -6" strokeWidth="1" />
        <path d="M186 268 a16 16 0 0 1 8 22" strokeWidth="0.8" />
      </g>

      {/* the hands */}
      {[["we-hand-l", 1], ["we-hand-r", -1]].map(([cls, s]) => (
        <g key={cls} className={`we-hand ${cls}`}>
          <g transform={`translate(180 0) scale(${s} 1) translate(-180 0)`}>
            <path d="M74 320 Q88 290 112 278 Q126 272 134 276" fill="none" stroke="url(#we-skin)" strokeWidth="16" strokeLinecap="round" />
            <path d="M132 276 Q146 262 152 252" fill="none" stroke="#3A7085" strokeWidth="4.2" strokeLinecap="round" />
            <path d="M134 278 Q150 272 160 268" fill="none" stroke="#3A7085" strokeWidth="4.2" strokeLinecap="round" />
            <path d="M134 282 Q148 288 156 292" fill="none" stroke="#3A7085" strokeWidth="4.2" strokeLinecap="round" />
            <circle cx="152" cy="252" r="2" fill="#7FF0E0" className="we-cheek" /><circle cx="160" cy="268" r="2" fill="#7FF0E0" className="we-cheek" /><circle cx="156" cy="292" r="2" fill="#7FF0E0" className="we-cheek" />
          </g>
        </g>
      ))}
    </svg>
  );
}

export default function WishEngine() {
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState("idle");
  const [answer, setAnswer] = useState(null);
  const [subs, setSubs] = useState("");
  const [mute, setMute] = useState(false);
  const timers = useRef([]);
  useEffect(() => { setMute(isMuted()); return () => timers.current.forEach(clearTimeout); }, []);
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
      <div className="we-cabinet">
        <div className="we-marquee">
          <div className="we-marquee-glyphs" aria-hidden="true">{inVarrow("ask varrow anything")}</div>
          <div className="we-marquee-text">ASK VARROW</div>
          <div className="mono we-marquee-sub">one token &middot; one answer &middot; no refunds across the void</div>
        </div>
        <div className="we-window">
          <Varrow phase={phase} />
          <div className="we-glass" aria-hidden="true" />
          {(phase === "speaking" || phase === "printing") && <div className="we-subs" aria-hidden="true">{subs}</div>}
          <div className="mono we-state">{PHASES[phase]}</div>
        </div>

        <form className="we-panel" onSubmit={ask}>
          <label className="mono we-label" htmlFor="we-q">your question</label>
          <input id="we-q" className="we-input" value={q} onChange={(e) => setQ(e.target.value)} maxLength={140} placeholder="Will I... / When... / I wish..." disabled={busy} autoComplete="off" />
          <div className="we-controls">
            <button type="submit" className="we-coin-btn" disabled={busy || !q.trim()}>
              <span className={`we-token ${phase === "coin" ? "we-token-drop" : ""}`} aria-hidden="true" />
              {phase === "done" ? "Another token" : "Drop a gravity token"}
            </button>
            <span className="we-slot" aria-hidden="true" />
          </div>
        </form>

        <div className="we-tray">
          <div className="we-tray-slot" aria-hidden="true" />
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
      <button className="mono cx-mute" onClick={() => { setMuted(!mute); setMute(!mute); }} aria-pressed={mute} style={{ marginTop: 14 }}>{mute ? "sound off" : "sound on"}</button>
    </div>
  );
}
