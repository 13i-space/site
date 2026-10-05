"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { alienClick, alienLock, alienDeny, alienOpen, isMuted, setMuted } from "../lib/alienSound";

// The Cryptex (Update 5.58, rebuilt as an alien device). Same puzzle as
// before - three rings of nine marks, one order the mechanism accepts,
// and the same message and second signal behind it - in a new body:
//   - a 3D cylinder whose three drums really turn (CSS 3D), each face one mark
//   - turn by dragging a drum, scrolling over it, the arrow buttons, or the
//     keyboard (focus a drum: up / down)
//   - every step makes an alien click (lib/alienSound.js, made live)
//   - ENGAGE checks the order: right drums lock with a chord and stay put
//   - solved, the cylinder splits and the message decrypts out of glyphs

const GLYPHS = [
  { name: "the seed", edges: [], dots: [0] },
  { name: "the pair", edges: [[0, 1]], dots: [0, 1] },
  { name: "the reach", edges: [[0, 2]], dots: [0, 2] },
  { name: "the triad", edges: [[0, 3], [3, 6], [6, 0]], dots: [0, 3, 6] },
  { name: "the span", edges: [[0, 4]], dots: [0, 4] },
  { name: "the cross", edges: [[0, 4], [2, 6]], dots: [0, 2, 4, 6] },
  { name: "the weave", edges: [[0, 3], [3, 6], [6, 0], [1, 4], [4, 7], [7, 1]], dots: [0, 1, 3, 4, 6, 7] },
  { name: "the ring", edges: "full", dots: "all" },
  { name: "the void", edges: [], dots: [] },
];

// Three levels (Update 5.59). Level 1 is the original: a fixed order, and
// right drums are held. Level 2: a new order each time, and ENGAGE only
// says how many marks are right, not which. Level 3: a new order, no hints
// at all - just open or not - and a RANDOMIZE button to spin all three.
const LEVELS = {
  1: { name: "Level 1", note: "Right marks are held in place.", solution: [3, 7, 1],
    message: "Assignment 1. Before you name what divides you, name what you share. Report back what you find." },
  2: { name: "Level 2", note: "The mechanism only says how many marks are right. Not which.",
    message: "Second seal. We did not leave these for the clever. We left them for the patient. You are both." },
  3: { name: "Level 3", note: "No hints. Open, or not. Spin it as often as you like.",
    message: "Third seal. Seven hundred and twenty-nine ways in, one way through. Some things are found by luck. We have always counted luck as a kind of attention." },
};
const SOLVED_KEY = "13i_cryptex_solved";
const randomOrder = () => [0, 1, 2].map(() => Math.floor(Math.random() * 9));

const CX = 40, CY = 40, R = 28;
const POINTS = Array.from({ length: 9 }, (_, i) => {
  const a = ((-90 + i * 40) * Math.PI) / 180;
  return [CX + R * Math.cos(a), CY + R * Math.sin(a)];
});

function Glyph({ def, size = 64, lit = false }) {
  const dotSet = def.dots === "all" ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : def.dots;
  const edgeList = def.edges === "full" ? Array.from({ length: 9 }, (_, i) => [i, (i + 1) % 9]) : def.edges;
  const col = lit ? "#FFE7B0" : "#7FF0E0";
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      {POINTS.map((p, i) => {
        const n = POINTS[(i + 1) % 9];
        return <line key={`o${i}`} x1={p[0]} y1={p[1]} x2={n[0]} y2={n[1]} stroke={col} strokeWidth="0.5" opacity="0.18" />;
      })}
      {edgeList.map(([a, b], i) => (
        <line key={`e${i}`} x1={POINTS[a][0]} y1={POINTS[a][1]} x2={POINTS[b][0]} y2={POINTS[b][1]} stroke={col} strokeWidth="2" strokeLinecap="round" />
      ))}
      {POINTS.map((p, i) => (
        <circle key={`d${i}`} cx={p[0]} cy={p[1]} r={dotSet.includes(i) ? 3.4 : 1.2} fill={col} opacity={dotSet.includes(i) ? 1 : 0.3} />
      ))}
    </svg>
  );
}

const mod9 = (n) => ((n % 9) + 9) % 9;

