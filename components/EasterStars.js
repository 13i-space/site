"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "../lib/supabaseBrowser";
import AlienCard from "./AlienCard";

// Clickable stars (easter eggs). Each is a fixed star a little brighter than
// the background field. Clicking one shows a random Alien Lab card for
// 9 seconds; clicking the star again puts it away.
//
// To add another star: add an entry here - position is from the viewport's
// edges, so it lands in the same spot on every screen.
const STARS = [
  { id: "first", left: "9%", bottom: "13%", size: 2.6 },
];

const SHOW_MS = 9000;

async function randomSpecies() {
  const supabase = createClient();
  // "*" so the optional portrait_svg and stats columns come along when present
  const { data } = await supabase
    .from("alien_species")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const list = data || [];
  if (!list.length) return null;
  // prefer ones with a portrait, when there are any
  const drawn = list.filter((s) => s.portrait_svg);
  const pool = drawn.length ? drawn : list;
  const species = pool[Math.floor(Math.random() * pool.length)];
  const { data: profile } = await supabase.from("profiles").select("username").eq("id", species.user_id).maybeSingle();
  return { species, creator: profile?.username };
}

export default function EasterStars() {
  const [shown, setShown] = useState(null); // { starId, species, creator } | { starId, empty: true }
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);

  const close = () => {
    clearTimeout(timer.current);
    setVisible(false);
    timer.current = setTimeout(() => setShown(null), 400);
  };

  const open = async (starId) => {
    if (shown && visible && shown.starId === starId) { close(); return; }
    clearTimeout(timer.current);
    try {
      const result = await randomSpecies();
      setShown(result ? { starId, ...result } : { starId, empty: true });
    } catch (e) {
      setShown({ starId, empty: true });
    }
    requestAnimationFrame(() => setVisible(true));
    timer.current = setTimeout(close, SHOW_MS);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <style>{`
        @keyframes easterTwinkle { 0%, 100% { opacity: 0.75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.25); } }
        .easter-star-dot { animation: easterTwinkle 3.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .easter-star-dot { animation: none; } }
      `}</style>
      {STARS.map((s) => (
        <button
          key={s.id}
          onClick={() => open(s.id)}
          aria-label="A bright star"
          style={{
            position: "fixed",
            left: s.left,
            bottom: s.bottom,
            width: 28,
            height: 28,
            marginLeft: -14,
            marginBottom: -14,
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            zIndex: 3,
          }}
        >
          <span
            className="easter-star-dot"
            style={{
              display: "block",
              width: s.size * 2,
              height: s.size * 2,
              margin: "0 auto",
              borderRadius: "50%",
              background: "#F4F2FF",
              boxShadow: `0 0 ${s.size * 3}px ${s.size}px rgba(220,223,255,0.55)`,
            }}
          />
        </button>
      ))}

      {shown && (
        <div
          onClick={close}
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
            <AlienCard species={shown.species} creator={shown.creator} width={Math.min(280, typeof window !== "undefined" ? window.innerWidth - 40 : 280)} />
          )}
        </div>
      )}
    </>
  );
}
