"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import FullscreenButton from "./FullscreenButton";
import Leaderboard from "./Leaderboard";
import { recordGamePlay, recordHighScore, recordDailyScore, getPersonalBest, celebrateNewBest } from "../lib/trackActivity";

const MAX_SCORE = 1000000; // sanity cap - far above anything a real run reaches

// Hosts a standalone game page (public/games/...) in an iframe and turns
// the messages it posts - {source: game, type: "play"} when a run starts,
// {source: game, type: "score", score} when one ends - into the same
// play / high-score / daily-score records the other games keep.
export default function IframeGame({ game, src, title, note = "click the game to give it the keyboard" }) {
  const [best, setBest] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const frameRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    getPersonalBest(game).then(setBest);
  }, [game]);

  const onMessage = useCallback((e) => {
    // only our own page's iframe, only messages from this game
    if (e.origin !== window.location.origin) return;
    if (!frameRef.current || e.source !== frameRef.current.contentWindow) return;
    const msg = e.data || {};
    if (msg.source !== game) return;
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

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
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
          onLoad={() => frameRef.current?.focus()}
        />
      </div>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 10, fontSize: 11, color: "#6E76B8", flexWrap: "wrap" }}>
        <span>{note}</span>
        <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {best !== null && <span style={{ color: "#565B8F" }}>BEST {best.toLocaleString()}</span>}
          <FullscreenButton targetRef={wrapRef} />
        </span>
      </div>
      <Leaderboard game={game} refreshKey={refreshKey} />
    </div>
  );
}
