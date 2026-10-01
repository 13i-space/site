# Seasons and Story Weeks: notes

Paul's direction (Oct 2026): one story a week, released in several forms;
13 weeks = one season = one quarter; week 13 is a finale where the
season's artifact fragments come together; each season can become a KDP
anthology. **Season 0** is the pre-launch test season. Building it by hand
first, to learn the process before any automation.

## A Story Week bundle (as tested in Season 0, Week 1)
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
