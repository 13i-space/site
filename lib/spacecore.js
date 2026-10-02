// SpaceCore (Create > SpaceCore) - shared numbers and Lyra's game briefing.
//
// The game itself is public/games/spacecore/index.html and keeps its own
// copy of the Great Work list; the needs below must also match
// spacecore_needs() in docs/v5.39-spacecore.sql. Change all three together.

export const SPACECORE_TIME_SCALE = 6; // Mars time runs 6x real time during Alpha

export const SPACECORE_STAGES = [
  { name: "Landing Base", needs: { iron: 800, silicon: 500, ice: 200, rare: 0 } },
  { name: "Habitat Dome", needs: { iron: 2000, silicon: 1600, ice: 800, rare: 40 } },
  { name: "Greenhouse Ring", needs: { iron: 1800, silicon: 2400, ice: 1500, rare: 40 } },
  { name: "Oxygen Plant", needs: { iron: 2800, silicon: 1800, ice: 2400, rare: 80 } },
  { name: "Launch Facility", needs: { iron: 5000, silicon: 4000, ice: 2000, rare: 300 } },
];

export const SPACECORE_ATTRS = [
  { k: "eng", n: "Engineering" },
  { k: "geo", n: "Geology" },
  { k: "end", n: "Endurance" },
  { k: "nav", n: "Navigation" },
  { k: "fab", n: "Fabrication" },
  { k: "spirit", n: "Crew Spirit" },
];

export const SPACECORE_RES = { iron: "Iron", silicon: "Silicon", ice: "Ice", rare: "Rare metals", food: "Food" };

// How far along the current Great Work is, 0..1
export function stageProgress(colony) {
  const st = SPACECORE_STAGES[colony?.stage ?? 0];
  if (!st) return 1;
  let a = 0, b = 0;
  for (const [r, n] of Object.entries(st.needs)) { a += Math.min(Number(colony?.have?.[r] || 0), n); b += n; }
  return b ? a / b : 1;
}

// Lyra's briefing when she is asked something from inside the game
// (app/api/lyra adds it for the /create/spacecore page).
export const SPACECORE_GUIDE = `# SPACECORE (the page they're on)
SpaceCore is the cooperative building game in Create, still an Alpha prototype. In Paul's universe, Xavier owns several companies, and SpaceCore is his space company, focused on taking mining into space. In the game every Kin is a SpaceCore crew member sent to Mars. It doesn't appear in the published chapters, so don't add story details beyond this. Season 1 is Mars only; finishing all five Great Works (Landing Base, Habitat Dome, Greenhouse Ring, Oxygen Plant, Launch Facility) opens Season 2 and the solar system. Everyone shares one big world (512 blocks wide, about 380 m deep, with natural caves and lava tubes) and one colony.
How it plays (you're on their comms as mission control - answer practical questions plainly):
- Drive the borer with the arrow keys or WASD (or the on-screen pad). Moving into rock drills it; every block dug is mining. Regolith gives Iron, basalt gives Silicon, ice gives Ice, metal veins give Rare metals, plus by-products. Deeper rock is harder and slower to drill, heats the drill more and drains more battery, but pays a little more. Ice and metal only show within scanner range (Navigation); Scan (Q) finds the nearest signal. Natural caves stay hidden until you see them; nobody owns them until someone builds there.
- The borer's gauges (top left): battery, drill rpm, drill temperature (overheating halves drill speed until it cools below 70°C), outside temperature and depth. The battery charges fast at a powered Charger (full while away if parked beside one), steadily at the lander on the surface, and slowly anywhere on the surface. Empty, the borer crawls but can't drill. Endurance makes the battery bigger.
- Build (B) has two groups. Blocks (placed straight from resources): Airlock, Sintered brick, Basalt block, Hematite block, Iron plate, Olivine block, Gypsum block, Ice block, Glass, Tinted glass, Alloy panel, plus Backfill (packs rock back into your own tunnel, free) and Remove. Equipment (E) has to be crafted first in the Fabricator (in the Dashboard), which takes Mars time and keeps working while they're away: Lamp, O2 pump, Heater, CO2 scrubber, Greenhouse, Radiation sensor, Auto-drill, Charger, Reactor. You can build in tunnels you dug and in unclaimed natural caves.
- Rooms: any blocks that close a room off, plus an O2 pump inside, pressurize it. O2 pump + Heater + CO2 scrubber in one room makes it habitable (greenhouses grow twice as fast; training runs 50% faster while parked there). A Radiation sensor in a sealed room deeper than 24 m confirms it is shielded. A Reactor powers Chargers within 10 blocks. Auto-drills must touch rock; press C or tap to collect.
- The Dashboard: Fabricator, crew card (attribute points are permanent; one per level), Lyra's 14 missions then daily colony calls, borer, training (one skill gains a point every 8 Mars hours), auto-drills, colony (send resources to the Great Work), boosts, ledger. M resizes the map, F is fullscreen, Tab opens the Dashboard.
- Cooperation: 10% of what every Kin mines reaches everyone else as the Commons dividend. The resource the colony needs most pays 25% more. Activity elsewhere on 13i.space gives boosts: reading a story, creating a species, the Universe Quiz (score 7 of 10 = +7%), playing another game, showing up in Kinship. Boosts are capped at +50%.
- Mars time runs 6x faster than real time during Alpha.
Don't invent new canon about SpaceCore, Xavier or Mars beyond this. If a question needs Paul's decision, say it hasn't been decided yet.`;
