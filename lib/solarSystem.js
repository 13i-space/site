// The solar system for Mission Control's DEEP SPACE console (Update 6.26):
// where the planets are (worked out here from their orbits - no service
// needed) and the deep-space missions we show, with their facts.
// Spacecraft positions come from JPL Horizons (lib/deepSpace.js).
//
// Coordinates are heliocentric ecliptic (J2000), in AU: x toward the vernal
// equinox, z out of the plane of the planets.

// Keplerian elements and their rates per century, valid 1800-2050
// (E. M. Standish, JPL, "Approximate Positions of the Planets", table 1):
// a (AU), e, I (deg), L mean longitude (deg), long. of perihelion (deg), node (deg)
export const PLANETS = [
  { id: "mercury", name: "Mercury", color: "#b8b0a8", size: 2.2, el: [0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.2503235, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081] },
  { id: "venus", name: "Venus", color: "#e8cfa0", size: 3.2, el: [0.72333566, 0.0000039, 0.00677672, -0.00004107, 3.39467605, -0.0007889, 181.9790995, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418] },
  { id: "earth", name: "Earth", color: "#7fb2ff", size: 3.4, el: [1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0, 0] },
  { id: "mars", name: "Mars", color: "#d98b6a", size: 2.8, el: [1.52371034, 0.00001847, 0.0933941, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343] },
  { id: "jupiter", name: "Jupiter", color: "#e0bf98", size: 5.5, el: [5.202887, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106] },
  { id: "saturn", name: "Saturn", color: "#e8d6a8", size: 4.8, ring: true, el: [9.53667594, -0.0012506, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794] },
  { id: "uranus", name: "Uranus", color: "#a8e0e8", size: 3.8, el: [19.18916464, -0.00196176, 0.04725744, -0.00004397, 0.77263783, -0.00242939, 313.23810451, 428.48202785, 170.9542763, 0.40805281, 74.01692503, 0.04240589] },
  { id: "neptune", name: "Neptune", color: "#7f9cff", size: 3.8, el: [30.06992276, 0.00026291, 0.00859048, 0.00005105, 1.77004347, 0.00035372, -55.12002969, 218.45945325, 44.96476227, -0.32241464, 131.78422574, -0.00508664] },
  { id: "pluto", name: "Pluto", color: "#c9b9a8", size: 1.8, dwarf: true, el: [39.48211675, -0.00031596, 0.2488273, 0.0000517, 17.14001206, 0.00004818, 238.92903833, 145.20780515, 224.06891629, -0.04062942, 110.30393684, -0.01183482] },
];

const RAD = Math.PI / 180;

function elementsAt(p, ms) {
  const T = (ms / 86400000 + 2440587.5 - 2451545) / 36525;
  const e = p.el;
  return {
    a: e[0] + e[1] * T, ecc: e[2] + e[3] * T, I: (e[4] + e[5] * T) * RAD,
    L: (e[6] + e[7] * T) * RAD, w: (e[8] + e[9] * T) * RAD, O: (e[10] + e[11] * T) * RAD,
  };
}

function toXYZ({ a, ecc, I, w, O }, E) {
  const xp = a * (Math.cos(E) - ecc), yp = a * Math.sqrt(1 - ecc * ecc) * Math.sin(E);
  const om = w - O; // argument of perihelion
  const co = Math.cos(om), so = Math.sin(om), cO = Math.cos(O), sO = Math.sin(O), cI = Math.cos(I), sI = Math.sin(I);
  return [
    (co * cO - so * sO * cI) * xp + (-so * cO - co * sO * cI) * yp,
    (co * sO + so * cO * cI) * xp + (-so * sO + co * cO * cI) * yp,
    so * sI * xp + co * sI * yp,
  ];
}

// heliocentric ecliptic position of a planet at a time (ms since 1970), in AU
export function planetAt(p, ms = Date.now()) {
  const k = elementsAt(p, ms);
  let M = (k.L - k.w) % (2 * Math.PI);
  if (M > Math.PI) M -= 2 * Math.PI;
  if (M < -Math.PI) M += 2 * Math.PI;
  let E = M + k.ecc * Math.sin(M);
  for (let i = 0; i < 8; i++) E -= (E - k.ecc * Math.sin(E) - M) / (1 - k.ecc * Math.cos(E));
  return toXYZ(k, E);
}

