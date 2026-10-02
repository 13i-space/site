"use client";

import { useEffect } from "react";
import { lyraReact } from "../lib/lyraReact";

// On a Kin's profile page: a proud glow when it's your own, a curious tilt
// when it's someone else's. Renders nothing.
export default function LyraKinReaction({ own }) {
  useEffect(() => {
    const t = setTimeout(() => lyraReact(own ? "proud" : "curious"), 700);
    return () => clearTimeout(t);
  }, [own]);
  return null;
}
