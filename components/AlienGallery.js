"use client";

import { useState, useEffect, useRef } from "react";
import AlienCard from "./AlienCard";
import { runTrials } from "../lib/alienTrials";
import { recordMilestone } from "../lib/milestones";

const A_COLOR = "#C9B98F";
const B_COLOR = "#8B95F6";
const REVEAL_MS = 900;

// The Aliens of the Galaxy grid. Cards flip on click; in compare mode a
// click picks a card instead, and picking two runs the Survival Trials.
export default function AlienGallery({ species: initial, highlight = null, canRepaint = false }) {
  const [species, setSpecies] = useState(initial);
  // Update 5.63: solid colour, or the original line art where a species has both
  const [look, setLook] = useState("solid");
  useEffect(() => { try { const v = localStorage.getItem("13i_alien_look"); if (v === "line") setLook("line"); } catch (e) { /* ignore */ } }, []);
  const chooseLook = (v) => { setLook(v); try { localStorage.setItem("13i_alien_look", v); } catch (e) { /* ignore */ } };
  const hasBoth = species.some((sp) => sp.portrait_line_svg);
  const shown = look === "line" ? species.map((sp) => (sp.portrait_line_svg ? { ...sp, portrait_svg: sp.portrait_line_svg } : sp)) : species;
  const [comparing, setComparing] = useState(false);
  const [picked, setPicked] = useState([]);

  const toggle = (id) => {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 2 ? [...p, id] : p));
  };
  // the species you just made: scroll to it (it's first) and say so
  useEffect(() => {
    if (!highlight) return;
    const el = document.getElementById(`species-${highlight}`);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
  }, [highlight]);
  const pair = picked.length === 2 ? picked.map((id) => shown.find((s) => s.id === id)) : null;

  return (
    <div>
      {species.length > 1 && (
        <div className="panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
          <span>
            <span className="mono" style={{ display: "block", fontSize: 10, color: "#C9B98F", letterSpacing: "1.5px" }}>SURVIVAL TRIALS</span>
            <span style={{ fontSize: 13, color: "#8A8FBF" }}>
              {comparing
                ? picked.length === 0
                  ? "Pick two species."
                  : "Pick one more."
                : "Put two species through the same five disasters and see which one outlasts the other."}
            </span>
          </span>
          <button
            onClick={() => { setComparing((c) => !c); setPicked([]); }}
            className="mono"
            style={{ background: comparing ? "rgba(139,149,246,0.12)" : "none", border: `1px solid ${comparing ? "#8B95F6" : "#3A3E75"}`, borderRadius: 4, color: "#B9C0FF", fontSize: 12, padding: "9px 16px", cursor: "pointer" }}
          >
            {comparing ? "Cancel" : "Compare two species"}
          </button>
        </div>
      )}

      {canRepaint && <RepaintPanel species={species} onPainted={(id, svg, line) => setSpecies((list) => list.map((sp) => (sp.id === id ? { ...sp, portrait_svg: svg, portrait_line_svg: line } : sp)))} />}

      {hasBoth && (
        <div className="look-switch" role="group" aria-label="How the portraits are shown">
          <span className="mono">PORTRAITS</span>
          <button className={look === "solid" ? "on" : ""} onClick={() => chooseLook("solid")}>Solid colour</button>
          <button className={look === "line" ? "on" : ""} onClick={() => chooseLook("line")}>Original line art</button>
        </div>
      )}

      <div style={styles.grid}>
        {shown.map((sp) => (
          <div key={sp.id} id={`species-${sp.id}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {highlight === sp.id && <div className="mono gallery-new-tag">JUST ARRIVED &middot; YOURS</div>}
            <AlienCard
              highlight={highlight === sp.id}
              species={sp}
              creator={sp.creator}
              creatorAlpha={sp.creatorAlpha}
              width={260}
              onSelect={comparing ? () => toggle(sp.id) : undefined}
              selected={picked.includes(sp.id)}
            />
          </div>
        ))}
      </div>

      {pair && <Trials a={pair[0]} b={pair[1]} onClose={() => setPicked([])} onDone={() => { setPicked([]); setComparing(false); }} />}
    </div>
  );
}

// Sentinel-X only (Update 5.63): repaint every Kin portrait in solid colour,
// two at a time. Each repaint keeps the original (portrait_line_svg).
function RepaintPanel({ species, onPainted }) {
  const todo = species.filter((sp) => !sp.archive && sp.portrait_svg && !sp.portrait_line_svg && !/data-solid=/.test(sp.portrait_svg));
  const [status, setStatus] = useState("idle"); // idle | running | done
  const started = useRef(false);
  const [log, setLog] = useState([]);
  const note = (line) => setLog((l) => [...l.slice(-12), line]);

  const repaintOne = async (sp) => {
    note(`${sp.name} - repainting...`);
    try {
      const res = await fetch("/api/alien", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "repaint", speciesId: sp.id }) });
      if ((res.headers.get("content-type") || "").includes("application/json")) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "couldn't start");
      }
      const text = await res.text();
      const msg = text.split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch (e) { return {}; } }).find((m) => m.svg || m.error);
      if (!msg || msg.error || !msg.saved) throw new Error(msg?.error || "nothing came back");
      onPainted(sp.id, msg.svg, sp.portrait_svg);
      note(`${sp.name} - done`);
      return true;
    } catch (e) {
      note(`${sp.name} - ${e.message}`);
      return !/Only Sentinel|SERVICE_ROLE/.test(e.message);
    }
  };
  const run = async () => {
    setStatus("running");
    const queue = [...todo];
    let ok = true;
    const worker = async () => { while (ok && queue.length) { const sp = queue.shift(); ok = (await repaintOne(sp)) && ok; } };
    await Promise.all([worker(), worker()]);
    setStatus("done");
  };
  // Update 5.64: it starts by itself when Sentinel-X opens the gallery
  useEffect(() => { if (!started.current && todo.length) { started.current = true; run(); } }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="panel repaint-panel">
      <div>
        <div className="mono" style={{ fontSize: 10, color: "#E8B4C8", letterSpacing: "1.5px" }}>SENTINEL-X &middot; SOLID COLOUR</div>
        <div style={{ fontSize: 13, color: "#8A8FBF", marginTop: 4 }}>
          {todo.length
            ? status === "running" ? `Repainting ${todo.length} portrait${todo.length === 1 ? "" : "s"} in solid colour, two at a time - about a minute each. Keep this page open; each card changes when it's done.` : `${todo.length} Kin portrait${todo.length === 1 ? "" : "s"} still in line art.`
            : "Every Kin portrait has a solid version. New species are drawn in solid colour from the start."}
        </div>
        {log.length > 0 && <div className="mono repaint-log">{log.map((l, i) => <div key={i}>{l}</div>)}</div>}
      </div>
      {todo.length > 0 && (
        <button onClick={run} disabled={status === "running"} className="mono" style={{ ...styles.btn, borderColor: "#E8B4C8", color: "#F5DCE6" }}>
          {status === "running" ? "Repainting..." : `Repaint ${todo.length} in solid colour`}
        </button>
      )}
    </div>
  );
}

function Trials({ a, b, onClose, onDone }) {
  const result = runTrials(a, b);
  const [shown, setShown] = useState(0); // trials revealed so far

  useEffect(() => {
    if (shown >= result.rounds.length) return;
    const id = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 500 : REVEAL_MS);
    return () => clearTimeout(id);
  }, [shown, result.rounds.length]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const done = shown >= result.rounds.length;
  useEffect(() => { if (done) recordMilestone("trials"); }, [done]); // a step of the Kinship assignment
  const name = (w) => (w === "a" ? a.name : b.name);
  const cardWidth = typeof window !== "undefined" && window.innerWidth < 520 ? 150 : 200;

  return (
    <div role="dialog" aria-modal="true" aria-label="Survival Trials" onClick={onClose} style={styles.overlay}>
      <div onClick={(e) => e.stopPropagation()} className="panel" style={styles.modal}>
        <div className="mono" style={{ textAlign: "center", fontSize: 10, color: "#C9B98F", letterSpacing: "2px", marginBottom: 14 }}>
          SURVIVAL TRIALS
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <AlienCard species={a} creator={a.creator} width={cardWidth} />
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#565B8F" }}>vs</span>
          <AlienCard species={b} creator={b.creator} width={cardWidth} />
        </div>

        <div style={{ marginTop: 22 }}>
          {result.rounds.slice(0, shown).map((r) => (
            <div key={r.name} style={styles.round}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 15, color: "#DCDFFF" }}>{r.name}</span>
                <span className="mono" style={{ fontSize: 11, color: r.winner ? (r.winner === "a" ? A_COLOR : B_COLOR) : "#8A8FBF" }}>
                  {r.winner ? `${name(r.winner)} endures` : "neither gives way"}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#8A8FBF", fontStyle: "italic", margin: "2px 0 8px" }}>{r.text}</div>
              <Bar label={a.name} score={r.a.score} color={A_COLOR} fits={r.a.fits} win={r.winner === "a"} />
              <Bar label={b.name} score={r.b.score} color={B_COLOR} fits={r.b.fits} win={r.winner === "b"} />
            </div>
          ))}
        </div>

        {done && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 24, color: result.winner ? (result.winner === "a" ? A_COLOR : B_COLOR) : "#DCDFFF" }}>
              {result.winner ? `${name(result.winner)} outlasts ${name(result.winner === "a" ? "b" : "a")}.` : "Both species endure."}
            </div>
            <div className="mono" style={{ fontSize: 11, color: "#8A8FBF", marginTop: 6 }}>
              {result.winsA} trial{result.winsA === 1 ? "" : "s"} to {result.winsB}
              {result.winsA === result.winsB && result.winner ? " · decided on total resilience" : ""}
            </div>
            <div style={{ fontSize: 11.5, color: "#565B8F", marginTop: 8 }}>
              Scores come from each species&rsquo; points. &#9733; marks a bonus for a species whose world or body suits that trial.
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <button onClick={onClose} className="mono" style={styles.btn}>Compare others</button>
              <button onClick={onDone} className="mono" style={{ ...styles.btn, opacity: 0.7 }}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Bar({ label, score, color, fits, win }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
      <span className="mono" style={{ width: 110, flexShrink: 0, fontSize: 10.5, color: win ? color : "#8A8FBF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 8, background: "#1A1D42", borderRadius: 4, overflow: "hidden" }}>
        <div className="trial-bar" style={{ height: "100%", width: `${Math.min(100, score)}%`, background: color, opacity: win ? 1 : 0.45, borderRadius: 4 }} />
      </div>
      <span className="mono" style={{ width: 52, flexShrink: 0, fontSize: 10.5, color: "#D9DCFF", textAlign: "right" }} title={fits ? "Bonus: suited to this by its answers" : undefined}>
        {score}{fits ? " ★" : ""}
      </span>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 28,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 200,
    background: "rgba(4,5,16,0.82)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    overflowY: "auto",
    padding: "40px 16px",
  },
  modal: {
    width: "100%",
    maxWidth: 640,
    boxSizing: "border-box",
    background: "#0C0E24",
    margin: 0,
  },
  round: {
    padding: "12px 0",
    borderTop: "1px solid #21244A",
    animation: "trial-in 0.4s ease",
  },
  btn: {
    background: "none",
    border: "1px solid #3A3E75",
    borderRadius: 4,
    color: "#B9C0FF",
    fontSize: 12,
    padding: "9px 16px",
    cursor: "pointer",
  },
};
