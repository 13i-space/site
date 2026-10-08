"use client";

import { useEffect, useState } from "react";

// The Alien Lab's crew (Update 5.55). The Lab isn't a human lab: it's run by
// aliens, and you're a guest at their bench. The room itself - the tank,
// the machinery and Ixxen at work - is components/LabScene.js (5.63).
//   <LabCrew> - the two who run the bay, talking (in their own glyphs,
//               translated as you watch) about what you're making
// The crew are the Lab's own characters, a bit of fun for the tool - not
// 13i canon (see docs/WORLD.md, "The Alien Lab").

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
  if (stage === "looks") return ["ilu", "The fun part! Give it a body. Then tell us how it looks in your own words - Ixxen reads every word."];
  if (stage === "points") return ["qeth", "The allotment. Every specimen gets the same budget. The Continuance Rule does not grade on effort."];
  if (stage === "sheet") return ["ilu", "It's ready! Name it, then press Generate - Ixxen will bring it all the way to life. Then we send it to 13i."];
  if (stage === "saved") return ["qeth", "Filed and transmitted. 13i always has an opinion. Wait for it."];
  if (answered) return big ? WOW[n % WOW.length] : REACT[n % REACT.length];
  return INTRO[questionId] || ["qeth", "Continue."];
}

// the two of them, drawn in code (Update 5.63: much more of them)
// Qeth: the Overseer - tall, robed, four thin arms, three eyes, a crown of
// lit filaments. Ilu: the Technician - a floating orb with one great eye,
// two antennae and seven tentacles, one of which is always holding a tool.
function Qeth({ talking }) {
  return (
    <svg viewBox="0 -10 120 160" className={`lab-alien lab-qeth ${talking ? "lab-alien-talk" : ""}`} aria-hidden="true">
      <defs>
        <radialGradient id="qeth-aura" cx="0.5" cy="0.4" r="0.55"><stop offset="0" stopColor="#6FC3A8" stopOpacity="0.45" /><stop offset="1" stopColor="#6FC3A8" stopOpacity="0" /></radialGradient>
        <radialGradient id="qeth-skin" cx="0.38" cy="0.3" r="0.8"><stop offset="0" stopColor="#9BF0D2" /><stop offset="0.45" stopColor="#3E9C82" /><stop offset="1" stopColor="#123A33" /></radialGradient>
        <linearGradient id="qeth-robe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#24305E" /><stop offset="0.6" stopColor="#141A3E" /><stop offset="1" stopColor="#0A0D24" /></linearGradient>
        <radialGradient id="qeth-iris" cx="0.4" cy="0.35"><stop offset="0" stopColor="#FFF4DC" /><stop offset="0.5" stopColor="#E9D29A" /><stop offset="1" stopColor="#8A5A1C" /></radialGradient>
        <radialGradient id="qeth-orb" cx="0.35" cy="0.3"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.4" stopColor="#8FE6FF" /><stop offset="1" stopColor="#1F4A7A" /></radialGradient>
        <filter id="qeth-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <ellipse className="lab-aura" cx="60" cy="62" rx="56" ry="62" fill="url(#qeth-aura)" />
      <g className="lab-breathe">
        {/* robe, with gold trim and embroidery */}
        <path d="M34 150 Q30 104 40 82 Q60 74 80 82 Q90 104 86 150 Z" fill="url(#qeth-robe)" stroke="#3E4890" strokeWidth="1" />
        <path d="M60 80 L60 150" stroke="#C9B98F" strokeWidth="1.2" opacity="0.8" />
        <path d="M40 84 Q60 92 80 84" fill="none" stroke="#C9B98F" strokeWidth="1.6" />
        <g stroke="#6FC3A8" strokeWidth="0.8" fill="none" opacity="0.7" className="lab-glyphs">
          <path d="M48 104 l4 -4 l4 4 l-4 4 Z M64 104 l4 -4 l4 4 l-4 4 Z" />
          <path d="M47 120 h10 M63 120 h10 M52 116 v8 M68 116 v8" />
          <circle cx="52" cy="136" r="3" /><circle cx="68" cy="136" r="3" />
        </g>
        {/* pauldrons with crystals */}
        <path d="M34 90 Q36 78 48 78 L50 86 Q40 86 34 90 Z M86 90 Q84 78 72 78 L70 86 Q80 86 86 90 Z" fill="#2A3470" stroke="#C9B98F" strokeWidth="0.8" />
        <path d="M40 80 l2 -7 l2 7 Z M78 80 l2 -7 l2 7 Z" fill="#8FE6FF" filter="url(#qeth-glow)" className="lab-twinkle" />
        {/* the lower arms, folded, holding a lit orb */}
        <path d="M44 92 Q40 104 52 108 M76 92 Q80 104 68 108" fill="none" stroke="#3E9C82" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 108 l3 -1 M52 108 l3 1.5 M68 108 l-3 -1 M68 108 l-3 1.5" stroke="#9BF0D2" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="60" cy="106" r="6" fill="url(#qeth-orb)" filter="url(#qeth-glow)" className="lab-orb" />
        {/* the upper arms: one gestures when it speaks */}
        <g className="lab-qeth-gesture">
          <path d="M38 86 Q22 92 20 110" fill="none" stroke="#3E9C82" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M20 110 l-3 5 M20 110 l0 6 M20 110 l3 5" stroke="#9BF0D2" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <path d="M82 86 Q98 92 100 110" fill="none" stroke="#3E9C82" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M100 110 l-3 5 M100 110 l0 6 M100 110 l3 5" stroke="#9BF0D2" strokeWidth="1.2" strokeLinecap="round" />
        {/* the collar ring and its gem */}
        <ellipse cx="60" cy="78" rx="13" ry="4" fill="#1A2048" stroke="#C9B98F" strokeWidth="1.2" />
        <circle cx="60" cy="80" r="2.4" fill="#E8B4C8" filter="url(#qeth-glow)" className="lab-twinkle" />
        {/* the head */}
        <g className="lab-head-sway">
          <path d="M60 6 C76 6 84 22 82 40 C80 58 70 72 60 72 C50 72 40 58 38 40 C36 22 44 6 60 6 Z" fill="url(#qeth-skin)" stroke="#6FC3A8" strokeWidth="1" />
          {/* veins and cheek lights */}
          <path d="M46 30 Q50 44 47 56 M74 30 Q70 44 73 56 M60 12 L60 24" fill="none" stroke="#123A33" strokeWidth="0.8" opacity="0.6" />
          {[[44, 48], [45, 53], [47, 58], [76, 48], [75, 53], [73, 58]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.1" fill="#8FE6FF" className="lab-freckle" style={{ animationDelay: `${i * 0.25}s` }} />
          ))}
          {/* crown of filaments with lit tips */}
          <g className="lab-crown">
            {[[-18, 18], [-10, 9], [0, 4], [10, 9], [18, 18]].map(([dx, top], i) => (
              <g key={i} className="lab-filament" style={{ animationDelay: `${i * 0.3}s`, transformOrigin: `${60 + dx * 0.5}px 14px` }}>
                <path d={`M${60 + dx * 0.5} 14 Q${60 + dx * 0.9} ${top + 4} ${60 + dx} ${top - 8}`} fill="none" stroke="#E9D29A" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx={60 + dx} cy={top - 8} r="2" fill="#FFF4DC" filter="url(#qeth-glow)" />
              </g>
            ))}
          </g>
          {/* three eyes */}
          <g className="lab-blink">
            <path d="M43 38 Q50 31 56 38 Q50 45 43 38 Z" fill="#05040F" />
            <path d="M64 38 Q70 31 77 38 Q70 45 64 38 Z" fill="#05040F" />
            <g className="lab-look">
              <circle cx="50" cy="38" r="3.2" fill="url(#qeth-iris)" /><ellipse cx="50" cy="38" rx="0.9" ry="2.4" fill="#05040F" />
              <circle cx="70" cy="38" r="3.2" fill="url(#qeth-iris)" /><ellipse cx="70" cy="38" rx="0.9" ry="2.4" fill="#05040F" />
            </g>
            <circle cx="48.8" cy="36.6" r="0.9" fill="#fff" /><circle cx="68.8" cy="36.6" r="0.9" fill="#fff" />
            <ellipse cx="60" cy="25" rx="3" ry="4" fill="#05040F" />
            <ellipse cx="60" cy="25.4" rx="1.8" ry="2.6" fill="url(#qeth-iris)" />
            <circle cx="59.4" cy="24.2" r="0.6" fill="#fff" />
          </g>
          {/* nostrils and mouth */}
          <path d="M57.5 50 l0.8 2.4 M62.5 50 l-0.8 2.4" stroke="#123A33" strokeWidth="0.9" strokeLinecap="round" />
          <path className="lab-mouth" d="M53 60 Q60 64 67 60" fill="#0A1A18" stroke="#0A1A18" strokeWidth="1.4" strokeLinecap="round" />
          {/* light from above */}
          <ellipse cx="52" cy="16" rx="9" ry="4" fill="#ffffff" opacity="0.18" />
        </g>
      </g>
    </svg>
  );
}
function Ilu({ talking }) {
  return (
    <svg viewBox="0 0 120 150" className={`lab-alien lab-ilu ${talking ? "lab-alien-talk" : ""}`} aria-hidden="true">
      <defs>
        <radialGradient id="ilu-body" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFD8E8" /><stop offset="0.35" stopColor="#E89AC0" /><stop offset="0.75" stopColor="#8A3E6E" /><stop offset="1" stopColor="#3A1430" /></radialGradient>
        <radialGradient id="ilu-iris" cx="0.5" cy="0.5"><stop offset="0" stopColor="#0A0B1C" /><stop offset="0.28" stopColor="#0A0B1C" /><stop offset="0.32" stopColor="#8FE6FF" /><stop offset="0.7" stopColor="#4A6AE8" /><stop offset="1" stopColor="#2A1A6A" /></radialGradient>
        <radialGradient id="ilu-hover" cx="0.5" cy="0.5"><stop offset="0" stopColor="#8FE6FF" stopOpacity="0.7" /><stop offset="1" stopColor="#8FE6FF" stopOpacity="0" /></radialGradient>
        <filter id="ilu-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <ellipse className="lab-hover" cx="60" cy="140" rx="30" ry="6" fill="url(#ilu-hover)" />
      <g className="lab-bob">
        {/* seven tentacles, the middle one holding a tool */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const x = 36 + i * 8;
          const d = `M${x} 92 Q${x - 6 + i * 2} 112 ${x - 2 + i} 128 Q${x + 2} 136 ${x - 4 + i * 1.5} 140`;
          return (
            <g key={i} className="lab-tentacle" style={{ animationDelay: `${i * 0.18}s`, transformOrigin: `${x}px 92px` }}>
              <path d={d} fill="none" stroke="#B85A8E" strokeWidth={5 - Math.abs(i - 3) * 0.6} strokeLinecap="round" />
              <path d={d} fill="none" stroke="#F5C2DA" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1.5 4" opacity="0.8" />
              <circle cx={x - 4 + i * 1.5} cy="140" r="1.6" fill="#8FE6FF" filter="url(#ilu-glow)" className="lab-twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
            </g>
          );
        })}
        <g className="lab-tool">
          <path d="M88 108 Q102 104 104 94" fill="none" stroke="#B85A8E" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M104 94 l3 -6 M101 92 l6 3" stroke="#C9B98F" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="106" cy="89" r="2.2" fill="none" stroke="#C9B98F" strokeWidth="1.4" />
        </g>
        {/* the orb */}
        <circle cx="60" cy="70" r="32" fill="url(#ilu-body)" stroke="#F5C2DA" strokeWidth="1" />
        {/* spots */}
        {[[36, 60, 2.2], [40, 82, 1.6], [82, 58, 2], [84, 80, 2.4], [48, 94, 1.4], [74, 94, 1.6], [60, 42, 1.4]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#5A1E48" opacity="0.6" />
        ))}
        {[[34, 70], [86, 70], [60, 100]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.3" fill="#8FE6FF" filter="url(#ilu-glow)" className="lab-freckle" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
        {/* the great eye */}
        <g className="lab-blink" style={{ transformOrigin: "60px 66px" }}>
          <circle cx="60" cy="66" r="15" fill="#FFF4F8" stroke="#5A1E48" strokeWidth="1.6" />
          <g className="lab-look">
            <circle cx="61" cy="66" r="10" fill="url(#ilu-iris)" />
            {Array.from({ length: 12 }, (_, k) => {
              const a = (k / 12) * Math.PI * 2;
              return <path key={k} d={`M${61 + Math.cos(a) * 4} ${66 + Math.sin(a) * 4} L${61 + Math.cos(a) * 9} ${66 + Math.sin(a) * 9}`} stroke="#B9F0FF" strokeWidth="0.5" opacity="0.6" />;
            })}
            <circle cx="61" cy="66" r="3.4" fill="#05040F" className="lab-pupil" />
          </g>
          <circle cx="57" cy="62" r="2.4" fill="#fff" /><circle cx="64" cy="70" r="1" fill="#fff" opacity="0.8" />
        </g>
        {/* two small eyes */}
        <circle cx="42" cy="54" r="2.6" fill="#05040F" /><circle cx="42.6" cy="53.4" r="0.9" fill="#E9D29A" />
        <circle cx="79" cy="52" r="2.2" fill="#05040F" /><circle cx="79.5" cy="51.4" r="0.8" fill="#E9D29A" />
        {/* mouth */}
        <path className="lab-mouth" d="M52 88 Q60 93 68 88" fill="#2A0A20" stroke="#2A0A20" strokeWidth="1.6" strokeLinecap="round" />
        {/* antennae */}
        <path d="M54 39 Q50 24 40 18" fill="none" stroke="#E89AC0" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="40" cy="18" r="3" fill="#8FE6FF" filter="url(#ilu-glow)" className="lab-antenna" />
        <path d="M66 39 Q72 26 84 22" fill="none" stroke="#E89AC0" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="84" cy="22" r="2.4" fill="#E9D29A" filter="url(#ilu-glow)" className="lab-antenna" style={{ animationDelay: "0.7s" }} />
        {/* gloss */}
        <ellipse cx="46" cy="50" rx="10" ry="6" fill="#ffffff" opacity="0.32" transform="rotate(-30 46 50)" />
        <path d="M86 84 Q90 70 86 56" fill="none" stroke="#8FE6FF" strokeWidth="1.2" opacity="0.5" />
      </g>
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
