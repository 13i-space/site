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

export default function UniverseQuiz() {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState([]); // chosen option index per question
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(null);

  const current = questions[index];
  const selected = picks[index] ?? null;
  const isLast = index === questions.length - 1;
  const score = picks.filter((p, i) => p === questions[i].answer).length;

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
  };

  useEffect(() => {
    if (done) saveResult(score, gradeFor(score, questions.length)).then(setSaved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

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
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div className="panel" style={{ textAlign: "center" }}>
          <div className="mono" style={styles.label}>YOUR GRADE</div>
          <div style={styles.grade}>{grade}</div>
          <div className="mono" style={{ fontSize: 14, color: "#B9C0FF", marginTop: 4 }}>
            {score} of {questions.length} correct
          </div>
          <p style={{ fontSize: 14, color: "#8A8FBF", margin: "12px 0 0" }}>{verdict}</p>
          <div className="mono" style={{ fontSize: 11, color: "#565B8F", marginTop: 12 }}>
            {saved === "saved" && "saved to your Node"}
            {saved === "signed-out" && <><Link href="/login">sign in</Link> to keep your score on your Node</>}
          </div>
          <button onClick={restart} style={styles.button}>Take it again</button>
        </div>

        {missed.length > 0 && (
          <div className="panel" style={{ marginTop: 16 }}>
            <div className="mono" style={styles.label}>WHAT YOU MISSED</div>
            {missed.map((q) => (
              <div key={q.n} style={{ padding: "12px 0", borderBottom: "1px solid #21244A" }}>
                <p style={{ fontSize: 14, color: "#D9DCFF", margin: "0 0 6px" }}>
                  <span className="mono" style={{ color: "#565B8F", marginRight: 8 }}>{q.n}.</span>
                  {q.q}
                </p>
                <div style={{ fontSize: 13, color: "#C97B6E" }}>&#10005; You said: {q.options[q.pick]}</div>
                <div style={{ fontSize: 13, color: "#8B95F6" }}>&#10003; Answer: {q.options[q.answer]}</div>
                <p style={{ fontSize: 12.5, color: "#8A8FBF", margin: "6px 0 0", lineHeight: 1.6 }}>{q.fact}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="panel" style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="mono" style={{ ...styles.label, textAlign: "center", marginBottom: 8 }}>
        QUESTION {index + 1} OF {questions.length}
      </div>
      <div style={{ height: 3, background: "#21244A", borderRadius: 2, marginBottom: 18, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((index + (selected !== null ? 1 : 0)) / questions.length) * 100}%`, background: "#8B95F6", transition: "width 0.2s" }} />
      </div>

      <p style={{ fontSize: 16, color: "#D9DCFF", lineHeight: 1.6, marginBottom: 18 }}>{current.q}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {current.options.map((opt, i) => {
          const isCorrect = i === current.answer;
          const isChosen = i === selected;
          let borderColor = "#262A55";
          let color = "#B9C0FF";
          if (selected !== null) {
            if (isCorrect) { borderColor = "#8B95F6"; color = "#DCDFFF"; }
            else if (isChosen) { borderColor = "#C97B6E"; color = "#C97B6E"; }
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={selected !== null}
              style={{
                textAlign: "left", background: "transparent", border: `1px solid ${borderColor}`, borderRadius: 4,
                color, fontFamily: "'Inter', sans-serif", fontSize: 14, padding: "10px 14px",
                cursor: selected === null ? "pointer" : "default",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div style={{ marginTop: 18, borderTop: "1px solid #21244A", paddingTop: 14 }}>
          <p style={{ fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: 0 }}>{current.fact}</p>
          <button onClick={next} style={{ ...styles.button, marginTop: 14, width: "100%" }}>
            {isLast ? "See your grade" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  label: { fontSize: 11, color: "#565B8F", letterSpacing: "1px", marginBottom: 6 },
  grade: { fontSize: 72, lineHeight: 1.1, color: "#DCDFFF", fontFamily: "'Fraunces', serif", fontStyle: "italic" },
  button: {
    background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 13, padding: "10px 20px", cursor: "pointer", marginTop: 20,
  },
};
