// The Safety desk: founders (Aaron, Paul) review safety alerts.
// GET -> recent alerts.  POST { id, status, note } -> update one.
import { getStoryUserFromRequest, storyConfigured } from "../../../../../lib/story/storySupabase";
import { getStoryAdmin, isFounder } from "../../../../../lib/story/storyAdmin";

export const dynamic = "force-dynamic";
const json = (b, s = 200) => Response.json(b, { status: s });
const STATUSES = ["new", "contacted", "resolved"];

async function gate(request) {
  if (!storyConfigured) return { res: json({ error: "not_configured" }, 503) };
  const auth = await getStoryUserFromRequest(request);
  if (!auth) return { res: json({ error: "signed_out" }, 401) };
  if (!isFounder(auth.user)) return { res: json({ error: "not_found" }, 404) };
  const admin = getStoryAdmin();
  if (!admin) return { res: json({ error: "no_admin_key" }, 503) };
  return { auth, admin };
}

export async function GET(request) {
  const g = await gate(request);
  if (g.res) return g.res;
  const { data, error } = await g.admin.from("story_safety_alerts").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) return json({ error: "no_table" }, 500);
  return json({ alerts: data || [] });
}

export async function POST(request) {
  const g = await gate(request);
  if (g.res) return g.res;
  let body = {};
  try { body = await request.json(); } catch {}
  const id = Number(body.id);
  if (!Number.isFinite(id) || !STATUSES.includes(body.status)) return json({ error: "Bad request." }, 400);
  const { error } = await g.admin.from("story_safety_alerts").update({
    status: body.status,
    team_note: typeof body.note === "string" ? body.note.slice(0, 2000) : null,
    reviewed_by: g.auth.user.user_metadata?.first_name || g.auth.user.email,
    reviewed_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) return json({ error: "Couldn't save." }, 500);
  return json({ ok: true });
}
