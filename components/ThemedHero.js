"use client";

import { useRef } from "react";
import SignalLogo from "./SignalLogo";
import OrbitalLogo from "./OrbitalLogo";
import RadarLogo from "./RadarLogo";
import FibonacciLogo from "./FibonacciLogo";
import HubbleLogo from "./HubbleLogo";
import StarField from "./StarField";
import ConstellationField from "./ConstellationField";
import RadarField from "./RadarField";
import FibonacciField from "./FibonacciField";
import HubbleField from "./HubbleField";
import { ACTIVE_THEME } from "../lib/theme";

export default function ThemedHero({ src, background = true, logoWrapStyle }) {
  const logoRef = useRef(null);

  if (ACTIVE_THEME === "hubble") {
    return (
      <>
        {background && <HubbleField />}
        <div style={logoWrapStyle}>
          <HubbleLogo src={src} />
        </div>
      </>
    );
  }

  if (ACTIVE_THEME === "constellation") {
    return (
      <>
        {background && <ConstellationField density={70} linkDistance={130} />}
        <div style={logoWrapStyle}>
          <OrbitalLogo src={src} />
        </div>
      </>
    );
  }

  if (ACTIVE_THEME === "radar") {
    return (
      <>
        {background && <RadarField />}
        <div style={logoWrapStyle}>
          <RadarLogo src={src} />
        </div>
      </>
    );
  }

  if (ACTIVE_THEME === "fibonacci") {
    return (
      <>
        {background && <FibonacciField />}
        <div style={logoWrapStyle}>
          <FibonacciLogo src={src} />
        </div>
      </>
    );
  }

  return (
    <>
      {background && <StarField density={160} />}
      <div style={logoWrapStyle}>
        <SignalLogo src={src} />
      </div>
    </>
  );
}
