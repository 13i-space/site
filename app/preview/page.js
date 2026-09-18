import Link from "next/link";

const LOOKS = [
  {
    n: "\u2014",
    name: "Signal",
    href: "/launch",
    desc: "The current live look: starfield background with expanding ripples from the logo's eye. Currently active site-wide.",
    live: true,
  },
  {
    n: "1",
    name: "Constellation",
    href: "/preview1",
    desc: "A drifting network of connected points, with slow orbital rings around the logo.",
  },
  {
    n: "2",
    name: "Cockpit",
    href: "/preview2",
    desc: "A spacecraft control panel \u2014 brushed metal, HUD readout lines, a scanline sweep across the logo viewport.",
  },
  {
    n: "3",
    name: "Radar",
    href: "/preview3",
    desc: "A rotating radar sweep with fading blips, echoing NEMESIS's radar-only perception.",
  },
  {
    n: "4",
    name: "Fibonacci",
    href: "/preview4",
    desc: "A golden-angle spiral of drifting points, tying into the book's Fibonacci Signal.",
  },
  {
    n: "5",
    name: "Hubble",
    href: "/preview5",
    desc: "A painterly deep-space nebula field with layered color clouds and bright spiked stars.",
  },
  {
    n: "6",
    name: "Jet",
    href: "/preview6",
    desc: "The inside of a fighter cockpit \u2014 canopy HUD reticle, and each content box its own instrument panel (radar, comms, switches, gauge).",
  },
];

export default function PreviewIndex() {
  return (
    <div style={{ minHeight: "100vh", background: "#05060f", padding: "48px 32px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 22, color: "#DCDFFF" }}>
            13i
          </span>
          <Link href="/launch" className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "0.5px" }}>
            &larr; back to the live site
          </Link>
        </div>

        <div className="mono" style={{ fontSize: 11, color: "#6E76B8", letterSpacing: "1px", marginBottom: 8 }}>
          LOOK LAB
        </div>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 32, color: "#DCDFFF", marginTop: 0, marginBottom: 30 }}>
          Every look, so far
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {LOOKS.map((look) => (
            <Link
              key={look.href}
              href={look.href}
              style={{
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
                background: "rgba(14,16,38,0.55)",
                border: `1px solid ${look.live ? "#8B95F6" : "#262A55"}`,
                borderRadius: 4,
                padding: "16px 18px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="mono" style={{ fontSize: 13, color: "#565B8F", minWidth: 22, paddingTop: 2 }}>
                {look.n}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 18, color: "#DCDFFF" }}>
                    {look.name}
                  </span>
                  {look.live && (
                    <span className="mono" style={{ fontSize: 9, color: "#8B95F6", letterSpacing: "1px", border: "1px solid #8B95F6", borderRadius: 3, padding: "1px 6px" }}>
                      LIVE NOW
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: "4px 0 0" }}>{look.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mono" style={{ fontSize: 11, color: "#3A3E75", marginTop: 30 }}>
          switching the live site's look is a one-line change in lib/theme.js
        </p>
      </div>
    </div>
  );
}
