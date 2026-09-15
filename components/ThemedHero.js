"use client";

import { useRef } from "react";
import SignalLogo from "./SignalLogo";
import OrbitalLogo from "./OrbitalLogo";
import RadarLogo from "./RadarLogo";
import FibonacciLogo from "./FibonacciLogo";
import GravityLens from "./GravityLens";
import StarField from "./StarField";
import ConstellationField from "./ConstellationField";
import RadarField from "./RadarField";
import FibonacciField from "./FibonacciField";
import { ACTIVE_THEME } from "../lib/theme";

// Renders the full hero treatment (background + logo together) for
// whichever theme is active. Lensing needs a ref to the logo image to
// find the eye position, so it's handled as its own self-contained case.
export default function ThemedHero({ src, background = true, logoWrapStyle }) {
  const logoRef = useRef(null);

  if (ACTIVE_THEME === "lensing") {
    return (
      <>
        {background && <GravityLens anchorRef={logoRef} />}
        <div style={logoWrapStyle}>
          <img
            ref={logoRef}
            src={src || "/13i-logo.png"}
            alt="13i"
            style={{ width: "100%", position: "relative", zIndex: 2, display: "block" }}
          />
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
