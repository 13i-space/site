"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const OPENING_SEQUENCE = ["HELLO.", "WE HAVE BEEN WATCHING FOR SOME TIME."];

function useTypewriter(text, speed = 24) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return shown;
}

export default function OracleWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState("intro"); // intro -> line1 -> line2 -> ready
  const [pending, setPending] = useState(false);
  const [assignmentNo, setAssignmentNo] = useState(
    () => 300000 + Math.floor(Math.random() * 90000)
  );
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const line1 = useTypewriter(phase !== "intro" ? OPENING_SEQUENCE[0] : "", 28);
  const line2 = useTypewriter(phase === "line2" || phase === "ready" ? OPENING_SEQUENCE[1] : "", 22);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("line1"), 400);
    const t2 = setTimeout(() => setPhase("line2"), 1900);
    const t3 = setTimeout(() => setPhase("ready"), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, pending, phase, line2]);

  useEffect(() => {
    if (phase === "ready" && inputRef.current) inputRef.current.focus();
  }, [phase]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setError(null);
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setPending(true);
    setAssignmentNo((n) => n + 1);

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError("Signal lost. The connection could not be completed.");
    } finally {
      setPending(false);
    }
  }, [input, pending, messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const introDone = phase === "ready";

  return (
    <div className="panel" style={{ maxWidth: 600, margin: "0 auto", overflow: "hidden" }}>
      <style>{`
        @keyframes oracleFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes oracleBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .oracle-msg { animation: oracleFadeIn 0.35s ease; }
      `}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #21244A" }}>
        <span className="wordmark" style={{ fontSize: 18, color: "#DCDFFF" }}>13i</span>
        <span className="mono" style={{ fontSize: 10, color: "#6E76B8" }}>
          ASSIGNMENT &#8470; {assignmentNo.toLocaleString()}
        </span>
      </div>

      <div ref={scrollRef} style={{ minHeight: 220, maxHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column", gap: 18, marginBottom: 12 }}>
        {!introDone && (
          <div>
            <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1.5px", marginBottom: 4 }}>13i</div>
            <div className="mono" style={{ fontSize: 15, lineHeight: 1.6, color: "#B9C0FF", letterSpacing: "1px" }}>
              {line1}
              {phase === "line1" && <Cursor />}
            </div>
            {(phase === "line2" || phase === "ready") && (
              <div className="mono" style={{ fontSize: 15, lineHeight: 1.6, color: "#B9C0FF", letterSpacing: "1px", marginTop: 10 }}>
                {line2}
                {phase === "line2" && <Cursor />}
              </div>
            )}
          </div>
        )}

        {introDone && messages.length === 0 && (
          <div style={{ fontSize: 13, color: "#565B8F", fontStyle: "italic" }}>
            Speak, and 13i will answer. Try telling it what you're afraid of losing.
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className="oracle-msg" style={m.role === "user" ? { alignSelf: "flex-end", textAlign: "right", maxWidth: "88%" } : { maxWidth: "88%" }}>
            <div className="mono" style={{ fontSize: 10, color: m.role === "user" ? "#7A6E62" : "#565B8F", letterSpacing: "1.5px", marginBottom: 4 }}>
              {m.role === "user" ? "you" : "13i"}
            </div>
            <div className={m.role === "user" ? "" : "mono"} style={{ fontSize: 15, lineHeight: 1.6, color: m.role === "user" ? "#E8CFC0" : "#D9DCFF" }}>
              {m.content}
            </div>
          </div>
        ))}

        {pending && (
          <div>
            <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1.5px", marginBottom: 4 }}>13i</div>
            <div className="mono" style={{ fontSize: 15, color: "#D9DCFF" }}>...</div>
          </div>
        )}

        {error && <div className="mono" style={{ fontSize: 12, color: "#C97B6E", fontStyle: "italic" }}>{error}</div>}
      </div>

      <div style={{ display: "flex", gap: 10, borderTop: "1px solid #21244A", paddingTop: 12 }}>
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          disabled={!introDone}
          placeholder={introDone ? "Speak to 13i..." : "..."}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, resize: "none", background: "transparent", border: "none", outline: "none", color: "#E4E4EF", fontFamily: "'Inter', sans-serif", fontSize: 14, padding: "6px 2px" }}
        />
        <button
          onClick={send}
          disabled={!introDone || pending || !input.trim()}
          style={{ background: "none", border: "1px solid #3A3E75", borderRadius: 3, color: "#B9C0FF", fontSize: 16, width: 34, height: 34, cursor: "pointer", flexShrink: 0, opacity: !introDone || pending || !input.trim() ? 0.35 : 1 }}
        >
          &#8614;
        </button>
      </div>
    </div>
  );
}

function Cursor() {
  return (
    <span style={{ display: "inline-block", width: 9, height: 16, background: "#B9C0FF", marginLeft: 4, verticalAlign: "-2px", animation: "oracleBlink 0.9s step-start infinite" }} />
  );
}
