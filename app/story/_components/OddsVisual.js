"use client";
import { useEffect, useRef, useState } from "react";

// "The only you" (Lesson 1): the odds of their existence as a living visual.
// Each parent's 23 chromosome pairs can combine 2^23 = 8,388,608 ways, so one
// couple can make 2^46 = 70,368,744,177,664 genetically different children.
const ONE = 8388608;
const ALL = 70368744177664;
const fmt = (n) => Math.round(n).toLocaleString("en-US");
const ease = (t) => 1 - Math.pow(1 - t, 3);

function Count({ to, run, ms = 1600, instant }) {
  const [v, setV] = useState(instant ? to : 0);
  useEffect(() => {
    if (instant) { setV(to); return; }
    if (!run) { setV(0); return; }
    let raf, start;
    const tick = (now) => {
      start ??= now;
      const t = Math.min(1, (now - start) / ms);
      setV(to * ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run, ms, instant]);
  return <>{fmt(v)}</>;
}

// A field of possible people, zooming out until one glowing dot is left: you.
function Field({ run, instant }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const g = c.getContext("2d");
    let raf, start, alive = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => { c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr; };
    size();
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const dots = Array.from({ length: 2600 }, () => ({ x: rnd() * 2 - 1, y: rnd() * 2 - 1, r: 0.5 + rnd() * 1.1, a: 0.18 + rnd() * 0.4 }));
    const draw = (now) => {
      if (!alive) return;
      start ??= now;
      const w = c.width, h = c.height, cx = w / 2, cy = h / 2;
      const t = instant ? 1 : run ? Math.min(1, (now - start) / 2600) : 0;
      const zoom = 1 + 13 * (1 - ease(t));
      g.clearRect(0, 0, w, h);
      for (const d of dots) {
        const x = cx + d.x * w * 0.55 * zoom, y = cy + d.y * h * 0.62 * zoom;
        if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
        g.globalAlpha = d.a;
        g.fillStyle = "#F7F1E8";
        g.beginPath(); g.arc(x, y, d.r * dpr * Math.min(3, Math.sqrt(zoom)), 0, Math.PI * 2); g.fill();
      }
      const pulse = 0.5 + 0.5 * Math.sin(now / 520);
      g.globalAlpha = 0.18 + 0.2 * pulse;
      g.fillStyle = "#E08A5F";
      g.beginPath(); g.arc(cx, cy, (16 + 10 * pulse) * dpr, 0, Math.PI * 2); g.fill();
      g.globalAlpha = 1;
      g.fillStyle = "#C25B34";
      g.beginPath(); g.arc(cx, cy, 6.5 * dpr, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#FFFCF7"; g.lineWidth = 2 * dpr; g.stroke();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", size);
    return () => { alive = false; cancelAnimationFrame(raf); window.removeEventListener("resize", size); };
  }, [run, instant]);
  return <canvas ref={ref} className="ov-field" aria-hidden="true" />;
}

const STEPS = [600, 2600, 4900, 7600, 10200]; // when each beat begins (ms)

export default function OddsVisual({ name, latest = false }) {
  const box = useRef(null);
  const [phase, setPhase] = useState(-1);
  const [runId, setRunId] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => { setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false); }, []);
  // When it has just appeared, bring its top into view inside the chat.
  useEffect(() => {
    if (!latest) return;
    const t = setTimeout(() => {
      const el = box.current, log = el?.closest(".sos-log");
      if (!el || !log) return;
      log.scrollTo({ top: log.scrollTop + el.getBoundingClientRect().top - log.getBoundingClientRect().top - 12, behavior: "smooth" });
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const el = box.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  useEffect(() => {
    if (!seen) return;
    if (reduced) { setPhase(STEPS.length); return; }
    setPhase(0);
    const ts = STEPS.map((ms, i) => setTimeout(() => setPhase(i + 1), ms));
    return () => ts.forEach(clearTimeout);
  }, [seen, reduced, runId]);

  const at = (i) => phase >= i;
  const instant = reduced;

  return (
    <figure className="ov" ref={box} aria-label="The odds of you: 1 in about 70 trillion">
      <div className="ov-eyebrow">The math of {name ? `${name}` : "you"}</div>
      <div className="ov-eq">
        <div className={`ov-num ${at(1) ? "in" : ""}`}>
          <b><Count to={ONE} run={at(1)} instant={instant} /></b>
          <span>ways your mom's 23 chromosome pairs can combine</span>
        </div>
        <div className={`ov-op ${at(2) ? "in" : ""}`}>×</div>
        <div className={`ov-num ${at(2) ? "in" : ""}`}>
          <b><Count to={ONE} run={at(2)} instant={instant} /></b>
          <span>ways your dad's can</span>
        </div>
      </div>
      <div className={`ov-total ${at(3) ? "in" : ""}`}>
        <span className="ov-eqsign">=</span>
        <b><Count to={ALL} run={at(3)} ms={2300} instant={instant} /></b>
        <span>different people your parents could have had</span>
      </div>
      <div className={`ov-stage ${at(4) ? "in" : ""}`}>
        <Field key={runId} run={at(4)} instant={instant} />
        <div className="ov-caption">
          <b>1 in 70 trillion.</b>
          <span>And it was you.</span>
        </div>
      </div>
      <div className={`ov-facts ${at(5) ? "in" : ""}`}>
        <div><b>2.2 million years</b><span>to count every possible person, one per second, without stopping</span></div>
        <div><b>~600×</b><span>the number of humans who have ever lived (about 117 billion)</span></div>
        <div><b>1</b><span>of them is living your story</span></div>
      </div>
      <figcaption className={`ov-quote ${at(5) ? "in" : ""}`}>
        “You are the only you that will live your story.”
        {!reduced && phase >= STEPS.length && (
          <button className="ov-replay" onClick={() => { setPhase(-1); setRunId((n) => n + 1); }}>↻ Replay</button>
        )}
      </figcaption>
    </figure>
  );
}
