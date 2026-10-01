"use client";
import { useState } from "react";

// "Download as a book": builds the typeset PDF in the browser.
export default function BookButton({ title, author, parts, className = "sos-btn ghost", label = "Download as a book (PDF)" }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const empty = !parts?.length;
  async function go() {
    setBusy(true); setErr("");
    try {
      const { downloadStoryBook } = await import("../../../lib/story/bookPdf");
      await downloadStoryBook({ title, author, parts });
    } catch (e) {
      setErr("Couldn't make the book just now. Try again in a moment.");
    }
    setBusy(false);
  }
  return (
    <>
      <button className={className} onClick={go} disabled={busy || empty} title={empty ? "Write a section first" : undefined}>
        {busy ? "Typesetting your book…" : label}
      </button>
      {err && <span className="sos-sw-msg">{err}</span>}
    </>
  );
}
