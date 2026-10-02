import Link from "next/link";
import SpaceCoreGame from "../../../../components/SpaceCoreGame";

export const metadata = {
  title: "SpaceCore",
  description: "Mission One: Mars. One world, dug and built by every Kin together.",
};

// SpaceCore: the shared, ever-expanding building game. It lives in Create
// (not Games) because what you do here is build. See docs/SPACECORE.md.
export default function SpaceCorePage() {
  return (
    <div>
      <Link href="/create" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to Create
      </Link>
      <div className="page-title" style={{ marginTop: 14 }}>SpaceCore</div>
      <div className="page-subtitle">mission one: mars &middot; one world, built by every Kin &middot; alpha</div>
      <SpaceCoreGame />
    </div>
  );
}
