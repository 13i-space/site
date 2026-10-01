// Species recorded by 13i in the Archive's own stories, as Alien Lab cards
// (components/AlienCard.js). Unlike Kin species these aren't in the
// database: they ship with the site, one per story bundle, and link back to
// their story. Answers use the Alien Lab's own questions (lib/alienQuestions.js)
// so the card, its signal and the Survival Trials all work the same way.

import { keyFor } from "./alienTraits";

const answersFrom = (pairs) => Object.fromEntries(pairs.map(([id, v]) => [keyFor(id), v]));

// A lattice of holders under ice, the young in still water below.
function holderPortrait() {
  const cells = [];
  const R = 22;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      const x = 14 + col * 40 + (row % 2) * 20;
      const y = 52 + row * 26;
      const pts = Array.from({ length: 6 }, (_, k) => {
        const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
        return `${(x + Math.cos(a) * R).toFixed(1)},${(y + Math.sin(a) * R * 0.62).toFixed(1)}`;
      }).join(" ");
      const first = row === 3 && col === 3;
      const old = col === 0 || col === 7;
      const lit = (row + col) % 3 === 0;
      cells.push(
        `<polygon points="${pts}" fill="${first ? "#E8CFC0" : old ? "#E4E6F6" : "#96A5FF"}" fill-opacity="${first ? 0.35 : old ? 0.3 : lit ? 0.24 : 0.13}" stroke="${first ? "#E8CFC0" : old ? "#ECEEFF" : "#8B95F6"}" stroke-opacity="0.8" stroke-width="${first ? 1.6 : 0.9}"/>` +
        `<path d="M${x - 7} ${y + 12} q2 9 0 16 M${x} ${y + 13} q-2 9 0 17 M${x + 7} ${y + 12} q2 9 0 16" stroke="#8B95F6" stroke-opacity="0.3" stroke-width="0.7" fill="none"/>` +
        (lit || first ? `<circle cx="${x}" cy="${y}" r="${first ? 9 : 6}" fill="url(#knot${first ? "W" : ""})"/>` : "")
      );
    }
  }
  const young = Array.from({ length: 34 }, (_, i) => {
    const x = 10 + ((i * 89) % 290), y = 168 + ((i * 37) % 44);
    return `<circle cx="${x}" cy="${y}" r="5" fill="url(#knotW)" opacity="0.55"/><circle cx="${x}" cy="${y}" r="1" fill="#F4E4DA"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1336"/><stop offset="1" stop-color="#03040c"/></linearGradient>
<radialGradient id="knot"><stop offset="0" stop-color="#B9C0FF" stop-opacity="0.9"/><stop offset="1" stop-color="#B9C0FF" stop-opacity="0"/></radialGradient>
<radialGradient id="knotW"><stop offset="0" stop-color="#E8CFC0" stop-opacity="0.95"/><stop offset="1" stop-color="#E8CFC0" stop-opacity="0"/></radialGradient>
</defs>
<rect width="300" height="220" fill="url(#bg)"/>
<path d="M0 0 H300 V28 L280 33 L255 26 L230 34 L200 27 L170 35 L140 28 L110 34 L80 27 L50 33 L20 26 L0 31 Z" fill="#28305e"/>
${cells.join("")}
${young}
</svg>`;
}

export const ARCHIVE_SPECIES = {
  28657: {
    id: "archive-28657",
    archive: true,
    cardLabel: "No. 0028657",
    href: "/assignments/28657",
    hrefLabel: "the story →",
    name: "The Holders",
    created_at: "2026-10-01T12:00:00Z",
    world: "Tacet",
    story: "The Quiet Moon",
    answers: answersFrom([
      ["star_type", "No true daylight — they live by other light"],
      ["gravity", "Noticeably lighter"],
      ["atmosphere", "No atmosphere at all"],
      ["terrain", "Ice and cold"],
      ["size", "Large — twice human height or more"],
      ["symmetry", "Radial — symmetrical around a center point"],
      ["limbs", "None — no limbs at all"],
      ["locomotion", "Floating or drifting"],
      ["manipulation", "No manipulating limbs — they don't build or hold things"],
      ["exterior", "A soft, bioluminescent membrane"],
      ["primary_sense", "Vibration through a surface"],
      ["temperament", "Curious — they investigate"],
      ["social_structure", "Large collective societies"],
      ["core_value", "Survival — continuance of the group"],
      ["tech_basis", "None — they have no technology as we'd recognize it"],
      ["tech_level", "Primitive by our standards"],
    ]),
    stats: {
      strength: 5, endurance: 45, agility: 5, durability: 45,
      problem_solving: 10, memory: 20, social: 55, adaptability: 15,
      sensory: 35, specialization: 15,
      longevity: 15, reproduction: 35,
    },
    review: {
      verdict: "granted",
      text: "We weigh how a species works with itself before anything else. The holders do almost nothing else. Every shock that reaches them is shared until no single body bears too much of it, and their strongest stand where the shocks are worst. They have no tools, no cities and no science we could recognize, and they do not need any. Their cooperation is their technology.",
      learned: "We cannot yet know what they would do if the giant's tides ever grew stronger than the lattice can carry. We have seen them let go of their spent. We have not seen them abandon anyone.",
    },
    portrait_svg: holderPortrait(),
  },
};
