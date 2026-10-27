"use client";

import { useEffect, useState } from "react";

// The Galactic Gazette as a paper you can turn (Update 5.66): page one is
// the space news, page two the sci-fi entertainment section, page three
// (Update 6.24) the live wire and the door to Mission Control. Turn with the
// folded corner, the tabs, or the arrow keys; #page-2 / #page-3 open a page.
export default function GazetteBook({ pages, labels }) {
  const [page, setPage] = useState(0);
  const [turning, setTurning] = useState(null); // "fwd" | "back"
  useEffect(() => {
    const m = window.location.hash.match(/page-?(\d+)/);
    const n = m ? parseInt(m[1], 10) - 1 : 0;
    if (n > 0 && n < pages.length) setPage(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const go = (to) => {
    if (to === page || turning || to < 0 || to >= pages.length) return;
    setTurning(to > page ? "fwd" : "back");
    setTimeout(() => {
      setPage(to);
      try { history.replaceState(null, "", to ? `#page-${to + 1}` : "#"); } catch (e) { /* ignore */ }
      window.scrollTo({ top: Math.max(0, (document.querySelector(".gz-book")?.offsetTop || 0) - 20), behavior: "smooth" });
    }, 380);
    setTimeout(() => setTurning(null), 760);
  };
  useEffect(() => {
    const onKey = (e) => { if (/input|textarea/i.test(e.target.tagName)) return; if (e.key === "ArrowRight") go(page + 1); if (e.key === "ArrowLeft") go(page - 1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <div className="gz-book">
      <nav className="gz-tabs" aria-label="Pages">
        {labels.map((l, i) => (
          <button key={l} className={`gz-tab ${page === i ? "on" : ""}`} onClick={() => go(i)} aria-current={page === i ? "page" : undefined}>
            <span>Page {i + 1}</span>{l}
          </button>
        ))}
      </nav>
      <div className={`gz-leaf ${turning ? `gz-turn-${turning}` : ""}`}>
        {pages[page]}
        {page < pages.length - 1 && (
          <button className="gz-corner" onClick={() => go(page + 1)} aria-label={`Turn to page ${page + 2}: ${labels[page + 1]}`}>
            <span>Turn the page &rarr;<small>{labels[page + 1]}</small></span>
          </button>
        )}
        {page > 0 && (
          <button className="gz-corner gz-corner-back" onClick={() => go(page - 1)} aria-label={`Back to page ${page}: ${labels[page - 1]}`}>
            <span>&larr; Page {page}<small>{labels[page - 1]}</small></span>
          </button>
        )}
      </div>
    </div>
  );
}
