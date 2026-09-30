# 13i: The Deep Signal — game notes

The exploration game that belongs to Assignment 0000087, *The Deep Walkers*.
Built from the "Master Game Development Specification, Version 2 —
Canon-Corrected" (Update 5.1).

## Where it lives
- **The game itself:** `public/games/deep-signal/`: a standalone page
  (`index.html`, `style.css`) plus plain JavaScript modules in `src/`. No
  build step, no packages, no server, no API. The browser loads it exactly
  as it sits in the folder.
- **The site page:** `app/(site)/games/deep-signal/page.js` →
  `components/DeepSignalGame.js`, which shows it in an iframe and records
  plays, personal bests and daily scores (game key `deep-signal`) exactly
  like the other games.
- **Unlocking:** `lib/storyGames.js`. The game's card appears on `/games`
  (via `components/StoryGameCards.js`) once the visitor has opened *The Deep
  Walkers*: signed in (from `reading_progress`) or signed out (remembered
  in the browser by `TrackStoryRead`). The next AI story's game is one new
  entry in `STORY_GAMES`.

## Deploying
Nothing special. It ships with the site: commit and push as usual, and Vercel
serves `public/games/deep-signal/` as static files. To host it anywhere
else, copy that folder to any web host; it runs on its own (scores just
aren't recorded outside 13i.space).

## Why plain canvas, not Phaser
The spec asked for Phaser 4 "if practical." It wasn't here. Adding a
package needs Node/npm, which this machine doesn't have. Loading Phaser from
a CDN would make the game depend on an outside service (against the
"no new third-party services" rule). So it is written against the browser's
own 2D canvas, split into the modules the spec suggested (world generator,
Warden AI, puzzles, audio, UI, save, debug). No WebGL means no WebGL
fallback is needed.

## How a run works (short version)
- Rooms are generated from a seed, and **always laid out along the 13i
  ring-eye mark**: the landing site at the tip of the stem, a closed ring of
  rooms, and the 13i Node as the dot in the middle, reached only through the
  Resonance Gate once Signal ≥ 50%. Random side rooms hide the shape until
  the final sequence pulls the camera back and lights it up.
- **Signal** comes from relays, puzzles, artifacts, markers and traces.
  **Awareness** comes mostly from CONNECT and EXTRACT, slowly from time
  spent in Warden zones, and settles slowly otherwise.
- **Endings:** reach the Node at 85%+ Signal = THE CONNECTION; below that =
  THE SIGNAL; Awareness hitting 100 anywhere = THE WARDEN; Integrity 0 =
  RUN TERMINATED.
- **Score** = Signal × 50 + discoveries × 100 + remaining Integrity × 10 +
  an ending bonus (see `SCORE` in `src/config.js`).

## Changing things
- **All words** (fragments, Discovery Log, ending lines, Warden lines):
  `src/lore/lore.js`. Don't rename an entry's `id`; players' saved
  discoveries use it.
- **All tuning numbers** (speeds, costs, thresholds, score): `src/config.js`.
- **Real 13i symbol artwork:** put the image in
  `public/games/deep-signal/assets/` and set `SYMBOL_ASSET` in
  `src/config.js`. Until then the mark is drawn from the site icon's own
  geometry.

## Hidden tools
- **Debug mode:** during a run, press the backquote key (`` ` ``, top-left
  of the keyboard) three times quickly. It can reveal the map, set every
  stat, trigger Warden events, solve puzzles, jump to the gate, and fire
  each ending. Nothing on screen tells players it exists.
- **Test hook:** opening `/games/deep-signal/index.html?test` exposes the
  game to the browser console. Used for automated checks only.

## What was tested (Update 5.1)
Tested in a local browser. Node isn't installed on this Mac, so the Next.js
site wrapper wasn't run.
- 500 generated worlds: every room reachable, every object on walkable
  floor, all four puzzles, the gate and the Node present in every one.
- Title, intro, movement, doors, scanning, hidden passages, dialogs,
  all four puzzles, Discovery Log, the Warden reaching every state and its
  events, constructs, all four endings including the full reveal, and the
  iframe → page score messages.
- About 10 minutes of simulated random play per seed with no errors.
- **Not verified:** how the sound actually sounds (no speakers in the test),
  a full human playthrough, touch controls on a real phone, and the site's
  `/games/deep-signal` page inside Next.
