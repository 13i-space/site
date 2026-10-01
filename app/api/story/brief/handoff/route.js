import { NextResponse } from "next/server";
import { createClient } from "../../../../../lib/supabaseServer";
import { isBriefUser } from "../../../../../lib/story/briefAccess";
import { getStoryAdmin } from "../../../../../lib/story/storyAdmin";

// One login, not two. From Aaron's briefing (signed in to 13i), create or find
// his Story of Self account with the same email, mark it as a founder account
// (every lesson unlocked, Safety desk), and return a one-time sign-in link that
// lands on the Story launch page. Needs STORY_SUPABASE_SERVICE_ROLE_KEY.
export const dynamic = "force-dynamic";
const json = (b, s = 200) => NextResponse.json(b, { status: s });

export async function POST(request) {
  const admin = getStoryAdmin();
  if (!admin) return json({ fallback: "/story" });
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return json({ fallback: "/story" });
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
    if (!isBriefUser(profile?.username)) return json({ error: "Not found." }, 404);

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://13i.space";
    const { data, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: user.email,
      options: { redirectTo: `${origin}/story` },
    });
    if (error || !data?.properties?.action_link) {
      console.error("Story handoff: generateLink failed", error);
      return json({ fallback: "/story" });
    }
    const storyUser = data.user;
    const firstName = storyUser?.user_metadata?.first_name || String(profile?.username || "").slice(0, 40);
    await admin.auth.admin.updateUserById(storyUser.id, {
      app_metadata: { ...(storyUser.app_metadata || {}), story_founder: true },
      user_metadata: { ...(storyUser.user_metadata || {}), first_name: firstName },
    });
    await admin.from("story_profiles").upsert({ id: storyUser.id, first_name: firstName }, { onConflict: "id" });
    return json({ link: data.properties.action_link });
  } catch (e) {
    console.error("Story handoff failed", e);
    return json({ fallback: "/story" });
  }
}
