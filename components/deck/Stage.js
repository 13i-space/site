"use client";

import { useEffect, useRef } from "react";
import { layout, drawSky, drawTruss, drawSpots, drawLasers, drawFloor, drawFog, drawCrowd, burst, drawParticles } from "../../lib/rave/stage";
import { drawDJ, drawBoothTop, drawDJHands, drawBoothFront, drawStageLip } from "../../lib/rave/booth";
import { drawSpeakers, drawPlanet, drawCity } from "../../lib/rave/scenery";
import { drawWall } from "../../lib/rave/wall";
import { clamp, glow, hsl } from "../../lib/rave/draw";
import { paintDJ } from "../../lib/rave/painted";

// Signal Composer v2 (Update 5.65): the floor. Update 6.18: it's the Rave now -
// the DJ from Rave Mode at the booth (painted per pixel, his hands on the
// decks, his brain lighting with the bass) in front of the LED wall, and the
// Rave's crowd packed onto the dance floor in three rows, dancing to whatever
// you're playing - harder as the crowd's energy rises. Energy comes from the
// music itself (level, low end) and from what you do: a drop, a clean
// transition, a brake slammed back in, a chant. Lasers and spots in each
// deck's colour (mixed by the crossfader), a burst on the drop, and "Summon"
// still brings something huge up behind the crowd for a while.

const BOOST = { drop: 0.35, transition: 0.22, slam: 0.2, chant: 0.14, summon: 0.18, fx: 0.025, sample: 0.03, scratch: 0.05, jump: 0.04, play: 0.05 };
const HUE = { A: 162, B: 327 }; // the decks' colours, as hues
const lerpHue = (a, b, k) => a + ((((b - a) % 360) + 540) % 360 - 180) * k;

