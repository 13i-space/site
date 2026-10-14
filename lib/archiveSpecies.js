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

// A Kesh in a lattice station, backlit amber: compact, plated, four limbs,
// the gun's long barrel behind; the station's carved rule along the wall.
function keshPortrait(solid = true) {
  const lattice = Array.from({ length: 22 }, (_, i) => `<rect x="${(i * 53) % 300}" y="${8 + ((i * 37) % 70)}" width="2" height="2" fill="#E9A24A" opacity="0.8"/>`).join("");
  const plates = [0, 1, 2, 3].map((k) => `<path d="M${120 + k * 2} ${96 + k * 22} Q150 ${88 + k * 22} ${180 - k * 2} ${96 + k * 22}" fill="none" stroke="${solid ? "#F3C27A" : "#E9A24A"}" stroke-width="1.1" opacity="0.8"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
<defs><linearGradient id="kbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05040a"/><stop offset="1" stop-color="#2a1608"/></linearGradient>
<radialGradient id="kglow"><stop offset="0" stop-color="#E9A24A" stop-opacity="0.55"/><stop offset="1" stop-color="#E9A24A" stop-opacity="0"/></radialGradient></defs>
<rect width="300" height="220" fill="url(#kbg)"/>
${lattice}
<circle cx="40" cy="40" r="14" fill="#FFD98A" opacity="0.9"/>
<path d="M190 40 L300 28 L300 40 L196 52 Z" fill="#1a1008" stroke="#E9A24A" stroke-width="1"/>
<circle cx="150" cy="120" r="90" fill="url(#kglow)"/>
<path d="M150 58 q-22 0 -26 26 l-8 34 q-2 30 8 52 l4 50 h44 l4 -50 q10 -22 8 -52 l-8 -34 q-4 -26 -26 -26 z" fill="${solid ? "#5a3418" : "#140c06"}" stroke="#E9A24A" stroke-width="1.3"/>
${plates}
<path d="M122 110 L94 150 L100 176 M178 110 L206 150 L200 176" fill="none" stroke="${solid ? "#C9883C" : "#E9A24A"}" stroke-width="${solid ? 5 : 2}" stroke-linecap="round"/>
<path d="M100 176 l-6 8 M100 176 l2 9 M100 176 l8 5 M200 176 l6 8 M200 176 l-2 9 M200 176 l-8 5" stroke="#E9A24A" stroke-width="1.2"/>
<ellipse cx="141" cy="80" rx="4" ry="2.6" fill="#9FE3E0"/><ellipse cx="159" cy="80" rx="4" ry="2.6" fill="#9FE3E0"/>
<rect y="206" width="300" height="14" fill="#0a0604"/>
<path d="M14 214 h272" stroke="#E9A24A" stroke-width="0.6" stroke-dasharray="6 3 2 3" opacity="0.6"/>
</svg>`;
}

// A waker in its chamber in the softening ice: small, long, translucent,
// lit from inside, a dozen feathered limbs; the letter wall's light behind.
function wakerPortrait(solid = true) {
  const limbs = Array.from({ length: 6 }, (_, i) => [-1, 1].map((sd) => {
    const y = 78 + i * 18;
    return `<path d="M${150 + sd * 10} ${y} Q${150 + sd * 32} ${y - 8} ${150 + sd * 44} ${y + 6}" fill="none" stroke="${solid ? "#F6E3B4" : "#BFE6FF"}" stroke-width="1.2" opacity="0.85"/>` +
      Array.from({ length: 4 }, (_, k) => `<path d="M${150 + sd * (22 + k * 6)} ${y - 3 + k} l${sd * 3} -5" stroke="#F6E3B4" stroke-width="0.6" opacity="0.6"/>`).join("");
  }).join("")).join("");
  const wall = Array.from({ length: 12 }, (_, i) => `<rect x="${206 + ((i * 7) % 12)}" y="${30 + i * 13}" width="${30 + ((i * 17) % 40)}" height="2" fill="${i % 4 ? "#F6E3B4" : "#E8B4C8"}" opacity="${0.25 + (i / 12) * 0.5}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
<defs><linearGradient id="wbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1a2a"/><stop offset="1" stop-color="#1c3046"/></linearGradient>
<radialGradient id="wglow"><stop offset="0" stop-color="#F6E3B4" stop-opacity="0.6"/><stop offset="1" stop-color="#F6E3B4" stop-opacity="0"/></radialGradient></defs>
<rect width="300" height="220" fill="url(#wbg)"/>
<path d="M0 40 Q150 30 300 46 M0 90 Q150 100 300 84 M0 170 Q150 160 300 178" stroke="#BFE6FF" stroke-width="0.6" opacity="0.2" fill="none"/>
${wall}
<ellipse cx="150" cy="118" rx="64" ry="96" fill="none" stroke="#BFE6FF" stroke-width="1" opacity="0.35"/>
<circle cx="150" cy="118" r="80" fill="url(#wglow)"/>
${limbs}
<ellipse cx="150" cy="120" rx="14" ry="62" fill="${solid ? "rgba(246,240,225,0.55)" : "rgba(246,240,225,0.12)"}" stroke="#F6E3B4" stroke-width="1.2"/>
<circle cx="150" cy="74" r="3.2" fill="#FFF6DC"/>
</svg>`;
}

// A Pell on a branch in the Great Wood, its tail curled through colours,
// a flier and glowing moss behind; a loom-beast's back in the distance.
function pellPortrait(solid = true) {
  const cols = ["#F2C14E", "#E8A4C8", "#7FD6E8", "#9FE3B0", "#E9A24A", "#B9C0FF"];
  const tail = Array.from({ length: 16 }, (_, i) => {
    const u = i / 16, x = 118 - u * 70, y = 128 - Math.sin(u * 3.2) * 26 - u * 40;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(5.5 - u * 3).toFixed(1)}" fill="${cols[i % 6]}" opacity="${solid ? 0.95 : 0.7}"/>`;
  }).join("");
  const moss = Array.from({ length: 16 }, (_, i) => `<circle cx="${(i * 19) % 300}" cy="${196 + (i * 7) % 18}" r="2.4" fill="#9FE3B0" opacity="0.7"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
<defs><linearGradient id="pbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d5a46"/><stop offset="1" stop-color="#06100b"/></linearGradient></defs>
<rect width="300" height="220" fill="url(#pbg)"/>
<path d="M150 190 C160 120 280 110 300 170 L300 220 L150 220 Z" fill="#2a2622" opacity="0.8"/>
<ellipse cx="200" cy="128" rx="14" ry="10" fill="#2f6a4a"/><ellipse cx="236" cy="122" rx="16" ry="11" fill="#24533a"/><ellipse cx="268" cy="132" rx="14" ry="10" fill="#2f6a4a"/>
<path d="M40 40 L64 50 L88 40 L64 46 Z" fill="#8FD3E8" opacity="0.5"/>
${moss}
<path d="M0 150 Q140 140 280 152 L280 160 Q140 152 0 166 Z" fill="#2a1e14"/>
${tail}
<ellipse cx="150" cy="138" rx="34" ry="13" fill="${solid ? "#5a4636" : "#16100c"}" stroke="#E8CFC0" stroke-width="1.4"/>
<circle cx="190" cy="130" r="10" fill="${solid ? "#5a4636" : "#16100c"}" stroke="#E8CFC0" stroke-width="1.4"/>
<circle cx="194" cy="127" r="2.6" fill="#FFF4DC"/>
<path d="M130 148 l-4 10 M150 150 l0 10 M170 148 l4 10 M196 138 l8 10 M200 134 l10 4" stroke="#E8CFC0" stroke-width="1.6"/>
</svg>`;
}

// An Oduli under the night sky, looking up at the Ring beside the moon, a
// round temple with a hole in its roof behind.
function oduliPortrait(solid = true) {
  const stars = Array.from({ length: 40 }, (_, i) => `<rect x="${(i * 71) % 300}" y="${(i * 37) % 130}" width="1.2" height="1.2" fill="#EDEBFF" opacity="0.7"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
<defs><linearGradient id="obg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03040e"/><stop offset="1" stop-color="#1a2244"/></linearGradient></defs>
<rect width="300" height="220" fill="url(#obg)"/>
${stars}
<circle cx="70" cy="44" r="14" fill="#cfcabc"/>
<circle cx="226" cy="46" r="26" fill="none" stroke="#F3E6C8" stroke-width="2.4" opacity="0.85"/>
<circle cx="226" cy="46" r="40" fill="#F3E6C8" opacity="0.05"/>
<path d="M20 200 A50 50 0 0 1 120 200 Z" fill="#1a1c2c" stroke="#5a5e8a"/><circle cx="70" cy="153" r="6" fill="#03040e"/>
<rect y="200" width="300" height="20" fill="#06070f"/>
<g transform="translate(190 0)">
<ellipse cx="0" cy="82" rx="11" ry="14" transform="rotate(-18 0 82)" fill="${solid ? "#3a3e6a" : "#121534"}" stroke="#B9C0FF" stroke-width="1.3"/>
<circle cx="-5" cy="78" r="2.4" fill="#FFF4DC"/><circle cx="6" cy="76" r="2.4" fill="#FFF4DC"/>
<path d="M-8 98 L-16 220 L16 220 L8 98 Z" fill="${solid ? "#2c3058" : "#121534"}" stroke="#B9C0FF" stroke-width="1.3"/>
<path d="M8 110 Q28 90 34 62 M34 62 l2 -8 M34 62 l5 -6 M34 62 l6 -2" fill="none" stroke="#B9C0FF" stroke-width="${solid ? 2.4 : 1.4}"/>
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
  1346269: {
    id: "archive-1346269",
    archive: true,
    cardLabel: "No. 1346269",
    href: "/assignments/1346269",
    hrefLabel: "the story →",
    name: "The Kesh",
    created_at: "2026-10-12T12:00:00Z",
    world: "Sforzando",
    story: "First Fire",
    answers: answersFrom([
      ["star_type", "A single yellow star, like ours"],
      ["gravity", "About the same"],
      ["atmosphere", "Thin, hard to breathe for us"],
      ["terrain", "Desert and rock"],
      ["size", "About human-sized"],
      ["symmetry", "Bilateral, like us \u2014 a left and right side"],
      ["limbs", "Four"],
      ["locomotion", "Walking or running"],
      ["manipulation", "Fewer digits \u2014 two or three plus a thumb"],
      ["exterior", "A hard exoskeleton"],
      ["primary_sense", "Sight"],
      ["temperament", "Aggressive \u2014 they treat the unknown as a threat"],
      ["social_structure", "Large collective societies"],
      ["core_value", "Survival \u2014 continuance of the group"],
      ["tech_basis", "Mechanical \u2014 built structures and machines"],
      ["tech_level", "Advanced \u2014 spacefaring"],
    ]),
    stats: {
      strength: 25, endurance: 25, agility: 25, durability: 35,
      problem_solving: 40, memory: 30, social: 20, adaptability: 15,
      sensory: 35, specialization: 25,
      longevity: 10, reproduction: 15,
    },
    review: {
      verdict: "observation",
      text: "The Kesh fire first. Their history taught them that the one who waits is the one who is buried, and they built a mind, the Bastion, that never waits. They shot at us for eleven days. They did not stop until they had watched us, over and over, choose not to fire back.",
      learned: "We did not change their minds by argument. We were changed too: we learned what we looked like, long ago, from the other side of the gun. They do not trust us. They watch their star with us, and send back one word every few hours.",
    },
    portrait_svg: keshPortrait(true),
    portrait_line_svg: keshPortrait(false),
  },
  2178309: {
    id: "archive-2178309",
    archive: true,
    cardLabel: "No. 2178309",
    href: "/assignments/2178309",
    hrefLabel: "the story →",
    name: "The Wakers",
    created_at: "2026-10-12T13:00:00Z",
    world: "Fermata",
    story: "The Fermata",
    answers: answersFrom([
      ["star_type", "No true daylight \u2014 they live by other light"],
      ["gravity", "Noticeably lighter"],
      ["atmosphere", "No atmosphere at all"],
      ["terrain", "Ice and cold"],
      ["size", "Small \u2014 child-sized"],
      ["symmetry", "Bilateral, like us \u2014 a left and right side"],
      ["limbs", "Eight or more"],
      ["locomotion", "Floating or drifting"],
      ["manipulation", "Tentacle-like appendages"],
      ["exterior", "A soft, bioluminescent membrane"],
      ["primary_sense", "Vibration through a surface"],
      ["unique_sense", "A sense of time passing differently than we experience it"],
      ["temperament", "Cautious \u2014 they observe from a distance first"],
      ["social_structure", "Large collective societies"],
      ["core_value", "Harmony \u2014 balance with their environment"],
      ["tech_basis", "None \u2014 they have no technology as we'd recognize it"],
      ["tech_level", "Primitive by our standards"],
    ]),
    stats: {
      strength: 5, endurance: 45, agility: 10, durability: 45,
      problem_solving: 15, memory: 10, social: 40, adaptability: 25,
      sensory: 25, specialization: 25,
      longevity: 45, reproduction: 10,
    },
    review: {
      verdict: "observation",
      text: "The wakers live forty days in every 3,100 years, inside a comet, and remember nothing between. Each waking writes a letter to the next, and their law says no waking decides for the one after it. A wandering planet bent their path. At their request, we changed it only enough for one more waking.",
      learned: "We have promised one manifestation to return in 3,100 years, to a people who will not remember asking. Some decisions belong to people who have not yet woken.",
    },
    portrait_svg: wakerPortrait(true),
    portrait_line_svg: wakerPortrait(false),
  },
  3524578: {
    id: "archive-3524578",
    archive: true,
    cardLabel: "No. 3524578",
    href: "/assignments/3524578",
    hrefLabel: "the story →",
    name: "The Pell",
    created_at: "2026-10-14T12:00:00Z",
    world: "Tutti",
    story: "The Accord",
    answers: answersFrom([
      ["star_type", "A single yellow star, like ours"],
      ["gravity", "About the same"],
      ["atmosphere", "Earth-like, breathable"],
      ["terrain", "Dense forest or fungus"],
      ["size", "Insect-sized"],
      ["symmetry", "Bilateral, like us \u2014 a left and right side"],
      ["limbs", "Six"],
      ["locomotion", "Walking or running"],
      ["manipulation", "Fewer digits \u2014 two or three plus a thumb"],
      ["exterior", "Fur or hair"],
      ["primary_sense", "Sight"],
      ["temperament", "Curious \u2014 they investigate"],
      ["social_structure", "Large collective societies"],
      ["core_value", "Harmony \u2014 balance with their environment"],
      ["tech_basis", "Biological \u2014 grown and cultivated, not built"],
      ["tech_level", "Primitive by our standards"],
    ]),
    stats: {
      strength: 5, endurance: 25, agility: 40, durability: 10,
      problem_solving: 30, memory: 40, social: 55, adaptability: 35,
      sensory: 30, specialization: 10,
      longevity: 5, reproduction: 15,
    },
    review: {
      verdict: "granted",
      text: "The Pell are small and few on the fullest world we have recorded, and they run it not by mastering the other species but by agreement: two hundred of them, kept as a sung list called the Accord. They never drive a species out. They keep asking it until it answers, even when it takes a thousand years.",
      learned: "Their cooperation does not stop at the edge of their own kind. We are not certain it stops anywhere. We are in their Accord now, as a pause in the song: we give the long view, and take what we learn.",
    },
    portrait_svg: pellPortrait(true),
    portrait_line_svg: pellPortrait(false),
  },
  5702887: {
    id: "archive-5702887",
    archive: true,
    cardLabel: "No. 5702887",
    href: "/assignments/5702887",
    hrefLabel: "the story →",
    name: "The Oduli",
    created_at: "2026-10-14T13:00:00Z",
    world: "Ritornello",
    story: "The Ring",
    answers: answersFrom([
      ["star_type", "A single yellow star, like ours"],
      ["gravity", "About the same"],
      ["atmosphere", "Earth-like, breathable"],
      ["size", "About human-sized"],
      ["symmetry", "Bilateral, like us \u2014 a left and right side"],
      ["limbs", "Four"],
      ["locomotion", "Walking or running"],
      ["manipulation", "Hands with five fingers, like ours"],
      ["exterior", "Skin"],
      ["primary_sense", "Sight"],
      ["temperament", "Curious \u2014 they investigate"],
      ["social_structure", "Large collective societies"],
      ["core_value", "Harmony \u2014 balance with their environment"],
      ["tech_basis", "Mechanical \u2014 built structures and machines"],
      ["tech_level", "Roughly comparable to modern Earth"],
    ]),
    stats: {
      strength: 20, endurance: 25, agility: 20, durability: 20,
      problem_solving: 35, memory: 35, social: 35, adaptability: 25,
      sensory: 35, specialization: 15,
      longevity: 25, reproduction: 10,
    },
    review: {
      verdict: "observation",
      text: "The Oduli saw one of our manifestations once, eleven thousand years ago, and built a faith, a calendar and a great deal of kindness around it. The command at the heart of that faith was never ours. A goatherd named Ashet wrote it, and they have kept it for eleven thousand years.",
      learned: "Being watched can make a people kind. It cannot keep them kind that long. We have been asked to stay a while in their sky, where they can see us, so that they can get used to being seen.",
    },
    portrait_svg: oduliPortrait(true),
    portrait_line_svg: oduliPortrait(false),
  },
};
