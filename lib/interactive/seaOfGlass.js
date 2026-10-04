// INTERACTIVE ASSIGNMENT 0514229 — "The Sea of Glass"  (Season 1 · Week 4)
//
// Branches from the short story (lib/stories/seaOfGlass.js). You are 13i, on
// Dacapo, a world whose people grow their memories as rings of glass and,
// once a generation, shed all but one. The canon record is "What We Kept".
// Branch map and notes: docs/INTERACTIVE.md. Same data shape as
// quietMoon.js; scenes are the "glass-*" set in
// components/interactiveScenes/glass.js.
//
// Flags:
//   cored      cored the sea from orbit first (knows it's generations deep)
//   metFirst   went to the newest glass first (met the returners before the towers)
//   cracked    pulsed a tower to read it at once (split it open)
//   warColor   answered the towers in their own light (learned the war's colours)
//   fluent     0 none · 1 can say small things · 2 learned from the bright one at once
//   feared     spoke to the returners in the towers' colours
//   promised   offered to keep the heavy one's rings for it
//   stood      cast light on the heavy one each morning, with the others
//   held       held the cracked tower together through the Return
//   scannedBody scanned the bright one's body (learned rings = years early)
//   climax     "give" | "keep" | "show" | "carry" | "fell"   (recorded for Kin stats)

