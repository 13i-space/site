"use client";
// The Detective's Notebook: the Clue sheet. Who, with what, where. Clue cards
// from your chores fill it in on their own (a struck-through weapon is
// accounted for, a struck-through room had no struggle); click any line to
// add your own marks: ✗ ruled out, ? not sure, ★ suspect.
import { useEffect, useRef } from "react";
import { WEAPONS, CRIME_PLACES, GALLERIES, weaponById } from "../../lib/castle/clues";
import { ROOMS } from "../../lib/castle/map";
import { drawWeaponIcon } from "./draw";

export const placeName = (id) => (id === GALLERIES ? "The galleries" : ROOMS.find((r) => r.id === id)?.name || id);
const MARKS = ["", "✗", "?", "★"];

export function WeaponIcon({ id, size = 26 }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, g = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = size * dpr; cv.height = size * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, size, size);
    g.translate(size / 2, size / 2 + 1);
    drawWeaponIcon(g, id, size / 30);
  }, [id, size]);
  return <canvas ref={ref} style={{ width: size, height: size, flexShrink: 0 }} aria-hidden="true" />;
}

// what the cards say about each weapon and room this round
export function deduce(cards, missing) {
  const weapons = {}, places = {};
  for (const c of cards || []) {
    if (c.weapon) weapons[c.weapon] = c.missing ? "missing" : weapons[c.weapon] === "missing" ? "missing" : "clear";
    if (c.place) places[c.place] = c.struggle ? "struggle" : places[c.place] === "struggle" ? "struggle" : { clear: c.t };
  }
  for (const m of missing || []) if (m.found && m.place) places[m.place] = "struggle";
  return { weapons, places };
}

export function Notebook({ world, myId, cards, marks, setMark, compact = false, onClose }) {
  const me = world.entities[myId];
  const { weapons, places } = deduce(cards, (world.markers || []).filter((m) => m.found));
  const missing = (world.markers || []).map((m) => world.entities[m.victimId]?.name).filter(Boolean);
  const mark = (k) => marks[k] || "";
  const cycle = (k) => setMark(k, MARKS[(MARKS.indexOf(mark(k)) + 1) % MARKS.length]);
  const row = (k, label, auto, extra) => {
    const m = mark(k);
    const struck = auto === "clear" || m === "✗";
    const hot = auto === "missing" || auto === "struggle" || m === "★";
    return (
      <button key={k} onClick={() => cycle(k)} title="Click to mark: ✗ ruled out, ? not sure, ★ suspect" style={{ ...N.row, color: hot ? "#ffb4a2" : struck ? "#6d6890" : "#e7e1ff" }}>
        <span style={{ width: 16, textAlign: "center", color: m === "★" ? "#f2dc9a" : m === "✗" ? "#8d87ad" : "#c9c3e6", fontWeight: 700 }}>{m}</span>
        {extra}
        <span style={{ flex: 1, textDecoration: struck ? "line-through" : "none", textAlign: "left" }}>{label}</span>
        {auto === "missing" && <span style={N.tag}>stand empty!</span>}
        {auto === "struggle" && <span style={N.tag}>struggle!</span>}
        {auto === "clear" && <span style={{ ...N.tag, background: "transparent", color: "#6d6890" }}>clue card</span>}
      </button>
    );
  };
  return (
    <div style={{ ...N.book, ...(compact ? { maxHeight: "none", boxShadow: "none" } : {}) }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <div style={N.title}>Detective&rsquo;s Notebook</div>
        {onClose && <button onClick={onClose} style={N.x} aria-label="Close the notebook">×</button>}
      </div>
      <div style={N.case}>
        {missing.length
          ? <>Round {world.round}: <b>{missing.join(" and ")}</b> {missing.length > 1 ? "were" : "was"} taken. Who did it, with what, and where?</>
          : <>Round {world.round}: nobody taken yet. Do chores to collect clue cards.</>}
      </div>
      <div style={N.head}>WHO</div>
      {world.entities.filter((e) => e.id !== myId).map((e) => row(`who-${e.id}`, `${e.name}${e.out ? " (out)" : !e.alive ? " (captured)" : ""}`, e.out && e.role !== "blackknight" ? null : null,
        <span style={{ width: 10, height: 10, borderRadius: 2, background: e.color, flexShrink: 0 }} />))}
      <div style={N.head}>WITH WHAT</div>
      {WEAPONS.map((w) => row(`weapon-${w.id}`, w.name, weapons[w.id], <WeaponIcon id={w.id} size={18} />))}
      <div style={N.head}>WHERE</div>
      {CRIME_PLACES.map((p) => row(`place-${p}`, placeName(p), places[p] === "struggle" ? "struggle" : places[p] ? "clear" : null))}
      {(world.caseLog || []).length > 0 && (
        <>
          <div style={N.head}>SOLVED SO FAR</div>
          {world.caseLog.map((c) => (
            <div key={c.round} style={{ fontSize: 11.5, color: "#c9c3e6", padding: "2px 0" }}>
              Round {c.round}: {weaponById(c.weapon)?.the}, in {c.places.map((p) => placeName(p).replace(/^The /, "the ")).join(" / ")} ({c.victims.join(", ")}). Who? Still a mystery...
            </div>
          ))}
        </>
      )}
      {me && me.role === "blackknight" && <div style={{ fontSize: 11.5, color: "#ff9a85", marginTop: 8 }}>You know the answers, of course. Keep the notebook up to look the part.</div>}
    </div>
  );
}

const N = {
  book: { background: "linear-gradient(180deg, #2a2116, #1d170f)", border: "1px solid #8a6a3a", borderRadius: 8, padding: "10px 12px", color: "#efe6cc", maxHeight: "60vh", overflow: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", fontFamily: "Inter, system-ui, sans-serif" },
  title: { fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: 19, color: "#f2dc9a" },
  x: { background: "transparent", border: 0, color: "#c9b48a", fontSize: 18, cursor: "pointer" },
  case: { fontSize: 12, color: "#e3d7b4", margin: "4px 0 6px", lineHeight: 1.45 },
  head: { fontSize: 10, letterSpacing: "2px", color: "#c9a227", margin: "8px 0 2px", fontFamily: "ui-monospace, monospace" },
  row: { display: "flex", alignItems: "center", gap: 7, width: "100%", background: "transparent", border: 0, borderBottom: "1px dotted rgba(201,165,74,0.25)", padding: "3px 2px", fontSize: 12.5, cursor: "pointer", fontFamily: "inherit" },
  tag: { fontSize: 10, background: "rgba(140,30,30,0.55)", color: "#ffd0c4", borderRadius: 4, padding: "1px 5px" },
};
