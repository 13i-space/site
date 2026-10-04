import Link from "next/link";
import WishEngine from "../../../../components/WishEngine";

export const metadata = { title: "The Wish Engine" };

export default function WishEnginePage() {
  return (
    <div className="art-page">
      <Link href="/artifacts" className="mono art-back">&larr; Artifacts</Link>
      <div className="mono art-kicker">artifact &middot; recovered still running</div>
      <h1 className="art-title">The Wish Engine</h1>
      <p className="art-lede">A fortune cabinet found drifting, still lit, with someone inside it. Its name is Varrow. Ask it anything. Make a wish if you like.</p>
      <WishEngine />
    </div>
  );
}
