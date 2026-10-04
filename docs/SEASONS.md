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

## Season 1 as of Update 5.55
Runs twice, back to back: a beta season for Beta Kin from **January 1,
2027**, then for everyone from launch, **April 6, 2027** (`beta` and
`launch` on the season in `lib/seasons.js`; week pages show both).
1 The Deep Walkers (0000087) · 2 Nerath's Secret (0215783) · 3 The Quiet
Moon (0028657) · 4 The Sea of Glass (0514229). Weeks 5-12 to build before
the beta; 13 is the finale. Every built week has all six pieces.

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
