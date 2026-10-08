"use client";

import { useEffect, useState } from "react";
import { STYLES, SCALES, NOTE_NAMES, generateTrack, speciesTrack, fromComposerSong, noteName, chordName } from "../../lib/deck/tracks";
import { DRUM_SOUNDS, SYNTH_SOUNDS } from "../../lib/deck/sounds";
import { renderTrackWav } from "../../lib/deck/engine";
import { ARCHIVE_SPECIES } from "../../lib/archiveSpecies";
import { createClient } from "../../lib/supabaseBrowser";

// Signal Composer v2 (Update 5.65): the Studio - the DAW half. Edit the
// track on either deck while it plays: new tracks by style, a species from
// Aliens of the Galaxy as a track, or describe one in words (13i composes
// it, /api/music); key, scale, Earth or 13i tuning, tempo, swing, chords;
// a step grid for the drums and piano rolls for bass and lead, bar by bar;
// sounds, levels and mutes per part; and a WAV of the loop.

const DRUMS = [["kick", "Kick"], ["snare", "Snare"], ["hat", "Hat"], ["perc", "Perc"]];
const ROLLS = [["bass", "Bass", -7, 6], ["lead", "Lead", 7, 20]];
const DEFAULT_LEN = { Sub: 2, Wobble: 4, Reese: 4, Bell: 2, Flute: 2 };

