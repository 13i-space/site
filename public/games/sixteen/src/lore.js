// Words for SIXTEEN. Canon notes (Assignment 0215783, "Nerath's Secret"):
// a liquid world; cities grown on the deep ocean floor; an energy network
// that also steers the currents; each individual has one central mind and
// sixteen appendage minds that can disagree - and are often right; the
// young learn, over years, to coordinate their own limbs. "Nerathi" is the
// game's name for the species (the story never names them). 13i does not
// appear here - this is their story, told from inside.

export const ARM_NAMES = [
  "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
];

export const PERSONALITY_NOTES = {
  steady: "does as asked",
  curious: "wanders toward anything strange",
  stubborn: "argues more - and is right more than you'd like",
  gentle: "trusts quickly",
  restless: "acts on its own sooner",
  patient: "slow, but never sulks",
};

export const INTRO = [
  "You are Nerathi.",
  "One mind at the center. Sixteen in your limbs.",
  "Some of them are still learning to listen to you.",
  "You are still learning to listen to them.",
  "The district's energy network is failing. Keep the city lit.",
];

export const TIDE_OPENERS = [
  "The currents turn. The network hums.",
  "Pressure rises in the old conduits.",
  "The towers call for light.",
  "Somewhere beneath you, something grinds.",
  "The city is awake, and so are your limbs.",
];

export const DISSENT_LINES = [
  (a, where) => `${a}: not there. ${where}.`,
  (a, where) => `${a} pulls toward ${where}.`,
  (a, where) => `${a} disagrees. It feels ${where}.`,
  (a, where) => `${a}: wrong place. ${where}.`,
];

export const DISSENT_RIGHT = [
  (a) => `${a} was right.`,
  (a) => `${a} felt it first.`,
  (a) => `Listening paid. ${a} knew.`,
];

export const DISSENT_WRONG = [
  (a) => `Nothing there. ${a} is quiet a while.`,
  (a) => `${a} was wrong this time.`,
];

export const IGNORED_RIGHT = [
  (a) => `It burst where ${a} said it would.`,
  (a) => `${a} remembers you didn't listen.`,
];

export const AUTONOMY_LINES = [
  (a) => `${a} went on its own.`,
  (a) => `${a} decided there was another problem.`,
  (a) => `${a} didn't wait to be asked.`,
];

export const SENSE_LINES = [
  (a) => `${a} feels something wrong beneath a tower.`,
  (a) => `${a} tastes a change in the water.`,
  (a) => `${a} senses a weakness no one else can see.`,
];

export const LEVEL_LINES = [
  (a, s) => `${a} grows surer: ${s}.`,
  (a, s) => `${a} has learned. ${s} improves.`,
];

export const MATURE_LINES = [
  (a) => `${a} wakes. A new mind answers.`,
  (a) => `${a} matures - one more voice inside you.`,
];

export const RUPTURE = {
  open: "THE GREAT RUPTURE. The oldest conduit has split beneath you.",
  need: "It will take six limbs at once - and anchors against the flood.",
  dissent: "Three limbs press against you: the plan will fail.",
  listened: "You change the plan. The repair holds.",
  failed: "The repair failed - as they said it would.",
  done: "The network lives. Light returns to the towers.",
};

export const DARK_LINES = [
  "The district goes dark.",
  "The towers fall silent, one by one.",
];
