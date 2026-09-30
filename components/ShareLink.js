"use client";

import { useState } from "react";

// "Share": the phone's share sheet where there is one, otherwise copy the
// link. The link's preview image comes from the page's own metadata.
export default function ShareLink({ path, title, style, className = "mono" }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // cancelled, or clipboard blocked - nothing to do
    }
  };
  return (
    <button onClick={share} className={className} style={style}>
      {copied ? "link copied" : "share ↗"}
    </button>
  );
}
