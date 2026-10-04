import Link from "next/link";
import ListeningWell from "../../../../components/ListeningWell";

export const metadata = { title: "The Listening Well" };

export default function ListeningWellPage() {
  return (
    <div className="art-page" style={{ maxWidth: 1000 }}>
      <Link href="/artifacts" className="mono art-back">&larr; Artifacts</Link>
      <div className="mono art-kicker">artifact &middot; a translation device</div>
      <h1 className="art-title">The Listening Well</h1>
      <p className="art-lede">13i&rsquo;s makers don&rsquo;t hear sound. They feel gravity. This is how 13i translates the pull of things into something you can hear. Put a few worlds in orbit and listen.</p>
      <ListeningWell />
    </div>
  );
}
