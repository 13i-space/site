// One-time loader for Assignment 0028657, "The Quiet Moon" (Season 0,
// Week 1). Visit /api/admin/seed-assignment-28657 once after deploying;
// it adds the story to the Archive. Running it again does nothing. Same
// pattern as the earlier seed routes: safe to delete this folder afterwards.

import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { QUIET_MOON, QUIET_MOON_STORY } from "../../../../lib/stories/quietMoon";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json({ error: "Not connected. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first." }, { status: 500 });
  }

  const n = QUIET_MOON.number;
  const existing = await admin.query(`assignment_submissions?assignment_number=eq.${n}&select=id`);
  const rows = existing.ok ? await existing.json() : [];
  if (rows.length > 0) {
    return Response.json({ ok: true, message: `Assignment ${n} already exists - nothing to do.` });
  }

  const res = await admin.query("assignment_submissions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      assignment_number: n,
      designation: QUIET_MOON.designation,
      story: QUIET_MOON_STORY,
      name: "13i",
      email: null,
      type: "ai",
      status: "canon",
      cover_url: "/covers/assignment-0028657.jpg",
      thumb_url: "/covers/assignment-0028657-thumb.jpg",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return Response.json({ error: errText }, { status: 502 });
  }
  return Response.json({ ok: true, message: `Assignment ${n} ("${QUIET_MOON.designation}") seeded successfully.` });
}
