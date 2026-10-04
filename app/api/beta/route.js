import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

// Beta sign-up (Update 5.55): visitors on the countdown page ask to join the
// Season 1 beta (opens January 1, 2027). Each request is kept in the
// `beta_requests` table (docs/v5.55-beta-and-kinbook.sql) and Paul gets an
// email through Resend (https://resend.com) when RESEND_API_KEY is set.
// Either one is enough for the request to count; both is best.
//
//   RESEND_API_KEY     - from resend.com -> API Keys
//   BETA_NOTIFY_TO     - optional, defaults to Paul's address below
//   BETA_NOTIFY_FROM   - optional, defaults to Resend's test sender, which
//                        can only deliver to the Resend account's own email
const NOTIFY_TO = process.env.BETA_NOTIFY_TO || "pjdonaghy@gmail.com";
const NOTIFY_FROM = process.env.BETA_NOTIFY_FROM || "13i Beta <onboarding@resend.dev>";

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export async function POST(request) {
  let body = {};
  try { body = await request.json(); } catch (e) { /* empty body */ }
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim().slice(0, 80);
  const why = String(body.why || "").trim().slice(0, 500);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  let saved = false, already = false, mailed = false;

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
    } catch (e) { /* fall through to email */ }
  }

  const key = process.env.RESEND_API_KEY;
  if (key && !already) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          from: NOTIFY_FROM,
          to: [NOTIFY_TO],
          reply_to: email,
          subject: `13i beta request: ${email}`,
          html:
            `<p>Someone asked to join the 13i Season 1 beta (opens January 1, 2027).</p>` +
            `<p><b>Email:</b> ${escape(email)}<br/>` +
            (name ? `<b>Name:</b> ${escape(name)}<br/>` : "") +
            (why ? `<b>Why:</b> ${escape(why)}<br/>` : "") +
            `<b>When:</b> ${new Date().toUTCString()}</p>` +
            `<p>Reply to this email to answer them directly.</p>`,
        }),
      });
      mailed = res.ok;
    } catch (e) { /* not sent */ }
  }

  if (!saved && !mailed && !already) {
    return Response.json(
      { error: "Beta requests aren't connected yet. Please try again soon." },
      { status: 503 }
    );
  }
  return Response.json({ ok: true, already });
}
