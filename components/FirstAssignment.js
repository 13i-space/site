"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { JOURNEY, loadJourney } from "../lib/firstAssignment";

// Your First Assignment, as a panel: six steps, each stamped as it's done.
// On /launch it can be hidden for a while ("later"); on the Node it's
// always there, and shrinks to a single completed line once finished.
// Lyra points at the next step once a session (see LyraCompanion's
// "lyra:say" event).
const HIDE_KEY = "first_assignment_hidden_until";
const HIDE_DAYS = 7;

export default function FirstAssignment({ variant = "launch" }) {
  const [journey, setJourney] = useState(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (variant === "launch") {
      try { setHidden(Number(localStorage.getItem(HIDE_KEY) || 0) > Date.now()); } catch (e) { /* ignore */ }
    }
    let cancelled = false;
    const refresh = () => loadJourney().then((j) => { if (!cancelled) setJourney(j); });
    refresh();
    window.addEventListener("13i:milestone", refresh);
    return () => { cancelled = true; window.removeEventListener("13i:milestone", refresh); };
  }, [variant]);

  const steps = JOURNEY.map((s) => ({
    ...s,
    done: !!journey?.done?.[s.id],
    href: s.id === "review" && journey?.newestSpeciesId ? `/galaxy/aliens/${journey.newestSpeciesId}` : s.href,
  }));
  const count = steps.filter((s) => s.done).length;
  const complete = journey?.signedIn && count === steps.length;
  const next = steps.find((s) => !s.done);

  // Lyra names the next step, once per browser session, on the homepage
  useEffect(() => {
    if (variant !== "launch" || !journey?.signedIn || complete || hidden || !next) return;
    let said = false;
    try { said = !!sessionStorage.getItem("lyra_first_assignment"); sessionStorage.setItem("lyra_first_assignment", "1"); } catch (e) { /* ignore */ }
    if (said) return;
    const id = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("lyra:say", { detail: { text: `Your First Assignment, step ${count + 1}: ${next.title.toLowerCase()}. ${next.text}` } }));
    }, 7000); // after her welcome
    return () => clearTimeout(id);
  }, [variant, journey, complete, hidden, next, count]);

  if (!journey) return null;
  if (variant === "launch" && (hidden || complete)) return null;

  if (complete) {
    return (
      <div className="panel" style={{ marginTop: 16, textAlign: "left", display: "flex", alignItems: "center", gap: 14, borderColor: "rgba(111,195,168,0.45)" }}>
        <Stamp done size={34} />
        <span>
          <span className="mono" style={{ display: "block", fontSize: 10, color: "#6FC3A8", letterSpacing: "1.5px" }}>YOUR FIRST ASSIGNMENT &middot; COMPLETE</span>
          <span style={{ fontSize: 13.5, color: "#B7BADF" }}>You have seen every part of the universe once. We learned something about you.</span>
        </span>
      </div>
    );
  }

  const hide = () => {
    try { localStorage.setItem(HIDE_KEY, String(Date.now() + HIDE_DAYS * 86400000)); } catch (e) { /* ignore */ }
    setHidden(true);
  };

  return (
    <div className="panel" style={{ marginTop: variant === "launch" ? 28 : 16, textAlign: "left", borderColor: "#3A3E75" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
        <span className="mono" style={{ fontSize: 10, color: "#C9B98F", letterSpacing: "1.5px" }}>
          ASSIGNMENT 0000000 &middot; YOUR FIRST
        </span>
        <span className="mono" style={{ fontSize: 10.5, color: "#565B8F" }}>
          {count} of {steps.length}
          {variant === "launch" && (
            <button onClick={hide} className="mono" style={{ marginLeft: 12, background: "none", border: "none", color: "#565B8F", fontSize: 10.5, cursor: "pointer", padding: 0 }}>
              later
            </button>
          )}
        </span>
      </div>
      <p style={{ fontSize: 13.5, color: "#B7BADF", margin: "0 0 14px", lineHeight: 1.6 }}>
        {journey.signedIn
          ? "Objective: learn this universe. Six steps, one through each part of it. Take them in any order."
          : "Objective: learn this universe. Six steps, one through each part of it. Sign in and we will keep track of where you are."}
      </p>
      <div style={styles.grid}>
        {steps.map((s, i) => (
          <Link key={s.id} href={s.href} className="launch-card" style={{ ...styles.step, opacity: s.done ? 0.7 : 1, borderColor: !s.done && s === next ? "#6B5E3E" : "#262A55" }}>
            <Stamp done={s.done} n={i + 1} />
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 14, color: s.done ? "#8A8FBF" : "#DCDFFF", textDecoration: s.done ? "line-through" : "none", textDecorationColor: "#3A3E75" }}>{s.title}</span>
              <span style={{ display: "block", fontSize: 12, color: "#6E76B8", lineHeight: 1.5 }}>{s.text}</span>
            </span>
          </Link>
        ))}
      </div>
      {!journey.signedIn && (
        <Link href="/login" className="mono" style={{ display: "inline-block", marginTop: 12, fontSize: 11, color: "#6E76B8" }}>sign in to track your progress &rarr;</Link>
      )}
    </div>
  );
}

function Stamp({ done, n, size = 26 }) {
  return (
    <span
      aria-label={done ? "done" : `step ${n}`}
      className="mono"
      style={{
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1.5px solid ${done ? "#6FC3A8" : "#3A3E75"}`,
        color: done ? "#6FC3A8" : "#6E76B8",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.45,
        background: done ? "rgba(111,195,168,0.1)" : "none",
      }}
    >
      {done ? "✓" : n}
    </span>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: 10,
  },
  step: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "12px 14px",
    border: "1px solid #262A55",
    borderRadius: 4,
    background: "rgba(14,16,38,0.6)",
    textDecoration: "none",
    color: "inherit",
  },
};
