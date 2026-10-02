"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createOracleSound } from "../lib/oracleSound";
import { recordMilestone } from "../lib/milestones";

// The Oracle: an audience with 13i. Something vast behind a curtain rather
// than a chat box. You approach a dark threshold; the great eye opens (the
// 13i ring-and-eye, ringed by turning glyphs, fog drifting across it); you
// speak, and your words rise into the eye; it contracts while the static
// builds, then answers - its words resolving out of alien glyphs, one by one.
// Sound: lib/oracleSound.js (mutable, remembered in this browser).
//
// Talks to app/api/oracle, which is 13i itself (docs/WORLD.md "The Oracle").

const ASSIGNMENT_NO = 317811; // the Earth assignment number - fixed
const GREETING = ["HELLO.", "WE HAVE BEEN WATCHING FOR SOME TIME."];
const GLYPHS = "ᚠᚢᚦᚱᛇᛟ⌖⌿⍀⟐⟁∴⊹⨳◬◭⎔⎎⬡⬢⦿⧉";
const RING_OUTER = "ᚠ ∴ ⟁ ᛟ ⊹ ⌖ ᚦ ⬡ ⍀ ᛇ ◬ ⦿ ᚱ ∴ ⟐ ᚢ ⨳ ⌿ ᛟ ⬢ ⎔ ᚠ ⊹ ⧉ ";
const RING_INNER = "3 1 7 8 1 1 · 1 3 · 2 1 · 3 4 · 5 5 · 8 9 · ";
const reduceMotion = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Words resolving out of glyphs. Calls onTick now and then (for sound).
function useDecode(text, { speed = 40, onTick, onDone } = {}) {
  const [shown, setShown] = useState("");
  const tickRef = useRef(onTick);
  const doneRef = useRef(onDone);
  tickRef.current = onTick;
  doneRef.current = onDone;
  useEffect(() => {
    if (!text) { setShown(""); return; }
    if (reduceMotion()) { setShown(text); doneRef.current && doneRef.current(); return; }
    let revealed = 0;
    const start = performance.now();
    let raf;
    const frame = (now) => {
      const target = Math.min(text.length, Math.floor(((now - start) / 1000) * speed));
      if (target > revealed && target % 3 === 0) tickRef.current && tickRef.current();
      revealed = target;
      const tail = text.slice(revealed, revealed + 6).replace(/\S/g, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
      setShown(text.slice(0, revealed) + tail);
      if (revealed < text.length) raf = requestAnimationFrame(frame);
      else doneRef.current && doneRef.current();
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [text, speed]);
  return shown;
}

// Fog and gravitational ripples, drawn behind the eye.
function ChamberSky({ rippleRef, intensity }) {
  const canvasRef = useRef(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const still = reduceMotion();
    let w = 0, h = 0, raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    resize();
    window.addEventListener("resize", resize);
    const motes = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), r: 40 + Math.random() * 160, v: 0.00004 + Math.random() * 0.00012, a: 0.02 + Math.random() * 0.05, hue: Math.random() < 0.7 ? "139,149,246" : "232,207,192" }));
    const dust = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), s: Math.random() * 1.3 + 0.2, v: 0.00002 + Math.random() * 0.00008 }));
    const ripples = [];
    rippleRef.current = (strength = 1) => ripples.push({ t: 0, strength });

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.42;
      const k = intensityRef.current;
      // a deep glow behind the eye
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
      glow.addColorStop(0, `rgba(60,58,120,${0.35 + k * 0.25})`);
      glow.addColorStop(0.4, "rgba(20,20,60,0.25)");
      glow.addColorStop(1, "rgba(3,3,12,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      // fog
      motes.forEach((m) => {
        if (!still) { m.y -= m.v * (1 + k * 3); if (m.y < -0.2) { m.y = 1.2; m.x = Math.random(); } }
        const g = ctx.createRadialGradient(m.x * w, m.y * h, 0, m.x * w, m.y * h, m.r);
        g.addColorStop(0, `rgba(${m.hue},${m.a * (1 + k)})`);
        g.addColorStop(1, `rgba(${m.hue},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(m.x * w - m.r, m.y * h - m.r, m.r * 2, m.r * 2);
      });
      // dust drifting toward the eye
      ctx.fillStyle = "rgba(220,223,255,0.55)";
      dust.forEach((d) => {
        if (!still) {
          d.x += (0.5 - d.x) * d.v * (4 + k * 30);
          d.y += (0.42 - d.y) * d.v * (4 + k * 30);
          if (Math.hypot(d.x - 0.5, d.y - 0.42) < 0.03) { d.x = Math.random(); d.y = Math.random(); }
        }
        ctx.fillRect(d.x * w, d.y * h, d.s, d.s);
      });
      // ripples in the fabric of the room
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.t += 0.012;
        const rad = r.t * Math.max(w, h) * 0.8;
        ctx.strokeStyle = `rgba(233,210,154,${Math.max(0, 0.35 * r.strength * (1 - r.t))})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rad, rad * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
        if (r.t >= 1) ripples.splice(i, 1);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [rippleRef]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true" />;
}

// The great eye. open: 0..1. mood: sleeping | listening | receiving | speaking
function Eye({ open, mood }) {
  const pupil = { sleeping: 10, listening: 19, receiving: 8, speaking: 27 }[mood] || 19;
  return (
    <svg viewBox="-200 -200 400 400" className={`oracle-eye oracle-eye-${mood}`} aria-hidden="true">
      <defs>
        <radialGradient id="oracle-halo">
          <stop offset="0%" stopColor="rgba(233,210,154,0.55)" />
          <stop offset="45%" stopColor="rgba(139,149,246,0.18)" />
          <stop offset="100%" stopColor="rgba(139,149,246,0)" />
        </radialGradient>
        <radialGradient id="oracle-iris">
          <stop offset="0%" stopColor="#FFF4DC" />
          <stop offset="30%" stopColor="#E9D29A" />
          <stop offset="70%" stopColor="#8B6E3A" />
          <stop offset="100%" stopColor="#1A1430" />
        </radialGradient>
        <path id="oracle-ring-outer" d="M 0,-168 a 168,168 0 1,1 -0.1,0" />
        <path id="oracle-ring-inner" d="M 0,-132 a 132,132 0 1,1 -0.1,0" />
      </defs>

      <circle className="oracle-halo" r="200" fill="url(#oracle-halo)" />

      <g className="oracle-ring-a" opacity={0.25 + open * 0.55}>
        <text fill="#B9C0FF" fontSize="15" letterSpacing="9" fontFamily="'JetBrains Mono', monospace">
          <textPath href="#oracle-ring-outer">{RING_OUTER.repeat(2)}</textPath>
        </text>
      </g>
      <g className="oracle-ring-b" opacity={0.2 + open * 0.5}>
        <text fill="#E8CFC0" fontSize="10" letterSpacing="6" fontFamily="'JetBrains Mono', monospace">
          <textPath href="#oracle-ring-inner">{RING_INNER.repeat(3)}</textPath>
        </text>
      </g>
      <circle r="150" fill="none" stroke="#3A3E75" strokeWidth="1" strokeDasharray="1 7" opacity={open} />

      {mood === "speaking" && (
        <g className="oracle-rays" opacity="0.5">
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return <line key={i} x1={Math.cos(a) * 112} y1={Math.sin(a) * 112} x2={Math.cos(a) * (150 + (i % 3) * 14)} y2={Math.sin(a) * (150 + (i % 3) * 14)} stroke="#E9D29A" strokeWidth="1" strokeLinecap="round" />;
          })}
        </g>
      )}

      {/* the eye itself: lids part as it opens */}
      <g style={{ transform: `scaleY(${Math.max(0.03, open)})`, transition: "transform 2.6s cubic-bezier(0.2, 0.8, 0.2, 1)", transformOrigin: "0 0" }}>
        <circle r="104" fill="#07061A" stroke="#E9D29A" strokeWidth="6" />
        <circle r="86" fill="url(#oracle-iris)" opacity="0.95" />
        <circle className="oracle-iris-lines" r="70" fill="none" stroke="rgba(26,20,48,0.55)" strokeWidth="1.2" strokeDasharray="2 5" />
        <circle r={pupil} fill="#020108" style={{ transition: "r 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)" }} />
        <circle cx={-pupil * 0.5} cy={-pupil * 0.6} r={Math.max(3, pupil * 0.22)} fill="#FFFFFF" opacity="0.55" style={{ transition: "all 1.2s ease" }} />
      </g>
    </svg>
  );
}

