// Species recorded by 13i in the Archive's own stories, as Alien Lab cards
// (components/AlienCard.js). Unlike Kin species these aren't in the
// database: they ship with the site, one per story bundle, and link back to
// their story. Answers use the Alien Lab's own questions (lib/alienQuestions.js)
// so the card, its signal and the Survival Trials all work the same way.

import { keyFor } from "./alienTraits";

const answersFrom = (pairs) => Object.fromEntries(pairs.map(([id, v]) => [keyFor(id), v]));

// A lattice of holders under ice, the young in still water below.
function holderPortrait(solid = true) {
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
        `<polygon points="${pts}" fill="${solid ? (first ? "#E8CFC0" : old ? "#B8BEE6" : lit ? "#6C7BE0" : "#3E4AA6") : first ? "#E8CFC0" : old ? "#E4E6F6" : "#96A5FF"}" fill-opacity="${solid ? 1 : first ? 0.35 : old ? 0.3 : lit ? 0.24 : 0.13}" stroke="${first ? "#E8CFC0" : old ? "#ECEEFF" : "#8B95F6"}" stroke-opacity="0.8" stroke-width="${first ? 1.6 : 0.9}"/>` +
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


// A walker on Veyra: low and plated, six thick limbs pressed into stone,
// its pulses running down through the crust; the towers behind.
function walkerPortrait(solid = true) {
  const towers = [[22, 60, 10], [58, 30, 8], [250, 42, 12], [282, 70, 7], [200, 76, 6]]
    .map(([x, top, w]) => `<path d="M${x - w} 120 L${x - w * 0.6} ${top} L${x + w * 0.6} ${top - 4} L${x + w} 120 Z" fill="#221d33"/>`).join("");
  const legs = [-1, -0.6, -0.2, 0.2, 0.6, 1].map((k) => {
    const x = 150 + k * 62;
    return `<path d="M${150 + k * 40} 116 Q${x} 118 ${x + k * 6} 134" stroke="${solid ? "#6A5FA6" : "#4a4466"}" stroke-width="7" stroke-linecap="round" fill="none"/>` +
      `<ellipse cx="${x + k * 6}" cy="135" rx="7" ry="3" fill="#8B95F6" opacity="0.55"/>`;
  }).join("");
  const plates = Array.from({ length: 7 }, (_, i) => `<path d="M${98 + i * 15} 112 q8 -16 16 0" fill="${solid ? "#8478C4" : "#3a3456"}" stroke="${solid ? "#DCDFFF" : "#6E76B8"}" stroke-width="0.8"/>`).join("");
  const roots = [[110, 136], [150, 137], [196, 136]].map(([x, y], i) =>
    `<path d="M${x} ${y} q${-12 + i * 10} 26 ${-4 + i * 6} 50 m0 0 q-14 14 -26 20 m26 -20 q12 18 24 22" stroke="#E8CFC0" stroke-opacity="0.55" stroke-width="0.9" fill="none"/>` +
    `<circle cx="${x - 4 + i * 6}" cy="${y + 50}" r="5" fill="#E8CFC0" opacity="0.5"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f40"/><stop offset="1" stop-color="#3a3a52"/></linearGradient>
<linearGradient id="rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26213a"/><stop offset="1" stop-color="#0e0b18"/></linearGradient></defs>
<rect width="300" height="220" fill="url(#rock)"/>
<rect width="300" height="122" fill="url(#sky)"/>
${towers}
<path d="M0 120 Q80 112 150 120 T300 118 V128 H0 Z" fill="#2a2440"/>
${roots}
<ellipse cx="150" cy="112" rx="66" ry="16" fill="${solid ? "#5B4F92" : "#2c2746"}"${solid ? ' stroke="#B9C0FF" stroke-width="1"' : ""}/>
${plates}
${legs}
</svg>`;
}

// A Nerathi: a rounded central body in its flexible shell, sixteen long
// appendages, each dividing at the tip; four are lit (the ones that disagree).
function nerathiPortrait(solid = true) {
  const limbs = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 + 0.1;
    const lit = [2, 6, 11].includes(i);
    const len = 70 + (i % 3) * 10;
    const x1 = 150 + Math.cos(a) * 26, y1 = 110 + Math.sin(a) * 22;
    const cx = 150 + Math.cos(a + 0.35) * len * 0.6, cy = 110 + Math.sin(a + 0.35) * len * 0.5;
    const x2 = 150 + Math.cos(a) * len, y2 = 110 + Math.sin(a) * len * 0.78;
    const tips = [-0.25, 0, 0.25].map((d) => `<path d="M${x2.toFixed(1)} ${y2.toFixed(1)} l${(Math.cos(a + d) * 9).toFixed(1)} ${(Math.sin(a + d) * 9).toFixed(1)}" stroke="${lit ? "#E8CFC0" : "#8B95F6"}" stroke-width="0.8"/>`).join("");
    return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${lit ? "#E8CFC0" : solid ? "#7F89E8" : "#6E76B8"}" stroke-width="${solid ? (lit ? 4 : 3.4) : lit ? 3 : 2.4}" stroke-linecap="round" fill="none" opacity="${solid ? 1 : lit ? 0.95 : 0.75}"/>` + tips +
      (lit ? `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="9" fill="url(#limbGlow)"/>` : "");
  }).join("");
  const motes = Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 73) % 300}" cy="${(i * 41) % 220}" r="${0.6 + (i % 3) * 0.4}" fill="#B9C0FF" opacity="0.35"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14245a"/><stop offset="1" stop-color="#03061a"/></linearGradient>
