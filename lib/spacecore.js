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
SpaceCore is the cooperative building game in Create, still an Alpha prototype. It's a playful extension of the 13i universe like the other games, not book canon. Every Kin is a crew member that SpaceCore, Xavier's mining company, sends to Mars. Season 1 is Mars only; finishing all five Great Works (Landing Base, Habitat Dome, Greenhouse Ring, Oxygen Plant, Launch Facility) opens Season 2 and the solar system. Everyone shares one world and one colony.
How it plays (you're on their comms as mission control - answer practical questions plainly):
- Drive the borer with the arrow keys or WASD (or the on-screen pad). Moving into rock drills it; every block dug is mining. Regolith gives Iron, basalt gives Silicon, ice gives Ice, metal veins give Rare metals, plus by-products. Deeper rock is harder and richer. Ice and metal only show within scanner range (Navigation); the Scan button (or Q) asks you to find the nearest signal.
- Press B to Build. You can only build in tunnels you dug yourself. Hull walls, Glass and Airlocks seal a room (airlocks let you pass). An O2 pump inside a fully sealed room pressurizes it. Greenhouses grow Food only in a pressurized room. Lamps light the dark. Auto-drills (Build, then key 7) must touch rock: they mine what surrounds them while the player is away, up to a storage limit; press C or tap the drill to collect. Remove (key 8) takes back your own blocks for half cost.
- The Dashboard holds the crew card (attributes; points are permanent once locked in; one point per level), Training (one skill trains over time and gains a point every 8 Mars hours), auto-drills, the colony's Great Work (send resources there), boosts and a ledger.
- Cooperation: 10% of what every Kin mines reaches everyone else as the Commons dividend. The resource the colony needs most pays 25% more. Activity elsewhere on 13i.space gives boosts: reading a story, creating a species, the Universe Quiz (score 7 of 10 = +7%), playing another game, showing up in Kinship. Boosts are capped at +50%.
- Mars time runs 6x faster than real time during Alpha.
Don't invent new canon about SpaceCore, Xavier or Mars beyond this. If a question needs Paul's decision, say it hasn't been decided yet.`;
