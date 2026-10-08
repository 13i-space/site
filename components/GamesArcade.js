"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STORY_GAMES, openedStories } from "../lib/storyGames";
import { useSignedIn, signUpHref } from "./SignUpToPlay";

// The Games hub as an arcade (Update 5.58):
//   - a warm-up toy in the hero: rocks drift across the sky; click them
//   - "insert coin": a random game you can play right now
//   - a cabinet per game, each with its own little attract-mode screen
//     (GameScreen below, pure SVG + CSS), story games locked until their
//     story has been opened (lib/storyGames.js)

const ARCADE = [
  { href: "/games/nemesis-command", title: "NEMESIS Command", art: "nemesis", color: "#E87C6E", tag: "arcade", blurb: "Aim and fire. A fast, arcade take on NEMESIS's threat-elimination logic." },
  { href: "/games/asteroid-belt", title: "Asteroid Belt", art: "asteroids", color: "#B9C0FF", tag: "arcade", blurb: "Clear the belt, and watch for the mining ship's twelve tungsten rods." },
  { href: "/games/13i-vs-nemesis", title: "13i vs NEMESIS", art: "defend", color: "#8B95F6", tag: "arcade", blurb: "Defend Earth across five zones of approach, with weapons and countermeasures." },
];
const STORY_ART = { tacet: ["tacet", "#8FD3E8"], "deep-signal": ["signal", "#6FC3A8"], sixteen: ["sixteen", "#E8B4C8"], prism: ["prism", "#E9D29A"], rubato: ["rubato", "#E8CFC0"] };

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
          <h1 className="ga-title">Games</h1>
          <p className="ga-lede">Arcade classics from the NEMESIS files, and a game hidden in every short story. Read a story, unlock its game.</p>
          <button className="ga-coin" onClick={() => router.push(playable[Math.floor(Math.random() * playable.length)])}>
            <span className="ga-coin-slot" aria-hidden="true" /> Insert coin &middot; random game
          </button>
        </div>
      </section>

      <div className="ga-row-head">
        <h2>The arcade</h2>
        <span className="mono">{ARCADE.length} cabinets &middot; always open</span>
      </div>
      <div className="ga-grid">
        {ARCADE.map((g, i) => <Cabinet key={g.href} {...g} i={i} />)}
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

      <div className="ga-more">
        <Link href="/create/spacecore" className="ga-more-card"><span className="ga-more-title">SpaceCore</span><span className="mono">dig into Mars with everyone &rarr;</span></Link>
        <Link href="/assignments/interactive" className="ga-more-card"><span className="ga-more-title">Interactive Stories</span><span className="mono">make 13i&rsquo;s choices &rarr;</span></Link>
        <Link href="/quiz" className="ga-more-card"><span className="ga-more-title">Universe Quiz</span><span className="mono">ten signals &rarr;</span></Link>
        <Link href="/galaxy/aliens" className="ga-more-card"><span className="ga-more-title">Aliens of the Galaxy</span><span className="mono">survival tournament &amp; trials &rarr;</span></Link>
      </div>
    </div>
  );
}
