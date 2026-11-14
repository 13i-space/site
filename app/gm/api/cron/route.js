// Scheduled runs. Vercel calls this once each morning (see vercel.json). It needs CRON_SECRET to be set,
// and it only does anything once clubs are saved in the Supabase table (see docs/gm-demo.md), because the
// temporary storage is not shared between server instances.
import { listClubIds, loadClub } from "../../../../lib/gm/store";
import { applyRun } from "../../../../lib/gm/apply";
import { runAgent, hasKey } from "../../../../lib/gm/runner";
import { isDue } from "../../../../lib/gm/text";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
const ORDER = ["sponsorship", "tickets", "gm", "partners", "marketing", "team"];

export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  if (!hasKey()) return Response.json({ ok: false, error: "No API key" });
  const url = new URL(req.url);
  const club = url.searchParams.get("club");
  const agent = url.searchParams.get("agent");

  // One club and one agent: do the run (this is the fan-out target).
  if (club && agent) {
    const c = await loadClub(club);
    if (!c || !isDue(c, agent)) return Response.json({ ok: true, skipped: true });
    const res = await runAgent(c, agent);
    await applyRun(c.id, res);
    return Response.json({ ok: true, club, agent, summary: res.log.summary });
  }

  // No params: find everything due and start each run as its own request, so each gets its own time budget.
  const jobs = [];
  for (const id of await listClubIds()) {
    if (id.startsWith("__")) continue;
    const c = await loadClub(id);
    if (c) for (const a of ORDER) if (isDue(c, a)) jobs.push({ club: id, agent: a });
  }
  const results = await Promise.all(jobs.slice(0, 12).map(async (j) => {
    try {
      const r = await fetch(`${url.origin}/gm/api/cron?club=${encodeURIComponent(j.club)}&agent=${j.agent}`, { headers: { authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(56000) });
      return { ...j, status: r.status };
    } catch (e) { return { ...j, error: String(e?.message || e) }; }
  }));
  return Response.json({ ok: true, due: jobs.length, results });
}
