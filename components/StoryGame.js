"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import IframeGame from "./IframeGame";
import { STORY_GAMES, openedStories } from "../lib/storyGames";

// A game that belongs to a short story, shown once that story has been
// opened (see lib/storyGames.js). Scores are recorded by IframeGame.
export default function StoryGame({ game }) {
  const entry = STORY_GAMES.find((g) => g.game === game);
  const [unlocked, setUnlocked] = useState(null); // null = still checking

  useEffect(() => {
    openedStories().then((opened) => setUnlocked(opened.has(entry.assignment)));
  }, [entry.assignment]);

  if (unlocked === null) return <div className="panel" style={{ minHeight: 200 }} />;

  if (!unlocked) {
    return (
      <div className="panel" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: "#8A8FBF", margin: 0 }}>
          This game hasn&rsquo;t reached you yet.{" "}
          <Link href={entry.storyHref}>Read {entry.story}</Link> and it will.
        </p>
      </div>
    );
  }

  return <IframeGame game={entry.game} src={entry.src} title={entry.title} note={entry.note} />;
}
