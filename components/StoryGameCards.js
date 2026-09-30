"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { STORY_GAMES, openedStories } from "../lib/storyGames";

// Cards for story games the visitor has unlocked, rendered into the Games
// hub's grid. Renders nothing until it knows - never a flash of a locked game.
export default function StoryGameCards({ cardStyle, titleStyle, blurbStyle }) {
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    let cancelled = false;
    openedStories().then((opened) => {
      if (!cancelled) setUnlocked(STORY_GAMES.filter((g) => opened.has(g.assignment)));
    });
    return () => { cancelled = true; };
  }, []);

  return unlocked.map((g) => (
    <Link key={g.href} href={g.href} style={{ ...cardStyle, borderColor: "#6B5E3E" }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "1.5px", color: "#C9B98F", marginBottom: 8 }}>
        FROM {g.story.toUpperCase()}
      </div>
      <div className="wordmark" style={titleStyle}>{g.title}</div>
      <p style={blurbStyle}>{g.blurb}</p>
    </Link>
  ));
}
