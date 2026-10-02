# LYRA-ASSIST.md — Lyra helps in the core games

Added in Update 5.45. A **Lyra Assist** switch on NEMESIS Command, Asteroid
Belt and 13i vs NEMESIS. It's one setting, remembered in the browser
(`localStorage` key `13i_lyra_assist`), shared by all three, and can be
flipped mid-game.

**Scoring rule:** what Lyra destroys or damages earns no points. She helps
you last longer; the score is still yours. Leaderboards are unchanged.

- **NEMESIS Command** (`components/NemesisCommand.js`): she hovers above the
  ground line, slides toward the incoming threat closest to the ground, and
  fires leading shots. Her fire rate rises with the level (cooldown
  `max(30, 75 - level*11)` frames) but can't cover everything at high levels,
  and a small aim wobble means the odd miss.
- **Asteroid Belt** (`components/AsteroidBelt.js`): she circles just off your
  wing, following you across the screen edges, and fires at the nearest rock,
  tungsten rod or mining ship within range (cooldown `max(26, 58 - level*3)`
  frames). Her bolts split asteroids like yours. She can't be hit.
- **13i vs NEMESIS** (`public/games/13i-vs-nemesis.html`): in every weapon
  window she hovers beside your battery and holds a thin, constant laser on
  13i. Her aim trails its jukes a little, and its gravity-well deflection
  bends her beam aside. On target she does `LYRA_DPS` (0.8% hull a second),
  about 10% in a full window. Her share shows top right and on the end screen.

Her sprite is `drawLyra` in `lib/lyraAssist.js` (copied into the standalone
13i vs NEMESIS page). The switch is `components/LyraAssistToggle.js`.
