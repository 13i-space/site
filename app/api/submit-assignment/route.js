// In-house storage: submissions are written straight to Supabase (the
// same database already used for the guestbook), so there's no extra
// service or API key to track just for this. To view submissions, open
// the Supabase dashboard -> Table Editor -> assignment_submissions.
//
// Setup: docs/v3-community-setup.sql (base table) and
// docs/v3.1-assignment-protocol.sql (the guided-builder fields + status
// column added here) need to have been run in Supabase's SQL Editor.

import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json(
      { error: "Submissions aren't connected yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  const { name, email, story, designation, origin, destination, era, category, objective } = await request.json();
  if (!story || story.trim().length < 10) {
    return Response.json({ error: "Please write a bit more before submitting." }, { status: 400 });
  }

  const res = await supabase.query("assignment_submissions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      name: (name || "Anonymous").slice(0, 60),
      email: email ? email.slice(0, 200) : null,
      story: story.trim(),
      designation: designation ? designation.slice(0, 120) : null,
      origin: origin ? origin.slice(0, 120) : null,
      destination: destination ? destination.slice(0, 120) : null,
      era: era ? era.slice(0, 120) : null,
      category: category || null,
      objective: objective ? objective.slice(0, 400) : null,
      status: "submitted",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return Response.json({ error: `Could not save submission: ${errText}` }, { status: 502 });
  }

  return Response.json({ ok: true });
}
