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

const SOLUTION = [3, 7, 1];
const HIDDEN_MESSAGE =
  "Assignment 1. Before you name what divides you, name what you share. Report back what you find.";

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
  const [rots, setRots] = useState([0, 0, 0]);
  const [locked, setLocked] = useState([false, false, false]);
  const [status, setStatus] = useState("idle"); // idle | shake | open
  const [mute, setMute] = useState(false);
  useEffect(() => { setMute(isMuted()); }, []);

  const turn = useCallback((i, d) => {
    setRots((prev) => {
      const next = [...prev];
      next[i] = prev[i] + d;
      alienClick(mod9(next[i]), i);
      return next;
    });
  }, []);

  const engage = () => {
    const now = rots.map((r, i) => locked[i] || mod9(r) === SOLUTION[i]);
    const fresh = now.map((v, i) => v && !locked[i]);
    setLocked(now);
    if (now.every(Boolean)) {
      setTimeout(() => alienOpen(), 200);
      setStatus("open");
    } else if (fresh.some(Boolean)) {
      fresh.forEach((v, i) => v && setTimeout(() => alienLock(i), i * 160));
    } else {
      alienDeny();
      setStatus("shake");
      setTimeout(() => setStatus("idle"), 500);
    }
  };

  const reset = () => { setStatus("idle"); setRots([0, 0, 0]); setLocked([false, false, false]); };
  const open = status === "open";

  return (
    <div className="cx">
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
            <a href="/transmission" className="mono cx-secret">a second signal follows the first &rarr;</a>
          </div>
        ) : (
          <p className="cx-hint">
            {locked.some(Boolean)
              ? "Held marks stay in place. Keep turning the rest."
              : "Turn each drum. Find the order the mechanism accepts, then engage."}
          </p>
        )}
        <div className="cx-actions">
          {open ? (
            <button className="cx-btn" onClick={reset}>Seal it again</button>
          ) : (
            <button className="cx-btn cx-engage" onClick={engage}>Engage</button>
          )}
          <button className="mono cx-mute" onClick={() => { setMuted(!mute); setMute(!mute); }} aria-pressed={mute}>{mute ? "sound off" : "sound on"}</button>
        </div>
      </div>
    </div>
  );
}
