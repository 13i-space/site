// In-house storage: submissions are written straight to Supabase (the
// same database already used for the guestbook). Requires the writer to
// be logged in - name/email default to their account but can be
// overridden per submission.

import { createClient } from "../../../lib/supabaseServer";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "You need to be logged in to submit an Assignment." }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json(
      { error: "Submissions aren't connected yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  const { name, email, story, title, assignmentNumber, coverUrl } = await request.json();
  if (!story || story.trim().length < 10) {
    return Response.json({ error: "Please write a bit more before submitting." }, { status: 400 });
  }

  const res = await admin.query("assignment_submissions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      name: (name || "Anonymous").slice(0, 60),
      email: (email || user.email || "").slice(0, 200),
      story: story.trim(),
      designation: title ? title.slice(0, 120) : null,
      assignment_number: assignmentNumber || null,
      cover_url: coverUrl || null,
      thumb_url: coverUrl || null,
      type: "human",
      status: "submitted",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return Response.json({ error: `Could not save submission: ${errText}` }, { status: 502 });
  }

  // clear any saved draft now that it's been submitted
  await admin.query(`assignment_drafts?user_id=eq.${user.id}`, { method: "DELETE" });

  return Response.json({ ok: true });
}
