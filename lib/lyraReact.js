// One small, wordless reaction from Lyra (components/LyraOrb.js), from
// anywhere on the site. Names:
//   notice    a small brightening - she saw that
//   wow       eye wide, brighter, a little bigger - a big choice
//   warm      a warm golden glow (also: a Continuance granted)
//   watchful  pupil narrowed, leaning in (Continuance: under observation)
//   subdued   dimmer, sinking a little (Continuance: not yet earned)
//   sway      a gentle side-to-side (a new mood in the Signal Composer)
//   flinch    a quick recoil (a drill overheating)
//   droop     sinking and dimming (a battery running low)
//   celebrate a burst of light (a Great Work finished, a story submitted)
// Reactions are visual only: she never speaks for them.
export function lyraReact(name) {
  try { window.dispatchEvent(new CustomEvent("13i:lyra", { detail: { react: name } })); } catch (e) { /* ignore */ }
}

// A quiet line for her to hold (with her message dot), never popped open -
// e.g. one writing prompt after a long pause. Lyra decides whether to take it.
export function lyraHint(text, key) {
  try { window.dispatchEvent(new CustomEvent("13i:lyra-hint", { detail: { text, key } })); } catch (e) { /* ignore */ }
}
