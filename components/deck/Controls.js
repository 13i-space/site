"use client";

import { useEffect, useRef, useState } from "react";

// Signal Composer v2 (Update 5.65): the controller's hardware, drawn.
// Knob (drag up/down, wheel, arrow keys; double-click resets), Fader
// (vertical), Crossfader, Jog (the platter: drag the edge to nudge, the
// top to scratch), Meter (an LED column fed each frame).

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function Knob({ value, onChange, min = -1, max = 1, def = 0, label, color = "#6FC3A8", size = 46, kill = false }) {
  const drag = useRef(null);
  const norm = (value - min) / (max - min);
  const ang = -135 + norm * 270;
  const set = (v) => onChange(clamp(v, min, max));
  const down = (e) => {
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* no pointer to capture */ }
    drag.current = { y: e.clientY, v: value };
  };
  const move = (e) => {
    if (!drag.current) return;
    const dy = drag.current.y - e.clientY;
    set(drag.current.v + (dy / (e.shiftKey ? 600 : 160)) * (max - min));
  };
  const up = () => { drag.current = null; };
  const r = size / 2 - 4, cx = size / 2, cy = size / 2;
  const arc = (a0, a1) => {
    const p = (a) => [cx + Math.cos(((a - 90) * Math.PI) / 180) * r, cy + Math.sin(((a - 90) * Math.PI) / 180) * r];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0} ${y0} A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${x1} ${y1}`;
  };
  const zeroAng = -135 + ((def - min) / (max - min)) * 270;
  const killed = kill && value <= min + 0.03;
  return (
    <div className="dk-knob" style={{ width: size + 14 }}>
      <svg
        width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        role="slider" tabIndex={0} aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={Number(value.toFixed(2))}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        onDoubleClick={() => set(def)}
        onWheel={(e) => { e.preventDefault(); set(value - Math.sign(e.deltaY) * (max - min) * 0.03); }}
        onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowRight") set(value + (max - min) * 0.05); if (e.key === "ArrowDown" || e.key === "ArrowLeft") set(value - (max - min) * 0.05); }}
        style={{ touchAction: "none", cursor: "ns-resize" }}
      >
        <path d={arc(-135, 135)} stroke="#1a1e36" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {Math.abs(ang - zeroAng) > 1 && <path d={arc(Math.min(zeroAng, ang), Math.max(zeroAng, ang))} stroke={killed ? "#E06A78" : color} strokeWidth="3.5" fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px ${color})` }} />}
        <circle cx={cx} cy={cy} r={r - 5} fill="url(#dk-knob-g)" stroke="#000" strokeWidth="1" />
        <line x1={cx} y1={cy} x2={cx + Math.cos(((ang - 90) * Math.PI) / 180) * (r - 7)} y2={cy + Math.sin(((ang - 90) * Math.PI) / 180) * (r - 7)} stroke="#F2F4FF" strokeWidth="2" strokeLinecap="round" />
        <defs><radialGradient id="dk-knob-g" cx="0.35" cy="0.3"><stop offset="0" stopColor="#4a5070" /><stop offset="1" stopColor="#14172a" /></radialGradient></defs>
      </svg>
      {label && <div className="dk-knob-label">{label}</div>}
    </div>
  );
}

export function Fader({ value, onChange, label, height = 130, color = "#6FC3A8", center = false }) {
  const ref = useRef(null);
  const setFrom = (e) => {
    const r = ref.current.getBoundingClientRect();
    onChange(clamp(1 - (e.clientY - r.top) / r.height, 0, 1));
  };
  const drag = useRef(false);
  return (
    <div className="dk-fader" style={{ height: height + 22 }}>
      <div
        ref={ref} className="dk-fader-track" style={{ height }}
        role="slider" tabIndex={0} aria-label={label} aria-valuemin={0} aria-valuemax={1} aria-valuenow={Number(value.toFixed(2))}
        onPointerDown={(e) => { e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* no pointer to capture */ } drag.current = true; setFrom(e); }}
        onPointerMove={(e) => drag.current && setFrom(e)}
        onPointerUp={() => { drag.current = false; }} onPointerCancel={() => { drag.current = false; }}
        onDoubleClick={() => center && onChange(0.5)}
        onKeyDown={(e) => { if (e.key === "ArrowUp") onChange(clamp(value + 0.05, 0, 1)); if (e.key === "ArrowDown") onChange(clamp(value - 0.05, 0, 1)); }}
      >
        {center && <div className="dk-fader-mid" />}
        <div className="dk-fader-fill" style={{ height: `${value * 100}%`, background: color }} />
        <div className="dk-fader-cap" style={{ bottom: `calc(${value * 100}% - 9px)` }} />
      </div>
      {label && <div className="dk-knob-label">{label}</div>}
    </div>
  );
}

