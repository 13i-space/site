"use client";

import { useEffect, useRef, useState } from "react";
import { drawSpecimen, specimenReadout } from "../lib/specimen";
import { drawEmbryo, STAGE_NAMES } from "../lib/embryo";

// The Alien Lab's room (Update 5.55). The Lab isn't a human lab: it's run by
// aliens, and you're a guest at their bench. Two parts:
//   <LabVat>  - the containment vat; the specimen takes shape inside it as
//               questions are answered, with a scan sweeping it each time
//   <LabCrew> - the two technicians who run the bay, talking (in their own
//               glyphs, translated as you watch) about what you're making
// The crew are the Lab's own characters, a bit of fun for the tool - not
// 13i canon (see docs/WORLD.md, "The Alien Lab").

const TINT = { yellow: "rgba(242,217,160,", binary: "rgba(246,200,144,", red: "rgba(224,106,80,", blue: "rgba(185,212,255,", dark: "rgba(143,230,255," };

// The vat (Update 5.59): what grows here is an ambiguous embryo
// (lib/embryo.js), not the species. phase:
//   "grow"    - the embryo, nudged by every answer
//   "anomaly" - something happens in the tank that nobody explains (~6 s)
//   "cocoon"  - it wraps itself up while the species is generated
//   "reveal"  - the cocoon opens: the portrait, or the drawn specimen
// The anomaly is never explained, on purpose; each one is counted in this
// browser (13i_anomalies) for whatever the larger mystery does with it later.
const ANOMALY_MS = 6200;
const SIGIL = [[0, -1], [0.87, 0.5], [-0.87, 0.5], [0, -1]]; // a mark, drawn as if by something else

