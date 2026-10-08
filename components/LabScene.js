"use client";

import { useEffect, useRef, useState } from "react";
import { drawEmbryo, STAGE_NAMES } from "../lib/embryo";
import { drawSpecimen, specimenReadout } from "../lib/specimen";
import { creatureOnly, portraitSrc } from "../lib/portraitArt";
import { setLabMirror } from "../lib/labMirror";
import { alienClick, alienLock, alienOpen, alienDeny, chime, labZap, labHum, labReveal } from "../lib/alienSound";

// ─────────────────────────────────────────────────────────────────────────
// The Alien Lab, the room itself (Update 5.63). Replaces the plain tank and
// the small Ixxen of 5.55/5.59. One canvas, drawn live:
//
//   the bay      back wall, shelves of older specimens in jars, ceiling
//                pipes, a warning beacon, the floor
//   the tank     the containment vat, its cap and base, two charge coils,
//                a ceiling injector, a feed pipe from the reservoir
//   the console  three levers, two dials, a bank of buttons, a valve
//                wheel, a vial rack, a holo screen
//   Ixxen        the Lab's master, now full size: a long head with one
//                vertical eye and two small ones, a mantle full of
//                instruments, and six arms - two with fingers, four
//                tentacles - that never stop working
//
// Every answer (pulse) sends Ixxen through a routine: pull a lever and the
// feed pump runs, pull another and the injector goes into the tank, turn
// the dials, run the buttons, tap the glass, pour a vial into the intake,
// spin the valve, write it down. Between answers the arms keep busy on
// their own. `nudge` asks for one small task (the attribute sliders).
//
// Phases (from AlienCreator): grow -> anomaly -> cocoon -> reveal.
//   grow     the embryo (lib/embryo.js), nudged by every answer
//   anomaly  the unexplained event (see docs/WORLD.md) - Ixxen pulls back
//   cocoon   the species is being drawn: a full metamorphosis in the tank,
//            the coils arcing, Ixxen working flat out (one to two minutes)
//   reveal   the species, out of its backdrop, in the tank
//
// The tank's view is copied every frame to the live feed (lib/labMirror.js)
// so the card preview below shows exactly what is in the tank.
// ─────────────────────────────────────────────────────────────────────────

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
const ANOMALY_MS = 6200;
const SIGIL = [[0, -1], [0.87, 0.5], [-0.87, 0.5], [0, -1]];

// the room, in scene units (the canvas is 100 x 100 of them)
const VAT = { x: 52, y: 17, w: 30, h: 63, cx: 67, cy: 47 };
const DESK = (x) => 73.6 + x * 0.025; // the console's top edge
const LEVERS = [6, 10.6, 15.2].map((x) => ({ x, y: DESK(x) + 0.3 }));
const DIALS = [{ x: 23.5, y: 82.5 }, { x: 30, y: 82.5 }];
const BTNS = [[36, 79.4], [39.2, 79.4], [42.4, 79.4], [36, 82.6], [39.2, 82.6], [42.4, 82.6]];
const VALVE = { x: 47.6, y: 88 };
const FUNNEL = { x: 57, y: 9.6 };
const HOLO = { x: 31, y: 53, w: 15, h: 10.5 };
const RACK = { x: 1.6, y: 70.2 };
const SLATE = { x: 9.5, y: 58 };
const SHOULDERS = [[27.6, 46], [19.4, 46.5], [27.9, 52.5], [18.9, 53.5], [27.2, 59], [19.4, 60]];
const ARM_W = [1.25, 1.15, 1.45, 1.4, 1.35, 1.3];
const HANDS = ["fingers", "fingers", "suck", "suck", "suck", "suck"];
const BEND = [1, -0.8, 0.9, -0.9, 0.7, -0.6];
const BACK_ARMS = [3, 5];
const FRONT_ARMS = [2, 4, 1, 0];
const REST = [[39, 55], [SLATE.x + 2.5, SLATE.y + 2], [27, 76], [12, 67], [39.5, 76], [5, 67.5]];

// each answer gets one of these: [arm, task, seconds after the answer]
const ROUTINES = [
  [[3, "lever0", 0], [2, "dial0", 0.1], [4, "btns", 0.7], [3, "lever1", 1.5], [0, "slate", 2.3]],
  [[0, "glass1", 0], [4, "btns", 0.25], [2, "dial1", 0.8], [3, "lever2", 1.3], [5, "funnel", 0.9]],
  [[5, "valve", 0], [3, "lever0", 0.35], [0, "funnel", 0.8], [2, "dial0", 1.3], [3, "lever1", 2.0]],
  [[4, "btns", 0], [2, "dial1", 0.2], [0, "glass0", 0.9], [3, "lever2", 1.25], [0, "slate", 2.3]],
  [[2, "dial0", 0], [5, "rack", 0], [3, "lever1", 0.6], [5, "funnel", 1.3], [4, "btns", 1.6], [0, "holo", 2.2]],
];
const BIG = [[3, "lever0", 0], [2, "dial0", 0], [4, "btns", 0.2], [0, "glass1", 0.3], [5, "valve", 0.4], [3, "lever1", 1.2], [2, "dial1", 1.0], [0, "funnel", 1.6], [3, "lever2", 2.2], [0, "slate", 2.9]];
// what each arm does on its own between answers
const IDLE = {
  0: ["holo", "glass0", "glass2", "slate", "holo"],
  2: ["dial0", "dial1", "dial0"],
  3: ["lever2", "nudgeLever"],
  4: ["btns", "btns"],
  5: ["rack", "valve", "rack"],
};
const DUR = { lever0: 1.25, lever1: 1.6, lever2: 1.1, nudgeLever: 0.8, dial0: 1.1, dial1: 1.1, btns: 1.5, glass0: 0.9, glass1: 0.9, glass2: 0.9, funnel: 1.5, valve: 1.4, holo: 1.2, rack: 1.0, slate: 1.4 };

