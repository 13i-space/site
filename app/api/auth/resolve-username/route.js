// Looks up the email address for a username, server-side only, so the
// login form can accept a username and still call Supabase's normal
// (email-based) password sign-in from the browser.

import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(request) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json({ error: "Accounts aren't connected yet." }, { status: 500 });
  }

  const { username } = await request.json();
  if (!username) {
    return Response.json({ error: "Enter a username or email." }, { status: 400 });
  }

  const profileRes = await admin.query(`profiles?username=eq.${encodeURIComponent(username)}&select=id`);
  const rows = profileRes.ok ? await profileRes.json() : [];
  if (rows.length === 0) {
    return Response.json({ error: "No account found with that username." }, { status: 404 });
  }

  const userRes = await fetch(`${admin.url}/auth/v1/admin/users/${rows[0].id}`, {
    headers: {
      apikey: admin.serviceKey,
      Authorization: `Bearer ${admin.serviceKey}`,
    },
  });
  if (!userRes.ok) {
    return Response.json({ error: "No account found with that username." }, { status: 404 });
  }
  const user = await userRes.json();
  return Response.json({ email: user.email });
}
