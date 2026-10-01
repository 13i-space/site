// Story of Self: server-side admin client for the STORY Supabase project.
// Uses STORY_SUPABASE_SERVICE_ROLE_KEY (Vercel env var). SERVER ONLY: import
// from API routes or server components, never from a "use client" file.
import { createClient } from "@supabase/supabase-js";

export function getStoryAdmin() {
  const url = process.env.NEXT_PUBLIC_STORY_SUPABASE_URL;
  const key = process.env.STORY_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

// Founder accounts (Aaron, Paul) get every lesson unlocked and the Safety desk.
// The flag lives in app_metadata, which only the server can set.
export const isFounder = (user) => Boolean(user?.app_metadata?.story_founder);
