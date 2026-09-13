const facts = [
  { label: "Type", value: "Barred spiral galaxy" },
  { label: "Diameter", value: "About 100,000 light-years across" },
  { label: "Number of stars", value: "An estimated 100–400 billion" },
  { label: "Age", value: "About 13.6 billion years old" },
  { label: "Our sun's distance from the center", value: "About 26,000 light-years" },
  { label: "Spiral arms", value: "Two major arms, plus several smaller arms and spurs — Earth sits in one of the minor ones, the Orion Arm" },
  { label: "One trip around", value: "The sun takes roughly 225–250 million years to complete one orbit of the galactic center — sometimes called a \"galactic year\"" },
  { label: "At the center", value: "A supermassive black hole, Sagittarius A*, with a mass around 4 million times the sun's" },
  { label: "Neighbors", value: "Part of the Local Group, alongside the Andromeda Galaxy and about 80 smaller galaxies" },
  { label: "Long-term forecast", value: "Predicted to collide with the Andromeda Galaxy in roughly 4–4.5 billion years" },
];

export default function GalaxyFactsPage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div className="page-title">Galaxy Facts</div>
      <div className="page-subtitle">the basics, for scale</div>

      <div className="panel" style={{ padding: 0 }}>
        {facts.map((f, i) => (
          <div
            key={f.label}
            style={{
              display: "flex",
              gap: 20,
              padding: "16px 20px",
              borderBottom: i < facts.length - 1 ? "1px solid #21244A" : "none",
              flexWrap: "wrap",
            }}
          >
            <div className="mono" style={{ fontSize: 11, color: "#6E76B8", flex: "0 0 180px" }}>
              {f.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 14, color: "#D9DCFF", flex: 1, minWidth: 180 }}>
              {f.value}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "#565B8F", marginTop: 16, textAlign: "center" }}>
        Figures are commonly cited estimates — exact numbers are genuinely
        hard to measure from inside the galaxy we're trying to measure.
      </p>
    </div>
  );
}
