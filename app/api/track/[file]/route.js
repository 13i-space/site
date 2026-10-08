import { albums, parseTrack, songSrc } from "../../../../lib/musicReleases";

// Update 5.62: the songs now live on 13i.space itself (public/audio/signal),
// so this old address just points the browser there. It used to pass songs
// through from the old Tempo Goat WordPress site, which no longer exists.
// Kept so any old link to /api/track/<name>.mp3 still plays.
const ALLOWED = new Set(albums.flatMap((a) => a.tracks.map((t) => parseTrack(t).file)));

export function GET(request, { params }) {
  const name = decodeURIComponent(params.file || "").replace(/\.mp3$/i, "");
  if (!ALLOWED.has(name)) return new Response("Not found", { status: 404 });
  return Response.redirect(new URL(songSrc(name), request.url), 307);
}
