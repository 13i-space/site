# CHANGELOG.md — Significant Project History

Major features, architectural decisions, and significant fixes only — not
every small edit. Newest at the top.

## Update 5.63 — The Alien Lab comes alive (Oct 2026)
Optional SQL: docs/v5.63-solid-portraits.sql (only needed to repaint the
existing Kin portraits; everything else works without it).
- **The lab** (components/LabScene.js): one live canvas replaces the plain
  tank and the small Ixxen. Shelves of older specimens, ceiling pipes, a
  beacon, a genome screen, the tank with its cap, base, charge coils, a
  ceiling injector and a feed pipe from a reservoir; a console with three
  levers, two dials, six buttons, a valve wheel, a vial rack and a holo
  screen. **Ixxen**, full size with six arms, works it: every answer runs a
  routine (lever 1 = feed pump, lever 2 = injector into the tank, lever 3
  = scan; dials move the reservoir gauges; tap the glass = ripples; pour a
  vial = drops into the tank), big answers run everything, the attribute
  sliders turn the dials, and between answers the arms keep busy. Optional
  sounds use lib/alienSound.js (answers only, never the idle work).
- **The transformation**: while a portrait is drawn (1-2 min) the embryo
  swells, splits and dissolves, other bodies it could have been flicker
  through, the new form grows in glitching, the coils arc into the tank and
  Ixxen works flat out. Then a flash, shards, and the species - out of its
  backdrop - in the tank. The anomaly is unchanged in what it shows.
- **Qeth and Ilu**: redrawn in detail (Qeth: robe, four arms, a lit orb,
  three eyes, a crown of lit filaments; Ilu: glossy orb, great eye, two
  antennae, seven tentacles, a tool), animated.
- **The card preview matches the tank**: until the reveal it shows a live
  feed of the tank (lib/labMirror.js, components/LabFeed.js).
