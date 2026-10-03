# Assignment 0000000 — Before

The first-visit experience (Update 5.54). Route: `/before`, outside the
`(site)` group so there is no nav, footer or Lyra companion until the end.

## Flow
| Phase | What happens | Moves on when |
|---|---|---|
| title | ASSIGNMENT 0000000 / *Before* / two lines / **begin** | begin tapped |
| explore | one point drifts toward cursor/finger; ripples call for attention; grows a ring and two companions | ~2.8s of pull (hints at 7s "it's listening.", 15s "come closer.") |
| found | *You found the force.* | 3.6s |
| play | 7 motes; pointer pulls (after a 2s scatter); mutual gravity; slow meetings merge | one left (gravity ramps after 32s, gathers to centre after 55s) |
| held | *It holds.* star glides to centre | 4.2s |
| create | tap/click to place up to 3 seeds; hold = weight; drag = orbit direction + shape; distance = colour | 3 seeds + 2.6s, or 9s after the last |
| still | **hold · let it expand** (2.4s hold; releasing relaxes it) | fully held |
| silence | everything stops; one point; audio cut | 1s |
| bang | seeded by the universe number; seeds become arms; eye forms; logo, Lyra, welcome | **enter 13i** |

## Persistence (lib/beforeVisit.js)
- `localStorage["13i_before"] = "done"` and `bigbang_seen` on finish or skip.
- Signed in: `before_done` (+ `before_universe`) in Supabase user metadata,
  so a new device skips it. Signed-in Kin without it see it once.
- `/launch` checks on mount and `router.replace("/before")` if not done.
- `/before` opened directly always plays (replays, testing, a second person
  on the same browser).
- `sessionStorage["13i_before_arrived"]` tells /launch they just arrived.

## Testing
- `/before?beforedebug` exposes the live state as `window.__before`.
- To be a first-time visitor again: sign out, then in the browser console
  `localStorage.removeItem("13i_before")` - or just open `/before`.

## Tuning knobs (components/Before.js)
Explore threshold `st.explore >= 2.8`; play pointer force `0.22`, merge
speed `< 3.2`; seed hold `1.6s`; expand hold `dt / 2.4`; welcome timings
`[3000, 5000, 6400, 8400, 10800, 12800]` ms after the bang.
