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
      <div className="iah-bar">
        <Link href={INTERACTIVE_INDEX_HREF} className="mono iah-back">
          &larr; Interactive Assignments
        </Link>
        <div className="iah-title">
          <div className="mono iah-desig">{story.designation}</div>
          <h1>{story.title}</h1>
        </div>
        <Link href={story.storyHref} className="mono iah-read">
          read it as written &rarr;
        </Link>
      </div>
      <style dangerouslySetInnerHTML={{ __html: TOPBAR_CSS }} />
      <InteractivePlayer number={story.number} />
    </div>
  );
}

// the story's name sits centred between the two links (Update 5.55), so you
// always know which record you are inside
const TOPBAR_CSS = `
.iah-bar { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; max-width: 1100px; margin: 0 auto 18px; }
.iah-back, .iah-read { font-size: 12px; color: #6E76B8; }
.iah-read { justify-self: end; text-align: right; }
.iah-title { text-align: center; }
.iah-title h1 { margin: 2px 0 0; font-family: var(--font-display); font-style: italic; font-weight: 500; font-size: clamp(28px, 4.2vw, 44px); color: #E6E8FF; line-height: 1.1; text-shadow: 0 0 24px rgba(139,149,246,0.35); }
.iah-desig { font-size: 10px; letter-spacing: 3px; color: #8B95F6; text-transform: uppercase; }
@media (max-width: 640px) {
  .iah-bar { grid-template-columns: 1fr 1fr; }
  .iah-title { grid-column: 1 / -1; grid-row: 2; }
}
`;
