// In-house storage: submissions are written straight to Supabase (the
// same database already used for the guestbook), so there's no extra
// service or API key to track just for this. To view submissions, open
// the Supabase dashboard -> Table Editor -> assignment_submissions.
//
// One-time setup: run this in Supabase's SQL Editor to create the table
// (see the README or ask Claude for the exact statement again if needed):
//
// create table assignment_submissions (
//   id uuid primary key default gen_random_uuid(),
//   name text,
//   email text,
//   story text not null,
//   created_at timestamptz not null default now()
// );
// alter table assignment_submissions enable row level security;
// -- no policies added on purpose: only the server, using the service
// -- role key, can read or write this table.

import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json(
      { error: "Submissions aren't connected yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  const { name, email, story } = await request.json();
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
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return Response.json({ error: `Could not save submission: ${errText}` }, { status: 502 });
  }

  return Response.json({ ok: true });
}
