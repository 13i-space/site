"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DeckEngine } from "../lib/deck/engine";
import { generateTrack, mutatePart, sanitizeTrack, STYLES, NOTE_NAMES } from "../lib/deck/tracks";
import { SAMPLES } from "../lib/deck/sounds";
import { Knob, Fader, Crossfader, Meter, Jog } from "./deck/Controls";
import Stage from "./deck/Stage";
import Studio from "./deck/Studio";
import { hearAnalyser } from "../lib/lyraMusic";
import { lyraReact } from "../lib/lyraReact";

// ─────────────────────────────────────────────────────────────────────────
// Signal Composer v2: the Alien DJ Controller (Update 5.65).
// A two-deck controller in the spirit of a DDJ-FLX4, a small DAW (the
// Studio) and an alien crowd to play to. Everything is synthesized live
// (lib/deck/*). Pieces:
//   the floor   - components/deck/Stage.js: the crowd, lasers, the 13i eye
//   the decks   - jog, tempo, sync, play/cue, loops, 8 pads x 4 modes
//                 (HOT CUE, PAD FX, SAMPLER, ALIEN)
//   the mixer   - trim, 3-band EQ (full left kills), filter, faders,
//                 crossfader, master, BEAT FX, meters
//   the Studio  - components/deck/Studio.js
//   MC Ilu      - calls out what you do; the crowd's energy follows it
// Tracks are kept in this browser between visits (localStorage).
// ─────────────────────────────────────────────────────────────────────────

const COLOR = { A: "#6FC3A8", B: "#E88CBE" };
const STORE = "13i_deck_v2";
const PAD_MODES = ["HOT CUE", "PAD FX", "SAMPLER", "ALIEN"];
const PAD_FX = ["Echo ½", "Echo ¾", "Sweep ↓", "Sweep ↑", "Transmit", "Flanger", "Wash", "Gravity"];
const ROLLS = [[1, "ROLL ¼"], [2, "ROLL ½"], [4, "ROLL 1"], [8, "ROLL 2"]];
const ALIEN = ["Mutate", "Xeno tune", "Lift", "Half-time", "Hats ×2", "Drop", "Chant", "Summon"];
const MODE_COLOR = { "HOT CUE": "#8B95F6", "PAD FX": "#E9D29A", SAMPLER: "#E88CBE", ALIEN: "#6FC3A8" };
const BEAT_FX = [["echo", "Echo"], ["reverb", "Reverb"], ["flanger", "Flanger"], ["crush", "Transmit"], ["spiral", "Spiral"]];
const BEATS = [0.25, 0.5, 0.75, 1, 2];
const CROWD = ["the Holders", "the Velani", "the Deep Walkers", "the Nerathi", "the Returners"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const HYPE_WORDS = [[0.15, "waiting"], [0.35, "warming up"], [0.55, "dancing"], [0.75, "losing it"], [0.92, "ASCENDING"], [2, "FULL CONTINUANCE"]];

const MC = {
  play: () => "Signal's up. The floor is open.",
  transition: () => `Smooth transition! ${cap(pick(CROWD))} felt that one.`,
  drop: () => `DROP! ${cap(pick(CROWD))} are losing it.`,
  slam: () => "And back in! Gravity: defied.",
  build: () => "Here it comes... hold on to something.",
  chant: () => "Hands, tentacles, whatever you've got - UP!",
  summon: () => "Something just walked in from orbit.",
  xeno: () => "That's not a scale. That's a door.",
  scratch: () => pick(["Wiki-wiki-whatever. They love it.", "Scratching in thirteen dimensions.", "The Returners have never heard a record before. Now they have."]),
  mutate: () => "It evolved. Right there, on the deck.",
};
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function initialTracks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && saved.A && saved.B) return { A: sanitizeTrack(saved.A), B: sanitizeTrack(saved.B) };
  } catch (e) { /* none */ }
  return { A: generateTrack("house", 1317811), B: generateTrack("trance", 514229) };
}