export function Crossfader({ value, onChange }) {
  const ref = useRef(null);
  const drag = useRef(false);
  const setFrom = (e) => { const r = ref.current.getBoundingClientRect(); onChange(clamp((e.clientX - r.left) / r.width, 0, 1)); };
  return (
    <div className="dk-xf">
      <span className="dk-xf-end">A</span>
      <div
        ref={ref} className="dk-xf-track"
        role="slider" tabIndex={0} aria-label="Crossfader" aria-valuemin={0} aria-valuemax={1} aria-valuenow={Number(value.toFixed(2))}
        onPointerDown={(e) => { e.preventDefault(); try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* no pointer to capture */ } drag.current = true; setFrom(e); }}
        onPointerMove={(e) => drag.current && setFrom(e)}
        onPointerUp={() => { drag.current = false; }} onPointerCancel={() => { drag.current = false; }}
        onDoubleClick={() => onChange(0.5)}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") onChange(clamp(value - 0.05, 0, 1)); if (e.key === "ArrowRight") onChange(clamp(value + 0.05, 0, 1)); }}
      >
        <div className="dk-xf-mid" />
        <div className="dk-xf-cap" style={{ left: `calc(${value * 100}% - 13px)` }} />
      </div>
      <span className="dk-xf-end">B</span>
    </div>
  );
}

