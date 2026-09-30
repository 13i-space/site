"use client";

import { useRef, useEffect } from "react";

// Look-lab preview 8: the view from low orbit. A planet's curve fills the
// lower screen and its surface slowly turns beneath you - ochre deserts,
// dark basalt seas, pale salt flats, a rift system, drifting cloud, a
// day/night terminator and a thin atmosphere at the limb.
//
// How it stays fast: every screen pixel's latitude/longitude on the sphere
// is worked out once. Each frame only adds the orbit's longitude offset
// and looks up a pre-painted surface texture.

const TEX_W = 1024;
const TEX_H = 512;
// From low orbit only a small slice of the planet is visible, so the
// surface texture repeats around the globe to keep that slice detailed.
const REPEAT = 6;
const LAT_SPAN = 0.9; // radians of latitude the texture's height covers

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Value noise that wraps horizontally, so the planet has no seam
function makeNoise(rand, cellsX, cellsY) {
  const grid = Array.from({ length: (cellsY + 1) * cellsX }, rand);
  const at = (x, y) => grid[y * cellsX + (((x % cellsX) + cellsX) % cellsX)];
  const smooth = (t) => t * t * (3 - 2 * t);
  return (u, v) => {
    const x = u * cellsX, y = v * cellsY;
    const x0 = Math.floor(x), y0 = Math.min(cellsY - 1, Math.floor(y));
    const fx = smooth(x - x0), fy = smooth(y - y0);
    const a = at(x0, y0), b = at(x0 + 1, y0), c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
}

function fbm(layers, u, v) {
  let sum = 0, amp = 0.5, norm = 0;
  for (const n of layers) { sum += n(u, v) * amp; norm += amp; amp *= 0.5; }
  return sum / norm;
}

const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function paintSurface() {
  const rand = mulberry32(8413);
  const height = [4, 8, 16, 32, 64].map((c) => makeNoise(rand, c, Math.max(1, Math.ceil(c / 2))));
  const ridge = [6, 12, 24].map((c) => makeNoise(rand, c, Math.max(1, Math.ceil(c / 2))));
  const moist = [3, 6, 12].map((c) => makeNoise(rand, c, Math.max(1, Math.ceil(c / 2))));
  const cloudN = [5, 10, 20, 40].map((c) => makeNoise(rand, c, Math.max(1, Math.ceil(c / 2))));

  const surface = new Uint8ClampedArray(TEX_W * TEX_H * 3);
  const clouds = new Uint8ClampedArray(TEX_W * TEX_H);
  const deep = [20, 26, 52], shallow = [44, 60, 92], shore = [150, 128, 96];
  const ochre = [150, 108, 66], rust = [118, 66, 50], basalt = [52, 44, 50];
  const high = [196, 176, 150], salt = [214, 206, 188];

  for (let y = 0; y < TEX_H; y++) {
    const v = y / TEX_H;
    for (let x = 0; x < TEX_W; x++) {
      const u = x / TEX_W;
      const h = fbm(height, u, v);
      const r = 1 - Math.abs(fbm(ridge, u, v) * 2 - 1); // ridged: canyon lines
      const m = fbm(moist, u, v);
      let c;
      if (h < 0.46) c = mix(deep, shallow, Math.max(0, (h - 0.3) / 0.16));
      else if (h < 0.475) c = shore;
      else {
        const t = (h - 0.475) / 0.3;
        c = m > 0.55 ? mix(rust, basalt, Math.min(1, (m - 0.55) * 4)) : mix(ochre, rust, Math.min(1, t * 1.5));
        if (h > 0.66) c = mix(c, high, Math.min(1, (h - 0.66) * 6));
        if (m < 0.36 && h < 0.56) c = mix(c, salt, Math.min(1, (0.36 - m) * 8)); // salt flats
        if (r > 0.93) c = mix(c, [30, 22, 26], (r - 0.93) * 12); // the rift
      }
      const i = (y * TEX_W + x) * 3;
      surface[i] = c[0]; surface[i + 1] = c[1]; surface[i + 2] = c[2];
      const cl = fbm(cloudN, u, v);
      clouds[y * TEX_W + x] = Math.max(0, Math.min(255, (cl - 0.52) * 900));
    }
  }
  return { surface, clouds };
}

export default function OrbitField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { surface, clouds } = paintSurface();
    const buf = document.createElement("canvas");
    const bctx = buf.getContext("2d");
    let raf, img, W, H, bw, bh, idx, lat, lon0, shade, night, cx, cy, R, stars;
    let t0 = performance.now();

    const setup = () => {
      W = Math.max(1, window.innerWidth);
      H = Math.max(1, window.innerHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // the planet is drawn at reduced resolution and scaled up
      const scale = Math.min(1, 720 / W);
      bw = Math.max(1, Math.round(W * scale));
      bh = Math.max(1, Math.round(H * scale));
      buf.width = bw;
      buf.height = bh;
      img = bctx.createImageData(bw, bh);
      // a big sphere whose top edge sits across the screen: the horizon
      R = Math.max(bw, bh) * 1.35;
      cx = bw * 0.5;
      cy = bh * 0.42 + R;
      const L = [-0.8, -0.45, 0.3]; // a low sun from the left - night creeps in from the right
      const Ln = Math.hypot(...L);
      const pix = [], la = [], lo = [], sh = [], ni = [];
      for (let y = 0; y < bh; y++) {
        for (let x = 0; x < bw; x++) {
          const nx = (x - cx) / R, ny = (y - cy) / R;
          const d2 = nx * nx + ny * ny;
          if (d2 > 1) continue;
          const nz = Math.sqrt(1 - d2);
          // the planet turns about the screen's horizontal axis, so the ground
          // flows out from the horizon toward you
          pix.push(y * bw + x);
          la.push(Math.max(0, Math.min(TEX_H - 1, Math.floor((Math.asin(nx) / LAT_SPAN + 0.5) * (TEX_H - 1)))));
          lo.push(Math.atan2(-ny, nz));
          const lambert = (nx * L[0] + ny * L[1] + nz * L[2]) / Ln;
          const limb = Math.pow(nz, 0.35); // darker toward the horizon
          sh.push(Math.max(0, lambert) * 0.95 * limb + 0.03);
          ni.push(Math.max(0, Math.min(1, -lambert * 4))); // how far into night
        }
      }
      idx = Int32Array.from(pix);
      lat = Int32Array.from(la);
      lon0 = Float32Array.from(lo);
      shade = Float32Array.from(sh);
      night = Float32Array.from(ni);
      stars = Array.from({ length: Math.round((W * H) / 3500) }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.6, r: Math.random() * 1.1 + 0.2, a: Math.random() * 0.7 + 0.2 }));
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) data[i + 3] = 0;
    };

    const draw = (now) => {
      const t = reduceMotion ? 0 : (now - t0) / 1000;
      const turn = t * 0.012; // radians per second - one slow orbit
      const cloudTurn = t * 0.016;
      const data = img.data;
      const k = (TEX_W * REPEAT) / (Math.PI * 2);
      for (let n = 0; n < idx.length; n++) {
        const p = idx[n] * 4;
        const row = lat[n] * TEX_W;
        let u = ((lon0[n] + turn) * k) % TEX_W; if (u < 0) u += TEX_W;
        let uc = ((lon0[n] + cloudTurn) * k) % TEX_W; if (uc < 0) uc += TEX_W;
        const si = (row + (u | 0)) * 3;
        const c = clouds[row + (uc | 0)] / 255;
        const s = shade[n];
        let r = surface[si] * (1 - c) + 235 * c;
        let g = surface[si + 1] * (1 - c) + 232 * c;
        let b = surface[si + 2] * (1 - c) + 240 * c;
        const nt = night[n];
        data[p] = r * s + 4 * nt;
        data[p + 1] = g * s + 6 * nt;
        data[p + 2] = b * s + 16 * nt;
        data[p + 3] = 255;
      }
      bctx.putImageData(img, 0, 0);

      ctx.fillStyle = "#03040c";
      ctx.fillRect(0, 0, W, H);
      stars.forEach((s) => {
        ctx.fillStyle = `rgba(220,223,255,${s.a})`;
        ctx.fillRect(s.x, s.y, s.r, s.r);
      });
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(buf, 0, 0, W, H);

      // atmosphere: a thin lit band along the limb
      const sx = W / bw;
      const pcx = cx * sx, pcy = cy * sx, pR = R * sx;
      const glow = ctx.createRadialGradient(pcx, pcy, pR * 0.985, pcx, pcy, pR * 1.03);
      glow.addColorStop(0, "rgba(139,149,246,0)");
      glow.addColorStop(0.45, "rgba(150,170,255,0.55)");
      glow.addColorStop(0.62, "rgba(139,149,246,0.25)");
      glow.addColorStop(1, "rgba(139,149,246,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(pcx, pcy, pR * 1.03, 0, Math.PI * 2);
      ctx.fill();

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    setup();
    const onResize = () => { setup(); if (reduceMotion) draw(performance.now()); };
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, display: "block" }}
    />
  );
}
