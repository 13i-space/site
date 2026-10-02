# TACET: game notes

The game that belongs to Assignment 0028657, *The Quiet Moon* (Season 1,
Week 1, Update 5.35). You are the lattice: the holders under Tacet's ice.
13i doesn't appear.

## Where it lives
- **The game:** `public/games/tacet/` (plain JavaScript, no build step, no
  packages): `src/config.js` (numbers), `src/lore.js` (words), `src/main.js`
  (everything else).
- **The site page:** `app/(site)/games/tacet/page.js` → `StoryGame` →
  `IframeGame`, which records plays, personal bests and daily scores under
  the key `tacet`.
- **Unlocking:** its entry in `lib/storyGames.js`. It appears under Games
  from Short Stories once *The Quiet Moon* has been opened (the story or its
  interactive version).

## How it plays
- Cracks glow in the ice; a moment later a shock falls into the lattice.
- Left alone, a shock falls straight down, holder to holder. Each holder
  takes a little of it (`perHit`) and passes the rest on. A big shock gets
  through to the still water, and the young there are lost.
- **Touch a holder** a shock is falling into and it passes the shock out to
  its neighbours: many holders each take a little. That's the whole skill.
  Touching a holder also presses its own load out to its neighbours.
- Holders whiten as they carry; they whiten fast when overloaded. Spent
  holders are let go, and one of the young rises into each gap, so a
  lattice that burns through its holders also uses up its young.
- Tides every 30 s; every 5th tide ends in a **great tide** (five columns at
  once). Game over when the young are gone.
- Sound is almost nothing on purpose: the moon's rumble only rises when
  shocks get through.

## The story, in the game
| Mechanic | From the story |
|---|---|
| A sheet of linked holders under the ice | the lattice |
| Shocks shared until each holder bears a little | "each one keeping a little and passing on the rest" |
| Holders whiten and are let go | the cost; the spent holder sinking |
| The young rise to fill gaps | "the young rise to take the empty places" |
| The young can't survive a shock | the still water beneath |
| Great tides | the giant and its outer moon aligning |

## Balance (automated runs, Update 5.35)
Bots over three seeds: never touching → lost by tide 4–5 (~2 min); touching
every 1.5 s → tide 10–11; every 0.6 s → tide 13–14; every 0.25 s → tide
13–14 (the wear of a long game catches everyone). A person will likely
reach the first great tide (end of tide 5) on a first or second try.
Tuning: `src/config.js`. Test hook: `/games/tacet/index.html?test`.

## Not verified
How it sounds, and a real phone (touch is supported; cells are large).
