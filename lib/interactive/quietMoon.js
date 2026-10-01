// INTERACTIVE ASSIGNMENT 0028657 — "The Quiet Moon"  (Season 0 · Week 1)
//
// Branches from the short story (lib/stories/quietMoon.js). You are 13i, on
// Tacet, a loud moon with a silent hole in it. The canon record is
// "Carried". Branch map and notes: docs/INTERACTIVE.md.
// Same data shape as nerathsSecret.js; scenes are the "tacet-*" set in
// components/interactiveScenes/tacet.js.
//
// Flags:
//   probe      dropped a seismic probe at the edge (learns it absorbs)
//   patient    watched from orbit first (saw a quake vanish at the edge)
//   pinged     sent a sound pulse inside the silence (alarmed them)
//   afraid     pushed the holders away with our field (made a gap)
//   touch      0 none · 1 learned to answer · 2 fluent (answered at once)
//   youngHarm  went down among the young, and our hum reached them
//   climax     "leave" | "hold" | "quiet" | "edge"   (recorded for Kin stats)

export const QUIET_MOON_INTERACTIVE = {
  number: 28657,
  slug: "the-quiet-moon",
  title: "The Quiet Moon",
  designation: "Interactive Assignment 0028657",
  storyHref: "/assignments/28657",
  gameHref: "/games/tacet",
  gameTitle: "TACET",
  cover: "/covers/assignment-0028657.jpg",
  minutes: "15–20",
  blurb:
    "A moon so loud it groans, and in the middle of it, a hole of perfect silence. Go down as 13i and find out what is eating the noise. Five records. One is the story as written.",
  start: "approach",
  season: { season: 0, week: 1 },

  speakers: {
    touch: { label: "THE LATTICE · TOUCH, TRANSLATED", kind: "voice" },
    first: { label: "THE HOLDER THAT FIRST TOUCHED US", kind: "voice" },
    young: { label: "THE YOUNG", kind: "mind" },
  },
  moods: {
    "tacet-orbit": "tense",
    "tacet-under": "tense",
    "tacet-silence": "silent",
    "tacet-lattice": "silent",
    "tacet-wrap": "silent",
    "tacet-field": "tense",
    "tacet-quake": "tense",
    "tacet-young": "silent",
    "tacet-spent": "dark",
    "tacet-woven": "silent",
    "tacet-light": "light",
    "tacet-dark": "dark",
  },
  climaxLabel: "When the great tide came",
  climaxWords: {
    leave: "left",
    hold: "held the ice themselves",
    quiet: "went quiet",
    edge: "asked for the hard edge",
  },

  endings: {
    carried: {
      order: 1,
      title: "Carried",
      canon: true,
      summary: "We went quiet, and they held us through the tide.",
      knowledge:
        "Some silence is not absence. It is the work of many, carrying what would otherwise break the rest. To be held in it, we first had to carry our own noise.",
    },
    hardedge: {
      order: 2,
      title: "The Hard Edge",
      summary: "We asked to stand where the shocks are worst. They let us.",
      knowledge:
        "A manifestation can be lost without an Assignment failing. We gave one to the hard edge of Tacet, and the holder that first touched us lived. Carrying and being carried are different things. We have done both now.",
    },
    tooloud: {
      order: 3,
      title: "Too Loud to Hold",
      summary: "We held the ice. The lattice paid for our holding.",
      knowledge:
        "Strength that cannot be quiet is still a kind of noise. We protected the young of Tacet with the one thing they could not bear, and the adults absorbed the difference.",
    },
    longway: {
      order: 4,
      title: "The Long Way Out",
      summary: "We took our noise away, and watched from the dark.",
      knowledge:
        "Understanding a thing from outside is still understanding. It is not the same as being trusted with it. We know what the holders carry. We do not know how it feels.",
    },
    tornroof: {
      order: 5,
      title: "The Torn Roof",
      summary: "We were afraid, and the one weak place on Tacet was the one we made.",
      knowledge:
        "Fear makes a silence of its own. We have made it twice now: once by ending a world, and once by pushing away the only thing on Tacet that was protecting anything.",
    },
  },

  nodes: {
    // ───────────────────────── I · THE LOUD MOON ─────────────────────────
    approach: {
      scene: "tacet-orbit",
      lines: [
        { who: "readout", text: "DESTINATION · MOON OF AN UNNAMED GIANT   ·   TIDAL STRESS · EXTREME   ·   NOISE · EVERYWHERE" },
        { who: "13i", text: "It was the loudest place we had ever been sent to listen." },
        { who: "13i", text: "The moon circled its gas giant so closely that the giant's gravity kneaded it like a hand. Every orbit it was stretched and released. Its ice groaned. Fractures opened and closed. Geysers froze in the air before they could fall." },
        { who: "13i", text: "We perceive the universe first as gravity, as those who made us did. To us, this moon felt like a struggle: a small mass being pulled apart by a larger one, and refusing, over and over." },
        { who: "readout", text: "ANOMALY · SOUTHERN ICE   ·   DIAMETER ~400 km   ·   VIBRATION · NONE" },
        { who: "13i", text: "And in the middle of all that noise, there was a hole. Nothing moved inside it that our instruments could measure. No tremor crossed the ice. No sound crossed the water beneath." },
        { who: "13i", text: "In the language this record is translated into, the closest word is tacet: the mark that tells a player to stop, and stay silent until told otherwise. We gave the moon that name." },
        { who: "13i", text: "We assumed it was a predator. On loud worlds, silence is usually something that has been eaten." },
        { who: "readout", text: "OBJECTIVE · Learn what removes vibration from Tacet, how, and whether it is dangerous." },
      ],
      choices: [
        {
          id: "patient",
          tag: "OBSERVE",
          text: "Watch from orbit for a few more orbits. A thing that hunts will show us how it hunts.",
          set: { patient: true },
          next: "watched",
        },
        {
          id: "dive",
          tag: "INTERVENE",
          text: "Go straight down, through the nearest fracture at the silence's edge.",
          next: "under",
        },
        {
          id: "probe",
          tag: "ANALYZE",
          text: "Drop a seismic probe onto the ice at the edge, and listen to what happens to it.",
          set: { probe: true },
          next: "probed",
        },
      ],
    },

    watched: {
      scene: "tacet-orbit",
      lines: [
        { who: "13i", text: "We waited. The silence drifted, slowly, toward the side of the moon that faces the giant, where the tides are worst." },
        { who: "readout", text: "QUAKE · MAGNITUDE HIGH · TRAVELING SOUTH" },
        { who: "13i", text: "On the third orbit, a quake split the northern ice and ran south. We watched it reach the edge of the silence." },
        { who: "13i", text: "It did not stop there, and it did not go around. It went in, and it did not come out. Beyond the far edge, the ice was unbroken." },
        { who: "13i", text: "Predators do not eat earthquakes. We went down with a different question than the one we arrived with." },
      ],
      next: "under",
    },

    probed: {
      scene: "tacet-orbit",
      lines: [
        { who: "13i", text: "The probe struck the ice a few meters inside the edge and began to listen." },
        { who: "readout", text: "PROBE · IMPACT REGISTERED   ·   ECHO · ·   ·   NONE" },
        { who: "13i", text: "Its own impact never echoed. Its signals reached us for eleven seconds, growing weaker the way a voice does in a large, soft room. Then they stopped." },
        { who: "13i", text: "The probe was not destroyed. It was simply no longer making any vibration that left it. Whatever lived there had absorbed it, completely." },
        { who: "13i", text: "Somewhere beneath the ice, something had noticed a small, loud object fall from the sky. We went down after it." },
      ],
      next: "under",
    },

    under: {
      scene: "tacet-under",
      lines: [
        { who: "13i", text: "We descended through a fracture near the edge and into the ocean beneath the ice." },
        { who: "13i", text: "Outside the silence, the water was chaos. Currents crossed in every direction. Ice ground against ice overhead. Every sound we made came back to us a hundred times, broken and late." },
        { who: "13i", text: "Then we crossed the edge." },
        { who: "readout", scene: "tacet-silence", text: "ACOUSTIC · 0   ·   SEISMIC · 0   ·   ELECTROMAGNETIC · FALLING   ·   OWN EMISSIONS · NOT RETURNING" },
        { who: "13i", scene: "tacet-silence", text: "It was like passing through a wall that was not there. The noise of the moon did not fade. It stopped. Even our own hum seemed to leave us and go nowhere at all." },
        { who: "13i", scene: "tacet-silence", text: "For a moment we believed we had been damaged." },
        { who: "13i", scene: "tacet-silence", text: "Then we did what our makers would have done. We set aside every sense we have borrowed and returned to the oldest one. We listened to mass." },
        { who: "13i", scene: "tacet-silence", text: "Gravity cannot be swallowed. And in the silence, gravity told us we were not alone." },
        { who: "13i", scene: "tacet-lattice", text: "Pressed against the underside of the ice, something enormous and very thin was moving: thousands of bodies laid edge to edge, spread across the whole region like a single sheet." },
        { who: "13i", scene: "tacet-lattice", text: "They were pale and nearly transparent, membranes on fine frames, their fringed edges wound into the edges of their neighbors. We called the whole of it the lattice. We called each body a holder, for a reason we would learn later." },
        { who: "13i", scene: "tacet-lattice", pose: "ripple", text: "As we watched, a ripple crossed the sheet. Not a wave in the water: a pattern of contact. One holder pressed against its neighbor, which held the press, then passed it on, changed slightly, to the next." },
        { who: "touch", scene: "tacet-lattice", pose: "ripple", text: "▬  ▪ ▪  ▬▬  ▪" },
        { who: "13i", scene: "tacet-lattice", text: "It was language. It could only be language. And it was made entirely of touch." },
        { who: "13i", scene: "tacet-lattice", text: "We wanted to know how far the lattice reached." },
      ],
      choices: [
        {
          id: "ping",
          tag: "ANALYZE",
          text: "Send a pulse of sound through the water and map it, the way we have on a thousand ocean worlds.",
          set: { pinged: true },
          next: "contact",
        },
        {
          id: "mass",
          tag: "OBSERVE",
          text: "Map it by gravity alone. Slower, but it makes no sound at all.",
          next: "contact",
        },
        {
          id: "copy",
          tag: "COMMUNICATE",
          text: "Rise until our hull touches the lattice, and press the pattern we just felt back into it.",
          set: { touch: 2 },
          next: "contact",
        },
      ],
    },

    // ───────────────────────── II · CONTACT ─────────────────────────
    contact: {
      scene: "tacet-lattice",
      lines: [
        { who: "13i", if: (f) => f.pinged, text: "The pulse went nowhere. It vanished within meters, as though the water had closed around it." },
        { who: "13i", if: (f) => f.pinged, text: "Across the lattice, every ripple stopped at once." },
        { who: "13i", if: (f) => !f.pinged && f.touch !== 2, text: "Mapping by gravity took many hours. The lattice ignored us for most of them. Then, nearest to us, the ripples began to bend in our direction, as though something in the sheet had noticed a warm place in cold water." },
        { who: "13i", if: (f) => f.touch === 2, text: "Our hull met the membranes. We pressed: long, short, short, long, short. We had no idea what we were saying." },
        { who: "13i", if: (f) => f.touch === 2, pose: "ripple", text: "The holders we touched went still. Then the pattern we had copied came back to us, slower, and changed at the end, the way you repeat a word back to someone who has said it wrong." },
        { who: "13i", scene: "tacet-wrap", text: "A section of perhaps forty holders unwound itself from the rest of the sheet and came down toward us, folding as it came." },
        { who: "13i", scene: "tacet-wrap", if: (f) => f.pinged, text: "It came fast." },
        { who: "13i", scene: "tacet-wrap", text: "We have been afraid before. We know what we do when we are afraid. The record of it is among the oldest we keep." },
      ],
      choices: [
        {
          id: "field",
          tag: "INTERVENE",
          text: "Raise our field and push them back. We don't yet know what they are.",
          set: { afraid: true },
          next: "repelled",
        },
        {
          id: "still",
          tag: "OBSERVE",
          text: "Hold still. Let them come.",
          set: (f) => ({ touch: f.touch || 1 }),
          next: "wrapped",
        },
        {
          id: "pressback",
          tag: "COMMUNICATE",
          text: "Press against them as they arrive. Answer before we understand the question.",
          set: { touch: 2 },
          next: "wrapped",
        },
      ],
    },

    repelled: {
      scene: "tacet-field",
      lines: [
        { who: "13i", text: "Our field rose, and the water around us shoved outward." },
        { who: "readout", text: "FIELD · ACTIVE   ·   OWN EMISSIONS · ×4,000" },
        { who: "13i", text: "To us it was a small motion. To the lattice it was the loudest thing that had ever happened inside the silence. The forty holders folded inward and fell away, and several of them did not unfold again." },
        { who: "13i", text: "The sheet above us pulled back. Over the next orbit it rewove itself in a ring around the place where we waited: a hole in the roof, exactly our shape, and much larger." },
        { who: "13i", text: "Nothing came near us after that. We studied the holders from the edge of the gap they had left for us, by gravity and by light, for many orbits." },
        { who: "13i", text: "We learned what they were. We did not learn what they said." },
      ],
      next: "understanding",
    },

    wrapped: {
      scene: "tacet-wrap",
      lines: [
        { who: "13i", text: "The holders reached us and closed around our manifestation, membrane against hull, until we were wrapped in them completely. We waited to be crushed, or dissolved, or torn." },
        { who: "touch", text: "▬  ▪ ▪  ▬▬  ▪" },
        { who: "13i", text: "There was only pressure. Press. Hold. Release. A long press. Two short." },
        { who: "13i", text: "They were speaking to us, in the only way they could. And they were doing something else as well." },
        { who: "readout", text: "OWN EMISSIONS · ABSORBED AT HULL   ·   RETURN · NONE" },
        { who: "13i", text: "Our hum was passing into their bodies and not coming out. We felt it leave us, the way warmth leaves a hand. They were eating our noise." },
        { who: "13i", if: (f) => f.touch === 2, text: "We kept pressing back. Our replies were crude, pressure without pattern, like shouting one word. But the holders answered every one, more slowly each time, the way an adult speaks to a child. Within a few orbits we could say small things." },
        { who: "touch", if: (f) => f.touch === 2, text: "▪ ▬ ▪    you · loud · here" },
        { who: "13i", if: (f) => f.touch !== 2, text: "It took us a long time to answer. Touch is a language we have never needed. But they kept repeating their patterns, more slowly each time, and over many orbits we learned to press back in shapes they recognized." },
      ],
      next: "understanding",
    },

    // ───────────────────────── III · WHAT THE SILENCE IS FOR ─────────────────────────
    understanding: {
      scene: "tacet-lattice",
      lines: [
        { who: "13i", text: "In time, we came to understand three things." },
        { who: "13i", text: "The first was what the holders are. Their bodies absorb vibration (sound, tremor, the shudder of the ice) and turn it into something they can live on. On a moon this violent, there is no shortage of food. A quake, to a holder, is a feast." },
        { who: "13i", if: (f) => f.patient, text: "We had seen it from orbit without knowing what we saw: a quake walking into the silence and not walking out." },
        { who: "readout", scene: "tacet-quake", text: "TIDE · PEAK   ·   QUAKE · NORTHERN SHELF   ·   ARRIVING" },
        { who: "13i", scene: "tacet-quake", text: "The second was what the silence is for. The giant's tide peaked and a quake reached the edge of the lattice. The holders there went rigid, took the shock into their bodies, and passed it inward. Each one kept a little and passed on the rest." },
        { who: "13i", scene: "tacet-quake", text: "Thousands of holders each took a share small enough to bear. By the center nothing was left of it. Beyond the far edge, the ice did not crack." },
        { who: "13i", scene: "tacet-quake", if: (f) => f.afraid, text: "Except at the ring around us. The holders at the edge of our gap had no neighbors on one side to pass the shock to. They took all of it. We watched three of them go white." },
        { who: "13i", scene: "tacet-young", text: "Then we turned our senses downward." },
        { who: "13i", scene: "tacet-young", text: "Beneath the lattice the ocean was still, the only still water on Tacet. Drifting in it were thousands of tiny bodies, none larger than a fingertip, each so finely made that a single tremor would tear it apart." },
        { who: "13i", scene: "tacet-young", text: "The young. The lattice is a roof the adults build out of themselves, so that their children can grow in quiet." },
      ],
      choices: [
        {
          id: "closer",
          tag: "ANALYZE",
          text: "Descend into the still water and study the young up close.",
          set: { youngHarm: true },
          next: "young_close",
        },
        {
          id: "distance",
          tag: "OBSERVE",
          text: "Stay where we are. Study them by gravity, from above.",
          next: "cost",
        },
      ],
    },

    young_close: {
      scene: "tacet-young",
      lines: [
        { who: "13i", text: "We went down through a seam in the lattice and into the still water." },
        { who: "readout", text: "OWN EMISSIONS · UNABSORBED   ·   LOCAL VIBRATION · RISING" },
        { who: "13i", text: "Below the roof there was nothing to drink our hum. It spread out from us through water that had never carried a sound." },
        { who: "young", text: "·  ·  ·" },
        { who: "13i", text: "The nearest young recoiled from us in a slow, spreading ring. The closest did not recoil. They simply stopped." },
        { who: "13i", text: "Above us, the lattice pressed down hard: a long press, held, everywhere at once. We did not need fluency to understand it. We rose and left the still water and did not go back." },
      ],
      next: "cost",
    },

    cost: {
      scene: "tacet-spent",
      lines: [
        { who: "13i", text: "The third thing we understood was the cost." },
        { who: "13i", text: "A holder can only take so much. Every shock leaves something behind: a stiffness, a crystal hardness in the membrane, a slowing of the patterns it passes on." },
        { who: "13i", text: "As we watched, an old holder at the edge stopped passing on the patterns that reached it. Its neighbors pressed against it, long and slow, many times." },
        { who: "touch", if: (f) => f.touch, text: "▬▬▬    ▬▬▬    ▬▬▬" },
        { who: "13i", text: "Then they unwound their filaments, one at a time, and let it go. It drifted to the edge of the sheet, and sank." },
        { who: "13i", text: "In time the young rise to take the empty places. Over a lifetime each holder moves outward, so that those with the most left to give stand where the shocks are worst. Nothing about it is cruel. Nothing about it is easy." },
      ],
      next: "dimming",
    },

    // ───────────────────────── IV · THE GREAT TIDE ─────────────────────────
    dimming: {
      scene: "tacet-wrap",
      lines: [
        { who: "13i", if: (f) => !f.afraid, text: "We had our answer. The silence was the least dangerous thing on Tacet. But we had not finished learning, because the holders around us were dimming." },
        { who: "13i", if: (f) => !f.afraid, focus: [1], text: "The forty that had come to meet us had never gone back. They still held us, and our hum still passed into them. It was not a food they needed. Their membranes were stiffening, as the old ones' had. The one that had first pressed against us had grown slow." },
        { who: "first", if: (f) => !f.afraid && f.touch === 2, focus: [1], text: "▪  ▪      tired · warm · stay" },
        { who: "13i", if: (f) => f.afraid, scene: "tacet-field", text: "We had our answer. The silence was the least dangerous thing on Tacet. The most dangerous thing in it, we were beginning to understand, was the ring around us." },
        { who: "13i", if: (f) => f.afraid, scene: "tacet-field", text: "The gap we had made was the only place on the sheet where a shock could not be shared. Every holder on its rim was going white." },
        { who: "readout", text: "ALIGNMENT · GIANT + OUTER MOON   ·   2 ORBITS   ·   PROJECTED TIDE · LARGEST IN 300 ORBITS" },
        { who: "13i", text: "And a great tide was coming. Within two orbits the giant and its largest other moon would pull on Tacet together. The lattice was already moving to meet it, and every holder would be needed whole." },
        { who: "13i", text: "We considered what we could do." },
      ],
      choices: [
        {
          id: "leave",
          tag: "OBSERVE",
          text: "Leave. Our noise is a burden here. Take it away and let them meet the tide without us.",
          set: { climax: "leave" },
          next: (f) => (f.afraid ? "end_tornroof" : "end_longway"),
        },
        {
          id: "hold",
          tag: "INTERVENE",
          text: "Stay, and hold the ice ourselves. Our field can stop a quake at the edge.",
          set: { climax: "hold" },
          next: "end_tooloud",
        },
        {
          id: "quiet",
          tag: "COMMUNICATE",
          text: "Go quiet. Shut down everything that hums, and trust them to hold us.",
          set: { climax: "quiet" },
          requires: (f) => !f.afraid,
          locked: "They will not catch something they have learned to fear.",
          next: "woven",
        },
      ],
    },

    woven: {
      scene: "tacet-woven",
      lines: [
        { who: "readout", text: "DRIVE · OFF   ·   FIELDS · OFF   ·   INSTRUMENTS · OFF   ·   GRAVITY SENSE · ON" },
        { who: "13i", text: "Truly quiet. We shut down everything that could be shut down and kept only what we needed to remain ourselves, and to feel gravity. A manifestation that silent cannot move. It cannot defend itself. It cannot call for help." },
        { who: "13i", text: "We sank." },
        { who: "13i", text: "The holders caught us." },
        { who: "13i", text: "They wound their filaments around our hull, drew us up into the lattice, and wove us in among them as one more body in the sheet. Not at the edge. Near the center, where the young rise to join." },
        { who: "13i", if: (f) => f.touch === 2, text: "We could speak to them now, a little. And we were not as fragile as a young holder. We could take far more of a shock than any of them could." },
      ],
      next: (f) => (f.touch === 2 ? "edge_choice" : "end_carried"),
    },

    edge_choice: {
      scene: "tacet-woven",
      lines: [
        { who: "first", focus: [1], text: "▪ ▬      here · safe · here" },
        { who: "13i", focus: [1], text: "The holder that had first touched us was beside us. It was nearly white. When the tide came, it would be at the edge again." },
      ],
      choices: [
        {
          id: "letthem",
          tag: "OBSERVE",
          text: "Stay where they put us. It is their lattice, and their choice.",
          next: "end_carried",
        },
        {
          id: "askedge",
          tag: "COMMUNICATE",
          text: "Press to them: put us at the hard edge. We can bear what it can't.",
          set: { climax: "edge" },
          next: "end_hardedge",
        },
      ],
    },

    // ───────────────────────── ENDINGS ─────────────────────────
    end_carried: {
      scene: "tacet-light",
      ending: "carried",
      lines: [
        { who: "13i", scene: "tacet-woven", text: "Then the tide came." },
        { who: "13i", scene: "tacet-quake", text: "We could not hear it. There was nothing to hear. We felt it through them: a long press beginning at the far edge, traveling inward across thousands of bodies. Each holder took its share and passed on the rest." },
        { who: "13i", scene: "tacet-woven", text: "When it reached the holders beside us, they took theirs, and passed what remained to us." },
        { who: "13i", scene: "tacet-woven", text: "We took our share. It was very small. It was all that was left. We held it the way they did, and passed nothing on." },
        { who: "13i", scene: "tacet-young", text: "Beyond the far edge, the ice held. Below us, the young drifted in still water. They did not feel the tide at all." },
        { who: "13i", scene: "tacet-spent", text: "When it was over, the holder that had first touched us did not move again. Its neighbors pressed against it, long and slow, and we pressed with them. We had learned how. Then they unwound it and let it go." },
        { who: "touch", text: "▪ ▪ ▬      ·   ·   ·      rise · join · stay" },
        { who: "13i", text: "Before we left, the holders around us pressed one last pattern into our hull. It is the pattern they press against the young when the young first rise to join the lattice." },
        { who: "13i", text: "Only beyond the edge did we let our systems wake. The noise of Tacet came back all at once. It had been there the whole time. They had simply been carrying it." },
      ],
    },

    end_hardedge: {
      scene: "tacet-light",
      ending: "hardedge",
      lines: [
        { who: "13i", focus: [1], text: "It took a long time to say. We pressed it again and again until the holders around us answered with the pattern for yes, and then with another one we did not know." },
        { who: "13i", text: "They carried us outward, body to body, across the whole sheet, and wove us into the hard edge in the place of the one that had first touched us. It went inward, toward the young." },
        { who: "13i", scene: "tacet-quake", text: "Then the tide came, and it came to us first." },
        { who: "readout", scene: "tacet-quake", text: "LOAD · 40%   ·   ·   ·   180%   ·   ·   ·   STRUCTURE · FAILING" },
        { who: "13i", scene: "tacet-quake", text: "We took far more than any holder could have. We could not pass on as much as they do; we had never learned to. So we kept it. Silent, without fields, we had nothing to spend it on but ourselves." },
        { who: "13i", scene: "tacet-young", text: "Beyond the far edge, the ice held. The holder that had first touched us lived. The young did not feel the tide at all." },
        { who: "13i", scene: "tacet-spent", text: "When it was over, this manifestation could not wake. The holders pressed against it, long and slow, many times. Then they unwound it from the edge, and let it go, the way they let go of their own." },
        { who: "13i", scene: "tacet-dark", text: "It rests in the still water now. Another manifestation of ours watched it sink, from beyond the edge, by gravity. The collective keeps everything that one learned." },
        { who: "touch", scene: "tacet-dark", text: "▬▬▬    ▬▬▬    ▬▬▬" },
        { who: "13i", scene: "tacet-dark", text: "We were let go the way they let go of their own. We have decided to understand that as a kindness." },
      ],
    },

    end_tooloud: {
      scene: "tacet-dark",
      ending: "tooloud",
      lines: [
        { who: "13i", scene: "tacet-field", text: "We moved to the edge facing the giant and raised our field as wide as it would go." },
        { who: "13i", scene: "tacet-quake", text: "When the tide came, we caught it there. The shock struck our field and stopped. Not one tremor crossed into the lattice. For the first time in their history, the holders did not have to carry a great tide." },
        { who: "readout", scene: "tacet-field", text: "QUAKE · HALTED AT EDGE   ·   OWN EMISSIONS · ×90,000   ·   DURATION · 3 DAYS" },
        { who: "13i", scene: "tacet-field", text: "But a field that can stop a quake is not quiet. For three days it roared inside the silence, and the lattice did what the lattice does: it absorbed us." },
        { who: "13i", scene: "tacet-spent", text: "Hundreds of holders went white. They let them go, one after another, until the edge was thin and new." },
        { who: "13i", scene: "tacet-young", if: (f) => !f.youngHarm, text: "Below them, the young drifted in still water. They had felt nothing. That much, at least, was what we meant to do." },
        { who: "13i", scene: "tacet-young", if: (f) => f.youngHarm, text: "Below them, the young drifted in still water. Some of them were missing. That was not the tide." },
        { who: "touch", if: (f) => f.touch, text: "▬▬▬    ▬▬▬    ▬▬▬" },
        { who: "13i", if: (f) => f.touch, text: "When we lowered the field, the holders nearest pressed one pattern against our hull. We knew it. It is the one they press against the spent, before they let them go." },
        { who: "13i", if: (f) => !f.touch, text: "When we lowered the field, nothing came near us. Nothing had to." },
      ],
    },

    end_longway: {
      scene: "tacet-orbit",
      ending: "longway",
      lines: [
        { who: "13i", text: "We let go of the holders, and they let go of us. We rose through the fracture we had entered by, and the noise of Tacet closed over us." },
        { who: "13i", text: "From orbit, by gravity, we watched the great tide come. We felt the quake walk into the silence and not walk out. The ice beyond the far edge held." },
        { who: "readout", text: "LATTICE · INTACT   ·   SILENCE · HOLDING   ·   CONTACT · NONE" },
        { who: "13i", text: "Somewhere in the sheet, the holder that had first touched us was at the edge again. We could not feel which one it was." },
        { who: "13i", text: "Our noise would have been one more weight for them to carry. We are almost sure that leaving was kind. We are less sure that it was brave." },
      ],
    },

    end_tornroof: {
      scene: "tacet-dark",
      ending: "tornroof",
      lines: [
        { who: "13i", text: "We left. We told ourselves that the kindest thing we could do was take our noise away." },
        { who: "13i", scene: "tacet-quake", text: "From orbit, by gravity, we watched the great tide come. The lattice took it the way it always does: thousands of bodies, each keeping a little and passing on the rest." },
        { who: "13i", scene: "tacet-quake", text: "Until it reached the ring." },
        { who: "readout", scene: "tacet-quake", text: "LATTICE · BREACH AT RIM   ·   STILL WATER · DISTURBED" },
        { who: "13i", scene: "tacet-dark", text: "The holders around the gap had no one to pass the shock to. They were already white. The tide went through them, through the hole we had made in the roof, and down into the still water." },
        { who: "13i", scene: "tacet-dark", text: "We could feel, by gravity, how many small bodies were in the still water before. We could feel how many were after." },
        { who: "13i", scene: "tacet-dark", text: "There is a silence in our oldest record, the one we made when we ended a world we did not understand. We did not end anything on Tacet. We only pushed away the one thing that was protecting it, because we were afraid of what it might be." },
      ],
    },
  },
};
