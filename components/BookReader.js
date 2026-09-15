"use client";

import { useState, useEffect } from "react";

export default function BookReader({ meta, pages, inProgress }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const totalPages = pages.length + (inProgress ? 1 : 0);
  const onLastWrittenPage = pageIndex === pages.length - 1;
  const onInProgressPage = inProgress && pageIndex === pages.length;

  useEffect(() => {
    setVoiceSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // stop reading whenever the page changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [pageIndex]);

  const toggleRead = (e) => {
    e.stopPropagation();
    if (!voiceSupported || onInProgressPage) return;
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const text = pages[pageIndex].join(" ");
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utter);
    setSpeaking(true);
  };

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
    <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%" }}>
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
        {voiceSupported && !onInProgressPage && (
          <button
            onClick={toggleRead}
            className="mono"
            style={{
              marginTop: 10,
              background: "none",
              border: "1px solid #262A55",
              borderRadius: 4,
              color: speaking ? "#E8CFC0" : "#B9C0FF",
              fontSize: 11,
              letterSpacing: "0.5px",
              padding: "5px 12px",
              cursor: "pointer",
            }}
          >
            {speaking ? "\u23F8 Stop reading" : "\u25B6 Read this page aloud"}
          </button>
        )}
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
