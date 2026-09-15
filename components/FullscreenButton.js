"use client";

import { useState, useEffect } from "react";

export default function FullscreenButton({ targetRef }) {
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = () => {
    if (!document.fullscreenElement) {
      targetRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <button
      onClick={toggle}
      className="mono"
      style={{
        background: "none",
        border: "1px solid #3A3E75",
        borderRadius: 4,
        color: "#B9C0FF",
        fontSize: 11,
        letterSpacing: "0.5px",
        padding: "5px 10px",
        cursor: "pointer",
      }}
    >
      {isFull ? "Exit fullscreen" : "Fullscreen"}
    </button>
  );
}
