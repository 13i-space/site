"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { playFlip } from "../lib/cardSound";

// Galaxy Facts, as eight things to play with rather than a table to read -
// built for a curious sixth grader. Each station has a hands-on piece and a
// "Go deeper" drawer; opening all eight (flipping every card counts for the
// last one) earns the Cosmic Explorer badge, remembered in this browser.
//
// Numbers are commonly cited estimates (NASA, ESA); scale comparisons are
// rounded so they stay memorable.

const DISCOVERY_KEY = "galaxy_discoveries";
const STATIONS = ["address", "zoom", "light", "stars", "moving", "blackhole", "collision", "believe"];

const fmt = (n) => Math.round(n).toLocaleString("en-US");

// ---------------------------------------------------------------------------
// shared pieces

function Station({ n, id, title, hook, children, deeper, found, onDiscover }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="gx-station" id={id}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
        <span className="mono" style={{ fontSize: 11, color: found ? "#6FC3A8" : "#565B8F", letterSpacing: "1px" }}>
          {found ? "✓" : String(n).padStart(2, "0")}
        </span>
        <h2 className="gx-title">{title}</h2>
      </div>
      <p className="gx-hook">{hook}</p>
      {children}
      {deeper && (
        <>
          <button
            className="mono gx-deeper-btn"
            onClick={() => { setOpen((o) => !o); if (!open) onDiscover(id); }}
            aria-expanded={open}
          >
            {open ? "▾ close" : "▸ go deeper"}
          </button>
          {open && <div className="gx-deeper">{deeper}</div>}
        </>
      )}
    </section>
  );
}

const Fact = ({ children }) => <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.65, color: "#C7CAE8" }}>{children}</p>;
const Big = ({ children, color = "#F1E6CE" }) => (
  <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: "clamp(26px, 4vw, 38px)", color, lineHeight: 1.1 }}>{children}</span>
);

// ---------------------------------------------------------------------------
// 1. Your cosmic address

const ADDRESS = [
  { line: "You", note: "One person, reading this. Made of atoms forged inside stars that lived and died before the Sun was born." },
  { line: "Planet Earth", note: "The third planet from the Sun, and so far the only place we know of with life." },
  { line: "The Solar System", note: "The Sun, eight planets, their moons, and trillions of icy leftovers stretching far past Pluto." },
  { line: "The Orion Arm", note: "A minor spiral arm of the Milky Way - more of a spur between two big arms. The Sun sits about 26,000 light-years from the center." },
  { line: "The Milky Way Galaxy", note: "A barred spiral of 100-400 billion stars, about 100,000 light-years across." },
  { line: "The Local Group", note: "Our galaxy's neighborhood: the Milky Way, Andromeda, Triangulum and 80-plus small galaxies." },
  { line: "The Virgo Supercluster", note: "A vast collection of galaxy groups, including ours." },
  { line: "Laniakea", note: "A supercluster of about 100,000 galaxies, mapped in 2014. Its name is Hawaiian for “immeasurable heaven.”" },
  { line: "The Observable Universe", note: "Everything whose light has had time to reach us - about 93 billion light-years across." },
];

