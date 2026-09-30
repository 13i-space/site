"use client";

import { useRef, useEffect } from "react";

// Look-lab preview 7: a black hole as the page's centerpiece - shadow as
// pupil, photon ring as iris, the disk as lids: the ring-eye mark, writ large.
//
// Layers, back to front:
//   1. starfield, gravitationally lensed around the hole (each star's
//      apparent position is bent outward, with a faint mirror image on
//      the opposite side - the stars slowly orbit so the bending is visible)
//   2. the far half of the accretion disk
//   3. the lensed image of the disk's far side, arched over and under the
//      shadow (the "halo" familiar from simulations)
//   4. the shadow itself, with a thin photon ring
//   5. the near half of the disk, crossing in front of the shadow
// The disk is brighter on its approaching side (Doppler beaming), and
// matter occasionally spirals in and disappears at the edge.

const INCLINATION = 0.18; // disk ellipse height/width - close to edge-on
const ROLL = -0.12; // slight tilt of the disk, in radians
const DISK_IN = 1.7; // disk inner/outer edge, in shadow radii
const DISK_OUT = 5.2;

// Shadow radius in px. app/preview7/page.js mirrors this in CSS
// (HOLE_R) to lay its content out below the hole - keep the two in sync.
function blackHoleRadius(w, h) {
  return Math.max(26, Math.min(w, h) * 0.12);
}

function diskColor(t) {
  // t: 0 at the inner edge (hottest) -> 1 at the outer edge
  if (t < 0.15) return [255, 244, 230];
  if (t < 0.45) return [242, 206, 170];
  if (t < 0.75) return [232, 170, 128];
  return [201, 123, 110];
}

