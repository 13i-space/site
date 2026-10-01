"use client";
import { useState } from "react";

// The last button on the briefing: signs Aaron straight into his Story preview
// account (founder mode) and opens the launch page. Falls back to a plain link.
export default function LaunchButton() {
  const [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/story/brief/handoff", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      window.location.href = data.link || data.fallback || "/story";
    } catch {
      window.location.href = "/story";
    }
  }
  return (
    <a className="sos-btn" href="/story" onClick={go} aria-busy={busy}>
      {busy ? "Opening your story…" : "Go to the launch page"}
    </a>
  );
}
