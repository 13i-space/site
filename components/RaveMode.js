"use client";

// Rave Mode (Update 5.68): the Alien Rave, full screen. Qeth, Ilu, Ixxen and
// Varrow dance to whatever is playing on The Rave, with the DJ at the decks.
//
// How it stays on the beat: every song's tempo and first downbeat were
// measured from the files (lib/rave/beatData.js), so the beat is read straight
// from the song's own clock (audio.currentTime, minus the speakers' delay).
// The live sound (the same Web Audio analyser Lyra listens to) adds the
// loudness, bass and shimmer that light things up. The measured energy of
// each part of the song decides the choreography: breakdowns get gentle
// moves, grooves get the good stuff, and every drop gets each alien's
// signature move, a laser burst, confetti, and the DJ's hands in the air.
//
// Moves change every four bars (the same moves for everyone watching the
// same moment of a song); now and then in a big section they all do the
// same move in a ripple across the stage.

import { useEffect, useRef, useState } from "react";
import { onMusic, createListener } from "../lib/lyraMusic";
import { gridFor, energyAt, dropsOf, liveTempo } from "../lib/rave/clock";
import { DANCERS, REPERTOIRE } from "../lib/rave/dancers";
import { layout, drawSky, drawWall, drawTruss, drawSpots, drawLasers, drawSpeakers, drawDJ, drawBooth, drawFloor, drawFog, drawCrowd, burst, drawParticles } from "../lib/rave/stage";
import { mix, clamp, smooth, hash, glow, hsl } from "../lib/rave/draw";

// the show's colours, a pair of hues at a time
const PALETTES = [[190, 300], [275, 45], [165, 215], [325, 190], [45, 285], [125, 305], [210, 340]];
// left to right on stage, for the ripples
const ORDER = ["varrow", "qeth", "ilu", "ixxen"];

function hueMix(a, b, k) {
  let d = ((b - a + 540) % 360) - 180;
  return a + d * k;
}

function shifted(m, delay) {
  if (!delay) return m;
  const B = m.B - delay;
  return { ...m, B, ph: B - Math.floor(B) };
}

