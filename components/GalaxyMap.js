"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabaseBrowser";
import { LANDMARKS, STORY_WORLDS } from "../lib/galaxyWorlds";

// A canvas-drawn 3D model of the galaxy: a barred spiral with four major
// arms, the Orion Spur (Earth's arm), a glowing bulge, star-forming knots,
// and the worlds of the Assignments the visitor has read.
//
// Map units: center (0, 0), disk edge at radius 1. See lib/galaxyWorlds.js.

const PITCH = Math.tan((12 * Math.PI) / 180); // log-spiral tightness
const ARM_START_R = 0.15;
const ARMS = [
  { name: "Perseus Arm", phase: -1.814, stars: 3600, major: true },
  { name: "Sagittarius–Carina Arm", phase: -0.243, stars: 2200 },
  { name: "Scutum–Centaurus Arm", phase: 1.328, stars: 3600, major: true },
  { name: "Norma Arm", phase: 2.899, stars: 2200 },
];
const SUN = LANDMARKS.find((l) => l.id === "earth");
const SUN_ANGLE = Math.atan2(SUN.y, SUN.x);
const SUN_R = Math.hypot(SUN.x, SUN.y);

const COLORS = ["#B9C0FF", "#DCDFFF", "#E8CFC0", "#F2B8C6"]; // blue-white, white, warm, pink (star-forming)
const ALPHAS = [0.28, 0.5, 0.8];

const DEFAULT_VIEW = { yaw: 0, tilt: 0.8, zoom: 1, panX: 0, panY: 0 };
const MIN_ZOOM = 0.6;
const CAMERA = 3.2; // viewing distance, in map units - lower = stronger perspective
const MAX_ZOOM = 7;

