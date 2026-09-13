import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json({ error: "not_connected" }, { status: 200 });
  }
  const res = await supabase.query(
    "guestbook?select=id,name,message,created_at&order=created_at.desc&limit=50"
  );
  if (!res.ok) {
    return Response.json({ error: "Could not load guestbook entries." }, { status: 502 });
  }
  const data = await res.json();
  return Response.json({ entries: data });
}

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json(
      { error: "The guestbook isn't connected yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  const { name, message } = await request.json();
  if (!message || message.trim().length < 2) {
    return Response.json({ error: "Write a little something first." }, { status: 400 });
  }
  if (message.length > 500) {
    return Response.json({ error: "Keep it under 500 characters." }, { status: 400 });
  }

  const res = await supabase.query("guestbook", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      name: (name || "Anonymous").slice(0, 60),
      message: message.trim(),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return Response.json({ error: `Could not save entry: ${errText}` }, { status: 502 });
  }

  return Response.json({ ok: true });
}
