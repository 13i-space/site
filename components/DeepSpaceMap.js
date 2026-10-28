"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PLANETS, MISSIONS, HELIO, planetAt, orbitPath, dist, LIGHT_SECONDS_PER_AU } from "../lib/solarSystem";

// The DEEP SPACE console (Update 6.26): the solar system seen from above, with
// every deep-space mission where it is today. Spacecraft positions come from
// JPL Horizons via the server (lib/deepSpace.js); planets are worked out here.
// Distance from the Sun is squeezed (a log scale) so the inner planets and the
// Voyagers fit on one screen; directions are true. Drag to pan, scroll or
// pinch to zoom, click a mission (or pick it from the list) for its story.

const R0 = 0.6; // AU: below this the scale is nearly linear
const squash = (r) => Math.log(1 + r / R0);
const FULL = squash(185);
const VIEWS = [
  { id: "inner", label: "Inner", zoom: FULL / squash(2.4) },
  { id: "planets", label: "Planets", zoom: FULL / squash(42) },
  { id: "all", label: "Interstellar", zoom: 1 },
];
const AGENCY_NAMES = { NASA: "NASA (USA)", ESA: "European Space Agency", JAXA: "Japan (JAXA)", CSA: "Canadian Space Agency", CNSA: "China (CNSA)", UAE: "United Arab Emirates", ISRO: "India (ISRO)" };

function fromApprox([lonDeg, latDeg, r]) {
  const lon = (lonDeg * Math.PI) / 180, lat = (latDeg * Math.PI) / 180;
  return [r * Math.cos(lat) * Math.cos(lon), r * Math.cos(lat) * Math.sin(lon), r * Math.sin(lat)];
}

function fmtTime(sec) {
  if (sec < 90) return `${Math.round(sec)} seconds`;
  if (sec < 5400) return `${Math.round(sec / 60)} minutes`;
  const h = sec / 3600;
  return h < 48 ? `${h.toFixed(1)} hours` : `${(h / 24).toFixed(1)} days`;
}
const fmtAU = (au) => (au < 10 ? au.toFixed(2) : au.toFixed(1)) + " AU";
const fmtKm = (au) => {
  const km = au * 149597870.7;
  return km >= 1e9 ? `${(km / 1e9).toFixed(1)} billion km` : `${Math.round(km / 1e6).toLocaleString("en-US")} million km`;
};

