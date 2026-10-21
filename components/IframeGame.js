"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import FullscreenButton from "./FullscreenButton";
import Leaderboard from "./Leaderboard";
import { playerTwoAt, playerTwoEnd } from "../lib/lyraAssist";
import { albums, parseTrack, songSrc } from "../lib/musicReleases";
import { recordGamePlay, recordHighScore, recordDailyScore, getPersonalBest, celebrateNewBest } from "../lib/trackActivity";

const MAX_SCORE = 1000000; // sanity cap - far above anything a real run reaches

// Hosts a standalone game page (public/games/...) in an iframe and turns
// the messages it posts - {source: game, type: "play"} when a run starts,
// {source: game, type: "score", score} when one ends - into the same
// play / high-score / daily-score records the other games keep.
// Update 6.03: with songs on, the page plays 13i's own songs in random order
// while you play, and tells the game to quiet its own music (message
// {source:"13i", type:"music", on}). The choice is remembered.
const SONGS_KEY = "13i.gameSongs";
function shuffledSongs() {
  const list = albums.flatMap((a) => a.tracks.map((t) => { const { file, label } = parseTrack(t); return { src: songSrc(file), label }; }));
  for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  return list;
}

export default function IframeGame({ game, src, title, note = "click the game to give it the keyboard", songs = false }) {
  const [songsOn, setSongsOn] = useState(false);
  const [nowPlaying, setNowPlaying] = useState("");
  const audioRef = useRef(null);
  const queueRef = useRef([]);
  const [best, setBest] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const frameRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    getPersonalBest(game).then(setBest);
  }, [game]);

  const tellGame = useCallback((on) => {
    try { frameRef.current?.contentWindow?.postMessage({ source: "13i", type: "music", on }, window.location.origin); } catch (e) {}
  }, []);
  const playNext = useCallback(() => {
    const a = audioRef.current || (audioRef.current = new Audio());
    if (!queueRef.current.length) queueRef.current = shuffledSongs();
    const s = queueRef.current.shift();
    a.src = s.src; a.volume = 0.75;
    a.onended = () => playNext();
    a.play().then(() => setNowPlaying(s.label)).catch(() => setNowPlaying(""));
  }, []);
  const setSongs = useCallback((on) => {
    setSongsOn(on);
    try { localStorage.setItem(SONGS_KEY, on ? "1" : "0"); } catch (e) {}
    tellGame(on);
    if (on) playNext(); else { audioRef.current?.pause(); setNowPlaying(""); }
  }, [playNext, tellGame]);
  // remembered choice: the game is told at once; the songs start on the first tap (browsers need one)
  useEffect(() => {
    if (!songs) return;
    let saved = false;
    try { saved = localStorage.getItem(SONGS_KEY) === "1"; } catch (e) {}
    if (!saved) return;
    setSongsOn(true);
    const start = () => { if (!audioRef.current || audioRef.current.paused) playNext(); window.removeEventListener("pointerdown", start, true); };
    window.addEventListener("pointerdown", start, true);
    return () => window.removeEventListener("pointerdown", start, true);
  }, [songs, playNext]);
  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const onMessage = useCallback((e) => {
    // only our own page's iframe, only messages from this game
    if (e.origin !== window.location.origin) return;
    if (!frameRef.current || e.source !== frameRef.current.contentWindow) return;
    const msg = e.data || {};
    if (msg.source !== game) return;
    if (msg.type === "lyra") {
      // the game's Lyra, in the iframe's coordinates -> this page's
      const r = frameRef.current.getBoundingClientRect();
      const x = Number(msg.x), y = Number(msg.y);
      if (Number.isFinite(x) && Number.isFinite(y)) playerTwoAt(r.left + x, r.top + y, !!msg.firing);
      return;
    }
    if (msg.type === "fullscreen") {
      // the game's own full-screen button: inside an iframe it can't go full screen itself (and iPhone Safari
      // can't at all), so the page does it - real full screen where allowed, otherwise filling the window
      wrapRef.current?.querySelector(".fs-btn")?.click();
      return;
    }
    if (msg.type === "play") recordGamePlay(game);
    if (msg.type === "score") {
      const score = Math.round(Number(msg.score));
      if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) return;
      recordHighScore(game, score).then((isNewBest) => {
        if (isNewBest) celebrateNewBest(game, score);
        getPersonalBest(game).then(setBest);
      });
      recordDailyScore(game, score).then(() => setRefreshKey((k) => k + 1));
    }
  }, [game]);

  // on phones and tablets Lyra steps aside on game pages: she covers the touch controls
  useEffect(() => {
    document.body.classList.add("iframe-game");
    return () => document.body.classList.remove("iframe-game", "game-full");
  }, []);

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => { window.removeEventListener("message", onMessage); playerTwoEnd(); };
  }, [onMessage]);

  return (
    <div>
      <div ref={wrapRef} className="panel game-frame" style={{ padding: 0, overflow: "hidden", background: "#030303" }}>
        <iframe
          ref={frameRef}
          src={src}
          title={title}
          allow="fullscreen"
          style={{ width: "100%", height: "78vh", minHeight: 480, border: "none", display: "block" }}
          onLoad={() => { frameRef.current?.focus(); if (songsOn) tellGame(true); }}
        />
      </div>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 10, fontSize: 11, color: "#6E76B8", flexWrap: "wrap" }}>
        <span>{note}</span>
        {songs && (
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setSongs(!songsOn)} className="mono" aria-pressed={songsOn}
              style={{ background: songsOn ? "rgba(139,149,246,.18)" : "none", border: "1px solid #3A3E75", borderRadius: 4, color: "#B9C0FF", fontSize: 11, padding: "5px 10px", cursor: "pointer" }}>
              {songsOn ? "♫ 13i songs: on" : "♫ play 13i songs instead"}
            </button>
            {songsOn && nowPlaying && <><span style={{ color: "#8B95F6" }}>{nowPlaying}</span><button onClick={playNext} className="mono" style={{ background: "none", border: 0, color: "#6E76B8", fontSize: 11, cursor: "pointer" }}>next ›</button></>}
          </span>
        )}
        <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {best !== null && <span style={{ color: "#565B8F" }}>BEST {best.toLocaleString()}</span>}
          <FullscreenButton targetRef={wrapRef} />
        </span>
      </div>
      <Leaderboard game={game} refreshKey={refreshKey} />
    </div>
  );
}
