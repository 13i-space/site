"use client";

import { useEffect, useRef } from "react";

// THE BLACK HOLE drawing kit (Update 5.74): the small pieces every issue's
// pictures share - a canvas that redraws each frame, glows, labels, the
// starfield, a slider, and two colour helpers (light of a wavelength, glow
// of a temperature). Issue pictures live in components/blackhole/issueNN.js
// and are registered in VISUALS in components/BlackHoleDive.js.

export const C = { bg: "#05060f", grid: "#3A3E75", lav: "#B9C0FF", gold: "#E9D29A", rose: "#C97B6E", warm: "#E8CFC0", text: "#DCDFFF", dim: "#6E76B8", teal: "#6FC3A8" };

// a canvas that redraws every frame: draw(ctx, W, H, t, dt)
export function useCanvas(draw) {
  const ref = useRef(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let raf = 0, last = performance.now(), dpr = 1;
    const loop = (now) => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = c.clientWidth, H = c.clientHeight;
      if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      try { drawRef.current(ctx, W, H, now / 1000, dt); } catch (e) { /* keep going */ }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return ref;
}

export const glow = (ctx, x, y, r, color, a = 1) => {
  if (!(r > 0)) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = Math.max(0, Math.min(1, a)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1;
};

// text shrinks itself (down to 7px) to fit the room it has on a phone
export const label = (ctx, s, x, y, { size = 12, color = C.dim, align = "center", font = "JetBrains Mono" } = {}) => {
  const W = ctx.canvas.clientWidth || 9999;
  const room = (align === "center" ? 2 * Math.min(x, W - x) : align === "left" ? W - x : x) - 6;
  ctx.font = `${size}px "${font}", monospace`;
  const w = ctx.measureText(s).width;
  if (w > room && room > 0) ctx.font = `${Math.max(7, (size * room) / w)}px "${font}", monospace`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(s, x, y);
};

// a font size that fits small screens: about W/denom, clamped
export const fit = (W, denom, lo = 9, hi = 12) => Math.max(lo, Math.min(hi, W / denom));

const stars = (() => { let s = 7; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647); return Array.from({ length: 140 }, () => ({ x: r(), y: r(), s: r() * 1.3 + 0.2, p: r() * 6.28 })); })();
export const starfield = (ctx, W, H, t, a = 0.6) => {
  ctx.fillStyle = "#EDEBFF";
  stars.forEach((s) => { ctx.globalAlpha = a * (0.3 + 0.7 * Math.abs(Math.sin(t * 0.5 + s.p))); ctx.fillRect(s.x * W, s.y * H, s.s, s.s); });
  ctx.globalAlpha = 1;
};
export const bg = (ctx, W, H) => { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); };

// a seeded random, so a picture looks the same every visit
export const seeded = (seed = 1) => { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };

// pointer position inside the element, 0..1 each way
export const rel = (e) => { const r = e.currentTarget.getBoundingClientRect(); return [Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))]; };

export function Slider({ label: l, min, max, step, value, onChange, show }) {
  return (
    <label className="bh-slider">
      <span className="mono">{l}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      {show && <span className="mono bh-slider-val">{show}</span>}
    </label>
  );
}

// the colour of light of one wavelength (nm), as [r, g, b] 0..255 (Bruton's
// approximation; dims toward the edges of what eyes can see)
export function nmRGB(nm) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else if (nm <= 780) { r = 1; }
  let f = 0;
  if (nm >= 380 && nm < 420) f = 0.3 + (0.7 * (nm - 380)) / 40;
  else if (nm >= 420 && nm <= 700) f = 1;
  else if (nm > 700 && nm <= 780) f = 0.3 + (0.7 * (780 - nm)) / 80;
  const k = (v) => Math.round(255 * Math.pow(Math.max(0, v) * f, 0.8));
  return [k(r), k(g), k(b)];
}
export const nmCSS = (nm, a = 1) => { const [r, g, b] = nmRGB(nm); return `rgba(${r},${g},${b},${a})`; };

// the colour a glowing body of this temperature (kelvin) looks, [r, g, b]
// (Helland's fit to blackbody colours, good from about 1,000 to 40,000 K)
export function kelvinRGB(K) {
  const t = Math.max(1000, Math.min(40000, K)) / 100;
  let r, g, b;
  if (t <= 66) { r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; }
  else { r = 329.698727446 * Math.pow(t - 60, -0.1332047592); g = 288.1221695283 * Math.pow(t - 60, -0.0755148492); }
  if (t >= 66) b = 255; else if (t <= 19) b = 0; else b = 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  const c = (v) => Math.round(Math.max(0, Math.min(255, v)));
  return [c(r), c(g), c(b)];
}
export const kelvinCSS = (K, a = 1) => { const [r, g, b] = kelvinRGB(K); return `rgba(${r},${g},${b},${a})`; };
