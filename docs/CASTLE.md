# Murder in the Donaghy Castle

(Called "Lights Out at Donaghy Castle" until Update 5.95.)

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
- Vote clock: `VOTE_SECONDS` in lib/castle/engine.js (since 5.96).

## Added in 5.95
- Crest: `components/castle/crest.js` (drawn, not an image file).
- Schemes: `smokeBomb`, `falseAlarm`, `dropMarbles` in engine.js; smoke
  blocks sight via `smokeBlocks`. `schemesFor` feeds the HUD list.
- Sheba growls at the Black Knight (`world.growls`), a meeting clue.
- Moat ride: `startRide`/`rideTick` in engine.js, drawn by `drawBoat`.
- Music stages: `castleMusic.setStage(captures)`.
- Dominoes: `result.tiles` (endGame). Endings: `components/castle/Ending.js`
  with `playAnthem` (both tunes are original).
- Night log: `world.log` via `logEvent`.
- Deliberate choices: no hanging is shown (the march stops short), no
  copyrighted song is played (Paul asked for Sweet Caroline; the endings
  use original tunes), and the Cup screen line is original.

## Balance
Tuned with bot-only simulations (300 nights, human seat idle): roughly
45-55% castle wins (46% after 5.93 and 5.94, 47% after 5.95 with the new schemes and Sheba's growl clue; capture cooldown 28s), nights end after 2-3 minutes of simulated play plus
meetings. Main dials at the top of engine.js: CAPTURE_CD, TRUTH_CD,
CHORES_EACH, and the computer voters' `trust` and 42-point threshold.

## Family multiplayer (5.96)
- **Rooms.** "Open the castle gate" makes a 4-letter code (no I or O) and
  puts `?room=CODE` in the address, so the link can be sent as is; opening
  that link goes straight to the gate. Who's there comes from Supabase
  Realtime presence; the host's presence also carries the room settings
  (seats, "microphones only at meetings").
- **Host-authoritative.** The host's laptop runs the engine (`stepGame`,
  `directorTick`) on a 33ms timer (a timer, not animation frames, so it
  keeps going in a background tab) and broadcasts `snapshot(world)` every
  250ms on channel `castle-CODE` (about 13KB at 12 seats). Everyone else
  keeps a copy via `applySnapshot` and `glide` (smooth movement for others).
- **Each player moves their own knight** (`moveSelf`, path-finding for mouse
  clicks runs locally) and sends `pos` 4 times a second, only when it
  changed (plus a 2s keepalive), to `castle-CODE-up` by `httpSend` (a plain
  web request), so only the host receives it. Key presses, finished chores,
  chat lines and votes go the same way as `act`. Teleports (swap, capture,
  boat, meeting) bump `e.tp`, which tells a laptop to accept the jump.
- **Per-player everything.** Toasts carry `to` (a seat) and sounds sit in
  `world.sfx` with `to` or a place and radius; each laptop plays its own.
  Meeting notebooks are per seat (`m.notebooks[id]`), results per seat
  (`world.results[id]`).
- **The director.** `phase` goes intro (everyone lights their torch, or 60s)
  → play → meeting (lines appear 1.4s apart; the vote closes when every
  living real player has voted or after 45s; tally 6s) → joust (9.8s) →
  play, or ending. All laptops follow the host's phase.
- **Dropping out.** A player missing from presence for 8s is steered by the
  computer (`human = false`) and gets their seat back on return (same user
  id). Someone arriving mid-night waits at the gate for the next one.
  If the host's laptop goes quiet for 9s, players see a notice.
- **Seats.** Minimum 6; empty seats are castle folk. Tabards are made
  unique, and two people with the same name become "Name" and "Name II".
- **Voice** (`lib/castle/voice.js`): WebRTC laptop to laptop (a mesh, fine
  for a dozen people), with the room channel carrying the setup notes
  (`v-hello`, `v-here`, `v-offer`, `v-answer`, `v-ice`, `v-bye`; the lower
  id makes the call). Google's free STUN server helps laptops find each
  other; no audio passes through any server. Very strict networks (some
  offices) would need a TURN relay, which is not set up. Mic on/off (V),
  mute anyone, a speaking light, and the host's meetings-only option.
- **Testing:** add `?local=1` to the address and several tabs on one
  computer play together over the browser's BroadcastChannel instead of
  Supabase (each tab is its own player).
- The test night alone ("Enter the castle alone") is the same code with no
  network: you're the host of a room nobody else is in.
- The Donaghy Cup is still kept per laptop (each player's own dominoes);
  the end screen shows everyone's dominoes for the night. A shared all-time
  table in Supabase would need a small table and policy.

## Balance with fewer people (5.96)
With 6 seats the Black Knight works alone (the Jester joins from 7), and
the capture clock is slower in small castles (`captureCd`: 32s at 6, 48s
at 7, 28s from 8). The dark side now wins on numbers only when one honest
person is left free (the Jester can't capture). Bot-only sims, 300 nights
each: 46% castle wins at 6, 42% at 7 and 8, 46% at 10.