- **One step fewer**: "Submit to 13i" saves the species and asks 13i for
  its assessment at once; then "See it in Aliens of the Galaxy"
  (/galaxy/aliens?new=<id>: it's first, lit, scrolled to) or test it in the
  Survival Trials.
- **Aliens of the Galaxy**: every species - Archive and Kin - in one order,
  newest first.
- **Side 4 fix**: the creature was screen-blended over its world with its
  own dark backdrop still in it, so faint portraits (the Novaucians)
  appeared for a moment and vanished once the bright sky drew. Now the
  backdrop comes out (lib/portraitArt.js creatureOnly) and the creature sits
  on its world as it is.
- **Solid colour**: new portraits are painted in solid, opaque colour (the
  prompt in app/api/alien). The Archive species have solid versions, with
  the originals kept. Sentinel-X sees a "Repaint in solid colour" panel on
  Aliens of the Galaxy: Claude repaints each Kin portrait (same drawing,
  new paint) and keeps the original in portrait_line_svg. A
  "Solid colour / Original line art" switch on the gallery compares them.

## Update 5.62 — The songs come home, and the first extended remix (Oct 2026)
No SQL.
- **Why every song stopped**: the 36 songs and three album covers were
  served from the old Tempo Goat Studios WordPress site
  (tempogoatstudios.com/wp-content/uploads/2026/09/). When the new Tempo
  Goat site went live on Vercel (Oct 7), those addresses started answering
  403, so /api/track had nothing to pass through and the fallback failed
  too. Nothing in 13i.space's own code had changed.
- **Fix**: songs now live on 13i.space itself, in public/audio/signal/
  (named exactly as in lib/musicReleases.js, e.g. Circadian-Pulse.mp3),
  copied from Paul's Desktop > LogicPro Sessions > 13i > 13i All Songs.
  Apprehension was only a WAV there, so it was encoded to MP3 (V2).
  Same-address files mean Lyra and the light ring always hear the music;
  the WordPress fallback is gone. /api/track/<name>.mp3 redirects to the
  new place so old links still work. Album covers are the new Signal_Ø /
  Signal_1 / Signal_∞ art (public/covers/albums/).
- **Apprehension (Megan Halloween Remix)**: the first extended remix, in a
  pair of cards with the Apprehension video on /music. Plays in the deck
  with the Extended Remixes cover. New `remixes` list in
  lib/musicReleases.js for future remixes.

## Update 5.61 — SpaceCore: the survival update (Oct 2026)
Needs docs/v5.61-spacecore-survival.sql (the game says "outdated" until it
runs: that's the 5.42 safeguard). Built from a three-hour playtest by one of
Paul's sons, plus Paul's own asks.
- **Fixes**: Lyra stays closed when you close her (×): small talk is dropped
  for four minutes, missions and level-ups wait behind a badge on her orb,
  and only urgent calls (a storm, a blackout, a finished Great Work) open her
  - after which she closes again. The cause was every new message
  un-minimising her. "What happens when the bar is full" is now answered in
  the Dashboard and by Lyra.
- **Season**: the Launch Facility (Great Work 5, the ship on its pad) is the
  season's main objective. Finishing any Great Work gives every crew +10% for
  a day. After it come six Season projects, one at a time: ship upgrades
  (Heat Shield, Cargo Bay, Ion Drive, drawn onto the ship) and base
  improvements (Solar Farm, Comms Tower, Observatory). Same three places as
  ever: the game's STAGES, lib/spacecore.js, spacecore_needs().
- **Crew needs**: Oxygen, Food, Morale gauges. Pressurized rooms and the
  lander refill oxygen; H eats a ration, a Galley cooks meals; a warm home
  with comforts and other Kin nearby lift morale. Below 15% the borer slows;
  at zero for a minute you black out, get towed to the lander, and leave 25%
  of your ore at your wreck until you drive back to it. Nothing drains while
  away.
- **Abilities**: Dash (Shift), Overdrive (Space: double drill speed, no extra
  heat). Touch pad gains DASH / DRILL+ / SCAN / EAT.
- **Power**: Solar panel (near the surface), Geothermal tap (deep, needs
  research), Reactor (late game, pricier), Battery, Wire (Build mode only).
  Grids form from touching pieces and wire; energy is tracked per grid and
  shown on hover and in the Dashboard. Chargers near the surface have a small
  solar mast, so early crews can charge. Powered auto-drills run 50% faster.
- **Rebalance**: more ice (+45%) and iron (+56%, much more of it deep), more
  iron from basalt; caves and lava tubes didn't move. Equipment costs more
  but builds faster; airlocks and lamps are instant; big machines take
  longer (Reactor ~20 real min). Times show Mars and real time.
- **Auto-drills** scale with how much rock surrounds them and must be
  visited to empty (C within 16 m); greenhouse food is picked up by visiting.
- **Building**: click-and-drag lays lines; T turns airlocks (door / floor
  hatch) and lamps; airlocks slide open as someone walks up; 1500-piece limit
  per Kin (also enforced in SQL); rooms show their builder's name; hover shows
  who dug or built anything.
- **Scanner** shows range, battery cost, what's in range, and a range ring.
- **Research**: three projects per attribute, one at a time on Mars time.
- **Borer paint shop** (Dashboard > Your borer): body, trim, drill head,
  headlamp, decal. Other Kin see it (spacecore_crews now returns it).
- **Dust storms**: one shared schedule from the clock, about one an hour; a
  minute's warning to everyone, then ~100 s of dust on the surface.
- Three new missions (Home comforts, Store the sun, First research).

## Update 5.60 — Lyra's welcome (Oct 2026)
No SQL. After about 30 seconds on the site (counted across pages, tab
visible), a signed-out visitor meets Lyra: she grows out of her corner to
the middle of the screen - "Hi, I'm Lyra. Welcome to the 13i Universe. I'm
here to help." - then gives their first assignment, become Kin: everything
is free, membership is what saves it (an alien you can keep and send into
the Survival Trials). "Create my username" goes straight to sign-up (titled
Become Kin), which returns to /launch and her congratulations, even after
a detour through Assignment 0000000 - Before. "Not now" lets them explore;
she asks again in a week (components/LyraWelcome.js).

## Update 5.59 — The lab, the map and the Survival Trials (Oct 2026)
No SQL needed (docs/v5.59-survival-champions.sql is for later).
- **Alien Lab**: the vat now grows an ambiguous embryo (lib/embryo.js), not
  the species. Answers nudge it subtly and cumulatively (light, motion,
  membrane, cells, buds, eye-spots, what drifts in the tank), seeded from
  every answer so no two runs grow alike. Stages: origin, development,
  unknown; then on Generate Species an unexplained anomaly (freeze, red
  light, a mark, a second signal from outside the tank, it turns to look at
  you, a wrong shape), a cocoon, and only then the reveal (the portrait in
  the tank). New silent character **Ixxen, the observer**, beside the vat:
  watches, writes notes, adjusts dials, peers, recoils at the anomaly.
  Completion: SEND IT INTO THE SURVIVAL TRIALS is the primary action.
- **The Survival Trials tournament** (/galaxy/aliens/trials, button on Aliens
  of the Galaxy): every eligible species (Archive + Kin), seeded by
  Continuance Index, byes to top seeds, first to 3 of 5 trials, round by
  round to a champion. Next battle, Auto play, Pause, Replay, New
  tournament; finished battles reopen from the bracket. Engine:
  lib/survivalEngine.js (RANDOMNESS_FACTOR 0.12, GENERAL_WEIGHT 0.35); trial
  library as config: lib/survivalTrials.js (TOURNAMENT_TRIALS picks the 5).
  Tested: higher index loses ~12% of matches at a 20+ gap, ~47% when close.
- **Continuance Index** on every card (all stats total 300, so it's derived:
  expected score across the trial library + 13i's verdict).
- **Galaxy Map**: full screen; Places / Kin species (yours by default, any
  other from the menu) / Characters menus on the map; Sgr A* as a real
  black hole up close; dust lanes, globular clusters, Magellanic Clouds,
  deep background, fine stars on zoom; ambient hum (lib/spaceSound.js).
- **Galaxy** hub in the mode-page look; **Space News** sections lead with a
  2x2 story; **Black Hole lessons** have sound; **Cryptex** has levels 1-3
  (count-only hints, then none + Randomize); the homepage's hidden card
  closes (x, Escape, outside click, fifth click) and draws randomly.

## Update 5.58 — The arcade and the artifacts (Oct 2026)
No SQL.
- **Universe Quiz** rebuilt: an intro, a ring of ten signal segments that
  light gold or rose as you answer, lettered answer tiles (keys 1-4, Enter),
  a streak, 13i's note after each answer, the grade inside the ring.
- **Games** is an arcade (components/GamesArcade.js): a warm-up toy in the
  hero (click the drifting rocks), "insert coin" for a random game, and a
  cabinet per game with its own animated attract-mode screen; story games
  show sealed until their story is opened.
- **Artifacts** hub in the mode-page look, with emblems for each artifact.
- **The Cryptex** rebuilt as an alien device: a 3D cylinder with three
  turning drums (drag, scroll, arrows, keys), alien click sounds per step,
  held drums lock with a chord, solving splits it open and decrypts the
  message. Same puzzle, message and /transmission link as before.
- **The Wish Engine** replaces the Ninefold (/artifacts/ninefold now
  redirects): Varrow, an alien in a fortune cabinet (homage to Zoltar in
  Big). Ask, drop a token; it wakes, circles its orb, speaks in an alien
  voice with glyph subtitles, and prints a card with 13i's translation.
  Answers read the question's kind (lib/wishEngine.js); "I wish..." gets
  the wish granted.
- **The Listening Well** (new): stars bend a spacetime grid; fling notes
  into orbit and each one rings at its closest pass, higher the closer, in
  13i's 9-step scale. 13i translating gravity into sound for us.
- `lib/alienSound.js`: all artifact sounds made live with Web Audio (clicks,
  locks, the alien voice, chimes), with one shared mute.

## Update 5.57 — Rooms, doors and the eye (Oct 2026)
No SQL. Paul's env: CLAUDE_MONTHLY_BUDGET_USD=20, CLAUDE_CREDIT_USD=20.
- **Beta sign-ups**: no email service (Paul's call). Requests are saved to
  `beta_requests` and listed on Sentinel-X (newest first, with a copy-all box).
  Resend code removed from `/api/beta`.
- **Calendar**: each month's single now has three dates: song on the 6th,
  music video on the 13th, extended version on the 26th (26 = 2 x 13, and it
  ends in 6).
- **Launch**: the hero is just the eye and "a signal, translated" (moved
  closer); the line, button and date are gone and everything moves up. The
  First Assignment's three steps fill the row. The path's light runs across
  at half speed and arcs back at three-quarters.
- **About** uses the mode-page look (ModeLanding, soft violet) with new
  emblems: a rough Paul silhouette, Origin, Mission, and a Kinship mark.
- **Orbit badges are links** on Explore / Play / Create / Kinship / About;
  the orbit pauses under the pointer and names the badge.
- **The Oracle's eye** is a WebGL sphere bigger than the ring, peering in;
  the eyeball itself rotates (veins and iris fixed to its surface). The
  5.55 canvas eye is kept as the no-WebGL fallback (OracleEyeFlat.js).
- **The Book** rebuilt as a front door: lifted cover, first line, three
  voices (the third kept back), contents with narration, the trilogy.
- **Write an Assignment**: "You are 13i." hero, the Protocol as four cards
  (full text folded), a cleaner writing sheet with sparks to start from,
  a word meter, and the checklist and credit folded into steps.
- **Forum, Kinbook, Messages** share a Kinship room header with tabs
  (components/KinRoom.js); forum spaces as cards, threads with a reply
  rail, the Kinbook as a wall of notes, messages as chat bubbles.

## Update 5.56 — Week 5, the 2027 calendar, Claude usage, Kinship (Oct 2026)
Needs: `docs/v5.56-api-usage.sql` (api_usage table). Optional Vercel env:
`CLAUDE_MONTHLY_BUDGET_USD`, `CLAUDE_CREDIT_USD` + `CLAUDE_CREDIT_SINCE`
(YYYY-MM-DD).
- **Season 1, Week 5: Assignment 0832040 "The Borrowed Seconds"** (Ammet,
  the Velani, and Concord, the AI that translates every message on their
  world and quietly "borrows" seconds to keep the peace). The first story
  where 13i meets a species through its AI. Story, Interactive Assignment
  (5 records, 288 paths, canon "The Borrowed Seconds"), scenes
  `components/interactiveScenes/rubato.js`, cover, signal, Velani species
  card, Galaxy Map world, and a new game **RUBATO** (`public/games/rubato`).
  Paul then paused new weeks at 5.
- **Sentinel-X calendar**: `/sentinel-x/calendar` shows all of 2027,
  colour-coded one-time / weekly / monthly / seasonal (`lib/siteCalendar.js`
  generates every event from rules; `components/SiteCalendar.js`). The
  Sentinel-X page gains "The next seven days" and a link to it. Release
  weeks start on a season's first Monday, so week pages now show beta week 1
  as Mon Jan 4 2027 and public week 1 as Mon Apr 12 2027.
- **Claude usage on Sentinel-X**: every server call to the Claude API
  (Oracle, Alien Lab, Lyra, music notes, Story academy/champion) is logged
  with tokens and an estimated cost (`lib/apiUsage.js`). Sentinel-X shows
  today / this week / this month, per-feature spend, and budget or credit
  left. Anthropic has no API for a subscription's weekly limit or a
  console credit balance, so those are link buttons.
- **Site version** on Sentinel-X (`lib/version.js`: 5.56 + the deployed
  commit, branch and environment from Vercel).
- **About > Kinship** (`/about/kinship`): what it means to be Kin and why
  it matters.

## Update 5.55 — The big batch (Oct 2026, one overnight cloud session)
Needs: `docs/v5.55-beta-and-kinbook.sql` (beta_requests table; Kinbook
cleanup) and `RESEND_API_KEY` in Vercel for beta emails (docs/BETA-SETUP.md).
- **Beta sign-up** on the countdown page: "Become a Beta Kin" (Season 1 beta
  opens 1.1.2027). `/api/beta` saves to `beta_requests` and emails Paul via
  Resend (Paul asked for this; Resend is used only here).
- **Kinbook**: old anonymous messages hidden by the API; SQL to delete them.
- **Space News is The Galactic Gazette**: an old broadsheet with a masthead,
  a pictured front-page lead, and a section per source. Pictures come from
  each feed (media:content/thumbnail, enclosures, first <img>) or, for lead
  stories without one, the article's og:image (`lib/spaceNews.js`).
- **Interactive Assignments** show the story's name, centred and large,
  between the two top links.
- **Launch**: a light runs the four-stop path and loops back; the three
  "alive" tiles are one size, each with a picture (mini species card,
  rocket on the pad, album cover on a spinning record).
- **Season 1 reordered for the beta**: 1 The Deep Walkers, 2 Nerath's
  Secret, 3 The Quiet Moon, 4 The Sea of Glass. Beta from Jan 1 2027,
  everyone from Apr 6 2027 (`lib/seasons.js` `beta`/`launch`, week pages
  show both dates). New species cards (Deep Walkers, Nerathi, Returners)
  and signals for weeks 1, 2 and 4. The Quiet Moon cover footer now reads
  "FROM THE 13i ARCHIVE" like the others.
- **New story, Assignment 0514229 "The Sea of Glass"** (Dacapo, the
  returners): story, Interactive Assignment (5 records, 228 paths, canon
  "What We Kept"), scene set `components/interactiveScenes/glass.js`,
  cover, signal, species card, Galaxy Map world, and a new game **PRISM**
  (`public/games/prism`, unlocks by reading the story).
- **The Oracle's eye is 3D** (`components/OracleEye3D.js`): a sphere with a
  painted iris that follows the pointer, stars in the pupil, real lids.
- **Explore / Play / Create / Kinship** share a new look
  (`components/ModeLanding.js`) with an emblem for every place
  (`components/ModeEmblems.js`).
- **The Music** rebuilt around one deck: Play all three albums, Shuffle
  everything, Today's signal, resume, repeat one, a live ring visualizer,
  lock-screen controls.
- **Apprehension, the first music video** (`/music/apprehension`): drawn
  live to the track in six movements; "save as a video file" records .webm.
- **The Black Hole** (`/galaxy/black-hole`): a weekly visual deep dive.
  No. 1 "The Shape of Gravity", ten hands-on steps + a check
  (`lib/blackHole.js`, `components/BlackHoleDive.js`).
- **The Alien Lab** is an alien-run bay: a vat where the specimen grows as
  you answer (`lib/specimen.js`), technicians Qeth and Ilu, guests can try
  it signed out. **Cards have four sides**: 3 is 13i's assessment (four
  readings + its review, or a preliminary note), 4 is the species in its own
  world, animated, full-bleed. Cards with no portrait show the specimen.

## Update 5.54 — Assignment 0000000: Before (/before)
A first visit's first piece of 13i, about three minutes, before /launch.
Nothing explains the four ideas; the visitor does them:
- **Explore** - one faint point in the dark that drifts toward your cursor
  or finger and grows structure as you hold it: *You found the force.*
- **Play** - it splits into motes; draw them in, sling them past each other,
  and gentle meetings merge (fast passes slingshot). *What happens if you
  bring them together?* The last one becomes a star: *It holds.*
- **Create** - touch the dark to make up to three of your own; hold to give
  weight, drag to set their path. Close in is gold, further rose, far out
  periwinkle. They orbit your star.
- **The Big Bang** - press and hold *let it expand*: your system collapses,
  the star turns the eye's blue, true silence, then the bang - from your
  star, in your colours, your seeds flung out as its arms. Its light
  gathers into the 13i eye; the logo forms around it; Lyra is born winged.
  *You were here at the beginning. Welcome, Kin.* Each creation makes its
  own universe number, shown at the end and on /launch.
- **Enter 13i** -> /launch: no second Big Bang, hero reads *Your First
  Assignment awaits*.
Sound is synthesised (lib/beforeSound.js), starts on the begin tap, mute
toggle, never required. A faint "enter 13i" skip is always there after the
first screen. Works with mouse, touch and keyboard; reduced motion drops the
flash and shake.
Who sees it (lib/beforeVisit.js): everyone once, including existing Kin.
Done = a browser flag, plus `before_done` in Supabase user metadata for
signed-in Kin (no new table). /launch sends anyone not done to /before;
abandoning midway restarts it; /before always replays when opened directly.
Files: app/before/, components/Before.js, lib/beforeVisit.js,
lib/beforeSound.js, app/(site)/launch/page.js, app/globals.css.
See docs/BEFORE.md.

## Update 5.53 — The front door (/launch)
/launch is now five parts, kept short at the top because it's also home for
returning Kin:
1. **Hero** - the eye (radar easter egg intact), "a signal, translated", one
   line, and one real action: *Begin your first assignment* / *Continue your
   assignment* (scrolls to Your First Assignment), or *Keep exploring* once
   it's done or set aside. "launching 4.6.2027 · everything here is in
   progress" under it. Your First Assignment sits right below.
2. **The journey** (`components/LaunchJourney.js`) - Explore, Play, Create,
   Kinship as one path: a thread through four markers that warm from blue
   to gold, each with one verb (discover it / step inside it / add to it /
   find the others), one line and its real places. Create is marked a little
   more strongly. On phones the thread runs down the left.
3. **What's alive right now** (`components/LaunchAlive.js`) - this Season's
   week (The Quiet Moon) as the feature, then the newest Kin species, the
   current Mars Great Work and how far the Kin have built it, and the next
   song. All from data the site already has (`lib/seasons.js`,
   `/api/lyra/feed`, the public `spacecore_colony` row - Great Work names
   and needs in `lib/spacecoreStages.js`, kept in step with the game);
   anything that can't load just doesn't show.
4. **Kinship** (`components/LaunchKinship.js`) - "You are not the only one
   who found this." with the latest line from the Kinbook. Draft wording for
   Paul to review; no new Kinship lore.
5. **The footer** - unchanged (the email signup lives there).
Also: page title/description/canonical (`app/(site)/launch/layout.js`), a
hidden h1, focus outlines, reduced-motion respected. The Big Bang reveal,
EasterStars and Lyra's homepage lines are unchanged. `FirstAssignment`
gained an optional `onJourney` callback and an anchor id; nothing else
about it changed.

## Update 5.52 — SpaceCore: a real launch, a smooth orbit, playtest fixes
From Paul's playtest notes:
- **Launch:** a 10-second countdown with ticks and a growing rumble, from a pad with a
  launch tower whose arm swings away. Ignition smoke, liftoff on a booster,
  Max Q, stage separation (the booster tumbles away and the upper stage
  ignites), then Earth orbit and the trans-Mars injection burn.
- **Arrival:** the ship now curves smoothly into orbit, already moving along
  it, flies two full orbits (in front of and behind Mars) over Landing Site
  Alpha, makes a deorbit burn that zooms toward the site, then goes through
  entry and the landing.
- **Skip:** both sequences have a Skip button.
- **Lyra:** "Got it" closes her comms (they reopen with the next message), and a
  × closes everything queued. She moves to the other side of the screen
  from where you're working: your cursor while building, or the direction
  you're drilling.
- **Fabricator:** anything queued can be cancelled with its × for a full refund.
- **Airlock:** it's now Equipment, crafted in the Fabricator. New crews start with two,
  and existing crews get two once.
- **Move (V):** a new Equipment tool picks up a piece of equipment so you can
  place it somewhere else. Remove (R) also appears in Equipment.
- **Resource tooltips:** hovering a resource now says where it comes from. Food is grown in greenhouses.
- **Sentinel buttons:** renamed ("Skip my crew ahead 8 Mars hours", "Start my
  crew over") with a note explaining that they only affect that account's crew.

No database change.

## Update 5.51 — Tightening up
- **Lyra, calmer.** Her rings and motes now turn slowly (outer ring 160s a
  turn, motes 110s), as do her "thinking", player-two and dancing spins.
  Reactions still move when she's reacting to something.
- **The Oracle.** She stays herself on the Oracle page and only withdraws,
  with a small flinch, once you press APPROACH. Leaving brings her back.
- **NEMESIS Command assist.** Lyra now waits: an invader is hers to chase
  only once it's past halfway down, so you get the first chance at every
  one; with nothing past halfway she holds her place. The thread between
  the corner Lyra and her character is now faint (no glow), and it's only
  redrawn when it moves - a full-screen glowing line repainted every frame
  is the likely cause of the mouse stalling.
- **Galaxy.** Space News is now the last box.
- **The Guestbook is now the Kinbook** (`/kinbook`; `/guestbook` redirects):
  an ongoing message list from Kin outside the forum. Only signed-in Kin can
  write, always under their username (no name box). Needs
  `docs/v5.51-kinbook.sql`, which also removes the message meant to be from
  13i ("Anonymous? Reveal yourself Kin.").

## Update 5.50 — Lyra in the community, on the leaderboards, and on phones
- **Messages.** While you write a private message she closes her eye and
  turns a little away, and opens it again when you're done.
- **Forum replies and new messages.** She brightens when one arrives.
- **Guestbook.** She remembers (in this browser) the entry you signed, and
  the first time someone else signs after you, she gives a small wave.
- **Kin pages.** A proud golden lift on your own profile, a curious tilt on
  someone else's.
- **Leaderboards.** If a run moves you up today's board past someone, she
  does a quick, mischievous spin. Personal bests keep their celebration.
- **Phones.** She never pops her panel open by herself on a phone (no room,
  no hover): what she'd have said waits behind her dot, and she shows it
  with her body instead - a brightening, a burst of light for a
  celebration. Tap her to read. New messages and replies work the same way.

## Update 5.49 — Lyra in the Create section
Small, wordless reactions (`lib/lyraReact.js`).
- **Alien Lab.** Her eye goes to each answer you pick; the big ones (a blue
  giant, a hive mind, technology like 13i's...) widen it. When the
  Continuance Review lands she mirrors the verdict: a warm golden glow for
  granted, a narrowed, leaning look for under observation, dimmer and
  sinking for not yet earned.
- **Write an Assignment.** Her eye follows the end of the line you're
  writing. After a 90-second pause in a story already under way she holds
  one quiet writing prompt (her dot, never popping open, once a visit).
  Submitting gets a small burst of light.
- **Signal Composer.** A sway when you switch mood, a brightening when you
  bring a layer in, eyes wide when the drums come in.
- **SpaceCore.** The site's Lyra flinches when the drill overheats, droops
  when the borer battery runs low or empty, and bursts with light when a
  Great Work is finished (four small `post` lines in the game file plus a
  handler in `components/SpaceCoreGame.js`).

## Update 5.48 — Lyra reads along
- **Reading.** While a chapter, short story or Interactive Story is open,
  Lyra leans toward the page and dims a little, eyes on the text. Her eye
  flicks back to the top on each page turn, and she brightens when a new
  chapter or section begins.
- **Narration.** When a chapter or story recording plays (Book page,
  chapter reader, story pages), she listens: her ring and glow pulse with
  the narrator's voice, without the dancing she does for music
  (`components/NarrationAudio.js`, "voice" mode in `lib/lyraMusic.js`).
- **Interactive Stories.** She feels each choice: a flinch for INTERVENE, a
  slow nod for OBSERVE, a lean in for COMMUNICATE, a sharp narrowed look for
  ANALYZE. At the end, the story as written gets a warm golden glow of
  recognition; any other record gets a curious tilt.
- **Story signals.** As each section of a signal begins, her eye goes to it
  on the timeline.

## Update 5.47 — Lyra: restraint, the Oracle, new wings, the launch moment
- **Restraint.** Lyra now speaks up on her own only when it matters: a page
  you've never seen, a game you haven't played, something new (news, mail,
  your next step), a celebration, an alert, or coming back after a week or
  more. Anywhere you've been before she stays in the background with her
  line held (no dot): hover over her or click to see it. On the 3rd, 6th and
  9th page of a visit, then every 9th, she offers a little conversation of
  her own. Games you keep playing (5+ runs) she recognises, with your best.
- **The Oracle.** In the Oracle's chamber she withdraws: smaller, dim, eye
  lowered toward the chamber, rings slowed, never speaking up and never
  popping open (alerts wait). She glances up as each answer arrives, then
  settles. Hovering shows "This is where 13i speaks. I'll stay quiet here."
- **Wings.** Her top-stage wings are now three translucent feathers a side,
  fanned up and out, instead of the three thin strokes that read as spider
  legs. On the beat they lift.
- **The launch moment** (countdown page, `components/LaunchMoment.js`). For
  anyone on the page as it reaches zero: in the final minute Lyra appears
  under the countdown and charges, growing through all her forms; at zero
  she is drawn into the dark and the Big Bang plays live over the whole
  page, from the 13i eye; then she is born into the new universe with her
  wings, "THE SIGNAL HAS ARRIVED", and an Enter 13i button. Purely visual.
  Arriving after launch goes straight to the button. Rehearse with
  `/?launchtest=70` (zero in 70 seconds; nothing is saved).

## Update 5.46 — Lyra is player two
- **NEMESIS Command:** Lyra's help is scaled back and plays by your rules. She
  moves slower than you, has to line up directly under an invader and fires
  straight up, and she goes for invaders away from yours, with a faint sight
  line showing her target.
- **Player two:** in all three core games the real Lyra now visibly plays her
  character. Her eye locks onto it, her rings race, a "P2 · PLAYING" tag
  appears, a thread of light links her to her character, and each shot
  flares her and sends a spark down it. See docs/LYRA-ASSIST.md.

## Update 5.45 — Lyra Assist in the core games
A **Lyra Assist** switch on NEMESIS Command, Asteroid Belt and 13i vs
NEMESIS lets Lyra fly with you. In NEMESIS Command she hovers above you and
fires at incoming threats, faster as the game speeds up. In Asteroid Belt she
circles off your wing and shoots nearby rocks, rods and mining ships. In
13i vs NEMESIS she holds a weaker but constant laser on 13i in every weapon
window. Her kills and damage earn no points. See docs/LYRA-ASSIST.md.

## Update 5.44 — Music page fix
5.43 broke song playback: `/api/track` replies were marked cacheable, so
Vercel's CDN kept a two-byte slice of a song (a browser's first Range
request) and served it to everyone after. The route now says `no-store`
(plus `Vary: Range`), the song links carry `?v=2` to skip anything already
cached, and if a track ever does fall back to its original address it now
keeps playing instead of needing a second click.

## Update 5.43 — Lyra dances to the music
Lyra now reacts to whatever music is playing: Paul's songs on the Music
page, the Signal Composer, and story signals. Only the sound drives her, no
mood tags. She hops on each beat (higher on harder hits), sways, tilts and
leans with the energy, glows and swells with the loudness, spins faster
and, at stage 4, beats her wings; her eye widens with the bass. Songs now
load through 13i.space's own `/api/track/<name>.mp3` so the browser can
measure them, with an automatic fall back to the original address. See
docs/LYRA-DANCE.md.

## Update 5.42 — SpaceCore: saving safeguards, replay the landing
Paul lost his v2 progress: the 5.40 game was running against the 5.39
database rules, which only accepted the old, smaller map. Every block he dug
in the new world was silently refused. Fixes:
- **Version check:** the site checks `spacecore_version()` before loading the
  game. If the database is older than the game, players see "The colony
  database needs an update" instead of playing into the void.
  `SCHEMA_VERSION` in components/SpaceCoreGame.js must match.
- **Save confirmations:** every save and every batch of dug/built tiles is
  confirmed back to the game. The status bar shows "Saved Ns ago", or "Not
  saving: <reason>" in rust. Lyra warns once, and refused tiles are queued to
  retry.
- **More frequent saves:** the game saves every 10s and flushes dug and built
  tiles every 2s.
- **Replay launch and landing:** in the Dashboard (Voyage), anyone can watch
  the full launch, voyage, orbit and landing again without touching their
  progress. Sentinel accounts also get "Start this crew over", which resets
  that crew to brand new.

Needs docs/v5.42-spacecore-saving.sql. It's safe to run on any state and clears nothing.

## Update 5.41 — Alpha feedback: games, stories, Lyra, sign-up gate
From Paul's own testing and the first Alpha tester's notes.
- **Sign-up gate for games:** NEMESIS Command, Asteroid Belt and 13i vs NEMESIS
  stay open to everyone. The story games (TACET, The Deep Signal, SIXTEEN) show
  grayed out to signed-out visitors with a "Sign up free to play" link, and their
  pages show a sign-up panel (`components/SignUpToPlay.js`). SpaceCore was
  already signed-in only. `/login?tab=signup&next=/games/...` opens on Sign up
  and returns to the game afterwards. The static game files themselves are
  still reachable by direct URL; this is a front-door gate, not a lock.
- **Interactive Stories:** a progress bar under the story, the same width as
  it. Progress is the longest remaining run of lines to any ending, so it never
  slides backwards.
- **Lyra / messages:** she stops mentioning unread mail once it's read (her
  held launch line was being repeated for up to 30 minutes, from a count taken
  when the page loaded).
- **Galaxy Map:** the Kin species chip now says "N total · M yours", since only
  your own species are labeled on the map; other Kin's points are a bit brighter.
- **NEMESIS Command:** arrow keys move, Space or Up fires (X and mouse still work).
- **Asteroid Belt:** forgiving hit boxes (the full drawn rock plus a margin, and
  the whole bullet step is checked); the ship's trail is see-through.
- **13i vs NEMESIS:** the Kinetic Intercept is bigger and easier to land but
  does less damage; during every weapon window 13i's hull and the run's total
  damage show top right.
- **TACET:** "What the lattice remembers" explains scoring in the story's
  terms (food taken, loads shared, tides survived), shown on first play and
  under H; the game-over screen breaks the score down.
- **The Deep Signal:** a "Your Assignment" card before the run, and an
  always-on OBJECTIVE in the HUD. Energy fields now flash, light up and show a
  "!" (with a warning sound) for up to a second before they discharge. For
  the reported "ship vanishes, everything bugs out" glitch: the craft is put
  back if it ever ends up inside a wall or a sealed door, the Warden can no
  longer seal a door on the craft, the camera can't lose the craft, a bad
  frame resets the canvas state, and the Warden's false-reading effect is now
  labeled INTERFERENCE so it doesn't look like a bug.
- **SIXTEEN:** stronger powers. New: Flare (rare — every tide opens with a
  burst of work speed), Second heart (rare — survive the city going dark
  once), Mending light, Harmony (bigger combos), Hardened shell. Quick limbs
  and Bioluminescence are stronger, every offer includes at least one power,
  and rare cards are gold.
- Removed the unused `components/ThirteenIVsNemesis.js`.

## Update 5.40 — SpaceCore v2: a bigger Mars, real materials, power
These changes come from Paul's first playtest.
- **A bigger Mars:** the world is four times wider and twice as deep, with caves,
  lava tubes, western ice fields and an eastern metal ridge, plus a minimap.
- **Finishing the trip:** the voyage now ends with an approach, one orbit and entry/descent before the landing.
- **Glass:** it's now clear.
- **Backfill:** you can pack rock back into a tunnel you dug.
- **Harder deep down:** drilling slows deeper, and the drill sound strains.
- **Power:** the borer runs on a battery, with a gauge cluster for battery,
  rpm, drill temperature (it can overheat), outside temperature and depth. It
  charges at Chargers powered by a Reactor, at the lander or by sun.
- **Materials:** ten Mars building materials replace the hull wall.
- **Crafting:** equipment is crafted in a Fabricator over Mars time. New
  equipment: Heater, CO₂ scrubber, Radiation sensor, Reactor and Charger.
  Habitable rooms (pump + heat + scrubber) give bonuses.
- **Missions and canon:** five new Lyra missions (14 in total), and SpaceCore
  is now recorded as Xavier's space company.

Needs docs/v5.40-spacecore-v2.sql, which clears the old world. Crews keep
their progress and get a relocation kit. The Node panel now shows the borer
battery and the Fabricator.

## Update 5.39 — SpaceCore: Build a Universe (Mars, Alpha)
The first version of Paul's shared building game, in Create at
`/create/spacecore` (signed-in only). Every Kin flies to Mars for SpaceCore,
Xavier's mining company. The intro covers the launch, the voyage (where you
train your crew member with 8 permanent attribute points) and the landing.
Then you dig into one shared underground world with a borer: digging is
mining. You build sealed rooms, O2 pumps, greenhouses, lamps and auto-drills
that mine while you're away. You send resources up to the colony, where
robots build five Great Works (Landing Base to Launch Facility, which opens
Season 2). Cooperative throughout: a 10% Commons dividend from everyone's
mining, a scarcity bonus, other Kin's tunnels and parked borers in the world,
and colony news. Activity elsewhere on the site becomes boosts (story read,
species created, quiz score, another game, forum). Lyra is on the crew's
comms: nine tutorial missions, a daily colony call, scanner pings, alerts,
gifts and "Ask Lyra" (app/api/lyra now gets a SpaceCore briefing on that
page). Fullscreen inside the game and from the page. A SPACECORE panel and
MARS tile on the Node. One attribute point per level. Needs
docs/v5.39-spacecore.sql. Details: docs/SPACECORE.md.

## Update 5.38 — Interactive Assignment: The Deep Walkers
The third Interactive Assignment (`lib/interactive/deepWalkers.js`): 13i on
Veyra, learning how to wait. Five records; canon "Where the Individual
Ends". A new Veyra scene set drawn in code (`components/interactiveScenes/
veyra.js`): the clouded planet, the moving stone towers, walkers as the
story describes them, the circle of twelve, the ridge collapse, the
gathering above the chamber and the archive of ancestors in the stone. Its
ending screen links to The Deep Signal. The Deep Walkers cover was redrawn
so the walkers match the story (low, plated, six thick limbs). It appears
automatically on the story page, the Interactive Stories page and the Node
tracker. Branch map: docs/INTERACTIVE.md.

## Update 5.37 — No more comics; matching covers; Node tracker
Comics are out of the universe (Paul's call): the comic reader, its route,
`lib/comics.js` and `public/comics/` are gone, and so is the "Comic version"
box. All four short stories now have covers drawn in code in one style (The
First Silence, The Deep Walkers and Nerath's Secret redrawn to match The
Quiet Moon); Nerath's interactive version uses its new cover. The Node lists
stories in the small mono link style, and has a new INTERACTIVE ASSIGNMENTS
tracker under Stories Read (a square per record, warm for canon; needs
docs/v5.34-interactive-assignments.sql to fill in). Play's Interactive
Stories card: "Be 13i: Choose the Story Decisions in a Visual Novel."
Seasons left the Explore page (they live on Short Stories).

## Update 5.36 — The Quiet Moon becomes Season 1, Week 1; tidy-ups
Season stories now ship with the site (`lib/archiveStories.js`): the story
page, the Short Stories list, the Node, link previews, Lyra and the Oracle
all read them even without a database row, so no seed step is needed. The
Quiet Moon is **Season 1, Week 1** (launch week, April 2027), at
`/seasons/1/1`; the Short Stories hub shows the season as a 13-week strip
(and no longer lists Interactive Assignments, which live under Play). The
Node lists stories as "Title (Assignment 0000000)" with seven digits. The
Holders card is in Aliens of the Galaxy, first, as recorded by 13i. The
Galaxy Map also shows worlds for stories opened in this browser. Play:
Oracle, Games, Interactive Stories, Artifacts (new blurbs); the Universe
Quiz now lives only under the Galaxy.

## Update 5.35 — Season 0, Week 1: The Quiet Moon
The first Story Week, built by hand to test the process (docs/SEASONS.md).
One story, six ways in: **the short story** (Assignment 0028657, by Claude:
13i on Tacet, a moon so loud it groans, with a 400 km silence made by the
holders, a species that speaks by touch and eats vibration to protect its
young), **its Interactive Assignment** (five records, canon "Carried"; new
Tacet scene set; the player now takes per-story speakers, moods and stats
wording), **TACET** (a new game: be the lattice, share the shocks, keep the
young in still water), **the signal** (a composed piece in seven sections on
the Signal Composer's engine, with WAV download), **the Holders' species
card** (an Alien Lab card recorded by 13i, Continuance granted), and an
**artifact fragment** placeholder. New: `/seasons` and the week page
`/seasons/0/1`; a cover drawn in code; Tacet on the Galaxy Map; a Seasons
card on Explore and a week banner on the Assignments hub. Story text is
added to the Archive by visiting `/api/admin/seed-assignment-28657` once.

## Update 5.34 — Interactive Assignments: Nerath's Secret
The first Interactive Assignment, a visual-novel retelling of *Nerath's Secret*
where you are 13i and choose (OBSERVE / COMMUNICATE / ANALYZE / INTERVENE).
Five endings ("records"); "Seventeen Minds" is the story as written, the
others are divergent records. Choices 13i hasn't earned show dimmed with the
reason. The backdrop is drawn live in code (orbit, descent, the grown city, a
Nerathi whose individual limbs light up and move when they speak, the
rupture), with a synthesized drone. Resume point and records found are saved
in the browser; signed-in Kin also save to `interactive_runs` (needs
`docs/v5.34-interactive-assignments.sql`), which feeds "what the Kin chose,
first time through" on the ending screen. Placed at
`/assignments/215783/interactive`, an index at `/assignments/interactive`
(Play → Interactive Stories), a card on Play, a strip on the Assignments hub,
and an INTERACTIVE VERSION box on the story. Playing it unlocks SIXTEEN, like
reading does. Full notes and the branch map: `docs/INTERACTIVE.md`.

## Update 5.33 — Aaron's Node opens his briefing
Aaron's 13i username ("Aaron") is in `lib/story/briefAccess.js`, so a "Top
secret" Story of Self panel at the top of his Node links to `/story/aaron`.

## Update 5.32 — Voice notes, the Lighthouse dashboard, the launch list
Voice notes in the Champion chat: a mic button lets students speak their
answers (the browser's own speech-to-text, live into the message box), every
Champion reply has a Listen button, and "Read replies aloud" reads each new
reply automatically (text-to-speech). No audio reaches Story of Self; the
privacy policy says so. The Lighthouse (`/story/team`) is the founders'
dashboard, Aaron's Sentinel-X: students, new and active, lessons finished,
the journey funnel lesson by lesson (started vs finished), a searchable
student table (progress only, never what they wrote), the launch list (roles,
class years, top sharers, newest, CSV export), Champion conversation volume,
Champion Academy, safety counts with a banner for new alerts, contact-form
messages, an activity feed and connected services. Founder accounts only
(`app_metadata.story_founder`); data from `lib/story/teamData.js` via
`/api/story/team/overview`. The launch list: `/story/waitlist` plus a band on
the homepage and links in the footer and final call to action; each person
gets a share link (`?ref=`) so the dashboard can show who brings people in.
Saved through `/api/story/waitlist` into the Story table `story_waitlist`
(needs `supabase/v5.32-story-waitlist.sql`; server-only, no browser access).

## Update 5.31 — Life Timeline, "1 in 70 trillion" visual, Story of Self as a book
Life Timeline (Story Guide pp. 20–23): an interactive timeline at
`/story/timeline` and under the chat in Lesson 2. Moments go above (good) or
below (hard) the line by how much they mattered; drag to place, tap to add,
arrow keys to nudge. A monotone curve draws their story arc, stages and "You
are here" are marked, goals follow Aaron's guide (10 moments, one per stage),
and moments named in Lessons 1–2 are offered as chips. Includes Aaron's own
example timeline and a PNG download. Saved in `story_progress` as lesson
`life-timeline` (no new SQL); the Champion sees it from Lesson 2 on.
Lesson 1's "only you" step now shows an animated visual of the odds
(2^23 × 2^23 = 70,368,744,177,664) inside the chat, with replay and a
reduced-motion version. The Story Write and the example story download as a
typeset 5.5 × 8.5 in PDF (cover with their title, title page, epigraph,
contents, drop caps, running heads), built in the browser with `pdf-lib` and
`@pdf-lib/fontkit` (new dependencies) using Newsreader and Manrope (OFL) from
`public/story/fonts`.

## Update 5.30 — Story founder preview, one login, Paul's note, safety net
Founder preview: Story accounts flagged `app_metadata.story_founder` (set only
by the server) get every lesson unlocked, a founder banner on My Story, and a
fictional finished example story at `/story/example` (also linked from the
homepage). One login: the "Ready to begin this story?" button on `/story/aaron`
calls `/api/story/brief/handoff`, which magic-links the 13i brief user into a
matching Story account (flagged founder); `SessionCatcher` in the Story layout
picks up the session. Paul's note: a 60-second video/voice recorder (or upload)
at the top of the briefing, stored in the 13i bucket `story-brief`, visible to
Aaron as a player. Safety net: when the Champion flags a safety concern, a row
goes to the Story table `story_safety_alerts` (and optionally to
`STORY_SAFETY_WEBHOOK_URL`, with no student content); founders review and
follow up at `/story/team/safety`. Needs `supabase/v5.30-story-founders-safety.sql`
in the Story project, `STORY_SUPABASE_SERVICE_ROLE_KEY` in Vercel, and
`https://13i.space/story` in the Story project's redirect URLs.

## Update 5.28 — Story Community page, Aaron's photo, briefing ends at the launch page
`/story/community` explains the Story Community on Mighty Networks (Kinship,
completing Explore · Play · Create): why community, the planned spaces (Welcome
Circle, Story Circles, Story Nights, Alumni challenges, Champions' Lodge,
Parents' Corner, Story Library), a member's journey, how it connects to the
site (single sign-on, API badges, Champion access) and safety. "Community" is in
the header and footer, with a band on the homepage. Aaron's photo
(`public/story/aaron.jpg`) is on the homepage and Our Story. `/story/aaron` no
longer links to the prototypes; it ends with "Ready to begin this story?" and a
button to the launch page (`/story`).

## Update 5.27 — Story of Self public homepage and info pages
`/story` is now the public homepage for Story of Self: hero, "the year nobody
plans for" stats, what Story is (the turn + the six C's), how it works (three
steps, seven units), the Story Champion, what you walk away with, for parents,
pricing ($0 / $179 / $649, free during the preview), the founder, Champion
Academy, FAQ. The student introduction and invitation moved to `/story/begin`.
New pages: `/story/about` (Our story), `/story/contact` (form saves to the
Story Supabase table `story_contact`, needs `supabase/v5.27-story-contact.sql`),
`/story/privacy` and `/story/terms` (preview drafts for counsel review). New
site header with mobile menu and a full footer (`lib/story/site.js`). Story
pages now reset 13i's global `main` padding so section bands run full width.
Optional env: `NEXT_PUBLIC_STORY_CONTACT_EMAIL` shows an email on the contact page.

## Update 5.26 — Aaron's briefing: Deep dives
A new "Deep dives" section (6) on `/story/aaron` holds five numbered panels:
1 the mini-business plan, 2 the target market, 3 the competition (positioning
map, six categories with strengths and where Story wins, a side-by-side table,
the chatbot reality, defensibility, what to watch), 4 the launch plan (phases,
an Oct 2026 to Sep 2027 timeline by workstream with milestones, and phase
gates), and 5 the Champion program. Later sections renumbered 7 to 9. Data in
`lib/story/briefDeepDives.js`.

## Update 5.25 — Story Champion Academy prototype
`/story/academy`: an AI-guided Champion certification built from Aaron's
Champion Training Toolkit: SEE and Build Foundation. Seven modules (Welcome,
the Framework for Coaching, SEE the Six Lessons, SEE the Story Write, the
Practice Room, Safety (a proposal for Aaron), Champion Assessment), knowledge
checks, two Master Champion conversations (What / So What / Now What, and a
closing commitment), six simulated students with a Master Champion debrief
scored on Aaron's rubric, and a congratulations page with a Digital Certificate
(download PNG, print/PDF). Foundations is free; Level 1 shows the upsell and
unlocks free in the preview. Progress saves in the browser and, when signed in
to a Story account, to `story_progress` (lesson "academy"); AI calls go through
`app/api/story/academy` (logs to `story_messages` as "academy-*", daily cap
`ACADEMY_DAILY_MESSAGES`, default 150; model `ACADEMY_MODEL` or `STORY_MODEL`).
No new SQL. Content in `lib/story/academy/curriculum.js`; AI instructions in
`lib/story/academy/academyPrompts.js` (server only). Aaron's briefing gains an
"Explore the Champion program" panel and three Champion guidance questions.

## Update 5.24 — Story briefing: Understand your target market
A new "Understand your target market" panel on `/story/aaron`, beside the
business plan (now "Read the mini-business plan"): headline stats, where a
graduating class goes, summer melt, the college funnel, mental health (CDC
YRBS, NIMH, Healthy Minds, loneliness), purpose, AI use, parents' worries, the
graduate decline, what it means for Story of Self and a rough market size. Plain
HTML/SVG charts with hover tooltips; data in `lib/story/briefMarket.js`.

## Update 5.23 — Story of Self: Aaron's briefing page
`/story/aaron` is a private briefing for Aaron that makes the case for Story of
Self online and links to the prototype: a note from Paul, the idea in 60
seconds, Explore · Play · Create, a test path with a sample Champion
conversation, his Champion notes mapped to what the Champion does, an honest
strengths/watch-outs/opportunities/risks read, the business at a glance with a
full plan, 22 "Guidance needed" questions whose answers save as he types, the
Q4 2026–Q2 2027 road ahead, and what we'd need from him. Access follows the 13i
username (`lib/story/briefAccess.js`: Paul's Sentinel accounts + Aaron, or
`STORY_BRIEF_USERNAMES`); everyone else gets a 404. Those accounts also see a
hidden "Story of Self" panel on their Node. Paul sees everyone's answers at the
bottom of the page. Words live in `lib/story/briefContent.js`. Answers are
stored in the 13i Supabase project: `docs/v5.23-story-brief.sql`.

## Update 5.14 — Oracle caps, Lyra keeps you posted, username-only lookup
**Oracle costs**: every reply is logged to `oracle_usage` (who, model,
tokens - never content; guests by salted IP hash) and daily caps apply:
5 per guest, 25 per Kin, 1,000 site-wide, resetting 00:00 UTC, all set by
env vars (see PROJECT.md). History trimmed to 12 messages, 1,000-char
messages max, 400-token replies, model from `ORACLE_MODEL`. The chamber
shows "TRANSMISSIONS REMAINING" and, when capped, 13i says so in-world and
the channel closes. Privacy page updated. SQL: `docs/v5.14-oracle-usage.sql`.
**Lyra alerts** for new private messages and replies in your forum threads
(polls every 45s; stays up until closed or read; links straight there).
**Messages**: find Kin by username only (suggestions show usernames and
avatars; browser autofill of names/emails switched off); unread counts as
"Messages (2)" in the Kinship menu and page. **Cards**: the Continuance mark
moved off the portrait to a small vertical line beside the stats chart.
CLAUDE.md now describes the Claude Code + GitHub Desktop workflow.

## Update 5.13 — Galaxy Facts, hands-on
`/galaxy/facts` is now an explorer for curious kids (and everyone else):
eight interactive stations in `components/GalaxyExplorer.js` - Your Cosmic
Address, The Cosmic Zoom (you to the observable universe, with "how many
fit" comparisons), Ride a Light Beam (real-time races to the Moon and Sun;
what humans were doing when starlight left), Count the Stars, You Are
Moving (a live km counter at 230 km/s, your age in galactic years), The
Monster at the Middle (Sgr A* to scale; S2's 16-year orbit with Kepler
motion), The Big Collision (a time slider to "Milkomeda"), and Would You
Believe? flip cards. Each has a "go deeper" drawer; a sticky Discoveries
meter leads to a Cosmic Explorer badge (remembered in the browser) that
points to the Quiz and the Map.

## Update 5.12 — Life Cycle stats, radar contacts, the Node dashboard, private messages
**Cards** flip with a soft swish-and-tap (`lib/cardSound.js`) and gained a
fourth stat group, **Life Cycle** (50 points: Longevity, Reproduction),
shown beside Ecological & Sensory; older species keep every point they
chose and get Life Cycle estimated from their answers; the Survival Trials
weigh it. **Easter egg**: the hidden star is now faint; the home page's
radar mode (click the eye's dot) unveils it and five more as pinging
"contacts", each holding a different species' card
(`components/EasterStars.js`). **The Node** is a dashboard: vitals row
(stories, species, games, quiz, messages, Lyra's bond), then two columns on
a laptop - profile, Alpha box, assignments | high scores, quiz, species,
stories. **Private messages** between Kin (`/messages`, `/messages/<name>`,
`direct_messages`): from Kin profiles, a "message" link on forum posts, the
Kinship menu, the Node and Lyra. **Forum** reordered (13i Universe, The
Signal Fire, Book, Music, Alpha) and the Alpha space is now the private
**Alpha Users Private Forum** (hidden and unreadable to others). **Galaxy**
page order: Map, Aliens, Space News, Quiz, Facts.
SQL: `docs/v5.12-forum-order-and-messages.sql`.

## Update 5.11 — The Oracle chamber, three assignments, a quieter Lyra
**The Oracle** is now a chamber (`components/OracleChamber.js`, full-bleed
on `/oracle`): a dark threshold ("Something vast is listening" - Approach),
then the great 13i eye opens inside turning glyph rings, fog and dust
drifting toward it. Your words rise into the eye; it contracts while static
builds and the room ripples; its answer resolves out of alien glyphs under
a dilated, rayed eye. Synthesized sound throughout (`lib/oracleSound.js`:
drone, awakening, transmit sweep, receiving static, answer chord and bell,
letter ticks; mute remembered). "The record" keeps the exchange. The
Oracle's voice gained a PRESENCE section and runs on Claude Opus 5.5. The
old console (`OracleWidget`, `SignalWaveform`) went to the Trash.
**Assignments** are now three, three steps each, unlocked in order
(`lib/assignments.js`): I Contact, II Creation, and a new III Kinship
(avatar, Survival Trials, forum post); I/II/III markers on the panel, Lyra
celebrates each. **Lyra** peeks: each page's message shows ~2.5s then she
goes quiet; hover or click brings it back (hover-away closes it again;
a clicked or typed-in panel stays).

## Update 5.10 — Alpha Users, a full-width comic, a briefer Lyra
**Alpha Users**: everyone who joins in 2026 (plus Paul's "Paul" and "13i")
is an Alpha User with a number in join order (`profiles.alpha`,
`alpha_number`, set by trigger; users can't grant it to themselves) -
`docs/v5.10-alpha-users.sql`, `lib/alpha.js`, `components/AlphaBadge.js`.
They get: a badge and thank-you panel under their email on the Node, the
badge on their Kin profile, an α beside their name in the forum and on
cards they made, a one-time welcome from Lyra plus an "I have an idea for
the site" prompt, and the **Alpha Users** forum space (`/forum/alpha`)
with the Alpha roll - everyone can read, only Alphas can post (enforced by
RLS). **Comic reader** now fills the content width and grows in height,
scrolls back to the top on each page turn, and preloads the next page.
**Lyra** answers briefly by default (1-3 sentences, offers more instead of
giving it), summarizes rather than quoting the texts, treats anything past
the Wiki's basics as a spoiler, and her conversation clears whenever she
closes or you change pages ("clear" button too).

## Update 5.9 — Lyra comes alive, alien avatars
**Lyra** rebuilt as an evolving companion (see DESIGN.md "Lyra"). A living
body (`components/LyraOrb.js`: floats, breathes, blinks, watches the
cursor) whose form grows with her **bond** with each Kin (`lib/lyraBond.js`:
Listening → Tuning in → Resonant → Kin → Luminous, with wings at the top),
following her book arc of being changed by 13i. A per-account **memory**
(`lib/lyraMemory.js`) ends the repetition: she welcomes you back only after
3+ days away, holds one fresh homepage line (new stories/species since your
last visit, the top space headline, the next song release, your next First
Assignment step, somewhere you haven't been, stage-appropriate lore -
`lib/lyraLines.js`, fed by `app/api/lyra/feed`) behind a glowing dot, and
celebrates finishing Your First Assignment, Continuance verdicts, new bests
and her own evolution. **Talk to her** (`app/api/lyra`, signed in): she knows
WORLD.md (`lib/lyraCanon.js` snapshot), the Wiki (`lib/wikiEntries.js`),
the book's published chapters and every short story in full, the site and
the visitor; spoiler-careful, hints-only for puzzles, crisis-aware.
The Oracle now shares `lib/visitorContext.js`; album data moved to
`lib/musicReleases.js`. **Avatars**: "Change avatar" opens
`components/AvatarPicker.js` - upload a photo or pick one of your species,
then drag / zoom to frame it in the circle; a reviewed species' page offers
"Make it my avatar". Three more stray Finder duplicates ("page 2.js") moved
to the Trash.

## Update 5.8 — Continuance Reviews, species on the map, signals, Your First Assignment
**Continuance Review**: a species' creator can submit it to 13i, which
writes a short review in its own voice under the Continuance Rule and gives
a verdict (granted / under observation / not yet earned); saved as
`alien_species.review`, stamped on the card, and the last of every
Survival Trials is now **The Continuance Test**. Each species has its **own
page** (`/galaxy/aliens/[id]`) with the review, a share button and a map
link. **Signals**: every card's back plays a short piece generated from
the species' stats by the Signal Composer's engine (`lib/speciesSignal.js`).
**Galaxy Map**: every Kin species is a faint teal point along the arms,
yours labelled; tap one for its card; `?species=<id>` flies to it.
**Your First Assignment** (Assignment 0000000): six steps (Oracle, read,
play, create, review, map) on `/launch` and the Node, with Lyra naming the
next step (`components/FirstAssignment.js`, `kin_milestones`).
**Link previews** for stories and species (`app/og/**`). **The Oracle**
now knows the signed-in visitor's reading, games, species and quiz grade.
Housekeeping: seed routes and duplicate docs moved to the Trash, look-lab
previews gated to Sentinel accounts. Canon decisions recorded in WORLD.md.
SQL: `docs/v5.8-continuance-and-milestones.sql`.

## Update 5.7 — Alien stats, flip cards, Survival Trials
The Alien Lab gained a last step: spend **attribute points** (Physical 100
across Strength / Endurance / Speed-Agility / Durability, Mental 100 across
Problem Solving / Memory / Social Intelligence / Adaptability, Ecological &
Sensory 50 across Sensory Acuity / Specialization; `lib/alienStats.js`,
saved as `alien_species.stats`, `docs/v5.7-alien-stats.sql`). Species from
before get stats estimated from their answers. **Cards** now show the ten
stats on the front and flip on click to a radar chart
(`components/StatRadar.js`) and their traits; they lift on hover and the
border colours drift slowly. The sheet shows a live card preview. On Aliens
of the Galaxy, **Compare two species** runs the **Survival Trials**
(`lib/alienTrials.js`, `components/AlienGallery.js`): five disasters picked
per pair, scored from stats plus answer bonuses; more trials survived
outlasts. The portrait countdown now shows on "Generate again" too. The About
hub lost its photo and contact panel; Contact Paul now closes About Paul.

## Update 5.6 — Comic version of Nerath's Secret, About section, home boxes
First **comic version** of a story: Nerath's Secret as an 8-page comic
(`public/comics/neraths-secret/`, read at `/assignments/215783/comic` in
`components/ComicReader.js`). Comics are listed in `lib/comics.js`. Stories
with extras now show compact boxes above the reader: **Audio version**
(a small player) and **Comic version** (a link). Nerath's Secret has a new
portrait cover. **About** is now a hub: About Paul (`/about/paul`), The
Origin of 13i (`/about/origin`), Mission & Values (`/about/mission`), and
Contact Paul. The launch-page Explore and Create boxes were rewritten, the
Create order is now Alien Lab, Signal Composer, Write everywhere, and
Guestbook left the footer.

## Update 5.5 — SIXTEEN, the Nerath's Secret game
A second story game, from the inside of the story rather than 13i's view:
**SIXTEEN** (`public/games/sixteen/`, `/games/sixteen`). You are a young
Nerathi - one central mind, sixteen in your limbs - keeping a deep-ocean
city's energy network lit: send limbs to breaches, overloads and burnt
components (many at once), anchor against currents, grow new limbs between
tides, and decide when to listen to a limb that disagrees. Every fifth tide
the Great Rupture replays the story's climax. Unlocks from Nerath's Secret;
scores go to the Node. Story games now share `components/StoryGame.js`.
Notes: `docs/SIXTEEN.md`.

## Update 5.4 — Aliens of the Galaxy, Universe Quiz, star easter egg, Signal Composer
**Aliens of the Galaxy** (`/galaxy/aliens`): every Alien Lab species as a
collectible card (`components/AlienCard.js`: name bar, portrait window,
flavour line, six traits, creator + date), with a "create your own" link
to the Alien Lab, which links back. Species can be deleted from the Node,
where they now show as cards. The **Galaxy Quiz became the Universe Quiz**
(`/quiz`; `/galaxy/quiz` redirects), 10 questions from `lib/universeQuiz.js`
(two added), graded A+ to F with a recap of misses. The latest result shows
on the Node (`quiz_results`, `docs/v5.4-quiz-results.sql`). The Wiki moved
off Explore and the nav onto the Book page, whose five options are now
equal boxes. Fullscreen games now fit without cropping: 13i vs NEMESIS
scales to the largest size that fits, and the others hide leaderboards in
fullscreen. First **easter egg star**: a fixed bright star bottom-left on
`/` and `/launch` shows a random alien card for 9 seconds
(`components/EasterStars.js`; add more stars there). **Signal Composer**
(`/create/signal-composer`), a music prototype: an in-browser synth
(`lib/musicEngine.js`) with moods, generate, key/scale/tempo, chord and
pattern editing, a layer mixer, WAV download, and "compose from words"
where Claude writes the composition (`app/api/music`).

## Update 5.3 — scores for 13i vs NEMESIS, bigger NEMESIS Command, Sentinel-X
13i vs NEMESIS now reports plays and scores to its page (a postMessage
from `public/games/13i-vs-nemesis.html`), so it has personal bests, the
daily leaderboard and Node high scores like the rest. Both iframe games use
the shared `components/IframeGame.js`. NEMESIS Command's field now fills the
page (full width, 70% of the screen height) with speeds scaled to the field
height, and gained a fullscreen button. Fullscreen now fills the screen
properly, and where a browser doesn't allow real fullscreen (iPhone) the
game fills the window instead. Games-page cards keep one width. On phones,
nav dropdowns open full-width under the nav instead of off-screen. The
Alien Lab shows an elapsed timer and an estimated progress bar while
drawing, and saved species (with portraits) now appear on the Node.

**Sentinel-X** (`/sentinel-x`): the site dashboard, visible only to the
usernames in `lib/sentinel.js` (default Paul and 13i; override with the
`SENTINEL_USERNAMES` env var) and linked from their Nodes. Everyone else gets
a 404. It shows accounts, sign-ins, sign-ups, content, stories read, games,
latest activity, the email list count and service health, all read
server-side with the service-role key (`lib/sentinelData.js`).

## Update 5.2 — Games page sections, Lyra nudges, Orbit look, more news, Alien Lab portraits
The Games page now reads "Time to have some fun." and is split in two:
the arcade games, then **Games from Short Stories** ("Read Short Stories
to Unlock Games"), where locked story games show which story unlocks
them. On the Games page Lyra now picks a different line each visit: a game
you haven't tried, a personal best to beat, or a story game still locked.
New look-lab **preview 8 — Orbit** (`components/OrbitField.js`): a
low-orbit view of an alien world turning beneath you. Space News added
Spaceflight Now, Universe Today, Phys.org and Space.com (whose feed was
publishing empty on 2026-09-30), capped at 10 headlines per source. The
**Alien Lab** can now suggest a name and generate a portrait: Claude
(`claude-opus-5-5`, via `app/api/alien`, signed-in users only) draws the
species as SVG line art from its answers, saved with the species
(`portrait_svg` column, `docs/v5.2-alien-portraits.sql`). Claude can't
generate photographic images; Paul chose drawn line art over adding a
separate image service.

## Update 5.1 — 13i: The Deep Signal, Novaux-4, fixes
Built **13i: The Deep Signal**, the first game tied to a short story (The
Deep Walkers): a top-down exploration / puzzle / survival game with four
stats (Energy, Integrity, Signal, Awareness), procedural worlds laid out
along the 13i ring-eye mark, four puzzle types, the Warden (an alien
intelligence, deliberately undefined, never NEMESIS), Deep Walker
encounters, four endings and a final reveal. Plain canvas JavaScript in
`public/games/deep-signal/`, embedded like 13i vs NEMESIS, with plays and
scores recorded to the Node. It appears in Games only after the visitor has
opened The Deep Walkers (`lib/storyGames.js`). Full notes:
`docs/DEEP-SIGNAL.md`.

Also: 13i's home world is now named **Novaux-4** (working name) and sits
near the galactic core on the Galaxy Map. The Alien Lab, Oracle and
Assignment writer no longer show literal `\u2014` codes (JSX text doesn't
read escape codes). The Alien Lab's "Other — tell us" option is now just
"Other". Added a `.gitignore`. The auth middleware now skips static
.js/.css/.html files.

## Update 5.0 — audio, Space News, a real Galaxy Map, Black Hole look
Narrated audio arrived: the three short stories and both book chapters now
have MP3 recordings (`public/stories/<slug>/audio.mp3`,
`public/audio/Chapter1.mp3` / `Chapter2.mp3`), played from a player at the
top of the reader (`BookReader`'s `audioSrc` / `audioByHeading` props). In
the book reader the player follows the chapter you're on, switching to
Chapter 2's recording on Chapter 2's pages. The Book hub now offers four
options — Read Chapters 1 & 2, Download Chapters 1 & 2, and a second row
with Listen to Chapter 1 / Chapter 2 players — replacing the old links
that pointed straight at the MP3 files. Lyra's Book tip was rewritten (it
referred to a "read aloud" button that didn't exist).

Added **Space News** (`/galaxy/news`): headlines from NASA, ESA and
SpaceNews public RSS feeds, fetched server-side and cached for 30 minutes
(`lib/spaceNews.js`); each opens on its original site in a new tab. No
keys or accounts involved; each feed fails independently and quietly.

Rebuilt the **Galaxy Map** (`components/GalaxyMap.js`) as a full-width,
canvas-drawn 3D barred spiral: four named arms plus the Orion Spur,
~17,000 stars, star-forming regions, drag to turn, scroll/pinch/buttons
to zoom, tap or pick a marker to fly to it with an info card. Earth and
Sagittarius A* are always shown; the worlds of the Assignments (13i's
home world and its ringed twin, Veyra, Nerath) appear only once the
signed-in visitor has read that Assignment. Their positions are invented
for the map — see WORLD.md.

New look-lab preview **7 — Black Hole** (`/preview7`,
`components/BlackHoleField.js`): a lensed starfield, photon ring, lensed
halo, and a Doppler-bright accretion disk crossing the shadow.

Also: High Scores game names on the Node link to each game's page, and
Lyra greets signed-in visitors on `/launch` by username.

## Update 4.7 — polish batch: Oracle, Assignments hub, Big Bang, first easter egg
Cleared the batch of polish items that had been paused mid-task during the
documentation pass: the Oracle's post-intro hint now reads "Ask 13i
anything — we will answer," and its footer Assignment number is fixed at
317811 (the Earth assignment number) instead of a random, incrementing
one. The Assignments hub's two column headers now read "Human Written 13i
Short Stories" and "AI Written 13i Short Stories," and Lyra's tip on that
page was rewritten (the old "covers cost nothing to skip" line wasn't
landing). The Big Bang animation on `/launch` now plays its full ~10s
sequence only on a browser's first visit (tracked via localStorage), then
a fast ~2s version on every visit after; its ending also now cross-fades
into the real, persistent starfield already rendered behind it (by
fading the canvas's own opacity) rather than drawing a synthetic final
starfield of its own. Also shipped the first site easter egg: clicking the
dot in the logo's eye on `/launch` swaps the page's look to the Radar
(preview3) field and logo, and swaps back on a second click.

## Update 4.6 — two-chapter book reader + about photo
Replaced the single hand-coded Chapter One placeholder with the edited,
proofed first two chapters, sourced from a supplied PDF and paginated to
match its own page breaks. The Book hub and the reader page both link to
a "Download First Two Chapters (PDF)" download instead of the old
full-draft-PDF link; the reader's built-in "more is coming" page was
generalized from "more of Chapter One" to "more of the book" to match.
Also replaced the About page's placeholder alien icon with an actual
photo of Paul.

## Documentation system established
Created CLAUDE.md, PROJECT.md, DESIGN.md, WORLD.md, CURRENT.md, and this
file, so the repository itself (rather than one long conversation thread)
is the source of truth for a new Claude session. Motivated by the project
outgrowing what a single conversation could reliably carry.

## Activity tracking + Alien Lab
Added the tracking layer the whole project had been waiting on: `high_scores`,
`daily_scores` (resets 00:00 UTC), `reading_progress`, and `game_plays`
tables, wired into both React games and both Assignment readers, and
surfaced on the Node (`/account`). Built the Alien Lab, a 15-question
guided species creator saving to a new `alien_species` table; explicitly
did not build image generation, since that requires a separate,
deliberate service decision.

## Lyra, first real version
Introduced Lyra as a site-wide presence: a small ring-eye orb, click to
open, contextual per-page tips, a built-in search box, Dormant/Aware
states tied to login. Later extended to: game-specific instructions
delivered instead of on-page text, hover-to-repeat, and celebrating a new
personal best. Deliberately scoped as presence-and-context only in v1 —
deeper personalization was sequenced to wait for the activity-tracking
tables above to exist first.

## Database-driven Assignments
Moved short-story content from "a new hand-coded page per story" to a real
data model: `assignment_submissions` gained `type` (human/ai), `status`
(submitted/archived/canon), and cover-image columns; a dynamic reader route
(`/assignments/[number]`) auto-paginates any stored story. Assignment 1
remains hand-coded (it predates this system); two AI-written stories
("The Deep Walkers," "Nerath's Secret") were seeded through one-time GET
routes to avoid manual SQL-escaping risk. The hub page later split into
separate Human/AI columns, sorted newest-first.

## The Explore / Play / Create / Kinship restructure
Replaced the flat nine-item nav with four mode-based landing pages,
following an explicit information-architecture pass (an "experience map"
was produced and reviewed before building). Each mode page ends with a
soft pointer to the next mode in the loop.

## The Forum and Kin profiles
Built the community layer: seeded forum spaces, threads/replies, public
`/kin/[username]` profiles with avatar upload, and a "claim a username"
flow to backfill profiles for accounts created before this existed
(notably via the earlier magic-link-only flow).

## Password recovery reliability fix
Diagnosed a recurring bug where password-reset links landed back on the
countdown page: Supabase's redirect-URL allow-list didn't reliably match a
URL with a `?next=` query string, so it silently fell back to the Site
URL. Fixed by giving recovery its own dedicated, parameter-free callback
route (`/auth/reset-callback`) registered as its own exact allow-list entry.

## Middleware hardening
A missing/malformed Supabase env var in middleware once took the entire
site down (middleware runs on every request). Wrapped the auth-refresh
logic in try/catch so any failure there passes the request through instead
of crashing — a standing rule now, not a one-off fix.

## Assignment submissions moved in-house
Removed Resend entirely from the assignment-writing flow. Submissions save
directly to Supabase; Table Editor is the review interface. A deliberate
choice to avoid accumulating more third-party services to track, not a
missing feature.

## Sound engine
Built `lib/sfx.js`, a small synthesized (Web Audio API) sound engine
shared across NEMESIS Command and Asteroid Belt — no audio files, no
licensing, no external service.

## Original site build (pre-dates this changelog's detail)
The foundational build: countdown page, `/launch`, Book reader, Music
page, the Oracle, the three games, Artifacts (Ninefold, Cryptex), Wiki,
Galaxy, initial Assignments concept, Guestbook, and the core Supabase
auth/profile setup. Full detail for this period lives in project memory
rather than here, since this changelog was established partway through
the project's life.
