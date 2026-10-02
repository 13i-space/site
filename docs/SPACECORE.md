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
- `spacecore_crews()`: names, levels and parked positions for everyone.

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

## Alpha trust note
Resource totals live in each player's own saved state, so a determined player
could edit them. That's fine for Alpha. Before Beta, move mining and
contributions to server-checked functions.

## Open questions
- The real Season 1 resource list and its lore ties.
- When does Mars time go 1:1 with real time?
