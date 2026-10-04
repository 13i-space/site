"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { listenToElement, primeAudio, onMusic } from "../../../lib/lyraMusic";
import { BASE, albums, parseTrack, releaseDateFor } from "../../../lib/musicReleases";

// The Music (Update 5.55): one deck instead of 36 separate players.
//   - Play an album, Play all three albums (36 signals in order), or Shuffle
//     everything; Repeat one; Today's signal; pick up where you left off
//   - a spinning record with the album's cover, a live ring that moves with
//     the song (the same Web Audio analyser Lyra dances to), a seek bar
//   - lock-screen / headphone controls on phones (Media Session)
//   - a link to Apprehension, the first music video
// Songs still come through 13i.space's own address (/api/track) so they can
// be measured; if that fails a song falls back to its original address and
// plays without the ring or Lyra hearing it.

const ALL = albums.flatMap((a, ai) => a.tracks.map((entry, ti) => ({ ai, ti, ...parseTrack(entry), g: ai * 12 + ti })));
const LAST_KEY = "13i_music_last";

function shuffled(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
const fmt = (s) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");
// the same "today's signal" for everyone, all day
const todays = () => {
  const d = new Date();
  const n = d.getUTCFullYear() * 400 + d.getUTCMonth() * 31 + d.getUTCDate();
  return ALL[(n * 7919) % ALL.length];
};

// the ring of light around the record, moving with the music
function Ring({ playing, color }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let analyser = null, raf = 0, bins = null;
    const off = onMusic((a) => { analyser = a; bins = a ? new Uint8Array(a.frequencyBinCount) : null; });
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (now) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = c.clientWidth;
      if (c.width !== Math.round(W * dpr)) { c.width = c.height = Math.round(W * dpr); }
      const S = c.width;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, S, S);
      ctx.translate(S / 2, S / 2);
      const t = now / 1000;
      const N = 96;
      if (analyser && bins) analyser.getByteFrequencyData(bins);
      const R0 = S * 0.36;
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2;
        let v;
        if (analyser && bins && playing) {
          const k = Math.floor(Math.pow(((i < N / 2 ? i : N - i) / (N / 2)), 1.6) * bins.length * 0.7);
          v = bins[k] / 255;
        } else {
          v = playing && !reduced ? 0.15 + 0.1 * Math.sin(t * 3 + i * 0.4) : 0.04 + 0.03 * Math.sin(t * 0.8 + i * 0.3);
        }
        const L = S * (0.012 + v * 0.11);
        ctx.strokeStyle = i % 2 ? color : "#E9D29A";
        ctx.globalAlpha = 0.35 + v * 0.65;
        ctx.lineWidth = Math.max(1.5, S * 0.008);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * R0, Math.sin(a) * R0);
        ctx.lineTo(Math.cos(a) * (R0 + L), Math.sin(a) * (R0 + L));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); off(); };
  }, [playing, color]);
  return <canvas ref={ref} className="mx-ring" aria-hidden="true" />;
}

