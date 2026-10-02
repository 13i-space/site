"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import InteractiveScene from "./InteractiveScene";
import FullscreenButton from "./FullscreenButton";
import { loadBookmark, saveBookmark, clearBookmark, foundEndings, recordEnding, kinStats } from "../lib/interactive/progress";
import { interactiveFor } from "../lib/interactive";
import { lyraReading } from "../lib/lyraMusic";
import { startAmbience, stopAmbience, mood, chime, MOOD_FOR_SCENE } from "../lib/interactive/ambience";

// Plays an Interactive Assignment (a script from lib/interactive/). The
// script decides everything about the story; this decides how it looks,
// how it's paced, and how it's saved. See docs/INTERACTIVE.md.

const BASE_SPEAKERS = {
  "13i": { label: "13i", kind: "narration" },
  readout: { label: null, kind: "readout" },
  limb3: { label: "APPENDAGE 03", kind: "voice" },
  limb7: { label: "APPENDAGE 07", kind: "voice" },
  limb12: { label: "APPENDAGE 12", kind: "voice" },
  child: { label: "APPENDAGE 11 · JUVENILE", kind: "voice" },
  childmind: { label: "CENTRAL MIND · JUVENILE", kind: "mind" },
  elder: { label: "CENTRAL MIND · THE ELDER", kind: "mind" },
  crowd: { label: "THE OTHERS", kind: "mind" },
};

const TAG_COLORS = {
  OBSERVE: "#8B95F6",
  COMMUNICATE: "#E8CFC0",
  INTERVENE: "#C97B6E",
  ANALYZE: "#B9C0FF",
};



