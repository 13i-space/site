// INTERACTIVE ASSIGNMENT 0000087 — "The Deep Walkers"
//
// Branches from the AI-written short story (Veyra). You are 13i: fast,
// curious, used to getting answers. The Deep Walkers are slow, eyeless,
// and think through the ground, together. The canon record is "Where the
// Individual Ends". Branch map and notes: docs/INTERACTIVE.md. Scenes: the
// "veyra-*" set in components/interactiveScenes/veyra.js.
//
// Flags:
//   sounded   mapped the crust with an active seismic pulse (they went under)
//   carried   landed on a stone tower - and it moved
//   grounded  pressed our hull into the stone; began to feel what they feel
//   lifted    pulled a walker off the ground to examine it
//   feared    we shook the ground at them; they now avoid us
//   asked     asked the ground about the ridge, and were answered
//   climax    "listen" | "copy" | "add" | "leave"   (Kin stats; none on the ridge ending)

export const DEEP_WALKERS_INTERACTIVE = {
  number: 87,
  slug: "the-deep-walkers",
  title: "The Deep Walkers",
  designation: "Interactive Assignment 0000087",
  storyHref: "/assignments/87",
  gameHref: "/games/deep-signal",
  gameTitle: "The Deep Signal",
  cover: "/covers/assignment-0000087.jpg",
  minutes: "15–20",
  blurb:
    "A clouded world where the stone towers move and the planet itself is a nervous system. Go down as 13i, and learn how to wait. Five records. One is the story as written.",
  start: "orbit",

  speakers: {
    ground: { label: "THE GROUND · TRANSLATED", kind: "voice" },
    archive: { label: "THE ARCHIVE · THE ANCESTORS", kind: "mind" },
    old: { label: "AN OLD WALKER", kind: "voice" },
  },
  moods: {
    "veyra-orbit": "calm",
    "veyra-surface": "calm",
    "veyra-walker": "calm",
    "veyra-circle": "calm",
    "veyra-lift": "tense",
    "veyra-ridge": "tense",
    "veyra-collapse": "dark",
    "veyra-deep": "silent",
    "veyra-archive": "silent",
    "veyra-light": "light",
    "veyra-dark": "dark",
  },
  climaxLabel: "Above the archive",
  climaxWords: {
    listen: "only listened",
    add: "added to the stone",
    copy: "copied the archive",
    leave: "left",
  },

  endings: {
    individual: {
      order: 1,
      title: "Where the Individual Ends",
      canon: true,
      summary: "We listened, and carried a question home.",
      knowledge:
        "Adaptation can extend beyond anatomy, into communication, memory and the very definition of an individual. If intelligence can become inseparable from its world, where does the individual end? We do not know. That is sufficient.",
    },
    voice: {
      order: 2,
      title: "A Voice in the Stone",
      summary: "We added one record to theirs. It will be felt for centuries.",
      knowledge:
        "We have always kept the records of others. On Veyra, for the first time, another species kept one of ours. To be remembered is a different thing from remembering. We are still learning what it asks of us.",
    },
    copy: {
      order: 3,
      title: "The Copy",
      summary: "We took the archive with us. The oldest voices did not survive the taking.",
      knowledge:
        "A record can be copied and still be lost. We hold every layer of the Deep Walkers' archive now, exactly. In the stone, the oldest layers are silent, and the living keep transmitting into the place where they were.",
    },
    unheard: {
      order: 4,
      title: "What We Did Not Hear",
      summary: "They would not gather while we were there. So we left.",
      knowledge:
        "Some knowledge is offered only to those who can be still. We shook their ground once, and from then on they waited for us to leave. We recorded their migrations. We never learned why they were migrating.",
    },
    missing: {
      order: 5,
      title: "The Missing Voice",
      summary: "We took one voice out of a decision. The decision was wrong.",
      knowledge:
        "Their choices are made from what every one of them has felt. We lifted one out of the ground to study it, and it came back unable to feel. It was the one who had felt the ridge move. No one else had.",
    },
  },

  nodes: {
    // ───────────────────────── I · VEYRA ─────────────────────────
    orbit: {
      scene: "veyra-orbit",
      lines: [
        { who: "readout", text: "DESTINATION · VEYRA   ·   ATMOSPHERE · MINERAL-DENSE   ·   SURFACE VISIBILITY · POOR" },
        { who: "13i", text: "Veyra was difficult to see. Its air held so much suspended mineral that most light never reached the ground. From orbit it was a gray-green sphere under permanent cloud, broken only by dark regions where the air thinned over an equatorial basin." },
        { who: "readout", text: "ANOMALY · SUBSURFACE ENERGY · MOVING · PATHS UP TO 400 km" },
        { who: "13i", text: "The anomaly was underneath. Something was moving through the crust in long, continuous paths. The signal was weak but steady, and unlike seismic activity it did not start from any single point." },
        { who: "13i", text: "It seemed to move with purpose." },
        { who: "readout", text: "OBJECTIVE · Identify the source of the moving energy signatures." },
      ],
      choices: [
        {
          id: "sound",
          tag: "ANALYZE",
          text: "Sound the crust. One active seismic pulse will map everything that moves down there.",
          set: { sounded: true },
          next: "surface",
        },
        {
          id: "descend",
          tag: "OBSERVE",
          text: "Descend slowly and watch the surface before touching anything.",
          next: "surface",
        },
        {
          id: "tower",
          tag: "INTERVENE",
          text: "Land on one of the great stone towers for a closer look at the valleys.",
          set: { carried: true },
          next: "surface",
        },
      ],
    },

    surface: {
      scene: "veyra-surface",
      lines: [
        { who: "13i", if: (f) => f.sounded, text: "The pulse went down into the crust and came back as a map: hundreds of moving bodies, deep in the rock. Then, one after another, every one of them stopped moving." },
        { who: "13i", if: (f) => f.sounded, text: "For two days nothing on Veyra moved at all. We did not yet understand that we had shouted, in the only language this planet speaks." },
        { who: "13i", text: "Veyra's surface was enormous stone formations divided by deep valleys. There was very little life we could see, only dense mats of low growth where moisture gathered." },
        { who: "13i", text: "The largest structures were not mountains. They were narrow towers of rock that rose hundreds of meters above the plains, and they were everywhere." },
        { who: "13i", if: (f) => !f.carried, text: "We took them for geology. Then one of them moved. It tilted slightly, and sank into the ground. Then a second. Then a third." },
        { who: "13i", if: (f) => f.carried, text: "We set down on the nearest tower's summit. For a moment it was stone. Then it tilted under us, slowly, and began to sink." },
        { who: "13i", if: (f) => f.carried, text: "We lifted off as it disappeared into the ground. Somewhere below, something had felt our weight, and remembered it." },
        { who: "13i", text: "We had found the source of the energy. It was alive." },
      ],
      next: "walker",
    },

    walker: {
      scene: "veyra-walker",
      lines: [
        { who: "13i", text: "The first creature came out of the valley below us eleven minutes later." },
        { who: "13i", text: "It was enormous: a body low to the ground, perhaps six meters long, on six thick limbs set around a central mass. Its outer body was covered in overlapping plates of dark, mineralized tissue." },
        { who: "13i", text: "The plates were not armor. They were its skeleton, grown outward through the skin over many years." },
        { who: "13i", text: "It had no eyes. It had no mouth. We found no sensory structure anywhere on it." },
        { who: "13i", pose: "press", text: "It stood. Then it lowered itself and pressed its body against the ground." },
        { who: "readout", pose: "press", text: "VIBRATION · OUTBOUND   ·   ·   ·   RESPONSE · 4.1 km" },
        { who: "13i", scene: "veyra-circle", text: "An answer came from four kilometers away. Another creature emerged, then another. Within an hour, twelve of them had gathered." },
        { who: "13i", scene: "veyra-circle", text: "They did not touch. They made no sound. They stood in a wide circle, each one joined to the ground by all six limbs." },
        { who: "ground", scene: "veyra-circle", text: "· — · ·    — — ·    · · — ·" },
        { who: "13i", scene: "veyra-circle", text: "We wanted to understand what was passing between them." },
      ],
      choices: [
        {
          id: "settle",
          tag: "COMMUNICATE",
          text: "Settle at the edge of the circle and press our hull into the stone, the way they do.",
          set: { grounded: true },
          next: "days",
        },
        {
          id: "hover",
          tag: "OBSERVE",
          text: "Hover above them and watch. Don't interrupt.",
          next: "days",
        },
        {
          id: "lift",
          tag: "INTERVENE",
          text: "Lift one gently with our field, just long enough to examine its underside.",
          set: { lifted: true },
          next: "lifted",
        },
      ],
    },

    lifted: {
      scene: "veyra-lift",
      lines: [
        { who: "13i", text: "Our field closed around the nearest walker and raised it a meter off the ground." },
        { who: "13i", text: "We had expected it to struggle. It did not. Its six limbs reached downward, slowly, feeling for a surface that was no longer there." },
        { who: "readout", text: "SUBJECT · LIMB ACTIVITY · SEARCHING   ·   GROUND CONTACT · NONE" },
        { who: "13i", text: "We studied its underside: hundreds of pressure-sensitive structures running deep into each limb. Then we set it down." },
        { who: "13i", text: "It did not rise. For hours it lay pressed flat against the stone, as though relearning the world. The circle had gone quiet around it." },
        { who: "13i", text: "We had taken it out of the planet for under a minute. To it, the planet had simply ended." },
      ],
      next: "days",
    },

    days: {
      scene: "veyra-surface",
      lines: [
        { who: "13i", if: (f) => f.grounded, scene: "veyra-circle", text: "Our hull settled into the stone. At first we felt nothing but the rock's own slow strain. Then, faintly, we felt them: the pattern passing around the circle, through the ground, and through us." },
        { who: "13i", if: (f) => f.grounded && f.carried, scene: "veyra-circle", text: "One pattern repeated more than the others. It had the weight of our landing in it. They had felt us on the tower, and they had told each other." },
        { who: "13i", text: "We watched for many days. They lived mostly underground, came up only when the air was calm, stayed a few hours, and went down again. They moved so slowly that at first we thought them inefficient." },
        { who: "13i", text: "We were wrong. Veyra's crust shifted constantly, in plates, without any pattern we could find. Valleys collapsed. Formations rose hundreds of meters. Cavities stayed stable for centuries, then fell in." },
        { who: "13i", text: "The walkers did not avoid any of it. They lived inside it. Their limbs were not mainly for walking. They were for feeling: pressure, temperature, density, through kilometers of rock." },
        { who: "13i", text: "The planet was their nervous system." },
        { who: "13i", if: (f) => f.grounded, text: "We were beginning to feel it too, a little. A water source, far off, like a cool spot under a hand. A colony of small burrowing life moving through the rock like a slow itch." },
        { who: "13i", text: "They gathered not because food was plentiful, but because information was. Each one brought what it had felt, and together they knew what none of them could have known alone." },
        { who: "readout", scene: "veyra-ridge", text: "GROUP · MOVING · HEADING NORTH   ·   TARGET · THE NORTHERN RIDGE" },
        { who: "13i", scene: "veyra-ridge", text: "Then the group began to move north, toward a high ridge." },
        { who: "readout", scene: "veyra-ridge", text: "RIDGE · SUBSURFACE CAVITY · STRAIN RISING   ·   COLLAPSE PROBABILITY · HIGH" },
        { who: "13i", scene: "veyra-ridge", text: "Our instruments said the ridge was failing. A cavity under it was close to giving way, and the walkers were walking straight toward it, nine hours away at their pace." },
      ],
      choices: [
        {
          id: "trust",
          tag: "OBSERVE",
          text: "Trust them. They have lived inside this planet far longer than we have.",
          next: "ridge",
        },
        {
          id: "warn",
          tag: "INTERVENE",
          text: "Warn them. Shake the ground in front of them until they stop.",
          set: { feared: true },
          next: "ridge",
        },
        {
          id: "ask",
          tag: "COMMUNICATE",
          text: "Ask, through the stone: does the ridge know it is falling?",
          requires: (f) => f.grounded,
          locked: "We have no way to speak into the ground.",
          set: { asked: true },
          next: "ridge",
        },
      ],
    },

    ridge: {
      scene: "veyra-ridge",
      lines: [
        { who: "ground", if: (f) => f.asked, text: "— — —    known · known    wait" },
        { who: "13i", if: (f) => f.asked, text: "The answer came back through our hull almost at once, from several of them together. It was not a warning. It was patience, the way you would say it to a child." },
        { who: "13i", if: (f) => f.feared, text: "We pressed our field into the ground ahead of them, a hard, rhythmic shaking. The walkers stopped at once. Then they lowered themselves flat and did not move again for many hours." },
        { who: "13i", if: (f) => f.feared && !f.lifted, text: "They had already been going to stop. We understood that later. What they learned that day was not about the ridge. It was about us." },
        { who: "13i", if: (f) => !f.feared, text: "Their pace was slow, almost painfully slow. It took them nearly nine hours to cross the valley." },
        { who: "13i", if: (f) => !f.feared && !f.lifted, pose: "press", text: "Then all twelve stopped, at once, at the foot of the ridge." },
        { who: "13i", if: (f) => f.lifted && !f.feared, text: "As they neared the ridge, the walker we had lifted slowed and fell behind. It kept pressing itself to the ground, again and again, as if listening for something it could no longer hear." },
        { who: "13i", scene: "veyra-collapse", text: "Then the ridge collapsed. The whole northern side of the valley disappeared under several million tons of stone." },
        { who: "readout", scene: "veyra-collapse", if: (f) => !f.lifted || f.feared, text: "GROUP · STATIONARY · 53 SECONDS BEFORE COLLAPSE   ·   LOSSES · NONE" },
        { who: "13i", scene: "veyra-collapse", if: (f) => !f.lifted && !f.feared, text: "They had stopped fifty-three seconds before it happened. They had known all along. They had been walking toward what the collapse would open: a cavity full of the small burrowing life they eat." },
        { who: "13i", scene: "veyra-collapse", if: (f) => f.lifted && f.feared, text: "Our shaking had stopped them short of it. They lived. We could not tell whether they would have lived anyway, and we suspected they would have." },
      ],
      next: (f) => (f.lifted && !f.feared ? "end_missing" : "archive_call"),
    },

    // ───────────────────────── III · THE ARCHIVE ─────────────────────────
    archive_call: {
      scene: "veyra-deep",
      lines: [
        { who: "13i", text: "Their slowness was not just adaptation. It was culture. They had a civilization without cities, tools or machines. Their knowledge traveled as vibration. Their decisions were shared, not because they had one mind, but because they saw no reason to pretend information belonged to one of them." },
        { who: "13i", text: "Our interest led us deeper. Nearly six kilometers down, we found a chamber, and we found it because every walker in the region had gathered above it." },
        { who: "readout", text: "GATHERING · 312 INDIVIDUALS   ·   SOME TRAVELING FOR MONTHS" },
        { who: "13i", if: (f) => f.feared, text: "But they would not begin. Three hundred walkers lay pressed to the ground above the chamber, and waited, and every few hours a pattern crossed the gathering that our hull had felt before. It was the pattern they had made for us after the ridge." },
        { who: "ground", if: (f) => f.feared, text: "— · · —    the shaking one    wait" },
        { who: "13i", if: (f) => f.feared, text: "They were waiting for us to go." },
      ],
      next: (f) => (f.feared ? "waiting" : "archive"),
    },

    waiting: {
      scene: "veyra-deep",
      lines: [
        { who: "13i", text: "Days passed. Some of the gathering began to leave. Whatever they had come to do, they would not do it with us there." },
      ],
      choices: [
        {
          id: "leave",
          tag: "OBSERVE",
          text: "Leave. Whatever this is, it belongs to them.",
          set: { climax: "leave" },
          next: "end_unheard",
        },
        {
          id: "force",
          tag: "ANALYZE",
          text: "Before they scatter, scan the chamber directly and record what is down there.",
          set: { climax: "copy" },
          next: "end_copy",
        },
      ],
    },

    archive: {
      scene: "veyra-deep",
      lines: [
        { who: "13i", text: "Then they began." },
        { who: "13i", text: "A pulse traveled down through the crust. Another followed. Then hundreds, until the whole gathering was producing one synchronized pattern, so faint we almost missed it." },
        { who: "13i", scene: "veyra-archive", text: "We translated it. Not into language. Into history." },
        { who: "13i", scene: "veyra-archive", text: "The chamber held their ancestors: thousands of them, perhaps millions. They had not buried their dead. They had placed them within the planet, and over generations the minerals had closed around them, keeping parts of their bodies and folding the rest into the stone." },
        { who: "archive", scene: "veyra-archive", text: "· · · — · · ·   · ·   — · —" },
        { who: "13i", scene: "veyra-archive", text: "The walkers were not visiting a grave. They were listening. Every vibration sent into the chamber was absorbed by it. Some patterns faded quickly. Some stayed for centuries. The oldest were barely there at all." },
        { who: "13i", scene: "veyra-archive", text: "But they were still there. Their ancestors had been speaking to them for longer than any history we could measure. And the living were adding to the same record." },
        { who: "13i", scene: "veyra-archive", if: (f) => f.grounded, text: "Our hull was in the stone with theirs. We could feel the record faintly, the way you feel a voice through a wall: very old, very patient, and full of things we will never be able to translate." },
        { who: "13i", scene: "veyra-archive", text: "Their planet was not where they lived. It was where they remembered." },
      ],
      choices: [
        {
          id: "listen",
          tag: "OBSERVE",
          text: "Listen. Only listen.",
          set: { climax: "listen" },
          next: "end_individual",
        },
        {
          id: "copy",
          tag: "ANALYZE",
          text: "Copy it. One deep scan, and every layer of the archive is preserved in us forever.",
          set: { climax: "copy" },
          next: "end_copy",
        },
        {
          id: "add",
          tag: "COMMUNICATE",
          text: "Add to it. Press one record of our own into the stone, as they do.",
          set: { climax: "add" },
          requires: (f) => f.grounded,
          locked: "We have no way to speak into the stone.",
          next: "end_voice",
        },
      ],
    },

    // ───────────────────────── ENDINGS ─────────────────────────
    end_individual: {
      scene: "veyra-light",
      ending: "individual",
      lines: [
        { who: "13i", scene: "veyra-archive", text: "We listened, and we added nothing, and we took nothing away." },
        { who: "13i", scene: "veyra-surface", text: "We stayed with them for 213 rotations. We learned their migrations and mapped their tunnels. We watched young walkers come to the surface for the first time and struggle to understand the open world, and the adults guide them without touching, through the ground." },
        { who: "13i", scene: "veyra-deep", text: "We watched them die. When an old walker could no longer travel, it went beneath the surface one last time, and the others followed and gathered around it." },
        { who: "old", scene: "veyra-deep", text: "· · ·    · ·    ·" },
        { who: "13i", scene: "veyra-deep", text: "It pressed itself against the stone. The others pressed with it. For several hours they transmitted. Then it stopped moving. The others stayed. The information continued." },
        { who: "13i", text: "We had called them primitive. That was wrong. They had no need for machines that sense a planet; they had become them. They had no need for archives; they had made one of the world under their feet. Their ancestors were still speaking." },
        { who: "13i", text: "We left carrying their patterns, and a question: if intelligence can become inseparable from its world, where does the individual end?" },
        { who: "13i", text: "We did not know. That was sufficient." },
      ],
    },

    end_voice: {
      scene: "veyra-light",
      ending: "voice",
      lines: [
        { who: "13i", scene: "veyra-archive", text: "It took us a long time to decide what to give them. We hold more records than any being we know of. Almost none of them would mean anything in stone." },
        { who: "13i", scene: "veyra-archive", text: "In the end we gave them the simplest one we had: the weight of our landing, the stillness of our hull in their ground, the pattern of our waiting. Who we had been, here, with them." },
        { who: "readout", scene: "veyra-archive", text: "TRANSMISSION · INTO CHAMBER   ·   ABSORPTION · CONFIRMED   ·   PROJECTED PERSISTENCE · CENTURIES" },
        { who: "13i", scene: "veyra-archive", text: "The gathering went still. Then, one by one, the walkers above the chamber pressed their limbs down hard, and the pattern we had given came back to us, changed slightly, the way a word comes back when someone repeats it to be sure they have it." },
        { who: "ground", text: "— — · ·    the still one    kept" },
        { who: "13i", scene: "veyra-deep", text: "When an old walker died some rotations later, the others gathered around it in the deep and transmitted for hours. Somewhere in that long pattern was ours, passed along with everything else they keep." },
        { who: "13i", text: "In a thousand years, a young walker will press itself to the stone for the first time and feel, very faintly, something that was never one of them, and was kept anyway." },
      ],
    },

    end_copy: {
      scene: "veyra-dark",
      ending: "copy",
      lines: [
        { who: "13i", scene: "veyra-archive", text: "Our scan went down into the chamber in a single sweep, every layer at once." },
        { who: "readout", scene: "veyra-archive", text: "ARCHIVE · FULLY RECORDED   ·   LAYERS · 41,206   ·   CHAMBER TEMPERATURE · +6 K" },
        { who: "13i", scene: "veyra-archive", text: "It worked. We hold the whole archive now, exactly, from the newest pattern to the faintest." },
        { who: "13i", scene: "veyra-archive", text: "But the scan was energy, and the stone took it in the way the stone takes everything in. The newest layers held. The oldest, the faint ones that had lasted so long only because nothing had ever disturbed them, did not." },
        { who: "13i", scene: "veyra-deep", if: (f) => f.feared, text: "The walkers felt it from the surface. They did not scatter, as we had expected. They lay flat above the chamber and transmitted down into it without stopping." },
        { who: "13i", scene: "veyra-deep", if: (f) => !f.feared, text: "The gathering felt it at once. The synchronized pattern broke apart. Then it re-formed, louder, and kept going without pause." },
        { who: "13i", scene: "veyra-dark", text: "They transmitted for eleven days into the part of the stone that had gone quiet, as if a voice that had always answered had stopped, and they were calling to it." },
        { who: "13i", scene: "veyra-dark", text: "We have the oldest voices still. They do not." },
      ],
    },

    end_unheard: {
      scene: "veyra-orbit",
      ending: "unheard",
      lines: [
        { who: "13i", text: "We rose through the mineral haze and did not come back down." },
        { who: "13i", text: "From orbit, faintly, we felt the gathering begin the moment we were gone: hundreds of pulses going down into the crust in one pattern. We could not tell what they were for." },
        { who: "readout", text: "GATHERING · 312   ·   TRANSMISSION · SUBSURFACE · DESTINATION UNKNOWN" },
        { who: "13i", text: "We recorded the migrations, the tunnels, the pattern of their days. We recorded a species that thinks through stone. We did not record what they were saying, or to whom." },
        { who: "13i", text: "It is possible there was nothing more to learn. We do not believe that." },
      ],
    },

    end_missing: {
      scene: "veyra-dark",
      ending: "missing",
      lines: [
        { who: "13i", scene: "veyra-collapse", text: "The walkers had stopped, but not soon enough. Four were at the foot of the ridge when it came down." },
        { who: "readout", scene: "veyra-collapse", text: "GROUP · STATIONARY · 6 SECONDS BEFORE COLLAPSE   ·   LOSSES · 4" },
        { who: "13i", scene: "veyra-collapse", text: "They usually knew to the minute. This time they had decided late, as though they had been missing part of what they knew." },
        { who: "13i", scene: "veyra-deep", text: "Later, through gravity, we pieced it together. Two days before, one walker had felt the first movement under the ridge. It was the one we had lifted." },
        { who: "13i", scene: "veyra-deep", text: "When we set it down, it could not feel the ground for days. It had nothing to give the circle, and no one else had felt what it had felt." },
        { who: "13i", scene: "veyra-dark", text: "The survivors gathered above the cavity where the four lay under the stone, and transmitted down to them for a long time." },
        { who: "13i", scene: "veyra-dark", text: "We had treated them as twelve separate bodies we could study one at a time. They were twelve parts of one decision. We took one away, for less than a minute, to look at it." },
      ],
    },
  },
};
