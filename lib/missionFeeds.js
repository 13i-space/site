// Mission Control's screens (Update 6.24). This list is the whole feed setup:
// to replace a stream that has gone away, change one line here.
//
// Each feed points at a YouTube CHANNEL, and the screen shows whatever that
// channel is streaming live right now (YouTube's "live_stream?channel=" embed).
// That keeps working when a channel restarts its stream under a new video ID.
// If a channel ever runs several live streams at once and the wrong one shows,
// add `video: "<the video ID from the watch?v= link>"` to pin that one instead.
//
// `art` picks the drawing a monitor shows until a real still is known
// (lib/missionArt.js). `providers` lists launch companies whose launches this
// feed should take over the main screen for (matched against the launch
// schedule's provider names).
export const FEEDS = [
  {
    id: "earth1",
    code: "EARTH-1",
    name: "Earth from the ISS",
    source: "NASA",
    channel: "UCLA_DiR1FfKNvjuUpBHmylQ",
    art: "earth",
    providers: ["NASA", "National Aeronautics"],
  },
  {
    id: "orbit4k",
    code: "ORBIT-4K",
    name: "Earth in 4K",
    source: "Sen · cameras on the ISS",
    channel: "UCkvW_7kp9LJrztmgA4q4bJQ",
    art: "orbit",
    providers: [],
  },
  {
    id: "launchpads",
    code: "PAD-CAMS",
    name: "Launch pads & launches",
    source: "NASASpaceflight",
    channel: "UCSUu1lih2RifWkKtDOJdsBA",
    art: "dusk",
    // NASASpaceflight streams most launches, from every company, so it is
    // also the fallback for any launch no other feed claims.
    providers: ["*"],
  },
];

// The fourth monitor isn't a YouTube channel: it's Signal mode - the feeds
// muted, Signal 13i playing over the live view.
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

export function embedUrl(feed) {
  const params = "autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1";
  if (feed.video) return `https://www.youtube.com/embed/${feed.video}?${params}`;
  return `https://www.youtube.com/embed/live_stream?channel=${feed.channel}&${params}`;
}

export function watchUrl(feed, videoId) {
  if (videoId || feed.video) return `https://www.youtube.com/watch?v=${videoId || feed.video}`;
  return `https://www.youtube.com/channel/${feed.channel}/live`;
}

// which feed should carry a given launch
export function feedForProvider(provider) {
  const p = (provider || "").toLowerCase();
  return FEEDS.find((f) => f.providers.some((x) => x !== "*" && p.includes(x.toLowerCase())))
    || FEEDS.find((f) => f.providers.includes("*"));
}
