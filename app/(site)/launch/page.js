"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemedHero from "../../../components/ThemedHero";
import BigBangField from "../../../components/BigBangField";
import RadarField from "../../../components/RadarField";
import RadarLogo from "../../../components/RadarLogo";
import EasterStars from "../../../components/EasterStars";

const sections = [
  {
    href: "/explore",
    title: "Explore",
    blurb: "The book, the music, the archive of short stories, the galaxy.",
  },
  {
    href: "/play",
    title: "Play",
    blurb: "The Oracle, the games, the artifacts — the universe, interactive.",
  },
  {
    href: "/create",
    title: "Create",
    blurb: "The Alien Lab, the Signal Composer, and Write an Assignment.",
  },
  {
    href: "/kinship",
    title: "Kinship",
    blurb: "The Forum, the Guestbook — you are not the only one who found this.",
  },
];

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
      {revealed && <EasterStars />}

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
          <div className="page-subtitle" style={{ marginBottom: 0 }}>a signal, translated</div>
          <p style={{ color: "#B7BADF", maxWidth: 520, margin: "16px auto 0" }}>
            A working preview of the 13i universe — the book, the music, and
            the tools built around them. Everything here is in progress.
          </p>
        </div>

        <div style={styles.grid}>
          {sections.map((s) => (
            <Link key={s.href} href={s.href} className="launch-card" style={styles.card}>
              <div style={styles.cardCorner} />
              <div className="wordmark" style={styles.cardTitle}>{s.title}</div>
              <p style={styles.cardBlurb}>{s.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
  },
  card: {
    position: "relative",
    display: "block",
    background: "rgba(14, 16, 38, 0.72)",
    border: "1px solid #262A55",
    borderRadius: 4,
    padding: "24px 20px",
    color: "inherit",
    textDecoration: "none",
    overflow: "hidden",
  },
  cardCorner: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: "0 22px 22px 0",
    borderColor: "transparent rgba(139,149,246,0.14) transparent transparent",
  },
  cardTitle: { fontSize: 22, color: "#DCDFFF", marginBottom: 8 },
  cardBlurb: { fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: 0 },
};
