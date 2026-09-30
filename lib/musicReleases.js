// The three albums and their release schedule: one track a month from
// April 6, 2027. Used by the Music page and by Lyra (release news).
export const BASE = "https://tempogoatstudios.com/wp-content/uploads/2026/09/";

export const albums = [
  {
    title: "Signal_Ø",
    year: "Album 1 · Release target April 6, 2027",
    cover: BASE + "Album1-cover-1024x1024.png",
    tracks: [
      "Apprehension",
      "Circadian-Pulse|Circadian Pulse",
      "Disembarkment",
      "Drift|Drift (Can you hear me)",
      "Convergence",
      "Vertigo",
      "Rise",
      "Distant-Moon|Distant Moon",
      "Quantum-Fluctuations|Quantum Fluctuations",
      "Ethereal-Beginnings|Ethereal Beginnings",
      "Introspection",
      "Observer-Effect|Observer Effect",
    ],
  },
  {
    title: "Signal_1",
    year: "Album 2 · Release target April 6, 2028",
    cover: BASE + "Album2-cover-1024x1024.png",
    tracks: [
      "Ominous",
      "Malfunctions-1|Malfunctions",
      "Adaptation",
      "Dark-Energy|Dark Energy",
      "TECHNOlogy",
      "Tranquility|Tranquility (I love you)",
      "Ghost-Particle|Ghost Particle",
      "Proximity-Alert|Proximity Alert",
      "Forbidden",
      "Constellation",
      "Reunification",
      "Sulfuric-Skies|Sulfuric Skies",
    ],
  },
  {
    title: "Signal_∞",
    year: "Album 3 · Release target April 6, 2029",
    cover: BASE + "Album3-cover-1024x1024.png",
    tracks: [
      "Shadow-Operations|Shadow Operations",
      "Autonomous-Covenant|Autonomous Covenant",
      "Rendezvous",
      "Nirvana",
      "Pendulum",
      "Terminal-Lucidity|Terminal Lucidity",
      "Periastron",
      "Untethered",
      "Sentience",
      "Home-World|Home World",
      "Coriolis-Effect|Coriolis Effect",
      "Syntax-Error|Syntax Error",
    ],
  },
];

export function parseTrack(entry) {
  const [file, label] = entry.includes("|") ? entry.split("|") : [entry, entry.replace(/-/g, " ")];
  return { file, label };
}

export function releaseDateFor(globalIndex) {
  const d = new Date(2027, 3, 6); // April 6, 2027, month is 0-indexed
  d.setMonth(d.getMonth() + globalIndex);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}


// Every track in release order, with its date.
export function releaseSchedule() {
  const out = [];
  albums.forEach((album) => album.tracks.forEach((entry) => {
    const i = out.length;
    const d = new Date(2027, 3, 6);
    d.setMonth(d.getMonth() + i);
    out.push({ title: parseTrack(entry).label, album: album.title, date: d.toISOString() });
  }));
  return out;
}

// The next track to be released (null once all 36 are out), and the most
// recent one already released (null before the first).
export function nextRelease(now = new Date()) {
  const next = releaseSchedule().find((r) => new Date(r.date) > now);
  return next ? { ...next, daysAway: Math.ceil((new Date(next.date) - now) / 86400000) } : null;
}
export function latestRelease(now = new Date()) {
  const out = releaseSchedule().filter((r) => new Date(r.date) <= now);
  return out.length ? out[out.length - 1] : null;
}
