// Seasons: thirteen weeks each (one quarter). Weeks 1-12 are a story bundle
// each; week 13 is the finale, where the season's artifact fragments come
// together. Season 1 runs twice (Update 5.55, Paul's plan): first as a
// beta season for Beta Kin from January 1, 2027, then for everyone from
// launch, April 6, 2027 - back-to-back quarters. Its weeks are built ahead
// of time so the whole quarter is ready before the beta begins.
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
    number: 1,
    title: "Season 1",
    subtitle: "beta from January 1, 2027 · everyone from April 6, 2027",
    beta: "2027-01-01",
    launch: "2027-04-06",
    blurb: "Thirteen weeks. Beta Kin go through it first, from January 1, 2027; then it runs again for everyone from launch, April 6. Each week 13i sends back one record, and it arrives six ways: read it, hear it, choose it, collect it, play it, find it. The last week brings the fragments together.",
    weeks: [
      {
        week: 1,
        assignment: 87,
        title: "The Deep Walkers",
        world: "Veyra",
        cover: "/covers/assignment-0000087.jpg",
        blurb: "A clouded world where the stone towers move, and the planet itself is a nervous system. 13i has to learn how to wait.",
        pieces: [
          { kind: "story", day: "Mon", href: "/assignments/87", note: "Assignment 0000087, the record as written." },
          { kind: "signal", day: "Tue", note: "Under the clouds, twelve walkers answering through the stone, the ridge, and the ancestors in the archive." },
          { kind: "interactive", day: "Wed", href: "/assignments/87/interactive", note: "Go down as 13i. Five records; one is canon." },
          { kind: "species", day: "Thu", note: "The Deep Walkers, as 13i recorded them, ready for the Survival Trials." },
          { kind: "game", day: "Fri", href: "/games/deep-signal", note: "13i: The Deep Signal. Follow an impossible transmission across Veyra, and be noticed." },
          { kind: "fragment", day: "Sat", note: "Fragment 01 of 12. Sealed until the season's artifact is found." },
        ],
        fragment: { n: 1, of: 12, sealed: true },
      },
      {
        week: 2,
        assignment: 215783,
        title: "Nerath's Secret",
        world: "Nerath",
        cover: "/covers/assignment-0215783.jpg",
        blurb: "An ocean world, an energy network that steers the sea, and a species with seventeen minds in every body. Some of them disagree.",
        pieces: [
          { kind: "story", day: "Mon", href: "/assignments/215783", note: "Assignment 0215783, the record as written." },
          { kind: "signal", day: "Tue", note: "The descent, the network's pulse, sixteen limbs at once, the rupture, and seventeen minds." },
          { kind: "interactive", day: "Wed", href: "/assignments/215783/interactive", note: "Go down as 13i. Five records; one is canon." },
          { kind: "species", day: "Thu", note: "The Nerathi, as 13i recorded them, ready for the Survival Trials." },
          { kind: "game", day: "Fri", href: "/games/sixteen", note: "SIXTEEN: be Nerathi. Keep a drowning city lit, and learn when to listen to yourself." },
          { kind: "fragment", day: "Sat", note: "Fragment 02 of 12. Sealed until the season's artifact is found." },
        ],
        fragment: { n: 2, of: 12, sealed: true },
      },
      {
        week: 3,
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
          { kind: "fragment", day: "Sat", note: "Fragment 03 of 12. Sealed until the season's artifact is found." },
        ],
        fragment: { n: 3, of: 12, sealed: true },
      },
      {
        week: 4,
        assignment: 514229,
        title: "The Sea of Glass",
        world: "Dacapo",
        cover: "/covers/assignment-0514229.jpg",
        blurb: "A people who grow their memories as rings of glass, and once a generation set them all down but one. 13i, who keeps everything, is asked to do the same.",
        pieces: [
          { kind: "story", day: "Mon", href: "/assignments/514229", note: "Assignment 0514229, the record as written." },
          { kind: "signal", day: "Tue", note: "The red star, the canyon's war, the bright one's first word, and the Return falling like light." },
          { kind: "interactive", day: "Wed", href: "/assignments/514229/interactive", note: "Go down as 13i. Five records; one is canon." },
          { kind: "species", day: "Thu", note: "The returners, as 13i recorded them, ready for the Survival Trials." },
          { kind: "game", day: "Fri", href: "/games/prism", note: "PRISM: turn the crowns and carry the light across the sea, before the white star rises." },
          { kind: "fragment", day: "Sat", note: "Fragment 04 of 12. Sealed until the season's artifact is found." },
        ],
        fragment: { n: 4, of: 12, sealed: true },
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

// The day a week begins in each run: { beta, launch } as Date objects, or
// null for a season without those dates.
export function weekDates(season, week) {
  const at = (iso) => {
    if (!iso) return null;
    const d = new Date(`${iso}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + (Number(week) - 1) * 7);
    return d;
  };
  return { beta: at(season?.beta), launch: at(season?.launch) };
}