export function LabVat({ traits, pulse = 0, label = "SPECIMEN", embryo = null, phase = "grow", portrait = null }) {
  const ref = useRef(null);
  const trRef = useRef(traits); trRef.current = traits;
  const emRef = useRef(embryo); emRef.current = embryo;
  const phaseRef = useRef({ phase, at: 0 });
  if (phase !== phaseRef.current.phase) phaseRef.current = { phase, at: typeof performance !== "undefined" ? performance.now() : 0 };
  const pulseRef = useRef({ n: pulse, at: 0 });
  if (pulse !== pulseRef.current.n) pulseRef.current = { n: pulse, at: typeof performance !== "undefined" ? performance.now() : 0 };
  const imgRef = useRef(null);
  const lookRef = useRef(null);
  const [readout, setReadout] = useState("");
  const [alarm, setAlarm] = useState(false);

  useEffect(() => {
    if (!portrait) { imgRef.current = null; return; }
    const im = new Image();
    im.onload = () => { imgRef.current = im; };
    im.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(portrait)}`;
  }, [portrait]);

  useEffect(() => {
    if (phase !== "anomaly") return;
    try { localStorage.setItem("13i_anomalies", String(Number(localStorage.getItem("13i_anomalies") || 0) + 1)); } catch (e) { /* ignore */ }
    const on = setTimeout(() => setAlarm(true), ANOMALY_MS * 0.2);
    const off = setTimeout(() => setAlarm(false), ANOMALY_MS * 0.9);
    return () => { clearTimeout(on); clearTimeout(off); };
  }, [phase]);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let raf = 0, frozenAt = 0, lastRead = 0;
    const bubbles = Array.from({ length: 34 }, (_, i) => ({ x: Math.random(), y: Math.random(), s: 1 + Math.random() * 3, v: 0.03 + Math.random() * 0.06, p: i }));
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e) => { const r = c.getBoundingClientRect(); lookRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }; };
    window.addEventListener("pointermove", onMove);
    const draw = (now) => {
      const t = now / 1000;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = c.clientWidth, H = c.clientHeight;
      if (c.width !== Math.round(W * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const tr = trRef.current;
      const em = emRef.current;
      const ph = phaseRef.current;
      const since = (now - ph.at) / 1000;
      const k = ph.phase === "anomaly" ? Math.min(1, (now - ph.at) / ANOMALY_MS) : 0; // 0..1 through the anomaly
      let tint = TINT[tr.known.body || tr.sky !== "yellow" ? tr.sky : "dark"] || TINT.dark;
      if (em) tint = `hsla(${em.hue},65%,72%,`;
      // the anomaly: the tank's light goes wrong
      if (k > 0.2 && k < 0.9) tint = "rgba(200,60,90,";
      const vx = W * 0.14, vw = W * 0.72, vy = H * 0.1, vh = H * 0.74;
      ctx.fillStyle = "#14163A"; ctx.strokeStyle = "#3A3E75"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(W / 2, vy + vh, vw / 2 + 10, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillRect(vx - 10, vy + vh, vw + 20, H * 0.08); ctx.strokeRect(vx - 10, vy + vh, vw + 20, H * 0.08);
      const flicker = k > 0.05 && k < 0.25 ? (Math.random() < 0.3 ? 0.3 : 1) : 1;
      const g = ctx.createLinearGradient(0, vy, 0, vy + vh);
      g.addColorStop(0, tint + (0.10 * flicker) + ")"); g.addColorStop(1, tint + (0.32 * flicker) + ")");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(vx, vy, vw, vh, 30) : ctx.rect(vx, vy, vw, vh); ctx.fill();
      const frozen = k > 0 && k < 0.45;
      if (!frozen) frozenAt = t;
      const tt = reduced ? 1 : frozen ? frozenAt : t;
      // what drifts in the liquid
      const env = em ? em.env : "bubbles";
      bubbles.forEach((b) => {
        const y = (((b.y - tt * b.v * (env === "dark" ? 0.3 : 1)) % 1) + 1) % 1;
        const bx = vx + 12 + b.x * (vw - 24) + Math.sin(tt * 2 + b.p) * 3, by = vy + 10 + y * (vh - 20);
        ctx.globalAlpha = env === "dark" ? 0.2 : 0.5;
        ctx.strokeStyle = tint + "0.9)"; ctx.fillStyle = tint + "0.7)";
        if (env === "grains") ctx.fillRect(bx, vy + 10 + (1 - y) * (vh - 20), 1.5, 1.5);
        else if (env === "crystals") { ctx.save(); ctx.translate(bx, by); ctx.rotate(b.p + tt * 0.2); ctx.strokeRect(-b.s, -b.s, b.s * 2, b.s * 2); ctx.restore(); }
        else if (env === "spores") { ctx.beginPath(); ctx.arc(bx, by, b.s * 0.6, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.beginPath(); ctx.arc(bx, by, b.s, 0, Math.PI * 2); ctx.stroke(); }
      });
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(vx, vy, vw, vh, 30) : ctx.rect(vx, vy, vw, vh); ctx.clip();
      const S = Math.min(vw, vh) * 0.95, cx = W / 2, cy = vy + vh * 0.48;
      if (ph.phase === "reveal") {
        // the cocoon opens
        const open = Math.min(1, since / 1.6);
        if (open < 1) { ctx.fillStyle = `rgba(255,240,215,${(1 - open) * 0.9})`; ctx.fillRect(vx, vy, vw, vh); }
        ctx.globalAlpha = open;
        const im = imgRef.current;
        if (im) {
          const s = Math.min(vw, vh) * 0.86, bob = reduced ? 0 : Math.sin(t * 0.8) * 4;
          ctx.drawImage(im, cx - s / 2, cy - s / 2 + bob, s, s);
        } else {
          drawSpecimen(ctx, cx, cy, S, reduced ? 1 : t, tr, { seed: 3 });
        }
        ctx.globalAlpha = 1;
      } else if (em) {
        // the anomaly's beats: freeze, the light goes wrong, a mark, a second
        // signal from outside the tank, it turns toward you, the wrong shape
        if (k > 0.4 && k < 0.62) {
          const a = Math.sin(((k - 0.4) / 0.22) * Math.PI);
          ctx.strokeStyle = `rgba(233,210,154,${a * 0.85})`; ctx.lineWidth = 2;
          ctx.beginPath(); SIGIL.forEach(([x, y], i) => { const px = cx + x * S * 0.36, py = cy + y * S * 0.36; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, cy, S * 0.18, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx, cy - S * 0.5); ctx.lineTo(cx, cy + S * 0.5); ctx.stroke();
        }
        if (k > 0.45 && k < 0.8) {
          const rr = ((k - 0.45) / 0.35) * vw * 1.6;
          ctx.strokeStyle = `rgba(185,192,255,${0.6 * (1 - (k - 0.45) / 0.35)})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(vx - vw * 0.3, cy, rr, 0, Math.PI * 2); ctx.stroke();
        }
        const stare = k > 0.6 && k < 0.88 ? Math.min(1, (k - 0.6) / 0.06) : 0;
        const wrong = k > 0.7 && k < 0.8 ? Math.sin(((k - 0.7) / 0.1) * Math.PI) : 0;
        const cocoon = ph.phase === "cocoon" ? Math.min(1, since / 2.5) : k > 0.88 ? (k - 0.88) / 0.12 * 0.4 : 0;
        drawEmbryo(ctx, cx, cy, S, reduced ? 1 : t, em, { look: lookRef.current, freeze: frozen, frozenAt, stare, wrong, cocoon });
      } else {
        drawSpecimen(ctx, cx, cy, S, reduced ? 1 : t, tr, { seed: 3 });
      }
      const ps = (now - pulseRef.current.at) / 1000;
      if (pulseRef.current.at && ps < 1.4 && ph.phase === "grow") {
        const y = vy + vh * (ps / 1.4);
        const sg = ctx.createLinearGradient(0, y - 30, 0, y + 4);
        sg.addColorStop(0, "rgba(139,149,246,0)"); sg.addColorStop(1, "rgba(185,192,255,0.6)");
        ctx.fillStyle = sg; ctx.fillRect(vx, y - 30, vw, 34);
        ctx.fillStyle = "#E9D29A"; ctx.fillRect(vx, y, vw, 1.5);
      }
      ctx.restore();
      ctx.strokeStyle = k > 0.2 && k < 0.9 ? "rgba(224,106,120,0.7)" : "rgba(185,192,255,0.55)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(vx, vy, vw, vh, 30) : ctx.rect(vx, vy, vw, vh); ctx.stroke();
      const hl = ctx.createLinearGradient(vx, 0, vx + vw, 0);
      hl.addColorStop(0, "rgba(255,255,255,0.10)"); hl.addColorStop(0.12, "rgba(255,255,255,0.02)"); hl.addColorStop(0.85, "rgba(255,255,255,0)"); hl.addColorStop(0.95, "rgba(255,255,255,0.08)");
      ctx.fillStyle = hl; ctx.fillRect(vx, vy, vw, vh);
      ctx.fillStyle = "#14163A"; ctx.strokeStyle = "#3A3E75";
      ctx.fillRect(vx - 6, vy - 12, vw + 12, 16); ctx.strokeRect(vx - 6, vy - 12, vw + 12, 16);
      for (let i = 0; i < 5; i++) { ctx.fillStyle = k > 0.2 && k < 0.9 ? (Math.random() < 0.5 ? "#E06A78" : "#3A3E75") : Math.sin(t * 3 + i) > 0.3 ? "#E9D29A" : "#3A3E75"; ctx.fillRect(vx + 8 + i * 14, vy - 7, 6, 4); }
      // the instruments, a few times a second
      if (em && now - lastRead > 350) {
        lastRead = now;
        const stg = ph.phase === "reveal" ? 4 : ph.phase === "grow" ? em.stage : 3;
        const cells = em.cells + (ph.phase === "grow" ? 0 : Math.floor(Math.random() * 40));
        const act = ph.phase === "anomaly" && k < 0.45 ? 0 : em.activity + (Math.random() - 0.5) * 0.08;
        setReadout(`STAGE ${STAGE_NAMES[stg]} · CELLS ${cells} · ACTIVITY ${act.toFixed(2)} · ${Math.round(300 + em.growth * 40 + (k > 0.2 && k < 0.9 ? 60 : 0))}K`);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []);
  const interest = embryo ? Math.min(1, embryo.progress) : 0;
  const mood = phase === "anomaly" ? "alarmed" : phase === "cocoon" ? "intent" : phase === "reveal" ? "satisfied" : "watch";
  return (
    <div className={`lab-vat ${alarm ? "lab-vat-alarm" : ""}`} data-phase={phase}>
      <canvas ref={ref} className="lab-vat-canvas" aria-hidden="true" />
      <LabScientist mood={mood} interest={interest} pulse={pulse} />
      <div className="mono lab-vat-label">{label}</div>
      <div className="mono lab-vat-read">{embryo ? (alarm ? "\u25B2 UNCLASSIFIED EVENT \u00b7 NO MATCHING RECORD" : readout) : specimenReadout(traits)}</div>
    </div>
  );
}

