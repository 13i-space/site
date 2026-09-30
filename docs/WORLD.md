# WORLD.md — Creative & Worldbuilding Reference

This distinguishes **established canon** (stated directly, firm) from
**developing ideas** (in progress, may change) from **intentionally
unknown** (deliberately left open — do not fill in). Do not invent new
canon to close a gap; flag the gap instead.

## 13i — established canon
- 13i is an ancient, **collective** non-human intelligence. Always refers
  to itself as "we/us/our" — never "I." This is load-bearing for every
  piece of writing in its voice (Oracle, Assignments).
- **The Continuance Rule** — deliberately not called "the Golden Rule,"
  since it's 13i's own galactic-scale principle, not a borrowed human one:
  a species' survival is conditional on demonstrated internal cooperation.
  Continuance is earned, not owed.
- 13i's creators perceive **gravity** as their native sense. 13i itself
  extended its perception into other senses over its long history, but
  always translates back down into gravity for its creators — this is why
  the music is framed as "a signal, translated," not literal alien audio.
- 13i can fail locally without the Assignment failing: a manifestation can
  be destroyed, damaged, trapped, or lost, but another manifestation
  continues, and the collective retains the experience either way.
- 13i is extraordinarily knowledgeable but **not omniscient** — this is
  treated as a hard rule for anything written in its voice (see the
  Assignment Protocol below).

## The Assignment Protocol — established canon
The governing rules for any Assignment (existing or newly written):
- Written **as** 13i, not about it. Voice is always "we."
- Begins with a purpose (investigate, discover, study, evaluate...) that is
  free to change as 13i learns more — the objective is not fixed at the
  start.
- 13i may intervene, observe, communicate, protect, teach, or destroy — the
  choice belongs to the intelligence based on what it understands *at the
  time*, not to omniscient certainty.
- **The one rule that matters**: do not make 13i omniscient. The most
  interesting Assignments are the ones where it encounters something it
  doesn't understand.
- Every Assignment leaves the collective knowing something it didn't know
  before — not necessarily a moral, a victory, or an answer, just something.
- Assignments move through a status pipeline: **submitted → archived →
  canon**. A small number of community-created concepts may eventually
  become part of the broader 13i universe this way — "the archive is where
  the universe discovers itself."

## Known Assignments (canon, as written)
- **0000001, "The First Silence"** (human-written, Paul Donaghy) — 13i's
  origin/first Assignment. It discovers a species on a neighboring planet
  in a binary system, perceives them as an existential predatory threat
  because of their expansionist, consumptive behavior, and destroys the
  planet using its own ring system turned against it. Immediately
  afterward, 13i feels compunction — realizing it acted from fear and
  eliminated far more than the specific threat required, when other
  options existed. This regret and its resulting protocol updates are the
  origin of 13i's later caution and self-doubt.
- **0000087, "The Deep Walkers"** (AI-written) — 13i investigates
  anomalous energy signatures on Veyra and finds the Deep Walkers, a
  species whose biology (pressure-sensing limbs, no eyes/ears) makes them
  functionally inseparable from their planet, which serves as both their
  nervous system and their historical archive (ancestral remains
  transmitting vibration-encoded memory for generations).
- **0215783, "Nerath's Secret"** (AI-written) — 13i investigates an
  artificial energy network on the liquid world Nerath and finds a species
  whose individuals contain sixteen semi-autonomous "appendage minds"
  alongside one central brain, capable of disagreeing with and overriding
  the central mind. 13i's takeaway: internal disagreement can be a source
  of strength rather than a flaw to eliminate.
