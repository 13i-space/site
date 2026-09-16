// A separate, dedicated callback URL just for the password-recovery link,
// so it can be added to Supabase's redirect allow-list as one simple
// exact string - no query-string/wildcard matching involved, which is
// what was silently failing before (Supabase falls back to the Site URL
// - the countdown page - whenever a redirect URL doesn't cleanly match
// the allow-list).

import { createClient } from "../../../lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/account/reset-password`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
