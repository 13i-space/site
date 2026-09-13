"use client";

import React, { useState, useRef, useCallback } from "react";

const ANSWERS = [
  { label: "AFFIRMED", text: "Yes. The pattern supports it." },
  { label: "DENIED", text: "No. The pattern does not." },
  { label: "UNKNOWN", text: "We do not have enough transmissions to answer." },
  { label: "SHIFTING", text: "The answer changes depending on what you do next." },
  { label: "ALREADY KNOWN", text: "Ask again when you already know the answer." },
  { label: "UNSTATED", text: "This depends on a fear you have not stated." },
  { label: "LIKELY", text: "Likely. Little in what we have observed suggests otherwise." },
  { label: "RECONSIDER", text: "Unlikely. Reconsider the assumption beneath the question." },
  { label: "TWO PATHS", text: "We see two paths. You are already choosing one." },
];

const CX = 150;
const CY = 172;
const NONA_R = 46;
const LABEL_R = 63;

function pt(cx, cy, angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
}

const ANGLES = Array.from({ length: 9 }, (_, i) => -90 + i * 40);
const NONA_POINTS = ANGLES.map((a) => pt(CX, CY, a, NONA_R));
const NONA_PATH = NONA_POINTS.map((p) => p.join(",")).join(" ");
const LABEL_POINTS = ANGLES.map((a) => pt(CX, CY, a, LABEL_R));

export default function Ninefold() {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState("idle");
  const [finalTip, setFinalTip] = useState(null);
  const [spinAmount, setSpinAmount] = useState(0);
  const timeoutsRef = useRef([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const shake = useCallback(() => {
    if (phase === "shaking") return;
    clearTimers();
    setFinalTip(null);
    setPhase("shaking");

    const spins = 4 + Math.floor(Math.random() * 2);
    setSpinAmount((prev) => prev + spins * 360);

    const chosen = Math.floor(Math.random() * 9);
    const t = setTimeout(() => {
      setFinalTip(chosen);
      setPhase("revealed");
    }, 1300);
    timeoutsRef.current.push(t);
  }, [phase]);

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setFinalTip(null);
    setQuestion("");
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pyramidShake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          15% { transform: translateX(-4px) rotate(-1.2deg); }
          30% { transform: translateX(4px) rotate(1.2deg); }
          45% { transform: translateX(-3px) rotate(-0.8deg); }
          60% { transform: translateX(3px) rotate(0.8deg); }
          75% { transform: translateX(-2px) rotate(-0.4deg); }
          90% { transform: translateX(2px) rotate(0.4deg); }
        }
        @keyframes vertexIdle {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pyramid-shaking { animation: pyramidShake 0.35s ease-in-out 4; }
        .nonagon-spin { transition: transform 1.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .answer-text { animation: fadeUp 0.5s ease; }
        .ninefold-input::placeholder { color: #565B8F; }
      `}</style>

      <div style={styles.frame}>
        <div style={styles.stage}>
          <svg
            className={phase === "shaking" ? "pyramid-shaking" : ""}
            viewBox="0 0 300 340"
            width="270"
            height="306"
          >
            <defs>
              <linearGradient id="pyrFace" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1C1F48" />
                <stop offset="100%" stopColor="#0C0E28" />
              </linearGradient>
              <radialGradient id="windowGlass" cx="50%" cy="42%" r="65%">
                <stop offset="0%" stopColor="#181B42" />
                <stop offset="100%" stopColor="#08091E" />
              </radialGradient>
            </defs>

            <polygon
              points="150,26 46,308 254,308"
              fill="url(#pyrFace)"
              stroke="#3A3E75"
              strokeWidth="1.5"
            />
            <line x1="150" y1="26" x2="150" y2="308" stroke="#262A55" strokeWidth="1" opacity="0.6" />

            <circle cx={CX} cy={CY} r="80" fill="url(#windowGlass)" stroke="#4C5192" strokeWidth="1.5" />

            <g
              className="nonagon-spin"
              style={{
                transformOrigin: `${CX}px ${CY}px`,
                transform: `rotate(${spinAmount}deg)`,
              }}
            >
              <polygon
                points={NONA_PATH}
                fill="none"
                stroke="#4C5192"
                strokeWidth="1.5"
                opacity="0.8"
              />
              {NONA_POINTS.map((p, i) => (
                <circle
                  key={`v-${i}`}
                  cx={p[0]}
                  cy={p[1]}
                  r={phase === "revealed" && finalTip === i ? 5.5 : 3}
                  fill={phase === "revealed" && finalTip === i ? "#E8CFC0" : "#8B95F6"}
                  style={{
                    animation:
                      phase === "idle" ? `vertexIdle 2.6s ease-in-out infinite` : "none",
                    animationDelay: `${i * 0.15}s`,
                    transition: "r 0.2s ease, fill 0.25s ease",
                  }}
                />
              ))}
              {LABEL_POINTS.map((p, i) => (
                <text
                  key={`l-${i}`}
                  x={p[0]}
                  y={p[1]}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 7.5,
                    fill: phase === "revealed" && finalTip === i ? "#E8CFC0" : "#565B8F",
                    letterSpacing: "0.3px",
                    transform: `rotate(${-spinAmount}deg)`,
                    transformOrigin: `${p[0]}px ${p[1]}px`,
                    transition: "fill 0.25s ease",
                  }}
                >
                  {ANSWERS[i].label}
                </text>
              ))}
            </g>
          </svg>
        </div>

        <div style={styles.answerZone}>
          {phase === "revealed" && finalTip !== null ? (
            <div className="answer-text" style={styles.answerText}>
              {ANSWERS[finalTip].text}
            </div>
          ) : phase === "shaking" ? (
            <div style={styles.shufflingText}>...</div>
          ) : (
            <div style={styles.hint}>Ask a question. Shake to see which face answers.</div>
          )}
        </div>

        <div style={styles.inputBar}>
          <input
            className="ninefold-input"
            style={styles.input}
            type="text"
            value={question}
            placeholder="What do you want to ask 13i?"
            disabled={phase === "shaking"}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                phase === "revealed" ? reset() : shake();
              }
            }}
          />
          <button
            onClick={phase === "revealed" ? reset : shake}
            disabled={phase === "shaking"}
            style={{
              ...styles.actionBtn,
              opacity: phase === "shaking" ? 0.4 : 1,
            }}
          >
            {phase === "revealed" ? "Shake again" : "Shake"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center" },
  frame: { width: "100%", maxWidth: 460 },
  stage: { display: "flex", justifyContent: "center", padding: "2px 0 0" },
  answerZone: {
    minHeight: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "6px 10px 18px",
  },
  answerText: {
    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    fontSize: 15,
    lineHeight: 1.6,
    color: "#D9DCFF",
  },
  shufflingText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 20,
    color: "#6E76B8",
    letterSpacing: "4px",
  },
  hint: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    color: "#565B8F",
    fontStyle: "italic",
  },
  inputBar: {
    display: "flex",
    gap: 10,
    borderTop: "1px solid #21244A",
    paddingTop: 16,
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "1px solid #262A55",
    borderRadius: 3,
    outline: "none",
    color: "#E4E4EF",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    padding: "9px 10px",
  },
  actionBtn: {
    background: "none",
    border: "1px solid #3A3E75",
    borderRadius: 3,
    color: "#B9C0FF",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    padding: "9px 16px",
    cursor: "pointer",
    flexShrink: 0,
  },
};
