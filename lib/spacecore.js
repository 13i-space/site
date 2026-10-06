// SpaceCore (Create > SpaceCore) - shared numbers and Lyra's game briefing.
//
// The game itself is public/games/spacecore/index.html and keeps its own
// copy of the Great Work list; the needs below must also match
// spacecore_needs() in docs/v5.61-spacecore-survival.sql. Change all three together.

export const SPACECORE_TIME_SCALE = 6; // Mars time runs 6x real time during Alpha

export const SPACECORE_STAGES = [
  { name: "Landing Base", needs: { iron: 800, silicon: 500, ice: 200, rare: 0 } },
  { name: "Habitat Dome", needs: { iron: 2000, silicon: 1600, ice: 800, rare: 40 } },
  { name: "Greenhouse Ring", needs: { iron: 1800, silicon: 2400, ice: 1500, rare: 40 } },
  { name: "Oxygen Plant", needs: { iron: 2800, silicon: 1800, ice: 2400, rare: 80 } },
  { name: "Launch Facility", needs: { iron: 5000, silicon: 4000, ice: 2000, rare: 300 } },
  // Season projects (Update 5.61): after the Launch Facility, the main objective
  { name: "Ship: Heat Shield", needs: { iron: 1500, silicon: 1200, ice: 0, rare: 60 } },
  { name: "Base: Solar Farm", needs: { iron: 1200, silicon: 2500, ice: 300, rare: 20 } },
  { name: "Ship: Cargo Bay", needs: { iron: 2500, silicon: 1500, ice: 500, rare: 80 } },
  { name: "Base: Comms Tower", needs: { iron: 1800, silicon: 1800, ice: 200, rare: 120 } },
  { name: "Ship: Ion Drive", needs: { iron: 3000, silicon: 2500, ice: 1500, rare: 200 } },
  { name: "Base: Observatory", needs: { iron: 2000, silicon: 3000, ice: 800, rare: 150 } },
];
export const SPACECORE_MAIN_STAGES = 5;

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
SpaceCore is the cooperative building game in Create, still an Alpha prototype. In Paul's universe, Xavier owns several companies, and SpaceCore is his space company, focused on taking mining into space. In the game every Kin is a SpaceCore crew member sent to Mars. It doesn't appear in the published chapters, so don't add story details beyond this. Season 1 is Mars only; its main objective is the five Great Works (Landing Base, Habitat Dome, Greenhouse Ring, Oxygen Plant, Launch Facility), then six Season projects improve the ship and the base before Season 2 opens the solar system. Everyone shares one big world (512 blocks wide, about 380 m deep, with natural caves and lava tubes) and one colony.
How it plays (you're on their comms as mission control - answer practical questions plainly):
- Drive the borer with the arrow keys or WASD (or the on-screen pad). Moving into rock drills it; every block dug is mining. Regolith gives Iron, basalt gives Silicon, ice gives Ice, metal veins give Rare metals, plus by-products. Deeper rock is harder and slower to drill, heats the drill more and drains more battery, but pays a little more. Ice and metal only show within scanner range (Navigation); Scan (Q) finds the nearest signal. Natural caves stay hidden until you see them; nobody owns them until someone builds there.
- The borer's gauges (top left): battery, drill rpm, drill temperature (overheating halves drill speed until it cools below 70°C), outside temperature and depth. The battery charges fast at a powered Charger (full while away if parked beside one), steadily at the lander on the surface, and slowly anywhere on the surface. Empty, the borer crawls but can't drill. Endurance makes the battery bigger.
- Build (B) has two groups. Blocks (placed straight from resources): Sintered brick, Basalt block, Hematite block, Iron plate, Olivine block, Gypsum block, Ice block, Glass, Tinted glass, Alloy panel, plus Backfill (packs rock back into your own tunnel, free) and Remove. Equipment (E) has to be crafted first in the Fabricator (in the Dashboard), which takes Mars time and keeps working while they're away (anything queued can be cancelled with its × for a full refund): Airlock (new crews start with two), Lamp, Solar panel, Charger, O2 pump, Galley, Bunk, Heater, CO2 scrubber, Greenhouse, Radiation sensor, Auto-drill, Battery, Geothermal tap, Reactor. Equipment can be picked up and placed again with Move (V), or taken back to the kit with Remove (R). You can build in tunnels you dug and in unclaimed natural caves. Food is grown in greenhouses and eaten to keep the Food gauge up.
- Rooms: any blocks that close a room off, plus an O2 pump inside, pressurize it. O2 pump + Heater + CO2 scrubber in one room makes it habitable (greenhouses grow twice as fast; training runs 50% faster while parked there). A Radiation sensor in a sealed room deeper than 24 m confirms it is shielded. A Reactor powers Chargers within 10 blocks. Auto-drills must touch rock; press C or tap to collect.
- The Dashboard: Fabricator, crew card (attribute points are permanent; one per level), Lyra's 14 missions then daily colony calls, borer, training (one skill gains a point every 8 Mars hours), auto-drills, colony (send resources to the Great Work), boosts, ledger. M resizes the map, F is fullscreen, Tab opens the Dashboard.
- Cooperation: 10% of what every Kin mines reaches everyone else as the Commons dividend. The resource the colony needs most pays 25% more. Activity elsewhere on 13i.space gives boosts: reading a story, creating a species, the Universe Quiz (score 7 of 10 = +7%), playing another game, showing up in Kinship. Boosts are capped at +50%.
- Mars time runs 6x faster than real time during Alpha.
Update 5.61 (from a long playtest by one of Paul's sons):
- Crew needs: three gauges, Oxygen, Food and Morale, drain slowly while playing (never while away). Oxygen refills inside any pressurized room and at the lander. H eats a ration (1 Food, +20); a Galley in a pressurized room cooks proper meals automatically (+35). Morale rises at a warm home with comforts (Bunk, Galley, lamp, greenhouse; a Heater is needed first) and near other active Kin. Below 15% the borer slows; at zero for about a minute you black out: robots tow you to the lander and a quarter of your ore (iron, silicon, ice, rare) stays at your wreck until you drive back to it.
- Abilities: Dash (Shift) is a short burst of speed; Overdrive (Space) doubles drill speed for a few seconds without heating the drill. Both cost battery and recharge. On touch screens they're the DASH / DRILL+ buttons on the pad, with SCAN and EAT.
- Scan (Q) shows its range (70 m at Navigation 1, +10 m per point, half as much again with Wide scan), costs 3% battery, counts the ice and metal in range, and maps veins within about 24 m.
- Power: Solar panel (1.5 kW, only within 16 m of the surface, a tenth of that in a dust storm), Geothermal tap (4 kW, only 80 m down or deeper, needs the Geology research), Reactor (9 kW anywhere, expensive; still reaches chargers within 10 blocks without wire), Battery (stores 300 kWh). Pieces touching each other or joined by Wire (a cheap block, visible only in Build mode) share a grid. A charger near the surface has its own small solar mast. Powered auto-drills run 50% faster. Hovering a piece in the game shows its grid.
- Auto-drills: every ore/soil block in the 5x5 around one feeds it, and it is more efficient the more rock surrounds it. You must drive within 16 m to empty one (C); greenhouse food is picked up by driving past.
- Fabricator: airlocks and lamps are instant; bigger machines take longer (a Reactor about 20 real minutes) and cost more. Times show Mars and real time.
- Building: click and drag lays a line of blocks. T turns airlocks (door/floor hatch) and lamps (hanging/standing). Airlocks slide open when someone is next to them. Each Kin can build up to 1500 pieces. Pressurized rooms show the builder's name ("Aaron's home").
- Research: three projects per attribute (18 in all), each needing that attribute at 1, 3 or 5 and the project above it; one at a time on Mars time.
- Your borer: Dashboard > Your borer has body, trim, drill head, headlamp colors and a decal; other Kin see it.
- Dust storms: about once an hour, the same moment for everyone; Lyra warns a minute ahead. Get 4 m underground or into the lander; on the surface a storm drains battery, oxygen and morale.
- When a Great Work's bars are all full, the robots finish it, every crew gets +10% for a day, and the next one starts. The Launch Facility (Great Work 5, the ship on its pad) is Season 1's main objective; after it come six Season projects, one at a time: Ship: Heat Shield, Base: Solar Farm, Ship: Cargo Bay, Base: Comms Tower, Ship: Ion Drive, Base: Observatory. When those are done, Season 2 opens the solar system.
- Missions 15-17: Home comforts (Bunk or Galley in a habitable room), Store the sun (Battery on a powered grid), First research.
Don't invent new canon about SpaceCore, Xavier or Mars beyond this. If a question needs Paul's decision, say it hasn't been decided yet.`;
