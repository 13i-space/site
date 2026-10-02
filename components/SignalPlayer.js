"use client";

import { useState, useEffect, useRef } from "react";
import { lyraLookAt } from "../lib/lyraMusic";
import { SIGNALS, signalSections, signalLength, playStorySignal, stopStorySignal, renderStorySignalWav } from "../lib/signals";

// Plays a story's signal (lib/signals.js) with its sections laid out as a
// timeline, and offers it as a WAV. Synthesized live in the browser.
export default function SignalPlayer({ number, compact = false }) {
  const signal = SIGNALS[number];
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [rendering, setRendering] = useState(false);
  const playingRef = useRef(false);
  playingRef.current = playing;
  useEffect(() => () => { if (playingRef.current) stopStorySignal(); }, []);
  const sectionRefs = useRef([]);
  const sections = signal ? signalSections(signal) : [];
  const current = sections.filter((s) => s.start <= pos).pop();
  const currentIndex = current ? sections.indexOf(current) : -1;
  // as each section begins, Lyra's eye goes to it on the timeline
  useEffect(() => {
    if (!playing || currentIndex < 0) return;
    const el = sectionRefs.current[currentIndex];
    if (!el) return;
    const r = el.getBoundingClientRect();
    lyraLookAt(r.left + r.width / 2, r.top + r.height / 2, 1800);
  }, [playing, currentIndex]);
  if (!signal) return null;

  const total = signalLength(signal);

  const toggle = () => {
    if (playing) { stopStorySignal(); return; }
    setPos(0);
    const ok = playStorySignal(signal, {
      onTick: (t) => setPos(t),
      onEnd: () => { setPlaying(false); setPos(0); },
    });
    setPlaying(!!ok);
  };

  const download = async () => {
    setRendering(true);
    try {
      const blob = await renderStorySignalWav(signal);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `13i-signal-${String(number).padStart(7, "0")}-${signal.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.wav`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {
      // rendering isn't available in this browser
    }
    setRendering(false);
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="panel" style={{ padding: compact ? 16 : 22 }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "2px", color: "#8B95F6" }}>THE SIGNAL</div>
      <div className="wordmark" style={{ fontSize: compact ? 20 : 24, color: "#DCDFFF", margin: "6px 0 2px" }}>{signal.title}</div>
      <div className="mono" style={{ fontSize: 11, color: "#6E76B8", marginBottom: 14 }}>{signal.subtitle}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={toggle} className="ia-btn ia-btn-primary" style={{ minWidth: 92 }} aria-label={playing ? "Stop the signal" : "Play the signal"}>
          {playing ? "■ Stop" : "▶ Play"}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ position: "relative", height: 26, display: "flex", gap: 2 }}>
            {sections.map((s, i) => {
              const done = Math.max(0, Math.min(1, (pos - s.start) / s.length));
              const isNow = playing && current === s;
              return (
                <div key={i} ref={(el) => { sectionRefs.current[i] = el; }} title={s.label || "silence"} style={{ flex: s.length, position: "relative", background: s.label ? "#14163A" : "transparent", border: s.label ? "1px solid #262A55" : "1px dashed #262A55", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, width: `${done * 100}%`, background: isNow ? "rgba(232,207,192,0.35)" : "rgba(139,149,246,0.3)" }} />
                </div>
              );
            })}
          </div>
          <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6E76B8", marginTop: 6 }}>
            <span style={{ color: playing ? "#E8CFC0" : "#6E76B8" }}>{playing ? (current?.label || "· · ·") : sections.map((s) => s.label).filter(Boolean).join(" → ")}</span>
            <span>{playing ? fmt(pos) : fmt(total)}</span>
          </div>
        </div>
      </div>

      <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", fontSize: 10.5, color: "#565B8F", marginTop: 14 }}>
        <span>synthesized live in your browser · headphones help</span>
        <button onClick={download} disabled={rendering} style={{ background: "none", border: "none", color: "#8B95F6", cursor: "pointer", font: "inherit", padding: 0 }}>
          {rendering ? "rendering…" : "download .wav ↓"}
        </button>
      </div>
    </div>
  );
}
