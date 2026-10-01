"use client";
import { useState } from "react";

// The Story Circle: the 6 C's, adapted from Aaron's Story Guide and Champion notes.
export const SIX_CS = [
  { c: "Character", line: "You are the lead character of your story. Every journey starts with who you are: your values, your world, and the story you've been told about yourself." },
  { c: "Challenge", line: "Something disrupts the ordinary world. Stepping into the unknown feels like a threat, and it's also the doorway to growth." },
  { c: "Choice", line: "Every story turns on a decision: chase what the world says you should want, or aim at what actually matters to you." },
  { c: "Cave", line: "The in-between. Every rite of passage has one: leaving the old behind before the new has fully arrived. It's where courage is found." },
  { c: "Change", line: "The turning point. Not because the world changed, but because you started seeing yourself, and it, differently." },
  { c: "Create", line: "You return with something to give. Your story becomes a direction for your life and a gift to the people around you." },
];

export default function SixCs() {
  const [on, setOn] = useState(0);
  const R = 120;
  const cx = 160;
  const cy = 160;
  const pts = SIX_CS.map((_, i) => {
    const a = (-90 + i * 60) * (Math.PI / 180);
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), a };
  });

  return (
    <div className="sos-circle-grid">
      <div className="sos-circle">
        <svg viewBox="0 0 320 320" role="img" aria-label="The Story Circle: Character, Challenge, Choice, Cave, Change, Create">
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#E2D6C5" strokeWidth="2" />
          <path
            d={`M ${cx} ${cy - R} A ${R} ${R} 0 ${on * 60 > 180 ? 1 : 0} 1 ${pts[on].x} ${pts[on].y}`}
            fill="none"
            stroke="#C25B34"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ display: on === 0 ? "none" : "block" }}
          />
          <line x1={cx - 70} y1={cy} x2={cx + 70} y2={cy} stroke="#E2D6C5" strokeDasharray="3 5" />
          <text x={cx} y={cy - 10} textAnchor="middle" fontSize="11" fill="#8C7F74" letterSpacing="2">KNOWN</text>
          <text x={cx} y={cy + 20} textAnchor="middle" fontSize="11" fill="#8C7F74" letterSpacing="2">UNKNOWN</text>
          {pts.map((p, i) => {
            const active = i === on;
            const lx = cx + (R + 0) * Math.cos(p.a);
            const ly = cy + (R + 0) * Math.sin(p.a);
            return (
              <g key={i} onClick={() => setOn(i)} style={{ cursor: "pointer" }}>
                <circle cx={lx} cy={ly} r={active ? 22 : 17} fill={active ? "#C25B34" : i < on ? "#F6E3D8" : "#FFFCF7"} stroke={i <= on ? "#C25B34" : "#E2D6C5"} strokeWidth="2" />
                <text x={lx} y={ly + 5} textAnchor="middle" fontSize={active ? 15 : 13} fontStyle="italic" fontFamily="Georgia, serif" fill={active ? "#fff" : "#5E534B"}>
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <ul className="sos-cs">
        {SIX_CS.map((s, i) => (
          <li key={s.c}>
            <button type="button" className={i === on ? "on" : ""} onClick={() => setOn(i)} aria-pressed={i === on}>
              <b>{i + 1}. {s.c}</b>
              {i === on && <small>{s.line}</small>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
