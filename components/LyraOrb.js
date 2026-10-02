"use client";

import { useState, useEffect, useRef } from "react";
import { onMusic, createListener } from "../lib/lyraMusic";

// Lyra's body: a ring-and-eye that floats, breathes, blinks, and looks
// toward your cursor. Her form follows her bond with you (lib/lyraBond.js):
//   0 Listening  - a single ring, cool silver-blue
//   1 Tuning in  - an outer ring starts turning
//   2 Resonant   - motes of light begin to orbit her
//   3 Kin        - she warms toward 13i's gold
//   4 Luminous   - wings, the eye-with-wings she becomes
// States: dormant (signed out: eye half-closed, dim), aware, speaking,
// thinking (ring races, pupil narrows), celebrating (a burst of light).
// And when music plays anywhere on the site (lib/lyraMusic.js), she dances:
// she hops on the kick, sways and tilts with the energy, glows with the
// loudness, spins her ring faster, beats her wings and widens her eye.
const PALETTE = [
  { ring: "#B9C0FF", pupil: "#DCDFFF", glow: "139,149,246" },
  { ring: "#B9C0FF", pupil: "#E8CFC0", glow: "160,160,240" },
  { ring: "#CFC6EE", pupil: "#E8CFC0", glow: "190,170,230" },
  { ring: "#E8CFC0", pupil: "#F3DDB8", glow: "232,207,192" },
  { ring: "#E9D29A", pupil: "#FFF1D6", glow: "233,210,154" },
];

