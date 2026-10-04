import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

// Beta sign-up (Update 5.55, simplified in 5.57): visitors on the countdown
// page ask to join the Season 1 beta (opens January 1, 2027). Each request is
// kept in the `beta_requests` table (docs/v5.55-beta-and-kinbook.sql) and
// listed on Sentinel-X. No email service: Paul chose to keep it that way.

export async function POST(request) {
  let body = {};
  try { body = await request.json(); } catch (e) { /* empty body */ }
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim().slice(0, 80);
  const why = String(body.why || "").trim().slice(0, 500);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  let saved = false, already = false;

  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const res = await admin.query("beta_requests", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ email, name: name || null, why: why || null }),
      });
      if (res.ok) saved = true;
      else if (res.status === 409) already = saved = true;
    } catch (e) { /* not saved */ }
  }

  if (!saved) {
    return Response.json(
      { error: "Beta requests aren't connected yet. Please try again soon." },
      { status: 503 }
    );
  }
  return Response.json({ ok: true, already });
}
