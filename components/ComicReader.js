"use client";

import { useState, useEffect, useCallback } from "react";

// A page-flip reader for comic pages, matching BookReader's page-turn feel
// but sized for images rather than text: each page fills as much of the
// screen as it can while keeping its 2:3 portrait shape, since the whole
// point is being able to read the lettering in the panels.
//
// `pages` is an array of image URLs, in reading order. `coverImage` is
// optional and shown first, before page 1.
export default function ComicReader({ title, coverImage, pages }) {
  const offset = coverImage ? 1 : 0;
  const totalPages = pages.length + offset;
  const [pageIndex, setPageIndex] = useState(0);
  const onCover = coverImage && pageIndex === 0;
  const currentSrc = onCover ? coverImage : pages[pageIndex - offset];

  const goNext = useCallback(() => {
    setPageIndex((p) => Math.min(p + 1, totalPages - 1));
  }, [totalPages]);
  const goPrev = useCallback(() => {
    setPageIndex((p) => Math.max(p - 1, 0));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
      {title && (
        <div className="mono" style={{ fontSize: 11, color: "#565B8F", letterSpacing: "1px", textAlign: "center", marginBottom: 14 }}>
          {title.toUpperCase()} &middot; COMIC
        </div>
      )}

      <div
        onClick={goNext}
        style={{
          position: "relative",
          width: "100%",
          // 2:3 portrait, capped so a wide desktop window doesn't stretch
          // the page taller than the viewport can comfortably show
          maxHeight: "calc(100vh - 220px)",
          aspectRatio: "2 / 3",
          margin: "0 auto",
          background: "#050612",
          border: "1px solid #262A55",
          borderRadius: 4,
          overflow: "hidden",
          cursor: pageIndex < totalPages - 1 ? "pointer" : "default",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={currentSrc}
          src={currentSrc}
          alt={onCover ? `${title} — cover` : `${title} — page ${pageIndex - offset + 1}`}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 16 }}>
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          disabled={pageIndex === 0}
          aria-label="Previous page"
          style={{
            background: "none",
            border: "1px solid #262A55",
            borderRadius: 4,
            color: "#B9C0FF",
            fontSize: 15,
            padding: "8px 18px",
            cursor: pageIndex === 0 ? "default" : "pointer",
            opacity: pageIndex === 0 ? 0.3 : 1,
          }}
        >
          &lsaquo; Prev
        </button>

        <div className="mono" style={{ fontSize: 12, color: "#565B8F", minWidth: 110, textAlign: "center" }}>
          {onCover ? "cover" : `page ${pageIndex - offset + 1} of ${pages.length}`}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          disabled={pageIndex === totalPages - 1}
          aria-label="Next page"
          style={{
            background: "none",
            border: "1px solid #262A55",
            borderRadius: 4,
            color: "#B9C0FF",
            fontSize: 15,
            padding: "8px 18px",
            cursor: pageIndex === totalPages - 1 ? "default" : "pointer",
            opacity: pageIndex === totalPages - 1 ? 0.3 : 1,
          }}
        >
          Next &rsaquo;
        </button>
      </div>
    </div>
  );
}