export default function Stage({ engine, onHype }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    let raf, hype = 0.05, last = performance.now(), lastReport = 0, flash = 0, summonAt = -1e9;
    let beats = 0, lastPhase = 0, dropAt = -1e9, buildAt = -1e9, wasPlaying = false;
    const parts = [];
    const freq = new Uint8Array(1024);
    let L = null, burstWanted = 0;
    const off = engine.on((type) => {
      if (BOOST[type]) hype = Math.min(1, hype + BOOST[type]);
      const now = performance.now();
      if (type === "drop" || type === "slam") { flash = 1; dropAt = now; burstWanted = type === "drop" ? 160 : 90; }
      if (type === "transition") burstWanted = 60;
      if (type === "build") buildAt = now;
      if (type === "summon") summonAt = now;
    });

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const W = c.clientWidth, H = c.clientHeight;
      if (!W) return;
      let dpr = Math.min(2, window.devicePixelRatio || 1);
      if (W * H * dpr * dpr > 2.2e6) dpr = Math.sqrt(2.2e6 / (W * H));
      const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
      if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; }
      if (!L || L._w !== W || L._h !== H) { L = layout(W, H); L._w = W; L._h = H; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const t = now / 1000;

      // the music: how loud, how much low end, where in the beat
      const playing = engine.decks.A.playing || engine.decks.B.playing;
      let level = 0, low = 0, high = 0;
      if (engine.ctx) {
        level = engine.level("M");
        engine.analyser.getByteFrequencyData(freq);
        for (let i = 1; i < 8; i++) low += freq[i]; low /= 7 * 255;
        for (let i = 120; i < 200; i++) high += freq[i]; high /= 80 * 255;
      }
      const target = playing ? Math.min(0.5, level * 0.45 + low * 0.2) : 0.04; // the music alone gets them dancing; you take them higher
      hype += (target - hype) * dt * (hype > target ? 0.08 : 0.5);
      hype = clamp(hype, 0, 1);
      if (now - lastReport > 250) { lastReport = now; onHype && onHype(hype); }
      const ph = playing ? engine.beatPhase() : (t * 0.9) % 1;
      if (ph < lastPhase - 0.5) beats++;
      lastPhase = ph;
      if (!playing && wasPlaying) beats = Math.ceil(beats / 4) * 4;
      wasPlaying = playing;
      const B = beats + ph;

      // the show's state, as the Rave's drawing code reads it
      const x = engine.xfader;
      const pal = { a: lerpHue(HUE.A, HUE.B, x * 0.5), b: lerpHue(HUE.B, HUE.A, (1 - x) * 0.5) };
      const drop = clamp(1 - (now - dropAt) / 8000, 0, 1) * (playing ? 1 : 0);
      const build = clamp((now - buildAt) / 4000, 0, 1) * (now - buildAt < 4000 ? 1 : 0);
      const e = playing ? clamp(0.3 + hype * 0.75, 0, 1) : 0.08;
      const amp = playing ? 0.35 + 0.65 * e : 0.15;
      const m = { B, ph, t, e, amp, level: playing ? level : 0.05, bass: playing ? low : 0, high: playing ? high : 0, drop, build, on: playing, pal, s: t, ghost: 0 };
      const spectrum = playing ? freq : null;
      if (burstWanted) { burst(parts, L, { pal }, burstWanted); burstWanted = 0; }

      // the camera: in a touch on the booth, the floor running to the bottom edge
      const wide = W / H;
      const Z = wide > 2.6 ? 1.3 : wide > 1.6 ? 1.18 : 1.05;
      const Fx = L.VW / 2, Fy = L.VH - (L.VH * 0.54) / Z;
      const base = dpr * L.u;
      const cam = { x: Math.sin(t * 0.11) * 1.6, y: Math.sin(t * 0.083) * 0.5, z: 1 + build * 0.03 + drop * 0.05 + (playing ? Math.pow(1 - ph, 6) * 0.006 * (0.5 + hype) : 0) };
      const fx = L.cx, fyc = L.floorTop;
      const layer = (depth) => {
        const k = 1 + (cam.z - 1) * depth;
        ctx.setTransform(base * Z, 0, 0, base * Z, base * (L.VW / 2 - Z * Fx), base * (L.VH * 0.46 - Z * Fy));
        ctx.translate(fx, fyc); ctx.scale(k, k); ctx.translate(-fx + cam.x * depth, -fyc + cam.y * depth);
      };
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = "#04020C"; ctx.fillRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;

      layer(0.08); drawSky(ctx, L, m);
      layer(0.18); drawPlanet(ctx, L.planet.x, L.planet.y, L.planet.r, m);
      layer(0.28); drawCity(ctx, L, m);
      layer(0.42);
      drawWall(ctx, L, m, spectrum, { title: null, sub: null, a: 0 }, clamp(L.u * dpr * Z * 0.8, 4, 12));
      drawTruss(ctx, L, m);
      drawSpots(ctx, L, m, playing ? 0.45 + 0.55 * e : 0.25);
      layer(0.5);
      drawSpeakers(ctx, L, m);
      if (!paintDJ(ctx, L, m, spectrum, 0)) drawDJ(ctx, L, m, spectrum);
      drawBoothTop(ctx, L, m, spectrum);
      if (!paintDJ(ctx, L, m, spectrum, 1)) drawDJHands(ctx, L, m);
      drawBoothFront(ctx, L, m, "XENO-DJ FLX-13", spectrum);
      drawStageLip(ctx, L, m);
      layer(0.62); drawFloor(ctx, L, m);
      const laserI = !playing ? 0 : build > 0 ? 0.15 * (1 - build) : clamp((hype - 0.25) * 1.6 + drop * 0.6, 0, 1);
      layer(0.5); drawLasers(ctx, L, m, laserI);
      layer(0.62); drawFog(ctx, L, m, false);

      // something huge, summoned, rising behind the crowd
      const sk = (now - summonAt) / 1000;
      if (sk < 9) {
        layer(0.66);
        const a = Math.min(1, sk / 1.5) * Math.min(1, (9 - sk) / 2);
        const sx = L.cx, sy = L.floorTop + 30 - Math.min(1, sk / 2.5) * 26, R = 26;
        const kick = playing ? Math.pow(1 - ph, 4) : 0;
        ctx.save(); ctx.globalAlpha = a * 0.92;
        ctx.fillStyle = "#07061a";
        ctx.beginPath(); ctx.ellipse(sx, sy, R, R * 0.85, 0, Math.PI, 0); ctx.lineTo(sx + R, sy + 40); ctx.lineTo(sx - R, sy + 40); ctx.closePath(); ctx.fill();
        for (let k = 0; k < 7; k++) { ctx.strokeStyle = "#07061a"; ctx.lineWidth = 3; ctx.lineCap = "round"; const bx = sx + (k - 3) * 7; ctx.beginPath(); ctx.moveTo(bx, sy); ctx.quadraticCurveTo(bx + Math.sin(t * 2.5 + k) * 6, sy - 22, bx + Math.sin(t * 3.3 + k) * 10, sy - 34); ctx.stroke(); }
        [-1, 0, 1].forEach((k) => glow(ctx, sx + k * 6.5, sy - 9, k === 0 ? 3.2 : 2.2, `rgba(233,210,154,${0.7 + kick * 0.3})`, 0.9));
        ctx.restore();
      }

      // the crowd, packed onto the floor: a far row, a middle row, the front
      // (each row with the stage light glowing behind it, so they stand out against the floor)
      const rowGlow = (y, hgt, k) => {
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        const g = ctx.createLinearGradient(0, y - hgt, 0, y);
        g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.7, hsl(pal.a, 80, 45, (0.12 + hype * 0.12 + (playing ? Math.pow(1 - ph, 4) * 0.06 : 0)) * k)); g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.fillRect(-40, y - hgt, L.VW + 80, hgt);
        ctx.restore();
      };
      [[0.46, L.floorTop + 7], [0.62, L.floorTop + 15], [0.8, L.floorTop + 25]].forEach(([k, y], i) => {
        layer(0.7 + (y - L.floorTop) / 120);
        rowGlow(y - 2, 14 * k, 1.2 - i * 0.25);
        ctx.save(); ctx.translate(L.cx, y); ctx.scale(k, k); ctx.translate(-L.VW / (2 * k), -L.VH);
        drawCrowd(ctx, { ...L, VW: L.VW / k }, { ...m, ph: (m.ph + k * 0.37) % 1, B: m.B + i * 0.21 });
        ctx.restore();
      });
      layer(1.05); drawFog(ctx, L, m, true);
      // the front row, nearest, lifted so you see them
      layer(1.25);
      rowGlow(L.VH - 6, 16, 0.8);
      ctx.save(); ctx.translate(L.cx, L.VH); ctx.scale(1.12, 1.12); ctx.translate(-L.VW / 2.24, -L.VH - 4);
      drawCrowd(ctx, { ...L, VW: L.VW / 1.12 }, m);
      ctx.restore();
      layer(0.8); drawParticles(ctx, parts, dt);

      ctx.setTransform(base, 0, 0, base, 0, 0);
      if (flash > 0) { ctx.fillStyle = hsl(pal.a, 100, 85, flash * 0.45); ctx.fillRect(0, 0, L.VW, L.VH); flash -= dt * 2.2; }
      const vg = ctx.createRadialGradient(L.cx, L.VH * 0.55, Math.min(L.VW, L.VH) * 0.35, L.cx, L.VH * 0.55, Math.max(L.VW, L.VH) * 0.8);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, L.VW, L.VH);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); off(); };
  }, [engine, onHype]);
  return <canvas ref={ref} className="dk-stage-canvas" aria-label="The floor: the DJ at the booth and an alien crowd dancing to your mix" role="img" />;
}