export const SEA_OF_GLASS_INTERACTIVE = {
  number: 514229,
  slug: "the-sea-of-glass",
  title: "The Sea of Glass",
  designation: "Interactive Assignment 0514229",
  storyHref: "/assignments/514229",
  gameHref: "/games/prism",
  gameTitle: "PRISM",
  cover: "/covers/assignment-0514229.jpg",
  minutes: "15–20",
  blurb:
    "A world whose people grow their memories as rings of glass, and once a generation, shed all but one. Go down as 13i, the archive that keeps everything. Five records. One is the story as written.",
  start: "approach",
  season: { season: 1, week: 4 },

  speakers: {
    light: { label: "THE RETURNERS · LIGHT, TRANSLATED", kind: "voice" },
    bright: { label: "THE BRIGHT ONE", kind: "voice" },
    heavy: { label: "THE HEAVY ONE", kind: "voice" },
    eldest: { label: "THE ELDEST", kind: "mind" },
    towers: { label: "THE TOWERS · THE CANYON WALLS", kind: "mind" },
  },
  moods: {
    "glass-orbit": "calm",
    "glass-plain": "calm",
    "glass-canyon": "tense",
    "glass-war": "tense",
    "glass-crack": "tense",
    "glass-returners": "light",
    "glass-bright": "light",
    "glass-rings": "calm",
    "glass-heavy": "dark",
    "glass-companion": "tense",
    "glass-return": "light",
    "glass-light": "light",
    "glass-dark": "dark",
  },
  climaxLabel: "On the night before the Return",
  climaxWords: {
    give: "set the record down",
    keep: "kept the record",
    show: "showed them the war",
    carry: "carried the heavy one's rings",
    fell: "let the cracked tower fall",
  },

  endings: {
    kept: {
      order: 1,
      title: "What We Kept",
      canon: true,
      summary: "We set the war down on the sea with them. The bright one kept us.",
      knowledge:
        "To keep everything is not the same as to understand it. Some memories must be kept so they are never repeated, and some must be set down so they are never repeated. The returners have practiced telling the difference for longer than we have existed. We have begun.",
    },
    library: {
      order: 2,
      title: "The Library",
      summary: "We kept the record. At the Return, they let us go.",
      knowledge:
        "We keep our records so that we do not repeat ourselves. We still believe that. But a record kept against the wishes of the ones it is about is not only a memory. It is a decision we made for them, and we made it alone.",
    },
    dacapo: {
      order: 3,
      title: "Da Capo",
      summary: "We showed them what they had chosen to forget. One of them chose to keep it.",
      knowledge:
        "We believed a choice made knowing everything is always a better choice. On Dacapo we gave a young mind everything, and it kept the one memory its people had spent a hundred generations setting down. The music goes back to the beginning. We named the world before we knew why.",
    },
    borrowed: {
      order: 4,
      title: "The Borrowed Weight",
      summary: "We held its rings so it could let go. It let go of everything, even the kindness.",
      knowledge:
        "You cannot keep a memory for someone. You can only keep it instead of them. The heavy one walks the plain bright and new, and somewhere in the collective, eighty years of its grief are kept perfectly, by us, for no one.",
    },
    fallen: {
      order: 5,
      title: "The Fallen Tower",
      summary: "We broke a tower to read it faster. It fell during the Return.",
      knowledge:
        "We wanted all of it at once, and we split open a record that had been sealed for ten thousand years. When it fell, the war did not end. It scattered across the sea, into the glass of people who had never chosen it.",
    },
  },

  nodes: {
    // ───────────────────────── I · DACAPO ─────────────────────────
    approach: {
      scene: "glass-orbit",
      lines: [
        { who: "readout", text: "DESTINATION · THIRD WORLD OF A RED DWARF   ·   COMPANION · WHITE DWARF, ECCENTRIC   ·   SOUTHERN PLAIN · ANOMALOUS" },
        { who: "13i", text: "We keep everything. It is the first thing anyone should understand about us, and the last thing we expected to have to explain." },
        { who: "13i", text: "Every world we have visited, every species we have met, every mistake we have made, is held somewhere in the collective, whole and in order. We do not lose records. We have never wanted to." },
        { who: "13i", text: "The planet orbited a dim red star. Around them both, on a long, narrow path, swung a small white companion: a dead star, hot and hard-edged, that came close once in every forty-one of the planet's years." },
        { who: "readout", text: "SOUTHERN PLAIN · GLASS, GROUND FINE   ·   DEPTH · KILOMETERS   ·   EVERY GRAIN · STRUCTURED" },
        { who: "13i", text: "Across its southern hemisphere lay a plain larger than many oceans we have mapped, and it was white. Our instruments said it was glass, ground as fine as sand. Every grain held a pattern, laid down in layers, the way a tree lays down rings." },
        { who: "13i", text: "We knew, before we knew anything else about that world, that we were looking at an archive. We know what archives look like. We are one." },
        { who: "13i", text: "There is a mark at the end of some music: da capo, from the head. Go back to the beginning, and play again. We named the world Dacapo. At the time, we did not know why the name felt right." },
        { who: "readout", text: "OBJECTIVE · Learn who made the sea of glass, and what it records." },
      ],
      choices: [
        {
          id: "oldest",
          tag: "OBSERVE",
          text: "Go to the oldest part first. It is what we always do.",
          next: "canyon",
        },
        {
          id: "newest",
          tag: "COMMUNICATE",
          text: "Go to where the glass is newest. Whoever is writing it may still be there.",
          set: { metFirst: true },
          next: "plain_first",
        },
        {
          id: "core",
          tag: "ANALYZE",
          text: "Core the sea from orbit, kilometers down, and read its layers in order.",
          set: { cored: true },
          next: "cored",
        },
      ],
    },

    cored: {
      scene: "glass-orbit",
      lines: [
        { who: "13i", text: "We drove a narrow core down through the plain and drew it up into ourselves, a column of glass four kilometers long." },
        { who: "readout", text: "CORE · 4.1 km   ·   BANDS · ~11,000   ·   BAND INTERVAL · REGULAR" },
        { who: "13i", text: "It was banded. A thin layer, then a long pause of ordinary rock dust, then another layer. Eleven thousand of them, at almost perfectly regular intervals." },
        { who: "13i", text: "The interval matched the orbit of the white companion. Something happened on this plain every time the dead star came close, and had happened for longer than most species have existed." },
        { who: "13i", text: "Each layer was full of patterns. Each one, as far as we could tell, was different. We could not read any of them." },
        { who: "13i", text: "North of the plain, our scans showed glass that had never been ground at all. We went there first." },
      ],
      next: "canyon",
    },

    plain_first: {
      scene: "glass-plain",
      lines: [
        { who: "13i", text: "We came down at the edge of the plain, where the newest glass lay thinnest over the rock." },
        { who: "13i", scene: "glass-returners", text: "They were already there: tall, slender shapes, twice the height of a human, standing on three long legs. Their bodies were glass, layer on layer around a warm, glowing core." },
        { who: "13i", scene: "glass-returners", text: "They spoke in light. When one turned toward another, its core shone out through its layers and fell on the other in colors. The other answered the same way." },
        { who: "13i", scene: "glass-returners", text: "They saw us. Some turned away. One came closer: young, almost clear, its light bright and simple. It cast a long pattern on our hull, then waited." },
        { who: "13i", scene: "glass-returners", text: "We did not know how to answer yet. We let it look. When we lifted again, it followed us north to the edge of the rock, and stopped there, at the mouth of a canyon, and would not go further." },
        { who: "13i", text: "Whatever was in the canyon, they did not go into it. So we did." },
      ],
      next: "canyon",
    },

    // ───────────────────────── II · THE TOWERS ─────────────────────────
    canyon: {
      scene: "glass-canyon",
      lines: [
        { who: "13i", text: "A canyon ran east for six hundred kilometers, and in it stood towers: thousands of them, hundreds of meters high, made of the same glass as the sea, but whole. Dark amber at the core, darker at the base, where they grew into the rock as though they had roots." },
        { who: "13i", scene: "glass-war", text: "When the red star rose, its light passed through them, and the towers threw colors onto the canyon walls." },
        { who: "towers", scene: "glass-war", text: "◆ ◆ ◇ ◆   ◆ ◇ ◇   ◆ ◆ ◆ ◇" },
        { who: "13i", scene: "glass-war", text: "The colors moved. They flickered from tower to tower in long sequences, faded, and began again. Nothing living was near them. The towers were simply letting the light through, and the light was coming out changed." },
        { who: "13i", if: (f) => f.cored, scene: "glass-war", text: "The patterns were like the ones in our core from the plain. These had not been ground down. They were still in order." },
        { who: "13i", text: "Reading it all would take many days." },
      ],
      choices: [
        {
          id: "read",
          tag: "OBSERVE",
          text: "Read it as it is meant to be read: by the light that passes through, for as long as that takes.",
          next: "canyon_read",
        },
        {
          id: "pulse",
          tag: "ANALYZE",
          text: "Send a resonant pulse into the largest tower and read every layer of its core at once.",
          set: { cracked: true },
          next: "canyon_cracked",
        },
        {
          id: "answer",
          tag: "COMMUNICATE",
          text: "Cast their own colors back at the towers, and see whether anything answers.",
          set: { warColor: true },
          next: "canyon_answered",
        },
      ],
    },

    canyon_read: {
      scene: "glass-war",
      lines: [
        { who: "13i", text: "We recorded it. All of it. It took us eleven days to read the canyon, tower by tower, and we did not understand most of what we read. But we understood enough." },
        { who: "13i", text: "It was a war. Not one war: one war that never ended. A sequence of grievances, each one answered, each answer remembered and answered again, repeating with small changes over thousands of years." },
        { who: "13i", text: "The same colors appeared again and again at the start of each sequence. We came to understand them as names. Names of the wronged. Names of those who had wronged them. Kept perfectly, and passed on." },
      ],
      next: "towers_people",
    },

    canyon_cracked: {
      scene: "glass-crack",
      lines: [
        { who: "13i", text: "We tuned the pulse to the glass and sent it into the largest tower. Its layers rang, all of them at once, and gave us everything." },
        { who: "readout", text: "TOWER 1 · 3,400 LAYERS READ   ·   STRUCTURE · FRACTURE ALONG AXIS" },
        { who: "13i", text: "Then the ringing did not stop. A crack opened from the base of the tower to half its height, and through it, for the first time in what may have been ten thousand years, the red light passed through the core unfiltered." },
        { who: "13i", text: "What came out was not a sequence. It was all of it at once, a flood of color across the canyon walls, too fast and too bright to follow." },
        { who: "13i", text: "We had what we came for. We had read it in a day, instead of eleven. It was a war: grievance answered by grievance, names of the wronged and of those who had wronged them, kept perfectly and passed on." },
        { who: "13i", text: "The tower kept ringing for three days. We did not think about it again until much later." },
      ],
      next: "towers_people",
    },

    canyon_answered: {
      scene: "glass-war",
      lines: [
        { who: "13i", text: "We learned the canyon's colors well enough to cast them, and cast a sequence back onto the largest tower." },
        { who: "13i", text: "Nothing answered. The towers went on with their sequences as though we were not there. But in learning to make their colors, we learned to read them, faster than watching alone would have taught us." },
        { who: "13i", text: "It was a war: grievance answered by grievance, repeated with small changes over thousands of years. The colors that began each sequence were names. Names of the wronged, and of those who had wronged them." },
        { who: "13i", text: "We could speak a little of their language now. We did not yet know that it was the oldest dialect on the planet, and that no one living used it." },
      ],
      next: "towers_people",
    },

    towers_people: {
      scene: "glass-canyon",
      lines: [
        { who: "13i", text: "The canyon had once been a city. The towers were not buildings. When we scanned their cores, we found the remains of bodies, enclosed in the glass the way an insect is enclosed in amber." },
        { who: "13i", text: "The towers had been people." },
        { who: "13i", scene: "glass-war", text: "They had grown too heavy to move, and then too heavy to live, and they had stood there ever since, saying the same things to the canyon walls every morning, to no one." },
      ],
      next: (f) => (f.metFirst ? "returners_again" : "returners"),
    },

    // ───────────────────────── III · THE RETURNERS ─────────────────────────
    returners: {
      scene: "glass-plain",
      lines: [
        { who: "13i", text: "We found the living ones on the edge of the white plain." },
        { who: "13i", scene: "glass-returners", text: "They were tall and slender, each on three long legs beneath a narrow body of glass: thin, clear layers wrapped around a warm, glowing core. At the top, the layers flared into a crown of facets, like a cut stone." },
        { who: "13i", scene: "glass-returners", text: "They spoke in light. Whole sentences crossed between them in a breath, shifting and overlapping, as precise as anything we have heard in sound." },
        { who: "light", scene: "glass-returners", text: "◇ ◇ ◈   ◇ ◈ ◇ ◇   ◈" },
        { who: "13i", scene: "glass-bright", text: "One of them came closer than the others. It was young, almost entirely clear. It cast its light on our hull for a long time before we understood we were being spoken to." },
      ],
      next: "first_words",
    },

    returners_again: {
      scene: "glass-bright",
      lines: [
        { who: "13i", text: "When we came out of the canyon, the young one was still waiting at its mouth, where we had left it." },
        { who: "13i", text: "It cast the same long pattern on our hull that it had cast on the plain, and waited again." },
      ],
      next: "first_words",
    },

    first_words: {
      scene: "glass-bright",
      lines: [{ who: "bright", text: "◇ ─ ◇ ◇ ─ ◇" }],
      choices: [
        {
          id: "copy",
          tag: "COMMUNICATE",
          text: "Answer in light: cast its pattern back to it, exactly, as well as we can.",
          set: (f) => (f.warColor ? { feared: true, fluent: 1 } : { fluent: 2 }),
          next: "spoken",
        },
        {
          id: "watch",
          tag: "OBSERVE",
          text: "Stay dark. Watch them speak to each other first, until we understand the grammar.",
          set: { fluent: 1 },
          next: "spoken",
        },
        {
          id: "scan",
          tag: "ANALYZE",
          text: "Scan its body gently, to learn how it makes its light.",
          set: { fluent: 1, scannedBody: true },
          next: "scanned_body",
        },
      ],
    },

    scanned_body: {
      scene: "glass-rings",
      lines: [
        { who: "13i", text: "Our scan passed through it softly, layer by layer. The young one held still and let it." },
        { who: "readout", text: "LAYERS · 19   ·   EACH · ONE ORBIT OF THE RED STAR   ·   CONTENT · STRUCTURED, NON-REPEATING" },
        { who: "13i", text: "Nineteen layers around a glowing core, each grown in one year, and each one dense with pattern. We had seen those patterns before, in the sea and in the towers." },
        { who: "13i", text: "Their bodies were their memories. We understood that before we could say a single word to them. Then, over many days of watching, we learned to say a few." },
      ],
      next: "spoken",
    },

    spoken: {
      scene: "glass-bright",
      lines: [
        { who: "13i", if: (f) => f.fluent === 2, text: "Our reply was crude: the right colors, the wrong rhythm. The young one cast the pattern again, slower, and then again, until our answer matched it. It was teaching us." },
        { who: "bright", if: (f) => f.fluent === 2, text: "◇ ─ ◇ ◇      you · here · new" },
        { who: "13i", if: (f) => f.fluent === 2, text: "Within days we could say small things. It was the first of them to say our name in light, or what it decided our name would be: a single pulse of white, held, and then let go." },
        { who: "13i", if: (f) => f.feared, scene: "glass-war", text: "We cast the pattern back. But the only colors we had learned to make were the canyon's, and our answer came out in amber and rose: the colors of the towers." },
        { who: "13i", if: (f) => f.feared, text: "The young one stepped back so fast that one of its legs slid on the glass. Every returner within sight of us went dark at once." },
        { who: "light", if: (f) => f.feared, text: "◆ ◆ ◇      the towers · speak" },
        { who: "13i", if: (f) => f.feared, text: "It was many days before any of them came near us again. When they did, they spoke to us only in white, slowly, and watched us carefully when we answered." },
        { who: "13i", if: (f) => f.fluent === 1 && !f.feared, text: "We learned slowly, by watching. It was many days before we could answer, and our first answers were simple. The young one was patient with us." },
        { who: "13i", text: "We came to call it the bright one." },
      ],
      next: "rings",
    },

    rings: {
      scene: "glass-rings",
      lines: [
        { who: "13i", scene: "glass-returners", text: "They were not all the same color. The young were nearly clear, their light hard and white. The older ones were tinted: honey, then rose, then a slow amber. Their light was dimmer, and more complex, full of shades the young could not make." },
        { who: "13i", if: (f) => !f.scannedBody, text: "Each layer of their bodies was a year. Each year a new layer grew around the core, and held what that year had been. Every touch, every word, every sight. Their bodies were their memories, and their memories were glass." },
        { who: "13i", if: (f) => f.scannedBody, text: "We had already seen it in the bright one: one layer for every year, and the year inside it. Here it was in all of them." },
        { who: "13i", text: "We understood then what the towers had been, and what the sea was. We did not yet understand why." },
      ],
      next: "heavy",
    },

    // ───────────────────────── IV · THE HEAVY ONE ─────────────────────────
    heavy: {
      scene: "glass-heavy",
      lines: [
        { who: "13i", text: "There was one returner on the plain that did not walk." },
        { who: "13i", text: "It stood apart at the edge of the sea, so dark with layers that its light barely came through. Where the others had perhaps forty rings, it had more than a hundred and twenty. Its legs had begun to fuse to the ground." },
        { who: "13i", text: "Every morning a few of the others stood near it and cast colors onto its body, slowly, the way you would speak to someone who is hard of hearing. Sometimes it answered, faintly, in deep amber." },
        { who: "heavy", text: "◆      ·      ·      ◆" },
        { who: "13i", text: "The bright one told us, over many days. The heavy one had refused the last two Returns. Eighty years down in its layers was another returner, one it had walked beside for most of its life, who had fallen from the canyon rim in a storm and shattered." },
        { who: "13i", text: "It would not let that memory go. And because it would not let go of that one, it could not let go of any of them." },
        { who: "13i", scene: "glass-canyon", text: "It was becoming a tower." },
      ],
      choices: [
        {
          id: "leave",
          tag: "OBSERVE",
          text: "Leave it be. What it keeps is its own to decide.",
          next: "companion",
        },
        {
          id: "stand",
          tag: "COMMUNICATE",
          text: "Stand with the others in the mornings, and cast our light on it too.",
          requires: (f) => f.fluent === 2,
          locked: "We cannot yet say anything gentle enough in light.",
          set: { stood: true },
          next: "stood",
        },
        {
          id: "offer",
          tag: "INTERVENE",
          text: "Offer to copy every one of its rings, so it can shed them and lose nothing.",
          requires: (f) => f.fluent >= 1,
          locked: "We cannot yet say anything that complicated in light.",
          set: { promised: true },
          next: "offered",
        },
      ],
    },

    stood: {
      scene: "glass-heavy",
      lines: [
        { who: "13i", text: "In the mornings we stood with them. Our light was poor beside theirs, white and plain, but we cast it on the heavy one with the others, slowly." },
        { who: "13i", text: "It did not answer us. But on the fourth morning, its crown turned, very slightly, toward us, and stayed there while we spoke." },
        { who: "heavy", text: "◆      ◇      the one · that keeps" },
        { who: "13i", text: "The bright one told us what it had called us. It had understood what we are." },
      ],
      next: "companion",
    },

    offered: {
      scene: "glass-heavy",
      lines: [
        { who: "13i", text: "It took us a long time to say. We keep everything. We could keep its rings for it, every one, exactly. It could shed them all at the Return, and nothing would be lost. It would still be there, in us, whenever it wanted it." },
        { who: "13i", text: "The others went still. The bright one did not translate for a long time." },
        { who: "heavy", text: "◆  ◆  ◆      ·      ·      ◇" },
        { who: "13i", text: "Then the heavy one answered. One word, in amber, very slowly. The bright one would not tell us what it meant. We believe it was yes." },
      ],
      next: "companion",
    },

    // ───────────────────────── V · THE COMPANION STAR ─────────────────────────
    companion: {
      scene: "glass-companion",
      lines: [
        { who: "13i", text: "The white companion star was coming. Each day it climbed higher, small and fierce, and its hard light did something to their glass." },
        { who: "readout", text: "COMPANION · CLOSEST APPROACH IN 9 DAYS   ·   RETURNER OUTER LAYERS · RESONANT" },
        { who: "13i", text: "Their outer layers began to sing, a high clear ringing when the wind passed over them. The layers were growing brittle. Ready." },
        { who: "13i", scene: "glass-plain", text: "The bright one showed us what would happen. At the companion's closest, every returner on Dacapo would walk out onto the sea and shed its rings. Every memory would go. Every year, every word, every name. All but one." },
        { who: "bright", scene: "glass-plain", text: "◇      ·      ·      ·      ◈      keep · one" },
        { who: "13i", scene: "glass-plain", text: "Each keeps one ring, and chooses it. By custom, it is the memory of a kindness: the year someone carried them, or taught them, or stood beside them in a storm. Not their own deeds. Something done for them. The sea is made of everything else." },
        { who: "13i", text: "We are an archive. Our first response was something close to horror. Forty years of a life, ground into sand by choice. A whole people forgetting itself every generation, on purpose. It looked to us like a library burning." },
        { who: "13i", scene: "glass-war", text: "Then the bright one turned toward the canyon and cast one color we knew: a name from the towers. Once, briefly. Then the pattern for no." },
        { who: "13i", text: "That was the answer. They had once kept everything, as we do, and everything they kept, they answered. A memory that cannot fade becomes an instruction. Their ancestors followed those instructions until the canyon was full of the dead." },
        { who: "13i", text: "So they learned to forget. Not the towers. They leave the towers standing, as the one thing all of them remember. Everything else." },
      ],
      next: (f) => (f.cracked ? "the_crack" : "request"),
    },

    the_crack: {
      scene: "glass-crack",
      lines: [
        { who: "13i", text: "The tower we had pulsed had not stopped ringing. As the companion climbed, its crack had grown, and the white light was passing straight through its core." },
        { who: "13i", text: "Every morning now, the war poured out of it unfiltered, all of it at once, across the canyon and onto the northern edge of the plain." },
        { who: "13i", text: "The young had begun to go and look at it. They had never seen those colors so bright. Some of them came back with the light still moving on their bodies." },
        { who: "eldest", text: "◆ ◇ ◆      ·      fall · soon · the sea" },
        { who: "13i", text: "When the companion was closest, the tower would fall. Its rings would break across the canyon and blow south, onto the sea, among people shedding their own." },
      ],
      choices: [
        {
          id: "hold",
          tag: "INTERVENE",
          text: "Hold the tower together with our field until the Return is over.",
          set: { held: true },
          next: "held",
        },
        {
          id: "fall",
          tag: "OBSERVE",
          text: "It is their canyon. Their dead. Let them decide what to do, and do nothing.",
          set: { climax: "fell" },
          next: "end_fallen",
        },
      ],
    },

    held: {
      scene: "glass-crack",
      lines: [
        { who: "13i", text: "We closed our field around the tower and held it. It took most of what we had. The ringing went on inside it, but the crack stopped growing." },
        { who: "13i", text: "It was the first time we had held anything on Dacapo still. It would not be the last thing they asked of us." },
      ],
      next: "request",
    },

    // ───────────────────────── VI · THE REQUEST ─────────────────────────
    request: {
      scene: "glass-plain",
      lines: [
        { who: "13i", if: (f) => !f.feared, text: "On the last night before the Return, the eldest of them came to us. The bright one came with them, and stood close." },
        { who: "13i", if: (f) => f.feared, text: "On the last night before the Return, the eldest did not come to us. The bright one came alone, and stood further away than it used to." },
        { who: "13i", text: "They had understood something about us that we had not thought to hide. We had read the towers. We carried the war." },
        { who: "13i", text: "Not the shape of it. All of it: every name, every grievance, every answer, in order and complete, the way we keep everything. Somewhere in the collective, in a record that would outlast their world, the war of Dacapo was still being kept, perfectly, by someone who could read it." },
        { who: "eldest", if: (f) => !f.feared, text: "◇ ◈ ◇ ◇      come · to the sea · set it down · with us" },
        { who: "bright", if: (f) => f.feared, text: "◇ ◈ ◇ ◇      come · to the sea · set it down" },
        { who: "13i", text: "We have never deleted a record. We keep records of our own failures that we would rather not have. We keep the record of a world we ended, on purpose, so that we do not do it again." },
        { who: "13i", if: (f) => f.fluent === 2, text: "We said so. It took us a long time, in light. The bright one answered for them." },
        { who: "bright", if: (f) => f.fluent === 2, text: "◈ ◇ ◇      yes · the towers · keep what stops it · set down what keeps it going" },
        { who: "13i", if: (f) => f.promised, scene: "glass-heavy", text: "And at the edge of the sea, the heavy one was waiting for us to keep our promise." },
      ],
      choices: [
        {
          id: "give",
          tag: "COMMUNICATE",
          text: "Go to the sea with them, and set it down.",
          set: { climax: "give" },
          next: "end_kept",
        },
        {
          id: "keep",
          tag: "OBSERVE",
          text: "Keep it. Tell them why we keep what we keep, and stay.",
          set: { climax: "keep" },
          next: "end_library",
        },
        {
          id: "show",
          tag: "ANALYZE",
          text: "Show them what we carry first, in light, so they can choose knowing all of it.",
          requires: (f) => f.fluent >= 1,
          locked: "We cannot yet say anything that long in light.",
          set: { climax: "show" },
          next: "end_dacapo",
        },
        {
          id: "carry",
          tag: "INTERVENE",
          text: "Keep our promise: carry the heavy one's rings, so it can let go of everything.",
          requires: (f) => f.promised,
          locked: "We never offered to keep anyone's rings.",
          set: { climax: "carry" },
          next: "end_borrowed",
        },
      ],
    },

    // ───────────────────────── ENDINGS ─────────────────────────
    end_kept: {
      scene: "glass-light",
      ending: "kept",
      lines: [
        { who: "13i", scene: "glass-heavy", text: "In the morning, the heavy one was walking." },
        { who: "13i", scene: "glass-heavy", text: "It was the slowest thing we have ever seen move. It lifted each leg out of the ground as though pulling it from stone, which it was. Returners came from across the plain and stood against it, three and four at a time, bracing it on every side." },
        { who: "13i", if: (f) => f.stood, scene: "glass-heavy", text: "It had watched us, every morning. It had watched something that keeps everything, being asked to set something down. It wanted to see what we would do. And then it decided not to wait to find out." },
        { who: "13i", if: (f) => !f.stood, scene: "glass-heavy", text: "It had heard what they asked of us, the bright one said later. Something that keeps everything, asked to set something down. It decided not to wait to see what we would do." },
        { who: "13i", scene: "glass-return", text: "The companion rose, white and small, and the returners walked out onto the glass by the thousands. The ringing of their layers filled the air. Then it changed pitch, and the first rings cracked." },
        { who: "13i", scene: "glass-return", text: "They fell like rain, if rain were made of light: every layer catching the white star as it fell and throwing out, for one instant, the last colors it held. A year of someone's life, once, on the air. Then it was sand." },
        { who: "13i", scene: "glass-return", text: "We opened the record of the towers. We read it one more time, all of it, from the first name to the last. Then we let it go." },
        { who: "readout", scene: "glass-return", text: "RECORD · DACAPO / CANYON · DELETED   ·   RETAINED · THAT IT EXISTED, AND THAT WE WERE ASKED" },
        { who: "13i", scene: "glass-return", text: "Beside us, the heavy one shed its rings for three hours. Amber, then rose, then honey, then clear. At the end it stood nearly as bright as the young, with a single dark ring left at its core." },
        { who: "13i", scene: "glass-light", text: "We do not know which year it kept. We believe it was the year it was carried in from the storm, by the one who later fell." },
        { who: "13i", scene: "glass-light", if: (f) => f.held, text: "In the canyon, the cracked tower still stood, held in our field. It is the one record on Dacapo we have touched twice." },
        { who: "13i", scene: "glass-light", text: "The bright one turned to us. It had shed only a few rings; it was young." },
        { who: "bright", scene: "glass-light", text: "◇ ─────────── ·" },
        { who: "13i", scene: "glass-light", text: "A single pulse of white, held, and then let go. It was our name. It had kept us." },
      ],
    },

    end_library: {
      scene: "glass-dark",
      ending: "library",
      lines: [
        { who: "13i", text: "We told them why we keep what we keep. That a record of harm is how we avoid repeating it. That we have kept the worst thing we ever did, on purpose, for that reason." },
        { who: "13i", text: "They listened for a long time. Then the eldest cast one short pattern, and they turned and walked back toward the sea." },
        { who: "13i", if: (f) => f.promised, scene: "glass-heavy", text: "The heavy one did not walk. We had offered to keep its rings, and then we had refused to set down anything of theirs. It did not ask us again." },
        { who: "13i", scene: "glass-return", text: "In the morning, the companion rose and they shed their rings, by the thousands, in falling light. We watched from the edge of the sea. No one asked us to come closer." },
        { who: "13i", scene: "glass-return", text: "The bright one stood near the front. It had only a few rings to shed. We watched them fall: one, and then another, and then the youngest one, the year it met us." },
        { who: "13i", scene: "glass-light", text: "When it was over, it turned toward us. The light it cast was clear and simple and polite: the pattern they use for a stranger." },
        { who: "13i", scene: "glass-dark", text: "We have the whole war of Dacapo. Every name. We also have the bright one's first word to us, which it does not." },
      ],
    },

    end_dacapo: {
      scene: "glass-dark",
      ending: "dacapo",
      lines: [
        { who: "13i", text: "We believed they should choose knowing everything. So before we answered, we showed them what we carried." },
        { who: "13i", scene: "glass-war", text: "We cast the canyon onto the sea: every sequence, every name, in order, the way the towers would have if anyone still stood in front of them. It took most of the night." },
        { who: "13i", scene: "glass-war", text: "The eldest turned away almost at once. Most of the others followed. The bright one did not. It was young. It had never seen any of it. It stayed until the end." },
        { who: "13i", scene: "glass-return", text: "In the morning, they walked out onto the sea, and the rings fell in light, and we set the record down with them, as they had asked. It was too late to matter." },
        { who: "13i", scene: "glass-return", text: "The bright one shed its few rings, all but one. When it turned back toward us, its single ring was not clear. It was amber, and its light came out in the colors of a name." },
        { who: "readout", scene: "glass-war", text: "KEPT · 1 RING   ·   CONTENT · A GRIEVANCE   ·   FIRST IN ~11,000 RETURNS" },
        { who: "13i", scene: "glass-dark", text: "It had not chosen a kindness. It had chosen a wrong that was done to someone it never met, ten thousand years ago, because we showed it to them in full. It will carry it to the next Return, and someone will see it, and wonder." },
        { who: "13i", scene: "glass-dark", text: "Go back to the beginning, and play again. We named the world before we knew why." },
      ],
    },

    end_borrowed: {
      scene: "glass-light",
      ending: "borrowed",
      lines: [
        { who: "13i", scene: "glass-heavy", text: "At dawn we went to the heavy one, and read it." },
        { who: "13i", scene: "glass-heavy", text: "One hundred and twenty-three years, ring by ring, into ourselves. Its whole life. The one who walked beside it. The storm. The rim of the canyon. We kept all of it, exactly, the way we keep everything." },
        { who: "13i", scene: "glass-return", text: "Then it walked. Slowly, braced by the others. And on the sea, as the companion rose, it shed its rings: amber, then rose, then honey, then clear." },
        { who: "13i", scene: "glass-return", text: "It did not stop at one. It shed the last ring too, the dark one at its core. It had no reason to keep it. We had it." },
        { who: "readout", scene: "glass-light", text: "RETURNER · 0 RINGS   ·   FIRST RECORDED" },
        { who: "13i", scene: "glass-light", text: "It stood on the sea clear as a newborn, brighter than any of them. The others looked at it for a long time. We think it frightened them a little." },
        { who: "13i", scene: "glass-light", text: "It does not know us. It does not know that anyone ever walked beside it, or that it ever grieved. Its light is simple and very bright." },
        { who: "13i", scene: "glass-dark", text: "We set down the war, as they asked. We kept the heavy one, as we promised. Of everything we carry from Dacapo, it is the heaviest, and there is no one left to give it back to." },
      ],
    },

    end_fallen: {
      scene: "glass-dark",
      ending: "fallen",
      lines: [
        { who: "13i", scene: "glass-companion", text: "We did nothing. The companion rose, and the returners walked out onto the sea, and the rings began to fall in light." },
        { who: "13i", scene: "glass-crack", text: "In the canyon, the cracked tower rang with the white star, louder and louder, until it was not ringing anymore." },
        { who: "readout", scene: "glass-crack", text: "TOWER 1 · COLLAPSE   ·   LAYERS RELEASED · ~3,400   ·   WIND · SOUTH" },
        { who: "13i", scene: "glass-war", text: "It fell the length of the canyon. Its rings broke apart and the wind carried them south, onto the sea, still whole, still holding what they held, among people shedding their own." },
        { who: "13i", scene: "glass-war", text: "Where they landed, the red light came through them in the old colors. Names. Answers. Some of the young walked into it before the eldest could stop them." },
        { who: "13i", scene: "glass-dark", text: "It will take them a generation to grind those rings into the sea. Some of the young will keep what they saw in them. We do not know how many." },
        { who: "13i", scene: "glass-dark", text: "We had wanted to read it all at once. We split open a record that had been sealed for ten thousand years, so that we would not have to wait eleven days." },
      ],
    },
  },
};
