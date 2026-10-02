"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Countdown, { LAUNCH } from "./Countdown";
import BigBangField from "./BigBangField";
import LyraOrb from "./LyraOrb";

// The countdown page's launch moment (Update 5.47). For anyone on the page
// as it reaches zero on April 6, 2027:
//   - the final minute: Lyra appears beneath the countdown and charges,
//     growing and passing through every form she has (stage 0 to 3), her
//     breathing quickening as zero nears
//   - zero: she is drawn into the dark with everything else, and the Big
//     Bang plays live, from the 13i eye, for everyone watching together
//   - after: she is the first thing born into the new universe, in her
//     winged form, and the way into the site opens
// Purely visual: no words from her or 13i during it (13i doesn't exist
// yet at the start of the universe). Arriving after launch skips straight
// to the open door. Rehearse it with ?launchtest=70 (zero 70 seconds after
// the page loads) - that only changes this visit, nothing is saved.
const FINAL_MS = 60000;
const BANG_MS = 9000;

export default function LaunchMoment() {
  const target = useMemo(() => {
    if (typeof window === "undefined") return LAUNCH;
    const t = Number(new URLSearchParams(window.location.search).get("launchtest"));
    return Number.isFinite(t) && t > 0 ? new Date(Date.now() + t * 1000) : LAUNCH;
  }, []);
  const rehearsal = target !== LAUNCH;
  const [left, setLeft] = useState(null); // ms until zero
  const [phase, setPhase] = useState("waiting"); // waiting | final | bang | born | arrived
  const [origin, setOrigin] = useState({ x: 0.5, y: 0.3 });

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [target]);

  useEffect(() => {
    if (left === null) return;
    setPhase((p) => {
      if (p === "bang" || p === "born" || p === "arrived") return p;
      if (left <= 0) {
        // already past launch when the page opened: no live moment, just the door
        if (p === "waiting") return "arrived";
        // the 13i eye is where the universe begins
        const el = document.querySelector("[data-launch-origin]");
        if (el) {
          const r = el.getBoundingClientRect();
          setOrigin({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight });
        }
        return "bang";
      }
      return left <= FINAL_MS ? "final" : "waiting";
    });
  }, [left]);

  const onSettled = useCallback(() => {
    setPhase("born");
    // they've seen it live: the site's own first-visit Big Bang can be the quick one
    if (!rehearsal) { try { localStorage.setItem("bigbang_seen", "1"); } catch (e) { /* ignore */ } }
    setTimeout(() => setPhase("arrived"), 4200);
  }, [rehearsal]);

  if (left === null) return <div style={{ height: 120 }} />;

  // 0 at sixty seconds out, 1 at zero
  const charge = phase === "final" ? Math.min(1, Math.max(0, 1 - left / FINAL_MS)) : phase === "waiting" ? 0 : 1;
  const stage = phase === "born" || phase === "arrived" ? 4 : Math.min(3, Math.floor(charge * 4));
  const size = phase === "born" || phase === "arrived" ? 84 : 40 + charge * 40;
  const showLyra = phase !== "waiting";
  const gone = phase === "bang";
  const over = phase === "born" || phase === "arrived";

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {phase === "bang" && createPortal(
        // over the whole page: everything goes dark, then begins again
        <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
          <BigBangField onSettled={onSettled} originXPct={origin.x} originYPct={origin.y} totalMs={BANG_MS} />
        </div>,
        document.body
      )}

      {!over ? <Countdown target={target} /> : (
        <div style={{ margin: "30px 0 10px" }}>
          <div className="mono" style={{ fontSize: 12, letterSpacing: "3px", color: "#E8CFC0", opacity: phase === "arrived" ? 1 : 0, transition: "opacity 1.6s ease" }}>
            THE SIGNAL HAS ARRIVED
          </div>
        </div>
      )}

      {showLyra && (
        <div
          className={`launch-lyra${phase === "final" ? " launch-lyra-charging" : ""}`}
          style={{
            "--charge": charge.toFixed(3),
            display: "flex", justifyContent: "center", margin: over ? "18px 0 8px" : "0 0 10px",
            opacity: gone ? 0 : 1,
            transform: gone ? "scale(0.1)" : "none",
            transition: gone ? "opacity 0.5s ease, transform 0.6s ease-in" : "opacity 1.2s ease, transform 1.2s ease",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <LyraOrb stage={stage} state={phase === "born" ? "celebrating" : phase === "final" ? "speaking" : "aware"} size={Math.round(size)} />
        </div>
      )}

      {phase === "arrived" && (
        <div style={{ marginTop: 18 }}>
          <Link href="/launch" className="mono launch-enter">Enter 13i &rarr;</Link>
        </div>
      )}
      {rehearsal && <div className="mono" style={{ fontSize: 10, color: "#565B8F", marginTop: 14 }}>rehearsal</div>}
    </div>
  );
}
