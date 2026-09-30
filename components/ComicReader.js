"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// A page-flip reader for comic pages, matching BookReader's page-turn feel
// but sized for images rather than text: each page fills the full width of
// the content area and is as tall as it needs to be, since the whole point
// is being able to read the lettering in the panels.
//
// `pages` is an array of image URLs, in reading order. `coverImage` is
// optional and shown first, before page 1.
export default function ComicReader({ title, coverImage, pages }) {
  const offset = coverImage ? 1 : 0;
  const totalPages = pages.length + offset;
  const [pageIndex, setPageIndex] = useState(0);
  const onCover = coverImage && pageIndex === 0;
  const currentSrc = onCover ? coverImage : pages[pageIndex - offset];
  const topRef = useRef(null);
  const turned = useRef(false);

  // turning the page brings you back to its top
  useEffect(() => {
    if (!turned.current) { turned.current = true; return; }
    const top = topRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pageIndex]);

  // fetch the next page ahead of time, so turning is instant
  useEffect(() => {
    const next = pageIndex + 1 < totalPages ? (pageIndex + 1 === 0 && coverImage ? coverImage : pages[pageIndex + 1 - offset]) : null;
    if (next) { const img = new Image(); img.src = next; }
  }, [pageIndex, totalPages, pages, offset, coverImage]);

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
    <div ref={topRef} style={{ width: "100%", scrollMarginTop: 16 }}>
      {title && (
        <div className="mono" style={{ fontSize: 11, color: "#565B8F", letterSpacing: "1px", textAlign: "center", marginBottom: 14 }}>
          {title.toUpperCase()} &middot; COMIC
        </div>
      )}

      <div
        onClick={goNext}
        style={{
          position: "relative",
          // the full width of the content area, so the lettering is readable;
          // the page is as tall as it needs to be (scroll to read down it)
          width: "100%",
          background: "#050612",
          border: "1px solid #262A55",
          borderRadius: 4,
          overflow: "hidden",
          cursor: pageIndex < totalPages - 1 ? "pointer" : "default",
        }}
      >
        {/* the 2:3 aspect ratio holds the page's shape while it loads */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={currentSrc}
          src={currentSrc}
          alt={onCover ? `${title} — cover` : `${title} — page ${pageIndex - offset + 1}`}
          style={{ width: "100%", height: "auto", aspectRatio: "2 / 3", objectFit: "contain", display: "block" }}
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
