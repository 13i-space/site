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
const LIGHT_COUNT = 7;

export default function Ninefold() {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState("idle"); // idle -> spinning -> revealed
  const [finalTip, setFinalTip] = useState(null);
  const [spinAmount, setSpinAmount] = useState(0);
  const timeoutsRef = useRef([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const spin = useCallback(() => {
    if (phase === "spinning") return;
    clearTimers();
    setFinalTip(null);
    setPhase("spinning");

    const chosen = Math.floor(Math.random() * 9);
    const extraSpins = 4 + Math.floor(Math.random() * 2);

    // Land so that face `chosen` ends up rotated to 0deg (facing the viewer).
    const base = Math.ceil(spinAmount / 360) * 360 + extraSpins * 360;
    const landing = base - chosen * STEP;
    setSpinAmount(landing);

    const t = setTimeout(() => {
      setFinalTip(chosen);
      setPhase("revealed");
    }, 1900);
    timeoutsRef.current.push(t);
  }, [phase, spinAmount]);

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setFinalTip(null);
    setQuestion("");
  };

  const isSpinning = phase === "spinning";

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lightChase {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
        .die-group { transition: transform 1.9s cubic-bezier(0.15, 0.7, 0.1, 1); }
        .answer-text { animation: fadeUp 0.5s ease; }
        .cabinet-light { animation: lightChase 0.9s ease-in-out infinite; }
        .cabinet-light.idle { animation: none; opacity: 0.35; }
      `}</style>

      <div style={styles.frame}>
        {/* --- Cabinet --- */}
        <div style={styles.cabinet}>
          {/* arch top with rivets */}
          <div style={styles.archTop}>
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} style={styles.rivet} />
            ))}
          </div>

          <div style={styles.marquee}>
            <span className="mono" style={styles.marqueeText}>THE NINEFOLD</span>
          </div>

          <div style={styles.cabinetBody}>
            {/* left light column */}
            <LightColumn active={isSpinning} />

            {/* viewing window */}
            <div style={styles.window}>
              <div style={styles.windowGlass} />
              <div style={styles.scene}>
                <div style={styles.dieGroupOuter}>
                  <div
                    className="die-group"
                    style={{
                      ...styles.dieGroup,
                      transform: `rotateX(-4deg) rotateY(${spinAmount}deg)`,
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

            {/* right light column */}
            <LightColumn active={isSpinning} />
          </div>
        </div>

        {/* --- Answer / status --- */}
        <div style={styles.answerZone}>
          {phase === "revealed" && finalTip !== null ? (
            <div className="answer-text" style={styles.answerText}>
              <div style={styles.answerLabel}>{ANSWERS[finalTip].label}</div>
              {ANSWERS[finalTip].text}
            </div>
          ) : isSpinning ? (
            <div style={styles.shufflingText}>...</div>
          ) : (
            <div style={styles.hint}>
              Ask a yes-or-no question. Pull the lever and the Ninefold spins
              to answer.
            </div>
          )}
        </div>

        <div style={styles.inputBar}>
          <input
            style={styles.input}
            type="text"
            value={question}
            placeholder="Ask a yes-or-no question..."
            disabled={isSpinning}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                phase === "revealed" ? reset() : spin();
              }
            }}
          />
          <button
            onClick={phase === "revealed" ? reset : spin}
            disabled={isSpinning}
            style={{
              ...styles.actionBtn,
              opacity: isSpinning ? 0.4 : 1,
            }}
          >
            {phase === "revealed" ? "Pull again" : "Pull"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LightColumn({ active }) {
  return (
    <div style={styles.lightColumn}>
      {Array.from({ length: LIGHT_COUNT }).map((_, i) => (
        <span
          key={i}
          className={`cabinet-light${active ? "" : " idle"}`}
          style={{ ...styles.light, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center" },
  frame: { width: "100%", maxWidth: 420 },

  cabinet: {
    position: "relative",
    background: "linear-gradient(180deg, #1C1F48 0%, #0C0E28 100%)",
    border: "1px solid #3A3E75",
    borderRadius: "120px 120px 10px 10px",
    padding: "22px 16px 20px",
    marginBottom: 8,
  },
  archTop: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  rivet: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "#8B95F6",
    opacity: 0.6,
    display: "inline-block",
  },
  marquee: {
    textAlign: "center",
    marginBottom: 14,
  },
  marqueeText: {
    fontSize: 11,
    letterSpacing: "3px",
    color: "#E8CFC0",
  },
  cabinetBody: {
    display: "flex",
    alignItems: "stretch",
    gap: 10,
  },
  lightColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: 12,
  },
  light: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#E8CFC0",
  },
  window: {
    position: "relative",
    flex: 1,
    minHeight: 280,
    background: "radial-gradient(ellipse at center, #0A0B1C 0%, #060712 100%)",
    border: "1px solid #262A55",
    borderRadius: 10,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  windowGlass: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(115deg, rgba(185,192,255,0.08) 0%, rgba(185,192,255,0) 35%)",
    pointerEvents: "none",
    zIndex: 2,
  },
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
    padding: "16px 10px 18px",
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
