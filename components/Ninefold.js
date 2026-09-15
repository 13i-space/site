"use client";

import React, { useState, useRef, useCallback } from "react";

// Nine "sides", each with three possible readings depending on where the
// top dial lands - 9 x 3 = 27 total responses. The dial's three positions
// are never labeled on screen; which one means what is something a
// visitor has to notice for themselves after a few pulls.
//
// dialIndex 0 / 1 / 2 map to Yes / Neutral / No, in that fixed order,
// every time - the mapping never changes, it's just never printed.
const RESPONSES = [
  { yes: "It is certain. We have seen this pattern complete before.", neutral: "The pattern has not finished. Ask again when it has.", no: "It is certain that this will not happen." },
  { yes: "Without a doubt.", neutral: "We are watching, but the signal is still weak.", no: "Without a doubt, no." },
  { yes: "You may rely on this.", neutral: "We would rather not say yet.", no: "Do not rely on this." },
  { yes: "As we see it, yes.", neutral: "From here, it could still go either way.", no: "As we see it, no." },
  { yes: "Likely. Very likely.", neutral: "Concentrate, and ask again.", no: "Unlikely. Very unlikely." },
  { yes: "The outlook is good.", neutral: "The outlook is hazy from here.", no: "The outlook is not good." },
  { yes: "Yes.", neutral: "We cannot predict this one yet.", no: "No." },
  { yes: "The signs point to yes.", neutral: "The signs are not clear enough to read.", no: "Our sources say no." },
  { yes: "Of the paths we see, this is the one you are already choosing.", neutral: "We see two paths, and neither is decided yet.", no: "Of the paths we see, this is not the one." },
];
const DIAL_KEYS = ["yes", "neutral", "no"];

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
function gpt(angleDeg, radius, cx = GCX, cy = GCY) {
  const rad = (angleDeg * Math.PI) / 180;
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
}
const GANGLES = Array.from({ length: 9 }, (_, i) => -90 + i * 40);
const GPOINTS = GANGLES.map((a) => gpt(a, GR));

function GlyphIcon({ index, glow }) {
  const def = GLYPH_DEFS[index];
  const dotSet = def.dots === "all" ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : def.dots;
  const edgeList = def.edges === "full" ? Array.from({ length: 9 }, (_, i) => [i, (i + 1) % 9]) : def.edges;
  return (
    <svg width={52} height={52} viewBox="0 0 60 60">
      {edgeList.map(([a, b], i) => (
        <line key={i} x1={GPOINTS[a][0]} y1={GPOINTS[a][1]} x2={GPOINTS[b][0]} y2={GPOINTS[b][1]} stroke={glow ? "#E8CFC0" : "#6E76B8"} strokeWidth="1.3" opacity="0.9" />
      ))}
      {GPOINTS.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={dotSet.includes(i) ? 2.4 : 1} fill={dotSet.includes(i) ? (glow ? "#E8CFC0" : "#8B95F6") : "#3A3E75"} />
      ))}
    </svg>
  );
}

// The card's visual width is purely cosmetic now (it no longer factors
// into the drum's geometry) so it's set responsively below, up close to
// the full width of the viewing window.
const FACE_W_CSS = "min(300px, 72vw)";
const FACE_H = 150;
// For a drum spinning around a horizontal (up/down) axis, the relevant
// "chord" dimension for the radius is the face's HEIGHT, not its width -
// this was flipped before, which is what made the drum look off.
const RADIUS = Math.round(FACE_H / 2 / Math.tan(Math.PI / 9));
const STEP = 360 / 9;
const DIAL_STEP = 360 / 3;
const LIGHT_COUNT = 7;
const SPIN_MS = 3800;

// A short synthesized "reel" sound so nothing here depends on an audio
// file or a third-party sound library - just the Web Audio API already
// built into the browser.
function playSpinSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    let elapsed = 0;
    const tickCount = 34;
    for (let i = 0; i < tickCount; i++) {
      const progress = i / tickCount;
      const gap = 0.028 + progress * progress * 0.24; // ticks spread out as the spin slows
      elapsed += gap;
      const t = now + elapsed;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 480 - progress * 220;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.13, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    }
    // a soft low "thunk" as it lands
    const thunk = ctx.createOscillator();
    const thunkGain = ctx.createGain();
    thunk.type = "sine";
    thunk.frequency.value = 90;
    const landTime = now + elapsed + 0.05;
    thunkGain.gain.setValueAtTime(0.0001, landTime);
    thunkGain.gain.exponentialRampToValueAtTime(0.2, landTime + 0.01);
    thunkGain.gain.exponentialRampToValueAtTime(0.0001, landTime + 0.25);
    thunk.connect(thunkGain).connect(ctx.destination);
    thunk.start(landTime);
    thunk.stop(landTime + 0.3);

    setTimeout(() => ctx.close(), (elapsed + 0.6) * 1000);
  } catch (e) {
    // sound is a nice-to-have, never block the game over it
  }
}

