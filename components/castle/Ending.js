"use client";
// The last scene of the night. If the castle wins, the guards march the
// Black Knight and the Jester off in chains toward the gallows on the hill
// (we never see what happens there). If the darkness wins, the pair dance on
// the battlements with the Donaghy Cup.
import { useEffect, useRef, useState } from "react";
import { drawKnightFront } from "./knight";
import { playAnthem } from "../../lib/castle/sound";
import { castleMusic as music } from "../../lib/castle/music";

const hash = (x, y) => { let h = x * 374761393 + y * 668265263; h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967295; };

export function Ending({ result, crowd, onDone, myId = 0 }) {
  const ref = useRef(null);
  const [t, setT] = useState(0);
  const castle = result.winner === "castle";
  const bk = result.villains.find((v) => v.role === "blackknight");
  const jester = result.villains.find((v) => v.role === "jester");

  useEffect(() => {
    music.setMode("quiet");
    const stop = playAnthem(castle ? "castle" : "dark");
    return () => stop();
  }, [castle]);

  const crowdRef = useRef(crowd);
  crowdRef.current = crowd;
  useEffect(() => {
    const crowd = crowdRef.current;
    const cv = ref.current, g = cv.getContext("2d");
    let raf, lastQ = -1;
    const t0 = performance.now();
    const size = () => { const dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; };
    size();
    window.addEventListener("resize", size);
    const loop = (now) => {
      const time = (now - t0) / 1000;
      const w = cv.width, h = cv.height, s = Math.min(w / 1100, h / 650);
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (castle) drawMarch(g, w, h, s, time, crowd);
      else drawTriumph(g, w, h, s, time, crowd);
      const q = Math.floor(time * 4);
      if (q !== lastQ) { lastQ = q; setT(time); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", size); };
  }, [castle]);

  const names = [bk, jester].filter(Boolean).map((v) => (v.id === myId ? `${v.name} (you)` : v.name));
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", fontFamily: "Inter, system-ui, sans-serif" }}>
      <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", top: "5%", left: 0, right: 0, textAlign: "center", padding: "0 18px" }}>
        <div style={{ fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontSize: "clamp(28px, 5vw, 52px)", color: castle ? "#f2dc9a" : "#ff8a70", textShadow: "0 3px 14px #000" }}>
          {castle ? "Justice at Donaghy Castle" : "The Black Knight triumphs"}
        </div>
        <div style={{ color: "#efe6cc", fontSize: "clamp(14px, 2vw, 19px)", fontWeight: 600, marginTop: 8, textShadow: "0 2px 10px #000", maxWidth: 760, margin: "8px auto 0" }}>
          {castle
            ? `${names.join(" and ")}, in chains, are marched off to the gallows on the hill. They were never seen at Donaghy Castle again.`
            : `${names.join(" and ")} dance on the battlements with the Donaghy Cup, and the castle falls into darkness.`}
        </div>
      </div>
      {t > 5 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "5%", textAlign: "center" }}>
          <button onClick={onDone} style={{ background: "linear-gradient(135deg, #f2dc9a, #c9a227)", color: "#1b1406", border: 0, borderRadius: 999, padding: "11px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            Count the dominoes
          </button>
        </div>
      )}
    </div>
  );
}

