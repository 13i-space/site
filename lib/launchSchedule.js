// Upcoming rocket launches (Update 6.24), for Mission Control and page 3 of
// the Galactic Gazette. From The Space Devs' Launch Library 2: public, no key,
// no account. Free use is 15 requests an hour; this is fetched on the server
// and cached by Next for LAUNCH_REFRESH_SECONDS, so visitors never call it and
// the site stays far under that limit however busy it gets.
//
// If the schedule can't be reached (down, rate-limited, changed format) this
// returns [] and both pages show a quiet "schedule unavailable" line instead.

export const LAUNCH_REFRESH_SECONDS = 900;
const URL = "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=10&mode=normal";

const str = (v) => (typeof v === "string" ? v : "");

function tidy(l) {
  const full = str(l.name);
  const [rocketPart, missionPart] = full.split(" | ");
  const net = str(l.net) || str(l.window_start);
  if (!full || !net || isNaN(Date.parse(net))) return null;
  const provider = str(l.launch_service_provider?.name) || str(l.lsp_name);
  const pad = typeof l.pad === "string" ? l.pad : str(l.pad?.name);
  const location = typeof l.location === "string" ? l.location : str(l.pad?.location?.name);
  return {
    id: str(l.id) || full + net,
    rocket: str(l.rocket?.configuration?.full_name) || str(l.rocket?.configuration?.name) || (rocketPart || full).trim(),
    mission: str(l.mission?.name) || (missionPart || "").trim(),
    description: str(l.mission?.description).slice(0, 240),
    net,
    status: str(l.status?.abbrev) || str(l.status?.name),
    statusName: str(l.status?.name),
    provider,
    pad,
    location,
    live: !!l.webcast_live,
  };
}

export async function getLaunches() {
  try {
    const res = await fetch(URL, {
      next: { revalidate: LAUNCH_REFRESH_SECONDS },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const cutoff = Date.now() - 2 * 3600 * 1000; // drop anything well past
    return (Array.isArray(data?.results) ? data.results : [])
      .map((l) => { try { return tidy(l); } catch (e) { return null; } })
      .filter((l) => l && Date.parse(l.net) > cutoff)
      .sort((a, b) => Date.parse(a.net) - Date.parse(b.net));
  } catch (e) {
    return [];
  }
}