// ─────────── the observer ───────────
// Lab Scientist Ixxen (Update 5.59): small, thin, a little too still. It
// doesn't talk. It watches the vat, makes notes, adjusts the dials, leans
// closer as the thing in the tank grows - and when something happens that
// shouldn't, it steps back. Not a mascot. Original to 13i.
const ACTIONS = ["note", "adjust", "peer", "note", "tilt"];
export function LabScientist({ mood = "watch", interest = 0, pulse = 0 }) {
  const [action, setAction] = useState("watch");
  useEffect(() => {
    if (!pulse) return;
    const a = ACTIONS[pulse % ACTIONS.length];
    setAction(a);
    const id = setTimeout(() => setAction("watch"), 1900);
    return () => clearTimeout(id);
  }, [pulse]);
  const lean = mood === "alarmed" ? -10 : mood === "intent" ? 9 : 2 + interest * 8;
  return (
    <div className={`lab-sci lab-sci-${mood} lab-sci-do-${action}`} style={{ "--lean": `${lean}deg` }} aria-hidden="true">
      <svg viewBox="0 0 80 140">
        <defs>
          <linearGradient id="ixx-skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9AA3C8" /><stop offset="1" stopColor="#3B3F66" /></linearGradient>
        </defs>
        {/* legs: too many joints */}
        <path d="M34 104 L30 118 L34 138 M46 104 L50 118 L46 138" fill="none" stroke="#2A2D55" strokeWidth="3" strokeLinecap="round" />
        <g className="lab-sci-body">
          {/* the coat: long, narrow, with instruments clipped on */}
          <path d="M28 56 Q24 84 26 108 L54 108 Q56 84 52 56 Q40 50 28 56 Z" fill="#14163A" stroke="#4A4F80" strokeWidth="1" />
          <path d="M40 56 V106" stroke="#4A4F80" strokeWidth="0.8" />
          <rect x="44" y="66" width="6" height="9" rx="1" fill="#0A0B1C" stroke="#6FC3A8" strokeWidth="0.6" />
          <circle cx="47" cy="70" r="1.2" fill="#6FC3A8" className="lab-sci-led" />
          {/* the near arm, holding the slate */}
          <g className="lab-sci-arm-slate">
            <path d="M30 60 Q22 76 30 86" fill="none" stroke="url(#ixx-skin)" strokeWidth="3" strokeLinecap="round" />
            <rect x="26" y="82" width="14" height="10" rx="1.5" fill="#0C0E28" stroke="#8B95F6" strokeWidth="0.8" transform="rotate(-12 33 87)" />
            <path className="lab-sci-writing" d="M29 86 h7 M29 89 h5" stroke="#8B95F6" strokeWidth="0.7" transform="rotate(-12 33 87)" />
          </g>
          {/* the far arm, long fingers reaching for the tank */}
          <g className="lab-sci-arm-reach">
            <path d="M50 60 Q64 66 70 78" fill="none" stroke="url(#ixx-skin)" strokeWidth="3" strokeLinecap="round" />
            <path d="M70 78 l6 2 M70 78 l5 5 M70 78 l2 6" stroke="#9AA3C8" strokeWidth="1.3" strokeLinecap="round" />
          </g>
          {/* the head: long, tilted, one vertical eye and two small ones */}
          <g className="lab-sci-head">
            <path d="M40 10 C52 10 56 26 54 38 C52 48 46 54 40 54 C34 54 28 48 26 38 C24 26 28 10 40 10 Z" fill="url(#ixx-skin)" />
            <path d="M33 16 Q40 6 47 16" fill="none" stroke="#2A2D55" strokeWidth="1" />
            <ellipse className="lab-sci-eye" cx="42" cy="32" rx="3" ry="8" fill="#05040F" />
            <ellipse className="lab-sci-iris" cx="42.6" cy="31" rx="1.1" ry="3.5" fill="#E9D29A" />
            <circle cx="34" cy="26" r="1.6" fill="#05040F" /><circle cx="50" cy="26" r="1.3" fill="#05040F" />
            <path d="M36 46 Q41 48 46 46" fill="none" stroke="#2A2D55" strokeWidth="1" />
            {/* a loupe over the eye when it peers */}
            <circle className="lab-sci-loupe" cx="42" cy="32" r="7" fill="none" stroke="#C9B98F" strokeWidth="1.4" />
          </g>
        </g>
      </svg>
      <div className="mono lab-sci-name">IXXEN &middot; OBSERVER</div>
    </div>
  );
}

