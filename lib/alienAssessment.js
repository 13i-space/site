// 13i's assessment of a species - the third side of an Alien Lab card
// (Update 5.55). Four readings worked out from the species' stats and
// answers, and a few lines in 13i's voice. When 13i has written a full
// Continuance Review (app/api/alien, action "review"), the card shows that
// instead of the preliminary lines. Never omniscient: the preliminary note
// always names something 13i can't know from a record alone.

import { keyFor } from "./alienTraits";
import { statsFor } from "./alienStats";

const clamp = (v) => Math.max(3, Math.min(97, Math.round(v)));
const short = (v) => String(v || "").split(/\s+[—–-]\s+/)[0].trim();

export function assessmentFor(species) {
  const answers = species?.answers || {};
  const a = (id) => String(answers[keyFor(id)] || "");
  const { stats } = statsFor(species || {});
  const s = (id) => Number(stats?.[id]) || 0;

  const social = a("social_structure"), value = a("core_value"), temper = a("temperament"), tech = a("tech_level");
  const coop = clamp(s("social") * 1.5 + (/collective/i.test(social) ? 22 : /hive/i.test(social) ? 28 : /family|kin/i.test(social) ? 12 : /solitary/i.test(social) ? -12 : 0) + (/Survival|Harmony/.test(value) ? 10 : /Freedom/.test(value) ? -6 : 0));
  const threat = clamp(s("strength") * 0.55 + s("durability") * 0.3 + (/Aggressive/.test(temper) ? 35 : /Curious/.test(temper) ? 8 : 0) + (/beyond/i.test(tech) ? 32 : /spacefaring/i.test(tech) ? 22 : /modern/i.test(tech) ? 10 : 0));
  const curiosity = clamp(s("problem_solving") * 0.9 + s("adaptability") * 0.6 + (/Curious/.test(temper) ? 28 : /Detached/.test(temper) ? -10 : /Cautious/.test(temper) ? 5 : 0) + (/Knowledge/.test(value) ? 15 : 0));
  const resilience = clamp(s("endurance") * 0.5 + s("durability") * 0.45 + s("longevity") * 0.9 + s("adaptability") * 0.3);

  const readings = [
    { id: "coop", label: "Cooperation", value: coop, color: "#6FC3A8", note: "how it works with itself" },
    { id: "threat", label: "Threat", value: threat, color: "#C97B6E", note: "to others, not to itself" },
    { id: "curiosity", label: "Curiosity", value: curiosity, color: "#8B95F6", note: "how it meets the unknown" },
    { id: "resilience", label: "Resilience", value: resilience, color: "#E9D29A", note: "what it can outlast" },
  ];

  // the preliminary note, in our voice
  const size = short(a("size")).toLowerCase() || "unmeasured";
  const terrain = short(a("terrain")).toLowerCase();
  const where = terrain ? (terrain.startsWith("ocean") ? "a world of ocean" : terrain.startsWith("underground") ? "the caverns of its world" : `a world of ${terrain}`) : "a world we have not seen";
  const coopLine = coop >= 65
    ? "What it does together tells us more than anything it does alone, and what it does together is considerable."
    : coop >= 40
      ? "It cooperates when it must. We would want to see what it does when it doesn't have to."
      : "We see little in this record of how it works with its own kind. Under the Continuance Rule, that is where we look first.";
  const threatLine = threat >= 65 ? "It could do harm, if it chose to." : threat <= 25 ? "It is unlikely to harm anything that leaves it alone." : "";
  const unknown = /Aggressive/.test(temper)
    ? "We cannot yet know whether its hostility is fear, and fear can change."
    : /Detached/.test(temper)
      ? "We cannot yet know what, if anything, would make it care."
      : /hive/i.test(social)
        ? "We cannot yet know whether a mind with no individuals can disagree with itself."
        : "We cannot know from a record what it would do on the day its world changes.";
  const text = `A ${size} species of ${where}. ${coopLine} ${threatLine} ${unknown}`.replace(/\s+/g, " ").trim();

  const review = species?.review && typeof species.review.text === "string" ? species.review : null;
  return { readings, text, review };
}
