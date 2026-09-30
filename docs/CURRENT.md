# CURRENT.md — Snapshot of Where Things Stand

Update this file (briefly) whenever a significant change lands. This is a
snapshot, not a history — see CHANGELOG.md for the record over time.

## Working right now
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
- Narrated audio on all three short stories (player at the top of the reader)
- Galaxy: 3D Galaxy Map with story worlds unlocked by reading, Facts,
  Quiz, and Space News (NASA/ESA/SpaceNews RSS, cached 30 min)
- Assignments: hand-coded canon story (0000001) + two database-driven
  AI-written stories (0000087, 0215783), a working writer with save-progress
  drafts, human/AI split columns on the hub ("Human Written 13i Short
  Stories" / "AI Written 13i Short Stories"), sorted newest-first
- Three games: NEMESIS Command, Asteroid Belt, 13i vs NEMESIS (iframe to
  static HTML) — all three have sound, and the first two have personal
  bests + a daily leaderboard (resets 00:00 UTC) + Lyra-delivered
  instructions instead of on-page text
- The Alien Lab: full 15-question guided species builder, saves to the
  Node; image generation is explicitly not built (flagged as needing a
  separate service decision)
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
- Seven look-lab preview themes (1–7, plus 13 Big Bang) and the live
  "Signal" look; `/preview` is a working index of all of them
- Four-mode nav (Explore/Play/Create/Kinship) with dropdowns, replacing the
  old flat nine-item nav

## Currently being worked on / most recently completed
Update 5.0 (see CHANGELOG): Book/story audio, Book hub options, Space
News, the rebuilt Galaxy Map, preview 7 (Black Hole). Edited directly in
the local checkout by a Claude Code session and committed/pushed via
GitHub Desktop, rather than handed off as zips.

## Known issues
- Update 5.0 was written without Node.js available locally, so it was
  never run through `next build` before pushing. The Galaxy Map, Black
  Hole preview and Space News parser were exercised in a browser test
  harness; the Book/audio changes weren't. Check the Vercel build log and
  each new page on first deploy
- The "Download Chapters 1 & 2" option serves the existing PDF; there is no
  separate ebook (.epub) file yet
- `components/ThirteenIVsNemesis.js` exists but is not wired into any
  route — orphaned code, not a bug in the live site, but worth a deliberate
  decision (delete it, or finish wiring it in) rather than leaving it
  ambiguous
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
