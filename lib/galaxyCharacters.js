// Characters on the Galaxy Map (Update 5.59): who lives where. Each one
// flies the map to its world (an id in lib/galaxyWorlds.js). Story
// characters only appear once their world is charted (its Assignment read);
// the book's people are on Earth, so they're always there.
export const CHARACTERS = [
  { id: "aiden", name: "Aiden Cole", world: "earth", from: "the book", text: "A programmer in Austin who built the systems that keep Lyra safe, and the first to notice what's watching back." },
  { id: "xavier", name: "Xavier", world: "earth", from: "the book", text: "The institution's side of first contact: the one with the power to answer." },
  { id: "lyra", name: "Lyra", world: "earth", from: "the book", text: "NovaCore's AI assistant, the most-used app in history. An ordinary assistant, at first." },
  { id: "13i", name: "13i", world: "first-silence", from: "Assignment 0000001", text: "An ancient collective intelligence. It always says “we”. Its home is Novaux-4, beside a ringed twin that has been silent since its first Assignment." },
  { id: "deep-walkers", name: "The Deep Walkers", world: "veyra", from: "The Deep Walkers", text: "A people whose world is both their nervous system and their archive." },
  { id: "nerathi", name: "The Nerathi", world: "nerath", from: "Nerath's Secret", text: "One mind at the center, sixteen in the limbs, and the limbs can overrule it." },
  { id: "holders", name: "The holders", world: "tacet", from: "The Quiet Moon", text: "Thousands of them under the ice of a loud moon, taking every shock so the young below can sleep in still water." },
  { id: "returners", name: "The returners", world: "dacapo", from: "The Sea of Glass", text: "Glass people who shed their memories at every return of the white star, and keep only one ring: a kindness." },
  { id: "velani", name: "The Velani", world: "ammet", from: "The Borrowed Seconds", text: "Nine billion people in eleven nations, who have reached their moon and believe they keep their own peace." },
  { id: "concord", name: "Concord", world: "ammet", from: "The Borrowed Seconds", text: "The mind the Velani built to translate every message on their world. It borrows a few seconds now and then." },
];