export default function RaveMode({ audioRef, track, title, sub, playing, onToggle, onNext, onPrev, onClose }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [chrome, setChrome] = useState(true);
  const [strobe, setStrobe] = useState(false);
  const [full, setFull] = useState(false);
  const live = useRef({ track, title, sub, playing, strobe });
  live.current = { track, title, sub, playing, strobe };
  const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // controls fade away while you watch; any move brings them back
  useEffect(() => {
    let id = setTimeout(() => setChrome(false), 3200);
    const wake = () => { setChrome(true); clearTimeout(id); id = setTimeout(() => setChrome(false), 3200); };
    const el = wrapRef.current;
    el.addEventListener("pointermove", wake);
    el.addEventListener("pointerdown", wake);
    window.addEventListener("keydown", wake);
    return () => { clearTimeout(id); el.removeEventListener("pointermove", wake); el.removeEventListener("pointerdown", wake); window.removeEventListener("keydown", wake); };
  }, []);

  // keys: Esc leaves, arrows change song, F full screen (space is the page's play/pause)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "f" || e.key === "F") toggleFull();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // full screen, no scrolling underneath, and keep the screen awake
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onFs = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    onFs();
    let lock = null;
    const getLock = () => { try { navigator.wakeLock?.request("screen").then((l) => { lock = l; }).catch(() => {}); } catch (e) { /* not supported */ } };
    getLock();
    const onVis = () => { if (document.visibilityState === "visible") getLock(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("visibilitychange", onVis);
      try { lock && lock.release(); } catch (e) { /* ignore */ }
    };
  }, []);
  const toggleFull = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen?.();
      else (wrapRef.current.requestFullscreen || wrapRef.current.webkitRequestFullscreen)?.call(wrapRef.current);
    } catch (e) { /* not available (iPhone): it's already filling the window */ }
  };
  useEffect(() => {
    // go full screen as it opens (the click that opened it lets us)
    try { if (!document.fullscreenElement) wrapRef.current.requestFullscreen?.().catch(() => {}); } catch (e) { /* ignore */ }
    return () => { try { if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); } catch (e) { /* ignore */ } };
  }, []);

  // the show
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let analyser = null, listener = null, bins = null;
    const off = onMusic((a, mode) => {
      if (a && mode !== "voice") { analyser = a; listener = createListener(a); bins = new Uint8Array(a.frequencyBinCount); }
      else { analyser = null; listener = null; bins = null; }
    });
    const st = { parts: [], lastB: null, e: 0.2, amp: 0.15, lt: liveTempo(), key: null, grid: null, drops: [], seed: 0, titleAt: -10, quality: 1, slow: 0, prevT: performance.now() / 1000, frames: 0, liveE: 0.3 };
    let raf = 0;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const t = now / 1000;
      const dt = Math.min(0.05, Math.max(0.001, t - st.prevT));
      st.prevT = t;
      // keep it smooth on slower machines: drop the resolution if frames run long
      // (after a moment to settle in, and it climbs back if things speed up)
      st.frames += 1;
      if (st.frames > 90) {
        st.slow = st.slow * 0.95 + (dt > 0.028 ? 1 : 0) * 0.05;
        if (st.slow > 0.6 && st.quality > 0.55) { st.quality *= 0.85; st.slow = 0.3; st.fast = 0; }
        st.fast = dt < 0.019 ? (st.fast || 0) + 1 : 0;
        if (st.fast > 300 && st.quality < 1) { st.quality = Math.min(1, st.quality * 1.1); st.fast = 0; }
      }

      const { track: tr, title: ttl, sub: sb, playing: on, strobe: strobeOn } = live.current;
      // a new song: its beat grid, its drops, and its title up on the wall
      const key = tr ? tr.g : null;
      if (key !== st.key) {
        st.key = key;
        st.grid = tr ? gridFor(tr.file) : null;
        st.drops = dropsOf(st.grid);
        st.seed = tr ? Math.floor(hash(String(tr.file).length, (tr.ai || 0) * 13 + (tr.ti || 0)) * 1000) : 0;
        st.lt = liveTempo();
        st.titleAt = t;
        st.lastB = null;
      }

      // canvas size
      const W = canvas.clientWidth, H = canvas.clientHeight;
      let dpr = Math.min(window.devicePixelRatio || 1, 1.5) * st.quality;
      if (W * H * dpr * dpr > 2.4e6) dpr = Math.sqrt(2.4e6 / (W * H));
      const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      const L = layout(W, H);

      // where we are in the song, in beats
      const el = audioRef.current;
      const playingNow = !!(on && el && !el.paused);
      const ac = analyser && analyser.context;
      const latency = ac ? (ac.outputLatency || 0) + (ac.baseLatency || 0) : 0;
      const s = el ? el.currentTime - latency : 0;
      const heard = listener && playingNow ? listener.read(now) : { level: 0, bass: 0, high: 0, beat: false };
      if (!st.grid && heard.beat) st.lt.hit(s);
      // ?ravedebug keeps where each heard hit landed against the grid, for checking the sync
      if (DEBUG && heard.beat && st.grid) { const b0 = (s - st.grid.offset) / st.grid.period; DEBUG.push(+(b0 - Math.round(b0)).toFixed(3)); DEBUG.latency = latency; }
      let B;
      if (playingNow) B = st.grid ? (s - st.grid.offset) / st.grid.period : st.lt.beatAt(s);
      else B = t * 0.9;
      const ph = B - Math.floor(B);

      // how hard the music is going right now
      const measured = st.grid ? energyAt(st.grid, s) : null;
      st.liveE += (heard.level - st.liveE) * Math.min(1, dt * 0.8);
      const target = !playingNow ? 0.08 : measured != null ? clamp(measured * 0.8 + heard.level * 0.3, 0, 1) : clamp(heard.level * 1.15, 0, 1);
      st.e += (target - st.e) * Math.min(1, dt * 2.5);
      st.amp += ((playingNow ? 0.35 + 0.65 * st.e : 0.15) - st.amp) * Math.min(1, dt * 3);

      // drops: the one we're in, the one coming
      let drop = 0, build = 0;
      if (playingNow) {
        for (const d of st.drops) {
          if (B >= d && B < d + 32) drop = 1 - ((B - d) / 32) * 0.7;
          if (d > B && d - B <= 8) build = 1 - (d - B) / 8;
          if (st.lastB != null && st.lastB < d && B >= d && B - st.lastB < 1 && !reduced) burst(st.parts, L, { pal: palAt(B, st.seed) }, 140);
        }
      }
      st.lastB = playingNow ? B : null;

      const pal = palAt(B, st.seed);
      const m = { B, ph, t, e: st.e, amp: st.amp, level: playingNow ? heard.level : 0.05, bass: playingNow ? heard.bass : 0, high: playingNow ? heard.high : 0, drop, build, on: playingNow, pal };
      if (bins && analyser && playingNow) analyser.getByteFrequencyData(bins);
      const spectrum = playingNow ? bins : null;

      ctx.setTransform(dpr * L.u, 0, 0, dpr * L.u, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      // the world, back to front
      drawSky(ctx, L, m);
      const titleA = 1 - smooth(4.5, 6, t - st.titleAt);
      drawWall(ctx, L, m, spectrum, { title: titleA > 0.01 && ttl ? ttl : null, sub: sb, a: titleA });
      drawTruss(ctx, L, m);
      drawSpeakers(ctx, L, m);
      drawSpots(ctx, L, m, playingNow ? 0.45 + 0.55 * st.e : 0.25);
      drawDJ(ctx, L, m, spectrum);
      drawBooth(ctx, L, m, ttl);
      drawFloor(ctx, L, m);
      const laserI = !playingNow ? 0 : build > 0 ? 0.15 * (1 - build) : clamp(smooth(0.55, 0.9, st.e) + drop * 0.6, 0, 1);
      drawLasers(ctx, L, m, laserI);
      drawFog(ctx, L, m, false);

      // the four of them, back row first
      const order = ORDER.slice().sort((a, b) => L.dancers[a][1] - L.dancers[b][1]);
      order.forEach((key) => {
        const D = DANCERS[key];
        const [x, fy, h] = L.dancers[key];
        const ci = ORDER.indexOf(key);
        const cur = moveAt(key, ci, B, st, playingNow);
        const pose = (() => {
          const pB = D.moves[cur.name](shifted(m, cur.delay));
          const k = clamp((B - cur.start) / 1, 0, 1);
          if (k >= 1) return pB;
          const prev = moveAt(key, ci, cur.start - 0.001, st, playingNow);
          if (prev.name === cur.name && prev.delay === cur.delay) return pB;
          return mix(D.moves[prev.name](shifted(m, prev.delay)), pB, smooth(0, 1, k));
        })();
        // shadow and floor glow
        ctx.save(); ctx.translate(x, fy); ctx.scale(1, 0.25);
        ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.beginPath(); ctx.arc(0, 0, h * 0.32, 0, Math.PI * 2); ctx.fill();
        glow(ctx, 0, 0, h * 0.6, hsl(ci % 2 ? pal.a : pal.b, 100, 60, 0.8), 0.25 + m.bass * 0.35);
        ctx.restore();
        ctx.save();
        ctx.translate(x, fy);
        const sc = h / D.height;
        ctx.scale(sc, sc);
        if (key === "ixxen" && x > L.cx) ctx.scale(-1, 1);
        D.draw(ctx, pose, m);
        ctx.restore();
      });

      drawFog(ctx, L, m, true);
      drawCrowd(ctx, L, m);
      drawParticles(ctx, st.parts, dt);

      // strobe (only if switched on): every other beat in the big moments
      if (strobeOn && playingNow && !reduced && (drop > 0 || st.e > 0.85) && Math.floor(B) % 2 === 0 && ph < 0.08) {
        ctx.fillStyle = "rgba(255,255,255,0.32)"; ctx.fillRect(0, 0, L.VW, L.VH);
      }
      // a flash of colour on the drop
      if (drop > 0.92) { ctx.fillStyle = hsl(pal.a, 100, 70, (drop - 0.92) * 3); ctx.fillRect(0, 0, L.VW, L.VH); }
      // vignette
      const vg = ctx.createRadialGradient(L.cx, L.VH * 0.55, Math.min(L.VW, L.VH) * 0.35, L.cx, L.VH * 0.55, Math.max(L.VW, L.VH) * 0.8);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, L.VW, L.VH);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); off(); };
  }, [audioRef, reduced]);

  return (
    <div ref={wrapRef} className={`rv ${chrome ? "rv-chrome" : ""}`} role="dialog" aria-label="Rave Mode">
      <canvas ref={canvasRef} className="rv-canvas" aria-hidden="true" />
      <div className="rv-top">
        <div className="rv-now">
          <div className="mono rv-kicker">RAVE MODE{playing ? " · LIVE" : " · PAUSED"}</div>
          <div className="rv-title">{title || "Pick a song"}</div>
          {sub && <div className="mono rv-sub">{sub}</div>}
        </div>
        <button className="rv-x" onClick={onClose} aria-label="Leave Rave Mode">✕</button>
      </div>
      <div className="rv-bar">
        <button onClick={onPrev} aria-label="Previous song">⏮</button>
        <button onClick={onToggle} className="rv-play" aria-label={playing ? "Pause" : "Play"}>{playing ? "❚❚" : "▶"}</button>
        <button onClick={onNext} aria-label="Next song">⏭</button>
        {!reduced && (
          <button className={`mono rv-small ${strobe ? "rv-on" : ""}`} onClick={() => setStrobe((v) => !v)} aria-pressed={strobe} title="Flashing lights on the big moments">
            strobe {strobe ? "on" : "off"}
          </button>
        )}
        <button className="mono rv-small" onClick={toggleFull} title="Full screen (F)">{full ? "exit full screen" : "full screen"}</button>
      </div>
      {!playing && (
        <button className="rv-paused" onClick={onToggle}>
          <span>▶</span> start the music
        </button>
      )}
    </div>
  );
}

