// All game text lives here. Canon notes:
// - The Deep Walkers are from Assignment 0000087: no eyes or ears,
//   pressure-sensing limbs, a world that is their nervous system and their
//   archive, ancestral remains that carry vibration-encoded memory.
// - The Warden is a working name from the game spec. It is alien, old, and
//   deliberately undefined - nothing here says what it is.
// - NEMESIS (a human military AI) has no place on this world and is never
//   mentioned.

export const CATEGORIES = ["TRANSMISSIONS", "ARTIFACTS", "LOCATIONS", "ENTITIES", "ANOMALIES", "WARDEN", "DEEP WALKERS"];

// Signal fragments - one per relay. The order a run finds them in is random.
export const FRAGMENTS = [
  "ORIGIN IS NOT A LOCATION.",
  "THE SIGNAL REMEMBERS.",
  "THE WALKERS WERE NOT THE FIRST.",
  "SOMETHING REMAINS.",
  "IT WAS BUILT TO WATCH.",
  "IT WAS BUILT TO WAIT.",
  "WE THOUGHT IT WAS ASLEEP.",
  "IT WAS NEVER ASLEEP.",
  "THE GROUND KEEPS WHAT THE SKY FORGETS.",
  "EVERY STEP HERE IS READ.",
  "WE CAME TO LISTEN. WE WERE HEARD.",
  "THE ARCHIVE IS STILL WRITING.",
  "DO NOT ANSWER THE SECOND VOICE.",
  "A SILENCE IS ALSO A MESSAGE.",
  "COUNT THE RINGS. THEN COUNT AGAIN.",
  "IT DOES NOT KNOW WHAT YOU ARE. NEITHER DO WE.",
  "THE PATH WAS DRAWN BEFORE YOU WALKED IT.",
  "WHAT IS WATCHED CHANGES.",
  "PRESSURE. MEMORY. PRESSURE.",
  "WE LEFT THE DOOR OPEN FOR A REASON.",
  "THIS TRANSMISSION SHOULD NOT STILL EXIST.",
  "WE HAVE BEEN HERE BEFORE. WE WILL BE HERE AFTER.",
];

// The line the fragments resolve into during the final sequence.
export const COHERENT_SIGNAL = "WE HEARD YOU BEFORE YOU LISTENED.";

