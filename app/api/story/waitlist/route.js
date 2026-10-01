// The launch list. POST { email, first_name?, role?, grad_year?, ref?, source?, website? }
// -> { ok, position, ref_code, already }. Uses the Story service-role key, so the
// list is never readable from a browser.
import { getStoryAdmin } from "../../../../lib/story/storyAdmin";
import { ROLE_IDS } from "../../../../lib/story/waitlist";

export const dynamic = "force-dynamic";
const json = (b, s = 200) => Response.json(b, { status: s });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const code = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => "abcdefghjkmnpqrstuvwxyz23456789"[b % 31]).join("");

async function positionOf(admin, createdAt) {
  const { count } = await admin.from("story_waitlist").select("id", { count: "exact", head: true }).lte("created_at", createdAt);
  return count || null;
}

export async function POST(request) {
  let b = {};
  try { b = await request.json(); } catch {}
  if (b.website) return json({ ok: true, position: null, ref_code: null }); // bots fill the hidden field
  const email = String(b.email || "").trim().toLowerCase().slice(0, 200);
  if (!EMAIL.test(email)) return json({ error: "Please enter a valid email address." }, 400);
  const admin = getStoryAdmin();
  if (!admin) return json({ error: "The list isn't open yet. Please try again soon." }, 503);

  const { data: existing } = await admin.from("story_waitlist").select("ref_code, created_at").eq("email", email).maybeSingle();
  if (existing) return json({ ok: true, already: true, ref_code: existing.ref_code, position: await positionOf(admin, existing.created_at) });

  const year = Number(b.grad_year);
  const row = {
    email,
    first_name: String(b.first_name || "").trim().slice(0, 60) || null,
    role: ROLE_IDS.includes(b.role) ? b.role : "student",
    grad_year: Number.isInteger(year) && year >= 2020 && year <= 2035 ? year : null,
    referred_by: /^[a-z0-9]{4,12}$/.test(String(b.ref || "")) ? String(b.ref) : null,
    source: String(b.source || "").slice(0, 40) || null,
  };
  for (let i = 0; i < 4; i++) {
    const { data, error } = await admin.from("story_waitlist").insert({ ...row, ref_code: code() }).select("ref_code, created_at").single();
    if (!error) return json({ ok: true, ref_code: data.ref_code, position: await positionOf(admin, data.created_at) });
    if (error.code === "23505" && String(error.message).includes("email")) {
      const { data: again } = await admin.from("story_waitlist").select("ref_code, created_at").eq("email", email).maybeSingle();
      if (again) return json({ ok: true, already: true, ref_code: again.ref_code, position: await positionOf(admin, again.created_at) });
    }
    if (error.code !== "23505") return json({ error: error.code === "42P01" ? "The list isn't open yet. Please try again soon." : "Couldn't add you just now. Please try again." }, 500);
  }
  return json({ error: "Couldn't add you just now. Please try again." }, 500);
}
