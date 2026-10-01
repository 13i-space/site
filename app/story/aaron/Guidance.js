"use client";
import { useRef, useState } from "react";
import { STATUSES } from "../../../lib/story/briefContent";

// The "Guidance needed" questions. Each answer saves on its own, quietly:
// tapping a choice saves at once, typing saves a moment after you pause.
function Item({ item, initial }) {
  const [status, setStatus] = useState(initial?.status || null);
  const [answer, setAnswer] = useState(initial?.answer || "");
  const [state, setState] = useState(initial?.updated_at ? "saved" : "idle"); // idle | saving | saved | error
  const [err, setErr] = useState("");
  const timer = useRef(null);
  const latest = useRef({ status, answer });

  async function save(next) {
    latest.current = next;
    setState("saving");
    setErr("");
    try {
      const res = await fetch("/api/story/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: item.key, ...next }),
      });
      const data = await res.json().catch(() => ({}));
      if (latest.current !== next) return; // a newer save is on its way
      if (!res.ok) throw new Error(data.error || "Couldn't save.");
      setState("saved");
    } catch (e) {
      setState("error");
      setErr(e.message || "Couldn't save.");
    }
  }

  function pick(s) {
    const ns = status === s ? null : s;
    setStatus(ns);
    clearTimeout(timer.current);
    save({ status: ns, answer });
  }

  function type(v) {
    setAnswer(v);
    setState("idle");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => save({ status, answer: v }), 1200);
  }

  function blur() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
      save({ status, answer });
    }
  }

  const answered = Boolean(status || answer.trim());
  return (
    <div className={`brief-q${answered ? " answered" : ""}`}>
      <div className="brief-q-head">
        <h4>{item.q}</h4>
        <span className={`brief-save ${state}`} aria-live="polite">
          {state === "saving" ? "Saving…" : state === "saved" ? "Saved" : state === "error" ? "Not saved" : ""}
        </span>
      </div>
      <p>{item.context}</p>
      {item.key !== "other" && (
        <div className="brief-status" role="group" aria-label="Quick answer">
          {Object.entries(STATUSES).map(([k, label]) => (
            <button key={k} type="button" className={status === k ? "on" : ""} aria-pressed={status === k} onClick={() => pick(k)}>
              {label}
            </button>
          ))}
        </div>
      )}
      <textarea
        value={answer}
        onChange={(e) => type(e.target.value)}
        onBlur={blur}
        rows={3}
        placeholder="Your thoughts, as short or long as you like"
        aria-label={item.q}
      />
      {state === "error" && <div className="sos-msg err" style={{ marginTop: 8 }}>{err}</div>}
    </div>
  );
}

export default function Guidance({ groups, initial }) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const done = groups.reduce(
    (n, g) => n + g.items.filter((i) => initial[i.key] && (initial[i.key].status || (initial[i.key].answer || "").trim())).length,
    0
  );
  return (
    <div className="brief-guidance">
      <p className="brief-progress">
        {total} questions. {done ? `${done} answered so far. ` : ""}Answer in any order, and come back any time. Everything saves as you go.
      </p>
      {groups.map((g) => (
        <section key={g.id} className="brief-group" aria-labelledby={`g-${g.id}`}>
          <h3 id={`g-${g.id}`}>{g.title}</h3>
          {g.items.map((item) => (
            <Item key={item.key} item={item} initial={initial[item.key]} />
          ))}
        </section>
      ))}
    </div>
  );
}
