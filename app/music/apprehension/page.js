"use client";

import { useRef, useState } from "react";
import Link from "next/link";

// APPREHENSION - the 13i music video (Update 5.80). Replaces the first,
// browser-drawn film (Update 5.55) with a real film: a short story told as a
// visual companion to Book One, Chapter 1, "Aiden - Apprehension". Cut on the
// track's measured 116 BPM grid: Aiden alone at NovaCore at 3:33 AM, the
// machines say everything is normal, he doesn't believe them, and a seventh
// segment appears in the user data: UNKNOWN.
// Version 1: interface shots final; character shots are stand-ins from the
// reference boards. The plan, shot list and how to re-render it live in
// video-src/apprehension (README.md).
// The video lives on 13i.space itself (public/video), like the songs.

const SRC = "/video/apprehension.mp4";
const POSTER = "/video/apprehension-poster.jpg";

export default function ApprehensionVideo() {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const [state, setState] = useState("ready"); // ready | playing | paused | ended
  const [note, setNote] = useState("");

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    if (state === "ended") v.currentTime = 0;
    v.play().then(() => setState("playing")).catch(() => setNote("Tap play again to start the video."));
  };
  const fullscreen = () => {
    const w = wrapRef.current;
    const v = videoRef.current;
    if (document.fullscreenElement) { document.exitFullscreen?.(); return; }
    if (w?.requestFullscreen) w.requestFullscreen();
    else if (v?.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iPhone
  };

  return (
    <div ref={wrapRef} className="av">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,500&family=JetBrains+Mono:wght@400&display=swap" />
      <video
        ref={videoRef}
        className="av-video"
        src={SRC}
        poster={POSTER}
        preload="metadata"
        playsInline
        controls={state !== "ready"}
        onPlay={() => setState("playing")}
        onPause={() => setState((s) => (s === "ended" ? s : "paused"))}
        onEnded={() => setState("ended")}
        onError={() => setNote("The video couldn't load just now. Try again in a moment.")}
      />
      {(state === "ready" || state === "ended") && (
        <div className="av-overlay">
          <div className="av-kicker">13i &middot; a music video</div>
          <h1 className="av-title">Apprehension</h1>
          <div className="av-sub">Signal 13i &middot; a companion to Chapter 1 &middot; best with the sound up, full screen</div>
          <button className="av-play" onClick={play}>{state === "ended" ? "▶ Watch again" : "▶ Play the video"}</button>
          <div className="av-links">
            <button onClick={fullscreen}>full screen</button>
            <a href={SRC} download="13i-Apprehension.mp4">save as a video file</a>
            <Link href="/book/chapter-1">read Chapter 1</Link>
            <Link href="/music">&larr; back to The Rave</Link>
          </div>
          {note && <div className="av-note">{note}</div>}
        </div>
      )}
      {(state === "playing" || state === "paused") && (
        <div className="av-bar">
          <button onClick={fullscreen}>full screen</button>
          <Link href="/music">&larr; The Rave</Link>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </div>
  );
}

const CSS = `
.av { position: fixed; inset: 0; background: #000; color: #EDEBFF; overflow: hidden; }
.av-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; background: #000; display: block; }
.av-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; text-align: center; padding: 20px;
  background: radial-gradient(circle, rgba(2,2,10,0.45), rgba(2,2,10,0.9)); }
.av-kicker { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 4px; color: #E9D29A; text-transform: uppercase; }
.av-title { font-family: 'Fraunces', Georgia, serif; font-style: italic; font-weight: 500; font-size: clamp(48px, 10vw, 110px); margin: 0; text-shadow: 0 0 50px rgba(232,167,90,0.35); }
.av-sub { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #9A9BB8; letter-spacing: 1px; }
.av-play { margin-top: 18px; font-family: 'JetBrains Mono', monospace; font-size: 14px; letter-spacing: 2px; padding: 14px 30px; border-radius: 999px; border: none; cursor: pointer;
  background: linear-gradient(135deg, #E9D29A, #E8A75A); color: #14163A; box-shadow: 0 0 40px rgba(233,210,154,0.3); }
.av-links { display: flex; gap: 18px; margin-top: 12px; flex-wrap: wrap; justify-content: center; }
.av-links button, .av-links a, .av-bar button, .av-bar a { background: none; border: none; color: #C9B98F; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1.5px; cursor: pointer; text-decoration: none; }
.av-note { margin-top: 10px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #C9B98F; max-width: 460px; line-height: 1.6; }
.av-bar { position: absolute; left: 16px; top: 14px; display: flex; gap: 16px; align-items: center; opacity: 0.3; transition: opacity 0.3s; }
.av-bar:hover { opacity: 1; }
`;