// Small seeded random generator, so the galaxy is the same shape every visit.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGalaxy() {
  const rand = mulberry32(1317811);
  const gauss = () => {
    const u = rand() || 1e-9;
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  };
  const xs = [], ys = [], zs = [], sizes = [], buckets = {};
  const add = (x, y, z, color, alphaLevel, size) => {
    const i = xs.length;
    xs.push(x); ys.push(y); zs.push(z); sizes.push(size);
    const key = color * ALPHAS.length + alphaLevel;
    (buckets[key] = buckets[key] || []).push(i);
  };
  const pick = (weights) => {
    let r = rand(), i = 0;
    while (i < weights.length - 1 && r > weights[i]) { r -= weights[i]; i++; }
    return i;
  };

  // Faint disk: an exponential falloff of old stars
  for (let i = 0; i < 3000; i++) {
    const r = Math.min(1.05, -0.3 * Math.log(1 - rand() * 0.96));
    const a = rand() * Math.PI * 2;
    add(r * Math.cos(a), r * Math.sin(a), gauss() * 0.018, pick([0.55, 0.3, 0.15]), 0, 0.5 + rand() * 0.4);
  }

  // Central bar + bulge: warm, dense, a little thicker
  const barAngle = ARMS[0].phase;
  for (let i = 0; i < 1500; i++) {
    const along = gauss() * 0.08;
    const across = gauss() * 0.03;
    const x = along * Math.cos(barAngle) - across * Math.sin(barAngle);
    const y = along * Math.sin(barAngle) + across * Math.cos(barAngle);
    add(x, y, gauss() * 0.03, pick([0.1, 0.25, 0.65]), pick([0.5, 0.35, 0.15]), 0.6 + rand() * 0.6);
  }

  // Spiral arms: log spirals from the bar's ends outward
  const maxTheta = Math.log(1 / ARM_START_R) / PITCH;
  ARMS.forEach((arm) => {
    for (let i = 0; i < arm.stars; i++) {
      const t = Math.pow(rand(), 0.8) * maxTheta;
      const r = ARM_START_R * Math.exp(PITCH * t);
      const a = arm.phase + t;
      const spread = 0.01 + r * 0.02;
      const x = r * Math.cos(a) + gauss() * spread;
      const y = r * Math.sin(a) + gauss() * spread;
      const young = rand() < 0.05;
      add(x, y, gauss() * 0.012, young ? 3 : pick([0.6, 0.3, 0.1]), young ? 1 : pick([0.35, 0.4, 0.25]), young ? 1.4 : 0.55 + rand() * 0.75);
    }
  });

  // The Orion Spur: a short minor arm through Earth's position
  for (let i = 0; i < 500; i++) {
    const t = (rand() - 0.55) * 1.3;
    const r = SUN_R * Math.exp(PITCH * t);
    const a = SUN_ANGLE + t;
    add(r * Math.cos(a) + gauss() * 0.012, r * Math.sin(a) + gauss() * 0.012, gauss() * 0.01, pick([0.6, 0.35, 0.05]), pick([0.4, 0.4, 0.2]), 0.55 + rand() * 0.6);
  }

  // Star-forming knots: soft pink glows scattered along the arms
  const knots = [];
  ARMS.forEach((arm) => {
    for (let i = 0; i < (arm.major ? 22 : 12); i++) {
      const t = (0.15 + rand() * 0.85) * maxTheta;
      const r = ARM_START_R * Math.exp(PITCH * t);
      const a = arm.phase + t;
      knots.push({ x: r * Math.cos(a) + gauss() * 0.015, y: r * Math.sin(a) + gauss() * 0.015, size: 0.006 + rand() * 0.012 });
    }
  });

  // Where to write each arm's name: partway out along it
  const armLabels = ARMS.map((arm) => {
    const t = maxTheta * 0.93;
    const r = ARM_START_R * Math.exp(PITCH * t);
    return { name: arm.name, x: r * Math.cos(arm.phase + t), y: r * Math.sin(arm.phase + t) };
  });

  return {
    xs: Float32Array.from(xs), ys: Float32Array.from(ys), zs: Float32Array.from(zs),
    sizes: Float32Array.from(sizes),
    buckets: Object.entries(buckets).map(([key, idx]) => ({
      color: COLORS[Math.floor(key / ALPHAS.length)],
      alpha: ALPHAS[key % ALPHAS.length],
      idx: Uint32Array.from(idx),
    })),
    knots,
    armLabels,
  };
}

