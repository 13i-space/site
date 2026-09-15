// Creates the auth user (via Supabase's admin API, service-role only,
// server-side) and the matching profiles row in one request, then
// auto-confirms the email so testing isn't blocked on email delivery.
// One-time setup: run this in Supabase's SQL Editor first:
//
// create table profiles (
//   id uuid primary key references auth.users(id) on delete cascade,
//   username text unique not null,
//   created_at timestamptz not null default now()
// );
// alter table profiles enable row level security;
// create policy "profiles are viewable by everyone" on profiles for select using (true);

import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export async function POST(request) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json(
      { error: "Accounts aren't connected yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  const { username, email, password } = await request.json();

  if (!username || !USERNAME_RE.test(username)) {
    return Response.json({ error: "Username must be 3-20 characters: letters, numbers, underscores only." }, { status: 400 });
  }
  if (!email || !email.includes("@")) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  // uniqueness check
  const existing = await admin.query(`profiles?username=eq.${encodeURIComponent(username)}&select=id`);
  const existingRows = existing.ok ? await existing.json() : [];
  if (existingRows.length > 0) {
    return Response.json({ error: "That username is taken." }, { status: 409 });
  }

  // create the auth user directly, pre-confirmed
  const createRes = await fetch(`${admin.url}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: admin.serviceKey,
      Authorization: `Bearer ${admin.serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    }),
  });

  if (!createRes.ok) {
    const errBody = await createRes.json().catch(() => ({}));
    let msg = errBody.msg || errBody.error_description || errBody.error || "Could not create account.";
    if (/already been registered|already exists/i.test(msg)) {
      msg = "That email already has an account (maybe from signing in with a link before). Use \u201cforgot password\u201d on the login page to set a password for it instead.";
    }
    return Response.json({ error: msg }, { status: 400 });
  }

  const user = await createRes.json();

  const profileRes = await admin.query("profiles", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ id: user.id, username }),
  });

  if (!profileRes.ok) {
    // the auth user exists but the profile write failed - surface it
    // rather than leaving a silently username-less account
    const errText = await profileRes.text();
    return Response.json({ error: `Account created, but saving the username failed: ${errText}` }, { status: 500 });
  }

  return Response.json({ ok: true });
}