export default function Studio({ deckId, track, onChange, onLoad, playStep, loggedIn, color }) {
  const [bar, setBar] = useState(0);
  const [species, setSpecies] = useState(() => Object.values(ARCHIVE_SPECIES).map((s) => ({ ...s, archive: true })));
  const [prompt, setPrompt] = useState("");
  const [composing, setComposing] = useState(false);
  const [note, setNote] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("alien_species").select("id,name,answers,created_at").order("created_at", { ascending: false }).limit(60);
        if (data && data.length) setSpecies((s) => [...data, ...s.filter((x) => x.archive)]);
      } catch (e) { /* the archive species are still there */ }
    })();
  }, []);

  if (!track) return null;
  const P = track.parts;
  const set = (patch) => onChange({ ...track, ...patch });
  const setPart = (part, patch) => onChange({ ...track, parts: { ...P, [part]: { ...P[part], ...patch } } });
  const o = bar * 16;
  const cur = playStep >= 0 && Math.floor(playStep / 16) === bar ? playStep % 16 : -1;

  const toggleDrum = (part, s) => {
    const steps = [...P[part].steps];
    if (part === "hat") steps[o + s] = (steps[o + s] + 1) % 3; else steps[o + s] = !steps[o + s];
    setPart(part, { steps });
  };
  const toggleNote = (part, s, d) => {
    const notes = [...P[part].notes];
    // a note that started earlier and covers this step: clicking it removes it
    let start = -1;
    for (let k = o + s; k >= o && k >= o + s - 16; k--) { const n = notes[k]; if (n && k + n.len > o + s && (k === o + s || n.d === d)) { start = k; break; } }
    if (start >= 0 && notes[start].d === d) notes[start] = null;
    else notes[o + s] = { d, len: DEFAULT_LEN[P[part].sound] || 1 };
    setPart(part, { notes });
  };
  const copyBar = () => {
    const parts = { ...P };
    ["kick", "snare", "hat", "perc", "signal"].forEach((k) => { const st = [...P[k].steps]; for (let b = 0; b < 4; b++) if (b !== bar) for (let s = 0; s < 16; s++) st[b * 16 + s] = P[k].steps[o + s]; parts[k] = { ...P[k], steps: st }; });
    ["bass", "lead"].forEach((k) => { const nt = [...P[k].notes]; for (let b = 0; b < 4; b++) if (b !== bar) for (let s = 0; s < 16; s++) { const n = P[k].notes[o + s]; nt[b * 16 + s] = n ? { ...n, d: n.d - track.prog[bar] + track.prog[b] } : null; } parts[k] = { ...P[k], notes: nt }; });
    onChange({ ...track, parts });
  };
  const clearBar = () => {
    const parts = { ...P };
    ["kick", "snare", "perc", "signal"].forEach((k) => { const st = [...P[k].steps]; for (let s = 0; s < 16; s++) st[o + s] = false; parts[k] = { ...P[k], steps: st }; });
    { const st = [...P.hat.steps]; for (let s = 0; s < 16; s++) st[o + s] = 0; parts.hat = { ...P.hat, steps: st }; }
    ["bass", "lead"].forEach((k) => { const nt = [...P[k].notes]; for (let s = 0; s < 16; s++) nt[o + s] = null; parts[k] = { ...P[k], notes: nt }; });
    onChange({ ...track, parts });
  };

  const compose = async () => {
    if (!prompt.trim()) return;
    setComposing(true); setNote("13i is composing...");
    try {
      const res = await fetch("/api/music", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: prompt.trim().slice(0, 400) }) });
      const text = await res.text();
      const last = text.trim().split("\n").map((l) => { try { return JSON.parse(l); } catch { return {}; } }).filter((m) => m.song || m.error).pop() || {};
      if (last.song) { onLoad(fromComposerSong(last.song, last.note)); setNote(last.note || "Composed - it's on the deck."); }
      else setNote(last.error || "That didn't come through. Try again.");
    } catch (e) { setNote("That didn't come through. Try again."); }
    setComposing(false);
  };
  const exportWav = async () => {
    setExporting(true);
    try {
      const blob = await renderTrackWav(track);
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `13i-${track.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${track.bpm}bpm.wav`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    } catch (e) { setNote("This browser couldn't render the file."); }
    setExporting(false);
  };

  const cell = (on, isCur, s, extra = {}) => ({ className: `ds-cell ${on ? "on" : ""} ${isCur ? "cur" : ""} ${s % 4 === 0 ? "beat" : ""}`, style: on ? { background: color, ...extra } : extra });

  return (
    <div className="ds" style={{ "--deck": color }}>
      {/* where tracks come from */}
      <div className="ds-row ds-sources">
        <div>
          <div className="ds-label">NEW TRACK &middot; PICK A STYLE</div>
          <div className="ds-chips">
            {Object.entries(STYLES).map(([k, s]) => (
              <button key={k} className={`ds-chip ${track.style === k ? "on" : ""}`} onClick={() => onLoad(generateTrack(k))}>{s.label}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="ds-label">A SPECIES AS A TRACK</div>
          <select className="ds-select" value="" onChange={(e) => { const sp = species.find((x) => String(x.id) === e.target.value); if (sp) onLoad(speciesTrack(sp)); }}>
            <option value="">Load a species from Aliens of the Galaxy...</option>
            {species.map((sp) => <option key={sp.id} value={sp.id}>{sp.name}{sp.archive ? " (Archive)" : ""}</option>)}
          </select>
        </div>
        <div style={{ flex: "1 1 260px" }}>
          <div className="ds-label">OR DESCRIBE IT &middot; 13i COMPOSES</div>
          <div style={{ display: "flex", gap: 6 }}>
            <input className="ds-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loggedIn && compose()} disabled={!loggedIn || composing} placeholder={loggedIn ? "e.g. a sunrise over the glass sea, building to a big drop" : "Sign in to compose from words"} />
            <button className="ds-btn" onClick={compose} disabled={!loggedIn || composing || !prompt.trim()}>{composing ? "..." : "Compose"}</button>
          </div>
        </div>
      </div>
      {note && <div className="ds-note mono">{note}</div>}

      {/* the track */}
      <div className="ds-row ds-settings">
        <input className="ds-name" value={track.name} onChange={(e) => set({ name: e.target.value.slice(0, 48) })} aria-label="Track name" />
        <label className="ds-field"><span>KEY</span>
          <select className="ds-select" value={track.root} onChange={(e) => set({ root: Number(e.target.value) })}>{NOTE_NAMES.map((n, i) => <option key={n} value={i}>{n}</option>)}</select>
        </label>
        <label className="ds-field"><span>SCALE</span>
          <select className="ds-select" value={track.scale} onChange={(e) => set({ scale: e.target.value })} disabled={track.tuning === "xeno"}>{Object.keys(SCALES).map((s) => <option key={s} value={s}>{s}</option>)}</select>
        </label>
        <div className="ds-field"><span>TUNING</span>
          <div className="ds-seg">
            <button className={track.tuning === "earth" ? "on" : ""} onClick={() => set({ tuning: "earth" })}>Earth</button>
            <button className={track.tuning === "xeno" ? "on" : ""} onClick={() => set({ tuning: "xeno" })} title="13 steps to the tritave (Bohlen-Pierce) - 13i's own">13i</button>
          </div>
        </div>
        <label className="ds-field"><span>BPM</span>
          <input type="number" min={60} max={180} className="ds-select" style={{ width: 64 }} value={track.bpm} onChange={(e) => set({ bpm: Math.max(60, Math.min(180, Number(e.target.value) || 120)) })} />
        </label>
        <label className="ds-field"><span>SWING</span>
          <input type="range" min={0} max={0.5} step={0.01} value={track.swing} onChange={(e) => set({ swing: Number(e.target.value) })} />
        </label>
        <button className="ds-btn" onClick={exportWav} disabled={exporting}>{exporting ? "Rendering..." : "⤓ WAV loop"}</button>
      </div>

      {/* chords + bars */}
      <div className="ds-row ds-bars">
        <div className="ds-label" style={{ margin: 0 }}>CHORDS</div>
        {track.prog.map((d, b) => (
          <button key={b} className={`ds-chord ${b === bar ? "on" : ""} ${playStep >= 0 && Math.floor(playStep / 16) === b ? "live" : ""}`} onClick={() => { if (b === bar) { const p = [...track.prog]; p[b] = (p[b] + 1) % 7; set({ prog: p }); } else setBar(b); }} title={b === bar ? "Click again to change this bar's chord" : `Edit bar ${b + 1}`}>
            <span className="mono">BAR {b + 1}</span><b>{chordName(track, b)}</b>
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button className="ds-btn" onClick={copyBar}>Copy bar {bar + 1} to all</button>
        <button className="ds-btn" onClick={clearBar}>Clear bar</button>
      </div>

      {/* drums */}
      <div className="ds-lanes">
        {DRUMS.map(([k, label]) => (
          <div key={k} className="ds-lane">
            <PartHead label={label} part={P[k]} sounds={DRUM_SOUNDS[k]} onPart={(patch) => setPart(k, patch)} />
            <div className="ds-grid">
              {Array.from({ length: 16 }, (_, s) => {
                const v = P[k].steps[o + s];
                return <button key={s} {...cell(!!v, s === cur, s, k === "hat" && v === 2 ? { boxShadow: "inset 0 0 0 3px #0a0b1c" } : {})} aria-label={`${label} step ${s + 1}`} onClick={() => toggleDrum(k, s)} title={k === "hat" ? "closed / open / off" : ""} />;
              })}
            </div>
          </div>
        ))}
        <div className="ds-lane">
          <PartHead label="Signal" part={P.signal} onPart={(patch) => setPart("signal", patch)} />
          <div className="ds-grid">
            {Array.from({ length: 16 }, (_, s) => <button key={s} {...cell(P.signal.steps[o + s], s === cur, s)} aria-label={`Signal step ${s + 1}`} onClick={() => { const st = [...P.signal.steps]; st[o + s] = !st[o + s]; setPart("signal", { steps: st }); }} />)}
          </div>
        </div>
      </div>

      {/* piano rolls */}
      <div className="ds-rolls">
        {ROLLS.map(([k, label, lo, hi]) => (
          <div key={k} className="ds-roll">
            <PartHead label={label} part={P[k]} sounds={SYNTH_SOUNDS[k]} onPart={(patch) => setPart(k, patch)} tone />
            <div className="ds-roll-grid">
              {Array.from({ length: hi - lo + 1 }, (_, r) => hi - r).map((d) => (
                <div key={d} className="ds-roll-row">
                  <span className={`ds-roll-key ${((d % 7) + 7) % 7 === 0 && track.tuning === "earth" ? "root" : ""}`}>{noteName(track, d)}</span>
                  {Array.from({ length: 16 }, (_, s) => {
                    const n = P[k].notes[o + s];
                    const shown = n && Math.max(lo, Math.min(hi, n.d)) === d;
                    let tail = false;
                    if (!shown) for (let b = 1; b < 16 && s - b >= 0; b++) { const m = P[k].notes[o + s - b]; if (m) { tail = m.len > b && Math.max(lo, Math.min(hi, m.d)) === d; break; } }
                    return <button key={s} className={`ds-rcell ${shown ? "on" : ""} ${tail ? "tail" : ""} ${s === cur ? "cur" : ""} ${s % 4 === 0 ? "beat" : ""}`} aria-label={`${label} ${noteName(track, d)} step ${s + 1}`} onClick={() => toggleNote(k, s, d)} />;
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="ds-lane" style={{ marginTop: 10 }}>
        <PartHead label="Pad" part={P.pad} sounds={SYNTH_SOUNDS.pad} onPart={(patch) => setPart("pad", patch)} />
        <div className="mono ds-hint">plays each bar&rsquo;s chord &middot; change chords above</div>
      </div>
      <div className="mono ds-hint" style={{ marginTop: 10 }}>Deck {deckId} &middot; edits play live &middot; hats: click once closed, twice open</div>
    </div>
  );
}

function PartHead({ label, part, sounds, onPart, tone }) {
  return (
    <div className="ds-head">
      <button className={`ds-mute ${part.mute ? "on" : ""}`} onClick={() => onPart({ mute: !part.mute })} title={part.mute ? "Unmute" : "Mute"}>{part.mute ? "M" : "●"}</button>
      <span className="ds-head-label">{label}</span>
      {sounds && <select className="ds-select ds-sound" value={part.sound} onChange={(e) => onPart({ sound: e.target.value })} aria-label={`${label} sound`}>{sounds.map((s) => <option key={s}>{s}</option>)}</select>}
      <input type="range" min={0} max={1} step={0.01} value={part.vol} onChange={(e) => onPart({ vol: Number(e.target.value) })} aria-label={`${label} level`} className="ds-vol" />
      {tone && <input type="range" min={0} max={1} step={0.01} value={part.cutoff} onChange={(e) => onPart({ cutoff: Number(e.target.value) })} aria-label={`${label} tone`} className="ds-vol ds-tone" title="Tone" />}
    </div>
  );
}
