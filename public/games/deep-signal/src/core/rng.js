// Seeded randomness, so a run can be described (and replayed) by its seed.

export function makeRng(seed) {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (a, b) => a + next() * (b - a),
    int: (a, b) => Math.floor(a + next() * (b - a + 1)), // inclusive
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    chance: (p) => next() < p,
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
  };
}

export function randomSeed() {
  return (Math.random() * 0xffffffff) >>> 0;
}

// 0x7A3F91C2 -> "7A3F-91C2"
export function formatSeed(seed) {
  const h = (seed >>> 0).toString(16).toUpperCase().padStart(8, "0");
  return `${h.slice(0, 4)}-${h.slice(4)}`;
}

export function parseSeed(text) {
  const h = String(text).replace(/[^0-9a-f]/gi, "");
  return h ? parseInt(h.slice(0, 8), 16) >>> 0 : null;
}
