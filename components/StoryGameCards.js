"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { STORY_GAMES, openedStories } from "../lib/storyGames";
import { useSignedIn, signUpHref } from "./SignUpToPlay";

// The Games hub's "Games from Short Stories" cards. An unlocked game links
// to itself; a locked one names its story and links there instead, so the
// way to unlock it is obvious. Renders nothing until it knows which is which.
export default function StoryGameCards({ cardStyle, titleStyle, blurbStyle }) {
  const [opened, setOpened] = useState(null);

  useEffect(() => {
    let cancelled = false;
    openedStories().then((set) => { if (!cancelled) setOpened(set); });
    return () => { cancelled = true; };
  }, []);

  const signedIn = useSignedIn();

  if (!opened || signedIn === null) return null;

  // signed out: every story game shows, grayed, with an invitation to sign up
  if (!signedIn) {
    return STORY_GAMES.map((g) => (
      <Link
        key={g.href}
        href={signUpHref(g.href)}
        style={{ ...cardStyle, opacity: 0.55, filter: "grayscale(1)" }}
        aria-label={`${g.title}: sign up to play`}
      >
        <div className="mono" style={{ fontSize: 9, letterSpacing: "1.5px", color: "#565B8F", marginBottom: 8 }}>
          FROM {g.story.toUpperCase()}
        </div>
        <div className="wordmark" style={{ ...titleStyle, color: "#8A8FBF" }}>{g.title}</div>
        <p style={blurbStyle}>{g.blurb}</p>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "1.5px", color: "#B9C0FF", marginTop: 12 }}>
          SIGN UP FREE TO PLAY &rarr;
        </div>
      </Link>
    ));
  }

  return STORY_GAMES.map((g) => {
    const unlocked = opened.has(g.assignment);
    return (
      <Link
        key={g.href}
        href={unlocked ? g.href : g.storyHref}
        style={{ ...cardStyle, borderColor: unlocked ? "#6B5E3E" : "#262A55", opacity: unlocked ? 1 : 0.75 }}
      >
        <div className="mono" style={{ fontSize: 9, letterSpacing: "1.5px", color: unlocked ? "#C9B98F" : "#565B8F", marginBottom: 8 }}>
          FROM {g.story.toUpperCase()}
        </div>
        <div className="wordmark" style={{ ...titleStyle, color: unlocked ? titleStyle.color : "#565B8F" }}>
          {unlocked ? g.title : "Locked"}
        </div>
        <p style={blurbStyle}>
          {unlocked ? g.blurb : `Read ${g.story} to unlock this game.`}
        </p>
      </Link>
    );
  });
}
