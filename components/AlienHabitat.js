"use client";

import { useEffect, useRef, useMemo } from "react";
import { keyFor } from "../lib/alienTraits";
import { specimenTraits, drawSpecimen } from "../lib/specimen";
import { creatureOnly, creatureAlone, portraitSrc } from "../lib/portraitArt";

// The fourth side of an Alien Lab card (Update 5.55): the species in its
// own world, animated, filling the whole card. A different view from the
// front: the portrait turned the other way, closer in, set into a habitat
// drawn from its answers - its sky (star type), its ground (terrain), and
// moving the way it moves (floating, swimming, flying, walking, rooted).
// With no portrait yet, the specimen drawn in code stands in.
// active=false stops the animation (the side isn't showing).

const SKIES = {
  yellow: ["#0e1a3a", "#3a5a8a", "#F2D9A0"],
  binary: ["#1a1030", "#6a3a5a", "#F6C890"],
  red: ["#14060c", "#5a1a1e", "#E06A50"],
  blue: ["#06102e", "#2a4aa0", "#B9D4FF"],
  dark: ["#020208", "#0a0c22", null],
};

export default function AlienHabitat({ species, active = true }) {
  const canvasRef = useRef(null);
  const tr = useMemo(() => specimenTraits((id) => (species?.answers || {})[keyFor(id)]), [species]);
  const portrait = species?.portrait_svg;
  // Update 5.63: the creature without the portrait's own dark backdrop, laid
  // over its world as it is. (It used to be screen-blended with the backdrop
  // still in it, which washed faint portraits out against a bright sky -
  // the Novaucians appeared for a moment, then vanished once the sky drew.)
  const imgSrc = useMemo(() => (portrait ? portraitSrc(creatureOnly(portrait)) : null), [portrait]);
  const solo = useMemo(() => !!creatureAlone(portrait), [portrait]); // just the creature: it can roam
  const seed = useMemo(() => { let h = 7; String(species?.id || species?.name || "x").split("").forEach((c) => { h = (h * 31 + c.charCodeAt(0)) >>> 0; }); return (h % 1000) / 100; }, [species]);

  useEffect(() => {
    if (!active) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const r0 = (n) => { const x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453; return x - Math.floor(x); };
    const motes = Array.from({ length: 60 }, (_, i) => ({ x: r0(i), y: r0(i + 99), s: 0.5 + r0(i + 7) * 1.5, p: r0(i + 3) * 6.28 }));
    const draw = (now) => {
      const t = reduced ? 1 : now / 1000;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = c.clientWidth, H = c.clientHeight;
      if (c.width !== Math.round(W * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const [top, bottom, sun] = SKIES[tr.sky] || SKIES.yellow;
      const ocean = tr.terrain === "ocean";
      const caves = tr.terrain === "caves";
      // sky (or deep water, or cave dark)
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, ocean ? "#03122a" : caves ? "#05040a" : top);
      g.addColorStop(1, ocean ? "#0a3a5a" : caves ? "#1a1420" : bottom);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // suns
      if (sun && !ocean && !caves) {
        const sx = W * 0.72 + Math.sin(t * 0.05) * W * 0.04, sy = H * 0.22;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, W * 0.35);
        sg.addColorStop(0, sun); sg.addColorStop(0.08, sun); sg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = 0.85; ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
        if (tr.sky === "binary") { ctx.fillStyle = "#FFF1D6"; ctx.beginPath(); ctx.arc(W * 0.28, H * 0.16, W * 0.025, 0, Math.PI * 2); ctx.fill(); }
      }
      if (tr.sky === "dark" || caves) {
        motes.forEach((m) => { ctx.globalAlpha = 0.3 + 0.6 * Math.abs(Math.sin(t * 0.8 + m.p)); ctx.fillStyle = caves ? "#8FE6FF" : "#B9C0FF"; ctx.beginPath(); ctx.arc(m.x * W, m.y * H * 0.7, m.s, 0, Math.PI * 2); ctx.fill(); });
        ctx.globalAlpha = 1;
      }
      // the ground
      const horizon = H * (ocean ? 0.2 : 0.7);
      if (ocean) {
        // light from above, caustics
        for (let i = 0; i < 5; i++) {
          const x = W * (0.1 + i * 0.22) + Math.sin(t * 0.3 + i) * W * 0.05;
          ctx.globalAlpha = 0.07 + 0.04 * Math.sin(t + i); ctx.fillStyle = "#B9F0FF";
          ctx.beginPath(); ctx.moveTo(x - W * 0.04, 0); ctx.lineTo(x + W * 0.04, 0); ctx.lineTo(x + W * 0.12, H); ctx.lineTo(x - W * 0.06, H); ctx.fill();
        }
        ctx.globalAlpha = 1;
        motes.forEach((m) => { const y = ((m.y - t * 0.03 * m.s) % 1 + 1) % 1; ctx.globalAlpha = 0.5; ctx.strokeStyle = "#B9F0FF"; ctx.beginPath(); ctx.arc(m.x * W + Math.sin(t + m.p) * 4, y * H, m.s * 1.4, 0, Math.PI * 2); ctx.stroke(); });
        ctx.globalAlpha = 1;
      } else if (caves) {
        ctx.fillStyle = "#0c0912";
        ctx.beginPath(); ctx.moveTo(0, 0);
        for (let i = 0; i <= 10; i++) ctx.lineTo((i / 10) * W, H * (0.08 + r0(i + 40) * 0.12));
        ctx.lineTo(W, 0); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, H);
        for (let i = 0; i <= 10; i++) ctx.lineTo((i / 10) * W, H * (0.8 - r0(i + 60) * 0.08));
        ctx.lineTo(W, H); ctx.fill();
      } else {
        const groundCol = { desert: ["#7a4a2a", "#2a160e"], ice: ["#cfe4ff", "#5a7aa0"], forest: ["#1e3a2a", "#08140e"] }[tr.terrain] || ["#5a4a3a", "#1a140e"];
        // far hills
        ctx.fillStyle = groundCol[1]; ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.moveTo(0, horizon);
        for (let i = 0; i <= 12; i++) ctx.lineTo((i / 12) * W, horizon - H * (0.04 + r0(i + 20) * 0.1));
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill(); ctx.globalAlpha = 1;
        const gg = ctx.createLinearGradient(0, horizon, 0, H);
        gg.addColorStop(0, groundCol[0]); gg.addColorStop(1, groundCol[1]);
        ctx.fillStyle = gg; ctx.fillRect(0, horizon, W, H - horizon);
        if (tr.terrain === "forest") {
          for (let i = 0; i < 7; i++) {
            const x = r0(i + 70) * W, h = H * (0.25 + r0(i + 80) * 0.35), sway = Math.sin(t * 0.8 + i) * 4;
            ctx.strokeStyle = "#2c5a3e"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, horizon + 10); ctx.quadraticCurveTo(x + sway, horizon - h * 0.5, x + sway * 2, horizon - h); ctx.stroke();
            ctx.fillStyle = "rgba(111,195,168,0.5)"; ctx.beginPath(); ctx.ellipse(x + sway * 2, horizon - h, W * 0.07, H * 0.03, 0, Math.PI, 0); ctx.fill();
          }
        }
        if (tr.terrain === "ice") motes.forEach((m) => { const y = ((m.y + t * 0.04 * m.s) % 1); ctx.globalAlpha = 0.8; ctx.fillStyle = "#fff"; ctx.fillRect(m.x * W + Math.sin(t + m.p) * 6, y * H, m.s, m.s); });
        if (tr.terrain === "desert") motes.slice(0, 30).forEach((m) => { const x = ((m.x + t * 0.05 * m.s) % 1); ctx.globalAlpha = 0.35; ctx.fillStyle = "#F6D9A8"; ctx.fillRect(x * W, horizon + m.y * (H - horizon), m.s * 2, 1); });
        ctx.globalAlpha = 1;
      }
      // no portrait: the specimen itself lives here
      if (!imgSrc) {
        const S = Math.min(W, H) * 0.6;
        const cy = tr.move === "fly" || tr.move === "float" ? H * 0.46 : ocean ? H * 0.5 : H * 0.6;
        drawSpecimen(ctx, W * 0.5, cy, S, t, tr, { seed, mirror: true });
      }
      // a soft vignette, like a lens
      const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
      v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active, tr, imgSrc, seed]);

  return (
    <div className="hab">
      <canvas ref={canvasRef} className="hab-canvas" />
      {imgSrc && <img src={imgSrc} alt="" className={`hab-portrait hab-${tr.move} ${solo ? "hab-solo" : ""}`} />}
    </div>
  );
}
