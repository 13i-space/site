import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { createClient } from "../../../lib/supabaseServer";

// The Kinbook (formerly the Guestbook): an ongoing message list from Kin,
// outside the forum. Anyone can read it; only signed-in Kin can write, and
// the name on each message is always their username (Update 5.51).

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json({ error: "not_connected" }, { status: 200 });
  }
  const res = await supabase.query(
    "guestbook?select=id,name,message,created_at&order=created_at.desc&limit=50"
  );
  if (!res.ok) {
    return Response.json({ error: "Could not load the Kinbook." }, { status: 502 });
  }
  const data = await res.json();
  // Old anonymous messages (from before sign-in was required) stay hidden;
  // docs/v5.55-beta-and-kinbook.sql deletes them for good.
  const named = data.filter((e) => e.name && e.name.trim() && !/^anon/i.test(e.name.trim()));
  return Response.json({ entries: named });
}

export async function POST(request) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json(
      { error: "The Kinbook isn't connected yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  // who's writing: a signed-in Kin with a username
  let user = null, username = null;
  try {
    const supabase = await createClient();
    ({ data: { user } } = await supabase.auth.getUser());
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
      username = profile?.username || null;
    }
  } catch (e) {
    user = null;
  }
  if (!user) return Response.json({ error: "Sign in to write in the Kinbook." }, { status: 401 });
  if (!username) return Response.json({ error: "Claim a username on your Node first - it's the name your message goes under." }, { status: 400 });

  const { message } = await request.json();
  if (!message || message.trim().length < 2) {
    return Response.json({ error: "Write a little something first." }, { status: 400 });
  }
  if (message.length > 500) {
    return Response.json({ error: "Keep it under 500 characters." }, { status: 400 });
  }

  const post = (row) => admin.query("guestbook", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  const row = { name: username.slice(0, 60), message: message.trim() };
  // user_id arrives with docs/v5.51-kinbook.sql; until that's run, save without it
  let res = await post({ ...row, user_id: user.id });
  if (!res.ok) res = await post(row);

  if (!res.ok) {
    const errText = await res.text();
    return Response.json({ error: `Could not save your message: ${errText}` }, { status: 502 });
  }

  return Response.json({ ok: true, name: row.name });
}
