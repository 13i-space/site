import Link from "next/link";
import BookReader from "../../../../components/BookReader";
import { pages, chapterMeta, chapterInProgress } from "../../../../lib/chapter1";

export default function ChapterOne() {
  return (
    <div>
      <Link href="/book" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to The Book
      </Link>

      <div style={{ marginTop: 20 }}>
        <BookReader meta={chapterMeta} pages={pages} inProgress={chapterInProgress} />
      </div>
    </div>
  );
}