function Drum({ i, rot, locked, open, onTurn }) {
  const drag = useRef(null);
  const idx = mod9(rot);
  const onPointerDown = (e) => {
    if (locked || open) return;
    drag.current = { y: e.clientY, acc: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const dy = e.clientY - drag.current.y;
    if (Math.abs(dy) >= 28) { onTurn(dy > 0 ? -1 : 1); drag.current.y = e.clientY; }
  };
  const end = () => { drag.current = null; };
  const onWheel = (e) => { if (locked || open) return; e.preventDefault(); onTurn(e.deltaY > 0 ? 1 : -1); };
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });
  return (
    <div className={`cx-drum-wrap ${locked ? "cx-locked" : ""}`}>
      <button className="cx-arrow" disabled={locked || open} onClick={() => onTurn(-1)} aria-label={`Turn ring ${i + 1} up`}>&#9650;</button>
      <div
        ref={ref}
        className="cx-drum-window"
        tabIndex={locked || open ? -1 : 0}
        role="spinbutton"
        aria-label={`Ring ${i + 1}: ${GLYPHS[idx].name}`}
        aria-valuenow={idx}
        onKeyDown={(e) => { if (e.key === "ArrowUp") { e.preventDefault(); onTurn(-1); } if (e.key === "ArrowDown") { e.preventDefault(); onTurn(1); } }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={end} onPointerCancel={end}
      >
        <div className="cx-drum" style={{ transform: `translateZ(-102px) rotateX(${rot * 40}deg)` }}>
          {GLYPHS.map((g, k) => (
            <div key={k} className={`cx-face ${k === idx ? "cx-face-on" : ""}`} style={{ transform: `rotateX(${-k * 40}deg) translateZ(102px)` }}>
              <Glyph def={g} size={58} lit={locked && k === idx} />
            </div>
          ))}
        </div>
        <div className="cx-glass" aria-hidden="true" />
      </div>
      <button className="cx-arrow" disabled={locked || open} onClick={() => onTurn(1)} aria-label={`Turn ring ${i + 1} down`}>&#9660;</button>
      <div className="mono cx-name">{GLYPHS[idx].name}{locked ? " · held" : ""}</div>
    </div>
  );
}

