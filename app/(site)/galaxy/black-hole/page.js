import Link from "next/link";
import { BLACK_HOLE_ISSUES } from "../../../../lib/blackHole";

export const metadata = {
  title: "The Black Hole",
  description: "A weekly mini deep-dive into one idea in space, physics or science. Visual, hands-on, 5-10 minutes.",
};

// The Black Hole: the list of issues, newest first (lib/blackHole.js).
export default function BlackHoleIndex() {
  const issues = [...BLACK_HOLE_ISSUES].sort((a, b) => b.number - a.number);
  return (
    <div className="bh-index">
      <Link href="/galaxy" className="mono bh-back">&larr; The Galaxy</Link>
      <div className="bh-index-hero">
        <div className="bh-index-hole" aria-hidden="true"><span /></div>
        <div>
          <div className="mono bh-kicker">A NEW DEEP DIVE EVERY WEEK</div>
          <h1 className="bh-index-title">The Black Hole</h1>
          <p className="bh-index-line">One idea from space, physics or science, taken apart a step at a time, with something to touch at every step. Five to ten minutes. Fall in.</p>
        </div>
      </div>
      <div className="bh-issues">
        {issues.map((it) => (
          <Link key={it.number} href={`/galaxy/black-hole/${it.number}`} className="bh-issue-card">
            <span className="mono bh-issue-no">NO. {String(it.number).padStart(2, "0")}</span>
            <span className="wordmark bh-issue-title">{it.title}</span>
            <span className="bh-issue-sub">{it.subtitle}</span>
            <span className="mono bh-issue-meta">{it.steps.length} steps &middot; {it.minutes} minutes &middot; begin &rarr;</span>
          </Link>
        ))}
        <div className="bh-issue-card bh-issue-soon">
          <span className="mono bh-issue-no">NO. {String(BLACK_HOLE_ISSUES.length + 1).padStart(2, "0")} &middot; NEXT WEEK</span>
          <span className="wordmark bh-issue-title">Quantum Fluctuations</span>
          <span className="bh-issue-sub">empty space is never empty</span>
        </div>
      </div>
    </div>
  );
}
