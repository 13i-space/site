// Paul's recorded note for Aaron's briefing, stored in the 13i Supabase project's
// Storage (private bucket "story-brief"). SERVER ONLY: uses the service-role key.
import { getSupabaseAdmin } from "../supabaseAdmin";

export const BUCKET = "story-brief";
const H = (key, extra = {}) => ({ apikey: key, Authorization: `Bearer ${key}`, ...extra });

export async function ensureBucket(admin) {
  try {
    await fetch(`${admin.url}/storage/v1/bucket`, {
      method: "POST",
      headers: H(admin.serviceKey, { "Content-Type": "application/json" }),
      body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false }),
    });
  } catch {}
}

export async function signUpload(admin, path) {
  const res = await fetch(`${admin.url}/storage/v1/object/upload/sign/${BUCKET}/${path}`, {
    method: "POST",
    headers: H(admin.serviceKey, { "Content-Type": "application/json", "x-upsert": "true" }),
    body: "{}",
  });
  if (!res.ok) throw new Error(`sign upload ${res.status}: ${await res.text()}`);
  const j = await res.json();
  return `${admin.url}/storage/v1${j.url}`;
}

export async function writeMeta(admin, meta) {
  const res = await fetch(`${admin.url}/storage/v1/object/${BUCKET}/note.json`, {
    method: "POST",
    headers: H(admin.serviceKey, { "Content-Type": "application/json", "x-upsert": "true", "cache-control": "no-cache" }),
    body: JSON.stringify(meta),
  });
  if (!res.ok) throw new Error(`write meta ${res.status}`);
}

export async function removeMeta(admin) {
  await fetch(`${admin.url}/storage/v1/object/${BUCKET}`, {
    method: "DELETE",
    headers: H(admin.serviceKey, { "Content-Type": "application/json" }),
    body: JSON.stringify({ prefixes: ["note.json"] }),
  });
}

// The current note, with a short-lived URL to play it (or null).
export async function getNote() {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  try {
    const res = await fetch(`${admin.url}/storage/v1/object/${BUCKET}/note.json`, { headers: H(admin.serviceKey), cache: "no-store" });
    if (!res.ok) return null;
    const meta = await res.json();
    if (!meta?.path) return null;
    const s = await fetch(`${admin.url}/storage/v1/object/sign/${BUCKET}/${meta.path}`, {
      method: "POST",
      headers: H(admin.serviceKey, { "Content-Type": "application/json" }),
      body: JSON.stringify({ expiresIn: 60 * 60 * 6 }),
      cache: "no-store",
    });
    if (!s.ok) return null;
    const j = await s.json();
    const signed = j.signedURL || j.signedUrl;
    return { ...meta, src: `${admin.url}/storage/v1${signed}` };
  } catch {
    return null;
  }
}
