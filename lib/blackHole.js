// THE BLACK HOLE (Update 5.55): a weekly mini deep-dive into one idea in
// space, physics or science, told the way the Interactive Assignments are:
// a step at a time, each with something to see and something to touch.
// 5-10 minutes each. Issues live here; the player is
// components/BlackHoleDive.js, which draws each step's `visual`.
//
// To add next week's: add an issue below with its steps. A step's visual
// must be one the player knows (see VISUALS in BlackHoleDive.js) - add a
// new one there if the idea needs it. Keep every fact checkable: these are
// real science, not 13i canon.

export const BLACK_HOLE_ISSUES = [
  {
    number: 1,
    slug: "the-shape-of-gravity",
    title: "The Shape of Gravity",
    subtitle: "what a black hole really is, and why time slows down near one",
    minutes: "7–9",
    published: "2026-10-05",
    next: "Next week: Quantum fluctuations. Empty space is never empty.",
    steps: [
      {
        id: "drop",
        kicker: "01 · A falling apple",
        title: "Drop something",
        visual: "drop",
        hint: "click (or tap) anywhere to drop a ball",
        text: [
          "Everything falls. For three hundred years we explained it Newton's way: every mass pulls on every other mass with a force.",
          "In 1915 Albert Einstein proposed something stranger. Nothing is pulling. Mass and energy bend the shape of space and time together, a single fabric called spacetime, and a falling object is simply following the straightest path it can through that bent shape.",
          "Those who made 13i perceived the universe first as gravity. So shall we, for the next few minutes.",
        ],
      },
      {
        id: "sheet",
        kicker: "02 · Spacetime",
        title: "A fabric that bends",
        visual: "sheet",
        hint: "drag the slider to add mass · click the sheet to roll a marble",
        text: [
          "Picture spacetime as a stretched sheet. Put something heavy on it and the sheet dips. Roll a marble nearby and its path curves toward the dip, not because anything grabbed it, but because that is the shape of the ground it is rolling on.",
          "The more mass, the deeper the dip. A planet makes a gentle dent. A star makes a bowl. Keep reading, because a black hole makes something no sheet can show.",
          "(The sheet is a picture, not the real thing: real spacetime curves in four dimensions, and time is bent as well as space. We'll get to time.)",
        ],
      },
      {
        id: "orbit",
        kicker: "03 · Orbits",
        title: "Falling sideways",
        visual: "orbit",
        hint: "set a speed, then launch",
        text: [
          "An orbit is a fall that keeps missing. Throw something sideways fast enough and, as it falls, the ground curves away beneath it just as fast.",
          "Too slow, and it spirals in. Just right, and it circles forever. Faster still, and it escapes completely. The speed you need to escape is called escape velocity: about 11.2 km per second from Earth's surface.",
          "Hold on to that number. It is the whole secret of a black hole.",
        ],
      },
      {
        id: "lens",
        kicker: "04 · Light",
        title: "Even light bends",
        visual: "lens",
        hint: "drag the dark mass across the galaxy",
        text: [
          "Light has no mass, but it still has to travel through spacetime, so it follows the same curves. A heavy object between us and a distant galaxy bends that galaxy's light around it, like a lens.",
          "Line them up exactly and the galaxy is smeared into a perfect circle called an Einstein ring.",
          "This was the first great test of Einstein's idea. During the solar eclipse of 1919, astronomers measured starlight bending around the Sun by 1.75 arcseconds, exactly the amount his theory predicted.",
        ],
      },
      {
        id: "clocks",
        kicker: "05 · Time",
        title: "Gravity slows time",
        visual: "clocks",
        hint: "slide the lower clock deeper into the well",
        text: [
          "Here is the part that sounds like science fiction and isn't. Time itself runs slower deeper in a gravity well. A clock on the floor ticks a tiny bit slower than a clock on a shelf.",
          "In 2010, physicists at NIST measured the difference between two atomic clocks set just 33 centimeters apart in height.",
          "Your phone depends on it. GPS satellites orbit where gravity is weaker, so their clocks run fast by about 45 microseconds a day, minus 7 for their speed: a net 38. Left uncorrected, GPS positions would drift by around 10 kilometers a day.",
        ],
      },
      {
        id: "squeeze",
        kicker: "06 · Squeeze",
        title: "Make Earth a black hole",
        visual: "squeeze",
        hint: "squeeze the Earth smaller",
        text: [
          "Escape velocity depends on how much mass there is and how close you are to its center. Keep the mass, shrink the size, and escape gets harder.",
          "Squeeze all of Earth into a ball with a radius under about 9 millimeters, less than two centimeters across, the size of a marble, and the escape velocity at its surface passes the speed of light. Nothing can go faster than light. So nothing escapes.",
          "That boundary is the event horizon, and its radius is the Schwarzschild radius. For the Sun it is about 3 kilometers. Every mass has one; most are hidden deep inside the object, where they don't matter.",
        ],
      },
      {
        id: "cones",
        kicker: "07 · The horizon",
        title: "Where every future points inward",
        visual: "cones",
        hint: "move the probe toward the black hole",
        text: [
          "Every moment, each possible future of a particle fits inside a cone: the places light could reach from here. Far from a black hole, the cone points up through time, and you can go any direction you like.",
          "Near the horizon, spacetime is so steeply curved that the cones tip over toward the hole. At the horizon, the outward edge of the cone points straight up. Even light aimed outward only hovers.",
          "Inside, every future, every possible path, leads further in. The center of a black hole isn't a place you avoid. It is a moment in your future, as unavoidable as tomorrow.",
        ],
      },
      {
        id: "fall",
        kicker: "08 · Falling in",
        title: "Watch a friend fall in",
        visual: "fall",
        hint: "switch between your view and theirs",
        text: [
          "Suppose a friend falls toward a black hole while you watch from far away. Their clock, as you see it, runs slower and slower. Their light stretches redder and dimmer. They seem to slow to a stop at the horizon and fade away, never quite crossing.",
          "From your friend's point of view, nothing special happens at the horizon. They cross it in a finite time and keep falling.",
          "Whether they survive the trip depends on size. Near a small black hole, the pull on their feet is so much stronger than on their head that they'd be stretched thin long before the horizon. Physicists really do call this spaghettification. A supermassive black hole is gentler: you could cross its horizon without feeling a thing.",
        ],
      },
      {
        id: "real",
        kicker: "09 · They're real",
        title: "We have seen their shadows",
        visual: "real",
        hint: "this is how a black hole looks, lit by its own disk",
        text: [
          "At the center of our galaxy sits Sagittarius A*, a black hole about four million times the mass of the Sun.",
          "In 2019 the Event Horizon Telescope, a network of radio dishes spanning the whole Earth, released the first image of a black hole's shadow: M87*, six and a half billion solar masses, in a galaxy 55 million light-years away. Sagittarius A* followed in 2022.",
          "What you see is a ring of glowing gas, bent around the hole by its gravity, and brighter on one side because that gas is racing toward us. The dark middle is the shadow of the horizon.",
        ],
      },
      {
        id: "hawking",
        kicker: "10 · Not quite black",
        title: "A faint glow at the edge",
        visual: "hawking",
        hint: "watch the edge of the horizon",
        text: [
          "In 1974 Stephen Hawking showed that black holes aren't perfectly black. Combine gravity with quantum mechanics and the horizon should give off a faint glow, now called Hawking radiation.",
          "One popular way to picture it: empty space constantly fizzes with pairs of particles that appear and vanish. At the horizon, one of a pair can fall in while the other escapes. (It's a picture, not the full math, but it points at something true.)",
          "For a black hole the mass of the Sun that glow is unimaginably cold, about 60 billionths of a degree above absolute zero. Over almost endless time, black holes slowly evaporate.",
          "Those fizzing pairs are quantum fluctuations: the restlessness of empty space itself. That's next week.",
        ],
      },
    ],
    quiz: [
      {
        q: "In Einstein's picture, why does a dropped apple fall?",
        options: ["A force reaches out and pulls it", "It follows the straightest path through spacetime curved by Earth's mass", "Air pressure pushes it down"],
        answer: 1,
      },
      {
        q: "Where does a clock tick slower?",
        options: ["On a GPS satellite", "On the ground floor", "They always tick at the same rate"],
        answer: 1,
      },
      {
        q: "About how small would Earth have to be squeezed to become a black hole?",
        options: ["About the size of a marble", "About the size of a city", "It can never become one"],
        answer: 0,
      },
    ],
  },
];

export const issueFor = (n) => BLACK_HOLE_ISSUES.find((i) => i.number === Number(n)) || null;
