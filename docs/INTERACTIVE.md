# Interactive Assignments: notes

Short stories told so the reader chooses, in the style of a visual novel. You
are 13i. Each choice is one of the Assignment Protocol's options (OBSERVE,
COMMUNICATE, ANALYZE, INTERVENE). One ending is the story as written (the
**canon record**); the rest are **divergent records**. That fits the
Archive: "the archive is where the universe discovers itself."

The first one is **Assignment 0215783, *Nerath's Secret*** (Update 5.34). The second is **Assignment 0028657, *The Quiet Moon*** (Update 5.35, Season 1 Week 1). The third is **Assignment 0000087, *The Deep Walkers*** (Update 5.38).

## Where it lives
| Piece | File |
|---|---|
| The stories (every word, choice and ending) | `lib/interactive/nerathsSecret.js`, `lib/interactive/quietMoon.js`, `lib/interactive/deepWalkers.js` |
| List of interactive stories | `lib/interactive/index.js` |
| The player (text, choices, saving, endings screen) | `components/InteractivePlayer.js` |
| The living backdrop (all drawn in code) | `components/InteractiveScene.js` (host + Nerath scenes); `components/interactiveScenes/tacet.js` (Quiet Moon), `components/interactiveScenes/veyra.js` (Deep Walkers) |
| The ambient drone + choice chime (synthesized) | `lib/interactive/ambience.js` |
| Saving + Kin stats | `lib/interactive/progress.js` |
| Database (one table, one function) | `docs/v5.34-interactive-assignments.sql` |
| Styles | `app/globals.css` → "Interactive Assignments" block (`.ia-*`) |

## Where it appears on the site
- **Its own page:** `/assignments/215783/interactive`
- **The index:** `/assignments/interactive` (Play → *Interactive Stories* in the nav)
- **Play landing page:** an *Interactive Assignments* card
- **Assignments hub:** an *Interactive Assignments* strip above the two story columns
- **The story itself:** an **INTERACTIVE VERSION** box beside *Audio*
- **Lyra:** a tip on both pages. **Site search:** both pages.
- Playing it counts as opening the story, so it unlocks **SIXTEEN** like reading does.

## Nerath's Secret: the branch map
Flags 13i collects on the way down decide what it is *able* to do at the end.
A choice that needs something 13i hasn't learned is still shown, dimmed, with
the reason. It isn't hidden, so the reader learns the story has other paths.

```
ORBIT ─ how do we go down?
   OBSERVE  descend in silence ................................ (nothing)
   COMMUNICATE  echo the pattern back ......................... noticed
   ANALYZE  probe the network ................................. netKnow
      │
DESCENT → THE CREATURE ─ where do we look?
   scan the body ......... (13i misreads it: "a pilot")
   scan the limbs ........ sawMinds   (limb 7 finds the second crack)
   follow the conduit .... netKnow    (the deep trench valve)
      │
THE LIVING CITY ─ a juvenile's limb reaches for us
   COMMUNICATE  let it touch us ....... linked + sawMinds + noticed
   OBSERVE  withdraw .................. (nothing)
   ANALYZE  scan it as it comes ....... sawMinds
      │
THE RUPTURE ─ network failing, 13i could reach the breach
   INTERVENE  seal it ourselves ──────────► SEAL
   OBSERVE  wait ─────────────────────────► THE ELDER
   COMMUNICATE  project our map ──────────► THE ELDER    (needs netKnow)

SEAL ─ (if linked, the elder's three limbs touch our hull: "not there · DOWN")
   OBSERVE  listen, pull back ────────────► THE ELDER    (needs linked)
   INTERVENE  keep sealing ─┬─ netKnow ───► ✦ THE BORROWED REPAIR
                            └─ otherwise ─► ✦ THE DARK TIDE

THE ELDER ─ it moves to hold the breach with its body; limbs 3, 7, 12 touch it
   OBSERVE  do nothing ───────────────────► ✦ SEVENTEEN MINDS (canon)
   COMMUNICATE  speak to the three limbs ─► ✦ THE EIGHTEENTH MIND (needs linked)
   INTERVENE  brace the elder ────────────► ✦ ONE VOICE
```
There are 152 distinct paths; every node and all five endings are reachable
(checked by walking every combination).

