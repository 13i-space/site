"use client";

import { useState } from "react";
import Link from "next/link";
import BigBangField from "../../components/BigBangField";

// The burst originates from exactly where the logo's eye will later land,
// so the whole animation reads as "the eye is where this began." Same
// eye position used for the ripple effect elsewhere on the site.
const EYE_X = 0.748;
const EYE_Y = 0.292;
const ORIGIN_X = 0.5;   // viewport-relative
const ORIGIN_Y = 0.36;
const LOGO_W = 260;
const LOGO_H = LOGO_W * (887 / 1774); // real logo aspect ratio

export default function Preview13BigBang() {
  const [revealed, setRevealed] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const showFinal = revealed || skipped;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#000" }}>
      {!skipped && <BigBangField onSettled={() => setRevealed(true)} originXPct={ORIGIN_X} originYPct={ORIGIN_Y} />}

      <button
        onClick={() => setSkipped(true)}
        className="mono"
        style={{
          position: "fixed", top: 20, right: 20, zIndex: 3,
          background: "none", border: "1px solid #3A3E75", borderRadius: 4,
          color: "#6E76B8", fontSize: 11, padding: "6px 12px", cursor: "pointer",
          opacity: showFinal ? 0 : 1, pointerEvents: showFinal ? "none" : "auto",
          transition: "opacity 0.4s",
        }}
      >
        Skip
      </button>

      <div
        style={{
          position: "fixed", zIndex: 1,
          left: `calc(${ORIGIN_X * 100}% - ${LOGO_W * EYE_X}px)`,
          top: `calc(${ORIGIN_Y * 100}% - ${LOGO_H * EYE_Y}px)`,
          width: LOGO_W,
          opacity: showFinal ? 1 : 0,
          transition: "opacity 1.4s ease",
        }}
      >
        <img src="/13i-logo.png" alt="13i" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      <div
        style={{
          position: "fixed", zIndex: 1, left: 0, right: 0,
          top: `calc(${ORIGIN_Y * 100}% + ${LOGO_H - LOGO_H * EYE_Y}px + 24px)`,
          textAlign: "center", padding: "0 32px",
          opacity: showFinal ? 1 : 0,
          transition: "opacity 1.4s ease 0.3s",
        }}
      >
        <div className="mono" style={{ fontSize: 13, color: "#8B95F6", letterSpacing: "2px", marginBottom: 20 }}>
          a signal, received
        </div>
        <p style={{ color: "#B7BADF", maxWidth: 480, margin: "0 auto 36px" }}>
          Something began. This is what it looked like.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          {["Explore", "Play", "Create", "Kinship"].map((m) => (
            <span
              key={m}
              className="mono"
              style={{
                border: "1px solid #262A55", borderRadius: 4, padding: "8px 18px",
                fontSize: 12, color: "#B9C0FF", letterSpacing: "1px",
              }}
            >
              {m}
            </span>
          ))}
        </div>

        <Link href="/launch" className="mono" style={{ display: "inline-block", marginTop: 40, fontSize: 11, color: "#565B8F" }}>
          &larr; back to the live site
        </Link>
      </div>
    </div>
  );
}
