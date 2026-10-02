"use client";

import { useRef } from "react";
import { listenToElement, primeAudio } from "../lib/lyraMusic";

// An <audio> player for narration (the book's chapters, the short stories).
// While it plays, Lyra listens along (lib/lyraMusic.js, "voice" mode): her
// ring and glow pulse with the narrator's voice. The files are on this site,
// so the browser can measure them; if Web Audio isn't available it is just
// an ordinary player.
export default function NarrationAudio({ src, label, style }) {
  const release = useRef(null);
  const let_go = () => { if (release.current) release.current(); release.current = null; };
  return (
    <audio
      controls
      preload="none"
      style={style}
      aria-label={label}
      onPointerDown={primeAudio}
      onPlaying={(e) => { let_go(); release.current = listenToElement(e.currentTarget, (r) => { release.current = r; }, "voice"); }}
      onPause={let_go}
      onEnded={let_go}
    >
      <source src={src} type="audio/mpeg" />
    </audio>
  );
}
