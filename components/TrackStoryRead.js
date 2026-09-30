"use client";

import { useEffect } from "react";
import { recordStoryRead } from "../lib/trackActivity";
import { markStoryOpened } from "../lib/storyGames";

export default function TrackStoryRead({ number }) {
  useEffect(() => {
    recordStoryRead(number);
    // remembered in this browser too, so a story's game unlocks even when signed out
    markStoryOpened(number);
  }, [number]);
  return null;
}
