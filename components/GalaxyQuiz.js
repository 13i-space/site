"use client";

import { useState } from "react";
import { questions } from "../lib/galaxyQuiz";

export default function GalaxyQuiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (isLast) {
      setDone(true);
      return;
    }
    setIndex((n) => n + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const verdict =
      pct === 100
        ? "Perfect signal. Nothing lost in the noise."
        : pct >= 70
        ? "Strong reception."
        : pct >= 40
        ? "Partial signal — some of it got through."
        : "Mostly static. Worth another pass.";

    return (
      <div className="panel" style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div className="mono" style={{ fontSize: 11, color: "#565B8F", letterSpacing: "1px", marginBottom: 6 }}>
          SCORE
        </div>
        <div style={{ fontSize: 44, color: "#DCDFFF", fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>
          {score} / {questions.length}
        </div>
        <p style={{ fontSize: 14, color: "#8A8FBF", marginTop: 8 }}>{verdict}</p>
        <button onClick={restart} style={styles.button}>
          Take it again
        </button>
      </div>
    );
  }

  return (
    <div className="panel" style={{ maxWidth: 480, margin: "0 auto" }}>
      <div
        className="mono"
        style={{ fontSize: 11, color: "#565B8F", letterSpacing: "1px", marginBottom: 18, textAlign: "center" }}
      >
        QUESTION {index + 1} OF {questions.length}
      </div>

      <p style={{ fontSize: 16, color: "#D9DCFF", lineHeight: 1.6, marginBottom: 18 }}>{current.q}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {current.options.map((opt, i) => {
          const isCorrect = i === current.answer;
          const isChosen = i === selected;
          let borderColor = "#262A55";
          let color = "#B9C0FF";
          if (selected !== null) {
            if (isCorrect) {
              borderColor = "#8B95F6";
              color = "#DCDFFF";
            } else if (isChosen) {
              borderColor = "#C97B6E";
              color = "#C97B6E";
            }
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={selected !== null}
              style={{
                textAlign: "left",
                background: "transparent",
                border: `1px solid ${borderColor}`,
                borderRadius: 4,
                color,
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                padding: "10px 14px",
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
            {isLast ? "See your score" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  button: {
    background: "none",
    border: "1px solid #3A3E75",
    borderRadius: 4,
    color: "#B9C0FF",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    padding: "10px 20px",
    cursor: "pointer",
    marginTop: 20,
  },
};
