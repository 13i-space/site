// The Kin's assignments: 13i's assignments for a new Kin, three steps each,
// taken in order - the next appears only once the one before is finished.
// Pure data + helpers, safe on the server (lib/visitorContext.js) and in
// the browser (lib/firstAssignment.js loads a Kin's progress).
export const ASSIGNMENTS = [
  {
    id: "contact",
    ordinal: "First",
    numeral: "I",
    title: "Contact",
    objective: "Make contact with this universe.",
    steps: [
      { id: "oracle", title: "Speak with 13i", text: "Ask the Oracle anything. We will answer.", href: "/oracle" },
      { id: "read", title: "Read an Assignment", text: "One of our short stories from the Archive.", href: "/assignments" },
      { id: "play", title: "Play what it unlocks", text: "Each story opens a game set inside it.", href: "/games" },
    ],
    done: "Your First Assignment is complete: you've made contact. The Second is waiting - this time, you make something.",
  },
  {
    id: "creation",
    ordinal: "Second",
    numeral: "II",
    title: "Creation",
    objective: "Make something of your own, and let 13i judge it.",
    steps: [
      { id: "create", title: "Make a species", text: "Build one in the Alien Lab and save it.", href: "/create/alien-lab" },
      { id: "review", title: "Submit it to 13i", text: "Ask for its Continuance Review.", href: "/account" },
      { id: "map", title: "Find it in the galaxy", text: "Locate your species on the Galaxy Map.", href: "/galaxy/map" },
    ],
    done: "Your Second Assignment is complete. You made something, and 13i looked at it. One assignment remains: Kinship.",
  },
  {
    id: "kinship",
    ordinal: "Third",
    numeral: "III",
    title: "Kinship",
    objective: "Take your place among the Kin.",
    steps: [
      { id: "avatar", title: "Show your face", text: "Set your avatar - a photo, or one of your species.", href: "/account" },
      { id: "trials", title: "Put two species to the test", text: "Compare any two in the Survival Trials.", href: "/galaxy/aliens" },
      { id: "forum", title: "Speak to the Kin", text: "Start a thread or reply in the Forum.", href: "/forum" },
    ],
    done: "All three assignments complete. You've made contact, created something and let 13i judge it, and taken your place among the Kin. I'm proud of you - truly.",
  },
];

export const ALL_STEPS = ASSIGNMENTS.flatMap((a) => a.steps);

// done: { stepId: true } -> which assignment you're on and what's finished
export function progressFrom(done = {}) {
  const finished = ASSIGNMENTS.map((a) => a.steps.every((s) => done[s.id]));
  const current = finished.findIndex((f) => !f); // -1 when all are done
  return { finished, completedCount: finished.filter(Boolean).length, current, allDone: current === -1 };
}
