# LYRA-ASSIST.md — Lyra helps in the core games

Added in Update 5.45. A **Lyra Assist** switch on NEMESIS Command, Asteroid
Belt and 13i vs NEMESIS. It's one setting, remembered in the browser
(`localStorage` key `13i_lyra_assist`), shared by all three, and can be
flipped mid-game.

**Scoring rule:** what Lyra destroys or damages earns no points. She helps
you last longer; the score is still yours. Leaderboards are unchanged.

- **NEMESIS Command** (`components/NemesisCommand.js`): she plays by your
  rules (Update 5.46). She slides along the ground line, slower than you,
  lines up directly under an invader and fires straight up. She picks the
  most dangerous invader that is *not* in your column and sticks with it, and
  a faint sight line shows what she's lined up on, so you can see her target
  and take the others. Cooldown `max(38, 80 - level*9)` frames.
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

## Lyra as player two (Update 5.46)
While her game character is flying, the game reports its screen position
every frame (`playerTwoAt` in `lib/lyraAssist.js`; 13i vs NEMESIS posts it
from its iframe and `components/IframeGame.js` passes it on). The real Lyra
(`components/LyraOrb.js`) then plays her: her eye locks onto her character
with a narrowed pupil, her rings spin fast, a "P2 · PLAYING" tag sits above
her, a dotted thread of light runs from her to her character, and each shot
flares her and sends a spark down the thread. If a game stops reporting for
over half a second, it all lets go. (In fullscreen only the game is shown,
so the thread isn't visible there.)