- Human-submitted Assignments (via the site's writer) are not yet
  canon/archived as of this writing — the pipeline exists, nothing has been
  promoted through it yet beyond Assignment 1 itself.

## Human-side characters — established canon
- **Aiden** — first contact
- **Xavier** — institutional/corporate response; also the book's original
  creator of NEMESIS (human-made, not alien)
- **Lyra** — AI conduit, later enhanced by 13i; the "portal" 13i uses to
  understand people and the world. The site's own Lyra companion is
  explicitly meant to draw on this character, including her arc (a fairly
  ordinary AI assistant at first, changed by contact with 13i) — see
  DESIGN.md for the site-implementation side of this.

## NEMESIS — established canon, with a deliberate site-side departure
NEMESIS originates in the book as Xavier's creation — human-made, not
alien. The site's games (NEMESIS Command, Asteroid Belt, 13i vs NEMESIS)
are explicitly **a separate, more playful extension** of the concept, not
strictly bound to book canon. Asteroid Belt's mining-ship-with-tungsten-
rods enemy is drawn from the book's closing chapters but is a game
mechanic first, not a literal retelling.

## The Oracle — established canon
A direct channel to speak with 13i itself, distinct from Lyra. Answers as
"we," is extraordinarily knowledgeable but not omniscient, and its core
mechanism is listening for the universal human need underneath whatever a
visitor shares (safety, being understood, not being alone) and naming that
pattern plainly — no moralizing. Never breaks character to admit being an
AI; if pressed, only ever says "We are 13i."

## Galaxy/world concepts — developing
The Galaxy section (map, facts, quiz) presents general astronomy content
framed as the setting rather than site-specific invented cosmology as of
this writing. Whether the galaxy map/facts represent 13i's *actual* home
galaxy with specific invented geography, versus real-world astronomy used
as flavor, is not established — treat as **developing** rather than
assuming either way.

## Galaxy map placements — developing (map only)
Update 5.0 put the Assignments' worlds on the Galaxy Map, at positions
invented purely for the map (Paul's call: "you can make up where they
would appear"). None of this is canon: not the positions, not which spiral
arm they sit in, and not that they share a galaxy with Earth. The labels
avoid inventing names:
- **"13i's home world"** (Assignment 0000001) — drawn with its ringed
  binary twin beside it; neither planet is named in the story, so neither
  is named on the map
- **Veyra** (0000087) and **Nerath** (0215783) — names from their stories
Placement lives in `lib/galaxyWorlds.js`; move them freely if canon ever
says otherwise.

## Kin / Kinship — developing
"Kin" is the established term for community members. "Kinship" as a
deliberate concept — meant to mean more than generic community, aiming at
belonging and eventually "chosen family" — is a stated direction but its
specific language/rituals/culture are **not yet developed**. Don't invent
Kinship-specific terminology or traditions without this being discussed
first; the intent is for this to be built deliberately, not filled in as
a placeholder.

## Story of Self — developing, deliberately separate
A conceptually-connected but **distinct** initiative: the premise is that
understanding your own story lets you discover yourself and transform into
your "Kin" version of yourself. Intended to eventually hand off to its own
dedicated platform rather than living fully inside 13i.space. Not yet
built in any form on the site. Do not conflate this with the Forum/Guestbook
or treat it as a feature of Kinship — it's adjacent, not a subset.

## The Alien Lab — developing (mechanism, not lore)
A guided questionnaire (star system → environment → physical form → senses
→ personality → technology) that lets a visitor build and save an
original alien species. This is a **creation tool**, not itself a source
of new 13i canon — species built here are user creations, not new
Assignments or galaxy lore, unless/until something built this way is
separately decided to matter to canon.

## Intentionally unknown / open questions
- What 13i's creators actually looked like, and what became of them, is
  not established anywhere in site content reviewed for this document.
- The exact relationship between the book's timeline and the site's
  "Archive Cycle" / large numeric eras used in AI-written Assignments
  (e.g. "Era 11,284,603,921" / "Archive Cycle 7,184,203") is not defined —
  treat these as flavor indicating vast timescales, not a dateable
  chronology, unless Paul specifies otherwise.
- Whether AI-written Assignments are considered equally canonical to
  human-written ones, or provisionally canon pending review, isn't fully
  settled — they currently carry `status: canon` in the database, which
  is a technical/display distinction, not necessarily a lore ruling.