export default function LabScene({ traits, pulse = 0, nudge = 0, big = false, label = "SPECIMEN", embryo = null, phase = "grow", portrait = null }) {
  const ref = useRef(null);
  const live = useRef({});
  live.current.traits = traits;
  live.current.embryo = embryo;
  live.current.big = big;
  const phaseRef = useRef({ phase, at: 0 });
  if (phase !== phaseRef.current.phase) phaseRef.current = { phase, at: typeof performance !== "undefined" ? performance.now() : 0 };
  const pulseRef = useRef({ n: pulse, at: 0, seen: pulse });
  if (pulse !== pulseRef.current.n) pulseRef.current = { ...pulseRef.current, n: pulse, at: typeof performance !== "undefined" ? performance.now() : 0 };
  const nudgeRef = useRef(nudge);
  const nudgeSeen = useRef(nudge);
  nudgeRef.current = nudge;
  const imgRef = useRef(null);
  const lookRef = useRef(null);
  const [readout, setReadout] = useState("");
  const [alarm, setAlarm] = useState(false);

  useEffect(() => {
    if (!portrait) { imgRef.current = null; return; }
    const im = new Image();
    im.onload = () => { imgRef.current = im; };
    im.src = portraitSrc(creatureOnly(portrait));
  }, [portrait]);

  useEffect(() => {
    if (phase !== "anomaly") return;
    try { localStorage.setItem("13i_anomalies", String(Number(localStorage.getItem("13i_anomalies") || 0) + 1)); } catch (e) { /* ignore */ }
    const on = setTimeout(() => setAlarm(true), ANOMALY_MS * 0.2);
    const off = setTimeout(() => setAlarm(false), ANOMALY_MS * 0.9);
    return () => { clearTimeout(on); clearTimeout(off); };
  }, [phase]);

  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const feed = document.createElement("canvas");
    feed.width = 352; feed.height = 242; // 16:11, the card's portrait window
    setLabMirror(feed);
    const off = document.createElement("canvas"); // the new form, for the glitch
    let raf = 0, last = performance.now(), lastRead = 0, frozenAt = 0, visible = true, nextIdle = 0;
    // sound (Update 5.64): the hum and zaps of the transformation, an alarm at
    // the anomaly, a fanfare when the species is revealed
    let heardPhase = phaseRef.current.phase, nextZap = 0, nextHum = 0;
    const play = (fn) => { try { fn(); } catch (e) { /* no audio */ } };
    const io = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }) : null;
    io && io.observe(c);

    // ── the machinery's state ──
    const M = {
      lever: [0, 0, 0].map(() => ({ a: -0.3, until: 0 })),
      dial: [0.4, 2.2], dialTo: [0.4, 2.2],
      valve: 0, valveTo: 0,
      lit: [0, 0, 0, 0, 0, 0],
      inject: -10, flow: [], ripple: [], pourUntil: 0, burstAt: -10, scanAt: -10, joltAt: -10,
      writeUntil: 0, strokes: 0, holoAt: -10, spike: 0, arcAt: -10, level: 0.72, beacon: 0,
    };
    const arms = SHOULDERS.map((s, i) => ({ p: [...REST[i]], v: [0, 0], job: null }));
    let jobs = [];
    const bubbles = Array.from({ length: 40 }, (_, i) => ({ x: Math.random(), y: Math.random(), s: 0.25 + Math.random() * 0.7, v: 0.02 + Math.random() * 0.05, p: i }));
    const jars = Array.from({ length: 9 }, (_, i) => ({ h: 200 + ((i * 67) % 160), k: i }));

    const leverTip = (i) => { const L = LEVERS[i], a = M.lever[i].a; return [L.x + Math.sin(a) * 6.2, L.y - Math.cos(a) * 6.2]; };
    const anchors = {
      lever0: () => leverTip(0), lever1: () => leverTip(1), lever2: () => leverTip(2), nudgeLever: () => leverTip(2),
      dial0: () => [DIALS[0].x + Math.cos(M.dial[0]) * 1.9, DIALS[0].y + Math.sin(M.dial[0]) * 1.9],
      dial1: () => [DIALS[1].x + Math.cos(M.dial[1]) * 1.9, DIALS[1].y + Math.sin(M.dial[1]) * 1.9],
      btns: (now, j) => { const k = Math.floor((now - j.start) * 6) % 6; const order = [0, 4, 2, 3, 1, 5][k]; const b = BTNS[order]; const press = Math.sin(((now - j.start) * 6 % 1) * Math.PI); return [b[0], b[1] - 1.2 + press * 1.1]; },
      glass0: () => [VAT.x - 0.4, 30], glass1: () => [VAT.x - 0.4, 47], glass2: () => [VAT.x - 0.4, 64],
      funnel: (now, j) => [FUNNEL.x - 1.5 + Math.sin((now - j.start) * 3) * 0.3, FUNNEL.y - 2.2],
      valve: () => [VALVE.x + Math.cos(M.valve) * 2.6, VALVE.y + Math.sin(M.valve) * 2.6],
      holo: (now, j) => { const k = clamp((now - j.start) / DUR.holo, 0, 1); return [HOLO.x + 2 + k * 11, HOLO.y + 4 + Math.sin(k * Math.PI) * 2]; },
      rack: (now, j) => { const k = clamp((now - j.start) / DUR.rack, 0, 1); return [RACK.x + 2 + Math.round(k * 2) * 1.6, RACK.y - 1 - Math.sin(k * Math.PI) * 3]; },
      slate: (now, j) => { const k = (now - j.start) * 9; return [SLATE.x + 2 + Math.sin(k) * 1.6 + ((now - j.start) / DUR.slate) * 2, SLATE.y + 1.6 + Math.cos(k * 1.7) * 0.6]; },
    };
    const sound = (fn) => { if (live.current.loud) try { fn(); } catch (e) { /* no audio */ } };
    const effects = {
      lever0: (now) => { M.lever[0].until = now + 1.0; M.flow.push(now); sound(() => alienLock(0)); },
      lever1: (now) => { M.lever[1].until = now + 1.2; M.inject = now + 0.2; sound(() => alienLock(1)); setTimeout(() => sound(() => alienOpen()), 700); },
      lever2: (now) => { M.lever[2].until = now + 0.8; M.scanAt = now + 0.15; sound(() => alienClick(3, 1)); },
      nudgeLever: (now) => { M.lever[2].until = now + 0.35; },
      dial0: () => { M.dialTo[0] += 1.4; M.spike = 1; sound(() => alienClick(2, 0)); },
      dial1: () => { M.dialTo[1] -= 1.4; M.spike = 1; sound(() => alienClick(5, 0)); },
      btns: () => {},
      glass0: (now) => { M.ripple.push({ y: 30, at: now }); M.joltAt = now; sound(() => alienClick(1, 2)); },
      glass1: (now) => { M.ripple.push({ y: 47, at: now }); M.joltAt = now; sound(() => alienClick(1, 2)); },
      glass2: (now) => { M.ripple.push({ y: 64, at: now }); M.joltAt = now; },
      funnel: (now) => { M.pourUntil = now + 1.1; sound(() => chime(392, 0.05)); },
      valve: (now) => { M.valveTo += 4; M.burstAt = now + 0.3; },
      holo: (now) => { M.holoAt = now; },
      rack: () => {},
      slate: (now) => { M.writeUntil = now + 1.2; },
    };
    const busy = (arm, now) => jobs.some((j) => j.arm === arm && now < j.end);
    const schedule = (arm, kind, at, loud) => {
      const dur = DUR[kind] || 1;
      jobs.push({ arm, kind, start: at, end: at + dur, fxAt: at + Math.min(0.45, dur * 0.4), fired: false, loud, lastBtn: -1 });
    };

    const onMove = (e) => { const r = c.getBoundingClientRect(); const u = r.width / 100; lookRef.current = { x: (e.clientX - r.left) / u, y: (e.clientY - r.top) / u, at: performance.now() }; };
    window.addEventListener("pointermove", onMove);

    const draw = (nowMs) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const now = nowMs / 1000;
      const dt = Math.min(0.05, (nowMs - last) / 1000); last = nowMs;
      const t = reduced ? 1 : now;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const Wpx = c.clientWidth, Hpx = c.clientHeight;
      if (!Wpx) return;
      if (c.width !== Math.round(Wpx * dpr)) { c.width = Math.round(Wpx * dpr); c.height = Math.round(Hpx * dpr); }
      const u = Wpx / 100;
      ctx.setTransform(dpr * u, 0, 0, dpr * u, 0, 0);
      ctx.clearRect(0, 0, 100, 100);

      const tr = live.current.traits;
      const em = live.current.embryo;
      const ph = phaseRef.current;
      const since = (nowMs - ph.at) / 1000;
      const k = ph.phase === "anomaly" ? Math.min(1, (nowMs - ph.at) / ANOMALY_MS) : 0;
      const alarmOn = k > 0.2 && k < 0.9;
      const morph = ph.phase === "cocoon" ? Math.min(0.97, 1 - Math.exp(-since / 26)) : 0;
      const frantic = ph.phase === "cocoon" ? 1 : 0;
      const revealK = ph.phase === "reveal" ? since : -1;
      if (ph.phase !== heardPhase) {
        if (ph.phase === "anomaly") play(() => alienDeny());
        if (ph.phase === "cocoon") play(() => labHum(0.15));
        if (ph.phase === "reveal" && heardPhase === "cocoon") { play(() => labHum(0)); play(() => labReveal()); }
        if (ph.phase === "grow" && heardPhase === "cocoon") play(() => labHum(0));
        heardPhase = ph.phase;
      }
      if (ph.phase === "cocoon" && !reduced) {
        if (now > nextHum) { nextHum = now + 1; play(() => labHum(0.15 + morph * 0.85)); }
        if (now > nextZap) { nextZap = now + 0.5 + Math.random() * (1.6 - morph); play(() => labZap(0.04 + morph * 0.05)); }
      }
      let hue = em ? em.hue : 200;
      if (frantic) hue = hue + Math.sin(t * 0.7) * 40 * morph;
      const tint = (l, a) => alarmOn ? `hsla(350,70%,${l}%,${a})` : `hsla(${hue},65%,${l}%,${a})`;

      // ── routines: a new answer, or a nudge ──
      const pr = pulseRef.current;
      if (pr.n !== pr.seen) {
        pr.seen = pr.n;
        if (!reduced && ph.phase === "grow") {
          const list = live.current.big ? BIG : ROUTINES[pr.n % ROUTINES.length];
          jobs = jobs.filter((j) => now < j.start); // the answer interrupts small tasks
          list.forEach(([arm, kind, at]) => schedule(arm, kind, now + at, true));
          if (live.current.big) M.arcAt = now + 0.6;
          M.scanAt = Math.max(M.scanAt, now + 0.05);
        }
      }
      if (nudgeRef.current !== nudgeSeen.current) {
        nudgeSeen.current = nudgeRef.current;
        if (!reduced && !busy(2, now)) schedule(2, nudgeSeen.current % 2 ? "dial0" : "dial1", now, true);
      }
      // ── and the busywork in between ──
      if (!reduced && now > nextIdle && ph.phase !== "anomaly") {
        nextIdle = now + (frantic ? 0.45 + Math.random() * 0.4 : 1.6 + Math.random() * 1.6);
        const free = Object.keys(IDLE).map(Number).filter((a) => !busy(a, now));
        if (free.length) {
          const arm = free[Math.floor(Math.random() * free.length)];
          const opts = IDLE[arm];
          schedule(arm, opts[Math.floor(Math.random() * opts.length)], now, false);
        }
        if (frantic && Math.random() < 0.3 && !busy(3, now)) schedule(3, ["lever0", "lever1", "lever2"][Math.floor(Math.random() * 3)], now, Math.random() < 0.6);
      }
      jobs.forEach((j) => {
        if (!j.fired && now >= j.fxAt) { j.fired = true; live.current.loud = j.loud; effects[j.kind] && effects[j.kind](now); live.current.loud = false; }
        if (j.kind === "btns" && now >= j.start && now < j.end) {
          const kk = Math.floor((now - j.start) * 6) % 6;
          if (kk !== j.lastBtn) { j.lastBtn = kk; const order = [0, 4, 2, 3, 1, 5][kk]; M.lit[order] = now + 0.35; M.spike = Math.max(M.spike, 0.6); if (j.loud) { live.current.loud = true; sound(() => alienClick(order, 1)); live.current.loud = false; } }
        }
      });
      jobs = jobs.filter((j) => now < j.end + 0.1);

      // ── the machinery moves ──
      M.lever.forEach((L) => { const to = now < L.until ? 0.75 : -0.3; L.a = lerp(L.a, to, 1 - Math.exp(-dt * 14)); });
      for (let i = 0; i < 2; i++) M.dial[i] = lerp(M.dial[i], M.dialTo[i], 1 - Math.exp(-dt * 6));
      M.valve = lerp(M.valve, M.valveTo, 1 - Math.exp(-dt * 3));
      M.spike *= Math.exp(-dt * 2.5);
      M.flow = M.flow.filter((f) => now - f < 2.2);
      M.ripple = M.ripple.filter((r) => now - r.at < 1.4);
      M.level = clamp(M.level - M.flow.length * dt * 0.02 + dt * 0.004, 0.35, 0.8);
      if (frantic && (now - M.inject > 3.2)) M.inject = now + 0.1;

      // ── the arms find their targets ──
      arms.forEach((A, i) => {
        const j = jobs.find((jj) => jj.arm === i && now >= jj.start && now < jj.end);
        let target;
        if (ph.phase === "anomaly" && k > 0.15 && k < 0.92) {
          const s = SHOULDERS[i];
          target = [s[0] - 3 - (i % 2) * 2, s[1] + 4 + Math.sin(now * 20 + i) * 0.3]; // pulled in, trembling
        } else if (revealK >= 0 && revealK < 2.2 && i !== 1) {
          const s = SHOULDERS[i];
          target = [s[0] + (i % 2 ? -6 : 6) + Math.sin(now * 3 + i) * 1.2, s[1] - 14 - i * 1.5]; // arms up
        } else if (j) {
          target = anchors[j.kind](now, j);
        } else {
          const r = REST[i];
          target = [r[0] + Math.sin(now * 0.9 + i * 2) * 0.8, r[1] + Math.cos(now * 0.7 + i) * 0.6];
        }
        const kSpring = frantic ? 90 : 55, damp = frantic ? 15 : 12;
        A.v[0] += ((target[0] - A.p[0]) * kSpring - A.v[0] * damp) * dt;
        A.v[1] += ((target[1] - A.p[1]) * kSpring - A.v[1] * damp) * dt;
        A.p[0] += A.v[0] * dt; A.p[1] += A.v[1] * dt;
      });

      // ── where Ixxen looks ──
      const look = lookRef.current && performance.now() - lookRef.current.at < 2500 && lookRef.current.x > 0 && lookRef.current.x < 100 && lookRef.current.y > 0 && lookRef.current.y < 100 ? [lookRef.current.x, lookRef.current.y]
        : now < M.writeUntil ? [SLATE.x + 3, SLATE.y + 2] : [VAT.cx, VAT.cy];

      // ═══════════ the bay ═══════════
      drawRoom(ctx, t, M, alarmOn, hue, jars, frantic);
      // the tank's light on the wall and floor
      const wg = ctx.createRadialGradient(VAT.cx, VAT.cy, 4, VAT.cx, VAT.cy, 46);
      wg.addColorStop(0, tint(60, 0.22 + morph * 0.15 + (alarmOn ? 0.1 : 0))); wg.addColorStop(1, tint(40, 0));
      ctx.fillStyle = wg; ctx.fillRect(0, 0, 100, 100);

      // ═══════════ the tank ═══════════
      drawVatBack(ctx, t, tint);
      ctx.save();
      roundRect(ctx, VAT.x, VAT.y, VAT.w, VAT.h, 5); ctx.clip();
      const flick = k > 0.05 && k < 0.25 ? (Math.random() < 0.3 ? 0.3 : 1) : 1;
      const lg = ctx.createLinearGradient(0, VAT.y, 0, VAT.y + VAT.h);
      lg.addColorStop(0, tint(55, 0.16 * flick)); lg.addColorStop(1, tint(45, (0.42 + morph * 0.2) * flick));
      ctx.fillStyle = lg; ctx.fillRect(VAT.x, VAT.y, VAT.w, VAT.h);
      // the surface
      const surf = VAT.y + 2.2;
      ctx.strokeStyle = tint(80, 0.5); ctx.lineWidth = 0.25;
      ctx.beginPath(); for (let x = VAT.x; x <= VAT.x + VAT.w; x += 1) { const y = surf + Math.sin(x * 0.7 + t * 2) * 0.25 * (1 + frantic * 2); x === VAT.x ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
      const frozen = k > 0 && k < 0.45;
      if (!frozen) frozenAt = t;
      const tt = reduced ? 1 : frozen ? frozenAt : t;
      // what drifts in the liquid
      const env = em ? em.env : "bubbles";
      const burst = now - M.burstAt < 1.2 && now > M.burstAt ? 1 : 0;
      bubbles.forEach((b) => {
        const sp = (env === "dark" ? 0.3 : 1) * (1 + frantic * 2.5 + burst * 3);
        const y = (((b.y - tt * b.v * sp) % 1) + 1) % 1;
        const bx = VAT.x + 1.5 + b.x * (VAT.w - 3) + Math.sin(tt * 2 + b.p) * 0.5, by = surf + 1 + y * (VAT.h - 4);
        ctx.globalAlpha = env === "dark" ? 0.25 : 0.55;
        ctx.strokeStyle = tint(85, 0.9); ctx.fillStyle = tint(80, 0.7); ctx.lineWidth = 0.15;
        if (env === "grains") ctx.fillRect(bx, VAT.y + 3 + (1 - y) * (VAT.h - 5), 0.3, 0.3);
        else if (env === "crystals") { ctx.save(); ctx.translate(bx, by); ctx.rotate(b.p + tt * 0.2); ctx.strokeRect(-b.s * 0.5, -b.s * 0.5, b.s, b.s); ctx.restore(); }
        else if (env === "spores") { ctx.beginPath(); ctx.arc(bx, by, b.s * 0.3, 0, TAU); ctx.fill(); }
        else { ctx.beginPath(); ctx.arc(bx, by, b.s * 0.5, 0, TAU); ctx.stroke(); }
      });
      ctx.globalAlpha = 1;
      // vial poured into the intake: drops fall through the tank
      if (now < M.pourUntil + 1.5) {
        for (let d = 0; d < 8; d++) {
          const age = now - (M.pourUntil - 1.1) - d * 0.12;
          if (age < 0 || age > 1.6) continue;
          const y = VAT.y + 2 + age * age * 30;
          ctx.fillStyle = `hsla(${(hue + 140) % 360},80%,70%,${0.8 - age * 0.45})`;
          ctx.beginPath(); ctx.arc(FUNNEL.x + Math.sin(d * 2.1) * 0.6, y, 0.45, 0, TAU); ctx.fill();
          if (y > VAT.cy - 6) { // it reaches the specimen and swirls
            ctx.strokeStyle = `hsla(${(hue + 140) % 360},80%,70%,${0.35 * (1.6 - age)})`; ctx.lineWidth = 0.2;
            ctx.beginPath(); ctx.arc(VAT.cx, VAT.cy, 4 + age * 6, age * 4, age * 4 + 2); ctx.stroke();
          }
        }
      }
      // ── the specimen ── (drawn in pixels: lib/embryo and lib/specimen think in px)
      let jx = 0, jy = 0;
      const jolt = now - M.joltAt;
      if (jolt > 0 && jolt < 0.6) { jx = Math.sin(jolt * 60) * (0.6 - jolt) * 1.4; }
      const inj = now - M.inject;
      if (inj > 0.55 && inj < 1.2) { jy = Math.sin((inj - 0.55) * 30) * (1.2 - inj) * 1.6; }
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const S = 38 * u, cx = (VAT.cx + jx) * u, cy = (VAT.cy + jy) * u;
      const vx = VAT.x * u, vy = VAT.y * u, vw = VAT.w * u, vh = VAT.h * u;
      if (ph.phase === "reveal") {
        const open = Math.min(1, since / 1.4);
        const im = imgRef.current;
        ctx.save();
        if (im) {
          const s = vw * (0.98 + (1 - open) * 0.2), bob = reduced ? 0 : Math.sin(t * 0.8) * 0.6 * u;
          ctx.globalAlpha = open;
          ctx.drawImage(im, cx - s / 2, cy - s / 2 + bob, s, s);
        } else {
          ctx.globalAlpha = open;
          drawSpecimen(ctx, cx, cy, S, reduced ? 1 : t, tr, { seed: 3 });
        }
        ctx.restore();
        if (open < 1) { ctx.fillStyle = `rgba(255,244,225,${(1 - open) * 0.95})`; ctx.fillRect(vx, vy, vw, vh); }
        // shards of the old shell, drifting away
        if (since < 4) for (let s = 0; s < 14; s++) {
          const a = s * 2.4, d = (3 + since * (4 + (s % 4) * 2)) * u;
          ctx.fillStyle = tint(70, Math.max(0, 0.7 - since * 0.18));
          ctx.save(); ctx.translate(cx + Math.cos(a) * d, cy + Math.sin(a) * d); ctx.rotate(a + since * 2); ctx.scale(u, u);
          ctx.beginPath(); ctx.moveTo(0, -0.9); ctx.lineTo(0.7, 0.6); ctx.lineTo(-0.6, 0.5); ctx.fill(); ctx.restore();
        }
      } else if (em && ph.phase === "cocoon") {
        drawMorph(ctx, off, dpr, cx, cy, S, reduced ? 1 : t, em, tr, morph, since, tint);
      } else if (em) {
        // the anomaly's beats (see docs/WORLD.md - deliberately unexplained)
        if (k > 0.4 && k < 0.62) {
          const a = Math.sin(((k - 0.4) / 0.22) * Math.PI);
          ctx.strokeStyle = `rgba(233,210,154,${a * 0.85})`; ctx.lineWidth = 2;
          ctx.beginPath(); SIGIL.forEach(([x, y], i) => { const px = cx + x * S * 0.36, py = cy + y * S * 0.36; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, cy, S * 0.18, 0, TAU); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx, cy - S * 0.5); ctx.lineTo(cx, cy + S * 0.5); ctx.stroke();
        }
        if (k > 0.45 && k < 0.8) {
          const rr = ((k - 0.45) / 0.35) * vw * 1.6;
          ctx.strokeStyle = `rgba(185,192,255,${0.6 * (1 - (k - 0.45) / 0.35)})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(vx - vw * 0.3, cy, rr, 0, TAU); ctx.stroke();
        }
        const stare = k > 0.6 && k < 0.88 ? Math.min(1, (k - 0.6) / 0.06) : 0;
        const wrong = k > 0.7 && k < 0.8 ? Math.sin(((k - 0.7) / 0.1) * Math.PI) : 0;
        const lookPx = lookRef.current ? { x: lookRef.current.x * u, y: lookRef.current.y * u } : null;
        drawEmbryo(ctx, cx, cy, S, reduced ? 1 : t, em, { look: lookPx, freeze: frozen, frozenAt, stare, wrong, cocoon: k > 0.88 ? (k - 0.88) / 0.12 * 0.4 : 0 });
      } else {
        drawSpecimen(ctx, cx, cy, S, reduced ? 1 : t, tr, { seed: 3 });
      }
      ctx.restore(); // back to scene units
      // the injector's needle, in the liquid
      if (inj > 0 && inj < 1.6) {
        const d = inj < 0.45 ? smooth(0, 0.45, inj) : inj < 1.0 ? 1 : 1 - smooth(1.0, 1.6, inj);
        const tipY = VAT.y + 1 + d * 22;
        ctx.strokeStyle = "#C9D0E8"; ctx.lineWidth = 0.35;
        ctx.beginPath(); ctx.moveTo(VAT.cx, VAT.y - 1); ctx.lineTo(VAT.cx, tipY); ctx.stroke();
        if (inj > 0.5 && inj < 1.0) {
          const g = ctx.createRadialGradient(VAT.cx, tipY, 0, VAT.cx, tipY, 6);
          g.addColorStop(0, "rgba(255,240,200,0.9)"); g.addColorStop(1, "rgba(255,240,200,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(VAT.cx, tipY, 6, 0, TAU); ctx.fill();
        }
      }
      // ripples where the glass was tapped
      M.ripple.forEach((r) => {
        const a = (now - r.at) / 1.4;
        ctx.strokeStyle = tint(85, 0.5 * (1 - a)); ctx.lineWidth = 0.2;
        ctx.beginPath(); ctx.arc(VAT.x, r.y, 1 + a * 14, -1.2, 1.2); ctx.stroke();
      });
      // the scan: a bar of light down the tank on every answer
      const ps = now - M.scanAt;
      if (ps > 0 && ps < 1.4 && (ph.phase === "grow")) {
        const y = VAT.y + VAT.h * (ps / 1.4);
        const sg = ctx.createLinearGradient(0, y - 5, 0, y + 0.6);
        sg.addColorStop(0, "rgba(139,149,246,0)"); sg.addColorStop(1, "rgba(185,192,255,0.55)");
        ctx.fillStyle = sg; ctx.fillRect(VAT.x, y - 5, VAT.w, 5.6);
        ctx.fillStyle = "#E9D29A"; ctx.fillRect(VAT.x, y, VAT.w, 0.25);
      }
      ctx.restore(); // out of the glass

      // the live feed: what the tank holds, for the card below
      try {
        const fx = (VAT.cx - 19) * u * dpr, fy = (VAT.cy - 13.06) * u * dpr, fw = 38 * u * dpr, fh = 26.12 * u * dpr;
        const fctx = feed.getContext("2d");
        fctx.fillStyle = "#06070F"; fctx.fillRect(0, 0, feed.width, feed.height);
        fctx.drawImage(c, fx, fy, fw, fh, 0, 0, feed.width, feed.height);
      } catch (e) { /* ignore */ }

      drawVatFront(ctx, t, M, now, tint, alarmOn, frantic, morph);

      // ═══════════ Ixxen ═══════════
      const mood = ph.phase === "anomaly" && k > 0.15 && k < 0.92 ? "alarmed" : frantic ? "intent" : revealK >= 0 && revealK < 4 ? "proud" : "work";
      const ix = { t, now, look, mood, hue, alarm: alarmOn, writing: now < M.writeUntil, loupe: frantic || jobs.some((j) => j.kind.startsWith("glass") && now < j.end) };
      BACK_ARMS.forEach((i) => drawArm(ctx, i, arms[i].p, t, hue, false));
      drawIxxen(ctx, ix);
      drawConsole(ctx, t, M, now, alarmOn, hue);
      drawHolo(ctx, t, M, now, alarmOn, hue, morph);
      FRONT_ARMS.forEach((i) => { if (i === 1) drawSlate(ctx, arms[1].p, t, M, now); drawArm(ctx, i, arms[i].p, t, hue, i === 1); });

      // the instruments, a few times a second
      if (now - lastRead > 0.35) {
        lastRead = now;
        if (em) {
          const stg = ph.phase === "reveal" ? 4 : ph.phase === "grow" ? em.stage : 3;
          const cells = em.cells + (ph.phase === "grow" ? 0 : Math.floor(Math.random() * 40 + morph * 400));
          const act = ph.phase === "anomaly" && k < 0.45 ? 0 : em.activity + (Math.random() - 0.5) * 0.08 + morph * 0.8;
          setReadout(`STAGE ${STAGE_NAMES[stg]} · CELLS ${cells} · ACTIVITY ${act.toFixed(2)} · ${Math.round(300 + em.growth * 40 + morph * 120 + (alarmOn ? 60 : 0))}K`);
        }
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); io && io.disconnect(); setLabMirror(null); play(() => labHum(0)); };
  }, []);

  return (
    <div className={`lab-vat lab-scene ${alarm ? "lab-vat-alarm" : ""}`} data-phase={phase}>
      <canvas ref={ref} className="lab-scene-canvas" aria-label="The Alien Lab: Ixxen at work beside the tank where your species is growing" role="img" />
      <div className="mono lab-vat-label">{label}</div>
      <div className="mono lab-vat-read">{embryo ? (alarm ? "▲ UNCLASSIFIED EVENT · NO MATCHING RECORD" : readout) : specimenReadout(traits)}</div>
    </div>
  );
}

// ─────────── drawing helpers ───────────

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
}
function glow(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function drawRoom(ctx, t, M, alarm, hue, jars, frantic) {
  // back wall
  const w = ctx.createLinearGradient(0, 0, 0, 92);
  w.addColorStop(0, "#0a1418"); w.addColorStop(1, "#070912");
  ctx.fillStyle = w; ctx.fillRect(0, 0, 100, 92);
  // wall panels
  ctx.strokeStyle = "rgba(111,195,168,0.08)"; ctx.lineWidth = 0.2;
  for (let x = 0; x < 100; x += 12.5) { ctx.beginPath(); ctx.moveTo(x, 9); ctx.lineTo(x, 92); ctx.stroke(); }
  for (let y = 34; y < 92; y += 19) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(100, y); ctx.stroke(); }
  // rivets
  ctx.fillStyle = "rgba(111,195,168,0.12)";
  for (let x = 0; x < 100; x += 12.5) for (let y = 12; y < 92; y += 19) { ctx.beginPath(); ctx.arc(x + 1, y, 0.25, 0, TAU); ctx.fill(); }
  // ceiling pipes
  ctx.fillStyle = "#0d1220"; ctx.fillRect(0, 0, 100, 2.4);
  [[3.2, 1.1, "#1b2236"], [5.2, 0.7, "#151b2c"]].forEach(([y, r, col]) => {
    ctx.strokeStyle = col; ctx.lineWidth = r * 2; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(100, y); ctx.stroke();
    ctx.strokeStyle = "rgba(185,192,255,0.12)"; ctx.lineWidth = 0.2; ctx.beginPath(); ctx.moveTo(0, y - r * 0.6); ctx.lineTo(100, y - r * 0.6); ctx.stroke();
  });
  for (let x = 6; x < 100; x += 14) { ctx.fillStyle = "#222a42"; ctx.fillRect(x, 1.8, 1.2, 4.6); }
  // the beacon: slow amber, or red in the anomaly
  const bx = 4, by = 9;
  ctx.fillStyle = "#1a1f30"; ctx.fillRect(bx - 1.4, by - 0.6, 2.8, 1.2);
  const beam = alarm ? 0.6 + 0.4 * Math.sin(t * 14) : 0.25 + 0.2 * Math.sin(t * 2);
  glow(ctx, bx, by + 1.2, alarm ? 16 : 4, alarm ? `rgba(240,70,90,${beam * 0.5})` : `rgba(233,210,154,${beam * 0.5})`);
  ctx.fillStyle = alarm ? "#F04A5A" : "#E9D29A"; ctx.globalAlpha = 0.5 + beam * 0.5;
  ctx.beginPath(); ctx.arc(bx, by + 1.1, 0.9, 0, Math.PI); ctx.fill(); ctx.globalAlpha = 1;
  // shelves of older specimens
  [14, 26].forEach((sy, row) => {
    ctx.fillStyle = "#151a2a"; ctx.fillRect(1, sy, 30, 0.9);
    ctx.fillStyle = "rgba(185,192,255,0.1)"; ctx.fillRect(1, sy, 30, 0.25);
    for (let i = 0; i < 4 + row; i++) {
      const j = jars[(i + row * 4) % jars.length];
      const x = 2.6 + i * (row ? 5.6 : 7), h = row ? 5.5 : 7.5, wj = row ? 3.4 : 4.4;
      const jy = sy - h;
      ctx.fillStyle = `hsla(${j.h},60%,45%,0.18)`; roundRect(ctx, x, jy, wj, h, 0.8); ctx.fill();
      ctx.strokeStyle = "rgba(200,210,255,0.25)"; ctx.lineWidth = 0.15; ctx.stroke();
      ctx.fillStyle = "#2a3048"; ctx.fillRect(x - 0.2, jy - 0.7, wj + 0.4, 0.8);
      // something curled inside, glowing faintly
      ctx.save(); ctx.translate(x + wj / 2, jy + h * 0.55);
      ctx.strokeStyle = `hsla(${j.h},70%,70%,${0.35 + 0.15 * Math.sin(t * 1.3 + j.k)})`; ctx.lineWidth = 0.25;
      ctx.beginPath();
      if (j.k % 3 === 0) { ctx.arc(0, 0, wj * 0.25, 0.3, TAU - 0.6); ctx.moveTo(wj * 0.2, 0.3); ctx.lineTo(wj * 0.3, h * 0.3); }
      else if (j.k % 3 === 1) { for (let a = 0; a < 5; a++) { ctx.moveTo(0, 0); ctx.quadraticCurveTo(Math.cos(a * 1.25) * wj * 0.5, Math.sin(a * 1.25) * h * 0.2, Math.cos(a * 1.25 + 0.4) * wj * 0.35, Math.sin(a * 1.25 + 0.4) * h * 0.3); } }
      else { ctx.ellipse(0, 0, wj * 0.2, h * 0.28, 0.3, 0, TAU); ctx.moveTo(-wj * 0.1, -h * 0.05); ctx.arc(-wj * 0.06, -h * 0.05, 0.25, 0, TAU); }
      ctx.stroke(); ctx.restore();
      glow(ctx, x + wj / 2, jy + h / 2, wj, `hsla(${j.h},70%,60%,0.08)`);
    }
  });
  // a wall screen: the specimen's genome, turning
  const sx = 36, sy = 10, sw = 12, sh = 9;
  ctx.fillStyle = "#06101a"; roundRect(ctx, sx, sy, sw, sh, 0.8); ctx.fill();
  ctx.strokeStyle = "rgba(111,195,168,0.35)"; ctx.lineWidth = 0.2; ctx.stroke();
  ctx.save(); roundRect(ctx, sx, sy, sw, sh, 0.8); ctx.clip();
  for (let i = 0; i < 18; i++) {
    const x = sx + 0.6 + i * 0.62, ph = t * (2 + frantic * 4) + i * 0.55;
    const y1 = sy + sh / 2 + Math.sin(ph) * 2.8, y2 = sy + sh / 2 - Math.sin(ph) * 2.8;
    ctx.strokeStyle = `hsla(${hue},60%,70%,0.35)`; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();
    ctx.fillStyle = Math.cos(ph) > 0 ? "#6FC3A8" : "#E8B4C8"; ctx.beginPath(); ctx.arc(x, y1, 0.3, 0, TAU); ctx.fill();
    ctx.fillStyle = Math.cos(ph) > 0 ? "#E8B4C8" : "#6FC3A8"; ctx.beginPath(); ctx.arc(x, y2, 0.3, 0, TAU); ctx.fill();
  }
  ctx.restore();
  // the floor
  const f = ctx.createLinearGradient(0, 90, 0, 100);
  f.addColorStop(0, "#0b0e1c"); f.addColorStop(1, "#05060d");
  ctx.fillStyle = f; ctx.fillRect(0, 90, 100, 10);
  ctx.strokeStyle = "rgba(111,195,168,0.12)"; ctx.lineWidth = 0.15;
  for (let x = -20; x < 120; x += 7) { ctx.beginPath(); ctx.moveTo(50 + (x - 50) * 0.7, 90); ctx.lineTo(x, 100); ctx.stroke(); }
  // the reservoir, on the right
  const rx = 87.5, ry = 30, rw = 9.5, rh = 50;
  ctx.fillStyle = "#121628"; ctx.fillRect(rx - 1, ry + rh, rw + 2, 10); ctx.fillRect(rx - 1, ry - 3, rw + 2, 3);
  ctx.fillStyle = "rgba(160,190,255,0.05)"; roundRect(ctx, rx, ry, rw, rh, 1.4); ctx.fill();
  const lvl = ry + rh * (1 - M.level);
  const fg = ctx.createLinearGradient(0, lvl, 0, ry + rh);
  fg.addColorStop(0, `hsla(${(hue + 140) % 360},70%,55%,0.45)`); fg.addColorStop(1, `hsla(${(hue + 140) % 360},70%,35%,0.6)`);
  ctx.fillStyle = fg; ctx.fillRect(rx + 0.3, lvl, rw - 0.6, ry + rh - lvl - 0.3);
  for (let i = 0; i < 6; i++) { const y = ry + rh - ((t * 6 + i * 9) % (ry + rh - lvl)); ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 0.12; ctx.beginPath(); ctx.arc(rx + 2 + (i * 1.4) % (rw - 3), y, 0.35, 0, TAU); ctx.stroke(); }
  ctx.strokeStyle = "rgba(200,210,255,0.35)"; ctx.lineWidth = 0.2; roundRect(ctx, rx, ry, rw, rh, 1.4); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(rx + 1, ry + 2, 0.7, rh - 4);
  // its gauges follow the dials
  [[rx + 2.4, 84.5, M.dial[0]], [rx + 7.2, 84.5, M.dial[1]]].forEach(([gx, gy, a]) => {
    ctx.fillStyle = "#0a0d1a"; ctx.beginPath(); ctx.arc(gx, gy, 2, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#4A5080"; ctx.lineWidth = 0.25; ctx.stroke();
    ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = 0.2; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(a * 0.6 - 2) * 1.6, gy + Math.sin(a * 0.6 - 2) * 1.6); ctx.stroke();
  });
  // the feed pipe: reservoir -> ceiling -> tank cap
  const pipe = [[rx + rw / 2, ry - 3], [rx + rw / 2, 7.5], [75, 7.5], [75, VAT.y - 5.5]];
  ctx.strokeStyle = "#1c2338"; ctx.lineWidth = 1.6; ctx.lineJoin = "round";
  ctx.beginPath(); pipe.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  ctx.strokeStyle = "rgba(185,192,255,0.18)"; ctx.lineWidth = 0.25;
  ctx.beginPath(); pipe.forEach(([x, y], i) => (i ? ctx.lineTo(x - 0.5, y - 0.5) : ctx.moveTo(x - 0.5, y - 0.5))); ctx.stroke();
  // pulses of fluid along it
  const segs = []; let total = 0;
  for (let i = 1; i < pipe.length; i++) { const L = Math.hypot(pipe[i][0] - pipe[i - 1][0], pipe[i][1] - pipe[i - 1][1]); segs.push(L); total += L; }
  const at = (d) => { for (let i = 0; i < segs.length; i++) { if (d <= segs[i]) { const k = d / segs[i]; return [lerp(pipe[i][0], pipe[i + 1][0], k), lerp(pipe[i][1], pipe[i + 1][1], k)]; } d -= segs[i]; } return pipe[pipe.length - 1]; };
  const nowS = performance.now() / 1000;
  M.flow.forEach((f0) => {
    for (let b = 0; b < 4; b++) {
      const d = (nowS - f0 - b * 0.08) / 1.6 * total;
      if (d < 0 || d > total) continue;
      const [x, y] = at(d);
      glow(ctx, x, y, 2.2, `hsla(${(hue + 140) % 360},90%,70%,0.6)`);
    }
  });
  // a valve on the pipe into the tank's base
  ctx.strokeStyle = "#1c2338"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(VALVE.x, VALVE.y); ctx.lineTo(VAT.x + 4, VALVE.y); ctx.stroke();
}

function drawVatBack(ctx, t, tint) {
  // base and pedestal
  const bx = VAT.x - 3, bw = VAT.w + 6, by = VAT.y + VAT.h;
  const g = ctx.createLinearGradient(bx, 0, bx + bw, 0);
  g.addColorStop(0, "#151a2e"); g.addColorStop(0.45, "#2a3150"); g.addColorStop(1, "#10142a");
  ctx.fillStyle = g; roundRect(ctx, bx, by, bw, 9, 1.4); ctx.fill();
  ctx.fillStyle = "#0c0f1e"; ctx.fillRect(bx + 3, by + 9, bw - 6, 2);
  // the ring of light at the base
  ctx.fillStyle = tint(65, 0.8); ctx.fillRect(bx + 1.5, by + 1.6, bw - 3, 0.5);
  glow(ctx, VAT.cx, by + 1.8, 9, tint(65, 0.25));
  // bolts and the plaque
  ctx.fillStyle = "#4a5378";
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(bx + 2.2 + i * ((bw - 4.4) / 5), by + 4.8, 0.35, 0, TAU); ctx.fill(); }
  ctx.fillStyle = "#0a0c18"; ctx.fillRect(VAT.cx - 4, by + 5.6, 8, 2.2);
  ctx.fillStyle = "#C9B98F"; ctx.font = "1.5px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("XB-13 · ⟡", VAT.cx, by + 6.75);
  // side struts
  ctx.fillStyle = "#1a2036";
  ctx.fillRect(VAT.x - 2.2, VAT.y - 2, 1.4, VAT.h + 3); ctx.fillRect(VAT.x + VAT.w + 0.8, VAT.y - 2, 1.4, VAT.h + 3);
}

function drawVatFront(ctx, t, M, now, tint, alarm, frantic, morph) {
  // the glass
  ctx.strokeStyle = alarm ? "rgba(224,106,120,0.75)" : "rgba(185,200,255,0.55)"; ctx.lineWidth = 0.4;
  roundRect(ctx, VAT.x, VAT.y, VAT.w, VAT.h, 5); ctx.stroke();
  const hl = ctx.createLinearGradient(VAT.x, 0, VAT.x + VAT.w, 0);
  hl.addColorStop(0, "rgba(255,255,255,0.14)"); hl.addColorStop(0.1, "rgba(255,255,255,0.03)"); hl.addColorStop(0.82, "rgba(255,255,255,0)"); hl.addColorStop(0.93, "rgba(255,255,255,0.1)"); hl.addColorStop(1, "rgba(255,255,255,0.02)");
  ctx.fillStyle = hl; roundRect(ctx, VAT.x, VAT.y, VAT.w, VAT.h, 5); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.16)"; ctx.fillRect(VAT.x + 2, VAT.y + 4, 0.6, VAT.h - 10);
  // measuring marks
  ctx.strokeStyle = "rgba(185,200,255,0.25)"; ctx.lineWidth = 0.12;
  for (let y = VAT.y + 8; y < VAT.y + VAT.h - 4; y += 4) { ctx.beginPath(); ctx.moveTo(VAT.x + VAT.w - 2.4, y); ctx.lineTo(VAT.x + VAT.w - (y % 8 < 4 ? 0.8 : 1.4), y); ctx.stroke(); }
  // the cap
  const cy = VAT.y - 6.5;
  const g = ctx.createLinearGradient(0, cy, 0, cy + 7);
  g.addColorStop(0, "#2c3456"); g.addColorStop(0.5, "#1a2038"); g.addColorStop(1, "#0f1326");
  ctx.fillStyle = g; roundRect(ctx, VAT.x - 3, cy, VAT.w + 6, 7, 1.4); ctx.fill();
  ctx.strokeStyle = "rgba(185,192,255,0.2)"; ctx.lineWidth = 0.15; ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const on = alarm ? Math.random() < 0.5 : Math.sin(t * (3 + frantic * 6) + i) > 0.3;
    ctx.fillStyle = alarm ? (on ? "#E06A78" : "#3A3E75") : on ? "#E9D29A" : "#3A3E75";
    ctx.fillRect(VAT.x + 1 + i * 2.2, cy + 2.6, 1.3, 0.8);
  }
  // the intake funnel (vials are poured in here)
  ctx.fillStyle = "#2a3150"; ctx.beginPath(); ctx.moveTo(FUNNEL.x - 2, FUNNEL.y - 2); ctx.lineTo(FUNNEL.x + 2, FUNNEL.y - 2); ctx.lineTo(FUNNEL.x + 0.6, FUNNEL.y + 0.8); ctx.lineTo(FUNNEL.x - 0.6, FUNNEL.y + 0.8); ctx.closePath(); ctx.fill();
  if (now < M.pourUntil) glow(ctx, FUNNEL.x, FUNNEL.y - 1, 3, "rgba(160,255,220,0.5)");
  // the coils: they charge, and in the transformation they never stop arcing
  const coils = [VAT.x + 2.2, VAT.x + VAT.w - 2.2];
  coils.forEach((x) => {
    ctx.fillStyle = "#1a2036"; ctx.fillRect(x - 0.7, cy - 6, 1.4, 6);
    ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.22;
    for (let y = cy - 5.5; y < cy - 0.5; y += 0.7) { ctx.beginPath(); ctx.moveTo(x - 0.9, y); ctx.lineTo(x + 0.9, y + 0.35); ctx.stroke(); }
    const charge = frantic ? 0.7 + 0.3 * Math.sin(t * 20 + x) : 0.25 + 0.15 * Math.sin(t * 2 + x);
    glow(ctx, x, cy - 7, 2.8 + charge * 2, tint(75, 0.35 * charge + 0.1));
    ctx.fillStyle = "#3a4268"; ctx.beginPath(); ctx.arc(x, cy - 7, 1.2, 0, TAU); ctx.fill();
    ctx.fillStyle = tint(85, 0.6 * charge); ctx.beginPath(); ctx.arc(x - 0.3, cy - 7.3, 0.5, 0, TAU); ctx.fill();
  });
  const arcing = frantic || (now > M.arcAt && now - M.arcAt < 0.9);
  if (arcing) {
    // between the coils
    for (let a = 0; a < (frantic ? 2 : 1); a++) {
      ctx.strokeStyle = `rgba(220,235,255,${0.5 + Math.random() * 0.5})`; ctx.lineWidth = 0.2 + Math.random() * 0.2;
      ctx.beginPath(); ctx.moveTo(coils[0], cy - 7);
      for (let s = 1; s < 10; s++) ctx.lineTo(lerp(coils[0], coils[1], s / 10), cy - 7 - Math.sin((s / 10) * Math.PI) * 3 + (Math.random() - 0.5) * 2.4);
      ctx.lineTo(coils[1], cy - 7); ctx.stroke();
    }
    glow(ctx, VAT.cx, cy - 8, 12, "rgba(200,220,255,0.12)");
    // and down into the tank, at the specimen
    if (frantic && Math.random() < 0.55 + morph * 0.3) {
      ctx.save(); roundRect(ctx, VAT.x, VAT.y, VAT.w, VAT.h, 5); ctx.clip();
      const from = coils[Math.random() < 0.5 ? 0 : 1];
      ctx.strokeStyle = `hsla(${Math.random() * 60 + 190},90%,85%,${0.5 + Math.random() * 0.4})`; ctx.lineWidth = 0.15 + Math.random() * 0.2;
      ctx.beginPath(); ctx.moveTo(from, VAT.y);
      for (let s = 1; s <= 8; s++) ctx.lineTo(lerp(from, VAT.cx, s / 8) + (Math.random() - 0.5) * 3, lerp(VAT.y, VAT.cy, s / 8) + (Math.random() - 0.5) * 2);
      ctx.stroke(); ctx.restore();
    }
  }
  // the injector, on its ceiling rail
  const inj = now - M.inject;
  const d = inj > 0 && inj < 1.6 ? (inj < 0.45 ? smooth(0, 0.45, inj) : inj < 1.0 ? 1 : 1 - smooth(1.0, 1.6, inj)) : 0;
  ctx.fillStyle = "#1c2338"; ctx.fillRect(VAT.cx - 9, 6.4, 18, 0.8);
  ctx.fillStyle = "#2c3456"; roundRect(ctx, VAT.cx - 2, 6.6 + d * 1.2, 4, 3.4, 0.6); ctx.fill();
  ctx.fillStyle = d > 0.9 ? "#E9D29A" : "#6FC3A8"; ctx.fillRect(VAT.cx - 0.5, 7.4 + d * 1.2, 1, 0.5);
  ctx.strokeStyle = "#8A93B8"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(VAT.cx, 10 + d * 1.2); ctx.lineTo(VAT.cx, cy + 0.2); ctx.stroke();
}

function drawConsole(ctx, t, M, now, alarm, hue) {
  // the desk: a slanted top and a deep front
  const top = (x) => DESK(x);
  ctx.fillStyle = "#1d2440";
  ctx.beginPath(); ctx.moveTo(0, top(0)); ctx.lineTo(48.5, top(48.5)); ctx.lineTo(48.5, top(48.5) + 2.2); ctx.lineTo(0, top(0) + 2.2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "rgba(185,192,255,0.22)"; ctx.fillRect(0, top(0) - 0.1, 48.5, 0.25);
  const g = ctx.createLinearGradient(0, 76, 0, 100);
  g.addColorStop(0, "#141a30"); g.addColorStop(1, "#080a14");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, top(0) + 2.2); ctx.lineTo(48.5, top(48.5) + 2.2); ctx.lineTo(48.5, 100); ctx.lineTo(0, 100); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(111,195,168,0.25)"; ctx.lineWidth = 0.15;
  ctx.beginPath(); ctx.moveTo(0, 88); ctx.lineTo(48.5, 88); ctx.stroke();
  // a strip of status light along the front
  for (let i = 0; i < 22; i++) { const on = Math.sin(t * 2.4 + i * 0.7) > 0.4; ctx.fillStyle = alarm ? (on ? "#E06A78" : "#2a1a24") : on ? `hsla(${hue},70%,70%,0.8)` : "#1a2034"; ctx.fillRect(1.2 + i * 2.1, 89.5, 1.3, 0.5); }
  // alien glyph labels
  ctx.fillStyle = "rgba(201,185,143,0.55)"; ctx.font = "1.3px monospace"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillText("⌖ ⟟ ⍙ ⏁", 2, 92.5); ctx.fillText("⟡ ⌸ ⏃ ⍥", 20, 92.5);
  // vents
  ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 0.35;
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(33 + i * 1.6, 93); ctx.lineTo(33 + i * 1.6, 97); ctx.stroke(); }
  // the vial rack
  ctx.fillStyle = "#2a3150"; ctx.fillRect(RACK.x, RACK.y + 2.6, 7, 1);
  for (let i = 0; i < 4; i++) {
    const x = RACK.x + 0.8 + i * 1.6, hh = 3.2;
    ctx.fillStyle = `hsla(${(hue + 100 + i * 50) % 360},70%,60%,0.65)`; ctx.fillRect(x, RACK.y + 0.6, 0.9, hh - 1.2);
    ctx.strokeStyle = "rgba(220,230,255,0.4)"; ctx.lineWidth = 0.12; ctx.strokeRect(x, RACK.y - 0.6, 0.9, hh);
  }
  // levers
  LEVERS.forEach((L, i) => {
    const a = M.lever[i].a;
    ctx.fillStyle = "#0d1020"; ctx.fillRect(L.x - 1.3, L.y - 0.5, 2.6, 1.2);
    ctx.strokeStyle = "#8A93B8"; ctx.lineWidth = 0.55; ctx.lineCap = "round";
    const tx = L.x + Math.sin(a) * 6.2, ty = L.y - Math.cos(a) * 6.2;
    ctx.beginPath(); ctx.moveTo(L.x, L.y); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.fillStyle = ["#C97B6E", "#E9D29A", "#6FC3A8"][i]; ctx.beginPath(); ctx.arc(tx, ty, 0.95, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.arc(tx - 0.3, ty - 0.3, 0.3, 0, TAU); ctx.fill();
    if (a > 0.3) glow(ctx, tx, ty, 2.5, "rgba(233,210,154,0.35)");
  });
  // dials
  DIALS.forEach((D, i) => {
    ctx.fillStyle = "#0a0d1a"; ctx.beginPath(); ctx.arc(D.x, D.y, 2.6, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#3A4270"; ctx.lineWidth = 0.25; ctx.stroke();
    for (let k = 0; k < 9; k++) { const a = -Math.PI * 1.2 + k * 0.3; ctx.strokeStyle = k > 6 ? "#C97B6E" : "#565B8F"; ctx.beginPath(); ctx.moveTo(D.x + Math.cos(a) * 2.2, D.y + Math.sin(a) * 2.2); ctx.lineTo(D.x + Math.cos(a) * 2.55, D.y + Math.sin(a) * 2.55); ctx.stroke(); }
    const kg = ctx.createRadialGradient(D.x - 0.5, D.y - 0.5, 0.2, D.x, D.y, 1.9);
    kg.addColorStop(0, "#5a6496"); kg.addColorStop(1, "#1e2440");
    ctx.fillStyle = kg; ctx.beginPath(); ctx.arc(D.x, D.y, 1.8, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#E9D29A"; ctx.lineWidth = 0.3; ctx.beginPath(); ctx.moveTo(D.x, D.y); ctx.lineTo(D.x + Math.cos(M.dial[i]) * 1.6, D.y + Math.sin(M.dial[i]) * 1.6); ctx.stroke();
  });
  // buttons
  BTNS.forEach(([x, y], i) => {
    const lit = now < M.lit[i];
    const col = ["#6FC3A8", "#E8B4C8", "#E9D29A", "#8B95F6", "#C97B6E", "#8FE6FF"][i];
    if (lit) glow(ctx, x, y, 2.4, col + "88");
    ctx.fillStyle = lit ? col : "#20263f"; roundRect(ctx, x - 1.15, y - 0.9, 2.3, 1.8, 0.4); ctx.fill();
    ctx.strokeStyle = col; ctx.globalAlpha = lit ? 1 : 0.45; ctx.lineWidth = 0.15; ctx.stroke(); ctx.globalAlpha = 1;
  });
  // the valve wheel
  ctx.save(); ctx.translate(VALVE.x, VALVE.y); ctx.rotate(M.valve);
  ctx.strokeStyle = "#C97B6E"; ctx.lineWidth = 0.55; ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, TAU); ctx.stroke();
  for (let s = 0; s < 4; s++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(s * Math.PI / 2) * 2.6, Math.sin(s * Math.PI / 2) * 2.6); ctx.stroke(); }
  ctx.fillStyle = "#2a3150"; ctx.beginPath(); ctx.arc(0, 0, 0.7, 0, TAU); ctx.fill();
  ctx.restore();
}

function drawHolo(ctx, t, M, now, alarm, hue, morph) {
  const { x, y, w, h } = HOLO;
  ctx.save();
  // the projector stalk
  ctx.strokeStyle = "#1c2338"; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(x + w / 2, DESK(x + w / 2)); ctx.lineTo(x + w / 2, y + h + 1.2); ctx.stroke();
  ctx.fillStyle = "#2a3150"; ctx.fillRect(x + w / 2 - 1.5, y + h + 0.8, 3, 0.8);
  const col = alarm ? "224,106,120" : "111,195,168";
  const fl = 0.85 + Math.random() * 0.15;
  ctx.fillStyle = `rgba(${col},${0.08 * fl})`; ctx.strokeStyle = `rgba(${col},${0.55 * fl})`; ctx.lineWidth = 0.15;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y - 1); ctx.lineTo(x + w, y + h - 1); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill(); ctx.stroke();
  // scan lines
  ctx.strokeStyle = `rgba(${col},0.08)`;
  for (let yy = y + 0.6; yy < y + h; yy += 0.8) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy - 1); ctx.stroke(); }
  // a waveform that jumps when the controls are worked
  ctx.strokeStyle = `rgba(${col},0.9)`; ctx.lineWidth = 0.18; ctx.beginPath();
  for (let i = 0; i <= 40; i++) {
    const xx = x + 0.6 + (i / 40) * (w - 1.2);
    const amp = 0.6 + M.spike * 2.4 + morph * 1.5;
    const yy = y + h * 0.42 - (i / 40) + Math.sin(i * 0.9 + t * 6) * amp * 0.5 + Math.sin(i * 2.3 - t * 9) * amp * 0.25 * (alarm ? 3 : 1);
    i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy);
  }
  ctx.stroke();
  // glyph readouts
  ctx.fillStyle = `rgba(${col},0.7)`; ctx.font = "1.1px monospace"; ctx.textAlign = "left";
  const G = "⟡⌬⏃⍜⟁◬⋔⏚⌖⟟⍙⏁";
  for (let r = 0; r < 2; r++) { let s = ""; for (let i = 0; i < 9; i++) s += G[(Math.floor(t * (2 + r)) + i * 5 + r * 3) % G.length]; ctx.fillText(s, x + 0.8, y + h * 0.72 + r * 1.4 - 0.4); }
  // a swipe leaves a trail
  const sw = now - M.holoAt;
  if (sw > 0 && sw < 1.2) { ctx.fillStyle = `rgba(${col},${0.3 * (1.2 - sw)})`; ctx.fillRect(x + sw / 1.2 * w - 1.5, y, 3, h - 0.5); }
  ctx.restore();
}

function drawSlate(ctx, p, t, M, now) {
  // the slate Ixxen writes everything down on (held by its upper left hand)
  ctx.save();
  ctx.translate(p[0] - 2.5, p[1] - 0.5); ctx.rotate(-0.25);
  ctx.fillStyle = "#0b0e22"; roundRect(ctx, -2, -3, 8, 5.6, 0.6); ctx.fill();
  ctx.strokeStyle = "#8B95F6"; ctx.lineWidth = 0.18; ctx.stroke();
  ctx.strokeStyle = "rgba(139,149,246,0.85)"; ctx.lineWidth = 0.12;
  if (now < M.writeUntil) M.strokes = Math.min(14, M.strokes + 0.12);
  const n = Math.floor(M.strokes);
  for (let i = 0; i < n; i++) {
    const row = i % 7, x0 = -1.2 + (i > 6 ? 3.4 : 0);
    ctx.beginPath(); ctx.moveTo(x0, -2 + row * 0.7);
    for (let s = 0; s < 4; s++) ctx.lineTo(x0 + 0.5 + s * 0.6, -2 + row * 0.7 + Math.sin(i * 3 + s) * 0.2);
    ctx.stroke();
  }
  if (M.strokes >= 14 && now > M.writeUntil + 3) M.strokes = 0;
  ctx.restore();
}

// ─────────── Ixxen ───────────
const SKIN = ["#A9B2E0", "#6E77AE", "#2F3466"];

function drawIxxen(ctx, ix) {
  const { t, look, mood, hue, alarm } = ix;
  const breath = Math.sin(t * 1.4) * 0.35;
  const lean = mood === "alarmed" ? -0.12 : mood === "intent" ? 0.1 : mood === "proud" ? -0.04 : 0.04 + Math.sin(t * 0.5) * 0.03;
  ctx.save();
  ctx.translate(22.5, 80); ctx.rotate(lean); ctx.translate(-22.5, -80);
  const rim = alarm ? "rgba(240,90,110,0.7)" : `hsla(${hue},70%,72%,0.65)`;
  // the mantle: long, high-collared, full of instruments
  const m = ctx.createLinearGradient(16, 0, 30, 0);
  m.addColorStop(0, "#121535"); m.addColorStop(0.55, "#2a3170"); m.addColorStop(1, "#1a1f52");
  ctx.fillStyle = m;
  ctx.beginPath();
  ctx.moveTo(21, 40 + breath * 0.3);
  ctx.bezierCurveTo(15.4, 42, 15.6, 49, 16.6, 57);
  ctx.lineTo(16.4, 80); ctx.lineTo(29.6, 80);
  ctx.lineTo(29, 57);
  ctx.bezierCurveTo(30.6, 49, 30.2, 42, 26, 40 + breath * 0.3);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#4a52a0"; ctx.lineWidth = 0.18; ctx.stroke();
  // folds in the cloth
  ctx.strokeStyle = "rgba(8,10,30,0.55)"; ctx.lineWidth = 0.3;
  [[19.4, 62, 18.8, 79], [21.2, 63, 21, 79], [26.4, 62, 27, 79]].forEach(([x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(x1 + 0.6, (y1 + y2) / 2, x2, y2); ctx.stroke(); });
  // rim light from the tank
  ctx.strokeStyle = rim; ctx.lineWidth = 0.35;
  ctx.beginPath(); ctx.moveTo(26.4, 41); ctx.bezierCurveTo(30.2, 43, 30.4, 50, 29, 57); ctx.lineTo(29.6, 74); ctx.stroke();
  // the collar
  ctx.fillStyle = "#151a3c";
  ctx.beginPath(); ctx.moveTo(19.5, 42); ctx.quadraticCurveTo(18.5, 35.5, 21.5, 33.5); ctx.lineTo(22.2, 40); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(27.6, 42); ctx.quadraticCurveTo(29.6, 36.5, 27.6, 34.5); ctx.lineTo(26, 40); ctx.closePath(); ctx.fill();
  // glowing seams
  const pulse = 0.4 + 0.35 * Math.sin(t * 2.2);
  ctx.strokeStyle = alarm ? `rgba(240,90,110,${pulse})` : `rgba(111,195,168,${pulse})`; ctx.lineWidth = 0.22;
  ctx.beginPath(); ctx.moveTo(23.6, 41); ctx.lineTo(23.2, 80); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(17.4, 58); ctx.quadraticCurveTo(23, 61, 28.6, 58); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(17.2, 68); ctx.quadraticCurveTo(23, 70.5, 29, 68); ctx.stroke();
  // the instrument harness: vials and lights
  ctx.strokeStyle = "#4A4F80"; ctx.lineWidth = 0.45;
  ctx.beginPath(); ctx.moveTo(18, 47); ctx.lineTo(28.5, 55); ctx.stroke();
  [[20.2, 48.8, 200], [22.4, 50.5, 140], [24.6, 52.2, 30]].forEach(([x, y, h], i) => {
    ctx.fillStyle = `hsla(${h},70%,60%,0.85)`; roundRect(ctx, x - 0.45, y - 1.5, 0.9, 2.4, 0.3); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(x - 0.25, y - 1.3, 0.18, 1.6);
  });
  ctx.fillStyle = Math.sin(t * 5) > 0 ? (alarm ? "#F04A5A" : "#6FC3A8") : "#1d2440";
  ctx.beginPath(); ctx.arc(27, 54, 0.35, 0, TAU); ctx.fill();
  ctx.fillStyle = Math.sin(t * 3 + 1) > 0 ? "#E9D29A" : "#1d2440";
  ctx.beginPath(); ctx.arc(27.8, 55.2, 0.3, 0, TAU); ctx.fill();

  // the neck: segmented, long
  const neckTop = [28.2 + (mood === "intent" ? 1.4 : 0), 33.5 + (mood === "proud" ? -1 : 0)];
  for (let s = 0; s < 5; s++) {
    const k = s / 4;
    const x = lerp(23.8, neckTop[0], k) + Math.sin(t * 1.1 + s) * 0.08, y = lerp(40.5, neckTop[1], k);
    const g = ctx.createRadialGradient(x - 0.4, y - 0.4, 0.1, x, y, 1.6);
    g.addColorStop(0, SKIN[0]); g.addColorStop(1, SKIN[2]);
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 1.45 - k * 0.3, 0.95, -0.5, 0, TAU); ctx.fill();
  }

  // the head
  const toLook = Math.atan2(look[1] - neckTop[1], look[0] - neckTop[0]);
  let tilt = clamp(toLook * 0.35, -0.35, 0.5);
  if (mood === "alarmed") tilt = -0.45 + Math.sin(t * 25) * 0.03;
  if (mood === "intent") tilt = 0.42;
  if (mood === "proud") tilt = -0.15;
  if (ix.writing) tilt = 0.55;
  ctx.save();
  ctx.translate(neckTop[0], neckTop[1]); ctx.rotate(tilt);
  // the crest sweeping back
  const hg = ctx.createLinearGradient(-8, -22, 8, 0);
  hg.addColorStop(0, SKIN[2]); hg.addColorStop(0.45, SKIN[1]); hg.addColorStop(1, SKIN[0]);
  ctx.fillStyle = hg;
  ctx.beginPath();
  ctx.moveTo(-1.5, 1);
  ctx.bezierCurveTo(-4.6, -1.6, -6, -5.5, -6.6, -9);
  ctx.bezierCurveTo(-9.6, -11, -11.8, -15.5, -11, -19.6); // the long dome, swept back
  ctx.bezierCurveTo(-10.2, -23.6, -4.6, -24.8, 0.4, -21.8);
  ctx.bezierCurveTo(5.6, -18.8, 7.6, -13.2, 7.2, -8.6);
  ctx.bezierCurveTo(6.9, -4.4, 4.8, -1, 2.2, 0.6);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#252a58"; ctx.lineWidth = 0.18; ctx.stroke();
  // shadow under the jaw and a cheek ridge
  ctx.save(); ctx.clip();
  const jaw = ctx.createLinearGradient(0, -9, 0, 1);
  jaw.addColorStop(0, "rgba(20,22,60,0)"); jaw.addColorStop(1, "rgba(20,22,60,0.55)");
  ctx.fillStyle = jaw; ctx.fillRect(-8, -9, 18, 11);
  const cheek = ctx.createRadialGradient(5, -9, 0.2, 5, -9, 4);
  cheek.addColorStop(0, `hsla(${hue},60%,80%,0.25)`); cheek.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = cheek; ctx.fillRect(0, -14, 10, 10);
  ctx.restore();
  ctx.strokeStyle = "rgba(25,28,70,0.6)"; ctx.lineWidth = 0.22;
  ctx.beginPath(); ctx.moveTo(0.6, -6.6); ctx.quadraticCurveTo(3.6, -8.2, 6.6, -6.8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(6.1, -6.4); ctx.lineTo(6.5, -5.6); ctx.moveTo(5.3, -6.2); ctx.lineTo(5.6, -5.4); ctx.stroke();
  [[-0.4, -9.4], [0.4, -8.2], [-0.6, -7], [1.2, -10.6]].forEach(([x, y], n) => {
    ctx.fillStyle = `rgba(143,230,255,${0.35 + 0.3 * Math.sin(t * 2 + n)})`; ctx.beginPath(); ctx.arc(x, y, 0.22, 0, TAU); ctx.fill();
  });
  // rim light on the face side
  ctx.strokeStyle = rim; ctx.lineWidth = 0.32;
  ctx.beginPath(); ctx.moveTo(0.6, -21.6); ctx.bezierCurveTo(5.6, -18.8, 7.6, -13, 7.2, -8.6); ctx.bezierCurveTo(6.9, -4.6, 5, -1.2, 2.4, 0.4); ctx.stroke();
  // frills off the back of the dome, swaying
  for (let f = 0; f < 3; f++) {
    const sway = Math.sin(t * 1.6 + f) * 0.8;
    const bx = -10.6 + f * 0.6, by = -18.5 + f * 3.2;
    ctx.fillStyle = `rgba(110,119,174,${0.75 - f * 0.15})`;
    ctx.beginPath(); ctx.moveTo(bx, by - 1.2);
    ctx.quadraticCurveTo(bx - 3.4, by - 1.6 + sway, bx - 4.6 + sway * 0.4, by + 0.4 + sway);
    ctx.quadraticCurveTo(bx - 2.4, by + 0.6, bx + 0.3, by + 1.3); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(143,230,255,0.35)"; ctx.lineWidth = 0.12;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - 2.6, by - 0.2 + sway * 0.6, bx - 4.3 + sway * 0.4, by + 0.4 + sway); ctx.stroke();
  }
  // ridges across the dome, and lights along its crown
  ctx.strokeStyle = "rgba(20,24,60,0.55)"; ctx.lineWidth = 0.2;
  for (let r = 0; r < 5; r++) { const x = -1.6 - r * 1.9; ctx.beginPath(); ctx.moveTo(x, -22.6 + r * 0.55 + (r > 2 ? (r - 2) * 0.5 : 0)); ctx.quadraticCurveTo(x + 1.2, -16.5, x - 0.2 + r * 0.3, -10.5 + r * 0.4); ctx.stroke(); }
  for (let d = 0; d < 6; d++) {
    const a = 0.4 + 0.6 * Math.max(0, Math.sin(t * 2.4 - d * 0.6));
    const x = -0.6 - d * 1.8, y = -22.4 - Math.sin((d / 5) * Math.PI) * 0.9 + d * 0.32;
    ctx.fillStyle = alarm ? `rgba(240,90,110,${a})` : `rgba(143,230,255,${a})`;
    ctx.beginPath(); ctx.arc(x, y, 0.32, 0, TAU); ctx.fill();
    glow(ctx, x, y, 1.1, alarm ? `rgba(240,90,110,${a * 0.4})` : `rgba(143,230,255,${a * 0.35})`);
  }
  // the vertical eye
  const blink = (t % 5.3) > 5.15 ? 0.12 : 1;
  const wide = mood === "alarmed" ? 1.25 : 1;
  const ex = 3.4, ey = -11.4;
  ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.ellipse(ex, ey, 1.55 * wide, 3.7 * blink * wide, 0.08, 0, TAU); ctx.fill();
  if (blink > 0.5) {
    const la = Math.atan2(look[1] - (neckTop[1] - 11), look[0] - (neckTop[0] + 3)) - tilt;
    const ox = Math.cos(la) * 0.55, oy = Math.sin(la) * 1.4;
    const ig = ctx.createRadialGradient(ex + ox, ey + oy, 0.1, ex + ox, ey + oy, 1.3);
    ig.addColorStop(0, alarm ? "#FF8A9A" : "#FFF0C8"); ig.addColorStop(0.6, alarm ? "#E06A78" : "#E9D29A"); ig.addColorStop(1, alarm ? "#601020" : "#7a5a20");
    ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(ex + ox, ey + oy, 1.05, 2.4, 0.08, 0, TAU); ctx.fill();
    ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.ellipse(ex + ox, ey + oy, mood === "alarmed" ? 0.5 : 0.22, 1.8, 0.08, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(ex + ox - 0.35, ey + oy - 1.1, 0.28, 0, TAU); ctx.fill();
  }
  ctx.strokeStyle = "#1d2150"; ctx.lineWidth = 0.25; ctx.beginPath(); ctx.ellipse(ex, ey, 1.75 * wide, 3.95 * wide, 0.08, 0, TAU); ctx.stroke();
  // the two small eyes
  [[0.2, -16, 0.6], [5.4, -15.6, 0.5]].forEach(([x, y, r]) => {
    ctx.fillStyle = "#04030C"; ctx.beginPath(); ctx.arc(x, y, r * blink + 0.05, 0, TAU); ctx.fill();
    ctx.fillStyle = alarm ? "#E06A78" : "#E9D29A"; ctx.beginPath(); ctx.arc(x + 0.15, y - 0.15, r * 0.35, 0, TAU); ctx.fill();
  });
  // mouth and the palps beneath it
  ctx.strokeStyle = "#1d2150"; ctx.lineWidth = 0.22;
  ctx.beginPath(); ctx.moveTo(2.6, -3.6); ctx.quadraticCurveTo(4.4, -3 + (mood === "alarmed" ? 0.8 : 0), 5.8, -3.8); ctx.stroke();
  for (let p = 0; p < 3; p++) {
    const sway = Math.sin(t * 2.6 + p * 1.3) * 0.6 + (mood === "alarmed" ? Math.sin(t * 30 + p) * 0.4 : 0);
    ctx.strokeStyle = SKIN[1]; ctx.lineWidth = 0.32 - p * 0.05; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(2.8 + p * 1.1, -1.6); ctx.quadraticCurveTo(3 + p * 1.1 + sway, 0.6, 2.6 + p * 1.2 + sway * 1.4, 2.4 - p * 0.3); ctx.stroke();
  }
  // the loupe swings over the eye when it peers
  const lo = ix.loupe ? 1 : 0;
  ctx.strokeStyle = "#8A7A50"; ctx.lineWidth = 0.28;
  ctx.beginPath(); ctx.moveTo(-1.5, -14); ctx.quadraticCurveTo(lerp(-0.6, 2, lo), lerp(-18.5, -14.5, lo), lerp(0.4, ex + 0.2, lo), lerp(-19.6, ey, lo)); ctx.stroke();
  const lx = lerp(0.4, ex + 0.2, lo), ly = lerp(-19.6, ey, lo);
  ctx.strokeStyle = "#C9B98F"; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.arc(lx, ly, 2.3, 0, TAU); ctx.stroke();
  ctx.fillStyle = "rgba(200,230,255,0.12)"; ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 0.18; ctx.beginPath(); ctx.arc(lx, ly, 1.7, -2.4, -1.5); ctx.stroke();
  ctx.restore(); // head
  ctx.restore(); // lean
}

// one arm: a tapered tentacle from its shoulder to wherever its tip is
function drawArm(ctx, i, tip, t, hue, holdsSlate) {
  const from = SHOULDERS[i];
  const dx = tip[0] - from[0], dy = tip[1] - from[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  const wob = Math.sin(t * 2.1 + i * 1.7) * Math.min(1.6, L * 0.06);
  const bend = BEND[i];
  const c1 = [from[0] + dx * 0.28 + nx * (L * 0.3 * bend + wob), from[1] + dy * 0.28 + ny * (L * 0.3 * bend + wob)];
  const c2 = [from[0] + dx * 0.7 + nx * (L * 0.12 * bend - wob * 0.6), from[1] + dy * 0.7 + ny * (L * 0.12 * bend - wob * 0.6)];
  const N = 26, pts = [];
  for (let k = 0; k <= N; k++) {
    const s = k / N, is = 1 - s;
    pts.push([
      is * is * is * from[0] + 3 * is * is * s * c1[0] + 3 * is * s * s * c2[0] + s * s * s * tip[0],
      is * is * is * from[1] + 3 * is * is * s * c1[1] + 3 * is * s * s * c2[1] + s * s * s * tip[1],
    ]);
  }
  const w0 = ARM_W[i];
  const left = [], right = [], tans = [];
  pts.forEach((p, k) => {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(N, k + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl; tans.push([tx, ty]);
    const ww = w0 * (1 - (k / N) * 0.65);
    left.push([p[0] - ty * ww, p[1] + tx * ww]);
    right.push([p[0] + ty * ww, p[1] - tx * ww]);
  });
  const g = ctx.createLinearGradient(from[0], from[1], tip[0], tip[1]);
  g.addColorStop(0, SKIN[2]); g.addColorStop(0.4, SKIN[1]); g.addColorStop(1, SKIN[0]);
  ctx.fillStyle = g;
  ctx.beginPath();
  left.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  for (let k = right.length - 1; k >= 0; k--) ctx.lineTo(right[k][0], right[k][1]);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#1d2150"; ctx.lineWidth = 0.15; ctx.stroke();
  // volume: a dark underside, a soft light ridge along the top
  ctx.strokeStyle = "rgba(15,17,48,0.45)"; ctx.lineWidth = w0 * 0.55; ctx.lineCap = "round";
  ctx.beginPath(); left.forEach(([x, y], k) => { const p = pts[k]; const mx = (x * 2 + p[0]) / 3, my = (y * 2 + p[1]) / 3; k ? ctx.lineTo(mx, my) : ctx.moveTo(mx, my); }); ctx.stroke();
  ctx.strokeStyle = "rgba(225,230,255,0.28)"; ctx.lineWidth = w0 * 0.28;
  ctx.beginPath(); right.forEach(([x, y], k) => { const p = pts[k]; const mx = (x + p[0] * 2) / 3, my = (y + p[1] * 2) / 3; k ? ctx.lineTo(mx, my) : ctx.moveTo(mx, my); }); ctx.stroke();
  // the shoulder joint
  ctx.fillStyle = "#1a1f44"; ctx.beginPath(); ctx.arc(from[0], from[1], w0 * 0.95, 0, TAU); ctx.fill();
  ctx.strokeStyle = "rgba(143,230,255,0.45)"; ctx.lineWidth = 0.15; ctx.stroke();
  // light from the tank along one edge
  ctx.strokeStyle = `hsla(${hue},70%,75%,0.45)`; ctx.lineWidth = 0.2;
  ctx.beginPath(); right.slice(2).forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  // bioluminescent bands
  [6, 11, 16].forEach((k, n) => {
    const a = 0.35 + 0.35 * Math.sin(t * 3 - n - i);
    ctx.strokeStyle = `rgba(143,230,255,${a})`; ctx.lineWidth = 0.18;
    ctx.beginPath(); ctx.moveTo(left[k][0], left[k][1]); ctx.lineTo(right[k][0], right[k][1]); ctx.stroke();
  });
  // suckers along the underside of the tentacles
  if (HANDS[i] === "suck") {
    for (let k = 9; k < N - 1; k += 2) {
      const [x, y] = left[k], r = 0.32 * (1 - k / N) + 0.12;
      ctx.fillStyle = "#C9CEF0"; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.fillStyle = "#4a5088"; ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    }
  }
  // the tip
  const [tx, ty] = tans[N];
  if (HANDS[i] === "fingers") {
    ctx.strokeStyle = SKIN[0]; ctx.lineCap = "round";
    const grip = holdsSlate ? 0.25 : 0.55 + Math.sin(t * 3 + i) * 0.15;
    [-1, 0, 1].forEach((f) => {
      const a = Math.atan2(ty, tx) + f * grip;
      ctx.lineWidth = 0.32;
      ctx.beginPath(); ctx.moveTo(tip[0], tip[1]);
      ctx.quadraticCurveTo(tip[0] + Math.cos(a) * 1.1, tip[1] + Math.sin(a) * 1.1, tip[0] + Math.cos(a + f * 0.5 + 0.3) * 1.9, tip[1] + Math.sin(a + f * 0.5 + 0.3) * 1.9);
      ctx.stroke();
    });
  } else {
    // a curling tip
    const a = Math.atan2(ty, tx);
    ctx.strokeStyle = SKIN[0]; ctx.lineWidth = 0.3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(tip[0], tip[1]);
    ctx.quadraticCurveTo(tip[0] + Math.cos(a) * 1.2, tip[1] + Math.sin(a) * 1.2, tip[0] + Math.cos(a + 1.4 + Math.sin(t * 4 + i) * 0.4) * 1.3, tip[1] + Math.sin(a + 1.4 + Math.sin(t * 4 + i) * 0.4) * 1.3);
    ctx.stroke();
  }
}

// ─────────── the transformation ───────────
// While the species is drawn (one to two minutes) the embryo doesn't hide
// in a cocoon any more: it changes in front of you. The old body swells and
// dissolves; ghosts of other bodies it could have been flicker through;
// the new form grows in, glitching, its shape coming from the answers.
function drawMorph(ctx, off, scale, cx, cy, S, t, em, tr, m, since, tint) {
  const all = { ...tr, known: { body: true, limbs: true, move: true, skin: true, sense: true, mind: true } };
  // a pulse of light that quickens as it goes
  const beat = Math.pow(Math.max(0, Math.sin(t * (2 + m * 5))), 6);
  const halo = ctx.createRadialGradient(cx, cy, 1, cx, cy, S * 0.8);
  halo.addColorStop(0, tint(85, 0.25 + beat * 0.35)); halo.addColorStop(1, tint(60, 0));
  ctx.fillStyle = halo; ctx.fillRect(cx - S, cy - S, S * 2, S * 2);
  // the old body: swelling, splitting, dissolving
  const a0 = 1 - smooth(0.15, 0.6, m);
  if (a0 > 0.01) {
    ctx.save(); ctx.globalAlpha = a0;
    const sc = 1 + smooth(0, 0.4, m) * 0.9 + beat * 0.08;
    const split = smooth(0.1, 0.45, m) * 2.2;
    [-1, 1].forEach((side) => {
      ctx.save(); ctx.translate(cx + side * split, cy); ctx.scale(sc, sc); ctx.translate(-cx, -cy);
      ctx.globalAlpha = a0 * (split > 0.2 ? 0.6 : 1);
      drawEmbryo(ctx, cx, cy, S, t, em, {});
      ctx.restore();
    });
    ctx.restore();
  }
  // other bodies it could have been
  const g = Math.floor(t / 1.3);
  const ga = Math.sin(((t % 1.3) / 1.3) * Math.PI) * (0.32 + 0.3 * (1 - Math.abs(m - 0.45) * 2));
  if (ga > 0.02) {
    const ghost = {
      ...all,
      limbs: [0, 2, 3, 4, 6, 8][g % 6],
      move: ["walk", "swim", "fly", "float", "slither", "rooted"][g % 6],
      symmetry: ["bilateral", "radial", "asym"][g % 3],
      size: clamp(tr.size * (0.75 + ((g * 37) % 10) / 20), 0.45, 1.05),
    };
    ctx.save(); ctx.globalAlpha = ga;
    ctx.translate(Math.sin(g * 7.1) * S * 0.05, Math.cos(g * 3.3) * S * 0.04);
    drawSpecimen(ctx, cx, cy, S * 0.95, t, ghost, { seed: g });
    ctx.restore();
  }
  // the new form, growing in and glitching
  const a1 = smooth(0.12, 0.65, m);
  if (a1 > 0.01) {
    const box = S * 1.5;
    const px = Math.max(8, Math.ceil(box * scale));
    if (off.width !== px) { off.width = px; off.height = px; }
    const o = off.getContext("2d");
    o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, px, px);
    o.setTransform(scale, 0, 0, scale, 0, 0);
    const grow = 0.5 + 0.55 * smooth(0.12, 0.9, m);
    drawSpecimen(o, box / 2, box / 2, S * grow, t, all, { seed: 7 });
    // draw it back in slices that slip sideways
    const slices = 14;
    const glitch = (1 - smooth(0.7, 0.97, m)) * 1.8;
    ctx.save(); ctx.globalAlpha = a1;
    // a glow of itself behind it, so it reads as a body taking shape
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = a1 * 0.5; ctx.filter = "blur(6px)";
    ctx.drawImage(off, 0, 0, px, px, cx - box / 2, cy - box / 2, box, box);
    ctx.restore();
    for (let pass = 0; pass < 2; pass++)
    for (let s = 0; s < slices; s++) {
      const sy = (s / slices) * box, sh = box / slices;
      const n = Math.sin(t * 9 + s * 12.9898) * 43758.5453;
      const shift = (n - Math.floor(n) - 0.5) * glitch * (Math.sin(t * 3 + s) > 0.6 ? 3 : 0.6);
      ctx.drawImage(off, 0, (sy / box) * px, px, (sh / box) * px, cx - box / 2 + shift, cy - box / 2 + sy, box, sh + 0.05);
    }
    ctx.restore();
  }
  // threads of energy knitting it together
  ctx.strokeStyle = tint(88, 0.35 + beat * 0.4); ctx.lineWidth = 1;
  for (let k = 0; k < 7; k++) {
    const a = k * 0.9 + t * (0.6 + m);
    const r1 = S * 0.55, r2 = S * (0.12 + 0.1 * Math.sin(t * 2 + k));
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1 * 1.3);
    ctx.quadraticCurveTo(cx + Math.cos(a + 1) * r1 * 0.5, cy + Math.sin(a + 1) * r1 * 0.6, cx + Math.cos(a + 2) * r2, cy + Math.sin(a + 2) * r2);
    ctx.stroke();
  }
  // a flash on every beat late in the change
  if (m > 0.6 && beat > 0.9) { ctx.fillStyle = `rgba(255,250,235,${(beat - 0.9) * 2})`; ctx.fillRect(cx - S, cy - S, S * 2, S * 2); }
}
