import Link from "next/link";
import BlackHoleField from "../../components/BlackHoleField";

// The black hole is the centerpiece: shadow as pupil, photon ring as iris,
// the accretion disk as lids - the ring-eye mark, writ large. It sits at a
// fixed spot in the viewport while the page content scrolls over it.
const ORIGIN_X = 0.5; // viewport-relative
const ORIGIN_Y = 0.3;
// Mirrors blackHoleRadius() in components/BlackHoleField.js - keep in sync.
const HOLE_R = "max(26px, min(12vw, 12vh))";

const MODES = [
  { label: "Explore", href: "/explore" },
  { label: "Play", href: "/play" },
  { label: "Create", href: "/create" },
  { label: "Kinship", href: "/kinship" },
];

export default function Preview7BlackHole() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#020208" }}>
      <BlackHoleField originXPct={ORIGIN_X} originYPct={ORIGIN_Y} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1000, margin: "0 auto", padding: "24px 32px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF" }}>
            13i
          </span>
          <Link href="/preview" className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "0.5px" }}>
            &larr; all looks
          </Link>
        </div>

        {/* clear the hole: its center, plus the lensed halo below it */}
        <div style={{ height: `calc(${ORIGIN_Y * 100}vh + 2.1 * ${HOLE_R} - 70px)` }} />

        <div style={{ textAlign: "center" }}>
          <img
            src="/13i-logo.png"
            alt="13i"
            style={{ width: "min(280px, 70vw)", height: "auto", display: "block", margin: "0 auto", filter: "drop-shadow(0 0 16px rgba(0,0,0,0.9))" }}
          />
          <div className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "1px", margin: "28px 0 14px" }}>
            LOOK PREVIEW &mdash; BLACK HOLE
          </div>
          <div className="mono" style={{ fontSize: 13, color: "#E8CFC0", letterSpacing: "2px", marginBottom: 16 }}>
            everything bends toward the eye
          </div>
          <p style={{ color: "#B7BADF", maxWidth: 500, margin: "0 auto 32px" }}>
            Light, time, attention: nothing passes close without being changed.
            We perceive the universe through gravity. This is where it is loudest.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            {MODES.map((m) => (
              <Link
                key={m.label}
                href={m.href}
                className="mono"
                style={{
                  border: "1px solid #3A2E3A", borderRadius: 4, padding: "8px 18px",
                  fontSize: 12, color: "#E8CFC0", letterSpacing: "1px",
                  background: "rgba(2,2,8,0.6)", textDecoration: "none",
                }}
              >
                {m.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
