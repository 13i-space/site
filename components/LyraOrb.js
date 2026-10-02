"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { onMusic, createListener, isReading } from "../lib/lyraMusic";
import { onPlayerTwo, playerTwo, playerTwoEnd } from "../lib/lyraAssist";

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
// And when Lyra Assist is on in a game (lib/lyraAssist.js), she is player
// two: her eye locks onto her character, her ring races, a thread of light
// runs from her to it, and she flares each time it fires.
// In the Oracle's chamber (state "deferring") she withdraws: smaller, dim,
// eye lowered toward the chamber. 13i is speaking, not her. She glances up
// as each answer arrives (the "13i:oracle" event), then settles back.
// Reading (Update 5.48): while a story or chapter is open she leans toward
// the page and dims; her eye flicks back on each page turn and she
// brightens at a new chapter ("13i:reading"). With narration playing she
// listens - ring and glow pulse with the voice, no dancing. In an
// Interactive Story she feels each choice and each ending ("13i:story"),
// and "13i:lyra-look" points her eye at something for a moment.
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
  const deferring = state === "deferring";
  const deferringRef = useRef(false);
  deferringRef.current = deferring;
  const [oracle, setOracle] = useState(null); // null | "asking" | "answer"
  useEffect(() => {
    let t;
    const on = (e) => {
      const ph = e.detail && e.detail.phase;
      setOracle(ph || null);
      clearTimeout(t);
      if (ph === "answer") t = setTimeout(() => setOracle(null), 2600);
    };
    window.addEventListener("13i:oracle", on);
    return () => { window.removeEventListener("13i:oracle", on); clearTimeout(t); };
  }, []);
  const glancing = deferring && !!oracle;

  // ---- reading and stories ----
  const [reading, setReading] = useState(false);
  const [react, setReact] = useState(null); // a passing reaction (class lyra-react-*)
  const [lookAt, setLookAt] = useState(null); // { x, y } - something she's been pointed at
  const [privateMode, setPrivate] = useState(false); // you're writing a private message
  useEffect(() => {
    let rt, lt;
    setReading(isReading()); // a page may have opened before she did
    const flash = (name, ms) => { setReact(name); clearTimeout(rt); rt = setTimeout(() => setReact(null), ms); };
    const onReading = (e) => {
      const ph = e.detail && e.detail.phase;
      if (ph === "open" || ph === "close") setReading(isReading());
      else if (ph === "turn") flash("turn", 600);
      else if (ph === "chapter") flash("chapter", 1800);
    };
    const STORY = { INTERVENE: ["flinch", 700], OBSERVE: ["nod", 1500], COMMUNICATE: ["lean", 1700], ANALYZE: ["analyze", 1500] };
    const onStory = (e) => {
      const d = e.detail || {};
      if (d.ending) flash(d.ending === "canon" ? "recognize" : "curious", d.ending === "canon" ? 3200 : 2600);
      else if (STORY[d.tag]) flash(...STORY[d.tag]);
    };
    const onLook = (e) => {
      const d = e.detail || {};
      setLookAt({ x: d.x, y: d.y });
      clearTimeout(lt);
      lt = setTimeout(() => setLookAt(null), d.ms || 1500);
    };
    const TIMES = { notice: 1300, wow: 1700, warm: 3200, watchful: 3000, subdued: 3200, sway: 2200, flinch: 700, droop: 3200, celebrate: 2600, wave: 1800, spin: 1100, proud: 3000, curious: 2600 };
    const onPrivacy = (e) => setPrivate(!!(e.detail && e.detail.on));
    window.addEventListener("13i:lyra-privacy", onPrivacy);
    const onReact = (e) => { const n = e.detail && e.detail.react; if (TIMES[n]) flash(n, TIMES[n]); };
    window.addEventListener("13i:lyra", onReact);
    window.addEventListener("13i:reading", onReading);
    window.addEventListener("13i:story", onStory);
    window.addEventListener("13i:lyra-look", onLook);
    return () => {
      window.removeEventListener("13i:lyra", onReact);
      window.removeEventListener("13i:lyra-privacy", onPrivacy);
      window.removeEventListener("13i:reading", onReading);
      window.removeEventListener("13i:story", onStory);
      window.removeEventListener("13i:lyra-look", onLook);
      clearTimeout(rt); clearTimeout(lt);
    };
  }, []);
  // reading posture only while she's idle (not when her panel is open)
  const readingNow = reading && (state === "aware" || state === "dormant");
  // a point she's been asked to look at, as an eye offset
  const lookAtVec = (() => {
    if (!lookAt || !ref.current) return null;
    const r = ref.current.getBoundingClientRect();
    const dx = lookAt.x - (r.left + r.width / 2), dy = lookAt.y - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1;
    return { x: (dx / d) * 3.4, y: (dy / d) * 3.4 };
  })();
  const [blink, setBlink] = useState(false);
  const c = PALETTE[Math.max(0, Math.min(4, stage))];
  const dormant = state === "dormant";

  // the eye follows the pointer (or glances around, on touch screens)
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const onMove = (e) => {
      if (playerTwo().active) return; // she's busy watching her own character
      if (deferringRef.current) return; // in the Oracle's chamber her eyes stay on 13i
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
    let listener = null, raf = 0, last = 0, voice = false;
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
      if (voice) {
        // listening to a narrator: she stays put and glows with the voice
        set(moveRef.current, "");
        set(danceRef.current, `scale(${(1 + 0.06 * m.level * e).toFixed(3)})`);
        set(glowRef.current, `scale(${(1 + 0.7 * m.level * e).toFixed(3)})`);
        if (!reduce) {
          m.spin += dt * (0.01 + m.level * 0.12) * e;
          set(spinRef.current, `rotate(${(m.spin % 360).toFixed(1)}deg)`);
        }
        set(wingLRef.current, ""); set(wingRRef.current, "");
      } else if (reduce) {
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
        set(wingLRef.current, `rotate(${flap.toFixed(1)}deg)`); // a lift on each beat
        set(wingRRef.current, `rotate(${(-flap).toFixed(1)}deg)`);
      }
      set(eyeRef.current, `scale(${(1 + (voice ? 0.25 * m.level : 0.4 * m.bass) * e).toFixed(3)})`);
      if (listener || m.energy > 0.01 || m.pulse > 0.01) raf = requestAnimationFrame(frame);
      else {
        raf = 0; last = 0; m.spin = 0;
        [moveRef, danceRef, glowRef, spinRef, wingLRef, wingRRef, eyeRef].forEach((r) => set(r.current, ""));
      }
    };
    const off = onMusic((analyser, mode) => {
      listener = analyser ? createListener(analyser) : null;
      voice = mode === "voice";
      if (!raf) raf = requestAnimationFrame(frame);
    });
    return () => { off(); cancelAnimationFrame(raf); };
  }, []);

  // ---- player two ----
  const [p2, setP2] = useState(false);
  const [mounted, setMounted] = useState(false);
  const p2EyeRef = useRef(null), p2GlowRef = useRef(null), tetherRef = useRef(null), tetherGlowRef = useRef(null), tetherDotRef = useRef(null);
  useEffect(() => { setMounted(true); return onPlayerTwo((on) => { setP2(on); if (on) setLook({ x: 0, y: 0 }); }); }, []);
  useEffect(() => {
    if (!p2) return;
    let raf = 0;
    const frame = (now) => {
      const st = playerTwo();
      if (!st.active || now - st.last > 600) { playerTwoEnd(); return; }
      const r = ref.current?.getBoundingClientRect();
      if (r) {
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = st.x - cx, dy = st.y - cy, d = Math.hypot(dx, dy) || 1;
        // the eye locks onto her character, narrowed in concentration
        if (p2EyeRef.current) p2EyeRef.current.style.transform = `translate(${((dx / d) * 4).toFixed(2)}px, ${((dy / d) * 4).toFixed(2)}px) scale(0.72)`;
        const fire = Math.max(0, 1 - (now - st.fireAt) / 220); // flares as it fires
        if (p2GlowRef.current) p2GlowRef.current.style.opacity = (0.45 + 0.55 * fire).toFixed(2);
        // the thread between them
        const sx = cx + (dx / d) * (r.width * 0.45), sy = cy + (dy / d) * (r.height * 0.45);
        [tetherRef.current, tetherGlowRef.current].forEach((ln) => {
          if (!ln) return;
          ln.setAttribute("x1", sx); ln.setAttribute("y1", sy); ln.setAttribute("x2", st.x); ln.setAttribute("y2", st.y);
        });
        if (tetherRef.current) tetherRef.current.style.strokeDashoffset = String(-(now / 18) % 1000);
        if (tetherGlowRef.current) tetherGlowRef.current.style.opacity = (0.08 + 0.35 * fire).toFixed(2);
        if (tetherDotRef.current) {
          // a spark running down the thread on each shot
          const k = fire > 0 ? 1 - fire : 1;
          tetherDotRef.current.setAttribute("cx", sx + (st.x - sx) * k);
          tetherDotRef.current.setAttribute("cy", sy + (st.y - sy) * k);
          tetherDotRef.current.style.opacity = fire > 0 ? "0.95" : "0";
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [p2]);

  const reactingWide = react === "curious" || react === "recognize" || react === "chapter" || react === "wow" || react === "warm" || react === "celebrate" || react === "proud";
  const lid = privateMode ? 0.06 : blink ? 0.08 : deferring && !glancing ? 0.5 : react === "flinch" ? 0.35 : reactingWide ? 1 : readingNow ? 0.8 : dormant && !p2 ? 0.45 : 1; // playing wakes her right up
  // deferring: eyes lowered toward the chamber; glancing: looking up at it.
  // reading: eyes on the page (left of her), flicking back to the top of a new page
  const lookNow = deferring ? (glancing ? { x: -3, y: -2.6 } : { x: -2.2, y: 0.8 })
    : lookAtVec || (react === "turn" ? { x: -3.2, y: -2.4 } : readingNow ? { x: -2.6, y: -0.4 } : look);
  const pupilR = state === "thinking" || react === "analyze" || react === "watchful" ? 2.6 : react === "curious" || react === "wow" ? 5 : dormant && !p2 ? 3 : 4.2;
  const motes = stage >= 2 ? stage - 1 : 0;

  return (
    <span ref={ref} className={`lyra-body lyra-state-${state}${p2 ? " lyra-p2" : ""}${glancing ? " lyra-glance" : ""}${readingNow ? " lyra-reading" : ""}${react ? ` lyra-react-${react}` : ""}${privateMode ? " lyra-private" : ""}`} style={{ width: size, height: size, opacity: privateMode ? 0.55 : deferring && !p2 ? (glancing ? 0.85 : 0.4) : react === "subdued" || react === "droop" ? 0.5 : react ? 1 : readingNow ? 0.7 : dormant && !p2 ? 0.6 : 1 }}>
      {p2 && <span className="mono lyra-p2-badge">P2 · PLAYING</span>}
      {p2 && mounted && createPortal(
        <svg className="lyra-tether" aria-hidden="true">
          <defs>
            <filter id="lyra-tether-blur"><feGaussianBlur stdDeviation="3" /></filter>
          </defs>
          <line ref={tetherGlowRef} stroke="#8B95F6" strokeWidth="6" strokeLinecap="round" filter="url(#lyra-tether-blur)" />
          <line ref={tetherRef} stroke="#B9C0FF" strokeWidth="1.2" strokeDasharray="2 7" strokeLinecap="round" opacity="0.55" />
          <circle ref={tetherDotRef} r="3" fill="#FFFFFF" style={{ opacity: 0 }} />
        </svg>,
        document.body
      )}
      <span ref={moveRef} style={{ display: "block", width: size, height: size }}>
      <svg width={size} height={size} viewBox="-26 -26 52 52" aria-hidden="true" style={{ overflow: "visible" }}>
        <g ref={danceRef}>
        <defs>
          <linearGradient id="lyra-feather" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor={c.ring} stopOpacity="0.08" />
            <stop offset="100%" stopColor={c.ring} stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="lyra-glow">
            <stop offset="0%" stopColor={`rgba(${c.glow},0.55)`} />
            <stop offset="100%" stopColor={`rgba(${c.glow},0)`} />
          </radialGradient>
        </defs>

        <g ref={glowRef}><circle className="lyra-breath" r="24" fill="url(#lyra-glow)" /></g>
        {p2 && <circle ref={p2GlowRef} r="26" fill="none" stroke="#B9C0FF" strokeWidth="1.4" opacity="0.45" />}
        {stage >= 4 && (
          // three translucent feathers a side, fanned up and out (Update 5.47 -
          // the old three-stroke wings read as spider legs)
          <g className="lyra-wings" fill="url(#lyra-feather)" stroke={c.ring} strokeWidth="0.7" strokeLinejoin="round">
            <g ref={wingLRef} style={{ transformOrigin: "-14px 0" }}><g className="lyra-wing-l">
              <path d="M 0 0 C -9.3 -4.6, -23.2 -4.6, -31 0 C -23.2 2.8, -9.3 2.8, 0 0 Z" transform="translate(-13 1) rotate(34)" />
              <path d="M 0 0 C -7.8 -4.2, -19.5 -4.2, -26 0 C -19.5 2.5, -7.8 2.5, 0 0 Z" transform="translate(-13 1) rotate(16)" />
              <path d="M 0 0 C -6 -3.6, -15 -3.6, -20 0 C -15 2.2, -6 2.2, 0 0 Z" transform="translate(-13 1) rotate(-2)" />
            </g></g>
            <g ref={wingRRef} style={{ transformOrigin: "14px 0" }}><g className="lyra-wing-r"><g transform="scale(-1 1)">
              <path d="M 0 0 C -9.3 -4.6, -23.2 -4.6, -31 0 C -23.2 2.8, -9.3 2.8, 0 0 Z" transform="translate(-13 1) rotate(34)" />
              <path d="M 0 0 C -7.8 -4.2, -19.5 -4.2, -26 0 C -19.5 2.5, -7.8 2.5, 0 0 Z" transform="translate(-13 1) rotate(16)" />
              <path d="M 0 0 C -6 -3.6, -15 -3.6, -20 0 C -15 2.2, -6 2.2, 0 0 Z" transform="translate(-13 1) rotate(-2)" />
            </g></g></g>
          </g>
        )}
        <circle r="17.5" fill="#0C0E28" stroke="#3A3E75" strokeWidth="1" />


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
          <g style={{ transform: `translate(${lookNow.x}px, ${lookNow.y}px)`, transition: deferring || readingNow ? "transform 0.7s ease" : "transform 0.25s ease-out" }}>
            <g ref={eyeRef}>
            <g ref={p2EyeRef} style={{ transition: "transform 0.08s linear" }}>
            <circle r={pupilR} fill={c.pupil} style={{ transition: "r 0.3s ease" }} />
            <circle cx="-1.3" cy="-1.4" r="1" fill="#FFFFFF" opacity="0.7" />
            </g>
            </g>
          </g>
        </g>

        {(state === "celebrating" || react === "celebrate") && (
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