### The five records
| # | Record | How | What 13i learns |
|---|---|---|---|
| 1 | **Seventeen Minds** (canon) | let the elder decide | internal disagreement as strength (the original debrief) |
| 2 | **The Eighteenth Mind** | linked, then amplify the dissenting limbs | you can take part in another mind's disagreement without ending it |
| 3 | **One Voice** | brace the elder | a mind that silences its dissent acts alone, and was wrong |
| 4 | **The Borrowed Repair** | seal it yourself, knowing the network | help that arrives unasked can take away what it meant to protect |
| 5 | **The Dark Tide** | seal it yourself, not knowing | certainty is not understanding (echoes *The First Silence*) |

### What changed from the written story (deliberately)
- The story is retold, not copied: same events, same voice ("we"), tightened.
- **New, needed for the choices:** *why* the elder's plan fails. Holding the
  breach shut traps pressure building in a trench below. The fix is to open a
  deep valve first. The three limbs' dissent is about that, so "listen" has
  a concrete meaning.
- **New:** a juvenile's curious limb touches 13i (the since-retired comic showed a
  "biological interface" moment; this makes it a choice).
- The limbs that touch the elder are **03, 07 and 12**, matching the since-retired comic's
  "Appendage 03 / 07 / 12 (disagreement)" panels.
- Species name: **Nerathi**, as in SIXTEEN (the story never names them).
- The canon ending still closes on the original line: *"They had not
  eliminated the conflict. They had learned from it."*

## Changing things
- **Words:** `lib/interactive/nerathsSecret.js`. Each line is
  `{ who, text }`; `if: (f) => ...` shows it only on some paths; `focus: [3, 7]`
  lights those limbs; `pose: "reach" | "touch"` moves them; `scene:` swaps
  the backdrop for that line.
- **Don't rename** an ending's id (`seventeen`, `eighteenth`, ...) or a
  `climax` value: saved records and stats use them.
- **A new Interactive Assignment:** copy the shape of `nerathsSecret.js`,
  add it to `lib/interactive/index.js`. It appears everywhere listed above
  automatically. If it needs new scenery, add a scene to
  `components/InteractiveScene.js`; the speakers list is at the top of
  `components/InteractivePlayer.js`.

## Saving and the Kin numbers
- **Signed out:** resume point and endings found are kept in this browser.
- **Signed in:** each ending reached is also saved to `interactive_runs`, so
  records follow you across devices. The ending screen then shows what the
  Kin chose **on their first time through** (counts only, never who), e.g.
  "At the elder's moment: 58% did nothing · 30% spoke to the three limbs ·
  12% braced the elder".
- If the SQL hasn't been run yet, everything still works; the Kin numbers
  just don't appear.

## Controls
Click / Space / Enter / → to continue (first press finishes the line), 1–3 to
choose, **L** for the record so far, Fullscreen and Sound toggles top-right.
`prefers-reduced-motion` turns the typewriter off and slows the backdrop.