// How far through the record the reader is. The script is a branching
// graph, so "how much is left" is measured as the longest run of lines from
// here to any ending; it only ever shrinks as the reader moves on, so the
// bar never slides backwards. Targets chosen by a function of flags are
// read from the function's source (every node id it can return).
function successorsOf(node, ids) {
  const out = new Set();
  const add = (t) => {
    if (!t) return;
    if (typeof t === "string") { if (ids.has(t)) out.add(t); return; }
    if (typeof t === "function") {
      const src = String(t);
      for (const m of src.matchAll(/["'`]([\w-]+)["'`]/g)) if (ids.has(m[1])) out.add(m[1]);
    }
  };
  (node.choices || []).forEach((c) => add(c.next));
  add(node.next);
  return [...out];
}

function remainingLines(story) {
  const ids = new Set(Object.keys(story.nodes));
  const memo = {};
  const visiting = new Set();
  const walk = (id) => {
    if (memo[id] !== undefined) return memo[id];
    if (visiting.has(id)) return 0; // a loop - don't count it twice
    visiting.add(id);
    const node = story.nodes[id];
    const own = (node?.lines || []).length;
    const after = node && !node.ending ? Math.max(0, ...successorsOf(node, ids).map(walk)) : 0;
    visiting.delete(id);
    memo[id] = own + after;
    return memo[id];
  };
  ids.forEach(walk);
  return memo;
}

const SOUND_KEY = "13i_interactive_sound";

// Takes the assignment number (scripts hold functions, so the page can't
// pass the script itself from the server).
export default function InteractivePlayer({ number }) {
  const story = interactiveFor(number);
  const SPEAKERS = { ...BASE_SPEAKERS, ...(story.speakers || {}) };
  const moodFor = (sc) => (story.moods && story.moods[sc]) || MOOD_FOR_SCENE[sc] || "calm";
  const frameRef = useRef(null);
  const [phase, setPhase] = useState("title"); // title | play | ending
  const [nodeId, setNodeId] = useState(story.start);
  const [lineIdx, setLineIdx] = useState(0);
  const [flags, setFlags] = useState({});
  const [path, setPath] = useState([]); // [{ node, choice }]
  const [log, setLog] = useState([]);
  const [typed, setTyped] = useState(0);
  const [showLog, setShowLog] = useState(false);
  const [sound, setSound] = useState(true);
  const [bookmark, setBookmark] = useState(null);
  const [found, setFound] = useState(new Set());
  const [stats, setStats] = useState(null);
  const [signedIn, setSignedIn] = useState(true);
  const [readout, setReadout] = useState(null);
  const [reduced, setReduced] = useState(false);

  const node = story.nodes[nodeId];
  const lines = useMemo(() => (node?.lines || []).filter((l) => !l.if || l.if(flags)), [node, flags]);
  const line = lines[Math.min(lineIdx, lines.length - 1)] || null;
  const fullText = line?.text || "";
  const revealed = typed >= fullText.length;
  const atLastLine = lineIdx >= lines.length - 1;
  const choosing = phase === "play" && atLastLine && revealed && !!node?.choices;
  const closing = phase === "play" && atLastLine && revealed && !!node?.ending;
  const scene = phase === "ending" ? node?.scene : (line?.scene || node?.scene || "orbit");

  // ---- progress through the record (0-1) ----
  const remaining = useMemo(() => remainingLines(story), [story]);
  const progress = useMemo(() => {
    if (phase === "ending") return 1;
    const total = remaining[story.start] || 1;
    const ids = new Set(Object.keys(story.nodes));
    const after = node && !node.ending ? Math.max(0, ...successorsOf(node, ids).map((id) => remaining[id] || 0)) : 0;
    const left = Math.max(0, (node?.lines || []).length - lineIdx - (revealed ? 1 : 0)) + after;
    return Math.min(1, Math.max(0, 1 - left / total));
  }, [phase, remaining, story, node, lineIdx, revealed]);

  // Lyra reads along while a record is open
  useEffect(() => {
    lyraReading("open");
    return () => lyraReading("close");
  }, []);

  // ---- first load: bookmark, records found, sound preference ----
  useEffect(() => {
    setBookmark(loadBookmark(story.number));
    foundEndings(story.number).then(setFound);
    try {
      if (localStorage.getItem(SOUND_KEY) === "0") setSound(false);
    } catch (e) {
      // ignore
    }
    try {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) {
      // ignore
    }
    return () => stopAmbience();
  }, [story.number]);

  // ---- typewriter ----
  const typingRef = useRef(null);
  const stopTyping = () => {
    if (typingRef.current) clearInterval(typingRef.current);
    typingRef.current = null;
  };
  useEffect(() => {
    stopTyping();
    if (phase !== "play" || !line) return;
    if (reduced || line.who === "readout") {
      setTyped(fullText.length);
      return;
    }
    setTyped(0);
    let n = 0;
    const speed = SPEAKERS[line.who]?.kind === "voice" || SPEAKERS[line.who]?.kind === "mind" ? 55 : 22;
    typingRef.current = setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= fullText.length) stopTyping();
    }, speed);
    return stopTyping;
  }, [phase, nodeId, lineIdx, line, fullText, reduced]);

  // ---- remember what was shown ----
  useEffect(() => {
    if (phase !== "play" || !line) return;
    setLog((l) => {
      const last = l[l.length - 1];
      if (last && last.text === line.text && last.who === line.who) return l;
      return [...l, { who: line.who, text: line.text }];
    });
    if (line.who === "readout") setReadout(line.text);
    saveBookmark(story.number, { node: nodeId, line: lineIdx, flags, path });
  }, [phase, nodeId, lineIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- the drone follows the scene ----
  useEffect(() => {
    if (phase === "title") return;
    mood(moodFor(scene));
  }, [scene, phase]);

  const goTo = useCallback((id, nextFlags) => {
    setNodeId(id);
    setLineIdx(0);
    setTyped(0);
    if (nextFlags) setFlags(nextFlags);
    setReadout(null); // each part of the record starts with clean instruments
  }, []);

  const advance = useCallback(() => {
    if (phase !== "play" || showLog) return;
    if (!revealed) {
      stopTyping();
      setTyped(fullText.length);
      return;
    }
    if (!atLastLine) {
      setLineIdx((i) => i + 1);
      return;
    }
    if (node.choices || node.ending) return;
    const next = typeof node.next === "function" ? node.next(flags) : node.next;
    if (next) goTo(next);
  }, [phase, showLog, revealed, fullText, atLastLine, node, flags, goTo]);

  const choose = useCallback((c) => {
    const available = !c.requires || c.requires(flags);
    if (!available) {
      if (sound) chime(true);
      return;
    }
    if (sound) chime(false);
    // Lyra feels the choice (components/LyraOrb.js): a flinch for INTERVENE,
    // a slow nod for OBSERVE, a lean in for COMMUNICATE, a sharp look for ANALYZE
    try { window.dispatchEvent(new CustomEvent("13i:story", { detail: { tag: c.tag } })); } catch (e) { /* ignore */ }
    const nextFlags = { ...flags, ...(typeof c.set === "function" ? c.set(flags) : c.set || {}) };
    setPath((p) => [...p, { node: nodeId, choice: c.id, tag: c.tag, text: c.text }]);
    setLog((l) => [...l, { who: "choice", text: c.text, tag: c.tag }]);
    const next = typeof c.next === "function" ? c.next(nextFlags) : c.next;
    goTo(next, nextFlags);
  }, [flags, nodeId, sound, goTo]);

  const closeRecord = useCallback(async () => {
    const endingId = node.ending;
    setPhase("ending");
    // the story as written: she recognises it. Any other record: she's curious
    try { window.dispatchEvent(new CustomEvent("13i:story", { detail: { ending: story.endings[endingId]?.canon ? "canon" : "divergent" } })); } catch (e) { /* ignore */ }
    clearBookmark(story.number);
    setBookmark(null);
    const res = await recordEnding(story.number, endingId, flags.climax);
    setSignedIn(res.signedIn);
    foundEndings(story.number).then((f) => {
      f.add(endingId);
      setFound(new Set(f));
    });
    kinStats(story.number).then(setStats);
  }, [node, story.number, flags]);

  const begin = (resume) => {
    if (sound) startAmbience();
    if (resume && bookmark && story.nodes[bookmark.node]) {
      setFlags(bookmark.flags || {});
      setPath(bookmark.path || []);
      setNodeId(bookmark.node);
      setLineIdx(bookmark.line || 0);
    } else {
      clearBookmark(story.number);
      setFlags({});
      setPath([]);
      setNodeId(story.start);
      setLineIdx(0);
    }
    setLog([]);
    setReadout(null);
    setStats(null);
    setTyped(0);
    setPhase("play");
    setTimeout(() => frameRef.current?.focus(), 50);
  };

  const toggleSound = () => {
    const on = !sound;
    setSound(on);
    try {
      localStorage.setItem(SOUND_KEY, on ? "1" : "0");
    } catch (e) {
      // ignore
    }
    if (on && phase !== "title") {
      startAmbience();
      mood(moodFor(scene));
    } else {
      stopAmbience();
    }
  };

  // ---- keyboard: space / enter / → advance, 1-3 choose, L for the record ----
  useEffect(() => {
    const onKey = (e) => {
      if (phase !== "play") return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "l" || e.key === "L") {
        setShowLog((s) => !s);
        return;
      }
      if (showLog && e.key === "Escape") {
        setShowLog(false);
        return;
      }
      if (choosing && /^[1-9]$/.test(e.key)) {
        const c = node.choices[Number(e.key) - 1];
        if (c) choose(c);
        return;
      }
      if ((e.key === " " || e.key === "Enter" || e.key === "ArrowRight") && tag !== "BUTTON" && tag !== "A") {
        e.preventDefault();
        if (closing) closeRecord();
        else advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, choosing, closing, node, choose, advance, closeRecord, showLog]);

  const endingsList = Object.entries(story.endings).sort((a, b) => a[1].order - b[1].order);
  const ending = phase === "ending" ? story.endings[node.ending] : null;
  const speaker = line ? SPEAKERS[line.who] || SPEAKERS["13i"] : null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div ref={frameRef} tabIndex={-1} className="game-frame ia-frame" style={{ outline: "none" }}>
        <div className="ia-stage" onClick={phase === "play" && !choosing && !closing ? advance : undefined} style={{ cursor: phase === "play" && !choosing && !closing ? "pointer" : "default" }}>
          <InteractiveScene scene={phase === "title" ? story.titleScene || (story.start && story.nodes[story.start].scene) || "orbit" : scene} focus={phase === "play" ? line?.focus : []} pose={phase === "play" ? line?.pose : undefined} flags={flags} />

          {/* ---------- title ---------- */}
          {phase === "title" && (
            <div className="ia-title">
              <img src={story.cover} alt="" className="ia-title-art" />
              <div className="ia-title-body">
                <div className="mono" style={{ fontSize: 11, letterSpacing: "2px", color: "#8B95F6" }}>{story.designation.toUpperCase()}</div>
                <div className="wordmark" style={{ fontSize: "clamp(34px, 6vw, 58px)", color: "#DCDFFF", margin: "10px 0 12px", lineHeight: 1.05 }}>{story.title}</div>
                <p style={{ color: "#A9AEDB", fontSize: 15, lineHeight: 1.6, maxWidth: 460, margin: "0 0 22px" }}>{story.blurb}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {bookmark ? (
                    <>
                      <button className="ia-btn ia-btn-primary" onClick={(e) => { e.stopPropagation(); begin(true); }}>Continue the record</button>
                      <button className="ia-btn" onClick={(e) => { e.stopPropagation(); begin(false); }}>Begin again</button>
                    </>
                  ) : (
                    <button className="ia-btn ia-btn-primary" onClick={(e) => { e.stopPropagation(); begin(false); }}>Begin the Assignment</button>
                  )}
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: "#6E76B8", marginTop: 18, lineHeight: 1.9 }}>
                  YOU ARE 13i · ABOUT {story.minutes} MINUTES · {found.size} OF {endingsList.length} RECORDS FOUND
                  <br />
                  CLICK OR SPACE TO CONTINUE · 1–3 TO CHOOSE · L FOR THE RECORD SO FAR
                </div>
              </div>
            </div>
          )}

          {/* ---------- instruments ---------- */}
          {phase === "play" && (
            <>
              <div className="ia-hud mono">{readout || story.designation.toUpperCase()}</div>
              <div className="ia-controls" onClick={(e) => e.stopPropagation()}>
                <button className="ia-chip mono" onClick={() => setShowLog(true)}>Record</button>
                <button className="ia-chip mono" onClick={toggleSound}>Sound {sound ? "on" : "off"}</button>
                <FullscreenButton targetRef={frameRef} />
              </div>
            </>
          )}

          {/* ---------- the line ---------- */}
          {phase === "play" && line && (
            <div className="ia-textbox" onClick={(e) => { if (choosing || closing) e.stopPropagation(); }}>
              <div className="ia-textbox-inner">
                {speaker.label && (
                  <div className="mono ia-speaker" style={{ color: speaker.kind === "voice" ? "#E8CFC0" : speaker.kind === "mind" ? "#DCDFFF" : "#8B95F6" }}>
                    {speaker.label}
                  </div>
                )}
                <div className={`ia-line ia-line-${speaker.kind}`}>
                  {fullText.slice(0, typed)}
                  <span style={{ opacity: 0 }}>{fullText.slice(typed)}</span>
                </div>

                {choosing && (
                  <div className="ia-choices" role="group" aria-label="Choose">
                    {node.choices.map((c, i) => {
                      const ok = !c.requires || c.requires(flags);
                      return (
                        <button key={c.id} className={`ia-choice ${ok ? "" : "ia-choice-locked"}`} onClick={() => choose(c)} aria-disabled={!ok}>
                          <span className="mono ia-choice-tag" style={{ color: ok ? TAG_COLORS[c.tag] : "#565B8F", borderColor: ok ? TAG_COLORS[c.tag] : "#3A3E75" }}>
                            {i + 1} · {c.tag}
                          </span>
                          <span className="ia-choice-text">{c.text}</span>
                          {!ok && <span className="mono ia-choice-lock">{c.locked}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {closing && (
                  <button className="ia-btn ia-btn-primary" style={{ marginTop: 18 }} onClick={closeRecord}>Close the record &rarr;</button>
                )}

                {!choosing && !closing && (
                  <div className="mono ia-next" aria-hidden="true">{revealed ? "▾" : ""}</div>
                )}
              </div>
            </div>
          )}

          {/* ---------- the record so far ---------- */}
          {phase === "play" && showLog && (
            <div className="ia-log" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: "2px", color: "#8B95F6" }}>THE RECORD SO FAR</div>
                <button className="ia-chip mono" onClick={() => setShowLog(false)}>Close</button>
              </div>
              <div className="ia-log-scroll">
                {log.map((l, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    {l.who === "choice" ? (
                      <div className="mono" style={{ fontSize: 12, color: TAG_COLORS[l.tag] || "#B9C0FF" }}>▸ {l.tag}: {l.text}</div>
                    ) : l.who === "readout" ? (
                      <div className="mono" style={{ fontSize: 11, color: "#6E76B8" }}>{l.text}</div>
                    ) : (
                      <div style={{ fontSize: 14, color: SPEAKERS[l.who]?.kind === "narration" ? "#C9CCEB" : "#E8CFC0", fontStyle: SPEAKERS[l.who]?.kind === "narration" ? "normal" : "italic" }}>
                        {SPEAKERS[l.who]?.kind !== "narration" && <span className="mono" style={{ fontSize: 10, marginRight: 8, fontStyle: "normal" }}>{SPEAKERS[l.who]?.label}</span>}
                        {l.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------- record closed ---------- */}
          {phase === "ending" && ending && (
            <div className="ia-ending">
              <div className="ia-ending-inner">
                <div className="mono" style={{ fontSize: 11, letterSpacing: "2px", color: "#8B95F6" }}>
                  RECORD CLOSED · ASSIGNMENT {String(story.number).padStart(7, "0")}
                </div>
                <div className="mono" style={{ fontSize: 10.5, letterSpacing: "1.5px", color: ending.canon ? "#E8CFC0" : "#6E76B8", marginTop: 6 }}>
                  {ending.canon ? "CANON RECORD · THE STORY AS WRITTEN" : "DIVERGENT RECORD"}
                </div>
                <div className="wordmark" style={{ fontSize: "clamp(30px, 5vw, 46px)", color: "#DCDFFF", margin: "12px 0 6px" }}>{ending.title}</div>
                <p style={{ color: "#A9AEDB", fontStyle: "italic", margin: "0 0 20px" }}>{ending.summary}</p>

                <div className="ia-knowledge">
                  <div className="mono" style={{ fontSize: 10, letterSpacing: "2px", color: "#8B95F6", marginBottom: 8 }}>KNOWLEDGE GAINED</div>
                  <div className="mono" style={{ fontSize: 13, color: "#DCDFFF", lineHeight: 1.7 }}>{ending.knowledge}</div>
                </div>

                <div className="mono" style={{ fontSize: 10, letterSpacing: "2px", color: "#8B95F6", margin: "22px 0 10px" }}>
                  RECORDS FOUND · {found.size} OF {endingsList.length}
                </div>
                <div className="ia-records">
                  {endingsList.map(([id, e]) => {
                    const has = found.has(id);
                    return (
                      <div key={id} className={`ia-record ${has ? "ia-record-found" : ""} ${id === node.ending ? "ia-record-current" : ""}`}>
                        <div className="mono" style={{ fontSize: 9, color: has && e.canon ? "#E8CFC0" : "#565B8F", letterSpacing: "1px" }}>
                          {has ? (e.canon ? "CANON" : "DIVERGENT") : "UNFOUND"}
                        </div>
                        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 15, color: has ? "#DCDFFF" : "#3A3E75", marginTop: 4 }}>
                          {has ? e.title : "· · ·"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {stats && stats.total > 0 && (
                  <div style={{ marginTop: 22 }}>
                    <div className="mono" style={{ fontSize: 10, letterSpacing: "2px", color: "#8B95F6", marginBottom: 10 }}>
                      THE KIN · FIRST TIME THROUGH · {stats.total} {stats.total === 1 ? "RECORD" : "RECORDS"}
                    </div>
                    {endingsList.map(([id, e]) => {
                      const n = stats.endings[id] || 0;
                      const pct = Math.round((n / stats.total) * 100);
                      return (
                        <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <div style={{ width: 150, fontSize: 12, color: found.has(id) ? "#C9CCEB" : "#565B8F", fontStyle: "italic", flexShrink: 0 }}>
                            {found.has(id) ? e.title : "an unfound record"}
                          </div>
                          <div style={{ flex: 1, height: 6, background: "#14163A", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: id === node.ending ? "#E8CFC0" : "#8B95F6" }} />
                          </div>
                          <div className="mono" style={{ width: 38, fontSize: 11, color: "#8A8FBF", textAlign: "right" }}>{pct}%</div>
                        </div>
                      );
                    })}
                    {flags.climax && Object.keys(stats.climax).length > 0 && (() => {
                      const total = Object.values(stats.climax).reduce((a, b) => a + b, 0);
                      return (
                        <p style={{ fontSize: 13, color: "#8A8FBF", marginTop: 12 }}>
                          {story.climaxLabel || "At the turning point"}:{" "}
                          {Object.entries(story.climaxWords || {}).map(([k, words], i) => (
                            <span key={k}>
                              {i > 0 && " · "}
                              <span style={{ color: k === flags.climax ? "#E8CFC0" : "#B9C0FF" }}>{Math.round(((stats.climax[k] || 0) / total) * 100)}%</span> {words}
                            </span>
                          ))}
                        </p>
                      );
                    })()}
                  </div>
                )}
                {!signedIn && (
                  <p style={{ fontSize: 13, color: "#8A8FBF", marginTop: 16 }}>
                    <Link href="/login" style={{ color: "#B9C0FF" }}>Sign in</Link> and your records follow you, and count among the Kin.
                  </p>
                )}

                {path.length > 0 && (
                  <details style={{ marginTop: 18 }}>
                    <summary className="mono" style={{ fontSize: 10.5, letterSpacing: "1.5px", color: "#6E76B8", cursor: "pointer" }}>YOUR PATH · {path.length} {path.length === 1 ? "CHOICE" : "CHOICES"}</summary>
                    <ol style={{ margin: "10px 0 0", paddingLeft: 20 }}>
                      {path.map((p, i) => (
                        <li key={i} style={{ fontSize: 13, color: "#A9AEDB", marginBottom: 6 }}>
                          <span className="mono" style={{ fontSize: 10, color: TAG_COLORS[p.tag], marginRight: 6 }}>{p.tag}</span>{p.text}
                        </li>
                      ))}
                    </ol>
                  </details>
                )}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                  <button className="ia-btn ia-btn-primary" onClick={() => begin(false)}>Begin again</button>
                  <Link className="ia-btn" href={story.storyHref}>Read it as written</Link>
                  {story.gameHref && <Link className="ia-btn" href={story.gameHref}>Play {story.gameTitle}</Link>}
                </div>
              </div>
            </div>
          )}
        </div>
        {phase === "play" && (
          <div className="ia-progress" role="progressbar" aria-label="Progress through the record" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
            <div className="ia-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
