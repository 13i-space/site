import { BASE, albums, parseTrack } from "../../../../lib/musicReleases";

// Serves Paul's songs from 13i.space's own address (/api/track/<name>.mp3),
// passing them straight through from where they're hosted. Same-address
// audio is what lets the browser measure the music so Lyra can dance to it
// (lib/lyraMusic.js) - audio from another site can only be measured if that
// site allows it. Only the tracks listed in lib/musicReleases.js are served.
export const runtime = "edge";

const ALLOWED = new Set(albums.flatMap((a) => a.tracks.map((t) => parseTrack(t).file)));

export async function GET(request, { params }) {
  const name = decodeURIComponent(params.file || "").replace(/\.mp3$/i, "");
  if (!ALLOWED.has(name)) return new Response("Not found", { status: 404 });

  const headers = {};
  const range = request.headers.get("range");
  if (range) headers.Range = range; // seeking and streaming

  let upstream;
  try {
    upstream = await fetch(`${BASE}${name}.mp3`, { headers });
  } catch (e) {
    return new Response("Track unavailable", { status: 502 });
  }
  if (!upstream.ok && upstream.status !== 206) return new Response("Track unavailable", { status: upstream.status === 404 ? 404 : 502 });

  const out = new Headers();
  ["content-type", "content-length", "content-range", "accept-ranges", "last-modified", "etag"].forEach((h) => {
    const v = upstream.headers.get(h);
    if (v) out.set(h, v);
  });
  if (!out.get("content-type")) out.set("content-type", "audio/mpeg");
  if (!out.get("accept-ranges")) out.set("accept-ranges", "bytes");
  out.set("cache-control", "public, max-age=86400");
  return new Response(upstream.body, { status: upstream.status, headers: out });
}
