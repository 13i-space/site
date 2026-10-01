import { NextResponse } from "next/server";
import { createClient } from "../../../../../lib/supabaseServer";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";
import { isSentinelUser } from "../../../../../lib/sentinel";
import { ensureBucket, signUpload, writeMeta, removeMeta } from "../../../../../lib/story/briefNote";

// Paul's note for Aaron. Only Paul's Sentinel accounts can record or remove it.
// POST { action: "sign", ext }            -> { uploadUrl, path }   (browser uploads straight to Storage)
// POST { action: "commit", path, kind, type } -> saves it as the current note
// POST { action: "remove" }               -> takes the note down
export const dynamic = "force-dynamic";
const json = (b, s = 200) => NextResponse.json(b, { status: s });

export async function POST(request) {
  const admin = getSupabaseAdmin();
  if (!admin) return json({ error: "Storage isn't set up (SUPABASE_SERVICE_ROLE_KEY)." }, 503);
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: "Please sign in." }, 401);
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
    if (!isSentinelUser(profile?.username)) return json({ error: "Not found." }, 404);

    const body = await request.json().catch(() => ({}));
    if (body.action === "sign") {
      const ext = /^(webm|mp4|m4a|mp3|mov|ogg|wav)$/.test(body.ext) ? body.ext : "webm";
      await ensureBucket(admin);
      const path = `note-${Date.now()}.${ext}`;
      return json({ uploadUrl: await signUpload(admin, path), path });
    }
    if (body.action === "commit") {
      if (!/^note-\d+\.[a-z0-9]+$/.test(String(body.path))) return json({ error: "Bad path." }, 400);
      await writeMeta(admin, { path: body.path, kind: body.kind === "audio" ? "audio" : "video", type: String(body.type || "").slice(0, 80), at: new Date().toISOString() });
      return json({ ok: true });
    }
    if (body.action === "remove") {
      await removeMeta(admin);
      return json({ ok: true });
    }
    return json({ error: "Unknown action." }, 400);
  } catch (e) {
    console.error("Brief note:", e);
    return json({ error: "Couldn't save the note. Try again." }, 500);
  }
}
