"use client";

import { useEffect, useRef } from "react";

// The Oracle's eye, in the round (Update 5.55). Drawn on a canvas every
// frame, as a sphere rather than a disc:
//   - a dark, glossy eyeball inside the gold 13i ring
//   - an iris painted once in fine detail (hundreds of fibres, a collarette,
//     crypts, gold flecks) and laid onto the sphere where the eye is looking:
//     turned away, it foreshortens into an ellipse and slides toward the rim
//   - a pupil that widens and narrows with the Oracle's mood, with a few
//     stars deep inside it
//   - a wet cornea: a soft window highlight, a sharp glint, a rim of light
//   - lids that part as the eye opens
// It follows the visitor's pointer, and glances about on its own when left
// alone. Reduced motion: it holds still and looks straight out.
//
// open: 0..1 (lids). mood: sleeping | listening | receiving | speaking

const PUPIL = { sleeping: 0.12, listening: 0.24, receiving: 0.1, speaking: 0.34 };

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

// the iris, painted once (S x S, iris radius S/2, pupil hole left for later)
function paintIris(S) {
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const r = rng(13);
  const R = S / 2;
  g.translate(R, R);
  // base colour: pale gold at the pupil, amber, then deep violet-blue at the limbus
  const base = g.createRadialGradient(0, 0, R * 0.08, 0, 0, R);
  base.addColorStop(0, "#FFF4DC");
  base.addColorStop(0.22, "#F2D9A0");
  base.addColorStop(0.45, "#C9984E");
  base.addColorStop(0.7, "#7A5A8E");
  base.addColorStop(0.9, "#2C2A6B");
  base.addColorStop(1, "#0E0B26");
  g.fillStyle = base;
  g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.fill();
  // stroma: fine radial fibres, each with a little wander
  for (let i = 0; i < 1400; i++) {
    const a = r() * Math.PI * 2;
    const r0 = R * (0.14 + r() * 0.1);
    const r1 = R * (0.55 + r() * 0.43);
    const bend = (r() - 0.5) * 0.18;
    const light = r() < 0.55;
    g.strokeStyle = light ? `rgba(255,240,205,${0.06 + r() * 0.16})` : `rgba(20,12,40,${0.08 + r() * 0.18})`;
    g.lineWidth = 0.4 + r() * 1.1;
    g.beginPath();
    g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
    const am = a + bend, rm = (r0 + r1) / 2;
    g.quadraticCurveTo(Math.cos(am) * rm, Math.sin(am) * rm, Math.cos(a + bend * 0.4) * r1, Math.sin(a + bend * 0.4) * r1);
    g.stroke();
  }
  // collarette: a wavy ring about a third of the way out
  g.strokeStyle = "rgba(255,236,190,0.55)";
  g.lineWidth = R * 0.018;
  g.beginPath();
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const rr = R * (0.36 + Math.sin(a * 11) * 0.025 + Math.sin(a * 5 + 1) * 0.02);
    i ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  g.closePath(); g.stroke();
  // crypts: small dark hollows around the collarette
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2, rr = R * (0.4 + r() * 0.35);
    const w = R * (0.02 + r() * 0.035), h = w * (1.6 + r() * 1.5);
    g.save();
    g.translate(Math.cos(a) * rr, Math.sin(a) * rr);
    g.rotate(a);
    g.fillStyle = `rgba(16,8,30,${0.25 + r() * 0.3})`;
    g.beginPath(); g.ellipse(0, 0, h, w, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  // contraction furrows: faint rings in the outer iris
  [0.68, 0.76, 0.84].forEach((k) => {
    g.strokeStyle = "rgba(10,6,28,0.35)";
    g.lineWidth = 1;
    g.setLineDash([R * 0.04, R * 0.03]);
    g.beginPath(); g.arc(0, 0, R * k, 0, Math.PI * 2); g.stroke();
  });
  g.setLineDash([]);
  // gold flecks
  for (let i = 0; i < 90; i++) {
    const a = r() * Math.PI * 2, rr = R * (0.2 + r() * 0.6);
    const s = R * (0.004 + r() * 0.012);
    const f = g.createRadialGradient(Math.cos(a) * rr, Math.sin(a) * rr, 0, Math.cos(a) * rr, Math.sin(a) * rr, s * 3);
    f.addColorStop(0, "rgba(255,226,150,0.9)");
    f.addColorStop(1, "rgba(255,226,150,0)");
    g.fillStyle = f;
    g.fillRect(Math.cos(a) * rr - s * 3, Math.sin(a) * rr - s * 3, s * 6, s * 6);
  }
  // limbal ring: a dark edge that makes the iris sit in the eye
  const limb = g.createRadialGradient(0, 0, R * 0.86, 0, 0, R);
  limb.addColorStop(0, "rgba(8,6,24,0)");
  limb.addColorStop(1, "rgba(8,6,24,0.95)");
  g.fillStyle = limb;
  g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.fill();
  return c;
}

export default function OracleEye3D({ open = 1, mood = "listening" }) {
  const canvasRef = useRef(null);
  const live = useRef({ open, mood });
  live.current.open = open;
  live.current.mood = mood;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const iris = paintIris(512);
    const stars = (() => { const r = rng(317811); return Array.from({ length: 40 }, () => ({ a: r() * 6.28, d: Math.sqrt(r()), s: 0.4 + r() * 1.1, p: r() * 6.28 })); })();
    let W = 0, dpr = 1, raf = 0;
    const st = { gx: 0, gy: 0, tx: 0, ty: 0, pupil: 0.2, lid: 0, lastMove: 0, nextGlance: 0 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(W * dpr);
    };
    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    const onMove = (e) => {
      if (reduced) return;
      const r = canvas.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth * 0.5);
      const dy = (e.clientY - cy) / (window.innerHeight * 0.5);
      st.tx = Math.max(-1, Math.min(1, dx)) * 0.55;
      st.ty = Math.max(-1, Math.min(1, dy)) * 0.45;
      st.lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove);

    const draw = (now) => {
      const t = now / 1000;
      const { open: o, mood: m } = live.current;
      // where to look: the pointer, or a glance of its own after a while
      if (!reduced) {
        if (m === "receiving") { st.tx = 0; st.ty = -0.35; }
        else if (now - st.lastMove > 3500 && now > st.nextGlance) {
          st.tx = (Math.random() - 0.5) * 0.7;
          st.ty = (Math.random() - 0.5) * 0.4;
          st.nextGlance = now + 1800 + Math.random() * 2600;
        }
      }
      const k = reduced ? 1 : 0.085;
      st.gx += (st.tx - st.gx) * k;
      st.gy += (st.ty - st.gy) * k;
      st.pupil += ((PUPIL[m] || 0.24) * (1 + (m === "speaking" ? 0.06 * Math.sin(t * 3) : 0.02 * Math.sin(t * 0.8))) - st.pupil) * 0.06;
      st.lid += (Math.max(0, Math.min(1, o)) - st.lid) * (reduced ? 1 : 0.04);

      const S = W * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, S, S);
      ctx.translate(S / 2, S / 2);
      const R = S * 0.5 * 0.92; // the eyeball

      // the lids themselves: dark, faintly lit from above, filling the ring
      const lids = ctx.createRadialGradient(0, -R * 0.4, R * 0.2, 0, 0, S * 0.48);
      lids.addColorStop(0, "#1d1b48");
      lids.addColorStop(0.7, "#100f2e");
      lids.addColorStop(1, "#08071a");
      ctx.fillStyle = lids;
      ctx.beginPath(); ctx.arc(0, 0, S * 0.475, 0, Math.PI * 2); ctx.fill();
      // fine creases in the lids, following their curve
      ctx.strokeStyle = "rgba(139,149,246,0.12)";
      ctx.lineWidth = Math.max(1, S * 0.002);
      for (let i = 1; i <= 3; i++) {
        const lh = R * (0.04 + 0.96 * st.lid) * 1.36 + R * 0.09 * i;
        ctx.beginPath(); ctx.moveTo(-R * (1 - i * 0.04), 0); ctx.quadraticCurveTo(0, -lh, R * (1 - i * 0.04), 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-R * (1 - i * 0.04), 0); ctx.quadraticCurveTo(0, lh, R * (1 - i * 0.04), 0); ctx.stroke();
      }

      // the lids: an almond opening; closed is a thin line
      const open01 = st.lid;
      const lidH = R * (0.04 + 0.96 * open01);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-R * 1.02, 0);
      ctx.quadraticCurveTo(0, -lidH * 1.36, R * 1.02, 0);
      ctx.quadraticCurveTo(0, lidH * 1.36, -R * 1.02, 0);
      ctx.closePath();
      ctx.clip();

      // eyeball: dark obsidian sphere, lit from the upper left
      const ball = ctx.createRadialGradient(-R * 0.35, -R * 0.4, R * 0.05, 0, 0, R);
      ball.addColorStop(0, "#2a2a5c");
      ball.addColorStop(0.45, "#121236");
      ball.addColorStop(0.85, "#07061A");
      ball.addColorStop(1, "#020108");
      ctx.fillStyle = ball;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      // faint veins of light under the surface
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "#8B95F6";
      ctx.lineWidth = Math.max(1, S * 0.0015);
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + 0.3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * R * 0.98, Math.sin(a) * R * 0.98);
        ctx.quadraticCurveTo(Math.cos(a + 0.25) * R * 0.8, Math.sin(a + 0.25) * R * 0.8, Math.cos(a + 0.1) * R * 0.66, Math.sin(a + 0.1) * R * 0.66);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // the iris on the sphere: centre moves with the gaze, foreshortened by the turn
      const ang = Math.hypot(st.gx, st.gy); // radians-ish off axis
      const dir = Math.atan2(st.gy, st.gx);
      const ir = R * 0.62;
      const icx = Math.sin(st.gx) * R * 0.78, icy = Math.sin(st.gy) * R * 0.78;
      const squash = Math.cos(Math.min(1.2, ang * 1.05));
      ctx.save();
      ctx.translate(icx, icy);
      ctx.rotate(dir);
      ctx.scale(squash, 1);
      ctx.rotate(-dir);
      // a glow the iris throws into the eye
      const halo = ctx.createRadialGradient(0, 0, ir * 0.5, 0, 0, ir * 1.35);
      halo.addColorStop(0, "rgba(233,210,154,0.25)");
      halo.addColorStop(1, "rgba(233,210,154,0)");
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(0, 0, ir * 1.35, 0, Math.PI * 2); ctx.fill();
      // the iris itself, turning very slowly
      ctx.save();
      ctx.rotate(reduced ? 0 : t * 0.02);
      ctx.drawImage(iris, -ir, -ir, ir * 2, ir * 2);
      ctx.restore();
      // the pupil, with stars a long way down
      const pr = ir * st.pupil * 1.5;
      const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, pr * 1.18);
      pg.addColorStop(0, "#05031a");
      pg.addColorStop(0.82, "#020108");
      pg.addColorStop(1, "rgba(2,1,8,0)");
      ctx.fillStyle = pg;
      ctx.beginPath(); ctx.arc(0, 0, pr * 1.18, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(0, 0, pr * 0.92, 0, Math.PI * 2); ctx.clip();
      stars.forEach((s) => {
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.9 + s.p));
        ctx.globalAlpha = tw * 0.9;
        ctx.fillStyle = s.p > 3 ? "#E9D29A" : "#B9C0FF";
        const x = Math.cos(s.a + t * 0.03) * s.d * pr * 0.9, y = Math.sin(s.a + t * 0.03) * s.d * pr * 0.9;
        ctx.fillRect(x, y, s.s * dpr * 0.8, s.s * dpr * 0.8);
      });
      ctx.globalAlpha = 1;
      ctx.restore();
      ctx.restore();

      // shading: the sphere darkens toward its edge and under the upper lid
      const shade = ctx.createRadialGradient(-R * 0.2, -R * 0.25, R * 0.4, 0, 0, R * 1.02);
      shade.addColorStop(0, "rgba(0,0,0,0)");
      shade.addColorStop(0.75, "rgba(2,1,10,0.25)");
      shade.addColorStop(1, "rgba(2,1,10,0.85)");
      ctx.fillStyle = shade;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      const lidShadow = ctx.createLinearGradient(0, -lidH * 1.36, 0, -lidH * 0.3);
      lidShadow.addColorStop(0, "rgba(2,1,10,0.75)");
      lidShadow.addColorStop(1, "rgba(2,1,10,0)");
      ctx.fillStyle = lidShadow;
      ctx.fillRect(-R, -R, R * 2, R);

      // the cornea: a window of light, a sharp glint, and a rim
      ctx.save();
      ctx.translate(-R * 0.34, -R * 0.36);
      ctx.rotate(-0.5);
      const win = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.32);
      win.addColorStop(0, "rgba(255,255,255,0.32)");
      win.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = win;
      ctx.beginPath(); ctx.ellipse(0, 0, R * 0.32, R * 0.18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath(); ctx.ellipse(-R * 0.3, -R * 0.33, R * 0.045, R * 0.03, -0.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.beginPath(); ctx.arc(R * 0.36, R * 0.3, R * 0.018, 0, Math.PI * 2); ctx.fill();
      const rim = ctx.createRadialGradient(0, 0, R * 0.86, 0, 0, R);
      rim.addColorStop(0, "rgba(139,149,246,0)");
      rim.addColorStop(1, "rgba(139,149,246,0.28)");
      ctx.fillStyle = rim;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); // end lid clip

      // lid edges, catching the light
      if (open01 > 0.02) {
        ctx.strokeStyle = "rgba(233,210,154,0.55)";
        ctx.lineWidth = Math.max(1, S * 0.004);
        ctx.beginPath();
        ctx.moveTo(-R * 1.02, 0);
        ctx.quadraticCurveTo(0, -lidH * 1.36, R * 1.02, 0);
        ctx.stroke();
        ctx.strokeStyle = "rgba(139,149,246,0.35)";
        ctx.beginPath();
        ctx.moveTo(-R * 1.02, 0);
        ctx.quadraticCurveTo(0, lidH * 1.36, R * 1.02, 0);
        ctx.stroke();
      }
      // the gold ring of the 13i eye, around everything
      ctx.strokeStyle = "#E9D29A";
      ctx.lineWidth = S * 0.028;
      ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.arc(0, 0, S * 0.485, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = "#FFF4DC";
      ctx.lineWidth = S * 0.006;
      ctx.beginPath(); ctx.arc(0, 0, S * 0.485, Math.PI * 1.05, Math.PI * 1.6); ctx.stroke();
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); window.removeEventListener("pointermove", onMove); };
  }, []);

  return <canvas ref={canvasRef} className="oracle-eye3d" aria-hidden="true" />;
}
