"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STORY_GAMES, openedStories } from "../lib/storyGames";
import { useSignedIn, signUpHref } from "./SignUpToPlay";

// The Arcade (Update 5.58; called Games until Update 6.01):
//   - a warm-up toy in the hero: rocks drift across the sky; click them
//   - "insert coin": a random game you can play right now
//   - a cabinet per game, each with its own little attract-mode screen
//     (GameScreen below, pure SVG + CSS), story games locked until their
//     story has been opened (lib/storyGames.js)

const ARCADE = [
  { href: "/games/asteroid-belt", title: "Asteroid Belt", art: "asteroids", color: "#B9C0FF", tag: "arcade", blurb: "Clear the belt, and watch for the mining ship's twelve tungsten rods." },
  { href: "/games/xenoklash", title: "XenoKlash", art: "xk", color: "#FF8A3D", tag: "fighting", blurb: "Alien gladiators, one on one. Three tournaments, a boss that keeps getting stronger, three fighters to unlock, and the Hollow King waiting at the top." },
  { href: "/games/xenowing", title: "XenoWing", art: "wing", color: "#6FE3C8", tag: "flying", blurb: "Fly Ixxen, Ilu, Qeth and Varrow from the Rave across five worlds, chase or cockpit view, and take down the Methane Wyrm." },
  { href: "/games/xenokart", title: "XenoKart", art: "kart", color: "#5FF0DC", tag: "racing", blurb: "Alien kart racing across nine worlds and two cups. Snapping plants, lightning, a road under the ice, raiders on the ridges." },
];
// Update 6.27: games being built in the open - playable, unfinished, greybox on purpose.
// Update 6.28: SalienT is the current build; the step-1 build stays playable alongside it.
const WORKSHOP = [
  { href: "/games/salient", title: "SalienT", art: "combat", color: "#B9C0FF", tag: "in the workshop", blurb: "The 13i alien hero shooter. Brontor, Skitter and Chephro the healer; team fights up to 4 v 4, a control point in the Tidal Basin and a Relic to push through Sunscar Rift. Watch out for the crawlers." },
  { href: "/games/alien-combat", title: "13i Alien Combat", art: "combat", color: "#8B95F6", tag: "step 1 build", blurb: "Where SalienT started: the Tidal Basin arena, movement and camera. Kept here to show how far it has come." },
];
const STORY_ART = { tacet: ["tacet", "#8FD3E8"], "deep-signal": ["signal", "#6FC3A8"], sixteen: ["sixteen", "#E8B4C8"], prism: ["prism", "#E9D29A"], rubato: ["rubato", "#E8CFC0"], "hold-fire": ["holdfire", "#E9A24A"], fermata: ["fermata", "#BFE6FF"], tutti: ["tutti", "#9FE3B0"], ritornello: ["ritornello", "#F3E6C8"] };

