"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "../lib/supabaseBrowser";
import AlienCard from "./AlienCard";

// Hidden stars (easter eggs). Normally just one, near the bottom-left, and
// barely brighter than the background field - you'd only click it if you
// were looking. Switch the home page into radar mode (click the dot in the
// logo's eye) and the radar unveils it along with the others: each pings
// as a contact, and each holds a different species' card.
//
// Clicking a star shows a random card for 9 seconds (Update 5.59: any of the
// current species). Put it away with the x, Escape, a click outside it, the
// star again, or a fifth click on the card (four turns all the way round).
// To add another hidden star: add an entry - position is from the viewport's
// edges, so it lands in the same spot on every screen.
const STARS = [
  { id: "first", left: "9%", bottom: "13%" }, // the one findable without the radar
  { id: "c2", right: "8%", top: "24%", radarOnly: true },
  { id: "c3", left: "14%", top: "34%", radarOnly: true },
  { id: "c4", right: "15%", bottom: "18%", radarOnly: true },
  { id: "c5", left: "30%", bottom: "6%", radarOnly: true },
  { id: "c6", right: "30%", top: "12%", radarOnly: true },
];

const SHOW_MS = 9000;

async function loadSpecies() {
  const supabase = createClient();
  // "*" so the optional portrait_svg and stats columns come along when present
  const { data } = await supabase.from("alien_species").select("*").order("created_at", { ascending: false }).limit(100);
  const list = data || [];
  // every current card is in the draw (Update 5.59)
  const pool = [...list];
  const ids = [...new Set(pool.map((s) => s.user_id))];
  let names = {};
  if (ids.length) {
    const { data: profiles } = await supabase.from("profiles").select("id, username").in("id", ids);
    names = Object.fromEntries((profiles || []).map((p) => [p.id, p.username]));
  }
  return pool.map((species) => ({ species, creator: names[species.user_id] }));
}

export default function EasterStars({ radar = false }) {
  const [shown, setShown] = useState(null); // { starId, species, creator } | { starId, empty: true }
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);
  const species = useRef(null);
  const clicks = useRef(0); // clicks on the card: four turns it all the way round, the fifth puts it away

  const close = () => {
    clearTimeout(timer.current);
    setVisible(false);
    timer.current = setTimeout(() => setShown(null), 400);
  };

  const open = async (starId) => {
    if (shown && visible && shown.starId === starId) { close(); return; }
    clearTimeout(timer.current);
    try {
      if (!species.current) species.current = await loadSpecies();
      const list = species.current;
      // a random card each time, from all of them (never the same one twice running)
      let k = Math.floor(Math.random() * list.length);
      if (list.length > 1 && shown && !shown.empty && list[k].species.id === shown.species.id) k = (k + 1) % list.length;
      const pick = list.length ? list[k] : null;
      clicks.current = 0;
      setShown(pick ? { starId, ...pick } : { starId, empty: true });
    } catch (e) {
      setShown({ starId, empty: true });
    }
    requestAnimationFrame(() => setVisible(true));
    timer.current = setTimeout(close, SHOW_MS);
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!shown) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!radar && shown && STARS.find((s) => s.id === shown.starId)?.radarOnly) close(); }, [radar]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <style>{`
        @keyframes easterPing { 0% { transform: scale(0.3); opacity: 0.9; } 100% { transform: scale(2.6); opacity: 0; } }
        @keyframes easterAppear { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
        .easter-ping { position: absolute; left: 50%; top: 50%; width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 50%; border: 1px solid rgba(185,192,255,0.8); animation: easterPing 2.2s ease-out infinite; }
        .easter-ping.late { animation-delay: 1.1s; }
        .easter-contact { animation: easterAppear 0.6s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .easter-ping { animation: none; opacity: 0.5; } .easter-contact { animation: none; } }
      `}</style>
      {STARS.filter((s) => radar || !s.radarOnly).map((s, i) => (
        <button
          key={s.id}
          onClick={() => open(s.id)}
          aria-label={radar ? `Radar contact ${i + 1}` : "A faint star"}
          className={radar ? "easter-contact" : ""}
          style={{
            position: "fixed",
            left: s.left,
            right: s.right,
            top: s.top,
            bottom: s.bottom,
            width: 30,
            height: 30,
            margin: s.left ? "0 0 -15px -15px" : "0 -15px -15px 0",
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            zIndex: 3,
            animationDelay: `${i * 0.12}s`,
          }}
        >
          {radar && <span className="easter-ping" />}
          {radar && <span className="easter-ping late" />}
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: radar ? 5 : 2.4,
              height: radar ? 5 : 2.4,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: radar ? "#E9D29A" : "#E4E4F4",
              opacity: radar ? 1 : 0.7,
              boxShadow: radar ? "0 0 10px 3px rgba(233,210,154,0.6)" : "0 0 2px 0.5px rgba(220,223,255,0.35)",
              transition: "all 0.5s ease",
            }}
          />
          {radar && (
            <span className="mono" style={{ position: "absolute", left: "50%", top: 26, transform: "translateX(-50%)", fontSize: 8.5, letterSpacing: "1.5px", color: "rgba(185,192,255,0.75)", whiteSpace: "nowrap" }}>
              CONTACT {String(i + 1).padStart(2, "0")}
            </span>
          )}
        </button>
      ))}

      {shown && (
        <div onClick={close} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 49, background: visible ? "rgba(3,4,14,0.45)" : "transparent", transition: "background 0.4s" }} />
      )}
      {shown && (
        <div
          onClick={close}
          role="dialog"
          aria-label="A hidden card"
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.92})`,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.4s ease, transform 0.4s ease",
            zIndex: 50,
            cursor: "pointer",
          }}
        >
          {shown.empty ? (
            <div className="panel" style={{ maxWidth: 260, textAlign: "center" }}>
              <p style={{ margin: 0, color: "#B7BADF", fontSize: 14 }}>
                No aliens have been made yet. <a href="/create/alien-lab">Be the first.</a>
              </p>
            </div>
          ) : (
            // clicking the card turns it (and gives you another 9 seconds);
            // after all four sides, the fifth click puts it away
            <div style={{ position: "relative" }} onClick={(e) => {
              e.stopPropagation();
              clicks.current += 1;
              if (clicks.current >= 5) { close(); return; }
              clearTimeout(timer.current); timer.current = setTimeout(close, SHOW_MS);
            }}>
              <button
                onClick={(e) => { e.stopPropagation(); close(); }}
                aria-label="Close the card"
                className="mono"
                style={{ position: "absolute", top: -14, right: -14, zIndex: 2, width: 30, height: 30, borderRadius: "50%", border: "1px solid #3A3E75", background: "#0C0E28", color: "#B9C0FF", fontSize: 14, lineHeight: 1, cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.5)" }}
              >&times;</button>
              <AlienCard species={shown.species} creator={shown.creator} width={Math.min(280, typeof window !== "undefined" ? window.innerWidth - 40 : 280)} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
