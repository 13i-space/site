"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// The quiet closing section of /launch. Draft wording (Paul to review):
// it only says what the site itself already says - "you are not the only
// one who found this" (the Kinship line on /launch since 5.0) - and lets a
// real line from the Kinbook speak for the rest. No new Kinship lore.
export default function LaunchKinship() {
  const [line, setLine] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/guestbook").then((r) => r.json()).then((d) => {
      const e = (d.entries || []).find((x) => x.message && x.message.length <= 160);
      if (!cancelled && e) setLine(e);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="kinship-close" aria-labelledby="kinship-close-title">
      <span className="kinship-close-mark" aria-hidden="true" />
      <h2 id="kinship-close-title" className="kinship-close-title">You are not the only one who found this.</h2>
      {line && (
        <figure className="kinship-close-quote">
          <blockquote>&ldquo;{line.message}&rdquo;</blockquote>
          <figcaption className="mono">{line.name || "a Kin"} &middot; in the Kinbook</figcaption>
        </figure>
      )}
      <Link href="/kinship" className="mono kinship-close-link">find the others &rarr;</Link>
    </section>
  );
}
