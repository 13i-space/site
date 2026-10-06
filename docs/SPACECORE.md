# SPACECORE.md — Build a Universe, Season 1: Mars

The shared, ever-expanding building game. It lives in **Create**, not Games,
because what you do here is build (Paul's call). Route: `/create/spacecore`.
Signed-in Kin only: it is one world every Kin builds together.

## Vision (Paul, Oct 2026)
- Fully cooperative. No houses or factions for now.
- Starts human: SpaceCore, Xavier's space company (he owns several, like
  Musk; SpaceCore is his SpaceX, focused on mining in space), sends the first
  crews (the players) to Mars.
- Seasons grow the universe. Season 1 = Mars (tested in Alpha/Beta for Q2 2027).
  Season 2 opens the solar system. Later seasons bring in alien species.
- Each season ends with a community Great Work that unlocks the next season (the Launch Facility for Mars).
- The character is created during the voyage. The first crew lands on nothing,
  and later crews land on what has been built.
- An underground "ant farm": you dig with a borer (digging is mining), carve rooms,
  pump in O2 and build inside. The surface belongs to the colony, where robots build the Great Works.
- 2D side view for Season 1.
- Attribute points are permanent once applied (1 per level), and training adds points over time.
- Lyra plays a bigger part here than anywhere else on the site: she's on the crew's comms.

## How it's built
- `public/games/spacecore/index.html` — the whole game (canvas, intro, Lyra
  comms, dashboard). It never touches Supabase. It talks to its host page with
  postMessage.
- `components/SpaceCoreGame.js` — the host. It handles sign-in/username
  checks and all database reads and writes, and computes site-activity boosts.
- `app/(site)/create/spacecore/page.js` — the route.
- `components/SpaceCoreNode.js` — the SPACECORE panel on the Node, plus a MARS vitals tile.
- `lib/spacecore.js` — shared numbers + `SPACECORE_GUIDE`, which `app/api/lyra`
  adds when Lyra is asked something from inside the game.
- `docs/v5.39-spacecore.sql` — tables and functions (run once in Supabase).

## Data
- `spacecore_players`: one row per Kin, holding `state` (everything the game
  needs to resume), `summary` (what the Node shows) and `px/py` (where their
  borer is parked, shown to others). Only you can read or write your row.
- `spacecore_tiles`: the shared world, stored as changes only. The rock is
  generated identically in every browser (seed 2027, 512×200 since 5.40). Rules (enforced
  in `spacecore_set_tiles`): anyone can dig rock, you can only build in tunnels
  you dug, and nobody can change another Kin's blocks.
- `spacecore_colony` (one row): current Great Work `stage`, what's been sent
  (`have`), and everyone's total mining (`mined`). Changed only through
  `spacecore_contribute` and `spacecore_sync`.
- `spacecore_log`: colony news.
- `spacecore_crews()`: names, levels, parked positions and (5.61) borer colors for everyone.

## Rules worth knowing
- Mars time runs 6× real time during Alpha (`TIME_SCALE` in the game,
  `SPACECORE_TIME_SCALE` in lib/spacecore.js). Auto-drills hold 12 Mars hours
  (+3 per Endurance point), so they fill in about 2 real hours.
- The Commons: each sync adds your mining to the colony total. You receive 10%
  of everyone else's mining since your last check-in.
- The scarcity bonus: the resource the current Great Work needs most pays +25%.
- Site boosts (computed in `SpaceCoreGame.js` from the last 24h): read a story
  +8%, create a species +10%, Universe Quiz score as % (7/10 = +7%), play
  another game +5%, forum post/reply +5%. Lyra's gifts and the daily colony
  call add more. All boosts together are capped at +50%. Writing an Assignment
  can't be a boost yet: submissions don't record who sent them.
- Great Work needs live in three places that must match: the game's `STAGES`,
  `lib/spacecore.js` and `spacecore_needs()` in the SQL.
