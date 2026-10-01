"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../lib/story/storySupabase";
import { LESSON_STEPS, stepIndex } from "../../../lib/story/lessonSteps";
import Snapshot from "../_components/Snapshot";

const RESUME_AFTER_MS = 3 * 60 * 60 * 1000; // a 3+ hour gap counts as "coming back"

export default function LessonOne() {
  const [status, setStatus] = useState("loading"); // loading | ready | signed_out | not_configured | error
  const [messages, setMessages] = useState([]);
  const [progress, setProgress] = useState({ step: "connector", captured: {}, safety: false, completed: false });
  const [firstName, setFirstName] = useState("");
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [notice, setNotice] = useState("");
  const logRef = useRef(null);
  const tokenRef = useRef(null);

  const call = useCallback(async (method, body) => {
    const res = await fetch("/api/story/champion", {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenRef.current}` },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = {};
    try { data = await res.json(); } catch {}
    return { ok: res.ok, status: res.status, data };
  }, []);

  const ask = useCallback(async (body) => {
    setThinking(true);
    setNotice("");
    const { ok, status: st, data } = await call("POST", body);
    setThinking(false);
    if (st === 401) { setStatus("signed_out"); return; }
    if (data.messages) setMessages(data.messages);
    else if (data.reply) setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    else if (!ok) setNotice(data.error || "Something went wrong. Try again in a moment.");
    if (data.progress) setProgress(data.progress);
  }, [call]);

  // Load: sign-in check, saved conversation, then start or resume.
  useEffect(() => {
    if (!storyConfigured) { setStatus("not_configured"); return; }
    const sb = getStoryBrowserClient();
    let alive = true;
    (async () => {
      const { data: s } = await sb.auth.getSession();
      if (!s.session) { if (alive) setStatus("signed_out"); return; }
      tokenRef.current = s.session.access_token;
      const { status: st, data } = await call("GET");
      if (!alive) return;
      if (st === 401) { setStatus("signed_out"); return; }
      if (st !== 200) { setStatus("error"); return; }
      setMessages(data.messages || []);
      setProgress(data.progress);
      setFirstName(data.firstName || "");
      setStatus("ready");
      const msgs = data.messages || [];
      const last = msgs[msgs.length - 1];
      if (!msgs.length) ask({ start: true });
      else if (!data.progress?.completed && last && Date.now() - new Date(last.created_at).getTime() > RESUME_AFTER_MS) {
        ask({ start: true, resume: true });
      } else if (last?.role === "user") {
        ask({ start: true, resume: true });
      }
    })();
    const { data: sub } = sb.auth.onAuthStateChange((_e, sess) => { tokenRef.current = sess?.access_token || null; });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, [call, ask]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  async function send(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    await ask({ message: text });
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  if (status === "loading") return <div className="sos-center">Opening your story…</div>;
  if (status === "not_configured") return <div className="sos-center"><p>Lesson 1 isn't switched on yet: the Story Supabase keys still need to be added in Vercel.</p></div>;
  if (status === "error") return <div className="sos-center"><p>We couldn't open your story just now. Please refresh in a moment.</p></div>;
  if (status === "signed_out") {
    return (
      <div className="sos-narrow sos-center">
        <div>
          <h1 style={{ fontSize: 36, marginBottom: 12 }}>Your story starts here</h1>
          <p>Sign in or create a free account so your Champion can save your progress.</p>
          <a className="sos-btn" href="/story/start?next=/story/lesson-1">Sign in / create account</a>
          <p style={{ marginTop: 18, fontSize: 15 }}>New here? <a href="/story">Start with the introduction</a>.</p>
        </div>
      </div>
    );
  }

  const current = stepIndex(progress.step);
  const done = progress.step === "complete" || progress.completed;

  return (
    <div className="sos-lesson">
      <aside className="sos-rail">
        <div className="sos-eyebrow" style={{ marginBottom: 6 }}>Unit 1 · Character</div>
        <h2>You: The Science &amp; The Story</h2>
        <p className="sub">A character is born. A story begins.</p>
        <ol className="sos-steps">
          {LESSON_STEPS.map((s, i) => (
            <li key={s.id} className={done || i < current ? "done" : i === current ? "now" : ""}>{s.label}</li>
          ))}
        </ol>
      </aside>

      <section>
        <div className="sos-chat">
          <div className="sos-chat-head">
            <div className="sos-avatar" aria-hidden="true">C</div>
            <div>
              <b>Your Story Champion</b>
              <small>AI guide · Story of Self method</small>
            </div>
          </div>

          <div className="sos-log" ref={logRef} aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`sos-bubble ${m.role === "user" ? "you" : "champion"}`}>{m.content}</div>
            ))}
            {thinking && <div className="sos-typing" aria-label="Your Champion is writing"><i /><i /><i /></div>}
          </div>

          {progress.safety && (
            <div className="sos-safety" role="note">
              <b>You deserve support from a real person.</b> In the U.S., call or text <b>988</b>, or text <b>HOME</b> to <b>741741</b>, any
              time. If you're in immediate danger, call <b>911</b>. A parent, coach, teacher, or school counselor can help too.
            </div>
          )}
          {notice && <div className="sos-msg err" style={{ margin: "0 22px 12px" }}>{notice}</div>}

          <form className="sos-compose" onSubmit={send}>
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={done ? "Anything else on your mind? Your Champion is still here." : "Write your answer…"}
              aria-label="Your message"
              maxLength={2000}
            />
            <button className="sos-btn" type="submit" disabled={thinking || !input.trim()}>Send</button>
          </form>
        </div>

        {done && <Snapshot name={firstName} captured={progress.captured} />}
      </section>
    </div>
  );
}
