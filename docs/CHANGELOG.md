# CHANGELOG.md — Significant Project History

Major features, architectural decisions, and significant fixes only — not
every small edit. Newest at the top.

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