## The Quiet Moon: the branch map
You are 13i on Tacet. The canon record is **Carried**.
```
ORBIT ─ how do we study the silence?
   OBSERVE  watch from orbit .............. patient (sees a quake vanish)
   INTERVENE  dive straight in ............ (nothing)
   ANALYZE  drop a seismic probe .......... probe (it absorbs everything)
      │
UNDER THE ICE → THE SILENCE → THE LATTICE ─ how far does it reach?
   ANALYZE  sound pulse ................... pinged (they come fast)
   OBSERVE  map by gravity ................ (they come slowly)
   COMMUNICATE  press its pattern back .... touch 2 (fluent)
      │
CONTACT ─ forty holders fold down around us
   INTERVENE  raise our field ───► REPELLED (afraid: a gap in the roof)
   OBSERVE  hold still ──────────► WRAPPED (touch ≥ 1)
   COMMUNICATE  press back ──────► WRAPPED (touch 2)
      │
UNDERSTANDING (food · the quake · the young) ─
   ANALYZE  go down among the young ...... youngHarm
   OBSERVE  study them from above
      │
THE COST → THE GREAT TIDE IS COMING ─
   OBSERVE  leave ─────────┬─ afraid ─► ✦ THE TORN ROOF
                           └─ else ───► ✦ THE LONG WAY OUT
   INTERVENE  hold the ice ourselves ──► ✦ TOO LOUD TO HOLD
   COMMUNICATE  go quiet (needs !afraid) ─► WOVEN
WOVEN ─ touch 1 ─► ✦ CARRIED (canon)
        touch 2 ─► OBSERVE  let them choose ─► ✦ CARRIED
                   COMMUNICATE  ask for the hard edge ─► ✦ THE HARD EDGE
```
168 paths; every node and all five endings reachable.

### Engine additions (Update 5.35)
A script can now carry its own `speakers`, `moods` (scene → drone mood,
including a near-silent `silent`), `climaxLabel` / `climaxWords` for the
Kin stats line, and a choice's `set` can be a function of the current
flags. New scene sets plug into `components/InteractiveScene.js` through
its drawing kit (see `makeTacetScenes`).

## The Deep Walkers: the branch map
You are 13i on Veyra. The theme is patience: 13i is fast and used to
answers; the walkers are slow, think through stone, and decide together.
The canon record is **Where the Individual Ends**.
```
ORBIT ─ how do we look?
   ANALYZE  one active seismic pulse ........ sounded (everything stops for 2 days)
   OBSERVE  descend slowly
   INTERVENE  land on a stone tower ......... carried (it sinks; they felt our weight)
      │
SURFACE → THE FIRST WALKER → THE CIRCLE OF TWELVE ─
   COMMUNICATE  press our hull into the stone ── grounded (we start to feel it)
   OBSERVE  hover and watch
   INTERVENE  lift one to examine it ─────────── lifted (it can't feel the ground for days)
      │
MANY DAYS → THE RIDGE ─ they walk toward a ridge our instruments say will fall
   OBSERVE  trust them
   INTERVENE  shake the ground to warn them ──── feared
   COMMUNICATE  ask through the stone (needs grounded) ─ "known · wait"
      │
THE COLLAPSE ─ lifted and not warned ─► ✦ THE MISSING VOICE (4 lost: the one we
      │          lifted was the one who had felt the ridge move)
      │
THE ARCHIVE CALL ─ feared ─► they won't begin while we're there:
      │                 OBSERVE leave ─► ✦ WHAT WE DID NOT HEAR
      │                 ANALYZE scan it anyway ─► ✦ THE COPY
      └─ otherwise ─► THE ARCHIVE (the ancestors in the stone):
                        OBSERVE  only listen ─► ✦ WHERE THE INDIVIDUAL ENDS (canon)
                        ANALYZE  copy it ─► ✦ THE COPY (the oldest layers go silent)
                        COMMUNICATE  add our record (needs grounded) ─► ✦ A VOICE IN THE STONE
```
45 paths; every node and all five endings reachable.

### What changed from the written story (deliberately)
- The story's events and closing question are kept; the canon ending ends
  on "We did not know. That was sufficient."
- **New, for the choices:** why the walkers walk toward a failing ridge
  (the collapse opens a cavity full of the burrowing life they eat), what
  lifting one out of the ground does to it, and that a deep scan of the
  archive would erase its oldest, faintest layers.
- **Kept out on purpose:** the Warden from *The Deep Signal* game. Its
  nature is deliberately unknown (WORLD.md), so it doesn't appear here.
- The story's walkers are low, plated, six-limbed and eyeless; the scenes
  and the redrawn cover follow that (the first code-drawn cover gave them
  long legs, which the story doesn't).