// ─────────── the crew ───────────
const GLYPHS = "⟡⌬⏃⍜⟁◬⋔⏚⌖⟟⍙⏁⎎";

const INTRO = {
  star_type: ["qeth", "Begin with the light. Everything alive is shaped by what it sees by."],
  gravity: ["ilu", "Gravity next! Heavy worlds grow stubborn bodies. I love stubborn bodies."],
  atmosphere: ["qeth", "What does it breathe, if it breathes. Every species answers 'air'. Be more specific."],
  terrain: ["ilu", "Where does it stand? Or swim, or hang. We have a tank for everything."],
  size: ["qeth", "Size, measured against you, guest. We find your size... modest."],
  symmetry: ["ilu", "Left and right, or all the way around? I'm all the way around. Very efficient."],
  limbs: ["qeth", "Limbs. Count carefully. The vat does not forgive arithmetic."],
  locomotion: ["ilu", "How does it get places? I roll, mostly. Nobody asked."],
  manipulation: ["qeth", "What does it hold the world with? Hands are a choice, not a law."],
  exterior: ["ilu", "Skin time! This is my favourite part. Pick something shiny."],
  primary_sense: ["qeth", "How does it know the world? We knew ours by gravity, long ago."],
  unique_sense: ["ilu", "Does it have a sense you don't? Most things do. Don't take it personally."],
  temperament: ["qeth", "Now the hard part. When it meets something new, what does it do?"],
  social_structure: ["ilu", "Does it live alone or in a heap? I recommend a heap."],
  core_value: ["qeth", "What does it hold above everything else? 13i will ask about this one."],
  tech_basis: ["ilu", "What does it build with? Bring me the blueprints. Or the seeds."],
  tech_level: ["qeth", "And how far has it come? Be honest. We can tell."],
};
const REACT = [
  ["ilu", "Noted! The vat likes that."],
  ["qeth", "Recorded. Continue, guest."],
  ["ilu", "Ooh. We've never grown one quite like that."],
  ["qeth", "Adequate. Better than adequate. Proceed."],
  ["ilu", "The specimen just twitched. That's good. Probably."],
  ["qeth", "Interesting choice. We will see what it does with it."],
];
const WOW = [["ilu", "Oh. OH. Qeth, come and look at this one."], ["qeth", "...Unusual. Ilu, fetch the bigger tank."]];

