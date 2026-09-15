// The site's visual "look" lives here as a single named setting.
// To switch the whole site's look, change ACTIVE_THEME to one of the
// keys below and redeploy - no other files need to change.
//
// Each theme has a full-page lab demo at:
//   signal        -> the original look, not currently shown standalone
//   constellation -> /preview
//   nebula        -> /preview2
//   radar         -> /preview3
//   fibonacci     -> /preview4

export const ACTIVE_THEME = "signal";

export const THEMES = {
  signal: {
    label: "Signal",
    description: "Starfield background with expanding ripples from the logo's eye.",
  },
  constellation: {
    label: "Constellation",
    description: "A drifting network of connected points, with slow orbital rings around the logo.",
  },
  nebula: {
    label: "Nebula",
    description: "Soft, slow-drifting nebula clouds with a pulsing glow behind the logo.",
  },
  radar: {
    label: "Radar",
    description: "A rotating radar sweep with fading blips, echoing NEMESIS's radar-only perception.",
  },
  fibonacci: {
    label: "Fibonacci",
    description: "A golden-angle spiral of drifting points, tying into the book's Fibonacci Signal.",
  },
};
