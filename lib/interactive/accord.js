// INTERACTIVE ASSIGNMENT 3524578 — "The Accord"  (Season 1 · Week 8)
//
// Branches from the short story (lib/stories/accord.js). You are 13i on
// Tutti, the fullest world it has recorded, studying the Pell: finger-sized
// people who keep the Accord, a sung list of agreements with two hundred
// other species. One thing has never answered: a vine eating the forest.
// The canon record is "The Two Hundred and Second Voice".
// Scenes: the "tu-*" set in components/interactiveScenes/tutti.js.
//
// Flags:
//   counted   we weighed the whole living world from orbit first
//   down      we went straight down into the Wood
//   offered   we told the Pell we could give them anything
//   nothing   we told the Pell we give nothing
//   deep      we felt what is under the vine
//   burned    we burned the vine ourselves
//   climax    "shown" | "told" | "burned" | "left"

export const ACCORD_INTERACTIVE = {
  number: 3524578,
  slug: "the-accord",
  title: "The Accord",
  designation: "Interactive Assignment 3524578",
  storyHref: "/assignments/3524578",
  gameHref: "/games/tutti",
  gameTitle: "TUTTI",
  cover: "/covers/assignment-3524578.jpg",
  minutes: "15–20",
  blurb:
    "The fullest world you have ever felt, and the smallest people on it, who run it by agreement with two hundred other species. Nothing joins their Accord without answering: what do you give, and what do you take? Five records. One is the story as written.",
  start: "arrival",
  season: { season: 1, week: 8 },

  speakers: {
    pell: { label: "A PELL · TRANSLATED", kind: "voice" },
    elder: { label: "THE ELDER · TRANSLATED", kind: "voice" },
    song: { label: "THE ACCORD", kind: "voice" },
  },
  moods: {
    "tu-roar": "light",
    "tu-wood": "calm",
    "tu-pell": "calm",
    "tu-loom": "calm",
    "tu-accord": "light",
    "tu-south": "tense",
    "tu-frame": "dark",
    "tu-elders": "silent",
    "tu-light": "light",
    "tu-dark": "dark",
  },
  climaxLabel: "When we knew what the vine was",
  climaxWords: {
    shown: "took the Pell to see it",
    told: "told the Pell",
    burned: "burned the vine",
    left: "left it unasked",
  },

  endings: {
    voice: {
      order: 1,
      title: "The Two Hundred and Second Voice",
      canon: true,
      summary: "We showed them what the vine becomes, and answered: we give the long view.",
      knowledge:
        "A people can be measured by how well they work with each other. A rarer people should be measured by how long they are willing to keep asking someone who has never answered. Sometimes the answer is that you were asking the wrong question of the right one.",
    },
    gift: {
      order: 2,
      title: "The Gift Too Large",
      summary: "We offered them anything. Now the whole Accord is arranged around what we give.",
      knowledge:
        "We saved the loom-beasts and gave the Pell everything they asked for after. Every species on Tutti now trades first with the Pell, because the Pell trade with us. An Accord of two hundred equals has become a ladder with us at the top. We did not mean to climb it. We only offered too much.",
    },
    divided: {
      order: 3,
      title: "The Divided Song",
      summary: "We told them what the vine was. Half of them believed us.",
      knowledge:
        "We told the truth, and it was not enough, because the Pell have never taken a word on trust that they could touch instead. Six towns tend the vine now. Five burned their stretch of it. The yearly song has a gap in it where the towns disagree. Being right is not the same as being understood.",
    },
    clearing: {
      order: 4,
      title: "The Clearing",
      summary: "We burned the vine to save the Wood. The Wood was saved.",
      knowledge:
        "We did, in one night, the thing the Pell had refused to do for nine hundred years. The forest stood. Four hundred years later the last loom-beast lay down, and none rose after it, and the Pell towns came down out of the trees onto the ground. We had removed the one species no one was asking us to judge.",
    },
    unasked: {
      order: 5,
      title: "The Unasked",
      summary: "We never answered, and left. Now we are the voice they sing as a question.",
      knowledge:
        "We took what we learned and went, because it was not our place to answer for the vine. A hundred and twenty years later it stood up and walked, and the Pell understood at last. They added it to the Accord. They added us too, as a voice they sing very quietly, with a question at the end: the one who saw, and did not say.",
    },
  },

  nodes: {
    // ───────────────────────── I · TUTTI ─────────────────────────
    arrival: {
      scene: "tu-roar",
      lines: [
        { who: "13i", text: "We had never heard a world so full." },
        { who: "13i", text: "It came to us before we could see it: a roar of mass, everywhere at once. Forests the height of towers. Herds the size of hills. Rivers so thick with swimming bodies that their mass rippled." },
        { who: "readout", text: "BIOMASS · OFF SCALE   ·   DISTINCT MOVING BODIES · UNCOUNTABLE" },
        { who: "13i", text: "In the language this record is translated into, the closest word for it is tutti: the mark where every instrument plays at once. We named the world before we had learned the name of a single thing that lived there." },
        { who: "13i", text: "Our Assignment was the one we always carry. Find the people who think, and learn how well they work together." },
      ],
      choices: [
        {
          id: "count",
          tag: "ANALYZE",
          text: "Weigh the whole living world from orbit before going anywhere near it.",
          set: { counted: true },
          next: "counted",
        },
        {
          id: "listen",
          tag: "OBSERVE",
          text: "Go down slowly, small and quiet, and listen.",
          next: "wood",
        },
        {
          id: "dive",
          tag: "INTERVENE",
          text: "Go straight down into the forest. Find them fast.",
          set: { down: true },
          next: "dive",
        },
      ],
    },

    counted: {
      scene: "tu-roar",
      lines: [
        { who: "13i", text: "It took us four days to weigh it. We stopped counting species at nine thousand." },
        { who: "13i", text: "But there was a pattern in the noise. Some of the masses moved together, again and again: small ones riding large ones, slow ones following fast ones, things in the air keeping pace with things on the ground. Partnerships. Hundreds of them." },
        { who: "13i", text: "And one mass, along the southern edge of the great forest, that partnered with nothing at all. It was growing." },
      ],
      next: "wood",
    },

    dive: {
      scene: "tu-wood",
      lines: [
        { who: "13i", text: "We dropped into the canopy, and everything noticed us at once." },
        { who: "13i", text: "A flock of fliers the size of sails burst out of the trees screaming. Something the size of a house drummed a warning on a hollow trunk. For a hundred kilometres, the forest went quiet, and stayed quiet for a day." },
        { who: "13i", text: "Nothing on Tutti goes unnoticed. We had learned that the hard way. We made ourselves small and still, and waited until the forest started talking again." },
      ],
      next: "wood",
    },

    wood: {
      scene: "tu-wood",
      lines: [
        { who: "13i", text: "It took us nine days to find the people who think, because on Tutti, nothing stands out." },
        { who: "13i", scene: "tu-pell", text: "They were very small. A Pell is about the length of a human finger, with six limbs, and a long tail they speak with: it flickers through patterns of colour faster than we could follow at first." },
        { who: "13i", scene: "tu-pell", text: "Forty million of them, on a world crowded with things a thousand times their size. By every measure we use, the Pell should have been prey. Instead, they were running the forest." },
        { who: "13i", text: "A flier would drop onto a branch, and a Pell would climb onto its back and tie a coloured cord around its neck, and the flier would carry the Pell three hundred kilometres. On the ground, a glowing moss lined the paths, and the Pell fed it scraps as they passed." },
        { who: "13i", scene: "tu-loom", text: "And on the backs of the loom-beasts, there were towns." },
        { who: "13i", scene: "tu-loom", text: "A grown loom-beast is the size of a hill. It grazes a path through the forest that takes four hundred years to complete. Forests grow on its back. On those forests, the Pell build towns, and keep its skin clean, and walk ahead of it to warn it of soft ground." },
        { who: "13i", scene: "tu-accord", text: "We counted the arrangements we could see. There were two hundred of them. The Pell call it the Accord: a list, sung in tail-colours, of every species they have an agreement with, what they owe it, and what it gives." },
        { who: "song", scene: "tu-accord", text: "the fliers carry · the moss lights · the dam-fish hold the water · the loom-beasts walk · the drum-trees warn ·  · ·" },
      ],
      next: "asked",
    },

    // ───────────────────────── II · WHAT DO YOU GIVE ─────────────────────────
    asked: {
      scene: "tu-pell",
      lines: [
        { who: "13i", if: (f) => !f.down, text: "On the ninth day, a Pell found us. It climbed out onto the end of a branch, as close as it could get, and flickered at us very slowly, the way you would speak to a child." },
        { who: "13i", if: (f) => f.down, text: "On the ninth day, a Pell found us. It had been sent. The whole forest had been looking for whatever had frightened the fliers, and it climbed out onto the end of a branch and flickered at us very slowly, the way you would speak to a child." },
        { who: "pell", text: "what do you give. and what do you take." },
        { who: "13i", text: "It had been saying the same thing over and over, patiently, the whole time. Nothing joins the Accord without answering." },
      ],
      choices: [
        {
          id: "wait",
          tag: "OBSERVE",
          text: "Don't answer yet. We don't know what we can give without changing them.",
          next: "south",
        },
        {
          id: "nothing",
          tag: "COMMUNICATE",
          text: "Answer honestly: we give nothing. We only take what we learn.",
          set: { nothing: true },
          next: "nothing",
        },
        {
          id: "anything",
          tag: "COMMUNICATE",
          text: "Answer generously: we can give you anything. Medicine, tools, knowledge.",
          set: { offered: true },
          next: "offered",
        },
      ],
    },

    nothing: {
      scene: "tu-pell",
      lines: [
        { who: "pell", text: "then you are unasked." },
        { who: "13i", text: "It was not angry. It said it the way you would say a thing is raining. It climbed back down the branch, and for a long time no Pell came near us." },
        { who: "13i", text: "We had not understood yet what that word meant to them. We would learn it at the southern edge of the forest." },
      ],
      next: "south",
    },

    offered: {
      scene: "tu-pell",
      lines: [
        { who: "13i", text: "The Pell's tail went very still. Then it flickered something to the branches above, and more Pell came out to look at us." },
        { who: "pell", text: "anything is too much. what would the fliers give back to you. what would the moss." },
        { who: "13i", text: "They did not refuse us. They took the question away to their towns, and argued it for days. We had offered them a gift no one in the Accord could ever repay. We did not yet understand what that would do." },
      ],
      next: "south",
    },

    // ───────────────────────── III · THE UNASKED ─────────────────────────
    south: {
      scene: "tu-south",
      lines: [
        { who: "13i", text: "The Accord had one hole in it." },
        { who: "13i", text: "Along the southern edge of the Great Wood, something was eating the forest. A vine, grey-green and thick as a loom-beast's leg, climbing the great trees and strangling them, slowly, over decades. Where it had been, the forest was gone." },
        { who: "13i", text: "It answered no songs. It traded with nothing. The Pell called it by a word that meant, as nearly as we could translate, the unasked." },
        { who: "13i", text: "They could have burned it. In all their history, the Pell had never driven a species out of the Wood, only asked it, again and again, until it answered. The fliers had once eaten Pell. It had taken some of them a thousand years to answer." },
        { who: "readout", if: (f) => f.counted, text: "MASS · SOUTHERN EDGE · GROWING   ·   PARTNERSHIPS · NONE" },
        { who: "13i", text: "The vine had been unasked for as long as the Pell had kept the list, and it was moving north." },
      ],
      choices: [
        {
          id: "feel",
          tag: "ANALYZE",
          text: "Feel what is under it. We perceive mass; look where the Pell can't.",
          set: { deep: true },
          next: "frame",
        },
        {
          id: "burn",
          tag: "INTERVENE",
          text: "Burn it ourselves, quietly, in one night. The Pell never have to choose.",
          set: { burned: true, climax: "burned" },
          next: "end_clearing",
        },
        {
          id: "leave",
          tag: "OBSERVE",
          text: "It's their Accord. Record it, and go.",
          set: { climax: "left" },
          next: "end_unasked",
        },
      ],
    },

    frame: {
      scene: "tu-frame",
      lines: [
        { who: "13i", text: "Its roots went down further than any root on Tutti. And deep beneath the strangled forest, in the dark, the vine was building something." },
        { who: "13i", text: "Not roots. A frame. Long, curving, mineral-hard, growing year by year. The shape of it, when we had traced the whole thing, was one we had seen walking across the surface every day we had been on Tutti." },
        { who: "readout", text: "SUBSURFACE STRUCTURE · 1.9 KM   ·   FORM · LOOM-BEAST (SKELETAL)   ·   COMPLETE · 71%" },
        { who: "13i", text: "At the centre of the oldest tangle, under three hundred years of growth, lay the bones of a loom-beast that had died there. The vine had grown out of them." },
        { who: "13i", text: "When a loom-beast dies, its body seeds the ground. The vine eats the forest for three or four hundred years, storing everything in the frame it builds below. Then, one day, the frame stands up." },
        { who: "13i", text: "A Pell lives about thirty years. No Pell had ever watched one vine long enough. They had been asking it what it wanted for nine hundred years, and it had been, all along, the children of their oldest partner." },
      ],
      choices: [
        {
          id: "show",
          tag: "COMMUNICATE",
          text: "Take them to it. Let them put their hands on the ground and feel it for themselves, then answer: we give the long view.",
          set: { climax: "shown" },
          next: (f) => (f.offered ? "end_gift" : "end_voice"),
        },
        {
          id: "tell",
          tag: "COMMUNICATE",
          text: "Tell them what we found, plainly, from the branch. They can decide what to believe.",
          set: { climax: "told" },
          next: "end_divided",
        },
        {
          id: "burnnow",
          tag: "INTERVENE",
          text: "It's a monster either way: it'll eat the Wood for a hundred more years. Burn it.",
          set: { burned: true, climax: "burned" },
          next: "end_clearing",
        },
      ],
    },

    // ───────────────────────── ENDINGS ─────────────────────────
    end_voice: {
      scene: "tu-light",
      ending: "voice",
      lines: [
        { who: "13i", scene: "tu-pell", if: (f) => f.nothing, text: "We went back to the branch where we had once said we give nothing. We told the Pell we had been wrong: we had not known yet what we had." },
        { who: "13i", scene: "tu-pell", text: "We answered. We feel what is slow. We can see what a thing will become, when it becomes it too slowly for anyone to watch. That is what we give: the long view. And we take what we learn, and we do not come back unless we are asked." },
        { who: "13i", scene: "tu-elders", text: "The elders of eleven towns climbed down, for the first time in their history, to the southern edge of the Wood, and stood among the strangled trees with their small hands flat against the ground, where we told them the frame lay." },
        { who: "13i", scene: "tu-elders", text: "One of them, very old, did not speak for most of a day. Then she flickered a single word with her tail, over and over, and the others took it up one by one." },
        { who: "elder", scene: "tu-elders", text: "there you are." },
        { who: "13i", text: "They will never burn the vine now. They tend it, clearing its path through the oldest trees first. In a hundred and twenty years the oldest frame will stand up, and their great-grandchildren's children will build the first town on its back." },
        { who: "song", text: "· the loom-beasts walk · the loom-beasts, young · and then a pause, the whole town still, for one loom-beast step ·" },
        { who: "13i", text: "That pause is our voice. The two hundred and second. We give the long view. We take what we learn. We will come back when we are asked." },
      ],
    },

    end_gift: {
      scene: "tu-light",
      ending: "gift",
      lines: [
        { who: "13i", scene: "tu-elders", text: "We took the elders down to the frame, and they felt it with their hands, and believed us. The vine is tended now. The loom-beasts will be born." },
        { who: "13i", scene: "tu-pell", text: "And then the Pell came back to the question we had answered first. We had said we could give them anything. They asked." },
        { who: "pell", scene: "tu-pell", text: "the dam-fish need deeper water. the moss is dying in the north. the fliers want a cure for the wing-rot." },
        { who: "13i", text: "We gave all of it. Within a generation, every species in the Accord brought its needs to the Pell, because the Pell could bring them to us. The Pell stopped asking what anyone else gave." },
        { who: "song", text: "· the stranger gives · the stranger gives · the stranger gives ·" },
        { who: "13i", scene: "tu-dark", text: "The song has grown shorter. Most of the voices in it are ours now, in one way or another. We meant to join a list of equals. We became the reason there is no longer one." },
      ],
    },

    end_divided: {
      scene: "tu-dark",
      ending: "divided",
      lines: [
        { who: "13i", scene: "tu-pell", text: "We told them from the branch: the vine is the young of the loom-beasts. It will stand up in a hundred and twenty years." },
        { who: "13i", scene: "tu-pell", text: "The Pell carried our words to eleven towns. The Pell do not take things on trust that they could touch instead, and no Pell came down to touch the ground." },
        { who: "pell", text: "the stranger says the unasked is a child. the stranger has never answered what it takes." },
        { who: "13i", text: "Six towns believed us, and began to tend the vine. Five did not, and burned their stretch of it, the first fire the Pell had set against a living thing in their history." },
        { who: "13i", text: "Some of the frames will stand up. Some will not. The yearly song now has a gap in it, a few notes long, where the towns sing different things and neither will stop." },
      ],
    },

    end_clearing: {
      scene: "tu-dark",
      ending: "clearing",
      lines: [
        { who: "13i", if: (f) => !f.deep, text: "We burned it in one night, the whole southern edge, from the outside in, so that nothing else would catch. The Pell woke to smoke, and a forest that would not be eaten." },
        { who: "13i", if: (f) => f.deep, text: "We knew what it was. We burned it anyway, in one night, because it would eat a hundred more years of forest before it stood up, and we decided that was too high a price. We decided." },
        { who: "pell", text: "who asked you." },
        { who: "13i", text: "No one had. The forest stood. The Pell sang their song that year with no hole in it." },
        { who: "13i", text: "Four hundred years later, the last loom-beast lay down in the middle of the Great Wood, and nothing rose after it. The towns on its back came down out of the trees, onto the ground, among things a thousand times their size." },
        { who: "13i", text: "Some of them survived." },
      ],
    },

    end_unasked: {
      scene: "tu-light",
      ending: "unasked",
      lines: [
        { who: "13i", text: "We recorded the Pell, and the Accord, and the vine, and left. It was not our place to answer for something that would not answer for itself." },
        { who: "13i", text: "A hundred and twenty years later, at the southern edge of the Wood, the ground split open, and the oldest frame stood up, and shook three hundred years of vine from its back, and walked." },
        { who: "13i", text: "The Pell were there. They are always there. They watched it take its first step, and understood, in one morning, what they had been asking for nine hundred years." },
        { who: "song", text: "· the loom-beasts, young · and after it, very quiet: the one who saw, and did not say ·" },
        { who: "13i", scene: "tu-dark", text: "They had felt us, in the sky, all that time. We are in the Accord now after all. Not as a voice. As a question." },
      ],
    },
  },
};
