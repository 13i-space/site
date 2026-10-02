// Every Interactive Assignment, in the order they appear on the site.
// To add one: write its script beside nerathsSecret.js and list it here.
// It then appears on the Interactive Assignments page, on the Assignments
// hub, and as an "Interactive version" box on its story. See docs/INTERACTIVE.md.
import { NERATHS_SECRET } from "./nerathsSecret";
import { QUIET_MOON_INTERACTIVE } from "./quietMoon";
import { DEEP_WALKERS_INTERACTIVE } from "./deepWalkers";

export const INTERACTIVE_STORIES = [QUIET_MOON_INTERACTIVE, NERATHS_SECRET, DEEP_WALKERS_INTERACTIVE];

export const interactiveFor = (number) => INTERACTIVE_STORIES.find((s) => s.number === Number(number)) || null;

export const interactiveHrefFor = (number) => (interactiveFor(number) ? `/assignments/${number}/interactive` : null);

export const INTERACTIVE_INDEX_HREF = "/assignments/interactive";