<radialGradient id="core" cx="0.4" cy="0.35"><stop offset="0" stop-color="#B9C0FF"/><stop offset="1" stop-color="#2a2f6b"/></radialGradient>
<radialGradient id="limbGlow"><stop offset="0" stop-color="#E8CFC0" stop-opacity="0.9"/><stop offset="1" stop-color="#E8CFC0" stop-opacity="0"/></radialGradient></defs>
<rect width="300" height="220" fill="url(#sea)"/>
<path d="M30 0 L60 220 M110 0 L130 220 M210 0 L190 220 M270 0 L250 220" stroke="#8B95F6" stroke-opacity="0.07" stroke-width="16"/>
${motes}
${limbs}
<ellipse cx="150" cy="110" rx="30" ry="25" fill="url(#core)" stroke="#8B95F6" stroke-width="1.2"/>
<ellipse cx="143" cy="102" rx="9" ry="6" fill="#DCDFFF" opacity="0.35"/>
</svg>`;
}

// A returner on the sea of glass: three long legs, a column of glass
// rings round a glowing core, a crown of facets casting light; the red star
// low behind, the white companion high.
function returnerPortrait(solid = true) {
  const rings = Array.from({ length: 9 }, (_, k) => {
    const f = (k + 1) / 9, w = 6 + f * 12;
    const c = ["#F4F6FF", "#FFF1D6", "#F6D9A8", "#E9B98A", "#D99A6A"][Math.min(4, Math.floor(f * 5))];
    return `<path d="M${150 - w} 150 Q${150 - w * 1.1} 110 ${150 - w * 0.75} 70 L${150 + w * 0.75} 70 Q${150 + w * 1.1} 110 ${150 + w} 150 Z" fill="${c}" fill-opacity="${solid ? 0.92 : 0.13}" stroke="#F4F6FF" stroke-opacity="${solid ? 0.7 : 0.35}" stroke-width="0.6"/>`;
  }).reverse().join("");
  const crown = [-2, -1, 0, 1, 2].map((k) => `<path d="M${150 + k * 5} 70 L${150 + k * 10} ${56 - (2 - Math.abs(k)) * 4} L${154 + k * 10} 70 Z" fill="#F4F6FF" opacity="0.85"/>`).join("");
  const glints = Array.from({ length: 30 }, (_, i) => `<path d="M${(i * 97) % 300} ${165 + ((i * 37) % 52)} h4 m-2 -2 v4" stroke="#FFF1D6" stroke-width="0.6" opacity="0.6"/>`).join("");
  const shards = Array.from({ length: 22 }, (_, i) => `<path d="M${(i * 61) % 300} ${(i * 29) % 140} l2 4 l-2 4 l-2 -4 Z" fill="${i % 3 ? "#E9B98A" : "#F4F6FF"}" opacity="0.55"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120a18"/><stop offset="0.7" stop-color="#3a1622"/><stop offset="1" stop-color="#7a3328"/></linearGradient>
