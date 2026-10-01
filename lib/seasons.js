// Seasons: thirteen weeks each (one quarter). Weeks 1-12 are a story bundle
// each; week 13 is the finale, where the season's artifact fragments come
// together. Season 0 is the test season before launch (April 6, 2027).
//
// A week's bundle is one story told six ways. `day` is when each piece is
// meant to open in a real release week; `opens` (YYYY-MM-DD, optional)
// actually gates it on the site - until then its tile says when it opens.
// Leave `opens` off (or in the past) to show everything at once.

export const PIECES = {
  story: { label: "The story", verb: "Read" },
  signal: { label: "The signal", verb: "Listen" },
  interactive: { label: "Interactive Assignment", verb: "Choose" },
  species: { label: "The species card", verb: "Collect" },
  game: { label: "The game", verb: "Play" },
  fragment: { label: "Artifact fragment", verb: "Find" },
};

export const SEASONS = [
  {
    number: 0,
    title: "Season 0",
    subtitle: "the test transmissions",
    blurb: "Before launch, 13i sends a few records early, to see how they land. Season 0 is where the weekly rhythm is being tuned: one story, six ways in.",
    weeks: [
      {
        week: 1,
        assignment: 28657,
        title: "The Quiet Moon",
        world: "Tacet",
        cover: "/covers/assignment-0028657.jpg",
        blurb: "A moon so loud it groans, and in the middle of it, a hole of perfect silence. Something there is eating the noise.",
        pieces: [
          { kind: "story", day: "Mon", href: "/assignments/28657", note: "Assignment 0028657, the record as written." },
          { kind: "signal", day: "Tue", note: "The loud moon, absorbed one layer at a time, and then a language made of touch." },
          { kind: "interactive", day: "Wed", href: "/assignments/28657/interactive", note: "Go down as 13i. Five records; one is canon." },
          { kind: "species", day: "Thu", note: "The holders, as 13i recorded them, ready for the Survival Trials." },
          { kind: "game", day: "Fri", href: "/games/tacet", note: "TACET: be the silence. Keep the young in still water." },
          { kind: "fragment", day: "Sat", note: "Fragment 01 of 12. Sealed until the season's artifact is found." },
        ],
        fragment: { n: 1, of: 12, sealed: true },
      },
    ],
  },
];

export const seasonFor = (n) => SEASONS.find((s) => s.number === Number(n)) || null;
export const weekFor = (season, week) => seasonFor(season)?.weeks.find((w) => w.week === Number(week)) || null;
export const bundleForAssignment = (number) => {
  for (const s of SEASONS) for (const w of s.weeks) if (w.assignment === Number(number)) return { season: s, week: w, href: `/seasons/${s.number}/${w.week}` };
  return null;
};
export const isOpen = (piece, now = new Date()) => !piece.opens || new Date(`${piece.opens}T00:00:00Z`) <= now;
