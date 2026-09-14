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
    // clicking the page itself turns forward, same as the arrow
    goNext();
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
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

      <div style={{ display: "flex", alignItems: "stretch", gap: 10, marginTop: 28 }}>
        <ArrowButton direction="prev" onClick={goPrev} disabled={pageIndex === 0} />

        <div
          className="book-page"
          onClick={onInProgressPage ? undefined : handlePageClick}
          style={{
            flex: 1,
            minHeight: 380,
            padding: "36px 32px 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: onInProgressPage ? "center" : "flex-start",
            cursor: onInProgressPage ? "default" : "pointer",
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
                  fontSize: 16,
                  lineHeight: 1.85,
                  color: "#D9DCFF",
                  marginBottom: 18,
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
              {onLastWrittenPage ? "tap to continue" : "tap page or arrow to continue"}
            </div>
          )}
        </div>

        <ArrowButton direction="next" onClick={goNext} disabled={pageIndex === totalPages - 1} />
      </div>

      <div className="mono" style={{ textAlign: "center", fontSize: 12, color: "#565B8F", marginTop: 16 }}>
        page {pageIndex + 1} of {totalPages}
      </div>
    </div>
  );
}

function ArrowButton({ direction, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "next" ? "Next page" : "Previous page"}
      style={{
        flexShrink: 0,
        width: 42,
        alignSelf: "stretch",
        background: "none",
        border: "1px solid #262A55",
        borderRadius: 4,
        color: "#B9C0FF",
        fontSize: 18,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.25 : 1,
      }}
    >
      {direction === "next" ? "\u203A" : "\u2039"}
    </button>
  );
}
