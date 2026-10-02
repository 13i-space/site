"use client";

import { useRef, useState } from "react";
import { listenToElement, primeAudio } from "../../../lib/lyraMusic";
import { BASE, albums, parseTrack, releaseDateFor } from "../../../lib/musicReleases";

export default function MusicPage() {
  const audioRefs = useRef({});
  const [playingAlbum, setPlayingAlbum] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);

  // Lyra dances to whatever is playing (lib/lyraMusic.js). Songs are served
  // from 13i.space's own address (/api/track) so the browser can measure
  // them; if that ever fails, a track falls back to its original address and
  // simply plays without Lyra hearing it.
  const releases = useRef({});
  const fellBack = useRef({});
  const hear = (key, el) => {
    if (fellBack.current[key]) return;
    if (releases.current[key]) releases.current[key]();
    releases.current[key] = listenToElement(el, (r) => { releases.current[key] = r; });
  };
  const unhear = (key) => {
    if (releases.current[key]) releases.current[key]();
    releases.current[key] = null;
  };
  // when each track was last asked to play, so a fall back moments later
  // carries on playing instead of leaving the listener with silence
  const wanted = useRef({});
  const fallBack = (key, el, directSrc) => {
    if (fellBack.current[key]) return;
    fellBack.current[key] = true;
    el.src = directSrc;
    el.load();
    if (Date.now() - (wanted.current[key] || 0) < 10000) el.play().catch(() => {});
  };

  const stopAll = () => {
    Object.values(audioRefs.current).forEach((el) => {
      if (el) { el.pause(); el.currentTime = 0; }
    });
  };

  const playTrackAt = (albumIdx, trackIdx) => {
    if (trackIdx >= albums[albumIdx].tracks.length) {
      setPlayingAlbum(null);
      setPlayingTrack(null);
      return;
    }
    const el = audioRefs.current[`${albumIdx}_${trackIdx}`];
    if (!el) return;
    setPlayingAlbum(albumIdx);
    setPlayingTrack(trackIdx);
    el.currentTime = 0;
    primeAudio();
    el.play().catch(() => {});
  };

  const playAll = (albumIdx) => {
    stopAll();
    playTrackAt(albumIdx, 0);
  };

  const handleEnded = (albumIdx, trackIdx) => {
    if (playingAlbum === albumIdx) {
      playTrackAt(albumIdx, trackIdx + 1);
    }
  };

  return (
    <div>
      <div className="page-title">The Music</div>
      <div className="page-subtitle">36 signals &middot; 3 years &middot; one per month</div>

      <div className="panel" style={{ marginBottom: 32 }}>
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

      {albums.map((album, albumIdx) => (
        <div key={album.title} style={{ marginBottom: 44 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
            <img
              src={album.cover}
              alt={album.title}
              style={{ width: 160, height: 160, borderRadius: 6, objectFit: "cover", border: "1px solid #262A55" }}
            />
            <div>
              <div className="wordmark" style={{ fontSize: 28, color: "#DCDFFF" }}>
                {album.title}
              </div>
              <div className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
                {album.year}
              </div>
              <button
                onClick={() => playAll(albumIdx)}
                className="mono"
                style={{
                  marginTop: 8, background: "none", border: "1px solid #3A3E75", borderRadius: 4,
                  color: "#B9C0FF", fontSize: 11, letterSpacing: "0.5px", padding: "6px 14px", cursor: "pointer",
                }}
              >
                {playingAlbum === albumIdx ? "\u25B6 Playing..." : "\u25B6 Play all"}
              </button>
            </div>
          </div>

          <div className="panel" style={{ padding: "8px 20px" }}>
            {album.tracks.map((entry, i) => {
              const { file, label } = parseTrack(entry);
              const globalIndex = albumIdx * 12 + i;
              return (
                <div
                  key={file}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 0",
                    borderBottom: i < album.tracks.length - 1 ? "1px solid #21244A" : "none",
                    flexWrap: "wrap",
                  }}
                >
                  <div className="mono" style={{ fontSize: 12, color: "#565B8F", width: 20 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: "0 0 190px", fontSize: 14, color: "#D9DCFF" }}>
                    {label}
                  </div>
                  <div className="mono" style={{ flex: "0 0 100px", fontSize: 11, color: "#6E76B8" }}>
                    {releaseDateFor(globalIndex)}
                  </div>
                  <audio
                    ref={(el) => { audioRefs.current[`${albumIdx}_${i}`] = el; }}
                    onEnded={() => { unhear(`${albumIdx}_${i}`); handleEnded(albumIdx, i); }}
                    onPointerDown={primeAudio}
                    onPlay={() => { wanted.current[`${albumIdx}_${i}`] = Date.now(); }}
                    onPlaying={(e) => hear(`${albumIdx}_${i}`, e.currentTarget)}
                    onPause={() => unhear(`${albumIdx}_${i}`)}
                    onError={(e) => fallBack(`${albumIdx}_${i}`, e.currentTarget, BASE + file + ".mp3")}
                    controls
                    preload="none"
                    src={`/api/track/${encodeURIComponent(file)}.mp3?v=2`}
                    style={{ flex: 1, minWidth: 180, height: 32 }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="panel" style={{ marginTop: 20 }}>
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
