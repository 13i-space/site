import Link from "next/link";
import GalaxyMap from "../../../../components/GalaxyMap";

export default function GalaxyMapPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Link href="/galaxy" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to The Galaxy
      </Link>
      <div className="page-title" style={{ marginTop: 20 }}>The Galaxy Map</div>
      <div className="page-subtitle">a simplified model &middot; not astronomically exact</div>

      <GalaxyMap />
    </div>
  );
}
