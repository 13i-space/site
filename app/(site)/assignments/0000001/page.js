import Link from "next/link";
import BookReader from "../../../../components/BookReader";
import TrackStoryRead from "../../../../components/TrackStoryRead";
import { pages, assignmentMeta } from "../../../../lib/assignment1";

const ogTitle = `${assignmentMeta.chapter} · The Archive`;
const ogDescription = "Assignment 0000001, the first 13i short story, by Paul Donaghy.";
export const metadata = {
  title: ogTitle,
  description: ogDescription,
  openGraph: { title: ogTitle, description: ogDescription, images: [{ url: "/og/story/1", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/og/story/1"] },
};

export default function AssignmentOnePage() {
  return (
    <div>
      <TrackStoryRead number={1} />
      <Link href="/assignments" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to Assignments
      </Link>

      <div style={{ marginTop: 20 }}>
        <BookReader
          meta={assignmentMeta}
          pages={pages}
          coverImage="/covers/assignment-0000001.jpg"
          downloadHref="/downloads/assignment-0000001.pdf"
          downloadLabel="Download the PDF"
          audioSrc="/stories/first-silence/audio.mp3"
        />
      </div>
    </div>
  );
}