// an LED meter, fed by a function each frame (0..1)
export function Meter({ read, segs = 14, height = 120 }) {
  const ref = useRef(null);
  useEffect(() => {
    let raf, peak = 0, held = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const el = ref.current; if (!el) return;
      const v = read();
      if (v > peak) { peak = v; held = 30; } else if (held-- <= 0) peak = Math.max(0, peak - 0.02);
      const lit = Math.round(v * segs), pk = Math.round(peak * segs);
      for (let i = 0; i < segs; i++) {
        const c = el.children[segs - 1 - i]; if (!c) continue;
        const on = i < lit || i === pk - 1;
        c.style.opacity = on ? 1 : 0.14;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [read, segs]);
  return (
    <div className="dk-meter" ref={ref} style={{ height }} aria-hidden="true">
      {Array.from({ length: segs }, (_, i) => {
        const k = 1 - i / segs;
        return <span key={i} style={{ background: k > 0.85 ? "#E06A78" : k > 0.65 ? "#E9D29A" : "#6FC3A8" }} />;
      })}
    </div>
  );
}

// the platter. engine.position() tells it where the deck is; drag the rim
// to nudge, drag the top (inside the rim) to scratch.
export function Jog({ id, engine, color, label, playingRef }) {
  const ref = useRef(null);
  const st = useRef({ angle: 0, drag: null });
  useEffect(() => {
    const c = ref.current, g = c.getContext("2d");
    let raf, last = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dpr = Math.min(2, window.devicePixelRatio || 1), W = c.clientWidth;
      if (!W) return;
      if (c.width !== Math.round(W * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(W * dpr); }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const d = engine.decks[id], dt = (now - last) / 1000; last = now;
      if (d.playing && !st.current.drag) st.current.angle += dt * (d.bpm / 120) * Math.PI * 1.1;
      const R = W / 2, cx = R, cy = R, a = st.current.angle;
      g.clearRect(0, 0, W, W);
      // the rim, with the beat LEDs
      const { pos, frac } = engine.position(id);
      const ringR = R - 4;
      for (let i = 0; i < 32; i++) {
        const an = (i / 32) * Math.PI * 2 - Math.PI / 2;
        const stepNow = ((pos % 64) + frac) / 2;
        const on = d.playing && Math.floor(stepNow) % 32 >= i;
        g.strokeStyle = on ? color : "#1c2036"; g.lineWidth = 4; g.lineCap = "round";
        g.beginPath(); g.arc(cx, cy, ringR, an + 0.03, an + (Math.PI * 2) / 32 - 0.03); g.stroke();
      }
      // platter
      const pg = g.createRadialGradient(cx - R * 0.2, cy - R * 0.25, R * 0.1, cx, cy, R * 0.9);
      pg.addColorStop(0, "#3a3f5c"); pg.addColorStop(0.6, "#191c30"); pg.addColorStop(1, "#0b0d18");
      g.fillStyle = pg; g.beginPath(); g.arc(cx, cy, R - 11, 0, Math.PI * 2); g.fill();
      // grooves
      g.strokeStyle = "rgba(255,255,255,0.05)"; g.lineWidth = 1;
      for (let k = 0.45; k < 0.92; k += 0.06) { g.beginPath(); g.arc(cx, cy, (R - 11) * k, 0, Math.PI * 2); g.stroke(); }
      // the label, turning: a ring of alien glyphs and the deck letter
      g.save(); g.translate(cx, cy); g.rotate(a);
      const lr = (R - 11) * 0.38;
      const lg = g.createRadialGradient(0, 0, 2, 0, 0, lr);
      lg.addColorStop(0, color); lg.addColorStop(1, "#0a0b1c");
      g.fillStyle = lg; g.beginPath(); g.arc(0, 0, lr, 0, Math.PI * 2); g.fill();
      g.fillStyle = "rgba(255,255,255,0.85)"; g.font = `${Math.round(lr * 0.28)}px monospace`; g.textAlign = "center"; g.textBaseline = "middle";
      const glyphs = "⟡⌬⏃⍜⟁◬⋔⏚";
      for (let i = 0; i < 8; i++) { g.save(); g.rotate((i / 8) * Math.PI * 2); g.fillText(glyphs[i], 0, -lr * 0.7); g.restore(); }
      g.font = `bold ${Math.round(lr * 0.62)}px Georgia`; g.fillText(label, 0, 2);
      // the marker
      g.fillStyle = "#F2F4FF"; g.fillRect(-1.5, -(R - 13), 3, R * 0.22);
      g.restore();
      // centre spindle
      g.fillStyle = "#c9ccdf"; g.beginPath(); g.arc(cx, cy, 3, 0, Math.PI * 2); g.fill();
      // touch glow
      if (st.current.drag) { g.strokeStyle = st.current.drag.mode === "scratch" ? "#E8B4C8" : "#E9D29A"; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R - 12, 0, Math.PI * 2); g.stroke(); }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [engine, id, color, label]);

  const angleAt = (e) => { const r = ref.current.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)); };
  const down = (e) => {
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* no pointer to capture */ }
    const r = ref.current.getBoundingClientRect();
    const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) / (r.width / 2);
    const mode = dist < 0.72 && engine.decks[id].playing ? "scratch" : "nudge";
    st.current.drag = { mode, a: angleAt(e), t: performance.now() };
    if (mode === "scratch") engine.scratchStart(id);
  };
  const move = (e) => {
    const dr = st.current.drag; if (!dr) return;
    let da = angleAt(e) - dr.a; if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2;
    const now = performance.now(), dt = Math.max(1, now - dr.t);
    dr.a = angleAt(e); dr.t = now;
    st.current.angle += da;
    if (dr.mode === "scratch") engine.scratchMove(id, (da / dt) * 60);
    else engine.nudge(id, -da * 0.012);
  };
  const up = () => { const dr = st.current.drag; st.current.drag = null; if (dr && dr.mode === "scratch") engine.scratchEnd(id); };
  return (
    <canvas
      ref={ref} className="dk-jog" style={{ touchAction: "none" }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      aria-label={`Deck ${label} jog wheel: drag the top to scratch, the edge to nudge`} role="img"
    />
  );
}

export function useEngineTick(engine, fn, deps = []) {
  // run fn every animation frame (cheap state reads, e.g. the step playhead)
  const [, force] = useState(0);
  useEffect(() => {
    let raf;
    const loop = () => { raf = requestAnimationFrame(loop); if (fn()) force((n) => (n + 1) % 1e6); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
