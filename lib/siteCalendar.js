// The 13i calendar (Update 5.56): every event on the site's schedule, for
// Sentinel-X (/sentinel-x and /sentinel-x/calendar) and, later, the social
// media calendar. Generated from rules, not typed in by hand, so it runs
// on by itself: change a rule here and every week follows.
//
// Four kinds, colour-coded everywhere they show:
//   once     one-time events (beta, launch)
//   weekly   the release week (story Monday ... Smash Saturday)
//   monthly  each month's single: song on the 6th, video on the 13th,
//            extended version on the 26th (lib/musicReleases.js)
//   season   first and last day of each 13-week season
//
// Seasons (13 weeks = 91 days): the Season 1 beta starts 1 Jan 2027; the
// public Season 1 starts at launch, 6 Apr 2027; each following season
// starts the day after the last one ends.

import { releaseSchedule } from "./musicReleases";
import { SEASONS } from "./seasons";

export const KINDS = {
  once: { label: "One-time", color: "#E9D29A" },
  weekly: { label: "Weekly", color: "#8B95F6" },
  monthly: { label: "Monthly", color: "#E8B4C8" },
  season: { label: "Seasonal (13 weeks)", color: "#6FC3A8" },
};

const DAY = 86400000;
const iso = (d) => d.toISOString().slice(0, 10);
const utc = (s) => new Date(`${s}T00:00:00Z`);

// The seasons the calendar knows about, in order.
export function seasonRuns() {
  const runs = [{ name: "Season 1 · beta", start: utc("2027-01-01") }, { name: "Season 1", start: utc("2027-04-06") }];
  let n = 2, start = new Date(runs[1].start.getTime() + 91 * DAY);
  while (start.getUTCFullYear() < 2029) {
    runs.push({ name: `Season ${n}`, start });
    start = new Date(start.getTime() + 91 * DAY);
    n += 1;
  }
  return runs.map((r) => ({ ...r, end: new Date(r.start.getTime() + 90 * DAY) }));
}

// Which season a date falls in, or null - and its release week: weeks run
// Monday to Sunday from the season's first Monday (the beta starts on a
// Friday, so its days before that Monday are week 0: no story yet).
export function seasonAt(date) {
  const t = utc(iso(date)).getTime();
  for (const r of seasonRuns()) {
    if (t >= r.start.getTime() && t <= r.end.getTime()) {
      const firstMon = r.start.getTime() + ((8 - r.start.getUTCDay()) % 7) * DAY;
      const week = t >= firstMon ? Math.floor((t - firstMon) / (7 * DAY)) + 1 : 0;
      return { ...r, week };
    }
  }
  return null;
}

// What runs on each weekday, every week of the year.
const WEEKLY = {
  1: [
    { title: "New AI short story", note: "the week's story is published" },
    { title: "Added to the universe", note: "its world goes on the Galaxy Map, its species into Aliens of the Galaxy" },
    { title: "Music Monday", note: "coming later: something with the Signal Composer" },
  ],
  2: [{ title: "Ebook release", note: "the week's story as an ebook" }],
  3: [
    { title: "Interactive Assignment", note: "the week's story, told so you choose" },
    { title: "Writing Wednesday", note: "a prompt to get the Kin writing" },
  ],
  4: [{ title: "Audio version", note: "the narrated story" }],
  5: [{ title: "The game", note: "the week's story game unlocks" }],
  6: [{ title: "Smash Saturday", note: "a bracket tournament of every alien card made that week" }],
};

// Every event between two dates (inclusive), sorted.
export function eventsBetween(from, to) {
  const out = [];
  const a = utc(iso(from)), b = utc(iso(to));
  const add = (date, kind, title, note, extra = {}) => out.push({ date: iso(date), kind, title, note, ...extra });

  // one-time
  [
    ["2027-01-01", "Beta launch", "Season 1 opens for Beta Kin"],
    ["2027-01-01", "Social media launch", "13i's social channels go live"],
    ["2027-04-06", "Launch", "13i opens to everyone: the book, the first signal, Season 1"],
  ].forEach(([d, t, n]) => { const x = utc(d); if (x >= a && x <= b) add(x, "once", t, n); });

  // monthly: each month's single has three dates (Update 5.57)
  //   6th   the song is released
  //   13th  its video (13, for 13i)
  //   26th  the extended version: 26 = 2 x 13, and it ends in 6, so it is
  //         the other two dates folded into one number
  releaseSchedule().forEach((r, i) => {
    const y = 2027 + Math.floor((3 + i) / 12), m = (3 + i) % 12;
    [
      [6, `Song release: ${r.title}`, r.album],
      [13, `Music video: ${r.title}`, `the video for this month's single · ${r.album}`],
      [26, `Extended version: ${r.title}`, `the long cut of this month's single · ${r.album}`],
    ].forEach(([day, t, n]) => {
      const x = new Date(Date.UTC(y, m, day));
      if (x >= a && x <= b) add(x, "monthly", t, n);
    });
  });

  // seasonal: first and last days
  seasonRuns().forEach((r) => {
    if (r.start >= a && r.start <= b) add(r.start, "season", `${r.name} begins`, "new version of SpaceCore launches");
    if (r.end >= a && r.end <= b) {
      add(r.end, "season", `${r.name} finale`, "the season's artifact fragments come together");
      add(r.end, "season", "Tournament of Champions", "the 13 Smash Saturday winners compete");
    }
  });

  // weekly, from the first beta week on
  const weeklyFrom = utc("2027-01-01");
  for (let t = Math.max(a.getTime(), weeklyFrom.getTime()); t <= b.getTime(); t += DAY) {
    const d = new Date(t);
    const items = WEEKLY[d.getUTCDay()];
    if (!items) continue;
    const s = seasonAt(d);
    const week = s && s.week >= 1 && s.week <= 13 ? s.week : 0;
    // the story of that release week, where Season 1's weeks are built
    const story = week && s.name.startsWith("Season 1") ? SEASONS[0]?.weeks?.find((w) => w.week === week) : null;
    items.forEach((it) => {
      const storyPiece = /story|universe|Ebook|Interactive|Audio|game/i.test(it.title);
      if (storyPiece && !week) return; // no story week has started yet
      add(d, "weekly", it.title, story && storyPiece ? `${it.note} · week ${week}: ${story.title}` : it.note, week ? { season: `${s.name} · week ${week}` } : {});
    });
  }

  const order = { once: 0, season: 1, monthly: 2, weekly: 3 };
  return out.sort((x, y) => x.date.localeCompare(y.date) || order[x.kind] - order[y.kind]);
}
