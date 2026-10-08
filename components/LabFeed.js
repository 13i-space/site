"use client";

import { useEffect, useRef } from "react";
import { getLabMirror } from "../lib/labMirror";

// The card preview's portrait window while you're in the Alien Lab
// (Update 5.63): a live feed of the tank, so the card always shows what is
// actually growing - the embryo, the transformation, then the species.
export default function LabFeed() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const src = getLabMirror();
      if (!src) return;
      if (c.width !== src.width) { c.width = src.width; c.height = src.height; }
      ctx.drawImage(src, 0, 0);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} aria-hidden="true" />
      <span className="mono lab-feed-tag">&#9679; LIVE &middot; TANK XB-13</span>
    </div>
  );
}
