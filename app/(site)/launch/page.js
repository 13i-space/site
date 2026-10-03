"use client";

import { useState, useEffect } from "react";
import ThemedHero from "../../../components/ThemedHero";
import BigBangField from "../../../components/BigBangField";
import RadarField from "../../../components/RadarField";
import RadarLogo from "../../../components/RadarLogo";
import EasterStars from "../../../components/EasterStars";
import FirstAssignment from "../../../components/FirstAssignment";
import LaunchJourney from "../../../components/LaunchJourney";
import LaunchAlive from "../../../components/LaunchAlive";
import LaunchKinship from "../../../components/LaunchKinship";

// /launch - the front door to the 13i universe, and home for returning Kin
// (Update 5.53). Five parts, kept short at the top so regulars get straight
// to their next step:
//   1. the hero: the eye (radar easter egg intact), "a signal, translated",
//      one line, and one real action - your First Assignment (begin /
//      continue), or, once that's done or set aside, the path below
//   2. the journey: Explore -> Play -> Create -> Kinship as one path
//      (components/LaunchJourney.js)
//   3. what's alive right now (components/LaunchAlive.js)
//   4. Kinship, quietly (components/LaunchKinship.js)
//   5. the site footer (unchanged, from the layout)
// The Big Bang reveal, EasterStars and Lyra's homepage lines are unchanged.

// First-ever play runs long (~10s) so the origin moment actually lands;
// every visit after that is fast (~2s) since the visitor has already seen
// it. Tracked per-browser via localStorage, same pattern Lyra uses.
const FIRST_PLAY_MS = 10000;
const REPEAT_PLAY_MS = 2000;
const SEEN_KEY = "bigbang_seen";

export default function LaunchHome() {
  const [revealed, setRevealed] = useState(false);
  const [bigBangMs, setBigBangMs] = useState(null); // null = not decided yet
  const [radarMode, setRadarMode] = useState(false); // easter egg: click the eye
  const [cta, setCta] = useState(null); // { label, target } once the journey is known
  const onJourney = (j, hiddenForNow) => {
    if (!j) return;
    const started = j.signedIn && (j.current > 0 || Object.values(j.done || {}).some(Boolean));
    if ((j.signedIn && j.allDone) || hiddenForNow) setCta({ label: "Keep exploring", target: "journey" });
    else setCta({ label: started ? "Continue your assignment" : "Begin your first assignment", target: "first-assignment" });
  };
  const go = (target) => {
    const el = document.getElementById(target);
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  useEffect(() => {
    let seen = false;
    try {
      seen = !!localStorage.getItem(SEEN_KEY);
      if (!seen) localStorage.setItem(SEEN_KEY, "1");
    } catch (e) {
      // private browsing etc. — just default to the fast version below
      seen = true;
    }
    setBigBangMs(seen ? REPEAT_PLAY_MS : FIRST_PLAY_MS);
  }, []);

  // Avoid a flash of the wrong-length animation before we know which one
  // to play — this resolves in well under a frame in practice.
  if (bigBangMs === null) return null;

  return (
    <div style={{ position: "relative" }}>
      {!revealed && (
        <BigBangField onSettled={() => setRevealed(true)} originXPct={0.5} originYPct={0.28} totalMs={bigBangMs} />
      )}

      {radarMode && <RadarField />}
      {revealed && <EasterStars radar={radarMode} />}

      <div style={{ opacity: revealed ? 1 : 0, transition: "opacity 1.2s ease" }}>
        <div style={{ textAlign: "center", padding: "20px 0 50px" }}>
          <div style={{ maxWidth: 160, margin: "0 auto 20px", position: "relative" }}>
            {radarMode ? <RadarLogo /> : <ThemedHero background={false} />}
            {/* a quiet easter egg: the dot in the eye toggles the Radar look */}
            <button
              onClick={() => setRadarMode((v) => !v)}
              tabIndex={-1}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "74.8%",
                top: "29.2%",
                width: "11%",
                aspectRatio: "1",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                zIndex: 5,
              }}
            />
          </div>
          <h1 className="sr-only">13i</h1>
          <div className="page-subtitle" style={{ marginBottom: 0 }}>a signal, translated</div>
          <p className="launch-hero-line">
            A science-fiction universe, still arriving. Read it, hear it,
            step inside it, and add to it.
          </p>
          <div className="launch-hero-actions">
            <button type="button" className="launch-begin" onClick={() => go(cta?.target || "first-assignment")} style={{ visibility: cta ? "visible" : "hidden" }}>
              {cta?.label || "Begin your first assignment"}
            </button>
          </div>
          <div className="mono launch-hero-date">launching 4.6.2027 &middot; everything here is in progress</div>
        </div>

        <FirstAssignment variant="launch" onJourney={onJourney} />
        <LaunchJourney />
        <LaunchAlive />
        <LaunchKinship />
      </div>
    </div>
  );
}
