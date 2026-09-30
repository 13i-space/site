import Link from "next/link";
import BookReader from "../../../../components/BookReader";
import { pages, chapterMeta, chapterInProgress } from "../../../../lib/chapter1";

// Keyed by each chapter's opening heading in lib/chapter1.js, so the
// reader's player switches to Chapter 2's audio on Chapter 2's pages.
const CHAPTER_AUDIO = {
  "Chapter 1 — Aiden: Apprehension": { label: "Listen to Chapter 1", src: "/audio/Chapter1.mp3" },
  "Chapter 2 — Xavier: Thorium": { label: "Listen to Chapter 2", src: "/audio/Chapter2.mp3" },
};

export default function ChapterOne() {
  return (
    <div>
      <Link href="/book" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to The Book
      </Link>

      <div style={{ marginTop: 20 }}>
        <BookReader
          meta={chapterMeta}
          pages={pages}
          inProgress={chapterInProgress}
          downloadHref="/downloads/13i-chapters-1-2.pdf"
          downloadLabel="Download First Two Chapters (PDF)"
          audioByHeading={CHAPTER_AUDIO}
        />
      </div>
    </div>
  );
}
