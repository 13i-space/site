"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import FullscreenButton from "./FullscreenButton";
import { FEEDS, SIGNAL_TRACKS, embedUrl, watchUrl, thumbUrl, feedForLaunch } from "../lib/missionFeeds";
import { drawArt, drawStandby } from "../lib/missionArt";
import { landCells, LAND_W, LAND_H } from "../lib/earthLand";
import DeepSpaceMap, { DEEP_CSS } from "./DeepSpaceMap";

// Mission Control (Update 6.24, rebuilt as a full control room in 6.25):
// the whole window. A wall of screens - one big, four smaller, all live on a
// computer, stills on a phone - over a row of console monitors: the ISS's real
// position (wheretheiss.at), the launch schedule (lib/launchSchedule.js, from
// the server) and the feed board. Every screen falls back through its backup
// streams (lib/missionFeeds.js). A small ring-eye on the feed board's console
// plays Signal 13i over the feeds.

const SIGNAL_LAUNCH = Date.parse("2027-04-06T00:00:00-05:00");
const ALERT_WINDOW = 30 * 60 * 1000;
const RETRY_ALL_MS = 60 * 1000;
const STUCK_MS = 30 * 1000;
const p2 = (n) => String(n).padStart(2, "0");

function countdown(ms, sign = true) {
  const neg = ms < 0;
  let s = Math.floor(Math.abs(ms) / 1000);
  const d = Math.floor(s / 86400); s %= 86400;
  const body = `${d ? d + "d " : ""}${p2(Math.floor(s / 3600))}:${p2(Math.floor((s % 3600) / 60))}:${p2(s % 60)}`;
  return sign ? (neg ? "T+" : "T−") + body : body;
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

function useMedia(q) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on));
  }, [q]);
  return m;
}

// ---------- a canvas drawing (previews, standby) ----------
function ArtCanvas({ art, fps = 1, standby = null }) {
  const ref = useRef(null);
  const key = standby ? standby.join("|") : "";
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
    document.fonts?.ready?.then(() => { last = -1e9; if (reduce) raf = requestAnimationFrame(draw); }).catch(() => {});
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, [art, fps, key]);
  return <canvas ref={ref} className="mc-cv" aria-hidden="true" />;
}

// ---------- one screen: a feed, trying its sources in order ----------
function FeedScreen({ feed, main, playing, muted, onStatus, onPick, children }) {
  const [idx, setIdx] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState("connecting"); // connecting | live | out
  const frameRef = useRef(null);
  const playerRef = useRef(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const source = feed.sources[Math.min(idx, feed.sources.length - 1)];

  const report = useCallback((patch) => onStatus(feed.id, patch), [feed.id, onStatus]);

  const idxRef = useRef(0);
  idxRef.current = idx;
  const advance = useCallback(() => {
    const i = idxRef.current;
    if (i + 1 < feed.sources.length) { setIdx(i + 1); setState("connecting"); }
    else setState("out");
  }, [feed.sources.length]);

  // all sources out: start again from the top in a minute
  useEffect(() => {
    if (state !== "out") { return; }
    report({ state: "out", label: "All sources out", idx });
    const t = setTimeout(() => { setIdx(0); setAttempt((a) => a + 1); setState("connecting"); }, RETRY_ALL_MS);
    return () => clearTimeout(t);
  }, [state, idx, report]);

  useEffect(() => {
    if (!playing || state === "out") return;
    let cancelled = false, isPlaying = false;
    playerRef.current = null;
    report({ state: "connecting", label: source.label, idx, title: "", author: "", videoId: source.video || "" });
    loadYT().then((YT) => {
      if (cancelled || !frameRef.current) return;
      try {
        playerRef.current = new YT.Player(frameRef.current, {
          events: {
            onReady: (e) => { try { mutedRef.current ? e.target.mute() : e.target.unMute(); } catch (err) { /* ignore */ } },
            onStateChange: (e) => {
              if (cancelled) return;
              if (e.data === 1) {
                isPlaying = true;
                let d = {};
                try { d = e.target.getVideoData() || {}; } catch (err) { /* ignore */ }
                // a recording, not a live stream: try the next source if there is one
                if (d.isLive === false && idx + 1 < feed.sources.length) { advance(); return; }
                setState("live");
                report({ state: "live", label: source.label, idx, title: d.title || "", author: d.author || "", videoId: d.video_id || source.video || "" });
              } else if (e.data === 0) {
                advance(); // the stream ended
              }
            },
            onError: () => { if (!cancelled) advance(); },
          },
        });
      } catch (e) { /* the iframe still plays on its own */ }
    }).catch(() => { /* API blocked: the iframe still plays on its own */ });
    // a player that never starts (nothing live on a channel, say) moves on
    const stuck = setTimeout(() => {
      if (cancelled || isPlaying) return;
      let s = -1;
      try { s = playerRef.current?.getPlayerState?.(); } catch (e) { /* ignore */ }
      if (s === -1 || s === 3) advance();
    }, STUCK_MS);
    return () => { cancelled = true; clearTimeout(stuck); playerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, main, idx, attempt, state === "out"]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || !p.mute) return;
    try { muted ? p.mute() : p.unMute(); } catch (e) { /* ignore */ }
  }, [muted]);

  const live = state === "live";
  return (
    <div className={`mc-screen ${main ? "is-main" : "is-side"}`}>
      <div className="mc-screen-head">
        <span className="mc-code">{feed.code}</span>
        <span className="mc-name">{feed.name}</span>
        {playing && <span className={`mc-pill ${live ? "" : state === "out" ? "out" : "off"}`}><span className="dot" />{live ? (idx ? "LIVE · BACKUP" : "LIVE") : state === "out" ? "STANDBY" : "CONNECTING"}</span>}
      </div>
      <div className="mc-glass">
        {playing && state !== "out" && (
          <iframe
            key={`${feed.id}:${idx}:${attempt}:${main ? "m" : "s"}`}
            ref={frameRef}
            className="mc-player"
            src={embedUrl(source, { muted: true, controls: main })}
            title={`${feed.code}: ${feed.name} - live on YouTube`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={main ? 0 : -1}
          />
        )}
        {!playing && (
          <>
            <ArtCanvas art={feed.art} />
            {feed.sources[0].video && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="mc-still" src={thumbUrl(feed.sources[0].video)} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            )}
          </>
        )}
        {state === "out" && playing && (
          <div className="mc-standby">
            <ArtCanvas art="signal" fps={main ? 30 : 8} standby={main ? ["SIGNAL LOST", "REACQUIRING"] : ["SIGNAL LOST"]} />
            {main && <div className="mc-standby-act"><span>Every source for this screen is quiet. It tries again in a minute.</span></div>}
          </div>
        )}
        {!main && (
          <button type="button" className="mc-pick" onClick={onPick} aria-label={`Put ${feed.code}, ${feed.name}, on the main screen`}>
            <span>Put on main screen</span>
          </button>
        )}
        {children}
        <span className="mc-br tl" /><span className="mc-br tr" /><span className="mc-br bl" /><span className="mc-br br" />
      </div>
    </div>
  );
}

