"use client";
import { useState } from "react";

// Scenario check: one question at a time, explanation after each answer.
export default function Quiz({ quiz, title = "Knowledge check", best = 0, onScore }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState([]);
  const [done, setDone] = useState(false);
  const items = quiz.items;
  const q = items[i];
  const picked = picks[i];
  const answered = picked !== undefined;
  const correct = picks.filter((p, k) => p === items[k].answer).length;
  const pct = Math.round((correct / items.length) * 100);
  const passed = pct >= quiz.pass;

  function choose(k) {
    if (answered) return;
    const next = [...picks];
    next[i] = k;
    setPicks(next);
  }
  function advance() {
    if (i < items.length - 1) { setI(i + 1); return; }
    setDone(true);
    const c = picks.filter((p, k) => p === items[k].answer).length;
    onScore?.(Math.round((c / items.length) * 100));
  }
  function retake() { setI(0); setPicks([]); setDone(false); }

  if (done) {
    return (
      <div className={`ac-quiz done ${passed ? "pass" : "fail"}`}>
        <div className="ac-quiz-score">
          <b>{pct}%</b>
          <span>{correct} of {items.length} correct · {quiz.pass}% to pass</span>
        </div>
        <h4>{passed ? "Passed. Nicely done." : "Not quite yet."}</h4>
        <p>{passed ? "Progress, not perfection, and this is real progress." : "It's a skill to improve, not a test to pass. Review the explanations and try again."}</p>
        <button type="button" className="sos-btn ghost" onClick={retake}>{passed ? "Take it again" : "Try again"}</button>
      </div>
    );
  }

  return (
    <div className="ac-quiz">
      <div className="ac-quiz-top">
        <span>{title}</span>
        <span>Question {i + 1} of {items.length}{best ? ` · best ${best}%` : ""}</span>
      </div>
      <div className="ac-quiz-bar"><span style={{ width: `${((i + (answered ? 1 : 0)) / items.length) * 100}%` }} /></div>
      <h4>{q.q}</h4>
      <div className="ac-quiz-opts" role="radiogroup" aria-label={q.q}>
        {q.options.map((o, k) => {
          const state = !answered ? "" : k === q.answer ? "right" : k === picked ? "wrong" : "dim";
          return (
            <button key={k} type="button" role="radio" aria-checked={picked === k} className={state} onClick={() => choose(k)} disabled={answered}>
              <span className="l">{String.fromCharCode(65 + k)}</span>{o}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`ac-quiz-why ${picked === q.answer ? "right" : "wrong"}`}>
          <b>{picked === q.answer ? "Yes." : "Not quite."}</b> {q.why}
        </div>
      )}
      <div className="ac-quiz-foot">
        <button type="button" className="sos-btn" onClick={advance} disabled={!answered}>{i < items.length - 1 ? "Next question" : "See my score"}</button>
      </div>
    </div>
  );
}
