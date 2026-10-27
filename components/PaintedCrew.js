"use client";

import { useEffect, useRef, useState } from "react";
import { paintDancer } from "../lib/rave/painted";

// The Lab's crew, painted (Update 6.21): the same per-pixel Qeth and Ilu as
// the Rave (lib/rave/painted), at their bench instead of on the floor -
// idling, and talking when it's their line. Falls back to the drawn ones
// (components/AlienLab.js) if WebGL isn't there.

const QETH_REST = { lift: 0, lean: 0, sy: 1, hem: 0, flare: 0, head: 0, headY: 0, look: [0, 0], uL: [20, 110], uR: [100, 110], lL: [52, 108], lR: [68, 108], orb: [60, 106], orbGlow: 0, happy: 0, crown: 0, feet: [0, 0], fly: 0, gather: 0, hip: 0, roll: 0, tail: 0.4, tailUp: 0, hair: 0, knee: [0, 0] };
const ILU_REST = { lift: 0, float: 0, sx: 1, sy: 1, rot: 0, spin: 0, flare: 0, tent: [0, 0, 0, 0, 0, 0, 0], curl: [0, 0, 0, 0, 0, 0, 0], look: [0, 0], mirror: 0, ant: 0, sticks: 0, stickA: 0, mouth: 0 };

function mOf(t, talk, pal) {
  const B = t * 1.1;
  return { t, B, ph: B % 1, amp: 0.25 + talk * 0.2, bass: 0.15 + talk * 0.2, high: 0.25 + talk * 0.35, level: 0.3, e: 0, drop: 0, build: 0, on: false, pal, halloween: false, cicada: false };
}

// Qeth: hip cocked, one hand on it, her hair and tail moving slowly; when she
// speaks her free hand opens in a slow gesture, her lips move, her crown lights
function qethPose(t, talk) {
  const g = Math.sin(t * 2.2), n = Math.sin(t * 6.5);
  const lip = talk ? Math.max(0, Math.sin(t * 12) * 0.45 + Math.sin(t * 7.3) * 0.3) : 0;
  const hip = 0.55 + Math.sin(t * 0.8) * 0.25;
  return {
    ...QETH_REST,
    lift: Math.sin(t * 1.3) * 0.4,
    hip, roll: (t * 0.12) % 1, hair: Math.sin(t * 0.7) * 0.35, tail: 0.5 + Math.sin(t * 0.9) * 0.4, knee: [0.6, 0],
    lean: -0.015, head: 0.07 + n * 0.025 * talk + Math.sin(t * 0.4) * 0.03,
    headY: Math.abs(n) * talk * 0.4,
    look: [1.5 + Math.sin(t * 0.5) * 1.0, 0.2],
    uR: [74 + hip * 3.4, 106],
    uL: [28 - g * 3 * talk, 86 - talk * (16 + g * 4)],
    lL: [46, 110], lR: [77, 108],
    crown: 0.25 + talk * (0.45 + 0.3 * Math.abs(n)),
    happy: 0.4,
    mouth: lip,
  };
}
// Ilu: bobbing, tentacles drifting; talking it bounces and its mouth moves
function iluPose(t, talk) {
  const bob = Math.sin(t * 1.8);
  const m = talk ? Math.max(0, Math.sin(t * 13) * 0.5 + Math.sin(t * 7.1) * 0.35) : 0;
  return {
    ...ILU_REST,
    float: 0.15,
    lift: -3 - bob * 3 - talk * Math.abs(Math.sin(t * 4)) * 3,
    sy: 1 - bob * 0.025, sx: 1 + bob * 0.02,
    rot: Math.sin(t * 0.7) * 0.05,
    tent: ILU_REST.tent.map((_, i) => (i - 3) * 0.08 + Math.sin(t * 1.6 - i * 0.7) * 0.22),
    curl: ILU_REST.curl.map((_, i) => Math.sin(t * 1.6 - i * 0.7 + 1) * 0.5),
    look: [-2.5 + Math.sin(t * 0.6) * 1.5, 0.6],
    ant: Math.sin(t * 1.2) * 0.4 + talk * Math.sin(t * 6) * 0.3,
    mouth: m,
  };
}

const SPEC = {
  // frame: the viewBox the drawn one used (x0, y0, w, h), and where its feet go
  qeth: { box: [0, -10, 120, 160], at: [60, 150], s: 0.98, pose: qethPose, pal: { a: 300, b: 178 } },
  ilu: { box: [0, -10, 120, 160], at: [60, 150], s: 1.08, pose: iluPose, pal: { a: 320, b: 190 } },
};

export function PaintedMember({ who, talking, fallback }) {
  const ref = useRef(null);
  const talkRef = useRef(talking);
  const [failed, setFailed] = useState(false);
  talkRef.current = talking;
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const S = SPEC[who];
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, talk = talkRef.current ? 1 : 0, alive = true, visible = true;
    const t0 = performance.now() / 1000 + (who === "ilu" ? 3.1 : 0);
    const io = "IntersectionObserver" in window ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }) : null;
    io && io.observe(c);
    const frame = () => {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = c.clientWidth, H = c.clientHeight;
      if (!W || !H) return;
      if (c.width !== Math.round(W * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      const t = reduced ? 1 : performance.now() / 1000 - t0;
      talk += ((talkRef.current ? 1 : 0) - talk) * 0.08;
      const [x0, y0, bw, bh] = S.box;
      const k = Math.min(c.width / bw, c.height / bh);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height);
      ctx.setTransform(k, 0, 0, k, (c.width - bw * k) / 2 - x0 * k, -y0 * k);
      ctx.translate(S.at[0], S.at[1]); ctx.scale(S.s, S.s);
      const ok = paintDancer(who, ctx, S.pose(t, talk), mOf(t, talk, S.pal));
      if (!ok) { alive = false; setFailed(true); }
      if (reduced) { alive = false; }
    };
    frame();
    return () => { alive = false; cancelAnimationFrame(raf); io && io.disconnect(); };
  }, [who]);
  if (failed) return fallback;
  return <canvas ref={ref} className={`lab-alien lab-painted lab-${who} ${talking ? "lab-alien-talk" : ""}`} aria-hidden="true" />;
}