// the message, decrypting out of alien marks
const NOISE = "∴∵∷⁘⁙⁛⁜⸪⸫⸬⸭◌◍◐◑⦁⦿";
function Decrypt({ text }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let f = 0, raf = 0;
    const tick = () => {
      f += 1;
      const done = Math.floor(f / 1.4);
      setShown(text.split("").map((ch, k) => (k < done || ch === " " ? ch : NOISE[Math.floor(Math.random() * NOISE.length)])).join(""));
      if (done < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return <span>{shown}</span>;
}

export default function Cryptex() {
  const [level, setLevel] = useState(1);
  const [solution, setSolution] = useState(LEVELS[1].solution);
  const [rots, setRots] = useState([0, 0, 0]);
  const [locked, setLocked] = useState([false, false, false]);
  const [status, setStatus] = useState("idle"); // idle | shake | open
  const [count, setCount] = useState(null); // level 2: how many were right
  const [tries, setTries] = useState(0);
  const [solved, setSolved] = useState({});
  const [mute, setMute] = useState(false);
  useEffect(() => {
    setMute(isMuted());
    try { setSolved(JSON.parse(localStorage.getItem(SOLVED_KEY) || "{}")); } catch (e) { /* no storage */ }
  }, []);
  const HIDDEN_MESSAGE = LEVELS[level].message;

  const choose = (n) => {
    setLevel(n);
    setSolution(n === 1 ? LEVELS[1].solution : randomOrder());
    setRots([0, 0, 0]); setLocked([false, false, false]); setStatus("idle"); setCount(null); setTries(0);
  };
  const randomize = () => {
    const to = randomOrder();
    setRots((prev) => prev.map((r, i) => r + 9 + ((to[i] - mod9(r) + 9) % 9)));
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((k) => setTimeout(() => alienClick(k, k % 3), k * 45));
    setCount(null);
  };

  const turn = useCallback((i, d) => {
    setRots((prev) => {
      const next = [...prev];
      next[i] = prev[i] + d;
      alienClick(mod9(next[i]), i);
      return next;
    });
  }, []);

  const win = () => {
    setTimeout(() => alienOpen(), 200);
    setStatus("open");
    setSolved((s0) => { const s1 = { ...s0, [level]: true }; try { localStorage.setItem(SOLVED_KEY, JSON.stringify(s1)); } catch (e) { /* ignore */ } return s1; });
  };
  const engage = () => {
    setTries((t) => t + 1);
    const right = rots.map((r, i) => mod9(r) === solution[i]);
    if (level > 1) {
      if (right.every(Boolean)) { setLocked([true, true, true]); win(); return; }
      if (level === 2) {
        const n = right.filter(Boolean).length;
        setCount(n);
        if (n) alienLock(n - 1); else alienDeny();
      } else alienDeny();
      setStatus("shake");
      setTimeout(() => setStatus("idle"), 500);
      return;
    }
    const now = rots.map((r, i) => locked[i] || right[i]);
    const fresh = now.map((v, i) => v && !locked[i]);
    setLocked(now);
    if (now.every(Boolean)) {
      win();
    } else if (fresh.some(Boolean)) {
      fresh.forEach((v, i) => v && setTimeout(() => alienLock(i), i * 160));
    } else {
      alienDeny();
      setStatus("shake");
      setTimeout(() => setStatus("idle"), 500);
    }
  };

  const reset = () => choose(level);
  const open = status === "open";

  return (
    <div className="cx">
      <div className="cx-levels" role="radiogroup" aria-label="Difficulty">
        {[1, 2, 3].map((n) => (
          <button key={n} role="radio" aria-checked={level === n} className={`mono ${level === n ? "cx-level-on" : ""}`} onClick={() => choose(n)}>
            {LEVELS[n].name}{solved[n] ? " \u2726" : ""}
          </button>
        ))}
      </div>
      <p className="mono cx-level-note">{LEVELS[level].note}</p>
      <div className={`cx-device ${status === "shake" ? "cx-shake" : ""} ${open ? "cx-open" : ""}`}>
        <div className="cx-cap cx-cap-l" aria-hidden="true"><span className="cx-core" /></div>
        <div className="cx-body">
          <div className="cx-circuit" aria-hidden="true" />
          <div className="cx-drums">
            {rots.map((r, i) => <Drum key={i} i={i} rot={r} locked={locked[i]} open={open} onTurn={(d) => turn(i, d)} />)}
          </div>
          {open && <div className="cx-beam" aria-hidden="true" />}
        </div>
        <div className="cx-cap cx-cap-r" aria-hidden="true"><span className="cx-core" /></div>
      </div>

      <div className="cx-readout">
        {open ? (
          <div className="cx-message">
            <div className="mono cx-label">the seal opens &middot; translation follows</div>
            <p><Decrypt text={HIDDEN_MESSAGE} /></p>
            {level === 1 ? (
              <a href="/transmission" className="mono cx-secret">a second signal follows the first &rarr;</a>
            ) : (
              <span className="mono cx-secret">opened in {tries} {tries === 1 ? "try" : "tries"}{level < 3 ? <> &middot; <button className="cx-linkbtn" onClick={() => choose(level + 1)}>try level {level + 1} &rarr;</button></> : null}</span>
            )}
          </div>
        ) : (
          <p className="cx-hint">
            {level === 1 && (locked.some(Boolean)
              ? "Held marks stay in place. Keep turning the rest."
              : "Turn each drum. Find the order the mechanism accepts, then engage.")}
            {level === 2 && (count === null ? "Set the drums, then engage. It will tell you how many marks it accepts." : `${count} of 3 marks accepted. It will not say which. (try ${tries})`)}
            {level === 3 && (tries ? `Refused. Try ${tries}. Turn them, or let chance turn them for you.` : "No hints. Turn the drums yourself, or randomize as often as you like.")}
          </p>
        )}
        <div className="cx-actions">
          {open ? (
            <button className="cx-btn" onClick={reset}>Seal it again</button>
          ) : (
            <>
              {level === 3 && <button className="cx-btn cx-random" onClick={randomize}>Randomize</button>}
              <button className="cx-btn cx-engage" onClick={engage}>Engage</button>
            </>
          )}
          <button className="mono cx-mute" onClick={() => { setMuted(!mute); setMute(!mute); }} aria-pressed={mute}>{mute ? "sound off" : "sound on"}</button>
        </div>
      </div>
    </div>
  );
}
