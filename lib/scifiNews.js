// The Galactic Gazette, page two (Update 5.66): sci-fi entertainment -
// movies, TV and streaming, books, and music - from public RSS feeds (no
// keys, no accounts), read the same way as page one (lib/spaceNews.js).
// Two feeds are genre-only; the general ones are filtered to science
// fiction. Each story is filed under a section by what it's about.

import { fetchSource, previewImage } from "./spaceNews";

export const SCIFI_SOURCES = [
  { name: "io9", url: "https://gizmodo.com/io9/rss" },
  { name: "Reactor", url: "https://reactormag.com/feed/" },
  { name: "Den of Geek", url: "https://www.denofgeek.com/feed/" },
  { name: "/Film", url: "https://www.slashfilm.com/feed/" },
];

export const SCIFI_SECTIONS = [
  { id: "film", section: "At the Pictures", note: "sci-fi on the big screen", re: /\b(movie|movies|film|films|box office|trailer|director|cinema|theat(er|re)s?|sequel|reboot|remake|blockbuster)\b/i },
  { id: "tv", section: "On the Small Screens", note: "television and streaming", re: /\b(series|season|episode|episodes|show|shows|tv|netflix|prime video|disney\+|hulu|apple tv|paramount\+|peacock|hbo max|hbo|streaming|showrunner|renewed|cancell?ed)\b/i },
  { id: "books", section: "The Bookshelf", note: "novels, stories and comics", re: /\b(book|books|novel|novels|novella|author|authors|publish(er|ed|ing)?|anthology|short stor(y|ies)|comic|comics|graphic novel)\b/i },
  { id: "music", section: "The Sound Stage", note: "scores, soundtracks and synths", re: /\b(soundtrack|score|composer|album|song|songs|music|musical|synth|synthwave|band|singer|concert|vinyl)\b/i },
];

// what counts as science fiction (the genre feeds also carry fantasy and horror)
const SCIFI = new RegExp([
  "sci-?fi", "science fiction", "space", "spaceship", "starship", "alien", "aliens", "galaxy", "galactic", "planet", "cosmic", "interstellar",
  "star wars", "star trek", "dune", "stargate", "doctor who", "the expanse", "foundation", "blade runner", "predator", "terminator", "the matrix",
  "avatar", "robot", "android", "cyborg", "\\bai\\b", "artificial intelligence", "time travel", "time-travel", "cyberpunk", "dystopia", "dystopian",
  "post-apocalyptic", "apocalypse", "mars", "martian", "moon", "mandalorian", "andor", "godzilla", "kaiju", "x-files", "black mirror", "fallout",
  "three-body", "3 body", "battlestar", "halo", "mass effect", "extraterrestrial", "\\bufo", "first contact", "multiverse", "clone", "mecha",
  "severance", "silo", "for all mankind", "tron", "jurassic", "invasion", "orbit", "astronaut", "nasa", "the martian", "arrival", "interstellar",
].join("|"), "i");

const MAX_PER_SECTION = 9;

export async function getSciFiPaper() {
  const results = await Promise.all(SCIFI_SOURCES.map((s) => fetchSource(s, 30)));
  const seen = new Set();
  const all = results.flat()
    .filter((a) => (seen.has(a.link) ? false : seen.add(a.link)))
    .filter((a) => SCIFI.test(`${a.title} ${a.summary}`))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  // file each story under the first section whose words it uses (the title counts first)
  const sections = SCIFI_SECTIONS.map((s) => ({ ...s, articles: [] }));
  // filed music first, then books, TV, film: a soundtrack story mentions its film, not the reverse
  const order = ["music", "books", "tv", "film"].map((id) => sections.find((s) => s.id === id));
  for (const a of all) {
    const sec = order.find((s) => s.re.test(a.title)) || order.find((s) => s.re.test(a.summary));
    if (sec && sec.articles.length < MAX_PER_SECTION) sec.articles.push(a);
  }
  const live = sections.filter((s) => s.articles.length);
  const missing = live.flatMap((s) => s.articles.slice(0, 2).filter((a) => !a.image)).slice(0, 8);
  await Promise.all(missing.map(async (a) => { a.image = await previewImage(a.link); }));
  for (const s of live) {
    const k = s.articles.findIndex((a) => a.image);
    if (k > 0) s.articles.unshift(...s.articles.splice(k, 1));
  }
  const filed = live.flatMap((s) => s.articles).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const lead = filed.find((a) => a.image) || filed[0] || null;
  return { sections: live, lead, count: filed.length };
}
