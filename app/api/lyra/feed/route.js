import { withArchiveStories } from "../../../../lib/archiveStories";
import { createClient } from "@supabase/supabase-js";
import { getSpaceNews } from "../../../../lib/spaceNews";
import { nextRelease } from "../../../../lib/musicReleases";

// What's new on 13i.space, for Lyra to mention (components/LyraCompanion):
// the latest stories, the latest species, today's top space headline and
// the next song release. The same for everyone, so it's cached for 30
// minutes and each visitor's Lyra decides what's new *to them*.
export const revalidate = 1800;

export async function GET() {
  const feed = { stories: [], species: [], headline: null, release: nextRelease(), speciesCount: 0 };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const supabase = createClient(url, key, { auth: { persistSession: false } });
      const [stories, species, count] = await Promise.all([
        supabase.from("assignment_submissions").select("assignment_number, designation, created_at").in("status", ["canon", "archived"]).order("created_at", { ascending: false }).limit(5),
        supabase.from("alien_species").select("id, name, user_id, created_at").order("created_at", { ascending: false }).limit(20),
        supabase.from("alien_species").select("id", { count: "exact", head: true }),
      ]);
      feed.stories = withArchiveStories(stories.data || []).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 5).map((s) => ({ number: s.assignment_number, title: s.designation, at: s.created_at, href: `/assignments/${s.assignment_number}` }));
      feed.species = species.data || [];
      feed.speciesCount = count.count || feed.species.length;
    } catch (e) {
      // Lyra just has less to say
    }
  }
  try {
    const [top] = await getSpaceNews();
    if (top) feed.headline = { title: top.title, source: top.source, link: top.link, date: top.date };
  } catch (e) {
    // no headline today
  }
  return Response.json(feed);
}
