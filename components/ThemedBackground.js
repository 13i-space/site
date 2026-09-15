"use client";

import StarField from "./StarField";
import ConstellationField from "./ConstellationField";
import RadarField from "./RadarField";
import FibonacciField from "./FibonacciField";
import NebulaField from "./NebulaField";
import { ACTIVE_THEME } from "../lib/theme";

// Ambient, logo-less background for pages that aren't the hero.
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
  if (ACTIVE_THEME === "nebula") {
    return <NebulaField />;
  }
  return <StarField density={density || 140} />;
}
