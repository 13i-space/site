"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import IframeGame from "./IframeGame";
import { STORY_GAMES, openedStories } from "../lib/storyGames";

const GAME = STORY_GAMES.find((g) => g.game === "deep-signal");

// The Deep Signal, shown only once its story has been opened.
export default function DeepSignalGame() {
  const [unlocked, setUnlocked] = useState(null); // null = still checking

  useEffect(() => {
    openedStories().then((opened) => setUnlocked(opened.has(GAME.assignment)));
  }, []);

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
    <IframeGame
      game={GAME.game}
      src="/games/deep-signal/index.html"
      title={GAME.title}
      note="click the game to give it the keyboard · desktop recommended"
    />
  );
}
