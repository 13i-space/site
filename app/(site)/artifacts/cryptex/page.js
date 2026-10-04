import Link from "next/link";
import Cryptex from "../../../../components/Cryptex";

export const metadata = { title: "The Cryptex" };

export default function CryptexPage() {
  return (
    <div className="art-page">
      <Link href="/artifacts" className="mono art-back">&larr; Artifacts</Link>
      <div className="mono art-kicker">artifact &middot; recovered sealed</div>
      <h1 className="art-title">The Cryptex</h1>
      <p className="art-lede">Nine marks. Three drums. One order the mechanism accepts. It was sealed by someone who expected to be understood.</p>
      <Cryptex />
    </div>
  );
}