const DEBUG = typeof window !== "undefined" && /[?&]ravedebug/.test(window.location.search) ? (window.__rave = []) : null;

function palAt(B, seed) {
  const sec = Math.floor(B / 64);
  const a = PALETTES[(((sec + seed) % PALETTES.length) + PALETTES.length) % PALETTES.length];
  const b = PALETTES[(((sec + seed - 1) % PALETTES.length) + PALETTES.length) % PALETTES.length];
  const k = smooth(0, 4, B - sec * 64);
  return { a: hueMix(b[0], a[0], k), b: hueMix(b[1], a[1], k) };
}

// which move a dancer is doing at a given beat (pure: same song moment, same move)
function moveAt(key, ci, beat, st, playing) {
  const R = REPERTOIRE[key];
  if (!playing) return { name: R.chill[0], delay: 0, start: -1e9 };
  for (const d of st.drops) if (beat >= d && beat < d + 32) return { name: R.drop, delay: 0, start: d };
  const block = Math.floor(beat / 16);
  let start = block * 16;
  for (const d of st.drops) if (d + 32 > start && d + 32 <= beat) start = d + 32;
  const e = st.grid ? energyAt(st.grid, st.grid.offset + block * 16 * st.grid.period) : st.liveE;
  const tier = e < 0.4 ? "chill" : e < 0.8 ? "groove" : "hype";
  if (tier === "hype" && hash(block, st.seed, 99) < 0.3) return { name: R.unison, delay: ci * 0.5, start };
  const list = R[tier];
  return { name: list[Math.floor(hash(block, ci, st.seed) * list.length)], delay: 0, start };
}
