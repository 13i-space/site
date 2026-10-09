# CURRENT.md — Snapshot of Where Things Stand

Update this file (briefly) whenever a significant change lands. This is a
snapshot, not a history — see CHANGELOG.md for the record over time.

## Working right now
- Update 5.66 (no SQL): cheaper models per call (env-overridable), 3 Lab
  drawings/day per Kin, reset links that land on the countdown now reach
  the reset form, show-password eyes, skip in the Survival Trials, Lab
  polish. Check one real password reset on the first deploy.
- Update 5.65 (no SQL): Signal Composer v2, the Alien DJ Controller
  (components/AlienDeck.js + components/deck/*, lib/deck/*). Tested in a
  cloud browser: playback, sync, transitions, pads in all four modes, drops,
  brake, beat FX, studio edits, every style rendered to WAV in both
  tunings (no clipping). Listen on real speakers on the first deploy - the
  mix balance is tuned by measurement, not by ear.
- Update 5.64 (no SQL): Lab order (questions -> points -> its look + free
  description -> name -> generate), Randomize / All to zero, name required,
  scroll to the lab, lab sounds, steady phone bubble, side-4 roaming
  creature, auto solid repaint for Sentinel-X, Aliens of the Galaxy in Games.
- Update 5.63 (optional SQL docs/v5.63-solid-portraits.sql, for repainting
  old portraits): the Alien Lab rebuilt - live lab scene with a six-armed
  Ixxen (components/LabScene.js), a visible transformation while the
  species is drawn, detailed Qeth and Ilu, the card preview as a live feed
  of the tank, Submit to 13i = save + assessment, gallery newest-first with
  ?new=<id> leading, side-4 vanishing fix, solid-colour portraits with a
  line-art switch and a Sentinel-only repaint. Tested locally with a stand-in
  portrait (no API in the cloud session): check one real generation and one
  real repaint on the first deploy.
- Update 5.62 (no SQL): songs fixed and the first extended remix. All 36
  songs and the album covers were on the old Tempo Goat WordPress site and
  vanished when the new tempogoatstudios.com replaced it (Oct 7). They now
  live on 13i.space: songs in public/audio/signal/<name>.mp3 (file names =
  the names in lib/musicReleases.js), covers in public/covers/albums/.
  /api/track/<name>.mp3 now just redirects there. "Apprehension (Megan
  Halloween Remix)" sits beside the Apprehension video on /music
  (public/audio/apprehension-megan-halloween-remix.mp3; more remixes go in
  the `remixes` list in lib/musicReleases.js).
- Update 5.61 (needs docs/v5.61-spacecore-survival.sql): the SpaceCore
  survival update - Lyra stays closed, crew needs + blackouts, power grids,
  dust storms, research, borer paint, drag-building, Season projects after
  the Launch Facility. Tested in a local harness (no database in the cloud
  session): check a real save, a real dust storm and other Kin's colors on
  the first deploy.
- Update 5.60 (no SQL): Lyra's welcome and the become-Kin first
  assignment (components/LyraWelcome.js). The congratulations step needs a
  real sign-up to see: check it on the first deploy.
- Update 5.59 (no SQL): Alien Lab embryo/anomaly/Ixxen + Survival Trials
  CTA; Survival Trials tournament (/galaxy/aliens/trials) with Continuance
  Index on cards; Galaxy Map full screen, menus, black hole, detail, hum;
  Galaxy hub look; Space News layout; Black Hole sound; Cryptex levels;
  hidden card fixes. Tournament tested on a test field shaped like real
  rows - the cloud session can't reach Supabase: check it with the real
  species on the first deploy. The 17 Lab questions are unchanged (Paul
  will review them separately).
- Update 5.58 (no SQL): new Quiz, Games arcade, Artifacts hub, alien
  Cryptex with sound, the Wish Engine (replaces the Ninefold), the
  Listening Well. Artifact sounds are made live (lib/alienSound.js).
- Update 5.57 (no SQL): beta list on Sentinel-X (no email), monthly
  video (13th) + extended version (26th), launch hero trimmed, About in the
  mode look, clickable orbit badges, WebGL Oracle eye, new Book, Write an
  Assignment, Forum/Kinbook/Messages rooms. The forum and messages pages
  could not be rendered in the cloud session (no database): check them on
  the first deploy.
- Update 5.56 (needs docs/v5.56-api-usage.sql; optional env
  CLAUDE_MONTHLY_BUDGET_USD, CLAUDE_CREDIT_USD, CLAUDE_CREDIT_SINCE): Season 1
  Week 5 (The Borrowed Seconds + RUBATO), Sentinel-X 2027 calendar + next
  seven days, Claude usage + site version on Sentinel-X, About > Kinship.
  New weeks paused after 5 (Paul, Oct 2026). Bump SITE_VERSION in
  lib/version.js with each update.
- Update 5.55 (needs docs/v5.55-beta-and-kinbook.sql + RESEND_API_KEY, see
  docs/BETA-SETUP.md): beta sign-up, Galactic Gazette, Season 1 for the beta
  (4 weeks built, incl. The Sea of Glass + PRISM), 3D Oracle eye, new mode
  pages, Music deck + Apprehension video, The Black Hole, four-sided Alien
  Lab cards. See CHANGELOG. Built and checked in a cloud session with no
  access to the music host or news feeds: album covers, songs and feed
  pictures were never seen loading - check /music, /music/apprehension and
  /galaxy/news on the first deploy.
- Update 5.52 (no SQL): SpaceCore launch countdown + staging, smooth orbit,
  Lyra close/side-switch, Fabricator cancel, Airlock as equipment, Move tool
- Update 5.42 (needs docs/v5.42-spacecore-saving.sql): SpaceCore version check,
  save confirmations, replay the landing
- Update 5.40 (needs docs/v5.40-spacecore-v2.sql after 5.39): SpaceCore v2:
  bigger world, materials, Fabricator, borer battery/power. See docs/SPACECORE.md
- Update 5.39 (needs docs/v5.39-spacecore.sql): SpaceCore at
  `/create/spacecore`, the shared Mars building game (Create, not Games),
  with a SPACECORE panel on the Node. See docs/SPACECORE.md
- Update 5.32 (needs supabase/v5.32-story-waitlist.sql in the Story project):
  voice notes in the Champion chat, the Lighthouse founders' dashboard at
  `/story/team`, the launch list at `/story/waitlist` + homepage band
- Update 5.31 (no new SQL): Life Timeline (`/story/timeline` + Lesson 2),
  animated odds in Lesson 1, Story of Self book PDF (Story Write + example)
- Update 5.30 (needs supabase/v5.30-story-founders-safety.sql in the Story
  project + STORY_SUPABASE_SERVICE_ROLE_KEY): founder preview (all lessons
  unlocked, `/story/example`), one-login handoff from `/story/aaron`, Paul's
  note recorder, safety alerts + `/story/team/safety`
- Update 5.25: Story Champion Academy prototype at `/story/academy`
  (needs a Story account for the AI parts; no new SQL)
- Update 5.23 (needs docs/v5.23-story-brief.sql in the 13i project):
  Aaron's private Story of Self briefing at `/story/aaron`, linked from his
  Node ("Aaron" is in `lib/story/briefAccess.js`, Update 5.33)
- Full auth: email/password signup+login, magic-link fallback, password
  recovery via its own dedicated callback route
- Kin profiles: username, bio, avatar upload, public `/kin/[username]` page
- Forum: four seeded spaces, threads, replies
- Guestbook
- The Oracle (Anthropic API connected, billing active); opening hint reads
  "Ask 13i anything — we will answer," and the footer's Assignment number
  is fixed at 317811 (the Earth assignment number), not randomized
- Book reader (two edited chapters) with a narrated-audio player that
  follows the current chapter, and a two-chapter PDF download; the Book hub
  offers Read / Download / Listen to Chapter 1 / Listen to Chapter 2
- Narrated audio on all three short stories (compact "Audio version" box at
  the top of the reader). Comics were removed from the universe in Update
  5.37 (Paul's call); the code-drawn covers replaced the comic art
- About hub: About Paul (ends with Contact Paul), The Origin of 13i, Mission & Values
- Update 5.14 (needs docs/v5.14-oracle-usage.sql + ORACLE_IP_SALT in
  Vercel): Oracle usage log and daily caps, Lyra message/reply alerts,
  username-only message lookup, unread counts in Kinship
- Update 5.13: Galaxy Facts rebuilt as eight interactive stations with
  drill-downs and a Cosmic Explorer badge
- Update 5.12 (needs docs/v5.12-forum-order-and-messages.sql): card flip
  sound, Life Cycle stats, radar-revealed star contacts, Node dashboard,
  private messages, forum reorder + private Alpha forum, Galaxy order
- Update 5.11: the Oracle chamber with sound; three sequential Kin
  assignments (Contact, Creation, Kinship); Lyra peeks for 2.5s and
  returns on hover
- Update 5.10 (needs docs/v5.10-alpha-users.sql): Alpha Users (2026
  joiners + Paul's accounts) with numbers, badges and the Alpha Users forum
  space; full-width comic reader; briefer, spoiler-careful Lyra whose chat
  clears on close or navigation
- Update 5.9: Lyra rebuilt (living orb with bond stages, memory, fresh
  homepage lines, celebrations, canon-aware chat at app/api/lyra), and
  avatars from a photo or a species with pan/zoom framing
- Update 5.8 (needs docs/v5.8-continuance-and-milestones.sql): Continuance
  Reviews, species pages with link previews, species signals, Kin species on
  the Galaxy Map, Your First Assignment on /launch and the Node, a
  visitor-aware Oracle, look-lab previews gated to Sentinel accounts
- Alien Lab species have ten point-bought stats (needs docs/v5.7-alien-stats.sql;
  older species show estimates); flip cards; Survival Trials compare mode on
  Aliens of the Galaxy
- Galaxy: 3D Galaxy Map with story worlds unlocked by reading, Facts,
  Quiz, and Space News (NASA/ESA/SpaceNews RSS, cached 30 min)
- Assignments: hand-coded canon story (0000001) + two database-driven
  AI-written stories (0000087, 0215783), a working writer with save-progress
  drafts, human/AI split columns on the hub ("Human Written 13i Short
  Stories" / "AI Written 13i Short Stories"), sorted newest-first
- Five games: NEMESIS Command, Asteroid Belt, 13i vs NEMESIS (iframe to
  static HTML), 13i: The Deep Signal (unlocked by The Deep Walkers; see
  docs/DEEP-SIGNAL.md) and SIXTEEN (unlocked by Nerath's Secret; see
  docs/SIXTEEN.md). All have sound, personal bests,
  a daily leaderboard (resets 00:00 UTC), Node high scores and
  Lyra-delivered instructions
- Sentinel-X (`/sentinel-x`): site dashboard for Paul's two accounts only
- Aliens of the Galaxy (`/galaxy/aliens`): public card gallery of species
- Universe Quiz (`/quiz`): 10 questions, graded, latest result on the Node
  (needs `docs/v5.4-quiz-results.sql`); swap quizzes in `lib/universeQuiz.js`
- Signal Composer (`/create/signal-composer`): in-browser music prototype
- The Alien Lab: 17-question guided species builder, saves to the Node;
  Claude suggests a name and draws an SVG line-art portrait on request
  (`app/api/alien`, signed-in only; needs `docs/v5.2-alien-portraits.sql`
  run to save portraits)
- Activity tracking: reading progress, game plays, high scores, daily
  scores all recording to Supabase, displayed on the Node (`/account`)
- Lyra: site-wide presence, per-page contextual tips (Assignments hub tip
  now reads "Click on a story and explore a new chapter in 13i's
  assignments"), game-instruction delivery, hover-to-repeat, personal-best
  celebration, built-in site search
- Big Bang animation on `/launch`: plays its full ~10s sequence the first
  time a browser visits (tracked via localStorage), then a fast ~2s
  version on every visit after. Its ending now cross-fades — the canvas's
  own opacity fades out rather than drawing a synthetic final starfield,
  revealing the real, persistent starfield already rendered behind it by
  `ThemedBackground`
- First easter egg: on `/launch`, clicking the dot in the logo's eye
  swaps the page's look to the Radar (preview3) field and logo; clicking
  again swaps it back. Local to that page only, not a site-wide theme
  change
- Eight look-lab preview themes (1–8, plus 13 Big Bang) and the live
  "Signal" look; `/preview` is a working index of all of them
- Four-mode nav (Explore/Play/Create/Kinship) with dropdowns, replacing the
  old flat nine-item nav
- Interactive Assignments: Nerath's Secret as a branching visual novel (you
  are 13i, five endings, one canon), at `/assignments/215783/interactive`

## Currently being worked on / most recently completed
Update 5.41: Alpha feedback batch (see CHANGELOG) — story games need sign-in,
Interactive Stories progress bar, Lyra unread-mail fix, game tweaks across
all six games. The Deep Signal "ship vanishes" glitch was never reproduced in
testing; 5.41 hardens every likely cause, so ask testers to report if it
happens again (and what was on screen).
Update 5.35/5.36: Season 1, Week 1 (The Quiet Moon) bundle; docs/SEASONS.md.
The story ships with the site (`lib/archiveStories.js`), so it reads without
the seed visit. Audio for it: Paul, later.
Update 5.34: Interactive Assignments, starting with Nerath's Secret
(docs/INTERACTIVE.md). Needs `docs/v5.34-interactive-assignments.sql` run in
Supabase for cross-device records + Kin stats (works without it).
Update 5.5: SIXTEEN, the Nerath's Secret game (docs/SIXTEEN.md).
Update 5.4 (see CHANGELOG): Aliens of the Galaxy + delete on the Node,
Universe Quiz, Wiki on the Book page, fullscreen fitting, the first
easter-egg star, Signal Composer prototype.
Update 5.3 (see CHANGELOG): 13i vs NEMESIS scores, bigger NEMESIS
Command, fullscreen fixes, mobile nav, Alien Lab timer + species on the
Node, Sentinel-X.
Update 5.2 (see CHANGELOG): Games page sections, Lyra's Games nudges,
preview 8 (Orbit), more Space News sources, Alien Lab names + portraits.
Update 5.1 (see CHANGELOG): 13i: The Deep Signal, Novaux-4, the Alien Lab
text fixes, .gitignore. Before that, Update 5.0: Book/story audio, Book
hub options, Space News, the rebuilt Galaxy Map, preview 7 (Black Hole). Edited directly in
the local checkout by a Claude Code session and committed/pushed via
GitHub Desktop, rather than handed off as zips.

## Known issues
- The Alien Lab's Claude calls (name + portrait) were never run against the
  real API during Update 5.2 (no key on the dev machine). The first real
  portrait is the test, including how long it takes. Each portrait is one
  Claude Opus 5.5 request (roughly 5–15 cents)
- `.DS_Store` files were committed before the `.gitignore` existed; the
  new ignore rule stops new ones but doesn't remove the old ones from Git
- The Deep Signal hasn't had a full human playthrough or a real-phone
  touch test yet, and its sound was never actually heard during testing
- Update 5.0 was written without Node.js available locally, so it was
  never run through `next build` before pushing. The Galaxy Map, Black
  Hole preview and Space News parser were exercised in a browser test
  harness; the Book/audio changes weren't. Check the Vercel build log and
  each new page on first deploy
- The "Download Chapters 1 & 2" option serves the existing PDF; there is no
  separate ebook (.epub) file yet
- The Big Bang's easter egg (radar toggle) and its crossfade ending have
  not yet been tested on a live deploy — worth a quick check on first use,
  particularly that the real starfield underneath is actually visible
  through the fade on all browsers

## Do not change without asking
- The Explore/Play/Create/Kinship nav structure and the four mode landing
  pages — this was a deliberate, recent restructuring
- Any existing `/previewN` route's content — always add a new number for a
  new design, never overwrite
- The dedicated `/auth/reset-callback` route and its no-query-string
  design — this exists specifically because a more "clever" version with a
  `?next=` param proved unreliable against Supabase's redirect allow-list
- Assignment numbering convention: canon/AI-written stories use specific,
  deliberately-chosen numbers (1, 87, 215783); human draft submissions get
  a random number in the 50,000–250,000 range at write-time
