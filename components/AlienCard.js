"use client";

import { useState, useEffect, useRef } from "react";
import { backTraits, cardTagline, cardNumber } from "../lib/alienTraits";
import { STAT_GROUPS, statsFor } from "../lib/alienStats";
import { verdictFor } from "../lib/continuance";
import { playSignal, stopSignal } from "../lib/speciesSignal";
import { playFlip } from "../lib/cardSound";
import StatRadar from "./StatRadar";

// A collectible card for one Alien Lab species. The front has the name,
// portrait, a line of flavour and the twelve stats; click it (with a soft flip sound) and it turns to
// a stats chart, the rest of its traits, its signal (lib/speciesSignal.js)
// and a link to its own page. 13i's Continuance verdict, once it has one,
// is stamped on the portrait. Used by the gallery,
// the Node, the Alien Lab preview, and the homepage star easter egg.
//
// onSelect: when given, a click selects the card (the gallery's compare
// mode) instead of flipping it; `selected` highlights it.
// creatorAlpha: the creator is an Alpha User (lib/alpha.js) - an α by their name.
export default function AlienCard({ species, creator, creatorAlpha, width = 280, onSelect, selected }) {
  const [flipped, setFlipped] = useState(false);
  const [playing, setPlaying] = useState(false);
  const verdict = verdictFor(species);
  const playingRef = useRef(false);
  playingRef.current = playing;
  // stop this card's signal if the card goes away mid-play (unmount only -
  // another card starting its own signal already ends this one)
  useEffect(() => () => { if (playingRef.current) stopSignal(); }, []);

  const toggleSignal = (e) => {
    e.stopPropagation();
    if (playing) { stopSignal(); return; }
    setPlaying(true);
    playSignal(species, { onEnd: () => setPlaying(false) });
  };
  const { stats, estimated } = statsFor(species);
  const tagline = cardTagline(species.answers);
  const date = species.created_at
    ? new Date(species.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";
  const s = width / 280; // everything scales with the card's width
  const height = (width * 88) / 63;

  const activate = () => {
    if (onSelect) { onSelect(); return; }
    playFlip();
    setFlipped((f) => !f);
  };

  const frame = {
    padding: 7 * s,
    borderRadius: 14 * s,
    boxShadow: selected ? "0 0 0 3px #E8CFC0, 0 10px 30px rgba(0,0,0,0.45)" : "0 10px 30px rgba(0,0,0,0.45)",
    boxSizing: "border-box",
  };
  const inner = {
    height: "100%",
    borderRadius: 9 * s,
    background: "linear-gradient(180deg, #14163A 0%, #0A0B1C 100%)",
    padding: `${9 * s}px ${10 * s}px ${8 * s}px`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    textAlign: "left",
  };

  const nameBar = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6 * s }}>
      <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 18 * s, color: "#DCDFFF", lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {species.name || "Unnamed species"}
      </span>
      <span className="mono" style={{ fontSize: 8.5 * s, color: "#C9B98F", letterSpacing: "1px", flexShrink: 0 }}>
        {cardNumber(species.id)}
      </span>
    </div>
  );

  const footer = (right) => (
    <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: 6 * s, marginTop: 6 * s, paddingTop: 5 * s, borderTop: "1px solid #3A3E75", fontSize: 8.5 * s, color: "#8A8FBF" }}>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        by {creator || "a Kin"}
        {creatorAlpha && <span title="Made by an Alpha User" style={{ color: "#E8CFC0", marginLeft: 4 * s }}>&alpha;</span>}
      </span>
      <span style={{ flexShrink: 0 }}>{right}</span>
    </div>
  );

  return (
    <div
      className="alien-card"
      role="button"
      tabIndex={0}
      aria-pressed={onSelect ? !!selected : flipped}
      aria-label={onSelect ? `Select ${species.name}` : `${species.name} card, ${flipped ? "back" : "front"}. Click to flip.`}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
      }}
      style={{ width, height, flexShrink: 0, alignSelf: "flex-start", perspective: 1200 }}
    >
      <div className="alien-card-inner" style={{ transform: flipped ? "rotateY(180deg)" : "none" }}>
        {/* ---- front ---- */}
        <div className="alien-card-face alien-card-frame" style={frame}>
          <div style={inner}>
            {nameBar}

            {/* portrait window */}
            <div
              style={{
                marginTop: 6 * s,
                aspectRatio: "16 / 11",
                position: "relative", // the image is positioned inside, so it can't stretch the window
                borderRadius: 4 * s,
                border: `${2 * s}px solid #C9B98F`,
                overflow: "hidden",
                background: "#0A0B1C",
                flexShrink: 0,
              }}
            >
              {species.portrait_svg ? (
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(species.portrait_svg)}`}
                  alt={`Portrait of ${species.name}`}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="mono" style={{ fontSize: 9 * s, color: "#3A3E75", letterSpacing: "1px" }}>NO PORTRAIT YET</span>
                </div>
              )}
              {verdict && (
                <div className="mono" title={`13i's Continuance Review: ${verdict.label}`} style={{ position: "absolute", top: 6 * s, right: 6 * s, transform: "rotate(-6deg)", border: `${1.5 * s}px solid ${verdict.color}`, color: verdict.color, background: "rgba(10,11,28,0.78)", borderRadius: 3 * s, padding: `${2 * s}px ${5 * s}px`, fontSize: 7.5 * s, letterSpacing: "1px", lineHeight: 1.2, textAlign: "center" }}>
                  CONTINUANCE<br />{verdict.short}
                </div>
              )}
            </div>

            {/* flavour strip */}
            {tagline && (
              <div style={{ margin: `${6 * s}px 0 ${2 * s}px`, padding: `${3 * s}px ${6 * s}px`, background: "rgba(201,185,143,0.12)", borderRadius: 3 * s, fontSize: 10 * s, color: "#E8CFC0", fontStyle: "italic", lineHeight: 1.35 }}>
                {tagline}
              </div>
            )}

            {/* the twelve stats: the four-stat groups get a row each, the two
                two-stat groups (Ecological & Sensory, Life Cycle) share one */}
            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 5 * s }}>
              {[STAT_GROUPS.filter((g) => g.stats.length === 4).map((g) => [g]), [STAT_GROUPS.filter((g) => g.stats.length === 2)]].flat().map((row) => (
                <div key={row.map((g) => g.id).join("-")} style={{ display: "grid", gridTemplateColumns: `repeat(${row.length}, 1fr)`, gap: 3 * s }}>
                  {row.map((g) => (
                    <div key={g.id} style={{ minWidth: 0 }}>
                      <div className="mono" style={{ fontSize: 7.5 * s, color: g.color, letterSpacing: "1px", marginBottom: 2 * s, opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {g.label.toUpperCase()}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: `repeat(${g.stats.length}, 1fr)`, gap: 3 * s }}>
                        {g.stats.map((st) => (
                          <div key={st.id} title={`${st.label}: ${st.desc}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: `${2 * s}px ${4 * s}px`, borderRadius: 3 * s, background: "rgba(38,42,85,0.55)", borderLeft: `${2 * s}px solid ${g.color}` }}>
                            <span className="mono" style={{ fontSize: 7.5 * s, color: "#8A8FBF" }}>{st.abbr}</span>
                            <span className="mono" style={{ fontSize: 10.5 * s, color: "#E4E4EF" }}>{Math.round(stats[st.id])}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {footer(onSelect ? date : "tap to flip")}
          </div>
        </div>

        {/* ---- back ---- */}
        <div className="alien-card-face alien-card-frame" style={{ ...frame, transform: "rotateY(180deg)" }}>
          <div style={inner}>
            {nameBar}
            <div style={{ display: "flex", justifyContent: "center", margin: `${6 * s}px 0 ${2 * s}px` }}>
              <StatRadar stats={stats} size={180 * s} />
            </div>
            {estimated && (
              <div className="mono" style={{ textAlign: "center", fontSize: 7.5 * s, color: "#565B8F", marginBottom: 2 * s }}>
                STATS ESTIMATED FROM ITS ANSWERS
              </div>
            )}
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
              {backTraits(species.answers).map((t) => (
                <div key={t.label} style={{ display: "flex", justifyContent: "space-between", gap: 8 * s, fontSize: 9.5 * s, lineHeight: 1.2, padding: `${1.5 * s}px 0`, borderBottom: "1px solid rgba(38,42,85,0.7)" }}>
                  <span className="mono" style={{ color: "#6E76B8", fontSize: 8 * s, letterSpacing: "0.5px", flexShrink: 0 }}>{t.label.toUpperCase()}</span>
                  <span style={{ color: "#D9DCFF", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 6 * s, marginTop: 5 * s }}>
              <button onClick={toggleSignal} onKeyDown={(e) => e.stopPropagation()} className="mono" aria-label={playing ? "Stop its signal" : "Play its signal"} style={{ ...miniBtn(s), color: playing ? "#E8CFC0" : "#B9C0FF", borderColor: playing ? "#E8CFC0" : "#3A3E75" }}>
                {playing ? "\u25A0 stop" : "\u25B6 its signal"}
              </button>
              {species.id && !onSelect && (
                <a href={`/galaxy/aliens/${species.id}`} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} className="mono" style={{ ...miniBtn(s), textDecoration: "none" }}>
                  {verdict ? "13i's review \u2192" : "open \u2192"}
                </a>
              )}
            </div>
            {footer(date)}
          </div>
        </div>
      </div>
    </div>
  );
}

const miniBtn = (s) => ({
  background: "none",
  border: "1px solid #3A3E75",
  borderRadius: 3 * s,
  color: "#B9C0FF",
  fontSize: 8.5 * s,
  padding: `${3 * s}px ${6 * s}px`,
  cursor: "pointer",
  lineHeight: 1.2,
});
