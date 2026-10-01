"use client";
import { useEffect } from "react";
import { getStoryBrowserClient, storyConfigured } from "../../../lib/story/storySupabase";

// When someone arrives from a sign-in link (the founder handoff, an email
// confirmation), the session arrives in the URL. Creating the Story client
// picks it up; then tidy the address bar.
export default function SessionCatcher() {
  useEffect(() => {
    if (!storyConfigured) return;
    const h = window.location.hash || "";
    if (!/access_token=|error_description=/.test(h)) return;
    const sb = getStoryBrowserClient();
    sb.auth.getSession().finally(() => {
      try { window.history.replaceState(null, "", window.location.pathname + window.location.search); } catch {}
    });
  }, []);
  return null;
}
