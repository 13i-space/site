# Seasons and Story Weeks: notes

Paul's direction (Oct 2026): one story a week, released in several forms;
13 weeks = one season = one quarter; week 13 is a finale where the
season's artifact fragments come together; each season can become a KDP
anthology. **Season 1** begins at launch (April 2027); its weeks are being
built by hand ahead of time (goal: a full quarter ready by April), to learn
the process before any automation. (The Quiet Moon was first built as
"Season 0"; Paul made it Season 1, Week 1 in Update 5.36.)

## A Story Week bundle (as built for Season 1, Week 1)
| Day | Piece | Where it lives |
|---|---|---|
| Mon | **Short story**: the canon record | `lib/stories/<slug>.js` → seeded once via `app/api/admin/seed-assignment-<n>` |
| Tue | **Signal**: a composed piece, synthesized in the browser | `lib/signals.js` (sections of engine songs), `components/SignalPlayer.js` |
| Wed | **Interactive Assignment** | `lib/interactive/<slug>.js` + scenes in `components/interactiveScenes/` |
| Thu | **Species card**: 13i's record as an Alien Lab card | `lib/archiveSpecies.js` |
| Fri | **Game** | `public/games/<slug>/` + `lib/storyGames.js` + `app/(site)/games/<slug>` |
| Sat | **Artifact fragment** (placeholder until the artifact is designed) | `lib/seasons.js` (`fragment`) |
| | Cover + thumb, Galaxy Map world | `public/covers/`, `lib/galaxyWorlds.js` |
| | Optional: narrated audio (Paul, recorded in Logic) | `public/stories/<slug>/audio.mp3`, then add the number to `STORY_AUDIO` in `app/(site)/assignments/[number]/page.js` and `AUDIO` in `app/og/story/[number]/route.js` |

The week page `/seasons/<season>/<week>` shows all of it; each piece has a
`day`, and an optional `opens: "YYYY-MM-DD"` that gates it (its tile says
"Opens Wednesday..." until then). That's the "produce ahead, release on a
schedule" idea: a whole bundle can ship early and reveal day by day.

## Season 1 as of Update 5.56
Runs twice, back to back: a beta season for Beta Kin from **January 1,
2027**, then for everyone from launch, **April 6, 2027** (`beta` and
`launch` on the season in `lib/seasons.js`; week pages show both).
1 The Deep Walkers (0000087) · 2 Nerath's Secret (0215783) · 3 The Quiet
Moon (0028657) · 4 The Sea of Glass (0514229) · 5 The Borrowed Seconds (0832040) · 6 First Fire (1346269) · 7 The Fermata
(2178309), added in Update 5.79 · 8 The Accord (3524578) · 9 The Ring
(5702887), added in Update 5.84. Weeks 10-12 to build before the beta; 13 is the
finale. Release weeks run Monday to Sunday from a season's first Monday
(beta week 1 = Jan 4 2027, public week 1 = Apr 12 2027); the full weekly
rhythm lives in `lib/siteCalendar.js`.

Paul's direction for the remaining weeks: some stories should feature
advanced beings at roughly Earth's level of technology (local space travel
at most), and some should meet them first through their own AI, so a
pattern builds across the season. Week 5 is the first of these. Week 6
(Paul's brief, Update 5.79) is the first aggressive species: already
spacefaring, with AI and quantum technology, who see 13i as a threat it has
to survive before it can reach them. Week 7 is a quieter counterweight.

Games added in 5.79: **HOLD FIRE** (public/games/hold-fire, week 6): tap a
Kesh slug to bend it away, seekers can only be absorbed by the field, hold
during a flare to shield their homeworld; RETURN FIRE (F) clears the sky but
halves every score after and makes the Bastion angrier. **FERMATA**
(public/games/fermata, week 7): keep the comet's closest pass in the warm
band by leaning (hold left/right) only while it's in the dark; each waking
leaves a letter; lighter leaning scores more. Both have a `?test` hook
(window.__game) used for bot balance checks: HOLD FIRE ~50s weak / ~2 min
fair / ~3+ min strong; FERMATA ~1 min careless, 20-30 wakings strong.

Assignment numbers are Fibonacci numbers outside the human range
(50,000-250,000). Used: 28657, 514229, 832040, 1346269, 2178309, 3524578,
5702887. Next free: 9227465 (the last seven-digit Fibonacci number), then
1597, 2584, 4181. Every built week has all six pieces.

Games added in 5.84: **TUTTI** (public/games/tutti, week 8): species arrive
with a gift (outer ring) and a need (inner dot); drag a giver to a matching
need (two gifts each); fed species join the Accord after 18s and take their
gifts with them; six that leave and it breaks; drag 13i onto a vine to turn
it into a young loom-beast (7s recharge). **RITORNELLO**
(public/games/ritornello, week 9): a six-arc Simon-style phrase that returns
with one more note each round, sometimes asked backward (double points);
three misses ends it. Both have the `?test` hook. Bot balance: TUTTI ~1.5 min
slow / ~3 min fair / 4-7 min fast; RITORNELLO phrases of ~5 casual / ~9 fair
/ ~13+ sharp.

## The Survival Trials across a season (planned, Update 5.59 groundwork)
Each week a tournament of that week's species produces a Weekly Champion
(lib/survivalEngine.js championRecord(); table sketched in
docs/v5.59-survival-champions.sql). Week 13: THE CHAMPIONS' CONTINUANCE,
the 12 weekly champions. The engine already takes any entrant list, any
trial subset, and a kind/season/week; the calendar's Smash Saturday and
Tournament of Champions (lib/siteCalendar.js) are where these will run.

## Canon
- **Book canon** is Paul's and drives everything; nothing contradicts it.
- **Archive canon** comes from the Assignments. Weekly stories are
  AI-originated records; in each interactive version, one ending is the
  canon record and the others are divergent records.

## What Week 1 took (for estimating the next ones)
Roughly, in one long working session: story (~2,250 words) → interactive
script (5 endings, 168 paths) → new scene set (11 scenes) → game (new
mechanic, three balance passes) → signal (7 sections) → species card →
cover → week page + Seasons index. The interactive scenes and the game are
the heaviest; both get much faster once there are templates to reskin.
