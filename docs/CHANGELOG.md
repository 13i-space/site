# CHANGELOG.md — Significant Project History

Major features, architectural decisions, and significant fixes only — not
every small edit. Newest at the top.

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
