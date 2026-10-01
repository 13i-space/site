import Link from "next/link";
import { createClient } from "../../../../lib/supabaseServer";
import { paginateStory } from "../../../../lib/paginateStory";
import BookReader from "../../../../components/BookReader";
import TrackStoryRead from "../../../../components/TrackStoryRead";
import { comicHrefFor } from "../../../../lib/comics";
import { interactiveHrefFor } from "../../../../lib/interactive";

// Narrated audio for stories that have one, keyed by assignment number.
const STORY_AUDIO = {
  87: "/stories/deep-walkers/audio.mp3",
  215783: "/stories/neraths-secret/audio.mp3",
};

// Title, description and link-preview image (app/og/story/[number]).
export async function generateMetadata({ params }) {
  try {
    const supabase = await createClient();
    const { data: row } = await supabase
      .from("assignment_submissions")
      .select("assignment_number, designation, name, type, status")
      .eq("assignment_number", Number(params.number))
      .single();
    if (!row || !["canon", "archived"].includes(row.status)) return {};
    const title = `${row.designation} · The Archive`;
    const description = `Assignment ${String(row.assignment_number).padStart(7, "0")}, a 13i short story. ${row.type === "ai" ? "An AI-originated Assignment." : `Written by ${row.name || "a Kin"}.`}`;
    const image = { url: `/og/story/${row.assignment_number}`, width: 1200, height: 630 };
    return { title, description, openGraph: { title, description, images: [image] }, twitter: { card: "summary_large_image", images: [image.url] } };
  } catch (e) {
    return {};
  }
}

export default async function DynamicAssignmentPage({ params }) {
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("assignment_submissions")
    .select("assignment_number, designation, story, name, type, cover_url, status")
    .eq("assignment_number", Number(params.number))
    .single();

  if (!row || !["canon", "archived"].includes(row.status)) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <div className="page-title">Not Found</div>
        <p style={{ color: "#8A8FBF" }}>That Assignment isn't available to read yet.</p>
      </div>
    );
  }

  const pages = paginateStory(row.story);
  const meta = {
    book: "The Archive",
    part: `Assignment ${String(row.assignment_number).padStart(7, "0")}`,
    chapter: row.designation,
    subtitle: row.type === "ai" ? "An AI-originated Assignment" : `Written by ${row.name || "a Kin"}`,
  };

  return (
    <div>
      <TrackStoryRead number={row.assignment_number} />
      <Link href="/assignments" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to Assignments
      </Link>
      <div style={{ marginTop: 20 }}>
        <BookReader meta={meta} pages={pages} coverImage={row.cover_url} audioSrc={STORY_AUDIO[row.assignment_number]} comicHref={comicHrefFor(row.assignment_number)} interactiveHref={interactiveHrefFor(row.assignment_number)} />
      </div>
    </div>
  );
}