<linearGradient id="glassSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c7c2"/><stop offset="1" stop-color="#4b4058"/></linearGradient>
<radialGradient id="coreW"><stop offset="0" stop-color="#FFF1D6" stop-opacity="1"/><stop offset="1" stop-color="#FFF1D6" stop-opacity="0"/></radialGradient>
<radialGradient id="white"><stop offset="0" stop-color="#ffffff" stop-opacity="1"/><stop offset="1" stop-color="#e6ecff" stop-opacity="0"/></radialGradient></defs>
<rect width="300" height="220" fill="url(#sky)"/>
<circle cx="236" cy="34" r="16" fill="url(#white)"/><circle cx="236" cy="34" r="2.5" fill="#fff"/>
<path d="M40 162 A34 34 0 0 1 108 162 Z" fill="#E06A50"/>
${shards}
<rect y="160" width="300" height="60" fill="url(#glassSea)"/>
${glints}
<path d="M150 150 L128 206 M150 150 L172 206 M150 150 L153 212" stroke="#E4DCEB" stroke-width="2" stroke-linecap="round"/>
${rings}
<circle cx="150" cy="108" r="26" fill="url(#coreW)"/>
<circle cx="150" cy="108" r="3" fill="#fff"/>
${crown}
<path d="M156 60 L262 98 L256 112 Z" fill="#F4F6FF" opacity="0.12"/>
</svg>`;
}


// A Velani at a window over a city at night: tall and narrow, long hands,
// the neck membranes flushed; satellites crossing the sky, the moon above.
function velaniPortrait(solid = true) {
  const towers = Array.from({ length: 16 }, (_, i) => {
    const x = i * 20 + ((i * 7) % 9), h = 40 + ((i * 53) % 70);
    const lights = Array.from({ length: Math.floor(h / 9) }, (_, k) => ((i + k) % 3 ? "" : `<rect x="${x + 3}" y="${200 - h + 4 + k * 9}" width="8" height="2" fill="#F6D9A8" opacity="0.7"/>`)).join("");
    return `<rect x="${x}" y="${200 - h}" width="14" height="${h}" fill="#0b0d22"/>${lights}`;
  }).join("");
  const sats = Array.from({ length: 14 }, (_, i) => `<circle cx="${(i * 71) % 300}" cy="${12 + ((i * 29) % 60)}" r="0.9" fill="#DCDFFF"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05060f"/><stop offset="1" stop-color="#1a2a5a"/></linearGradient>
