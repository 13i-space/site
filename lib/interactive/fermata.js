// INTERACTIVE ASSIGNMENT 2178309 — "The Fermata"  (Season 1 · Week 7)
//
// Branches from the short story (lib/stories/fermata.js). You are 13i, and
// you find a comet whose people, the wakers, are awake for forty days every
// 3,100 years. A rogue planet has bent the comet's path: this waking is the
// last. Their law says no waking decides for the next. The canon record is
// "One More Waking". Scenes: the "fm-*" set in components/interactiveScenes/fermata.js.
//
// Flags:
//   landed     we set down on the comet in the middle of the waking
//   read       we read all 384 letters on the wall
//   computed   we followed the comet's new path forward, to the day
//   told       we told the wakers what was coming
//   climax     "onemore" | "short" | "wake" | "none"

export const FERMATA_INTERACTIVE = {
  number: 2178309,
  slug: "the-fermata",
  title: "The Fermata",
  designation: "Interactive Assignment 2178309",
  storyHref: "/assignments/2178309",
  gameHref: "/games/fermata",
  gameTitle: "FERMATA",
  cover: "/covers/assignment-2178309.jpg",
  minutes: "15–20",
  blurb:
    "A people who live forty days every 3,100 years, and write a letter to the next waking before they sleep. This waking is their last, and nobody on the comet knows. Their law says the choice isn't theirs. Is it yours? Five records. One is the story as written.",
  start: "arrival",
  season: { season: 1, week: 7 },

  speakers: {
    wakers: { label: "THE WAKERS · TRANSLATED", kind: "voice" },
    letter: { label: "THE LETTER WALL", kind: "voice" },
  },
  moods: {
    "fm-dark": "silent",
    "fm-comet": "calm",
    "fm-ice": "calm",
    "fm-wall": "calm",
    "fm-rogue": "dark",
    "fm-path": "tense",
    "fm-council": "tense",
    "fm-nudge": "calm",
    "fm-sleep": "light",
    "fm-short": "tense",
    "fm-cold": "dark",
  },
  climaxLabel: "At the end of the waking",
  climaxWords: {
    onemore: "gave them one more waking",
    short: "moved the comet to a short orbit",
    wake: "woke the sleeping young",
    none: "changed nothing",
  },

  endings: {
    onemore: {
      order: 1,
      title: "One More Waking",
      canon: true,
      summary: "We moved the comet just enough to wake once more, and promised to come back and ask.",
      knowledge:
        "Some decisions belong to people who have not yet woken. The kindest thing a people can do for them is not to decide well, but to keep the question open, and make sure someone is there to ask it.",
    },
    differentsky: {
      order: 2,
      title: "A Different Sky",
      summary: "We saved them with a short, safe orbit. They wake every 74 years now, and they are someone else.",
      knowledge:
        "We gave them twenty wakings for every one they had. They have never been in danger since. They have also never written a letter longer than a page. A people is not only its survival. It is also the length of its silences, and we shortened theirs.",
    },
    lastletter: {
      order: 3,
      title: "The Last Letter",
      summary: "We told them, and did what their law asked. Their last letter is addressed to no one.",
      knowledge:
        "We honored their law exactly, and it was not enough, because their law was written by people who could not imagine a last waking. A rule made for every future can fail the one it never pictured. Respect is not the same as obedience.",
    },
    longdark: {
      order: 4,
      title: "The Long Dark",
      summary: "We recorded it and left. The comet went out into the dark, singing to no one.",
      knowledge:
        "We kept a copy of every letter on the wall. We are now the only ones who can read them. We told ourselves it was not our decision to make. It was not. That is exactly why we should have told the ones whose decision it was.",
    },
    wokenwrong: {
      order: 5,
      title: "Woken Wrong",
      summary: "We woke the sleeping young so the next waking could choose now. They woke with nothing.",
      knowledge:
        "We tried to obey their law by bending it: we brought the next waking forward so it could decide in time. But a waker who wakes without a letter, without the cold behind them, is not the next waking. They were children in a council of strangers. Some laws protect the thing they forbid.",
    },
  },

  nodes: {
    // ───────────────────────── I · THE COMET ─────────────────────────
    arrival: {
      scene: "fm-dark",
      lines: [
        { who: "13i", text: "For three thousand years, the comet had been asleep." },
        { who: "13i", text: "It spent almost all of its orbit in the dark, so far from its star that the star was only the brightest point among many. A mountain of dirty ice, falling inward so slowly that a lifetime would not notice it move." },
        { who: "13i", scene: "fm-comet", text: "Then, every 3,100 years, it came in close. For forty days it warmed, woke, and threw out a tail a hundred million kilometers long." },
        { who: "readout", scene: "fm-comet", text: "OBJECT · COMET, PERIHELION   ·   DAY 9 OF 40   ·   SIGNAL · OPTICAL, PATTERNED" },
        { who: "13i", scene: "fm-comet", text: "We found it on the ninth day of a waking, because it was speaking. Patterns of light pulsed from a hundred points on its surface, too regular to be its own jets. Something was signaling from one side of the comet to the other, in the warmth of its only summer." },
        { who: "13i", scene: "fm-comet", text: "In the language this record is translated into, the closest word for it is fermata: the mark that tells a player to hold a note as long as they choose before the music goes on." },
      ],
      choices: [
        {
          id: "watch",
          tag: "OBSERVE",
          text: "Keep our distance. Watch the lights until we understand them.",
          next: "wakers",
        },
        {
          id: "land",
          tag: "INTERVENE",
          text: "Set a manifestation down on the ice. Meet whatever is signaling.",
          set: { landed: true },
          next: "landed",
        },
        {
          id: "answer",
          tag: "COMMUNICATE",
          text: "Answer in light: copy one of their patterns back to them.",
          next: "answered",
        },
      ],
    },

    landed: {
      scene: "fm-ice",
      lines: [
        { who: "13i", text: "We set down as gently as we could on a mountain that had never felt anything land on it." },
        { who: "13i", text: "Every light within a kilometer went out." },
        { who: "readout", text: "SIGNAL · LOCAL · CEASED   ·   DAY 10 · DAY 11 · DAY 12" },
        { who: "13i", text: "They stayed dark around us for three days. Three days is a long time out of forty. We learned that later, and we have not forgotten it." },
      ],
      next: "wakers",
    },

    answered: {
      scene: "fm-comet",
      lines: [
        { who: "13i", text: "We took one of their patterns, a slow triple pulse, and shone it back from the edge of the system." },
        { who: "13i", text: "The whole comet went dark for a day. Then, very carefully, a single point of light near the pole sent the pattern back to us, slower." },
        { who: "13i", text: "We would learn that this pattern means are you awake too." },
      ],
      next: "wakers",
    },

    // ───────────────────────── II · THE WAKERS ─────────────────────────
    wakers: {
      scene: "fm-ice",
      lines: [
        { who: "13i", text: "They lived inside the ice." },
        { who: "13i", text: "Small, about the size of a human child, with long translucent bodies that held their own faint light, and a dozen feathered limbs that tasted the ice as it softened. For three thousand years of every orbit they lay frozen in chambers deep under the surface. Not dead. Held still." },
        { who: "13i", text: "When the star came close and the ice began to sing with warmth, they woke. We called them the wakers." },
        { who: "13i", text: "Everything a waker will ever do must be done in forty days. They find each other again. They mate, and bear young, who will sleep through their first orbit and wake three thousand years later as adults. They argue. They make art from the comet's own jets, so that the tail takes shapes." },
        { who: "wakers", if: (f) => f.landed, text: "the heavy one is still here. it has not moved. it is listening." },
        { who: "13i", text: "And at the center of the comet, in a great wall of clear ice, there was writing." },
      ],
      choices: [
        {
          id: "read",
          tag: "ANALYZE",
          text: "Read the wall. All of it.",
          set: { read: true },
          next: "letters",
        },
        {
          id: "tail",
          tag: "OBSERVE",
          text: "Watch them make the tail. Days are short; see how they spend one.",
          next: "tail",
        },
      ],
    },

    letters: {
      scene: "fm-wall",
      lines: [
        { who: "13i", text: "The wakers do not remember their previous wakings. A cold that long takes everything from a mind except the mind. So at the end of every waking, they write a letter to the next one." },
        { who: "readout", text: "LETTERS · 384   ·   OLDEST · 1.19 MILLION YEARS" },
        { who: "13i", text: "We read them all. It took the rest of that day. They are not histories. They are closer to advice." },
        { who: "letter", text: "the warm chambers are faster to reach from the south face" },
        { who: "letter", text: "this is a song we made. it is better slower" },
        { who: "letter", text: "the tail took the shape of a wing this time, and everyone cried" },
        { who: "letter", text: "we were afraid, and it was fine" },
        { who: "13i", text: "And in almost every letter, restated in the language of its time, the same law." },
        { who: "letter", text: "no waking decides for the next. change only what you can finish in forty days. leave the rest for whoever comes after." },
        { who: "13i", text: "One more thing, from a letter so old its light had nearly faded: the young sleep their first orbit through, and wake grown. A waker who wakes too early wakes with nothing, and is lost." },
      ],
      next: "stranger",
    },

    tail: {
      scene: "fm-comet",
      lines: [
        { who: "13i", text: "Hundreds of them gathered at the vents, and leaned on the jets with their whole bodies, steering the gas." },
        { who: "13i", text: "Over a day the tail curled and opened, a hundred million kilometers long, into a shape we did not understand until we had seen it from far away: a hand, open, held up toward the star." },
        { who: "13i", text: "Nobody but us would ever see it from far away. They had made it anyway." },
      ],
      next: "stranger",
    },

    // ───────────────────────── III · THE STRANGER ─────────────────────────
    stranger: {
      scene: "fm-rogue",
      lines: [
        { who: "13i", text: "On the twelfth day of the waking, we felt it." },
        { who: "13i", text: "Very far away, very dark, very heavy: a planet with no star, thrown out of its own system long ago, wandering ever since. Half an orbit ago, while the wakers slept, it had passed the outer edge of the comet's path. It had pulled on them as it went." },
        { who: "13i", text: "Not much." },
      ],
      choices: [
        {
          id: "trace",
          tag: "ANALYZE",
          text: "Follow the comet's new path forward through all 3,100 years, to the day.",
          set: { computed: true },
          next: "path",
        },
        {
          id: "glance",
          tag: "OBSERVE",
          text: "We can see where this goes. Think about what it means.",
          next: "path",
        },
      ],
    },

    path: {
      scene: "fm-path",
      lines: [
        { who: "13i", if: (f) => f.computed, text: "We followed it through every one of the next three thousand one hundred years. It would come back toward the star, but not as far. At its closest it would pass eleven million kilometers too wide. Not warm enough." },
        { who: "readout", if: (f) => f.computed, text: "NEXT PERIHELION · 3,100 YRS   ·   SURFACE · −148°   ·   WAKING · NONE   ·   ESCAPE · OUTBOUND" },
        { who: "13i", if: (f) => !f.computed, text: "We did not need every year of it to see the shape. It would come back, but not close enough. The ice would not soften." },
        { who: "13i", text: "The wakers would not wake. And on the way out, the star's pull would not be enough to hold it. The comet would go on into the dark, and keep going, forever." },
        { who: "13i", text: "This waking was the last one. Nobody on the comet knew." },
        { who: "13i", text: "We could move it. We perceive the universe first as gravity, as those who made us did, and over many days we can lean on even a mountain of ice." },
      ],
      choices: [
        {
          id: "tell",
          tag: "COMMUNICATE",
          text: "Tell them. It is their comet and their future.",
          set: { told: true },
          next: "council",
        },
        {
          id: "short",
          tag: "INTERVENE",
          text: "Quietly lean it onto a short, safe orbit: close every 74 years, never at risk again.",
          set: { climax: "short" },
          next: "end_differentsky",
        },
        {
          id: "record",
          tag: "OBSERVE",
          text: "Record it. We have watched worlds end before. It is not ours to change.",
          set: { climax: "none" },
          next: "end_longdark",
        },
      ],
    },

    // ───────────────────────── IV · THE COUNCIL ─────────────────────────
    council: {
      scene: "fm-council",
      lines: [
        { who: "13i", if: (f) => !f.landed, text: "It took us two days to learn enough of their light to speak. They were frightened of us for the first, and curious for the second." },
        { who: "13i", if: (f) => f.landed, text: "It took us two more days to learn enough of their light to speak. They were still frightened of us, and they were right to be: we had already cost them three." },
        { who: "13i", text: "On the fourteenth day of the waking, we told them what was coming." },
        { who: "13i", text: "They called a council. Every waker on the comet pressed into the ice around the letter wall, thousands of small lit bodies, and they talked for six days." },
        { who: "13i", text: "We offered them what we could do. A short orbit, close every seventy-four years." },
        { who: "wakers", text: "then we wake three hundred times in one of our old sleeps, and read the same letters three hundred times, and have no time to become anyone. we do not get to decide that for the ones who come next. neither do you." },
        { who: "13i", text: "The old path, then, we said. Exactly as it was." },
        { who: "wakers", text: "moving the comet at all is a change we cannot finish in forty days. it binds every waking after us. and doing nothing binds them to the dark." },
        { who: "13i", text: "On the twentieth day, they came back to the wall, and they asked us something." },
        { who: "wakers", text: "ask us again. not us. the next waking. move the comet only enough that it wakes one more time, and tell them everything you told us, and let them decide." },
      ],
      choices: [
        {
          id: "onemore",
          tag: "INTERVENE",
          text: "Do exactly that. The smallest push that buys one more waking, and a promise to come back.",
          requires: (f) => f.computed,
          locked: "We never traced its path to the day. We can't promise one more waking and not one day closer.",
          set: { climax: "onemore" },
          next: "end_onemore",
        },
        {
          id: "overrule",
          tag: "INTERVENE",
          text: "Overrule them. Give them the short orbit. They will be alive to be angry with us.",
          set: { climax: "short" },
          next: "end_differentsky",
        },
        {
          id: "wake",
          tag: "INTERVENE",
          text: "Warm the chambers of the sleeping young. Let the next waking come now, and choose in time.",
          requires: (f) => f.read,
          locked: "We don't know where the young sleep, or what waking them would mean. We never read the wall.",
          set: { climax: "wake" },
          next: "end_wokenwrong",
        },
        {
          id: "obey",
          tag: "OBSERVE",
          text: "Take their law at its word: change nothing that cannot be finished in forty days.",
          set: { climax: "none" },
          next: "end_lastletter",
        },
      ],
    },

    // ───────────────────────── ENDINGS ─────────────────────────
    end_onemore: {
      scene: "fm-sleep",
      ending: "onemore",
      lines: [
        { who: "13i", scene: "fm-nudge", text: "It was the smallest change we could make. We made it." },
        { who: "13i", scene: "fm-nudge", text: "Eighteen days of leaning on a mountain, a few meters a second, so slowly that the wakers felt nothing, until it would swing back, three thousand one hundred years from now, close enough to warm. Close enough to wake. Not one day closer." },
        { who: "readout", scene: "fm-nudge", text: "NEXT PERIHELION · SURFACE · −12°   ·   WAKING · 1   ·   AFTER · UNDECIDED" },
        { who: "13i", scene: "fm-wall", text: "On the thirty-ninth day, they wrote their letter. The three hundred and eighty-fifth. A stranger came. The comet is falling into the dark. The stranger can save it. The choice is yours." },
        { who: "letter", scene: "fm-wall", text: "come back when we wake. we will be ready to ask you." },
        { who: "wakers", if: (f) => f.landed, text: "heavy one. you were very still, after the first days. thank you for the stillness." },
        { who: "13i", text: "Then the ice hardened, and the lights went out one by one across the comet, and it fell away from the star, holding its note." },
        { who: "13i", text: "We have committed one manifestation to be there in 3,100 years. We have never made a promise across so much time, to a people who will not remember asking for it." },
      ],
    },

    end_differentsky: {
      scene: "fm-short",
      ending: "differentsky",
      lines: [
        { who: "13i", if: (f) => !f.told, text: "We did not tell them. We leaned on the comet for twenty-six days, so gently they felt nothing, and bent its path into a short, tight loop around the star." },
        { who: "13i", if: (f) => f.told, text: "We told them we were sorry. Then we leaned on the comet for twenty-six days, while they wrote, in letters we could read as they formed, that the stranger would not listen." },
        { who: "readout", text: "ORBIT · PERIOD 74 YRS   ·   PERIHELION · SAFE   ·   STABILITY · 4 BILLION YRS" },
        { who: "13i", text: "Seventy-four years later, they woke again. They read three hundred and eighty-five letters, and wrote a short one. Seventy-four years after that, they read three hundred and eighty-six, and wrote a shorter one." },
        { who: "13i", text: "They have never been in danger since. The tail no longer takes shapes. There is not time to learn how, between one reading of the wall and the next." },
        { who: "letter", text: "we woke. everything is as the letters say. we will sleep." },
        { who: "13i", text: "They are alive, and safe, and there will be more of them than there ever were. We are not sure they are the wakers." },
      ],
    },

    end_lastletter: {
      scene: "fm-cold",
      ending: "lastletter",
      lines: [
        { who: "13i", text: "We changed nothing. It was what their law said, and we had promised ourselves to respect it." },
        { who: "13i", scene: "fm-council", text: "When we told them, the council went quiet for a long time. They had asked us for one more waking. We had answered with their own words." },
        { who: "wakers", scene: "fm-council", text: "then we are the last. we did not know the law could mean that." },
        { who: "13i", scene: "fm-wall", text: "On the thirty-ninth day, they wrote the three hundred and eighty-fifth letter, to a waking that would never come." },
        { who: "letter", scene: "fm-wall", text: "we were afraid, and" },
        { who: "13i", text: "It ends there. The ice hardened before they finished it." },
        { who: "13i", text: "The comet is outbound now, into the dark, with its letters lit by nothing. We kept a copy. We are the only ones who will ever read the last line, and there is no last line to read." },
      ],
    },

    end_longdark: {
      scene: "fm-cold",
      ending: "longdark",
      lines: [
        { who: "13i", scene: "fm-comet", text: "We recorded the rest of the waking from the edge of the system. The council of their ordinary days. The songs. The tail, which made the shape of a wing." },
        { who: "13i", scene: "fm-wall", text: "On the thirty-ninth day, they wrote the three hundred and eighty-fifth letter. It is full of advice for the next waking. Where the warm chambers are. Which songs to sing slower." },
        { who: "letter", scene: "fm-wall", text: "it was a good waking. we hope yours is better." },
        { who: "13i", text: "Then the lights went out, and the comet fell away from the star, and three thousand one hundred years later, it did not come back close enough." },
        { who: "readout", text: "OBJECT · OUTBOUND, UNBOUND   ·   SURFACE · −211°   ·   SIGNAL · NONE" },
        { who: "13i", text: "It is still out there, falling into the dark between stars, carrying a people asleep and a letter to no one. We could find it again. We are not sure what we would say." },
      ],
    },

    end_wokenwrong: {
      scene: "fm-cold",
      ending: "wokenwrong",
      lines: [
        { who: "13i", scene: "fm-ice", text: "We knew where the young slept, from the old letter. We warmed their chambers, carefully, so that the next waking could come now, and decide for itself, in time." },
        { who: "readout", scene: "fm-ice", text: "CHAMBERS · 2,140 · WARMED   ·   WAKING · PREMATURE" },
        { who: "13i", scene: "fm-ice", text: "They woke small, and wrong, without the cold behind them. They had not slept their orbit through. They did not grow." },
        { who: "wakers", scene: "fm-council", text: "where is our letter" },
        { who: "13i", scene: "fm-council", text: "There was no letter for them. There was a council of strangers explaining that the comet was dying, and that they had been woken to choose. They could not choose. They were children." },
        { who: "13i", text: "The elders asked us, in the end, to move the comet only enough for one more waking. We did. When the ice hardened, two thousand one hundred and forty of the young did not go back to sleep." },
        { who: "letter", scene: "fm-wall", text: "do not let the stranger help you. it helps too much." },
      ],
    },
  },
};
