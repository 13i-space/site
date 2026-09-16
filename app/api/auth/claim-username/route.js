// Lets an already-signed-in user (identified by their own session cookie,
// not the admin key) claim a username if they don't have one yet - this
// covers accounts created before the profiles table existed, or anyone
// who originally signed in via the magic-link flow, which never touches
// this table.

import { createClient } from "../../../../lib/supabaseServer";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "You need to be signed in." }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json({ error: "Accounts aren't connected yet." }, { status: 500 });
  }

  const { username } = await request.json();
  if (!username || !USERNAME_RE.test(username)) {
    return Response.json({ error: "Username must be 3-20 characters: letters, numbers, underscores only." }, { status: 400 });
  }

  const existing = await admin.query(`profiles?username=eq.${encodeURIComponent(username)}&select=id`);
  const existingRows = existing.ok ? await existing.json() : [];
  if (existingRows.length > 0) {
    return Response.json({ error: "That username is taken." }, { status: 409 });
  }

  const res = await admin.query("profiles", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ id: user.id, username }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return Response.json({ error: `Could not save username: ${errText}` }, { status: 500 });
  }

  return Response.json({ ok: true });
}
