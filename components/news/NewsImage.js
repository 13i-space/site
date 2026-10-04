"use client";

import { useState, useRef, useEffect } from "react";

// A newspaper photo: sepia until hovered. If the picture fails to load (or
// there isn't one), an engraved placeholder stands in, so a column never
// shows a broken image.
export default function NewsImage({ src, alt, source, tall }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  // an image that failed before hydration never fires onError - check once
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  if (!src || failed) {
    return (
      <div className={`gz-plate ${tall ? "gz-plate-tall" : ""}`} aria-hidden>
        <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="gzh" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="4" stroke="#2b2418" strokeWidth="0.7" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="200" height="120" fill="url(#gzh)" />
          <circle cx="140" cy="48" r="26" fill="#efe4cc" stroke="#2b2418" strokeWidth="1.2" />
          <ellipse cx="140" cy="48" rx="44" ry="9" fill="none" stroke="#2b2418" strokeWidth="1" transform="rotate(-18 140 48)" />
          <circle cx="40" cy="24" r="1.4" fill="#2b2418" /><circle cx="70" cy="82" r="1" fill="#2b2418" />
          <circle cx="24" cy="96" r="1.6" fill="#2b2418" /><circle cx="96" cy="18" r="1" fill="#2b2418" />
        </svg>
        <span className="gz-plate-cap">{source}</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      className={`gz-photo ${tall ? "gz-photo-tall" : ""}`}
      src={src}
      alt={alt || ""}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
