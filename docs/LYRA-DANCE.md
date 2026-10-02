# LYRA-DANCE.md — Lyra hears the music

Added in Update 5.43. When music plays anywhere on the site, Lyra dances
to it. No mood tags: she reacts only to the sound itself (Paul's call).

## How it works
- `lib/lyraMusic.js` is the hub. Anything that plays music registers its
  Web Audio analyser while it plays (`hearAnalyser`) and releases it when it
  stops. An analyser only measures; it never changes the sound.
- `createListener(analyser)` turns the spectrum into four numbers each frame:
  `level` (loudness), `bass`, `high` (shimmer), and `beat` + `strength`
  (an onset: the spectrum, low end weighted, jumps well above its recent
  average). Every measure is judged against its own recent average, so a
  quiet ambient track moves her as clearly as a loud one.
- `components/LyraOrb.js` reads those numbers 60 times a second and moves
  her directly (no React re-renders): she hops on each hit (higher for
  harder hits) and leans to alternate sides on strong ones, sways and tilts
  with the energy, swells and glows with loudness, spins her outer ring and
  motes faster with the energy and shimmer, beats her wings (stage 4) and
  widens her eye with the bass. When the music stops she settles back.
- "Reduce motion" users get only a gentle swell and glow, no movement.

## Sources
- **Signal Composer** (`components/MusicLab.js`): registers its synth's
  analyser on Play.
- **Story signals** (`lib/signals.js`, the SignalPlayer on story pages).
- **Paul's songs** (`app/(site)/music/page.js`): each `<audio>` is routed
  through a shared AudioContext with `listenToElement`. Songs now load from
  13i.space's own address, `/api/track/<name>.mp3` (an edge route that
  streams them through from tempogoatstudios.com, allow-listed to the tracks
  in `lib/musicReleases.js`). Same-address audio is what lets the browser
  measure it; audio from another site would play silently if routed.
  Safety: an element is only routed once the audio context is running, and
  if `/api/track` ever fails a track falls back to its original address and
  just plays without Lyra hearing it.
- Note: proxied songs count toward Vercel bandwidth.

## Tuning
Add `?lyradebug` to any page's address and `window.__lyraHear` keeps a log
of what she hears (level, bass, flux, beats). Beat sensitivity is the `1.8`
threshold and `250` ms gap in `createListener`.
