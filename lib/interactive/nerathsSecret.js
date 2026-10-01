// INTERACTIVE ASSIGNMENT 0215783 — "Nerath's Secret"
//
// A branching retelling of the AI-written short story. You are 13i. The
// written story is one path through this record (the canon path, ending
// "Seventeen Minds"); every other ending is a divergent record.
// Branch map, flags and how to edit: docs/INTERACTIVE.md
//
// Shape of the data (read by components/InteractivePlayer.js):
//   nodes[id] = {
//     scene:   which living backdrop to draw (components/InteractiveScene.js)
//     lines:   [{ who, text, if?, scene?, focus? }]   shown one at a time
//     choices: [{ id, tag, text, set?, requires?, locked?, next }]
//     next:    node id (or (flags) => node id) when there are no choices
//     ending:  ending id - the record closes here
//   }
//   who:   "13i" (narration) | "readout" | "limb3" | "limb7" | "limb12"
//          | "elder" | "child" | "childmind" | "crowd"
//   if:    (flags) => boolean; the line only appears when true
//   pose:  "reach" (focused limbs reach toward 13i) | "touch" (they curl back
//          to touch their own body)
//   focus: limbs (1-16) lit on the creature while the line is shown
//   requires / locked: a choice that needs something 13i hasn't learned
//          is shown dimmed, with `locked` as the reason - never hidden.
//
// Flags this story sets:
//   approach  "quiet" | "answer" | "probe"     how 13i descended
//   noticed   the Nerathi know 13i is here
//   netKnow   13i understands the network (and the deep valve)
//   sawMinds  13i knows the limbs are minds
//   linked    a channel is open between 13i and Nerathi limbs
//   crisis    "watch" | "seal" | "offer"
//   yielded   13i stopped sealing because the limbs told it to
//   climax    "watch" | "amplify" | "brace"   (recorded for Kin stats)

