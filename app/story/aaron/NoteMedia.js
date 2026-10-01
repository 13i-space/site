"use client";
import { useEffect, useMemo, useRef, useState } from "react";

// Plays Paul's note for Aaron; for Paul, also records or uploads it.
function pickType(kind) {
  const list = kind === "video"
    ? ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"]
    : ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  if (typeof MediaRecorder === "undefined") return "";
  return list.find((t) => MediaRecorder.isTypeSupported(t)) || "";
}
const extFor = (type) => (/mp4/.test(type) ? (type.startsWith("audio") ? "m4a" : "mp4") : /mpeg/.test(type) ? "mp3" : /quicktime/.test(type) ? "mov" : /ogg/.test(type) ? "ogg" : /wav/.test(type) ? "wav" : "webm");
const LIMIT = 120;

function Recorder({ onSaved }) {
  const [kind, setKind] = useState("video");
  const [phase, setPhase] = useState("idle"); // idle | live | recording | review | saving
  const [secs, setSecs] = useState(0);
  const [blob, setBlob] = useState(null);
  const [err, setErr] = useState("");
  const liveRef = useRef(null);
  const streamRef = useRef(null);
  const recRef = useRef(null);
  const timer = useRef(null);
  const reviewUrl = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);

  useEffect(() => () => { streamRef.current?.getTracks().forEach((t) => t.stop()); clearInterval(timer.current); }, []);

  async function openCamera() {
    setErr("");
    try {
      const s = await navigator.mediaDevices.getUserMedia(kind === "video" ? { video: { width: 1280, height: 720 }, audio: true } : { audio: true });
      streamRef.current = s;
      setPhase("live");
      setTimeout(() => { if (liveRef.current) { liveRef.current.srcObject = s; liveRef.current.play().catch(() => {}); } }, 0);
    } catch {
      setErr("The browser couldn't open your camera or microphone. Check permissions, or upload a file instead.");
    }
  }
  function start() {
    const type = pickType(kind);
    const rec = new MediaRecorder(streamRef.current, { ...(type ? { mimeType: type } : {}), videoBitsPerSecond: 1500000 });
    const chunks = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      setBlob(new Blob(chunks, { type: rec.mimeType || type || (kind === "video" ? "video/webm" : "audio/webm") }));
      streamRef.current?.getTracks().forEach((t) => t.stop());
      setPhase("review");
    };
    recRef.current = rec;
    rec.start(1000);
    setSecs(0);
    setPhase("recording");
    timer.current = setInterval(() => setSecs((n) => { if (n + 1 >= LIMIT) stop(); return n + 1; }), 1000);
  }
  function stop() { clearInterval(timer.current); if (recRef.current?.state === "recording") recRef.current.stop(); }
  function redo() { setBlob(null); setPhase("idle"); }

  async function save(file, k) {
    setPhase("saving");
    setErr("");
    try {
      const type = file.type || (k === "video" ? "video/webm" : "audio/webm");
      const sign = await fetch("/api/story/brief/note", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "sign", ext: extFor(type) }) }).then((r) => r.json());
      if (!sign.uploadUrl) throw new Error(sign.error || "Couldn't start the upload.");
      const form = new FormData();
      form.append("cacheControl", "3600");
      form.append("", file);
      const up = await fetch(sign.uploadUrl, { method: "PUT", body: form, headers: { "x-upsert": "true" } });
      if (!up.ok) throw new Error("The upload didn't go through.");
      const c = await fetch("/api/story/brief/note", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "commit", path: sign.path, kind: k, type }) }).then((r) => r.json());
      if (!c.ok) throw new Error(c.error || "Couldn't save the note.");
      onSaved();
    } catch (e) {
      setErr(e.message || "Something went wrong.");
      setPhase(blob ? "review" : "idle");
    }
  }

  function pickFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 45 * 1024 * 1024) { setErr("That file is over 45 MB. Try a shorter clip."); return; }
    save(f, f.type.startsWith("audio") ? "audio" : "video");
  }

  return (
    <div className="nm-rec">
      <div className="nm-rec-k">Only you see this, Paul: record a note for Aaron</div>
      {phase === "idle" && (
        <>
          <div className="nm-kinds" role="group" aria-label="Note type">
            {["video", "audio"].map((k) => <button key={k} type="button" className={kind === k ? "on" : ""} onClick={() => setKind(k)}>{k === "video" ? "Video" : "Voice only"}</button>)}
          </div>
          <div className="nm-row">
            <button type="button" className="sos-btn" onClick={openCamera}>{kind === "video" ? "Open camera" : "Open microphone"}</button>
            <label className="sos-btn ghost nm-file">Upload a file<input type="file" accept="video/*,audio/*" onChange={pickFile} /></label>
          </div>
          <small>Aim for about 60 seconds. Up to {LIMIT / 60} minutes.</small>
        </>
      )}
      {(phase === "live" || phase === "recording") && (
        <>
          {kind === "video" ? <video ref={liveRef} muted playsInline className="nm-video" /> : <div className="nm-mic"><span className={phase === "recording" ? "on" : ""} /></div>}
          <div className="nm-row">
            {phase === "live"
              ? <button type="button" className="sos-btn" onClick={start}>● Start recording</button>
              : <button type="button" className="sos-btn nm-stop" onClick={stop}>■ Stop · {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}</button>}
          </div>
        </>
      )}
      {(phase === "review" || phase === "saving") && blob && (
        <>
          {kind === "video" ? <video src={reviewUrl} controls playsInline className="nm-video" /> : <audio src={reviewUrl} controls className="nm-audio" />}
          <div className="nm-row">
            <button type="button" className="sos-btn" disabled={phase === "saving"} onClick={() => save(blob, kind)}>{phase === "saving" ? "Saving…" : "Use this note"}</button>
            <button type="button" className="sos-btn ghost" disabled={phase === "saving"} onClick={redo}>Record again</button>
          </div>
        </>
      )}
      {phase === "saving" && !blob && <p>Uploading…</p>}
      {err && <div className="sos-msg err">{err}</div>}
    </div>
  );
}

export default function NoteMedia({ note, isPaul }) {
  const [editing, setEditing] = useState(false);
  async function remove() {
    await fetch("/api/story/brief/note", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "remove" }) });
    window.location.reload();
  }
  if (!note && !isPaul) return null;
  return (
    <div className="nm">
      {note && !editing && (
        <figure className="nm-player">
          {note.kind === "audio" ? (
            <div className="nm-audio-card">
              <div className="nm-audio-mark" aria-hidden="true"><span /><span /><span /><span /><span /></div>
              <div><b>A voice note from Paul</b><audio src={note.src} controls preload="metadata" className="nm-audio" /></div>
            </div>
          ) : (
            <video src={note.src} controls playsInline preload="metadata" className="nm-video" />
          )}
          <figcaption>A note from Paul</figcaption>
        </figure>
      )}
      {isPaul && (note && !editing ? (
        <div className="nm-row nm-paul">
          <button type="button" className="sos-link-btn" onClick={() => setEditing(true)}>Replace the note</button>
          <button type="button" className="sos-link-btn" onClick={remove}>Remove it</button>
        </div>
      ) : (
        <Recorder onSaved={() => window.location.reload()} />
      ))}
    </div>
  );
}
