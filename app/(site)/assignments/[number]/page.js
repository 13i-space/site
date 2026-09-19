import Link from "next/link";
import { createClient } from "../../../../lib/supabaseServer";
import { paginateStory } from "../../../../lib/paginateStory";
import BookReader from "../../../../components/BookReader";
import TrackStoryRead from "../../../../components/TrackStoryRead";

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
        <BookReader meta={meta} pages={pages} coverImage={row.cover_url} />
      </div>
    </div>
  );
}
