// Story of Self uses its OWN Supabase project, completely separate from 13i's.
// Its keys live in Vercel as:
//   NEXT_PUBLIC_STORY_SUPABASE_URL
//   NEXT_PUBLIC_STORY_SUPABASE_ANON_KEY   (the "anon" or "publishable" key)
// The session is stored under its own name, so a 13i login and a Story login
// never see each other.
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_STORY_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_STORY_SUPABASE_ANON_KEY;

export const storyConfigured = Boolean(URL && KEY);

let browserClient = null;

// Browser: one shared client per page load (null if not configured yet).
export function getStoryBrowserClient() {
  if (!storyConfigured) return null;
  if (!browserClient) {
    browserClient = createClient(URL, KEY, {
      auth: { storageKey: "story-of-self-auth", persistSession: true, autoRefreshToken: true },
    });
  }
  return browserClient;
}

// Server: a client acting AS the signed-in student (row level security applies),
// built from the access token the browser sends. Returns { supabase, user } or null.
export async function getStoryUserFromRequest(request) {
  if (!storyConfigured) return null;
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;
  try {
    const supabase = createClient(URL, KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return null;
    return { supabase, user: data.user };
  } catch (e) {
    return null;
  }
}
