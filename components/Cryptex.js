"use client";

import React, { useState, useRef, useCallback } from "react";

const GLYPHS = [
  { name: "the seed", edges: [], dots: [0] },
  { name: "the pair", edges: [[0, 1]], dots: [0, 1] },
  { name: "the reach", edges: [[0, 2]], dots: [0, 2] },
  { name: "the triad", edges: [[0, 3], [3, 6], [6, 0]], dots: [0, 3, 6] },
  { name: "the span", edges: [[0, 4]], dots: [0, 4] },
  { name: "the cross", edges: [[0, 4], [2, 6]], dots: [0, 2, 4, 6] },
  {
    name: "the weave",
    edges: [[0, 3], [3, 6], [6, 0], [1, 4], [4, 7], [7, 1]],
    dots: [0, 1, 3, 4, 6, 7],
  },
  { name: "the ring", edges: "full", dots: "all" },
  { name: "the void", edges: [], dots: [] },
];

const SOLUTION = [3, 7, 1];
const HIDDEN_MESSAGE =
  "Assignment 1. Before you name what divides you, name what you share. Report back what you find.";

const CX = 40, CY = 40, R = 28;
function pt(cx, cy, angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
}
const ANGLES = Array.from({ length: 9 }, (_, i) => -90 + i * 40);
const POINTS = ANGLES.map((a) => pt(CX, CY, a, R));

function Glyph({ def, size = 64, active = false }) {
  const dotSet = def.dots === "all" ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : def.dots;
  const edgeList =
    def.edges === "full"
      ? Array.from({ length: 9 }, (_, i) => [i, (i + 1) % 9])
      : def.edges;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {POINTS.map((p, i) => {
        const next = POINTS[(i + 1) % 9];
        return (
          <line key={`o-${i}`} x1={p[0]} y1={p[1]} x2={next[0]} y2={next[1]} stroke="#3A3E75" strokeWidth="0.5" opacity="0.3" />
        );
      })}
      {edgeList.map(([a, b], i) => (
        <line key={`e-${i}`} x1={POINTS[a][0]} y1={POINTS[a][1]} x2={POINTS[b][0]} y2={POINTS[b][1]} stroke={active ? "#E8CFC0" : "#8B95F6"} strokeWidth="1.4" opacity="0.95" />
      ))}
      {POINTS.map((p, i) => {
        const isActive = dotSet.includes(i);
        return (
          <circle key={`d-${i}`} cx={p[0]} cy={p[1]} r={isActive ? 3 : 1.3} fill={!isActive ? "#3A3E75" : active ? "#E8CFC0" : "#B9C0FF"} />
        );
      })}
    </svg>
  );
}

function Ring({ index, onChange, disabled, locked }) {
  const glyph = GLYPHS[index];
  return (
    <div style={styles.ringCol}>
      <button style={{ ...styles.ringBtn, opacity: locked ? 0.25 : 1 }} disabled={disabled || locked} onClick={() => onChange((index + 1) % 9)} aria-label="Rotate ring up">▲</button>
      <div style={{ ...styles.ringWindow, ...(locked ? styles.ringWindowLocked : {}) }}>
        <Glyph def={glyph} size={72} active={locked} />
      </div>
      <button style={{ ...styles.ringBtn, opacity: locked ? 0.25 : 1 }} disabled={disabled || locked} onClick={() => onChange((index + 8) % 9)} aria-label="Rotate ring down">▼</button>
      <div style={{ ...styles.ringLabel, color: locked ? "#E8CFC0" : "#6E76B8" }}>
        {glyph.name}{locked ? " ✓" : ""}
      </div>
    </div>
  );
}

export default function Cryptex() {
  const [rings, setRings] = useState([0, 0, 0]);
  const [locked, setLocked] = useState([false, false, false]);
  const [status, setStatus] = useState("idle");

  const setRingIndex = useCallback((ringIdx, newVal) => {
    setRings((prev) => {
      const next = [...prev];
      next[ringIdx] = newVal;
      return next;
    });
  }, []);

  const attempt = () => {
    const newLocked = rings.map((v, i) => locked[i] || v === SOLUTION[i]);
    setLocked(newLocked);
    if (newLocked.every(Boolean)) {
      setStatus("open");
    } else if (!newLocked.some(Boolean)) {
      setStatus("shake");
      setTimeout(() => setStatus("idle"), 500);
    }
  };

  const reset = () => {
    setStatus("idle");
    setRings([0, 0, 0]);
    setLocked([false, false, false]);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cryptex-shake { animation: shakeX 0.4s ease; }
        .message-appear { animation: fadeUp 0.6s ease; }
      `}</style>

      <div style={styles.frame}>
        <div className={status === "shake" ? "cryptex-shake" : ""} style={styles.body}>
          <div style={styles.ringsRow}>
            {rings.map((val, i) => (
              <Ring key={i} index={val} disabled={status === "open"} locked={locked[i]} onChange={(newVal) => setRingIndex(i, newVal)} />
            ))}
          </div>

          {status === "open" ? (
            <div className="message-appear" style={styles.revealBox}>
              <div style={styles.revealLabel}>the seal opens</div>
              <div style={styles.revealText}>{HIDDEN_MESSAGE}</div>
              <a href="/transmission" style={styles.secretLink}>
                a second signal follows the first &rarr;
              </a>
            </div>
          ) : (
            <div style={styles.hintZone}>
              <div style={styles.hintText}>
                {locked.some(Boolean)
                  ? "Correct rings hold their place. Keep turning the rest."
                  : "Turn each ring. Find the order the mechanism accepts."}
              </div>
            </div>
          )}

          <div style={styles.actions}>
            {status === "open" ? (
              <button style={styles.actionBtn} onClick={reset}>Seal it again</button>
            ) : (
              <button style={styles.actionBtn} onClick={attempt}>Turn</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center" },
  frame: { width: "100%", maxWidth: 480 },
  body: { display: "flex", flexDirection: "column", alignItems: "center" },
  ringsRow: { display: "flex", gap: 18, justifyContent: "center", marginBottom: 20 },
  ringCol: { display: "flex", flexDirection: "column", alignItems: "center" },
  ringBtn: { background: "none", border: "1px solid #3A3E75", borderRadius: 3, color: "#8B95F6", fontSize: 11, width: 28, height: 20, cursor: "pointer", lineHeight: 1 },
  ringWindow: { background: "#0C0E28", border: "1px solid #4C5192", borderRadius: 3, padding: "10px 8px", margin: "6px 0" },
  ringWindowLocked: { border: "1px solid #E8CFC0", boxShadow: "0 0 12px rgba(232,207,192,0.35)" },
  ringLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#6E76B8", textAlign: "center", maxWidth: 76 },
  hintZone: { minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4px 10px 16px" },
  hintText: { fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#565B8F", fontStyle: "italic" },
  revealBox: { textAlign: "center", padding: "6px 8px 18px", maxWidth: 380 },
  revealLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#6E76B8", letterSpacing: "1px", marginBottom: 8 },
  revealText: { fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: 15, lineHeight: 1.6, color: "#E8CFC0" },
  secretLink: { display: "block", marginTop: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4C5192", textDecoration: "none", letterSpacing: "0.5px" },
  actions: { marginTop: 4 },
  actionBtn: { background: "none", border: "1px solid #3A3E75", borderRadius: 3, color: "#B9C0FF", fontFamily: "'Inter', sans-serif", fontSize: 13, padding: "9px 24px", cursor: "pointer" },
  hintLinkWrap: { marginTop: 16 },
  hintLink: { fontSize: 10, color: "#4C5192", cursor: "pointer", letterSpacing: "0.3px" },
};
