# SIXTEEN — game notes

The game that belongs to Assignment 0215783, *Nerath's Secret* (Update 5.5).
You play one of the species from the story - named **Nerathi** here - not
13i, who doesn't appear at all.

## Where it lives
- **The game:** `public/games/sixteen/` (plain JavaScript modules, no build
  step, no packages), embedded by `app/(site)/games/sixteen/page.js` through
  `components/StoryGame.js` → `IframeGame`, which records plays, personal
  bests and daily scores under the key `sixteen`.
- **Unlocking:** it's an entry in `lib/storyGames.js`; it appears under
  Games from Short Stories once Nerath's Secret has been opened.

## The game, and where each piece comes from in the story
| Mechanic | From the story |
|---|---|
| You sit at the core of a district's energy network; conduits breach, towers overload, components burn out, some faults hide until they burst | "The planetary energy network began shutting down" |
| Click a fault and a limb goes on its own; keep many working at once | Four limbs anchor, three open the conduit, two remove parts, another fetches replacements |
| Burnt components need a part fetched from a chamber first | "another retrieved replacements from a nearby chamber" |
| Two- and three-limb controls | "most could be operated by several individuals simultaneously" |
| Currents: tap your body to anchor limbs before one hits | Controlled currents, and the rush through the rupture |
| Start with 8 limbs awake; wake more between tides | The young have fewer developed appendages and learn to coordinate |
| Each limb has a specialty (grip, sense, anchor, signal) and personality, and improves with use | Appendage minds develop different capabilities and personalities |
| A limb may disagree and point elsewhere - usually rightly. Listening builds trust; ignoring a right one hurts | "It had decided there was another problem"; the appendages that forced the old one to reconsider |
| Trusted limbs start fixing things unasked | The limb that stayed behind to repair something else |
| Every fifth tide, the Great Rupture: six limbs plus anchors; mid-repair three limbs touch your body and say the plan will fail. Listen, or the repair collapses | The climax, nearly beat for beat |

## Changing things
- **Numbers** (speeds, drains, tide length, dissent odds, scoring):
  `public/games/sixteen/src/config.js`.
- **Words** (intro, limb lines, rupture text): `src/lore.js`.
- **Upgrades between tides:** `src/upgrades.js`.
- **Test hook:** `/games/sixteen/index.html?test` exposes the game to the
  console (used for the balance runs below).

## Balance (automated runs, Update 5.5)
Bots acting every 0.4s reached tides 12–17; every 0.8s, 11–13; every 2s,
5–8. A bot that never listens swings between tide 4 and 15. Ignoring your
limbs is a gamble, which is the point. A person will likely land around
tide 4–9 at first, and the first Great Rupture (end of tide 5) is the
milestone.