export default function DeepSpaceMap({ deep = {} }) {
  const wrapRef = useRef(null);
  const cvRef = useRef(null);
  const view = useRef({ zoom: VIEWS[1].zoom, cx: 0, cy: 0 }); // cx, cy: squashed-space centre
  const [viewId, setViewId] = useState("planets");
  const [sel, setSel] = useState(null);
  const [hover, setHover] = useState(null);
  const [labels, setLabels] = useState(true);
  const selRef = useRef(null); selRef.current = sel;
  const hoverRef = useRef(null); hoverRef.current = hover;
  const labelsRef = useRef(true); labelsRef.current = labels;
  const hits = useRef([]);

  const now = useMemo(() => Date.now(), []);
  const planets = useMemo(() => PLANETS.map((p) => ({ ...p, xyz: planetAt(p, now), orbit: orbitPath(p, now) })), [now]);
  const earth = planets.find((p) => p.id === "earth").xyz;
  const missions = useMemo(() => MISSIONS.map((m) => {
    let xyz = null, how = null, date = null, trail = null;
    if (deep[m.id]) { xyz = deep[m.id].xyz; trail = deep[m.id].trail; date = deep[m.id].date; how = "live"; }
    else if (m.at) { xyz = planets.find((p) => p.id === m.at)?.xyz || null; how = "planet"; }
    else if (m.approx) { xyz = fromApprox(m.approx); how = "approx"; }
    return { ...m, xyz, how, date, trail };
  }), [deep, planets]);
  const liveCount = missions.filter((m) => m.how === "live").length;
  const dated = missions.find((m) => m.how === "live")?.date;

  // squashed screen mapping: true direction, log distance
  const project = (xyz, w, h) => {
    const r = Math.hypot(xyz[0], xyz[1]);
    const s = r ? squash(r) / r : 0;
    const scale = (Math.min(w, h) / 2 / FULL) * view.current.zoom * 0.94;
    return [w / 2 + (xyz[0] * s - view.current.cx) * scale, h / 2 - (xyz[1] * s - view.current.cy) * scale];
  };

  useEffect(() => {
    const cv = cvRef.current, wrap = wrapRef.current;
    if (!cv) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = true, last = 0;
    const asteroids = Array.from({ length: 520 }, (_, i) => { const r = 2.15 + ((i * 0.6180339) % 1) * 1.1, a = i * 2.39996; return [r * Math.cos(a), r * Math.sin(a), 0]; });
    const kuiper = Array.from({ length: 520 }, (_, i) => { const r = 30 + ((i * 0.6180339) % 1) * 20, a = i * 2.39996; return [r * Math.cos(a), r * Math.sin(a), 0]; });

    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (!visible || t - last < (reduce ? 500 : 33)) return;
      last = t;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(cv.clientWidth * dpr)), H = Math.max(1, Math.round(cv.clientHeight * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      const ctx = cv.getContext("2d");
      const P = (xyz) => project(xyz, W, H);
      const [ox, oy] = P([0, 0, 0]);
      const px = (au) => P([au, 0, 0])[0] - ox; // screen radius of a distance
      ctx.fillStyle = "#03040d"; ctx.fillRect(0, 0, W, H);
      ctx.font = `${10 * dpr}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = "middle";

      // distance rings
      for (const au of [1, 5, 10, 30, 100]) {
        const r = px(au);
        ctx.strokeStyle = "rgba(185,192,255,.07)"; ctx.lineWidth = dpr; ctx.setLineDash([2 * dpr, 6 * dpr]);
        ctx.beginPath(); ctx.arc(ox, oy, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "rgba(110,118,184,.55)"; ctx.textAlign = "left";
        ctx.fillText(`${au} AU`, ox + r * 0.707 + 4 * dpr, oy - r * 0.707);
      }
      // heliosphere
      for (const [au, name] of [[HELIO.terminationShock, "Termination shock"], [HELIO.heliopause, "Heliopause · interstellar space beyond"]]) {
        const r = px(au);
        ctx.strokeStyle = au === HELIO.heliopause ? "rgba(232,207,192,.32)" : "rgba(232,207,192,.14)";
        ctx.lineWidth = (au === HELIO.heliopause ? 1.5 : 1) * dpr;
        ctx.setLineDash(au === HELIO.heliopause ? [] : [4 * dpr, 4 * dpr]);
        ctx.beginPath(); ctx.arc(ox, oy, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        if (labelsRef.current) { ctx.fillStyle = "rgba(232,207,192,.55)"; ctx.textAlign = "center"; ctx.fillText(name, ox, oy - r - 8 * dpr); }
      }
      // belts
      ctx.fillStyle = "rgba(185,192,255,.22)";
      for (const a of asteroids) { const [x, y] = P(a); ctx.fillRect(x, y, dpr, dpr); }
      ctx.fillStyle = "rgba(185,192,255,.14)";
      for (const a of kuiper) { const [x, y] = P(a); ctx.fillRect(x, y, dpr, dpr); }
      // the Sun
      const sg = ctx.createRadialGradient(ox, oy, 0, ox, oy, 16 * dpr);
      sg.addColorStop(0, "rgba(255,240,215,1)"); sg.addColorStop(0.3, "rgba(232,207,192,.7)"); sg.addColorStop(1, "rgba(232,207,192,0)");
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(ox, oy, 16 * dpr, 0, Math.PI * 2); ctx.fill();

      // planets
      for (const p of planets) {
        ctx.strokeStyle = p.dwarf ? "rgba(185,192,255,.09)" : "rgba(185,192,255,.18)"; ctx.lineWidth = dpr;
        ctx.beginPath();
        p.orbit.forEach((q, i) => { const [x, y] = P(q); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
        ctx.stroke();
        const [x, y] = P(p.xyz);
        if (p.ring) { ctx.strokeStyle = "rgba(232,214,168,.7)"; ctx.beginPath(); ctx.ellipse(x, y, p.size * 2 * dpr, p.size * 0.8 * dpr, -0.4, 0, Math.PI * 2); ctx.stroke(); }
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(x, y, p.size * dpr, 0, Math.PI * 2); ctx.fill();
        if (labelsRef.current) { ctx.fillStyle = "rgba(201,205,242,.75)"; ctx.textAlign = "left"; ctx.fillText(p.name, x + (p.size + 4) * dpr, y + 9 * dpr); }
      }

      // missions
      const list = [];
      const pulse = reduce ? 0.5 : (Math.sin(t / 400) + 1) / 2;
      for (const m of missions) {
        if (!m.xyz) continue;
        const [x, y] = P(m.xyz);
        const isSel = selRef.current === m.id, isHov = hoverRef.current === m.id;
        if (m.trail && m.trail.length > 1) {
          ctx.strokeStyle = isSel ? "rgba(232,207,192,.75)" : "rgba(185,192,255,.35)"; ctx.lineWidth = (isSel ? 1.6 : 1) * dpr;
          ctx.beginPath(); m.trail.forEach((q, i) => { const [a, b] = P(q); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); ctx.stroke();
        }
        if (isSel) {
          // the signal path home
          const [ex, ey] = P(earth);
          ctx.strokeStyle = "rgba(232,207,192,.35)"; ctx.setLineDash([3 * dpr, 4 * dpr]); ctx.lineWidth = dpr;
          ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(232,207,192,${0.4 + 0.5 * pulse})`; ctx.lineWidth = 1.5 * dpr;
          ctx.beginPath(); ctx.arc(x, y, (9 + 4 * pulse) * dpr, 0, Math.PI * 2); ctx.stroke();
        }
        const s = (isSel || isHov ? 5.5 : 4) * dpr;
        ctx.fillStyle = m.how === "approx" ? "rgba(232,207,192,.55)" : m.color;
        ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s, y); ctx.closePath(); ctx.fill();
        if (m.how === "approx") { ctx.strokeStyle = "rgba(232,207,192,.8)"; ctx.lineWidth = dpr; ctx.stroke(); }
        if (labelsRef.current || isSel || isHov) {
          ctx.fillStyle = isSel ? "#E8CFC0" : isHov ? "#EEF0FF" : "rgba(185,192,255,.85)";
          ctx.textAlign = "left"; ctx.fillText(m.name, x + 8 * dpr, y - 8 * dpr);
        }
        list.push({ id: m.id, x: x / dpr, y: y / dpr });
      }
      hits.current = list;
    };
    raf = requestAnimationFrame(draw);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(cv);

    // pan, zoom, pinch, click
    const pointers = new Map();
    let moved = 0, pinch0 = null;
    const scaleNow = () => (Math.min(cv.clientWidth, cv.clientHeight) / 2 / FULL) * view.current.zoom * 0.94;
    const zoomAt = (factor, sx, sy) => {
      const v = view.current, sc = scaleNow();
      const wx = v.cx + (sx - cv.clientWidth / 2) / sc, wy = v.cy - (sy - cv.clientHeight / 2) / sc;
      v.zoom = Math.min(40, Math.max(0.8, v.zoom * factor));
      const sc2 = scaleNow();
      v.cx = wx - (sx - cv.clientWidth / 2) / sc2; v.cy = wy + (sy - cv.clientHeight / 2) / sc2;
      setViewId(null);
    };
    const local = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const nearest = (sx, sy) => {
      let best = null, bd = 18 * 18;
      for (const h of hits.current) { const d = (h.x - sx) ** 2 + (h.y - sy) ** 2; if (d < bd) { bd = d; best = h.id; } }
      return best;
    };
    const onDown = (e) => { cv.setPointerCapture?.(e.pointerId); pointers.set(e.pointerId, local(e)); moved = 0; if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch0 = Math.hypot(a[0] - b[0], a[1] - b[1]); } };
    const onMove = (e) => {
      const p = local(e);
      if (!pointers.has(e.pointerId)) { const h = nearest(p[0], p[1]); setHover(h); cv.style.cursor = h ? "pointer" : "grab"; return; }
      const prev = pointers.get(e.pointerId);
      pointers.set(e.pointerId, p);
      if (pointers.size === 2 && pinch0) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        zoomAt(d / pinch0, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); pinch0 = d; moved += 10; return;
      }
      const dx = p[0] - prev[0], dy = p[1] - prev[1];
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 4) { const sc = scaleNow(); view.current.cx -= dx / sc; view.current.cy += dy / sc; cv.style.cursor = "grabbing"; setViewId(null); }
    };
    const onUp = (e) => {
      const p = local(e);
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch0 = null;
      if (moved <= 4) { const h = nearest(p[0], p[1]); if (h) setSel(h); }
      cv.style.cursor = "grab";
    };
    const onWheel = (e) => { e.preventDefault(); const [sx, sy] = local(e); zoomAt(Math.exp(-e.deltaY * 0.0015), sx, sy); };
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);
    cv.addEventListener("pointerleave", () => setHover(null));
    cv.addEventListener("wheel", onWheel, { passive: false });
    return () => { cancelAnimationFrame(raf); io.disconnect(); cv.removeEventListener("pointerdown", onDown); cv.removeEventListener("pointermove", onMove); cv.removeEventListener("pointerup", onUp); cv.removeEventListener("pointercancel", onUp); cv.removeEventListener("wheel", onWheel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missions, planets]);

  const setView = (v) => { view.current = { zoom: v.zoom, cx: 0, cy: 0 }; setViewId(v.id); };
  const focus = (m) => {
    setSel(m.id);
    if (!m.xyz) return;
    // bring it into view, zoomed so its neighbourhood shows
    const r = Math.hypot(m.xyz[0], m.xyz[1]);
    const zoom = r > 60 ? 1.3 : r > 8 ? VIEWS[1].zoom * 1.1 : VIEWS[0].zoom * 0.9;
    const s = r ? squash(r) / r : 0;
    view.current = { zoom, cx: m.xyz[0] * s * 0.6, cy: m.xyz[1] * s * 0.6 };
    setViewId(null);
  };

  const m = missions.find((x) => x.id === sel);
  const sun = m?.xyz ? dist(m.xyz) : null;
  const fromEarth = m?.xyz ? dist(m.xyz, earth) : null;
  const years = m?.launched ? Math.floor((now - Date.parse(m.launched)) / (365.25 * 86400000)) : null;

  return (
    <div className="ds">
      <div className="ds-map" ref={wrapRef}>
        <canvas ref={cvRef} role="img" aria-label="Map of the solar system from above, with the planets and the deep-space missions where they are today" />
        <div className="ds-ctrl">
          {VIEWS.map((v) => <button key={v.id} type="button" className={`ds-b ${viewId === v.id ? "on" : ""}`} onClick={() => setView(v)}>{v.label}</button>)}
          <button type="button" className="ds-b" aria-label="Zoom in" onClick={() => { view.current.zoom = Math.min(40, view.current.zoom * 1.4); setViewId(null); }}>+</button>
          <button type="button" className="ds-b" aria-label="Zoom out" onClick={() => { view.current.zoom = Math.max(0.8, view.current.zoom / 1.4); setViewId(null); }}>−</button>
          <button type="button" className={`ds-b ${labels ? "on" : ""}`} aria-pressed={labels} onClick={() => setLabels((l) => !l)}>Labels</button>
        </div>
        <div className="ds-key">
          <span><i className="k-live" /> position today</span>
          <span><i className="k-approx" /> approximate</span>
          <span>Distance from the Sun squeezed so Voyager fits · directions true · drag, scroll or pinch</span>
        </div>
      </div>

      <div className="ds-side">
        {m ? (
          <div className="ds-card">
            <div className="ds-card-top">
              <h3 className="ds-name">{m.name}</h3>
              <button type="button" className="ds-close" onClick={() => setSel(null)} aria-label="Close mission details">×</button>
            </div>
            <div className="ds-agencies">{m.agency.map((a) => <span key={a} className="ds-ag" title={AGENCY_NAMES[a] || a}>{a}</span>)}<span className="ds-region">{m.region}</span></div>
            <dl className="ds-facts">
              {m.launched && <><dt>Launched</dt><dd>{new Date(m.launched).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}{years > 0 ? ` · ${years} yr in space` : ""}</dd></>}
              {sun != null && <><dt>From the Sun</dt><dd>{fmtAU(sun)} · {fmtKm(sun)}</dd></>}
              {fromEarth != null && m.at !== "earth" && <><dt>From Earth</dt><dd>{fmtAU(fromEarth)} · a signal takes {fmtTime(fromEarth * LIGHT_SECONDS_PER_AU)}</dd></>}
              {m.at === "earth" && <><dt>From Earth</dt><dd>1.5 million km · a signal takes about 5 seconds</dd></>}
            </dl>
            <p className="ds-p"><span className="ds-k">Objective</span>{m.objective}</p>
            <p className="ds-p"><span className="ds-k">Now</span>{m.now}</p>
            <p className="ds-src">
              {m.how === "live" ? `Position: JPL Horizons, ${m.date}. Line: its path over the past year.`
                : m.how === "planet" ? `Shown at ${m.at === "earth" ? "Earth" : "Mars"}'s position today.`
                : m.how === "approx" ? "Approximate position: live data from JPL isn't coming through right now."
                : "No position right now: live data from JPL isn't coming through."}
            </p>
          </div>
        ) : (
          <div className="ds-card ds-intro">
            <h3 className="ds-name">Where the missions are</h3>
            <p className="ds-p">Every probe on this map is where it is today, worked out by NASA&rsquo;s Jet Propulsion Laboratory. Pick one to see who sent it, why, and how long its signal takes to reach us.</p>
          </div>
        )}
        <ul className="ds-list">
          {missions.map((x) => (
            <li key={x.id}>
              <button type="button" className={`ds-item ${sel === x.id ? "on" : ""}`} onClick={() => focus(x)} onMouseEnter={() => setHover(x.id)} onMouseLeave={() => setHover(null)}>
                <i className={`ds-dot ${x.how === "approx" ? "approx" : x.xyz ? "" : "none"}`} />
                <span className="ds-iname">{x.name}</span>
                <span className="ds-idist">{x.xyz ? fmtAU(dist(x.xyz)) : "—"}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="ds-src">{liveCount ? `${liveCount} of ${MISSIONS.filter((x) => x.horizons).length} spacecraft live from JPL Horizons${dated ? `, ${dated}` : ""}. Refreshed every 6 hours.` : "Live spacecraft data from JPL isn't coming through right now; the Voyagers and New Horizons are shown at rough positions."}</p>
      </div>
    </div>
  );
}

export const DEEP_CSS = `
.ds { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 12px; min-height: 0; }
.ds-map { position: relative; aspect-ratio: 16 / 8; max-width: 100%; min-height: 320px; border: 1px solid rgba(185,192,255,.15); overflow: hidden; }
.ds-map canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; cursor: grab; touch-action: none; }
.ds-ctrl { position: absolute; top: 8px; left: 8px; display: flex; flex-wrap: wrap; gap: 4px; z-index: 2; }
.ds-b { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .06em; color: #B9C0FF; background: rgba(5,6,18,.8); border: 1px solid rgba(185,192,255,.35); border-radius: 2px; padding: 3px 8px; cursor: pointer; min-width: 26px; }
.ds-b:hover { color: #fff; border-color: #B9C0FF; }
.ds-b.on { background: rgba(185,192,255,.18); color: #fff; border-color: #B9C0FF; }
.ds-key { position: absolute; left: 8px; right: 8px; bottom: 6px; display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 10px; color: #6E76B8; pointer-events: none; z-index: 2; }
.ds-key i { display: inline-block; width: 8px; height: 8px; transform: rotate(45deg); margin-right: 5px; vertical-align: -1px; }
.k-live { background: #B9C0FF; } .k-approx { background: rgba(232,207,192,.55); outline: 1px solid rgba(232,207,192,.9); }
.ds-side { display: flex; flex-direction: column; gap: 8px; min-width: 0; min-height: 0; }
.ds-card { border: 1px solid rgba(185,192,255,.18); background: rgba(5,6,18,.6); padding: 10px 12px; display: grid; gap: 6px; }
.ds-card-top { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.ds-name { margin: 0; font-family: var(--font-display); font-style: italic; font-weight: 500; font-size: 19px; color: #EEF0FF; }
.ds-close { background: none; border: 0; color: #8A90C8; font-size: 18px; cursor: pointer; line-height: 1; }
.ds-close:hover { color: #fff; }
.ds-agencies { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
.ds-ag { font-size: 9.5px; letter-spacing: .1em; color: #0A0B1C; background: #B9C0FF; padding: 1px 5px; border-radius: 2px; }
.ds-region { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: #E8CFC0; margin-left: 4px; }
.ds-facts { margin: 2px 0 0; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 2px 10px; font-size: 11px; }
.ds-facts dt { color: #6E76B8; letter-spacing: .06em; text-transform: uppercase; font-size: 9.5px; padding-top: 2px; }
.ds-facts dd { margin: 0; color: #EEF0FF; font-variant-numeric: tabular-nums; }
.ds-p { margin: 0; font-family: var(--font-body); font-size: 12.5px; line-height: 1.5; color: #C9CDF2; }
.ds-k { display: block; font-family: var(--font-mono); font-size: 9.5px; letter-spacing: .14em; text-transform: uppercase; color: #6E76B8; margin-bottom: 1px; }
.ds-src { margin: 0; font-size: 10px; color: #565B8F; line-height: 1.5; }
.ds-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 2px 8px; overflow: auto; max-height: 220px; }
.ds-item { width: 100%; display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; align-items: center; gap: 6px; background: none; border: 0; border-bottom: 1px solid rgba(185,192,255,.08); padding: 4px 0; font-family: var(--font-mono); font-size: 11px; color: #C9CDF2; cursor: pointer; text-align: left; }
.ds-item:hover, .ds-item.on { color: #fff; }
.ds-item.on .ds-iname { color: #E8CFC0; }
.ds-item:focus-visible, .ds-b:focus-visible, .ds-close:focus-visible { outline: 2px solid #E8CFC0; outline-offset: 1px; }
.ds-dot { width: 7px; height: 7px; transform: rotate(45deg); background: #B9C0FF; }
.ds-dot.approx { background: rgba(232,207,192,.55); }
.ds-dot.none { background: #3A3E75; }
.ds-iname { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ds-idist { color: #6E76B8; font-size: 10px; font-variant-numeric: tabular-nums; }
@media (max-width: 1100px) { .ds { grid-template-columns: minmax(0, 1fr); } .ds-list { max-height: none; } }
@media (max-width: 560px) { .ds-map { aspect-ratio: 1 / 1; } .ds-key span:last-child { display: none; } }
`;