- Lyra: nine tutorial missions (break ground → collect your haul) with
  rewards, then a daily colony call. She also handles scanner pings (Q), vein
  alerts, full drills, leaks, level-ups, crews arriving and colony news, plus
  "Ask Lyra" (the real `/api/lyra`, briefed with the game's rules and a
  snapshot of your game).
- Sentinel accounts get a "Skip ahead 8 Mars hours" button in the Dashboard for testing.

## v2 (Update 5.40), from Paul's first playtest
- **World:** 512 × 200 (was 128 × 96), seed 2027. It has natural caverns, lava tubes, ice
  fields in the west and a metal ridge in the east. Unexplored caves stay hidden
  until seen. Nobody owns natural caves until someone builds there. The surface
  is faster to drive on. A minimap shows what you've explored plus everyone's
  tunnels (M resizes it). Moving to the new world cleared the old tiles
  (docs/v5.40-spacecore-v2.sql). Returning crews keep their level, skills,
  resources and missions, get a relocation kit, and Lyra explains the move.
- **Arrival:** after the voyage training, the ship finishes the trip. It
  approaches Mars, makes one orbit over Landing Site Alpha, then goes through
  entry and descent before the landing.
- **Borer:** it runs on a battery (100 kWh, +15 per Endurance point). Drilling drains it,
  more so deep down. It charges at a powered Charger (fast, and full while
  away if parked there), at the lander (steady) or on the surface by sun (slow).
  Empty, it crawls but can't drill. Gauges show battery, drill rpm, drill
  temperature (overheat at 100°C halves drill speed until it drops below 70°C),
  outside temperature and depth. Drilling gets slower deeper down (+1.2% per
  block of depth), the drill sound strains lower and louder, and deep rock
  pays slightly more.
- **Blocks:** Hull wall is replaced by Mars materials: Sintered brick, Basalt,
  Hematite, Iron plate, Olivine, Gypsum, Ice block, Glass (now clear),
  Tinted glass and Alloy panel, plus the Airlock. Backfill packs rock back into
  your own tunnel. Packed rock gives nothing when dug again.
- **Equipment is crafted** in the Fabricator (Dashboard): a queue of 4 that
  runs on Mars time, offline too, and gets faster with Fabrication. Items go to
  your kit, then Build › Equipment. The items are Lamp, O₂ pump, Heater, CO₂
  scrubber, Greenhouse, Radiation sensor, Auto-drill, Charger (needs a Reactor
  within 10 blocks) and Reactor.
- **Rooms:** O₂ pump + Heater + CO₂ scrubber makes a room habitable.
  Greenhouses there grow food twice as fast, and training runs 50% faster
  while you're parked inside. A sensor in a sealed room deeper than 24 m reads
  "radiation low."
- **Missions:** five more (Keep warm, Clean air, Power up, Recharge, Read the
  rock), for 14 in total.
- Tile codes: 1 tunnel, 7 backfill, 10 iron plate, 11 glass, 12 airlock, 13 O₂,
  14 greenhouse, 15 lamp, 16 auto-drill, 20–27 materials, 30–34 heater,
  scrubber, sensor, reactor, charger.

## Saving (Update 5.42)
- The site refuses to start the game unless `spacecore_version()` is at least
  `SCHEMA_VERSION` in components/SpaceCoreGame.js. Bump both whenever the
  database rules change.
- The host confirms every save (`saved`) and tile batch (`tilesSaved`). The
  game shows "Saved Ns ago" or "Not saving: ..." in the status bar, and
  re-queues tiles that failed.
- The game saves state every 10s and tiles every 2s, and again when the tab is hidden.
- Dashboard › Voyage: "Replay launch and landing" for everyone (progress
  untouched). "Start this crew over" is Sentinel-only.

## Update 5.52
- **Launch** (~22s, skippable): T−10 countdown, then pad and tower, ignition
  smoke, liftoff, Max Q, stage separation at 15s, Earth orbit, and the
  trans-Mars injection burn.
- **Arrival** (~15s, skippable): a curved approach that joins the orbit at its
  left edge, two full orbits (drawn behind Mars on the far side), a deorbit
  zoom onto Landing Site Alpha, and entry.
