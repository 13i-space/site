"use client";

import { useEffect, useRef } from "react";
import { keyFor } from "../lib/alienTraits";
import { specimenTraits, drawSpecimen } from "../lib/specimen";

// A still of the coded specimen (lib/specimen.js), for a card with no
// portrait yet (Update 5.55). Drawn once, not animated, so a gallery of
// cards stays light.
export default function SpecimenStill({ answers }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = c.clientWidth || 200, H = c.clientHeight || 140;
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
    g.addColorStop(0, "#14163A"); g.addColorStop(1, "#05060f");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const tr = specimenTraits((id) => (answers || {})[keyFor(id)]);
    drawSpecimen(ctx, W / 2, H * 0.5, Math.min(W, H) * 0.9, 1.3, tr, { seed: 2 });
  }, [answers]);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} aria-hidden="true" />;
}
