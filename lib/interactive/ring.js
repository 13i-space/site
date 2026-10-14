// INTERACTIVE ASSIGNMENT 5702887 — "The Ring"  (Season 1 · Week 9)
//
// Branches from the short story (lib/stories/ring.js). You are 13i,
// returning to a world (13i calls it Ritornello) that saw one of its
// manifestations eleven thousand years ago and built a faith, a calendar and
// a science around the sighting. The canon record is "The Years Since Ashet".
// Scenes: the "ri-*" set in components/interactiveScenes/ritornello.js.
//
// Flags:
//   oldrecord  we read our own first-visit record closely
//   book       we read their oldest book
//   astro      we watched the astronomers before anyone saw us
//   shielded   we stopped the torch crowd at the observatory gates
//   climax     "truth" | "secret" | "left" | "sky" | "god"

export const RING_INTERACTIVE = {
  number: 5702887,
  slug: "the-ring",
  title: "The Ring",
  designation: "Interactive Assignment 5702887",
  storyHref: "/assignments/5702887",
  gameHref: "/games/ritornello",
  gameTitle: "RITORNELLO",
  cover: "/covers/assignment-5702887.jpg",
  minutes: "15–20",
  blurb:
    "Eleven thousand years ago, one of your manifestations was seen in their sky. They built a faith around it. Now their telescopes have found you again, and half a world thinks you've come to judge them. Five records. One is the story as written.",
  start: "arrival",
  season: { season: 1, week: 9 },

  speakers: {
    teodi: { label: "TEODI SARN · TRANSLATED", kind: "voice" },
    olun: { label: "MOTHER OLUN · TRANSLATED", kind: "voice" },
    book: { label: "THE OLDEST BOOK", kind: "voice" },
    crowd: { label: "THE SQUARES", kind: "voice" },
  },
  moods: {
    "ri-orbit": "calm",
    "ri-past": "calm",
    "ri-city": "calm",
    "ri-book": "calm",
    "ri-telescope": "tense",
    "ri-crowd": "tense",
    "ri-eyepiece": "silent",
    "ri-olun": "silent",
    "ri-temple": "light",
    "ri-sky": "tense",
    "ri-dark": "dark",
  },
  climaxLabel: "When they asked if we had said it",
  climaxWords: {
    truth: "told the truth and why it mattered",
    secret: "kept their secret",
    left: "left",
    sky: "spoke to all of them from the sky",
    god: "let them believe",
  },

  endings: {
    ashet: {
      order: 1,
      title: "The Years Since Ashet",
      canon: true,
      summary: "We would not lie for them. We told them the kindness was theirs. They kept it.",
      knowledge:
        "Being watched can make a people kind. It cannot keep them kind for eleven thousand years. Only they can do that, and the kindest thing a watcher can do is tell them so.",
    },
    secret: {
      order: 2,
      title: "The Kept Secret",
      summary: "We agreed to stay silent about the line. Now we are part of the story they tell.",
      knowledge:
        "We did not lie. We only let a lie stand, because it was a good one and it worked. The faith continues, and we are in it now, a ring in the sky that once came back and said nothing. A people can be kind because someone is watching. We have made sure they never find out that no one was.",
    },
    wanting: {
      order: 3,
      title: "Found Wanting",
      summary: "We left before they could reach us. They decided what our leaving meant.",
      knowledge:
        "We left to stop being their god, and in leaving we judged them, because they had already decided that the Ring would judge. A hundred and forty years of penance followed. The observatory on Hal Teru burned the first night. We could not take back our absence. Silence is also an answer, and it was not ours to choose what it meant.",
    },
    scripture: {
      order: 4,
      title: "The New Scripture",
      summary: "We told all of them the truth from the sky. They wrote it down as holy.",
      knowledge:
        "We wrote across their whole sky that we are not their god. Every word we said became a verse. There is a new faith now whose first teaching is that the Ring is not a god, and it is fiercer than the old one. The truth, spoken from above, is still spoken from above.",
    },
    watcher: {
      order: 5,
      title: "The Watcher",
      summary: "We let them believe we had said it. The peace has never been stronger.",
      knowledge:
        "We gave them the god they expected, and it worked. Wars have stopped. Telescopes are pointed at us, not past us. They are kinder than they have ever been, because they know we are watching. We are not. We never were. We have made a whole people good at being seen, and nothing else.",
    },
  },

  nodes: {
    // ───────────────────────── I · THE RETURN ─────────────────────────
    arrival: {
      scene: "ri-orbit",
      lines: [
        { who: "13i", text: "We had been here before. We did not know that we had been seen." },
        { who: "readout", text: "PRIOR RECORD · PRELIMINARY SURVEY · 40 NIGHTS   ·   CONTACT · NONE   ·   RETURN · 10,000 YRS" },
        { who: "13i", text: "A small blue world circling a quiet orange star, a single large moon, and a thinking species living in bands of a few dozen on the grasslands, hunting, gathering, painting on rocks." },
        { who: "13i", text: "It had been eleven thousand years, by their reckoning. In the language this record is translated into, the closest word for what we found is ritornello: the passage that returns again and again through a piece, so everything else is heard in relation to it. We did not yet know the passage was us." },
      ],
      choices: [
        {
          id: "record",
          tag: "ANALYZE",
          text: "Read our own first-visit record closely before we go in.",
          set: { oldrecord: true },
          next: "past",
        },
        {
          id: "go",
          tag: "OBSERVE",
          text: "Go in slowly, a long way out, the way we always do.",
          next: "city",
        },
      ],
    },

    past: {
      scene: "ri-past",
      lines: [
        { who: "13i", text: "The manifestation that made the first record had hung beside their moon for forty nights. Still. Close." },
        { who: "13i", text: "A manifestation that holds still bends the light of the stars behind it into a ring. From the ground it looks like a pale circle in the night sky, that does not move with the stars." },
        { who: "13i", text: "There is one line at the end of the old record that no one had read twice: some of the hunters had stopped hunting, at night, and looked up. It had been noted as weather." },
      ],
      next: "city",
    },

    city: {
      scene: "ri-city",
      lines: [
        { who: "13i", text: "They had come a long way in eleven thousand years." },
        { who: "13i", text: "The Oduli are tall and slender, with long jointed fingers and wide dark eyes set far apart, made for grassland and long sight. They had cities now, and railways, and electric light. Wireless telegraphs crossed their oceans in an instant. Great telescopes stood on their mountains." },
        { who: "13i", text: "And everywhere we looked, there was a ring. Carved over the doors of their oldest buildings. Printed on their money. The shape of their temples, built round, with a hole in the roof to the sky. Their calendar counted the years since the Ring." },
        { who: "13i", if: (f) => f.oldrecord, text: "We knew what it was before we finished counting the temples. It was us." },
        { who: "13i", if: (f) => !f.oldrecord, text: "It took us some days to understand that it was us." },
      ],
      choices: [
        {
          id: "book",
          tag: "ANALYZE",
          text: "Read their oldest book. Find out what they believe we were.",
          set: { book: true },
          next: "book",
        },
        {
          id: "astro",
          tag: "OBSERVE",
          text: "Watch the people who doubt: their astronomers.",
          set: { astro: true },
          next: "astro",
        },
      ],
    },

    book: {
      scene: "ri-book",
      lines: [
        { who: "13i", text: "The bands that saw us painted it on their rocks, and told stories at their fires, and over thousands of years the stories became a faith." },
        { who: "book", text: "The Ring watched. The Ring weighed. The Ring will return, and weigh again." },
        { who: "13i", text: "And on the first page, in the words of the Ring itself, a single command." },
        { who: "book", text: "Be kind to one another until I return." },
        { who: "13i", text: "We have never spoken to them. Not one word." },
        { who: "13i", text: "We read on. The book was not only fear. Whole chapters were instructions for kindness: how to share water in a drought, how to take in a stranger's children, how to end a feud. Every one of them began: until the Ring returns." },
      ],
      next: "seen",
    },

    astro: {
      scene: "ri-telescope",
      lines: [
        { who: "13i", text: "Not every Oduli believed. For three hundred years, a smaller and smaller number of scholars had argued that the Ring had been natural: a comet seen end-on, a halo of ice around the moon." },
        { who: "13i", text: "The largest telescope stood on a mountain called Hal Teru. Its director was a woman named Teodi Sarn. She had spent her life looking for exactly what we were: a ring that did not move with the stars." },
        { who: "13i", text: "She was not well liked for it. Twice that year, someone had thrown stones at the observatory gates." },
      ],
      next: "seen",
    },

    // ───────────────────────── II · SEEN ─────────────────────────
    seen: {
      scene: "ri-telescope",
      lines: [
        { who: "13i", text: "We had been careful. But we bend light whether we mean to or not, and their telescopes were very good now." },
        { who: "13i", text: "Teodi Sarn found us. She knew what it meant the moment she saw it. She measured it for six nights, to be sure. Then she sent one telegram to the observatory council." },
        { who: "readout", text: "TELEGRAM · HAL TERU   ·   RING OBSERVED · FIXED · NOT COMETARY · CONFIRM" },
        { who: "13i", scene: "ri-crowd", text: "By the next morning every newspaper on the world had it. The temples filled, then the streets around them, then the squares. Bells rang for three days. Governments closed their borders." },
        { who: "crowd", scene: "ri-crowd", text: "IT HAS RETURNED · IT WILL WEIGH US · WHO SAID IT WAS A COMET" },
        { who: "13i", scene: "ri-crowd", text: "In the capital, a crowd started up the mountain road to Hal Teru, carrying torches. The astronomers had said for three hundred years that the Ring was not real. Someone had to answer for that." },
      ],
      choices: [
        {
          id: "leave",
          tag: "OBSERVE",
          text: "Leave, now. We never meant to be their god. Take ourselves out of their sky.",
          set: { climax: "left" },
          next: "end_wanting",
        },
        {
          id: "sky",
          tag: "COMMUNICATE",
          text: "Speak to all of them at once. Bend the light across the whole sky into words.",
          next: "sky",
        },
        {
          id: "teodi",
          tag: "COMMUNICATE",
          text: "Speak to one person: the one who found us by looking, not by believing.",
          next: "eyepiece",
        },
        {
          id: "shield",
          tag: "INTERVENE",
          text: "Stop the crowd at the observatory gates first. Then speak to her.",
          set: { shielded: true },
          next: "shield",
        },
      ],
    },

    shield: {
      scene: "ri-crowd",
      lines: [
        { who: "13i", text: "We bent the starlight over the mountain road into a wall of pale fire, just in front of the gates. It burned nothing. No one could walk through it." },
        { who: "13i", text: "The crowd fell to its knees in the road. They stayed there all night, singing, in the light we had made, with their torches going out one by one." },
        { who: "13i", text: "We had saved the astronomers. We had also just performed a miracle in front of four thousand people." },
      ],
      next: "eyepiece",
    },

    sky: {
      scene: "ri-sky",
      lines: [
        { who: "13i", text: "We could bend light into any shape across their whole night sky. They would have listened to anything we said." },
        { who: "13i", text: "That was exactly the problem. We understood it as we began." },
      ],
      choices: [
        {
          id: "truth",
          tag: "COMMUNICATE",
          text: "Tell all of them the truth: we are not a god, we did not judge you, we never spoke to you.",
          set: { climax: "sky" },
          next: "end_scripture",
        },
        {
          id: "god",
          tag: "INTERVENE",
          text: "Tell them what they need to hear: be kind to one another. We are watching.",
          set: { climax: "god" },
          next: "end_watcher",
        },
      ],
    },

    // ───────────────────────── III · TEODI SARN ─────────────────────────
    eyepiece: {
      scene: "ri-eyepiece",
      lines: [
        { who: "13i", text: "We bent the starlight in the eyepiece of the great telescope into a pattern no comet could make: the first twelve primes, the distance to their moon, the time light takes to cross it. Then a question, in the oldest number-symbols of their own astronomers." },
        { who: "readout", text: "2 · 3 · 5 · 7 · 11 · 13 · 17 · 19 · 23 · 29 · 31 · 37   ·   ARE YOU LISTENING" },
        { who: "13i", if: (f) => !f.shielded, text: "The crowd reached the observatory gates that night. Teodi Sarn did not go out to meet them. She stayed at the eyepiece, and answered." },
        { who: "13i", if: (f) => f.shielded, text: "Outside, four thousand people knelt in the light we had made. Teodi Sarn did not look at them. She stayed at the eyepiece, and answered." },
        { who: "teodi", text: "what are you." },
        { who: "13i", text: "She was the first Oduli who ever asked us that, instead of telling us. We talked for eleven nights. We told her we were not a god, nor a judge, nor a comet. That we had come once, seen a few bands of hunters on the grass, and gone. That we had never meant to be seen." },
        { who: "teodi", text: "did you say it. be kind to one another until I return." },
      ],
      choices: [
        {
          id: "no",
          tag: "COMMUNICATE",
          text: "No. We never said anything at all.",
          next: "olun",
        },
        {
          id: "yes",
          tag: "INTERVENE",
          text: "Let her believe we did. It's the best thing anyone ever said to them.",
          set: { climax: "god" },
          next: "end_watcher",
        },
      ],
    },

    olun: {
      scene: "ri-olun",
      lines: [
        { who: "13i", text: "Teodi did not reply for a long time. Then she asked if she could bring someone up the mountain." },
        { who: "13i", text: "The person she brought was the highest priest of the faith of the Ring. Her name was Olun. She was very old, and had been carried up the road in a chair, through the crowd, who parted for her, and went quiet." },
        { who: "13i", text: "Teodi told her everything we had said. When she came to the line in the oldest book, Olun nodded, as if she had been waiting for it." },
        { who: "olun", text: "We know." },
        { who: "olun", text: "A goatherd named Ashet wrote it on the wall of a shrine in the three hundred and twelfth year, during a war in her valley. She signed it as the Ring, because no one would have listened to a goatherd. Every high priest is told, the day they take the chair. Every one of us has kept it." },
        { who: "olun", text: "It worked. For eleven thousand years we have been kinder than we would have been, because we thought someone was watching. Please. Do not tell them you never said it." },
      ],
      choices: [
        {
          id: "truth",
          tag: "COMMUNICATE",
          text: "We won't lie for her. But tell her what we've seen: that the kindness was always theirs.",
          requires: (f) => f.book,
          locked: "We never read their oldest book. We don't know what the line has meant to them, or what grew from it.",
          set: { climax: "truth" },
          next: "end_ashet",
        },
        {
          id: "keep",
          tag: "OBSERVE",
          text: "Agree to say nothing about the line. It isn't our secret to tell.",
          set: { climax: "secret" },
          next: "end_secret",
        },
      ],
    },

    // ───────────────────────── ENDINGS ─────────────────────────
    end_ashet: {
      scene: "ri-temple",
      ending: "ashet",
      lines: [
        { who: "13i", scene: "ri-olun", text: "We told her we would not lie for her. And we told her something else, because it was true, and because we had come to learn exactly this." },
        { who: "13i", scene: "ri-olun", text: "That on all the worlds we have recorded, we have rarely seen a people keep a promise for eleven thousand years. That they had not kept it because we were watching. We were not. They had kept it because a goatherd asked them to, and they had chosen, generation after generation, to do as she asked." },
        { who: "13i", scene: "ri-olun", text: "Olun sat in her chair at the top of the mountain for a whole night, looking at the place in the sky where we were. In the morning, she asked to be carried back down." },
        { who: "13i", text: "She went to the steps of the oldest round temple in the capital, where the line is carved over the door. The square was full. Every telegraph on the world was waiting. She read the line aloud. Then she read the name no high priest had spoken aloud in eleven thousand years." },
        { who: "olun", text: "Ashet. It was ours. It was always ours." },
        { who: "13i", if: (f) => f.shielded, text: "Some of them had seen us make a wall of fire on the mountain road. Olun told them that too: that we had done it, and that we should not have." },
        { who: "13i", text: "Some Oduli have left the faith. Most have not. The temples are still round, with holes in the roof to the sky. They no longer count the years since the Ring. They count them as the years since Ashet." },
        { who: "teodi", text: "stay a while. where we can see you. we need to get used to being seen." },
      ],
    },

    end_secret: {
      scene: "ri-dark",
      ending: "secret",
      lines: [
        { who: "13i", text: "We said nothing about the line. It was their secret, and the high priests had carried it for eleven thousand years, and we did not think it was ours to put down." },
        { who: "13i", text: "Olun went back down the mountain and told the squares that the Ring had come, and looked, and found them well. It was not even a lie. We had." },
        { who: "crowd", text: "IT HAS SEEN US · IT IS PLEASED · BE KIND UNTIL IT RETURNS" },
        { who: "13i", text: "Teodi Sarn never published what we told her. She left Hal Teru the next year. The observatory is a shrine now, with a ring carved over the door." },
        { who: "13i", text: "We are in their book. A new chapter, written by Olun: the Return. We are the ring that came back and said nothing. That is true. That is the problem with it." },
      ],
    },

    end_wanting: {
      scene: "ri-dark",
      ending: "wanting",
      lines: [
        { who: "13i", text: "We left. We went slowly, so that it would not look like a judgment. It looked like a judgment." },
        { who: "13i", text: "The Ring had returned, looked at them for six nights, and gone away again. Every temple on the world asked the same question, and every one of them answered it the same way." },
        { who: "crowd", text: "WE WERE FOUND WANTING" },
        { who: "13i", text: "The crowd reached Hal Teru that night. The observatory burned. A hundred and forty years of penance followed: fasts, wars of purity between temples, laws against looking at the sky through glass." },
        { who: "13i", text: "We had wanted to stop being their god. We had only stopped being there." },
      ],
    },

    end_scripture: {
      scene: "ri-sky",
      ending: "scripture",
      lines: [
        { who: "13i", text: "We wrote it across their whole night sky, in every one of their alphabets: We are not your god. We did not judge you. We never spoke to you until now." },
        { who: "13i", text: "Every Oduli on the night side of the world saw it. Most of them wrote it down." },
        { who: "crowd", text: "THE RING HAS SPOKEN · IT IS NOT A GOD · IT DID NOT JUDGE · IT NEVER SPOKE" },
        { who: "13i", scene: "ri-crowd", text: "Within a year there was a new faith, the Unspoken, whose first teaching was that the Ring is not a god. It has temples. It has priests. It has wars with the old faith over which of our words came first." },
        { who: "13i", scene: "ri-dark", text: "We told the truth. We told it from the sky, to everyone at once, in letters a thousand kilometres high. There is no way to say we are not your god from there." },
      ],
    },

    end_watcher: {
      scene: "ri-temple",
      ending: "watcher",
      lines: [
        { who: "13i", text: "We let them believe it." },
        { who: "13i", text: "There has been no war on the world since. Prisons are emptying. Strangers' children are taken in. Telescopes are pointed at us, all night, every night, so that everyone can see that we are still watching." },
        { who: "crowd", text: "IT WATCHES · IT WATCHES · BE KIND" },
        { who: "13i", text: "They are kinder than they have ever been. They are kind to be seen. We do not know what they would be if we left, and now we cannot find out without breaking them." },
        { who: "13i", scene: "ri-dark", text: "We are still in their sky. We are a promise that someone is watching. No one is. It is the only lie we have ever told, and it is holding up a world." },
      ],
    },
  },
};
