// Update 5.66: where any sign-in link from Supabase ends up when it doesn't
// arrive at its own callback. Supabase sends a link back to the Site URL
// (the countdown page, "/") whenever the redirect it was asked for isn't on
// its allow-list exactly - e.g. a reset asked for from www.13i.space when
// only 13i.space is listed. The countdown page forwards any ?code= here.
// We exchange it, and if it was a password reset, go to the reset form.

import { createClient } from "../../../lib/supabaseServer";
import { NextResponse } from "next/server";

function isRecovery(session) {
  try {
    const payload = JSON.parse(Buffer.from(session.access_token.split(".")[1], "base64url").toString("utf8"));
    if ((payload.amr || []).some((a) => a && a.method === "recovery")) return true;
  } catch (e) { /* fall through */ }
  const sent = session?.user?.recovery_sent_at ? new Date(session.user.recovery_sent_at).getTime() : 0;
  return sent > 0 && Date.now() - sent < 3 * 60 * 60 * 1000; // asked for a reset in the last 3 hours
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.session) {
        return NextResponse.redirect(`${origin}${isRecovery(data.session) ? "/account/reset-password" : "/account"}`);
      }
    } catch (e) { /* fall through */ }
  }
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
