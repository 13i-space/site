"use client";

import { useEffect, useRef } from "react";

// Signal Composer v2 (Update 5.65): the floor. A crowd from every world
// dances to whatever you're playing - harder as the crowd's energy rises.
// Energy comes from the music itself (level, low end) and from what you do:
// a drop, a clean transition, a brake slammed back in, a chant. Lasers in
// each deck's colour sweep on the beat (mixed by the crossfader), the 13i
// eye at the back pulses with the kick, and "Summon" brings something huge
// up behind the crowd for a while.

const COLORS = { A: [111, 195, 168], B: [232, 140, 190] };
const BOOST = { drop: 0.35, transition: 0.22, slam: 0.2, chant: 0.14, summon: 0.18, fx: 0.025, sample: 0.03, scratch: 0.05, jump: 0.04, play: 0.05 };

export default function Stage({ engine, onHype }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, g = c.getContext("2d");
    let raf, hype = 0.05, last = performance.now(), lastReport = 0, flash = 0, summonAt = -1e9;
    const sparks = [];
    const rnd = (k) => { const x = Math.sin(k * 127.1) * 43758.5453; return x - Math.floor(x); };
    const crowd = Array.from({ length: 38 }, (_, i) => {
      const row = i < 12 ? 0 : i < 25 ? 1 : 2;
      return { row, x: rnd(i + 1), type: Math.floor(rnd(i + 50) * 5), hue: Math.floor(rnd(i + 90) * 360), ph: rnd(i + 7) * Math.PI * 2, k: 0.8 + rnd(i + 3) * 0.4 };
    }).sort((a, b) => a.row - b.row);
    const off = engine.on((type) => {
      if (BOOST[type]) hype = Math.min(1, hype + BOOST[type]);
      if (type === "drop" || type === "slam") { flash = 1; for (let i = 0; i < 60; i++) sparks.push({ x: 0.5, y: 0.35, vx: (Math.random() - 0.5) * 0.9, vy: -Math.random() * 0.7, life: 1, hue: Math.random() * 360 }); }
      if (type === "transition") for (let i = 0; i < 30; i++) sparks.push({ x: Math.random(), y: 0.1, vx: (Math.random() - 0.5) * 0.2, vy: Math.random() * 0.2, life: 1.4, hue: 40 + Math.random() * 40 });
      if (type === "summon") summonAt = performance.now();
    });
    const freq = new Uint8Array(1024);

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dpr = Math.min(2, window.devicePixelRatio || 1), W = c.clientWidth, H = c.clientHeight;
      if (!W) return;
      if (c.width !== Math.round(W * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const playing = engine.decks.A.playing || engine.decks.B.playing;
      let level = 0, low = 0;
      if (engine.ctx) {
        level = engine.level("M");
        engine.analyser.getByteFrequencyData(freq);
        for (let i = 1; i < 8; i++) low += freq[i]; low /= 7 * 255;
      }
      const target = playing ? Math.min(0.5, level * 0.45 + low * 0.2) : 0.04; // the music alone gets them dancing; you take them higher
      hype += (target - hype) * dt * (hype > target ? 0.08 : 0.5);
      hype = Math.max(0, Math.min(1, hype));
      if (now - lastReport > 250) { lastReport = now; onHype && onHype(hype); }
      const beat = engine.beatPhase();
      const kick = Math.pow(1 - beat, 4) * (playing ? 1 : 0);
      const x = engine.xfader;
      const mix = COLORS.A.map((v, i) => Math.round(v * (1 - x) + COLORS.B[i] * x));
      const col = (a) => `rgba(${mix[0]},${mix[1]},${mix[2]},${a})`;

      // the hall
      const bg = g.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#05060f"); bg.addColorStop(0.7, "#0b0d22"); bg.addColorStop(1, "#04050c");
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      // the 13i eye at the back, pulsing with the kick
      const ex = W / 2, ey = H * 0.34, er = Math.min(W, H) * (0.16 + kick * 0.03 + low * 0.04);
      const eg = g.createRadialGradient(ex, ey, er * 0.2, ex, ey, er * 2.4);
      eg.addColorStop(0, col(0.28 + kick * 0.25)); eg.addColorStop(1, col(0));
      g.fillStyle = eg; g.fillRect(0, 0, W, H);
      g.strokeStyle = col(0.7); g.lineWidth = 2;
      g.beginPath(); g.ellipse(ex, ey, er, er * 0.55, 0, 0, Math.PI * 2); g.stroke();
      g.fillStyle = "#E9D29A"; g.beginPath(); g.arc(ex, ey, er * (0.18 + kick * 0.06), 0, Math.PI * 2); g.fill();
      g.strokeStyle = col(0.3); g.lineWidth = 1;
      for (let k = 1; k <= 3; k++) { g.beginPath(); g.arc(ex, ey, er * (1 + k * 0.45) + (beat * er * 0.45), 0, Math.PI * 2); g.stroke(); }
      // something huge, summoned, behind the crowd
      const sk = (now - summonAt) / 1000;
      if (sk < 9) {
        const a = Math.min(1, sk / 1.5) * Math.min(1, (9 - sk) / 2);
        const sy = H * (1.05 - Math.min(1, sk / 2.5) * 0.55);
        g.save(); g.globalAlpha = a * 0.85;
        g.fillStyle = "#0a0b1a";
        g.beginPath(); g.ellipse(W * 0.5, sy, W * 0.16, H * 0.3, 0, Math.PI, 0); g.fill();
        for (let t = 0; t < 7; t++) { g.strokeStyle = "#0a0b1a"; g.lineWidth = 10; g.lineCap = "round"; g.beginPath(); const bx = W * 0.5 + (t - 3) * W * 0.045; g.moveTo(bx, sy); g.quadraticCurveTo(bx + Math.sin(now / 400 + t) * 30, sy - H * 0.35, bx + Math.sin(now / 300 + t) * 50, sy - H * 0.55); g.stroke(); }
        g.fillStyle = `rgba(233,210,154,${0.6 + kick * 0.4})`;
        [-1, 0, 1].forEach((k) => { g.beginPath(); g.arc(W * 0.5 + k * W * 0.04, sy - H * 0.14, 6 + (k === 0 ? 4 : 0), 0, Math.PI * 2); g.fill(); });
        g.restore();
      }
      // lasers
      const beams = playing ? 4 + Math.round(hype * 6) : 0;
      for (let i = 0; i < beams; i++) {
        const side = i % 2 ? 1 : -1;
        const sx = side > 0 ? W * 0.97 : W * 0.03, sy = H * 0.04;
        const sweep = Math.sin(now / (900 - hype * 400) + i * 1.3 + beat * Math.PI * 2 * (i % 3 === 0 ? 1 : 0));
        const tx = W * 0.5 + sweep * W * 0.55, ty = H * 0.95;
        const c2 = i % 3 === 0 ? `rgba(${COLORS.A.join(",")},` : i % 3 === 1 ? `rgba(${COLORS.B.join(",")},` : "rgba(233,210,154,";
        g.strokeStyle = c2 + (0.12 + hype * 0.35 + kick * 0.2) + ")"; g.lineWidth = 1.5 + hype * 2;
        g.beginPath(); g.moveTo(sx, sy); g.lineTo(tx, ty); g.stroke();
      }
      // haze
      const hz = g.createLinearGradient(0, H * 0.45, 0, H);
      hz.addColorStop(0, "rgba(140,150,255,0)"); hz.addColorStop(1, col(0.12 + hype * 0.1));
      g.fillStyle = hz; g.fillRect(0, H * 0.45, W, H * 0.55);

      // the crowd
      crowd.forEach((p) => {
        const sc = [0.7, 0.95, 1.25][p.row] * Math.min(1.4, H / 200) * p.k;
        const baseY = H * [0.78, 0.9, 1.03][p.row];
        const px = 8 + p.x * (W - 16);
        const amp = (2 + hype * 18) * sc;
        const bounce = playing ? -Math.abs(Math.sin((beat + p.ph / (Math.PI * 2) * 0.15) * Math.PI)) * amp : Math.sin(now / 900 + p.ph) * 1.5;
        const armsUp = hype > 0.5 + (p.ph % 0.3);
        const shade = ["#1a1d3c", "#232750", "#2d3266"][p.row];
        drawAlien(g, px, baseY + bounce, sc, p, shade, `hsla(${p.hue},80%,75%,${0.6 + hype * 0.4})`, armsUp, now, col(0.5));
      });
      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 0.6 * dt; s.life -= dt * 0.7;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        g.fillStyle = `hsla(${s.hue},90%,70%,${s.life})`; g.fillRect(s.x * W, s.y * H, 3, 3);
      }
      // the flash of a drop
      if (flash > 0) { g.fillStyle = `rgba(255,250,235,${flash * 0.55})`; g.fillRect(0, 0, W, H); flash -= dt * 2.2; }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); off(); };
  }, [engine, onHype]);
  return <canvas ref={ref} className="dk-stage-canvas" aria-label="The floor: an alien crowd dancing to your mix" role="img" />;
}