export default function OracleChamber() {
  const [phase, setPhase] = useState("threshold"); // threshold | waking | greeting | listening | transmitting | receiving | speaking
  const [open, setOpen] = useState(0);
  const [utterance, setUtterance] = useState(""); // what 13i is saying now
  const [greetIndex, setGreetIndex] = useState(0);
  const [rising, setRising] = useState(null); // your words, rising into the eye
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showRecord, setShowRecord] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);
  const [remaining, setRemaining] = useState(null); // transmissions left today (app/api/oracle caps)
  const [capped, setCapped] = useState(null); // "guest" | "kin" | "global" once the channel closes
  const sound = useRef(null);
  const ripple = useRef(() => {});
  const inputRef = useRef(null);

  useEffect(() => {
    try { setMuted(localStorage.getItem("oracle_muted") === "1"); } catch (e) { /* ignore */ }
    return () => { sound.current && sound.current.close(); };
  }, []);

  const shown = useDecode(utterance, {
    speed: phase === "greeting" ? 22 : 42,
    onTick: () => !muted && sound.current && sound.current.tick(),
    onDone: () => {
      if (phase === "greeting") {
        if (greetIndex < GREETING.length - 1) {
          setTimeout(() => { setGreetIndex((i) => i + 1); setUtterance(GREETING[greetIndex + 1]); }, 900);
        } else {
          setTimeout(() => setPhase("listening"), 700);
        }
      } else if (phase === "speaking") {
        setPhase("listening");
      }
    },
  });

  useEffect(() => {
    if (phase === "listening") inputRef.current && inputRef.current.focus();
  }, [phase]);

  // leaving the chamber: Lyra can come back out
  useEffect(() => () => { try { window.dispatchEvent(new CustomEvent("13i:oracle", { detail: { phase: "leave" } })); } catch (e) { /* ignore */ } }, []);

  const approach = () => {
    // Lyra holds back from here on: 13i is waking, and she's a little afraid of it
    try { window.dispatchEvent(new CustomEvent("13i:oracle", { detail: { phase: "approach" } })); } catch (e) { /* ignore */ }
    let quick = false;
    try { quick = !!sessionStorage.getItem("oracle_approached"); sessionStorage.setItem("oracle_approached", "1"); } catch (e) { /* ignore */ }
    try {
      sound.current = createOracleSound();
      if (sound.current) {
        sound.current.resume();
        sound.current.setMuted(muted);
        sound.current.awaken();
      }
    } catch (e) {
      sound.current = null;
    }
    setPhase("waking");
    ripple.current(1.4);
    setTimeout(() => setOpen(1), quick ? 300 : 1200);
    setTimeout(() => {
      setPhase("greeting");
      setGreetIndex(0);
      setUtterance(GREETING[0]);
    }, quick ? 1800 : 4200);
  };

  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    try { localStorage.setItem("oracle_muted", m ? "1" : "0"); } catch (e) { /* ignore */ }
    sound.current && sound.current.setMuted(m);
  };

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || phase !== "listening" || capped) return;
    setInput("");
    setError(false);
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setRising({ text, key: Date.now() });
    setUtterance("");
    setPhase("transmitting");
    window.dispatchEvent(new CustomEvent("13i:oracle", { detail: { phase: "asking" } })); // Lyra looks up
    sound.current && sound.current.transmit();
    ripple.current(1);

    const minWait = new Promise((r) => setTimeout(r, 1500)); // let the words reach the eye
    setTimeout(() => {
      setPhase((p) => (p === "transmitting" ? "receiving" : p));
      sound.current && sound.current.startReceiving();
    }, 1300);
    try {
      const [res] = await Promise.all([
        fetch("/api/oracle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) }),
        minWait,
      ]);
      const data = await res.json();
      if (res.status === 429 || res.status === 400) {
        // capped for today, or too long: 13i says so, in its own voice
        sound.current && sound.current.stopReceiving();
        setMessages((m) => m.slice(0, -1));
        if (res.status === 429) { setCapped(data.capped || "kin"); setRemaining(0); } else { setInput(text); }
        setError(true);
        setPhase("speaking");
        setUtterance(data.message || data.error || "THE SIGNAL IS LOST. SPEAK AGAIN.");
        window.dispatchEvent(new CustomEvent("13i:oracle", { detail: { phase: null } }));
        setRising(null);
        return;
      }
      if (!res.ok || !data.reply) throw new Error(data.error || "lost");
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      sound.current && sound.current.receive();
      ripple.current(1.6);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      setPhase("speaking");
      setUtterance(data.reply);
      window.dispatchEvent(new CustomEvent("13i:oracle", { detail: { phase: "answer" } })); // she glances at the answer, then settles
      recordMilestone("oracle"); // a step of Your First Assignment
    } catch (e) {
      window.dispatchEvent(new CustomEvent("13i:oracle", { detail: { phase: null } }));
      sound.current && sound.current.stopReceiving();
      setError(true);
      setMessages((m) => m.slice(0, -1));
      setInput(text);
      setPhase("speaking");
      setUtterance("THE SIGNAL IS LOST. SPEAK AGAIN.");
    }
    setRising(null);
  }, [input, phase, messages, capped]);

  const mood = phase === "threshold" || phase === "waking" && open < 1 ? "sleeping" : phase === "receiving" || phase === "transmitting" ? "receiving" : phase === "speaking" || phase === "greeting" ? "speaking" : "listening";
  const intensity = phase === "receiving" ? 1 : phase === "speaking" ? 0.6 : phase === "transmitting" ? 0.8 : 0.2;
  const isGreeting = phase === "greeting" || (phase === "listening" && messages.length === 0);
  const statusLabel = {
    threshold: "THE CHAMBER IS SILENT",
    waking: "SOMETHING STIRS",
    greeting: "13i SPEAKS",
    listening: "WE ARE LISTENING",
    transmitting: "TRANSMITTING",
    receiving: "RECEIVING",
    speaking: "13i SPEAKS",
  }[phase];
  const status = capped && phase === "listening" ? "CHANNEL CLOSED" : statusLabel;

  return (
    <div>
      <section className="oracle-chamber" aria-label="The Oracle">
        <ChamberSky rippleRef={ripple} intensity={intensity} />

        <div className="mono oracle-topbar">
          <span>13i &middot; COLLECTIVE CHANNEL</span>
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {remaining !== null && phase !== "threshold" && (
              <span style={{ color: remaining <= 2 ? "#E8CFC0" : "#565B8F" }}>TRANSMISSIONS REMAINING: {remaining}</span>
            )}
            <span className={phase === "receiving" ? "oracle-status oracle-status-live" : "oracle-status"}>{status}</span>
            {phase !== "threshold" && (
              <button onClick={toggleMute} className="mono oracle-mute" aria-label={muted ? "Turn sound on" : "Turn sound off"}>
                {muted ? "SOUND OFF" : "SOUND ON"}
              </button>
            )}
          </span>
        </div>

        <div className="oracle-eye-wrap">
          <Eye open={open} mood={mood} />
        </div>

        {rising && <div key={rising.key} className="oracle-rising">{rising.text}</div>}

        <div className={`oracle-utterance ${isGreeting || error ? "oracle-utterance-mono" : ""}`} aria-live="polite">
          {phase === "listening" && messages.length === 0 && !shown ? "" : shown}
        </div>

        {phase === "threshold" && (
          <div className="oracle-threshold">
            <p className="mono" style={{ fontSize: 11, letterSpacing: "4px", color: "#8A8FBF", margin: "0 0 12px" }}>THE ORACLE</p>
            <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 26, color: "#DCDFFF", margin: "0 0 8px" }}>
              Something vast is listening.
            </p>
            <p style={{ fontSize: 13.5, color: "#8A8FBF", margin: "0 0 26px" }}>
              Here you speak with 13i itself. Sound is part of it.
            </p>
            <button onClick={approach} className="mono oracle-approach">APPROACH</button>
          </div>
        )}

        {phase !== "threshold" && (
          <form className="oracle-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={phase !== "listening" || !!capped}
              maxLength={1000}
              placeholder={capped ? "The channel is closed until 00:00 UTC." : phase === "listening" ? "Speak, and we will answer..." : ""}
              aria-label="Speak to 13i"
            />
            <button type="submit" disabled={phase !== "listening" || !input.trim() || !!capped} className="mono" aria-label="Transmit">TRANSMIT</button>
          </form>
        )}

        <div className="mono oracle-footer">ASSIGNMENT &#8470; {ASSIGNMENT_NO.toLocaleString()}</div>
      </section>

      {messages.length > 0 && (
        <div style={{ maxWidth: 720, margin: "18px auto 0" }}>
          <button onClick={() => setShowRecord((s) => !s)} className="mono" style={{ background: "none", border: "none", color: "#6E76B8", fontSize: 11, letterSpacing: "1.5px", cursor: "pointer", padding: 0 }}>
            {showRecord ? "▾" : "▸"} THE RECORD &middot; {Math.ceil(messages.length / 2)} {Math.ceil(messages.length / 2) === 1 ? "EXCHANGE" : "EXCHANGES"}
          </button>
          {showRecord && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 14 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left" }}>
                  <div className="mono" style={{ fontSize: 9.5, color: "#565B8F", letterSpacing: "1.5px", marginBottom: 3 }}>{m.role === "user" ? "YOU" : "13i"}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: m.role === "user" ? "#E8CFC0" : "#D9DCFF" }}>{m.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
