"use client";

import { useEffect, useRef } from "react";
import { makeVarrow } from "../lib/rave/painted/varrow";

// The Wish Engine's cabinet (Update 6.19), drawn live: a tall carved-wood and
// brass fortune cabinet with depth (its sides turn a little as you move), a
// marquee of chasing bulbs, an arched window of old curved glass, and inside
// it Varrow - the painted Varrow from the Rave - between velvet curtains, lit
// by a lamp, dust drifting in the light. Below: a brass token mechanism you
// see the token go into, a gauge that swings while Varrow reads you, and the
// mouth the answer card comes out of.
// Units: 600 wide, 880 tall. phase: idle, coin, waking, speaking, printing, done.

const UW = 600, UH = 880;
const TAU = Math.PI * 2;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
const rnd = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// the cabinet's wood: a dark mahogany grain, made once
let GRAIN = null;
function grain() {
  if (GRAIN || typeof document === "undefined") return GRAIN;
  const c = document.createElement("canvas"); c.width = 256; c.height = 512;
  const g = c.getContext("2d");
  const bg = g.createLinearGradient(0, 0, 256, 0);
  bg.addColorStop(0, "#2A130A"); bg.addColorStop(0.5, "#3C1D0F"); bg.addColorStop(1, "#28120A");
  g.fillStyle = bg; g.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 90; i++) {
    const x0 = rnd(i) * 256, w = 0.4 + rnd(i + 9) * 1.6;
    g.strokeStyle = rnd(i + 3) < 0.5 ? `rgba(14,5,2,${0.25 + rnd(i + 4) * 0.35})` : `rgba(110,58,30,${0.12 + rnd(i + 5) * 0.2})`;
    g.lineWidth = w; g.beginPath();
    for (let y = 0; y <= 512; y += 16) { const x = x0 + Math.sin(y * 0.012 + i) * 6 + Math.sin(y * 0.05 + i * 2) * 1.5; y ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
  // a few knots
  for (let k = 0; k < 3; k++) { const x = 40 + rnd(k + 70) * 180, y = 60 + rnd(k + 80) * 400; for (let r = 2; r < 14; r += 2.5) { g.strokeStyle = `rgba(12,4,2,${0.4 - r * 0.02})`; g.lineWidth = 0.8; g.beginPath(); g.ellipse(x, y, r * 0.6, r * 1.6, 0, 0, TAU); g.stroke(); } }
  GRAIN = c;
  return c;
}
function wood(g, path, x0, y0, tint = 1) {
  const gr = grain();
  g.save(); g.clip(path);
  if (gr) { const pat = g.createPattern(gr, "repeat"); pat.setTransform && pat.setTransform(new DOMMatrix().translate(x0, y0)); g.fillStyle = pat; } else g.fillStyle = "#3A1C0E";
  g.fill(path);
  if (tint !== 1) { g.fillStyle = tint < 1 ? `rgba(0,0,0,${1 - tint})` : `rgba(255,190,120,${(tint - 1) * 0.5})`; g.fill(path); }
  g.restore();
}
function brass(g, x0, y0, x1, y1) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, "#5A3A12"); gr.addColorStop(0.25, "#E9C877"); gr.addColorStop(0.45, "#FFF1C4"); gr.addColorStop(0.6, "#C99A45"); gr.addColorStop(1, "#4A2E0C");
  return gr;
}
function glow(g, x, y, r, col, a) {
  if (a <= 0.001) return;
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, col); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = Math.min(1, a); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
}
// a carved scroll: a groove cut into the wood, lit from above
function carve(g, draw, w = 3) {
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = "rgba(255,200,140,0.18)"; g.lineWidth = w; g.translate(0, 1.2); draw(); g.stroke();
  g.translate(0, -2.2); g.strokeStyle = "rgba(0,0,0,0.6)"; draw(); g.stroke();
  g.restore();
}

// where things are on the cabinet (front face, before the turn)
const WIN = { x0: 118, x1: 482, y0: 196, y1: 572 };   // the window (arched top)
const SLOT = { x: 444, y: 684 };                        // the token slot
const CARD = { x: 300, y: 790 };                        // the card mouth

