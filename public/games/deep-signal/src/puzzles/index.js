// PuzzleManager - opens the right puzzle for a terminal.

import { createAlignment } from "./alignment.js";
import { createRouting } from "./routing.js";
import { createFrequency } from "./frequency.js";
import { createSequence } from "./sequence.js";

export const PUZZLE_NAMES = {
  alignment: "SIGNAL ALIGNMENT",
  routing: "ENERGY ROUTING",
  frequency: "FREQUENCY MATCH",
  sequence: "SYMBOL SEQUENCE",
};

export function openPuzzle(kind, game, run, api) {
  const rng = run.world.rng;
  switch (kind) {
    case "alignment": return createAlignment(game, rng);
    case "routing": return createRouting(game, rng, { onOverload: () => { api.damage(8, true); api.addAwareness(6); api.msg("OVERLOAD."); } });
    case "frequency": return createFrequency(game, rng);
    case "sequence": return createSequence(game, run, { onWrong: () => { api.addAwareness(5); api.msg("THE SEQUENCE WAS NOTICED."); } });
    default: return null;
  }
}