export default function BlackHoleField({ originXPct = 0.5, originYPct = 0.36 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let w, h, dpr, cx, cy, R;
    let stars = [];
    let disk = [];
    let infall = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cx = w * originXPct;
      cy = h * originYPct;
      R = blackHoleRadius(w, h);

      const far = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));
      stars = Array.from({ length: Math.round((w * h) / 2600) }, () => ({
        r: R * 0.6 + Math.sqrt(Math.random()) * far,
        a: Math.random() * Math.PI * 2,
        size: Math.random() < 0.06 ? 1.6 : Math.random() * 0.9 + 0.4,
        tw: Math.random() * Math.PI * 2,
      }));

      disk = Array.from({ length: 3400 }, () => {
        const t = Math.pow(Math.random(), 1.6);
        return { t, a: Math.random() * Math.PI * 2, jitter: (Math.random() - 0.5) * 0.12 };
      });
      infall = [];
      if (reduceMotion) draw(0);
    };

    // Kepler-ish: inner matter orbits much faster than outer
    const diskRadius = (t) => R * (DISK_IN + t * (DISK_OUT - DISK_IN));
    const angularSpeed = (t) => 0.018 * Math.pow(DISK_IN / (DISK_IN + t * (DISK_OUT - DISK_IN)), 1.5);

    const diskPoint = (rad, a) => {
      const x = Math.cos(a) * rad;
      const y = Math.sin(a) * rad * INCLINATION;
      return [cx + x * Math.cos(ROLL) - y * Math.sin(ROLL), cy + x * Math.sin(ROLL) + y * Math.cos(ROLL)];
    };

    const drawDiskHalf = (front) => {
      // continuum glow: stacked elliptical arcs
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ROLL);
      for (let i = 0; i < 44; i++) {
        const t = i / 43;
        const rad = diskRadius(t);
        const [r, g, b] = diskColor(t);
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.065 * (1 - t) + 0.012})`;
        ctx.lineWidth = R * 0.16;
        ctx.beginPath();
        ctx.ellipse(0, 0, rad, rad * INCLINATION, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // orbiting matter
      disk.forEach((p) => {
        const s = Math.sin(p.a);
        if (front ? s < 0 : s >= 0) return;
        const rad = diskRadius(p.t) * (1 + p.jitter * 0.3);
        const [x, y] = diskPoint(rad, p.a);
        // approaching side (left, moving toward us) is beamed brighter
        const beam = 1 + 0.75 * -Math.cos(p.a);
        const [r, g, b] = diskColor(p.t);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, 0.14 * beam * (1.2 - p.t))})`;
        const size = 0.6 + (1 - p.t) * 0.9;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      });
    };

    const drawHalo = () => {
      // the far side of the disk, lensed up and over (and under) the shadow
      for (let i = 0; i < 30; i++) {
        const k = i / 29;
        const rx = R * (1.12 + k * 0.6);
        const ry = rx * 0.92;
        const [r, g, b] = diskColor(k * 0.8);
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.11 * (1 - k) + 0.008})`;
        ctx.lineWidth = R * 0.045;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ROLL);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, Math.PI * 1.04, Math.PI * 1.96); // top arch
        ctx.stroke();
        ctx.globalAlpha = 0.45;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * 0.97, ry * 0.9, 0, Math.PI * 0.08, Math.PI * 0.92); // fainter bottom arch
        ctx.stroke();
        ctx.restore();
      }
    };

    const draw = (time) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#020208";
      ctx.fillRect(0, 0, w, h);

      // 1. lensed starfield
      const thetaE = R * 2.3; // Einstein radius
      ctx.fillStyle = "#DCDFFF";
      stars.forEach((s) => {
        if (!reduceMotion) s.a += 0.00012 * (R * 8 / Math.max(s.r, R * 3)); // gentle orbit, faster near the hole
        const root = Math.sqrt(s.r * s.r + 4 * thetaE * thetaE);
        const rPrimary = (s.r + root) / 2;
        const rSecondary = (root - s.r) / 2; // mirror image, opposite side
        const twinkle = reduceMotion ? 1 : 0.75 + 0.25 * Math.sin(time * 0.002 + s.tw);
        const stretch = Math.min(3, rPrimary / s.r); // stars near the ring get smeared along it

        ctx.globalAlpha = 0.8 * twinkle;
        const px = cx + Math.cos(s.a) * rPrimary;
        const py = cy + Math.sin(s.a) * rPrimary;
        if (stretch > 1.25) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(s.a + Math.PI / 2);
          ctx.fillRect(-s.size * stretch, -s.size / 2, s.size * stretch * 2, s.size);
          ctx.restore();
        } else {
          ctx.fillRect(px - s.size / 2, py - s.size / 2, s.size, s.size);
        }

        if (rSecondary > R * 1.05) {
          ctx.globalAlpha = 0.5 * twinkle * Math.min(1, (thetaE / s.r) ** 2);
          ctx.fillRect(cx - Math.cos(s.a) * rSecondary, cy - Math.sin(s.a) * rSecondary, s.size * 0.8, s.size * 0.8);
        }
      });
      ctx.globalAlpha = 1;

      // 2-3. far half of the disk, then its lensed halo
      ctx.globalCompositeOperation = "lighter";
      if (!reduceMotion) disk.forEach((p) => { p.a += angularSpeed(p.t); });
      drawDiskHalf(false);
      drawHalo();

      // 4. the shadow and photon ring
      ctx.globalCompositeOperation = "source-over";
      const shadow = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.12);
      shadow.addColorStop(0, "#000");
      shadow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "lighter";
      const breathe = reduceMotion ? 1 : 0.85 + 0.15 * Math.sin(time * 0.0012);
      ctx.strokeStyle = `rgba(255,236,214,${0.75 * breathe})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.03, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(232,207,192,${0.18 * breathe})`;
      ctx.lineWidth = 5;
      ctx.stroke();

      // 5. near half of the disk
      drawDiskHalf(true);

      // matter spiraling in, now and then
      if (!reduceMotion) {
        if (Math.random() < 0.04) infall.push({ rad: diskRadius(Math.random() * 0.5), a: Math.random() * Math.PI * 2, life: 1 });
        infall = infall.filter((p) => p.rad > R * 1.05);
        infall.forEach((p) => {
          p.a += 0.05 * Math.pow((R * DISK_IN) / p.rad, 1.5);
          p.rad *= 0.992;
          const [x, y] = diskPoint(p.rad, p.a);
          ctx.fillStyle = `rgba(255,236,214,${Math.min(0.9, (p.rad - R) / R)})`;
          ctx.fillRect(x - 1, y - 1, 2, 2);
        });
      }
      ctx.globalCompositeOperation = "source-over";

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduceMotion) raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [originXPct, originYPct]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, display: "block" }}
    />
  );
}
