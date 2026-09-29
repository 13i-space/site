# CHANGELOG.md — Significant Project History

Major features, architectural decisions, and significant fixes only — not
every small edit. Newest at the top.

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
