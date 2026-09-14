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

// Same nine-glyph marks used on the Cryptex - decorative here, so a face
// never spells out its answer until the die actually lands on it.
const GLYPH_DEFS = [
  { edges: [], dots: [0] },
  { edges: [[0, 1]], dots: [0, 1] },
  { edges: [[0, 2]], dots: [0, 2] },
  { edges: [[0, 3], [3, 6], [6, 0]], dots: [0, 3, 6] },
  { edges: [[0, 4]], dots: [0, 4] },
  { edges: [[0, 4], [2, 6]], dots: [0, 2, 4, 6] },
  { edges: [[0, 3], [3, 6], [6, 0], [1, 4], [4, 7], [7, 1]], dots: [0, 1, 3, 4, 6, 7] },
  { edges: "full", dots: "all" },
  { edges: [], dots: [] },
];
const GCX = 30, GCY = 30, GR = 20;
function gpt(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return [GCX + radius * Math.cos(rad), GCY + radius * Math.sin(rad)];
}
const GANGLES = Array.from({ length: 9 }, (_, i) => -90 + i * 40);
const GPOINTS = GANGLES.map((a) => gpt(a, GR));

function GlyphIcon({ index, glow }) {
  const def = GLYPH_DEFS[index];
  const dotSet = def.dots === "all" ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : def.dots;
  const edgeList = def.edges === "full" ? Array.from({ length: 9 }, (_, i) => [i, (i + 1) % 9]) : def.edges;
  return (
    <svg width={44} height={44} viewBox="0 0 60 60">
      {edgeList.map(([a, b], i) => (
        <line key={i} x1={GPOINTS[a][0]} y1={GPOINTS[a][1]} x2={GPOINTS[b][0]} y2={GPOINTS[b][1]} stroke={glow ? "#E8CFC0" : "#6E76B8"} strokeWidth="1.3" opacity="0.9" />
      ))}
      {GPOINTS.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={dotSet.includes(i) ? 2.4 : 1} fill={dotSet.includes(i) ? (glow ? "#E8CFC0" : "#8B95F6") : "#3A3E75"} />
      ))}
    </svg>
  );
}

const FACE_W = 78;
const FACE_H = 130;
const RADIUS = Math.round(FACE_W / 2 / Math.tan(Math.PI / 9));
const STEP = 360 / 9;

export default function Ninefold() {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState("idle"); // idle -> shaking -> settling -> revealed
  const [finalTip, setFinalTip] = useState(null);
  const [spinAmount, setSpinAmount] = useState(0);
  const [jitter, setJitter] = useState(false);
  const timeoutsRef = useRef([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const shake = useCallback(() => {
    if (phase === "shaking" || phase === "settling") return;
    clearTimers();
    setFinalTip(null);
    setPhase("shaking");
    setJitter(true);

    const chosen = Math.floor(Math.random() * 9);
    const extraSpins = 3 + Math.floor(Math.random() * 2);

    const t1 = setTimeout(() => {
      setJitter(false);
      setPhase("settling");
      // Land so that face `chosen` ends up rotated to 0deg (facing the viewer).
      const base = Math.ceil(spinAmount / 360) * 360 + extraSpins * 360;
      const landing = base - chosen * STEP;
      setSpinAmount(landing);
    }, 550);
    timeoutsRef.current.push(t1);

    const t2 = setTimeout(() => {
      setFinalTip(chosen);
      setPhase("revealed");
    }, 550 + 1400);
    timeoutsRef.current.push(t2);
  }, [phase, spinAmount]);

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setFinalTip(null);
    setQuestion("");
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes dieJitter {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          20% { transform: translate(-3px, 2px) rotate(-1deg); }
          40% { transform: translate(3px, -2px) rotate(1deg); }
          60% { transform: translate(-2px, -1px) rotate(-0.6deg); }
          80% { transform: translate(2px, 1px) rotate(0.6deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .die-jitter { animation: dieJitter 0.15s ease-in-out infinite; }
        .die-group { transition: transform 1.4s cubic-bezier(0.2, 0.7, 0.15, 1); }
        .answer-text { animation: fadeUp 0.5s ease; }
      `}</style>

      <div style={styles.frame}>
        <div style={styles.pyramidWrap}>
          <svg viewBox="0 0 360 380" width="100%" style={{ maxWidth: 360, position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)" }}>
            <defs>
              <linearGradient id="nfPyr" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1C1F48" />
                <stop offset="100%" stopColor="#08091E" />
              </linearGradient>
            </defs>
            <polygon points="180,10 20,360 340,360" fill="url(#nfPyr)" stroke="#3A3E75" strokeWidth="1.5" />
            <line x1="180" y1="10" x2="180" y2="360" stroke="#262A55" strokeWidth="1" opacity="0.5" />
          </svg>

          <div style={styles.scene} className={jitter ? "die-jitter" : ""}>
            <div
              style={{
                ...styles.dieGroupOuter,
              }}
            >
              <div
                className="die-group"
                style={{
                  ...styles.dieGroup,
                  transform: `rotateX(-6deg) rotateY(${spinAmount}deg)`,
                }}
              >
                {ANSWERS.map((_, i) => {
                  const isFront = phase === "revealed" && finalTip === i;
                  return (
                    <div
                      key={i}
                      style={{
                        ...styles.face,
                        transform: `rotateY(${i * STEP}deg) translateZ(${RADIUS}px)`,
                        background: isFront
                          ? "linear-gradient(180deg, #262A6A, #12153A)"
                          : "linear-gradient(180deg, #181B42, #0C0E28)",
                        borderColor: isFront ? "#E8CFC0" : "#3A3E75",
                        boxShadow: isFront ? "0 0 18px rgba(232,207,192,0.35)" : "none",
                      }}
                    >
                      <GlyphIcon index={i} glow={isFront} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.answerZone}>
          {phase === "revealed" && finalTip !== null ? (
            <div className="answer-text" style={styles.answerText}>
              <div style={styles.answerLabel}>{ANSWERS[finalTip].label}</div>
              {ANSWERS[finalTip].text}
            </div>
          ) : phase === "shaking" || phase === "settling" ? (
            <div style={styles.shufflingText}>...</div>
          ) : (
            <div style={styles.hint}>Ask a question. Shake to see which face answers.</div>
          )}
        </div>

        <div style={styles.inputBar}>
          <input
            style={styles.input}
            type="text"
            value={question}
            placeholder="What do you want to ask 13i?"
            disabled={phase === "shaking" || phase === "settling"}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                phase === "revealed" ? reset() : shake();
              }
            }}
          />
          <button
            onClick={phase === "revealed" ? reset : shake}
            disabled={phase === "shaking" || phase === "settling"}
            style={{
              ...styles.actionBtn,
              opacity: phase === "shaking" || phase === "settling" ? 0.4 : 1,
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
  frame: { width: "100%", maxWidth: 420 },
  pyramidWrap: { position: "relative", height: 340, marginBottom: 8, display: "flex", justifyContent: "center", alignItems: "center" },
  scene: { position: "relative", zIndex: 1, perspective: 900 },
  dieGroupOuter: { transformStyle: "preserve-3d" },
  dieGroup: { position: "relative", width: FACE_W, height: FACE_H, transformStyle: "preserve-3d" },
  face: {
    position: "absolute",
    width: FACE_W,
    height: FACE_H,
    left: 0,
    top: 0,
    border: "1px solid #3A3E75",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  answerZone: {
    minHeight: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "6px 10px 18px",
  },
  answerLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "#8B95F6",
    letterSpacing: "1px",
    marginBottom: 6,
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
