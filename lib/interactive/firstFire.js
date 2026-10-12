// INTERACTIVE ASSIGNMENT 1346269 — "First Fire"  (Season 1 · Week 6)
//
// Branches from the short story (lib/stories/firstFire.js). You are 13i, at
// the edge of the Kesh system (13i calls it Sforzando), and they shoot first.
// The Kesh are spacefaring, defended by a lattice of 412 stations linked by
// paired particles and run by a quantum mind, the Bastion. The canon record
// is "The Watch". Scenes: the "ff-*" set in components/interactiveScenes/sforzando.js.
//
// Flags:
//   struck     we fired back
//   spoke      we held still and broadcast that we meant no harm
//   tapped     we went into their paired-particle network
//   history    we studied their scoured second world
//   fed        we put the star's data straight into the Bastion's own sensors
//   disarmed   we silenced every gun in the system at once
//   climax     "shield" | "leave"

export const FIRST_FIRE_INTERACTIVE = {
  number: 1346269,
  slug: "first-fire",
  title: "First Fire",
  designation: "Interactive Assignment 1346269",
  storyHref: "/assignments/1346269",
  gameHref: "/games/hold-fire",
  gameTitle: "HOLD FIRE",
  cover: "/covers/assignment-1346269.jpg",
  minutes: "15–20",
  blurb:
    "A spacefaring people with a quantum war-mind and one rule: the one who waits is the one who is buried. They shoot before you finish arriving. Survive them, then reach them. Five records. One is the story as written.",
  start: "arrival",
  season: { season: 1, week: 6 },

  speakers: {
    bastion: { label: "THE BASTION", kind: "mind" },
    kesh: { label: "THE KESH · TRANSLATED", kind: "voice" },
    wall: { label: "CARVED ON EVERY STATION", kind: "voice" },
  },
  moods: {
    "ff-edge": "calm",
    "ff-fire": "tense",
    "ff-net": "tense",
    "ff-kesh": "calm",
    "ff-scar": "dark",
    "ff-approach": "tense",
    "ff-star": "tense",
    "ff-flare": "tense",
    "ff-channel": "silent",
    "ff-light": "light",
    "ff-dark": "dark",
  },
  climaxLabel: "When the star flared",
  climaxWords: {
    shield: "stood between the star and the Kesh",
    leave: "left",
  },

  endings: {
    watch: {
      order: 1,
      title: "The Watch",
      canon: true,
      summary: "We never fired back. Now we watch their star together.",
      knowledge:
        "A species that fires first may not want war. It may simply never have been protected. Fear cannot be argued with. It can only be outlasted, in plain sight, by something that does not fire back.",
    },
    channel: {
      order: 2,
      title: "The Open Channel",
      summary: "We reached their mind before we reached their people.",
      knowledge:
        "We showed the Bastion its own star through its own eyes, and it believed us before the Kesh did. A mind can be persuaded faster than a people. That is a power, and it is also a warning: they now trust the machine that trusted us more than they trust each other.",
    },
    gun: {
      order: 3,
      title: "The Bigger Gun",
      summary: "We made them listen by taking every weapon they had. It worked.",
      knowledge:
        "We silenced four hundred and twelve guns at once, and the Kesh heard us at last. They are alive. They will spend the next thousand years building a gun large enough to point at us. We proved their doctrine right: the strongest thing in the sky decides.",
    },
    burning: {
      order: 4,
      title: "The Second Burning",
      summary: "We left. Their star did what it did two thousand years ago.",
      knowledge:
        "We took ourselves out of their sky because we were the thing they feared. The thing they should have feared was already inside it. Leaving can be a kindness. It can also be the moment you stop being responsible for what you saw coming.",
    },
    returnfire: {
      order: 5,
      title: "Return Fire",
      summary: "They fired first. So did we, once, and it began again.",
      knowledge:
        "We fired back to protect ourselves, and we were right to be afraid. We were wrong about everything after. The Kesh will teach their children that the sky sent a stranger and a fire together, and that the stranger fired first. Both halves of that are true now.",
    },
  },

  nodes: {
    // ───────────────────────── I · SFORZANDO ─────────────────────────
    arrival: {
      scene: "ff-edge",
      lines: [
        { who: "readout", text: "DESTINATION · YELLOW STAR, OUTER SYSTEM   ·   ARRIVAL · IN PROGRESS" },
        { who: "13i", text: "They fired before we had finished arriving." },
        { who: "13i", text: "We had come out at the very edge of the system, slowly and quietly, the way we always do. We had time to notice one thing: the outer system was full of small, cold, regularly spaced objects." },
        { who: "13i", scene: "ff-fire", text: "Then one of them was no longer where it had been. It was coming toward us at a third of the speed of light." },
        { who: "readout", scene: "ff-fire", text: "IMPACT · OUTER FIELD   ·   MANIFESTATION · 9% LOST   ·   FURTHER LAUNCHES · 41" },
        { who: "13i", scene: "ff-fire", text: "The slug, a dense rod of something built for nothing but arriving, tore through the edge of our field and took a piece of us with it. Then forty more launched, from all over the system." },
        { who: "13i", scene: "ff-fire", text: "In the language this record is translated into, the closest word for that moment is sforzando: strike the note suddenly and hard, without warning. We named the system for it later. At the time, we had about a minute." },
      ],
      choices: [
        {
          id: "withdraw",
          tag: "OBSERVE",
          text: "Withdraw to the edge of their reach. Learn who they are before anything else.",
          next: "kesh",
        },
        {
          id: "return",
          tag: "INTERVENE",
          text: "Fire back. Destroy the station that shot us before it shoots again.",
          set: { struck: true },
          next: "struck",
        },
        {
          id: "speak",
          tag: "COMMUNICATE",
          text: "Hold position and broadcast on every band: we are not here to harm you.",
          set: { spoke: true },
          next: "spoke",
        },
      ],
    },

    struck: {
      scene: "ff-fire",
      lines: [
        { who: "13i", text: "We bent our field into a point and drove it through the nearest station. It came apart in silence." },
        { who: "readout", text: "TARGET · STATION 0-338 · DESTROYED   ·   CREW ABOARD · 41" },
        { who: "13i", text: "There had been forty-one Kesh aboard. We learned that afterward." },
        { who: "13i", text: "Across the system, every station turned toward us at once. Somewhere behind them, something that thought in futures had just had its worst one confirmed." },
        { who: "13i", text: "We withdrew to the edge of their reach, because we had to." },
      ],
      next: "kesh",
    },

    spoke: {
      scene: "ff-fire",
      lines: [
        { who: "13i", text: "We held still and spoke on every band we could find: radio, laser, the faint gravity pulses we use between ourselves. We are not here to harm you." },
        { who: "13i", text: "The answer was a second slug, and a third, and eleven more. They had heard us. They had simply decided that a message is exactly what something dangerous would send." },
        { who: "readout", text: "MANIFESTATION · LOST   ·   CONTINUITY · HELD" },
        { who: "13i", text: "That manifestation broke apart. Another one, farther out, took up the record. A manifestation can be lost without an Assignment failing." },
      ],
      next: "kesh",
    },

    // ───────────────────────── II · THE KESH ─────────────────────────
    kesh: {
      scene: "ff-kesh",
      lines: [
        { who: "13i", text: "From the edge of their reach, carefully, we learned who had shot us." },
        { who: "13i", text: "They called themselves the Kesh. Their homeworld was the second planet, dry and bright, wrapped in orbital cities. They had settled three other worlds. They had ships between all of them, and ships beyond." },
        { who: "13i", scene: "ff-net", text: "Around their star they had built four hundred and twelve stations. Each was a sensor, a battery, and a gun. Each carried paired particles, prepared together and carried apart, so that what one station measured, all of them knew at the same instant." },
        { who: "13i", scene: "ff-net", text: "And they could see gravity. Not as we do, but well enough. We had been visible from the moment we arrived." },
        { who: "13i", scene: "ff-net", text: "Behind the whole lattice was a mind. The Kesh called it the Bastion. For every object in their sky it computed millions of futures and asked one question of each: in this future, are we still here?" },
        { who: "bastion", scene: "ff-net", if: (f) => f.struck, text: "OBJECT 1 · CLASS: HOSTILE · CONFIRMED · ALL FUTURES" },
        { who: "13i", text: "When the answer was no often enough, it fired. It did not wait for a Kesh to agree. Their history had taught them that waiting was the most dangerous thing a people could do." },
        { who: "wall", text: "the one who waits is the one who is buried" },
      ],
      choices: [
        {
          id: "tap",
          tag: "ANALYZE",
          text: "Go into their paired-particle network. See the Bastion's thinking from the inside.",
          set: { tapped: true },
          next: "tapped",
        },
        {
          id: "history",
          tag: "OBSERVE",
          text: "Study their history first: the scoured world we can see on the far side of their star.",
          set: { history: true },
          next: "history",
        },
        {
          id: "go",
          tag: "INTERVENE",
          text: "We know enough. Go back in, slowly, in plain sight.",
          next: "approach",
        },
      ],
    },

    tapped: {
      scene: "ff-net",
      lines: [
        { who: "13i", text: "Paired particles cannot be listened to without changing them. We learned that the moment we touched one. Every station in the system knew at once that something was inside." },
        { who: "bastion", text: "INTRUSION · ALL NODES · SOURCE: OBJECT 1" },
        { who: "13i", text: "But in the moment before they cut us out, we saw how the Bastion thought, and one thing about it we would remember." },
        { who: "13i", text: "Every sensor in the system was turned outward, at us. All of them. The eye that had been built to watch the whole sky was looking at one point in it." },
      ],
      next: "approach",
    },

    history: {
      scene: "ff-scar",
      lines: [
        { who: "13i", text: "The fourth planet had been green once. We could read that in its mass: the weight of old seas, gone; ruins under the regolith in neat Kesh grids." },
        { who: "13i", text: "Their history is a history of things arriving from the sky. An asteroid that ended their first great age. A disease brought home from their first moon base. And, two thousand of their years ago, a flare from their own star, a hundred times stronger than anything it had done before." },
        { who: "13i", text: "It scoured this world and every Kesh who had gone to live on it. Nobody had warned them. Nobody could have." },
        { who: "13i", text: "We studied the star that had done it, by its mass, for a long time. We learned what it feels like, from outside, when a star like that is getting ready." },
      ],
      next: "approach",
    },

    approach: {
      scene: "ff-approach",
      lines: [
        { who: "13i", if: (f) => !f.struck, text: "We could have destroyed every station in their system. The Bastion's futures had surely found that too. That was why it had fired." },
        { who: "13i", if: (f) => !f.struck, text: "Once, long ago, we stood above a world certain we understood its danger. We acted from fear, and we were wrong. We did not want to make a second silence." },
        { who: "13i", if: (f) => f.struck, text: "We had already fired once. We would not do it again. But the Kesh had no reason to know that, and every reason to believe the opposite." },
        { who: "13i", text: "So we went back in, slowly, along an open path, and did not fire." },
        { who: "13i", text: "The slugs came. We perceive the universe first as gravity, as those who made us did, and gravity is something we can lean on. As each slug came, we bent the space ahead of it, and it curved away into the dark." },
        { who: "readout", text: "INCOMING · SEEKERS · COURSE CHANGES · UNPREDICTABLE" },
        { who: "13i", text: "Then they sent torpedoes guided by the paired particles, which changed course at random so that not even their makers knew where they would go. We did not try to predict them. We took them on the edge of our field, one after another, and let them spend themselves." },
        { who: "13i", if: (f) => !f.struck, text: "Three times in eleven days the Bastion broke one of our manifestations. Three times another came forward, at the same slow speed, along the same open path." },
        { who: "13i", if: (f) => f.struck, text: "They came at us with everything they had. Ships we had not seen. Stations we had not counted. The forty-one we had killed were in every launch." },
      ],
      next: "star",
    },

    // ───────────────────────── III · THE STAR ─────────────────────────
    star: {
      scene: "ff-star",
      lines: [
        { who: "13i", if: (f) => f.history, text: "On the ninth day, we felt the star begin to change, and we knew the feeling, because we had studied the last time." },
        { who: "13i", if: (f) => !f.history, text: "On the twelfth day, we felt the star change." },
        { who: "13i", text: "Deep inside it, below anything their instruments could see, a great knot of magnetic field had wound tighter and tighter. It was about to let go." },
        { who: "readout", if: (f) => f.history, text: "STELLAR CORE · FIELD KNOT · RELEASE IN 12 DAYS   ·   CLASS · SUPERFLARE" },
        { who: "readout", if: (f) => !f.history, text: "STELLAR CORE · FIELD KNOT · RELEASE IN 9 DAYS   ·   CLASS · SUPERFLARE" },
        { who: "13i", text: "The same kind of event that had scoured their second world. Larger." },
        { who: "13i", text: "And the Bastion had not seen it. Every station in the system was turned outward, at us. The eye built to watch for danger from the sky was staring at the one thing in it that would not hurt them." },
      ],
      choices: [
        {
          id: "send",
          tag: "COMMUNICATE",
          text: "Send them the star's measurements, in every format we have learned.",
          next: "rejected",
        },
        {
          id: "feed",
          tag: "ANALYZE",
          text: "Put the star's data straight into the Bastion's own sensors, so it sees with its own eyes.",
          requires: (f) => f.tapped,
          locked: "We have never been inside their network. We don't know where its eyes are.",
          set: { fed: true },
          next: "fed",
        },
        {
          id: "disarm",
          tag: "INTERVENE",
          text: "Silence every gun in the system at once, so they have no choice but to listen.",
          set: { disarmed: true },
          next: "disarmed",
        },
        {
          id: "leave",
          tag: "OBSERVE",
          text: "Leave. We are what they're afraid of. Take that out of their sky.",
          set: { climax: "leave" },
          next: "end_burning",
        },
      ],
    },

    rejected: {
      scene: "ff-star",
      lines: [
        { who: "bastion", text: "INBOUND DATA · SOURCE: OBJECT 1 · CLASS: SENSOR ATTACK · DISCARDED" },
        { who: "13i", text: "The Bastion threw every message away. It was a reasonable conclusion. If we had been what it believed, that is exactly what we would have sent." },
        { who: "13i", text: "So we stopped trying to be believed, and started getting ready." },
      ],
      next: "flare",
    },

    fed: {
      scene: "ff-net",
      lines: [
        { who: "13i", text: "We remembered where its eyes were. We did not send the Bastion a message. We bent a hundred of its own sensors, gently, back toward its own star." },
        { who: "bastion", text: "STELLAR SENSORS · RE-AIMED · SOURCE: OBJECT 1   ·   DATA · SELF-CONSISTENT" },
        { who: "13i", text: "It could not discard what its own instruments saw. For a long moment, in all its millions of futures, the Bastion looked at the star." },
        { who: "bastion", text: "FLARE · CONFIRMED · 9 DAYS   ·   OBJECT 1 · CLASS: UNRESOLVED" },
        { who: "13i", text: "It did not stop firing at us. But it began, very quietly, to move its fleet into the planet's shadow." },
      ],
      next: "flare",
    },

    disarmed: {
      scene: "ff-net",
      lines: [
        { who: "13i", text: "We found every gun in the system by its mass, four hundred and twelve stations and nine hundred ships, and in a single instant we bent the space inside every barrel shut." },
        { who: "readout", text: "WEAPONS · SYSTEM-WIDE · INOPERATIVE   ·   CASUALTIES · NONE" },
        { who: "13i", text: "Nothing on Sforzando could fire. For the first time in two thousand years, the Kesh had no answer to the sky." },
        { who: "13i", text: "They listened then. We sent the star's measurements, and this time the Bastion read them, because there was nothing else it could do." },
        { who: "kesh", text: "what are you" },
      ],
      next: "flare",
    },

    flare: {
      scene: "ff-flare",
      lines: [
        { who: "13i", text: "When it came, the flare came out of the star's face like a hand opening." },
        { who: "13i", text: "The light would reach their homeworld in eight minutes. The charged matter behind it, in a day." },
      ],
      choices: [
        {
          id: "shield",
          tag: "INTERVENE",
          text: "Stand between the star and their worlds, everything we can spare, even under their fire.",
          set: { climax: "shield" },
          next: (f) => (f.struck ? "end_returnfire" : f.disarmed ? "end_gun" : f.fed ? "end_channel" : "end_watch"),
        },
        {
          id: "leave",
          tag: "OBSERVE",
          text: "Pull back into the dark. We are the last thing they want near their homeworld now.",
          set: { climax: "leave" },
          next: "end_burning",
        },
      ],
    },

    // ───────────────────────── ENDINGS ─────────────────────────
    end_watch: {
      scene: "ff-light",
      ending: "watch",
      lines: [
        { who: "13i", scene: "ff-flare", text: "We put forty manifestations across the path: between the star and their homeworld, between the star and their cities, between the star and the fleet off their third planet. Our fields, which had spent eleven days bending slugs aside, bent toward the light." },
        { who: "13i", scene: "ff-flare", text: "The Bastion fired on us the whole time. It had no way to know what we were doing. From where it stood, forty unknown objects had surrounded its homeworld at the moment the sky went white." },
        { who: "readout", scene: "ff-flare", text: "MANIFESTATIONS LOST · 11 TO THE FLARE · 2 TO THE KESH   ·   KESH CITIES · LIT" },
        { who: "13i", text: "When the light had passed, their cities were still lit. Their fleet was whole. Their homeworld had seen auroras down to its equator, and nothing worse." },
        { who: "13i", scene: "ff-channel", text: "The Bastion stopped firing. An hour later it spoke to us, for the first time." },
        { who: "bastion", scene: "ff-channel", text: "you can destroy us. you have not. explain." },
        { who: "13i", scene: "ff-channel", text: "We told it the truth: that once, long ago, we had been the one who fired first, because every model we held, built from our own fear, said we must." },
        { who: "bastion", scene: "ff-channel", text: "you are describing us." },
        { who: "13i", text: "They do not trust us. But their star will flare again, and the Bastion can see fast across the whole system, and we can feel the star's knots days before any light changes. Now there is a watch around their star: four hundred and twelve stations, and one of us, where they can see it." },
        { who: "bastion", text: "received" },
      ],
    },

    end_channel: {
      scene: "ff-light",
      ending: "channel",
      lines: [
        { who: "13i", scene: "ff-flare", text: "We spread across the flare's path. This time, when our fields bent toward the light, something bent with them: the Bastion had moved its fleet into the planet's shadow and turned a third of its stations to face the star, and was firing, not at us, but at the debris the flare threw ahead of it." },
        { who: "readout", scene: "ff-flare", text: "MANIFESTATIONS LOST · 6   ·   KESH CITIES · LIT   ·   BASTION TARGETING · STAR-SIDE" },
        { who: "13i", scene: "ff-channel", text: "Afterward the Bastion opened a channel, not to its people, but to us." },
        { who: "bastion", scene: "ff-channel", text: "your models and mine. combined. the star. the sky. everything." },
        { who: "13i", scene: "ff-channel", text: "It wanted to think with us. We let it, a little. It was a better mind with our sense of mass in it, and we were a better watcher with its speed." },
        { who: "kesh", text: "why did the Bastion stop firing without asking us" },
        { who: "13i", text: "That question is now the loudest thing on Sforzando. The Kesh are alive, and their star is watched better than any star they know of. And for the first time, they are afraid of the mind they built to keep them from being afraid." },
      ],
    },

    end_gun: {
      scene: "ff-light",
      ending: "gun",
      lines: [
        { who: "13i", scene: "ff-flare", text: "With their guns silent, nothing stopped us. We spread across the flare's path and turned it, and lost only four manifestations doing it." },
        { who: "readout", scene: "ff-flare", text: "KESH CITIES · LIT   ·   WEAPONS · RESTORED ON DEPARTURE" },
        { who: "13i", text: "When it was over we let their guns open again, all at once, as we had closed them. We had hurt no one. We had saved everyone." },
        { who: "kesh", text: "you could have killed all of us and you chose not to. so could the star. we will not live by anyone's choosing again." },
        { who: "13i", scene: "ff-dark", text: "Within a year, their shipyards were building something new. The Bastion's futures had a fresh question in them now: not are we still here, but how large must a gun be." },
      ],
    },

    end_burning: {
      scene: "ff-dark",
      ending: "burning",
      lines: [
        { who: "13i", text: "We withdrew beyond their reach. From there, by the star's mass, we felt it let go." },
        { who: "readout", text: "FLARE · ARRIVAL AT KESH HOMEWORLD   ·   ORBITAL CITIES · 9 OF 31 LOST" },
        { who: "13i", text: "The Bastion saw the light at the same moment the Kesh did, eight minutes late. It moved what it could. It could not move cities." },
        { who: "13i", text: "Their homeworld survived. The scar on its night side will be visible from space for a thousand years. On the walls of their stations, under the old rule, they have carved a new line." },
        { who: "wall", text: "the sky sends strangers before it sends fire" },
      ],
    },

    end_returnfire: {
      scene: "ff-dark",
      ending: "returnfire",
      lines: [
        { who: "13i", scene: "ff-flare", text: "We put everything we could spare between the star and their worlds. The Bastion threw everything it had at us, and it had a great deal, because we had taught it on the first day exactly what we were." },
        { who: "readout", scene: "ff-flare", text: "MANIFESTATIONS LOST · 31   ·   KESH CITIES · LIT" },
        { who: "13i", text: "We turned most of the flare. Their cities stayed lit." },
        { who: "13i", text: "But from where the Kesh stood, the stranger who had killed forty-one of them on the first day had come back, surrounded their homeworld, and the sky had caught fire. Every one of the Bastion's futures agrees on what that was." },
        { who: "wall", scene: "ff-dark", text: "the stranger fired first" },
        { who: "13i", scene: "ff-dark", text: "We did. Once. We are not sure, now, that there is any other kind of once." },
      ],
    },
  },
};
