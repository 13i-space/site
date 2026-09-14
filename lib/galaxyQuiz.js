// Quiz question sets, keyed by month, so a new one can be dropped in on a
// rotation without touching the component. "current" always points at
// whichever set should be live right now.

const SETS = {
  "2027-04": [
    {
      q: "What is the name of the supermassive black hole at the center of the Milky Way?",
      options: ["Sagittarius A*", "Cygnus X-1", "Andromeda Prime", "The Great Attractor"],
      answer: 0,
      fact: "Sagittarius A* sits about 26,000 light-years from Earth and weighs roughly 4 million times the mass of the sun.",
    },
    {
      q: "Light from the sun takes about how long to reach Earth?",
      options: ["8 minutes", "8 seconds", "8 hours", "8 days"],
      answer: 0,
      fact: "So whenever you look at the sun, you're seeing it as it was about 8 minutes ago.",
    },
    {
      q: "Which of these is NOT a real type of galaxy shape?",
      options: ["Spiral", "Elliptical", "Irregular", "Helical"],
      answer: 3,
      fact: "The main real categories are spiral, elliptical, lenticular, and irregular — 'helical' isn't one of them.",
    },
    {
      q: "What eventually happens when a star like our sun runs out of fuel?",
      options: ["It becomes a black hole", "It becomes a white dwarf", "It explodes as a supernova", "It becomes a pulsar"],
      answer: 1,
      fact: "Sun-sized stars end their lives as white dwarfs; supernovae, black holes, and pulsars are the fate of much more massive stars.",
    },
    {
      q: "Roughly how many galaxies are estimated to exist in the observable universe?",
      options: ["About 10 thousand", "About 2 million", "About 2 trillion", "About 500"],
      answer: 2,
      fact: "Estimates have shifted over time, but recent surveys put the number at roughly 2 trillion galaxies.",
    },
    {
      q: "What is a light-year a measurement of?",
      options: ["Time", "Distance", "Brightness", "Speed"],
      answer: 1,
      fact: "A light-year is how far light travels in one year (about 5.88 trillion miles) — it measures distance, not time.",
    },
    {
      q: "Which nearby galaxy is on a slow collision course with the Milky Way?",
      options: ["Triangulum", "Andromeda", "Whirlpool Galaxy", "Sombrero Galaxy"],
      answer: 1,
      fact: "The Andromeda Galaxy is expected to collide with the Milky Way in roughly 4-4.5 billion years.",
    },
    {
      q: "What are the swirling clouds of gas and dust where stars are born called?",
      options: ["Nebulae", "Quasars", "Asteroids", "Comets"],
      answer: 0,
      fact: "Nebulae are stellar nurseries — dense clouds of gas and dust that collapse under gravity to form new stars.",
    },
  ],
};

export const currentSetKey = "2027-04";
export const questions = SETS[currentSetKey];
