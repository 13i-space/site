"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { needsBefore, takeArrival } from "../../../lib/beforeVisit";
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
//   1. the hero: the eye (radar easter egg intact) and "a signal,
//      translated" - nothing else (Update 5.57: the line, the button and
//      the launch date came out, so the assignment sits right under it)
//   2. the journey: Explore -> Play -> Create -> Kinship as one path
//      (components/LaunchJourney.js)
//   3. what's alive right now (components/LaunchAlive.js)
//   4. Kinship, quietly (components/LaunchKinship.js)
//   5. the site footer (unchanged, from the layout)
// The Big Bang reveal, EasterStars and Lyra's homepage lines are unchanged.
// Update 5.54: anyone who hasn't been through Assignment 0000000 - Before
// is sent there first (lib/beforeVisit.js); arriving back from it, there's
// no second Big Bang (they just made one) and the hero points straight at
// their First Assignment.

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
  const [arrived, setArrived] = useState(null); // "1234567" | "skipped" | null: just came from /before
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // first time here at all? Before comes first
      if (await needsBefore()) { if (!cancelled) router.replace("/before"); return; }
      if (cancelled) return;
      const from = takeArrival();
      if (from) {
        // they just made their own Big Bang: no second one
        setArrived(from);
        setRevealed(true);
        setBigBangMs(0);
        return;
      }
      let seen = false;
      try {
        seen = !!localStorage.getItem(SEEN_KEY);
        if (!seen) localStorage.setItem(SEEN_KEY, "1");
      } catch (e) {
        // private browsing etc. — just default to the fast version below
        seen = true;
      }
      setBigBangMs(seen ? REPEAT_PLAY_MS : FIRST_PLAY_MS);
    })();
    return () => { cancelled = true; };
  }, [router]);

  // Avoid a flash of the wrong-length animation before we know which one
  // to play — this resolves in well under a frame in practice.
  if (bigBangMs === null) return null;

  return (
    <div style={{ position: "relative" }}>
      {!revealed && bigBangMs > 0 && (
        <BigBangField onSettled={() => setRevealed(true)} originXPct={0.5} originYPct={0.28} totalMs={bigBangMs} />
      )}

      {radarMode && <RadarField />}
      {revealed && <EasterStars radar={radarMode} />}

      <div style={{ opacity: revealed ? 1 : 0, transition: "opacity 1.2s ease" }}>
        <div style={{ textAlign: "center", padding: "20px 0 26px" }}>
          <div style={{ maxWidth: 160, margin: "0 auto 4px", position: "relative" }}>
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
          {arrived && arrived !== "skipped" && (
            <div className="mono launch-arrived">assignment 0000000 &middot; complete<br />universe no. {arrived} &middot; yours</div>
          )}
        </div>

        <FirstAssignment variant="launch" />
        <LaunchJourney />
        <LaunchAlive />
        <LaunchKinship />
      </div>
    </div>
  );
}
