import Link from "next/link";
import GalaxyExplorer from "../../../../components/GalaxyExplorer";

export const metadata = {
  title: "Galaxy Facts",
  description: "Zoom out from you to the whole universe, ride a light beam, count the stars, and watch the Milky Way collide with Andromeda.",
};

// The Milky Way, hands-on: eight interactive stations with "go deeper"
// drawers (components/GalaxyExplorer.js).
export default function GalaxyFactsPage() {
  return (
    <div>
      <Link href="/galaxy" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to The Galaxy
      </Link>
      <div className="page-title" style={{ marginTop: 20 }}>Galaxy Facts</div>
      <div className="page-subtitle">touch everything &middot; go deeper on anything</div>
      <GalaxyExplorer />
    </div>
  );
}