// points round a planet's whole orbit, for drawing it
export function orbitPath(p, ms = Date.now(), n = 180) {
  const k = elementsAt(p, ms);
  return Array.from({ length: n + 1 }, (_, i) => toXYZ(k, (i / n) * 2 * Math.PI));
}

export const dist = (a, b = [0, 0, 0]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export const LIGHT_SECONDS_PER_AU = 499.005;

// The missions. `horizons` is the spacecraft's ID in JPL Horizons, and `match`
// must appear in the name Horizons reports back, so a wrong or reused ID is
// caught rather than drawn in the wrong place. Missions working at a planet use
// `at` (the planet's own position). `approx` is a rough position (ecliptic
// longitude, latitude in degrees, distance in AU, late 2026) used, and marked
// "approximate", only if Horizons can't be reached.
export const MISSIONS = [
  {
    id: "voyager1", name: "Voyager 1", agency: ["NASA"], launched: "1977-09-05", horizons: "-31", match: /voyager\s*-?\s*1\b/i,
    approx: [255.5, 35, 171], region: "Interstellar space", color: "#E8CFC0",
    objective: "Flew past Jupiter (1979) and Saturn (1980), then kept going. In August 2012 it became the first spacecraft to cross into interstellar space.",
    now: "The farthest object humans have made. Around November 2026 it reaches one light-day from Earth. Instruments are being switched off one by one to save power.",
  },
  {
    id: "voyager2", name: "Voyager 2", agency: ["NASA"], launched: "1977-08-20", horizons: "-32", match: /voyager\s*-?\s*2\b/i,
    approx: [289, -32, 143], region: "Interstellar space", color: "#E8CFC0",
    objective: "The only spacecraft to visit Uranus (1986) and Neptune (1989), after Jupiter and Saturn. Crossed into interstellar space in November 2018.",
    now: "Still sending data from beyond the heliosphere, on a shrinking power budget.",
  },
  {
    id: "newhorizons", name: "New Horizons", agency: ["NASA"], launched: "2006-01-19", horizons: "-98", match: /new\s*horizons/i,
    approx: [287, 2, 63], region: "Kuiper Belt", color: "#B9C0FF",
    objective: "Gave us the first close look at Pluto and Charon (July 2015), then flew past the Kuiper Belt object Arrokoth (January 2019), the most distant world ever explored.",
    now: "Crossing the Kuiper Belt, measuring the dust, plasma and faint light of the outer solar system.",
  },
  {
    id: "europaclipper", name: "Europa Clipper", agency: ["NASA"], launched: "2024-10-14", horizons: "-159", match: /europa\s*clipper|clipper/i,
    region: "Cruise to Jupiter", color: "#B9C0FF",
    objective: "To find out whether the ocean under Europa's ice could support life, with about 49 close flybys of Jupiter's moon.",
    now: "On its way. A Mars flyby in March 2025 and an Earth flyby in December 2026 sling it to Jupiter in April 2030.",
  },
  {
    id: "juice", name: "JUICE", agency: ["ESA"], launched: "2023-04-14", horizons: "-28", match: /juice|jupiter\s*icy/i,
    region: "Cruise to Jupiter", color: "#B9C0FF",
    objective: "The Jupiter Icy Moons Explorer will study Ganymede, Callisto and Europa, and become the first spacecraft to orbit a moon other than ours (Ganymede, 2034).",
    now: "Looping the inner solar system for gravity assists from Earth and Venus. Due at Jupiter in July 2031.",
  },
  {
    id: "bepicolombo", name: "BepiColombo", agency: ["ESA", "JAXA"], launched: "2018-10-20", horizons: "-121", match: /bepi/i,
    region: "Arriving at Mercury", color: "#B9C0FF",
    objective: "Two orbiters, one European and one Japanese, to map Mercury and study its magnetic field and how the planet formed so close to the Sun.",
    now: "After six Mercury flybys, it is due to enter orbit around Mercury in late 2026.",
  },
  {
    id: "parker", name: "Parker Solar Probe", agency: ["NASA"], launched: "2018-08-12", horizons: "-96", match: /parker|solar\s*probe/i,
    region: "Orbiting the Sun", color: "#E8CFC0",
    objective: "To fly through the Sun's outer atmosphere, the corona, and learn how it heats up and launches the solar wind.",
    now: "Dips to 6.1 million km from the Sun's surface every 88 days, at about 690,000 km/h, the fastest any human-made object has gone.",
  },
  {
    id: "solarorbiter", name: "Solar Orbiter", agency: ["ESA", "NASA"], launched: "2020-02-10", horizons: "-144", match: /solar\s*orbiter/i,
    region: "Orbiting the Sun", color: "#E8CFC0",
    objective: "To take the first pictures of the Sun's poles, by tilting its orbit further out of the plane of the planets at each Venus flyby.",
    now: "Imaging the Sun from inside Mercury's orbit at its closest.",
  },
  {
    id: "psyche", name: "Psyche", agency: ["NASA"], launched: "2023-10-13", horizons: "-255", match: /psyche/i,
    region: "Cruise to the asteroid belt", color: "#B9C0FF",
    objective: "To explore 16 Psyche, a metal-rich asteroid that may be the exposed core of an early planet.",
    now: "Pushed by its electric thrusters after a Mars flyby in 2026. Arrives at Psyche in 2029.",
  },
  {
    id: "lucy", name: "Lucy", agency: ["NASA"], launched: "2021-10-16", horizons: "-49", match: /lucy/i,
    region: "Asteroid belt and beyond", color: "#B9C0FF",
    objective: "To visit the Trojan asteroids that share Jupiter's orbit, leftovers from the birth of the planets. It has flown past the asteroids Dinkinesh (2023) and Donaldjohanson (2025).",
    now: "Heading out to its first Trojan, Eurybates, in 2027.",
  },
  {
    id: "hera", name: "Hera", agency: ["ESA"], launched: "2024-10-07", horizons: "-91", match: /hera/i,
    region: "Arriving at Didymos", color: "#B9C0FF",
    objective: "To survey the asteroid moon Dimorphos after NASA's DART spacecraft hit it in 2022, turning planetary defence into a repeatable technique.",
    now: "Closing on the asteroid pair Didymos and Dimorphos, due in late 2026.",
  },
  {
    id: "osirisapex", name: "OSIRIS-APEX", agency: ["NASA"], launched: "2016-09-08", horizons: "-64", match: /osiris/i,
    region: "Cruise to Apophis", color: "#B9C0FF",
    objective: "As OSIRIS-REx it brought a sample of asteroid Bennu to Earth in 2023. Renamed OSIRIS-APEX, it is now bound for Apophis.",
    now: "Meeting Apophis in 2029, just after the asteroid passes closer to Earth than our TV satellites.",
  },
  {
    id: "hayabusa2", name: "Hayabusa2", agency: ["JAXA"], launched: "2014-12-03", horizons: "-37", match: /hayabusa\s*2|hayabusa2/i,
    region: "Extended mission", color: "#B9C0FF",
    objective: "Brought pieces of asteroid Ryugu back to Earth in 2020, the first sample from a carbon-rich asteroid.",
    now: "On an extended mission to the tiny, fast-spinning asteroid 1998 KY26, arriving in 2031.",
  },
  {
    id: "jwst", name: "James Webb Space Telescope", agency: ["NASA", "ESA", "CSA"], launched: "2021-12-25", at: "earth",
    region: "Sun-Earth L2", color: "#E8CFC0",
    objective: "The largest telescope in space, looking in infrared at the first galaxies, newborn stars and the atmospheres of other worlds.",
    now: "Orbiting the L2 point, 1.5 million km beyond Earth (too close to Earth to separate at this scale).",
  },
  {
    id: "marsfleet", name: "The Mars fleet", agency: ["NASA", "ESA", "CNSA", "UAE"], at: "mars",
    region: "At Mars", color: "#d98b6a",
    objective: "Rovers Perseverance (Jezero Crater, since 2021) and Curiosity (Gale Crater, since 2012) on the ground; orbiters including MAVEN, Mars Reconnaissance Orbiter, Mars Express, Trace Gas Orbiter, Tianwen-1 and Hope overhead.",
    now: "Perseverance is collecting rock samples for a future return to Earth.",
  },
];

// distance of the termination shock and heliopause, roughly (AU)
export const HELIO = { terminationShock: 90, heliopause: 120 };