export default function GalaxyMap() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const view = useRef({ ...DEFAULT_VIEW });
  const target = useRef(null); // when set, the view eases toward it
  const markersOnScreen = useRef([]);
  const selectedRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [readNumbers, setReadNumbers] = useState(null); // null = still checking / signed out
  const [signedIn, setSignedIn] = useState(false);

  const galaxy = useMemo(() => buildGalaxy(), []);

  const unlockedWorlds = useMemo(
    () => STORY_WORLDS.filter((w) => readNumbers && readNumbers.includes(w.assignment)),
    [readNumbers]
  );
  const markers = useMemo(() => [...LANDMARKS, ...unlockedWorlds], [unlockedWorlds]);
  const markersRef = useRef(markers);
  markersRef.current = markers;
  selectedRef.current = selected;

  // Which Assignments has this visitor read? (RLS limits this to their own rows)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;
        setSignedIn(true);
        const { data } = await supabase.from("reading_progress").select("assignment_number").eq("user_id", user.id);
        if (!cancelled) setReadNumbers((data || []).map((r) => r.assignment_number));
      } catch (e) {
        // map still works without it - just no Assignment worlds
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Draw loop + interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let w = 0, h = 0, dpr = 1;
    let lastInteraction = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = wrap.clientWidth;
      h = Math.max(380, Math.min(window.innerHeight * 0.72, w * 0.78));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const project = (x, y, z, v, scale, cosY, sinY, cosT, sinT) => {
      const px = x - v.panX, py = y - v.panY;
      const x1 = px * cosY - py * sinY;
      const y1 = px * sinY + py * cosY;
      const vert = y1 * cosT + z * sinT;
      const depth = z * cosT - y1 * sinT;
      const p = CAMERA / (CAMERA - depth);
      return [w / 2 + x1 * scale * p, h / 2 - vert * scale * p, p];
    };

    const draw = (time) => {
      const v = view.current;

      // ease toward a target view (reset / focus on a world)
      if (target.current) {
        const t = target.current;
        let done = true;
        ["yaw", "tilt", "zoom", "panX", "panY"].forEach((k) => {
          if (t[k] === undefined) return;
          const d = t[k] - v[k];
          if (Math.abs(d) > 0.0005) { v[k] += d * 0.12; done = false; } else v[k] = t[k];
        });
        if (done) target.current = null;
      } else if (!reduceMotion && time - lastInteraction > 2500) {
        v.yaw += 0.0007; // slow drift while nobody's touching it
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#05060f";
      ctx.fillRect(0, 0, w, h);

      const scale = Math.min(w, h) * 0.5 * v.zoom;
      const cosY = Math.cos(v.yaw), sinY = Math.sin(v.yaw);
      const cosT = Math.cos(v.tilt), sinT = Math.sin(v.tilt);
      // stars grow a little as you zoom in, and shrink on small screens
      const starScale = Math.min(1.8, 0.85 + v.zoom * 0.15) * Math.min(1, Math.max(0.6, Math.min(w, h) / 700));

      ctx.globalCompositeOperation = "lighter";

      // bulge glow, squashed by the tilt
      const [cx, cy] = project(0, 0, 0, v, scale, cosY, sinY, cosT, sinT);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, Math.max(0.25, cosT));
      const glowR = scale * 0.3;
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
      glow.addColorStop(0, "rgba(255,226,200,0.45)");
      glow.addColorStop(0.15, "rgba(232,207,192,0.2)");
      glow.addColorStop(0.5, "rgba(139,149,246,0.06)");
      glow.addColorStop(1, "rgba(139,149,246,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, glowR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // stars, batched by color + brightness (projection inlined - this
      // loop runs ~17,000 times a frame)
      const { xs, ys, zs, sizes } = galaxy;
      const halfW = w / 2, halfH = h / 2;
      galaxy.buckets.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.alpha;
        const idx = b.idx;
        for (let n = 0; n < idx.length; n++) {
          const i = idx[n];
          const px = xs[i] - v.panX, py = ys[i] - v.panY, z = zs[i];
          const x1 = px * cosY - py * sinY;
          const y1 = px * sinY + py * cosY;
          const p = CAMERA / (CAMERA - (z * cosT - y1 * sinT));
          const sx = halfW + x1 * scale * p;
          const sy = halfH - (y1 * cosT + z * sinT) * scale * p;
          if (sx < -4 || sy < -4 || sx > w + 4 || sy > h + 4) continue;
          const s = sizes[i] * starScale * p;
          ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
        }
      });

      // star-forming knots
      galaxy.knots.forEach((k) => {
        const [sx, sy, p] = project(k.x, k.y, 0, v, scale, cosY, sinY, cosT, sinT);
        const r = Math.max(2, k.size * scale * p);
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
        g.addColorStop(0, "rgba(242,184,198,0.35)");
        g.addColorStop(1, "rgba(242,184,198,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
      });

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      // arm names - only when the disk is open enough to read them
      if (cosT > 0.35) {
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(110,118,184,${Math.min(0.55, (cosT - 0.35) * 1.4)})`;
        galaxy.armLabels.forEach((l) => {
          const [sx, sy] = project(l.x, l.y, 0, v, scale, cosY, sinY, cosT, sinT);
          ctx.fillText(l.name.toUpperCase(), sx, sy);
        });
      }

      // markers: Earth, Sgr A*, and any Assignment worlds unlocked
      const onScreen = [];
      const sel = selectedRef.current;
      markersRef.current.forEach((m) => {
        const [sx, sy] = project(m.x, m.y, 0, v, scale, cosY, sinY, cosT, sinT);
        onScreen.push({ id: m.id, x: sx, y: sy });
        const isSel = sel === m.id;
        const pulse = m.pulse && !reduceMotion ? 0.6 + 0.4 * Math.sin(time / 350) : 1;

        if (m.binary) {
          // the home world and its ringed twin, side by side
          ctx.fillStyle = m.color;
          ctx.beginPath(); ctx.arc(sx - 3.5, sy, 3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#8A8FBF";
          ctx.beginPath(); ctx.arc(sx + 4, sy, 2.2, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = "rgba(138,143,191,0.8)";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.ellipse(sx + 4, sy, 5.5, 1.8, -0.3, 0, Math.PI * 2); ctx.stroke();
        } else if (m.id === "sgr-a") {
          ctx.fillStyle = "#05060f";
          ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = m.color;
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(sx, sy, 4.5, 0, Math.PI * 2); ctx.stroke();
        } else {
          ctx.globalAlpha = pulse;
          ctx.fillStyle = m.color;
          ctx.beginPath(); ctx.arc(sx, sy, 3.5, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.strokeStyle = isSel ? "#E8CFC0" : "rgba(185,192,255,0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(sx, sy, isSel ? 12 : 9, 0, Math.PI * 2); ctx.stroke();

        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = isSel ? "#E8CFC0" : "#B9C0FF";
        ctx.fillText(m.short || m.name, sx + 14, sy + 4);
      });
      markersOnScreen.current = onScreen;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // --- input: drag to turn, wheel/pinch/buttons to zoom, tap a marker ---
    const pointers = new Map();
    let pinchStart = null;
    let downAt = null;

    const touched = () => { lastInteraction = performance.now(); target.current = null; };
    const clampZoom = (z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));

    const onDown = (e) => {
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      downAt = pointers.size === 1 ? { x: e.clientX, y: e.clientY } : null;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchStart = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: view.current.zoom };
      }
      touched();
    };
    const onMove = (e) => {
      if (!pointers.has(e.pointerId)) {
        // hover: pointer cursor over a marker
        const rect = canvas.getBoundingClientRect();
        const hit = markersOnScreen.current.some((m) => Math.hypot(m.x - (e.clientX - rect.left), m.y - (e.clientY - rect.top)) < 14);
        canvas.style.cursor = hit ? "pointer" : "grab";
        return;
      }
      const prev = pointers.get(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2 && pinchStart) {
        const [a, b] = [...pointers.values()];
        view.current.zoom = clampZoom(pinchStart.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / pinchStart.dist));
      } else if (pointers.size === 1) {
        const v = view.current;
        v.yaw += (e.clientX - prev.x) * 0.006;
        v.tilt = Math.max(0, Math.min(1.45, v.tilt - (e.clientY - prev.y) * 0.006));
        canvas.style.cursor = "grabbing";
      }
      touched();
    };
    const onUp = (e) => {
      if (downAt && pointers.size === 1 && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) < 5) {
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left, py = e.clientY - rect.top;
        let best = null, bestD = 16;
        markersOnScreen.current.forEach((m) => {
          const d = Math.hypot(m.x - px, m.y - py);
          if (d < bestD) { best = m; bestD = d; }
        });
        setSelected(best ? best.id : null);
      }
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStart = null;
      downAt = null;
      canvas.style.cursor = "grab";
      touched();
    };
    const onWheel = (e) => {
      e.preventDefault();
      view.current.zoom = clampZoom(view.current.zoom * Math.exp(-e.deltaY * 0.0015));
      touched();
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [galaxy]);

  const zoomBy = (f) => {
    const v = view.current;
    target.current = { zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (target.current?.zoom ?? v.zoom) * f)) };
  };
  const resetView = () => {
    target.current = { ...DEFAULT_VIEW, yaw: Math.round(view.current.yaw / (Math.PI * 2)) * Math.PI * 2 };
    setSelected(null);
  };
  const focusOn = (m) => {
    setSelected(m.id);
    target.current = { panX: m.x, panY: m.y, zoom: 3.2, tilt: 0.75 };
  };

  const selectedMarker = markers.find((m) => m.id === selected);
  const lockedCount = STORY_WORLDS.length - unlockedWorlds.length;

  return (
    <div>
      <div ref={wrapRef} style={{ position: "relative", border: "1px solid #262A55", borderRadius: 4, overflow: "hidden", background: "#05060f" }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", touchAction: "none", cursor: "grab" }}
          aria-label="3D map of the galaxy"
        />
        <div style={styles.controls}>
          <button onClick={() => zoomBy(1.4)} style={styles.ctrlBtn} aria-label="Zoom in">+</button>
          <button onClick={() => zoomBy(1 / 1.4)} style={styles.ctrlBtn} aria-label="Zoom out">&minus;</button>
          <button onClick={resetView} style={{ ...styles.ctrlBtn, width: "auto", padding: "0 10px", fontSize: 11 }}>reset</button>
        </div>
        <div className="mono" style={styles.hint}>
          drag to turn &middot; scroll or pinch to zoom &middot; tap a marker
        </div>
      </div>

      <div style={styles.legend}>
        {markers.map((m) => (
          <button
            key={m.id}
            onClick={() => focusOn(m)}
            style={{ ...styles.chip, borderColor: selected === m.id ? "#E8CFC0" : "#262A55", color: selected === m.id ? "#E8CFC0" : "#B9C0FF" }}
          >
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: m.color, marginRight: 7 }} />
            {m.name}
          </button>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 14, minHeight: 64 }}>
        {selectedMarker ? (
          <>
            <div className="mono" style={{ fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 6 }}>
              {selectedMarker.story ? "A WORLD FROM THE ARCHIVE" : "LANDMARK"}
            </div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#DCDFFF", marginBottom: 6 }}>
              {selectedMarker.name}
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: "#B7BADF", lineHeight: 1.6 }}>{selectedMarker.text}</p>
            {selectedMarker.story && (
              <Link href={selectedMarker.story.href} className="mono" style={{ display: "inline-block", marginTop: 10, fontSize: 11, color: "#6E76B8" }}>
                read {selectedMarker.story.title} again &rarr;
              </Link>
            )}
          </>
        ) : (
          <p style={{ margin: 0, fontSize: 13.5, color: "#8A8FBF", lineHeight: 1.6 }}>
            Earth sits roughly halfway out from the center, in the Orion Spur,
            a minor arm between two larger ones. Tap any marker, or a name
            above, to fly to it.
          </p>
        )}
      </div>

      {lockedCount > 0 && (
        <p className="mono" style={{ fontSize: 11, color: "#565B8F", marginTop: 12, textAlign: "center" }}>
          {signedIn ? (
            <>
              {lockedCount} {lockedCount === 1 ? "world" : "worlds"} from the Archive still uncharted &middot;{" "}
              <Link href="/assignments" style={{ color: "#6E76B8" }}>read the Assignments</Link> to find them
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: "#6E76B8" }}>sign in</Link> and read the Assignments to chart their worlds here
            </>
          )}
        </p>
      )}
    </div>
  );
}

const styles = {
  controls: {
    position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    gap: 6,
  },
  ctrlBtn: {
    width: 30,
    height: 30,
    background: "rgba(10,11,28,0.8)",
    border: "1px solid #3A3E75",
    borderRadius: 4,
    color: "#B9C0FF",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 16,
    lineHeight: 1,
    cursor: "pointer",
  },
  hint: {
    position: "absolute",
    left: 12,
    bottom: 10,
    fontSize: 10,
    color: "#565B8F",
    pointerEvents: "none",
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(14,16,38,0.72)",
    border: "1px solid #262A55",
    borderRadius: 4,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    padding: "6px 10px",
    cursor: "pointer",
  },
};
