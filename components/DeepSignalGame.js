"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import FullscreenButton from "./FullscreenButton";
import Leaderboard from "./Leaderboard";
import { STORY_GAMES, openedStories } from "../lib/storyGames";
import { recordGamePlay, recordHighScore, recordDailyScore, getPersonalBest, celebrateNewBest } from "../lib/trackActivity";

const GAME = STORY_GAMES.find((g) => g.game === "deep-signal");
const MAX_SCORE = 20000; // well above anything a real run can reach

// Hosts the static game (public/games/deep-signal) in an iframe and turns
// the messages it posts - a run started, a run's score - into the same
// play/high-score/daily-score records the other games keep.
export default function DeepSignalGame() {
  const [unlocked, setUnlocked] = useState(null); // null = still checking
  const [best, setBest] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const frameRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    openedStories().then((opened) => setUnlocked(opened.has(GAME.assignment)));
    getPersonalBest(GAME.game).then(setBest);
  }, []);

  const onMessage = useCallback((e) => {
    // only our own page's iframe, only messages from this game
    if (e.origin !== window.location.origin) return;
    if (!frameRef.current || e.source !== frameRef.current.contentWindow) return;
    const msg = e.data || {};
    if (msg.source !== GAME.game) return;
    if (msg.type === "play") recordGamePlay(GAME.game);
    if (msg.type === "score") {
      const score = Math.round(Number(msg.score));
      if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) return;
      recordHighScore(GAME.game, score).then((isNewBest) => {
        if (isNewBest) celebrateNewBest(GAME.game, score);
        getPersonalBest(GAME.game).then(setBest);
      });
      recordDailyScore(GAME.game, score).then(() => setRefreshKey((k) => k + 1));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onMessage]);

  if (unlocked === null) return <div className="panel" style={{ minHeight: 200 }} />;

  if (!unlocked) {
    return (
      <div className="panel" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: "#8A8FBF", margin: 0 }}>
          This signal hasn&rsquo;t reached you yet.{" "}
          <Link href={GAME.storyHref}>Read {GAME.story}</Link> and it will.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div ref={wrapRef} className="panel" style={{ padding: 0, overflow: "hidden", background: "#030303" }}>
        <iframe
          ref={frameRef}
          src="/games/deep-signal/index.html"
          title={GAME.title}
          allow="fullscreen"
          style={{ width: "100%", height: "78vh", minHeight: 520, border: "none", display: "block" }}
          onLoad={() => frameRef.current?.focus()}
        />
      </div>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 10, fontSize: 11, color: "#6E76B8", flexWrap: "wrap" }}>
        <span>click the game to give it the keyboard &middot; desktop recommended</span>
        <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {best !== null && <span style={{ color: "#565B8F" }}>BEST {best.toLocaleString()}</span>}
          <FullscreenButton targetRef={wrapRef} />
        </span>
      </div>
      <Leaderboard game={GAME.game} refreshKey={refreshKey} />
    </div>
  );
}