// five body plans, from five kinds of world
function drawAlien(g, x, y, s, p, shade, eye, armsUp, now, rim) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = shade; g.strokeStyle = rim; g.lineWidth = 1;
  const wave = Math.sin(now / 160 + p.ph) * 0.4;
  if (p.type === 0) { // blob with an antenna
    g.beginPath(); g.ellipse(0, -18, 13, 18, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(0, -36); g.quadraticCurveTo(6, -46, 10, -48); g.stroke();
    g.fillStyle = eye; g.beginPath(); g.arc(10, -48, 2.2, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(-4, -22, 2.2, 0, Math.PI * 2); g.arc(4, -22, 2.2, 0, Math.PI * 2); g.fill();
    if (armsUp) { g.strokeStyle = shade; g.lineWidth = 4; g.lineCap = "round"; g.beginPath(); g.moveTo(-11, -20); g.lineTo(-18 + wave * 4, -40); g.moveTo(11, -20); g.lineTo(18 - wave * 4, -40); g.stroke(); }
  } else if (p.type === 1) { // tall, long-headed
    g.beginPath(); g.moveTo(-7, 0); g.lineTo(-5, -30); g.lineTo(5, -30); g.lineTo(7, 0); g.closePath(); g.fill();
    g.beginPath(); g.ellipse(0, -42, 7, 13, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = eye; g.beginPath(); g.ellipse(-2.5, -42, 1.4, 2.6, 0, 0, Math.PI * 2); g.ellipse(2.5, -42, 1.4, 2.6, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = shade; g.lineWidth = 3; g.lineCap = "round";
    g.beginPath();
    if (armsUp) { g.moveTo(-5, -28); g.lineTo(-14 + wave * 5, -56); g.moveTo(5, -28); g.lineTo(14 - wave * 5, -56); }
    else { g.moveTo(-5, -28); g.lineTo(-10, -10); g.moveTo(5, -28); g.lineTo(10, -10); }
    g.stroke();
  } else if (p.type === 2) { // the orb with tentacles
    g.beginPath(); g.arc(0, -26, 12, 0, Math.PI * 2); g.fill(); g.stroke();
    g.strokeStyle = shade; g.lineWidth = 3; g.lineCap = "round";
    for (let t = -2; t <= 2; t++) { g.beginPath(); g.moveTo(t * 4, -16); g.quadraticCurveTo(t * 6 + wave * 6, -6, t * 5, 0); g.stroke(); }
    g.fillStyle = eye; g.beginPath(); g.arc(0, -27, 4.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#05040f"; g.beginPath(); g.arc(0, -27, 2, 0, Math.PI * 2); g.fill();
    if (armsUp) { g.strokeStyle = shade; g.beginPath(); g.moveTo(-10, -30); g.quadraticCurveTo(-20, -44, -14 + wave * 6, -52); g.moveTo(10, -30); g.quadraticCurveTo(20, -44, 14 - wave * 6, -52); g.stroke(); }
  } else if (p.type === 3) { // crested
    g.beginPath(); g.moveTo(-9, 0); g.lineTo(-7, -26); g.lineTo(7, -26); g.lineTo(9, 0); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-9, -26); g.lineTo(0, -46); g.lineTo(9, -26); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(0, -46); g.lineTo(-6, -54); g.lineTo(0, -50); g.lineTo(6, -55); g.closePath(); g.fillStyle = eye; g.globalAlpha = 0.6; g.fill(); g.globalAlpha = 1;
    g.fillStyle = eye; g.beginPath(); g.arc(-3, -32, 1.8, 0, Math.PI * 2); g.arc(3, -32, 1.8, 0, Math.PI * 2); g.arc(0, -37, 1.4, 0, Math.PI * 2); g.fill();
    if (armsUp) { g.strokeStyle = shade; g.lineWidth = 3.5; g.lineCap = "round"; g.beginPath(); g.moveTo(-8, -22); g.lineTo(-16 + wave * 5, -44); g.moveTo(8, -22); g.lineTo(16 - wave * 5, -44); g.stroke(); }
  } else { // the many-eyed slug
    g.beginPath(); g.ellipse(0, -12, 16, 12, 0, Math.PI, 0); g.lineTo(16, 0); g.lineTo(-16, 0); g.fill(); g.stroke();
    for (let k = -2; k <= 2; k++) { g.strokeStyle = shade; g.lineWidth = 2; g.beginPath(); g.moveTo(k * 5, -18); g.lineTo(k * 6 + (armsUp ? wave * 6 : 0), armsUp ? -36 : -27); g.stroke(); g.fillStyle = eye; g.beginPath(); g.arc(k * 6 + (armsUp ? wave * 6 : 0), armsUp ? -36 : -27, 2, 0, Math.PI * 2); g.fill(); }
  }
  g.restore();
}
