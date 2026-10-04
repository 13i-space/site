"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BASE } from "../../../lib/musicReleases";

// APPREHENSION - the first 13i music video (Update 5.55). Paul's track,
// with a film drawn live in the browser and driven by the song itself: the
// bass, the highs and the beats move everything. Six movements across the
// length of the track:
//   I    the void        - a single point, waiting
//   II   the night side  - Earth from orbit; a wave passes over the cities
//   III  listening       - dishes under an aurora; the song's own waveform
//   IV   the approach    - through the rings, faster on every beat
//   V    the eye         - 13i opens its eye
//   VI   translated      - "a signal, translated"
// Standalone page (no nav) so it can go full screen. "Save as a video file"
// records the canvas and the sound in real time into a .webm to post.
// The song streams through 13i.space's own address (/api/track) so it can
// be measured; if that fails it plays from its original address and the
// film follows the clock instead of the sound.

const TRACK = "Apprehension";
const SECTIONS = [
  { at: 0, name: "the void" },
  { at: 0.12, name: "the night side" },
  { at: 0.3, name: "listening" },
  { at: 0.48, name: "the approach" },
  { at: 0.68, name: "the eye" },
  { at: 0.9, name: "translated" },
];

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeWorld() {
  const r = rng(1);
  return {
    stars: Array.from({ length: 520 }, () => ({ x: (r() - 0.5) * 2, y: (r() - 0.5) * 2, z: r(), tw: r() * 6.28 })),
    cities: Array.from({ length: 900 }, () => ({ a: r() * Math.PI, b: (r() - 0.5) * 0.9, s: r(), c: r() < 0.85 ? "#F6D9A8" : "#FFFFFF" })),
    glyphs: "◇ ◈ ◆ ⟐ ⊹ ✧ ⌬ ◬ ⟁ ⏃ ⏚ ⍜".split(" "),
  };
}