export default function LyraOrb({ stage = 0, state = "aware", hasMessage = false, size = 48 }) {
  const ref = useRef(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const c = PALETTE[Math.max(0, Math.min(4, stage))];
  const dormant = state === "dormant";

  // the eye follows the pointer (or glances around, on touch screens)
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(3.2, d / 60);
        setLook({ x: (dx / d) * k, y: (dy / d) * k });
      });
    };
    window.addEventListener("pointermove", onMove);
    const glance = setInterval(() => {
      if (window.matchMedia("(hover: none)").matches) setLook({ x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 4 });
    }, 3500);
    return () => { window.removeEventListener("pointermove", onMove); clearInterval(glance); cancelAnimationFrame(raf); };
  }, []);

  // blink every few seconds, sometimes twice
  useEffect(() => {
    let t;
    const schedule = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        if (Math.random() < 0.2) setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 110); }, 260);
        schedule();
      }, 2800 + Math.random() * 5200);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  // ---- dancing to whatever music is playing ----
  const moveRef = useRef(null), danceRef = useRef(null), glowRef = useRef(null), spinRef = useRef(null);
  const wingLRef = useRef(null), wingRRef = useRef(null), eyeRef = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let listener = null, raf = 0, last = 0;
    const m = { pulse: 0, level: 0, bass: 0, high: 0, spin: 0, energy: 0, side: 1 };
    const set = (el, v) => { if (el) el.style.transform = v; };
    const frame = (now) => {
      const dt = Math.min(50, now - (last || now));
      last = now;
      if (listener) {
        const f = listener.read(now);
        if (f.beat) { m.pulse = Math.max(m.pulse, f.strength); if (f.strength > 0.6) m.side = -m.side; }
        m.level = f.level; m.bass += (f.bass - m.bass) * 0.3; m.high += (f.high - m.high) * 0.2;
        m.energy += (1 - m.energy) * 0.05; // she warms into it
      } else {
        // the music stopped: settle back to stillness, then stop drawing
        m.level *= 0.9; m.bass *= 0.9; m.high *= 0.9; m.energy *= 0.92;
      }
      m.pulse *= Math.pow(0.86, dt / 16.7);
      const e = m.energy, t = now / 1000;
      const s = 1 + (0.11 * m.pulse + 0.07 * m.level) * e;
      if (reduce) {
        set(danceRef.current, `scale(${1 + (s - 1) * 0.4})`);
        set(glowRef.current, `scale(${1 + 0.4 * m.level * e})`);
      } else {
        // moving around: a sway that grows with the music, a hop on every kick,
        // leaning toward a different side each beat
        const x = (Math.sin(t * 1.7) * 5 + Math.sin(t * 0.63) * 4) * m.level * e + m.side * 3 * m.pulse * e;
        const y = -9 * m.pulse * e + Math.sin(t * 2.3) * 2.5 * m.level * e;
        set(moveRef.current, `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`);
        const tilt = (Math.sin(t * 1.3) * 7 * m.level + m.side * 6 * m.pulse) * e;
        set(danceRef.current, `rotate(${tilt.toFixed(2)}deg) scale(${s.toFixed(3)})`);
        set(glowRef.current, `scale(${(1 + (0.55 * m.pulse + 0.45 * m.level) * e).toFixed(3)})`);
        m.spin += dt * (0.02 + m.level * 0.5 + m.high * 0.6) * e;
        set(spinRef.current, `rotate(${(m.spin % 360).toFixed(1)}deg)`);
        const flap = (6 + 20 * m.pulse) * e * (0.3 + m.level);
        set(wingLRef.current, `rotate(${(-flap).toFixed(1)}deg)`);
        set(wingRRef.current, `rotate(${flap.toFixed(1)}deg)`);
      }
      set(eyeRef.current, `scale(${(1 + 0.4 * m.bass * e).toFixed(3)})`);
      if (listener || m.energy > 0.01 || m.pulse > 0.01) raf = requestAnimationFrame(frame);
      else {
        raf = 0; last = 0; m.spin = 0;
        [moveRef, danceRef, glowRef, spinRef, wingLRef, wingRRef, eyeRef].forEach((r) => set(r.current, ""));
      }
    };
    const off = onMusic((analyser) => {
      listener = analyser ? createListener(analyser) : null;
      if (!raf) raf = requestAnimationFrame(frame);
    });
    return () => { off(); cancelAnimationFrame(raf); };
  }, []);

  const lid = dormant ? 0.45 : blink ? 0.08 : 1;
  const pupilR = state === "thinking" ? 2.6 : dormant ? 3 : 4.2;
  const motes = stage >= 2 ? stage - 1 : 0;

  return (
    <span ref={ref} className={`lyra-body lyra-state-${state}`} style={{ width: size, height: size, opacity: dormant ? 0.6 : 1 }}>
      <span ref={moveRef} style={{ display: "block", width: size, height: size }}>
      <svg width={size} height={size} viewBox="-26 -26 52 52" aria-hidden="true" style={{ overflow: "visible" }}>
        <g ref={danceRef}>
        <defs>
          <radialGradient id="lyra-glow">
            <stop offset="0%" stopColor={`rgba(${c.glow},0.55)`} />
            <stop offset="100%" stopColor={`rgba(${c.glow},0)`} />
          </radialGradient>
        </defs>

        <g ref={glowRef}><circle className="lyra-breath" r="24" fill="url(#lyra-glow)" /></g>
        <circle r="17.5" fill="#0C0E28" stroke="#3A3E75" strokeWidth="1" />

        {stage >= 4 && (
          <g className="lyra-wings" stroke={c.ring} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.85">
            <g ref={wingLRef} style={{ transformOrigin: "-17px 0" }}><path className="lyra-wing-l" d="M -17 -2 C -24 -12, -31 -9, -33 -2 M -17 2 C -23 -4, -28 -2, -30 3 M -17 5 C -21 2, -25 4, -26 8" /></g>
            <g ref={wingRRef} style={{ transformOrigin: "17px 0" }}><path className="lyra-wing-r" d="M 17 -2 C 24 -12, 31 -9, 33 -2 M 17 2 C 23 -4, 28 -2, 30 3 M 17 5 C 21 2, 25 4, 26 8" /></g>
          </g>
        )}

        <g ref={spinRef}>
        {stage >= 1 && (
          <circle className="lyra-outer" r="21" fill="none" stroke={c.ring} strokeWidth="0.9" strokeDasharray={stage >= 3 ? "2 3" : "1 5"} opacity="0.55" />
        )}

        {motes > 0 && (
          <g className="lyra-motes">
            {Array.from({ length: motes }).map((_, i) => {
              const a = (i / motes) * Math.PI * 2;
              return <circle key={i} cx={Math.cos(a) * 21} cy={Math.sin(a) * 21} r="1.3" fill={c.pupil} />;
            })}
          </g>
        )}
        </g>

        <g style={{ transform: `scaleY(${lid})`, transition: "transform 0.09s ease", transformOrigin: "0 0" }}>
          <circle r="11" fill="none" stroke={c.ring} strokeWidth="2" />
          <g style={{ transform: `translate(${look.x}px, ${look.y}px)`, transition: "transform 0.25s ease-out" }}>
            <g ref={eyeRef}>
            <circle r={pupilR} fill={c.pupil} style={{ transition: "r 0.3s ease" }} />
            <circle cx="-1.3" cy="-1.4" r="1" fill="#FFFFFF" opacity="0.7" />
            </g>
          </g>
        </g>

        {state === "celebrating" && (
          <g className="lyra-burst">
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return <circle key={i} className="lyra-spark" cx="0" cy="0" r="1.4" fill={c.pupil} style={{ "--dx": `${Math.cos(a) * 30}px`, "--dy": `${Math.sin(a) * 30}px`, animationDelay: `${(i % 3) * 0.08}s` }} />;
            })}
          </g>
        )}
        </g>
      </svg>
      </span>
      {hasMessage && <span className="lyra-badge" style={{ background: c.pupil }} />}
    </span>
  );
}