function sky(g, w, h, a, b) {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, a); gr.addColorStop(1, b);
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(255,255,255,${0.2 + hash(i, 9) * 0.6})`; g.fillRect(hash(i, 4) * w, hash(i, 5) * h * 0.5, 1.6, 1.6); }
}

function drawMarch(g, w, h, s, t, crowd) {
  sky(g, w, h, "#070a1c", "#2a2440");
  g.fillStyle = "#f1ead2"; g.beginPath(); g.arc(w * 0.8, h * 0.18, 34 * s, 0, 7); g.fill();
  // the hill, the far gallows, the castle behind
  g.fillStyle = "#0c0d1a";
  g.fillRect(w * 0.02, h * 0.36, w * 0.3, h * 0.2); for (let i = 0; i < 9; i++) g.fillRect(w * 0.02 + i * w * 0.034, h * 0.33, w * 0.02, h * 0.03);
  g.fillRect(w * 0.06, h * 0.22, 60 * s, h * 0.16);
  g.fillStyle = "#141622"; g.beginPath(); g.moveTo(w * 0.45, h * 0.62); g.quadraticCurveTo(w * 0.78, h * 0.3, w * 1.05, h * 0.42); g.lineTo(w * 1.05, h * 0.7); g.closePath(); g.fill();
  g.strokeStyle = "#0a0a10"; g.lineWidth = 6 * s;
  g.beginPath(); g.moveTo(w * 0.86, h * 0.38); g.lineTo(w * 0.86, h * 0.26); g.lineTo(w * 0.92, h * 0.26); g.stroke();
  g.lineWidth = 4 * s; g.beginPath(); g.moveTo(w * 0.86, h * 0.3); g.lineTo(w * 0.88, h * 0.26); g.stroke();
  // the road
  g.fillStyle = "#3b3021"; g.fillRect(0, h * 0.62, w, h);
  g.fillStyle = "#4a3c28"; g.beginPath(); g.moveTo(0, h * 0.8); g.quadraticCurveTo(w * 0.6, h * 0.72, w * 1.05, h * 0.5); g.lineTo(w * 1.05, h * 0.6); g.quadraticCurveTo(w * 0.6, h * 0.82, 0, h * 0.92); g.fill();
  // the procession: guard, Black Knight, Jester, guard, moving up toward the hill
  const prog = Math.min(1, t / 9);
  const pos = (k) => { const u = Math.max(0, prog - k * 0.05); const x = w * (-0.1 + u * 0.95); const y = h * 0.84 - (x / w) * h * 0.26; return [x, y, 1 - u * 0.45]; };
  const order = [
    { look: { tabard: "#8a8f9a", trim: "#c9a227", helmet: "#c9ced8", helmetStyle: "kettle", emblem: "cross" } },
    { costume: "bk" }, { costume: "jester" },
    { look: { tabard: "#8a8f9a", trim: "#c9a227", helmet: "#c9ced8", helmetStyle: "kettle", emblem: "cross" } },
  ];
  const spots = order.map((_, i) => pos(i));
  // the chain between the prisoners
  g.strokeStyle = "#9a9aa8"; g.lineWidth = 2 * s; g.setLineDash([4 * s, 3 * s]);
  g.beginPath(); g.moveTo(spots[1][0], spots[1][1] - 30 * s * spots[1][2]); g.lineTo(spots[2][0], spots[2][1] - 30 * s * spots[2][2]); g.stroke(); g.setLineDash([]);
  order.forEach((p, i) => {
    const [x, y, k] = spots[i];
    const bob = Math.abs(Math.sin(t * 5 + i)) * 4 * s;
    g.save(); g.translate(x, y - bob); g.scale(s * 1.4 * k, s * 1.4 * k);
    drawKnightFront(g, p.look || {}, { costume: p.costume || null });
    if (!p.costume) { g.strokeStyle = "#7a5a32"; g.lineWidth = 3; g.beginPath(); g.moveTo(18, 10); g.lineTo(18, -70); g.stroke(); g.fillStyle = "#c9ced8"; g.beginPath(); g.moveTo(18, -82); g.lineTo(26, -66); g.lineTo(18, -62); g.fill(); }
    g.restore();
  });
  // the castle folk, cheering with torches
  crowd.forEach((c, i) => {
    const x = w * (0.06 + (i / Math.max(1, crowd.length - 1)) * 0.5), y = h * 0.97;
    const jump = Math.abs(Math.sin(t * 6 + i)) * 8 * s;
    g.save(); g.translate(x, y - jump); g.scale(s * 1.7, s * 1.7); drawKnightFront(g, c.look, { cheer: 1 }); g.restore();
    const fx = x + 26 * s, fy = y - 110 * s - jump, f = 1 + Math.sin(t * 14 + i) * 0.15;
    const gr = g.createRadialGradient(fx, fy, 0, fx, fy, 40 * s); gr.addColorStop(0, "rgba(255,190,90,0.5)"); gr.addColorStop(1, "rgba(255,150,60,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(fx, fy, 40 * s, 0, 7); g.fill();
    g.fillStyle = "#ffcf6a"; g.beginPath(); g.ellipse(fx, fy, 5 * s, 10 * s * f, 0, 0, 7); g.fill();
  });
  if (t > 9) { g.fillStyle = `rgba(0,0,0,${Math.min(0.6, (t - 9) * 0.3)})`; g.fillRect(0, 0, w, h); }
}

function drawTriumph(g, w, h, s, t, crowd) {
  sky(g, w, h, "#12030a", "#3a0c18");
  // red fireworks
  for (let k = 0; k < 4; k++) {
    const p = (t * 0.6 + k * 0.27) % 1, cx = w * (0.15 + k * 0.23), cy = h * (0.18 + (k % 2) * 0.1);
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2, r = p * 110 * s;
      g.fillStyle = `rgba(${k % 2 ? 255 : 233},${k % 2 ? 80 : 198},${k % 2 ? 60 : 74},${1 - p})`;
      g.beginPath(); g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r + p * p * 40 * s, 3 * s, 0, 7); g.fill();
    }
  }
  // battlements
  const top = h * 0.58;
  g.fillStyle = "#0e0c14"; g.fillRect(0, top, w, h);
  for (let i = 0; i < 16; i++) g.fillRect(i * (w / 16), top - 30 * s, (w / 16) * 0.6, 30 * s);
  // the black banner with the red eye
  g.fillStyle = "#4a2e14"; g.fillRect(w * 0.5 - 2 * s, top - 260 * s, 4 * s, 260 * s);
  const wave = Math.sin(t * 4) * 8 * s;
  g.fillStyle = "#0a0a0e"; g.beginPath(); g.moveTo(w * 0.5, top - 258 * s); g.quadraticCurveTo(w * 0.5 + 70 * s, top - 250 * s + wave, w * 0.5 + 140 * s, top - 258 * s); g.lineTo(w * 0.5 + 140 * s, top - 170 * s); g.quadraticCurveTo(w * 0.5 + 70 * s, top - 178 * s + wave, w * 0.5, top - 170 * s); g.fill();
  g.fillStyle = "#c0102e"; g.beginPath(); g.ellipse(w * 0.5 + 70 * s, top - 214 * s + wave * 0.5, 24 * s, 12 * s, 0, 0, 7); g.fill();
  g.fillStyle = "#000"; g.beginPath(); g.arc(w * 0.5 + 70 * s, top - 214 * s + wave * 0.5, 6 * s, 0, 7); g.fill();
  // the pair, dancing, the Cup held high
  [["bk", w * 0.36], ["jester", w * 0.64]].forEach(([costume, x], i) => {
    const hop = Math.abs(Math.sin(t * 6 + i * 1.5)) * 22 * s;
    g.save(); g.translate(x, top - 30 * s - hop); g.rotate(Math.sin(t * 6 + i) * 0.12); g.scale(s * 2.4, s * 2.4);
    drawKnightFront(g, {}, { costume, cheer: 1 });
    if (i === 0) {
      g.fillStyle = "#e9c64a";
      g.beginPath(); g.moveTo(-24, -76); g.quadraticCurveTo(-24, -62, -16, -60); g.quadraticCurveTo(-8, -62, -8, -76); g.closePath(); g.fill();
      g.fillRect(-17.5, -60, 3, 6); g.fillRect(-21, -54, 10, 3);
    }
    g.restore();
  });
  // the captured castle folk, glum below
  crowd.forEach((c, i) => {
    const x = w * (0.08 + (i / Math.max(1, crowd.length - 1)) * 0.84), y = h * 0.98;
    g.save(); g.translate(x, y); g.scale(s * 1.3, s * 1.3); g.globalAlpha = 0.75; drawKnightFront(g, c.look, { cheer: 0 }); g.restore();
    g.globalAlpha = 1;
  });
}
