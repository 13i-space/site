"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import FullscreenButton from "./FullscreenButton";
import { FEEDS, SIGNAL_TRACKS, embedUrl, watchUrl, feedForProvider } from "../lib/missionFeeds";
import { drawArt, drawStandby } from "../lib/missionArt";
import { landCells, LAND_W, LAND_H } from "../lib/earthLand";

// Mission Control (Update 6.24): live YouTube space feeds on one floor.
// One main screen plays; the monitors below show stills until picked. The
// ISS's real position (wheretheiss.at, public, no key), the launch schedule
// (passed in from the server, lib/launchSchedule.js), clocks, launch alerts
// and Signal mode (feeds muted, Signal 13i playing) sit around it.

const SIGNAL_LAUNCH = Date.parse("2027-04-06T00:00:00-05:00");
const ALERT_WINDOW = 30 * 60 * 1000;
const THUMBS_KEY = "mc-thumbs";
const p2 = (n) => String(n).padStart(2, "0");

function countdown(ms) {
  const neg = ms < 0;
  let s = Math.floor(Math.abs(ms) / 1000);
  const d = Math.floor(s / 86400); s %= 86400;
  const body = `${d ? d + "d " : ""}${p2(Math.floor(s / 3600))}:${p2(Math.floor((s % 3600) / 60))}:${p2(s % 60)}`;
  return (neg ? "T+" : "T−") + body;
}

function readThumbs() {
  try { return JSON.parse(localStorage.getItem(THUMBS_KEY) || "{}") || {}; } catch (e) { return {}; }
}
function saveThumb(feedId, videoId) {
  try { const t = readThumbs(); t[feedId] = videoId; localStorage.setItem(THUMBS_KEY, JSON.stringify(t)); } catch (e) { /* ignore */ }
}

// ---------- the YouTube IFrame API, loaded once ----------
let ytPromise = null;
function loadYT() {
  if (typeof window === "undefined") return Promise.reject();
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytPromise) return ytPromise;
  ytPromise = new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { try { prev && prev(); } catch (e) { /* ignore */ } resolve(window.YT); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    s.onerror = () => { ytPromise = null; reject(new Error("YouTube API unavailable")); };
    document.head.appendChild(s);
  });
  return ytPromise;
}

