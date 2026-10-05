"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabaseBrowser";
import { LANDMARKS, STORY_WORLDS } from "../lib/galaxyWorlds";
import { openedStories } from "../lib/storyGames";
import { recordMilestone } from "../lib/milestones";
import AlienCard from "./AlienCard";
import { CHARACTERS } from "../lib/galaxyCharacters";
import { startAmbient, soundOn, setSoundOn, whoosh } from "../lib/spaceSound";

// A canvas-drawn 3D model of the galaxy: a barred spiral with four major
// arms, the Orion Spur (Earth's arm), a glowing bulge, star-forming knots,
// the worlds of the Assignments the visitor has read, and a faint point of
// light for every species the Kin have made in the Alien Lab.
//
// Map units: center (0, 0), disk edge at radius 1. See lib/galaxyWorlds.js.
//
// Update 5.59: full screen; the map's own menus (places, Kin species,
// characters) so they work full screen too - only your species show unless
// you ask for the rest; far more detail (dust lanes, globular clusters, the
// Magellanic Clouds, a deep background, fine stars that appear as you zoom
// in); Sagittarius A* drawn as a real black hole up close (shadow, photon
// ring, a spinning accretion disk lensed over the top, faint jets); and an
// ambient hum (lib/spaceSound.js) that deepens toward the core.

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
const MAX_ZOOM = 18;
const BH_R = 0.012; // Sgr A*'s drawn shadow, in map units (wildly not to scale)

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

