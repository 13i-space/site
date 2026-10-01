"use client";
import { useEffect, useRef, useState } from "react";
import { PERSONAS, RUBRIC } from "../../../../lib/story/academy/curriculum";
import { ProgressRing } from "./Visuals";

const MIN_TURNS = 3;
const MAX_TURNS = 12;

function Avatar({ p, size = 48 }) {
  return (
    <span className="ac-av" style={{ width: size, height: size, background: p.hue, fontSize: size * 0.42 }} aria-hidden="true">{p.name[0]}</span>
  );
}

function Debrief({ p, fb, onAgain, onBack }) {
  return (
    <div className="ac-debrief">
      <div className="ac-debrief-top">
        <ProgressRing pct={fb.percent} size={92} stroke={8} label={`Session score ${fb.percent}%`} />
        <div>
          <div className="sos-eyebrow" style={{ marginBottom: 4 }}>Master Champion debrief · {p.name}</div>
          <h3>{fb.headline || "Session debrief"}</h3>
          <p className="ac-muted">Scored on Aaron's rubric. Progress, not perfection.</p>
        </div>
      </div>
      <div className="ac-rubric">
        {RUBRIC.map((r) => {
          const s = fb.scores[r.key];
          return (
            <div key={r.key} className="ac-rubric-row">
              <div className="ac-rubric-l">
                <b>{r.key === "skill" ? `Key skill: ${p.skill}` : r.label}</b>
                <small>{s.note}</small>
              </div>
              <div className="ac-rubric-bar" role="img" aria-label={`${s.score} of 4`}>
                {[1, 2, 3, 4].map((k) => <span key={k} className={k <= s.score ? "on" : ""} />)}
              </div>
              <span className="ac-rubric-n">{s.score}/4</span>
            </div>
          );
        })}
      </div>
      {fb.best_moment && (
        <blockquote className="ac-best">
          <span>Your best moment</span>
          “{fb.best_moment.replace(/^["“]|["”]$/g, "")}”
        </blockquote>
      )}
      <div className="ac-debrief-grid">
        <div>
          <h4>What you did well</h4>
          <ul>{fb.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div>
          <h4>Try this next time</h4>
          <p>{fb.try_next}</p>
        </div>
      </div>
      <div className="ac-row">
        <button type="button" className="sos-btn" onClick={onBack}>Practice with another student</button>
        <button type="button" className="sos-btn ghost" onClick={onAgain}>Run {p.name}'s session again</button>
      </div>
    </div>
  );
}

export default function PracticeRoom({ academy, next }) {
  const { signedIn, ai, progress, save } = academy;
  const [pid, setPid] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [fb, setFb] = useState(null);
  const [debriefing, setDebriefing] = useState(false);
  const logRef = useRef(null);
  const p = PERSONAS.find((x) => x.id === pid);
  const turns = messages.filter((m) => m.role === "user").length;
  const bestBy = Object.fromEntries((progress.practice || []).map((s) => [s.persona, s]));
  (progress.practice || []).forEach((s) => { if ((bestBy[s.persona]?.percent || 0) < s.percent) bestBy[s.persona] = s; });

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }); }, [messages, busy]);

  function open(id) { setPid(id); setMessages([]); setFb(null); setNotice(""); setInput(""); }

  async function send(e) {
    e?.preventDefault();
    const t = input.trim();
    if (!t || busy || turns >= MAX_TURNS) return;
    setInput("");
    const list = [...messages, { role: "user", content: t }];
    setMessages(list);
    setBusy(true);
    setNotice("");
    const { ok, data } = await ai({ mode: "practice", persona: pid, messages: list });
    setBusy(false);
    if (data.reply) setMessages([...list, { role: "assistant", content: data.reply }]);
    else if (!ok) setNotice(data.error || "Something went wrong. Try again.");
  }

  async function debrief() {
    setDebriefing(true);
    setNotice("");
    const { data } = await ai({ mode: "debrief", persona: pid, messages });
    setDebriefing(false);
    if (data.feedback) {
      setFb(data.feedback);
      await save((cur) => ({ ...cur, practice: [...(cur.practice || []), { persona: pid, percent: data.feedback.percent, headline: data.feedback.headline, at: new Date().toISOString() }] }));
    } else setNotice(data.error || data.reply || "The debrief didn't come through. Try again.");
  }

  if (!signedIn) {
    return (
      <div className="ac-mentor-gate ac-panel">
        <p>The Practice Room uses AI to simulate real students, so it needs a Story account. Your sessions and scores are saved to it.</p>
        <a className="sos-btn" href={`/story/start?next=${encodeURIComponent(next)}`}>Sign in / create account</a>
      </div>
    );
  }

  if (!p) {
    return (
      <div>
        <div className="ac-personas">
          {PERSONAS.map((x) => {
            const b = bestBy[x.id];
            return (
              <button type="button" key={x.id} className="ac-persona" onClick={() => open(x.id)}>
                <div className="ac-persona-top">
                  <Avatar p={x} />
                  <div>
                    <b>{x.name}, {x.age}</b>
                    <small>{x.scene}</small>
                  </div>
                  {b && <span className="ac-persona-score">{b.percent}%</span>}
                </div>
                <span className="ac-persona-skill">Skill: {x.skill}</span>
                <p>{x.brief}</p>
                <span className="ac-persona-go">{b ? "Practice again" : "Start session"} →</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (fb) return <Debrief p={p} fb={fb} onAgain={() => open(p.id)} onBack={() => setPid(null)} />;

  return (
    <div className="ac-sim">
      <div className="ac-sim-head">
        <Avatar p={p} size={42} />
        <div>
          <b>{p.name}, {p.age}</b>
          <small>{p.scene} · simulated student (fictional)</small>
        </div>
        <button type="button" className="sos-link-btn" onClick={() => setPid(null)}>Leave</button>
      </div>
      <div className="ac-sim-brief"><b>Your goal:</b> {p.brief}</div>
      <div className="ac-sim-log" ref={logRef} aria-live="polite">
        <div className="ac-sim-msg them"><Avatar p={p} size={28} /><div className="sos-bubble champion">{p.opener}</div></div>
        {messages.map((m, i) => (
          m.role === "user"
            ? <div key={i} className="sos-bubble you">{m.content}</div>
            : <div key={i} className="ac-sim-msg them"><Avatar p={p} size={28} /><div className="sos-bubble champion">{m.content}</div></div>
        ))}
        {busy && <div className="ac-sim-msg them"><Avatar p={p} size={28} /><div className="sos-typing" aria-label={`${p.name} is typing`}><i /><i /><i /></div></div>}
      </div>
      {notice && <div className="sos-msg err" style={{ margin: "0 18px 10px" }}>{notice}</div>}
      <form className="sos-compose" onSubmit={send}>
        <textarea rows={2} value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={turns >= MAX_TURNS ? "Session limit reached. Get your debrief." : `Respond to ${p.name} as their Champion…`}
          aria-label="Your reply as Champion" maxLength={1200} disabled={turns >= MAX_TURNS} />
        <button className="sos-btn" type="submit" disabled={busy || !input.trim() || turns >= MAX_TURNS}>Send</button>
      </form>
      <div className="ac-sim-foot">
        <span>{turns < MIN_TURNS ? `${MIN_TURNS - turns} more ${MIN_TURNS - turns === 1 ? "reply" : "replies"} before your debrief` : `${turns} replies · ready when you are`}</span>
        <button type="button" className="sos-btn" onClick={debrief} disabled={turns < MIN_TURNS || busy || debriefing}>
          {debriefing ? "The Master Champion is reviewing…" : "End session & get debrief"}
        </button>
      </div>
    </div>
  );
}