export default function MusicPage() {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]); // list of ALL entries
  const [pos, setPos] = useState(-1);
  const [mode, setMode] = useState(null); // { kind: "album", ai } | { kind: "all" } | { kind: "shuffle" } | { kind: "one" }
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState({ now: 0, dur: 0 });
  const [repeatOne, setRepeatOne] = useState(false);
  const [resume, setResume] = useState(null);
  const [open, setOpen] = useState({ 0: true });
  const [about, setAbout] = useState(false);
  const current = pos >= 0 ? queue[pos] : null;
  const today = useRef(null);
  if (!today.current) today.current = todays();

  // Lyra hears it (same plumbing as before, one element now)
  const release = useRef(null);
  const fellBack = useRef(false);
  const hear = (el) => {
    if (fellBack.current) return;
    if (release.current) release.current();
    release.current = listenToElement(el, (r) => { release.current = r; });
  };
  const unhear = () => { if (release.current) release.current(); release.current = null; };

  useEffect(() => {
    try {
      const last = JSON.parse(localStorage.getItem(LAST_KEY) || "null");
      const t = last && ALL.find((x) => x.ai === last.ai && x.ti === last.ti);
      if (t) setResume({ track: t, at: last.at || 0 });
    } catch (e) { /* no storage */ }
  }, []);

  const load = useCallback((track, { at = 0, autoplay = true } = {}) => {
    const el = audioRef.current;
    if (!el || !track) return;
    fellBack.current = false;
    el.src = `/api/track/${encodeURIComponent(track.file)}.mp3?v=2`;
    el.load();
    if (at) { const seek = () => { el.currentTime = at; el.removeEventListener("loadedmetadata", seek); }; el.addEventListener("loadedmetadata", seek); }
    if (autoplay) { primeAudio(); el.play().catch(() => {}); }
  }, []);

  const start = (list, kind, startAt = 0, at = 0) => {
    setQueue(list);
    setPos(startAt);
    setMode(kind);
    load(list[startAt], { at });
  };
  const playAlbum = (ai, ti = 0) => start(ALL.filter((x) => x.ai === ai), { kind: "album", ai }, ti);
  const playAllThree = () => start(ALL, { kind: "all" });
  const shuffleAll = () => start(shuffled(ALL), { kind: "shuffle" });
  const playOne = (track) => {
    // inside whatever is already queued, or as the start of its album
    const i = queue.findIndex((x) => x.g === track.g);
    if (i >= 0) { setPos(i); load(queue[i]); return; }
    playAlbum(track.ai, track.ti);
  };
  const next = useCallback((dir = 1) => {
    if (!queue.length) return;
    const n = pos + dir;
    if (n < 0) { const el = audioRef.current; if (el) el.currentTime = 0; return; }
    if (n >= queue.length) { setPlaying(false); return; }
    setPos(n);
    load(queue[n]);
  }, [queue, pos, load]);
  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (!current) { playAllThree(); return; }
    if (el.paused) { primeAudio(); el.play().catch(() => {}); } else el.pause();
  };

  // remember where we were
  useEffect(() => {
    if (!current) return;
    try { localStorage.setItem(LAST_KEY, JSON.stringify({ ai: current.ai, ti: current.ti, at: Math.floor(time.now) })); } catch (e) { /* ignore */ }
  }, [current, Math.floor(time.now / 5)]); // eslint-disable-line react-hooks/exhaustive-deps

  // headphones / lock screen
  useEffect(() => {
    if (!current || typeof navigator === "undefined" || !navigator.mediaSession) return;
    const album = albums[current.ai];
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({ title: current.label, artist: "13i", album: album.title, artwork: [{ src: album.cover, sizes: "1024x1024", type: "image/png" }] });
      navigator.mediaSession.setActionHandler("play", () => audioRef.current?.play());
      navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
      navigator.mediaSession.setActionHandler("nexttrack", () => next(1));
      navigator.mediaSession.setActionHandler("previoustrack", () => next(-1));
    } catch (e) { /* not supported */ }
  }, [current, next]);

  // space to play/pause (unless typing)
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space" || /input|textarea|select|button/i.test(e.target.tagName)) return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const album = current ? albums[current.ai] : albums[0];
  const modeLabel = !mode ? "" : mode.kind === "album" ? `album · ${albums[mode.ai].title}` : mode.kind === "all" ? "all three albums" : mode.kind === "shuffle" ? "shuffle everything" : "";
  const upNext = queue.slice(pos + 1, pos + 4);

  return (
    <div className="mx">
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPlaying={(e) => hear(e.currentTarget)}
        onPause={() => { setPlaying(false); unhear(); }}
        onEnded={() => { unhear(); if (repeatOne) { const el = audioRef.current; el.currentTime = 0; el.play().catch(() => {}); } else next(1); }}
        onTimeUpdate={(e) => setTime({ now: e.currentTarget.currentTime, dur: e.currentTarget.duration })}
        onLoadedMetadata={(e) => setTime({ now: e.currentTarget.currentTime, dur: e.currentTarget.duration })}
        onError={(e) => {
          if (fellBack.current || !current) return;
          fellBack.current = true;
          const el = e.currentTarget;
          el.src = BASE + current.file + ".mp3";
          el.load();
          el.play().catch(() => {});
        }}
      />

      <section className="mx-hero">
        <div>
          <div className="mono mx-kicker">36 signals &middot; 3 albums &middot; one a month from April 2027</div>
          <h1 className="mx-title">The Music</h1>
          <p className="mx-lede">
            Instrumental electronic music from the edge of the 13i universe: cinematic synth-wave, progressive EDM and ambient
            texture, 100% human made. Put your headphones on.
          </p>
          <button className="mono mx-about-btn" onClick={() => setAbout((a) => !a)} aria-expanded={about}>
            {about ? "less about the music ↑" : "more about the music ↓"}
          </button>
        </div>
      </section>

      {about && (
        <div className="panel mx-about">
          <p style={{ marginBottom: 14 }}>
            13i is an instrumental electronic music project exploring the
            intersection of science fiction, artificial intelligence,
            consciousness, and emotion. Every composition is 100% human
            written, performed, arranged, and produced. AI is part of the
            narrative in the accompanying 13i sci-fi novel — however AI it is
            not used in the writing/production (novel or music) process.
          </p>
          <p style={{ marginBottom: 14 }}>
            The three (trilogy) pre-release rough draft albums below blend
            cinematic electronic music with melodic synth-wave, progressive
            EDM, ambient textures, and driving rhythms. The result is
            instrumental music designed for late-night drives, headphones,
            science fiction, focus, exploration, and imagination.
          </p>
          <p style={{ margin: 0, fontStyle: "italic", color: "#B7BADF" }}>
            More than sound ~ this is a signal.
            <br />
            More than music ~ this is a message.
          </p>
        </div>
      )}

      {/* the deck */}
      <section className={`mx-deck ${playing ? "mx-on" : ""}`}>
        <div className="mx-record-wrap">
          <Ring playing={playing} color="#8B95F6" />
          <div className="mx-record" style={{ animationPlayState: playing ? "running" : "paused" }}>
            <img src={album.cover} alt="" className="mx-label" onError={(e) => { e.currentTarget.style.opacity = 0; }} />
            <span className="mx-spindle" />
          </div>
        </div>
        <div className="mx-now">
          <div className="mono mx-now-kicker">{current ? (playing ? "NOW PLAYING" : "PAUSED") : "READY"}{modeLabel && <> &middot; {modeLabel.toUpperCase()}</>}</div>
          <div className="wordmark mx-now-title">{current ? current.label : "Choose a way to listen"}</div>
          <div className="mx-now-album">{current ? `${album.title} · track ${current.ti + 1} · ${releaseDateFor(current.g)}` : "Thirty-six signals, three albums. Start anywhere."}</div>
          <div className="mx-seek">
            <span className="mono">{fmt(time.now)}</span>
            <input
              type="range" min={0} max={time.dur || 1} step={0.5} value={Math.min(time.now, time.dur || 1)} aria-label="Seek"
              onChange={(e) => { const el = audioRef.current; if (el && current) el.currentTime = Number(e.target.value); }}
              style={{ "--p": `${time.dur ? (time.now / time.dur) * 100 : 0}%` }}
            />
            <span className="mono">{fmt(time.dur)}</span>
          </div>
          <div className="mx-controls">
            <button onClick={() => next(-1)} aria-label="Previous" disabled={!current}>⏮</button>
            <button onClick={toggle} className="mx-play" aria-label={playing ? "Pause" : "Play"}>{playing ? "❚❚" : "▶"}</button>
            <button onClick={() => next(1)} aria-label="Next" disabled={!current}>⏭</button>
            <button onClick={() => setRepeatOne((r) => !r)} aria-pressed={repeatOne} className={`mono mx-small ${repeatOne ? "mx-active" : ""}`} title="Repeat this song">repeat one</button>
          </div>
          {upNext.length > 0 && (
            <div className="mx-upnext mono">
              up next: {upNext.map((x) => x.label).join(" · ")}
            </div>
          )}
        </div>
      </section>

      {/* ways to listen */}
      <section className="mx-ways">
        <button className={`mx-way ${mode?.kind === "all" ? "mx-way-on" : ""}`} onClick={playAllThree}>
          <span className="mx-way-icon">▶▶▶</span>
          <span className="mx-way-title">Play all three albums</span>
          <span className="mx-way-sub mono">36 signals, in order</span>
        </button>
        <button className={`mx-way ${mode?.kind === "shuffle" ? "mx-way-on" : ""}`} onClick={shuffleAll}>
          <span className="mx-way-icon">⤨</span>
          <span className="mx-way-title">Shuffle everything</span>
          <span className="mx-way-sub mono">all 36, any order</span>
        </button>
        <button className="mx-way" onClick={() => start([today.current], { kind: "one" })}>
          <span className="mx-way-icon">☀</span>
          <span className="mx-way-title">Today&rsquo;s signal</span>
          <span className="mx-way-sub mono">{today.current.label}</span>
        </button>
        {resume ? (
          <button className="mx-way" onClick={() => { const list = ALL.filter((x) => x.ai === resume.track.ai); start(list, { kind: "album", ai: resume.track.ai }, resume.track.ti, resume.at); setResume(null); }}>
            <span className="mx-way-icon">↺</span>
            <span className="mx-way-title">Pick up where you left off</span>
            <span className="mx-way-sub mono">{resume.track.label} &middot; {fmt(resume.at)}</span>
          </button>
        ) : (
          <Link href="/music/apprehension" className="mx-way mx-way-video">
            <span className="mx-way-icon">◉</span>
            <span className="mx-way-title">Watch: Apprehension</span>
            <span className="mx-way-sub mono">the first music video</span>
          </Link>
        )}
      </section>
      {resume && (
        <Link href="/music/apprehension" className="mx-video-band">
          <span className="mono">NEW</span> Apprehension &mdash; the first 13i music video. Watch it full screen, with the sound up. &rarr;
        </Link>
      )}

      {/* the albums */}
      <section className="mx-albums">
        {albums.map((a, ai) => (
          <div key={a.title} className={`mx-album ${current?.ai === ai ? "mx-album-on" : ""}`}>
            <div className="mx-album-head">
              <button className="mx-cover-btn" onClick={() => playAlbum(ai)} aria-label={`Play ${a.title}`}>
                <img src={a.cover} alt="" onError={(e) => { e.currentTarget.style.opacity = 0; }} />
                <span className="mx-cover-play">▶</span>
              </button>
              <div>
                <div className="wordmark mx-album-title">{a.title}</div>
                <div className="mono mx-album-year">{a.year}</div>
                <div className="mx-album-actions">
                  <button className="mono" onClick={() => playAlbum(ai)}>▶ play album</button>
                  <button className="mono" onClick={() => setOpen((o) => ({ ...o, [ai]: !o[ai] }))} aria-expanded={!!open[ai]}>{open[ai] ? "hide tracks" : "show tracks"}</button>
                </div>
              </div>
            </div>
            {open[ai] && (
              <ol className="mx-tracks">
                {ALL.filter((x) => x.ai === ai).map((tr) => {
                  const on = current?.g === tr.g;
                  return (
                    <li key={tr.file}>
                      <button className={`mx-track ${on ? "mx-track-on" : ""}`} onClick={() => (on ? toggle() : playOne(tr))}>
                        <span className="mono mx-track-n">{on && playing ? <span className="mx-eq"><i /><i /><i /></span> : tr.ti + 1}</span>
                        <span className="mx-track-name">{tr.label}</span>
                        <span className="mono mx-track-date">{releaseDateFor(tr.g)}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        ))}
      </section>

      <div className="panel" style={{ marginTop: 28 }}>
        <div className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "1px", marginBottom: 10 }}>
          COPYRIGHT NOTICE
        </div>
        <p style={{ fontSize: 12.5, color: "#8A8FBF", lineHeight: 1.7, margin: 0 }}>
          All songs on this page are the exclusive property of{" "}
          <a href="https://www.tempogoatstudios.com" target="_blank" rel="noopener noreferrer">
            Tempo Goat Studios
          </a>
          . These tracks are unfinished, unreleased and confidential. They
          may not be copied, distributed, or shared in any form without
          written consent from Tempo Goat Studios. Unauthorized use is
          strictly prohibited.
        </p>
      </div>
    </div>
  );
}