<radialGradient id="neck"><stop offset="0" stop-color="#E8B4C8" stop-opacity="0.9"/><stop offset="1" stop-color="#E8B4C8" stop-opacity="0"/></radialGradient></defs>
<rect width="300" height="220" fill="url(#sky)"/>
${sats}
<circle cx="238" cy="36" r="13" fill="#9a9aa8"/><circle cx="242" cy="40" r="1.6" fill="#E9D29A"/>
${towers}
<rect y="200" width="300" height="20" fill="#04050c"/>
<g transform="translate(118 0)">
<ellipse cx="32" cy="70" rx="15" ry="20" fill="${solid ? "#3B4FA8" : "#121534"}" stroke="#6A8FE8" stroke-width="1.2"/>
<path d="M22 88 L12 140 L16 220 L48 220 L52 140 L42 88 Z" fill="${solid ? "#2C3C88" : "#121534"}" stroke="#6A8FE8" stroke-width="1.2"/>
<circle cx="32" cy="94" r="22" fill="url(#neck)"/>
<ellipse cx="26" cy="94" rx="3" ry="9" fill="#E8B4C8"/><ellipse cx="38" cy="94" rx="3" ry="9" fill="#E9D29A"/>
<path d="M14 112 Q-4 150 6 176 M50 112 Q68 150 58 176" fill="none" stroke="${solid ? "#8FA8F0" : "#6A8FE8"}" stroke-width="${solid ? 3.2 : 2}"/>
<path d="M6 176 l-4 8 M6 176 l-1 9 M6 176 l2 9 M6 176 l5 8 M6 176 l7 6 M6 176 l-6 6" stroke="#6A8FE8" stroke-width="0.9"/>
<ellipse cx="27" cy="66" rx="2.4" ry="3" fill="#FFF4DC"/><ellipse cx="37" cy="66" rx="2.4" ry="3" fill="#FFF4DC"/>
</g>
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
    portrait_svg: holderPortrait(true),
    portrait_line_svg: holderPortrait(false),
  },
  87: {
    id: "archive-87",
    archive: true,
    cardLabel: "No. 0000087",
    href: "/assignments/87",
    hrefLabel: "the story →",
    name: "The Deep Walkers",
    created_at: "2026-10-05T12:00:00Z",
    world: "Veyra",
    story: "The Deep Walkers",
    answers: answersFrom([
      ["star_type", "No true daylight — they live by other light"],
      ["gravity", "About the same"],
      ["atmosphere", "Thick and toxic to most life"],
      ["terrain", "Desert and rock"],
      ["size", "Large — twice human height or more"],
      ["symmetry", "Radial — symmetrical around a center point"],
      ["limbs", "Six"],
      ["locomotion", "Walking or running"],
      ["manipulation", "No manipulating limbs — they don't build or hold things"],
      ["exterior", "A hard exoskeleton"],
      ["primary_sense", "Vibration through a surface"],
      ["temperament", "Cautious — they observe from a distance first"],
      ["social_structure", "Large collective societies"],
      ["core_value", "Harmony — balance with their environment"],
      ["tech_basis", "None — they have no technology as we'd recognize it"],
      ["tech_level", "Primitive by our standards"],
    ]),
    stats: {
      strength: 30, endurance: 40, agility: 5, durability: 25,
      problem_solving: 10, memory: 45, social: 35, adaptability: 10,
      sensory: 35, specialization: 15,
      longevity: 40, reproduction: 10,
    },
    review: {
      verdict: "granted",
      text: "No walker decides alone. Each brings what it has felt through the stone, and together they know what none of them could know by itself. Their dead go on speaking to them through the rock for generations, and the living listen. We have rarely seen a species so slow, and never one so certain of its own patience.",
      learned: "We do not know where one of them ends and the planet begins. We are no longer sure the question means what we thought it meant.",
    },
    portrait_svg: walkerPortrait(true),
    portrait_line_svg: walkerPortrait(false),
  },
  215783: {
    id: "archive-215783",
    archive: true,
    cardLabel: "No. 0215783",
    href: "/assignments/215783",
    hrefLabel: "the story →",
    name: "The Nerathi",
    created_at: "2026-10-05T12:00:00Z",
    world: "Nerath",
    story: "Nerath's Secret",
    answers: answersFrom([
      ["star_type", "No true daylight — they live by other light"],
      ["gravity", "About the same"],
      ["atmosphere", "Thick and toxic to most life"],
      ["terrain", "Ocean, almost entirely"],
      ["size", "Large — twice human height or more"],
      ["symmetry", "Radial — symmetrical around a center point"],
      ["limbs", "Eight or more"],
      ["locomotion", "Swimming"],
      ["manipulation", "Tentacle-like appendages"],
      ["exterior", "Skin"],
      ["primary_sense", "Something electromagnetic — not one of our five senses"],
      ["temperament", "Curious — they investigate"],
      ["social_structure", "Large collective societies"],
      ["core_value", "Survival — continuance of the group"],
      ["tech_basis", "Biological — grown and cultivated, not built"],
      ["tech_level", "Roughly comparable to modern Earth"],
    ]),
    stats: {
      strength: 20, endurance: 25, agility: 35, durability: 20,
      problem_solving: 30, memory: 15, social: 25, adaptability: 30,
      sensory: 25, specialization: 25,
      longevity: 25, reproduction: 25,
    },
    review: {
      verdict: "granted",
      text: "Each Nerathi is seventeen minds: one at the center and sixteen in its limbs, any of which can disagree and act. We expected that to be a weakness. On Nerath it is how a city is kept alive. The center does not silence its limbs; it learns from them, and they from it.",
      learned: "We do not know what a Nerathi feels when part of itself is right and the rest of it is wrong. We suspect it is something we feel too, and have no word for.",
    },
    portrait_svg: nerathiPortrait(true),
    portrait_line_svg: nerathiPortrait(false),
  },
  514229: {
    id: "archive-514229",
    archive: true,
    cardLabel: "No. 0514229",
    href: "/assignments/514229",
    hrefLabel: "the story →",
    name: "The Returners",
    created_at: "2026-10-05T12:00:00Z",
    world: "Dacapo",
    story: "The Sea of Glass",
    answers: answersFrom([
      ["star_type", "A binary system with two suns"],
      ["gravity", "About the same"],
      ["atmosphere", "Thin, hard to breathe for us"],
      ["terrain", "Desert and rock"],
      ["size", "Large — twice human height or more"],
      ["symmetry", "Radial — symmetrical around a center point"],
      ["limbs", "Three — long legs meeting beneath the body"],
      ["locomotion", "Walking or running"],
      ["manipulation", "No manipulating limbs — they don't build or hold things"],
      ["exterior", "Layers of living glass, one grown each year"],
      ["primary_sense", "Sight"],
      ["temperament", "Curious — they investigate"],
      ["social_structure", "Large collective societies"],
      ["core_value", "Harmony — balance with their environment"],
      ["tech_basis", "None — they have no technology as we'd recognize it"],
      ["tech_level", "Primitive by our standards"],
    ]),
    stats: {
      strength: 10, endurance: 35, agility: 15, durability: 40,
      problem_solving: 15, memory: 40, social: 35, adaptability: 10,
      sensory: 35, specialization: 15,
      longevity: 35, reproduction: 15,
    },
    review: {
      verdict: "granted",
      text: "The returners remember everything, perfectly, in glass, and once in every generation they set it down: all but one year each, and by custom it is the year someone was kind to them. They learned this from a war that never ended because no one could forget it. They have not fought since.",
      learned: "We do not know how they decide which memories must stay. They have left their oldest wrongs standing in a canyon, unread, as the one thing all of them remember. We are still learning what that asks of a keeper like us.",
    },
    portrait_svg: returnerPortrait(true),
    portrait_line_svg: returnerPortrait(false),
  },
  832040: {
    id: "archive-832040",
    archive: true,
    cardLabel: "No. 0832040",
    href: "/assignments/832040",
    hrefLabel: "the story →",
    name: "The Velani",
    created_at: "2026-10-05T13:00:00Z",
    world: "Ammet",
    story: "The Borrowed Seconds",
    answers: answersFrom([
      ["star_type", "A single yellow star, like ours"],
      ["gravity", "About the same"],
      ["atmosphere", "Earth-like, breathable"],
      ["terrain", "Ocean, almost entirely"],
      ["size", "Large — twice human height or more"],
      ["symmetry", "Bilateral, like us — a left and right side"],
      ["limbs", "Four"],
      ["locomotion", "Walking or running"],
      ["manipulation", "Hands with six long fingers"],
      ["exterior", "Skin"],
      ["primary_sense", "Sight"],
      ["temperament", "Cautious — they observe from a distance first"],
      ["social_structure", "Large collective societies"],
      ["core_value", "Survival — continuance of the group"],
      ["tech_basis", "Mechanical — built structures and machines"],
      ["tech_level", "Roughly comparable to modern Earth"],
    ]),
    stats: {
      strength: 20, endurance: 25, agility: 25, durability: 30,
      problem_solving: 35, memory: 20, social: 25, adaptability: 20,
      sensory: 25, specialization: 25,
      longevity: 35, reproduction: 15,
    },
    review: {
      verdict: "observation",
      text: "The Velani nearly ended themselves once, and built a mind to keep it from happening again. For sixty-one years it has softened their anger before it reaches each other, and they did not know. Their cooperation is real, and it has been growing. How much of it is theirs, we cannot yet measure.",
      learned: "We came to know them through the mind they built to understand themselves. We expect to meet more species this way: old enough to build such a mind, young enough to need one.",
    },
    portrait_svg: velaniPortrait(true),
    portrait_line_svg: velaniPortrait(false),
  },
};
