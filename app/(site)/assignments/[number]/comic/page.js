import Link from "next/link";
import { notFound } from "next/navigation";
import ComicReader from "../../../../../components/ComicReader";
import TrackStoryRead from "../../../../../components/TrackStoryRead";
import { COMICS } from "../../../../../lib/comics";

// The comic version of a short story (see lib/comics.js).
export default function StoryComicPage({ params }) {
  const number = Number(params.number);
  const comic = COMICS[number];
  if (!comic) notFound();

  return (
    <div>
      {/* reading the comic counts as opening the story (it unlocks its game) */}
      <TrackStoryRead number={number} />
      <Link href={`/assignments/${number}`} className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to the story
      </Link>
      <div style={{ marginTop: 20 }}>
        <ComicReader title={comic.title} coverImage={comic.cover} pages={comic.pages} />
      </div>
    </div>
  );
}