// Discovery Log. `id` is permanent (saved to localStorage) - don't rename.
export const LORE = [
  // LOCATIONS - first time entering each kind of region
  { id: "loc-landing", cat: "LOCATIONS", title: "Landing Site", text: "Flat ground, recently disturbed. Something moved the soil after the craft set down, then smoothed it again." },
  { id: "loc-ruins", cat: "LOCATIONS", title: "Alien Ruins", text: "Geometry without ornament. Every wall is load-bearing; every angle has a purpose not yet understood. No doors are hinged. They were never meant to be pushed." },
  { id: "loc-relay", cat: "LOCATIONS", title: "Transmission Relay", text: "Towers that do not point at the sky. Their emitters face down, into the planet." },
  { id: "loc-caverns", cat: "LOCATIONS", title: "Caverns", text: "Light carries poorly here. The walls are smooth to a height of three meters, then rough above it, as if worn by something tall that passed often." },
  { id: "loc-field", cat: "LOCATIONS", title: "Energy Field", text: "Ground that stores charge and releases it on a rhythm. The rhythm is regular enough to walk between, irregular enough to remember." },
  { id: "loc-walker", cat: "LOCATIONS", title: "Deep Walker Site", text: "A place the Walkers return to. The ground here is dense with vibration: old, layered, still arriving." },
  { id: "loc-anomaly", cat: "LOCATIONS", title: "Anomaly", text: "Instruments disagree with each other here. Two of them are right." },
  { id: "loc-warden", cat: "LOCATIONS", title: "Warden Zone", text: "The structures here are newer than the ruins around them. Or better kept. It is difficult to tell the difference on this world." },
  { id: "loc-gate", cat: "LOCATIONS", title: "Resonance Gate", text: "A ring set into the floor, cut from one piece of stone. It responds to the signal, not to touch." },
  { id: "loc-node", cat: "LOCATIONS", title: "The 13i Node", text: "There is no path to this place. There is only the signal, strong enough to follow." },
  { id: "loc-veyra", cat: "LOCATIONS", title: "Surface Designation", text: "Orbital records match this world to one already in the archive: VEYRA. The archive's entry is shorter than it should be." },

  // ARTIFACTS - scanned or extracted
  { id: "art-lattice", cat: "ARTIFACTS", title: "Resonant Lattice", text: "A mesh of fused mineral that hums when held still. The hum changes when you are afraid." },
  { id: "art-stylus", cat: "ARTIFACTS", title: "Pressure Stylus", text: "Too long for a hand. Tapered at both ends. Pressed into the ground, it makes the ground answer." },
  { id: "art-shell", cat: "ARTIFACTS", title: "Hollow Shell", text: "A casing with nothing inside, and wear on the inside surfaces only." },
  { id: "art-ring", cat: "ARTIFACTS", title: "Broken Ring", text: "One quarter of a circle, cut cleanly. The other three quarters are somewhere on this world, facing the same way." },
  { id: "art-tablet", cat: "ARTIFACTS", title: "Grooved Tablet", text: "No script. Only grooves of varying depth, read by weight rather than sight. The deepest groove is the newest." },
  { id: "art-seed", cat: "ARTIFACTS", title: "Dormant Core", text: "Warm. Not powered, not alive. Warm the way stone is warm after someone has been sitting on it." },
  { id: "art-lens", cat: "ARTIFACTS", title: "Gravity Lens", text: "A disc that bends light slightly toward its center. Whoever made it did not need light. They made it anyway." },
  { id: "art-mark", cat: "ARTIFACTS", title: "Stem-and-Ring Glyph", text: "A line, a circle, a point inside the circle. It appears on objects older than anything else in the ruins." },

  // DEEP WALKERS - markers and traces
  { id: "dw-marker1", cat: "DEEP WALKERS", title: "Standing Stone", text: "A marker set into the ground at an angle. Pressed against it, the craft's hull picks up a slow, patterned vibration: not machinery. Memory." },
  { id: "dw-marker2", cat: "DEEP WALKERS", title: "Ancestral Ground", text: "Remains beneath the surface, arranged with care. They still transmit. The Walkers do not bury their dead. They keep them talking." },
  { id: "dw-prints", cat: "DEEP WALKERS", title: "Tracks", text: "Three-point impressions, deep and evenly spaced. They lead into a room you have already searched. They were not there before." },
  { id: "dw-limbs", cat: "DEEP WALKERS", title: "Pressure Sense", text: "Worn channels in the floor, shaped for limbs that listen. No eyes were needed to build this place. No eyes were needed to find you." },
  { id: "dw-archive", cat: "DEEP WALKERS", title: "The Archive Below", text: "The vibration never fully stops. It passes from stone to stone, generation to generation. The planet is not their home. It is their memory." },
  { id: "dw-gift", cat: "DEEP WALKERS", title: "Left Behind", text: "A marker in a room you cleared minutes ago. Placed, not dropped. Facing the direction you left." },

  // ENTITIES
  { id: "ent-shape", cat: "ENTITIES", title: "At the Edge of the Light", text: "Tall. Still. Gone when the light reached it." },
  { id: "ent-walker", cat: "ENTITIES", title: "A Walker", text: "It crossed in full light, unhurried, limbs testing the ground before each step. It did not look at you. It had nothing to look with. It knew exactly where you were." },
  { id: "ent-construct", cat: "ENTITIES", title: "Construct", text: "Geometry that moves. It does not attack so much as insist. A pulse makes it reconsider." },
  { id: "ent-echo", cat: "ENTITIES", title: "Echo", text: "For a moment there were two of you on the scan. The other one was facing the other way." },

  // ANOMALIES
  { id: "an-well", cat: "ANOMALIES", title: "Gravity Well", text: "Something here pulls, gently and from no visible source. The pull has a direction. The direction slowly turns." },
  { id: "an-time", cat: "ANOMALIES", title: "Slow Ground", text: "The chronometer lost four seconds crossing this room. The craft did not." },
  { id: "an-13i", cat: "ANOMALIES", title: "13i Trace", text: "A signature in the rock that matches the transmission exactly. It is older than the rock." },
  { id: "an-map", cat: "ANOMALIES", title: "Distortion", text: "The map redrew itself. Then it put itself back." },
  { id: "an-double", cat: "ANOMALIES", title: "Double Reading", text: "Two signal strengths reported at once, both confident. One of them was not ours." },

  // WARDEN
  { id: "wd-lights", cat: "WARDEN", title: "Lights", text: "Structures that were dark are lit. Nothing turned them on. Something did." },
  { id: "wd-door", cat: "WARDEN", title: "A Door Closes", text: "A passage sealed behind you, then opened again when you stopped trying it. A lock, or a lesson." },
  { id: "wd-energy", cat: "WARDEN", title: "Redirected", text: "An energy source went dark as you approached it. The power did not vanish. It went somewhere else." },
  { id: "wd-scan", cat: "WARDEN", title: "Suppression", text: "The scan returned nothing. Not empty: nothing. Something was standing in front of the answer." },
  { id: "wd-false", cat: "WARDEN", title: "False Objective", text: "A strong signal source, exactly where you were going. It was not there when you arrived. Something wanted to know if you would come." },
  { id: "wd-terminal", cat: "WARDEN", title: "Warden Terminal", text: "The interface is patient. It asks nothing. It records everything. Its designation, as nearly as it can be rendered: WARDEN." },
  { id: "wd-watching", cat: "WARDEN", title: "Attention", text: "The world has started to arrange itself around you. Not against you. Around." },
  { id: "wd-listens", cat: "WARDEN", title: "The Warden Listens", text: "It is not asleep. It was never asleep. Whether it is guarding the planet from you, or you from the planet, it has not said." },
  { id: "wd-core", cat: "WARDEN", title: "Intercept", text: "It reached the signal before you did. What it did with it is not in any record you can read." },

  // TRANSMISSIONS - the fragments themselves are logged as found
  ...FRAGMENTS.map((text, i) => ({ id: `tx-${String(i + 1).padStart(2, "0")}`, cat: "TRANSMISSIONS", title: `Fragment ${String(i + 1).padStart(2, "0")}`, text })),
  { id: "tx-coherent", cat: "TRANSMISSIONS", title: "The Signal", text: COHERENT_SIGNAL },
];