// ---------- a canvas that draws a monitor's art ----------
function ArtCanvas({ art, fps = 1, standby = null, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0, last = -1e9, alive = true;
    const draw = (now) => {
      if (!alive) return;
      if (now - last >= 1000 / fps) {
        last = now;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
        if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
        const ctx = cv.getContext("2d");
        const t = reduce ? 0 : (now - t0) / 1000;
        if (standby) drawStandby(ctx, w, h, t, standby, reduce);
        else drawArt(ctx, w, h, t, art);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onFonts = () => { last = -1e9; if (reduce) raf = requestAnimationFrame(draw); };
    document.fonts?.ready?.then(onFonts).catch(() => {});
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, [art, fps, standby && standby.join("|")]);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

// ---------- the main screen ----------
function MainScreen({ feed, reloadKey, muted, onInfo, onState }) {
  const frameRef = useRef(null);
  const playerRef = useRef(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  useEffect(() => {
    let cancelled = false;
    playerRef.current = null;
    onState("acquiring");
    loadYT().then((YT) => {
      if (cancelled || !frameRef.current) return;
      try {
        playerRef.current = new YT.Player(frameRef.current, {
          events: {
            onReady: (e) => { if (mutedRef.current) e.target.mute(); },
            onStateChange: (e) => {
              if (e.data === 1) {
                onState("live");
                try { const d = e.target.getVideoData(); if (d && d.video_id) onInfo({ videoId: d.video_id, title: d.title || "" }); } catch (err) { /* ignore */ }
              } else if (e.data === 0) {
                onState("lost"); // a live stream that ended
              }
            },
            onError: () => onState("lost"),
          },
        });
      } catch (e) { /* the iframe still plays without the API */ }
    }).catch(() => { /* blocked: the iframe still plays on its own */ });
    // if nothing reports in, stop showing "acquiring" - the player itself
    // is visible and may just be waiting for a tap (autoplay blocked)
    const t = setTimeout(() => { if (!cancelled) onState((s) => (s === "acquiring" ? "waiting" : s)); }, 9000);
    // (no player.destroy(): it removes the iframe, which React owns and
    // replaces itself when the feed changes)
    return () => { cancelled = true; clearTimeout(t); playerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feed.id, reloadKey]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || !p.mute) return;
    try { muted ? p.mute() : p.unMute(); } catch (e) { /* ignore */ }
  }, [muted]);

  return (
    <iframe
      key={feed.id + ":" + reloadKey}
      ref={frameRef}
      className="mc-player"
      src={embedUrl(feed)}
      title={`${feed.code}: ${feed.name} (${feed.source}) live on YouTube`}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}

// ---------- Signal mode's waveform, drawn over the bottom of the screen ----------
function SignalWave({ analyser }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const buf = analyser ? new Uint8Array(analyser.fftSize) : null;
    let raf = 0;
    const t0 = performance.now();
    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(cv.clientWidth * dpr), h = Math.round(cv.clientHeight * dpr);
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      const ctx = cv.getContext("2d");
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(185,192,255,.9)"; ctx.lineWidth = Math.max(1, dpr * 1.2);
      ctx.shadowColor = "rgba(139,149,246,.8)"; ctx.shadowBlur = 8 * dpr;
      ctx.beginPath();
      const t = (performance.now() - t0) / 1000;
      if (buf) analyser.getByteTimeDomainData(buf);
      for (let x = 0; x <= w; x += 3) {
        const p = x / w, env = Math.sin(p * Math.PI);
        let v;
        if (buf) v = (buf[Math.floor(p * (buf.length - 1))] - 128) / 128;
        else v = Math.sin(p * 38 + t * 3.1) * 0.5 + Math.sin(p * 91 - t * 5.3) * 0.25;
        const y = h / 2 + env * v * h * 0.42;
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [analyser]);
  return <canvas ref={ref} className="mc-wave" aria-hidden="true" />;
}

// ---------- the ISS tracker ----------
const INC = (51.64 * Math.PI) / 180, PERIOD = 92.68 * 60, WE = (2 * Math.PI) / 86164;

// a circular-orbit model anchored to the real position, so the drawn track
// lines up with where the station actually is
function makeOrbit(fix, prevFix) {
  if (!fix) {
    // no real fix yet: a free-running estimate
    return (sec) => {
      const u = (2 * Math.PI * sec) / PERIOD;
      const lat = Math.asin(Math.sin(INC) * Math.sin(u));
      const lon = Math.atan2(Math.cos(INC) * Math.sin(u), Math.cos(u)) + 1.1 - WE * sec;
      return [(lat * 180) / Math.PI, norm((lon * 180) / Math.PI)];
    };
  }
  const lat0 = (fix.lat * Math.PI) / 180;
  const ascending = prevFix ? fix.lat >= prevFix.lat : true;
  const s = Math.max(-1, Math.min(1, Math.sin(lat0) / Math.sin(INC)));
  const u0 = ascending ? Math.asin(s) : Math.PI - Math.asin(s);
  const lonOff = (fix.lon * Math.PI) / 180 - Math.atan2(Math.cos(INC) * Math.sin(u0), Math.cos(u0));
  return (sec) => {
    const dt = sec - fix.t;
    const u = u0 + (2 * Math.PI * dt) / PERIOD;
    const lat = Math.asin(Math.sin(INC) * Math.sin(u));
    const lon = Math.atan2(Math.cos(INC) * Math.sin(u), Math.cos(u)) + lonOff - WE * dt;
    return [(lat * 180) / Math.PI, norm((lon * 180) / Math.PI)];
  };
}
function norm(lon) { return ((((lon + 180) % 360) + 360) % 360) - 180; }

function IssTracker() {
  const cvRef = useRef(null);
  const fixes = useRef([]);
  const [read, setRead] = useState({ lat: null, lon: null, alt: null, vel: null, real: false });

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const r = await fetch("https://api.wheretheiss.at/v1/satellites/25544", { cache: "no-store" });
        if (!r.ok) throw new Error("bad");
        const d = await r.json();
        if (!alive || typeof d.latitude !== "number") return;
        fixes.current = [...fixes.current.slice(-1), { lat: d.latitude, lon: d.longitude, t: d.timestamp || Date.now() / 1000 }];
        setRead({ lat: d.latitude, lon: d.longitude, alt: d.altitude, vel: d.velocity, real: true });
      } catch (e) {
        if (alive) setRead((r) => ({ ...r, real: fixes.current.length > 0 && r.real }));
      }
    };
    poll();
    const id = setInterval(poll, 10000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const land = landCells();
    let id = 0;
    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      const ctx = cv.getContext("2d");
      const X = (lon) => ((lon + 180) / 360) * w, Y = (lat) => ((90 - lat) / 180) * h;
      ctx.fillStyle = "#0E1030"; ctx.fillRect(0, 0, w, h);
      // land as a dot grid
      const step = 2;
      const cw = w / LAND_W, ch = h / LAND_H;
      const dot = Math.max(1, Math.min(cw, ch) * step * 0.55);
      ctx.fillStyle = "rgba(185,192,255,.42)";
      for (let y = 0; y < LAND_H; y += step) for (let x = 0; x < LAND_W; x += step) {
        if (land[y * LAND_W + x]) ctx.fillRect(x * cw, y * ch, dot, dot);
      }
      // night
      const d = new Date();
      const doy = (d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 0)) / 86400000;
      const decl = ((-23.44 * Math.cos(((2 * Math.PI) / 365) * (doy + 10))) * Math.PI) / 180;
      const uh = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
      const sunLon = ((12 - uh) * 15 * Math.PI) / 180;
      const cell = Math.max(3, Math.round(w / 120));
      for (let py = 0; py < h; py += cell) {
        const lat = ((90 - ((py + cell / 2) / h) * 180) * Math.PI) / 180;
        for (let px = 0; px < w; px += cell) {
          const lon = ((((px + cell / 2) / w) * 360 - 180) * Math.PI) / 180;
          const cz = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(lon - sunLon);
          const a = Math.min(1, Math.max(0, -cz * 5 + 0.1));
          if (a > 0) { ctx.fillStyle = `rgba(4,5,16,${a * 0.62})`; ctx.fillRect(px, py, cell, cell); }
        }
      }
      // equator
      ctx.strokeStyle = "rgba(185,192,255,.18)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(w, Y(0)); ctx.stroke();
      // track
      const f = fixes.current;
      const orbit = makeOrbit(f[f.length - 1], f[f.length - 2]);
      const nowS = Date.now() / 1000;
      const seg = (from, to, style, dash) => {
        ctx.strokeStyle = style; ctx.setLineDash(dash); ctx.lineWidth = Math.max(1, w / 280);
        ctx.beginPath(); let prev = null;
        for (let s = from; s <= to; s += 30) {
          const [la, lo] = orbit(nowS + s);
          if (prev === null || Math.abs(lo - prev) > 180) ctx.moveTo(X(lo), Y(la)); else ctx.lineTo(X(lo), Y(la));
          prev = lo;
        }
        ctx.stroke(); ctx.setLineDash([]);
      };
      seg(-45 * 60, 0, "rgba(110,118,184,.75)", [w / 120, w / 160]);
      seg(0, 92 * 60, "rgba(185,192,255,.95)", []);
      const [la, lo] = orbit(nowS);
      const x = X(lo), y = Y(la);
      const halo = ctx.createRadialGradient(x, y, 0, x, y, w * 0.05);
      halo.addColorStop(0, "rgba(232,207,192,.55)"); halo.addColorStop(1, "rgba(232,207,192,0)");
      ctx.fillStyle = halo; ctx.fillRect(x - w * 0.05, y - w * 0.05, w * 0.1, w * 0.1);
      ctx.fillStyle = "#E8CFC0"; ctx.beginPath(); ctx.arc(x, y, Math.max(2.5, w / 110), 0, Math.PI * 2); ctx.fill();
      if (!fixes.current.length) setRead((r) => (r.real ? r : { lat: la, lon: lo, alt: null, vel: null, real: false }));
    };
    draw();
    id = setInterval(draw, 2000);
    return () => clearInterval(id);
  }, []);

  const fmt = (v, pos, neg) => (v == null ? "--" : `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`);
  return (
    <section className="mc-panel">
      <div className="mc-panel-head">
        <h2 className="mc-h2">Where the station is</h2>
        <span className={`mc-tag ${read.real ? "on" : ""}`}>{read.real ? "Live position" : "Estimated"}</span>
      </div>
      <div className="mc-map"><canvas ref={cvRef} aria-label="Map of the space station's position and path" role="img" /></div>
      <div className="mc-readouts">
        <div><span className="mc-label">Latitude</span><span className="mc-v">{fmt(read.lat, "N", "S")}</span></div>
        <div><span className="mc-label">Longitude</span><span className="mc-v">{fmt(read.lon, "E", "W")}</span></div>
        <div><span className="mc-label">Altitude</span><span className="mc-v">{read.alt == null ? "≈ 420 km" : `${read.alt.toFixed(1)} km`}</span></div>
        <div><span className="mc-label">Speed</span><span className="mc-v">{read.vel == null ? "≈ 27,600 km/h" : `${Math.round(read.vel).toLocaleString("en-US")} km/h`}</span></div>
      </div>
      <p className="mc-note">Solid line: the next orbit. Dashed: the last 45 minutes. Shaded: night.</p>
    </section>
  );
}