export default function AlienDeck({ loggedIn }) {
  const engine = useMemo(() => new DeckEngine(), []);
  const [tracks, setTracks] = useState(null);
  const [ui, setUi] = useState({
    A: { playing: false, sync: false, pitch: 0, loop: null, mode: "HOT CUE", trim: 0, hi: 0, mid: 0, low: 0, filter: 0, fader: 0.85, half: false, doubleHats: false, lift: 0 },
    B: { playing: false, sync: true, pitch: 0, loop: null, mode: "HOT CUE", trim: 0, hi: 0, mid: 0, low: 0, filter: 0, fader: 0.85, half: false, doubleHats: false, lift: 0 },
  });
  const [xf, setXf] = useState(0.5);
  const [master, setMaster] = useState(0.85);
  const [fx, setFx] = useState({ effect: "echo", target: "M", beats: 0.75, level: 0.6, on: false });
  const [edit, setEdit] = useState("A");
  const [playStep, setPlayStep] = useState(-1);
  const [hype, setHype] = useState(0);
  const [mc, setMc] = useState({ line: "Welcome to the booth, DJ. Press play on deck A.", at: 0 });
  const [rec, setRec] = useState({ on: false, started: 0, url: null, ext: "webm" });
  const [recClock, setRecClock] = useState(0);
  const [bpms, setBpms] = useState({ A: 0, B: 0, master: 0 });
  const applied = useRef(false);
  const uiRef = useRef(ui); uiRef.current = ui;
  const mutateTurn = useRef({ A: 0, B: 0 });

  // tracks: from this browser, or two fresh ones
  useEffect(() => { const t = initialTracks(); setTracks(t); engine.load("A", t.A); engine.load("B", t.B); engine.decks.B.sync = true; }, [engine]);
  useEffect(() => { if (!tracks) return; try { localStorage.setItem(STORE, JSON.stringify(tracks)); } catch (e) { /* ignore */ } }, [tracks]);
  useEffect(() => () => engine.dispose(), [engine]);

  // the MC and Lyra listen to the engine
  useEffect(() => engine.on((type, data) => {
    if (type === "alien" && data.name === "Xeno tune") return;
    const fn = MC[type];
    if (fn && (type !== "play" || !engine.decks[data.id === "A" ? "B" : "A"].playing)) setMc({ line: fn(), at: Date.now() });
    if (type === "drop" || type === "transition") lyraReact("wow");
  }), [engine]);
  useEffect(() => { if (hype >= 0.92) setMc({ line: "Full Continuance! They're ascending!", at: Date.now() }); }, [hype >= 0.92]); // eslint-disable-line react-hooks/exhaustive-deps

  // apply every control the first time the sound starts
  const ensure = useCallback(() => {
    const ctx = engine.init();
    if (!ctx || applied.current) return !!ctx;
    applied.current = true;
    ["A", "B"].forEach((id) => { const u = uiRef.current[id]; engine.setTrim(id, u.trim); engine.setEq(id, "hi", u.hi); engine.setEq(id, "mid", u.mid); engine.setEq(id, "low", u.low); engine.setFilter(id, u.filter); engine.setFader(id, u.fader); });
    engine.setXfader(xf); engine.setMaster(master);
    if (!engine.lyraRelease) engine.lyraRelease = hearAnalyser(engine.analyser);
    return true;
  }, [engine, xf, master]);

  // poll the engine: playheads and tempos
  useEffect(() => {
    let raf, lastStep = -2, lastB = "";
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const d = engine.decks[edit];
      const s = d.playing ? engine.position(edit).pos % 64 : -1;
      if (s !== lastStep) { lastStep = s; setPlayStep(s); }
      const b = `${engine.decks.A.bpm.toFixed(1)}|${engine.decks.B.bpm.toFixed(1)}|${engine.masterBpm().toFixed(1)}`;
      if (b !== lastB) { lastB = b; setBpms({ A: engine.decks.A.bpm, B: engine.decks.B.bpm, master: engine.masterBpm() }); }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [engine, edit]);
  useEffect(() => { if (!rec.on) return; const id = setInterval(() => setRecClock(Date.now() - rec.started), 500); return () => clearInterval(id); }, [rec.on, rec.started]);

  const setDeck = (id, patch) => setUi((u) => ({ ...u, [id]: { ...u[id], ...patch } }));
  const changeTrack = (id, t) => { setTracks((all) => ({ ...all, [id]: t })); engine.setTrack(id, t); };
  const loadTrack = (id, t) => { const s = sanitizeTrack(t); setTracks((all) => ({ ...all, [id]: s })); engine.load(id, s); setDeck(id, { pitch: 0 }); };

  // ─── deck actions ───
  const play = (id) => { ensure(); engine.play(id); setDeck(id, { playing: engine.decks[id].playing }); };
  const cue = (id) => { engine.cue(id); setDeck(id, { playing: false, loop: null }); };
  const sync = (id) => { engine.toggleSync(id); setDeck(id, { sync: engine.decks[id].sync }); };
  const pitch = (id, v) => { engine.setPitch(id, v); setDeck(id, { pitch: v }); };
  const loop = (id, kind) => {
    const l = kind === "toggle" ? engine.loopToggle(id, 4) : engine.loopResize(id, kind);
    setDeck(id, { loop: l ? l.len : null });
  };
  const padDown = (id, i) => {
    ensure();
    const mode = uiRef.current[id].mode;
    if (mode === "HOT CUE") { if (i < 4) engine.jumpTo(id, i); else engine.rollOn(id, ROLLS[i - 4][0]); }
    if (mode === "PAD FX") engine.padFx(id, PAD_FX[i], true);
    if (mode === "SAMPLER") engine.sample(SAMPLES[i]);
    if (mode === "ALIEN") {
      const name = ALIEN[i], t = tracks[id];
      if (name === "Mutate") { const parts = ["bass", "lead", "hat", "perc"]; const p = parts[mutateTurn.current[id]++ % parts.length]; changeTrack(id, mutatePart(t, p)); setMc({ line: MC.mutate() + ` (${p})`, at: Date.now() }); engine.emit("fx", { target: id }); return; }
      if (name === "Xeno tune") { changeTrack(id, { ...t, tuning: t.tuning === "xeno" ? "earth" : "xeno" }); if (t.tuning !== "xeno") setMc({ line: MC.xeno(), at: Date.now() }); return; }
      if (name === "Drop" && !engine.decks[id].playing) { setMc({ line: "Press play first - a drop needs something to drop.", at: Date.now() }); return; }
      const st = engine.alien(id, name);
      setDeck(id, st);
    }
  };
  const padUp = (id, i) => {
    const mode = uiRef.current[id].mode;
    if (mode === "HOT CUE" && i >= 4) engine.rollOff(id);
    if (mode === "PAD FX") engine.padFx(id, PAD_FX[i], false);
  };
  const mix = (id, key, v) => {
    ensure(); setDeck(id, { [key]: v });
    if (key === "trim") engine.setTrim(id, v);
    else if (key === "filter") engine.setFilter(id, v);
    else if (key === "fader") engine.setFader(id, v);
    else engine.setEq(id, key, v);
  };
  const beatFx = (patch) => {
    const next = { ...fx, ...patch };
    if (fx.on && (patch.target || patch.effect)) engine.beatFxOff(fx.target);
    setFx(next);
    ensure();
    if (next.on) engine.beatFx(next.target, next.effect, next.level, next.beats);
    else engine.beatFxOff(next.target);
  };
  const toggleRec = async () => {
    if (!rec.on) {
      ensure();
      if (engine.recordStart()) { setRec({ on: true, started: Date.now(), url: null, ext: "webm" }); setMc({ line: "Recording. Make it count.", at: Date.now() }); }
      else setMc({ line: "This browser can't record. Chrome or Edge on a computer can.", at: Date.now() });
      return;
    }
    const blob = await engine.recordStop();
    if (blob) setRec({ on: false, started: 0, url: URL.createObjectURL(blob), ext: /mp4/.test(blob.type) ? "m4a" : /ogg/.test(blob.type) ? "ogg" : "webm" });
  };

  if (!tracks) return <div className="dk-loading mono">powering up the booth...</div>;
  const hypeWord = HYPE_WORDS.find(([v]) => hype < v)[1];
  const fmt = (ms) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}`;

  return (
    <div className="dk">
      {/* the floor */}
      <div className="dk-stage">
        <Stage engine={engine} onHype={setHype} />
        <div className="dk-topbar">
          <span className="dk-brand"><b>XENO-DJ</b> <span className="mono">FLX&middot;13</span></span>
          <span className="dk-master-bpm mono"><span>MASTER</span> {bpms.master ? bpms.master.toFixed(1) : "--"} <span>BPM</span></span>
          <span className="dk-hype"><span className="mono">CROWD</span><span className="dk-hype-bar"><i style={{ width: `${Math.round(hype * 100)}%` }} /></span><span className="mono dk-hype-word">{hypeWord}</span></span>
          <button className={`dk-rec ${rec.on ? "on" : ""}`} onClick={toggleRec} title="Record your set">{rec.on ? `■ ${fmt(recClock)}` : "● REC"}</button>
        </div>
        <div className="dk-mc" key={mc.at}><span className="mono">MC ILU</span> {mc.line}</div>
      </div>
      {rec.url && (
        <div className="dk-recorded">
          <span className="mono">YOUR SET</span>
          <audio src={rec.url} controls />
          <a href={rec.url} download={`13i-xeno-dj-set.${rec.ext}`} className="dk-btn">&#x2913; Download</a>
        </div>
      )}

      {/* the controller */}
      <div className="dk-body">
        <DeckPanel id="A" engine={engine} track={tracks.A} u={ui.A} bpm={bpms.A} play={play} cue={cue} sync={sync} pitch={pitch} loop={loop} setMode={(m) => setDeck("A", { mode: m })} padDown={padDown} padUp={padUp} onNew={() => loadTrack("A", generateTrack(tracks.A.style))} onEdit={() => setEdit("A")} />
        <div className="dk-mixer">
          <div className="dk-mixer-chs">
            {["A", "B"].map((id) => (
              <div key={id} className="dk-ch" style={{ "--c": COLOR[id] }}>
                <Knob label="TRIM" value={ui[id].trim} onChange={(v) => mix(id, "trim", v)} color="#c9ccdf" size={36} />
                <Knob label="HI" value={ui[id].hi} onChange={(v) => mix(id, "hi", v)} color={COLOR[id]} kill size={36} />
                <Knob label="MID" value={ui[id].mid} onChange={(v) => mix(id, "mid", v)} color={COLOR[id]} kill size={36} />
                <Knob label="LOW" value={ui[id].low} onChange={(v) => mix(id, "low", v)} color={COLOR[id]} kill size={36} />
                <Knob label="FILTER" value={ui[id].filter} onChange={(v) => mix(id, "filter", v)} color="#E9D29A" size={40} />
                <div className="dk-ch-fader">
                  <Meter read={() => engine.level(id)} segs={12} height={118} />
                  <Fader value={ui[id].fader} onChange={(v) => mix(id, "fader", v)} label={`CH ${id}`} height={118} color={COLOR[id]} />
                </div>
              </div>
            ))}
            <div className="dk-ch dk-ch-master">
              <Knob label="MASTER" value={master} min={0} max={1} def={0.85} onChange={(v) => { ensure(); setMaster(v); engine.setMaster(v); }} color="#F2F4FF" size={40} />
              <Meter read={() => engine.level("M")} segs={16} height={160} />
            </div>
          </div>
          <div className="dk-beatfx">
            <div className="mono dk-sec">BEAT FX</div>
            <div className="dk-fx-row">
              {BEAT_FX.map(([k, l]) => <button key={k} className={`dk-small ${fx.effect === k ? "on" : ""}`} onClick={() => beatFx({ effect: k })}>{l}</button>)}
            </div>
            <div className="dk-fx-row">
              <div className="dk-seg">{["A", "B", "M"].map((t) => <button key={t} className={fx.target === t ? "on" : ""} onClick={() => beatFx({ target: t })}>{t === "M" ? "MST" : t}</button>)}</div>
              <div className="dk-seg">
                <button onClick={() => beatFx({ beats: BEATS[Math.max(0, BEATS.indexOf(fx.beats) - 1)] })}>&lsaquo;</button>
                <span className="mono dk-beats">{fx.beats === 0.25 ? "¼" : fx.beats === 0.5 ? "½" : fx.beats === 0.75 ? "¾" : fx.beats}</span>
                <button onClick={() => beatFx({ beats: BEATS[Math.min(BEATS.length - 1, BEATS.indexOf(fx.beats) + 1)] })}>&rsaquo;</button>
              </div>
              <Knob label="LEVEL" value={fx.level} min={0} max={1} def={0.6} onChange={(v) => beatFx({ level: v })} color="#E9D29A" size={34} />
              <button className={`dk-fx-on ${fx.on ? "on" : ""}`} onClick={() => beatFx({ on: !fx.on })}>ON</button>
            </div>
          </div>
          <Crossfader value={xf} onChange={(v) => { ensure(); setXf(v); engine.setXfader(v); }} />
        </div>
        <DeckPanel id="B" engine={engine} track={tracks.B} u={ui.B} bpm={bpms.B} play={play} cue={cue} sync={sync} pitch={pitch} loop={loop} setMode={(m) => setDeck("B", { mode: m })} padDown={padDown} padUp={padUp} onNew={() => loadTrack("B", generateTrack(tracks.B.style))} onEdit={() => setEdit("B")} />
      </div>

      {/* the Studio */}
      <div className="dk-studio">
        <div className="dk-studio-head">
          <span className="mono dk-sec" style={{ margin: 0 }}>THE STUDIO</span>
          <div className="dk-seg dk-tabs">
            {["A", "B"].map((id) => <button key={id} className={edit === id ? "on" : ""} style={edit === id ? { borderColor: COLOR[id], color: COLOR[id] } : {}} onClick={() => setEdit(id)}>DECK {id} &middot; {tracks[id].name}</button>)}
          </div>
        </div>
        <Studio deckId={edit} track={tracks[edit]} onChange={(t) => changeTrack(edit, t)} onLoad={(t) => loadTrack(edit, t)} playStep={playStep} loggedIn={loggedIn} color={COLOR[edit]} />
      </div>
    </div>
  );
}

function DeckPanel({ id, engine, track, u, bpm, play, cue, sync, pitch, loop, setMode, padDown, padUp, onNew, onEdit }) {
  const c = COLOR[id];
  const isMaster = u.playing && engine.isMaster(id);
  const pads = u.mode === "HOT CUE" ? ["BAR 1", "BAR 2", "BAR 3", "BAR 4", ...ROLLS.map((r) => r[1])] : u.mode === "PAD FX" ? PAD_FX : u.mode === "SAMPLER" ? SAMPLES : ALIEN;
  const lit = (name) => (name === "Xeno tune" && track.tuning === "xeno") || (name === "Lift" && u.lift) || (name === "Half-time" && u.half) || (name === "Hats ×2" && u.doubleHats);
  const pct = (u.pitch * 8).toFixed(1);
  return (
    <div className={`dk-deck dk-deck-${id}`} style={{ "--c": c }}>
      <div className="dk-deck-head">
        <span className="dk-deck-letter">{id}</span>
        <div className="dk-deck-info">
          <div className="dk-track-name" title={track.name}>{track.name}</div>
          <div className="mono dk-track-meta">{STYLES[track.style]?.label} &middot; {track.tuning === "xeno" ? "13i tuning" : `${NOTE_NAMES[track.root]} ${track.scale}`}</div>
        </div>
        <div className="dk-deck-btns">
          <button className="dk-small" onClick={onNew} title="A new track in this style">&#x27F3; NEW</button>
          <button className="dk-small" onClick={() => { onEdit(); document.querySelector(".dk-studio")?.scrollIntoView({ behavior: "smooth" }); }} title="Edit it in the Studio">EDIT</button>
        </div>
      </div>
      <Overview id={id} engine={engine} track={track} color={c} />
      <div className="dk-deck-mid">
        <div className="dk-jog-wrap">
          <Jog id={id} engine={engine} color={c} label={id} />
          <div className="mono dk-bpm"><b>{bpm ? bpm.toFixed(1) : track.bpm.toFixed(1)}</b> BPM <span>{u.pitch >= 0 ? "+" : ""}{pct}%</span></div>
        </div>
        <div className="dk-tempo">
          <button className={`dk-sync ${u.sync ? "on" : ""}`} onClick={() => sync(id)}>SYNC</button>
          <span className={`mono dk-master-tag ${isMaster ? "on" : ""}`}>MASTER</span>
          <Fader value={(u.pitch + 1) / 2} onChange={(v) => pitch(id, v * 2 - 1)} label="TEMPO" height={150} color="#3a3f5c" center />
        </div>
      </div>
      <div className="dk-loop">
        <button className={`dk-small ${u.loop ? "on" : ""}`} onClick={() => loop(id, "toggle")}>{u.loop ? `LOOP ${u.loop / 4}` : "LOOP 4"}</button>
        <button className="dk-small" onClick={() => loop(id, 0.5)}>½</button>
        <button className="dk-small" onClick={() => loop(id, 2)}>×2</button>
      </div>
      <div className="dk-modes">
        {PAD_MODES.map((m) => <button key={m} className={`dk-mode ${u.mode === m ? "on" : ""}`} style={u.mode === m ? { borderColor: MODE_COLOR[m], color: MODE_COLOR[m] } : {}} onClick={() => setMode(m)}>{m}</button>)}
      </div>
      <div className="dk-pads">
        {pads.map((name, i) => (
          <button
            key={`${u.mode}-${i}`}
            className={`dk-pad ${lit(name) ? "lit" : ""}`}
            style={{ "--pc": MODE_COLOR[u.mode] }}
            onPointerDown={(e) => { e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* no pointer to capture */ } e.currentTarget.classList.add("down"); padDown(id, i); }}
            onPointerUp={(e) => { e.currentTarget.classList.remove("down"); padUp(id, i); }}
            onPointerCancel={(e) => { e.currentTarget.classList.remove("down"); padUp(id, i); }}
          >{name}</button>
        ))}
      </div>
      <div className="dk-transport">
        <button className="dk-round dk-cue" onClick={() => cue(id)}>CUE</button>
        <button className={`dk-round dk-play ${u.playing ? "on" : ""}`} onClick={() => play(id)} aria-label={u.playing ? `Pause deck ${id}` : `Play deck ${id}`}>{u.playing ? "❚❚" : "▶"}</button>
      </div>
    </div>
  );
}

// a strip across the deck: the four bars, what's in them, where we are
function Overview({ id, engine, track, color }) {
  const ref = useRef(null);
  const trRef = useRef(track); trRef.current = track;
  useEffect(() => {
    const c = ref.current, g = c.getContext("2d");
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const dpr = Math.min(2, window.devicePixelRatio || 1), W = c.clientWidth, H = c.clientHeight;
      if (!W) return;
      if (c.width !== Math.round(W * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const P = trRef.current.parts, cw = W / 64;
      for (let s = 0; s < 64; s++) {
        let e = 0;
        if (P.kick.steps[s] && !P.kick.mute) e += 0.45; if (P.snare.steps[s] && !P.snare.mute) e += 0.25; if (P.hat.steps[s] && !P.hat.mute) e += 0.1;
        if (P.bass.notes[s] && !P.bass.mute) e += 0.25; if (P.lead.notes[s] && !P.lead.mute) e += 0.15;
        const h = Math.max(2, Math.min(1, e) * (H - 4));
        g.fillStyle = color; g.globalAlpha = 0.25 + Math.min(1, e) * 0.6;
        g.fillRect(s * cw + 0.5, (H - h) / 2, Math.max(1, cw - 1), h);
      }
      g.globalAlpha = 1;
      g.fillStyle = "rgba(255,255,255,0.15)"; [16, 32, 48].forEach((s) => g.fillRect(s * cw, 0, 1, H));
      const d = engine.decks[id];
      if (d.loop) { g.fillStyle = "rgba(233,210,154,0.18)"; g.fillRect(d.loop.start * cw, 0, d.loop.len * cw, H); g.strokeStyle = "#E9D29A"; g.strokeRect(d.loop.start * cw, 0.5, d.loop.len * cw, H - 1); }
      const { pos, frac } = engine.position(id);
      g.fillStyle = "#F2F4FF"; g.fillRect((((pos % 64) + frac) * cw), 0, 2, H);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [engine, id, color]);
  return <canvas ref={ref} className="dk-overview" aria-hidden="true" />;
}
