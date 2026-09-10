"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function OracleWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setError(null);
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setPending(true);

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

  return (
    <div className="panel" style={{ maxWidth: 560, margin: "0 auto" }}>
      <div ref={scrollRef} style={styles.log}>
        {messages.length === 0 && (
          <div style={styles.hint}>Speak, and 13i will answer.</div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            style={m.role === "user" ? styles.userLine : styles.oracleLine}
          >
            <div style={styles.label}>{m.role === "user" ? "you" : "13i"}</div>
            <div className={m.role === "user" ? "" : "mono"} style={styles.text}>
              {m.content}
            </div>
          </div>
        ))}
        {pending && (
          <div style={styles.oracleLine}>
            <div style={styles.label}>13i</div>
            <div className="mono" style={styles.text}>...</div>
          </div>
        )}
        {error && <div style={styles.error}>{error}</div>}
      </div>
      <div style={styles.inputRow}>
        <textarea
          style={styles.textarea}
          rows={1}
          value={input}
          placeholder="Speak to 13i..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button style={styles.sendBtn} onClick={send} disabled={pending || !input.trim()}>
          &#8614;
        </button>
      </div>
    </div>
  );
}

const styles = {
  log: { minHeight: 200, maxHeight: 360, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, marginBottom: 12 },
  hint: { fontSize: 13, color: "#565B8F", fontStyle: "italic" },
  label: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 4 },
  oracleLine: { maxWidth: "90%" },
  userLine: { maxWidth: "90%", alignSelf: "flex-end", textAlign: "right" },
  text: { fontSize: 15, lineHeight: 1.6, color: "#D9DCFF" },
  error: { fontSize: 12, color: "#C97B6E", fontStyle: "italic" },
  inputRow: { display: "flex", gap: 10, borderTop: "1px solid #21244A", paddingTop: 12 },
  textarea: { flex: 1, resize: "none", background: "transparent", border: "none", outline: "none", color: "#E4E4EF", fontFamily: "'Inter', sans-serif", fontSize: 14 },
  sendBtn: { background: "none", border: "1px solid #3A3E75", borderRadius: 3, color: "#B9C0FF", fontSize: 16, width: 34, height: 34, cursor: "pointer" },
};