// ── the little screens ──
export function GameScreen({ art, color }) {
  const c = color;
  const common = { viewBox: "0 0 160 100", className: `gs gs-${art}`, "aria-hidden": true, style: { "--c": c } };
  switch (art) {
    case "nemesis":
      return (
        <svg {...common}>
          <g className="gs-sweep"><path d="M80 50 L160 20 A80 80 0 0 1 160 80 Z" fill={c} opacity="0.12" /></g>
          <circle cx="80" cy="50" r="30" fill="none" stroke={c} strokeWidth="0.8" opacity="0.5" />
          <circle cx="80" cy="50" r="14" fill="none" stroke={c} strokeWidth="0.8" opacity="0.5" />
          <path d="M80 12 V30 M80 70 V88 M42 50 H60 M100 50 H118" stroke={c} strokeWidth="1" />
          {[[30, 24], [128, 70], [118, 22]].map(([x, y], i) => <circle key={i} className="gs-blip" style={{ animationDelay: `${i * 0.7}s` }} cx={x} cy={y} r="2.4" fill={c} />)}
        </svg>
      );
    case "asteroids":
      return (
        <svg {...common}>
          {[[30, 30, 12], [118, 64, 16], [90, 22, 7], [50, 76, 9]].map(([x, y, r], i) => (
            <g key={i} className="gs-rock" style={{ animationDelay: `${-i * 2}s`, transformOrigin: `${x}px ${y}px` }}>
              <path d={`M${x - r} ${y} L${x - r * 0.4} ${y - r} L${x + r * 0.6} ${y - r * 0.8} L${x + r} ${y + r * 0.1} L${x + r * 0.3} ${y + r} L${x - r * 0.7} ${y + r * 0.7} Z`} fill="none" stroke={c} strokeWidth="1.2" />
            </g>
          ))}
          <g className="gs-ship"><path d="M76 56 L80 44 L84 56 L80 53 Z" fill="none" stroke="#fff" strokeWidth="1.2" /></g>
          <line className="gs-shot" x1="80" y1="42" x2="80" y2="36" stroke="#fff" strokeWidth="1.2" />
        </svg>
      );
    case "defend":
      return (
        <svg {...common}>
          <circle cx="80" cy="100" r="34" fill={c} opacity="0.18" />
          <circle cx="80" cy="100" r="34" fill="none" stroke={c} strokeWidth="1" />
          {[46, 58, 70].map((r, i) => <circle key={r} cx="80" cy="100" r={r} fill="none" stroke={c} strokeWidth="0.6" strokeDasharray="2 4" opacity={0.6 - i * 0.15} />)}
          {[0, 1, 2].map((i) => <circle key={i} className="gs-fall" style={{ animationDelay: `${i * 0.9}s`, "--x": `${40 + i * 38}px` }} r="2.6" fill="#E87C6E" />)}
        </svg>
      );
    case "xk":
      // Kharn and Vess mid-clash in the Rift Colosseum, fighting-game health bars overhead
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="gsxk-floor"><stop offset="0" stopColor={c} stopOpacity="0.35" /><stop offset="1" stopColor={c} stopOpacity="0" /></radialGradient>
            <linearGradient id="gsxk-k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFB07A" /><stop offset="1" stopColor="#6A2E14" /></linearGradient>
            <linearGradient id="gsxk-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#DAFF8E" /><stop offset="1" stopColor="#24563A" /></linearGradient>
          </defs>
          <path d="M0 68 Q80 56 160 68 L160 100 L0 100 Z" fill="#0A0B22" />
          {[22, 51, 80, 109, 138].map((x, i) => (
            <g key={x}>
              <path d={`M${x - 11} 66 L${x - 11} 52 Q${x} 40 ${x + 11} 52 L${x + 11} 66`} fill="none" stroke="#B9C0FF" strokeWidth="0.6" opacity="0.22" />
              <circle className="gs-blip" style={{ animationDelay: `${i * 0.35}s` }} cx={x} cy="49" r="1.3" fill="#E9D29A" />
            </g>
          ))}
          <ellipse cx="80" cy="82" rx="76" ry="11" fill="url(#gsxk-floor)" />
          <rect x="8" y="7" width="60" height="4" rx="1" fill="#1A1D40" /><rect x="8" y="7" width="41" height="4" rx="1" fill={c} />
          <rect x="92" y="7" width="60" height="4" rx="1" fill="#1A1D40" /><rect x="105" y="7" width="47" height="4" rx="1" fill="#B8FF5A" />
          <text x="80" y="12" textAnchor="middle" fontSize="6.5" fill="#E9D29A" fontFamily="monospace" fontWeight="700" letterSpacing="1">VS</text>
          <g className="gs-lunge-l">
            <path d="M40 49 L35 35 L44 46 Z M46 45 L45 31 L51 43 Z M52 46 L56 35 L56 47 Z" fill="#C890FF" opacity="0.9" />
            <path d="M40 52 L31 60 L35 64 L44 57 Z" fill="url(#gsxk-k)" />
            <path d="M40 72 L37 84 L46 84 L46 72 Z M52 72 L54 84 L62 84 L58 72 Z" fill="url(#gsxk-k)" />
            <path d="M36 72 Q31 58 39 48 Q48 41 57 48 Q63 57 59 72 Z" fill="url(#gsxk-k)" stroke="#FFB07A" strokeWidth="0.5" />
            <path d="M42 56 L47 61 L45 66 M51 52 L53 58" fill="none" stroke="#FF7A2A" strokeWidth="0.9" />
            <path d="M55 51 L68 50 L68 57 L56 58 Z" fill="url(#gsxk-k)" />
            <path d="M67 47.5 L75 48 L75.5 58 L67 59 Z" fill="#8A4A2A" stroke="#FFB07A" strokeWidth="0.5" />
            <path d="M50 46 Q50 37 56 37 Q63 38 62 46 Q59 50 52 49 Z" fill="url(#gsxk-k)" />
            <circle cx="57" cy="42.5" r="1.3" fill="#FFE070" /><circle cx="60.5" cy="42.5" r="1.1" fill="#FFE070" />
          </g>
          <g className="gs-lunge-r">
            <path className="gs-buzz" d="M112 53 Q134 40 142 51 Q128 57 114 57 Z M113 56 Q132 54 138 63 Q124 63 114 60 Z" fill="#CFFFE0" opacity="0.28" />
            <ellipse cx="121" cy="71" rx="11" ry="5" transform="rotate(-18 121 71)" fill="url(#gsxk-v)" />
            <path d="M108 72 L102 84 M112 72 L117 84 M117 70 L127 84" stroke="#9BE07A" strokeWidth="1.2" fill="none" />
            <path d="M104 73 Q101 60 106 49 L112 49 Q115 60 112 73 Z" fill="url(#gsxk-v)" stroke="#DAFF8E" strokeWidth="0.5" />
            <path d="M105 54 L95 50 L91 46" stroke="#9BE07A" strokeWidth="1.6" fill="none" />
            <path d="M91 46 Q83 39 78 48 Q85 44 92 49 Z" fill="#F4FFD0" />
            <path d="M107 59 L97 61" stroke="#9BE07A" strokeWidth="1.4" fill="none" />
            <path d="M97 61 Q89 62 86 69 Q92 65 98 63 Z" fill="#F4FFD0" />
            <path d="M100 44 L115 42 L108 53 Z" fill="url(#gsxk-v)" />
            <circle cx="103.5" cy="45" r="2.3" fill="#E8FF9A" /><circle cx="111.5" cy="44" r="2.3" fill="#E8FF9A" />
            <path d="M106 42 Q102 32 95 30 M110 42 Q113 31 121 28" stroke="#9BE07A" strokeWidth="0.7" fill="none" />
          </g>
          <g className="gs-clash">
            <path d="M77 50 L80 42 L80.5 49 L88 46 L82 51.5 L88 57 L80 54 L77 61 L76 53.5 L68 55 L74 50 L69 44 Z" fill="#FFE2A0" />
            <circle cx="77.5" cy="50.5" r="9" fill="none" stroke="#FFE2A0" strokeWidth="0.6" />
          </g>
        </svg>
      );
    case "wing":
      // chase cam over a canyon at night: aurora, a gold ring coming up, the skimmer banking, plasma bolts, a stinger
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="gsw-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#06071A" /><stop offset="1" stopColor="#3A2A5A" /></linearGradient>
            <linearGradient id="gsw-aur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} stopOpacity="0" /><stop offset="0.6" stopColor={c} stopOpacity="0.45" /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient>
            <linearGradient id="gsw-wing" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2A3170" /><stop offset="0.5" stopColor="#1A1F52" /><stop offset="1" stopColor="#2A3170" /></linearGradient>
          </defs>
          <rect width="160" height="100" fill="url(#gsw-sky)" />
          <g className="gs-aurora">{[20, 44, 70, 98, 124].map((x, i) => <rect key={x} x={x} y="0" width="9" height={30 + (i % 2) * 10} fill="url(#gsw-aur)" />)}</g>
          {[[12, 10], [52, 6], [88, 14], [140, 8], [150, 26]].map(([x, y], i) => <circle key={i} className="gs-blip" style={{ animationDelay: `${i * 0.5}s` }} cx={x} cy={y} r="0.7" fill="#fff" />)}
          <path d="M0 100 L0 40 L22 34 L38 46 L58 50 L68 52 L60 100 Z" fill="#2A2238" />
          <path d="M160 100 L160 36 L134 30 L118 44 L100 50 L92 52 L100 100 Z" fill="#241C32" />
          <path d="M58 50 L68 52 L60 100 L40 100 Z M102 50 L92 52 L100 100 L120 100 Z" fill="#1A1626" />
          <path d="M68 52 L92 52 L100 100 L60 100 Z" fill="#0E1A22" />
          <path className="gs-road" d="M80 52 L80 100" stroke={c} strokeWidth="0.6" strokeDasharray="2 6" opacity="0.5" />
          <g className="gs-ring"><ellipse cx="80" cy="44" rx="9" ry="10" fill="none" stroke="#E9D29A" strokeWidth="1.6" /><ellipse cx="80" cy="44" rx="6.5" ry="7.5" fill="none" stroke={c} strokeWidth="0.5" /></g>
          <g className="gs-sting"><path d="M118 24 l4 -2 l4 2 l-4 1.4 Z" fill="#FF5A3A" /><circle cx="122" cy="23.4" r="2.6" fill="#FF5A3A" opacity="0.25" /></g>
          <line className="gs-bolt" x1="72" y1="66" x2="74" y2="58" stroke="#8FFFE6" strokeWidth="1.2" />
          <line className="gs-bolt" style={{ animationDelay: ".12s" }} x1="88" y1="66" x2="86" y2="58" stroke="#8FFFE6" strokeWidth="1.2" />
          <g className="gs-bank">
            <path d="M80 64 C72 66 62 72 50 80 L56 82 C64 78 72 76 78 76 Z M80 64 C88 66 98 72 110 80 L104 82 C96 78 88 76 82 76 Z" fill="url(#gsw-wing)" stroke={c} strokeWidth="0.6" />
            <path d="M52 80 L62 76 M108 80 L98 76" stroke="#E9D29A" strokeWidth="0.7" />
            <ellipse cx="80" cy="72" rx="4.6" ry="9" fill="#1E2460" stroke="#8FE6FF" strokeWidth="0.5" />
            <ellipse cx="80" cy="67" rx="2.4" ry="3.4" fill="#C8F0FF" opacity="0.5" />
            <circle cx="74" cy="80" r="1.8" fill={c} className="gs-flame" /><circle cx="86" cy="80" r="1.8" fill={c} className="gs-flame" />
          </g>
          <path className="gs-speed" d="M6 70 L0 76 M154 70 L160 76 M16 86 L4 96 M144 86 L156 96" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
        </svg>
      );
    case "kart":
      // chase cam down a glowing track: kerbs and lane lines rushing past, a rival ahead, an item cube
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="gsk-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0E0C2C" /><stop offset="1" stopColor="#4A2546" /></linearGradient>
            <linearGradient id="gsk-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141836" /><stop offset="1" stopColor="#22284E" /></linearGradient>
          </defs>
          <rect width="160" height="47" fill="url(#gsk-sky)" />
          {[[14, 8], [36, 20], [58, 6], [104, 12], [150, 30], [92, 26]].map(([x, y], i) => <circle key={i} className="gs-blip" style={{ animationDelay: `${i * 0.4}s` }} cx={x} cy={y} r="0.7" fill="#fff" />)}
          <circle cx="128" cy="20" r="9" fill="#FFD6AA" opacity="0.9" />
          <ellipse cx="128" cy="20" rx="15" ry="3" fill="none" stroke="#FFD6AA" strokeWidth="0.7" opacity="0.6" transform="rotate(-14 128 20)" />
          <path d="M0 47 L40 41 L64 45 L96 42 L124 44 L160 40 L160 47 Z" fill="#1A1238" />
          <rect y="47" width="160" height="53" fill="#0C0A1E" />
          <path d="M71 47 L89 47 L160 100 L0 100 Z" fill="url(#gsk-road)" />
          <path className="gs-road" d="M71 47 L0 100" stroke="#FF7A4A" strokeWidth="2.6" strokeDasharray="4 4" />
          <path className="gs-road" d="M89 47 L160 100" stroke="#FF7A4A" strokeWidth="2.6" strokeDasharray="4 4" />
          <path className="gs-road" d="M80 47 L80 100" stroke={c} strokeWidth="1.2" strokeDasharray="3 6" />
          <path className="gs-road" d="M76 47 L52 100 M84 47 L108 100" stroke={c} strokeWidth="0.5" strokeDasharray="2 7" opacity="0.5" />
          <g className="gs-spin" style={{ transformOrigin: "63px 60px", animationDuration: "3s" }}><rect x="59.5" y="56.5" width="7" height="7" fill={c} fillOpacity="0.25" stroke="#B9FFF4" strokeWidth="0.7" /></g>
          <g className="gs-rival">
            <rect x="86" y="55" width="10" height="4" rx="1.5" fill="#C07CFF" />
            <circle cx="91" cy="54.5" r="1.8" fill="#E8D0FF" />
            <path d="M88.5 59 L90 62 L91.5 59 Z M91 59 L92.5 62 L94 59 Z" fill="#7FF0FF" className="gs-flame" />
          </g>
          <g className="gs-drift">
            <path d="M58 92 L64 79 L96 79 L102 92 Z" fill="#2A2E52" stroke={c} strokeWidth="0.8" />
            <path d="M55 88 L60 82 L63 92 Z M105 88 L100 82 L97 92 Z" fill="#3A3F6E" />
            <ellipse cx="80" cy="78" rx="8" ry="6" fill="#FF8A3D" />
            <circle cx="77" cy="74" r="1.4" fill="#1A0E08" /><circle cx="83" cy="74" r="1.4" fill="#1A0E08" />
            <path d="M75 72 L72 66 M85 72 L88 66" stroke="#FF8A3D" strokeWidth="1" />
            <rect x="64" y="86" width="5" height="2" fill="#FF5A5A" /><rect x="91" y="86" width="5" height="2" fill="#FF5A5A" />
            <path className="gs-flame" d="M70 92 L74 100 L78 92 Z M82 92 L86 100 L90 92 Z" fill="#7FF0FF" />
          </g>
          <path className="gs-speed" d="M8 60 L0 66 M152 60 L160 66 M18 74 L4 86 M142 74 L156 86" stroke="#fff" strokeWidth="0.6" opacity="0.5" />
        </svg>
      );
    case "tacet":
      return (
        <svg {...common}>
          <rect x="0" y="40" width="160" height="60" fill={c} opacity="0.08" />
          <line x1="0" y1="40" x2="160" y2="40" stroke={c} strokeWidth="1" opacity="0.6" />
          {[0, 1, 2].map((i) => <circle key={i} className="gs-ripple" style={{ animationDelay: `${i}s` }} cx="80" cy="40" r="6" fill="none" stroke={c} strokeWidth="1" />)}
          {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={16 + i * 16} cy={70 + (i % 2) * 6} r="2" fill={c} opacity="0.7" />)}
        </svg>
      );
    case "signal":
      return (
        <svg {...common}>
          <path className="gs-wave" d="M0 50 Q10 30 20 50 T40 50 T60 50 T80 50 T100 50 T120 50 T140 50 T160 50 T180 50 T200 50" fill="none" stroke={c} strokeWidth="1.4" />
          <path d="M0 86 L30 80 L50 84 L80 72 L110 82 L130 76 L160 84 L160 100 L0 100 Z" fill={c} opacity="0.15" />
          <circle className="gs-blip" cx="120" cy="30" r="3" fill={c} />
        </svg>
      );
    case "sixteen":
      return (
        <svg {...common}>
          <circle cx="80" cy="50" r="8" fill={c} opacity="0.85" />
          <g className="gs-spin">
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2;
              return <circle key={i} className="gs-limb" style={{ animationDelay: `${i * 0.12}s` }} cx={80 + Math.cos(a) * 30} cy={50 + Math.sin(a) * 30} r="3" fill={c} />;
            })}
          </g>
        </svg>
      );
    case "prism":
      return (
        <svg {...common}>
          <path className="gs-beam" d="M0 60 L70 50 L160 30" fill="none" stroke="#fff" strokeWidth="1.4" />
          <g className="gs-spin" style={{ transformOrigin: "70px 50px" }}><path d="M70 36 L82 58 L58 58 Z" fill={c} opacity="0.3" stroke={c} strokeWidth="1.2" /></g>
          <path d="M70 50 L160 44 M70 50 L160 58 M70 50 L160 70" stroke={c} strokeWidth="0.8" opacity="0.6" />
        </svg>
      );
    case "rubato":
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} className="gs-msg" style={{ animationDelay: `${i * 0.8}s`, "--y": `${16 + i * 20}px` }}>
              <rect x="0" y="0" width="34" height="9" rx="4.5" fill={i % 3 === 1 ? "#E9D29A" : "#E87C6E"} opacity="0.85" />
            </g>
          ))}
          <circle cx="80" cy="50" r="12" fill="none" stroke={c} strokeWidth="1" strokeDasharray="3 3" className="gs-spin" style={{ transformOrigin: "80px 50px" }} />
        </svg>
      );
    case "holdfire":
      return (
        <svg {...common}>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} className="gs-bend" style={{ animationDelay: `${i * 0.55}s` }} d={i % 2 ? "M160 10 L104 40 Q96 46 110 70 L130 100" : "M0 90 L56 60 Q64 54 50 30 L30 0"} fill="none" stroke={c} strokeWidth="1.4" />
          ))}
          <circle cx="80" cy="50" r="16" fill="none" stroke="#8B95F6" strokeWidth="1" className="gs-blip" />
          <circle cx="80" cy="50" r="5" fill="none" stroke="#B9C0FF" strokeWidth="1.4" />
        </svg>
      );
    case "fermata":
      return (
        <svg {...common}>
          <ellipse cx="96" cy="52" rx="56" ry="22" fill="none" stroke={c} strokeWidth="0.8" strokeDasharray="2 4" opacity="0.7" />
          <circle cx="46" cy="52" r="10" fill="#FFD98A" opacity="0.15" />
          <circle cx="46" cy="52" r="3" fill="#FFF4DC" />
          <g className="gs-spin" style={{ transformOrigin: "96px 52px", animationDuration: "6s" }}><circle cx="40" cy="52" r="2.4" fill={c} /></g>
          <path d="M70 22 A10 10 0 0 1 90 22" fill="none" stroke="#F6E3B4" strokeWidth="1.2" /><circle cx="80" cy="20" r="1.4" fill="#F6E3B4" />
        </svg>
      );
    case "tutti":
      return (
        <svg {...common}>
          {[[34, 30, "#7FD6E8"], [80, 70, "#9FE3B0"], [126, 34, "#F2C14E"], [60, 52, "#E8A4C8"], [110, 74, "#8B95F6"]].map(([x, y, col], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="8" fill="#0c1a12" stroke={col} strokeWidth="2.4" />
              <circle cx={x} cy={y} r="2.6" fill={col} className="gs-blip" style={{ animationDelay: `${i * 0.4}s` }} />
            </g>
          ))}
          <path d="M34 30 L60 52 L80 70 L110 74 M126 34 L80 70" stroke={c} strokeWidth="0.9" opacity="0.6" className="gs-beam" fill="none" />
        </svg>
      );
    case "ritornello":
      return (
        <svg {...common}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a0 = -Math.PI / 2 + (i - 0.45) * (Math.PI / 3), a1 = -Math.PI / 2 + (i + 0.45) * (Math.PI / 3);
            return <path key={i} className="gs-blip" style={{ animationDelay: `${i * 0.33}s` }} d={`M${80 + 30 * Math.cos(a0)} ${50 + 30 * Math.sin(a0)} A30 30 0 0 1 ${80 + 30 * Math.cos(a1)} ${50 + 30 * Math.sin(a1)}`} fill="none" stroke={c} strokeWidth="5" />;
          })}
          <circle cx="80" cy="50" r="4" fill="none" stroke="#B9C0FF" strokeWidth="1.2" />
        </svg>
      );
    case "combat":
      // over the shoulder in the Tidal Basin: a grid floor, the moat's glow, the island, a crosshair
      return (
        <svg {...common}>
          <rect width="160" height="100" fill="#0A0B1C" />
          {[[14, 8], [40, 16], [72, 6], [104, 14], [138, 9], [150, 22]].map(([x, y], i) => <circle key={i} className="gs-blip" style={{ animationDelay: `${i * 0.6}s` }} cx={x} cy={y} r="0.7" fill="#fff" />)}
          <path d="M0 100 L0 52 L160 52 L160 100 Z" fill="#1E2250" />
          {[-60, -30, 0, 30, 60].map((d) => <path key={d} d={`M${80 + d * 0.5} 52 L${80 + d * 2.4} 100`} stroke={c} strokeWidth="0.4" opacity="0.35" />)}
          {[60, 70, 84].map((y) => <path key={y} d={`M0 ${y} H160`} stroke={c} strokeWidth="0.4" opacity="0.3" />)}
          <path d="M44 56 L116 56 L124 62 L36 62 Z" fill="#2A4F9E" opacity="0.8" />
          <rect x="64" y="46" width="32" height="12" fill="#4B5290" />
          <path d="M74 58 L86 58 L90 70 L70 70 Z" fill="#6E76B8" />
          <rect x="16" y="34" width="12" height="28" fill="#3A3F78" />
          <rect x="132" y="34" width="12" height="28" fill="#3A3F78" />
          <rect x="44" y="64" width="16" height="36" rx="8" fill={c} />
          <circle cx="86" cy="52" r="3.4" fill="none" stroke="#E9EBFF" strokeWidth="0.7" />
          <circle cx="86" cy="52" r="0.7" fill="#E9EBFF" />
        </svg>
      );
    default:
      return <svg {...common}><circle cx="80" cy="50" r="20" fill={c} opacity="0.3" /></svg>;
  }
}