export default function ApprehensionVideo() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const wrapRef = useRef(null);
  const graph = useRef(null); // { ctx, analyser, dest }
  const [state, setState] = useState("ready"); // ready | playing | paused | ended
  const [recording, setRecording] = useState(false);
  const [note, setNote] = useState("");
  const recorder = useRef(null);
  const direct = useRef(false);

  // wire the song through Web Audio once (after a click)
  const wire = () => {
    if (graph.current || direct.current) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      const src = ctx.createMediaElementSource(audioRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.72;
      const dest = ctx.createMediaStreamDestination();
      src.connect(analyser);
      analyser.connect(ctx.destination);
      analyser.connect(dest);
      graph.current = { ctx, analyser, dest };
    } catch (e) {
      graph.current = null;
    }
  };

  const play = () => {
    const el = audioRef.current;
    wire();
    graph.current?.ctx.resume?.();
    el.play().then(() => setState("playing")).catch(() => setNote("Tap again to start the sound."));
  };
  const pause = () => { audioRef.current.pause(); setState("paused"); };
  const fullscreen = () => {
    const w = wrapRef.current;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else (w.requestFullscreen || w.webkitRequestFullscreen)?.call(w);
  };

  const record = () => {
    if (recording) { recorder.current?.stop(); return; }
    if (!graph.current) { setNote("Recording needs the sound to come through 13i.space; it isn't available right now."); return; }
    try {
      const vstream = canvasRef.current.captureStream(30);
      const stream = new MediaStream([...vstream.getVideoTracks(), ...graph.current.dest.stream.getAudioTracks()]);
      const type = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((t) => window.MediaRecorder && MediaRecorder.isTypeSupported(t));
      if (!type) { setNote("This browser can't record video. Chrome or Edge on a computer can."); return; }
      const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 8000000 });
      const chunks = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        setRecording(false);
        const blob = new Blob(chunks, { type: "video/webm" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "13i-Apprehension.webm";
        a.click();
        setNote("Saved 13i-Apprehension.webm. (To post it on Instagram or similar, convert it to .mp4 first.)");
      };
      recorder.current = rec;
      const el = audioRef.current;
      el.currentTime = 0;
      rec.start(1000);
      setRecording(true);
      setNote("Recording in real time - let it play to the end, or press stop.");
      play();
    } catch (e) {
      setNote("This browser can't record video. Chrome or Edge on a computer can.");
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas.getContext("2d");
    const world = makeWorld();
    const el = audioRef.current;
    let raf = 0, W = 0, H = 0, dpr = 1;
    let freq = null, wave = null;
    const feat = { level: 0, bass: 0, mid: 0, high: 0, beat: 0, avgBass: 0.2, lastBeat: 0 };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    // ?at=0.5 shows the film at that point of the song, without sound (for checking a movement)
    const at = Number(new URLSearchParams(window.location.search).get("at"));
    const preview = Number.isFinite(at) && at > 0 ? Math.min(0.999, at) : null;
    if (preview != null) setState("preview");

    const listen = (now) => {
      const a = graph.current?.analyser;
      const playing = !el.paused;
      if (a) {
        if (!freq) { freq = new Uint8Array(a.frequencyBinCount); wave = new Uint8Array(a.fftSize); }
        a.getByteFrequencyData(freq);
        a.getByteTimeDomainData(wave);
        const avg = (from, to) => { let s = 0; for (let i = from; i < to; i++) s += freq[i]; return s / (to - from) / 255; };
        feat.bass = avg(1, 10);
        feat.mid = avg(12, 80);
        feat.high = avg(120, 400);
        feat.level = avg(1, 400);
      } else {
        // following the clock: a gentle pulse at about 100 bpm
        const ph = (el.currentTime * 100) / 60;
        const k = playing ? Math.pow(1 - (ph % 1), 3) : 0;
        feat.bass = 0.25 + k * 0.5; feat.mid = 0.3 + 0.1 * Math.sin(ph); feat.high = 0.25; feat.level = playing ? 0.4 : 0.1;
      }
      feat.avgBass += (feat.bass - feat.avgBass) * 0.05;
      const isBeat = playing && feat.bass > 0.3 && feat.bass > feat.avgBass * 1.25 && now - feat.lastBeat > 230;
      if (isBeat) feat.lastBeat = now;
      feat.beat = Math.max(0, 1 - (now - feat.lastBeat) / 400);
    };

    const glow = (x, y, r, color, a) => {
      if (r <= 0 || a <= 0) return;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, color); gr.addColorStop(1, "rgba(0,0,0,0)");
      g.globalAlpha = Math.min(1, a); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.globalAlpha = 1;
    };
    const text = (s, x, y, size, color, { font = "Fraunces", italic = true, spacing = 0, alpha = 1, align = "center" } = {}) => {
      g.globalAlpha = alpha; g.fillStyle = color; g.textAlign = align; g.textBaseline = "middle";
      g.font = `${italic ? "italic " : ""}${size}px "${font}", Georgia, serif`;
      if ("letterSpacing" in g) g.letterSpacing = `${spacing}px`;
      g.fillText(s, x, y);
      if ("letterSpacing" in g) g.letterSpacing = "0px";
      g.globalAlpha = 1;
    };

    // the starfield, flying toward us at `speed`
    const starfield = (t, speed, a = 1) => {
      const cx = W / 2, cy = H / 2, m = Math.max(W, H);
      world.stars.forEach((s) => {
        s.z -= speed * 0.004;
        if (s.z <= 0.02) { s.z = 1; s.x = (Math.random() - 0.5) * 2; s.y = (Math.random() - 0.5) * 2; }
        const px = cx + (s.x / s.z) * m * 0.3, py = cy + (s.y / s.z) * m * 0.3;
        if (px < -10 || px > W + 10 || py < -10 || py > H + 10) return;
        const size = (1 - s.z) * 2.4 + 0.3;
        g.globalAlpha = a * (0.4 + 0.6 * Math.abs(Math.sin(t * 2 + s.tw)) * (0.5 + feat.high));
        g.fillStyle = "#EDEBFF";
        g.fillRect(px, py, size, size);
        if (speed > 2.5) { g.strokeStyle = "rgba(185,192,255,0.35)"; g.lineWidth = size * 0.6; g.beginPath(); g.moveTo(px, py); g.lineTo(cx + (px - cx) * 0.94, cy + (py - cy) * 0.94); g.stroke(); }
      });
      g.globalAlpha = 1;
    };

    // ── the six movements. k = progress through this movement 0..1 ──
    const S = [
      // I the void
      (t, k) => {
        starfield(t, 0.25 + feat.level, 1);
        const r = Math.min(W, H) * (0.01 + feat.bass * 0.03 + k * 0.02);
        glow(W / 2, H / 2, r * 12, "rgba(139,149,246,0.55)", 0.5 + feat.bass);
        glow(W / 2, H / 2, r * 3, "rgba(255,244,220,0.95)", 0.9);
        const titleA = Math.min(1, k * 4) * (1 - Math.max(0, (k - 0.6) / 0.4));
        text("13i", W / 2, H * 0.36, Math.min(W, H) * 0.06, "#EDEBFF", { alpha: titleA });
        text("APPREHENSION", W / 2, H * 0.66, Math.min(W, H) * 0.028, "#E9D29A", { font: "JetBrains Mono", italic: false, spacing: Math.min(W, H) * 0.012, alpha: titleA });
      },
      // II the night side
      (t, k) => {
        starfield(t, 0.2 + feat.level * 0.5, 0.8);
        const R = Math.max(W, H) * 0.9, cx = W / 2, cy = H + R * (0.62 - k * 0.12);
        const at = g.createRadialGradient(cx, cy, R * 0.98, cx, cy, R * 1.08);
        at.addColorStop(0, "rgba(90,140,255,0.5)"); at.addColorStop(1, "rgba(90,140,255,0)");
        g.fillStyle = at; g.beginPath(); g.arc(cx, cy, R * 1.08, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#03050f"; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
        // cities on the night side
        world.cities.forEach((c) => {
          const ang = -Math.PI / 2 + (c.a - Math.PI / 2) * 0.9 + t * 0.01;
          const rr = R * (0.995 - Math.abs(c.b) * 0.05);
          const x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr + c.b * R * 0.12;
          if (y > H + 5) return;
          const flick = 0.6 + 0.4 * Math.sin(t * 3 + c.s * 30);
          g.globalAlpha = (0.35 + 0.65 * c.s) * flick * (0.7 + feat.beat * 0.6);
          g.fillStyle = c.c; g.fillRect(x, y, 2.2, 2.2);
          if (c.s > 0.85) { g.globalAlpha *= 0.5; g.fillRect(x - 1.5, y - 1.5, 5, 5); }
        });
        g.globalAlpha = 1;
        // the wave passing over: rings from somewhere far above
        for (let i = 0; i < 4; i++) {
          const ph = ((t * 0.18 + i / 4) % 1);
          const rr = ph * Math.max(W, H) * 1.3;
          g.globalAlpha = (1 - ph) * 0.45 * (0.6 + feat.mid);
          g.strokeStyle = "#B9C0FF"; g.lineWidth = 1.5;
          g.beginPath(); g.arc(W * 0.5, -H * 0.4, rr, 0, Math.PI * 2); g.stroke();
        }
        g.globalAlpha = 1;
      },
      // III listening
      (t, k) => {
        const sky = g.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, "#02030c"); sky.addColorStop(1, "#0a1030");
        g.fillStyle = sky; g.fillRect(0, 0, W, H);
        starfield(t, 0.05, 0.6);
        // aurora ribbons, moved by the mids
        for (let r2 = 0; r2 < 3; r2++) {
          g.beginPath();
          for (let x = 0; x <= W; x += 8) {
            const y = H * (0.28 + r2 * 0.06) + Math.sin(x * 0.006 + t * (0.5 + r2 * 0.2) + r2) * H * 0.05 * (0.5 + feat.mid * 1.5);
            x ? g.lineTo(x, y) : g.moveTo(x, y);
          }
          g.strokeStyle = ["rgba(111,195,168,0.55)", "rgba(139,149,246,0.5)", "rgba(233,210,154,0.35)"][r2];
          g.lineWidth = H * 0.05 * (0.4 + feat.mid);
          g.globalAlpha = 0.4 + feat.mid * 0.5;
          g.stroke();
        }
        g.globalAlpha = 1;
        // ground and three dishes
        g.fillStyle = "#020208"; g.fillRect(0, H * 0.8, W, H * 0.2);
        [0.18, 0.5, 0.82].forEach((x, i) => {
          const bx = W * x, by = H * 0.8, s = Math.min(W, H) * (i === 1 ? 0.16 : 0.11);
          const tilt = -0.5 + Math.sin(t * 0.2 + i) * 0.15;
          g.save(); g.translate(bx, by - s * 0.8); g.rotate(tilt);
          g.fillStyle = "#05060f"; g.strokeStyle = "#3A3E75"; g.lineWidth = 2;
          g.beginPath(); g.ellipse(0, 0, s, s * 0.35, 0, Math.PI, 0); g.closePath(); g.fill(); g.stroke();
          g.beginPath(); g.moveTo(0, -s * 0.05); g.lineTo(0, -s * 0.7); g.stroke();
          glow(0, -s * 0.7, s * 0.25, "rgba(233,210,154,0.8)", feat.beat);
          g.restore();
          g.strokeStyle = "#05060f"; g.lineWidth = s * 0.12; g.beginPath(); g.moveTo(bx, by - s * 0.7); g.lineTo(bx, by); g.stroke();
        });
        // the scope: the song's own waveform
        const sw = Math.min(W * 0.62, 760), sh = H * 0.16, sx = (W - sw) / 2, sy = H * 0.47;
        g.fillStyle = "rgba(10,12,34,0.7)"; g.strokeStyle = "rgba(139,149,246,0.5)"; g.lineWidth = 1;
        g.fillRect(sx, sy, sw, sh); g.strokeRect(sx, sy, sw, sh);
        g.beginPath();
        for (let i = 0; i < 256; i++) {
          const v = wave ? (wave[Math.floor((i / 256) * wave.length)] - 128) / 128 : Math.sin(i * 0.2 + t * 6) * feat.bass * 0.6;
          const x = sx + (i / 255) * sw, y = sy + sh / 2 + v * sh * 0.45;
          i ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.strokeStyle = "#B9F0DA"; g.lineWidth = 2; g.shadowColor = "#6FC3A8"; g.shadowBlur = 12; g.stroke(); g.shadowBlur = 0;
        text("SIGNAL DETECTED", W / 2, sy - 16, 12, "#6FC3A8", { font: "JetBrains Mono", italic: false, spacing: 4, alpha: 0.3 + feat.beat * 0.7 });
        void k;
      },
      // IV the approach
      (t, k) => {
        g.fillStyle = "#02020a"; g.fillRect(0, 0, W, H);
        starfield(t, 1.5 + feat.level * 4 + k * 2, 0.9);
        const cx = W / 2 + Math.sin(t * 0.7) * W * 0.03, cy = H / 2 + Math.cos(t * 0.5) * H * 0.03;
        for (let i = 0; i < 18; i++) {
          const z = ((i / 18 - t * (0.25 + feat.level * 0.6)) % 1 + 1) % 1;
          const s = Math.pow(1 - z, 2.4) * Math.max(W, H) * 0.9 + 6;
          g.globalAlpha = Math.min(1, (1 - z) * 1.4) * (0.35 + feat.beat * 0.5);
          g.strokeStyle = i % 3 === 0 ? "#E9D29A" : i % 3 === 1 ? "#8B95F6" : "#C97B6E";
          g.lineWidth = 1 + (1 - z) * 3;
          g.beginPath(); g.ellipse(cx, cy, s, s * 0.62, t * 0.1 + i * 0.05, 0, Math.PI * 2); g.stroke();
        }
        g.globalAlpha = 1;
        glow(cx, cy, Math.min(W, H) * (0.08 + feat.bass * 0.1), "rgba(255,244,220,0.9)", 0.7 + feat.beat * 0.3);
        // glitch on the hardest beats
        if (feat.beat > 0.85) {
          for (let i = 0; i < 6; i++) {
            const y = Math.random() * H, h = 4 + Math.random() * 30, dx = (Math.random() - 0.5) * 50;
            g.drawImage(canvas, 0, y * dpr, W * dpr, h * dpr, dx, y, W, h);
          }
        }
      },
      // V the eye
      (t, k) => {
        g.fillStyle = "#03020c"; g.fillRect(0, 0, W, H);
        starfield(t, 0.15, 0.5);
        const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.3;
        glow(cx, cy, R * 2.6, "rgba(139,149,246,0.35)", 0.6 + feat.bass * 0.6);
        // glyph ring
        g.save(); g.translate(cx, cy); g.rotate(t * 0.08);
        for (let i = 0; i < 36; i++) {
          g.save(); g.rotate((i / 36) * Math.PI * 2); g.translate(0, -R * 1.45);
          text(world.glyphs[i % world.glyphs.length], 0, 0, R * 0.09, i % 2 ? "#B9C0FF" : "#E8CFC0", { font: "JetBrains Mono", italic: false, alpha: 0.35 + feat.high * 0.8 });
          g.restore();
        }
        g.restore();
        // rays on the beat
        for (let i = 0; i < 48; i++) {
          const a = (i / 48) * Math.PI * 2;
          const L = R * (1.1 + feat.beat * 0.4 + (i % 3) * 0.05);
          g.globalAlpha = 0.15 + feat.beat * 0.5;
          g.strokeStyle = "#E9D29A"; g.lineWidth = 1.2;
          g.beginPath(); g.moveTo(cx + Math.cos(a) * R * 1.02, cy + Math.sin(a) * R * 1.02); g.lineTo(cx + Math.cos(a) * L, cy + Math.sin(a) * L); g.stroke();
        }
        g.globalAlpha = 1;
        // the gold ring
        g.strokeStyle = "#E9D29A"; g.lineWidth = R * 0.07;
        g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
        // lids part over the first third of the movement
        const open = Math.min(1, k * 3);
        g.save();
        g.beginPath();
        const lh = R * 0.9 * (0.04 + open * 0.96);
        g.moveTo(cx - R * 0.95, cy); g.quadraticCurveTo(cx, cy - lh * 1.3, cx + R * 0.95, cy); g.quadraticCurveTo(cx, cy + lh * 1.3, cx - R * 0.95, cy);
        g.clip();
        g.fillStyle = "#07061A"; g.fillRect(cx - R, cy - R, R * 2, R * 2);
        const ir = R * 0.62;
        const iris = g.createRadialGradient(cx, cy, ir * 0.1, cx, cy, ir);
        iris.addColorStop(0, "#FFF4DC"); iris.addColorStop(0.3, "#E9D29A"); iris.addColorStop(0.7, "#7A5A8E"); iris.addColorStop(1, "#14112e");
        g.fillStyle = iris; g.beginPath(); g.arc(cx, cy, ir, 0, Math.PI * 2); g.fill();
        for (let i = 0; i < 120; i++) {
          const a = (i / 120) * Math.PI * 2 + t * 0.05;
          g.strokeStyle = i % 2 ? "rgba(255,240,205,0.25)" : "rgba(20,12,40,0.3)"; g.lineWidth = 1;
          g.beginPath(); g.moveTo(cx + Math.cos(a) * ir * 0.3, cy + Math.sin(a) * ir * 0.3); g.lineTo(cx + Math.cos(a) * ir * 0.95, cy + Math.sin(a) * ir * 0.95); g.stroke();
        }
        const pr = ir * (0.22 + feat.bass * 0.25);
        g.fillStyle = "#020108"; g.beginPath(); g.arc(cx, cy, pr, 0, Math.PI * 2); g.fill();
        glow(cx - pr * 0.6, cy - pr * 0.7, pr * 0.5, "rgba(255,255,255,0.7)", 0.8);
        g.restore();
      },
      // VI translated
      (t, k) => {
        g.fillStyle = "#03020c"; g.fillRect(0, 0, W, H);
        starfield(t, 0.1, 1 - k * 0.7);
        const a = Math.min(1, k * 3) * (1 - Math.max(0, (k - 0.75) / 0.25));
        glow(W / 2, H / 2, Math.min(W, H) * 0.3, "rgba(139,149,246,0.25)", a);
        text("a signal, translated", W / 2, H * 0.45, Math.min(W, H) * 0.05, "#EDEBFF", { alpha: a });
        text("13i  ·  APPREHENSION  ·  SIGNAL_Ø, TRACK 1", W / 2, H * 0.56, Math.min(W, H) * 0.018, "#C9B98F", { font: "JetBrains Mono", italic: false, spacing: 3, alpha: a });
        text("music: Paul Donaghy · Tempo Goat Studios", W / 2, H * 0.61, Math.min(W, H) * 0.016, "#6E76B8", { font: "JetBrains Mono", italic: false, spacing: 2, alpha: a * 0.8 });
      },
    ];

    const frame = (now) => {
      listen(now);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const t = now / 1000;
      const dur = el.duration && Number.isFinite(el.duration) ? el.duration : 240;
      const p = preview != null ? preview + ((now / 1000) % 1) * 0.0001 : el.ended ? 0.999 : Math.min(0.999, el.currentTime / dur);
      let i = SECTIONS.length - 1;
      while (i > 0 && p < SECTIONS[i].at) i--;
      const from = SECTIONS[i].at, to = i + 1 < SECTIONS.length ? SECTIONS[i + 1].at : 1;
      const k = (p - from) / (to - from);
      g.globalAlpha = 1;
      g.fillStyle = "#02020a"; g.fillRect(0, 0, W, H);
      S[i](t, k);
      // a short crossfade from the movement before
      const fadeIn = (p - from) * dur;
      if (i > 0 && fadeIn < 2.5) {
        g.globalAlpha = 1 - fadeIn / 2.5;
        g.fillStyle = "#02020a"; g.fillRect(0, 0, W, H);
        g.globalAlpha = 1;
      }
      // beat flash
      if (feat.beat > 0.9) { g.globalAlpha = 0.06; g.fillStyle = "#FFF4DC"; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
      // vignette
      const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.65)");
      g.fillStyle = v; g.fillRect(0, 0, W, H);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const onEnd = () => { setState("ended"); recorder.current && recorder.current.state === "recording" && recorder.current.stop(); };
    el.addEventListener("ended", onEnd);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); el.removeEventListener("ended", onEnd); };
  }, []);

  return (
    <div ref={wrapRef} className="av">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,500&family=JetBrains+Mono:wght@400&display=swap" />
      <canvas ref={canvasRef} className="av-canvas" onClick={() => (state === "playing" ? pause() : play())} />
      <audio
        ref={audioRef}
        src={`/api/track/${TRACK}.mp3?v=2`}
        preload="auto"
        onError={(e) => {
          if (direct.current) return;
          direct.current = true;
          const el = e.currentTarget;
          el.src = BASE + TRACK + ".mp3";
          el.load();
        }}
      />
      {state !== "playing" && state !== "preview" && (
        <div className="av-overlay">
          <div className="av-kicker">13i &middot; a music video</div>
          <h1 className="av-title">Apprehension</h1>
          <div className="av-sub">Signal_Ø &middot; track 1 &middot; best with the sound up, full screen</div>
          <button className="av-play" onClick={play}>{state === "ready" ? "▶ Play the video" : state === "ended" ? "▶ Watch again" : "▶ Resume"}</button>
          <div className="av-links">
            <button onClick={fullscreen}>full screen</button>
            <button onClick={record}>{recording ? "stop recording" : "save as a video file"}</button>
            <Link href="/music">&larr; back to The Music</Link>
          </div>
          {note && <div className="av-note">{note}</div>}
        </div>
      )}
      {state === "playing" && (
        <div className="av-bar">
          <button onClick={pause}>❚❚</button>
          <button onClick={fullscreen}>full screen</button>
          {recording && <span className="av-rec">● REC</span>}
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </div>
  );
}

const CSS = `
.av { position: fixed; inset: 0; background: #02020a; color: #EDEBFF; overflow: hidden; }
.av-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; cursor: pointer; }
.av-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; text-align: center; padding: 20px;
  background: radial-gradient(circle, rgba(2,2,10,0.35), rgba(2,2,10,0.85)); }
.av-kicker { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 4px; color: #E9D29A; text-transform: uppercase; }
.av-title { font-family: 'Fraunces', Georgia, serif; font-style: italic; font-weight: 500; font-size: clamp(48px, 10vw, 110px); margin: 0; text-shadow: 0 0 50px rgba(139,149,246,0.6); }
.av-sub { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #8A8FBF; letter-spacing: 1px; }
.av-play { margin-top: 18px; font-family: 'JetBrains Mono', monospace; font-size: 14px; letter-spacing: 2px; padding: 14px 30px; border-radius: 999px; border: none; cursor: pointer;
  background: linear-gradient(135deg, #E9D29A, #B9C0FF); color: #14163A; box-shadow: 0 0 40px rgba(233,210,154,0.35); }
.av-links { display: flex; gap: 18px; margin-top: 12px; flex-wrap: wrap; justify-content: center; }
.av-links button, .av-links a, .av-bar button { background: none; border: none; color: #8B95F6; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1.5px; cursor: pointer; text-decoration: none; }
.av-note { margin-top: 10px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #C9B98F; max-width: 460px; line-height: 1.6; }
.av-bar { position: absolute; left: 16px; bottom: 14px; display: flex; gap: 16px; align-items: center; opacity: 0.35; transition: opacity 0.3s; }
.av-bar:hover { opacity: 1; }
.av-rec { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #E06A50; letter-spacing: 2px; }
`;
