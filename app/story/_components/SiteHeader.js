"use client";
import { useState } from "react";
import { NAV } from "../../../lib/story/site";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sos-top">
      <a href="/story" className="sos-brand">
        <span className="sos-brand-mark" aria-hidden="true" />
        Story <em>of</em> Self
      </a>
      <nav className={`sos-top-links${open ? " open" : ""}`} aria-label="Main">
        {NAV.map((n) => <a key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>)}
        <a href="/story/my-story" className="sos-top-my">My story</a>
        <a href="/story/begin" className="sos-btn sos-top-cta">Start free</a>
      </nav>
      <button type="button" className="sos-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
    </header>
  );
}