- **Lyra:** "Got it" closes her (or shows "Next (n)" if more are queued), and ×
  clears the queue. `#lyra.right` puts her on the opposite side from the
  build cursor or the drill direction.
- **Fabricator:** queued items can be cancelled for a full refund.
- **Airlock:** it's Equipment now. The `isKit()` check (in EQUIPS) decides "crafted,
  placed from the kit". `isEquip()` is still tile-level (interior and
  passable for pressure), and the Airlock tile stays a seal.
- **Move tool (V):** picks equipment up into the kit and selects it to place again.

## Update 5.61: the survival update
From a three-hour playtest by one of Paul's sons, plus Paul's asks. SQL:
docs/v5.61-spacecore-survival.sql (schema version 561).
- **New tiles** (allowed by `spacecore_set_tiles`, 30-42): SOLAR 35, GEOTH 36,
  BATT 37, WIRE 38, GALLEY 39, BUNK 40, LOCKH 41 (floor-hatch airlock), LAMPF
  42 (standing lamp). `ROTATE`/`BASE_T` map the turned tiles back to their
  item; `isLock()` covers both airlocks (a seal, passable). Wire is a Block
  (bought from resources) but tile-level it's equipment (passable, interior).
- **Build limit**: 1500 built tiles (t >= 10) per Kin, in the game
  (`BUILD_CAP`, `my.built`) and in SQL (counted once per call).
- **Lyra**: `closeLyra(hard)`. × and the orb close her hard (`lyraClosed`):
  prio < 6 waits behind `#lyraDot`; prio >= 6 opens her, and when that message
  ends she closes again (`wasClosed`). "Got it" closes soft. Either way prio
  <= 2 is dropped for 4 minutes. `briefMission` respects it too.
- **Needs** (`S.needs` o2/food/mood, 0-100, `updateNeeds`): rates in
  `needRates()`, per real second, only while playing. `blackout()` moves 25%
  (10% with Second wind) of iron/silicon/ice/rare into `S.wreck`;
  `recoverWreck()` within 1 block.
- **Power** (`buildGrids`, `refreshGrids`, `tickGrids`): flood fill over your
  `POWER_T` tiles. `GEN` kWh per real second; solar only at depth <= 8 blocks
  and x0.1 in a storm; geothermal at depth >= 40. Battery charge is stored per
  tile in `S.cells`. Reactors still reach chargers within 10 blocks
  (`g.linked`). A charger with no grid power but within 8 blocks of the surface
  runs on its mast (2/s).
- **Auto-drills**: `rigRates` = per-block rate x efficiency (0.6 + 0.8 x
  rock/24) x Geology x power. Collecting needs `cheb() <= NEAR` (8).
  Greenhouses fill `S.larder` (30 per greenhouse), picked up within 8.
- **Storms**: `stormNow()` is pure clock maths (45-minute slots, ~62% hold a
  storm, 60 s warning, 100 s long), so all players agree without a server.
  Sentinel accounts can run a local test storm from the Dashboard.
- **Research** (`RESEARCH`, `S.research`): 18 projects, tiers need the
  attribute at 1/3/5. Effects are `hasRes()` checks where they apply.
- **Looks** (`S.look`, `LOOK_OPTS`, `cleanLook`): saved in `summary.look`,
  returned by `spacecore_crews()` so ghosts are drawn in their colors.
- **World**: extra ice and iron veins run after everything else in `genWorld`
  with their own RNG and only replace rock, so caves and tubes didn't move.
- **Season**: `MAIN_STAGES = 5`; stages 5-10 are Season projects (`proj`).
  `S.lastStage` catches completions that happened while you were away, and
  each completion gives a +10% day-long boost.
- Test hook: `?debug` on the game URL exposes `window.__sc` (local harnesses
  only; the site never adds it).

## Alpha trust note
Resource totals live in each player's own saved state, so a determined player
could edit them. That's fine for Alpha. Before Beta, move mining and
contributions to server-checked functions.

## Open questions
- The real Season 1 resource list and its lore ties.
- When does Mars time go 1:1 with real time?