export function crewLine(stage, { questionId, answered, big, n = 0 }) {
  if (stage === "points") return ["qeth", "The allotment. Every specimen gets the same budget. The Continuance Rule does not grade on effort."];
  if (stage === "sheet") return ["ilu", "It's done! It's alive! Well. It's a record. Records are a kind of alive. Now give it a name."];
  if (stage === "saved") return ["qeth", "Filed. Send it to 13i for review, guest. 13i always has an opinion."];
  if (answered) return big ? WOW[n % WOW.length] : REACT[n % REACT.length];
  return INTRO[questionId] || ["qeth", "Continue."];
}

// the two of them, drawn in code
function Qeth({ talking }) {
  return (
    <svg viewBox="0 0 90 120" className={`lab-alien ${talking ? "lab-alien-talk" : ""}`} aria-hidden="true">
      <defs><radialGradient id="qeth-g" cx="0.4" cy="0.3"><stop offset="0" stopColor="#6FC3A8" /><stop offset="1" stopColor="#1e4a40" /></radialGradient></defs>
      <path d="M30 118 Q28 80 34 62 L56 62 Q62 80 60 118 Z" fill="#14163A" stroke="#3A3E75" />
      <path d="M38 70 L52 70 M36 82 L54 82 M35 94 L55 94" stroke="#6FC3A8" strokeWidth="1" opacity="0.5" />
      <ellipse cx="45" cy="38" rx="20" ry="26" fill="url(#qeth-g)" stroke="#6FC3A8" strokeWidth="1.2" />
      <path d="M30 18 Q45 -4 60 18" fill="none" stroke="#E9D29A" strokeWidth="2" />
      <path d="M36 14 L33 4 M45 11 L45 0 M54 14 L57 4" stroke="#E9D29A" strokeWidth="1.5" strokeLinecap="round" />
      <g className="lab-blink">
        <ellipse cx="37" cy="34" rx="4.5" ry="5.5" fill="#0A0B1C" /><circle cx="38" cy="33" r="1.8" fill="#FFF4DC" />
        <ellipse cx="53" cy="34" rx="4.5" ry="5.5" fill="#0A0B1C" /><circle cx="54" cy="33" r="1.8" fill="#FFF4DC" />
        <ellipse cx="45" cy="24" rx="3" ry="3.6" fill="#0A0B1C" /><circle cx="45.5" cy="23.5" r="1.2" fill="#E9D29A" />
      </g>
      <path className="lab-mouth" d="M39 50 Q45 54 51 50" fill="none" stroke="#0A0B1C" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M34 66 Q20 74 22 92 M56 66 Q70 74 68 92" fill="none" stroke="#6FC3A8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
function Ilu({ talking }) {
  return (
    <svg viewBox="0 0 90 120" className={`lab-alien lab-alien-ilu ${talking ? "lab-alien-talk" : ""}`} aria-hidden="true">
      <defs><radialGradient id="ilu-g" cx="0.4" cy="0.35"><stop offset="0" stopColor="#E8B4C8" /><stop offset="1" stopColor="#6a3a5a" /></radialGradient></defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} className="lab-tentacle" style={{ animationDelay: `${i * 0.2}s` }} d={`M${32 + i * 6.5} 96 Q${28 + i * 8} 108 ${30 + i * 7} 118`} fill="none" stroke="#E8B4C8" strokeWidth="3" strokeLinecap="round" />
      ))}
      <circle cx="45" cy="74" r="25" fill="url(#ilu-g)" stroke="#E8B4C8" strokeWidth="1.2" />
      <g className="lab-blink">
        <circle cx="45" cy="70" r="10" fill="#0A0B1C" stroke="#E8B4C8" />
        <circle cx="47" cy="68" r="4" fill="#FFF4DC" />
      </g>
      <path className="lab-mouth" d="M38 88 Q45 92 52 88" fill="none" stroke="#0A0B1C" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M45 49 Q48 38 56 36" fill="none" stroke="#E8B4C8" strokeWidth="1.5" /><circle cx="57" cy="35.5" r="2.6" fill="#8FE6FF" className="lab-antenna" />
    </svg>
  );
}

export function LabCrew({ line }) {
  const [who, text] = line;
  const [shown, setShown] = useState(text);
  // the line arrives in their glyphs, then resolves into English
  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setShown(text); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      const done = Math.min(text.length, i);
      const rest = text.slice(done).replace(/[^\s]/g, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
      setShown(text.slice(0, done) + rest);
      if (done >= text.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [text]);
  return (
    <div className="lab-crew">
      <div className={`lab-member ${who === "qeth" ? "lab-member-on" : ""}`}>
        <Qeth talking={who === "qeth"} />
        <div className="mono lab-name">OVERSEER QETH</div>
      </div>
      <div className={`lab-bubble lab-bubble-${who}`} aria-live="polite">
        <div className="mono lab-bubble-who">{who === "qeth" ? "QETH" : "ILU"} &middot; TRANSLATED</div>
        <div className="lab-bubble-text">{shown}</div>
      </div>
      <div className={`lab-member ${who === "ilu" ? "lab-member-on" : ""}`}>
        <Ilu talking={who === "ilu"} />
        <div className="mono lab-name">TECHNICIAN ILU</div>
      </div>
    </div>
  );
}
