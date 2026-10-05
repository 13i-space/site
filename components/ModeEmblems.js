// The emblems for every place inside Explore, Play, Create and Kinship
// (Update 5.55). One family: each is line art in a 64x64 box, drawn with
// the mode's colour (`currentColor`) and one gold accent, inside the same
// ringed badge (components/ModeLanding.js draws the badge). Keep new ones
// to the same rules: 1.6 stroke, round caps, one gold detail, no fills
// heavier than 0.18 opacity.

const GOLD = "#E9D29A";
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const gold = { ...line, stroke: GOLD };
const wash = { fill: "currentColor", opacity: 0.14 };

export const EMBLEMS = {
  // ─── Explore ───
  book: (
    <>
      <path d="M8 20 Q20 15 32 21 Q44 15 56 20 V48 Q44 43 32 49 Q20 43 8 48 Z" {...wash} />
      <path d="M8 20 Q20 15 32 21 Q44 15 56 20 V48 Q44 43 32 49 Q20 43 8 48 Z" {...line} />
      <path d="M32 21 V49" {...line} />
      <path d="M13 26 Q20 23 27 26 M13 31 Q20 28 27 31 M37 26 Q44 23 51 26 M37 31 Q44 28 51 31" {...line} strokeWidth="1" opacity="0.6" />
      <circle cx="32" cy="10" r="4.5" {...gold} />
      <circle cx="32" cy="10" r="1.4" fill={GOLD} />
      <path d="M32 14.5 V18" {...gold} />
    </>
  ),
  music: (
    <>
      <circle cx="32" cy="32" r="22" {...wash} />
      <circle cx="32" cy="32" r="22" {...line} />
      <circle cx="32" cy="32" r="15" {...line} strokeWidth="0.8" opacity="0.5" />
      <circle cx="32" cy="32" r="9" {...line} strokeWidth="0.8" opacity="0.5" />
      <circle cx="32" cy="32" r="3" fill={GOLD} />
      <path d="M2 32 h6 l3 -8 l4 16 l4 -12 l3 4 h2" {...gold} />
    </>
  ),
  stories: (
    <>
      <path d="M16 8 H42 L50 16 V56 H16 Z" {...wash} />
      <path d="M16 8 H42 L50 16 V56 H16 Z" {...line} />
      <path d="M42 8 V16 H50" {...line} />
      <path d="M22 26 H44 M22 32 H44 M22 38 H38" {...line} strokeWidth="1" opacity="0.6" />
      <circle cx="26" cy="47" r="4" {...gold} />
      <circle cx="26" cy="47" r="1.2" fill={GOLD} />
      <path d="M26 51 V54" {...gold} />
      <path d="M34 47 H44" {...line} strokeWidth="1" opacity="0.6" />
    </>
  ),
  galaxy: (
    <>
      <circle cx="32" cy="32" r="13" {...wash} />
      <path d="M32 32 C37 25 47 25 50 32 C53 41 43 50 31 49 C22 48 15 42 13 35" {...line} />
      <path d="M32 32 C27 39 17 39 14 32 C11 23 21 14 33 15 C42 16 49 22 51 29" {...line} />
      <ellipse cx="32" cy="32" rx="27" ry="27" {...line} strokeWidth="0.8" strokeDasharray="1 4" opacity="0.6" />
      <circle cx="32" cy="32" r="3.2" fill={GOLD} />
      <circle cx="45" cy="40" r="1.6" fill={GOLD} />
    </>
  ),
  // ─── Play ───
  oracle: (
    <>
      <path d="M6 32 Q32 10 58 32 Q32 54 6 32 Z" {...wash} />
      <path d="M6 32 Q32 10 58 32 Q32 54 6 32 Z" {...line} />
      <circle cx="32" cy="32" r="10" {...gold} />
      <circle cx="32" cy="32" r="4.5" fill="currentColor" />
      <circle cx="29.5" cy="29.5" r="1.4" fill="#fff" />
      <path d="M32 6 V12 M12 12 L16 16 M52 12 L48 16" {...line} strokeWidth="1.2" opacity="0.7" />
    </>
  ),
  games: (
    <>
      <path d="M12 24 Q10 22 14 20 H50 Q54 22 52 24 L56 42 Q57 50 50 48 L42 40 H22 L14 48 Q7 50 8 42 Z" {...wash} />
      <path d="M12 24 Q10 22 14 20 H50 Q54 22 52 24 L56 42 Q57 50 50 48 L42 40 H22 L14 48 Q7 50 8 42 Z" {...line} />
      <path d="M20 26 V34 M16 30 H24" {...line} />
      <circle cx="42" cy="27" r="2.2" {...gold} />
      <circle cx="47" cy="32" r="2.2" {...line} />
      <path d="M28 14 L32 10 L36 14" {...gold} />
    </>
  ),
  interactive: (
    <>
      <circle cx="32" cy="50" r="5" {...wash} />
      <circle cx="32" cy="50" r="5" {...line} />
      <path d="M32 45 V36 M32 36 L18 24 M32 36 L46 24 M32 36 V22" {...line} />
      <circle cx="18" cy="20" r="4" {...line} />
      <circle cx="32" cy="18" r="4" {...gold} />
      <circle cx="46" cy="20" r="4" {...line} />
      <path d="M18 16 V10 M46 16 V10" {...line} strokeWidth="1" opacity="0.5" />
    </>
  ),
  artifacts: (
    <>
      <rect x="10" y="22" width="44" height="20" rx="4" {...wash} />
      <rect x="10" y="22" width="44" height="20" rx="4" {...line} />
      <path d="M21 22 V42 M32 22 V42 M43 22 V42" {...line} strokeWidth="1" />
      <path d="M14 30 h3 M25 34 h3 M36 30 h3 M47 34 h3" {...gold} />
      <path d="M6 32 H10 M54 32 H58" {...line} />
      <path d="M32 10 L36 16 H28 Z M32 54 L36 48 H28 Z" {...line} strokeWidth="1.2" />
    </>
  ),
  // ─── Create ───
  spacecore: (
    <>
      <path d="M6 52 Q32 42 58 52 V58 H6 Z" {...wash} />
      <path d="M6 52 Q32 42 58 52" {...line} />
      <path d="M32 8 C38 16 39 28 38 42 H26 C25 28 26 16 32 8 Z" {...line} />
      <circle cx="32" cy="24" r="3.4" {...gold} />
      <path d="M26 34 L20 44 L26 42 M38 34 L44 44 L38 42" {...line} />
      <path d="M29 42 Q32 52 35 42" {...gold} />
    </>
  ),
  alienlab: (
    <>
      <path d="M24 8 H40 M27 8 V24 L12 50 Q10 56 16 56 H48 Q54 56 52 50 L37 24 V8" {...line} />
      <path d="M17 44 H47 L51 52 Q52 54 48 54 H16 Q12 54 13 52 Z" {...wash} />
      <ellipse cx="32" cy="42" rx="6" ry="7" {...gold} />
      <ellipse cx="29.6" cy="41" rx="1.4" ry="2" fill={GOLD} />
      <ellipse cx="34.4" cy="41" rx="1.4" ry="2" fill={GOLD} />
      <path d="M28 35 Q27 31 25 30 M36 35 Q37 31 39 30" {...gold} strokeWidth="1.2" />
    </>
  ),
  composer: (
    <>
      <rect x="8" y="14" width="48" height="36" rx="5" {...wash} />
      <rect x="8" y="14" width="48" height="36" rx="5" {...line} />
      <path d="M12 30 Q17 20 22 30 T32 30 T42 30 T52 30" {...gold} />
      <circle cx="18" cy="42" r="3" {...line} />
      <circle cx="32" cy="42" r="3" {...line} />
      <circle cx="46" cy="42" r="3" {...line} />
      <path d="M18 42 L19.5 40.2 M32 42 L30.5 39.6 M46 42 L47.8 40.8" {...line} strokeWidth="1.2" />
    </>
  ),
  write: (
    <>
      <path d="M14 54 H50" {...line} opacity="0.5" />
      <path d="M48 8 C36 12 24 26 18 46 L22 47 C30 30 40 18 52 12 Z" {...wash} />
      <path d="M48 8 C36 12 24 26 18 46 L22 47 C30 30 40 18 52 12 Z" {...line} />
      <path d="M18 46 L16 52" {...line} />
      <circle cx="40" cy="44" r="4" {...gold} />
      <circle cx="40" cy="44" r="1.2" fill={GOLD} />
      <path d="M40 48 V52" {...gold} />
    </>
  ),
  // ─── Kinship ───
  forum: (
    <>
      <path d="M8 14 H38 Q42 14 42 18 V32 Q42 36 38 36 H20 L12 43 V36 H12 Q8 36 8 32 V18 Q8 14 12 14 Z" {...wash} />
      <path d="M8 14 H38 Q42 14 42 18 V32 Q42 36 38 36 H20 L12 43 V36 H12 Q8 36 8 32 V18 Q8 14 12 14 Z" {...line} />
      <path d="M46 24 H52 Q56 24 56 28 V42 Q56 46 52 46 V52 L44 46 H30 Q26 46 26 42 V40" {...gold} />
      <path d="M15 22 H35 M15 28 H29" {...line} strokeWidth="1" opacity="0.6" />
    </>
  ),
  kinbook: (
    <>
      <path d="M12 10 H48 Q52 10 52 14 V54 H16 Q12 54 12 50 Z" {...wash} />
      <path d="M12 10 H48 Q52 10 52 14 V54 H16 Q12 54 12 50 Z" {...line} />
      <path d="M12 50 Q12 46 16 46 H52" {...line} />
      <path d="M32 38 C24 32 22 28 24 24 C26 20 31 21 32 25 C33 21 38 20 40 24 C42 28 40 32 32 38 Z" {...gold} />
      <path d="M18 14 V46" {...line} strokeWidth="1" opacity="0.5" />
    </>
  ),
  messages: (
    <>
      <rect x="8" y="18" width="48" height="32" rx="4" {...wash} />
      <rect x="8" y="18" width="48" height="32" rx="4" {...line} />
      <path d="M8 22 L32 38 L56 22" {...line} />
      <ellipse cx="32" cy="34" rx="28" ry="9" {...gold} strokeWidth="1.1" opacity="0.8" transform="rotate(-14 32 34)" />
      <circle cx="56" cy="27" r="2" fill={GOLD} />
    </>
  ),
  // ─── The Galaxy (Update 5.59) ───
  blackhole: (
    <>
      <ellipse cx="32" cy="32" rx="27" ry="9" {...wash} />
      <ellipse cx="32" cy="32" rx="27" ry="9" {...gold} />
      <path d="M14 26 Q32 4 50 26" {...gold} strokeWidth="1.1" opacity="0.7" />
      <circle cx="32" cy="32" r="10" fill="#05040F" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 34 Q32 40 44 34" {...gold} strokeWidth="1" opacity="0.8" />
    </>
  ),
  map: (
    <>
      <circle cx="32" cy="32" r="24" {...wash} />
      <path d="M32 32 C38 24 50 25 52 33 C54 44 42 53 30 51 C20 49 13 42 12 34" {...line} />
      <path d="M32 32 C26 40 14 39 12 31 C10 20 22 11 34 13 C44 15 50 22 52 29" {...line} />
      <path d="M44 16 L50 10 L56 16" {...gold} strokeWidth="1.2" />
      <circle cx="44" cy="40" r="3" {...gold} />
      <circle cx="44" cy="40" r="1" fill={GOLD} />
      <path d="M44 43 V48" {...gold} />
    </>
  ),
  aliens: (
    <>
      <rect x="18" y="8" width="30" height="44" rx="4" {...line} opacity="0.5" transform="rotate(-10 33 30)" />
      <rect x="20" y="12" width="30" height="44" rx="4" {...wash} />
      <rect x="20" y="12" width="30" height="44" rx="4" {...line} />
      <path d="M35 20 C41 20 43 25 42.5 29 C42 34 39 37 35 37 C31 37 28 34 27.5 29 C27 25 29 20 35 20 Z" {...line} strokeWidth="1.3" />
      <path d="M31 28 L33.5 29 M39 28 L36.5 29" {...gold} strokeWidth="1.5" />
      <path d="M25 46 H45 M25 50 H38" {...line} strokeWidth="1" opacity="0.6" />
    </>
  ),
  quiz: (
    <>
      <circle cx="32" cy="32" r="22" {...wash} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a0 = (i / 10) * Math.PI * 2 - Math.PI / 2, a1 = a0 + 0.48;
        return <path key={i} d={`M${32 + Math.cos(a0) * 22} ${32 + Math.sin(a0) * 22} A22 22 0 0 1 ${32 + Math.cos(a1) * 22} ${32 + Math.sin(a1) * 22}`} {...(i < 6 ? gold : line)} strokeWidth="2.4" />;
      })}
      <path d="M27 26 Q27 21 32 21 Q37 21 37 26 Q37 30 32 31 V35" {...line} />
      <circle cx="32" cy="41" r="1.6" fill="currentColor" />
    </>
  ),
  facts: (
    <>
      <circle cx="32" cy="32" r="4" fill={GOLD} />
      <circle cx="32" cy="32" r="11" {...line} />
      <circle cx="32" cy="32" r="19" {...line} opacity="0.7" />
      <circle cx="32" cy="32" r="27" {...line} strokeDasharray="2 4" opacity="0.5" />
      <circle cx="43" cy="32" r="2.2" fill="currentColor" />
      <circle cx="18" cy="21" r="2" {...gold} />
    </>
  ),
  news: (
    <>
      <path d="M10 14 H48 V52 H14 Q10 52 10 48 Z" {...wash} />
      <path d="M10 14 H48 V52 H14 Q10 52 10 48 Z" {...line} />
      <path d="M48 22 H54 V48 Q54 52 50 52 H46" {...line} />
      <path d="M16 21 H42" {...gold} strokeWidth="2.6" />
      <rect x="16" y="28" width="11" height="10" {...line} strokeWidth="1" />
      <path d="M31 29 H42 M31 34 H42 M16 43 H42 M16 47 H36" {...line} strokeWidth="1" opacity="0.6" />
    </>
  ),
  // ─── Artifacts (Update 5.58) ───
  cryptex: (
    <>
      {/* a sealed cylinder with three drums */}
      <rect x="10" y="22" width="44" height="20" rx="4" {...wash} />
      <rect x="10" y="22" width="44" height="20" rx="4" {...line} />
      <path d="M4 26 Q4 22 8 22 H10 V42 H8 Q4 42 4 38 Z M60 26 Q60 22 56 22 H54 V42 H56 Q60 42 60 38 Z" {...line} />
      <path d="M24 22 V42 M40 22 V42" {...line} strokeWidth="1" opacity="0.6" />
      <path d="M14 32 L20 28 L20 36 Z" {...gold} strokeWidth="1.2" />
      <circle cx="32" cy="32" r="3.5" {...gold} />
      <path d="M44 28 H50 M44 36 H50" {...gold} strokeWidth="1.2" />
    </>
  ),
  wish: (
    <>
      {/* the fortune cabinet: a dome, a head inside, the orb */}
      <path d="M14 56 V24 Q14 8 32 8 Q50 8 50 24 V56 Z" {...wash} />
      <path d="M14 56 V24 Q14 8 32 8 Q50 8 50 24 V56 Z" {...line} />
      <path d="M32 14 C38 14 40 19 39.5 23 C39 28 36 31 32 31 C28 31 25 28 24.5 23 C24 19 26 14 32 14 Z" {...line} strokeWidth="1.2" />
      <path d="M28 22 L30.5 23 M36 22 L33.5 23" {...line} strokeWidth="1.4" />
      <circle cx="32" cy="40" r="5" {...gold} />
      <circle cx="32" cy="40" r="1.6" fill={GOLD} />
      <path d="M18 48 H46" {...line} strokeWidth="1" opacity="0.6" />
    </>
  ),
  well: (
    <>
      {/* a star, a bent grid, and one orbit */}
      <path d="M6 20 Q32 30 58 20 M6 32 Q32 46 58 32 M6 44 Q32 54 58 44" {...line} strokeWidth="1" opacity="0.55" />
      <path d="M20 8 Q24 32 20 56 M32 8 Q34 34 32 56 M44 8 Q40 32 44 56" {...line} strokeWidth="1" opacity="0.55" />
      <ellipse cx="32" cy="34" rx="20" ry="9" {...line} />
      <circle cx="32" cy="34" r="4" fill={GOLD} />
      <circle cx="51" cy="31" r="2.4" {...gold} />
    </>
  ),
  // ─── About (Update 5.57) ───
  paul: (
    <>
      {/* a rough silhouette: head and shoulders, headphones on - he writes the music */}
      <path d="M12 56 Q13 42 24 39 Q28 44 32 44 Q36 44 40 39 Q51 42 52 56 Z" {...wash} />
      <path d="M12 56 Q13 42 24 39 Q28 44 32 44 Q36 44 40 39 Q51 42 52 56" {...line} />
      <ellipse cx="32" cy="26" rx="9.5" ry="11" {...wash} />
      <ellipse cx="32" cy="26" rx="9.5" ry="11" {...line} />
      <path d="M20 27 Q20 11 32 11 Q44 11 44 27" {...gold} />
      <rect x="18" y="25" width="4" height="8" rx="2" {...gold} />
      <rect x="42" y="25" width="4" height="8" rx="2" {...gold} />
    </>
  ),
  origin: (
    <>
      {/* where it began: a song or two, a spark of curiosity */}
      <circle cx="32" cy="34" r="20" {...wash} />
      <path d="M8 40 Q14 28 20 40 T32 40 T44 40 T56 40" {...line} />
      <path d="M8 46 Q14 38 20 46 T32 46 T44 46 T56 46" {...line} strokeWidth="1" opacity="0.5" />
      <path d="M32 8 V16 M32 22 V30 M18 15 L23 20 M46 15 L41 20" {...gold} />
      <circle cx="32" cy="19" r="2.4" fill={GOLD} />
    </>
  ),
  mission: (
    <>
      {/* a compass with three points: Explore, Play, Create */}
      <circle cx="32" cy="32" r="22" {...wash} />
      <circle cx="32" cy="32" r="22" {...line} />
      <circle cx="32" cy="32" r="16" {...line} strokeWidth="0.8" strokeDasharray="1 3" opacity="0.6" />
      <path d="M32 12 L36 30 L32 34 L28 30 Z" {...gold} />
      <path d="M14.7 42 L31 33 L33 37 L17.5 45 Z M49.3 42 L33 33 L31 37 L46.5 45 Z" {...line} strokeWidth="1.2" />
      <circle cx="32" cy="33" r="2" fill={GOLD} />
    </>
  ),
  kin: (
    <>
      {/* the Kinship mark: the Kinbook's gold heart, held by a ring of Kin */}
      <circle cx="32" cy="32" r="22" {...wash} />
      <circle cx="32" cy="32" r="22" {...line} strokeWidth="1" opacity="0.6" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={32 + 22 * Math.sin((a * Math.PI) / 180)} cy={32 - 22 * Math.cos((a * Math.PI) / 180)} r="3.2" {...line} fill="#0b0c22" />
      ))}
      <path d="M32 42 C23 35 21 30 23.5 26 C26 22 31 23 32 27.5 C33 23 38 22 40.5 26 C43 30 41 35 32 42 Z" {...gold} />
    </>
  ),
};

export function Emblem({ name, size = 64, color = "#B9C0FF" }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ color, overflow: "visible" }} aria-hidden="true">
      {EMBLEMS[name] || null}
    </svg>
  );
}
