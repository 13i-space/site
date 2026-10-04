"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";

// The four ways into 13i on /launch, drawn as one path rather than four
// menu boxes: a thread runs through four markers that brighten as it goes,
// from the cool blue of discovering to the warm gold of finding the others.
// Each stop names what it is (one verb) and a few of the real places in it.
// Create is marked a little more strongly - it's what makes 13i different.
// Update 5.55: a light runs the thread - through all four markers, each one
// flaring as it passes - then arcs back around to the start and goes again
// (across the top on wide screens, down the left side on phones).
const STOPS = [
  {
    key: "explore", href: "/explore", title: "Explore", verb: "discover it",
    line: "The book, the music, 13i's own records, the galaxy they happen in.",
    places: [["The Book", "/book"], ["The Music", "/music"], ["Short Stories", "/assignments"], ["The Galaxy", "/galaxy"]],
    color: "#8B95F6",
  },
  {
    key: "play", href: "/play", title: "Play", verb: "step inside it",
    line: "Speak with 13i. Make its choices. Play the games its records left behind.",
    places: [["The Oracle", "/oracle"], ["Interactive Stories", "/assignments/interactive"], ["Games", "/games"], ["Artifacts", "/artifacts"]],
    color: "#B9C0FF",
  },
  {
    key: "create", href: "/create", title: "Create", verb: "add to it",
    line: "Build a species. Compose a signal. Write an Assignment. Dig into Mars with everyone else.",
    places: [["The Alien Lab", "/create/alien-lab"], ["Write an Assignment", "/assignments/write"], ["Signal Composer", "/create/signal-composer"], ["SpaceCore", "/create/spacecore"]],
    color: "#E8CFC0",
    marked: true,
  },
  {
    key: "kinship", href: "/kinship", title: "Kinship", verb: "find the others",
    line: "Where the Kin talk, leave word for each other, and write to one another directly.",
    places: [["The Forum", "/forum"], ["The Kinbook", "/kinbook"], ["Messages", "/messages"]],
    color: "#E9D29A",
  },
];

// The travelling light: measures where the four markers are, builds one
// loop through them (straight along the thread, arcing back), and moves a
// small comet around it, lighting each stop as it goes by.
function useJourneyLight(listRef, svgRef) {
  useEffect(() => {
    const list = listRef.current, svg = svgRef.current;
    if (!list || !svg) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const path = svg.querySelector(".journey-loop");
    const trail = svg.querySelector(".journey-loop-trail");
    const dots = [...svg.querySelectorAll(".journey-comet")];
    let pts = [], total = 0, raf = 0, start = performance.now(), stopsAt = [], straightF = 0.5;
    const stops = [...list.querySelectorAll(".journey-stop")];

    const build = () => {
      const box = list.getBoundingClientRect();
      pts = [...list.querySelectorAll(".journey-node")].map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      if (pts.length < 2) return;
      const a = pts[0], b = pts[pts.length - 1];
      const vertical = Math.abs(b.y - a.y) > Math.abs(b.x - a.x);
      const d = vertical
        ? `M${a.x},${a.y} L${b.x},${b.y} A 26 ${(b.y - a.y) / 2} 0 0 1 ${a.x},${a.y}`
        : `M${a.x},${a.y} L${b.x},${b.y} A ${(b.x - a.x) / 2} 34 0 0 0 ${a.x},${a.y}`;
      path.setAttribute("d", d);
      trail.setAttribute("d", d);
      total = path.getTotalLength();
      const straight = vertical ? b.y - a.y : b.x - a.x;
      stopsAt = pts.map((p) => (vertical ? p.y - a.y : p.x - a.x) / total);
      stopsAt.push(straight / total); // (last stop)
      straightF = straight / total;
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(list);

    // The pace (Update 5.57, Paul's call): the run across, Explore to
    // Kinship, at half the old speed; the arc back at three-quarters.
    const BASE_MS = 7200; // the old loop, at one even speed
    const tick = (now) => {
      if (total > 0) {
        const across = straightF * BASE_MS / 0.5, back = (1 - straightF) * BASE_MS / 0.75;
        const e = (now - start) % (across + back);
        const t = e < across ? straightF * (e / across) : straightF + (1 - straightF) * ((e - across) / back);
        dots.forEach((dot, k) => {
          const f = (t - k * 0.008 + 1) % 1;
          const p = path.getPointAtLength(f * total);
          dot.setAttribute("cx", p.x);
          dot.setAttribute("cy", p.y);
        });
        stops.forEach((el, i) => {
          const near = Math.abs(t - stopsAt[i]) < 0.035 || (i === 0 && t > 0.985);
          el.classList.toggle("journey-lit", near);
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [listRef, svgRef]);
}

export default function LaunchJourney() {
  const listRef = useRef(null);
  const svgRef = useRef(null);
  useJourneyLight(listRef, svgRef);
  return (
    <section id="journey" className="journey" aria-labelledby="journey-title">
      <h2 id="journey-title" className="mono journey-kicker">FOUR WAYS IN &middot; ONE PATH THROUGH</h2>
      <div className="journey-track" ref={listRef}>
        <svg className="journey-light" ref={svgRef} aria-hidden="true">
          <defs>
            <radialGradient id="journeyGlow">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="0.35" stopColor="#E9D29A" stopOpacity="0.9" />
              <stop offset="1" stopColor="#8B95F6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path className="journey-loop-trail" fill="none" />
          <path className="journey-loop" fill="none" stroke="none" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
            <circle key={k} className="journey-comet" r={k === 0 ? 9 : 6 - k * 0.6} fill="url(#journeyGlow)" opacity={1 - k * 0.11} cx="-50" cy="-50" />
          ))}
        </svg>
        <ol className="journey-path">
        {STOPS.map((s, i) => (
          <li key={s.key} className={`journey-stop${s.marked ? " journey-stop-marked" : ""}`} style={{ "--stop": s.color, "--i": i }}>
            <span className="journey-node" aria-hidden="true" />
            <div className="journey-body">
              <Link href={s.href} className="journey-head">
                <span className="wordmark journey-title">{s.title}</span>
                <span className="mono journey-verb">{s.verb}</span>
              </Link>
              <p className="journey-line">{s.line}</p>
              <ul className="journey-places">
                {s.places.map(([label, href]) => (
                  <li key={href}><Link href={href}>{label}</Link></li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      </div>
    </section>
  );
}
