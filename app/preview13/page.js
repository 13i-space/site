"use client";

import { useState } from "react";
import Link from "next/link";
import BigBangField from "../../components/BigBangField";

export default function Preview13BigBang() {
  const [revealed, setRevealed] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const showFinal = revealed || skipped;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#000" }}>
      {!skipped && <BigBangField onSettled={() => setRevealed(true)} />}

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
          position: "relative", zIndex: 1, minHeight: "100vh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "48px 32px",
          opacity: showFinal ? 1 : 0,
          transition: "opacity 1.4s ease",
        }}
      >
        <div style={{ maxWidth: 280, marginBottom: 24 }}>
          <img src="/13i-logo.png" alt="13i" style={{ width: "100%", height: "auto" }} />
        </div>
        <div className="mono" style={{ fontSize: 13, color: "#8B95F6", letterSpacing: "2px", marginBottom: 20 }}>
          a signal, received
        </div>
        <p style={{ color: "#B7BADF", maxWidth: 480, marginBottom: 36 }}>
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

        <Link href="/launch" className="mono" style={{ marginTop: 40, fontSize: 11, color: "#565B8F" }}>
          &larr; back to the live site
        </Link>
      </div>
    </div>
  );
}