// ── the warm-up toy in the hero ──
function WarmUp() {
  const ref = useRef(null);
  const [score, setScore] = useState(0);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, raf = 0;
    const rocks = [], sparks = [], stars = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random() }));
    const resize = () => { dpr = Math.min(2, window.devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const spawn = () => {
      const r = 10 + Math.random() * 22, fromLeft = Math.random() < 0.5;
      const pts = Array.from({ length: 9 }, (_, i) => 0.7 + Math.random() * 0.35);
      rocks.push({ x: fromLeft ? -r : W + r, y: 20 + Math.random() * (H - 40), vx: (fromLeft ? 1 : -1) * (0.3 + Math.random() * 0.8), vy: (Math.random() - 0.5) * 0.3, r, a: 0, va: (Math.random() - 0.5) * 0.03, pts, gold: Math.random() < 0.12 });
    };
    for (let i = 0; i < 5; i++) { spawn(); rocks[i].x = Math.random() * W; }
    const hit = (e) => {
      const b = cv.getBoundingClientRect(); const x = e.clientX - b.left, y = e.clientY - b.top;
      for (let i = rocks.length - 1; i >= 0; i--) {
        const k = rocks[i];
        if (Math.hypot(k.x - x, k.y - y) < k.r + 6) {
          for (let j = 0; j < 22; j++) { const a = Math.random() * 6.28, s = 1 + Math.random() * 3; sparks.push({ x: k.x, y: k.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, gold: k.gold }); }
          rocks.splice(i, 1);
          setScore((n) => n + (k.gold ? 5 : 1));
          return;
        }
      }
    };
    cv.addEventListener("pointerdown", hit);
    const tick = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => {
        if (!reduced) { s.x -= 0.0002 + s.z * 0.0006; if (s.x < 0) s.x += 1; }
        ctx.fillStyle = `rgba(200,205,255,${0.25 + s.z * 0.6})`;
        ctx.fillRect(s.x * W, s.y * H, 1 + s.z, 1 + s.z);
      });
      if (rocks.length < 7 && Math.random() < 0.02) spawn();
      for (let i = rocks.length - 1; i >= 0; i--) {
        const k = rocks[i];
        if (!reduced) { k.x += k.vx; k.y += k.vy; k.a += k.va; }
        if (k.x < -60 || k.x > W + 60) { rocks.splice(i, 1); continue; }
        ctx.save(); ctx.translate(k.x, k.y); ctx.rotate(k.a);
        ctx.beginPath();
        k.pts.forEach((p, j) => { const a = (j / k.pts.length) * 6.283; const px = Math.cos(a) * k.r * p, py = Math.sin(a) * k.r * p; j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
        ctx.closePath();
        ctx.fillStyle = k.gold ? "rgba(233,210,154,0.18)" : "rgba(139,149,246,0.08)";
        ctx.fill();
        ctx.strokeStyle = k.gold ? "#E9D29A" : "rgba(185,192,255,0.75)";
        ctx.lineWidth = 1.3; ctx.stroke();
        ctx.restore();
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]; p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; p.life -= 0.025;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.fillStyle = p.gold ? `rgba(233,210,154,${p.life})` : `rgba(220,223,255,${p.life})`;
        ctx.fillRect(p.x, p.y, 2, 2);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); cv.removeEventListener("pointerdown", hit); };
  }, []);
  return (
    <>
      <canvas ref={ref} className="ga-warmup" aria-label="Warm-up: click the drifting rocks" />
      <div className="mono ga-score" aria-live="polite">{score ? <>warm-up <b>{String(score).padStart(3, "0")}</b>{score >= 25 ? " · you're ready" : ""}</> : "warm up: click the rocks · gold ones are worth 5"}</div>
    </>
  );
}

