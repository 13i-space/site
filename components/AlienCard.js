import { cardTraits, cardTagline, cardNumber } from "../lib/alienTraits";

// A collectible card for one Alien Lab species: name bar, portrait window,
// a line of flavour, the traits, and the creator + date along the bottom.
// Presentational only (no hooks) - used by the gallery, the Node, and the
// homepage star easter egg.
export default function AlienCard({ species, creator, width = 280 }) {
  const traits = cardTraits(species.answers);
  const tagline = cardTagline(species.answers);
  const date = species.created_at
    ? new Date(species.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";
  const s = width / 280; // everything scales with the card's width

  return (
    <div
      style={{
        width,
        aspectRatio: "63 / 88",
        padding: 7 * s,
        borderRadius: 14 * s,
        background: "linear-gradient(145deg, #C9B98F 0%, #6B5E3E 35%, #8B95F6 70%, #C9B98F 100%)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
        boxSizing: "border-box",
        height: (width * 88) / 63, // explicit, so no parent layout can stretch the card
        alignSelf: "flex-start",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 9 * s,
          background: "linear-gradient(180deg, #14163A 0%, #0A0B1C 100%)",
          padding: `${9 * s}px ${10 * s}px ${8 * s}px`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* name bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6 * s }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 18 * s, color: "#DCDFFF", lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {species.name || "Unnamed species"}
          </span>
          <span className="mono" style={{ fontSize: 8.5 * s, color: "#C9B98F", letterSpacing: "1px", flexShrink: 0 }}>
            {cardNumber(species.id)}
          </span>
        </div>

        {/* portrait window */}
        <div
          style={{
            marginTop: 6 * s,
            aspectRatio: "16 / 11",
            position: "relative", // the image is positioned inside, so it can't stretch the window
            borderRadius: 4 * s,
            border: `${2 * s}px solid #C9B98F`,
            overflow: "hidden",
            background: "#0A0B1C",
            flexShrink: 0,
          }}
        >
          {species.portrait_svg ? (
            <img
              src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(species.portrait_svg)}`}
              alt={`Portrait of ${species.name}`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="mono" style={{ fontSize: 9 * s, color: "#3A3E75", letterSpacing: "1px" }}>NO PORTRAIT YET</span>
            </div>
          )}
        </div>

        {/* flavour strip */}
        {tagline && (
          <div style={{ margin: `${6 * s}px 0 ${4 * s}px`, padding: `${3 * s}px ${6 * s}px`, background: "rgba(201,185,143,0.12)", borderRadius: 3 * s, fontSize: 10 * s, color: "#E8CFC0", fontStyle: "italic", lineHeight: 1.35 }}>
            {tagline}
          </div>
        )}

        {/* traits */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          {traits.map((t) => (
            <div key={t.label} style={{ display: "flex", justifyContent: "space-between", gap: 8 * s, fontSize: 10.5 * s, lineHeight: 1.25, padding: `${2.5 * s}px 0`, borderBottom: "1px solid rgba(38,42,85,0.7)" }}>
              <span className="mono" style={{ color: "#6E76B8", fontSize: 9 * s, letterSpacing: "0.5px", flexShrink: 0 }}>{t.label.toUpperCase()}</span>
              <span style={{ color: "#D9DCFF", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.value}</span>
            </div>
          ))}
        </div>

        {/* creator + date */}
        <div className="mono" style={{ display: "flex", justifyContent: "space-between", gap: 6 * s, marginTop: 6 * s, paddingTop: 5 * s, borderTop: "1px solid #3A3E75", fontSize: 8.5 * s, color: "#8A8FBF" }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>by {creator || "a Kin"}</span>
          <span style={{ flexShrink: 0 }}>{date}</span>
        </div>
      </div>
    </div>
  );
}