// ---------- Signal: the waveform drawn over the bottom of the main screen ----------
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
        const v = buf ? (buf[Math.floor(p * (buf.length - 1))] - 128) / 128 : Math.sin(p * 38 + t * 3.1) * 0.5 + Math.sin(p * 91 - t * 5.3) * 0.25;
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

// ---------- a console monitor ----------
function Console({ code, title, right, children, className = "" }) {
  return (
    <section className={`mc-console ${className}`}>
      <div className="mc-plate"><span className="mc-plate-code">{code}</span><span className="mc-plate-title">{title}</span>{right && <span className="mc-plate-right">{right}</span>}</div>
      <div className="mc-crt">{children}</div>
    </section>
  );
}

// ---------- ISS tracker ----------
const INC = (51.64 * Math.PI) / 180, PERIOD = 92.68 * 60, WE = (2 * Math.PI) / 86164;
function norm(lon) { return ((((lon + 180) % 360) + 360) % 360) - 180; }
// a circular-orbit model anchored to the real position, so the drawn track
// lines up with where the station actually is
function makeOrbit(fix, prevFix) {
  if (!fix) {
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
      } catch (e) { /* keep the estimate */ }
    };
    poll();
    const id = setInterval(poll, 10000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const land = landCells();
    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      const ctx = cv.getContext("2d");
      const X = (lon) => ((lon + 180) / 360) * w, Y = (lat) => ((90 - lat) / 180) * h;
      ctx.fillStyle = "#050717"; ctx.fillRect(0, 0, w, h);
      // grid
      ctx.strokeStyle = "rgba(185,192,255,.07)"; ctx.lineWidth = 1;
      for (let lo = -150; lo <= 150; lo += 30) { ctx.beginPath(); ctx.moveTo(X(lo), 0); ctx.lineTo(X(lo), h); ctx.stroke(); }
      for (let la = -60; la <= 60; la += 30) { ctx.beginPath(); ctx.moveTo(0, Y(la)); ctx.lineTo(w, Y(la)); ctx.stroke(); }
      // land as a dot grid
      const cw = w / LAND_W, ch = h / LAND_H, dot = Math.max(1, Math.min(cw, ch) * 2 * 0.55);
      ctx.fillStyle = "rgba(185,192,255,.45)";
      for (let y = 0; y < LAND_H; y += 2) for (let x = 0; x < LAND_W; x += 2) if (land[y * LAND_W + x]) ctx.fillRect(x * cw, y * ch, dot, dot);
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
          if (a > 0) { ctx.fillStyle = `rgba(2,3,10,${a * 0.6})`; ctx.fillRect(px, py, cell, cell); }
        }
      }
      ctx.strokeStyle = "rgba(185,192,255,.2)";
      ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(w, Y(0)); ctx.stroke();
      // track
      const f = fixes.current;
      const orbit = makeOrbit(f[f.length - 1], f[f.length - 2]);
      const nowS = Date.now() / 1000;
      const seg = (from, to, style, dash) => {
        ctx.strokeStyle = style; ctx.setLineDash(dash); ctx.lineWidth = Math.max(1, w / 300);
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
      halo.addColorStop(0, "rgba(232,207,192,.6)"); halo.addColorStop(1, "rgba(232,207,192,0)");
      ctx.fillStyle = halo; ctx.fillRect(x - w * 0.05, y - w * 0.05, w * 0.1, w * 0.1);
      ctx.fillStyle = "#E8CFC0"; ctx.beginPath(); ctx.arc(x, y, Math.max(2.5, w / 120), 0, Math.PI * 2); ctx.fill();
      if (!fixes.current.length) setRead((r) => (r.real ? r : { lat: la, lon: lo, alt: null, vel: null, real: false }));
    };
    draw();
    const id = setInterval(draw, 2000);
    const ro = new ResizeObserver(draw); ro.observe(cv);
    return () => { clearInterval(id); ro.disconnect(); };
  }, []);

  const fmt = (v, pos, neg) => (v == null ? "--" : `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`);
  return (
    <Console code="TRACK" title="Space station" right={<span className={read.real ? "mc-ok" : ""}>{read.real ? "● LIVE FIX" : "○ ESTIMATE"}</span>} className="mc-con-track">
      <div className="mc-track">
        <div className="mc-map"><canvas ref={cvRef} aria-label="Map of the space station's position and path" role="img" /></div>
        <div className="mc-readouts">
          <div><span className="mc-k">LAT</span><span className="mc-v">{fmt(read.lat, "N", "S")}</span></div>
          <div><span className="mc-k">LON</span><span className="mc-v">{fmt(read.lon, "E", "W")}</span></div>
          <div><span className="mc-k">ALT</span><span className="mc-v">{read.alt == null ? "≈ 420 km" : `${read.alt.toFixed(1)} km`}</span></div>
          <div><span className="mc-k">VEL</span><span className="mc-v">{read.vel == null ? "≈ 27,600 km/h" : `${Math.round(read.vel).toLocaleString("en-US")} km/h`}</span></div>
          <div className="mc-legend">Solid: next orbit · dashed: last 45 min · shaded: night</div>
        </div>
      </div>
    </Console>
  );
}

