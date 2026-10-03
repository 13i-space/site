// The colony's Great Works in Season 1, names and what each needs, so pages
// outside the game (the /launch "alive" strip) can show progress from the
// public spacecore_colony row. Keep in step with STAGES in
// public/games/spacecore/index.html.
export const GREAT_WORKS = [
  { name: "Landing Base", need: { iron: 800, silicon: 500, ice: 200, rare: 0 } },
  { name: "Habitat Dome", need: { iron: 2000, silicon: 1600, ice: 800, rare: 40 } },
  { name: "Greenhouse Ring", need: { iron: 1800, silicon: 2400, ice: 1500, rare: 40 } },
  { name: "Oxygen Plant", need: { iron: 2800, silicon: 1800, ice: 2400, rare: 80 } },
  { name: "Launch Facility", need: { iron: 5000, silicon: 4000, ice: 2000, rare: 300 } },
];

// { name, pct } for the Great Work being built now, or null once all are done
export function currentGreatWork(colony) {
  const stage = colony?.stage | 0;
  const work = GREAT_WORKS[stage];
  if (!work) return null;
  const have = colony?.have || {};
  const total = Object.values(work.need).reduce((a, b) => a + b, 0);
  const got = Object.entries(work.need).reduce((a, [k, n]) => a + Math.min(n, Number(have[k]) || 0), 0);
  return { name: work.name, index: stage + 1, of: GREAT_WORKS.length, pct: total ? Math.round((got / total) * 100) : 0 };
}
