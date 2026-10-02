"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MOODS, SCALES, NOTE_NAMES, LAYERS, STEPS, BARS,
  generateSong, defaultSong, sanitizeSong,
  buildGraph, applyMix, startSustained, stopSustained, scheduleStep, renderWav,
} from "../lib/musicEngine";
import { hearAnalyser } from "../lib/lyraMusic";
import { lyraReact } from "../lib/lyraReact";

const LOOKAHEAD = 0.12; // seconds of audio scheduled ahead of the playhead
const LAYER_NAMES = { drone: "Drone", pad: "Pad", arp: "Arpeggio", bass: "Bass", drums: "Drums", texture: "Signal" };
const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii"];

function chordName(song, degree) {
  const scale = SCALES[song.scale];
  const note = (k) => song.root + scale[(degree + k) % scale.length] + 12 * Math.floor((degree + k) / scale.length);
  const third = note(2) - note(0), fifth = note(4) - note(0);
  const quality = third === 3 ? (fifth === 6 ? "dim" : "m") : "";
  return NOTE_NAMES[note(0) % 12] + quality;
}

export default function MusicLab({ loggedIn }) {
  const [song, setSong] = useState(defaultSong);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [prompt, setPrompt] = useState("");
  const [composing, setComposing] = useState(false);
  const [composeNote, setComposeNote] = useState("");
  const [exporting, setExporting] = useState(false);

  const songRef = useRef(song);
  const audio = useRef(null); // { ctx, graph, timer, next, stepIndex, queue }
  const canvasRef = useRef(null);
  songRef.current = song;

  const update = (patch) => setSong((s) => ({ ...s, ...patch }));

  // keep the live mix in step with the controls
  useEffect(() => {
    const a = audio.current;
    if (a && a.graph) applyMix(a.graph, song);
  }, [song]);

  // key or scale changes mid-play: retune the sustained drone
  useEffect(() => {
    const a = audio.current;
    if (!a || !playing) return;
    stopSustained(a.graph, a.ctx.currentTime + 0.05);
    startSustained(a.graph, songRef.current, a.ctx.currentTime + 0.05);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.root, song.scale]);

  const play = useCallback(() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    let a = audio.current;
    if (!a) {
      const ctx = new AC();
      a = audio.current = { ctx, graph: buildGraph(ctx), queue: [] };
    }
    a.ctx.resume();
    applyMix(a.graph, songRef.current);
    const t0 = a.ctx.currentTime + 0.08;
    startSustained(a.graph, songRef.current, t0);
    a.next = t0;
    a.stepIndex = 0;
    a.queue = [];
    a.timer = setInterval(() => {
      const s = songRef.current;
      const stepDur = 60 / s.tempo / 4;
      while (a.next < a.ctx.currentTime + LOOKAHEAD) {
        scheduleStep(a.graph, s, a.stepIndex, a.next);
        a.queue.push({ i: a.stepIndex, t: a.next });
        a.next += stepDur;
        a.stepIndex = (a.stepIndex + 1) % (STEPS * BARS);
      }
    }, 25);
    // Lyra hears it and dances (lib/lyraMusic.js)
    if (a.release) a.release();
    a.release = hearAnalyser(a.graph.analyser);
    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    clearInterval(a.timer);
    stopSustained(a.graph, a.ctx.currentTime + 0.05);
    if (a.release) { a.release(); a.release = null; }
    a.queue = [];
    setPlaying(false);
    setStep(-1);
  }, []);

  useEffect(() => () => {
    const a = audio.current;
    if (a) { clearInterval(a.timer); if (a.release) a.release(); a.ctx.close(); }
  }, []);

  // playhead + visualizer
  useEffect(() => {
    let raf;
    const canvas = canvasRef.current;
    const g = canvas.getContext("2d");
    const data = new Uint8Array(512);
    const draw = () => {
      const a = audio.current;
      const w = canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
      const h = canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
      g.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.3;
      // a ring that the waveform bends - the 13i eye, listening
      g.strokeStyle = "rgba(139,149,246,0.25)";
      g.lineWidth = 1;
      g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
      if (a && playing) {
        a.analyser = a.graph.analyser;
        a.analyser.getByteTimeDomainData(data);
        g.strokeStyle = "#B9C0FF";
        g.lineWidth = 1.6 * (window.devicePixelRatio || 1);
        g.beginPath();
        for (let i = 0; i <= data.length; i++) {
          const v = (data[i % data.length] - 128) / 128;
          const ang = (i / data.length) * Math.PI * 2 - Math.PI / 2;
          const r = R + v * R * 0.9;
          const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
          i ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.stroke();
        // playhead from the scheduled queue
        const now = a.ctx.currentTime;
        while (a.queue.length > 1 && a.queue[1].t <= now) a.queue.shift();
        if (a.queue.length && a.queue[0].t <= now) setStep(a.queue[0].i);
      }
      g.fillStyle = "#E8CFC0";
      g.beginPath(); g.arc(cx, cy, Math.max(3, R * 0.08), 0, Math.PI * 2); g.fill();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const generate = (mood = song.mood) => setSong(generateSong(mood));

  const compose = async () => {
    if (!prompt.trim()) return;
    setComposing(true);
    setComposeNote("");
    try {
      const res = await fetch("/api/music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim().slice(0, 400) }),
      });
      const text = await res.text();
      // newline-delimited JSON: pings, then {song} or {error}
      const last = text.trim().split("\n").map((l) => { try { return JSON.parse(l); } catch { return {}; } }).filter((m) => m.song || m.error).pop() || {};
      if (last.song) {
        setSong(sanitizeSong({ ...last.song, seed: Date.now() % 1e9 }));
        setComposeNote(last.note || "Composed. Press play.");
      } else {
        setComposeNote(last.error || "That didn't come through. Try again.");
      }
    } catch (e) {
      setComposeNote("That didn't come through. Try again.");
    }
    setComposing(false);
  };

  const download = async () => {
    setExporting(true);
    try {
      const blob = await renderWav(song, 2);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `13i-signal-${MOODS[song.mood]?.label.toLowerCase() || "loop"}-${NOTE_NAMES[song.root].replace("#", "s")}-${song.tempo}bpm.wav`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      setComposeNote("Couldn't render the file in this browser.");
    }
    setExporting(false);
  };

  const toggleCell = (row, i) => {
    if (row === "arp") {
      const arp = [...song.arp];
      arp[i] = arp[i] >= 3 ? -1 : arp[i] + 1; // rest -> 0 -> 1 -> 2 -> 3 -> rest
      update({ arp });
    } else {
      const next = [...song[row]];
      next[i] = !next[i];
      update({ [row]: next });
    }
  };

  const stepInBar = step >= 0 ? step % STEPS : -1;
  const barNow = step >= 0 ? Math.floor(step / STEPS) : -1;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* moods + generate */}
      <div className="panel">
        <div className="mono" style={styles.label}>MOOD</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(MOODS).map(([key, m]) => (
            <button key={key} onClick={() => { if (key !== song.mood) lyraReact("sway"); generate(key); }} style={{ ...styles.btn, ...(song.mood === key ? styles.btnOn : {}) }}>
              {m.label}
            </button>
          ))}
          <button onClick={() => generate()} style={{ ...styles.btn, marginLeft: "auto", border: "1px solid #6B5E3E", color: "#E8CFC0" }}>
            &#8635; Generate
          </button>
        </div>

        <div className="mono" style={{ ...styles.label, marginTop: 18 }}>OR DESCRIBE IT</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loggedIn && compose()}
            placeholder={loggedIn ? "e.g. drifting over a frozen ocean at night, slow and lonely" : "Sign in to compose from words"}
            disabled={!loggedIn || composing}
            style={styles.input}
          />
          <button onClick={compose} disabled={!loggedIn || composing || !prompt.trim()} style={styles.btn}>
            {composing ? "Composing..." : "Compose"}
          </button>
        </div>
        {composeNote && <p className="mono" style={{ fontSize: 11, color: "#8A8FBF", margin: "8px 0 0" }}>{composeNote}</p>}
      </div>

      {/* transport + visualizer */}
      <div className="panel" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, alignItems: "center" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: 220, display: "block" }} aria-label="Waveform" />
        <div style={{ display: "grid", gap: 14 }}>
          <button onClick={playing ? stop : play} style={{ ...styles.btn, fontSize: 15, padding: "12px 20px", ...(playing ? styles.btnOn : {}) }}>
            {playing ? "■ Stop" : "▶ Play"}
          </button>
          <label style={styles.row}>
            <span className="mono" style={styles.small}>TEMPO</span>
            <input type="range" min={50} max={160} value={song.tempo} onChange={(e) => update({ tempo: Number(e.target.value) })} style={{ flex: 1 }} />
            <span className="mono" style={styles.value}>{song.tempo} bpm</span>
          </label>
          <label style={styles.row}>
            <span className="mono" style={styles.small}>KEY</span>
            <select value={song.root} onChange={(e) => update({ root: Number(e.target.value) })} style={styles.select}>
              {NOTE_NAMES.map((n, i) => <option key={n} value={i}>{n}</option>)}
            </select>
            <select value={song.scale} onChange={(e) => update({ scale: e.target.value })} style={styles.select}>
              {Object.keys(SCALES).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <div style={styles.row}>
            <span className="mono" style={styles.small}>CHORDS</span>
            {song.progression.map((d, i) => (
              <button
                key={i}
                onClick={() => { const p = [...song.progression]; p[i] = (p[i] + 1) % 7; update({ progression: p }); }}
                title="Click to change this bar's chord"
                style={{ ...styles.chip, ...(barNow === i ? styles.btnOn : {}) }}
              >
                {chordName(song, d)}
                <span style={{ display: "block", fontSize: 9, color: "#565B8F" }}>{ROMAN[d]}</span>
              </button>
            ))}
          </div>
          <button onClick={download} disabled={exporting} style={styles.btn}>
            {exporting ? "Rendering..." : "⤓ Download WAV (8 bars)"}
          </button>
        </div>
      </div>

      {/* mixer */}
      <div className="panel">
        <div className="mono" style={styles.label}>LAYERS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {LAYERS.map((l) => {
            const v = song.layers[l];
            return (
              <div key={l} style={{ border: `1px solid ${v.on ? "#3A3E75" : "#21244A"}`, borderRadius: 4, padding: "10px 12px" }}>
                <button
                  onClick={() => { if (!v.on) lyraReact(l === "drums" ? "wow" : "notice"); update({ layers: { ...song.layers, [l]: { ...v, on: !v.on } } }); }}
                  className="mono"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: v.on ? "#B9C0FF" : "#565B8F", fontSize: 12 }}
                >
                  {v.on ? "●" : "○"} {LAYER_NAMES[l]}
                </button>
                <input
                  type="range" min={0} max={100} value={Math.round(v.vol * 100)}
                  onChange={(e) => update({ layers: { ...song.layers, [l]: { ...v, vol: Number(e.target.value) / 100 } } })}
                  style={{ width: "100%", marginTop: 8 }}
                  aria-label={`${LAYER_NAMES[l]} volume`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* step grid */}
      <div className="panel" style={{ overflowX: "auto" }}>
        <div className="mono" style={styles.label}>PATTERN &middot; CLICK TO EDIT (ARPEGGIO CELLS CYCLE THROUGH NOTES 1-4)</div>
        {[["arp", "Arpeggio"], ["bass", "Bass"], ["kick", "Kick"], ["snare", "Snare"], ["hat", "Hat"]].map(([row, name]) => (
          <div key={row} style={{ display: "grid", gridTemplateColumns: "72px repeat(16, minmax(20px, 1fr))", gap: 3, marginBottom: 4, minWidth: 460 }}>
            <span className="mono" style={{ fontSize: 10.5, color: "#6E76B8", alignSelf: "center" }}>{name}</span>
            {Array.from({ length: STEPS }, (_, i) => {
              const val = song[row][i];
              const on = row === "arp" ? val >= 0 : val;
              const current = i === stepInBar;
              return (
                <button
                  key={i}
                  onClick={() => toggleCell(row, i)}
                  aria-label={`${name} step ${i + 1}`}
                  style={{
                    height: 26,
                    border: `1px solid ${current ? "#E8CFC0" : i % 4 === 0 ? "#3A3E75" : "#262A55"}`,
                    borderRadius: 3,
                    background: on ? `rgba(139,149,246,${row === "arp" ? 0.3 + val * 0.2 : 0.75})` : "rgba(10,11,28,0.6)",
                    color: "#0A0B1C",
                    fontSize: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {row === "arp" && val >= 0 ? val + 1 : ""}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  label: { fontSize: 10, color: "#565B8F", letterSpacing: "1.5px", marginBottom: 10 },
  btn: {
    background: "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: "8px 14px", cursor: "pointer",
  },
  btnOn: { background: "rgba(139,149,246,0.15)", border: "1px solid #8B95F6", color: "#DCDFFF" },
  chip: {
    background: "none", border: "1px solid #262A55", borderRadius: 4, color: "#B9C0FF",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: "4px 8px", cursor: "pointer", minWidth: 46,
  },
  input: {
    flex: "1 1 260px", background: "transparent", border: "1px solid #262A55", borderRadius: 4,
    color: "#E4E4EF", fontSize: 14, padding: "9px 12px", outline: "none",
  },
  select: { background: "#0A0B1C", border: "1px solid #262A55", borderRadius: 4, color: "#B9C0FF", padding: "5px 8px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 },
  row: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  small: { fontSize: 10, color: "#6E76B8", letterSpacing: "1px", minWidth: 58 },
  value: { fontSize: 11, color: "#8A8FBF", minWidth: 60, textAlign: "right" },
};
