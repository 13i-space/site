"use client";

import { useEffect } from "react";

// Update 5.66: a sign-in or password-reset link that lands on the countdown
// page (Supabase's fallback) carries its token in the URL hash
// (#access_token=...&type=recovery). Send it where it belongs.
export default function AuthLinkForwarder() {
  useEffect(() => {
    const h = window.location.hash || "";
    if (!/access_token=|type=recovery|error_description=/.test(h)) return;
    if (/type=recovery/.test(h)) window.location.replace(`/account/reset-password${h}`);
    else if (/access_token=/.test(h)) window.location.replace(`/account${h}`);
    else window.location.replace(`/login?error=auth_failed`);
  }, []);
  return null;
}
