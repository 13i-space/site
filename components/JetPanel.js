"use client";

export default function JetPanel({ variant, title, blurb }) {
  return (
    <div style={{ ...base.wrap, ...variantWrap[variant] }}>
      <style>{`
        @keyframes jetRadarSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes jetBlink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>

      {variant === "radar" && (
        <div style={deco.radarScope}>
          <div style={deco.radarRing1} />
          <div style={deco.radarRing2} />
          <div style={deco.radarSweep} />
        </div>
      )}

      {variant === "comms" && (
        <div style={deco.commsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} style={{ ...deco.commsBar, height: 4 + (i % 3) * 5 }} />
          ))}
        </div>
      )}

      {variant === "systems" && (
        <div style={deco.switchRow}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ ...deco.switchToggle, background: i % 2 === 0 ? "#8FE0A8" : "#3A3E75" }} />
          ))}
        </div>
      )}

      {variant === "gauge" && (
        <svg width="34" height="34" viewBox="0 0 34 34" style={deco.gaugeSvg}>
          <circle cx="17" cy="17" r="14" fill="none" stroke="#3A3E75" strokeWidth="1.4" />
          <circle cx="17" cy="17" r="14" fill="none" stroke="#E8CFC0" strokeWidth="1.4" strokeDasharray="60 100" strokeLinecap="round" transform="rotate(-90 17 17)" />
          <line x1="17" y1="17" x2="24" y2="11" stroke="#E8CFC0" strokeWidth="1.2" />
        </svg>
      )}

      <div className="mono" style={base.label}>{labelFor(variant)}</div>
      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 20, color: "#DCDFFF", marginBottom: 8 }}>
        {title}
      </div>
      <p style={{ fontSize: 13, color: "#8A8FBF", lineHeight: 1.6, margin: 0 }}>{blurb}</p>
    </div>
  );
}

function labelFor(variant) {
  return { radar: "NAV / SCOPE", comms: "COMMS", systems: "SYSTEMS", gauge: "STATUS" }[variant] || "";
}

const base = {
  wrap: {
    position: "relative",
    borderRadius: 6,
    padding: "20px 18px",
    overflow: "hidden",
  },
  label: {
    fontSize: 9,
    letterSpacing: "1.5px",
    color: "#6E76B8",
    marginBottom: 10,
  },
};

const variantWrap = {
  radar: {
    background: "linear-gradient(180deg, #0d1a10, #0a0d08)",
    border: "1px solid #2b4a30",
  },
  comms: {
    background: "linear-gradient(180deg, #1c1508, #120e08)",
    border: "1px solid #4a3a1a",
  },
  systems: {
    background: "linear-gradient(180deg, #14162a, #0c0e1c)",
    border: "1px solid #3A3E75",
  },
  gauge: {
    background: "linear-gradient(180deg, #1a1420, #100c16)",
    border: "1px solid #4a2f55",
  },
};

const deco = {
  radarScope: {
    position: "relative",
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "1px solid #2f5a38",
    marginBottom: 12,
    overflow: "hidden",
  },
  radarRing1: { position: "absolute", inset: 8, borderRadius: "50%", border: "1px solid rgba(143,224,168,0.35)" },
  radarRing2: { position: "absolute", inset: 15, borderRadius: "50%", border: "1px solid rgba(143,224,168,0.35)" },
  radarSweep: {
    position: "absolute",
    inset: 0,
    background: "conic-gradient(rgba(143,224,168,0.55), transparent 30%)",
    animation: "jetRadarSweep 3s linear infinite",
  },
  commsRow: { display: "flex", alignItems: "flex-end", gap: 3, height: 20, marginBottom: 12 },
  commsBar: { width: 4, background: "#E8B45E", borderRadius: 1 },
  switchRow: { display: "flex", gap: 8, marginBottom: 14 },
  switchToggle: { width: 14, height: 8, borderRadius: 2, animation: "jetBlink 2.6s ease-in-out infinite" },
  gaugeSvg: { marginBottom: 10 },
};
