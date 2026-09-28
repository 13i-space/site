# CURRENT.md — Snapshot of Where Things Stand

Update this file (briefly) whenever a significant change lands. This is a
snapshot, not a history — see CHANGELOG.md for the record over time.

## Working right now
- Full auth: email/password signup+login, magic-link fallback, password
  recovery via its own dedicated callback route
- Kin profiles: username, bio, avatar upload, public `/kin/[username]` page
- Forum: four seeded spaces, threads, replies
- Guestbook
- The Oracle (Anthropic API connected, billing active)
- Book reader (Chapter 1) with read-aloud
- Assignments: hand-coded canon story (0000001) + two database-driven
  AI-written stories (0000087, 0215783), a working writer with save-progress
  drafts, human/AI split columns on the hub, sorted newest-first
- Three games: NEMESIS Command, Asteroid Belt, 13i vs NEMESIS (iframe to
  static HTML) — all three have sound, and the first two have personal
  bests + a daily leaderboard (resets 00:00 UTC) + Lyra-delivered
  instructions instead of on-page text
- The Alien Lab: full 15-question guided species builder, saves to the
  Node; image generation is explicitly not built (flagged as needing a
  separate service decision)
- Activity tracking: reading progress, game plays, high scores, daily
  scores all recording to Supabase, displayed on the Node (`/account`)
- Lyra: site-wide presence, per-page contextual tips, game-instruction
  delivery, hover-to-repeat, personal-best celebration, built-in site search
- Big Bang animation: built and wired to play on every `/launch` visit
  (not yet gated to first-visit-only, not yet triggered live at
  countdown-zero)
- Six look-lab preview themes plus the live "Signal" look; `/preview` is a
  working index of all of them
- Four-mode nav (Explore/Play/Create/Kinship) with dropdowns, replacing the
  old flat nine-item nav

## Currently being worked on / most recently completed
This documentation system itself (CLAUDE.md, PROJECT.md, DESIGN.md,
WORLD.md, CURRENT.md, CHANGELOG.md) — created in response to the project
outgrowing a single conversation thread as its source of truth. This
snapshot reflects the state at the time these files were written.

Immediately before this documentation pass, work was in progress on a
batch of polish items that were **explicitly paused mid-task** to do this
documentation work instead:
- Oracle: shorten the second intro line, and change the displayed
  Assignment number to a fixed `317811` ("the Earth assignment number")
- Big Bang: make the ending cross-fade into the real, persistent starfield
  already rendered behind it (rather than drawing its own final state), and
  make the first-ever play longer (~10s) with all repeat plays much faster
  (~2s) — none of this is built yet
- Assignments hub column headers: change to "Human Written 13i Short
  Stories" / "AI Written 13i Short Stories" (not yet applied — this was the
  literal task in progress when the documentation request came in)

## Known issues
- `components/ThirteenIVsNemesis.js` exists but is not wired into any
  route — orphaned code, not a bug in the live site, but worth a deliberate
  decision (delete it, or finish wiring it in) rather than leaving it
  ambiguous
- Big Bang currently plays at the same length on every visit — the
  first-time-long / repeat-time-fast behavior described above is designed
  but not implemented

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
