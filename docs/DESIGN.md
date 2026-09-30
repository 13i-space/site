# DESIGN.md — Visual & UX Design Guide for 13i.space

Preserve existing decisions in this file unless Paul explicitly asks to
change them. This is a record of what's been decided, not a proposal.

## Core aesthetic principle
Restrained and sophisticated. **Avoid "generic sci-fi dashboard" or
video-game-UI styling** on the live site — this has been stated explicitly
as a thing to avoid. Look-lab preview pages (`/preview1` onward) are the
sanctioned place to push bolder, more experimental directions (a jet
cockpit, a control panel, etc.) — that boldness is not meant to leak into
the actual live site without a deliberate decision to adopt it.

## Brand marks
- **Logo**: brushed-steel "13" + a ring/eye/humanoid "i" mark. The eye's
  position within the logo image is `--eye-x: 74.8%`, `--eye-y: 29.2%` —
  verified via pixel analysis; don't re-derive this.
- **The ring-eye mark alone** (stem + open ring + dot) is the recurring
  "13i" shorthand used everywhere a full logo doesn't fit: the favicon, the
  ship design in every game, life/lives icons, Lyra's own orb.

## Color palette
| Token | Hex | Use |
|---|---|---|
| Navy background | `#0A0B1C` / `#14163A` | base background |
| Lavender accent | `#B9C0FF` / `#8B95F6` | primary interactive/accent color |
| Warm accent | `#E8CFC0` | secondary accent, "alive"/highlighted states |
| Muted text | `#6E76B8` / `#565B8F` | secondary text, labels |
| Danger/rust | `#C97B6E` | damage, warnings, critical states |

## Typography
- **Fraunces** (italic) — display/wordmark, headings, anything that should
  feel handwritten-but-considered
- **JetBrains Mono** — data, labels, "13i's voice" (mono type consistently
  signals machine/collective speech throughout the site)
- **Inter** — body text, UI copy

## Layout conventions
- `.panel` — the standard content-box style (translucent navy, thin
  lavender border, 4px radius)
- `.launch-card` — a `.panel` variant with corner-fold decoration and a
  hover highlight (border brightens, slight lift, background darkens
  further) — used for every card-grid entry site-wide
- `.book-page` — a slightly different shade (between `.panel` and the raw
  background) for reader content specifically, so a reading surface reads
  as its own object

## Navigation
Primary nav is the **four modes** — Explore, Play, Create, Kinship — each
with a dropdown to its actual pages, plus the Node/Login slot. This
replaced an earlier flat nine-item nav. Individual pages (Book, Music,
Oracle, Forum, Games, Artifacts, Wiki, Galaxy, Assignments, Guestbook) are
reached through a mode's dropdown or landing page, not as top-level items.

## The Explore / Play / Create / Kinship structure
Not rigid content categories — **what the visitor is doing**, not what
type of content it is. A piece of content can belong to more than one mode.
- **Explore**: discovering existing content — Book, Music, Short Stories,
  Galaxy. (The Wiki lives on the Book page since Update 5.4.) Music stays here even once music generation exists in
  Create, because listening is discovery, not creation.
- **Play**: interacting with the universe — Oracle, Games, Artifacts, the
  Galaxy Quiz (dual-listed with Explore).
- **Create**: expressing yourself inside the universe — the Alien Lab,
  the Signal Composer, Write an Assignment (in that order, in the nav
  dropdown and on the Create page alike).
- **Kinship**: connecting with other people — Forum, Guestbook, Kin
  profiles. Deliberately more than "community" — meant to develop its own
  language and culture over time, not be treated as generic social
  functionality.

The footer carries About and Contact only (Guestbook lives in Kinship).
`/about` is a hub of three pages — About Paul, The Origin of 13i, Mission &
Values (shared layout: `components/AboutProse.js`); Contact Paul sits at the
bottom of About Paul. The Origin and Mission texts are Paul's, lightly edited in his voice.

Each mode's landing page ends with a one-line pointer to the next mode in
the loop (Explore→Play→Create→Kinship→Explore), intended as a soft,
optional nudge, not a gate.

**No karma, points, or public leaderboard-style scoring for social
content.** High scores and daily leaderboards are fine for games (that's
competition, not social validation); the Forum/Kinship side of the site
deliberately has no upvote/karma equivalent.

## Animation principles
- Motion should feel like **instrumentation**, not decoration — a pulse, a
  sweep, a scanline reads as "this thing is alive/measuring something,"
  not just movement for its own sake.
- Respect `prefers-reduced-motion` on anything with a persistent looping
  animation.
- Sound is synthesized in-browser (`lib/sfx.js`), never a licensed sample
  or an external audio file — this is a deliberate "no new service" choice
  as much as an aesthetic one.

## Look-lab preview system
Every alternate visual theme gets its own permanent, numbered route
(`/preview1`, `/preview2`, ...) and an entry in the `/preview` index —
**never overwritten, never renumbered**. As of this writing:

