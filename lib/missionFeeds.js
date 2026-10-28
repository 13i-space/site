// Mission Control's screens (Update 6.24, reworked in 6.25). This list is the
// whole feed setup: to fix or swap a stream, change a line here.
//
// Every screen has a list of `sources`, tried in order. If one fails (taken
// down, embedding switched off, the live stream ended, or it's a recording
// rather than live), the screen moves on to the next one by itself, and the
// Feeds console shows which one is in use. When every source is out, the
// screen shows the 13i standby view and starts again from the top a minute
// later.
//
// A source is either
//   { video: "<11-character ID from a watch?v= link>" } - one particular stream, or
//   { channel: "<UC... channel ID>" } - whatever that channel is streaming live now.
// Pinned videos are the most reliable; channels go last as a safety net.
//
// `art` is the drawing shown for a channel source on phones, where the small
// screens show stills (lib/missionArt.js). `covers` says which launches the
// screen takes over the main screen for (see feedForLaunch below).

const SEN = "UCkvW_7kp9LJrztmgA4q4bJQ";
const NASA = "UCLA_DiR1FfKNvjuUpBHmylQ";
const NSF = "UCSUu1lih2RifWkKtDOJdsBA"; // NASASpaceflight
const LABPADRE = "UCFwMITSkc1Fms6PoJoh1OUQ"; // LabPadre Space

export const FEEDS = [
  {
    id: "iss",
    code: "ISS-LIVE",
    name: "Earth from the station",
    blurb: "The space station's cameras, around the clock",
    art: "earth",
    sources: [
      { video: "4QJEibrt9B8", label: "ISS 24/7 stream" },
      { video: "M3HKLzjvKPc", label: "NASA official ISS stream" },
      { channel: SEN, label: "Sen 4K (backup)" },
    ],
  },
  {
    id: "orbit4k",
    code: "ORBIT-4K",
    name: "Earth in 4K",
    blurb: "Sen's 4K cameras on the station",
    art: "orbit",
    sources: [
      { channel: SEN, label: "Sen 4K" },
      { video: "M3HKLzjvKPc", label: "NASA official ISS stream" },
      { video: "4QJEibrt9B8", label: "ISS 24/7 stream" },
    ],
  },
  {
    id: "starbase",
    code: "STARBASE",
    name: "Starbase, Texas",
    blurb: "Starship's pads and factory on the Gulf coast",
    art: "dusk",
    covers: { places: ["Texas", ", TX", "Starbase", "Boca Chica"], providers: [] },
    sources: [
      { video: "mhJRzQsLZGg", label: "Starbase live" },
      { channel: NSF, label: "NASASpaceflight" },
      { channel: LABPADRE, label: "LabPadre" },
    ],
  },
  {
    id: "nasa",
    code: "NASA-LIVE",
    name: "NASA live & Starship",
    blurb: "NASA coverage, briefings and Starship",
    art: "earth",
    covers: { places: [], providers: ["NASA", "National Aeronautics"] },
    sources: [
      { video: "Jm8wRjD3xVA", label: "NASA live & Starship" },
      { channel: NASA, label: "NASA" },
    ],
  },
  {
    id: "cape",
    code: "CAPE-CAM",
    name: "Kennedy & the Cape",
    blurb: "The Florida pads, where most launches fly",
    art: "dusk",
    covers: { places: ["Florida", ", FL", "Cape Canaveral", "Kennedy"], providers: [] },
    sources: [
      { channel: LABPADRE, label: "LabPadre Cape Cam" },
      { channel: NSF, label: "NASASpaceflight" },
    ],
  },
];

// Signal mode: the feeds muted, Signal 13i playing over the live view.
export const SIGNAL_TRACKS = [
  ["Apprehension", "Apprehension"],
  ["Circadian-Pulse", "Circadian Pulse"],
  ["Disembarkment", "Disembarkment"],
  ["Drift", "Drift (Can you hear me)"],
  ["Convergence", "Convergence"],
  ["Distant-Moon", "Distant Moon"],
  ["Ethereal-Beginnings", "Ethereal Beginnings"],
  ["Observer-Effect", "Observer Effect"],
].map(([file, title]) => ({ src: `/audio/signal/${file}.mp3`, title }));

export function embedUrl(source, { muted = true, controls = true } = {}) {
  const p = `autoplay=1&mute=${muted ? 1 : 0}&playsinline=1&rel=0&enablejsapi=1&controls=${controls ? 1 : 0}`;
  if (source.video) return `https://www.youtube.com/embed/${source.video}?${p}`;
  return `https://www.youtube.com/embed/live_stream?channel=${source.channel}&${p}`;
}

export function watchUrl(source, videoId) {
  if (videoId || source?.video) return `https://www.youtube.com/watch?v=${videoId || source.video}`;
  return `https://www.youtube.com/channel/${source?.channel}/live`;
}

export function thumbUrl(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault_live.jpg`;
}

// which screen should carry a launch: by where it flies from, then by who
// flies it; null when no screen covers it
export function feedForLaunch(launch) {
  if (!launch) return null;
  const where = `${launch.location || ""} ${launch.pad || ""}`.toLowerCase();
  const who = (launch.provider || "").toLowerCase();
  return FEEDS.find((f) => f.covers?.places.some((p) => where.includes(p.toLowerCase())))
    || FEEDS.find((f) => f.covers?.providers.some((p) => who.includes(p.toLowerCase())))
    || null;
}