// ---------- the room ----------
export default function MissionControl({ launches = [], deep = {} }) {
  const rootRef = useRef(null);
  const wide = useMedia("(min-width: 900px)");
  const [order, setOrder] = useState(FEEDS.map((f) => f.id));
  const [status, setStatus] = useState({});
  const [sound, setSound] = useState(false);
  const [signal, setSignal] = useState(false);
  const [track, setTrack] = useState(0);
  const [analyser, setAnalyser] = useState(null);
  const [now, setNow] = useState(null);
  const [dismissed, setDismissed] = useState({});
  const audioRef = useRef(null);
  const audioGraph = useRef(null);
  const lastPick = useRef(0);
  const promoted = useRef({});

  // the room takes the whole window; the page behind it doesn't scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
  // the clocks start in the browser, so they never disagree with the server's HTML
  useEffect(() => { setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);

  const onStatus = useCallback((id, patch) => setStatus((s) => ({ ...s, [id]: { ...(s[id] || {}), ...patch } })), []);
  const toMain = useCallback((id, byPerson = true) => {
    if (byPerson) lastPick.current = Date.now();
    setOrder((o) => {
      const i = o.indexOf(id);
      if (i <= 0) return o;
      const n = [...o]; [n[0], n[i]] = [n[i], n[0]]; return n;
    });
  }, []);

  const feedOf = (id) => FEEDS.find((f) => f.id === id);
  const mainFeed = feedOf(order[0]);
  const ready = now !== null;

  // launches still to come (or just gone), and the alert inside 30 minutes
  const upcoming = ready ? launches.filter((l) => Date.parse(l.net) - now > -20 * 60 * 1000) : launches;
  const next = upcoming[0];
  const alertLaunch = ready && upcoming.find((l) => {
    const dt = Date.parse(l.net) - now;
    return dt <= ALERT_WINDOW && dt > -15 * 60 * 1000 && !dismissed[l.id] && !/fail|success/i.test(l.statusName || "");
  });
  const alertFeed = alertLaunch ? feedForLaunch(alertLaunch) : null;
  useEffect(() => {
    if (!alertLaunch || !alertFeed || promoted.current[alertLaunch.id]) return;
    promoted.current[alertLaunch.id] = true;
    if (Date.now() - lastPick.current > 2 * 60 * 1000) toMain(alertFeed.id, false);
  }, [alertLaunch, alertFeed, toMain]);

  // Signal 13i over the feeds
  const playTrack = async (i) => {
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
          audioGraph.current = { ac };
          setAnalyser(an);
        }
      }
      await audioGraph.current?.ac.resume();
    } catch (e) { /* plays without the waveform */ }
    try { await el.play(); } catch (e) { /* needs another tap */ }
  };
  const toggleSignal = () => {
    if (signal) { setSignal(false); try { audioRef.current?.pause(); } catch (e) { /* ignore */ } return; }
    setSignal(true); setSound(false); playTrack(track);
  };
  const nextTrack = () => { const n = (track + 1) % SIGNAL_TRACKS.length; setTrack(n); if (signal) playTrack(n); };

  const d = new Date(now || 0);
  const utc = ready ? `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${p2(d.getUTCSeconds())}` : "--:--:--";
  let central = "--:--:--";
  if (ready) try { central = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(d); } catch (e) { /* ignore */ }
  let doy = "---";
  if (ready) doy = String(Math.floor((now - Date.UTC(d.getUTCFullYear(), 0, 0)) / 86400000)).padStart(3, "0");
  const mainStatus = status[mainFeed.id] || {};

  return (
    <div className="mc-root" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: CSS + DEEP_CSS }} />

      {/* the clock wall */}
      <header className="mc-bar">
        <div className="mc-bar-l">
          <Link href="/galaxy/news#page-3" className="mc-back">&larr; Gazette</Link>
          <span className="mc-title">Mission Control</span>
        </div>
        <div className="mc-clocks">
          <div className="mc-clockbox"><span className="mc-k">DAY {doy} · UTC</span><span className="mc-digits">{utc}</span></div>
          <div className="mc-clockbox"><span className="mc-k">CENTRAL</span><span className="mc-digits">{central}</span></div>
          <div className="mc-clockbox"><span className="mc-k">NEXT LAUNCH</span><span className="mc-digits warm">{ready && next ? countdown(Date.parse(next.net) - now) : "--:--:--"}</span></div>
          <div className="mc-clockbox mc-hide-s"><span className="mc-k">13i LAUNCH</span><span className="mc-digits lav">{ready ? countdown(SIGNAL_LAUNCH - now) : "--"}</span></div>
        </div>
        <div className="mc-bar-r">
          <button type="button" className="mc-btn" aria-pressed={sound && !signal} onClick={() => { if (signal) toggleSignal(); setSound((s) => !s); }}>{sound && !signal ? "Sound off" : "Sound on"}</button>
          <FullscreenButton targetRef={rootRef} />
        </div>
      </header>

      {alertLaunch && (
        <div className="mc-alert" role="status">
          <span className="mc-alert-k">Launch {Date.parse(alertLaunch.net) > now ? "in" : "underway"}</span>
          <span className="mc-alert-t">{countdown(Date.parse(alertLaunch.net) - now)}</span>
          <span className="mc-alert-w">{alertLaunch.rocket}{alertLaunch.mission ? ` · ${alertLaunch.mission}` : ""} · {alertLaunch.location}</span>
          {alertFeed && order[0] !== alertFeed.id && <button type="button" className="mc-btn" onClick={() => toMain(alertFeed.id)}>Watch on {alertFeed.code}</button>}
          {alertFeed && order[0] === alertFeed.id && <span className="mc-alert-on">On the main screen</span>}
          <button type="button" className="mc-x" onClick={() => setDismissed((x) => ({ ...x, [alertLaunch.id]: true }))} aria-label="Dismiss launch alert">×</button>
        </div>
      )}

      {/* the wall of screens */}
      <div className="mc-wall">
        {order.map((id, i) => {
          const f = feedOf(id);
          const main = i === 0;
          return (
            // keyed by slot and feed, so a swap starts both screens fresh
            <div key={`${i}-${id}`} className={`mc-slot mc-slot-${i}`}>
              <FeedScreen feed={f} main={main} playing={main || wide} muted={!main || !sound || signal} onStatus={onStatus} onPick={() => toMain(id)}>
                {main && signal && <SignalWave analyser={analyser} />}
              </FeedScreen>
            </div>
          );
        })}
      </div>
      <div className="mc-under">
        <span className="mc-showing">{signal ? `Signal 13i · ${SIGNAL_TRACKS[track].title}` : mainStatus.title ? `${mainStatus.title}${mainStatus.author ? " · " + mainStatus.author : ""}` : mainFeed.blurb}</span>
        {signal && <button type="button" className="mc-btn" onClick={nextTrack}>Next track</button>}
        <a className="mc-link" href={watchUrl(mainFeed.sources[mainStatus.idx || 0], mainStatus.videoId)} target="_blank" rel="noopener noreferrer">Open on YouTube ↗</a>
      </div>

      {/* the consoles */}
      <div className="mc-consoles">
        <IssTracker />

        <Console code="LAUNCH" title="Next launches" right="UTC · every 15 min">
          {upcoming.length === 0 ? (
            <p className="mc-crt-note">NO SCHEDULE DATA. CHECKING AGAIN IN 15 MINUTES.</p>
          ) : (
            <table className="mc-table">
              <thead><tr><th>T−</th><th>Vehicle · mission</th><th>Site</th><th>Status</th></tr></thead>
              <tbody>
                {upcoming.slice(0, 5).map((l, i) => {
                  const f = feedForLaunch(l);
                  return (
                    <tr key={l.id} className={i === 0 ? "next" : ""}>
                      <td className="t">{ready ? countdown(Date.parse(l.net) - now, false) : "--"}</td>
                      <td className="w">{l.rocket}{l.mission ? <em> · {l.mission}</em> : null}<span className="mc-prov">{l.provider}</span></td>
                      <td className="s">{l.location}</td>
                      <td className="st">
                        <span className={`chip ${/go/i.test(l.status) ? "go" : ""}`} title={l.statusName}>{l.status || "—"}</span>
                        {l.live && <span className="chip live">ON AIR</span>}
                        {f && <button type="button" className="mc-mini" onClick={() => toMain(f.id)} title={`Watch on ${f.code}`}>{f.code}</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Console>

        <Console
          code="FEEDS"
          title="Feed board"
          className="mc-con-feeds"
          right={
            <button type="button" className={`mc-egg ${signal ? "on" : ""}`} onClick={toggleSignal} aria-pressed={signal} aria-label={signal ? "Stop Signal 13i" : "Play Signal 13i"} title={signal ? "Stop the signal" : "?"}>
              <svg viewBox="0 0 20 24" aria-hidden="true"><circle cx="10" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="30 8" strokeDashoffset="-4" /><circle cx="10" cy="9" r="1.8" fill="currentColor" /><line x1="10" y1="15" x2="10" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          }
        >
          <ul className="mc-feedlist">
            {order.map((id, i) => {
              const f = feedOf(id);
              const s = status[id] || {};
              const playing = i === 0 || wide;
              const st = !playing ? "idle" : s.state || "connecting";
              const word = { live: s.idx ? "BACKUP" : "LIVE", connecting: "ACQ", out: "LOST", idle: "STILL" }[st];
              return (
                <li key={id} className={i === 0 ? "main" : ""}>
                  <span className={`mc-led ${st}`} />
                  <button type="button" className="mc-feedname" onClick={() => toMain(id)}>{f.code}</button>
                  <span className="mc-src">{playing ? (s.author || s.label || f.sources[0].label) : "tap a screen to view"}{playing && s.idx ? ` (${s.idx + 1}/${f.sources.length})` : ""}</span>
                  <span className={`mc-word ${st}`}>{i === 0 ? "MAIN · " : ""}{word}</span>
                </li>
              );
            })}
          </ul>
          <p className="mc-crt-note">Each screen has backups; a dropped stream switches by itself.</p>
        </Console>
      </div>

      {/* the big console under the desks: the whole solar system (Update 6.26) */}
      <Console code="DEEP" title="Deep space · where the missions are" right="Click a mission" className="mc-con-deep">
        <DeepSpaceMap deep={deep} />
      </Console>

      <p className="mc-credit">Streams play from their owners&rsquo; YouTube channels. Launch schedule: The Space Devs. Station position: wheretheiss.at. Spacecraft positions: NASA JPL Horizons.</p>
      <audio ref={audioRef} onEnded={nextTrack} preload="none" />
    </div>
  );
}

const CSS = `
.mc-root { position: fixed; inset: 0; z-index: 900; overflow-y: auto; overflow-x: hidden; background:
  radial-gradient(ellipse at 50% 0%, rgba(20,22,58,.9), transparent 60%),
  linear-gradient(#070818, #04040c 70%);
  color: #DADDF7; font-family: var(--font-body);
  padding: env(safe-area-inset-top, 0px) max(14px, env(safe-area-inset-right, 0px)) calc(14px + env(safe-area-inset-bottom, 0px)) max(14px, env(safe-area-inset-left, 0px));
  display: flex; flex-direction: column; gap: 10px; }
.mc-root:fullscreen { padding-top: 10px; }
/* Lyra steps out of the room (she sits in a higher layer than the page) */
body:has(.mc-root) .lyra-root, body:has(.mc-root) .lyra-tether { display: none !important; }
.mc-k { display: block; font-family: var(--font-mono); font-size: 10px; letter-spacing: .16em; color: #6E76B8; }

.mc-bar { display: flex; align-items: center; justify-content: space-between; gap: 10px 18px; flex-wrap: wrap; padding: 10px 0 8px; border-bottom: 1px solid rgba(185,192,255,.14); }
.mc-bar-l { display: flex; align-items: baseline; gap: 16px; min-width: 0; }
.mc-back { font-family: var(--font-mono); font-size: 12px; color: #6E76B8; text-decoration: none; white-space: nowrap; }
.mc-back:hover { color: #B9C0FF; }
.mc-title { font-family: var(--font-display); font-style: italic; font-size: clamp(22px, 2.4vw, 30px); color: #EEF0FF; white-space: nowrap; }
.mc-clocks { display: flex; gap: 8px; flex-wrap: wrap; }
.mc-clockbox { background: #03040a; border: 1px solid rgba(185,192,255,.16); border-radius: 3px; padding: 4px 10px 5px; box-shadow: inset 0 0 12px rgba(0,0,0,.8); }
.mc-digits { display: block; font-family: var(--font-mono); font-size: clamp(15px, 1.6vw, 21px); color: #EEF0FF; font-variant-numeric: tabular-nums; text-shadow: 0 0 10px rgba(185,192,255,.35); }
.mc-digits.warm { color: #E8CFC0; text-shadow: 0 0 10px rgba(232,207,192,.4); }
.mc-digits.lav { color: #B9C0FF; }
.mc-bar-r { display: flex; gap: 8px; align-items: center; }

.mc-btn { font-family: var(--font-mono); font-size: 11px; color: #B9C0FF; background: rgba(20,22,58,.6); border: 1px solid rgba(185,192,255,.4); border-radius: 4px; padding: 5px 10px; cursor: pointer; white-space: nowrap; }
.mc-btn:hover { border-color: #B9C0FF; color: #fff; }
.mc-btn[aria-pressed="true"] { background: rgba(185,192,255,.16); color: #fff; }
.mc-btn:focus-visible, .mc-mini:focus-visible, .mc-link:focus-visible, .mc-x:focus-visible, .mc-pick:focus-visible, .mc-feedname:focus-visible, .mc-egg:focus-visible, .mc-back:focus-visible { outline: 2px solid #E8CFC0; outline-offset: 2px; }

.mc-alert { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; padding: 8px 12px; border: 1px solid rgba(201,123,110,.75); background: rgba(201,123,110,.15); border-radius: 3px; font-family: var(--font-mono); font-size: 12px; color: #F2DAD4; }
.mc-alert-k { letter-spacing: .16em; text-transform: uppercase; color: #C97B6E; }
.mc-alert-t { font-size: 17px; color: #fff; font-variant-numeric: tabular-nums; }
.mc-alert-w { flex: 1 1 220px; min-width: 0; }
.mc-alert-on { color: #E8CFC0; }
.mc-x { background: none; border: 0; color: #F2DAD4; font-size: 20px; line-height: 1; cursor: pointer; padding: 0 4px; }

/* the wall: two side screens either side of the big one (32:9 overall, so every screen is 16:9) */
.mc-wall { display: grid; grid-template-columns: 1fr 2fr 1fr; grid-template-rows: auto auto; gap: 10px; width: min(100%, calc((100dvh - 400px) * 32 / 9)); min-width: min(100%, 760px); margin: 0 auto; }
.mc-slot { min-width: 0; }
.mc-slot-0 { grid-column: 2; grid-row: 1 / span 2; }
.mc-slot-1 { grid-column: 1; grid-row: 1; } .mc-slot-2 { grid-column: 1; grid-row: 2; }
.mc-slot-3 { grid-column: 3; grid-row: 1; } .mc-slot-4 { grid-column: 3; grid-row: 2; }
.mc-screen { display: flex; flex-direction: column; gap: 4px; height: 100%; }
.mc-screen-head { display: flex; align-items: center; gap: 8px; min-width: 0; font-family: var(--font-mono); font-size: 10.5px; }
.mc-code { letter-spacing: .14em; color: #EEF0FF; white-space: nowrap; }
.mc-name { color: #6E76B8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.is-main .mc-screen-head { font-size: 12px; }
.mc-pill { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; font-size: 9.5px; letter-spacing: .14em; padding: 1px 7px; border-radius: 999px; border: 1px solid rgba(232,207,192,.45); color: #E8CFC0; white-space: nowrap; }
.mc-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: #E8CFC0; box-shadow: 0 0 7px #E8CFC0; animation: mc-pulse 1.6s ease-in-out infinite; }
.mc-pill.off { border-color: rgba(185,192,255,.3); color: #6E76B8; }
.mc-pill.off .dot { background: #565B8F; box-shadow: none; animation: none; }
.mc-pill.out { border-color: rgba(201,123,110,.6); color: #C97B6E; }
.mc-pill.out .dot { background: #C97B6E; box-shadow: none; animation: none; }
@keyframes mc-pulse { 50% { opacity: .35; } }
.mc-glass { position: relative; aspect-ratio: 16 / 9; width: 100%; max-width: 100%; background: #020309; border: 1px solid rgba(185,192,255,.28); border-radius: 3px; overflow: hidden; box-shadow: 0 0 0 4px #090a1a, 0 0 0 5px rgba(185,192,255,.08), 0 10px 30px rgba(0,0,0,.6); }
.is-main .mc-glass { border-color: rgba(185,192,255,.5); box-shadow: 0 0 0 5px #090a1a, 0 0 0 6px rgba(185,192,255,.14), 0 0 40px rgba(139,149,246,.12), 0 14px 40px rgba(0,0,0,.7); }
.mc-player { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; display: block; }
.is-side .mc-player { pointer-events: none; }
.mc-cv, .mc-still { position: absolute; inset: 0; width: 100%; height: 100%; display: block; object-fit: cover; }
.mc-pick { position: absolute; inset: 0; z-index: 4; background: transparent; border: 0; cursor: pointer; display: flex; align-items: flex-end; justify-content: center; padding: 0 0 8px; }
.mc-pick span { font-family: var(--font-mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #EEF0FF; background: rgba(10,11,28,.8); border: 1px solid rgba(185,192,255,.45); padding: 3px 8px; border-radius: 3px; opacity: 0; transform: translateY(4px); transition: opacity .15s, transform .15s; }
.mc-pick:hover span, .mc-pick:focus-visible span { opacity: 1; transform: none; }
.mc-pick:hover ~ .mc-br, .mc-pick:focus-visible ~ .mc-br { opacity: 1; }
@media (hover: none) { .mc-pick span { opacity: .85; transform: none; } }
.mc-br { position: absolute; width: 12px; height: 12px; border-color: #B9C0FF; opacity: .55; pointer-events: none; z-index: 5; transition: opacity .15s; }
.is-main .mc-br { width: 18px; height: 18px; opacity: .8; }
.mc-br.tl { top: 0; left: 0; border-top: 2px solid; border-left: 2px solid; }
.mc-br.tr { top: 0; right: 0; border-top: 2px solid; border-right: 2px solid; }
.mc-br.bl { bottom: 0; left: 0; border-bottom: 2px solid; border-left: 2px solid; }
.mc-br.br { bottom: 0; right: 0; border-bottom: 2px solid; border-right: 2px solid; }
.mc-standby { position: absolute; inset: 0; z-index: 3; }
.mc-standby-act { position: absolute; left: 0; right: 0; bottom: 8%; text-align: center; font-size: 13px; color: #8A90C8; padding: 0 16px; }
.mc-wave { position: absolute; left: 0; right: 0; bottom: 0; height: 22%; width: 100%; z-index: 2; pointer-events: none; background: linear-gradient(to bottom, rgba(10,11,28,0), rgba(10,11,28,.55)); }
.mc-under { display: flex; align-items: center; gap: 12px; width: min(100%, calc((100dvh - 400px) * 32 / 9)); min-width: min(100%, 760px); margin: 0 auto; font-family: var(--font-mono); font-size: 11.5px; color: #8A90C8; }
.mc-showing { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mc-link { color: #B9C0FF; text-decoration: none; border-bottom: 1px solid rgba(185,192,255,.4); white-space: nowrap; }
.mc-link:hover { color: #fff; }

/* the consoles: computer monitors on the desks */
.mc-consoles { display: grid; grid-template-columns: 1.25fr 1.25fr .9fr; gap: 14px; margin-top: 6px; }
.mc-console { display: flex; flex-direction: column; min-width: 0; background: linear-gradient(#15172e, #0c0d1f); border: 1px solid #262a52; border-radius: 8px; padding: 6px 8px 10px; box-shadow: inset 0 1px 0 rgba(255,255,255,.05), 0 12px 30px rgba(0,0,0,.6); }
.mc-plate { display: flex; align-items: center; gap: 10px; padding: 2px 4px 6px; font-family: var(--font-mono); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: #6E76B8; }
.mc-plate-code { color: #0A0B1C; background: #8B95F6; padding: 1px 6px; border-radius: 2px; letter-spacing: .12em; font-weight: 500; }
.mc-plate-title { color: #B9C0FF; }
.mc-plate-right { margin-left: auto; display: flex; align-items: center; gap: 6px; }
.mc-ok { color: #E8CFC0; }
.mc-crt { position: relative; flex: 1; min-height: 0; background: radial-gradient(ellipse at 50% 40%, #0b0e2a, #04050f 80%); border: 1px solid #05060f; border-radius: 10px / 14px; padding: 12px; overflow: hidden;
  box-shadow: inset 0 0 0 2px #1b1e3d, inset 0 0 40px rgba(0,0,0,.85), 0 0 0 3px #090a18; font-family: var(--font-mono); color: #C9CDF2; }
.mc-crt::after { content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background: repeating-linear-gradient(to bottom, rgba(185,192,255,.04) 0 1px, transparent 1px 3px), radial-gradient(ellipse at 30% 0%, rgba(255,255,255,.06), transparent 50%); }
.mc-crt-note { margin: 10px 0 0; font-size: 10.5px; letter-spacing: .06em; color: #565B8F; }
.mc-track { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(130px, 1fr); gap: 12px; align-items: start; }
.mc-map { position: relative; aspect-ratio: 2 / 1; max-width: 100%; border: 1px solid rgba(185,192,255,.15); }
.mc-map canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.mc-readouts { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.mc-readouts .mc-k { font-size: 9.5px; }
.mc-v { display: block; font-size: 13px; color: #EEF0FF; font-variant-numeric: tabular-nums; text-shadow: 0 0 8px rgba(185,192,255,.3); white-space: nowrap; }
.mc-legend { grid-column: 1 / -1; font-size: 10px; color: #565B8F; letter-spacing: .04em; }
.mc-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.mc-table th { white-space: nowrap; text-align: left; font-weight: 400; font-size: 9.5px; letter-spacing: .16em; color: #565B8F; padding: 0 8px 6px 0; border-bottom: 1px solid rgba(185,192,255,.15); text-transform: uppercase; }
.mc-table td { padding: 5px 8px 5px 0; border-bottom: 1px solid rgba(185,192,255,.08); vertical-align: top; }
.mc-table .t { color: #B9C0FF; font-variant-numeric: tabular-nums; white-space: nowrap; }
.mc-table tr.next .t { color: #E8CFC0; text-shadow: 0 0 8px rgba(232,207,192,.45); }
.mc-table .w { color: #EEF0FF; max-width: 0; width: 46%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mc-table .s { max-width: 0; width: 26%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mc-table .w em { font-style: normal; color: #B9C0FF; }
.mc-prov { display: block; overflow: hidden; text-overflow: ellipsis; font-size: 10.5px; color: #6E76B8; }
.mc-table .s { color: #8A90C8; font-size: 11px; }
.mc-table .st { white-space: nowrap; text-align: right; padding-right: 0; }
.chip { display: inline-block; font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase; padding: 1px 5px; border-radius: 2px; border: 1px solid rgba(185,192,255,.3); color: #8A90C8; margin-left: 4px; }
.chip.go { border-color: rgba(232,207,192,.5); color: #E8CFC0; }
.chip.live { border-color: rgba(201,123,110,.75); color: #F2DAD4; }
.mc-mini { display: inline-block; margin-left: 4px; font-family: var(--font-mono); font-size: 9.5px; letter-spacing: .06em; color: #B9C0FF; background: none; border: 1px solid rgba(185,192,255,.4); border-radius: 2px; padding: 1px 5px; cursor: pointer; }
.mc-mini:hover { color: #fff; border-color: #B9C0FF; }
.mc-feedlist { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.mc-feedlist li { display: grid; grid-template-columns: 10px auto minmax(0, 1fr) auto; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid rgba(185,192,255,.08); font-size: 11.5px; }
.mc-feedlist li.main .mc-feedname { color: #E8CFC0; }
.mc-led { width: 8px; height: 8px; border-radius: 50%; background: #565B8F; }
.mc-led.live { background: #E8CFC0; box-shadow: 0 0 8px #E8CFC0; }
.mc-led.connecting { background: #8B95F6; animation: mc-pulse 1s ease-in-out infinite; }
.mc-led.out { background: #C97B6E; box-shadow: 0 0 6px #C97B6E; }
.mc-feedname { background: none; border: 0; padding: 0; font: inherit; letter-spacing: .1em; color: #EEF0FF; cursor: pointer; text-align: left; }
.mc-feedname:hover { color: #fff; text-decoration: underline; }
.mc-src { color: #6E76B8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
.mc-word { font-size: 9.5px; letter-spacing: .14em; color: #6E76B8; white-space: nowrap; }
.mc-word.live { color: #E8CFC0; }
.mc-word.out { color: #C97B6E; }
.mc-egg { width: 22px; height: 22px; padding: 2px; display: inline-flex; align-items: center; justify-content: center; background: none; border: 1px solid transparent; border-radius: 50%; color: #3A3E75; cursor: pointer; transition: color .3s, border-color .3s; }
.mc-egg svg { width: 14px; height: 16px; }
.mc-egg:hover { color: #8B95F6; }
.mc-egg.on { color: #E8CFC0; border-color: rgba(232,207,192,.4); box-shadow: 0 0 10px rgba(232,207,192,.3); }
.mc-con-deep { margin-top: 4px; }
.mc-credit { margin: 2px 0 0; font-size: 11px; color: #3A3E75; text-align: center; }

@media (max-width: 1200px) { .mc-consoles { grid-template-columns: 1fr 1fr; } .mc-con-feeds { grid-column: 1 / -1; } }
@media (max-width: 899px) {
  .mc-track { grid-template-columns: minmax(0, 1fr); }
  .mc-readouts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .mc-table .w { width: auto; max-width: none; white-space: normal; }
  .mc-wall { grid-template-columns: 1fr 1fr; width: 100%; min-width: 0; }
  .mc-slot-0 { grid-column: 1 / -1; grid-row: 1; }
  .mc-slot-1 { grid-column: 1; grid-row: 2; } .mc-slot-2 { grid-column: 2; grid-row: 2; }
  .mc-slot-3 { grid-column: 1; grid-row: 3; } .mc-slot-4 { grid-column: 2; grid-row: 3; }
  .mc-under { width: 100%; min-width: 0; }
  .mc-consoles { grid-template-columns: minmax(0, 1fr); }
  .mc-con-feeds { grid-column: auto; }
  .mc-hide-s { display: none; }
  .mc-table .s { display: none; }
  .mc-title { font-size: 22px; }
}
@media (max-width: 520px) { .mc-clocks { width: 100%; } .mc-clockbox { flex: 1 1 30%; } .mc-digits { font-size: 14px; } }
@media (prefers-reduced-motion: reduce) { .mc-pill .dot, .mc-led.connecting { animation: none; } .mc-pick span, .mc-br { transition: none; } }
`;