// Where a Kin species sits: somewhere along one of the arms, chosen by its
// id, so it keeps its place every visit. Not canon - just a home on the map.
const SPECIES_COLOR = "#6FC3A8";
const SPECIES_LIMIT = 400;
function speciesPosition(id) {
  let h = 2166136261;
  for (const c of String(id)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rand = mulberry32(h >>> 0);
  const maxTheta = Math.log(1 / ARM_START_R) / PITCH;
  const arm = ARMS[Math.floor(rand() * ARMS.length)];
  const t = (0.3 + rand() * 0.65) * maxTheta;
  const r = ARM_START_R * Math.exp(PITCH * t);
  const a = arm.phase + t;
  const spread = 0.02 + r * 0.03;
  return { x: r * Math.cos(a) + (rand() - 0.5) * spread * 2, y: r * Math.sin(a) + (rand() - 0.5) * spread * 2 };
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
  for (let i = 0; i < 4200; i++) {
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
    for (let i = 0; i < arm.stars * 1.35; i++) {
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

  // Globular clusters: old, tight balls of stars in a halo around the core
  for (let c = 0; c < 46; c++) {
    const r = 0.15 + Math.pow(rand(), 0.7) * 0.85, a = rand() * Math.PI * 2, el = (rand() - 0.5) * 1.6;
    const cx0 = r * Math.cos(a) * Math.cos(el), cy0 = r * Math.sin(a) * Math.cos(el), cz0 = r * Math.sin(el) * 0.7;
    for (let k = 0; k < 22; k++) add(cx0 + gauss() * 0.006, cy0 + gauss() * 0.006, cz0 + gauss() * 0.006, 2, k < 4 ? 2 : 1, 0.7);
  }
  // The Magellanic Clouds: two small ragged galaxies off to one side, below the plane
  [[1.35, -0.95, -0.45, 900, 0.07], [1.62, -0.58, -0.55, 420, 0.045]].forEach(([mx, my, mz, n, sp]) => {
    for (let k = 0; k < n; k++) add(mx + gauss() * sp * 1.4, my + gauss() * sp, mz + gauss() * sp * 0.6, pick([0.45, 0.4, 0.05, 0.1]), pick([0.5, 0.35, 0.15]), 0.5 + rand() * 0.6);
  });

  // Fine stars: thousands more, faint, only drawn once you zoom in
  const fx = [], fy = [], fz = [];
  for (let i = 0; i < 14000; i++) {
    const arm = ARMS[Math.floor(rand() * ARMS.length)];
    const onArm = rand() < 0.7;
    const t = Math.pow(rand(), 0.8) * (Math.log(1 / ARM_START_R) / PITCH);
    const r = onArm ? ARM_START_R * Math.exp(PITCH * t) : Math.min(1.05, -0.3 * Math.log(1 - rand() * 0.96));
    const a = onArm ? arm.phase + t : rand() * Math.PI * 2;
    const sp = onArm ? 0.012 + r * 0.03 : 0;
    fx.push(r * Math.cos(a) + gauss() * sp); fy.push(r * Math.sin(a) + gauss() * sp); fz.push(gauss() * 0.01);
  }

  // Dust lanes: dark, along the inner edge of each arm
  const dust = [];
  ARMS.forEach((arm) => {
    for (let i = 0; i < (arm.major ? 260 : 160); i++) {
      const t = (0.12 + rand() * 0.85) * (Math.log(1 / ARM_START_R) / PITCH);
      const r = ARM_START_R * Math.exp(PITCH * t) * 0.965;
      const a = arm.phase + t - 0.09;
      dust.push({ x: r * Math.cos(a) + gauss() * 0.01, y: r * Math.sin(a) + gauss() * 0.01, size: 0.006 + rand() * 0.014, a: 0.1 + rand() * 0.16 });
    }
  });

  // The deep background: far stars and other galaxies (screen space)
  const far = Array.from({ length: 520 }, () => ({ x: rand(), y: rand(), s: 0.4 + rand() * 1.1, a: 0.15 + rand() * 0.5, c: rand() < 0.15 ? "#E8CFC0" : "#C9CCF5" }));
  const others = Array.from({ length: 26 }, () => ({ x: rand(), y: rand(), r: 3 + rand() * 9, rot: rand() * Math.PI, sq: 0.25 + rand() * 0.6, c: rand() < 0.5 ? "232,207,192" : "185,192,255" }));

  // Star-forming knots: soft pink glows scattered along the arms
  const knots = [];
  ARMS.forEach((arm) => {
    for (let i = 0; i < (arm.major ? 34 : 20); i++) {
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
    fine: { xs: Float32Array.from(fx), ys: Float32Array.from(fy), zs: Float32Array.from(fz) },
    dust,
    far,
    others,
  };
}

// Sagittarius A*, up close: a shadow, a photon ring, an accretion disk in the
// galaxy's plane - brighter on the side turning toward us, its far side bent
// up over the top by the hole's gravity - and faint jets.
function drawBlackHole(ctx, sx, sy, R, squash, time, still) {
  const spin = still ? 0 : time / 1400;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const halo = ctx.createRadialGradient(sx, sy, R, sx, sy, R * 9);
  halo.addColorStop(0, "rgba(255,214,150,0.35)"); halo.addColorStop(0.4, "rgba(232,160,90,0.08)"); halo.addColorStop(1, "rgba(232,160,90,0)");
  ctx.fillStyle = halo; ctx.fillRect(sx - R * 9, sy - R * 9, R * 18, R * 18);
  if (R > 14) {
    // jets, along the axis
    const jl = R * 14 * Math.max(0.15, Math.sqrt(1 - squash * squash));
    [-1, 1].forEach((d) => {
      const g = ctx.createLinearGradient(sx, sy, sx, sy + d * jl);
      g.addColorStop(0, "rgba(185,200,255,0.12)"); g.addColorStop(0.35, "rgba(185,200,255,0.04)"); g.addColorStop(1, "rgba(185,200,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(sx - R * 0.05, sy); ctx.lineTo(sx - R * 0.22, sy + d * jl); ctx.lineTo(sx + R * 0.22, sy + d * jl); ctx.lineTo(sx + R * 0.05, sy); ctx.fill();
    });
  }
  const ring = (rr, frontHalf, lw) => {
    // one ring of the disk: hot near the hole, Doppler-bright on the side
    // turning toward us, clumpy and turning faster the closer in it is
    const heat = 1 - (rr - 1.5) / 2.2;
    const col = (ang) => {
      const doppler = 0.5 + 0.5 * Math.cos(ang);
      const clump = 0.6 + 0.4 * Math.sin(ang * 5 - spin * (6 / rr) + rr * 9) * Math.sin(ang * 2 + spin * 1.3 + rr * 3);
      const al = Math.max(0, Math.min(1, (0.2 + heat * 0.8) * doppler * clump));
      return `rgba(255,${Math.round(150 + heat * 100)},${Math.round(60 + heat * 170)},${al.toFixed(3)})`;
    };
    ctx.save();
    ctx.translate(sx, sy); ctx.scale(1, squash);
    ctx.lineWidth = lw / Math.max(0.35, squash) * Math.max(0.35, squash); // keep the band width even
    if (ctx.createConicGradient) {
      const g = ctx.createConicGradient(0, 0, 0);
      for (let k = 0; k <= 36; k++) g.addColorStop(k / 36, col((k / 36) * Math.PI * 2));
      ctx.strokeStyle = g;
    } else ctx.strokeStyle = col(0);
    ctx.beginPath(); ctx.arc(0, 0, R * rr, frontHalf ? 0 : Math.PI, frontHalf ? Math.PI : Math.PI * 2); ctx.stroke();
    ctx.restore();
  };
  const step = R > 20 ? 0.12 : 0.3, lw = Math.max(1, R * step * 1.7);
  ctx.lineCap = "butt";
  for (let rr = 1.5; rr < 3.7; rr += step) ring(rr, false, lw); // the far side of the disk
  // the far side again, bent up and over the shadow by the hole's gravity
  if (R > 8) {
    ctx.lineWidth = Math.max(1, R * 0.16);
    for (let k = 0; k < 5; k++) {
      ctx.strokeStyle = `rgba(255,${210 - k * 20},${150 - k * 20},${0.5 - k * 0.08})`;
      ctx.beginPath(); ctx.ellipse(sx, sy, R * (1.25 + k * 0.12), R * (1.25 + k * 0.12), 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
      ctx.strokeStyle = `rgba(255,${200 - k * 20},${140 - k * 20},${0.25 - k * 0.04})`;
      ctx.beginPath(); ctx.ellipse(sx, sy, R * (1.2 + k * 0.1), R * (1.2 + k * 0.1), 0, Math.PI * 0.08, Math.PI * 0.92); ctx.stroke();
    }
  }
  ctx.restore();
  // the shadow
  ctx.fillStyle = "#000";
  ctx.beginPath(); ctx.arc(sx, sy, R, 0, Math.PI * 2); ctx.fill();
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  // the photon ring: light that went round the hole before escaping
  ctx.strokeStyle = "rgba(255,240,215,0.9)";
  ctx.lineWidth = Math.max(1, R * 0.07);
  ctx.beginPath(); ctx.arc(sx, sy, R * 1.04, 0, Math.PI * 2); ctx.stroke();
  for (let rr = 1.5; rr < 3.7; rr += step) ring(rr, true, lw); // the near side, in front of the shadow
  ctx.restore();
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
  const [userId, setUserId] = useState(null);
  const [kinSpecies, setKinSpecies] = useState([]); // light rows, no portraits
  const [speciesMode, setSpeciesMode] = useState("mine"); // mine | all (others can still be picked one at a time)
  const [pinned, setPinned] = useState(null); // a species picked from the menu, shown even when it isn't yours
  const [full, setFull] = useState(false);
  const fullRef = useRef(false);
  fullRef.current = full;
  const [sound, setSound] = useState(false);
  const amb = useRef(null);
  const audioHint = useRef({ zoom: 1, near: 1 });
  const [character, setCharacter] = useState(null);
  const [speciesDetail, setSpeciesDetail] = useState(null); // full row of the selected species
  const speciesRef = useRef([]);

  const galaxy = useMemo(() => buildGalaxy(), []);

  const unlockedWorlds = useMemo(
    () => STORY_WORLDS.filter((w) => readNumbers && readNumbers.includes(w.assignment)),
    [readNumbers]
  );
  const markers = useMemo(() => [...LANDMARKS, ...unlockedWorlds], [unlockedWorlds]);
  const markersRef = useRef(markers);
  markersRef.current = markers;
  const speciesMarkers = useMemo(
    () => kinSpecies.map((sp) => ({ id: `species:${sp.id}`, speciesId: sp.id, name: sp.name, own: sp.user_id === userId, ...speciesPosition(sp.id) })),
    [kinSpecies, userId]
  );
  speciesRef.current = speciesMarkers.filter((m) => speciesMode === "all" || m.own || m.id === pinned || m.id === selected);
  selectedRef.current = selected;

  // Which Assignments has this visitor read? (RLS limits this to their own rows)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        // stories opened in this browser count too (lib/storyGames.js remembers them)
        const local = await openedStories().catch(() => new Set());
        if (!cancelled && local.size) setReadNumbers((prev) => [...new Set([...(prev || []), ...local])]);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;
        setSignedIn(true);
        setUserId(user.id);
        const { data } = await supabase.from("reading_progress").select("assignment_number").eq("user_id", user.id);
        if (!cancelled) setReadNumbers((prev) => [...new Set([...(prev || []), ...(data || []).map((r) => r.assignment_number)])]);
      } catch (e) {
        // map still works without it - just no Assignment worlds
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Every Kin species, lightly (portraits load only for the one selected)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("alien_species")
          .select("id, name, user_id, created_at")
          .order("created_at", { ascending: false })
          .limit(SPECIES_LIMIT);
        if (!cancelled) setKinSpecies(data || []);
      } catch (e) {
        // the map works without them
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // The selected species' full row, for its card
  const selectedSpeciesId = selected && selected.startsWith("species:") ? selected.slice(8) : null;
  useEffect(() => {
    if (!selectedSpeciesId) { setSpeciesDetail(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("alien_species").select("*").eq("id", selectedSpeciesId).maybeSingle();
        if (cancelled || !data) return;
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", data.user_id).maybeSingle();
        if (!cancelled) setSpeciesDetail({ ...data, creator: profile?.username });
      } catch (e) {
        // panel falls back to the name only
      }
    })();
    return () => { cancelled = true; };
  }, [selectedSpeciesId]);

  // Finding your own species here is a step of Your First Assignment
  useEffect(() => {
    const m = speciesMarkers.find((x) => x.id === selected);
    if (m && m.own) recordMilestone("map");
  }, [selected, speciesMarkers]);

  // /galaxy/map?species=<id> flies straight to that species
  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current || !speciesMarkers.length) return;
    const want = new URLSearchParams(window.location.search).get("species");
    const m = want && speciesMarkers.find((x) => x.speciesId === want);
    if (m) {
      deepLinked.current = true;
      setPinned(m.id);
      setSelected(m.id);
      target.current = { panX: m.x, panY: m.y, zoom: 3.6, tilt: 0.75 };
    }
  }, [speciesMarkers]);

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
      h = fullRef.current ? window.innerHeight : Math.max(380, Math.min(window.innerHeight * 0.72, w * 0.78));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("resize", resize);

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
      // the deep background: drifts a little as the galaxy turns
      const par = v.yaw * 0.02;
      galaxy.far.forEach((f) => {
        ctx.globalAlpha = f.a; ctx.fillStyle = f.c;
        ctx.fillRect((((f.x + par) % 1) + 1) % 1 * w, f.y * h, f.s, f.s);
      });
      galaxy.others.forEach((o) => {
        const ox = (((o.x + par * 0.6) % 1) + 1) % 1 * w, oy = o.y * h;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
        g.addColorStop(0, `rgba(${o.c},0.35)`); g.addColorStop(1, `rgba(${o.c},0)`);
        ctx.globalAlpha = 1; ctx.fillStyle = g;
        ctx.save(); ctx.translate(ox, oy); ctx.rotate(o.rot); ctx.scale(1, o.sq); ctx.translate(-ox, -oy);
        ctx.beginPath(); ctx.arc(ox, oy, o.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
      ctx.globalAlpha = 1;

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

      // fine stars, fading in as you zoom closer
      if (v.zoom > 1.5) {
        const fa = Math.min(0.55, (v.zoom - 1.5) * 0.25);
        const F = galaxy.fine;
        ctx.fillStyle = "#D6D9FF";
        ctx.globalAlpha = fa;
        const fs = Math.min(1.4, 0.4 + v.zoom * 0.06);
        for (let i = 0; i < F.xs.length; i++) {
          const px = F.xs[i] - v.panX, py = F.ys[i] - v.panY, z = F.zs[i];
          const x1 = px * cosY - py * sinY, y1 = px * sinY + py * cosY;
          const p = CAMERA / (CAMERA - (z * cosT - y1 * sinT));
          const sx = halfW + x1 * scale * p, sy = halfH - (y1 * cosT + z * sinT) * scale * p;
          if (sx < 0 || sy < 0 || sx > w || sy > h) continue;
          ctx.fillRect(sx, sy, fs, fs);
        }
      }

      // star-forming knots
      galaxy.knots.forEach((k) => {
        const [sx, sy, p] = project(k.x, k.y, 0, v, scale, cosY, sinY, cosT, sinT);
        const raw = k.size * scale * p, r = Math.max(2, Math.min(90, raw));
        if (sx < -r || sy < -r || sx > w + r || sy > h + r) return;
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
        g.addColorStop(0, `rgba(242,184,198,${0.35 * Math.min(1, 140 / raw)})`);
        g.addColorStop(1, "rgba(242,184,198,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
      });

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      // dust lanes: dark, in front of the starlight
      ctx.fillStyle = "#07060c";
      galaxy.dust.forEach((d) => {
        const [sx, sy, p] = project(d.x, d.y, 0, v, scale, cosY, sinY, cosT, sinT);
        const r = Math.min(48, d.size * scale * p);
        if (r < 0.6 || sx < -r || sy < -r || sx > w + r || sy > h + r) return;
        ctx.globalAlpha = d.a * Math.min(1, 900 / (d.size * scale * p * 30));
        ctx.beginPath(); ctx.ellipse(sx, sy, r, r * Math.max(0.3, cosT), 0, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Sagittarius A*
      {
        const [bx, by, bp] = project(0, 0, 0, v, scale, cosY, sinY, cosT, sinT);
        const R = BH_R * scale * bp;
        if (R > 2.2) drawBlackHole(ctx, bx, by, R, Math.max(0.08, cosT), time, reduceMotion);
        audioHint.current = { zoom: v.zoom, near: Math.hypot(v.panX, v.panY) };
      }

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

      // Kin species: faint teal points; your own a little brighter, with a name
      const onScreen = [];
      const sel = selectedRef.current;
      speciesRef.current.forEach((m) => {
        const [sx, sy] = project(m.x, m.y, 0, v, scale, cosY, sinY, cosT, sinT);
        if (sx < -10 || sy < -10 || sx > w + 10 || sy > h + 10) return;
        onScreen.push({ id: m.id, x: sx, y: sy, small: true });
        const isSel = sel === m.id;
        const twinkle = reduceMotion ? 1 : 0.75 + 0.25 * Math.sin(time / 900 + m.x * 40);
        ctx.globalAlpha = (m.own || isSel ? 0.95 : 0.85) * twinkle;
        ctx.fillStyle = SPECIES_COLOR;
        ctx.beginPath(); ctx.arc(sx, sy, m.own || isSel ? 2.6 : 2.3, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        if (m.own || isSel) {
          ctx.strokeStyle = isSel ? "#E8CFC0" : "rgba(111,195,168,0.55)";
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(sx, sy, isSel ? 10 : 7, 0, Math.PI * 2); ctx.stroke();
          ctx.font = "10px 'JetBrains Mono', monospace";
          ctx.textAlign = "left";
          ctx.fillStyle = isSel ? "#E8CFC0" : "rgba(111,195,168,0.85)";
          ctx.fillText(m.name, sx + 12, sy + 3);
        }
      });

      // markers: Earth, Sgr A*, and any Assignment worlds unlocked
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
          if (BH_R * scale < 2.2) {
            ctx.fillStyle = "#05060f";
            ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = m.color;
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(sx, sy, 4.5, 0, Math.PI * 2); ctx.stroke();
          }
          if (BH_R * scale > 30) return; // close up, the hole speaks for itself
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
        ctx.textAlign = m.labelLeft ? "right" : "left";
        ctx.fillStyle = isSel ? "#E8CFC0" : "#B9C0FF";
        ctx.fillText(m.short || m.name, m.labelLeft ? sx - 14 : sx + 14, sy + 4);
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
        const hit = markersOnScreen.current.some((m) => Math.hypot(m.x - (e.clientX - rect.left), m.y - (e.clientY - rect.top)) < (m.small ? 8 : 14));
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
          // species points are tiny and many: a tighter radius, and landmarks win ties
          const d = Math.hypot(m.x - px, m.y - py) + (m.small ? 4 : 0);
          if (d < (m.small ? 12 : bestD) && d < bestD) { best = m; bestD = d; }
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
      window.removeEventListener("resize", resize);
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
    setCharacter(null);
    target.current = m.id === "sgr-a" ? { panX: 0, panY: 0, zoom: 15, tilt: 1.32 } : { panX: m.x, panY: m.y, zoom: 3.2, tilt: 0.75 };
    if (amb.current) whoosh(true);
  };

  // full screen: the real thing where the browser allows it, and a fixed
  // overlay either way (iPhones have no full-screen API for pages)
  const toggleFull = () => {
    const next = !full;
    setFull(next);
    try {
      if (next && wrapRef.current?.requestFullscreen) wrapRef.current.requestFullscreen().catch(() => {});
      if (!next && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    } catch (e) { /* the overlay still works */ }
  };
  useEffect(() => {
    const onFs = () => { if (!document.fullscreenElement) setFull(false); };
    const onKey = (e) => { if (e.key === "Escape") setFull(false); };
    document.addEventListener("fullscreenchange", onFs);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("fullscreenchange", onFs); window.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => { document.body.style.overflow = full ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [full]);

  // the hum: starts with the first touch of the map (browsers insist), deepens
  // toward the core and brightens as you zoom
  useEffect(() => { setSound(soundOn()); }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    const start = () => { if (!amb.current && soundOn()) { amb.current = startAmbient({ base: 49, level: 0.7 }); setSound(true); } };
    canvas?.addEventListener("pointerdown", start);
    const id = setInterval(() => {
      const a = amb.current; if (!a) return;
      const { zoom, near } = audioHint.current;
      const core = Math.max(0, 1 - near * 2.5) * Math.min(1, zoom / 8);
      a.setPitch(49 * (1 - core * 0.42));
      a.setBrightness(Math.min(1, 0.15 + zoom / 14));
      a.setLevel(0.6 + core * 0.4);
    }, 400);
    return () => { canvas?.removeEventListener("pointerdown", start); clearInterval(id); amb.current?.stop(); amb.current = null; };
  }, []);
  const toggleSound = () => {
    if (amb.current) { amb.current.stop(); amb.current = null; setSound(false); setSoundOn(false); }
    else { setSoundOn(true); amb.current = startAmbient({ base: 49, level: 0.7 }); setSound(true); }
  };

  const pickCharacter = (id) => {
    const c = CHARACTERS.find((x) => x.id === id);
    if (!c) return;
    const world = markers.find((m) => m.id === c.world);
    if (!world) return;
    focusOn(world);
    setCharacter(c);
  };
  const pickSpecies = (val) => {
    if (val === "mine" || val === "all") { setSpeciesMode(val); if (val === "mine") setPinned(null); return; }
    const m = speciesMarkers.find((x) => x.id === val);
    if (m) { setPinned(m.id); focusOn(m); }
  };

  const selectedMarker = markers.find((m) => m.id === selected);
  const selectedSpecies = speciesMarkers.find((m) => m.id === selected);
  const lockedCount = STORY_WORLDS.length - unlockedWorlds.length;

  const charted = new Set(markers.map((m) => m.id));
  const mine = speciesMarkers.filter((m) => m.own);
  const others = speciesMarkers.filter((m) => !m.own);

  const info = selectedSpecies ? (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
      {speciesDetail && speciesDetail.id === selectedSpecies.speciesId && (
        <AlienCard species={speciesDetail} creator={speciesDetail.creator} width={full ? 170 : 200} />
      )}
      <div style={{ flex: "1 1 200px" }}>
        <div className="mono" style={styles.kicker}>{selectedSpecies.own ? "YOUR SPECIES" : "A SPECIES OF THE KIN"}</div>
        <div style={styles.infoTitle}>{selectedSpecies.name}</div>
        <p style={styles.infoText}>
          Made in the Alien Lab{speciesDetail?.creator ? ` by ${speciesDetail.creator}` : ""}. Every species the Kin create
          finds a home somewhere in the arms of the galaxy.
        </p>
        <Link href={`/galaxy/aliens/${selectedSpecies.speciesId}`} className="mono" style={styles.infoLink}>its page and 13i&rsquo;s review &rarr;</Link>
      </div>
    </div>
  ) : selectedMarker ? (
    <>
      <div className="mono" style={styles.kicker}>{character ? `A CHARACTER \u00b7 ${character.from.toUpperCase()}` : selectedMarker.story ? "A WORLD FROM THE ARCHIVE" : "LANDMARK"}</div>
      <div style={styles.infoTitle}>{character ? character.name : selectedMarker.name}</div>
      <p style={styles.infoText}>{character ? `${character.text} (${selectedMarker.name})` : selectedMarker.text}</p>
      {selectedMarker.story && (
        <Link href={selectedMarker.story.href} className="mono" style={styles.infoLink}>read {selectedMarker.story.title} again &rarr;</Link>
      )}
    </>
  ) : (
    <p style={{ ...styles.infoText, color: "#8A8FBF" }}>
      Earth sits roughly halfway out from the center, in the Orion Spur, a minor arm between two larger ones.
      Use the menus to fly anywhere, or tap a marker.
    </p>
  );

  return (
    <div>
      <div ref={wrapRef} className={`gm-wrap ${full ? "gm-full" : ""}`}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", touchAction: "none", cursor: "grab" }} aria-label="3D map of the galaxy" />

        <div className="gm-menus">
          <select className="gm-select" value="" onChange={(e) => { const m = markers.find((x) => x.id === e.target.value); if (m) focusOn(m); }} aria-label="Fly to a place">
            <option value="" disabled>Places</option>
            {markers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select className="gm-select gm-select-kin" value={pinned && !mine.some((m) => m.id === pinned) ? pinned : speciesMode} onChange={(e) => pickSpecies(e.target.value)} aria-label="Kin species">
            <option value="mine">Kin species: yours ({mine.length})</option>
            <option value="all">Show all {speciesMarkers.length} Kin species</option>
            {mine.length > 0 && <optgroup label="Yours">{mine.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</optgroup>}
            {others.length > 0 && <optgroup label="Everyone else's">{others.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</optgroup>}
          </select>
          <select className="gm-select" value={character?.id || ""} onChange={(e) => pickCharacter(e.target.value)} aria-label="Characters">
            <option value="" disabled>Characters</option>
            {CHARACTERS.map((c) => (
              <option key={c.id} value={c.id} disabled={!charted.has(c.world)}>{c.name}{charted.has(c.world) ? "" : ` \u00b7 read ${c.from}`}</option>
            ))}
          </select>
        </div>

        <div style={styles.controls}>
          <button onClick={() => zoomBy(1.4)} style={styles.ctrlBtn} aria-label="Zoom in">+</button>
          <button onClick={() => zoomBy(1 / 1.4)} style={styles.ctrlBtn} aria-label="Zoom out">&minus;</button>
          <button onClick={resetView} style={{ ...styles.ctrlBtn, width: "auto", padding: "0 10px", fontSize: 11 }}>reset</button>
          <button onClick={toggleSound} style={{ ...styles.ctrlBtn, width: "auto", padding: "0 10px", fontSize: 11, color: sound ? "#E9D29A" : "#8A8FBF" }} aria-pressed={sound}>{sound ? "\u266A on" : "\u266A off"}</button>
          <button onClick={toggleFull} style={{ ...styles.ctrlBtn, width: "auto", padding: "0 10px", fontSize: 11 }} aria-pressed={full}>{full ? "\u2715 exit" : "\u26F6 full screen"}</button>
        </div>
        <div className="mono" style={styles.hint}>
          drag to turn &middot; scroll or pinch to zoom &middot; tap a marker
        </div>
        {full && (selected || character) && <div className="gm-info">{info}</div>}
      </div>

      {!full && <div className="panel" style={{ marginTop: 14, minHeight: 64 }}>{info}</div>}

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
  kicker: { fontSize: 10, color: "#565B8F", letterSpacing: "1px", marginBottom: 6 },
  infoTitle: { fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#DCDFFF", marginBottom: 6 },
  infoText: { margin: 0, fontSize: 13.5, color: "#B7BADF", lineHeight: 1.6 },
  infoLink: { display: "inline-block", marginTop: 10, fontSize: 11, color: "#6E76B8" },
  controls: {
    position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 6,
    maxWidth: "60%",
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
