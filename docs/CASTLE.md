# Lights Out at Donaghy Castle

The Donaghy family's game: outside 13i canon (a space reskin may come later).
Paul's brief: the family playing together on laptops across several states;
funny, mysterious, simple, competitive; Among Us and Mafia hidden roles with
a bit of Clue, and the feel of childhood flashlight tag. English/Scottish
roots, so a medieval castle. Everyone plays for the **Donaghy Cup**.

## Where it lives
- Page: `app/donaghy-castle/page.js` (hidden; 404 unless the username is in
  `lib/familyGame.js` or is a Sentinel account).
- Buttons: Sentinel-X (`app/(site)/sentinel-x/page.js`) and the family
  panel on the Node (`app/(site)/account/page.js`).
- Rules + computer players: `lib/castle/engine.js`. Map: `lib/castle/map.js`.
  Sounds: `lib/castle/sound.js` (Web Audio, no files). Drawing:
  `components/castle/draw.js`. Screens: `components/castle/DonaghyCastle.js`.

## The rules as built (Update 5.92)
- 8-12 people. Roles: 1 Black Knight, 1 Knight, 1 Locksmith, 1 Blacksmith,
  1 Jester, the rest Squires. The Black Knight and the Jester know each other.
- The night runs 8:00 PM to midnight (8 real minutes of play; meetings pause
  the clock). Castle wins by jousting the Black Knight or finishing every
  chore. Darkness wins at midnight, or when the honest folk still free are
  no more than the Black Knight + Jester.
- Capture: the Black Knight grabs someone up close (25s cooldown). They
  drop their helmet where they were taken and become a ghost in the dungeon
  (ghosts still do chores, can't vote). The Locksmith can free one prisoner
  a night from the cell.
- Evidence (the Clue part): each helmet tells which room the captor came
  from (soot = Forge, straw = Stables, and so on, the `trace` on each room).
- Meetings: report a helmet (R) or ring the Great Bell (B, once each). Computer
  players give alibis (true rooms), sightings, and catch lies; the Black
  Knight gives a half-true alibi; the Jester stirs things up. A disguised
  Black Knight makes witnesses blame the person it was dressed as.
- Vote: most votes (beating "skip" and any tie) goes to the joust. Guilty is
  knocked off the horse and the castle wins; innocent is out (a ghost).
- Points: chores 10, reports 10, voting for the Black Knight 25, Torch of
  Truth catch 30, captures 10, win 50 (castle) / 60 (darkness). Totals are
  kept in localStorage (`donaghy-cup-v1`) until there's a shared table.

## Added in 5.93
- Knight builder (`Lobby.js`, `looks.js`, drawings in `knight.js`).
- The castle owl help (`HelpOwl.js`): tips derived from `hudInfo`.
- Music (`lib/castle/music.js`), tension from `hudInfo().tension`.
- Secret passages (`PASSAGES` in map.js; pathfinding hops them).
- Ghosts ignore walls (moveCircle / setGoal in engine.js).
- Meeting chat: `sayInMeeting` in engine.js.
- Joust scene (`drawJoustScene` in draw.js) used by the vote joust and the
  practice joust (`Joust.js`). Practice record: localStorage `donaghy-duels-v1`.

## Added in 5.94
- Map 80 x 58; `TABLE` (solid round table), `ARMOUR_STANDS` (solid decor).
- Sheba and Nana live in `world.sheba` / `world.nana` (engine.js), not in
  `entities`, so they never vote, get captured or count in sightings.
- Chores: `ChoreGame.js` (`CHORE_GAMES` maps each chore id to a game);
  the engine's `humanFinish` completes it. Passages are still hold-E.
- Mouse walking: `setHumanTarget` in engine.js; camera kept on the view.
- Vote clock: `VOTE_SECONDS` in DonaghyCastle.js.

## Balance
Tuned with bot-only simulations (300 nights, human seat idle): roughly
45-55% castle wins (46% after 5.93 and 5.94, capture cooldown 28s; nights run longer on the bigger map), nights end after 2-3 minutes of simulated play plus
meetings. Main dials at the top of engine.js: CAPTURE_CD, TRUTH_CD,
CHORES_EACH, and the computer voters' `trust` and 42-point threshold.

## Next: real family multiplayer
The world object is plain data stepped by `stepGame`, so the plan is one
host browser running the engine and broadcasting state, with each family
member's keys sent to it, over **Supabase Realtime** (already in use, so no
new service). Needs: a lobby/room code, seats for real players with the
remaining seats as computer players, per-player views (each sees only their
own torchlight and role), meeting chat or just the video call, and a shared
Donaghy Cup table in Supabase.
