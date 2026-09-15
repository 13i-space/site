"use client";

import StarField from "./StarField";
import ConstellationField from "./ConstellationField";
import RadarField from "./RadarField";
import FibonacciField from "./FibonacciField";
import { ACTIVE_THEME } from "../lib/theme";

// Ambient, logo-less background for pages that aren't the hero. Lensing
// is only meaningful anchored to the big logo (see ThemedLogo), so it
// falls back to the starfield here rather than trying to lens nothing.
export default function ThemedBackground({ density }) {
  if (ACTIVE_THEME === "constellation") {
    return <ConstellationField density={density ? Math.round(density * 0.5) : 70} />;
  }
  if (ACTIVE_THEME === "radar") {
    return <RadarField />;
  }
  if (ACTIVE_THEME === "fibonacci") {
    return <FibonacciField />;
  }
  return <StarField density={density || 140} />;
}
