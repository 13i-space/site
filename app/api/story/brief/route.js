import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabaseServer";
import { isBriefUser } from "../../../../lib/story/briefAccess";
import { GUIDANCE_KEYS, STATUSES } from "../../../../lib/story/briefContent";

// Saves one answer from the Guidance Needed section of /story/aaron.
// Uses the signed-in 13i account (row level security: each person can only
// write their own rows). Needs docs/v5.23-story-brief.sql run in Supabase.
export const dynamic = "force-dynamic";

const json = (body, status = 200) => NextResponse.json(body, { status });

export async function POST(request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return json({ error: "Saving isn't set up yet." }, 503);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Bad request." }, 400);
  }
  const key = String(body?.key || "");
  const status = body?.status == null || body.status === "" ? null : String(body.status);
  const answer = typeof body?.answer === "string" ? body.answer.slice(0, 6000) : "";
  if (!GUIDANCE_KEYS.includes(key)) return json({ error: "Unknown question." }, 400);
  if (status && !STATUSES[status]) return json({ error: "Unknown choice." }, 400);

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: "Please sign in again." }, 401);
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
    if (!isBriefUser(profile?.username)) return json({ error: "Not found." }, 404);

    const { error } = await supabase.from("story_brief_answers").upsert(
      { user_id: user.id, username: profile.username, item_key: key, status, answer, updated_at: new Date().toISOString() },
      { onConflict: "user_id,item_key" }
    );
    if (error) {
      console.error("story brief save:", error);
      const missing = error.code === "42P01" || /does not exist|schema cache/i.test(error.message || "");
      return json({ error: missing ? "Saving isn't set up yet (the database table is missing)." : "Couldn't save just now. Try again in a moment." }, 500);
    }
    return json({ ok: true, savedAt: new Date().toISOString() });
  } catch (e) {
    console.error("story brief save failed:", e);
    return json({ error: "Couldn't save just now. Try again in a moment." }, 500);
  }
}
