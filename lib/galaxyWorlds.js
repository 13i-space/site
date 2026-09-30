// Places on the Galaxy Map (components/GalaxyMap.js).
//
// Positions are in map units: the galactic center is (0, 0) and the disk's
// edge is radius 1 (~50,000 light-years). Earth's spot is real-world
// astronomy; the Assignment worlds' spots are invented for the map only -
// see WORLD.md ("Galaxy map placements") before treating them as canon.
//
// A world with an `assignment` number only appears once the signed-in
// visitor has read that Assignment (reading_progress, via TrackStoryRead).

function polar(r, angle) {
  return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
}

export const LANDMARKS = [
  {
    id: "earth",
    name: "Earth",
    ...polar(0.52, -Math.PI / 2),
    color: "#8B95F6",
    pulse: true,
    text: "You are here: the Orion Spur, a minor arm about 26,000 light-years from the center.",
  },
  {
    id: "sgr-a",
    name: "Sagittarius A*",
    short: "Sgr A*",
    x: 0,
    y: 0,
    color: "#E8CFC0",
    text: "The supermassive black hole at the center, around 4 million times the Sun's mass.",
  },
];

export const STORY_WORLDS = [
  {
    id: "first-silence",
    assignment: 1,
    name: "Novaux-4",
    // an old world, so it sits in toward the core where the older stellar
    // populations are - on the Scutum-Centaurus Arm, just past the bar's end
    ...polar(0.24, 2.9),
    labelLeft: true, // keeps its name clear of Sagittarius A*
    binary: true, // drawn with its ringed twin beside it
    color: "#E8CFC0",
    text: "13i's home world, one of the galaxy's older civilizations. Fourth or fifth from its star, depending on its dance with a ringed twin that has been silent since Assignment 0000001.",
    story: { title: "The First Silence", href: "/assignments/0000001" },
  },
  {
    id: "veyra",
    assignment: 87,
    name: "Veyra",
    ...polar(0.48, 0.55),
    color: "#E8CFC0",
    text: "Home of the Deep Walkers, a world that is both their nervous system and their archive.",
    story: { title: "The Deep Walkers", href: "/assignments/87" },
  },
  {
    id: "nerath",
    assignment: 215783,
    name: "Nerath",
    ...polar(0.68, -2.55),
    color: "#E8CFC0",
    text: "A liquid world, home to a species whose sixteen appendage minds can overrule the central one.",
    story: { title: "Nerath's Secret", href: "/assignments/215783" },
  },
];
