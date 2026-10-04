"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabaseBrowser";
import { QUIZ, gradeFor } from "../lib/universeQuiz";

const questions = QUIZ.questions;

// Saves the latest result to the Node (quiz_results). Signed out, or before
// docs/v5.4-quiz-results.sql has been run, it quietly doesn't.
async function saveResult(score, grade) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "signed-out";
    const { error } = await supabase.from("quiz_results").upsert({
      user_id: user.id,
      quiz_id: QUIZ.id,
      score,
      total: questions.length,
      grade,
      taken_at: new Date().toISOString(),
    });
    return error ? "error" : "saved";
  } catch (e) {
    return "error";
  }
}

// The ring at the top: ten segments, one per question, lit as you go -
// gold for right, rose for wrong, a pulse on the one you're on.
function SignalRing({ picks, index, done, children }) {
  const n = questions.length, R = 88, C = 2 * Math.PI * R, gap = 6, seg = C / n - gap;
  return (
    <div className="qz-ring">
      <svg viewBox="0 0 220 220" aria-hidden="true">
        <circle cx="110" cy="110" r="100" className="qz-ring-halo" />
        {questions.map((q, i) => {
          const p = picks[i];
          const state = p === undefined || p === null ? (i === index && !done ? "now" : "off") : p === q.answer ? "hit" : "miss";
          return (
            <circle key={i} cx="110" cy="110" r={R} className={`qz-seg qz-seg-${state}`}
              strokeDasharray={`${seg} ${C - seg}`} strokeDashoffset={-(i * (C / n))} />
          );
        })}
      </svg>
      <div className="qz-ring-mid">{children}</div>
    </div>
  );
}

const LETTERS = ["A", "B", "C", "D"];

export default function UniverseQuiz() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState([]); // chosen option index per question
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(null);

  const current = questions[index];
  const selected = picks[index] ?? null;
  const isLast = index === questions.length - 1;
  const score = picks.filter((p, i) => p === questions[i].answer).length;
  // the current run of right answers
  let streak = 0;
  for (let i = picks.length - 1; i >= 0 && picks[i] === questions[i].answer; i--) streak++;

  const choose = (i) => {
    if (selected !== null) return;
    const next = [...picks];
    next[index] = i;
    setPicks(next);
  };

  const next = () => {
    if (isLast) setDone(true);
    else setIndex((n) => n + 1);
  };

  const restart = () => {
    setIndex(0);
    setPicks([]);
    setDone(false);
    setSaved(null);
    setStarted(true);
  };

  useEffect(() => {
    if (done) saveResult(score, gradeFor(score, questions.length)).then(setSaved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // keys: 1-4 or A-D to answer, Enter for the next question
  useEffect(() => {
    if (!started || done) return;
    const onKey = (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      const n = "1234".indexOf(k) >= 0 ? "1234".indexOf(k) : "abcd".indexOf(k);
      if (n >= 0 && n < current.options.length) choose(n);
      else if (k === "enter" && selected !== null) next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!started) {
    return (
      <div className="qz">
        <SignalRing picks={[]} index={-1} done={false}>
          <div className="qz-ring-big">10</div>
          <div className="mono qz-ring-small">questions</div>
        </SignalRing>
        <h1 className="qz-title">Universe Quiz</h1>
        <p className="qz-lede">Ten questions from across the cosmos. Each one is a signal: answer it right and it lights gold. A new set arrives now and then.</p>
        <button className="qz-go" onClick={() => setStarted(true)}>Begin transmission &rarr;</button>
        <div className="mono qz-hint">tip: keys 1&ndash;4 answer, Enter moves on</div>
      </div>
    );
  }

  if (done) {
    const grade = gradeFor(score, questions.length);
    const missed = questions.map((q, i) => ({ ...q, n: i + 1, pick: picks[i] })).filter((q) => q.pick !== q.answer);
    const verdict = {
      "A+": "Perfect signal. Nothing lost in the noise.",
      A: "Strong reception. One thing slipped past.",
      B: "Clear signal, a little static.",
      C: "Getting through, with gaps.",
      D: "Partial signal. Worth another pass.",
      F: "Mostly static. The universe is patient - try again.",
    }[grade];

    return (
      <div className="qz">
        <SignalRing picks={picks} index={-1} done>
          <div className="qz-ring-big qz-grade">{grade}</div>
          <div className="mono qz-ring-small">{score} of {questions.length}</div>
        </SignalRing>
        <p className="qz-verdict">{verdict}</p>
        <div className="mono qz-saved">
          {saved === "saved" && "saved to your Node"}
          {saved === "signed-out" && <><Link href="/login">sign in</Link> to keep your score on your Node</>}
        </div>
        <div className="qz-actions">
          <button onClick={restart} className="qz-go">Take it again</button>
          <Link href="/play" className="qz-ghost">More to play &rarr;</Link>
        </div>

        {missed.length > 0 && (
          <div className="qz-missed">
            <div className="mono qz-label">what you missed</div>
            {missed.map((q) => (
              <div key={q.n} className="qz-miss">
                <p className="qz-miss-q"><span className="mono">{String(q.n).padStart(2, "0")}</span> {q.q}</p>
                <div className="qz-miss-row qz-miss-no">&#10005; {q.options[q.pick]}</div>
                <div className="qz-miss-row qz-miss-yes">&#10003; {q.options[q.answer]}</div>
                <p className="qz-miss-fact">{q.fact}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const right = selected !== null && selected === current.answer;
  return (
    <div className="qz">
      <div className="qz-top">
        <SignalRing picks={picks} index={index} done={false}>
          <div className="qz-ring-big">{index + 1}</div>
          <div className="mono qz-ring-small">of {questions.length}</div>
        </SignalRing>
        <div className="mono qz-stats">
          <span>score <b>{score}</b></span>
          <span className={streak >= 3 ? "qz-hot" : ""}>streak <b>{streak}</b>{streak >= 3 ? " ✦" : ""}</span>
        </div>
      </div>

      <p key={index} className="qz-q">{current.q}</p>

      <div className="qz-options">
        {current.options.map((opt, i) => {
          let state = "";
          if (selected !== null) {
            if (i === current.answer) state = "qz-opt-right";
            else if (i === selected) state = "qz-opt-wrong";
            else state = "qz-opt-dim";
          }
          return (
            <button key={`${index}-${i}`} onClick={() => choose(i)} disabled={selected !== null} className={`qz-opt ${state}`} style={{ "--d": `${i * 60}ms` }}>
              <span className="mono qz-letter">{LETTERS[i]}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className={`qz-fact ${right ? "qz-fact-right" : "qz-fact-wrong"}`}>
          <div className="mono qz-label">{right ? "signal received · 13i notes" : "static · 13i notes"}</div>
          <p>{current.fact}</p>
          <button onClick={next} className="qz-go">{isLast ? "See your grade" : "Next signal"} &rarr;</button>
        </div>
      )}
    </div>
  );
}
