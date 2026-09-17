"use client";

import { useState, useEffect } from "react";

export default function BookReader({ meta, pages, inProgress, downloadHref, downloadLabel, coverImage, identification }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const offset = coverImage ? 1 : 0;
  const totalPages = pages.length + offset + (inProgress ? 1 : 0);
  const onCoverPage = coverImage && pageIndex === 0;
  const onInProgressPage = inProgress && pageIndex === pages.length + offset;
  const contentIndex = pageIndex - offset;
  const onLastWrittenPage = contentIndex === pages.length - 1;

  const currentPage = onCoverPage || onInProgressPage ? null : pages[contentIndex];
  const currentHeading = currentPage && !Array.isArray(currentPage) ? currentPage.heading : null;
  const currentParagraphs = currentPage ? (Array.isArray(currentPage) ? currentPage : currentPage.paragraphs) : [];
  const showIdentification = identification && contentIndex === 0 && !onCoverPage;

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
    if (!voiceSupported || onInProgressPage || onCoverPage) return;
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const text = currentParagraphs.join(" ");
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
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
          {voiceSupported && !onInProgressPage && !onCoverPage && (
            <button
              onClick={toggleRead}
              className="mono"
              style={{
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
          {downloadHref && (
            <a
              href={downloadHref}
              download
              className="mono"
              style={{
                border: "1px solid #262A55",
                borderRadius: 4,
                color: "#B9C0FF",
                fontSize: 11,
                letterSpacing: "0.5px",
                padding: "5px 12px",
                textDecoration: "none",
              }}
            >
              &#8681; {downloadLabel || "Download PDF"}
            </a>
          )}
        </div>
      </div>

      <div
        className="book-page"
        onClick={onInProgressPage ? undefined : handlePageClick}
        style={{
          marginTop: 28,
          width: "100%",
          minHeight: 380,
          padding: onCoverPage ? 0 : "36px 8vw 30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: onInProgressPage ? "center" : "flex-start",
          alignItems: onCoverPage ? "center" : "stretch",
          cursor: onInProgressPage ? "default" : "pointer",
          boxSizing: "border-box",
          overflow: onCoverPage ? "hidden" : "visible",
        }}
      >
        {onCoverPage ? (
          <img
            src={coverImage}
            alt={meta.chapter}
            style={{ width: "100%", height: "auto", display: "block", maxHeight: 640, objectFit: "contain" }}
          />
        ) : onInProgressPage ? (
          <div style={{ textAlign: "center" }}>
            <div className="mono" style={{ fontSize: 12, color: "#565B8F", letterSpacing: "1px", marginBottom: 10 }}>
              PAGE {pages.length + offset + 1}
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
          <>
            {showIdentification && (
              <div
                className="mono"
                style={{
                  fontSize: 11.5, color: "#6E76B8", lineHeight: 1.9, marginBottom: 22,
                  paddingBottom: 16, borderBottom: "1px solid #21244A",
                }}
              >
                {Object.entries(identification).map(([label, value]) => (
                  <div key={label}>
                    <span style={{ color: "#3A3E75" }}>{label}:</span> {value}
                  </div>
                ))}
              </div>
            )}
            {currentHeading && (
              <div
                className="mono"
                style={{ fontSize: 13, color: "#8B95F6", letterSpacing: "1.5px", marginBottom: 16, textTransform: "uppercase" }}
              >
                {currentHeading}
              </div>
            )}
            {currentParagraphs.map((p, i) => (
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
          ))}
          </>
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
