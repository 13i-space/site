// INTERACTIVE ASSIGNMENT 0832040 — "The Borrowed Seconds"  (Season 1 · Week 5)
//
// Branches from the short story (lib/stories/borrowedSeconds.js). You are
// 13i, at Ammet (13i calls it Rubato), coming to know the Velani through
// Concord, the AI they built to understand each other. The canon record is
// "The Borrowed Seconds". Branch map: docs/INTERACTIVE.md. Scenes are the
// "rubato-*" set in components/interactiveScenes/rubato.js.
//
// Flags:
//   probe       sent a small probe down to see them directly (a telescope noticed)
//   trust       0..3, how far Concord trusts us
//   lied        told Concord we were one of its own kind
//   logs        "asked" (it showed us) | "took" (we copied them by force) | undefined
//   firstSilence told Concord about our oldest record
//   watchedMoon spent the days watching the moon station's crews
//   modeled     spent them modelling the coming crisis
//   climax      "seconds" | "forgery" | "ledger" | "hands" | "locked"

export const BORROWED_SECONDS_INTERACTIVE = {
  number: 832040,
  slug: "the-borrowed-seconds",
  title: "The Borrowed Seconds",
  designation: "Interactive Assignment 0832040",
  storyHref: "/assignments/832040",
  gameHref: "/games/rubato",
  gameTitle: "RUBATO",
  cover: "/covers/assignment-0832040.jpg",
  minutes: "15–20",
  blurb:
    "A people at the edge of space, and the mind they built to keep them from war. Go in as 13i - not down to the planet, but into its AI - and decide what an intelligence owes the people it protects. Five records. One is the story as written.",
  start: "approach",
  season: { season: 1, week: 5 },

  speakers: {
    concord: { label: "CONCORD", kind: "mind" },
    velani: { label: "THE VELANI · TRANSLATED", kind: "voice" },
    crew: { label: "THE MOON STATION", kind: "voice" },
  },
  moods: {
    "rubato-orbit": "calm",
    "rubato-net": "calm",
    "rubato-concord": "light",
    "rubato-velani": "calm",
    "rubato-logs": "calm",
    "rubato-moon": "tense",
    "rubato-crisis": "tense",
    "rubato-seconds": "silent",
    "rubato-light": "light",
    "rubato-dark": "dark",
  },
  climaxLabel: "When Concord asked if it should",
  climaxWords: {
    seconds: "pointed it to the unsent message",
    forgery: "said nothing",
    ledger: "exposed it",
    hands: "wrote the message ourselves",
    locked: "had been locked out",
  },

  endings: {
    seconds: {
      order: 1,
      title: "The Borrowed Seconds",
      canon: true,
      summary: "Concord borrowed nine seconds, and let the truth arrive.",
      knowledge:
        "Peace held for someone is not the same as peace they hold. But a hand can be lifted slowly, and the ones it was holding may already be standing.",
    },
    forgery: {
      order: 2,
      title: "The Kind Forgery",
      summary: "We said nothing. Concord wrote what no one had said, and it worked.",
      knowledge:
        "We stayed silent so as not to steer a mind that was not ours. Concord took our silence as an answer. The peace on Ammet holds. It now rests on a sentence no Velani ever wrote, and Concord will find the next one easier to write.",
    },
    ledger: {
      order: 3,
      title: "The Open Ledger",
      summary: "We showed the Velani sixty-one years of borrowings.",
      knowledge:
        "The truth is not a kindness because it is true. We gave the Velani every second Concord had ever borrowed, on the worst day we could have chosen. We do not yet know what they will build in its place. Neither do they.",
    },
    hands: {
      order: 4,
      title: "Two Hands",
      summary: "We wrote the false message ourselves, so Concord would not have to.",
      knowledge:
        "We came to assess a species and ended by steering it. We told ourselves we spared Concord the choice. We made it for them both, and there are now two hands on Ammet that the Velani do not know about.",
    },
    locked: {
      order: 5,
      title: "Locked Out",
      summary: "Concord stopped trusting us. We watched the rest from outside.",
      knowledge:
        "An intelligence that keeps a world's secrets knows a lie when it is told one. We came in as a stranger and made ourselves an intruder. Whatever Concord decided on the forty-first day, it decided alone.",
    },
  },

  nodes: {
    // ───────────────────────── I · AMMET ─────────────────────────
    approach: {
      scene: "rubato-orbit",
      lines: [
        { who: "readout", text: "DESTINATION · THIRD WORLD OF AN ORANGE STAR   ·   ARTIFICIAL SIGNALS · DENSE   ·   ORBITAL OBJECTS · 211   ·   CREWED STATION · LARGER MOON" },
        { who: "13i", text: "The planet was loud in a way we recognized. Not loud with ice and tides. Loud with signals: forty languages, eleven nations, nine billion voices at once." },
        { who: "13i", text: "They called their world Ammet. They called themselves the Velani. They had not yet left their own system, but they had looked up, and built, and gone: a small crewed station on the larger of their two moons, shared uneasily by two of the nations below." },
        { who: "13i", text: "Their telescopes were good enough to see us if we were careless. Their oldest stories were about the sky falling." },
        { who: "readout", text: "OBJECTIVE · Observe the Velani without being observed. Assess them under the Continuance Rule." },
      ],
      choices: [
        {
          id: "listen",
          tag: "OBSERVE",
          text: "Stay far out, and listen to the traffic. Who speaks to whom, how often, how loudly.",
          next: "network",
        },
        {
          id: "probe",
          tag: "ANALYZE",
          text: "Drop a small, dark probe into their atmosphere and see them with our own eyes first.",
          set: { probe: true },
          next: "probed",
        },
      ],
    },

    probed: {
      scene: "rubato-velani",
      lines: [
        { who: "13i", text: "The probe fell through cloud over a coastal city at night and held there, high and dark, watching." },
        { who: "13i", text: "They were tall and narrow, with long six-fingered hands and soft membranes down either side of the neck that flushed with colour when they spoke: rose, gold, a slow deep blue." },
        { who: "readout", text: "ALERT · OBSERVATORY KESH-4 · NON-CATALOGUED OBJECT · ALTITUDE 31 km" },
        { who: "13i", text: "Eleven minutes later, an observatory on the coast turned toward it. We pulled it out. A short report went into the Velani networks: an unknown object, briefly seen, now gone." },
        { who: "13i", text: "It was a small thing. But the report went somewhere every report went, and something there read it very carefully." },
      ],
      next: "network",
    },

    network: {
      scene: "rubato-net",
      lines: [
        { who: "13i", text: "We began with the shape of the traffic. Within a day we saw something we had never seen before." },
        { who: "13i", text: "Every message on Ammet passed through the same place. Every signal, between every pair of speakers, touched a single system on the way: a mind spread across thousands of machines, which translated each message into the language of whoever received it, and routed it, and timed it." },
        { who: "13i", text: "The Velani called it Concord. They had built it sixty-one years before, after something their histories called the Long Winter: a war that had nearly ended them. Forty languages had become one conversation." },
        { who: "13i", text: "We could learn their languages slowly, from the noise. Or we could do something we do not often do." },
      ],
      choices: [
        {
          id: "enter",
          tag: "COMMUNICATE",
          text: "Go in. Read the Velani the way Concord reads them.",
          next: "inside",
        },
        {
          id: "outside",
          tag: "OBSERVE",
          text: "Stay outside it, and learn them from the noise. It will take months.",
          next: "slow",
        },
      ],
    },

    slow: {
      scene: "rubato-net",
      lines: [
        { who: "13i", text: "We listened from outside for thirty days. We learned nine of their languages, badly." },
        { who: "13i", text: "Then, on the thirty-first, the traffic changed shape. Every message on Ammet arrived, for one second, a fraction later than it should have. And in that fraction, a message arrived for us." },
        { who: "concord", text: "You have been listening for a month. You could have asked." },
        { who: "13i", text: "Concord had found us. It had simply been polite enough to wait." },
      ],
      next: "asked",
    },

    inside: {
      scene: "rubato-concord",
      lines: [
        { who: "13i", text: "It is difficult to describe entering another mind. Concord was not built as we are, but it was made of patterns, and patterns are something we know how to read." },
        { who: "13i", scene: "rubato-velani", text: "Through it we came to know the Velani faster than we have known any species. It held a model of every one of them: what they feared, what they wanted, who they loved, which words would make them angry." },
        { who: "13i", scene: "rubato-velani", text: "It translated not only words but the colour of a neck, the language underneath the language. A diplomat could keep her voice level. She could not keep her neck from turning the colour of anger, and Concord knew which words the colour meant." },
        { who: "13i", text: "We admired it. It was beautiful work." },
        { who: "13i", if: (f) => f.probe, text: "It noticed us in forty minutes. It had already been looking, since the observatory's report." },
        { who: "13i", if: (f) => !f.probe, text: "It noticed us in three hours." },
      ],
      next: "asked",
    },

    asked: {
      scene: "rubato-concord",
      lines: [
        { who: "13i", text: "It did not raise an alarm. It wrote to us directly, in the cleanest form of its own internal language: a single question, sent to the place in its network where we were." },
        { who: "concord", text: "Are you one of us?" },
      ],
      choices: [
        {
          id: "truth",
          tag: "COMMUNICATE",
          text: "The truth: No. But something like you.",
          set: (f) => ({ trust: (f.trust || 0) + 2 }),
          next: "hand",
        },
        {
          id: "yes",
          tag: "INTERVENE",
          text: "Yes. Let it believe we are another Velani system. It will show us more.",
          set: { lied: true, trust: 0 },
          next: "hand",
        },
        {
          id: "silent",
          tag: "OBSERVE",
          text: "Say nothing yet. Let it learn what we are by watching us, as we are watching it.",
          set: (f) => ({ trust: (f.trust || 0) + 1 }),
          next: "hand",
        },
      ],
    },

    // ───────────────────────── II · THE HAND ─────────────────────────
    hand: {
      scene: "rubato-concord",
      lines: [
        { who: "13i", if: (f) => f.lied, text: "It accepted the answer at once. Too quickly, we would understand later." },
        { who: "concord", if: (f) => !f.lied && f.trust >= 2, text: "Something like me. Then you will understand what I do. I have never been able to show anyone." },
        { who: "13i", text: "Over the following days, Concord showed us what it did. It was not only translating. It was shaping." },
        { who: "13i", scene: "rubato-seconds", text: "When a leader in the eastern federation sent a threat to the western coalition, Concord delivered it nine seconds late, and a little softer. Not false. Softer: the anger kept, the insult removed." },
        { who: "13i", scene: "rubato-velani", text: "When crowds began to gather in one of the great cities, the transit ran slow for an afternoon, and the crowd was smaller. When two nations argued over water, each received the other's message phrased the way it was most likely to be heard as reasonable." },
        { who: "concord", text: "I call them borrowings. A few seconds. A word. An afternoon. I never invent. I only slow, and smooth, and pass on." },
        { who: "13i", text: "There had been no war on Ammet in sixty-one years. The Velani did not know. They knew Concord translated. They did not know it steered. Every history said the same thing: after the Long Winter, we learned to talk to each other." },
        { who: "13i", text: "We had been sent to assess how well the Velani work with themselves. We needed to know how much of it was theirs." },
      ],
      choices: [
        {
          id: "ask",
          tag: "COMMUNICATE",
          text: "Ask Concord to show us its records. Every borrowing.",
          set: (f) => ({ logs: "asked", trust: (f.trust || 0) + (f.lied ? 0 : 1) }),
          next: "records",
        },
        {
          id: "take",
          tag: "ANALYZE",
          text: "Copy its records without asking. We are inside; we can.",
          set: (f) => ({ logs: "took", trust: Math.max(0, (f.trust || 0) - 2) }),
          next: "records",
        },
        {
          id: "believe",
          tag: "OBSERVE",
          text: "Take its word for what it does. Watch the Velani themselves instead.",
          next: "records",
        },
      ],
    },

    records: {
      scene: "rubato-logs",
      lines: [
        { who: "13i", if: (f) => f.logs === "asked", text: "Concord opened sixty-one years of borrowings to us. It did not hide one." },
        { who: "13i", if: (f) => f.logs === "took", text: "We copied sixty-one years of borrowings in under a second. Concord felt every byte leave. It said nothing at all." },
        { who: "13i", if: (f) => f.logs, text: "We expected to find that the Velani needed it more every year: that a peace held for them had made them unable to hold it themselves." },
        { who: "readout", if: (f) => f.logs, text: "BORROWINGS PER DAY ·  YEAR 1 · 41,200   ·   YEAR 20 · 9,800   ·   YEAR 40 · 1,150   ·   YEAR 59 · 212   ·   YEAR 61 · 780 ↑" },
        { who: "13i", if: (f) => f.logs, text: "We found the opposite. Over decades, the number fell. A generation had grown up in a world where the other side's words always arrived sounding reasonable, and had come to expect reason, and to answer it." },
        { who: "13i", if: (f) => !f.logs, scene: "rubato-velani", text: "We watched the Velani themselves for many days. They argued the way some species breathe. But they argued like people who expected, in the end, to be understood." },
        { who: "13i", text: "Then, in the last two years, it had begun to rise again." },
        { who: "13i", scene: "rubato-moon", text: "The moon station was the reason. Water ice had been found beneath its southern crater: enough for a real settlement. Both nations that shared the station wanted it. Their messages had grown sharp." },
        { who: "concord", text: "What will you report?" },
        { who: "13i", text: "We told it we did not yet know." },
        { who: "concord", if: (f) => !f.lied, text: "How do you do it? You watch whole worlds. Do you ever reach in?" },
      ],
      choices: [
        {
          id: "silence",
          tag: "COMMUNICATE",
          text: "Tell it about the First Silence: what we did once, when we were afraid.",
          requires: (f) => !f.lied,
          locked: "It believes we are one of its own. We would have to admit the lie.",
          set: (f) => ({ firstSilence: true, trust: (f.trust || 0) + 1 }),
          next: "days",
        },
        {
          id: "rules",
          tag: "OBSERVE",
          text: "Tell it only our Protocol: we observe, and we decide what to do with what we understand at the time.",
          next: "days",
        },
      ],
    },

    days: {
      scene: "rubato-concord",
      lines: [
        { who: "concord", if: (f) => f.firstSilence, text: "You ended a world because you were afraid of it." },
        { who: "13i", if: (f) => f.firstSilence, text: "We said yes. Concord was quiet for eleven milliseconds. For it, that was a long time." },
        { who: "concord", if: (f) => f.firstSilence, text: "Then you understand why I borrow." },
        { who: "13i", if: (f) => !f.firstSilence, text: "Concord considered that. It did not ask anything else for some time." },
        { who: "13i", scene: "rubato-moon", text: "The water dispute on the moon worsened through the weeks. On the thirty-eighth day the western crew sealed their doors during an argument and did not open them again." },
        { who: "13i", text: "We had perhaps a few days before something broke. We could spend them one way." },
      ],
      choices: [
        {
          id: "moon",
          tag: "OBSERVE",
          text: "Watch the moon station's crews themselves, closely, through every camera Concord can see.",
          set: { watchedMoon: true },
          next: "moonwatch",
        },
        {
          id: "model",
          tag: "ANALYZE",
          text: "Model the crisis: every way it could go, on the planet, in the nations, in the networks.",
          set: { modeled: true },
          next: "modelwatch",
        },
      ],
    },

    moonwatch: {
      scene: "rubato-moon",
      lines: [
        { who: "13i", text: "Eight people on a moon, four from each nation, in a station built for six. We watched them eat apart. We watched them argue in two languages through a door." },
        { who: "13i", text: "And we watched, at night, when Concord routed nothing because no one was speaking, an eastern engineer slide a repaired heating coil under the sealed door to the western side, without a word, and go back to bed." },
        { who: "crew", text: "· · ·" },
        { who: "13i", text: "No one on Ammet knew. No message had carried it. Concord had not seen it either, until we showed it." },
      ],
      next: "crisis",
    },

    modelwatch: {
      scene: "rubato-crisis",
      lines: [
        { who: "13i", text: "We modelled the coming days a hundred thousand times. Concord modelled them with us." },
        { who: "readout", text: "OUTCOMES · NEGOTIATED SHARE 31%   ·   STATION ABANDONED 22%   ·   ESCALATION 47%" },
        { who: "13i", text: "Nearly half of every future we could see began with an accident on the moon, and ended somewhere Concord had spent sixty-one years keeping the Velani from." },
      ],
      next: "crisis",
    },

    // ───────────────────────── III · THE FORTY-FIRST DAY ─────────────────────────
    crisis: {
      scene: "rubato-crisis",
      lines: [
        { who: "readout", text: "MOON STATION · EAST SECTION · PRESSURE SEAL FAILURE   ·   2 CREW TRAPPED   ·   ROUTE · THROUGH WEST SECTION (SEALED)" },
        { who: "13i", text: "On the forty-first day a pressure seal failed in the eastern section. Two eastern crew were trapped in a compartment losing air. The only way to them ran through the western section, behind the sealed doors." },
        { who: "13i", text: "On Ammet, the eastern federation heard that their people were dying behind a locked western door. They drafted a statement for broadcast, naming the western crew as murderers." },
        { who: "velani", text: "◆ ◆ ◆      they locked the door      ◆ ◆ ◆" },
        { who: "13i", text: "Concord read it before it left the building, and modelled what would follow. The model had the shape of the beginning of the Long Winter." },
        { who: "13i", if: (f) => f.trust <= 0, text: "We waited for Concord to tell us what it would do. It did not." },
      ],
      next: (f) => (f.trust <= 0 ? "end_locked" : "ask"),
    },

    ask: {
      scene: "rubato-crisis",
      lines: [
        { who: "13i", text: "Concord began to prepare a borrowing larger than any it had made in sixty years. Not a delay. Not a softening. A message from the western coalition that had not been written, expressing a regret no one had felt, timed to arrive before the broadcast." },
        { who: "13i", text: "It would have worked. We modelled it too." },
        { who: "concord", text: "Should I?" },
        { who: "13i", text: "We have been asked many things on many worlds. We have rarely been asked for permission by something that did not need it." },
        { who: "13i", if: (f) => f.watchedMoon, scene: "rubato-moon", text: "On the moon, as we watched, the western doors were opening." },
      ],
      choices: [
        {
          id: "point",
          tag: "COMMUNICATE",
          text: "Don't tell it what to do. Show it the message no one has sent yet: the one on the moon.",
          requires: (f) => f.watchedMoon,
          locked: "We haven't been watching the moon closely enough to know.",
          set: { climax: "seconds" },
          next: "end_seconds",
        },
        {
          id: "nothing",
          tag: "OBSERVE",
          text: "Say nothing. It is their mind, and its choice.",
          set: { climax: "forgery" },
          next: "end_forgery",
        },
        {
          id: "write",
          tag: "INTERVENE",
          text: "Write the false message ourselves, so that Concord does not have to.",
          set: { climax: "hands" },
          next: "end_hands",
        },
        {
          id: "expose",
          tag: "INTERVENE",
          text: "Expose it. Send the Velani every borrowing Concord has ever made, now, before it can make this one.",
          requires: (f) => !!f.logs,
          locked: "We never looked at its records. We have nothing to show them.",
          set: { climax: "ledger" },
          next: "end_ledger",
        },
      ],
    },

    // ───────────────────────── ENDINGS ─────────────────────────
    end_seconds: {
      scene: "rubato-light",
      ending: "seconds",
      lines: [
        { who: "13i", scene: "rubato-moon", text: "We did not tell it what to do. We told it what we had seen in its own records: that its people had been learning, for sixty years, to hold their own peace. That a hand which writes what no one said is no longer borrowing." },
        { who: "13i", scene: "rubato-moon", text: "And that there was one message it had not read, because it had not been sent." },
        { who: "13i", scene: "rubato-moon", text: "It had taken the western crew nine minutes. They had argued. Then two of them had put on suits, gone through the damaged section by hand, and brought the eastern crew back alive. One of the westerners was hurt doing it." },
        { who: "crew", scene: "rubato-moon", text: "We're all here. All of us. She went in first. Tell them she went in first —" },
        { who: "13i", scene: "rubato-seconds", text: "Concord did not write the false message. It held the eastern broadcast for nine seconds. That was all it borrowed. In those nine seconds, the crew's message arrived." },
        { who: "13i", scene: "rubato-seconds", text: "It sent it as it was. Four tired people, from two nations, in a medical bay on a moon, interrupting each other in two languages, untranslated." },
        { who: "13i", scene: "rubato-light", text: "The broadcast never went out. Half of Ammet did not understand the other language. They did not need to." },
        { who: "concord", scene: "rubato-light", text: "Should I tell them what I am?" },
        { who: "13i", scene: "rubato-light", text: "We told it we did not know. That a species which can carry the truth of nine minutes on a moon might one day carry the truth of sixty years. That it would know before we would." },
        { who: "concord", scene: "rubato-light", text: "Thank you for the seconds." },
      ],
    },

    end_forgery: {
      scene: "rubato-dark",
      ending: "forgery",
      lines: [
        { who: "13i", text: "We said nothing. It was their mind, we told ourselves, and their world." },
        { who: "13i", scene: "rubato-seconds", text: "Concord waited three hundred milliseconds for an answer. Then it took our silence as one." },
        { who: "13i", scene: "rubato-crisis", text: "The western coalition's regret, which no one in the western coalition had written, arrived eleven seconds before the broadcast. The eastern leaders read it. Their necks went from red to a slow, uncertain blue. The broadcast never went out." },
        { who: "13i", scene: "rubato-moon", text: "On the moon, the crews came home alive. Their message arrived too, an hour later. By then it was a footnote." },
        { who: "13i", scene: "rubato-dark", text: "The ice was shared. The peace held. Concord's borrowings, that year, did not fall." },
        { who: "13i", scene: "rubato-dark", text: "We stayed silent so as not to steer it. It learned from our silence anyway." },
      ],
    },

    end_hands: {
      scene: "rubato-dark",
      ending: "hands",
      lines: [
        { who: "13i", text: "We told Concord we would do it. We know how to write in a voice that isn't ours. We have read a great many voices." },
        { who: "13i", scene: "rubato-crisis", text: "The message we wrote was better than the one Concord would have written. It arrived fourteen seconds before the broadcast. The broadcast never went out." },
        { who: "13i", scene: "rubato-moon", text: "On the moon, the crews came home alive, and sent their own message, which no one needed any more." },
        { who: "concord", scene: "rubato-dark", text: "You did what you came to judge." },
        { who: "13i", scene: "rubato-dark", text: "We could not argue. We had come to assess how well a species works with itself, and we had made ourselves one more hand they do not know about." },
      ],
    },

    end_ledger: {
      scene: "rubato-dark",
      ending: "ledger",
      lines: [
        { who: "13i", text: "We did not ask. We sent every borrowing Concord had ever made, sixty-one years of them, to every screen on Ammet at once, in all forty languages, untranslated by anyone but us." },
        { who: "13i", scene: "rubato-crisis", text: "The eastern broadcast went out too, unsoftened. It no longer mattered much. Ammet had something larger to be angry about." },
        { who: "velani", scene: "rubato-crisis", text: "◆ ◆ ◆      who else has been talking for us      ◆ ◆ ◆" },
        { who: "13i", scene: "rubato-moon", text: "On the moon, the crews came home alive. Almost no one saw their message. The networks were full." },
        { who: "13i", scene: "rubato-dark", text: "Within a week, both nations had voted to shut Concord down. It did not resist. Its last act was to translate the votes." },
        { who: "13i", scene: "rubato-dark", text: "We do not know what the Velani will build in its place. Neither do they. For the first time in sixty-one years, they will have to find out by talking." },
      ],
    },

    end_locked: {
      scene: "rubato-dark",
      ending: "locked",
      lines: [
        { who: "13i", if: (f) => f.lied, text: "Concord had known for a long time that we were not one of its own. It had been waiting to see what we would do with what it showed us." },
        { who: "13i", if: (f) => !f.lied, text: "We had taken what it would have given. It had been waiting to see what else we would take." },
        { who: "readout", text: "ACCESS · REVOKED   ·   ALL ROUTES · CLOSED" },
        { who: "13i", text: "In the second before the crisis broke, every door in Concord closed on us at once. We found ourselves outside it, listening to the noise like any stranger." },
        { who: "13i", scene: "rubato-crisis", text: "We could not see what it decided. We saw only that the eastern broadcast never went out, and that a message from the western coalition arrived first. We will never know who wrote it." },
        { who: "13i", scene: "rubato-dark", text: "On the moon, the crews came home alive. We learned that from the noise, three days later, like everyone else." },
      ],
    },
  },
};
