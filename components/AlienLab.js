"use client";

import { useEffect, useRef, useState } from "react";
import { drawSpecimen, specimenReadout } from "../lib/specimen";

// The Alien Lab's room (Update 5.55). The Lab isn't a human lab: it's run by
// aliens, and you're a guest at their bench. Two parts:
//   <LabVat>  - the containment vat; the specimen takes shape inside it as
//               questions are answered, with a scan sweeping it each time
//   <LabCrew> - the two technicians who run the bay, talking (in their own
//               glyphs, translated as you watch) about what you're making
// The crew are the Lab's own characters, a bit of fun for the tool - not
// 13i canon (see docs/WORLD.md, "The Alien Lab").

const TINT = { yellow: "rgba(242,217,160,", binary: "rgba(246,200,144,", red: "rgba(224,106,80,", blue: "rgba(185,212,255,", dark: "rgba(143,230,255," };

export function LabVat({ traits, pulse = 0, label = "SPECIMEN" }) {
  const ref = useRef(null);
  const trRef = useRef(traits); trRef.current = traits;
  const pulseRef = useRef({ n: pulse, at: 0 });
  if (pulse !== pulseRef.current.n) pulseRef.current = { n: pulse, at: typeof performance !== "undefined" ? performance.now() : 0 };
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let raf = 0;
    const bubbles = Array.from({ length: 34 }, (_, i) => ({ x: Math.random(), y: Math.random(), s: 1 + Math.random() * 3, v: 0.03 + Math.random() * 0.06, p: i }));
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (now) => {
      const t = now / 1000;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = c.clientWidth, H = c.clientHeight;
      if (c.width !== Math.round(W * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const tr = trRef.current;
      const tint = TINT[tr.known.body || tr.sky !== "yellow" ? tr.sky : "dark"] || TINT.dark;
      const vx = W * 0.14, vw = W * 0.72, vy = H * 0.1, vh = H * 0.74;
      // base and cap of the vat
      ctx.fillStyle = "#14163A"; ctx.strokeStyle = "#3A3E75"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(W / 2, vy + vh, vw / 2 + 10, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillRect(vx - 10, vy + vh, vw + 20, H * 0.08); ctx.strokeRect(vx - 10, vy + vh, vw + 20, H * 0.08);
      // the liquid
      const g = ctx.createLinearGradient(0, vy, 0, vy + vh);
      g.addColorStop(0, tint + "0.10)"); g.addColorStop(1, tint + "0.32)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(vx, vy, vw, vh, 30) : ctx.rect(vx, vy, vw, vh); ctx.fill();
      // bubbles
      bubbles.forEach((b) => {
        const y = (((b.y - (reduced ? 0 : t) * b.v) % 1) + 1) % 1;
        ctx.globalAlpha = 0.5; ctx.strokeStyle = tint + "0.9)";
        ctx.beginPath(); ctx.arc(vx + 12 + b.x * (vw - 24) + Math.sin(t * 2 + b.p) * 3, vy + 10 + y * (vh - 20), b.s, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.globalAlpha = 1;
      // the specimen
      ctx.save();
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(vx, vy, vw, vh, 30) : ctx.rect(vx, vy, vw, vh); ctx.clip();
      drawSpecimen(ctx, W / 2, vy + vh * 0.48, Math.min(vw, vh) * 0.95, reduced ? 1 : t, tr, { seed: 3 });
      // the scan sweep, after each answer
      const since = (now - pulseRef.current.at) / 1000;
      if (pulseRef.current.at && since < 1.4) {
        const y = vy + vh * (since / 1.4);
        const sg = ctx.createLinearGradient(0, y - 30, 0, y + 4);
        sg.addColorStop(0, "rgba(139,149,246,0)"); sg.addColorStop(1, "rgba(185,192,255,0.6)");
        ctx.fillStyle = sg; ctx.fillRect(vx, y - 30, vw, 34);
        ctx.fillStyle = "#E9D29A"; ctx.fillRect(vx, y, vw, 1.5);
      }
      ctx.restore();
      // glass: rim and highlight
      ctx.strokeStyle = "rgba(185,192,255,0.55)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(vx, vy, vw, vh, 30) : ctx.rect(vx, vy, vw, vh); ctx.stroke();
      const hl = ctx.createLinearGradient(vx, 0, vx + vw, 0);
      hl.addColorStop(0, "rgba(255,255,255,0.10)"); hl.addColorStop(0.12, "rgba(255,255,255,0.02)"); hl.addColorStop(0.85, "rgba(255,255,255,0)"); hl.addColorStop(0.95, "rgba(255,255,255,0.08)");
      ctx.fillStyle = hl; ctx.fillRect(vx, vy, vw, vh);
      // cap
      ctx.fillStyle = "#14163A"; ctx.strokeStyle = "#3A3E75";
      ctx.fillRect(vx - 6, vy - 12, vw + 12, 16); ctx.strokeRect(vx - 6, vy - 12, vw + 12, 16);
      for (let i = 0; i < 5; i++) { ctx.fillStyle = Math.sin(t * 3 + i) > 0.3 ? "#E9D29A" : "#3A3E75"; ctx.fillRect(vx + 8 + i * 14, vy - 7, 6, 4); }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="lab-vat">
      <canvas ref={ref} className="lab-vat-canvas" aria-hidden="true" />
      <div className="mono lab-vat-label">{label}</div>
      <div className="mono lab-vat-read">{specimenReadout(traits)}</div>
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