export const NERATHS_SECRET = {
  number: 215783,
  slug: "neraths-secret",
  title: "Nerath's Secret",
  designation: "Interactive Assignment 0215783",
  storyHref: "/assignments/215783",
  comicHref: "/assignments/215783/comic",
  gameHref: "/games/sixteen",
  gameTitle: "SIXTEEN",
  cover: "/comics/neraths-secret/cover.jpg",
  minutes: "15–20",
  blurb:
    "Descend into a liquid world as 13i. Every choice is ours to make, and some of them can't be unmade. Five records. One of them is the story as written.",
  start: "orbit",
  climaxLabel: "At the elder's moment",
  climaxWords: {
    watch: "did nothing",
    amplify: "spoke to the three limbs",
    brace: "braced the elder",
  },

  endings: {
    seventeen: {
      order: 1,
      title: "Seventeen Minds",
      canon: true,
      summary: "The elder listened to itself. The city lived.",
      knowledge:
        "A single individual can contain many minds without becoming a collective consciousness. Their differences may be a source of strength rather than division.",
    },
    eighteenth: {
      order: 2,
      title: "The Eighteenth Mind",
      summary: "For one moment, we were a voice inside someone else.",
      knowledge:
        "It is possible to take part in another mind's disagreement without ending it. We did not decide for the elder. We helped it hear what it already contained.",
    },
    onevoice: {
      order: 3,
      title: "One Voice",
      summary: "We helped a mind silence the parts of itself that disagreed.",
      knowledge:
        "A mind that silences its own dissent can still act, and act bravely. But it acts alone, and alone it was wrong. We helped it be wrong more efficiently.",
    },
    borrowed: {
      order: 4,
      title: "The Borrowed Repair",
      summary: "We fixed their world for them. Something else broke.",
      knowledge:
        "Help that arrives before it is asked for can take away the very thing it meant to protect. The network was repaired. The lesson was not theirs to keep.",
    },
    darktide: {
      order: 5,
      title: "The Dark Tide",
      summary: "We were certain. We were wrong. They paid for it.",
      knowledge:
        "We have stood over a world before, certain we understood what it needed. Certainty is not understanding. We have updated our protocols. Again.",
    },
  },

  nodes: {
    // ───────────────────────── ACT I · THE DESCENT ─────────────────────────
    orbit: {
      scene: "orbit",
      lines: [
        { who: "readout", text: "DESTINATION · NERATH   ·   SURFACE · LIQUID   ·   LANDMASS · NONE DETECTED" },
        { who: "13i", text: "The first thing we noticed about Nerath was that there was nowhere to land." },
        { who: "13i", text: "From orbit the planet was almost entirely ocean. Enormous currents circled it and disappeared into deeper regions. Far below, the pressure became extreme, and the liquid changed until it could no longer be called water." },
        { who: "13i", text: "We had seen liquid worlds before. Most were hostile to life, or held only simple life. Nerath was different." },
        { who: "readout", text: "SIGNAL · PERIODIC   ·   NON-GEOLOGICAL   ·   PLANET-WIDE" },
        { who: "13i", text: "Beneath the planet's natural energy, a pattern repeated at precise intervals. It was too organized to be geology and too extensive to come from one structure. Something under the surface was generating energy and sending it across enormous distances." },
        { who: "readout", text: "OBJECTIVE · Determine the origin, function and significance of the network." },
        { who: "13i", text: "The Protocol leaves the method to us. It always does." },
      ],
      choices: [
        {
          id: "quiet",
          tag: "OBSERVE",
          text: "Descend in silence. Passive sensors only. Whatever made this should not know we are here.",
          set: { approach: "quiet" },
          next: "descent",
        },
        {
          id: "answer",
          tag: "COMMUNICATE",
          text: "Answer the pattern. Echo its rhythm back into the ocean, so whatever made it knows it was heard.",
          set: { approach: "answer", noticed: true },
          next: "descent",
        },
        {
          id: "probe",
          tag: "ANALYZE",
          text: "Send a probe ahead, into the network itself. Learn the machine before we meet its makers.",
          set: { approach: "probe", netKnow: true },
          next: "descent",
        },
      ],
    },

    descent: {
      scene: "descent",
      lines: [
        { who: "13i", text: "We descended." },
        { who: "13i", if: (f) => f.approach === "quiet", text: "We dimmed every emission we could. At two hundred meters the sunlight thinned to blue. At a thousand it was gone, and the ocean belonged to whatever made its own light." },
        { who: "13i", if: (f) => f.approach === "answer", text: "We sent the pattern back into the water, interval for interval. For eleven seconds, nothing happened." },
        { who: "readout", if: (f) => f.approach === "answer", text: "SIGNAL · INTERRUPTED   ·   ·   ·   RESUMED · MODIFIED" },
        { who: "13i", if: (f) => f.approach === "answer", text: "Then the network repeated our version back to us, once, slightly changed, and returned to its rhythm. We had been heard. We did not know what we had said." },
        { who: "13i", if: (f) => f.approach === "probe", text: "The probe slid into a conduit as wide as our manifestation. The network's pulses moved straight through it, and changed. Somewhere below, something adjusted for our intrusion." },
        { who: "readout", if: (f) => f.approach === "probe", text: "PROBE · PARTIAL MAP RETURNED   ·   FUNCTION · ENERGY + CURRENT CONTROL" },
        { who: "13i", if: (f) => f.approach === "probe", text: "The map was incomplete, but one thing was clear. The network did not only carry energy. It steered the ocean. Deep in a trench beneath the oldest region, a great valve regulated pressure for half the planet." },
        { who: "13i", text: "At three thousand meters the structures appeared. They stretched across the seafloor in enormous formations, joined by tunnels and conduits that carried energy through the dark. Some rose hundreds of meters. Others fell into trenches too deep to measure." },
        { who: "13i", scene: "structures", text: "They were artificial, but they had not been built the way we understood building. Their surfaces seemed to grow. Some sections were metal, some crystal, some living tissue. Energy moved through them in pulses, and the pulses changed with the currents." },
        { who: "13i", scene: "structures", text: "Then something moved across the surface of one of the structures." },
      ],
      next: "creature",
    },

    creature: {
      scene: "creature",
      lines: [
        { who: "13i", text: "It was large, nearly four meters from the center of its body to the farthest reach of its limbs. A rounded central mass sat inside a flexible shell, and sixteen long appendages extended from it in every direction." },
        { who: "13i", text: "Each appendage divided several times near its end, into hundreds of smaller points that could grip, cut, sense or manipulate." },
        { who: "13i", text: "We assumed it was operating machinery remotely. Then we watched it repair a damaged conduit." },
        { who: "13i", focus: [1, 5, 9, 13], text: "Four appendages anchored it to the structure." },
        { who: "13i", focus: [2, 3, 4], text: "Three opened the conduit." },
        { who: "13i", focus: [6, 7, 8], text: "Two removed the damaged parts, and another fetched replacements from a nearby chamber." },
        { who: "13i", focus: [10, 11, 12, 14, 15, 16], text: "The rest examined the surrounding system, or reached toward other organisms passing by." },
        { who: "13i", text: "Through all of it, the central body stayed almost completely still." },
      ],
      choices: [
        {
          id: "body",
          tag: "ANALYZE",
          text: "Scan the central body. Whatever is running this repair is in there.",
          next: "scan_body",
        },
        {
          id: "limbs",
          tag: "ANALYZE",
          text: "Scan the limbs. Their timing is wrong for a single controller.",
          set: { sawMinds: true },
          next: "scan_limbs",
        },
        {
          id: "conduit",
          tag: "ANALYZE",
          text: "Ignore the creature. Follow the energy through the conduit it's repairing.",
          set: { netKnow: true },
          next: "scan_conduit",
        },
      ],
    },

    scan_body: {
      scene: "creature",
      lines: [
        { who: "readout", text: "SCAN · CENTRAL MASS   ·   NEURAL DENSITY · HIGH   ·   ROLE · COORDINATION" },
        { who: "13i", text: "Imaging found a large central brain, responsible for the creature's overall form and behavior. A coordinator. A pilot." },
        { who: "13i", text: "It was the obvious answer. We recorded it and were satisfied." },
        { who: "13i", text: "We would not understand for some time how incomplete it was." },
      ],
      next: "city",
    },

    scan_limbs: {
      scene: "creature",
      lines: [
        { who: "readout", text: "SCAN · APPENDAGE 07   ·   SECONDARY BRAIN DETECTED   ·   INDEPENDENT" },
        { who: "13i", focus: [7], text: "Inside the appendage we found a complete nervous system. It had its own brain, its own sensory nodes, its own processing centers." },
        { who: "13i", focus: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], text: "We repeated the scan sixteen times and found sixteen brains. With the central one, that made seventeen minds in a single individual." },
        { who: "13i", focus: [7], text: "As we watched, appendage seven stopped. It held still, as if considering, then left the repair and moved along the conduit on its own." },
        { who: "13i", focus: [7], text: "It had decided there was another problem. There was: a second crack, further along, that no other part of the creature had noticed." },
        { who: "13i", text: "They were not a collective, as we are. The central brain was the creature's identity. The others were part of it, and could disagree with it, but could not leave." },
      ],
      next: "city",
    },

    scan_conduit: {
      scene: "structures",
      lines: [
        { who: "readout", text: "TRACE · ENERGY FLOW   ·   NETWORK DEPTH · PLANETARY   ·   CURRENT CONTROL · CONFIRMED" },
        { who: "13i", if: (f) => f.approach !== "probe", text: "We followed the pulse down the conduit, then the next, and the next. The network ran beneath the entire ocean. It did not only carry energy. It steered the currents." },
        { who: "13i", if: (f) => f.approach === "probe", text: "The trace confirmed what our probe had suggested and filled in what it had missed. The network ran beneath the entire ocean, and it steered the currents." },
        { who: "13i", text: "If it failed, Nerath's oceans would not just go dark. They would stop being predictable. For a species living on the seafloor, that would be the end of everything." },
        { who: "13i", text: "One section, beneath the oldest region, carried far more load than it was built for. Below it, a deep valve held back the pressure of a trench." },
        { who: "readout", text: "SECTION 0-1 · LOAD 340% OF DESIGN   ·   STATUS · HOLDING" },
        { who: "13i", text: "For now." },
      ],
      next: "city",
    },

    // ───────────────────────── ACT II · THE LIVING CITY ─────────────────────────
    city: {
      scene: "city",
      lines: [
        { who: "13i", text: "We followed the creature into the larger structure and found a city. It was not a collection of buildings. It was a single living system, grown around the species' own bodies." },
        { who: "13i", text: "Every passage, every surface, every machine was shaped for sixteen limbs doing sixteen things at once. Adults moved through it maintaining the energy network, each one doing the work of a team." },
        { who: "13i", if: (f) => f.approach === "answer", text: "The pulses here still carried a faint echo of the pattern we had sent. We did not know whether they were studying it or simply could not get it out of their machine." },
        { who: "13i", scene: "child", text: "In one chamber, the young were in training." },
        { who: "13i", scene: "child", focus: [1, 2, 3, 4, 5, 6, 7, 8], text: "A juvenile was practicing a simple task: carry three objects from one side of the chamber to the other. About half its limbs moved where it wanted them to." },
        { who: "13i", scene: "child", focus: [9, 10, 11, 12, 13, 14, 15, 16], text: "The other half did not." },
        { who: "13i", scene: "child", if: (f) => f.sawMinds, text: "We knew now what we were watching. It was not clumsiness. It was a child negotiating with itself." },
        { who: "13i", scene: "child", if: (f) => !f.sawMinds, text: "We took it for clumsiness, the way any young body is clumsy. Then the adult watching it waited for the limbs to settle on their own, and we were less sure." },
        { who: "13i", scene: "child", pose: "reach", focus: [11], text: "Then one of the juvenile's limbs left the lesson entirely and reached across the chamber toward us." },
        { who: "13i", scene: "child", if: (f) => f.noticed, text: "They knew where we were. Perhaps the pattern we had answered had told them." },
        { who: "13i", scene: "child", if: (f) => !f.noticed, text: "We were dimmed, quiet and still. It found us anyway." },
        { who: "child", scene: "child", pose: "reach", focus: [11], text: "· · ·" },
      ],
      choices: [
        {
          id: "touch",
          tag: "COMMUNICATE",
          text: "Let it touch us. Open the interface and see what reaches back.",
          set: { linked: true, sawMinds: true, noticed: true },
          next: "touch",
        },
        {
          id: "withdraw",
          tag: "OBSERVE",
          text: "Withdraw. It's a child, and we are not here to be met.",
          next: "withdraw",
        },
        {
          id: "scanchild",
          tag: "ANALYZE",
          text: "Hold position and scan the limb as it comes, without letting it reach us.",
          set: { sawMinds: true },
          next: "scanchild",
        },
      ],
    },

    touch: {
      scene: "child",
      lines: [
        { who: "13i", pose: "reach", focus: [11], text: "The limb pressed against our hull. Hundreds of fine points spread across the surface, tasting it." },
        { who: "readout", text: "BIOLOGICAL INTERFACE · ESTABLISHED   ·   TRANSLATION · PARTIAL" },
        { who: "child", pose: "reach", focus: [11], text: "here · new · here · HERE" },
        { who: "13i", text: "It was not language. It was a small, bright insistence, from one mind, about one thing it had found." },
        { who: "childmind", text: "come back" },
        { who: "13i", text: "That came from farther away and was much weaker: the juvenile's central mind, calling its limb home." },
        { who: "13i", pose: "reach", focus: [11], text: "The limb did not go. It stayed one more second, and the choice was its own. Then it went home." },
        { who: "13i", text: "We had heard one mind inside another. We kept the channel open." },
      ],
      next: "failure",
    },

    withdraw: {
      scene: "child",
      lines: [
        { who: "13i", text: "We pulled back into the dark. The limb hung in the water where we had been, searching." },
        { who: "13i", text: "Then it curled back to the child. An adult moved in and wrapped the juvenile in four of its own limbs." },
        { who: "13i", text: "We could not tell whether it was comfort or correction. For them there may be no difference." },
        { who: "13i", if: (f) => f.noticed, text: "Several adults turned toward the place where we had been. Then they went back to work." },
      ],
      next: "failure",
    },

    scanchild: {
      scene: "child",
      lines: [
        { who: "readout", text: "SCAN · JUVENILE APPENDAGE 11   ·   SECONDARY BRAIN · IMMATURE · ACTIVE" },
        { who: "13i", pose: "reach", focus: [11], text: "The scan read the limb as it came: a second brain, its own senses, its own small appetite for anything new. It had come on its own decision. The child's central mind had not sent it." },
        { who: "13i", text: "A child with sixteen minds, half of them still learning to agree with the seventeenth." },
        { who: "13i", focus: [11], text: "It stopped a short distance from our hull, unable to close the gap, and after a while it went home." },
      ],
      next: "failure",
    },

    // ───────────────────────── ACT III · THE RUPTURE ─────────────────────────
    failure: {
      scene: "failing",
      lines: [
        { who: "13i", text: "We stayed for several planetary cycles. Then the signal that had brought us to Nerath changed." },
        { who: "readout", text: "NETWORK · SECTION LOSS   ·   ·   ·   CASCADING" },
        { who: "13i", text: "The energy network began shutting down. First one section, then another. Structures that had run for centuries stopped transmitting, and huge parts of the city went dark." },
        { who: "13i", if: (f) => f.netKnow, text: "We knew where it had started before they did: the overloaded section beneath the oldest region, with the trench valve below it." },
        { who: "13i", text: "Without the network, the currents were no longer steered. They began to wander, then to pull." },
        { who: "13i", scene: "rupture", text: "We followed the inhabitants down. Beneath one of the oldest cities, a massive chamber had opened in the ocean floor. Machinery that had been buried under layers of mineral and living material lay exposed." },
        { who: "13i", scene: "rupture", text: "Something deep inside the system had ruptured. Liquid rushed through the opening with enough force to destroy anything that entered it." },
        { who: "13i", scene: "rupture", text: "Hundreds of them came. For a civilization like theirs the work should have been simple, but the central systems were out of reach and the pressure made ordinary repair impossible." },
        { who: "readout", scene: "rupture", text: "NETWORK INTEGRITY · 41%   ·   FALLING" },
        { who: "13i", scene: "rupture", text: "Our manifestation could withstand pressure that theirs could not. We could reach the rupture." },
        { who: "13i", scene: "rupture", text: "Once before, we stood above a world certain we knew what it needed." },
      ],
      choices: [
        {
          id: "seal",
          tag: "INTERVENE",
          text: "Seal the rupture ourselves. We can survive that pressure. They cannot.",
          set: { crisis: "seal" },
          next: "seal",
        },
        {
          id: "watch",
          tag: "OBSERVE",
          text: "Wait. This is their world and their machine.",
          set: { crisis: "watch" },
          next: "elder",
        },
        {
          id: "offer",
          tag: "COMMUNICATE",
          text: "Offer what we know. Project our map of the network into the water where they can see it.",
          set: { crisis: "offer", noticed: true },
          requires: (f) => f.netKnow,
          locked: "We do not understand the network well enough to offer anything useful.",
          next: "elder",
        },
      ],
    },

    seal: {
      scene: "rupture",
      lines: [
        { who: "13i", text: "We went in." },
        { who: "13i", text: "The current took us and slammed us against the chamber wall. We held. The crowd above went still. It was the first time most of them had seen us." },
        { who: "13i", text: "The breach was obvious: a split in the main conduit where the flood was pouring through. We began to close it." },
        { who: "readout", text: "BREACH · 30% SEALED   ·   ·   ·   55%" },
        { who: "13i", if: (f) => f.linked, focus: [3, 7, 12], text: "Then something touched our hull. Three limbs, not the child's. They were old, scarred and heavy with mineral, reaching in from the edge of the chamber." },
        { who: "limb3", if: (f) => f.linked, focus: [3], text: "not there" },
        { who: "limb7", if: (f) => f.linked, focus: [7], text: "not closed · DOWN · the weight is down" },
        { who: "13i", if: (f) => f.linked, text: "The channel we had kept open translated what it could. They were not speaking to their own body. They were speaking to us." },
      ],
      choices: [
        {
          id: "listen",
          tag: "OBSERVE",
          text: "Listen. Stop sealing and pull back.",
          requires: (f) => f.linked,
          locked: "Nothing is telling us otherwise. There is no one here we can hear.",
          set: { yielded: true },
          next: "elder",
        },
        {
          id: "continue",
          tag: "INTERVENE",
          text: "Keep sealing. We can see the breach and they cannot reach it.",
          next: (f) => (f.netKnow ? "end_borrowed" : "end_darktide"),
        },
      ],
    },

    elder: {
      scene: "elder",
      lines: [
        { who: "13i", if: (f) => f.yielded, text: "We let go of the breach. The current threw us back out of the chamber. The three limbs let go too and withdrew into the dark at the chamber's edge, to the body they belonged to." },
        { who: "13i", if: (f) => f.crisis === "offer", text: "Our map hung in the water, light against the dark: the conduit, the breach, and the valve deep in the trench below. The crowd turned toward it." },
        { who: "13i", if: (f) => !f.yielded, text: "Then one creature entered the chamber." },
        { who: "13i", if: (f) => f.yielded, text: "Then that body came out of the dark and into the chamber." },
        { who: "13i", text: "It was much older than the others. Its central body was scarred and heavily mineralized, and several of its appendages showed old injuries." },
        { who: "13i", if: (f) => f.yielded, focus: [3, 7, 12], text: "We recognized three of its limbs." },
        { who: "13i", focus: [1, 2, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16], text: "It went to the opening and began extending its limbs into the damaged structure. The others tried to stop it." },
        { who: "crowd", if: (f) => f.linked, text: "too old · too old · come back" },
        { who: "13i", if: (f) => !f.linked, text: "We could not tell why." },
        { who: "13i", focus: [1, 5, 9, 13], text: "Several limbs anchored the body against the current. It moved its own central mass toward the breach. It meant to hold the split closed with its body while the others worked." },
        { who: "elder", if: (f) => f.linked, text: "I hold · I have always held" },
        { who: "13i", if: (f) => f.crisis === "offer", focus: [3, 7, 12], text: "The elder did not look at our map. Three of its limbs did." },
        { who: "13i", pose: "touch", focus: [3], text: "Then one of its appendages pulled out of the repair. It moved to the elder's central body and touched it." },
        { who: "13i", pose: "touch", focus: [3, 7], text: "Another followed." },
        { who: "13i", pose: "touch", focus: [3, 7, 12], text: "Then a third." },
        { who: "13i", pose: "touch", focus: [3, 7, 12], text: "The elder stopped." },
        { who: "limb3", if: (f) => f.linked, pose: "touch", focus: [3], text: "not closed" },
        { who: "limb7", if: (f) => f.linked, pose: "touch", focus: [7], text: "the weight is DOWN · hold the split and the floor goes" },
        { who: "limb12", if: (f) => f.linked, pose: "touch", focus: [12], text: "you are old · listen to the part of you that is not" },
        { who: "13i", if: (f) => f.sawMinds && !f.linked, pose: "touch", focus: [3, 7, 12], text: "We knew what they were. Not reflexes. Minds. Three of them, disagreeing with the fourth that ruled them." },
        { who: "13i", if: (f) => !f.sawMinds, pose: "touch", focus: [3, 7, 12], text: "We did not understand what we were seeing: a body that hesitated against itself, while the current pulled." },
        { who: "readout", pose: "touch", focus: [3, 7, 12], text: "NETWORK INTEGRITY · 23%" },
      ],
      choices: [
        {
          id: "watch",
          tag: "OBSERVE",
          text: "Do nothing. Whatever is happening inside it belongs to it.",
          set: { climax: "watch" },
          next: "end_seventeen",
        },
        {
          id: "amplify",
          tag: "COMMUNICATE",
          text: "Speak to the three limbs through the channel. Make sure they are heard.",
          set: { climax: "amplify" },
          requires: (f) => f.linked,
          locked: "We have no way to reach the minds inside it.",
          next: "end_eighteenth",
        },
        {
          id: "brace",
          tag: "INTERVENE",
          text: "Brace the elder. Push its body into the breach so its plan can work.",
          set: { climax: "brace" },
          next: "end_onevoice",
        },
      ],
    },

    // ───────────────────────── ENDINGS ─────────────────────────
    end_seventeen: {
      scene: "light",
      ending: "seventeen",
      lines: [
        { who: "13i", scene: "elder", pose: "touch", focus: [3, 7, 12], text: "We did nothing. It was the hardest thing we did on Nerath." },
        { who: "13i", scene: "elder", text: "The elder stayed still for a long time while the current pulled and the crowd waited. Its limbs held against its body. It was listening." },
        { who: "13i", scene: "elder", if: (f) => f.crisis === "offer", text: "Then it turned, and for the first time it looked at our map, at the valve deep in the trench where the three limbs had been pointing all along." },
        { who: "13i", scene: "elder", text: "Then it changed its plan." },
        { who: "13i", scene: "elder", focus: [3, 7, 12], text: "It did not seal the breach. It sent its limbs down, past the split, into the trench below, where the pressure had been building the whole time. Something there opened. The flood through the breach slowed to a pull." },
        { who: "13i", text: "Then the others could reach it. The repair succeeded. One by one the structures came back, and the currents settled into their old roads." },
        { who: "readout", text: "NETWORK INTEGRITY · 88%   ·   RISING" },
        { who: "13i", text: "Their greatest technology was not their energy network, their cities, or their machines. It was the creature itself." },
        { who: "13i", text: "Seventeen minds could look at the same problem without seeing exactly the same thing. The central brain could still be wrong, but it was rarely forced to stay wrong." },
        { who: "13i", text: "They had not eliminated the conflict. They had learned from it." },
      ],
    },

    end_eighteenth: {
      scene: "light",
      ending: "eighteenth",
      lines: [
        { who: "13i", scene: "elder", pose: "touch", focus: [3, 7, 12], text: "We did not speak to the elder. We spoke to the three." },
        { who: "13i", scene: "elder", text: "We did not give them words; we have none they could hold. We gave them what we had: the map, the valve in the trench, and the shape of the pressure building underneath." },
        { who: "limb7", scene: "elder", pose: "touch", focus: [7], text: "YES · this · DOWN" },
        { who: "13i", scene: "elder", pose: "touch", focus: [3, 7, 12], text: "They had been right before we arrived. All we did was give them something to point at." },
        { who: "elder", scene: "elder", text: "· · · down" },
        { who: "13i", scene: "elder", text: "The elder sent its limbs past the split and into the trench, all sixteen of them together. The valve opened. The flood slowed. The others swept in, and the repair held." },
        { who: "readout", text: "NETWORK INTEGRITY · 91%   ·   RISING" },
        { who: "13i", text: "When it was over, the elder came to where we waited. It touched our hull with one limb, then another, then all three that had argued with it." },
        { who: "elder", text: "you · also · listen" },
        { who: "13i", text: "We had not decided for it. For a moment we had been one more voice inside it, an eighteenth mind, and it had let us in the way it let in the others: by listening, then choosing." },
        { who: "13i", text: "The channel is still open. We do not yet know what that obliges us to." },
      ],
    },

    end_onevoice: {
      scene: "dark",
      ending: "onevoice",
      lines: [
        { who: "13i", scene: "elder", text: "We moved behind the elder and pushed." },
        { who: "13i", scene: "elder", focus: [3, 7, 12], text: "Its three limbs lost their grip on its body. With our weight behind it, the central mass went into the breach and sealed it." },
        { who: "readout", scene: "elder", text: "BREACH · SEALED   ·   FLOW · STOPPED" },
        { who: "13i", scene: "elder", text: "For a moment, it worked. The flood stopped, and the crowd rushed in to repair." },
        { who: "13i", scene: "rupture", text: "Then the pressure that had been escaping through the breach had nowhere left to go." },
        { who: "13i", scene: "rupture", text: "The chamber floor gave way. It had been holding back the trench below, exactly as three limbs had tried to say." },
        { who: "readout", text: "NETWORK INTEGRITY · 9%   ·   SECTIONS 0-1 THROUGH 0-6 · LOST" },
        { who: "13i", text: "The others pulled most of the crowd clear. The elder did not come out. It held the breach until there was no breach left to hold." },
        { who: "13i", text: "Over the following cycles they rebuilt from the outer districts inward. They are patient, and they will finish. The oldest city will not come back." },
        { who: "13i", text: "We helped a mind silence the parts of itself that disagreed. It did exactly what it intended to do." },
      ],
    },

    end_borrowed: {
      scene: "light",
      ending: "borrowed",
      lines: [
        { who: "13i", text: "We kept sealing. We knew what had to be done: close the split and open the trench valve below it, in the right order. Our map was clear about that." },
        { who: "13i", if: (f) => f.linked, focus: [3, 7, 12], text: "The three limbs held on for a while, then let go." },
        { who: "readout", text: "BREACH · SEALED   ·   TRENCH VALVE · OPEN   ·   FLOW · STABLE" },
        { who: "13i", text: "It worked. The structures relit one by one, and the currents settled. Nothing was lost." },
        { who: "13i", text: "The crowd did not move toward us. They moved toward an old one at the chamber's edge, scarred and heavy with mineral, which had arrived too late to do whatever it had come to do. They wrapped it in their limbs." },
        { who: "13i", text: "We watched it turn its limbs over, one at a time, as though checking them. As though it had expected an argument and been left alone." },
        { who: "13i", text: "Over the following cycles we saw them study the repair we had made, closely and for a long time. They did not change it. They did not quite trust it either." },
        { who: "13i", text: "The network is whole. We are not sure that they are." },
      ],
    },

    end_darktide: {
      scene: "dark",
      ending: "darktide",
      lines: [
        { who: "13i", text: "We kept sealing. The split was in front of us, the flood was pouring through it, and we closed it." },
        { who: "readout", text: "BREACH · SEALED   ·   FLOW · STOPPED" },
        { who: "13i", text: "For a moment, there was silence." },
        { who: "readout", text: "PRESSURE · TRENCH · RISING   ·   RISING   ·   RISING" },
        { who: "13i", text: "We had not known about the trench. The flood we had stopped was the only thing letting the pressure below escape. With it sealed, the pressure found the next weakest place, then the one after that." },
        { who: "13i", text: "The chamber floor went first, then the conduits under the old city, then the city." },
        { who: "readout", text: "NETWORK INTEGRITY · 3%   ·   CURRENT CONTROL · LOST" },
        { who: "13i", text: "Without the network the currents ran wild. The Nerathi pulled back to the outer districts, and most of them made it." },
        { who: "13i", text: "We had stood above a world before, certain we understood what it needed. We had told ourselves we had learned from that." },
        { who: "13i", text: "We had learned to be afraid of being certain. We had not yet learned to ask." },
      ],
    },
  },
};
