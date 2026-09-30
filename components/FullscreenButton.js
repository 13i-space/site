"use client";

import { useState, useEffect } from "react";

// Fullscreen for a game's container. Uses the browser's real fullscreen
// where it exists; where it doesn't (iPhone Safari only allows it for video),
// the container fills the browser window instead, with its own exit button.
// Styles for both states live in globals.css (.game-frame).
export default function FullscreenButton({ targetRef }) {
  const [isFull, setIsFull] = useState(false);
  const [pseudo, setPseudo] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFull(!!(document.fullscreenElement || document.webkitFullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // window-filling mode: apply the class, stop the page scrolling, ESC exits
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    el.classList.toggle("pseudo-fullscreen", pseudo);
    document.body.style.overflow = pseudo ? "hidden" : "";
    const onKey = (e) => { if (e.key === "Escape") setPseudo(false); };
    if (pseudo) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pseudo, targetRef]);

  const toggle = async () => {
    const el = targetRef.current;
    if (!el) return;
    if (pseudo) { setPseudo(false); return; }
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      return;
    }
    const request = el.requestFullscreen || el.webkitRequestFullscreen;
    if (request && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) {
      try {
        await request.call(el);
        return;
      } catch (e) {
        // refused - fall back to filling the window
      }
    }
    setPseudo(true);
  };

  const style = {
    background: "none",
    border: "1px solid #3A3E75",
    borderRadius: 4,
    color: "#B9C0FF",
    fontSize: 11,
    letterSpacing: "0.5px",
    padding: "5px 10px",
    cursor: "pointer",
  };

  return (
    <>
      <button onClick={toggle} className="mono" style={style}>
        {isFull || pseudo ? "Exit fullscreen" : "Fullscreen"}
      </button>
      {pseudo && (
        <button
          onClick={() => setPseudo(false)}
          className="mono"
          style={{ ...style, position: "fixed", top: 10, right: 10, zIndex: 1001, background: "rgba(10,11,28,0.9)" }}
        >
          Exit fullscreen
        </button>
      )}
    </>
  );
}
