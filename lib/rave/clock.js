// The Rave's sense of time (Update 5.68). Turns "where is the song right
// now" into beats, so every dancer, light and laser can land on the beat.
//
//   - songs with a measured grid (lib/rave/beatData.js): beats come straight
//     from audio.currentTime, so they stay locked through seeks and pauses
//   - anything else: it listens (lib/lyraMusic createListener) and works the
//     tempo out from the hits it hears
//   - the energy of each part of the song (measured) tells the choreography
//     when it's a breakdown, a groove or a drop; live loudness adds to it
import { BEATS } from "./beatData";

export function gridFor(file) {
  const g = file && BEATS[file];
  if (!g) return null;
  const [bpm, offset, energy] = g;
  return { bpm, offset, period: 60 / bpm, energy: energy.split("").map(Number) };
}

// a song's measured energy at time s (0-1), smoothed between its 2-second steps
export function energyAt(grid, s) {
  if (!grid) return null;
  const e = grid.energy;
  const i = Math.max(0, s / 2 - 0.5);
  const a = e[Math.min(e.length - 1, Math.floor(i))] ?? 0, b = e[Math.min(e.length - 1, Math.floor(i) + 1)] ?? a;
  const k = i - Math.floor(i);
  return (a + (b - a) * k) / 9;
}

// Where the drops are: the energy climbs from a quiet stretch to a loud one.
// Returned as beat numbers (on a bar line) so the scene can count down to them.
export function dropsOf(grid) {
  if (!grid) return [];
  const out = [];
  const e = grid.energy;
  for (let i = 3; i < e.length; i++) {
    const before = Math.min(...e.slice(Math.max(0, i - 4), i));
    const quiet = (e[i - 1] + e[i - 2] + e[i - 3]) / 3;
    if (e[i] >= 7 && (quiet <= 4.5 || e[i] - before >= 4)) {
      const s = i * 2;
      const beat = Math.round(((s - grid.offset) / grid.period) / 4) * 4;
      if (!out.length || beat - out[out.length - 1] > 32) out.push(beat);
    }
  }
  return out;
}

// Live tempo, for songs without a grid: keep the last hits, take the most
// common gap between them, and lock the phase to the latest.
export function liveTempo() {
  const hits = [];
  let period = 0.5, anchor = 0, anchorBeat = 0;
  return {
    hit(s) {
      hits.push(s);
      while (hits.length > 24) hits.shift();
      if (hits.length < 6) { anchorBeat = Math.round(anchorBeat + (s - anchor) / period); anchor = s; return; }
      const gaps = [];
      for (let i = 1; i < hits.length; i++) {
        let g = hits[i] - hits[i - 1];
        if (g <= 0) continue;
        while (g < 0.36) g *= 2; // keep it between 85 and 165 bpm
        while (g > 0.71) g /= 2;
        gaps.push(g);
      }
      gaps.sort((a, b) => a - b);
      const med = gaps[Math.floor(gaps.length / 2)];
      if (med) period += (med - period) * 0.3;
      // lock to this hit, keeping the count going
      anchorBeat = Math.round(anchorBeat + (s - anchor) / period);
      anchor = s;
    },
    beatAt(s) { return anchorBeat + (s - anchor) / period; },
    get period() { return period; },
  };
}
