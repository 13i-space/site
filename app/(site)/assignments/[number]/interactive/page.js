import Link from "next/link";
import { notFound } from "next/navigation";
import InteractivePlayer from "../../../../../components/InteractivePlayer";
import TrackStoryRead from "../../../../../components/TrackStoryRead";
import { interactiveFor, INTERACTIVE_INDEX_HREF } from "../../../../../lib/interactive";

// The interactive version of a short story (see lib/interactive/).
export function generateMetadata({ params }) {
  const story = interactiveFor(params.number);
  if (!story) return {};
  const title = `${story.title} · Interactive Assignment`;
  const description = story.blurb;
  const image = { url: `/og/story/${story.number}`, width: 1200, height: 630 };
  return { title, description, openGraph: { title, description, images: [image] }, twitter: { card: "summary_large_image", images: [image.url] } };
}

export default function InteractiveAssignmentPage({ params }) {
  const story = interactiveFor(params.number);
  if (!story) notFound();

  return (
    <div>
      {/* playing it counts as opening the story (it unlocks the story's game) */}
      <TrackStoryRead number={story.number} />
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, maxWidth: 1100, margin: "0 auto 16px" }}>
        <Link href={INTERACTIVE_INDEX_HREF} className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
          &larr; Interactive Assignments
        </Link>
        <Link href={story.storyHref} className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
          read it as written &rarr;
        </Link>
      </div>
      <InteractivePlayer number={story.number} />
    </div>
  );
}
