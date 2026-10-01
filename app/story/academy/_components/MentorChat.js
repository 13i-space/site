"use client";
import { useEffect, useRef, useState } from "react";

// A conversation with the Master Champion (AI, trained on Aaron's toolkits).
export default function MentorChat({ academy, checkpoint, title, intro, done, onDone, next }) {
  const { signedIn, ai } = academy;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(Boolean(done));
  const logRef = useRef(null);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }); }, [messages, busy]);

  async function call(list) {
    setBusy(true);
    setNotice("");
    const { ok, data } = await ai({ mode: "mentor", checkpoint, messages: list });
    setBusy(false);
    if (data.reply) setMessages([...list, { role: "assistant", content: data.reply }]);
    else if (!ok) setNotice(data.error === "signed_out" ? "Please sign in again." : data.error || "Something went wrong. Try again in a moment.");
    const userTurns = list.filter((m) => m.role === "user").length;
    if (data.done || userTurns >= 5) { setFinished(true); onDone?.(); }
  }

  function start() { setStarted(true); call([]); }
  function send(e) {
    e?.preventDefault();
    const t = input.trim();
    if (!t || busy) return;
    setInput("");
    const list = [...messages, { role: "user", content: t }];
    setMessages(list);
    call(list);
  }

  return (
    <div className="ac-mentor">
      <div className="ac-mentor-head">
        <div className="ac-mentor-av" aria-hidden="true">
          <svg viewBox="0 0 40 40"><circle cx="20" cy="22" r="9" fill="none" stroke="#fff" strokeWidth="2.5" /><circle cx="20" cy="9" r="3.2" fill="#fff" /></svg>
        </div>
        <div>
          <b>Master Champion</b>
          <small>AI mentor trained on Aaron Donaghy's Champion Toolkits</small>
        </div>
        <span className="ac-mentor-tag">{title}</span>
      </div>

      {!signedIn ? (
        <div className="ac-mentor-gate">
          <p>Your Master Champion conversation needs a Story account, so your progress and reflections are saved.</p>
          <a className="sos-btn" href={`/story/start?next=${encodeURIComponent(next)}`}>Sign in / create account</a>
        </div>
      ) : !started && !finished ? (
        <div className="ac-mentor-gate">
          <p>{intro}</p>
          <button type="button" className="sos-btn" onClick={start}>Begin the conversation</button>
        </div>
      ) : (
        <>
          <div className="ac-mentor-log" ref={logRef} aria-live="polite">
            {finished && !messages.length && <div className="sos-bubble champion">You've completed this conversation. Well done.</div>}
            {messages.map((m, i) => (
              <div key={i} className={`sos-bubble ${m.role === "user" ? "you" : "champion"}`}>{m.content}</div>
            ))}
            {busy && <div className="sos-typing" aria-label="The Master Champion is writing"><i /><i /><i /></div>}
          </div>
          {notice && <div className="sos-msg err" style={{ margin: "0 18px 10px" }}>{notice}</div>}
          {finished ? (
            <div className="ac-mentor-done">
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M7.6 13.6L4 10l-1.4 1.4 5 5 10-10L16.2 5z" fill="currentColor" /></svg>
              Conversation complete
            </div>
          ) : (
            <form className="sos-compose" onSubmit={send}>
              <textarea rows={2} value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Your answer…" aria-label="Your answer" maxLength={2000} />
              <button className="sos-btn" type="submit" disabled={busy || !input.trim()}>Send</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
