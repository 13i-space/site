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
      {
        week: 5,
        assignment: 832040,
        title: "The Borrowed Seconds",
        world: "Ammet",
        cover: "/covers/assignment-0832040.jpg",
        blurb: "A people at the edge of space, and the mind they built to keep them from war. 13i meets them first through their AI - and learns what it has been quietly doing for sixty years.",
        pieces: [
          { kind: "story", day: "Mon", href: "/assignments/832040", note: "Assignment 0832040, the record as written." },
          { kind: "signal", day: "Tue", note: "A planet of voices, inside Concord, the slow hand, the moon station, and nine borrowed seconds." },
          { kind: "interactive", day: "Wed", href: "/assignments/832040/interactive", note: "Go in as 13i. Five records; one is canon." },
          { kind: "species", day: "Thu", note: "The Velani, as 13i recorded them, ready for the Survival Trials." },
          { kind: "game", day: "Fri", href: "/games/rubato", note: "RUBATO: be Concord. Keep them talking without letting them see your hand." },
          { kind: "fragment", day: "Sat", note: "Fragment 05 of 12. Sealed until the season's artifact is found." },
        ],
        fragment: { n: 5, of: 12, sealed: true },
      },
      {
        week: 6,
        assignment: 1346269,
        title: "First Fire",
        world: "Sforzando",
        cover: "/covers/assignment-1346269.jpg",
        blurb: "A spacefaring people with a war-mind that thinks in futures, and one rule: the one who waits is the one who is buried. They fire before 13i finishes arriving. 13i has to survive them before it can reach them.",
        pieces: [
          { kind: "story", day: "Mon", href: "/assignments/1346269", note: "Assignment 1346269, the record as written." },
          { kind: "signal", day: "Tue", note: "Arriving, struck hard, four hundred and twelve stations, in plain sight, the star knotting, the flare, and one word." },
          { kind: "interactive", day: "Wed", href: "/assignments/1346269/interactive", note: "Go in as 13i, under fire. Five records; one is canon." },
          { kind: "species", day: "Thu", note: "The Kesh, as 13i recorded them, ready for the Survival Trials." },
          { kind: "game", day: "Fri", href: "/games/hold-fire", note: "HOLD FIRE: bend their fire away, never return it, and stand in front of the flare." },
          { kind: "fragment", day: "Sat", note: "Fragment 06 of 12. Sealed until the season's artifact is found." },
        ],
        fragment: { n: 6, of: 12, sealed: true },
      },
      {
        week: 7,
        assignment: 2178309,
        title: "The Fermata",
        world: "Fermata",
        cover: "/covers/assignment-2178309.jpg",
        blurb: "A people inside a comet, awake forty days in every 3,100 years, who write a letter to the next waking before they sleep. This waking is their last, and their law says the choice isn't theirs to make.",
        pieces: [
          { kind: "story", day: "Mon", href: "/assignments/2178309", note: "Assignment 2178309, the record as written." },
          { kind: "signal", day: "Tue", note: "Three thousand years, the ice singing, forty days, the letters, the stranger, the council, and one held note." },
          { kind: "interactive", day: "Wed", href: "/assignments/2178309/interactive", note: "Go in as 13i. Five records; one is canon." },
          { kind: "species", day: "Thu", note: "The wakers, as 13i recorded them, ready for the Survival Trials." },
          { kind: "game", day: "Fri", href: "/games/fermata", note: "FERMATA: lean on a comet as lightly as you can, so they wake again." },
          { kind: "fragment", day: "Sat", note: "Fragment 07 of 12. Sealed until the season's artifact is found." },
        ],
        fragment: { n: 7, of: 12, sealed: true },
      },
      {
        week: 8,
        assignment: 3524578,
        title: "The Accord",
        world: "Tutti",
        cover: "/covers/assignment-3524578.jpg",
        blurb: "The fullest world 13i has ever felt, and the smallest people on it, who run it by agreement with two hundred other species. Nothing joins their Accord without answering: what do you give, and what do you take?",
        pieces: [
          { kind: "story", day: "Mon", href: "/assignments/3524578", note: "Assignment 3524578, the record as written." },
          { kind: "signal", day: "Tue", note: "Everything at once, the Great Wood, a tail speaking slowly, the loom-beasts walking, two hundred voices, the unasked, and there you are." },
          { kind: "interactive", day: "Wed", href: "/assignments/3524578/interactive", note: "Go down into the Wood as 13i. Five records; one is canon." },
          { kind: "species", day: "Thu", note: "The Pell, as 13i recorded them, ready for the Survival Trials." },
          { kind: "game", day: "Fri", href: "/games/tutti", note: "TUTTI: keep the Accord, and find out what the vine really is." },
          { kind: "fragment", day: "Sat", note: "Fragment 08 of 12. Sealed until the season's artifact is found." },
        ],
        fragment: { n: 8, of: 12, sealed: true },
      },
      {
        week: 9,
        assignment: 5702887,
        title: "The Ring",
        world: "Ritornello",
        cover: "/covers/assignment-5702887.jpg",
        blurb: "Eleven thousand years ago, one of 13i's manifestations was seen in their sky, and they built a faith around it. Now their telescopes have found it again, and half a world thinks it has come to judge them.",
        pieces: [
          { kind: "story", day: "Mon", href: "/assignments/5702887", note: "Assignment 5702887, the record as written." },
          { kind: "signal", day: "Tue", note: "Forty nights long ago, the round temples, the telegram, the squares, eleven nights at the eyepiece, and the years since Ashet." },
          { kind: "interactive", day: "Wed", href: "/assignments/5702887/interactive", note: "Come back as 13i, and decide how not to be their god. Five records; one is canon." },
          { kind: "species", day: "Thu", note: "The Oduli, as 13i recorded them, ready for the Survival Trials." },
          { kind: "game", day: "Fri", href: "/games/ritornello", note: "RITORNELLO: answer the Ring from the eyepiece on Hal Teru, one more note each time." },
          { kind: "fragment", day: "Sat", note: "Fragment 09 of 12. Sealed until the season's artifact is found." },
        ],
        fragment: { n: 9, of: 12, sealed: true },
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

// The Monday a week's release begins in each run: { beta, launch } as Date
// objects, or null for a season without those dates. Release weeks run
// Monday to Sunday from the first Monday on or after the run starts (the
// beta opens on a Friday, launch on a Tuesday) - the same rule as the
// Sentinel-X calendar (lib/siteCalendar.js).
export function weekDates(season, week) {
  const at = (iso) => {
    if (!iso) return null;
    const d = new Date(`${iso}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + ((8 - d.getUTCDay()) % 7) + (Number(week) - 1) * 7);
    return d;
  };
  return { beta: at(season?.beta), launch: at(season?.launch) };
}
