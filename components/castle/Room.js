"use client";
// The waiting room by the castle gate, and the little voice-chat panel.
import { useEffect, useRef, useState } from "react";
import { L, CrestCanvas } from "./Lobby";
import { drawKnightTop } from "./knight";
import { MIN_PLAYERS, MAX_PLAYERS } from "../../lib/castle/engine";

export function KnightBadge({ look, size = 34, dim = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, g = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = size * dpr; cv.height = size * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, size, size);
    g.translate(size / 2, size / 2 + 2);
    g.scale(size / 34, size / 34);
    drawKnightTop(g, look, { facing: Math.PI / 2, torch: false, t: 0 });
  }, [look, size]);
  return <canvas ref={ref} style={{ width: size, height: size, flexShrink: 0, opacity: dim ? 0.5 : 1 }} aria-hidden="true" />;
}

export function WaitingRoom({ code, people, me, isHost, settings, setSettings, start, leave, openPractice, voice, voiceState, notice }) {
  const [copied, setCopied] = useState(false);
  const host = people.find((p) => p.host);
  const n = Math.min(people.length, MAX_PLAYERS);
  const seats = Math.max(MIN_PLAYERS, n, settings.total || 0);
  const fill = seats - n;
  const link = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?room=${code}` : "";
  const copy = () => {
    try { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* no clipboard */ }
  };
  return (
    <div style={L.screen}>
      <div style={{ ...L.card, maxWidth: 900, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <CrestCanvas size={74} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="mono" style={L.kicker}>THE CASTLE GATE · WAITING FOR THE FAMILY</div>
            <div style={{ ...L.big, fontSize: 30, margin: "4px 0" }}>Murder in the Donaghy Castle</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="mono" style={L.kicker}>GAME CODE</div>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 40, letterSpacing: "8px", color: "#f2dc9a", fontWeight: 700 }}>{code}</div>
            <button style={{ ...L.chip, fontSize: 11 }} onClick={copy}>{copied ? "link copied" : "copy a link to send"}</button>
          </div>
        </div>
        {notice && <div style={{ ...L.mini, borderColor: "#c9a227", color: "#ffe2a8", marginTop: 12, fontSize: 14 }}>{notice}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)", gap: 22, marginTop: 16 }} className="castle-lobby-grid">
          <div>
            <div className="mono" style={{ ...L.kicker, color: "#f2dc9a" }}>AT THE GATE ({people.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {people.map((p, i) => {
                const v = voiceState?.peers?.[p.pid];
                const mine = p.pid === me.pid;
                const speaking = mine ? (voiceState?.micOn && voiceState.me > 0.04) : v && v.level > 0.04;
                return (
                  <div key={p.pid} style={{ ...L.mini, display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", opacity: i >= MAX_PLAYERS ? 0.5 : 1 }}>
                    <KnightBadge look={p.look} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "#f2e6c8", fontSize: 14 }}>{p.name}{mine ? " (you)" : ""}</div>
                      <div style={{ fontSize: 11.5, color: "#8d87ad" }}>
                        {p.host ? "opened the gate · hosts the game" : "ready"}{i >= MAX_PLAYERS ? " · castle full, watching" : ""}
                      </div>
                    </div>
                    {(mine ? voiceState?.on : v) && <span title={speaking ? "talking" : "in the voice chat"} style={{ fontSize: 15, filter: speaking ? "drop-shadow(0 0 6px #8ef0a8)" : "none", opacity: speaking ? 1 : 0.5 }}>🎙️</span>}
                  </div>
                );
              })}
              {fill > 0 && (
                <div style={{ ...L.mini, borderStyle: "dashed", fontSize: 13, color: "#a9a3c4" }}>
                  + {fill} castle folk (computer players) to make {seats}
                </div>
              )}
            </div>
            {!host && <div style={{ fontSize: 13, color: "#ff9a85", marginTop: 10 }}>The person who opened the gate isn&rsquo;t here. Ask them to open the game again, or open a new gate yourself.</div>}
          </div>

          <div>
            <VoicePanel voice={voice} state={voiceState} people={people} me={me} big />
            {isHost ? (
              <div style={{ marginTop: 16 }}>
                <div className="mono" style={{ ...L.kicker, color: "#f2dc9a" }}>YOU&rsquo;RE THE HOST</div>
                <label style={{ display: "block", marginTop: 8 }}>
                  <span className="mono" style={L.kicker}>PEOPLE IN THE CASTLE</span>
                  <select value={seats} onChange={(e) => setSettings({ ...settings, total: +e.target.value })} style={L.select}>
                    {Array.from({ length: MAX_PLAYERS - Math.max(MIN_PLAYERS, n) + 1 }, (_, i) => Math.max(MIN_PLAYERS, n) + i).map((k) => (
                      <option key={k} value={k}>{k}{k > n ? ` (${n} of you + ${k - n} castle folk)` : " (all family)"}</option>
                    ))}
                  </select>
                </label>
                <label style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 12, fontSize: 13, color: "#d7d1ef", cursor: "pointer" }}>
                  <input type="checkbox" checked={!!settings.meetingsOnly} onChange={(e) => setSettings({ ...settings, meetingsOnly: e.target.checked })} style={{ marginTop: 3 }} />
                  <span>Microphones only at meetings (like Among Us: no talking while you roam the castle)</span>
                </label>
                <p style={{ fontSize: 12.5, color: "#a9a3c4", lineHeight: 1.5 }}>
                  At least {MIN_PLAYERS} people are needed, so any empty seats are filled with castle folk. Keep this tab open: your laptop runs the castle for everyone.
                </p>
                <button style={L.btn} onClick={start}>
                  {fill > 0 ? `Fill ${fill} seat${fill === 1 ? "" : "s"} with castle folk and start` : "Start the night"}
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 16, fontSize: 14, color: "#d7d1ef" }}>
                Waiting for {host ? host.name : "the host"} to start the night{settings.total ? ` (${seats} in the castle)` : ""}.
                {settings.meetingsOnly && <div style={{ fontSize: 12.5, color: "#a9a3c4", marginTop: 6 }}>Microphones work only at meetings tonight.</div>}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
              <button style={L.ghostBtn} onClick={openPractice}>Practice joust while you wait</button>
              <button style={{ ...L.chip, background: "transparent" }} onClick={leave}>leave the gate</button>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 860px){.castle-lobby-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

// Talk to each other. Join once; then mic on/off, and mute anyone.
export function VoicePanel({ voice, state, people, me, big = false, allowedNote }) {
  const [open, setOpen] = useState(big);
  const [err, setErr] = useState(null);
  if (!voice) return null;
  const on = state?.on;
  const join = async () => {
    setErr(null);
    const ok = await voice.join();
    if (!ok) setErr("The browser didn't allow the microphone. Click the lock or camera icon in the address bar, allow the microphone, and try again.");
  };
  const others = people.filter((p) => p.pid !== me.pid && state?.peers?.[p.pid]);
  const box = big ? { ...L.mini } : { background: "rgba(10,9,22,0.85)", border: "1px solid #2e2850", borderRadius: 8, padding: "8px 10px", color: "#e7e1ff", fontSize: 12.5, maxWidth: 260 };
  return (
    <div style={box}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span className="mono" style={{ ...L.kicker, color: "#f2dc9a" }}>VOICE</span>
        {!on && <button style={{ ...L.chip, borderColor: "#c9a227", color: "#f2dc9a" }} onClick={join}>🎙️ Join the voice chat</button>}
        {on && (
          <>
            <button
              style={{ ...L.chip, borderColor: state.micOn ? "#8ef0a8" : "#5a1520", color: state.micOn ? "#bff5c9" : "#ff9a85", boxShadow: state.micOn && state.me > 0.04 ? "0 0 10px rgba(142,240,168,0.6)" : "none" }}
              onClick={() => voice.setMic(!state.micOn)}
              disabled={!state.allowed}
              title={state.allowed ? "Microphone on or off (V)" : "Microphones are off until the next meeting"}
            >
              {!state.allowed ? "🔇 mics off till the meeting" : state.micOn ? "🎙️ mic on" : "🔇 mic off"}
            </button>
            <button style={{ ...L.chip, fontSize: 11 }} onClick={() => setOpen(!open)}>{others.length} talking {open ? "▾" : "▸"}</button>
            <button style={{ ...L.chip, fontSize: 11, background: "transparent" }} onClick={() => voice.leave()}>leave voice</button>
          </>
        )}
      </div>
      {big && !on && <div style={{ fontSize: 12.5, color: "#a9a3c4", marginTop: 6, lineHeight: 1.5 }}>Use headphones if you can, so the game sounds and voices don&rsquo;t echo.</div>}
      {allowedNote && on && !state.allowed && <div style={{ fontSize: 11.5, color: "#a9a3c4", marginTop: 4 }}>{allowedNote}</div>}
      {err && <div style={{ fontSize: 12, color: "#ff9a85", marginTop: 6 }}>{err}</div>}
      {on && open && (
        <div style={{ marginTop: 6 }}>
          {others.length === 0 && <div style={{ fontSize: 12, color: "#8d87ad" }}>Nobody else has joined the voice chat yet.</div>}
          {others.map((p) => {
            const v = state.peers[p.pid];
            return (
              <div key={p.pid} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 12.5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: !v.connected ? "#5a5390" : v.level > 0.04 ? "#8ef0a8" : "#2e6a3c" }} />
                <span style={{ flex: 1, color: v.connected ? "#f2e6c8" : "#8d87ad" }}>{p.name}{v.connected ? "" : " (connecting...)"}</span>
                <button style={{ ...L.chip, fontSize: 10.5, padding: "2px 8px" }} onClick={() => voice.mute(p.pid, !v.muted)}>{v.muted ? "unmute" : "mute"}</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