export default function Ninefold() {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState("idle"); // idle -> spinning -> revealed
  const [finalFace, setFinalFace] = useState(null);
  const [finalDial, setFinalDial] = useState(null);
  const [spinAmount, setSpinAmount] = useState(0);
  const [dialSpinAmount, setDialSpinAmount] = useState(0);
  const timeoutsRef = useRef([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const spin = useCallback(() => {
    if (phase === "spinning") return;
    clearTimers();
    setFinalFace(null);
    setFinalDial(null);
    setPhase("spinning");
    playSpinSound();

    const chosenFace = Math.floor(Math.random() * 9);
    const chosenDial = Math.floor(Math.random() * 3);
    const extraSpins = 4 + Math.floor(Math.random() * 2);
    const extraDialSpins = 3 + Math.floor(Math.random() * 2);

    const base = Math.ceil(spinAmount / 360) * 360 + extraSpins * 360;
    setSpinAmount(base - chosenFace * STEP);

    const dialBase = Math.ceil(dialSpinAmount / 360) * 360 + extraDialSpins * 360;
    setDialSpinAmount(dialBase - chosenDial * DIAL_STEP);

    const t = setTimeout(() => {
      setFinalFace(chosenFace);
      setFinalDial(chosenDial);
      setPhase("revealed");
    }, SPIN_MS);
    timeoutsRef.current.push(t);
  }, [phase, spinAmount, dialSpinAmount]);

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setFinalFace(null);
    setFinalDial(null);
    setQuestion("");
  };

  const isSpinning = phase === "spinning";
  const revealedText =
    phase === "revealed" && finalFace !== null && finalDial !== null
      ? RESPONSES[finalFace][DIAL_KEYS[finalDial]]
      : null;

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
        .die-group, .dial-needle {
          transition: transform ${SPIN_MS / 1000}s cubic-bezier(0.15, 0.7, 0.1, 1);
        }
        .answer-text { animation: fadeUp 0.5s ease; }
        .cabinet-light { animation: lightChase 0.9s ease-in-out infinite; }
        .cabinet-light.idle { animation: none; opacity: 0.35; }
      `}</style>

      <div style={styles.frame}>
        {/* --- Cabinet --- */}
        <div style={styles.cabinet}>
          <TopDial rotation={dialSpinAmount} />

          <div style={styles.marquee}>
            <span className="mono" style={styles.marqueeText}>THE NINEFOLD</span>
          </div>

          <div style={styles.cabinetBody}>
            <LightColumn active={isSpinning} />

            <div style={styles.window}>
              <div style={styles.windowGlass} />
              <div style={styles.scene}>
                <div style={styles.dieGroupOuter}>
                  <div
                    className="die-group"
                    style={{
                      ...styles.dieGroup,
                      transform: `rotateY(-4deg) rotateX(${spinAmount}deg)`,
                    }}
                  >
                    {RESPONSES.map((_, i) => {
                      const isFront = phase === "revealed" && finalFace === i;
                      return (
                        <div
                          key={i}
                          style={{
                            ...styles.face,
                            transform: `rotateX(${i * STEP}deg) translateZ(${RADIUS}px)`,
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

            <LightColumn active={isSpinning} />
          </div>
        </div>

        {/* --- Answer / status --- */}
        <div style={styles.answerZone}>
          {revealedText ? (
            <div className="answer-text" style={styles.answerText}>
              {revealedText}
            </div>
          ) : isSpinning ? (
            <div style={styles.shufflingText}>...</div>
          ) : (
            <div style={styles.hint}>
              Ask a yes-or-no question. Pull the lever - the wheel and the
              dial up top both spin to answer.
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
            style={{ ...styles.actionBtn, opacity: isSpinning ? 0.4 : 1 }}
          >
            {phase === "revealed" ? "Pull again" : "Pull"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Three static marker dots on a small ring, plus one needle that spins
// and settles pointing at one of them. Which marker "means" what is
// intentionally never labeled.
function TopDial({ rotation }) {
  const cx = 30, cy = 30, markerR = 20, needleLen = 17;
  const markerAngles = [-90, 30, 150]; // evenly spaced, arbitrary starting orientation
  const markerPoints = markerAngles.map((a) => gpt(a, markerR, cx, cy));

  return (
    <div style={styles.dialWrap}>
      <svg width={60} height={60} viewBox="0 0 60 60">
        <circle cx={cx} cy={cy} r={markerR + 4} fill="none" stroke="#262A55" strokeWidth="1" />
        {markerPoints.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={4.5} fill="#1C1F48" stroke="#8B95F6" strokeWidth="1.4" />
        ))}
        <g className="dial-needle" style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - needleLen} stroke="#E8CFC0" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={3} fill="#E8CFC0" />
        </g>
      </svg>
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
  frame: { width: "100%", maxWidth: 480 },

  cabinet: {
    position: "relative",
    background: "linear-gradient(180deg, #1C1F48 0%, #0C0E28 100%)",
    border: "1px solid #3A3E75",
    borderRadius: "120px 120px 10px 10px",
    padding: "18px 16px 20px",
    marginBottom: 8,
  },
  dialWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 4,
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
    minHeight: 300,
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
  dieGroup: { position: "relative", width: FACE_W_CSS, height: FACE_H, transformStyle: "preserve-3d" },
  face: {
    position: "absolute",
    width: FACE_W_CSS,
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
