"use client";

import { continuanceIndex } from "../lib/survivalEngine";
import { useState, useEffect, useRef } from "react";
import { backTraits, cardTagline, cardNumber } from "../lib/alienTraits";
import { STAT_GROUPS, statsFor } from "../lib/alienStats";
import { verdictFor } from "../lib/continuance";
import { playSignal, stopSignal } from "../lib/speciesSignal";
import { playFlip } from "../lib/cardSound";
import StatRadar from "./StatRadar";
import AlienHabitat from "./AlienHabitat";
import SpecimenStill from "./SpecimenStill";
import { assessmentFor } from "../lib/alienAssessment";

// Update 5.55: the card has four sides now, and keeps turning the same way:
//   1 front (portrait + stats) · 2 back (chart, traits, signal) ·
//   3 13i's assessment (four readings + its review, or a preliminary note) ·
//   4 the species in its own world, animated, filling the whole card.
// A 3D card only has two faces, so the hidden face swaps what it shows while
// it's turned away: front shows side 1 or 3, back shows side 2 or 4.
//
// A collectible card for one Alien Lab species. The front has the name,
// portrait, a line of flavour and the twelve stats; click it (with a soft flip sound) and it turns to
// a stats chart, the rest of its traits, its signal (lib/speciesSignal.js)
// and a link to its own page. 13i's Continuance verdict, once it has one,
// is a small mark down the side of the stats chart. Used by the gallery,
// the Node, the Alien Lab preview, and the homepage star easter egg.
//
// onSelect: when given, a click selects the card (the gallery's compare
// mode) instead of flipping it; `selected` highlights it.
// creatorAlpha: the creator is an Alpha User (lib/alpha.js) - an α by their name.
export default function AlienCard({ species, creator, creatorAlpha, width = 280, onSelect, selected }) {
  const [turns, setTurns] = useState(0); // every click turns the card half a revolution
  const side = turns % 4; // 0..3, the side showing
  const ci = continuanceIndex(species);
  const flipped = side % 2 === 1;
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
    setTurns((n) => n + 1);
  };

  // which side each physical face carries right now (see the note at the top)
  const frontShows3 = !onSelect && (side === 1 || side === 2);
  const backShows4 = !onSelect && (side === 2 || side === 3);
  const dots = (k) => (
    <span aria-hidden="true" style={{ letterSpacing: "2px" }}>
      {k === 0 && <span style={{ letterSpacing: 0, marginRight: 4 }}>tap to turn</span>}
      {[0, 1, 2, 3].map((i) => <span key={i} style={{ color: i === k ? "#E8CFC0" : "#3A3E75" }}>{"\u25CF"}</span>)}
    </span>
  );

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
        {species.cardLabel || cardNumber(species.id)}
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
      aria-label={onSelect ? `Select ${species.name}` : `${species.name} card, side ${side + 1} of 4. Click to turn it.`}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
      }}
      style={{ width, height, flexShrink: 0, alignSelf: "flex-start", perspective: 1200 }}
    >
      <div className="alien-card-inner" style={{ transform: `rotateY(${turns * 180}deg)` }}>
        {/* ---- front: side 1, or side 3 (13i's assessment) ---- */}
        <div className="alien-card-face alien-card-frame" style={frame}>
          {frontShows3 ? <AssessmentSide species={species} s={s} inner={inner} nameBar={nameBar} footer={footer} dots={dots} /> : (
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
                <SpecimenStill answers={species.answers} />
              )}
              {/* the Continuance Index (Update 5.59): its overall survival
                  potential - an advantage in the Survival Trials, not a verdict */}
              <span className="mono" title="Continuance Index: how well-made this species is for surviving, overall" style={{ position: "absolute", right: 4 * s, bottom: 4 * s, display: "flex", alignItems: "baseline", gap: 3 * s, padding: `${2 * s}px ${6 * s}px`, borderRadius: 3 * s, background: "rgba(10,11,28,0.85)", border: `${1 * s}px solid #C9B98F`, color: "#F5EEDB", fontSize: 12 * s, lineHeight: 1.2 }}>
                <span style={{ fontSize: 6.5 * s, letterSpacing: "1px", color: "#C9B98F" }}>CI</span>{ci}
              </span>
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

            {footer(onSelect ? date : dots(0))}
          </div>
          )}
        </div>

        {/* ---- back: side 2, or side 4 (its world) ---- */}
        <div className="alien-card-face alien-card-frame" style={{ ...frame, transform: "rotateY(180deg)" }}>
          {backShows4 ? (
            <div style={{ ...inner, padding: 0, position: "relative" }}>
              <AlienHabitat species={species} active={side === 3} />
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, padding: `${8 * s}px ${10 * s}px`, background: "linear-gradient(rgba(5,6,16,0.75), rgba(5,6,16,0))" }}>{nameBar}</div>
              <div className="mono" style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: `${12 * s}px ${10 * s}px ${7 * s}px`, display: "flex", justifyContent: "space-between", fontSize: 8 * s, color: "#DCDFFF", background: "linear-gradient(rgba(5,6,16,0), rgba(5,6,16,0.8))", letterSpacing: "1px" }}>
                <span>IN ITS OWN WORLD</span><span>{dots(3)}</span>
              </div>
            </div>
          ) : (
          <div style={inner}>
            {nameBar}
            <div style={{ position: "relative", display: "flex", justifyContent: "center", margin: `${6 * s}px 0 ${2 * s}px` }}>
              <StatRadar stats={stats} size={180 * s} />
              {/* 13i's verdict, once given: a quiet mark down the side of the chart */}
              {verdict && (
                <span
                  className="mono"
                  title={`13i's Continuance Review: ${verdict.label}`}
                  style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", writingMode: "vertical-rl", fontSize: 6.5 * s, letterSpacing: "1.5px", color: verdict.color, opacity: 0.6, whiteSpace: "nowrap" }}
                >
                  {"\u25CF"} CONTINUANCE {verdict.short}
                </span>
              )}
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
                <a href={species.href || `/galaxy/aliens/${species.id}`} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} className="mono" style={{ ...miniBtn(s), textDecoration: "none" }}>
                  {species.hrefLabel || (verdict ? "13i's review \u2192" : "open \u2192")}
                </a>
              )}
            </div>
            {footer(onSelect ? date : dots(1))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Side 3: 13i's assessment. Four readings, then 13i's own review if it has
// written one, or a preliminary note from the record alone.
function AssessmentSide({ species, s, inner, nameBar, footer, dots }) {
  const { readings, text, review } = assessmentFor(species);
  const verdict = verdictFor(species);
  return (
    <div style={{ ...inner, background: "radial-gradient(circle at 50% 0%, rgba(139,149,246,0.18), transparent 60%), linear-gradient(180deg, #14163A 0%, #0A0B1C 100%)" }}>
      {nameBar}
      <div style={{ display: "flex", alignItems: "center", gap: 6 * s, margin: `${7 * s}px 0 ${5 * s}px` }}>
        <svg viewBox="0 0 24 24" width={16 * s} height={16 * s} aria-hidden="true"><circle cx="12" cy="11" r="7" fill="none" stroke="#B9C0FF" strokeWidth="1.6" /><circle cx="12" cy="11" r="2.4" fill="#E8CFC0" /><path d="M12 18 V23" stroke="#B9C0FF" strokeWidth="1.6" /></svg>
        <span className="mono" style={{ fontSize: 8.5 * s, letterSpacing: "1.5px", color: "#B9C0FF" }}>13i &middot; ASSESSMENT</span>
        {verdict && <span className="mono" style={{ marginLeft: "auto", fontSize: 7.5 * s, letterSpacing: "1px", color: verdict.color, border: `1px solid ${verdict.color}`, borderRadius: 3 * s, padding: `${1 * s}px ${4 * s}px` }}>{verdict.short}</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 * s, marginBottom: 7 * s }}>
        {readings.map((r) => (
          <div key={r.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="mono" style={{ fontSize: 8 * s, color: "#DCDFFF", letterSpacing: "0.5px" }}>{r.label.toUpperCase()}</span>
              <span className="mono" style={{ fontSize: 7 * s, color: "#6E76B8" }}>{r.note}</span>
            </div>
            <div style={{ height: 4 * s, borderRadius: 2 * s, background: "rgba(38,42,85,0.8)", overflow: "hidden", marginTop: 2 * s }}>
              <div style={{ width: `${r.value}%`, height: "100%", background: r.color, boxShadow: `0 0 ${6 * s}px ${r.color}` }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative" }}>
        <p style={{ margin: 0, fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 9.6 * s, lineHeight: 1.42, color: "#D9DCFF" }}>
          {review ? review.text : text}
        </p>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 14 * s, background: "linear-gradient(rgba(10,11,28,0), #0A0B1C)" }} />
      </div>
      <div className="mono" style={{ fontSize: 7 * s, color: review ? "#6FC3A8" : "#8A8FBF", marginTop: 4 * s, letterSpacing: "0.5px" }}>
        {review ? "CONTINUANCE REVIEW · WRITTEN BY 13i" : "PRELIMINARY · FROM ITS RECORD ALONE"}
      </div>
      {footer(dots(2))}
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