export const LORE_BY_ID = Object.fromEntries(LORE.map((l) => [l.id, l]));

export const INTRO_LINES = [
  "AN UNKNOWN SIGNAL HAS BEEN DETECTED.",
  "ORIGIN: UNRESOLVED.",
  "IDENTIFIER: 13i",
  "DO YOU WISH TO RESPOND?",
];

export const ENDINGS = {
  signal: {
    name: "THE SIGNAL",
    lines: ["SIGNAL INCOMPLETE.", "THE TRANSMISSION CONTINUES WITHOUT YOU.", "THE CRAFT ASCENDS."],
  },
  connection: {
    name: "THE CONNECTION",
    lines: ["SIGNAL COMPLETE", "YOU DID NOT FIND 13i.", "13i FOUND YOU."],
  },
  warden: {
    name: "THE WARDEN",
    lines: ["YOU WERE NOT EXPECTED.", "YOU ARE NOT WHAT THIS WAS BUILT TO KEEP OUT.", "REMAIN."],
  },
  terminated: {
    name: "RUN TERMINATED",
    lines: ["INTEGRITY LOST.", "THE SIGNAL CONTINUES."],
  },
};

// Short ambient lines by Warden state, shown sparingly.
export const WARDEN_LINES = {
  OBSERVING: ["SOMETHING SHIFTED.", "THE SYSTEM IS AWAKE.", "A LIGHT, WHERE THERE WAS NONE."],
  INTERFERING: ["THE WORLD IS RESPONDING.", "PATHS ARE CHANGING.", "THE READINGS DISAGREE."],
  DEFENDING: ["THE WARDEN IS LISTENING.", "ACCESS IS BEING DECIDED.", "SOMETHING IS BETWEEN YOU AND THE SIGNAL."],
  CONFRONTING: ["IT KNOWS WHERE YOU ARE.", "IT HAS ALWAYS KNOWN.", "REMAIN STILL. OR DO NOT."],
};
