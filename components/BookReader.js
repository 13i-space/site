"use client";

import { useState } from "react";

export default function BookReader({ meta, pages, inProgress }) {
  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = pages.length + (inProgress ? 1 : 0);
  const onLastWrittenPage = pageIndex === pages.length - 1;
  const onInProgressPage = inProgress && pageIndex === pages.length;

  const goNext = () => {
    if (pageIndex < totalPages - 1) setPageIndex((p) => p + 1);
  };
  const goPrev = () => {
    if (pageIndex > 0) setPageIndex((p) => p - 1);
  };
  const handlePageClick = () => {
    // clicking the page itself turns forward, same as the "next" control
    goNext();
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: 6, textAlign: "center" }}>
        <div className="mono" style={{ fontSize: 11, color: "#565B8F", letterSpacing: "1px" }}>
          {meta.book.toUpperCase()} &middot; {meta.part.toUpperCase()}
        </div>
        <div className="page-title" style={{ marginBottom: 0 }}>
          {meta.chapter}
        </div>
        <div className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
          {meta.subtitle}
        </div>
      </div>

      <div
        className="book-page"
        onClick={onInProgressPage ? undefined : handlePageClick}
        style={{
          marginTop: 28,
          width: "100%",
          minHeight: 380,
          padding: "36px 8vw 30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: onInProgressPage ? "center" : "flex-start",
          cursor: onInProgressPage ? "default" : "pointer",
          boxSizing: "border-box",
        }}
      >
        {onInProgressPage ? (
          <div style={{ textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 12, color: "#565B8F", letterSpacing: "1px", marginBottom: 10 }}>
              PAGE {pages.length + 1}
            </div>
            <p style={{ fontSize: 14, color: "#8A8FBF", fontStyle: "italic" }}>
              More of Chapter One is coming as the manuscript is finalized.
              Want the whole rough draft now?{" "}
              <a href="/downloads/13i-rough-draft.pdf" download>
                Download the full PDF
              </a>
              .
            </p>
          </div>
        ) : (
          pages[pageIndex].map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: 17,
                lineHeight: 1.85,
                color: "#D9DCFF",
                marginBottom: 18,
                maxWidth: 700,
              }}
            >
              {p}
            </p>
          ))
        )}

        {!onInProgressPage && (
          <div
            className="mono"
            style={{
              marginTop: "auto",
              paddingTop: 18,
              fontSize: 11,
              color: "#3A3E75",
              textAlign: "center",
            }}
          >
            {onLastWrittenPage ? "tap to continue" : "tap page to continue"}
          </div>
        )}
      </div>

      {/* bottom-only page controls */}
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

        <div className="mono" style={{ fontSize: 12, color: "#565B8F", minWidth: 90, textAlign: "center" }}>
          page {pageIndex + 1} of {totalPages}
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