export default function WishCabinet({ phase, phaseAt, onReady }) {
  const ref = useRef(null);
  const live = useRef({ phase, phaseAt });
  live.current = { phase, phaseAt };
  useEffect(() => {
    const c = ref.current, g = c.getContext("2d");
    let raf = 0, VAR = null, tried = false;
    const st = { mx: 0, my: 0, tx: 0, ty: 0, lamp: 0.25, lids: 0.95, ridges: 0, orb: 0.15, wake: 0, gauge: -0.9 };
    const onMove = (e) => {
      const r = c.getBoundingClientRect();
      st.tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
      st.ty = clamp(((e.clientY - r.top) / r.height - 0.4) * 2, -1, 1);
    };
    window.addEventListener("pointermove", onMove);
    const motes = Array.from({ length: 46 }, (_, i) => ({ x: rnd(i), y: rnd(i + 40), s: 0.4 + rnd(i + 80) * 1.2, v: 0.2 + rnd(i + 120) * 0.6 }));

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const W = c.clientWidth, H = c.clientHeight;
      if (!W) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
      if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; }
      const k = cw / UW;
      const t = now / 1000;
      const { phase: ph, phaseAt } = live.current;
      const since = (now - (phaseAt || 0)) / 1000;
      const awake = ph === "waking" || ph === "speaking" || ph === "printing";
      // ease the state toward the phase
      st.mx += (st.tx - st.mx) * 0.06; st.my += (st.ty - st.my) * 0.06;
      const want = { lamp: ph === "idle" ? 0.3 : ph === "coin" ? 0.55 : awake ? 1 : 0.7, lids: ph === "idle" ? 0.95 : ph === "coin" ? 0.75 : ph === "done" ? 0.3 : 0.08, ridges: awake ? 1 : ph === "done" ? 0.35 : 0, orb: ph === "idle" ? 0.15 : awake ? 1 : 0.45, gauge: ph === "speaking" ? Math.sin(t * 2.3) * 0.5 + Math.sin(t * 5.1) * 0.25 : ph === "printing" || ph === "done" ? 0.75 : -0.9 };
      for (const key of ["lamp", "lids", "ridges", "orb"]) st[key] += (want[key] - st[key]) * (key === "lids" ? 0.08 : 0.05);
      st.gauge += (want.gauge - st.gauge) * 0.08;
      // a flicker as the lamp comes on
      const flick = ph === "coin" || (ph === "waking" && since < 1.2) ? (rnd(Math.floor(t * 18)) < 0.35 ? 0.4 : 1) : 1;
      const lamp = st.lamp * flick;

      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, cw, ch);
      g.setTransform(k, 0, 0, k, 0, 0);

      // ── the turn: the sides show more or less as you move ──
      const turn = st.mx * 0.55;
      const sideL = 34 * (1 + turn), sideR = 34 * (1 - turn);
      const shift = -turn * 10;
      // floor shadow
      const fs = g.createRadialGradient(300, 870, 10, 300, 870, 300);
      fs.addColorStop(0, "rgba(0,0,0,0.7)"); fs.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = fs; g.fillRect(0, 780, UW, 100);
      glow(g, 300, 400, 380, "rgba(140,90,200,0.35)", 0.35 + lamp * 0.25);

      g.save(); g.translate(shift, 0);
      const FX0 = 70, FX1 = 530;     // the front face
      // side panels (in perspective: they narrow and darken as they go back)
      const side = (s) => {
        const x = s < 0 ? FX0 : FX1, w = s < 0 ? sideL : sideR;
        const p = new Path2D();
        p.moveTo(x, 150); p.lineTo(x + s * w, 170); p.lineTo(x + s * w, 840); p.lineTo(x, 858); p.closePath();
        wood(g, p, x, 0, 0.55);
        const sh = g.createLinearGradient(x, 0, x + s * w, 0);
        sh.addColorStop(0, "rgba(0,0,0,0.1)"); sh.addColorStop(1, "rgba(0,0,0,0.6)");
        g.fillStyle = sh; g.fill(p);
        g.strokeStyle = "rgba(233,200,119,0.35)"; g.lineWidth = 1.2; g.stroke(p);
      };
      side(-1); side(1);

      // ── the crest and marquee ──
      const crest = new Path2D();
      crest.moveTo(FX0, 196); crest.lineTo(FX0, 120); crest.quadraticCurveTo(FX0 + 10, 40, 300, 22); crest.quadraticCurveTo(FX1 - 10, 40, FX1, 120); crest.lineTo(FX1, 196); crest.closePath();
      wood(g, crest, FX0, 0, 0.9);
      // the marquee panel
      const mq = new Path2D(); mq.moveTo(108, 168); mq.lineTo(108, 112); mq.quadraticCurveTo(120, 64, 300, 54); mq.quadraticCurveTo(480, 64, 492, 112); mq.lineTo(492, 168); mq.closePath();
      const mqg = g.createLinearGradient(0, 54, 0, 168); mqg.addColorStop(0, "#2A1306"); mqg.addColorStop(1, "#120804");
      g.fillStyle = mqg; g.fill(mq);
      g.strokeStyle = brass(g, 108, 54, 492, 168); g.lineWidth = 5; g.stroke(mq);
      // the name, in warm neon, humming
      const hum = 0.85 + 0.15 * Math.sin(t * 7) * Math.sin(t * 3.1) + (rnd(Math.floor(t * 9)) < 0.04 ? -0.5 : 0);
      g.save(); g.textAlign = "center"; g.textBaseline = "middle";
      g.font = "italic 400 52px Fraunces, Georgia, serif";
      g.shadowColor = `rgba(255,190,100,${0.9 * hum})`; g.shadowBlur = 24;
      g.fillStyle = `rgba(255,231,176,${0.4 + 0.6 * hum})`;
      g.fillText("Ask Varrow", 300, 116);
      g.shadowBlur = 0;
      g.font = "500 11px 'JetBrains Mono', monospace";
      g.fillStyle = "rgba(200,170,110,0.85)";
      g.fillText("ONE TOKEN  ·  ONE ANSWER  ·  NO REFUNDS ACROSS THE VOID", 300, 152);
      g.restore();
      // bulbs round the arch, chasing (faster once it's awake)
      const nb = 24, speed = awake || ph === "coin" ? 9 : 2.5;
      for (let i = 0; i < nb; i++) {
        const u = i / (nb - 1);
        const bx = lerp(92, 508, u), by = 120 - Math.sin(u * Math.PI) * 88 + (u < 0.06 || u > 0.94 ? 30 : 0);
        const on = ((Math.floor(t * speed) - i) % 3 + 3) % 3 === 0 ? 1 : 0.28;
        g.fillStyle = `rgba(255,${200 + on * 40},${120 + on * 60},${0.5 + 0.5 * on})`;
        g.beginPath(); g.arc(bx, by, 4.2, 0, TAU); g.fill();
        g.strokeStyle = "#5A3A12"; g.lineWidth = 1.2; g.stroke();
        glow(g, bx, by, 16, "rgba(255,200,110,0.9)", on * 0.55);
      }
      // carved scrolls under the marquee
      carve(g, () => { g.beginPath(); g.moveTo(90, 184); g.bezierCurveTo(130, 170, 170, 196, 210, 184); g.moveTo(510, 184); g.bezierCurveTo(470, 170, 430, 196, 390, 184); });
      // the finial: a brass ring-eye, the 13i mark
      g.strokeStyle = brass(g, 284, 2, 316, 36); g.lineWidth = 3;
      g.beginPath(); g.arc(300, 14, 10, 0, TAU); g.stroke();
      g.fillStyle = "#FFE7B0"; g.beginPath(); g.arc(300, 14, 3.2, 0, TAU); g.fill();
      glow(g, 300, 14, 20, "rgba(255,210,130,0.9)", 0.3 + lamp * 0.3);

      // ── the body of the cabinet ──
      const body = new Path2D(); body.rect(FX0, 196, FX1 - FX0, 662);
      wood(g, body, FX0, 0, 1);
      // panels and pilasters, carved
      [[FX0 + 8, FX0 + 36], [FX1 - 36, FX1 - 8]].forEach(([a, b]) => {
        const p = new Path2D(); p.rect(a, 206, b - a, 640);
        const pg = g.createLinearGradient(a, 0, b, 0); pg.addColorStop(0, "rgba(0,0,0,0.35)"); pg.addColorStop(0.5, "rgba(255,190,130,0.08)"); pg.addColorStop(1, "rgba(0,0,0,0.4)");
        g.fillStyle = pg; g.fill(p);
        for (let y = 230; y < 830; y += 34) carve(g, () => { g.beginPath(); g.moveTo((a + b) / 2, y); g.quadraticCurveTo(a + 4, y + 10, (a + b) / 2, y + 20); g.quadraticCurveTo(b - 4, y + 10, (a + b) / 2, y); }, 1.6);
        g.fillStyle = brass(g, a, 0, b, 0); g.fillRect(a - 2, 200, b - a + 4, 6); g.fillRect(a - 2, 842, b - a + 4, 6);
      });

      // ── the window ──
      const win = new Path2D();
      win.moveTo(WIN.x0, WIN.y1); win.lineTo(WIN.x0, 300); win.quadraticCurveTo(WIN.x0, WIN.y0, 300, WIN.y0); win.quadraticCurveTo(WIN.x1, WIN.y0, WIN.x1, 300); win.lineTo(WIN.x1, WIN.y1); win.closePath();
      g.save(); g.clip(win);
      // inside: a dark booth, velvet curtains, the lamp's light from above
      const inner = g.createLinearGradient(0, WIN.y0, 0, WIN.y1);
      inner.addColorStop(0, "#0E0718"); inner.addColorStop(1, "#05030A");
      g.fillStyle = inner; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
      // the back wall: a faded star chart
      g.save(); g.globalAlpha = 0.25 + lamp * 0.25;
      for (let i = 0; i < 40; i++) { const sx = lerp(WIN.x0, WIN.x1, rnd(i + 200)), sy = lerp(WIN.y0, WIN.y1 - 80, rnd(i + 300)); g.fillStyle = "#B9C0FF"; g.fillRect(sx, sy, 1.2, 1.2); }
      g.strokeStyle = "rgba(233,210,154,0.25)"; g.lineWidth = 0.8;
      g.beginPath(); g.arc(300, 330, 120, 0, TAU); g.stroke(); g.beginPath(); g.arc(300, 330, 80, 0, TAU); g.stroke();
      for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; g.beginPath(); g.moveTo(300 + Math.cos(a) * 80, 330 + Math.sin(a) * 80); g.lineTo(300 + Math.cos(a) * 128, 330 + Math.sin(a) * 128); g.stroke(); }
      g.restore();
      // the curtains, drawn back each side, swaying a little
      [-1, 1].forEach((s) => {
        const x0 = s < 0 ? WIN.x0 - 10 : WIN.x1 + 10, x1 = 300 + s * 112 + Math.sin(t * 0.6 + s) * 3;
        const cp = new Path2D();
        cp.moveTo(x0, WIN.y0 - 10); cp.lineTo(300 + s * 60, WIN.y0 - 10);
        cp.quadraticCurveTo(x1 - s * 10, 330, x1 + s * 18, WIN.y1 + 10); cp.lineTo(x0, WIN.y1 + 10); cp.closePath();
        const cg = g.createLinearGradient(x0, 0, x1, 0);
        for (let f = 0; f <= 8; f++) cg.addColorStop(f / 8, f % 2 ? `rgba(${70 + lamp * 40},10,${40 + lamp * 20},1)` : "rgba(26,3,16,1)");
        g.fillStyle = cg; g.fill(cp);
        // the lamp's sheen on the velvet
        const sh = g.createLinearGradient(0, WIN.y0, 0, WIN.y1);
        sh.addColorStop(0, `rgba(255,170,120,${0.18 * lamp})`); sh.addColorStop(0.6, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,0.5)");
        g.fillStyle = sh; g.fill(cp);
        // a gold tasselled tie-back
        const ty = 420 + Math.sin(t * 0.6 + s) * 2, tx = lerp(x0, x1, 0.55);
        g.strokeStyle = "#C99A45"; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, ty - 8); g.quadraticCurveTo(tx, ty + 6, x1 + s * 6, ty); g.stroke();
        g.fillStyle = brass(g, tx - 6, ty, tx + 6, ty + 26); g.beginPath(); g.moveTo(tx - 3, ty + 2); g.lineTo(tx + 3, ty + 2); g.lineTo(tx + 6, ty + 26); g.lineTo(tx - 6, ty + 26); g.closePath(); g.fill();
      });
      // Varrow
      if (!tried) { tried = true; try { VAR = makeVarrow(); } catch (e) { VAR = null; } onReady && onReady(!!VAR); }
      const look = [st.mx * 6, st.my * 3 + (ph === "printing" ? 3 : 0)];
      const sp = ph === "speaking";
      const circle = awake ? t * (ph === "printing" ? 5 : 3) : 0;
      const orbY = 340 + Math.sin(t * 1.2) * (awake ? 4 : 1.5) - st.wake * 10;
      const hr = awake ? 34 : 0;
      const pose = {
        lift: 0, lean: 0, sx: Math.sin(t * 0.5) * 2, sy: 1, hem: Math.sin(t * 0.7) * 3,
        headY: Math.sin(t * (sp ? 6 : 0.8)) * (sp ? 3 : 4) + (ph === "idle" ? 6 : 0), head: Math.sin(t * 0.45) * 0.05 + (sp ? Math.sin(t * 3.1) * 0.04 : 0) + (ph === "idle" ? 0.08 : 0),
        look, lids: [clamp(st.lids + (rnd(Math.floor(t / 4.3)) < 0.5 && (t % 4.3) < 0.14 ? 1 : 0), 0, 1), clamp(st.lids + ((t % 5.1) < 0.12 ? 1 : 0), 0, 1)],
        ridges: st.ridges * (sp ? 0.7 + 0.3 * Math.sin(t * 9) : 1), tendril: sp ? Math.sin(t * 7) * 1.2 : Math.sin(t * 0.9) * 0.5,
        hL: [150 - Math.cos(circle) * hr - (awake ? 10 : 0), orbY + 4 + Math.sin(circle) * hr * 0.5], hR: [210 + Math.cos(circle) * hr + (awake ? 10 : 0), orbY + 4 - Math.sin(circle) * hr * 0.5],
        orb: [180, orbY], orbGlow: st.orb * (0.8 + 0.2 * Math.sin(t * 4)), feet: [0, 0],
      };
      const m = { t, B: t * 0.9, ph: (t * 0.9) % 1, bass: awake ? 0.35 + 0.25 * Math.sin(t * 6) : 0.05, amp: 0.05, e: 0.1, pal: { a: 45, b: 285 }, level: 0.2, high: 0.1 };
      g.save(); g.translate(300, 205 + 520 * 0.82); g.scale(0.82, 0.82);
      if (VAR) { try { VAR(g, pose, m); } catch (e) { VAR = null; } }
      g.restore();
      // the lamp's light pooling on it, the shadow below
      glow(g, 300, WIN.y0 + 30, 260, "rgba(255,180,110,0.8)", 0.2 * lamp);
      const dk = g.createLinearGradient(0, WIN.y0, 0, WIN.y1);
      dk.addColorStop(0, `rgba(0,0,0,${0.45 - lamp * 0.4})`); dk.addColorStop(1, `rgba(0,0,0,${0.62 - lamp * 0.32})`);
      g.fillStyle = dk; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
      // dust in the lamp's beam
      g.save(); g.globalCompositeOperation = "lighter";
      motes.forEach((d, i) => {
        const y = WIN.y0 + ((d.y + t * 0.012 * d.v) % 1) * (WIN.y1 - WIN.y0);
        const x = 300 + (d.x - 0.5) * 220 * (0.4 + (y - WIN.y0) / (WIN.y1 - WIN.y0)) + Math.sin(t * 0.4 + i) * 6;
        const a = (0.25 + 0.5 * lamp) * (0.4 + 0.6 * Math.sin(t * (1 + d.v) + i) ** 2);
        g.fillStyle = `rgba(255,220,170,${a * 0.6})`; g.fillRect(x, y, d.s, d.s);
      });
      g.restore();
      g.restore(); // window clip

      // the glass: curved, old; the room reflected in it, moving as you do
      g.save(); g.clip(win);
      const rx = 170 - st.mx * 40;
      const rg = g.createLinearGradient(rx, WIN.y0, rx + 120, WIN.y1);
      rg.addColorStop(0, "rgba(255,255,255,0)"); rg.addColorStop(0.45, "rgba(255,255,255,0.10)"); rg.addColorStop(0.55, "rgba(255,255,255,0.03)"); rg.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = rg; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
      g.fillStyle = "rgba(255,255,255,0.05)"; g.beginPath(); g.ellipse(410 - st.mx * 20, 260, 26, 60, -0.4, 0, TAU); g.fill();
      const vg = g.createRadialGradient(300, 380, 120, 300, 380, 300);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.55)");
      g.fillStyle = vg; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
      // smudges
      [[180, 470, 18], [420, 520, 14], [250, 250, 10]].forEach(([x, y, r]) => { g.fillStyle = "rgba(255,255,255,0.025)"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); });
      g.restore();
      // the window's brass frame
      g.lineWidth = 9; g.strokeStyle = brass(g, WIN.x0, WIN.y0, WIN.x1, WIN.y1); g.stroke(win);
      // rivets round it
      for (let i = 0; i < 18; i++) {
        const u = i / 17; let x, y;
        if (u < 0.2) { x = WIN.x0; y = lerp(WIN.y1, 300, u / 0.2); } else if (u > 0.8) { x = WIN.x1; y = lerp(300, WIN.y1, (u - 0.8) / 0.2); }
        else { const a = Math.PI + ((u - 0.2) / 0.6) * Math.PI; x = 300 + Math.cos(a) * (WIN.x1 - 300); y = 300 + Math.sin(a) * (300 - WIN.y0); }
        g.fillStyle = "#FFE7B0"; g.beginPath(); g.arc(x, y, 2, 0, TAU); g.fill();
      }

      // ── the counter under the window: a ledge with a brass rail ──
      const ledge = new Path2D(); ledge.moveTo(FX0 - 14, 584); ledge.lineTo(FX1 + 14, 584); ledge.lineTo(FX1 + 4, 606); ledge.lineTo(FX0 - 4, 606); ledge.closePath();
      wood(g, ledge, FX0, 584, 1.25);
      g.fillStyle = brass(g, 0, 578, 0, 586); g.fillRect(FX0 - 14, 578, FX1 - FX0 + 28, 6);
      g.fillStyle = "rgba(0,0,0,0.55)"; g.fillRect(FX0 - 4, 606, FX1 - FX0 + 8, 8);

      // ── the lower panel ──
      // a gauge: how sure Varrow is
      const gx = 172, gy = 690;
      g.fillStyle = brass(g, gx - 52, gy - 52, gx + 52, gy + 52); g.beginPath(); g.arc(gx, gy, 52, 0, TAU); g.fill();
      const face = g.createRadialGradient(gx - 10, gy - 14, 4, gx, gy, 44); face.addColorStop(0, "#F7EBCB"); face.addColorStop(1, "#BFA470");
      g.fillStyle = face; g.beginPath(); g.arc(gx, gy, 44, 0, TAU); g.fill();
      g.strokeStyle = "#3A2410"; g.lineWidth = 1;
      for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.8 + (i / 12) * 1.4); g.beginPath(); g.moveTo(gx + Math.cos(a) * 34, gy + Math.sin(a) * 34); g.lineTo(gx + Math.cos(a) * (i % 3 ? 39 : 42), gy + Math.sin(a) * (i % 3 ? 39 : 42)); g.stroke(); }
      g.save(); g.textAlign = "center"; g.fillStyle = "#3A2410"; g.font = "500 7.5px 'JetBrains Mono', monospace"; g.fillText("CERTAINTY", gx, gy + 22); g.restore();
      const na = Math.PI * 1.5 + clamp(st.gauge, -1, 1) * 0.7 * Math.PI * 0.5 * 1.4;
      g.strokeStyle = "#7A1010"; g.lineWidth = 2; g.lineCap = "round"; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + Math.cos(na) * 34, gy + Math.sin(na) * 34); g.stroke();
      g.fillStyle = "#3A2410"; g.beginPath(); g.arc(gx, gy, 4, 0, TAU); g.fill();
      g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.ellipse(gx - 14, gy - 18, 18, 9, -0.5, 0, TAU); g.fill();
      // a carved panel in the middle with Varrow's marks
      const mid = new Path2D(); mid.rect(234, 640, 132, 110);
      g.fillStyle = "rgba(0,0,0,0.3)"; g.fill(mid); g.strokeStyle = brass(g, 234, 640, 366, 750); g.lineWidth = 2.5; g.stroke(mid);
      carve(g, () => { g.beginPath(); g.ellipse(300, 694, 44, 40, 0, 0, TAU); g.moveTo(300, 656); g.lineTo(300, 732); g.moveTo(262, 694); g.lineTo(338, 694); }, 2);
      g.fillStyle = `rgba(127,240,224,${0.15 + (awake ? 0.5 + 0.3 * Math.sin(t * 6) : 0)})`; g.beginPath(); g.arc(300, 694, 6, 0, TAU); g.fill();
      glow(g, 300, 694, 30, "rgba(127,240,224,0.9)", awake ? 0.5 : 0.08);
      // the token mechanism: a brass plate, the slot, the words
      const pl = new Path2D(); pl.moveTo(396, 628); pl.lineTo(492, 628); pl.lineTo(492, 742); pl.quadraticCurveTo(444, 760, 396, 742); pl.closePath();
      g.fillStyle = brass(g, 396, 628, 492, 760); g.fill(pl); g.strokeStyle = "#3A2410"; g.lineWidth = 1.2; g.stroke(pl);
      g.save(); g.textAlign = "center"; g.fillStyle = "#3A2410"; g.font = "600 8px 'JetBrains Mono', monospace";
      g.fillText("GRAVITY", SLOT.x, 644); g.fillText("TOKEN", SLOT.x, 655);
      g.font = "500 7px 'JetBrains Mono', monospace"; g.fillText("ONE ONLY", SLOT.x, 726);
      g.restore();
      // the slot (glowing when a token goes in)
      const slotGlow = ph === "coin" ? Math.max(0, 1 - Math.abs(since - 0.5) * 2.2) : 0;
      g.fillStyle = "#080402"; g.beginPath(); g.roundRect ? g.roundRect(SLOT.x - 4, SLOT.y - 22, 8, 40, 4) : g.rect(SLOT.x - 4, SLOT.y - 22, 8, 40); g.fill();
      g.strokeStyle = "rgba(0,0,0,0.7)"; g.lineWidth = 2; g.stroke();
      glow(g, SLOT.x, SLOT.y, 30, "rgba(255,220,140,0.95)", slotGlow * 0.9);
      // the token going in: it comes up from below, turning, and slides into the slot
      if (ph === "coin" && since < 0.8) {
        const k1 = clamp(since / 0.42, 0, 1), k2 = clamp((since - 0.42) / 0.3, 0, 1);
        const e1 = 1 - Math.pow(1 - k1, 3);
        const tx = lerp(SLOT.x - 70, SLOT.x, e1); let ty = lerp(900, SLOT.y, e1) - Math.sin(e1 * Math.PI) * 60;
        const spin = since * 26;
        const rxk = Math.abs(Math.cos(spin)) * (1 - k1) + k1 * 0.18;   // flat, then edge-on to the slot
        const fade = 1 - k2;
        ty += k2 * 2;
        g.save(); g.globalAlpha = fade;
        const r = 15;
        const tg = g.createRadialGradient(tx - r * 0.3 * rxk, ty - r * 0.3, 1, tx, ty, r);
        tg.addColorStop(0, "#FFFFFF"); tg.addColorStop(0.3, "#E9D29A"); tg.addColorStop(0.8, "#8B5FBF"); tg.addColorStop(1, "#2A1A48");
        const rr = r * (1 - k2 * 0.35);
        g.fillStyle = tg; g.beginPath(); g.ellipse(tx, ty, Math.max(1.5, rr * rxk), rr, 0, 0, TAU); g.fill();
        g.strokeStyle = "rgba(255,240,200,0.8)"; g.lineWidth = 1; g.beginPath(); g.ellipse(tx, ty, Math.max(1, r * rxk * 0.62), r * 0.62, 0, 0, TAU); g.stroke();
        glow(g, tx, ty, 34, "rgba(233,210,154,0.9)", 0.5);
        g.restore();
      }
      // ── the card mouth: a brass lip, and the card coming out of it ──
      g.fillStyle = brass(g, 220, CARD.y - 14, 380, CARD.y + 10); g.beginPath(); g.roundRect ? g.roundRect(214, CARD.y - 14, 172, 24, 8) : g.rect(214, CARD.y - 14, 172, 24); g.fill();
      g.fillStyle = "#050202"; g.fillRect(232, CARD.y - 4, 136, 6);
      g.save(); g.textAlign = "center"; g.fillStyle = "rgba(255,231,176,0.7)"; g.font = "500 8px 'JetBrains Mono', monospace"; g.fillText("YOUR ANSWER", 300, CARD.y + 26); g.restore();
      if (ph === "printing" || ph === "done") {
        const out = ph === "done" ? 1 : smooth(0, 1, since / 1.0);
        const cardH = 46 * out;
        if (cardH > 0.5) {
          const cg = g.createLinearGradient(0, CARD.y, 0, CARD.y + cardH);
          cg.addColorStop(0, "#D9C391"); cg.addColorStop(1, "#F5E8C8");
          g.fillStyle = cg; g.fillRect(240, CARD.y, 120, cardH);
          g.strokeStyle = "rgba(90,60,20,0.6)"; g.lineWidth = 0.8; g.strokeRect(240, CARD.y, 120, cardH);
          g.fillStyle = "rgba(75,46,110,0.7)"; for (let i = 0; i < 6; i++) g.fillRect(256 + i * 15, CARD.y + cardH - 14, 9, 2);
        }
        glow(g, 300, CARD.y, 60, "rgba(255,220,150,0.7)", (1 - smooth(0.6, 2, since)) * 0.5);
      }

      // ── the plinth and feet ──
      const pli = new Path2D(); pli.moveTo(FX0 - 18, 846); pli.lineTo(FX1 + 18, 846); pli.lineTo(FX1 + 12, 866); pli.lineTo(FX0 - 12, 866); pli.closePath();
      wood(g, pli, FX0, 846, 0.8);
      g.fillStyle = brass(g, 0, 842, 0, 848); g.fillRect(FX0 - 18, 842, FX1 - FX0 + 36, 5);
      [FX0 + 6, FX1 - 6].forEach((x) => { g.fillStyle = brass(g, x - 14, 866, x + 14, 878); g.beginPath(); g.ellipse(x, 870, 16, 7, 0, 0, TAU); g.fill(); });

      // the lamp light spilling out of the window onto the cabinet face
      glow(g, 300, WIN.y1 + 10, 220, "rgba(255,170,110,0.6)", 0.12 * lamp);
      g.restore(); // turn
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, [onReady]);
  return <canvas ref={ref} className="we-cabinet-canvas" aria-hidden="true" />;
}

export const CABINET = { UW, UH, WIN };