function Address() {
  const [open, setOpen] = useState(0);
  return (
    <div className="gx-envelope">
      <div className="mono" style={{ fontSize: 9.5, letterSpacing: "2px", color: "#8B95F6", marginBottom: 10 }}>TO: YOU &middot; tap each line</div>
      {ADDRESS.map((a, i) => (
        <button key={a.line} onClick={() => setOpen(i)} className="gx-address-line" style={{ paddingLeft: i * 10, color: open === i ? "#F1E6CE" : "#B9C0FF" }}>
          <span>{a.line}</span>
          {open === i && <span style={{ display: "block", fontSize: 13, color: "#8A8FBF", fontFamily: "'Inter', sans-serif", marginTop: 4, lineHeight: 1.55 }}>{a.note}</span>}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. The cosmic zoom

const ZOOM = [
  { name: "You", size: "about 1.7 meters tall", color: "#E8CFC0", line: "Start here. Everything else is measured against you.", deeper: "Your body contains about 7 octillion atoms - a 7 with 27 zeros." },
  { name: "Earth", size: "12,742 km across", color: "#6FC3A8", line: "About 7.5 million people lying head-to-toe would stretch across Earth.", deeper: "At the equator, Earth's spin carries you around at up to 1,670 km per hour - and you don't feel a thing." },
  { name: "The Sun", size: "1.39 million km across", color: "#E9D29A", line: "109 Earths would fit side by side across the Sun - and about 1.3 million could fit inside it.", deeper: "The Sun holds about 99.8% of all the mass in the Solar System." },
  { name: "The Solar System", size: "about 9 billion km across (to Neptune)", color: "#8B95F6", line: "You'd need about 6,500 Suns in a row to cross it. Light takes over 8 hours.", deeper: "If the Sun were a basketball, Earth would be a peppercorn 26 meters away." },
  { name: "The Gap to the Nearest Star", size: "4.24 light-years (to Proxima Centauri)", color: "#B9C0FF", line: "About 4,500 Solar Systems end to end, just to reach the next star.", deeper: "On the basketball scale, the next star would be another ball about 7,000 km away - farther than New York to Paris." },
  { name: "The Milky Way", size: "about 100,000 light-years across", color: "#DCDFFF", line: "Roughly 23,600 of those star-to-star gaps laid end to end.", deeper: "On the basketball scale, the whole galaxy would be bigger than the real distance from Earth to the Sun." },
  { name: "The Local Group", size: "about 10 million light-years across", color: "#C9B98F", line: "About 100 Milky Ways across. Andromeda is the big neighbor, 2.5 million light-years away.", deeper: "The Local Group is held together by gravity - its galaxies are bound to each other." },
  { name: "The Observable Universe", size: "about 93 billion light-years across", color: "#F2B8C6", line: "About 930,000 Milky Ways across - and that's only the part we can see.", deeper: "It's wider than 13.8 billion light-years because space itself has been stretching while the light traveled." },
];

function Zoom({ onDiscover }) {
  const [i, setI] = useState(0);
  const [anim, setAnim] = useState(0);
  const step = ZOOM[i];
  const go = (d) => {
    const n = Math.max(0, Math.min(ZOOM.length - 1, i + d));
    if (n === i) return;
    setI(n);
    setAnim((a) => a + 1);
    if (n === ZOOM.length - 1) onDiscover("zoom");
  };
  return (
    <div className="gx-zoom">
      <div className="gx-zoom-stage">
        {/* the last thing, shrinking to a dot; the new thing, growing in */}
        {i > 0 && <span key={`p${anim}`} className="gx-zoom-prev" style={{ background: ZOOM[i - 1].color }} />}
        <span key={`c${anim}`} className="gx-zoom-cur" style={{ borderColor: step.color, boxShadow: `0 0 40px ${step.color}33 inset` }} />
        <span className="mono gx-zoom-count">{i + 1} / {ZOOM.length}</span>
      </div>
      <div style={{ flex: "1 1 260px", minWidth: 0 }}>
        <Big color={step.color}>{step.name}</Big>
        <div className="mono" style={{ fontSize: 12, color: "#8A8FBF", margin: "6px 0 12px" }}>{step.size}</div>
        <Fact>{step.line}</Fact>
        <p style={{ margin: "0 0 14px", fontSize: 13, color: "#8B95F6", fontStyle: "italic" }}>{step.deeper}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="mono gx-btn" onClick={() => go(-1)} disabled={i === 0}>&larr; zoom in</button>
          <button className="mono gx-btn gx-btn-hot" onClick={() => go(1)} disabled={i === ZOOM.length - 1}>zoom out &rarr;</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Ride a light beam

const TRIPS = [
  { id: "moon", name: "The Moon", seconds: 1.28, time: "1.3 seconds", then: "Blink, and it's there.", realtime: true },
  { id: "sun", name: "The Sun", seconds: 499, time: "8 minutes 19 seconds", then: "The sunlight on your skin right now left the Sun about 8 minutes ago.", realtime: true },
  { id: "voyager", name: "Voyager 1", seconds: 86400, time: "about 1 day", then: "Humanity's farthest spacecraft, launched in 1977, crosses one light-day from Earth around late 2026." },
  { id: "proxima", name: "Proxima Centauri", seconds: 4.24 * 3.156e7, time: "4.24 years", then: "The light you'd see from the nearest star tonight left it about four years ago." },
  { id: "center", name: "The Galaxy's Center", seconds: 26000 * 3.156e7, time: "26,000 years", then: "When that light set out, the Ice Age was near its coldest and people were painting on cave walls." },
  { id: "across", name: "Across the Milky Way", seconds: 1e5 * 3.156e7, time: "100,000 years", then: "When it started, our species, Homo sapiens, still lived mostly in Africa." },
  { id: "andromeda", name: "The Andromeda Galaxy", seconds: 2.5e6 * 3.156e7, time: "2.5 million years", then: "When Andromeda's light left home, our distant ancestors were only beginning to make stone tools." },
];

function LightBeam({ onDiscover }) {
  const [trip, setTrip] = useState(TRIPS[0]);
  const [run, setRun] = useState(0);
  const [real, setReal] = useState(null); // { start, seconds } for a real-time race
  const [now, setNow] = useState(0);
  const seen = useRef(new Set());

  useEffect(() => {
    if (!real) return;
    const id = setInterval(() => setNow(performance.now()), 50);
    return () => clearInterval(id);
  }, [real]);

  const launch = (t, realtime = false) => {
    setTrip(t);
    setRun((r) => r + 1);
    setReal(realtime ? { start: performance.now(), seconds: t.seconds } : null);
    seen.current.add(t.id);
    if (seen.current.size >= 4) onDiscover("light");
  };

  const elapsed = real ? Math.min(real.seconds, (now - real.start) / 1000) : 0;
  const realDone = real && elapsed >= real.seconds;
  const duration = real ? real.seconds : 2.4;

  return (
    <div>
      <div className="gx-chips">
        {TRIPS.map((t) => (
          <button key={t.id} className={`mono gx-chip ${trip.id === t.id ? "gx-chip-on" : ""}`} onClick={() => launch(t)}>{t.name}</button>
        ))}
      </div>
      <div className="gx-track">
        <span className="mono gx-track-end" style={{ left: 0 }}>EARTH</span>
        <span className="mono gx-track-end" style={{ right: 0, textAlign: "right" }}>{trip.name.toUpperCase()}</span>
        <span key={run} className="gx-photon" style={{ animationDuration: `${duration}s` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1.5px" }}>AT THE SPEED OF LIGHT</div>
          <Big>{real ? (realDone ? "Arrived!" : `${elapsed.toFixed(elapsed < 10 ? 2 : 0)} s`) : trip.time}</Big>
        </div>
        {trip.realtime && !real && (
          <button className="mono gx-btn gx-btn-hot" onClick={() => launch(trip, true)}>race it in real time</button>
        )}
      </div>
      <Fact>{trip.then}</Fact>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Count the stars

function CountStars() {
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!counting) return;
    const id = setInterval(() => setCount((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, [counting]);
  const left = 100e9 - count;
  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div className="gx-counter">
          <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1.5px" }}>STARS COUNTED</div>
          <Big>{fmt(count)}</Big>
        </div>
        <button className="mono gx-btn gx-btn-hot" onClick={() => setCounting((c) => !c)}>{counting ? "pause" : count ? "keep counting" : "start counting, one per second"}</button>
      </div>
      <Fact>
        {count > 0
          ? `Only ${fmt(left)} to go (at the low estimate). At one star a second, nonstop - no sleeping, no snacks - that's about ${fmt(left / 3.156e7)} more years.`
          : "The Milky Way has somewhere between 100 billion and 400 billion stars. Count one every second, never stopping, and you'd need between 3,200 and 12,700 years."}
      </Fact>
      <Fact>That's roughly one to three stars for every human who has ever lived - about 117 billion people, by one careful estimate.</Fact>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. You are moving

function Moving() {
  const [t0] = useState(() => (typeof performance !== "undefined" ? performance.now() : 0));
  const [now, setNow] = useState(t0);
  const [age, setAge] = useState("");
  useEffect(() => {
    const id = setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(id);
  }, []);
  const km = ((now - t0) / 1000) * 230;
  const years = Number(age);
  return (
    <div>
      <div className="gx-counter" style={{ marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1.5px" }}>KILOMETERS YOU'VE TRAVELED AROUND THE GALAXY SINCE THIS PAGE OPENED</div>
        <Big color="#E9D29A">{fmt(km)} km</Big>
      </div>
      <Fact>The Sun - carrying Earth and you with it - races around the galaxy's center at about 230 km every second. That's about 828,000 km an hour.</Fact>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", margin: "8px 0 10px" }}>
        <label className="mono" style={{ fontSize: 11, color: "#8A8FBF" }} htmlFor="gx-age">How old are you?</label>
        <input id="gx-age" type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} className="gx-input" placeholder="12" />
      </div>
      {years > 0 && years < 130 && (
        <Fact>
          One lap around the galaxy - a <b>galactic year</b> - takes about 230 million years. So you are{" "}
          <b style={{ color: "#F1E6CE" }}>{(years / 230e6).toFixed(10)}</b> galactic years old. Since you were born, you've traveled about{" "}
          <b style={{ color: "#F1E6CE" }}>{fmt(years * 3.156e7 * 230 / 1e6)} million km</b> around the galaxy.
        </Fact>
      )}
      <Fact>The Sun is about 20 galactic years old. One galactic year ago, the very first dinosaurs were appearing on Earth.</Fact>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. The monster at the middle

function BlackHole() {
  const [view, setView] = useState("size");
  const [t, setT] = useState(0);
  useEffect(() => {
    if (view !== "orbit") return;
    let raf;
    const start = performance.now();
    const tick = (now) => { setT(((now - start) / 1000) % 16); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [view]);

  // S2's orbit: 16 years (one second per year here), very stretched (e = 0.88)
  const e = 0.88;
  const M = (2 * Math.PI * t) / 16;
  let E = M;
  for (let k = 0; k < 8; k++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const a = 130, b = a * Math.sqrt(1 - e * e);
  const sx = a * (Math.cos(E) - e), sy = b * Math.sin(E);
  // vis-viva: speed relative to its fastest (closest) point, ~2.55% of light
  const speedPct = (2.55 * Math.sqrt(((1 + e * Math.cos(E)) / (1 - e * Math.cos(E))) * ((1 - e) / (1 + e)))).toFixed(2);

  return (
    <div>
      <div className="gx-chips">
        <button className={`mono gx-chip ${view === "size" ? "gx-chip-on" : ""}`} onClick={() => setView("size")}>how big?</button>
        <button className={`mono gx-chip ${view === "orbit" ? "gx-chip-on" : ""}`} onClick={() => setView("orbit")}>watch a star orbit it</button>
      </div>
      <svg viewBox="-200 -120 400 240" className="gx-svg" role="img" aria-label={view === "size" ? "Sagittarius A star compared with the Sun and Mercury's orbit" : "The star S2 orbiting Sagittarius A star"}>
        <rect x="-200" y="-120" width="400" height="240" fill="#05040F" />
        {view === "size" ? (
          <>
            <circle r="110" fill="none" stroke="#3A3E75" strokeDasharray="3 5" />
            <text x="0" y="-96" textAnchor="middle" fill="#6E76B8" fontSize="9" fontFamily="'JetBrains Mono', monospace">MERCURY'S ORBIT AROUND THE SUN</text>
            <circle r="23" fill="#000" stroke="#E9D29A" strokeWidth="1.5" />
            <circle r="30" fill="none" stroke="rgba(233,210,154,0.25)" strokeWidth="6" />
            <text x="0" y="48" textAnchor="middle" fill="#E9D29A" fontSize="10" fontFamily="'JetBrains Mono', monospace">SGR A* EVENT HORIZON</text>
            <circle cx="150" cy="60" r="1.6" fill="#FFD27A" />
            <text x="150" y="76" textAnchor="middle" fill="#FFD27A" fontSize="9" fontFamily="'JetBrains Mono', monospace">THE SUN</text>
          </>
        ) : (
          <>
            <ellipse cx={-a * e} cy="0" rx={a} ry={b} fill="none" stroke="#3A3E75" strokeDasharray="2 4" />
            <circle r="4" fill="#000" stroke="#E9D29A" strokeWidth="1.5" />
            <circle cx={sx} cy={sy} r="3.5" fill="#B9C0FF" />
            <text x={sx} y={sy - 8} textAnchor="middle" fill="#B9C0FF" fontSize="9" fontFamily="'JetBrains Mono', monospace">S2</text>
            <text x="-190" y="-104" fill="#6E76B8" fontSize="9" fontFamily="'JetBrains Mono', monospace">{`YEAR ${Math.floor(t) + 1} OF 16`}</text>
            <text x="-190" y="110" fill="#E9D29A" fontSize="9" fontFamily="'JetBrains Mono', monospace">{`SPEED: ~${speedPct}% OF LIGHT`}</text>
          </>
        )}
      </svg>
      <Fact>
        {view === "size"
          ? "Sagittarius A* holds about 4 million Suns' worth of mass, crushed so tight that its edge - the event horizon - is about 25 million km across. That's about 18 times wider than the Sun, and it would fit inside Mercury's orbit."
          : "S2 is a real star, circling the black hole every 16 years. At its closest it hurtles along at about 7,650 km per second - around 2.5% of the speed of light. Watching stars like S2 is how astronomers weighed the black hole."}
      </Fact>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7. The big collision

function Collision() {
  const [g, setG] = useState(0); // billions of years from now
  const sep = Math.max(0, 1 - g / 4.5); // 1 now -> 0 at collision
  const merged = g >= 6;
  const say =
    g < 1 ? "Andromeda is 2.5 million light-years away - and heading our way at about 110 km per second." :
    g < 4 ? "It grows in the night sky, year after year. Neither galaxy is in a hurry." :
    g < 5 ? "Around 4 to 5 billion years from now, the two galaxies may meet. Stars almost never crash into each other - the space between them is enormous." :
    g < 6 ? "The Sun swells into a red giant around this time. The galaxies swing through each other, flinging long tails of stars." :
    "They settle into one giant galaxy. Some astronomers have nicknamed it “Milkomeda.”";
  return (
    <div>
      <div className="gx-collision" aria-hidden="true">
        {merged ? (
          <span className="gx-galaxy gx-merged" style={{ opacity: Math.min(1, (g - 6) / 1 + 0.4) }} />
        ) : (
          <>
            <span className="gx-galaxy gx-mw" style={{ left: `calc(${50 - 32 * sep}% - 45px)`, transform: `rotate(${g * 40}deg)` }} />
            <span className="gx-galaxy gx-and" style={{ left: `calc(${50 + 32 * sep}% - 60px)`, transform: `rotate(${-30 - g * 30}deg)` }} />
          </>
        )}
        <span className="mono" style={{ position: "absolute", left: 10, bottom: 8, fontSize: 9.5, color: "#565B8F" }}>{merged ? "MILKOMEDA" : "MILKY WAY · ANDROMEDA"}</span>
      </div>
      <input type="range" min="0" max="7" step="0.05" value={g} onChange={(e) => setG(Number(e.target.value))} className="gx-range" aria-label="Billions of years from now" />
      <div className="mono" style={{ fontSize: 12, color: "#E9D29A", margin: "4px 0 10px" }}>{g === 0 ? "TODAY" : `${g.toFixed(1)} BILLION YEARS FROM NOW`}</div>
      <Fact>{say}</Fact>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8. Would you believe?

const BELIEVE = [
  { q: "What might the middle of our galaxy smell like?", a: "Maybe raspberries! Astronomers found ethyl formate - the chemical that gives raspberries their flavor - in a giant dust cloud near the center, called Sagittarius B2." },
  { q: "Does our galaxy have more stars, or more planets?", a: "Probably more planets. Astronomers now think that, on average, every star has at least one." },
  { q: "How thick is the galaxy's disk?", a: "About 1,000 light-years - pancake-thin for something 100,000 across. Shrink the galaxy to a dinner plate and the disk is thinner than the plate." },
  { q: "Can you see the center of the galaxy?", a: "Not with your eyes - thick dust blocks it. Infrared and radio telescopes see through. It lies toward the constellation Sagittarius." },
  { q: "Why is it called the Milky Way?", a: "Because it looks like a band of spilled milk across a dark sky. Even the word “galaxy” comes from gala, Greek for milk." },
  { q: "How many galaxies are out there?", a: "In the part of the universe we can see: somewhere from hundreds of billions to about two trillion." },
];

function Believe({ onDiscover }) {
  const [flipped, setFlipped] = useState({});
  const everFlipped = useRef(new Set());
  const flip = (i) => {
    playFlip();
    setFlipped((f) => ({ ...f, [i]: !f[i] }));
    everFlipped.current.add(i);
    if (everFlipped.current.size === BELIEVE.length) onDiscover("believe");
  };
  return (
    <div className="gx-believe">
      {BELIEVE.map((c, i) => (
        <button key={i} className="gx-flip" onClick={() => flip(i)} aria-label={flipped[i] ? c.a : c.q}>
          <span className="gx-flip-inner" style={{ transform: flipped[i] ? "rotateY(180deg)" : "none" }}>
            <span className="gx-flip-face">
              <span className="mono" style={{ fontSize: 9, color: "#565B8F", letterSpacing: "1.5px" }}>TAP TO FLIP</span>
              <span style={{ fontSize: 15, color: "#DCDFFF", lineHeight: 1.45 }}>{c.q}</span>
            </span>
            <span className="gx-flip-face gx-flip-back">
              <span style={{ fontSize: 13, color: "#F1E6CE", lineHeight: 1.5 }}>{c.a}</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function GalaxyExplorer() {
  const [found, setFound] = useState([]);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    try { setFound(JSON.parse(localStorage.getItem(DISCOVERY_KEY) || "[]")); } catch (e) { /* ignore */ }
  }, []);

  const discover = (id) => {
    setFound((f) => {
      if (f.includes(id)) return f;
      const next = [...f, id];
      try { localStorage.setItem(DISCOVERY_KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
      if (next.length === STATIONS.length) setCelebrate(true);
      return next;
    });
  };
  const has = (id) => found.includes(id);
  const done = found.length >= STATIONS.length;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div className="gx-meter">
        <span className="mono" style={{ fontSize: 10, letterSpacing: "1.5px", color: done ? "#6FC3A8" : "#8A8FBF" }}>
          {done ? "★ COSMIC EXPLORER" : `DISCOVERIES ${found.length} / ${STATIONS.length}`}
        </span>
        <span className="gx-meter-bar"><span style={{ width: `${(found.length / STATIONS.length) * 100}%` }} /></span>
        <nav className="gx-jump">
          {STATIONS.map((s, i) => (
            <a key={s} href={`#${s}`} className="mono" style={{ color: has(s) ? "#6FC3A8" : "#565B8F" }}>{has(s) ? "✓" : i + 1}</a>
          ))}
        </nav>
      </div>

      {celebrate && (
        <div className="panel gx-badge">
          <Big color="#6FC3A8">&#9733; Cosmic Explorer</Big>
          <p style={{ margin: "8px 0 12px", fontSize: 14, color: "#C7CAE8" }}>
            You explored all eight. You now know more about the Milky Way than most grown-ups. Ready to prove it?
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/quiz" className="mono gx-btn gx-btn-hot">take the Universe Quiz &rarr;</Link>
            <Link href="/galaxy/map" className="mono gx-btn">fly the Galaxy Map &rarr;</Link>
          </div>
        </div>
      )}

      <Station n={1} id="address" title="Your Cosmic Address" hook="If aliens wanted to mail you a letter, what would they write on the envelope?" found={has("address")} onDiscover={discover}
        deeper={<><Fact>Superclusters like Laniakea are the biggest structures we've mapped - galaxies strung along huge threads, with vast empty voids in between.</Fact><Fact>Everything in your address is moving: Earth around the Sun, the Sun around the galaxy, and the galaxy through the Local Group.</Fact></>}>
        <Address />
      </Station>

      <Station n={2} id="zoom" title="The Cosmic Zoom" hook="Start with you. Keep zooming out until your brain hurts." found={has("zoom")} onDiscover={discover}>
        <Zoom onDiscover={discover} />
      </Station>

      <Station n={3} id="light" title="Ride a Light Beam" hook="Light is the fastest thing there is - 300,000 km every second. Pick a destination. (Try four.)" found={has("light")} onDiscover={discover}
        deeper={<><Fact>A <b>light-year</b> is a distance, not a time: how far light travels in a year - about 9.46 trillion km.</Fact><Fact>So looking at the stars is looking back in time. You see each one as it was when its light set out.</Fact></>}>
        <LightBeam onDiscover={discover} />
      </Station>

      <Station n={4} id="stars" title="Count the Stars" hook="How many stars live in the Milky Way? Let's find out the hard way." found={has("stars")} onDiscover={discover}
        deeper={<><Fact>About three out of four stars in the galaxy are red dwarfs - smaller, cooler and dimmer than our Sun. None can be seen without a telescope.</Fact><Fact>On a clear, dark night, you can see only about 2,500 stars at once. All of them are in our own galaxy - most within a few thousand light-years.</Fact></>}>
        <CountStars />
      </Station>

      <Station n={5} id="moving" title="You Are Moving" hook="Sit perfectly still. You're still flying through space faster than any rocket." found={has("moving")} onDiscover={discover}
        deeper={<><Fact>You're moving in several ways at once: Earth spins, Earth orbits the Sun (about 107,000 km an hour), and the Sun circles the galaxy.</Fact><Fact>The Sun also bobs up and down through the galaxy's disk as it goes around, like a horse on a carousel.</Fact></>}>
        <Moving />
      </Station>

      <Station n={6} id="blackhole" title="The Monster at the Middle" hook="At the heart of the Milky Way sits a supermassive black hole: Sagittarius A* (say it “A-star”)." found={has("blackhole")} onDiscover={discover}
        deeper={<><Fact>Past the event horizon, nothing escapes - not even light. That's why it's black.</Fact><Fact>Its first picture was released in 2022, taken by the Event Horizon Telescope: radio dishes all over Earth working together like one planet-sized telescope.</Fact><Fact>Don't worry: we're 26,000 light-years away, and Sgr A* is a quiet eater.</Fact></>}>
        <BlackHole />
      </Station>

      <Station n={7} id="collision" title="The Big Collision" hook="Our galaxy and Andromeda are falling toward each other. Drag time forward and watch." found={has("collision")} onDiscover={discover}
        deeper={<><Fact>Andromeda is the farthest thing most people can see with their own eyes - a faint smudge on a dark autumn night.</Fact><Fact>Newer measurements suggest the collision isn't certain after all - maybe closer to a coin flip within the next 10 billion years. Science changes its mind when the evidence does.</Fact></>}>
        <Collision />
      </Station>

      <Station n={8} id="believe" title="Would You Believe?" hook="Flip them all." found={has("believe")} onDiscover={discover}>
        <Believe onDiscover={discover} />
      </Station>

      <p style={{ fontSize: 12, color: "#565B8F", marginTop: 24, textAlign: "center" }}>
        Figures are commonly cited estimates. Exact numbers are genuinely hard to measure from inside the galaxy we're trying to measure.
      </p>
    </div>
  );
}
