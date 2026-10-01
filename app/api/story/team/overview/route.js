// The Lighthouse: the founders' dashboard data. Founders only (Aaron, Paul).
// GET -> everything the dashboard shows.  GET ?export=waitlist -> the launch list as CSV.
import { getStoryUserFromRequest, storyConfigured } from "../../../../../lib/story/storySupabase";
import { getStoryAdmin, isFounder } from "../../../../../lib/story/storyAdmin";
import { gatherTeamData, waitlistCsv } from "../../../../../lib/story/teamData";

export const dynamic = "force-dynamic";
const json = (b, s = 200) => Response.json(b, { status: s });

export async function GET(request) {
  if (!storyConfigured) return json({ error: "not_configured" }, 503);
  const auth = await getStoryUserFromRequest(request);
  if (!auth) return json({ error: "signed_out" }, 401);
  if (!isFounder(auth.user)) return json({ error: "not_found" }, 404);
  if (!getStoryAdmin()) return json({ error: "no_admin_key" }, 503);

  if (new URL(request.url).searchParams.get("export") === "waitlist") {
    const csv = await waitlistCsv();
    if (csv === null) return json({ error: "no_table" }, 500);
    return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="story-launch-list-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } });
  }
  const data = await gatherTeamData();
  return json(data, 200);
}