function Cabinet({ href, title, blurb, art, color, tag, locked, lockNote, i }) {
  return (
    <Link href={href} className={`ga-cab ${locked ? "ga-cab-locked" : ""}`} style={{ "--c": color, "--i": i }}>
      <span className="mono ga-marquee">{tag}</span>
      <span className="ga-screen">
        <GameScreen art={art} color={color} />
        {locked && <span className="ga-lock"><span className="mono">sealed</span></span>}
        <span className="ga-scan" aria-hidden="true" />
      </span>
      <span className="ga-cab-title">{locked ? "? ? ?" : title}</span>
      <span className="ga-cab-blurb">{locked ? lockNote : blurb}</span>
      <span className="mono ga-cab-go">{locked ? "read to unlock →" : "press start →"}</span>
    </Link>
  );
}

export default function GamesArcade() {
  const router = useRouter();
  const [opened, setOpened] = useState(null);
  const signedIn = useSignedIn();
  useEffect(() => {
    let cancelled = false;
    openedStories().then((set) => { if (!cancelled) setOpened(set); });
    return () => { cancelled = true; };
  }, []);

  const story = STORY_GAMES.map((g) => {
    const [art, color] = STORY_ART[g.game] || ["default", "#B9C0FF"];
    const unlocked = signedIn && opened && opened.has(g.assignment);
    return {
      key: g.href, art, color, tag: g.story,
      title: g.title, blurb: g.blurb,
      locked: !unlocked,
      href: unlocked ? g.href : signedIn === false ? signUpHref(g.href) : g.storyHref,
      lockNote: signedIn === false ? `Sign up free, then read ${g.story} to unlock it.` : `Read ${g.story} to unlock this game.`,
    };
  });
  const playable = [...ARCADE.map((g) => g.href), ...story.filter((g) => !g.locked).map((g) => g.href)];
  const unlockedCount = story.filter((g) => !g.locked).length;

  return (
    <div className="ga">
      <section className="ga-hero">
        <WarmUp />
        <div className="ga-hero-text">
          <div className="mono ga-kicker">play &middot; the arcade</div>
          <h1 className="ga-title">Arcade</h1>
          <p className="ga-lede">Arcade classics from the NEMESIS files, an alien fighting tournament, a flight across five worlds with the Rave&rsquo;s four aliens, an alien Grand Prix, and a game hidden in every short story. Read a story, unlock its game.</p>
          <button className="ga-coin" onClick={() => router.push(playable[Math.floor(Math.random() * playable.length)])}>
            <span className="ga-coin-slot" aria-hidden="true" /> Insert coin &middot; random game
          </button>
        </div>
      </section>

      <div className="ga-row-head">
        <h2>The arcade</h2>
        <span className="mono">{ARCADE.length} cabinets &middot; always open</span>
      </div>
      <div className="ga-grid ga-grid-4">
        {ARCADE.map((g, i) => <Cabinet key={g.href} {...g} i={i} />)}
      </div>

      <div className="ga-row-head">
        <h2>In the workshop</h2>
        <span className="mono">playable &middot; unfinished &middot; changing</span>
      </div>
      <div className="ga-grid">
        {WORKSHOP.map((g, i) => <Cabinet key={g.href} {...g} i={i} />)}
      </div>

      <div className="ga-row-head">
        <h2>Games from the short stories</h2>
        <span className="mono">{opened && signedIn !== null ? `${unlockedCount} of ${story.length} unlocked` : " "}</span>
      </div>
      <p className="ga-row-note">
        Every Assignment leaves something behind. <Link href="/assignments">Read the short stories</Link> to open their games{signedIn === false ? " (free account needed)" : ""}.
      </p>
      <div className="ga-grid">
        {story.map((g, i) => <Cabinet key={g.key} {...g} i={i} />)}
      </div>

      <div className="ga-row-head">
        <h2>Other Games to Play</h2>
        <span className="mono">elsewhere on 13i.space</span>
      </div>
      <div className="ga-more">
        <Link href="/create/spacecore" className="ga-more-card"><span className="ga-more-title">SpaceCore</span><span className="mono">dig into Mars with everyone &rarr;</span></Link>
        <Link href="/assignments/interactive" className="ga-more-card"><span className="ga-more-title">Interactive Stories</span><span className="mono">make 13i&rsquo;s choices &rarr;</span></Link>
        <Link href="/quiz" className="ga-more-card"><span className="ga-more-title">Universe Quiz</span><span className="mono">ten signals &rarr;</span></Link>
        <Link href="/galaxy/aliens" className="ga-more-card"><span className="ga-more-title">Aliens of the Galaxy</span><span className="mono">survival tournament &amp; trials &rarr;</span></Link>
      </div>
    </div>
  );
}