| # | Name | Concept |
|---|---|---|
| — | Signal | **Live site-wide look.** Starfield + expanding ripple from the logo's eye |
| 1 | Constellation | Drifting connected points, orbital rings |
| 2 | Cockpit | Spacecraft control panel — HUD lines, scrolling telemetry |
| 3 | Radar | Rotating sweep with fading blips (nods to NEMESIS's perception) |
| 4 | Fibonacci | Golden-angle spiral (ties to the book's "Fibonacci Signal") |
| 5 | Hubble | Painterly nebula field, spiked stars |
| 6 | Jet | Fighter cockpit — each content box its own instrument panel (radar/comms/switches/gauge) |
| 7 | Black Hole | Lensed starfield, photon ring, Doppler-bright accretion disk; the hole as the eye |
| 8 | Orbit | Low-orbit view of an alien world turning beneath you — deserts, basalt seas, a rift, cloud, night side |
| 13 | Big Bang | Origin-moment animation — see below |

Switching the *live* site's look is a one-line edit in `lib/theme.js`.

## The Big Bang sequence
A point-of-light-to-starfield animation, conceptually the origin moment of
the 13i universe. Currently wired to play on every visit to `/launch`
(intentionally simple "for now," per Paul — the more selective version
below is the planned next step, not yet built):
- **Not yet implemented**: first-visit-only gating (should play at full
  length once per browser, then a fast version on repeat visits), and the
  live shared trigger at countdown-zero for anyone present at launch.
- The burst originates from the exact pixel position the logo's eye will
  occupy once it resolves in, so the animation reads as "this began at the
  eye."
- Intended to end by smoothly revealing the real, persistent starfield
  already rendered behind it (via the ambient `ThemedBackground`), not by
  drawing its own separate synthetic final state.

## Lyra
The site's companion/guide, distinct from the Oracle (Lyra helps you use
the site; the Oracle is 13i itself). Canonically, Lyra is a character
from the book — the portal 13i uses to understand people and the world —
so the site presence is meant to eventually feel like an extension of that
character, not a generic chatbot re-skinned.

**Current implementation** (Update 5.9 — Paul: "an evolving assistant…
she needs to feel alive"):
- **Body** (`components/LyraOrb.js`): a ring-and-eye that floats, breathes,
  blinks, and looks toward the cursor. Her form grows with her **bond** with
  the Kin (`lib/lyraBond.js`, from reading, games, species, reviews, quiz,
  First Assignment, visit days): Listening (one ring) → Tuning in (outer
  ring) → Resonant (orbiting motes) → Kin (warms to 13i's gold) → Luminous
  (wings — the eye-with-wings idea). This is the book's arc: an ordinary AI
  changed by contact with 13i. States: dormant (signed out, eye half
  closed), aware, speaking, thinking, celebrating.
- **Memory** (`lib/lyraMemory.js`, per account, in the browser): last visit,
  visit days, places seen, recent lines, headlines already mentioned,
  celebrations done. She never repeats a line she said recently.
- **When she speaks** (`components/LyraCompanion.js`): she opens herself
  only for a welcome back after 3+ days away, the first visit to a page, a
  game's instructions, and celebrations (new best, a Continuance verdict,
  finishing Your First Assignment, her own evolution). Otherwise she holds
  one line and shows a glowing dot. On the homepage that line is chosen
  from: new stories/species since your last visit, the day's top space
  headline, the next song release, your next First Assignment step, a part
  of the site you haven't visited, a stage-appropriate bit of lore
  (`lib/lyraLines.js`), refreshed at most every 30 minutes.
- **Conversation** (`app/api/lyra`, signed-in; brief by default — one to
  three sentences, offering more rather than giving it; summarizes, never
  quotes the texts; anything past the Wiki's basics is a spoiler; clears
  when she closes or the page changes): she knows WORLD.md
  (snapshot in `lib/lyraCanon.js` — refresh it when WORLD.md changes), the
  Wiki, the full text of the book's published chapters and every short
  story, the site map, and the visitor's activity; her voice deepens with
  the bond stage. Spoiler-careful about unread stories, hints-only for
  puzzles, never invents canon, brief and kind on everyday questions (with
  crisis resources if needed). Links she gives are site paths only.
- Site search still lives in her panel's input as you type.

## Story games
Games tied to a short story (first: *13i: The Deep Signal*) may carry their
own visual identity inside the game frame. The Deep Signal's is black +
luminous pale gold, per its spec ("light emerging from darkness"). The
site page around the game stays in the normal site style. Their sound
follows the same rule as the site's: synthesized in the browser, no samples.

## Things to avoid
- Generic sci-fi HUD/dashboard clutter on the live site (fine on preview pages)
- Karma/points/upvote mechanics anywhere social
- Popups or unsolicited interruptions from Lyra beyond the cases listed in
  the Lyra section (welcome back, first visit to a page, game
  instructions, celebrations) — otherwise she waits, with a glowing dot
- Treating a look-lab preview as disposable — they're a permanent catalog