// ---------- the page ----------
export default function MissionControl({ launches = [] }) {
  const frameRef = useRef(null);
  const [mainId, setMainId] = useState(FEEDS[0].id);
  const [state, setState] = useState("acquiring"); // acquiring | live | waiting | lost
  const [reloadKey, setReloadKey] = useState(0);
  const [info, setInfo] = useState({});
  const [thumbs, setThumbs] = useState({});
  const [sound, setSound] = useState(false);
  const [signal, setSignal] = useState(false);
  const [track, setTrack] = useState(0);
  const [analyser, setAnalyser] = useState(null);
  // the clock starts once the page is in the browser, so the server's HTML
  // (rendered at a different moment) never disagrees with it
  const [now, setNow] = useState(null);
  const [dismissed, setDismissed] = useState({});
  const audioRef = useRef(null);
  const audioGraph = useRef(null);
  const lastPick = useRef(0);
  const promoted = useRef({});

  const feed = FEEDS.find((f) => f.id === mainId) || FEEDS[0];

  useEffect(() => { setThumbs(readThumbs()); }, []);
  useEffect(() => { setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);

  // a lost stream tries again on its own
  useEffect(() => {
    if (state !== "lost") return;
    const id = setTimeout(() => setReloadKey((k) => k + 1), 45000);
    return () => clearTimeout(id);
  }, [state]);

  const pick = useCallback((id, byPerson = true) => {
    if (byPerson) lastPick.current = Date.now();
    setMainId(id);
  }, []);

  const onInfo = useCallback((d) => {
    setInfo((cur) => ({ ...cur, [mainId]: d }));
    saveThumb(mainId, d.videoId);
    setThumbs((t) => ({ ...t, [mainId]: d.videoId }));
  }, [mainId]);

  // launch alert: the next launch inside 30 minutes moves its feed up
  const ready = now !== null;
  const upcoming = ready ? launches.filter((l) => Date.parse(l.net) - now > -20 * 60 * 1000) : launches;
  const alertLaunch = ready && upcoming.find((l) => {
    const dt = Date.parse(l.net) - now;
    return dt <= ALERT_WINDOW && dt > -15 * 60 * 1000 && !dismissed[l.id] && !/fail|success/i.test(l.statusName || "");
  });
  const alertFeed = alertLaunch ? feedForProvider(alertLaunch.provider) : null;
  useEffect(() => {
    if (!alertLaunch || !alertFeed || promoted.current[alertLaunch.id]) return;
    promoted.current[alertLaunch.id] = true;
    if (Date.now() - lastPick.current > 2 * 60 * 1000) pick(alertFeed.id, false);
  }, [alertLaunch, alertFeed, pick]);

  // Signal mode: our music over the live view, the feed muted
  const startSignal = async (i = track) => {
    const el = audioRef.current;
    if (!el) return;
    el.src = SIGNAL_TRACKS[i].src;
    try {
      if (!audioGraph.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) {
          const ac = new AC();
          const src = ac.createMediaElementSource(el);
          const an = ac.createAnalyser(); an.fftSize = 1024;
          src.connect(an); an.connect(ac.destination);
          audioGraph.current = { ac, an };
          setAnalyser(an);
        }
      }
      await audioGraph.current?.ac.resume();
    } catch (e) { /* plays without the waveform */ }
    try { await el.play(); } catch (e) { /* needs another tap */ }
  };
  const toggleSignal = () => {
    if (signal) { setSignal(false); try { audioRef.current?.pause(); } catch (e) { /* ignore */ } return; }
    setSignal(true); setSound(false); startSignal(track);
  };
  const nextTrack = () => { const n = (track + 1) % SIGNAL_TRACKS.length; setTrack(n); if (signal) startSignal(n); };

  const muted = signal || !sound;
  const live = state === "live";
  const stateLabel = { acquiring: "ACQUIRING", live: "LIVE", waiting: "READY", lost: "STANDBY" }[state];
  const nowShowing = info[mainId]?.title;

  const d = new Date(now || 0);
  const utc = ready ? `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${p2(d.getUTCSeconds())}` : "--:--:--";
  let central = "--:--:--";
  if (ready) try { central = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(d); } catch (e) { /* ignore */ }

  return (
    <div className="mc-wrap">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mc-crumbs">
        <Link href="/galaxy/news#page-3" className="mono mc-back">&larr; The Galactic Gazette</Link>
        <Link href="/galaxy" className="mono mc-back">The Galaxy</Link>
      </div>

      <div className="game-frame mc-frame" ref={frameRef}>
        <header className="mc-top">
          <div className="mc-title-block">
            <span className="mc-label">Explore · Live from orbit</span>
            <h1 className="mc-title">Mission Control</h1>
            <p className="mc-sub">Live views of Earth from the space station and of the launch pads, on one floor. Pick a monitor to put it on the main screen.</p>
          </div>
          <div className="mc-clocks">
            <div><span className="mc-label">UTC</span><span className="mc-clock">{utc}</span></div>
            <div><span className="mc-label">Central</span><span className="mc-clock">{central}</span></div>
            <div><span className="mc-label">Signal launch</span><span className="mc-clock warm">{ready ? countdown(SIGNAL_LAUNCH - now) : "--"}</span></div>
            <div className="mc-fs"><FullscreenButton targetRef={frameRef} /></div>
          </div>
        </header>

        {alertLaunch && (
          <div className="mc-alert" role="status">
            <span className="mc-alert-k">Launch {Date.parse(alertLaunch.net) > now ? "in" : "underway"}</span>
            <span className="mc-alert-t">{countdown(Date.parse(alertLaunch.net) - now)}</span>
            <span className="mc-alert-w">{alertLaunch.rocket}{alertLaunch.mission ? ` · ${alertLaunch.mission}` : ""}</span>
            {alertFeed && mainId !== alertFeed.id
              ? <button type="button" className="mc-btn" onClick={() => pick(alertFeed.id)}>Watch on {alertFeed.code}</button>
              : <span className="mc-alert-on">On the main screen · {alertFeed?.code}</span>}
            <button type="button" className="mc-x" onClick={() => setDismissed((x) => ({ ...x, [alertLaunch.id]: true }))} aria-label="Dismiss launch alert">×</button>
          </div>
        )}

        <div className="mc-floor">
          <div className="mc-left">
            <div className="mc-strip">
              <span className="mc-code">{feed.code}</span>
              <span className="mc-name">{feed.name}</span>
              <span className="mc-src">{feed.source}</span>
              <span className={`mc-pill ${live ? "" : "off"}`}><span className="dot" />{stateLabel}</span>
            </div>

            <div className="mc-screen">
              <MainScreen feed={feed} reloadKey={reloadKey} muted={muted} onInfo={onInfo} onState={setState} />
              {state === "lost" && (
                <div className="mc-standby">
                  <ArtCanvas art="signal" fps={30} standby={["SIGNAL LOST", "REACQUIRING"]} />
                  <div className="mc-standby-act">
                    <span>This stream is quiet right now. It tries again on its own every minute.</span>
                    <button type="button" className="mc-btn" onClick={() => { setState("acquiring"); setReloadKey((k) => k + 1); }}>Try now</button>
                  </div>
                </div>
              )}
              {state === "acquiring" && <div className="mc-acq mono">ACQUIRING SIGNAL…</div>}
              {signal && <SignalWave analyser={analyser} />}
              <span className="mc-br tl" /><span className="mc-br tr" /><span className="mc-br bl" /><span className="mc-br br" />
            </div>

            <div className="mc-strip mc-strip-low">
              <span className="mc-utc">UTC {utc}</span>
              <span className="mc-showing">{signal ? `Signal mode · ${SIGNAL_TRACKS[track].title} — Signal 13i` : nowShowing ? `Now showing: ${nowShowing}` : ""}</span>
              <span className="mc-strip-acts">
                {signal
                  ? <button type="button" className="mc-btn" onClick={nextTrack}>Next track</button>
                  : <button type="button" className="mc-btn" aria-pressed={sound} onClick={() => setSound((s) => !s)}>{sound ? "Sound off" : "Sound on"}</button>}
                <a className="mc-link" href={watchUrl(feed, info[mainId]?.videoId)} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
              </span>
            </div>

            <div className="mc-monitors">
              {FEEDS.map((f) => (
                <button key={f.id} type="button" className="mc-mon" aria-pressed={mainId === f.id} onClick={() => pick(f.id)} aria-label={`${f.code}: ${f.name}, ${f.source}. Put on the main screen`}>
                  <span className="mc-glass">
                    <ArtCanvas art={f.art} />
                    {thumbs[f.id] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`https://i.ytimg.com/vi/${thumbs[f.id]}/hqdefault.jpg`} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    )}
                  </span>
                  <span className="mc-meta"><span className="s" /><span className="c">{f.code}</span><span className="n">{f.source}</span></span>
                </button>
              ))}
              <button type="button" className="mc-mon" aria-pressed={signal} onClick={toggleSignal} aria-label={signal ? "Turn Signal mode off" : "Signal mode: mute the feeds and play Signal 13i"}>
                <span className="mc-glass"><ArtCanvas art="signal" fps={20} /></span>
                <span className="mc-meta"><span className="s sig" /><span className="c">SIGNAL</span><span className="n">{signal ? "playing · tap to stop" : "Signal 13i over the feed"}</span></span>
              </button>
            </div>
            <audio ref={audioRef} onEnded={nextTrack} preload="none" crossOrigin="anonymous" />
          </div>

          <aside className="mc-right">
            <IssTracker />
            <section className="mc-panel">
              <div className="mc-panel-head">
                <h2 className="mc-h2">Next launches</h2>
                <span className="mc-tag">Every 15 min</span>
              </div>
              {upcoming.length === 0 ? (
                <p className="mc-note">The launch schedule isn&rsquo;t coming through right now. It checks again every 15 minutes.</p>
              ) : (
                <ul className="mc-launches">
                  {upcoming.slice(0, 5).map((l, i) => {
                    const dt = Date.parse(l.net) - now;
                    const f = feedForProvider(l.provider);
                    return (
                      <li key={l.id} className={i === 0 ? "next" : ""}>
                        <span className="w">{l.rocket}{l.mission ? <em> · {l.mission}</em> : null}</span>
                        <span className="t">{ready ? countdown(dt) : "--:--:--"}</span>
                        <span className="where">{[l.provider, l.location].filter(Boolean).join(" · ")}</span>
                        <span className="st">
                          {l.live && <span className="chip live">Webcast live</span>}
                          {l.status && <span className={`chip ${/go/i.test(l.status) ? "go" : ""}`} title={l.statusName}>{l.status}</span>}
                          {ready && i === 0 && f && dt < 6 * 3600 * 1000 && <button type="button" className="mc-mini" onClick={() => pick(f.id)}>Watch</button>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <p className="mc-note">Schedule from The Space Devs&rsquo; Launch Library. Times move often; &ldquo;TBD&rdquo; means the date isn&rsquo;t firm yet.</p>
            </section>
          </aside>
        </div>
        <p className="mc-credit">Streams play from their owners&rsquo; YouTube channels: NASA, Sen and NASASpaceflight. Station position from wheretheiss.at.</p>
      </div>
    </div>
  );
}

const CSS = `
.mc-wrap { max-width: 1260px; margin: 0 auto; padding: 18px 16px 48px; }
.mc-crumbs { display: flex; gap: 18px; margin-bottom: 14px; }
.mc-back { font-size: 12px; color: #6E76B8; text-decoration: none; }
.mc-back:hover { color: #B9C0FF; }
.mc-frame { display: grid; gap: 18px; }
.mc-frame:fullscreen, .mc-frame:-webkit-full-screen { overflow: auto; padding: 20px max(20px, env(safe-area-inset-left, 0px)); background: #0A0B1C; display: grid; }
.mc-frame.pseudo-fullscreen { padding: 44px 16px 20px; background: #0A0B1C; display: grid; }
.mc-label { display: block; font-family: var(--font-mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: #6E76B8; }
.mc-top { display: flex; flex-wrap: wrap; gap: 16px 32px; align-items: flex-end; justify-content: space-between; }
.mc-title-block { display: grid; gap: 4px; min-width: 0; }
.mc-title { margin: 0; font-family: var(--font-display); font-style: italic; font-weight: 500; font-size: clamp(34px, 5vw, 56px); line-height: 1.05; color: #EEF0FF; }
.mc-sub { margin: 4px 0 0; color: #8A90C8; max-width: 54ch; font-size: 15px; line-height: 1.5; }
.mc-clocks { display: flex; flex-wrap: wrap; gap: 10px 24px; align-items: flex-end; }
.mc-clocks > div { display: grid; gap: 2px; }
.mc-clock { font-family: var(--font-mono); font-size: 19px; color: #EEF0FF; font-variant-numeric: tabular-nums; }
.mc-clock.warm { color: #E8CFC0; }
.mc-fs { align-self: center; }

.mc-alert { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; padding: 10px 14px; border: 1px solid rgba(201,123,110,.7); background: rgba(201,123,110,.14); border-radius: 4px; font-family: var(--font-mono); font-size: 12px; color: #F2DAD4; }
.mc-alert-k { letter-spacing: .14em; text-transform: uppercase; color: #C97B6E; }
.mc-alert-t { font-size: 16px; color: #fff; font-variant-numeric: tabular-nums; }
.mc-alert-w { flex: 1 1 200px; min-width: 0; }
.mc-alert-on { color: #E8CFC0; }
.mc-x { margin-left: auto; background: none; border: 0; color: #F2DAD4; font-size: 20px; line-height: 1; cursor: pointer; padding: 0 4px; }

.mc-floor { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 20px; align-items: start; }
@media (max-width: 980px) { .mc-floor { grid-template-columns: minmax(0, 1fr); } }
.mc-left { display: grid; gap: 10px; min-width: 0; }
.mc-strip { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; font-family: var(--font-mono); font-size: 12px; color: #C9CDF2; min-width: 0; }
.mc-code { letter-spacing: .14em; color: #EEF0FF; font-size: 13px; }
.mc-src { color: #6E76B8; }
.mc-pill { margin-left: auto; display: inline-flex; align-items: center; gap: 7px; font-size: 11px; letter-spacing: .14em; padding: 3px 9px; border-radius: 999px; border: 1px solid rgba(232,207,192,.45); color: #E8CFC0; }
.mc-pill .dot { width: 7px; height: 7px; border-radius: 50%; background: #E8CFC0; box-shadow: 0 0 8px #E8CFC0; animation: mc-pulse 1.6s ease-in-out infinite; }
.mc-pill.off { border-color: rgba(185,192,255,.35); color: #6E76B8; }
.mc-pill.off .dot { background: #565B8F; box-shadow: none; animation: none; }
@keyframes mc-pulse { 50% { opacity: .35; } }
.mc-strip-low { color: #8A90C8; }
.mc-utc { font-variant-numeric: tabular-nums; }
.mc-showing { flex: 1 1 220px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #B9C0FF; }
.mc-strip-acts { display: flex; gap: 10px; align-items: center; margin-left: auto; }
.mc-link { color: #B9C0FF; text-decoration: none; border-bottom: 1px solid rgba(185,192,255,.4); white-space: nowrap; }
.mc-link:hover { color: #fff; }

.mc-screen { position: relative; aspect-ratio: 16 / 9; max-width: 100%; border: 1px solid rgba(185,192,255,.42); border-radius: 4px; overflow: hidden; background: #03040b; }
.mc-player { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; display: block; }
.mc-br { position: absolute; width: 16px; height: 16px; border-color: #B9C0FF; opacity: .75; pointer-events: none; z-index: 3; }
.mc-br.tl { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
.mc-br.tr { top: -1px; right: -1px; border-top: 2px solid; border-right: 2px solid; }
.mc-br.bl { bottom: -1px; left: -1px; border-bottom: 2px solid; border-left: 2px solid; }
.mc-br.br { bottom: -1px; right: -1px; border-bottom: 2px solid; border-right: 2px solid; }
.mc-standby { position: absolute; inset: 0; z-index: 2; }
.mc-standby canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.mc-standby-act { position: absolute; left: 0; right: 0; bottom: 8%; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 0 16px; text-align: center; font-size: 13px; color: #8A90C8; }
.mc-acq { position: absolute; left: 14px; bottom: 12px; z-index: 2; font-size: 11px; letter-spacing: .14em; color: #B9C0FF; background: rgba(10,11,28,.7); padding: 3px 8px; border-radius: 3px; pointer-events: none; }
.mc-wave { position: absolute; left: 0; right: 0; bottom: 0; height: 22%; width: 100%; z-index: 2; pointer-events: none; background: linear-gradient(to bottom, rgba(10,11,28,0), rgba(10,11,28,.55)); }

.mc-btn { font-family: var(--font-mono); font-size: 12px; color: #B9C0FF; background: rgba(20,22,58,.6); border: 1px solid rgba(185,192,255,.42); border-radius: 4px; padding: 6px 11px; cursor: pointer; transition: border-color .15s, color .15s; }
.mc-btn:hover { border-color: #B9C0FF; color: #fff; }
.mc-btn[aria-pressed="true"] { background: rgba(185,192,255,.16); border-color: #B9C0FF; color: #fff; }
.mc-btn:focus-visible, .mc-mon:focus-visible, .mc-mini:focus-visible, .mc-link:focus-visible, .mc-x:focus-visible { outline: 2px solid #E8CFC0; outline-offset: 2px; }

.mc-monitors { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 6px; }
@media (max-width: 640px) { .mc-monitors { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.mc-mon { display: grid; gap: 6px; padding: 0; margin: 0; background: none; border: 0; text-align: left; cursor: pointer; color: inherit; font: inherit; min-width: 0; }
.mc-glass { position: relative; display: block; aspect-ratio: 16 / 9; max-width: 100%; border: 1px solid rgba(185,192,255,.18); border-radius: 3px; overflow: hidden; background: #03040b; transition: border-color .15s, transform .15s; }
.mc-glass canvas, .mc-glass img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: cover; }
.mc-mon:hover .mc-glass { border-color: rgba(185,192,255,.42); transform: translateY(-1px); }
.mc-mon[aria-pressed="true"] .mc-glass { border-color: #B9C0FF; box-shadow: 0 0 0 1px #B9C0FF, 0 0 18px rgba(139,149,246,.25); }
.mc-meta { display: flex; align-items: center; gap: 6px; min-width: 0; font-family: var(--font-mono); font-size: 11px; }
.mc-meta .s { width: 6px; height: 6px; border-radius: 50%; flex: none; background: #E8CFC0; box-shadow: 0 0 6px rgba(232,207,192,.8); }
.mc-meta .s.sig { background: #B9C0FF; box-shadow: 0 0 6px rgba(185,192,255,.8); }
.mc-meta .c { letter-spacing: .1em; color: #DADDF7; white-space: nowrap; }
.mc-meta .n { color: #6E76B8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.mc-mon[aria-pressed="true"] .c { color: #B9C0FF; }

.mc-right { display: grid; gap: 14px; min-width: 0; }
.mc-panel { background: rgba(20,22,58,.55); border: 1px solid rgba(185,192,255,.18); border-radius: 4px; padding: 16px; display: grid; gap: 12px; min-width: 0; }
.mc-panel-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
.mc-h2 { margin: 0; font-family: var(--font-display); font-style: italic; font-weight: 500; font-size: 20px; color: #EEF0FF; }
.mc-tag { font-family: var(--font-mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #565B8F; white-space: nowrap; }
.mc-tag.on { color: #E8CFC0; }
.mc-map { position: relative; aspect-ratio: 2 / 1; max-width: 100%; border: 1px solid rgba(185,192,255,.18); border-radius: 3px; overflow: hidden; }
.mc-map canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.mc-readouts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 14px; }
.mc-v { display: block; font-family: var(--font-mono); font-size: 15px; color: #EEF0FF; font-variant-numeric: tabular-nums; }
.mc-note { margin: 0; font-size: 12px; line-height: 1.5; color: #6E76B8; }
.mc-launches { list-style: none; margin: 0; padding: 0; display: grid; }
.mc-launches li { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 3px 12px; padding: 10px 0; border-top: 1px solid rgba(185,192,255,.18); }
.mc-launches li:first-child { border-top: 0; padding-top: 0; }
.mc-launches .w { font-size: 14px; color: #EEF0FF; min-width: 0; }
.mc-launches .w em { font-style: normal; color: #B9C0FF; }
.mc-launches .t { font-family: var(--font-mono); font-size: 13px; color: #B9C0FF; font-variant-numeric: tabular-nums; text-align: right; white-space: nowrap; }
.mc-launches li.next .t { color: #E8CFC0; }
.mc-launches .where { font-size: 12px; color: #6E76B8; min-width: 0; }
.mc-launches .st { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 2px; }
.mc-launches .st:empty { display: none; }
.chip { font-family: var(--font-mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; padding: 1px 6px; border-radius: 3px; border: 1px solid rgba(185,192,255,.3); color: #8A90C8; }
.chip.go { border-color: rgba(232,207,192,.5); color: #E8CFC0; }
.chip.live { border-color: rgba(201,123,110,.7); color: #F2DAD4; }
.mc-mini { font-family: var(--font-mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: #B9C0FF; background: none; border: 1px solid rgba(185,192,255,.42); border-radius: 3px; padding: 1px 7px; cursor: pointer; }
.mc-mini:hover { color: #fff; border-color: #B9C0FF; }
.mc-credit { margin: 0; font-size: 12px; color: #565B8F; }
@media (max-width: 560px) {
  .mc-src { display: none; }
  .mc-clock { font-size: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .mc-pill .dot { animation: none; }
  .mc-glass { transition: none; }
}
`;
